/* Bangalore Music Trust: shared behaviour (mobile menu, events gallery viewer). */
(function () {
  'use strict';

  // ---- Mobile menu ----
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    var setMenu = function (open, returnFocus) {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open && returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', function () { setMenu(!links.classList.contains('is-open')); });
    links.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) setMenu(false, true);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720 && links.classList.contains('is-open')) setMenu(false);
    });
  }

  // ---- Events gallery viewer ----
  var gallery = document.getElementById('gallery');
  var box = document.getElementById('lightbox');
  if (!gallery || !box || typeof box.showModal !== 'function') return;

  var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('.thumb'));
  var img = document.getElementById('lb-img');
  var cap = document.getElementById('lb-cap');
  var count = document.getElementById('lb-count');
  var closeBtn = document.getElementById('lb-close');
  var idx = 0, opener = null;

  function show(i) {
    idx = (i + thumbs.length) % thumbs.length;
    var t = thumbs[idx], thumb = t.querySelector('img');
    img.src = t.getAttribute('data-full');
    img.alt = thumb.alt;
    cap.textContent = thumb.alt + ' · Music Night, 20 June 2026';
    count.textContent = (idx + 1) + ' / ' + thumbs.length;
  }
  thumbs.forEach(function (t, i) {
    t.addEventListener('click', function () { opener = t; show(i); box.showModal(); closeBtn.focus(); });
  });
  document.getElementById('lb-prev').addEventListener('click', function () { show(idx - 1); });
  document.getElementById('lb-next').addEventListener('click', function () { show(idx + 1); });
  closeBtn.addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) {
    if (e.target === box || (e.target.classList && e.target.classList.contains('lb-stage'))) box.close();
  });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
  box.addEventListener('close', function () { img.removeAttribute('src'); if (opener) opener.focus(); });
})();
