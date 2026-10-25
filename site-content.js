/* Bangalore Music Trust — central content config.
   Swap any photo by replacing its `id` (Unsplash photo id) or setting `src` to your own file path.
   Fields set to null are rendered as non-linked / "to be added" placeholders — never as fake data. */
(function () {
  var U = 'https://images.unsplash.com/photo-';
  var images = {
    hero:        { id: '1764176269321-6d14f4af09c7', alt: 'Young women in traditional dress singing together on stage', pos: '50% 40%' },
    mission:     { id: '1653246676297-98517bec8a52', alt: 'An elder musician playing the bansuri flute in low light', pos: '62% 30%' },
    who:         { id: '1653246458437-fd78a9265711', alt: 'A senior musician seated with a tanpura, smiling', pos: '45% 30%' },
    whoDetail:   { id: '1646765566496-8744ce5e7738', alt: 'Close-up of a hand on the strings of a sitar' },
    wEducation:  { id: '1519076976365-9c64dbd98317', alt: 'A child learning to play a keyboard' },
    wTalent:     { id: '1725673853616-30b9e9715d4d', alt: 'A young violinist performing during a workshop' },
    wCulture:    { id: '1633411988188-6e63354a9019', alt: 'Hands playing a pair of tabla before a microphone' },
    wCommunity:  { id: '1771238113736-5954f174156b', alt: 'Musicians performing traditional music outdoors for a gathered audience' },
    sDiscover:   { id: '1646765444015-5881f0fab3e8', alt: 'Close-up of a sitar being played' },
    sLearn:      { id: '1475275166152-f1e8005f9854', alt: 'Hands practising on an upright piano' },
    sPractice:   { id: '1653246577296-3b047aabd8e5', alt: 'A tabla player practising in a quiet room' },
    sPerform:    { id: '1570797803365-c6eb43b1f040', alt: 'Tabla set on a performance stage' },
    sGrow:       { id: '1601009928849-5fc4b21b67ae', alt: 'A musician seated outdoors with a traditional string instrument' },
    jNote:       { id: '1568219656418-15c329312bf1', alt: 'A hand striking a tabla' },
    jLesson:     { id: '1465821185615-20b3c2fbf41b', alt: 'A violinist practising' },
    jPerformance:{ id: '1465847899084-d164df4dedc6', alt: 'Violinists performing in a dim hall' },
    jApplause:   { id: '1519682718457-c82ce8296645', alt: 'An audience seated in a concert hall' },
    jLifelong:   { id: '1721572321944-e297b2d68aa7', alt: 'A musician seated on a rug playing a traditional instrument' },
    impact:      { id: '1509782642997-4befdc4b21c9', alt: 'An audience watching a performance from the balcony of a hall', pos: '50% 60%' },
    stFirstNote: { id: '1534643960519-11ad79bc19df', alt: 'A young learner wearing headphones, smiling' },
    stVoice:     { id: '1513745405825-efaf9a49315f', alt: 'A young woman playing piano' },
    stForward:   { id: '1653246506721-1c47487e32b9', alt: 'An elder musician playing flute' },
    eConcerts:   { id: '1519683109079-d5f539e1542f', alt: 'An ornate concert hall during a performance' },
    eWorkshops:  { id: '1514119412350-e174d90d280e', alt: 'Sheet music resting on a piano' },
    eMaster:     { id: '1771718968046-6b8cee870812', alt: 'A tabla player performing outdoors' },
    eStudents:   { id: '1551696785-927d4ac2d35b', alt: 'An ensemble of young string players seen from above' },
    eCultural:   { id: '1681731030357-829645dd55b1', alt: 'A folk musician in traditional dress playing a string instrument' },
    eCommunity:  { id: '1573056311194-ad24d60d969d', alt: 'A musician and a young girl in traditional dress' },
    support:     { id: '1507838153414-b4b713384a76', alt: 'Pages of sheet music' },
    final:       { id: '1646765495885-8a61595cb9cf', alt: 'A sitar and tabla performance on stage', pos: '50% 50%' },
    eduHero:     { id: '1519076976365-9c64dbd98317', alt: 'A child learning to play a keyboard', pos: '50% 40%' },
    vocal:       { id: '1764176269321-6d14f4af09c7', alt: 'Young women singing together' },
    instrumental:{ id: '1465821185615-20b3c2fbf41b', alt: 'A violinist practising' },
    classical:   { id: '1646765495885-8a61595cb9cf', alt: 'Sitar and tabla performance' },
    westernVocal:{ id: '1514119412350-e174d90d280e', alt: 'Sheet music resting on a piano' },
    westernInstr:{ id: '1551696785-927d4ac2d35b', alt: 'An ensemble of young string players seen from above' },
    contemporary:{ id: '1513745405825-efaf9a49315f', alt: 'A young woman playing piano' },
    appreciation:{ id: '1534643960519-11ad79bc19df', alt: 'A young learner listening on headphones' },
    stage:       { id: '1570797803365-c6eb43b1f040', alt: 'A stage set for performance' },
    workshops:   { id: '1725673853616-30b9e9715d4d', alt: 'A young violinist in a workshop' },
    giHero:      { id: '1771238113736-5954f174156b', alt: 'Musicians performing for a gathered audience outdoors', pos: '50% 45%' },
    giVolunteer: { id: '1653246458437-fd78a9265711', alt: 'A senior musician with a tanpura' },
    giCollab:    { id: '1519683109079-d5f539e1542f', alt: 'An ornate concert hall' }
  };
  function src(key, w) {
    var im = images[key]; if (!im) return '';
    if (im.src) return im.src;
    return U + im.id + '?auto=format&fit=crop&q=72&w=' + (w || 1200);
  }
  function set(key) {
    var im = images[key]; if (!im || im.src) return '';
    return [640, 1080, 1600, 2200].map(function (w) { return src(key, w) + ' ' + w + 'w'; }).join(', ');
  }
  function get(key, w) {
    var im = images[key] || {};
    return { src: src(key, w), set: set(key), alt: im.alt || '', pos: im.pos || '50% 50%' };
  }
  window.BMT = {
    brand: {
      name: 'Bangalore Music Trust',
      tagline: 'Supporting Talent • Inspiring Generations',
      markGreen: 'assets/logo-mark-green.png',
      markIvory: 'assets/logo-mark-ivory.png'
    },
    pages: { home: 'index.html', education: 'Music Education.dc.html', involved: 'Get Involved.dc.html' },
    // Social URLs: add real links when confirmed. null = shown as plain text, not a link.
    socials: [
      { label: 'Instagram', url: 'https://www.instagram.com/bangalore_music_trust/' },
      { label: 'Facebook', url: null },
      { label: 'YouTube', url: null },
      { label: 'LinkedIn', url: null }
    ],
    // Contact details: null until supplied by the Trust.
    // email stays null until the Trust supplies its verified address; set it here and every page picks it up.
    contact: {
      email: null,
      phone: '+91 89711 68006',
      phoneHref: 'tel:+918971168006',
      address: '59/6, 1st Floor, Deepika Layout (Gubbalala Main Road / 80 Feet Road), Banashankari 6th Stage, Gubbalala, Subramanyapura, Bengaluru, Karnataka 560061',
      whatsapp: 'https://wa.me/918971168006?text=' + encodeURIComponent('Hello Bangalore Music Trust, I would like to know more about your music classes and programs.')
    },
    // Enquiry form endpoint: the deployed Google Apps Script web app URL, ending in /exec
    // (Deploy > Manage deployments; "Who has access" must be "Anyone"). The script replies
    // with JSON {"success": true|false, "message": "..."}. null = the form reports that online enquiries are not
    // connected yet, rather than pretending to send.
    forms: { enquiry: 'https://script.google.com/macros/s/AKfycbxHN4Wb_owJBQMxAaB9dIJ1qGF3CUOFpNngLF0gjWFVdVenqB8f9rdXPxnTxuuxrqjNBw/exec' },
    images: images,
    img: get
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
