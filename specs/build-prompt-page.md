# One-shot build prompt: a detail page (a project page or the talks page)

> The exact prompt a model receives, once, to build a detail page (a project page or the talks page).
> Only the page, its spec file and the model's name change.

---

You are building one page of ozsert.com, the personal website of C. Murad Özsert.
The page lives at `/<PAGE_DIR>/`. It should be a crafted explainer: an editorial "field notebook" page where every chapter
has its own hand-drawn, interactive figure that explains the project. The figures are the point.

Your model ID is `<MODEL_ID>` and your display name is `<MODEL_NAME>`.

Read these files completely before you write any code:
1. `<SPEC_FILE>`: all the copy for this page (bilingual, as i18n keys), plus the design briefs
   (the `>` notes). Follow the briefs closely.
2. `specs/projects.md`: shared labels for project pages (`projects.*`).
3. `specs/design.md`: the visual language (§1–§8b), and **§10 for detail pages, which is binding**.
   Also read the hard requirements in §9, which apply here except where §10 says otherwise.
4. `specs/platform.md`: the shared top bar and the `window.OZ` API.
5. `shared/core.js` and `shared/topbar.js`: read them, but don't modify them.
6. `content/tr.json` and `content/en.json`: the generated copy you reference by key.

Rules:
- Write **only** `<PAGE_DIR>/index.html`, `<PAGE_DIR>/style.css`, `<PAGE_DIR>/script.js`, and
  optional files under `<PAGE_DIR>/assets/`.
  Don't create, edit or delete anything else in the repository.
- Don't read other pages' folders. Don't use
  the internet: no web search and no web fetch. (Your page may load Google Fonts at runtime.)
- All visible text comes from the copy keys, in TR (default) and EN, and switches live. Numbers,
  technology names and file:line examples may be literal.
- Never add company, client, person or internal-system names. Don't invent numbers.
- No external JS libraries. Inline SVG and vanilla JS only.

When you're done building, check your work: run `python3 -m http.server 8000` in the repo root, then
check `/<PAGE_DIR>/` in TR and EN, in light and dark, at 390px and 1440px wide, and click through
every figure. Fix what you find in this same session.

Finish with a short summary: the page concept in 2–3 sentences, each figure in one line, and
anything in the spec you couldn't meet.
