'use strict';
// Run with: node --test tests/*.test.js
// Exercises the donation endpoints against a stubbed Razorpay API using fake credentials.
// Nothing here talks to the real Razorpay, so it proves our logic, not an end-to-end payment.

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const lib = require('../api/_lib/razorpay');
const createOrder = require('../api/razorpay/create-order');
const verifyPayment = require('../api/razorpay/verify-payment');
const status = require('../api/razorpay/status');

const KEY_ID = 'rzp_test_AbCdEf123456';
const KEY_SECRET = 'fake_secret_for_unit_tests_only';
const ORDER_ID = 'order_TestOrder12345';
const PAYMENT_ID = 'pay_TestPayment12345';
const sign = (o, p, secret = KEY_SECRET) => crypto.createHmac('sha256', secret).update(o + '|' + p).digest('hex');

function setEnv(env) {
  for (const k of ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_MODE']) delete process.env[k];
  Object.assign(process.env, env);
}
const goodEnv = () => setEnv({ RAZORPAY_KEY_ID: KEY_ID, RAZORPAY_KEY_SECRET: KEY_SECRET, RAZORPAY_MODE: 'test' });

function call(handler, { method = 'POST', body, headers = { 'content-type': 'application/json' } } = {}) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 200, headers: {},
      setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
      end(text) { resolve({ status: this.statusCode, headers: this.headers, text, json: text ? JSON.parse(text) : null }); }
    };
    handler({ method, headers, body }, res);
  });
}

// Replaces global fetch with a recorder that answers from `reply(url, init)`.
function stubFetch(reply) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    const r = await reply(url, init);
    if (r instanceof Error) throw r;
    return { ok: r.status >= 200 && r.status < 300, status: r.status, json: async () => r.body };
  };
  return calls;
}
const realFetch = globalThis.fetch;
test.afterEach(() => { globalThis.fetch = realFetch; setEnv({}); });

const donor = { name: 'Asha Rao', email: 'asha@example.com' };
const okOrder = (amount) => ({ status: 200, body: { id: ORDER_ID, amount, currency: 'INR', status: 'created' } });

// ---------- configuration ----------

test('config: missing credentials are reported, not defaulted', () => {
  setEnv({});
  const c = lib.getConfig();
  assert.equal(c.ok, false);
  assert.ok(c.problems.some((p) => p.includes('RAZORPAY_KEY_ID')));
  assert.ok(c.problems.some((p) => p.includes('RAZORPAY_KEY_SECRET')));
});

test('config: placeholder and malformed values are rejected', () => {
  assert.equal(lib.getConfig({ RAZORPAY_KEY_ID: 'rzp_test_REPLACE_ME', RAZORPAY_KEY_SECRET: 'x'.repeat(20) }).ok, false);
  assert.equal(lib.getConfig({ RAZORPAY_KEY_ID: KEY_ID, RAZORPAY_KEY_SECRET: 'short' }).ok, false);
  assert.equal(lib.getConfig({ RAZORPAY_KEY_ID: KEY_ID, RAZORPAY_KEY_SECRET: KEY_SECRET, RAZORPAY_MODE: 'staging' }).ok, false);
});

test('config: defaults to test mode and never silently goes live', () => {
  assert.equal(lib.getConfig({ RAZORPAY_KEY_ID: KEY_ID, RAZORPAY_KEY_SECRET: KEY_SECRET }).mode, 'test');
  const live = { RAZORPAY_KEY_ID: 'rzp_live_AbCdEf123456', RAZORPAY_KEY_SECRET: KEY_SECRET };
  assert.equal(lib.getConfig(live).ok, false, 'live key without RAZORPAY_MODE=live must be refused');
  assert.equal(lib.getConfig({ ...live, RAZORPAY_MODE: 'test' }).ok, false, 'live key in test mode must be refused');
  assert.equal(lib.getConfig({ ...live, RAZORPAY_MODE: 'live' }).ok, true);
  assert.equal(lib.getConfig({ RAZORPAY_KEY_ID: KEY_ID, RAZORPAY_KEY_SECRET: KEY_SECRET, RAZORPAY_MODE: 'live' }).ok, false);
});

