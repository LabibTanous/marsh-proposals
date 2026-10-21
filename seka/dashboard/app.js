/* Brands by SEKA — client portal mockup by Marsh. Client side only.
   - REAL: the numbers read on the call of 16 Oct 2026 (baseline), the arabplaces.com rating,
     the Irbid menu and prices (meatmoot.com.tr/menu/meatmootirbid), the address.
   - Everything else is SAMPLE and carries the "Sample / عينة" badge.
   - Demo date: Tue 3 Nov 2026. Work started Tue 20 Oct. Second-floor opening: Sat 24 Oct.
   - The owner's name is not known. The UI says "the owner" only. */
'use strict';

/* ======================================================================
   1. Shared strings — [Arabic, English]. View text uses T(ar, en) in place.
   ====================================================================== */
const S = {
  marsh: ['مارش', 'Marsh'],
  portal_title: ['بوابة Brands by SEKA', 'Brands by SEKA portal'],
  by_marsh: ['بوابة العميل من مارش', 'Client portal by Marsh'],
  switch_lang: ['English', 'العربية'],
  switch_lang_label: ['Switch to English', 'التبديل إلى العربية'],
  skip: ['انتقل إلى المحتوى', 'Skip to content'],
  menu: ['القائمة', 'Menu'],
  more: ['المزيد', 'More'],
  close: ['إغلاق', 'Close'],
  cancel: ['إلغاء', 'Cancel'],
  save: ['حفظ', 'Save'],
  send: ['إرسال', 'Send'],
  prev: ['السابق', 'Previous'],
  next: ['التالي', 'Next'],
  open: ['فتح', 'Open'],
  all: ['الكل', 'All'],
  undo: ['تراجع', 'Undo'],
  undone: ['تم التراجع', 'Undone'],
  show_more: ['عرض المزيد ({n})', 'Show more ({n})'],
  show_less: ['عرض أقل', 'Show less'],
  sample: ['عينة', 'Sample'],
  needs: ['مطلوب: {x}', 'needs: {x}'],
  none: ['لا شيء', 'Nothing'],
  dash: ['—', '—'],
  today: ['اليوم', 'Today'],
  tomorrow: ['غداً', 'Tomorrow'],
  yesterday: ['أمس', 'Yesterday'],
  status: ['الحالة', 'Status'],
  retry: ['إعادة المحاولة', 'Try again'],
  loading: ['جارٍ التحميل', 'Loading'],
  err_title: ['تعذّر تحميل البيانات', 'The data did not load'],
  err_body: ['انقطع الاتصال بالخادم. لم يتغير شيء. أعد المحاولة.', 'The server did not answer. Nothing changed. Try again.'],
  baseline: ['الأساس، 16 أكتوبر', 'Baseline, 16 Oct'],
  baseline_v: ['الأساس، 16 أكتوبر: {v}', 'Baseline, 16 Oct: {v}'],
  ago: ['قبل {n}', '{n} ago'],
  in_n: ['بعد {n}', 'in {n}'],
  table_view: ['عرض كجدول', 'Show as a table'],
  real_build: ['يعمل هذا في النسخة الفعلية.', 'This works in the real build.'],
  owner: ['صاحب المطعم', 'Owner'],
  approve: ['موافقة', 'Approve'],
  request_changes: ['طلب تعديل', 'Request changes'],
  changes_label: ['ما الذي تريد تعديله؟', 'What should change?'],
  changes_help: ['اكتب ملاحظة واحدة واضحة. تصل إلى فريق مارش.', 'Write one clear note. It goes to the Marsh team.'],
  changes_err: ['اكتب الملاحظة أولاً.', 'Write the note first.'],
  approved: ['موافق عليه', 'Approved'],
  undo_approval: ['إلغاء الموافقة', 'Undo approval'],
  your_note: ['ملاحظتك', 'Your note'],
  n_handle: ['المعرّف', 'handle'],
  n_target: ['الهدف', 'target'],
  n_cafe_name: ['اسم الكافيه', 'café name'],
  n_budget: ['الميزانية الشهرية', 'monthly budget'],
  jod: ['دينار', 'JOD'],
  act_failed: ['لم يُحفظ التغيير. أعد المحاولة.', 'The change was not saved. Try again.'],
  view_failed_t: ['تعذّر عرض هذه الصفحة', 'This page did not display'],
  view_failed_b: ['حدث خطأ في النموذج نفسه، وليس في الاتصال. أعد تحميل الصفحة.', 'The mockup hit an error, not the connection. Reload the page.'],
  reload: ['أعد التحميل', 'Reload'],
  mb_nostore: ['الإعدادات لا تُحفظ في هذا المتصفح.', 'Settings are not saved in this browser.'],

  // mockup bar
  mb_title: ['أدوات النموذج', 'Mockup controls'],
  mb_note: ['ليست جزءاً من المنتج. القيم المعلّمة «عينة» ليست بيانات حقيقية.', 'Not part of the product. Values marked "Sample" are not real data.'],
  mb_state: ['الحالة', 'State'],
  mb_data: ['بيانات', 'Data'],
  mb_empty: ['فارغ', 'Empty'],
  mb_loading: ['تحميل', 'Loading'],
  mb_error: ['خطأ', 'Error'],
  mb_samples: ['قيم العينة', 'Sample values'],
  mb_on: ['تشغيل', 'On'],
  mb_off: ['إيقاف', 'Off'],
  mb_theme: ['المظهر', 'Theme'],
  mb_light: ['فاتح', 'Light'],
  mb_dark: ['داكن', 'Dark'],

  // tabs
  tab_home: ['الرئيسية', 'Home'],
  tab_content: ['المحتوى', 'Content'],
  tab_messages: ['الرسائل', 'Messages'],
  tab_loyalty: ['بطاقة الولاء', 'Loyalty'],
  tab_loyalty_short: ['الولاء', 'Loyalty'],
  tab_offers: ['العروض', 'Offers'],
  tab_reviews: ['التقييمات', 'Reviews'],
  tab_ads: ['الإعلانات', 'Ads'],
  tab_opening: ['الافتتاح', 'Opening'],
  tab_report: ['التقرير', 'Report'],
};

/* ======================================================================
   2. Data
   ====================================================================== */
const ISO = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const TODAY = new Date(2026, 10, 3, 10, 0); // Tue 3 Nov 2026, 10:00 — demo date
const TODAY_ISO = ISO(2026, 11, 3);
const START = ISO(2026, 10, 20);   // sample: work starts Tue 20 Oct
const OPENING = ISO(2026, 10, 24); // the owner planned the party for about 23–24 Oct (call, 16 Oct)

const CLIENT = {
  name: { ar: 'Brands by SEKA', en: 'Brands by SEKA' },
  place: { ar: 'شارع وصفي التل، إربد', en: 'Wasfi Al-Tal St, Irbid' },
};
const PLAT = {
  ig: { ar: 'إنستغرام', en: 'Instagram', icon: 'instagram' },
  fb: { ar: 'فيسبوك', en: 'Facebook', icon: 'facebook' },
};

/* REAL — read on the call, 16 Oct 2026 (Instagram), and arabplaces.com */
const BASE = { followers: 17000, views: 500, likes: 5, story: '60–70', jo: 54, tn: 25, irbid: 6, ap: 4.9, apN: 35 };

/* REAL — Irbid menu, meatmoot.com.tr/menu/meatmootirbid. Photos are franchise menu photos (assets/food/SOURCES.md) */
const FOOD = {
  'lamb-shoulder': { ar: 'كتف خروف مدخّن', en: 'Smoked lamb shoulder', p: 35 },
  'lamb-shoulder-plate': { ar: 'كتف خروف مدخّن', en: 'Smoked lamb shoulder', p: 35 },
  'lamb-ribs': { ar: 'ريش خروف مدخّنة', en: 'Smoked lamb ribs', p: 37 },
  'lamb-ribs-rack': { ar: 'ريش خروف مدخّنة', en: 'Smoked lamb ribs', p: 37 },
  'lamb-shank': { ar: 'موزات خروف مدخّنة', en: 'Smoked lamb shank', p: 35 },
  'lamb-neck': { ar: 'رقبة خروف مدخّنة', en: 'Smoked lamb neck', p: 35 },
  brisket: { ar: 'بريسكت بقري مدخّن', en: 'Smoked beef brisket', p: 37 },
  'beef-short-ribs': { ar: 'ريش بقر مدخّنة', en: 'Smoked beef ribs', p: 37 },
  'beef-shank': { ar: 'موزات بقر مدخّنة', en: 'Smoked beef shank', p: 35 },
};
const IMG = (id) => `assets/food/${id}.webp`;

const KIND = {
  reel: { ar: 'ريل', en: 'Reel', icon: 'video' },
  post: { ar: 'منشور', en: 'Post', icon: 'image' },
  carousel: { ar: 'منشور صور', en: 'Carousel', icon: 'layers' },
  stories: { ar: 'قصص', en: 'Stories', icon: 'circle' },
};
const SERIES = {
  cleaver: { ar: 'التقطيع بالساطور أمام الضيف', en: 'Cleaver slicing at the table' },
  smoker: { ar: 'المدخنة: 16 ساعة', en: 'The smoker: 16 hours' },
  pitmaster: { ar: 'معلم الشوي', en: 'The pitmaster' },
  sides: { ar: 'الصوصات والسلطات بلا حدود', en: 'Unlimited sauces and salads' },
  kilos: { ar: 'كم كيلو لـ 4 أشخاص؟', en: 'How many kilos for 4 people?' },
};

