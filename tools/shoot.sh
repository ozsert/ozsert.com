#!/usr/bin/env bash
# Screenshots of one page, identical conditions for every model (CLAUDE.md §9).
#   tools/shoot.sh <root-dir> </url/path/> <out-dir>
# Serves <root-dir> locally and saves <out-dir>/{desktop,mobile}-{light,dark}.png (TR, 1440×900 and 390×844).
# Headless Chrome can't go below a 500px viewport, so mobile is rendered inside a real 390px iframe
# (tools/frame.html, copied into the root for the duration) and centre-cropped.
set -euo pipefail

root="${1:-}"; path="${2:-}"; out="${3:-}"
[[ -n "$root" && -n "$path" && -n "$out" ]] || { echo "usage: tools/shoot.sh <root-dir> </url/path/> <out-dir>" >&2; exit 2; }
repo="$(git rev-parse --show-toplevel)"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[[ -x "$chrome" ]] || { echo "Chrome not found; set CHROME=/path/to/chrome" >&2; exit 1; }
[[ -f "$root$path/index.html" || -f "$root${path%/}/index.html" ]] || { echo "$root$path index.html not found" >&2; exit 1; }

port="${PORT:-8799}"
! lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1 || { echo "port $port is busy (stale server?); set PORT=…" >&2; exit 1; }
mkdir -p "$out"; tmp="$(mktemp -d)"
cp "$repo/tools/frame.html" "$root/.shoot-frame.html"
( cd "$root" && exec python3 -m http.server "$port" >/dev/null 2>&1 ) &
srv=$!
trap 'kill $srv 2>/dev/null; rm -rf "$tmp" "$root/.shoot-frame.html"' EXIT
sleep 1

for theme in light dark; do
  url="http://localhost:$port$path?lang=tr&theme=$theme"
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$tmp/d-$theme" \
    --window-size=1440,900 --virtual-time-budget=10000 \
    --screenshot="$out/desktop-$theme.png" "$url" >/dev/null 2>&1
  frame="http://localhost:$port/.shoot-frame.html?src=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1],safe=""))' "$path?lang=tr&theme=$theme")"
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$tmp/m-$theme" \
    --window-size=500,844 --virtual-time-budget=10000 \
    --screenshot="$out/mobile-$theme.png" "$frame" >/dev/null 2>&1
  sips --cropToHeightWidth 844 390 "$out/mobile-$theme.png" >/dev/null
done
echo "✓ $out/"
