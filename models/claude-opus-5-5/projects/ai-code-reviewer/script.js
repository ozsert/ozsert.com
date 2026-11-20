/* ozsert.com · /projects/ai-code-reviewer/ — figures and copy wiring.
   Vanilla JS, inline SVG only. Built by Claude Opus 5.5. */
(function () {
  "use strict";

  var P = "project.ai-code-reviewer.";
  var MODEL = "Claude Opus 5.5";
  var RMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  function reduced() { return RMQ.matches; }

  /* ------------------------------------------------------------------ utils */
  function t(k) { return window.OZ.t(P + k); }
  function tl(k) { return t(k).split("|").map(function (s) { return s.trim(); }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function ss(p, a, b) { var x = clamp((p - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }
  function f(n) { return Math.round(n * 10) / 10; }
  function dec(n) { var s = String(n); return window.OZ.lang === "tr" ? s.replace(".", ",") : s; }
  function pct(n) { return window.OZ.lang === "tr" ? "%" + n : n + "%"; }
  function rand(seed) {
    var a = seed >>> 0 || 1;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var x = Math.imul(a ^ (a >>> 15), 1 | a);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* -------------------------------------------------------- hand-drawn paths */
  function smooth(pts) {
    if (pts.length < 2) return "";
    var d = "M" + f(pts[0][0]) + " " + f(pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += "C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) + " " +
        f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + f(p2[0]) + " " + f(p2[1]);
    }
    return d;
  }
  function line(x1, y1, x2, y2, r, amp) {
    amp = amp == null ? 1.2 : amp;
    var len = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.round(len / 70)), pts = [];
    var nx = -(y2 - y1) / (len || 1), ny = (x2 - x1) / (len || 1);
    for (var i = 0; i <= n; i++) {
      var k = i / n, j = (i === 0 || i === n) ? (r() - .5) * amp * .5 : (r() - .5) * 2 * amp;
      pts.push([x1 + (x2 - x1) * k + nx * j, y1 + (y2 - y1) * k + ny * j]);
    }
    return smooth(pts);
  }
  function poly(pts, r, amp) {
    amp = amp == null ? .6 : amp;
    return "M" + pts.map(function (p) { return f(p[0] + (r() - .5) * amp) + " " + f(p[1] + (r() - .5) * amp); }).join("L");
  }
  function rect(x, y, w, h, r, amp) {
    return [line(x - 1, y, x + w + 1, y, r, amp), line(x + w, y - 1, x + w, y + h + 1, r, amp),
      line(x + w + 1, y + h, x - 1, y + h, r, amp), line(x, y + h + 1, x, y - 1, r, amp)].join(" ");
  }
  function oval(cx, cy, rx, ry, r, over) {
    var pts = [], n = 16, start = -Math.PI * .6 + (r() - .5) * .6;
    over = over == null ? 1.1 : over;
    for (var i = 0; i <= n; i++) {
      var a = start + i / n * Math.PI * 2 * over;
      var k = 1 + (r() - .5) * .06 + (i / n) * .05;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return smooth(pts);
  }
  function tick(x, y, s, r) {
    return smooth([[x, y], [x + s * .2, y + s * .2], [x + s * .36 + (r() - .5), y + s * .44], [x + s * .7, y - s * .1], [x + s, y - s * .56 + (r() - .5)]]);
  }
  function P_(d, cls, extra) { return '<path class="' + cls + '" d="' + d + '"' + (extra || "") + "/>"; }
  function D(d, cls, extra) { return '<path class="' + cls + ' d" pathLength="1" d="' + d + '"' + (extra || "") + "/>"; }

  /* ---------------------------------------------------- hand-drawn underlines */
  function inkURLs() {
    var c = getComputedStyle(document.documentElement).getPropertyValue("--oz-accent").trim() || "#1F5F8B";
    function url(svg) { return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")'; }
    var head = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 24' preserveAspectRatio='none'>";
    var st = " fill='none' stroke='" + c + "' stroke-linecap='round' vector-effect='non-scaling-stroke'";
    var wave = "M3 12";
    for (var i = 0; i < 20; i++) wave += " Q " + (3 + i * 19.7 + 9.85) + " " + (i % 2 ? 19 : 5) + " " + (3 + (i + 1) * 19.7) + " 12";
    var dash = "";
    for (var j = 0; j < 16; j++) dash += "M" + (4 + j * 24.6) + " " + (14 + (j % 3) - 1) + " L " + (18 + j * 24.6) + " " + (11 + (j % 2)) + " ";
    var root = document.documentElement.style;
    root.setProperty("--vo55-u-sweep", url(head + "<path d='M4 15 C 90 9, 230 6, 396 10'" + st + " stroke-width='3.4'/><path d='M40 19 C 160 15, 280 14, 372 15'" + st + " stroke-width='1.6' stroke-opacity='.55'/></svg>"));
    root.setProperty("--vo55-u-wavy", url(head + "<path d='" + wave + "'" + st + " stroke-width='2.6'/></svg>"));
    root.setProperty("--vo55-u-dashed", url(head + "<path d='" + dash + "'" + st + " stroke-width='3'/></svg>"));
    root.setProperty("--vo55-u-double", url(head + "<path d='M4 8 C 120 5, 260 5, 396 7'" + st + " stroke-width='2.6'/><path d='M14 18 C 140 15, 270 15, 390 17'" + st + " stroke-width='2.6'/></svg>"));
  }

  /* ---------------------------------------------------------- titles & copy */
  function decorateTitle(el) {
    var text = window.OZ.t(el.getAttribute("data-title")) || "";
    var style = el.getAttribute("data-u") || "sweep";
    var core = text.replace(/\.\s*$/, ""), dot = core !== text;
    var start;
    if (el.id === "vo55-h1") {
      start = core.lastIndexOf(" ") + 1;
    } else {
      var ci = core.lastIndexOf(", ");
      if (ci >= 0 && core.slice(ci + 2).split(/\s+/).length <= 3) start = ci + 2;
      else { var w = core.split(" "); start = core.length - w.slice(-2).join(" ").length; }
    }
    el.innerHTML = esc(core.slice(0, start)) + '<span class="vo55-u vo55-u--' + style + '">' + esc(core.slice(start)) + "</span>" +
      (dot ? '<span class="vo55-dot">.</span>' : "");
  }

  function renderCopy() {
    var OZ = window.OZ;
    document.title = t("title") + " · ozsert.com";
    var md = $('meta[name="description"]');
    if (md) md.setAttribute("content", t("oneliner"));
    $$("[data-title]").forEach(decorateTitle);
    $$(".vo55-figno").forEach(function (s) { s.textContent = OZ.t("ui.fig") + " " + s.getAttribute("data-n") + " — "; });
    $$("[data-stat]").forEach(function (p) {
      var s = t(p.getAttribute("data-stat")), m = s.match(/^([\d.,]+\+?)\s+(.+)$/);
      var big = function (x) { return '<span class="vo55-big' + (x.length > 5 ? " vo55-big--long" : "") + '">' + esc(x).replace("+", '<span class="vo55-plus">+</span>') + "</span>"; };
      p.innerHTML = m ? big(m[1]) + '<span class="vo55-unit">' + esc(m[2]) + "</span>" : big(s);
    });
    $("#vo55-tags").innerHTML = t("stack").split(/,\s*/).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    $("#vo55-credit").textContent = OZ.t("projects.credit").replace("{model}", MODEL);
    renderLessons();
  }

  function renderLessons() {
    var body = t("c7.body");
    var items = body.match(/[^.!?]+[.!?]+/g) || [body];
    $("#vo55-lessons").innerHTML = items.map(function (s, i) {
      var r = rand(300 + i);
      return '<li style="--i:' + i + '"><span class="vo55-ln" aria-hidden="true"><svg viewBox="0 0 46 46">' +
        D(oval(23, 23, 18, 17, r, 1.12), "vo55-ink-a") + "</svg>" + (i + 1) + '</span><span>' + esc(s.trim()) + "</span></li>";
    }).join("");
  }

  /* ---------------------------------------------------------- figure system */
  var figs = [];
  function modeOf(el) { return el.clientWidth < 560 ? "n" : "w"; }
  function register(fig) {
    fig.mode = modeOf(fig.el);
    figs.push(fig);
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        var m = modeOf(fig.el);
        if (m !== fig.mode) { fig.mode = m; fig.render(true); if (fig.update) fig.update(fig.p || 0); }
      }).observe(fig.el);
    }
    return fig;
  }
  // render without replaying entrance animations (language switch, resize)
  function quiet(el, fn) {
    el.classList.add("vo55-static");
    fn();
    void el.offsetWidth;
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.remove("vo55-static"); }); });
  }

  /* ================================================================ fig 1 hero */
  var ICONS = [
    function (r) { return [rect(-18, -14, 36, 28, r, .8), poly([[-10, -5], [-4, 0], [-10, 5]], r, .4), line(-1, 6, 9, 6, r, .3)]; },
    function (r) { return [smooth([[0, -9], [-7, -13], [-18, -11], [-18, 12], [-8, 9], [0, 13]]), smooth([[0, -9], [7, -13], [18, -11], [18, 12], [8, 9], [0, 13]]), line(0, -9, 0, 13, r, .3)]; },
    function (r) { return [oval(0, -14, 3.4, 3.4, r), line(0, -10, -14, 9, r, .5) + " " + line(0, -10, 0, 9, r, .3) + " " + line(0, -10, 14, 9, r, .5), oval(-14, 13, 3.2, 3.2, r) + " " + oval(0, 13, 3.2, 3.2, r) + " " + oval(14, 13, 3.2, 3.2, r)]; },
    function (r) { return [oval(-4, -4, 11, 11, r, 1.04), line(4, 4, 15, 15, r, .3), line(-10, -6, 2, -6, r, .3) + " " + line(-10, -1, -1, -1, r, .3)]; },
    function (r) { return [oval(0, 0, 15, 15, r), tick(-8, 1, 16, r)]; },
    function (r) { return [line(-17, 15, 17, 15, r, .4), rect(-14, 4, 7, 11, r, .4), rect(-4, -4, 7, 19, r, .4), rect(6, -13, 7, 28, r, .4)]; },
    function (r) { return [poly([[-12, -17], [6, -17], [13, -10], [13, 17], [-12, 17], [-12, -17]], r, .6), poly([[6, -17], [6, -10], [13, -10]], r, .3), line(-7, -3, 7, -3, r, .3) + " " + line(-7, 3, 7, 3, r, .3) + " " + line(-7, 9, 3, 9, r, .3)]; }
  ];
  var hero = register({ el: $("#vo55-hero-fig"), drawn: false });
  hero.render = function (keep) {
    var self = this;
    quiet(this.el, function () {
      var cap = t("hero_fig"), ci = cap.indexOf(":");
      var steps = (ci >= 0 ? cap.slice(ci + 1) : cap).split("→").map(function (s) { return s.trim(); }).filter(Boolean);
      var N = steps.length, r = rand(11), s = "", W, H;
      if (self.mode === "w") {
        W = 1200; H = 184;
        var y = 108, x0 = 72, x1 = 1128;
        s += D(line(x0 - 50, y, x1 + 46, y, r, 1.4), "vo55-ink vo55-main", ' style="stroke-width:2"');
        steps.forEach(function (lab, i) {
          var x = x0 + (x1 - x0) * i / (N - 1), parts = (ICONS[i] || ICONS[6])(rand(40 + i));
          s += '<g class="vo55-st" style="--i:' + i + '">' +
            '<text class="vo55-no" x="' + x + '" y="20" text-anchor="middle">' + (i < 9 ? "0" : "") + (i + 1) + "</text>" +
            '<g transform="translate(' + x + ' 58)">' + parts.map(function (d, k) { return D(d, (i === 4 && k === 1) ? "vo55-ink-a" : "vo55-ink"); }).join("") + "</g>" +
            P_(oval(x, y, 6, 6, r, 1), "vo55-station") +
            '<text class="vo55-lbl" x="' + x + '" y="' + (y + 40) + '" text-anchor="middle">' + esc(lab) + "</text></g>";
        });
        s += '<g class="vo55-st" style="--i:' + (N - 1) + '">' + P_(poly([[x1 + 34, y - 7], [x1 + 48, y], [x1 + 34, y + 7]], r, .5), "vo55-ink") + "</g>";
      } else {
        var step = 62; W = 340; H = N * step + 6;
        var xL = 44;
        s += D(line(xL, 6, xL, H - 4, r, 1.2), "vo55-ink vo55-main", ' style="stroke-width:2"');
        steps.forEach(function (lab, i) {
          var yy = 32 + i * step, parts = (ICONS[i] || ICONS[6])(rand(40 + i));
          s += '<g class="vo55-st" style="--i:' + i + '">' +
            '<text class="vo55-no" x="8" y="' + (yy + 4) + '">' + (i < 9 ? "0" : "") + (i + 1) + "</text>" +
            P_(oval(xL, yy, 6, 6, r, 1), "vo55-station") +
            '<g transform="translate(' + (xL + 52) + " " + yy + ') scale(.82)">' + parts.map(function (d, k) { return D(d, (i === 4 && k === 1) ? "vo55-ink-a" : "vo55-ink"); }).join("") + "</g>" +
            '<text class="vo55-lbl" x="' + (xL + 86) + '" y="' + (yy + 5) + '">' + esc(lab) + "</text></g>";
        });
      }
      self.el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(cap) + '" class="vo55-anim' + (self.drawn ? " is-on" : "") + '">' + s + "</svg>";
    });
  };
  hero.play = function () {
    if (this.drawn) return;
    this.drawn = true;
    var el = this.el;
    setTimeout(function () { var svg = $("svg", el); if (svg) svg.classList.add("is-on"); }, reduced() ? 0 : 180);
  };

  /* ============================================================ fig 2 noise */
  var noise = register({ el: $("#vo55-noise"), p: 0 });
  noise.render = function () {
    var n = this.mode === "n", W = n ? 340 : 880, cols = n ? 3 : 8, rows = n ? 13 : 8, cw = W / cols, ch = n ? 34 : 44, top = 8;
    var H = top + rows * ch + (n ? 12 : 16), fs = n ? 10 : 11;
    var words = t("c1.fig_noise").replace(/…|\.\.\./g, "").split("·").map(function (s) { return s.trim(); }).filter(Boolean);
    var tc = n ? 1 : 5, tr = n ? 5 : 3, r = rand(23), cells = [], target, s = "";
    for (var row = 0; row < rows; row++) for (var col = 0; col < cols; col++) {
      cells.push({ row: row, col: col, x: col * cw + cw / 2 + (r() - .5) * cw * .24, y: top + row * ch + ch / 2 + (r() - .5) * ch * .22, rot: (r() - .5) * 9, t: row === tr && col === tc });
    }
    target = cells.filter(function (c) { return c.t; })[0];
    var k = 0;
    cells.forEach(function (c) {
      var w, h = fs + 11, bub;
      if (c.t) {
        w = n ? 50 : 62;
        bub = rect(-w / 2, -h / 2, w, h, r, .6) + " " + poly([[-w / 2 + 8, h / 2], [-w / 2 + 5, h / 2 + 7], [-w / 2 + 15, h / 2]], r, .3);
        target.w = w; target.h = h;
        s += '<g transform="translate(' + f(c.x) + " " + f(c.y) + ") rotate(" + f(c.rot) + ')"><g class="vo55-sig">' + P_(bub, "") +
          P_(smooth([[-w / 2 + 9, 1], [-w / 4, -3], [-2, 3], [w / 5, -2], [w / 2 - 9, 1]]), "") + "</g></g>";
        return;
      }
      var word = words[(k++ * 3 + c.row) % words.length];
      w = word.length * fs * .6 + 16;
      bub = rect(-w / 2, -h / 2, w, h, r, .5) + " " + poly([[-w / 2 + 8, h / 2], [-w / 2 + 6, h / 2 + 6], [-w / 2 + 14, h / 2]], r, .3);
      var dx = c.x - target.x, dy = c.y - target.y, L = Math.hypot(dx, dy) || 1, m = 16 + r() * 18;
      s += '<g transform="translate(' + f(c.x) + " " + f(c.y) + ") rotate(" + f(c.rot) + ')"><g class="vo55-nz" style="--dx:' + f(dx / L * m) + ";--dy:" + f(dy / L * m) + '">' +
        P_(bub, "") + '<text text-anchor="middle" y="' + f(fs * .36) + '" style="font-size:' + fs + 'px">' + esc(word) + "</text></g></g>";
    });
    // circle + label
    var rx = target.w / 2 + 22, ry = target.h / 2 + 17;
    s += '<path class="vo55-circ" pathLength="1" style="stroke-dasharray:1 2" d="' + oval(target.x, target.y, rx, ry, rand(5), 1.14) + '"/>';
    var sig = t("c1.fig_signal").split("·").map(function (x) { return x.trim(); });
    var lfs = n ? 13 : 15, tw = Math.max.apply(null, sig.map(function (x) { return x.length; })) * lfs * .6;
    var lx = n ? 18 : Math.min(target.x + rx + 30, W - tw - 14), ly = n ? target.y + ry + 64 : target.y + ry + 40;
    var ax0 = n ? target.x - 6 : target.x + rx * .7, ay0 = n ? target.y + ry + 2 : target.y + ry * .7;
    var ax1 = lx + (n ? 40 : 10), ay1 = ly - lfs - 6;
    var ar = rand(9);
    s += '<g class="vo55-siglabel">' +
      '<rect class="vo55-bgp" x="' + f(lx - 8) + '" y="' + f(ly - lfs - 8) + '" width="' + f(tw + 16) + '" height="' + f(lfs * (sig.length > 1 ? 2.5 : 1.3) + 12) + '" rx="3" opacity=".94"/>' +
      P_(smooth([[ax0, ay0], [(ax0 + ax1) / 2 + 14, (ay0 + ay1) / 2 - 4], [ax1, ay1]]), "vo55-ink-a") +
      P_(poly([[ax1 - 7, ay1 - 5], [ax1, ay1], [ax1 + 2, ay1 - 8]], ar, .4), "vo55-ink-a") +
      '<text class="vo55-s1" x="' + f(lx) + '" y="' + f(ly) + '" style="font-size:' + lfs + 'px">' + esc(sig[0]) + "</text>" +
      (sig[1] ? '<text class="vo55-s2" x="' + f(lx) + '" y="' + f(ly + lfs * 1.35) + '" style="font-size:' + lfs + 'px">' + esc(sig.slice(1).join(" · ")) + "</text>" : "") +
      "</g>";
    this.el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(t("c1.fig") + ": " + t("c1.fig_signal")) + '">' + s + "</svg>";
    this.svg = $("svg", this.el);
    this.circ = $(".vo55-circ", this.el);
    this.update(this.p);
  };
  noise.measure = function () {
    var rc = this.el.getBoundingClientRect(), vh = window.innerHeight;
    return clamp((vh * .8 - rc.top) / (rc.height * .85 + vh * .15), 0, 1);
  };
  noise.update = function (p) {
    this.p = p;
    if (!this.svg) return;
    this.svg.style.setProperty("--fade", f(ss(p, .12, .5) * 100) / 100);
    this.circ.style.strokeDashoffset = 1 - ss(p, .45, .7);
    this.svg.style.setProperty("--lab", ss(p, .66, .82));
  };

  /* ======================================================== fig 3 generator */
  var ROWS = [["portal", ["Vue", "Quasar", "Capacitor", "Security"]], ["api", ["Node", "GraphQL server", "Security"]], ["data", ["SQL", "Security"]]];
  var gen = register({ el: $("#vo55-gen"), step: 0 });
  gen.buildTabs = function () {
    var self = this, wrap = $(".vo55-steps", this.el);
    var h = "";
    for (var i = 0; i < 4; i++) {
      h += '<button type="button" role="tab" id="vo55-gen-tab-' + i + '" aria-controls="vo55-gen-panel" data-step="' + i + '">' +
        '<span class="vo55-sno">0' + (i + 1) + '</span><span class="vo55-stl"></span></button>';
    }
    h += '<button type="button" class="vo55-next">→</button>';
    wrap.innerHTML = h;
    $$("[role=tab]", wrap).forEach(function (b) {
      b.addEventListener("click", function () { self.go(+b.getAttribute("data-step"), true); });
      b.addEventListener("keydown", function (e) {
        var k = e.key, cur = +b.getAttribute("data-step"), nx = null;
        if (k === "ArrowRight" || k === "ArrowDown") nx = (cur + 1) % 4;
        else if (k === "ArrowLeft" || k === "ArrowUp") nx = (cur + 3) % 4;
        else if (k === "Home") nx = 0;
        else if (k === "End") nx = 3;
        if (nx == null) return;
        e.preventDefault(); self.go(nx, true); $("#vo55-gen-tab-" + nx).focus();
      });
    });
    $(".vo55-next", wrap).addEventListener("click", function () { self.go((self.step + 1) % 4, true); });
  };
  gen.labels = function () {
    var self = this;
    $$("[role=tab]", this.el).forEach(function (b, i) {
      var tt = t("c2.fig_step" + (i + 1));
      $(".vo55-stl", b).textContent = tt;
      b.setAttribute("aria-label", "0" + (i + 1) + " — " + tt);
      b.setAttribute("aria-selected", String(i === self.step));
      b.tabIndex = i === self.step ? 0 : -1;
    });
    var nx = (this.step + 1) % 4;
    $(".vo55-next", this.el).setAttribute("aria-label", "→ 0" + (nx + 1) + " — " + t("c2.fig_step" + (nx + 1)));
    $("#vo55-gen-panel").setAttribute("aria-labelledby", "vo55-gen-tab-" + this.step);
  };
  gen.go = function (i, animate) {
    this.step = i;
    this.render(!animate);
  };
  gen.table = function (withTicks) {
    var h = '<div class="vo55-map-wrap"><table class="vo55-map"><thead><tr><th scope="col">' + esc(t("c2.fig_module")) + '</th><th scope="col">' + esc(t("c2.fig_stacks")) + "</th>" + (withTicks ? '<th class="vo55-tickcell" aria-hidden="true"></th>' : "") + "</tr></thead><tbody>";
    ROWS.forEach(function (row, ri) {
      h += '<tr style="--r:' + ri + '"><th scope="row">' + row[0] + "/</th><td>" + row[1].map(function (s, ci) {
        return '<span class="vo55-chip' + (s === "Security" ? " vo55-chip--sec" : "") + '" style="--c:' + ci + '">' + s + "</span>";
      }).join("") + "</td>" + (withTicks ? '<td class="vo55-tickcell"><svg viewBox="0 0 26 22" aria-hidden="true">' + D(tick(3, 12, 20, rand(60 + ri)), "vo55-ink-a", ' style="--del:' + (ri * .15 + .2) + 's;--dur:.35s"') + "</svg></td>" : "") + "</tr>";
    });
    return h + "</tbody></table>";
  };
  gen.stage = function () {
    var r = rand(77 + this.step), s;
    if (this.step === 0) {
      s = '<svg viewBox="0 0 640 236" role="img" aria-label="portal/ · api/ · data/">';
      ["portal", "api", "data"].forEach(function (name, k) {
        var x = 40 + k * 200, y = 28, w = 160, h = 124;
        s += P_(poly([[x, y + 16], [x, y], [x + 54, y], [x + 64, y + 16], [x + w, y + 16], [x + w, y + h], [x, y + h], [x, y + 16]], r, .8), "vo55-ink", ' style="fill:var(--card)"');
        s += '<g class="vo55-folder-files">';
        for (var j = 0; j < 5; j++) {
          var lx = x + 18, len = 50 + ((j * 37 + k * 23) % 70), yy = y + 38 + j * 16;
          var frac = (lx + len / 2 - 20) / 600;
          s += P_(line(lx, yy, lx + len, yy, r, .5), "", ' style="--hd:' + f(frac * 3.2) + 's;fill:none;stroke-linecap:round;stroke-width:1.4"');
        }
        s += "</g>";
        s += '<text class="vo55-folder-lbl" x="' + (x + w / 2) + '" y="' + (y + h + 34) + '" text-anchor="middle">' + name + "/</text>";
      });
      s += '<g class="vo55-scan"><rect x="8" y="14" width="12" height="150"/><line x1="20" y1="10" x2="20" y2="168"/></g></svg>';
      return s;
    }
    if (this.step === 1) return this.table(false) + "</div>";
    if (this.step === 2) {
      return this.table(true) + '<span class="vo55-stamp vo55-confirm-stamp">' + esc(t("c2.fig_confirm")) + "</span></div>";
    }
    var parts = tl("c2.fig_parts"), rr = rand(5);
    var li = parts.map(function (p, i) {
      var fx = Math.round((rr() - .5) * 360), fy = Math.round(-120 - rr() * 140), fr = Math.round((rr() - .5) * 40);
      return '<li style="--i:' + i + ";--fx:" + fx + "px;--fy:" + fy + "px;--fr:" + fr + 'deg"><span class="vo55-pno">0' + (i + 1) + "</span>" + esc(p) + "</li>";
    }).join("");
    var br = rand(8);
    return '<div class="vo55-box"><svg class="vo55-box-body" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">' +
      P_(rect(2, 2, 396, 296, br, 1.2), "vo55-ink", ' vector-effect="non-scaling-stroke" style="stroke-width:2"') +
      P_(line(2, 8, 398, 8, br, .8), "vo55-ink-m", ' vector-effect="non-scaling-stroke"') + "</svg>" +
      '<svg class="vo55-box-lid" viewBox="0 0 400 30" preserveAspectRatio="none" aria-hidden="true">' +
      P_(poly([[2, 28], [14, 2], [386, 2], [398, 28]], br, .8), "vo55-ink", ' vector-effect="non-scaling-stroke" style="stroke-width:2;fill:var(--card)"') + "</svg>" +
      '<ol class="vo55-parts">' + li + "</ol>" +
      '<span class="vo55-stamp vo55-box-label">' + parts.length + "/" + parts.length + " ✓</span></div>";
  };
  gen.render = function (still) {
    var self = this, stage = $(".vo55-stage", this.el);
    if (!$(".vo55-next", this.el)) this.buildTabs();
    this.labels();
    $(".vo55-step-title", this.el).innerHTML = '<span class="vo55-sno">0' + (this.step + 1) + "</span>" + esc(t("c2.fig_step" + (this.step + 1)));
    var paint = function () {
      stage.innerHTML = self.stage();
      stage.classList.add("vo55-anim");
      var svgD = $$(".d", stage);
      if (svgD.length) {
        var host = stage.firstElementChild;
        requestAnimationFrame(function () { requestAnimationFrame(function () { stage.classList.add("is-on"); }); });
        void host;
      }
    };
    stage.classList.remove("is-on");
    if (still) quiet(stage, function () { paint(); stage.classList.add("is-on"); });
    else paint();
  };

  /* ========================================================= fig 4 context */
  var CHIPS = [["Angular", "React", "Vue", "Quasar", "Tailwind"], ["Capacitor", "Ionic"], ["GraphQL client", "GraphQL server", "Hasura", "SQL"],
    ["Node", "Spring", "Kafka", "RabbitMQ", "NATS"], ["SAP Fiori", "Dagster"], ["Security"]];
  var ctx = register({ el: $("#vo55-ctx"), area: 0, built: false });
  ctx.render = function () {
    var self = this, areas = tl("c3.fig_areas"), items = tl("c3.fig_context");
    var card = '<div class="vo55-card"><span class="vo55-tape" aria-hidden="true"></span><ul>' + items.map(function (it, i) {
      return '<li style="--i:' + i + '"><svg viewBox="0 0 18 18" aria-hidden="true">' + D(tick(2, 9, 14, rand(90 + i)), "vo55-ink-a", ' style="stroke-width:2"') + "</svg><span>" + esc(it) + "</span></li>";
    }).join("") + "</ul></div>";
    var arrow = '<svg class="vo55-ctx-arrow" viewBox="0 0 44 40" aria-hidden="true">' + D(smooth([[2, 22], [16, 16], [30, 22], [40, 18]]), "vo55-ink") + P_(poly([[33, 11], [41, 18], [32, 24]], rand(3), .4), "vo55-ink") + "</svg>";
    var tabs = '<div class="vo55-tabs" role="tablist" aria-label="' + esc(t("c3.fig")) + '">' + areas.map(function (a, i) {
      return '<button type="button" role="tab" id="vo55-area-' + i + '" aria-controls="vo55-area-panel" aria-selected="' + (i === self.area) + '" tabindex="' + (i === self.area ? 0 : -1) + '" data-i="' + i + '">' +
        esc(a) + "<sup>" + CHIPS[i].length + "</sup></button>";
    }).join("") + "</div>";
    this.el.innerHTML = card + arrow + '<div class="vo55-areas">' + tabs + '<div class="vo55-area-panel" role="tabpanel" id="vo55-area-panel" tabindex="0"></div></div>';
    this.el.classList.add("vo55-anim");
    $$("[role=tab]", this.el).forEach(function (b) {
      b.addEventListener("click", function () { self.pick(+b.getAttribute("data-i"), true); });
      b.addEventListener("keydown", function (e) {
        var cur = +b.getAttribute("data-i"), n = CHIPS.length, nx = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") nx = (cur + 1) % n;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") nx = (cur + n - 1) % n;
        else if (e.key === "Home") nx = 0;
        else if (e.key === "End") nx = n - 1;
        if (nx == null) return;
        e.preventDefault(); self.pick(nx, true); $("#vo55-area-" + nx).focus();
      });
    });
    this.panel(false);
  };
  ctx.pick = function (i) {
    this.area = i;
    $$("[role=tab]", this.el).forEach(function (b, k) { b.setAttribute("aria-selected", String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    this.panel(true);
  };
  ctx.panel = function (animate) {
    var i = this.area, panel = $("#vo55-area-panel"), self = this;
    panel.setAttribute("aria-labelledby", "vo55-area-" + i);
    var doc = function (k) {
      var r = rand(200 + k);
      return '<svg viewBox="0 0 14 17" aria-hidden="true">' + P_(poly([[1, 1], [9, 1], [13, 5], [13, 16], [1, 16], [1, 1]], r, .4), "", ' style="fill:none;stroke:currentColor;stroke-width:1.2"') +
        P_(line(4, 7, 10, 7, r, .2) + " " + line(4, 10, 10, 10, r, .2) + " " + line(4, 13, 8, 13, r, .2), "", ' style="fill:none;stroke:currentColor;stroke-width:1"') + "</svg>";
    };
    var chips = CHIPS[i].map(function (c, k) {
      return '<li class="vo55-check' + (c === "Security" ? " vo55-check--sec" : "") + '" style="--i:' + k + '">' + doc(k) + esc(c) + "</li>";
    });
    if (i !== CHIPS.length - 1) chips.push('<li class="vo55-check vo55-check--sec vo55-check--pin" style="--i:' + CHIPS[i].length + '">+ ' + doc(9) + "Security</li>");
    // tally: 19 strokes grouped by area
    var x = 4, tk = "", r = rand(500);
    CHIPS.forEach(function (grp, gi) {
      grp.forEach(function () {
        tk += '<path class="vo55-tk' + (gi === i ? " is-cur" : "") + '" d="' + line(x, 3, x + (r() - .5) * 2, 23, r, .5) + '"/>';
        x += 8;
      });
      x += 10;
    });
    var total = CHIPS.reduce(function (a, g) { return a + g.length; }, 0);
    var html = '<ul class="vo55-checks">' + chips.join("") + "</ul>" +
      '<div class="vo55-tally"><svg viewBox="0 0 ' + x + ' 26" aria-hidden="true">' + tk + "</svg>" +
      '<span class="vo55-tally-n"><b>' + CHIPS[i].length + "</b> / " + total + "</span></div>";
    if (animate) { panel.innerHTML = html; }
    else quiet(panel, function () { panel.innerHTML = html; });
    void self;
  };

  /* ===================================================== fig 5 review run */
  var LANES = ["portal", "admin", "shared", "identity", "files", "integration", "jobs", "messaging", "data"];
  var SAMPLE = { portal: [0, 1, 15, 26], admin: [1, 0, 14, 27], shared: [1, 0, 3, 24], identity: [3, 5, 24, 22], files: [1, 1, 14, 21],
    integration: [1, 2, 16, 17], jobs: [1, 0, 5, 17], messaging: [0, 1, 12, 25], data: [1, 7, 11, 22] };
  var FILES = {
    portal: ["Cart.vue", "App.vue", "api.ts", "i18n.ts"], admin: ["Users.vue", "roles.ts", "Grid.vue"], shared: ["http.ts", "date.ts", "store.ts"],
    identity: ["auth.ts", "token.ts", "acl.ts", "login.ts", "mfa.ts"], files: ["upload.ts", "s3.ts", "mime.ts"], integration: ["sync.ts", "map.ts", "retry.ts"],
    jobs: ["cron.ts", "queue.ts", "worker.ts"], messaging: ["bus.ts", "topic.ts", "ack.ts"], data: ["ord.sql", "view.sql", "idx.sql", "dim.sql"]
  };
  var WIDE = "identity";
  function buildRun() {
    var r = rand(4242), cols = [], findings = [];
    LANES.forEach(function (l) {
      if (l === WIDE) for (var h = 0; h < 3; h++) cols.push({ lane: l, helper: h });
      else cols.push({ lane: l, helper: -1 });
    });
    var occ = {};
    function place(ci, pref) {
      for (var k = 0; k < 6; k++) {
        var b = (pref + k) % 6, key = ci + ":" + b;
        if ((occ[key] || 0) < 3) { occ[key] = (occ[key] || 0) + 1; return [b, occ[key] - 1]; }
      }
      return null;
    }
    LANES.forEach(function (l) {
      var s = SAMPLE[l], colIdx = [];
      cols.forEach(function (c, i) { if (c.lane === l) colIdx.push(i); });
      var list = [], g = l === WIDE ? 6 : 3, i;
      for (i = 0; i < s[0]; i++) list.push("b");
      for (i = 0; i < s[1]; i++) list.push("c");
      for (i = 0; i < g; i++) list.push(r() < .4 ? "M" : "m");
      var rot = 0, fi = 0;
      list.forEach(function (sev) {
        var ci = colIdx[rot++ % colIdx.length], pref;
        if (sev === "b") pref = r() < .6 ? 2 : 3;
        else if (sev === "c") pref = [2, 2, 3, 0, 4, 1][Math.floor(r() * 6)];
        else pref = Math.floor(r() * 6);
        var pos = place(ci, pref);
        if (!pos) return;
        var file = FILES[l][fi++ % FILES[l].length];
        findings.push({ col: ci, lane: l, band: pos[0], slot: pos[1], sev: sev, tag: file + ":" + (12 + Math.floor(r() * 460)), o: pos[0] * 3 + pos[1] + r() * 2.2 });
      });
    });
    // the ticket finding: identity, helper 1, critical, D3, auth.ts:142
    var tk = findings.filter(function (x) { return x.lane === WIDE && x.sev === "c"; })[0];
    if (tk) tk.tag = "auth.ts:142";
    // exactly one unverified: the third critical in the data lane
    var dc = findings.filter(function (x) { return x.lane === "data" && x.sev === "c"; });
    (dc[2] || dc[0]).unv = true;
    findings.sort(function (a, b) { return a.o - b.o; });
    return { cols: cols, findings: findings };
  }
  var RUN = buildRun();

  var run = register({ el: $("#vo55-run"), p: 0 });
  run.render = function () {
    var self = this, W = 680, H = 600, left = 36, cw = (W - left - 6) / RUN.cols.length, r = rand(31);
    var colX = function (i) { return left + (i + .5) * cw; };
    var oy = 30, ny = 104, hy = 170, b0 = 198, bh = 62;
    var s = "";
    // bands
    for (var b = 0; b < 6; b++) {
      var by = b0 + b * bh;
      s += '<line class="vo55-band" x1="4" x2="' + (W - 2) + '" y1="' + by + '" y2="' + by + '"/>';
      s += '<text class="vo55-band-t" x="4" y="' + (by + 18) + '">D' + (b + 1) + "</text>";
    }
    // lanes
    var laneX = {};
    LANES.forEach(function (l) {
      var idx = [];
      RUN.cols.forEach(function (c, i) { if (c.lane === l) idx.push(i); });
      laneX[l] = (colX(idx[0]) + colX(idx[idx.length - 1])) / 2;
    });
    var fan = "", lanes = "", nodes = "", helpers = "";
    LANES.forEach(function (l, i) {
      var x = laneX[l];
      fan += D(line(x, 70, x, ny - 5, r, .5), "vo55-fan");
      nodes += P_(oval(x, ny, 5, 5, r, 1), "vo55-node");
      nodes += '<text class="vo55-lane-t" x="' + f(x) + '" y="' + (ny + (i % 2 ? 34 : 21)) + '" text-anchor="middle">' + l + "</text>";
    });
    fan = D(line(W / 2, oy + 17, W / 2, 70, r, .4), "vo55-fan") +
      D(line(laneX[LANES[0]], 70, laneX[LANES[LANES.length - 1]], 70, r, 1.2), "vo55-fan") + fan;
    RUN.cols.forEach(function (c, i) {
      var x = colX(i), y0 = c.helper >= 0 ? hy + 5 : ny + 6;
      if (c.helper >= 0) {
        helpers += D(smooth([[laneX[c.lane], ny + 40], [laneX[c.lane], ny + 50], [x, hy - 16], [x, hy - 5]]), "vo55-fan");
        helpers += P_(oval(x, hy, 4, 4, r, 1), "vo55-node vo55-node--h");
      }
      lanes += D(line(x, y0, x, b0 + 6 * bh, r, .8), "vo55-lane");
    });
    helpers += D(line(laneX[WIDE], ny + 6, laneX[WIDE], ny + 40, r, .3), "vo55-fan");
    var hx0 = colX(RUN.cols.findIndex(function (c) { return c.helper === 0; }));
    var hl = t("c4.fig_helper");
    helpers += '<rect class="vo55-bgp" x="' + f(laneX[WIDE] - hl.length * 3.1 - 5) + '" y="' + (hy + 8) + '" width="' + f(hl.length * 6.2 + 10) + '" height="14" rx="2"/>' +
      '<text class="vo55-help-t" x="' + f(laneX[WIDE]) + '" y="' + (hy + 18.5) + '" text-anchor="middle">3 × ' + esc(hl) + "</text>";
    void hx0;
    // orchestrator
    var nar = this.mode === "n", ofs = nar ? 21 : 13;
    var ol = t("c4.fig_orchestrator"), ow = Math.max(130, ol.length * ofs * .62 + 30), oh = nar ? 42 : 34;
    var orch = P_(rect(W / 2 - ow / 2, oy + 17 - oh, ow, oh, r, .9), "vo55-orch") +
      '<text class="vo55-orch-t" x="' + W / 2 + '" y="' + (oy + 17 - oh / 2 + ofs * .36) + '" text-anchor="middle" style="font-size:' + ofs + 'px">' + esc(ol) + "</text>";
    // findings
    var dots = "";
    RUN.findings.forEach(function (fd, i) {
      var x = colX(fd.col) - cw / 2 + 9, y = b0 + fd.band * bh + 16 + fd.slot * 16;
      var acc = fd.sev === "b" || fd.sev === "c";
      fd.x = x; fd.y = y;
      dots += '<g class="vo55-fd' + (acc ? " is-acc" : "") + '" data-i="' + i + '">' +
        '<circle class="vo55-dot-c" cx="' + f(x) + '" cy="' + f(y) + '" r="' + (acc ? 4.2 : 3) + '"/>' +
        (acc ? '<path class="vo55-vt" d="M' + f(x - 2.2) + " " + f(y + .2) + " L" + f(x - .5) + " " + f(y + 2) + " L" + f(x + 2.6) + " " + f(y - 2) + '"/>' +
          '<circle class="vo55-ring" cx="' + f(x) + '" cy="' + f(y) + '" r="5.6"/>' +
          '<path class="vo55-vx" d="M' + f(x - 2.4) + " " + f(y - 2.4) + " L" + f(x + 2.4) + " " + f(y + 2.4) + " M" + f(x + 2.4) + " " + f(y - 2.4) + " L" + f(x - 2.4) + " " + f(y + 2.4) + '"/>' : "") +
        '<text x="' + f(x + 6.5) + '" y="' + f(y + 2.4) + '">' + fd.tag + "</text></g>";
    });
    // unverified callout
    var u = RUN.findings.filter(function (x) { return x.unv; })[0], uv = t("c4.fig_unverified"), uw = uv.length * 6.7 + 30;
    var ux = Math.min(u.x - 10, W - uw - 4), uy = H - 10;
    var callout = '<g class="vo55-unv"><rect class="vo55-bgp" x="' + f(ux - 4) + '" y="' + (uy - 13) + '" width="' + f(uw + 8) + '" height="18" rx="2"/>' +
      P_(smooth([[u.x, u.y + 7], [u.x + 6, (u.y + uy) / 2], [ux + 12, uy - 14]]), "vo55-ink-a", ' style="stroke-dasharray:3 3;stroke-width:1.3"') +
      '<text x="' + f(ux) + '" y="' + uy + '">✗ ' + esc(uv) + "</text></g>";
    var aria = t("c4.fig") + ": " + t("c4.fig_orchestrator") + " → 9 × " + t("c4.fig_reviewer") + ", 3 × " + t("c4.fig_helper");
    this.el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(aria) + '">' +
      '<g class="vo55-lanes">' + lanes + "</g>" + '<g class="vo55-fans">' + fan + "</g>" + '<g class="vo55-helpers vo55-fade">' + helpers + "</g>" +
      '<g class="vo55-nodes vo55-fade">' + nodes + "</g>" + orch + dots + callout + "</svg>";
    this.el.classList.toggle("is-narrow", this.mode === "n");
    this.parts = {
      fans: $$(".vo55-fans .d", this.el), lanes: $$(".vo55-lanes .d", this.el), helpersD: $$(".vo55-helpers .d", this.el),
      helpers: $(".vo55-helpers", this.el), nodes: $(".vo55-nodes", this.el), dots: $$(".vo55-fd", this.el), unv: $(".vo55-unv", this.el)
    };
    this.legend();
    this.last = -1;
    this.update(this.p);
  };
  run.legend = function () {
    var dot = function (inner) { return '<svg viewBox="-7 -7 14 14" aria-hidden="true">' + inner + "</svg>"; };
    var nV = RUN.findings.filter(function (x) { return (x.sev === "b" || x.sev === "c") && !x.unv; }).length;
    $("#vo55-run-legend").innerHTML =
      "<li>" + dot('<circle r="4.5" style="fill:var(--card);stroke:var(--fg);stroke-width:1.6"/>') + "9 × " + esc(t("c4.fig_reviewer")) + "</li>" +
      "<li>" + dot('<circle r="4" style="fill:var(--card);stroke:var(--fg-muted);stroke-width:1.4;stroke-dasharray:2 2"/>') + "3 × " + esc(t("c4.fig_helper")) + "</li>" +
      '<li style="color:var(--ink)">' + dot('<circle r="5" style="fill:var(--ink)"/><path d="M-2.4 0 L-.6 2 L2.8 -2.2" style="fill:none;stroke:var(--card);stroke-width:1.5;stroke-linecap:round"/>') + nV + " " + esc(t("c4.fig_verified")) + "</li>" +
      '<li style="color:var(--ink)">' + dot('<circle r="5" style="fill:none;stroke:var(--ink);stroke-width:1.3;stroke-dasharray:2 1.6"/><path d="M-2.4 -2.4 L2.4 2.4 M2.4 -2.4 L-2.4 2.4" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>') + "1 " + esc(t("c4.fig_unverified")) + "</li>";
  };
  run.measure = function () {
    var tr = $("#vo55-run-track").getBoundingClientRect(), vh = window.innerHeight;
    return clamp((vh * .25 - tr.top) / Math.max(1, tr.height - vh * .8), 0, 1);
  };
  run.update = function (p) {
    this.p = p;
    var q = this.parts;
    if (!q) return;
    var fan = ss(p, 0, .1), lane = ss(p, .06, .18), help = ss(p, .1, .2);
    q.fans.forEach(function (e) { e.style.strokeDashoffset = 1 - fan; });
    q.lanes.forEach(function (e) { e.style.strokeDashoffset = 1 - lane; });
    q.helpersD.forEach(function (e) { e.style.strokeDashoffset = 1 - help; });
    q.nodes.classList.toggle("is-vis", p > .04);
    q.helpers.classList.toggle("is-vis", p > .1);
    var N = q.dots.length, shown = 0;
    var acc = RUN.findings.filter(function (x) { return x.sev === "b" || x.sev === "c"; }), ai = 0;
    q.dots.forEach(function (el, i) {
      var fd = RUN.findings[i], vis = p >= .2 + .48 * i / N;
      if (vis) shown = i + 1;
      el.classList.toggle("is-vis", vis);
      if (fd.sev === "b" || fd.sev === "c") {
        var ver = p >= .74 + .2 * ai / acc.length;
        ai++;
        el.classList.toggle("is-ok", ver && !fd.unv);
        el.classList.toggle("is-bad", ver && !!fd.unv);
      }
    });
    var verPhase = p >= .74, allDone = p >= .95;
    q.unv.classList.toggle("is-vis", allDone);
    var key = shown + "|" + $$(".is-ok, .is-bad", this.el).length + (allDone ? "d" : "") + window.OZ.lang;
    if (key === this.last) return;
    this.last = key;
    var log = $("#vo55-run-log"), lines = [];
    if (verPhase) {
      var nOk = 0, nBad = 0;
      ai = 0;
      RUN.findings.forEach(function (fd) {
        if (fd.sev !== "b" && fd.sev !== "c") return;
        if (p >= .74 + .2 * ai / acc.length) { if (fd.unv) nBad++; else nOk++; }
        ai++;
      });
      lines.push('<span class="is-acc">✓ <b>' + nOk + "</b> " + esc(t("c4.fig_verified")) + (nBad ? " · ✗ <b>" + nBad + "</b> " + esc(t("c4.fig_unverified")) : "") + "</span>");
      lines.push("<span>" + shown + " · file:line ✓</span>");
    } else {
      for (var j = Math.max(0, shown - 3); j < shown; j++) {
        var fd = RUN.findings[j], a = fd.sev === "b" || fd.sev === "c";
        lines.push('<span class="' + (a ? "is-acc" : "") + '">' + fd.lane + " → " + fd.tag + " · D" + (fd.band + 1) + "</span>");
      }
      if (!lines.length) lines.push("<span>" + esc(t("c4.fig_orchestrator")) + " → 9 × " + esc(t("c4.fig_reviewer")) + "</span>");
    }
    log.innerHTML = lines.join("");
  };

  /* ========================================================= fig 6 scoring */
  var WEIGHTS = [25, 25, 20, 15, 15, 0];
  var score = register({ el: $("#vo55-score"), q: [true, true, false] });
  score.render = function () {
    var self = this;
    quiet(this.el, function () {
      $("#vo55-weights").innerHTML = WEIGHTS.map(function (w, i) {
        var r = rand(700 + i), L = 228 * w / 25, bar;
        if (w > 0) bar = P_(line(4, 9, 236, 9, r, 0), "vo55-trk") + D(line(5, 9, 5 + L, 9, r, 1.1), "vo55-b1") + D(line(7, 10.5, 3 + L, 7.5, r, 1), "vo55-b2");
        else bar = P_(line(5, 9, 236, 9, r, .8), "vo55-b0");
        return '<li class="vo55-wrow' + (i === 2 ? " vo55-wrow--sec" : "") + (w === 0 ? " vo55-wrow--rep" : "") + '" style="--i:' + i + '">' +
          '<span class="vo55-wlab"><b>D' + (i + 1) + "</b>" + esc(t("c5.fig_d" + (i + 1))) + "</span>" +
          '<svg class="vo55-wbar" viewBox="0 0 240 18" preserveAspectRatio="none" aria-hidden="true">' + bar.replace(/<path /g, '<path vector-effect="non-scaling-stroke" ') + "</svg>" +
          '<span class="vo55-wpct">' + pct(w) + "</span></li>";
      }).join("");
      var qs = [1, 2, 3].map(function (n, i) {
        return '<li class="vo55-q"><span class="vo55-q-no">' + "0" + n + '</span><span class="vo55-q-t" id="vo55-q' + n + '">' + esc(t("c5.fig_q" + n)) + "</span>" +
          '<button type="button" class="vo55-yn" role="switch" data-q="' + i + '" aria-labelledby="vo55-q' + n + '" aria-checked="' + self.q[i] + '">' +
          '<span data-v="1">✓<svg viewBox="0 0 44 38" aria-hidden="true">' + D(oval(22, 19, 18, 15, rand(800 + i)), "vo55-ink-a") + "</svg></span>" +
          '<span data-v="0">✗<svg viewBox="0 0 44 38" aria-hidden="true">' + D(oval(22, 19, 18, 15, rand(820 + i)), "vo55-ink") + "</svg></span>" +
          "</button></li>";
      }).join("");
      $("#vo55-bt").innerHTML = '<ol class="vo55-qs">' + qs + "</ol>" +
        '<div class="vo55-verdict"><span class="vo55-stamp" id="vo55-verdict" aria-live="polite"></span>' +
        '<div class="vo55-cap"><svg viewBox="0 0 220 56" preserveAspectRatio="xMinYMid meet" aria-hidden="true">' +
        P_(line(4, 34, 214, 34, rand(3), .6), "vo55-ink") +
        '<line x1="70" x2="70" y1="29" y2="39" class="vo55-ink-m"/><text class="vo55-capmark" x="70" y="52" text-anchor="middle">' + dec(1.5) + "</text>" +
        '<line x1="114" x2="114" y1="29" y2="39" class="vo55-ink-m"/><text class="vo55-capmark" x="114" y="52" text-anchor="middle">' + dec(2.5) + "</text>" +
        '<rect class="vo55-capfill" x="4" y="26" height="16" width="66" rx="2"/>' +
        '<g class="vo55-capg"><line class="vo55-capline" x1="0" x2="0" y1="20" y2="46"/><text class="vo55-capt" x="0" y="14" text-anchor="middle"></text></g>' +
        "</svg></div></div>";
      $$(".vo55-yn", self.el).forEach(function (b) {
        b.addEventListener("click", function () {
          var i = +b.getAttribute("data-q");
          self.q[i] = !self.q[i];
          self.verdict(true);
        });
      });
      self.verdict(false);
    });
  };
  score.verdict = function (thump) {
    var self = this, yes = this.q.filter(Boolean).length, isB = yes === 3;
    $$(".vo55-yn", this.el).forEach(function (b, i) {
      b.setAttribute("aria-checked", String(self.q[i]));
      $$("span", b).forEach(function (sp) { sp.classList.toggle("is-cur", (sp.getAttribute("data-v") === "1") === self.q[i]); });
    });
    var st = $("#vo55-verdict");
    st.textContent = isB ? t("c5.fig_blocker") : t("c5.fig_not_blocker");
    st.className = "vo55-stamp " + (isB ? "is-blocker" : "is-not");
    if (thump && !reduced()) { void st.offsetWidth; st.classList.add("is-thump"); }
    // cap: blocker → 1.5 · one level down (two of three) → 2.5 · otherwise uncapped
    var capX = isB ? 70 : yes === 2 ? 114 : 214;
    var fill = $(".vo55-capfill", this.el), g = $(".vo55-capg", this.el);
    fill.setAttribute("width", capX - 4);
    fill.style.width = (capX - 4) + "px";
    g.style.transform = "translateX(" + capX + "px)";
    g.setAttribute("transform", "translate(" + capX + " 0)");
    $(".vo55-capt", this.el).textContent = capX === 214 ? "→" : "≤ " + dec(isB ? 1.5 : 2.5);
  };

  /* ===================================================== fig 7 heat map */
  var result = register({ el: $("#vo55-result"), hot: [3, 1] });
  result.render = function () {
    var self = this, sev = tl("c6.fig_severities"), colMax = [0, 0, 0, 0], sum = [0, 0, 0, 0];
    LANES.forEach(function (l) { SAMPLE[l].forEach(function (v, c) { colMax[c] = Math.max(colMax[c], v); sum[c] += v; }); });
    var h = '<div class="vo55-heatwrap"><table class="vo55-heat"><caption class="vo55-sr">' + esc(t("c6.fig")) + "</caption><thead><tr><td></td>" +
      sev.map(function (s, c) { return '<th scope="col"' + (c < 2 ? ' class="is-acc"' : "") + ">" + esc(s) + "</th>"; }).join("") + "</tr></thead><tbody>";
    LANES.forEach(function (l, ri) {
      h += '<tr><th scope="row">' + l + "</th>";
      SAMPLE[l].forEach(function (v, c) {
        var r = rand(1000 + ri * 7 + c), k = v ? Math.max(1, Math.round(v / colMax[c] * 11)) : 0, lines = "";
        for (var j = 0; j < k; j++) {
          var x = -20 + (j + .5) * (100 / (k + .2)) + (r() - .5) * 3;
          lines += line(x, 38, x + 22 + (r() - .5) * 3, -4, r, .8) + " ";
        }
        var body = k ? '<path class="vo55-h" d="' + lines + '"/>' : '<circle class="vo55-z" cx="40" cy="17" r="1.8"/>';
        var mark = ri === self.hot[0] && c === self.hot[1] ? '<svg class="vo55-mark" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">' +
          D(oval(50, 30, 46, 25, rand(77), 1.15), "vo55-ink-a", ' vector-effect="non-scaling-stroke" style="stroke-width:2.2"') + "</svg>" : "";
        h += "<td>" + mark + '<button type="button" class="vo55-cell' + (c < 2 ? " is-acc" : "") + '" data-r="' + ri + '" data-c="' + c + '" aria-label="' + esc(l + " · " + sev[c] + ": " + v) + '">' +
          '<svg viewBox="0 0 80 34" preserveAspectRatio="none" aria-hidden="true">' + body + '</svg><span class="vo55-n" aria-hidden="true">' + v + "</span></button></td>";
      });
      h += "</tr>";
    });
    h += '</tbody><tfoot><tr><th scope="row">Σ</th>' + sum.map(function (v, c) { return "<td" + (c < 2 ? ' class="is-acc"' : "") + ">" + v + "</td>"; }).join("") + "</tr></tfoot></table>";
    h += '<p class="vo55-readout" id="vo55-readout" aria-live="polite"></p></div>';
    // ticket
    var tk = t("c6.fig_ticket"), m = tk.match(/^((?:\[[^\]]+\])+)\s*(.+?)\s*·\s*(\S+)\s*$/), ticket;
    if (m) {
      ticket = '<div class="vo55-ticket-tags">' + m[1].match(/\[[^\]]+\]/g).map(function (x) { return '<span class="vo55-stamp">' + esc(x.slice(1, -1)) + "</span>"; }).join("") + "</div>" +
        '<p class="vo55-ticket-title">' + esc(m[2]) + '</p><p class="vo55-ticket-file">↳ ' + esc(m[3]) + "</p>";
    } else ticket = '<p class="vo55-ticket-raw">' + esc(tk) + "</p>";
    h += '<div class="vo55-side"><div class="vo55-ticket"><span class="vo55-tape" aria-hidden="true"></span>' + ticket + "</div>" +
      '<div class="vo55-tile"><p class="vo55-tile-n">' + esc(t("stat1")) + '</p><p class="vo55-tile-l">' + esc(t("stat1_label")) + "</p></div></div>";
    this.el.innerHTML = h;
    this.el.classList.add("vo55-anim");
    if (this.inView) this.el.classList.add("is-on");
    var cells = $$(".vo55-cell", this.el);
    cells.forEach(function (b) {
      var show = function () { self.read(+b.getAttribute("data-r"), +b.getAttribute("data-c")); };
      b.addEventListener("mouseenter", show);
      b.addEventListener("focus", show);
      b.addEventListener("click", show);
    });
    this.read(this.hot[0], this.hot[1], true);
  };
  result.read = function (ri, c) {
    var sev = tl("c6.fig_severities");
    $$(".vo55-cell", this.el).forEach(function (b) { b.classList.toggle("is-hot", +b.getAttribute("data-r") === ri && +b.getAttribute("data-c") === c); });
    $("#vo55-readout").innerHTML = esc(LANES[ri]) + " × " + esc(sev[c]) + " = <b>" + SAMPLE[LANES[ri]][c] + "</b>";
  };

  /* ================================================= scroll + view wiring */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var rm = reduced();
      noise.update(rm ? 1 : noise.measure());
      run.update(rm ? 1 : run.measure());
    });
  }

  function observe() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add("is-in");
        if (el === hero.el) hero.play();
        if (el === ctx.el) { el.classList.add("is-on"); }
        if (el === score.el) { el.classList.add("vo55-anim", "is-on"); }
        if (el === result.el) { result.inView = true; el.classList.add("is-on"); }
        if (el.id === "vo55-lessons") { el.classList.add("vo55-anim", "is-on"); }
        io.unobserve(el);
      });
    }, { threshold: .2, rootMargin: "0px 0px -8% 0px" });
    $$(".vo55-ch, .vo55-hero").forEach(function (s) { io.observe(s); });
    [hero.el, ctx.el, score.el, result.el, $("#vo55-lessons")].forEach(function (el) { io.observe(el); });
  }

  function renderAll(first) {
    inkURLs();
    renderCopy();
    figs.forEach(function (fg) { fg.render(!first); });
    if ($("#vo55-lessons").classList.contains("is-on")) quiet($("#vo55-lessons"), function () {});
    onScroll();
  }

  window.OZ.ready.then(function () {
    renderAll(true);
    observe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("oz:langchange", function () { renderAll(false); });
    document.addEventListener("oz:accentchange", inkURLs);
    document.addEventListener("oz:themechange", inkURLs);
    if (RMQ.addEventListener) RMQ.addEventListener("change", onScroll);
    if (reduced()) { hero.play(); }
  });
})();
