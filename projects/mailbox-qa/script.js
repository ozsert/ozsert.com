/* ozsert.com — /projects/mailbox-qa/ · built by Claude Opus 5.5
   Field-notebook explainer: five hand-inked figures, vanilla JS + inline SVG. */
(function () {
  "use strict";

  var MODEL = "Claude Opus 5.5";
  var P = "project.mailbox-qa.";
  var NS = "http://www.w3.org/2000/svg";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduced = function () { return RM.matches; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function t(k) { return window.OZ.t(k); }
  function tp(k) { return t(P + k); }
  function list(k) { return tp(k).split("|").map(function (s) { return s.trim(); }); }

  // ---------------------------------------------------------------- tiny SVG kit
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var a in attrs) if (attrs[a] != null) n.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, cls, parent, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function rng(seed) { var s = seed % 2147483647 || 7; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function f(n) { return Math.round(n * 10) / 10; }
  // a slightly wobbly hand-drawn segment
  function seg(x1, y1, x2, y2, r, j) {
    j = j == null ? 1.6 : j;
    var mx = (x1 + x2) / 2 + (r() - .5) * j * 2, my = (y1 + y2) / 2 + (r() - .5) * j * 2;
    return "M" + f(x1) + " " + f(y1) + " Q" + f(mx) + " " + f(my) + " " + f(x2) + " " + f(y2);
  }
  function segC(x1, y1, x2, y2, r, j) { return seg(x1, y1, x2, y2, r, j).replace(/^M[^Q]+/, ""); }
  // sketchy closed quad (with a little overshoot on the last corner)
  function quad(pts, r, j) {
    var d = "M" + f(pts[0][0]) + " " + f(pts[0][1]);
    for (var i = 1; i <= pts.length; i++) {
      var a = pts[i - 1], b = pts[i % pts.length];
      d += " " + segC(a[0], a[1], b[0], b[1], r, j);
    }
    var o = pts[1];
    return d + " L" + f(pts[0][0] + (o[0] - pts[0][0]) * .06 + (r() - .5) * 2) + " " + f(pts[0][1] + (o[1] - pts[0][1]) * .06 + (r() - .5) * 2);
  }
  function box(x, y, w, hh, r, j) { return quad([[x, y], [x + w, y], [x + w, y + hh], [x, y + hh]], r, j); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function ss(a, b, v) { var x = clamp((v - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function ease(k) { return 1 - Math.pow(1 - clamp(k, 0, 1), 3); }

  // draw strokes in (stroke-dashoffset); instant under reduced motion
  function inkIn(nodes, step, base) {
    nodes.forEach(function (p, i) {
      if (!p.getTotalLength) return;
      var L = Math.ceil(p.getTotalLength()) + 2;
      if (reduced()) { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; return; }
      p.style.transition = "none";
      p.style.strokeDasharray = L + " " + L;
      p.style.strokeDashoffset = L;
      p.getBoundingClientRect();
      p.style.transition = "stroke-dashoffset " + (0.7 + Math.min(L, 600) / 900) + "s cubic-bezier(.55,.1,.3,1) " + ((base || 0) + i * (step || 0.06)) + "s";
      p.style.strokeDashoffset = 0;
    });
  }
  function inkHide(nodes) {
    if (reduced()) return;
    nodes.forEach(function (p) {
      if (!p.getTotalLength) return;
      var L = Math.ceil(p.getTotalLength()) + 2;
      p.style.transition = "none"; p.style.strokeDasharray = L + " " + L; p.style.strokeDashoffset = L;
    });
  }

  // ---------------------------------------------------------------- reveal observer
  var onEnter = new Map();
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (ents) {
    ents.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      var fn = onEnter.get(e.target);
      if (fn) { onEnter.delete(e.target); fn(); }
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }) : null;
  function watch(node, fn) {
    if (fn) onEnter.set(node, fn);
    if (io && !reduced()) io.observe(node);
    else { node.classList.add("is-in"); if (fn) { onEnter.delete(node); fn(); } }
  }

  // ================================================================ text: titles, stats, lists
  var MARKS = {
    straight: { vb: "0 0 100 10", d: "M1 6 C 30 4, 62 7.5, 99 4" },
    wavy: { vb: "0 0 100 10", d: "M1 5 Q 6 0, 11 5 T 21 5 T 31 5 T 41 5 T 51 5 T 61 5 T 71 5 T 81 5 T 91 5 T 99 4" },
    dashed: { vb: "0 0 100 10", d: "M1 5 C 30 3.5, 64 7, 99 4.5" },
    double: { vb: "0 0 100 10", d: "M1 4 C 30 2, 60 6, 99 3 M4 8.5 C 35 7, 65 9.5, 97 7.5" },
    circle: { vb: "0 0 100 40", d: "M62 3 C 90 2, 99 12, 97 22 C 95 34, 70 39, 45 38 C 18 37, 2 30, 3 19 C 4 8, 25 2, 52 3 C 70 4, 82 6, 88 10" }
  };
  // the phrase to mark in each title (must be an exact substring; falls back to the last word)
  var PHRASE = {
    hero: { tr: "RAG", en: "RAG" },
    c1: { tr: "kilitli", en: "locked" },
    c2: { tr: "Bir kez", en: "once" },
    c3: { tr: "kaynağıyla", en: "with its sources" },
    c4: { tr: "şirketin içinde", en: "inside the company" },
    c5: { tr: "daha dağınıktır", en: "messier" }
  };
  function decorate(node, text, phrase, style) {
    node.textContent = "";
    var end = "";
    if (/\.$/.test(text)) { end = "."; text = text.slice(0, -1); }
    var i = phrase ? text.indexOf(phrase) : -1;
    if (i < 0) { var m = text.match(/(\S+)\s*$/); phrase = m ? m[1] : text; i = text.lastIndexOf(phrase); }
    node.appendChild(document.createTextNode(text.slice(0, i)));
    var mark = h("span", "vo55-mark vo55-mark--" + style, node, phrase);
    var M = MARKS[style];
    var svg = el("svg", { viewBox: M.vb, preserveAspectRatio: "none", "aria-hidden": "true" }, mark);
    el("path", { d: M.d }, svg);
    if (!reduced()) {
      svg.style.clipPath = "inset(0 100% 0 0)";
      svg.style.transition = "clip-path 1.1s cubic-bezier(.6,.1,.3,1) .25s";
    }
    node.appendChild(document.createTextNode(text.slice(i + phrase.length)));
    if (end) h("span", "vo55-dot", node, end);
    return svg;
  }
  var markSeen = {};
  function renderTitles() {
    var L = window.OZ.lang;
    var hs = decorate($("#vo55-title"), tp("title"), PHRASE.hero[L], "circle");
    revealMark("hero", hs, $("#vo55-title"));
    $$("[data-title]").forEach(function (n) {
      var c = n.getAttribute("data-title");
      var svg = decorate(n, tp(c + ".title"), PHRASE[c][L], n.getAttribute("data-style"));
      revealMark(c, svg, n);
    });
  }
  function revealMark(id, svg, host) {
    var show = function () { requestAnimationFrame(function () { svg.style.clipPath = "inset(0 0 0 0)"; }); };
    if (markSeen[id]) { svg.style.transition = "none"; svg.style.clipPath = "none"; return; }
    watch(host, function () { markSeen[id] = true; show(); });
  }

  function renderStats() {
    var s1 = $("#vo55-stat1"); s1.textContent = "";
    (tp("stat1").match(/\[\d+\]/g) || [tp("stat1")]).forEach(function (c) { h("span", "vo55-chip-big", s1, c); });
    ["#vo55-stat3", "#vo55-stat4"].forEach(function (sel) {
      var n = $(sel), v = t(n.getAttribute("data-key")), m = v.match(/^(<?)\s*([\d.,~]+)\s*(.*)$/);
      n.textContent = "";
      if (!m) { n.textContent = v; return; }
      if (m[1]) h("span", "vo55-lt", n, m[1]);
      n.appendChild(document.createTextNode(m[2]));
      if (m[3]) h("span", "vo55-unit", n, m[3]);
    });
  }

  function renderLessons() {
    var ol = $("#vo55-lessons"); ol.textContent = "";
    var parts = tp("c5.body").split(/(?<=[.!?…])\s+(?=["“'A-ZÇĞİÖŞÜ])/);
    parts.forEach(function (s, i) {
      var li = h("li", null, ol);
      var num = h("span", "vo55-lnum", li);
      var r = rng(31 + i * 7);
      var svg = el("svg", { viewBox: "0 0 48 48", "aria-hidden": "true" }, num);
      var a0 = -1.2 + r() * .6, d = "";
      for (var k = 0; k <= 54; k++) {
        var a = a0 + k / 48 * Math.PI * 2, rr = 19 + Math.sin(k * .45 + i) * 1.2 + k * .06;
        d += (k ? " L" : "M") + f(24 + Math.cos(a) * rr) + " " + f(24 + Math.sin(a) * (rr - 1.5));
      }
      el("path", { d: d, class: "dr" }, svg);
      h("span", null, num, String(i + 1));
      h("span", "tx", li, s);
    });
    if (!ol.classList.contains("is-in")) {
      inkHide($$(".vo55-lnum path", ol));
      watch(ol, function () { inkIn($$(".vo55-lnum path", ol), 0.25); });
    }
  }

  function renderStatic() {
    var title = tp("title");
    document.title = title + " — ozsert.com";
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", tp("oneliner"));
    $$(".vo55-fig-no").forEach(function (n) { n.textContent = t("ui.fig") + " " + n.getAttribute("data-fig") + " —"; });
    $("#vo55-credit").textContent = t("projects.credit").replace("{model}", MODEL);
    var tags = $("#vo55-tags"); tags.textContent = "";
    tp("stack").split(/,\s*/).forEach(function (s) { if (s) h("li", null, tags, s); });
    $("#vo55-hero-replay").setAttribute("aria-label", "↺ " + tp("hero_fig"));
    $("#vo55-c4-replay").setAttribute("aria-label", "↺ " + tp("c4.fig"));
    $("#vo55-hero-svg").setAttribute("aria-label", tp("hero_fig"));
  }

  // ================================================================ fig 1 · hero: box → cited answer
  var hero = null;
  function buildHero() {
    var svg = $("#vo55-hero-svg");
    svg.textContent = "";
    var r = rng(11);
    var g = el("g", null, svg);
    var stat = [];
    // ground + box
    stat.push(el("path", { class: "s-soft dr", d: seg(24, 322, 360, 324, r, 2) }, g));
    var opening = el("path", { class: "f-washs", d: "M70 200 L112 176 L292 176 L250 200 Z", opacity: 0 }, g);
    stat.push(el("path", { class: "s-pen f-card dr", d: box(70, 200, 180, 120, r, 1.6) }, g));
    stat.push(el("path", { class: "s-pen f-card dr", d: quad([[250, 200], [292, 176], [292, 296], [250, 320]], r, 1.2) }, g));
    stat.push(el("path", { class: "s-faint dr", d: seg(70, 230, 250, 231, r, 1) + seg(250, 230, 292, 207, r, 1) }, g));
    var lab = el("rect", { x: 96, y: 248, width: 128, height: 40, rx: 2, class: "f-card" }, g);
    stat.push(el("path", { class: "s-ink dr", d: box(96, 248, 128, 40, r, 1.2) }, g));
    var labT = el("text", { x: 160, y: 274, "text-anchor": "middle", class: "t-mono t-ink", "font-size": 15 }, g);
    // lid (computed each frame)
    var lid = el("path", { class: "s-pen f-card" }, g);
    // answer card
    var cx = 560, cy = 36, cw = 370, ch = 304;
    el("rect", { x: cx + 6, y: cy + 7, width: cw, height: ch, class: "f-washs", opacity: .35, rx: 3 }, g);
    el("rect", { x: cx, y: cy, width: cw, height: ch, class: "f-card", rx: 3 }, g);
    stat.push(el("path", { class: "s-pen dr", d: box(cx, cy, cw, ch, r, 1.6) }, g));
    stat.push(el("path", { class: "s-ink dr", d: "M" + (cx + 34) + " 64 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0" }, g));
    stat.push(el("path", { class: "s-ink dr", d: "M" + (cx + 29) + " 60 q0 -6 5 -6 q5 0 5 5 q0 4 -5 6 v3 M" + (cx + 34) + " 72 v0.5" }, g));
    stat.push(el("path", { class: "s-soft dr", d: seg(cx + 58, 64, cx + 250, 65, r, 1.4) }, g));
    stat.push(el("path", { class: "s-faint s-dash", d: "M" + (cx + 20) + " 96 H" + (cx + cw - 20) }, g));
    // answer lines + where each envelope lands
    var LY = [130, 160, 190, 220, 250], LW = [300, 236, 290, 210, 150];
    var lines = LY.map(function (y, i) {
      return el("path", { class: "s-pen", "stroke-width": 3.2, d: seg(cx + 26, y, cx + 26 + LW[i], y + (r() - .5) * 2, r, 1.2) }, g);
    });
    // citation chips
    function chip(x, y, txt) {
      var c = el("g", { transform: "translate(" + x + " " + y + ")" }, g);
      var inner = el("g", null, c);
      el("rect", { x: -19, y: -13, width: 38, height: 25, rx: 5, class: "f-washs" }, inner);
      el("path", { class: "s-ink", d: box(-19, -13, 38, 25, rng(x), 1) }, inner);
      var tt = el("text", { x: 0, y: 5, "text-anchor": "middle", class: "t-mono t-ink", "font-size": 14, "font-weight": 600 }, inner);
      tt.textContent = txt;
      return inner;
    }
    var chips = [chip(cx + 26 + LW[1] + 30, 160, "[1]"), chip(cx + 26 + LW[4] + 30, 250, "[2]")];
    // source slots at the bottom of the card
    var SX = [cx + 70, cx + 160], SY = 304;
    var leaders = [
      el("path", { class: "s-ink s-dash", d: "M" + (cx + LW[1] + 56) + " 174 C " + (cx + LW[1] + 70) + " 250, " + (SX[0] + 60) + " 260, " + (SX[0] + 12) + " " + (SY - 22) }, g),
      el("path", { class: "s-ink s-dash", d: "M" + (cx + LW[4] + 56) + " 264 C " + (cx + LW[4] + 62) + " 290, " + (SX[1] + 50) + " 284, " + (SX[1] + 18) + " " + (SY - 18) }, g)
    ];
    // trails + envelopes
    var start = [185, 186];
    var targets = LY.map(function (y) { return [cx + 46, y]; }).concat([[SX[0], SY], [SX[1], SY]]);
    var trails = [], envs = [];
    targets.forEach(function (tg, i) {
      var c1 = [300 + i * 22, -10 + i * 18];
      trails.push(el("path", { class: "s-faint s-dash", d: "M" + start[0] + " " + start[1] + " Q" + c1[0] + " " + c1[1] + " " + tg[0] + " " + tg[1], opacity: 0 }, g));
      var e = el("g", { opacity: 0 }, g);
      var er = rng(50 + i);
      el("rect", { x: -22, y: -14, width: 44, height: 28, class: "f-card" }, e);
      el("path", { class: i >= 5 ? "s-ink" : "s-pen", d: box(-22, -14, 44, 28, er, 1) + " M-22 -14 L0 3 L22 -14" }, e);
      envs.push({ g: e, c1: c1, tg: tg, src: i >= 5 });
    });
    lines.forEach(function (p) { p._L = p.getTotalLength(); p.style.strokeDasharray = p._L; });
    leaders.forEach(function (p) { p._L = p.getTotalLength(); });
    hero = { svg: svg, stat: stat, opening: opening, lid: lid, lines: lines, chips: chips, leaders: leaders, trails: trails, envs: envs, labT: labT, lab: lab, t0: 0, raf: 0 };
    heroText();
  }
  function heroText() { if (hero) hero.labT.textContent = tp("c1.fig_box"); }
  function heroFrame(ms) {
    var H = hero;
    // lid: hinged on the back edge; front edge swings up
    var th = ease((ms - 700) / 750) * 1.95;
    var c = Math.cos(th), s = Math.sin(th);
    var vx = -42 * c, vy = 24 * c - 62 * s;
    H.lid.setAttribute("d", "M112 176 L292 176 L" + f(292 + vx) + " " + f(176 + vy) + " L" + f(112 + vx) + " " + f(176 + vy) + " Z");
    H.opening.setAttribute("opacity", ss(700, 1000, ms));
    H.envs.forEach(function (e, i) {
      var k = (ms - (1250 + i * 190)) / 950;
      var tr = H.trails[i];
      if (k <= 0) { e.g.setAttribute("opacity", 0); tr.setAttribute("opacity", 0); return; }
      var q = ease(k), u = 1 - q;
      var x = u * u * 185 + 2 * u * q * e.c1[0] + q * q * e.tg[0];
      var y = u * u * 186 + 2 * u * q * e.c1[1] + q * q * e.tg[1];
      var sc = e.src ? lerp(.7, .62, q) : lerp(.7, .45, q);
      var rot = Math.sin(q * Math.PI) * (i % 2 ? 18 : -14);
      var op = e.src ? ss(0, .12, k) : ss(0, .12, k) * (1 - ss(.82, 1, k));
      e.g.setAttribute("transform", "translate(" + f(x) + " " + f(y) + ") rotate(" + f(rot) + ") scale(" + f(sc) + ")");
      e.g.setAttribute("opacity", f(op * 100) / 100);
      tr.setAttribute("opacity", f(ss(0, .3, k) * (1 - ss(1, 1.8, k)) * .8 * 100) / 100);
      if (!e.src) {
        var ln = H.lines[i], d = ss(.72, 1.25, k);
        ln.style.strokeDashoffset = f(ln._L * (1 - d));
      }
    });
    var cs = [3300, 3520];
    H.chips.forEach(function (ch, i) {
      var k = ease((ms - cs[i]) / 380);
      var pop = k <= 0 ? 0 : k + Math.sin(k * Math.PI) * .25;
      ch.setAttribute("transform", "scale(" + f(pop * 100) / 100 + ")");
      var ld = H.leaders[i], kk = ss(cs[i] + 250, cs[i] + 900, ms);
      ld.style.strokeDasharray = kk >= 1 ? "" : (f(ld._L * kk) + " " + ld._L);
    });
    return ms < 4500;
  }
  function playHero() {
    if (!hero) return;
    cancelAnimationFrame(hero.raf);
    if (reduced()) { hero.stat.forEach(function (p) { p.style.strokeDasharray = ""; }); heroFrame(1e5); return; }
    inkHide(hero.stat);
    heroFrame(0);
    requestAnimationFrame(function () { inkIn(hero.stat, 0.07); });
    var t0 = performance.now();
    var loop = function (now) { if (heroFrame(now - t0)) hero.raf = requestAnimationFrame(loop); };
    hero.raf = requestAnimationFrame(loop);
  }

  // ================================================================ fig 2 · the black box (orbiting questions)
  var c1 = null;
  var QMARK = "M-11 -16 C -11 -30, 13 -32, 13 -16 C 13 -5, 1 -6, 1 7";
  function buildC1() {
    var svg = $("#vo55-c1-svg");
    svg.textContent = "";
    var r = rng(23);
    var CX = 320, CY = 236;
    svg.setAttribute("aria-label", tp("c1.fig"));
    var orbit = el("ellipse", { cx: CX, cy: CY + 4, rx: 236, ry: 146, class: "s-faint s-dash", fill: "none" }, svg);
    var g = el("g", null, svg);
    var strokes = [];
    el("ellipse", { cx: 330, cy: 340, rx: 140, ry: 10, class: "f-washs", opacity: .45 }, g);
    // crate
    strokes.push(el("path", { class: "s-pen dr f-card", d: quad([[228, 210], [278, 180], [432, 180], [382, 210]], r, 1.2) }, g));
    strokes.push(el("path", { class: "s-pen dr f-card", d: box(228, 210, 154, 126, r, 1.6) }, g));
    strokes.push(el("path", { class: "s-pen dr f-card", d: quad([[382, 210], [432, 180], [432, 302], [382, 336]], r, 1.2) }, g));
    el("path", { class: "f-washs", d: "M296 210 L346 180 L366 180 L316 210 Z M296 210 H316 V262 H296 Z", opacity: .9 }, g);
    strokes.push(el("path", { class: "s-ink dr", d: seg(296, 210, 296, 262, r, .6) + seg(316, 210, 316, 262, r, .6) + seg(296, 210, 346, 180, r, .6) + seg(316, 210, 366, 180, r, .6) }, g));
    el("rect", { x: 246, y: 278, width: 118, height: 38, class: "f-card" }, g);
    strokes.push(el("path", { class: "s-ink dr", d: box(246, 278, 118, 38, r, 1) }, g));
    var lab = el("text", { x: 305, y: 303, "text-anchor": "middle", class: "t-mono t-ink", "font-size": 15, "font-weight": 600 }, g);
    // padlock on the tape
    var lock = el("g", { class: "vo55-lock" }, g);
    strokes.push(el("path", { class: "s-pen dr", d: "M298 238 V230 a8 8 0 0 1 16 0 V238" }, lock));
    el("rect", { x: 292, y: 237, width: 28, height: 22, rx: 3, class: "f-card" }, lock);
    strokes.push(el("path", { class: "s-pen dr", d: box(292, 237, 28, 22, r, .8) }, lock));
    el("circle", { cx: 306, cy: 246, r: 2.4, class: "f-ink" }, lock);
    strokes.push(el("path", { class: "s-ink dr", d: "M306 248 v5" }, lock));
    var spark = el("path", { class: "s-ink", d: "M286 222 l-10 -10 M326 222 l10 -10 M306 214 v-14 M280 240 h-12 M332 240 h12", opacity: 0 }, g);
    var shot = el("path", { class: "s-ink s-dash", opacity: 0 }, svg);
    // the three questions
    var qs = list("c1.fig_questions").map(function (q, i) {
      var qg = el("g", { class: "vo55-q", tabindex: 0, role: "button", "aria-label": q }, svg);
      var inner = el("g", null, qg);
      el("rect", { class: "q-hit", x: -95, y: -42, width: 190, height: 98 }, inner);
      el("rect", { class: "q-ring", x: -95, y: -42, width: 190, height: 98, rx: 10 }, inner);
      var mark = el("g", { transform: "scale(1.25)" }, inner);
      el("path", { class: "s-ink", "stroke-width": 3, d: QMARK }, mark);
      el("circle", { cx: 1, cy: 17, r: 2.8, class: "f-ink" }, mark);
      var lt = el("text", { class: "q-label", "text-anchor": "middle", y: 48 }, inner);
      lt.textContent = q;
      qg.addEventListener("click", function () { askBox(i); });
      qg.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); askBox(i); } });
      qg.addEventListener("mouseenter", function () { c1.hold++; });
      qg.addEventListener("mouseleave", function () { c1.hold = Math.max(0, c1.hold - 1); });
      qg.addEventListener("focus", function () { c1.hold++; });
      qg.addEventListener("blur", function () { c1.hold = Math.max(0, c1.hold - 1); });
      return { g: qg, inner: inner, label: lt, x: 0, y: 0 };
    });
    var prev = c1;
    c1 = { svg: svg, qs: qs, lock: lock, spark: spark, shot: shot, lab: lab, strokes: strokes, CX: CX, CY: CY,
           ang: prev ? prev.ang : -1.75, hold: 0, raf: 0, last: 0, drawn: prev ? prev.drawn : false, running: false };
    lab.textContent = tp("c1.fig_box");
    placeQs();
    if (!c1.drawn) inkHide(strokes);
    if (prev && prev.running) startOrbit();
    void orbit;
  }
  function placeQs() {
    c1.qs.forEach(function (q, i) {
      var a = c1.ang + i * Math.PI * 2 / 3;
      var x = c1.CX + Math.cos(a) * 236, y = c1.CY + 4 + Math.sin(a) * 146 - 14;
      q.x = x; q.y = y;
      var lx = clamp(x, 100, 540) - x;
      q.g.setAttribute("transform", "translate(" + f(x) + " " + f(y) + ")");
      q.label.setAttribute("x", f(lx));
    });
  }
  function startOrbit() {
    c1.running = true;
    if (reduced()) return;
    cancelAnimationFrame(c1.raf);
    c1.last = performance.now();
    var loop = function (now) {
      var dt = Math.min(64, now - c1.last); c1.last = now;
      if (!c1.hold) { c1.ang += dt * 0.00011; placeQs(); }
      c1.raf = requestAnimationFrame(loop);
    };
    c1.raf = requestAnimationFrame(loop);
  }
  function askBox(i) {
    var q = c1.qs[i], sx = q.x, sy = q.y + 26, ex = 306, ey = 244;
    var mx = (sx + ex) / 2 + (sy - ey) * .18, my = (sy + ey) / 2 - (ex - sx) * .18;
    var shot = c1.shot;
    shot.setAttribute("d", "M" + f(sx) + " " + f(sy) + " Q" + f(mx) + " " + f(my) + " " + ex + " " + ey);
    var L = shot.getTotalLength();
    var lock = c1.lock, spark = c1.spark;
    if (reduced()) {
      shot.style.strokeDasharray = "5 6"; shot.setAttribute("opacity", .9); spark.setAttribute("opacity", 1);
      clearTimeout(c1.to); c1.to = setTimeout(function () { shot.setAttribute("opacity", 0); spark.setAttribute("opacity", 0); }, 1400);
      return;
    }
    var t0 = performance.now();
    cancelAnimationFrame(c1.shotRaf);
    var step = function (now) {
      var k = (now - t0) / 650;
      var d = ease(Math.min(1, k)) * L;
      shot.style.strokeDasharray = "5 6";
      shot.style.strokeDashoffset = 0;
      shot.setAttribute("opacity", k < 1 ? .95 : f(Math.max(0, 1 - (k - 1) * 2.2) * 100) / 100);
      // reveal the dashed line progressively by masking the tail
      shot.setAttribute("stroke-dasharray", "");
      shot.style.strokeDasharray = dashUpTo(d, L);
      if (k >= 1 && !lock.classList.contains("is-shake")) {
        lock.classList.add("is-shake"); spark.setAttribute("opacity", 1);
        setTimeout(function () { lock.classList.remove("is-shake"); spark.setAttribute("opacity", 0); }, 520);
      }
      if (k < 1.5) c1.shotRaf = requestAnimationFrame(step);
      else shot.setAttribute("opacity", 0);
    };
    c1.shotRaf = requestAnimationFrame(step);
  }
  function dashUpTo(d, L) { // dashed pattern drawn only up to length d
    var arr = [], p = 0;
    while (p + 11 <= d) { arr.push(5, 6); p += 11; }
    arr.push(Math.max(0, Math.min(5, d - p)), L + 20);
    return arr.join(" ");
  }

  // ================================================================ fig 3 · ingest pipeline (scroll-driven)
  var c2 = null;
  var U0 = -0.6, U1 = 6;
  function wrap(text, max) {
    var words = text.split(" "), out = [], cur = "";
    words.forEach(function (w) {
      if (cur && (cur + " " + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
    });
    if (cur) out.push(cur);
    return out;
  }
  function c2Layout() { return window.matchMedia("(max-width: 720px)").matches ? "v" : "h"; }
  function buildC2() {
    var svg = $("#vo55-c2-svg");
    var steps = list("c2.fig_steps");
    var V = c2Layout() === "v";
    var keepU = c2 ? c2.u : (reduced() ? U1 : U0);
    svg.textContent = "";
    svg.setAttribute("viewBox", V ? "0 0 360 560" : "0 0 1000 330");
    svg.classList.toggle("vo55-v", V);
    svg.setAttribute("aria-label", tp("c2.fig") + ": " + steps.join(" → "));
    var r = rng(5);
    var N = steps.length;
    var pos = V
      ? function (u) { return [70, 52 + u * 76]; }
      : function (u) { return [84 + u * 139, 214]; };
    // belt
    var belt = el("g", null, svg);
    if (V) {
      el("path", { class: "s-pen", d: seg(62, 6, 62, 554, r, 1.5) + " " + seg(78, 6, 78, 554, r, 1.5) }, belt);
      for (var y = 22; y < 552; y += 40) el("circle", { cx: 70, cy: y, r: 3.2, class: "s-soft" }, belt);
    } else {
      el("path", { class: "s-pen", d: seg(14, 250, 986, 251, r, 2) + " " + seg(14, 262, 986, 263, r, 2) }, belt);
      for (var x = 30; x < 984; x += 46) el("circle", { cx: x, cy: 256.5, r: 3.6, class: "s-soft" }, belt);
      el("path", { class: "s-soft", d: "M14 250 a6 6 0 0 0 0 12 M986 251 a6 6 0 0 1 0 12" }, belt);
    }
    // stations
    var stations = steps.map(function (label, i) {
      var p = pos(i);
      var sg = el("g", { class: "vo55-station" }, svg);
      if (V) {
        var yy = p[1];
        el("path", { class: "s-soft st-gate", d: "M34 " + (yy - 30) + " Q22 " + (yy - 30) + " 22 " + (yy - 20) + " L22 " + (yy + 20) + " Q22 " + (yy + 30) + " 34 " + (yy + 30) +
          " M106 " + (yy - 30) + " Q118 " + (yy - 30) + " 118 " + (yy - 20) + " L118 " + (yy + 20) + " Q118 " + (yy + 30) + " 106 " + (yy + 30) }, sg);
        el("path", { class: "s-faint s-dash", d: "M124 " + yy + " H136" }, sg);
        var no = el("text", { x: 142, y: yy - 8, class: "st-no" }, sg); no.textContent = "0" + (i + 1);
        var tl = el("text", { x: 142, y: yy + 14, class: "st-label" }, sg);
        wrap(label, 20).forEach(function (ln, k) { var ts = el("tspan", { x: 142, dy: k ? 20 : 0 }, tl); ts.textContent = ln; });
      } else {
        var xx = p[0];
        el("path", { class: "s-soft st-gate", d: "M" + (xx - 42) + " 249 L" + (xx - 42) + " 160 Q" + (xx - 42) + " 146 " + (xx - 28) + " 146 L" + (xx + 28) + " 146 Q" + (xx + 42) + " 146 " + (xx + 42) + " 160 L" + (xx + 42) + " 249" }, sg);
        el("path", { class: "s-faint s-dash", d: "M" + xx + " 112 V138" }, sg);
        var no2 = el("text", { x: xx, y: 40, class: "st-no", "text-anchor": "middle" }, sg); no2.textContent = "0" + (i + 1);
        var tl2 = el("text", { x: xx, y: 66, class: "st-label", "text-anchor": "middle" }, sg);
        wrap(label, 13).forEach(function (ln, k) { var ts = el("tspan", { x: xx, dy: k ? 19 : 0 }, tl2); ts.textContent = ln; });
      }
      sg.addEventListener("click", function () { goStep(i); });
      return sg;
    });
    // destination: vector store cylinder
    var dp = pos(N - 1), cyl = el("g", { transform: "translate(" + dp[0] + " " + dp[1] + ") scale(" + (V ? .82 : 1) + ")" }, svg);
    var bands = [];
    for (var b = 0; b < 4; b++) {
      bands.push(el("path", { class: "f-washs", d: "M-28 " + (22 - b * 11) + " a28 7 0 0 0 56 0 v-9 a28 7 0 0 1 -56 0 Z", opacity: 0 }, cyl));
    }
    el("path", { class: "s-pen", d: "M-28 -20 V24 a28 8 0 0 0 56 0 V-20" }, cyl);
    el("ellipse", { cx: 0, cy: -20, rx: 28, ry: 8, class: "s-pen f-card" }, cyl);
    // the travelling item
    var item = el("g", null, svg);
    var S = el("g", { transform: V ? "scale(.9)" : "scale(1.12)" }, item);
    var gStack = el("g", null, S);
    [[-8, -9], [-4, -4.5], [0, 0]].forEach(function (o, k) {
      var e = el("g", { transform: "translate(" + o[0] + " " + o[1] + ")" }, gStack);
      el("rect", { x: -30, y: -20, width: 60, height: 40, class: "f-card" }, e);
      el("path", { class: "s-pen", d: box(-30, -20, 60, 40, rng(70 + k), 1) + " M-30 -20 L0 2 L30 -20" }, e);
    });
    var pst = el("text", { x: 0, y: 15, "text-anchor": "middle", class: "t-mono t-ink", "font-size": 10, "font-weight": 600 }, gStack); pst.textContent = "PST";
    var gLetter = el("g", null, S);
    el("rect", { x: -26, y: -28, width: 52, height: 56, class: "f-card" }, gLetter);
    el("path", { class: "s-pen", d: box(-26, -28, 52, 56, rng(81), 1) }, gLetter);
    el("path", { class: "s-soft", d: "M-18 -18 H12 M-18 -10 H16 M-18 -2 H6" }, gLetter);
    var mess = el("g", null, gLetter);
    el("path", { class: "s-faint", "stroke-width": 1.6, d: "M-18 6 h4 m3 0 h22 M-18 12 h4 m3 0 h18 M-18 18 h4 m3 0 h12" }, mess);
    el("path", { class: "s-soft", d: "M-14 23 q4 -6 7 0 t7 0 t7 -2" }, mess);
    var tag = el("text", { x: 10, y: -20, class: "t-mono", "font-size": 8 }, mess); tag.textContent = "</>";
    var gCards = el("g", null, S);
    var cards = [[-14, -16, -7], [0, 0, 0], [14, 15, 6]].map(function (o, k) {
      var c = el("g", { transform: "translate(" + o[0] + " " + o[1] + ") rotate(" + o[2] + ")" }, gCards);
      var inner = el("g", null, c);
      el("rect", { x: -30, y: -20, width: 60, height: 40, class: "f-card" }, inner);
      el("path", { class: "s-pen", d: box(-30, -20, 60, 40, rng(90 + k), .9) }, inner);
      // header row: sender · date · subject, drawn as marks
      el("circle", { cx: -23, cy: -13, r: 2.6, class: "f-ink" }, inner);
      el("path", { class: "s-ink", "stroke-width": 2, d: "M-17 -13 h10 M-3 -13 h7 M8 -13 h16" }, inner);
      el("path", { class: "s-faint", d: "M-26 -7 H26" }, inner);
      var body = el("path", { class: "s-soft", d: "M-24 1 H20 M-24 8 H12" }, inner);
      var vec = el("g", { opacity: 0 }, inner);
      [5, 9, 3, 11, 7, 4, 10, 6, 8].forEach(function (hh, z) { el("path", { class: "s-ink", "stroke-width": 2.4, d: "M" + (-23 + z * 5.6) + " 13 v-" + hh }, vec); });
      var eq = el("text", { x: 22, y: 12, class: "t-mono t-ink", "font-size": 12, "font-weight": 700, opacity: 0 }, inner);
      eq.textContent = k === 2 ? "=" : "";
      var strike = el("path", { class: "s-ink", "stroke-width": 2.4, d: "M-30 -20 L30 20 M30 -20 L-30 20", opacity: 0 }, inner);
      return { g: c, base: o, body: body, vec: vec, eq: eq, strike: strike };
    });
    c2 = { svg: svg, V: V, N: N, steps: steps, pos: pos, stations: stations, bands: bands, item: item, gStack: gStack, gLetter: gLetter, mess: mess, gCards: gCards, cards: cards, u: keepU, layout: V ? "v" : "h" };
    // stepper
    var sp = $("#vo55-c2-steps"); sp.textContent = "";
    sp.setAttribute("aria-label", tp("c2.fig"));
    c2.btns = steps.map(function (s, i) {
      var b = h("button", "vo55-step", sp, "0" + (i + 1));
      b.type = "button"; b.setAttribute("aria-label", "0" + (i + 1) + " — " + s);
      b.addEventListener("click", function () { goStep(i); });
      return b;
    });
    renderC2(keepU);
    if (!reduced()) syncC2FromScroll();
  }
  function renderC2(u) {
    var C = c2; if (!C) return;
    u = clamp(u, U0, U1); C.u = u;
    var on = u < -0.35 ? -1 : Math.round(u);
    C.stations.forEach(function (s, i) {
      s.classList.toggle("is-on", i === on);
      s.classList.toggle("is-past", i < on || (i <= u));
    });
    C.btns.forEach(function (b, i) {
      if (i === on) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      b.classList.toggle("is-past", i < on);
    });
    var now = $("#vo55-c2-now"); now.textContent = "";
    if (on >= 0) { h("b", null, now, "0" + (on + 1)); now.appendChild(document.createTextNode(C.steps[on])); }
    // item position and state
    var p = C.pos(Math.min(u, C.N - 1));
    var absorb = ss(5.55, 5.98, u);
    var sc = 1 - absorb * .7;
    C.item.setAttribute("transform", "translate(" + f(p[0]) + " " + f(p[1] - absorb * 6) + ") scale(" + f(sc * 100) / 100 + ")");
    C.item.setAttribute("opacity", f((1 - ss(5.8, 6, u)) * 100) / 100);
    var F = 0.12;
    C.gStack.setAttribute("opacity", f((1 - ss(1 - F, 1 + F, u)) * 100) / 100);
    C.gLetter.setAttribute("opacity", f((ss(1 - F, 1 + F, u) * (1 - ss(3 - F, 3 + F, u))) * 100) / 100);
    C.mess.setAttribute("opacity", f((1 - ss(2 - F, 2 + F, u)) * 100) / 100);
    C.gCards.setAttribute("opacity", f(ss(3 - F, 3 + F, u) * 100) / 100);
    var fan = ss(3 - F, 3.3, u);
    C.cards.forEach(function (c, k) {
      var o = c.base;
      var x = o[0] * fan, y = o[1] * fan, rot = o[2] * fan;
      if (k === 2) {
        var d = ss(4 - F, 4.6, u);
        x += d * 10; y += d * (C.V ? 30 : 46); rot += d * 26;
        c.g.setAttribute("opacity", f((1 - ss(4.3, 4.75, u)) * 100) / 100);
        c.eq.setAttribute("opacity", f(ss(3.5, 3.85, u) * 100) / 100);
        c.strike.setAttribute("opacity", f(ss(3.9, 4.1, u) * 100) / 100);
      }
      if (k === 0) { x -= ss(4, 4.5, u) * 4; }
      c.g.setAttribute("transform", "translate(" + f(x) + " " + f(y) + ") rotate(" + f(rot) + ")");
      var e = ss(5 - F, 5 + F, u);
      c.vec.setAttribute("opacity", f(e * 100) / 100);
      c.body.setAttribute("opacity", f((1 - e) * 100) / 100);
    });
    C.bands.forEach(function (b, i) { b.setAttribute("opacity", f(ss(5.6 + i * .08, 5.75 + i * .08, u) * 100) / 100); });
  }
  function scrollyMetrics() {
    var tr = $("#vo55-scrolly"), rect = tr.getBoundingClientRect();
    var span = rect.height - window.innerHeight * 0.92;
    return { top: rect.top + window.scrollY, span: Math.max(1, span), rect: rect };
  }
  function syncC2FromScroll() {
    if (reduced() || !c2) return;
    var m = scrollyMetrics();
    var start = window.innerHeight * 0.08;
    var p = clamp((start - m.rect.top) / m.span, 0, 1);
    renderC2(U0 + p * (U1 - U0));
  }
  function goStep(i) {
    if (reduced()) { renderC2(i); return; }
    var m = scrollyMetrics();
    var p = (i + 0.02 - U0) / (U1 - U0);
    var y = m.top - window.innerHeight * 0.08 + p * m.span;
    window.scrollTo({ top: Math.round(y), behavior: "smooth" });
    renderC2(c2.u);
  }

  // ================================================================ fig 4 · chat with citations
  var chat = { tab: 0, timer: 0, open: {} };
  var BARS = [[.34, .88, .26, .41, .74, .2, .3, .16], [.22, .31, .17, .27, .14, .24, .19, .11]];
  var HITS = [[1, 4], []];
  function buildChat(animate) {
    var tabs = $("#vo55-chat-tabs"); tabs.textContent = "";
    var qs = [tp("c3.fig_q"), tp("c3.fig_q2")];
    var tbs = qs.map(function (q, i) {
      var b = h("button", "vo55-tab", tabs);
      b.type = "button"; b.id = "vo55-tab-" + i;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", "vo55-chat-panel");
      h("b", null, b, "0" + (i + 1));
      h("span", null, b, q);
      b.addEventListener("click", function () { if (chat.tab !== i) { chat.tab = i; chat.open = {}; buildChat(true); $("#vo55-tab-" + i).focus(); } });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault(); chat.tab = 1 - chat.tab; chat.open = {}; buildChat(true); $("#vo55-tab-" + chat.tab).focus();
        }
      });
      return b;
    });
    tbs.forEach(function (b, i) {
      b.setAttribute("aria-selected", String(i === chat.tab));
      b.tabIndex = i === chat.tab ? 0 : -1;
    });
    var panel = $("#vo55-chat-panel"); panel.textContent = "";
    panel.setAttribute("aria-labelledby", "vo55-tab-" + chat.tab);
    // question
    var mq = h("div", "vo55-msg vo55-msg--q", panel);
    h("div", "vo55-bubble", mq, qs[chat.tab]);
    // retrieval: eight passages, relevance bars
    var retr = h("div", "vo55-retr", panel);
    var W = 360, HH = 76;
    var svg = el("svg", { viewBox: "0 -18 " + W + " " + (HH + 34), "aria-hidden": "true" }, retr);
    var thrY = HH - 0.55 * HH;
    var bars = [];
    BARS[chat.tab].forEach(function (v, i) {
      var x = i * 45 + 4;
      var hit = HITS[chat.tab].indexOf(i);
      var bar = el("rect", { x: x, y: 0, width: 30, height: HH, rx: 2, class: "bar " + (hit >= 0 ? "bar-hit" : "bar-low") }, svg);
      bar.style.transformBox = "fill-box"; bar.style.transformOrigin = "50% 100%";
      bar.style.transform = "scaleY(" + (animate && !reduced() ? 0.02 : v) + ")";
      bars.push([bar, v]);
      var n = el("text", { x: x + 15, y: HH + 15, "text-anchor": "middle", class: "bar-n" }, svg); n.textContent = i + 1;
      if (hit >= 0) {
        var c = el("text", { x: x + 15, y: HH - v * HH - 7, "text-anchor": "middle", class: "t-mono t-ink", "font-size": 12, "font-weight": 600 }, svg);
        c.textContent = "[" + (hit + 1) + "]";
        c.style.fill = "var(--ink)";
        c.style.fontFamily = "var(--mono)";
      }
    });
    el("path", { class: "thr", d: "M0 " + thrY + " H" + (W - 6) }, svg);
    var cnt = h("div", "vo55-retr-count", retr, tp("stat2"));
    h("small", null, cnt, tp("stat2_label"));
    // answer
    var ma = h("div", "vo55-msg vo55-msg--a", panel);
    var av = el("svg", { class: "vo55-avatar", viewBox: "0 0 34 34", "aria-hidden": "true" }, ma);
    el("circle", { cx: 17, cy: 17, r: 4 }, av);
    el("path", { d: "M10 10 a10 10 0 0 0 0 14 M24 10 a10 10 0 0 1 0 14 M5 5 a17 17 0 0 0 0 24 M29 5 a17 17 0 0 1 0 24" }, av);
    var bub = h("div", "vo55-bubble", ma);
    var srcWrap = h("div", "vo55-sources", panel);
    var finish = function () {
      bub.textContent = "";
      if (chat.tab === 0) fillAnswer(bub, srcWrap); else fillNotFound(bub);
    };
    clearTimeout(chat.timer);
    if (animate && !reduced()) {
      var ty = h("span", "vo55-typing", bub); h("i", null, ty); h("i", null, ty); h("i", null, ty);
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        bars.forEach(function (b, i) { b[0].style.transition = "transform .55s cubic-bezier(.3,1.3,.5,1) " + (i * 0.05) + "s"; b[0].style.transform = "scaleY(" + b[1] + ")"; });
      }); });
      chat.timer = setTimeout(finish, 900);
    } else finish();
  }
  function fillAnswer(bub, srcWrap) {
    var txt = tp("c3.fig_answer");
    var srcs = [tp("c3.fig_src1"), tp("c3.fig_src2")];
    var parts = txt.split(/(\[\d+\])/);
    parts.forEach(function (p) {
      var m = p.match(/^\[(\d+)\]$/);
      if (!m) { bub.appendChild(document.createTextNode(p)); return; }
      var n = +m[1];
      var b = h("button", "vo55-cite", bub, p);
      b.type = "button";
      b.setAttribute("aria-controls", "vo55-src-" + n);
      b.setAttribute("aria-expanded", String(!!chat.open[n]));
      b.setAttribute("aria-label", p + " " + (srcs[n - 1] || ""));
      b.addEventListener("click", function () {
        chat.open[n] = !chat.open[n];
        b.setAttribute("aria-expanded", String(chat.open[n]));
        $("#vo55-src-" + n).hidden = !chat.open[n];
      });
    });
    srcs.forEach(function (s, i) {
      var n = i + 1;
      var card = h("article", "vo55-src", srcWrap);
      card.id = "vo55-src-" + n;
      card.hidden = !chat.open[n];
      var head = h("div", "vo55-src-head", card);
      var bits = s.split(/\s+·\s+/);
      h("span", "n", head, bits[0] || s);
      if (bits[1]) h("span", "d", head, bits[1]);
      if (bits.length > 2) h("span", "s", head, bits.slice(2).join(" · "));
      // the email body, with the cited passage highlighted
      var sv = el("svg", { viewBox: "0 0 400 50", preserveAspectRatio: "none", "aria-hidden": "true" }, card);
      var hl = i === 0 ? 1 : 2;
      [[6, 300], [6, 360], [6, 250], [6, 330]].forEach(function (l, k) {
        var y = 6 + k * 12.5;
        if (k === hl) el("path", { class: "hl", d: "M" + l[0] + " " + y + " H" + l[1] }, sv);
        if (k < 4) el("path", { class: k === hl ? "ln-k" : "ln", d: "M" + l[0] + " " + y + " H" + (l[1] - (k === 3 ? 90 : 0)), "stroke-width": 3 }, sv);
      });
    });
  }
  function fillNotFound(bub) {
    var w = h("span", "vo55-nf", bub);
    var sv = el("svg", { viewBox: "0 0 30 30", "aria-hidden": "true" }, w);
    el("circle", { cx: 15, cy: 15, r: 11 }, sv);
    el("path", { d: "M7 23 L23 7" }, sv);
    h("span", null, w, tp("c3.fig_notfound"));
  }

  // ================================================================ fig 5 · POC → production, inside the boundary
  var c4 = { played: false, timers: [] };
  function buildScale() {
    var host = $("#vo55-scale"); host.textContent = "";
    host.classList.toggle("is-bounded", c4.played);
    h("div", "vo55-col-head", host, tp("status"));
    h("div", null, host);
    h("div", "vo55-col-head vo55-col-head--prod", host, tp("c4.label"));
    var rows = list("c4.fig_rows").map(function (row, i) {
      var parts = row.split(/\s*→\s*/);
      var left = parts.length > 1 ? parts[0] : "", right = parts.length > 1 ? parts.slice(1).join(" → ") : parts[0];
      var R = h("div", "vo55-row" + (c4.played ? " is-moved" : ""), host);
      var b = h("button", "vo55-cell vo55-cell--poc" + (left ? "" : " is-empty"), R);
      b.type = "button";
      h("span", "num", b, "0" + (i + 1));
      h("span", null, b, left || "—");
      b.setAttribute("aria-label", (left || "—") + " → " + right);
      var ar = h("div", "vo55-arrow", R);
      if (!left) ar.style.visibility = "hidden";
      var s = el("svg", { viewBox: "0 0 64 24", "aria-hidden": "true" }, ar);
      var rr = rng(40 + i);
      var p = el("path", { d: "M3 " + f(12 + (rr() - .5) * 4) + " C 22 " + f(8 + rr() * 6) + ", 40 " + f(10 + rr() * 6) + ", 58 12 M50 6 L58 12 L50 18" }, s);
      p.style.strokeDasharray = "90"; p.style.strokeDashoffset = c4.played ? "0" : "90";
      var pr = h("div", "vo55-cell vo55-cell--prod", R);
      h("span", "ph", pr);
      h("span", "tx", pr, right);
      var on = function () { R.classList.add("is-hot"); move(R); };
      var off = function () { R.classList.remove("is-hot"); };
      b.addEventListener("mouseenter", on); b.addEventListener("mouseleave", off);
      b.addEventListener("focus", on); b.addEventListener("blur", off);
      b.addEventListener("click", function () { move(R); R.classList.toggle("is-hot"); });
      return R;
    });
    c4.rows = rows;
    var bsv = el("svg", { class: "vo55-boundary", "aria-hidden": "true", preserveAspectRatio: "none" }, host);
    el("path", null, bsv);
    var tag = h("span", "vo55-btag", host, tp("c4.fig_boundary"));
    c4.bsv = bsv; c4.tag = tag; c4.host = host;
    layoutBoundary();
  }
  function move(R) {
    R.classList.add("is-moved");
    var p = $(".vo55-arrow path", R); if (p) p.style.strokeDashoffset = "0";
  }
  function layoutBoundary() {
    var host = c4.host; if (!host) return;
    var heads = $(".vo55-col-head--prod", host), cells = $$(".vo55-cell--prod", host);
    if (!heads || !cells.length) return;
    var hb = host.getBoundingClientRect(), a = heads.getBoundingClientRect(), z = cells[cells.length - 1].getBoundingClientRect();
    var x = a.left - hb.left - 6, y = a.top - hb.top - 10, w = hb.right - a.left + 8, hh = z.bottom - a.top + 30;
    var s = c4.bsv;
    s.style.left = x + "px"; s.style.top = y + "px"; s.style.width = w + "px"; s.style.height = hh + "px";
    s.setAttribute("viewBox", "0 0 " + f(w) + " " + f(hh));
    var r = rng(17);
    var R = 14, jx = function (v) { return f(v + (r() - .5) * 3); };
    var d = "M" + jx(R) + " " + jx(2) + " Q" + jx(w * .5) + " " + jx(-1) + " " + jx(w - R) + " " + jx(3) +
      " Q" + jx(w - 2) + " " + jx(2) + " " + jx(w - 2) + " " + jx(R) +
      " Q" + jx(w + 1) + " " + jx(hh * .5) + " " + jx(w - 3) + " " + jx(hh - R) +
      " Q" + jx(w - 3) + " " + jx(hh - 2) + " " + jx(w - R) + " " + jx(hh - 2) +
      " Q" + jx(w * .5) + " " + jx(hh + 1) + " " + jx(R) + " " + jx(hh - 3) +
      " Q" + jx(2) + " " + jx(hh - 3) + " " + jx(2) + " " + jx(hh - R) +
      " Q" + jx(-1) + " " + jx(hh * .5) + " " + jx(3) + " " + jx(R) +
      " Q" + jx(3) + " " + jx(3) + " " + jx(R + 4) + " " + jx(2);
    $("path", s).setAttribute("d", d);
    var tw = c4.tag.offsetWidth;
    c4.tag.style.left = clamp(x + w - tw - 18, 0, Math.max(0, hb.width - tw - 4)) + "px";
    c4.tag.style.top = (y + hh - 13) + "px";
  }
  function playScale() {
    c4.timers.forEach(clearTimeout); c4.timers = [];
    if (reduced()) { c4.played = true; c4.rows.forEach(move); c4.host.classList.add("is-bounded"); return; }
    c4.played = false;
    c4.host.classList.remove("is-bounded");
    c4.rows.forEach(function (R) {
      R.classList.remove("is-moved", "is-hot");
      var p = $(".vo55-arrow path", R); p.style.transition = "none"; p.style.strokeDashoffset = "90";
      p.getBoundingClientRect(); p.style.transition = "";
    });
    c4.rows.forEach(function (R, i) {
      c4.timers.push(setTimeout(function () { R.classList.add("is-hot"); move(R); }, 350 + i * 480));
      c4.timers.push(setTimeout(function () { R.classList.remove("is-hot"); }, 350 + i * 480 + 700));
    });
    c4.timers.push(setTimeout(function () { c4.played = true; c4.host.classList.add("is-bounded"); }, 350 + c4.rows.length * 480 + 200));
  }

  // ================================================================ boot
  function renderAll(first) {
    renderStatic();
    renderTitles();
    renderStats();
    renderLessons();
    if (first) { buildHero(); } else heroText();
    buildC1();
    buildC2();
    buildChat(false);
    buildScale();
  }

  window.OZ.ready.then(function () {
    renderAll(true);
    // reveals
    $$(".vo55-ch-head, .vo55-ch-note, .vo55-hero-note, .vo55-stats li, .vo55-fig--c1, .vo55-fig--c3, .vo55-fig--c4, .vo55-tags").forEach(function (n) {
      n.classList.add("vo55-reveal"); watch(n);
    });
    playHero();
    watch($("#fig-c1"), function () { c1.drawn = true; inkIn(c1.strokes, 0.06); startOrbit(); });
    if (reduced()) { c1.drawn = true; startOrbit(); }
    watch($("#fig-c4"), function () { playScale(); });
    $("#vo55-hero-replay").addEventListener("click", playHero);
    $("#vo55-c4-replay").addEventListener("click", playScale);

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { ticking = false; syncC2FromScroll(); });
    }, { passive: true });
    var lastLayout = c2Layout(), rT = 0;
    window.addEventListener("resize", function () {
      clearTimeout(rT);
      rT = setTimeout(function () {
        if (c2Layout() !== lastLayout) { lastLayout = c2Layout(); buildC2(); }
        layoutBoundary(); syncC2FromScroll();
      }, 120);
    });
    if ("ResizeObserver" in window) new ResizeObserver(function () { layoutBoundary(); }).observe($("#vo55-scale"));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutBoundary);
    RM.addEventListener && RM.addEventListener("change", function () { location.reload(); });

    document.addEventListener("oz:langchange", function () { renderAll(false); });
  });
})();
