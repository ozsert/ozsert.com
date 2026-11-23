/*! ozsert.com — Claude Sonnet 5 homepage script */
(function () {
  "use strict";

  var MODEL_NAME = "Claude Sonnet 5";
  var html = document.documentElement;

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  function calmOn() { return html.classList.contains("v-cs5-calm"); }
  function motionOk() { return !reducedMotion() && !calmOn(); }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // find each phrase (first occurrence) in text, wrap with wrapperFn(phrase)->html, escape the rest
  function wrapPhrases(text, phrases, wrapperFn) {
    var matches = [];
    phrases.forEach(function (p) {
      p = (p || "").trim();
      if (!p) return;
      var idx = text.indexOf(p);
      if (idx > -1) matches.push({ start: idx, end: idx + p.length, text: p });
    });
    matches.sort(function (a, b) { return a.start - b.start; });
    var out = "", pos = 0;
    matches.forEach(function (m) {
      if (m.start < pos) return;
      out += escapeHtml(text.slice(pos, m.start));
      out += wrapperFn(m.text);
      pos = m.end;
    });
    out += escapeHtml(text.slice(pos));
    return out;
  }

  var OVAL_SVG =
    '<svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">' +
    '<path class="v-cs5-draw-path" pathLength="100" d="M50,4 C20,4 4,18 4,30 C4,44 22,56 50,56 C78,56 96,44 96,30 C96,16 80,4 50,4"/>' +
    "</svg>";

  function buildHeadline(text) {
    var parts = text.split(". ");
    var lines;
    if (parts.length > 1) {
      lines = [parts.slice(0, -1).join(". ") + ".", parts[parts.length - 1]];
    } else {
      lines = [text];
    }
    function dotify(line, isLast) {
      var idx = line.lastIndexOf(".");
      if (idx === -1) return escapeHtml(line);
      var before = line.slice(0, idx), after = line.slice(idx + 1);
      return escapeHtml(before) + '<span class="v-cs5-dot">.</span>' + escapeHtml(after);
    }
    var html = "";
    lines.forEach(function (line, i) {
      var last = i === lines.length - 1;
      html += '<span class="v-cs5-line">' + dotify(line, last);
      if (last) {
        html +=
          '<svg class="v-cs5-headline-underline" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">' +
          '<path class="v-cs5-draw-path" pathLength="100" d="M2,9 Q75,2 150,9 T298,8"/></svg>';
      }
      html += "</span>";
    });
    return html;
  }

  function renderHeroDecor() {
    var t = window.OZ.t;

    var h1 = document.getElementById("v-cs5-h1");
    if (h1) h1.innerHTML = buildHeadline(t("hero.headline"));

    var roleEl = document.querySelector(".v-cs5-role");
    if (roleEl) {
      var highlights = (t("hero.role_highlights") || "").split("|");
      roleEl.innerHTML = wrapPhrases(t("hero.role"), highlights, function (p) {
        return "<mark>" + escapeHtml(p) + "</mark>";
      });
    }

    var manEl = document.querySelector(".v-cs5-manifesto");
    if (manEl) {
      var circles = (t("hero.manifesto_circle") || "").split("|");
      manEl.innerHTML = wrapPhrases(t("hero.manifesto"), circles, function (p) {
        return '<span class="v-cs5-circle">' + escapeHtml(p) + OVAL_SVG + "</span>";
      });
    }

    requestAnimationFrame(function () { requestAnimationFrame(updateMarginArrow); });
  }

  function updateMarginArrow() {
    var block = document.querySelector(".v-cs5-manifesto-block");
    var words = document.querySelectorAll(".v-cs5-circle");
    var note = document.querySelector(".v-cs5-margin-note");
    var svg = document.querySelector(".v-cs5-arrow-svg");
    var pathEl = document.getElementById("v-cs5-arrow-path");
    var headEl = document.getElementById("v-cs5-arrow-head");
    if (!block || !words.length || !note || !pathEl || !svg) return;
    if (getComputedStyle(svg).display === "none") return;

    var br = block.getBoundingClientRect();
    var wr = words[words.length - 1].getBoundingClientRect();
    var nr = note.getBoundingClientRect();
    if (!br.width || !br.height) return;

    svg.setAttribute("viewBox", "0 0 " + br.width.toFixed(0) + " " + br.height.toFixed(0));

    var x1 = wr.right - br.left - 2, y1 = wr.bottom - br.top - 6;
    var x2 = nr.left - br.left + 6, y2 = nr.top - br.top + 10;
    var mx = (x1 + x2) / 2 + 14, my = Math.min(y1, y2) - 34;
    pathEl.setAttribute("d", "M" + x1.toFixed(1) + "," + y1.toFixed(1) + " Q " + mx.toFixed(1) + "," + my.toFixed(1) + " " + x2.toFixed(1) + "," + y2.toFixed(1));

    var ang = Math.atan2(y2 - my, x2 - mx);
    var len = 9;
    var a1x = x2 - len * Math.cos(ang - 0.5), a1y = y2 - len * Math.sin(ang - 0.5);
    var a2x = x2 - len * Math.cos(ang + 0.5), a2y = y2 - len * Math.sin(ang + 0.5);
    headEl.setAttribute("d", "M" + a1x.toFixed(1) + "," + a1y.toFixed(1) + " L" + x2.toFixed(1) + "," + y2.toFixed(1) + " L" + a2x.toFixed(1) + "," + a2y.toFixed(1));
  }

  // ---- hero fig caption + vol stamps + case labels + credit -----------------
  function renderSmallCopy() {
    var t = window.OZ.t;

    var figCap = document.querySelector("[data-fig-caption]");
    if (figCap) figCap.textContent = t("ui.fig") + " 1 — " + t("hero.fig." + window.OZ.accent);

    var sigCap = document.querySelector("[data-signal-caption]");
    if (sigCap) sigCap.textContent = t("ui.fig") + " 2 — " + t("newsletter.fig_caption");

    document.querySelectorAll("[data-vol-stamp]").forEach(function (el) {
      var slug = el.getAttribute("data-vol-stamp");
      el.textContent = t("ui.vol") + " " + t("talk." + slug + ".vol");
    });

    document.querySelectorAll("[data-case-label]").forEach(function (el) {
      el.textContent = t("ui.case");
    });

    var credit = document.querySelector("[data-credit]");
    if (credit) credit.textContent = t("ui.credit").replace("{model}", MODEL_NAME);

    var talksCta = document.querySelector("[data-mailto='talks']");
    if (talksCta) talksCta.href = "mailto:" + window.OZ.email();
  }

  // ---- ink picker -------------------------------------------------------------
  function buildInkPicker(container) {
    var OZ = window.OZ;
    var theme = html.getAttribute("data-theme");
    container.innerHTML = "";
    OZ.accents.forEach(function (a) {
      var wrap = document.createElement("div");
      wrap.className = "v-cs5-ink-dot-wrap";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "v-cs5-ink-dot";
      btn.style.setProperty("--dot-color", theme === "dark" ? a.dark : a.light);
      var active = a.id === OZ.accent;
      btn.setAttribute("aria-pressed", String(active));
      btn.setAttribute("aria-label", a.name[OZ.lang] || a.name.en);
      btn.addEventListener("click", function () { OZ.setAccent(a.id); });
      var name = document.createElement("span");
      name.className = "v-cs5-ink-name";
      if (active) name.textContent = a.name[OZ.lang] || a.name.en;
      wrap.appendChild(btn);
      wrap.appendChild(name);
      container.appendChild(wrap);
    });
  }
  function refreshInkPickers() {
    document.querySelectorAll("[data-ink-picker]").forEach(buildInkPicker);
  }

  // ---- toggles: pen trail / calm motion ----------------------------------------
  var PT_KEY = "v-cs5-pentrail", CALM_KEY = "v-cs5-calm";
  function loadPref(k, def) { try { return localStorage.getItem(k) || def; } catch (e) { return def; } }
  function savePref(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var pentrailOn = loadPref(PT_KEY, "on") === "on";
  if (loadPref(CALM_KEY, "off") === "on") html.classList.add("v-cs5-calm");

  function renderToggles() {
    var t = window.OZ.t;
    var pt = document.querySelector('[data-toggle="pentrail"] b');
    var cm = document.querySelector('[data-toggle="calm"] b');
    if (pt) pt.textContent = t(pentrailOn ? "ui.on" : "ui.off");
    if (cm) cm.textContent = t(calmOn() ? "ui.on" : "ui.off");
  }

  function bindToggles() {
    var ptBtn = document.querySelector('[data-toggle="pentrail"]');
    var cmBtn = document.querySelector('[data-toggle="calm"]');
    if (ptBtn) ptBtn.addEventListener("click", function () {
      pentrailOn = !pentrailOn;
      savePref(PT_KEY, pentrailOn ? "on" : "off");
      renderToggles();
      syncTrail();
    });
    if (cmBtn) cmBtn.addEventListener("click", function () {
      html.classList.toggle("v-cs5-calm");
      savePref(CALM_KEY, calmOn() ? "on" : "off");
      renderToggles();
      syncTrail();
    });
  }

  // ---- pen trail (desktop-only ink cursor flourish) ----------------------------
  var trailCanvas, trailCtx, trailPoints = [], trailRaf = null, trailBound = false;
  function hexToRgba(hex, alpha) {
    hex = (hex || "#1F5F8B").replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
    var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha.toFixed(3) + ")";
  }
  function trailCapable() {
    return window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }
  function resizeTrail() {
    if (!trailCanvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    trailCanvas.width = window.innerWidth * dpr;
    trailCanvas.height = window.innerHeight * dpr;
    trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function onTrailMove(e) {
    trailPoints.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    if (trailPoints.length > 60) trailPoints.shift();
  }
  function trailLoop() {
    trailCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var now = performance.now();
    var ink = getComputedStyle(html).getPropertyValue("--oz-accent").trim() || "#1F5F8B";
    trailPoints = trailPoints.filter(function (p) { return now - p.t < 650; });
    trailPoints.forEach(function (p) {
      var age = (now - p.t) / 650;
      trailCtx.beginPath();
      trailCtx.arc(p.x, p.y, 3.2 * (1 - age) + 0.6, 0, Math.PI * 2);
      trailCtx.fillStyle = hexToRgba(ink, (1 - age) * 0.5);
      trailCtx.fill();
    });
    trailRaf = requestAnimationFrame(trailLoop);
  }
  function startTrail() {
    if (trailRaf) return;
    if (!trailCanvas) {
      trailCanvas = document.querySelector(".v-cs5-pentrail");
      trailCtx = trailCanvas.getContext("2d");
      resizeTrail();
      window.addEventListener("resize", resizeTrail);
    }
    if (!trailBound) { window.addEventListener("pointermove", onTrailMove, { passive: true }); trailBound = true; }
    trailLoop();
  }
  function stopTrail() {
    if (trailRaf) { cancelAnimationFrame(trailRaf); trailRaf = null; }
    if (trailBound) { window.removeEventListener("pointermove", onTrailMove); trailBound = false; }
    trailPoints = [];
    if (trailCtx) trailCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
  function syncTrail() {
    if (pentrailOn && motionOk() && trailCapable()) startTrail(); else stopTrail();
  }

  // ---- copy email ---------------------------------------------------------------
  function bindCopyEmail() {
    var btn = document.querySelector("[data-copy-email]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var addr = window.OZ.email();
      var stateEl = btn.querySelector(".v-cs5-copy-state");
      var done = function () {
        if (stateEl) {
          var prev = stateEl.textContent;
          stateEl.textContent = window.OZ.t("ui.copied");
          setTimeout(function () { stateEl.textContent = window.OZ.t("ui.copy"); }, 1800);
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, done);
      } else {
        done();
      }
    });
  }

  // ---- newsletter ------------------------------------------------------------------
  var lastPosts = null, lastPostsError = false;
  function formatDate(d) {
    try {
      var locale = window.OZ.lang === "tr" ? "tr-TR" : "en-GB";
      return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
    } catch (e) { return ""; }
  }
  function renderPosts() {
    var host = document.querySelector("[data-posts]");
    if (!host) return;
    var t = window.OZ.t;
    if (lastPostsError) {
      host.innerHTML = '<p class="v-cs5-posts-state v-cs5-mono">' + escapeHtml(t("newsletter.error")) + "</p>";
      return;
    }
    if (!lastPosts) {
      host.innerHTML = '<p class="v-cs5-posts-state v-cs5-mono">' + escapeHtml(t("newsletter.loading")) + "</p>";
      return;
    }
    if (!lastPosts.length) {
      host.innerHTML = '<p class="v-cs5-posts-state v-cs5-mono">' + escapeHtml(t("newsletter.error")) + "</p>";
      return;
    }
    host.innerHTML = lastPosts.map(function (p) {
      var img = p.image
        ? '<span class="v-cs5-inline-thumb"><img src="' + escapeHtml(p.image) + '" width="90" height="90" loading="lazy" alt=""></span>' +
          '<span class="v-cs5-hover-pic v-cs5-duo"><img src="' + escapeHtml(p.image) + '" width="220" height="220" loading="lazy" alt=""></span>'
        : '<span class="v-cs5-inline-thumb" aria-hidden="true"></span>';
      return (
        '<a class="v-cs5-row v-cs5-post" href="' + escapeHtml(p.link) + '" target="_blank" rel="noopener">' +
        '<span class="v-cs5-post-date v-cs5-mono">' + escapeHtml(formatDate(p.date)) + "</span>" +
        '<span class="v-cs5-post-body">' +
        '<span class="v-cs5-post-title">' + escapeHtml(p.title) + "</span>" +
        '<span class="v-cs5-post-excerpt">' + escapeHtml(p.excerpt) + "</span>" +
        "</span>" +
        '<span class="v-cs5-post-read">' + escapeHtml(t("ui.read")) + " →</span>" +
        img +
        "</a>"
      );
    }).join("");
  }
  function loadPosts() {
    window.OZ.latestPosts(3).then(function (posts) {
      lastPosts = posts; lastPostsError = false; renderPosts();
    }).catch(function () {
      lastPostsError = true; renderPosts();
    });
  }

  // ---- founder case charts: dot matrix -------------------------------------------
  function buildDotMatrix(svg) {
    var cols = 18, rows = 4, pad = 14, r = 2.6, gy = 16, startY = 14;
    var w = 220;
    var gx = (w - pad * 2) / (cols - 1);
    var html = "";
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var cx = pad + col * gx, cy = startY + row * gy;
        var delay = (row * cols + col) * 7;
        html += '<circle class="v-cs5-chart-dot" style="transition-delay:' + delay + 'ms" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r + '"/>';
      }
    }
    svg.innerHTML = html;
  }

  // ---- experience timeline (to scale) ---------------------------------------------
  function buildTimeline(svg) {
    var W = 1000, baseY = 20, barH = 8;
    var START = 2008, END = 2026.85, TOTAL = END - START;
    var segs = [
      [2008, 2012, false], [2012, 2014, false], [2014, 2015, false],
      [2015, 2020, false], [2020, 2025, false], [2025.42, 2026.08, false],
      [2026.08, END, true]
    ];
    var html = "";
    segs.forEach(function (s, i) {
      var x1 = ((s[0] - START) / TOTAL) * W, x2 = ((s[1] - START) / TOTAL) * W;
      var w = Math.max(3, x2 - x1 - 3);
      var fill = s[2] ? "var(--ink)" : "color-mix(in srgb, var(--ink) 32%, transparent)";
      html += '<rect class="v-cs5-fade-el" style="transition-delay:' + (i * 80) + 'ms" x="' + x1.toFixed(1) + '" y="' + baseY + '" width="' + w.toFixed(1) + '" height="' + barH + '" fill="' + fill + '"/>';
    });
    [2008, 2012].forEach(function (y, i) {
      var x = ((y - START) / TOTAL) * W;
      html += '<circle class="v-cs5-fade-el" style="transition-delay:' + (i * 80 + 500) + 'ms" cx="' + x.toFixed(1) + '" cy="8" r="3" fill="var(--fg-muted)"/>';
    });
    html += '<line x1="0" y1="' + (baseY + barH + 9) + '" x2="' + W + '" y2="' + (baseY + barH + 9) + '" stroke="var(--rule)" stroke-width="1"/>';
    svg.innerHTML = html;
  }

  // ---- generic scroll-reveal ----------------------------------------------------------
  function initReveal() {
    var targets = document.querySelectorAll(".v-cs5-reveal, .v-cs5-hero-fig");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-seen"); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-seen");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) { io.observe(el); });
  }

  // ---- smooth scroll for in-page links --------------------------------------------------
  function initScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-scroll]");
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var bar = document.querySelector("oz-topbar");
      var offset = bar ? bar.getBoundingClientRect().height : 40;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 8;
      window.scrollTo({ top: top, behavior: motionOk() ? "smooth" : "auto" });
      if (history.pushState) history.pushState(null, "", id);
    });
  }

  // ---- boot --------------------------------------------------------------------------
  function renderAll() {
    renderHeroDecor();
    renderSmallCopy();
    refreshInkPickers();
    renderToggles();
    renderPosts();
  }

  window.OZ.ready.then(function () {
    var dotSvg = document.querySelector("[data-dotmatrix]");
    if (dotSvg) buildDotMatrix(dotSvg);
    var tlSvg = document.querySelector("[data-timeline]");
    if (tlSvg) buildTimeline(tlSvg);

    renderAll();
    initReveal();
    initScroll();
    bindToggles();
    bindCopyEmail();
    loadPosts();
    syncTrail();

    document.fonts && document.fonts.ready && document.fonts.ready.then(updateMarginArrow);
    window.addEventListener("resize", debounce(updateMarginArrow, 150));

    document.addEventListener("oz:langchange", renderAll);
    document.addEventListener("oz:accentchange", function () {
      renderSmallCopy();
      refreshInkPickers();
    });
    document.addEventListener("oz:themechange", refreshInkPickers);
  });

  function debounce(fn, ms) {
    var tm;
    return function () {
      clearTimeout(tm);
      var args = arguments;
      tm = setTimeout(function () { fn.apply(null, args); }, ms);
    };
  }
})();
