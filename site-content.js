/* Bangalore Music Trust — central content config.
   Swap any photo by replacing its `id` (Unsplash photo id) or setting `src` to your own file path.
   Fields set to null are rendered as non-linked / "to be added" placeholders — never as fake data. */
(function () {
  var U = 'https://images.unsplash.com/photo-';
  // Illustrative photography from Unsplash (free Unsplash License; no Unsplash+ images). Each id is used once per page.
  // Ages are deliberately mixed: children, teenagers and young adults learning alongside teachers and mentors.
  var images = {
    hero:        { src: 'assets/hero.jpg', alt: 'Children singing into microphones during a music class while a teacher plays drums', pos: '50% 40%' },
    mission:     { id: '1591998304708-0ada5d7e0385', alt: 'Two smiling boys sitting beside a dholak drum', pos: '58% 35%' },
    who:         { id: '1577877777751-3f1ec20a0715', alt: 'A little girl in headphones smiling as she plays a piano', pos: '30% 40%' },
    whoDetail:   { id: '1646765566496-8744ce5e7738', alt: 'Close-up of a hand on the strings of a sitar' },
    wEducation:  { id: '1678027783638-345d5041b529', alt: 'Children seated together in a classroom, each learning a string instrument' },
    wTalent:     { id: '1725673853616-30b9e9715d4d', alt: 'A young violinist performing during a workshop' },
    wCulture:    { id: '1788283569351-b2ce17412711', alt: 'A boy in a white cap playing a traditional Indian barrel drum' },
    wCommunity:  { id: '1780396479347-e1be36843ccc', alt: 'Young musicians singing and playing guitar for an informal community audience' },
    sDiscover:   { id: '1711048421235-3fcb9dcf82f7', alt: 'A child and an adult playing a glockenspiel together' },
    sLearn:      { id: '1696522732406-065ef560da8c', alt: "A teacher guiding a young child's hands on a piano keyboard" },
    sPractice:   { id: '1698754525203-2f3296aa8ed9', alt: 'A girl practising at the piano' },
    sPerform:    { id: '1782567530660-63985063c559', alt: 'A young girl singing into a microphone on stage' },
    sGrow:       { id: '1777226407432-801354c2ea42', alt: 'A young trumpet player performing on stage with an ensemble' },
    jNote:       { id: '1681977741094-5aaf88d4b2d3', alt: 'A small boy holding a guitar almost as tall as he is' },
    jLesson:     { id: '1758525864068-44c5f189b262', alt: 'A teacher showing a teenage student how to play the guitar' },
    jPerformance:{ id: '1745852738033-895b8d519c4c', alt: 'Children singing together on stage' },
    jApplause:   { id: '1519682718457-c82ce8296645', alt: 'An audience seated in a concert hall' },
    jLifelong:   { id: '1770096732027-3c8adfcafd55', alt: 'Young adults singing and playing instruments together in a studio space' },
    impact:      { id: '1509782642997-4befdc4b21c9', alt: 'An audience watching a performance from the balcony of a hall', pos: '50% 60%' },
    stFirstNote: { id: '1534643960519-11ad79bc19df', alt: 'A young learner wearing headphones, smiling' },
    stVoice:     { id: '1527236102507-6e5ac2692925', alt: 'A girl singing while she plays a pink guitar' },
    stForward:   { id: '1637257526540-43d96c33fbe7', alt: 'An older musician guiding a young child playing a wind instrument' },
    eConcerts:   { id: '1519683109079-d5f539e1542f', alt: 'An ornate concert hall during a performance' },
    eWorkshops:  { id: '1722166677110-f7043f6239c6', alt: 'Young children gathered around a piano while a teacher plays' },
    eMaster:     { id: '1771718968046-6b8cee870812', alt: 'A tabla player performing outdoors' },
    eStudents:   { id: '1789421305583-702220940563', alt: 'A child playing classical guitar from a music stand for other children' },
    eCultural:   { id: '1681731030357-829645dd55b1', alt: 'A folk musician in traditional dress playing a string instrument' },
    eCommunity:  { id: '1759659335001-57b23abcfd6e', alt: 'A young drummer and an adult musician at an outdoor community music event' },
    support:     { id: '1507838153414-b4b713384a76', alt: 'Pages of sheet music' },
    final:       { id: '1646765495885-8a61595cb9cf', alt: 'A sitar and tabla performance on stage', pos: '50% 50%' },
    // What We Teach: Hindustani classical, Western vocals, Western instruments
    classical:   { id: '1764176269321-6d14f4af09c7', alt: 'Young women in traditional dress singing together on stage', pos: '50% 40%' },
    clFlute:     { id: '1579102072861-c31d565c0903', alt: 'A young girl playing a bansuri flute' },
    clHarmonium: { id: '1643287928605-b8e1190615fa', alt: 'Hands playing a harmonium' },
    clTabla:     { id: '1633411988188-6e63354a9019', alt: 'Hands playing a pair of tabla' },
    westernVocal:{ id: '1745852737476-c4fa7b99839a', alt: 'A young girl singing into a microphone on stage' },
    wvStudio:    { id: '1453738773917-9c3eff1db985', alt: 'A boy singing towards a studio microphone' },
    wvChoir:     { id: '1790342034579-3241995987ff', alt: "A children's choir singing together" },
    wvTeen:      { id: '1774274549653-7db2974acf3d', alt: 'A teenager singing into a microphone while playing guitar' },
    westernInstr:{ id: '1587794032575-de0040fe9186', alt: 'Two boys smiling as they play violins from sheet music' },
    wiPiano:     { id: '1575314113965-c6672a42b99c', alt: 'A young boy playing a grand piano' },
    wiGuitar:    { id: '1758612897785-f6354d462789', alt: 'A boy learning the acoustic guitar with help from an older relative' },
    wiDrums:     { id: '1761144841975-1879e5c62913', alt: 'A young drummer playing a drum kit' },
    // Music Education page
    eduHero:     { id: '1577877777751-3f1ec20a0715', alt: 'A little girl in headphones smiling as she plays a piano', pos: '30% 40%' },
    vocal:       { id: '1790342034579-3241995987ff', alt: "A children's choir singing together" },
    instrumental:{ id: '1678027783638-345d5041b529', alt: 'Children seated together in a classroom, each learning a string instrument' },
    contemporary:{ id: '1780396479347-e1be36843ccc', alt: 'Young musicians singing and playing guitar for an informal audience' },
    appreciation:{ id: '1534643960519-11ad79bc19df', alt: 'A young learner listening on headphones' },
    stage:       { id: '1745852738033-895b8d519c4c', alt: 'Children singing together on stage' },
    workshops:   { id: '1722166677110-f7043f6239c6', alt: 'Young children gathered around a piano while a teacher plays' },
    // Get Involved page
    giHero:      { id: '1762415845024-694f45017f31', alt: 'Musicians performing for a crowd of seated children outdoors', pos: '50% 45%' },
    giVolunteer: { id: '1758524944402-1903b38f848f', alt: 'A guitar teacher showing a young student a chord' }
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
