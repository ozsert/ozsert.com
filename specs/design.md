# Design spec — ozsert.com homepage

> **Role of this file:** HOW the homepage should look, feel and behave.
> Content lives in `content.md`. The shared top bar and the `window.OZ` API are in `platform.md`.
> Sections 1–8 are **direction**: interpret them freely. Section 9 lists
> **hard requirements**: every version must meet them.

---

## 1. Concept: "Murad's field notebook"

> **Style name: Field Notebook (Saha Defteri).** An editorial, hand-annotated engineer's notebook:
> warm paper with a dot or graph grid, big confident type, mono metadata, ink-coloured accents, hand-drawn
> SVG lines (underlines, circles, arrows, margin notes), numbered figures, and interactive explainers.

The page should feel like a well-kept engineering notebook from someone who has
built a startup, sat in enterprise boardrooms, and now explains AI on stage.
**Editorial, not corporate. Authored, not templated.** It should be
professional enough for a bank's CTO and personal enough that it obviously
belongs to one person.

Keywords: *warm paper · grid · ink · margin notes · signal · on the road · Istanbul*.

**Fidelity target:** the anatomy in §8b, at its level of craft, with Murad's identity: the Istanbul
palette, 📡, the Bosphorus and his content.

Recurring motifs you can pick from (use some, not all):
- **Signal:** radio waves, a waveform, a frequency dial, a 📡 mark.
  A signal emerging from noise is a natural hero device.
- **Road (Yolda):** a hand-drawn route line that connects the sections, with
  stops as milestones in the experience timeline.
- **Istanbul:** the Bosphorus as a single flowing line, a sketched bridge,
  İznik-tile geometry used *very* sparingly as an ornament.
- **Annotations:** underlines, circles, arrows, stars, marginalia, tape on photos.

## 2. Surfaces and colour

Use theme-aware CSS variables for **all** surfaces and text. The values below are
guidance; tune them, but keep the character.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `--paper` | `#FBF8F1` | `#16130F` | warm off-white / warm near-black |
| `--card` | `#FEFCF7` | `#1D1915` | slightly lifted |
| `--fg` | `#1A1714` | `#ECE7DE` | body ink |
| `--fg-muted` | `#6A615B` | `#B0AAA3` | ≥ 4.5:1 on paper |
| `--rule` | `rgba(123,112,94,.22)` | `rgba(229,221,208,.10)` | borders, rules |
| `--grid` | `rgba(78,119,144,.10)` | `rgba(159,196,218,.06)` | notebook grid lines |
| `--grain` | opacity `.06` | opacity `.07` | SVG noise overlay; must not move on scroll |

### Accent palette: Istanbul (picker; default = **Bosphorus**)
`html[data-accent="<id>"]` is set by `shared/core.js`. Each accent defines
`--ink` (text-safe, ≥ 4.5:1 on paper) and may define a softer `--ink-wash`.

| id | Name (TR / EN) | Light `--ink` | Dark `--ink` |
|---|---|---|---|
| `bosphorus` | Boğaz / Bosphorus | `#1F5F8B` | `#7CB8E0` |
| `tulip` | Lale / Tulip | `#B3261E` | `#F08A80` |
| `iznik` | İznik / İznik | `#00797A` | `#5FD0CC` |
| `galata` | Galata / Galata | `#A4512A` | `#F0A37A` |
| `saffron` | Safran / Saffron | `#8A6100` | `#F0C24A` |
| `olive` | Zeytin / Olive | `#4F6B2A` | `#A9C97A` |

> Contrast must be verified for each version. These hexes are a starting point.

The accent picker belongs to the **version** (its placement and look are your
call), but it must call `OZ.setAccent(id)` and show the names in both languages.

## 3. Typography

- **Geist Sans** for headings and body text, and **Geist Mono** for metadata (dates,
  years, section numbers, labels, handles, the stat units). Load both from Google
  Fonts with the `latin-ext` subset. **Turkish glyphs (ğ ş ı İ ç ö ü) must render
  in both.**
