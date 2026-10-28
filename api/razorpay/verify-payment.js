'use strict';
// POST /api/razorpay/verify-payment
// Body: { orderId, paymentId, signature }  (the razorpay_order_id / razorpay_payment_id / razorpay_signature
// that Standard Checkout hands to the browser's success handler).
//
// Checkout's success callback is never trusted on its own. This endpoint:
//   1. verifies the signature (proves Razorpay issued this order/payment pair), then
//   2. fetches the payment from Razorpay to confirm it belongs to the order and to read its real status.
// The result keeps "verified", "authorized" and "paid" (captured) apart; only "paid" means money is captured.
// The checks are stateless, so repeating a request returns the same result and cannot create anything twice.

const {
  CURRENCY, getConfig, isOrderId, isPaymentId, isSignature, signatureMatches,
  razorpayRequest, readJsonBody, sendJson, rejectUnlessJsonPost, logConfigProblems
} = require('../_lib/razorpay');

module.exports = async function handler(req, res) {
  if (rejectUnlessJsonPost(req, res)) return;

  const config = getConfig();
  if (!config.ok) {
    logConfigProblems(config.problems);
    return sendJson(res, 503, { error: 'not_configured', message: 'Online donations are not available yet.' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    return sendJson(res, 400, { error: 'invalid_request', message: 'The request could not be read.' });
  }

  const { orderId, paymentId, signature } = body;
  if (!isOrderId(orderId) || !isPaymentId(paymentId) || !isSignature(signature)) {
    return sendJson(res, 400, { status: 'failed', verified: false, error: 'invalid_request', message: 'The payment details were not valid.' });
  }

  if (!signatureMatches(orderId, paymentId, signature, config.keySecret)) {
    return sendJson(res, 400, { status: 'failed', verified: false, error: 'invalid_signature', message: 'The payment could not be verified.' });
  }

  const result = await razorpayRequest(config, 'GET', '/payments/' + encodeURIComponent(paymentId));
  if (!result.ok || !result.data) {
    // Signature is genuine but Razorpay could not be asked for the status right now.
    console.error('[razorpay] verify-payment: could not fetch payment status (HTTP ' + result.status + ')');
    return sendJson(res, 202, { status: 'pending', verified: true, orderId, paymentId, message: 'Your payment is being confirmed.' });
  }

  const payment = result.data;
  if (payment.order_id !== orderId) {
    return sendJson(res, 400, { status: 'failed', verified: false, error: 'order_mismatch', message: 'The payment does not match this donation.' });
  }
  if (payment.currency !== CURRENCY) {
    return sendJson(res, 400, { status: 'failed', verified: false, error: 'currency_mismatch', message: 'The payment does not match this donation.' });
  }

  const status = ({ captured: 'paid', authorized: 'authorized', failed: 'failed', refunded: 'refunded' })[payment.status] || 'pending';
  return sendJson(res, 200, { status, verified: true, orderId, paymentId, amount: payment.amount, currency: payment.currency });
};
