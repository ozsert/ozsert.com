#!/usr/bin/env bash
# Publish approved pages from a batch's workshop into the site (CLAUDE.md §8):
#   tools/release.sh                              → list batches and their finished pages
#   tools/release.sh <model>_<spec> [page ...]      → release those pages (default: every finished page)
#   Every model has its own site under models/<model>/ (paths mapped by tools/sitepaths.mjs):
#     homepage → models/<model>/                (+ registry "release", timeline thumbnails in assets/shots/)
#     talks    → models/<model>/talks/
#     <slug>   → models/<model>/projects/<slug>/
#   Each released page is listed in the registry ("pages"); then promote.mjs rewrites the root copy
#   (/, /talks/, /projects/) from the pinned model.
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
model="${batch%%_*}"
pages=("$@"); [[ ${#pages[@]} -gt 0 ]] || pages=($(ls -1 "$src" | sed -n 's/\.done$//p'))
[[ ${#pages[@]} -gt 0 ]] || die "no finished pages in $batch"

src_of()    { case "$1" in homepage) echo "models/$model";; talks) echo "talks";; *) echo "projects/$1";; esac; }   # where the agent wrote it
target_of() { case "$1" in homepage) echo "models/$model";; talks) echo "models/$model/talks";; *) echo "models/$model/projects/$1";; esac; }

for page in "${pages[@]}"; do
  target="$(target_of "$page")"; from="$src/repo/$(src_of "$page")"
  [[ -f "$from/index.html" ]] || { echo "✗ no $(src_of "$page") in $batch"; continue; }
  if [[ "$page" == homepage ]]; then   # keep the model's talks/ and projects/ next to its homepage
    mkdir -p "$repo/$target"; rm -rf "$repo/$target"/{index.html,style.css,script.js,assets}
  else rm -rf "$repo/$target"; mkdir -p "$repo/$target"; fi
  cp "$from"/index.html "$repo/$target/"
  for f in style.css script.js; do [[ -f "$from/$f" ]] && cp "$from/$f" "$repo/$target/"; done
  [[ -d "$from/assets" ]] && rsync -a --exclude '_*' --exclude '*profile*' --exclude '*.log' --exclude .DS_Store "$from/assets/" "$repo/$target/assets/"
  node "$repo/tools/sitepaths.mjs" to-model "$model" "$repo/$target" >/dev/null
  node -e '
const fs = require("fs"), [f, id, page] = process.argv.slice(1);
const reg = JSON.parse(fs.readFileSync(f, "utf8")), m = (reg.models || []).find((x) => x.id === id);
if (m) { m.pages = [...new Set([...(m.pages || []), page])].sort((a, b) => (a === "homepage" ? -1 : b === "homepage" ? 1 : a.localeCompare(b))); fs.writeFileSync(f, JSON.stringify(reg, null, 2) + "\n"); }
' "$repo/content/models.json" "$model" "$page"
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

# The review is over: stop this batch's review server (tools/review.sh) so no shell stays open.
for p in $(pgrep -f "http.server" || true); do
  d="$(lsof -a -p "$p" -d cwd 2>/dev/null | tail -1 | awk '{print $NF}')"
  [[ "$d" == "$src"* ]] && kill "$p" 2>/dev/null && echo "✓ stopped the review server (pid $p)" || true
done