- No other font families. A "handwritten" feel must come from **SVG strokes**, not
  a script font.
- The hero headline should be large and confident (clamp roughly 44px → 104px),
  with tight letter-spacing and a measured line length.
- Body text 17–19px, line-height ~1.6, measure ≤ 70ch.
- Section numbers in mono (`01`, `02`…), with labels in small caps or uppercase mono.
- Turkish strings run ~15–25% longer than English. Layouts must not break when the
  language is switched.

## 4. Layout

- Content starts **below the 40px shared top bar**. Do not build your own site header.
- Spacious hero: headline, role line, manifesto, CTAs, portrait, and a margin note.
- The now strip is compact and horizontal on desktop and wraps on mobile. It can
  feel like a ticker or a status line. Turkish is the longest language here, so
  at 1440px it should fit on one line in **both** TR and EN (check TR first).
- **01 Workbench (`#projects`):** list rows (§8b): number, title, one-liner, a rotated
  stamp with the kind (Enterprise / Personal), the status in mono, and → to `/projects/<slug>/`. The
  whole row is the link. Make clear these open detail pages (hover state, arrow movement).
- **02 Founder's road (`#founder`):** 4 Yolda.com case cards on graph paper where the **stat is the
  hero** of each card (big, accent ink, mono units), each with a tiny bespoke chart. No click-through.
  Visually linked to the Yolda segment of the experience timeline.
- **Talks:** only the **4 featured talks** (`talks.featured`). Use the list-row pattern
  "Selected work" row pattern (number, title, subtitle, a rotated `VOL.1` stamp, →)
  or tactile index cards. Each links to `/talks/#<slug>`, followed by an
  "All 12 talks →" link to `/talks/`. No slider, carousel or modal.
- **Newsletter:** shows real live posts (`OZ.latestPosts(3)`). It should feel like
  a clipping or a dispatch. Both subscribe buttons must be prominent.
- **Hover pictures (talks AND newsletter, same behaviour):** on desktop, hovering
  or focusing a talk row or an issue reveals its picture: a small taped photo that
  appears near the row or follows the cursor, slightly rotated, with a quick fade
  or scale. Talk picture: `talk.<slug>.image`. Issue picture: `post.image` (the
  cover from Substack; skip it if `null`). On touch and with reduced motion, show a
  small static thumbnail in the row instead. The pictures must never hide the text
  being read or cause layout shift.
- **Experience:** a compact timeline (road or route metaphor encouraged), with
  years in mono.
- **Footer:** name, identity line, contact links with mono handles, signoff.
- Grids collapse to one column below ~720px. No horizontal page scroll at 360px.

## 5. Imagery

- Portrait: `/assets/portrait-upper.jpg` (960×1200, 4:5, head to waist): **use this for the portrait
  card**, so the face reads at card size. `/assets/portrait.jpg` (1200×1800) is the full-length shot, only for
  tall layouts; `About_1.jpg`–`About_4.jpg` (1024×1536) are extra photos. Don't use `Main_1.jpg` (3840px original). Treat the portrait as
  something placed in the notebook: tape, a slight rotation, a sketched frame,
  a duotone in the accent colour. Always set width and height and use `loading="lazy"` below the fold.
- Talk images exist (`/assets/Topics_1.1.jpeg` … `Topics_3.4.jpeg`, mapping
  vol.topic → `Topics_<vol>.<topic>.jpeg`). Use them optionally.
- All linework (underlines, arrows, routes, waves) is **inline SVG**, drawn with
  `stroke-dasharray` animation where animated.

## 6. Motion and interaction

- Section reveals use IntersectionObserver with subtle "ink drawing" strokes.
- Hover: cards lift or straighten slightly, and links get a hand-drawn underline.
- An optional desktop-only cursor flourish (e.g. a faint ink trail). It must not
  hide the system cursor's position and must be disabled on touch.
- **`prefers-reduced-motion: reduce` disables all non-essential motion.**
- The hero CTAs scroll smoothly to `#projects`, `#talks` and `#newsletter`.

## 7. Theme

