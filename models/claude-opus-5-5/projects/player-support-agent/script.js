/* Player Support Agent — field-notebook explainer
   Built by Claude Opus 5.5. Vanilla JS, inline SVG. All words come from OZ.t(). */
(function () {
  "use strict";

  var MODEL_NAME = "Claude Opus 5.5";
  var P = "project.player-support-agent.";
  var RM = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return RM.matches; }

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function t(k) { return window.OZ.t(P + k); }
  function list(k) { return t(k).split("|").map(function (s) { return s.trim(); }); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  /* "Head → a, b" → { head, steps:[a,b] } */
  function flow(s) {
    var parts = s.split("→");
    var head = parts[0].trim();
    var rest = (parts.slice(1).join("→") || "").trim();
    return { head: head, steps: rest ? rest.split(/,\s*/).map(function (x) { return x.trim(); }) : [] };
  }

  /* ---------------------------------------------------------------- icons */
  var IC = {
    chat: '<path d="M4 6.5C4 5.1 5.1 4 6.5 4h11C18.9 4 20 5.1 20 6.5v7c0 1.4-1.1 2.5-2.5 2.5H10.2L6 19.6V16c-1.1 0-2-.9-2-2z"/><path d="M8.6 10.1h.01M12 10h.01M15.4 10.1h.01" stroke-width="2.4"/>',
    mail: '<path d="M3.6 6.4l16.9.2-.2 11H3.7z"/><path d="M3.9 6.8l8.1 6.4 8.3-6.5"/>',
    bag: '<path d="M5.1 8.1l13.9-.1-1.1 12.1-11.8.1z"/><path d="M9 8V6.6a3 3 0 0 1 6 0V8"/><path d="M12 11.3l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/>',
    awning: '<path d="M4 9l1.5-4.6h13.1L20 9"/><path d="M4 9c0 1.4 1.2 2.2 2.7 2.2S9.3 10.4 9.3 9c0 1.4 1.2 2.2 2.7 2.2s2.7-.8 2.7-2.2c0 1.4 1.2 2.2 2.6 2.2S20 10.4 20 9"/><path d="M5.6 11.2v8.4h12.9v-8.4"/><path d="M12 13.4l.6 1.3 1.4.2-1 1 .2 1.4-1.2-.7-1.2.7.2-1.4-1-1 1.4-.2z"/>',
    phone: '<path d="M7.6 3.1h8.9c.8 0 1.5.7 1.5 1.5v14.9c0 .8-.7 1.5-1.5 1.5H7.5c-.8 0-1.5-.7-1.5-1.5V4.6c0-.8.7-1.5 1.6-1.5z"/><path d="M10.5 18h3"/>',
    user: '<path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5"/>',
    monitor: '<path d="M3.5 5.1l17 -.1v11.1h-17z"/><path d="M9 20h6M12 16.2V20"/>',
    group: '<path d="M3.5 7c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4.5c0 1.1-.9 2-2 2H9l-3 2.5v-2.5h-.5c-1.1 0-2-.9-2-2z"/><path d="M17.5 9h1c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H18v2l-2.5-2H12c-1 0-1.7-.6-1.9-1.4"/>',
    headset: '<path d="M5 14v-2a7 7 0 0 1 14 0v2"/><path d="M5 14h2.5v5H6a1 1 0 0 1-1-1zM19 14h-2.5v5H18a1 1 0 0 0 1-1z"/><path d="M17 19c0 1-1.5 2-4 2"/>',
    gamepad: '<path d="M7 8h10a4 4 0 0 1 4 4.5l-.6 3.3a2.3 2.3 0 0 1-4 1L15 15H9l-1.4 1.8a2.3 2.3 0 0 1-4-1L3 12.5A4 4 0 0 1 7 8z"/><path d="M7.5 11v3M6 12.5h3"/><path d="M15.5 12h.01M17.5 13.6h.01" stroke-width="2.4"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    check: '<path d="M5 12.6l4.4 4.4L19 7.4"/>',
    x: '<path d="M6.2 6l11.6 12.1M17.9 6.1L6 18"/>',
    bug: '<path d="M8.5 9.5a3.5 3.5 0 0 1 7 0v5a3.5 3.5 0 0 1-7 0z"/><path d="M12 9.5V18M8.5 12H5M19 12h-3.5M8.7 16l-3 2M15.3 16l3 2M8.8 8.5l-2.3-2M15.2 8.5l2.3-2"/>',
    refresh: '<path d="M19 8.2a7.5 7.5 0 0 0-13.6 1.5"/><path d="M5 15.8a7.5 7.5 0 0 0 13.6-1.5"/><path d="M19.2 4v4.3h-4.3M4.8 20v-4.3h4.3"/>',
    key: '<path d="M8 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M11.5 12H20M17.5 12v3M20 12v2.5"/>',
    reply: '<path d="M10 6l-6 5.5 6 5.5"/><path d="M4 11.5h9a7 7 0 0 1 7 7"/>',
    receipt: '<path d="M6 3.5h12v17l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/>',
    gift: '<path d="M4 9.5h16v3H4zM5.5 12.5h13V20h-13zM12 9.5V20"/><path d="M12 9.5C10 9.5 7.5 9 7.5 7a2.2 2.2 0 0 1 4.5-.3V9.5M12 9.5c2 0 4.5-.5 4.5-2.5a2.2 2.2 0 0 0-4.5-.3"/>',
    ticket: '<path d="M3.5 7.5h17v3a1.5 1.5 0 0 0 0 3v3h-17v-3a1.5 1.5 0 0 0 0-3z"/><path d="M14.5 7.8v1.4M14.5 11.3v1.4M14.5 14.8v1.4"/>',
    shield: '<path d="M12 3.5l7 2.5v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    pencil: '<path d="M15 5l4 4L9 19H5v-4z"/><path d="M13 7l4 4"/>',
    flip: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.6"/><path d="M20 4.5v4.1h-4.1"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.4"/><path d="M4 19.5v-4.1h4.1"/>'
  };
  function icon(name, cls) {
    return '<svg class="vo55-ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + IC[name] + "</svg>";
  }

  /* channel icons: index into c5.fig_now / fig_next */
  var NOW_IC = ["chat", "mail", "bag", "awning"];
  var NEXT_IC = ["monitor", "group", "headset", "gamepad"];

  /* ------------------------------------------------- hand-drawn underlines */
  var MARK = {
    hero: { tr: "Ajanı", en: "Agent", style: "sweep" },
    c1: { tr: "destek anları", en: "support moments", style: "wavy" },
    c2: { tr: "beş adım", en: "Five steps", style: "straight" },
    c3: { tr: "hazır aksiyonlar", en: "Ready-made actions", style: "dashed" },
    c4: { tr: "insan karar verir", en: "a human decides", style: "circle" },
    c5: { tr: "her temas noktası", en: "every touchpoint", style: "double" },
    c6: { tr: "model gerekmez", en: "needs a model", style: "wavy" }
  };
  var STROKES = {
    straight: '<path pathLength="1" d="M2 8 C 50 5, 120 9, 198 5"/>',
    sweep: '<path pathLength="1" d="M2 9 C 40 4, 110 3, 196 6 C 150 7, 90 10, 40 13"/>',
    wavy: '<path pathLength="1" d="M2 7 Q 11 2, 20 7 T 38 7 T 56 7 T 74 7 T 92 7 T 110 7 T 128 7 T 146 7 T 164 7 T 182 7 T 198 6"/>',
    dashed: '<path pathLength="1" class="vo55-dash" d="M2 7 C 60 5, 140 9, 198 6"/>',
    double: '<path pathLength="1" d="M2 5 C 60 3, 140 7, 198 4"/><path pathLength="1" d="M8 10 C 70 8, 130 12, 192 9"/>',
    circle: '<path pathLength="1" d="M108 4 C 168 3, 198 10, 196 22 C 194 34, 150 40, 95 38 C 35 37, 3 31, 4 20 C 5 9, 48 2, 124 7"/>'
  };
  function titleHTML(text, id) {
    var m = MARK[id], lang = window.OZ.lang;
    var phrase = m && m[lang];
    var dot = "";
    if (/\.$/.test(text)) { text = text.slice(0, -1); dot = '<span class="vo55-dot" aria-hidden="true"></span><span class="vo55-sr">.</span>'; }
    var i = phrase ? text.indexOf(phrase) : -1;
    if (i < 0) { // fallback: last two words
      var w = text.split(" ");
      phrase = w.slice(-2).join(" ");
      i = text.lastIndexOf(phrase);
    }
    var style = (m && m.style) || "straight";
    var vb = style === "circle" ? "0 0 200 42" : "0 0 200 14";
    return esc(text.slice(0, i)) +
      '<span class="vo55-mark vo55-mark--' + style + '">' + esc(phrase) +
      '<svg viewBox="' + vb + '" preserveAspectRatio="none" aria-hidden="true">' + STROKES[style] + "</svg></span>" +
      esc(text.slice(i + phrase.length)) + dot;
  }

  /* ================================================================ HERO */
  var heroBuilt = false;
  function buildHero() {
    var svg = $("#vo55-hero-svg");
    var C = { x: 240, y: 170 };
    var pts = [{ x: 70, y: 62 }, { x: 410, y: 62 }, { x: 70, y: 278 }, { x: 410, y: 278 }];
    var paths = [
      "M98 76 C 150 100, 160 166, 206 168",
      "M382 76 C 330 100, 320 166, 274 168",
      "M98 264 C 150 240, 160 176, 206 174",
      "M382 264 C 330 240, 320 176, 274 174"
    ];
    var h = "";
    // corner ticks of the frame
    h += '<g class="vo55-hero-frame"><path pathLength="1" class="vo55-draw" style="--d:0s" d="M14 30 V14 H30M450 14 H466 V30M466 310 V326 H450M30 326 H14 V310"/></g>';
    paths.forEach(function (d, i) {
      h += '<path id="vo55-hp' + i + '" pathLength="1" class="vo55-draw vo55-hero-line" data-i="' + i + '" style="--d:' + (0.5 + i * 0.12) + 's" d="' + d + '"/>';
    });
    // the agent node: circle + signal arcs
    h += '<g class="vo55-agent">' +
      '<path pathLength="1" class="vo55-draw" style="--d:.2s" d="M240 140 C 258 139, 271 152, 270 170 C 269 188, 256 201, 239 200 C 221 199, 209 186, 210 169 C 211 153, 224 141, 243 142"/>' +
      '<circle class="vo55-agent-core" cx="240" cy="170" r="9"/>' +
      '<path pathLength="1" class="vo55-draw vo55-arc" style="--d:1.2s" d="M226 150 C 216 160, 216 180, 226 190"/>' +
      '<path pathLength="1" class="vo55-draw vo55-arc" style="--d:1.2s" d="M254 150 C 264 160, 264 180, 254 190"/>' +
      '<path pathLength="1" class="vo55-draw vo55-arc vo55-arc2" style="--d:1.4s" d="M201 140 C 186 158, 186 182, 201 200"/>' +
      '<path pathLength="1" class="vo55-draw vo55-arc vo55-arc2" style="--d:1.4s" d="M279 140 C 294 158, 294 182, 279 200"/>' +
      "</g>";
    pts.forEach(function (p, i) {
      h += '<g class="vo55-hch" data-i="' + i + '">' +
        '<circle class="vo55-hch-bg" cx="' + p.x + '" cy="' + p.y + '" r="31"/>' +
        '<path pathLength="1" class="vo55-draw" style="--d:' + (i * 0.1) + 's" d="M' + (p.x + 1) + " " + (p.y - 31) +
        " C " + (p.x + 19) + " " + (p.y - 31) + ", " + (p.x + 32) + " " + (p.y - 17) + ", " + (p.x + 31) + " " + (p.y + 1) +
        " C " + (p.x + 30) + " " + (p.y + 19) + ", " + (p.x + 17) + " " + (p.y + 31) + ", " + (p.x - 1) + " " + (p.y + 31) +
        " C " + (p.x - 19) + " " + (p.y + 30) + ", " + (p.x - 31) + " " + (p.y + 17) + ", " + (p.x - 31) + " " + (p.y - 1) +
        " C " + (p.x - 30) + " " + (p.y - 20) + ", " + (p.x - 16) + " " + (p.y - 32) + ", " + (p.x + 4) + " " + (p.y - 30) + '"/>' +
        '<g class="vo55-hch-ic" transform="translate(' + (p.x - 18) + " " + (p.y - 18) + ') scale(1.5)">' + IC[NOW_IC[i]] + "</g></g>";
    });
    // signal pulses travelling into the agent
    paths.forEach(function (d, i) {
      h += '<circle class="vo55-pulse" r="3.2"><animateMotion dur="2.8s" begin="' + (2 + i * 0.7) + 's" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear"><mpath href="#vo55-hp' + i + '"/></animateMotion></circle>';
    });
    svg.innerHTML = h;
    $$(".vo55-hch", svg).forEach(function (g) {
      g.addEventListener("mouseenter", function () { heroFocus(+g.dataset.i); });
      g.addEventListener("mouseleave", function () { heroFocus(-1); });
    });
    heroBuilt = true;
    requestAnimationFrame(function () { requestAnimationFrame(function () { $(".vo55-fig--hero").classList.add("is-in"); }); });
  }
  function heroFocus(i) {
    $$(".vo55-hch, .vo55-hero-line").forEach(function (el) { el.classList.toggle("is-hot", +el.dataset.i === i); });
    $$("#vo55-hero-legend li").forEach(function (li, j) { li.classList.toggle("is-hot", j === i); });
    $("#vo55-hero-svg").classList.toggle("has-hot", i >= 0);
  }
  function renderHero() {
    if (!heroBuilt) buildHero();
    var names = list("c5.fig_now");
    $("#vo55-hero-svg").setAttribute("aria-label", t("hero_fig") + ": " + names.join(", "));
    var ul = $("#vo55-hero-legend");
    ul.innerHTML = names.map(function (n, i) {
      return '<li data-i="' + i + '" tabindex="0">' + icon(NOW_IC[i]) + "<span>" + esc(n) + "</span></li>";
    }).join("");
    $$("li", ul).forEach(function (li) {
      var i = +li.dataset.i;
      li.addEventListener("mouseenter", function () { heroFocus(i); });
      li.addEventListener("mouseleave", function () { heroFocus(-1); });
      li.addEventListener("focus", function () { heroFocus(i); });
      li.addEventListener("blur", function () { heroFocus(-1); });
    });
  }

  /* ========================================================= C1 TIMELINE */
  var tlStep = 0, tlPlayed = false;
  var TL_IC = ["chat", "mail", "star", "phone"];
  IC.star = '<path d="M12 3.6l2.6 5.2 5.7.8-4.1 4 1 5.7L12 16.6l-5.2 2.7 1-5.7-4.1-4 5.7-.8z"/>';
  function renderC1() {
    var ch = list("c1.fig_channels"), dl = list("c1.fig_delays");
    var el = $("#vo55-tl");
    var h = '<svg class="vo55-tl-line vo55-tl-line--h" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="vo55-tl-base" d="M125 12 C 300 8, 450 16, 625 11 S 820 14, 875 12"/>' +
      '<path class="vo55-tl-prog" pathLength="1" d="M125 12 C 300 8, 450 16, 625 11 S 820 14, 875 12"/></svg>' +
      '<svg class="vo55-tl-line vo55-tl-line--v" viewBox="0 0 24 1000" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="vo55-tl-base" d="M12 125 C 8 300, 16 450, 11 625 S 14 820, 12 875"/>' +
      '<path class="vo55-tl-prog" pathLength="1" d="M12 125 C 8 300, 16 450, 11 625 S 14 820, 12 875"/></svg>';
    h += '<ol class="vo55-tl-steps">';
    ch.forEach(function (c, i) {
      var last = i === ch.length - 1;
      h += '<li><button type="button" class="vo55-tl-step' + (last ? " is-last" : "") + '" data-i="' + i + '">' +
        '<span class="vo55-tl-no vo55-mono">0' + (i + 1) + "</span>" +
        '<span class="vo55-tl-node">' + icon(TL_IC[i]) +
        (last ? '<svg class="vo55-tl-cross" viewBox="0 0 60 60" aria-hidden="true"><path pathLength="1" d="M10 12 C 22 24, 36 38, 50 49"/><path pathLength="1" d="M49 10 C 36 22, 24 37, 11 50"/></svg>' : "") +
        "</span>" +
        '<span class="vo55-tl-ch">' + esc(c) + "</span>" +
        '<span class="vo55-tl-delay vo55-mono">' + esc(dl[i] || "") +
        '<svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 5 C 30 2, 60 7, 98 3"/></svg></span>' +
        "</button></li>";
    });
    h += "</ol>";
    h += '<div class="vo55-stepper vo55-mono">' +
      ch.map(function (c, i) { return '<button type="button" class="vo55-pip" data-i="' + i + '" aria-label="' + esc(c) + '">0' + (i + 1) + "</button>"; }).join("") +
      '<button type="button" class="vo55-next" aria-label="→">→</button></div>';
    el.innerHTML = h;
    $$(".vo55-tl-step, .vo55-pip", el).forEach(function (b) {
      b.addEventListener("click", function () { setTl(+b.dataset.i); });
    });
    $(".vo55-next", el).addEventListener("click", function () { setTl((tlStep + 1) % ch.length); });
    setTl(tlStep, true);
  }
  function setTl(i, silent) {
    tlStep = i;
    var el = $("#vo55-tl");
    $$(".vo55-tl-step", el).forEach(function (b, j) {
      b.classList.toggle("is-reached", j <= i);
      b.classList.toggle("is-current", j === i);
      b.setAttribute("aria-pressed", String(j === i));
    });
    $$(".vo55-pip", el).forEach(function (b, j) { b.setAttribute("aria-pressed", String(j === i)); });
    el.style.setProperty("--prog", String(i / 3));
    var nx = $(".vo55-next", el), names = list("c1.fig_channels");
    if (nx) nx.setAttribute("aria-label", "→ " + names[(i + 1) % names.length]);
  }
  function playC1() {
    if (tlPlayed) return;
    tlPlayed = true;
    if (reduced()) { setTl(3); return; }
    setTl(0);
    [1, 2, 3].forEach(function (k) { setTimeout(function () { if (tlStep === k - 1) setTl(k); }, k * 900); });
  }

  /* ========================================================= C2 JOURNEY */
  // message → channel, platform, version, category (shelf, index), urgency, sensitive, signal
  var MSGS = [
    { ch: 0, os: "iOS", ver: "v2.3", id: "#7F3A", shelf: "game", k: 0, urg: 3, sens: true },
    { ch: 1, os: "Android", ver: "v2.3", id: "#1C08", shelf: "app", k: 1, urg: 2 },
    { ch: 0, os: "iOS", ver: "v2.2", id: "#B415", shelf: "game", k: 1, urg: 2, sens: true },
    { ch: 3, os: "Android", ver: "v2.3", id: "#5E92", shelf: "app", k: 2, urg: 3, sig: true },
    { ch: 2, os: "iOS", ver: "v2.3", id: "#09D4", shelf: "app", k: 3, urg: 1 }
  ];
  var SHELF_IC = { app: ["refresh", "key", "bug", "reply"], game: ["receipt", "gift", "ticket", "shield"] };
  var jSel = 0, jTimers = [], jPlayed = false;

  function renderC2() {
    var msgs = list("c2.fig_messages");
    var box = $("#vo55-msgs");
    box.setAttribute("aria-label", t("c2.fig"));
    var chNames = list("c5.fig_now");
    box.innerHTML = msgs.map(function (m, i) {
      var d = MSGS[i];
      return '<button type="button" class="vo55-msg" data-i="' + i + '" aria-pressed="' + (i === jSel) + '">' +
        '<span class="vo55-msg-ic" title="' + esc(chNames[d.ch]) + '">' + icon(NOW_IC[d.ch]) + "</span>" +
        '<span class="vo55-msg-t">“' + esc(m) + '”</span>' +
        '<span class="vo55-msg-go" aria-hidden="true">→</span></button>';
    }).join("");
    $$(".vo55-msg", box).forEach(function (b) {
      b.addEventListener("click", function () { selectMsg(+b.dataset.i, true); });
    });
    buildTrack();
    showJourney(jPlayed || reduced() ? 99 : -1);
  }

  function buildTrack() {
    var steps = list("c2.fig_steps");
    var d = MSGS[jSel];
    var shelf = list(d.shelf === "app" ? "c3.fig_app" : "c3.fig_game");
    var f = flow(shelf[d.k]);
    var chNames = list("c5.fig_now");
    var btn = list("c4.fig_buttons");
    var msg = list("c2.fig_messages")[jSel];

    var out = [];
    // 1 · identify
    out.push('<div class="vo55-chips">' +
      '<span class="vo55-chip">' + icon("user") + '<span class="vo55-mono">' + d.id + "</span></span>" +
      '<span class="vo55-chip">' + icon("phone") + '<span class="vo55-mono">' + d.os + "</span></span>" +
      '<span class="vo55-chip vo55-chip--ink"><span class="vo55-mono">' + d.ver + "</span></span>" +
      '<span class="vo55-chip">' + icon(NOW_IC[d.ch]) + "<span>" + esc(chNames[d.ch]) + "</span></span></div>");
    // 2 · understand
    out.push('<div class="vo55-chips">' +
      '<span class="vo55-chip vo55-chip--cat">' + icon(SHELF_IC[d.shelf][d.k]) + "<span>" + esc(f.head) + "</span></span>" +
      '<span class="vo55-urg vo55-urg--' + d.urg + '" aria-label="' + d.urg + '/3"><i></i><i></i><i></i><b class="vo55-mono">' + d.urg + "/3</b></span></div>");
    // 3 · resolve
    var resolveSteps = d.sig ? f.steps.slice(0, 1) : f.steps;
    out.push('<div class="vo55-flow">' + resolveSteps.map(function (s, i) {
      return (i ? '<span class="vo55-arr" aria-hidden="true">→</span>' : "") + '<span class="vo55-node">' + esc(s) + "</span>";
    }).join("") + "</div>");
    // 4 · escalate
    if (d.sens) {
      out.push('<div class="vo55-mini-approval">' +
        '<span class="vo55-mini-dot" aria-hidden="true"></span>' +
        '<span class="vo55-mini-rule vo55-mono">' + esc(t("c4.fig_rule")) + "</span>" +
        '<span class="vo55-mini-btns">' + btn.map(function (b, i) { return '<span class="vo55-mini-btn' + (i === 0 ? " is-primary" : "") + '">' + esc(b) + "</span>"; }).join("") + "</span>" +
        '<a class="vo55-mini-link vo55-mono" href="#c4">§ 04 ↓</a></div>');
    } else out.push(null);
    // 5 · signal
    if (d.sig) {
      var pile = "";
      for (var i = 0; i < 14; i++) pile += '<i style="--k:' + i + '">' + icon("x") + "</i>";
      out.push('<div class="vo55-signal">' +
        '<span class="vo55-pile" aria-hidden="true">' + pile + "</span>" +
        '<span class="vo55-arr" aria-hidden="true">→</span>' +
        '<span class="vo55-alert">' + icon("bell") + '<span class="vo55-chip vo55-chip--ink"><span class="vo55-mono">' + d.ver + "</span></span>" +
        "<span><b>" + esc(f.head) + "</b> → " + esc(f.steps.slice(1).join(", ")) + "</span></span></div>");
    } else out.push(null);

    var h = '<div class="vo55-bubble">' + icon(NOW_IC[d.ch]) + "<span>“" + esc(msg) + "”</span></div>";
    h += '<ol class="vo55-stations">';
    steps.forEach(function (s, i) {
      h += '<li class="vo55-station' + (out[i] ? "" : " is-skip") + '" data-i="' + i + '">' +
        '<span class="vo55-st-no vo55-mono">0' + (i + 1) + "</span>" +
        '<span class="vo55-st-name vo55-mono">' + esc(s) + "</span>" +
        '<div class="vo55-st-out">' + (out[i] ||
          '<svg class="vo55-skip" viewBox="0 0 80 12" aria-hidden="true"><path pathLength="1" d="M2 7 Q 12 2, 22 7 T 42 7 T 62 7 T 78 6"/></svg>') +
        "</div></li>";
    });
    h += "</ol>";
    $("#vo55-track").innerHTML = h;
  }

  function showJourney(n) {
    $$(".vo55-station").forEach(function (st, i) { st.classList.toggle("is-on", i <= n); });
    var b = $(".vo55-bubble"); if (b) b.classList.toggle("is-on", n >= 0);
    $("#vo55-track").style.setProperty("--jprog", String(Math.max(0, Math.min(n, 4)) / 4));
  }

  function selectMsg(i, play) {
    jSel = i;
    jTimers.forEach(clearTimeout); jTimers = [];
    $$(".vo55-msg").forEach(function (b, j) { b.setAttribute("aria-pressed", String(j === i)); });
    buildTrack();
    if (!play || reduced()) { showJourney(99); return; }
    playJourney();
  }
  function playJourney() {
    jPlayed = true;
    showJourney(-1);
    // force reflow so transitions restart
    void $("#vo55-track").offsetWidth;
    jTimers.push(setTimeout(function () { showJourney(0); }, 120));
    for (var k = 1; k <= 4; k++) (function (k) {
      jTimers.push(setTimeout(function () { showJourney(k); }, 120 + k * 750));
    })(k);
  }

  /* ========================================================= C3 SHELVES */
  var flipped = {};
  var SENSITIVE = { "game-0": true, "game-1": true, "game-3": true };
  function renderC3() {
    var box = $("#vo55-shelves");
    var shelves = [["app", t("c3.fig_app_h"), list("c3.fig_app")], ["game", t("c3.fig_game_h"), list("c3.fig_game")]];
    box.innerHTML = shelves.map(function (sh) {
      return '<div class="vo55-shelf"><h3 class="vo55-shelf-h vo55-mono">' + icon(sh[0] === "app" ? "phone" : "gamepad") + "<span>" + esc(sh[1]) + "</span></h3>" +
        '<ul class="vo55-cards">' + sh[2].map(function (s, i) {
          var f = flow(s), key = sh[0] + "-" + i, sens = SENSITIVE[key];
          var back = '<span class="vo55-mf-head vo55-mono">' + esc(f.head) + "</span>" +
            f.steps.map(function (st, j) {
              return '<span class="vo55-mf-arr" aria-hidden="true"><svg viewBox="0 0 12 18"><path d="M6 1 C 5 6, 7 11, 6 16M2 12 L6 17 L10 12"/></svg></span>' +
                '<span class="vo55-mf-node' + (sens && j === f.steps.length - 1 ? " is-sens" : "") + '">' + esc(st) + "</span>";
            }).join("") +
            '<span class="vo55-mf-arr" aria-hidden="true"><svg viewBox="0 0 12 18"><path d="M6 1 C 5 6, 7 11, 6 16M2 12 L6 17 L10 12"/></svg></span>' +
            '<span class="vo55-mf-done" aria-hidden="true">' + icon("check") + "</span>";
          return '<li class="vo55-card-li"><button type="button" class="vo55-card' + (sens ? " is-sens" : "") + (flipped[key] ? " is-flipped" : "") +
            '" data-key="' + key + '" aria-pressed="' + !!flipped[key] + '" aria-label="' + esc(s) + '" style="--r:' + ((i % 2 ? 1 : -1) * (0.6 + (i * 0.37) % 0.8)).toFixed(2) + 'deg">' +
            '<span class="vo55-tape" aria-hidden="true"></span>' +
            '<span class="vo55-face vo55-face--front" aria-hidden="true">' +
            '<span class="vo55-card-ic">' + icon(SHELF_IC[sh[0]][i]) + "</span>" +
            '<span class="vo55-card-h">' + esc(f.head) + "</span>" +
            '<span class="vo55-card-flip">' + icon("flip") + "</span></span>" +
            '<span class="vo55-face vo55-face--back" aria-hidden="true">' + back + "</span>" +
            "</button></li>";
        }).join("") + "</ul></div>";
    }).join("");
    $$(".vo55-card", box).forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.dataset.key;
        flipped[k] = !flipped[k];
        b.classList.toggle("is-flipped", flipped[k]);
        b.setAttribute("aria-pressed", String(flipped[k]));
      });
    });
  }

  /* ========================================================= C4 APPROVAL */
  var ap = { state: "pending", ver: 1, seed: 7 };
  function rnd(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function draftLines(seed) {
    var r = rnd(seed), h = "";
    var n = 3;
    for (var i = 0; i < n; i++) {
      var w = i === n - 1 ? 40 + r() * 25 : 82 + r() * 16;
      var d = "M2 8", x = 2;
      while (x < 296) {
        var step = 8 + r() * 6;
        var nx = Math.min(296, x + step);
        d += " Q " + (x + step / 2).toFixed(1) + " " + (r() > 0.5 ? 2 + r() * 3 : 11 - r() * 3).toFixed(1) + ", " + nx.toFixed(1) + " " + (7 + r() * 2).toFixed(1);
        x = nx;
      }
      h += '<svg class="vo55-scribble" style="width:' + w.toFixed(0) + '%;--d:' + (i * 0.25) + 's" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="' + d + '"/></svg>';
    }
    return h;
  }
  function renderC4() {
    var box = $("#vo55-approval");
    var parts = t("c4.fig_card").split(" · ");
    var btn = list("c4.fig_buttons");
    var act = flow(list("c3.fig_game")[0]);
    var h = '<div class="vo55-slack" data-state="' + ap.state + '">' +
      '<div class="vo55-sl-head">' +
      '<span class="vo55-sl-av" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9"/></svg></span>' +
      '<b class="vo55-sl-name">' + esc(t("title")) + "</b>" +
      '<span class="vo55-sl-time vo55-mono">14:02</span>' +
      '<span class="vo55-sl-status" aria-hidden="true"></span>' +
      "</div>" +
      '<div class="vo55-sl-meta">' +
      '<span class="vo55-chip vo55-chip--amber">' + icon("receipt") + "<span>" + esc(parts[0] || "") + "</span></span>" +
      '<span class="vo55-stars vo55-mono">' + esc(parts[1] || "") + "</span>" +
      "</div>" +
      '<blockquote class="vo55-sl-quote">' + esc((parts.slice(2).join(" · ") || "")) + "</blockquote>" +
      '<div class="vo55-sl-draft"><span class="vo55-sl-pen">' + icon("pencil") + '<span class="vo55-mono">v' + ap.ver + "</span></span>" +
      '<div class="vo55-sl-lines" id="vo55-lines">' + draftLines(ap.seed) + "</div></div>" +
      '<div class="vo55-sl-act">' + act.steps.map(function (s, i) {
        return (i ? '<span class="vo55-arr" aria-hidden="true">→</span>' : "") + '<span class="vo55-node" style="--d:' + (i * 0.35) + 's">' +
          '<span class="vo55-node-ck">' + icon("check") + "</span>" + esc(s) + "</span>";
      }).join("") + "</div>" +
      '<div class="vo55-sl-btns">' +
      '<button type="button" class="vo55-btn vo55-btn--primary" data-a="approved">' + icon("check") + "<span>" + esc(btn[0]) + "</span></button>" +
      '<button type="button" class="vo55-btn" data-a="rejected">' + icon("x") + "<span>" + esc(btn[1]) + "</span></button>" +
      '<button type="button" class="vo55-btn" data-a="redraft">' + icon("pencil") + "<span>" + esc(btn[2]) + "</span></button>" +
      '<span class="vo55-oneclick vo55-mono" aria-hidden="true"><svg viewBox="0 0 40 24"><path d="M38 14 C 28 18, 16 18, 6 10M4 16 L5 9 L12 8"/></svg>' + esc(t("stat4")) + "</span>" +
      "</div>" +
      '<div class="vo55-stamp vo55-stamp--approved" aria-hidden="true">' + icon("check") + "<span>" + esc(btn[0]) + "</span></div>" +
      '<div class="vo55-stamp vo55-stamp--rejected" aria-hidden="true">' + icon("x") + "<span>" + esc(btn[1]) + "</span></div>" +
      '<p class="vo55-sr" aria-live="polite" id="vo55-ap-live"></p>' +
      "</div>" +
      '<p class="vo55-rule-note vo55-mono">* ' + esc(t("c4.fig_rule")) + "</p>";
    box.innerHTML = h;
    $$(".vo55-btn", box).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.a === ap.state));
      b.addEventListener("click", function () { decide(b.dataset.a); });
    });
  }
  function decide(a) {
    var card = $(".vo55-slack");
    var btn = list("c4.fig_buttons");
    if (a === "redraft") {
      ap.state = "pending"; ap.ver += 1; ap.seed += 13;
      card.dataset.state = "pending";
      var lines = $("#vo55-lines");
      lines.innerHTML = draftLines(ap.seed);
      $(".vo55-sl-pen .vo55-mono").textContent = "v" + ap.ver;
      card.classList.remove("is-redraft"); void card.offsetWidth; card.classList.add("is-redraft");
      $("#vo55-ap-live").textContent = btn[2] + " · v" + ap.ver;
    } else {
      ap.state = ap.state === a ? "pending" : a;
      card.dataset.state = ap.state;
      $("#vo55-ap-live").textContent = ap.state === "pending" ? "" : (a === "approved" ? btn[0] : btn[1]);
    }
    $$(".vo55-btn", card).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.a === ap.state)); });
  }

  /* ========================================================= C5 ROAD */
  var roadSel = 0;
  function renderC5() {
    var now = list("c5.fig_now"), next = list("c5.fig_next");
    var box = $("#vo55-road");
    var all = now.map(function (n, i) { return { n: n, ic: NOW_IC[i], now: true }; })
      .concat(next.map(function (n, i) { return { n: n, ic: NEXT_IC[i], now: false }; }));
    var h = '<div class="vo55-road-in">' +
      '<svg class="vo55-road-line vo55-road-line--h" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="vo55-road-solid" pathLength="1" d="M62 12 C 180 9, 320 15, 500 12"/>' +
      '<path class="vo55-road-dot" d="M500 12 C 660 9, 820 15, 938 12"/>' +
      '<path class="vo55-road-end" d="M950 6 L962 12 L950 18"/></svg>' +
      '<svg class="vo55-road-line vo55-road-line--v" viewBox="0 0 24 1000" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="vo55-road-solid" pathLength="1" d="M12 62 C 9 180, 15 320, 12 500"/>' +
      '<path class="vo55-road-dot" d="M12 500 C 9 660, 15 820, 12 938"/>' +
      '<path class="vo55-road-end" d="M6 950 L12 962 L18 950"/></svg>' +
      '<span class="vo55-milestone vo55-mono" aria-hidden="true">' + esc(t("year")) + "</span>" +
      '<span class="vo55-marker" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.4"/><path d="M7.2 7.2a6.8 6.8 0 0 0 0 9.6M16.8 7.2a6.8 6.8 0 0 1 0 9.6"/></svg></span>' +
      '<ol class="vo55-stops">' + all.map(function (s, i) {
        return '<li><button type="button" class="vo55-stop' + (s.now ? " is-now" : " is-next") + '" data-i="' + i + '" aria-pressed="' + (i === roadSel) + '">' +
          '<span class="vo55-stop-dot"></span>' +
          '<span class="vo55-stop-ic">' + icon(s.ic) + "</span>" +
          '<span class="vo55-stop-n">' + esc(s.n) + "</span></button></li>";
      }).join("") + "</ol></div>";
    box.innerHTML = h;
    $$(".vo55-stop", box).forEach(function (b) {
      b.addEventListener("click", function () { setRoad(+b.dataset.i); });
    });
    setRoad(roadSel);
  }
  function setRoad(i) {
    roadSel = i;
    var box = $("#vo55-road");
    $$(".vo55-stop", box).forEach(function (b, j) {
      b.setAttribute("aria-pressed", String(j === i));
      b.classList.toggle("is-passed", j < i);
    });
    placeMarker();
  }
  function placeMarker() {
    var box = $("#vo55-road .vo55-road-in");
    if (!box) return;
    var dot = $$(".vo55-stop-dot", box)[roadSel];
    var mk = $(".vo55-marker", box);
    if (!dot || !mk) return;
    var b = box.getBoundingClientRect(), d = dot.getBoundingClientRect();
    mk.style.transform = "translate(" + (d.left - b.left + d.width / 2).toFixed(1) + "px," + (d.top - b.top + d.height / 2).toFixed(1) + "px)";
  }

  /* ========================================================= C6 LESSONS */
  var CIRC = [
    "M30 6 C 44 5, 55 15, 54 30 C 53 45, 42 55, 28 54 C 14 53, 5 43, 6 29 C 7 15, 17 7, 34 8",
    "M28 5 C 45 6, 56 17, 54 32 C 52 46, 40 55, 26 53 C 12 51, 4 40, 6 26 C 8 13, 20 5, 36 7",
    "M32 7 C 46 8, 55 19, 53 33 C 51 47, 39 55, 25 53 C 11 51, 5 39, 7 25 C 9 12, 21 4, 38 9"
  ];
  function renderC6() {
    var parts = t("c6.body").split(/(?<=\.)\s+/).filter(Boolean);
    $("#vo55-lessons").innerHTML = parts.map(function (p, i) {
      return '<li><span class="vo55-num vo55-mono" aria-hidden="true">' + (i + 1) +
        '<svg viewBox="0 0 60 60"><path pathLength="1" style="--d:' + (0.2 + i * 0.25) + 's" d="' + CIRC[i % 3] + '"/></svg></span>' +
        "<span>" + esc(p) + "</span></li>";
    }).join("");
  }

  /* ========================================================= misc */
  function renderTitles() {
    $("#vo55-h1").innerHTML = titleHTML(t("title"), "hero");
    $$("[data-title]").forEach(function (h) { h.innerHTML = titleHTML(t(h.dataset.title + ".title"), h.dataset.title); });
    document.title = t("title") + " — ozsert.com";
    var desc = $('meta[name="description"]'); if (desc) desc.setAttribute("content", t("oneliner"));
  }
  function renderCaptions() {
    $$("[data-cap]").forEach(function (c) {
      c.innerHTML = '<span class="vo55-mono vo55-fignum">' + esc(window.OZ.t("ui.fig")) + " " + c.dataset.fig + "</span> — " + esc(t(c.dataset.cap));
    });
  }
  function renderStack() {
    $("#vo55-tags").innerHTML = t("stack").split(/,\s*/).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    $("#vo55-credit").textContent = window.OZ.t("projects.credit").replace("{model}", MODEL_NAME);
  }

  function renderAll() {
    renderTitles();
    renderCaptions();
    renderHero();
    renderC1();
    renderC2();
    renderC3();
    renderC4();
    renderC5();
    renderC6();
    renderStack();
  }

  function observe() {
    var secs = $$(".vo55-reveal");
    if (!("IntersectionObserver" in window) || reduced()) {
      secs.forEach(function (s) { s.classList.add("is-in"); });
      playC1(); jPlayed = true; showJourney(99);
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });
    secs.forEach(function (s) { io.observe(s); });
    // figures that play when they come into view
    var fio = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.id === "fig-c1") playC1();
        if (e.target.id === "fig-c2" && !jPlayed) playJourney();
        fio.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    fio.observe($("#fig-c1"));
    fio.observe($("#fig-c2"));
  }

  function init() {
    document.documentElement.classList.add("vo55-js");
    renderAll();
    requestAnimationFrame(function () { requestAnimationFrame(function () { $(".vo55-hero").classList.add("is-in"); }); });
    observe();
    document.addEventListener("oz:langchange", function () {
      renderAll();
      if (jPlayed) showJourney(99);
    });
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(placeMarker, 80); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeMarker);
  }

  if (window.OZ && window.OZ.ready) window.OZ.ready.then(init);
  else document.addEventListener("oz:ready", init, { once: true });
})();