/* SAMPLE — posts. stage: posted | scheduled | review | bank. appr: approved | pending | changes */
const POSTS0 = [
  { id: 'p1', kind: 'reel', plat: ['ig', 'fb'], t: { ar: 'تشويقة الطابق الأول', en: 'First floor teaser' }, ph: 'coffee', date: ISO(2026, 10, 21), time: '19:00', stage: 'posted', appr: 'approved', series: 'opening' },
  { id: 'p2', kind: 'post', plat: ['ig', 'fb'], t: { ar: 'الافتتاح: السبت 24 أكتوبر', en: 'Opening: Saturday 24 Oct' }, ph: 'flag', date: ISO(2026, 10, 22), time: '19:00', stage: 'posted', appr: 'approved', series: 'opening' },
  { id: 'p3', kind: 'reel', plat: ['ig', 'fb'], t: { ar: 'ليلة الافتتاح', en: 'Opening night' }, ph: 'flag', date: ISO(2026, 10, 24), time: '22:30', stage: 'posted', appr: 'approved', series: 'opening' },
  { id: 'p4', kind: 'post', plat: ['ig', 'fb'], t: { ar: 'عرض أسبوع الافتتاح', en: 'Opening week offer' }, img: 'lamb-shoulder-plate', date: ISO(2026, 10, 26), time: '19:00', stage: 'posted', appr: 'approved', series: 'opening' },
  { id: 'p5', kind: 'reel', plat: ['ig', 'fb'], t: SERIES.cleaver, img: 'lamb-shoulder', date: ISO(2026, 10, 29), time: '19:00', stage: 'posted', appr: 'approved', series: 'cleaver' },
  { id: 'p6', kind: 'reel', plat: ['ig', 'fb'], t: { ar: '14 صوصاً و7 سلطات', en: '14 sauces and 7 salads' }, img: 'lamb-ribs-rack', date: ISO(2026, 11, 1), time: '20:00', stage: 'posted', appr: 'approved', series: 'sides' },
  { id: 'p7', kind: 'reel', plat: ['ig', 'fb'], t: SERIES.smoker, img: 'brisket', date: ISO(2026, 11, 3), time: '19:00', stage: 'scheduled', appr: 'approved', series: 'smoker' },
  { id: 'p8', kind: 'carousel', plat: ['ig', 'fb'], t: SERIES.kilos, img: 'lamb-ribs', date: ISO(2026, 11, 4), time: '19:00', stage: 'review', appr: 'pending', sent: ISO(2026, 11, 2), series: 'kilos',
    cap: { ar: 'لـ 4 أشخاص: كيلو ونصف إلى كيلوين. الطلب يبدأ من 500 غرام. مع كل طلب 14 صوصاً و7 سلطات وأرز ومشروبات بلا حدود.', en: 'For 4 people: 1.5 to 2 kg. Orders start at 500 g. Every order comes with 14 sauces, 7 salads, rice and drinks, unlimited.' } },
  { id: 'p9', kind: 'reel', plat: ['ig', 'fb'], t: SERIES.pitmaster, ph: 'camera', date: ISO(2026, 11, 5), time: '19:00', stage: 'review', appr: 'pending', sent: ISO(2026, 11, 2), series: 'pitmaster',
    cap: { ar: 'يبدأ يومه قبل الفجر. اللحم يبقى في المدخنة 16 ساعة قبل أن يصل إلى طاولتك.', en: 'His day starts before dawn. The meat stays in the smoker for 16 hours before it reaches your table.' } },
  { id: 'p10', kind: 'post', plat: ['ig', 'fb'], t: { ar: 'الجمعة: اطلب بالوزن', en: 'Friday: order by weight' }, img: 'beef-short-ribs', date: ISO(2026, 11, 6), time: '13:00', stage: 'scheduled', appr: 'approved', series: 'kilos' },
  { id: 'p11', kind: 'reel', plat: ['ig', 'fb'], t: SERIES.sides, img: 'lamb-neck', date: ISO(2026, 11, 7), time: '19:00', stage: 'review', appr: 'changes', sent: ISO(2026, 11, 1), series: 'sides',
    note: { ar: 'خلّوا الفيديو أقصر، والتركيز على السلطات.', en: 'Make the video shorter, and focus on the salads.' },
    cap: { ar: '14 صوصاً و7 سلطات وأرز ومشروبات. كلها مع طلبك، بلا حدود.', en: '14 sauces, 7 salads, rice and drinks. All with your order, unlimited.' } },
  { id: 'p12', kind: 'post', plat: ['ig', 'fb'], t: { ar: 'ريش الخروف: 37 دينار للكيلو', en: 'Lamb ribs: 37 JOD/kg' }, img: 'lamb-ribs-rack', date: ISO(2026, 11, 8), time: '19:00', stage: 'review', appr: 'pending', sent: ISO(2026, 11, 2), series: 'menu',
    cap: { ar: 'ريش خروف مدخّنة، 37 دينار للكيلو. الطلب يبدأ من 500 غرام.', en: 'Smoked lamb ribs, 37 JOD/kg. Orders start at 500 g.' } },
  { id: 'p13', kind: 'reel', plat: ['ig', 'fb'], t: { ar: 'الطابق الأول: المطعم والكافيه', en: 'First floor: restaurant and café' }, ph: 'coffee', date: ISO(2026, 11, 9), time: '19:00', stage: 'scheduled', appr: 'approved', series: 'opening' },
  { id: 'p14', kind: 'reel', plat: ['ig', 'fb'], t: { ar: 'الساطور: ريش الخروف', en: 'The cleaver: lamb ribs' }, img: 'lamb-ribs', date: ISO(2026, 11, 10), time: '19:00', stage: 'bank', appr: 'approved', series: 'cleaver' },
  { id: 'p15', kind: 'reel', plat: ['ig', 'fb'], t: { ar: 'بريسكت بقري: 37 دينار للكيلو', en: 'Beef brisket: 37 JOD/kg' }, img: 'brisket', date: ISO(2026, 11, 11), time: '20:00', stage: 'bank', appr: 'approved', series: 'menu' },
  { id: 'p16', kind: 'reel', plat: ['ig', 'fb'], t: { ar: 'كم كيلو لـ 8 أشخاص؟', en: 'How many kilos for 8 people?' }, img: 'beef-shank', date: ISO(2026, 11, 12), time: '19:00', stage: 'bank', appr: 'approved', series: 'kilos' },
  { id: 'p17', kind: 'post', plat: ['ig', 'fb'], t: { ar: 'موزات الخروف', en: 'Lamb shank' }, img: 'lamb-shank', date: ISO(2026, 11, 13), time: '13:00', stage: 'bank', appr: 'approved', series: 'menu' },
  { id: 'p18', kind: 'reel', plat: ['ig', 'fb'], t: { ar: 'المدخنة من الداخل', en: 'Inside the smoker' }, ph: 'camera', date: ISO(2026, 11, 14), time: '19:00', stage: 'bank', appr: 'approved', series: 'smoker' },
  { id: 'p19', kind: 'reel', plat: ['ig', 'fb'], t: { ar: 'معلم الشوي: الساعة 5 صباحاً', en: 'The pitmaster: 5 am' }, ph: 'camera', date: ISO(2026, 11, 16), time: '19:00', stage: 'bank', appr: 'approved', series: 'pitmaster' },
];
/* SAMPLE — daily stories, 3–5 a day */
const STORIES0 = [];
for (let d = 20; d <= 47; d++) {
  const dt = new Date(2026, 9, d);
  const iso = ISO(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
  STORIES0.push({ id: 'st' + iso, kind: 'stories', plat: ['ig', 'fb'], n: 3 + (d % 3), date: iso, time: '12:00', stage: iso < TODAY_ISO ? 'posted' : 'scheduled' });
}
/* SAMPLE — fixed shoot day: every Thursday, 10:00–14:00 */
const SHOOTS0 = [
  { id: 's1', date: ISO(2026, 10, 20), t: { ar: 'تصوير البداية: المدخنة، الساطور، أطباق المنيو', en: 'Kickoff: the smoker, the cleaver, menu items' } },
  { id: 's2', date: ISO(2026, 10, 22), t: { ar: 'تشويقة الطابق الأول', en: 'First floor teaser' } },
  { id: 's3', date: ISO(2026, 10, 24), t: { ar: 'ليلة الافتتاح', en: 'Opening night' } },
  { id: 's4', date: ISO(2026, 10, 29), t: { ar: 'معلم الشوي، الصوصات والسلطات، والعلامات الثلاث', en: 'The pitmaster, sauces and salads, all 3 brands' } },
  { id: 's5', date: ISO(2026, 11, 5), t: { ar: 'يوم التصوير الثابت', en: 'Fixed shoot day' }, list: [
    { ar: 'فتح المدخنة بعد 16 ساعة', en: 'Opening the smoker after 16 hours' },
    { ar: 'لقطات قريبة للتقطيع بالساطور', en: 'Close-ups of the cleaver slicing' },
    { ar: '«كم كيلو لـ 4 أشخاص؟» مع أصدقاء كنماذج', en: '"How many kilos for 4?" with friends as models' },
    { ar: 'مشهور وشاورما نشمي في اليوم نفسه', en: 'Mashhoor and Nashmi Shawarma on the same day' },
  ] },
  { id: 's6', date: ISO(2026, 11, 12), t: { ar: 'يوم التصوير الثابت', en: 'Fixed shoot day' } },
];

/* SAMPLE — DM conversations. who: c customer · ai · staff · sys */
const ROUTE = { cashier: { ar: 'الكاشير', en: 'Cashier' }, manager: { ar: 'المدير', en: 'Manager' }, cafe: { ar: 'الكافيه', en: 'Café' } };
const TOPIC = {
  booking: { ar: 'حجز طاولة', en: 'Table booking' }, order: { ar: 'طلب', en: 'Order' }, pickup: { ar: 'استلام', en: 'Pickup' },
  group: { ar: 'مجموعات وعزائم', en: 'Groups and catering' }, cafe: { ar: 'سؤال عن الكافيه', en: 'Café question' }, question: { ar: 'سؤال', en: 'Question' }, complaint: { ar: 'شكوى', en: 'Complaint' },
};
const CONVOS0 = [
  { id: 'c1', who: 'سامر', whoEn: 'Samer', ch: 'ig', topic: 'booking', status: 'ai', at: '09:12', day: TODAY_ISO, msgs: [
    { w: 'c', ar: 'مرحبا، بدي احجز طاولة لـ 4 بكرا الساعة 8', en: 'Hi, I want to book a table for 4 tomorrow at 8.', tm: '09:12' },
    { w: 'ai', ar: 'أهلين! أكيد، الحجز لـ 4 أشخاص بكرا الساعة 8 مساءً. شو الاسم ورقم التلفون؟', en: 'Hello! Sure, a booking for 4 people tomorrow at 8 pm. What is your name and phone number?', tm: '09:12' },
    { w: 'c', ar: 'سامر، \u2066079 ••• ••41\u2069', en: 'Samer, 079 ••• ••41', tm: '09:13' },
    { w: 'ai', ar: 'تمام يا سامر. حجزنا طاولة لـ 4 أشخاص بكرا الأربعاء الساعة 8 مساءً. بتوصلك رسالة تذكير قبل الموعد بساعتين.', en: 'Done, Samer. A table for 4 is booked for tomorrow, Wednesday, at 8 pm. You get a reminder 2 hours before.', tm: '09:13' },
    { w: 'sys', ar: 'نسخة من الحجز إلى: الكاشير', en: 'Copy of the booking to: Cashier' },
  ] },
  { id: 'c2', who: 'رنا', whoEn: 'Rana', ch: 'ig', topic: 'order', status: 'ai', at: '08:47', day: TODAY_ISO, msgs: [
    { w: 'c', ar: 'قديش لازم نطلب لـ 4 أشخاص؟', en: 'How much should we order for 4 people?', tm: '08:47' },
    { w: 'ai', ar: 'لـ 4 أشخاص بننصح بكيلو ونص لكيلوين. الطلب بيبدأ من 500 غرام، ومع كل طلب 14 صوص و7 سلطات ورز ومشروبات بدون حدود.', en: 'For 4 people we suggest 1.5 to 2 kg. Orders start at 500 g. Every order comes with 14 sauces, 7 salads, rice and drinks, unlimited.', tm: '08:47' },
    { w: 'c', ar: 'وقديش سعر الكيلو؟', en: 'And the price per kilo?', tm: '08:49' },
    { w: 'ai', ar: 'لحم الخروف المدخّن 35 دينار للكيلو، والريش 37 دينار للكيلو. بتحب تحجز طاولة ولا تطلب استلام؟', en: 'Smoked lamb is 35 JOD/kg and ribs are 37 JOD/kg. Do you want to book a table or order for pickup?', tm: '08:49' },
  ] },
  { id: 'c4', who: 'لين', whoEn: 'Leen', ch: 'ig', topic: 'group', status: 'waiting', route: 'manager', at: '08:05', day: TODAY_ISO, msgs: [
    { w: 'c', ar: 'عنا عزومة 25 شخص يوم الجمعة. بتعملوا طلبات للمجموعات؟', en: 'We have a dinner for 25 people on Friday. Do you take group orders?', tm: '08:05' },
    { w: 'ai', ar: 'أهلين! طلبات المجموعات والعزايم بيرتّبها مدير المطعم. حوّلت سؤالك إله، وبيرد عليك اليوم.', en: 'Hello! The restaurant manager arranges group and event orders. I sent your question to him. He replies today.', tm: '08:05' },
    { w: 'sys', kind: 'handover' },
  ] },
  { id: 'c5', who: 'محمد', whoEn: 'Mohammad', ch: 'ig', topic: 'cafe', status: 'waiting', route: 'cafe', at: '23:40', day: ISO(2026, 11, 2), msgs: [
    { w: 'c', ar: 'الطابق الجديد فيه قهوة مختصة؟', en: 'Does the new floor serve specialty coffee?', tm: '23:40' },
    { w: 'ai', ar: 'الطابق الأول فيه مطعم وكافيه. حوّلت سؤال القهوة لفريق الكافيه، وبيردوا عليك الصبح.', en: 'The first floor has a restaurant and a café. I sent the coffee question to the café team. They reply in the morning.', tm: '23:40' },
    { w: 'sys', kind: 'handover' },
  ] },
  { id: 'c3', who: 'أحمد', whoEn: 'Ahmad', ch: 'fb', topic: 'pickup', status: 'staff', route: 'cashier', at: '20:41', day: ISO(2026, 11, 2), msgs: [
    { w: 'c', ar: 'بدي كيلو ريش تيك أواي، بقدر استلمه الساعة 9؟', en: 'I want 1 kg of ribs to take away. Can I pick it up at 9?', tm: '20:41' },
    { w: 'ai', ar: 'أكيد. طلب كيلو ريش خروف (37 دينار) للاستلام الساعة 9 مساءً. بحوّل الطلب للكاشير ليأكد الوقت.', en: 'Sure. 1 kg of lamb ribs (37 JOD) for pickup at 9 pm. I am sending the order to the cashier to confirm the time.', tm: '20:41' },
    { w: 'sys', kind: 'handover' },
    { w: 'staff', role: 'cashier', ar: 'تم، الطلب جاهز الساعة 9. شو الاسم؟', en: 'Done, the order is ready at 9. What is the name?', tm: '20:44' },
    { w: 'c', ar: 'أحمد', en: 'Ahmad', tm: '20:45' },
  ] },
  { id: 'c6', who: 'هبة', whoEn: 'Heba', ch: 'fb', topic: 'question', status: 'ai', at: '19:02', day: ISO(2026, 11, 2), msgs: [
    { w: 'c', ar: 'وين موقعكم بالزبط؟', en: 'Where exactly are you?', tm: '19:02' },
    { w: 'ai', ar: 'إحنا بشارع وصفي التل بإربد. هاد رابط الموقع على الخريطة.', en: 'We are on Wasfi Al-Tal St in Irbid. Here is the map link.', tm: '19:02', link: 'Google Maps' },
  ] },
  { id: 'c7', who: 'يزن', whoEn: 'Yazan', ch: 'ig', topic: 'question', status: 'ai', at: '17:26', day: ISO(2026, 11, 2), msgs: [
    { w: 'c', ar: 'السلطات والصوصات مع الطلب ولا بتنحسب لحال؟', en: 'Are the salads and sauces included, or extra?', tm: '17:26' },
    { w: 'ai', ar: 'مع كل طلب: 14 صوص و7 سلطات ورز ومشروبات، وكلها بدون حدود وبدون حساب إضافي.', en: 'Every order includes 14 sauces, 7 salads, rice and drinks. All unlimited, at no extra cost.', tm: '17:26' },
    { w: 'c', ar: 'حلو، شكراً', en: 'Great, thanks.', tm: '17:27' },
    { w: 'ai', ar: 'أهلا وسهلا! بنستناك.', en: 'You are welcome! See you soon.', tm: '17:27' },
  ] },
  { id: 'c8', who: 'دانة', whoEn: 'Dana', ch: 'ig', topic: 'complaint', status: 'staff', route: 'manager', at: '13:10', day: ISO(2026, 11, 2), msgs: [
    { w: 'c', ar: 'طلبي امبارح تأخر 40 دقيقة.', en: 'My order yesterday was 40 minutes late.', tm: '13:10' },
    { w: 'ai', ar: 'آسفين على التأخير. حوّلت رسالتك لمدير المطعم ليتابعها معك.', en: 'Sorry for the delay. I sent your message to the restaurant manager to follow up with you.', tm: '13:10' },
    { w: 'sys', kind: 'handover' },
    { w: 'staff', role: 'manager', ar: 'مرحبا دانة، معك مدير المطعم. آسفين على التأخير، تابعنا الموضوع مع المطبخ. بنتشرف بزيارتك الجاية.', en: 'Hello Dana, this is the restaurant manager. Sorry for the delay. We checked it with the kitchen. We hope to see you again.', tm: '13:52' },
  ] },
];
/* SAMPLE — contacts captured with consent (masked) */
const CONTACTS0 = [
  { id: 'k1', who: 'سامر', whoEn: 'Samer', v: '079 ••• ••41', type: 'phone', d: ISO(2026, 11, 3), src: { ar: 'رسالة حجز', en: 'Booking DM' } },
  { id: 'k2', who: 'رنا', whoEn: 'Rana', v: 'r•••@gmail.com', type: 'mail', d: ISO(2026, 11, 2), src: { ar: 'رد على تعليق', en: 'Comment reply' } },
  { id: 'k3', who: 'يزن', whoEn: 'Yazan', v: '078 ••• ••09', type: 'phone', d: ISO(2026, 11, 2), src: { ar: 'إشارة في قصة', en: 'Story mention' } },
  { id: 'k4', who: 'هبة', whoEn: 'Heba', v: 'h•••@outlook.com', type: 'mail', d: ISO(2026, 11, 1), src: { ar: 'بطاقة الولاء', en: 'Loyalty card' } },
  { id: 'k5', who: 'محمد', whoEn: 'Mohammad', v: '077 ••• ••63', type: 'phone', d: ISO(2026, 10, 31), src: { ar: 'رد على تعليق', en: 'Comment reply' } },
  { id: 'k6', who: 'لين', whoEn: 'Leen', v: 'l•••@yahoo.com', type: 'mail', d: ISO(2026, 10, 30), src: { ar: 'مشاركة منشور', en: 'Post shared to DM' } },
];

/* SAMPLE — loyalty */
const SEGMENTS = [
  { id: 'bday', icon: 'cake', t: { ar: 'عيد ميلادهم هذا الأسبوع', en: 'Birthday this week' }, n: 6, note: { ar: 'من تاريخ الميلاد عند التسجيل', en: 'From the birth date at sign-up' } },
  { id: 'winback', icon: 'clock', t: { ar: 'لم يزوروا منذ 30 يوماً', en: 'Not seen for 30 days' }, n: 0, note: { ar: 'البطاقة بدأت 24 أكتوبر. أول الأسماء تظهر 23 نوفمبر.', en: 'Cards started on 24 Oct. The first names show on 23 Nov.' } },
  { id: 'group', icon: 'users', t: { ar: 'طلبات المجموعات والعزائم', en: 'Group and catering orders' }, n: 12, note: { ar: 'طلب 3 كغ أو أكثر، أو سؤال عن مجموعة', en: 'Order of 3 kg or more, or a group question' } },
];
const SEG_ALL = { id: 'all', t: { ar: 'كل حاملي البطاقة', en: 'All card holders' }, n: 214 };
const PUSHES0 = [
  { id: 'u1', seg: 'all', txt: { ar: 'عرض الويكند: 250 غرام زيادة مع كل كيلو. الجمعة والسبت.', en: 'Weekend offer: 250 g extra with every kilo. Friday and Saturday.' }, date: ISO(2026, 10, 30), time: '12:00', status: 'sent', reach: 198 },
  { id: 'u2', seg: 'bday', txt: { ar: 'كل عام وأنت بخير! هديتك عندنا: 200 غرام مع طلبك هذا الأسبوع.', en: 'Happy birthday! Your gift is here: 200 g with your order this week.' }, date: ISO(2026, 11, 5), time: '11:00', status: 'scheduled' },
  { id: 'u3', seg: 'all', txt: { ar: 'عرض الويكند: 250 غرام زيادة مع كل كيلو. الجمعة والسبت.', en: 'Weekend offer: 250 g extra with every kilo. Friday and Saturday.' }, date: ISO(2026, 11, 6), time: '12:00', status: 'scheduled' },
];

/* SAMPLE — one code per channel */
const CODES0 = [
  { id: 'o1', ch: { ar: 'إعلان إنستغرام', en: 'Instagram ad' }, icon: 'instagram', code: 'MMIG', offer: { ar: 'أول زيارة: 250 غرام زيادة مع كيلو', en: 'First visit: 250 g extra with 1 kg' }, n: 64, first: 51, on: true },
  { id: 'o3', ch: { ar: 'المؤثر A', en: 'Influencer A' }, icon: 'user', code: 'MMINFA', offer: { ar: 'أول زيارة: 250 غرام زيادة مع كيلو', en: 'First visit: 250 g extra with 1 kg' }, n: 38, first: 33, on: true },
  { id: 'o6', ch: { ar: 'رسالة التفاعل التلقائية', en: 'Engagement auto-message' }, icon: 'bot', code: 'MMDM', offer: { ar: 'أول زيارة: 250 غرام زيادة مع كيلو', en: 'First visit: 250 g extra with 1 kg' }, n: 31, first: 24, on: true },
  { id: 'o7', ch: { ar: 'إشعار بطاقة الولاء', en: 'Loyalty push' }, icon: 'wallet', code: 'MMWAL', offer: { ar: 'الويكند: 250 غرام زيادة مع كل كيلو', en: 'Weekend: 250 g extra with every kilo' }, n: 26, first: 4, on: true },
  { id: 'o2', ch: { ar: 'إعلان فيسبوك', en: 'Facebook ad' }, icon: 'facebook', code: 'MMFB', offer: { ar: 'أول زيارة: 250 غرام زيادة مع كيلو', en: 'First visit: 250 g extra with 1 kg' }, n: 22, first: 19, on: true },
  { id: 'o4', ch: { ar: 'المؤثر B', en: 'Influencer B' }, icon: 'user', code: 'MMINFB', offer: { ar: 'أول زيارة: 250 غرام زيادة مع كيلو', en: 'First visit: 250 g extra with 1 kg' }, n: 17, first: 15, on: false },
  { id: 'o5', ch: { ar: 'رمز QR للتقييم على Google', en: 'Google review QR' }, icon: 'qr', code: 'MMQR', offer: { ar: 'الزيارة التالية: 250 غرام زيادة', en: 'Next visit: 250 g extra' }, n: 9, first: 2, on: true },
];

/* SAMPLE — Google Maps reviews and weekly trend */
const REVIEWS0 = [
  { id: 'r1', who: 'خالد م.', whoEn: 'Khaled M.', stars: 5, date: ISO(2026, 11, 2), txt: { ar: 'اللحمة طرية والخدمة سريعة. الصوصات كثيرة وكلها طيبة.', en: 'The meat is tender and the service is fast. Many sauces, all good.' }, reply: { ar: 'شكراً يا خالد! ننتظرك مرة ثانية.', en: 'Thank you, Khaled! See you again.' }, status: 'draft' },
  { id: 'r2', who: 'نور ع.', whoEn: 'Nour A.', stars: 3, date: ISO(2026, 11, 1), txt: { ar: 'الأكل طيب، بس السعر عالي شوي.', en: 'The food is good, but the price is a bit high.' }, reply: { ar: 'شكراً على رأيك يا نور. السعر بالكيلو، والطلب يبدأ من 500 غرام، ومعه 14 صوصاً و7 سلطات وأرز ومشروبات بلا حدود. أهلاً بك في أي وقت.', en: 'Thank you for your view, Nour. The price is per kilo and orders start at 500 g. Each order includes 14 sauces, 7 salads, rice and drinks, unlimited. You are welcome any time.' }, status: 'draft' },
  { id: 'r3', who: 'عمر ق.', whoEn: 'Omar Q.', stars: 2, date: ISO(2026, 10, 31), txt: { ar: 'الموزات كانت ناشفة هالمرة.', en: 'The shank was dry this time.' }, reply: { ar: 'نعتذر عن هذه التجربة يا عمر. وصلت ملاحظتك إلى مدير المطعم ليتابعها مع المطبخ.', en: 'We are sorry for this, Omar. Your note went to the restaurant manager to check with the kitchen.' }, status: 'draft', flag: true },
  { id: 'r4', who: 'سارة ب.', whoEn: 'Sara B.', stars: 5, date: ISO(2026, 10, 30), txt: { ar: 'أجواء الطابق الجديد حلوة، والتقطيع قدامك ممتع.', en: 'The new floor feels good, and the slicing at the table is fun to watch.' }, reply: { ar: 'شكراً يا سارة! نراك قريباً في الطابق الأول.', en: 'Thank you, Sara! See you soon on the first floor.' }, status: 'replied', repliedOn: ISO(2026, 10, 31) },
  { id: 'r5', who: 'مالك ح.', whoEn: 'Malek H.', stars: 4, date: ISO(2026, 10, 27), txt: { ar: 'تجربة حلوة، بس الانتظار كان طويل ليلة الافتتاح.', en: 'A good visit, but the wait was long on opening night.' }, reply: { ar: 'شكراً يا مالك على ملاحظتك. وصلت إلى مدير المطعم.', en: 'Thank you for your note, Malek. It went to the restaurant manager.' }, status: 'replied', repliedOn: ISO(2026, 10, 28) },
];
const REVIEW_WEEKS = [ // week starting Sunday
  { w: ISO(2026, 9, 13), n: 1, r: 4.4 }, { w: ISO(2026, 9, 20), n: 0, r: 4.4 }, { w: ISO(2026, 9, 27), n: 2, r: 4.4 }, { w: ISO(2026, 10, 4), n: 1, r: 4.4 },
  { w: ISO(2026, 10, 11), n: 1, r: 4.4 }, { w: ISO(2026, 10, 18), n: 4, r: 4.5 }, { w: ISO(2026, 10, 25), n: 11, r: 4.6 }, { w: ISO(2026, 11, 1), n: 5, r: 4.6 },
];
const GMAPS = { rating: 4.6, n: 58, qrScans: 140 };

/* SAMPLE — Meta ads. Budget is paid by the restaurant, separate from Marsh's fee */
const ADS = { budget: 300, radiusKm: 3 };
const AUDIENCES = [
  { id: 'a1', icon: 'target', t: { ar: 'دائرة 3 كم حول شارع وصفي التل', en: '3 km around Wasfi Al-Tal St' }, d: { ar: 'العمر \u206618–45\u2069', en: 'Age 18–45' } },
  { id: 'a2', icon: 'users', t: { ar: 'جمهور مشابه 1% في الأردن', en: 'Lookalike 1%, Jordan' }, d: { ar: 'مبني من 1,240 شخصاً تفاعلوا خلال 60 يوماً', en: 'Built from 1,240 people who engaged in 60 days' } },
  { id: 'a3', icon: 'eye', t: { ar: 'من شاهد نصف ريل أو أكثر', en: 'People who watched half a reel or more' }, d: { ar: 'إعادة استهداف، 30 يوماً', en: 'Retargeting, 30 days' } },
];
const CAMPAIGNS0 = [
  { id: 'k1', t: { ar: 'أسبوع الافتتاح · دائرة 3 كم', en: 'Opening week · 3 km radius' }, aud: 'a1', goal: { ar: 'رسائل', en: 'Messages' }, budget: 120, spent: 120, res: { ar: '186 رسالة', en: '186 messages' }, from: ISO(2026, 10, 21), to: ISO(2026, 10, 31), status: 'ended' },
  { id: 'k2', t: { ar: 'عرض أول زيارة · جمهور مشابه', en: 'First-visit offer · lookalike' }, aud: 'a2', goal: { ar: 'رسائل', en: 'Messages' }, budget: 100, spent: 22, res: { ar: '61 رسالة', en: '61 messages' }, from: ISO(2026, 11, 1), to: ISO(2026, 11, 30), status: 'active' },
  { id: 'k3', t: { ar: 'ريل الساطور · مشاهدات', en: 'Cleaver reel · views' }, aud: 'a3', goal: { ar: 'مشاهدات', en: 'Views' }, budget: 80, spent: 0, res: null, from: ISO(2026, 11, 5), to: ISO(2026, 11, 30), status: 'paused' },
];

/* SAMPLE — second-floor opening (the date comes from the call) */
const LAUNCH0 = [
  { id: 'l1', t: { ar: 'هوية الكافيه: الشعار والألوان واللافتة', en: 'Café identity: logo, colours, sign' }, due: ISO(2026, 10, 21), who: 'marsh', done: ISO(2026, 10, 21), needsName: true },
  { id: 'l2', t: { ar: 'تصميم منيو الطابق الأول', en: 'First floor menu design' }, due: ISO(2026, 10, 22), who: 'marsh', done: ISO(2026, 10, 22) },
  { id: 'l3', t: { ar: 'التشويقة: ريل ومنشور', en: 'Teaser: a reel and a post' }, due: ISO(2026, 10, 22), who: 'marsh', done: ISO(2026, 10, 22) },
  { id: 'l4', t: { ar: 'ملخصات المؤثرين (4)', en: 'Influencer briefs (4)' }, due: ISO(2026, 10, 21), who: 'marsh', done: ISO(2026, 10, 21) },
  { id: 'l5', t: { ar: 'موافقة صاحب المطعم على العرض والمنيو', en: 'Owner approves the offer and the menu' }, due: ISO(2026, 10, 22), who: 'owner', done: ISO(2026, 10, 23) },
  { id: 'l6', t: { ar: 'ليلة الافتتاح: تصوير وقصص مباشرة', en: 'Opening night: shoot and live stories' }, due: OPENING, who: 'marsh', done: OPENING },
  { id: 'l7', t: { ar: 'عرض أسبوع الافتتاح: كود لكل قناة', en: 'Opening week offer: one code per channel' }, due: ISO(2026, 10, 31), who: 'marsh', done: ISO(2026, 10, 31) },
  { id: 'l8', t: { ar: 'ريل ملخص الأسبوع الأول', en: 'First-week recap reel' }, due: ISO(2026, 11, 4), who: 'marsh', done: null, prog: true },
  { id: 'l9', t: { ar: 'إشعار شكر لبطاقات ليلة الافتتاح', en: 'Thank-you push to opening night cards' }, due: ISO(2026, 11, 5), who: 'marsh', done: null },
];
const INFLUENCERS0 = [
  { id: 'i1', name: { ar: 'المؤثر A', en: 'Influencer A' }, plat: 'ig', size: '48K', code: 'MMINFA', date: OPENING, status: 'posted', views: 21400 },
  { id: 'i2', name: { ar: 'المؤثر B', en: 'Influencer B' }, plat: 'ig', size: '31K', code: 'MMINFB', date: ISO(2026, 10, 25), status: 'posted', views: 12900 },
  { id: 'i3', name: { ar: 'المؤثر C', en: 'Influencer C' }, plat: 'ig', size: '12K', code: 'MMINFC', date: ISO(2026, 11, 6), status: 'accepted' },
  { id: 'i4', name: { ar: 'المؤثر D', en: 'Influencer D' }, plat: 'ig', size: '9K', code: 'MMINFD', date: ISO(2026, 11, 13), status: 'sent' },
];

/* Report — baseline is REAL (16 Oct); "this month" is SAMPLE; targets are not set */
const REPORT_ROWS = [
  { k: { ar: 'متابعو إنستغرام', en: 'Instagram followers' }, base: '17,000', now: '17,410' },
  { k: { ar: 'متوسط مشاهدات الفيديو', en: 'Views per video' }, base: '~500', now: '1,850' },
  { k: { ar: 'متوسط الإعجابات للمنشور', en: 'Likes per post' }, base: '~5', now: '36' },
  { k: { ar: 'مشاهدو القصة', en: 'Story viewers' }, base: '60–70', now: '150' },
  { k: { ar: 'الجمهور في إربد', en: 'Audience in Irbid' }, base: '6%', now: '10%' },
  { k: { ar: 'الجمهور في الأردن', en: 'Audience in Jordan' }, base: '54%', now: '63%' },
  { k: { ar: 'الجمهور في تونس', en: 'Audience in Tunisia' }, base: '25%', now: '19%' },
  { k: { ar: 'تقييم arabplaces.com', en: 'arabplaces.com rating' }, base: '4.9 (35)', now: null },
  { k: { ar: 'تقييم Google Maps', en: 'Google Maps rating' }, base: null, now: '4.6 (58)' },
  { k: { ar: 'رسائل ردّ عليها الذكاء الاصطناعي', en: 'DMs answered by AI' }, base: null, now: '34 / 42' },
  { k: { ar: 'متوسط وقت أول رد', en: 'Median first reply' }, base: null, now: { ar: '40 ث', en: '40 s' } },
  { k: { ar: 'بطاقات الولاء', en: 'Loyalty cards' }, base: null, now: '214' },
  { k: { ar: 'استخدام أكواد العروض', en: 'Offer codes used' }, base: null, now: '207' },
  { k: { ar: 'جهات اتصال بموافقة', en: 'Contacts with consent' }, base: null, now: '41' },
  { k: { ar: 'صرف الإعلانات', en: 'Ad spend' }, base: null, now: { ar: '142 من 300 دينار', en: '142 of 300 JOD' } },
];

/* ======================================================================
   3. State
   ====================================================================== */
const MEM = new Map();
const store = {
  failed: false,
  get(k, d) {
    try { const v = localStorage.getItem('mmportal.' + k); return v === null ? (MEM.has(k) ? MEM.get(k) : d) : JSON.parse(v); } catch (e) { store.failed = true; return MEM.has(k) ? MEM.get(k) : d; }
  },
  set(k, v) { MEM.set(k, v); try { localStorage.setItem('mmportal.' + k, JSON.stringify(v)); } catch (e) { store.failed = true; } },
};
/* a stored push draft is used only field by field, when each field is valid */
function cleanDraft(d) {
  if (!d || typeof d !== 'object') return null;
  const segs = ['all', ...SEGMENTS.map((x) => x.id)];
  return {
    seg: segs.includes(d.seg) ? d.seg : 'all',
    txt: typeof d.txt === 'string' ? d.txt.slice(0, 140) : '',
    date: typeof d.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.date) && d.date >= TODAY_ISO ? d.date : ISO(2026, 11, 6),
    time: typeof d.time === 'string' && /^\d{2}:\d{2}$/.test(d.time) ? d.time : '12:00',
  };
}
const params = new URLSearchParams(location.search);
const clone = (a) => a.map((x) => ({ ...x }));
const ST = {
  page: document.body.dataset.page,
  lang: params.get('lang') || store.get('lang', 'ar'),
  theme: params.get('theme') || store.get('theme', 'light'),
  samples: params.has('samples') ? params.get('samples') !== '0' : store.get('samples', true),
  mode: params.get('state') || 'data', // data | empty | loading | error
  posts: clone(POSTS0),
  convos: CONVOS0.map((x) => ({ ...x, msgs: x.msgs.map((m) => ({ ...m })) })),
  contacts: clone(CONTACTS0),
  pushes: clone(PUSHES0),
  codes: clone(CODES0),
  reviews: clone(REVIEWS0),
  campaigns: clone(CAMPAIGNS0),
  launch: clone(LAUNCH0),
  infl: clone(INFLUENCERS0),
  autoOn: true,
  expanded: new Set(),
  noteOpen: new Set(),
  err: {},
  ui: { cview: 'week', coff: 0, cday: TODAY_ISO, convo: 'c1', mfilter: 'all', wallet: 'apple', rfilter: 'all', pseg: 'all', editReply: null },
  draft: cleanDraft(store.get('pushDraft', null)),
  drafts: {},
  sheet: false,
};
if (!['ar', 'en'].includes(ST.lang)) ST.lang = 'ar';
if (!['light', 'dark'].includes(ST.theme)) ST.theme = 'light';
if (!['data', 'empty', 'loading', 'error'].includes(ST.mode)) ST.mode = 'data';
/* a mistyped mockup parameter is reported, never silently replaced */
for (const [k, ok] of [['lang', ['ar', 'en']], ['theme', ['light', 'dark']], ['state', ['data', 'empty', 'loading', 'error']]]) {
  const v = params.get(k);
  if (v !== null && !ok.includes(v)) console.warn(`mockup: ?${k}=${v} is not valid. Using the default.`);
}

