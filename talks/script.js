/* ozsert.com /talks/ — "the speaker's card catalogue"
   Built by Claude Opus 5.5. Vanilla JS, inline SVG, all copy via window.OZ. */
(function () {
  "use strict";

  var MODEL_NAME = "Claude Opus 5.5";
  var SVGNS = "http://www.w3.org/2000/svg";
  var VOLS = [
    { n: 1, slugs: ["industrial-revolution-internet-ai", "solopreneurship", "ai-agent-organizations", "corporate-memory"] },
    { n: 2, slugs: ["ai-in-finance", "retail-silent-revolution", "ai-logistics-traceability", "next-gen-ecommerce"] },
    { n: 3, slugs: ["new-role-of-humans", "ai-software-development", "ai-customer-experience", "ai-design-creativity"] }
  ];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------ helpers */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function sv(tag, attrs) {
    var e = document.createElementNS(SVGNS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }
  function t(k) { return window.OZ.t(k); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function featured() {
    return t("talks.featured").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function volParts(n) {
    var full = t("talks.vol" + n + ".title");
    var i = full.indexOf(" - ");
    return i < 0 ? { kicker: "", title: full } : { kicker: full.slice(0, i), title: full.slice(i + 3) };
  }
  function splitPoint(s) {
    var i = s.indexOf(":");
    return i < 0 ? { lead: s, rest: "" } : { lead: s.slice(0, i), rest: s.slice(i + 1).trim() };
  }
  function volLabel(n) { return t("ui.vol") + " " + n; }
  function mailto(subject) {
    return "mailto:" + window.OZ.email() + (subject ? "?subject=" + encodeURIComponent(subject) : "");
  }
  // deterministic wobble so the "hand" is the same on every render
  function rng(seed) {
    var s = seed % 2147483647; if (s <= 0) s += 2147483646;
    return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; };
  }
  function poly(pts) {
    return pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
  }
  function drawIn(path) {
    if (reduce || !path) return;
    path.setAttribute("pathLength", "1");
    path.style.strokeDasharray = "1";
    path.style.strokeDashoffset = "1";
    path.getBoundingClientRect();
    path.style.transition = "stroke-dashoffset .8s cubic-bezier(.6,.1,.2,1)";
    requestAnimationFrame(function () { path.style.strokeDashoffset = "0"; });
  }

  /* underline styles for headings (vary per section) */
  var UNDERLINES = [
    "M2 8 C 40 3, 120 2, 198 6",                                              // sweep
    "M2 6 Q 14 1, 26 6 T 50 6 T 74 6 T 98 6 T 122 6 T 146 6 T 170 6 T 198 6", // wavy
    "M2 4 C 60 2, 140 3, 198 4 M8 9 C 70 7, 130 8, 192 9",                     // double
    "M2 7 C 50 9, 150 1, 198 5"                                               // rising
  ];
  function underlined(text, phrase, style) {
    var frag = document.createDocumentFragment();
    var i = phrase ? text.lastIndexOf(phrase) : -1;
    if (i < 0) { frag.appendChild(document.createTextNode(text)); return frag; }
    frag.appendChild(document.createTextNode(text.slice(0, i)));
    var span = el("span", { class: "vo55-ul" }, [document.createTextNode(phrase)]);
    var svg = sv("svg", { viewBox: "0 0 200 12", preserveAspectRatio: "none", "aria-hidden": "true" });
    var p = sv("path", { d: UNDERLINES[style % UNDERLINES.length], pathLength: "1" });
    svg.appendChild(p); span.appendChild(svg);
    frag.appendChild(span);
    frag.appendChild(document.createTextNode(text.slice(i + phrase.length)));
    return frag;
  }
  function lastWord(s) {
    var w = s.replace(/[.!?]+$/, "").trim().split(/\s+/);
    return w[w.length - 1];
  }

  /* ------------------------------------------------------------ state */
  var open = {};           // slug -> true
  var figSel = { 1: 0, 2: 0, 3: 0 };
  var figs = {};           // vol -> api

  /* ============================================================ HERO */
  function renderHero() {
    var h1 = $("#vo55-h1");
    var title = t("talks.title");
    var dot = /\.$/.test(title);
    var body = dot ? title.slice(0, -1) : title;
    h1.textContent = "";
    h1.appendChild(underlined(body, lastWord(body), 0));
    if (dot) h1.appendChild(el("span", { class: "vo55-dot", "aria-hidden": "true", text: "." }));

    var intro = t("talks.page_intro").split(/\.\s+/);
    $("#vo55-venue-l").textContent = (intro[1] || intro[0]).replace(/\.$/, "");

    var feat = featured();
    var host = $("#vo55-boxes");
    host.textContent = "";
    VOLS.forEach(function (v) {
      var a = el("a", { class: "vo55-box", href: "#vol-" + v.n });
      var svg = sv("svg", { viewBox: "0 0 220 176", "aria-hidden": "true" });
      var r = rng(v.n * 97);
      // cards standing in the box, with tabs
      var cards = sv("g", { class: "vo55-box-cards" });
      v.slugs.forEach(function (slug, i) {
        var x = 30 + i * 6, y = 44 + i * 12 - (i % 2) * 4, w = 160;
        var g = sv("g", { class: "vo55-box-card", style: "--d:" + (i * 60) + "ms" });
        var j = function () { return (r() - .5) * 1.4; };
        g.appendChild(sv("path", {
          class: "vo55-card-sheet",
          d: "M" + (x + j()) + " " + (y + 10) + " L" + (x + w + j()) + " " + (y + 10 + j()) + " L" + (x + w) + " 140 L" + x + " 140 Z"
        }));
        var tx = x + 12 + i * 34;
        g.appendChild(sv("path", {
          class: "vo55-card-tab",
          d: "M" + tx + " " + (y + 10) + " L" + (tx + 3) + " " + (y + j()) + " L" + (tx + 31) + " " + (y + j()) + " L" + (tx + 34) + " " + (y + 10)
        }));
        var lab = sv("text", { x: tx + 17, y: y + 8, "text-anchor": "middle", class: "vo55-tabtxt" + (feat.indexOf(slug) >= 0 ? " is-feat" : "") });
        lab.textContent = feat.indexOf(slug) >= 0 ? "★" : v.n + "." + (i + 1);
        g.appendChild(lab);
        cards.appendChild(g);
      });
      svg.appendChild(cards);
      // the box
      svg.appendChild(sv("path", { class: "vo55-box-front", d: "M14 100 L206 98 L200 168 L20 170 Z" }));
      svg.appendChild(sv("path", { class: "vo55-box-lip", d: "M14 100 L22 92 L198 90 L206 98" }));
      svg.appendChild(sv("path", { class: "vo55-box-label", d: "M74 118 L146 117 L147 148 L73 149 Z" }));
      var pull = sv("path", { class: "vo55-box-pull", d: "M100 156 q 10 7 20 0" });
      svg.appendChild(pull);
      var txt = sv("text", { x: 110, y: 138, "text-anchor": "middle", class: "vo55-box-txt" });
      txt.textContent = v.n;
      svg.appendChild(txt);
      a.appendChild(svg);
      a.appendChild(el("span", { class: "vo55-box-vol", text: volLabel(v.n) }));
      a.appendChild(el("span", { class: "vo55-box-title", text: volParts(v.n).title }));
      host.appendChild(a);
    });
    $("#vo55-cap-1").textContent = t("ui.fig") + " 1 — " + t("hero.cta_talks") + ": 3 × 4 = 12 · " +
      VOLS.map(function (v) { return volLabel(v.n); }).join(" / ");
  }

  /* ============================================================ CHAPTERS */
  function buildVolumes() {
    var host = $("#vo55-volumes");
    host.textContent = "";
    VOLS.forEach(function (v, vi) {
      var sec = el("section", { class: "vo55-ch vo55-row", id: "vol-" + v.n, "aria-labelledby": "vol-" + v.n + "-h" });
      sec.appendChild(el("div", { class: "vo55-margin" }, [
        el("span", { class: "vo55-secno", "aria-hidden": "true", text: pad(v.n) }),
        el("span", { class: "vo55-stamp vo55-mstamp", "aria-hidden": "true", "data-vol": v.n })
      ]));
      var col = el("div", { class: "vo55-col-wide" });
      col.appendChild(el("p", { class: "vo55-kicker", "data-kicker": v.n }));
      col.appendChild(el("h2", { class: "vo55-h2", id: "vol-" + v.n + "-h" }));
      col.appendChild(buildFigure(v, vi));
      var grid = el("div", { class: "vo55-cards" });
      v.slugs.forEach(function (slug, i) { grid.appendChild(buildCard(v, slug, i)); });
      col.appendChild(grid);
      sec.appendChild(col);
      host.appendChild(sec);
    });
  }

  function renderVolumes() {
    VOLS.forEach(function (v, vi) {
      var p = volParts(v.n);
      $('[data-kicker="' + v.n + '"]').textContent = "§ " + pad(v.n) + " — " + p.kicker;
      var h = $("#vol-" + v.n + "-h");
      h.textContent = "";
      h.appendChild(underlined(p.title, lastWord(p.title), vi + 1));
      $('.vo55-mstamp[data-vol="' + v.n + '"]').textContent = volLabel(v.n);
    });
  }

  /* ------------------------------------------------------------ cards */
  function buildCard(v, slug, i) {
    var art = el("article", { class: "vo55-card", id: slug, "data-slug": slug, style: "--tilt:" + [-.8, .6, -.4, .9][(i + v.n) % 4] + "deg" });
    art.appendChild(el("span", { class: "vo55-tape", "aria-hidden": "true" }));
    var ph = el("div", { class: "vo55-photo" }, [
      el("img", { width: "1024", height: "1536", loading: "lazy", decoding: "async", alt: "" })
    ]);
    art.appendChild(ph);
    var head = el("div", { class: "vo55-card-head" });
    head.appendChild(el("p", { class: "vo55-card-no" }, [
      el("span", { text: v.n + "." + (i + 1) }),
      el("span", { class: "vo55-star", "aria-hidden": "true", text: "★" })
    ]));
    var btn = el("button", { type: "button", class: "vo55-toggle", "aria-expanded": "false", "aria-controls": slug + "-more" }, [
      el("span", { class: "vo55-card-title" }),
      el("span", { class: "vo55-fold", "aria-hidden": "true" })
    ]);
    head.appendChild(el("h3", { class: "vo55-h3" }, [btn]));
    head.appendChild(el("p", { class: "vo55-card-sub" }));
    art.appendChild(head);
    art.appendChild(el("p", { class: "vo55-card-sum" }));
    var more = el("div", { class: "vo55-more", id: slug + "-more" }, [
      el("div", { class: "vo55-more-in" }, [
        el("ol", { class: "vo55-kp" }),
        el("a", { class: "vo55-invite", href: "#" })
      ])
    ]);
    more.inert = true;
    art.appendChild(more);

    btn.addEventListener("click", function (e) { e.stopPropagation(); toggleCard(slug); });
    art.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      var sel = window.getSelection && String(window.getSelection());
      if (sel) return;
      toggleCard(slug);
    });
    return art;
  }

  function renderCards() {
    var feat = featured();
    VOLS.forEach(function (v) {
      v.slugs.forEach(function (slug) {
        var art = document.getElementById(slug);
        var k = "talk." + slug + ".";
        var title = t(k + "title");
        art.classList.toggle("is-feat", feat.indexOf(slug) >= 0);
        $(".vo55-card-title", art).textContent = title;
        $(".vo55-card-sub", art).textContent = t(k + "subtitle");
        $(".vo55-card-sum", art).textContent = t(k + "summary");
        var img = $(".vo55-photo img", art);
        var src = t(k + "image");
        if (img.getAttribute("src") !== src) img.setAttribute("src", src);
        img.alt = title;
        var ol = $(".vo55-kp", art);
        ol.textContent = "";
        [1, 2, 3, 4].forEach(function (n) {
          var p = splitPoint(t(k + "k" + n));
          ol.appendChild(el("li", null, [
            el("span", { class: "vo55-kp-n", "aria-hidden": "true", text: pad(n) }),
            el("span", { class: "vo55-kp-t" }, [el("strong", { text: p.lead }), el("span", { class: "vo55-colon", text: ":" }), document.createTextNode(" " + p.rest)])
          ]));
        });
        var inv = $(".vo55-invite", art);
        inv.href = mailto(title);
        inv.textContent = t("talks.invite") + " ↗";
      });
    });
  }

  function toggleCard(slug, force, noHash) {
    var art = document.getElementById(slug);
    if (!art) return;
    var on = typeof force === "boolean" ? force : !open[slug];
    open[slug] = on;
    art.classList.toggle("is-open", on);
    $(".vo55-toggle", art).setAttribute("aria-expanded", String(on));
    $(".vo55-more", art).inert = !on;
    if (on) {
      // sync the volume figure with the opened card
      VOLS.forEach(function (v) {
        var i = v.slugs.indexOf(slug);
        if (i >= 0 && figs[v.n]) figs[v.n].select(i, true);
      });
      if (!noHash && history.replaceState) history.replaceState(null, "", "#" + slug);
    } else if (!noHash && location.hash === "#" + slug && history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function openFromHash(smooth) {
    var id = decodeURIComponent((location.hash || "").slice(1));
    if (!id) return;
    var art = document.getElementById(id);
    if (!art || !art.classList.contains("vo55-card")) return;
    toggleCard(id, true, true);
    setTimeout(function () {
      art.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto", block: "start" });
      art.classList.add("is-flash");
      setTimeout(function () { art.classList.remove("is-flash"); }, 1600);
    }, smooth ? 0 : 60);
  }

  /* ============================================================ FIGURES
     One explainer per volume. Each maps the volume's 4 talks × 4 key points.
     Tabs 01–04 + next select a talk; the drawing inks that talk and pins its
     4 points; the panel lists the leads; focus a lead to read the full point. */

  var W = 400, H = 260;

  // Vol.1 — four waves of transformation: each talk a stretch of signal that
  // gets faster and taller, from noise to a clean wave.
  function drawWaves(svg, sel) {
    var r = rng(11), segs = [];
    var x0 = 24, segW = 88, base = 150;
    svg.appendChild(sv("path", { class: "vo55-f-axis", d: "M16 " + base + " H388 M382 " + (base - 4) + " L388 " + base + " L382 " + (base + 4) }));
    for (var s = 0; s < 4; s++) {
      var pts = [], amp = 14 + s * 14, cyc = 1 + s * 0.75;
      for (var x = 0; x <= segW; x += 2) {
        var u = x / segW;
        var y = base - Math.sin(u * Math.PI * 2 * cyc) * amp * Math.sin(u * Math.PI) - (s === 0 ? (r() - .5) * 10 : (r() - .5) * 1.5);
        pts.push([x0 + s * segW + x, y]);
      }
      var g = sv("g", { class: "vo55-f-seg", "data-i": s });
      g.appendChild(sv("rect", { class: "vo55-f-hit", x: x0 + s * segW, y: 40, width: segW, height: 170 }));
      var p = sv("path", { class: "vo55-f-line", d: poly(pts) });
      g.appendChild(p);
      var dots = [.16, .4, .62, .86].map(function (u) {
        var idx = Math.round(u * (pts.length - 1));
        return pts[idx];
      });
      var no = sv("text", { class: "vo55-f-no", x: x0 + s * segW + segW / 2, y: 236, "text-anchor": "middle" });
      no.textContent = pad(s + 1);
      g.appendChild(no);
      if (s) g.appendChild(sv("path", { class: "vo55-f-div", d: "M" + (x0 + s * segW) + " 60 V222" }));
      svg.appendChild(g);
      segs.push({ g: g, path: p, dots: dots });
    }
    return segs;
  }

  // Vol.2 — the sector dial: four sectors of the economy as four wedges.
  function drawDial(svg) {
    var cx = 200, cy = 132, R = 92, segs = [];
    var r = rng(23);
    for (var s = 0; s < 4; s++) {
      var a0 = -Math.PI * 3 / 4 + s * Math.PI / 2, a1 = a0 + Math.PI / 2, mid = (a0 + a1) / 2;
      var pts = [[cx, cy]];
      for (var k = 0; k <= 24; k++) {
        var a = a0 + (a1 - a0) * k / 24, rr = R + (r() - .5) * 2.2;
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      pts.push([cx, cy]);
      var g = sv("g", { class: "vo55-f-seg vo55-f-wedge", "data-i": s, style: "--dx:" + (Math.cos(mid) * 9).toFixed(1) + "px;--dy:" + (Math.sin(mid) * 9).toFixed(1) + "px" });
      g.appendChild(sv("path", { class: "vo55-f-fill", d: poly(pts) + " Z" }));
      var p = sv("path", { class: "vo55-f-line", d: poly(pts) });
      g.appendChild(p);
      var dots = [], spokes = [];
      for (var d = 0; d < 4; d++) {
        var aa = a0 + (a1 - a0) * (d + .5) / 4;
        var p1 = [cx + Math.cos(aa) * (R + 4), cy + Math.sin(aa) * (R + 4)];
        var p2 = [cx + Math.cos(aa) * (R + 26), cy + Math.sin(aa) * (R + 26)];
        spokes.push("M" + p1[0].toFixed(1) + " " + p1[1].toFixed(1) + " L" + p2[0].toFixed(1) + " " + p2[1].toFixed(1));
        dots.push(p2);
      }
      g.appendChild(sv("path", { class: "vo55-f-spoke", d: spokes.join(" ") }));
      var no = sv("text", { class: "vo55-f-no", x: (cx + Math.cos(mid) * R * .58).toFixed(1), y: (cy + Math.sin(mid) * R * .58 + 5).toFixed(1), "text-anchor": "middle" });
      no.textContent = pad(s + 1);
      g.appendChild(no);
      svg.appendChild(g);
      segs.push({ g: g, path: p, dots: dots });
    }
    svg.appendChild(sv("circle", { class: "vo55-f-hub", cx: cx, cy: cy, r: 5 }));
    return segs;
  }

  // Vol.3 — the human–AI relationship: four bridges between a person and a signal.
  function drawBridges(svg) {
    var A = [92, 134], B = [308, 134], offs = [-96, -34, 34, 96], segs = [];
    // person glyph
    svg.appendChild(sv("circle", { class: "vo55-f-glyph", cx: 56, cy: 112, r: 12 }));
    svg.appendChild(sv("path", { class: "vo55-f-glyph", d: "M30 160 C 32 134, 80 134, 82 160" }));
    // signal glyph: a dot with radiating arcs
    svg.appendChild(sv("circle", { class: "vo55-f-glyph is-ink", cx: 344, cy: 134, r: 6 }));
    svg.appendChild(sv("path", { class: "vo55-f-glyph is-ink", d: "M356 118 a 20 20 0 0 1 0 32 M366 108 a 34 34 0 0 1 0 52 M332 118 a 20 20 0 0 0 0 32 M322 108 a 34 34 0 0 0 0 52" }));
    offs.forEach(function (o, s) {
      var c = [200, 134 + o * 1.25];
      function at(u) {
        var m = 1 - u;
        return [m * m * A[0] + 2 * m * u * c[0] + u * u * B[0], m * m * A[1] + 2 * m * u * c[1] + u * u * B[1]];
      }
      var g = sv("g", { class: "vo55-f-seg", "data-i": s });
      var pts = []; for (var k = 0; k <= 40; k++) pts.push(at(k / 40));
      g.appendChild(sv("path", { class: "vo55-f-hit", d: poly(pts), "stroke-width": 26 }));
      var p = sv("path", { class: "vo55-f-line", d: poly(pts) });
      g.appendChild(p);
      var dots = [.22, .4, .6, .78].map(at);
      var mid = at(.5);
      var no = sv("text", { class: "vo55-f-no vo55-f-no-sm", x: mid[0].toFixed(1), y: (mid[1] + (o < 0 ? -9 : 17)).toFixed(1), "text-anchor": "middle" });
      no.textContent = pad(s + 1);
      g.appendChild(no);
      svg.appendChild(g);
      segs.push({ g: g, path: p, dots: dots });
    });
    return segs;
  }

  var DRAWERS = { 1: drawWaves, 2: drawDial, 3: drawBridges };

  function buildFigure(v, vi) {
    var fig = el("figure", { class: "vo55-fig vo55-fig-" + v.n });
    var tabs = el("div", { class: "vo55-tabs", role: "tablist" });
    v.slugs.forEach(function (slug, i) {
      tabs.appendChild(el("button", {
        type: "button", role: "tab", class: "vo55-tab", id: "vol" + v.n + "-tab" + i,
        "aria-controls": "vol" + v.n + "-panel", "aria-selected": "false", tabindex: "-1", text: pad(i + 1)
      }));
    });
    var next = el("button", { type: "button", class: "vo55-next" }, [el("span", { "aria-hidden": "true", text: "→" })]);
    var bar = el("div", { class: "vo55-figbar" }, [tabs, next]);
    fig.appendChild(bar);

    var stage = el("div", { class: "vo55-stage" });
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, class: "vo55-figsvg", "aria-hidden": "true" });
    var segs = DRAWERS[v.n](svg);
    var pins = sv("g", { class: "vo55-f-pins" });
    svg.appendChild(pins);
    stage.appendChild(svg);

    var panel = el("div", { class: "vo55-panel", role: "tabpanel", id: "vol" + v.n + "-panel" });
    panel.appendChild(el("p", { class: "vo55-p-no" }));
    panel.appendChild(el("a", { class: "vo55-p-title", href: "#" }));
    panel.appendChild(el("p", { class: "vo55-p-sub" }));
    panel.appendChild(el("ol", { class: "vo55-leads" }));
    panel.appendChild(el("p", { class: "vo55-p-full", "aria-live": "polite" }));
    stage.appendChild(panel);
    fig.appendChild(stage);
    fig.appendChild(el("figcaption", { class: "vo55-cap" }));

    var api = { fig: fig, v: v, segs: segs, pins: pins, panel: panel, tabs: tabs, next: next, cur: -1, lead: 0 };

    api.select = function (i, quiet) {
      var changed = i !== api.cur;
      api.cur = i; figSel[v.n] = i;
      $$(".vo55-tab", tabs).forEach(function (b, j) {
        b.setAttribute("aria-selected", String(j === i));
        b.tabIndex = j === i ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", "vol" + v.n + "-tab" + i);
      segs.forEach(function (s, j) { s.g.classList.toggle("is-on", j === i); });
      if (changed) drawIn(segs[i].path);
      renderPanel(api, changed);
      if (!quiet) { /* keep focus where it is */ }
    };

    $$(".vo55-tab", tabs).forEach(function (b, i) {
      b.addEventListener("click", function () { api.select(i); });
      b.addEventListener("keydown", function (e) {
        var k = e.key, n = null;
        if (k === "ArrowRight" || k === "ArrowDown") n = (i + 1) % 4;
        else if (k === "ArrowLeft" || k === "ArrowUp") n = (i + 3) % 4;
        else if (k === "Home") n = 0; else if (k === "End") n = 3;
        if (n !== null) { e.preventDefault(); api.select(n); $$(".vo55-tab", tabs)[n].focus(); }
      });
    });
    next.addEventListener("click", function () { api.select((api.cur + 1) % 4); });
    segs.forEach(function (s, j) {
      s.g.addEventListener("click", function () { api.select(j); });
    });
    panel.querySelector(".vo55-p-title").addEventListener("click", function (e) {
      e.preventDefault();
      var slug = v.slugs[api.cur];
      toggleCard(slug, true);
      var art = document.getElementById(slug);
      art.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      setTimeout(function () { $(".vo55-toggle", art).focus({ preventScroll: true }); }, reduce ? 0 : 500);
    });

    figs[v.n] = api;
    return fig;
  }

  function setLead(api, j) {
    api.lead = j;
    var slug = api.v.slugs[api.cur];
    $$(".vo55-leads li", api.panel).forEach(function (li, k) { li.classList.toggle("is-on", k === j); });
    $$("circle.vo55-pin", api.pins).forEach(function (c, k) { c.classList.toggle("is-on", k === j); });
    var p = splitPoint(t("talk." + slug + ".k" + (j + 1)));
    var full = $(".vo55-p-full", api.panel);
    full.textContent = "";
    full.appendChild(el("strong", { text: p.lead + ": " }));
    full.appendChild(document.createTextNode(p.rest));
  }

  function renderPanel(api, animate) {
    var v = api.v, i = api.cur, slug = v.slugs[i], k = "talk." + slug + ".";
    var feat = featured().indexOf(slug) >= 0;
    $(".vo55-p-no", api.panel).textContent = v.n + "." + (i + 1) + (feat ? "  ★" : "");
    var a = $(".vo55-p-title", api.panel);
    a.textContent = t(k + "title") + " ↓";
    a.href = "#" + slug;
    $(".vo55-p-sub", api.panel).textContent = t(k + "subtitle");
    var ol = $(".vo55-leads", api.panel);
    ol.textContent = "";
    // pins on the drawing
    api.pins.textContent = "";
    var dots = api.segs[i].dots;
    dots.forEach(function (d, j) {
      var c = sv("circle", { class: "vo55-pin", cx: d[0].toFixed(1), cy: d[1].toFixed(1), r: 6.5, style: "--d:" + (animate && !reduce ? 300 + j * 110 : 0) + "ms" });
      c.addEventListener("mouseenter", function () { setLead(api, j); });
      c.addEventListener("click", function (e) { e.stopPropagation(); setLead(api, j); });
      api.pins.appendChild(c);
      var n = sv("text", { class: "vo55-pin-n", x: d[0].toFixed(1), y: (d[1] + 3.6).toFixed(1), "text-anchor": "middle" });
      n.textContent = j + 1;
      api.pins.appendChild(n);
    });
    [1, 2, 3, 4].forEach(function (n, j) {
      var p = splitPoint(t(k + "k" + n));
      var b = el("button", { type: "button", class: "vo55-ldbtn" }, [
        el("span", { class: "vo55-lead-n", "aria-hidden": "true", text: n }),
        el("span", { text: p.lead })
      ]);
      b.addEventListener("mouseenter", function () { setLead(api, j); });
      b.addEventListener("focus", function () { setLead(api, j); });
      b.addEventListener("click", function () { setLead(api, j); });
      ol.appendChild(el("li", null, [b]));
    });
    setLead(api, 0);
    if (animate && !reduce) {
      api.panel.classList.remove("is-swap"); api.panel.getBoundingClientRect(); api.panel.classList.add("is-swap");
    }
    // next button label
    var nx = v.slugs[(i + 1) % 4];
    api.next.setAttribute("aria-label", "→ " + t("talk." + nx + ".title"));
    api.next.title = t("talk." + nx + ".title");
    $$(".vo55-tab", api.tabs).forEach(function (b, j) { b.setAttribute("aria-label", pad(j + 1) + " · " + t("talk." + v.slugs[j] + ".title")); });
  }

  function renderFigures() {
    VOLS.forEach(function (v) {
      var api = figs[v.n];
      var cap = $(".vo55-cap", api.fig);
      cap.textContent = t("ui.fig") + " " + (v.n + 1) + " — " + volLabel(v.n) + " · " + volParts(v.n).title + " · 4 × 4";
      if (api.cur < 0) api.select(figSel[v.n], true); else renderPanel(api, false);
    });
  }

  /* ============================================================ CHROME */
  function renderChrome() {
    document.title = t("talks.page_title");
    var d = $('meta[name="description"]');
    if (d) d.setAttribute("content", t("talks.page_intro"));
    $$("[data-mail]").forEach(function (a) { a.href = mailto(""); });
    $("#vo55-credit").textContent = t("projects.credit").replace("{model}", MODEL_NAME);
    $$(".vo55-fact-lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === window.OZ.lang));
    });
  }

  function renderAll() {
    renderChrome();
    renderHero();
    renderVolumes();
    renderCards();
    renderFigures();
  }

  /* ------------------------------------------------------------ reveal */
  function reveal() {
    var targets = $$(".vo55-row");
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach(function (x) { x.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    targets.forEach(function (x) { io.observe(x); });
  }

  /* ------------------------------------------------------------ boot */
  window.OZ.ready.then(function () {
    document.documentElement.classList.add("vo55-js");
    buildVolumes();
    renderAll();
    $$(".vo55-fact-lang button").forEach(function (b) {
      b.addEventListener("click", function () { window.OZ.setLang(b.dataset.lang); });
    });
    reveal();
    if (location.hash) openFromHash(false);
    window.addEventListener("hashchange", function () { openFromHash(true); });
    document.addEventListener("oz:langchange", renderAll);
  });
})();
