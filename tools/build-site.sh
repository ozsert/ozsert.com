#!/usr/bin/env bash
# Assemble the public site into _site/ (used by the GitHub Pages deploy).
#   tools/build-site.sh
# Public: the pages, shared code/text/images, specs (read by the top bar's specs window)
# and the frozen old site. Not public: tools/ and build notes; builds live outside the repo.
# Timeline thumbnails are in assets/shots/ (copied there by tools/release.sh).
set -euo pipefail
repo="$(git rev-parse --show-toplevel)"; out="$repo/_site"
rm -rf "$out"; mkdir -p "$out"
cd "$repo"
for f in index.html 404.html favicon.ico; do cp "$f" "$out/"; done
for d in assets content shared models projects talks specs; do [[ -d "$d" ]] && rsync -a --exclude '*.pdf' --exclude .DS_Store "$d" "$out/"; done
mkdir -p "$out/archive" && rsync -a --exclude docs --exclude .DS_Store archive/v1 "$out/archive/"

echo "✓ _site/ assembled ($(find "$out" -type f | wc -l | tr -d ' ') files)"
