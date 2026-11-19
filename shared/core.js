/*!
 * ozsert.com — shared core (window.OZ)
 * Shared by every model version and the shared pages. Do not modify from a version.
 *
 * Load it NOT deferred, in <head>:  <script src="/shared/core.js"></script>
 * It sets <html lang|data-theme|data-accent> immediately (no flash), then loads
 * the copy for the current language and fills [data-i18n] elements.
 *
 * API
 *   OZ.ready                 Promise, resolves once the copy is loaded and applied
 *   OZ.lang                  "tr" | "en"            OZ.setLang(lang)
 *   OZ.t(key)                copy string for the current language ("" + console warning if missing)
 *   OZ.apply(root?)          (re)fill [data-i18n] under root (default: document)
 *   OZ.theme                 "light" | "dark" (resolved)   OZ.themePref: "system" | "light" | "dark"
 *   OZ.setTheme(pref)        "system" | "light" | "dark"   OZ.toggleTheme()
 *   OZ.accent                accent id                     OZ.setAccent(id)
 *   OZ.accents               [{ id, name:{tr,en}, light, dark }]  (hex values for swatches)
 *   OZ.email()               "hello@ozsert.com", built from copy parts (anti-scraping)
 *   OZ.latestPosts(n)        Promise<[{ title, link, date, excerpt, image }]> from the Substack feed (image = cover URL or null)
 *   OZ.models()              Promise<registry> (content/models.json)
 *   OZ.model                 this page's model id (from <meta name="oz-model">) or null
 *   OZ.isRoot                true when this page is the promoted copy at "/"
 *
 * [data-i18n] syntax (";"-separated for several):
 *   data-i18n="hero.headline"              → textContent
 *   data-i18n="[html]hero.role"            → innerHTML (copy is trusted, authored by Murad)
 *   data-i18n="[aria-label]talks.all"      → any attribute
 *   data-oz-email                          → text = address, href = mailto: (on <a>)
 *
 * Events on document: oz:ready, oz:langchange, oz:themechange, oz:accentchange
 *   (event.detail = { lang } | { theme, pref } | { accent })
 */
