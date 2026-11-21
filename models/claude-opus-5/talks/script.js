/* ozsert.com — /talks/  "Three notebooks"
   Built by Claude Opus 5 from specs/talks.md.  Vanilla JS, inline SVG, no libraries. */
(function () {
  "use strict";

  var MODEL = "Claude Opus 5";
  var NS = "http://www.w3.org/2000/svg";
  var SLUGS = [
    "industrial-revolution-internet-ai", "solopreneurship", "ai-agent-organizations", "corporate-memory",
    "ai-in-finance", "retail-silent-revolution", "ai-logistics-traceability", "next-gen-ecommerce",
    "new-role-of-humans", "ai-software-development", "ai-customer-experience", "ai-design-creativity"
  ];
  var VOLS = [[], [], []];          // filled from talk.<slug>.vol
  var FEATURED = [];
  var derived = [];                  // updaters for copy that is split / composed
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var narrow = window.matchMedia("(max-width: 700px)");
  function onBP(fn) {
    fn(narrow.matches);
    if (narrow.addEventListener) narrow.addEventListener("change", function () { fn(narrow.matches); });
  }

  /* ───────────────────────── tiny helpers ───────────────────────── */
  function t(k) { return window.OZ.t(k); }
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (attrs[k] == null) continue; if (k === "class") e.className = attrs[k]; else if (k === "text") e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function s(tag, attrs, kids) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) { if (attrs[k] == null) continue; if (k === "text") e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function onCopy(fn) { derived.push(fn); fn(); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function lead(key) { var v = t(key) || ""; var i = v.indexOf(":"); return i < 0 ? v : v.slice(0, i); }
  function rest(key) { var v = t(key) || ""; var i = v.indexOf(":"); return i < 0 ? "" : v.slice(i); }
  function volTitle(v, part) {         // 0 = kicker ("… Vol.1"), 1 = chapter title
    var raw = t("talks.vol" + v + ".title") || "";
    var bits = raw.split(" - ");
    return bits.length > 1 ? bits[part] : raw;
  }
  function seeded(seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }
  function mailto(subject) {
    return "mailto:" + window.OZ.email() + "?subject=" + encodeURIComponent(subject);
  }
  function smoothTo(node, instant) {
    var behavior = (instant || reduced.matches) ? "auto" : "smooth";
    node.scrollIntoView({ behavior: behavior, block: "start" });
  }

  /* wobbly hand-drawn line between two points */
  function wobble(x1, y1, x2, y2, amp, segs, seed) {
    var r = seeded(seed || 7), d = "M" + x1 + " " + y1, i;
    for (i = 1; i <= segs; i++) {
      var tt = i / segs, px = x1 + (x2 - x1) * tt, py = y1 + (y2 - y1) * tt;
      var mx = x1 + (x2 - x1) * (tt - .5 / segs), my = y1 + (y2 - y1) * (tt - .5 / segs) + (r() - .5) * amp * 2;
      d += " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + px.toFixed(1) + " " + (py + (r() - .5) * amp).toFixed(1);
    }
    return d;
  }

  /* hand-drawn underline under a heading (3 styles) */
  function underline(style) {
    var svg = s("svg", { class: "v-tk-ul v-tk-svg", viewBox: "0 0 300 14", preserveAspectRatio: "none", "aria-hidden": "true" });
    var d;
    if (style === 0) d = "M3 8.5C52 5.2 104 10.4 150 7.3s96-3.4 147 2.1";
    else if (style === 1) d = "M3 7.8c18 5 32-5.6 50-1.2s30 7.4 48 3.4 34-6.8 52-2.6 32 7.6 50 3.6 34-5.4 94-1.4";
    else d = "M4 9.4C60 4.8 118 11 176 6.6c34-2.6 72 .6 120 3.2";
    var p = s("path", { d: d, class: "ink", "stroke-width": "2.4", "vector-effect": "non-scaling-stroke" });
    svg.appendChild(p);
    if (style !== 1) {
      svg.appendChild(s("path", { d: "M8 11.6C70 8 140 12.8 206 10.2", class: "ink", "stroke-width": "1", opacity: ".45", "vector-effect": "non-scaling-stroke" }));
    }
    return svg;
  }

  /* ───────────────────────── reveal on scroll ───────────────────────── */
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .12 }) : null;
  function reveal(node) { node.classList.add("v-tk-rv"); if (io) io.observe(node); else node.classList.add("is-in"); }
  function revealSelf(node) { if (io) io.observe(node); else node.classList.add("is-in"); }

  /* ═══════════════════════ fig. 1 — three notebooks ═══════════════════════ */
  function notebook(i, mobile) {
    var rot = (mobile ? [-4, 2.2, -2.4] : [-3.2, 1.6, -1.8])[i];
    var at = mobile ? [[8, 6], [128, 102], [248, 198]][i] : [46 + i * 232, 26];
    var a = s("a", { href: "#vol-" + (i + 1), class: "v-tk-nb", "data-volidx": i });
    var g = s("g", { transform: "translate(" + at[0] + "," + at[1] + ") rotate(" + rot + ",95,112)" });
    var body = s("g", { class: "nb-body" });

    // pages peeking out on the right
    body.appendChild(s("path", { d: "M182 14 l9 4 l-3 196 l-8 4", class: "mut draw", "stroke-width": "1.2", pathLength: "100", style: "--d:.1s" }));
    body.appendChild(s("path", { d: "M181 20 l6 3 l-2 188 l-6 3", class: "mut draw", "stroke-width": "1", opacity: ".6", pathLength: "100", style: "--d:.16s" }));
    // sketched outer border
    body.appendChild(s("path", {
      d: "M3 6C58 2 132 1 186 5C188 68 189 150 186 216C132 221 60 222 6 217C2 150 1 72 3 6Z",
      class: "mut draw", "stroke-width": "1", opacity: ".55", pathLength: "100", style: "--d:.05s"
    }));
    // cover (filled with paper so a stacked notebook hides the one behind it)
    body.appendChild(s("path", {
      d: "M9 12C62 8 130 7 180 11C182 72 183 150 180 211C128 216 62 217 12 212C8 148 7 76 9 12Z",
      class: "fill-paper fade", style: "--d:.05s"
    }));
    body.appendChild(s("path", {
      d: "M9 12C62 8 130 7 180 11C182 72 183 150 180 211C128 216 62 217 12 212C8 148 7 76 9 12Z",
      class: "ink draw nb-cover", "stroke-width": "2", pathLength: "100", style: "--d:.12s"
    }));
    body.appendChild(s("path", {
      d: "M9 12C62 8 130 7 180 11C182 72 183 150 180 211C128 216 62 217 12 212C8 148 7 76 9 12Z",
      class: "nb-glow"
    }));
    // spiral binding
    for (var jj = 0; jj < 6; jj++) {
      var y = 30 + jj * 32;
      body.appendChild(s("path", { d: "M2 " + y + "q13 -11 19 -1q4 7 -5 10", class: "fgl draw", "stroke-width": "1.4", pathLength: "100", style: "--d:" + (.2 + jj * .05) + "s" }));
    }
    // masking tape across the top corner
    body.appendChild(s("rect", { x: "112", y: "-9", width: "74", height: "20", rx: "1", transform: "rotate(6 149 1)", class: "tape-fill fade", style: "--d:.5s" }));
    // ui.vol + number
    body.appendChild(s("text", { x: "28", y: "62", "font-size": "13", "letter-spacing": "2.4", class: "t-fg", "data-volword": "1" }));
    body.appendChild(s("text", { x: "25", y: "128", "font-size": "62", "font-weight": "500", "letter-spacing": "-2", class: "t-ink", text: String(i + 1) }));
    // four card edges = four talks
    for (var k = 0; k < 4; k++) {
      body.appendChild(s("path", {
        d: wobble(28, 152 + k * 13, 96 + (k % 2) * 22, 152 + k * 13, 1.1, 3, 11 + k * 5 + i),
        class: "mut draw", "stroke-width": "1.3", pathLength: "100", style: "--d:" + (.45 + k * .07) + "s"
      }));
    }
    // volume glyph
    var gl = s("g", { transform: "translate(" + (mobile ? 92 : 128) + ",186)" });
    if (i === 0) {           // signal arcs
      [10, 18, 26].forEach(function (r, n) {
        gl.appendChild(s("path", { d: "M" + (-r * .7) + " " + (r * .7) + "A" + r + " " + r + " 0 0 1 " + (r * .7) + " " + (-r * .7), class: "ink draw", "stroke-width": "1.6", pathLength: "100", style: "--d:" + (.6 + n * .08) + "s" }));
      });
      gl.appendChild(s("circle", { cx: "0", cy: "0", r: "3", class: "fill-ink fade", style: "--d:.84s" }));
    } else if (i === 1) {    // route line
      gl.appendChild(s("path", { d: "M-30 14C-14 -6 2 20 14 2S30 -10 32 -12", class: "ink draw", "stroke-width": "1.8", pathLength: "100", style: "--d:.6s" }));
      gl.appendChild(s("circle", { cx: "-30", cy: "14", r: "3", class: "fill-ink fade", style: "--d:.8s" }));
      gl.appendChild(s("circle", { cx: "32", cy: "-12", r: "3", class: "fill-ink fade", style: "--d:.86s" }));
    } else {                 // handoff loop
      gl.appendChild(s("path", { d: "M0 2C10 -16 34 -14 33 2C32 18 10 20 0 2C-10 -16 -34 -14 -33 2C-32 18 -10 20 0 2Z", class: "ink draw", "stroke-width": "1.7", pathLength: "100", style: "--d:.6s" }));
      gl.appendChild(s("circle", { cx: "0", cy: "2", r: "2.6", class: "fill-ink fade", style: "--d:.86s" }));
    }
    body.appendChild(gl);

    g.appendChild(body);
    a.appendChild(g);
    return a;
  }

  function figNotebooks(box) {
    function relabel() {
      var w = (t("ui.vol") || "").toLocaleUpperCase(window.OZ.lang);
      var sv = box.querySelector("svg");
      if (sv) sv.setAttribute("aria-label", t("talks.title"));
      box.querySelectorAll("[data-volword]").forEach(function (n) { n.textContent = w; });
      box.querySelectorAll("[data-volidx]").forEach(function (n) {
        var i = parseInt(n.getAttribute("data-volidx"), 10);
        n.setAttribute("aria-label", t("ui.vol") + " " + (i + 1) + " — " + volTitle(i + 1, 1));
      });
    }
    onBP(function (mobile) {
      box.textContent = "";
      var svg = s("svg", { class: "v-tk-svg", viewBox: mobile ? "0 0 444 438" : "0 0 760 286", role: "group" });
      svg.setAttribute("aria-label", t("talks.title"));
      if (!mobile) svg.appendChild(s("path", { d: wobble(20, 268, 740, 268, 2.2, 10, 23), class: "mut draw", "stroke-width": "1.4", opacity: ".7", pathLength: "100", style: "--d:.8s" }));
      for (var i = 0; i < 3; i++) svg.appendChild(notebook(i, mobile));
      box.appendChild(svg);
      relabel();
    });
    onCopy(relabel);
  }

  /* ═══════════════════ shared readout panel for volume figures ═══════════════════ */
  function makeReadout(volIdx) {
    var wrap = el("div", { class: "v-tk-read" });
    var no = el("p", { class: "v-tk-read-no" });
    var noB = el("b"); no.appendChild(noB); no.appendChild(document.createTextNode(" / 04"));
    var h4 = el("h4", { class: "v-tk-read-title" });
    var link = el("a", { href: "#" });
    var jump = el("span", { class: "v-tk-jump", "aria-hidden": "true", text: " →" });
    h4.appendChild(link); link.appendChild(document.createTextNode("")); link.appendChild(jump);
    var leads = el("div", { class: "v-tk-leads", role: "group" });
    var ktext = el("p", { class: "v-tk-ktext" });
    var btns = [];
    for (var i = 0; i < 4; i++) btns.push(el("button", { type: "button", class: "v-tk-lead-btn" }));
    btns.forEach(function (b) { leads.appendChild(b); });
    wrap.appendChild(no); wrap.appendChild(h4); wrap.appendChild(leads); wrap.appendChild(ktext);

    var api = {
      el: wrap, buttons: btns, onLead: null,
      slug: null, k: 0,
      set: function (slug, k) {
        api.slug = slug; api.k = k;
        var n = VOLS[volIdx].indexOf(slug);
        noB.textContent = pad(n + 1);
        link.firstChild.nodeValue = t("talk." + slug + ".title");
        link.setAttribute("href", "#" + slug);
        leads.setAttribute("aria-label", t("talk." + slug + ".title"));
        btns.forEach(function (b, i) {
          b.textContent = lead("talk." + slug + ".k" + (i + 1));
          b.setAttribute("aria-pressed", String(i === k));
        });
        ktext.innerHTML = "";
        ktext.appendChild(el("b", { text: lead("talk." + slug + ".k" + (k + 1)) }));
        ktext.appendChild(document.createTextNode(rest("talk." + slug + ".k" + (k + 1))));
      }
    };
    btns.forEach(function (b, i) { b.addEventListener("click", function () { if (api.onLead) api.onLead(i); }); });
    onCopy(function () { if (api.slug) api.set(api.slug, api.k); });
    return api;
  }

  function makeSteps(count, onPick, labelFor) {
    var row = el("div", { class: "v-tk-steps" });
    var btns = [];
    for (var i = 0; i < count; i++) {
      (function (i) {
        var b = el("button", { type: "button", class: "v-tk-step", text: pad(i + 1) });
        b.addEventListener("click", function () { onPick(i); });
        btns.push(b); row.appendChild(b);
      })(i);
    }
    var next = el("button", { type: "button", class: "v-tk-step v-tk-step--next", text: "→" });
    next.addEventListener("click", function () { onPick((current + 1) % count); });
    row.appendChild(next);
    var current = 0;
    return {
      el: row,
      mark: function (i) {
        current = i;
        btns.forEach(function (b, n) { b.setAttribute("aria-pressed", String(n === i)); });
        next.setAttribute("aria-label", labelFor((i + 1) % count));
        btns.forEach(function (b, n) { b.setAttribute("aria-label", labelFor(n)); });
      }
    };
  }

  /* make an SVG node behave like a button (click + Enter/Space) */
  function hit(node, fn, label) {
    node.setAttribute("tabindex", "0");
    node.setAttribute("role", "button");
    if (label) node.setAttribute("aria-label", label);
    node.style.cursor = "pointer";
    node.addEventListener("click", fn);
    node.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); fn(); }
    });
    return node;
  }

  /* ═════════════ fig. 2 — vol 1: tune the dial (signal out of noise) ═════════════ */
  function figDial(box) {
    var slugs = VOLS[0], state = { t: 0, k: 0 };
    var svgWrap = el("div", { class: "v-tk-figside" });
    var svg = s("svg", { class: "v-tk-svg", viewBox: "0 0 440 318", role: "group" });
    onCopy(function () { svg.setAttribute("aria-label", volTitle(1, 1)); });

    /* wave window */
    svg.appendChild(s("path", {
      d: "M14 16C150 12 300 12 426 16C428 60 428 100 426 138C300 142 150 142 14 138C12 100 12 58 14 16Z",
      class: "mut draw", "stroke-width": "1.2", opacity: ".65", pathLength: "100"
    }));
    // noise
    var r = seeded(91), nd = "M24 77", x;
    for (x = 24; x <= 416; x += 4) nd += " L" + x + " " + (77 + (r() - .5) * 40).toFixed(1);
    svg.appendChild(s("path", { d: nd, class: "mut", "stroke-width": ".8", opacity: ".38" }));
    // clean signal
    var wave = s("path", { class: "ink", "stroke-width": "2.2", pathLength: "100" });
    svg.appendChild(wave);
    // lead markers on the wave
    var marks = [];
    for (var i = 0; i < 4; i++) {
      var g = s("g", {});
      var mx = 73 + i * 98;
      g.appendChild(s("line", { x1: mx, y1: 26, x2: mx, y2: 128, class: "mut", "stroke-width": ".8", "stroke-dasharray": "3 4", opacity: ".5" }));
      var dot = s("circle", { cx: mx, cy: 77, r: "5", class: "ink fill-paper", "stroke-width": "1.8" });
      g.appendChild(dot);
      g.appendChild(s("text", { x: mx, y: 20, "font-size": "13", "text-anchor": "middle", text: pad(i + 1), class: "t-fg", "letter-spacing": "1" }));
      svg.appendChild(g);
      marks.push({ g: g, dot: dot, x: mx });
      g.setAttribute("data-leadidx", i);
      (function (i) { hit(g, function () { select(state.t, i); }); })(i);
    }

    /* dial */
    var cx = 220, cy = 300, R = 118;
    svg.appendChild(s("path", { d: "M" + (cx - R) + " " + cy + "A" + R + " " + R + " 0 0 1 " + (cx + R) + " " + cy, class: "mut draw", "stroke-width": "1.4", pathLength: "100", style: "--d:.2s" }));
    for (var a = 0; a <= 180; a += 7.5) {
      var rad = a * Math.PI / 180, inner = R - 7;
      svg.appendChild(s("line", {
        x1: (cx + inner * Math.cos(rad)).toFixed(1), y1: (cy - inner * Math.sin(rad)).toFixed(1),
        x2: (cx + R * Math.cos(rad)).toFixed(1), y2: (cy - R * Math.sin(rad)).toFixed(1),
        class: "mut", "stroke-width": ".8", opacity: ".45"
      }));
    }
    var ANG = [155, 125, 95, 65];
    var ticks = [];
    ANG.forEach(function (ang, i) {
      var rad = ang * Math.PI / 180;
      var g = s("g", {});
      g.appendChild(s("line", {
        x1: (cx + (R - 16) * Math.cos(rad)).toFixed(1), y1: (cy - (R - 16) * Math.sin(rad)).toFixed(1),
        x2: (cx + (R + 4) * Math.cos(rad)).toFixed(1), y2: (cy - (R + 4) * Math.sin(rad)).toFixed(1),
        class: "fgl", "stroke-width": "2"
      }));
      g.appendChild(s("text", {
        x: (cx + (R + 20) * Math.cos(rad)).toFixed(1), y: (cy - (R + 20) * Math.sin(rad) + 4).toFixed(1),
        "font-size": "15", "text-anchor": "middle", text: pad(i + 1), class: "t-fg"
      }));
      g.appendChild(s("circle", { cx: (cx + (R - 6) * Math.cos(rad)).toFixed(1), cy: (cy - (R - 6) * Math.sin(rad)).toFixed(1), r: "20", fill: "transparent", stroke: "none" }));
      svg.appendChild(g);
      g.setAttribute("data-talkidx", i);
      ticks.push(g);
      hit(g, function () { select(i, 0); });
    });
    var needle = s("g", { style: "transition:transform .5s cubic-bezier(.3,1.2,.5,1);transform-origin:" + cx + "px " + cy + "px" });
    needle.appendChild(s("line", { x1: cx, y1: cy, x2: cx, y2: cy - R + 22, class: "ink", "stroke-width": "2.6" }));
    needle.appendChild(s("circle", { cx: cx, cy: cy - R + 22, r: "4.5", class: "fill-ink" }));
    svg.appendChild(needle);
    svg.appendChild(s("circle", { cx: cx, cy: cy, r: "11", class: "fill-paper ink", "stroke-width": "2" }));
    svg.appendChild(s("circle", { cx: cx, cy: cy, r: "4", class: "fill-ink" }));

    svgWrap.appendChild(svg);
    var read = makeReadout(0);
    var steps = makeSteps(4, function (i) { select(i, 0); }, function (i) { return t("talk." + slugs[i] + ".title"); });
    read.onLead = function (i) { select(state.t, i); };
    var right = el("div", {}, [read.el, steps.el]);
    box.appendChild(svgWrap); box.appendChild(right);
    box.classList.add("v-tk-figbox--side");

    function waveFor(idx) {
      var amp = [26, 18, 32, 14][idx], freq = [1.6, 3.1, 2.2, 4.4][idx], ph = [0, .8, 1.9, .4][idx];
      var d = "", x;
      for (x = 24; x <= 416; x += 4) {
        var u = (x - 24) / 392;
        var y = 77 - Math.sin(u * Math.PI * 2 * freq + ph) * amp * (.55 + .45 * Math.sin(u * Math.PI));
        d += (x === 24 ? "M" : " L") + x + " " + y.toFixed(1);
      }
      return d;
    }
    function select(ti, ki) {
      state.t = ti; state.k = ki;
      wave.setAttribute("d", waveFor(ti));
      if (!reduced.matches) {
        wave.style.transition = "none";
        wave.style.strokeDasharray = "100"; wave.style.strokeDashoffset = "100";
        void wave.getBoundingClientRect();
        wave.style.transition = "stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)";
        wave.style.strokeDashoffset = "0";
      }
      needle.style.transform = "rotate(" + (90 - ANG[ti]) + "deg)";
      ticks.forEach(function (g, i) { g.setAttribute("opacity", i === ti ? "1" : ".45"); });
      marks.forEach(function (m, i) {
        m.dot.setAttribute("class", i === ki ? "ink fill-ink" : "ink fill-paper");
        m.dot.setAttribute("r", i === ki ? "6.5" : "5");
        m.g.setAttribute("opacity", i === ki ? "1" : ".6");
        var u = (m.x - 24) / 392;
        var amp = [26, 18, 32, 14][ti], freq = [1.6, 3.1, 2.2, 4.4][ti], ph = [0, .8, 1.9, .4][ti];
        m.dot.setAttribute("cy", (77 - Math.sin(u * Math.PI * 2 * freq + ph) * amp * (.55 + .45 * Math.sin(u * Math.PI))).toFixed(1));
      });
      read.set(slugs[ti], ki);
      steps.mark(ti);
      marks.forEach(function (m, i) {
        m.g.setAttribute("aria-label", lead("talk." + slugs[ti] + ".k" + (i + 1)));
      });
    }
    onCopy(function () {
      steps.mark(state.t);
      svg.querySelectorAll("[data-talkidx]").forEach(function (n) {
        n.setAttribute("aria-label", t("talk." + slugs[parseInt(n.getAttribute("data-talkidx"), 10)] + ".title"));
      });
      svg.querySelectorAll("[data-leadidx]").forEach(function (n) {
        n.setAttribute("aria-label", lead("talk." + slugs[state.t] + ".k" + (parseInt(n.getAttribute("data-leadidx"), 10) + 1)));
      });
    });
    select(0, 0);
  }

  /* ═════════════ fig. 3 — vol 2: the line through the sectors ═════════════ */
  function figRoute(box) {
    var slugs = VOLS[1], state = { t: 0, k: 0 }, G = null;
    var wrap = el("div", { class: "v-tk-figwide" });
    box.appendChild(wrap);
    var read = makeReadout(1);
    read.onLead = function (i) { select(state.t, i); };
    box.appendChild(read.el);
    box.classList.add("v-tk-figbox--stack");

    var L = {
      wide: {
        vb: "0 20 760 226", d: "M86 196C166 214 196 140 272 146S376 200 452 164 582 100 712 118",
        tower: "translate(40,150) scale(1)", lx: 0, ly: 32, fs: 14,
        off: [[-62, -52], [-21, -72], [21, -72], [62, -52]], min: 22, max: 738
      },
      narrow: {
        vb: "0 0 404 300", d: "M30 252C88 282 92 188 148 204S214 264 252 206 320 146 380 158",
        tower: "translate(44,88) scale(.85)", lx: 0, ly: 30, fs: 15,
        off: [[-44, -40], [-15, -58], [15, -58], [44, -40]], min: 18, max: 388
      }
    };

    function build(mobile) {
      var C = mobile ? L.narrow : L.wide;
      var svg = s("svg", { class: "v-tk-svg", viewBox: C.vb, role: "group" });
      svg.setAttribute("aria-label", volTitle(2, 1));

      /* control tower */
      var tower = s("g", { transform: C.tower });
      tower.appendChild(s("path", { d: "M-13 64L-6 6h12l7 58Z", class: "fgl draw", "stroke-width": "1.6", pathLength: "100" }));
      tower.appendChild(s("path", { d: "M-16 6h32l-4 -14h-24Z", class: "ink draw", "stroke-width": "1.8", pathLength: "100", style: "--d:.1s" }));
      tower.appendChild(s("path", { d: "M0 -8v-12", class: "ink draw", "stroke-width": "1.6", pathLength: "100", style: "--d:.2s" }));
      [14, 23, 32].forEach(function (rr, n) {
        tower.appendChild(s("path", {
          d: "M" + (rr * .35) + " " + (-20 - rr * .93) + "A" + rr + " " + rr + " 0 0 1 " + (rr * .93) + " " + (-20 + rr * .35),
          class: "ink v-tk-scan", "stroke-width": "1.4", opacity: ".8", style: "--n:" + n
        }));
      });
      svg.appendChild(tower);

      /* route */
      svg.appendChild(s("path", { d: C.d, class: "mut", "stroke-width": "7", opacity: ".14" }));
      var route = s("path", { d: C.d, class: "ink draw", "stroke-width": "2.2", pathLength: "100", style: "--d:.25s" });
      svg.appendChild(route);
      var flagLayer = s("g", {});
      svg.appendChild(flagLayer);
      var dot = s("g", {});
      dot.appendChild(s("circle", { cx: 0, cy: 0, r: "7", class: "fill-ink" }));
      dot.appendChild(s("circle", { cx: 0, cy: 0, r: "12", class: "ink", "stroke-width": "1.2", opacity: ".5" }));
      svg.appendChild(dot);
      wrap.appendChild(svg);

      var FR = [.14, .40, .66, .92], len = route.getTotalLength(), pts = [], stations = [];
      FR.forEach(function (f, i) {
        var p = route.getPointAtLength(len * f);
        pts.push(p);
        var g = s("g", { transform: "translate(" + p.x.toFixed(1) + "," + p.y.toFixed(1) + ")", "data-talkidx": i });
        g.appendChild(s("circle", { cx: 0, cy: 0, r: "22", fill: "transparent", stroke: "none" }));
        var ring = s("circle", { cx: 0, cy: 0, r: "9", class: "fgl fill-paper", "stroke-width": "2" });
        g.appendChild(ring);
        var core = s("circle", { cx: 0, cy: 0, r: "3.5", class: "fill-ink" });
        g.appendChild(core);
        g.appendChild(s("text", { x: C.lx, y: C.ly, "font-size": C.fs, "text-anchor": "middle", text: pad(i + 1), class: "t-fg" }));
        svg.appendChild(g);
        stations.push({ g: g, ring: ring, core: core });
        hit(g, function () { select(i, 0); });
        g.addEventListener("mouseenter", function () { select(i, state.t === i ? state.k : 0); });
        g.addEventListener("focus", function () { select(i, 0); });
      });

      var anim = null;
      function moveDot(target, instant) {
        if (anim) cancelAnimationFrame(anim);
        var to = len * FR[target];
        if (instant || reduced.matches) {
          var p = route.getPointAtLength(to);
          dot.setAttribute("transform", "translate(" + p.x.toFixed(1) + "," + p.y.toFixed(1) + ")");
          G.at = to; return;
        }
        var from = G && G.at != null ? G.at : len * FR[0];
        var t0 = performance.now(), dur = 520;
        (function step(now) {
          var u = Math.min(1, (now - t0) / dur), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
          var pos = from + (to - from) * e;
          var p = route.getPointAtLength(pos);
          dot.setAttribute("transform", "translate(" + p.x.toFixed(1) + "," + p.y.toFixed(1) + ")");
          G.at = pos;
          if (u < 1) anim = requestAnimationFrame(step);
        })(t0);
      }

      function drawFlags(ti, ki) {
        flagLayer.textContent = "";
        var p = pts[ti];
        C.off.forEach(function (o, i) {
          var fx = Math.max(C.min, Math.min(C.max, p.x + o[0])), fy = p.y + o[1];
          var g = s("g", { opacity: i === ki ? "1" : ".5" });
          g.appendChild(s("path", { d: "M" + p.x.toFixed(1) + " " + (p.y - 8).toFixed(1) + "Q" + ((p.x + fx) / 2).toFixed(1) + " " + (fy + 14).toFixed(1) + " " + fx.toFixed(1) + " " + fy.toFixed(1), class: "mut", "stroke-width": "1", "stroke-dasharray": "3 4" }));
          g.appendChild(s("path", { d: "M" + fx.toFixed(1) + " " + fy.toFixed(1) + "v-15", class: i === ki ? "ink" : "mut", "stroke-width": "1.4" }));
          g.appendChild(s("path", { d: "M" + fx.toFixed(1) + " " + (fy - 15).toFixed(1) + "l15 4.5l-15 4.5z", class: i === ki ? "fill-ink" : "mut", "stroke-width": "1.2" }));
          g.appendChild(s("circle", { cx: fx.toFixed(1), cy: fy.toFixed(1), r: "2.6", class: i === ki ? "fill-ink" : "mut fill-paper", "stroke-width": "1.2" }));
          flagLayer.appendChild(g);
        });
      }

      return {
        at: null, stations: stations, moveDot: moveDot, drawFlags: drawFlags,
        apply: function (ti, ki, instant) {
          stations.forEach(function (st, i) {
            st.ring.setAttribute("r", i === ti ? "12" : "9");
            st.ring.setAttribute("class", i === ti ? "ink fill-paper" : "fgl fill-paper");
            st.core.setAttribute("r", i === ti ? "5" : "3.5");
            st.g.setAttribute("opacity", i === ti ? "1" : ".6");
          });
          drawFlags(ti, ki);
          moveDot(ti, instant);
        }
      };
    }

    function select(ti, ki, instant) {
      var moved = state.t !== ti;
      state.t = ti; state.k = ki;
      if (G) G.apply(ti, ki, instant || !moved);
      read.set(slugs[ti], ki);
    }
    function relabel() {
      var sv = wrap.querySelector("svg");
      if (sv) sv.setAttribute("aria-label", volTitle(2, 1));
      wrap.querySelectorAll("[data-talkidx]").forEach(function (n) {
        n.setAttribute("aria-label", t("talk." + slugs[parseInt(n.getAttribute("data-talkidx"), 10)] + ".title"));
      });
    }
    onBP(function (mobile) {
      wrap.textContent = "";
      G = build(mobile);
      select(state.t, state.k, true);
      relabel();
    });
    onCopy(relabel);
  }

  /* ═════════════ fig. 4 — vol 3: the handoff loop ═════════════ */
  function figLoop(box) {
    var slugs = VOLS[2], state = { t: 0, k: 0 };
    var svgWrap = el("div", { class: "v-tk-figside" });
    var svg = s("svg", { class: "v-tk-svg", viewBox: "0 0 440 300", role: "group" });
    onCopy(function () { svg.setAttribute("aria-label", volTitle(3, 1)); });

    var RIGHT = "M220 150C292 52 410 66 408 150C406 234 292 246 220 150";
    var LEFT = "M220 150C148 52 30 66 32 150C34 234 148 246 220 150";
    var FULL = RIGHT + "C148 52 30 66 32 150C34 234 148 246 220 150";

    svg.appendChild(s("path", { d: LEFT, class: "fgl draw", "stroke-width": "2", "stroke-dasharray": "7 6", opacity: ".75", pathLength: "100" }));
    svg.appendChild(s("path", { d: RIGHT, class: "ink draw", "stroke-width": "2.2", pathLength: "100", style: "--d:.15s" }));
    var full = s("path", { d: FULL, fill: "none", stroke: "none" });
    svg.appendChild(full);

    /* machine glyph (left) and human glyph (right) */
    var chip = s("g", { transform: "translate(32,150)", class: "fade", style: "--d:.7s" });
    chip.appendChild(s("rect", { x: "-11", y: "-11", width: "22", height: "22", rx: "2", class: "fgl", "stroke-width": "1.4" }));
    chip.appendChild(s("rect", { x: "-4.5", y: "-4.5", width: "9", height: "9", class: "fgl", "stroke-width": "1.2" }));
    [-6, 0, 6].forEach(function (o) {
      chip.appendChild(s("line", { x1: o, y1: -17, x2: o, y2: -11, class: "fgl", "stroke-width": "1.2" }));
      chip.appendChild(s("line", { x1: o, y1: 11, x2: o, y2: 17, class: "fgl", "stroke-width": "1.2" }));
      chip.appendChild(s("line", { x1: -17, y1: o, x2: -11, y2: o, class: "fgl", "stroke-width": "1.2" }));
      chip.appendChild(s("line", { x1: 11, y1: o, x2: 17, y2: o, class: "fgl", "stroke-width": "1.2" }));
    });
    svg.appendChild(chip);
    var person = s("g", { transform: "translate(408,150)", class: "fade", style: "--d:.75s" });
    person.appendChild(s("circle", { cx: "0", cy: "-9", r: "6", class: "ink", "stroke-width": "1.6" }));
    person.appendChild(s("path", { d: "M-11 13c0-9 5-14 11-14s11 5 11 14", class: "ink", "stroke-width": "1.6" }));
    svg.appendChild(person);

    var nodeLayer = s("g", {});
    svg.appendChild(nodeLayer);
    var trav = s("g", {});
    trav.appendChild(s("circle", { cx: 0, cy: 0, r: "6", class: "fill-ink" }));
    trav.appendChild(s("circle", { cx: 0, cy: 0, r: "11", class: "ink", "stroke-width": "1.2", opacity: ".45" }));
    svg.appendChild(trav);

    svgWrap.appendChild(svg);

    var crank = el("div", { class: "v-tk-crank" });
    var rail = el("div", { class: "v-tk-crank-rail" });
    var range = el("input", { type: "range", min: "0", max: "1000", value: "90", step: "1" });
    rail.appendChild(range);
    var cl = el("span", { class: "v-tk-crank-lbl" });
    crank.appendChild(cl); crank.appendChild(rail);
    svgWrap.appendChild(crank);

    var read = makeReadout(2);
    read.onLead = function (i) { select(state.t, i, true); };
    box.appendChild(svgWrap); box.appendChild(read.el);
    box.classList.add("v-tk-figbox--side");

    var len = full.getTotalLength();
    var FR = [.09, .34, .59, .84];
    var nodes = [];
    FR.forEach(function (f, i) {
      var p = full.getPointAtLength(len * f);
      var g = s("g", { transform: "translate(" + p.x.toFixed(1) + "," + p.y.toFixed(1) + ")" });
      g.appendChild(s("circle", { cx: 0, cy: 0, r: "20", fill: "transparent", stroke: "none" }));
      var ring = s("circle", { cx: 0, cy: 0, r: "8", class: "fgl fill-paper", "stroke-width": "1.8" });
      g.appendChild(ring);
      g.appendChild(s("text", { x: 0, y: (p.y < 150 ? -18 : 26), "font-size": "13", "text-anchor": "middle", text: pad(i + 1), class: "t-fg" }));
      nodeLayer.appendChild(g);
      nodes.push({ g: g, ring: ring, p: p });
      hit(g, function () { range.value = String(Math.round(FR[i] * 1000)); select(i, 0, true); });
      onCopy(function () { g.setAttribute("aria-label", t("talk." + slugs[i] + ".title")); });
    });

    var leadLayer = s("g", {});
    svg.appendChild(leadLayer);

    function place(u) {
      var p = full.getPointAtLength(len * u);
      trav.setAttribute("transform", "translate(" + p.x.toFixed(1) + "," + p.y.toFixed(1) + ")");
    }
    function nearest(u) {
      var best = 0, bd = 9;
      FR.forEach(function (f, i) { var d = Math.min(Math.abs(f - u), 1 - Math.abs(f - u)); if (d < bd) { bd = d; best = i; } });
      return best;
    }
    function drawLeads(ti, ki) {
      leadLayer.textContent = "";
      for (var i = 0; i < 4; i++) {
        var f = (FR[ti] + .038 * (i + 1)) % 1;
        var p = full.getPointAtLength(len * f);
        var g = s("g", { opacity: i === ki ? "1" : ".5" });
        g.appendChild(s("circle", { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: i === ki ? "5.5" : "4", class: i === ki ? "fill-ink" : "ink fill-paper", "stroke-width": "1.4" }));
        if (i === ki) g.appendChild(s("circle", { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: "10", class: "ink", "stroke-width": "1", opacity: ".5" }));
        leadLayer.appendChild(g);
      }
    }
    function select(ti, ki, snap) {
      state.t = ti; state.k = ki;
      nodes.forEach(function (n, i) {
        n.ring.setAttribute("r", i === ti ? "11" : "8");
        n.ring.setAttribute("class", i === ti ? "ink fill-paper" : "fgl fill-paper");
        n.g.setAttribute("opacity", i === ti ? "1" : ".55");
      });
      drawLeads(ti, ki);
      read.set(slugs[ti], ki);
      if (snap) place(FR[ti]);
    }
    range.addEventListener("input", function () {
      var u = parseInt(range.value, 10) / 1000;
      place(u);
      var n = nearest(u);
      if (n !== state.t) select(n, 0);
      else drawLeads(state.t, state.k);
    });
    onCopy(function () {
      cl.textContent = t("ui.vol") + " 3";
      range.setAttribute("aria-label", volTitle(3, 1));
    });
    select(0, 0, true);
  }

  /* ═════════════ fig. 5 — the index of all twelve ═════════════ */
  function figIndex(box) {
    var grid = el("div", { class: "v-tk-ix" });
    VOLS.forEach(function (list, v) {
      var col = el("div", { class: "v-tk-ix-col" });
      var head = el("p", { class: "v-tk-ix-head" });
      onCopy(function () { head.textContent = t("ui.vol") + " " + (v + 1); });
      col.appendChild(head);
      list.forEach(function (slug, i) {
        var a = el("a", { class: "v-tk-ix-card", href: "#" + slug });
        a.style.setProperty("--rot", ((i % 2 ? .35 : -.4) + (v - 1) * .12).toFixed(2) + "deg");
        var no = el("span", { class: "v-tk-ix-no", text: pad(i + 1) });
        var ti = el("span", { "data-i18n": "talk." + slug + ".title" });
        var st = el("span", { class: "v-tk-ix-star", "aria-hidden": "true", text: FEATURED.indexOf(slug) >= 0 ? "★" : "" });
        a.appendChild(no); a.appendChild(ti); a.appendChild(st);
        col.appendChild(a);
      });
      grid.appendChild(col);
    });
    box.appendChild(grid);
  }

  /* ═══════════════════════ talk cards ═══════════════════════ */
  function card(slug, i) {
    var art = el("article", { class: "v-tk-card" + (i % 2 ? " v-tk-card--t2" : ""), id: slug });
    art.setAttribute("data-open", "false");
    art.style.setProperty("--rot", (i % 2 ? .45 : -.55).toFixed(2) + "deg");

    var head = el("div", { class: "v-tk-card-head" });
    var photo = el("div", { class: "v-tk-photo" });
    var img = el("img", {
      src: t("talk." + slug + ".image"), width: "1024", height: "1536", loading: "lazy", decoding: "async",
      "data-i18n": "[alt]talk." + slug + ".title"
    });
    photo.appendChild(img);
    var copy = el("div", { class: "v-tk-card-copy" });
    copy.appendChild(el("p", { class: "v-tk-card-no", text: pad(i + 1) }));
    var h3 = el("h3");
    var btn = el("button", { type: "button", class: "v-tk-toggle", "aria-expanded": "false", "aria-controls": "p-" + slug, "data-i18n": "talk." + slug + ".title" });
    h3.appendChild(btn); copy.appendChild(h3);
    copy.appendChild(el("p", { class: "v-tk-card-sub", "data-i18n": "talk." + slug + ".subtitle" }));
    copy.appendChild(el("p", { class: "v-tk-card-sum", "data-i18n": "talk." + slug + ".summary" }));
    head.appendChild(photo); head.appendChild(copy);
    if (FEATURED.indexOf(slug) >= 0) head.appendChild(el("span", { class: "v-tk-star", "aria-hidden": "true", text: "★" }));
    head.appendChild(el("span", { class: "v-tk-plus", "aria-hidden": "true" }));
    art.appendChild(head);

    var panel = el("div", { class: "v-tk-panel", id: "p-" + slug });
    var inner = el("div", { class: "v-tk-panel-in" });
    var padd = el("div", { class: "v-tk-panel-pad" });
    var ul = el("ul", { class: "v-tk-keys" });
    var kEls = [];
    for (var n = 1; n <= 4; n++) {
      var li = el("li");
      li.appendChild(el("span", { class: "v-tk-kno", text: pad(n) }));
      var txt = el("span");
      li.appendChild(txt); ul.appendChild(li); kEls.push(txt);
    }
    padd.appendChild(ul);
    var invite = el("a", { class: "v-tk-invite", href: "#" });
    invite.appendChild(el("span", { "data-i18n": "talks.invite" }));
    invite.appendChild(el("span", { "aria-hidden": "true", text: "→" }));
    padd.appendChild(invite);
    inner.appendChild(padd); panel.appendChild(inner); art.appendChild(panel);

    onCopy(function () {
      kEls.forEach(function (x, n) {
        x.innerHTML = "";
        x.appendChild(el("b", { text: lead("talk." + slug + ".k" + (n + 1)) }));
        x.appendChild(document.createTextNode(rest("talk." + slug + ".k" + (n + 1))));
      });
      invite.setAttribute("href", mailto(t("talk." + slug + ".title")));
      img.setAttribute("src", t("talk." + slug + ".image"));
    });

    btn.addEventListener("click", function () { setOpen(art, art.getAttribute("data-open") !== "true", true); });
    return art;
  }

  function setOpen(art, open, mark) {
    art.setAttribute("data-open", open ? "true" : "false");
    art.querySelector(".v-tk-toggle").setAttribute("aria-expanded", open ? "true" : "false");
    if (open && mark && history.replaceState) {
      try { history.replaceState(null, "", "#" + art.id); } catch (e) {}
    }
  }

  /* ═══════════════════════ volume sections ═══════════════════════ */
  function volumeSection(v) {
    var sec = el("section", { class: "v-tk-vol", id: "vol-" + v });
    sec.setAttribute("aria-labelledby", "vol-" + v + "-h");
    sec.appendChild(el("p", { class: "v-tk-secno", text: "§ " + pad(v) }));
    var main = el("div", { class: "v-tk-vol-main" });

    var kick = el("p", { class: "v-tk-kicker" });
    onCopy(function () {
      kick.innerHTML = "";
      kick.appendChild(document.createTextNode("§ " + pad(v) + " — "));
      kick.appendChild(el("b", { text: t("ui.vol") + " " + v }));
      kick.appendChild(document.createTextNode(" / 3"));
    });
    main.appendChild(kick);

    var h2 = el("h2", { class: "v-tk-vol-h", id: "vol-" + v + "-h" });
    var span = el("span");
    h2.appendChild(span);
    h2.appendChild(underline(v - 1));
    onCopy(function () { span.textContent = volTitle(v, 1); });
    revealSelf(h2);
    var hw = el("div"); hw.appendChild(h2);
    main.appendChild(hw);

    var fig = el("figure", { class: "v-tk-fig", id: "fig-" + (v + 1) });
    var fbox = el("div", { class: "v-tk-figbox" });
    fig.appendChild(fbox);
    var cap = el("figcaption", { class: "v-tk-cap" });
    var capNo = el("span", { class: "v-tk-figno" });
    var capTx = el("span");
    cap.appendChild(capNo); cap.appendChild(document.createTextNode(" ")); cap.appendChild(capTx);
    onCopy(function () {
      capNo.textContent = t("ui.fig") + " " + (v + 1) + " —";
      capTx.textContent = volTitle(v, 0);
    });
    fig.appendChild(cap);
    main.appendChild(fig);

    var cards = el("div", { class: "v-tk-cards" });
    VOLS[v - 1].forEach(function (slug, i) { cards.appendChild(card(slug, i)); });
    main.appendChild(cards);

    sec.appendChild(main);
    reveal(fig);
    return { sec: sec, fbox: fbox };
  }

  /* ═══════════════════════ hero bits ═══════════════════════ */
  function heroTitle() {
    var h1 = document.getElementById("v-tk-h1");
    onCopy(function () {
      var raw = t("talks.title") || "";
      h1.innerHTML = "";
      var body = raw, tail = "";
      if (/[.!?]$/.test(raw)) { body = raw.slice(0, -1); tail = raw.slice(-1); }
      h1.appendChild(document.createTextNode(body));
      if (tail) h1.appendChild(el("span", { class: "v-tk-dot", text: tail }));
      h1.appendChild(underline(2));
    });
    revealSelf(h1);
  }

  function toc() {
    var ol = document.getElementById("v-tk-toc");
    [1, 2, 3].forEach(function (v) {
      var li = el("li");
      var a = el("a", { href: "#vol-" + v });
      var n = el("span", { class: "v-tk-toc-n", text: pad(v) });
      var tx = el("span");
      a.appendChild(n); a.appendChild(tx); li.appendChild(a); ol.appendChild(li);
      onCopy(function () { tx.textContent = volTitle(v, 1); });
    });
    var li2 = el("li");
    var a2 = el("a", { href: "#index" });
    a2.appendChild(el("span", { class: "v-tk-toc-n", text: "04" }));
    var tx2 = el("span", { "data-i18n": "talks.all" });
    a2.appendChild(tx2); li2.appendChild(a2); ol.appendChild(li2);
  }

  function inkPicker() {
    var OZ = window.OZ;
    var host = document.getElementById("v-tk-dots");
    var name = document.getElementById("v-tk-inkname");
    var btns = OZ.accents.map(function (a) {
      var b = el("button", { type: "button", class: "v-tk-dot-btn" }, [el("i")]);
      b.addEventListener("click", function () { OZ.setAccent(a.id); });
      host.appendChild(b);
      return b;
    });
    function paint() {
      OZ.accents.forEach(function (a, i) {
        btns[i].style.setProperty("--swatch", OZ.theme === "dark" ? a.dark : a.light);
        btns[i].setAttribute("aria-pressed", String(a.id === OZ.accent));
        btns[i].setAttribute("aria-label", a.name[OZ.lang] || a.name.en);
        btns[i].title = a.name[OZ.lang] || a.name.en;
        if (a.id === OZ.accent) name.textContent = a.name[OZ.lang] || a.name.en;
      });
    }
    ["oz:accentchange", "oz:themechange", "oz:langchange"].forEach(function (ev) { document.addEventListener(ev, paint); });
    paint();
  }

  /* ═══════════════════════ boot ═══════════════════════ */
  function init() {
    var OZ = window.OZ;

    FEATURED = (OZ.t("talks.featured") || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    VOLS = [[], [], []];
    SLUGS.forEach(function (slug) {
      var v = parseInt(OZ.t("talk." + slug + ".vol"), 10);
      if (v >= 1 && v <= 3) VOLS[v - 1].push(slug);
    });

    heroTitle();
    toc();
    inkPicker();

    // hero figure
    figNotebooks(document.querySelector('[data-fig="1"]'));
    reveal(document.getElementById("fig-1"));

    // facts strip: the "events / in-house" line from the intro
    var stage = document.getElementById("v-tk-fact-stage");
    onCopy(function () {
      var bits = (t("talks.intro") || "").split(". ");
      stage.textContent = bits.length > 1 ? bits[bits.length - 1] : t("talks.intro");
    });

    // figure numbers in static captions
    document.querySelectorAll("[data-figno]").forEach(function (node) {
      onCopy(function () { node.textContent = t("ui.fig") + " " + node.getAttribute("data-figno") + " —"; });
    });

    // three volumes
    var host = document.getElementById("v-tk-vols");
    var boxes = [];
    [1, 2, 3].forEach(function (v) {
      var made = volumeSection(v);
      host.appendChild(made.sec);
      boxes.push(made.fbox);
    });
    figDial(boxes[0]);
    figRoute(boxes[1]);
    figLoop(boxes[2]);

    // closing
    figIndex(document.querySelector('[data-fig="5"]'));
    reveal(document.getElementById("fig-5"));
    var cta = document.getElementById("v-tk-cta");
    var credit = document.getElementById("v-tk-credit");
    onCopy(function () {
      cta.setAttribute("href", mailto(t("talks.title")));
      credit.textContent = (t("projects.credit") || "").replace("{model}", MODEL);
      document.title = t("talks.page_title");
    });

    OZ.apply(document);
    refresh();

    // deep links: /talks/#<slug>
    function fromHash(instant) {
      var id = decodeURIComponent((location.hash || "").slice(1));
      if (!id) return;
      var node = document.getElementById(id);
      if (!node) return;
      if (node.classList.contains("v-tk-card")) {
        setOpen(node, true, false);
        node.classList.add("is-in");
      }
      requestAnimationFrame(function () { smoothTo(node, instant); });
    }
    window.addEventListener("hashchange", function () { fromHash(false); });
    fromHash(true);
  }

  function refresh() { derived.forEach(function (f) { f(); }); }
  document.addEventListener("oz:langchange", refresh);

  if (window.OZ) window.OZ.ready.then(init);
  else document.addEventListener("oz:ready", init, { once: true });
})();