/* ======================================================================
   4. Helpers
   ====================================================================== */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function t(key, vars) {
  const e = S[key];
  if (!e) return key;
  let s = e[ST.lang === 'ar' ? 0 : 1];
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
const T = (ar, en) => (ST.lang === 'ar' ? ar : en);
const L = (o) => (o == null ? '' : typeof o === 'string' ? o : o[ST.lang] ?? o.en);
const LOC = () => (ST.lang === 'ar' ? 'ar-u-ca-gregory-nu-latn' : 'en-GB');
const toD = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
const isoOf = (d) => ISO(d.getFullYear(), d.getMonth() + 1, d.getDate());
const addDays = (iso, n) => { const d = toD(iso); d.setDate(d.getDate() + n); return isoOf(d); };
const dayDiff = (a, b) => Math.round((new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate())) / 864e5);
function fd(iso, style = 'short') {
  if (!iso) return '';
  const d = typeof iso === 'string' ? toD(iso) : iso;
  const o = {
    short: { day: 'numeric', month: 'short' },
    day: { weekday: 'long', day: 'numeric', month: 'short' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    wd: { weekday: 'long' },
    narrow: { weekday: 'narrow' },
    month: { month: 'long', year: 'numeric' },
  }[style];
  return new Intl.DateTimeFormat(LOC(), o).format(d);
}
function ftime(hm) {
  if (!hm) return '';
  const [h, m] = hm.split(':').map(Number);
  return new Intl.DateTimeFormat(LOC(), { hour: 'numeric', minute: '2-digit' }).format(new Date(2026, 0, 1, h, m));
}
const fn = (n) => new Intl.NumberFormat(LOC()).format(n);
/* "n days" with Arabic number agreement */
function days(n) {
  if (ST.lang !== 'ar') return n === 1 ? '1 day' : `${fn(n)} days`;
  if (n === 1) return 'يوم واحد';
  if (n === 2) return 'يومين';
  const m = n % 100;
  if (m >= 3 && m <= 10) return `${fn(n)} أيام`;
  if (m >= 11 && m <= 99) return `${fn(n)} يوماً`;
  return `${fn(n)} يوم`;
}
function rel(iso) {
  const n = dayDiff(toD(iso), TODAY);
  if (n === 0) return t('today');
  if (n === 1) return t('tomorrow');
  if (n === -1) return t('yesterday');
  return fd(iso, 'day');
}
/* the word after a large day number: 3–10 أيام, 11–99 يوماً */
function dayWord(n) {
  if (ST.lang !== 'ar') return n === 1 ? 'day' : 'days';
  const m = n % 100;
  if (n === 1) return 'يوم';
  if (n === 2) return 'يومان';
  if (m >= 3 && m <= 10) return 'أيام';
  if (m >= 11 && m <= 99) return 'يوماً';
  return 'يوم';
}
const openingCount = (od) => `<b class="num">${fn(Math.abs(od))}</b><span>${od === 0 ? T('الافتتاح اليوم', 'The opening is today') : `${dayWord(Math.abs(od))} ${od > 0 ? T('حتى الافتتاح', 'to the opening') : T('منذ الافتتاح', 'since the opening')}`}</span>${sampleTag()}`;
const relDays = (iso) => { const n = dayDiff(toD(iso), TODAY); return n === 0 ? t('today') : n > 0 ? t('in_n', { n: days(n) }) : t('ago', { n: days(-n) }); };
const ltr = (s) => `<bdi dir="ltr" class="lat">${esc(s)}</bdi>`;
const bdi = (s, cls = 'lat') => `<bdi class="${cls}">${esc(s)}</bdi>`;
const pct = (n) => ltr(`${n}%`);
const sampleTag = (on = true) => (on ? `<span class="sample" title="${esc(t('mb_note'))}">${t('sample')}</span>` : '');
const needs = (key) => `<span class="needs">[ ${t('needs', { x: t(key) })} ]</span>`;
const who = (x) => (ST.lang === 'ar' ? x.who : x.whoEn);
/* sample values show only when sample rows are on and the page has data */
const SV = () => ST.samples && ST.mode === 'data';

/* icons — Lucide (ISC) path data */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  approve: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>',
  report: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chev: '<path d="m9 18 6-6-6-6"/>',
  chevb: '<path d="m15 18-6-6 6-6"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  alertc: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  chart: '<path d="M12 20V10M18 20V4M6 20v-4"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3-3a2 2 0 0 0-2.8 0L6 21"/>',
  play: '<path d="M6 4l14 8-14 8z"/>',
  dots: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  minus: '<path d="M5 12h14"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r=".5"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  bot: '<path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
  cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h4v4h-4"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v2M10 2v2M14 2v2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  trash: '<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  store: '<path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/>',
};
const DIR_ICONS = new Set(['chev', 'chevb', 'arrow', 'undo', 'send']);
function ic(name, cls = '') {
  const dir = DIR_ICONS.has(name) ? ' dir' : '';
  const fill = name === 'play' ? ' style="fill:currentColor;stroke:none"' : '';
  return `<svg class="ic ${cls}${dir}" viewBox="0 0 24 24" aria-hidden="true"${fill}>${ICONS[name] || ''}</svg>`;
}

/* ---------- derived data ---------- */
function db() {
  const on = SV();
  return {
    posts: on ? ST.posts : [],
    stories: on ? STORIES0 : [],
    shoots: on ? SHOOTS0 : [],
    convos: on ? ST.convos : [],
    contacts: on ? ST.contacts : [],
    pushes: on ? ST.pushes : [],
    codes: on ? ST.codes : [],
    reviews: on ? ST.reviews : [],
    weeks: on ? REVIEW_WEEKS : [],
    campaigns: on ? ST.campaigns : [],
    launch: on ? ST.launch : [],
    infl: on ? ST.infl : [],
    base: ST.mode === 'empty' ? null : BASE,
  };
}
const post = (id) => ST.posts.find((x) => x.id === id);
const byId = (arr, id) => arr.find((x) => x.id === id);

/* ---------- shared pieces ---------- */
function capped(id, arr, render, cap = 5) {
  if (!arr.length) return '';
  const open = ST.expanded.has(id);
  const shown = open ? arr : arr.slice(0, cap);
  let h = shown.map(render).join('');
  if (arr.length > cap) h += `<button class="more-btn" data-act="more" data-id="${id}" aria-expanded="${open}">${open ? t('show_less') : t('show_more', { n: fn(arr.length - cap) })}${ic(open ? 'minus' : 'plus', 'ic-sm')}</button>`;
  return h;
}
/* tables follow the same cap as lists */
function capRows(id, arr, cap = 6) {
  const open = ST.expanded.has(id);
  return { rows: open ? arr : arr.slice(0, cap), more: arr.length > cap ? `<button class="more-btn" data-act="more" data-id="${id}" aria-expanded="${open}">${open ? t('show_less') : t('show_more', { n: fn(arr.length - cap) })}${ic(open ? 'minus' : 'plus', 'ic-sm')}</button>` : '' };
}
const emptyBox = (icon, ttl, body, action = '') => `<div class="empty"><div class="e-ic">${ic(icon)}</div><h3>${ttl}</h3><p>${body}</p>${action}</div>`;
const noSample = () => emptyBox('chart', T('لا بيانات بعد', 'No data yet'), T('تظهر هنا بعد ربط الحسابات وبدء العمل.', 'This shows after the accounts are connected and the work starts.'));
function skeleton(rows = 5) {
  let h = '<div class="card" aria-busy="true"><div class="card-head"><div class="sk sk-line" style="width:160px"></div></div>';
  for (let i = 0; i < rows; i++) h += `<div class="sk-row"><div class="sk" style="width:44px;height:55px"></div><div style="flex:1;display:flex;flex-direction:column;gap:8px"><div class="sk sk-line" style="width:${60 - i * 6}%"></div><div class="sk sk-line" style="width:${35 + i * 4}%"></div></div></div>`;
  return `<div class="kpis">${'<div class="kpi"><div class="sk sk-line" style="width:60%"></div><div class="sk" style="height:30px;width:40%"></div></div>'.repeat(4)}</div>${h}</div><span class="sr-only" role="status">${t('loading')}</span>`;
}
const viewFailed = () => `<div class="errorbox" role="alert">${ic('alertc', 'ic-lg')}<div><h3>${t('view_failed_t')}</h3><p>${t('view_failed_b')}</p><button class="btn btn-line" data-act="reload">${ic('refresh')}${t('reload')}</button></div></div>`;
const errorView = () => `<div class="errorbox" role="alert">${ic('alertc', 'ic-lg')}<div><h3>${t('err_title')}</h3><p>${t('err_body')}</p><button class="btn btn-line" data-act="retry">${ic('refresh')}${t('retry')}</button></div></div>`;
function card(h, facts, body, o = {}) {
  return `<section class="card ${o.cls || ''}"${o.id ? ` id="${o.id}"` : ''}><div class="card-head"><div class="title-wrap"><h2>${h}</h2>${facts ? `<span class="facts">${facts}</span>` : ''}</div>${o.right || ''}</div>${body}</section>`;
}
function kpi({ icon, label, val, note, sample, alert, href }) {
  const tag = href ? 'a' : 'div';
  return `<${tag} class="kpi ${alert ? 'alert' : ''}"${href ? ` href="${href}"` : ''}><span class="k-label">${ic(icon, 'ic-sm')}${label}</span><span class="k-val">${val}${sample ? ' ' + sampleTag() : ''}</span>${note ? `<span class="k-note">${note}</span>` : ''}</${tag}>`;
}
const sv = (v) => (SV() ? v : t('dash'));
const platIcons = (arr) => arr.map((p) => ic(PLAT[p].icon, 'ic-sm')).join('');
const platNames = (arr) => arr.map((p) => L(PLAT[p])).join(' · ');
/* account + date, bold, on every content row. The Irbid handle is not known yet, so the account shows by name. */
function acctLine(x) {
  return `<span class="acct">${platIcons(x.plat)}<span>${esc(L(CLIENT.name))}</span><span class="pl">${esc(platNames(x.plat))}</span></span><span class="when">${esc(fd(x.date, 'day'))}${x.time ? ' · ' + esc(ftime(x.time)) : ''}</span>`;
}
function thumb(x, cls = '') {
  const vid = x.kind === 'reel';
  if (x.kind === 'stories') return `<div class="thumb thumb-ph story-ring ${cls}">${ic('circle', 'ic-sm')}</div>`;
  if (x.img) return `<div class="thumb ${vid ? 'vthumb' : ''} ${cls}"><img src="${IMG(x.img)}" alt="" loading="lazy">${vid ? ic('play', 'ic-sm') : ''}</div>`;
  return `<div class="thumb thumb-ph tint ${cls}">${ic(x.ph || 'image', 'ic-sm')}</div>`;
}
function apprChip(x) {
  if (x.stage === 'posted') return `<span class="chip ok">${ic('check')}${T('منشور', 'Posted')}</span>`;
  switch (x.appr) {
    case 'pending': return `<span class="chip warn">${ic('clock')}${T('بانتظار موافقتك', 'Waiting for you')}</span>`;
    case 'changes': return `<span class="chip bad">${ic('edit')}${T('طلبت تعديلاً', 'You asked for changes')}</span>`;
    case 'approved': return x.stage === 'bank'
      ? `<span class="chip idle">${ic('layers')}${T('في المخزون', 'In the bank')}</span>`
      : `<span class="chip info">${ic('calendar')}${T('مجدول', 'Scheduled')}</span>`;
    default: return '';
  }
}
function storyChip(x) { return x.stage === 'posted' ? `<span class="chip ok">${ic('check')}${T('منشورة', 'Posted')}</span>` : `<span class="chip info">${ic('calendar')}${T('يومية', 'Daily')}</span>`; }

/* ======================================================================
   5. Undo + toasts
   ====================================================================== */
let toastTimer = null;
/* an info toast never replaces a toast that still offers Undo */
function toast(msg, undoFn) {
  const box = document.getElementById('toasts');
  if (!box) return;
  const live = box.querySelector('.toast.has-undo:not(.out)');
  const replace = !!undoFn || !live;
  if (replace) { box.innerHTML = ''; clearTimeout(toastTimer); }
  const el = document.createElement('div');
  el.className = 'toast' + (undoFn ? ' has-undo' : '');
  el.innerHTML = `<span class="t-msg">${esc(msg)}</span>${undoFn ? `<button type="button">${ic('undo', 'ic-sm')} ${t('undo')}</button>` : ''}`;
  if (undoFn) el.querySelector('button').addEventListener('click', () => { el.remove(); undoFn(); render(); toast(t('undone')); });
  box.appendChild(el);
  const tm = setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 160); }, undoFn ? 7000 : 3500);
  if (replace) toastTimer = tm;
}
/* every state change goes through act(): do, render, toast with undo. A failed change is rolled back and said out loud. */
function act(msg, doFn, undoFn) {
  try { doFn(); } catch (err) {
    console.error(err);
    try { if (undoFn) undoFn(); } catch (e2) { console.error(e2); }
    render(); toast(t('act_failed')); return;
  }
  render(); toast(msg, undoFn);
}

/* ======================================================================
   6. Shell
   ====================================================================== */
