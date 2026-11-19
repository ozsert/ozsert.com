/* ozsert.com — /projects/skill-marketplace/
   Field-notebook explainer. Vanilla JS + inline SVG. All copy via OZ.t(). */
(function () {
  "use strict";

  var P = "project.skill-marketplace.";
  var MODEL = "Claude Opus 5.5";
  var NS = "http://www.w3.org/2000/svg";
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var REDUCED = mqReduce.matches;

  /* Real numbers from the spec (skill counts per department). */
  var DEPT_COUNTS = [46, 18, 5, 1, 6, 3];

  // ── helpers ────────────────────────────────────────────────────────────
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function t(k) { return window.OZ.t(P + k); }
  function list(k) { return t(k).split("|").map(function (x) { return x.trim(); }); }
  function esc(str) { return String(str).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function ease(k) { return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function upperFirst(str) { return str.charAt(0).toLocaleUpperCase(window.OZ.lang) + str.slice(1); }
  function svgEl(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] !== undefined) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function h(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function rng(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }
  function f(n) { return n.toFixed(1); }
  /* hand-drawn rectangle: quadratic sides with jitter and a small overshoot */
  function wrect(x, y, w, hh, r, a) {
    a = a === undefined ? 1.4 : a;
    function j() { return (r() - .5) * 2 * a; }
    var p = [[x + j(), y + j()], [x + w + j(), y + j()], [x + w + j(), y + hh + j()], [x + j(), y + hh + j()]];
    var d = "M" + f(p[0][0] - 2) + " " + f(p[0][1] + .4);
    for (var i = 1; i <= 4; i++) {
      var A = p[i - 1], B = p[i % 4];
      d += " Q" + f((A[0] + B[0]) / 2 + j()) + " " + f((A[1] + B[1]) / 2 + j()) + " " + f(B[0]) + " " + f(B[1]);
    }
    return d + " l" + f(r() * 3 + 1.5) + " " + f((r() - .5) * 1.2);
  }
  function wline(x1, y1, x2, y2, r, a) {
    a = a === undefined ? 1.2 : a;
    return "M" + f(x1) + " " + f(y1) + " Q" + f((x1 + x2) / 2 + (r() - .5) * 2 * a) + " " + f((y1 + y2) / 2 + (r() - .5) * 2 * a) + " " + f(x2) + " " + f(y2);
  }

  // ── titles with a hand-drawn underline on one phrase ──────────────────
  var UL_PATHS = {
    sweep: "M1 6 C 22 9, 58 2.5, 99 5",
    wave: "M1 5 Q 7 1 13 5 T 25 5 T 37 5 T 49 5 T 61 5 T 73 5 T 85 5 T 97 5",
    double: "M1 4 C 30 6, 70 2, 99 4 M5 8.6 C 35 10, 68 7, 95 9",
    dash: "M1 5 L12 5.6 M18 5.2 L30 4.8 M36 5.5 L48 5.1 M54 4.9 L66 5.4 M72 5.2 L84 4.9 M90 5.3 L99 5",
    zig: "M1 7 L7 3 L13 7 L19 3 L25 7 L31 3 L37 7 L43 3 L49 7 L55 3 L61 7 L67 3 L73 7 L79 3 L85 7 L91 3 L97 7"
  };
  /* [start word, count] per language; negative start counts from the end */
  var TITLES = {
    hero: { key: "title", tr: [-2, 2], en: [0, 2], style: "sweep" },
    c1: { key: "c1.title", tr: [-2, 2], en: [-1, 1], style: "wave" },
    c2: { key: "c2.title", tr: [0, 2], en: [0, 2], style: "double" },
    c3: { key: "c3.title", tr: [-2, 2], en: [-2, 2], style: "dash" },
    c4: { key: "c4.title", tr: [0, 2], en: [0, 2], style: "zig" },
    c5: { key: "c5.title", tr: [1, 1], en: [-1, 1], style: "sweep" },
    c6: { key: "c6.title", tr: [-2, 2], en: [-2, 2], style: "wave" }
  };
  function renderTitles() {
    $$("[data-title]").forEach(function (el) {
      var cfg = TITLES[el.getAttribute("data-title")];
      var text = t(cfg.key).trim();
      var dot = /\.$/.test(text);
      if (dot) text = text.slice(0, -1);
      var words = text.split(/\s+/);
      var span = cfg[window.OZ.lang] || cfg.en;
      var start = span[0] < 0 ? words.length + span[0] : span[0];
      start = clamp(start, 0, words.length - 1);
      var end = Math.min(words.length, start + span[1]);
      var before = words.slice(0, start).join(" ");
      var phrase = words.slice(start, end).join(" ");
      var after = words.slice(end).join(" ");
      el.innerHTML =
        (before ? esc(before) + " " : "") +
        '<span class="vsm-ul">' + esc(phrase) +
        '<svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="' + UL_PATHS[cfg.style] + '"/></svg></span>' +
        (after ? " " + esc(after) : "") +
        (dot ? '<span class="vsm-dot">.</span>' : "");
    });
  }

  // ── facts strip ─────────────────────────────────────────────────────────
  function renderFacts() {
    $$(".vsm-fact").forEach(function (el) {
      var raw = t("stat" + el.getAttribute("data-stat")).trim();
      var m = raw.match(/^([\d.,]+\+?)\s*(.*)$/);
      var n = el.querySelector(".vsm-fact-n");
      n.innerHTML = m ? esc(m[1]) + (m[2] ? '<span class="vsm-fact-u">' + esc(m[2]) + "</span>" : "") : esc(raw);
    });
  }

  function renderFigNumbers() {
    var word = window.OZ.t("ui.fig");
    $$("[data-fig]").forEach(function (el) { el.textContent = word + " " + el.getAttribute("data-fig"); });
  }

  // ── fig.1 · hero shelf: six drawers, skill cards sliding in ─────────────
  function buildShelf(force) {
    var svg = $("#vsm-shelf");
    var w = svg.parentNode.clientWidth || 1000;
    var cols = w < 520 ? 2 : (w < 820 ? 3 : 6);
    var key = cols + window.OZ.lang;
    if (!force && svg._key === key) return;
    var first = !svg._key;
    svg._key = key;
    svg.classList.toggle("is-static", !first || REDUCED);
    svg.textContent = "";

    var rows = 6 / cols, CW = 164, CH = 170, PX = 28, PT = 62;
    var W = PX * 2 + cols * CW, H = PT + rows * CH + 18;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    var r = rng(11), depts = list("c3.fig_depts"), unit = t("c3.fig_skills");

    svgEl("path", { d: wrect(6, 6, W - 12, H - 12, r, 2), "class": "vsm-frame vsm-draw", pathLength: 1, style: "--d:0s" }, svg);
    var root = t("c3.fig").split("→")[0].trim();
    svgEl("text", { x: PX, y: 38, "class": "vsm-shelf-title vsm-pop", style: "--d:.35s" }, svg).textContent = root + "  ·  80+ " + unit;
    svgEl("path", { d: wline(PX, 46, PX + 120, 47, r, 1), "class": "vsm-bracket vsm-draw", pathLength: 1, style: "--d:.5s" }, svg);

    for (var row = 0; row < rows; row++) {
      var by0 = PT + row * CH + CH - 12;
      svgEl("path", { d: wline(PX - 10, by0, W - PX + 10, by0 + 1, r, 1.6), "class": "vsm-board vsm-draw", pathLength: 1, style: "--d:" + (.3 + row * .15) + "s" }, svg);
      [PX + 14, W - PX - 14].forEach(function (bx, side) {
        var dir = side ? -1 : 1;
        svgEl("path", { d: "M" + bx + " " + (by0 + 1) + " l0 16 l" + (16 * dir) + " -16", "class": "vsm-bracket vsm-draw", pathLength: 1, style: "--d:" + (.45 + row * .15) + "s" }, svg);
      });
    }

    depts.forEach(function (name, i) {
      var c = i % cols, row = Math.floor(i / cols);
      var x = PX + c * CW, y = PT + row * CH;
      var bx = x + 10, bw = CW - 20, by = y + 50, bh = CH - 64;
      var count = DEPT_COUNTS[i];
      var n = Math.min(count, 12);
      var sp = n > 1 ? Math.min(11, (bw - 40) / (n - 1)) : 0;
      var total = (n - 1) * sp + 12;
      var sx = bx + (bw - total) / 2;
      for (var k = 0; k < n; k++) {
        var g = svgEl("g", { "class": "vsm-slide", style: "--d:" + (.8 + i * .14 + k * .04).toFixed(2) + "s" }, svg);
        var cx = sx + k * sp, rot = (r() - .5) * 8;
        var inner = svgEl("g", { transform: "rotate(" + f(rot) + " " + f(cx + 6) + " " + (by + 8) + ")" }, g);
        svgEl("rect", { x: f(cx), y: by - 28, width: 12, height: 38, rx: 1, "class": "vsm-card" }, inner);
        svgEl("path", { d: "M" + f(cx + 3) + " " + (by - 22) + " h6 M" + f(cx + 3) + " " + (by - 17) + " h4", "class": "vsm-card-line" }, inner);
      }
      var front = svgEl("g", { "class": "vsm-pop", style: "--d:" + (.5 + i * .08).toFixed(2) + "s" }, svg);
      svgEl("path", { d: wrect(bx, by, bw, bh, r, 1.3), "class": "vsm-drawer-front" }, front);
      svgEl("path", { d: wrect(bx + 10, by + 30, bw - 20, 32, r, 1), "class": "vsm-drawer-plate" }, front);
      svgEl("text", { x: bx + bw / 2, y: by + 51, "text-anchor": "middle", "class": "vsm-drawer-name" }, front).textContent = name;
      svgEl("text", { x: bx + bw - 10, y: by + 19, "text-anchor": "end", "class": "vsm-drawer-count" }, front).textContent = count + " " + unit;
      svgEl("text", { x: bx + 10, y: by + 19, "class": "vsm-drawer-count", style: "fill:var(--muted)" }, front).textContent = pad(i + 1);
      svgEl("path", { d: "M" + (bx + bw / 2 - 15) + " " + (by + 78) + " q15 11 30 0", "class": "vsm-handle" }, front);
    });
  }

  // ── fig.2 · scattered prompts → one shelf (scroll-driven) ──────────────
  var C1 = {
    w: { W: 1000, H: 480, desks: [[30, 14], [30, 168], [30, 322], [750, 14], [750, 168], [750, 322]], dw: 220, dh: 144, shelf: [385, 70, 230, 340], sw: 34, sh: 24, laptop: 1 },
    n: { W: 360, H: 690, desks: [[0, 6], [122, 6], [244, 6], [0, 536], [122, 536], [244, 536]], dw: 116, dh: 150, shelf: [62, 222, 236, 286], sw: 30, sh: 21, laptop: .6 }
  };
  var scrapState = null;
  function buildScraps(force) {
    var svg = $("#vsm-scraps");
    var w = svg.parentNode.clientWidth || 1000;
    var mode = w < 620 ? "n" : "w";
    var key = mode + window.OZ.lang;
    if (!force && svg._key === key) return;
    svg._key = key;
    svg.textContent = "";
    var L = C1[mode], r = rng(5);
    svg.setAttribute("viewBox", "0 0 " + L.W + " " + L.H);
    var depts = list("c3.fig_depts");

    // shelf
    var S = L.shelf, sx = S[0], sy = S[1], sw = S[2], sh = S[3];
    var shelfG = svgEl("g", { "class": "vsm-shelf" }, svg);
    svgEl("path", { d: wrect(sx, sy, sw, sh, r, 1.6), "class": "vsm-shelfbox" }, shelfG);
    svgEl("text", { x: sx + sw / 2, y: sy + 23, "text-anchor": "middle", "class": "vsm-shelf-title", style: "fill:var(--ink)" }, shelfG).textContent = t("c3.fig").split("→")[0].trim();
    svgEl("path", { d: wline(sx + 8, sy + 34, sx + sw - 8, sy + 34, r, .8), "class": "vsm-line vsm-line--muted" }, shelfG);
    var rowH = (sh - 34) / 3, boards = [];
    for (var j = 0; j < 3; j++) {
      var yb = sy + 34 + (j + 1) * rowH - 6;
      boards.push(yb);
      svgEl("path", { d: wline(sx + 6, yb, sx + sw - 6, yb + .5, r, .8), "class": "vsm-line" }, shelfG);
    }
    var colW = (sw - 20) / 6;

    // desks
    var scraps = [];
    L.desks.forEach(function (D, d) {
      var dx = D[0], dy = D[1], dw = L.dw, dh = L.dh;
      var top = dy + dh - 42;
      var g = svgEl("g", { "class": "vsm-desk" }, svg);
      svgEl("path", { d: wline(dx + 2, top, dx + dw - 2, top + .5, r, 1.2), "class": "vsm-line", style: "stroke-width:2" }, g);
      svgEl("path", { d: "M" + (dx + 12) + " " + top + " l-2 20 M" + (dx + dw - 12) + " " + top + " l2 20", "class": "vsm-line" }, g);
      var lw = 46 * L.laptop, lh = 30 * L.laptop, lx = dx + dw - lw - 14;
      svgEl("path", { d: wrect(lx, top - lh - 4, lw, lh, r, .8), "class": "vsm-line vsm-line--muted" }, g);
      svgEl("path", { d: wline(lx - 6, top - 2, lx + lw + 6, top - 2, r, .4), "class": "vsm-line vsm-line--muted" }, g);
      svgEl("text", { x: dx + dw / 2, y: dy + dh - 2, "text-anchor": "middle", "class": "vsm-desk-name" }, g).textContent = depts[d];

      var ax = dx + 10, aw = dw - lw - 34, ay = dy + 14, ah = top - L.sh / 2 - 8 - ay;
      for (var k = 0; k < 3; k++) {
        var x0 = ax + (k + .5) * (aw / 3) + (r() - .5) * 10;
        var y0 = ay + L.sh / 2 + r() * Math.max(4, ah - L.sh / 2);
        var rot0 = (r() - .5) * 56;
        var x1 = sx + 10 + (d + .5) * colW + (r() - .5) * 2;
        var y1 = boards[k] - L.sw / 2 - 1;
        var sg = svgEl("g", { "class": "vsm-scrap" }, svg);
        svgEl("rect", { x: -L.sw / 2, y: -L.sh / 2, width: L.sw, height: L.sh, rx: 1.5 }, sg);
        var lines = "";
        for (var q = 0; q < 3; q++) {
          var ly = -L.sh / 2 + 6 + q * (L.sh - 10) / 2.2;
          var len = (L.sw - 10) * (q === 2 ? .55 : .85 + r() * .1);
          lines += "M" + f(-L.sw / 2 + 5) + " " + f(ly) + " q" + f(len / 2) + " " + f((r() - .5) * 3) + " " + f(len) + " 0 ";
        }
        svgEl("path", { d: lines }, sg);
        scraps.push({ el: sg, x0: x0, y0: y0, r0: rot0, x1: x1, y1: y1, r1: 90 + (r() - .5) * 4, delay: 0 });
      }
    });
    // stagger order: shuffle deterministically
    var order = scraps.map(function (_, i) { return i; });
    for (var i = order.length - 1; i > 0; i--) { var z = Math.floor(r() * (i + 1)); var tmp = order[i]; order[i] = order[z]; order[z] = tmp; }
    order.forEach(function (idx, pos) { scraps[idx].delay = pos / (order.length - 1) * .42; });

    // annotation: "copied prompt" → first scrap
    var s0 = scraps[0];
    var annot = svgEl("g", { "class": "vsm-annotg" }, svg);
    var tx, ty, path;
    if (mode === "w") {
      tx = 262; ty = 46;
      path = "M" + (tx - 4) + " " + (ty - 4) + " C " + (tx - 30) + " " + (ty - 22) + ", " + (s0.x0 + 40) + " " + (s0.y0 - 26) + ", " + (s0.x0 + 18) + " " + (s0.y0 - 10);
    } else {
      tx = 8; ty = 196;
      path = "M" + (tx + 4) + " " + (ty - 14) + " C " + (tx) + " " + (ty - 40) + ", " + (s0.x0 + 12) + " " + (s0.y0 + 40) + ", " + (s0.x0 + 2) + " " + (s0.y0 + 14);
    }
    svgEl("text", { x: tx, y: ty, "class": "vsm-annot" }, annot).textContent = t("c1.fig_scrap");
    svgEl("path", { d: path, "class": "vsm-annot-line" }, annot);
    svgEl("path", { d: "M" + (mode === "w" ? (s0.x0 + 18) : (s0.x0 + 2)) + " " + (mode === "w" ? (s0.y0 - 10) : (s0.y0 + 14)) + (mode === "w" ? " l9 -1 M" + (s0.x0 + 18) + " " + (s0.y0 - 10) + " l2 -8" : " l-6 6 M" + (s0.x0 + 2) + " " + (s0.y0 + 14) + " l7 3"), "class": "vsm-annot-line" }, annot);

    scrapState = { svg: svg, scraps: scraps, annot: annot };
    updateScraps();
  }
  function updateScraps() {
    if (!scrapState) return;
    var p = 1;
    if (!REDUCED) {
      var rect = scrapState.svg.getBoundingClientRect(), vh = window.innerHeight;
      p = clamp((vh * .82 - rect.top) / (vh * .62), 0, 1);
    }
    scrapState.scraps.forEach(function (s) {
      var k = clamp((p - s.delay) / .58, 0, 1), e = ease(k);
      var x = lerp(s.x0, s.x1, e), y = lerp(s.y0, s.y1, e) - Math.sin(e * Math.PI) * 46;
      var rot = lerp(s.r0, s.r1, e);
      s.el.setAttribute("transform", "translate(" + f(x) + " " + f(y) + ") rotate(" + f(rot) + ")");
      s.el.classList.toggle("is-set", k >= 1);
    });
    scrapState.annot.style.opacity = String(clamp(1 - p * 3, 0, 1));
  }
  var scrollTick = false;
  function onScroll() {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () { scrollTick = false; updateScraps(); });
  }

  // ── fig.3 · stacked sheets ─────────────────────────────────────────────
  function initSheets() {
    var sheets = $$(".vsm-sheet");
    function activate(i) {
      sheets.forEach(function (s, k) {
        s.setAttribute("aria-pressed", String(k === i));
        s.style.setProperty("--push", k > i ? "1" : "0");
      });
    }
    sheets.forEach(function (s, i) {
      s.addEventListener("click", function () { activate(i); });
      s.addEventListener("focus", function () { activate(i); });
      s.addEventListener("keydown", function (e) {
        var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : (e.key === "ArrowLeft" || e.key === "ArrowUp") ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        sheets[(i + d + sheets.length) % sheets.length].focus();
      });
    });
    activate(0);
  }

  // ── fig.4 · marketplace tree ───────────────────────────────────────────
  function treeData() {
    var depts = list("c3.fig_depts");
    var levels = t("c3.fig").split("→").map(function (x) { return x.trim(); });
    return {
      levels: levels,
      branches: [
        { name: depts[0], n: "46", plugins: [{ name: "Java", n: 18 }, { name: "React", n: 15 }, { name: "React Native", n: 12 }, { name: "Vue", n: 1 }] },
        { name: depts[1], n: "18", plugins: [{ name: depts[1], n: 18, tags: ["Terraform", "Kubernetes", "MongoDB", "review-plugin generator"] }] },
        { name: depts[2], n: "5", plugins: [{ name: depts[2], n: 5, tags: ["Oracle", "PostgreSQL", "SQL Server"] }] },
        { name: depts[3], n: "1", plugins: [{ name: depts[3], n: 1, desc: t("c5.fig_security") }] },
        { name: depts[4], n: "6", plugins: [{ name: depts[4], n: 6, tags: ["Power BI"], desc: t("c5.fig_bi") }] },
        { name: depts[5], n: "3", plugins: [{ name: depts[5], n: 3, desc: t("c5.fig_product") }] },
        { name: t("c3.fig_company"), n: "Σ", alt: true, plugins: [{ name: t("c3.fig_company"), tags: ["usage", "tokens", "$"], meter: true, desc: list("c6.fig_values")[3] }] },
        { name: t("c3.fig_project"), n: "3", alt: true, plugins: [{ name: t("c3.fig_project"), n: 3, unit: levels[2] || "", boxes: true, desc: t("c2.fig_l3_desc") }] }
      ]
    };
  }
  var treeSel = 0;
  function buildTree() {
    var data = treeData();
    $$("#vsm-tree [data-level]").forEach(function (el) { el.textContent = data.levels[+el.getAttribute("data-level")] || ""; });
    var host = $(".vsm-tree-branches");
    host.textContent = "";
    data.branches.forEach(function (b, i) {
      if (i === 6) h("div", "vsm-tree-sep", host).setAttribute("aria-hidden", "true");
      var btn = h("button", "vsm-branch" + (b.alt ? " vsm-branch--alt" : ""), host);
      btn.type = "button";
      btn.id = "vsm-branch-" + i;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-controls", "vsm-tree-panel");
      h("span", "vsm-branch-name", btn, b.name);
      h("span", "vsm-branch-n", btn, b.n);
      btn.addEventListener("click", function () { selectBranch(i, true); });
      btn.addEventListener("keydown", function (e) {
        var keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        var n = data.branches.length, to = null;
        if (e.key in keys) to = (i + keys[e.key] + n) % n;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = n - 1;
        if (to === null) return;
        e.preventDefault();
        selectBranch(to, true);
        $("#vsm-branch-" + to).focus();
      });
    });
    $("#vsm-tree")._data = data;
    selectBranch(treeSel, false);
  }
  function selectBranch(i, animate) {
    treeSel = i;
    var data = $("#vsm-tree")._data;
    $$(".vsm-branch").forEach(function (b, k) {
      b.setAttribute("aria-selected", String(k === i));
      b.tabIndex = k === i ? 0 : -1;
    });
    var panel = $("#vsm-tree-panel");
    panel.setAttribute("aria-labelledby", "vsm-branch-" + i);
    panel.textContent = "";
    panel.classList.remove("vsm-anim");
    var unit = t("c3.fig_skills");
    data.branches[i].plugins.forEach(function (pl, pi) {
      var row = h("div", "vsm-plugin", panel);
      row.style.setProperty("--p", pi);
      var top = h("div", "vsm-plugin-top", row);
      h("span", "vsm-plugin-name", top, pl.name);
      if (pl.n) {
        var cnt = h("span", "vsm-plugin-count", top, String(pl.n));
        h("small", "", cnt, pl.unit !== undefined ? pl.unit : unit);
      }
      if (pl.tags) {
        var ul = h("ul", "vsm-plugin-tags", row);
        pl.tags.forEach(function (tg) { h("li", "", ul, tg); });
      }
      if (pl.n && !pl.meter) {
        var sk = h("div", "vsm-skills", row);
        sk.setAttribute("aria-hidden", "true");
        for (var s = 0; s < pl.n; s++) {
          var c = h("span", "vsm-skill", sk);
          c.style.setProperty("--s", s);
          if (pl.boxes) { c.style.width = "30px"; c.style.height = "24px"; }
        }
      }
      if (pl.meter) {
        var m = svgEl("svg", { "class": "vsm-meter", viewBox: "0 0 140 30", "aria-hidden": "true" }, row);
        svgEl("path", { d: "M2 26 h136 M10 26 v-8 M30 26 v-14 M50 26 v-10 M70 26 v-20 M90 26 v-12 M110 26 v-17 M130 26 v-9" }, m);
      }
      if (pl.desc) h("p", "vsm-plugin-desc", row, pl.desc);
    });
    if (animate && !REDUCED) { void panel.offsetWidth; panel.classList.add("vsm-anim"); }
    drawWires();
  }
  function drawWires() {
    var tree = $("#vsm-tree"), svg = $(".vsm-tree-wires");
    if (!tree || getComputedStyle(svg).display === "none") return;
    var R = tree.getBoundingClientRect();
    svg.setAttribute("viewBox", "0 0 " + R.width + " " + R.height);
    svg.textContent = "";
    var root = $(".vsm-tree-root").getBoundingClientRect();
    var rx = root.right - R.left, ry = root.top + root.height / 2 - R.top;
    var r = rng(3);
    var sel = null;
    $$(".vsm-branch").forEach(function (b, i) {
      var bb = b.getBoundingClientRect();
      var x2 = bb.left - R.left - 4, y2 = bb.top + bb.height / 2 - R.top;
      var mx = (rx + x2) / 2 + (r() - .5) * 6;
      var p = svgEl("path", { d: "M" + f(rx + 2) + " " + f(ry) + " C " + f(mx) + " " + f(ry) + ", " + f(mx) + " " + f(y2) + ", " + f(x2) + " " + f(y2) }, svg);
      if (i === treeSel) { p.setAttribute("class", "is-on"); sel = bb; }
    });
    if (sel) {
      var panel = $("#vsm-tree-panel").getBoundingClientRect();
      var x1 = sel.right - R.left + 8, y1 = sel.top + sel.height / 2 - R.top;
      var x3 = panel.left - R.left - 10, y3 = panel.top - R.top + 12;
      var mx2 = (x1 + x3) / 2;
      svgEl("path", { "class": "is-on", d: "M" + f(x1) + " " + f(y1) + " C " + f(mx2) + " " + f(y1) + ", " + f(mx2) + " " + f(y3) + ", " + f(x3) + " " + f(y3) }, svg);
      svgEl("path", { "class": "is-on", d: "M" + f(x3 - 7) + " " + f(y3 - 5) + " L" + f(x3) + " " + f(y3) + " L" + f(x3 - 7) + " " + f(y3 + 5) }, svg);
    }
  }

  // ── fig.5 · install stepper ────────────────────────────────────────────
  var CMDS = [
    "plugin marketplace add <company-marketplace>",
    "/plugins",
    "plugin install engineering-java",
    "/engineering-java:code-review",
    "plugin update engineering-java"
  ];
  function stepOutput(i) {
    var depts = list("c3.fig_depts"), unit = t("c3.fig_skills");
    return [
      [["", "↓ <company-marketplace>"], ["ok", "✓ <company-marketplace>"]],
      [["hl", "▸ " + depts[0] + " · 46"], ["", "  " + depts[1] + " · 18"], ["", "  " + depts[2] + " · 5   …"]],
      [["", "↓ engineering-java"], ["ok", "✓ engineering-java · 18 " + unit]],
      [["", "▸ code-review  ■■■■■■■■"], ["ok", "✓"]],
      [["", "↻ engineering-java  · semver"], ["ok", "✓ engineering-java"]]
    ][i];
  }
  var step = 0, stepTimers = [];
  function clearStepTimers() { stepTimers.forEach(clearTimeout); stepTimers = []; }
  function buildStepper() {
    var names = list("c4.fig_steps");
    var host = $(".vsm-steps");
    host.textContent = "";
    names.forEach(function (name, i) {
      var b = h("button", "vsm-step", host);
      b.type = "button";
      b.id = "vsm-step-" + i;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", "vsm-term");
      h("span", "vsm-step-no", b, pad(i + 1));
      h("span", "vsm-step-name", b, name);
      b.setAttribute("aria-label", pad(i + 1) + " " + name);
      b.addEventListener("click", function () { goStep(i, true); });
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (e.key === "Home") d = -i; if (e.key === "End") d = names.length - 1 - i;
        if (!d) return;
        e.preventDefault();
        var to = (i + d + names.length) % names.length;
        goStep(to, true);
        $("#vsm-step-" + to).focus();
      });
    });
    goStep(step, false);
  }
  function goStep(i, animate) {
    step = i;
    clearStepTimers();
    var names = list("c4.fig_steps");
    $$(".vsm-step").forEach(function (b, k) {
      b.setAttribute("aria-selected", String(k === i));
      b.tabIndex = k === i ? 0 : -1;
      b.classList.toggle("is-done", k < i);
    });
    var term = $("#vsm-term");
    term.setAttribute("aria-labelledby", "vsm-step-" + i);
    $(".vsm-term-step", term).textContent = pad(i + 1) + " / 05 — " + names[i];
    var code = $(".vsm-term-cmd code", term), out = $(".vsm-term-out", term);
    out.textContent = "";
    var lines = stepOutput(i).map(function (ln) {
      var p = h("p", ln[0], out, ln[1]);
      return p;
    });
    var cmd = CMDS[i];
    var nxt = (i + 1) % names.length;
    var nl = pad(nxt + 1) + " " + names[nxt];
    $(".vsm-next-label").textContent = nl;
    $("#vsm-next").setAttribute("aria-label", "→ " + nl);
    if (!animate || REDUCED) {
      code.textContent = cmd;
      lines.forEach(function (p) { p.classList.add("is-on"); });
      return;
    }
    code.textContent = "";
    var c = 0;
    (function type() {
      c++;
      code.textContent = cmd.slice(0, c);
      if (c < cmd.length) stepTimers.push(setTimeout(type, 22 + Math.random() * 26));
      else lines.forEach(function (p, k) { stepTimers.push(setTimeout(function () { p.classList.add("is-on"); }, 260 + k * 320)); });
    })();
  }

  // ── fig.6 · BI pipeline with approval gates ────────────────────────────
  var approved = 0;
  function buildPipe(focusGate) {
    var full = t("c5.fig_bi");
    var cut = full.lastIndexOf(",");
    var stages = (cut > 0 ? full.slice(0, cut) : full).split("→").map(function (x) { return x.trim(); });
    var approval = cut > 0 ? full.slice(cut + 1).trim() : "";
    $("#vsm-bi-cap").textContent = upperFirst(approval);
    var ol = $("#vsm-pipe");
    ol.textContent = "";
    var gates = stages.length - 1;
    approved = clamp(approved, 0, gates);
    stages.forEach(function (name, i) {
      var li = h("li", "vsm-pipe-stage", ol);
      var state = i < approved || (approved === gates && i === gates) ? "is-ok" : i === approved ? "is-live" : "";
      if (state) li.classList.add(state);
      h("span", "vsm-pipe-no", li, pad(i + 1));
      h("span", "", li, name);
      if (i < gates) {
        var gli = h("li", "vsm-pipe-gate", ol);
        var b = h("button", "vsm-gate" + (i === approved ? " is-next" : ""), gli);
        b.type = "button";
        b.setAttribute("role", "checkbox");
        b.setAttribute("aria-checked", String(i < approved));
        b.setAttribute("aria-label", upperFirst(approval) + ": " + stages[i] + " → " + stages[i + 1]);
        b.disabled = i > approved;
        b.innerHTML = '<span class="vsm-box" aria-hidden="true"><svg viewBox="0 0 14 14"><path pathLength="1" d="M2.5 7.5 L5.8 10.5 L11.5 3"/></svg></span>';
        h("span", "", b, "→ " + stages[i + 1]);
        b.addEventListener("click", function () {
          approved = i < approved ? i : i + 1;
          buildPipe(i);
        });
      }
    });
    if (focusGate !== undefined) {
      var g = $$(".vsm-gate")[focusGate];
      if (g) g.focus();
    }
  }

  // ── fig.7 · value tiles ────────────────────────────────────────────────
  function renderValues() {
    var vals = list("c6.fig_values");
    $$(".vsm-value p").forEach(function (p, i) { p.textContent = vals[i] || ""; });
  }

  // ── footer ─────────────────────────────────────────────────────────────
  function renderFooter() {
    var ul = $("#vsm-tags");
    ul.textContent = "";
    t("stack").split(",").forEach(function (s) { if (s.trim()) h("li", "", ul, s.trim()); });
    $("#vsm-credit").textContent = window.OZ.t("projects.credit").replace("{model}", MODEL);
  }

  function renderMeta() {
    document.title = t("title") + " — C. Murad Özsert";
    var d = $('meta[name="description"]');
    if (d) d.setAttribute("content", t("oneliner"));
  }

  // ── reveal on scroll ───────────────────────────────────────────────────
  function initReveal() {
    var targets = $$(".vsm-ch, .vsm-fig");
    $(".vsm-hero").classList.add("is-in");
    if (REDUCED || !("IntersectionObserver" in window)) { targets.forEach(function (x) { x.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: .18, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (x) { io.observe(x); });
  }

  // ── wiring ─────────────────────────────────────────────────────────────
  function renderText() {
    renderMeta();
    renderTitles();
    renderFacts();
    renderFigNumbers();
    renderValues();
    renderFooter();
  }
  function renderFigures(force) {
    buildShelf(force);
    buildScraps(force);
    buildTree();
    buildStepper();
    buildPipe();
  }

  function init() {
    renderText();
    renderFigures(false);
    initSheets();
    initReveal();
    $("#vsm-next").addEventListener("click", function () { goStep((step + 1) % 5, true); });

    document.addEventListener("oz:langchange", function () { renderText(); renderFigures(true); });
    window.addEventListener("scroll", onScroll, { passive: true });
    var rz;
    window.addEventListener("resize", function () {
      clearTimeout(rz);
      rz = setTimeout(function () { buildShelf(false); buildScraps(false); drawWires(); updateScraps(); }, 120);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawWires);
    var onReduce = function () {
      REDUCED = mqReduce.matches;
      if (REDUCED) $$(".vsm-ch, .vsm-fig").forEach(function (x) { x.classList.add("is-in"); });
      updateScraps();
    };
    if (mqReduce.addEventListener) mqReduce.addEventListener("change", onReduce);
  }

  window.OZ.ready.then(init);
})();