(function () {
  "use strict";
  var root = document.documentElement;
  var LANGS = ["tr", "en"];
  var DEFAULT_LANG = "tr";
  var FEED = "https://thenextsignalnewsletter.substack.com/feed";
  var RSS_API = "https://api.rss2json.com/v1/api.json?rss_url=";

  var ACCENTS = [
    { id: "bosphorus", name: { tr: "Boğaz", en: "Bosphorus" }, light: "#1F5F8B", dark: "#7CB8E0" },
    { id: "tulip",     name: { tr: "Lale",  en: "Tulip" },     light: "#B3261E", dark: "#F08A80" },
    { id: "iznik",     name: { tr: "İznik", en: "İznik" },     light: "#00797A", dark: "#5FD0CC" },
    { id: "galata",    name: { tr: "Galata", en: "Galata" },   light: "#A4512A", dark: "#F0A37A" },
    { id: "saffron",   name: { tr: "Safran", en: "Saffron" },  light: "#8A6100", dark: "#F0C24A" },
    { id: "olive",     name: { tr: "Zeytin", en: "Olive" },    light: "#4F6B2A", dark: "#A9C97A" }
  ];

  // ---- storage (never throws) -------------------------------------------
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function emit(name, detail) { document.dispatchEvent(new CustomEvent(name, { detail: detail })); }

  // ---- initial state, applied synchronously -----------------------------
  var params = new URLSearchParams(location.search);
  var lang = params.get("lang") || load("oz-lang") || DEFAULT_LANG;
  if (LANGS.indexOf(lang) < 0) lang = DEFAULT_LANG;

  var themePref = load("oz-theme") || "system";
  var forcedTheme = params.get("theme"); // ?theme=light|dark (screenshots/sharing; not saved)
  if (forcedTheme === "light" || forcedTheme === "dark") themePref = forcedTheme;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function resolveTheme() { return themePref === "system" ? (mq && mq.matches ? "dark" : "light") : themePref; }

  var accent = params.get("accent") || load("oz-accent") || ACCENTS[0].id; // ?accent= for screenshots (not saved)
  if (!ACCENTS.some(function (a) { return a.id === accent; })) accent = ACCENTS[0].id;

  function paint() {
    var theme = resolveTheme();
    root.lang = lang;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-accent", accent);
    root.style.colorScheme = theme;
    var a = ACCENTS.filter(function (x) { return x.id === accent; })[0];
    root.style.setProperty("--oz-accent", theme === "dark" ? a.dark : a.light); // convenience token
  }
  paint();

  var metaModel = document.querySelector('meta[name="oz-model"]');
  var metaRoot = document.querySelector('meta[name="oz-root"]');

  // ---- copy ---------------------------------------------------------------
  var dict = {};
  var cache = {};
  function fetchLang(l) {
    if (cache[l]) return cache[l];
    cache[l] = fetch("/content/" + l + ".json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .catch(function (e) { console.error("[OZ] could not load copy for " + l, e); return {}; });
    return cache[l];
  }

  function t(key) {
    if (key in dict) return dict[key];
    console.warn("[OZ] missing copy key: " + key);
    return "";
  }

  function apply(scope) {
    scope = scope || document;
    var nodes = scope.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.getAttribute("data-i18n").split(";").forEach(function (spec) {
        spec = spec.trim();
        if (!spec) return;
        var m = spec.match(/^\[([^\]]+)\](.+)$/);
        if (!m) { el.textContent = t(spec); return; }
        if (m[1] === "html") el.innerHTML = t(m[2]);
        else el.setAttribute(m[1], t(m[2]));
      });
    }
    var mails = scope.querySelectorAll("[data-oz-email]");
    for (var j = 0; j < mails.length; j++) {
      var addr = email();
      if (!mails[j].hasAttribute("data-i18n")) mails[j].textContent = addr;
      if (mails[j].tagName === "A") mails[j].href = "mailto:" + addr;
    }
    var title = dict["meta.title"];
    if (title && !document.querySelector("[data-oz-keep-title]")) document.title = title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc && dict["meta.description"]) desc.setAttribute("content", dict["meta.description"]);
  }

  function domReady() {
    return new Promise(function (res) {
      if (document.readyState !== "loading") res();
      else document.addEventListener("DOMContentLoaded", res, { once: true });
    });
  }

  function setLang(l) {
    if (LANGS.indexOf(l) < 0 || l === OZ.lang && OZ._loaded) return Promise.resolve();
    lang = l; OZ.lang = l; save("oz-lang", l); paint();
    return fetchLang(l).then(function (d) {
      dict = d; apply(); emit("oz:langchange", { lang: l });
    });
  }

  // ---- theme / accent -------------------------------------------------------
  function setTheme(pref) {
    if (["system", "light", "dark"].indexOf(pref) < 0) return;
    themePref = pref; save("oz-theme", pref); paint();
    OZ.themePref = pref; OZ.theme = resolveTheme();
    emit("oz:themechange", { theme: OZ.theme, pref: pref });
  }
  if (mq && mq.addEventListener) mq.addEventListener("change", function () {
    if (themePref === "system") setTheme("system");
  });

  function setAccent(id) {
    if (!ACCENTS.some(function (a) { return a.id === id; })) return;
    accent = id; OZ.accent = id; save("oz-accent", id); paint();
    emit("oz:accentchange", { accent: id });
  }

  // ---- email ----------------------------------------------------------------
  function email() {
    var u = dict["footer.email_user"] || "hello";
    var d = dict["footer.email_domain"] || "ozsert.com";
    return u + "@" + d;
  }

  // ---- newsletter -------------------------------------------------------------
  function strip(html) {
    var div = document.createElement("div");
    div.innerHTML = html || "";
    return (div.textContent || "").replace(/\s+/g, " ").trim();
  }
  function latestPosts(n) {
    n = n || 3;
    var KEY = "oz-posts-v2";
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (c && Date.now() - c.at < 30 * 60 * 1000) return Promise.resolve(c.items.slice(0, n));
    } catch (e) {}
    return fetch(RSS_API + encodeURIComponent(FEED))
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) {
        if (data.status !== "ok" || !data.items) throw new Error("feed error");
        var items = data.items.map(function (it) {
          var text = strip(it.description || it.content);
          var img = (it.enclosure && it.enclosure.link) || it.thumbnail ||
            (((it.content || "").match(/<img[^>]+src="([^"]+)"/) || [])[1]) || null;
          return {
            image: img,
            title: strip(it.title),
            link: it.link,
            date: (it.pubDate || "").replace(" ", "T"),
            excerpt: text.length > 180 ? text.slice(0, 177).replace(/\s+\S*$/, "") + "…" : text
          };
        });
        try { sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), items: items })); } catch (e) {}
        return items.slice(0, n);
      });
  }

  // ---- registry ---------------------------------------------------------------
  var modelsP = null;
  function models() {
    if (!modelsP) modelsP = fetch("/content/models.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .catch(function () { return { pinned: null, models: [] }; });
    return modelsP;
  }

  // ---- public object ----------------------------------------------------------
  var OZ = window.OZ = {
    lang: lang,
    theme: resolveTheme(),
    themePref: themePref,
    accent: accent,
    accents: ACCENTS,
    model: metaModel ? metaModel.getAttribute("content") : null,
    isRoot: !!metaRoot,
    t: t,
    apply: apply,
    setLang: setLang,
    setTheme: setTheme,
    toggleTheme: function () { setTheme(resolveTheme() === "dark" ? "light" : "dark"); },
    setAccent: setAccent,
    email: email,
    latestPosts: latestPosts,
    models: models,
    _loaded: false
  };

  OZ.ready = Promise.all([fetchLang(lang), domReady()]).then(function (r) {
    dict = r[0];
    OZ._loaded = true;
    apply();
    emit("oz:ready", { lang: lang });
    return OZ;
  });
})();
