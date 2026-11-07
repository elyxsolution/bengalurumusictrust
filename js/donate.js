/* Online donations: Razorpay Standard Checkout.
   Ported unchanged in behaviour from the previous Get Involved page. The serverless endpoints in /api create the
   order and verify the payment (signature + payment status); this file only drives the form and the checkout window.
   The amount limits below are repeated in api/_lib/razorpay.js, and the server is what enforces them. */
(function () {
  'use strict';

  var form = document.getElementById('donate-form');
  if (!form) return;

  var MIN_AMOUNT = 1, MAX_AMOUNT = 500000; // whole INR
  var PRESETS = [500, 1000, 2500, 5000];
  var CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
  var API_STATUS = '/api/razorpay/status', API_ORDER = '/api/razorpay/create-order', API_VERIFY = '/api/razorpay/verify-payment';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var $ = function (id) { return document.getElementById(id); };
  var el = {
    wrap: $('donate-form-wrap'), paid: $('donate-paid'), auth: $('donate-auth'), pending: $('donate-pending'),
    presets: Array.prototype.slice.call(form.querySelectorAll('.preset')),
    custom: form.elements.customAmount, total: $('d-total'),
    name: form.elements.name, email: form.elements.email, phone: form.elements.phone,
    alertBox: $('donate-alert'), submit: $('d-submit'), submitLabel: $('d-submit-label'),
    setup: $('d-setup-notice'), test: $('d-test-notice'),
    paidText: $('paid-text'), paidTest: $('paid-test'), paidRef: $('paid-ref'), authText: $('auth-text'), authRef: $('auth-ref'),
    pendingText: $('pending-text'), pendingRef: $('pending-ref'), checkAgain: $('pending-check')
  };

  var state = { preset: -1, custom: '', status: 'idle', errors: {}, message: '', gateway: 'checking', mode: 'test', paymentId: '', paidAmount: 0, checking: false };
  var order = null, lastVerify = null, lastFailure = null, donating = false, settled = false, checkoutId = 0, handled = {}, checkoutLoading = null;

  var inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };

  function postJson(url, body) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 20000);
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal })
      .then(function (res) { return res.json().catch(function () { return null; }).then(function (data) { return { status: res.status, data: data }; }); })
      .then(function (r) { clearTimeout(timer); return r; }, function (e) { clearTimeout(timer); throw e; });
  }

  // The chosen amount in whole rupees: { value } when usable, { error } while a typed amount is invalid.
  function currentAmount() {
    if (state.custom.trim() !== '') {
      var s = state.custom.replace(/[\s,₹]/g, '');
      if (!/^\d+$/.test(s)) return { value: null, error: 'Please enter a whole-rupee amount, using digits only.' };
      var n = s.length > 7 ? Infinity : parseInt(s, 10);
      if (n < MIN_AMOUNT) return { value: null, error: 'The minimum donation is ' + inr(MIN_AMOUNT) + '.' };
      if (n > MAX_AMOUNT) return { value: null, error: 'Online donations are limited to ' + inr(MAX_AMOUNT) + '. Please contact the Trust for larger gifts.' };
      return { value: n };
    }
    return state.preset >= 0 ? { value: PRESETS[state.preset] } : { value: null };
  }

  function set(next) { for (var k in next) state[k] = next[k]; render(); }
  function setResult(next) { set(next); var r = visibleResult(); if (r) r.focus(); }
  function visibleResult() {
    if (!el.paid.hidden) return el.paid;
    if (!el.auth.hidden) return el.auth;
    if (!el.pending.hidden) return el.pending;
    return el.alertBox.hidden ? null : el.alertBox;
  }

  function fieldError(name, text) {
    var input = el[name], err = $('err-' + name);
    err.textContent = text || '';
    if (text) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }

  function render() {
    var st = state.status;
    var busy = st === 'preparing' || st === 'checkout' || st === 'verifying';
    var unconf = state.gateway === 'unconfigured';
    var view = st === 'paid' || st === 'authorized' || st === 'pending' ? st : 'form';
    var amt = currentAmount();
    var typed = state.custom.trim() !== '';
    var amtErr = state.errors.amount || amt.error || '';

    el.wrap.hidden = view !== 'form';
    el.paid.hidden = view !== 'paid';
    el.auth.hidden = view !== 'authorized';
    el.pending.hidden = view !== 'pending';
    el.setup.hidden = !unconf;
    el.test.hidden = !(state.gateway === 'ready' && state.mode === 'test');
    el.paidTest.hidden = !(state.gateway === 'ready' && state.mode === 'test');

    el.presets.forEach(function (b, i) { b.setAttribute('aria-checked', !typed && state.preset === i ? 'true' : 'false'); });
    if (el.custom.value !== state.custom) el.custom.value = state.custom;
    if (amtErr && typed) el.custom.setAttribute('aria-invalid', 'true'); else el.custom.removeAttribute('aria-invalid');
    el.total.textContent = amtErr || (amt.value ? 'Your donation: ' + inr(amt.value) + ' (INR)' : 'Choose or enter an amount to continue.');
    el.total.classList.toggle('is-error', !!amtErr);
    ['name', 'email', 'phone'].forEach(function (k) { fieldError(k, state.errors[k]); });

    var alerts = {
      checkout: ['Secure payment window open.', "Complete your payment in the Razorpay window. If you can't see it, check that your browser isn't blocking pop-ups.", 'status', false],
      verifying: ['Confirming your payment…', 'Please wait and keep this page open.', 'status', false],
      cancelled: ['Payment cancelled.', 'You closed the payment window before completing payment. No donation has been recorded. You can try again whenever you are ready.', 'status', false],
      failed: ['Payment failed.', state.message || 'Your payment could not be completed. No donation has been recorded. You can try again.', 'alert', true],
      error: ["We couldn't complete your donation.", state.message, 'alert', true]
    };
    var al = alerts[st];
    if (al) {
      el.alertBox.hidden = false;
      el.alertBox.setAttribute('role', al[2]);
      el.alertBox.classList.toggle('alert--error', al[3]);
      el.alertBox.textContent = '';
      var strong = document.createElement('strong'); strong.textContent = al[0];
      el.alertBox.appendChild(strong);
      el.alertBox.appendChild(document.createTextNode(' ' + al[1]));
      if (state.paymentId && (st === 'failed' || st === 'error')) {
        var ref = document.createElement('span'); ref.className = 'ref';
        ref.textContent = 'Razorpay payment reference: ' + state.paymentId;
        el.alertBox.appendChild(ref);
      }
    } else {
      el.alertBox.hidden = true;
    }

    el.submit.setAttribute('aria-disabled', busy || unconf ? 'true' : 'false');
    el.submit.style.cursor = busy ? 'progress' : unconf ? 'not-allowed' : 'pointer';
    el.submitLabel.textContent = st === 'preparing' ? 'Preparing secure checkout…' : st === 'checkout' ? 'Payment window open…' : st === 'verifying' ? 'Confirming payment…' : 'Donate Securely';

    el.paidText.textContent = 'Your donation of ' + inr(state.paidAmount) + ' was received and verified. Thank you for supporting music education in Bengaluru.';
    el.authText.textContent = 'Your bank has authorised a payment of ' + inr(state.paidAmount) + ', but it has not been completed yet, so it is not confirmed as a donation. Please keep the reference below and contact the Trust if you have any questions.';
    el.pendingText.textContent = "We couldn't confirm the result of your payment yet. Please don't pay again straight away. If the amount was taken from your account, keep the reference below and contact the Trust.";
    [el.paidRef, el.authRef, el.pendingRef].forEach(function (n) { n.textContent = state.paymentId; });
    el.checkAgain.setAttribute('aria-disabled', state.checking ? 'true' : 'false');
    el.checkAgain.textContent = state.checking ? 'Checking…' : 'Check again';
  }

  // Asks the server whether Razorpay is configured, so the form can say so up front instead of failing at checkout.
  function loadGateway() {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 8000);
    fetch(API_STATUS, { signal: ctrl.signal })
      .then(function (res) {
        return (res.ok ? res.json().catch(function () { return null; }) : Promise.resolve(null)).then(function (out) {
          if (out && out.configured === true) set({ gateway: 'ready', mode: out.mode === 'live' ? 'live' : 'test' });
          else if ((out && out.configured === false) || res.status === 404) set({ gateway: 'unconfigured' });
          else set({ gateway: 'unreachable' });
        });
      })
      .catch(function () { set({ gateway: 'unreachable' }); })
      .then(function () { clearTimeout(timer); });
  }

  function loadCheckout() {
    if (window.Razorpay) return Promise.resolve();
    if (!checkoutLoading) {
      checkoutLoading = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = CHECKOUT_SRC; s.async = true;
        s.onload = function () { if (window.Razorpay) resolve(); else reject({ userMessage: "We couldn't open the secure payment window. Please try again." }); };
        s.onerror = function () { s.remove(); checkoutLoading = null; reject({ userMessage: "We couldn't load the secure payment window. Please check your connection and try again." }); };
        document.head.appendChild(s);
      });
    }
    return checkoutLoading;
  }

  // One order per distinct amount + donor details: a cancelled or failed payment retries on the same order
  // instead of creating another, and repeat clicks never create duplicates.
  function getOrder(amount, donor) {
    var key = [amount, donor.name, donor.email, donor.phone].join('|');
    if (order && order.key === key) return Promise.resolve(order.data);
    return postJson(API_ORDER, { amount: String(amount), name: donor.name, email: donor.email, phone: donor.phone })
      .catch(function (e) {
        throw { userMessage: e && e.name === 'AbortError' ? 'The request took too long. Please try again.' : "We couldn't reach the payment service. Please check your connection and try again." };
      })
      .then(function (out) {
        var status = out.status, data = out.data;
        if (status === 200 && data && data.orderId) { order = { key: key, data: data }; return data; }
        if (data && data.error === 'not_configured') throw { code: 'not_configured' };
        if (data && data.fields) throw { fields: data.fields };
        throw { userMessage: (data && data.message) || "We couldn't start the payment. Please try again." };
      });
  }

  function startDonation() {
    if (donating || state.gateway === 'unconfigured') return;
    var val = function (k) { return String(form.elements[k].value || '').trim(); };
    var donor = { name: val('name').replace(/\s+/g, ' '), email: val('email'), phone: val('phone') };
    var amt = currentAmount();
    var errors = {};
    if (amt.error) errors.amount = amt.error; else if (!amt.value) errors.amount = 'Please choose or enter an amount.';
    if (!donor.name) errors.name = 'Please enter your name.';
    if (!donor.email) errors.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(donor.email)) errors.email = 'Please enter a valid email address.';
    if (donor.phone && !/^\+?\d{10,15}$/.test(donor.phone.replace(/[\s().-]/g, ''))) errors.phone = 'Please enter a valid phone number, or leave it blank.';
    var bad = Object.keys(errors);
    if (bad.length) {
      set({ errors: errors, status: 'idle', message: '' });
      var target = form.elements[bad[0] === 'amount' ? 'customAmount' : bad[0]];
      if (target) target.focus();
      return;
    }
    donating = true;
    set({ status: 'preparing', errors: {}, message: '', paymentId: '' });
    getOrder(amt.value, donor)
      .then(function (o) { return loadCheckout().then(function () { openCheckout(o, donor); }); })
      .catch(function (err) {
        donating = false;
        if (err && err.code === 'not_configured') set({ gateway: 'unconfigured', status: 'idle' });
        else if (err && err.fields) set({ errors: err.fields, status: 'idle' });
        else setResult({ status: 'error', message: (err && err.userMessage) || "We couldn't start the payment. Please try again." });
      });
  }

  function openCheckout(o, donor) {
    var id = ++checkoutId;
    lastFailure = null; settled = false;
    var options = {
      key: o.keyId, amount: o.amount, currency: o.currency, order_id: o.orderId,
      name: 'Bangalore Music Trust', description: 'Donation',
      prefill: { name: donor.name, email: donor.email, contact: donor.phone },
      theme: { color: '#163D12' },
      modal: { confirm_close: true, ondismiss: function () { if (id === checkoutId) onDismiss(); } },
      handler: function (resp) { if (id === checkoutId) onPaid(o, resp); }
    };
    if (window.location.protocol === 'https:') options.image = new URL('/assets/logo-mark-green.png', window.location.href).href;
    try {
      var rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (r) { if (id === checkoutId) onCheckoutFailed(r); });
      set({ status: 'checkout' });
      rzp.open();
    } catch (e) {
      donating = false;
      setResult({ status: 'error', message: "We couldn't open the secure payment window. Please try again." });
    }
  }

  // Checkout keeps its window open after a failed attempt so the donor can retry inside it; we only remember why.
  function onCheckoutFailed(r) {
    var e = (r && r.error) || {};
    lastFailure = { text: String(e.description || '').slice(0, 200), paymentId: String((e.metadata && e.metadata.payment_id) || '') };
  }
  function onDismiss() {
    if (settled) return;
    donating = false;
    var f = lastFailure;
    if (f) setResult({ status: 'failed', message: 'Your payment could not be completed' + (f.text ? ': ' + f.text.replace(/\.$/, '') + '.' : '.') + ' No donation has been recorded. You can try again.', paymentId: f.paymentId });
    else setResult({ status: 'cancelled', message: '', paymentId: '' });
  }

  // Checkout's success callback is only a claim: the payment is confirmed by the server (signature + payment status).
  function onPaid(o, resp) {
    var orderId = resp && resp.razorpay_order_id, paymentId = resp && resp.razorpay_payment_id, signature = resp && resp.razorpay_signature;
    if (paymentId && handled[paymentId]) return; // duplicate callback
    settled = true;
    if (!paymentId || !signature || orderId !== o.orderId) {
      donating = false;
      setResult({ status: 'error', message: 'The payment response did not match this donation, so it has not been confirmed. If you were charged, please contact the Trust.', paymentId: paymentId || '' });
      return;
    }
    handled[paymentId] = true;
    lastVerify = { orderId: orderId, paymentId: paymentId, signature: signature };
    verify(false);
  }

  function verify(fromPending) {
    var v = lastVerify;
    if (!v) return;
    if (fromPending) set({ checking: true }); else set({ status: 'verifying', paymentId: v.paymentId });
    postJson(API_VERIFY, v).catch(function () { return null; }).then(function (out) {
      var status = out ? out.status : 0, data = out ? out.data : null;
      donating = false;
      var done = function (next) { next.checking = false; next.paymentId = v.paymentId; setResult(next); };
      if (status === 200 && data && data.verified === true) {
        var paid = Number(data.amount) / 100 || 0;
        if (data.status === 'paid') { order = null; return done({ status: 'paid', paidAmount: paid }); }
        if (data.status === 'authorized') { order = null; return done({ status: 'authorized', paidAmount: paid }); }
        if (data.status === 'failed') return done({ status: 'failed', message: 'Razorpay reports that this payment did not complete. No donation has been recorded. You can try again.' });
        if (data.status === 'refunded') return done({ status: 'failed', message: 'This payment was refunded, so no donation has been recorded.' });
        return done({ status: 'pending' });
      }
      if (status === 400 && data && data.verified === false) return done({ status: 'failed', message: 'We could not verify this payment, so it has not been counted as a donation. If your account was debited, please contact the Trust and quote the reference below.' });
      return done({ status: 'pending' }); // network trouble, 202 or a server error: not confirmed yet, never shown as success
    });
  }

  function resetDonation() {
    order = null; lastVerify = null; donating = false;
    set({ status: 'idle', preset: -1, custom: '', errors: {}, message: '', paymentId: '', paidAmount: 0, checking: false });
  }

  // ---- Wiring ----
  var clearAlert = function () { return state.status === 'failed' || state.status === 'cancelled' || state.status === 'error' ? 'idle' : state.status; };
  el.presets.forEach(function (b, i) {
    b.addEventListener('click', function () {
      var errs = Object.assign({}, state.errors, { amount: '' });
      set({ preset: i, custom: '', status: clearAlert(), errors: errs });
    });
  });
  el.custom.addEventListener('input', function () {
    var errs = Object.assign({}, state.errors, { amount: '' });
    state.custom = el.custom.value; state.preset = -1; state.status = clearAlert(); state.errors = errs; render();
  });
  form.addEventListener('input', function (e) {
    var n = e.target && e.target.name;
    if (n && state.errors[n] && n !== 'customAmount') { var errs = Object.assign({}, state.errors); errs[n] = ''; state.errors = errs; fieldError(n, ''); }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); startDonation(); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-donate-reset]'), function (b) { b.addEventListener('click', resetDonation); });
  el.checkAgain.addEventListener('click', function () { if (!state.checking) verify(true); });

  // ?amount=500 preselects that donation amount.
  var qa = parseInt(new URLSearchParams(window.location.search).get('amount'), 10);
  if (qa >= MIN_AMOUNT && qa <= MAX_AMOUNT) { if (PRESETS.indexOf(qa) >= 0) state.preset = PRESETS.indexOf(qa); else state.custom = String(qa); }

  render();
  loadGateway();
})();