test('status: reports configured / not configured without leaking details', async () => {
  setEnv({});
  const off = await call(status, { method: 'GET' });
  assert.deepEqual(off.json, { configured: false });
  goodEnv();
  const on = await call(status, { method: 'GET' });
  assert.deepEqual(on.json, { configured: true, mode: 'test' });
  assert.ok(!on.text.includes(KEY_SECRET) && !on.text.includes(KEY_ID));
  assert.equal((await call(status, { method: 'POST' })).status, 405);
});

// ---------- amount validation ----------

test('amount: valid values convert to integer paise', () => {
  assert.equal(lib.parseAmountToPaise('1').paise, 100);
  assert.equal(lib.parseAmountToPaise('500').paise, 50000);
  assert.equal(lib.parseAmountToPaise(2500).paise, 250000);
  assert.equal(lib.parseAmountToPaise('499.5').paise, 49950);
  assert.equal(lib.parseAmountToPaise('0.29').code, 'amount_too_low');
  assert.equal(lib.parseAmountToPaise('500000').paise, 50000000);
  assert.equal(lib.parseAmountToPaise('19.99').paise, 1999, 'no float rounding drift');
});

test('amount: invalid, negative, zero, non-finite and manipulated values are rejected', () => {
  for (const bad of ['', ' ', 'abc', '-5', '0', 0, -1, NaN, Infinity, -Infinity, null, undefined, {}, [], true, '1e3', '1,000', '₹500', '5 0', '0x10', '12.345', '.5', '5.', '99999999', 5e21, 1e-7, '١٢٣']) {
    const r = lib.parseAmountToPaise(bad);
    assert.equal(r.ok, false, 'should reject ' + String(bad));
  }
  assert.equal(lib.parseAmountToPaise('500001').code, 'amount_too_high');
});

// ---------- create-order ----------

test('create-order: missing config gives a graceful 503 and never calls Razorpay', async () => {
  setEnv({});
  const calls = stubFetch(() => okOrder(50000));
  const r = await call(createOrder, { body: { amount: '500', ...donor } });
  assert.equal(r.status, 503);
  assert.equal(r.json.error, 'not_configured');
  assert.equal(calls.length, 0);
});

test('create-order: creates an INR order in paise with auth, receipt and donor notes', async () => {
  goodEnv();
  const calls = stubFetch(() => okOrder(250000));
  const r = await call(createOrder, { body: { amount: '2500', name: ' Asha  Rao ', email: 'asha@example.com', phone: '+91 98450 12345' } });
  assert.equal(r.status, 200);
  assert.deepEqual(Object.keys(r.json).sort(), ['amount', 'currency', 'keyId', 'mode', 'orderId', 'receipt']);
  assert.equal(r.json.orderId, ORDER_ID);
  assert.equal(r.json.amount, 250000);
  assert.equal(r.json.currency, 'INR');
  assert.equal(r.json.keyId, KEY_ID);
  assert.equal(r.json.mode, 'test');
  assert.ok(!r.text.includes(KEY_SECRET), 'secret must not appear in the response');

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.razorpay.com/v1/orders');
  assert.equal(calls[0].init.headers.Authorization, 'Basic ' + Buffer.from(KEY_ID + ':' + KEY_SECRET).toString('base64'));
  const sent = JSON.parse(calls[0].init.body);
  assert.equal(sent.amount, 250000);
  assert.equal(sent.currency, 'INR');
  assert.match(sent.receipt, /^bmt_[a-z0-9]+_[0-9a-f]{10}$/);
  assert.ok(sent.receipt.length <= 40);
  assert.equal(sent.notes.donor_name, 'Asha Rao');
  assert.equal(sent.notes.donor_phone, '+919845012345');
});

