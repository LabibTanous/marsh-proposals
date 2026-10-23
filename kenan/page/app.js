/* Kenan Housing — project link mockup (Jubeiha 3). Built by Marsh. Local mockup: nothing is sent anywhere. */
(function () {
  'use strict';

  /* ================= Store + state ================= */
  const store = {
    get(k) { try { return window.localStorage.getItem('kenan.' + k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem('kenan.' + k, v); } catch (e) { /* storage blocked: keep in memory */ } }
  };
  const S = {
    lang: (new URLSearchParams(location.search).get('lang') || store.get('lang')) === 'en' ? 'en' : 'ar',
    theme: store.get('theme'),               // 'light' | 'dark' | null (system)
    view: store.get('view') === 'owner' ? 'owner' : 'buyer',
    stage: 'all', room: 'masterBath', sys: 'walls', xsec: 'wall', xv: 6, playing: null,
    matRoom: 'all', matCat: 'all', compare: false,
    utype: 'all', unit: null,
    nearCat: 'all', nearHl: null,
    fac: 0, faqQ: '', dplan: 'g',
    visits: [], approved: {}, uploaded: {}, pkg: 0,
    seenStories: {}, loaded: false
  };

  const IG = 'https://www.instagram.com/p/';
  const IG_PROFILE = 'https://www.instagram.com/kenanhousing.jo/';
  const PHONE = '962795209296';
  const PHONE_LOCAL = '0795209296';
  const MAPS_J3 = 'https://maps.app.goo.gl/C9AH246TwB8BA7NA7';

  /* ================= Strings ================= */
  const STR = {
    ar: {
      brand: 'كنان للإسكان', brandSub: 'شركة حيدر ومحمد القرعان للإسكان',
      viewBuyer: 'صفحة المشتري', viewOwner: 'لوحة المالك',
      mockNote: 'نموذج تجريبي · القيم المعلّمة «عينة» غير مؤكدة',
      lang: 'EN', themeDark: 'الوضع الداكن', themeLight: 'الوضع الفاتح',
      sample: 'عينة', j2: 'عينة · كما في الجبيهة 2', fromPost: 'من منشور كنان', osm: 'OpenStreetMap',
      legend: 'دليل العلامات:', legSample: 'قيمة غير مؤكدة', legJ2: 'مذكورة لمشروع الجبيهة 2 فقط', legSrc: 'منشورة من كنان',
      projName: 'الجبيهة (3)', projArea: 'عمّان · الجبيهة · حي الريان، قرب دوار قصر الأميرة بسمة',
      status: 'تشطيبات نهائية', progress: 'نسبة الإنجاز', heroPhoto: 'صورة من منشور كنان · 16 أيلول 2026',
      f1: '188 م²', f1s: '3 غرف نوم · 1 ماستر', f2: '230 م²', f2s: '4 غرف نوم · 2 ماستر', f3: '230–270 م²', f3s: 'طابق أخير مع روف (دوبلكس)', f4: 'شقق أرضية', f4s: 'مدخل وكراج خاص وساحات',
      wa: 'واتساب', visit: 'احجز زيارة', share: 'مشاركة',
      nav: { progress: 'التقدّم', walls: 'داخل الجدران', materials: 'المواد', units: 'الوحدات', videos: 'الفيديو', location: 'الموقع', facades: 'الواجهات', faq: 'الأسئلة' },
      progressH: 'مراحل البناء', progressSub: 'آخر تحديث في الأعلى',
      cadence: 'تحديث جديد كل 2–4 أيام', nextUpd: 'التحديث القادم: 18–19 تشرين الأول',
      all: 'الكل', photo: 'صور', video: 'فيديو', noUpdates: 'لا توجد تحديثات لهذه المرحلة بعد. تظهر هنا عند رفعها.',
      stageNow: 'جارية', stageNext: 'لم تبدأ', toConfirm: 'يُحدَّد',
      wallsH: 'داخل الجدران', wallsSub: 'اضغط على غرفة لترى ما بداخلها',
      planTitle: 'شقة 188 م² · مخطط توضيحي', planNote: 'المخطط للتوضيح وليس المخطط الهندسي.', tapRoom: 'اضغط على أي غرفة',
      systemsH: 'أنظمة الشقة', sys: { walls: 'الجدران والعزل', pipes: 'المواسير', electrical: 'الكهرباء', paint: 'الدهان', windows: 'الشبابيك والأبواب', heating: 'التدفئة والتكييف' },
      xWall: 'جدار خارجي', xRoof: 'السطح', scrub: 'اسحب لترى الطبقات', play: 'تشغيل', pause: 'إيقاف', outside: 'الخارج', inside: 'الداخل', top: 'الأعلى', bottom: 'الأسفل',
      inVideo: 'يظهر في فيديو', photoSlot: 'صورة من الموقع تُضاف من ملفات المالك', photoFrom: 'من فيديو كنان · 20 تشرين الأول 2025 · الجبيهة 2',
      miter: 'زاوية 45° مقابل زاوية بلاستيك',
      matH: 'قائمة المواد', matSub: 'فلترة حسب الغرفة والنوع', compare: 'قارن مع التشطيب العادي', thisProj: 'هنا:', standard: 'عادي:', noMat: 'لا توجد مواد بهذا الفلتر. غيّر الغرفة أو النوع.',
      roomF: 'الغرفة', catF: 'النوع',
      rooms: { all: 'كل الغرف', bath: 'الحمامات', kitchen: 'المطبخ', living: 'المعيشة والضيوف', bedroom: 'غرف النوم', laundry: 'الغسيل', balcony: 'البرندة', whole: 'كامل الشقة' },
      cats: { all: 'كل الأنواع', tiles: 'البلاط', sanitary: 'الأدوات الصحية', plumbing: 'المواسير', electrical: 'الكهرباء', insulation: 'العزل', windows: 'الشبابيك', paint: 'الدهان', heating: 'التدفئة والتكييف', build: 'البناء والنجارة' },
      unitsH: 'الوحدات', unitsSub: 'المساحات من منشورات كنان · التوزيع والتوفر عينة',
      ut: { all: 'الكل', a188: '188 م²', a230: '230 م²', dup: 'دوبلكس مع روف', ground: 'أرضية' },
      floorG: 'أرضي', floor: 'طابق', floorTop: 'أخير + روف',
      av: 'متاحة', rs: 'محجوزة', sd: 'مباعة', pickUnit: 'اختر وحدة لترى تفاصيلها.',
      uArea: 'المساحة', uBeds: 'غرف النوم', uFloor: 'الطابق', uView: 'الإطلالة', uGarage: 'الكراج', uOut: 'المساحة الخارجية', uStatus: 'الحالة',
      visitUnit: 'احجز زيارة لهذه الوحدة', askUnit: 'اسأل عنها على واتساب',
      videosH: 'فيديو المشروع', videosSub: 'ستوري تلقائي وفيديو جديد كل 2–4 أيام',
      locH: 'الموقع وما حوله', locSub: 'المسافات بخط مستقيم من موقع المشروع',
      near: { all: 'الكل', supermarket: 'سوبرماركت', school: 'مدارس وجامعات', mosque: 'مساجد', health: 'صيدليات ومستشفيات', road: 'طرق رئيسية', mall: 'مول' },
      walk: 'مشي', drive: 'سيارة', min: 'د', m: 'م', km: 'كم', offMap: 'خارج حدود الخريطة',
      mapErr: 'لم يتم تحميل الخريطة. القائمة أدناه تعمل.', noNear: 'لا توجد أماكن من هذا النوع في بيانات الخريطة حول المشروع.',
      osmNote: 'الأماكن من OpenStreetMap بتاريخ 17 تشرين الأول 2026. أوقات المشي والسيارة تقديرية.',
      directions: 'افتح الموقع في الخرائط', project: 'المشروع',
      facH: 'الواجهات', facSub: 'أمامية · جانبية · ليلية',
      facPh: 'صورة يضيفها المالك',
      faqH: 'أسئلة المشترين', faqSub: 'أسئلة يسألها المشترون في الأردن', faqSearch: 'ابحث في الأسئلة', askWa: 'اسأل على واتساب', noFaq: 'لا يوجد سؤال بهذه الكلمات. اسأل على واتساب.',
      footContact: 'التواصل', footBuilt: 'صُنعت بواسطة مارش', footMap: 'بيانات الخريطة © OpenStreetMap contributors',
      footNote: 'نموذج تجريبي لعرضه على كنان. «عينة» تعني قيمة غير مؤكدة يؤكدها كنان قبل النشر.',
      sheetWa: 'رسالة واتساب', waHint: 'يفتح واتساب على هاتفك مع هذه الرسالة.', openWa: 'افتح واتساب', copyMsg: 'انسخ الرسالة',
      sheetVisit: 'حجز زيارة', vUnit: 'الوحدة', anyUnit: 'أي وحدة', vDay: 'اليوم', vTime: 'الوقت', vName: 'الاسم', vPhone: 'رقم الهاتف', vSend: 'أرسل الطلب',
      vNameErr: 'اكتب الاسم.', vPhoneErr: 'اكتب رقماً أردنياً يبدأ بـ 07 (10 أرقام).', vDayErr: 'اختر اليوم والوقت.',
      vDone: 'تم حفظ الطلب في هذا النموذج', vDoneSub: 'لم يُرسل شيء. في النسخة الحقيقية يصل الطلب إلى كنان على واتساب.', vCancel: 'إلغاء الطلب', close: 'إغلاق',
      copied: 'تم نسخ الرابط', copyFail: 'انسخ الرابط: ', undo: 'تراجع', cancelled: 'تم إلغاء الطلب',
      friday: 'الجمعة',
      waMsg: (u) => `مرحباً كنان للإسكان،\nأسأل عن مشروع الجبيهة (3)${u ? '، الوحدة ' + u : ''}.\nأرجو التواصل معي.`,
      waQ: (q) => `مرحباً كنان للإسكان،\nسؤال عن مشروع الجبيهة (3):\n${q}`,
      /* owner */
      ownerH: 'لوحة المالك · الجبيهة (3)', ownerSub: 'ما يحدث في صفحة المشروع وحساب إنستغرام هذا الأسبوع',
      k1: 'متابعو إنستغرام', k1n: '@kenanhousing.jo · 17 تشرين الأول', k2: 'منشورات مجدولة', k2n: 'هذا الأسبوع', k3: 'فيديوهات', k3n: 'من 3 هذا الأسبوع', k4: 'ستوري نُشرت تلقائياً', k4n: 'آخر 7 أيام', k5: 'عملاء من الرابط', k5n: 'آخر 30 يوماً', k6: 'زيارات محجوزة', k6n: 'آخر 30 يوماً',
      schedH: 'جدول المحتوى', schedSub: 'الحساب والتاريخ ظاهران على كل سطر',
      approve: 'موافقة', approved: 'تمت الموافقة', scheduled: 'مجدول', needs: 'بانتظار موافقتك', waitFile: 'بانتظار ملف',
      heatH: 'أكثر الأقسام فتحاً', heatSub: 'عدد مرات الفتح من رابط المشروع · آخر 30 يوماً',
      leadsH: 'العملاء من الرابط', leadsSub: 'آخر الطلبات', newL: 'جديد', replied: 'تم الرد', booked: 'زيارة محجوزة', thisSession: 'من هذه الجلسة',
      filesH: 'ملفات من دروبوكس', filesSub: 'يضع المالك الصور والفيديو والمواصفات في دروبوكس. مارش ترفعها إلى الصفحة.',
      fUp: 'على الصفحة', fWait: 'بانتظار الملف', fIn: 'في دروبوكس', fPush: 'ارفع إلى الصفحة',
      pkH: 'باقات مارش', pkSub: 'مسودة من صافي · 17 تشرين الأول 2026', perMonth: 'دينار / شهر', stories: 'ستوري في الشهر', videos: 'فيديو في الشهر', tbs: 'يُحدَّد', vidSplit: '5 بوجود شخص · 5 بدون (موسيقى، لقطات، تفاصيل)', msgs: 'إدارة الرسائل', draft: 'مسودة', pkg: 'الباقة'
    },
    en: {
      brand: 'Kenan Housing', brandSub: 'Haidar & Mohammad Al-Quraan Housing Co.',
      viewBuyer: 'Buyer view', viewOwner: 'Owner view',
      mockNote: 'Mockup · values marked "Sample" are not confirmed',
      lang: 'ع', themeDark: 'Dark mode', themeLight: 'Light mode',
      sample: 'Sample', j2: 'Sample · as in Jubeiha 2', fromPost: 'From Kenan\'s post', osm: 'OpenStreetMap',
      legend: 'Tags:', legSample: 'value not confirmed', legJ2: 'stated for Jubeiha 2 only', legSrc: 'published by Kenan',
      projName: 'Jubeiha (3)', projArea: 'Amman · Jubeiha · Hay Al-Rayyan, near the Princess Basma Palace roundabout',
      status: 'Final finishing', progress: 'Progress', heroPhoto: 'Photo from Kenan\'s post · 16 Sep 2026',
      f1: '188 m²', f1s: '3 bedrooms · 1 master', f2: '230 m²', f2s: '4 bedrooms · 2 master', f3: '230–270 m²', f3s: 'Top floor with roof (duplex)', f4: 'Ground floors', f4s: 'Own entrance, garage, yards',
      wa: 'WhatsApp', visit: 'Book a visit', share: 'Share',
      nav: { progress: 'Progress', walls: 'Inside the walls', materials: 'Materials', units: 'Units', videos: 'Videos', location: 'Location', facades: 'Facades', faq: 'Questions' },
      progressH: 'Build stages', progressSub: 'Latest update first',
      cadence: 'New update every 2–4 days', nextUpd: 'Next update: 18–19 Oct',
      all: 'All', photo: 'Photos', video: 'Video', noUpdates: 'No updates for this stage yet. They show here when uploaded.',
      stageNow: 'In progress', stageNext: 'Not started', toConfirm: 'To confirm',
      wallsH: 'Inside the walls', wallsSub: 'Tap a room to see what is inside',
      planTitle: '188 m² apartment · illustrative plan', planNote: 'The plan is for illustration. It is not the engineering plan.', tapRoom: 'Tap any room',
      systemsH: 'Apartment systems', sys: { walls: 'Walls & insulation', pipes: 'Pipes', electrical: 'Electrical', paint: 'Paint', windows: 'Windows & doors', heating: 'Heating & cooling' },
      xWall: 'Outside wall', xRoof: 'Roof', scrub: 'Drag to see the layers', play: 'Play', pause: 'Pause', outside: 'Outside', inside: 'Inside', top: 'Top', bottom: 'Bottom',
      inVideo: 'Shown in video', photoSlot: 'Site photo — added from the owner\'s files', photoFrom: 'From Kenan\'s video · 20 Oct 2025 · Jubeiha 2',
      miter: '45° corner vs plastic trim',
      matH: 'Materials list', matSub: 'Filter by room and type', compare: 'Compare with standard finish', thisProj: 'Here:', standard: 'Standard:', noMat: 'No materials match this filter. Change the room or type.',
      roomF: 'Room', catF: 'Type',
      rooms: { all: 'All rooms', bath: 'Bathrooms', kitchen: 'Kitchen', living: 'Living & guest', bedroom: 'Bedrooms', laundry: 'Laundry', balcony: 'Balcony', whole: 'Whole apartment' },
      cats: { all: 'All types', tiles: 'Tiles', sanitary: 'Sanitary ware', plumbing: 'Pipes', electrical: 'Electrical', insulation: 'Insulation', windows: 'Windows', paint: 'Paint', heating: 'Heating & cooling', build: 'Build & joinery' },
      unitsH: 'Units', unitsSub: 'Areas from Kenan\'s posts · layout and availability are sample',
      ut: { all: 'All', a188: '188 m²', a230: '230 m²', dup: 'Duplex with roof', ground: 'Ground' },
      floorG: 'Ground', floor: 'Floor', floorTop: 'Top + roof',
      av: 'Available', rs: 'Reserved', sd: 'Sold', pickUnit: 'Pick a unit to see its details.',
      uArea: 'Area', uBeds: 'Bedrooms', uFloor: 'Floor', uView: 'View', uGarage: 'Garage', uOut: 'Outdoor area', uStatus: 'Status',
      visitUnit: 'Book a visit for this unit', askUnit: 'Ask about it on WhatsApp',
      videosH: 'Project videos', videosSub: 'Stories post on schedule · new video every 2–4 days',
      locH: 'Location and nearby', locSub: 'Straight-line distance from the project',
      near: { all: 'All', supermarket: 'Supermarket', school: 'Schools & universities', mosque: 'Mosques', health: 'Pharmacy & hospital', road: 'Main roads', mall: 'Mall' },
      walk: 'walk', drive: 'drive', min: 'min', m: 'm', km: 'km', offMap: 'outside the map edge',
      mapErr: 'The map did not load. The list below works.', noNear: 'No places of this type in the map data around the project.',
      osmNote: 'Places from OpenStreetMap, 17 Oct 2026. Walk and drive times are estimates.',
      directions: 'Open the location in maps', project: 'Project',
      facH: 'Facades', facSub: 'Front · side · night',
      facPh: 'Photo to be added by the owner',
      faqH: 'Buyer questions', faqSub: 'Questions buyers in Jordan ask', faqSearch: 'Search the questions', askWa: 'Ask on WhatsApp', noFaq: 'No question with these words. Ask on WhatsApp.',
      footContact: 'Contact', footBuilt: 'Built by Marsh', footMap: 'Map data © OpenStreetMap contributors',
      footNote: 'Mockup to show Kenan. "Sample" means a value Kenan confirms before the page goes live.',
      sheetWa: 'WhatsApp message', waHint: 'Opens WhatsApp on your phone with this message.', openWa: 'Open WhatsApp', copyMsg: 'Copy message',
      sheetVisit: 'Book a visit', vUnit: 'Unit', anyUnit: 'Any unit', vDay: 'Day', vTime: 'Time', vName: 'Name', vPhone: 'Phone number', vSend: 'Send request',
      vNameErr: 'Write your name.', vPhoneErr: 'Write a Jordan number that starts with 07 (10 digits).', vDayErr: 'Pick a day and a time.',
      vDone: 'Request saved in this mockup', vDoneSub: 'Nothing was sent. In the live page the request reaches Kenan on WhatsApp.', vCancel: 'Cancel request', close: 'Close',
      copied: 'Link copied', copyFail: 'Copy this link: ', undo: 'Undo', cancelled: 'Request cancelled',
      friday: 'Friday',
      waMsg: (u) => `Hello Kenan Housing,\nI am asking about the Jubeiha (3) project${u ? ', unit ' + u : ''}.\nPlease contact me.`,
      waQ: (q) => `Hello Kenan Housing,\nA question about the Jubeiha (3) project:\n${q}`,
      ownerH: 'Owner view · Jubeiha (3)', ownerSub: 'What happens on the project link and on Instagram this week',
      k1: 'Instagram followers', k1n: '@kenanhousing.jo · 17 Oct', k2: 'Posts scheduled', k2n: 'this week', k3: 'Videos', k3n: 'of 3 this week', k4: 'Stories posted on schedule', k4n: 'last 7 days', k5: 'Leads from the link', k5n: 'last 30 days', k6: 'Visits booked', k6n: 'last 30 days',
      schedH: 'Content schedule', schedSub: 'Account and date on every row',
      approve: 'Approve', approved: 'Approved', scheduled: 'Scheduled', needs: 'Needs your approval', waitFile: 'Waiting for a file',
      heatH: 'Sections buyers open most', heatSub: 'Opens from the project link · last 30 days',
      leadsH: 'Leads from the link', leadsSub: 'Latest requests', newL: 'New', replied: 'Replied', booked: 'Visit booked', thisSession: 'from this session',
      filesH: 'Files from Dropbox', filesSub: 'The owner puts photos, videos and spec sheets in Dropbox. Marsh uploads them to the page.',
      fUp: 'On the page', fWait: 'Waiting for the file', fIn: 'In Dropbox', fPush: 'Upload to page',
      pkH: 'Marsh packages', pkSub: 'Draft from Safi · 17 Oct 2026', perMonth: 'JOD / month', stories: 'stories a month', videos: 'videos a month', tbs: 'to be set', vidSplit: '5 with a person · 5 without (music, B-roll, details)', msgs: 'Messages handling', draft: 'Draft', pkg: 'Package'
    }
  };
  const t = (k) => { const v = k.split('.').reduce((o, p) => (o ? o[p] : undefined), STR[S.lang]); return v === undefined ? k : v; };
  const L = (o) => (o == null ? '' : (typeof o === 'string' ? o : (o[S.lang] != null ? o[S.lang] : o.en)));

  /* ================= Helpers ================= */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MONTHS = {
    ar: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  const DAYS = { ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
  function fmtDate(iso, opts) {
    if (!iso) return t('toConfirm');
    const p = iso.split('-').map(Number); const m = MONTHS[S.lang][p[1] - 1];
    if (p.length === 2) return `${m} ${p[0]}`;
    if (opts && opts.noYear) return S.lang === 'ar' ? `${p[2]} ${m}` : `${p[2]} ${m}`;
    return `${p[2]} ${m} ${p[0]}`;
  }
  const fmtNum = (n) => Number(n).toLocaleString('en-US');
  const dist = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} ${t('km')}` : `${m} ${t('m')}`);
  const walkMin = (m) => Math.max(1, Math.round((m * 1.3) / 80));
  const driveMin = (m) => Math.max(1, Math.round((m * 1.4) / 400 + 1));

  const I = {
    wa: '<path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 7.8 19.4Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-.9.8a3.6 3.6 0 0 1-2.2-2.2l.8-.9-1-2Z"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    play: '<path d="M7 4v16l13-8Z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h3l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
    school: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
    mosque: '<path d="M4 21h16M6 21v-7h12v7M12 4c-3 2-6 4-6 8h12c0-4-3-6-6-8ZM12 2v2M10 21v-3a2 2 0 0 1 4 0v3"/>',
    health: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/>',
    road: '<path d="M4 22 8 2M20 22 16 2M12 4v3M12 11v3M12 18v3"/>',
    mall: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3Z"/><circle cx="12" cy="13" r="3"/>',
    video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    flask: '<path d="M9 3h6M10 3v6L4 20a1 1 0 0 0 1 1.5h14A1 1 0 0 0 20 20l-6-11V3"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    walk: '<circle cx="13" cy="4" r="2"/><path d="m9 20 3-6 3 3v4M6 12l3-4 4 1 3 3"/>',
    car: '<path d="M5 17h14v-5l-2-5H7l-2 5v5Z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    pointer: '<path d="M9 11V5a2 2 0 0 1 4 0v6M13 9a2 2 0 0 1 4 0v3M17 11a2 2 0 0 1 4 0v4a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3l-3-5a2 2 0 0 1 3-2l2 2"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-2"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
  };
  const ic = (n, extra) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra || ''}>${I[n] || ''}</svg>`;

  function tag(kind, src, date) {
    if (kind === 'sample') return `<span class="tag tag-sample">${ic('flask')}${esc(t('sample'))}</span>`;
    if (kind === 'j2') return `<a class="tag tag-j2" href="${IG}DZcruwoijk7/" target="_blank" rel="noopener">${esc(t('j2'))}</a>`;
    if (kind === 'src') return `<a class="tag tag-src" href="${src && src.startsWith('http') ? src : IG + src + '/'}" target="_blank" rel="noopener">${ic('check')}${esc(t('fromPost'))}${date ? ' · ' + esc(fmtDate(date, { noYear: false })) : ''}</a>`;
    if (kind === 'deck') return `<span class="tag tag-src">${ic('check')}${esc(S.lang === 'ar' ? 'من عرض كنان · الجبيهة 3' : 'From Kenan\'s Jubeiha 3 deck')}</span>`;
    if (kind === 'osm') return `<span class="tag tag-osm">${esc(t('osm'))}</span>`;
    return '';
  }

  /* ================= Illustrations (placeholders) ================= */
  function scene(kind) {
    const N = '#1B2C58', T = '#D1B295', D = '#0F1A38';
    const bg = `<defs><linearGradient id="g${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${N}"/><stop offset="1" stop-color="${D}"/></linearGradient></defs><rect width="100" height="100" fill="url(#g${kind})"/>`;
    let s = '';
    switch (kind) {
      case 'excavation':
        s = `<path d="M0 62h100v38H0z" fill="#3a3326"/><path d="M0 62h100v6H0z" fill="#5b4c35"/><path d="M18 62l8 18h40l8-18" fill="#241f17"/><path d="M60 40l14-12 10 6-12 12" stroke="${T}" stroke-width="3" fill="none"/><rect x="66" y="44" width="18" height="10" rx="2" fill="${T}"/><circle cx="70" cy="56" r="3" fill="#fff" opacity=".8"/><circle cx="80" cy="56" r="3" fill="#fff" opacity=".8"/>`; break;
      case 'structure':
        s = `${[20, 40, 60, 80].map(x => `<rect x="${x - 2}" y="22" width="4" height="62" fill="${T}" opacity=".9"/>`).join('')}${[22, 42, 62, 82].map(y => `<rect x="12" y="${y}" width="76" height="4" fill="#fff" opacity=".7"/>`).join('')}<path d="M88 22v-8" stroke="${T}" stroke-width="2"/>`; break;
      case 'walls':
        s = `${Array.from({ length: 7 }, (_, r) => Array.from({ length: 6 }, (_, c) => `<rect x="${(c * 18) - (r % 2 ? 9 : 0) + 4}" y="${r * 13 + 6}" width="16" height="11" rx="1" fill="${T}" opacity="${0.35 + ((r * 7 + c * 3) % 5) * 0.1}"/>`).join('')).join('')}`; break;
      case 'mep':
        s = `<path d="M10 20h40v30h30v30" stroke="#7FB3E6" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M10 34h26v40h50" stroke="#E68A7F" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M60 10v20h28" stroke="${T}" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/><circle cx="50" cy="50" r="4" fill="#fff"/><circle cx="36" cy="74" r="4" fill="#fff"/>`; break;
      case 'insulation':
        s = `${['#C9B8A2', '#9AA0A8', '#F2E7A6', '#B9BDC4', '#EDE7DC', T].map((c, i) => `<rect x="${12 + i * 13}" y="14" width="${i === 2 ? 11 : 12}" height="72" fill="${c}" opacity=".95"/>`).join('')}<path d="M10 92h80" stroke="#fff" stroke-width="1" opacity=".6"/>`; break;
      case 'finishing':
        s = `${Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 }, (_, c) => `<rect x="${8 + c * 29}" y="${8 + r * 22}" width="27" height="20" fill="#EDE7DC" opacity="${0.75 + ((r + c) % 2) * 0.15}"/>`).join('')).join('')}<path d="M66 52l14 14" stroke="${T}" stroke-width="3"/><text x="70" y="50" font-size="9" fill="${T}" font-family="Albert Sans,sans-serif" font-weight="700">45°</text>`; break;
      case 'bath':
        s = `<rect x="10" y="10" width="80" height="80" fill="#EDE7DC" opacity=".9"/>${Array.from({ length: 3 }, (_, r) => `<path d="M10 ${36 + r * 26}h80" stroke="#cfc6b8" stroke-width="1"/>`).join('')}<path d="M50 10v80" stroke="#cfc6b8"/><rect x="58" y="16" width="26" height="70" fill="none" stroke="#9fc3d9" stroke-width="2"/><path d="M71 24v8" stroke="#888" stroke-width="2"/><circle cx="71" cy="34" r="4" fill="#bbb"/><rect x="18" y="58" width="22" height="16" rx="6" fill="#fff"/>`; break;
      case 'handover':
        s = `<circle cx="38" cy="50" r="14" fill="none" stroke="${T}" stroke-width="5"/><path d="M52 50h34M76 50v10M84 50v7" stroke="${T}" stroke-width="5" stroke-linecap="round"/>`; break;
      case 'paint':
        s = `<rect x="18" y="20" width="44" height="16" rx="4" fill="${T}"/><path d="M62 28h10v18H40v12" stroke="#fff" stroke-width="3" fill="none"/><rect x="36" y="58" width="8" height="26" rx="2" fill="#fff"/><path d="M0 92h100" stroke="${T}" stroke-width="8" opacity=".4"/>`; break;
      case 'facade-front':
        s = `<rect x="18" y="16" width="64" height="76" fill="#D9D2C6"/>${[0, 1, 2, 3].map(f => `<rect x="18" y="${22 + f * 17}" width="64" height="3" fill="#B9AE9C"/>${[0, 1, 2].map(w => `<rect x="${24 + w * 20}" y="${27 + f * 17}" width="12" height="9" fill="#2b3a5f"/>`).join('')}`).join('')}<rect x="42" y="80" width="16" height="12" fill="#2b3a5f"/><path d="M0 92h100" stroke="${T}" stroke-width="2"/>`; break;
      case 'facade-side':
        s = `<path d="M30 16h46v76H30z" fill="#CFC7BA"/><path d="M14 22l16-6v76l-16-4z" fill="#A99F90"/>${[0, 1, 2, 3].map(f => `<rect x="36" y="${24 + f * 17}" width="34" height="8" rx="4" fill="#2b3a5f"/><path d="M34 ${33 + f * 17}h38" stroke="${T}" stroke-width="2"/>`).join('')}`; break;
      default:
        s = `<circle cx="50" cy="50" r="18" fill="none" stroke="${T}" stroke-width="3"/>`;
    }
    return `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bg}${s}</svg>`;
  }

  /* ================= Data ================= */
  const STAGES = [
    { id: 'exc', ar: 'الحفريات', en: 'Excavation', date: '2025-03', st: 'done' },
    { id: 'str', ar: 'الهيكل الإنشائي', en: 'Structure', date: '2025-07', st: 'done' },
    { id: 'wal', ar: 'الجدران والحجر', en: 'Walls & stone', date: '2025-11', st: 'done' },
    { id: 'mep', ar: 'التمديدات الصحية والكهربائية', en: 'Plumbing & electrical', date: '2026-02', st: 'done' },
    { id: 'ins', ar: 'العزل', en: 'Insulation', date: '2026-04', st: 'done' },
    { id: 'fin', ar: 'التشطيبات', en: 'Finishing', date: '2026-06', st: 'now' },
    { id: 'hnd', ar: 'التسليم', en: 'Handover', date: null, st: 'next' }
  ];
  const UPDATES = [
    { d: '2026-10-15', s: 'fin', type: 'video', kind: 'bath', ar: 'حمام الماستر: تركيب بلاط الجدران 60×120', en: 'Master bathroom: 60×120 wall tiles going up', tag: 'sample' },
    { d: '2026-10-12', s: 'fin', type: 'photo', kind: 'mep', ar: 'المطبخ: فحص نقاط الكهرباء وخط الغاز', en: 'Kitchen: power points and gas line checked', tag: 'sample' },
    { d: '2026-10-09', s: 'fin', type: 'video', kind: 'finishing', ar: 'زوايا 45°: كيف تُقص حواف البلاط', en: '45° corners: how the tile edges are cut', tag: 'sample' },
    { d: '2026-10-06', s: 'fin', type: 'photo', kind: 'facade-front', ar: 'اختبار إنارة الواجهة ليلاً', en: 'Facade lights tested at night', tag: 'sample' },
    { d: '2026-10-02', s: 'fin', type: 'photo', kind: 'walls', ar: 'الشقق الأرضية: تسوية الساحات الخارجية', en: 'Ground floors: outdoor yards levelled', tag: 'sample' },
    { d: '2026-09-27', s: 'fin', type: 'video', kind: 'finishing', ar: 'المشروع بمراحل التشطيبات النهائية', en: 'The project is in final finishing', tag: 'src', src: 'Ddyq5G1jHth' },
    { d: '2026-09-16', s: 'fin', type: 'photo', img: 'assets/facade-night-1.jpg', ar: 'الواجهة ليلاً', en: 'The facade at night', tag: 'src', src: 'DdXSbvmoxL7' },
    { d: '2026-09-15', s: 'fin', type: 'photo', img: 'assets/facade-night-2.jpg', ar: 'الواجهة واسم كنان على المدخل', en: 'Facade and the Kenan sign at the entrance', tag: 'src', src: 'DdUsVkMDXyN' },
    { d: '2026-04-20', s: 'ins', type: 'video', kind: 'insulation', ar: 'السطح: طبقتا بيتومين قبل لوح العزل الحراري', en: 'Roof: two bitumen layers before the thermal board', tag: 'sample' },
    { d: '2026-02-18', s: 'mep', type: 'video', kind: 'mep', ar: 'مواسير المياه: اختبار الضغط قبل التبليط', en: 'Water pipes: pressure test before tiling', tag: 'sample' },
    { d: '2025-11-10', s: 'wal', type: 'photo', kind: 'walls', ar: 'تركيب الحجر على الواجهة الشمالية', en: 'Stone cladding on the north face', tag: 'sample' },
    { d: '2025-07-05', s: 'str', type: 'photo', kind: 'structure', ar: 'صب عقدة الطابق الثالث', en: 'Third-floor slab cast', tag: 'sample' },
    { d: '2025-03-12', s: 'exc', type: 'photo', kind: 'excavation', ar: 'الحفريات والأساسات', en: 'Excavation and foundations', tag: 'sample' }
  ];

  const ROOMS = {
    master: { g: 'bedroom', ar: 'غرفة الماستر', en: 'Master bedroom', m2: 20, r: [10, 10, 120, 110] },
    masterBath: { g: 'bath', ar: 'حمام الماستر', en: 'Master bath', m2: 6, r: [130, 10, 60, 60] },
    sharedBath: { g: 'bath', ar: 'حمام مشترك', en: 'Shared bath', m2: 5, r: [130, 70, 60, 50] },
    bed2: { g: 'bedroom', ar: 'نوم 2', en: 'Bedroom 2', m2: 15, r: [190, 10, 100, 110] },
    bed3: { g: 'bedroom', ar: 'نوم 3', en: 'Bedroom 3', m2: 15, r: [290, 10, 100, 110] },
    salon: { g: 'living', ar: 'الضيوف', en: 'Guest room', m2: 24, r: [10, 150, 120, 140] },
    guestWC: { g: 'bath', ar: 'حمام ضيوف', en: 'Guest WC', m2: 3, r: [130, 150, 50, 60] },
    kitchen: { g: 'kitchen', ar: 'المطبخ', en: 'Kitchen', m2: 12, r: [180, 150, 80, 90] },
    laundry: { g: 'laundry', ar: 'غسيل', en: 'Laundry', m2: 5, r: [180, 240, 80, 50] },
    living: { g: 'living', ar: 'المعيشة', en: 'Living', m2: 22, r: [260, 150, 130, 100] },
    balcony: { g: 'balcony', ar: 'البرندة', en: 'Balcony', m2: 9, r: [260, 250, 130, 40] }
  };

  /* specs: g = room groups, sys = system tab, cat = material type, tag = sample|j2|src */
  const SPECS = [
    { id: 'floor-tiles', g: ['living', 'kitchen', 'bedroom'], sys: null, cat: 'tiles', tag: 'j2', video: 'tiles', photo: 'tiles',
      l: { ar: 'بلاط الأرضيات', en: 'Floor tiles' }, v: { ar: 'بورسلان بقياسات تصل إلى 120×120 سم', en: 'Porcelain, sizes up to 120×120 cm' }, std: { ar: 'سيراميك 60×60 سم', en: 'Ceramic 60×60 cm' } },
    { id: 'bath-tiles', g: ['bath'], cat: 'tiles', tag: 'sample', video: 'bath',
      l: { ar: 'بلاط الحمام (جدران وأرضية)', en: 'Bathroom tiles (walls and floor)' }, v: { ar: 'بورسلان 60×120 سم حتى السقف', en: 'Porcelain 60×120 cm up to the ceiling' }, std: { ar: 'سيراميك 30×60 حتى 2.4 م', en: 'Ceramic 30×60 up to 2.4 m' } },
    { id: 'corners', g: ['bath'], cat: 'tiles', tag: 'sample', video: 'finishing', miter: true,
      l: { ar: 'زوايا 45°', en: '45° corners' }, v: { ar: 'حواف البلاط مقصوصة بزاوية 45° وتلتقي بدون زاوية بلاستيك', en: 'Tile edges cut at 45° and joined with no plastic trim' }, std: { ar: 'زاوية بلاستيك أو ألمنيوم ظاهرة', en: 'Visible plastic or aluminium trim' } },
    { id: 'bath-wp', g: ['bath'], sys: 'walls', cat: 'insulation', tag: 'sample', video: 'insulation',
      l: { ar: 'عزل الحمام ضد الماء', en: 'Bathroom waterproofing' }, v: { ar: 'طبقتا عزل إسمنتي مرن · 20 سم على الجدران و1.8 م داخل الشاور · اختبار غمر 24 ساعة', en: 'Two coats of flexible cement membrane · 20 cm up the walls, 1.8 m in the shower · 24-hour flood test' }, std: { ar: 'طبقة واحدة على الأرضية فقط', en: 'One coat on the floor only' } },
    { id: 'mixers', g: ['bath', 'kitchen'], cat: 'sanitary', tag: 'j2',
      l: { ar: 'الخلاطات', en: 'Mixers' }, v: { ar: 'Grohe (ألماني)', en: 'Grohe (German)' }, std: { ar: 'خلاطات بدون علامة تجارية', en: 'Unbranded mixers' } },
    { id: 'wc', g: ['bath'], cat: 'sanitary', tag: 'sample',
      l: { ar: 'المراحيض', en: 'Toilets' }, v: { ar: 'معلّقة مع خزان مخفي في الجدار', en: 'Wall-hung with a concealed cistern' }, std: { ar: 'أرضية مع خزان ظاهر', en: 'Floor-standing with a visible cistern' } },
    { id: 'shower', g: ['bath'], cat: 'sanitary', tag: 'sample',
      l: { ar: 'الشاور', en: 'Shower' }, v: { ar: 'قاطع زجاج (شاور بوكس)', en: 'Glass shower screen' }, std: { ar: 'ستارة', en: 'Curtain' } },
    { id: 'k-circuits', g: ['kitchen'], sys: 'electrical', cat: 'electrical', tag: 'j2',
      l: { ar: 'قواطع المطبخ', en: 'Kitchen circuits' }, v: { ar: 'قاطعان مستقلان للمطبخ', en: 'Two separate breakers for the kitchen' }, std: { ar: 'قاطع واحد مشترك', en: 'One shared breaker' } },
    { id: 'k-gas', g: ['kitchen'], sys: 'pipes', cat: 'plumbing', tag: 'sample',
      l: { ar: 'تمديد الغاز', en: 'Gas line' }, v: { ar: 'خط غاز ثابت للمطبخ مع محبس', en: 'Fixed gas line to the kitchen with a shut-off valve' }, std: { ar: 'جرة غاز داخل المطبخ', en: 'Gas cylinder in the kitchen' } },
    { id: 'k-cab', g: ['kitchen'], cat: 'build', tag: 'sample',
      l: { ar: 'خزائن المطبخ', en: 'Kitchen cabinets' }, v: { ar: '[يؤكد كنان: مع خزائن أو بدون]', en: '[Kenan to confirm: with or without cabinets]' }, std: { ar: '—', en: '—' } },
    { id: 'ac', g: ['bedroom', 'living'], sys: 'heating', cat: 'heating', tag: 'j2',
      l: { ar: 'تأسيس التكييف', en: 'AC preparation' }, v: { ar: 'خط ماء وكهرباء وتمديد نحاس Muller لكل الغرف', en: 'Drain line, power and Muller copper piping to every room' }, std: { ar: 'تأسيس لغرفتين فقط', en: 'Prepared for two rooms only' } },
    { id: 'breakers', g: ['whole', 'bedroom'], sys: 'electrical', cat: 'electrical', tag: 'j2',
      l: { ar: 'القواطع', en: 'Breakers' }, v: { ar: 'Schneider · قاطع لكل غرفة ولكل مكيف · 19 قاطعاً في شقة الجبيهة 2', en: 'Schneider · one breaker per room and per AC · 19 breakers in a Jubeiha 2 flat' }, std: { ar: 'قاطع لكل مجموعة غرف', en: 'One breaker per group of rooms' } },
    { id: 'cables', g: ['whole'], sys: 'electrical', cat: 'electrical', tag: 'sample',
      l: { ar: 'مقطع الأسلاك', en: 'Cable size' }, v: { ar: '2.5 مم² للأباريز · 1.5 مم² للإنارة', en: '2.5 mm² for sockets · 1.5 mm² for lights' }, std: { ar: 'غير محدد', en: 'Not stated' } },
    { id: 'earth', g: ['whole'], sys: 'electrical', cat: 'electrical', tag: 'sample',
      l: { ar: 'التأريض', en: 'Earthing' }, v: { ar: 'خط تأريض لكل الأباريز', en: 'Earth line to every socket' }, std: { ar: 'غير محدد', en: 'Not stated' } },
    { id: 'pipes', g: ['whole', 'bath', 'kitchen', 'laundry'], sys: 'pipes', cat: 'plumbing', tag: 'sample', video: 'mep',
      l: { ar: 'مواسير المياه', en: 'Water pipes' }, v: { ar: 'PPR · 25 مم للصواعد و20 مم للفروع', en: 'PPR · 25 mm risers, 20 mm branches' }, std: { ar: 'PVC بدون اختبار ضغط مسجّل', en: 'PVC with no recorded pressure test' } },
    { id: 'pipes-origin', g: ['whole'], sys: 'pipes', cat: 'plumbing', tag: 'j2',
      l: { ar: 'مصدر التمديدات الصحية', en: 'Sanitary plumbing origin' }, v: { ar: 'تمديدات صحية إيطالية', en: 'Italian sanitary plumbing' }, std: { ar: 'غير محدد', en: 'Not stated' } },
    { id: 'p-test', g: ['whole', 'bath'], sys: 'pipes', cat: 'plumbing', tag: 'sample', video: 'mep',
      l: { ar: 'اختبار الضغط', en: 'Pressure test' }, v: { ar: '10 بار لمدة 24 ساعة قبل التبليط، مصوّر', en: '10 bar for 24 hours before tiling, on video' }, std: { ar: 'بدون اختبار موثق', en: 'No recorded test' } },
    { id: 'drain', g: ['bath', 'kitchen', 'laundry'], sys: 'pipes', cat: 'plumbing', tag: 'sample',
      l: { ar: 'الصرف', en: 'Drainage' }, v: { ar: 'uPVC · 110 مم للمراحيض · 50 مم للمغاسل', en: 'uPVC · 110 mm for toilets · 50 mm for basins' }, std: { ar: 'غير محدد', en: 'Not stated' } },
    { id: 'pumps', g: ['laundry', 'whole'], sys: 'pipes', cat: 'plumbing', tag: 'j2',
      l: { ar: 'مضخات المياه', en: 'Water pumps' }, v: { ar: 'Espa (إسباني) صامتة مع تشغيل أوتوماتيكي لكل الشقق', en: 'Espa (Spanish), silent, automatic, for every flat' }, std: { ar: 'مضخة مشتركة', en: 'One shared pump' } },
    { id: 'laundry-pt', g: ['laundry'], cat: 'plumbing', tag: 'sample',
      l: { ar: 'غرفة الغسيل', en: 'Laundry room' }, v: { ar: 'تأسيس غسالة ونشافة مع تصريف أرضي', en: 'Washer and dryer points with a floor drain' }, std: { ar: 'نقطة غسالة في الحمام', en: 'Washer point in a bathroom' } },
    { id: 'heating', g: ['living', 'bedroom', 'whole'], sys: 'heating', cat: 'heating', tag: 'j2',
      l: { ar: 'التدفئة', en: 'Heating' }, v: { ar: 'مركزية على الغاز · بويلرات ورديترات إيطالية Arca – Imperial', en: 'Central gas heating · Italian boilers and radiators, Arca – Imperial' }, std: { ar: 'بدون تدفئة مركزية', en: 'No central heating' } },
    { id: 'fireplace', g: ['living'], sys: 'heating', cat: 'heating', tag: 'j2',
      l: { ar: 'فاير بليس', en: 'Fireplace' }, v: { ar: 'تركي', en: 'Turkish' }, std: { ar: 'لا يوجد', en: 'None' } },
    { id: 'ceiling', g: ['living', 'bedroom'], cat: 'build', tag: 'j2',
      l: { ar: 'ارتفاع السقف', en: 'Ceiling height' }, v: { ar: 'حتى 2.9 م', en: 'Up to 2.9 m' }, std: { ar: '2.7 م', en: '2.7 m' } },
    { id: 'doors', g: ['bedroom', 'living'], sys: 'windows', cat: 'build', tag: 'j2',
      l: { ar: 'الأبواب الداخلية', en: 'Interior doors' }, v: { ar: 'تفصيل بارتفاع 2.4 م', en: 'Made to measure, 2.4 m high' }, std: { ar: '2.1 م جاهزة', en: '2.1 m, ready-made' } },
    { id: 'windows', g: ['bedroom', 'living', 'balcony', 'kitchen'], sys: 'windows', cat: 'windows', tag: 'j2',
      l: { ar: 'الشبابيك', en: 'Windows' }, v: { ar: 'ألمنيوم نظام 9000 مع زجاج مزدوج', en: 'Aluminium "system 9000" with double glass' }, std: { ar: 'زجاج مفرد', en: 'Single glass' } },
    { id: 'shutters', g: ['bedroom'], sys: 'windows', cat: 'windows', tag: 'sample',
      l: { ar: 'الأباجورات', en: 'Shutters' }, v: { ar: 'كهربائية', en: 'Electric' }, std: { ar: 'يدوية', en: 'Manual' } },
    { id: 'paint-type', g: ['whole', 'living', 'bedroom'], sys: 'paint', cat: 'paint', tag: 'sample',
      l: { ar: 'نوع الدهان', en: 'Paint type' }, v: { ar: 'دهان مائي (إملشن) · العلامة يؤكدها كنان', en: 'Water-based emulsion · brand: Kenan to confirm' }, std: { ar: 'غير محدد', en: 'Not stated' } },
    { id: 'paint-coats', g: ['whole'], sys: 'paint', cat: 'paint', tag: 'sample', video: 'paint',
      l: { ar: 'طبقات الدهان', en: 'Paint coats' }, v: { ar: 'معجون كامل + أساس + وجهان', en: 'Full filler + primer + two top coats' }, std: { ar: 'أساس + وجه واحد', en: 'Primer + one coat' } },
    { id: 'wall-ins', g: ['whole'], sys: 'walls', cat: 'insulation', tag: 'sample', video: 'insulation',
      l: { ar: 'عزل الجدران الخارجية', en: 'Outside wall insulation' }, v: { ar: 'حجر + خرسانة + بولسترين 5 سم + طوب + قصارة', en: 'Stone + concrete + 5 cm polystyrene + block + plaster' }, std: { ar: 'بدون طبقة عزل حراري', en: 'No thermal layer' } },
    { id: 'roof-ins', g: ['whole', 'balcony'], sys: 'walls', cat: 'insulation', tag: 'sample',
      l: { ar: 'عزل السطح', en: 'Roof insulation' }, v: { ar: 'خرسانة ميول + طبقتا بيتومين + لوح عزل حراري + بلاط', en: 'Sloped screed + two bitumen layers + thermal board + tiles' }, std: { ar: 'طبقة بيتومين واحدة', en: 'One bitumen layer' } },
    { id: 'balcony-slope', g: ['balcony'], cat: 'insulation', tag: 'sample',
      l: { ar: 'ميول البرندة', en: 'Balcony slope' }, v: { ar: 'ميول 1% نحو مصرف أرضي', en: '1% slope to a floor drain' }, std: { ar: 'بدون مصرف', en: 'No drain' } },
    { id: 'entrance', g: ['whole'], cat: 'build', tag: 'j2',
      l: { ar: 'مدخل العمارة', en: 'Building entrance' }, v: { ar: 'بوابة كهربائية Smart + Face ID', en: 'Electric gate, Smart + Face ID' }, std: { ar: 'باب عادي', en: 'Standard door' } },
    { id: 'garage', g: ['whole'], cat: 'build', tag: 'src', src: 'Ddyq5G1jHth', date: '2026-09-27',
      l: { ar: 'الكراجات', en: 'Garages' }, v: { ar: 'كراجات خاصة للشقق الأرضية · باقي الشقق يؤكدها كنان', en: 'Private garages for ground-floor flats · other flats: Kenan to confirm' }, std: { ar: 'موقف مشترك', en: 'Shared parking' } }
  ];

  const XSEC = {
    wall: [
      { c: '#C9B38F', w: 16, ar: 'حجر طبيعي', en: 'Natural stone', th: '5 cm', dar: 'الطبقة الخارجية. تحمي من المطر والشمس.', den: 'Outer layer. It takes the rain and sun.' },
      { c: '#8F959C', w: 22, ar: 'خرسانة ومونة ربط', en: 'Concrete backing', th: '10 cm', dar: 'تربط الحجر بالجدار.', den: 'It ties the stone to the wall.' },
      { c: '#F1E08E', w: 16, ar: 'بولسترين (عزل حراري)', en: 'Polystyrene (thermal)', th: '5 cm', dar: 'تقلل الحرارة في الصيف والبرد في الشتاء.', den: 'It keeps heat out in summer and in in winter.' },
      { c: '#B3B7BE', w: 26, ar: 'طوب إسمنتي', en: 'Concrete block', th: '10 cm', dar: 'الجدار الداخلي.', den: 'The inner wall.' },
      { c: '#ECE6DA', w: 8, ar: 'قصارة', en: 'Plaster', th: '2 cm', dar: 'سطح مستوٍ للدهان.', den: 'A flat surface for paint.' },
      { c: '#D1B295', w: 4, ar: 'معجون ودهان', en: 'Filler and paint', th: '3 coats', dar: 'معجون + أساس + وجهان.', den: 'Filler + primer + two coats.' }
    ],
    roof: [
      { c: '#8F959C', w: 24, ar: 'عقدة خرسانية', en: 'Concrete slab', th: '25 cm', dar: 'سقف الطابق الأخير.', den: 'The top-floor ceiling.' },
      { c: '#A9A196', w: 14, ar: 'خرسانة ميول', en: 'Sloped screed', th: '5–10 cm', dar: 'تأخذ الماء إلى المصارف.', den: 'It takes water to the drains.' },
      { c: '#2E2E33', w: 8, ar: 'بيتومين – طبقتان', en: 'Bitumen – two layers', th: '2 × 4 mm', dar: 'عزل الماء. الطبقات متعامدة.', den: 'Water barrier. Layers cross each other.' },
      { c: '#9CC3E4', w: 14, ar: 'لوح عزل حراري', en: 'Thermal board', th: '5 cm', dar: 'عزل الحرارة فوق عزل الماء.', den: 'Heat barrier on top of the water barrier.' },
      { c: '#C7BEB0', w: 10, ar: 'مونة', en: 'Mortar bed', th: '3 cm', dar: 'قاعدة للبلاط.', den: 'A base for the tiles.' },
      { c: '#D1B295', w: 8, ar: 'بلاط السطح', en: 'Roof tiles', th: '2 cm', dar: 'سطح يمكن المشي عليه.', den: 'A surface you can walk on.' }
    ]
  };

  const UNITS = [
    { f: 'G', code: 'G-A', type: 'a230', area: 230, beds: 4, masters: 2, st: 'sd', view: { ar: 'شارعان · غربي', en: 'Two streets · west' }, gar: 2, out: { ar: 'ساحات وحديقة · المساحة تُحدَّد', en: 'Yards and garden · size to confirm' }, ground: true },
    { f: 'G', code: 'G-B', type: 'a188', area: 188, beds: 3, masters: 1, st: 'av', view: { ar: 'شرقي', en: 'East' }, gar: 1, out: { ar: 'ساحات وحديقة · المساحة تُحدَّد', en: 'Yards and garden · size to confirm' }, ground: true },
    { f: '1', code: '1-A', type: 'a230', area: 230, beds: 4, masters: 2, st: 'rs', view: { ar: 'غربي', en: 'West' }, gar: 1, out: null },
    { f: '1', code: '1-B', type: 'a188', area: 188, beds: 3, masters: 1, st: 'av', view: { ar: 'شرقي', en: 'East' }, gar: 1, out: null },
    { f: '2', code: '2-A', type: 'a230', area: 230, beds: 4, masters: 2, st: 'av', view: { ar: 'غربي · مطل', en: 'West · open view' }, gar: 1, out: null },
    { f: '2', code: '2-B', type: 'a188', area: 188, beds: 3, masters: 1, st: 'sd', view: { ar: 'شرقي', en: 'East' }, gar: 1, out: null },
    { f: 'R', code: 'R-A', type: 'dup', area: 270, beds: 4, masters: 2, st: 'av', view: { ar: 'غربي · مطل', en: 'West · open view' }, gar: 2, out: { ar: 'روف وتراسات · المساحة تُحدَّد', en: 'Roof and terraces · size to confirm' } },
    { f: 'R', code: 'R-B', type: 'dup', area: 230, beds: 4, masters: 2, st: 'rs', view: { ar: 'شرقي', en: 'East' }, gar: 2, out: { ar: 'روف وتراسات · المساحة تُحدَّد', en: 'Roof and terraces · size to confirm' } }
  ];

  const DECKPLANS = [
    { id: 'g', ar: 'الطابق الأرضي', en: 'Ground floor', img: '../img/plan-ground.jpg' },
    { id: 'gl', ar: 'الأرضي · الشقة اليسرى', en: 'Ground · left apartment', img: '../img/plan-ground-left.jpg' },
    { id: 'gr', ar: 'الأرضي · الشقة اليمنى', en: 'Ground · right apartment', img: '../img/plan-ground-right.jpg' },
    { id: 'b', ar: 'التسوية', en: 'Basement', img: '../img/plan-basement.jpg' },
    { id: 't', ar: 'الطابق المتكرر', en: 'Typical floor', img: '../img/plan-typical.jpg' },
    { id: 'l', ar: 'الطابق الأخير', en: 'Last floor', img: '../img/plan-last.jpg' },
    { id: 'r', ar: 'الروف', en: 'Roof', img: '../img/plan-roof.jpg' }
  ];
  function renderDeckPlans() {
    const el = $('#deckPlans'); if (!el) return;
    const i = Math.max(0, DECKPLANS.findIndex(x => x.id === S.dplan)), p = DECKPLANS[i];
    el.innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:10px"><b>${esc(S.lang === 'ar' ? 'المخططات حسب الطابق' : 'Plans by floor')}</b>${tag('deck')}</div>
      <div class="chips" role="group">${DECKPLANS.map(x => `<button type="button" class="chip" data-dplan="${x.id}" aria-pressed="${x.id === p.id}">${esc(L(x))}</button>`).join('')}</div>
      <button type="button" data-open="dplan" style="display:block;width:100%;margin-top:10px;background:#fff;border:1px solid var(--border);border-radius:12px;padding:6px;cursor:zoom-in" aria-label="${esc(L(p))}"><img src="${p.img}" alt="${esc(L(p))}" loading="lazy" style="width:100%;height:auto;display:block"></button>
      <p class="small muted" style="margin:8px 0 0">${esc(S.lang === 'ar' ? 'المخطط من عرض كنان. في الصفحة الحقيقية: تضغط على شقة فتظهر مساحتها وكل غرفة بأبعادها.' : 'The plan is from Kenan\'s deck. On the live page: tap an apartment to see its area and each room with its size.')}</p>`;
  }

  const STORIES = [
    { id: 's1', kind: 'finishing', ar: 'التشطيب', en: 'Finishing', frames: [{ k: 'finishing', ar: 'تشطيب الطابق الثاني', en: 'Second floor finishing' }, { k: 'bath', ar: 'حمام الماستر', en: 'Master bathroom' }, { k: 'paint', ar: 'الوجه الثاني من الدهان', en: 'Second paint coat' }] },
    { id: 's2', kind: 'bath', ar: 'الحمام', en: 'Bathroom', frames: [{ k: 'bath', ar: 'بلاط 60×120 حتى السقف', en: '60×120 tiles to the ceiling' }, { k: 'finishing', ar: 'زوايا 45°', en: '45° corners' }] },
    { id: 's3', kind: 'insulation', ar: 'العزل', en: 'Insulation', frames: [{ k: 'insulation', ar: 'طبقات الجدار الخارجي', en: 'Outside wall layers' }, { k: 'insulation', ar: 'اختبار غمر الحمام', en: 'Bathroom flood test' }] },
    { id: 's4', kind: 'tiles', img: 'assets/tiles-video.jpg', ar: 'بلاط 120', en: '120 tiles', frames: [{ img: 'assets/tiles-video.jpg', ar: 'بلاط حتى 120×120 سم · من فيديو كنان (الجبيهة 2)', en: 'Tiles up to 120×120 cm · from Kenan\'s video (Jubeiha 2)', src: 'DQCWqOOCFw1' }] },
    { id: 's5', kind: 'facade', img: 'assets/facade-night-1.jpg', ar: 'الواجهة', en: 'Facade', frames: [{ img: 'assets/facade-night-1.jpg', ar: 'الواجهة ليلاً · 16 أيلول', en: 'Facade at night · 16 Sep', src: 'DdXSbvmoxL7' }, { img: 'assets/facade-night-2.jpg', ar: 'المدخل · 15 أيلول', en: 'Entrance · 15 Sep', src: 'DdUsVkMDXyN' }] },
    { id: 's6', kind: 'mep', ar: 'المواسير', en: 'Pipes', frames: [{ k: 'mep', ar: 'اختبار الضغط 10 بار', en: '10 bar pressure test' }] }
  ];
  const REELS = [
    { d: '2026-10-15', s: 'fin', kind: 'bath', dur: '0:42', ar: 'حمام الماستر: بلاط 60×120', en: 'Master bath: 60×120 tiles', tag: 'sample' },
    { d: '2026-10-11', s: 'fin', kind: 'finishing', dur: '0:35', ar: 'زوايا 45° من قريب', en: '45° corners up close', tag: 'sample' },
    { d: '2026-10-08', s: 'mep', kind: 'mep', dur: '0:50', ar: 'اختبار ضغط المواسير', en: 'Pipe pressure test', tag: 'sample' },
    { d: '2026-10-04', s: 'fin', kind: 'facade-front', dur: '0:28', ar: 'الواجهة الأمامية نهاراً', en: 'Front facade by day', tag: 'sample' },
    { d: '2026-09-27', s: 'fin', kind: 'finishing', dur: '—', ar: 'المشروع بمراحل التشطيبات النهائية', en: 'The project in final finishing', tag: 'src', src: 'Ddyq5G1jHth' },
    { d: '2025-10-20', s: 'fin', img: 'assets/tiles-video.jpg', dur: '—', ar: 'بلاط حتى 120×120 سم · الجبيهة 2', en: 'Tiles up to 120×120 cm · Jubeiha 2', tag: 'src', src: 'DQCWqOOCFw1' }
  ];

  const NEAR = [
    { c: 'road', en: 'Jawhar Al-Siqelli Street', ar: 'شارع جوهر الصقلي', m: 97, x: 528, y: 476, osm: 'way/150834536' },
    { c: 'health', en: 'Dawakom Pharmacy', ar: 'صيدلية دواكم', m: 240, x: 582, y: 546, osm: 'node/5202975222' },
    { c: 'road', en: 'Abu Nuseir Street', ar: 'شارع أبو نصير', m: 333, x: 380, y: 454, osm: 'way/51215358' },
    { c: 'road', en: 'Princess Basmah Roundabout', ar: 'دوار الأميرة بسمة', m: 389, x: 412, y: 379, osm: 'way/150834559' },
    { c: 'school', en: 'Yasmeen Kindergarten', ar: 'روضة ظل الياسمين', m: 560, x: 286, y: 478, osm: 'node/13955322778' },
    { c: 'road', en: 'Yajouz Street', ar: 'شارع ياجوز', m: 624, x: 583, y: 725, osm: 'way/684469029' },
    { c: 'supermarket', en: 'Janet razan Supermarket', ar: 'Janet razan Supermarket', m: 650, x: 660, y: 692, osm: 'node/2003462938' },
    { c: 'mosque', en: 'Mosque (no name on the map)', ar: 'مسجد (بلا اسم على الخريطة)', m: 680, x: 252, y: 422, osm: 'way/685455199' },
    { c: 'supermarket', en: 'Safeway (Jubaiha)', ar: 'سيفوي (الجبيهة)', m: 970, x: 225, y: 753, osm: 'node/1927937403' },
    { c: 'health', en: 'Bab Al Hadid Pharmacy', ar: 'Bab Al Hadid Pharmacy', m: 990, x: 666, y: 843, osm: 'node/6497751858' },
    { c: 'mosque', en: 'Al Haaj Atillawi Mosque', ar: 'مسجد الحاج التلاوي', m: 990, x: 696, y: 826, osm: 'way/691798474' },
    { c: 'mosque', en: 'Al-Jubaiha Mosque', ar: 'مسجد الجبيهة', m: 1040, x: 402, y: 887, osm: 'way/298925981' },
    { c: 'road', en: 'Al-Urdon Street (Jordan Street)', ar: 'شارع الأردن', m: 1110, x: 723, y: 135, osm: 'way/137280877' },
    { c: 'mall', en: 'Panorama Mall', ar: 'Panorama Mall', m: 1450, x: 621, y: 1046, osm: 'way/653141853' },
    { c: 'school', en: 'Princess Sumaya University for Technology', ar: 'جامعة الأميرة سمية للتكنولوجيا', m: 1530, x: 838, y: 983, osm: 'way/992427232' },
    { c: 'health', en: 'Alesraa Hospital', ar: 'مستشفى الإسراء', m: 1940, x: 440, y: 1243, osm: 'way/274372357' },
    { c: 'school', en: 'University of Jordan', ar: 'الجامعة الأردنية', m: 2380, x: 696, y: 1393, osm: 'way/179944869' },
    { c: 'health', en: 'Abu Nuseir Health Center', ar: 'Abu Nuseir Health Center', m: 2450, x: 1024, y: -284, osm: 'node/1927951368' },
    { c: 'school', en: 'Al Sarh School', ar: 'مدرسة الصرح', m: 2520, x: 653, y: -455, osm: 'way/182451886' }
  ];
  const NCOL = { supermarket: '#2F7A4D', school: '#4A4F9C', mosque: '#1F6B5C', health: '#B4413A', road: '#6B5A45', mall: '#8C4A9C' };
  const NICON = { supermarket: 'cart', school: 'school', mosque: 'mosque', health: 'health', road: 'road', mall: 'mall' };

  const FACADES = [
    { id: 'front', ar: 'أمامية · رندر', en: 'Front · render', kind: 'facade-front', img: '../img/facade-front.jpg', deck: true },
    { id: 'side', ar: 'الزاوية · رندر', en: 'Corner · render', kind: 'facade-side', img: '../img/facade-corner.jpg', deck: true },
    { id: 'garden', ar: 'الحديقة الأرضية · رندر', en: 'Ground garden · render', kind: 'facade-side', img: '../img/ground-garden.jpg', deck: true },
    { id: 'night1', ar: 'ليلية', en: 'Night', img: 'assets/facade-night-1.jpg', src: 'DdXSbvmoxL7', d: '2026-09-16' },
    { id: 'night2', ar: 'ليلية · المدخل', en: 'Night · entrance', img: 'assets/facade-night-2.jpg', src: 'DdUsVkMDXyN', d: '2026-09-15' }
  ];

  const FAQ = [
    { q: { ar: 'هل يُسجَّل عقد البيع في دائرة الأراضي؟', en: 'Is the sale contract registered at the Lands Department?' },
      a: [{ ar: 'قانون الملكية العقارية رقم 13 لسنة 2019 (المادة 128): عقد الوعد ببيع شقة يصبح ملزماً عند تسجيله في دائرة الأراضي والمساحة.', en: 'Real Estate Ownership Law No. 13 of 2019 (Art. 128): a promise to sell an apartment binds both sides once it is registered at the Department of Lands and Survey.', tag: 'law' },
        { ar: 'طريقة كنان في التسجيل: [يؤكد كنان]', en: 'Kenan\'s registration step: [Kenan to confirm]', tag: 'sample' }] },
    { q: { ar: 'هل البناية مرهونة لبنك؟', en: 'Is the building mortgaged to a bank?' },
      a: [{ ar: '[يجيب كنان]. يمكن للمشتري طلب كشف سند التسجيل من دائرة الأراضي قبل الدفع.', en: '[Kenan to answer]. A buyer can ask the Lands Department for a title-deed check before paying.', tag: 'sample' }] },
    { q: { ar: 'ما نوع العزل الحراري والمائي؟', en: 'What thermal and water insulation is used?' },
      a: [{ ar: 'افتح «داخل الجدران» ثم «الجدران والعزل» لترى الطبقات طبقة طبقة.', en: 'Open "Inside the walls", then "Walls & insulation", to see each layer.', tag: 'sample', go: 'walls' }] },
    { q: { ar: 'ما الكفالات على البلاط والمواسير والشبابيك والمصعد؟', en: 'What warranties cover tiles, pipes, windows and the elevator?' },
      a: [{ ar: '[يؤكد كنان مدة الكفالة لكل بند].', en: '[Kenan to confirm the warranty period for each item].', tag: 'sample' }] },
    { q: { ar: 'كم كراج لكل شقة؟', en: 'How many garages per flat?' },
      a: [{ ar: 'الشقق الأرضية لها كراجات خاصة.', en: 'Ground-floor flats have private garages.', tag: 'src', src: 'Ddyq5G1jHth', d: '2026-09-27' },
        { ar: 'باقي الشقق: [يؤكد كنان]. في الجبيهة 2 كان لكل شقة كراجان.', en: 'Other flats: [Kenan to confirm]. In Jubeiha 2 each flat had two garages.', tag: 'sample' }] },
    { q: { ar: 'هل يوجد مستودع خاص؟', en: 'Is there a private storage room?' },
      a: [{ ar: '[يؤكد كنان]. في الجبيهة 2 كان لكل شقة مستودع خاص.', en: '[Kenan to confirm]. In Jubeiha 2 each flat had a private storage room.', tag: 'sample' }] },
    { q: { ar: 'ما نظام التدفئة والتكييف؟', en: 'What heating and cooling is installed?' },
      a: [{ ar: 'في الجبيهة 2: تدفئة مركزية على الغاز وتأسيس مكيفات لكل الغرف. للجبيهة 3: [يؤكد كنان].', en: 'In Jubeiha 2: central gas heating and AC preparation in every room. For Jubeiha 3: [Kenan to confirm].', tag: 'j2' }] },
    { q: { ar: 'كيف تصل المياه، وهل يوجد خزانات ومضخات؟', en: 'How is water stored? Are there tanks and pumps?' },
      a: [{ ar: 'في الجبيهة 2: مضخات Espa صامتة مع تشغيل أوتوماتيكي. للجبيهة 3 وسعة الخزانات: [يؤكد كنان].', en: 'In Jubeiha 2: silent Espa pumps with automatic control. For Jubeiha 3 and tank size: [Kenan to confirm].', tag: 'j2' }] },
    { q: { ar: 'متى التسليم؟', en: 'When is handover?' },
      a: [{ ar: 'المشروع بمراحل التشطيبات النهائية.', en: 'The project is in final finishing.', tag: 'src', src: 'Ddyq5G1jHth', d: '2026-09-27' },
        { ar: 'موعد التسليم: [يؤكد كنان].', en: 'Handover date: [Kenan to confirm].', tag: 'sample' }] },
    { q: { ar: 'ما السعر، وهل يوجد تقسيط؟', en: 'What is the price? Is there a payment plan?' },
      a: [{ ar: 'الأسعار غير منشورة. اسأل على واتساب.', en: 'Prices are not published. Ask on WhatsApp.', tag: 'sample' }] },
    { q: { ar: 'هل أستطيع اختيار البلاط أو تعديل التقسيم الداخلي؟', en: 'Can I choose tiles or change the layout?' },
      a: [{ ar: '[يؤكد كنان].', en: '[Kenan to confirm].', tag: 'sample' }] }
  ];

  /* owner (sample) */
  const SCHED = [
    { id: 'p1', d: '2026-10-18', type: { ar: 'ستوري × 3', en: 'Story × 3' }, topic: { ar: 'بلاط حمام الماستر من قريب', en: 'Master bath tiles up close' }, st: 'scheduled' },
    { id: 'p2', d: '2026-10-19', type: { ar: 'ريل', en: 'Reel' }, topic: { ar: 'زوايا 45°: كيف تُقص', en: '45° corners: how they are cut' }, st: 'needs' },
    { id: 'p3', d: '2026-10-21', type: { ar: 'ستوري × 2', en: 'Story × 2' }, topic: { ar: 'نتيجة اختبار ضغط المواسير', en: 'Pipe pressure test result' }, st: 'wait' },
    { id: 'p4', d: '2026-10-22', type: { ar: 'ريل', en: 'Reel' }, topic: { ar: 'جولة في شقة 188 م²', en: 'Walk-through of a 188 m² flat' }, st: 'needs' },
    { id: 'p5', d: '2026-10-24', type: { ar: 'منشور', en: 'Post' }, topic: { ar: 'ما حول المشروع: صيدلية 240 م، سوبرماركت 650 م', en: 'Nearby: pharmacy 240 m, supermarket 650 m' }, st: 'scheduled' }
  ];
  const HEAT = [
    { ar: 'الحمام وزوايا 45°', en: 'Bathroom and 45° corners', n: 412 },
    { ar: 'طبقات العزل', en: 'Insulation layers', n: 356 },
    { ar: 'الوحدات', en: 'Units', n: 298 },
    { ar: 'الموقع وما حوله', en: 'Location and nearby', n: 251 },
    { ar: 'المواسير', en: 'Pipes', n: 140 },
    { ar: 'الدهان', en: 'Paint', n: 88 },
    { ar: 'الأسئلة', en: 'Questions', n: 77 }
  ];
  const LEADS = [
    { who: { ar: 'م. خ.', en: 'M. K.' }, what: { ar: 'سأل عن 230 م² في الطابق الثاني', en: 'Asked about 230 m², second floor' }, via: 'WhatsApp', when: { ar: 'قبل ساعتين', en: '2 h ago' }, st: 'new' },
    { who: { ar: 'ر. ع.', en: 'R. A.' }, what: { ar: 'حجز زيارة السبت 11:00', en: 'Booked a visit, Sat 11:00' }, via: { ar: 'الرابط', en: 'Link' }, when: { ar: 'اليوم', en: 'Today' }, st: 'booked' },
    { who: { ar: 'ل. س.', en: 'L. S.' }, what: { ar: 'سأل عن السعر وخطة الدفع', en: 'Asked about price and payment plan' }, via: 'WhatsApp', when: { ar: 'أمس', en: 'Yesterday' }, st: 'replied' }
  ];
  const FILES = [
    { id: 'f1', name: { ar: 'مواصفات بلاط الحمام (PDF)', en: 'Bathroom tiles spec (PDF)' }, path: 'Kenan/Jubeiha 3/Specs/bath-tiles.pdf', st: 'up', d: '2026-10-16' },
    { id: 'f2', name: { ar: 'فيديو العزل', en: 'Insulation video' }, path: 'Kenan/Jubeiha 3/Videos/', st: 'wait' },
    { id: 'f3', name: { ar: 'فيديو اختبار ضغط المواسير', en: 'Pipe pressure test video' }, path: 'Kenan/Jubeiha 3/Videos/pressure-test.mp4', st: 'in', d: '2026-10-17' },
    { id: 'f4', name: { ar: 'صورة الواجهة الأمامية نهاراً', en: 'Front facade photo, daytime' }, path: 'Kenan/Jubeiha 3/Facades/', st: 'wait' },
    { id: 'f5', name: { ar: 'مخططات الوحدات (PDF)', en: 'Unit plans (PDF)' }, path: 'Kenan/Jubeiha 3/Plans/units.pdf', st: 'up', d: '2026-10-14' },
    { id: 'f6', name: { ar: 'قائمة الأسعار (المالك يقرر النشر)', en: 'Price list (owner decides if it shows)' }, path: 'Kenan/Jubeiha 3/Sales/', st: 'wait' }
  ];
  const PKGS = [
    { price: 400, stories: '10', videos: '10', split: true },
    { price: 700, stories: null, videos: null },
    { price: 1000, stories: null, videos: null },
    { price: 2000, stories: '30', videos: null }
  ];

  /* ================= Render: buyer ================= */
  function renderBuyer() {
    const navIds = ['progress', 'walls', 'materials', 'units', 'videos', 'location', 'facades', 'faq'];
    $('#buyer').innerHTML = `
      <section class="card hero" aria-labelledby="projName">
        <div class="hero-media">
          <img src="assets/facade-night-1.jpg" alt="${esc(t('heroPhoto'))}" width="900" height="1125" fetchpriority="high">
          <div class="hero-photo-src">${tag('src', 'DdXSbvmoxL7', '2026-09-16')}</div>
          <div class="hero-cap"><h1 id="projName">${esc(t('projName'))}</h1><p>${esc(t('projArea'))}</p></div>
        </div>
        <div class="hero-body">
          <div class="status-row"><span class="status-chip"><i></i>${esc(t('status'))}</span>${tag('src', 'Ddyq5G1jHth', '2026-09-27')}</div>
          <div class="facts">
            <div class="fact"><b class="num">${esc(t('f1'))}</b><span>${esc(t('f1s'))}</span></div>
            <div class="fact"><b class="num">${esc(t('f2'))}</b><span>${esc(t('f2s'))}</span></div>
            <div class="fact"><b class="num">${esc(t('f3'))}</b><span>${esc(t('f3s'))}</span></div>
            <div class="fact"><b>${esc(t('f4'))}</b><span>${esc(t('f4s'))}</span></div>
          </div>
          <div class="progress">
            <div class="progress-top"><span><b>${esc(t('progress'))}</b> <span class="num" id="pctTxt">86%</span></span>${tag('sample')}</div>
            <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="86" aria-label="${esc(t('progress'))}"><i id="pctBar"></i></div>
          </div>
          <div class="cta-row">
            <button class="btn btn-wa" type="button" data-act="wa">${ic('wa')}${esc(t('wa'))}</button>
            <button class="btn btn-primary" type="button" data-act="visit">${ic('cal')}${esc(t('visit'))}</button>
            <button class="btn" type="button" data-act="share">${ic('share')}${esc(t('share'))}</button>
          </div>
          <div class="legend" style="margin-top:12px"><span>${esc(t('legend'))}</span>${tag('sample')}<span>${esc(t('legSample'))}</span>${tag('j2')}<span>${esc(t('legJ2'))}</span></div>
        </div>
      </section>

      <nav class="secnav" aria-label="Sections"><div class="chips" id="secChips">
        ${navIds.map(id => `<a class="chip" href="#${id}" data-nav="${id}">${esc(t('nav.' + id))}</a>`).join('')}
      </div></nav>

      <section class="section" id="progress" aria-labelledby="h-progress">
        <div class="section-h"><h2 id="h-progress">${esc(t('progressH'))}</h2><span class="sub">${esc(t('progressSub'))}</span></div>
        <div class="card pad">
          <div class="stages" id="stages" role="group"></div>
          <div class="cadence"><span class="pulse"></span><span>${esc(t('cadence'))}</span><span>·</span><span>${esc(t('nextUpd'))}</span>${tag('sample')}</div>
          <div class="feed" id="feed"></div>
        </div>
      </section>

      <section class="section" id="walls" aria-labelledby="h-walls">
        <div class="section-h"><h2 id="h-walls">${esc(t('wallsH'))}</h2><span class="sub">${esc(t('wallsSub'))}</span></div>
        <div class="walls-grid">
          <div class="card plan-wrap">
            <div class="plan-head"><b>${esc(t('planTitle'))}</b>${tag('sample')}</div>
            ${planSVG()}
            <div class="plan-hint">${ic('pointer', 'width="16" height="16"')}<span>${esc(t('tapRoom'))} · ${esc(t('planNote'))}</span></div>
          </div>
          <div class="card pad room-specs" id="roomSpecs" aria-live="polite"></div>
        </div>
        <div class="systems">
          <div class="section-h" style="margin-top:18px"><h2 style="font-size:17px">${esc(t('systemsH'))}</h2></div>
          <div class="chips" id="sysChips" role="tablist"></div>
          <div class="card" style="margin-top:10px" id="sysBody"></div>
        </div>
      </section>

      <section class="section" id="materials" aria-labelledby="h-mat">
        <div class="section-h"><h2 id="h-mat">${esc(t('matH'))}</h2><span class="sub">${esc(t('matSub'))}</span></div>
        <div class="filters">
          <div class="chips" id="matRooms" aria-label="${esc(t('roomF'))}"></div>
          <div class="chips" id="matCats" aria-label="${esc(t('catF'))}"></div>
          <label class="switch"><input type="checkbox" id="cmpToggle" ${S.compare ? 'checked' : ''}><span class="track"></span><span>${esc(t('compare'))}</span>${tag('sample')}</label>
        </div>
        <div class="mat-list" id="matList"></div>
      </section>

      <section class="section" id="units" aria-labelledby="h-units">
        <div class="section-h"><h2 id="h-units">${esc(t('unitsH'))}</h2><span class="sub">${esc(t('unitsSub'))}</span></div>
        <div class="utypes" id="utypes"></div>
        <div class="units-grid">
          <div class="card building" id="building"></div>
          <div class="card udetail" id="udetail" aria-live="polite"></div>
        </div>
        <div class="card pad" id="deckPlans" style="margin-top:10px"></div>
      </section>

      <section class="section" id="videos" aria-labelledby="h-videos">
        <div class="section-h"><h2 id="h-videos">${esc(t('videosH'))}</h2><span class="sub">${esc(t('videosSub'))}</span></div>
        <div class="stories" id="stories"></div>
        <div class="reels" id="reels"></div>
      </section>

      <section class="section" id="location" aria-labelledby="h-loc">
        <div class="section-h"><h2 id="h-loc">${esc(t('locH'))}</h2><span class="sub">${esc(t('locSub'))}</span></div>
        <div class="chips" id="nearChips" style="margin-bottom:10px"></div>
        <div class="loc-grid">
          <div class="card map-card"><div class="map-wrap" id="mapWrap"></div></div>
          <div class="card" style="margin-top:10px" id="nearCard"><div class="near-list" id="nearList"></div>
            <div class="pad small muted" style="border-top:1px solid var(--border)">${esc(t('osmNote'))} <a href="${MAPS_J3}" target="_blank" rel="noopener">${esc(t('directions'))}</a></div></div>
        </div>
      </section>

      <section class="section" id="facades" aria-labelledby="h-fac">
        <div class="section-h"><h2 id="h-fac">${esc(t('facH'))}</h2><span class="sub">${esc(t('facSub'))}</span></div>
        <div class="fac-grid" id="facGrid"></div>
      </section>

      <section class="section" id="faq" aria-labelledby="h-faq">
        <div class="section-h"><h2 id="h-faq">${esc(t('faqH'))}</h2><span class="sub">${esc(t('faqSub'))}</span></div>
        <input class="faq-search" id="faqSearch" type="search" placeholder="${esc(t('faqSearch'))}" aria-label="${esc(t('faqSearch'))}" value="${esc(S.faqQ)}">
        <div class="faq" id="faqList"></div>
      </section>`;
    renderStages(); renderFeed(); renderRoom(); renderSys(); renderMat(); renderUnits(); renderDeckPlans(); renderVideos(); renderMap(); renderFacades(); renderFaq();
    requestAnimationFrame(() => { const b = $('#pctBar'); if (b) b.style.width = '86%'; });
    setupSpy();
  }

  function renderStages() {
    const el = $('#stages'); if (!el) return;
    el.innerHTML = `<button type="button" class="stage done" data-stage="all" aria-pressed="${S.stage === 'all'}" style="flex-basis:64px"><span class="dot">${ic('check')}</span><b>${esc(t('all'))}</b><small>&nbsp;</small></button>` +
      STAGES.map(s => `<button type="button" class="stage ${s.st}" data-stage="${s.id}" aria-pressed="${S.stage === s.id}">
        <span class="dot">${s.st === 'done' ? ic('check') : (s.st === 'now' ? ic('clock') : '')}</span>
        <b>${esc(L(s))}</b><small>${s.st === 'now' ? esc(t('stageNow')) : (s.date ? esc(fmtDate(s.date)) : esc(t('toConfirm')))}</small></button>`).join('');
  }

  function renderFeed() {
    const el = $('#feed'); if (!el) return;
    if (!S.loaded) { el.innerHTML = Array.from({ length: 3 }, () => `<div class="skel" style="height:112px"></div>`).join(''); return; }
    const list = UPDATES.filter(u => S.stage === 'all' || u.s === S.stage);
    if (!list.length) { el.innerHTML = `<div class="empty">${ic('camera')}${esc(t('noUpdates'))}</div>`; return; }
    el.innerHTML = list.map((u, i) => {
      const st = STAGES.find(s => s.id === u.s);
      const media = u.img ? `<img src="${u.img}" alt="" loading="lazy">` : scene(u.kind);
      return `<article class="card upd">
        <button type="button" class="upd-media" data-open="upd" data-i="${UPDATES.indexOf(u)}" aria-label="${esc(L(u))}">${media}${u.type === 'video' ? `<span class="play"><span>${ic('play')}</span></span>` : ''}</button>
        <div><div class="meta"><b class="num" style="color:var(--text)">${esc(fmtDate(u.d))}</b><span>·</span><span>${esc(L(st))}</span><span>·</span><span>${esc(u.type === 'video' ? t('video') : t('photo'))}</span></div>
        <h3>${esc(L(u))}</h3>
        <div class="row">${u.tag === 'src' ? tag('src', u.src, u.d) : tag('sample')}</div></div>
      </article>`;
    }).join('');
  }

  function planSVG() {
    const rooms = Object.entries(ROOMS).map(([id, r]) => {
      const [x, y, w, h] = r.r; const cx = x + w / 2, cy = y + h / 2;
      return `<g class="room${S.room === id ? ' sel' : ''}" data-room="${id}" role="button" tabindex="0" aria-label="${esc(L(r))}" aria-pressed="${S.room === id}">
        <rect x="${x}" y="${y}" width="${w}" height="${h}"/>
        <text x="${cx}" y="${cy - 2}" text-anchor="middle" class="${S.lang === 'ar' ? 'ar' : ''}"${w <= 60 ? ' style="font-size:8.5px"' : ''}>${esc(L(r))}</text>
        <text x="${cx}" y="${cy + 10}" text-anchor="middle" class="m2">${r.m2} m²</text></g>`;
    }).join('');
    return `<svg class="plan-svg" viewBox="0 0 400 300" role="group" aria-label="${esc(t('planTitle'))}">
      <g class="static"><rect x="130" y="120" width="260" height="30"/><rect x="130" y="210" width="50" height="80"/>
      <text x="155" y="254" text-anchor="middle">${S.lang === 'ar' ? 'مدخل' : 'Entry'}</text></g>
      ${rooms}<rect class="wall-outer" x="10" y="10" width="380" height="280"/></svg>`;
  }
  function miterSVG() {
    return `<svg class="miter" viewBox="0 0 120 64" aria-hidden="true" style="direction:ltr">
      <path d="M8 56V20h20v16h0Z" fill="#E9E2D6" stroke="#8C6A43"/><path d="M28 20 8 20 8 8h20Z" fill="#E9E2D6" stroke="#8C6A43"/><path d="M8 8l20 12" stroke="#2F7A4D" stroke-width="2"/>
      <text x="32" y="16" font-size="9" fill="#2F7A4D" font-family="Albert Sans,sans-serif" font-weight="700">45°</text>
      <path d="M70 56V20h20v36Z" fill="#E9E2D6" stroke="#8C6A43"/><path d="M70 8h20v10H70Z" fill="#E9E2D6" stroke="#8C6A43"/><rect x="66" y="16" width="28" height="6" rx="3" fill="#C9C9CF" stroke="#999"/>
      <text x="98" y="22" font-size="8" fill="#A23B33" font-family="Albert Sans,sans-serif">PVC</text></svg>`;
  }
  function specCard(sp) {
    const photo = sp.photo === 'tiles'
      ? `<div class="photo-slot filled"><img src="assets/tiles-video.jpg" alt="" loading="lazy"><span>${esc(t('photoFrom'))}</span></div>`
      : `<div class="photo-slot">${ic('camera')}<span>${esc(t('photoSlot'))}</span></div>`;
    const tg = sp.tag === 'src' ? tag('src', sp.src, sp.date) : tag(sp.tag);
    return `<div class="spec">
      <div class="spec-top"><div class="grow"><div class="lbl">${esc(L(sp.l))}</div><div class="val">${esc(L(sp.v))}</div></div>${sp.miter ? miterSVG() : ''}</div>
      <div class="spec-foot">${tg}${sp.video ? `<button type="button" class="vchip" data-open="spec" data-id="${sp.id}">${ic('video')}${esc(t('inVideo'))}</button>` : ''}${sp.miter ? `<span class="small muted">${esc(t('miter'))}</span>` : ''}</div>
      ${photo}</div>`;
  }
  function renderRoom() {
    const el = $('#roomSpecs'); if (!el) return;
    const r = ROOMS[S.room]; const list = SPECS.filter(s => s.g.includes(r.g));
    el.innerHTML = `<h3>${esc(L(r))}</h3><div class="small muted">${esc(t('rooms.' + r.g))} · <span class="num">${r.m2} m²</span> ${tag('sample')}</div>
      <div class="spec-list">${list.map(specCard).join('')}</div>`;
    $$('.plan-svg .room').forEach(g => { const on = g.dataset.room === S.room; g.classList.toggle('sel', on); g.setAttribute('aria-pressed', on); });
  }
  function renderSys() {
    const chips = $('#sysChips'); if (!chips) return;
    const keys = Object.keys(STR.ar.sys);
    chips.innerHTML = keys.map(k => `<button type="button" class="chip" role="tab" data-sys="${k}" aria-pressed="${S.sys === k}" aria-selected="${S.sys === k}">${esc(t('sys.' + k))}</button>`).join('');
    const body = $('#sysBody');
    const list = SPECS.filter(s => s.sys === S.sys);
    let xs = '';
    if (S.sys === 'walls') xs = xsecHTML();
    body.innerHTML = `${xs}<div class="pad"><div class="spec-list" style="margin-top:0">${list.map(specCard).join('')}</div></div>`;
    if (S.sys === 'walls') updateXsec();
  }
  function xsecHTML() {
    const layers = XSEC[S.xsec];
    const isWall = S.xsec === 'wall';
    let svg;
    if (isWall) {
      let x = 20; const parts = layers.map((ly, i) => { const r = `<g class="xsec-layer" data-l="${i}"><rect x="${x}" y="20" width="${ly.w * 3}" height="170" fill="${ly.c}" stroke="rgba(0,0,0,.25)"/>${i === 2 ? Array.from({ length: 9 }, (_, k) => `<circle cx="${x + 8 + (k % 3) * 16}" cy="${40 + Math.floor(k / 3) * 50}" r="4" fill="#fff" opacity=".6"/>`).join('') : ''}${i === 3 ? `<rect x="${x + 12}" y="40" width="${ly.w * 3 - 24}" height="40" fill="rgba(0,0,0,.12)"/><rect x="${x + 12}" y="110" width="${ly.w * 3 - 24}" height="40" fill="rgba(0,0,0,.12)"/>` : ''}</g>`; x += ly.w * 3; return r; });
      svg = `<svg class="xsec-svg" viewBox="0 0 340 210" role="img" aria-label="${esc(t('xWall'))}">
        <rect x="0" y="0" width="20" height="210" fill="#9CC3E4" opacity=".35"/>${parts.join('')}
        <rect x="${x}" y="0" width="${340 - x}" height="210" fill="#F6F1E8" opacity=".5"/>
        <text x="4" y="204" font-size="10" fill="currentColor" font-family="Albert Sans,sans-serif">☀</text></svg>
        <div class="xsec-side"><span>← ${esc(t('outside'))}</span><span>${esc(t('inside'))} →</span></div>`;
    } else {
      let y = 190; const parts = layers.map((ly, i) => { const h = ly.w * 1.6; y -= h; const r = `<g class="xsec-layer" data-l="${i}"><rect x="20" y="${y}" width="300" height="${h}" fill="${ly.c}" stroke="rgba(0,0,0,.25)"/>${i === 1 ? `<path d="M20 ${y} L320 ${y + 6}" stroke="rgba(0,0,0,.3)"/>` : ''}</g>`; return r; });
      svg = `<svg class="xsec-svg" viewBox="0 0 340 210" role="img" aria-label="${esc(t('xRoof'))}">${parts.join('')}
        <path d="M60 ${y - 10}l-6 -10M100 ${y - 10}l-6 -10M140 ${y - 10}l-6 -10" stroke="#5B8DB8" stroke-width="2"/></svg>
        <div class="xsec-side"><span>${esc(t('bottom'))} ↓</span><span>↑ ${esc(t('top'))}</span></div>`;
    }
    return `<div class="xsec">
      <div class="row" style="justify-content:space-between;margin-bottom:8px">
        <div class="seg" role="group"><button type="button" data-xsec="wall" aria-pressed="${isWall}">${esc(t('xWall'))}</button><button type="button" data-xsec="roof" aria-pressed="${!isWall}">${esc(t('xRoof'))}</button></div>
        ${tag('sample')}</div>
      ${svg}
      <div class="scrub"><button type="button" class="iconbtn" id="xPlay" aria-label="${esc(t('play'))}">${ic(S.playing ? 'pause' : 'play')}</button>
        <input type="range" id="xRange" min="1" max="${layers.length}" step="1" value="${Math.min(S.xv, layers.length)}" aria-label="${esc(t('scrub'))}"></div>
      <div class="small muted" style="margin-top:4px">${esc(t('scrub'))}</div>
      <ol class="layer-list" id="layerList">${layers.map((ly, i) => `<li data-l="${i}"><i style="background:${ly.c}"></i><span><b>${esc(L(ly))}</b> — ${esc(S.lang === 'ar' ? ly.dar : ly.den)}</span><span class="num">${esc(ly.th)}</span></li>`).join('')}</ol>
    </div>`;
  }
  function updateXsec() {
    const v = S.xv;
    $$('.xsec-layer').forEach(g => { const i = +g.dataset.l; g.classList.toggle('off', i >= v); g.classList.toggle('cur', i === v - 1); });
    $$('#layerList li').forEach(li => { const i = +li.dataset.l; li.classList.toggle('on', i < v); li.classList.toggle('cur', i === v - 1); });
    const r = $('#xRange'); if (r && +r.value !== v) r.value = v;
  }
  function togglePlay() {
    if (S.playing) { clearInterval(S.playing); S.playing = null; }
    else {
      const max = XSEC[S.xsec].length; S.xv = 1; updateXsec();
      S.playing = setInterval(() => { S.xv += 1; if (S.xv > max) { S.xv = max; clearInterval(S.playing); S.playing = null; setPlayIcon(); } updateXsec(); }, 900);
    }
    setPlayIcon();
  }
  function setPlayIcon() { const b = $('#xPlay'); if (b) { b.innerHTML = ic(S.playing ? 'pause' : 'play'); b.setAttribute('aria-label', t(S.playing ? 'pause' : 'play')); } }

  function renderMat() {
    const rooms = ['all', 'bath', 'kitchen', 'living', 'bedroom', 'laundry', 'balcony', 'whole'];
    const cats = ['all', 'tiles', 'sanitary', 'plumbing', 'electrical', 'insulation', 'windows', 'paint', 'heating', 'build'];
    const count = (r, c) => SPECS.filter(s => (r === 'all' || s.g.includes(r)) && (c === 'all' || s.cat === c)).length;
    $('#matRooms').innerHTML = rooms.map(r => `<button type="button" class="chip" data-mroom="${r}" aria-pressed="${S.matRoom === r}">${esc(t('rooms.' + r))}<span class="count">${count(r, S.matCat)}</span></button>`).join('');
    $('#matCats').innerHTML = cats.map(c => `<button type="button" class="chip" data-mcat="${c}" aria-pressed="${S.matCat === c}">${esc(t('cats.' + c))}<span class="count">${count(S.matRoom, c)}</span></button>`).join('');
    const list = SPECS.filter(s => (S.matRoom === 'all' || s.g.includes(S.matRoom)) && (S.matCat === 'all' || s.cat === S.matCat));
    const el = $('#matList'); el.classList.toggle('compare', S.compare);
    if (!list.length) { el.innerHTML = `<div class="card empty">${ic('search')}${esc(t('noMat'))}</div>`; return; }
    el.innerHTML = list.map(s => `<div class="card mat">
      <div class="mat-head"><div><div class="cat">${esc(t('cats.' + s.cat))}</div><b>${esc(L(s.l))}</b></div>${s.tag === 'src' ? tag('src', s.src, s.date) : tag(s.tag)}</div>
      <div class="val" data-k="${esc(t('thisProj'))}">${esc(L(s.v))}</div>
      <div class="std"><span>${esc(t('standard'))}</span><span>${esc(L(s.std))} ${tag('sample')}</span></div></div>`).join('');
  }

  function renderUnits() {
    const types = ['all', 'a188', 'a230', 'dup', 'ground'];
    const sub = { all: `${UNITS.length}`, a188: t('f1s'), a230: t('f2s'), dup: t('f3s'), ground: t('f4s') };
    $('#utypes').innerHTML = types.map(k => `<button type="button" class="utype" data-utype="${k}" aria-pressed="${S.utype === k}"><b>${esc(t('ut.' + k))}</b><span>${esc(sub[k])}</span></button>`).join('');
    const floors = [['R', t('floorTop')], ['2', `${t('floor')} 2`], ['1', `${t('floor')} 1`], ['G', t('floorG')]];
    const match = (u) => S.utype === 'all' || (S.utype === 'ground' ? u.ground : u.type === S.utype);
    $('#building').innerHTML = `<div class="row" style="justify-content:space-between;margin-bottom:10px"><b>${esc(S.lang === 'ar' ? 'اختر وحدة' : 'Pick a unit')}</b>${tag('sample')}</div>` +
      floors.map(([f, name]) => `<div class="bfloor"><div class="fl">${esc(name)}</div>${UNITS.filter(u => u.f === f).map(u => `<button type="button" class="unit ${u.st}${match(u) ? '' : ' dim'}" data-unit="${u.code}" aria-pressed="${S.unit === u.code}">
        <b>${u.code} · ${u.area} m²</b><span class="st ${u.st}">${esc(t(u.st))}</span></button>`).join('')}</div>`).join('') +
      `<div class="legend" style="margin-top:8px"><span class="st av">${esc(t('av'))}</span><span class="st rs">${esc(t('rs'))}</span><span class="st sd">${esc(t('sd'))}</span></div>`;
    const u = UNITS.find(x => x.code === S.unit);
    const d = $('#udetail');
    if (!u) { d.innerHTML = `<div class="empty">${ic('pointer')}${esc(t('pickUnit'))}</div>`; return; }
    const floorName = u.f === 'G' ? t('floorG') : (u.f === 'R' ? t('floorTop') : `${t('floor')} ${u.f}`);
    d.innerHTML = `<div class="row" style="justify-content:space-between"><h3 style="margin:0;font-size:18px" class="num">${u.code}</h3><span class="st ${u.st}">${esc(t(u.st))}</span></div>
      <dl>
        <div><dt>${esc(t('uArea'))}</dt><dd class="num">${u.area} m² ${u.type === 'dup' ? '· duplex' : ''}</dd></div>
        <div><dt>${esc(t('uBeds'))}</dt><dd>${u.beds} · ${u.masters} ${S.lang === 'ar' ? 'ماستر' : 'master'}</dd></div>
        <div><dt>${esc(t('uFloor'))}</dt><dd>${esc(floorName)}</dd></div>
        <div><dt>${esc(t('uView'))}</dt><dd>${esc(L(u.view))}</dd></div>
        <div><dt>${esc(t('uGarage'))}</dt><dd class="num">${u.gar}</dd></div>
        <div><dt>${esc(t('uOut'))}</dt><dd>${u.out ? esc(L(u.out)) : '—'}</dd></div>
      </dl>
      <div class="row" style="margin-bottom:10px">${tag('src', 'DdUsVkMDXyN', '2026-09-15')}<span class="small muted">${esc(S.lang === 'ar' ? 'المساحة وعدد الغرف' : 'Area and bedrooms')}</span>${tag('sample')}<span class="small muted">${esc(S.lang === 'ar' ? 'الطابق والإطلالة والكراج والحالة' : 'Floor, view, garage, status')}</span></div>
      <div class="row"><button type="button" class="btn btn-primary btn-s" data-act="visit" data-unitref="${u.code}" ${u.st === 'sd' ? 'disabled' : ''}>${ic('cal')}${esc(t('visitUnit'))}</button>
      <button type="button" class="btn btn-s" data-act="wa" data-unitref="${u.code}">${ic('wa')}${esc(t('askUnit'))}</button></div>`;
  }

  function renderVideos() {
    const st = $('#stories'), rl = $('#reels'); if (!st) return;
    st.innerHTML = STORIES.map((s, i) => `<button type="button" class="story${S.seenStories[s.id] ? ' seen' : ''}" data-story="${i}"><span class="ring"><span>${s.img ? `<img src="${s.img}" alt="" loading="lazy">` : scene(s.kind)}</span></span><em>${esc(L(s))}</em></button>`).join('');
    if (!S.loaded) { rl.innerHTML = Array.from({ length: 6 }, () => `<div class="skel" style="aspect-ratio:9/16"></div>`).join(''); return; }
    rl.innerHTML = REELS.map((r, i) => {
      const stg = STAGES.find(s => s.id === r.s);
      return `<button type="button" class="reel" data-reel="${i}" aria-label="${esc(L(r))}">${r.img ? `<img src="${r.img}" alt="" loading="lazy">` : scene(r.kind)}
        <div class="rtop">${r.tag === 'src' ? `<span class="tag tag-src">${ic('check')}${esc(t('fromPost'))}</span>` : tag('sample')}<span class="dur">${esc(r.dur)}</span></div>
        <div class="rbot"><b>${esc(L(r))}</b><span class="num">${esc(fmtDate(r.d))}</span> · <span>${esc(L(stg))}</span></div></button>`;
    }).join('');
  }

  function renderMap() {
    const cats = ['all', 'supermarket', 'school', 'mosque', 'health', 'road', 'mall'];
    $('#nearChips').innerHTML = cats.map(c => `<button type="button" class="chip" data-ncat="${c}" aria-pressed="${S.nearCat === c}">${c !== 'all' ? ic(NICON[c]) : ''}${esc(t('near.' + c))}<span class="count">${c === 'all' ? NEAR.length : NEAR.filter(n => n.c === c).length}</span></button>`).join('');
    const wrap = $('#mapWrap');
    const M = window.KENAN_MAP;
    if (!M || window.KENAN_MAP_ERR) { wrap.innerHTML = `<div class="empty" style="position:absolute;inset:0;display:grid;place-items:center">${ic('info')}${esc(t('mapErr'))}</div>`; }
    else {
      const R = M.roads;
      const clamp = (v) => Math.max(26, Math.min(974, v));
      const pins = NEAR.map((n, i) => {
        const off = n.x < 0 || n.x > 1000 || n.y < 0 || n.y > 1000;
        const x = clamp(n.x), y = clamp(n.y);
        return `<g class="pin" data-pin="${i}" transform="translate(${x} ${y})" role="button" tabindex="0" aria-label="${esc(L(n))}, ${dist(n.m)}">
          <circle class="halo" r="26" fill="${NCOL[n.c]}"/><circle class="b" r="${off ? 11 : 14}" fill="${NCOL[n.c]}" ${off ? 'stroke-dasharray="3 3"' : ''}/>
          <svg x="-9" y="-9" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${I[NICON[n.c]]}</svg></g>`;
      }).join('');
      const s = 1000 / (2 * M.ext_m);
      wrap.innerHTML = `<svg class="map-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(t('locH'))}">
        <path class="rl" d="${R.l}"/><path class="rr" d="${R.r}"/><path class="rs" d="${R.s}"/><path class="rp" d="${R.p}"/><path class="rt" d="${R.t}"/>
        <circle class="ring-m" cx="500" cy="500" r="${500 * s}"/><circle class="ring-m" cx="500" cy="500" r="${1000 * s}"/>
        <text class="ring-t" x="${500 + 500 * s * 0.71 + 4}" y="${500 - 500 * s * 0.71}">500 m</text><text class="ring-t" x="${500 + 1000 * s * 0.71 + 4}" y="${500 - 1000 * s * 0.71}">1 km</text>
        ${pins}
        <g transform="translate(500 500)" aria-label="${esc(t('project'))}"><circle r="34" fill="#1B2C58" opacity=".18"/><path d="M0 18 L-16 -6 A20 20 0 1 1 16 -6 Z" fill="#1B2C58" stroke="#D1B295" stroke-width="3"/><circle cy="-12" r="7" fill="#D1B295"/></g>
      </svg><div class="map-tip" id="mapTip" hidden></div><div class="map-attr">© OpenStreetMap contributors</div>`;
    }
    renderNearList(); applyNear();
  }
  function renderNearList() {
    const list = NEAR.map((n, i) => ({ n, i })).filter(({ n }) => S.nearCat === 'all' || n.c === S.nearCat);
    const el = $('#nearList');
    if (!list.length) { el.innerHTML = `<div class="empty">${ic('pin')}${esc(t('noNear'))}</div>`; return; }
    el.innerHTML = list.map(({ n, i }) => {
      const off = n.x < 0 || n.x > 1000 || n.y < 0 || n.y > 1000;
      return `<button type="button" class="near${S.nearHl === i ? ' hl' : ''}" data-near="${i}">
        <span class="ic" style="background:${NCOL[n.c]}">${ic(NICON[n.c])}</span>
        <span style="min-width:0"><b>${esc(L(n))}</b><span class="cat">${esc(t('near.' + n.c))}${off ? ' · ' + esc(t('offMap')) : ''}</span></span>
        <span class="d"><b>${esc(dist(n.m))}</b><br>${n.c === 'road' ? '' : `${ic('walk', 'width="12" height="12" style="display:inline;vertical-align:-1px"')} ${walkMin(n.m)} ${esc(t('min'))} · `}${ic('car', 'width="12" height="12" style="display:inline;vertical-align:-1px"')} ${driveMin(n.m)} ${esc(t('min'))}</span></button>`;
    }).join('');
  }
  function applyNear() {
    $$('.pin').forEach(p => { const n = NEAR[+p.dataset.pin]; p.classList.toggle('hide', !(S.nearCat === 'all' || n.c === S.nearCat)); p.classList.toggle('hl', S.nearHl === +p.dataset.pin); });
    const tip = $('#mapTip');
    if (tip) {
      if (S.nearHl == null) { tip.hidden = true; }
      else {
        const n = NEAR[S.nearHl]; const svg = $('.map-svg'); const wrap = $('#mapWrap');
        if (svg && wrap) {
          const bb = svg.getBoundingClientRect(); const wb = wrap.getBoundingClientRect();
          const scale = Math.max(bb.width, bb.height) / 1000; const ox = (bb.width - 1000 * scale) / 2, oy = (bb.height - 1000 * scale) / 2;
          const cx = Math.max(26, Math.min(974, n.x)), cy = Math.max(26, Math.min(974, n.y));
          let px = ox + cx * scale + (bb.left - wb.left), py = oy + cy * scale + (bb.top - wb.top);
          px = Math.max(80, Math.min(wb.width - 80, px)); py = Math.max(40, py);
          tip.style.left = px + 'px'; tip.style.top = py + 'px';
          tip.textContent = `${L(n)} · ${dist(n.m)}`; tip.hidden = false;
        }
      }
    }
    $$('.near').forEach(b => b.classList.toggle('hl', +b.dataset.near === S.nearHl));
  }

  function renderFacades() {
    const f = FACADES[S.fac];
    const main = f.img ? `<img src="${f.img}" alt="${esc(L(f))}">` : scene(f.kind);
    const cap = f.deck ? tag('deck') : f.img ? `<span class="tag tag-src">${ic('check')}${esc(t('fromPost'))} · ${esc(fmtDate(f.d))}</span>` : `<span class="tag tag-sample">${ic('camera')}${esc(t('facPh'))}</span>`;
    $('#facGrid').innerHTML = `<div><button type="button" class="fac-main" data-open="fac" aria-label="${esc(L(f))}">${main}<span class="cap">${cap}</span></button>
      <div class="fac-thumbs">${FACADES.map((x, i) => `<button type="button" data-fac="${i}" aria-pressed="${S.fac === i}" aria-label="${esc(L(x))}">${x.img ? `<img src="${x.img}" alt="" loading="lazy">` : scene(x.kind)}</button>`).join('')}</div></div>
      <div class="fac-side card pad"><b>${esc(L(f))}</b><p class="small muted" style="margin:6px 0 0">${f.deck ? esc(S.lang === 'ar' ? 'رندر من عرض الجبيهة 3 الذي أرسله كنان.' : 'A render from the Jubeiha 3 deck Kenan sent.') : f.img ? esc(S.lang === 'ar' ? 'صورة نشرها كنان على إنستغرام.' : 'Photo published by Kenan on Instagram.') : esc(t('facPh'))}</p>
      <div class="row" style="margin-top:10px">${FACADES.map((x, i) => `<button type="button" class="chip" data-fac="${i}" aria-pressed="${S.fac === i}">${esc(L(x))}</button>`).join('')}</div></div>`;
  }

  function renderFaq() {
    const q = S.faqQ.trim().toLowerCase();
    const list = FAQ.filter(f => !q || (L(f.q) + ' ' + f.a.map(L).join(' ')).toLowerCase().includes(q));
    const el = $('#faqList');
    if (!list.length) { el.innerHTML = `<div class="card empty">${ic('search')}${esc(t('noFaq'))}<div style="margin-top:10px"><button type="button" class="btn btn-wa btn-s" data-act="waq" data-q="${esc(S.faqQ)}">${ic('wa')}${esc(t('askWa'))}</button></div></div>`; return; }
    el.innerHTML = list.map(f => `<details><summary>${esc(L(f.q))}${ic('chev')}</summary><div class="ans">
      ${f.a.map(a => `<p>${esc(L(a))} ${a.tag === 'law' ? '' : (a.tag === 'src' ? tag('src', a.src, a.d) : tag(a.tag))}${a.go ? ` <a href="#${a.go}" data-goto="${a.go}">${esc(t('nav.walls'))}</a>` : ''}</p>`).join('')}
      <div><button type="button" class="btn btn-s" data-act="waq" data-q="${esc(L(f.q))}">${ic('wa')}${esc(t('askWa'))}</button></div></div></details>`).join('');
  }

  /* ================= Render: owner ================= */
  function renderOwner() {
    const visitsN = 6 + S.visits.length;
    const schedRow = (p) => {
      const st = S.approved[p.id] ? 'approved' : p.st;
      const badge = st === 'approved' ? `<span class="badge b-ok">${ic('check', 'width="11" height="11"')}${esc(t('approved'))}</span>` : st === 'scheduled' ? `<span class="badge b-ok">${esc(t('scheduled'))}</span>` : st === 'needs' ? `<span class="badge b-warn">${esc(t('needs'))}</span>` : `<span class="badge b-muted">${esc(t('waitFile'))}</span>`;
      const act = S.approved[p.id] ? `<button type="button" class="btn btn-s btn-ghost" data-unapprove="${p.id}">${ic('undo')}${esc(t('undo'))}</button>` : (p.st === 'needs' ? `<button type="button" class="btn btn-s btn-primary" data-approve="${p.id}">${ic('check')}${esc(t('approve'))}</button>` : '');
      return `<div class="orow"><div style="min-width:0"><div class="row"><span class="when num">${esc(fmtDate(p.d))}</span><span class="acct">@kenanhousing.jo</span><span class="small muted">${esc(L(p.type))}</span></div>
        <div class="ttl">${esc(L(p.topic))}</div><div class="row" style="margin-top:4px">${badge}</div></div><div>${act}</div></div>`;
    };
    const maxH = Math.max(...HEAT.map(h => h.n));
    const fileRow = (f) => {
      const st = S.uploaded[f.id] ? 'up' : f.st;
      const badge = st === 'up' ? `<span class="badge b-ok">${ic('check', 'width="11" height="11"')}${esc(t('fUp'))}</span>` : st === 'in' ? `<span class="badge b-warn">${esc(t('fIn'))}</span>` : `<span class="badge b-muted">${esc(t('fWait'))}</span>`;
      const act = S.uploaded[f.id] ? `<button type="button" class="btn btn-s btn-ghost" data-unupload="${f.id}">${ic('undo')}${esc(t('undo'))}</button>` : (f.st === 'in' ? `<button type="button" class="btn btn-s btn-primary" data-upload="${f.id}">${esc(t('fPush'))}</button>` : '');
      return `<div class="orow"><div style="min-width:0"><div class="ttl">${ic('file', 'width="14" height="14" style="display:inline;vertical-align:-2px"')} ${esc(L(f.name))}</div>
        <div class="path">${esc(f.path)}</div><div class="row" style="margin-top:4px">${badge}${f.d ? `<span class="small muted num">${esc(fmtDate(f.d))}</span>` : ''}</div></div><div>${act}</div></div>`;
    };
    const leads = S.visits.map(v => ({ who: { ar: v.name, en: v.name }, what: { ar: `زيارة ${v.dayLabel} ${v.time}${v.unit ? ' · ' + v.unit : ''}`, en: `Visit ${v.dayLabel} ${v.time}${v.unit ? ' · ' + v.unit : ''}` }, via: { ar: 'الرابط', en: 'Link' }, when: { ar: t('thisSession'), en: t('thisSession') }, st: 'booked' })).concat(LEADS);
    $('#owner').innerHTML = `
      <div class="section" style="margin-top:16px"><div class="section-h"><h2>${esc(t('ownerH'))}</h2>${tag('sample')}</div><p class="small muted" style="margin:-4px 0 12px">${esc(t('ownerSub'))}</p>
      <div class="kpis">
        <div class="card kpi"><span class="k">${esc(t('k1'))}</span><span class="v">5,183</span><span class="n">${esc(t('k1n'))}</span><span>${tag('src', IG_PROFILE, '2026-10-17')}</span></div>
        <div class="card kpi"><span class="k">${esc(t('k2'))}</span><span class="v">6</span><span class="n">${esc(t('k2n'))}</span><span>${tag('sample')}</span></div>
        <div class="card kpi"><span class="k">${esc(t('k3'))}</span><span class="v">2</span><span class="n">${esc(t('k3n'))}</span><span>${tag('sample')}</span></div>
        <div class="card kpi"><span class="k">${esc(t('k4'))}</span><span class="v">9</span><span class="n">${esc(t('k4n'))}</span><span>${tag('sample')}</span></div>
        <div class="card kpi"><span class="k">${esc(t('k5'))}</span><span class="v">23</span><span class="n">${esc(t('k5n'))}</span><span>${tag('sample')}</span></div>
        <div class="card kpi"><span class="k">${esc(t('k6'))}</span><span class="v" id="kVisits">${visitsN}</span><span class="n">${esc(t('k6n'))}</span><span>${tag('sample')}</span></div>
      </div></div>
      <div class="ogrid" style="margin-top:12px">
        <section class="card full"><div class="pad" style="border-bottom:1px solid var(--border)"><div class="section-h" style="margin:0"><h2 style="font-size:17px">${esc(t('schedH'))}</h2>${tag('sample')}</div><div class="small muted">${esc(t('schedSub'))}</div></div>
          <div class="olist">${SCHED.map(schedRow).join('')}</div></section>
        <section class="card"><div class="pad" style="border-bottom:1px solid var(--border)"><div class="section-h" style="margin:0"><h2 style="font-size:17px">${esc(t('heatH'))}</h2>${tag('sample')}</div><div class="small muted">${esc(t('heatSub'))}</div></div>
          <div class="heat">${HEAT.map(h => `<div class="heat-row"><div><span>${esc(L(h))}</span><div class="hb"><i style="width:${Math.round(h.n / maxH * 100)}%;opacity:${0.45 + 0.55 * h.n / maxH}"></i></div></div><span class="hv">${h.n}</span></div>`).join('')}</div></section>
        <section class="card"><div class="pad" style="border-bottom:1px solid var(--border)"><div class="section-h" style="margin:0"><h2 style="font-size:17px">${esc(t('leadsH'))}</h2>${tag('sample')}</div><div class="small muted">${esc(t('leadsSub'))}</div></div>
          <div class="olist">${leads.map(l => `<div class="orow"><div style="min-width:0"><div class="ttl">${esc(L(l.who))} · <span class="small muted">${esc(L(l.what))}</span></div>
            <div class="row small muted"><span>${esc(L(l.via))}</span><span>·</span><span>${esc(L(l.when))}</span></div></div>
            <span class="badge ${l.st === 'new' ? 'b-warn' : (l.st === 'booked' ? 'b-ok' : 'b-muted')}">${esc(t(l.st === 'new' ? 'newL' : l.st))}</span></div>`).join('')}</div></section>
        <section class="card files"><div class="pad" style="border-bottom:1px solid var(--border)"><div class="section-h" style="margin:0"><h2 style="font-size:17px">${esc(t('filesH'))}</h2>${tag('sample')}</div><div class="small muted">${esc(t('filesSub'))}</div></div>
          <div class="olist">${FILES.map(fileRow).join('')}</div></section>
      </div>`;
  }

  /* ================= Footer ================= */
  function renderFoot() {
    $('#foot').innerHTML = `<div class="foot-in">
      <div><b style="color:var(--text)">${esc(t('brand'))}</b> · ${esc(t('brandSub'))}</div>
      <div class="contact"><a class="btn btn-s" href="tel:+${PHONE}">${esc(t('footContact'))}: <span class="num" dir="ltr">${PHONE_LOCAL}</span></a>
        <button type="button" class="btn btn-s" data-act="wa">${ic('wa')}${esc(t('wa'))}</button>
        <a class="btn btn-s" href="${IG_PROFILE}" target="_blank" rel="noopener">@kenanhousing.jo</a>
        <a class="btn btn-s" href="${MAPS_J3}" target="_blank" rel="noopener">${ic('pin')}${esc(t('directions'))}</a></div>
      <div class="small">${esc(t('footNote'))}</div>
      <div class="small">${esc(t('footMap'))}</div>
      <div class="built"><img src="assets/marsh-mark.svg" alt="" width="16" height="20">${esc(t('footBuilt'))}</div></div>`;
  }

  /* ================= Sheets ================= */
  const sheet = () => $('#sheet');
  let lastFocus = null;
  function openSheet(html) {
    lastFocus = document.activeElement;
    const sh = sheet(); sh.innerHTML = `<div class="grab"></div>${html}`; sh.hidden = false;
    requestAnimationFrame(() => { sh.classList.add('open'); $('#scrim').classList.add('open'); const f = sh.querySelector('button, input, select, a'); if (f) f.focus(); });
  }
  function closeSheet() {
    const sh = sheet(); sh.classList.remove('open'); $('#scrim').classList.remove('open');
    setTimeout(() => { if (!sh.classList.contains('open')) { sh.hidden = true; sh.innerHTML = ''; } }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function waSheet(msg) {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
    openSheet(`<div class="sheet-h"><h3 id="sheetTitle">${esc(t('sheetWa'))}</h3><button type="button" class="iconbtn" data-close aria-label="${esc(t('close'))}">${ic('x')}</button></div>
      <div class="small muted">${esc(t('waHint'))} <span class="num" dir="ltr">+962 79 520 9296</span></div>
      <div class="wa-preview" id="waText">${esc(msg)}</div>
      <div class="row"><a class="btn btn-wa" id="waOpen" href="${url}" target="_blank" rel="noopener">${ic('wa')}${esc(t('openWa'))}</a><button type="button" class="btn" data-copymsg>${esc(t('copyMsg'))}</button></div>`);
  }
  function nextDays() {
    const out = []; const base = new Date(2026, 9, 18); // mockup "today" is 17 Oct 2026
    for (let i = 0; out.length < 6 && i < 10; i++) {
      const d = new Date(base); d.setDate(base.getDate() + i);
      if (d.getDay() === 5) continue; // Friday
      out.push({ iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, label: `${DAYS[S.lang][d.getDay()]} ${d.getDate()}` });
    }
    return out;
  }
  function visitSheet(unitRef) {
    const days = nextDays(); const times = ['10:00', '12:00', '16:00', '18:00'];
    openSheet(`<div class="sheet-h"><h3 id="sheetTitle">${esc(t('sheetVisit'))}</h3><button type="button" class="iconbtn" data-close aria-label="${esc(t('close'))}">${ic('x')}</button></div>
      <form id="visitForm" novalidate>
        <div class="field"><label for="vUnit">${esc(t('vUnit'))}</label><select id="vUnit"><option value="">${esc(t('anyUnit'))}</option>${UNITS.filter(u => u.st !== 'sd').map(u => `<option value="${u.code}" ${u.code === unitRef ? 'selected' : ''}>${u.code} · ${u.area} m²</option>`).join('')}</select></div>
        <div class="field"><label>${esc(t('vDay'))} ${tag('sample')}</label><div class="slots" id="vDays">${days.map(d => `<button type="button" class="chip" data-day="${d.iso}" data-label="${esc(d.label)}" aria-pressed="false">${esc(d.label)}</button>`).join('')}</div></div>
        <div class="field"><label>${esc(t('vTime'))}</label><div class="slots" id="vTimes">${times.map(x => `<button type="button" class="chip num" data-time="${x}" aria-pressed="false">${x}</button>`).join('')}</div><div class="err" id="eDay"></div></div>
        <div class="field"><label for="vName">${esc(t('vName'))}</label><input id="vName" autocomplete="name"><div class="err" id="eName"></div></div>
        <div class="field"><label for="vPhone">${esc(t('vPhone'))}</label><input id="vPhone" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="07XXXXXXXX"><div class="err" id="ePhone"></div></div>
        <button type="submit" class="btn btn-primary" style="width:100%">${ic('cal')}${esc(t('vSend'))}</button>
      </form>`);
  }
  function submitVisit(e) {
    e.preventDefault();
    const day = $('#vDays [aria-pressed="true"]'); const time = $('#vTimes [aria-pressed="true"]');
    const name = $('#vName').value.trim(); const phone = $('#vPhone').value.replace(/[\s-]/g, '').replace(/^\+962/, '0').replace(/^00962/, '0');
    let ok = true;
    $('#eDay').textContent = (day && time) ? '' : (ok = false, t('vDayErr'));
    $('#eName').textContent = name ? '' : (ok = false, t('vNameErr'));
    $('#ePhone').textContent = /^07[789]\d{7}$/.test(phone) ? '' : (ok = false, t('vPhoneErr'));
    if (!ok) { const first = $('.err:not(:empty)'); if (first) first.previousElementSibling && first.previousElementSibling.focus && first.previousElementSibling.focus(); return; }
    const v = { id: Date.now(), name, phone, unit: $('#vUnit').value, day: day.dataset.day, dayLabel: day.dataset.label, time: time.dataset.time };
    S.visits.unshift(v);
    sheet().innerHTML = `<div class="grab"></div><div class="done-box"><span class="ok">${ic('check')}</span><h3 id="sheetTitle" style="margin:0">${esc(t('vDone'))}</h3>
      <div class="small muted">${esc(v.dayLabel)} · <span class="num">${esc(v.time)}</span>${v.unit ? ' · ' + esc(v.unit) : ''}</div>
      <p class="small muted" style="margin:0">${esc(t('vDoneSub'))}</p>
      <div class="row" style="justify-content:center"><button type="button" class="btn" data-cancelvisit="${v.id}">${ic('undo')}${esc(t('vCancel'))}</button><button type="button" class="btn btn-primary" data-close>${esc(t('close'))}</button></div></div>`;
    if (S.view === 'owner') renderOwner();
  }

  /* ================= Viewer (stories, videos, photos) ================= */
  const V = { items: [], i: 0, timer: null, start: 0, dur: 4000, raf: null, onEnd: null };
  function openViewer(items, title, opts) {
    V.items = items; V.i = 0; V.onEnd = (opts && opts.onEnd) || null; V.auto = !!(opts && opts.auto);
    const v = $('#viewer'); lastFocus = document.activeElement;
    v.innerHTML = `<div class="viewer-bars">${items.map(() => '<i><b></b></i>').join('')}</div>
      <div class="viewer-head"><b>${esc(title)}</b><button type="button" class="iconbtn" data-vclose aria-label="${esc(t('close'))}">${ic('x')}</button></div>
      <div class="viewer-stage"><button type="button" class="viewer-tap prev" data-vprev aria-label="prev"></button><div class="frame" id="vFrame"></div><button type="button" class="viewer-tap next" data-vnext aria-label="next"></button></div>
      <div class="viewer-note" id="vNote"></div>`;
    v.classList.add('open'); document.body.style.overflow = 'hidden';
    showFrame(); const c = v.querySelector('[data-vclose]'); if (c) c.focus();
  }
  function showFrame() {
    const it = V.items[V.i]; const fr = $('#vFrame'); if (!fr || !it) return;
    fr.classList.toggle('wide', !!it.wide);
    fr.innerHTML = `${it.img ? `<img src="${it.img}" alt="">` : scene(it.k)}<div class="ftext"><span>${esc(L(it))}</span>${it.src ? tag('src', it.src, it.d) : it.deck ? tag('deck') : tag('sample')}${it.video ? `<span class="small" style="opacity:.85">${ic('play', 'width="12" height="12" style="display:inline"')} ${esc(S.lang === 'ar' ? 'معاينة فيديو' : 'Video preview')}</span>` : ''}</div>`;
    $('#vNote').textContent = it.note ? L(it.note) : '';
    $$('.viewer-bars b').forEach((b, j) => { b.style.width = j < V.i ? '100%' : '0'; });
    cancelAnimationFrame(V.raf);
    if (V.auto) {
      V.start = performance.now();
      const tick = (now) => { const p = Math.min(1, (now - V.start) / V.dur); const b = $$('.viewer-bars b')[V.i]; if (b) b.style.width = (p * 100) + '%'; if (p >= 1) { nextFrame(); } else V.raf = requestAnimationFrame(tick); };
      V.raf = requestAnimationFrame(tick);
    } else { const b = $$('.viewer-bars b')[V.i]; if (b) b.style.width = '100%'; }
  }
  function nextFrame() { if (V.i < V.items.length - 1) { V.i++; showFrame(); } else closeViewer(); }
  function prevFrame() { if (V.i > 0) { V.i--; showFrame(); } else showFrame(); }
  function closeViewer() {
    cancelAnimationFrame(V.raf); const v = $('#viewer'); v.classList.remove('open'); v.innerHTML = ''; document.body.style.overflow = '';
    if (V.onEnd) V.onEnd(); V.onEnd = null; if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ================= Toast ================= */
  let toastT = null;
  function toast(msg, undoFn) {
    const el = $('#toast'); el.innerHTML = `<span>${esc(msg)}</span>${undoFn ? `<button type="button" id="toastUndo">${esc(t('undo'))}</button>` : ''}`;
    el.classList.add('show'); clearTimeout(toastT);
    if (undoFn) $('#toastUndo').onclick = () => { undoFn(); el.classList.remove('show'); };
    toastT = setTimeout(() => el.classList.remove('show'), 4200);
  }

  /* ================= Section spy ================= */
  let spy = null;
  function setupSpy() {
    if (spy) spy.disconnect();
    if (!('IntersectionObserver' in window)) return;
    spy = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { $$('#secChips .chip').forEach(c => c.classList.toggle('on', c.dataset.nav === e.target.id)); const on = $(`#secChips [data-nav="${e.target.id}"]`); if (on) { const p = on.parentElement; const cr = on.getBoundingClientRect(), pr = p.getBoundingClientRect(); if (cr.left < pr.left || cr.right > pr.right) p.scrollBy({ left: (cr.left + cr.width / 2) - (pr.left + pr.width / 2), behavior: 'smooth' }); } } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('#buyer .section').forEach(s => spy.observe(s));
  }

  /* ================= Global apply ================= */
  function applyChrome() {
    const html = document.documentElement;
    html.lang = S.lang; html.dir = S.lang === 'ar' ? 'rtl' : 'ltr';
    if (S.theme) html.setAttribute('data-theme', S.theme); else html.removeAttribute('data-theme');
    $$('[data-t]').forEach(n => { n.textContent = t(n.dataset.t); });
    $('#langBtn').textContent = t('lang'); $('#langBtn').setAttribute('aria-label', S.lang === 'ar' ? 'English' : 'العربية');
    const dark = isDark();
    $('#themeBtn').innerHTML = ic(dark ? 'sun' : 'moon'); $('#themeBtn').setAttribute('aria-label', dark ? t('themeLight') : t('themeDark'));
    $$('#viewSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.view === S.view));
    $('#buyer').hidden = S.view !== 'buyer'; $('#owner').hidden = S.view !== 'owner';
    document.title = S.lang === 'ar' ? 'كنان · الجبيهة 3' : 'Kenan · Jubeiha 3';
  }
  const isDark = () => S.theme ? S.theme === 'dark' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  function setTopbarVar() { const tb = $('.topbar'); if (tb) document.documentElement.style.setProperty('--tbh', tb.offsetHeight + 'px'); }
  function renderAll() { applyChrome(); renderBuyer(); renderOwner(); renderFoot(); setTopbarVar(); }

  /* ================= Events ================= */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a, [data-room], [data-pin]'); if (!el) return;
    const d = el.dataset;
    if (el.id === 'langBtn') { S.lang = S.lang === 'ar' ? 'en' : 'ar'; store.set('lang', S.lang); renderAll(); return; }
    if (el.id === 'themeBtn') { S.theme = isDark() ? 'light' : 'dark'; store.set('theme', S.theme); applyChrome(); return; }
    if (d.view) { S.view = d.view; store.set('view', S.view); applyChrome(); window.scrollTo({ top: 0 }); return; }
    if (d.act === 'wa') { waSheet(t('waMsg')(d.unitref || '')); return; }
    if (d.act === 'waq') { waSheet(t('waQ')(d.q || '')); return; }
    if (d.act === 'visit') { visitSheet(d.unitref || ''); return; }
    if (d.act === 'share') { share(); return; }
    if (d.close !== undefined) { closeSheet(); return; }
    if (d.copymsg !== undefined) { copyText($('#waText').textContent).then(ok => toast(ok ? (S.lang === 'ar' ? 'تم نسخ الرسالة' : 'Message copied') : (S.lang === 'ar' ? 'لم يتم النسخ' : 'Copy failed'))); return; }
    if (d.cancelvisit) { const id = +d.cancelvisit; const v = S.visits.find(x => x.id === id); S.visits = S.visits.filter(x => x.id !== id); closeSheet(); renderOwner(); toast(t('cancelled'), () => { if (v) { S.visits.unshift(v); renderOwner(); } }); return; }
    if (d.day) { $$('#vDays .chip').forEach(c => c.setAttribute('aria-pressed', c === el)); return; }
    if (d.time) { $$('#vTimes .chip').forEach(c => c.setAttribute('aria-pressed', c === el)); return; }
    if (d.stage) { S.stage = d.stage; renderStages(); renderFeed(); return; }
    if (d.open === 'upd') { const u = UPDATES[+d.i]; openViewer([{ ar: u.ar, en: u.en, k: u.kind, img: u.img, src: u.tag === 'src' ? u.src : null, d: u.d, wide: !!u.img, video: u.type === 'video' }], fmtDate(u.d)); return; }
    if (d.open === 'spec') { const sp = SPECS.find(s => s.id === d.id); openViewer([{ ar: sp.l.ar + ' — ' + sp.v.ar, en: sp.l.en + ' — ' + sp.v.en, k: sp.video === 'tiles' ? 'finishing' : sp.video, img: sp.video === 'tiles' ? 'assets/tiles-video.jpg' : null, src: sp.video === 'tiles' ? 'DQCWqOOCFw1' : null, d: sp.video === 'tiles' ? '2025-10-20' : null, video: true }], t('inVideo')); return; }
    if (d.open === 'dplan') { const p = DECKPLANS.find(x => x.id === S.dplan) || DECKPLANS[0]; openViewer([{ ar: p.ar, en: p.en, img: p.img, deck: true, wide: true }], S.lang === 'ar' ? 'المخططات' : 'Plans'); return; }
    if (d.open === 'fac') { const f = FACADES[S.fac]; openViewer([{ ar: f.ar, en: f.en, k: f.kind, img: f.img, src: f.src, d: f.d, deck: f.deck, wide: true, note: f.img ? null : { ar: t('facPh'), en: t('facPh') } }], t('facH')); return; }
    if (d.sys) { S.sys = d.sys; if (S.playing) { clearInterval(S.playing); S.playing = null; } renderSys(); return; }
    if (d.xsec) { S.xsec = d.xsec; S.xv = XSEC[S.xsec].length; if (S.playing) { clearInterval(S.playing); S.playing = null; } renderSys(); return; }
    if (el.id === 'xPlay') { togglePlay(); return; }
    if (d.room) { S.room = d.room; renderRoom(); if (window.innerWidth < 980) { const rs = $('#roomSpecs'); if (rs) rs.scrollIntoView({ behavior: 'smooth', block: 'start' }); } return; }
    if (d.mroom) { S.matRoom = d.mroom; renderMat(); return; }
    if (d.mcat) { S.matCat = d.mcat; renderMat(); return; }
    if (d.utype) { S.utype = d.utype; renderUnits(); return; }
    if (d.unit) { S.unit = d.unit; renderUnits(); return; }
    if (d.story) { const s = STORIES[+d.story]; openViewer(s.frames.map(f => ({ ar: f.ar, en: f.en, k: f.k, img: f.img, src: f.src })), L(s), { auto: true, onEnd: () => { S.seenStories[s.id] = true; renderVideos(); } }); return; }
    if (d.reel) { const r = REELS[+d.reel]; openViewer([{ ar: r.ar, en: r.en, k: r.kind, img: r.img, src: r.tag === 'src' ? r.src : null, d: r.d, video: true, note: r.tag === 'src' ? null : { ar: 'معاينة: الفيديو الحقيقي يُرفع من ملفات المالك.', en: 'Preview: the real video comes from the owner\'s files.' } }], fmtDate(r.d)); return; }
    if (d.ncat) { S.nearCat = d.ncat; S.nearHl = null; $$('#nearChips .chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.ncat === S.nearCat)); renderNearList(); applyNear(); return; }
    if (d.near) { const i = +d.near; S.nearHl = S.nearHl === i ? null : i; applyNear(); const mw = $('#mapWrap'); if (mw && window.innerWidth < 980 && S.nearHl != null) mw.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (d.pin !== undefined && el.classList.contains('pin')) { const i = +d.pin; S.nearHl = S.nearHl === i ? null : i; applyNear(); const row = $(`.near[data-near="${i}"]`); if (row && S.nearHl != null) row.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return; }
    if (d.fac) { S.fac = +d.fac; renderFacades(); return; }
    if (d.dplan) { S.dplan = d.dplan; renderDeckPlans(); return; }
    if (d.goto) { e.preventDefault(); S.sys = 'walls'; renderSys(); const s = $('#sysChips'); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (d.approve) { S.approved[d.approve] = true; renderOwner(); toast(t('approved'), () => { delete S.approved[d.approve]; renderOwner(); }); return; }
    if (d.unapprove) { delete S.approved[d.unapprove]; renderOwner(); return; }
    if (d.upload) { S.uploaded[d.upload] = true; renderOwner(); toast(t('fUp'), () => { delete S.uploaded[d.upload]; renderOwner(); }); return; }
    if (d.unupload) { delete S.uploaded[d.unupload]; renderOwner(); return; }
    if (d.pkg) { S.pkg = +d.pkg; $$('.pk').forEach(p => p.setAttribute('aria-pressed', +p.dataset.pkg === S.pkg)); return; }
    if (d.vclose !== undefined) { closeViewer(); return; }
    if (d.vnext !== undefined) { nextFrame(); return; }
    if (d.vprev !== undefined) { prevFrame(); return; }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if ($('#viewer').classList.contains('open')) closeViewer(); else if (sheet().classList.contains('open')) closeSheet(); }
    const g = e.target.closest && e.target.closest('[data-room], .pin');
    if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
    if ($('#viewer').classList.contains('open')) { if (e.key === 'ArrowLeft') (S.lang === 'ar' ? nextFrame : prevFrame)(); if (e.key === 'ArrowRight') (S.lang === 'ar' ? prevFrame : nextFrame)(); }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'xRange') { if (S.playing) { clearInterval(S.playing); S.playing = null; setPlayIcon(); } S.xv = +e.target.value; updateXsec(); }
    if (e.target.id === 'faqSearch') { S.faqQ = e.target.value; renderFaq(); }
  });
  document.addEventListener('change', (e) => { if (e.target.id === 'cmpToggle') { S.compare = e.target.checked; renderMat(); } });
  document.addEventListener('submit', (e) => { if (e.target.id === 'visitForm') submitVisit(e); });
  $('#scrim').addEventListener('click', closeSheet);
  window.addEventListener('resize', () => { setTopbarVar(); if (S.nearHl != null) applyNear(); });
  if (window.matchMedia) { const mq = window.matchMedia('(prefers-color-scheme: dark)'); const fn = () => { if (!S.theme) applyChrome(); }; mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener && mq.addListener(fn); }

  async function copyText(s) {
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(s); return true; } } catch (e) { /* fall through */ }
    try { const ta = document.createElement('textarea'); ta.value = s; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; } catch (e) { return false; }
  }
  async function share() {
    const url = window.location.href.split('#')[0];
    if (navigator.share) { try { await navigator.share({ title: document.title, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    const ok = await copyText(url);
    toast(ok ? t('copied') : t('copyFail') + url);
  }

  /* ================= Boot ================= */
  renderAll();
  setTimeout(() => { S.loaded = true; renderFeed(); renderVideos(); }, 450);
})();
