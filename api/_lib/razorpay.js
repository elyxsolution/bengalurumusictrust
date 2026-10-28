'use strict';
// Shared helpers for the Razorpay donation endpoints (Vercel serverless functions).
// No third-party packages: Razorpay's REST API is called with fetch, signatures use node:crypto.
// The key secret never leaves this module's callers: it is not logged and never put in a response.

const crypto = require('node:crypto');

const API_BASE = 'https://api.razorpay.com/v1';
const CURRENCY = 'INR';
// Donation limits in whole rupees. Keep in sync with MIN_AMOUNT / MAX_AMOUNT in "Get Involved.dc.html".
const MIN_INR = 1;
const MAX_INR = 500000;
const REQUEST_TIMEOUT_MS = 10000;
const MAX_BODY_BYTES = 10 * 1024;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ORDER_ID_RE = /^order_[A-Za-z0-9]{8,40}$/;
const PAYMENT_ID_RE = /^pay_[A-Za-z0-9]{8,40}$/;
const SIGNATURE_RE = /^[0-9a-f]{64}$/;

// Reads and validates RAZORPAY_* settings. Defaults to test mode and never infers live mode from a key:
// a live key with RAZORPAY_MODE unset (or "test") is reported as a mismatch instead of being used.
function getConfig(env = process.env) {
  const problems = [];
  const mode = String(env.RAZORPAY_MODE || 'test').trim().toLowerCase();
  const keyId = String(env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = String(env.RAZORPAY_KEY_SECRET || '').trim();

  if (mode !== 'test' && mode !== 'live') problems.push('RAZORPAY_MODE must be "test" or "live"');
  if (!keyId) problems.push('RAZORPAY_KEY_ID is not set');
  else if (!/^rzp_(test|live)_[A-Za-z0-9]{8,}$/.test(keyId)) problems.push('RAZORPAY_KEY_ID is not a valid key id (expected rzp_test_... or rzp_live_...)');
  else if ((mode === 'test' || mode === 'live') && !keyId.startsWith('rzp_' + mode + '_')) problems.push('RAZORPAY_KEY_ID does not match RAZORPAY_MODE');
  if (!keySecret) problems.push('RAZORPAY_KEY_SECRET is not set');
  else if (!/^\S{12,}$/.test(keySecret)) problems.push('RAZORPAY_KEY_SECRET is malformed');

  if (problems.length) return { ok: false, problems };
  return { ok: true, mode, keyId, keySecret };
}

// "499", 499 or "499.50" -> integer paise, using integer arithmetic only (no floating point rupee maths).
function parseAmountToPaise(input) {
  let s;
  if (typeof input === 'number' && Number.isFinite(input)) s = String(input);
  else if (typeof input === 'string') s = input.trim();
  else return { ok: false, code: 'invalid_amount', message: 'Please enter a valid donation amount.' };
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(s)) return { ok: false, code: 'invalid_amount', message: 'Please enter a valid donation amount.' };
  const [rupees, fraction = ''] = s.split('.');
  const paise = parseInt(rupees, 10) * 100 + parseInt((fraction + '00').slice(0, 2), 10);
  if (paise < MIN_INR * 100) return { ok: false, code: 'amount_too_low', message: 'The minimum donation is ₹' + MIN_INR + '.' };
  if (paise > MAX_INR * 100) return { ok: false, code: 'amount_too_high', message: 'Online donations are limited to ₹' + MAX_INR.toLocaleString('en-IN') + '. Please contact the Trust for larger gifts.' };
  return { ok: true, paise };
}

function validateDonor(body) {
  const fields = {};
  const name = typeof body.name === 'string' ? body.name.replace(/\s+/g, ' ').trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const rawPhone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const phone = rawPhone.replace(/[\s().-]/g, '');

  if (!name) fields.name = 'Please enter your name.';
  else if (name.length > 100 || /[\u0000-\u001f\u007f]/.test(name)) fields.name = 'Please enter a valid name.';
  if (!email) fields.email = 'Please enter your email address.';
  else if (email.length > 254 || !EMAIL_RE.test(email)) fields.email = 'Please enter a valid email address.';
  if (rawPhone && !/^\+?\d{10,15}$/.test(phone)) fields.phone = 'Please enter a valid phone number, or leave it blank.';

  if (Object.keys(fields).length) return { ok: false, fields };
  return { ok: true, donor: { name, email, phone } };
}

// Order IDs, payment IDs and signatures are validated for shape before use.
function isOrderId(v) { return typeof v === 'string' && ORDER_ID_RE.test(v); }
function isPaymentId(v) { return typeof v === 'string' && PAYMENT_ID_RE.test(v); }
function isSignature(v) { return typeof v === 'string' && SIGNATURE_RE.test(v); }

// Razorpay Standard Checkout signature: hex HMAC-SHA256 of "<order_id>|<payment_id>" keyed with the key secret.
function signatureMatches(orderId, paymentId, signature, keySecret) {
  if (!isSignature(signature)) return false;
  const expected = crypto.createHmac('sha256', keySecret).update(orderId + '|' + paymentId).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(signature, 'hex'));
}

function newReceipt() {
  return 'bmt_' + Date.now().toString(36) + '_' + crypto.randomBytes(5).toString('hex');
}

// Authenticated call to the Razorpay REST API. Never throws: network failures come back as { status: 0 }.
async function razorpayRequest(config, method, path, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await globalThis.fetch(API_BASE + path, {
      method,
      headers: {
        Authorization: 'Basic ' + Buffer.from(config.keyId + ':' + config.keySecret).toString('base64'),
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: null };
  } finally {
    clearTimeout(timer);
  }
}

async function readJsonBody(req) {
  let raw = req.body;
  if (raw === undefined || raw === null) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) throw new Error('body too large');
      chunks.push(chunk);
    }
    raw = Buffer.concat(chunks).toString('utf8');
  }
  if (Buffer.isBuffer(raw)) raw = raw.toString('utf8');
  if (typeof raw === 'string') {
    if (raw.length > MAX_BODY_BYTES) throw new Error('body too large');
    raw = JSON.parse(raw);
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('body must be a JSON object');
  return raw;
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
}

// Method + content-type guard shared by the POST endpoints. Returns true when the request was rejected.
// Requiring application/json keeps cross-site form posts out, and with no CORS headers set, browsers
// from other origins cannot call these endpoints from scripts either.
function rejectUnlessJsonPost(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    sendJson(res, 405, { error: 'method_not_allowed', message: 'Method not allowed.' });
    return true;
  }
  if (!/^application\/json\b/i.test(String(req.headers && req.headers['content-type'] || ''))) {
    sendJson(res, 415, { error: 'unsupported_media_type', message: 'Content-Type must be application/json.' });
    return true;
  }
  return false;
}

// Operators need the names of the offending settings (never their values) in the Vercel function logs.
function logConfigProblems(problems) {
  console.error('[razorpay] configuration problem: ' + problems.join('; '));
}

module.exports = {
  CURRENCY, MIN_INR, MAX_INR,
  getConfig, parseAmountToPaise, validateDonor,
  isOrderId, isPaymentId, isSignature, signatureMatches,
  newReceipt, razorpayRequest, readJsonBody, sendJson, rejectUnlessJsonPost, logConfigProblems
};
