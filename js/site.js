/* Bangalore Music Trust: shared behaviour for the static pages (header, mobile menu, contact details, scroll reveal, parallax). */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  window.__bmtReady = true; // tells the head script the reveal fallback is not needed
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id) { return doc.getElementById(id); }

  // Header gains a hairline once the page is scrolled.
  var header = $('site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 10); }

  // Mobile menu: the hamburger button opens and closes the link list (below 1000px only; the desktop nav is unchanged).
  var toggle = $('nav-toggle');
  if (header && toggle) {
    var setMenu = function (open) {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () { setMenu(!header.classList.contains('nav-open')); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && header.classList.contains('nav-open')) { setMenu(false); toggle.focus(); } });
    doc.addEventListener('click', function (e) { if (header.classList.contains('nav-open') && !header.contains(e.target)) setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1000) setMenu(false); });
  }

  // Contact details: site-content.js (window.BMT) is the single source when it is available; the HTML holds the same values as a fallback.
  var B = window.BMT;
  if (B && B.contactVars) {
    var c = B.contactVars;
    function each(key, fn) { Array.prototype.forEach.call(doc.querySelectorAll('[data-bmt="' + key + '"]'), fn); }
    each('maps', function (el) { el.href = c.mapsHref; });
    each('address', function (el) { el.textContent = c.address; });
    each('phone', function (el) { el.href = c.phoneHref; });
    each('phone-text', function (el) { el.textContent = c.phone; });
    each('email', function (el) { if (c.hasEmail) el.href = c.emailHref; else el.hidden = true; });
    each('email-text', function (el) { if (c.hasEmail) el.textContent = c.email; });
    each('wa', function (el) { el.href = c.whatsapp; });
    var ig = (B.socials || []).filter(function (s) { return s.label === 'Instagram'; })[0];
    if (ig) each('instagram', function (el) { el.href = ig.url; });
  }

  // Scroll reveal. Without IntersectionObserver or with reduced motion, everything is simply shown.
  var items = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));
  if (items.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      items.forEach(function (el) { io.observe(el); });
    }
  }

  // Gentle parallax: [data-parallax="0.12"] moves the image against the scroll, only while its section is on screen.
  var plx = reduce ? [] : Array.prototype.slice.call(doc.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function updateParallax() {
    ticking = false;
    var vh = window.innerHeight;
    plx.forEach(function (el) {
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
      var offset = (box.top + box.height / 2 - vh / 2) * speed;
      // Never move further than the image overscan, so the section background can't show through.
      var room = Math.max(0, (el.offsetHeight - el.parentElement.offsetHeight) / 2);
      offset = Math.max(-room, Math.min(room, offset));
      el.style.transform = 'translate3d(0,' + (-offset).toFixed(1) + 'px,0)';
    });
  }
  function onFrame() { onScroll(); if (plx.length && !ticking) { ticking = true; window.requestAnimationFrame(updateParallax); } }
  window.addEventListener('scroll', onFrame, { passive: true });
  window.addEventListener('resize', onFrame);
  onFrame();
})();
