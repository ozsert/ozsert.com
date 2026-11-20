/*!
 * ozsert.com — shared top bar: <oz-topbar>
 * 40px sticky bar: TR/EN · theme · "Built with [model ▾]" · view specs.
 * On mobile (<640px) the model switcher + specs move to a fixed bottom bar
 * (versions must leave 64px of bottom padding on mobile).
 * Shadow DOM: version CSS cannot affect it and it cannot affect versions.
 * Requires /shared/core.js (window.OZ). Do not modify from a version.
 */
(function () {
  "use strict";
  if (customElements.get("oz-topbar")) return;

  var UI = {
    tr: { built: "Yapan model", specs: "spesifikasyon", all: "Tüm modeller →", latest: "güncel",
          theme: "Temayı değiştir", lang: "Dil", close: "Kapat", loading: "Yükleniyor…",
          tabs: { content: "İçerik", talks: "Konuşmalar", workbench: "Atölye", projects: "Projeler", design: "Tasarım", platform: "Platform", prompt: "Prompt" },
          specsTitle: "Bu sayfanın spesifikasyonu", unregistered: "kayıtsız", draft: "taslak" },
    en: { built: "Built with", specs: "view specs", all: "All models →", latest: "latest",
          theme: "Toggle theme", lang: "Language", close: "Close", loading: "Loading…",
          tabs: { content: "Content", talks: "Talks", workbench: "Workbench", projects: "Projects", design: "Design", platform: "Platform", prompt: "Prompt" },
          specsTitle: "The spec behind this page", unregistered: "unregistered", draft: "draft" }
  };
  var SPECS = [
    ["content", "/specs/content.md"], ["talks", "/specs/talks.md"], ["workbench", "/specs/projects.md"],
    ["projects", ["ai-code-reviewer", "skill-marketplace", "executive-kpi-agent", "ai-gateway", "mailbox-qa", "sam-ai",
      "player-support-agent"].map(function (p) { return "/specs/projects/" + p + ".md"; })],
    ["design", "/specs/design.md"], ["platform", "/specs/platform.md"],
    ["prompt", ["/specs/build-prompt.md", "/specs/build-prompt-page.md"]]
  ];

  var CSS = [
    ":host{--bg:rgba(251,248,241,.86);--fg:#1A1714;--muted:#6A615B;--rule:rgba(123,112,94,.28);--card:#FEFCF7;--hi:var(--oz-accent,#1F5F8B);",
    "display:block;position:sticky;top:0;z-index:1000;font:13px/1.2 'Geist',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--fg)}",
    ":host([theme=dark]){--bg:rgba(22,19,15,.86);--fg:#ECE7DE;--muted:#B0AAA3;--rule:rgba(229,221,208,.16);--card:#1D1915}",
    "*{box-sizing:border-box}",
    ".bar{height:40px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 16px;background:var(--bg);",
    "border-bottom:1px solid var(--rule);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}",
    "a{color:inherit;text-decoration:none}",
    ".home{display:flex;align-items:center;gap:8px;font-weight:600;font-size:12px;white-space:nowrap}",
    "",
    ".right{display:flex;align-items:center;gap:10px}",
    ".mono{font-family:'Geist Mono',ui-monospace,SFMono-Regular,Menlo,monospace}",
    "button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}",
    "button:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid var(--hi);outline-offset:2px;border-radius:4px}",
    ".lang{display:flex;align-items:center;gap:2px;font-size:11px;letter-spacing:.06em}",
    ".lang button{padding:4px 5px;color:var(--muted);border-radius:4px}",
    ".lang button[aria-pressed=true]{color:var(--fg);font-weight:600;text-decoration:underline;text-underline-offset:3px}",
    ".icon{width:28px;height:28px;display:grid;place-items:center;border-radius:6px}",
    ".icon:hover{background:var(--rule)}",
    ".icon svg{width:16px;height:16px}",
    ".switch{display:flex;align-items:stretch;border:1px solid var(--hi);border-radius:6px;overflow:hidden;height:28px}",
    ".switch label{display:flex;align-items:center;padding:0 8px;color:var(--muted);font-size:11px;border-right:1px solid var(--rule);white-space:nowrap}",
    ".switch select{font:12px 'Geist Mono',ui-monospace,monospace;color:var(--fg);background:transparent;border:0;padding:0 6px;max-width:210px;cursor:pointer}",
    ".switch select option{color:#1A1714;background:#fff}",
    ".specs{font-size:12px;color:var(--muted);white-space:nowrap}",
    ".specs:hover{color:var(--fg)}",
    ".bottom{display:none}",
    "@media (max-width:639px){.desk{display:none!important}",
    " .bottom.on{display:flex;position:fixed;left:0;right:0;bottom:0;height:56px;padding:0 16px calc(env(safe-area-inset-bottom)) 16px;align-items:center;justify-content:space-between;gap:10px;",
    "  background:var(--bg);border-top:1px solid var(--rule);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}",
    " .bottom .switch label{display:none}",
    " .bottom .switch select{max-width:62vw}}",
    "dialog{width:min(860px,calc(100vw - 32px));height:min(80vh,900px);padding:0;border:1px solid var(--rule);border-radius:10px;",
    "background:var(--card);color:var(--fg);box-shadow:0 30px 80px rgba(0,0,0,.25)}",
    "dialog::backdrop{background:rgba(20,16,12,.45);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}",
    ".dlg{display:flex;flex-direction:column;height:100%}",
    ".dhead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid var(--rule)}",
    ".dhead h2{margin:0;font-size:14px;font-weight:600}",
    ".tabs{display:flex;gap:4px;padding:8px 12px;border-bottom:1px solid var(--rule);overflow-x:auto}",
    ".tabs button{font:11px 'Geist Mono',ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;padding:6px 10px;border-radius:6px;color:var(--muted);white-space:nowrap}",
    ".tabs button[aria-selected=true]{background:var(--rule);color:var(--fg)}",
    ".subs{display:flex;flex-wrap:wrap;gap:4px;padding:6px 12px;border-bottom:1px solid var(--rule)}",
    ".subs[hidden]{display:none}",
    ".subs button{font:11px 'Geist Mono',ui-monospace,monospace;padding:4px 8px;border-radius:6px;color:var(--muted)}",
    ".subs button[aria-pressed=true]{color:var(--fg);box-shadow:inset 0 0 0 1px var(--rule)}",
    "pre{margin:0;flex:1;overflow:auto;padding:16px 20px;font:12.5px/1.6 'Geist Mono',ui-monospace,monospace;white-space:pre-wrap;word-break:break-word}"
  ].join("\n");

  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';

  function promotedId(reg) {
    if (reg.pinned) return reg.pinned;
    var ok = (reg.models || []).filter(function (m) { return m.status === "ok" && m.id.charAt(0) !== "_"; });
    ok.sort(function (a, b) {
      return (b.order || 0) - (a.order || 0) || (b.builtOn || "").localeCompare(a.builtOn || "");
    });
    return ok.length ? ok[0].id : null;
  }

  class OzTopbar extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      var OZ = window.OZ;
      if (!OZ) { console.error("<oz-topbar> needs /shared/core.js loaded first"); return; }
      this.setAttribute("role", "banner");
      var sr = this.attachShadow({ mode: "open" });
      sr.innerHTML =
        "<style>" + CSS + "</style>" +
        '<div class="bar">' +
          '<a class="home" href="/"><span>ozsert.com</span></a>' +
          '<div class="right">' +
            '<div class="lang mono" role="group"><button data-l="tr">TR</button><button data-l="en">EN</button></div>' +
            '<button class="icon theme" type="button"></button>' +
            '<div class="model desk"></div>' +
            '<button class="specs mono desk" type="button"></button>' +
          "</div>" +
        "</div>" +
        '<div class="bottom"><div class="model"></div><button class="specs mono" type="button"></button></div>' +
        '<dialog aria-labelledby="oz-specs-title"><div class="dlg">' +
          '<div class="dhead"><h2 id="oz-specs-title"></h2><button class="icon close" type="button">✕</button></div>' +
          '<div class="tabs" role="tablist"></div><div class="subs" hidden></div><pre tabindex="0"></pre>' +
        "</div></dialog>";
      this._sr = sr;
      this._tab = "content";
      this._sub = {};   // tab → chosen file, for tabs with several files (projects, prompt)
      var m = location.pathname.match(/^\/projects\/([^/]+)\//);   // on a project page, open its own spec
      if (m) { this._tab = "projects"; this._sub.projects = "/specs/projects/" + m[1] + ".md"; }
      else if (/^\/talks\//.test(location.pathname)) this._tab = "talks";
      this._mdCache = {};

      var self = this;
      sr.querySelectorAll(".lang button").forEach(function (b) {
        b.addEventListener("click", function () { OZ.setLang(b.dataset.l); });
      });
      sr.querySelector(".theme").addEventListener("click", function () { OZ.toggleTheme(); });
      sr.querySelectorAll(".specs").forEach(function (b) {
        b.addEventListener("click", function () { self.openSpecs(); });
      });
      var dlg = sr.querySelector("dialog");
      sr.querySelector(".close").addEventListener("click", function () { dlg.close(); });
      dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

      ["oz:langchange", "oz:themechange", "oz:accentchange", "oz:ready"].forEach(function (ev) {
        document.addEventListener(ev, function () { self.render(); });
      });
      this.render();
      if (OZ.model) this.buildSwitcher(); else sr.querySelectorAll(".specs").forEach(function (b) { b.hidden = true; });
    }

    ui() { return UI[window.OZ.lang] || UI.en; }

    render() {
      var OZ = window.OZ, sr = this._sr, u = this.ui();
      this.setAttribute("theme", OZ.theme);
      sr.querySelector(".lang").setAttribute("aria-label", u.lang);
      sr.querySelectorAll(".lang button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.l === OZ.lang));
      });
      var th = sr.querySelector(".theme");
      th.innerHTML = OZ.theme === "dark" ? SUN : MOON;
      th.setAttribute("aria-label", u.theme);
      th.title = u.theme;
      sr.querySelectorAll(".specs").forEach(function (b) { b.textContent = "‹ " + u.specs + " /›"; });
      sr.querySelector(".close").setAttribute("aria-label", u.close);
      sr.querySelector("#oz-specs-title").textContent = u.specsTitle;
      sr.querySelectorAll(".switch label").forEach(function (l) { l.textContent = u.built; });
      var all = sr.querySelectorAll("option[value='/models/']");
      all.forEach(function (o) { o.textContent = u.all; });
      sr.querySelectorAll("option[data-latest]").forEach(function (o) { o.textContent = o.dataset.name + " · " + u.latest; });
      this.renderTabs();
    }

    buildSwitcher() {
      var OZ = window.OZ, self = this;
      OZ.models().then(function (reg) {
        var list = (reg.models || []).filter(function (m) { return m.id.charAt(0) !== "_"; }).slice();
        list.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
        var top = promotedId(reg);
        var draftMatch = location.pathname.match(/^\/history\/[^/]+\/([^/]+)\//);
        if (draftMatch) {
          // Viewing a draft from history/: list it explicitly and select it.
          var base = list.filter(function (m) { return m.id === OZ.model; })[0];
          list.push({ id: "@draft", name: (base ? base.name : OZ.model) + " · " + self.ui().draft + " " + draftMatch[1], path: location.pathname, order: 1e9 });
        } else if (!list.some(function (m) { return m.id === OZ.model; })) {
          list.push({ id: OZ.model, name: OZ.model + " (" + self.ui().unregistered + ")", path: location.pathname });
        }
        self._sr.querySelectorAll(".model").forEach(function (host, i) {
          var id = "oz-model-" + i;
          host.innerHTML = '<div class="switch"><label for="' + id + '"></label><select id="' + id + '"></select></div>';
          var sel = host.querySelector("select");
          list.forEach(function (m) {
            var o = document.createElement("option");
            o.value = m.id === top ? "/" : (m.path || "/models/" + m.id + "/");
            o.dataset.name = m.name;
            o.textContent = m.name + (m.status === "failed" ? " ✗" : "");
            if (m.id === top) o.dataset.latest = "1";
            if (draftMatch ? m.id === "@draft" : m.id === OZ.model) o.selected = true;
            sel.appendChild(o);
          });
          var all = document.createElement("option");
          all.value = "/models/";
          sel.appendChild(all);
          sel.addEventListener("change", function () { location.href = sel.value; });
        });
        self._sr.querySelector(".bottom").classList.add("on");
        self.render();
      });
    }

    renderTabs() {
      var sr = this._sr, u = this.ui(), self = this;
      var tabs = sr.querySelector(".tabs");
      tabs.innerHTML = "";
      SPECS.forEach(function (s) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", String(s[0] === self._tab));
        b.textContent = u.tabs[s[0]];
        b.addEventListener("click", function () { self._tab = s[0]; self.renderTabs(); self.loadSpec(); });
        tabs.appendChild(b);
      });
      var subs = sr.querySelector(".subs"), files = this.files();
      subs.innerHTML = "";
      subs.hidden = files.length < 2;
      if (files.length > 1) files.forEach(function (f) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-pressed", String(f === self.url()));
        b.textContent = f.split("/").pop();
        b.addEventListener("click", function () { self._sub[self._tab] = f; self.renderTabs(); self.loadSpec(); });
        subs.appendChild(b);
      });
    }

    files() {   // the spec file(s) behind the current tab
      var self = this, f = SPECS.filter(function (s) { return s[0] === self._tab; })[0][1];
      return [].concat(f);
    }

    url() {
      var files = this.files(), sub = this._sub[this._tab];
      return files.indexOf(sub) >= 0 ? sub : files[0];
    }

    openSpecs() {
      var dlg = this._sr.querySelector("dialog");
      if (!dlg.open) dlg.showModal();
      this.loadSpec();
    }

    loadSpec() {
      var self = this, pre = this._sr.querySelector("pre");
      var url = this.url();
      if (this._mdCache[url]) { pre.textContent = this._mdCache[url]; pre.scrollTop = 0; return; }
      pre.textContent = this.ui().loading;
      fetch(url).then(function (r) { return r.text(); }).then(function (txt) {
        self._mdCache[url] = txt;
        if (self.url() === url) { pre.textContent = txt; pre.scrollTop = 0; }
      });
    }
  }

  customElements.define("oz-topbar", OzTopbar);
})();
