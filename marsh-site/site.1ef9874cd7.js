// Marsh site: the behaviours the pages need, in plain JavaScript. Loaded with defer on every page.
// No framework. Each part finds its markup by data attributes; a page without that markup skips the part.
(function () {
  "use strict";
  // Tells the inline "js" class script in the layouts that this file ran (see app/(ar)/layout.tsx).
  window.__marshSite = true;

  // Arabic-Indic (U+0660-0669) and Persian (U+06F0-06F9) digits to ASCII, so a number typed with an Arabic
  // keyboard counts in the 7-digit check and is sent as ASCII digits.
  function asciiDigits(s) {
    return s
      .replace(/[\u0660-\u0669]/g, function (d) { return String(d.charCodeAt(0) - 0x660); })
      .replace(/[\u06f0-\u06f9]/g, function (d) { return String(d.charCodeAt(0) - 0x6f0); });
  }

  function newId() {
    try {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    } catch (e) { /* fall through */ }
    return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  }

  // The "use WhatsApp instead" line: shown by CSS when the "js" class is off, by this script when the
  // browser cannot send (no fetch).
  function showFallback(root) {
    var f = root.querySelector("[data-js-fallback]");
    if (f) f.classList.add("is-shown");
  }

  // ---- Book a call: validate, post to the Marsh lead function, show sent or failed.
  var FN = "https://jwvgyktutbeszguevqoy.supabase.co/functions/v1/site-feedback";
  var TIMEOUT = 20000;

  function clientId() {
    try {
      var k = "marsh-lead-cid";
      var v = localStorage.getItem(k);
      if (v) return v;
      var id = newId().slice(0, 36);
      localStorage.setItem(k, id);
      return id;
    } catch (e) {
      return "no-storage";
    }
  }

  // Never hangs: without AbortController the timer below still ends the wait with a failure.
  function post(body) {
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = 0;
    var request = fetch(FN, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
      .then(function (r) {
        return r.text().then(function (t) {
          var j = null;
          try { j = JSON.parse(t); } catch (e) { /* not JSON: a proxy or error page */ }
          if (!j || typeof j !== "object") return { ok: false, error: "HTTP " + r.status + ", answer is not JSON" };
          if (j.ok && j.telegram === false) console.warn("book a call: saved, but the team alert did not send (retried later)");
          return { ok: r.ok && !!j.ok, error: j.error ? j.error + " (HTTP " + r.status + ")" : r.ok ? undefined : "HTTP " + r.status };
        });
      });
    var timeout = new Promise(function (resolve) {
      timer = setTimeout(function () {
        if (ctl) ctl.abort();
        resolve({ ok: false, error: "timeout after " + TIMEOUT / 1000 + " s" });
      }, TIMEOUT);
    });
    return Promise.race([request, timeout]).then(
      function (r) { clearTimeout(timer); return r; },
      function (e) { clearTimeout(timer); return { ok: false, error: (e && e.message) || "network error" }; }
    );
  }

  function bookCall(form) {
    var root = form.closest("[data-book-call]") || document;
    var sent = root.querySelector("[data-book-sent]");
    var failed = form.querySelector("[data-book-failed]");
    var summary = form.querySelector("[data-book-summary]");
    var submit = form.querySelector("[data-book-submit]");
    var label = submit.textContent;
    var kinds = JSON.parse(form.dataset.kinds || "{}");
    var busy = false;
    // One id per filled form, sent again on every retry, so the function stores a resend once (a slow answer
    // can arrive after the lead was saved). A change to any field starts a new id.
    var sid = null;

    // The button ships disabled; a browser that cannot send keeps it off and gets the WhatsApp line.
    if (typeof window.fetch !== "function" || typeof window.Promise !== "function") {
      showFallback(root);
      return;
    }
    submit.disabled = false;

    function showErr(key, on) {
      var input = form.elements[key];
      var err = form.querySelector('[data-err="' + key + '"]');
      err.hidden = !on;
      if (on) {
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", err.id);
      } else {
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
      }
      summary.hidden = !form.querySelector("[data-err]:not([hidden])");
    }

    ["name", "phone"].forEach(function (key) {
      form.elements[key].addEventListener("input", function () {
        if (form.elements[key].getAttribute("aria-invalid")) showErr(key, false);
      });
    });
    form.addEventListener("input", function () { sid = null; });
    form.addEventListener("change", function () { sid = null; });

    function finish(r) {
      busy = false;
      if (r && r.ok && sent) {
        sid = null;
        form.hidden = true;
        sent.hidden = false;
        sent.focus();
        return;
      }
      console.warn("book a call not sent:", r && r.error);
      failed.hidden = false;
      submit.disabled = false;
      submit.textContent = label;
      submit.focus();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      var name = form.elements.name.value.trim().slice(0, 80);
      var phone = asciiDigits(form.elements.phone.value).trim().slice(0, 40);
      var kind = form.elements.kind.value;
      var message = form.elements.message.value.trim().slice(0, 2000);
      var badName = !name;
      var badPhone = phone.replace(/\D/g, "").length < 7;
      showErr("name", badName);
      showErr("phone", badPhone);
      if (badName || badPhone) {
        form.elements[badName ? "name" : "phone"].focus();
        return;
      }
      if (!sid) sid = newId();
      var body = {
        site: "marsh-site-leads",
        page: location.pathname,
        section: "book-a-call",
        label: "Book a call",
        choice: kind,
        fields: { name: name, phone: phone, kind: kind },
        readable: [["Name", name], ["Phone", phone], ["Who", kinds[kind] || "Not given"]],
        comment: message,
        author: name,
        lang: document.documentElement.lang,
        client_id: clientId(),
        submission_id: sid,
        hp: form.elements.hp_field ? form.elements.hp_field.value : "",
      };
      busy = true;
      failed.hidden = true;
      submit.disabled = true;
      submit.textContent = submit.dataset.sending;
      try {
        post(body)
          .then(function (r) {
            if (!r.ok && /^unknown site/.test(r.error || "")) return post(Object.assign({}, body, { site: "marsh-site" }));
            return r;
          })
          .then(finish, function (err) { finish({ ok: false, error: err && err.message }); });
      } catch (err) {
        finish({ ok: false, error: err && err.message });
      }
    });
  }

  // Each part runs on its own: one that throws does not stop the others.
  function safe(name, fn) {
    try {
      fn();
    } catch (e) {
      console.error("site.js: " + name + " failed:", e);
      // The river hides its cards when the "js" class is on; without a working script it must be a plain list.
      if (name === "river") document.documentElement.classList.remove("js");
      // A form whose setup failed keeps its buttons off: show its "use WhatsApp" line instead.
      if (name === "book a call" || name === "contact form") {
        Array.prototype.forEach.call(document.querySelectorAll("[data-js-fallback]"), function (f) { f.classList.add("is-shown"); });
      }
    }
  }

  var bookForm = document.querySelector("[data-book-form]");
  if (bookForm) safe("book a call", function () { bookCall(bookForm); });

  // ---- Contact form: no backend. Builds the message and hands it to WhatsApp (wa.me) or the email app.
  // Link budgets: Windows mail clients cut a mailto near 2,000 characters; one Arabic letter is 6 in a link.
  var LINK_MAX = { whatsapp: 4000, email: 1800 };

  // The old copy route, for a browser (or iframe) where the Clipboard API is missing or refused.
  function copyOld(text, back) {
    var t = document.createElement("textarea");
    t.value = text;
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.focus();
    t.select();
    t.setSelectionRange(0, text.length); // iOS selects nothing with select() alone
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { /* no copy */ }
    document.body.removeChild(t);
    if (back) back.focus();
    return ok;
  }
  function copyText(text, back) {
    var old = function () { return copyOld(text, back) ? Promise.resolve() : Promise.reject(new Error("copy failed")); };
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(null, old);
    return old();
  }

  function contact(form) {
    var d = form.dataset;
    var root = form.parentNode || document;
    var summary = form.querySelector("[data-contact-summary]");
    var sentWa = form.querySelector('[data-contact-sent="whatsapp"]');
    var sentMail = form.querySelector('[data-contact-sent="email"]');
    var copyBox = form.querySelector("[data-contact-copy]");
    var cutNote = form.querySelector("[data-contact-cut]");
    var copyBtn = form.querySelector("[data-copy]");
    var copyLabel = copyBtn.textContent;
    var fullText = "";
    var buttons = form.querySelectorAll('button[name="via"]');
    // The buttons ship disabled (a submit without this script would put the message in the URL).
    Array.prototype.forEach.call(buttons, function (b) { b.disabled = false; });
    // The button pressed decides the channel (set on click, so it works where e.submitter does not exist).
    var via = "whatsapp";
    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener("click", function () { via = b.value === "email" ? "email" : "whatsapp"; });
    });

    function showErr(key, on) {
      var input = form.elements[key];
      var err = form.querySelector('[data-err="' + key + '"]');
      err.hidden = !on;
      if (on) {
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", err.id);
      } else {
        input.removeAttribute("aria-invalid");
        input.removeAttribute("aria-describedby");
      }
      summary.hidden = !form.querySelector("[data-err]:not([hidden])");
    }

    ["name", "message"].forEach(function (key) {
      form.elements[key].addEventListener("input", function () {
        if (form.elements[key].getAttribute("aria-invalid")) showErr(key, false);
      });
    });

    function build(channel, name, phone, message) {
      // Name and phone go first; the phone sits in an LTR isolate so its digit groups keep their order in Arabic.
      var head = [d.intro, "", d.nameLine + ": " + name];
      if (phone) head.push(d.phoneLine + ": \u2066" + phone + "\u2069");
      var make = function (msg) {
        var text = head.concat(["", msg]).join("\n");
        if (channel === "whatsapp") return d.wa + "?text=" + encodeURIComponent(text);
        return d.mail + "?" + new URLSearchParams({ subject: d.subject, body: text }).toString().replace(/\+/g, "%20");
      };
      var href = make(message);
      var cut = false;
      // Cut on whole characters (an emoji is two UTF-16 units; half of one makes encodeURIComponent throw).
      var chars = Array.from(message);
      var keep = chars.length;
      while (href.length > LINK_MAX[channel] && keep > 0) {
        keep = Math.floor(keep * 0.85);
        href = make(chars.slice(0, keep).join("") + " \u2026");
        cut = true;
      }
      return { href: href, cut: cut, text: head.concat(["", message]).join("\n") };
    }

    copyBtn.addEventListener("click", function () {
      copyText(fullText, copyBtn).then(
        function () { copyBtn.textContent = copyBtn.dataset.copied; setTimeout(function () { copyBtn.textContent = copyLabel; }, 3000); },
        function () { copyBtn.textContent = copyBtn.dataset.copyFailed; setTimeout(function () { copyBtn.textContent = copyLabel; }, 5000); }
      );
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (e.submitter && e.submitter.value) via = e.submitter.value === "email" ? "email" : "whatsapp";
      var name = form.elements.name.value.trim();
      var phone = asciiDigits(form.elements.phone.value).trim();
      var message = form.elements.message.value.trim();
      showErr("name", !name);
      showErr("message", !message);
      if (!name || !message) {
        sentWa.hidden = true;
        sentMail.hidden = true;
        copyBox.hidden = true;
        form.elements[!name ? "name" : "message"].focus();
        return;
      }
      var link = build(via, name, phone, message);
      fullText = link.text;
      var shown = via === "whatsapp" ? sentWa : sentMail;
      (via === "whatsapp" ? sentMail : sentWa).hidden = true;
      shown.querySelector("a").href = link.href;
      shown.hidden = false;
      cutNote.hidden = !link.cut;
      copyBox.hidden = false;
      if (via === "whatsapp") {
        // A blocked pop-up returns null: open WhatsApp in this tab instead, so the hand-off still happens.
        var w = window.open(link.href, "_blank");
        if (w) w.opener = null;
        else window.location.href = link.href;
      } else {
        window.location.href = link.href;
      }
    });
  }

  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) safe("contact form", function () { contact(contactForm); });

  // ---- Phone menu (<details>): closes on a link inside it (same-page #book too), on a hash change,
  // on Escape (focus back to the button) and on a click outside it.
  function menu(det) {
    var summary = det.querySelector("summary");
    function close(focus) {
      if (!det.open) return;
      det.open = false;
      if (focus) summary.focus();
    }
    det.addEventListener("click", function (e) { if (e.target.closest("a")) close(false); });
    window.addEventListener("hashchange", function () { close(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(true); });
    document.addEventListener("click", function (e) { if (!det.contains(e.target)) close(false); });
  }

  Array.prototype.forEach.call(document.querySelectorAll("details.menu"), function (det) {
    safe("menu", function () { menu(det); });
  });

  // ---- River (home): film mode. The stage sticks to the screen and the camera moves down the river as the
  // page scrolls; the branch under the camera lights up and its card opens. Transform only, eased with
  // requestAnimationFrame. Static mode (reduced motion, or the CSS says --film is off): the cards are a list.
  function river(sec) {
    var VW = Number(sec.dataset.vw);
    var STEP = Number(sec.dataset.step);
    var TOP = Number(sec.dataset.top);
    // Same curve as components/River.tsx.
    function riverX(y) {
      return 200 + 34 * Math.sin(y / 170) + 10 * Math.sin(y / 61);
    }
    var motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var track = sec.querySelector(".river-track");
    var stage = sec.querySelector(".river-stage");
    var map = sec.querySelector(".river-map");
    var boat = sec.querySelector(".river-boat");
    var bar = sec.querySelector(".river-bar i");
    var count = sec.querySelector(".river-count b");
    var cards = Array.prototype.slice.call(sec.querySelectorAll(".river-card"));
    var branchEls = Array.prototype.slice.call(sec.querySelectorAll(".rv-branch"));
    var n = cards.length;

    var cam = -1, target = 0, active = -1, raf = 0, scale = 1, anchor = 0.4, lead = 0.45, film = false;

    function measure() {
      film = !motion.matches && getComputedStyle(sec).getPropertyValue("--film").trim() === "1";
      sec.classList.toggle("is-film", film);
      scale = map.getBoundingClientRect().width / VW;
      // Phone: the card covers the lower half, so the camera keeps the active branch in the upper part.
      anchor = window.innerWidth < 1024 ? 0.12 : 0.48;
      lead = window.innerWidth < 1024 ? 0.2 : 0.45;
    }

    function setActive(i) {
      if (i === active) return;
      active = i;
      cards.forEach(function (c, k) { c.classList.toggle("on", k === i); });
      branchEls.forEach(function (b, k) {
        b.classList.toggle("on", k === i);
        b.classList.toggle("seen", k < i);
      });
      count.textContent = String(Math.max(i, 0) + 1).padStart(2, "0");
    }

    function frame() {
      raf = 0;
      var diff = target - cam;
      cam = Math.abs(diff) < 0.3 ? target : cam + diff * 0.14;
      var stageH = stage.clientHeight;
      var ty = -cam * scale + stageH * anchor;
      map.style.transform = "translate3d(0, " + ty.toFixed(1) + "px, 0)";
      var bx = riverX(cam) * scale;
      boat.style.transform = "translate3d(" + bx.toFixed(1) + "px, " + (stageH * anchor).toFixed(1) + "px, 0)";
      if (cam !== target) raf = requestAnimationFrame(frame);
    }

    function onScroll() {
      if (!film) return;
      var r = track.getBoundingClientRect();
      var travel = track.offsetHeight - stage.clientHeight;
      var p = Math.min(1, Math.max(0, -r.top / Math.max(travel, 1)));
      var f = p * n; // 0..n
      setActive(Math.min(n - 1, Math.floor(f)));
      bar.style.transform = "scaleY(" + p.toFixed(3) + ")";
      target = TOP + (f - lead) * STEP;
      if (cam < -0.5) cam = target;
      if (!raf) raf = requestAnimationFrame(frame);
    }

    // Keyboard: a link in a card that is not on screen scrolls the river to that branch.
    function onFocus(e) {
      if (!film) return;
      var card = e.target.closest(".river-card");
      if (!card) return;
      var i = cards.indexOf(card);
      if (i === active) return;
      var travel = track.offsetHeight - stage.clientHeight;
      var top = track.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / n) * travel;
      window.scrollTo({ top: top, behavior: "auto" });
    }

    // A phone's address bar changes the height while scrolling: re-measure then, but reset the camera only
    // when the width changes.
    var lastW = window.innerWidth;
    function onResize() {
      measure();
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        cam = -1;
      }
      onScroll();
    }

    measure();
    setActive(0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (motion.addEventListener) motion.addEventListener("change", onResize);
    else if (motion.addListener) motion.addListener(onResize);
    sec.addEventListener("focusin", onFocus);
  }

  var riverSec = document.querySelector("[data-river]");
  if (riverSec) safe("river", function () { river(riverSec); });
})();
