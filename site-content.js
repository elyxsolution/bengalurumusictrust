/* Bangalore Music Trust: shared site config.
   Contact details, the enquiry-form endpoint, social links and the floating WhatsApp button live here;
   every page picks them up. */
(function () {
  window.BMT = {
    brand: {
      name: 'Bangalore Music Trust',
      tagline: 'Supporting Talent • Inspiring Generations',
      markGreen: '/assets/logo-mark-green.png',
      markIvory: '/assets/logo-mark-ivory.png'
    },
    // Instagram is the Trust's only social account; the homepage footer shows it as an icon.
    socials: [
      { label: 'Instagram', url: 'https://www.instagram.com/bangalore_music_trust/' }
    ],
    // Contact details: set here and every page picks them up.
    contact: {
      email: 'bangaloremusictrust@gmail.com',
      phone: '+91 89711 68006',
      phoneHref: 'tel:+918971168006',
      address: '59/6, 1st Floor, Deepika Layout (Gubbalala Main Road / 80 Feet Road), Banashankari 6th Stage, Gubbalala, Subramanyapura, Bengaluru, Karnataka 560061',
      whatsapp: 'https://wa.me/918971168006?text=' + encodeURIComponent('Hello Bangalore Music Trust, I would like to know more about your music classes and programs.')
    },
    // Enquiry form endpoint: the deployed Google Apps Script web app URL, ending in /exec
    // (Deploy > Manage deployments; "Who has access" must be "Anyone"). The script replies
    // with JSON {"success": true|false, "message": "..."}. null = the form reports that online enquiries are not
    // connected yet, rather than pretending to send.
    forms: { enquiry: 'https://script.google.com/macros/s/AKfycbxHN4Wb_owJBQMxAaB9dIJ1qGF3CUOFpNngLF0gjWFVdVenqB8f9rdXPxnTxuuxrqjNBw/exec' }
  };
  var C = window.BMT.contact;
  C.mapsHref = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.address);
  // Flat values for page templates (footer + contact section).
  window.BMT.contactVars = {
    phone: C.phone, phoneHref: C.phoneHref, address: C.address, mapsHref: C.mapsHref, whatsapp: C.whatsapp,
    email: C.email || '', emailHref: C.email ? 'mailto:' + C.email : '', hasEmail: !!C.email
  };
  // Floating WhatsApp button, shared by every page.
  function addWhatsApp() {
    if (document.getElementById('bmt-wa')) return;
    var st = document.createElement('style');
    st.textContent = '#bmt-wa{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom));z-index:40;width:56px;height:56px;border-radius:50%;background:#25D366;color:#fff;display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,.28);transition:transform .2s,box-shadow .2s}' +
      '#bmt-wa:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.34);color:#fff}#bmt-wa:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 5px #163D12}';
    document.head.appendChild(st);
    var a = document.createElement('a');
    a.id = 'bmt-wa'; a.href = C.whatsapp; a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', 'Chat with Bangalore Music Trust on WhatsApp');
    a.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zM20.52 3.45A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.4z"/></svg>';
    document.body.appendChild(a);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addWhatsApp); else addWhatsApp();
  window.addEventListener('load', addWhatsApp);
})();
