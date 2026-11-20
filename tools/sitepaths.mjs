#!/usr/bin/env node
// Maps a model's page paths between "its own site" and the root copy (CLAUDE.md §8).
// Models write pages as if they were the whole site (/, /talks/, /projects/<slug>/). On ozsert.com every model
// has its own site under /models/<id>/, so a released page's own paths are rewritten:
//   "/talks/…" → "/models/<id>/talks/…",  "/projects/…" → "/models/<id>/projects/…",
//   "/#anchor" → "/models/<id>/#anchor",   href="/" → href="/models/<id>/"
// Only these path prefixes change (in quotes, url( or template strings); /shared/, /assets/, /content/, /specs/
// and every other path stay. The root copy (/, /talks/, /projects/) of the pinned model maps them back.
//
//   node tools/sitepaths.mjs to-model <id> <dir>   rewrite every .html/.css/.js under <dir> in place
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const Q = "([\"'`(])";   // a path starts right after a quote, backtick or url(
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function toModel(text, id) {
  const base = `/models/${id}/`;
  return text
    .replace(new RegExp(Q + "/(talks|projects)/", "g"), `$1${base}$2/`)
    .replace(new RegExp(Q + "/#", "g"), `$1${base}#`)
    .replace(/(href=\\?["'])\/(\\?["'])/g, `$1${base}$2`);   // only a real home link, never a "/" piece of a built path
}

export function toRoot(text, id) {
  const base = esc(`/models/${id}/`);
  return text
    .replace(new RegExp(Q + base + "(talks|projects)/", "g"), "$1/$2/")
    .replace(new RegExp(Q + base + "#", "g"), "$1/#")
    .replace(new RegExp("(href=\\\\?[\"'])" + base + "(\\\\?[\"'])", "g"), "$1/$2");
}

export function eachFile(dir, fn) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) eachFile(p, fn);
    else if (/\.(html|css|js)$/.test(name)) fn(p);
  }
}

if (process.argv[1] && process.argv[1].endsWith("sitepaths.mjs")) {
  const [cmd, id, dir] = process.argv.slice(2);
  if (cmd !== "to-model" || !id || !dir) { console.error("usage: node tools/sitepaths.mjs to-model <id> <dir>"); process.exit(2); }
  let n = 0;
  eachFile(dir, (p) => { const t = readFileSync(p, "utf8"), u = toModel(t, id); if (u !== t) { writeFileSync(p, u); n++; } });
  console.log(`✓ paths → /models/${id}/ in ${n} file(s) under ${dir}`);
}
