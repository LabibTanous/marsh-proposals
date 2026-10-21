/* Review kit config — Meat Moot proposal. Opens only with ?review=1 so the owner never sees it.
   Sources: docs/MEETING-PLAN.md section 10, meetings of 17 Oct. */
(function () {
  const L = (ar, en) => ({ ar, en });
  const price = (id, ar, en) => ({ id, type: 'price', label: L(ar, en) });
  const S = {
    top: { label: L('الغلاف', 'Cover'), known: [L('17 تشرين الأول: البروستد اسمه «مشهور بروستد» وليس نشمي — تم التعديل', '17 Oct: the broasted brand is "Mashhoor Broasted", not Nashmi — fixed')], fields: [
      { id: 'owner', type: 'text', label: L('اسم صاحب المطعم', 'The owner\'s name') },
    ] },
    terms: { label: L('الشروط الأساسية', 'Key terms'), fields: [
      { id: 'signer', type: 'text', label: L('من يوقّع العقد؟', 'Who signs the contract?') },
      { id: 'company', type: 'text', label: L('اسم الشركة في العقد', 'Company name for the contract') },
    ] },
    today: { label: L('الحساب اليوم', 'The account today'), fields: [
      { id: 'rating', type: 'select', label: L('نعرض تقييماً؟', 'Show a rating?'), options: [{ v: 'none', ar: 'لا', en: 'No' }, { v: 'google', ar: 'جوجل 4.6 من 1,433 (نتحقق قبل الاجتماع)', en: 'Google 4.6 from 1,433 (check before the meeting)' }, { v: 'arabplaces', ar: 'arabplaces 4.9 من 35', en: 'arabplaces 4.9 from 35' }] },
    ] },
    building: { label: L('المبنى', 'The building'), known: [L('17 تشرين الأول: الكافيه في الطابق العلوي مؤكد', '17 Oct: the café upstairs is confirmed'), L('18 تشرين الأول (صافي): طابقان فقط، الأرضي والأول. المطعم والكافيه في الأول — تم التعديل', '18 Oct (Safi): 2 floors only, ground and first. The restaurant and café are on the first floor — fixed')], fields: [
      { id: 'cafeFloor', type: 'select', label: L('في أي طابق الكافيه؟', 'Which floor is the café on?'), options: [{ v: 'l1', ar: 'الأول', en: 'Level 1' }, { v: 'l2', ar: 'الثاني', en: 'Level 2' }, { v: 'other', ar: 'غير ذلك', en: 'Other' }] },
      { id: 'cafeName', type: 'text', label: L('اسم الكافيه', 'The café\'s name') },
      { id: 'l1Use', type: 'text', label: L('ماذا يوجد في الطابق الأول اليوم؟', 'What is on Level 1 today?') },
      { id: 'brandsPlace', type: 'textarea', label: L('أين كل علامة في المبنى؟ (ميت موت، مشهور، نشمي)', 'Where is each brand in the building? (Meat Moot, Mashhoor, Nashmi)'), rows: 2 },
      { id: 'logos', type: 'yesno', label: L('هل ترسل شعارات مشهور ونشمي (أو صور اللافتات)؟', 'Will you send the Mashhoor and Nashmi logos (or photos of the signs)?') },
    ] },
    pages: { label: L('الصفحات', 'Pages'), known: [L('18 تشرين الأول: صفحة المجموعة هي @brands_by_seka. صفحات مشهور ونشمي وميت موت للإدارات الرئيسية. تشيك إن بدون صفحة.', '18 Oct: the group page is @brands_by_seka. The head offices run the Mashhoor, Nashmi and Meat Moot pages. Check Inn has no page.')], fields: [
      { id: 'group', type: 'text', label: L('من يدير @brands_by_seka اليوم؟', 'Who runs @brands_by_seka today?') },
      { id: 'handles', type: 'textarea', label: L('حسابات إنستغرام: ميت موت إربد، مشهور، نشمي', 'Instagram handles: Meat Moot Irbid, Mashhoor, Nashmi'), rows: 3 },
    ] },
    channels: { label: L('القنوات', 'Channels'), fields: [
      { id: 'add', type: 'multi', label: L('قنوات نضيفها؟', 'Channels to add?'), options: [{ v: 'snapchat', ar: 'سناب شات', en: 'Snapchat' }, { v: 'youtube', ar: 'يوتيوب', en: 'YouTube' }, { v: 'whatsapp', ar: 'قناة واتساب', en: 'WhatsApp channel' }, { v: 'googleads', ar: 'إعلانات جوجل', en: 'Google Ads' }] },
    ] },
    dashboard: { label: L('لوحة التحكم', 'Dashboard'), fields: [
      { id: 'golive', type: 'text', label: L('متى نقول للعميل إن اللوحة تعمل؟', 'When do we tell him the dashboard goes live?') },
    ] },
    card: { label: L('بطاقة الولاء', 'Loyalty card'), known: [L('17 تشرين الأول: لا بطاقة ولاء ولا لوحة تحكم في التجربة', '17 Oct: no loyalty card and no dashboard in the trial')], fields: [
      { id: 'rule', type: 'select', label: L('قاعدة المكافأة', 'Reward rule'), options: [{ v: '500g', ar: 'ختم لكل 500 غرام، 200 غرام مجاناً بعد 6', en: '1 stamp per 500 g, 200 g free after 6' }, { v: 'drink', ar: 'مشروب مجاني من الكافيه', en: 'A free drink from the café' }, { v: 'other', ar: 'غير ذلك', en: 'Other' }] },
    ] },
    plans: { label: L('الخطط والأسعار', 'Plans and fees'), known: [
      L('التدقيق: 100 دينار لكل حساب (3 حسابات = 300)', 'Audit: 100 JOD per account (3 accounts = 300)'),
      L('السوق اليوم (صافي): فيديو واحد ≈ 500 دينار بالشهر، 3 فيديوهات ≈ 600', 'Market today (Safi): 1 video ≈ 500 JOD a month, 3 videos ≈ 600'),
      L('الرسائل: حوالي 150 دينار (صافي، لكنان)', 'Messages: about 150 JOD (Safi, for Kenan)'),
      L('18 تشرين الأول: أسعارك (النطاقات) ظاهرة الآن في العرض. ينقص: الحد الأعلى لبطاقة الولاء (كتبت 80 إلى 00)، الموقع، افتتاح الكافيه، صفحة علامة إضافية، حملة المؤثرين', '18 Oct: your ranges now show in the proposal. Missing: the loyalty card top figure (you wrote 80 to 00), website, café opening, extra brand page, influencer campaign'),
    ], fields: [
      price('trial', 'التجربة، شهر واحد', 'Trial, 1 month'),
      price('m3', 'خطة 3 أشهر، بالشهر', '3-month plan, per month'),
      price('m6', 'خطة 6 أشهر، بالشهر', '6-month plan, per month'),
      price('setDash', 'تجهيز لوحة التحكم', 'Dashboard set-up'),
      price('setMsg', 'تجهيز الرسائل', 'Messages set-up'),
      price('setCard', 'تجهيز بطاقة الولاء', 'Loyalty card set-up'),
      price('setWeb', 'الموقع الإلكتروني', 'Website'),
      price('setOpening', 'افتتاح الكافيه', 'Café opening'),
      price('setPhotos', 'صور احترافية', 'Professional photos'),
      price('addBrand', 'صفحة علامة إضافية، بالشهر', 'Extra brand page, per month'),
      price('addInfl', 'حملة مؤثرين', 'Influencer campaign'),
      price('addShoot', 'يوم تصوير إضافي', 'Extra shoot day'),
    ] },
    next: { label: L('الخطوة التالية', 'Next step'), fields: [
      { id: 'when', type: 'text', label: L('موعد ومكان الاجتماع يوم الاثنين', 'Monday meeting: time and place') },
    ] },
  };
  window.REVIEW = {
    site: 'meatmoot-proposal',
    author: 'Safi',
    title: L('ملاحظات عرض ميت موت', 'Meat Moot proposal notes'),
    base: 'review/',
    pageKey: () => '/proposal',
    /* the page's side index nav sits on the end side, so centre the button in the section's top padding;
       the cover's button goes below the fixed top bar */
    extraCss: '.rk-btn{inset-inline-end:auto;left:50%;transform:translateX(-50%);top:22px}#top>.rk-btn{top:86px}',
    pageLabel: () => (document.documentElement.lang === 'en' ? 'Proposal' : 'العرض'),
    sections: S,
    general: { fields: [
      { id: 'style', type: 'select', label: L('أي شكل نعرضه على العميل؟', 'Which style do we show the client?'), options: [{ v: 'marsh', ar: 'مارش', en: 'Marsh' }, { v: 'mm', ar: 'ميت موت', en: 'Meat Moot' }, { v: 'smoke', ar: 'دخان', en: 'Smoke' }, { v: 'mono', ar: 'أبيض وأسود', en: 'Mono' }, { v: 'fire', ar: 'نار', en: 'Fire' }] },
      { id: 'mode', type: 'select', label: L('فاتح أو داكن؟', 'Light or dark?'), options: [{ v: 'dark', ar: 'داكن', en: 'Dark' }, { v: 'light', ar: 'فاتح', en: 'Light' }] },
      { id: 'proof', type: 'textarea', label: L('أعمال سابقة نعرضها، بموافقة أصحابها (مثل أونكس)', 'Past work we may show, with permission (e.g. Onyx)'), rows: 3 },
      { id: 'shooter', type: 'text', label: L('من يصوّر في إربد، ومن أين؟', 'Who shoots in Irbid, and from where?') },
    ] },
    targets() {
      return [...document.querySelectorAll('main > section[id], main > .pin-spacer > section[id]')].map((s) => ({ el: s, key: s.id, label: (s.querySelector('h1,h2')?.textContent || s.id).trim().slice(0, 80) }));
    },
  };
})();
