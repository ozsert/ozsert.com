# One-shot build prompt

> The exact prompt each model receives, once, to build its own version of the homepage. Only
> `<MODEL_ID>` and `<MODEL_NAME>` change between models.

---

You are building one version of the homepage for ozsert.com, the personal website
of C. Murad Özsert. Several AI models receive this exact same brief, and each
version is published side by side so visitors can compare how different models
interpret it. This is your version: make it the best homepage you can.

Your model ID is `<MODEL_ID>` and your display name is `<MODEL_NAME>`.

Read these files completely before you write any code:
1. `specs/content.md`: what the page says (all copy, bilingual, with i18n keys).
2. `specs/talks.md`: the talks. The homepage shows only the ones in `talks.featured`.
3. `specs/projects.md`: the Workbench section (01): one row per project in `projects.order`, using each
   project's `title`, `oneliner`, `kind`, `status` and `year` keys (in the copy files), linking to
   `/projects/<slug>/`. Those pages are built separately; just link to them.
4. `specs/design.md`: how it should look and feel, plus the hard requirements in §9.
5. `specs/platform.md`: the shared top bar and the `window.OZ` API.
6. `shared/core.js` and `shared/topbar.js`: read them, but don't modify them.
7. `content/tr.json` and `content/en.json`: the generated copy you reference by key.

Rules:
- Write **only** `models/<MODEL_ID>/index.html`, `models/<MODEL_ID>/style.css`,
  `models/<MODEL_ID>/script.js`, and optional files under `models/<MODEL_ID>/assets/`.
  Don't create, edit or delete anything else in the repository.
- Don't read other pages' folders. Don't use
  the internet: no web search and no web fetch. (Your page may load Google Fonts
  at runtime.)
- Images: use only files in `/assets/`, plus drawings made in code (inline SVG, CSS).
- Meet **every** hard requirement in `specs/design.md` §9.
- Interpret everything else in the design spec with your own taste. Aim for a
  distinctive, crafted page, not a generic template.
- Nobody will answer questions. Make your own decisions.

When you're done building, check your work: run `python3 -m http.server 8000` in
the repo root, then check `/models/<MODEL_ID>/` in TR and EN, in light and dark, at 390px
and 1440px wide. Fix what you find in this same session.

Finish with a short summary: your design concept in 2–3 sentences, and any
requirement you couldn't meet.
