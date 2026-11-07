/* Contact / enquiry form.
   Posts to the Google Apps Script web app configured in site-content.js (BMT.forms.enquiry), exactly as the previous
   Get Involved page did. The JSON body is sent as text/plain so the request stays a "simple" CORS request with no
   preflight; Apps Script reads it from e.postData.contents and replies with JSON, which is checked before success is shown. */
(function () {
  'use strict';

  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var CSR_LABEL = 'Corporate partnership / CSR enquiry';
  // Option value -> topic label understood by the existing Apps Script.
  var TOPICS = { classes: 'Learning', support: 'Support', volunteer: 'Volunteering', collaborate: 'Collaboration', other: 'Something else' };

  var $ = function (id) { return document.getElementById(id); };
  var statusBox = $('enq-status'), submit = $('enq-submit'), label = $('enq-submit-label');
  var successBox = $('enq-success'), formWrap = $('enq-form-wrap');
  var inFlight = false;

  // ?topic=classes|support|volunteer|collaborate|csr preselects the topic from links elsewhere on the site.
  var csr = false;
  var qt = new URLSearchParams(window.location.search).get('topic');
  if (qt === 'csr') { csr = true; qt = 'collaborate'; }
  if (qt && TOPICS[qt]) form.elements.topic.value = qt;
  syncTopic();

  function syncTopic() {
    var t = form.elements.topic.value;
    var msg = $('message-label-text');
    msg.textContent = t === 'support' ? 'Message (optional)' : csr && t === 'collaborate' ? 'Tell us about your organisation and what you have in mind' : 'Message';
    $('org-field').hidden = !(t === 'collaborate' || t === 'support' || csr);
  }
  form.elements.topic.addEventListener('change', function () { csr = csr && form.elements.topic.value === 'collaborate'; syncTopic(); setError('message', ''); });

  function setError(name, text) {
    var input = form.elements[name], err = $('err-' + name);
    if (!err) return;
    err.textContent = text || '';
    if (text) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
  function showStatus(kind, text) {
    if (!kind) { statusBox.hidden = true; statusBox.textContent = ''; return; }
    statusBox.hidden = false;
    statusBox.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    statusBox.classList.toggle('alert--error', kind === 'error');
    statusBox.textContent = text;
  }
  form.addEventListener('input', function (e) { var n = e.target && e.target.name; if (n) setError(n, ''); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (inFlight) return;
    var val = function (k) { return String(form.elements[k].value || '').trim(); };
    var topicKey = val('topic');
    var isSupport = topicKey === 'support';
    var isCsr = csr && topicKey === 'collaborate';
    var phone = val('phone');
    var userMessage = val('message');
    var lines = [];
    if (isCsr) lines.push(CSR_LABEL);
    if (phone) lines.push('Phone: ' + phone);
    // The Apps Script takes a fixed set of fields, so the CSR context and phone number travel at the top of the message.
    var message = lines.length ? (lines.join('\n') + (userMessage ? '\n\n' + userMessage : '')) : userMessage;
    var data = {
      formType: 'enquiry',
      topic: TOPICS[topicKey] || 'Something else',
      supportOption: '',
      volunteerSkills: '',
      name: val('name'), email: val('email'), organisation: val('organisation'),
      message: message
    };

    var errors = {};
    if (!data.name) errors.name = 'Please enter your name.';
    if (!data.email) errors.email = 'Please enter your email address.';
    else if (!EMAIL_RE.test(data.email)) errors.email = 'Please enter a valid email address.';
    if (!isSupport && !userMessage) errors.message = 'Please write a short message.';
    ['name', 'email', 'message'].forEach(function (k) { setError(k, errors[k] || ''); });
    var bad = Object.keys(errors);
    if (bad.length) { showStatus(null); form.elements[bad[0]].focus(); return; }

    var url = window.BMT && window.BMT.forms && window.BMT.forms.enquiry;
    if (!url) { showStatus('error', 'Online enquiries are not connected yet, so your message was not sent.'); return; }

    inFlight = true;
    submit.setAttribute('aria-disabled', 'true'); label.textContent = 'Sending…'; showStatus(null);
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 20000);
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data), signal: ctrl.signal })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json().catch(function () { return null; });
      })
      .then(function (out) {
        // Only an explicit success flag counts; an HTML page (e.g. a Google sign-in redirect) or an empty reply is a failure.
        var accepted = !!out && (out.ok === true || out.success === true || out.result === 'success' || out.status === 'success');
        if (!accepted) throw new Error((out && (out.error || out.message)) || 'No success response');
        formWrap.hidden = true; successBox.hidden = false; successBox.focus();
        form.reset(); csr = false; syncTopic();
      })
      .catch(function (err) {
        showStatus('error', err && err.name === 'AbortError'
          ? 'The request took too long and your message may not have been sent. Please try again.'
          : 'Something went wrong and your message was not sent. Please try again.');
      })
      .then(function () {
        clearTimeout(timer); inFlight = false;
        submit.setAttribute('aria-disabled', 'false'); label.textContent = 'Send enquiry';
      });
  });

  var again = $('enq-again');
  if (again) again.addEventListener('click', function () { successBox.hidden = true; formWrap.hidden = false; form.elements.name.focus(); });
})();
