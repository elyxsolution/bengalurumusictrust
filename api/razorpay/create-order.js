'use strict';
// POST /api/razorpay/create-order
// Body: { amount: "500", name, email, phone? }  (amount in whole INR)
// The amount is validated here regardless of what the browser checked, converted to paise with integer
// maths and used to create a Razorpay order. Only what Checkout needs is returned.

const {
  CURRENCY, getConfig, parseAmountToPaise, validateDonor, newReceipt,
  razorpayRequest, readJsonBody, sendJson, rejectUnlessJsonPost, logConfigProblems, isOrderId
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

  const amount = parseAmountToPaise(body.amount);
  if (!amount.ok) return sendJson(res, 400, { error: amount.code, message: amount.message });

  const donor = validateDonor(body);
  if (!donor.ok) return sendJson(res, 400, { error: 'invalid_donor', message: 'Please check your details.', fields: donor.fields });

  // Donor details travel in the order notes so they appear next to the payment in the Razorpay dashboard.
  const notes = { purpose: 'Donation to Bangalore Music Trust', source: 'bangaloremusictrust.com', donor_name: donor.donor.name, donor_email: donor.donor.email };
  if (donor.donor.phone) notes.donor_phone = donor.donor.phone;

  const receipt = newReceipt();
  const result = await razorpayRequest(config, 'POST', '/orders', { amount: amount.paise, currency: CURRENCY, receipt, notes });

  if (!result.ok) {
    if (result.status === 401) {
      console.error('[razorpay] create-order: Razorpay rejected the configured credentials (HTTP 401)');
      return sendJson(res, 503, { error: 'not_configured', message: 'Online donations are not available yet.' });
    }
    console.error('[razorpay] create-order: upstream error (HTTP ' + result.status + ')');
    return sendJson(res, 502, { error: 'gateway_error', message: 'We could not start the payment. Please try again in a moment.' });
  }

  const order = result.data;
  if (!order || !isOrderId(order.id) || order.amount !== amount.paise || order.currency !== CURRENCY) {
    console.error('[razorpay] create-order: unexpected order response from Razorpay');
    return sendJson(res, 502, { error: 'gateway_error', message: 'We could not start the payment. Please try again in a moment.' });
  }

  return sendJson(res, 200, { orderId: order.id, amount: order.amount, currency: order.currency, keyId: config.keyId, mode: config.mode, receipt });
};
