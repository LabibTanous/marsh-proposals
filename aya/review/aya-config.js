/* Review kit config — Aya's Ark mansaf film proposal. Opens only with ?review=1 so the client never sees it.
   Sources: meetings/2026-10-23-safi/PLAN.md D-1, CONTEXT-WHATSAPP.md section 7. Saves go to the Supabase function site-feedback. */
(function () {
  const L = (ar, en) => ({ ar, en });
  const price = (id, ar, en) => ({ id, type: 'price', label: L(ar, en), unit: L('العملة في التعليق', 'currency in the comment') });
  const S = {
    top: { label: L('الغلاف', 'Cover'), fields: [
      { id: 'title', type: 'text', label: L('عنوان آخر للفيلم؟', 'A different film title?') },
    ] },
    asked: { label: L('ما طلبتِه', 'What you asked for'), known: [L('20 تشرين الأول: النص، صورتان، ورسالة صوتية من آية إلى صافي', '20 Oct: the text, 2 images and a voice note from Aya to Safi')] },
    short: { label: L('الفيلم باختصار', 'The film in short') },
    test: { label: L('المشهد التجريبي', 'Test scene'), known: [L('ينتظر «batta» من لبيب قبل أي توليد مدفوع', 'Waits for Labib\'s "batta" before any paid generation')], fields: [
      price('pTest', 'سعر المشهد التجريبي (0 = مجاناً)', 'Test scene price (0 = free)'),
    ] },
    terms: { label: L('الشروط', 'Terms'), fields: [
      { id: 'due', type: 'text', label: L('موعد التسليم', 'Delivery date') },
      { id: 'wedding', type: 'text', label: L('تاريخ العرس (إن كان معروفاً)', 'Wedding date (if known)') },
      { id: 'currency', type: 'select', label: L('العملة', 'Currency'), options: [{ v: 'usd', ar: 'دولار', en: 'USD' }, { v: 'jod', ar: 'دينار', en: 'JOD' }] },
      { id: 'payment', type: 'text', label: L('شروط الدفع', 'Payment terms') },
      { id: 'music', type: 'text', label: L('مصدر الموسيقى والترخيص', 'Music source and licence') },
    ] },
    next: { label: L('الخطوة التالية', 'Next step') },
    board: { label: L('المشاهد', 'Storyboard') },
    refs: { label: L('المراجع', 'References') },
    how: { label: L('كيف نصنعه', 'How it is made') },
    versions: { label: L('النسخ والتعديلات', 'Versions') },
    files: { label: L('الملفات', 'Delivery files'), fields: [
      { id: 'photos', type: 'number', label: L('عدد الصور في مجموعة الصور', 'Number of photos in the photo set') },
      { id: 'recap', type: 'text', label: L('مدة فيلم يوم العرس', 'Length of the wedding-day film') },
    ] },
    plans: { label: L('الخطط والأسعار', 'Plans and fees'), fields: [
      price('pFilm', 'الفيلم فقط', 'Film only'),
      price('pCut', 'الفيلم + نسخة عمودية + صور', 'Film + vertical cut + photos'),
      price('pEvent', 'الفيلم + تغطية يوم العرس', 'Film + coverage on the day'),
      price('pPhotos', 'إضافة: مجموعة صور', 'Add-on: photo set'),
      price('pRev', 'إضافة: جولة تعديل إضافية', 'Add-on: extra revision round'),
      price('pEn', 'إضافة: نسخة بنص إنجليزي', 'Add-on: English-text version'),
      { id: 'crew', type: 'text', label: L('من يصوّر يوم العرس في أمريكا؟', 'Who films on the wedding day in the USA?') },
    ] },
  };
  window.REVIEW = {
    site: 'aya-proposal',
    api: 'https://jwvgyktutbeszguevqoy.supabase.co/functions/v1/site-feedback',
    noRestore: true,
    author: 'Safi',
    title: L('ملاحظات عرض آية (فيلم المنسف)', 'Aya proposal notes (mansaf film)'),
    base: 'review/',
    pageKey: () => '/proposal',
    extraCss: '.rk-btn{inset-inline-end:auto;left:50%;transform:translateX(-50%);top:22px}#top>.rk-btn{top:120px}#board>.rk-btn,#plans>.rk-btn{top:96px}',
    pageLabel: () => (document.documentElement.lang === 'en' ? 'Proposal' : 'العرض'),
    sections: S,
    general: { fields: [
      { id: 'send', type: 'yesno', label: L('نرسل الرابط لآية بعد التعديلات؟', 'Send the link to Aya after the changes?') },
    ] },
    targets() {
      return [...document.querySelectorAll('main:not([hidden]) > section[id]')].map((s) => ({ el: s, key: s.id, label: (s.querySelector('h1,h2')?.textContent || s.id).trim().slice(0, 80) }));
    },
  };
})();
