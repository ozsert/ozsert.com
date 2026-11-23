/* Claude Sonnet 5.5 — Field Notebook. Vanilla JS, prefix vs5 */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  root.classList.add("vs5-js");
  var MODEL = "Claude Sonnet 5.5";
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var T = function (k) { return window.OZ.t(k); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var peekQuery = window.matchMedia("(min-width:1100px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)");
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---------- hand-drawn bits ---------- */
  var UL = {
    straight: "M3 8 C50 4 110 10 160 6 S250 5 297 7",
    wavy: "M3 7 q12 -7 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0",
    dashed: "M3 7 L18 6 M26 7 L48 6 M56 6 L82 7 M90 7 L116 6 M124 6 L152 7 M160 7 L186 6 M194 6 L222 7 M230 7 L258 6 M266 6 L297 7"
  };
  function ulSvg(kind) {
    return '<svg class="vs5-uls" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path d="' + (UL[kind] || UL.straight) + '"/></svg>';
  }
  var OVAL = '<svg viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true"><path class="vs5-ink" d="M52 3 C88 1 99 20 92 35 C84 53 22 55 8 36 C-2 18 26 2 66 5 C74 6 78 8 80 10"/></svg>';
  var WOB = '<svg class="vs5-wob" viewBox="0 0 400 6" preserveAspectRatio="none" aria-hidden="true"><path d="M0 3 C50 1 90 5 150 3 S250 1 300 3.5 S370 5 400 2"/></svg>';

  /* ---------- titles with a hand-underlined phrase ---------- */
  function renderTitles() {
    $$("[data-title]").forEach(function (el) {
      var txt = T(el.getAttribute("data-title")), kind = el.getAttribute("data-ul"), pre, phrase, post = "";
      var m = txt.match(/^(.*?)([.!?]*)$/), core = m[1], end = m[2];
      var ci = core.lastIndexOf(": ");
      if (ci > -1) { pre = core.slice(0, ci + 2); phrase = core.slice(ci + 2); }
      else {
        var w = core.split(" ");
        var n = w.length > 3 ? 2 : 1;
        if (w.length === 1) { pre = ""; phrase = core; }
        else { pre = w.slice(0, -n).join(" ") + " "; phrase = w.slice(-n).join(" "); }
      }
      post = end;
      el.innerHTML = esc(pre) + '<span class="vs5-ul">' + esc(phrase) + ulSvg(kind) + "</span>" + esc(post);
    });
  }

  /* ---------- hero text ---------- */
  function renderHero() {
    var h = T("hero.headline"), i = h.indexOf(". "), a = i > -1 ? h.slice(0, i + 1) : h, b = i > -1 ? h.slice(i + 2) : "";
    function dot(s) { return s.replace(/\.$/, '<span class="vs5-dotp">.</span>'); }
    var h1 = $("#vs5-h1");
    h1.innerHTML = '<span class="vs5-l1">' + dot(esc(a)) + '</span><span class="vs5-l2">' + dot(esc(b)) +
      '<svg viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true"><path class="vs5-ink" d="M2 11 C40 4 90 14 150 8 S250 4 298 9"/></svg></span>';
    // role highlights
    var role = T("hero.role"), out = "", hl = T("hero.role_highlights").split("|"), pos = [];
    hl.forEach(function (p) { var k = role.indexOf(p); if (k > -1) pos.push([k, p]); });
    pos.sort(function (x, y) { return x[0] - y[0]; });
    var cur = 0;
    pos.forEach(function (x) { out += esc(role.slice(cur, x[0])) + '<mark class="vs5-hl" style="background-color:transparent">' + esc(x[1]) + "</mark>"; cur = x[0] + x[1].length; });
    out += esc(role.slice(cur));
    $("#vs5-role").innerHTML = out;
    // manifesto circles
    var mani = T("hero.manifesto"), circ = T("hero.manifesto_circle").split("|"), mp = [];
    circ.forEach(function (p, idx) { var k = mani.indexOf(p); if (k > -1) mp.push([k, p, idx === circ.length - 1]); });
    mp.sort(function (x, y) { return x[0] - y[0]; });
    out = ""; cur = 0;
    mp.forEach(function (x) { out += esc(mani.slice(cur, x[0])) + '<span class="vs5-circ' + (x[2] ? " vs5-last" : "") + '">' + esc(x[1]) + OVAL + "</span>"; cur = x[0] + x[1].length; });
    out += esc(mani.slice(cur));
    $("#vs5-mani").innerHTML = out;
    observe($$(".vs5-circ"));
    $$(".vs5-hero .vs5-circ").forEach(function (c, n) { setTimeout(function () { c.classList.add("in"); }, 900 + n * 500); });
    requestAnimationFrame(drawArrow);
  }
  function drawArrow() {
    var svg = $("#vs5-arrow"), grid = $("#vs5-herogrid"), last = $(".vs5-last"), note = $("#vs5-note");
    if (!svg || !last || !note || getComputedStyle(svg).display === "none") return;
    var g = grid.getBoundingClientRect(), c = last.getBoundingClientRect(), n = note.getBoundingClientRect();
    var x1 = c.left + c.width / 2 - g.left, y1 = c.bottom - g.top + 6;
    var x2 = n.left - g.left - 10, y2 = n.top + 14 - g.top;
    var d = "M" + x1 + " " + y1 + " C" + x1 + " " + (y1 + 46) + " " + (x2 - 140) + " " + (y2 + 52) + " " + (x2 - 20) + " " + (y2 + 4) +
      " M" + (x2 - 14) + " " + (y2 - 7) + " L" + (x2 - 2) + " " + (y2 + 3) + " L" + (x2 - 16) + " " + (y2 + 12);
    svg.setAttribute("width", g.width); svg.setAttribute("height", g.height);
    $("path", svg).setAttribute("d", d);
  }

  /* ---------- fig. 1 scenes ---------- */
  var P = function (d, cls) { return '<path pathLength="1"' + (cls ? ' class="' + cls + '"' : "") + ' d="' + d + '"/>'; };
  function wave(y, amp, len, x0, x1) { var d = "M" + x0 + " " + y, x = x0, up = 1; while (x < x1) { d += " q" + len / 2 + " " + (-amp * up) + " " + len + " 0"; x += len; up = -up; } return d; }
  function quad(p0, p1, p2, t) { var u = 1 - t; return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]; }
  function rnd(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
  var scenes = {};
  scenes.bosphorus = (function () {
    var s = "", deck = 106;
    s += P("M0 " + deck + " H1200") + P("M0 " + (deck + 5) + " H1200");
    [300, 900].forEach(function (x) { s += P("M" + (x - 5) + " 34 V128 M" + (x + 5) + " 34 V128 M" + (x - 5) + " 58 H" + (x + 5) + " M" + (x - 5) + " 82 H" + (x + 5) + " M" + (x - 7) + " 34 H" + (x + 7)); });
    var c1 = "M300 34 Q600 176 900 34", c0 = "M0 96 Q150 90 300 34", c2 = "M900 34 Q1050 90 1200 96";
    s += P(c0) + P(c1) + P(c2);
    var h = "", i, p;
    for (i = 1; i < 20; i++) { p = quad([300, 34], [600, 176], [900, 34], i / 20); if (Math.abs(p[0] - 600) < 280) h += "M" + p[0].toFixed(0) + " " + p[1].toFixed(0) + " V" + deck + " "; }
    for (i = 1; i < 8; i++) { p = quad([0, 96], [150, 90], [300, 34], i / 8); if (p[1] < deck - 6) h += "M" + p[0].toFixed(0) + " " + p[1].toFixed(0) + " V" + deck + " "; p = quad([900, 34], [1050, 90], [1200, 96], i / 8); if (p[1] < deck - 6) h += "M" + p[0].toFixed(0) + " " + p[1].toFixed(0) + " V" + deck + " "; }
    s += P(h, "th");
    s += P(wave(136, 3, 36, 0, 1200)) + P(wave(152, 3, 44, 20, 1200)) + P(wave(168, 3, 52, 0, 1200), "th");
    s += P("M498 146 h86 l-12 14 h-62 z M514 146 v-12 h44 v12 M528 134 v-12 h10 v12 M533 118 q-4 -8 4 -12 q6 -4 3 -12") + P("M24 34 a10 10 0 1 0 .01 0");
    return s;
  })();
  scenes.galata = (function () {
    var s = "";
    s += P("M0 154 H180 M260 154 H520 M680 154 H1200");
    // tower
    s += P("M568 154 V74 L558 68 H642 L632 74 V154 M558 68 V60 H642 V68 M566 60 L600 22 L634 60 M600 22 V8 M590 108 v10 M610 108 v10 M590 130 v10 M610 130 v10 M598 86 h4 v8 h-4z");
    s += P("M572 74 H628 M570 150 H630", "th");
    // left skyline
    s += P("M60 154 V138 H120 V154 M70 138 A22 20 0 0 1 112 138 M91 118 V108 M86 108 h10 M150 154 V94 l3 -12 l3 12 V154 M150 82 V70 M200 154 V132 A34 30 0 0 1 268 132 V154 M234 102 V88 M229 88 h10 M290 154 V104 l3 -12 l3 12 V154 M290 92 V80 M330 154 V128 H390 V154 M340 128 A20 18 0 0 1 380 128 M360 110 v-8 M420 154 V120 L440 108 L460 120 V154 M480 154 V136 H520 V154");
    // right skyline
    s += P("M720 154 V132 H790 V154 M730 132 A26 24 0 0 1 782 132 M756 108 V96 M750 96 h12 M830 154 V90 l3 -12 l3 12 V154 M833 78 V66 M870 154 V126 A44 38 0 0 1 958 126 V154 M914 88 V72 M908 72 h12 M990 154 V100 l3 -12 l3 12 V154 M993 88 V76 M1030 154 V130 H1100 V154 M1042 130 A22 20 0 0 1 1086 130 M1064 110 v-8 M1130 154 V124 H1170 V154");
    s += P(wave(164, 2.5, 40, 0, 1200)) + P(wave(174, 2.5, 52, 12, 1200), "th");
    s += P("M770 40 q6 -7 12 0 q6 -7 12 0 M820 28 q5 -6 10 0 q5 -6 10 0 M440 36 q5 -6 10 0 q5 -6 10 0 M1000 44 q5 -6 10 0 q5 -6 10 0");
    return s;
  })();
  scenes.iznik = (function () {
    var s = "", i, cx;
    s += P("M0 12 H1200 M0 20 H1200 M0 160 H1200 M0 168 H1200");
    for (i = 0; i < 6; i++) {
      cx = 100 + i * 200;
      s += P("M" + (cx - 20) + " 96 Q" + (cx - 24) + " 52 " + cx + " 34 Q" + (cx + 24) + " 52 " + (cx + 20) + " 96 Q" + cx + " 116 " + (cx - 20) + " 96 Z M" + cx + " 34 V108 M" + (cx - 20) + " 96 Q" + (cx - 8) + " 62 " + cx + " 34 M" + (cx + 20) + " 96 Q" + (cx + 8) + " 62 " + cx + " 34");
      s += P("M" + cx + " 116 V150 M" + cx + " 134 Q" + (cx - 34) + " 128 " + (cx - 42) + " 100 Q" + (cx - 10) + " 106 " + cx + " 134 M" + cx + " 134 Q" + (cx + 34) + " 128 " + (cx + 42) + " 100 Q" + (cx + 10) + " 106 " + cx + " 134");
      // carnation between
      var kx = cx + 100;
      s += P("M" + (kx - 22) + " 62 l6 -12 l5 10 l5 -13 l5 13 l5 -10 l6 12 Q" + kx + " 92 " + (kx - 22) + " 62 Z M" + kx + " 84 V146 M" + kx + " 120 Q" + (kx + 26) + " 112 " + (kx + 30) + " 92") + P("M" + kx + " 130 Q" + (kx - 24) + " 124 " + (kx - 28) + " 104", "th");
      s += P("M" + (kx - 44) + " 150 c-16 -22 8 -38 20 -26 c10 10 -4 22 -12 12", "th");
    }
    return s;
  })();
  scenes.tulip = (function () {
    var s = "", i, x, h, w;
    s += P(wave(166, 2, 60, 0, 1200), "th");
    for (i = 0; i < 26; i++) {
      x = 24 + i * 45 + (rnd(i) - .5) * 16; h = 44 + rnd(i + 3) * 60; w = 11 + rnd(i + 7) * 4;
      var by = 166, ty = by - 40 - h * .8, sway = (rnd(i + 9) - .5) * 14;
      s += P("M" + x + " " + by + " Q" + (x + sway) + " " + (by - 40) + " " + (x + sway) + " " + (ty + 28));
      var hx = x + sway;
      s += P("M" + (hx - w) + " " + (ty + 30) + " Q" + (hx - w - 3) + " " + (ty + 6) + " " + hx + " " + ty + " Q" + (hx + w + 3) + " " + (ty + 6) + " " + (hx + w) + " " + (ty + 30) + " Q" + hx + " " + (ty + 42) + " " + (hx - w) + " " + (ty + 30) + " Z M" + hx + " " + ty + " V" + (ty + 34));
      if (i % 3 === 0) s += P("M" + x + " " + (by - 22) + " q" + (-22) + " -8 " + (-28) + " -34 q22 4 28 34", "th");
    }
    return s;
  })();
  scenes.saffron = (function () {
    var s = "", i, x;
    s += P("M0 166 H1200");
    for (i = 0; i < 5; i++) {
      x = 120 + i * 240;
      s += P("M" + (x - 78) + " 100 A78 62 0 0 1 " + (x + 78) + " 100 M" + x + " 38 V22 M" + (x - 5) + " 28 h10 M" + (x - 78) + " 100 H" + (x + 78) + " V134 M" + (x - 78) + " 134 V100");
      s += P("M" + (x - 52) + " 134 V118 A18 18 0 0 1 " + (x - 16) + " 118 V134 M" + (x + 16) + " 134 V118 A18 18 0 0 1 " + (x + 52) + " 118 V134");
      s += P("M" + (x - 56) + " 168 Q" + (x - 30) + " 140 " + x + " 134 Q" + (x + 30) + " 140 " + (x + 56) + " 168", "th");
      s += P("M" + (x - 22) + " 156 h.1 M" + (x - 8) + " 150 h.1 M" + (x + 10) + " 154 h.1 M" + (x + 24) + " 160 h.1 M" + (x - 12) + " 162 h.1", "th");
      if (i < 4) s += P("M" + (x + 78) + " 100 Q" + (x + 120) + " 76 " + (x + 162) + " 100 M" + (x + 120) + " 76 V100 M" + (x + 120) + " 100 v14 m-4 0 h8 l-2 10 h-4 z", "th");
    }
    return s;
  })();
  scenes.olive = (function () {
    var s = "", i, x, y, a, N = 30;
    function my(x) { return 100 + Math.sin(x / 190) * 28 - x * .012; }
    var d = "M-10 " + my(-10).toFixed(1);
    for (x = 20; x <= 1210; x += 30) d += " L" + x + " " + my(x).toFixed(1);
    s += P(d);
    s += P("M0 120 Q70 140 130 168 M0 112 Q50 130 90 150", "th");
    for (i = 0; i < N; i++) {
      x = 40 + i * 39; y = my(x); var up = i % 2 ? 1 : -1; a = (up * (-.9 - rnd(i) * .35));
      var L = 58 + rnd(i + 5) * 14, ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L, mx = (x + ex) / 2, my2 = (y + ey) / 2, nx = -Math.sin(a) * 12, ny = Math.cos(a) * 12;
      s += P("M" + x.toFixed(0) + " " + y.toFixed(0) + " Q" + (mx + nx).toFixed(0) + " " + (my2 + ny).toFixed(0) + " " + ex.toFixed(0) + " " + ey.toFixed(0) + " Q" + (mx - nx).toFixed(0) + " " + (my2 - ny).toFixed(0) + " " + x.toFixed(0) + " " + y.toFixed(0) + " M" + x.toFixed(0) + " " + y.toFixed(0) + " L" + (x + (ex - x) * .8).toFixed(0) + " " + (y + (ey - y) * .8).toFixed(0), i % 3 === 1 ? "th" : "");
      if (i % 4 === 2) { var ox = x + 10, oy = y + 20; s += P("M" + x + " " + y + " Q" + (x + 4) + " " + (y + 8) + " " + ox + " " + (oy - 8) + " M" + (ox - 7) + " " + oy + " a7 10 0 1 0 14 0 a7 10 0 1 0 -14 0"); }
    }
    return s;
  })();
  var ACCENT_IDS = ["bosphorus", "galata", "iznik", "tulip", "saffron", "olive"];
  function buildScenes() {
    var box = $("#vs5-fig1");
    ACCENT_IDS.forEach(function (id) {
      box.insertAdjacentHTML("beforeend", '<svg class="vs5-scene" data-id="' + id + '" viewBox="0 0 1200 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + scenes[id] + "</svg>");
    });
  }
  function showScene() {
    var id = window.OZ.accent;
    $$(".vs5-scene").forEach(function (s) { s.classList.remove("on"); });
    var sc = $('.vs5-scene[data-id="' + id + '"]');
    if (sc) { void sc.getBoundingClientRect(); sc.classList.add("on"); }
    $("#vs5-fig1-cap").textContent = T("ui.fig") + " 1 — " + T("hero.fig." + id);
  }

  /* ---------- rows ---------- */
  function row(opts) {
    var li = doc.createElement("li");
    li.innerHTML = '<a class="vs5-row ' + (opts.cls || "") + '" href="' + esc(opts.href) + '"' + (opts.ext ? ' target="_blank" rel="noopener"' : "") + (opts.img ? ' data-img="' + esc(opts.img) + '"' : "") + ">" +
      '<span class="vs5-rn">' + esc(opts.n) + "</span>" +
      '<span class="vs5-rtxt"><span class="vs5-rt">' + esc(opts.title) + '</span><span class="vs5-rd">' + esc(opts.desc || "") + "</span>" +
      (opts.img ? '<span class="vs5-thumb" aria-hidden="true"><span class="vs5-duo"><img loading="lazy" alt="" width="400" height="300" src="' + esc(opts.img) + '"></span></span>' : "") + "</span>" +
      (opts.stamp ? '<span class="vs5-stamp">' + esc(opts.stamp) + "</span>" : "") +
      (opts.status ? '<span class="vs5-rs">' + esc(opts.status) + "</span>" : "") +
      (opts.date ? '<span class="vs5-pdate">' + esc(opts.date) + "</span>" : "") +
      '<span class="vs5-ra" aria-hidden="true">→</span></a>' + WOB;
    return li;
  }
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  function renderProjects() {
    var ul = $("#vs5-projects"); ul.innerHTML = "";
    T("projects.order").split(",").forEach(function (s, i) {
      s = s.trim();
      var kind = T("project." + s + ".kind"), li = row({
        href: "/models/claude-sonnet-5-5/projects/" + s + "/", n: pad(i + 1), title: T("project." + s + ".title"), desc: T("project." + s + ".oneliner"),
        stamp: kind, status: T("project." + s + ".status") + " · " + T("project." + s + ".year")
      });
      ul.appendChild(li);
    });
  }
  function renderTalks() {
    var ul = $("#vs5-talks"); ul.innerHTML = "";
    T("talks.featured").split(",").forEach(function (s, i) {
      s = s.trim();
      ul.appendChild(row({
        href: "/models/claude-sonnet-5-5/talks/#" + s, n: pad(i + 1), title: T("talk." + s + ".title"), desc: T("talk." + s + ".subtitle"),
        stamp: T("ui.vol") + T("talk." + s + ".vol"), img: T("talk." + s + ".image")
      }));
    });
  }
  var posts = null, postsErr = false;
  function fmtDate(d) {
    var dt = new Date(d); if (isNaN(dt)) return "";
    return dt.toLocaleDateString(window.OZ.lang === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function renderPosts() {
    var ul = $("#vs5-posts");
    if (postsErr) { ul.innerHTML = '<li><p class="vs5-state">' + esc(T("newsletter.error")) + "</p></li>"; return; }
    if (!posts) { ul.innerHTML = '<li><p class="vs5-state">' + esc(T("newsletter.loading")) + "</p></li>"; return; }
    ul.innerHTML = "";
    if (!posts.length) { ul.innerHTML = '<li><p class="vs5-state">' + esc(T("newsletter.error")) + "</p></li>"; return; }
    posts.forEach(function (p, i) {
      var ex = String(p.excerpt || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      ul.appendChild(row({ href: p.link, ext: true, cls: "vs5-row-post", n: pad(i + 1), title: p.title, desc: ex, date: fmtDate(p.date), img: p.image || "" }));
    });
    bindPeek($("#vs5-newszone"));
  }
  function loadPosts() {
    window.OZ.latestPosts(3).then(function (r) { posts = r || []; postsErr = false; renderPosts(); })
      .catch(function () { postsErr = true; renderPosts(); });
  }

  /* ---------- hover pictures ---------- */
  function bindPeek(zone) {
    if (!zone) return;
    var peek = $(".vs5-peek", zone), img = $("img", peek);
    function show(a) {
      if (!peekQuery.matches || root.classList.contains("vs5-calm")) return;
      var src = a.getAttribute("data-img"); if (!src) { peek.classList.remove("on"); return; }
      if (img.getAttribute("src") !== src) img.setAttribute("src", src);
      var zr = zone.getBoundingClientRect(), ar = a.getBoundingClientRect();
      var top = ar.top - zr.top + ar.height / 2 - peek.offsetHeight / 2 || 0;
      top = Math.max(0, Math.min(top, zr.height - (peek.offsetHeight || 220)));
      peek.style.top = top + "px"; peek.classList.add("on");
    }
    function hide() { peek.classList.remove("on"); }
    $$("a.vs5-row", zone).forEach(function (a) {
      a.addEventListener("mouseenter", function () { show(a); });
      a.addEventListener("focus", function () { show(a); });
      a.addEventListener("mouseleave", hide); a.addEventListener("blur", hide);
    });
    zone.addEventListener("mouseleave", hide);
  }

  /* ---------- now / founder / experience ---------- */
  function renderStats() {
    $$("[data-stat]").forEach(function (el) {
      var s = T(el.getAttribute("data-stat")).trim();
      if (s.indexOf("→") > -1) {
        var p = s.split("→");
        el.innerHTML = "<s>" + esc(p[0].trim()) + '</s><span aria-hidden="true">→</span><span class="vs5-circ">' + esc(p[1].trim()) + OVAL + "</span>";
        el.setAttribute("aria-label", s);
        observe($$(".vs5-circ", el));
      } else {
        var i = s.indexOf(" ");
        el.innerHTML = i > -1 ? esc(s.slice(0, i)) + '<span class="u">' + esc(s.slice(i + 1)) + "</span>" : esc(s);
      }
    });
  }
  function renderMatrix() {
    var svg = $("#vs5-matrix"), h = "", i, r, c;
    for (i = 0; i < 110; i++) { r = Math.floor(i / 22); c = i % 22; h += '<circle class="d" style="--i:' + i + '" cx="' + (8 + c * 10.4) + '" cy="' + (12 + r * 16) + '" r="3.1"/>'; }
    svg.innerHTML = h;
  }
  var SEG = [ // key, start, end, kind
    ["r7", 2008, 2012, ""], ["r6", 2012, 2014, ""], ["r5", 2014, 2015, ""], ["r4", 2015, 2020, ""], ["r3", 2020.25, 2025.25, "is-y"], ["r2", 2025.45, 2026.1, ""], ["r1", 2026.1, 2026.95, "is-n"]
  ];
  function renderExperience() {
    var A = 2008, B = 2027, pct = function (y) { return ((y - A) / (B - A) * 100).toFixed(2); }, h = "";
    var lv = { r7: 0, r6: 1, r5: 0, r4: 1, r3: 0, r2: 1, r1: 0 };
    SEG.forEach(function (s) {
      h += '<span class="vs5-seg ' + s[3] + '" style="left:' + pct(s[1]) + "%;width:" + (pct(s[2]) - pct(s[1])).toFixed(2) + '%"></span>';
      var below = lv[s[0]] === 1;
      var right = s[0] === "r1" || s[0] === "r2";
      h += '<span class="vs5-seg-l ' + (s[3] === "is-y" ? "is-y" : "") + '" style="' + (right ? "right:" + (100 - pct(s[0] === "r1" ? B : s[2])).toFixed(2) + "%;border-left:0;border-right:1.5px solid var(--ink);padding:0 6px 0 0;text-align:right;" : "left:" + pct(s[1]) + "%;") + "top:" + (below ? 8 : 8 + 0) + 'px;' + (below ? "margin-top:0;" : "") + '">' + esc(T("experience." + s[0] + ".org")) + "</span>";
    });
    [2008, 2012, 2016, 2020, 2024].forEach(function (y) { h += '<span class="vs5-tick" style="left:' + pct(y) + '%">' + y + "</span>"; });
    var box = $("#vs5-bar-box"); box.innerHTML = h;
    // stagger label rows (levels) so short segments don't collide
    $$(".vs5-seg-l", box).forEach(function (l, i) { l.style.top = [4, 28, 4, 28, 4, 28, 4][i] + "px"; });
    // rows
    var ul = $("#vs5-xrows"); ul.innerHTML = "";
    for (var i = 1; i <= 8; i++) {
      var yrs = T("experience.r" + i + ".years"), yh = esc(yrs), m = yrs.match(/—\s*(Now|Bugün)$/);
      if (m) { var k = yrs.lastIndexOf(m[1]); yh = esc(yrs.slice(0, k)) + '<span class="vs5-circ">' + esc(m[1]) + OVAL + "</span>"; }
      var li = doc.createElement("li");
      li.className = "vs5-rv";
      li.innerHTML = '<div class="vs5-xrow' + (i === 3 ? " is-y" : "") + '"><p class="o">' + esc(T("experience.r" + i + ".org")) + '</p><p class="y">' + yh + '</p><p class="r">' + esc(T("experience.r" + i + ".role")) + "</p></div>" + WOB;
      li.style.position = "relative";
      ul.appendChild(li);
    }
    observe($$(".vs5-rv", ul)); observe($$(".vs5-circ", ul));
  }
  function renderNoise() {
    var svg = $("#vs5-noise"), h = "", i, x, y = 55, d = "M0 55";
    var n = "M0 55";
    for (x = 0; x <= 150; x += 5) { y = 55 + (rnd(x + 1) - .5) * 70; n += " L" + x + " " + y.toFixed(1); }
    h += '<path class="n" d="' + n + '"/>';
    h += P_("M150 55 C170 55 175 20 195 20 S215 90 235 90 S255 38 270 38 S285 55 300 55");
    svg.innerHTML = h;
  }
  function P_(d) { return '<path class="vs5-dr" pathLength="1" d="' + d + '"/>'; }

  /* ---------- ink picker, toggles ---------- */
  function renderPickers() {
    var OZ = window.OZ, lang = OZ.lang;
    $$("[data-picker]").forEach(function (p) {
      var cur = OZ.accents.filter(function (a) { return a.id === OZ.accent; })[0];
      var h = '<span class="vs5-ink-l">' + esc(T("ui.ink")) + " · <b>" + esc(cur.name[lang]) + "</b></span>";
      OZ.accents.forEach(function (a) {
        h += '<button type="button" class="vs5-dotbtn" data-id="' + a.id + '" style="--cl:' + a.light + ";--cd:" + a.dark + '" aria-pressed="' + (a.id === OZ.accent) + '" aria-label="' + esc(T("ui.ink") + ": " + a.name.tr + " / " + a.name.en) + '" title="' + esc(a.name[lang]) + '"></button>';
      });
      p.innerHTML = h;
    });
  }
  var trailOn = store("vs5-trail") !== "0", calmOn = store("vs5-calm") === "1";
  function renderToggles() {
    $$('[data-tog="trail"]').forEach(function (b) { b.innerHTML = esc(T("ui.pen_trail")) + " <b>" + esc(trailOn ? T("ui.on") : T("ui.off")) + "</b>"; b.setAttribute("aria-pressed", trailOn); });
    $$('[data-tog="calm"]').forEach(function (b) { b.innerHTML = esc(T("ui.calm_motion")) + " <b>" + esc(calmOn ? T("ui.on") : T("ui.off")) + "</b>"; b.setAttribute("aria-pressed", calmOn); });
    root.classList.toggle("vs5-calm", calmOn);
  }

  /* ---------- reveal ---------- */
  var io = null;
  function observe(els) {
    if (!els.length) return;
    if (!io) {
      io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); if (e.target.id === "vs5-newszone") {} } });
      }, { threshold: .12, rootMargin: "0px 0px -6% 0px" }) : null;
    }
    els.forEach(function (el) { if (el.classList.contains("in")) return; if (io) io.observe(el); else el.classList.add("in"); });
  }

  /* ---------- pen trail ---------- */
  function trail() {
    var cv = $(".vs5-trail"), ctx = cv.getContext("2d"), pts = [], raf = 0;
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) { cv.style.display = "none"; return; }
    function size() { var r = window.devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; ctx.setTransform(r, 0, 0, r, 0, 0); }
    size(); addEventListener("resize", size);
    function loop() {
      var now = performance.now();
      ctx.clearRect(0, 0, cv.width, cv.height);
      pts = pts.filter(function (p) { return now - p.t < 700; });
      if (pts.length > 1) {
        ctx.strokeStyle = getComputedStyle(root).getPropertyValue("--ink").trim() || "#888";
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        for (var i = 1; i < pts.length; i++) {
          var a = 1 - (now - pts[i].t) / 700;
          ctx.globalAlpha = Math.max(0, a) * .45; ctx.lineWidth = 1 + a * 2.2;
          ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
        }
      }
      raf = pts.length ? requestAnimationFrame(loop) : 0;
    }
    addEventListener("mousemove", function (e) {
      if (!trailOn || calmOn || rmQuery.matches) return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* ---------- init ---------- */
  function renderAll() {
    renderTitles(); renderHero(); renderProjects(); renderTalks(); renderPosts(); renderStats(); renderExperience(); renderPickers(); renderToggles();
    renderMatrix(); renderNoise();
    $("#vs5-credit").textContent = T("ui.credit").replace("{model}", MODEL);
    var mail = window.OZ.email();
    $$("[data-oz-email-subject]").forEach(function (a) { a.href = "mailto:" + mail; });
    $("#vs5-copy span").textContent = T("ui.copy");
    showCaption();
    bindPeek($("#vs5-talkzone")); bindPeek($("#vs5-newszone"));
    observe($$(".vs5-rv")); observe($$(".vs5-bigname"));
    var nz = $(".vs5-clip-r"); if (nz) { nz.classList.add("vs5-in-draw"); }
  }
  function showCaption() { var id = window.OZ.accent; $("#vs5-fig1-cap").textContent = T("ui.fig") + " 1 — " + T("hero.fig." + id); }

  window.OZ.ready.then(function () {
    buildScenes();
    renderAll();
    showScene();
    loadPosts();
    trail();
    doc.addEventListener("oz:langchange", function () { renderAll(); setTimeout(drawArrow, 60); });
    doc.addEventListener("oz:accentchange", function () { showScene(); renderPickers(); });
    doc.addEventListener("oz:themechange", function () { renderPickers(); });
    addEventListener("resize", function () { drawArrow(); });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(drawArrow);
    doc.addEventListener("click", function (e) {
      var b = e.target.closest(".vs5-dotbtn");
      if (b) { window.OZ.setAccent(b.getAttribute("data-id")); return; }
      var t = e.target.closest("[data-tog]");
      if (t) {
        if (t.getAttribute("data-tog") === "trail") { trailOn = !trailOn; store("vs5-trail", trailOn ? "1" : "0"); }
        else { calmOn = !calmOn; store("vs5-calm", calmOn ? "1" : "0"); }
        renderToggles(); return;
      }
      var s = e.target.closest("[data-scroll]");
      if (s) {
        var tg = doc.querySelector(s.getAttribute("href"));
        if (tg) { e.preventDefault(); tg.scrollIntoView({ behavior: (rmQuery.matches || calmOn) ? "auto" : "smooth", block: "start" }); history.replaceState(null, "", s.getAttribute("href")); }
      }
      if (e.target.closest("#vs5-copy")) {
        var btn = $("#vs5-copy span"), addr = window.OZ.email();
        var done = function () { btn.textContent = T("ui.copied"); setTimeout(function () { btn.textContent = T("ui.copy"); }, 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(addr).then(done, done); else done();
      }
    });
  });
})();
