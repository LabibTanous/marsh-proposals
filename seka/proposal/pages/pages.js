/* Pages view — "The pages": what each Instagram page of Brands by SEKA (Irbid) should look like,
   modelled on Independent Food Co. (Dubai) and its brand pages.
   index.html loads this file and calls window.PV.render(root, ctx) when "The pages" opens and on every
   language change. ctx = { lang, T, esc, rich }.
   Facts: research-pages/SEKA.md and INDEPENDENT.md (18 Oct 2026). Photos: the client's own posts, in pages/img/
   (built from research-pages/refs-seka; nothing from Independent's accounts is used). */
(function () {
  'use strict';

  const VER = '2026-10-18c';
  const SCRIPT = document.currentScript && document.currentScript.src;
  const BASE = SCRIPT ? new URL('./', SCRIPT).href : new URL('pages/', location.href).href;
  const IMG = (n) => BASE + 'img/' + n;
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let CTX = null, LANG = 'ar', ROOT = null, RENDERED = false;
  const tx = (p) => (Array.isArray(p) ? p[LANG === 'ar' ? 0 : 1] : p);
  const esc = (s) => (CTX ? CTX.esc(s) : String(s ?? ''));
  const R = (s) => (CTX ? CTX.rich(s) : esc(s));
  const AR = () => LANG === 'ar';

  /* ---------- state (module + localStorage mm2-pv-*) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('mm2-pv-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mm2-pv-' + k, JSON.stringify(v)); } catch (e) { /* storage blocked: the state stays in memory */ } },
  };
  const ST = { acct: store.get('acct', 'group'), mode: store.get('mode', 'today') === 'proposed' ? 'proposed' : 'today', open: null };

  /* ---------- icons ---------- */
  const ICON = {
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    menu: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    truck: '<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
    news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    ball: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5l4 2.9-1.5 4.6h-5L8 10.4z"/><path d="M12 3v4.5M16 10.4l4.3-1.4M14.5 15l2.6 3.8M9.5 15l-2.6 3.8M8 10.4 3.7 9"/>',
    fire: '<path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-1.5-2-1.5-3C7 10 6 12.5 6 15a6 6 0 0 0 6 6z"/>',
    film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.5v5l4.5-2.5z"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14c2.8-.3 5 1.4 5.5 4.5"/>',
    cup: '<path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M12 3v2"/>',
    chair: '<path d="M7 3h10v9H7zM5 12h14v3H5zM7 15v6M17 15v6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    name: '<path d="M4 20h16M6.5 16 12 4l5.5 12M8.6 11.5h6.8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
  };
  const ico = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n] || ''}</svg>`;
  const IG = {
    reel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm-3.1 6v9A3.1 3.1 0 0 0 7 20.1h10a3.1 3.1 0 0 0 3.1-3.1V8zM9.7 3.9l2 3h4.2l-2-3zm6.5 0 2 3h1.9A3.1 3.1 0 0 0 17 3.9zM7 3.9A3.1 3.1 0 0 0 3.9 6.9h5.6l-2-3zm3 7.1 6 3.5-6 3.5z"/></svg>',
    car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 2h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-1V7a2 2 0 0 0-2-2H5a3 3 0 0 1 3-3zM5 7h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/></svg>',
    collab: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 4.5a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2zM2.4 20c.5-3.9 3.2-6 6.6-6s6.1 2.1 6.6 6zM17 6a2.8 2.8 0 1 1 0 5.6A2.8 2.8 0 0 1 17 6zm-1.2 7.4c3-.5 5.6 1.3 6.2 4.8h-4.6a8 8 0 0 0-1.6-4.8z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
    reels: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM3 8h18M8.5 3l3 5M14 3l3 5"/><path fill="currentColor" d="M10 11.5v6l5-3z"/></svg>',
    tagged: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M4 3h16v15h-5l-3 3-3-3H4z"/><circle cx="12" cy="9" r="2.6" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" d="M7.5 16c.8-2 2.5-3 4.5-3s3.7 1 4.5 3"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M15 4 7 12l8 8"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/></svg>',
    dots: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="19" cy="12" r="1.8" fill="currentColor"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 20.5S3 15 3 8.8A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 9 2.4C21 15 12 20.5 12 20.5z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M20.7 16.8A9 9 0 1 0 17.4 20l3.6 1z"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M22 3 2 10l8 3 3 8zM10 13l5-5"/></svg>',
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M5 3h14v18l-7-6-7 6z"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>',
  };
  const STATUSBAR = '<div class="pv-sb" aria-hidden="true"><span>9:41</span><span class="pv-sbi"><svg viewBox="0 0 18 12"><path fill="currentColor" d="M1 8h2.6v3.4H1zM5 6h2.6v5.4H5zM9 3.6h2.6v7.8H9zM13 1h2.6v10.4H13z"/></svg><svg viewBox="0 0 16 12"><path fill="currentColor" d="M8 2.4a9.6 9.6 0 0 1 6.8 2.8l1-1.1A11 11 0 0 0 8 1 11 11 0 0 0 .2 4.1l1 1.1A9.6 9.6 0 0 1 8 2.4zm0 3a6.6 6.6 0 0 1 4.7 1.9l1-1.1A8 8 0 0 0 8 4a8 8 0 0 0-5.7 2.2l1 1.1A6.6 6.6 0 0 1 8 5.4zm0 3a3.6 3.6 0 0 1 2.6 1.1L8 12 5.4 9.5A3.6 3.6 0 0 1 8 8.4z"/></svg><svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="22" height="11" rx="3" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="17" height="8" rx="1.6" fill="currentColor"/><path d="M24 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity=".5"/></svg></span></div>';

  /* ---------- shared words ---------- */
  const PHONE = '07 9800 0984';
  const LOC = ['📍 إربد – شارع وصفي التل', '📍 Irbid – Wasfi Al-Tal St'];
  const PHRASES = {
    group: ['[مطاعم إربد · شارع وصفي التل · Brands by SEKA · أكل بإربد]', '[Irbid restaurants · Wasfi Al-Tal Street · Brands by SEKA · food in Irbid]'],
    meatmoot: ['[لحم مدخن · ميت موت · كتف خاروف مدخن]', '[smoked meat · Meat Moot · smoked lamb shoulder]'],
    mashhoor: ['[بروستد · مشهور · دجاج مقرمش بالأردن]', '[broasted chicken · Mashhoor · fried chicken in Jordan]'],
    nashmi: ['[شاورما · نشمي · كباب بالأردن]', '[shawarma · Nashmi · kebab in Jordan]'],
    checkinn: ['[دجاج على الفحم إربد · رز بالدجاج إربد · تشيك إن]', '[charcoal chicken Irbid · chicken with rice Irbid · Check Inn]'],
    cafe: ['[كافيه إربد · مطعم وكافيه بإربد · شارع وصفي التل]', '[café Irbid · restaurant and café in Irbid · Wasfi Al-Tal Street]'],
  };
  // where the post is: Irbid posts carry the Irbid tag; brand posts carry the brand's own city
  const PLACE = { meatmoot: ['إسطنبول، تركيا', 'Istanbul, Türkiye'], mashhoor: ['الأردن', 'Jordan'], nashmi: ['الأردن', 'Jordan'] };

  /* ---------- the SEKA NEWS stories (true, or clearly marked) ---------- */
  const NEWS = {
    cafe: {
      img: 'p-facade.jpg', brand: 'floor',
      h: ['الطابق الأول يفتح مطعماً وكافيه، والافتتاح مخطط له في 23–24 تشرين الأول', 'The first floor opens as a restaurant and café, planned 23–24 Oct.'],
      s2: ['التاريخ مخطط له وقد يتغيّر. الاسم والمنيو وليلة الافتتاح في المنشورات القادمة.', 'The date is planned and can still change. The name, the menu and the opening night come in the next posts.'],
      st: ['مخطط له', 'Planned'], why: ['من مكالمة 16 تشرين الأول. لا شيء عنه على إنستغرام حتى الآن.', 'From the 16 Oct call. Nothing about it is on Instagram yet.'],
      c: ['الطابق الأول بـ Brands by SEKA رح يفتح مطعم وكافيه. الافتتاح مخطط له 23–24 تشرين الأول، والتفاصيل بتنزل هون أول بأول.', 'The first floor at Brands by SEKA opens as a restaurant and café. The opening is planned for 23–24 October. Details go up here first.'],
    },
    four: {
      img: 'p-spread.jpg', brand: 'four',
      h: ['أربعة مطاعم في مكان واحد على شارع وصفي التل في إربد', 'Four restaurants in one place on Wasfi Al-Tal Street, Irbid.'],
      s2: ['ميت موت، مشهور، نشمي وتشيك إن، على شارع وصفي التل في إربد.', 'Meat Moot, Mashhoor, Nashmi and Check Inn, on Wasfi Al-Tal St in Irbid.'],
      st: ['من النبذة', 'From your bio'], why: ['النبذة اليوم: «⟦One place - Four vibes … All in Irbid⟧».', 'Your bio today: "One place - Four vibes … All in Irbid".'],
      c: ['ميت موت، مشهور، نشمي وتشيك إن: أربع مطاعم بمكان واحد على شارع وصفي التل.', 'Meat Moot, Mashhoor, Nashmi and Check Inn: four restaurants in one place on Wasfi Al-Tal St.'],
    },
    checkinn: {
      img: 'f-tray.jpg', lo: true, brand: 'checkinn',
      h: ['تشيك إن، للدجاج على الفحم والأرز بالدجاج، صارت له صفحة مستقلة', 'Check Inn’s charcoal chicken and rice gets a page of its own.'],
      s2: ['نصف دجاجة مع أرز، نصف دجاجة مع بطاطا، وسدر دجاج للعزائم. تابعوا @checkinn.irbid.', 'Half chicken with rice, half chicken with potatoes, and a chicken sidr for gatherings. Follow @checkinn.irbid.'],
      st: ['اقتراح', 'Proposal'], why: ['لا صفحة لتشيك إن اليوم، و0 منشور مستقل من أصل 100.', 'Check Inn has no page today, and 0 solo posts in 100.'],
      c: ['تشيك إن صار إله صفحة لحاله: @checkinn.irbid. تابعوها للمنيو والجديد.', 'Check Inn now has a page of its own: @checkinn.irbid. Follow it for the menu and what is new.'],
    },
  };
  const EDITION = 'IRBID EDITION ’26';

  /* ---------- people and pages that own posts ---------- */
  const WHO = {
    brands_by_seka: { av: 'seka' }, meat_moot: { av: 'meatmoot' }, mashhoor_mfc: { av: 'mashhoor' }, 'nashmi.brand': { av: 'nashmi' },
    'sekaa.91': { av: 'founder' }, 'checkinn.irbid': { av: 'checkinn' },
    cafe: { av: 'cafe', name: ['صفحة الكافيه (اسم يُحدد)', 'The café page (name to be set)'] },
    'thefoodies.jo': { av: 'ini', ini: 'TF' }, sui7asan: { av: 'ini', ini: 'S' }, thebadrico: { av: 'ini', ini: 'B' }, reemtalksfood: { av: 'ini', ini: 'R' },
    'foodie._mood': { av: 'ini', ini: 'F' }, yarathefoodie: { av: 'ini', ini: 'Y' }, amal62_: { av: 'ini', ini: 'A' },
  };
  const whoName = (h) => (WHO[h] && WHO[h].name ? tx(WHO[h].name) : h);

  /* ---------- the accounts ---------- */
  const TODAY_POSTS = [
    { code: 'DelwfORkS38', date: '2026-10-17', likes: 0, comments: 0, mk: [{ t: ['0 ♥ · 0 💬', '0 ♥ · 0 💬'] }],
      cap: 'لما الطعم يكون بهالمستوى، الرجعة بتصير أكيدة!\n\nلحمة مدخنة على أصولها، نكهة غنية، وطعم بتضلّك مشتهي ترجعله.\n\nجرّبها عند Meat Moot وخلي الحكم لأول لقمة.\n\n📍 إربد – شارع وصفي التل\n📞 07 9800 0984\n\n#MeatMoot #BrandsBySeka #smokedmeatloaf',
      g: 'Smoked meat: "try it at Meat Moot".', n: ['نُشر في 17 تشرين الأول. بعد يوم: 0 إعجاب و0 تعليق. صورة استوديو بلا أشخاص.', 'Posted 17 Oct. One day later: 0 likes and 0 comments. A studio photo with no people.'] },
    { code: 'DejRMyoj3t8', date: '2026-10-16', likes: 1, comments: 1,
      cap: 'قرمشة مشهورة، وطعم من أول لقمة بتحكي عنه!\n\nدجاج مقرمش، بطاطا ذهبية، وصوصات بتكمّل المتعة… مين بقدر يقاوم؟\n\nمشهور… الاسم لحاله بحكي!\n\n📍 إربد – شارع وصفي التل\n📞 07 9800 0984\n\n#مشهور #Mashhoor #BrandsBySeka',
      g: 'A Mashhoor tray: chicken, fries and sauces.', n: ['صورة منتج بلا أشخاص: إعجاب واحد وتعليق واحد.', 'A product photo with no people: 1 like, 1 comment.'] },
    { code: 'DegmjheiFaj', date: '2026-10-15', likes: 3, comments: 0, mk: [{ t: ['شعار نشمي، #MeatMoot', 'Nashmi logo, #MeatMoot'] }],
      cap: 'في أكلات من أول لقمة بتعرف إنك رح ترجع تطلبها مرة ثانية!\n\nطعم، قرمشة، وتفاصيل بتخلّي كل لقمة إلها حكاية.\n\n📍 إربد – شارع وصفي التل\n📞 07 9800 0984\n\n#MeatMoot #BrandsBySeka #إربد',
      g: 'Food you order again.', n: ['الشعار على الصورة لنشمي، والنص المرافق يحمل الوسم #MeatMoot.', 'The logo on the photo is Nashmi’s; the caption tags #MeatMoot.'] },
    { code: 'DebvHKWCi4S', date: '2026-10-13', likes: 1, comments: 0, mk: [{ t: ['#Amman', '#Amman'] }, { t: ['مبالغة', 'Superlative'] }],
      cap: 'ما في أطيب من هيك! 🤤🔥\n\nخبز طازة، حشوات بتفتح النفس، وطعم بخليك ترجع تطلبها مرة ومرتين!\n\nجرّبها بنفسك وخلي الحكم لإلك.\n\nللحجز والاستفسار :-\n📍 إربد – شارع وصفي التل\n📞0798000984\n#BrandsBySeka #Amman #FoodExperience',
      g: '"Nothing tastier than this!" Sandwiches.', n: ['على الصورة: العنوان «ما في أطيب منه!» مبالغة، والنص ينتهي بـ #Amman. والرقم مكتوب 0798000984 وليس 07 9800 0984.', 'On the image: the headline "nothing tastier" is a superlative, and the caption ends with #Amman. The phone is written 0798000984, not 07 9800 0984.'] },
    { code: 'DeZeb_wikNp', date: '2026-10-12', likes: 0, comments: 0, mk: [{ t: ['#Amman', '#Amman'] }, { t: ['شعار غير واضح', 'Logo hard to see'] }],
      cap: 'كل تغميسة إلها جوّها 😋\n\nأي صوص رح تختار؟ 🤤👇\n\nجرّب مشهور في Brands by Seka ❤️\n\n📲للحجز والاستفسار :-\n\n📍 إربد – شارع وصفي التل\n📞0798000984\n\n#BrandsBySeka #Amman #FoodExperience',
      g: '"Which sauce will you pick?" Mashhoor.', n: ['شعار مشهور الأحمر على خلفية حمراء، والعنوان «أشهر تغميسة» مبالغة. #Amman في آخر النص. 0 إعجاب.', 'The red Mashhoor logo sits on a red background, and the headline "the most famous dip" is a superlative. #Amman at the end. 0 likes.'] },
    { code: 'DeEIQcJtB6O', date: '2026-10-04', likes: 1, comments: 0, mk: [{ t: ['شعار غير واضح', 'Logo hard to see'] }],
      cap: 'قرمشة مشهور… كفيلة تعدّل المزاج من أول قضمة 🔥🍗\n\nقرمشة من برا، طراوة من جوا، وطعم بخليك ترجع لها كل مرة.\n\nإذا نفسك بشي يقرمش صح… \nخليها مشهور 😋\n\n📍 إربد – شارع وصفي التل \n📞 07 9800 0984\n\n#مشهور #BrandsBySeka #إربد #مطاعم_إربد #قرمشة بروستد Irbid JordanFood',
      g: 'Mashhoor crunch, the bucket.', n: ['شعار مشهور الأحمر على الأحمر، وبالكاد يُرى.', 'The red Mashhoor logo on red: hard to see.'] },
    { code: 'Dd8YsxkREdx', date: '2026-10-01', likes: 1, comments: 0,
      cap: 'جربها مرة… وبعدها خلي اللحمة المدخنة تحكي عن حالها 🔥🥩\n\nنكهة غنية، طعم مدخن، ووجبة معمولة للي بعرفوا يقدّروا اللحمة الصح.\n\nميت موت… كل مرة بتجربها، بتدمنها أكثر.\n\n📍 إربد – شارع وصفي التل\n📞 07 9800 0984\n\n#ميت_موت #BrandsBySeka #لحمة_مدخنة #مطاعم_إربد #إربد Irbid JordanFood',
      g: 'Meat Moot smoked meat plate.', n: ['صورة منتج: إعجاب واحد.', 'A product photo: 1 like.'] },
    { code: 'Dd3W7x-RiOL', date: '2026-09-29', likes: 1, comments: 0,
      cap: 'إذا الأجواء بدها نشمي… خلّها نشمي 🔥\n\nشاورما او كباب ، الطعم بفتح النفس 😍\n\nوعروض شهر 9؟ بتخليها أحلى وأوفر 😋\n\nنشمي من Brands by Seka\n\n📍 إربد – شارع وصفي التل\n📞 07 9800 0984\n\n#نشمي #BrandsBySeka #إربد #مطاعم_إربد #شاورما Irbid JordanFood',
      g: 'Nashmi kebab on the fire.', n: ['صورة منتج: إعجاب واحد.', 'A product photo: 1 like.'] },
    { code: 'DdyK_0Dx8fp', date: '2026-09-27', likes: 2, comments: 0,
      cap: 'وجبتك اليوم؟ خليها من ميت موت 🔥\n\nلحمة مدخنة، طعم غني، ووجبة بتفتح النفس من أول نظرة.\n\nولما يكون الأكل بهالجو… القعدة إلها طعم ثاني 😋\n\nميت موت – Brands by Seka\n📍 إربد، شارع وصفي التل\n📞 07 9800 0984\n\n#ميت_موت #BrandsBySeka #إربد #مطاعم_إربد #لحمة_مدخنة Irbid JordanFood',
      g: 'Meat Moot meal on a tray.', n: ['صورة منتج: إعجابان.', 'A product photo: 2 likes.'] },
    { code: 'DdtvDkSMWHl', date: '2026-09-25', likes: 376, comments: 24, reel: true, by: 'sui7asan', co: ['brands_by_seka'], mk: [{ ok: true, t: ['✓ 376 ♥ · أشخاص', '✓ 376 ♥ · people'] }],
      cap: 'Meat Moot Irbid 🔥', g: '', n: ['تعاون (collab) مع صانع محتوى من إربد (@sui7asan): عرض نار وتقطيع، 376 إعجاباً و24 تعليقاً. آخر ريل حتى اليوم.', 'A collab with an Irbid creator (@sui7asan): a fire and carving show, 376 likes and 24 comments. The last reel so far.'] },
    { code: 'DdqZiNUNsZO', date: '2026-09-24', likes: 2, comments: 0, mk: [{ t: ['#Amman', '#Amman'] }],
      cap: 'خليك مستعد لنشمي 🇯🇴🔥\n\nلأنها مش مجرد وجبة… هاي وجبة بتليق بالنشامى.\n\nاطلبها بدون تفكير، وخلي الطعم يحكي عن حاله😍\n\n📍 Brands by Seka – إربد، شارع وصفي التل\n\n📲للحجز والاستفسار :- \n\n📍 إربد – شارع وصفي التل\n📞0798000984\n\n#BrandsBySeka #Amman #FoodExperience',
      g: 'A Nashmi meal box.', n: ['النص ينتهي بـ #Amman، والعنوان مكتوب مرتين.', 'The caption ends with #Amman, and the address is written twice.'] },
    { code: 'DdlPI5YNSn4', date: '2026-09-22', likes: 61, comments: 1, mk: [{ ok: true, t: ['61 ♥', '61 ♥'] }],
      cap: 'شو سر قرمشة مشهور؟ 👀\n\nمن أول ما تذوقها بتحس بالفرق… قرمشة بتسمعها، وطعمة بتضل ببالك😍\n\nجرّبها واحكيلنا شو رأيك ❤️\n\nجرّب مشهور في Brands by Seka ❤️\n\n📲للحجز والاستفسار :- \n\n📍 إربد – شارع وصفي التل\n📞0798000984',
      g: '"What makes Mashhoor crunchy?"', n: ['أعلى عدد إعجابات في القالب الحالي: 61، وهو منشور يطرح سؤالاً.', 'The most likes in the current template: 61. It asks a question.'] },
  ].map((p) => ({ ...p, k: 'today', im: `t-${p.code}.jpg`, by: p.by || 'brands_by_seka', co: p.co || [] }));

  const IN_PLAN = ['منشورات مشتركة مع @brands_by_seka. الصفحة نفسها: نتفق معكم على من يديرها.', 'Collab posts with @brands_by_seka. The page itself: we agree with you who runs it.'];
  const WHO_RUNS = ['يُتفق عليه معكم: من يدير الصفحة، ومن يوافق على المنشورات.', 'To agree with you: who runs the page and who approves the posts.'];
  const ACCTS = [
    {
      id: 'group', sec: 'pv-group', handle: 'brands_by_seka', fol: '17,502', name: 'Brands by SEKA', short: ['المجموعة', 'Group'],
      kick: ['01 · صفحة المجموعة', '01 · Group page'], model: ['Independent Food Co. · @independent', 'Independent Food Co. · @independent'],
      av: 'seka', cat: ['مجموعة مطاعم', 'Restaurant group'], counts: ['116', '17.5K', '6'],
      bio: [['Home & News of @meat_moot, @mashhoor_mfc and @nashmi.brand.', 'Home & News of @meat_moot, @mashhoor_mfc and @nashmi.brand.'],
        ['📍 إربد، شارع وصفي التل: ميت موت، مشهور، نشمي وتشيك إن', '📍 Irbid, Wasfi Al-Tal St: Meat Moot, Mashhoor, Nashmi and Check Inn'],
        ['🆕 الطابق الأول: مطعم وكافيه، الافتتاح مخطط له في 23–24 تشرين الأول', '🆕 First floor: restaurant and café, opening planned for 23–24 Oct']],
      link: ['أول من يعرف بالجديد', 'First to know: the list'],
      pnote: ['مثل نبذة @independent: «⟦Home & News of⟧» ثم صفحات العلامات. يُضاف تشيك إن عندما تصبح له صفحة.', 'Like the @independent bio: "Home & News of" and then the brand pages. Check Inn joins when it has a page.'],
      hl: { style: 'bw', items: [{ t: ['الأخبار', 'News'], ic: 'news' }, { t: ['السيكا', 'SEKA'], av: 'founder' }, { t: ['ميت موت', 'Meat Moot'], av: 'meatmoot' }, { t: ['مشهور', 'Mashhoor'], av: 'mashhoor' }, { t: ['نشمي', 'Nashmi'], av: 'nashmi' }, { t: ['تشيك إن', 'Check Inn'], av: 'checkinn' }, { t: ['الطابق الأول', 'First floor'], ic: 'spark' }] },
      posts: [
        { k: 'ph', d: 'cafe', ph: { i: 'spark', l: ['الطابق الأول', 'First floor'], s: ['قريباً', 'Soon'] }, reel: true, by: 'cafe', co: ['brands_by_seka'],
          c: ['شي جديد عم يتجهّز فوق: مطعم وكافيه بالطابق الأول. الاسم قريباً.', 'Something new is getting ready upstairs: a restaurant and café on the first floor. The name comes soon.'],
          n: ['ريل تشويق يحتاج إلى تصوير. تنشره صفحة الكافيه الجديدة تعاوناً مع @brands_by_seka.', 'A teaser reel, still to film. The new café page posts it as a collab with @brands_by_seka.'] },
        { k: 'news', nw: 'cafe', car: true, co: ['cafe'], n: ['بطاقة «أخبار سيكا». التاريخ مخطط له وغير نهائي.', 'A SEKA NEWS card. The date is planned, not final.'] },
        { k: 'img', im: 'p-walk.jpg', reel: true, c: ['جولة بالمكان، قبل ما يفتح الطابق الأول.', 'A walk through the place before the first floor opens.'],
          n: ['من ريلكم في 17 أيلول 2026 (15 إعجاباً). في المقترح: الجولة نفسها مع أحد أفراد الفريق.', 'From your reel of 17 Sep 2026 (15 likes). In the plan: the same walk with someone from the team.'] },
        { k: 'img', im: 'f-friends.jpg', lo: true, reel: true, c: ['كل واحد بالشلّة بدّه أكلة؟ عنا 4 مطاعم بمكان واحد.', 'Everyone in the group wants something different? We have 4 restaurants in one place.'],
          n: ['ريلكم في 8 شباط 2026: 794 إعجاباً، وهو الأعلى بين 100 منشور. صديقتان أمام مشهور، ثم تأكلان معاً.', 'Your reel of 8 Feb 2026: 794 likes, the top post of 100. Two friends outside Mashhoor, then they eat together.'] },
        { k: 'news', nw: 'four', car: true, n: ['بطاقة «أخبار سيكا». الخبر من نبذة الحساب.', 'A SEKA NEWS card. The story is from your bio.'] },
        { k: 'img', im: 'p-spit.jpg', reel: true, by: 'thefoodies.jo', co: ['brands_by_seka'], c: ['جولة على المطاعم الأربعة بـ Brands by SEKA.', 'A tour of the four restaurants at Brands by SEKA.'],
          n: ['تعاون من @thefoodies.jo في 23 كانون الثاني 2026: 467 إعجاباً و21 تعليقاً.', 'A collab by @thefoodies.jo on 23 Jan 2026: 467 likes and 21 comments.'] },
        { k: 'img', im: 'f-checkinn1.jpg', lo: true, reel: true, d: 'ci', by: 'checkinn.irbid', co: ['brands_by_seka'], c: ['هاد تشيك إن: دجاج على الفحم ورز بالدجاج، بالطابق الأرضي.', 'This is Check Inn: charcoal chicken and rice with chicken, on the ground floor.'],
          n: ['لقطة من ريلكم في 17 أيلول 2026. تنشرها صفحة تشيك إن تعاوناً.', 'A frame from your reel of 17 Sep 2026. The Check Inn page posts it as a collab.'] },
        { k: 'news', nw: 'checkinn', car: true, co: ['checkinn.irbid'], n: ['اقتراح. الاسم @checkinn.irbid مقترح، ولم نتحقق من توفره.', 'A proposal. The handle @checkinn.irbid is a suggestion, not checked.'] },
        { k: 'card', d: 'ci-poster', by: 'checkinn.irbid', co: ['brands_by_seka'], txt: ['نص جاج مع رز', 'HALF CHICKEN WITH RICE'],
          c: ['نص جاجة على الفحم مع رز. من الكاونتر أو على طلبات.', 'Half a charcoal chicken with rice. At the counter or on Talabat.'], n: ['اسم الصنف من منيو طلبات.', 'The item name is from the Talabat menu.'] },
        { k: 'img', im: 'sk-founder.jpg', d: 'film', reel: true, co: ['sekaa.91'], c: ['تعرّفوا على @sekaa.91، صاحب @meat_moot.', 'Meet @sekaa.91, owner of @meat_moot.'],
          n: ['ريل يُصوَّر مع السيكا، مثل حديث مؤسسي Independent (180,000 مشاهدة). الصورة من حسابه (8 تشرين الأول 2026).', 'A reel to film with SEKA, like Independent’s founders’ talk (180,000 views). The photo is from his account (8 Oct 2026).'] },
        { k: 'img', im: 'p-fire.jpg', lo: true, reel: true, by: 'sui7asan', co: ['brands_by_seka'], c: ['النار والتقطيع قدّامك، بميت موت إربد.', 'Fire and carving in front of you, at Meat Moot Irbid.'],
          n: ['ريل تعاون من @sui7asan في 25 أيلول 2026: 376 إعجاباً و24 تعليقاً.', 'A collab reel by @sui7asan on 25 Sep 2026: 376 likes and 24 comments.'] },
      ],
      today: {
        counts: ['116', '17.5K', '6'], bio: ['Brands by SEKA | Jordan 🇯🇴', 'One place - Four vibes 💥', '🍗 Mashhoor • 🥩 Meat moot • 🌯 Nashmi •', '🍛 Check inn – All in Irbid', '🕛 Open 12:00Pm Until 2:00 am'],
        link: ['maps.app.goo.gl/p1y2JyzXh… و 1 غيره', 'maps.app.goo.gl/p1y2JyzXh… and 1 more'],
        hl: ['مشهور', 'نشمي', 'Menu', 'Check inn', 'Meat Moot', 'تواصل', 'Location', 'Delivery'],
      },
      panel: {
        job: ['بيت علامات السيكا وغرفة أخبارها: الأخبار والأشخاص، لا قائمة الطعام. لكل علامة صفحتها.', 'SEKA’s brand house and its newsroom: news and people, not the menu. Each brand keeps its own page.'],
        goes: [['بطاقة «أخبار سيكا» لكل خبر: افتتاح، صفحة جديدة، أمسية، تعاون', 'A SEKA NEWS card for each story: an opening, a new page, a night, a collab'],
          ['السيكا @sekaa.91 (734,222 متابعاً): أحاديث وزيارات، كما في حديث مؤسسي Independent (180,000 مشاهدة)', 'SEKA, @sekaa.91 (734,222 followers): talks and visits, like Independent’s founders’ talk (180,000 views)'],
          ['ريلز فيها أشخاص: الزبائن، الفريق، صنّاع المحتوى', 'Reels with people: guests, the team, creators'],
          ['منشورات العلامات تعاوناً (collab) مع @meat_moot، @mashhoor_mfc و@nashmi.brand، فتظهر هنا وعند العلامة', 'The brands’ posts as collabs with @meat_moot, @mashhoor_mfc and @nashmi.brand, so they show here and on the brand page']],
        rhythm: ['ستوري يومياً على @brands_by_seka، ونحو 7 فيديوهات أسبوعياً على الصفحات كلها (30 شهرياً في خطة الأشهر الثلاثة). صفحة المجموعة تحمل الأخبار والأشخاص ومنشورات التعاون مع العلامات.', 'Daily stories on @brands_by_seka, and about 7 videos a week across the pages (30 a month in the 3-month plan). The group page carries the news, the people and the brands’ collabs.'],
        tpl: ['صفوف من 3: قصة واحدة في كل صف، وبطاقة الأخبار في الوسط. أبيض وأسود فقط؛ ألوان العلامات تبقى في صفحاتها.', 'Rows of 3: one story per row, with the news card in the middle. Black and white only; the brand colours stay on the brand pages.'],
        model: { who: ['@independent في دبي: 54,328 متابعاً و7 علامات.', '@independent, Dubai: 54,328 followers, 7 brands.'], num: '2,880', ev: ['إعجاباً لبطاقة أخبار نُشرت تعاوناً مع 4 حسابات SALT، مقابل 108 و158 لبطاقتين بلا تعاون (5 بطاقات فقط، فهي إشارة لا قاعدة).', 'likes on a news card posted as a collab with 4 SALT accounts, against 108 and 158 for 2 cards without one (5 cards only: a sign, not a rule).'] },
        fix: [['#Amman في 47 منشوراً ← وسم موقع إربد في كل منشور', '#Amman on 47 posts → the Irbid location tag on every post'],
          ['«SERA» في 5 منشورات، و3 أشكال للاسم ← اسم واحد: Brands by SEKA', '"SERA" on 5 posts, and 3 spellings of the name → one name: Brands by SEKA'],
          ['النبذة تذكر أسماء العلامات بلا حساباتها ← «⟦Home & News of⟧» مع الحسابات', 'The bio names the brands without their handles → "Home & News of" with the handles'],
          ['81 من 100 منشور بلا تعليق ← ريلز فيها أشخاص، وسؤال في النص المرافق', '81 of 100 posts with 0 comments → reels with people, and a question in the caption'],
          ['كلمات مثل «أكبر» و«أطيب» ← بلا مبالغة', 'Words like "biggest" and "tastiest" → no superlatives']],
        who: WHO_RUNS,
        sw: ['#0B0B0B', '#FFFFFF'],
        src: ['الأرقام: @brands_by_seka (أحدث 100 من 116 منشوراً)، @independent، في 18 تشرين الأول 2026.', 'Numbers: @brands_by_seka (the 100 newest of 116 posts) and @independent, on 18 Oct 2026.'],
      },
    },
    {
      id: 'meatmoot', sec: 'pv-meatmoot', handle: 'meat_moot', fol: '166,389', tag: 'warn', name: 'Meat Moot Restaurant®', short: ['ميت موت', 'Meat Moot'],
      kick: ['03 · ميت موت', '03 · Meat Moot'], model: ['Kumo · @kumo.uae', 'Kumo · @kumo.uae'], av: 'meatmoot', cat: ['مطعم', 'Restaurant'], counts: ['325', '166K', '25'],
      bio: [['#Lets_Meat', '#Lets_Meat'], ['Owner @sekaa.91', 'Owner @sekaa.91'], ['📍 Türkiye: Vadistanbul, Ortaköy, Taksim, Trabzon', '📍 Türkiye: Vadistanbul, Ortaköy, Taksim, Trabzon'], ['🌍 @meatmoot_jordan · @meatmoothouston · @meatmoot_oh', '🌍 @meatmoot_jordan · @meatmoothouston · @meatmoot_oh']],
      hl: { style: 'mm', items: [{ t: ['Our world', 'Our world'], ic: 'pin' }, { t: ['Shoulder', 'Shoulder'], tx: '01' }, { t: ['Brisket', 'Brisket'], tx: '02' }, { t: ['Lamb Ribs', 'Lamb Ribs'], tx: '03' }, { t: ['Short Ribs', 'Short Ribs'], tx: '04' }, { t: ['Contact', 'Contact'], ic: 'phone' }] },
      posts: [
        { k: 'card', d: 'mm-ed', c: ['إصدار الكتف: كل أسبوعين قطعة وحدة. هالمرة كتف الخاروف المدخّن.', 'The Shoulder Edition: one cut every two weeks. This time, smoked lamb shoulder.'], n: ['مثال على «إصدار»، مثل Nigiri Edition عند Kumo. «Shoulder» من القصص المثبتة على الحساب.', 'An example Edition, like Kumo’s Nigiri Edition. "Shoulder" is already a highlight on the account.'] },
        { k: 'img', im: 'p-shoulder.jpg', d: 'mm', lab: '01 · SHOULDER', co: ['brands_by_seka'], c: ['كتف خاروف مدخّن.', 'Smoked lamb shoulder.'], n: ['صورة من منشور @brands_by_seka في 17 تشرين الأول 2026 (إربد)، بلا النص.', 'Photo from a @brands_by_seka post of 17 Oct 2026 (Irbid), without the text.'] },
        { k: 'img', im: 'p-fire.jpg', lo: true, reel: true, by: 'sui7asan', co: ['meat_moot'], c: ['النار والتقطيع قدّامك.', 'Fire and carving in front of you.'], n: ['ريل تعاون من @sui7asan بعنوان «Meat Moot Irbid» (25 أيلول 2026): 376 إعجاباً و24 تعليقاً. نُشر مع @brands_by_seka.', 'A collab reel by @sui7asan, "Meat Moot Irbid" (25 Sep 2026): 376 likes and 24 comments. It was posted with @brands_by_seka.'] },
        { k: 'img', im: 'mt-texas.jpg', d: 'mm', lab: '02 · TEXAS MEAT', c: ['لحم تكساس على قائمتنا.', 'Texas meat, now on our menu.'], n: ['صورة من @meat_moot (19 تموز 2026: «لأول مرة في قائمتنا: لحم تكساس»).', 'Photo from @meat_moot (19 Jul 2026: "First time on our menu: Texas meat").'] },
        { k: 'img', im: 'mt-fire.jpg', reel: true, c: ['التقطيع على الطاولة.', 'The cut, at the table.'], n: ['غلاف ريل من @meat_moot (20 حزيران 2026، 150 إعجاباً).', 'Cover of a @meat_moot reel (20 Jun 2026, 150 likes).'] },
        { k: 'card', d: 'mm-world', c: ['عالم ميت موت: تركيا، الأردن، أمريكا.', 'The Meat Moot world: Türkiye, Jordan, USA.'], n: ['الدول من حسابات ميت موت: @meat_moot، @meatmoot_jordan، @meatmoothouston، @meatmoot_oh.', 'The countries come from the Meat Moot accounts: @meat_moot, @meatmoot_jordan, @meatmoothouston and @meatmoot_oh.'] },
        { k: 'img', im: 'mt-ribs.jpg', d: 'mm', lab: '03 · RIBS', c: ['الريش على اللوح.', 'Ribs on the board.'], n: ['صورة من @meat_moot (3 أيار 2026).', 'Photo from @meat_moot (3 May 2026).'] },
        { k: 'img', im: 'mt-bosphorus.jpg', reel: true, c: ['البوسفور بالليل.', 'The Bosphorus at night.'], n: ['غلاف ريل من @meat_moot (1 كانون الثاني 2026، 114 إعجاباً).', 'Cover of a @meat_moot reel (1 Jan 2026, 114 likes).'] },
        { k: 'img', im: 'mt-plate.jpg', d: 'mm', lab: '04 · THE PLATE', c: ['الصحن جاهز.', 'The plate is ready.'], n: ['صورة من @meat_moot (4 شباط 2026).', 'Photo from @meat_moot (4 Feb 2026).'] },
        { k: 'card', d: 'mm-lets', c: ['#Lets_Meat', '#Lets_Meat'], n: ['شعار الحساب نفسه، من نبذة @meat_moot.', 'The account’s own tag line, from the @meat_moot bio.'] },
        { k: 'img', im: 'mt-iftar.jpg', c: ['إفطار على البوسفور.', 'Iftar on the Bosphorus.'], n: ['صورة من @meat_moot (10 آذار 2026: «إفطار بإطلالة البوسفور»).', 'Photo from @meat_moot (10 Mar 2026: "an iftar with a Bosphorus view").'] },
        { k: 'img', im: 'mt-taksim.jpg', reel: true, c: ['طاقة تقسيم.', 'The energy of Taksim.'], n: ['غلاف ريل من @meat_moot (18 آب 2026، آخر منشور حتى اليوم).', 'Cover of a @meat_moot reel (18 Aug 2026, the latest post so far).'] },
      ],
      panel: {
        plan: IN_PLAN,
        job: ['صفحة العلامة: اللحم المدخّن، والتقطيع على الطاولة، وفروع ميت موت.', 'The brand page: smoked meat, the cut at the table, and the Meat Moot branches.'],
        goes: [['«إصدار» كل أسبوعين لقطعة واحدة (مثال: الكتف)', 'An Edition every two weeks for one cut (example: the shoulder)'], ['لقطات قريبة للقشرة والدهن والدخان', 'Close-ups of the bark, the fat and the smoke'], ['التقطيع أمام الزبون، بالفيديو', 'The cut in front of the guest, on video'], ['الفروع: البوسفور، تقسيم، أورتاكوي، ومنشورات تعاون مع حسابات الدول', 'The branches: the Bosphorus, Taksim, Ortaköy, and collabs with the country pages'], ['على @meatmoot_jordan حصل ريل الكتف على 4,045 إعجاباً، ووسيط الحساب 24', 'On @meatmoot_jordan the lamb shoulder reel got 4,045 likes; that page’s median is 24']],
        rhythm: ['3 منشورات أسبوعياً، مثل Kumo (12 منشوراً في آخر 30 يوماً). اليوم: 1–4 منشورات شهرياً في 2026، ولا منشور منذ 18 آب.', '3 a week, like Kumo (12 own posts in the last 30 days). Today: 1–4 posts a month in 2026, none since 18 Aug.'],
        tpl: ['أسود، واسم الإصدار بأحرف ذهبية متباعدة، وتفصيل واحد برتقالي.', 'Black, the Edition name in spaced gold caps, and one orange detail.'],
        model: { who: ['Kumo ‏(@kumo.uae، 18,951 متابعاً):', 'Kumo (@kumo.uae, 18,951 followers):'], num: '11 / 12', ev: ['منشوراً في الشبكة من حملة واحدة، Nigiri Edition ‏(2–17 تشرين الأول 2026)، مع سمكة لها اسم: KiKi.', 'posts on the grid are one drop, the Nigiri Edition (2–17 Oct 2026), with a named hero fish: KiKi.'] },
        fix: [['الحساب المذكور في النبذة (@seka___88) لا يفتح أي صفحة ← تحديثه معكم', 'The handle in the bio (@seka___88) opens no profile → update it with you'], ['لا منشور منذ 18 آب 2026', 'No post since 18 Aug 2026'], ['النبذة لا تذكر حسابات الدول (@meatmoot_jordan: 92,577 متابعاً) ← سطر لها', 'The bio does not link the country pages (@meatmoot_jordan: 92,577 followers) → one line for them']],
        who: WHO_RUNS,
        sw: ['#040303', '#B89666', '#EF8903'],
        src: ['الأرقام: @meat_moot في 18 تشرين الأول 2026 (وسيط 117 إعجاباً لأحدث 24 منشوراً). الصور: @meat_moot، والصورتان 2 و3 من منشورات @brands_by_seka.', 'Numbers: @meat_moot on 18 Oct 2026 (median 117 likes on the 24 newest posts). Photos: @meat_moot; photos 2 and 3 are from @brands_by_seka posts.'],
      },
    },
    {
      id: 'mashhoor', sec: 'pv-mashhoor', handle: 'mashhoor_mfc', fol: '281,857', name: 'Mashhoor Fried Chicken', short: ['مشهور', 'Mashhoor'],
      kick: ['04 · مشهور', '04 · Mashhoor'], model: ['SALT · @findsalt', 'SALT · @findsalt'], av: 'mashhoor', cat: ['مطعم دجاج', 'Chicken restaurant'], counts: ['90', '281K', '7'],
      bio: [['📍 السابع · عبدون · الجبيهة · مرج الحمام · الزرقاء · إربد', '📍 7th Circle · Abdoun · Jubaiha · Marj Al Hamam · Zarqa · Irbid'], ['📲 حمّل تطبيق مشهور · 0792555557', '📲 Get the Mashhoor app · 0792555557'], ['✉️ Franchise@mashoor.net', '✉️ Franchise@mashoor.net']],
      hl: { style: 'mash', items: [{ t: ['الفروع', 'Branches'], ic: 'pin' }, { t: ['المنيو', 'Menu'], ic: 'menu' }, { t: ['التوصيل', 'Delivery'], ic: 'truck' }, { t: ['الصوصات', 'Sauces'], ic: 'drop' }, { t: ['مشهور كيدز', 'Mashhoor Kids'], ic: 'people' }, { t: ['الامتياز', 'Franchise'], ic: 'tag' }] },
      posts: [
        { k: 'card', d: 'mash-drop', c: ['أي غمسة إلك؟ أسبوعين والصوصات إلها الحكي بمشهور.', 'Which dip is yours? For two weeks the sauces lead at Mashhoor.'], n: ['مثال على حملة.', 'An example drop.'] },
        { k: 'img', im: 'p-cheese.jpg', d: 'mash', co: ['brands_by_seka'], c: ['صوص الجبنة على قطعة بروستد سخنة.', 'Cheese sauce on a hot piece of broasted chicken.'], n: ['صورة من منشور @brands_by_seka في 12 تشرين الأول 2026 (فرع إربد)، بلا النص.', 'Photo from a @brands_by_seka post of 12 Oct 2026 (Irbid branch), without the text.'] },
        { k: 'img', im: 'mf-bucket.jpg', reel: true, by: 'thebadrico', co: ['mashhoor_mfc'], c: ['سطل مشهور مع @thebadrico.', 'A Mashhoor bucket with @thebadrico.'], n: ['ريل تعاون من @thebadrico في 3 آب 2026: 2,130 إعجاباً و150 تعليقاً، وهو الأعلى بين أحدث 30 منشوراً.', 'A collab reel by @thebadrico on 3 Aug 2026: 2,130 likes and 150 comments, the top one of the 30 newest posts.'] },
        { k: 'img', im: 'p-dip.jpg', d: 'mash', co: ['brands_by_seka'], c: ['غمّس وجرّب.', 'Dip and try.'], n: ['صورة من منشور @brands_by_seka في 22 أيلول 2026 (فرع إربد)، بلا النص.', 'Photo from a @brands_by_seka post of 22 Sep 2026 (Irbid branch), without the text.'] },
        { k: 'card', d: 'mash-poll', c: ['جبنة، ثوم ولا كاتشب؟ اكتبوا بالتعليقات.', 'Cheese, garlic or ketchup? Tell us in the comments.'], n: ['منشور سؤال، هدفه التعليقات.', 'A question post, to get comments.'] },
        { k: 'img', im: 'p-tray.jpg', d: 'mash', co: ['brands_by_seka'], c: ['صينية مشهور: بروستد، بطاطا وصوصات.', 'A Mashhoor tray: broasted chicken, fries and sauces.'], n: ['صورة من منشور @brands_by_seka في 16 تشرين الأول 2026 (فرع إربد)، بلا النص.', 'Photo from a @brands_by_seka post of 16 Oct 2026 (Irbid branch), without the text.'] },
        { k: 'img', im: 'mf-store.jpg', reel: true, by: 'reemtalksfood', co: ['mashhoor_mfc'], c: ['جولة على فروع مشهور مع @reemtalksfood.', 'A tour of the Mashhoor branches with @reemtalksfood.'], n: ['ريل تعاون من @reemtalksfood في 4 آب 2026: 336 إعجاباً. قائمة الفروع في نصه لا تذكر إربد.', 'A collab reel by @reemtalksfood on 4 Aug 2026: 336 likes. Its branch list leaves Irbid out.'] },
        { k: 'card', d: 'mash-app', c: ['حمّل تطبيق مشهور واطلب من أقرب فرع.', 'Get the Mashhoor app and order from your nearest branch.'], n: ['منشورات تروّج للتطبيق منذ 1 حزيران 2026. هل يخدم إربد؟ لم يُتحقق من ذلك بعد.', 'Posts promote the app since 1 Jun 2026. Whether it serves Irbid is not confirmed.'] },
        { k: 'img', im: 'p-bucket.jpg', d: 'mash', co: ['brands_by_seka'], c: ['سطل البروستد، سخن ومقرمش.', 'The broasted bucket, hot and crisp.'], n: ['صورة من منشور @brands_by_seka في 4 تشرين الأول 2026 (فرع إربد). هنا الشعار الأبيض على الأحمر بدل الأحمر على الأحمر.', 'Photo from a @brands_by_seka post of 4 Oct 2026 (Irbid branch). Here the white mark on red replaces the red-on-red logo.'] },
        { k: 'card', d: 'mash-city', co: ['brands_by_seka'], c: ['مشهور بإربد: شارع وصفي التل، جوّا @brands_by_seka.', 'Mashhoor in Irbid: Wasfi Al-Tal St, inside @brands_by_seka.'], n: ['فرع إربد هو السادس (منشور 5 حزيران 2025)، ولا تذكره النبذة اليوم. بطاقة مثل بطاقات الدول عند SALT.', 'Irbid is the 6th branch (post of 5 Jun 2025), and the bio leaves it out today. A card like SALT’s country cards.'] },
        { k: 'img', im: 'f-friends.jpg', lo: true, reel: true, by: 'brands_by_seka', co: ['mashhoor_mfc'], c: ['وحدة بدها مشهور والثانية بدها ميت موت. ولا يهمك.', 'One wants Mashhoor, the other wants Meat Moot. No problem.'], n: ['ريل @brands_by_seka في 8 شباط 2026: 794 إعجاباً. هنا يُنشر تعاوناً مع @mashhoor_mfc.', 'The @brands_by_seka reel of 8 Feb 2026: 794 likes. Here it is posted as a collab with @mashhoor_mfc.'] },
        { k: 'img', im: 'mf-table.jpg', reel: true, by: 'foodie._mood', co: ['mashhoor_mfc'], c: ['صينية مشهور كاملة مع @foodie._mood.', 'A full Mashhoor tray with @foodie._mood.'], n: ['ريل تعاون من @foodie._mood في 3 آب 2026: 255 إعجاباً و76 تعليقاً.', 'A collab reel by @foodie._mood on 3 Aug 2026: 255 likes and 76 comments.'] },
      ],
      panel: {
        plan: IN_PLAN,
        job: ['صفحة العلامة: الفروع والتطبيق والحملات، ومنها فرع إربد.', 'The brand page: the branches, the app and the drops, Irbid included.'],
        goes: [['حملة كل أسبوعين بلون واحد قوي (مثال: الصوصات)', 'A drop every two weeks, with one loud colour (example: the sauces)'], ['ريلز تعاون مع صنّاع المحتوى: وسيطها 343 إعجاباً، مقابل 20 لمنشورات الحساب الخاصة', 'Collab reels with creators: median 343 likes, against 20 for the account’s own posts'], ['بطاقات للفروع، ومنها إربد', 'Cards for the branches, Irbid included']],
        rhythm: ['3 منشورات أسبوعياً وقت الحملة (أسبوعان)، ومنشور أسبوعياً بين الحملات. اليوم: دفعات ثم صمت؛ لا منشور منذ 9 أيلول.', '3 a week during a drop (2 weeks), 1 a week between drops. Today: bursts, then silence; no post since 9 Sep.'],
        tpl: ['شعار مشهور الأبيض على الأحمر ثابت. لكل حملة لون واحد (مثال: أصفر الجبنة). بطاقات ملوّنة وصور بالتناوب.', 'The white Mashhoor mark on red stays fixed. Each drop gets one loud colour (example: cheese yellow). Colour cards and photos alternate.'],
        model: { who: ['SALT ‏(@findsalt، 361 ألف متابع). صفحته المحلية في الكويت @findsalt.kuwait:', 'SALT (@findsalt, 361K). Its local page in Kuwait, @findsalt.kuwait:'], num: '409,000', ev: ['مشاهدة لريل حفلة الحملة (25 أيلول 2026). ومنشورات شبكة SALT الـ12 كلها من حملة واحدة: SALT × Brooki.', 'views on the drop-party reel (25 Sep 2026). All 12 posts on SALT’s grid are one drop: SALT × Brooki.'] },
        fix: [['إربد غائبة عن النبذة وعن قوائم الفروع عند صنّاع المحتوى ← إضافتها', 'Irbid is missing from the bio and from the creators’ branch lists → add it'], ['الشعار الأحمر على خلفية حمراء في منشورات إربد (منشوران) ← الشعار الأبيض على الأحمر', 'The red logo on a red background in the Irbid posts (2 posts) → the white mark on red'], ['دفعات ثم صمت: 14 منشوراً في آب ومنشور واحد في أيلول ← إيقاع ثابت', 'Bursts, then silence: 14 posts in August and 1 in September → a steady rhythm']],
        who: WHO_RUNS,
        sw: ['#ED212D', '#FFFFFF', '#FFC72C'], swNote: ['الأصفر لون الحملة (مثال).', 'Yellow is the drop colour (example).'],
        src: ['الأرقام: @mashhoor_mfc في 18 تشرين الأول 2026. الصور: @mashhoor_mfc، ومنشورات @brands_by_seka من فرع إربد.', 'Numbers: @mashhoor_mfc on 18 Oct 2026. Photos: @mashhoor_mfc, and @brands_by_seka posts from the Irbid branch.'],
      },
    },
    {
      id: 'nashmi', sec: 'pv-nashmi', handle: 'nashmi.brand', fol: '77,231', name: 'Nashmi®', short: ['نشمي', 'Nashmi'],
      kick: ['05 · نشمي', '05 · Nashmi'], model: ['Joe & The Juice KSA + Parker’s', 'Joe & The Juice KSA + Parker’s'], av: 'nashmi', cat: ['مطعم شاورما', 'Shawarma restaurant'], counts: ['230', '77.2K', '14'],
      bio: [['شاورما وكباب نشمي 🇯🇴', 'Nashmi shawarma and kebab 🇯🇴'], ['📍 عمّان · إربد · سلطنة عُمان · العراق · البحرين', '📍 Amman · Irbid · Oman · Iraq · Bahrain'], ['📲 حمّل تطبيق نشمي · ⟦+962 790099992⟧', '📲 Get the Nashmi app · +962 790099992'], ['✉️ franchise@nashmi.company', '✉️ franchise@nashmi.company']],
      hl: { style: 'na', items: [{ t: ['📍إربد', '📍Irbid'], ic: 'pin' }, { t: ['المنيو', 'Menu'], ic: 'menu' }, { t: ['اطلب الآن', 'Order now'], ic: 'phone' }, { t: ['النشامى', 'Match days'], ic: 'ball' }, { t: ['جديد نشمي', 'New'], ic: 'spark' }] },
      posts: [
        { k: 'card', d: 'na-match', c: ['يوم الماتش؟ اطلب نشمي وتابع مع الصحاب.', 'Match day? Order Nashmi and watch with friends.'], n: ['مثال على حملة: أيام مباريات المنتخب.', 'An example drop: Jordan’s match days.'] },
        { k: 'img', im: 'p-sandw.jpg', d: 'na', co: ['brands_by_seka'], c: ['ساندويشات نشمي: شاورما وكباب.', 'Nashmi sandwiches: shawarma and kebab.'], n: ['صورة من منشور @brands_by_seka في 13 تشرين الأول 2026 (فرع إربد)، بلا النص.', 'Photo from a @brands_by_seka post of 13 Oct 2026 (Irbid branch), without the text.'] },
        { k: 'img', im: 'na-bite.jpg', reel: true, by: 'yarathefoodie', co: ['nashmi.brand'], c: ['ساندويش نشمي مع @yarathefoodie.', 'A Nashmi sandwich with @yarathefoodie.'], n: ['ريل تعاون من @yarathefoodie في 16 تموز 2026: 155 إعجاباً و55 تعليقاً.', 'A collab reel by @yarathefoodie on 16 Jul 2026: 155 likes and 55 comments.'] },
        { k: 'img', im: 'p-wrap.jpg', d: 'na', co: ['brands_by_seka'], c: ['لقمة شاورما بإيدك.', 'A bite of shawarma in your hand.'], n: ['الوجه لا يظهر، والشخصية هي الوجه (مثل Parker’s).', 'No face shown; the mascot is the face (like Parker’s).'] },
        { k: 'card', d: 'na-menu', c: ['شاورما لحم، كباب، شيش وعرايس. أربع خيارات.', 'Beef shawarma, kebab, shish and arayes. Four choices.'], n: ['الأصناف من منشور @nashmi.brand في 12 أيلول 2026.', 'The items are from a @nashmi.brand post of 12 Sep 2026.'] },
        { k: 'img', im: 'p-box.jpg', d: 'na', co: ['brands_by_seka'], c: ['وجبة نشمي بالعلبة، للبيت.', 'A Nashmi meal in the box, for home.'], n: ['صورة من منشور @brands_by_seka في 24 أيلول 2026 (فرع إربد)، بلا النص.', 'Photo from a @brands_by_seka post of 24 Sep 2026 (Irbid branch), without the text.'] },
        { k: 'card', d: 'na-code', co: ['brands_by_seka'], c: ['يوم ماتش النشامى؟ اعرض هالكود عند الطلب: [النسبة] على [الأصناف]. [التاريخ].', 'Jordan match day? Show this code when you order: [percent] off [items]. [date].'], n: ['مثال: عرض بكود بدل السحب على جائزة. الأصناف والنسبة والتاريخ تُحدَّد معكم.', 'An example: a code offer instead of a prize draw. The items, the percent and the date are set with you.'] },
        { k: 'img', im: 'p-kebab.jpg', d: 'na', co: ['brands_by_seka'], c: ['الكباب على النار.', 'Kebab on the fire.'], n: ['صورة من منشور @brands_by_seka في 29 أيلول 2026 (فرع إربد)، بلا النص.', 'Photo from a @brands_by_seka post of 29 Sep 2026 (Irbid branch), without the text.'] },
        { k: 'img', im: 'na-sign.jpg', reel: true, by: 'amal62_', co: ['nashmi.brand'], c: ['الوجه اللي بتعرفه.', 'The face you know.'], n: ['غلاف ريل تعاون من @amal62_ في 14 تموز 2026: 1,068 إعجاباً.', 'Cover of a collab reel by @amal62_ on 14 Jul 2026: 1,068 likes.'] },
        { k: 'card', d: 'na-face', pill: ['الأردن', 'الأردن'], c: ['نشمي: من الأردن.', 'Nashmi: from Jordan.'] },
        { k: 'img', im: 'na-seat.jpg', reel: true, by: 'foodie._mood', co: ['nashmi.brand'], c: ['قعدة مع نشمي.', 'Time out with Nashmi.'], n: ['ريل تعاون من @foodie._mood في 15 تموز 2026: 100 إعجاب و38 تعليقاً.', 'A collab reel by @foodie._mood on 15 Jul 2026: 100 likes and 38 comments.'] },
        { k: 'card', d: 'na-order', ph: '0790099992', c: ['اطلب الآن: 0790099992، أو من تطبيق نشمي.', 'Order now: 0790099992, or in the Nashmi app.'], n: ['الرقم من نبذة @nashmi.brand.', 'The number is from the @nashmi.brand bio.'] },
      ],
      panel: {
        plan: IN_PLAN,
        job: ['صفحة العلامة: الوجه (الشخصية)، أيام المباريات، والطلب، والفروع ومنها إربد.', 'The brand page: the face (the mascot), match days, orders, and the branches, Irbid included.'],
        goes: [['الشخصية على كل تصميم، ونقشة الشماغ إطاراً', 'The mascot on every graphic, and the shemagh pattern as the frame'], ['لحظات المنتخب والمباريات', 'Jordan’s national team and match moments'], ['أيدٍ وساندويشات؛ الشخصية هي الوجه', 'Hands and sandwiches; the mascot is the face'], ['قصة مثبتة لفرع إربد', 'A highlight for the Irbid branch']],
        rhythm: ['2–3 منشورات أسبوعياً، وأكثر في أيام المباريات. اليوم: منشور واحد شهرياً منذ آب.', '2–3 a week, more on match days. Today: one post a month since August.'],
        tpl: ['خلفية فاتحة، وخط عربي أحمر، والشخصية، ونقشة الشماغ كما يستخدم Parker’s المربعات. العربية أولاً.', 'Off-white, red Arabic calligraphy, the mascot, and the shemagh pattern used like Parker’s gingham. Arabic first.'],
        model: { who: ['⟦Joe & The Juice KSA⟧ ‏(71,101 متابع). ريل حملة وطنية سعودية:', 'Joe & The Juice KSA (71,101 followers). A Saudi national-moment reel:'], num: '209,000', ev: ['مشاهدة (12 تشرين الأول 2026). ومن Parker’s: الوجوه مخفية خلف قائمة أو كيس، فتبقى الشخصية هي الوجه.', 'views (12 Oct 2026). From Parker’s: faces hidden behind a menu or a bag, so the character is the face.'] },
        fix: [['إربد غائبة عن قصص الفروع المثبتة ← قصة «إربد»', 'Irbid is missing from the branch highlights → an "Irbid" highlight'], ['منشور واحد شهرياً منذ آب ← 2–3 أسبوعياً', 'One post a month since August → 2–3 a week'], ['منشورات الحساب الخاصة: وسيط 81 إعجاباً؛ ريلز التعاون: 476 ← تعاون أكثر', 'The account’s own posts: median 81 likes; collab reels: 476 → more collabs']],
        who: WHO_RUNS,
        sw: ['#DA252A', '#EDE7E7', '#BA9274', '#030202'],
        src: ['الأرقام: @nashmi.brand في 18 تشرين الأول 2026. الصور: @nashmi.brand، ومنشورات @brands_by_seka من فرع إربد.', 'Numbers: @nashmi.brand on 18 Oct 2026. Photos: @nashmi.brand, and @brands_by_seka posts from the Irbid branch.'],
      },
    },
    {
      id: 'checkinn', sec: 'pv-checkinn', handle: 'checkinn.irbid', tag: 'new', addon: true, name: 'Check Inn | تشيك إن', short: ['تشيك إن', 'Check Inn'],
      kick: ['06 · تشيك إن', '06 · Check Inn'], model: ['Shalwa / Public', 'Shalwa / Public'], av: 'checkinn', cat: ['مطعم دجاج', 'Chicken restaurant'], counts: ['12', '—', '—'],
      bio: [['دجاج على الفحم ورز بالدجاج', 'Charcoal chicken and rice with chicken'], ['📍 إربد، شارع وصفي التل، داخل @brands_by_seka', '📍 Irbid, Wasfi Al-Tal St, inside @brands_by_seka'], ['🛵 على طلبات · 07 9800 0984', '🛵 On Talabat · 07 9800 0984']],
      hl: { style: 'ci', items: [{ t: ['المنيو', 'Menu'], ic: 'menu' }, { t: ['السدر', 'Sidr'], ic: 'fire' }, { t: ['طلبات', 'Talabat'], ic: 'truck' }, { t: ['الموقع', 'Location'], ic: 'pin' }] },
      posts: [
        { k: 'card', d: 'ci-hello', c: ['أهلاً، هاي صفحة تشيك إن: دجاج على الفحم ورز بالدجاج، بإربد.', 'Hello, this is the Check Inn page: charcoal chicken and rice with chicken, in Irbid.'], n: ['أول منشور للصفحة.', 'The page’s first post.'] },
        { k: 'img', im: 'f-checkinn1.jpg', lo: true, reel: true, d: 'ci', co: ['brands_by_seka'], c: ['كاونتر تشيك إن بالطابق الأرضي.', 'The Check Inn counter on the ground floor.'], n: ['لقطة من ريلكم في 17 أيلول 2026.', 'A frame from your reel of 17 Sep 2026.'] },
        { k: 'card', d: 'ci-poster', txt: ['نص جاج مع رز', 'HALF CHICKEN WITH RICE'], c: ['نص جاجة على الفحم مع رز.', 'Half a charcoal chicken with rice.'], n: ['اسم الصنف من منيو طلبات.', 'The item name is from the Talabat menu.'] },
        { k: 'img', im: 'f-tray.jpg', lo: true, d: 'ci', c: ['جاهز للتوصيل.', 'Ready for delivery.'], n: ['لقطة من ريلكم في 8 شباط 2026. يُتأكد معكم أنه طبق من تشيك إن.', 'A frame from your reel of 8 Feb 2026. To confirm with you that it is a Check Inn dish.'] },
        { k: 'card', d: 'ci-eyes', c: ['شمّيت ريحة الفحم؟', 'Can you smell the charcoal?'] },
        { k: 'img', im: 'f-checkinn2.jpg', lo: true, reel: true, c: ['من الكاونتر للطاولة.', 'From the counter to the table.'], n: ['لقطة من ريلكم في 17 أيلول 2026.', 'A frame from your reel of 17 Sep 2026.'] },
        { k: 'card', d: 'ci-sidr', c: ['سدر جاج للعزايم واللمّات: جاجة، جاجتين أو ثلاث.', 'A chicken sidr for gatherings: one, two or three chickens.'], n: ['سدر الدجاجة والدجاجتين والثلاث موجود في منيو طلبات.', 'Sidr of one, two and three chickens is on the Talabat menu.'] },
        { k: 'ph', d: 'ci', ph: { i: 'camera', l: ['الفحم عن قرب', 'The charcoal, close up'], s: ['يُصوَّر', 'To shoot'] }, c: ['الفحم والجاج، عن قرب.', 'The charcoal and the chicken, close up.'], n: ['لا صورة لدينا لهذا. يحتاج يوم تصوير.', 'We have no photo of this. It needs a shoot day.'] },
        { k: 'img', im: 'f-rice.jpg', lo: true, d: 'ci', c: ['رز بالدجاج.', 'Rice with chicken.'], n: ['لقطة من ريلكم في 8 شباط 2026. يُتأكد معكم أنه طبق من تشيك إن.', 'A frame from your reel of 8 Feb 2026. To confirm with you that it is a Check Inn dish.'] },
        { k: 'ph', d: 'ci', car: true, ph: { i: 'people', l: ['صور الطاولات', 'Table candids'], s: ['يُصوَّر', 'To shoot'] }, c: ['صوركم على الطاولة. بنشاركها كل أسبوع.', 'Your photos at the table. We share them every week.'], n: ['مثل #PublicCandids عند Public: كاروسيل من 19 صورة.', 'Like Public’s #PublicCandids: carousels of 19 photos.'] },
        { k: 'card', d: 'ci-talabat', c: ['تشيك إن على طلبات بإربد.', 'Check Inn is on Talabat in Irbid.'], n: ['تقييم تشيك إن على طلبات: 3.6.', 'Check Inn’s Talabat rating: 3.6.'] },
        { k: 'ph', d: 'ci', reel: true, ph: { i: 'film', l: ['الفريق أثناء العمل', 'The team at work'], s: ['يُصوَّر', 'To shoot'] }, c: ['تعرّفوا على فريق تشيك إن.', 'Meet the Check Inn team.'], n: ['لا صورة لدينا لهذا. يحتاج يوم تصوير.', 'We have no photo of this. It needs a shoot day.'] },
      ],
      panel: {
        job: ['أول صفحة لتشيك إن: دجاج على الفحم وأرز بالدجاج.', 'Check Inn’s first page: charcoal chicken and rice with chicken.'],
        goes: [['ملصقات أطباق: الاسم بالعربية فوق الاسم بالإنجليزية', 'Dish posters: the Arabic name over the English one'], ['السدر للعزائم والتجمعات', 'The sidr for gatherings'], ['صور الزبائن على الطاولة (مثل Public)', 'Guests at the table (like Public)'], ['يوم تصوير: لدينا صور قليلة لتشيك إن', 'A shoot day: we have few photos of Check Inn']],
        rhythm: ['منشوران أسبوعياً.', '2 a week.'],
        tpl: ['ذهبي على أسود، والعينان الكرتونيتان على كل تصميم.', 'Gold on black, with the cartoon eyes on every graphic.'],
        model: { who: ['Shalwa ‏(@shalwa.eatery، فرع واحد، 13,316 متابعاً). ريل علبة التوصيل:', 'Shalwa (@shalwa.eatery, 1 branch, 13,316 followers). Its delivery-box reel:'], num: '74,500', ev: ['مشاهدة (18 أيلول 2026). شعار بلون واحد على لون داكن واحد، والعربية أولاً.', 'views (18 Sep 2026). A one-colour logo on one deep colour, Arabic first.'] },
        fix: [['لا صفحة، ولا موقع على جوجل، و0 منشور مستقل من أصل 100', 'No page, no Google listing, and 0 solo posts in 100'], ['4 أشكال للاسم: Check inn، Check In، تشيك ان، تشيكن إن ← شكل واحد: Check Inn / تشيك إن', '4 spellings: Check inn, Check In, تشيك ان, تشيكن إن → one: Check Inn / تشيك إن']],
        who: ['صفحة جديدة؛ من يديرها يُتفق عليه معكم. الاسم @checkinn.irbid مقترح، ولم نتحقق من توفره.', 'A new page; who runs it is to agree with you. The handle @checkinn.irbid is a suggestion, not checked.'],
        sw: ['#050101', '#DDB158', '#F2D06E'],
        src: ['الصور: لقطات من ريلز @brands_by_seka. الشعار من القصة المثبتة لتشيك إن.', 'Photos: frames from @brands_by_seka reels. The wordmark is from the Check Inn highlight.'],
      },
    },
    {
      id: 'cafe', sec: 'pv-cafe', handle: null, tag: 'pln', addon: false, name: null, short: ['الكافيه', 'Café'],
      kick: ['07 · المطعم والكافيه', '07 · Restaurant and café'], model: ['Somewhere (الافتتاح) + Shalwa', 'Somewhere (opening) + Shalwa'], av: 'cafe', cat: ['مطعم وكافيه', 'Restaurant and café'], counts: ['12', '—', '—'],
      bio: [['مطعم وكافيه في الطابق الأول، @brands_by_seka', 'A restaurant and café on the first floor, @brands_by_seka'], ['📍 إربد، شارع وصفي التل', '📍 Irbid, Wasfi Al-Tal St'], ['🗓 الافتتاح مخطط له في 23–24 تشرين الأول', '🗓 Opening planned for 23–24 Oct']],
      hl: { style: 'cafe', items: [{ t: ['يُحدد', 'To set'] }, { t: ['يُحدد', 'To set'] }, { t: ['يُحدد', 'To set'] }] },
      posts: [
        { k: 'ph', d: 'cafe', reel: true, ph: { i: 'spark', l: ['قريباً', 'Soon'], s: ['تشويق 1', 'Teaser 1'] }, c: ['شي جديد فوق. قريباً.', 'Something new upstairs. Soon.'] },
        { k: 'ph', d: 'cafe', ph: { i: 'name', l: ['الاسم', 'The name'], s: ['كشف الاسم', 'Name reveal'] }, c: ['هاد اسمنا.', 'This is our name.'], n: ['لم يُحدد الاسم بعد.', 'The name is not set yet.'] },
        { k: 'ph', d: 'cafe', reel: true, ph: { i: 'cal', l: ['ليلة الافتتاح', 'Opening night'], s: ['مخطط لها 23–24 تشرين الأول', 'Planned 23–24 Oct'] }, c: ['ليلة الافتتاح.', 'Opening night.'], n: ['التاريخ مخطط له وغير نهائي.', 'The date is planned, not final.'] },
        { k: 'ph', d: 'cafe', car: true, ph: { i: 'menu', l: ['المنيو', 'The menu'], s: ['كاروسيل', 'Carousel'] }, c: ['المنيو، صفحة صفحة.', 'The menu, page by page.'] },
        { k: 'ph', d: 'cafe', reel: true, ph: { i: 'people', l: ['الفريق', 'The team'], s: ['ريل', 'Reel'] }, c: ['تعرّفوا على الفريق.', 'Meet the team.'] },
        { k: 'ph', d: 'cafe', ph: { i: 'cup', l: ['القهوة', 'The coffee'], s: ['صورة', 'Photo'] }, c: ['قهوتنا.', 'Our coffee.'] },
        { k: 'news', nw: 'cafe', car: true, by: 'brands_by_seka', co: ['cafe'], n: ['بطاقة «أخبار سيكا» من صفحة المجموعة، تُنشر تعاوناً مع صفحة الكافيه.', 'The group’s SEKA NEWS card, posted as a collab with the café page.'] },
        { k: 'ph', d: 'cafe', ph: { i: 'chair', l: ['الجلسات', 'The seating'], s: ['صورة', 'Photo'] }, c: ['وين بتحب تقعد؟', 'Where do you like to sit?'] },
        { k: 'ph', d: 'cafe', car: true, ph: { i: 'camera', l: ['صور الزبائن', 'Guest candids'], s: ['كاروسيل', 'Carousel'] }, c: ['صوركم من الأسبوع.', 'Your photos from the week.'] },
        { k: 'ph', d: 'cafe', ph: { i: 'ball', l: ['سهرات المباريات', 'Match nights'], s: ['تحتاج اشتراك beIN تجارياً', 'Needs a commercial beIN subscription'] }, c: ['ماتش الليلة على الشاشة.', 'Tonight’s match on the screen.'] },
        { k: 'ph', d: 'cafe', ph: { i: 'list', l: ['أول من يعرف', 'First to know'], s: ['قائمة', 'A list'] }, c: ['سجّل بالرابط بالبايو، وكون أول من يعرف بالجديد.', 'Sign up at the link in bio to hear first.'], n: ['مثل «THE EDIT» عند Independent: قائمة للتذوق والجديد.', 'Like Independent’s "THE EDIT": a list for tastings and what is new.'] },
        { k: 'ph', d: 'cafe', reel: true, ph: { i: 'film', l: ['خلف الكواليس', 'Behind the scenes'], s: ['ريل', 'Reel'] }, c: ['التجهيزات قبل الافتتاح.', 'Getting ready before the opening.'] },
      ],
      panel: {
        job: ['صفحة المطعم والكافيه في الطابق الأول، من يوم تحديد الاسم.', 'The page for the first-floor restaurant and café, from the day the name is set.'],
        goes: [['التشويق قبل الافتتاح، وكشف الاسم', 'The teaser before the opening, and the name reveal'], ['ليلة الافتتاح (مخطط لها في 23–24 تشرين الأول)', 'The opening night (planned for 23–24 Oct)'], ['المنيو، والفريق، والقهوة، والجلسات', 'The menu, the team, the coffee, the seating'], ['صور الزبائن، وسهرات المباريات (تحتاج اشتراك beIN تجارياً)', 'Guest photos, and match nights (they need a commercial beIN subscription)']],
        rhythm: ['منشور يومياً في أسبوع الافتتاح، ثم 3 منشورات أسبوعياً.', 'Every day in the opening week, then 3 a week.'],
        tpl: ['يُحدد مع الاسم: الشعار، واللون، والخط. حتى ذلك الحين شكل محايد.', 'Set with the name: the logo, the colour, the type. A neutral look for now.'],
        model: { who: ['Somewhere ‏(@somewhere): في يوم افتتاح فرع العين نشر ريلين:', 'Somewhere (@somewhere): on the Al Ain opening day it posted 2 reels:'], num: '271,000 · 344,000', ev: ['مشاهدة (18 حزيران 2026). ومن Shalwa: شعار بلون واحد على لون داكن واحد.', 'views (18 Jun 2026). From Shalwa: a one-colour logo on one deep colour.'] },
        fix: [['لا شيء عن الطابق الأول على إنستغرام حتى الآن', 'Nothing about the first floor is on Instagram yet'], ['الاسم والشعار والتاريخ النهائي لم تُحدد بعد', 'The name, the logo and the final date are still open']],
        who: ['يُتفق عليه معكم، من يوم تحديد الاسم.', 'To agree with you, from the day the name is set.'],
        sw: null, swNote: ['تُحدد مع الاسم.', 'Set with the name.'],
        src: ['المصدر: مكالمة 16 تشرين الأول. Somewhere: في 18 تشرين الأول 2026.', 'Source: the 16 Oct call. Somewhere: 18 Oct 2026.'],
      },
    },
  ];
  const A = Object.fromEntries(ACCTS.map((a) => [a.id, a]));
  const TAGS = {
    sug: ['اسم مقترح', 'Suggested handle'], addon: ['إضافة', 'Add-on'], warn: ['للتأكيد معكم', 'To confirm with you'], new: ['صفحة جديدة · اسم مقترح', 'New page · suggested handle'], pln: ['اسم يُحدد', 'Name to be set'],
  };
  const TAGS_S = { sug: ['مقترح', 'suggested'], warn: ['للتأكيد', 'to confirm'], new: ['مقترح', 'suggested'], pln: ['يُحدد', 'to set'] };
  const tagHtml = (k, cls = '') => (k ? `<span class="pv-tag ${k} ${cls}">${esc(tx((cls.includes('pv-ntag') ? TAGS_S : TAGS)[k]))}</span>` : '');

  /* ---------- small builders ---------- */
  // handles and hashtags get their own bdi; everything else goes through ctx.rich (bidi-safe for Arabic)
  function fmt(s) {
    return String(s).split(/(⟦[^⟧]+⟧|0\d \d{4} \d{4}|(?<![A-Za-z0-9])@[A-Za-z0-9_.]*[A-Za-z0-9_]|#[\p{L}\p{N}_]+)/u).map((p, i) => {
      if (!(i % 2)) return AR() ? R(p) : esc(p).replace(/[\u0600-\u06FF](?:[\u0600-\u06FF\s]*[\u0600-\u06FF])?/g, (m) => `<bdi>${m}</bdi>`);
      if (p[0] === '⟦') return `<bdi dir="ltr">${fmt(p.slice(1, -1))}</bdi>`;
      if (p[0] === '0') return `<bdi dir="ltr">${esc(p)}</bdi>`;
      return `<bdi class="pv-mn">${esc(p)}</bdi>`;
    }).join('');
  }
  const ciWord = (cls = '') => `<span class="ci-wm ${cls}" aria-hidden="true"><b>Check</b><i>Inn<span class="ci-eyes"><u></u><u></u></span></i></span>`;
  // images start as a blank pixel and load through a small queue as they come near the screen (see the loader below)
  const PIX = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  const img = (file, cls = '', alt = '') => `<img${cls ? ` class="${cls}"` : ''} src="${PIX}" data-src="${IMG(file)}" alt="${esc(alt)}" decoding="async">`;
  const mascot = (cls = '') => img('nashmi-mascot.png', cls);

  function avatar(kind, cls = 'pv-av', ini) {
    switch (kind) {
      case 'seka': return `<span class="${cls} av-seka" aria-hidden="true"><i></i></span>`;
      case 'seka-today': return `<span class="${cls}" aria-hidden="true">${img('av-seka-today.jpg')}</span>`;
      case 'mashhoor': case 'nashmi': case 'meatmoot': return `<span class="${cls}" aria-hidden="true">${img('av-' + kind + '.jpg')}</span>`;
      case 'founder': return `<span class="${cls}" aria-hidden="true">${img('sk-founder.jpg')}</span>`;
      case 'checkinn': return `<span class="${cls} av-ci" aria-hidden="true">${img('av-checkinn.jpg')}</span>`;
      case 'cafe': return `<span class="${cls} av-cafe" aria-hidden="true">L1</span>`;
      default: return `<span class="${cls} av-ini" aria-hidden="true">${esc(ini || '?')}</span>`;
    }
  }
  const whoAv = (h, cls) => avatar(WHO[h] ? WHO[h].av : 'ini', cls, WHO[h] && WHO[h].ini);

  /* ---------- post designs (all sizes in cqw, so one design works as a tile and as the large view) ---------- */
  function brandSlot(b) {
    if (b === 'floor') return `<span class="nc-tx">${AR() ? 'الطابق الأول' : 'FIRST FLOOR'}</span>`;
    if (b === 'four') return `<span class="nc-avs">${['mashhoor', 'meatmoot', 'nashmi'].map((k) => img('av-' + k + '.jpg')).join('')}<i class="nc-ci">${ciWord()}</i></span>`;
    if (b === 'checkinn') return `<span class="nc-ciw">${ciWord()}</span>`;
    if (b === 'meatmoot') return img('meatmoot-mark.png', 'nc-mm');
    return '';
  }
  function newsCard(key, slide) {
    const nw = NEWS[key], ar = AR();
    const body = slide
      ? `<p class="nc-s${ar ? ' ar' : ''}">${fmt(tx(nw.s2))}</p>`
      : `<p class="nc-h${ar ? ' ar' : ''}">“${R(tx(nw.h))}”</p>`;
    return `<div class="nc">${img(nw.img)}<div class="nc-t">${body}<span class="nc-ed">${nw.ed || EDITION}</span></div>
      <div class="nc-f"><i class="nc-logo"></i><span class="nc-stamp">SEKA NEWS<small>أخبار سيكا</small></span><span class="nc-br">${brandSlot(nw.brand)}</span></div></div>`;
  }
  const L2 = (ar, en) => (AR() ? ar : en);
  function card(p) {
    const ar = AR();
    switch (p.d) {
      case 'mash-drop': return `<div class="d-mash y"><i class="mash-mk"></i><b class="big${ar ? ' ar' : ''}">${ar ? 'صوصات<br>مشهور' : 'SAUCE<br>DROP'}</b><span class="sm">DROP 01 · IRBID</span></div>`;
      case 'mash-poll': return `<div class="d-mash r"><i class="mash-mk"></i><b class="big mid${ar ? ' ar' : ''}">${ar ? 'أي صوص؟' : 'WHICH<br>SAUCE?'}</b><span class="mash-dots">${[['#FFC72C', 'جبنة', 'CHEESE'], ['#F4EEDF', 'ثوم', 'GARLIC'], ['#9E1218', 'كاتشب', 'KETCHUP']].map(([c, a, e]) => `<span><i style="background:${c}"></i>${ar ? a : e}</span>`).join('')}</span><span class="sm${ar ? ' ar' : ''}">${ar ? 'جاوب بالتعليقات' : 'ANSWER IN THE COMMENTS'}</span></div>`;
      case 'mash-app': return `<div class="d-mash r"><i class="mash-mk"></i><b class="big mid${ar ? ' ar' : ''}">${ar ? 'حمّل<br>تطبيق<br>مشهور' : 'GET<br>THE<br>APP'}</b><span class="sm${ar ? ' ar' : ''}">${ar ? 'واطلب من أقرب فرع' : 'ORDER FROM YOUR BRANCH'}</span></div>`;
      case 'mash-city': return `<div class="d-mash r"><i class="mash-mk"></i><b class="big huge${ar ? ' ar' : ''}">${ar ? 'إربد' : 'IRBID'}</b><span class="sm${ar ? ' ar' : ''}">${ar ? 'شارع وصفي التل' : 'WASFI AL-TAL ST'}</span></div>`;
      case 'mm-ed': return `<div class="d-mm">${img('meatmoot-mark.png', 'mm-pl')}<span class="mono">SHOULDER</span><span class="mono">EDITION</span><i class="rule"></i><span class="mm-ar">كتف الخاروف</span><span class="no">01</span></div>`;
      case 'mm-world': return `<div class="d-mm"><span class="mono">OUR</span><span class="mono">WORLD</span><i class="rule"></i><span class="mono sm">TÜRKİYE · JORDAN · USA</span><span class="mm-ar">تركيا · الأردن · أمريكا</span></div>`;
      case 'mm-lets': return `<div class="d-mm gold">${img('meatmoot-mark.png', 'mm-pl dk')}<span class="pf"><bdi dir="ltr">#Lets_Meat</bdi></span><i class="rule dk"></i></div>`;
      case 'na-match': return `<div class="d-na"><i class="na-strip"></i>${mascot('na-masc')}<b class="na-cal">يوم الماتش؟</b><span class="na-sub">نشمي معك</span>${ar ? '' : '<span class="na-en">MATCH DAY? NASHMI IS WITH YOU</span>'}</div>`;
      case 'na-menu': return `<div class="d-na red"><i class="na-strip bot"></i><span class="na-badge">${mascot()}</span><b class="na-cal sm">شاورما لحم<br>كباب<br>شيش · عرايس</b>${ar ? '' : '<span class="na-en">BEEF SHAWARMA · KEBAB · SHISH · ARAYES</span>'}</div>`;
      case 'na-code': return `<div class="d-na pat"><div class="na-panel">${mascot('na-masc sm')}<b class="na-cal sm">يوم الماتش؟</b><span class="na-codebox">${esc(tx(['[الكود]', '[CODE]']))}</span><span class="na-sub sm">${esc(tx(['[النسبة] على [الأصناف]', '[percent] off [items]']))}</span><span class="na-en">${esc(tx(['[التاريخ]', '[DATE]']))}</span></div></div>`;
      case 'na-face': return `<div class="d-na pat"><span class="na-round">${mascot()}</span><span class="na-pill"><i></i><em>${esc(tx(p.pill || ['', '']))}</em></span></div>`;
      case 'na-order': return `<div class="d-na red"><i class="na-strip bot"></i><span class="na-badge lg">${mascot()}</span><b class="na-cal">اطلب الآن</b><span class="na-ph"><bdi dir="ltr">${esc(p.ph || PHONE)}</bdi></span>${ar ? '' : '<span class="na-en">ORDER NOW</span>'}</div>`;
      case 'ci-hello': return `<div class="d-ci">${ciWord('xl')}<i class="rule"></i><b class="ci-ar">صار إلنا صفحة</b><span class="ci-en">OUR OWN PAGE</span></div>`;
      case 'ci-poster': return `<div class="d-ci"><span class="ci-eyes sm"><u></u><u></u></span><b class="ci-ar lg">${esc(p.txt[0])}</b><i class="rule"></i><span class="ci-en">${esc(p.txt[1])}</span></div>`;
      case 'ci-eyes': return `<div class="d-ci gold"><span class="ci-big"><u></u><u></u></span><b class="ci-ar">دجاج ع الفحم</b><span class="ci-en">CHARCOAL CHICKEN</span></div>`;
      case 'ci-sidr': return `<div class="d-ci"><b class="ci-ar lg">سدر جاج</b><span class="ci-ar sm">للعزايم واللمّات</span><span class="ci-chips"><i>1</i><i>2</i><i>3</i></span><span class="ci-en">CHICKEN SIDR · FOR GATHERINGS</span></div>`;
      case 'ci-talabat': return `<div class="d-ci gold">${ciWord('md')}<b class="ci-ar">اطلب على طلبات</b><span class="ci-en">ORDER ON TALABAT</span></div>`;
      default: console.warn('pages view: unknown card design', p.d); return '';
    }
  }
  function overlay(p) {
    switch (p.d) {
      case 'mash': return `<span class="mash-tag"><i></i></span><i class="mash-strip"></i>`;
      case 'mm': return `<span class="mm-lab">${esc(p.lab || '')}</span>`;
      case 'na': return `<i class="na-strip bot"></i><span class="na-badge corner">${mascot()}</span>`;
      case 'ci': return `<span class="ci-bar">${ciWord()}</span>`;
      case 'film': return `<span class="film-tag">${esc(tx(['يُصوَّر', 'TO FILM']))}</span>`;
      default: return '';
    }
  }
  function placeholder(p) {
    const ph = p.ph || {};
    return `<div class="d-ph ${p.d}">${ico(ph.i || 'camera')}<b class="l">${esc(tx(ph.l))}</b>${ph.s ? `<span class="s">${fmt(tx(ph.s))}</span>` : ''}${p.d === 'cafe' ? `<span class="s nm">${esc(tx(['اسم يُحدد', 'NAME TO BE SET']))}</span>` : ''}</div>`;
  }
  function design(p, slide = 0) {
    if (p.k === 'today') return img(p.im, 'pv-ph');
    if (p.k === 'news') return newsCard(p.nw, slide);
    if (p.k === 'card') return card(p);
    if (p.k === 'ph') return placeholder(p);
    return `${img(p.im, 'pv-ph')}${overlay(p)}`;
  }

  /* ---------- posts: keys, captions, labels ---------- */
  const keyOf = (a, v, i) => `${a}:${v}:${i}`;
  function getPost(key) {
    const [a, v, i] = key.split(':');
    const acct = A[a]; if (!acct) return null;
    const list = v === 'today' ? TODAY_POSTS : acct.posts;
    const p = list[+i]; if (!p) return null;
    return { acct, view: v, i: +i, p, by: p.by || (v === 'today' ? 'brands_by_seka' : acct.handle || 'cafe') };
  }
  function placeOf(o) {
    const p = o.p, a = o.acct.id;
    if (p.k === 'news') return NEWS[p.nw].place || null;
    if (['group', 'checkinn', 'cafe'].includes(a)) return null;
    if ((p.im && /^(p|f)-/.test(p.im)) || (p.co || []).includes('brands_by_seka') || o.by === 'brands_by_seka') return null;
    return PLACE[a] || null;   // null = Irbid
  }
  function postCaption(o) {
    const p = o.p;
    if (p.k === 'today') return p.cap.replace(/[\u2066-\u2069]/g, '');
    const c = p.k === 'news' ? tx(NEWS[p.nw].c) : tx(p.c || ['', '']);
    const ph = PHRASES[p.k === 'news' ? 'group' : o.acct.id] || PHRASES.group;
    const pl = placeOf(o);
    return `${c}\n\n${pl ? '📍 ' + tx(pl) : tx(LOC)}\n\n${tx(ph)}`;
  }
  function postLabel(o) {
    const p = o.p;
    const kind = p.k === 'news' ? 'SEKA NEWS' : p.reel ? tx(['ريل', 'Reel']) : p.car ? tx(['كاروسيل', 'Carousel']) : p.k === 'ph' ? tx(['مخطط', 'Planned']) : tx(['منشور', 'Post']);
    let first = p.k === 'today' ? (p.g || tx(['منشور', 'Post'])) : p.k === 'news' ? tx(NEWS[p.nw].h) : p.k === 'ph' ? tx(p.ph.l) : tx(p.c || ['', '']).split(/[.؟?!]/)[0];
    if (p.k === 'today' && AR()) first = tx(p.n).split('.')[0];
    return `${kind}${o.i != null ? ` ${o.i + 1}` : ''}: ${first}`;
  }

  /* ---------- the phone ---------- */
  function tile(o) {
    const p = o.p, key = keyOf(o.acct.id, o.view, o.i);
    const icons = [p.reel ? IG.reel : p.car || p.k === 'news' ? IG.car : '', (p.co && p.co.length) || o.by !== (o.acct.handle || 'cafe') ? IG.collab : ''].filter(Boolean);
    const mk = (p.mk || []).map((m) => `<span class="pv-mk${m.ok ? ' ok' : ''}">${esc(tx(m.t))}</span>`).join('');
    const hov = p.k === 'today' ? `<span class="pv-hov" aria-hidden="true"><span>♥ ${p.likes}</span><span>💬 ${p.comments}</span></span>` : `<span class="pv-hov" aria-hidden="true"><span>${esc(tx(['افتح', 'Open']))}</span></span>`;
    return `<button type="button" class="pv-t" data-post="${key}" aria-label="${esc(postLabel(o))}"><span class="pv-cq">${design(p)}</span>${icons.length ? `<span class="pv-ics">${icons.join('')}</span>` : ''}${mk ? `<span class="pv-mks">${mk}</span>` : ''}${hov}</button>`;
  }
  function highlights(a, view) {
    if (view === 'today') {
      return a.today.hl.map((t, i) => `<div class="pv-hl"><i>${img(`hl-today-${i + 1}.jpg`)}</i><span dir="auto">${esc(t)}</span></div>`).join('');
    }
    return a.hl.items.map((h) => {
      let inner;
      if (h.av) inner = avatar(h.av, 'hl-av');
      else if (h.tx) inner = `<span class="hl-tx">${esc(h.tx)}</span>`;
      else if (h.ic) inner = ico(h.ic);
      else inner = `<span class="hl-empty">${ico('plus')}</span>`;
      return `<div class="pv-hl hs-${a.hl.style}"><i>${inner}</i><span>${esc(tx(h.t))}</span></div>`;
    }).join('');
  }
  function phone(a, view) {
    const today = view === 'today';
    const posts = today ? TODAY_POSTS : a.posts;
    const counts = today ? a.today.counts : a.counts;
    const nav = a.handle
      ? `<span class="h"><bdi dir="ltr">${esc(a.handle)}</bdi></span>${today ? '' : tagHtml(a.tag, 'pv-ntag')}`
      : `<span class="h">${esc(tx(['اسم يُحدد', 'Name to be set']))}</span>${tagHtml('pln', 'pv-ntag')}`;
    const name = today ? `<span class="pv-mk inl">${esc(tx(['حقل الاسم فارغ', 'Name field empty']))}</span>` : `<b dir="auto">${esc(a.name || tx(['اسم يُحدد', 'Name to be set']))}</b>`;
    const bio = today ? a.today.bio.map((l) => `<div dir="ltr">${fmt(l)}</div>`).join('') : a.bio.map((l) => `<div dir="auto">${fmt(tx(l))}</div>`).join('');
    const link = today ? a.today.link : a.link;
    const av = today ? avatar('seka-today') : avatar(a.av);
    return `<div class="pv-phone"><div class="pv-scr" dir="${AR() ? 'rtl' : 'ltr'}" lang="${LANG}">${STATUSBAR}
      <div class="pv-nav">${IG.back}${nav}<span class="sp"></span>${IG.bell}${IG.dots}</div>
      <div class="pv-pf"><div class="pv-top">${av}<div class="pv-stats"><div class="pv-nm">${name}</div>
        <div class="pv-cnt"><div><b>${counts[0]}</b><span>${esc(tx(['منشور', 'posts']))}</span></div><div><b>${counts[1]}</b><span>${esc(tx(['متابِع', 'followers']))}</span></div><div><b>${counts[2]}</b><span>${esc(tx(['يتابع', 'following']))}</span></div></div></div></div>
        ${today ? '' : `<div class="pv-cat">${esc(tx(a.cat))}</div>`}<div class="pv-bio">${bio}</div>
        ${link ? `<div class="pv-lnk">${IG.link}<span dir="auto">${esc(tx(link))}</span></div>` : ''}
        <div class="pv-btns" aria-hidden="true"><span class="f">${esc(tx(['متابعة', 'Follow']))}</span><span>${esc(tx(['مراسلة', 'Message']))}</span><span>+</span></div></div>
      <div class="pv-hls">${highlights(a, view)}</div>
      <div class="pv-tabs" aria-hidden="true"><span class="on">${IG.grid}</span><span>${IG.reels}</span><span>${IG.tagged}</span></div>
      <div class="pv-grid" role="group" aria-label="${esc(tx(['المنشورات', 'Posts']))}">${posts.map((p, i) => tile({ acct: a, view: today ? 'today' : 'prop', i, p, by: p.by || (today ? 'brands_by_seka' : a.handle || 'cafe') })).join('')}</div>
      <div class="pv-home" aria-hidden="true"><i></i></div></div></div>`;
  }

  /* ---------- side panels ---------- */
  const row = (label, body) => `<div class="pv-row"><dt>${esc(tx(label))}</dt><dd>${body}</dd></div>`;
  const list = (items) => `<ul>${items.map((x) => `<li>${fmt(tx(x))}</li>`).join('')}</ul>`;
  function swatches(sw, note) {
    if (!sw) return `<span class="pv-muted">${esc(tx(note))}</span>`;
    return `<div class="pv-sw">${sw.map((c) => `<span><i style="background:${c}"></i><bdi dir="ltr">${c}</bdi></span>`).join('')}</div>${note ? `<p class="pv-muted">${esc(tx(note))}</p>` : ''}`;
  }
  function panel(a) {
    const P = a.panel, m = P.model;
    return `<dl class="pv-pan">
      ${P.plan ? row(['في الخطة', 'In the plan'], `<p>${fmt(tx(P.plan))}</p>`) : ''}
      ${row(['وظيفة الصفحة', 'The page’s job'], `<p>${fmt(tx(P.job))}</p>`)}
      ${row(['ما يُنشر عليها', 'What goes on it'], list(P.goes))}
      ${row(P.plan ? ['الإيقاع المقترح للصفحة', 'Suggested rhythm for the page'] : ['الإيقاع', 'Rhythm'], `<p>${fmt(tx(P.rhythm))}</p>`)}
      ${row(['قالب المنشور', 'Post template'], `<p>${fmt(tx(P.tpl))}</p>`)}
      ${row(['الألوان', 'Colours'], swatches(P.sw, P.swNote))}
      ${row(['النموذج من Independent', 'The Independent model'], `<p>${fmt(tx(m.who))}</p><p class="pv-ev"><b><bdi dir="ltr">${esc(m.num)}</bdi></b><span>${fmt(tx(m.ev))}</span></p>`)}
      ${row(['ما نصلحه', 'What we fix'], list(P.fix))}
      ${row(['من يدير الصفحة', 'Who runs it'], `<p>${fmt(tx(P.who))}</p>`)}
    </dl><p class="pv-src">${fmt(tx(P.src))}</p>`;
  }
  function todayPanel() {
    const stats = [
      ['17,502', ['متابعاً على @brands_by_seka', 'followers on @brands_by_seka'], ''],
      ['4', ['إعجابات: الوسيط في أحدث 100 منشور', 'likes, the median of the 100 newest posts'], 'hot'],
      ['81/100', ['منشوراً بلا أي تعليق', 'posts with 0 comments'], 'hot'],
      ['47', ['منشوراً تنتهي بـ #Amman (والحساب في إربد)', 'posts end with #Amman (an Irbid account)'], 'hot'],
      ['5', ['منشورات فيها «SERA» (ليست من علاماتكم)', 'posts say "SERA" (not one of your brands)'], 'hot'],
      ['0', ['ريلز في تشرين الأول حتى الآن (آخر ريل 25 أيلول)', 'reels in October so far (the last one: 25 Sep)'], ''],
    ];
    const top = [['f-friends.jpg', '794', ['صديقتان في مشهد تمثيلي', 'Two friends, a skit']], ['p-spit.jpg', '467', ['تعاون مع @thefoodies.jo', 'Collab, @thefoodies.jo']], ['p-bucketgirl.jpg', '388', ['فتاة تأكل من سطل مشهور', 'A woman eats a Mashhoor bucket']], ['p-fire.jpg', '376', ['تعاون مع @sui7asan', 'Collab, @sui7asan']]];
    const probs = [
      ['الاسم بثلاثة أشكال: Brands by Seka، Brand by Seka، BRAND BY SEKA', 'The name in 3 forms: Brands by Seka, Brand by Seka, BRAND BY SEKA'],
      ['تشيك إن لم يظهر وحده أبداً (0 من 100)', 'Check Inn never on its own (0 of 100)'],
      ['شعار مشهور الأحمر على خلفية حمراء (منشوران)', 'The red Mashhoor logo on a red background (2 posts)'],
      ['مبالغات في المنشورات، مثل «ما في أطيب منه!» (13 تشرين الأول)', 'Superlatives in the posts, such as "nothing tastier" (13 Oct)'],
      ['«الخميس 6/7/2026» على ملصق، و6 تموز كان يوم اثنين', '"Thursday 6/7/2026" on a poster; 6 Jul was a Monday'],
    ];
    return `<div class="pv-today">
      <div class="pv-stats-g">${stats.map(([n, l, h]) => `<div class="pv-stat ${h}"><b><bdi dir="ltr">${n}</bdi></b><span>${fmt(tx(l))}</span></div>`).join('')}</div>
      <h3 class="pv-h3">${esc(tx(['ما ينجح: ريلز فيها أشخاص', 'What works: reels with people']))}</h3>
      <p class="pv-p">${esc(tx(['المنشورات الأربعة التي تجاوزت 300 إعجاب كلها ريلز فيها أشخاص. صور المنتج منذ حزيران: وسيط 1.5 إعجاب.', 'The 4 posts over 300 likes are all reels with people. Product photos since June: median 1.5 likes.']))}</p>
      <div class="pv-top4">${top.map(([im, n, l]) => `<figure>${img(im, '', tx(l))}<figcaption><b><bdi dir="ltr">${n}</bdi> ♥</b><span>${fmt(tx(l))}</span></figcaption></figure>`).join('')}</div>
      <h3 class="pv-h3">${esc(tx(['مشكلات أخرى', 'Other problems']))}</h3>
      <ul class="pv-probs">${probs.map((x) => `<li>${fmt(tx(x))}</li>`).join('')}</ul>
      <p class="pv-src">${fmt(tx(['المصدر: @brands_by_seka، أحدث 100 من 116 منشوراً، والأرقام في 18 تشرين الأول 2026. اضغط على أي منشور لترى نصه وأرقامه.', 'Source: @brands_by_seka, the 100 newest of 116 posts, counts on 18 Oct 2026. Tap any post to see its caption and numbers.']))}</p>
    </div>`;
  }

  /* ---------- sections ---------- */
  function intro() {
    const kids = ACCTS.filter((a) => a.id !== 'group');
    const node = (a, root) => `<a class="pv-node${root ? ' root' : ''}" href="#${a.sec}" data-go="${a.id}">${avatar(a.id === 'group' ? 'seka' : a.av, 'pv-nav-av')}
      <span class="pv-nb"><b dir="auto">${esc(a.name ? (a.id === 'group' ? a.name : tx(a.short)) : tx(['المطعم والكافيه', 'Restaurant and café']))}</b>
      <span class="pv-nh">${a.handle ? `<bdi dir="ltr">@${esc(a.handle)}</bdi>` : ''}${a.fol ? ` · <bdi dir="ltr">${a.fol}</bdi>` : ''} ${a.id === 'group' ? '' : tagHtml(a.tag)}${a.addon ? tagHtml('addon', 'pv-add') : ''}</span>
      <span class="pv-nm2">${esc(tx(['النموذج: ', 'Model: ']))}<bdi dir="ltr">${esc(tx(a.model))}</bdi></span></span></a>`;
    return `<section id="pv-intro" class="sec pv-sec" data-label="${esc(tx(['الصفحات', 'The pages']))}"><div class="wrap">
      <span class="pv-kick">${esc(tx(['إنستغرام · 7 صفحات', 'Instagram · 7 pages']))}</span>
      <h2>${esc(tx(['شكل الصفحات', 'The pages']))}</h2>
      <p class="sub">${fmt(tx(['Brands by SEKA بيت علامات السيكا: صفحة للمجموعة للأخبار والأشخاص، وصفحة لكل علامة بشكلها الخاص. هكذا تعمل ⟦Independent Food Co.⟧ في دبي: 54,328 متابعاً لصفحة المجموعة، و7 علامات.', 'Brands by SEKA is SEKA’s brand house: one group page for news and people, and one page for each brand with its own look. Independent Food Co. works this way in Dubai: 54,328 followers on the group page, and 7 brands.']))}</p>
      <p class="pv-note-l">${esc(tx(['منشورات تجريبية. الصور من حسابات العلامات على إنستغرام.', 'Sample posts. The photos are from the brands’ Instagram accounts.']))}</p>
      <nav class="pv-map" id="pv-map" aria-label="${esc(tx(['الحسابات', 'Accounts']))}">${node(A.group, true)}<div class="pv-kids">${kids.map((a) => node(a)).join('')}</div></nav>
    </div></section>`;
  }
  function head(a, extra = '') {
    const title = a.id === 'group' ? 'Brands by SEKA' : a.id === 'cafe' ? tx(['المطعم والكافيه', 'Restaurant and café']) : tx(a.short);
    return `<div class="pv-head"><div><span class="pv-kick">${esc(tx(a.kick))}</span><h2 tabindex="-1" dir="auto">${esc(title)} ${a.id === 'group' ? '' : tagHtml(a.tag, 'pv-htag')}${a.addon ? tagHtml('addon', 'pv-htag pv-add') : ''}</h2>
      <p class="pv-hsub">${a.handle ? `<bdi dir="ltr">@${esc(a.handle)}</bdi> · ` : ''}${a.fol ? `<bdi dir="ltr">${a.fol}</bdi> ${esc(tx(['متابعاً', 'followers']))} · ` : ''}${esc(tx(['النموذج: ', 'Model: ']))}<bdi dir="ltr">${esc(tx(a.model))}</bdi></p></div>${extra}</div>`;
  }
  function groupInner() {
    const a = A.group, today = ST.mode === 'today';
    const seg = `<div class="pv-seg" role="group" aria-label="${esc(tx(['اليوم أو المقترح', 'Today or proposed']))}"><button type="button" data-mode="today" aria-pressed="${today}">${esc(tx(['اليوم', 'Today']))}</button><button type="button" data-mode="proposed" aria-pressed="${!today}">${esc(tx(['المقترح', 'Proposed']))}</button></div>`;
    return `<div class="wrap">${head(a, seg)}
      <div class="pv-acct"><div class="pv-phone-col">${phone(a, today ? 'today' : 'prop')}<p class="pv-pnote">${fmt(today ? tx(['الصفحة كما كانت في 18 تشرين الأول 2026. العلامات الحمراء مشكلات، والخضراء ما ينجح.', 'The page as it was on 18 Oct 2026. Red markers are problems; green ones work.']) : tx(a.pnote))}</p></div>
      <div class="pv-side">${today ? todayPanel() : panel(a)}</div></div></div>`;
  }
  function groupSec() {
    return `<section id="pv-group" class="sec pv-sec" data-label="${esc(tx(['المجموعة', 'Group']))}">${groupInner()}</section>`;
  }
  function newsSec() {
    const four = [1, 4, 7];
    const legend = [
      ['صورة العلامة نفسها، تملأ البطاقة.', 'The brand’s own photo, full bleed.'],
      ['تدرّج أسود على النصف السفلي، ليُقرأ العنوان.', 'A black gradient on the lower half, so the headline reads.'],
      ['عنوان قصير بين علامتي اقتباس: بالعربية للقصص العربية، وبأحرف كبيرة للقصص الإنجليزية.', 'A short quoted headline: Arabic for Arabic stories, all caps for English ones.'],
      ['سطر الإصدار تحت العنوان: ⟦IRBID EDITION ’26⟧.', 'The edition line under the headline: ⟦IRBID EDITION ’26⟧.'],
      ['التذييل: شعار سيكا، وختم «SEKA NEWS»، وشعار العلامة.', 'The footer: the SEKA logo, the SEKA NEWS stamp, and the brand’s mark.'],
      ['الشريحة 2 وما بعدها: الصورة والتذييل نفسهما، والقصة بجمل عادية.', 'Slides 2+: the same photo and footer, the story in sentence case.'],
    ];
    const spots = [[1, 18], [2, 50], [3, 70], [4, 84.5], [5, 95]];
    return `<section id="pv-news" class="sec pv-sec" data-label="${esc(tx(['أخبار سيكا', 'SEKA NEWS']))}"><div class="wrap">
      <div class="pv-head"><div><span class="pv-kick">${esc(tx(['02 · قالب الأخبار', '02 · The news card']))}</span><h2 tabindex="-1">SEKA NEWS</h2>
      <p class="pv-hsub">${fmt(tx(['على طريقة INDEPENDENT NEWS: بطاقة لكل خبر، والعلامة هي البطل.', 'The INDEPENDENT NEWS way: one card for each story, with the brand as the hero.']))}</p></div></div>
      <div class="pv-news-grid">
        <figure class="pv-big"><div class="pv-stage-w"><div class="pv-stage pv-cq">${newsCard('cafe', 0)}</div>${spots.map(([n, t]) => `<span class="pv-hot" style="top:${t}%" aria-hidden="true">${n}</span>`).join('')}</div><figcaption>${esc(tx(['الشريحة 1', 'Slide 1']))}</figcaption></figure>
        <figure class="pv-big"><div class="pv-stage-w"><div class="pv-stage pv-cq">${newsCard('cafe', 1)}</div><span class="pv-hot" style="top:50%" aria-hidden="true">6</span></div><figcaption>${esc(tx(['الشريحة 2', 'Slide 2']))}</figcaption></figure>
        <ol class="pv-legend">${legend.map((l, i) => `<li><i>${i + 1}</i><span>${fmt(tx(l))}</span></li>`).join('')}</ol>
      </div>
      <h3 class="pv-h3">${esc(tx(['البطاقات الثلاث في شبكة المجموعة', 'The 3 cards in the group grid']))}</h3>
      <div class="pv-four">${four.map((i) => { const p = A.group.posts[i], nw = NEWS[p.nw]; return `<div class="pv-fc"><button type="button" class="pv-t pv-t4" data-post="${keyOf('group', 'prop', i)}" aria-label="${esc('SEKA NEWS: ' + tx(nw.h))}"><span class="pv-cq">${newsCard(p.nw, 0)}</span><span class="pv-hov" aria-hidden="true"><span>${esc(tx(['افتح', 'Open']))}</span></span></button><span class="pv-tag ${p.nw === 'checkinn' ? 'sug' : 'pln'}">${esc(tx(nw.st))}</span><p>${fmt(tx(nw.why))}</p></div>`; }).join('')}</div>
    </div></section>`;
  }
  function acctSec(a) {
    const warn = a.warn ? `<div class="pv-warn" role="note">${tagHtml('warn')}<p>${fmt(tx(a.warn))}</p></div>` : '';
    return `<section id="${a.sec}" class="sec pv-sec" data-label="${esc(tx(a.short))}"><div class="wrap">${head(a)}${warn}
      <div class="pv-acct"><div class="pv-phone-col">${phone(a, 'prop')}</div><div class="pv-side">${panel(a)}</div></div></div></section>`;
  }
  function endRow() {
    return `<div class="pv-end"><div class="wrap"><b>${esc(tx(['ما تشمله كل خطة', 'What each plan covers']))}</b><button type="button" class="pv-endbtn" data-view="proposal" data-goto="plans">${esc(tx(['الخطط والأسعار', 'Plans and fees']))} <span aria-hidden="true">${AR() ? '←' : '→'}</span></button></div></div>`;
  }
  function bar() {
    return `<nav class="pv-bar" aria-label="${esc(tx(['الحسابات', 'Accounts']))}" inert><div class="pv-bar-in">${ACCTS.map((a) => `<a href="#${a.sec}" data-go="${a.id}">${avatar(a.id === 'group' ? 'seka' : a.av, 'pv-bar-av')}<span>${esc(a.id === 'group' ? 'SEKA' : tx(a.short))}</span></a>`).join('')}</div></nav>`;
  }

  /* ---------- the post view (dialog) ---------- */
  let lastFocus = null;
  function modalHtml(open) {
    const o = getPost(open.key); if (!o) return '';
    const p = o.p, today = p.k === 'today', slides = p.k === 'news' ? 2 : 1, s = Math.min(open.slide || 0, slides - 1);
    const by = o.by, co = (p.co || []).filter((h) => h !== by);
    const names = [by, ...co].map((h) => `<bdi dir="${WHO[h] && WHO[h].name ? 'auto' : 'ltr'}">${esc(whoName(h))}</bdi>`).join(AR() ? ' و ' : ' and ');
    const loc = today ? `<span class="pv-m-loc warn">${esc(tx(['بلا وسم موقع', 'No location tag']))}</span>` : `<span class="pv-m-loc">${esc(tx(placeOf(o) || ['إربد، الأردن', 'Irbid, Jordan']))}</span>`;
    const media = today
      ? img(p.im, `pv-m-img${p.reel ? ' contain' : ''}`, p.g || postLabel(o))
      : `<span class="pv-cq pv-m-cq${p.lo ? ' lo' : ''}" dir="${AR() ? 'rtl' : 'ltr'}">${design(p, s)}</span>`;
    const dots = slides > 1 ? `<button type="button" class="pv-sl pv-prev" data-slide="-1" aria-label="${esc(tx(['الشريحة السابقة', 'Previous slide']))}" ${s === 0 ? 'disabled' : ''}>${AR() ? IG.next : IG.prev}</button><button type="button" class="pv-sl pv-nxt" data-slide="1" aria-label="${esc(tx(['الشريحة التالية', 'Next slide']))}" ${s === slides - 1 ? 'disabled' : ''}>${AR() ? IG.prev : IG.next}</button><span class="pv-dots" aria-hidden="true">${Array.from({ length: slides }, (_, i) => `<i class="${i === s ? 'on' : ''}"></i>`).join('')}</span>` : '';
    const capDir = today ? 'rtl' : AR() ? 'rtl' : 'ltr';
    const cap = postCaption(o).replace(/#Amman/g, '\u0000');
    const capHtml = fmt(cap).replace(/\u0000/g, '<mark class="pv-bad"><bdi dir="ltr">#Amman</bdi></mark>');
    const note = p.k === 'news' ? `${tx(p.n || ['', ''])} ${tx(NEWS[p.nw].why)}` : tx(p.n || ['', '']);
    const meta = today
      ? `<b><bdi dir="ltr">${p.likes}</bdi> ${esc(tx(['إعجاب', p.likes === 1 ? 'like' : 'likes']))} · <bdi dir="ltr">${p.comments}</bdi> ${esc(tx(['تعليق', p.comments === 1 ? 'comment' : 'comments']))}</b><span><bdi dir="ltr">${p.date}</bdi> · ${esc(tx(['الأرقام في 18 تشرين الأول 2026', 'counts on 18 Oct 2026']))}</span>`
      : `<b>${esc(tx(['منشور تجريبي: بلا أرقام', 'A sample post: no numbers']))}</b>`;
    return `<div class="pv-m-bg" data-close></div>
      <div class="pv-m-box${today ? ' t45' : ''}" role="dialog" aria-modal="true" aria-labelledby="pv-m-title" data-lenis-prevent>
        <div class="pv-m-media" dir="ltr">${media}${dots}</div>
        <div class="pv-m-info" dir="${AR() ? 'rtl' : 'ltr'}" lang="${LANG}">
          <div class="pv-m-hd">${whoAv(by, 'pv-m-av')}<div class="pv-m-who"><b id="pv-m-title">${names}</b>${loc}</div>
            <span class="pv-tag ${today ? 'warn' : 'pln'}">${esc(today ? tx(['اليوم', 'Today']) : tx(['مثال', 'Sample']))}</span>
            <button type="button" class="pv-x" data-close aria-label="${esc(tx(['إغلاق', 'Close']))}">${IG.x}</button></div>
          <div class="pv-m-body"><div class="pv-cap" dir="${capDir}" lang="${today ? 'ar' : LANG}"><bdi class="pv-cap-h" dir="ltr">${esc(by === 'cafe' ? '' : by)}</bdi> ${capHtml}</div>
            ${today && !AR() && p.g ? `<p class="pv-gloss">${esc('In English: ' + p.g)}</p>` : ''}
            ${note.trim() ? `<div class="pv-note"><b>${esc(tx(['ملاحظة', 'Note']))}</b>${fmt(note)}</div>` : ''}</div>
          <div class="pv-m-ft"><div class="pv-m-acts" aria-hidden="true">${IG.heart}${IG.comment}${IG.send}<span class="sp"></span>${IG.save}</div><div class="pv-m-meta">${meta}</div></div>
        </div></div>`;
  }
  function lockScroll(on) {
    const L = window.MM && window.MM.lenis;
    if (L) { on ? L.stop() : L.start(); }
    document.documentElement.classList.toggle('pv-lock', on);
  }
  // builds the dialog for `open` ({ key, slide }); returns false (and logs) when the post cannot be shown
  function showModal(open, focusClose) {
    const m = ROOT && ROOT.querySelector('.pv-m'); if (!m || !open) return false;
    let html = '';
    try { html = modalHtml(open); } catch (e) { console.error('pages view: post could not be drawn', open.key, e); }
    if (!html) { if (!getPost(open.key)) console.error('pages view: no post for', open.key); return false; }
    ST.open = open;
    m.innerHTML = html; m.hidden = false; lockScroll(true); loadNow(m);
    if (focusClose) { const x = m.querySelector('.pv-x'); if (x) x.focus({ preventScroll: true }); }
    return true;
  }
  function openPost(key, from) {
    lastFocus = from || document.activeElement;
    if (!showModal({ key, slide: 0 }, true)) lastFocus = null;
  }
  function closeModal(restore = true) {
    const m = ROOT && ROOT.querySelector('.pv-m');
    const key = ST.open && ST.open.key;
    ST.open = null;
    if (m) { m.hidden = true; m.innerHTML = ''; }
    lockScroll(false);
    if (restore) {
      const t = (lastFocus && document.contains(lastFocus)) ? lastFocus : key && ROOT && ROOT.querySelector(`[data-post="${key}"]`);
      if (t && t.focus) t.focus({ preventScroll: true });
    }
    lastFocus = null;
  }
  function slide(d) {
    if (!ST.open) return;
    const o = getPost(ST.open.key); const n = o && o.p.k === 'news' ? 2 : 1;
    const s = Math.max(0, Math.min(n - 1, (ST.open.slide || 0) + d));
    if (s === ST.open.slide) return;
    const had = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.slide : null;
    if (!showModal({ key: ST.open.key, slide: s }, false)) return;
    const live = document.getElementById('pv-live'); if (live) live.textContent = `${tx(['الشريحة', 'Slide'])} ${s + 1} / ${n}`;
    const m = ROOT.querySelector('.pv-m');
    const b = (had && m.querySelector(`[data-slide="${had}"]:not([disabled])`)) || m.querySelector('[data-slide]:not([disabled])') || m.querySelector('.pv-x');
    if (b) b.focus({ preventScroll: true });
  }

  /* ---------- navigation: account switcher, scroll spy, the fixed bar ---------- */
  const barBottom = () => (innerWidth <= 1100 ? 110 : 64) + 52;
  function jumpTo(y, smooth) {
    const L = window.MM && window.MM.lenis;
    if (L) L.scrollTo(y, smooth && !REDUCED ? { duration: 1.1 } : { immediate: true, force: true });
    else window.scrollTo({ top: y, behavior: smooth && !REDUCED ? 'smooth' : 'auto' });
  }
  function goTo(id) {
    const a = A[id]; if (!a) { console.warn('pages view: unknown account', id); return; }
    const s = document.getElementById(a.sec); if (!s) { location.hash = a.sec; return; }
    const h = s.querySelector('.pv-head') || s;
    const y = h.getBoundingClientRect().top + scrollY - barBottom() - 8;
    ST.acct = id; store.set('acct', id); markCurrent();
    jumpTo(Math.max(0, y), true);
    const h2 = s.querySelector('h2'); if (h2) h2.focus({ preventScroll: true });
  }
  function markCurrent() {
    if (!ROOT) return;
    ROOT.querySelectorAll('[data-go]').forEach((el) => { if (el.dataset.go === ST.acct) el.setAttribute('aria-current', 'true'); else el.removeAttribute('aria-current'); });
    const bar = ROOT.querySelector('.pv-bar.on'), cur = bar && bar.querySelector(`[data-go="${ST.acct}"]`);
    if (cur) {
      const p = cur.parentElement, pr = p.getBoundingClientRect(), cr = cur.getBoundingClientRect();
      if (cr.left < pr.left || cr.right > pr.right) p.scrollBy({ left: cr.left - pr.left - (pr.width - cr.width) / 2, behavior: 'auto' });
    }
  }
  let spyRaf = 0;
  function spy() {
    spyRaf = 0;
    if (!ROOT || ROOT.hidden || !ROOT.isConnected) return;
    const bar = ROOT.querySelector('.pv-bar'), map = ROOT.querySelector('#pv-map');
    if (bar && map) {
      const on = map.getBoundingClientRect().bottom < barBottom() - 40;
      if (bar.classList.contains('on') !== on) { bar.classList.toggle('on', on); if (on) bar.removeAttribute('inert'); else bar.setAttribute('inert', ''); }
    }
    lastAnchor = readAnchor(ROOT);
    let cur = 'group';
    for (const a of ACCTS) { const s = document.getElementById(a.sec); if (s && s.getBoundingClientRect().top < innerHeight * 0.42) cur = a.id; }
    if (cur !== ST.acct) { ST.acct = cur; store.set('acct', cur); markCurrent(); }
  }
  const onScroll = () => { if (!spyRaf) spyRaf = requestAnimationFrame(spy); };

  /* ---------- events (bound once on the root) ---------- */
  function bind(root) {
    if (root.__pvBound) return; root.__pvBound = true;
    root.addEventListener('click', (e) => {
      const go = e.target.closest('a[data-go]');
      if (go && root.contains(go)) { e.preventDefault(); e.stopPropagation(); goTo(go.dataset.go); return; }
      const md = e.target.closest('button[data-mode]');  // html carries data-mode too
      if (md) { setMode(md.dataset.mode); return; }
      const post = e.target.closest('button[data-post]');
      if (post) { openPost(post.dataset.post, post); return; }
      if (e.target.closest('.pv-m [data-close]')) { closeModal(); return; }
      // the page's own handler switches to the proposal; we only scroll to the section after it
      const gt = e.target.closest('button[data-goto]');
      if (gt) {
        // the proposal's layout settles over a few frames (pinned sections), so land on the section and check again
        const id = gt.dataset.goto; let n = 0;
        const land = () => {
          const t = document.getElementById(id); if (!t) { console.warn('pages view: no section', id); return; }
          const L = window.MM && window.MM.lenis;
          if (Math.abs(t.getBoundingClientRect().top) > 4) { if (L) L.scrollTo(t, { immediate: true, force: true }); else t.scrollIntoView(); }
          if (++n < 8) setTimeout(land, 150);
        };
        setTimeout(land, 150); return;
      }
      const sl = e.target.closest('button[data-slide]');
      if (sl && !sl.disabled) { slide(+sl.dataset.slide); }
    });
    document.addEventListener('keydown', (e) => {
      if (!ST.open || !ROOT || ROOT.hidden) return;
      const m = ROOT.querySelector('.pv-m'); if (!m || m.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeModal(); return; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { const d = (e.key === 'ArrowRight' ? 1 : -1) * (AR() ? -1 : 1); slide(d); e.preventDefault(); return; }
      if (e.key === 'Tab') {
        const f = [...m.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!m.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }, true);
    // an image that fails (a dropped connection) gets one more try
    root.addEventListener('error', (e) => {
      const im = e.target; if (!(im instanceof HTMLImageElement) || im.src.startsWith('data:')) return;
      if (im.dataset.retry) { console.warn('pages view: image failed twice', im.src); im.classList.add('pv-img-failed'); return; }
      im.dataset.retry = '1'; setTimeout(() => { im.src = im.src + (im.src.includes('?') ? '&' : '?') + 'r=1'; }, 400);
    }, true);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    // leaving "The pages" (index.html sets hidden on the root): close the post view and give the scroll back
    new MutationObserver(() => {
      try {
        if (root.hidden) { lastAnchor = null; if (ST.open) closeModal(false); else lockScroll(false); const b = root.querySelector('.pv-bar'); if (b) { b.classList.remove('on'); b.setAttribute('inert', ''); } }
        else onScroll();
      } catch (e) { console.error('pages view: leaving the view failed', e); lockScroll(false); }
    })
      .observe(root, { attributes: true, attributeFilter: ['hidden'] });
  }
  function setMode(mode) {
    const m = mode === 'proposed' ? 'proposed' : 'today';
    if (m === ST.mode) return;
    const sec = document.getElementById('pv-group'); if (!sec) { console.warn('pages view: group section missing'); return; }
    const was = ST.mode; ST.mode = m;
    let html;
    try { html = groupInner(); } catch (e) { ST.mode = was; console.error('pages view: Today/Proposed failed', e); return; }
    store.set('mode', m);
    const top = sec.getBoundingClientRect().top;
    sec.innerHTML = html; watchImgs(sec);
    const b = sec.querySelector(`[data-mode="${m}"]`); if (b) b.focus({ preventScroll: true });
    const drift = sec.getBoundingClientRect().top - top; if (Math.abs(drift) > 1) jumpTo(scrollY + drift, false);
    afterLayout();
  }
  function afterLayout() {
    const L = window.MM && window.MM.lenis; if (L && typeof L.resize === 'function') L.resize();
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
    onScroll();
  }

  /* ---------- image loader: near the screen first, 3 at a time, after the page's own files ---------- */
  let io = null; const queue = []; let active = 0, gen = 0;
  // the 3 logo masks load first, one after the other; the CSS shows masked marks only once .pv-mk-on is set
  let ready = false, masksOn = false;
  let started = false;
  function start() {
    if (started) return; started = true;
    const files = ['seka-mark.png', 'mashhoor-mark.png', 'nashmi-mark.png'];
    const next = (i) => {
      if (i >= files.length) { ready = true; masksOn = true; if (ROOT) ROOT.classList.add('pv-mk-on'); pump(); return; }
      const im = new Image(); let moved = false;
      const go = (ok) => { if (moved) return; moved = true; if (!ok) console.warn('pages view: logo mask did not load', files[i]); next(i + 1); };
      im.onload = () => go(true); im.onerror = () => go(false); setTimeout(() => go(false), 3000);
      im.src = IMG(files[i]);
    };
    next(0);
  }
  // wait for the page's own files (the dev server drops connections when everything loads at once), at most 4 s
  if (document.readyState === 'complete') start();
  else { addEventListener('load', () => setTimeout(start, 500), { once: true }); setTimeout(() => { if (!started) { console.warn('pages view: page load slow, loading images anyway'); start(); } }, 4000); }
  function pump() {
    if (!ready) return;
    while (active < 3 && queue.length) {
      const im = queue.shift();
      if (!im.isConnected || !im.dataset.src) continue;
      active++;
      const g = gen;
      let freed = false;
      const done = () => { if (freed) return; freed = true; clearTimeout(t); im.removeEventListener('load', done); im.removeEventListener('error', done); if (g === gen) { active--; pump(); } };
      const t = setTimeout(() => { console.warn('pages view: slow image, moving on', im.src); done(); }, 10000);
      im.addEventListener('load', done); im.addEventListener('error', done);
      im.src = im.dataset.src; im.removeAttribute('data-src');
    }
  }
  function want(im) { if (im.dataset.src && !im.dataset.q) { im.dataset.q = '1'; queue.push(im); pump(); } }
  function watchImgs(scope) {
    const list = scope.querySelectorAll('img[data-src]');
    if (!('IntersectionObserver' in window)) { list.forEach(want); return; }
    if (!io) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); want(e.target); } }), { rootMargin: '900px 0px' });
    list.forEach((im) => { if (im.closest('.pv-hls')) want(im); else io.observe(im); });
  }
  function loadNow(scope) { scope.querySelectorAll('img[data-src]').forEach((im) => { im.src = im.dataset.src; im.removeAttribute('data-src'); }); }
  addEventListener('beforeprint', () => { if (ROOT) loadNow(ROOT); });

  /* ---------- styles ---------- */
  function ensureCss(root) {
    if (document.getElementById('pv-css')) return;
    const f = document.createElement('link'); f.rel = 'stylesheet'; f.id = 'pv-fonts';
    f.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Aref+Ruqaa:wght@700&family=Lilita+One&display=swap';
    document.head.appendChild(f);
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.id = 'pv-css'; l.href = BASE + 'pages.css?v=' + VER;
    root.style.opacity = '0';
    const done = () => { root.style.opacity = ''; afterLayout(); };
    l.onload = done;
    l.onerror = () => { console.error('pages/pages.css failed to load'); l.remove(); root.innerHTML = `<p class="pv-loading">${esc(CTX && CTX.T ? CTX.T('pvFail') : 'The pages could not load. Refresh the page.')}</p>`; root.style.opacity = ''; RENDERED = false; };
    setTimeout(() => { if (root.style.opacity === '0') { console.warn('pages/pages.css is slow; showing the view anyway'); done(); } }, 2500);
    f.onerror = () => console.warn('pages view: Google Fonts did not load; the cards use fallback fonts');
    document.head.appendChild(l);
  }

  /* ---------- render ---------- */
  // index.html switches html[lang] before it calls render, which already reflows the old content; so the place to
  // return to is the one the scroll spy saw last, in the old layout.
  let lastAnchor = null;
  function readAnchor(root) {
    let a = null;
    root.querySelectorAll(':scope > section').forEach((s) => { const t = s.getBoundingClientRect().top; if (t <= innerHeight * 0.3) a = { id: s.id, top: t }; });
    return a;
  }
  window.PV = {
    loadAll() { if (ROOT) ROOT.querySelectorAll('img[data-src]').forEach(want); },
    render(root, ctx) {
      CTX = ctx; LANG = ctx.lang === 'en' ? 'en' : 'ar'; ROOT = root;
      if (!A[ST.acct]) ST.acct = 'group';
      ensureCss(root);
      const keep = RENDERED && !root.hidden ? lastAnchor : null;
      if (io) { io.disconnect(); io = null; } queue.length = 0; gen++; active = 0;
      const safe = (fn, id) => { try { return fn(); } catch (e) { console.error('pages view: section failed', id, e); return `<section id="${id}" class="sec pv-sec" data-label="${esc(id)}"><div class="wrap"><p class="pv-loading">${esc(ctx.T ? ctx.T('pvFail') : '')}</p></div></section>`; } };
      root.innerHTML = safe(intro, 'pv-intro') + safe(groupSec, 'pv-group') + safe(newsSec, 'pv-news') + ACCTS.filter((a) => a.id !== 'group').map((a) => safe(() => acctSec(a), a.sec)).join('') + endRow() + bar() + '<div class="pv-m" hidden></div><span class="pv-vh" id="pv-live" aria-live="polite"></span>';
      bind(root);
      if (masksOn) root.classList.add('pv-mk-on');
      watchImgs(root);
      RENDERED = true;
      if (keep) {
        // the language changed under the reader: put the same section back at the same height on the screen
        const back = () => { const s = document.getElementById(keep.id); const L = window.MM && window.MM.lenis; if (L && typeof L.resize === 'function') L.resize(); if (s) jumpTo(s.getBoundingClientRect().top + scrollY - keep.top, false); };
        back(); requestAnimationFrame(() => requestAnimationFrame(back));
      }
      markCurrent();
      if (!(ST.open && showModal(ST.open, true))) { ST.open = null; lockScroll(false); }
      afterLayout();
    },
  };
})();
