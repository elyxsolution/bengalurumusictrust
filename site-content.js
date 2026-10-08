/* Bengaluru Music Trust — central content config.
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
      name: 'Bengaluru Music Trust',
      tagline: 'Supporting Talent • Inspiring Generations',
      markGreen: 'assets/logo-mark-green.png',
      markIvory: 'assets/logo-mark-ivory.png'
    },
    pages: { home: 'index.html', education: 'Music Education.dc.html', involved: 'Get Involved.dc.html' },
    // Social URLs: add real links when confirmed. null = shown as plain text, not a link.
    socials: [
      { label: 'Instagram', url: null },
      { label: 'Facebook', url: null },
      { label: 'YouTube', url: null },
      { label: 'LinkedIn', url: null }
    ],
    // Contact + giving details: null until supplied by the Trust.
    contact: { email: null, phone: null, address: null },
    giving: { registration: null, taxBenefits: null, paymentMethods: null },
    images: images,
    img: get
  };
})();
