/* ══════════════════════════════════════════════════════════════════════════
   ozsert.com — homepage interpreted by Claude Opus 5
   Vanilla JS. Everything visible comes from window.OZ copy keys.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var MODEL_NAME = "Claude Opus 5";
  var SVGNS = "http://www.w3.org/2000/svg";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = function (k) { return window.OZ.t(k); };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svg(tag, attrs) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    return n;
  }
  function list(key) {
    return t(key).split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  var reduced = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var fine = window.matchMedia ? window.matchMedia("(hover: hover) and (pointer: fine)") : { matches: true };

  var state = { calm: reduced.matches, trail: fine.matches && !reduced.matches };
  var supportsWAAPI = typeof Element !== "undefined" && typeof Element.prototype.animate === "function";

  /* ── hand-drawn underline variants ─────────────────────────────────── */
  var UL = {
    straight: ["M1 6.2 C24 3.4 62 8.2 99 4.8"],
    wave:     ["M1 6.4 C11 2.4 21 9 33 5.2 C45 1.6 55 8.4 67 5 C79 1.8 90 8 99 4.6"],
    dash:     ["M1 6 C30 3.2 70 8 99 4.8"],
    double:   ["M1 5.4 C26 2.6 64 7.4 99 4", "M3 8.8 C30 6.4 68 10.4 97 7.4"],
    scribble: ["M1 6.8 C28 2.8 66 8.2 98 4.2", "M4 9.2 C33 6 71 10.6 96 7"]
  };
  function underlineSvg(kind) {
    var s = svg("svg", { "class": "vo5-ul", viewBox: "0 0 100 10", preserveAspectRatio: "none", "aria-hidden": "true" });
    (UL[kind] || UL.straight).forEach(function (d) {
      var p = svg("path", { d: d });
      if (kind === "dash") p.setAttribute("stroke-dasharray", "7 5");
      else { p.setAttribute("pathLength", "1"); p.setAttribute("class", "vo5-drawn"); }
      s.appendChild(p);
    });
    return s;
  }

  /* pick the phrase to underline inside a title, language-agnostically */
  function pickPhrase(text, mode) {
    var ci = text.indexOf(":");
    if (mode === "colon" && ci > 0) return text.slice(0, ci);
    if (mode === "all") return text;
    var words = text.split(/\s+/).filter(Boolean);
    if (mode === "last2" && words.length > 1) return words.slice(-2).join(" ");
    return words[words.length - 1] || text;
  }

  function applyUnderline(node) {
    var text = node.textContent;
    if (!text) return;
    var phrase = pickPhrase(text, node.getAttribute("data-vo5-ul"));
    var i = text.indexOf(phrase);
    if (i < 0) { i = 0; phrase = text; }
    node.textContent = "";
    if (i > 0) node.appendChild(document.createTextNode(text.slice(0, i)));
    var w = el("span", "vo5-ulw");
    w.appendChild(document.createTextNode(phrase));
    w.appendChild(underlineSvg(node.getAttribute("data-vo5-ulstyle") || "straight"));
    node.appendChild(w);
    var rest = text.slice(i + phrase.length);
    if (rest) node.appendChild(document.createTextNode(rest));
  }

  /* ── mark phrases inside a paragraph ───────────────────────────────── */
  function markPhrases(host, text, phrases, wrap) {
    var marks = [];
    phrases.forEach(function (p) {
      p = p.trim(); if (!p) return;
      var i = text.indexOf(p);
      if (i >= 0) marks.push({ s: i, e: i + p.length, t: p });
    });
    marks.sort(function (a, b) { return a.s - b.s; });
    var keep = [], last = -1;
    marks.forEach(function (m) { if (m.s >= last) { keep.push(m); last = m.e; } });
    host.textContent = "";
    var pos = 0;
    keep.forEach(function (m, idx) {
      if (m.s > pos) host.appendChild(document.createTextNode(text.slice(pos, m.s)));
      host.appendChild(wrap(m.t, idx, idx === keep.length - 1));
      pos = m.e;
    });
    if (pos < text.length) host.appendChild(document.createTextNode(text.slice(pos)));
  }

  /* ══════════════════ HERO ══════════════════ */
  function renderHeadline() {
    var h1 = $("#vo5-headline");
    var text = t("hero.headline");
    if (!h1 || !text) return;
    var m = text.match(/^(.*?[.!?])\s+(.+)$/);
    var lines = m ? [m[1], m[2]] : [text];
    h1.textContent = "";
    lines.forEach(function (line, i) {
      var span = el("span", "vo5-h1-line");
      var isLast = i === lines.length - 1;
      if (isLast && /[.]$/.test(line)) {
        span.appendChild(document.createTextNode(line.slice(0, -1)));
        span.appendChild(el("span", "vo5-dot"));
      } else {
        span.appendChild(document.createTextNode(line));
      }
      if (isLast) {
        var s = svg("svg", { "class": "vo5-h1-ul", viewBox: "0 0 100 10", preserveAspectRatio: "none", "aria-hidden": "true" });
        var p = svg("path", { d: "M1 5.6 C16 2 34 8.6 54 5 C72 1.8 86 7.8 99 4.2", pathLength: "1", "class": "vo5-drawn" });
        s.appendChild(p);
        span.appendChild(s);
      }
      h1.appendChild(span);
    });
  }

  function renderRole() {
    var host = $("#vo5-role");
    if (!host) return;
    markPhrases(host, t("hero.role"), t("hero.role_highlights").split("|"), function (txt) {
      return el("mark", "vo5-hl", txt);
    });
  }

  function renderManifesto() {
    var host = $("#vo5-manifesto");
    if (!host) return;
    markPhrases(host, t("hero.manifesto"), t("hero.manifesto_circle").split("|"), function (txt, idx, isLast) {
      var w = el("span", "vo5-circ");
      w.appendChild(document.createTextNode(txt));
      var s = svg("svg", { "class": "vo5-oval", viewBox: "0 0 100 40", preserveAspectRatio: "none", "aria-hidden": "true" });
      s.appendChild(svg("path", {
        d: "M52 3.2 C78 2 97 9 96.5 20 C96 31 72 38 48 37.6 C24 37.2 3.5 31 4 19.6 C4.5 8.6 26 3.4 52 3.2 C62 3.3 74 4.4 82 6.6",
        pathLength: "1", "class": "vo5-drawn"
      }));
      w.appendChild(s);
      if (isLast) w.setAttribute("data-vo5-anchor", "1");
      return w;
    });
    requestAnimationFrame(drawConnector);
  }

  /* curved arrow: last circled word → the margin note */
  function drawConnector() {
    var sheet = $(".vo5-sheet--hero"), note = $("#vo5-margin-note");
    var from = $('[data-vo5-anchor]');
    var old = $(".vo5-arrow", sheet);
    if (old) old.remove();
    if (!sheet || !note || !from) return;
    if (window.innerWidth < 1021) return;
    var cr = sheet.getBoundingClientRect(), fr = from.getBoundingClientRect(), nr = note.getBoundingClientRect();
    var fx = fr.right - cr.left + 6, fy = fr.top - cr.top + fr.height * 0.42;
    var tx = nr.left - cr.left - 9, ty = nr.top - cr.top + 16;
    if (tx - fx < 40) return;
    var s = svg("svg", { "class": "vo5-arrow", viewBox: "0 0 " + Math.max(1, cr.width) + " " + Math.max(1, cr.height), "aria-hidden": "true" });
    s.setAttribute("preserveAspectRatio", "none");
    var c1x = fx + (tx - fx) * 0.24, c1y = fy - 30;
    var c2x = fx + (tx - fx) * 0.82, c2y = ty - 46;
    s.appendChild(svg("path", { d: "M" + fx + " " + fy + " C" + c1x + " " + c1y + " " + c2x + " " + c2y + " " + tx + " " + ty, pathLength: "1", "class": "vo5-drawn is-in" }));
    var ang = Math.atan2(ty - c2y, tx - c2x);
    var h = 9;
    s.appendChild(svg("path", {
      d: "M" + (tx - h * Math.cos(ang - 0.44)) + " " + (ty - h * Math.sin(ang - 0.44)) +
         " L" + tx + " " + ty +
         " L" + (tx - h * Math.cos(ang + 0.44)) + " " + (ty - h * Math.sin(ang + 0.44))
    }));
    sheet.appendChild(s);
  }

  /* ══════════════════ fig. 1 — accent scenes ══════════════════ */
  var scenes = [];
  function activateScene(id) {
    scenes.forEach(function (s) {
      var on = s.getAttribute("data-scene") === id;
      if (!on) { s.classList.remove("is-on"); return; }
      var paths = $$("path", s);
      var calm = state.calm || !supportsWAAPI;
      paths.forEach(function (p, i) {
        p.setAttribute("pathLength", "1");
        p.setAttribute("data-pl", "");
        if (p._vo5anim) { try { p._vo5anim.cancel(); } catch (e) {} p._vo5anim = null; }
        if (calm) return;
        p._vo5anim = p.animate(
          [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
          { duration: 820, delay: Math.min(i, 26) * 30, easing: "cubic-bezier(.4,.1,.3,1)", fill: "backwards" }
        );
      });
      s.classList.add("is-on");
    });
    var cap = $("#vo5-fig1-cap");
    if (cap) cap.textContent = t("ui.fig") + " 1 — " + t("hero.fig." + id);
  }

  /* ══════════════════ ink picker ══════════════════ */
  function buildInk(hostId, withName) {
    var host = $(hostId);
    if (!host) return;
    host.textContent = "";
    window.OZ.accents.forEach(function (a) {
      var b = el("button", "vo5-swatch");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("data-accent", a.id);
      b.style.setProperty("--vo5-sw", window.OZ.theme === "dark" ? a.dark : a.light);
      b.addEventListener("click", function () { window.OZ.setAccent(a.id); });
      host.appendChild(b);
    });
    host.setAttribute("data-named", withName ? "1" : "0");
  }
  function syncInk() {
    $$(".vo5-swatch").forEach(function (b) {
      var a = window.OZ.accents.filter(function (x) { return x.id === b.getAttribute("data-accent"); })[0];
      if (a) b.style.setProperty("--vo5-sw", window.OZ.theme === "dark" ? a.dark : a.light);
      var name = a ? (a.name[window.OZ.lang] || a.name.en) : "";
      var both = a ? (a.name.tr + " / " + a.name.en) : "";
      b.setAttribute("aria-checked", String(b.getAttribute("data-accent") === window.OZ.accent));
      b.setAttribute("aria-label", name);
      b.title = both;
    });
    var cur = window.OZ.accents.filter(function (x) { return x.id === window.OZ.accent; })[0];
    var n = $("#vo5-ink-name");
    if (n && cur) n.textContent = cur.name[window.OZ.lang] || cur.name.en;
  }

  /* ══════════════════ toggles ══════════════════ */
  function syncToggles() {
    var a = $("#vo5-t-trail"), b = $("#vo5-t-calm");
    if (a) {
      $(".vo5-tg-k", a).textContent = t("ui.pen_trail");
      $(".vo5-tg-v", a).textContent = state.trail ? t("ui.on") : t("ui.off");
      a.setAttribute("aria-pressed", String(state.trail));
    }
    if (b) {
      $(".vo5-tg-k", b).textContent = t("ui.calm_motion");
      $(".vo5-tg-v", b).textContent = state.calm ? t("ui.on") : t("ui.off");
      b.setAttribute("aria-pressed", String(state.calm));
    }
    document.body.classList.toggle("vo5-calm", state.calm);
    document.body.classList.toggle("vo5-motion-ok", !state.calm);
    var c = $(".vo5-trail");
    if (c) c.classList.toggle("is-on", state.trail && !state.calm && fine.matches);
  }

  /* ══════════════════ contents ══════════════════ */
  var SECTIONS = [
    ["00", "now.label", "#now"],
    ["01", "projects.label", "#projects"],
    ["02", "founder.label", "#founder"],
    ["03", "talks.label", "#talks"],
    ["04", "newsletter.label", "#newsletter"],
    ["05", "experience.label", "#experience"],
    ["06", "footer.label", "#contact"]
  ];
  function renderContents() {
    var host = $("#vo5-contents-list");
    if (!host) return;
    host.textContent = "";
    SECTIONS.forEach(function (s) {
      var li = el("li");
      var a = el("a", null);
      a.href = s[2];
      a.appendChild(el("span", "vo5-c-no", s[0]));
      a.appendChild(el("span", null, t(s[1])));
      li.appendChild(a);
      host.appendChild(li);
    });
  }

  /* ══════════════════ tiny project glyphs ══════════════════ */
  var GLYPHS = {
    "ai-code-reviewer": "M8 7 L3 12 L8 17 M16 7 L21 12 L16 17 M13 5 L11 19",
    "skill-marketplace": "M3 4 H9 V10 H3 Z M15 4 H21 V10 H15 Z M3 14 H9 V20 H3 Z M15 14 V17 M12 17 H21 M18 14 L18 20 M15.5 17.5 L18 20 L20.5 17.5",
    "executive-kpi-agent": "M3 19 L8 12 L12 15 L16 7 L21 11 M14 16 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M17 19 L21 22",
    "ai-gateway": "M6 20 V10 A6 6 0 0 1 18 10 V20 M2 15 H6 M18 15 H22 M12 20 V13",
    "mailbox-qa": "M3 6 H21 V18 H3 Z M3 6 L12 13 L21 6 M10 20 C12 18 14 18 15 20",
    "sam-ai": "M4 5 H20 V16 H10 L5 20 V16 H4 Z M8 11 L11 14 L16 8",
    "player-support-agent": "M7 9 H17 A5 5 0 0 1 17 19 L7 19 A5 5 0 0 1 7 9 Z M9.5 14 H12.5 M11 12.5 V15.5 M15 13 h.01 M17 15 h.01 M9 6 C10 4 14 4 15 6"
  };
  function glyph(slug) {
    var s = svg("svg", { "class": "vo5-row-glyph", viewBox: "0 0 24 24", "aria-hidden": "true" });
    s.appendChild(svg("path", { d: GLYPHS[slug] || "M4 12 H20 M12 4 V20" }));
    return s;
  }

  /* ══════════════════ generic list row ══════════════════ */
  function makeRow(opts) {
    var li = el("li");
    var a = el("a", "vo5-row");
    a.href = opts.href;
    if (opts.external) { a.target = "_blank"; a.rel = "noopener"; }
    if (opts.glyph) a.appendChild(opts.glyph); else a.classList.add("vo5-row--plain");
    a.appendChild(el("span", "vo5-row-no", opts.no));

    var main = el("div", "vo5-row-main");
    var h = el("h3", "vo5-row-title", opts.title);
    main.appendChild(h);
    if (opts.sub) main.appendChild(el("span", "vo5-row-sub", opts.sub));
    a.appendChild(main);

    if (opts.thumb) {
      var th = el("div", "vo5-row-thumb");
      var ti = new Image();
      ti.src = opts.thumb; ti.alt = ""; ti.loading = "lazy"; ti.width = 104; ti.height = 104;
      th.appendChild(ti);
      a.appendChild(th);
      a.classList.add("has-thumb");
    }

    var meta = el("div", "vo5-row-meta");
    if (opts.stamp) meta.appendChild(el("span", "vo5-stamp", opts.stamp));
    if (opts.status) meta.appendChild(el("span", "vo5-row-status", opts.status));
    if (opts.year) meta.appendChild(el("span", "vo5-row-year", opts.year));
    a.appendChild(meta);

    var arw = el("span", "vo5-row-arrow");
    arw.setAttribute("aria-hidden", "true");
    arw.appendChild(el("span", "vo5-arr", "→"));
    a.appendChild(arw);

    if (opts.peek) bindPeek(a, opts.peek);
    li.appendChild(a);
    return li;
  }

  /* ══════════════════ Workbench ══════════════════ */
  function renderProjects() {
    var host = $("#vo5-projects");
    if (!host) return;
    host.textContent = "";
    list("projects.order").forEach(function (slug, i) {
      host.appendChild(makeRow({
        href: "/projects/" + slug + "/",
        no: pad2(i + 1),
        glyph: glyph(slug),
        title: t("project." + slug + ".title"),
        sub: t("project." + slug + ".oneliner"),
        stamp: t("project." + slug + ".kind"),
        status: t("project." + slug + ".status"),
        year: t("project." + slug + ".year")
      }));
    });
  }

  /* ══════════════════ Talks ══════════════════ */
  function renderTalks() {
    var host = $("#vo5-talks");
    if (!host) return;
    host.textContent = "";
    list("talks.featured").forEach(function (slug, i) {
      var img = t("talk." + slug + ".image");
      host.appendChild(makeRow({
        href: "/talks/#" + slug,
        no: pad2(i + 1),
        title: t("talk." + slug + ".title"),
        sub: t("talk." + slug + ".subtitle"),
        stamp: t("ui.vol") + " " + t("talk." + slug + ".vol"),
        peek: img || null,
        thumb: img || null
      }));
    });
    var cta = $("#vo5-talks-cta");
    if (cta) cta.href = "mailto:" + window.OZ.email() + "?subject=" + encodeURIComponent(t("talks.cta"));
  }

  /* ══════════════════ Newsletter ══════════════════ */
  function showState(msg, withLink) {
    var host = $("#vo5-issues");
    host.textContent = "";
    var li = el("li");
    var d = el("div", "vo5-state");
    d.textContent = msg;
    if (withLink) {
      d.appendChild(document.createTextNode(" "));
      var a = el("a", null, "thenextsignalnewsletter.substack.com");
      a.href = "https://thenextsignalnewsletter.substack.com/";
      a.target = "_blank"; a.rel = "noopener";
      d.appendChild(a);
    }
    li.appendChild(d);
    host.appendChild(li);
  }
  var postsCache = null;
  function paintPosts() {
    var host = $("#vo5-issues");
    if (!host || !postsCache) return;
    host.textContent = "";
    host.setAttribute("aria-busy", "false");
    postsCache.forEach(function (p, i) {
      var d = new Date(p.date);
      var when = isNaN(d) ? "" : d.toLocaleDateString(window.OZ.lang === "tr" ? "tr-TR" : "en-GB",
        { day: "2-digit", month: "short", year: "numeric" });
      host.appendChild(makeRow({
        href: p.link, external: true,
        no: pad2(i + 1),
        title: p.title,
        sub: p.excerpt,
        status: when,
        peek: p.image || null,
        thumb: p.image || null
      }));
    });
  }
  function loadPosts() {
    var host = $("#vo5-issues");
    if (!host) return;
    host.setAttribute("aria-busy", "true");
    showState(t("newsletter.loading"));
    window.OZ.latestPosts(3).then(function (posts) {
      if (!posts || !posts.length) { host.setAttribute("aria-busy", "false"); showState(t("newsletter.error"), true); return; }
      postsCache = posts;
      paintPosts();
    }).catch(function () {
      host.setAttribute("aria-busy", "false");
      showState(t("newsletter.error"), true);
    });
  }

  /* ══════════════════ hover pictures ══════════════════ */
  var peek = null, peekImg = null, peekOn = false;
  function bindPeek(node, src) {
    if (!src) return;
    node.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse" || state.calm || !fine.matches) return;
      showPeek(src, e.clientX, e.clientY);
    });
    node.addEventListener("pointermove", function (e) {
      if (!peekOn || e.pointerType !== "mouse") return;
      movePeek(e.clientX, e.clientY);
    });
    node.addEventListener("pointerleave", hidePeek);
    node.addEventListener("focus", function () {
      if (state.calm || !fine.matches) return;
      var r = node.getBoundingClientRect();
      showPeek(src, Math.min(window.innerWidth - 40, r.right - 60), r.top + 10);
    });
    node.addEventListener("blur", hidePeek);
  }
  function showPeek(src, x, y) {
    if (!peek) return;
    if (peekImg.getAttribute("src") !== src) peekImg.setAttribute("src", src);
    movePeek(x, y);
    peekOn = true;
    peek.classList.add("is-on");
  }
  function movePeek(x, y) {
    if (!peek) return;
    var w = peek.offsetWidth || 236, h = peek.offsetHeight || 160;
    var left = x + 30;
    if (left + w > window.innerWidth - 12) left = x - w - 30;
    if (left < 12) left = 12;
    var top = y - h / 2;
    top = Math.max(56, Math.min(window.innerHeight - h - 14, top));
    peek.style.left = Math.round(left) + "px";
    peek.style.top = Math.round(top) + "px";
  }
  function hidePeek() {
    if (!peek) return;
    peekOn = false;
    peek.classList.remove("is-on");
  }

  /* the floating picture is placed with left/top so CSS keeps its tilt */
  function stylePeekBase() {
    if (!peek) return;
    peek.style.left = "-999px"; peek.style.top = "-999px";
  }

  /* ══════════════════ case stats + dot matrix ══════════════════ */
  function renderStats() {
    $$("[data-vo5-stat]").forEach(function (node) {
      var raw = t(node.getAttribute("data-vo5-stat"));
      if (!raw) return;
      var m = raw.match(/^(\S+(?:\s*→\s*\S+)?)\s*(.*)$/);
      var big = m ? m[1] : raw, unit = m ? m[2] : "";
      node.textContent = "";
      node.appendChild(el("span", "vo5-stat-big", big));
      if (unit) node.appendChild(el("span", "vo5-stat-unit", unit));
    });
  }
  function renderDots() {
    var host = $("#vo5-dotmatrix");
    if (!host || host.firstChild) return;
    var g = el("div", "vo5-dots");
    for (var i = 0; i < 125; i++) {
      var d = el("i");
      if (i < 110) d.className = "on";
      g.appendChild(d);
    }
    host.appendChild(g);
  }

  /* ══════════════════ experience ══════════════════ */
  function circleNow() {
    var node = $('[data-vo5-now]');
    if (!node) return;
    var text = node.textContent;
    var words = text.split(/\s+/).filter(Boolean);
    if (!words.length) return;
    var w = words[words.length - 1];
    var i = text.lastIndexOf(w);
    node.textContent = "";
    node.appendChild(document.createTextNode(text.slice(0, i)));
    var wrap = el("span", "vo5-circ");
    wrap.appendChild(document.createTextNode(w));
    var s = svg("svg", { "class": "vo5-oval", viewBox: "0 0 100 40", preserveAspectRatio: "none", "aria-hidden": "true" });
    s.appendChild(svg("path", {
      d: "M52 3.2 C78 2 97 9 96.5 20 C96 31 72 38 48 37.6 C24 37.2 3.5 31 4 19.6 C4.5 8.6 26 3.4 52 3.2 C62 3.3 74 4.4 82 6.6",
      pathLength: "1", "class": "vo5-drawn is-in"
    }));
    wrap.appendChild(s);
    node.appendChild(wrap);
  }
  function linkTimeline() {
    $$(".vo5-exp-row").forEach(function (row) {
      var n = row.getAttribute("data-row");
      var seg = $('.vo5-tl-seg[data-row="' + n + '"]');
      if (!seg) return;
      var on = function () { seg.classList.add("is-hot"); };
      var off = function () { seg.classList.remove("is-hot"); };
      row.addEventListener("pointerenter", on);
      row.addEventListener("pointerleave", off);
    });
  }

  /* ══════════════════ pen trail ══════════════════ */
  function penTrail() {
    var cv = $(".vo5-trail");
    if (!cv) return;
    var ctx = cv.getContext("2d");
    var pts = [], raf = 0, dpr = 1;
    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = Math.floor(window.innerWidth * dpr);
      cv.height = Math.floor(window.innerHeight * dpr);
      cv.style.width = window.innerWidth + "px";
      cv.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    window.addEventListener("resize", size);

    function ink() {
      return getComputedStyle(document.documentElement).getPropertyValue("--oz-accent").trim() || "#1F5F8B";
    }
    var colour = ink();
    document.addEventListener("oz:accentchange", function () { colour = ink(); });
    document.addEventListener("oz:themechange", function () { colour = ink(); });

    function frame() {
      raf = 0;
      var now = performance.now();
      pts = pts.filter(function (p) { return now - p.t < 560; });
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (pts.length > 1) {
        for (var i = 1; i < pts.length; i++) {
          var a = pts[i - 1], b = pts[i];
          var age = (now - b.t) / 560;
          ctx.globalAlpha = Math.max(0, (1 - age)) * 0.42;
          ctx.strokeStyle = colour;
          ctx.lineWidth = Math.max(0.6, 3.1 * (1 - age));
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      if (pts.length) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      if (!state.trail || state.calm || !fine.matches) return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (pts.length > 60) pts.shift();
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
  }

  /* ══════════════════ reveals ══════════════════ */
  function observe() {
    var targets = $$(".vo5-h2, .vo5-rows, .vo5-case, .vo5-clip, .vo5-fig3, .vo5-exp, .vo5-links, .vo5-intro, .vo5-fig1-wrap, .vo5-fig2, .vo5-bigname");
    targets.forEach(function (n) { n.classList.add("vo5-rv"); });
    var pending = targets.slice(), ticking = false;
    function check() {
      ticking = false;
      var h = window.innerHeight || 800;
      pending = pending.filter(function (n) {
        var r = n.getBoundingClientRect();
        var visible = r.top < h * 0.94 && r.bottom > -240;
        var passed = r.bottom <= -240;                 /* already scrolled past */
        if (visible || passed) { n.classList.add("is-in"); return false; }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener("scroll", request);
        window.removeEventListener("resize", request);
      }
    }
    function request() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    check();
    setTimeout(check, 140);
    setTimeout(check, 800);
  }

  /* ══════════════════ small UI words ══════════════════ */
  function renderUiWords() {
    $$("[data-vo5-ui]").forEach(function (n) { n.textContent = t("ui." + n.getAttribute("data-vo5-ui")); });
    var credit = $("#vo5-credit");
    if (credit) credit.textContent = t("ui.credit").replace("{model}", MODEL_NAME);
    var cap2 = $("#vo5-fig2-cap");
    if (cap2) cap2.textContent = t("ui.fig") + " 2 — " + t("newsletter.fig_caption");
  }

  function wireCopy() {
    var btn = $("#vo5-copy");
    if (!btn) return;
    var span = $("[data-vo5-ui]", btn);
    btn.addEventListener("click", function () {
      var addr = window.OZ.email();
      var done = function () {
        span.textContent = t("ui.copied");
        setTimeout(function () { span.textContent = t("ui.copy"); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = addr; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  }

  /* ══════════════════ full (re)render of copy-driven pieces ══════════════════ */
  function renderAll() {
    renderHeadline();
    renderRole();
    renderManifesto();
    renderContents();
    renderUiWords();
    renderStats();
    $$("[data-vo5-ul]").forEach(applyUnderline);
    circleNow();
    renderProjects();
    renderTalks();
    if (postsCache) paintPosts();
    syncInk();
    syncToggles();
    activateScene(window.OZ.accent);
  }

  /* ══════════════════ boot ══════════════════ */
  window.OZ.ready.then(function () {
    scenes = $$(".vo5-scene");
    peek = $("#vo5-peek");
    peekImg = $("#vo5-peek-img");
    stylePeekBase();

    buildInk("#vo5-ink-dots", true);
    buildInk("#vo5-ink-dots-foot", false);

    renderAll();
    renderDots();
    linkTimeline();
    wireCopy();
    loadPosts();
    observe();
    penTrail();

    /* headline + hero underlines draw on load */
    requestAnimationFrame(function () {
      $$("#vo5-headline .vo5-drawn, .vo5-oval .vo5-drawn").forEach(function (p) { p.classList.add("is-in"); });
      drawConnector();
    });

    var trailBtn = $("#vo5-t-trail"), calmBtn = $("#vo5-t-calm");
    if (trailBtn) trailBtn.addEventListener("click", function () { state.trail = !state.trail; syncToggles(); });
    if (calmBtn) calmBtn.addEventListener("click", function () { state.calm = !state.calm; syncToggles(); if (state.calm) hidePeek(); activateScene(window.OZ.accent); });

    document.addEventListener("oz:langchange", function () { renderAll(); requestAnimationFrame(drawConnector); });
    document.addEventListener("oz:themechange", function () { syncInk(); });
    document.addEventListener("oz:accentchange", function () { syncInk(); activateScene(window.OZ.accent); });

    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(drawConnector, 140);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { drawConnector(); });
  });
})();
