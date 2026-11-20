/* Sam AI · Habit Coach — project page (/models/claude-opus-5-5/projects/sam-ai/)
   Field-notebook explainer. Vanilla JS + inline SVG. Built by Claude Opus 5.5. */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var P = "project.sam-ai.";
  var MODEL = "Claude Opus 5.5";
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  function calm() { return mq.matches; }

  /* ───────────── tiny helpers ───────────── */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function tp(k) { return OZ.t(P + k); }
  function list(k) { return tp(k).split("|").map(function (s) { return s.trim(); }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function h(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function s(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function figLabel(n) { return OZ.t("ui.fig") + " " + n; }

  // cancellable sleeps for sequences
  function Token() { this.alive = true; }
  function sleep(ms, tok) {
    return new Promise(function (res) { setTimeout(function () { res(tok ? tok.alive : true); }, ms); });
  }

  /* ───────────── hand-drawn geometry ───────────── */
  function rng(seed) {
    var x = (seed * 9301 + 49297) % 233280 || 7;
    return function () { x = (x * 16807) % 2147483647; return (x % 100000) / 100000; };
  }
  function f(n) { return Math.round(n * 10) / 10; }
  function cr(pts, closed) { // Catmull-Rom → cubic Bézier
    var n = pts.length, d = "M" + f(pts[0][0]) + " " + f(pts[0][1]);
    function g(i) { return closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]; }
    var last = closed ? n : n - 1;
    for (var i = 0; i < last; i++) {
      var p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      d += " C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) + " " +
        f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + f(p2[0]) + " " + f(p2[1]);
    }
    return closed ? d + "Z" : d;
  }
  function wline(x1, y1, x2, y2, R, j) {
    j = j == null ? 1.2 : j;
    var len = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.round(len / 30)), pts = [];
    var nx = -(y2 - y1) / (len || 1), ny = (x2 - x1) / (len || 1);
    for (var i = 0; i <= n; i++) {
      var u = i / n, o = (R() - 0.5) * j * (i === 0 || i === n ? 0.5 : 1.6);
      pts.push([x1 + (x2 - x1) * u + nx * o, y1 + (y2 - y1) * u + ny * o]);
    }
    return cr(pts, false);
  }
  function wrect(x, y, w, hh, r, R, j) {
    j = j == null ? 1.2 : j;
    r = Math.min(r, w / 2, hh / 2);
    var pts = [], step = 26;
    function edge(ax, ay, bx, by) {
      var len = Math.hypot(bx - ax, by - ay), n = Math.max(1, Math.round(len / step));
      for (var i = 0; i < n; i++) { var u = i / n; pts.push([ax + (bx - ax) * u, ay + (by - ay) * u]); }
    }
    function arc(cx, cy, a0) {
      if (r < 2) return;
      for (var i = 0; i < 3; i++) { var a = a0 + i * (Math.PI / 2) / 3; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    }
    edge(x + r, y, x + w - r, y); arc(x + w - r, y + r, -Math.PI / 2);
    edge(x + w, y + r, x + w, y + hh - r); arc(x + w - r, y + hh - r, 0);
    edge(x + w - r, y + hh, x + r, y + hh); arc(x + r, y + hh - r, Math.PI / 2);
    edge(x, y + hh - r, x, y + r); arc(x + r, y + r, Math.PI);
    pts = pts.map(function (p) { return [p[0] + (R() - 0.5) * j, p[1] + (R() - 0.5) * j]; });
    return cr(pts, true);
  }
  function wcircle(cx, cy, rx, ry, R, j, over) {
    j = j == null ? 1.5 : j; over = over == null ? 0.35 : over;
    var a0 = -2.2 + R() * 0.4, n = 16, pts = [];
    for (var i = 0; i <= n; i++) {
      var a = a0 + (Math.PI * 2 + over) * (i / n), k = 1 + (R() - 0.5) * j / Math.max(rx, 8);
      var drift = i / n * 2.2;
      pts.push([cx + Math.cos(a) * (rx * k + drift), cy + Math.sin(a) * (ry * k + drift * 0.6)]);
    }
    return cr(pts, false);
  }
  function scribble(x, y, c, R) { // zig-zag hatch filling a cell
    var p = [], m = 2.5, k = 5;
    for (var i = 1; i <= k; i++) {
      var o = (c - 2 * m) * (i / k) * 2;
      var a = [x + m, y + m + Math.min(o, c - 2 * m)], b = [x + m + Math.min(o, c - 2 * m), y + m];
      if (o > c - 2 * m) { a = [x + m + (o - (c - 2 * m)), y + c - m]; b = [x + c - m, y + m + (o - (c - 2 * m))]; }
      if (i % 2) p.push(a, b); else p.push(b, a);
    }
    p = p.map(function (q) { return [q[0] + (R() - 0.5) * 1.2, q[1] + (R() - 0.5) * 1.2]; });
    return "M" + p.map(function (q) { return f(q[0]) + " " + f(q[1]); }).join(" L");
  }

  /* ───────────── ink frames (sized to the element) ───────────── */
  var frames = [];
  var ro = new ResizeObserver(function (es) {
    es.forEach(function (e) {
      frames.forEach(function (it) { if (it.el === e.target) drawFrame(it); });
    });
  });
  function inkFrame(el, kind, seed) {
    var svg = s("svg", { "class": "vo55-frame vo55-frame--" + kind, "aria-hidden": "true" });
    el.insertBefore(svg, el.firstChild);
    var it = { el: el, svg: svg, kind: kind, seed: seed };
    frames.push(it); drawFrame(it); ro.observe(el);
  }
  function drawFrame(it) {
    var w = it.el.offsetWidth, hh = it.el.offsetHeight;
    if (!w || !hh || (w === it.w && hh === it.h)) return;
    it.w = w; it.h = hh;
    var svg = it.svg; svg.setAttribute("viewBox", "0 0 " + w + " " + hh);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var R = rng(it.seed), r = it.kind === "phone" ? 22 : it.kind === "card" ? 8 : 6;
    s("path", { d: wrect(1.5, 1.5, w - 3, hh - 3, r, R, 1.6), pathLength: 1, "class": "a" }, svg);
    if (it.kind === "phone") {
      s("path", { d: wrect(7, 7, w - 14, hh - 14, r - 5, R, 1.1), pathLength: 1, "class": "b" }, svg);
      s("path", { d: wline(w / 2 - 16, 14, w / 2 + 16, 14, R, 0.6), pathLength: 1, "class": "a notch" }, svg);
    } else {
      s("path", { d: wrect(4.5, 5, w - 7, hh - 8, r, R, 2.2), pathLength: 1, "class": "b" }, svg);
    }
  }

  /* ───────────── reveal on scroll ───────────── */
  var revealIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  function whenSeen(el, cb, threshold) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); cb(); } });
    }, { threshold: threshold || 0.35 });
    io.observe(el);
  }

  /* ───────────── titles with hand underline ───────────── */
  function ulPaths(style, R) {
    var i, pts = [];
    switch (style) {
      case "wave":
        for (i = 0; i <= 200; i += 10) pts.push([i, 8 + Math.sin(i / 10 * 1.4) * 4.2 + (R() - 0.5)]);
        return [cr(pts, false)];
      case "double":
        return [wline(2, 6, 198, 5, R, 2), wline(14, 12, 192, 12.5, R, 2)];
      case "scribble":
        return [cr([[2, 7], [70, 5], [140, 6.5], [198, 5], [150, 11], [80, 12], [18, 13]], false)];
      default:
        return [wline(2, 9, 198, 7, R, 2.4)];
    }
  }
  function phraseCut(core) {
    var i = core.indexOf(" · "), cut;
    if (i >= 0) cut = i + 3;
    else {
      i = core.lastIndexOf(":"); if (i < 0) i = core.lastIndexOf(",");
      if (i >= 0) cut = i + 1;
      else { var w = core.split(" "); cut = core.length - w.slice(-2).join(" ").length; }
    }
    while (core.charAt(cut) === " ") cut++;
    // keep the underlined phrase short enough to never wrap
    while (core.length - cut > 16 && core.indexOf(" ", cut) > 0) cut = core.indexOf(" ", cut) + 1;
    return cut;
  }
  function renderTitle(el, n) {
    var str = OZ.t(el.getAttribute("data-title"));
    var end = /[.!?]$/.test(str) ? str.slice(-1) : "";
    var core = end ? str.slice(0, -1) : str;
    var cut = phraseCut(core), style = el.getAttribute("data-ul");
    el.textContent = "";
    // keep "Sam AI ·" together: the separator never starts a line
    el.appendChild(document.createTextNode(core.slice(0, cut).replace(/ ·\s*$/, "\u00A0· ")));
    var span = h("span", "vo55-ul", el, core.slice(cut));
    var svg = s("svg", { "class": "vo55-ul-svg vo55-ul--" + style, viewBox: "0 0 200 16", preserveAspectRatio: "none", "aria-hidden": "true" }, span);
    ulPaths(style, rng(31 + n)).forEach(function (d, k) {
      s("path", { d: d, pathLength: 1, style: "transition-delay:" + (0.35 + k * 0.35) + "s" }, svg);
    });
    if (end) h("span", "vo55-dot", el, end);
  }

  /* ───────────── month grid (shared by hero, c2, c3) ───────────── */
  var FILLED = [1, 2, 3, 5, 6, 8, 9, 10, 12, 15, 16], TODAY = 17, OFFSET = 2, DAYS = 30;
  function monthGrid(svg, o) {
    var R = rng(o.seed || 5), g = s("g", { "class": "vo55-mg" }, svg), today = null;
    var span = o.cell + o.gap;
    for (var d = 1; d <= DAYS; d++) {
      var idx = d - 1 + OFFSET, x = o.x + (idx % 7) * span, y = o.y + Math.floor(idx / 7) * span;
      var on = FILLED.indexOf(d) >= 0, isToday = d === TODAY;
      var cg = s("g", { "class": "vo55-mg-cell" + (d > TODAY ? " is-future" : "") + (on ? " is-on" : "") + (isToday ? " is-today" : "") }, g);
      s("path", { d: wrect(x, y, o.cell, o.cell, 2.5, R, 0.9), "class": "vo55-mg-box" }, cg);
      if (on || isToday) {
        s("rect", { x: x + 1.5, y: y + 1.5, width: o.cell - 3, height: o.cell - 3, rx: 2, "class": "vo55-mg-wash" }, cg);
        s("path", { d: scribble(x, y, o.cell, R), pathLength: 1, "class": "vo55-mg-ink" }, cg);
      }
      if (isToday) today = cg;
    }
    var w = o.x * 2 + 7 * span - o.gap, hh = o.y * 2 + 5 * span - o.gap;
    if (o.size !== false) svg.setAttribute("viewBox", "0 0 " + w + " " + hh);
    return { set: function (v) { today.classList.toggle("is-on", v); } };
  }

  /* ═══════════════ fig. 1 — hero phone loop ═══════════════ */
  var Hero = { tok: null, visible: false };
  function heroBuild() {
    var root = $("#vo55-hero-fig");
    Hero.root = root;
    Hero.typed = $(".vo55-typed", root);
    Hero.count = $(".vo55-count", root);
    Hero.grid = monthGrid($(".vo55-hp-grid", root), { x: 3, y: 3, cell: 17, gap: 4, seed: 3 });
    var io = new IntersectionObserver(function (es) {
      Hero.visible = es[0].isIntersecting;
      if (Hero.visible) heroStart(); else heroStop();
    }, { threshold: 0.2 });
    io.observe(root);
  }
  function heroFinal() {
    heroStop();
    Hero.typed.textContent = tp("c3.fig_msg");
    Hero.root.classList.add("is-sent");
    Hero.grid.set(true); Hero.count.textContent = "3";
    Hero.root.dataset.k = "3";
  }
  function heroStop() { if (Hero.tok) Hero.tok.alive = false; Hero.tok = null; }
  function heroStart() {
    if (calm()) { heroFinal(); return; }
    if (Hero.tok) return;
    var tok = Hero.tok = new Token();
    (async function loop() {
      while (tok.alive) {
        var msg = tp("c3.fig_msg");
        Hero.typed.textContent = ""; Hero.root.classList.remove("is-sent", "is-bump");
        Hero.grid.set(false); Hero.count.textContent = "2"; Hero.root.dataset.k = "0";
        if (!(await sleep(900, tok))) return;
        Hero.root.dataset.k = "1";
        for (var i = 1; i <= msg.length; i++) {
          Hero.typed.textContent = msg.slice(0, i);
          if (!(await sleep(42 + Math.random() * 50, tok))) return;
        }
        if (!(await sleep(380, tok))) return;
        Hero.root.classList.add("is-sent");
        if (!(await sleep(650, tok))) return;
        Hero.root.dataset.k = "2"; Hero.grid.set(true);
        if (!(await sleep(800, tok))) return;
        Hero.root.dataset.k = "3"; Hero.count.textContent = "3"; Hero.root.classList.add("is-bump");
        if (!(await sleep(3600, tok))) return;
      }
    })();
  }
  function heroLang() { heroStop(); if (Hero.visible) heroStart(); if (calm()) heroFinal(); }

  /* ═══════════════ fig. 2 — the life of a checklist ═══════════════ */
  var C1 = { d: 1, tok: null };
  var TICKS = [[1, 1, 1], [1, 1, 1], [1, 0, 1], [1, 1, 0], [1, 0, 0], [0, 1, 0], [1, 0, 0]];
  var FADE = [1, 0.86, 0.72, 0.58, 0.45, 0.33, 0.22];
  function c1Build() {
    var root = $("#vo55-c1"), svg = $(".vo55-life-svg", root), R = rng(11);
    C1.root = root; C1.svg = svg; C1.rows = [];
    var emoji = ["💧", "📖", "🏃"];
    [28, 230].forEach(function (hx, half) {
      emoji.forEach(function (e, k) { s("text", { x: hx + 61 + k * 36, y: 42, "class": "vo55-emoji", "text-anchor": "middle" }, svg).textContent = e; });
      s("path", { d: wline(hx - 4, 54, hx + 168, 55, R, 1.4), "class": "vo55-c1-rule" }, svg);
      for (var i = 0; i < 7; i++) {
        var day = half * 7 + i + 1, y = 78 + i * 30;
        var g = s("g", { "class": "vo55-c1-row" }, svg);
        s("text", { x: hx + 4, y: y + 5, "class": "vo55-c1-day" }, g).textContent = pad(day);
        s("path", { d: "M" + (hx - 10) + " " + y + " l6 0 m-3 -3 l3 3 l-3 3", "class": "vo55-c1-now" }, g);
        var ticks = [];
        for (var k = 0; k < 3; k++) {
          var bx = hx + 52 + k * 36, by = y - 9;
          s("path", { d: wrect(bx, by, 18, 18, 3, R, 1.2), "class": "vo55-c1-box" }, g);
          if (day <= 7 && TICKS[day - 1][k]) {
            var t = s("path", {
              d: cr([[bx + 3, by + 9 + R()], [bx + 8, by + 15], [bx + 19 + R() * 2, by - 2]], false),
              pathLength: 1, "class": "vo55-c1-tick", style: "opacity:" + FADE[day - 1]
            }, g);
            ticks.push(t);
          }
        }
        if (day === 8) s("path", { d: wcircle(hx + 13, y + 1, 18, 13, R, 2), pathLength: 1, "class": "vo55-c1-ring" }, g);
        C1.rows.push({ g: g, day: day });
      }
    });
    s("path", { d: wline(214, 30, 216, 276, R, 1.4), "class": "vo55-c1-rule" }, svg);
    var X = s("g", { "class": "vo55-c1-x" }, svg);
    s("path", { d: wline(24, 24, 396, 278, R, 5), pathLength: 1 }, X);
    s("path", { d: wline(398, 30, 22, 272, R, 5), pathLength: 1, style: "transition-delay:.25s" }, X);
    var st = s("g", { "class": "vo55-c1-stamp", transform: "translate(210 154) rotate(-11)" }, svg);
    C1.stampG = s("g", { "class": "vo55-c1-stamp-in" }, st);
    C1.stampBox = s("path", { "class": "vo55-c1-stamp-box" }, C1.stampG);
    C1.stampBox2 = s("path", { "class": "vo55-c1-stamp-box b" }, C1.stampG);
    C1.stampText = s("text", { x: 0, y: 8, "text-anchor": "middle" }, C1.stampG);

    C1.range = $(".vo55-range", root);
    C1.out = $(".vo55-readout", root);
    C1.play = $(".vo55-c1-play", root);
    C1.range.addEventListener("input", function () { c1Stop(); c1Set(+C1.range.value); });
    C1.play.addEventListener("click", function () { c1Play(); });
    c1Set(1);
    whenSeen(root, function () { if (calm()) c1Set(14); else c1Play(); }, 0.4);
  }
  function c1Lang() {
    var txt = tp("c1.fig_deleted");
    C1.stampText.textContent = txt.toLocaleUpperCase(OZ.lang === "tr" ? "tr" : "en");
    var w = 0;
    try { w = C1.stampText.getComputedTextLength(); } catch (e) {}
    if (!w) w = txt.length * 15;
    var R = rng(77), bw = w + 34, bh = 42;
    C1.stampBox.setAttribute("d", wrect(-bw / 2, -bh / 2, bw, bh, 3, R, 1.8));
    C1.stampBox2.setAttribute("d", wrect(-bw / 2 + 4, -bh / 2 + 4, bw - 8, bh - 8, 2, R, 1.4));
    C1.range.setAttribute("aria-label", tp("c1.fig"));
    C1.play.setAttribute("aria-label", "▶ " + tp("c1.fig"));
  }
  function c1Set(d) {
    C1.d = d;
    C1.range.value = d;
    C1.out.textContent = pad(d) + " / 14";
    C1.rows.forEach(function (r) {
      r.g.classList.toggle("is-lived", r.day <= d);
      r.g.classList.toggle("is-now", r.day === d);
    });
    C1.root.classList.toggle("is-dead", d >= 8);
  }
  function c1Stop() { if (C1.tok) C1.tok.alive = false; C1.tok = null; C1.root.classList.remove("is-playing"); }
  function c1Play() {
    c1Stop();
    if (calm()) { c1Set(14); return; }
    var tok = C1.tok = new Token();
    C1.root.classList.add("is-playing");
    (async function () {
      c1Set(1);
      for (var d = 1; d <= 14; d++) {
        c1Set(d);
        if (!(await sleep(d === 7 ? 900 : d === 8 ? 1300 : 340, tok))) return;
      }
      c1Stop();
    })();
  }

  /* ═══════════════ fig. 3 — the habit loop ═══════════════ */
  var C2 = { i: 0, auto: null, touched: false };
  function c2Build() {
    var root = $("#vo55-c2"), svg = $(".vo55-loop-svg", root), R = rng(21);
    C2.root = root; C2.arcs = []; C2.sk = [];
    s("path", { d: wcircle(160, 160, 132, 132, R, 3, 0.2), "class": "vo55-loop-faint" }, svg);
    for (var i = 0; i < 4; i++) {
      var a0 = (-90 + i * 90 + 9) * Math.PI / 180, a1 = (-90 + i * 90 + 81) * Math.PI / 180;
      var pts = [], r0 = 118;
      for (var k = 0; k <= 10; k++) {
        var a = a0 + (a1 - a0) * k / 10, rr = r0 + (R() - 0.5) * 2.4;
        pts.push([160 + Math.cos(a) * rr, 160 + Math.sin(a) * rr]);
      }
      var g = s("g", { "class": "vo55-arc", "data-i": i }, svg);
      s("path", { d: cr(pts, false), "class": "vo55-arc-hit" }, g);
      s("path", { d: cr(pts, false), "class": "vo55-arc-line", pathLength: 1 }, g);
      // arrowhead (clockwise tangent)
      var ex = 160 + Math.cos(a1) * r0, ey = 160 + Math.sin(a1) * r0;
      var tx = -Math.sin(a1), ty = Math.cos(a1), nx = Math.cos(a1), ny = Math.sin(a1);
      s("path", { d: "M" + f(ex - tx * 10 + nx * 6) + " " + f(ey - ty * 10 + ny * 6) + " L" + f(ex) + " " + f(ey) + " L" + f(ex - tx * 10 - nx * 6) + " " + f(ey - ty * 10 - ny * 6), "class": "vo55-arc-head" }, g);
      var am = (a0 + a1) / 2, bx = 160 + Math.cos(am) * r0, by = 160 + Math.sin(am) * r0;
      s("path", { d: wcircle(bx, by, 15, 15, R, 1.5, 0.15), "class": "vo55-arc-badge" }, g);
      s("text", { x: bx, y: by + 4, "text-anchor": "middle", "class": "vo55-arc-num" }, g).textContent = pad(i + 1);
      g.addEventListener("click", (function (n) { return function () { c2Touch(); c2Set(n, true); }; })(i));
      C2.arcs.push(g);
      var sk = s("g", { "class": "vo55-sk" }, svg);
      lawSketch(i, sk, rng(40 + i));
      C2.sk.push(sk);
    }
    C2.tabs = $(".vo55-lawtabs", root);
    C2.name = $(".vo55-lawname", root);
    C2.desc = $(".vo55-lawdesc", root);
    C2.next = $(".vo55-next", root);
    C2.next.addEventListener("click", function () { c2Touch(); c2Set((C2.i + 1) % 4, true); });
    C2.tabs.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (!d) return;
      e.preventDefault(); c2Touch(); c2Set((C2.i + d + 4) % 4, true, true);
    });
    whenSeen(root, function () {
      if (calm()) return;
      C2.auto = setInterval(function () { if (!C2.touched) c2Set((C2.i + 1) % 4, true); }, 4200);
    }, 0.5);
  }
  function c2Touch() { C2.touched = true; if (C2.auto) clearInterval(C2.auto); C2.auto = null; }
  function lawSketch(i, g, R) {
    function p(d, cls, extra) { var a = { d: d, pathLength: 1, "class": cls || "" }; for (var k in extra) a[k] = extra[k]; return s("path", a, g); }
    if (i === 0) { // obvious: a reminder notification written from your streak
      p(wrect(98, 126, 124, 62, 9, R, 1.4), "sk-line");
      p(wcircle(119, 148, 9, 9, R, 1, 0.2), "sk-ink");
      p("M115 159 l8 0", "sk-ink");
      p(wline(136, 145, 208, 144, R, 1.2), "sk-line");
      p(wline(136, 157, 190, 158, R, 1.2), "sk-line sk-muted");
      p(wline(136, 169, 172, 169, R, 1.2), "sk-line sk-muted");
      s("text", { x: 196, y: 177, "class": "sk-emoji" }, g).textContent = "🔥";
      p(wline(130, 104, 150, 118, R, 0.8), "sk-ink");
      p(wline(160, 98, 160, 116, R, 0.8), "sk-ink");
      p(wline(190, 104, 170, 118, R, 0.8), "sk-ink");
    } else if (i === 1) { // attractive: the monthly grid, a pleasure to fill
      var gs = s("g", {}, g);
      monthGrid(gs, { x: 104, y: 112, cell: 13, gap: 3.2, seed: 9, size: false });
      p(wline(102, 104, 150, 103, R, 1), "sk-line");
    } else if (i === 2) { // easy: one sentence
      p(wrect(100, 120, 112, 40, 14, R, 1.4), "sk-ink");
      p("M196 160 l10 10 l-2 -12", "sk-ink");
      p(wline(114, 140, 196, 139, R, 1.4), "sk-line");
      p(wcircle(130, 192, 12, 12, R, 1, 0.2), "sk-line");
      p("M124 192 l5 5 l9 -11", "sk-ink sk-thick");
      p(wline(150, 192, 200, 191, R, 1), "sk-line sk-muted");
    } else { // satisfying: streak celebrated, setback = fresh start
      s("text", { x: 160, y: 168, "text-anchor": "middle", "class": "sk-emoji sk-big" }, g).textContent = "🔥";
      [[-1, -0.2], [-0.8, -0.8], [0, -1], [0.8, -0.8], [1, -0.2]].forEach(function (v) {
        p(wline(160 + v[0] * 44, 150 + v[1] * 40, 160 + v[0] * 58, 150 + v[1] * 54, R, 0.6), "sk-ink");
      });
      p("M136 196 C 140 208, 180 210, 186 194", "sk-line");
      p("M180 190 l6 4 l2 -7", "sk-line");
      s("text", { x: 160, y: 222, "text-anchor": "middle", "class": "sk-num" }, g).textContent = "↻";
    }
  }
  function c2Lang() {
    var laws = list("c2.fig_laws");
    C2.tabs.innerHTML = "";
    C2.tabBtns = laws.map(function (law, i) {
      var b = h("button", "vo55-lawtab", C2.tabs);
      b.type = "button";
      b.id = "vo55-law-" + i;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", "vo55-lawpanel");
      h("span", "vo55-lawtab-n", b, pad(i + 1));
      h("span", "vo55-lawtab-t", b, law);
      b.addEventListener("click", function () { c2Touch(); c2Set(i, true); });
      return b;
    });
    C2.next.setAttribute("aria-label", "→ " + tp("c2.fig"));
    c2Set(C2.i, false);
  }
  function c2Set(i, anim, focus) {
    C2.i = i;
    var laws = list("c2.fig_laws"), descs = list("c2.fig_law_descs");
    C2.tabBtns.forEach(function (b, k) {
      b.setAttribute("aria-selected", String(k === i));
      b.tabIndex = k === i ? 0 : -1;
    });
    if (focus) C2.tabBtns[i].focus();
    $("#vo55-lawpanel").setAttribute("aria-labelledby", "vo55-law-" + i);
    C2.name.textContent = pad(i + 1) + " · " + laws[i];
    C2.desc.textContent = descs[i];
    C2.arcs.forEach(function (g, k) { g.classList.toggle("is-on", k === i); });
    C2.sk.forEach(function (g, k) {
      if (k === i) {
        g.classList.remove("is-on");
        if (anim && !calm()) void g.getBoundingClientRect();
        g.classList.add("is-on");
      } else g.classList.remove("is-on");
    });
    C2.root.classList.remove("is-flip"); void C2.root.offsetWidth; C2.root.classList.add("is-flip");
  }

  /* ═══════════════ fig. 4 — one sentence → updated grid ═══════════════ */
  var C3 = { step: 0, tok: null };
  function c3Build() {
    var root = $("#vo55-c3");
    C3.root = root;
    C3.typed = $(".vo55-typed", root);
    C3.count = $(".vo55-count", root);
    C3.cups = $(".vo55-cups", root);
    C3.grid = monthGrid($(".vo55-gc-grid", root), { x: 3, y: 3, cell: 26, gap: 6, seed: 13 });
    for (var i = 0; i < 5; i++) h("span", "vo55-cup", C3.cups).style.transitionDelay = (i * 0.08) + "s";
    C3.play = $(".vo55-c3-play", root);
    C3.play.addEventListener("click", function () { c3Play(); });
    var ol = $(".vo55-stepper", root);
    C3.steps = [1, 2, 3, 4].map(function (n) {
      var li = h("li", "", ol), b = h("button", "vo55-step", li, pad(n));
      b.type = "button";
      b.addEventListener("click", function () { c3Stop(); c3Set(n); });
      return b;
    });
    if (calm()) c3Set(4); else c3Set(0);
    whenSeen(root, function () { if (calm()) c3Set(4); else c3Play(); }, 0.45);
  }
  function c3Lang() {
    var acts = list("c3.fig_actions"), ul = $(".vo55-chips", C3.root);
    ul.innerHTML = "";
    acts.forEach(function (a, i) { var li = h("li", "vo55-chip" + (i === 1 ? " is-log" : ""), ul, a); li.setAttribute("data-i", i); });
    h("li", "vo55-chip vo55-chip--more", ul, "+10");
    C3.play.setAttribute("aria-label", "▶ " + tp("c3.fig"));
    C3.steps.forEach(function (b, k) { b.setAttribute("aria-label", tp("c3.fig") + " " + (k + 1) + "/4"); });
    var st = C3.step; c3Set(st);
  }
  function c3Set(n) {
    C3.step = n;
    C3.root.dataset.step = n;
    C3.typed.textContent = n >= 1 ? tp("c3.fig_msg") : "";
    C3.grid.set(n >= 3);
    C3.count.textContent = n >= 3 ? "3" : "2";
    C3.steps.forEach(function (b, k) {
      if (k + 1 === n) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      b.classList.toggle("is-done", k + 1 <= n);
    });
    C3.play.firstElementChild.textContent = n >= 4 ? "↻" : "▶";
  }
  function c3Stop() { if (C3.tok) C3.tok.alive = false; C3.tok = null; C3.root.classList.remove("is-typing"); }
  function c3Play() {
    c3Stop();
    if (calm()) { c3Set(4); return; }
    var tok = C3.tok = new Token();
    (async function () {
      c3Set(0);
      if (!(await sleep(450, tok))) return;
      var msg = tp("c3.fig_msg");
      C3.root.dataset.step = 1; C3.root.classList.add("is-typing");
      C3.steps[0].setAttribute("aria-current", "step"); C3.steps[0].classList.add("is-done");
      for (var i = 1; i <= msg.length; i++) {
        C3.typed.textContent = msg.slice(0, i);
        if (!(await sleep(38 + Math.random() * 45, tok))) return;
      }
      C3.root.classList.remove("is-typing");
      c3Set(1);
      if (!(await sleep(600, tok))) return;
      c3Set(2);
      if (!(await sleep(1300, tok))) return;
      c3Set(3);
      if (!(await sleep(1000, tok))) return;
      c3Set(4);
      C3.tok = null;
    })();
  }

  /* ═══════════════ fig. 5 — cost & safety layers ═══════════════ */
  var C4 = { on: [true, true, true, true, true] };
  var GLYPH = ["↻", "⇲", "4", "≤", "✂"];
  function c4Build() {
    var root = $("#vo55-c4");
    C4.root = root;
    C4.after = $(".vo55-bar--after", root);
    C4.ol = $(".vo55-shields", root);
    if (!calm()) { C4.on = [false, false, false, false, false]; }
    whenSeen(root, function () {
      if (calm()) return;
      var k = 0;
      (function next() {
        if (k >= 5 || C4.touched) return;
        C4.on[k++] = true; c4Render();
        setTimeout(next, 520);
      })();
    }, 0.45);
  }
  function c4Lang() {
    var layers = list("c4.fig_layers");
    C4.ol.innerHTML = "";
    C4.btns = layers.map(function (name, i) {
      var li = h("li", "", C4.ol), b = h("button", "vo55-shield", li);
      b.type = "button";
      b.style.setProperty("--tilt", ([-1.2, 0.8, -0.5, 1.1, -0.8])[i] + "deg");
      var svg = s("svg", { viewBox: "0 0 40 46", "class": "vo55-shield-ic", "aria-hidden": "true" }, b);
      s("path", { d: "M20 3 C 27 7.5, 32 8.5, 37 8 C 37.5 26, 31 37, 20 43 C 9 37, 2.5 26, 3 8 C 8 8.5, 13 7.5, 20 3 Z", "class": "a" }, svg);
      s("path", { d: "M20 7 C 26 10, 30 11, 33.5 11 C 33.5 26, 28 34, 20 39 C 12 34, 6.5 26, 6.5 11 C 10 11, 14 10, 20 7 Z", "class": "b" }, svg);
      s("text", { x: 20, y: 28.5, "text-anchor": "middle" }, svg).textContent = GLYPH[i];
      h("span", "vo55-shield-n", b, pad(i + 1));
      h("span", "vo55-shield-t", b, name);
      b.addEventListener("click", function () { C4.touched = true; C4.on[i] = !C4.on[i]; c4Render(); });
      return b;
    });
    c4Render();
  }
  function c4Render() {
    var k = 0;
    C4.btns.forEach(function (b, i) { b.setAttribute("aria-pressed", String(C4.on[i])); if (i < 3 && C4.on[i]) k++; });
    C4.after.style.width = (100 - 20 * k) + "%";
    C4.root.classList.toggle("is-cut", k > 0);
    C4.root.classList.toggle("is-full", k === 3);
    C4.root.classList.toggle("is-rails", C4.on[3]);
    C4.root.classList.toggle("is-cutoff", C4.on[4]);
  }

  /* ═══════════════ fig. 6 — three tabs ═══════════════ */
  var C5 = { i: 0 };
  function miniScreen(i, svg, R) {
    function p(d, cls) { return s("path", { d: d, pathLength: 1, "class": cls || "sk-line" }, svg); }
    var x0 = 14, w = 92;
    if (i === 0) { // habits list
      ["💧", "📖", "🏃", "🧘"].forEach(function (e, k) {
        var y = 44 + k * 32;
        s("text", { x: x0 + 2, y: y + 5, "class": "sk-emoji sk-small" }, svg).textContent = e;
        p(wline(x0 + 20, y, x0 + 56 + R() * 10, y, R, 0.8), "sk-line");
        for (var d = 0; d < 5; d++) {
          var on = (k + d) % 3 !== 2;
          s("rect", { x: x0 + 20 + d * 9, y: y + 7, width: 6, height: 6, rx: 1, "class": on ? "sk-cell on" : "sk-cell" }, svg);
        }
        p(wcircle(x0 + w - 8, y + 4, 7, 7, R, 0.8, 0.15), "sk-line");
        if (k < 3) p("M" + (x0 + w - 12) + " " + (y + 4) + " l3 3 l6 -7", "sk-ink sk-thick");
      });
    } else if (i === 1) { // trackers
      p(wcircle(60, 66, 26, 26, R, 1, 0.1), "sk-line sk-muted");
      var pts = [];
      for (var k = 0; k <= 12; k++) { var a = -Math.PI / 2 + (Math.PI * 1.35) * k / 12; pts.push([60 + Math.cos(a) * 26, 66 + Math.sin(a) * 26]); }
      p(cr(pts, false), "sk-ink sk-thick");
      s("text", { x: 60, y: 72, "text-anchor": "middle", "class": "sk-emoji sk-small" }, svg).textContent = "💧";
      [18, 30, 22, 36, 28, 40, 34].forEach(function (hh, k) {
        p(wrect(x0 + 4 + k * 13, 160 - hh, 8, hh, 1.5, R, 0.6), k === 6 ? "sk-ink" : "sk-line");
      });
      p(wline(x0, 162, x0 + w, 162, R, 0.6), "sk-line sk-muted");
    } else { // chat
      p(wrect(46, 30, 60, 22, 9, R, 0.9), "sk-ink");
      p(wline(54, 41, 96, 41, R, 0.6), "sk-ink");
      p(wrect(14, 62, 70, 30, 9, R, 0.9), "sk-line");
      p(wline(22, 73, 70, 73, R, 0.6), "sk-line sk-muted");
      s("text", { x: 22, y: 87, "class": "sk-emoji sk-small" }, svg).textContent = "🔥";
      p(wrect(40, 104, 66, 22, 9, R, 0.9), "sk-ink");
      p(wline(48, 115, 92, 115, R, 0.6), "sk-ink");
      p(wrect(14, 136, 40, 20, 9, R, 0.9), "sk-line");
      [24, 34, 44].forEach(function (cx) { s("circle", { cx: cx, cy: 146, r: 2, "class": "sk-dot" }, svg); });
    }
    // tab bar
    p(wline(10, 184, 110, 184, R, 0.6), "sk-line sk-muted");
    [30, 60, 90].forEach(function (cx, k) {
      var cls = k === i ? "sk-ink" : "sk-line sk-muted";
      if (k === 0) { p("M" + (cx - 7) + " 196 h14 M" + (cx - 7) + " 201 h14 M" + (cx - 7) + " 206 h10", cls); }
      if (k === 1) { p(wcircle(cx, 201, 6, 6, R, 0.5, 0.1), cls); }
      if (k === 2) { p(wrect(cx - 8, 194, 16, 11, 4, R, 0.5), cls); p("M" + (cx - 4) + " 205 l-2 4 l5 -4", cls); }
      if (k === i) s("circle", { cx: cx, cy: 213, r: 1.8, "class": "sk-dot on" }, svg);
    });
  }
  function c5Build() {
    C5.root = $("#vo55-c5");
    C5.wrap = $(".vo55-minis", C5.root);
    C5.wrap.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault(); c5Set((C5.i + d + 3) % 3, true);
    });
  }
  function c5Lang() {
    var tabs = list("c5.fig_tabs");
    C5.wrap.innerHTML = "";
    C5.btns = tabs.map(function (name, i) {
      var b = h("button", "vo55-mini", C5.wrap);
      b.type = "button";
      b.setAttribute("role", "tab");
      b.style.setProperty("--tilt", ([-4, 1.5, 4])[i] + "deg");
      var svg = s("svg", { viewBox: "0 0 120 224", "class": "vo55-mini-svg", "aria-hidden": "true" }, b);
      var R = rng(60 + i);
      s("path", { d: wrect(3, 3, 114, 218, 16, R, 1.2), "class": "sk-frame" }, svg);
      s("path", { d: wline(48, 13, 72, 13, R, 0.4), "class": "sk-frame" }, svg);
      var scr = s("g", { "class": "vo55-mini-scr" }, svg);
      miniScreen(i, scr, R);
      h("span", "vo55-mini-t", b, name);
      b.addEventListener("click", function () { c5Set(i, false); });
      return b;
    });
    c5Set(C5.i, false);
  }
  function c5Set(i, focus) {
    C5.i = i;
    C5.btns.forEach(function (b, k) {
      b.setAttribute("aria-selected", String(k === i));
      b.tabIndex = k === i ? 0 : -1;
      var g = $(".vo55-mini-scr", b);
      if (k === i) { g.classList.remove("is-on"); void g.getBoundingClientRect(); g.classList.add("is-on"); }
    });
    if (focus) C5.btns[i].focus();
  }

  /* ───────────── static copy bits ───────────── */
  function splitTop(str) {
    var out = [], depth = 0, cur = "";
    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i);
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function renderCopy() {
    $$("[data-title]").forEach(function (el, n) { renderTitle(el, n); });
    $$("[data-fignum]").forEach(function (el) { el.textContent = figLabel(el.getAttribute("data-fignum")); });
    $$("[data-stat]").forEach(function (el) {
      var v = OZ.t(el.getAttribute("data-stat"));
      el.textContent = "";
      v.split(/(%)/).forEach(function (part) {
        if (!part) return;
        if (part === "%") h("span", "vo55-unit", el, "%"); else el.appendChild(document.createTextNode(part));
      });
    });
    var tags = $(".vo55-tags"); tags.innerHTML = "";
    splitTop(tp("stack")).forEach(function (tg, i) {
      var li = h("li", "vo55-tag", tags, tg);
      li.style.setProperty("--tilt", ((i * 37) % 5 - 2) * 0.4 + "deg");
    });
    $$(".vo55-link-btn").forEach(function (a) { a.href = tp("link"); });
    $(".vo55-credit").textContent = OZ.t("projects.credit").replace("{model}", MODEL);
    document.title = tp("title") + " · ozsert.com";
    var meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.setAttribute("content", tp("oneliner"));
  }

  function langAll() {
    renderCopy();
    c1Lang(); c2Lang(); c3Lang(); c4Lang(); c5Lang();
    heroLang();
  }

  /* ───────────── boot ───────────── */
  OZ.ready.then(function () {
    document.documentElement.classList.add("vo55-js");
    if (calm()) document.documentElement.classList.add("vo55-calm");
    heroBuild(); c1Build(); c2Build(); c3Build(); c4Build(); c5Build();
    langAll();
    $$("[data-frame]").forEach(function (el, i) { inkFrame(el, el.getAttribute("data-frame"), 101 + i * 17); });
    $$("[data-reveal]").forEach(function (el) { revealIO.observe(el); });
    requestAnimationFrame(function () { $(".vo55-hero").classList.add("is-in"); });
    document.addEventListener("oz:langchange", langAll);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { c1Lang(); });
    mq.addEventListener && mq.addEventListener("change", function () {
      document.documentElement.classList.toggle("vo55-calm", calm());
      if (calm()) { heroFinal(); c1Stop(); c1Set(14); c3Stop(); c3Set(4); C4.on = [true, true, true, true, true]; c4Render(); c2Touch(); }
    });
  });
})();
