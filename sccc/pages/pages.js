/* SCCC · "The page": what @sccc.jo looks like today, and the proposed page modelled on @revup_garage.
   Facts come from the public page (20 Oct 2026). Tiles are placeholders, not real posts. */
(function () {
  let CTX = null, LANG = 'ar', MODE = 'proposed';
  const tx = (p) => (Array.isArray(p) ? p[LANG === 'ar' ? 0 : 1] : p);
  const esc = (s) => (CTX ? CTX.esc(s) : String(s ?? ''));
  const R = (s) => (CTX ? CTX.rich(s) : esc(s));
  try { MODE = localStorage.getItem('sccc-pvmode') === 'today' ? 'today' : 'proposed'; } catch (e) { /* storage blocked */ }

  const T = {
    h: ['شكل الصفحة', 'The page'],
    sub: ['@sccc.jo اليوم، والصفحة المقترحة على طريقة @revup_garage. المربعات أمثلة، وليست منشورات حقيقية.', '@sccc.jo today, and the proposed page in the style of @revup_garage. The tiles are examples, not real posts.'],
    today: ['اليوم', 'Today'], prop: ['المقترح', 'Proposed'],
    posts: ['منشور', 'posts'], fol: ['متابع', 'followers'], fing: ['يتابع', 'following'],
    follow: ['متابعة', 'Follow'], msg: ['رسالة', 'Message'], book: ['احجز', 'Book'],
    statsNote: ['الأرقام من 20 تشرين الأول 2026.', 'Numbers from 20 October 2026.'],
    changesH: ['ما يتغير', 'What changes'],
    refH: ['الصفحة المرجعية', 'Reference page'],
    todayH: ['ما في الصفحة اليوم', 'What the page has today'],
    reel: ['ريل', 'Reel'], photo: ['صورة', 'Photo'], person: ['شخص أمام الكاميرا', 'Person on camera'],
    before: ['قبل', 'Before'], after: ['بعد', 'After'],
  };
  const BIO_TODAY = [['IPPF • Tinting • Graphene • Polish • Accessories • car wash & dry-clean', 'IPPF • Tinting • Graphene • Polish • Accessories • car wash & dry-clean'], ['0770000054', '0770000054'], ['King Abdullah II St 143, Amman, Jordan', 'King Abdullah II St 143, Amman, Jordan']];
  const BIO_PROP = [['PPF • تظليل • جرافين • تلميع • غسيل وتنظيف جاف', 'PPF • Tint • Graphene • Polish • Wash and dry-clean'], ['للحجز: واتساب 0770000054', 'Book: WhatsApp 0770000054'], ['شارع الملك عبدالله الثاني 143، عمّان', 'King Abdullah II St 143, Amman']];
  const HL_TODAY = [['التلميع', 'Polish'], ['التظليل', 'Tinting'], ['PPF والستيكر', 'PPF & Sticker'], ['الجرافين', 'Graphene'], ['الغسيل', 'Car wash']];
  const HL_PROP = [['PPF', 'PPF'], ['التظليل', 'Tint'], ['الجرافين', 'Graphene'], ['التلميع', 'Polish'], ['Rolls-Royce', 'Rolls-Royce'], ['Mercedes', 'Mercedes'], ['BMW', 'BMW'], ['الحجز', 'Booking']];
  // today: what the grid shows on 20 Oct (cars outside the building, no person)
  const GRID_TODAY = [
    { k: 'photo', l: ['Rolls-Royce', 'Rolls-Royce'] }, { k: 'photo', l: ['G-Class', 'G-Class'] }, { k: 'photo', l: ['Rolls-Royce', 'Rolls-Royce'] },
    { k: 'reel', l: ['سيارة أمام المبنى', 'Car outside the building'] }, { k: 'reel', l: ['Mercedes', 'Mercedes'] }, { k: 'reel', l: ['BMW', 'BMW'] },
    { k: 'reel', l: ['سيارة أمام المبنى', 'Car outside the building'] }, { k: 'reel', l: ['سيارة أمام المبنى', 'Car outside the building'] }, { k: 'reel', l: ['سيارة أمام المبنى', 'Car outside the building'] },
  ];
  // proposed: hooks in Jordanian Arabic, as RevUp opens its reels
  const GRID_PROP = [
    { k: 'talk', hook: 'PPF ولا سيراميك؟', l: ['صاحب المركز يشرح', 'The owner explains'] },
    { k: 'ba', l: ['جرافين', 'Graphene'] },
    { k: 'talk', hook: 'قديش بعيش التظليل؟', l: ['ريل سؤال وجواب', 'Question and answer reel'] },
    { k: 'make', hook: 'Rolls-Royce', l: ['PPF كامل', 'Full PPF'] },
    { k: 'talk', hook: '3 غلطات بغسيل السيارة', l: ['نصيحة', 'Tip'] },
    { k: 'ba', l: ['تلميع', 'Polish'] },
    { k: 'talk', hook: 'سيارة وحدة من الصبح للمسا', l: ['من الاستلام للتسليم', 'Drop-off to pick-up'] },
    { k: 'make', hook: 'G-Class', l: ['تظليل', 'Tint'] },
    { k: 'ba', l: ['PPF', 'PPF'] },
  ];
  const CHANGES = [
    ['شخص يتكلم أمام الكاميرا في الريلز: صاحب المركز أو أحد الفريق.', 'A person speaks on camera in the reels: the owner or a team member.'],
    ['أول لقطة فيها نص عربي كبير: سؤال أو رقم.', 'The first frame has big Arabic text: a question or a number.'],
    ['قبل وبعد لكل خدمة، من نفس الزاوية.', 'Before and after for each service, from the same angle.'],
    ['قصص مميزة لكل خدمة ولكل نوع سيارة، وواحدة للحجز.', 'Highlights for each service and each car make, and one for booking.'],
    ['زر واتساب للحجز في البايو.', 'A WhatsApp booking button in the bio.'],
  ];
  const TODAY_NOTES = [
    ['صور وريلز لسيارات أمام المبنى.', 'Photos and reels of cars in front of the building.'],
    ['لا يتكلم أحد أمام الكاميرا.', 'No person speaks on camera.'],
    ['الحجز برقم هاتف في البايو.', 'Bookings through a phone number in the bio.'],
  ];
  const REF = [
    ['@revup_garage، أبوظبي: 47 ألف متابع، 332 منشوراً.', '@revup_garage, Abu Dhabi: 47K followers, 332 posts.'],
    ['المؤسسون يتكلمون في الريلز، مثل «6 أسباب لفحص سيارتك».', 'The founders speak in the reels, for example "6 reasons to check your car".'],
    ['قصص مميزة باسم كل علامة سيارات.', 'Highlights named after each car make.'],
  ];

  const ICO = {
    reel: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 8.5v7l6-3.5z" fill="currentColor"/></svg>',
    person: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    car: '<svg viewBox="0 0 48 24" aria-hidden="true"><path d="M4 17h40M8 17l3-6c1-2 2-3 5-3h14c3 0 5 1 7 3l4 6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="13" cy="18" r="3" fill="currentColor"/><circle cx="35" cy="18" r="3" fill="currentColor"/></svg>',
  };
  const CSS = `
  .pvs{padding:120px 0 80px}
  .pvs .wrap{max-width:1180px;margin:0 auto;padding:0 clamp(16px,4vw,48px)}
  .pvs h2{font-size:clamp(34px,6vw,64px);line-height:1;margin-bottom:12px}
  .pvs .sub{color:var(--text2);max-width:760px}
  .pv-seg{display:inline-flex;border:1px solid var(--line2);border-radius:999px;padding:3px;margin:22px 0 26px}
  .pv-seg button{border:0;background:none;color:var(--text2);font:inherit;font-weight:700;padding:9px 20px;border-radius:999px;cursor:pointer;min-height:40px}
  .pv-seg button[aria-pressed=true]{background:var(--text);color:var(--bg)}
  .pv-lay{display:grid;grid-template-columns:minmax(0,400px) minmax(0,1fr);gap:40px;align-items:start}.pv-lay>*{min-width:0}.pvs *{box-sizing:border-box}
  .pv-phone{border:1px solid var(--line2);border-radius:36px;background:var(--bg2);padding:18px 14px 14px;box-shadow:0 30px 60px rgba(0,0,0,.08)}
  .pv-top{display:flex;align-items:center;gap:16px;padding:6px 4px 10px}
  .pv-av{width:78px;height:78px;border-radius:50%;flex:none;display:grid;place-items:center;background:#111;color:#fff;font-weight:800;letter-spacing:.04em;font-size:15px;box-shadow:0 0 0 3px var(--bg2),0 0 0 5px #111}
  .pv-stats{display:grid;grid-template-columns:repeat(3,1fr);flex:1;text-align:center}
  .pv-stats b{display:block;font-size:17px}.pv-stats span{font-size:12px;color:var(--text2)}
  .pv-name{font-weight:800;padding:0 4px}
  .pv-bio{font-size:13px;color:var(--text2);padding:2px 4px 10px;display:flex;flex-direction:column;gap:1px}
  .pv-btns{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:0 4px 12px}
  .pv-btns span{border-radius:9px;background:var(--line);text-align:center;font-weight:700;font-size:13px;padding:7px 0}
  .pv-btns span:first-child{background:#111;color:#fff}
  .pv-hl{display:flex;gap:12px;overflow-x:auto;padding:2px 4px 12px;scrollbar-width:none}
  .pv-hl div{flex:none;width:62px;text-align:center;font-size:11px;color:var(--text2)}
  .pv-hl i{display:grid;place-items:center;width:58px;height:58px;margin:0 auto 4px;border-radius:50%;border:1px solid var(--line2);background:var(--bg);color:var(--text)}
  .pv-hl i svg{width:28px}
  .pv-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border-radius:6px;overflow:hidden}
  .pv-t{position:relative;aspect-ratio:3/4;display:flex;flex-direction:column;justify-content:flex-end;padding:8px;color:#fff;background:#2a2a2a;overflow:hidden}
  .pv-t.photo{background:linear-gradient(160deg,#d9d9d9,#9c9c9c);color:#111}
  .pv-t.reel{background:linear-gradient(160deg,#bdbdbd,#6f6f6f)}
  .pv-t .car{position:absolute;inset:32% 14% auto;color:inherit;opacity:.55}
  .pv-t .ri{position:absolute;top:6px;inset-inline-end:6px;width:18px;height:18px;color:#fff}
  .pv-t small{font-size:10.5px;line-height:1.25;font-weight:600}
  .pv-t.talk{background:#111}
  .pv-t.talk .hook{position:absolute;top:12%;inset-inline:8px;font-weight:800;font-size:15px;line-height:1.2;text-align:center}
  .pv-t.talk .pi{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);width:44%;opacity:.5}
  .pv-t.ba{background:none;padding:0;color:#111}
  .pv-t.ba .h{flex:1;display:grid;place-items:center;font-weight:800;font-size:12px;letter-spacing:.06em}
  .pv-t.ba .h:first-child{background:#8a8a8a;color:#fff}.pv-t.ba .h:nth-child(2){background:#efefef}
  .pv-t.ba small{position:absolute;bottom:6px;inset-inline-start:8px;color:#111}
  .pv-t.make{background:#e9e9e9;color:#111}
  .pv-t.make .hook{position:absolute;top:14%;inset-inline:8px;text-align:center;font-weight:800;font-size:16px}
  .pv-side h3{font-size:13px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 10px}
  .pv-side ul{list-style:none;margin:0 0 26px;padding:0;display:flex;flex-direction:column;gap:9px}
  .pv-side li{border-top:1px solid var(--line);padding-top:9px;color:var(--text2)}
  .pv-note{font-size:12.5px;color:var(--muted);margin-top:10px}
  @media(max-width:860px){.pv-lay{grid-template-columns:1fr}.pv-phone{max-width:400px;width:100%;margin:0 auto}}`;

  function tile(t) {
    if (t.k === 'photo' || t.k === 'reel') return `<div class="pv-t ${t.k}">${t.k === 'reel' ? `<span class="ri">${ICO.reel}</span>` : ''}<span class="car">${ICO.car}</span><small>${esc(tx(T[t.k]))} · ${R(tx(t.l))}</small></div>`;
    if (t.k === 'talk') return `<div class="pv-t talk"><span class="ri">${ICO.reel}</span><span class="hook" lang="ar" dir="rtl">${esc(t.hook)}</span><span class="pi">${ICO.person}</span><small>${R(tx(t.l))}</small></div>`;
    if (t.k === 'make') return `<div class="pv-t make"><span class="hook">${esc(t.hook)}</span><span class="car">${ICO.car}</span><small>${R(tx(t.l))}</small></div>`;
    return `<div class="pv-t ba"><span class="h">${esc(tx(T.before))}</span><span class="h">${esc(tx(T.after))}</span><small>${R(tx(t.l))}</small></div>`;
  }
  function render(el, ctx) {
    CTX = ctx; LANG = ctx.lang;
    if (!document.getElementById('pv-css')) { const st = document.createElement('style'); st.id = 'pv-css'; st.textContent = CSS; document.head.appendChild(st); }
    const prop = MODE === 'proposed';
    const bio = prop ? BIO_PROP : BIO_TODAY, hl = prop ? HL_PROP : HL_TODAY, grid = prop ? GRID_PROP : GRID_TODAY;
    el.innerHTML = `<section class="pvs" id="pv-sccc" data-label="@sccc.jo"><div class="wrap">
      <h2>${esc(tx(T.h))}</h2><p class="sub">${R(tx(T.sub))}</p>
      <div class="pv-seg" role="group" aria-label="${esc(tx(T.h))}"><button type="button" data-pvmode="today" aria-pressed="${!prop}">${esc(tx(T.today))}</button><button type="button" data-pvmode="proposed" aria-pressed="${prop}">${esc(tx(T.prop))}</button></div>
      <div class="pv-lay">
        <div><div class="pv-phone" aria-label="@sccc.jo">
          <div class="pv-top"><span class="pv-av" aria-hidden="true">S.C.C.C</span><div class="pv-stats"><div><b>227</b><span>${esc(tx(T.posts))}</span></div><div><b>19.9K</b><span>${esc(tx(T.fol))}</span></div><div><b>4</b><span>${esc(tx(T.fing))}</span></div></div></div>
          <div class="pv-name">Sccc</div>
          <div class="pv-bio">${bio.map((b) => `<span dir="auto">${esc(tx(b))}</span>`).join('')}</div>
          <div class="pv-btns"><span>${esc(tx(T.follow))}</span><span>${esc(tx(T.msg))}</span><span>${esc(tx(prop ? T.book : T.msg))}</span></div>
          <div class="pv-hl">${hl.map((h) => `<div><i>${ICO.car}</i>${esc(tx(h))}</div>`).join('')}</div>
          <div class="pv-grid">${grid.map(tile).join('')}</div>
        </div><p class="pv-note">${esc(tx(T.statsNote))}</p></div>
        <div class="pv-side">
          ${prop ? `<h3>${esc(tx(T.changesH))}</h3><ul>${CHANGES.map((c) => `<li>${R(tx(c))}</li>`).join('')}</ul>` : `<h3>${esc(tx(T.todayH))}</h3><ul>${TODAY_NOTES.map((c) => `<li>${R(tx(c))}</li>`).join('')}</ul>`}
          <h3>${esc(tx(T.refH))}</h3><ul>${REF.map((c) => `<li>${R(tx(c))}</li>`).join('')}</ul>
        </div>
      </div></div></section>`;
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pvmode]'); if (!b || !CTX) return;
    MODE = b.dataset.pvmode === 'today' ? 'today' : 'proposed';
    try { localStorage.setItem('sccc-pvmode', MODE); } catch (err) { /* storage blocked */ }
    render(document.getElementById('pagesView'), CTX);
    const again = document.querySelector(`[data-pvmode="${MODE}"]`); if (again) again.focus({ preventScroll: true });
  });
  window.PV = { render };
})();
