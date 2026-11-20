#!/usr/bin/env bash
# Review a batch in its workshop (CLAUDE.md §7):
#   tools/review.sh <model>_<spec> [port]     → serves the workshop at http://localhost:<port>/ (default 8765)
# The workshop has everything the pages need (specs, shared code, copy, images) plus the pages the agents
# built, so links between them work as they will on the site. Ctrl-C (or kill) stops the server.
set -euo pipefail
repo="$(git rev-parse --show-toplevel)"
batch="${1:-}"; port="${2:-8765}"
[[ -n "$batch" ]] || { echo "usage: tools/review.sh <model>_<spec> [port]"; ls -1 "$(dirname "$repo")/ozsert-builds" 2>/dev/null | sed 's/^/  /'; exit 2; }
work="$(dirname "$repo")/ozsert-builds/$batch/repo"
[[ -d "$work" ]] || { echo "✗ no workshop $work" >&2; exit 1; }
model="${batch%%_*}"
echo "Review $batch at:"
[[ -f "$work/models/$model/index.html" ]] && echo "  http://localhost:$port/models/$model/"
[[ -f "$work/talks/index.html" ]] && echo "  http://localhost:$port/talks/"
for d in "$work"/projects/*/; do [[ -f "$d/index.html" ]] && echo "  http://localhost:$port/projects/$(basename "$d")/"; done
cd "$work" && exec python3 -m http.server "$port"
