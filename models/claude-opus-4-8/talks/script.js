/* ============================================================
   /talks/ — Field Notebook detail page
   Built by Claude Opus 4.8 from the shared spec. Vanilla JS, inline SVG.
   ============================================================ */
(function () {
  "use strict";

  var MODEL = "Claude Opus 4.8";
  var SVGNS = "http://www.w3.org/2000/svg";

  /* Structural data (slugs are identifiers, like projects.order — not copy). */
  var VOLUMES = [
    { n: 1, slugs: ["industrial-revolution-internet-ai", "solopreneurship", "ai-agent-organizations", "corporate-memory"] },
    { n: 2, slugs: ["ai-in-finance", "retail-silent-revolution", "ai-logistics-traceability", "next-gen-ecommerce"] },
    { n: 3, slugs: ["new-role-of-humans", "ai-software-development", "ai-customer-experience", "ai-design-creativity"] }
  ];

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var T = function (k) { return (window.OZ && OZ.t(k)) || ""; };
  var featured = [];

  /* ---------- helpers ---------- */
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    if (html != null) n.innerHTML = html;
    return n;
  }
  function mailto(subject) {
    var addr = OZ.email();
    return "mailto:" + addr + "?subject=" + encodeURIComponent(subject);
  }
  /* split "… Vol.1 - Chapter Title" -> {kicker, title} */
  function splitVol(full) {
    var i = full.indexOf(" - ");
    if (i < 0) return { kicker: "", title: full };
    return { kicker: full.slice(0, i), title: full.slice(i + 3) };
  }
  /* hand-drawn underline svg appended after a .vt-u span */
  function underlineSVG() {
    var s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("class", "vt-u-svg");
    s.setAttribute("viewBox", "0 0 300 12");
    s.setAttribute("preserveAspectRatio", "none");
    var p = document.createElementNS(SVGNS, "path");
    p.setAttribute("d", "M2 8 C 60 2, 120 11, 180 5 S 280 3, 298 7");
    s.appendChild(p);
    return s;
  }
  /* wrap the last word of an element's text in .vt-u + underline */
  function decorateLastWord(node) {
    var txt = (node.textContent || "").trim();
    if (!txt) return;
    var m = txt.match(/^(.*\s)?(\S+)$/);
    node.textContent = "";
    if (m[1]) node.appendChild(document.createTextNode(m[1]));
    var span = el("span", { class: "vt-u" });
    span.textContent = m[2];
    span.appendChild(underlineSVG());
    node.appendChild(span);
  }

  /* ============================================================
     HERO: ink picker · contents · fig.1 notebooks
     ============================================================ */
  function buildInk() {
    var wrap = document.getElementById("vt-ink-dots");
    wrap.innerHTML = "";
    OZ.accents.forEach(function (a) {
      var b = el("button", {
        class: "vt-ink-dot",
        type: "button",
        "aria-label": a.name[OZ.lang] || a.name.en
      });
      wrap.appendChild(b);
      b._id = a.id;
      b.addEventListener("click", function () { OZ.setAccent(a.id); });
    });
    refreshInk();
  }
  function refreshInk() {
    var dark = OZ.theme === "dark";
    var dots = document.querySelectorAll(".vt-ink-dot");
    for (var i = 0; i < dots.length; i++) {
      var a = OZ.accents.filter(function (x) { return x.id === dots[i]._id; })[0];
      var hex = dark ? a.dark : a.light;
      dots[i].style.background = hex;
      dots[i].style.color = hex;
      dots[i].setAttribute("aria-pressed", a.id === OZ.accent ? "true" : "false");
      dots[i].setAttribute("aria-label", a.name[OZ.lang] || a.name.en);
    }
    var cur = OZ.accents.filter(function (x) { return x.id === OZ.accent; })[0];
    document.getElementById("vt-ink-name").textContent = cur ? (cur.name[OZ.lang] || cur.name.en) : "";
  }

  function buildContents() {
    var ol = document.getElementById("vt-contents");
    ol.innerHTML = "";
    VOLUMES.forEach(function (v) {
      var sp = splitVol(T("talks.vol" + v.n + ".title"));
      var li = el("li");
      var a = el("a", { href: "#vol-" + v.n });
      a.innerHTML = '<span class="n mono">0' + v.n + '</span>' +
        '<span class="t">' + esc(sp.title) +
        '<span class="k">' + T("ui.vol") + " " + v.n + "</span></span>";
      li.appendChild(a);
      ol.appendChild(li);
    });
  }
  function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function buildBooks() {
    var wrap = document.getElementById("vt-books");
    wrap.innerHTML = "";
    VOLUMES.forEach(function (v) {
      var sp = splitVol(T("talks.vol" + v.n + ".title"));
      var a = el("a", { class: "vt-book", href: "#vol-" + v.n,
        "aria-label": (T("ui.vol") + " " + v.n + " — " + sp.title) });
      a.innerHTML =
        '<svg viewBox="0 0 220 260" role="img">' +
          '<rect class="bk-tape" x="78" y="2" width="64" height="18" rx="1" transform="rotate(-3 110 11)"/>' +
          '<rect class="bk-cover" x="22" y="26" width="176" height="214" rx="4"/>' +
          '<line class="bk-fg" x1="40" y1="26" x2="40" y2="240" stroke-width="1.4" opacity=".5"/>' +
          // spiral binding
          spiral() +
          '<text class="bk-num" x="118" y="120" font-size="64" text-anchor="middle">' + v.n + '</text>' +
          '<text class="bk-lbl" x="118" y="156" font-size="13" text-anchor="middle" letter-spacing="2">' +
            esc((T("ui.vol") || "VOL.").toUpperCase()) + '</text>' +
          // 4 index-card lines (4 talks)
          cardLines() +
          '<line class="bk-ink" x1="56" y1="224" x2="182" y2="224" stroke-width="2.5" stroke-linecap="round"/>' +
        '</svg>';
      wrap.appendChild(a);
    });
  }
  function spiral() {
    var s = "";
    for (var y = 36; y <= 232; y += 22) {
      s += '<line class="bk-fg" x1="26" y1="' + y + '" x2="40" y2="' + (y - 5) + '" stroke-width="2" opacity=".6"/>';
    }
    return s;
  }
  function cardLines() {
    var s = "";
    for (var i = 0; i < 4; i++) {
      var y = 182 + i * 10;
      s += '<line class="bk-fg" x1="56" y1="' + y + '" x2="' + (170 - i * 14) + '" y2="' + y + '" stroke-width="1.4" opacity=".35"/>';
    }
    return s;
  }

  /* ============================================================
     VOLUME SECTIONS + CARDS
     ============================================================ */
  var figN = 1; // fig.1 is the hero notebooks

  function buildVolumes() {
    var host = document.getElementById("vt-volumes");
    host.innerHTML = "";
    VOLUMES.forEach(function (v) {
      var sec = el("section", { class: "vt-vol", id: "vol-" + v.n });

      var head = el("div", { class: "vt-vol-head" });
      head.innerHTML =
        '<div class="vt-vol-num mono">0' + v.n + '</div>' +
        '<div class="vt-vol-label mono"><span>§</span> <span>0' + v.n + '</span> ' +
          '<span class="dash">—</span> <span data-vol-lbl></span></div>' +
        '<p class="vt-vol-kicker mono" data-vol-kicker></p>' +
        '<h2 class="vt-vol-title" data-vol-title></h2>';
      sec.appendChild(head);

      // chapter figure
      figN += 1;
      var fig = buildFigure(v, figN);
      sec.appendChild(fig.el);
      v._fig = fig;

      // cards
      var grid = el("div", { class: "vt-cards" });
      v.slugs.forEach(function (slug) {
        grid.appendChild(buildCard(slug, v.n));
      });
      sec.appendChild(grid);

      host.appendChild(sec);
    });
  }

  function buildCard(slug, voln) {
    var base = "talk." + slug + ".";
    var isFeat = featured.indexOf(slug) >= 0;
    var card = el("article", { class: "vt-card", id: slug });

    var foldId = "fold-" + slug;
    var btn = el("button", { class: "vt-card-btn", type: "button",
      "aria-expanded": "false", "aria-controls": foldId });

    var star = isFeat
      ? '<span class="vt-star mono" title="featured">★</span>' : "";

    btn.innerHTML =
      '<div class="vt-shot">' + star +
        '<img src="' + T(base + "image") + '" alt="" loading="lazy" width="1024" height="1536"' +
        ' data-i18n="[alt]' + base + 'title">' +
      '</div>' +
      '<div class="vt-card-body">' +
        '<div class="vt-card-vol"><span>' + T("ui.vol") + " " + voln + '</span>' +
          '<span class="vt-card-toggle" aria-hidden="true">+</span></div>' +
        '<h3 class="vt-card-title" data-i18n="' + base + 'title"></h3>' +
        '<p class="vt-card-sub" data-i18n="' + base + 'subtitle"></p>' +
        '<p class="vt-card-summary" data-i18n="' + base + 'summary"></p>' +
      '</div>';
    card.appendChild(btn);

    var fold = el("div", { class: "vt-card-fold", id: foldId });
    var inner = el("div", { class: "vt-card-fold-inner" });
    var pad = el("div", { class: "vt-card-body", style: "padding-top:0" });

    var ul = el("ul", { class: "vt-keys" });
    ["k1", "k2", "k3", "k4"].forEach(function (kk, i) {
      var li = el("li");
      li.innerHTML = '<span class="kn">0' + (i + 1) + '</span>' +
        '<span><span class="klead" data-key-lead></span><span data-key-rest></span></span>';
      li._base = base + kk;
      ul.appendChild(li);
    });
    pad.appendChild(ul);

    var invite = el("a", { class: "vt-invite", href: "#" });
    invite.innerHTML = '<span data-i18n="talks.invite"></span> →';
    invite._subjectKey = base + "title";
    pad.appendChild(invite);

    inner.appendChild(pad);
    fold.appendChild(inner);
    card.appendChild(fold);

    // toggle
    btn.addEventListener("click", function () { toggleCard(card); });

    card._btn = btn;
    card._slug = slug;
    return card;
  }

  function toggleCard(card, force) {
    var open = force != null ? force : !card.classList.contains("is-open");
    card.classList.toggle("is-open", open);
    card._btn.setAttribute("aria-expanded", open ? "true" : "false");
    var tog = card._btn.querySelector(".vt-card-toggle");
    if (tog) tog.textContent = open ? "+" : "+"; // rotation via CSS
  }

  /* fill key-point leads (bold part before ":") + invite subjects */
  function refreshCardsText() {
    var lis = document.querySelectorAll(".vt-keys li");
    for (var i = 0; i < lis.length; i++) {
      var full = T(lis[i]._base);
      var ci = full.indexOf(":");
      var lead = lis[i].querySelector("[data-key-lead]");
      var rest = lis[i].querySelector("[data-key-rest]");
      if (ci >= 0) {
        lead.textContent = full.slice(0, ci + 1) + " ";
        rest.textContent = full.slice(ci + 1).trim();
      } else { lead.textContent = ""; rest.textContent = full; }
    }
    var invs = document.querySelectorAll(".vt-invite");
    for (var j = 0; j < invs.length; j++) {
      invs[j].href = mailto(T(invs[j]._subjectKey));
    }
  }

  /* ============================================================
     FIGURES — one distinct interactive explainer per volume
     ============================================================ */
  function figFrame(n) {
    var fig = el("figure", { class: "vt-fig vt-chfig" });
    var inner = el("div", { class: "vt-chfig-inner" });
    fig.appendChild(inner);
    var cap = el("figcaption", { class: "vt-figcap mono" });
    fig.appendChild(cap);
    return { fig: fig, inner: inner, cap: cap, n: n };
  }
  function setCap(cap, n, titleText) {
    cap.innerHTML = '<b>' + esc(T("ui.fig")) + " " + n + "</b> — " + esc(titleText);
  }

  function buildFigure(v, n) {
    if (v.n === 1) return figWaves(v, n);
    if (v.n === 2) return figHub(v, n);
    return figBalance(v, n);
  }

  /* ---- fig A (Vol.1): three accelerating transformation waves (stepper) ---- */
  function figWaves(v, n) {
    var f = figFrame(n);
    var cols = [
      { cx: 110, amp: 16, cyc: 1.2, icon: iconGear },
      { cx: 300, amp: 26, cyc: 2.4, icon: iconGlobe },
      { cx: 490, amp: 38, cyc: 4.2, icon: iconNeural }
    ];
    var svg = '<svg class="vt-fig-svg" viewBox="0 0 600 220" role="img" aria-hidden="true">';
    // baseline
    svg += '<path d="M24 150 C 160 146, 440 154, 576 150" fill="none" style="stroke:var(--fg-muted)" stroke-width="1.5" opacity=".5"/>';
    cols.forEach(function (c, i) {
      svg += '<g data-wave="' + i + '">';
      svg += c.icon(c.cx, 60);
      svg += '<path class="wv" data-wp="' + i + '" d="' + wave(c.cx - 70, 150, 140, c.amp, c.cyc) +
        '" fill="none" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round"/>';
      svg += '<text class="mono" x="' + c.cx + '" y="196" text-anchor="middle" font-size="13" style="fill:var(--fg-muted)">0' + (i + 1) + '</text>';
      svg += '</g>';
    });
    svg += '</svg>';
    f.inner.innerHTML = svg;

    // stepper controls
    var ctr = el("div", { class: "vt-steps" });
    var btns = [];
    for (var i = 0; i < 3; i++) (function (i) {
      var b = el("button", { class: "vt-step", type: "button", "aria-pressed": "false" }, "0" + (i + 1));
      b.addEventListener("click", function () { setStep(i); });
      ctr.appendChild(b); btns.push(b);
    })(i);
    var nav = el("div", { class: "vt-step-nav" });
    var prev = el("button", { type: "button", "aria-label": "previous" }, "←");
    var next = el("button", { type: "button", "aria-label": "next" }, "→");
    prev.addEventListener("click", function () { setStep((step + 2) % 3); });
    next.addEventListener("click", function () { setStep((step + 1) % 3); });
    nav.appendChild(prev); nav.appendChild(next);
    ctr.appendChild(nav);
    f.fig.insertBefore(ctr, f.cap);

    var read = el("div", { class: "vt-fig-readout" });
    f.fig.insertBefore(read, f.cap);

    var step = 0;
    function setStep(s) {
      step = s;
      var waves = f.inner.querySelectorAll("[data-wave]");
      for (var i = 0; i < waves.length; i++) {
        var active = i === s;
        waves[i].style.opacity = active ? "1" : (i < s ? ".45" : ".18");
        var wp = waves[i].querySelector(".wv");
        wp.style.strokeWidth = active ? "3" : "2";
        if (active && !reduce) drawPath(wp);
      }
      for (var j = 0; j < btns.length; j++) btns[j].setAttribute("aria-pressed", j === s ? "true" : "false");
      renderRead();
    }
    function renderRead() {
      // headline talk of the volume names the three transformations
      var base = "talk." + v.slugs[0] + ".";
      read.innerHTML = '<span class="r-title">' + esc(T(base + "title")) + '</span>' +
        '<span class="r-sub">' + esc(T(base + "subtitle")) + '</span>' +
        '<span class="r-hint">0' + (step + 1) + ' / 03</span>';
    }

    f.refresh = function () {
      setCap(f.cap, f.n, splitVol(T("talks.vol" + v.n + ".title")).title);
      renderRead();
    };
    f.init = function () { setStep(reduce ? 2 : 0); };
    return { el: f.fig, refresh: function () { f.refresh(); }, init: f.init };
  }

  /* ---- fig B (Vol.2): AI control tower → four sectors (selectable nodes) ---- */
  function figHub(v, n) {
    var f = figFrame(n);
    var core = { x: 300, y: 150 };
    var nodes = [
      { x: 110, y: 66 }, { x: 490, y: 66 }, { x: 110, y: 234 }, { x: 490, y: 234 }
    ];
    var svg = '<svg class="vt-fig-svg" viewBox="0 0 600 300" role="img" aria-hidden="true">';
    // spokes
    nodes.forEach(function (p, i) {
      svg += '<path class="spoke" data-spoke="' + i + '" d="M' + core.x + ' ' + core.y + ' L' + p.x + ' ' + p.y +
        '" fill="none" style="stroke:var(--fg-muted)" stroke-width="1.5" opacity=".3"/>';
    });
    // core: signal dot with arcs
    svg += '<g>' +
      '<circle cx="' + core.x + '" cy="' + core.y + '" r="30" style="fill:var(--card);stroke:var(--ink)" stroke-width="2.5"/>' +
      '<circle cx="' + core.x + '" cy="' + core.y + '" r="6" style="fill:var(--ink)"/>' +
      '<path d="M' + (core.x + 14) + ' ' + (core.y - 14) + ' A20 20 0 0 1 ' + (core.x + 14) + ' ' + (core.y + 14) + '" fill="none" style="stroke:var(--ink)" stroke-width="2" opacity=".6"/>' +
      '<path d="M' + (core.x + 22) + ' ' + (core.y - 22) + ' A32 32 0 0 1 ' + (core.x + 22) + ' ' + (core.y + 22) + '" fill="none" style="stroke:var(--ink)" stroke-width="1.6" opacity=".35"/>' +
      '</g>';
    // sector nodes
    nodes.forEach(function (p, i) {
      svg += '<g data-node="' + i + '">' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="26" data-dot="' + i + '" style="fill:var(--card);stroke:var(--fg-muted)" stroke-width="2"/>' +
        '<text class="mono" x="' + p.x + '" y="' + (p.y + 5) + '" text-anchor="middle" font-size="14" style="fill:var(--fg)">' +
          v.n + '.' + (i + 1) + '</text>' +
        '</g>';
    });
    svg += '</svg>';
    f.inner.innerHTML = svg;

    // selectable legend buttons (keyboard + touch)
    var ctr = el("div", { class: "vt-steps" });
    var btns = [];
    v.slugs.forEach(function (slug, i) {
      var b = el("button", { class: "vt-step", type: "button", "aria-pressed": "false" }, v.n + "." + (i + 1));
      b.addEventListener("mouseenter", function () { preview(i); });
      b.addEventListener("focus", function () { preview(i); });
      b.addEventListener("click", function () { jump(slug); });
      ctr.appendChild(b); btns.push(b);
    });
    f.fig.insertBefore(ctr, f.cap);

    var read = el("div", { class: "vt-fig-readout" });
    f.fig.insertBefore(read, f.cap);

    var sel = 0;
    function preview(i) {
      sel = i;
      var spokes = f.inner.querySelectorAll(".spoke");
      var dots = f.inner.querySelectorAll("[data-dot]");
      for (var k = 0; k < spokes.length; k++) {
        var on = k === i;
        spokes[k].style.opacity = on ? "1" : ".25";
        spokes[k].style.stroke = on ? "var(--ink)" : "var(--fg-muted)";
        spokes[k].style.strokeWidth = on ? "2.5" : "1.5";
        if (on && !reduce) drawPath(spokes[k]);
        dots[k].style.stroke = on ? "var(--ink)" : "var(--fg-muted)";
        dots[k].style.fill = on ? "var(--wash)" : "var(--card)";
      }
      for (var b = 0; b < btns.length; b++) btns[b].setAttribute("aria-pressed", b === i ? "true" : "false");
      renderRead();
    }
    function renderRead() {
      var base = "talk." + v.slugs[sel] + ".";
      read.innerHTML = '<span class="r-title">' + esc(T(base + "title")) + '</span>' +
        '<span class="r-sub">' + esc(T(base + "subtitle")) + '</span>' +
        '<span class="r-hint">' + esc(T("talks.invite")) + ' →</span>';
    }
    function jump(slug) { openCard(slug, true); }

    f.refresh = function () {
      setCap(f.cap, f.n, splitVol(T("talks.vol" + v.n + ".title")).title);
      renderRead();
    };
    f.init = function () { preview(0); };
    return { el: f.fig, refresh: function () { f.refresh(); }, init: f.init };
  }

  /* ---- fig C (Vol.3): Human ⇄ AI handoff (slider) ---- */
  function figBalance(v, n) {
    var f = figFrame(n);
    var svg = '<svg class="vt-fig-svg" viewBox="0 0 600 240" role="img" aria-hidden="true">' +
      // human-value rising bar (left)
      '<line x1="40" y1="210" x2="40" y2="40" style="stroke:var(--fg-muted)" stroke-width="1.5" opacity=".4"/>' +
      '<rect data-hv x="30" y="150" width="20" height="60" rx="2" style="fill:var(--ink)"/>' +
      '<text data-hvt class="mono" x="40" y="30" text-anchor="middle" font-size="12" style="fill:var(--ink)">×1.0</text>' +
      iconPerson(40, 224) +
      // pivot + beam
      '<polygon points="300,206 286,230 314,230" style="fill:var(--fg-muted)" opacity=".7"/>' +
      '<g data-beam style="transform-box:view-box;transform-origin:300px 200px">' +
        '<line x1="150" y1="200" x2="450" y2="200" style="stroke:var(--fg)" stroke-width="3" stroke-linecap="round"/>' +
        '<g data-human-pan></g>' +
        '<g data-ai-pan></g>' +
      '</g>' +
      // AI node (right)
      iconNode(560, 120) +
      '<text data-pct class="mono" x="300" y="40" text-anchor="middle" font-size="22" style="fill:var(--ink)">50%</text>' +
      '</svg>';
    f.inner.innerHTML = svg;

    var slide = el("div", { class: "vt-slider-wrap" });
    var range = el("input", { class: "vt-range", type: "range", min: "0", max: "100", step: "5", value: "50",
      "aria-label": "automation" });
    var labels = el("div", { class: "vt-range-labels mono" });
    labels.innerHTML = '<span>0%</span><span>100%</span>';
    slide.appendChild(range);
    slide.appendChild(labels);
    f.fig.insertBefore(slide, f.cap);

    var read = el("div", { class: "vt-fig-readout" });
    f.fig.insertBefore(read, f.cap);

    function dot(x, y) {
      return '<circle cx="' + x + '" cy="' + y + '" r="5" style="fill:var(--ink)"/>';
    }
    function render(val) {
      var beam = f.inner.querySelector("[data-beam]");
      var ang = (val - 50) * 0.16; // degrees
      beam.style.transform = "rotate(" + ang + "deg)";
      // routine dots: more on AI side as val grows
      var total = 6, nAI = Math.round(val / 100 * total), nH = total - nAI;
      var hp = f.inner.querySelector("[data-human-pan]"), ap = f.inner.querySelector("[data-ai-pan]");
      var s1 = "", s2 = "", i;
      for (i = 0; i < nH; i++) s1 += dot(175 + (i % 3) * 16, 182 - Math.floor(i / 3) * 14);
      for (i = 0; i < nAI; i++) s2 += dot(400 + (i % 3) * 16, 182 - Math.floor(i / 3) * 14);
      hp.innerHTML = s1; ap.innerHTML = s2;
      // human value rises with automation (thesis)
      var mult = 1 + val / 100 * 1.5;
      var h = 20 + val / 100 * 150;
      var hv = f.inner.querySelector("[data-hv]");
      hv.setAttribute("y", String(210 - h));
      hv.setAttribute("height", String(h));
      f.inner.querySelector("[data-hvt]").textContent = "×" + mult.toFixed(1);
      f.inner.querySelector("[data-pct]").textContent = val + "%";
      renderRead(val, mult);
    }
    function renderRead(val, mult) {
      var base = "talk." + v.slugs[0] + ".";
      read.innerHTML = '<span class="r-title">' + esc(T(base + "title")) + '</span>' +
        '<span class="r-sub">' + esc(T(base + "subtitle")) + '</span>' +
        '<span class="r-hint">' + val + '% · ×' + mult.toFixed(1) + '</span>';
    }
    range.addEventListener("input", function () { render(+range.value); });

    f.refresh = function () {
      setCap(f.cap, f.n, splitVol(T("talks.vol" + v.n + ".title")).title);
      render(+range.value);
    };
    f.init = function () { range.value = "50"; render(50); };
    return { el: f.fig, refresh: function () { f.refresh(); }, init: f.init };
  }

  /* ---- svg drawing helpers ---- */
  function wave(x0, y0, w, amp, cycles) {
    var pts = [], steps = 48;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var x = x0 + t * w;
      var y = y0 - Math.sin(t * Math.PI * 2 * cycles) * amp;
      pts.push((i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1));
    }
    return pts.join(" ");
  }
  function drawPath(p) {
    try {
      var len = p.getTotalLength();
      p.style.transition = "none";
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.getBoundingClientRect(); // reflow
      p.style.transition = "stroke-dashoffset .6s ease";
      p.style.strokeDashoffset = "0";
    } catch (e) {}
  }
  function iconGear(cx, cy) {
    return '<g style="stroke:var(--fg);fill:none" stroke-width="2" opacity=".8">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="12"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="4" style="fill:var(--fg)"/>' +
      teeth(cx, cy, 15, 20, 8) + '</g>';
  }
  function teeth(cx, cy, r1, r2, n) {
    var s = "";
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2;
      s += '<line x1="' + (cx + Math.cos(a) * r1).toFixed(1) + '" y1="' + (cy + Math.sin(a) * r1).toFixed(1) +
        '" x2="' + (cx + Math.cos(a) * r2).toFixed(1) + '" y2="' + (cy + Math.sin(a) * r2).toFixed(1) + '"/>';
    }
    return s;
  }
  function iconGlobe(cx, cy) {
    return '<g style="stroke:var(--fg);fill:none" stroke-width="1.8" opacity=".8">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="16"/>' +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="7" ry="16"/>' +
      '<line x1="' + (cx - 16) + '" y1="' + cy + '" x2="' + (cx + 16) + '" y2="' + cy + '"/>' +
      '<line x1="' + (cx - 14) + '" y1="' + (cy - 8) + '" x2="' + (cx + 14) + '" y2="' + (cy - 8) + '"/>' +
      '<line x1="' + (cx - 14) + '" y1="' + (cy + 8) + '" x2="' + (cx + 14) + '" y2="' + (cy + 8) + '"/></g>';
  }
  function iconNeural(cx, cy) {
    var a = [[cx - 16, cy - 8], [cx - 16, cy + 10], [cx + 2, cy], [cx + 18, cy - 10], [cx + 18, cy + 10]];
    var lines = [[0, 2], [1, 2], [2, 3], [2, 4]];
    var s = '<g style="stroke:var(--fg)" stroke-width="1.6" opacity=".85">';
    lines.forEach(function (l) {
      s += '<line x1="' + a[l[0]][0] + '" y1="' + a[l[0]][1] + '" x2="' + a[l[1]][0] + '" y2="' + a[l[1]][1] + '"/>';
    });
    a.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" style="fill:var(--fg)"/>'; });
    return s + '</g>';
  }
  function iconPerson(cx, cy) {
    return '<g style="stroke:var(--fg-muted);fill:none" stroke-width="2" opacity=".7">' +
      '<circle cx="' + cx + '" cy="' + (cy - 10) + '" r="5"/>' +
      '<path d="M' + (cx - 7) + ' ' + (cy + 6) + ' Q' + cx + ' ' + (cy - 4) + ' ' + (cx + 7) + ' ' + (cy + 6) + '"/></g>';
  }
  function iconNode(cx, cy) {
    return '<g style="stroke:var(--fg-muted);fill:none" stroke-width="2" opacity=".7">' +
      '<rect x="' + (cx - 12) + '" y="' + (cy - 10) + '" width="24" height="20" rx="3"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="3" style="fill:var(--fg-muted)"/></g>';
  }

  /* ============================================================
     card opening / hash
     ============================================================ */
  function openCard(slug, scroll) {
    var card = document.getElementById(slug);
    if (!card) return;
    toggleCard(card, true);
    if (scroll) {
      try { history.replaceState(null, "", "#" + slug); } catch (e) {}
      card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      var b = card.querySelector(".vt-card-btn");
      if (b) b.focus({ preventScroll: true });
    }
  }
  function handleHash() {
    var h = (location.hash || "").replace("#", "");
    if (!h) return;
    // card?
    if (document.getElementById(h) && document.getElementById(h).classList.contains("vt-card")) {
      openCard(h, true);
    }
  }

  /* ============================================================
     text refresh (lang/accent/theme)
     ============================================================ */
  function refreshDerived() {
    // hero title underline
    var title = document.getElementById("vt-title");
    if (title) decorateLastWord(title);

    // volume heads
    VOLUMES.forEach(function (v) {
      var sec = document.getElementById("vol-" + v.n);
      if (!sec) return;
      var sp = splitVol(T("talks.vol" + v.n + ".title"));
      sec.querySelector("[data-vol-lbl]").textContent = T("ui.vol") + " " + v.n;
      sec.querySelector("[data-vol-kicker]").textContent = sp.kicker;
      var h = sec.querySelector("[data-vol-title]");
      h.textContent = sp.title;
      decorateLastWord(h);
      if (v._fig) v._fig.refresh();
    });

    buildContents();
    buildBooks();
    refreshCardsText();

    // hero fig caption
    setCapHero();

    // mailto CTAs
    var subj = T("talks.cta");
    document.getElementById("vt-facts-cta").href = mailto(subj);
    document.getElementById("vt-cta-btn").href = mailto(subj);

    // credit
    document.getElementById("vt-credit").textContent =
      T("ui.credit").replace("{model}", MODEL);
  }
  function setCapHero() {
    document.getElementById("vt-cap-hero").innerHTML =
      '<b>' + esc(T("ui.fig")) + ' 1</b> — ' + esc(T("talks.page_intro"));
  }

  /* ============================================================
     init
     ============================================================ */
  function init() {
    featured = (T("talks.featured") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);

    buildInk();
    buildVolumes();
    OZ.apply();          // fill [data-i18n] on the just-injected cards
    refreshDerived();

    // initialise each figure's interactive state (first draw)
    VOLUMES.forEach(function (v) { if (v._fig && v._fig.init) v._fig.init(); });

    handleHash();
    window.addEventListener("hashchange", handleHash);

    document.addEventListener("oz:langchange", function () {
      // core already re-filled [data-i18n]; refresh derived + figures + featured
      featured = (T("talks.featured") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      refreshInk();
      refreshDerived();
    });
    document.addEventListener("oz:accentchange", refreshInk);
    document.addEventListener("oz:themechange", refreshInk);
  }

  if (window.OZ && OZ.ready) OZ.ready.then(init);
  else document.addEventListener("oz:ready", init, { once: true });
})();