const TABS = [
  ['home', 'home', 'tab_home'], ['content', 'calendar', 'tab_content'], ['messages', 'message', 'tab_messages'],
  ['loyalty', 'wallet', 'tab_loyalty'], ['offers', 'tag', 'tab_offers'], ['reviews', 'star', 'tab_reviews'],
  ['ads', 'target', 'tab_ads'], ['opening', 'flag', 'tab_opening'], ['report', 'report', 'tab_report'],
];
const BOTTOM = [['home', 'home', 'tab_home'], ['content', 'calendar', 'tab_content'], ['messages', 'message', 'tab_messages'], ['loyalty', 'wallet', 'tab_loyalty_short']];
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const v = h.split('/')[0].toLowerCase();
  if (TABS.some(([k]) => k === v)) return { v };
  if (v) { console.warn(`mockup: #${v} is not a tab. Showing Home.`); history.replaceState(null, '', '#home'); }
  return { v: 'home' };
}
function counts() {
  if (ST.mode !== 'data') return {};
  const d = db();
  return {
    content: d.posts.filter((x) => x.appr === 'pending').length,
    messages: d.convos.filter((x) => x.status === 'waiting').length,
    reviews: d.reviews.filter((x) => x.status === 'draft').length,
  };
}
function langBtn() {
  return `<button class="lang-btn" data-act="lang" aria-label="${t('switch_lang_label')}" lang="${ST.lang === 'ar' ? 'en' : 'ar'}">${ic('globe', 'ic-sm')}${t('switch_lang')}</button>`;
}
function mockbar() {
  if (params.get('bar') === '0' || params.get('mb') === '0') return '';
  const seg = (k, opts) => `<div class="seg" role="group">${opts.map(([v, lbl]) => `<button type="button" data-act="mb" data-k="${k}" data-v="${v}" aria-pressed="${String(ST[k]) === String(v)}">${t(lbl)}</button>`).join('')}</div>`;
  return `<details class="mockbar" ${store.get('mbOpen', false) ? 'open' : ''}><summary>${ic('dots', 'ic-sm')}${t('mb_title')}</summary><div class="mb-body">
    <p>${t('mb_note')}</p>
    <div class="mb-row" role="group" aria-label="${t('mb_state')}"><span>${t('mb_state')}</span>${seg('mode', [['data', 'mb_data'], ['empty', 'mb_empty'], ['loading', 'mb_loading'], ['error', 'mb_error']])}</div>
    <div class="mb-row" role="group" aria-label="${t('mb_samples')}"><span>${t('mb_samples')}</span>${seg('samples', [[true, 'mb_on'], [false, 'mb_off']])}</div>
    <div class="mb-row" role="group" aria-label="${t('mb_theme')}"><span>${t('mb_theme')}</span>${seg('theme', [['light', 'mb_light'], ['dark', 'mb_dark']])}</div>
    ${store.failed ? `<p class="err">${t('mb_nostore')}</p>` : ''}
  </div></details>`;
}
function pageHead(ttl, facts, actions = '') {
  return `<div class="page-head"><div><div class="page-title"><h1 id="page-h1" tabindex="-1">${ttl}</h1></div>${facts ? `<p class="page-facts">${facts}</p>` : ''}</div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>`;
}
function shell(r, body) {
  const cnt = counts();
  const inBottom = BOTTOM.some(([k]) => k === r.v);
  return `<a class="skip" href="#main">${t('skip')}</a>
  <header class="c-top">
    <div class="c-top-in">
      <div class="ident"><img class="brand-mark on-light" src="assets/brand/marsh-mark.svg" alt="${t('marsh')}" width="35" height="44"><img class="brand-mark on-dark" src="assets/brand/marsh-mark-white.svg" alt="${t('marsh')}" width="35" height="44"><div class="id-txt"><div class="nm">${esc(L(CLIENT.name))}</div><div class="hd">${t('by_marsh')}</div></div></div>
      <div class="spacer" style="flex:1"></div>
      ${langBtn()}
    </div>
    <nav class="c-tabs" aria-label="${t('menu')}">${TABS.map(([k, i, lbl]) => `<a href="#${k}" ${r.v === k ? 'aria-current="page"' : ''}>${ic(i, 'ic-sm')}${t(lbl)}${cnt[k] ? `<span class="count">${fn(cnt[k])}</span>` : ''}</a>`).join('')}</nav>
  </header>
  <main id="main" class="c-content">${body}</main>
  <nav class="bottomnav" aria-label="${t('menu')}">
    ${BOTTOM.map(([k, i, lbl]) => `<a href="#${k}" ${r.v === k ? 'aria-current="page"' : ''}>${ic(i)}<span>${t(lbl)}</span>${cnt[k] ? `<span class="badge">${fn(cnt[k])}</span>` : ''}</a>`).join('')}
    <button type="button" data-act="sheet" ${!inBottom ? 'aria-current="page"' : ''} aria-haspopup="dialog">${ic('dots')}<span>${t('more')}</span>${!inBottom ? '' : (cnt.reviews ? `<span class="badge">${fn(cnt.reviews)}</span>` : '')}</button>
  </nav>
  ${ST.sheet ? `<div class="sheet-backdrop" data-act="sheet-close"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${t('more')}"><div class="grab"></div>${TABS.map(([k, i, lbl]) => `<a href="#${k}" data-act="sheet-close" ${r.v === k ? 'aria-current="page"' : ''}>${ic(i)}<span>${t(lbl)}</span>${cnt[k] ? `<span class="count">${fn(cnt[k])}</span>` : ''}</a>`).join('')}</div>` : ''}
  ${mockbar()}`;
}

/* ======================================================================
   7. Views
   ====================================================================== */

/* ---------- Home ---------- */
function vHome() {
  const d = db();
  const weekN = Math.floor(dayDiff(TODAY, toD(START)) / 7) + 1;
  const pend = d.posts.filter((x) => x.appr === 'pending');
  const waiting = d.convos.filter((x) => x.status === 'waiting');
  const drafts = d.reviews.filter((x) => x.status === 'draft');
  const pushes = d.pushes.filter((x) => x.status === 'scheduled').sort((a, c) => (a.date + a.time).localeCompare(c.date + c.time));
  const b = d.base;
  const mx = msgStats(d);
  const tiles = [
    { icon: 'eye', label: T('متوسط مشاهدات الفيديو', 'Views per video'), val: sv(fn(1850)), base: b ? ltr('~' + fn(BASE.views)) : null },
    { icon: 'heart', label: T('متوسط الإعجابات للمنشور', 'Likes per post'), val: sv(fn(36)), base: b ? ltr('~' + fn(BASE.likes)) : null },
    { icon: 'circle', label: T('مشاهدو القصة', 'Story viewers'), val: sv(fn(150)), base: b ? ltr(BASE.story) : null },
    { icon: 'pin', label: T('الجمهور في إربد', 'Audience in Irbid'), val: SV() ? pct(10) : t('dash'), base: b ? pct(BASE.irbid) : null },
  ];
  const kpis = `<div class="kpis">${tiles.map((k) => kpi({ icon: k.icon, label: k.label, val: k.val, sample: SV(), note: k.base ? t('baseline_v', { v: k.base }) : '' })).join('')}</div>`;

  const needRow = (icon, title, meta, n, href, btn, tone = 'warn') => `<div class="li need">${ic(icon)}<div class="grow"><div class="title">${title}</div>${meta ? `<div class="meta">${meta}</div>` : ''}</div><span class="need-n ${tone}">${fn(n)}</span><a class="btn btn-primary btn-sm" href="${href}">${btn}${ic('chev', 'ic-sm')}</a></div>`;
  let needs = '';
  if (pend.length) needs += needRow('approve', T('منشورات بانتظار موافقتك', 'Posts waiting for your approval'), `${T('أقربها', 'Next')}: <span class="when">${esc(rel(pend[0].date))}</span>`, pend.length, '#content', T('راجع', 'Review'));
  if (waiting.length) needs += needRow('message', T('رسائل تنتظر الموظفين', 'DMs waiting for staff'), `<span>${waiting.map((x) => `${esc(L(TOPIC[x.topic]))} ${T('←', '→')} <b>${esc(L(ROUTE[x.route]))}</b>`).join(' · ')}</span>`, waiting.length, '#messages', t('open'));
  if (drafts.length) needs += needRow('star', T('ردود على تقييمات Google بانتظار موافقتك', 'Google review replies waiting for you'), T('الردود مكتوبة. وافق أو عدّل.', 'The replies are written. Approve or edit.'), drafts.length, '#reviews', T('راجع', 'Review'));
  if (pushes.length) needs += needRow('bell', T('إشعارات مجدولة لبطاقة الولاء', 'Loyalty pushes scheduled'), `${T('التالي', 'Next')}: <span class="when">${esc(rel(pushes[0].date))} · ${esc(ftime(pushes[0].time))}</span>`, pushes.length, '#loyalty', t('open'), 'info');
  const nTotal = pend.length + waiting.length + drafts.length;
  const needsCard = card(T('ما ينتظرك', 'What needs you'), SV() ? `${T('بانتظارك', 'Waiting for you')}: ${fn(nTotal)} ${sampleTag()}` : '', needs ? `<div class="list">${needs}</div>` : emptyBox('check', T('لا شيء ينتظرك', 'Nothing needs you'), T('ما يحتاج قرارك يظهر هنا: منشورات، رسائل، ردود على التقييمات.', 'What needs your decision shows here: posts, DMs, review replies.')));

  const upcoming = d.posts.filter((x) => x.date >= TODAY_ISO && x.stage !== 'posted').sort((a, c) => (a.date + a.time).localeCompare(c.date + c.time));
  const postsCard = card(T('المنشورات القادمة', 'Next posts'), SV() ? `${T('من اليوم', 'From today')} · ${fn(upcoming.length)} ${sampleTag()}` : '', upcoming.length ? `<div class="list">${capped('h-next', upcoming, (x) => postRow(x, { compact: true }), 4)}</div>` : emptyBox('calendar', T('لا منشورات مجدولة', 'No posts scheduled'), T('تظهر المنشورات هنا بعد أول يوم تصوير.', 'Posts show here after the first shoot day.')));

  // opening countdown: counts down before the date, up after it
  const od = dayDiff(toD(OPENING), TODAY);
  const launchDone = d.launch.filter((x) => x.done).length;
  const openingCard = card(T('افتتاح الطابق الأول', 'First floor opening'), `${esc(fd(OPENING, 'long'))}`, `<div class="card-body stack">
      <div class="count-big">${openingCount(od)}</div>
      ${d.launch.length ? `<div><div class="row between small"><span>${T('قائمة الافتتاح', 'Opening checklist')}</span><span class="num strong">${fn(launchDone)} / ${fn(d.launch.length)} ${sampleTag()}</span></div><div class="meter" style="margin-top:6px"><span style="width:${(launchDone / d.launch.length) * 100}%"></span></div></div>` : ''}
      <a class="link" href="#opening">${T('فتح قائمة الافتتاح', 'Open the opening checklist')}</a></div>`);

  const next = d.shoots.find((x) => x.date >= TODAY_ISO);
  const shootCard = card(T('يوم التصوير القادم', 'Next shoot day'), SV() ? `${T('كل خميس', 'Every Thursday')} · ${ltr('10:00–14:00')} ${sampleTag()}` : '', next ? `<div class="card-body stack">
      <div><div class="when big">${esc(fd(next.date, 'full'))}</div><div class="sub">${esc(L(CLIENT.place))} · ${esc(relDays(next.date))}</div></div>
      ${next.list ? `<ul class="checklist">${next.list.map((x) => `<li>${ic('camera', 'ic-sm ck-idle')}<span>${esc(L(x))}</span></li>`).join('')}</ul>` : ''}</div>` : emptyBox('camera', T('لا يوم تصوير محدد', 'No shoot day set'), T('يُحدد يوم التصوير الثابت في أول اجتماع.', 'The fixed shoot day is set at the first meeting.')));

  const msgCard = card(T('الرسائل', 'Messages'), SV() ? `${T('آخر 7 أيام', 'Last 7 days')} ${sampleTag()}` : '', SV() ? `<div class="card-body mini-stats">
      <div><b class="num">${fn(mx.total)}</b><span>${T('رسالة', 'messages')}</span></div>
      <div><b class="num">${fn(mx.ai)}</b><span>${T('ردّ عليها الذكاء الاصطناعي', 'answered by AI')}</span></div>
      <div><b class="num">${T('40 ث', '40 s')}</b><span>${T('متوسط أول رد', 'median first reply')}</span></div></div>` : noSample());

  return {
    title: t('tab_home'),
    facts: `${esc(fd(TODAY, 'full'))}${SV() ? ` · ${T(`الأسبوع ${weekN} منذ البداية`, `Week ${weekN} since the start`)} ${sampleTag()}` : ''}`,
    body: `${kpis}<div class="grid g-main"><div class="stack-l">${needsCard}${postsCard}</div><div class="stack-l">${openingCard}${shootCard}${msgCard}</div></div>`,
  };
}

/* ---------- Content ---------- */
function postRow(x, o = {}) {
  if (x.kind === 'stories') {
    return `<div class="post-row">${thumb(x)}<div class="grow"><div class="title">${T('قصص', 'Stories')} · <span class="num">${fn(x.n)}</span> ${sampleTag()}</div><div class="meta row">${acctLine(x)}</div></div><div class="row acts-row">${storyChip(x)}</div></div>`;
  }
  const open = ST.noteOpen.has(x.id);
  let acts = '';
  if (o.compact) acts = apprChip(x);
  else if (x.stage === 'posted') acts = apprChip(x);
  else if (x.appr === 'pending') acts = `<button class="btn btn-ok btn-sm" data-act="approve" data-id="${x.id}">${ic('check', 'ic-sm')}${t('approve')}</button><button class="btn btn-line btn-sm" data-act="changes-open" data-id="${x.id}" aria-expanded="${open}">${ic('edit', 'ic-sm')}${t('request_changes')}</button>`;
  else if (x.appr === 'approved') acts = `${apprChip(x)}${x.userAppr ? `<button class="btn btn-ghost btn-sm" data-act="unapprove" data-id="${x.id}">${ic('undo', 'ic-sm')}${t('undo_approval')}</button>` : ''}`;
  else if (x.appr === 'changes') acts = `${apprChip(x)}<button class="btn btn-ghost btn-sm" data-act="unchanges" data-id="${x.id}">${ic('undo', 'ic-sm')}${t('undo')}</button>`;
  return `<div class="post-row">${thumb(x)}<div class="grow"><div class="title">${esc(L(x.t))} · <span class="muted kind">${esc(L(KIND[x.kind]))}</span> ${sampleTag()}</div><div class="meta row">${acctLine(x)}</div></div><div class="row acts-row">${acts}</div></div>`;
}
/* the change-request form lives only in the approval card, so each id exists once */
function changesForm(x) {
  const err = ST.err['ch-' + x.id];
  return `<form class="field changes-form" data-form="changes" data-id="${x.id}" novalidate><label for="ch-${x.id}">${t('changes_label')}</label><textarea class="textarea" id="ch-${x.id}" name="note" ${err ? `aria-invalid="true" aria-describedby="ch-${x.id}-err"` : `aria-describedby="ch-${x.id}-h"`}>${esc(ST.drafts['ch-' + x.id] || '')}</textarea>${err ? `<span class="err" id="ch-${x.id}-err">${t('changes_err')}</span>` : `<span class="help" id="ch-${x.id}-h">${t('changes_help')}</span>`}<div class="row"><button type="submit" class="btn btn-primary btn-sm">${ic('send', 'ic-sm')}${t('send')}</button><button type="button" class="btn btn-ghost btn-sm" data-act="changes-close" data-id="${x.id}">${t('cancel')}</button></div></form>`;
}
function reviewCard(x) {
  const open = ST.noteOpen.has(x.id);
  let acts;
  if (x.appr === 'pending') acts = `<button class="btn btn-ok" data-act="approve" data-id="${x.id}">${ic('check', 'ic-sm')}${t('approve')}</button><button class="btn btn-line" data-act="changes-open" data-id="${x.id}" aria-expanded="${open}">${ic('edit', 'ic-sm')}${t('request_changes')}</button>`;
  else if (x.appr === 'approved') acts = `<span class="chip ok">${ic('check')}${t('approved')}</span><button class="btn btn-ghost" data-act="unapprove" data-id="${x.id}">${ic('undo', 'ic-sm')}${t('undo_approval')}</button>`;
  else acts = `${apprChip(x)}<button class="btn btn-ghost" data-act="unchanges" data-id="${x.id}">${ic('undo', 'ic-sm')}${t('undo')}</button>`;
  const media = x.img ? `<div class="rc-media"><img src="${IMG(x.img)}" alt="${esc(L(FOOD[x.img]))}" loading="lazy">${x.kind === 'reel' ? `<span class="rc-play">${ic('play')}</span>` : ''}</div>` : `<div class="rc-media rc-ph">${ic(x.ph || 'camera', 'ic-lg')}<span>${T('من يوم التصوير', 'From the shoot day')}</span></div>`;
  return `<article class="card review-card">${media}
    <div class="card-body stack"><div class="row between"><h3 class="rc-title">${esc(L(x.t))}</h3>${sampleTag()}</div>
      <div class="meta row">${acctLine(x)}</div>
      <div class="row small muted">${ic(KIND[x.kind].icon, 'ic-sm')}${esc(L(KIND[x.kind]))}${x.sent ? ` · ${T('أُرسل للمراجعة', 'Sent for review')} ${esc(fd(x.sent))}` : ''}</div>
      ${x.cap ? `<p class="cap">${esc(L(x.cap))}</p>` : ''}
      ${x.note && x.appr === 'changes' ? `<div class="note">${ic('message', 'ic-sm')}<span><b>${t('your_note')}:</b> ${esc(L(x.note))}</span></div>` : ''}
      <div class="row rc-acts">${acts}</div>${open ? changesForm(x) : ''}</div></article>`;
}
function weekStart(iso) { const d = toD(iso); d.setDate(d.getDate() - d.getDay()); return isoOf(d); }
function itemsOn(d, iso) {
  return [...d.stories.filter((x) => x.date === iso), ...d.posts.filter((x) => x.date === iso)];
}
function calendarCard(d) {
  const v = ST.ui.cview;
  const seg = `<div class="seg" role="group" aria-label="${T('العرض', 'View')}">${[['day', T('يوم', 'Day')], ['week', T('أسبوع', 'Week')], ['month', T('شهر', 'Month')]].map(([k, l]) => `<button type="button" data-act="ui" data-k="cview" data-v="${k}" aria-pressed="${v === k}">${l}</button>`).join('')}</div>`;
  let label = ''; let body = '';
  if (v === 'day') {
    const iso = ST.ui.cday;
    label = `${fd(iso, 'full')}`;
    const its = itemsOn(d, iso);
    body = its.length ? `<div class="card-body stack">${its.map((x) => postRow(x)).join('')}</div>` : emptyBox('calendar', T('لا شيء في هذا اليوم', 'Nothing on this day'), T('اختر يوماً آخر.', 'Pick another day.'));
  } else if (v === 'week') {
    const s = addDays(weekStart(TODAY_ISO), ST.ui.coff * 7);
    label = `${fd(s)} – ${fd(addDays(s, 6))}`;
    let h = '';
    for (let i = 0; i < 7; i++) {
      const iso = addDays(s, i);
      const its = itemsOn(d, iso);
      const isToday = iso === TODAY_ISO;
      const wk = toD(iso).getDay() >= 5;
      h += `<div class="day ${isToday ? 'today' : ''} ${wk ? 'weekend' : ''}"><div class="dl"><b>${isToday ? t('today') : esc(fd(iso, 'wd'))}</b><span>${esc(fd(iso))}</span></div><div class="items">${its.length ? its.map((x) => postRow(x)).join('') : `<div class="none">${t('none')}</div>`}</div></div>`;
    }
    body = `<div class="days">${h}</div>`;
  } else {
    const base = toD(TODAY_ISO); base.setDate(1); base.setMonth(base.getMonth() + ST.ui.coff);
    const y = base.getFullYear(); const m = base.getMonth();
    label = fd(base, 'month');
    const first = new Date(y, m, 1).getDay();
    const dim = new Date(y, m + 1, 0).getDate();
    let cells = '';
    for (let i = 0; i < 7; i++) cells += `<div class="mh" aria-hidden="true">${esc(fd(addDays('2026-11-01', i), 'narrow'))}</div>`;
    for (let i = 0; i < first; i++) cells += '<div class="mc out" aria-hidden="true"></div>';
    for (let dd = 1; dd <= dim; dd++) {
      const iso = ISO(y, m + 1, dd);
      const its = d.posts.filter((x) => x.date === iso);
      const st = d.stories.some((x) => x.date === iso);
      const dots = its.map((x) => `<i class="dot ${x.appr === 'pending' ? 'warn' : x.appr === 'changes' ? 'bad' : x.stage === 'posted' ? 'ok' : 'info'}"></i>`).join('');
      const wk = new Date(y, m, dd).getDay() >= 5;
      cells += `<button type="button" class="mc ${iso === TODAY_ISO ? 'today' : ''} ${wk ? 'weekend' : ''}" data-act="cday" data-v="${iso}" aria-label="${esc(fd(iso, 'full'))}: ${fn(its.length)} ${T('منشور', 'posts')}"><span class="dn">${fn(dd)}</span><span class="dots">${dots}${st ? '<i class="dot story"></i>' : ''}</span>${its.length ? `<span class="mn">${fn(its.length)}</span>` : ''}</button>`;
    }
    const rest = (7 - ((first + dim) % 7)) % 7;
    for (let i = 0; i < rest; i++) cells += '<div class="mc out" aria-hidden="true"></div>';
    body = `<div class="cal-m">${cells}</div><div class="legend card-body">${[['ok', T('منشور', 'Posted')], ['info', T('مجدول', 'Scheduled')], ['warn', T('بانتظارك', 'Waiting for you')], ['bad', T('طلبت تعديلاً', 'Changes asked')], ['story', T('قصص', 'Stories')]].map(([c, l]) => `<span><i class="dot ${c}"></i>${l}</span>`).join('')}</div>`;
  }
  const nav = `<div class="pager"><button class="btn btn-line btn-icon btn-sm" data-act="cnav" data-v="-1" aria-label="${t('prev')}">${ic('chevb')}</button><button class="btn btn-line btn-sm" data-act="cnav" data-v="0">${t('today')}</button><button class="btn btn-line btn-icon btn-sm" data-act="cnav" data-v="1" aria-label="${t('next')}">${ic('chev')}</button></div>`;
  return `<section class="card" id="cal"><div class="card-head"><div class="title-wrap"><h2>${T('خطة النشر', 'Posting plan')}</h2><span class="facts">${esc(label)} ${sampleTag()}</span></div><div class="row">${seg}${nav}</div></div>${d.posts.length ? body : emptyBox('calendar', T('لا منشورات بعد', 'No posts yet'), T('تبدأ الخطة بعد أول يوم تصوير. ننشر بعد أن يصبح لدينا محتوى لأسبوعين.', 'The plan starts after the first shoot day. Posting starts once 2 weeks of content are banked.'))}</section>`;
}
function vContent() {
  const d = db();
  const review = d.posts.filter((x) => x.appr === 'pending' || x.appr === 'changes' || ST.noteOpen.has('done-' + x.id));
  const pend = d.posts.filter((x) => x.appr === 'pending').length;
  const thisWeek = d.posts.filter((x) => x.date >= weekStart(TODAY_ISO) && x.date <= addDays(weekStart(TODAY_ISO), 6)).length;
  const bank = d.posts.filter((x) => x.stage === 'bank');
  const toApprove = review.length
    ? `<section class="stack-l" aria-labelledby="ap-h"><div class="sec-head"><h2 id="ap-h">${T('بانتظار موافقتك', 'Waiting for your approval')}</h2><span class="facts">${fn(pend)} ${sampleTag()}</span></div><div class="rc-grid">${review.map(reviewCard).join('')}</div></section>`
    : (d.posts.length ? `<div class="note">${ic('check', 'ic-sm')}<span>${T('لا شيء بانتظار موافقتك.', 'Nothing is waiting for your approval.')}</span></div>` : '');

  const mix = [
    [T('يومياً', 'Daily'), [[T('قصص', 'Stories'), '3–5', ['ig', 'fb']]]],
    [T('أسبوعياً', 'Weekly'), [[T('ريلز', 'Reels'), '3', ['ig', 'fb']], [T('منشورات', 'Posts'), '2', ['ig', 'fb']], [T('فيديو فيسبوك', 'Facebook video'), '1', ['fb']]]],
    [T('شهرياً', 'Monthly'), [[T('أيام تصوير ثابتة', 'Fixed shoot days'), '4', []], [T('حملة عرض', 'Offer campaign'), '1', ['ig', 'fb']], [T('تقرير', 'Report'), '1', []]]],
  ];
  const mixCard = card(T('مزيج المحتوى', 'Content mix'), `${T('يومي · أسبوعي · شهري', 'Day · week · month')} ${SV() ? sampleTag() : ''}`, !SV() ? noSample() : `<div class="card-body mix">${mix.map(([h, rows]) => `<div class="mix-g"><h3>${h}</h3>${rows.map(([n, c, p]) => `<div class="mix-r"><span class="num strong">${ltr(c)}</span><span class="grow">${n}</span><span class="pls">${platIcons(p)}</span></div>`).join('')}</div>`).join('')}</div>`);

  const series = Object.entries(SERIES).map(([k, s]) => ({ k, s, bank: d.posts.filter((x) => x.series === k && x.stage !== 'posted').length, posted: d.posts.filter((x) => x.series === k && x.stage === 'posted').length }));
  const seriesCard = card(T('سلاسل الريلز', 'Reel series'), `${T('تصوير بالهاتف، محتوى حقيقي من المطعم', 'Phone-style, real footage from the restaurant')}`, `<div class="list">${series.map((x) => `<div class="li">${ic('video')}<div class="grow"><div class="title">${esc(L(x.s))}</div>${SV() ? `<div class="meta">${T('جاهز', 'Ready')}: <b class="num">${fn(x.bank)}</b> · ${T('منشور', 'Posted')}: <b class="num">${fn(x.posted)}</b> ${sampleTag()}</div>` : ''}</div></div>`).join('')}</div>`);

  const shoots = [...d.shoots].sort((a, c) => (a.date < c.date ? 1 : -1));
  const shootCard = card(T('أيام التصوير', 'Shoot days'), SV() ? `${T('كل خميس', 'Every Thursday')} · ${ltr('10:00–14:00')} ${sampleTag()}` : '', shoots.length ? `<div class="list">${capped('c-shoots', shoots, (x) => `<div class="li">${ic('camera')}<div class="grow"><div class="title">${esc(L(x.t))}</div><div class="meta"><span class="when">${esc(fd(x.date, 'day'))}</span>${x.list ? ` · ${fn(x.list.length)} ${T('لقطات في القائمة', 'shots on the list')}` : ''}</div></div>${x.date < TODAY_ISO ? `<span class="chip ok">${ic('check')}${T('تم', 'Done')}</span>` : `<span class="chip info">${ic('calendar')}${esc(relDays(x.date))}</span>`}</div>`, 4)}</div>` : emptyBox('camera', T('لا أيام تصوير', 'No shoot days'), T('يُحدد يوم التصوير الثابت في أول اجتماع.', 'The fixed shoot day is set at the first meeting.')));

  const banked = 14;
  const bankCard = card(T('مخزون المحتوى', 'Content bank'), `${T('أسبوعان جاهزان قبل بدء النشر', '2 weeks ready before posting starts')}`, d.posts.length ? `<div class="card-body stack"><div class="row between"><span>${T('أيام جاهزة', 'Days ready')}</span><span class="num strong">${fn(banked)} / ${fn(14)} ${sampleTag()}</span></div><div class="meter"><span style="width:${(banked / 14) * 100}%"></span></div></div><div class="list">${capped('c-bank', bank, (x) => postRow(x, { compact: true }), 3)}</div>` : noSample());

  return {
    title: t('tab_content'),
    facts: SV() ? `${T('هذا الأسبوع', 'This week')}: ${fn(thisWeek)} · ${T('بانتظار موافقتك', 'Waiting for you')}: ${fn(pend)} ${sampleTag()}` : T('لا منشورات بعد', 'No posts yet'),
    body: `${toApprove}${calendarCard(d)}<div class="grid g-2">${mixCard}${shootCard}</div><div class="grid g-2">${bankCard}${seriesCard}</div>`,
  };
}

/* ---------- Messages ---------- */
function convoChip(x) {
  if (x.status === 'ai') return `<span class="chip ok">${ic('bot')}${T('ردّ الذكاء الاصطناعي', 'Answered by AI')}</span>`;
  if (x.status === 'staff') return `<span class="chip info">${ic('user')}${T('ردّ الموظف', 'Answered by staff')}</span>`;
  return `<span class="chip warn">${ic('clock')}${T('ينتظر الموظف', 'Waiting for staff')}</span>`;
}
/* 42 messages in 7 days: 4 handled by staff outside this list, plus the live rows */
function msgStats(d) {
  const total = 42;
  const handed = 4 + d.convos.filter((x) => x.status !== 'ai').length;
  return { total, handed, ai: total - handed, pct: Math.round(((total - handed) / total) * 100) };
}
function bubble(m, x) {
  if (m.w === 'sys' && m.kind === 'handover') return `<div class="sys">${ic('arrow', 'ic-sm')}<span>${x.route ? `${T('حُوّلت إلى', 'Handed to')}: ${esc(L(ROUTE[x.route]))}` : T('حُوّلت إلى موظف', 'Handed to staff')}</span></div>`;
  if (m.w === 'sys') return `<div class="sys">${ic('arrow', 'ic-sm')}<span>${esc(L(m))}</span></div>`;
  const tag = m.w === 'ai' ? `<span class="b-who">${ic('bot', 'ic-sm')}${T('رد آلي', 'AI reply')}</span>` : m.w === 'staff' ? `<span class="b-who">${ic('user', 'ic-sm')}${esc(L(ROUTE[m.role]))}</span>` : '';
  const gloss = ST.lang === 'en' ? `<span class="gloss" lang="en">${esc(m.en)}</span>` : '';
  return `<div class="msg ${m.w === 'c' ? 'in' : m.w}">${tag}<p lang="ar" dir="rtl">${esc(m.ar)}</p>${m.link ? `<span class="b-link">${ic('pin', 'ic-sm')}${bdi(m.link)}</span>` : ''}${gloss}${m.tm ? `<span class="b-tm">${esc(ftime(m.tm))}</span>` : ''}</div>`;
}
function vMessages() {
  const d = db();
  const f = ST.ui.mfilter;
  const list = d.convos.filter((x) => f === 'all' || (f === 'ai' && x.status === 'ai') || (f === 'staff' && x.status === 'staff') || (f === 'waiting' && x.status === 'waiting'));
  const sel = list.find((x) => x.id === ST.ui.convo) || list[0];
  const mx = msgStats(d);
  const waiting = d.convos.filter((x) => x.status === 'waiting').length;
  const k = SV();
  const kpis = `<div class="kpis">
    ${kpi({ icon: 'message', label: T('رسائل، آخر 7 أيام', 'Messages, last 7 days'), val: sv(fn(mx.total)), sample: k })}
    ${kpi({ icon: 'bot', label: T('ردّ عليها الذكاء الاصطناعي', 'Answered by AI'), val: sv(fn(mx.ai)), sample: k, note: k ? pct(mx.pct) : '' })}
    ${kpi({ icon: 'user', label: T('حُوّلت للموظفين', 'Handed to staff'), val: sv(fn(mx.handed)), sample: k, note: k ? `${T('تنتظر الآن', 'Waiting now')}: ${fn(waiting)}` : '', alert: k && waiting > 0 })}
    ${kpi({ icon: 'clock', label: T('متوسط أول رد', 'Median first reply'), val: sv(T('40 ث', '40 s')), sample: k, note: k ? `${T('رد الموظف', 'Staff reply')}: ${T('18 د', '18 min')}` : '' })}
  </div>`;
  const filt = `<div class="seg seg-wrap" role="group" aria-label="${T('تصفية', 'Filter')}">${[['all', t('all')], ['ai', T('الذكاء الاصطناعي', 'AI')], ['waiting', T('تنتظر', 'Waiting')], ['staff', T('الموظفون', 'Staff')]].map(([v, l]) => `<button type="button" data-act="ui" data-k="mfilter" data-v="${v}" aria-pressed="${f === v}">${l}</button>`).join('')}</div>`;
  const listHtml = list.length ? list.map((x) => `<button type="button" class="convo ${sel && sel.id === x.id ? 'sel' : ''}" data-act="convo" data-id="${x.id}" ${sel && sel.id === x.id ? 'aria-current="true"' : ''}>
      <span class="av">${esc(who(x).slice(0, 1))}</span>
      <span class="grow"><span class="row between"><b>${esc(who(x))}</b><span class="when small">${esc(x.day === TODAY_ISO ? ftime(x.at) : rel(x.day))}</span></span>
      <span class="cv-meta">${ic(PLAT[x.ch].icon, 'ic-sm')}${esc(L(PLAT[x.ch]))} · ${esc(L(TOPIC[x.topic]))}${x.route ? ` ${T('←', '→')} ${esc(L(ROUTE[x.route]))}` : ''}</span>
      <span class="cv-last" lang="ar" dir="rtl">${esc((x.msgs.filter((m) => m.w !== 'sys').slice(-1)[0] || { ar: '' }).ar)}</span>
      <span class="row">${convoChip(x)}</span></span></button>`).join('') : emptyBox('message', T('لا رسائل هنا', 'No messages here'), T('لا توجد محادثة بهذه الحالة.', 'No conversation has this status.'));

  let thread = '';
  if (sel) {
    let acts = '';
    const routeSel = (cur) => `<label class="sr-only" for="rt-${sel.id}">${T('حوّل إلى', 'Hand to')}</label><select class="select select-sm" id="rt-${sel.id}" data-act="route" data-id="${sel.id}">${Object.entries(ROUTE).map(([k2, r]) => `<option value="${k2}" ${cur === k2 ? 'selected' : ''}>${esc(L(r))}</option>`).join('')}</select>`;
    if (sel.status === 'ai') acts = `<button class="btn btn-line btn-sm" data-act="handover" data-id="${sel.id}">${ic('user', 'ic-sm')}${T('حوّل لموظف', 'Hand to staff')}</button>`;
    else if (sel.status === 'waiting') acts = `<button class="btn btn-ok btn-sm" data-act="answered" data-id="${sel.id}">${ic('check', 'ic-sm')}${T('تم الرد', 'Mark answered')}</button><span class="row small">${T('حوّل إلى', 'Hand to')} ${routeSel(sel.route)}</span>${sel.handed ? `<button class="btn btn-ghost btn-sm" data-act="unhand" data-id="${sel.id}">${ic('undo', 'ic-sm')}${T('أعد للذكاء الاصطناعي', 'Back to AI')}</button>` : ''}`;
    else acts = `<button class="btn btn-ghost btn-sm" data-act="reopen-convo" data-id="${sel.id}">${ic('undo', 'ic-sm')}${T('أعد الفتح', 'Reopen')}</button>`;
    thread = `<section class="card thread" id="thread" aria-label="${T('المحادثة', 'Conversation')}"><div class="card-head"><div class="title-wrap"><h2>${esc(who(sel))} ${sampleTag()}</h2><span class="facts">${ic(PLAT[sel.ch].icon, 'ic-sm')} ${esc(L(PLAT[sel.ch]))} · ${esc(L(TOPIC[sel.topic]))} · <span class="when">${esc(rel(sel.day))}</span></span></div>${convoChip(sel)}</div>
      <div class="chat">${sel.msgs.map((m) => bubble(m, sel)).join('')}</div>
      <div class="card-foot thread-acts">${acts}</div></section>`;
  }

  const routing = card(T('من يرد على ماذا', 'Who answers what'), T('قواعد التحويل', 'Routing rules'), `<div class="list">${[
    ['utensils', T('الطلبات والاستلام', 'Orders and pickup'), ROUTE.cashier],
    ['calendar', T('حجز الطاولات: يحجز الذكاء الاصطناعي وتصل نسخة', 'Table bookings: the AI books, a copy goes to'), ROUTE.cashier],
    ['users', T('المجموعات والعزائم والتموين', 'Groups, events and catering'), ROUTE.manager],
    ['coffee', T('أسئلة الطابق الأول والكافيه', 'First floor and café questions'), ROUTE.cafe],
    ['alert', T('الشكاوى', 'Complaints'), ROUTE.manager],
  ].map(([i, a, r]) => `<div class="li">${ic(i)}<div class="grow"><div class="title">${a}</div></div><span class="chip line">${ic('arrow')}${esc(L(r))}</span></div>`).join('')}</div>
    <div class="card-body"><ul class="rules">
      <li>${ic('check', 'ic-sm')}${T('يرد باللهجة الأردنية.', 'It answers in Jordanian dialect.')}</li>
      <li>${ic('check', 'ic-sm')}${T('يذكر أسعار المنيو فقط: الخروف 35 دينار للكيلو، الريش 37 دينار للكيلو.', 'It quotes menu prices only: lamb 35 JOD/kg, ribs 37 JOD/kg.')}</li>
      <li>${ic('check', 'ic-sm')}${T('لا يعد بخصم غير موجود في العروض.', 'It never promises a discount that is not in the offers.')}</li>
      <li>${ic('check', 'ic-sm')}${T('إذا لم يعرف الجواب، يحوّل المحادثة لموظف.', 'If it does not know the answer, it hands the chat to staff.')}</li>
    </ul></div>`);

  const auto = card(T('رسالة تلقائية بعد التفاعل', 'Auto-message after engagement'), `${T('تعليق · إشارة في قصة · مشاركة إلى الرسائل', 'Comment · story mention · share to DM')}`, `<div class="card-body stack">
      <div class="row between"><span class="row">${ST.autoOn ? `<span class="chip ok">${ic('check')}${T('يعمل', 'On')}</span>` : `<span class="chip idle">${ic('pause')}${T('متوقف', 'Off')}</span>`}</span><button class="btn btn-line btn-sm" data-act="auto-toggle">${ST.autoOn ? `${ic('pause', 'ic-sm')}${T('أوقف', 'Turn off')}` : `${ic('play', 'ic-sm')}${T('شغّل', 'Turn on')}`}</button></div>
      <div class="chat chat-flat"><div class="msg ai"><span class="b-who">${ic('bot', 'ic-sm')}${T('الرسالة', 'The message')}</span><p lang="ar" dir="rtl">أهلين! شكراً على تفاعلك مع Brands by SEKA. أول زيارة إلك: 250 غرام زيادة مع طلب كيلو أو أكثر. الكود: MMDM. بتحب توصلك عروضنا؟ ابعتلنا رقمك أو إيميلك. لإيقاف الرسائل اكتب «إيقاف».</p>${ST.lang === 'en' ? '<span class="gloss" lang="en">Hello! Thanks for engaging with Brands by SEKA. Your first visit: 250 g extra with an order of 1 kg or more. Code: MMDM. Do you want our offers? Send us your phone or email. To stop messages, write "stop".</span>' : ''}</div></div>
      ${SV() ? `<div class="mini-stats"><div><b class="num">${fn(318)}</b><span>${T('رسالة أُرسلت', 'messages sent')}</span></div><div><b class="num">${fn(35 + d.contacts.filter((x) => !x.deleted).length)}</b><span>${T('جهة اتصال بموافقة', 'contacts with consent')}</span></div><div><b class="num">${fn(24)}</b><span>${T('أول زيارة بالكود', 'first visits with the code')}</span></div></div><div>${sampleTag()}</div>` : ''}
      <div class="note">${ic('alertc', 'ic-sm')}<span>${T('إنستغرام لا يسمح بمراسلة من ضغط إعجاب فقط. الرسالة تُرسل بعد تعليق أو إشارة في قصة أو مشاركة منشور إلى رسائلنا.', 'Instagram does not allow a message to people who only press like. The message goes out after a comment, a story mention, or a post shared to our DMs.')}</span></div></div>`);

  const consent = d.contacts.filter((x) => !x.deleted);
  const removed = d.contacts.filter((x) => x.deleted);
  const nConsent = 35 + consent.length;
  const contactsCard = card(T('جهات الاتصال', 'Contacts'), SV() ? `${T('بموافقة صريحة', 'With explicit consent')}: ${fn(nConsent)} · ${T('أوقفوا الرسائل', 'Stopped messages')}: ${fn(3)} ${sampleTag()}` : '', `<div class="card-body"><div class="note">${ic('shield', 'ic-sm')}<span>${T('قانون حماية البيانات الشخصية الأردني رقم 24 لسنة 2023: نحفظ الرقم أو البريد فقط بعد موافقة صريحة ومسجّلة. كل رسالة فيها طريقة للإيقاف.', 'Jordan Personal Data Protection Law No. 24 of 2023: we keep a phone or email only after explicit, recorded consent. Every message has a way to stop.')}</span></div></div>
    ${consent.length ? `<div class="table-wrap"><table class="t stackable"><thead><tr><th>${T('الاسم', 'Name')}</th><th>${T('الرقم أو البريد', 'Phone or email')}</th><th>${T('الموافقة', 'Consent')}</th><th>${T('المصدر', 'Source')}</th><th><span class="sr-only">${T('إجراء', 'Action')}</span></th></tr></thead><tbody>${capRows('m-contacts', consent, 4).rows.map((x) => `<tr><td class="cell-title">${esc(who(x))}</td><td data-l="${T('الرقم أو البريد', 'Phone or email')}">${ic(x.type, 'ic-sm')} ${ltr(x.v)}</td><td data-l="${T('الموافقة', 'Consent')}"><span class="chip ok">${ic('check')}${esc(fd(x.d))}</span></td><td data-l="${T('المصدر', 'Source')}">${esc(L(x.src))}</td><td><button class="btn btn-ghost btn-sm" data-act="contact-del" data-id="${x.id}">${ic('trash', 'ic-sm')}${T('احذف', 'Delete')}</button></td> </tr>`).join('')}</tbody></table></div>${capRows('m-contacts', consent, 4).more}${removed.length ? `<div class="card-body deleted"><h3 class="small muted">${T('محذوفة', 'Deleted')}: ${fn(removed.length)}</h3>${removed.map((x) => `<div class="row between"><span>${esc(who(x))} · ${ltr(x.v)}</span><button class="btn btn-ghost btn-sm" data-act="contact-restore" data-id="${x.id}">${ic('undo', 'ic-sm')}${T('استرجع', 'Restore')}</button></div>`).join('')}</div>` : ''}` : emptyBox('users', T('لا جهات اتصال بعد', 'No contacts yet'), T('تظهر هنا بعد أول موافقة.', 'They show here after the first consent.'))}`);

  return {
    title: t('tab_messages'),
    facts: SV() ? `${T('آخر 7 أيام', 'Last 7 days')}: ${fn(mx.total)} · ${T('حُوّلت للموظفين', 'Handed to staff')}: ${fn(mx.handed)} · ${T('تنتظر', 'Waiting')}: ${fn(waiting)} ${sampleTag()}` : T('لا رسائل بعد', 'No messages yet'),
    body: `${kpis}${d.convos.length ? `<div class="msg-layout"><section class="card convo-list" aria-label="${T('المحادثات', 'Conversations')}"><div class="card-head"><div class="title-wrap"><h2>${T('المحادثات', 'Conversations')}</h2><span class="facts">${fn(list.length)} ${sampleTag()}</span></div>${filt}</div><div class="convos">${listHtml}</div></section>${thread}</div>` : `<section class="card">${emptyBox('message', T('لا محادثات بعد', 'No conversations yet'), T('تظهر رسائل إنستغرام وفيسبوك هنا بعد ربط الحسابات.', 'Instagram and Facebook messages show here after the accounts are connected.'))}</section>`}
      <div class="grid g-2">${auto}${routing}</div>${contactsCard}`,
  };
}

/* ---------- Loyalty ---------- */
function walletCard(kind) {
  const filled = 4;
  const stamps = Array.from({ length: 6 }, (_, i) => `<span class="stamp ${i < filled ? 'on' : ''}">${i < filled ? ic('check', 'ic-sm') : `<b class="num">${fn(i + 1)}</b>`}</span>`).join('');
  return `<div class="wallet ${kind}" role="img" aria-label="${T('معاينة بطاقة الولاء في المحفظة', 'Wallet loyalty card preview')}">
    <div class="w-top"><div class="w-brand"><span class="w-mark">${ic('utensils', 'ic-sm')}</span><span><b>${T('ميت موت · إربد', 'Meat Moot · Irbid')}</b><small>${T('بطاقة الولاء', 'Loyalty card')}</small></span></div><div class="w-pts"><small>${T('الأختام', 'Stamps')}</small><b class="num">${fn(filled)} / ${fn(6)}</b></div></div>
    <div class="w-strip"><div class="stamps">${stamps}</div><p>${T('ختم لكل 250 غرام · بعد 6 أختام (1.5 كغ): 200 غرام مجاناً', '1 stamp per 250 g · after 6 stamps (1.5 kg): 200 g free')}</p></div>
    <div class="w-fields"><div><small>${T('العضو', 'Member')}</small><b>${T('سامر', 'Samer')}</b></div><div><small>${T('المكافأة التالية', 'Next reward')}</small><b>${T('بعد ختمين', 'In 2 stamps')}</b></div></div>
    <div class="w-code" aria-hidden="true"><span class="barcode"></span><small class="lat">MM-IRB-0418</small></div>
    <div class="w-foot">${kind === 'apple' ? 'Apple Wallet' : 'Google Wallet'}</div>
  </div>`;
}
function pushPreview(txt) {
  return `<div class="push-prev" aria-label="${T('معاينة الإشعار', 'Push preview')}"><div class="pp-time num">${esc(ftime('11:00'))}</div><div class="pp-card"><span class="pp-ic">${ic('wallet', 'ic-sm')}</span><div class="grow"><div class="row between"><b>${T('ميت موت · إربد', 'Meat Moot · Irbid')}</b><small>${T('الآن', 'now')}</small></div><p dir="auto">${esc(txt || T('اكتب الرسالة لتظهر هنا.', 'Write the message to see it here.'))}</p></div></div></div>`;
}
function vLoyalty() {
  const d = db();
  const k = SV();
  const segAll = [SEG_ALL, ...SEGMENTS];
  const draft = ST.draft || { seg: ST.ui.pseg || 'all', txt: '', date: ISO(2026, 11, 6), time: '12:00' };
  const e = ST.err;
  const wseg = `<div class="seg" role="group" aria-label="${T('المحفظة', 'Wallet')}">${[['apple', 'Apple Wallet'], ['google', 'Google Wallet']].map(([v, l]) => `<button type="button" data-act="ui" data-k="wallet" data-v="${v}" aria-pressed="${ST.ui.wallet === v}">${l}</button>`).join('')}</div>`;
  const cardPrev = card(T('البطاقة في المحفظة', 'The card in the wallet'), `${T('بلا تطبيق. تُضاف من رمز QR على الطاولة أو الإيصال.', 'No app. Added from a QR code on the table or receipt.')} ${sampleTag()}`, `<div class="card-body stack wallet-wrap">${walletCard(ST.ui.wallet)}<div class="row center">${wseg}</div></div>`);
  const rule = card(T('قاعدة الأختام', 'Stamp rule'), T('مثال للنقاش', 'Example for discussion'), `<div class="card-body stack">
      <div class="rule-row"><span class="rr-n num">250 ${T('غ', 'g')}</span><span>${T('= ختم واحد', '= 1 stamp')}</span></div>
      <div class="rule-row"><span class="rr-n num">6</span><span>${T('أختام = 1.5 كغ', 'stamps = 1.5 kg')}</span></div>
      <div class="rule-row"><span class="rr-n num">200 ${T('غ', 'g')}</span><span>${T('مجاناً مع الطلب التالي', 'free with the next order')}</span></div>
      <div class="note">${ic('alertc', 'ic-sm')}<span>${T('قد تحتاج البطاقة والعروض موافقة صاحب الامتياز (ميت موت، إسطنبول). نتحقق من اتفاقية الامتياز أولاً.', 'The card and the offers may need the franchisor\'s approval (Meat Moot, Istanbul). We check the franchise agreement first.')}</span></div></div>`);
  const kpis = `<div class="kpis">
    ${kpi({ icon: 'wallet', label: T('بطاقات في المحافظ', 'Cards in wallets'), val: sv(fn(214)), sample: k, note: k ? T('منذ 24 أكتوبر', 'Since 24 Oct') : '' })}
    ${kpi({ icon: 'check', label: T('أختام أُعطيت', 'Stamps given'), val: sv(fn(860)), sample: k, note: k ? T('تساوي 215 كغ', 'Equals 215 kg') : '' })}
    ${kpi({ icon: 'star', label: T('مكافآت استُخدمت', 'Rewards used'), val: sv(fn(18)), sample: k })}
    ${kpi({ icon: 'refresh', label: T('عادوا خلال 14 يوماً', 'Came back within 14 days'), val: SV() ? pct(27) : t('dash'), sample: k })}
  </div>`;
  const segCard = card(T('الشرائح', 'Segments'), SV() ? `${T('من البطاقة والرسائل', 'From the card and the DMs')} ${sampleTag()}` : '', SV() ? `<div class="list">${SEGMENTS.map((s) => `<div class="li">${ic(s.icon)}<div class="grow"><div class="title">${esc(L(s.t))}</div><div class="meta">${esc(L(s.note))}</div></div><span class="num strong seg-n">${fn(s.n)}</span><button class="btn btn-line btn-sm" data-act="push-seg" data-v="${s.id}" ${s.n ? '' : 'disabled'}>${ic('bell', 'ic-sm')}${T('اكتب إشعاراً', 'Write a push')}</button></div>`).join('')}</div>` : noSample());

  const segOpts = segAll.map((s) => `<option value="${s.id}" ${draft.seg === s.id ? 'selected' : ''}>${esc(L(s.t))}${SV() ? ` (${fn(s.n)})` : ''}</option>`).join('');
  const len = (draft.txt || '').length;
  const composer = card(T('إشعار جديد', 'New push'), T('يظهر على شاشة القفل. بلا تطبيق.', 'Shows on the lock screen. No app needed.'), `<form class="card-body composer" data-form="push" novalidate>
      <div class="cmp-fields stack">
        <div class="field"><label for="pu-seg">${T('إلى', 'To')} <span aria-hidden="true" class="req">*</span></label><select class="select" id="pu-seg" name="seg">${segOpts}</select></div>
        <div class="field"><label for="pu-txt">${T('الرسالة', 'Message')} <span aria-hidden="true" class="req">*</span></label><textarea class="textarea" id="pu-txt" name="txt" maxlength="140" dir="auto" ${e.ptxt ? 'aria-invalid="true" aria-describedby="pu-txt-err"' : 'aria-describedby="pu-txt-h"'}>${esc(draft.txt)}</textarea>${e.ptxt ? `<span class="err" id="pu-txt-err">${T('اكتب الرسالة أولاً.', 'Write the message first.')}</span>` : `<span class="help" id="pu-txt-h"><span class="num" data-count>${fn(len)}</span> / ${fn(140)} · ${T('مثال: عرض الويكند', 'Example: a weekend offer')}</span>`}</div>
        <div class="form-grid"><div class="field"><label for="pu-date">${T('التاريخ', 'Date')} <span aria-hidden="true" class="req">*</span></label><input class="input" type="date" id="pu-date" name="date" value="${esc(draft.date)}" min="${TODAY_ISO}" ${e.pdate ? 'aria-invalid="true" aria-describedby="pu-date-err"' : ''}>${e.pdate ? `<span class="err" id="pu-date-err">${T('اختر اليوم أو تاريخاً بعده.', 'Pick today or a later date.')}</span>` : ''}</div>
        <div class="field"><label for="pu-time">${T('الوقت', 'Time')} <span aria-hidden="true" class="req">*</span></label><input class="input" type="time" id="pu-time" name="time" value="${esc(draft.time)}" ${e.ptime ? 'aria-invalid="true" aria-describedby="pu-time-err"' : ''}>${e.ptime ? `<span class="err" id="pu-time-err">${T('اختر الوقت.', 'Pick a time.')}</span>` : ''}</div></div>
        <div><button class="btn btn-primary" type="submit">${ic('calendar', 'ic-sm')}${T('جدول الإشعار', 'Schedule push')}</button></div>
        <p class="help">${T('يمكن إلغاء أي إشعار مجدول قبل موعده. كل بطاقة فيها خيار إيقاف الإشعارات.', 'You can cancel any scheduled push before its time. Every card has an option to stop pushes.')}</p>
      </div>
      <div class="cmp-prev"><span class="small muted">${T('المعاينة', 'Preview')}</span>${pushPreview(draft.txt)}</div></form>`, { id: 'composer' });

  const pushes = [...d.pushes].sort((a, c) => (a.date + a.time < c.date + c.time ? 1 : -1));
  const pushList = card(T('الإشعارات', 'Pushes'), SV() ? `${T('مجدولة', 'Scheduled')}: ${fn(d.pushes.filter((x) => x.status === 'scheduled').length)} · ${T('أُرسلت', 'Sent')}: ${fn(d.pushes.filter((x) => x.status === 'sent').length)} ${sampleTag()}` : '', pushes.length ? `<div class="list">${capped('l-push', pushes, (x) => {
    const sg = segAll.find((s) => s.id === x.seg);
    const st = x.status === 'sent' ? `<span class="chip ok">${ic('check')}${T('أُرسل', 'Sent')}${x.reach ? ` · ${fn(x.reach)}` : ''}</span>` : x.status === 'cancelled' ? `<span class="chip idle">${ic('x')}${T('أُلغي', 'Cancelled')}</span>` : `<span class="chip info">${ic('calendar')}${T('مجدول', 'Scheduled')}</span>`;
    const btn = x.status === 'scheduled' ? `<button class="btn btn-ghost btn-sm" data-act="push-cancel" data-id="${x.id}">${ic('x', 'ic-sm')}${T('ألغِ', 'Cancel')}</button>` : x.status === 'cancelled' ? `<button class="btn btn-ghost btn-sm" data-act="push-restore" data-id="${x.id}">${ic('undo', 'ic-sm')}${T('أعد الجدولة', 'Schedule again')}</button>` : '';
    return `<div class="li">${ic('bell')}<div class="grow"><div class="title" dir="auto">${esc(x.own || L(x.txt))}</div><div class="meta"><span class="acct">${ic('wallet', 'ic-sm')}${esc(L(sg ? sg.t : SEG_ALL.t))}</span><span class="when">${esc(fd(x.date, 'day'))} · ${esc(ftime(x.time))}</span></div></div><div class="acts">${st}${btn}</div></div>`;
  }, 4)}</div>` : emptyBox('bell', T('لا إشعارات بعد', 'No pushes yet'), T('اكتب أول إشعار من النموذج.', 'Write the first push in the form.')));

  return {
    title: t('tab_loyalty'),
    facts: SV() ? `${T('بطاقات', 'Cards')}: ${fn(214)} · ${T('إشعارات مجدولة', 'Pushes scheduled')}: ${fn(d.pushes.filter((x) => x.status === 'scheduled').length)} ${sampleTag()}` : T('ختم لكل 250 غرام', '1 stamp per 250 g'),
    body: `<div class="grid g-split">${cardPrev}<div class="stack-l">${rule}${kpis}</div></div>${segCard}<div class="grid g-main">${composer}${pushList}</div>`,
  };
}

/* ---------- Offers ---------- */
function vOffers() {
  const d = db();
  const total = d.codes.reduce((a, x) => a + x.n, 0);
  const first = d.codes.reduce((a, x) => a + x.first, 0);
  const max = Math.max(1, ...d.codes.map((x) => x.n));
  const sorted = [...d.codes].sort((a, c) => c.n - a.n);
  const bars = sorted.length ? `<div class="card-body bars">${sorted.map((x) => `<div class="bar-row" title="${esc(L(x.ch))}: ${fn(x.n)}"><span class="bl">${ic(x.icon, 'ic-sm')}${esc(L(x.ch))}</span><span class="track"><span class="fill" style="width:${(x.n / max) * 100}%"></span></span><span class="v">${fn(x.n)}</span></div>`).join('')}</div>` : noSample();
  const barsCard = card(T('من أين جاء الزبائن', 'Where customers came from'), SV() ? `${T('استخدام الأكواد حسب القناة، منذ 20 أكتوبر', 'Code use by channel, since 20 Oct')} ${sampleTag()}` : '', bars);
  const rows = d.codes.map((x) => `<tr><td class="cell-title"><span class="row">${ic(x.icon, 'ic-sm')}${esc(L(x.ch))}</span></td><td data-l="${T('الكود', 'Code')}"><code class="code">${esc(x.code)}</code></td><td data-l="${T('العرض', 'Offer')}">${esc(L(x.offer))}</td><td data-l="${T('استُخدم', 'Used')}" class="n strong">${fn(x.n)}</td><td data-l="${T('أول زيارة', 'First visits')}" class="n">${fn(x.first)}</td><td data-l="${t('status')}">${x.on ? `<span class="chip ok">${ic('check')}${T('يعمل', 'On')}</span>` : `<span class="chip idle">${ic('pause')}${T('متوقف', 'Paused')}</span>`}</td><td><button class="btn btn-ghost btn-sm" data-act="code-toggle" data-id="${x.id}">${x.on ? `${ic('pause', 'ic-sm')}${T('أوقف', 'Pause')}` : `${ic('play', 'ic-sm')}${T('شغّل', 'Resume')}`}</button></td></tr>`).join('');
  const table = card(T('الأكواد', 'Codes'), SV() ? `${T('كود واحد لكل قناة', 'One code per channel')} ${sampleTag()}` : '', d.codes.length ? `<div class="table-wrap"><table class="t stackable"><thead><tr><th>${T('القناة', 'Channel')}</th><th>${T('الكود', 'Code')}</th><th>${T('العرض', 'Offer')}</th><th>${T('استُخدم', 'Used')}</th><th>${T('أول زيارة', 'First visits')}</th><th>${t('status')}</th><th><span class="sr-only">${T('إجراء', 'Action')}</span></th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyBox('tag', T('لا أكواد بعد', 'No codes yet'), T('ننشئ كوداً لكل قناة قبل أول حملة.', 'We make one code per channel before the first campaign.')));
  const how = card(T('كيف يُحسب المصدر', 'How the source is counted'), '', `<div class="card-body"><ol class="steps-v">
      <li>${T('لكل قناة كود خاص بها.', 'Each channel has its own code.')}</li>
      <li>${T('يذكر الزبون الكود عند الكاشير، أو يظهر في رسالة الحجز.', 'The guest says the code at the cashier, or it shows in the booking DM.')}</li>
      <li>${T('يسجّل الكاشير الكود مع الطلب.', 'The cashier records the code with the order.')}</li>
      <li>${T('هنا ترى عدد الزبائن من كل قناة، وكم منهم يزور أول مرة.', 'Here you see how many guests came from each channel, and how many came for the first time.')}</li>
    </ol><div class="note" style="margin-top:12px">${ic('alertc', 'ic-sm')}<span>${T('قواعد عروض الخصم في الأردن لم تُفحص بعد. نفحص كل عرض قبل نشره، ونطلب موافقة صاحب الامتياز إذا لزم.', 'Jordan\'s rules on discount offers are not checked yet. We check each offer before it runs, and ask the franchisor if needed.')}</span></div></div>`);
  return {
    title: t('tab_offers'),
    facts: SV() ? `${T('أكواد', 'Codes')}: ${fn(d.codes.length)} · ${T('استُخدمت', 'Used')}: ${fn(total)} · ${T('أول زيارة', 'First visits')}: ${fn(first)} ${sampleTag()}` : T('لا أكواد بعد', 'No codes yet'),
    body: `<div class="grid g-main">${barsCard}${how}</div>${table}`,
  };
}

