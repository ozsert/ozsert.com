/* ozsert.com — /projects/ai-gateway/ — figures
   Vanilla JS + inline SVG. Built by Claude Opus 5.5. */
(function () {
  "use strict";

  var MODEL_NAME = "Claude Opus 5.5";
  var NS = "http://www.w3.org/2000/svg";
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)");
  var NARROW = window.matchMedia("(max-width: 719px)");
  function reduced() { return RM.matches; }
  function K(k) { return window.OZ.t("project.ai-gateway." + k); }
  function L(k) { return K(k).split("|").map(function (s) { return s.trim(); }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- seeded wobble (so a re-render draws the same hand) ---------- */
  var S = 1;
  function seed(s) { S = s; }
  function rnd() { S = (S * 16807) % 2147483647; return (S - 1) / 2147483646; }
  function j(a) { return (rnd() - 0.5) * 2 * a; }
  function f(n) { return Math.round(n * 10) / 10; }

  /* a continuous hand-drawn polyline through points */
  function poly(pts, closed, a) {
    a = a == null ? 1.1 : a;
    var p = pts.map(function (q) { return [q[0] + j(a), q[1] + j(a)]; });
    if (closed) p.push([p[0][0] + j(a) + 2, p[0][1] + j(a)]);
    var d = "M" + f(p[0][0]) + " " + f(p[0][1]);
    for (var i = 1; i < p.length; i++) {
      var mx = (p[i - 1][0] + p[i][0]) / 2 + j(a * 1.4), my = (p[i - 1][1] + p[i][1]) / 2 + j(a * 1.4);
      d += " Q" + f(mx) + " " + f(my) + " " + f(p[i][0]) + " " + f(p[i][1]);
    }
    return d;
  }
  function box(x, y, w, h, a) { return poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, a); }
  function line(x1, y1, x2, y2, a) { return poly([[x1, y1], [x2, y2]], false, a); }
  /* hand-drawn loop (circle / oval) that overshoots its start */
  function loop(cx, cy, rx, ry, a, turns) {
    a = a == null ? 1.5 : a; turns = turns || 1.12;
    var n = 56, d = "", start = -2.2 + j(0.2);
    for (var i = 0; i <= n; i++) {
      var t = start + (i / n) * Math.PI * 2 * turns;
      var k = 1 + j(0.035) + i * 0.0025;
      var x = cx + Math.cos(t) * rx * k, y = cy + Math.sin(t) * ry * k;
      d += (i ? " L" : "M") + f(x) + " " + f(y);
    }
    return d;
  }
  /* orthogonal route with rounded corners (precise, for the journey) */
  function route(pts, r) {
    var d = "M" + pts[0][0] + " " + pts[0][1];
    for (var i = 1; i < pts.length - 1; i++) {
      var x0 = pts[i - 1][0], y0 = pts[i - 1][1], x1 = pts[i][0], y1 = pts[i][1], x2 = pts[i + 1][0], y2 = pts[i + 1][1];
      var d1 = Math.hypot(x1 - x0, y1 - y0) || 1, d2 = Math.hypot(x2 - x1, y2 - y1) || 1;
      var rr = Math.min(r, d1 / 2, d2 / 2);
      d += " L" + f(x1 + (x0 - x1) / d1 * rr) + " " + f(y1 + (y0 - y1) / d1 * rr) +
           " Q" + x1 + " " + y1 + " " + f(x1 + (x2 - x1) / d2 * rr) + " " + f(y1 + (y2 - y1) / d2 * rr);
    }
    var l = pts[pts.length - 1];
    return d + " L" + l[0] + " " + l[1];
  }

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function path(parent, d, cls, extra) {
    var a = { d: d, "class": cls };
    if (extra) for (var k in extra) a[k] = extra[k];
    return el("path", a, parent);
  }
  function drawable(p) { p.setAttribute("pathLength", "1"); p.classList.add("vo55-draw"); return p; }
  function text(parent, x, y, str, cls, extra) {
    var t = el("text", Object.assign({ x: x, y: y, "class": cls }, extra || {}), parent);
    t.textContent = str;
    return t;
  }
  /* wrap a label into lines of ≤ max characters */
  function wrap(str, max) {
    var words = str.split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) {
      if (!cur) cur = w;
      else if ((cur + " " + w).length <= max) cur += " " + w;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function textLines(parent, x, y, lines, cls, lh, extra) {
    var t = el("text", Object.assign({ x: x, y: y, "class": cls }, extra || {}), parent);
    lines.forEach(function (ln, i) {
      var s = el("tspan", { x: x, dy: i ? lh : 0 }, t);
      s.textContent = ln;
    });
    return t;
  }
  function html(tag, cls, parent, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    if (parent) parent.appendChild(e);
    return e;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function after(ms, fn) { return setTimeout(fn, reduced() ? 0 : ms); }

  /* ---------- small glyphs reused across figures ---------- */
  function keyGlyph(g, x, y, rot, cls) {
    var k = el("g", { transform: "translate(" + x + " " + y + ") rotate(" + rot + ")" }, g);
    el("circle", { cx: 0, cy: 0, r: 7, "class": cls }, k);
    path(k, "M7 0 L30 0 M23 0 L23 6 M28 0 L28 5", cls);
    return k;
  }
  function doorGlyph(g, x, y, w, h) { /* upright door with arch, for small icons */
    path(g, "M" + x + " " + (y + h) + " L" + x + " " + (y + w / 2) + " Q" + (x + w / 2) + " " + (y - w / 6) + " " + (x + w) + " " + (y + w / 2) + " L" + (x + w) + " " + (y + h), "vo55-svg-ink");
    path(g, "M" + (x - 4) + " " + (y + h) + " L" + (x + w + 4) + " " + (y + h), "vo55-svg-ink");
    el("circle", { cx: x + w * 0.72, cy: y + h * 0.6, r: 1.6, fill: "currentColor", "class": "vo55-svg-ink" }, g);
  }
  function icon(g, kind, x, y) { /* 20×20 icons at x,y (top-left) */
    var c = "vo55-svg-pen";
    if (kind === "laptop") { path(g, box(x + 3, y + 3, 14, 10, .4), c); path(g, "M" + x + " " + (y + 16) + " L" + (x + 20) + " " + (y + 16), c); }
    if (kind === "term") { path(g, box(x, y + 2, 20, 16, .4), c); path(g, "M" + (x + 4) + " " + (y + 7) + " L" + (x + 8) + " " + (y + 10) + " L" + (x + 4) + " " + (y + 13) + " M" + (x + 10) + " " + (y + 14) + " L" + (x + 15) + " " + (y + 14), c); }
    if (kind === "bot") { path(g, box(x + 2, y + 5, 16, 13, .4), c); path(g, "M" + (x + 10) + " " + (y + 5) + " L" + (x + 10) + " " + (y + 1), c); el("circle", { cx: x + 7, cy: y + 11, r: 1.4, "class": "vo55-svg-pen" }, g); el("circle", { cx: x + 13, cy: y + 11, r: 1.4, "class": "vo55-svg-pen" }, g); }
    if (kind === "spark") { path(g, "M" + (x + 10) + " " + y + " L" + (x + 10) + " " + (y + 20) + " M" + x + " " + (y + 10) + " L" + (x + 20) + " " + (y + 10) + " M" + (x + 3) + " " + (y + 3) + " L" + (x + 17) + " " + (y + 17) + " M" + (x + 17) + " " + (y + 3) + " L" + (x + 3) + " " + (y + 17), "vo55-svg-ink"); }
    if (kind === "globe") { el("circle", { cx: x + 10, cy: y + 10, r: 9, "class": c }, g); path(g, "M" + (x + 1) + " " + (y + 10) + " L" + (x + 19) + " " + (y + 10) + " M" + (x + 10) + " " + (y + 1) + " Q" + (x + 3) + " " + (y + 10) + " " + (x + 10) + " " + (y + 19) + " Q" + (x + 17) + " " + (y + 10) + " " + (x + 10) + " " + (y + 1), c); }
    if (kind === "lock") { path(g, box(x + 3, y + 9, 14, 10, .3), c); path(g, "M" + (x + 6) + " " + (y + 9) + " L" + (x + 6) + " " + (y + 6) + " Q" + (x + 10) + " " + (y - 1) + " " + (x + 14) + " " + (y + 6) + " L" + (x + 14) + " " + (y + 9), c); }
    if (kind === "shield") { path(g, "M" + (x + 10) + " " + y + " L" + (x + 19) + " " + (y + 4) + " Q" + (x + 18) + " " + (y + 15) + " " + (x + 10) + " " + (y + 20) + " Q" + (x + 2) + " " + (y + 15) + " " + (x + 1) + " " + (y + 4) + " Z", "vo55-svg-ink"); path(g, "M" + (x + 6) + " " + (y + 10) + " L" + (x + 9) + " " + (y + 13) + " L" + (x + 14) + " " + (y + 7), "vo55-svg-ink"); }
    if (kind === "log") { path(g, box(x + 2, y, 16, 20, .3), c); path(g, "M" + (x + 6) + " " + (y + 6) + " L" + (x + 14) + " " + (y + 6) + " M" + (x + 6) + " " + (y + 10) + " L" + (x + 14) + " " + (y + 10) + " M" + (x + 6) + " " + (y + 14) + " L" + (x + 11) + " " + (y + 14), c); }
    if (kind === "door") { var dg = el("g", null, g); doorGlyph(dg, x + 4, y + 1, 12, 18); }
  }

  /* ======================================================================
     Titles: underline / circle one phrase by hand (varies per chapter)
     ====================================================================== */
  var MARKS = {
    straight: { vb: "0 0 100 14", d: "M2 9 C 24 6, 52 10, 76 7 S 94 6, 98 8" },
    wavy:     { vb: "0 0 100 14", d: "M2 8 Q 7 2, 12 8 T 22 8 T 32 8 T 42 8 T 52 8 T 62 8 T 72 8 T 82 8 T 92 8 T 99 7" },
    dashed:   { vb: "0 0 100 14", d: "M2 8 C 30 5, 60 10, 98 6", dashed: true },
    double:   { vb: "0 0 100 16", d: "M2 5 C 30 3, 64 7, 98 4 L 94 9 C 66 11, 34 8, 6 13" },
    scribble: { vb: "0 0 100 16", d: "M3 6 C 30 12, 64 2, 97 8 C 76 10, 40 13, 8 12 C 30 9, 60 9, 92 13" },
    circle:   { vb: "0 0 100 40", circle: true }
  };
  function pickPhrase(full, lastWordOnly) {
    var body = full.replace(/[.!?]\s*$/, ""), tail = full.slice(body.length);
    var cut;
    if (lastWordOnly) cut = body.lastIndexOf(" ") + 1;
    else if (body.lastIndexOf(", ") > 0) cut = body.lastIndexOf(", ") + 2;
    else {
      var w = body.split(" ");
      cut = w.length > 2 ? body.length - (w[w.length - 2] + " " + w[w.length - 1]).length : body.lastIndexOf(" ") + 1;
    }
    return { before: body.slice(0, cut), phrase: body.slice(cut), after: tail };
  }
  function markTitle(node) {
    var full = window.OZ.t(node.getAttribute("data-title-key"));
    var isH1 = node.classList.contains("vo55-title-text");
    var kind = node.getAttribute("data-mark") || "straight";
    var parts = pickPhrase(full, isH1);
    var seen = node.querySelector(".vo55-mark.is-in");
    node.textContent = "";
    node.appendChild(document.createTextNode(parts.before));
    var nw = html("span", "vo55-nowrap", node);
    var span = html("span", "vo55-mark", nw, parts.phrase);
    span.__kind = kind;
    span.__seed = node.getAttribute("data-title-key").length * 97;
    nw.appendChild(document.createTextNode(parts.after));
    drawMark(span);
    if (seen || reduced()) span.classList.add("is-in");
    observe(span);
  }
  /* draw the mark at the phrase's real pixel size, so strokes stay even */
  function scaleD(d, sx, sy) {
    var i = 0;
    return d.replace(/-?\d*\.?\d+/g, function (n) { return f(+n * (i++ % 2 ? sy : sx)); });
  }
  function drawMark(span) {
    var old = span.querySelector("svg"); if (old) span.removeChild(old);
    var m = MARKS[span.__kind];
    var w = span.offsetWidth, fs = parseFloat(getComputedStyle(span).fontSize) || 40;
    if (!w) return;
    var vb = m.vb.split(" ").map(Number);
    var svg = el("svg", { "aria-hidden": "true", "class": m.circle ? "is-circle" : null }, span);
    var h = m.circle ? fs * 1.36 : fs * (vb[3] / 100) * 2.6;
    var W = m.circle ? w * 1.08 : w * 1.06;
    svg.setAttribute("viewBox", "0 0 " + f(W) + " " + f(h));
    svg.style.width = f(W) + "px"; svg.style.height = f(h) + "px";
    seed(span.__seed);
    var d = m.circle ? loop(W / 2, h / 2, W / 2 - 3, h / 2 - 3, 1.2, 1.1) : scaleD(m.d, W / 100, h / vb[3]);
    var p = path(svg, d, m.dashed ? "is-dashed" : null, { pathLength: 1 });
    if (m.dashed) p.style.strokeDasharray = ".03 .022";
  }
  function redrawMarks() { $$(".vo55-mark").forEach(drawMark); }

  /* ======================================================================
     Reveal observer
     ====================================================================== */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
      var cb = e.target.__onIn;
      if (cb) { e.target.__onIn = null; cb(); }
    });
  }, { threshold: 0.22, rootMargin: "0px 0px -6% 0px" }) : null;
  function observe(node, cb) {
    if (cb) node.__onIn = cb;
    if (!io || node.classList.contains("is-in")) { node.classList.add("is-in"); if (cb) { node.__onIn = null; cb(); } return; }
    io.observe(node);
  }

  /* ======================================================================
     fig. 1 — hero: many keys → one door → models & tools
     ====================================================================== */
  var hero = { started: false, timers: [] };
  function renderHero() {
    var svg = $("#vo55-hero-svg");
    var narrow = NARROW.matches;
    var W = narrow ? 600 : 1000, H = 400;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.innerHTML = "";
    seed(7);
    var door = { x: narrow ? 282 : 468, y: 136, w: narrow ? 52 : 64, h: 156 };
    var doorMid = [door.x, door.y + door.h * 0.62], doorOut = [door.x + door.w, door.y + door.h * 0.62];

    var frame = drawable(path(svg, box(12, 12, W - 24, H - 24, 1.6), "vo55-svg-pencil h-frame"));
    frame.style.strokeDasharray = "1";

    // nodes (right)
    var nx = narrow ? 430 : 772, nw = narrow ? 150 : 180, nh = narrow ? 46 : 46, fs = narrow ? 21 : 17;
    var nodes = [
      { t: "Claude", ic: "spark", y: 46 }, { t: "GPT", ic: "spark", y: 112 }, { t: "Llama", ic: "spark", y: 178 },
      { t: "MCP", ic: "globe", y: 256 }, { t: "MCP", ic: "lock", y: 322 }
    ];
    var nodeG = el("g", null, svg);
    nodes.forEach(function (n) {
      var g = el("g", { "class": "h-node" }, nodeG);
      el("rect", { x: nx, y: n.y, width: nw, height: nh, "class": "vo55-svg-card" }, g);
      path(g, box(nx, n.y, nw, nh, 1), n.ic === "spark" ? "vo55-svg-pen" : "vo55-svg-pencil");
      var ig = el("g", { transform: "translate(" + (nx + 14) + " " + (n.y + 13) + ")" }, g);
      icon(ig, n.ic, 0, 0);
      text(g, nx + 46, n.y + nh / 2 + fs * 0.36, n.t, "vo55-t", { style: "font:600 " + fs + "px var(--mono)" });
      n.cy = n.y + nh / 2;
    });

    // keys (left), scattered
    var keys = [], kx0 = narrow ? 30 : 46, kx1 = narrow ? 200 : 330;
    for (var i = 0; i < (narrow ? 9 : 13); i++) {
      var row = i % 5, col = Math.floor(i / 5);
      var kx = kx0 + col * (kx1 - kx0) / 2.4 + j(26) + (row % 2) * 24;
      var ky = 52 + row * 70 + j(14);
      keys.push([kx, ky, j(60)]);
    }
    // tangled direct lines: every key wired straight to some model
    var tangle = el("g", null, svg);
    keys.forEach(function (k, i) {
      var n = nodes[(i * 3 + 1) % nodes.length];
      var p = drawable(path(tangle, "M" + f(k[0] + 18) + " " + f(k[1]) + " C " + f(k[0] + 200 + j(80)) + " " + f(k[1] + j(120)) + ", " + f(nx - 160 + j(80)) + " " + f(n.cy + j(90)) + ", " + nx + " " + f(n.cy + j(8)), "vo55-svg-faint h-tangle"));
      p.style.transitionDelay = (i * 40) + "ms";
    });
    // keys
    var keyG = el("g", null, svg);
    keys.forEach(function (k) {
      var g = el("g", { "class": "h-key" }, keyG);
      keyGlyph(g, k[0], k[1], k[2], "vo55-svg-pen");
    });
    // converging flows: key → door
    var flows = el("g", null, svg), flowDs = [];
    keys.forEach(function (k, i) {
      var d = "M" + f(k[0]) + " " + f(k[1]) + " C " + f(k[0] + (doorMid[0] - k[0]) * 0.55) + " " + f(k[1]) + ", " + f(doorMid[0] - 70) + " " + f(doorMid[1] + j(6)) + ", " + doorMid[0] + " " + f(doorMid[1]);
      flowDs.push(d);
      var p = drawable(path(flows, d, "vo55-svg-ink h-flow", { style: "stroke-width:1.5" }));
      p.style.transitionDelay = (i * 55) + "ms";
    });
    // fan-out: door → nodes
    var outs = el("g", null, svg), outDs = [];
    nodes.forEach(function (n, i) {
      var d = "M" + doorOut[0] + " " + doorOut[1] + " C " + f(doorOut[0] + 90) + " " + doorOut[1] + ", " + f(nx - 90) + " " + f(n.cy) + ", " + nx + " " + f(n.cy);
      outDs.push(d);
      var p = drawable(path(outs, d, "vo55-svg-ink h-out", { style: "stroke-width:2" }));
      p.style.transitionDelay = (i * 90) + "ms";
    });
    // the door
    var dg = el("g", null, svg);
    var glow = el("path", { d: "M" + (door.x + door.w) + " " + (door.y + door.h) + " L" + (door.x + door.w + 70) + " " + (door.y + door.h + 34) + " L" + (door.x - 6) + " " + (door.y + door.h + 34) + " L" + door.x + " " + (door.y + door.h) + " Z", "class": "vo55-svg-wash h-glow" }, dg);
    var arch = "M" + door.x + " " + (door.y + door.h) + " L" + door.x + " " + (door.y + door.w / 2) + " Q" + (door.x + door.w / 2) + " " + (door.y - door.w / 3) + " " + (door.x + door.w) + " " + (door.y + door.w / 2) + " L" + (door.x + door.w) + " " + (door.y + door.h);
    el("path", { d: arch + " Z", "class": "vo55-svg-card" }, dg);
    var leaf = el("g", { "class": "h-door-leaf" }, dg);
    el("path", { d: arch + " Z", "class": "vo55-svg-wash" }, leaf);
    path(leaf, arch + " Z", "vo55-svg-ink", { style: "stroke-width:1.6" });
    el("circle", { cx: door.x + door.w * 0.76, cy: door.y + door.h * 0.58, r: 3.2, style: "fill:var(--ink)" }, leaf);
    path(dg, poly([[door.x - 6, door.y + door.h], [door.x, door.y + door.w / 2]], false, .6), "vo55-svg-pen", { style: "stroke-width:2.2" });
    path(dg, arch, "vo55-svg-pen", { style: "stroke-width:2.6" });
    path(dg, line(door.x - 40, door.y + door.h, door.x + door.w + 40, door.y + door.h, .8), "vo55-svg-pen", { style: "stroke-width:2" });
    // pulses that travel key → door → node (only after the scene settles)
    hero.pulseDs = flowDs.map(function (d, i) { return d + " " + outDs[i % outDs.length].replace(/^M[^C]+/, "L" + doorOut[0] + " " + doorOut[1] + " "); });
    hero.svg = svg;
    if (hero.started) setHeroStage(4, true);
  }
  function addPulses() {
    if (reduced() || !hero.svg || hero.svg.querySelector(".h-pulses")) return;
    var g = el("g", { "class": "h-pulses" }, hero.svg);
    hero.pulseDs.forEach(function (d, i) {
      if (i % 2) return;
      var c = el("circle", { r: 3.4, style: "fill:var(--ink)" }, g);
      el("animateMotion", { dur: (3.4 + (i % 3) * 0.5) + "s", repeatCount: "indefinite", path: d, begin: (-i * 0.45) + "s" }, c);
    });
  }
  function setHeroStage(n, instant) {
    var svg = hero.svg;
    for (var i = 1; i <= 4; i++) svg.classList.toggle("s" + i, i <= n);
    if (n >= 4) addPulses();
  }
  function startHero() {
    if (hero.started) return;
    hero.started = true;
    if (reduced()) { setHeroStage(4, true); return; }
    hero.timers.push(setTimeout(function () { setHeroStage(1); }, 80));
    hero.timers.push(setTimeout(function () { setHeroStage(2); }, 900));
    hero.timers.push(setTimeout(function () { setHeroStage(3); }, 2600));
    hero.timers.push(setTimeout(function () { setHeroStage(4); }, 3700));
  }

  /* ======================================================================
     fig. 2 — c1: five laptops, each with a dangling key and a red note
     ====================================================================== */
  var GLYPHS = ["•••• ?", "sk-…", "$ ∞", "? ? ?", "MCP ↯"];
  function renderLaptops() {
    var list = $("#vo55-laptops");
    var pressed = list.querySelector("[aria-pressed='true']");
    var pi = pressed ? +pressed.getAttribute("data-i") : -1;
    list.innerHTML = "";
    L("c1.fig_issues").forEach(function (issue, i) {
      seed(31 + i * 13);
      var li = html("li", null, list);
      var b = html("button", "vo55-laptop", li);
      b.type = "button";
      b.setAttribute("data-i", i);
      b.setAttribute("aria-pressed", String(i === pi));
      var note = html("span", "vo55-laptop-note", b);
      html("b", null, note, pad(i + 1));
      note.appendChild(document.createTextNode(issue));
      var svg = el("svg", { viewBox: "0 0 200 150", "aria-hidden": "true" }, b);
      // arrow from the note down to the screen
      path(svg, "M" + (92 + j(6)) + " 0 C " + (78 + j(5)) + " 8, " + (66 + j(4)) + " 12, 62 25 L 55 19 M62 25 L 70 20", "vo55-svg-warn lp-arrow", { pathLength: 1, style: "transition-delay:" + (i * 140) + "ms" });
      el("rect", { x: 40, y: 30, width: 120, height: 76, "class": "lp-screen-fill" }, svg);
      path(svg, box(40, 30, 120, 76, 1.2), "vo55-svg-pen");
      path(svg, box(47, 37, 106, 62, .8), "vo55-svg-pencil");
      path(svg, poly([[24, 112], [176, 112], [192, 126], [8, 126]], true, 1), "vo55-svg-pen");
      path(svg, line(84, 119, 116, 119, .5), "vo55-svg-pencil");
      text(svg, 100, 74, GLYPHS[i], "lp-glyph", { "text-anchor": "middle" });
      // the dangling key on a string
      var k = el("g", { "class": "lp-key" }, svg);
      path(k, "M160 40 Q 170 50, 172 66", "vo55-svg-pencil");
      el("circle", { cx: 172, cy: 73, r: 7, "class": "vo55-svg-warn" }, k);
      path(k, "M172 80 L172 104 M172 96 L178 96 M172 101 L177 101", "vo55-svg-warn");
      // ring that appears on hover / focus / tap
      path(svg, loop(100, 72, 82, 56, 2, 1.08), "vo55-svg-warn lp-ring", { pathLength: 1 });
      b.addEventListener("click", function () {
        var on = b.getAttribute("aria-pressed") !== "true";
        $$(".vo55-laptop", list).forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", String(on));
      });
    });
    observe(list);
  }

  /* ======================================================================
     fig. 3 — c2: the journey of a request (scroll-driven)
     ====================================================================== */
  var J = { journey: 0, p: 0, P: 0, scrolly: false, anim: null, built: null };
  var JOURNEYS = [
    { from: 0, to: { group: "models", i: 0 } },  // desktop app → Claude
    { from: 1, to: { group: "models", i: 1 } },  // coding agent → GPT
    { from: 2, to: { group: "tools", i: 1 } }    // company agents → internal tool, via the catalogue
  ];
  var MODELS = ["Claude", "GPT", "Llama"];
  var TOOLS = [{ t: "MCP", ic: "globe" }, { t: "MCP", ic: "lock" }];

  function journeyLayout(narrow) {
    if (!narrow) return {
      W: 1000, H: 560, fs: 14, badgeX: 352,
      band: { x: 240, y: 18, w: 530, h: 48, tx: 410, ty: 47 },
      cons: [0, 1, 2].map(function (i) { return { x: 24, y: 150 + i * 100, w: 190, h: 58 }; }),
      gw: { x: 330, y: 120, w: 330, h: 330, tx: 376, ty: 156 },
      rows: [196, 240, 284, 328], rowTx: 378, rowX: 336, rowW: 318,
      cat: { x: 350, y: 366, w: 290, h: 62, tx: 400, ty: 390, portY: 408 },
      logs: { x: 330, y: 494, w: 330, h: 40, from: [495, 450] },
      mHead: [780, 114], tHead: [780, 296],
      mChips: MODELS.map(function (t, i) { return { x: 780, y: 128 + i * 50, w: 190, h: 40 }; }),
      tChips: TOOLS.map(function (t, i) { return { x: 780, y: 310 + i * 50, w: 190, h: 40 }; }),
      path: function (jn) {
        var c = this.cons[jn.from], cy = c.y + c.h / 2;
        var pts = [[c.x + c.w, cy], [288, cy], [288, 42], [352, 42], [352, 196], [352, 240], [352, 284], [352, 328]];
        var chip = jn.to.group === "models" ? this.mChips[jn.to.i] : this.tChips[jn.to.i];
        var ccy = chip.y + chip.h / 2, yy = jn.to.group === "models" ? 347 : 408;
        return pts.concat([[352, yy], [712, yy], [712, ccy], [chip.x, ccy]]);
      },
      badges: [[352, 42], [352, 196], [352, 240], [352, 284], [352, 328]],
      catPoint: [500, 408]
    };
    return {
      W: 360, H: 664, fs: 13, badgeX: 326,
      band: { x: 12, y: 88, w: 336, h: 42, tx: 24, ty: 114 },
      cons: [0, 1, 2].map(function (i) { return { x: 12 + i * 116, y: 10, w: 104, h: 52 }; }),
      gw: { x: 12, y: 150, w: 336, h: 300, tx: 46, ty: 182 },
      rows: [218, 256, 294, 332], rowTx: 28, rowX: 18, rowW: 324,
      cat: { x: 24, y: 356, w: 276, h: 52, tx: 74, ty: 387, portY: 382 },
      logs: { x: 12, y: 466, w: 210, h: 32, from: [110, 450] },
      mHead: [12, 582], tHead: [12, 652],
      mChips: MODELS.map(function (t, i) { return { x: 12 + i * 92, y: 530, w: 84, h: 34 }; }),
      tChips: TOOLS.map(function (t, i) { return { x: 12 + i * 150, y: 598, w: 140, h: 34 }; }),
      path: function (jn) {
        var c = this.cons[jn.from], cx = c.x + c.w / 2;
        var pts = [[cx, c.y + c.h], [cx, 76], [326, 76], [326, 109], [326, 218], [326, 256], [326, 294], [326, 332]];
        if (jn.to.group === "models") { var m = this.mChips[jn.to.i], mx = m.x + m.w / 2; return pts.concat([[326, 514], [mx, 514], [mx, m.y]]); }
        var t = this.tChips[jn.to.i]; return pts.concat([[326, t.y + t.h / 2], [t.x + t.w, t.y + t.h / 2]]);
      },
      badges: [[326, 109], [326, 218], [326, 256], [326, 294], [326, 332]],
      catPoint: [326, 382]
    };
  }

  function renderJourney() {
    var svg = $("#vo55-journey-svg");
    var narrow = NARROW.matches;
    var Lo = journeyLayout(narrow);
    svg.setAttribute("viewBox", "0 0 " + Lo.W + " " + Lo.H);
    svg.innerHTML = "";
    seed(11);
    var fs = Lo.fs, cons = L("c2.fig_consumers"), items = L("c2.fig_gateway_items");
    var B = { svg: svg, Lo: Lo, rows: [], cons: [], mChips: [], tChips: [] };

    // identity band
    B.band = el("g", { "class": "j-box" }, svg);
    el("rect", { x: Lo.band.x, y: Lo.band.y, width: Lo.band.w, height: Lo.band.h, "class": "vo55-svg-card" }, B.band);
    el("rect", { x: Lo.band.x, y: Lo.band.y, width: Lo.band.w, height: Lo.band.h, "class": "j-hl" }, B.band);
    path(B.band, box(Lo.band.x, Lo.band.y, Lo.band.w, Lo.band.h, 1.2), "vo55-svg-pen");
    var shG = el("g", null, B.band); icon(shG, "shield", Lo.band.tx - 28, Lo.band.y + Lo.band.h / 2 - 10);
    text(B.band, Lo.band.tx, Lo.band.ty, K("c2.fig_identity"), "vo55-tm", { style: "fill:var(--fg);font-size:" + (fs - 1) + "px" });
    if (narrow) shG.setAttribute("transform", "translate(" + (Lo.band.w - 70) + " 0)");

    // consumers
    var icons = ["laptop", "term", "bot"];
    Lo.cons.forEach(function (c, i) {
      var g = el("g", { "class": "j-box" }, svg);
      el("rect", { x: c.x, y: c.y, width: c.w, height: c.h, "class": "vo55-svg-card" }, g);
      el("rect", { x: c.x, y: c.y, width: c.w, height: c.h, "class": "j-hl" }, g);
      path(g, box(c.x, c.y, c.w, c.h, 1), "vo55-svg-pen");
      var ig = el("g", null, g);
      if (narrow) {
        var wl = wrap(cons[i], 12).slice(0, 2);
        var ig2 = el("g", { transform: "translate(" + (c.x + 8) + " " + (c.y + 5) + ") scale(.8)" }, ig); icon(ig2, icons[i], 0, 0);
        var tl = textLines(g, c.x + 8, wl.length > 1 ? c.y + 33 : c.y + 40, wl, "vo55-t", 12.5, { style: "font-size:11.5px" });
      } else {
        icon(ig, icons[i], c.x + 14, c.y + c.h / 2 - 10);
        var ln = wrap(cons[i], 18);
        textLines(g, c.x + 46, c.y + c.h / 2 + 5 - (ln.length - 1) * 8, ln, "vo55-t", 16);
      }
      B.cons.push(g);
    });

    // gateway
    var gw = Lo.gw;
    var gG = el("g", null, svg);
    el("rect", { x: gw.x, y: gw.y, width: gw.w, height: gw.h, "class": "vo55-svg-card" }, gG);
    path(gG, box(gw.x, gw.y, gw.w, gw.h, 1.4), "vo55-svg-ink", { style: "stroke-width:2.2" });
    path(gG, box(gw.x + 5, gw.y + 5, gw.w - 10, gw.h - 10, 1), "vo55-svg-faint");
    var dI = el("g", null, gG); icon(dI, "door", gw.tx - 28, gw.ty - 16);
    text(gG, gw.tx, gw.ty, K("c2.fig_gateway"), "vo55-t", { style: "font-weight:650;font-size:" + (fs + 3) + "px;fill:var(--ink)" });
    items.forEach(function (it, i) {
      var cy = Lo.rows[i];
      var g = el("g", { "class": "j-box" }, svg);
      el("rect", { x: Lo.rowX, y: cy - 16, width: Lo.rowW, height: 32, rx: 3, "class": "j-hl" }, g);
      text(g, Lo.rowTx, cy + 5, it, "vo55-t", { style: "font-size:" + fs + "px" });
      B.rows.push(g);
    });
    // tool catalogue
    var cat = Lo.cat;
    B.cat = el("g", { "class": "j-box" }, svg);
    el("rect", { x: cat.x, y: cat.y, width: cat.w, height: cat.h, "class": "j-hl" }, B.cat);
    path(B.cat, box(cat.x, cat.y, cat.w, cat.h, 1), "vo55-svg-pencil", { style: "stroke-dasharray:4 4" });
    var cI = el("g", null, B.cat);
    for (var q = 0; q < 3; q++) path(cI, box(cat.x + 12 + q * 4, cat.y + 12 - q * 3, 14, 18, .3), "vo55-svg-pencil");
    text(B.cat, cat.tx, cat.ty, K("c2.fig_catalog"), "vo55-t", { style: "font-size:" + fs + "px" });
    if (narrow) path(B.cat, "M" + (cat.x + cat.w) + " " + cat.portY + " L326 " + cat.portY, "vo55-svg-pencil");

    // logs (dashed from the gateway)
    var lg = Lo.logs;
    B.logLine = path(svg, "M" + lg.from[0] + " " + lg.from[1] + " L" + lg.from[0] + " " + lg.y, "j-log");
    B.logs = el("g", { "class": "j-box" }, svg);
    el("rect", { x: lg.x, y: lg.y, width: lg.w, height: lg.h, "class": "vo55-svg-card" }, B.logs);
    el("rect", { x: lg.x, y: lg.y, width: lg.w, height: lg.h, "class": "j-hl" }, B.logs);
    path(B.logs, box(lg.x, lg.y, lg.w, lg.h, 1), "vo55-svg-pencil");
    var lI = el("g", null, B.logs); icon(lI, "log", lg.x + 10, lg.y + lg.h / 2 - 10);
    text(B.logs, lg.x + 38, lg.y + lg.h / 2 + 4.5, K("c2.fig_logs"), "vo55-tm", { style: "font-size:" + (fs - 1.5) + "px;fill:var(--fg)" });

    // destinations
    text(svg, Lo.mHead[0], Lo.mHead[1], K("c2.fig_models").toUpperCase(), "vo55-tm", { style: "letter-spacing:.12em" });
    text(svg, Lo.tHead[0], Lo.tHead[1], K("c2.fig_tools").toUpperCase(), "vo55-tm", { style: "letter-spacing:.12em" });
    Lo.mChips.forEach(function (c, i) {
      var g = el("g", { "class": "j-box" }, svg);
      el("rect", { x: c.x, y: c.y, width: c.w, height: c.h, "class": "vo55-svg-card" }, g);
      el("rect", { x: c.x, y: c.y, width: c.w, height: c.h, "class": "j-hl" }, g);
      path(g, box(c.x, c.y, c.w, c.h, .9), "vo55-svg-pen");
      if (!narrow) { var ig = el("g", { transform: "translate(" + (c.x + 12) + " " + (c.y + c.h / 2 - 8) + ") scale(.8)" }, g); icon(ig, "spark", 0, 0); }
      text(g, narrow ? c.x + c.w / 2 : c.x + 42, c.y + c.h / 2 + 5, MODELS[i], "vo55-t", { style: "font-family:var(--mono);font-size:" + fs + "px", "text-anchor": narrow ? "middle" : "start" });
      B.mChips.push(g);
    });
    Lo.tChips.forEach(function (c, i) {
      var g = el("g", { "class": "j-box" }, svg);
      el("rect", { x: c.x, y: c.y, width: c.w, height: c.h, "class": "vo55-svg-card" }, g);
      el("rect", { x: c.x, y: c.y, width: c.w, height: c.h, "class": "j-hl" }, g);
      path(g, box(c.x, c.y, c.w, c.h, .9), "vo55-svg-pen");
      var ig = el("g", { transform: "translate(" + (c.x + 12) + " " + (c.y + c.h / 2 - 8) + ") scale(.8)" }, g); icon(ig, TOOLS[i].ic, 0, 0);
      text(g, c.x + 40, c.y + c.h / 2 + 5, TOOLS[i].t, "vo55-t", { style: "font-family:var(--mono);font-size:" + fs + "px" });
      B.tChips.push(g);
    });

    // routes (ghost + travelled) for the current journey
    B.ghost = path(svg, "", "j-route-ghost");
    B.trail = path(svg, "", "j-route");
    // badges
    B.badges = Lo.badges.map(function (p, i) {
      var g = el("g", { "class": "j-badge" }, svg);
      el("circle", { cx: p[0], cy: p[1], r: narrow ? 11 : 12 }, g);
      text(g, p[0], p[1] + 0.5, String(i + 1), null);
      return g;
    });
    B.halo = el("circle", { r: 13, "class": "j-dot-halo" }, svg);
    B.dot = el("circle", { r: 6, "class": "j-dot" }, svg);
    J.built = B;
    setJourney(J.journey, true);
    renderConsumerButtons();
  }

  function setJourney(k, keepP) {
    var B = J.built; if (!B) return;
    J.journey = k;
    var jn = JOURNEYS[k];
    var d = route(B.Lo.path(jn), B.Lo.W > 500 ? 18 : 12);
    B.ghost.setAttribute("d", d);
    B.trail.setAttribute("d", d);
    var len = B.trail.getTotalLength();
    B.len = len;
    B.trail.style.strokeDasharray = len + " " + len;
    // where along the path each checkpoint sits
    function at(pt) {
      var best = 0, bd = 1e9;
      for (var s = 0; s <= 400; s++) {
        var q = B.trail.getPointAtLength(len * s / 400), dd = Math.hypot(q.x - pt[0], q.y - pt[1]);
        if (dd < bd) { bd = dd; best = s / 400; }
      }
      return bd < 14 ? best : 2;
    }
    B.marks = B.Lo.badges.map(at);
    B.catMark = jn.to.group === "tools" ? at(B.Lo.catPoint) : 2;
    B.cons.forEach(function (g, i) { g.classList.toggle("on", i === jn.from); g.classList.toggle("dim", i !== jn.from); });
    $$(".vo55-chip-btn", $("#vo55-consumers")).forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === k)); });
    updateJourney(keepP ? J.p : 0);
  }

  function updateJourney(p) {
    var B = J.built; if (!B) return;
    p = Math.max(0, Math.min(1, p));
    J.p = p;
    var jn = JOURNEYS[J.journey];
    var pt = B.trail.getPointAtLength(B.len * p);
    B.dot.setAttribute("cx", pt.x); B.dot.setAttribute("cy", pt.y);
    B.halo.setAttribute("cx", pt.x); B.halo.setAttribute("cy", pt.y);
    B.trail.style.strokeDashoffset = String(B.len * (1 - p));
    var stage = 0;
    B.marks.forEach(function (m, i) {
      var on = p >= m - 0.004;
      if (on) stage = i + 1;
      B.badges[i].classList.toggle("on", on);
      B.badges[i].classList.remove("now");
    });
    if (stage) B.badges[stage - 1].classList.add("now");
    B.band.classList.toggle("on", stage >= 1);
    B.rows.forEach(function (r, i) { r.classList.toggle("on", stage >= i + 2); });
    B.logs.classList.toggle("on", stage >= 5);
    B.logLine.classList.toggle("on", stage >= 5);
    B.cat.classList.toggle("on", p >= B.catMark);
    var arrived = p >= 0.985;
    B.mChips.forEach(function (g, i) { g.classList.toggle("on", arrived && jn.to.group === "models" && jn.to.i === i); });
    B.tChips.forEach(function (g, i) { g.classList.toggle("on", arrived && jn.to.group === "tools" && jn.to.i === i); });

    // readout
    var ro = $("#vo55-readout"), cons = L("c2.fig_consumers"), items = L("c2.fig_gateway_items");
    var label, num;
    if (arrived) {
      num = "→";
      label = (jn.to.group === "models" ? K("c2.fig_models") + " · " + MODELS[jn.to.i] : K("c2.fig_catalog") + " → " + K("c2.fig_tools") + " · MCP");
    } else if (stage === 0) { num = "·"; label = cons[jn.from]; }
    else if (stage === 1) { num = "1"; label = K("c2.fig_identity"); }
    else { num = String(stage); label = items[stage - 2] + (stage === 5 ? "  ·  " + K("c2.fig_logs") : ""); }
    var key = num + label;
    if (ro.__k !== key) {
      ro.__k = key;
      ro.innerHTML = "";
      html("b", null, ro, num);
      html("span", null, ro, label);
    }
    var bar = $("#vo55-progress-bar");
    bar.style.width = ((J.scrolly ? J.P : (J.journey + p) / 3) * 100) + "%";
  }

  function renderConsumerButtons() {
    var wrapEl = $("#vo55-consumers");
    wrapEl.setAttribute("aria-label", K("c2.fig"));
    wrapEl.innerHTML = "";
    L("c2.fig_consumers").forEach(function (c, i) {
      var b = html("button", "vo55-chip-btn", wrapEl);
      b.type = "button";
      html("i", null, b, pad(i + 1));
      html("span", null, b, c);
      b.setAttribute("aria-pressed", String(i === J.journey));
      b.addEventListener("click", function () { playJourney(i); });
    });
  }

  function playJourney(k) {
    if (J.scrolly) {
      var track = $("#vo55-scrolly");
      var top = track.getBoundingClientRect().top + window.scrollY;
      var range = track.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + range * ((k + 0.9) / 3), behavior: reduced() ? "auto" : "smooth" });
      return;
    }
    if (J.anim) cancelAnimationFrame(J.anim);
    setJourney(k);
    if (reduced()) { updateJourney(1); return; }
    var t0 = null, dur = 3200;
    function step(ts) {
      if (t0 == null) t0 = ts;
      var t = Math.min(1, (ts - t0) / dur);
      var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      updateJourney(e * 0.25 + t * 0.75);
      if (t < 1) J.anim = requestAnimationFrame(step);
    }
    J.anim = requestAnimationFrame(step);
  }

  function checkScrolly() {
    var track = $("#vo55-scrolly"), sticky = $(".vo55-sticky", track);
    var was = J.scrolly;
    track.classList.remove("is-scrolly");
    var fits = sticky.offsetHeight + 70 <= window.innerHeight;
    J.scrolly = fits;
    track.classList.toggle("is-scrolly", fits);
    if (was !== fits) onScroll();
    if (!fits && !J.autoplayed && track.classList.contains("is-in")) { J.autoplayed = true; playJourney(0); }
  }

  function onScroll() {
    if (!J.scrolly || !J.built) return;
    var track = $("#vo55-scrolly");
    var r = track.getBoundingClientRect();
    var range = track.offsetHeight - window.innerHeight;
    var P = Math.max(0, Math.min(1, -r.top / range));
    J.P = P;
    var k = Math.min(2, Math.floor(P * 3));
    var local = P * 3 - k;
    var p = Math.min(1, local / 0.82);
    if (k !== J.journey) setJourney(k);
    updateJourney(p);
  }

  /* ======================================================================
     fig. 4 — c3: tiers toggle → which doors open
     ====================================================================== */
  var TIER = { i: 0 };
  var T_MODELS = [["Claude", 0], ["GPT", 0], ["Llama", 1], ["Mistral", 2]];
  var T_TOOLS = [["PDF", 0], ["CSV", 0], ["SQL", 1], ["MCP", 1], ["Git", 2], ["Python", 2]];
  var T_CONS = [0, 2, 1]; // desktop app: all · company agents: power+ · coding agent: developer
  var T_BUDGET = [2, 5, 5];
  function doorSVG() {
    return '<svg viewBox="0 0 26 32" aria-hidden="true">' +
      '<path class="d-light" d="M4 30 L22 30 L26 32 L0 32 Z"/>' +
      '<path class="d-frame" d="M3 30 L3 11 Q13 0 23 11 L23 30"/>' +
      '<path class="d-leaf" d="M3.5 30 L3.5 11.5 Q13 1.5 22.5 11.5 L22.5 30 Z"/>' +
      '<circle class="d-knob" cx="18" cy="19" r="1.4"/>' +
      '<path class="d-lock" d="M9 20 L17 20 L17 26 L9 26 Z M10.5 20 L10.5 17.5 Q13 14 15.5 17.5 L15.5 20"/>' +
      '<path class="d-frame" d="M0 30 L26 30"/></svg>';
  }
  function renderTiers() {
    var tog = $("#vo55-tier-toggle");
    $$(".vo55-tier-opt", tog).forEach(function (o) { o.remove(); });
    seed(5);
    $("#vo55-tier-track-path").setAttribute("d", box(1, 1, 298, 42, .6));
    L("c3.fig_tiers").forEach(function (name, i) {
      var b = html("button", "vo55-tier-opt", tog);
      b.type = "button";
      b.setAttribute("role", "radio");
      html("small", null, b, pad(i + 1));
      html("span", null, b, name);
      b.addEventListener("click", function () { setTier(i, true); });
    });
    tog.addEventListener("keydown", tierKeys);
    var grid = $("#vo55-tier-grid");
    grid.innerHTML = "";
    function group(title, rows) {
      var g = html("div", "vo55-tier-group", grid);
      html("h3", null, g, title);
      var ul = html("ul", null, g);
      rows.forEach(function (r) {
        var li = html("li", "vo55-door", ul);
        li.setAttribute("data-min", r[1]);
        li.innerHTML = doorSVG();
        html("span", null, li, r[0]);
      });
      return g;
    }
    var cons = L("c2.fig_consumers");
    group(K("c2.fig_models"), T_MODELS);
    group(K("c2.fig_tools"), T_TOOLS);
    group(K("c2.fig").split("→")[0].trim(), cons.map(function (c, i) { return [c, T_CONS[i]]; }));
    var bg = html("div", "vo55-tier-group", grid);
    html("h3", null, bg, L("c2.fig_gateway_items")[1]);
    var bd = html("div", "vo55-budget", bg);
    var coins = "";
    for (var c = 0; c < 5; c++) coins += '<ellipse class="b-coin" data-c="' + c + '" cx="' + (40 + 0) + '" cy="' + (78 - c * 13) + '" rx="30" ry="8"/>';
    bd.innerHTML = '<svg viewBox="0 0 200 92" aria-hidden="true"><path class="vo55-svg-pencil" d="M2 88 L120 88"/>' + coins + '</svg>';
    setTier(TIER.i, false);
  }
  function tierKeys(e) {
    var n = 3, i = TIER.i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = (i + n - 1) % n;
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    else return;
    e.preventDefault();
    setTier(i, true);
  }
  function setTier(i, focus) {
    TIER.i = i;
    var tog = $("#vo55-tier-toggle");
    tog.style.setProperty("--i", i);
    $$(".vo55-tier-opt", tog).forEach(function (b, k) {
      b.setAttribute("aria-checked", String(k === i));
      b.tabIndex = k === i ? 0 : -1;
      if (k === i && focus) b.focus();
    });
    $("#vo55-tier-desc").textContent = L("c3.fig_tier_descs")[i];
    $$(".vo55-door", $("#vo55-tier-grid")).forEach(function (d) {
      var open = +d.getAttribute("data-min") <= i;
      d.classList.toggle("is-open", open);
      d.classList.toggle("is-closed", !open);
    });
    $$(".b-coin").forEach(function (c) { c.classList.toggle("off", +c.getAttribute("data-c") >= T_BUDGET[i]); });
  }

  /* ======================================================================
     fig. 5 — c4: five layers of quota, each a gauge with 75 / 90 marks
     ====================================================================== */
  var LAYER_FILL = [36, 58, 79, 44, 92];
  function renderLayers() {
    var list = $("#vo55-layers");
    list.innerHTML = "";
    var names = L("c4.fig_layers");
    names.forEach(function (name, i) {
      seed(60 + i);
      var li = html("li", "vo55-layer", list);
      li.tabIndex = 0;
      li.setAttribute("role", "slider");
      li.setAttribute("aria-label", name);
      li.setAttribute("aria-valuemin", "0");
      li.setAttribute("aria-valuemax", "100");
      html("span", "vo55-layer-no", li, "L" + (i + 1));
      html("span", "vo55-layer-name", li, name);
      var g = html("div", "vo55-gauge", li);
      g.innerHTML = '<svg viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true"><path class="g-frame" d="' + box(1, 1.5, 98, 31, .5) + '"/></svg>';
      html("div", "vo55-gauge-fill", g);
      var marks = html("div", "vo55-gauge-marks", g);
      [75, 90].forEach(function (m) { var s = html("span", null, marks, m + "%"); s.style.left = m + "%"; });
      var bell = html("span", null, li);
      bell.innerHTML = '<svg class="vo55-bell" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17 L6 11 Q6 5 12 5 Q18 5 18 11 L18 17 L20 19 L4 19 Z M10 21 Q12 23 14 21 M12 3 L12 5"/></svg>';
      setLayer(li, LAYER_FILL[i], false);
      // highlight on hover / focus
      li.addEventListener("pointerenter", function () { hl(li, true); });
      li.addEventListener("pointerleave", function () { if (document.activeElement !== li) hl(li, false); });
      li.addEventListener("focus", function () { hl(li, true); });
      li.addEventListener("blur", function () { hl(li, false); });
      li.addEventListener("keydown", function (e) {
        var v = LAYER_FILL[i];
        if (e.key === "ArrowRight" || e.key === "ArrowUp") v += 5;
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") v -= 5;
        else if (e.key === "Home") v = 0;
        else if (e.key === "End") v = 100;
        else return;
        e.preventDefault();
        setLayer(li, v, true, i);
      });
      // drag the fill
      var dragging = false;
      function fromX(e) {
        var r = g.getBoundingClientRect();
        setLayer(li, Math.round(((e.clientX - r.left) / r.width) * 100), true, i);
      }
      g.addEventListener("pointerdown", function (e) { dragging = true; g.setPointerCapture(e.pointerId); fromX(e); hl(li, true); });
      g.addEventListener("pointermove", function (e) { if (dragging) fromX(e); });
      g.addEventListener("pointerup", function () { dragging = false; });
      g.addEventListener("pointercancel", function () { dragging = false; });
    });
    var legend = $(".vo55-layers-legend") || html("div", "vo55-layers-legend", list.parentNode);
    legend.innerHTML = '<span><i style="background:var(--amber)"></i>≥ 75%</span><span><i style="background:var(--warn)"></i>≥ 90%</span>';
    legend.setAttribute("aria-hidden", "true");
  }
  function hl(li, on) {
    var list = li.parentNode;
    $$(".vo55-layer", list).forEach(function (o) { o.classList.toggle("is-hl", on && o === li); });
    list.classList.toggle("has-focus", on);
  }
  function setLayer(li, v, user, i) {
    v = Math.max(0, Math.min(100, v));
    if (i != null) LAYER_FILL[i] = v;
    li.setAttribute("aria-valuenow", v);
    li.setAttribute("aria-valuetext", v + "%");
    var fill = li.querySelector(".vo55-gauge-fill");
    fill.style.width = "calc((100% - 6px) * " + (v / 100) + ")";
    var warn = v >= 75 && v < 90, crit = v >= 90;
    if (user) {
      // restart the bell ring when crossing a threshold
      var was = li.classList.contains("crit") ? 2 : li.classList.contains("warn") ? 1 : 0, now = crit ? 2 : warn ? 1 : 0;
      if (was !== now) { li.classList.remove("warn", "crit"); void li.offsetWidth; }
    }
    li.classList.toggle("warn", warn);
    li.classList.toggle("crit", crit);
  }

  /* ======================================================================
     fig. 6 — c5: four iterations, crossed out one by one, the last circled
     ====================================================================== */
  var ITER = { s: -1, timers: [] };
  function sketch(svg, k) {
    var pen = "vo55-svg-pen", pc = "vo55-svg-pencil", ink = "vo55-svg-ink";
    function people(x) { for (var i = 0; i < 3; i++) { el("circle", { cx: x, cy: 46 + i * 28, r: 5, "class": pc }, svg); path(svg, "M" + (x - 7) + " " + (60 + i * 28) + " Q" + x + " " + (52 + i * 28) + " " + (x + 7) + " " + (60 + i * 28), pc); } }
    function models(x) { for (var i = 0; i < 3; i++) path(svg, box(x, 34 + i * 30, 30, 20, .7), pen); }
    function arrow(x1, y1, x2, y2, cls) { path(svg, line(x1, y1, x2, y2, .8), cls || pc); path(svg, "M" + (x2 - 6) + " " + (y2 - 4) + " L" + x2 + " " + y2 + " L" + (x2 - 6) + " " + (y2 + 4), cls || pc); }
    people(22);
    models(196);
    if (k === 0) { // cloud API manager only
      path(svg, "M78 92 Q66 92 68 80 Q66 64 84 64 Q90 46 112 52 Q128 42 140 58 Q160 58 158 76 Q166 92 150 92 Z", pen);
      path(svg, box(92, 70, 44, 16, .5), pc);
      text(svg, 114, 82, "API", "vo55-tm", { "text-anchor": "middle", style: "font-size:9px" });
      arrow(34, 74, 66, 76); arrow(160, 76, 192, 74);
      path(svg, "M30 108 C 80 138, 150 136, 192 104", pc, { style: "stroke-dasharray:3 4" }); // keys still go around
    } else if (k === 1) { // self-hosted gateway
      for (var r = 0; r < 3; r++) { path(svg, box(92, 50 + r * 18, 46, 14, .5), pen); el("circle", { cx: 100, cy: 57 + r * 18, r: 1.6, style: "fill:var(--fg)" }, svg); }
      path(svg, line(115, 104, 115, 116, .4), pc); path(svg, line(98, 116, 132, 116, .5), pc);
      arrow(34, 74, 86, 74); arrow(142, 74, 192, 74);
    } else if (k === 2) { // edge in front of the API manager
      path(svg, "M70 30 L64 46 L72 60 L64 76 L72 92 L64 108 L70 122", ink);
      path(svg, box(108, 60, 44, 28, .6), pen);
      text(svg, 130, 78, "API", "vo55-tm", { "text-anchor": "middle", style: "font-size:9px" });
      arrow(34, 74, 62, 74); arrow(76, 74, 104, 74); arrow(156, 74, 192, 74);
    } else { // edge AI gateway, the single control point
      var dg = el("g", null, svg);
      doorGlyph(dg, 98, 44, 34, 66);
      for (var q = 0; q < 3; q++) path(svg, "M34 " + (46 + q * 28) + " C 60 " + (46 + q * 28) + ", 80 84, 96 86", ink, { style: "stroke-width:1.5" });
      for (var w = 0; w < 3; w++) path(svg, "M136 86 C 160 86, 170 " + (44 + w * 30) + ", 192 " + (44 + w * 30), ink, { style: "stroke-width:1.5" });
      path(svg, "M136 90 C 150 112, 170 124, 196 128", ink, { style: "stroke-width:1.5" });
      el("circle", { cx: 206, cy: 128, r: 6, "class": pen }, svg);
    }
  }
  function renderIters() {
    var list = $("#vo55-iters"), tabs = $("#vo55-iter-tabs");
    list.innerHTML = ""; tabs.innerHTML = "";
    var names = L("c5.fig_iters");
    names.forEach(function (name, i) {
      seed(80 + i * 7);
      var li = html("li", "vo55-iter", list);
      li.id = "vo55-iter-" + i;
      li.setAttribute("role", "tabpanel");
      var svg = el("svg", { viewBox: "0 0 240 150", "aria-hidden": "true" }, li);
      path(svg, box(4, 6, 232, 140, 1.2), "vo55-svg-faint");
      sketch(svg, i);
      if (i < 3) {
        path(svg, line(18, 18, 222, 134, 2.4), "vo55-svg-warn i-cross", { pathLength: 1, style: "stroke-width:2.6" });
        path(svg, line(222, 22, 20, 130, 2.4), "vo55-svg-warn i-cross", { pathLength: 1, style: "stroke-width:2.6;transition-delay:.18s" });
      } else {
        path(svg, loop(120, 76, 122, 80, 2.4, 1.12), "vo55-svg-ink i-circle", { pathLength: 1, style: "stroke-width:2.6" });
      }
      var p = html("p", null, li);
      html("b", null, p, pad(i + 1));
      p.appendChild(document.createTextNode(name));

      var t = html("button", "vo55-step", tabs, pad(i + 1));
      t.type = "button";
      t.setAttribute("role", "tab");
      t.setAttribute("aria-controls", li.id);
      t.setAttribute("aria-label", pad(i + 1) + " " + name);
      t.addEventListener("click", function () { stopIterAuto(); setIter(i); });
      t.addEventListener("keydown", function (e) {
        var n = -1;
        if (e.key === "ArrowRight") n = Math.min(3, ITER.s + 1);
        if (e.key === "ArrowLeft") n = Math.max(0, ITER.s - 1);
        if (n < 0) return;
        e.preventDefault(); stopIterAuto(); setIter(n); tabs.children[n].focus();
      });
    });
    var nx = html("button", "vo55-step vo55-step--next", tabs, "→");
    nx.type = "button";
    nx.setAttribute("aria-label", "→ " + pad(Math.min(4, ITER.s + 2)));
    nx.addEventListener("click", function () { stopIterAuto(); setIter(ITER.s >= 3 ? 0 : ITER.s + 1); });
    setIter(ITER.s < 0 ? 0 : ITER.s, true);
    if (ITER.s === 0 && !ITER.auto) {
      ITER.auto = true;
      observe(list, function () {
        if (reduced()) { setIter(3); return; }
        [1, 2, 3].forEach(function (n, k) { ITER.timers.push(setTimeout(function () { setIter(n); }, 1100 + k * 1100)); });
      });
    }
  }
  function stopIterAuto() { ITER.timers.forEach(clearTimeout); ITER.timers = []; }
  function setIter(s) {
    ITER.s = s;
    $$(".vo55-iter").forEach(function (li, i) {
      li.classList.toggle("is-crossed", i < s);
      li.classList.toggle("is-current", i === s);
      li.classList.toggle("is-future", i > s);
      li.classList.toggle("is-won", s === 3 && i === 3);
    });
    var tabs = $$(".vo55-step", $("#vo55-iter-tabs"));
    tabs.forEach(function (t, i) {
      if (t.classList.contains("vo55-step--next")) { t.setAttribute("aria-label", "→ " + pad(s >= 3 ? 1 : s + 2)); return; }
      t.setAttribute("aria-selected", String(i === s));
      t.tabIndex = i === s ? 0 : -1;
    });
  }

  /* ======================================================================
     fig. 7 — c6: three widening ripples
     ====================================================================== */
  var WAVE = { k: -1, timers: [] };
  function renderWaves() {
    var svg = $("#vo55-waves-svg");
    var narrow = NARROW.matches;
    var W = narrow ? 400 : 1000, H = narrow ? 340 : 440;
    var cx = W / 2, cy = narrow ? 318 : 410;
    var R = narrow ? [72, 140, 196] : [112, 232, 372];
    var counts = narrow ? [5, 16, 38] : [8, 26, 72];
    var fs = narrow ? 13.5 : 15;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.innerHTML = "";
    seed(21);
    var labels = L("c6.fig_waves");
    // ground line
    path(svg, line(14, cy, W - 14, cy, 1), "vo55-svg-pen");
    // fills (semi-discs) underneath
    var fills = R.map(function (r) {
      return el("path", { d: "M" + (cx - r) + " " + cy + " A" + r + " " + r + " 0 0 1 " + (cx + r) + " " + cy + " Z", "class": "w-fill" }, svg);
    });
    fills.reverse().forEach(function (p) { svg.appendChild(p); }); fills.reverse();
    // ghost arcs (where the next wave will reach)
    R.forEach(function (r) { el("path", { d: "M" + (cx - r) + " " + cy + " A" + r + " " + r + " 0 0 1 " + (cx + r) + " " + cy, "class": "w-arc ghost" }, svg); });
    // label boxes first (dots stay clear of them)
    var boxes = labels.map(function (t, w) { var tw = t.length * fs * 0.6 + 26, th = fs + 14; return { x: cx - tw / 2 - 6, y: cy - R[w] - th / 2 - 6, w: tw + 12, h: th + 12 }; });
    function clear(x, y) { return !boxes.some(function (b) { return x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h; }) && Math.hypot(x - cx, y - cy) > 30; }
    // people, seeded inside each ring
    var people = [];
    R.forEach(function (r, w) {
      var r0 = w ? R[w - 1] + 10 : 22;
      for (var n = 0; n < counts[w]; n++) {
        var a = Math.PI * (0.06 + rnd() * 0.88), rr = r0 + rnd() * (r - r0 - 10);
        if (!clear(cx + Math.cos(a) * rr, cy - Math.sin(a) * rr)) continue;
        people.push(el("circle", { cx: f(cx + Math.cos(a) * rr), cy: f(cy - Math.sin(a) * rr), r: narrow ? 2.6 : 3.4, "class": "w-p", "data-w": w }, svg));
      }
    });
    // hand-drawn arcs
    var arcs = R.map(function (r, w) {
      var pts = [];
      for (var s = 0; s <= 24; s++) { var a = Math.PI - (s / 24) * Math.PI; pts.push([cx + Math.cos(a) * r, cy - Math.sin(a) * r]); }
      return path(svg, poly(pts, false, 1.3), "w-arc", { pathLength: 1, style: "transition-delay:" + (w ? 0 : 0) + "ms" });
    });
    // the door at the centre
    doorGlyph(el("g", { "class": "w-door" }, svg), cx - 9, cy - 34, 18, 34);
    // labels at the top of each arc
    var labs = labels.map(function (t, w) {
      var g = el("g", { "class": "w-lab" }, svg);
      var tw = t.length * fs * 0.6 + 26, th = fs + 14;
      var y = cy - R[w];
      el("rect", { x: f(cx - tw / 2), y: f(y - th / 2), width: f(tw), height: th, rx: 3 }, g);
      text(g, cx, y + 0.5, t, null, { style: "font-size:" + fs + "px" });
      return g;
    });
    WAVE.parts = { fills: fills, arcs: arcs, people: people, labs: labs };

    var btns = $("#vo55-wave-btns");
    btns.innerHTML = "";
    labels.forEach(function (t, w) {
      var b = html("button", "vo55-chip-btn", btns);
      b.type = "button";
      html("i", null, b, pad(w + 1));
      html("span", null, b, t.split("·")[0].trim());
      b.setAttribute("aria-label", t);
      b.addEventListener("click", function () { WAVE.timers.forEach(clearTimeout); setWave(w); });
    });
    setWave(WAVE.k);
    if (WAVE.k < 0 && !WAVE.auto) {
      WAVE.auto = true;
      observe(svg, function () {
        if (reduced()) { setWave(2); return; }
        [0, 1, 2].forEach(function (w) { WAVE.timers.push(setTimeout(function () { setWave(w); }, 300 + w * 1300)); });
      });
    }
  }
  function setWave(k) {
    WAVE.k = k;
    var P = WAVE.parts;
    P.arcs.forEach(function (a, w) { a.classList.toggle("on", w <= k); });
    P.fills.forEach(function (a, w) { a.classList.toggle("on", w <= k); });
    P.labs.forEach(function (a, w) { a.classList.toggle("on", w <= k); a.classList.toggle("cur", w === k); });
    P.people.forEach(function (c) { c.classList.toggle("on", +c.getAttribute("data-w") <= k); });
    $$(".vo55-chip-btn", $("#vo55-wave-btns")).forEach(function (b, w) { b.setAttribute("aria-pressed", String(w === k)); });
  }

  /* ======================================================================
     static bits: titles, fig numbers, stack, credit
     ====================================================================== */
  function renderStatic() {
    $$("[data-title-key]").forEach(markTitle);
    $$("[data-fig-no]").forEach(function (n) { n.textContent = window.OZ.t("ui.fig") + " " + n.getAttribute("data-fig-no"); });
    var tags = $("#vo55-tags");
    tags.innerHTML = "";
    K("stack").split(/,\s*/).forEach(function (t) { html("li", null, tags, t); });
    $("#vo55-credit").textContent = window.OZ.t("projects.credit").replace("{model}", MODEL_NAME);
    document.title = K("title") + " — ozsert.com";
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", K("oneliner"));
  }

  function renderAll() {
    renderStatic();
    renderHero();
    renderLaptops();
    renderJourney();
    renderTiers();
    renderLayers();
    renderIters();
    renderWaves();
    checkScrolly();
    onScroll();
  }

  function init() {
    renderAll();
    $$(".vo55-fig").forEach(function (fg) { observe(fg); });
    observe($(".vo55-fig--hero"), startHero);
    observe($("#vo55-scrolly"), function () { checkScrolly(); });

    document.addEventListener("oz:langchange", function () {
      renderStatic();
      renderLaptops();
      renderJourney();
      renderTiers();
      renderLayers();
      renderIters();
      renderWaves();
      checkScrolly();
      onScroll();
    });
    var raf = 0;
    window.addEventListener("scroll", function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; onScroll(); });
    }, { passive: true });
    var rt = 0;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { redrawMarks(); checkScrolly(); onScroll(); }, 120); });
    NARROW.addEventListener("change", function () { renderHero(); renderJourney(); renderWaves(); checkScrolly(); onScroll(); });
    RM.addEventListener("change", function () { if (reduced()) { setHeroStage(4); setIter(3); setWave(2); } });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { redrawMarks(); checkScrolly(); onScroll(); });
  }

  if (window.OZ && window.OZ.ready) window.OZ.ready.then(init);
  else document.addEventListener("oz:ready", init, { once: true });
})();
