/* ===========================================================================
   ozsert.com — "Field Notebook" homepage · Claude Opus 4.8
   Vanilla JS. Runs after OZ.ready.
   =========================================================================== */
(function () {
  "use strict";

  var PROJECTS = ["ai-code-reviewer", "skill-marketplace", "executive-kpi-agent",
    "ai-gateway", "mailbox-qa", "sam-ai", "player-support-agent"];
  var TALKS = ["solopreneurship", "ai-agent-organizations",
    "ai-logistics-traceability", "ai-software-development"];

  var MODEL_NAME = "Claude Opus 4.8";
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hoverMQ = window.matchMedia("(hover: hover) and (pointer: fine)");

  function calm() {
    return document.documentElement.classList.contains("vo48-calm") || reduceMQ.matches;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ---------- wrap exact substrings (highlights / circles) ---------- */
  function wrapPhrases(text, phrases, build) {
    var marks = [];
    phrases.forEach(function (p, i) {
      if (!p) return;
      var idx = text.indexOf(p);
      if (idx < 0) return;
      marks.push({ start: idx, end: idx + p.length, phrase: p, isLast: i === phrases.length - 1 });
    });
    marks.sort(function (a, b) { return a.start - b.start; });
    // drop overlaps
    var clean = [], last = -1;
    marks.forEach(function (m) { if (m.start >= last) { clean.push(m); last = m.end; } });
    var out = "", cur = 0;
    clean.forEach(function (m) {
      out += esc(text.slice(cur, m.start));
      out += build(esc(m.phrase), m.isLast);
      cur = m.end;
    });
    out += esc(text.slice(cur));
    return out;
  }

  var OVAL = '<svg viewBox="0 0 120 50" aria-hidden="true"><path pathLength="1" d="M60,5 C96,4 116,16 115,26 C114,39 86,47 56,46 C24,45 5,34 6,23 C7,12 30,6 60,5"/></svg>';

  /* ---------- decorate hero + section titles ---------- */
  function decorateAll() {
    // headline: glue last word + filled accent dot, hand underline beneath it
    var h1 = document.querySelector('[data-decorate="headline"]');
    if (h1) {
      var txt = OZ.t("hero.headline");
      var trail = (txt.match(/[.!?]+\s*$/) || [""])[0];
      var core = trail ? txt.slice(0, txt.length - trail.length) : txt;
      var parts = core.split(/\s+/);
      var last = parts.pop() || "";
      var head = parts.join(" ");
      h1.innerHTML = (head ? esc(head) + " " : "") +
        '<span class="vo48-hlast">' + esc(last) +
          (trail ? '<span class="vo48-hdot" aria-hidden="true"></span>' : "") +
          '<svg class="vo48-word-ul" viewBox="0 0 220 22" preserveAspectRatio="none" aria-hidden="true">' +
          '<path pathLength="1" d="M5,13 C55,5 110,18 160,10 C188,6 205,12 215,9"/></svg>' +
        "</span>";
    }
    // role: highlight phrases
    var role = document.querySelector('[data-decorate="role"]');
    if (role) {
      var rtxt = OZ.t("hero.role");
      var hs = (OZ.t("hero.role_highlights") || "").split("|").map(function (s) { return s.trim(); });
      role.innerHTML = wrapPhrases(rtxt, hs, function (p) { return '<span class="vo48-hl">' + p + "</span>"; });
    }
    // manifesto: circle words, last gets arrow (arrow lives in margin note)
    var man = document.querySelector('[data-decorate="manifesto"]');
    if (man) {
      var mtxt = OZ.t("hero.manifesto");
      var cs = (OZ.t("hero.manifesto_circle") || "").split("|").map(function (s) { return s.trim(); });
      man.innerHTML = wrapPhrases(mtxt, cs, function (p) {
        return '<span class="vo48-circle">' + p + OVAL + "</span>";
      });
    }
    // section titles: hand-underline last phrase
    document.querySelectorAll('[data-decorate="uline-last"]').forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var t = OZ.t(key);
      var trail = (t.match(/[.!?]\s*$/) || [""])[0];
      var core = trail ? t.slice(0, t.length - trail.length) : t;
      var words = core.split(" ");
      var n = Math.min(words.length, words.length <= 3 ? words.length : 2);
      var head = words.slice(0, words.length - n).join(" ");
      var tail = words.slice(words.length - n).join(" ");
      el.innerHTML = (head ? esc(head) + " " : "") +
        '<span class="vo48-uline">' + esc(tail) + "</span>" + esc(trail);
    });
  }

  /* ---------- project rows ---------- */
  function buildProjects() {
    var ol = document.getElementById("vo48-project-rows");
    if (!ol) return;
    ol.innerHTML = PROJECTS.map(function (slug, i) {
      var n = ("0" + (i + 1)).slice(-2);
      return '<li class="vo48-row"><a class="vo48-row-link" href="/models/claude-opus-4-8/projects/' + slug + '/">' +
        '<span class="vo48-row-n">' + n + '</span>' +
        '<span class="vo48-row-body">' +
          '<span class="vo48-row-title" data-i18n="project.' + slug + '.title"></span>' +
          '<span class="vo48-row-sub" data-i18n="project.' + slug + '.oneliner"></span>' +
        '</span>' +
        '<span class="vo48-row-meta">' +
          '<span class="vo48-stamp" data-i18n="project.' + slug + '.kind"></span>' +
          '<span class="vo48-stamp-status" data-i18n="project.' + slug + '.status"></span>' +
        '</span>' +
        '<span class="vo48-row-arrow" aria-hidden="true">→</span>' +
      '</a></li>';
    }).join("");
    OZ.apply(ol);
  }

  /* ---------- talk rows ---------- */
  function buildTalks() {
    var ol = document.getElementById("vo48-talk-rows");
    if (!ol) return;
    ol.innerHTML = TALKS.map(function (slug, i) {
      var n = ("0" + (i + 1)).slice(-2);
      return '<li class="vo48-row"><a class="vo48-row-link vo48-talk-link" href="/models/claude-opus-4-8/talks/#' + slug + '" data-img="' + slug + '">' +
        '<span class="vo48-row-n">' + n + '</span>' +
        '<span class="vo48-row-body">' +
          '<span class="vo48-row-title" data-i18n="talk.' + slug + '.title"></span>' +
          '<span class="vo48-row-sub" data-i18n="talk.' + slug + '.subtitle"></span>' +
        '</span>' +
        '<span class="vo48-row-meta">' +
          '<span class="vo48-stamp"><span data-i18n="ui.vol"></span>&nbsp;<span data-i18n="talk.' + slug + '.vol"></span></span>' +
        '</span>' +
        '<span class="vo48-row-arrow" aria-hidden="true">→</span>' +
      '</a></li>';
    }).join("");
    OZ.apply(ol);
    attachHover(ol.querySelectorAll(".vo48-talk-link"), function (el) {
      return OZ.t("talk." + el.getAttribute("data-img") + ".image");
    });
  }

  /* ---------- founder: dot matrix (case 4) ---------- */
  function buildMatrix() {
    var svg = document.querySelector(".vo48-chart-matrix");
    if (!svg) return;
    var cols = 11, rows = 4, r = 3.1, gx = 19, gy = 20, ox = 8, oy = 10;
    var filled = 11 * 4; // represent "1,100+" as a full grid
    var html = "";
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var idx = y * cols + x;
        var cls = idx < filled ? "" : ' class="vo48-mt-empty"';
        html += '<circle cx="' + (ox + x * gx) + '" cy="' + (oy + y * gy) + '" r="' + r + '"' + cls + "></circle>";
      }
    }
    svg.innerHTML = html;
  }

  /* ---------- iznik repeating tile border (fig.1 scene) ---------- */
  function buildIznik() {
    var g = document.querySelector('.vo48-scene[data-accent="iznik"] .vo48-iznik-rep');
    if (!g) return;
    var out = "";
    for (var i = 0; i < 8; i++) {
      var x = 95 + i * 145;
      // tulip / lens
      out += '<path pathLength="1" class="vo48-s vo48-s-thin" d="M' + x + ',134 C' + (x - 18) + ',110 ' + (x - 18) + ',74 ' + x + ',52 C' + (x + 18) + ',74 ' + (x + 18) + ',110 ' + x + ',134 Z"/>';
      // vein
      out += '<path pathLength="1" class="vo48-s vo48-s-thin" d="M' + x + ',126 V60"/>';
      // rumi side curls
      out += '<path pathLength="1" class="vo48-s vo48-s-thin" d="M' + x + ',150 C' + (x - 30) + ',150 ' + (x - 36) + ',128 ' + (x - 30) + ',114 M' + x + ',150 C' + (x + 30) + ',150 ' + (x + 36) + ',128 ' + (x + 30) + ',114"/>';
      // carnation dot above
      out += '<circle pathLength="1" class="vo48-s vo48-s-thin" cx="' + x + '" cy="42" r="6" fill="none"/>';
    }
    g.innerHTML = out;
  }

  /* ---------- experience rows + timeline ---------- */
  function buildExperience() {
    var ol = document.getElementById("vo48-exp-rows");
    if (!ol) return;
    var html = "";
    for (var i = 1; i <= 8; i++) {
      var ring = i === 1;
      html += '<li class="vo48-exp-row">' +
        '<span class="vo48-exp-main">' +
          '<span class="vo48-exp-org" data-i18n="experience.r' + i + '.org"></span>' +
          '<span class="vo48-exp-role" data-i18n="experience.r' + i + '.role"></span>' +
        '</span>' +
        '<span class="vo48-exp-years' + (ring ? ' vo48-exp-years-now' : '') + '" data-i18n="experience.r' + i + '.years" data-ring="' + (ring ? '1' : '0') + '"></span>' +
      '</li>';
    }
    ol.innerHTML = html;
    OZ.apply(ol);
    ringNow();
    buildTicks();
  }

  function ringNow() {
    var el = document.querySelector('.vo48-exp-years-now');
    if (!el) return;
    var key = el.getAttribute("data-i18n");
    var t = OZ.t(key);
    var words = t.split(" ");
    var lastWord = words.pop();
    el.innerHTML = esc(words.join(" ")) + " " +
      '<span class="vo48-now-ring">' + esc(lastWord) +
      '<svg viewBox="0 0 120 50" aria-hidden="true"><path pathLength="1" d="M60,5 C96,4 116,16 115,26 C114,39 86,47 56,46 C24,45 5,34 6,23 C7,12 30,6 60,5"/></svg>' +
      '</span>';
  }

  function buildTicks() {
    var g = document.querySelector(".vo48-tl-ticks");
    if (!g) return;
    var years = [2008, 2012, 2015, 2020, 2025, 2026];
    var min = 2008, max = 2026, x0 = 20, x1 = 1180;
    var html = "";
    years.forEach(function (yr) {
      var x = x0 + (yr - min) / (max - min) * (x1 - x0);
      var now = yr === 2026;
      var lbl = now ? esc(OZ.t("now.label")) : yr;
      html += '<g' + (now ? ' class="vo48-tl-now"' : '') + '>' +
        '<line x1="' + x.toFixed(1) + '" y1="12" x2="' + x.toFixed(1) + '" y2="28"></line>' +
        '<text x="' + x.toFixed(1) + '" y="8" text-anchor="middle">' + lbl + "</text>" +
      "</g>";
    });
    g.innerHTML = html;
  }

  /* ---------- ink picker ---------- */
  function buildInk() {
    var mounts = [document.getElementById("vo48-ink-dots"), document.getElementById("vo48-ink-dots-2")];
    mounts.forEach(function (mount) {
      if (!mount) return;
      mount.innerHTML = "";
      OZ.accents.forEach(function (a) {
        var b = document.createElement("button");
        b.className = "vo48-ink-dot";
        b.type = "button";
        b.setAttribute("role", "radio");
        b.dataset.accent = a.id;
        var dot = document.createElement("span");
        dot.style.background = OZ.theme === "dark" ? a.dark : a.light;
        b.appendChild(dot);
        b.addEventListener("click", function () { OZ.setAccent(a.id); });
        mount.appendChild(b);
      });
    });
    refreshInk();
  }
  function refreshInk() {
    var cur = OZ.accent;
    document.querySelectorAll(".vo48-ink-dot").forEach(function (b) {
      var on = b.dataset.accent === cur;
      b.setAttribute("aria-checked", on ? "true" : "false");
      var a = OZ.accents.filter(function (x) { return x.id === b.dataset.accent; })[0];
      var span = b.querySelector("span");
      if (a && span) span.style.background = OZ.theme === "dark" ? a.dark : a.light;
      var name = a ? a.name[OZ.lang] : "";
      b.setAttribute("aria-label", name);
      b.title = a ? (a.name.en + " / " + a.name.tr) : "";
    });
    var nameEl = document.getElementById("vo48-ink-name");
    if (nameEl) {
      var acc = OZ.accents.filter(function (x) { return x.id === cur; })[0];
      nameEl.textContent = acc ? acc.name[OZ.lang] : "";
    }
  }

  /* ---------- accent scenes (fig. 1) ---------- */
  var scenes;
  function activateScene(id, animate) {
    if (!scenes) return;
    var target = null;
    scenes.forEach(function (s) {
      if (s.getAttribute("data-accent") === id) target = s;
      else { s.classList.remove("is-active"); s.classList.remove("vo48-draw"); }
    });
    if (!target) return;
    target.classList.remove("vo48-draw");  // reset to hidden
    // force reflow so the next draw animates from offset 1
    void target.getBoundingClientRect().width;
    target.classList.add("is-active");
    if (animate && !calm()) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { target.classList.add("vo48-draw"); });
      });
    } else {
      target.classList.add("vo48-draw");
    }
    updateSceneCaption();
  }
  function updateSceneCaption() {
    var cap = document.getElementById("vo48-scene-caption");
    if (cap) cap.textContent = OZ.t("hero.fig." + OZ.accent);
  }

  /* ---------- newsletter posts ---------- */
  var postsCache = null;
  function fmtDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    var loc = OZ.lang === "tr" ? "tr-TR" : "en-GB";
    try { return d.toLocaleDateString(loc, { year: "numeric", month: "short", day: "numeric" }); }
    catch (e) { return iso.slice(0, 10); }
  }
  function renderPosts(posts) {
    var box = document.getElementById("vo48-posts");
    if (!box) return;
    if (!posts || !posts.length) { renderPostsError(); return; }
    box.innerHTML = posts.map(function (p) {
      var img = p.image ? ' data-img="' + esc(p.image) + '"' : "";
      return '<a class="vo48-post vo48-post-link" href="' + esc(p.link) + '" target="_blank" rel="noopener"' + img + '>' +
        '<span class="vo48-post-date">' + esc(fmtDate(p.date)) + "</span>" +
        '<span class="vo48-post-title">' + esc(p.title) + "</span>" +
        '<span class="vo48-post-excerpt">' + esc(p.excerpt || "") + "</span>" +
      "</a>";
    }).join("");
    attachHover(box.querySelectorAll(".vo48-post-link[data-img]"), function (el) {
      return el.getAttribute("data-img");
    });
  }
  function renderPostsError() {
    var box = document.getElementById("vo48-posts");
    if (!box) return;
    box.innerHTML = '<div class="vo48-post-err">' +
      '<p class="vo48-mono vo48-posts-msg">' + esc(OZ.t("newsletter.error")) + "</p>" +
      '<a class="vo48-link-arrow" href="https://thenextsignalnewsletter.substack.com/" target="_blank" rel="noopener">' +
      esc(OZ.t("newsletter.subscribe_substack")) + " →</a></div>";
  }
  function loadPosts() {
    var box = document.getElementById("vo48-posts");
    if (box) box.innerHTML = '<p class="vo48-mono vo48-posts-msg">' + esc(OZ.t("newsletter.loading")) + "</p>";
    OZ.latestPosts(3).then(function (posts) {
      postsCache = posts; renderPosts(posts);
    }).catch(function () { postsCache = null; renderPostsError(); });
  }

  /* ---------- hover pictures (duotone, follows cursor) ---------- */
  var hoverPic = document.getElementById("vo48-hover-pic");
  var hoverImg = document.getElementById("vo48-hover-img");
  var hoverActive = false;
  function attachHover(nodes, getSrc) {
    var useFloat = hoverMQ.matches && !calm();
    nodes.forEach(function (el) {
      var src = getSrc(el);
      if (!src) return;
      if (useFloat) {
        el.addEventListener("mouseenter", function () { showPic(src); });
        el.addEventListener("mouseleave", hidePic);
        el.addEventListener("focus", function () { showPicAt(src, el); });
        el.addEventListener("blur", hidePic);
      } else {
        // static thumbnail in the row (touch / reduced motion)
        if (el.querySelector(".vo48-row-thumb")) return;
        var meta = el.querySelector(".vo48-row-meta") || el;
        var fig = document.createElement("span");
        fig.className = "vo48-row-thumb";
        fig.innerHTML = '<img src="' + esc(src) + '" alt="" width="64" height="44" loading="lazy">';
        fig.style.cssText = "display:inline-block;width:64px;height:44px;overflow:hidden;border-radius:2px;position:relative;filter:grayscale(1)";
        meta.insertBefore ? meta.insertBefore(fig, meta.firstChild) : el.appendChild(fig);
      }
    });
  }
  function showPic(src) {
    if (!hoverPic || !hoverImg) return;
    if (hoverImg.getAttribute("src") !== src) hoverImg.setAttribute("src", src);
    hoverActive = true;
    hoverPic.classList.add("vo48-show");
  }
  function showPicAt(src, el) {
    showPic(src);
    var r = el.getBoundingClientRect();
    positionPic(r.right - 180, r.top + window.scrollY - 40);
  }
  function hidePic() { hoverActive = false; if (hoverPic) hoverPic.classList.remove("vo48-show"); }
  function positionPic(x, y) {
    if (!hoverPic) return;
    var w = 220, h = 150, pad = 12;
    x = Math.max(pad, Math.min(x, window.innerWidth - w - pad));
    y = Math.max(pad + window.scrollY, y);
    hoverPic.style.left = x + "px";
    hoverPic.style.top = y + "px";
  }
  document.addEventListener("mousemove", function (e) {
    if (!hoverActive) return;
    positionPic(e.clientX + 24, e.clientY + window.scrollY + 20);
  });

  /* ---------- copy email ---------- */
  function initCopy() {
    var btn = document.getElementById("vo48-copy-email");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var addr = OZ.email();
      var done = function () {
        var span = btn.querySelector("span") || btn;
        var orig = OZ.t("ui.copy");
        span.textContent = OZ.t("ui.copied");
        setTimeout(function () { span.textContent = OZ.t("ui.copy"); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).then(done, done);
      } else { done(); }
    });
  }

  /* ---------- footer credit ---------- */
  function initCredit() {
    var el = document.getElementById("vo48-credit");
    if (el) el.textContent = OZ.t("ui.credit").replace("{model}", MODEL_NAME);
  }

  /* ---------- toggles ---------- */
  function initToggles() {
    var pen = document.getElementById("vo48-pen-toggle");
    var cal = document.getElementById("vo48-calm-toggle");
    function label(btn, on) {
      var b = btn.querySelector(".vo48-toggle-state");
      if (b) b.textContent = OZ.t(on ? "ui.on" : "ui.off");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
    var penOn = hoverMQ.matches && !reduceMQ.matches;
    label(pen, penOn);
    if (penOn) startTrail();
    pen.addEventListener("click", function () {
      penOn = !penOn; label(pen, penOn);
      if (penOn) startTrail(); else stopTrail();
    });

    var calmOn = false;
    label(cal, calmOn);
    cal.addEventListener("click", function () {
      calmOn = !calmOn; label(cal, calmOn);
      document.documentElement.classList.toggle("vo48-calm", calmOn);
      if (calmOn) stopTrail();
    });
    window._vo48_labelToggles = function () { label(pen, penOn); label(cal, calmOn); };
  }

  /* ---------- pen trail ---------- */
  var canvas = document.querySelector(".vo48-pentrail");
  var ctx, pts = [], rafId = null, trailRunning = false;
  function sizeCanvas() {
    if (!canvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
  }
  function inkColor() {
    return getComputedStyle(document.documentElement).getPropertyValue("--oz-accent").trim() || "#1F5F8B";
  }
  function onMove(e) {
    pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    if (pts.length > 60) pts.shift();
  }
  function drawTrail() {
    if (!trailRunning) return;
    var now = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var col = inkColor();
    for (var i = 1; i < pts.length; i++) {
      var age = now - pts[i].t;
      if (age > 600) continue;
      var alpha = (1 - age / 600) * 0.5;
      ctx.strokeStyle = col;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2.4 * (1 - age / 600) + 0.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
      ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(drawTrail);
  }
  function startTrail() {
    if (!canvas || trailRunning || !hoverMQ.matches || reduceMQ.matches) return;
    sizeCanvas();
    trailRunning = true;
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", sizeCanvas);
    rafId = requestAnimationFrame(drawTrail);
  }
  function stopTrail() {
    trailRunning = false;
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onMove);
    pts = [];
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /* ---------- reveal on scroll ---------- */
  function initReveals() {
    var sel = [".vo48-sec-headings", ".vo48-row", ".vo48-case", ".vo48-fig1",
      ".vo48-word-ul", ".vo48-portrait-frame", ".vo48-now-rule",
      ".vo48-timeline-bar", ".vo48-fig2", ".vo48-exp-row", ".vo48-footer-name"];
    var nodes = document.querySelectorAll(sel.join(","));
    if (!("IntersectionObserver" in window) || calm()) {
      nodes.forEach(function (n) { n.classList.add("vo48-in"); });
      return;
    }
    nodes.forEach(function (n) {
      if (n.tagName.toLowerCase() === "svg" || n.classList.contains("vo48-fig1") ||
          n.classList.contains("vo48-fig2") || n.classList.contains("vo48-timeline-bar")) {
        n.classList.add("vo48-reveal-draw");
      } else {
        n.classList.add("vo48-reveal");
      }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("vo48-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- boot ---------- */
  OZ.ready.then(function () {
    decorateAll();
    buildProjects();
    buildTalks();
    buildMatrix();
    buildIznik();
    buildExperience();
    buildInk();
    initToggles();
    initCopy();
    initCredit();
    loadPosts();

    scenes = Array.prototype.slice.call(document.querySelectorAll(".vo48-scene"));
    updateSceneCaption();
    activateScene(OZ.accent, true);

    initReveals();

    // language change: core re-fills [data-i18n]; we re-run our decorators
    document.addEventListener("oz:langchange", function () {
      decorateAll();
      ringNow();
      buildTicks();
      refreshInk();
      initCredit();
      updateSceneCaption();
      if (postsCache) renderPosts(postsCache); else loadPosts();
      if (window._vo48_labelToggles) window._vo48_labelToggles();
    });

    document.addEventListener("oz:accentchange", function () {
      refreshInk();
      activateScene(OZ.accent, true);
    });

    document.addEventListener("oz:themechange", function () {
      refreshInk();
    });
  });
})();
