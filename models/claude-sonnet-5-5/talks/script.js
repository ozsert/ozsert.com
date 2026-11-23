/* /talks/ — field-notebook explainer. Vanilla JS, inline SVG. All copy through OZ.t(). */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var MODEL = "Claude Sonnet 5.5";
  var VOLS = [
    ["industrial-revolution-internet-ai", "solopreneurship", "ai-agent-organizations", "corporate-memory"],
    ["ai-in-finance", "retail-silent-revolution", "ai-logistics-traceability", "next-gen-ecommerce"],
    ["new-role-of-humans", "ai-software-development", "ai-customer-experience", "ai-design-creativity"]
  ];
  var mqReduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return mqReduce.matches; }

  /* ---------- helpers ---------- */
  var labels = []; // text nodes refreshed on every language change
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function S(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    if (attrs && attrs["class"] && /\bv55-a\b/.test(attrs["class"])) e.setAttribute("pathLength", "1");
    if (parent) parent.appendChild(e);
    return e;
  }
  function H(tag, cls, parent, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function lab(el, fn, attr) { labels.push({ el: el, fn: fn, attr: attr }); return el; }
  function T(parent, attrs, fn) { var e = S("text", attrs, parent); return lab(e, fn); }
  function tk(key) { return function () { return OZ.t(key); }; }
  function tt(slug, k) { return OZ.t("talk." + slug + "." + k); }
  function leadOf(str) { var i = str.indexOf(":"); return i < 0 ? [str, ""] : [str.slice(0, i).trim(), str.slice(i + 1).trim()]; }
  function volTitle(v) {
    var s = OZ.t("talks.vol" + v + ".title"), i = s.indexOf(" - ");
    return i < 0 ? ["", s] : [s.slice(0, i), s.slice(i + 3)];
  }
  function volLabel(n) { return OZ.t("ui.vol") + n; }
  function wrap(str, max) {
    var words = str.split(" "), lines = [], cur = "";
    words.forEach(function (w) {
      if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function wrapText(parent, attrs, fn, max, lh) {
    var e = S("text", attrs, parent);
    labels.push({ el: e, wrap: true, fn: fn, max: max, lh: lh || 15, x: attrs.x });
    return e;
  }
  function featured() { return OZ.t("talks.featured").split(",").map(function (s) { return s.trim(); }); }

  /* roving-tabindex tablist */
  function tablist(box, items, onSel, initial) {
    var btns = [], cur = initial || 0;
    items.forEach(function (it, i) {
      var b = H("button", it.cls || "v55-tab", box);
      b.type = "button"; b.setAttribute("role", "tab");
      if (it.build) it.build(b, i);
      btns.push(b);
      b.addEventListener("click", function () { sel(i, false); });
      b.addEventListener("keydown", function (e) {
        var n = btns.length, j = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % n;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + n) % n;
        else if (e.key === "Home") j = 0; else if (e.key === "End") j = n - 1;
        if (j >= 0) { e.preventDefault(); sel(j, true); }
      });
    });
    function sel(i, focus) {
      cur = i;
      btns.forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); b.tabIndex = k === i ? 0 : -1; });
      if (focus) btns[i].focus();
      onSel(i);
    }
    return { select: sel, btns: btns, get: function () { return cur; } };
  }

  function focusX(svg, x, vbX, vbW) {
    var sc = svg.parentNode;
    if (!sc || sc.scrollWidth <= sc.clientWidth + 2) return;
    sc.scrollLeft = (x - vbX) / vbW * svg.getBoundingClientRect().width - sc.clientWidth / 2;
  }

  /* ---------- fill: all language-dependent text ---------- */
  function decorate(el, text, style, withDot) {
    var dot = false;
    text = text.trim();
    if (withDot && /\.$/.test(text)) { dot = true; text = text.slice(0, -1); }
    var m = text.match(/^(.*?)(\S+)$/);
    el.textContent = "";
    var pre = m ? m[1] : "", last = m ? m[2] : text;
    el.appendChild(document.createTextNode(pre));
    var u = H("span", "v55-ul" + (style === "dashed" ? " dashed" : ""), el);
    u.appendChild(document.createTextNode(last));
    var svg = S("svg", { viewBox: "0 0 200 15", preserveAspectRatio: "none", "aria-hidden": "true" }, u);
    var d = style === "wavy" ? "M2 8 C 14 2,28 14,42 8 S 70 2,84 8 S 112 14,126 8 S 154 2,168 8 S 190 12,198 8" : "M2 9 C 50 4, 120 12, 198 6";
    var p = S("path", { d: d, "class": style === "dashed" ? "v55-af" : "v55-a" }, svg);
    p.style.setProperty("--d", ".5s");
    if (dot) H("span", "v55-dot", el, ".");
  }

  function fill() {
    document.title = OZ.t("talks.page_title");
    decorate($("#v55-title"), OZ.t("talks.title"), "wavy", true);
    $$("[data-kicker]").forEach(function (e) { e.textContent = volTitle(+e.getAttribute("data-kicker").charAt(9))[0]; });
    $$("[data-chtitle]").forEach(function (e) {
      var v = +e.getAttribute("data-chtitle").charAt(9), s = volTitle(v)[1], u = e.getAttribute("data-ul");
      if (u) decorate(e, s, u, false); else e.textContent = s;
    });
    labels.forEach(function (l) {
      var v = l.fn();
      if (l.attr) { l.el.setAttribute(l.attr, v); return; }
      if (l.wrap) {
        l.el.textContent = "";
        wrap(v, l.max).forEach(function (ln, i) {
          var ts = S("tspan", { x: l.x, dy: i ? l.lh : 0 }, l.el); ts.textContent = ln;
        });
        return;
      }
      l.el.textContent = v;
    });
    $$("[data-oz-email]").forEach(function (a) { a.href = "mailto:" + OZ.email(); });
    var cr = $("#v55-credit"); if (cr) cr.textContent = OZ.t("projects.credit").replace("{model}", MODEL);
    cardsFill();
    var hint = $("#v55-herohint"); if (hint && !hint.getAttribute("data-live")) hint.textContent = "→ " + [1, 2, 3].map(volLabel).join("  ·  ");
  }

  /* ---------- cards ---------- */
  var cardEls = {};
  function buildCards() {
    VOLS.forEach(function (list, vi) {
      var box = $("#cards-" + (vi + 1));
      list.forEach(function (slug, ti) {
        var art = H("article", "v55-card", box); art.id = slug;
        var head = H("div", "v55-head", art);
        var ph = H("div", "v55-photo", head);
        var img = H("img", "", ph); img.loading = "lazy"; img.width = 1024; img.height = 1536; img.decoding = "async";
        H("span", "v55-num", ph, (vi + 1) + "." + (ti + 1));
        var star = H("span", "v55-star", ph, "★"); star.setAttribute("aria-hidden", "true"); star.hidden = true;
        var tx = H("div", "v55-cardtxt", head);
        var h3 = H("h3", "", tx);
        var btn = H("button", "v55-cardbtn", h3); btn.type = "button"; btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "p-" + slug);
        var sub = H("p", "v55-sub", tx), sum = H("p", "v55-sum", tx);
        var more = H("div", "v55-more", head);
        var chev = S("svg", { "class": "chev", viewBox: "0 0 20 20", "aria-hidden": "true" }, more); S("path", { d: "M4 7l6 6 6-6" }, chev);
        var mt = H("span", "", null, ""); more.insertBefore(mt, chev);
        var panel = H("div", "v55-panel", art); panel.id = "p-" + slug; panel.setAttribute("inert", "");
        var inner = H("div", "", panel);
        var ol = H("ol", "v55-keys", inner), lis = [];
        for (var k = 1; k <= 4; k++) { var li = H("li", "", ol); lis.push([H("b", "", li), H("span", "", li)]); }
        var inv = H("a", "v55-invite", inner);
        cardEls[slug] = { art: art, img: img, btn: btn, sub: sub, sum: sum, star: star, lis: lis, inv: inv, more: mt, panel: panel, vol: vi + 1 };
        btn.addEventListener("click", function () { toggle(slug); });
      });
    });
  }
  function setOpen(slug, open) {
    var c = cardEls[slug]; if (!c) return;
    c.art.classList.toggle("is-open", open);
    c.btn.setAttribute("aria-expanded", String(open));
    if (open) c.panel.removeAttribute("inert"); else c.panel.setAttribute("inert", "");
  }
  function toggle(slug) { setOpen(slug, !cardEls[slug].art.classList.contains("is-open")); }
  function cardsFill() {
    var feat = featured();
    Object.keys(cardEls).forEach(function (slug) {
      var c = cardEls[slug], title = tt(slug, "title");
      c.btn.textContent = title;
      c.img.src = tt(slug, "image"); c.img.alt = title;
      c.sub.textContent = tt(slug, "subtitle"); c.sum.textContent = tt(slug, "summary");
      c.star.hidden = feat.indexOf(slug) < 0;
      for (var k = 1; k <= 4; k++) {
        var p = leadOf(tt(slug, "k" + k));
        c.lis[k - 1][0].textContent = p[0]; c.lis[k - 1][1].textContent = p[1];
      }
      c.more.textContent = OZ.t("ui.view");
      c.inv.textContent = OZ.t("talks.invite") + " →";
      c.inv.href = "mailto:" + OZ.email() + "?subject=" + encodeURIComponent(title);
    });
  }
  function openFromHash(scroll) {
    var id = decodeURIComponent((location.hash || "").slice(1));
    if (!id || !cardEls[id]) return;
    setOpen(id, true);
    var a = cardEls[id].art;
    a.classList.remove("is-flash"); void a.offsetWidth; a.classList.add("is-flash");
    if (scroll) a.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
  }

  /* ---------- fig. 1: three notebooks ---------- */
  function buildHero() {
    var svg = $("#v55-hero-svg"), hint = $("#v55-herohint");
    var xs = [78, 365, 652], lean = [-3, 1.8, -1.6];
    // desk line
    var desk = S("path", { "class": "ln-m v55-a", d: "M20 304 C 200 300, 380 308, 560 303 S 820 300, 940 305", style: "--d:0s" }, svg);
    // signal arcs top-right (the page's motif)
    [16, 30, 44].forEach(function (r, i) {
      S("path", { "class": "ln-a v55-a", d: "M" + (900 + r * .7) + " " + (40 - r * .7) + " A " + r + " " + r + " 0 0 1 " + (900 + r * .7) + " " + (40 + r * .7), style: "--d:" + (1.4 + i * .2) + "s" }, svg);
    });
    S("circle", { cx: 900, cy: 40, r: 4, "class": "fill-a v55-af", style: "--d:1.3s" }, svg);
    for (var i = 0; i < 3; i++) {
      (function (i) {
        var a = S("a", { "class": "v55-nb", href: "#vol" + (i + 1), tabindex: 0 }, svg);
        lab(a, function () { return volLabel(i + 1) + " — " + volTitle(i + 1)[1]; }, "aria-label");
        var outer = S("g", { transform: "translate(" + xs[i] + " 28) rotate(" + lean[i] + " 115 262)" }, a);
        var body = S("g", { "class": "nb-body" }, outer); body.style.setProperty("--lean", (lean[i] * -.4) + "deg");
        var dl = i * .25;
        S("rect", { x: 10, y: 10, width: 224, height: 258, rx: 5, "class": "ln-m fill-p" }, body);
        S("rect", { x: 5, y: 5, width: 224, height: 258, rx: 5, "class": "ln-m fill-p" }, body);
        S("rect", { x: 0, y: 0, width: 230, height: 262, rx: 6, "class": "nb-cover ln fill-c v55-a", style: "--d:" + dl + "s" }, body);
        // spiral rings
        for (var r = 0; r < 8; r++) {
          S("path", { "class": "ln v55-a", d: "M-7 " + (22 + r * 31) + " q 10 -9 22 0", style: "--d:" + (dl + .5 + r * .05) + "s" }, body);
          S("circle", { cx: 16, cy: 22 + r * 31, r: 2.4, "class": "ln-m" }, body);
        }
        // index tabs (4 talks)
        for (var t = 0; t < 4; t++) S("rect", { x: 230, y: 38 + t * 52, width: 15, height: 34, rx: 2, "class": "ln-m fill-p v55-af", style: "--d:" + (dl + .9 + t * .1) + "s" }, body);
        S("rect", { x: 230, y: 38 + (i % 4) * 52, width: 15, height: 34, rx: 2, "class": "ln-a fill-w v55-af", style: "--d:" + (dl + 1.1) + "s" }, body);
        // label
        T(body, { x: 38, y: 46, "class": "t t-a", style: "font-size:15px" }, function () { return OZ.t("ui.vol"); });
        S("text", { x: 36, y: 128, "class": "nb-num" }, body).textContent = String(i + 1);
        // motif
        var g = S("g", { transform: "translate(34 150)" }, body);
        if (i === 0) {
          [0, 1, 2].forEach(function (w) {
            S("path", { "class": (w === 2 ? "ln-a" : "ln-m") + " v55-a", d: "M0 " + (22 + w * 24) + " q 22 " + (-18 - w * 6) + " 44 0 t 44 0 t 44 0 t 44 0", style: "--d:" + (dl + .8 + w * .2) + "s" }, g);
          });
        } else if (i === 1) {
          var pts = [[8, 40], [58, 14], [108, 52], [160, 18], [150, 82], [40, 88]];
          [[0, 1], [1, 2], [2, 3], [2, 4], [0, 5], [5, 2]].forEach(function (e, n) {
            S("path", { "class": "ln-m v55-a", d: "M" + pts[e[0]] + " L" + pts[e[1]], style: "--d:" + (dl + .8 + n * .08) + "s" }, g);
          });
          pts.forEach(function (p, n) { S("circle", { cx: p[0], cy: p[1], r: n === 2 ? 7 : 4.5, "class": (n === 2 ? "fill-a" : "fill-c ln") + " v55-af", style: "--d:" + (dl + 1.2) + "s" }, g); });
        } else {
          S("circle", { cx: 50, cy: 52, r: 40, "class": "ln v55-a", style: "--d:" + (dl + .8) + "s" }, g);
          S("circle", { cx: 100, cy: 52, r: 40, "class": "ln-a v55-a", style: "--d:" + (dl + 1) + "s" }, g);
          S("path", { "class": "ln-a fill-w v55-af", d: "M75 18.5 A40 40 0 0 1 75 85.5 A40 40 0 0 1 75 18.5Z", style: "--d:" + (dl + 1.6) + "s;stroke:none" }, g);
        }
        S("rect", { x: -9, y: -9, width: 248, height: 280, rx: 9, "class": "nb-focus" }, body);
        function on() { hint.setAttribute("data-live", "1"); hint.textContent = volLabel(i + 1) + " — " + volTitle(i + 1)[1]; $$(".v55-nb").forEach(function (n) { n.classList.toggle("is-on", n === a); }); }
        function off() { hint.removeAttribute("data-live"); hint.textContent = "→ " + [1, 2, 3].map(volLabel).join("  ·  "); a.classList.remove("is-on"); }
        a.addEventListener("mouseenter", on); a.addEventListener("focus", on);
        a.addEventListener("mouseleave", off); a.addEventListener("blur", off);
      })(i);
    }
  }

  /* ---------- fig. 2: three waves, four lenses ---------- */
  function buildLens() {
    var svg = $("#v55-lens-svg"), read = $("#v55-lens-read"), slug = VOLS[0][0];
    var cx = [130, 360, 590];
    function names() { var p = OZ.t("talk." + slug + ".title").split(/,\s+(?:and\s+)?|\s+and\s+|\s+ve\s+/); return p; }
    function nm(i) { return function () { var n = names(); return n[i] || ""; }; }
    var groups = [];
    function grp() { var g = S("g", { "class": "v55-lens" }, svg); g.style.display = "none"; groups.push(g); return g; }
    function colNames(g) {
      cx.forEach(function (x, i) {
        T(g, { x: x, y: 328, "text-anchor": "middle", "class": "t t-f v55-af", style: "font-size:13px;--d:.2s" }, nm(i));
        S("text", { x: x, y: 40, "text-anchor": "middle", "class": "t t-a v55-af", style: "--d:.1s" }, g).textContent = "0" + (i + 1);
        S("path", { "class": "ln-m v55-a", d: "M" + (x - 70) + " 296 L" + (x + 70) + " 296" }, g);
      });
    }
    // 1 labour
    var g0 = grp(); colNames(g0);
    (function () {
      var y = 160, g = S("g", { transform: "translate(130 " + y + ")" }, g0);
      S("circle", { r: 24, "class": "ln v55-a" }, g); S("circle", { r: 8, "class": "ln-m v55-a", style: "--d:.3s" }, g);
      for (var a = 0; a < 8; a++) { var r = a * Math.PI / 4; S("path", { "class": "ln v55-a", d: "M" + (Math.cos(r) * 24).toFixed(1) + " " + (Math.sin(r) * 24).toFixed(1) + " L" + (Math.cos(r) * 36).toFixed(1) + " " + (Math.sin(r) * 36).toFixed(1), style: "--d:" + (.2 + a * .05) + "s" }, g); }
      var p = S("g", { transform: "translate(360 " + y + ")" }, g0);
      S("path", { "class": "ln v55-a", d: "M-30 -42 H14 L30 -26 V42 H-30 Z", style: "--d:.4s" }, p);
      S("path", { "class": "ln-m v55-a", d: "M14 -42 V-26 H30", style: "--d:.7s" }, p);
      [-14, 0, 14, 28].forEach(function (yy, n) { S("path", { "class": "ln-m v55-a", d: "M-18 " + yy + " H" + (n === 3 ? 4 : 18), style: "--d:" + (.8 + n * .1) + "s" }, p); });
      var c = S("g", { transform: "translate(590 " + y + ")" }, g0);
      var nodes = [[0, -30], [-30, 20], [30, 20], [0, 4]];
      [[0, 3], [1, 3], [2, 3], [0, 1], [0, 2], [1, 2]].forEach(function (e, n) { S("path", { "class": "ln-a v55-a", d: "M" + nodes[e[0]] + " L" + nodes[e[1]], style: "--d:" + (.6 + n * .08) + "s" }, c); });
      nodes.forEach(function (n, i2) { S("circle", { cx: n[0], cy: n[1], r: i2 === 3 ? 9 : 6, "class": (i2 === 3 ? "fill-a" : "fill-c ln-a") + " v55-af", style: "--d:1.1s" }, c); });
      [[-46, -44], [46, -40], [50, 34]].forEach(function (s, n) { S("path", { "class": "ln-a v55-a", d: "M" + (s[0] - 6) + " " + s[1] + " H" + (s[0] + 6) + " M" + s[0] + " " + (s[1] - 6) + " V" + (s[1] + 6), style: "--d:" + (1.3 + n * .15) + "s" }, c); });
      [[200, 160, 290], [430, 160, 520]].forEach(function (a, n) {
        S("path", { "class": "ln-m v55-a", d: "M" + a[0] + " " + a[1] + " C " + (a[0] + 30) + " " + (a[1] - 30) + ", " + (a[2] - 30) + " " + (a[1] - 30) + ", " + a[2] + " " + a[1], style: "--d:" + (.9 + n * .2) + "s" }, g0);
        S("path", { "class": "ln-m v55-a", d: "M" + (a[2] - 9) + " " + (a[1] - 8) + " L" + a[2] + " " + a[1] + " L" + (a[2] - 10) + " " + (a[1] + 4), style: "--d:" + (1.4 + n * .2) + "s" }, g0);
      });
    })();
    // 2 speed
    var g1 = grp();
    (function () {
      S("path", { "class": "ln v55-a", d: "M40 296 H700 M40 296 V24 M692 290 L700 296 L692 302 M34 32 L40 24 L46 32" }, g1);
      var params = [[.011, 440, "ln-m"], [.021, 350, "ln-m"], [.052, 262, "ln-a"]];
      params.forEach(function (p, i) {
        var d = "";
        for (var x = 40; x <= 690; x += 10) { var y = 290 - 250 / (1 + Math.exp(-p[0] * (x - p[1]))); d += (x === 40 ? "M" : "L") + x + " " + y.toFixed(1) + " "; }
        S("path", { "class": p[2] + " v55-a", d: d, style: "--d:" + (.3 + i * .35) + "s;stroke-width:" + (i === 2 ? 3.2 : 1.9) }, g1);
        var ly = 236 + i * 20;
        S("path", { "class": p[2], d: "M470 " + (ly - 4) + " h26", style: "stroke-width:" + (i === 2 ? 3.2 : 1.9) }, g1);
        T(g1, { x: 504, y: ly, "class": "t t-f" + (i === 2 ? " t-a" : ""), style: "font-size:13px" }, nm(i));
      });
    })();
    // 3 power
    var g2 = grp(); colNames(g2);
    (function () {
      var leaders = [0, 1, 2], hs = [[150, 96, 64], [78, 160, 100], [70, 104, 190]];
      cx.forEach(function (x, i) {
        for (var b = 0; b < 3; b++) {
          var lead = b === leaders[i], bx = x - 66 + b * 46, h = hs[i][b];
          S("rect", { x: bx, y: 296 - h, width: 38, height: h, "class": (lead ? "ln-a fill-w" : "ln-m fill-c") + " v55-a", style: "--d:" + (.2 + i * .35 + b * .1) + "s" }, g2);
          if (lead) {
            var sx = bx + 19, sy = 296 - h - 16;
            S("path", { "class": "ln-a v55-af", d: "M" + sx + " " + (sy - 10) + " l3 7 7 .5 -5.5 4.5 2 7 -6.5 -4 -6.5 4 2 -7 -5.5 -4.5 7 -.5z", style: "--d:" + (.9 + i * .35) + "s;fill:var(--ink)" }, g2);
          }
        }
      });
    })();
    // 4 today
    var g3 = grp();
    (function () {
      var pts = function (x0, x1) { var d = ""; for (var x = x0; x <= x1; x += 8) d += (d ? "L" : "M") + x + " " + (170 - Math.sin((x - 40) / 62) * 62 - (x - 40) * .08).toFixed(1) + " "; return d; };
      var wy = function (x) { return 170 - Math.sin((x - 40) / 62) * 62 - (x - 40) * .08; };
      S("path", { "class": "ln-m v55-a", d: pts(40, 440) }, g3);
      S("path", { "class": "ln-a v55-a", d: pts(440, 690), style: "--d:.9s" }, g3);
      S("path", { "class": "ln-m dash v55-af", d: "M440 30 V300" }, g3);
      T(g3, { x: 440, y: 22, "text-anchor": "middle", "class": "t t-a v55-af" }, function () { return leadOf(OZ.t("talk." + slug + ".k4"))[0]; });
      // adapting: rides behind the wave; leading: ahead of the crest
      S("circle", { cx: 372, cy: wy(372) - 2, r: 8, "class": "fill-c ln-m v55-af", style: "--d:1s" }, g3);
      S("circle", { cx: 548, cy: wy(548) - 2, r: 11, "class": "fill-a v55-af", style: "--d:1.4s" }, g3);
      S("circle", { cx: 548, cy: wy(548) - 2, r: 19, "class": "ln-a dash v55-af", style: "--d:1.5s" }, g3);
      var ay = wy(548) - 36;
      S("path", { "class": "ln-a v55-a", d: "M552 " + (ay + 4) + " q 40 -26 92 -6 M633 " + (ay - 14) + " L646 " + (ay - 2) + " L630 " + (ay + 3), style: "--d:1.7s" }, g3);
    })();

    var lenses = [0, 1, 2, 3];
    var tabs = tablist($("#v55-lens-tabs"), lenses.map(function (n) {
      return { build: function (b) { b.id = "lens-tab-" + n; lab(b, function () { return leadOf(OZ.t("talk." + slug + ".k" + (n + 1)))[0]; }); } };
    }), function (i) {
      groups.forEach(function (g, k) { g.style.display = k === i ? "" : "none"; });
      focusX(svg, i === 3 ? 520 : 360, 0, 720);
      renderRead();
    }, 0);
    function renderRead() {
      var p = leadOf(OZ.t("talk." + slug + ".k" + (tabs.get() + 1)));
      read.textContent = ""; H("b", "", read, p[0] + ": "); read.appendChild(document.createTextNode(p[1]));
    }
    tabs.select(0, false);
    document.addEventListener("oz:langchange", renderRead);
    return renderRead;
  }

  /* ---------- fig. 3: the route (sectors) ---------- */
  var ICONS = [
    '<circle cx="16" cy="16" r="12"/><path d="M8 20l6-6 4 4 7-8"/>',
    '<path d="M6 11h20l-2 17H8z"/><path d="M11 11V9a5 5 0 0 1 10 0v2"/>',
    '<path d="M2 8h17v14H2z"/><path d="M19 12h6l5 5v5H19z"/><circle cx="8" cy="25" r="2.6"/><circle cx="24" cy="25" r="2.6"/>',
    '<path d="M2 5h5l4 16h15l3-11H9"/><circle cx="13" cy="26" r="2.2"/><circle cx="24" cy="26" r="2.2"/>'
  ];
  function buildRoute() {
    var svg = $("#v55-route-svg"), list = VOLS[1], sector = 2, leaf = 0, pos = null;
    // bridge sketch (Bosphorus nod)
    S("path", { "class": "ln-m v55-a", d: "M30 70 H230 M90 70 V18 M170 70 V18 M30 70 C 55 46, 75 30, 90 18 C 110 46, 150 46, 170 18 C 185 30, 205 48, 230 70", style: "--d:.2s" }, svg);
    S("path", { "class": "ln-m dash v55-af", d: "M30 86 C 80 94, 130 80, 180 88 S 230 84, 250 86", style: "--d:1s" }, svg);
    var pathD = "M24 190 C 110 100, 190 250, 290 170 S 430 70, 520 160 S 640 220, 698 120";
    S("path", { "class": "ln-m dash", d: pathD, transform: "translate(0 10)", opacity: ".6" }, svg);
    var route = S("path", { "class": "ln v55-a", d: pathD, style: "stroke-width:2.2" }, svg);
    var prog = S("path", { "class": "ln-a", d: pathD, style: "stroke-width:4.5" }, svg);
    var len = route.getTotalLength();
    prog.setAttribute("stroke-dasharray", len + " " + len); prog.setAttribute("stroke-dashoffset", len);
    var parcel = S("g", {}, svg);
    S("rect", { x: -8, y: -8, width: 16, height: 16, rx: 3, "class": "fill-a", transform: "rotate(45)" }, parcel);
    S("circle", { r: 14, "class": "ln-a dash", style: "opacity:.7" }, parcel);
    var fr = [.1, .36, .64, .92], nodes = [];
    fr.forEach(function (f, i) {
      var p = route.getPointAtLength(len * f);
      var g = S("g", { "class": "v55-hot v55-af", "aria-hidden": "true", style: "--d:" + (.8 + i * .2) + "s" }, svg);
      S("circle", { cx: p.x, cy: p.y, r: 25, "class": "hot-ring" }, g);
      var c = S("circle", { cx: p.x, cy: p.y, r: 17, "class": "fill-c ln" }, g);
      var tx = S("text", { x: p.x, y: p.y + 4, "text-anchor": "middle", "class": "t t-f", style: "font-size:11px" }, g); tx.textContent = "2." + (i + 1);
      g.addEventListener("click", function () { tabs.select(i, false); });
      nodes.push({ p: p, c: c, tx: tx, f: f });
    });
    var cur = 0, raf = 0;
    function place(f) { var p = route.getPointAtLength(len * f); parcel.setAttribute("transform", "translate(" + p.x + " " + p.y + ")"); prog.setAttribute("stroke-dashoffset", len * (1 - f)); cur = f; }
    function travel(to) {
      cancelAnimationFrame(raf);
      if (reduced()) { place(to); return; }
      var from = cur, t0 = performance.now(), dur = 900;
      (function step(now) {
        var k = Math.min(1, (now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        place(from + (to - from) * e);
        if (k < 1) raf = requestAnimationFrame(step);
      })(t0);
    }
    place(fr[0]); // start at the first stop; moves on first select
    var titleBox = $("#v55-route-title"), read = $("#v55-route-read");
    var tabs = tablist($("#v55-route-tabs"), list.map(function (slug, i) {
      return { build: function (b) {
        var ic = S("svg", { viewBox: "0 0 32 32", "aria-hidden": "true" }, b); ic.innerHTML = ICONS[i];
        H("span", "", b, "2." + (i + 1));
        lab(b, function () { return tt(slug, "title"); }, "aria-label"); lab(b, function () { return tt(slug, "title"); }, "title");
      } };
    }), function (i) {
      sector = i;
      nodes.forEach(function (n, k) { n.c.setAttribute("class", k === i ? "fill-a ln-a" : "fill-c ln"); n.tx.setAttribute("class", "t " + (k === i ? "" : "t-f")); n.tx.style.fill = k === i ? "var(--paper)" : ""; });
      travel(nodes[i].f); focusX(svg, nodes[i].p.x, 0, 720);
      renderLeaves(); leafTabs.select(leaf = Math.min(leaf, 3), false); renderInfo();
    }, 2);
    var leafTabs = tablist($("#v55-leaves"), [0, 1, 2, 3].map(function (k) {
      return { cls: "v55-leaf", build: function (b) { var i = H("i", "", b, String(k + 1)); var s = H("span", "", b); lab(s, function () { return leadOf(tt(list[sector], "k" + (k + 1)))[0]; }); } };
    }), function (k) { leaf = k; renderInfo(); }, 0);
    function renderLeaves() { /* labels refresh through fill() */ labels.forEach(function (l) { if (l.el.parentNode && l.el.closest && l.el.closest("#v55-leaves")) l.el.textContent = l.fn(); }); }
    function renderInfo() {
      var slug = list[sector];
      titleBox.textContent = tt(slug, "title"); H("small", "", titleBox, tt(slug, "subtitle"));
      var p = leadOf(tt(slug, "k" + (leaf + 1)));
      read.textContent = ""; H("b", "", read, p[0] + ": "); read.appendChild(document.createTextNode(p[1]));
    }
    tabs.select(2, false);
    cancelAnimationFrame(raf); place(nodes[2].f);
    document.addEventListener("oz:langchange", function () { renderLeaves(); renderInfo(); });
  }

  /* ---------- fig. 4: human + AI venn ---------- */
  function buildVenn() {
    var svg = $("#v55-venn-svg"), range = $("#v55-venn-range"), read = $("#v55-venn-read"), list = VOLS[2];
    var HX = 500, CY = 165, R = 118, sel = 1;
    var defs = S("defs", {}, svg), cp = S("clipPath", { id: "v55-clip" }, defs), cc = S("circle", { cx: HX, cy: CY, r: R }, cp);
    var inter = S("circle", { cx: 200, cy: CY, r: R, "class": "fill-a", "clip-path": "url(#v55-clip)", style: "opacity:.2" }, svg);
    var human = S("circle", { cx: HX, cy: CY, r: R, "class": "ln v55-a" }, svg);
    var ai = S("circle", { cx: 200, cy: CY, r: R, "class": "ln-a v55-a", style: "--d:.4s" }, svg);
    var bridge = S("path", { "class": "ln-m dash", d: "" }, svg);
    wrapText(svg, { x: HX + 72, y: CY - 2, "text-anchor": "middle", "class": "t t-f", style: "font-size:13px" }, function () { return leadOf(OZ.t("talk." + list[0] + ".k1"))[0]; }, 10, 16);
    var aiLab = S("text", { x: 150, y: CY + 10, "text-anchor": "middle", "class": "t-big t-a", style: "font:600 40px var(--sans);fill:var(--ink);letter-spacing:-.03em" }, svg); aiLab.textContent = "AI";
    var colLab = T(svg, { x: 350, y: CY + 4, "text-anchor": "middle", "class": "t t-a", style: "font-size:13px;font-weight:600" }, function () { return leadOf(OZ.t("talk." + list[0] + ".k2"))[0]; });
    var markers = [];
    list.forEach(function (slug, i) {
      var g = S("g", { "class": "v55-hot", "aria-hidden": "true" }, svg);
      var ring = S("circle", { r: 20, "class": "hot-ring" }, g);
      var c = S("circle", { r: 14, "class": "fill-c ln" }, g);
      var tx = S("text", { "text-anchor": "middle", y: 4, "class": "t t-f", style: "font-size:11px" }, g); tx.textContent = "3." + (i + 1);
      g.addEventListener("click", function () { tabs.select(i, false); });
      markers.push({ g: g, c: c, tx: tx });
    });
    var tabs = tablist($("#v55-venn-tabs"), list.map(function (slug, i) {
      return { cls: "v55-leaf", build: function (b) { H("i", "", b, "3." + (i + 1)); var s = H("span", "", b); lab(s, function () { return tt(slug, "title"); }); b.style.maxWidth = "100%"; s.style.whiteSpace = "normal"; } };
    }), function (i) { sel = i; renderRead(); layout(); }, 1);
    var labEl = $("#v55-venn-label"); lab(labEl, function () { return leadOf(OZ.t("talk." + list[0] + ".k2"))[0]; });
    function layout() {
      var v = +range.value / 100, ax = 190 + v * 210;
      ai.setAttribute("cx", ax); inter.setAttribute("cx", ax);
      aiLab.setAttribute("x", ax - 36);
      var mid = (ax + HX) / 2, ov = Math.max(0, Math.min(1, (2 * R - (HX - ax)) / (2 * R)));
      colLab.setAttribute("x", mid); colLab.setAttribute("y", CY - 2);
      colLab.style.opacity = ov > .22 ? Math.min(1, (ov - .22) * 4) : 0;
      inter.style.opacity = .12 + ov * .22;
      var gap = HX - R - (ax + R);
      bridge.setAttribute("d", gap > 4 ? "M" + (ax + R) + " " + CY + " L" + (HX - R) + " " + CY : "");
      focusX(svg, mid, 56, 580);
      var spots = [[HX + 70, CY - 70], [ax - 66, CY - 70], [mid, CY - 52], [mid, CY + 50]];
      if (ov > .22) { spots[2][1] = CY - 66; spots[3][1] = CY + 66; }
      markers.forEach(function (m, i) {
        m.g.setAttribute("transform", "translate(" + spots[i][0].toFixed(1) + " " + spots[i][1] + ")");
        m.c.setAttribute("class", i === sel ? "fill-a ln-a" : "fill-c ln"); m.tx.style.fill = i === sel ? "var(--paper)" : "";
      });
    }
    function renderRead() {
      var slug = list[sel];
      read.textContent = ""; H("b", "", read, tt(slug, "title") + " — "); read.appendChild(document.createTextNode(tt(slug, "summary")));
    }
    range.addEventListener("input", layout);
    tabs.select(1, false); layout();
    document.addEventListener("oz:langchange", renderRead);
  }

  /* ---------- reveal on scroll ---------- */
  function observe() {
    var els = $$(".v55-hero h1, .v55-h2, .v55-fig");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("v55-in"); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("v55-in"); io.unobserve(en.target); } });
    }, { threshold: .2 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- init ---------- */
  OZ.ready.then(function () {
    buildCards();
    buildHero();
    buildLens();
    buildRoute();
    buildVenn();
    fill();
    observe();
    document.addEventListener("oz:langchange", fill);
    window.addEventListener("hashchange", function () { openFromHash(true); });
    if (location.hash) {
      openFromHash(true);
      setTimeout(function () { openFromHash(true); }, 600); // fonts/images settle
    }
  });
})();
