/* Bana · Naya · Amani — "The pages": each Instagram page today and proposed, plus the post types with their evidence.
   Facts: public pages, 20 Oct 2026. Today tiles show only the post dates (post content was not read). */
(function () {
  let CTX = null, LANG = 'ar', MODE = 'proposed', BRAND = 'bana';
  const tx = (p) => (Array.isArray(p) ? p[LANG === 'ar' ? 0 : 1] : p);
  const esc = (s) => (CTX ? CTX.esc(s) : String(s ?? ''));
  const R = (s) => (CTX ? CTX.rich(s) : esc(s));
  const get = (k, d) => { try { return localStorage.getItem('bana-pv-' + k) || d; } catch (e) { return d; } };
  const set = (k, v) => { try { localStorage.setItem('bana-pv-' + k, v); } catch (e) { /* storage blocked */ } };
  MODE = get('mode', 'proposed') === 'today' ? 'today' : 'proposed';
  BRAND = ['bana', 'naya', 'amani'].includes(get('brand', 'bana')) ? get('brand', 'bana') : 'bana';

  const T = {
    h: ['شكل الصفحات', 'The pages'],
    sub: ['كل صفحة اليوم بمنشوراتها الحقيقية، والصفحة المقترحة، وأنواع المنشورات. المربعات المقترحة أمثلة.', 'Each page today with its real posts, the proposed page, and the post types. The proposed tiles are examples.'],
    today: ['اليوم', 'Today'], prop: ['المقترح', 'Proposed'],
    posts: ['منشور', 'posts'], fol: ['متابع', 'followers'], fing: ['يتابع', 'following'],
    follow: ['متابعة', 'Follow'], msg: ['رسالة', 'Message'], wa: ['واتساب', 'WhatsApp'],
    ago: ['قبل N يوم', 'N days ago'], ago1: ['قبل يوم', '1 day ago'], post: ['منشور', 'Post'],
    noteToday: ['المربعات: آخر 6 منشورات، بأول كلمات الكابشن والمشاهدات والإعجابات والتعليقات، 20 تشرين الأول 2026.', 'Tiles: the last 6 posts, with the first words of the caption, plays, likes and comments, 20 October 2026.'],
    noteProp: ['الأرقام من 20 تشرين الأول 2026.', 'Numbers from 20 October 2026.'],
    todayH: ['ما نعرفه اليوم', 'What we know today'], changesH: ['ما يتغير', 'What changes'],
    typesH: ['أنواع المنشورات', 'Post types'],
    typesSub: ['لكل نوع: مثال لهذه الصفحة، ولماذا يعمل الآن، ومصدر الرقم.', 'For each type: an example for this page, why it works now, and the source of the number.'],
    ex: ['مثال', 'Example'], why: ['لماذا', 'Why'],
  };
  const B = {
    bana: { tab: ['بانا كوزمتكس', 'Bana Cosmetics'], handle: 'bana_cosmetics', name: 'Bana Cosmetics 🦋', av: 'B', stats: ['1,665', '20K', '46'],
      bio: ['كُل تفاصيل الجمال بمكان واحد ✨', '📍الفرع الرئيسي اربد جنوب دوار اليوسفي 📱0795001007', '📍الفرع الثاني اربد دوار مدينة الحسن بجانب مطعم عرفة 📱 0795611056'],
      bioAdd: ['للطلب على واتساب: الرابط في البايو', 'Order on WhatsApp: the link in the bio'],
      posts: [['reel', 1624, 5, 0, 'بشرتك بتستاهل العناية الصح'], ['reel', 3632, 39, 0, 'كل أساسيات جمالك… بمكان واحد'], ['reel', 2656, 10, 0, 'عرض 3 أيام بس على سشوار'], ['reel', 4639, 29, 0, 'ألف مبروك للرابحين بمسابقة بانا'], ['reel', 4854, 26, 1, 'بدك هاللون لشعرك؟'], ['reel', 6892, 36, 1, 'نود lip combo على ذوقك']],
      evx: { talk: ['على صفحة بانا: أعلى ريل في آخر 12 بدأ بسؤال «بدك هاللون لشعرك؟»: 20,550 مشاهدة و163 إعجاباً. الوسيط 4,639.', 'On Bana: the top reel of the last 12 opened with a question, “بدك هاللون لشعرك؟”: 20,550 plays and 163 likes. The median is 4,639.'], carousel: ['على صفحة بانا: كاروسيلان في آخر 12 منشوراً، 7 و11 إعجاباً. الشكل جديد على الصفحة.', 'On Bana: 2 carousels in the last 12 posts, 7 and 11 likes. The format is new to the page.'] },
      hl: [['جديد', 'New'], ['الفرع 1', 'Branch 1'], ['الفرع 2', 'Branch 2'], ['شروحات', 'Tutorials'], ['آراء', 'Reviews'], ['عرائس', 'Brides']],
      known: [['20 ألف متابع، 1,665 منشوراً.', '20K followers, 1,665 posts.'], ['آخر 12 منشوراً (8–19 تشرين الأول): 9 ريلز، 2 كاروسيل، صورة.', 'Last 12 posts (8–19 Oct): 9 reels, 2 carousels, 1 photo.'], ['المشاهدات من 1,624 إلى 20,550، والوسيط 4,639. الإعجابات من 5 إلى 163.', 'Plays from 1,624 to 20,550, median 4,639. Likes from 5 to 163.'], ['المحتوى: عرض منتجات، عروض، مسابقات، نصائح.', 'Content: product showcases, offers, contests, tips.'], ['فرعان في إربد، ورقمان في البايو.', '2 branches in Irbid, and 2 numbers in the bio.'], ['لا يوجد متجر إلكتروني أو رابط طلب.', 'No online shop or order link.']],
      changes: [['شخص أمام الكاميرا في الريلز: صاحبة المحل أو موظفة.', 'A person on camera in the reels: the owner or a staff member.'], ['كاروسيل مقارنة كل أسبوع.', 'A comparison carousel each week.'], ['ريل لكل فرع.', 'One reel for each branch.'], ['زر واتساب للطلب في البايو.', 'A WhatsApp order button in the bio.'], ['16 فيديو في الشهر: 4 في الأسبوع.', '16 videos a month: 4 a week.']],
      grid: [['talk', 'شو بتحطي قبل الفاونديشن؟'], ['carousel', '5 درجات · 5 ألوان بشرة'], ['tutorial', 'مكياج 5 دقائق بـ3 منتجات'], ['review', 'أول مرة تجرّبه'], ['branch', 'فرع مدينة الحسن: من هون'], ['series', 'عروس من طابق لطابق · 3']],
      types: ['talk', 'carousel', 'tutorial', 'review', 'branch', 'series'] },
    naya: { tab: ['نايا', 'Naya'], handle: 'naya_bridal2026', name: 'Naya_bridal2026', av: 'N', stats: ['88', '4,360', '2'],
      bio: ['👗أرقى موديلات فساتين الزفاف والحفلات الحصرية', '📍اربد-جنوب دوار اليوسفي- فوق بانا كوزمتكس', '📞 للتواصل والاستفسار : 0793300757'],
      bioNew: ['👗 فساتين زفاف وحفلات', '📍 إربد، جنوب دوار اليوسفي، فوق بانا كوزمتكس', '📞 للقياس والحجز: 0793300757'],
      posts: [['reel', 953, 15, 4, 'لأن ليلة خطوبتك بتستاهل إطلالة'], ['reel', 1436, 17, 0, 'كل تفاصيلك الحلوة بتستاهل فستان'], ['reel', 1884, 19, 0, 'طِلّتك بيوم عُرسك'], ['reel', 1718, 21, 0, 'لإطلالة تخطف الأنظار'], ['reel', 2078, 20, 3, 'لأنكِ عروس، لازم يكون إلكِ إطلالة'], ['reel', 2278, 17, 0, 'لأنكِ بتستاهلي إطلالة']],
      evx: { talk: ['على صفحة نايا: الريل الذي بدأ بمشكلة «مو لازم تلفّي على عشرات المحلات» وصل 21,028 مشاهدة و11 تعليقاً.', 'On Naya: the reel that opened with a problem, “no need to go round dozens of shops”, reached 21,028 plays and 11 comments.'] },
      hl: [['زفاف', 'Wedding'], ['حفلات', 'Party'], ['القياس', 'Try-on'], ['عرائسنا', 'Our brides'], ['الموقع', 'Location']],
      known: [['4,372 متابعاً، 88 منشوراً.', '4,372 followers, 88 posts.'], ['آخر 12 منشوراً كلها ريلز. الوسيط 2,375 مشاهدة، والأعلى 50,751 (1 تشرين الأول).', 'The last 12 posts are all reels. Median 2,375 plays, top 50,751 (1 Oct).'], ['آخر 6 ريلز (منذ 8 تشرين الأول) كلها تحت 2,300 مشاهدة.', 'The last 6 reels (since 8 Oct) are all under 2,300 plays.'], ['الصفحة حديثة: 2026 في الاسم.', 'The page is new: 2026 is in the name.'], ['فوق بانا كوزمتكس، نفس المبنى.', 'Above Bana Cosmetics, the same building.']],
      changes: [['قياس فساتين مع سؤال للتعليقات.', 'Dress try-ons with a question for the comments.'], ['منشورات مشتركة مع أماني وبانا.', 'Collab posts with Amani and Bana.'], ['بايو بدون «أرقى» و«حصرية»: الخدمة والعنوان والرقم.', 'A bio without "finest" and "exclusive": the service, the address and the number.'], ['8 فيديوهات في الشهر، إذا أُضيفت.', '8 videos a month, if added.']],
      grid: [['tryon', '3 فساتين · أي واحد؟'], ['carousel', 'فساتين الحفلات · 6 قصّات'], ['bts', 'التطريز عن قرب'], ['talk', 'كيف تختاري فستان لقاعة صغيرة؟'], ['review', 'العروس يوم القياس'], ['series', 'عروس من طابق لطابق · 1']],
      types: ['tryon', 'carousel', 'bts', 'talk', 'review', 'series'] },
    amani: { tab: ['أماني', 'Amani'], handle: 'amani_beauty_lounge_and_bridal', name: 'Amani beauty lounge & bridal', av: 'A', stats: ['1,348', '22K', '3,114'],
      bio: ['BEAUTY IS OUR BUSINESS 💛 لا يوجد لدينا اي فرع أخر', ':اربد-دوار اليوسفي-فوق بانا كوزمتكس', 'We Receive you from 9:00AM until 8:00PM⏱️'],
      bioAdd: ['للحجز على واتساب: الرابط في البايو', 'Book on WhatsApp: the link in the bio'],
      posts: [['reel', 2111, 16, 12, 'Relaxing & treatment with morfose'], ['reel', 1341, 14, 2, 'Wavy Hairstyle'], ['reel', 2496, 32, 8, 'علاج الشعر بـ GK'], ['reel', 5592, 135, 102, 'Full Highlight & Contour · Before & After'], ['reel', 8799, 68, 29, 'Wavy Hairstyle'], ['reel', 1470, 19, 4, 'RED GEL -X']],
      evx: { ba: ['على صفحة أماني: ريل «Before & After» حصل على 102 تعليق و135 إعجاباً، الأعلى في آخر 12 منشوراً.', 'On Amani: a “Before & After” reel got 102 comments and 135 likes, the most of the last 12 posts.'] },
      hl: [['عرائس', 'Brides'], ['مكياج', 'Makeup'], ['شعر', 'Hair'], ['قبل وبعد', 'Before/after'], ['الحجز', 'Booking']],
      known: [['22 ألف متابع، 1,348 منشوراً.', '22K followers, 1,348 posts.'], ['آخر 12 منشوراً: 11 ريل وكاروسيل. الوسيط 1,637 مشاهدة. آخر منشور 8 تشرين الأول.', 'Last 12 posts: 11 reels and 1 carousel. Median 1,637 plays. The last post is from 8 Oct.'], ['ريل «Before & After»: 102 تعليق، الأعلى.', 'The “Before & After” reel: 102 comments, the most.'], ['من 9 صباحاً إلى 8 مساءً، فرع واحد.', '9 AM to 8 PM, one branch.']],
      changes: [['قبل وبعد لكل عروس، بموافقتها المكتوبة.', 'Before and after for each bride, with her written consent.'], ['منشوران في الأسبوع على الأقل.', 'At least 2 posts a week.'], ['زر واتساب للحجز في البايو.', 'A WhatsApp booking button in the bio.'], ['8 فيديوهات في الشهر، إذا أُضيفت.', '8 videos a month, if added.']],
      grid: [['ba', 'قبل · بعد · مكياج عروس'], ['talk', 'قديش بعيش مكياج العروس؟'], ['bts', 'صباح العروس'], ['tutorial', 'تسريحة بـ3 خطوات'], ['review', 'رأي العروس بعد الحفلة'], ['series', 'عروس من طابق لطابق · 2']],
      types: ['ba', 'talk', 'bts', 'tutorial', 'review', 'series'] },
  };
  const TYPES = {
    talk: { n: ['فيديو كلام للكاميرا', 'Talking video'], why: ['شخص يتكلم للكاميرا 30 ثانية أو أقل، ويبدأ بسؤال.', 'A person speaks to camera for 30 seconds or less, and starts with a question.'], ev: ['9.0% تفاعل لكل مشاهدة و38.2% نسبة مشاهدة؛ المنتج وحده 5.1%. Highviz 2026، 315 ريل. افتتاح بسؤال 5.67% مقابل 1.05% للقوائم (420 ريل).', '9.0% engagement per view and a 38.2% watch ratio; the product alone 5.1%. Highviz 2026, 315 reels. A question opening 5.67% against 1.05% for lists (420 reels).'] },
    carousel: { n: ['كاروسيل', 'Carousel'], why: ['صور متتالية للمقارنة أو الخطوات. الناس تحفظها وترسلها.', 'Slides for a comparison or steps. People save and send them.'], ev: ['حوالي 9 أضعاف حفظ الصورة الواحدة، وضعف الريل لكل ظهور. Buffer وSocialinsider.', 'About 9 times the saves of a single image, and 2 times a reel per view. Buffer, Socialinsider.'] },
    ba: { n: ['قبل وبعد', 'Before and after'], why: ['أول لقطة النتيجة مع نص كبير، ثم البداية.', 'The first frame is the result with big text, then the start.'], ev: ['في 92 ريلاً قسناها، كل ريل فوق 1,000 وصول بدأ بنص كبير. لا رقم منشور لقبل وبعد بعد: نقيس الحفظ في الشهر الأول.', 'In 92 reels we measured, every reel above 1,000 reach opened with big text. No published number for before and after yet: we measure saves in month 1.'] },
    tutorial: { n: ['شرح بالخطوات', 'Tutorial'], why: ['3 خطوات بمنتجات من المحل، مع «احفظيه».', '3 steps with products from the store, with "save it".'], ev: ['طلب الحفظ: +92% حفظ. طلب الإعجاب: −4.9%. Metricool، 24.3 مليون منشور.', 'A save ask: +92% saves. A like ask: −4.9%. Metricool, 24.3M posts.'] },
    review: { n: ['رأي زبونة', 'Customer review'], why: ['زبونة حقيقية تجرّب وتحكي، بموافقتها.', 'A real customer tries and talks, with her consent.'], ev: ['على صفحة Playy: مقابلات الناس وصلت 1,923 وشاركها 27؛ الإعلان المباشر 130–160 وصول.', 'On the Playy page: interviews with people reached 1,923 with 27 shares; a direct ad 130–160 reach.'] },
    bts: { n: ['لقطات بدون كلام', 'Behind the scenes'], why: ['تفاصيل قريبة وموسيقى: تطريز، أدوات، صباح العروس.', 'Close details and music: embroidery, tools, the bride\'s morning.'], ev: ['افتتاح سينمائي: 9.1% تفاعل لكل مشاهدة، الأعلى في Highviz 2026.', 'A cinematic opening: 9.1% engagement per view, the highest in Highviz 2026.'] },
    tryon: { n: ['قياس مع سؤال', 'Try-on with a question'], why: ['3 خيارات ثم «أي واحد؟».', '3 options, then "which one?".'], ev: ['طلب التعليق: +203% تعليقات. Metricool، 24.3 مليون منشور.', 'A comment ask: +203% comments. Metricool, 24.3M posts.'] },
    branch: { n: ['الطريق للفرع', 'The way to the branch'], why: ['من الدوار إلى الباب في 15 ثانية، مع الرقم.', 'From the roundabout to the door in 15 seconds, with the number.'], ev: ['يجيب عن «وينكم؟» قبل أن يُسأل. نعدّ الرسائل التي تذكر الفرع.', 'It answers "where are you?" before it is asked. We count the messages that name the branch.'] },
    series: { n: ['عروس من طابق لطابق', 'One bride, floor to floor'], why: ['منشور مشترك على الصفحات الثلاث: نايا، ثم أماني، ثم بانا.', 'One collab post on all three pages: Naya, then Amani, then Bana.'], ev: ['المنشور المشترك يظهر على الصفحات الثلاث: 20 ألفاً و22 ألفاً و4,360 متابعاً.', 'A collab post shows on all three pages: 20K, 22K and 4,360 followers.'] },
  };
  const I = {
    reel: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 8.5v7l6-3.5z" fill="currentColor"/></svg>',
    person: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/></svg>',
    dress: '<svg viewBox="0 0 24 32" aria-hidden="true"><path d="M9 2h6l-1 6 6 22H4l6-22z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" stroke="currentColor" stroke-width="1.6"/></svg>',
  };
  const CSS = `
  .pvs{padding:120px 0 80px}.pvs *{box-sizing:border-box}
  .pvs .wrap{max-width:1180px;margin:0 auto;padding:0 clamp(16px,4vw,48px)}
  .pvs h2{font-size:clamp(34px,6vw,64px);line-height:1;margin-bottom:12px}
  .pvs .sub{color:var(--text2);max-width:760px}
  .pv-ctl{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 26px}
  .pv-seg{display:inline-flex;flex-wrap:wrap;border:1px solid var(--line2);border-radius:999px;padding:3px}
  .pv-seg button{border:0;background:none;color:var(--text2);font:inherit;font-weight:700;padding:9px 16px;border-radius:999px;cursor:pointer;min-height:40px}
  .pv-seg button[aria-pressed=true]{background:var(--text);color:var(--bg)}
  .pv-lay{display:grid;grid-template-columns:minmax(0,400px) minmax(0,1fr);gap:40px;align-items:start}.pv-lay>*{min-width:0}
  .pv-phone{border:1px solid var(--line2);border-radius:36px;background:var(--bg2);padding:18px 14px 14px;box-shadow:0 30px 60px rgba(0,0,0,.08);width:100%}
  .pv-top{display:flex;align-items:center;gap:16px;padding:6px 4px 10px}
  .pv-av{width:74px;height:74px;border-radius:50%;flex:none;display:grid;place-items:center;background:#111;color:#fff;font-weight:800;font-size:26px;box-shadow:0 0 0 3px var(--bg2),0 0 0 5px #111}
  .pv-stats{display:grid;grid-template-columns:repeat(3,1fr);flex:1;text-align:center}
  .pv-stats b{display:block;font-size:17px}.pv-stats span{font-size:12px;color:var(--text2)}
  .pv-name{font-weight:800;padding:0 4px}
  .pv-bio{font-size:13px;color:var(--text2);padding:2px 4px 10px;display:flex;flex-direction:column;gap:1px}
  .pv-bio .add{color:var(--text);font-weight:700}
  .pv-btns{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:0 4px 12px}
  .pv-btns span{border-radius:9px;background:var(--line);text-align:center;font-weight:700;font-size:13px;padding:7px 0}
  .pv-btns span:first-child{background:#111;color:#fff}
  .pv-hl{display:flex;gap:12px;overflow-x:auto;padding:2px 4px 12px;scrollbar-width:none}
  .pv-hl div{flex:none;width:62px;text-align:center;font-size:11px;color:var(--text2)}
  .pv-hl i svg{width:22px;height:22px}.pv-hl i{display:grid;place-items:center;width:56px;height:56px;margin:0 auto 4px;border-radius:50%;border:1px solid var(--line2);background:var(--bg);font-style:normal;font-weight:800;color:var(--text)}
  .pv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border-radius:6px;overflow:hidden}
  .mini{position:relative;aspect-ratio:3/4;overflow:hidden;color:#fff;background:#222;display:flex;flex-direction:column;justify-content:flex-end;padding:8px}
  .mini small{font-size:10.5px;line-height:1.25;font-weight:700;position:relative}
  .mini .ri{position:absolute;top:6px;inset-inline-end:6px;width:17px;height:17px}
  .mini .hook{position:absolute;top:9%;inset-inline:7px;font-weight:800;font-size:13px;line-height:1.2;text-align:center}.pv-card .mini .hook{font-size:10.5px}.pv-card .mini .ic{top:66%;width:32%}
  .mini .ic{position:absolute;left:50%;top:60%;transform:translate(-50%,-50%);width:36%;opacity:.55}
  .mini.past{background:#333;color:#fff}.mini.past .ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.mini.past::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,0) 45%,rgba(0,0,0,.7))}.mini.past .hook,.mini.past small,.mini.past .ri{z-index:1}.mini.past .hook{font-size:11.5px;top:16%;text-shadow:0 1px 3px rgba(0,0,0,.6)}.mini.past small{font-size:9.5px;white-space:nowrap}.mini.shot{padding:0;background:#ddd}.mini.shot img{width:100%;height:100%;object-fit:cover;display:block}
  .mini.carousel{background:#ececec;color:#111}
  .mini.carousel .stack{position:absolute;inset:22% 18% 30%;border:2px solid #111;border-radius:6px;box-shadow:6px 6px 0 -2px #ececec,6px 6px 0 0 #111}
  .mini.carousel .dots{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);display:flex;gap:3px}.mini.carousel .dots i{width:5px;height:5px;border-radius:50%;background:#111;opacity:.35}.mini.carousel .dots i:first-child{opacity:1}
  .mini.ba{background:none;padding:0;color:#111}.mini.ba .h{flex:1;display:grid;place-items:center;font-weight:800;font-size:12px}.mini.ba .h:first-child{background:#8a8a8a;color:#fff}.mini.ba .h:nth-child(2){background:#f0f0f0}.mini.ba small{position:absolute;bottom:6px;inset-inline-start:8px}
  .mini.tutorial{background:#f4f4f4;color:#111}.mini.tutorial ol{position:absolute;top:34%;inset-inline:14px;margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px}.mini.tutorial li{display:flex;gap:6px;align-items:center;font-size:10px;font-weight:700}.mini.tutorial li b{width:16px;height:16px;border-radius:50%;background:#111;color:#fff;display:grid;place-items:center;font-size:9px;flex:none}.mini.tutorial li i{flex:1;height:5px;border-radius:3px;background:#c9c9c9}
  .mini.review{background:#e3e3e3;color:#111}.mini.review .bub{position:absolute;top:12%;inset-inline:10px;background:#fff;border-radius:12px;padding:6px 8px;font-size:11px;font-weight:700;text-align:center}
  .mini.bts{background:linear-gradient(200deg,#5a5a5a,#111)}
  .mini.tryon{background:#efefef;color:#111}.mini.tryon .row3{position:absolute;top:32%;inset-inline:10%;display:flex;justify-content:space-between}.mini.tryon .row3 svg{width:26%}
  .mini.branch{background:#dcdcdc;color:#111}.mini.branch .road{position:absolute;inset:auto 0 34% 0;height:12px;background:#9d9d9d}
  .mini.series{background:#111}.mini.series .fl{position:absolute;inset-inline:16%;height:15%;border:1.5px solid #fff;display:grid;place-items:center;font-size:9px;font-weight:800}
  .pv-side h3,.pv-types h3{font-size:13px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 10px}
  .pv-side ul{list-style:none;margin:0 0 26px;padding:0;display:flex;flex-direction:column;gap:9px}
  .pv-side li{border-top:1px solid var(--line);padding-top:9px;color:var(--text2)}
  .pv-note{font-size:12.5px;color:var(--muted);margin-top:10px}
  .pv-types{margin-top:56px}.pv-types .tsub{color:var(--text2);margin:-4px 0 18px}
  .pv-tgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
  .pv-card{display:grid;grid-template-columns:110px minmax(0,1fr);gap:14px;border-top:1px solid var(--line2);padding-top:14px}
  .pv-card .mini{border-radius:8px}
  .pv-card b{display:block;font-size:16px;margin-bottom:4px}
  .pv-card p{margin:0 0 6px;font-size:13.5px;color:var(--text2)}
  .pv-card .ev{font-size:12px;color:var(--muted)}.pv-card .ev.on{color:var(--text);border-inline-start:2px solid var(--text);padding-inline-start:8px}
  @media(max-width:980px){.pv-tgrid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:860px){.pv-lay{grid-template-columns:1fr}.pv-phone{max-width:400px;margin:0 auto}}
  @media(max-width:620px){.pv-tgrid{grid-template-columns:1fr}.pv-card{grid-template-columns:92px minmax(0,1fr)}}`;

  const SAMPLE = { bana: { talk: 1, carousel: 2, tutorial: 3, series: 5 }, naya: { tryon: 4, series: 5 }, amani: { ba: 6, series: 5 } };
  function mini(kind, hook) {
    const sn = SAMPLE[BRAND] && SAMPLE[BRAND][kind];
    if (sn) return `<div class="mini shot"><img src="img/s/p${sn}.jpg" alt="${esc(tx(TYPES[kind].n))}" loading="lazy"></div>`;
    const label = esc(tx(TYPES[kind].n)), hk = hook ? `<span class="hook" lang="ar" dir="rtl">${esc(hook)}</span>` : '';
    switch (kind) {
      case 'talk': return `<div class="mini talk"><span class="ri">${I.reel}</span>${hk}<span class="ic">${I.person}</span><small>${label}</small></div>`;
      case 'carousel': return `<div class="mini carousel">${hk}<span class="stack"></span><span class="dots"><i></i><i></i><i></i><i></i><i></i></span><small>${label}</small></div>`;
      case 'ba': return `<div class="mini ba"><span class="h">${esc(tx(['بعد', 'After']))}</span><span class="h">${esc(tx(['قبل', 'Before']))}</span><small>${label}</small></div>`;
      case 'tutorial': return `<div class="mini tutorial">${hk}<ol><li><b>1</b><i></i></li><li><b>2</b><i></i></li><li><b>3</b><i></i></li></ol><small>${label}</small></div>`;
      case 'review': return `<div class="mini review"><span class="ri">${I.reel}</span><span class="bub" lang="ar" dir="rtl">${esc(hook || '«…»')}</span><span class="ic">${I.person}</span><small>${label}</small></div>`;
      case 'bts': return `<div class="mini bts"><span class="ri">${I.reel}</span>${hk}<span class="ic">${I.spark}</span><small>${label}</small></div>`;
      case 'tryon': return `<div class="mini tryon"><span class="ri">${I.reel}</span>${hk}<span class="row3">${I.dress}${I.dress}${I.dress}</span><small>${label}</small></div>`;
      case 'branch': return `<div class="mini branch"><span class="ri">${I.reel}</span>${hk}<span class="road"></span><span class="ic" style="width:28%">${I.pin}</span><small>${label}</small></div>`;
      default: return `<div class="mini series"><span class="ri">${I.reel}</span><span class="fl" style="top:20%">Naya</span><span class="fl" style="top:39%">Amani</span><span class="fl" style="top:58%">Bana</span><small>${label}</small></div>`;
    }
  }
  const nf = (n) => new Intl.NumberFormat('en-US').format(n);
  const pastTile = ([t, pl, lk, cm, cap], i) => `<div class="mini past"><img class="ph" src="img/s/${BRAND}-t${i}.jpg" alt="" loading="lazy">${t === 'reel' ? `<span class="ri">${I.reel}</span>` : ''}<span class="hook" dir="auto">${esc(cap)}</span><small><bdi dir="ltr">${t === 'reel' ? '▶' + nf(pl) + ' ' : ''}♥${nf(lk)} 💬${nf(cm)}</bdi></small></div>`;

  function render(el, ctx) {
    CTX = ctx; LANG = ctx.lang;
    if (!document.getElementById('pv-css')) { const st = document.createElement('style'); st.id = 'pv-css'; st.textContent = CSS; document.head.appendChild(st); }
    const b = B[BRAND], prop = MODE === 'proposed';
    const bio = prop && b.bioNew ? b.bioNew : b.bio;
    const seg = (attr, items, cur) => `<div class="pv-seg" role="group">${items.map(([k, l]) => `<button type="button" ${attr}="${k}" aria-pressed="${k === cur}">${esc(tx(l))}</button>`).join('')}</div>`;
    el.innerHTML = `<section class="pvs" id="pv-pages" data-label="${esc(tx(T.h))}"><div class="wrap">
      <h2>${esc(tx(T.h))}</h2><p class="sub">${R(tx(T.sub))}</p>
      <div class="pv-ctl">${seg('data-pvb', Object.keys(B).map((k) => [k, B[k].tab]), BRAND)}${seg('data-pvmode', [['today', T.today], ['proposed', T.prop]], MODE)}</div>
      <div class="pv-lay">
        <div><div class="pv-phone" aria-label="@${esc(b.handle)}">
          <div class="pv-top"><span class="pv-av" aria-hidden="true">${b.av}</span><div class="pv-stats"><div><b>${b.stats[0]}</b><span>${esc(tx(T.posts))}</span></div><div><b>${b.stats[1]}</b><span>${esc(tx(T.fol))}</span></div><div><b>${b.stats[2]}</b><span>${esc(tx(T.fing))}</span></div></div></div>
          <div class="pv-name" dir="auto">${esc(b.name)}</div>
          <div class="pv-bio">${bio.map((x) => `<span dir="auto">${esc(x)}</span>`).join('')}${prop && b.bioAdd ? `<span class="add" dir="auto">${esc(tx(b.bioAdd))}</span>` : ''}</div>
          <div class="pv-btns"><span>${esc(tx(T.follow))}</span><span>${esc(tx(T.msg))}</span><span>${esc(tx(prop ? T.wa : T.msg))}</span></div>
          ${prop ? `<div class="pv-hl">${b.hl.map((h) => `<div><i>${I.spark}</i>${esc(tx(h))}</div>`).join('')}</div>` : ''}
          <div class="pv-grid">${prop ? b.grid.map(([k, hook]) => mini(k, hook)).join('') : b.posts.map(pastTile).join('')}</div>
        </div><p class="pv-note">${esc(tx(prop ? T.noteProp : T.noteToday))}</p></div>
        <div class="pv-side">
          <h3>${esc(tx(prop ? T.changesH : T.todayH))}</h3><ul>${(prop ? b.changes : b.known).map((c) => `<li>${R(tx(c))}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="pv-types"><h3>${esc(tx(T.typesH))} · ${esc(tx(b.tab))}</h3><p class="tsub">${esc(tx(T.typesSub))}</p>
        <div class="pv-tgrid">${b.types.map((k) => { const hook = (b.grid.find((g) => g[0] === k) || [])[1]; const t = TYPES[k]; return `<article class="pv-card">${mini(k, hook)}<div><b>${esc(tx(t.n))}</b><p>${R(tx(t.why))}</p><p class="ev">${R(tx(t.ev))}</p>${b.evx && b.evx[k] ? `<p class="ev on">${R(tx(b.evx[k]))}</p>` : ''}</div></article>`; }).join('')}</div>
      </div></div></section>`;
  }
  document.addEventListener('click', (e) => {
    const m = e.target.closest('[data-pvmode]'), br = e.target.closest('[data-pvb]'); if ((!m && !br) || !CTX) return;
    if (m) { MODE = m.dataset.pvmode === 'today' ? 'today' : 'proposed'; set('mode', MODE); }
    if (br && B[br.dataset.pvb]) { BRAND = br.dataset.pvb; set('brand', BRAND); }
    render(document.getElementById('pagesView'), CTX);
    const again = document.querySelector(m ? `[data-pvmode="${MODE}"]` : `[data-pvb="${BRAND}"]`); if (again) again.focus({ preventScroll: true });
  });
  window.PV = { render };
})();
