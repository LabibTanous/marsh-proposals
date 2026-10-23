/* Review kit — section-by-section feedback for partners (Marsh).
   Each section gets a "Note" button: keep / change / remove, the fill-in fields it is missing, and a comment.
   Saves go to /api/feedback (Supabase + Telegram). A local draft keeps the text if a save fails.
   Config: window.REVIEW = { site, title:{ar,en}, author, sections: { key: { label, known:[], fields:[] } }, general: {...},
                             targets(): [{ el, key, label }] } */
(function () {
  'use strict';
  const C = window.REVIEW;
  if (!C) { console.error('review kit: no window.REVIEW config'); return; }
  const API = C.api || '/api/feedback';
  const html = document.documentElement;
  const lang = () => (html.lang === 'en' ? 'en' : 'ar');
  const L = (o) => (o == null ? '' : typeof o === 'string' ? o : (o[lang()] ?? o.en ?? o.ar ?? ''));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem('rk-' + C.site + '-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('rk-' + C.site + '-' + k, JSON.stringify(v)); } catch (e) { /* private mode: the draft lives only in memory */ } },
  };
  const U = {
    note: { ar: 'ملاحظة', en: 'Note' }, edit: { ar: 'تعديل الملاحظة', en: 'Edit note' }, done: { ar: 'تم', en: 'Done' },
    keep: { ar: 'كما هو', en: 'Keep' }, change: { ar: 'يحتاج تعديل', en: 'Change' }, remove: { ar: 'احذفه', en: 'Remove' },
    known: { ar: 'مسجّل عندنا (سيُطبّق)', en: 'Already noted (will be applied)' }, fill: { ar: 'املأ ما تعرفه', en: 'Fill in what you know' },
    comment: { ar: 'تعليقك', en: 'Your comment' }, commentPh: { ar: 'اكتب أو استخدم الإملاء الصوتي في لوحة المفاتيح', en: 'Type, or use the keyboard microphone' },
    save: { ar: 'حفظ وإرسال', en: 'Save and send' }, cancel: { ar: 'إغلاق', en: 'Close' }, saving: { ar: 'جارٍ الإرسال…', en: 'Sending…' },
    saved: { ar: 'تم الإرسال', en: 'Sent' }, failed: { ar: 'لم يُرسل. محفوظ على هذا الجهاز. حاول مرة ثانية.', en: 'Not sent. Kept on this device. Try again.' },
    retry: { ar: 'إعادة المحاولة', en: 'Try again' }, general: { ar: 'ملاحظات عامة', en: 'General notes' }, name: { ar: 'اسمك', en: 'Your name' },
    progress: { ar: (a, b) => `${a} من ${b} أقسام`, en: (a, b) => `${a} of ${b} sections` }, hide: { ar: 'إخفاء', en: 'Hide' }, show: { ar: 'الملاحظات', en: 'Notes' },
    from: { ar: 'من', en: 'from' }, to: { ar: 'إلى', en: 'to' }, jod: { ar: 'دينار', en: 'JOD' }, yes: { ar: 'نعم', en: 'Yes' }, no: { ar: 'لا', en: 'No' }, unsure: { ar: 'غير متأكد', en: 'Not sure' },
    rangeHint: { ar: 'إذا لم تكن متأكداً، اكتب مدى (من – إلى).', en: 'If you are not sure, enter a range (from – to).' },
    lastSaved: { ar: 'آخر إرسال', en: 'Last sent' }, nothing: { ar: 'اختر، أو املأ حقلاً، أو اكتب تعليقاً أولاً.', en: 'Pick, fill a field or write a comment first.' },
    intro: { ar: 'اضغط «ملاحظة» على أي قسم. كل حفظ يصل إلى لبيب مباشرة.', en: 'Tap "Note" on any section. Each save reaches Labib straight away.' },
  };
  const T = (k, ...a) => { const v = L(U[k]); return typeof v === 'function' ? v(...a) : v; };

  /* ---------- state ---------- */
  const clientId = store.get('cid', null) || (() => { const id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()).slice(0, 36); store.set('cid', id); return id; })();
  let author = store.get('author', C.author || '');
  const drafts = store.get('drafts', {});       // key -> {choice, fields, comment}
  const sent = store.get('sent', {});           // key -> {at, sig}
  const keyOfPath = () => (C.pageKey ? C.pageKey() : (location.pathname.replace(/^\/en(\/|$)/, '/').replace(/index\.html$/, '').replace(/(.)\/$/, '$1') || '/'));
  let pageKey = keyOfPath(), lastPath = location.pathname;

  /* ---------- styles ---------- */
  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = C.css || (C.base || '') + 'review.css'; document.head.appendChild(css);
  /* per-site placement fixes (e.g. keep buttons clear of a page's fixed nav) */
  if (C.extraCss) { const st = document.createElement('style'); st.textContent = C.extraCss; document.head.appendChild(st); }

  /* ---------- UI: bar, section buttons, panel ---------- */
  const root = document.createElement('div'); root.className = 'rk-root'; root.setAttribute('dir', 'auto');
  root.innerHTML = '<div class="rk-bar" role="region"></div><div class="rk-scrim" hidden></div><aside class="rk-panel" role="dialog" aria-modal="true" hidden></aside><div class="rk-toast" aria-live="polite"></div>';
  document.body.appendChild(root);
  const bar = root.querySelector('.rk-bar'), scrim = root.querySelector('.rk-scrim'), panel = root.querySelector('.rk-panel'), toast = root.querySelector('.rk-toast');
  let targets = [];
  let hidden = store.get('hidden', false);

  function toastMsg(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(toastMsg.t); toastMsg.t = setTimeout(() => toast.classList.remove('on'), 3200); }

  function cfgFor(key) { return (C.sections && (C.sections[fullKey(key)] || C.sections[key])) || {}; }
  function fullKey(k) { return `${pageKey}#${k}`; }

  function attach() {
    document.querySelectorAll('.rk-btn').forEach((b) => b.remove());
    targets = (C.targets ? C.targets() : []).filter((t) => t.el);
    targets.forEach((t) => {
      t.el.classList.add('rk-target');
      const b = document.createElement('button'); b.type = 'button'; b.className = 'rk-btn'; b.dataset.key = t.key;
      t.el.appendChild(b);
      b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); open(t.key); });
    });
    paint();
  }
  function paint() {
    root.dir = lang() === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('.rk-btn').forEach((b) => {
      const k = fullKey(b.dataset.key), s = sent[k];
      b.classList.toggle('ok', !!s);
      b.innerHTML = `<span aria-hidden="true">${s ? '✓' : '💬'}</span> ${esc(s ? T('edit') : T('note'))}`;
    });
    const n = targets.filter((t) => sent[fullKey(t.key)]).length;
    bar.classList.toggle('min', hidden);
    bar.innerHTML = hidden
      ? `<button type="button" class="rk-pill" data-act="show">💬 ${esc(T('show'))} · ${n}/${targets.length}</button>`
      : `<div class="rk-bar-in"><div class="rk-b-t"><b>${esc(L(C.title))}</b><span>${esc(T('progress', n, targets.length))}</span></div>
         <div class="rk-b-a"><button type="button" class="rk-pill solid" data-act="general">📝 ${esc(T('general'))}</button><button type="button" class="rk-pill" data-act="hide">${esc(T('hide'))}</button></div>
         <p class="rk-b-i">${esc(T('intro'))}</p></div>`;
    document.body.classList.toggle('rk-hidden', hidden);
  }
  bar.addEventListener('click', (e) => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'hide') { hidden = true; store.set('hidden', true); paint(); }
    if (a.dataset.act === 'show') { hidden = false; store.set('hidden', false); paint(); }
    if (a.dataset.act === 'general') open('general');
  });

  /* ---------- fields ---------- */
  function fieldHtml(f, val) {
    const id = `rk-f-${f.id}`, lab = `<label class="rk-l" for="${id}">${esc(L(f.label))}</label>`, hint = f.hint ? `<p class="rk-h">${esc(L(f.hint))}</p>` : '';
    const v = val ?? '';
    switch (f.type) {
      case 'textarea': return `<div class="rk-f">${lab}${hint}<textarea id="${id}" data-f="${f.id}" rows="${f.rows || 3}" placeholder="${esc(L(f.ph))}">${esc(v)}</textarea></div>`;
      case 'number': return `<div class="rk-f">${lab}${hint}<input id="${id}" data-f="${f.id}" type="number" inputmode="decimal" value="${esc(v)}" placeholder="${esc(L(f.ph))}"></div>`;
      case 'price': {
        const o = typeof v === 'object' && v ? v : {};
        return `<div class="rk-f">${lab}${hint}<div class="rk-range"><input aria-label="${esc(L(f.label))} ${esc(T('from'))}" data-f="${f.id}" data-part="from" type="number" inputmode="decimal" value="${esc(o.from ?? '')}" placeholder="${esc(T('from'))}"><span>–</span><input aria-label="${esc(L(f.label))} ${esc(T('to'))}" data-f="${f.id}" data-part="to" type="number" inputmode="decimal" value="${esc(o.to ?? '')}" placeholder="${esc(T('to'))}"><em>${esc(L(f.unit) || T('jod'))}</em></div></div>`;
      }
      case 'select': case 'yesno': {
        const opts = f.type === 'yesno' ? [{ v: 'yes', l: U.yes }, { v: 'no', l: U.no }, { v: 'unsure', l: U.unsure }] : f.options.map((o) => ({ v: o.v, l: o }));
        return `<div class="rk-f">${lab}${hint}<div class="rk-chips" role="radiogroup" aria-label="${esc(L(f.label))}">${opts.map((o) => `<button type="button" role="radio" class="rk-chip" data-f="${f.id}" data-v="${esc(o.v)}" aria-checked="${v === o.v}">${esc(L(o.l))}</button>`).join('')}</div></div>`;
      }
      case 'multi': {
        const arr = Array.isArray(v) ? v : [];
        return `<div class="rk-f">${lab}${hint}<div class="rk-chips">${f.options.map((o) => `<button type="button" class="rk-chip" data-f="${f.id}" data-multi="1" data-v="${esc(o.v)}" aria-pressed="${arr.includes(o.v)}">${esc(L(o))}</button>`).join('')}</div></div>`;
      }
      default: return `<div class="rk-f">${lab}${hint}<input id="${id}" data-f="${f.id}" type="${f.type === 'url' ? 'url' : 'text'}" value="${esc(v)}" placeholder="${esc(L(f.ph))}" ${f.dir ? `dir="${f.dir}"` : ''}></div>`;
    }
  }

  /* ---------- panel ---------- */
  let cur = null, lastFocus = null;
  function open(key) {
    const isGen = key === 'general', k = isGen ? `site#general` : fullKey(key);
    const t = targets.find((x) => x.key === key), c = isGen ? (C.general || {}) : cfgFor(key);
    const label = isGen ? T('general') : L(c.label) || (t && t.label) || key;
    const d = drafts[k] || { choice: '', fields: {}, comment: '' };
    cur = { key, k, label, c, d: JSON.parse(JSON.stringify(d)) };
    lastFocus = document.activeElement;
    const s = sent[k];
    panel.innerHTML = `<header><div><span class="rk-k">${esc(isGen ? L(C.title) : pageLabel())}</span><h3>${esc(label)}</h3></div><button type="button" class="rk-x" data-act="close" aria-label="${esc(T('cancel'))}">×</button></header>
      <div class="rk-body">
        ${c.known && c.known.length ? `<div class="rk-known"><b>${esc(T('known'))}</b><ul>${c.known.map((x) => `<li>${esc(L(x))}</li>`).join('')}</ul></div>` : ''}
        ${isGen || c.noChoice ? '' : `<div class="rk-chips rk-choice" role="radiogroup" aria-label="${esc(label)}">${['keep', 'change', 'remove'].map((x) => `<button type="button" role="radio" class="rk-chip ${x}" data-choice="${x}" aria-checked="${cur.d.choice === x}">${esc(T(x))}</button>`).join('')}</div>`}
        ${c.fields && c.fields.length ? `<p class="rk-sub">${esc(T('fill'))}${c.fields.some((f) => f.type === 'price') ? ` · ${esc(T('rangeHint'))}` : ''}</p>${c.fields.map((f) => fieldHtml(f, cur.d.fields[f.id])).join('')}` : ''}
        <div class="rk-f"><label class="rk-l" for="rk-comment">${esc(T('comment'))}</label><textarea id="rk-comment" rows="4" placeholder="${esc(T('commentPh'))}">${esc(cur.d.comment)}</textarea></div>
        <div class="rk-f"><label class="rk-l" for="rk-author">${esc(T('name'))}</label><input id="rk-author" type="text" value="${esc(author)}" autocomplete="name"></div>
      </div>
      <footer><p class="rk-status" aria-live="polite">${s ? `${esc(T('lastSaved'))}: ${esc(new Date(s.at).toLocaleString(lang() === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }))}` : ''}</p><button type="button" class="rk-pill" data-act="close">${esc(T('cancel'))}</button><button type="button" class="rk-pill solid" data-act="save">${esc(T('save'))}</button></footer>`;
    panel.hidden = false; scrim.hidden = false; document.body.classList.add('rk-open');
    requestAnimationFrame(() => panel.classList.add('on'));
    (panel.querySelector('[aria-checked=true]') || panel.querySelector('.rk-chip, input, textarea'))?.focus({ preventScroll: true });
  }
  function close() {
    if (!cur) return; saveDraft(); cur = null;
    panel.classList.remove('on'); scrim.hidden = true; document.body.classList.remove('rk-open');
    setTimeout(() => { panel.hidden = true; }, 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function pageLabel() { return (C.pageLabel ? C.pageLabel(pageKey) : pageKey); }
  function readPanel() {
    if (!cur) return;
    const d = cur.d;
    panel.querySelectorAll('input[data-f],textarea[data-f]').forEach((el) => {
      const f = el.dataset.f;
      if (el.dataset.part) { d.fields[f] = d.fields[f] && typeof d.fields[f] === 'object' ? d.fields[f] : {}; d.fields[f][el.dataset.part] = el.value.trim(); if (!d.fields[f].from && !d.fields[f].to) delete d.fields[f]; }
      else if (el.value.trim()) d.fields[f] = el.value.trim(); else delete d.fields[f];
    });
    d.comment = panel.querySelector('#rk-comment').value.trim();
    author = panel.querySelector('#rk-author').value.trim(); store.set('author', author);
  }
  function saveDraft() { if (!cur) return; readPanel(); drafts[cur.k] = cur.d; store.set('drafts', drafts); }

  panel.addEventListener('click', (e) => {
    const ch = e.target.closest('[data-choice]');
    if (ch) { cur.d.choice = cur.d.choice === ch.dataset.choice ? '' : ch.dataset.choice; panel.querySelectorAll('[data-choice]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.choice === cur.d.choice))); saveDraft(); return; }
    const chip = e.target.closest('.rk-chip[data-f]');
    if (chip) {
      const f = chip.dataset.f, v = chip.dataset.v;
      if (chip.dataset.multi) { const arr = Array.isArray(cur.d.fields[f]) ? cur.d.fields[f] : []; const i = arr.indexOf(v); i >= 0 ? arr.splice(i, 1) : arr.push(v); if (arr.length) cur.d.fields[f] = arr; else delete cur.d.fields[f]; chip.setAttribute('aria-pressed', String(arr.includes(v))); }
      else { cur.d.fields[f] = cur.d.fields[f] === v ? undefined : v; if (cur.d.fields[f] === undefined) delete cur.d.fields[f]; panel.querySelectorAll(`.rk-chip[data-f="${CSS.escape(f)}"]`).forEach((b) => b.setAttribute('aria-checked', String(b.dataset.v === cur.d.fields[f]))); }
      saveDraft(); return;
    }
    const a = e.target.closest('[data-act]'); if (!a) return;
    if (a.dataset.act === 'close') close();
    if (a.dataset.act === 'save') submit();
  });
  panel.addEventListener('input', () => saveDraft());
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (!cur) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { const f = [...panel.querySelectorAll('button,input,textarea')].filter((x) => !x.disabled); if (!f.length) return; if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
  });

  /* the filled fields as [English question, English answer] pairs, so the Telegram ping and the capture file read plainly */
  function readable(d) {
    const c = cur.key === 'general' ? (C.general || {}) : cfgFor(cur.key);
    const en = (x) => (x && typeof x === 'object' ? (x.en ?? x.ar ?? '') : String(x ?? ''));
    return (c.fields || []).filter((f) => d.fields[f.id] !== undefined).map((f) => {
      const v = d.fields[f.id];
      const pick = (x) => en((f.options || []).find((o) => o.v === x) || x);
      let txt;
      if (f.type === 'price') txt = `${[v.from, v.to].filter(Boolean).join(' to ')} ${en(f.unit) || 'JOD'}`;
      else if (f.type === 'select' || f.type === 'multi') txt = Array.isArray(v) ? v.map(pick).join(', ') : pick(v);
      else txt = String(v);
      return [en(f.label), txt];
    });
  }

  async function submit() {
    readPanel();
    const d = cur.d, empty = !d.choice && !d.comment && !Object.keys(d.fields).length;
    const st = panel.querySelector('.rk-status');
    if (empty) { st.textContent = T('nothing'); st.className = 'rk-status err'; return; }
    const btn = panel.querySelector('[data-act=save]'); btn.disabled = true; st.className = 'rk-status'; st.textContent = T('saving');
    const body = { site: C.site, page: cur.key === 'general' ? 'site' : pageKey, section: cur.k, label: cur.label, choice: d.choice || '', fields: d.fields, readable: readable(d), comment: d.comment, author, lang: lang(), client_id: clientId };
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || `HTTP ${r.status}`);
      sent[cur.k] = { at: Date.now(), id: j.id }; store.set('sent', sent);
      drafts[cur.k] = d; store.set('drafts', drafts);
      toastMsg(`✓ ${T('saved')} · ${cur.label}`);
      close(); paint();
    } catch (err) {
      console.error('review kit: save failed', err);
      st.className = 'rk-status err'; st.textContent = `${T('failed')} (${err.message})`;
      btn.disabled = false; btn.textContent = T('retry');
      saveDraft();
    }
  }

  /* ---------- restore what was already sent (other device) ---------- */
  async function restore() {
    if (C.noRestore) return;   // the Supabase function takes POST only
    try {
      const r = await fetch(`${API}?site=${encodeURIComponent(C.site)}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      (j.rows || []).forEach((row) => {
        const k = row.section, at = Date.parse(row.created_at);
        if (!sent[k] || sent[k].at < at) {
          sent[k] = { at, id: row.id };
          if (!drafts[k] || (drafts[k].savedAt || 0) < at) drafts[k] = { choice: row.choice || '', fields: row.fields || {}, comment: row.comment || '' };
        }
      });
      store.set('sent', sent); store.set('drafts', drafts); paint();
    } catch (e) { console.error('review kit: could not load earlier notes', e); }
  }

  // Pages built with React (Next.js) re-render after load: start once the page is quiet, then keep the kit attached.
  function start() { attach(); restore(); }
  function keepAlive() {
    if (!document.body.contains(root)) document.body.appendChild(root);
    if (location.pathname !== lastPath) { lastPath = location.pathname; pageKey = keyOfPath(); attach(); return; }
    const want = (C.targets ? C.targets() : []).filter((t) => t.el).length;
    if (want && document.querySelectorAll('.rk-btn').length < want) attach();
  }
  const boot = () => setTimeout(() => { start(); setInterval(keepAlive, 1200); }, C.delay ?? 700);
  if (document.readyState === 'complete') boot(); else addEventListener('load', boot, { once: true });
  new MutationObserver(() => paint()).observe(html, { attributes: true, attributeFilter: ['lang'] });
  window.ReviewKit = { open, attach, paint };
})();