test('create-order: server-side validation rejects bad amounts without calling Razorpay', async () => {
  goodEnv();
  const calls = stubFetch(() => okOrder(100));
  for (const amount of ['0', '-100', 'NaN', 'Infinity', '', null, '1e9', '500001', 99999999, '12.345']) {
    const r = await call(createOrder, { body: { amount, ...donor } });
    assert.equal(r.status, 400, 'amount ' + String(amount));
    assert.ok(['invalid_amount', 'amount_too_low', 'amount_too_high'].includes(r.json.error));
  }
  assert.equal(calls.length, 0);
});

test('create-order: ignores a client-supplied paise or currency and validates donor details', async () => {
  goodEnv();
  const calls = stubFetch((url, init) => okOrder(JSON.parse(init.body).amount));
  const r = await call(createOrder, { body: { amount: '100', amountPaise: 1, currency: 'USD', ...donor } });
  assert.equal(r.status, 200);
  assert.equal(JSON.parse(calls[0].init.body).amount, 10000);
  assert.equal(JSON.parse(calls[0].init.body).currency, 'INR');

  for (const bad of [{ name: '', email: 'a@b.co' }, { name: 'A', email: 'nope' }, { name: 'A', email: 'a@b.co', phone: 'call me' }]) {
    const e = await call(createOrder, { body: { amount: '100', ...bad } });
    assert.equal(e.status, 400);
    assert.equal(e.json.error, 'invalid_donor');
    assert.ok(Object.keys(e.json.fields).length >= 1);
  }
});

test('create-order: rejects wrong method, content type and unreadable bodies', async () => {
  goodEnv();
  stubFetch(() => okOrder(100));
  assert.equal((await call(createOrder, { method: 'GET' })).status, 405);
  assert.equal((await call(createOrder, { headers: { 'content-type': 'text/plain' }, body: '{}' })).status, 415);
  assert.equal((await call(createOrder, { body: '{not json' })).status, 400);
  assert.equal((await call(createOrder, { body: '[1,2]' })).status, 400);
});

test('create-order: Razorpay errors are generic and leak nothing', async () => {
  goodEnv();
  stubFetch(() => ({ status: 500, body: { error: { description: 'internal detail ' + KEY_SECRET } } }));
  const r = await call(createOrder, { body: { amount: '500', ...donor } });
  assert.equal(r.status, 502);
  assert.ok(!r.text.includes('internal detail') && !r.text.includes(KEY_SECRET));

  stubFetch(() => ({ status: 401, body: { error: { description: 'Authentication failed' } } }));
  const auth = await call(createOrder, { body: { amount: '500', ...donor } });
  assert.equal(auth.status, 503);
  assert.equal(auth.json.error, 'not_configured');

  stubFetch(() => new Error('socket hang up'));
  assert.equal((await call(createOrder, { body: { amount: '500', ...donor } })).status, 502);

  stubFetch(() => okOrder(999));
  assert.equal((await call(createOrder, { body: { amount: '500', ...donor } })).status, 502, 'amount echoed by Razorpay must match');
});

test('create-order: does not log secrets or donor details', async () => {
  goodEnv();
  stubFetch(() => ({ status: 500, body: null }));
  const logged = [];
  const orig = console.error;
  console.error = (...a) => logged.push(a.join(' '));
  try { await call(createOrder, { body: { amount: '500', name: 'Private Person', email: 'private@example.com' } }); } finally { console.error = orig; }
  const out = logged.join('\n');
  assert.ok(!out.includes(KEY_SECRET) && !out.includes('Private Person') && !out.includes('private@example.com'));
});

// ---------- verify-payment ----------

const verifyBody = (over = {}) => ({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature: sign(ORDER_ID, PAYMENT_ID), ...over });
const payment = (over = {}) => ({ status: 200, body: { id: PAYMENT_ID, order_id: ORDER_ID, status: 'captured', amount: 50000, currency: 'INR', ...over } });

test('verify: valid signature + captured payment is "paid"', async () => {
  goodEnv();
  const calls = stubFetch(() => payment());
  const r = await call(verifyPayment, { body: verifyBody() });
  assert.equal(r.status, 200);
  assert.deepEqual(r.json, { status: 'paid', verified: true, orderId: ORDER_ID, paymentId: PAYMENT_ID, amount: 50000, currency: 'INR' });
  assert.equal(calls[0].url, 'https://api.razorpay.com/v1/payments/' + PAYMENT_ID);
  assert.equal(calls[0].init.method, 'GET');
  assert.ok(!r.text.includes(KEY_SECRET));
});

