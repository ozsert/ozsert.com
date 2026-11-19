#!/usr/bin/env bash
# Publish approved pages from a batch's workshop into the site (CLAUDE.md §8):
#   tools/release.sh                              → list batches and their finished pages
#   tools/release.sh <model>_<ts> [page ...]      → release those pages (default: every finished page)
#     homepage → models/<model>/   (+ registry "release", timeline thumbnails in assets/shots/, re-promote "/")
#     talks    → talks/
#     <slug>   → projects/<slug>/
# Only the page itself is copied (index.html, style.css, script.js, assets/), never the agent's test files.
# Releasing an older batch is how you roll back.
set -euo pipefail
repo="$(git rev-parse --show-toplevel)"
builds_root="$(dirname "$repo")/ozsert-builds"
die() { echo "✗ $*" >&2; exit 1; }

if [[ $# -eq 0 ]]; then
  echo "Batches (../ozsert-builds/):"
  for b in "$builds_root"/*/; do
    [[ -d "$b/repo" ]] || continue
    done_pages="$(ls -1 "$b" 2>/dev/null | sed -n 's/\.done$//p' | tr '\n' ' ')"
    echo "  $(basename "$b")  →  ${done_pages:-(no finished pages)}"
  done; exit 0
fi

batch="$1"; shift
src="$builds_root/$batch"; [[ -d "$src/repo" ]] || die "no batch $src"
model="${batch%%_20[0-9][0-9]-*}"
pages=("$@"); [[ ${#pages[@]} -gt 0 ]] || pages=($(ls -1 "$src" | sed -n 's/\.done$//p'))
[[ ${#pages[@]} -gt 0 ]] || die "no finished pages in $batch"

target_of() { case "$1" in homepage) echo "models/$model";; talks) echo "talks";; *) echo "projects/$1";; esac; }

for page in "${pages[@]}"; do
  target="$(target_of "$page")"; from="$src/repo/$target"
  [[ -f "$from/index.html" ]] || { echo "✗ no $target in $batch"; continue; }
  rm -rf "$repo/$target"; mkdir -p "$repo/$target"
  cp "$from"/index.html "$repo/$target/"
  for f in style.css script.js; do [[ -f "$from/$f" ]] && cp "$from/$f" "$repo/$target/"; done
  [[ -d "$from/assets" ]] && rsync -a --exclude '_*' --exclude '*profile*' --exclude '*.log' --exclude .DS_Store "$from/assets/" "$repo/$target/assets/"
  echo "✓ released $page → $target/"
  if [[ "$page" == homepage ]]; then
    mkdir -p "$repo/assets/shots"
    for t in light dark; do s="$src/_shots/homepage/desktop-$t.png"; [[ -f "$s" ]] && cp "$s" "$repo/assets/shots/$model-desktop-$t.png"; done
    node -e '
const fs = require("fs"), [f, id, rel] = process.argv.slice(1);
const reg = JSON.parse(fs.readFileSync(f, "utf8"));
const m = (reg.models || []).find((x) => x.id === id);
if (m) { m.release = rel; m.path = "/models/" + id + "/"; fs.writeFileSync(f, JSON.stringify(reg, null, 2) + "\n"); console.log("✓ registry: " + id + ".release = " + rel); }
else console.log("! " + id + " is not in content/models.json yet. Add an entry so it shows in the switcher and on the timeline.");
' "$repo/content/models.json" "$model" "$batch"
  fi
done
node "$repo/tools/promote.mjs"