/* ---------- Reviews ---------- */
const stars = (n) => `<span class="stars" role="img" aria-label="${fn(n)} / 5">${Array.from({ length: 5 }, (_, i) => `<svg class="ic ic-sm ${i < n ? 'on' : ''}" viewBox="0 0 24 24" aria-hidden="true">${ICONS.star}</svg>`).join('')}</span>`;
/* time runs from the inline start: right to left in Arabic, like the week grid */
function lineChart(weeks) {
  const W = 520; const H = 180; const pl = 34; const pr = 16; const pt = 14; const pb = 30;
  const rtl = ST.lang === 'ar';
  const lo = 4.0; const hi = 5.0;
  const x0 = (i) => pl + (i * (W - pl - pr)) / (weeks.length - 1);
  const x = (i) => (rtl ? W - x0(i) : x0(i));
  const y = (v) => pt + ((hi - v) * (H - pt - pb)) / (hi - lo);
  const gx1 = rtl ? pr : pl; const gx2 = rtl ? W - pl : W - pr;
  const grid = [4.0, 4.5, 5.0].map((v) => `<line x1="${gx1}" x2="${gx2}" y1="${y(v)}" y2="${y(v)}" class="g"/><text x="${rtl ? W - pl + 6 : pl - 6}" y="${y(v) + 4}" text-anchor="${rtl ? 'start' : 'end'}" class="ax">${v.toFixed(1)}</text>`).join('');
  const pts = weeks.map((w, i) => `${x(i)},${y(w.r)}`).join(' ');
  const dots = weeks.map((w, i) => `<g class="pt" tabindex="0" role="img" aria-label="${esc(fd(w.w))}: ${w.r.toFixed(1)}"><title>${esc(fd(w.w))}: ${w.r.toFixed(1)}</title><circle cx="${x(i)}" cy="${y(w.r)}" r="12" class="hit"/><circle cx="${x(i)}" cy="${y(w.r)}" r="4" class="mk"/></g>`).join('');
  const labels = weeks.map((w, i) => (i % 2 === 1 || i === weeks.length - 1 ? `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" class="ax">${esc(fd(w.w))}</text>` : '')).join('');
  const li = weeks.length - 1; const last = weeks[li];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${T('التقييم حسب الأسبوع', 'Rating by week')}" dir="ltr">${grid}<polyline points="${pts}" class="ln"/>${dots}${labels}<text x="${rtl ? x(li) + 8 : x(li) - 8}" y="${y(last.r) - 12}" text-anchor="${rtl ? 'start' : 'end'}" class="lbl">${last.r.toFixed(1)}</text></svg>`;
}
function barChart(weeks) {
  const W = 520; const H = 180; const pl = 26; const pr = 16; const pt = 18; const pb = 30;
  const rtl = ST.lang === 'ar';
  const max = Math.max(...weeks.map((w) => w.n), 1);
  const bw = (W - pl - pr) / weeks.length;
  const y = (v) => pt + ((max - v) * (H - pt - pb)) / max;
  const slot = (i) => (rtl ? W - pl - (i + 1) * bw : pl + i * bw); // left edge of slot i
  const bars = weeks.map((w, i) => { const h = Math.max(H - pb - y(w.n), w.n ? 2 : 0); return `<g class="pt" tabindex="0" role="img" aria-label="${esc(fd(w.w))}: ${w.n}"><title>${esc(fd(w.w))}: ${w.n}</title><rect x="${slot(i)}" y="${pt}" width="${bw}" height="${H - pt - pb}" class="hit"/><rect x="${slot(i) + 3}" y="${H - pb - h}" width="${bw - 6}" height="${h}" rx="3" class="bar"/></g>`; }).join('');
  const labels = weeks.map((w, i) => (i % 2 === 1 || i === weeks.length - 1 ? `<text x="${slot(i) + bw / 2}" y="${H - 8}" text-anchor="middle" class="ax">${esc(fd(w.w))}</text>` : '')).join('');
  const peak = weeks.reduce((a, w, i) => (w.n > weeks[a].n ? i : a), 0);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${T('تقييمات جديدة حسب الأسبوع', 'New reviews by week')}" dir="ltr"><line x1="${rtl ? pr : pl}" x2="${rtl ? W - pl : W - pr}" y1="${H - pb}" y2="${H - pb}" class="g"/>${bars}${labels}<text x="${slot(peak) + bw / 2}" y="${y(weeks[peak].n) - 6}" text-anchor="middle" class="lbl">${weeks[peak].n}</text></svg>`;
}
const weeksTable = (weeks) => `<details class="tv"><summary>${t('table_view')}</summary><div class="table-wrap"><table class="t"><thead><tr><th>${T('الأسبوع', 'Week of')}</th><th>${T('التقييم', 'Rating')}</th><th>${T('تقييمات جديدة', 'New reviews')}</th></tr></thead><tbody>${weeks.map((w) => `<tr><td>${esc(fd(w.w))}</td><td class="n">${w.r.toFixed(1)}</td><td class="n">${fn(w.n)}</td></tr>`).join('')}</tbody></table></div></details>`;
function qrSvg() {
  const N = 21; let cells = '';
  let s = 7;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const finder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { if (!finder(r, c) && rnd() > 0.52) cells += `<rect x="${c}" y="${r}" width="1" height="1"/>`; }
  const fp = (x0, y0) => `<rect x="${x0}" y="${y0}" width="7" height="7"/><rect x="${x0 + 1}" y="${y0 + 1}" width="5" height="5" class="w"/><rect x="${x0 + 2}" y="${y0 + 2}" width="3" height="3"/>`;
  return `<svg class="qr" viewBox="-1 -1 ${N + 2} ${N + 2}" aria-hidden="true"><rect x="-1" y="-1" width="${N + 2}" height="${N + 2}" class="w"/>${cells}${fp(0, 0)}${fp(N - 7, 0)}${fp(0, N - 7)}</svg>`;
}
function vReviews() {
  const d = db();
  const f = ST.ui.rfilter;
  const drafts = d.reviews.filter((x) => x.status === 'draft');
  const list = d.reviews.filter((x) => f === 'all' || (f === 'draft' && x.status === 'draft') || (f === 'replied' && x.status === 'replied'));
  const k = SV();
  const b = d.base;
  const kpis = `<div class="kpis">
    ${kpi({ icon: 'star', label: T('تقييم arabplaces.com', 'arabplaces.com rating'), val: b ? `${(4.9).toFixed(1)}` : t('dash'), note: b ? `${t('baseline')} · ${fn(BASE.apN)} ${T('تقييماً', 'reviews')}` : '' })}
    ${kpi({ icon: 'pin', label: T('تقييم Google Maps', 'Google Maps rating'), val: sv(GMAPS.rating.toFixed(1)), sample: k, note: k ? `${fn(GMAPS.n)} ${T('تقييماً', 'reviews')}` : '' })}
    ${kpi({ icon: 'qr', label: T('مسح رمز QR للتقييم', 'Review QR scans'), val: sv(fn(GMAPS.qrScans)), sample: k, note: k ? T('منذ 20 أكتوبر', 'Since 20 Oct') : '' })}
    ${kpi({ icon: 'message', label: T('ردود بانتظار موافقتك', 'Replies waiting for you'), val: sv(fn(drafts.length)), sample: k, alert: k && drafts.length > 0 })}
  </div>`;
  const charts = d.weeks.length ? `<div class="grid g-2">
      ${card(T('التقييم حسب الأسبوع', 'Rating by week'), `Google Maps · ${T('آخر 8 أسابيع', 'last 8 weeks')} ${sampleTag()}`, `<div class="card-body">${lineChart(d.weeks)}${weeksTable(d.weeks)}</div>`)}
      ${card(T('تقييمات جديدة حسب الأسبوع', 'New reviews by week'), `Google Maps · ${T('رمز QR بدأ 20 أكتوبر', 'QR started on 20 Oct')} ${sampleTag()}`, `<div class="card-body">${barChart(d.weeks)}${weeksTable(d.weeks)}</div>`)}
    </div>` : `<section class="card">${noSample()}</section>`;
  const filt = `<div class="seg" role="group" aria-label="${T('تصفية', 'Filter')}">${[['all', t('all')], ['draft', T('تحتاج رداً', 'Needs reply')], ['replied', T('تم الرد', 'Replied')]].map(([v, l]) => `<button type="button" data-act="ui" data-k="rfilter" data-v="${v}" aria-pressed="${f === v}">${l}</button>`).join('')}</div>`;
  const rv = (x) => {
    const editing = ST.ui.editReply === x.id;
    let acts = '';
    if (x.status === 'draft' && !editing) acts = `<button class="btn btn-ok btn-sm" data-act="reply-ok" data-id="${x.id}">${ic('send', 'ic-sm')}${T('وافق وانشر الرد', 'Approve and post reply')}</button><button class="btn btn-line btn-sm" data-act="reply-edit" data-id="${x.id}">${ic('edit', 'ic-sm')}${T('عدّل', 'Edit')}</button>`;
    else if (x.status === 'replied') acts = `<span class="chip ok">${ic('check')}${T('نُشر الرد', 'Reply posted')} · ${esc(fd(x.repliedOn))}</span>${x.userReplied ? `<button class="btn btn-ghost btn-sm" data-act="reply-undo" data-id="${x.id}">${ic('undo', 'ic-sm')}${T('اسحب الرد', 'Take reply back')}</button>` : ''}`;
    const replyBox = editing
      ? `<form class="field" data-form="reply" data-id="${x.id}" novalidate><label for="rp-${x.id}">${T('الرد', 'Reply')}</label><textarea class="textarea" id="rp-${x.id}" name="reply" dir="auto" ${ST.err['rp-' + x.id] ? `aria-invalid="true" aria-describedby="rp-${x.id}-err"` : ''}>${esc(ST.drafts['rp-' + x.id] ?? (x.own || L(x.reply)))}</textarea>${ST.err['rp-' + x.id] ? `<span class="err" id="rp-${x.id}-err">${T('اكتب الرد أولاً.', 'Write the reply first.')}</span>` : ''}<div class="row"><button class="btn btn-primary btn-sm" type="submit">${t('save')}</button><button class="btn btn-ghost btn-sm" type="button" data-act="reply-cancel">${t('cancel')}</button></div></form>`
      : `<div class="reply"><span class="small muted">${x.status === 'draft' ? T('مسودة الرد', 'Draft reply') : T('الرد', 'Reply')}</span><p dir="auto">${esc(x.own || L(x.reply))}</p></div>`;
    return `<div class="rv">${stars(x.stars)}<div class="rv-head"><b>${esc(who(x))}</b><span class="when">${esc(fd(x.date, 'day'))}</span><span class="acct">${ic('pin', 'ic-sm')}Google Maps</span>${sampleTag()}</div><p class="rv-txt" dir="auto">${esc(L(x.txt))}</p>${x.flag ? `<div class="note warn">${ic('alert', 'ic-sm')}<span>${T('أُرسلت إلى مدير المطعم للمتابعة.', 'Sent to the restaurant manager to follow up.')}</span></div>` : ''}${replyBox}<div class="row">${acts}</div></div>`;
  };
  const listCard = card(T('تقييمات Google Maps', 'Google Maps reviews'), SV() ? `${T('تحتاج رداً', 'Need a reply')}: ${fn(drafts.length)} ${sampleTag()}` : '', list.length ? `<div class="rv-list">${capped('rv', list, rv, 4)}</div>` : (d.reviews.length ? emptyBox('star', T('لا تقييمات هنا', 'No reviews here'), T('لا يوجد تقييم بهذه الحالة.', 'No review has this status.')) : emptyBox('star', T('لا تقييمات بعد', 'No reviews yet'), T('تظهر تقييمات Google Maps هنا بعد ربط ملف النشاط التجاري.', 'Google Maps reviews show here after the business profile is connected.'))), { right: d.reviews.length ? filt : '' });
  const qr = card(T('رمز QR للتقييم', 'Review QR'), T('على الطاولات والإيصالات', 'On tables and receipts'), `<div class="card-body qr-wrap">${qrSvg()}<div class="stack"><p>${T('يمسح الضيف الرمز، فتفتح صفحة التقييم على Google Maps.', 'The guest scans the code and the Google Maps review page opens.')}</p><p class="small muted">${T('صورة توضيحية. ليست رمزاً يعمل.', 'Illustration. Not a working code.')}</p><button class="btn btn-line btn-sm" data-act="real-build">${ic('download', 'ic-sm')}${T('ملف الطباعة', 'Print file')}</button></div></div>`);
  return {
    title: t('tab_reviews'),
    facts: `arabplaces.com: ${ltr('4.9')} · ${fn(35)} ${T('تقييماً', 'reviews')} (${t('baseline')})${SV() ? ` · ${T('ردود بانتظارك', 'Replies waiting')}: ${fn(drafts.length)} ${sampleTag()}` : ''}`,
    body: `${kpis}${charts}<div class="grid g-main">${listCard}${qr}</div>`,
  };
}