test('verify: authorized, failed and other statuses are kept distinct from paid', async () => {
  goodEnv();
  for (const [razorpayStatus, expected] of [['authorized', 'authorized'], ['failed', 'failed'], ['refunded', 'refunded'], ['created', 'pending']]) {
    stubFetch(() => payment({ status: razorpayStatus }));
    const r = await call(verifyPayment, { body: verifyBody() });
    assert.equal(r.status, 200);
    assert.equal(r.json.status, expected);
    assert.equal(r.json.verified, true);
  }
});

test('verify: invalid signatures are rejected before Razorpay is contacted', async () => {
  goodEnv();
  const calls = stubFetch(() => payment());
  const wrongSecret = sign(ORDER_ID, PAYMENT_ID, 'some_other_secret_value');
  for (const signature of [wrongSecret, sign(ORDER_ID, 'pay_OtherPayment999'), '0'.repeat(64), 'zz', '', null, 123]) {
    const r = await call(verifyPayment, { body: verifyBody({ signature }) });
    assert.equal(r.status, 400, String(signature));
    assert.equal(r.json.verified, false);
    assert.equal(r.json.status, 'failed');
  }
  assert.equal(calls.length, 0);
});

test('verify: a swapped order id (valid signature for another order) is rejected', async () => {
  goodEnv();
  stubFetch(() => payment());
  // Signature is genuine for ORDER_ID but the client claims a different order.
  const r = await call(verifyPayment, { body: verifyBody({ orderId: 'order_SomeOtherOrder1' }) });
  assert.equal(r.status, 400);
  assert.equal(r.json.error, 'invalid_signature');
});

test('verify: payment that belongs to a different order is rejected even with a valid signature', async () => {
  goodEnv();
  stubFetch(() => payment({ order_id: 'order_DifferentOrder9' }));
  const r = await call(verifyPayment, { body: verifyBody() });
  assert.equal(r.status, 400);
  assert.equal(r.json.error, 'order_mismatch');
  assert.equal(r.json.verified, false);
});

test('verify: malformed identifiers and non-INR payments are rejected', async () => {
  goodEnv();
  stubFetch(() => payment());
  assert.equal((await call(verifyPayment, { body: verifyBody({ orderId: 'not-an-order' }) })).status, 400);
  assert.equal((await call(verifyPayment, { body: verifyBody({ paymentId: '../../etc' }) })).status, 400);
  assert.equal((await call(verifyPayment, { body: {} })).status, 400);
  stubFetch(() => payment({ currency: 'USD' }));
  assert.equal((await call(verifyPayment, { body: verifyBody() })).json.error, 'currency_mismatch');
});

test('verify: Razorpay unreachable after a valid signature is "pending", never "paid"', async () => {
  goodEnv();
  stubFetch(() => new Error('network down'));
  const r = await call(verifyPayment, { body: verifyBody() });
  assert.equal(r.status, 202);
  assert.equal(r.json.status, 'pending');
  stubFetch(() => ({ status: 503, body: null }));
  assert.equal((await call(verifyPayment, { body: verifyBody() })).json.status, 'pending');
});

test('verify: repeating the same request is idempotent', async () => {
  goodEnv();
  stubFetch(() => payment());
  const first = await call(verifyPayment, { body: verifyBody() });
  const second = await call(verifyPayment, { body: verifyBody() });
  const third = await call(verifyPayment, { body: verifyBody() });
  assert.deepEqual(second.json, first.json);
  assert.deepEqual(third.json, first.json);
});

test('verify: missing config returns 503 and does not accept anything', async () => {
  setEnv({});
  const calls = stubFetch(() => payment());
  const r = await call(verifyPayment, { body: verifyBody() });
  assert.equal(r.status, 503);
  assert.equal(r.json.error, 'not_configured');
  assert.equal(calls.length, 0);
});