Light and dark are both first-class. `shared/core.js` sets `html[data-theme]`.
Style both themes from tokens. No hard-coded white, black or hex values on core
surfaces or text. Grain, grid and accent all need values for both themes.

## 8. Voice of the UI

UI micro-copy (labels, loading and empty states) comes from `content.md`. Keep it
human and a little personal ("Couldn't load posts right now — read them on
Substack."), never robotic.

---

## 8b. Page anatomy: the notebook language

> The target is **this level of craft and this visual vocabulary**, carried by Murad's content,
> Istanbul and the "signal" theme.

**Page skeleton.** Warm paper background (~`#F6F1E9`) with a faint **dot grid**
and grain. A wide left margin holds the **section number** (`01`) in mono. The
content column is indented from the headline, like a notebook margin. Lots of air:
each section is close to a full viewport tall.

**Hero**
- A mono kicker row, letter-spaced uppercase. Left: `FIELD NOTES, 2026`.
  Right: `ISTANBUL · 41.01° N, 28.98° E`.
- A **huge two-line headline** (~120px desktop, tight tracking). The final period
  is a **filled accent dot**, and a **hand-drawn accent underline** sweeps under the last line.
- The role sentence is set large (~24px), with key nouns in **accent ink on a soft
  highlighter wash**. Below it, a mono `PREVIOUSLY` label inline with muted text.
- The manifesto has one word **circled by hand** in accent, with a **curved arrow**
  running to a **mono margin note** in the right column (`hero.margin_note`).
- The right column has a `CONTENTS` table of contents: mono numbers and section names,
  linking to anchors.
- CTAs: a primary solid-accent button with an **offset sketched double border**,
  and a secondary text link with an underline and ↓.
- The `INK` picker (accent dots, the current one ringed, its name below) plus mono
  toggles such as `PEN TRAIL ON · CALM MOTION OFF`.
- A **full-width single-line SVG drawing** with a mono
  caption `fig. 1 — …`. **Ours changes with the accent colour:** each Istanbul
  accent has its own scene, drawn in that accent's ink. The picker chooses a colour
  *and* a place:

  | Accent | fig. 1 scene | Caption key |
  |---|---|---|
  | `bosphorus` | The Bosphorus Bridge spanning two continents, water, a ferry | `hero.fig.bosphorus` |
  | `galata` | Galata Tower over the Karaköy / Golden Horn skyline | `hero.fig.galata` |
  | `iznik` | An İznik tile pattern: tulip, carnation and rumi motifs in a repeating border | `hero.fig.iznik` |
  | `tulip` | Istanbul tulips in bloom (Emirgan in April), a row of tulip stems | `hero.fig.tulip` |
  | `saffron` | The Spice Bazaar: domes, arches, piles of spice | `hero.fig.saffron` |
  | `olive` | An olive branch and tree, leaves and fruit | `hero.fig.olive` |

  All six are the same size, single-line style and figure number, so the layout never jumps.

**Now strip.** Hand-drawn rule above. A mono `NOW` label, then items separated by
`/`. A **blinking block cursor** after the first item, and the last item is a link with →.

**Section header pattern (repeat for every section).** `§ 01 — FIELD WORK` in
mono, then a big title with **one phrase underlined by hand** (straight, wavy or
dashed: vary it per section).

**List rows (for workbench projects, talks or newsletter issues).** A mono
number, a title, a muted one-line description, a **rubber-stamp tag** (accent
outline, mono caps, slightly rotated) and an → at the right. Rows are separated by
**hand-drawn, slightly wobbly rules**.

**Small figures.** Notebook-paper mini cards with an SVG diagram and a mono caption
`fig. 2 — intuition → understanding`. Figures are numbered through the page.
That's a signature device: keep it.

**Case cards (`#founder`, the Yolda.com cards).** A 2×2 grid. Each card is
**graph paper** with **masking tape** at the top and a sketched double border. The
header reads `CASE 01` with `View project →`. A **giant stat** sits with a **tiny
bespoke data-viz** under it (a before value struck through → an after value circled; a dot
matrix; a growth curve; a route line). A rotated stamp sits next to the section intro.
**Ours:** `0 → €11M` growth curve · `3×` lower cost with a TR→DE route line · `$10M+` raised
in three rounds (three steps) · `1,100+` enterprises as a dot matrix. Stamp: `YOLDA.COM · 2020–2025`.

**Experience.** Title with a hand underline ("The road so far."). A **to-scale
timeline bar** figure (`fig. 3 — 2008 → now, to scale`). Rows: org in bold,
role muted, years in mono right-aligned, the current row's `Now` **circled**, and
an → where a detail page exists. Wobbly rules between rows.

**Contact / footer.** The **name set huge** (~110px). A mono caps identity line.
"Say hello" copy. A 3-column link grid (mono label + ↗, the handle underlined, a
`COPY` action for email). Bottom row: `Made with care in 2026` · ink picker
repeated · `Back to the cover ↑`. A colophon in mono: *"Set in Geist and Geist
Mono. Every line drawn in SVG. Interpreted by <Model> from the shared spec."*

**Avoid**
- Plain white SaaS pages with gradient headlines and rounded generic cards: that's exactly the
  "before" the model timeline contrasts with.

---

## 9. Hard requirements (every version must meet all of these)

1. **Files:** only `models/<MODEL_ID>/index.html`, `style.css`, `script.js` (plus
   optional `models/<MODEL_ID>/assets/*`). Nothing else in the repo is touched.
2. **Absolute paths** for everything: `/models/<MODEL_ID>/style.css`, `/assets/…`,
   `/shared/…`. (The root page is a copy of the newest version.)
3. **Head boilerplate**, exactly this order, before your own CSS and JS:
   ```html
   <meta name="oz-model" content="<MODEL_ID>">
   <link rel="canonical" href="https://ozsert.com/">
   <script src="/shared/core.js"></script>            <!-- NOT deferred: sets theme/lang before paint -->
   <script src="/shared/topbar.js" defer></script>
   ```
   Then `<oz-topbar></oz-topbar>` as the first element in `<body>`. Run your own
   code after `OZ.ready` (a Promise) or on the `oz:ready` event.
4. **No hard-coded visible copy.** Every user-visible string uses `data-i18n` or
   `OZ.t()`. Re-render on `oz:langchange`. Default language TR. Small interface
   words are in `ui.*` (contents, ink, fig., Vol., case, copy, back to top…) and
   section labels in `<section>.label`. If a word you want has no key, design
   without it. **Allowed as literal text:** numbers, years, dates, coordinates,
   `§`, arrows and symbols, brand and product names (Yolda.com, Deka Tech,
   Substack…), handles and URLs.
   Decoration hooks: highlight the phrases in `hero.role_highlights` (`|`-separated)
   and draw a hand-drawn oval around each phrase in `hero.manifesto_circle`
   (`|`-separated; the last one gets the arrow to the margin note). Each is guaranteed to be an exact substring
   of its text in both languages, so find it with `indexOf` and don't guess.
5. **Section IDs, in this order:** `top`, `now`, `projects`, `founder`, `talks`, `newsletter`, `experience`, `contact`.
   Project rows (from `projects.order`) link to `/projects/<slug>/`.
6. **Theme and accent** through `html[data-theme]` and `html[data-accent]` only.
   Both themes have AA contrast.
7. **Email** only via `OZ.email()`. **RSS** only via `OZ.latestPosts(3)`, with
   loading and error states.
8. **Responsive** from 360px to 1920px. No horizontal scroll. On mobile (<640px),
   leave `padding-bottom: 64px` for the shared bottom bar.
9. **Accessibility:** semantic landmarks, one `<h1>`, alt text, a visible focus
   ring, keyboard-reachable controls, `prefers-reduced-motion` respected.
10. **No external JS libraries or frameworks.** Fonts from Google Fonts only.
    Vanilla JS only.
11. **CSS scoping:** prefix every class with `v-` plus a short model tag (e.g.
    `.vo55-hero`) so screenshots and diffs stay readable.
12. **Credit line** in the footer: `OZ.t("ui.credit")` with `{model}` replaced by
    your display name ("Interpreted by Claude Opus 5.5 from the shared spec.").
13. **Accent scenes:** the hero's fig. 1 drawing changes with the accent: six inline-SVG
    scenes, one per `OZ.accents` id (§8b table), each with its caption `hero.fig.<id>`.
    Swap on `oz:accentchange` with a short crossfade (instant under reduced motion),
    without layout shift. The current accent at load (`OZ.accent`) decides the first scene.

---

## 10. Detail pages: projects (`/projects/<slug>/`) and talks (`/talks/`)

> One page per project in `specs/projects/<slug>.md`: the same notebook language as the homepage, but each page is its own **explainer**
> with one signature interactive figure. Detail pages are **not** part of the multi-model
> homepage experiment. Each is built once (by default the newest model) and the page
> credits that model.

> The talks page follows the same language and rules; its own brief is at the top of `specs/talks.md`
> (volumes as chapters, talks as unfolding index cards). Everything below written for projects applies to it
> by analogy.

**Page anatomy (every project page; chapters differ per project on purpose)**
1. `projects.back` link to `/#projects`, then a mono breadcrumb:
   `projects.crumb / project.<slug>.kind / project.<slug>.status`.
2. **Hero:** a huge title (`project.<slug>.title`) with one hand-drawn underline or circle, the lead
   (`.lead`), a mono accent margin note (`.note`), and the **hero figure** (`.hero_fig` caption): an
   empty notebook-paper frame that draws itself.
3. **Facts strip:** 4 big numbers (`.stat1…stat4` with `.stat1_label…`), giant figures with mono units.
4. **Chapters** `project.<slug>.c1 … cN` (4–7 per project), in order. Each chapter has:
   - a header following the homepage pattern: section number in the margin, `§ 0N — <c.label>`, a big
     `c.title` with a hand-drawn underline on one phrase;
   - `c.body` (and `c.body2` if present);
   - a **margin note** `c.note` (mono, accent, with a small hand-drawn arrow or bracket toward the text);
   - usually **its own figure**: caption `c.fig` ("fig. N — …", numbered through the page), with every
     word inside the figure from `c.fig_*` keys (`|`-separated lists where noted). The design brief under
     each chapter in the project spec says exactly what to draw and how it behaves.
5. **Figures are the point of these pages.** Each one is a small explainer, not decoration: a stepper
   (01 02 03 04 tabs plus "next"), tabs, toggles, hover or focus details, or a scroll-driven drawing
   (a sticky figure beside scrolling text). Hand-inked SVG on
   notebook or graph paper, accent ink for the important thing, mono labels. Every interaction works
   with keyboard and touch; under reduced motion figures show their final state.
6. **Stack** row: `projects.stack_label` + mono tags (`.stack`, comma-separated); `.link` / `.link_label`
   as a button if present.
7. Footer: `projects.back`, plus `projects.credit` with `{model}` replaced by the building model.

**Rules (hard, same as the homepage unless stated):**
- Files: only `projects/<slug>/index.html`, `style.css`, `script.js` (plus optional `assets/`). Absolute
  paths (`/projects/<slug>/style.css`).
- Head boilerplate: `<meta name="oz-page" content="<slug>">`,
  `<link rel="canonical" href="https://ozsert.com/projects/<slug>/">`, `/shared/core.js` (not
  deferred), `/shared/topbar.js` (deferred), `<oz-topbar>` first in `<body>`. No `oz-model` meta:
  the model switcher doesn't appear on detail pages.
- All visible copy via `data-i18n` / `OZ.t()` (keys `project.<slug>.*`, `projects.*`, `ui.*`).
  Numbers, product and technology names may be literal.
- **Never name a company, client, person or internal system.** The specs are already anonymized.
  Don't invent names, logos or numbers either.
- Theme, accent, TR/EN, 360–1920px, reduced motion, and accessibility as in §9. No external JS
  libraries.
