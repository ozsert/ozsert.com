/* ═══════════════════════════════════════════════════════════════════════════
   ozsert.com — homepage, interpreted by Claude Opus 5.
   Vanilla JS. Everything visible comes from window.OZ / data-i18n.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var MODEL_NAME = "Claude Opus 5";
  var SVGNS = "http://www.w3.org/2000/svg";
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqFine = window.matchMedia("(hover: hover) and (pointer: fine)");

  var state = {
    pen: false,
    calm: false,
    posts: null,
    postsError: false
  };

  /* ── small helpers ─────────────────────────────────────────────────── */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function svgNode(markup) {
    var d = document.createElement("div");
    d.innerHTML = markup.trim();
    return d.firstChild;
  }
  function calm() { return state.calm || mqReduce.matches; }
  // deterministic jitter so rules look hand-drawn but never flicker
  function jit(seed, i) {
    var x = Math.sin((seed + 1) * 12.9898 + i * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }
  function n(v) { return Math.round(v * 100) / 100; }

  /* ── wobbly horizontal rule ────────────────────────────────────────── */
  function ruleSVG(seed) {
    var W = 1000, y = 4.6, d = "M0 " + n(y + (jit(seed, 0) - .5) * 1.6);
    for (var i = 1; i <= 8; i++) {
      var x = (W / 8) * i;
      var cx = x - W / 16;
      d += " Q" + n(cx) + " " + n(y + (jit(seed, i) - .5) * 3.4) +
           " " + n(x) + " " + n(y + (jit(seed, i + 40) - .5) * 1.9);
    }
    return '<svg viewBox="0 0 ' + W + ' 9" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
  }
  function paintRules() {
    $$(".vo5-hrule").forEach(function (r) {
      if (!r.firstChild) r.innerHTML = ruleSVG(parseInt(r.dataset.rule || "0", 10));
    });
  }

  /* ── hand-drawn marks: underline + oval ────────────────────────────── */
  function ulPath(w, h, style) {
    var y = h * .62, a = Math.max(2, h * .26);
    if (style === "dashed") {
      var seg = w / 3.4, out = "";
      for (var i = 0; i < 3; i++) {
        var x0 = 2 + i * (seg * 1.12);
        out += "M" + n(x0) + " " + n(y + (i - 1) * a * .35) +
               " Q" + n(x0 + seg / 2) + " " + n(y - a * .9 + i * a * .3) +
               " " + n(x0 + seg) + " " + n(y + (i - 1) * a * .2) + " ";
      }
      return out.trim();
    }
    if (style === "double") {
      return "M2 " + n(y - a * .5) + " C " + n(w * .26) + " " + n(y - a * 1.5) + ", " +
        n(w * .55) + " " + n(y + a * .5) + ", " + n(w - 2) + " " + n(y - a * .8) +
        " M" + n(w * .06) + " " + n(y + a * .9) + " C " + n(w * .4) + " " + n(y + a * .2) + ", " +
        n(w * .66) + " " + n(y + a * 1.5) + ", " + n(w - 6) + " " + n(y + a * .5);
    }
    if (style === "straight") {
      return "M2 " + n(y) + " C " + n(w * .3) + " " + n(y - a * .7) + ", " +
        n(w * .66) + " " + n(y + a * .6) + ", " + n(w - 2) + " " + n(y - a * .25);
    }
    // wave
    return "M2 " + n(y) + " C " + n(w * .17) + " " + n(y - a * 1.25) + ", " + n(w * .34) + " " + n(y + a * 1.1) +
      ", " + n(w * .5) + " " + n(y - a * .2) + " S " + n(w * .8) + " " + n(y + a * 1.2) + ", " + n(w - 2) + " " + n(y - a * .5);
  }

  function ovalPath(w, h) {
    var cx = w / 2, cy = h / 2, rx = w / 2 - 2.5, ry = h / 2 - 2.5;
    return "M" + n(cx + rx * .93) + " " + n(cy - ry * .3) +
      " C " + n(cx + rx * 1.04) + " " + n(cy + ry * .6) + ", " + n(cx + rx * .5) + " " + n(cy + ry * 1.04) + ", " + n(cx - rx * .04) + " " + n(cy + ry * .99) +
      " C " + n(cx - rx * .6) + " " + n(cy + ry * .95) + ", " + n(cx - rx * 1.05) + " " + n(cy + ry * .34) + ", " + n(cx - rx * .97) + " " + n(cy - ry * .28) +
      " C " + n(cx - rx * .9) + " " + n(cy - ry * .98) + ", " + n(cx - rx * .08) + " " + n(cy - ry * 1.08) + ", " + n(cx + rx * .55) + " " + n(cy - ry * .87) +
      " C " + n(cx + rx * 1.0) + " " + n(cy - ry * .73) + ", " + n(cx + rx * 1.08) + " " + n(cy - ry * .02) + ", " + n(cx + rx * .86) + " " + n(cy + ry * .47);
  }

  function markSVG() {
    return '<svg class="vo5-draw" aria-hidden="true" focusable="false" preserveAspectRatio="none"><path pathLength="1" d=""/></svg>';
  }

  function fitUl(wrapEl) {
    var inner = $(".vo5-ul-t", wrapEl), svg = $("svg", wrapEl);
    if (!inner || !svg) return;
    var rects = inner.getClientRects();
    if (!rects.length) return;
    var r = rects[rects.length - 1];
    var base = wrapEl.getBoundingClientRect();
    var w = Math.max(24, Math.round(r.width));
    var h = Math.max(9, Math.round(Math.min(26, r.height * .30)));
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    var fs = parseFloat(window.getComputedStyle(inner).fontSize) || 16;
    svg.style.left = Math.round(r.left - base.left) + "px";
    svg.style.top = Math.round(r.bottom - base.top - h * .5 - fs * .15) + "px";
    $("path", svg).setAttribute("d", ulPath(w, h, wrapEl.dataset.style || "wave"));
  }

  function fitCirc(wrapEl) {
    var inner = $(".vo5-circ-t", wrapEl), svg = $("svg", wrapEl);
    if (!inner || !svg) return;
    var r = inner.getBoundingClientRect(), base = wrapEl.getBoundingClientRect();
    if (!r.width) return;
    var px = 15, py = 8;
    var w = Math.round(r.width + px * 2), h = Math.round(r.height + py * 2);
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.style.left = Math.round(r.left - base.left - px) + "px";
    svg.style.top = Math.round(r.top - base.top - py) + "px";
    $("path", svg).setAttribute("d", ovalPath(w, h));
  }

  function fitMarks() {
    $$(".vo5-ul").forEach(fitUl);
    $$(".vo5-circ").forEach(fitCirc);
    drawArrow();
  }

  /* ── text decoration (headline, highlights, circles, titles) ───────── */
  function splitTail(text) {
    var words = text.trim().split(/\s+/);
    if (words.length < 2) return ["", words.join(" ")];
    var two = words.slice(-2).join(" ");
    var take = (two.length <= 18) ? 2 : 1;
    return [words.slice(0, words.length - take).join(" "), words.slice(words.length - take).join(" ")];
  }

  function ulWrap(text, style) {
    return '<span class="vo5-ul" data-style="' + style + '"><span class="vo5-ul-t">' + esc(text) + "</span>" + markSVG() + "</span>";
  }

  function markPhrases(text, phrases, kind) {
    var marks = [];
    phrases.forEach(function (p) {
      p = p.trim();
      if (!p) return;
      var i = text.indexOf(p);
      if (i >= 0) marks.push({ s: i, e: i + p.length, t: p });
    });
    marks.sort(function (a, b) { return a.s - b.s; });
    var out = "", pos = 0, used = 0;
    marks.forEach(function (m) {
      if (m.s < pos) return;
      out += esc(text.slice(pos, m.s));
      used++;
      if (kind === "hi") {
        out += '<span class="vo5-hi">' + esc(m.t) + "</span>";
      } else {
        out += '<span class="vo5-circ"><span class="vo5-circ-t">' + esc(m.t) + "</span>" + markSVG() + "</span>";
      }
      pos = m.e;
    });
    out += esc(text.slice(pos));
    return out;
  }

  function decorate() {
    var OZ = window.OZ;

    /* headline: two lines, accent dot, swept underline under the last line */
    var h1 = $("#vo5-headline");
    if (h1) {
      var raw = OZ.t("hero.headline") || "";
      var cut = raw.indexOf(". ");
      var l1 = cut > 0 ? raw.slice(0, cut + 1) : "";
      var l2 = cut > 0 ? raw.slice(cut + 2) : raw;
      var dot = /\.$/.test(l2);
      if (dot) l2 = l2.slice(0, -1);
      h1.innerHTML =
        (l1 ? '<span class="vo5-h1-l1">' + esc(l1) + "</span>" : "") +
        '<span class="vo5-h1-l2 vo5-ul" data-style="double"><span class="vo5-ul-t">' + esc(l2) +
        (dot ? '<i class="vo5-dot" aria-hidden="true"></i>' : "") + "</span>" + markSVG() + "</span>";
    }

    /* role: highlighter wash on the key phrases */
    var role = $("#vo5-role");
    if (role) {
      role.innerHTML = markPhrases(OZ.t("hero.role") || "", (OZ.t("hero.role_highlights") || "").split("|"), "hi");
    }

    /* manifesto: hand-drawn ovals; the last one gets the arrow */
    var man = $("#vo5-manifesto");
    if (man) {
      man.innerHTML = markPhrases(OZ.t("hero.manifesto") || "", (OZ.t("hero.manifesto_circle") || "").split("|"), "circ");
      var circles = $$(".vo5-circ", man);
      circles.forEach(function (c) { c.removeAttribute("id"); });
      if (circles.length) circles[circles.length - 1].id = "vo5-circ-last";
    }

    /* section titles: one phrase underlined by hand, a different stroke each time */
    $$(".vo5-stitle[data-ul]").forEach(function (t) {
      var key = (t.getAttribute("data-i18n") || "").replace(/^\[[^\]]+\]/, "");
      var txt = OZ.t(key) || t.textContent;
      var parts = splitTail(txt);
      t.innerHTML = (parts[0] ? esc(parts[0]) + " " : "") + ulWrap(parts[1], t.dataset.ul);
    });

    /* the current role's "Now" gets circled */
    var yr = $("[data-circle-last]");
    if (yr) {
      var txt = OZ.t("experience.r1.years") || yr.textContent;
      var seg = txt.split(/[—–-]\s*/);
      var tail = (seg[seg.length - 1] || "").trim();
      if (tail && txt.length > tail.length) {
        yr.innerHTML = esc(txt.slice(0, txt.length - tail.length)) +
          '<span class="vo5-circ"><span class="vo5-circ-t">' + esc(tail) + "</span>" + markSVG() + "</span>";
      }
    }

    observeDraw();
  }

  /* ── curved arrow: circled word → margin note ──────────────────────── */
  function drawArrow() {
    var svg = $("#vo5-arrow");
    if (!svg) return;
    var last = $("#vo5-circ-last"), note = $("#vo5-marginnote"), grid = svg.parentNode;
    if (!last || !note || window.innerWidth < 940) { svg.style.display = "none"; return; }
    var g = grid.getBoundingClientRect(), a = last.getBoundingClientRect(), b = note.getBoundingClientRect();
    if (b.left < a.right + 50 || !g.width) { svg.style.display = "none"; return; }
    svg.style.display = "block";
    svg.setAttribute("viewBox", "0 0 " + Math.round(g.width) + " " + Math.round(g.height));
    var x1 = n(a.right - g.left + 9), y1 = n(a.top - g.top + a.height / 2);
    var x2 = n(b.left - g.left - 13), y2 = n(b.top - g.top + Math.min(30, b.height / 2));
    var dx = x2 - x1;
    var d = "M" + x1 + " " + y1 +
      " C " + n(x1 + dx * .34) + " " + n(y1 + 46) + ", " + n(x1 + dx * .58) + " " + n(y2 + 66) + ", " + x2 + " " + y2;
    var head = "M" + n(x2 - 12) + " " + n(y2 - 8) + " L" + x2 + " " + y2 + " L" + n(x2 - 13) + " " + n(y2 + 5);
    svg.innerHTML = '<path pathLength="1" d="' + d + '"/><path pathLength="1" d="' + head + '"/>';
    svg.classList.add("vo5-draw");
    requestAnimationFrame(function () { svg.classList.add("is-in"); });
  }

  /* ══ fig. 1 — one line drawing per Istanbul accent ═══════════════════ */
  function scene(body) {
    return '<svg class="vo5-scene" viewBox="0 0 1200 250" aria-hidden="true" focusable="false">' + body + "</svg>";
  }
  function P(d, extra) { return '<path pathLength="1" d="' + d + '"' + (extra || "") + "/>"; }
  function waves(y, amp, rows) {
    var out = "";
    for (var r = 0; r < rows; r++) {
      var yy = y + r * 15, d = "M0 " + yy;
      for (var i = 1; i <= 8; i++) {
        var x = 150 * i;
        d += " Q" + (x - 75) + " " + n(yy + (i % 2 ? -amp : amp) - r * 1.5) + " " + x + " " + yy;
      }
      out += P(d);
    }
    return out;
  }

  // cubic bezier helpers (used to hang things off a drawn branch)
  function bez(p, t) {
    var u = 1 - t;
    return {
      x: u * u * u * p[0] + 3 * u * u * t * p[2] + 3 * u * t * t * p[4] + t * t * t * p[6],
      y: u * u * u * p[1] + 3 * u * u * t * p[3] + 3 * u * t * t * p[5] + t * t * t * p[7]
    };
  }
  function bezAngle(p, t) {
    var a = bez(p, Math.max(0, t - .01)), b = bez(p, Math.min(1, t + .01));
    return Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  }

  var SCENES = {
    bosphorus: function () {
      var s = "";
      // shores and a few houses
      s += P("M0 184 C 46 178, 86 166, 138 168 C 166 169, 184 177, 200 186");
      s += P("M1000 186 C 1024 176, 1056 164, 1108 167 C 1150 169, 1180 178, 1200 183");
      s += P("M22 184 L22 170 L40 158 L58 170 L58 184 M90 184 L90 166 L106 156 L122 166 L122 184");
      s += P("M1094 183 L1094 166 L1110 156 L1126 166 L1126 183 M1144 183 L1144 171 L1158 162 L1172 171 L1172 183");
      // deck
      s += P("M150 152 L1050 152") + P("M150 158 L1050 158");
      // towers, rising above the cable
      [370, 800].forEach(function (x) {
        s += P("M" + x + " 158 L" + x + " 26 M" + (x + 30) + " 158 L" + (x + 30) + " 26");
        s += P("M" + (x - 5) + " 26 L" + (x + 35) + " 26");
        s += P("M" + x + " 48 L" + (x + 30) + " 48 M" + x + " 88 L" + (x + 30) + " 88 M" + x + " 124 L" + (x + 30) + " 124");
      });
      // main cable
      s += P("M150 112 C 240 76, 322 50, 384 44 C 466 54, 552 126, 600 132 C 648 126, 734 54, 816 44 C 878 50, 960 76, 1050 112");
      s += P("M150 112 L150 152 M1050 112 L1050 152");
      var hx = [210, 258, 306, 340, 444, 490, 536, 568, 632, 664, 710, 756, 890, 936, 984, 1018];
      var hy = [92, 78, 64, 55, 62, 80, 100, 115, 115, 100, 80, 62, 55, 64, 80, 92];
      for (var i = 0; i < hx.length; i++) s += P("M" + hx[i] + " " + hy[i] + " L" + hx[i] + " 152");
      // water
      s += waves(198, 7, 3);
      // ferry
      s += P("M548 186 L664 186 L652 202 L560 202 Z");
      s += P("M572 170 L640 170 L640 186 M572 186 L572 170 M588 170 L588 186 M604 170 L604 186 M620 170 L620 186");
      s += P("M606 158 L606 170 M600 158 L612 158");
      s += P("M598 148 C 592 140, 602 134, 608 140 C 616 132, 626 140, 620 148");
      // gulls
      s += P("M268 30 C 277 20, 286 20, 295 30 M302 42 C 309 35, 316 35, 323 42");
      s += P("M884 34 C 893 24, 902 24, 911 34");
      return scene(s);
    },

    galata: function () {
      var s = "";
      s += waves(210, 6, 3);
      s += P("M120 196 L120 162 C 120 128, 200 128, 200 162 L200 196");
      s += P("M160 128 L160 112 M160 108 L160 98");
      s += '<circle data-fill cx="160" cy="110" r="3"/>';
      s += P("M96 196 L96 112 C 96 104, 108 104, 108 112 L108 196 M94 134 L110 134 M102 104 L102 92");
      s += P("M214 196 L214 112 C 214 104, 226 104, 226 112 L226 196 M212 134 L228 134 M220 104 L220 92");
      s += P("M0 196 L0 172 L30 172 L30 152 L60 152 L60 196");
      s += P("M248 196 L248 158 L292 158 L292 176 L330 176 L330 196 M262 166 L262 196 M278 166 L278 196");
      s += P("M340 196 L340 168 L380 168 L380 196 M352 176 L352 196 M368 176 L368 196");
      s += P("M392 196 L392 150 L404 142 L416 150 L416 196 M400 160 L408 160 M400 174 L408 174");
      // Galata Tower
      s += P("M566 196 L566 92 M646 196 L646 92");
      s += P("M558 98 L654 98 M558 92 L654 92 M566 110 L646 110");
      s += P("M566 92 L606 24 L646 92");
      s += P("M606 24 L606 8 M598 16 L614 16");
      s += P("M582 126 C 582 116, 596 116, 596 126 L596 146 L582 146 Z");
      s += P("M616 126 C 616 116, 630 116, 630 126 L630 146 L616 146 Z");
      s += P("M582 160 C 582 150, 596 150, 596 160 L596 180 L582 180 Z");
      s += P("M616 160 C 616 150, 630 150, 630 160 L630 180 L616 180 Z");
      s += P("M552 196 L660 196");
      s += P("M680 196 L680 164 L718 164 L718 196 M692 172 L692 196 M706 172 L706 196");
      s += P("M730 196 L730 152 L744 144 L758 152 L758 196 M738 164 L750 164 M738 178 L750 178");
      s += P("M774 196 L774 168 C 774 138, 850 138, 850 168 L850 196");
      s += P("M812 138 L812 122 M812 118 L812 108");
      s += '<circle data-fill cx="812" cy="120" r="3"/>';
      s += P("M866 196 L866 118 C 866 110, 878 110, 878 118 L878 196 M864 140 L880 140 M872 110 L872 98");
      s += P("M900 196 L900 160 L944 160 L944 196 M914 168 L914 196 M930 168 L930 196");
      s += P("M960 196 L960 150 L1010 150 L1010 196 M972 160 L972 196 M990 160 L990 196");
      s += P("M1030 196 L1030 166 L1070 166 L1070 196 M1090 196 L1090 156 L1130 156 L1130 196 M1150 196 L1150 172 L1190 172 L1190 196");
      s += P("M0 196 L1200 196");
      s += P("M940 212 L1012 212 L1002 224 L950 224 Z M958 200 L994 200 L994 212 M958 212 L958 200");
      return scene(s);
    },

    iznik: function () {
      var s = "";
      s += P("M0 28 L1200 28") + P("M0 36 L1200 36");
      s += P("M0 222 L1200 222") + P("M0 214 L1200 214");
      var cells = 6, w = 1200 / cells;
      for (var i = 0; i < cells; i++) {
        var cx = w * i + w / 2;
        if (i % 2 === 0) {
          // tulip
          s += P("M" + cx + " 196 L" + cx + " 128");
          s += P("M" + (cx - 26) + " 128 C " + (cx - 30) + " 96, " + (cx - 16) + " 72, " + cx + " 64 C " +
                 (cx + 16) + " 72, " + (cx + 30) + " 96, " + (cx + 26) + " 128 C " + (cx + 12) + " 138, " +
                 (cx - 12) + " 138, " + (cx - 26) + " 128 Z");
          s += P("M" + (cx - 9) + " 132 C " + (cx - 13) + " 104, " + (cx - 8) + " 80, " + cx + " 64");
          s += P("M" + (cx + 9) + " 132 C " + (cx + 13) + " 104, " + (cx + 8) + " 80, " + cx + " 64");
          s += P("M" + cx + " 158 C " + (cx - 20) + " 152, " + (cx - 32) + " 164, " + (cx - 34) + " 180");
          s += P("M" + cx + " 170 C " + (cx + 20) + " 164, " + (cx + 32) + " 176, " + (cx + 34) + " 192");
        } else {
          // carnation, with a serrated crown
          s += P("M" + cx + " 196 L" + cx + " 132");
          s += P("M" + (cx - 34) + " 112 C " + (cx - 33) + " 96, " + (cx - 26) + " 84, " + (cx - 18) + " 88 C " +
                 (cx - 17) + " 75, " + (cx - 6) + " 70, " + cx + " 79 C " + (cx + 6) + " 70, " + (cx + 17) + " 75, " + (cx + 18) + " 88 C " +
                 (cx + 26) + " 84, " + (cx + 33) + " 96, " + (cx + 34) + " 112 C " + (cx + 26) + " 130, " +
                 (cx - 26) + " 130, " + (cx - 34) + " 112 Z");
          s += P("M" + (cx - 20) + " 116 C " + (cx - 18) + " 100, " + (cx - 9) + " 92, " + cx + " 96 C " +
                 (cx + 9) + " 92, " + (cx + 18) + " 100, " + (cx + 20) + " 116");
          s += P("M" + (cx - 9) + " 122 C " + (cx - 7) + " 112, " + (cx - 3) + " 108, " + cx + " 108 C " +
                 (cx + 3) + " 108, " + (cx + 7) + " 112, " + (cx + 9) + " 122");
          s += P("M" + cx + " 150 C " + (cx + 22) + " 144, " + (cx + 32) + " 156, " + (cx + 34) + " 174");
          s += P("M" + cx + " 164 C " + (cx - 22) + " 158, " + (cx - 32) + " 170, " + (cx - 34) + " 188");
        }
        // rumi scrolls on the cell boundary
        var bx = w * i;
        s += P("M" + bx + " 110 C " + (bx + 16) + " 86, " + (bx + 42) + " 96, " + (bx + 34) + " 120 C " +
               (bx + 28) + " 138, " + (bx + 6) + " 134, " + (bx + 10) + " 118");
        s += P("M" + bx + " 140 C " + (bx - 16) + " 164, " + (bx - 42) + " 154, " + (bx - 34) + " 130 C " +
               (bx - 28) + " 112, " + (bx - 6) + " 116, " + (bx - 10) + " 132");
      }
      s += P("M1200 110 C 1184 86, 1158 96, 1166 120 C 1172 138, 1194 134, 1190 118");
      return scene(s);
    },

    tulip: function () {
      var s = "";
      s += P("M0 214 C 200 208, 380 218, 580 212 C 800 205, 1000 216, 1200 208");
      var xs = [100, 240, 378, 516, 654, 792, 930, 1074];
      var hs = [96, 128, 78, 112, 142, 86, 120, 100];
      for (var i = 0; i < xs.length; i++) {
        var x = xs[i], by = 212 - hs[i], bend = (i % 2 ? 1 : -1) * 10;
        s += P("M" + x + " 212 C " + (x + bend) + " " + (by + hs[i] * .6) + ", " + (x - bend) + " " + (by + hs[i] * .3) + ", " + x + " " + by);
        // three-petal cup
        s += P("M" + (x - 21) + " " + by +
               " C " + (x - 25) + " " + (by - 26) + ", " + (x - 22) + " " + (by - 48) + ", " + (x - 14) + " " + (by - 56) +
               " C " + (x - 10) + " " + (by - 44) + ", " + (x - 9) + " " + (by - 40) + ", " + (x - 7) + " " + (by - 50) +
               " C " + (x - 5) + " " + (by - 62) + ", " + (x + 5) + " " + (by - 62) + ", " + (x + 7) + " " + (by - 50) +
               " C " + (x + 9) + " " + (by - 40) + ", " + (x + 10) + " " + (by - 44) + ", " + (x + 14) + " " + (by - 56) +
               " C " + (x + 22) + " " + (by - 48) + ", " + (x + 25) + " " + (by - 26) + ", " + (x + 21) + " " + by +
               " C " + (x + 10) + " " + (by + 9) + ", " + (x - 10) + " " + (by + 9) + ", " + (x - 21) + " " + by + " Z");
        // leaf blades
        s += P("M" + (x - 3) + " " + (by + 44) + " C " + (x - 30) + " " + (by + 32) + ", " + (x - 48) + " " + (by + 86) + ", " + (x - 34) + " 209" +
               " C " + (x - 28) + " " + (by + 92) + ", " + (x - 16) + " " + (by + 48) + ", " + (x - 3) + " " + (by + 44) + " Z");
        s += P("M" + (x + 3) + " " + (by + 62) + " C " + (x + 30) + " " + (by + 50) + ", " + (x + 46) + " " + (by + 104) + ", " + (x + 32) + " 210" +
               " C " + (x + 26) + " " + (by + 110) + ", " + (x + 15) + " " + (by + 66) + ", " + (x + 3) + " " + (by + 62) + " Z");
      }
      return scene(s);
    },

    saffron: function () {
      var s = "";
      var cxs = [180, 420, 660, 900, 1120];
      for (var i = 0; i < cxs.length; i++) {
        var cx = cxs[i];
        s += P("M" + (cx - 56) + " 116 C " + (cx - 56) + " 58, " + (cx + 56) + " 58, " + (cx + 56) + " 116");
        s += P("M" + cx + " 58 L" + cx + " 42 M" + cx + " 36 L" + cx + " 26");
        s += '<circle data-fill cx="' + cx + '" cy="39" r="3.2"/>';
        s += P("M" + (cx - 60) + " 116 L" + (cx + 60) + " 116");
        s += P("M" + (cx - 46) + " 196 L" + (cx - 46) + " 156 C " + (cx - 46) + " 120, " + (cx + 46) + " 120, " + (cx + 46) + " 156 L" + (cx + 46) + " 196");
        s += P("M" + (cx - 32) + " 196 L" + (cx - 32) + " 160 C " + (cx - 32) + " 134, " + (cx + 32) + " 134, " + (cx + 32) + " 160 L" + (cx + 32) + " 196");
      }
      s += P("M0 196 L1200 196");
      s += P("M0 116 L1200 116");
      var mx = [250, 480, 710, 940];
      for (var k = 0; k < mx.length; k++) {
        var x = mx[k], r = 54 - k * 4;
        s += P("M" + (x - r) + " 238 C " + (x - r * .7) + " 208, " + (x - r * .25) + " 192, " + x + " 190 C " +
               (x + r * .25) + " 192, " + (x + r * .7) + " 208, " + (x + r) + " 238");
        s += P("M" + (x - r) + " 238 L" + (x + r) + " 238");
        for (var d = 0; d < 7; d++) {
          var px = x - r * .62 + (r * 1.24 / 6) * d;
          var py = 230 - Math.abs(3 - d) * 3 - (d % 2) * 5;
          s += '<circle data-fill cx="' + n(px) + '" cy="' + n(py) + '" r="2.3"/>';
        }
        if (k % 2 === 0) {
          // a scoop stuck in the pile
          s += P("M" + (x + r * .3) + " 206 C " + (x + r * .3 - 11) + " 196, " + (x + r * .3 + 11) + " 196, " + (x + r * .3) + " 206 Z");
          s += P("M" + (x + r * .3 + 8) + " 199 L" + (x + r * .3 + 30) + " 176");
        }
      }
      return scene(s);
    },

    olive: function () {
      var s = "";
      var B = [40, 198, 330, 166, 760, 118, 1162, 60];
      s += P("M" + B[0] + " " + B[1] + " C " + B[2] + " " + B[3] + ", " + B[4] + " " + B[5] + ", " + B[6] + " " + B[7]);
      // a second, shorter branch forking off
      var F = [250, 180, 400, 226, 640, 212, 840, 176];
      s += P("M" + F[0] + " " + F[1] + " C " + F[2] + " " + F[3] + ", " + F[4] + " " + F[5] + ", " + F[6] + " " + F[7]);
      function leafAt(p, t, side) {
        var q = bez(p, t), a = bezAngle(p, t) + side * 34;
        var leaf = "M0 0 C 16 -13, 44 -16, 64 -3 C 44 11, 16 12, 0 0 Z";
        var rib = "M3 0 C 20 -3, 44 -5, 61 -3";
        var tr = ' transform="translate(' + n(q.x) + ' ' + n(q.y) + ') rotate(' + n(a) + ')"';
        return P(leaf, tr) + P(rib, tr + ' opacity=".6"');
      }
      for (var i = 0; i < 9; i++) s += leafAt(B, .07 + i * .105, i % 2 ? 1 : -1);
      for (var j = 0; j < 4; j++) s += leafAt(F, .18 + j * .22, j % 2 ? -1 : 1);
      // olives hanging off the main branch
      [.2, .42, .62, .82].forEach(function (t) {
        var q = bez(B, t);
        s += P("M" + n(q.x) + " " + n(q.y) + " C " + n(q.x - 3) + " " + n(q.y + 10) + ", " + n(q.x + 1) + " " + n(q.y + 12) + ", " + n(q.x) + " " + n(q.y + 18));
        s += P("M" + n(q.x) + " " + n(q.y + 18) + " C " + n(q.x - 15) + " " + n(q.y + 22) + ", " + n(q.x - 16) + " " + n(q.y + 48) +
               ", " + n(q.x) + " " + n(q.y + 50) + " C " + n(q.x + 16) + " " + n(q.y + 48) + ", " + n(q.x + 15) + " " + n(q.y + 22) + ", " + n(q.x) + " " + n(q.y + 18) + " Z");
      });
      s += P("M0 238 L1200 238", ' opacity=".5"');
      return scene(s);
    }
  };

  function setScene(id, animate) {
    var stage = $("#vo5-scene");
    if (!stage || !SCENES[id]) return;
    var old = $(".vo5-scene", stage);
    var svg = svgNode(SCENES[id]());
    if (!calm() && animate !== false) {
      var shapes = svg.querySelectorAll("path, circle");
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].style.animationDelay = Math.min(i * 14, 620) + "ms";
      }
    }
    stage.appendChild(svg);
    svg.getBoundingClientRect(); // force layout so the fade always runs
    svg.classList.add("is-on");
    if (old) {
      old.classList.remove("is-on");
      window.setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, calm() ? 0 : 460);
    }
    var cap = $("#vo5-fig1-cap");
    if (cap) cap.textContent = window.OZ.t("hero.fig." + id) || "";
  }

  /* ══ fig. 2 — noise → signal ═════════════════════════════════════════ */
  function buildFig2() {
    var stage = $("#vo5-fig2-stage");
    if (!stage) return;
    var s = "", d = "M14 76";
    for (var i = 1; i <= 26; i++) {
      var x = 14 + i * 6.2;
      var y = 76 + (jit(7, i) - .5) * 86;
      d += " L" + n(x) + " " + n(y);
    }
    s += P(d);
    s += P("M196 76 L244 76 M234 68 L244 76 L234 84");
    s += P("M262 76 C 278 34, 296 34, 312 76 S 346 118, 362 76 S 396 34, 410 76");
    s += '<circle data-fill cx="410" cy="76" r="4.6"/>';
    s += P("M420 60 C 430 68, 430 84, 420 92", ' opacity=".7"');
    s += P("M430 48 C 446 62, 446 90, 430 104", ' opacity=".45"');
    s += P("M14 118 L182 118 M262 118 L410 118", ' opacity=".35"');
    stage.innerHTML = '<svg class="vo5-draw" viewBox="0 0 448 140" aria-hidden="true" focusable="false">' + s + "</svg>";
  }

  /* ══ fig. 3 — the road so far, to scale ══════════════════════════════ */
  var T0 = 2008, T1 = 2026.95;
  function tx(y, x0, w) { return x0 + (y - T0) / (T1 - T0) * w; }

  var SPANS = [
    { a: 2008, b: 2012.4 }, { a: 2012.4, b: 2014.5 }, { a: 2014.5, b: 2015.5 },
    { a: 2015.5, b: 2020.25 }, { a: 2020.25, b: 2025.2, ink: 1 },
    { a: 2025.45, b: 2026.05 }, { a: 2026.1, b: T1, now: 1 }
  ];

  function buildFig3() {
    var stage = $("#vo5-fig3-stage");
    if (!stage) return;
    var W = 1200, H = 94, x0 = 8, w = W - 16, y = 42, s = "";
    s += P("M" + x0 + " " + y + " L" + (x0 + w) + " " + y, ' opacity=".3" stroke-width="1"');
    SPANS.forEach(function (sp) {
      var a = n(tx(sp.a + .07, x0, w)), b = n(tx(sp.b - .07, x0, w));
      s += '<g class="' + (sp.ink ? "vo5-seg-ink" : "") + '">' +
        P("M" + a + " " + y + " L" + b + " " + y, sp.ink ? ' stroke-width="8"' : ' stroke-width="3.6"') + "</g>";
    });
    s += '<circle data-fill class="vo5-seg-ink" cx="' + n(tx(T1 - .07, x0, w)) + '" cy="' + y + '" r="5"/>';
    // education bracket (BSc & MSc) above the road
    var ea = n(tx(2008, x0, w)), eb = n(tx(2012, x0, w));
    s += P("M" + ea + " " + (y - 13) + " L" + ea + " " + (y - 21) + " L" + eb + " " + (y - 21) + " L" + eb + " " + (y - 13), ' opacity=".5"');
    s += '<circle data-fill cx="' + ea + '" cy="' + (y - 21) + '" r="2.6"/><circle data-fill cx="' + eb + '" cy="' + (y - 21) + '" r="2.6"/>';
    // year ticks
    [2008, 2012, 2016, 2020, 2024, 2026].forEach(function (yr) {
      var x = n(tx(yr, x0, w));
      s += P("M" + x + " " + (y + 11) + " L" + x + " " + (y + 18), ' opacity=".5"');
      s += '<text x="' + x + '" y="' + (y + 34) + '" text-anchor="middle">' + yr + "</text>";
    });
    stage.innerHTML = '<svg class="vo5-draw" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true" focusable="false">' + s + "</svg>";
  }

  function buildMinibar() {
    var host = $("#vo5-minibar");
    if (!host) return;
    var W = 260, x0 = 2, w = W - 4, y = 16, s = "";
    s += P("M" + x0 + " " + y + " L" + (x0 + w) + " " + y, ' opacity=".55"');
    var a = n(tx(2020.25, x0, w)), b = n(tx(2025.2, x0, w));
    s += '<g class="vo5-seg-ink">' + P("M" + a + " " + y + " L" + b + " " + y, ' stroke-width="4"') +
      P("M" + a + " " + (y - 6) + " L" + a + " " + (y + 6)) + P("M" + b + " " + (y - 6) + " L" + b + " " + (y + 6)) + "</g>";
    s += '<text x="' + x0 + '" y="' + (y + 18) + '">' + T0 + "</text>";
    s += '<text x="' + (x0 + w) + '" y="' + (y + 18) + '" text-anchor="end">2026</text>';
    host.innerHTML = '<svg class="vo5-draw" viewBox="0 0 ' + W + ' 34" aria-hidden="true" focusable="false">' + s + "</svg>";
  }

  /* ══ list rows ═══════════════════════════════════════════════════════ */
  function pad2(i) { return (i < 10 ? "0" : "") + i; }

  function makeRow(o) {
    var a = el("a", "vo5-row vo5-rv");
    a.href = o.href;
    if (o.ext) { a.target = "_blank"; a.rel = "noopener"; }
    var meta = "";
    if (o.stamp) meta += '<span class="vo5-stamp">' + o.stamp + "</span>";
    if (o.status) meta += '<span class="vo5-row-status vo5-mono">' + o.status + "</span>";
    if (o.img) {
      meta += '<span class="vo5-row-thumb" aria-hidden="true"><span class="vo5-duo">' +
        '<img src="' + esc(o.img) + '" alt="" loading="lazy" width="54" height="72"></span></span>';
    }
    a.innerHTML =
      '<span class="vo5-row-no vo5-mono">' + o.no + "</span>" +
      '<span class="vo5-row-main">' +
        '<span class="vo5-row-title">' + o.title + "</span>" +
        '<span class="vo5-row-sub">' + o.sub + "</span>" +
      "</span>" +
      '<span class="vo5-row-meta">' + meta + "</span>" +
      '<span class="vo5-row-arrow" aria-hidden="true">→</span>';
    if (o.img) {
      a.dataset.img = o.img;
      bindPeek(a, o.no);
    }
    return a;
  }

  function fillRows(host, rows, seed) {
    host.innerHTML = "";
    rows.forEach(function (r, i) {
      if (i) {
        var rule = el("div", "vo5-hrule");
        rule.setAttribute("aria-hidden", "true");
        rule.innerHTML = ruleSVG(seed + i);
        host.appendChild(rule);
      }
      host.appendChild(r);
    });
  }

  function buildProjects() {
    var OZ = window.OZ, host = $("#vo5-projects");
    if (!host) return;
    var slugs = (OZ.t("projects.order") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var rows = slugs.map(function (slug, i) {
      return makeRow({
        href: "/models/claude-opus-5/projects/" + slug + "/",
        no: pad2(i + 1),
        title: '<span data-i18n="project.' + slug + '.title"></span>',
        sub: '<span data-i18n="project.' + slug + '.oneliner"></span>',
        stamp: '<span data-i18n="project.' + slug + '.kind"></span>',
        status: '<span data-i18n="project.' + slug + '.status"></span> · <span data-i18n="project.' + slug + '.year"></span>'
      });
    });
    fillRows(host, rows, 11);
    OZ.apply(host);
  }

  function buildTalks() {
    var OZ = window.OZ, host = $("#vo5-talks");
    if (!host) return;
    var slugs = (OZ.t("talks.featured") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var rows = slugs.map(function (slug, i) {
      return makeRow({
        href: "/models/claude-opus-5/talks/#" + slug,
        no: pad2(i + 1),
        title: '<span data-i18n="talk.' + slug + '.title"></span>',
        sub: '<span data-i18n="talk.' + slug + '.subtitle"></span>',
        stamp: '<span data-i18n="ui.vol"></span> ' + (OZ.t("talk." + slug + ".vol") || ""),
        img: OZ.t("talk." + slug + ".image") || ""
      });
    });
    fillRows(host, rows, 31);
    OZ.apply(host);
  }

  /* ══ founder case cards ══════════════════════════════════════════════ */
  function caseViz(k) {
    var s = "";
    if (k === 1) {
      // 0 → €11M growth curve
      s += P("M6 70 L276 70", ' opacity=".35"') + P("M6 70 L6 6", ' opacity=".35"');
      s += P("M10 68 C 70 67, 124 60, 170 44 C 212 29, 244 14, 270 8");
      s += '<circle data-fill cx="10" cy="68" r="3"/>';
      s += '<circle data-fill cx="270" cy="8" r="4.5"/>';
      s += P(ovalPath(46, 30), ' transform="translate(247 -7)" opacity=".85"');
    } else if (k === 2) {
      // Istanbul → Hamburg route
      s += P("M18 58 C 80 16, 170 10, 224 30 C 244 38, 256 36, 268 26", ' stroke-dasharray="1"');
      s += '<circle data-fill cx="18" cy="58" r="4.5"/>';
      s += '<circle data-fill cx="268" cy="26" r="4.5"/>';
      s += P("M268 26 L268 8 L292 14 L268 20", ' opacity=".9"');
      s += P("M86 28 L96 34 L86 40 M138 20 L148 26 L138 32 M190 22 L200 28 L190 34", ' opacity=".55"');
      s += P("M18 58 L18 72 M268 26 L268 72", ' opacity=".3"');
    } else if (k === 3) {
      // three rounds
      s += P("M6 72 L276 72", ' opacity=".35"');
      s += P("M14 68 L78 68 L78 48 L146 48 L146 28 L214 28 L214 10 L272 10");
      s += '<circle data-fill cx="78" cy="48" r="3.6"/><circle data-fill cx="146" cy="28" r="3.6"/><circle data-fill cx="214" cy="10" r="3.6"/>';
      s += P("M78 68 L78 72 M146 48 L146 72 M214 28 L214 72", ' opacity=".25"');
    } else {
      // 1,100+ enterprises as a dot matrix
      for (var r = 0; r < 5; r++) {
        for (var c = 0; c < 22; c++) {
          var on = (r * 22 + c) % 3 !== 2 && !(r === 4 && c > 15);
          s += '<circle data-fill class="' + (on ? "" : "vo5-dim") + '" cx="' + (8 + c * 12.6) + '" cy="' + (10 + r * 14) + '" r="3.1"/>';
        }
      }
    }
    return '<svg class="vo5-draw" viewBox="0 0 282 78" aria-hidden="true" focusable="false">' + s + "</svg>";
  }

  function splitStat(txt) {
    var words = String(txt).split(/\s+/);
    var last = -1;
    for (var i = 0; i < words.length; i++) if (/\d/.test(words[i])) last = i;
    if (last < 0 || last === words.length - 1) return [txt, ""];
    return [words.slice(0, last + 1).join(" "), words.slice(last + 1).join(" ")];
  }

  function buildCases() {
    var OZ = window.OZ, host = $("#vo5-cases");
    if (!host) return;
    host.innerHTML = "";
    for (var i = 1; i <= 4; i++) {
      var card = el("article", "vo5-case vo5-rv");
      card.innerHTML =
        '<span class="vo5-tape" aria-hidden="true"></span>' +
        '<div class="vo5-case-head vo5-mono">' +
          "<span><span data-i18n=\"ui.case\"></span> " + pad2(i) + "</span>" +
          '<span class="vo5-case-tag" data-i18n="founder.case' + i + '.tag"></span>' +
        "</div>" +
        '<p class="vo5-case-stat" data-stat="founder.case' + i + '.stat"></p>' +
        '<div class="vo5-case-viz">' + caseViz(i) + "</div>" +
        '<h3 class="vo5-case-title" data-i18n="founder.case' + i + '.title"></h3>' +
        '<p class="vo5-case-desc" data-i18n="founder.case' + i + '.desc"></p>';
      host.appendChild(card);
    }
    OZ.apply(host);
    renderStats();
  }

  function renderStats() {
    var OZ = window.OZ;
    $$("[data-stat]").forEach(function (p) {
      var parts = splitStat(OZ.t(p.dataset.stat) || "");
      p.innerHTML = '<span class="vo5-case-fig">' + esc(parts[0]) + "</span>" +
        (parts[1] ? '<span class="vo5-case-unit">' + esc(parts[1]) + "</span>" : "");
    });
  }

  /* ══ newsletter ══════════════════════════════════════════════════════ */
  function fmtDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    try {
      return d.toLocaleDateString(window.OZ.lang === "tr" ? "tr-TR" : "en-GB",
        { year: "numeric", month: "short", day: "2-digit" });
    } catch (e) { return iso.slice(0, 10); }
  }

  function renderPosts() {
    var OZ = window.OZ, host = $("#vo5-posts");
    if (!host) return;
    host.setAttribute("aria-busy", "false");
    if (state.postsError || !state.posts) {
      host.innerHTML = '<p class="vo5-mono vo5-state"><a href="https://thenextsignalnewsletter.substack.com/" target="_blank" rel="noopener" data-i18n="newsletter.error"></a></p>';
      OZ.apply(host);
      return;
    }
    if (!state.posts.length) {
      host.innerHTML = '<p class="vo5-mono vo5-state" data-i18n="newsletter.error"></p>';
      OZ.apply(host);
      return;
    }
    var rows = state.posts.map(function (p, i) {
      return makeRow({
        href: p.link, ext: true, no: pad2(i + 1),
        title: esc(p.title),
        sub: esc(p.excerpt || ""),
        status: esc(fmtDate(p.date)),
        img: p.image || ""
      });
    });
    fillRows(host, rows, 51);
    observeReveal(host);
  }

  function loadPosts() {
    window.OZ.latestPosts(3).then(function (items) {
      state.posts = items;
      renderPosts();
    }).catch(function () {
      state.postsError = true;
      renderPosts();
    });
  }

  /* ══ ink picker + toggles ════════════════════════════════════════════ */
  function buildInk(host, extras) {
    if (!host) return;
    host.innerHTML =
      '<p class="vo5-mono vo5-sidelabel" data-i18n="ui.ink"></p>' +
      '<div class="vo5-ink-row" role="group" data-i18n="[aria-label]ui.ink"></div>' +
      '<p class="vo5-mono vo5-ink-name"></p>' +
      (extras ? '<div class="vo5-toggles">' +
        '<button type="button" class="vo5-toggle" data-tog="pen"><span data-i18n="ui.pen_trail"></span> <b></b></button>' +
        '<button type="button" class="vo5-toggle" data-tog="calm"><span data-i18n="ui.calm_motion"></span> <b></b></button>' +
        "</div>" : "");
    var row = $(".vo5-ink-row", host);
    window.OZ.accents.forEach(function (a) {
      var b = el("button", "vo5-swatch");
      b.type = "button";
      b.dataset.accent = a.id;
      b.addEventListener("click", function () { window.OZ.setAccent(a.id); });
      row.appendChild(b);
    });
    $$(".vo5-toggle", host).forEach(function (b) {
      b.addEventListener("click", function () { toggle(b.dataset.tog); });
    });
    window.OZ.apply(host);
  }

  function renderInk() {
    var OZ = window.OZ;
    $$(".vo5-swatch").forEach(function (b) {
      var a = OZ.accents.filter(function (x) { return x.id === b.dataset.accent; })[0];
      if (!a) return;
      b.style.setProperty("--sw", OZ.theme === "dark" ? a.dark : a.light);
      b.setAttribute("aria-pressed", String(a.id === OZ.accent));
      b.setAttribute("aria-label", a.name[OZ.lang] || a.name.en);
      b.title = a.name[OZ.lang] || a.name.en;
    });
    var cur = OZ.accents.filter(function (x) { return x.id === OZ.accent; })[0];
    $$(".vo5-ink-name").forEach(function (p) { p.textContent = cur ? (cur.name[OZ.lang] || cur.name.en) : ""; });
    renderToggles();
  }

  function renderToggles() {
    var OZ = window.OZ;
    $$(".vo5-toggle").forEach(function (b) {
      var pen = b.dataset.tog === "pen";
      var on = pen ? (state.pen && mqFine.matches && !mqReduce.matches) : calm();
      b.setAttribute("aria-pressed", String(on));
      if (mqReduce.matches) b.setAttribute("aria-disabled", "true");
      var tag = $("b", b);
      if (tag) tag.textContent = OZ.t(on ? "ui.on" : "ui.off");
    });
  }

  function toggle(which) {
    if (which === "pen") {
      state.pen = !state.pen;
      document.body.classList.toggle("vo5-pen-on", state.pen && mqFine.matches && !mqReduce.matches);
      try { localStorage.setItem("vo5-pen", state.pen ? "1" : "0"); } catch (e) {}
    } else {
      state.calm = !state.calm;
      document.body.classList.toggle("vo5-calm", state.calm);
      if (state.calm) peekOff();
      try { localStorage.setItem("vo5-calm", state.calm ? "1" : "0"); } catch (e) {}
    }
    renderToggles();
  }

  /* ══ hover pictures ══════════════════════════════════════════════════ */
  var peek, peekImg, peekTimer = null;
  var PEEK_W = 182, PEEK_H = 236, PEEK_MIN = 1060;
  function canPeek() {
    return mqFine.matches && !mqReduce.matches && !state.calm && window.innerWidth >= PEEK_MIN;
  }

  function peekOff() { if (peek) peek.classList.remove("is-on"); }

  // The picture is pinned in the empty notebook margin beside the row, so it
  // never covers the line being read.
  function peekAt(row) {
    var src = row.dataset.img;
    if (!canPeek() || !src) return;
    if (peekImg.getAttribute("src") !== src) peekImg.setAttribute("src", src);
    var r = row.getBoundingClientRect();
    var left = Math.max(12, r.left - PEEK_W - 24);
    var top = Math.max(56, Math.min(window.innerHeight - PEEK_H - 16, r.top + r.height / 2 - PEEK_H / 2));
    var rot = (jit(5, parseInt(row.dataset.peekSeed || "0", 10)) - .5) * 7 - 1.5;
    peek.style.transform = "translate3d(" + Math.round(left) + "px," + Math.round(top) + "px,0) rotate(" + n(rot) + "deg)";
    peek.classList.add("is-on");
  }

  function bindPeek(row, seed) {
    row.dataset.peekSeed = seed;
    row.addEventListener("pointerenter", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      peekAt(row);
    });
    row.addEventListener("pointerleave", peekOff);
    row.addEventListener("focus", function () { peekAt(row); });
    row.addEventListener("blur", peekOff);
  }

  /* ══ pen trail ═══════════════════════════════════════════════════════ */
  function initPen() {
    var path = $("#vo5-pen-path");
    if (!path) return;
    var pts = [], fresh = false, raf = null;
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      if (!document.body.classList.contains("vo5-pen-on")) return;
      pts.push({ x: e.clientX, y: e.clientY });
      if (pts.length > 24) pts.shift();
      fresh = true;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    function tick() {
      raf = null;
      if (!fresh && pts.length) pts.shift();
      if (!fresh && pts.length) pts.shift();
      fresh = false;
      if (pts.length < 3) { path.setAttribute("d", ""); }
      else {
        var d = "M" + n(pts[0].x) + " " + n(pts[0].y);
        for (var i = 1; i < pts.length - 1; i++) {
          var mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2;
          d += " Q" + n(pts[i].x) + " " + n(pts[i].y) + " " + n(mx) + " " + n(my);
        }
        path.setAttribute("d", d);
      }
      if (pts.length) raf = requestAnimationFrame(tick);
    }
  }

  /* ══ reveal ══════════════════════════════════════════════════════════ */
  var io = null, ioDraw = null;
  function observeReveal(root) {
    if (!("IntersectionObserver" in window)) {
      $$(".vo5-rv", root || document).forEach(function (e) { e.classList.add("is-in"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: .05 });
    }
    $$(".vo5-rv:not(.is-in)", root || document).forEach(function (e) { io.observe(e); });
  }

  function observeDraw(root) {
    if (!("IntersectionObserver" in window)) {
      $$(".vo5-draw", root || document).forEach(function (e) { e.classList.add("is-in"); });
      return;
    }
    if (!ioDraw) {
      ioDraw = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); ioDraw.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -5% 0px", threshold: .08 });
    }
    $$(".vo5-draw:not(.is-in)", root || document).forEach(function (e) { ioDraw.observe(e); });
  }

  /* ══ misc wiring ═════════════════════════════════════════════════════ */
  function wireCopy() {
    var btn = $("#vo5-copy");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var addr = window.OZ.email();
      var done = function () {
        btn.removeAttribute("data-i18n");
        btn.textContent = window.OZ.t("ui.copied");
        clearTimeout(peekTimer);
        peekTimer = setTimeout(function () {
          btn.setAttribute("data-i18n", "ui.copy");
          btn.textContent = window.OZ.t("ui.copy");
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, done);
      } else { done(); }
    });
  }

  function renderDynamicCopy() {
    var OZ = window.OZ;
    var cr = $("#vo5-credit");
    if (cr) cr.textContent = (OZ.t("ui.credit") || "").replace("{model}", MODEL_NAME);
    var cta = $("#vo5-talks-cta");
    if (cta) cta.href = "mailto:" + OZ.email() + "?subject=" + encodeURIComponent(OZ.t("hero.cta_talks") || "Talks");
    var cap = $("#vo5-fig1-cap");
    if (cap) cap.textContent = OZ.t("hero.fig." + OZ.accent) || "";
  }

  /* ══ init ════════════════════════════════════════════════════════════ */
  function init() {
    var OZ = window.OZ;
    peek = $("#vo5-peek");
    peekImg = $("#vo5-peek-img");

    try {
      state.pen = localStorage.getItem("vo5-pen") !== "0";
      state.calm = localStorage.getItem("vo5-calm") === "1";
    } catch (e) { state.pen = true; }
    document.body.classList.toggle("vo5-calm", state.calm);
    document.body.classList.toggle("vo5-pen-on", state.pen && mqFine.matches && !mqReduce.matches);

    paintRules();
    buildInk($("#vo5-ink-hero"), true);
    buildInk($("#vo5-ink-foot"), false);
    renderInk();

    buildProjects();
    buildTalks();
    buildCases();
    buildFig2();
    buildFig3();
    buildMinibar();
    decorate();
    renderDynamicCopy();
    setScene(OZ.accent, false);
    wireCopy();
    initPen();
    loadPosts();

    observeReveal();
    observeDraw();
    fitMarks();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { fitMarks(); });
    }
    window.setTimeout(fitMarks, 400);
    window.setTimeout(fitMarks, 1400);

    var rt = null;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(fitMarks, 140);
    });
    window.addEventListener("scroll", peekOff, { passive: true });
    mqReduce.addEventListener("change", function () {
      document.body.classList.toggle("vo5-pen-on", state.pen && mqFine.matches && !mqReduce.matches);
      renderToggles();
    });

    document.addEventListener("oz:langchange", function () {
      decorate();
      renderStats();
      renderInk();
      renderDynamicCopy();
      renderPosts();
      fitMarks();
    });
    document.addEventListener("oz:themechange", function () { renderInk(); });
    document.addEventListener("oz:accentchange", function () {
      renderInk();
      setScene(window.OZ.accent, true);
    });
  }

  if (window.OZ && window.OZ.ready) window.OZ.ready.then(init);
  else document.addEventListener("oz:ready", init, { once: true });
})();
