/* ozsert.com — homepage, interpreted by Claude Opus 5.5
   Vanilla JS. Everything visible comes from OZ.t(); this file only adds structure and ink. */
(function () {
  "use strict";

  var MODEL_NAME = "Claude Opus 5.5";
  var SVGNS = "http://www.w3.org/2000/svg";
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var mqWide = window.matchMedia("(min-width: 1181px)");
  var mqMobile = window.matchMedia("(max-width: 760px)");

  var state = {
    calm: load("vo55-calm") === "1",
    trail: load("vo55-trail") !== "0",
    posts: null,        // null = loading, [] = error/empty, [..] = ok
    postsErr: false
  };

  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function t(k) { return window.OZ ? OZ.t(k) : ""; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function still() { return mqReduce.matches || state.calm; }
  function rng(seed) { // mulberry32
    var a = seed >>> 0;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var r = Math.imul(a ^ a >>> 15, 1 | a); r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r; return ((r ^ r >>> 14) >>> 0) / 4294967296; };
  }
  function r1(n) { return Math.round(n * 10) / 10; }
  function figLabel(n) { return t("ui.fig") + " " + n; }
  function volLabel(v) { var p = t("ui.vol"); return p + (/\.$/.test(p) ? "" : " ") + v; }

  /* ================================================================ hand-drawn bits */
  var UL = {
    straight: '<path d="M2 7.2C40 5.6 90 8.2 140 6.4S186 5.4 198 6"/>',
    sweep: '<path d="M1 8.5C30 6.2 70 5.4 110 6.1S170 7.6 199 3.2"/>',
    wave: (function () { var d = "M1 6"; for (var i = 0; i < 10; i++) { var x = 1 + i * 19.8; d += " Q" + r1(x + 4.95) + " " + (i % 2 ? 9.5 : 2.5) + " " + r1(x + 9.9) + " 6 T" + r1(x + 19.8) + " 6"; } return '<path d="' + d + '"/>'; })(),
    dash: '<path d="M2 6.6C50 5.4 120 7.6 198 5.8" style="stroke-dasharray:7 6"/>',
    double: '<path d="M2 4.6C60 3.4 130 5.8 198 4.2"/><path style="--delay:.5s" d="M14 9.4C70 8.2 140 10.2 190 8.8"/>',
    scribble: '<path d="M2 7.5C50 4.5 120 8 196 4.8"/><path style="--delay:.55s" d="M196 4.8C150 8.6 70 10.4 26 10.2"/>'
  };
  function ulSpan(text, style) {
    return '<span class="vo55-ul vo55-draw">' + esc(text) +
      '<svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true" focusable="false">' + (UL[style] || UL.straight) + "</svg></span>";
  }
  var CIRCLE = '<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M86 7C70 -0.5 24 0.5 8 11C-3 19 6 35 40 37.5C74 40 99 31 97 18C95.5 9 80 3.5 58 3.2"/></svg>';

  // Wrap each phrase (exact substring) with a wrapper. Returns HTML.
  function markPhrases(text, phrases, wrap) {
    var marks = [];
    phrases.forEach(function (p, i) {
      p = (p || "").trim();
      if (!p) return;
      var at = text.indexOf(p);
      if (at >= 0) marks.push({ at: at, len: p.length, i: i, last: i === phrases.length - 1 });
    });
    marks.sort(function (a, b) { return a.at - b.at; });
    var out = "", pos = 0;
    marks.forEach(function (m) {
      if (m.at < pos) return;
      out += esc(text.slice(pos, m.at)) + wrap(text.substr(m.at, m.len), m);
      pos = m.at + m.len;
    });
    return out + esc(text.slice(pos));
  }

  // Title with the last word (or two) underlined by hand and the final period as an accent dot.
  function titleHTML(text, style) {
    var dot = /\.$/.test(text);
    var body = dot ? text.slice(0, -1) : text;
    var words = body.split(" ");
    var take = words.length > 1 && words[words.length - 1].length < 5 ? 2 : 1;
    var head = words.slice(0, words.length - take).join(" ");
    var tail = words.slice(words.length - take).join(" ");
    return (head ? esc(head) + " " : "") + '<span class="vo55-nw">' + ulSpan(tail, style) + (dot ? '<span class="vo55-dot" aria-hidden="true"></span>' : "") + "</span>";
  }

  /* ================================================================ hero */
  function renderHero() {
    var k = t("hero.kicker").split(" · ");
    $(".vo55-kicker-l").textContent = k[0] || "";
    $(".vo55-kicker-city").textContent = k[1] || "";

    var h = t("hero.headline");
    var lines = h.replace(/\.\s+/g, ".\n").split("\n");
    var html = "";
    lines.forEach(function (ln, i) {
      if (i < lines.length - 1) { html += '<span class="vo55-line">' + esc(ln) + "</span> "; return; }
      var dot = /\.$/.test(ln), body = dot ? ln.slice(0, -1) : ln;
      var w = body.split(" "), cut = Math.max(0, w.length - 2);
      var head = w.slice(0, cut).join(" "), tail = w.slice(cut).join(" ");
      html += '<span class="vo55-line">' + (head ? esc(head) + " " : "") + '<span class="vo55-nw">' + ulSpan(tail, "sweep") + (dot ? '<span class="vo55-dot" aria-hidden="true"></span>' : "") + "</span></span>";
    });
    var h1 = $(".vo55-h1");
    h1.innerHTML = html;
    h1.setAttribute("aria-label", h);

    $(".vo55-role").innerHTML = markPhrases(t("hero.role"), t("hero.role_highlights").split("|"), function (s) {
      return '<mark class="vo55-hl">' + esc(s) + "</mark>";
    });
    $(".vo55-manifesto").innerHTML = markPhrases(t("hero.manifesto"), t("hero.manifesto_circle").split("|"), function (s, m) {
      return '<span class="vo55-circ vo55-draw"' + (m.last ? ' id="vo55-circ-last"' : "") + ">" + esc(s) + CIRCLE + "</span>";
    });
    $(".vo55-fig1-n").textContent = figLabel(1);
    $(".vo55-fig1-cap").textContent = t("hero.fig." + OZ.accent);
  }

  function renderTitles() {
    $$("[data-title]").forEach(function (el) {
      el.innerHTML = titleHTML(t(el.getAttribute("data-title")), el.getAttribute("data-ul"));
    });
  }

  /* ================================================================ margin arrow (circled word → note) */
  function drawArrow() {
    var svg = $(".vo55-arrow"), grid = $(".vo55-hero-grid"), from = $("#vo55-circ-last"), note = $("#vo55-note");
    if (!svg || !from || !note || mqMobile.matches) return;
    var portrait = $(".vo55-portrait"), man = $(".vo55-manifesto");
    note.style.marginTop = "";
    var nat = note.getBoundingClientRect().top, want = man.getBoundingClientRect().bottom - 30;
    var pb = portrait.getBoundingClientRect().bottom;
    note.style.marginTop = Math.max(28, want - pb) + "px";
    if (Math.abs(nat - note.getBoundingClientRect().top) > 1) queueLayout();
    var g = grid.getBoundingClientRect(), a = from.getBoundingClientRect(), b = note.getBoundingClientRect();
    if (!b.width) return;
    var sx = a.right - a.width * .18 - g.left, sy = a.bottom + 4 - g.top;
    var ex = b.left - g.left - 12, ey = b.top - g.top + 10;
    var c1x = sx + 22, c1y = sy + 24;
    var c2x = ex - 150, c2y = Math.max(ey, sy) + 10;
    var paths = svg.querySelectorAll("path");
    paths[0].setAttribute("d", "M" + r1(sx) + " " + r1(sy) + " C" + r1(c1x) + " " + r1(c1y) + " " + r1(c2x) + " " + r1(c2y) + " " + r1(ex) + " " + r1(ey));
    var ang = Math.atan2(ey - c2y, ex - c2x), L = 10;
    var h1x = ex - L * Math.cos(ang - .45), h1y = ey - L * Math.sin(ang - .45);
    var h2x = ex - L * Math.cos(ang + .45), h2y = ey - L * Math.sin(ang + .45);
    paths[1].setAttribute("d", "M" + r1(h1x) + " " + r1(h1y) + " L" + r1(ex) + " " + r1(ey) + " L" + r1(h2x) + " " + r1(h2y));
  }

  /* ================================================================ fig. 1 — six accent scenes */
  function P(d, cls) { return '<path pathLength="1" d="' + d + '"' + (cls ? ' class="' + cls + '"' : "") + "/>"; }
  function waves(rand, n, x0, x1, y0, y1, w) {
    var s = "";
    for (var i = 0; i < n; i++) {
      var x = r1(x0 + rand() * (x1 - x0)), y = r1(y0 + rand() * (y1 - y0)), ww = w * (.6 + rand() * .8);
      s += P("M" + x + " " + y + " q" + r1(ww / 4) + " -3 " + r1(ww / 2) + " 0 t" + r1(ww / 2) + " 0", "vo55-soft");
    }
    return s;
  }
  function gull(x, y, s) { s = s || 1; return P("M" + x + " " + y + " q" + 6 * s + " " + -6 * s + " " + 12 * s + " 0 q" + 6 * s + " " + -6 * s + " " + 12 * s + " 0"); }
  function house(x, base, w, h, roof) {
    var s = P("M" + x + " " + base + " V" + (base - h) + " H" + (x + w) + " V" + base);
    if (roof) s += P("M" + (x - 3) + " " + (base - h) + " L" + (x + w / 2) + " " + (base - h - roof) + " L" + (x + w + 3) + " " + (base - h));
    for (var wy = base - h + 8; wy < base - 8; wy += 12) for (var wx = x + 5; wx < x + w - 5; wx += 9) s += P("M" + wx + " " + wy + " v4", "vo55-soft");
    return s;
  }
  function minaret(x, base, top) {
    return P("M" + (x - 3) + " " + base + " V" + (top + 12) + " M" + (x + 3) + " " + base + " V" + (top + 12)) +
      P("M" + (x - 5) + " " + (top + 26) + " H" + (x + 5)) +
      P("M" + (x - 3) + " " + (top + 12) + " L" + x + " " + top + " L" + (x + 3) + " " + (top + 12));
  }
  function dome(cx, base, r) { return P("M" + (cx - r) + " " + base + " A" + r + " " + r + " 0 0 1 " + (cx + r) + " " + base) + P("M" + cx + " " + (base - r) + " v-8"); }

  var SCENES = {
    bosphorus: function () {
      var rand = rng(11), s = "";
      // banks
      s += P("M0 118 C40 110 90 112 130 128 C160 140 190 166 232 192");
      s += P("M1200 108 C1160 100 1100 110 1062 130 C1030 148 1000 170 962 192");
      s += P("M0 150 C30 146 60 150 90 160", "vo55-soft") + P("M1200 146 C1170 142 1140 148 1110 160", "vo55-soft");
      // European side: a mosque and houses
      s += dome(66, 112, 15) + minaret(40, 116, 70) + minaret(92, 116, 74);
      s += house(112, 132, 16, 12, 6) + house(140, 146, 14, 10, 5);
      // Asian side: houses + trees
      s += house(1080, 124, 18, 14, 6) + house(1112, 114, 16, 12, 6) + house(1150, 106, 18, 10, 5);
      s += P("M1040 140 c-10 -2 -10 -16 0 -18 c2 -10 16 -10 16 0 c10 2 8 18 -2 18 z M1048 140 v8") ;
      // towers
      [330, 870].forEach(function (x) {
        s += P("M" + (x - 10) + " 198 L" + (x - 8) + " 34 M" + (x + 10) + " 198 L" + (x + 8) + " 34");
        s += P("M" + (x - 9) + " 38 H" + (x + 9) + " M" + (x - 9) + " 86 H" + (x + 9) + " M" + (x - 10) + " 176 H" + (x + 10));
      });
      // deck
      s += P("M150 140 L1050 140") + P("M150 146 L1050 146");
      // cables
      s += P("M330 36 Q600 214 870 36") + P("M330 36 Q238 108 150 140") + P("M870 36 Q962 108 1050 140");
      for (var x = 348; x < 860; x += 18) {
        var tt = (x - 330) / 540, y = (1 - tt) * (1 - tt) * 36 + 2 * tt * (1 - tt) * 214 + tt * tt * 36;
        if (140 - y > 4) s += P("M" + x + " " + r1(y) + " V140", "vo55-soft");
      }
      [[180, 128], [215, 116], [250, 100], [285, 80], [915, 80], [950, 100], [985, 116], [1020, 128]].forEach(function (h) { s += P("M" + h[0] + " " + h[1] + " V140", "vo55-soft"); });
      // water
      s += P("M0 200 C200 196 420 203 600 199 S1000 196 1200 200");
      s += waves(rand, 16, 40, 1140, 208, 232, 22);
      // ferry
      s += P("M540 214 L652 214 L640 228 L554 228 Z") + P("M560 214 V202 H628 V214") + P("M570 208 h6 M586 208 h6 M602 208 h6 M618 208 h4", "vo55-soft");
      s += P("M606 202 V190 H616 V202") + P("M611 186 C604 176 620 170 612 160 C606 152 618 146 614 136", "vo55-soft");
      s += P("M656 222 C690 220 724 225 770 221", "vo55-soft") + P("M652 228 C700 231 742 228 800 231", "vo55-soft");
      // sky
      s += '<circle pathLength="1" cx="1010" cy="46" r="17" class="vo55-soft"/>';
      s += gull(470, 60) + gull(500, 72, .7) + gull(720, 52, .8);
      return s;
    },

    galata: function () {
      var rand = rng(23), s = "";
      // hill of Galata / Karaköy
      s += P("M0 186 C120 176 220 152 300 144 C360 138 420 140 480 150 C560 164 640 180 720 188");
      // tower
      s += P("M336 146 L340 64 M384 146 L380 64");
      s += P("M332 64 H388 M330 56 H390");
      for (var gx = 334; gx < 388; gx += 8) s += P("M" + gx + " 64 V60 Q" + (gx + 3) + " 57 " + (gx + 6) + " 60 V64", "vo55-soft");
      s += P("M330 56 Q350 34 360 8 Q370 34 390 56") + P("M360 8 V-2") + P("M344 40 Q360 34 376 40", "vo55-soft");
      [[352, 86], [366, 86], [352, 112], [366, 112], [359, 132]].forEach(function (w) { s += P("M" + w[0] + " " + (w[1] + 10) + " V" + (w[1] + 3) + " Q" + (w[0] + 3) + " " + w[1] + " " + (w[0] + 6) + " " + (w[1] + 3) + " V" + (w[1] + 10)); });
      s += P("M338 100 H382", "vo55-soft");
      // houses on the slope
      [[40, 182, 22, 16, 7], [70, 178, 18, 22, 6], [96, 174, 24, 18, 8], [128, 168, 20, 24, 6], [160, 162, 22, 18, 8], [192, 158, 18, 26, 6],
       [220, 152, 24, 20, 7], [254, 148, 20, 24, 0], [282, 146, 18, 16, 6], [404, 146, 22, 20, 7], [434, 150, 18, 26, 6], [460, 154, 24, 18, 8],
       [494, 160, 20, 22, 6], [522, 166, 22, 18, 7], [554, 172, 18, 20, 6], [584, 178, 24, 14, 7], [620, 184, 20, 16, 6]].forEach(function (h) { s += house(h[0], h[1], h[2], h[3], h[4]); });
      // Golden Horn
      s += P("M0 196 C240 192 480 199 720 195 S1040 192 1200 197");
      s += waves(rand, 16, 30, 1160, 206, 232, 22);
      // old city across the water: a mosque on the hill
      s += P("M700 196 C760 170 820 150 900 146 C980 142 1080 156 1200 164", "vo55-soft");
      s += P("M820 152 H990") + P("M836 152 V128 H974 V152");
      s += dome(905, 128, 46) + dome(850, 128, 13) + dome(960, 128, 13) + P("M870 152 v-10 q8 -8 16 0 v10 M924 152 v-10 q8 -8 16 0 v10", "vo55-soft");
      s += minaret(812, 152, 48) + minaret(998, 152, 48) + minaret(786, 160, 74) + minaret(1024, 158, 74);
      s += house(1060, 162, 20, 14, 6) + house(1090, 162, 24, 18, 7) + house(1130, 164, 20, 12, 6);
      // a ferry and gulls
      s += P("M600 214 L690 214 L680 226 L612 226 Z") + P("M618 214 V204 H672 V214") + P("M646 204 V194 H654 V204");
      s += gull(520, 40) + gull(552, 54, .7) + gull(1100, 60, .8) + gull(240, 70, .6);
      return s;
    },

    iznik: function () {
      var s = "", W = 150;
      s += P("M0 18 H1200") + P("M0 26 H1200") + P("M0 214 H1200") + P("M0 222 H1200");
      for (var x = 0; x < 1200; x += 20) {
        s += P("M" + x + " 26 q10 9 20 0", "vo55-soft") + P("M" + x + " 214 q10 -9 20 0", "vo55-soft");
      }
      for (var i = 0; i < 8; i++) {
        var x0 = i * W, cx = x0 + W / 2;
        // vine between tiles with rumi curls
        s += P("M" + x0 + " 40 C" + (x0 + 12) + " 64 " + (x0 - 12) + " 88 " + x0 + " 112 C" + (x0 + 12) + " 136 " + (x0 - 12) + " 160 " + x0 + " 184 L" + x0 + " 200", "vo55-soft");
        s += P("M" + x0 + " 70 c12 -8 22 2 14 12 c-5 6 -12 2 -9 -3") + P("M" + x0 + " 150 c-12 8 -22 -2 -14 -12 c5 -6 12 -2 9 3");
        if (i % 2 === 0) {
          // tulip
          s += P("M" + cx + " 200 C" + (cx - 5) + " 166 " + (cx + 5) + " 130 " + cx + " 96");
          s += P("M" + cx + " 186 C" + (cx - 26) + " 178 " + (cx - 40) + " 150 " + (cx - 30) + " 120 C" + (cx - 24) + " 146 " + (cx - 12) + " 164 " + cx + " 174");
          s += P("M" + cx + " 160 C" + (cx + 24) + " 154 " + (cx + 36) + " 132 " + (cx + 30) + " 108 C" + (cx + 22) + " 128 " + (cx + 12) + " 142 " + cx + " 150");
          s += P("M" + (cx - 16) + " 96 C" + (cx - 22) + " 74 " + (cx - 14) + " 58 " + (cx - 10) + " 46 L" + (cx - 4) + " 66 L" + cx + " 40 L" + (cx + 4) + " 66 L" + (cx + 10) + " 46 C" + (cx + 14) + " 58 " + (cx + 22) + " 74 " + (cx + 16) + " 96 Q" + cx + " 104 " + (cx - 16) + " 96");
          s += P("M" + (cx - 8) + " 92 Q" + cx + " 70 " + (cx + 8) + " 92", "vo55-soft");
        } else {
          // carnation
          s += P("M" + cx + " 200 C" + (cx + 4) + " 170 " + (cx - 4) + " 134 " + cx + " 104");
          s += P("M" + cx + " 178 C" + (cx - 16) + " 172 " + (cx - 28) + " 160 " + (cx - 34) + " 146 C" + (cx - 20) + " 150 " + (cx - 8) + " 160 " + cx + " 170");
          s += P("M" + cx + " 150 C" + (cx + 16) + " 144 " + (cx + 28) + " 132 " + (cx + 34) + " 118 C" + (cx + 20) + " 122 " + (cx + 8) + " 132 " + cx + " 142");
          s += P("M" + (cx - 10) + " 104 Q" + cx + " 112 " + (cx + 10) + " 104 L" + (cx + 8) + " 92 H" + (cx - 8) + " Z");
          s += P("M" + (cx - 8) + " 92 C" + (cx - 30) + " 88 " + (cx - 32) + " 64 " + (cx - 20) + " 58 C" + (cx - 18) + " 46 " + (cx - 6) + " 42 " + cx + " 48 C" + (cx + 6) + " 42 " + (cx + 18) + " 46 " + (cx + 20) + " 58 C" + (cx + 32) + " 64 " + (cx + 30) + " 88 " + (cx + 8) + " 92");
          s += P("M" + cx + " 90 V56 M" + (cx - 6) + " 90 L" + (cx - 16) + " 64 M" + (cx + 6) + " 90 L" + (cx + 16) + " 64", "vo55-soft");
        }
        // small rumi leaves in the tile corners
        s += P("M" + (x0 + 14) + " 196 c6 -14 20 -16 24 -6 c-8 -2 -14 2 -16 8", "vo55-soft");
        s += P("M" + (x0 + W - 14) + " 44 c-6 14 -20 16 -24 6 c8 2 14 -2 16 -8", "vo55-soft");
      }
      s += P("M1200 40 V200", "vo55-soft");
      return s;
    },

    tulip: function () {
      var rand = rng(7), s = "";
      // Emirgan: the water and the far shore behind the bed
      s += '<circle pathLength="1" cx="1120" cy="34" r="16" class="vo55-soft"/>';
      // soil + grass
      s += P("M0 222 C200 218 420 224 600 220 S1000 218 1200 222");
      for (var g = 10; g < 1200; g += 26 + rand() * 18) s += P("M" + r1(g) + " 222 l3 -8 M" + r1(g + 6) + " 222 l-2 -6", "vo55-soft");
      // back row (small, soft)
      for (var b = 30; b < 1180; b += 46 + rand() * 20) s += tulipFlower(r1(b), 196, 0.55 + rand() * .15, rand, true);
      // front row
      var x = 26;
      while (x < 1180) {
        s += tulipFlower(r1(x), 222, .85 + rand() * .45, rand, false);
        x += 52 + rand() * 30;
      }
      s += P("M700 40 c-8 -10 -20 -4 -14 6 c4 6 12 4 14 -6 c2 10 10 12 14 6 c6 -10 -6 -16 -14 -6", "") + P("M700 40 v10", "vo55-soft");
      return s;
    },

    saffron: function () {
      var rand = rng(5), s = "";
      // facade
      s += P("M110 200 H1090") + P("M110 200 V120 H1090 V200") + P("M110 128 H1090", "vo55-soft");
      // arcade
      for (var x = 130; x < 1070; x += 48) {
        if (x > 548 && x < 640) continue;
        s += P("M" + x + " 200 V160 Q" + (x + 20) + " 136 " + (x + 40) + " 160 V200");
        s += P("M" + (x + 20) + " 146 v10 m-3 3 l3 4 l3 -4 z", "vo55-soft");
      }
      // gate
      s += P("M560 200 V146 Q600 104 640 146 V200") + P("M548 200 V120 M652 200 V120") + P("M572 200 V152 Q600 120 628 152 V200", "vo55-soft");
      // small domes on the roof
      for (var d = 140; d < 1080; d += 62) { if (d > 520 && d < 660) continue; s += dome(d + 14, 120, 14); }
      // central dome with drum
      s += P("M540 120 V100 H660 V120") + P("M552 100 v-6 M648 100 v-6", "vo55-soft");
      s += dome(600, 96, 50) + P("M592 30 a8 8 0 1 0 12 -6", "vo55-soft");
      for (var w = 556; w < 650; w += 14) s += P("M" + w + " 116 v-10", "vo55-soft");
      // street + spice piles in bowls
      s += P("M0 226 C300 222 600 228 1200 224", "vo55-soft");
      [[60, 1], [190, .9], [330, 1.1], [470, .85], [700, 1], [850, 1.15], [1000, .9], [1130, 1]].forEach(function (p) {
        var px = p[0], k = p[1], top = 228 - 34 * k;
        s += P("M" + (px - 30 * k) + " 222 Q" + px + " 238 " + (px + 30 * k) + " 222") + P("M" + (px - 30 * k) + " 222 H" + (px + 30 * k), "vo55-soft");
        s += P("M" + (px - 24 * k) + " 222 C" + (px - 16 * k) + " " + (top + 8) + " " + (px - 6 * k) + " " + top + " " + px + " " + top + " C" + (px + 6 * k) + " " + top + " " + (px + 16 * k) + " " + (top + 8) + " " + (px + 24 * k) + " 222");
        for (var i = 0; i < 6; i++) { var dx = (rand() - .5) * 26 * k, dy = top + 8 + rand() * 18 * k; s += '<circle cx="' + r1(px + dx) + '" cy="' + r1(dy) + '" r="1.1" class="vo55-fill"/>'; }
        s += P("M" + (px - 2) + " " + (top - 4) + " l4 -8 l4 8", "vo55-soft");
      });
      // hanging lamps
      [228, 420, 780, 972].forEach(function (lx) { s += P("M" + lx + " 6 V36 M" + (lx - 7) + " 46 L" + lx + " 36 L" + (lx + 7) + " 46 L" + lx + " 58 Z", "vo55-soft"); });
      s += gull(320, 50, .8) + gull(880, 44, .7);
      return s;
    },

    olive: function () {
      var rand = rng(19), s = "";
      var B = [[14, 186], [330, 150], [560, 170], [790, 124], [1010, 82], [1120, 76], [1190, 60]];
      // main branch as two cubic segments
      var seg = [[[230, 196], [420, 150], [600, 178], [800, 128]], [[800, 128], [950, 92], [1080, 90], [1190, 56]]];
      seg.forEach(function (c) { s += P("M" + c[0].join(" ") + " C" + c[1].join(" ") + " " + c[2].join(" ") + " " + c[3].join(" ")); });
      s += P("M250 198 C430 160 610 186 800 138", "vo55-soft");
      function bez(c, t) {
        var u = 1 - t;
        return [u * u * u * c[0][0] + 3 * u * u * t * c[1][0] + 3 * u * t * t * c[2][0] + t * t * t * c[3][0],
                u * u * u * c[0][1] + 3 * u * u * t * c[1][1] + 3 * u * t * t * c[2][1] + t * t * t * c[3][1]];
      }
      var n = 0;
      seg.forEach(function (c, si) {
        for (var tt = si ? .04 : .1; tt < .98; tt += si ? .085 : .095) {
          var p = bez(c, tt), q = bez(c, tt + .01);
          var ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
          var side = n % 2 ? 1 : -1, len = 44 + rand() * 26;
          var a = ang + side * (34 + rand() * 18);
          s += '<g transform="translate(' + r1(p[0]) + " " + r1(p[1]) + ") rotate(" + r1(a) + ')">' +
            P("M0 0 C" + r1(len * .25) + " -" + r1(len * .16) + " " + r1(len * .7) + " -" + r1(len * .14) + " " + r1(len) + " 0 C" + r1(len * .7) + " " + r1(len * .13) + " " + r1(len * .25) + " " + r1(len * .14) + " 0 0") +
            P("M3 0 L" + r1(len - 6) + " 0", "vo55-soft") + "</g>";
          if (n % 3 === 1) {
            var ox = p[0] + 10, oy = p[1] + 18;
            s += P("M" + r1(p[0]) + " " + r1(p[1]) + " Q" + r1(ox - 2) + " " + r1(oy - 12) + " " + r1(ox) + " " + r1(oy - 9), "vo55-soft");
            s += '<ellipse pathLength="1" cx="' + r1(ox) + '" cy="' + r1(oy) + '" rx="7" ry="9.5" transform="rotate(-18 ' + r1(ox) + " " + r1(oy) + ')"/>';
            s += P("M" + r1(ox - 2) + " " + r1(oy - 4) + " q2 -2 4 0", "vo55-soft");
          }
          n++;
        }
      });
      // a small olive tree on the hill, bottom right
      s += P("M0 222 C70 212 170 210 300 224", "vo55-soft");
      s += P("M96 214 C102 192 88 178 98 160 C106 146 96 136 102 124 M108 214 C106 196 116 182 108 162 M102 150 C116 142 124 130 136 126");
      s += P("M44 128 c-18 -2 -22 -26 -4 -32 c0 -18 24 -24 34 -10 c10 -16 40 -12 40 8 c18 -2 28 18 16 28 c10 14 -6 28 -20 20 c-8 12 -30 12 -36 0 c-12 8 -34 0 -30 -14 z");
      s += P("M60 112 c6 -4 12 -2 14 2 M96 96 c6 -4 12 -2 14 2 M118 120 c6 -4 12 -2 14 2", "vo55-soft");
      [[58, 132], [92, 104], [130, 122]].forEach(function (o) { s += '<ellipse pathLength="1" cx="' + o[0] + '" cy="' + o[1] + '" rx="4" ry="5.5"/>'; });
      return s;
    }
  };
  function tulipFlower(x, base, k, rand, soft) {
    var h = (90 + rand() * 60) * k, top = base - h, lean = (rand() - .5) * 16 * k, cx = x + lean, cls = soft ? "vo55-soft" : "";
    var w = 12 * k, ch = 30 * k, s = "";
    s += P("M" + x + " " + base + " C" + r1(x + lean * .2) + " " + r1(base - h * .4) + " " + r1(cx) + " " + r1(top + h * .4) + " " + r1(cx) + " " + r1(top), cls);
    var lx = x + (rand() > .5 ? 1 : -1) * (16 + rand() * 10) * k;
    s += P("M" + x + " " + r1(base - 6) + " C" + r1(x + (lx - x) * .3) + " " + r1(base - h * .3) + " " + r1(lx) + " " + r1(base - h * .45) + " " + r1(lx + (lx - x) * .2) + " " + r1(base - h * .62) + " C" + r1(x + (lx - x) * .5) + " " + r1(base - h * .4) + " " + r1(x + (lx - x) * .15) + " " + r1(base - h * .2) + " " + x + " " + r1(base - 16 * k), cls);
    s += P("M" + r1(cx - w) + " " + r1(top) + " C" + r1(cx - w * 1.15) + " " + r1(top - ch * .55) + " " + r1(cx - w * .8) + " " + r1(top - ch * .85) + " " + r1(cx - w * .5) + " " + r1(top - ch) +
      " L" + r1(cx - w * .2) + " " + r1(top - ch * .62) + " L" + r1(cx + w * .1) + " " + r1(top - ch * 1.05) + " L" + r1(cx + w * .38) + " " + r1(top - ch * .62) + " L" + r1(cx + w * .72) + " " + r1(top - ch * .95) +
      " C" + r1(cx + w * 1.1) + " " + r1(top - ch * .6) + " " + r1(cx + w * 1.1) + " " + r1(top - ch * .25) + " " + r1(cx + w) + " " + r1(top) + " Q" + r1(cx) + " " + r1(top + 8 * k) + " " + r1(cx - w) + " " + r1(top), cls);
    return s;
  }

  function buildScenes() {
    var host = $(".vo55-scenes");
    var html = "";
    OZ.accents.forEach(function (a) {
      html += '<svg class="vo55-scene vo55-draw" data-scene="' + a.id + '" viewBox="0 -6 1200 246" preserveAspectRatio="xMidYMid meet" focusable="false">' + (SCENES[a.id] ? SCENES[a.id]() : "") + "</svg>";
    });
    host.innerHTML = html;
    // left-to-right drawing order
    $$(".vo55-scene [pathLength]", host).forEach(function (p) {
      var x = 0, d = p.getAttribute("d");
      if (d) { var m = d.match(/M\s*(-?[\d.]+)/); x = m ? +m[1] : 0; }
      else if (p.getAttribute("cx")) x = +p.getAttribute("cx");
      var g = p.parentNode && p.parentNode.getAttribute && p.parentNode.getAttribute("transform");
      if (g) { var gm = g.match(/translate\((-?[\d.]+)/); if (gm) x = +gm[1]; }
      p.style.setProperty("--delay", (0.05 + Math.max(0, Math.min(1, x / 1200)) * 1.1).toFixed(2) + "s");
      p.style.setProperty("--dur", "1s");
    });
    showScene(OZ.accent, false);
  }
  var sceneSeen = false;
  // Draw a scene's lines with explicit animations. A CSS transition on a scene that was never shown
  // before doesn't always start, which left the scene blank on the first click of a colour.
  function drawScene(s, animate) {
    s.classList.add("vo55-in");
    $$("[pathLength]", s).forEach(function (p) {
      p.style.transition = "none"; // the drawing is driven below, not by the CSS transition
      p.getAnimations().forEach(function (a) { a.cancel(); });
      if (!animate) return;
      var cs = getComputedStyle(p);
      p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: (parseFloat(cs.getPropertyValue("--dur")) || 1) * 1000,
        delay: (parseFloat(cs.getPropertyValue("--delay")) || 0) * 1000,
        easing: "cubic-bezier(.2, .7, .2, 1)", fill: "backwards"
      });
    });
  }
  function showScene(id, redraw) {
    if (redraw) sceneSeen = true; // the user picked a colour: draw the new scene now, even before the reveal fired
    $$(".vo55-scene").forEach(function (s) {
      var on = s.getAttribute("data-scene") === id;
      s.classList.toggle("vo55-on", on);
      if (on && sceneSeen) drawScene(s, redraw && !still());
    });
    $(".vo55-fig1-cap").textContent = t("hero.fig." + id);
  }

  /* ================================================================ ink pickers + toggles */
  function renderInk() {
    var dark = OZ.theme === "dark";
    $$("[data-ink]").forEach(function (box) {
      var dots = $(".vo55-ink-dots", box);
      dots.setAttribute("aria-label", t("ui.ink"));
      dots.innerHTML = OZ.accents.map(function (a) {
        var nm = a.name[OZ.lang] || a.name.en;
        return '<button type="button" data-accent-id="' + a.id + '" aria-pressed="' + (a.id === OZ.accent) + '" aria-label="' + esc(nm) + '" title="' + esc(nm) + '" style="--sw:' + (dark ? a.dark : a.light) + '"><span></span></button>';
      }).join("");
      var cur = OZ.accents.filter(function (a) { return a.id === OZ.accent; })[0];
      $(".vo55-ink-name", box).textContent = cur ? (cur.name[OZ.lang] || cur.name.en) : "";
    });
  }
  doc.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-accent-id]");
    if (b) OZ.setAccent(b.getAttribute("data-accent-id"));
  });

  function renderToggles() {
    $$("[data-toggle]").forEach(function (b) {
      var on = b.getAttribute("data-toggle") === "calm" ? state.calm : state.trail;
      b.setAttribute("aria-pressed", String(on));
      $(".vo55-toggle-state", b).textContent = t(on ? "ui.on" : "ui.off");
    });
    var tb = $('[data-toggle="trail"]');
    if (tb) tb.hidden = !mqFine.matches;
    var sep = $(".vo55-dotsep");
    if (sep) sep.hidden = !mqFine.matches;
    doc.body.classList.toggle("vo55-calm", state.calm);
  }
  $$("[data-toggle]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("data-toggle") === "calm") { state.calm = !state.calm; save("vo55-calm", state.calm ? "1" : "0"); }
      else { state.trail = !state.trail; save("vo55-trail", state.trail ? "1" : "0"); }
      renderToggles(); setPeekMode(); trail.sync(); updateRoad();
    });
  });

  /* ================================================================ 01 projects */
  var GLYPH = {
    "ai-code-reviewer": function () {
      var s = P("M12 64 H148"); for (var i = 0; i < 7; i++) { var x = 12 + i * 22.6; s += '<circle cx="' + r1(x) + '" cy="64" r="' + (i === 3 ? 6 : 4) + '" class="' + (i === 3 ? "vo55-fill" : "") + '"/>'; }
      return s + P("M70 40 l6 6 l12 -14") + P("M58 88 h44 M66 96 h28", "vo55-soft");
    },
    "skill-marketplace": function () {
      var s = P("M14 40 H146 M14 72 H146 M14 104 H146");
      [[18, 22, 14], [36, 18, 10], [58, 30, 14], [92, 20, 12], [116, 26, 14], [22, 54, 12], [42, 50, 16], [66, 56, 12], [98, 52, 18], [124, 58, 16], [20, 86, 18], [46, 90, 12], [70, 84, 20], [108, 88, 14]].forEach(function (b, i) {
        s += '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + ((b[1] < 40 ? 40 : b[1] < 72 ? 72 : 104) - b[1]) + '" class="' + (i === 8 ? "vo55-fill" : "") + '"/>';
      });
      return s;
    },
    "executive-kpi-agent": function () {
      return P("M80 22 L44 60 M80 22 L116 60 M44 60 L26 98 M44 60 L62 98 M116 60 L98 98", "vo55-soft") + P("M80 22 L116 60 L136 98") +
        '<circle cx="80" cy="22" r="7"/><circle cx="44" cy="60" r="5"/><circle cx="116" cy="60" r="6"/><circle cx="26" cy="98" r="4"/><circle cx="62" cy="98" r="4"/><circle cx="98" cy="98" r="4"/><circle cx="136" cy="98" r="7" class="vo55-fill"/>' +
        P("M126 108 c4 8 16 8 20 0", "vo55-soft");
    },
    "ai-gateway": function () {
      var s = ""; [24, 42, 60, 78, 96].forEach(function (y) { s += P("M10 " + y + " C40 " + y + " 50 60 66 60", "vo55-soft"); });
      s += P("M66 86 V50 Q80 32 94 50 V86 Z") + '<circle cx="88" cy="68" r="1.6" class="vo55-fill"/>';
      [32, 60, 88].forEach(function (y) { s += P("M94 60 C112 60 116 " + y + " 132 " + y) + '<circle cx="140" cy="' + y + '" r="7"/>'; });
      return s;
    },
    "mailbox-qa": function () {
      return P("M12 38 H68 V82 H12 Z") + P("M12 38 L40 62 L68 38") + P("M76 60 H92 m-6 -6 l6 6 l-6 6") +
        P("M98 30 H150 V78 H118 L106 92 V78 H98 Z") + P("M106 44 H140 M106 54 H132", "vo55-soft") + P("M108 66 h-3 v8 h3 M128 66 h3 v8 h-3") + '<circle cx="118" cy="70" r="2" class="vo55-fill"/>';
    },
    "sam-ai": function () {
      var s = "";
      for (var r = 0; r < 4; r++) for (var c = 0; c < 7; c++) {
        var on = (r === 1 && c < 5) || (r === 2 && c > 1 && c < 7) || (r === 3 && c < 3) || (r === 0 && c === 4);
        s += '<rect x="' + (22 + c * 17) + '" y="' + (26 + r * 17) + '" width="12" height="12" rx="2" class="' + (on ? "vo55-fill" : "") + '"/>';
      }
      return s + P("M22 104 C60 98 100 108 140 100");
    },
    "player-support-agent": function () {
      var s = "";
      [22, 48, 74, 100].forEach(function (y) { s += '<circle cx="26" cy="' + y + '" r="8"/>' + P("M34 " + y + " C70 " + y + " 80 61 112 61", "vo55-soft"); });
      s += '<circle cx="124" cy="61" r="14"/><circle cx="124" cy="61" r="5" class="vo55-fill"/>';
      return s;
    }
  };
  function glyphSVG(slug) {
    return '<svg class="vo55-glyph" viewBox="0 0 160 120" aria-hidden="true" focusable="false">' + (GLYPH[slug] ? GLYPH[slug]() : "") + "</svg>";
  }

  function renderProjects() {
    var order = t("projects.order").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    $(".vo55-projects").innerHTML = order.map(function (slug, i) {
      var k = "project." + slug + ".";
      return '<li class="vo55-reveal"><a class="vo55-row" href="/projects/' + slug + '/" data-peek-glyph="' + slug + '">' +
        '<span class="vo55-row-n">' + pad2(i + 1) + "</span>" +
        '<span class="vo55-row-main"><span class="vo55-row-t">' + esc(t(k + "title")) + '</span><span class="vo55-row-d">' + esc(t(k + "oneliner")) + "</span></span>" +
        '<span class="vo55-row-meta"><span class="vo55-stamp">' + esc(t(k + "kind")) + '</span><span class="vo55-row-status">' + esc(t(k + "status")) + " · " + esc(t(k + "year")) + "</span></span>" +
        '<span class="vo55-row-arrow" aria-hidden="true">→</span></a></li>';
    }).join("");
  }

  /* ================================================================ 02 founder */
  function caseViz(i) {
    if (i === 1) {
      return '<svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMid meet" class="vo55-draw" aria-hidden="true" focusable="false">' +
        '<path class="vo55-axis" d="M8 88 H392 M8 88 V8"/>' +
        '<path class="vo55-wash" d="M10 87 C120 85 200 72 262 50 S360 18 388 12 V88 H10 Z"/>' +
        '<path class="vo55-stroke" pathLength="1" d="M10 87 C120 85 200 72 262 50 S360 18 388 12"/>' +
        '<circle class="vo55-fill" cx="388" cy="12" r="4"/>' +
        '<path class="vo55-thin" pathLength="1" style="--delay:1s" d="M374 4 C384 -4 402 2 400 14 C398 26 378 26 374 16 C371 8 380 2 390 3"/>' +
        '<text x="10" y="99">2020</text><text x="392" y="99" text-anchor="end">2025</text></svg>';
    }
    if (i === 2) {
      return '<svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMid meet" class="vo55-draw" aria-hidden="true" focusable="false">' +
        '<path class="vo55-axis" d="M30 20 C20 40 40 60 30 80 M370 24 C380 40 362 66 372 86" stroke-dasharray="2 4"/>' +
        '<path id="vo55-route" class="vo55-stroke" pathLength="1" d="M342 78 C300 72 280 40 230 46 S150 70 120 44 S80 22 58 22"/>' +
        '<circle class="vo55-fill" cx="342" cy="78" r="5"/><circle cx="58" cy="22" r="7" class="vo55-thin"/><circle class="vo55-fill" cx="58" cy="22" r="3"/>' +
        '<path class="vo55-thin" d="M332 88 h20 M48 34 h20"/>' +
        '<g class="vo55-truck-g"></g></svg>';
    }
    if (i === 3) {
      return '<svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMid meet" class="vo55-draw" aria-hidden="true" focusable="false">' +
        '<path class="vo55-axis" d="M8 90 H392"/>' +
        '<path class="vo55-stroke" pathLength="1" d="M8 90 H110 V66 H230 V40 H340 V12 H392"/>' +
        '<circle class="vo55-fill" cx="110" cy="66" r="4"/><circle class="vo55-fill" cx="230" cy="40" r="4"/><circle class="vo55-fill" cx="340" cy="12" r="4"/>' +
        '<text x="120" y="82">01</text><text x="240" y="56">02</text><text x="350" y="28">03</text></svg>';
    }
    var s = '<svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">';
    for (var r = 0; r < 5; r++) for (var c = 0; c < 22; c++) {
      var n = r * 22 + c;
      s += '<circle class="vo55-dotm" cx="' + (12 + c * 17.6).toFixed(1) + '" cy="' + (10 + r * 17) + '" r="4.6" style="transition-delay:' + (n * 12) + 'ms"/>';
    }
    return s + '<text x="392" y="99" text-anchor="end">● = 10</text></svg>';
  }
  function statHTML(s) {
    // big stat, with units/words set smaller in mono
    return esc(s).replace(/\s+([A-Za-zÇĞİÖŞÜçğıöşüâ][A-Za-zÇĞİÖŞÜçğıöşüâ ]+)$/, '<span class="vo55-unit">$1</span>');
  }
  function renderCases() {
    var html = "";
    for (var i = 1; i <= 4; i++) {
      var k = "founder.case" + i + ".";
      html += '<article class="vo55-case vo55-reveal">' +
        '<span class="vo55-tape" aria-hidden="true"></span>' +
        '<div class="vo55-case-head"><span class="vo55-mono-label">' + esc(t("ui.case")) + " " + pad2(i) + '</span><span class="vo55-stamp">' + esc(t(k + "tag")) + "</span></div>" +
        '<p class="vo55-case-stat">' + statHTML(t(k + "stat")) + "</p>" +
        '<div class="vo55-case-viz">' + caseViz(i) + "</div>" +
        '<h3 class="vo55-case-t">' + esc(t(k + "title")) + "</h3>" +
        '<p class="vo55-case-d">' + esc(t(k + "desc")) + "</p></article>";
    }
    $(".vo55-cases").innerHTML = html;
    addTruck();
  }
  function addTruck() {
    var g = $(".vo55-truck-g");
    if (!g || still()) return;
    var c = doc.createElementNS(SVGNS, "circle");
    c.setAttribute("r", "4"); c.setAttribute("class", "vo55-fill");
    var am = doc.createElementNS(SVGNS, "animateMotion");
    am.setAttribute("dur", "5s"); am.setAttribute("repeatCount", "indefinite");
    am.setAttribute("path", "M342 78 C300 72 280 40 230 46 S150 70 120 44 S80 22 58 22");
    am.setAttribute("keyPoints", "0;1;1"); am.setAttribute("keyTimes", "0;.8;1"); am.setAttribute("calcMode", "linear");
    c.appendChild(am); g.appendChild(c);
  }

  /* ================================================================ 03 talks */
  function renderTalks() {
    var slugs = t("talks.featured").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    $(".vo55-talks").innerHTML = slugs.map(function (slug, i) {
      var k = "talk." + slug + ".";
      var img = t(k + "image");
      return '<li class="vo55-reveal"><a class="vo55-row" href="/talks/#' + slug + '" data-peek-img="' + esc(img) + '">' +
        '<span class="vo55-row-n">' + pad2(i + 1) + "</span>" +
        '<span class="vo55-row-main"><span class="vo55-row-t">' + esc(t(k + "title")) + '</span><span class="vo55-row-d">' + esc(t(k + "subtitle")) + "</span></span>" +
        '<img class="vo55-thumb" src="' + esc(img) + '" alt="" width="64" height="64" loading="lazy" decoding="async">' +
        '<span class="vo55-row-meta"><span class="vo55-stamp">' + esc(volLabel(t(k + "vol"))) + "</span></span>" +
        '<span class="vo55-row-arrow" aria-hidden="true">→</span></a></li>';
    }).join("");
  }

  /* ================================================================ 04 newsletter */
  function renderWave() {
    var rand = rng(42), svg = $(".vo55-wave"), noise = "M6 60", x;
    for (x = 6; x < 214; x += 3) noise += " L" + r1(x) + " " + r1(60 + (rand() - .5) * 64 * (0.55 + .45 * Math.sin(x / 9)));
    var sig = "M300 60";
    for (x = 300; x <= 514; x += 2) sig += " L" + x + " " + r1(60 - 30 * Math.sin((x - 300) / 214 * Math.PI * 4));
    svg.innerHTML =
      '<path class="vo55-noise" pathLength="1" style="--dur:1.4s" d="' + noise + '"/>' +
      '<path class="vo55-noise" style="opacity:.35" d="M214 60 H230"/>' +
      '<rect class="vo55-filter" x="230" y="34" width="56" height="52" rx="4"/>' +
      '<path class="vo55-sig" pathLength="1" style="--delay:.2s" d="M246 70 C252 50 258 50 262 60 S272 70 276 50"/>' +
      '<path class="vo55-sig" pathLength="1" style="--delay:.9s" d="M286 60 H300"/>' +
      '<path class="vo55-sig" pathLength="1" style="--delay:1s;--dur:1.5s" d="' + sig + '"/>';
    svg.classList.add("vo55-draw");
    $(".vo55-fig2-n").textContent = figLabel(2);
  }

  function fmtDate(s) {
    var d = new Date(s);
    if (isNaN(d)) return "";
    try { return d.toLocaleDateString(OZ.lang === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return d.toISOString().slice(0, 10); }
  }
  function renderPosts() {
    var st = $(".vo55-issues-state"), list = $(".vo55-posts");
    if (state.posts === null) {
      st.innerHTML = '<span>' + esc(t("newsletter.loading")) + '</span><div class="vo55-skel" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>';
      list.innerHTML = "";
      return;
    }
    if (!state.posts.length) {
      st.innerHTML = '<a href="https://thenextsignalnewsletter.substack.com/" rel="noopener" target="_blank">' + esc(t("newsletter.error")) + " ↗</a>";
      list.innerHTML = "";
      return;
    }
    st.innerHTML = "";
    list.innerHTML = state.posts.map(function (p) {
      var safe = /^https?:\/\//.test(p.link || "") ? p.link : "https://thenextsignalnewsletter.substack.com/";
      var img = p.image && /^https?:\/\//.test(p.image) ? p.image : "";
      return '<li class="vo55-reveal vo55-in"><a class="vo55-row" href="' + esc(safe) + '" rel="noopener" target="_blank"' + (img ? ' data-peek-img="' + esc(img) + '"' : "") + ">" +
        (img ? '<img class="vo55-thumb" src="' + esc(img) + '" alt="" width="64" height="64" loading="lazy" decoding="async">' : "") +
        '<span class="vo55-row-main"><span class="vo55-post-date">' + esc(fmtDate(p.date)) + '</span><span class="vo55-row-t">' + esc(p.title) + '</span><span class="vo55-row-d">' + esc(p.excerpt) + "</span></span>" +
        '<span class="vo55-row-arrow" aria-hidden="true" title="' + esc(t("ui.read")) + '">→</span></a></li>';
    }).join("");
  }
  function loadPosts() {
    OZ.latestPosts(3).then(function (items) {
      state.posts = (items || []).filter(function (p) { return p && p.title; });
      renderPosts(); queueLayout();
    }, function () {
      state.posts = []; renderPosts(); queueLayout();
    });
  }

  /* ================================================================ 05 experience */
  var EXP = [ // row → [start, end] in years (to scale)
    { r: 1, a: 2026.09, b: null },
    { r: 2, a: 2025.42, b: 2026.0, low: true, right: true },
    { r: 3, a: 2020.25, b: 2025.2, ink: true },
    { r: 4, a: 2015.0, b: 2020.0 },
    { r: 5, a: 2014.0, b: 2015.0, low: true },
    { r: 6, a: 2012.0, b: 2014.0 },
    { r: 7, a: 2008.0, b: 2012.0 }
  ];
  function nowYear() { var d = new Date(); return Math.max(2026.3, d.getFullYear() + d.getMonth() / 12); }
  function renderExperience() {
    var Y0 = 2008, Y1 = nowYear();
    var pct = function (y) { return ((y - Y0) / (Y1 - Y0) * 100).toFixed(2) + "%"; };
    var h = '<div class="vo55-scale-axis" aria-hidden="true"><svg viewBox="0 0 1000 10" preserveAspectRatio="none"><path d="M0 5 C200 3.6 400 6.2 600 4.8 S880 4 1000 5.2" fill="none" stroke="currentColor" stroke-width="1.3" vector-effect="non-scaling-stroke"/></svg></div>';
    EXP.forEach(function (e) {
      var b = e.b || Y1, last = e.r === 1;
      var lbl = '<span class="vo55-seg-l' + (e.low ? " vo55-low" : "") + (e.ink ? " vo55-key" : "") + '" style="' + (e.right || last ? "left:auto;right:0" : "") + '">' + esc(t("experience.r" + e.r + ".org")) + "</span>";
      h += '<div class="vo55-seg' + (e.ink ? " vo55-ink" : "") + '" data-r="' + e.r + '" style="left:' + pct(e.a) + ";width:calc(" + pct(b) + " - " + pct(e.a) + ' - 2px)">' + lbl + "</div>";
    });
    h += '<span class="vo55-grad" style="left:' + pct(2008.05) + '"></span><span class="vo55-grad" style="left:' + pct(2012) + '"></span>';
    [2008, 2012, 2016, 2020, 2024].forEach(function (y) { h += '<span class="vo55-tick" style="left:' + pct(y) + '">' + y + "</span>"; });
    h += '<span class="vo55-now-pin" style="left:' + pct(Y1) + '"></span>';
    $(".vo55-scale").innerHTML = h;

    var rows = "";
    for (var i = 1; i <= 8; i++) {
      var k = "experience.r" + i + ".";
      var years = t(k + "years");
      if (i === 1) {
        var parts = years.split("— ");
        if (parts.length > 1) years = esc(parts[0]) + "— " + '<span class="vo55-circ vo55-draw">' + esc(parts.slice(1).join("— ")) + CIRCLE + "</span>";
        else years = esc(years);
      } else years = esc(years);
      var isY = i === 3;
      var tag = isY ? "a" : "div";
      rows += '<li class="vo55-reveal"><' + tag + ' class="vo55-exp-row' + (isY ? " vo55-yolda" : "") + '" data-r="' + i + '"' + (isY ? ' href="#founder"' : "") + ">" +
        '<span class="vo55-exp-n">' + pad2(i) + "</span>" +
        '<span class="vo55-exp-org">' + esc(t(k + "org")) + "</span>" +
        '<span class="vo55-exp-role">' + esc(t(k + "role")) + "</span>" +
        '<span class="vo55-exp-years">' + years + "</span>" +
        '<span class="vo55-exp-arrow" aria-hidden="true">' + (isY ? "↑" : "") + "</span></" + tag + "></li>";
    }
    $(".vo55-exp").innerHTML = rows;
  }
  function linkExperience(e) {
    var row = e.target.closest && e.target.closest("[data-r]");
    var r = row ? row.getAttribute("data-r") : null;
    $$(".vo55-seg").forEach(function (s) { s.classList.toggle("vo55-hi", s.getAttribute("data-r") === r); });
    $$(".vo55-exp-row").forEach(function (s) { s.classList.toggle("vo55-hi", s.getAttribute("data-r") === r); });
  }

  /* ================================================================ footer */
  function renderFooter() {
    $(".vo55-credit").textContent = t("ui.credit").replace("{model}", MODEL_NAME);
  }
  $(".vo55-copy").addEventListener("click", function () {
    var b = this, addr = OZ.email();
    var done = function () { b.textContent = t("ui.copied"); setTimeout(function () { b.textContent = t("ui.copy"); }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(addr).then(done, done);
    else { var ta = doc.createElement("textarea"); ta.value = addr; doc.body.appendChild(ta); ta.select(); try { doc.execCommand("copy"); } catch (e) {} ta.remove(); done(); }
  });

  /* ================================================================ peek (hover pictures in the margin) */
  var peek = $(".vo55-peek"), peekIn = $(".vo55-peek-in"), peekKey = "";
  function setPeekMode() {
    var on = mqFine.matches && mqWide.matches && !still();
    doc.body.classList.toggle("vo55-peekmode", on);
    if (!on) hidePeek();
  }
  function showPeek(row) {
    if (!doc.body.classList.contains("vo55-peekmode")) return;
    var img = row.getAttribute("data-peek-img"), gl = row.getAttribute("data-peek-glyph");
    if (!img && !gl) { hidePeek(); return; }
    var key = img || gl;
    if (key !== peekKey) {
      peekKey = key;
      peekIn.innerHTML = img ? '<img src="' + esc(img) + '" alt="" decoding="async">' : glyphSVG(gl);
    }
    var main = $(".vo55-main").getBoundingClientRect(), r = row.getBoundingClientRect();
    var ph = peek.offsetHeight || 140;
    peek.style.setProperty("--py", Math.round(r.top - main.top + r.height / 2 - ph / 2) + "px");
    peek.classList.add("vo55-on");
  }
  function hidePeek() { peek.classList.remove("vo55-on"); }
  function bindPeek() {
    $$("[data-peek-list]").forEach(function (list) {
      list.addEventListener("mouseover", function (e) { var r = e.target.closest(".vo55-row"); if (r) showPeek(r); });
      list.addEventListener("mouseleave", hidePeek);
      list.addEventListener("focusin", function (e) { var r = e.target.closest(".vo55-row"); if (r) showPeek(r); });
      list.addEventListener("focusout", hidePeek);
    });
  }

  /* ================================================================ the road in the margin */
  var road = { len: 0 };
  function buildRoad() {
    var svg = $(".vo55-road"), main = $(".vo55-main");
    if (!svg || getComputedStyle(svg).display === "none") return;
    var mb = main.getBoundingClientRect();
    var mw = svg.getBoundingClientRect().width;
    var H = main.scrollHeight;
    svg.setAttribute("viewBox", "0 0 " + r1(mw) + " " + H);
    svg.style.height = H + "px";
    var beacon = $(".vo55-beacon").getBoundingClientRect();
    var pts = [[beacon.left - mb.left - parseFloat(getComputedStyle(main).paddingLeft) + beacon.width / 2, beacon.bottom - mb.top - 4]];
    var stops = "";
    $$(".vo55-secno").forEach(function (n) {
      var b = n.getBoundingClientRect();
      var y = b.top - mb.top + b.height / 2;
      pts.push([12, y]);
      stops += '<circle cx="12" cy="' + r1(y) + '" r="5"/>';
    });
    pts.push([mw * .42, H - 8]);
    var rand = rng(3), d = "M" + r1(pts[0][0]) + " " + r1(pts[0][1]);
    for (var i = 1; i < pts.length; i++) {
      var p0 = pts[i - 1], p1 = pts[i], dy = p1[1] - p0[1];
      var side = (i % 2 ? .62 : .34) * mw + (rand() - .5) * 14;
      var my = p0[1] + dy * (.45 + rand() * .1);
      d += " C" + r1(p0[0]) + " " + r1(p0[1] + dy * .18) + " " + r1(side) + " " + r1(my - dy * .22) + " " + r1(side) + " " + r1(my);
      d += " C" + r1(side) + " " + r1(my + dy * .22) + " " + r1(p1[0]) + " " + r1(p1[1] - dy * .18) + " " + r1(p1[0]) + " " + r1(p1[1]);
    }
    $(".vo55-road-base").setAttribute("d", d);
    var ink = $(".vo55-road-ink");
    ink.setAttribute("d", d);
    $(".vo55-road-stops").innerHTML = stops;
    road.len = ink.getTotalLength();
    ink.style.strokeDasharray = road.len + " " + road.len;
    updateRoad();
  }
  function updateRoad() {
    var ink = $(".vo55-road-ink");
    if (!ink || !road.len) return;
    if (still()) { ink.style.strokeDashoffset = "0"; return; }
    var main = $(".vo55-main"), b = main.getBoundingClientRect();
    var prog = Math.max(0, Math.min(1, (innerHeight * .62 - b.top) / main.scrollHeight));
    ink.style.strokeDashoffset = String(road.len * (1 - prog));
  }

  /* ================================================================ pen trail */
  var trail = (function () {
    var cv = $(".vo55-trail"), ctx = cv.getContext && cv.getContext("2d"), pts = [], raf = 0, active = false, color = "#1F5F8B";
    function size() { var dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx && ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function move(e) { if (!active) return; pts.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (!raf) raf = requestAnimationFrame(draw); }
    function draw() {
      raf = 0; if (!ctx) return;
      var now = performance.now(), life = 650;
      pts = pts.filter(function (p) { return now - p.t < life; });
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = color;
      for (var i = 1; i < pts.length; i++) {
        var a = 1 - (now - pts[i].t) / life;
        ctx.globalAlpha = a * .5; ctx.lineWidth = .6 + a * 1.6;
        ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
      }
      if (pts.length) raf = requestAnimationFrame(draw);
    }
    function sync() {
      active = !!ctx && state.trail && mqFine.matches && !still();
      cv.classList.toggle("vo55-on", active);
      color = getComputedStyle(doc.documentElement).getPropertyValue("--ink").trim() || color;
      if (active) size(); else { pts = []; ctx && ctx.clearRect(0, 0, cv.width, cv.height); }
    }
    window.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") move(e); }, { passive: true });
    window.addEventListener("resize", function () { if (active) size(); });
    return { sync: sync };
  })();

  /* ================================================================ reveal */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (ents) {
    ents.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("vo55-in");
      if (e.target.classList.contains("vo55-scenes")) { sceneSeen = true; showScene(OZ.accent, true); }
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .12 }) : null;
  function observe() {
    $$(".vo55-reveal:not(.vo55-in), .vo55-draw:not(.vo55-in), .vo55-case:not(.vo55-in), .vo55-scenes").forEach(function (el) {
      if (el.classList.contains("vo55-scene")) return; // scenes are driven by their container
      if (io) io.observe(el); else el.classList.add("vo55-in");
    });
    $$(".vo55-sechead, .vo55-dispatch, .vo55-fig3").forEach(function (el) {
      if (!el.classList.contains("vo55-reveal")) { el.classList.add("vo55-reveal"); if (io) io.observe(el); else el.classList.add("vo55-in"); }
    });
  }
  // Re-rendered SVG that sits inside an already-revealed parent: draw it at once.
  function settleVisible() {
    $$(".vo55-draw:not(.vo55-in)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && !el.classList.contains("vo55-scene")) el.classList.add("vo55-in");
    });
  }

  /* ================================================================ layout queue */
  var lq = 0;
  function queueLayout() {
    if (lq) return;
    lq = requestAnimationFrame(function () { lq = 0; sizeScenes(); drawArrow(); buildRoad(); });
  }
  function sizeScenes() {
    var host = $(".vo55-scenes");
    if (!host) return;
    var slice = mqMobile.matches, w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    var sc = slice ? Math.max(w / 1200, h / 246) : Math.min(w / 1200, h / 246);
    $$(".vo55-scene", host).forEach(function (sv) { sv.setAttribute("preserveAspectRatio", "xMidYMid " + (slice ? "slice" : "meet")); });
    host.style.setProperty("--sw", (1.5 / sc).toFixed(2));
    host.style.setProperty("--sws", (1.2 / sc).toFixed(2));
  }

  /* ================================================================ render all */
  function renderAll() {
    renderHero(); renderTitles(); renderProjects(); renderCases(); renderTalks();
    renderWave(); renderPosts(); renderExperience(); renderFooter(); renderInk(); renderToggles();
    observe();
    requestAnimationFrame(settleVisible);
    queueLayout();
  }

  /* ================================================================ boot */
  function boot() {
    buildScenes();
    renderAll();
    setPeekMode();
    bindPeek();
    trail.sync();
    loadPosts();
    var exp = $(".vo55-exp"), scale = $(".vo55-scale");
    [exp, scale].forEach(function (n) {
      n.addEventListener("mouseover", linkExperience);
      n.addEventListener("focusin", linkExperience);
      n.addEventListener("mouseleave", function () { linkExperience({ target: doc.body }); });
    });

    doc.addEventListener("oz:langchange", function () { renderAll(); });
    doc.addEventListener("oz:accentchange", function () { renderInk(); showScene(OZ.accent, true); trail.sync(); });
    doc.addEventListener("oz:themechange", function () { renderInk(); trail.sync(); });

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { ticking = false; updateRoad(); });
    }, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(queueLayout).observe($(".vo55-main"));
    window.addEventListener("resize", queueLayout);
    [mqReduce, mqFine, mqWide, mqMobile].forEach(function (m) {
      var fn = function () { setPeekMode(); renderToggles(); trail.sync(); queueLayout(); };
      if (m.addEventListener) m.addEventListener("change", fn); else m.addListener(fn);
    });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(queueLayout);
    window.addEventListener("load", queueLayout);
  }

  if (window.OZ && OZ.ready) OZ.ready.then(boot);
  else doc.addEventListener("oz:ready", boot, { once: true });
})();
