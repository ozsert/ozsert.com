# CLAUDE.md

The one internal document for ozsert.com: what we're building, the decisions, the rules and the exact
processes. **Binding.** Follow the processes step by step and don't improvise variants. Never deployed;
the public part of the project is `specs/`.

## 1. What and why

ozsert.com is C. Murad Özsert's site, in English (default) and Turkish, in the **Field Notebook** style
(`specs/design.md`). It does two things:
1. **Personal site:** enterprise AI work, Yolda.com (founder's journey), talks, the newsletter, experience.
2. **Living benchmark:** several Claude models each build the site from the same public spec, one shot.
   Visitors switch versions in the top bar, and `/models/` shows quality improving over time.

Pure static site on GitHub Pages: no framework, no bundler.

## 2. Decisions

| Topic | Decision |
|---|---|
| Languages | EN default + TR; dark theme by default. All copy lives in the specs as `### key` blocks. |
| Pages | Every model has its own full site: `/models/<id>/` (homepage), `/models/<id>/talks/`, `/models/<id>/projects/<slug>/` (7). Root `/`, `/talks/`, `/projects/<slug>/` = generated copy of the pinned model. Plus `/models/` timeline, `404.html`. |
| Built by models | Homepage, talks page and project pages. Built by Claude, outside the experiment: `/models/`, 404, shared code. |
| Style | Field Notebook; Istanbul accent palette (6 colours, each with its own hero scene); signal motif. |
| Identity | No job title or employer in the hero: startups → largest enterprises. Deka Tech only in Experience/Now; clients never named. Yolda is a founder's journey: no exit or acquisition. |
| Sections | 01 Workbench (enterprise + startup projects) · 02 Founder's road (Yolda) · 03 Talks · 04 Newsletter · 05 Experience. |
| Root `/` | `pinned` in `content/models.json` (Opus 5.5), otherwise the released homepage with the highest `order`. |
| Public vs internal | `specs/` is public (deployed and shown in the specs window). This file and `tools/` are not; builds live outside the repo. |
| Fairness | Same spec, same prompt, one prompt per page, Claude Code defaults, no human edits to output. |

## 3. Lineup (`order` in `content/models.json` = release order, flagship last)

Release dates are approximate (one year before each model's earliest retirement date).

| Order | Model | Model id = `--model` | Released | Status |
|---|---|---|---|---|
| 1 | Claude Opus 4.6 | `claude-opus-4-6` | ~2026-02-05 | later, if at all |
| 2 | Claude Opus 4.7 | `claude-opus-4-7` | ~2026-04-16 | planned |
| 3 | Claude Opus 4.8 | `claude-opus-4-8` | ~2026-05-28 | planned |
| 4 | Claude Sonnet 5 | `claude-sonnet-5` | ~2026-06-30 | planned |
| 5 | Claude Opus 5 | `claude-opus-5` | ~2026-07-24 | homepage + talks live; project pages to build |
| 6 | Claude Sonnet 5.5 | `claude-sonnet-5-5` | ~2026-09-28 | homepage live; talks building |
| 7 | Claude Opus 5.5 | `claude-opus-5-5` | ~2026-09-22 | flagship, always last; live, complete; `pinned` → `/` |
| — | Claude Haiku 5.5 | `claude-haiku-5-5` | ~2026-10-07 | later, if at all |
| — | Claude Fable 5.2 | `claude-fable-5-2` | — | out of scope for now |

Build order, newest first: homepage + talks for Sonnet 5.5 → Sonnet 5 → Opus 4.8 → Opus 4.7; then project pages
for every model (Opus 5 first). New models get `released` (`YYYY-MM`) in the registry; the timeline shows it.

Dropped: Sonnet 4.5 and Opus 4.5 (not available in Claude Code). Rival labs are out of scope. Never fake a model.

## 4. Map

| Path | What | Who changes it |
|---|---|---|
| `specs/content.md`, `specs/talks.md` | Homepage copy and the 12 talks (+ talks page brief), TR + EN | Murad / Claude on request |
| `specs/projects.md`, `specs/projects/<slug>.md` | Workbench rows + project page chapters and figure briefs | Murad / Claude on request |
| `specs/design.md` | Field Notebook style + hard requirements (§9 homepage, §10 detail pages) | Claude, only before a spec freeze |
| `specs/platform.md` | The shared top bar and the `window.OZ` API | Claude, only before a spec freeze |
| `specs/build-prompt.md`, `specs/build-prompt-page.md` | The exact prompts the models get | Claude, only before a spec freeze |
| `shared/` | `core.js` (`window.OZ`), `topbar.js`, `house.css` (shared pages only) | Claude; builds use the `spec-v1` copy, so site-only fixes are fine, API changes are not |
| `content/tr.json`, `content/en.json` | **Generated** from the specs | never by hand |
| `content/models.json` | Model registry (`order`, `status`, `release`, …) | Claude (Process 3) |
| `index.html`, `talks/`, `projects/<slug>/` (root) | **Generated** copy of the promoted model's site (`tools/promote.mjs`) | never by hand |
| `models/<id>/` (+ `talks/`, `projects/<slug>/` inside) | One model's released site; `pages` in the registry lists what it has | only `tools/release.sh` |
| `models/index.html`, `404.html` | `/models/` timeline, 404 | Claude |
| `tools/` | The scripts in §5 below. **Not deployed** | Claude |
| `../ozsert-builds/<model>_<spec>/` | **Outside the repo: one model's batch.** `_pages/<page>/repo/` = where the agent works; `site/` = input master + finished pages for review; `<page>.prompt.txt`, `.log`, `.done`, `_shots/`. Released batches → `_archive/*.tar.gz` | only `tools/build.sh` |
| `assets/` | Images (`portrait.jpg`, `About_1–4`, `Topics_<vol>.<n>.jpeg`); `assets/shots/` = timeline thumbnails of released homepages | `shots/`: only `tools/release.sh` |
| `archive/v1/` | The old site (frozen) | never |

## 5. Specs and tools

**`specs/` is the public brief: the only thing a model gets, and what visitors read in "view specs".**
It describes *what* the site says and *how* it should look, never how we run the experiment.

| Spec | Aim |
|---|---|
| `content.md` | Every homepage word, TR + EN, as `### key` blocks (+ notes on how to use them) |
| `talks.md` | The 12 talks (summary + 4 key points) and the brief for the `/talks/` page |
| `projects.md` | The Workbench section: project order, shared labels for project pages |
| `projects/<slug>.md` | One project page: hero, facts, chapters, and a brief for every figure |
| `design.md` | The Field Notebook style, page anatomy, and hard requirements (§9 homepage, §10 detail pages) |
| `platform.md` | What every page builds on: the shared top bar and the `window.OZ` API |
| `build-prompt.md`, `build-prompt-page.md` | The exact prompts a model receives, once per page |

| Tool | Does |
|---|---|
| `content-to-json.mjs` | Specs → `content/tr.json` + `en.json`; checks languages and decoration phrases (`--check` in CI) |
| `build.sh` | Builds a model's pages one at a time, each in its own folder: input set → `claude -p` → log check → screenshots |
| `review.sh` | Serves a batch's workshop at `localhost:8765` for review |
| `shoot.sh` (+ `frame.html`) | Screenshots of a page: desktop and real 390px mobile, light and dark |
| `release.sh` | Copies approved pages (only the page files) from a workshop into that model's site `models/<id>/…` (+ timeline thumbnails to `assets/shots/`), then stops that batch's review server; lists batches; rolls back |
| `sitepaths.mjs` | Maps a page's own paths to `/models/<id>/…` (release) and back for the root copy (promote) |
| `promote.mjs` | Validates released versions; writes the root copy (`/`, `/talks/`, `/projects/`) of the pinned model |
| `build-site.sh` | Assembles the public `_site/` for the deploy (no drafts, no tools) |

## 6. Process 1: change text (copy)

1. Edit `specs/content.md`, `specs/talks.md` or a project spec: only `- tr:` / `- en:` lines, always both languages.
2. Run `node tools/content-to-json.mjs`. It must report **0 warnings** (it flags missing languages, `TODO`s, and
   decoration phrases `*_highlights` / `*_circle` that no longer appear in their text).
3. Done. Pages read the copy at runtime, so a refresh shows it. **No rebuild needed**, even on releases.

## 7. Process 2: build (one page at a time)

```bash
SPEC_REF=spec-v1 tools/build.sh <model> "<Model Name>" <page>   # official build → ../ozsert-builds/<model>_spec-v1/
tools/build.sh <model> "<Model Name>" <page>                    # dry run from the current files → <model>_dry-run/
```
Pages: `homepage`, `talks`, or a project slug (no page = all, in order). Run in the background as a plain script.
~15–30 min per page; ~75–90% of it is the model's own check pass (part of the benchmark, keep it).

Loop per page: build → check the log and scroll through the page → report to Murad → he starts the next page.

| Rule | How |
|---|---|
| One page at a time | never parallel, no supervising agents. The prompt has agents test on port 8000, so `build.sh` refuses to start while another build runs or 8000 is taken (use e.g. 8080 for your own server) |
| Isolation | each page in its own `_pages/<page>/repo/` with only the input set (`specs/ shared/ content/ assets/ favicon.ico` from `SPEC_REF`); folder always named `repo`; web tools off; `--dangerously-skip-permissions`; Claude Code defaults |
| Prompts | homepage `specs/build-prompt.md`; talks/projects `specs/build-prompt-page.md` + its spec; taken from the batch's own copy |
| Log check | tool calls, any path outside the page folder (flag to Murad), finished or not → `<page>.done`, copy to `site/`, screenshots |
| Cleanup | after each page: stop leftover servers and headless Chrome, delete what the agent created in `/tmp` |
| Usage limit | run the same command again: finished pages skipped, a cut-off page continues its own session (`claude --resume`) |
| Start over | delete the batch folder |
| Review | `tools/review.sh <batch>` → `http://localhost:8765/` |

## 8. Process 3: release (after Murad agrees)

1. New model: add its entry to `content/models.json` (`id, name, lab, family, order` from §3, `builtOn, harness,
   defaults, specVersion, status: "ok"|"failed", path, note {tr, en}`). `failed` = shown on the timeline, never promoted.
2. `tools/release.sh <batch> <page …>` puts the pages into that model's own site (`models/<id>/`, `…/talks/`,
   `…/projects/<slug>/`), maps only their own paths there (`tools/sitepaths.mjs`: `/talks/…`, `/projects/…`, `/#…`,
   `href="/"`; a deployment path, not an edit), adds them to `pages`, re-promotes the root copy and stops the review
   server. Must report **0 warnings**. No model ever replaces another model's pages; a page a model hasn't released
   yet falls back to the root copy (404.html).
3. Commit + push when Murad asks. Rollback: release from an older batch (`tar -xzf ../ozsert-builds/_archive/…`).

## 9. Rules

**Experiment (fairness):**
- One prompt per page, never re-prompted. If an agent asks, the answer is "Proceed with your best judgment;
  no further input will be given."
- No human edits to model output. Only approved pages are released.
- `spec-v1` is frozen: spec, prompts and the shared code models build on don't change; a material change means
  `spec-v2`, compared only within one version. Text-only edits (Process 1) are always fine.
- Isolation is by folder + log check (no sandbox: it blocked normal in-folder work and headless Chrome).

**Repository:**
- Never hand-edit generated files (root `index.html`, `talks/`, `projects/`, `content/*.json`). `models/` changes
  only via `tools/release.sh`. Don't modify `archive/`.
- **`specs/` is public**: only content, design, platform and prompts. No TODOs, research notes, tool or process
  details, and no client, person or internal-system names; those belong in this file.
- Gitignored: `specs/*.pdf` (the resume holds private contact details). Never commit private files.
- The deploy (`.github/workflows/static.yml`) runs `content-to-json`, `promote` and `tools/build-site.sh` and
  publishes only `_site/`: pages, `assets/`, `content/`, `shared/`, `specs/` and `archive/v1/`.
- Committing, tagging (`git tag spec-v1`) and pushing happen **only when Murad asks**.

**Checks before saying something is done:**
```bash
node tools/content-to-json.mjs --check   # 0 warnings
node tools/promote.mjs --check           # 0 warnings
python3 -m http.server 8000              # look at /, /models/, /talks/ (review drafts with tools/review.sh)
```
Headless Chrome can't go below a 500px viewport; use `tools/shoot.sh` for mobile (a real 390px frame).

## 10. Project pages: sources and caveats

Content is anonymized: no client, person, brand, host or real module names, no financial values.

- **AI-Assisted Code Review:** `init-code-review` generates a review plugin per project (19 stack checklists +
  security, 6 weighted dimensions, severity anchors, verification). 800+ blocker/critical and thousands of major
  = Murad's total across projects. The heat map is one sample review with generic module names.
- **Skills Marketplace for Every Team:** 13 plugins / 82 skills / 6 departments in the repo, shown as "80+".
  The focus is the system and its value, not one adoption report.
- **Management Insights Agent:** live per Murad. Claude → MCP → BI data in summary tables. The "9" is the
  product-hierarchy depth, not factories. Figures show structure only.
- **Enterprise AI Gateway:** architecture + PoC, rollout in waves; status "Architecture & pilot".
- **Mailbox RAG Agent:** working POC on a small test mailbox; production (local embeddings, ~10 TB) is a plan.
- **Sam AI · Habit Coach:** live on the App Store. "Four laws of habit formation" framing approved by Murad;
  store marketing stats not used.
- **Player Support Agent:** proof of concept (status per Murad), told from the product vision. No invented metrics;
  third-party benchmarks are not presented as results.

## 11. Status (2026-11-21)

- Live: Opus 5.5, complete (homepage, talks, 7 projects; dry run with small hand fixes, kept as its version).
  Opus 5: homepage live from an earlier run; rebuilding all pages from scratch in the clean layout.
- Next: homepage + talks, newest first: Sonnet 5.5 → Sonnet 5 → Opus 4.8 → Opus 4.7; then project pages.
- Later (discussed): a deterministic QA script (not an agent, never fixes pages) giving a scorecard per page.
- Deploy: GitHub Pages via `.github/workflows/static.yml` on push to `main`, domain `www.ozsert.com`.
