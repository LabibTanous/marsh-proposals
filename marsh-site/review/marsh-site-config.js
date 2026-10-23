/* Review kit config — Marsh website preview on the GitHub Pages mirror (river home, 23 Oct 2026).
   Saves go to the Supabase function site-feedback, site 'marsh-site'. */
(function () {
  var BASE = '/marsh-proposals/marsh-site';
  var L = function (ar, en) { return { ar: ar, en: en }; };
  var S = {
    '/#hero': { label: L('الرئيسية · البداية', 'Home · Opening'), known: [
      L('23 تشرين الأول: نبدأ بشركات الإسكان والمؤثرين', '23 Oct: lead with housing developers and influencers'),
      L('17 تشرين الأول: «الأردن» بدل عمّان وإربد', '17 Oct: "Jordan", not Amman and Irbid'),
    ], fields: [
      { id: 'countries', type: 'text', label: L('الدول التي لديك فيها عملاء (اختياري)', 'Countries where you have clients (optional)') },
    ] },
    '/#s0': { label: L('الرئيسية · النهر (الخدمات)', 'Home · The river (services)'), known: [
      L('23 تشرين الأول: كل فرع من النهر خدمة، والتمرير مثل فيلم قصير', '23 Oct: each branch of the river is one service; scrolling plays like a short film'),
    ], fields: [
      { id: 'branches', type: 'textarea', label: L('خدمة نضيفها أو نحذفها أو نعيد تسميتها', 'A service to add, remove or rename'), rows: 3 },
    ] },
    '/#s1': { label: L('الرئيسية · من نحن', 'Home · About us'), known: [L('نصّك من 23 تشرين الأول، مع «marketing workflows»', 'Your text of 23 Oct, with "marketing workflows"')] },
    '/#s2': { label: L('الرئيسية · دراسات الحالة', 'Home · Case studies'), known: [L('الأرقام تأتي من بيانات Meta بعد الربط. بدون أسماء.', 'Numbers come from the Meta data after you connect it. No names.')], fields: [
      { id: 'logos', type: 'textarea', label: L('شعارات العملاء المسموح عرضها', 'Client logos we may show'), rows: 3 },
      { id: 'revenue', type: 'textarea', label: L('أرقام مبيعات لثلاث حالات (اختياري)', 'Revenue figures for three cases (optional)'), rows: 3 },
    ] },
    '/#s4': { label: L('الرئيسية · احجز مكالمة', 'Home · Book a call'), fields: [
      { id: 'hours', type: 'text', label: L('أوقات المكالمات (اختياري)', 'Call times (optional)') },
    ] },
  };
  window.REVIEW = {
    site: 'marsh-site',
    author: 'Safi',
    title: L('ملاحظات موقع مارش · النهر', 'Marsh website notes · the river'),
    api: 'https://jwvgyktutbeszguevqoy.supabase.co/functions/v1/site-feedback',
    base: BASE + '/review/',
    sections: S,
    general: { fields: [
      { id: 'logos', type: 'textarea', label: L('شعارات العملاء المسموح عرضها', 'Client logos we may show'), rows: 3 },
      { id: 'newCopy', type: 'textarea', label: L('نص جديد للموقع', 'New text for the site'), rows: 5 },
    ] },
    pageKey: function () {
      var p = location.pathname.replace(BASE, '').replace(/^\/en(\/|$)/, '/').replace(/index\.html$/, '').replace(/(.)\/$/, '$1');
      return p || '/';
    },
    pageLabel: function (k) { return k; },
    targets: function () {
      var main = document.querySelector('main'); if (!main) return [];
      var out = [], head = function (el) { var h = el.querySelector('h1,h2,h3'); return ((h && h.textContent) || '').trim().slice(0, 80); };
      var h1 = main.querySelector('h1');
      if (h1) { var el = h1; while (el.parentElement && el.parentElement !== main) el = el.parentElement; if (el.tagName !== 'SECTION') out.push({ el: el, key: 'hero', label: head(el) }); }
      main.querySelectorAll(':scope > section').forEach(function (s, i) { out.push({ el: s, key: 's' + i, label: head(s) }); });
      return out;
    },
  };
})();