/* ---------- Ads ---------- */
function radiusMap() {
  return `<svg class="map" viewBox="0 0 320 220" role="img" aria-label="${T('دائرة 3 كم حول شارع وصفي التل', '3 km circle around Wasfi Al-Tal St')}">
    <rect x="0" y="0" width="320" height="220" class="m-bg"/>
    <path d="M0 70 L320 95 M0 160 L320 130 M90 0 L120 220 M220 0 L200 220 M0 20 L160 110 L320 200" class="m-rd"/>
    <path d="M40 110 L280 110" class="m-main"/>
    <circle cx="160" cy="110" r="88" class="m-r"/>
    <circle cx="160" cy="110" r="5" class="m-pin"/>
    <text x="160" y="97" text-anchor="middle" class="m-t">${T('شارع وصفي التل', 'Wasfi Al-Tal St')}</text>
    <text x="160" y="214" text-anchor="middle" class="m-s">${T('رسم توضيحي، ليس بمقياس', 'Diagram, not to scale')}</text>
    <line x1="160" y1="110" x2="248" y2="110" class="m-k"/><text x="204" y="126" text-anchor="middle" class="m-t">${T('3 كم', '3 km')}</text>
  </svg>`;
}
function vAds() {
  const d = db();
  const k = SV();
  const spent = d.campaigns.reduce((a, x) => a + x.spent, 0);
  const budget = card(T('ميزانية الإعلانات', 'Ad budget'), T('يدفعها المطعم مباشرة لـ Meta. منفصلة عن أتعاب مارش.', 'The restaurant pays Meta directly. Separate from Marsh\'s fee.'), k ? `<div class="card-body stack"><div class="row between"><span>${T('نوفمبر 2026', 'November 2026')} ${sampleTag()}</span><span class="num strong">${fn(d.campaigns.filter((x) => x.from >= ISO(2026, 11, 1)).reduce((a, x) => a + x.spent, 0))} / ${fn(ADS.budget)} ${t('jod')}</span></div><div class="meter"><span style="width:${Math.min(100, (d.campaigns.filter((x) => x.from >= ISO(2026, 11, 1)).reduce((a, x) => a + x.spent, 0) / ADS.budget) * 100)}%"></span></div><div class="row between small muted"><span>${T('أكتوبر', 'October')}: ${fn(120)} ${t('jod')}</span><span>${T('المجموع منذ البداية', 'Total since the start')}: ${fn(spent)} ${t('jod')}</span></div></div>` : `<div class="card-body">${T('الميزانية الشهرية', 'Monthly budget')}: ${needs('n_budget')}</div>`);
  const radius = card(T('المنطقة', 'Area'), `${T('الدائرة', 'Radius')}: ${T('3 كم', '3 km')} ${sampleTag()}`, `<div class="card-body stack">${radiusMap()}<p class="small">${T('اليوم 6% فقط من جمهور الصفحة في إربد (16 أكتوبر). الإعلانات تستهدف من يعيش أو يعمل قرب المطعم.', 'Today only 6% of the page\'s audience is in Irbid (16 Oct). The ads target people who live or work near the restaurant.')}</p></div>`);
  const aud = card(T('الجماهير', 'Audiences'), k ? `${fn(AUDIENCES.length)} ${sampleTag()}` : '', k ? `<div class="list">${AUDIENCES.map((a) => `<div class="li">${ic(a.icon)}<div class="grow"><div class="title">${esc(L(a.t))}</div><div class="meta">${esc(L(a.d))}</div></div></div>`).join('')}</div>` : noSample());
  const stChip = (x) => (x.status === 'active' ? `<span class="chip ok">${ic('play')}${T('نشطة', 'Active')}</span>` : x.status === 'paused' ? `<span class="chip idle">${ic('pause')}${T('متوقفة', 'Paused')}</span>` : `<span class="chip line">${ic('check')}${T('انتهت', 'Ended')}</span>`);
  const rows = d.campaigns.map((x) => `<tr><td class="cell-title">${esc(L(x.t))}<div class="cell-sub">${esc(fd(x.from))} – ${esc(fd(x.to))}</div></td><td data-l="${T('الجمهور', 'Audience')}">${esc(L(byId(AUDIENCES, x.aud).t))}</td><td data-l="${T('الهدف', 'Goal')}">${esc(L(x.goal))}</td><td data-l="${T('الميزانية', 'Budget')}" class="n">${fn(x.budget)} ${t('jod')}</td><td data-l="${T('المصروف', 'Spent')}" class="n">${fn(x.spent)} ${t('jod')}<div class="meter thin"><span style="width:${(x.spent / x.budget) * 100}%"></span></div></td><td data-l="${T('النتائج', 'Results')}">${x.res ? esc(L(x.res)) : t('dash')}</td><td data-l="${t('status')}">${stChip(x)}</td><td>${x.status === 'ended' ? '' : `<button class="btn btn-ghost btn-sm" data-act="camp-toggle" data-id="${x.id}">${x.status === 'active' ? `${ic('pause', 'ic-sm')}${T('أوقف', 'Pause')}` : `${ic('play', 'ic-sm')}${T('شغّل', 'Resume')}`}</button>`}</td></tr>`).join('');
  const camps = card(T('الحملات', 'Campaigns'), k ? `${T('النتائج عينة', 'Results are a sample')} ${sampleTag()}` : '', d.campaigns.length ? `<div class="table-wrap"><table class="t stackable"><thead><tr><th>${T('الحملة', 'Campaign')}</th><th>${T('الجمهور', 'Audience')}</th><th>${T('الهدف', 'Goal')}</th><th>${T('الميزانية', 'Budget')}</th><th>${T('المصروف', 'Spent')}</th><th>${T('النتائج', 'Results')}</th><th>${t('status')}</th><th><span class="sr-only">${T('إجراء', 'Action')}</span></th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyBox('target', T('لا حملات بعد', 'No campaigns yet'), T('تبدأ الحملات بعد ربط حساب الإعلانات وبطاقة الدفع باسم المطعم.', 'Campaigns start after the ad account and a payment card in the restaurant\'s name are connected.')));
  const rule = `<div class="note warn">${ic('ban', 'ic-sm')}<span><b>${T('لا أرجيلة في أي إعلان.', 'No argileh in any ad.')}</b> ${T('قانون الصحة العامة الأردني رقم 47 لسنة 2008 يمنع الإعلان عن التبغ، وسياسة Meta تقيّده أيضاً.', 'Jordan Public Health Law No. 47 of 2008 bans tobacco advertising. Meta\'s ad policy limits it too.')}</span></div>`;
  return {
    title: t('tab_ads'),
    facts: k ? `${T('نشطة', 'Active')}: ${fn(d.campaigns.filter((x) => x.status === 'active').length)} · ${T('الدائرة', 'Radius')} ${T('3 كم', '3 km')} · ${T('صُرف', 'Spent')} ${fn(spent)} ${t('jod')} ${sampleTag()}` : T('لا حملات بعد', 'No campaigns yet'),
    body: `${rule}<div class="grid g-split">${radius}<div class="stack-l">${budget}${aud}</div></div>${camps}`,
  };
}

/* ---------- Opening ---------- */
const BRIEF = (x) => [
  [T('ماذا', 'What'), T(`زيارة الطابق الأول في Brands by SEKA، ${fd(x.date, 'day')}، الساعة 8 مساءً.`, `Visit the first floor of Brands by SEKA on ${fd(x.date, 'day')} at 8 pm.`)],
  [T('صوّر', 'Film'), T('التقطيع بالساطور على الطاولة · الصوصات الـ14 والسلطات الـ7 · الطابق الأول والكافيه.', 'The cleaver slicing at the table · the 14 sauces and 7 salads · the first floor and the café.')],
  [T('قل', 'Say'), T('الأسعار كما هي: الخروف 35 دينار للكيلو، الريش 37 دينار للكيلو، الطلب يبدأ من 500 غرام.', 'The prices as they are: lamb 35 JOD/kg, ribs 37 JOD/kg, orders from 500 g.')],
  [T('الكود', 'Code'), `<code class="code">${esc(x.code)}</code> · ${T('عرض أول زيارة', 'first-visit offer')}`],
  [T('الإفصاح', 'Disclosure'), T('علّم المنشور كشراكة مدفوعة.', 'Mark the post as a paid partnership.')],
  [T('ممنوع', 'Do not'), `<b>${T('لا أرجيلة في أي منشور أو قصة أو إعلان أو فيديو.', 'No argileh in any post, story, ad or video.')}</b> ${T('لا كلمات مثل «الأفضل» أو «الوحيد» أو «رقم 1».', 'No words like "best", "the only" or "#1".')}`],
  [T('قبل النشر', 'Before posting'), T('أرسل الفيديو إلى مارش للمراجعة.', 'Send the video to Marsh for review.')],
];
function vOpening() {
  const d = db();
  const od = dayDiff(toD(OPENING), TODAY);
  const done = d.launch.filter((x) => x.done).length;
  const items = d.launch.map((x) => {
    const late = !x.done && x.due < TODAY_ISO;
    const chip = x.done ? `<span class="chip ok">${ic('check')}${T('تم', 'Done')} · ${esc(fd(x.done))}</span>` : x.prog ? `<span class="chip info">${ic('refresh')}${T('قيد التنفيذ', 'In progress')}</span>` : late ? `<span class="chip bad">${ic('alert')}${T('متأخر', 'Late')}</span>` : `<span class="chip warn">${ic('clock')}${T('مستحق', 'Due')} · ${esc(relDays(x.due))}</span>`;
    const btn = x.done ? `<button class="btn btn-ghost btn-sm" data-act="launch-reopen" data-id="${x.id}">${ic('undo', 'ic-sm')}${T('أعد الفتح', 'Reopen')}</button>` : `<button class="btn btn-line btn-sm" data-act="launch-done" data-id="${x.id}">${ic('check', 'ic-sm')}${T('سجّل كمنجز', 'Mark done')}</button>`;
    return `<li class="tl-i ${x.done ? 'done' : ''}"><span class="tl-dot">${x.done ? ic('check', 'ic-sm') : ''}</span><div class="grow"><div class="title">${esc(L(x.t))}</div><div class="meta"><span class="when">${esc(fd(x.due, 'day'))}</span><span>${x.who === 'owner' ? t('owner') : t('marsh')}</span></div></div><div class="acts">${chip}${btn}</div></li>`;
  }).join('');
  const check = card(T('قائمة الافتتاح', 'Opening checklist'), d.launch.length ? `${T('تم', 'Done')}: ${fn(done)} / ${fn(d.launch.length)} ${sampleTag()}` : '', d.launch.length ? `<div class="card-body"><div class="meter" style="margin-bottom:12px"><span style="width:${(done / d.launch.length) * 100}%"></span></div><ol class="tl">${items}</ol></div>` : emptyBox('flag', T('لا قائمة بعد', 'No checklist yet'), T('تُكتب القائمة بعد تحديد موعد الافتتاح.', 'The checklist is written once the opening date is set.')));
  const inflChip = (x) => (x.status === 'posted' ? `<span class="chip ok">${ic('check')}${T('نشر', 'Posted')}</span>` : x.status === 'accepted' ? `<span class="chip info">${ic('calendar')}${T('وافق', 'Accepted')}</span>` : `<span class="chip warn">${ic('clock')}${T('أُرسل الملخص', 'Brief sent')}</span>`);
  const infl = card(T('المؤثرون', 'Influencers'), d.infl.length ? `${fn(d.infl.length)} · ${T('أسماء العينة فقط', 'Sample names only')} ${sampleTag()}` : '', d.infl.length ? `<div class="list">${d.infl.map((x) => `<div class="li infl"><span class="av">${esc(L(x.name).slice(-1))}</span><div class="grow"><div class="title">${esc(L(x.name))}</div><div class="meta"><span class="acct">${ic(PLAT[x.plat].icon, 'ic-sm')}${esc(L(PLAT[x.plat]))} · ${bdi(x.size)}</span><span class="when">${esc(fd(x.date, 'day'))}</span>${x.views ? `<span>${T('مشاهدات', 'Views')}: <b class="num">${fn(x.views)}</b></span>` : ''}</div>
      <details class="brief"><summary>${T('الملخص المكتوب', 'Written brief')}</summary><dl>${BRIEF(x).map(([a, b2]) => `<div><dt>${a}</dt><dd>${b2}</dd></div>`).join('')}</dl></details></div>
      <div class="acts">${inflChip(x)}${x.status === 'posted' ? (x.userPosted ? `<button class="btn btn-ghost btn-sm" data-act="infl-undo" data-id="${x.id}">${ic('undo', 'ic-sm')}${t('undo')}</button>` : '') : `<button class="btn btn-line btn-sm" data-act="infl-posted" data-id="${x.id}">${ic('check', 'ic-sm')}${T('سجّل النشر', 'Mark posted')}</button>`}</div></div>`).join('')}</div>` : emptyBox('users', T('لا مؤثرين بعد', 'No influencers yet'), T('نرشّح أسماء بعد الاتفاق على الميزانية.', 'We suggest names after the budget is agreed.')));
  const k = SV();
  const results = card(T('نتائج الأسبوع الأول', 'First-week results'), k ? `${ltr('24–31')} ${T('أكتوبر', 'Oct')} ${sampleTag()}` : '', k ? `<div class="card-body mini-stats">
      <div><b class="num">${fn(34300)}</b><span>${T('مشاهدات منشورات المؤثرين', 'views of influencer posts')}</span></div>
      <div><b class="num">${fn(55)}</b><span>${T('استخدام أكواد المؤثرين', 'influencer codes used')}</span></div>
      <div><b class="num">${fn(96)}</b><span>${T('بطاقة ولاء ليلة الافتتاح', 'loyalty cards on opening night')}</span></div></div>` : noSample());
  return {
    title: t('tab_opening'),
    facts: `${T('الطابق الأول: مطعم وكافيه', 'First floor: restaurant and café')} · ${esc(fd(OPENING, 'long'))} · ${esc(relDays(OPENING))}`,
    body: `<div class="note warn">${ic('ban', 'ic-sm')}<span><b>${T('لا أرجيلة في أي منشور أو قصة أو إعلان أو فيديو.', 'No argileh in any post, story, ad or video.')}</b> ${T('قانون الصحة العامة رقم 47 لسنة 2008. القاعدة مكتوبة في ملخص كل مؤثر.', 'Public Health Law No. 47 of 2008. The rule is written into every influencer brief.')}</span></div>
      <div class="opening-head card"><div class="count-big">${openingCount(od)}</div><div class="oh-facts"><div><small>${T('التاريخ', 'Date')}</small><b>${esc(fd(OPENING, 'full'))}</b></div><div><small>${T('اسم الكافيه', 'Café name')}</small>${needs('n_cafe_name')}</div><div><small>${T('المكان', 'Place')}</small><b>${esc(L(CLIENT.place))}</b></div></div></div>
      <div class="grid g-main">${check}<div class="stack-l">${results}</div></div>${infl}`,
  };
}

/* ---------- Report ---------- */
function vReport() {
  const d = db();
  const k = SV();
  const b = d.base;
  const head = `<tr><th>${T('المقياس', 'Measure')}</th><th>${t('baseline')}</th><th>${T('هذا الشهر', 'This month')} ${k ? sampleTag() : ''}</th><th>${T('الهدف', 'Target')}</th></tr>`;
  const rows = REPORT_ROWS.map((r) => `<tr><td class="cell-title">${esc(L(r.k))}</td><td data-l="${t('baseline')}" class="n">${b && r.base ? `<b>${ltr(r.base)}</b>` : `<span class="muted">${t('dash')}</span>`}</td><td data-l="${T('هذا الشهر', 'This month')}" class="n">${k && r.now ? (typeof r.now === 'string' ? ltr(r.now) : esc(L(r.now))) : `<span class="muted">${t('dash')}</span>`}</td><td data-l="${T('الهدف', 'Target')}">${needs('n_target')}</td></tr>`).join('');
  const table = card(T('الأساس وهذا الشهر والهدف', 'Baseline, this month, target'), `${T('الأساس من مكالمة 16 أكتوبر · الأهداف تُتفق في أول اجتماع', 'Baseline from the 16 Oct call · targets are agreed at the first meeting')}`, `<div class="table-wrap"><table class="t stackable rep">${`<thead>${head}</thead>`}<tbody>${rows}</tbody></table></div>`);
  const loc = [['jo', T('الأردن', 'Jordan'), 54, 63], ['tn', T('تونس', 'Tunisia'), 25, 19], ['irbid', T('إربد', 'Irbid'), 6, 10]];
  const locCard = card(T('موقع الجمهور', 'Audience location'), `${T('نسبة من المتابعين', 'Share of followers')}`, `<div class="card-body stack"><div class="legend">${b ? `<span><i class="sw base"></i>${t('baseline')}</span>` : ''}${k ? `<span><i class="sw now"></i>${T('هذا الشهر', 'This month')} ${sampleTag()}</span>` : ''}</div>
      ${loc.map(([, n, bv, nv]) => `<div class="gbar"><span class="gl">${n}</span><div class="gt">${b ? `<div class="bar-row2" title="${esc(t('baseline'))}: ${bv}%"><span class="track"><span class="fill base" style="width:${bv}%"></span></span><span class="v">${pct(bv)}</span></div>` : ''}${k ? `<div class="bar-row2" title="${esc(T('هذا الشهر', 'This month'))}: ${nv}%"><span class="track"><span class="fill now" style="width:${nv}%"></span></span><span class="v">${pct(nv)}</span></div>` : ''}</div></div>`).join('')}
      <p class="small muted">${T('صاحب المطعم يظن أن جزءاً من المتابعين غير حقيقي. نتحقق من ذلك في مراجعة الحساب.', 'The owner thinks some followers are not real. We check this in the account audit.')}</p></div>`);
  const brands = [
    { n: { ar: 'Brands by SEKA', en: 'Brands by SEKA' }, f: b ? fn(BASE.followers) : null, posts: 14, reels: 9 },
    { n: { ar: 'مشهور', en: 'Mashhoor' }, f: null, posts: 4, reels: 3 },
    { n: { ar: 'شاورما نشمي', en: 'Nashmi Shawarma' }, f: null, posts: 4, reels: 3 },
  ];
  const bRows = [
    [T('معرّف إنستغرام', 'Instagram handle'), () => needs('n_handle')],
    [`${T('المتابعون', 'Followers')} (${t('baseline')})`, (x) => (x.f ? `<b>${x.f}</b>` : needs('n_handle'))],
    [T('منشورات هذا الشهر (دون الريلز)', 'Posts this month (not reels)'), (x) => (k ? `${fn(x.posts)}` : t('dash'))],
    [T('ريلز هذا الشهر', 'Reels this month'), (x) => (k ? `${fn(x.reels)}` : t('dash'))],
    [T('أيام تصوير مشتركة', 'Shared shoot days'), () => (k ? fn(4) : t('dash'))],
  ];
  const brandCard = card(T('العلامات الثلاث', 'The 3 brands'), `${T('مكان واحد، صاحب واحد، أيام تصوير مشتركة', 'One place, one owner, shared shoot days')} ${k ? sampleTag() : ''}`, `<div class="table-wrap"><table class="t stackable brands"><thead><tr><th></th>${brands.map((x) => `<th>${esc(L(x.n))}</th>`).join('')}</tr></thead><tbody>${bRows.map(([lbl, f]) => `<tr><td class="cell-title">${lbl}</td>${brands.map((x) => `<td data-l="${esc(L(x.n))}" class="n">${f(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
  const did = card(T('ما نفذته مارش هذا الشهر', 'What Marsh did this month'), k ? sampleTag() : '', k ? `<div class="card-body mini-stats wrap4">
      <div><b class="num">${fn(14)}</b><span>${T('منشوراً', 'posts')}</span></div><div><b class="num">${fn(9)}</b><span>${T('ريلز', 'reels')}</span></div>
      <div><b class="num">${fn(52)}</b><span>${T('قصة', 'stories')}</span></div><div><b class="num">${fn(4)}</b><span>${T('أيام تصوير', 'shoot days')}</span></div>
      <div><b class="num">${fn(42)}</b><span>${T('رسالة في 7 أيام', 'DMs in 7 days')}</span></div><div><b class="num">${fn(11)}</b><span>${T('رداً على تقييمات', 'review replies')}</span></div></div>` : noSample());
  const nextM = card(T('الشهر القادم', 'Next month'), k ? sampleTag() : '', k ? `<div class="card-body"><ul class="checklist">${[
    T('حملة «كم كيلو لمجموعتك؟» للمجموعات والعزائم', '"How many kilos for your group?" campaign for groups and events'),
    T('ليالي كرة القدم في الطابق الأول', 'Football nights on the first floor'),
    T('منشورات مشتركة مع @meatmoot_jordan', 'Collab posts with @meatmoot_jordan'),
    T('بدء خطة رمضان 2027: إفطار وسحور', 'Start the Ramadan 2027 plan: iftar and suhoor'),
  ].map((x) => `<li>${ic('circle', 'ic-sm ck-idle')}<span>${x}</span></li>`).join('')}</ul></div>` : noSample());
  return {
    title: t('tab_report'),
    facts: `${T('أكتوبر 2026', 'October 2026')} · ${esc(fd(START))} – ${esc(fd(ISO(2026, 11, 2)))} · ${T('أول تقرير', 'First report')} ${sampleTag()}`,
    actions: `<button class="btn btn-line" data-act="real-build">${ic('download', 'ic-sm')}${T('تنزيل PDF', 'Download PDF')}</button>`,
    body: `<div class="grid g-main">${table}<div class="stack-l">${locCard}${did}</div></div><div class="grid g-main">${brandCard}${nextM}</div>`,
  };
}

/* ======================================================================
   8. Render + routing
   ====================================================================== */
const VIEWS = { home: vHome, content: vContent, messages: vMessages, loyalty: vLoyalty, offers: vOffers, reviews: vReviews, ads: vAds, opening: vOpening, report: vReport };
let lastRoute = null;
function render() {
  const root = document.getElementById('app');
  document.documentElement.lang = ST.lang;
  document.documentElement.dir = ST.lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dataset.theme = ST.theme;
  if (ST.page === 'index') { root.innerHTML = indexPage(); document.title = t('portal_title'); return; }
  const r = route();
  const fnView = VIEWS[r.v];
  const titleOnly = { home: 'tab_home', content: 'tab_content', messages: 'tab_messages', loyalty: 'tab_loyalty', offers: 'tab_offers', reviews: 'tab_reviews', ads: 'tab_ads', opening: 'tab_opening', report: 'tab_report' }[r.v];
  let v;
  try {
    if (ST.mode === 'loading') v = { title: t(titleOnly), facts: t('loading'), body: skeleton() };
    else if (ST.mode === 'error') v = { title: t(titleOnly), facts: '', body: errorView() };
    else v = fnView();
  } catch (err) {
    console.error(err);
    v = { title: t(titleOnly), facts: '', body: viewFailed() };
  }
  const body = pageHead(v.title, v.facts, v.actions) + v.body;
  const y = window.scrollY;
  try { root.innerHTML = shell(r, body); } catch (err) { console.error(err); root.innerHTML = `<main class="c-content">${viewFailed()}</main>`; return; }
  const plain = document.createElement('div'); plain.innerHTML = String(v.title);
  document.title = `${plain.textContent} · ${t('portal_title')}`;
  if (lastRoute !== null && lastRoute !== r.v) { window.scrollTo(0, 0); const h1 = document.getElementById('page-h1'); if (h1) h1.focus({ preventScroll: true }); } else window.scrollTo(0, y);
  lastRoute = r.v;
  const mb = root.querySelector('.mockbar');
  if (mb) mb.addEventListener('toggle', () => store.set('mbOpen', mb.open));
}
function indexPage() {
  return `<main id="main" class="chooser">
    <div class="chooser-head"><img src="assets/brand/marsh-lockup.svg" alt="${esc(T('مارش للتسويق والتطوير', 'Marsh Marketing and Development'))}" width="176" height="64">${langBtn()}</div>
    <div><div class="page-title"><h1>${t('portal_title')}</h1></div><p class="page-facts">${T('نموذج قابل للنقر. القيم المعلّمة «عينة» ليست بيانات حقيقية.', 'Clickable mockup. Values marked "Sample" are not real data.')}</p></div>
    <div class="choices one"><a class="choice" href="client.html${esc(location.search)}"><h2>${esc(L(CLIENT.name))}</h2><p class="sub">${t('by_marsh')}</p><ul>${TABS.map(([, , l]) => `<li>${t(l)}</li>`).join('')}</ul><span class="go">${T('فتح البوابة', 'Open the portal')}${ic('arrow', 'ic-sm')}</span></a></div>
  </main>`;
}

/* ======================================================================
   9. Events
   ====================================================================== */
const nowStamp = () => TODAY_ISO;
document.addEventListener('submit', (e) => {
  const f = e.target;
  const kind = f.dataset.form;
  if (!kind) return;
  e.preventDefault();
  if (kind === 'changes') {
    const id = f.dataset.id;
    const note = String(new FormData(f).get('note') || '').trim();
    if (!note) { ST.err['ch-' + id] = true; render(); const ta = document.getElementById('ch-' + id); if (ta) ta.focus(); return; }
    delete ST.err['ch-' + id]; delete ST.drafts['ch-' + id];
    const x = post(id);
    const prev = { appr: x.appr, note: x.note, stage: x.stage };
    act(T(`أُرسل طلب التعديل على «${L(x.t)}»`, `Change request sent for "${L(x.t)}"`), () => { x.appr = 'changes'; x.note = { ar: note, en: note }; ST.noteOpen.delete(id); ST.noteOpen.add('done-' + id); }, () => { Object.assign(x, prev); ST.noteOpen.delete('done-' + id); });
    return;
  }
  if (kind === 'push') {
    const fdt = new FormData(f);
    const dr = { seg: String(fdt.get('seg')), txt: String(fdt.get('txt') || '').trim(), date: String(fdt.get('date') || ''), time: String(fdt.get('time') || '') };
    ST.draft = dr; store.set('pushDraft', dr);
    const E = {};
    if (!dr.txt) E.ptxt = true;
    if (!dr.date || dr.date < TODAY_ISO) E.pdate = true;
    if (!dr.time) E.ptime = true;
    ST.err = { ...ST.err, ptxt: E.ptxt, pdate: E.pdate, ptime: E.ptime };
    if (Object.keys(E).length) { render(); const first = document.querySelector('#composer [aria-invalid="true"]'); if (first) first.focus(); return; }
    const p = { id: 'u' + Date.now(), seg: dr.seg, own: dr.txt, txt: { ar: dr.txt, en: dr.txt }, date: dr.date, time: dr.time, status: 'scheduled' };
    const prevDraft = dr;
    act(T(`جُدول الإشعار: ${fd(dr.date, 'day')} · ${ftime(dr.time)}`, `Push scheduled: ${fd(dr.date, 'day')} · ${ftime(dr.time)}`), () => { ST.pushes.push(p); ST.draft = null; store.set('pushDraft', null); }, () => { ST.pushes = ST.pushes.filter((x) => x.id !== p.id); if (!ST.draft || !ST.draft.txt) { ST.draft = prevDraft; store.set('pushDraft', prevDraft); } });
    return;
  }
  if (kind === 'reply') {
    const id = f.dataset.id;
    const v = String(new FormData(f).get('reply') || '').trim();
    if (!v) { ST.err['rp-' + id] = true; ST.drafts['rp-' + id] = ''; render(); const ta = document.getElementById('rp-' + id); if (ta) ta.focus(); return; }
    delete ST.err['rp-' + id]; delete ST.drafts['rp-' + id];
    const x = byId(ST.reviews, id);
    const prev = x.own;
    act(T('حُفظ الرد. لم يُنشر بعد.', 'Reply saved. Not posted yet.'), () => { x.own = v; ST.ui.editReply = null; }, () => { x.own = prev; });
  }
});
/* clear a field's error as soon as the field is valid, without a re-render that would move the caret */
function clearFieldError(key, el) {
  if (!ST.err[key]) return;
  delete ST.err[key];
  el.removeAttribute('aria-invalid');
  const msg = document.getElementById(el.id + '-err'); if (msg) msg.remove();
}
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.matches('textarea[id^="ch-"], textarea[id^="rp-"]')) {
    ST.drafts[el.id] = el.value;
    if (el.value.trim()) clearFieldError(el.id, el);
  }
  if (el.id === 'pu-txt') {
    if (el.value.trim()) clearFieldError('ptxt', el);
    const c = document.querySelector('[data-count]');
    if (c) c.textContent = fn(el.value.length);
    const prev = document.querySelector('.push-prev p');
    if (prev) prev.textContent = el.value || T('اكتب الرسالة لتظهر هنا.', 'Write the message to see it here.');
    const f = el.form;
    const dr = { seg: f.seg.value, txt: el.value, date: f.date.value, time: f.time.value };
    ST.draft = dr; store.set('pushDraft', dr);
  }
});
document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.act === 'route') {
    const x = byId(ST.convos, el.dataset.id);
    const prev = x.route; const to = el.value;
    act(T(`حُوّلت المحادثة إلى: ${L(ROUTE[to])}`, `Chat handed to: ${L(ROUTE[to])}`), () => { x.route = to; }, () => { x.route = prev; });
    return;
  }
  const f = el.form;
  if (f && f.dataset.form === 'push') {
    ST.draft = { seg: f.seg.value, txt: f.txt.value, date: f.date.value, time: f.time.value }; store.set('pushDraft', ST.draft);
    if (el.id === 'pu-date' && el.value && el.value >= TODAY_ISO) clearFieldError('pdate', el);
    if (el.id === 'pu-time' && el.value) clearFieldError('ptime', el);
  }
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b || b.tagName === 'SELECT') return;
  const a = b.dataset.act;
  const id = b.dataset.id;
  switch (a) {
    case 'lang': ST.lang = ST.lang === 'ar' ? 'en' : 'ar'; store.set('lang', ST.lang); render(); break;
    case 'mb': {
      const k = b.dataset.k; let v = b.dataset.v;
      if (k === 'samples') v = v === 'true';
      ST[k] = v;
      if (k !== 'mode') store.set(k, v);
      render(); break;
    }
    case 'retry': ST.mode = 'data'; render(); break;
    case 'reload': location.reload(); break;
    case 'more': if (ST.expanded.has(id)) ST.expanded.delete(id); else ST.expanded.add(id); render(); break;
    case 'ui': {
      const k = b.dataset.k; ST.ui[k] = b.dataset.v;
      if (k === 'cview') { ST.ui.coff = 0; ST.ui.cday = TODAY_ISO; }
      render(); break;
    }
    case 'cnav': {
      const n = Number(b.dataset.v);
      if (ST.ui.cview === 'day') ST.ui.cday = n === 0 ? TODAY_ISO : addDays(ST.ui.cday, n);
      else ST.ui.coff = n === 0 ? 0 : ST.ui.coff + n;
      render(); break;
    }
    case 'cday': ST.ui.cview = 'day'; ST.ui.cday = b.dataset.v; render(); { const c = document.getElementById('cal'); if (c) c.scrollIntoView({ block: 'start' }); } break;
    case 'sheet': ST.sheet = true; render(); { const s = document.querySelector('.sheet a'); if (s) s.focus(); } break;
    case 'sheet-close': ST.sheet = false; setTimeout(render, 0); break;
    case 'real-build': toast(t('real_build')); break;
    case 'approve': {
      const x = post(id); const prev = { appr: x.appr, stage: x.stage, userAppr: x.userAppr };
      act(T(`تمت الموافقة على «${L(x.t)}»`, `Approved "${L(x.t)}"`), () => { x.appr = 'approved'; x.userAppr = true; if (x.stage === 'review') x.stage = 'scheduled'; ST.noteOpen.add('done-' + id); ST.noteOpen.delete(id); delete ST.err['ch-' + id]; }, () => { Object.assign(x, prev); ST.noteOpen.delete('done-' + id); });
      break;
    }
    case 'unapprove': {
      const x = post(id); const prev = { appr: x.appr, stage: x.stage, userAppr: x.userAppr };
      act(T(`أُلغيت الموافقة على «${L(x.t)}»`, `Approval removed for "${L(x.t)}"`), () => { x.appr = 'pending'; x.userAppr = false; if (x.stage === 'scheduled') x.stage = 'review'; }, () => Object.assign(x, prev));
      break;
    }
    case 'unchanges': {
      const x = post(id); const prev = { appr: x.appr, note: x.note };
      act(T(`أُلغي طلب التعديل على «${L(x.t)}»`, `Change request removed for "${L(x.t)}"`), () => { x.appr = 'pending'; }, () => Object.assign(x, prev));
      break;
    }
    case 'changes-open': ST.noteOpen.add(id); render(); { const ta = document.getElementById('ch-' + id); if (ta) { ta.scrollIntoView({ block: 'center' }); ta.focus({ preventScroll: true }); } } break;
    case 'changes-close': ST.noteOpen.delete(id); delete ST.err['ch-' + id]; delete ST.drafts['ch-' + id]; render(); break;
    case 'convo': {
      ST.ui.convo = id; render();
      const th = document.getElementById('thread');
      if (th && window.innerWidth <= 1024) th.scrollIntoView({ block: 'start' });
      break;
    }
    case 'handover': {
      const x = byId(ST.convos, id); const prev = { status: x.status, route: x.route, handed: x.handed, msgs: x.msgs };
      const to = x.topic === 'cafe' ? 'cafe' : (x.topic === 'group' || x.topic === 'complaint') ? 'manager' : 'cashier';
      act(T(`حُوّلت إلى: ${L(ROUTE[to])}`, `Handed to: ${L(ROUTE[to])}`), () => { x.status = 'waiting'; x.route = to; x.handed = true; x.msgs = [...x.msgs, { w: 'sys', kind: 'handover', added: true }]; }, () => Object.assign(x, prev));
      break;
    }
    case 'unhand': {
      const x = byId(ST.convos, id); const prev = { status: x.status, route: x.route, handed: x.handed, msgs: x.msgs };
      act(T('أُعيدت المحادثة للذكاء الاصطناعي', 'Chat returned to the AI'), () => { x.status = 'ai'; x.route = null; x.handed = false; x.msgs = x.msgs.filter((m) => !m.added); }, () => Object.assign(x, prev));
      break;
    }
    case 'answered': {
      const x = byId(ST.convos, id); const prev = x.status;
      act(T(`سُجّلت المحادثة مع ${who(x)} كمجاب عليها`, `Chat with ${who(x)} marked answered`), () => { x.status = 'staff'; }, () => { x.status = prev; });
      break;
    }
    case 'reopen-convo': {
      const x = byId(ST.convos, id); const prev = { status: x.status, route: x.route };
      act(T(`أُعيد فتح المحادثة مع ${who(x)}`, `Chat with ${who(x)} reopened`), () => { x.status = 'waiting'; x.route = x.route || 'cashier'; }, () => Object.assign(x, prev));
      break;
    }
    case 'auto-toggle': { const prev = ST.autoOn; act(prev ? T('أُوقفت الرسالة التلقائية', 'Auto-message turned off') : T('شُغّلت الرسالة التلقائية', 'Auto-message turned on'), () => { ST.autoOn = !prev; }, () => { ST.autoOn = prev; }); break; }
    case 'contact-del': {
      if (e.detail > 1) break; // a double click must not delete the row that moves up
      const c = byId(ST.contacts, id); if (!c) { toast(t('act_failed')); break; }
      act(T(`حُذفت بيانات ${c.who}`, `Deleted ${c.whoEn}'s details`), () => { c.deleted = true; }, () => { c.deleted = false; });
      break;
    }
    case 'contact-restore': {
      const c = byId(ST.contacts, id); if (!c) { toast(t('act_failed')); break; }
      act(T(`استُرجعت بيانات ${c.who}`, `Restored ${c.whoEn}'s details`), () => { c.deleted = false; }, () => { c.deleted = true; });
      break;
    }
    case 'push-seg': {
      ST.draft = { ...(ST.draft || { txt: '', date: ISO(2026, 11, 6), time: '12:00' }), seg: b.dataset.v };
      render(); const c = document.getElementById('composer'); if (c) c.scrollIntoView({ block: 'start' }); const ta = document.getElementById('pu-txt'); if (ta) ta.focus({ preventScroll: true });
      break;
    }
    case 'push-cancel': { const x = byId(ST.pushes, id); act(T('أُلغي الإشعار', 'Push cancelled'), () => { x.status = 'cancelled'; }, () => { x.status = 'scheduled'; }); break; }
    case 'push-restore': { const x = byId(ST.pushes, id); act(T('جُدول الإشعار مرة أخرى', 'Push scheduled again'), () => { x.status = 'scheduled'; }, () => { x.status = 'cancelled'; }); break; }
    case 'code-toggle': { const x = byId(ST.codes, id); const prev = x.on; act(prev ? T(`أُوقف الكود ${x.code}`, `Code ${x.code} paused`) : T(`شُغّل الكود ${x.code}`, `Code ${x.code} resumed`), () => { x.on = !prev; }, () => { x.on = prev; }); break; }
    case 'reply-ok': {
      const x = byId(ST.reviews, id); const prev = { status: x.status, repliedOn: x.repliedOn, userReplied: x.userReplied };
      act(T(`نُشر الرد على تقييم ${x.who}`, `Reply posted to ${x.whoEn}'s review`), () => { x.status = 'replied'; x.repliedOn = nowStamp(); x.userReplied = true; }, () => Object.assign(x, prev));
      break;
    }
    case 'reply-undo': {
      const x = byId(ST.reviews, id); const prev = { status: x.status, repliedOn: x.repliedOn, userReplied: x.userReplied };
      act(T('سُحب الرد وعاد مسودة', 'Reply taken back to draft'), () => { x.status = 'draft'; x.userReplied = false; }, () => Object.assign(x, prev));
      break;
    }
    case 'reply-edit': delete ST.err['rp-' + id]; delete ST.drafts['rp-' + id]; ST.ui.editReply = id; render(); { const ta = document.getElementById('rp-' + id); if (ta) ta.focus(); } break;
    case 'reply-cancel': { const rid = ST.ui.editReply; if (rid) { delete ST.err['rp-' + rid]; delete ST.drafts['rp-' + rid]; } ST.ui.editReply = null; render(); break; }
    case 'camp-toggle': { const x = byId(ST.campaigns, id); const prev = x.status; act(prev === 'active' ? T('أُوقفت الحملة', 'Campaign paused') : T('شُغّلت الحملة', 'Campaign resumed'), () => { x.status = prev === 'active' ? 'paused' : 'active'; }, () => { x.status = prev; }); break; }
    case 'launch-done': { const x = byId(ST.launch, id); const prev = { done: x.done, prog: x.prog }; act(T(`سُجّل «${L(x.t)}» كمنجز`, `"${L(x.t)}" marked done`), () => { x.was = { prog: x.prog }; x.done = nowStamp(); x.prog = false; }, () => Object.assign(x, prev)); break; }
    case 'launch-reopen': { const x = byId(ST.launch, id); const prev = { done: x.done, prog: x.prog }; act(T(`أُعيد فتح «${L(x.t)}»`, `"${L(x.t)}" reopened`), () => { x.done = null; x.prog = x.was ? x.was.prog : false; }, () => Object.assign(x, prev)); break; }
    case 'infl-posted': { const x = byId(ST.infl, id); const prev = { status: x.status, userPosted: x.userPosted }; act(T(`سُجّل نشر ${L(x.name)}`, `${L(x.name)} marked posted`), () => { x.status = 'posted'; x.userPosted = true; }, () => Object.assign(x, prev)); break; }
    case 'infl-undo': { const x = byId(ST.infl, id); const prev = { status: x.status, userPosted: x.userPosted }; const back = INFLUENCERS0.find((y) => y.id === id).status; act(T('أُلغي تسجيل النشر', 'Posted mark removed'), () => { x.status = back === 'posted' ? 'accepted' : back; x.userPosted = false; }, () => Object.assign(x, prev)); break; }
    default: break;
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && ST.sheet) { ST.sheet = false; render(); }
});
window.addEventListener('hashchange', () => { ST.sheet = false; for (const k of ['ptxt', 'pdate', 'ptime']) delete ST.err[k]; render(); });
window.addEventListener('error', (e) => { if (e.error) toast(t('act_failed')); });
window.addEventListener('unhandledrejection', () => toast(t('act_failed')));

/* boot — the toast region lives outside #app so a re-render never drops a pending undo */
(() => { const tz = document.createElement('div'); tz.id = 'toasts'; tz.className = 'toasts'; tz.setAttribute('aria-live', 'polite'); document.body.appendChild(tz); })();
render();
