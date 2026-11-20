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
| Pages | Homepage (one per model), `/talks/`, `/projects/<slug>/` (7 projects), `/models/` timeline, `404.html`. |
| Built by models | Homepage, talks page and project pages. Built by Claude, outside the experiment: `/models/`, 404, shared code. |
| Style | Field Notebook; Istanbul accent palette (6 colours, each with its own hero scene); 📡 mark. |
| Identity | No job title or employer in the hero: startups → largest enterprises. Deka Tech only in Experience/Now; clients never named. Yolda is a founder's journey: no exit or acquisition. |
| Sections | 01 Workbench (enterprise + startup projects) · 02 Founder's road (Yolda) · 03 Talks · 04 Newsletter · 05 Experience. |
| Root `/` | `pinned` in `content/models.json` (Opus 5.5), otherwise the released homepage with the highest `order`. |
| Public vs internal | `specs/` is public (deployed and shown in the specs window). This file and `tools/` are not; builds live outside the repo. |
| Fairness | Same spec, same prompt, one prompt per page, Claude Code defaults, no human edits to output. |

## 3. Lineup (`order` in `content/models.json` = release order)

Built newest first after the flagship; one model at a time, and within a model one page at a time.
Release dates are approximate (one year before each model's earliest retirement date).

| Order | Model | Model id = `--model` | Released | Status |
|---|---|---|---|---|
| 1 | Claude Opus 4.6 | `claude-opus-4-6` | ~2026-02-05 | to build |
| 2 | Claude Opus 4.7 | `claude-opus-4-7` | ~2026-04-16 | to build |
| 3 | Claude Opus 4.8 | `claude-opus-4-8` | ~2026-05-28 | to build |
| 4 | Claude Opus 5 | `claude-opus-5` | ~2026-07-24 | building (`spec-v1`) |
| 5 | Claude Opus 5.5 | `claude-opus-5-5` | ~2026-09-22 | live (dry run, kept as its version; `pinned`, so it stays at `/`) |
| 6 | Claude Sonnet 5.5 | `claude-sonnet-5-5` | ~2026-09-28 | to build |
| 7 | Claude Haiku 5.5 | `claude-haiku-5-5` | ~2026-10-07 | to build |
| — | Claude Fable 5.2 | `claude-fable-5-2` | — | out of scope for now |

Build order: Opus 5 → Opus 4.8 → Opus 4.7 → Opus 4.6 → Sonnet 5.5 → Haiku 5.5.

Dropped: Sonnet 4.5 and Opus 4.5 (not available in Claude Code). Rival labs are out of scope. Never fake a model.

## 4. Map

| Path | What | Who changes it |
|---|---|---|
| `specs/content.md`, `specs/talks.md` | Homepage copy and the 12 talks (+ talks page brief), TR + EN | Murad / Claude on request |
| `specs/projects.md`, `specs/projects/<slug>.md` | Workbench rows + project page chapters and figure briefs | Murad / Claude on request |
| `specs/design.md` | Field Notebook style + hard requirements (§9 homepage, §10 detail pages) | Claude, only before a spec freeze |
| `specs/platform.md` | The shared top bar and the `window.OZ` API | Claude, only before a spec freeze |
| `specs/build-prompt.md`, `specs/build-prompt-page.md` | The exact prompts the models get | Claude, only before a spec freeze |
| `shared/` | `core.js` (`window.OZ`), `topbar.js`, `house.css` (shared pages only) | Claude, only before a spec freeze |
| `content/tr.json`, `content/en.json` | **Generated** from the specs | never by hand |
| `content/models.json` | Model registry (`order`, `status`, `release`, …) | Claude (Process 3) |
| `index.html` (root) | **Generated** copy of the promoted release | never by hand |
| `models/<id>/`, `talks/`, `projects/<slug>/` | Released pages (talks: hand-made fallback until its first release) | only `tools/release.sh` |
| `models/index.html`, `404.html` | `/models/` timeline, 404 | Claude |
| `tools/` | The scripts in §5 below. **Not deployed** | Claude |
| `../ozsert-builds/<model>_<spec>/` | **Outside the repo: the batch's workshop.** `repo/` = input set + the pages the agents built (review here); `<page>.prompt.txt`, `<page>.log`, `<page>.done`, `_shots/<page>/`. Kept for rollback; agent leftovers never leave it | only `tools/build.sh` |
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
| `build.sh` | One batch in its workshop: input set → one `claude -p` per page → log check → screenshots (+ `--resume`) |
| `review.sh` | Serves a batch's workshop at `localhost:8765` for review |
| `shoot.sh` (+ `frame.html`) | Screenshots of a page: desktop and real 390px mobile, light and dark |
| `release.sh` | Copies approved pages (only the page files) from a workshop into the site (+ timeline thumbnails to `assets/shots/`), then stops that batch's review server; lists batches; rolls back |
| `promote.mjs` | Validates released versions and writes the root `index.html` from the highest `order` |
| `build-site.sh` | Assembles the public `_site/` for the deploy (no drafts, no tools) |

## 6. Process 1: change text (copy)

1. Edit `specs/content.md`, `specs/talks.md` or a project spec: only `- tr:` / `- en:` lines, always both languages.
2. Run `node tools/content-to-json.mjs`. It must report **0 warnings** (it flags missing languages, `TODO`s, and
   decoration phrases `*_highlights` / `*_circle` that no longer appear in their text).
3. Done. Pages read the copy at runtime, so a refresh shows it. **No rebuild needed**, even on releases.

## 7. Process 2: build (one batch = all pages of one model)

Run it **in the background** as a plain script (no supervising agents); each page takes ~15–20 min, more if a usage
limit cuts it off.

```bash
SPEC_REF=spec-v1 tools/build.sh <model> "<Model Name>"   # official build → ../ozsert-builds/<model>_spec-v1/
tools/build.sh <model> "<Model Name>" [page …]           # dry run from the current files → <model>_dry-run/
```

**Deterministic layout:** one batch folder per model per spec version, `../ozsert-builds/<model>_<spec>/`
(no dates). Models never share a folder, so no model sees another's work; one model's pages are reviewed together in its `repo/`
(links work). Running the same command again
continues the batch (finished pages skipped, e.g. after a usage limit); to start over, delete the folder.
**One page at a time, never in parallel.** The prompt has every agent test on port 8000 and agents stop servers they
think are theirs, so parallel builds disturb each other (and any server you run on 8000: use another port, e.g. 8080,
while a build runs). Each page builds in its own folder `_pages/<page>/` holding only the input set, so no page sees
another page's work; finished pages are copied into `repo/` for review. After a page finishes: check it, report,
then start the next. A page cut off by a usage limit continues its own session (`claude --resume`, "Continue.").
Every page ends with the model's own check pass (TR/EN, light/dark, 390/1440, every figure), ~75–90% of its tool
calls; this is part of the benchmark and stays.

What it does, never by hand:
1. Creates the workshop `../ozsert-builds/<model>_<spec>/repo/` with only the **input set** (`specs/`, `shared/`,
   `content/`, `assets/`, `favicon.ico`). It's outside the repo, so the agent doesn't load this file.
2. For each page: one `claude -p` session (one prompt, `--dangerously-skip-permissions`, web tools off, Claude
   Code defaults), log in `<page>.log`. Homepage: `specs/build-prompt.md`; talks and project pages:
   `specs/build-prompt-page.md` with `specs/talks.md` or `specs/projects/<slug>.md`. The agent writes the page
   where it will live on the site (`models/<model>/`, `talks/`, `projects/<slug>/`).
3. Checks each log: tool calls, any path outside its folder (flag it to Murad), finished or not. A finished page
   gets `<page>.done` and screenshots in `_shots/<page>/`; an unfinished one is built again by running the same command.
4. **Review:** `tools/review.sh <model>_<spec>` serves the workshop at `http://localhost:8765/`; give Murad the
   page links it prints. Pages link to each other exactly as on the site.

## 8. Process 3: release (after Murad agrees)

1. If the model isn't in `content/models.json` yet, add its entry:
   ```json
   { "id": "<model>", "name": "<Model Name>", "lab": "Anthropic", "family": "claude",
     "order": <n from §3>, "builtOn": "<YYYY-MM-DD>", "harness": "Claude Code",
     "defaults": "default settings", "specVersion": "spec-v1", "status": "ok",
     "path": "/models/<model>/", "note": { "tr": "…", "en": "…" } }
   ```
   (`status: "failed"` for broken builds: shown on the timeline, never promoted.)
2. `tools/release.sh <model>_<spec> [page …]`: copies only the approved pages' files from the workshop to
   `models/<model>/`, `talks/` and `projects/<slug>/`, sets `"release"` in the registry, copies the timeline
   thumbnails to `assets/shots/` and re-promotes `/`. Must report **0 warnings**.
3. `tools/release.sh` alone lists every batch. Releasing an older batch is how you roll back.

## 9. Rules

**Experiment (fairness):**
- One prompt per page, never re-prompted. If an agent asks, the answer is "Proceed with your best judgment;
  no further input will be given."
- No human edits to model output. Every batch's workshop is kept; only approved pages are released.
- Before `spec-v1` is frozen, spec, shared code and prompts may change; re-run the Opus 5.5 dry run when a change
  adds instructions models must understand (small fixes to a dry-run page may be done by hand). After the freeze
  they don't change: a material change means `spec-v2`, and versions are compared only within one spec version.
  Text-only edits (Process 1) are always fine.
- **Isolation (decided 2026-11-18):** separate build folder + `--dangerously-skip-permissions` + web tools off +
  log check. Claude Code's read/write blocking and the macOS sandbox worked but also blocked normal in-folder work
  and headless Chrome. Revisit only for builds on a shared machine, or if a log shows reads outside the folder.

**Repository:**
- Never hand-edit generated files (root `index.html`, `content/*.json`). `models/`, `talks/`, `projects/` change
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

## 11. Status (2026-11-19)

- Done: shared code, top bar, `/models/`, 404, deploy (only `_site/`), content for all 7 projects.
- Batch `claude-opus-5-5_2026-11-19_1056` (dry run, `specVersion: dry-run`), released: homepage (two small hand
  fixes: accent scenes draw on the first click; portrait uses `portrait-upper.jpg`; later: hover pictures as an
  accent-ink duotone, no signal mark in the top bar or footer), talks and all 7 project pages.
- **`spec-v1` frozen (2026-11-20, git tag).** Spec, shared code and prompts no longer change (text-only edits
  are fine). Next: official builds, one model at a time: `SPEC_REF=spec-v1 tools/build.sh <model> "<Name>"`
  (Opus 5.5 too; its dry-run pages stay live until its official build is released).
- Review loop per page: build in the background → scroll-check (static shots miss scroll-drawn figures) →
  `tools/review.sh <batch>` (port 8765) → Murad's OK → `tools/release.sh <batch> <page>` → commit + push.
- Deploy: GitHub Pages (source: GitHub Actions, `.github/workflows/static.yml` on push to `main`), domain
  `www.ozsert.com`. HTTPS isn't enforced yet; enable "Enforce HTTPS" in the repo's Pages settings.
