/* Bangalore Music Trust: Contact page form.
   The submission logic is carried over unchanged from the Support page's component (the form used to live there):
   same fields, same validation, same JSON payload sent as text/plain to the Google Apps Script web app in
   site-content.js (BMT.forms.enquiry), same success check, timeout, duplicate-submit guard and messages. */
(function () {
  'use strict';
  var TOPICS = ['Learning', 'Support', 'Volunteering', 'Collaboration', 'Something else'];
  var GIVE = [
    ['One-time gift', 'A single contribution towards learning opportunities.'],
    ['Regular support', 'Ongoing giving that helps the Trust plan ahead.'],
    ['Support a learner', "Help make one learner's musical journey possible."],
    ['Instruments & resources', 'Contribute instruments, materials or spaces.']
  ];
  // Intended-contribution choices for the support enquiry (not the donation form).
  var AMOUNTS = [['1', '₹1'], ['100', '₹100'], ['500', '₹500'], ['1000+', '₹1,000+']];
  var CSR_LABEL = 'Corporate partnership / CSR enquiry';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var $ = function (id) { return document.getElementById(id); };
  var form = $('enquiry-form'), sentBox = $('enquiry-sent');
  if (!form || !sentBox) return;

  var state = { topic: 0, give: -1, amount: -1, csr: false, status: 'idle', errors: {}, errorText: '', sentTopic: 0, sentSupport: '' };
  var inFlight = false;

  // Links from other pages can preselect a topic: ?topic=support, ?topic=collaboration, ?topic=collaboration&csr=1.
  (function presets() {
    var q = new URLSearchParams(window.location.search);
    var names = { learning: 0, support: 1, volunteering: 2, collaboration: 3, other: 4 };
    var t = (q.get('topic') || '').toLowerCase();
    if (t in names) state.topic = names[t];
    if (q.get('csr') === '1') { state.topic = 3; state.csr = true; }
  })();

  function supportOption(give, amount) {
    return [give >= 0 ? GIVE[give][0] : '', amount >= 0 ? 'Intended contribution ' + AMOUNTS[amount][1] : ''].filter(Boolean).join(' · ');
  }

  function render() {
    var s = state, sending = s.status === 'sending';
    var sent = s.status === 'sent';
    form.hidden = sent; sentBox.hidden = !sent;
    Array.prototype.forEach.call(form.querySelectorAll('[data-topic]'), function (b) { b.setAttribute('aria-checked', String(+b.getAttribute('data-topic') === s.topic)); });
    Array.prototype.forEach.call(form.querySelectorAll('[data-amount]'), function (b) { b.setAttribute('aria-checked', String(+b.getAttribute('data-amount') === s.amount)); });
    Array.prototype.forEach.call(form.querySelectorAll('[data-give]'), function (b) { b.setAttribute('aria-checked', String(+b.getAttribute('data-give') === s.give)); });
    $('csr-row').hidden = !(s.topic === 3 && s.csr);
    $('support-block').hidden = s.topic !== 1;
    $('message-label-text').textContent = s.topic === 1 ? 'Message (optional)' : s.topic === 3 && s.csr ? 'Tell us about your organisation and what you have in mind' : 'Message';
    ['name', 'email', 'message'].forEach(function (k) {
      var field = form.querySelector('[name="' + k + '"]'), msg = $('err-' + k), bad = !!s.errors[k];
      field.setAttribute('aria-invalid', String(bad));
      msg.hidden = !bad; msg.textContent = s.errors[k] || '';
    });
    var err = $('form-error');
    err.hidden = s.status !== 'error';
    $('form-error-text').textContent = s.errorText;
    var btn = $('enquiry-submit');
    btn.setAttribute('aria-disabled', String(sending));
    $('enquiry-submit-label').textContent = sending ? 'Sending…' : 'Send message';
    if (sent) {
      $('sent-text').textContent = s.sentTopic === 1
        ? 'Your support enquiry' + (s.sentSupport ? ' (' + s.sentSupport + ')' : '') + ' has been sent. No payment has been taken; the Trust will be in touch directly about how to give.'
        : 'Your message about ' + TOPICS[s.sentTopic].toLowerCase() + ' has been sent. The Trust will respond soon.';
    }
  }

  // Posts the enquiry to the Google Apps Script web app in site-content.js (BMT.forms.enquiry).
  // The JSON body is sent as text/plain so the request stays a "simple" CORS request with no preflight;
  // Apps Script reads it from e.postData.contents. Its /exec URL redirects to script.googleusercontent.com,
  // which allows cross-origin reads, so the JSON reply can be checked before showing success.
  function sendEnquiry() {
    if (inFlight) return;
    var s = state;
    var f = new FormData(form);
    var val = function (k) { return String(f.get(k) || '').trim(); };
    var isSupport = s.topic === 1;
    var isCsr = s.topic === 3 && s.csr;
    var data = {
      formType: 'enquiry',
      topic: TOPICS[s.topic],
      supportOption: isSupport ? supportOption(s.give, s.amount) : '',
      volunteerSkills: '',
      name: val('name'), email: val('email'), organisation: val('organisation'),
      // The Apps Script takes a fixed set of fields, so the CSR context travels at the top of the message.
      message: isCsr ? (CSR_LABEL + '\n\n' + val('message')).trim() : val('message')
    };
    var errors = {};
    if (!data.name) errors.name = 'Please enter your name.';
    if (!data.email) errors.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(data.email)) errors.email = 'Please enter a valid email address.';
    if (!isSupport && !data.message) errors.message = 'Please write a short message.';
    var bad = Object.keys(errors);
    if (bad.length) {
      s.errors = errors; s.status = 'idle'; render();
      setTimeout(function () { var el = form.querySelector('[name="' + bad[0] + '"]'); if (el) el.focus(); }, 0);
      return;
    }
    var url = window.BMT && window.BMT.forms && window.BMT.forms.enquiry;
    if (!url) {
      s.errors = {}; s.status = 'error'; s.errorText = 'Online enquiries are not connected yet, so your message was not sent.'; render();
      return;
    }
    inFlight = true;
    s.errors = {}; s.status = 'sending'; render();
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 20000);
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data), signal: ctrl.signal })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        // Only an explicit success flag counts; an HTML page (e.g. a Google sign-in redirect) or an empty reply is a failure.
        return res.json().catch(function () { return null; });
      })
      .then(function (out) {
        var accepted = !!out && (out.ok === true || out.success === true || out.result === 'success' || out.status === 'success');
        if (!accepted) throw new Error((out && (out.error || out.message)) || 'No success response');
        s.status = 'sent'; s.sentTopic = s.topic; s.sentSupport = data.supportOption; render();
        sentBox.focus();
      })
      .catch(function (err) {
        s.status = 'error';
        s.errorText = err && err.name === 'AbortError'
          ? 'The request took too long and your message may not have been sent. Please try again.'
          : 'Something went wrong and your message was not sent. Please try again.';
        render();
      })
      .then(function () { clearTimeout(timer); inFlight = false; });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); sendEnquiry(); });
  form.addEventListener('input', function (e) {
    var n = e.target && e.target.name;
    if (n && state.errors[n]) { state.errors[n] = ''; render(); }
  });
  form.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-topic')) {
      var i = +b.getAttribute('data-topic');
      state.csr = i === 3 && state.csr; state.topic = i; state.errors.message = ''; render();
    } else if (b.hasAttribute('data-amount')) {
      var a = +b.getAttribute('data-amount'); state.amount = state.amount === a ? -1 : a; render();
    } else if (b.hasAttribute('data-give')) {
      var g = +b.getAttribute('data-give'); state.give = state.give === g ? -1 : g; render();
    } else if (b.id === 'csr-clear') {
      state.csr = false; render();
    }
  });
  $('enquiry-again').addEventListener('click', function () {
    form.reset();
    state.status = 'idle'; state.errors = {}; state.give = -1; state.amount = -1; render();
    var first = form.querySelector('[name="name"]'); if (first) first.focus();
  });

  render();
})();
