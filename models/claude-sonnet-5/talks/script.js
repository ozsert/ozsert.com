(function () {
  "use strict";

  var VOLS = [
    { n: 1, key: "talks.vol1.title", talks: ["industrial-revolution-internet-ai", "solopreneurship", "ai-agent-organizations", "corporate-memory"] },
    { n: 2, key: "talks.vol2.title", talks: ["ai-in-finance", "retail-silent-revolution", "ai-logistics-traceability", "next-gen-ecommerce"] },
    { n: 3, key: "talks.vol3.title", talks: ["new-role-of-humans", "ai-software-development", "ai-customer-experience", "ai-design-creativity"] }
  ];

  // structural slugs, order and membership defined in specs/talks.md — not translated copy
  var FEATURED = ["solopreneurship", "ai-agent-organizations", "ai-logistics-traceability", "ai-software-development"];

  var TOGGLE_SVG =
    '<svg viewBox="0 0 22 22" aria-hidden="true"><path d="M11 3v16M3 11h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';

  var STAR_SVG =
    '<svg class="tk-card-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.4 6.9.5-5.3 4.5 1.7 6.7L12 16.6 6.1 20.1l1.7-6.7-5.3-4.5 6.9-.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  function splitKicker(key) {
    var text = OZ.t(key);
    var i = text.indexOf(" - ");
    if (i < 0) return { kicker: "", title: text };
    return { kicker: text.slice(0, i), title: text.slice(i + 3) };
  }

  function splitLead(text) {
    var i = text.indexOf(":");
    if (i < 0) return { lead: "", rest: text };
    return { lead: text.slice(0, i), rest: text.slice(i + 1).trim() };
  }

  function buildCard(slug, vol, idx) {
    var title = OZ.t("talk." + slug + ".title");
    var subtitle = OZ.t("talk." + slug + ".subtitle");
    var summary = OZ.t("talk." + slug + ".summary");
    var image = OZ.t("talk." + slug + ".image");
    var invite = OZ.t("talks.invite");
    var mail = "mailto:" + OZ.email() + "?subject=" + encodeURIComponent(title);
    var featured = FEATURED.indexOf(slug) >= 0;

    var keys = ["k1", "k2", "k3", "k4"].map(function (k) {
      var raw = OZ.t("talk." + slug + "." + k);
      var parts = splitLead(raw);
      return "<li><strong>" + parts.lead + ":</strong> " + parts.rest + "</li>";
    }).join("");

    return (
      '<article class="tk-card" id="' + slug + '">' +
        '<details class="tk-details">' +
          '<summary class="tk-card-front">' +
            '<span class="tk-card-tab mono">' + vol + "." + idx + "</span>" +
            (featured ? STAR_SVG : "") +
            '<img class="tk-card-img" src="' + image + '" width="300" height="400" loading="lazy" alt="' + title.replace(/"/g, "&quot;") + '">' +
            '<span class="tk-card-title">' + title + "</span>" +
            '<span class="tk-card-subtitle">' + subtitle + "</span>" +
            '<span class="tk-card-summary">' + summary + "</span>" +
            '<span class="tk-card-toggle">' + TOGGLE_SVG + "</span>" +
          "</summary>" +
          '<div class="tk-card-unfold">' +
            '<ul class="tk-card-keys">' + keys + "</ul>" +
            '<a class="tk-invite" href="' + mail + '">' + invite + " →</a>" +
          "</div>" +
        "</details>" +
      "</article>"
    );
  }

  function openSlugs() {
    return Array.prototype.map.call(
      document.querySelectorAll(".tk-details[open]"),
      function (d) { return d.closest(".tk-card").id; }
    );
  }

  function render() {
    var main = document.querySelector(".tk-main");
    var wasOpen = openSlugs();

    // hero title, period-as-dot
    var titleEl = document.querySelector('[data-slot="title-dot"]');
    var titleText = OZ.t("talks.title");
    titleEl.textContent = titleText.replace(/\.\s*$/, "");

    // hero figure: Vol.N labels + aria title
    document.querySelectorAll('[data-slot="vol-label"]').forEach(function (el) {
      el.textContent = OZ.t("ui.vol") + " " + el.dataset.n;
    });
    document.querySelectorAll("[data-vol-aria]").forEach(function (a) {
      a.setAttribute("aria-label", OZ.t("ui.vol") + " " + a.dataset.volAria);
    });
    var heroFigTitle = document.querySelector('[data-slot="hero-fig-title"]');
    if (heroFigTitle) {
      heroFigTitle.textContent = [1, 2, 3].map(function (n) { return OZ.t("ui.vol") + " " + n; }).join(" → ");
    }
    var heroCap = document.querySelector('.tk-fig--hero [data-slot="fig-cap"]');
    if (heroCap) {
      heroCap.textContent = OZ.t("ui.fig") + " 1 — " + [1, 2, 3].map(function (n) { return OZ.t("ui.vol") + " " + n; }).join(" → ");
    }

    // volumes
    VOLS.forEach(function (v) {
      var parts = splitKicker(v.key);
      var kickerEl = document.querySelector('[data-slot="kicker"][data-n="' + v.n + '"]');
      if (kickerEl) kickerEl.textContent = parts.kicker;
      var titleEl2 = document.querySelector('[data-slot="vol-title"][data-n="' + v.n + '"]');
      if (titleEl2) titleEl2.textContent = parts.title;
      var figTitleEl = document.querySelector('[data-slot="vol-fig-title"][data-n="' + v.n + '"]');
      if (figTitleEl) figTitleEl.textContent = parts.title;
      var figCapEl = document.querySelector('.tk-vol--' + v.n + ' [data-slot="fig-cap"]');
      if (figCapEl) figCapEl.textContent = OZ.t("ui.fig") + " " + (v.n + 1) + " — " + parts.title;

      var host = document.querySelector('[data-vol-cards="' + v.n + '"]');
      if (host) {
        host.innerHTML = v.talks.map(function (slug, i) { return buildCard(slug, v.n, i + 1); }).join("");
      }
    });

    // restore open cards
    wasOpen.forEach(function (slug) {
      var el = document.getElementById(slug);
      if (el) {
        var d = el.querySelector(".tk-details");
        if (d) d.open = true;
      }
    });

    // closing CTA mailto + credit
    var ctaLink = document.querySelector('[data-slot="cta-link"]');
    if (ctaLink) ctaLink.href = "mailto:" + OZ.email();
    var credit = document.querySelector('[data-slot="credit"]');
    if (credit) credit.textContent = OZ.t("ui.credit").replace("{model}", "Claude Sonnet 5");

    openFromHash();
  }

  function openFromHash() {
    var id = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el || !el.classList || !el.classList.contains("tk-card")) return;
    var d = el.querySelector(".tk-details");
    if (d) d.open = true;
    el.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  window.OZ.ready.then(function () {
    render();
    document.addEventListener("oz:langchange", render);
    window.addEventListener("hashchange", openFromHash);
  });
})();
