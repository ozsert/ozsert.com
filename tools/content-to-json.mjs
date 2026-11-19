#!/usr/bin/env node
// Converts specs/content.md, specs/talks.md, specs/projects.md and specs/projects/*.md
// into content/tr.json and content/en.json.
// Format in the MD files:  "### key" followed by "- tr: …" and "- en: …" lines.
// Lines starting with ">" are notes and are ignored. No dependencies.
//
// Usage: node tools/content-to-json.mjs [--check]
//   --check  exit 1 if the JSON on disk is out of date (used in CI).

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// Homepage copy, talks, the project index, and one file per project detail page.
const projectDir = join(root, "specs/projects");
const SOURCES = ["specs/content.md", "specs/talks.md"]
  .concat(existsSync(join(root, "specs/projects.md")) ? ["specs/projects.md"] : [])
  .concat(existsSync(projectDir)
    ? readdirSync(projectDir).filter((f) => f.endsWith(".md") && !f.startsWith("_")).sort().map((f) => "specs/projects/" + f)
    : []);
const LANGS = ["tr", "en"];

const out = { tr: {}, en: {} };
const problems = [];

for (const src of SOURCES) {
  const lines = readFileSync(join(root, src), "utf8").split("\n");
  let key = null;
  lines.forEach((line, i) => {
    const h = line.match(/^###\s+([a-z0-9_.-]+)\s*$/i);
    if (h) {
      key = h[1];
      if (key in out.tr) problems.push(`${src}:${i + 1} duplicate key "${key}"`);
      return;
    }
    if (/^#{1,6}\s/.test(line)) { key = null; return; } // any other heading ends the block
    const v = line.match(/^- (tr|en):\s?(.*)$/);
    if (v && key) out[v[1]][key] = v[2].trim();
  });
}

for (const k of new Set([...Object.keys(out.tr), ...Object.keys(out.en)])) {
  for (const l of LANGS) {
    if (!(k in out[l])) problems.push(`missing ${l} for "${k}"`);
    else if (/\bTODO\b/.test(out[l][k])) problems.push(`TODO left in ${l} "${k}"`);
  }
}

// Decoration keys must point at text that really exists (so an edit can't silently break them).
for (const l of LANGS) {
  for (const [k, v] of Object.entries(out[l])) {
    const m = k.match(/^(.*)_(highlights|circle)$/);
    if (!m) continue;
    const base = k.endsWith("role_highlights") ? "hero.role" : k.endsWith("manifesto_circle") ? "hero.manifesto" : m[1];
    for (const phrase of v.split("|").map((x) => x.trim()).filter(Boolean)) {
      if (!(out[l][base] || "").includes(phrase)) problems.push(`${l} "${k}": "${phrase}" not found in "${base}"`);
    }
  }
}

const check = process.argv.includes("--check");
let stale = false;
for (const l of LANGS) {
  const file = join(root, "content", `${l}.json`);
  const json = JSON.stringify(out[l], null, 2) + "\n";
  if (check) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== json) stale = true;
  } else {
    writeFileSync(file, json);
  }
}

problems.forEach((p) => console.warn("warn:", p));
if (check && stale) {
  console.error("content/*.json is out of date — run: node tools/content-to-json.mjs");
  process.exit(1);
}
console.log(`${check ? "checked" : "wrote"} content/{tr,en}.json — ${Object.keys(out.en).length} keys, ${problems.length} warnings`);
