/* Management Insights Agent — /projects/executive-kpi-agent/
   Vanilla JS. Every figure is inline SVG, drawn by hand-wobbled paths. */
(function () {
  "use strict";

  var P = "project.executive-kpi-agent.";
  var MODEL_NAME = "Claude Opus 5.5";
  var NS = "http://www.w3.org/2000/svg";
  var RMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  function reduced() { return RMQ.matches; }

  function t(k) { return window.OZ.t(k); }
  function tp(k) { return window.OZ.t(P + k); }
  function list(k) { return tp(k).split("|").map(function (s) { return s.trim(); }); }

  /* ------------------------------------------------------------------ helpers */
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function f(n) { return Math.round(n * 10) / 10; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, k) { return a + (b - a) * k; }

  // seeded random so wobble is stable across re-renders
  function R(seed) {
    var s = (seed * 9301 + 49297) % 233280 || 1;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }
  function jit(r, a) { return (r() * 2 - 1) * a; }

  // text measuring (canvas, same fonts as CSS)
  var ctx = document.createElement("canvas").getContext("2d");
  function mw(s, size, mono, weight) {
    ctx.font = (weight || 400) + " " + size + "px " + (mono ? '"Geist Mono", ui-monospace, monospace' : 'Geist, ui-sans-serif, system-ui, sans-serif');
    return ctx.measureText(s).width;
  }
  function wrap(s, max, size, mono, weight) {
    var words = s.split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) {
      var test = cur ? cur + " " + w : w;
      if (cur && mw(test, size, mono, weight) > max) { lines.push(cur); cur = w; } else cur = test;
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function widest(lines, size, mono, weight) {
    return lines.reduce(function (m, l) { return Math.max(m, mw(l, size, mono, weight)); }, 0);
  }

  // rough strokes
  function rline(x1, y1, x2, y2, r, amp) {
    amp = amp == null ? 1 : amp;
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    var nx = -dy / L, ny = dx / L, o = jit(r, (Math.min(2.6, L * 0.012) + 0.3) * amp);
    var mx = (x1 + x2) / 2 + nx * o, my = (y1 + y2) / 2 + ny * o;
    return "M" + f(x1 + jit(r, .5 * amp)) + " " + f(y1 + jit(r, .5 * amp)) + " Q" + f(mx) + " " + f(my) + " " + f(x2 + jit(r, .5 * amp)) + " " + f(y2 + jit(r, .5 * amp));
  }
  function rrect(x, y, w, h, r, amp) {
    var o = 2;
    return [rline(x - o, y, x + w + o * .5, y, r, amp), rline(x + w, y - o * .5, x + w, y + h + o, r, amp),
      rline(x + w + o * .5, y + h, x - o, y + h, r, amp), rline(x, y + h + o * .5, x, y - o, r, amp)].join(" ");
  }
  function smooth(pts, closed) {
    var d = "M" + f(pts[0][0]) + " " + f(pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || (closed ? pts[pts.length - 2] : pts[i]), p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += " C" + f(p1[0] + (p2[0] - p0[0]) / 6) + " " + f(p1[1] + (p2[1] - p0[1]) / 6) + " " +
        f(p2[0] - (p3[0] - p1[0]) / 6) + " " + f(p2[1] - (p3[1] - p1[1]) / 6) + " " + f(p2[0]) + " " + f(p2[1]);
    }
    return d;
  }
  // hand-drawn oval that overshoots its start
  function loop(cx, cy, rx, ry, r, turn) {
    turn = turn || 1.12;
    var n = 16, pts = [], a0 = -2.2 + jit(r, .3);
    for (var i = 0; i <= n; i++) {
      var a = a0 + Math.PI * 2 * turn * i / n, k = 1 + jit(r, .045) + (i / n) * .07;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return smooth(pts);
  }
  function head(x, y, ang, s) {
    s = s || 8;
    var a1 = ang + Math.PI * .82, a2 = ang - Math.PI * .82;
    return "M" + f(x + Math.cos(a1) * s) + " " + f(y + Math.sin(a1) * s) + " L" + f(x) + " " + f(y) + " L" + f(x + Math.cos(a2) * s) + " " + f(y + Math.sin(a2) * s);
  }

  // drawing primitives (all return the element)
  function ink(parent, d, cls, delay, dur, key) {
    return el("path", { d: d, "class": "s vo55-draw " + (cls || ""), pathLength: 1,
      style: "--d:" + (delay || 0) + "s;--t:" + (dur || .7) + "s", "data-k": key }, parent);
  }
  function fade(node, delay, key, cls) {
    node.classList.add(cls || "vo55-fade");
    node.style.setProperty("--d", (delay || 0) + "s");
    if (key) node.setAttribute("data-k", key);
    return node;
  }
  function text(parent, x, y, s, size, cls, attrs) {
    var e = el("text", Object.assign({ x: f(x), y: f(y), "font-size": size, "class": cls || "" }, attrs || {}), parent);
    e.textContent = s;
    return e;
  }
  function lines(parent, x, y, arr, size, lh, cls, anchor, weight) {
    var g = el("g", null, parent);
    arr.forEach(function (l, i) {
      text(g, x, y + i * lh, l, size, cls, { "text-anchor": anchor || "start", "font-weight": weight || null });
    });
    return g;
  }
  function mkSvg(W, H, label) {
    var s = el("svg", { viewBox: "0 0 " + W + " " + H, "class": "vo55-svg", role: "img", "aria-label": label || null });
    s.setAttribute("preserveAspectRatio", "xMidYMid meet");
    return s;
  }
  function raf2(fn) { requestAnimationFrame(function () { requestAnimationFrame(fn); }); }

  /* ------------------------------------------------------------------ figure engine */
  var FIGS = [];
  function Fig(id, threshold, render, opts) {
    var fig = document.getElementById(id);
    var F = { id: id, fig: fig, stage: fig.querySelector(".vo55-stage"), threshold: threshold, render: render,
      seen: false, mode: null, svg: null, keep: null, opts: opts || {} };
    F.computeMode = function () { return threshold && F.stage.clientWidth < threshold ? "narrow" : "wide"; };
    // how: "hidden" (not yet seen) | "static" (final, no motion) | "animate"
    F.draw = function (how) {
      F.mode = F.computeMode();
      var svg = render(F);
      if (F.mode === "narrow") svg.classList.add("is-narrow");
      if (reduced() && how === "animate") how = "static";
      if (how === "static") svg.classList.add("is-drawn", "no-t");
      if (how === "animate" && F.keep) {
        svg.querySelectorAll("[data-k]").forEach(function (n) {
          if (F.keep[n.getAttribute("data-k")]) n.classList.add("on");
        });
        svg.classList.add("no-t");
      }
      F.stage.replaceChildren(svg);
      F.svg = svg;
      if (how === "static") raf2(function () { svg.classList.remove("no-t"); });
      if (how === "animate") {
        raf2(function () {
          svg.classList.remove("no-t");
          if (F.keep) svg.querySelectorAll(".vo55-draw,.vo55-fade,.vo55-pop").forEach(function (n) { n.classList.add("on"); });
          else svg.classList.add("is-drawn");
        });
      }
      if (F.after) F.after(how);
    };
    F.reveal = function () {
      if (F.seen) return;
      F.seen = true;
      if (reduced()) { F.draw("static"); }
      else if (F.keep) { F.draw("animate"); }
      else if (F.svg) { F.svg.classList.add("is-drawn"); }
      if (F.onSeen) F.onSeen();
    };
    FIGS.push(F);
    return F;
  }

  /* ================================================================== HERO (fig. 1) */
  function renderHero(F) {
    var W = 520, r = R(7);
    var svg = mkSvg(W, 100, tp("hero_fig"));
    var q = tp("c1.fig_q"), size = 21;
    var qs = wrap(q, 330, size, false, 500);
    var bw = widest(qs, size, false, 500) + 64, bh = qs.length * 28 + 38;
    var TX = 258, bx = clamp(TX - bw * 0.6, 14, W - bw - 14), by = 14, x = bx, y = by, w = bw, h = bh, rd = 20;

    // bubble (one stroke, starting right of the tail, ending left of it)
    var j = function (v) { return f(v + jit(r, .8)); };
    var bd = "M" + (TX + 11) + " " + (y + h) + " L" + j(x + w - rd) + " " + j(y + h) + " Q" + (x + w) + " " + (y + h) + " " + j(x + w) + " " + j(y + h - rd) +
      " L" + j(x + w) + " " + j(y + rd) + " Q" + (x + w) + " " + y + " " + j(x + w - rd) + " " + j(y) +
      " L" + j(x + rd) + " " + j(y) + " Q" + x + " " + y + " " + j(x) + " " + j(y + rd) +
      " L" + j(x) + " " + j(y + h - rd) + " Q" + x + " " + (y + h) + " " + j(x + rd) + " " + j(y + h) + " L" + (TX - 9) + " " + (y + h);
    var fill = el("path", { d: bd + " Z", "class": "f-card" }, svg);
    fade(fill, 0);
    ink(svg, bd, "s-bold", 0, .9);
    ink(svg, rrect(x + 5, y + 5, w - 8, h - 6, r, .6).replace(/M/g, "M"), "s-faint s-thin", .5, .6);
    var qt = lines(svg, x + w / 2, y + 22 + size * .78, qs, size, 28, "", "middle", 500);
    fade(qt, .35);

    // tail grows into a trunk
    var tb = y + h, ty = tb + 34, rootY = tb + 92, rootX = 262;
    ink(svg, "M" + (TX - 9) + " " + tb + " C" + (TX - 9) + " " + (tb + 14) + " " + (TX - 3) + " " + (tb + 24) + " " + (TX + 1) + " " + ty, "s-bold", .8, .3);
    ink(svg, "M" + (TX + 11) + " " + tb + " C" + (TX + 11) + " " + (tb + 14) + " " + (TX + 5) + " " + (tb + 24) + " " + (TX + 1) + " " + ty, "s-bold", .8, .3);
    ink(svg, "M" + (TX + 1) + " " + ty + " C" + (TX + 2) + " " + (ty + 20) + " " + (rootX - 2) + " " + (rootY - 30) + " " + rootX + " " + (rootY - 8), "s-bold s-ink", 1.05, .3);

    var y1 = rootY + 74, y2 = y1 + 72, y3 = y2 + 66;
    var A = [148, y1], B = [378, y1];
    var L2 = [[78, y2], [148, y2], [218, y2], [308, y2], [378, y2], [448, y2]];
    var L3 = [[112, y3], [186, y3]];
    function br(p, c, cls, d, du) {
      var dd = "M" + f(p[0]) + " " + f(p[1] + 7) + " C" + f(p[0] + jit(r, 3)) + " " + f(p[1] + 38) + " " + f(c[0] + jit(r, 3)) + " " + f(c[1] - 38) + " " + f(c[0]) + " " + f(c[1] - 6);
      ink(svg, dd, cls, d, du);
    }
    var root = [rootX, rootY];
    br(root, A, "s-ink s-bold", 1.35, .4);
    br(root, B, "s-muted", 1.35, .4);
    L2.forEach(function (c, i) {
      var p = i < 3 ? A : B, hot = i === 1;
      br(p, c, hot ? "s-ink s-bold" : "s-muted", 1.7 + i * .04, .35);
    });
    br(L2[1], L3[0], "s-muted", 2.05, .3);
    br(L2[1], L3[1], "s-ink s-bold", 2.05, .3);

    function node(c, rr, hot, d, filled) {
      var n = el("circle", { cx: c[0], cy: c[1], r: rr, "class": (filled ? (hot ? "f-ink" : "f-muted") : "f-card") + " s " + (hot ? "s-ink" : "s-muted") + (hot ? " s-bold" : "") }, svg);
      fade(n, d, null, "vo55-pop");
    }
    node(root, 8, true, 1.2);
    var rl = text(svg, rootX + 18, rootY + 5, list("c3.fig_nodes")[0], 14, "t-mono t-muted");
    fade(rl, 1.25);
    node(A, 6, true, 1.6); node(B, 6, false, 1.6);
    L2.forEach(function (c, i) { node(c, i === 1 ? 6 : 4, i === 1, 1.95 + i * .03, i !== 1); });
    node(L3[0], 4, false, 2.3, true);
    node(L3[1], 6.5, true, 2.3, true);

    // the circled leaf
    ink(svg, loop(L3[1][0], L3[1][1], 24, 20, r, 1.18), "s-ink s-bold", 2.35, .55);
    ink(svg, "M" + (L3[1][0] + 34) + " " + (L3[1][1] + 6) + " C" + (L3[1][0] + 70) + " " + (L3[1][1] + 14) + " " + (L3[1][0] + 110) + " " + (L3[1][1] - 8) + " " + (L3[1][0] + 140) + " " + (L3[1][1] - 34), "s-ink", 2.7, .35);
    // small signal arcs radiating from the leaf
    [0, 1].forEach(function (k) {
      var rr = 36 + k * 10;
      ink(svg, "M" + f(L3[1][0] + rr * Math.cos(-.5)) + " " + f(L3[1][1] + rr * Math.sin(-.5)) + " A" + rr + " " + rr + " 0 0 1 " + f(L3[1][0] + rr * Math.cos(.35)) + " " + f(L3[1][1] + rr * Math.sin(.35)), "s-ink s-thin", 2.85 + k * .1, .25);
    });

    var H = y3 + 46;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    return svg;
  }

  /* ================================================================== C1 before / now (fig. 2) */
  var c1Mode = "before", c1Anim = null;
  function c1Parts(mode) {
    var raw = tp(mode === "before" ? "c1.fig_before" : "c1.fig_after");
    var ci = raw.indexOf(":");
    var tag = ci > -1 ? raw.slice(0, ci).trim() : raw;
    var rest = ci > -1 ? raw.slice(ci + 1) : raw;
    var segs = rest.split("→").map(function (s) { return s.trim(); });
    return { raw: raw, tag: tag, segs: segs };
  }
  var ROADS = {
    before: [["M", [0, 0]], ["C", [34, 0], [36, -70], [76, -70]], ["L", [254, -70]], ["C", [306, -70], [316, 72], [256, 76]],
      ["C", [204, 80], [186, 28], [226, 10]], ["C", [266, -8], [340, 0], [392, 0]]],
    now: [["M", [0, 0]], ["L", [208, 0]]]
  };
  function renderC1(F) {
    var wide = F.mode === "wide", r = R(21);
    var W = wide ? 720 : 340;
    var parts = c1Parts(c1Mode);
    var svg = mkSvg(W, 100, tp("c1.fig") + ": " + parts.raw);

    // question card
    var q = tp("c1.fig_q"), qsz = wide ? 16 : 16;
    var qmax = wide ? 168 : 250;
    var ql = wrap(q, qmax, qsz, false, 500);
    var cw = wide ? 196 : Math.min(300, widest(ql, qsz, false, 500) + 44), ch = ql.length * 21 + 34;
    var cx = wide ? 14 : (W - cw) / 2, cy = wide ? 140 - ch / 2 : 18;
    var S = wide ? [cx + cw + 8, 140] : [W / 2, cy + ch + 10];
    var map = wide
      ? function (p) { return [S[0] + p[0], S[1] + p[1]]; }
      : function (p) { return [S[0] - p[1], S[1] + p[0] * .86]; };

    var card = el("g", null, svg);
    var cbg = el("rect", { x: cx, y: cy, width: cw, height: ch, "class": "f-card" }, card);
    fade(cbg, 0);
    ink(card, rrect(cx, cy, cw, ch, r), "", 0, .6);
    var tape = wide && el("rect", { x: cx + cw / 2 - 26, y: cy - 8, width: 52, height: 14, fill: "var(--tape)", transform: "rotate(-4 " + (cx + cw / 2) + " " + cy + ")" }, card);
    if (tape) fade(tape, .2);
    fade(lines(card, cx + cw / 2, cy + 20 + qsz * .8, ql, qsz, 21, "", "middle", 500), .15);

    // the road
    var cmds = ROADS[c1Mode], d = "";
    cmds.forEach(function (c) {
      d += (d ? " " : "") + c[0] + c.slice(1).map(function (p) { var m = map(p); return f(m[0]) + " " + f(m[1]); }).join(" ");
    });
    var road;
    if (c1Mode === "before") {
      road = el("path", { d: d, "class": "s s-muted s-bold dash", id: "vo55-road" }, svg);
      fade(road, .3, null);
    } else {
      road = el("path", { d: d, "class": "s s-ink s-bold vo55-draw", pathLength: 1, style: "--d:.3s;--t:.5s" }, svg);
    }
    var endU = c1Mode === "before" ? 392 : 208, clockU = endU + 44;
    var E = map([endU, 0]);
    var endAng = wide ? 0 : Math.PI / 2;
    ink(svg, head(E[0], E[1], endAng, 9), c1Mode === "before" ? "s-muted s-bold" : "s-ink s-bold", c1Mode === "before" ? .6 : .75, .2);

    if (c1Mode === "before") {
      // queue of tickets along the top run
      for (var i = 0; i < 6; i++) {
        var tp0 = map([96 + i * 28, -70]);
        var tw = wide ? 22 : 16, th = wide ? 16 : 22;
        var gp = el("g", null, svg), g = el("g", { transform: "rotate(" + f(jit(r, 9)) + " " + f(tp0[0]) + " " + f(tp0[1]) + ")" }, gp);
        el("rect", { x: f(tp0[0] - tw / 2), y: f(tp0[1] - th / 2), width: tw, height: th, "class": "f-card s s-thin" }, g);
        el("path", { d: wide ? "M" + f(tp0[0] - 6) + " " + f(tp0[1] - 2) + " h12 M" + f(tp0[0] - 6) + " " + f(tp0[1] + 3) + " h8"
          : "M" + f(tp0[0] - 4) + " " + f(tp0[1] - 4) + " h8 M" + f(tp0[0] - 4) + " " + f(tp0[1] + 1) + " h6", "class": "s s-muted s-thin" }, g);
        fade(gp, .5 + i * .08, null, "vo55-pop");
      }
      var ql2 = map([166, -70]);
      var qlabel = parts.segs[1] || "";
      var qtx = wide
        ? text(svg, ql2[0], ql2[1] - 22, qlabel, 13, "t-mono t-muted", { "text-anchor": "middle" })
        : text(svg, ql2[0] + 22, ql2[1], qlabel, 12, "t-mono t-muted", { "text-anchor": "middle", transform: "rotate(90 " + f(ql2[0] + 22) + " " + f(ql2[1]) + ")" });
      fade(qtx, .9);
    } else {
      var A = map([104, 0]);
      var ag = el("g", null, svg);
      el("circle", { cx: A[0], cy: A[1], r: 20, "class": "f-card s s-ink s-bold" }, ag);
      el("path", { d: "M" + A[0] + " " + (A[1] - 9) + " V" + (A[1] + 9) + " M" + (A[0] - 8) + " " + (A[1] - 4.5) + " L" + (A[0] + 8) + " " + (A[1] + 4.5) + " M" + (A[0] - 8) + " " + (A[1] + 4.5) + " L" + (A[0] + 8) + " " + (A[1] - 4.5), "class": "s s-ink" }, ag);
      [28, 36].forEach(function (rr) {
        var a0 = wide ? -2.4 : -.8, a1 = wide ? -.75 : .8;
        el("path", { d: "M" + f(A[0] + rr * Math.cos(a0)) + " " + f(A[1] + rr * Math.sin(a0)) + " A" + rr + " " + rr + " 0 0 1 " + f(A[0] + rr * Math.cos(a1)) + " " + f(A[1] + rr * Math.sin(a1)), "class": "s s-ink s-thin" }, ag);
      });
      fade(ag, .45, null, "vo55-pop");
      var al = wide ? text(svg, A[0], A[1] + 52, parts.segs[1] || "", 13, "t-mono t-ink", { "text-anchor": "middle" })
        : text(svg, A[0] + 50, A[1] + 5, parts.segs[1] || "", 13, "t-mono t-ink");
      fade(al, .6);
    }

    // clock
    var C = map([clockU, 0]), cr = 30;
    var clock = el("g", { "class": "vo55-clock" }, svg);
    el("circle", { cx: C[0], cy: C[1], r: cr, "class": "f-card s s-bold" + (c1Mode === "now" ? " s-ink" : "") }, clock);
    for (var k = 0; k < 12; k++) {
      var a = k / 12 * Math.PI * 2, r1 = k % 3 === 0 ? cr - 8 : cr - 5;
      el("line", { x1: f(C[0] + Math.cos(a) * r1), y1: f(C[1] + Math.sin(a) * r1), x2: f(C[0] + Math.cos(a) * (cr - 2)), y2: f(C[1] + Math.sin(a) * (cr - 2)), "class": "s s-thin s-muted" }, clock);
    }
    var hh = el("line", { x1: C[0], y1: C[1], x2: C[0], y2: C[1] - 15, "class": "s s-bold", id: "vo55-hh" }, clock);
    var mh = el("line", { x1: C[0], y1: C[1], x2: C[0], y2: C[1] - 24, "class": "s " + (c1Mode === "now" ? "s-ink" : ""), id: "vo55-mh" }, clock);
    el("circle", { cx: C[0], cy: C[1], r: 2.5, "class": "f-fg" }, clock);
    fade(clock, .2);
    var clab = parts.segs[2] || "";
    var cl = text(svg, C[0], C[1] + cr + 24, clab, 15, "t-mono " + (c1Mode === "now" ? "t-ink" : ""), { "text-anchor": "middle", "font-weight": 600, id: "vo55-clab" });
    fade(cl, 0);

    // travelling token
    var tok = el("g", { id: "vo55-tok" }, svg);
    el("rect", { x: -13, y: -9, width: 26, height: 18, rx: 2, "class": "f-ink" }, tok);
    text(tok, 0, 5, "?", 13, "t-mono t-paper", { "text-anchor": "middle", "font-weight": 600 });
    tok.style.opacity = "0";

    F._c1 = { road: road, tok: tok, hh: hh, mh: mh, C: C, label: cl };
    var H = wide ? 280 : Math.ceil(C[1] + cr + 44);
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    return svg;
  }
  function c1SetHands(F, k) {
    var o = F._c1, before = c1Mode === "before";
    var hDeg = before ? 40 + k * 1080 : 40, mDeg = before ? k * 1080 * 12 % 360 + 0 : k * 90;
    if (before) mDeg = (k * 1080 * 12) % 360;
    o.hh.setAttribute("transform", "rotate(" + f(hDeg) + " " + o.C[0] + " " + o.C[1] + ")");
    o.mh.setAttribute("transform", "rotate(" + f(mDeg) + " " + o.C[0] + " " + o.C[1] + ")");
  }
  function c1Run(F, animate) {
    if (c1Anim) cancelAnimationFrame(c1Anim);
    var o = F._c1; if (!o) return;
    var road = o.road, L = road.getTotalLength(), before = c1Mode === "before";
    var dur = before ? 4200 : 1100, start = null, delay = 650;
    function place(k) {
      var s = k;
      if (before) s = k < .15 ? k / .15 * .12 : k < .72 ? .12 + (k - .15) / .57 * .26 : .38 + (k - .72) / .28 * .62;
      var p = road.getPointAtLength(L * s);
      o.tok.setAttribute("transform", "translate(" + f(p.x) + " " + f(p.y) + ")");
      c1SetHands(F, k);
      o.label.style.opacity = k >= 1 ? "1" : (before ? String(clamp((k - .85) * 6, 0, 1)) : String(clamp((k - .7) * 3.3, 0, 1)));
    }
    o.tok.style.opacity = "1";
    if (!animate || reduced()) { place(1); return; }
    place(0);
    function step(ts) {
      if (!start) start = ts;
      var k = clamp((ts - start - delay) / dur, 0, 1);
      place(k);
      if (k < 1) c1Anim = requestAnimationFrame(step);
    }
    c1Anim = requestAnimationFrame(step);
  }
  function c1Controls() {
    var fig = document.getElementById("fig-c1");
    fig.querySelectorAll(".vo55-seg-btn").forEach(function (b) {
      b.textContent = c1Parts(b.getAttribute("data-mode")).tag;
      b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === c1Mode));
    });
    var st = fig.querySelector(".vo55-state");
    var parts = c1Parts(c1Mode);
    st.replaceChildren();
    var bt = document.createElement("b"); bt.textContent = parts.tag + ": ";
    st.appendChild(bt);
    st.appendChild(document.createTextNode(parts.segs.join(" → ")));
  }

  /* ================================================================== C2 path of a question (fig. 3) */
  function renderC2(F) {
    var wide = F.mode === "wide", r = R(33);
    var names = list("c2.fig_path");
    var svg = mkSvg(100, 100, tp("c2.fig") + ": " + names.join(" → "));
    var boxes = [], centers = [], W, H;
    var bsz = 16;

    if (wide) {
      W = 1000;
      var bw = 162, bh = 76, gap = (W - 12 - bw * 5) / 4, by = 54;
      names.forEach(function (n, i) { boxes.push({ x: 6 + i * (bw + gap), y: by, w: bw, h: bh }); });
    } else {
      W = 340;
      var bw2 = 206, bh2 = 60, step = 92, by2 = 34, bx2 = 50;
      names.forEach(function (n, i) { boxes.push({ x: bx2, y: by2 + i * step, w: bw2, h: bh2 }); });
    }
    boxes.forEach(function (b) { centers.push([b.x + b.w / 2, b.y + b.h / 2]); });

    // track + arrows between boxes
    var track = el("g", null, svg);
    for (var i = 0; i < 4; i++) {
      var a = boxes[i], b = boxes[i + 1], d;
      if (wide) { d = rline(a.x + a.w + 6, centers[i][1], b.x - 8, centers[i][1], r, .6); ink(track, d, "s-bold", .3 + i * .15, .3); ink(track, head(b.x - 7, centers[i][1], 0, 8), "s-bold", .45 + i * .15, .15); }
      else { d = rline(centers[i][0], a.y + a.h + 5, centers[i][0], b.y - 7, r, .6); ink(track, d, "s-bold", .3 + i * .15, .3); ink(track, head(centers[i][0], b.y - 6, Math.PI / 2, 8), "s-bold", .45 + i * .15, .15); }
    }

    // travelling dot (drawn under the boxes, so it slips behind them)
    var dot = el("g", { "class": "vo55-dotg" }, svg);
    el("circle", { cx: 0, cy: 0, r: 9, "class": "f-ink vo55-halo", opacity: .35 }, dot);
    el("circle", { cx: 0, cy: 0, r: 7, "class": "f-ink" }, dot);
    fade(dot, .8);

    var gs = [];
    names.forEach(function (n, i) {
      var b = boxes[i];
      var g = el("g", { "class": "vo55-box" }, svg);
      el("rect", { x: b.x, y: b.y, width: b.w, height: b.h, "class": "f-card vo55-box-fill" }, g);
      ink(g, rrect(b.x, b.y, b.w, b.h, r), "vo55-box-r", .1 + i * .12, .55);
      var ls = wrap(n, b.w - 26, bsz, false, 500).slice(0, 3);
      var ty = b.y + b.h / 2 - (ls.length - 1) * 10 + 6 + (wide ? 4 : 0);
      var tl = lines(g, b.x + b.w / 2, ty, ls, bsz, 20, "vo55-box-t", "middle", 500);
      tl.querySelectorAll("text").forEach(function (tt) { tt.classList.add("vo55-box-t"); });
      fade(tl, .25 + i * .12);
      var num = wide ? text(g, b.x, b.y - 12, "0" + (i + 1), 12, "t-mono t-muted") : text(g, b.x + 7, b.y + 14, "0" + (i + 1), 10, "t-mono t-muted");
      fade(num, .2 + i * .12);
      gs.push(g);
    });

    // dashed side branch from the assistant
    var cant = tp("c2.fig_cant"), csz = wide ? 14 : 13;
    var cl, nx, ny, nw, nh, bd;
    if (wide) {
      var a1 = boxes[1];
      nx = a1.x + a1.w / 2 + 34; ny = a1.y + a1.h + 76;
      cl = wrap(cant, 330, csz, true);
      nw = widest(cl, csz, true) + 30; nh = cl.length * 20 + 22;
      bd = "M" + f(a1.x + a1.w / 2) + " " + (a1.y + a1.h + 6) + " C" + f(a1.x + a1.w / 2) + " " + (ny + nh / 2 - 10) + " " + f(nx - 30) + " " + f(ny + nh / 2) + " " + f(nx - 6) + " " + f(ny + nh / 2);
      H = ny + nh + 16;
    } else {
      var a2 = boxes[1], last = boxes[4];
      nx = 10; ny = last.y + last.h + 46; nw = W - 20;
      cl = wrap(cant, nw - 30, csz, true);
      nh = cl.length * 19 + 22;
      bd = "M" + (a2.x - 6) + " " + f(a2.y + a2.h / 2) + " C" + (a2.x - 30) + " " + f(a2.y + a2.h / 2) + " 22 " + f(a2.y + a2.h / 2 + 20) + " 22 " + f(a2.y + a2.h + 40) + " L22 " + f(ny - 6);
      H = ny + nh + 14;
    }
    var br = el("path", { d: bd, "class": "s s-ink dash-l" }, svg);
    fade(br, .6);
    ink(svg, wide ? head(nx - 5, ny + nh / 2, 0, 7) : head(22, ny - 5, Math.PI / 2, 7), "s-ink", .8, .15);
    var nbox = el("g", null, svg);
    el("rect", { x: nx, y: ny, width: nw, height: nh, "class": "f-card s s-ink s-thin dash-l" }, nbox);
    lines(nbox, nx + 15, ny + 15 + csz * .8, cl, csz, wide ? 20 : 19, "t-mono t-ink");
    fade(nbox, .75);

    // stamp on the fixed-tools box
    var badge = tp("c2.fig_badge").toLocaleUpperCase(window.OZ.lang === "tr" ? "tr-TR" : "en-US");
    var ssz = wide ? 12 : 10.5, sw = mw(badge, ssz, true, 600) + badge.length * ssz * .1 + 22, sh = ssz + 16;
    var tb = boxes[3];
    var sx = wide ? tb.x + tb.w / 2 - sw / 2 + 14 : W - sw - 2, sy = wide ? tb.y + tb.h + 10 : tb.y + tb.h - 20;
    var so = el("g", { transform: "rotate(-6 " + f(sx + sw / 2) + " " + f(sy + sh / 2) + ")", "class": "vo55-stamp" }, svg);
    var si = el("g", { "class": "vo55-stamp-in" }, so);
    el("rect", { x: sx, y: sy, width: sw, height: sh, "class": "f-paper s s-ink", rx: 2 }, si);
    el("rect", { x: sx + 3, y: sy + 3, width: sw - 6, height: sh - 6, "class": "f-none s s-ink s-thin", rx: 1 }, si);
    text(si, sx + sw / 2, sy + sh / 2 + ssz * .36, badge, ssz, "t-mono t-ink", { "text-anchor": "middle", "font-weight": 600, "letter-spacing": (ssz * .1).toFixed(1) });

    F._c2 = { dot: dot, centers: centers, boxes: gs, stamp: so, wide: wide };
    svg.setAttribute("viewBox", "0 0 " + W + " " + Math.ceil(H));
    return svg;
  }
  function updateC2(F, p) {
    var o = F._c2; if (!o) return;
    var c = o.centers, pos = p * 4, i = Math.min(3, Math.floor(pos)), k = pos - i;
    var x = lerp(c[i][0], c[i + 1][0], k), y = lerp(c[i][1], c[i + 1][1], k);
    o.dot.setAttribute("transform", "translate(" + f(x) + " " + f(y) + ")");
    o.boxes.forEach(function (g, j) { g.classList.toggle("lit", pos >= j - .02); });
    o.stamp.classList.toggle("landed", pos >= 2.98);
  }

  /* ================================================================== C3 KPI tree (fig. 4) */
  var TREE = { 1: [2, 3], 2: [4, 5, 6, 7], 5: [8, 9], 3: [10, 11, 12, 13] };
  var PARENT = {}, DEPTH = { 1: 0 };
  Object.keys(TREE).forEach(function (k) { TREE[k].forEach(function (c) { PARENT[c] = +k; }); });
  (function d(id) { (TREE[id] || []).forEach(function (c) { DEPTH[c] = DEPTH[id] + 1; d(c); }); })(1);
  var c3Open = { 1: true, 2: true }, c3Sel = 2, c3Focus = null;
  function c3Path(id) { var p = []; while (id) { p.unshift(id); id = PARENT[id]; } return p; }
  function c3Visible() {
    var out = [];
    (function v(id) { out.push(id); if (c3Open[id]) (TREE[id] || []).forEach(v); })(1);
    return out;
  }
  function c3Close(id) { delete c3Open[id]; (TREE[id] || []).forEach(c3Close); }

  function renderC3(F) {
    var wide = F.mode === "wide", r = R(55);
    var names = list("c3.fig_nodes");
    var vis = c3Visible(), onPath = {};
    c3Path(c3Sel).forEach(function (id) { onPath[id] = true; });
    var svg = mkSvg(100, 100, tp("c3.fig"));
    svg.setAttribute("role", "group");
    var sz = 15, bh = 34, pos = {}, W, H;

    function boxW(id) { return mw(names[id - 1], sz, false, onPath[id] ? 600 : 500) + 28 + (TREE[id] ? 24 : 0); }

    if (wide) {
      W = 1000;
      var row = 0, rowH = 46, colX = [8, 196, 430, 700];
      (function lay(id) {
        var kids = TREE[id];
        if (!kids) { pos[id] = { y: 22 + row * rowH }; row++; }
        else { kids.forEach(lay); pos[id] = { y: (pos[kids[0]].y + pos[kids[kids.length - 1]].y) / 2 }; }
        pos[id].x = colX[DEPTH[id]];
      })(1);
      // widen spacing to centre the whole tree
      var maxR = 0;
      Object.keys(pos).forEach(function (id) { maxR = Math.max(maxR, pos[id].x + boxW(+id)); });
      var off = Math.max(0, (W - maxR) / 2 - 4);
      Object.keys(pos).forEach(function (id) { pos[id].x += off * (0.4 + DEPTH[id] * .2); });
      H = 22 + row * rowH;
    } else {
      W = 340;
      vis.forEach(function (id, i) { pos[id] = { x: 6 + DEPTH[id] * 24, y: 10 + i * 46 + bh / 2 }; });
      H = 10 + vis.length * 46;
    }
    vis.forEach(function (id) { pos[id].w = Math.min(boxW(id), W - pos[id].x - 4); });

    // edges
    var eg = el("g", null, svg);
    vis.forEach(function (id) {
      var p = PARENT[id]; if (!p) return;
      var a = pos[p], b = pos[id], hot = onPath[id], d;
      if (wide) {
        var x1 = a.x + a.w, x2 = b.x;
        d = "M" + f(x1 + 2) + " " + f(a.y) + " C" + f(x1 + 46 + jit(r, 4)) + " " + f(a.y + jit(r, 2)) + " " + f(x2 - 46) + " " + f(b.y) + " " + f(x2 - 2) + " " + f(b.y);
      } else {
        var ex = a.x + 12;
        d = "M" + f(ex) + " " + f(a.y + bh / 2 + 1) + " L" + f(ex + jit(r, .6)) + " " + f(b.y - 8) + " Q" + f(ex) + " " + f(b.y) + " " + f(ex + 8) + " " + f(b.y) + " L" + f(b.x - 2) + " " + f(b.y);
      }
      var idx = TREE[p].indexOf(id);
      ink(eg, d, hot ? "s-ink s-bold" : "s-muted", idx * .07, .45, "e" + id + (hot ? "h" : ""));
    });

    // nodes
    vis.forEach(function (id) {
      var b = pos[id], hot = onPath[id], kids = TREE[id], idx = PARENT[id] ? TREE[PARENT[id]].indexOf(id) : 0;
      var g = el("g", { "class": "vo55-node" + (hot ? " on-path" : "") + (id === c3Sel ? " is-sel" : ""), tabindex: 0, role: "button",
        "aria-label": names[id - 1], "data-id": id }, svg);
      if (kids) g.setAttribute("aria-expanded", String(!!c3Open[id]));
      if (id === c3Sel) g.setAttribute("aria-current", "true");
      var x = b.x, y = b.y - bh / 2, w = b.w;
      el("rect", { x: x, y: y, width: w, height: bh, rx: 2, "class": "vo55-node-bg" }, g);
      el("rect", { x: x - 5, y: y - 5, width: w + 10, height: bh + 10, rx: 4, "class": "vo55-focus" }, g);
      var rr = R(id * 13);
      ink(g, rrect(x, y, w, bh, rr, .7), hot ? "s-ink" + (id === c3Sel ? " s-bold" : "") : "", .1 + idx * .07, .5, "nb" + id + (hot ? "h" : "") + (id === c3Sel ? "s" : ""));
      var tt = text(g, x + 14, b.y + 5.5, names[id - 1], sz, "", { "font-weight": hot ? 600 : 500 });
      fade(tt, .2 + idx * .07, "nt" + id + (hot ? "h" : ""));
      if (kids) {
        var kx = x + w - 16, open = !!c3Open[id];
        var kg = el("g", null, g);
        el("circle", { cx: kx, cy: b.y, r: 8, "class": "s s-thin " + (hot ? "s-ink" : "s-muted") }, kg);
        el("path", { d: "M" + (kx - 4) + " " + b.y + " h8" + (open ? "" : " M" + kx + " " + (b.y - 4) + " v8"), "class": "s " + (hot ? "s-ink" : "") }, kg);
        fade(kg, .25 + idx * .07, "nk" + id + (open ? "o" : "c") + (hot ? "h" : ""));
      }
      if (id === c3Sel && !kids) {
        ink(svg, loop(x + w / 2, b.y, w / 2 + 16, bh / 2 + 10, R(id), 1.1), "s-ink", .15, .6, "loop" + id);
      }
    });

    svg.setAttribute("viewBox", "0 0 " + W + " " + Math.ceil(H + 4));
    return svg;
  }
  function c3State() {
    var names = list("c3.fig_nodes");
    var st = document.querySelector("#fig-c3 .vo55-state");
    st.replaceChildren();
    c3Path(c3Sel).forEach(function (id) {
      var s = document.createElement("span"); s.textContent = names[id - 1]; st.appendChild(s);
    });
  }
  function c3Act(F, id) {
    if (TREE[id]) { if (c3Open[id]) c3Close(id); else c3Open[id] = true; }
    c3Sel = id; c3Focus = id;
    // keep everything that was already on screen (with its current look)
    F.keep = {};
    F.svg.querySelectorAll("[data-k]").forEach(function (n) { F.keep[n.getAttribute("data-k")] = true; });
    F.draw("animate");
    c3State();
  }

  /* ================================================================== C4 stepper (fig. 5) */
  var c4Step = 0;
  function renderC4(F) {
    var wide = F.mode === "wide", r = R(77 + c4Step);
    var W = wide ? 900 : 340, H = wide ? 340 : 400;
    var stepsL = list("c4.fig_steps");
    var svg = mkSvg(W, H, (c4Step + 1) + " · " + stepsL[c4Step]);
    var cxm = W / 2;

    if (c4Step === 0) {
      var q = tp("c1.fig_q"), sz = wide ? 26 : 20;
      var ql = wrap(q, wide ? 520 : 250, sz, false, 600);
      var bw = widest(ql, sz, false, 600) + 70, bh = ql.length * sz * 1.3 + 46;
      var bx = cxm - bw / 2, by = (wide ? 70 : 80);
      var bg = el("rect", { x: bx, y: by, width: bw, height: bh, rx: 22, "class": "f-card" }, svg); fade(bg, 0);
      ink(svg, "M" + (bx + 22) + " " + by + " H" + (bx + bw - 22) + " Q" + (bx + bw) + " " + by + " " + (bx + bw) + " " + (by + 22) + " V" + (by + bh - 22) + " Q" + (bx + bw) + " " + (by + bh) + " " + (bx + bw - 22) + " " + (by + bh) +
        " H" + (bx + 70) + " L" + (bx + 40) + " " + (by + bh + 30) + " L" + (bx + 46) + " " + (by + bh) + " H" + (bx + 22) + " Q" + bx + " " + (by + bh) + " " + bx + " " + (by + bh - 22) + " V" + (by + 22) + " Q" + bx + " " + by + " " + (bx + 22) + " " + by, "s-bold", 0, .9);
      fade(lines(svg, cxm, by + 24 + sz * .82, ql, sz, sz * 1.3, "", "middle", 600), .3);
      // the KPI node it points at
      var ky = by + bh + (wide ? 70 : 90);
      var kn = list("c3.fig_nodes")[0], kw = mw(kn, 16, true, 600) + 30;
      ink(svg, "M" + (bx + bw * .66) + " " + (by + bh + 8) + " C" + (bx + bw * .66) + " " + (ky - 30) + " " + cxm + " " + (ky - 40) + " " + cxm + " " + (ky - 22), "s-ink", .7, .4);
      ink(svg, head(cxm, ky - 20, Math.PI / 2, 8), "s-ink", 1.05, .15);
      ink(svg, rrect(cxm - kw / 2, ky - 14, kw, 32, r), "s-ink s-bold", 1.1, .5);
      fade(text(svg, cxm, ky + 7, kn, 16, "t-mono t-ink", { "text-anchor": "middle", "font-weight": 600 }), 1.3);
    }

    if (c4Step === 1) {
      var sc = list("c4.fig_scenarios");
      var base = wide ? 250 : 286, hs = wide ? [130, 196, 172, 160] : [140, 214, 186, 170];
      var bwid = wide ? 74 : 46, gapw = wide ? 140 : 80, x0 = cxm - (gapw * 3) / 2;
      ink(svg, rline(wide ? 150 : 14, base, wide ? 750 : 326, base, r, .4), "s-muted", 0, .5);
      sc.forEach(function (name, i) {
        var bx2 = x0 + i * gapw - bwid / 2, top = base - hs[i];
        if (i === 0) { var fw = el("rect", { x: bx2, y: top, width: bwid, height: hs[i], "class": "f-wash" }, svg); fade(fw, .3 + i * .12); }
        else {
          // hatch
          var hd = "";
          for (var yy = top + 8; yy < base; yy += 9) hd += "M" + f(bx2 + 4) + " " + f(yy) + " L" + f(bx2 + bwid - 4) + " " + f(yy - 6) + " ";
          var hp = el("path", { d: hd, "class": "s s-thin s-faint" }, svg); fade(hp, .4 + i * .12);
        }
        ink(svg, rrect(bx2, top, bwid, hs[i], r, .6), i === 0 ? "s-ink s-bold" : "", .2 + i * .12, .5);
        var nl = wrap(name, wide ? 120 : 76, wide ? 14 : 12, true);
        fade(lines(svg, bx2 + bwid / 2, base + 24, nl, wide ? 14 : 12, wide ? 18 : 15, "t-mono" + (i < 2 ? " t-ink" : " t-muted"), "middle", i < 2 ? 600 : 400), .4 + i * .12);
      });
      // gap bracket between Actual and Budget tops
      var aTop = base - hs[0], bTop = base - hs[1], ax = x0 - bwid / 2, bxr = x0 + gapw - bwid / 2;
      var dl = el("path", { d: "M" + f(ax - 4) + " " + bTop + " H" + f(bxr), "class": "s s-ink dash" }, svg); fade(dl, .9);
      var brx = ax - 14;
      ink(svg, "M" + f(brx + 6) + " " + bTop + " Q" + f(brx) + " " + bTop + " " + f(brx) + " " + f(bTop + 8) + " V" + f((aTop + bTop) / 2 - 6) + " Q" + f(brx) + " " + f((aTop + bTop) / 2) + " " + f(brx - 7) + " " + f((aTop + bTop) / 2) +
        " Q" + f(brx) + " " + f((aTop + bTop) / 2) + " " + f(brx) + " " + f((aTop + bTop) / 2 + 6) + " V" + f(aTop - 8) + " Q" + f(brx) + " " + aTop + " " + f(brx + 6) + " " + aTop, "s-ink s-bold", 1.0, .6);
      ink(svg, loop(brx - 22, (aTop + bTop) / 2, 13, 13, r, 1.1), "s-ink", 1.5, .4);
      fade(text(svg, brx - 22, (aTop + bTop) / 2 + 6, "Δ", 16, "t-ink", { "text-anchor": "middle", "font-weight": 600 }), 1.6);
    }

    if (c4Step === 2) {
      // gap bar at the top fans into three clusters: country · channel · category
      var gy = wide ? 34 : 30, gw = wide ? 180 : 140;
      var gb = el("rect", { x: cxm - gw / 2, y: gy, width: gw, height: 18, "class": "f-wash" }, svg); fade(gb, 0);
      ink(svg, rrect(cxm - gw / 2, gy, gw, 18, r, .5), "s-ink s-bold", 0, .4);
      fade(text(svg, cxm - gw / 2 - 14, gy + 15, "Δ", 16, "t-ink", { "text-anchor": "end", "font-weight": 600 }), .1);
      var base2 = wide ? 300 : 360;
      var cx3 = wide ? [190, 450, 710] : [62, 170, 278];
      var sets = [[118, 34, 22, 14], [48, 44, 38], [26, 96, 20, 16]];
      var big = [0, -1, 1];
      var bw3 = wide ? 28 : 13, g3 = wide ? 14 : 7;
      cx3.forEach(function (cx, ci) {
        var iy = wide ? 132 : 150;
        ink(svg, "M" + f(cxm + (ci - 1) * gw / 3) + " " + (gy + 20) + " C" + f(cxm + (ci - 1) * gw / 3) + " " + (gy + 60) + " " + cx + " " + (iy - 70) + " " + cx + " " + (iy - 34), "s-ink", .3 + ci * .1, .45);
        ink(svg, head(cx, iy - 32, Math.PI / 2, 7), "s-ink", .7 + ci * .1, .15);
        // icon
        var ic = el("g", null, svg), is = 14;
        if (ci === 0) {
          el("circle", { cx: cx, cy: iy - 10, r: is, "class": "s" }, ic);
          el("ellipse", { cx: cx, cy: iy - 10, rx: is * .45, ry: is, "class": "s s-thin" }, ic);
          el("path", { d: "M" + (cx - is) + " " + (iy - 10) + " H" + (cx + is) + " M" + (cx - is * .85) + " " + (iy - 17) + " H" + (cx + is * .85) + " M" + (cx - is * .85) + " " + (iy - 3) + " H" + (cx + is * .85), "class": "s s-thin" }, ic);
        } else if (ci === 1) {
          el("path", { d: "M" + (cx - is) + " " + (iy - 10) + " H" + (cx - 3) + " M" + (cx - 3) + " " + (iy - 10) + " L" + (cx + is) + " " + (iy - 22) + " M" + (cx - 3) + " " + (iy - 10) + " H" + (cx + is) + " M" + (cx - 3) + " " + (iy - 10) + " L" + (cx + is) + " " + (iy + 2), "class": "s" }, ic);
          [-22, -10, 2].forEach(function (yy) { el("circle", { cx: cx + is + 2, cy: iy + yy, r: 2.4, "class": "f-fg" }, ic); });
        } else {
          el("path", { d: "M" + (cx - is) + " " + (iy - 22) + " H" + (cx + 2) + " L" + (cx + is) + " " + (iy - 10) + " L" + (cx + 2) + " " + (iy + 2) + " H" + (cx - is) + " Z", "class": "s" }, ic);
          el("circle", { cx: cx - is + 6, cy: iy - 10, r: 2.4, "class": "s s-thin" }, ic);
        }
        fade(ic, .6 + ci * .1, null, "vo55-pop");
        // bars
        var vals = sets[ci], tot = vals.length * bw3 + (vals.length - 1) * g3, bx0 = cx - tot / 2;
        ink(svg, rline(bx0 - 10, base2, bx0 + tot + 10, base2, r, .3), "s-muted", .7, .3);
        vals.forEach(function (v, vi) {
          var x = bx0 + vi * (bw3 + g3), hv = v * (wide ? 1 : 1.05), hot = vi === big[ci];
          if (hot) { var fr = el("rect", { x: x, y: base2 - hv, width: bw3, height: hv, "class": "f-wash" }, svg); fade(fr, .9 + vi * .06); }
          ink(svg, rrect(x, base2 - hv, bw3, hv, r, .4), hot ? "s-ink s-bold" : "s-muted", .85 + vi * .06, .35);
          if (hot) ink(svg, loop(x + bw3 / 2, base2 - hv / 2, bw3 / 2 + (wide ? 16 : 10), hv / 2 + 14, r, 1.12), "s-ink", 1.5 + ci * .15, .5);
        });
      });
    }

    if (c4Step === 3) {
      var ms = list("c4.fig_methods"), msz = wide ? 15 : 13, ph = wide ? 18 : 12, chH = wide ? 42 : 36, gx = wide ? 14 : 8, gyy = wide ? 18 : 12;
      var maxW = wide ? 760 : 320, rows = [[]], rw = 0;
      ms.forEach(function (m, i) {
        var w = mw(m, msz, true, i === 1 ? 600 : 500) + ph * 2;
        if (rows[rows.length - 1].length && rw + gx + w > maxW) { rows.push([]); rw = 0; }
        rows[rows.length - 1].push({ m: m, w: w, i: i }); rw += (rw ? gx : 0) + w;
      });
      var totalH = rows.length * chH + (rows.length - 1) * gyy, y0 = (H - totalH) / 2 + 10;
      rows.forEach(function (row, ri) {
        var rwid = row.reduce(function (s, c) { return s + c.w; }, 0) + gx * (row.length - 1), x = (W - rwid) / 2;
        row.forEach(function (c) {
          var y = y0 + ri * (chH + gyy), lit = c.i === 1, d = .1 + c.i * .08;
          if (lit) { var lr = el("rect", { x: x, y: y, width: c.w, height: chH, rx: chH / 2, "class": "f-ink" }, svg); fade(lr, .9); }
          else { var cr2 = el("rect", { x: x, y: y, width: c.w, height: chH, rx: chH / 2, "class": "f-card" }, svg); fade(cr2, d); }
          var pd = "M" + f(x + chH / 2) + " " + f(y + jit(r, .6)) + " H" + f(x + c.w - chH / 2) + " A" + chH / 2 + " " + chH / 2 + " 0 0 1 " + f(x + c.w - chH / 2) + " " + f(y + chH) + " H" + f(x + chH / 2) + " A" + chH / 2 + " " + chH / 2 + " 0 0 1 " + f(x + chH / 2) + " " + f(y);
          ink(svg, pd, lit ? "s-ink s-bold" : "s-muted", d, .45);
          fade(text(svg, x + c.w / 2, y + chH / 2 + msz * .36, c.m, msz, "t-mono " + (lit ? "t-paper" : "t-muted"), { "text-anchor": "middle", "font-weight": lit ? 600 : 500 }), lit ? 1.0 : d + .2);
          if (lit) {
            ink(svg, loop(x + c.w / 2, y + chH / 2, c.w / 2 + 14, chH / 2 + 12, r, 1.14), "s-ink", 1.2, .55);
            var sx = x + c.w + 4, sy = y - 10;
            ink(svg, "M" + f(sx) + " " + f(sy) + " l7 -9 M" + f(sx + 9) + " " + f(sy + 6) + " l11 -4 M" + f(sx - 8) + " " + f(sy - 3) + " l-1 -11", "s-ink", 1.7, .2);
          }
          x += c.w + gx;
        });
      });
    }

    if (c4Step === 4) {
      var ans = tp("c4.fig_answer"), asz = wide ? 24 : 18;
      var al = wrap(ans, wide ? 560 : 250, asz, false, 500);
      var aw = (wide ? 640 : 300), ah = al.length * asz * 1.38 + (wide ? 92 : 80);
      var ax2 = (W - aw) / 2, ay = (H - ah) / 2;
      var abg = el("rect", { x: ax2, y: ay, width: aw, height: ah, "class": "f-card" }, svg); fade(abg, 0);
      ink(svg, rrect(ax2, ay, aw, ah, r), "s-bold", 0, .7);
      ink(svg, rrect(ax2 + 6, ay + 6, aw, ah, r, .5), "s-faint", .3, .6);
      var tp2 = el("rect", { x: ax2 + aw / 2 - 40, y: ay - 11, width: 80, height: 20, fill: "var(--tape)", transform: "rotate(3 " + (ax2 + aw / 2) + " " + ay + ")" }, svg); fade(tp2, .4);
      var cx0 = ax2 + (wide ? 44 : 34), cy0 = ay + (wide ? 44 : 38);
      ink(svg, loop(cx0, cy0, 16, 16, r, 1.1), "s-ink", .5, .4);
      ink(svg, "M" + (cx0 - 7) + " " + cy0 + " l5 6 l10 -12", "s-ink s-bold", .85, .25);
      var tx = ax2 + (wide ? 44 : 30), ty = ay + (wide ? 92 : 80) - asz * .1;
      fade(lines(svg, tx, ty, al, asz, asz * 1.38, "", "start", 500), .55);
      var lastW = mw(al[al.length - 1], asz, false, 500);
      var uy = ty + (al.length - 1) * asz * 1.38 + 12;
      ink(svg, "M" + f(tx) + " " + f(uy) + " C" + f(tx + lastW * .3) + " " + f(uy + 3) + " " + f(tx + lastW * .7) + " " + f(uy - 2) + " " + f(tx + lastW) + " " + f(uy + 1), "s-ink s-bold", 1.2, .6);
    }
    return svg;
  }
  function c4Controls() {
    var stepsL = list("c4.fig_steps");
    var wrapEl = document.querySelector("#fig-c4 .vo55-steps");
    if (!wrapEl.children.length) {
      stepsL.forEach(function (s, i) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "vo55-step"; b.setAttribute("role", "tab"); b.id = "vo55-step-" + i;
        b.innerHTML = '<span class="vo55-step-n">0' + (i + 1) + '</span><span class="vo55-step-l"></span>';
        b.addEventListener("click", function () { c4Go(i); });
        b.addEventListener("keydown", function (e) {
          var k = e.key, n = null;
          if (k === "ArrowRight" || k === "ArrowDown") n = (i + 1) % 5;
          if (k === "ArrowLeft" || k === "ArrowUp") n = (i + 4) % 5;
          if (k === "Home") n = 0; if (k === "End") n = 4;
          if (n != null) { e.preventDefault(); c4Go(n); wrapEl.children[n].focus(); }
        });
        wrapEl.appendChild(b);
      });
    }
    Array.prototype.forEach.call(wrapEl.children, function (b, i) {
      b.querySelector(".vo55-step-l").textContent = stepsL[i];
      b.setAttribute("aria-selected", String(i === c4Step));
      b.tabIndex = i === c4Step ? 0 : -1;
      b.classList.toggle("is-done", i < c4Step);
    });
    var nb = document.querySelector("#fig-c4 .vo55-next");
    var nxt = (c4Step + 1) % 5;
    nb.querySelector("span").textContent = c4Step === 4 ? "↺" : "→";
    nb.setAttribute("aria-label", "0" + (nxt + 1) + " " + stepsL[nxt]);
    nb.title = "0" + (nxt + 1) + " " + stepsL[nxt];
    var st = document.querySelector("#fig-c4 .vo55-stage");
    st.setAttribute("aria-labelledby", "vo55-step-" + c4Step);
  }
  var c4F;
  function c4Go(i) { c4Step = i; c4Controls(); c4F.draw("animate"); }

  /* ================================================================== C5 data model (fig. 6) */
  function renderC5(F) {
    var wide = F.mode === "wide", r = R(91);
    var W = wide ? 560 : 340, H = wide ? 440 : 420;
    var svg = mkSvg(W, H, tp("c5.fig") + ": " + tp("c5.fig_before") + " → " + tp("c5.fig_after"));
    var bx = wide ? 40 : 16, bw = wide ? 210 : 140, base = H - 26, topB = wide ? 30 : 34, topA = base - (wide ? 250 : 230);
    var clipId = "vo55-clip5";
    var defs = el("defs", null, svg);
    var cp = el("clipPath", { id: clipId }, defs);
    var clipR = el("rect", { x: bx, y: topB, width: bw, height: base - topB }, cp);

    // dense hatched block
    var hatch = el("g", { "clip-path": "url(#" + clipId + ")" }, svg);
    var hd = "", hv = "";
    for (var y = topB + 3; y < base; y += 3.4) hd += "M" + bx + " " + f(y) + " H" + (bx + bw) + " ";
    for (var k = -base; k < bw + base; k += 9) hv += "M" + f(bx + k) + " " + base + " L" + f(bx + k + (base - topB)) + " " + topB + " ";
    el("path", { d: hd, "class": "s s-muted", "stroke-width": .55, opacity: .75 }, hatch);
    el("path", { d: hv, "class": "s s-faint s-thin" }, hatch);
    var outline = el("rect", { x: bx, y: topB, width: bw, height: base - topB, "class": "s f-none s-bold" }, svg);

    // stack of ~50 lean cards
    var cards = el("g", null, svg), cardEls = [], n = 50, ch = (base - topA) / n;
    for (var i = 0; i < n; i++) {
      var cy = base - (i + 1) * ch, off = jit(r, 1.4);
      var c = el("rect", { x: f(bx + 22 + off), y: f(cy + ch * .2), width: bw - 44, height: f(ch * .6), rx: .6, "class": (i % 5 === 4 ? "f-wash" : "f-card") + " s s-ink", "stroke-width": .6 }, cards);
      cardEls.push(c);
    }
    // labels
    var lx = bx + bw + (wide ? 34 : 20), lwid = W - lx - 8, lsz = wide ? 18 : 14;
    var bl = wrap(tp("c5.fig_before"), lwid, lsz, true, 500);
    var al = wrap(tp("c5.fig_after"), lwid, lsz, true, 600);
    var bG = lines(svg, lx, topB + lsz, bl, lsz, lsz * 1.35, "t-mono t-muted", "start", 500);
    var bLastW = widest(bl, lsz, true, 500);
    var strike = el("path", { d: "", "class": "s s-ink s-bold" }, svg);
    var ay = topA + lsz + 6;
    var aG = lines(svg, lx, ay, al, lsz, lsz * 1.35, "t-mono t-ink", "start", 600);
    var aW = widest(al, lsz, true, 600), aH = al.length * lsz * 1.35;
    var circ = el("path", { d: loop(lx + aW / 2, ay - lsz * .35 + (al.length - 1) * lsz * .675, aW / 2 + 14, aH / 2 + 10, r, 1.05), "class": "s s-ink vo55-c5circ", pathLength: 1 }, svg);
    // connecting arrow from before label to after label
    var arr = el("path", { d: "M" + f(lx - 12) + " " + f(topB + lsz * 1.4 + bl.length * lsz * 1.35) + " C" + f(lx - 22) + " " + f((topB + ay) / 2) + " " + f(lx - 22) + " " + f(ay - lsz * 2) + " " + f(lx - 8) + " " + f(ay - lsz * .9), "class": "s s-muted dash" }, svg);
    F._c5 = { clipR: clipR, outline: outline, hatch: hatch, cards: cardEls, bG: bG, aG: aG, strike: strike, circ: circ, arr: arr,
      geo: { topB: topB, topA: topA, base: base, lx: lx, lsz: lsz, bl: bl, bws: bl.map(function (l) { return mw(l, lsz, true, 500); }) } };
    return svg;
  }
  function updateC5(F, p) {
    var o = F._c5; if (!o) return;
    var g = o.geo;
    var shrink = clamp(p / .7, 0, 1), e = shrink * shrink * (3 - 2 * shrink);
    var top = lerp(g.topB, g.topA, e);
    o.clipR.setAttribute("y", f(top)); o.clipR.setAttribute("height", f(g.base - top));
    o.outline.setAttribute("y", f(top)); o.outline.setAttribute("height", f(g.base - top));
    o.outline.style.opacity = String(1 - clamp((p - .55) / .25, 0, 1));
    o.hatch.style.opacity = String(1 - clamp((p - .3) / .5, 0, .95));
    var n = o.cards.length;
    o.cards.forEach(function (c, i) { c.style.opacity = p > .25 + .6 * (i / n) ? "1" : "0"; });
    o.aG.style.opacity = String(clamp((p - .7) / .2, 0, 1));
    o.arr.style.opacity = String(clamp((p - .75) / .2, 0, 1));
    // strike each line of the "before" label in turn
    var s = clamp((p - .6) / .3, 0, 1) * g.bl.length, d = "";
    g.bws.forEach(function (bw, i) {
      var k = clamp(s - i, 0, 1); if (k <= 0) return;
      var ly = g.topB + g.lsz + i * g.lsz * 1.35 - g.lsz * .33;
      d += "M" + f(g.lx - 4) + " " + f(ly + 1) + " L" + f(g.lx - 4 + (bw + 8) * k) + " " + f(ly - 1.5 * k) + " ";
    });
    o.strike.setAttribute("d", d);
    o.circ.classList.toggle("on", p >= .97);
  }

  /* ------------------------------------------------------------------ text bits */
  var UNDER = {
    hero: "M2 13 C 40 6, 90 4, 130 9 S 186 15, 198 6",
    straight: "M2 12 C 60 9, 140 14, 198 10",
    wavy: "M2 11 Q 14 3 26 11 T 50 11 T 74 11 T 98 11 T 122 11 T 146 11 T 170 11 T 196 11",
    double: "M2 8 C 60 6 140 10 198 7 M10 15 C 70 13 150 17 192 14",
    zig: "M2 12 L 14 6 L 26 13 L 40 6 L 54 13 L 68 6 L 82 13 L 96 6 L 110 13 L 124 6 L 138 13 L 152 6 L 166 13 L 180 6 L 196 12",
    swoop: "M2 15 C 50 3, 150 3, 198 12",
    tail: "M2 10 C 70 14, 130 6, 178 11 C 196 13 194 3 182 6"
  };
  var TITLES = {
    c1: { n: { tr: 2, en: 2 }, u: "straight" },
    c2: { n: { tr: 2, en: 2 }, u: "wavy" },
    c3: { n: { tr: 2, en: 2 }, u: "double" },
    c4: { n: { tr: 2, en: 2 }, u: "zig" },
    c5: { n: { tr: 1, en: 2 }, u: "swoop" },
    c6: { n: { tr: 3, en: 3 }, u: "tail" }
  };
  function underSpan(str, kind) {
    var s = document.createElement("span"); s.className = "vo55-u"; s.textContent = str;
    s.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="' + UNDER[kind] + '"/></svg>');
    return s;
  }
  function decorate(node, str, nWords, kind) {
    var m = str.match(/^(.*?)([.!?…]?)$/), body = m[1], punct = m[2];
    var words = body.split(" "), cut = Math.max(0, words.length - nWords);
    node.replaceChildren();
    if (cut) node.appendChild(document.createTextNode(words.slice(0, cut).join(" ") + " "));
    node.appendChild(underSpan(words.slice(cut).join(" "), kind));
    if (punct) { var d = document.createElement("span"); d.className = "vo55-dot"; d.textContent = punct; node.appendChild(d); }
  }
  function renderText() {
    var lang = window.OZ.lang;
    var title = tp("title");
    document.title = title + " — ozsert.com";
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", tp("oneliner"));
    decorate(document.getElementById("vo55-title"), title, 1, "hero");
    document.querySelectorAll("[data-title]").forEach(function (h) {
      var k = h.getAttribute("data-title"), cfg = TITLES[k];
      decorate(h, tp(k + ".title"), cfg.n[lang] || 2, cfg.u);
    });
    // stat 1: struck "days" → circled "minutes"
    var s1 = tp("stat1"), st = document.getElementById("vo55-stat1");
    st.replaceChildren();
    var bits = s1.split("→");
    if (bits.length === 2) {
      var a = document.createElement("span"); a.className = "vo55-strike"; a.textContent = bits[0].trim();
      a.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M2 12 C 30 8, 70 12, 98 7"/></svg>');
      var sep = document.createElement("span"); sep.className = "vo55-arrow-sep"; sep.textContent = " → ";
      var b = document.createElement("span"); b.className = "vo55-circ"; b.textContent = bits[1].trim();
      b.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path d="' + loop(50, 20, 47, 17, R(3), 1.12) + '"/></svg>');
      st.append(a, sep, b);
    } else st.textContent = s1;
    // c6 hand-numbered list
    var ol = document.getElementById("vo55-learned");
    ol.replaceChildren();
    var sentences = tp("c6.body").split(/(?<=[.!?])\s+(?=[A-ZÇĞİÖŞÜ"“])/);
    sentences.forEach(function (s, i) {
      var li = document.createElement("li");
      var num = document.createElement("span"); num.className = "vo55-num"; num.setAttribute("aria-hidden", "true"); num.textContent = i + 1;
      num.insertAdjacentHTML("afterbegin", '<svg viewBox="0 0 52 46" aria-hidden="true"><path d="' + loop(26, 23, 20, 17, R(40 + i), 1.15) + '"/></svg>');
      li.appendChild(num);
      li.appendChild(document.createTextNode(s));
      ol.appendChild(li);
    });
    // stack + credit
    var ul = document.getElementById("vo55-stack"); ul.replaceChildren();
    tp("stack").split(",").forEach(function (s) { var li = document.createElement("li"); li.textContent = s.trim(); ul.appendChild(li); });
    document.getElementById("vo55-credit").textContent = t("projects.credit").replace("{model}", MODEL_NAME);
    // figure numbers
    document.querySelectorAll(".vo55-fig").forEach(function (fg) {
      fg.querySelector(".vo55-cap-no").textContent = t("ui.fig") + " " + fg.getAttribute("data-no");
    });
    c1Controls();
    c3State();
    c4Controls();
  }

  /* ------------------------------------------------------------------ scroll-driven bits */
  var heroF, c1F, c2F, c3F, c5F, ticking = false;
  function progress(fig, startAt, span) {
    var rc = fig.getBoundingClientRect(), vh = window.innerHeight;
    return clamp((vh * startAt - rc.top) / (vh * span), 0, 1);
  }
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (reduced()) { updateC2(c2F, 1); updateC5(c5F, 1); return; }
      updateC2(c2F, progress(c2F.stage, .8, .55));
      updateC5(c5F, progress(c5F.stage, .82, .62));
    });
  }

  /* ------------------------------------------------------------------ boot */
  function boot() {
    heroF = Fig("fig-hero", 0, renderHero);
    c1F = Fig("fig-c1", 600, renderC1);
    c2F = Fig("fig-c2", 760, renderC2);
    c3F = Fig("fig-c3", 760, renderC3);
    c4F = Fig("fig-c4", 640, renderC4);
    c5F = Fig("fig-c5", 480, renderC5);

    c1F.after = function (how) {
      if (how === "hidden") return;
      c1Run(c1F, how === "animate");
    };
    c1F.onSeen = function () { c1Run(c1F, !reduced()); };
    c2F.after = function () { onScroll(); };
    c5F.after = function () { onScroll(); };
    c3F.keep = {}; // incremental drawing
    c3F.after = function () {
      c3F.svg.querySelectorAll(".vo55-node").forEach(function (g) {
        var id = +g.getAttribute("data-id");
        g.addEventListener("click", function () { c3Act(c3F, id); });
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c3Act(c3F, id); }
        });
      });
      if (c3Focus) { var fn = c3F.svg.querySelector('.vo55-node[data-id="' + c3Focus + '"]'); if (fn) fn.focus({ preventScroll: true }); }
    };

    renderText();
    FIGS.forEach(function (F) { F.draw(reduced() ? "static" : "hidden"); });
    if (reduced()) FIGS.forEach(function (F) { F.seen = true; if (F.onSeen) F.onSeen(); });

    // controls
    document.querySelectorAll("#fig-c1 .vo55-seg-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        c1Mode = b.getAttribute("data-mode");
        c1Controls();
        c1F.seen = true;
        c1F.draw("animate");
      });
    });
    document.querySelector("#fig-c4 .vo55-next").addEventListener("click", function () { c4Go((c4Step + 1) % 5); });

    // reveal on view
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var tgt = e.target;
        if (tgt.__fig) tgt.__fig.reveal(); else tgt.classList.add("is-in");
        io.unobserve(tgt);
      });
    }, { threshold: .2, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(function (s) { if (reduced()) s.classList.add("is-in"); else io.observe(s); });
    FIGS.forEach(function (F) { F.stage.__fig = F; if (!reduced()) io.observe(F.stage); });

    // language: re-render all copy and figures in place
    document.addEventListener("oz:langchange", function () {
      renderText();
      FIGS.forEach(function (F) { F.keep = F === c3F ? {} : null; F.draw(F.seen ? "static" : "hidden"); if (F === c3F) F.keep = {}; });
      if (c1F.seen) c1Run(c1F, false);
    });

    // layout mode changes (wide ↔ narrow)
    var ro = new ResizeObserver(function () {
      FIGS.forEach(function (F) {
        if (F.computeMode() !== F.mode) {
          var k = F.keep; F.keep = k ? {} : null;
          F.draw(F.seen ? "static" : "hidden");
          if (F === c3F) F.keep = {};
          if (F === c1F && F.seen) c1Run(c1F, false);
        }
      });
    });
    FIGS.forEach(function (F) { ro.observe(F.stage); });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    // web fonts that arrive late change text widths: re-measure once
    if (!fontsOk && document.fonts) document.fonts.ready.then(function () {
      renderText();
      FIGS.forEach(function (F) {
        var k = F.keep; if (k) F.keep = {};
        F.draw(F.seen ? "static" : "hidden");
        if (k) F.keep = {};
      });
      if (c1F.seen) c1Run(c1F, false);
    });
  }

  var fontsOk = false;
  var fontsP = document.fonts && document.fonts.ready
    ? Promise.race([document.fonts.ready.then(function () { fontsOk = true; }), new Promise(function (res) { setTimeout(res, 1500); })])
    : Promise.resolve();
  Promise.all([window.OZ.ready, fontsP]).then(boot);
})();
