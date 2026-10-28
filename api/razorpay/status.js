'use strict';
// GET /api/razorpay/status
// Lets the donation form show a "not available yet" state up front instead of failing at checkout.
// Reports only whether the integration is configured, not which settings are wrong (those go to the server log).

const { getConfig, sendJson, logConfigProblems } = require('../_lib/razorpay');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'method_not_allowed', message: 'Method not allowed.' });
  }
  const config = getConfig();
  if (!config.ok) {
    logConfigProblems(config.problems);
    return sendJson(res, 200, { configured: false });
  }
  return sendJson(res, 200, { configured: true, mode: config.mode });
};
