#!/usr/bin/env bash
# Build pages for one model, in one batch (CLAUDE.md §7):
#   tools/build.sh <model-id> "<Model Name>" [page ...]
#     pages: homepage, talks, and/or project slugs. Default: homepage + talks + every slug in projects.order.
#   tools/build.sh --resume <model>_<ts> [page ...]
#     continue an interrupted batch (e.g. usage limit): finished pages are skipped, the rest are built
#     (a half-finished page starts over with a fresh prompt and may build on its own half-done files).
#   Env: SPEC_REF=working-tree (default; uses the current files) or a git tag, e.g. SPEC_REF=spec-v1.
#
# Everything happens in the batch's workshop, OUTSIDE the repo (so the agent doesn't load CLAUDE.md):
#   ../ozsert-builds/<model>_<ts>/repo/              the input set (specs/ shared/ content/ assets/) + the pages
#                                                    the agents write (models/<model>/, talks/, projects/<slug>/)
#   ../ozsert-builds/<model>_<ts>/<page>.prompt.txt  the exact prompt sent (once)
#   ../ozsert-builds/<model>_<ts>/<page>.log         claude -p stream-json log
#   ../ozsert-builds/<model>_<ts>/<page>.done        written when the page finished
#   ../ozsert-builds/<model>_<ts>/_shots/<page>/     screenshots
# Review in the workshop with tools/review.sh; only tools/release.sh copies approved pages into the repo.
# Agents run with --dangerously-skip-permissions in their workshop (isolation by location, CLAUDE.md §9).
set -euo pipefail

repo="$(git rev-parse --show-toplevel)"
builds_root="$(dirname "$repo")/ozsert-builds"
die() { echo "✗ $*" >&2; exit 1; }

resume=""
if [[ "${1:-}" == "--resume" ]]; then
  resume="${2:-}"; [[ -n "$resume" ]] || die "usage: tools/build.sh --resume <model>_<ts> [page ...]"
  [[ -d "$builds_root/$resume/repo" ]] || die "no batch $builds_root/$resume"
  model="${resume%%_20[0-9][0-9]-*}"; name="$(cat "$builds_root/$resume/name.txt" 2>/dev/null || echo "$model")"
  shift 2
else
  model="${1:-}"; name="${2:-}"; shift 2 2>/dev/null || true
  [[ -n "$model" && -n "$name" ]] || die "usage: tools/build.sh <model-id> \"<Model Name>\" [homepage|talks|<slug> ...]"
  [[ "$model" =~ ^[a-z0-9][a-z0-9.-]*$ ]] || die "model-id: lowercase letters, digits, dots, dashes"
fi

all_slugs="$(node -e 'process.stdout.write(require(process.argv[1])["projects.order"].split(",").map(s=>s.trim()).join(" "))' "$repo/content/en.json")"
pages=("$@"); [[ ${#pages[@]} -gt 0 ]] || pages=(homepage talks $all_slugs)

batch_name="${resume:-${model}_$(date +%Y-%m-%d_%H%M)}"
batch="$builds_root/$batch_name"; work="$batch/repo"

if [[ -z "$resume" ]]; then
  [[ -e "$batch" ]] && die "$batch already exists"
  mkdir -p "$work"
  ref="${SPEC_REF:-working-tree}"
  if [[ "$ref" == "working-tree" ]]; then src="$repo"; else
    src="$(mktemp -d)"; git -C "$repo" archive "$ref" specs shared content assets favicon.ico | tar -x -C "$src" \
      || die "git ref '$ref' not found"; fi
  for d in specs shared content assets; do rsync -a --exclude '*.pdf' --exclude .DS_Store --exclude shots "$src/$d" "$work/"; done
  cp "$src/favicon.ico" "$work/"
  printf '%s\n' "$ref" > "$batch/spec-ref.txt"
  printf '%s\n' "$name" > "$batch/name.txt"
fi
echo "▶ $batch_name · ${resume:+resume · }pages: ${pages[*]}"

# ---- page helpers ------------------------------------------------------------------------
out_dir()   { case "$1" in homepage) echo "models/$model";; talks) echo "talks";; *) echo "projects/$1";; esac; }
spec_file() { case "$1" in talks) echo "specs/talks.md";; *) echo "specs/projects/$1.md";; esac; }
prompt_for() {
  local page="$1"
  if [[ "$page" == homepage ]]; then
    awk 'f{print} /^---$/{f=1}' "$repo/specs/build-prompt.md" | sed -e "s/<MODEL_ID>/$model/g" -e "s/<MODEL_NAME>/$name/g"
  else
    awk 'f{print} /^---$/{f=1}' "$repo/specs/build-prompt-page.md" | sed -e "s/<MODEL_ID>/$model/g" -e "s/<MODEL_NAME>/$name/g" \
      -e "s#<PAGE_DIR>#$(out_dir "$page")#g" -e "s#<SPEC_FILE>#$(spec_file "$page")#g"
  fi
}

stop_servers() {   # kill local servers an agent left running in the workshop (not ones that ran before it, e.g. review.sh)
  for p in $(pgrep -f "http.server" || true); do
    [[ " $before " == *" $p "* ]] && continue
    d="$(lsof -a -p "$p" -d cwd 2>/dev/null | tail -1 | awk '{print $NF}')"
    [[ "$d" == "$batch"* ]] && kill "$p" 2>/dev/null || true
  done
}

report() {   # report <log>: tool calls, outside-path attempts, finished or not
  python3 -I - "$1" "$work" "$repo" <<'EOF'
import json, sys
log, work, repo = sys.argv[1:4]
calls = outside = 0; result = None
for line in open(log, encoding="utf-8", errors="replace"):
    try: ev = json.loads(line)
    except ValueError: continue
    if not isinstance(ev, dict): continue
    if ev.get("type") == "result" and (result is None or (ev.get("num_turns") or 0) >= (result.get("num_turns") or 0)): result = ev
    msg = ev.get("message"); content = msg.get("content") if isinstance(msg, dict) else None
    for b in content if isinstance(content, list) else []:
        if isinstance(b, dict) and b.get("type") == "tool_use":
            calls += 1
            inp = json.dumps(b.get("input"), ensure_ascii=False).replace(work, "<WORK>")
            if repo + "/" in inp or "/archive/" in inp:
                outside += 1; print(f"    ✗ outside its folder: {b.get('name')}: {inp[:160]}")
ok = result is not None and not result.get("is_error")
mins = round(((result or {}).get("duration_ms") or 0) / 60000, 1)
print(f"    {calls} tool calls · {outside} outside its folder · {'completed' if ok else 'NOT FINISHED'} · {mins} min")
sys.exit(0 if ok else 2)
EOF
}

# ---- run every page, one after another ---------------------------------------------------
for page in "${pages[@]}"; do
  if [[ "$page" != homepage && ! -f "$repo/$(spec_file "$page")" ]]; then echo "✗ skip $page: no $(spec_file "$page")"; continue; fi
  if [[ -f "$batch/$page.done" ]]; then echo "✓ $page already finished, skipping"; continue; fi
  if [[ -f "$batch/$page.log" ]]; then n=1; while [[ -e "$batch/$page.log.$n" ]]; do n=$((n+1)); done; mv "$batch/$page.log" "$batch/$page.log.$n"; fi
  echo "▶ $page"
  prompt_for "$page" > "$batch/$page.prompt.txt"
  before="$(pgrep -f "http.server" | tr '\n' ' ' || true)"
  ( cd "$work" && claude -p "$(cat "$batch/$page.prompt.txt")" --model "$model" \
      --dangerously-skip-permissions --disallowedTools WebSearch WebFetch \
      --output-format stream-json --verbose > "$batch/$page.log" 2>&1 ) || true
  stop_servers
  if report "$batch/$page.log" && [[ -f "$work/$(out_dir "$page")/index.html" ]]; then
    touch "$batch/$page.done"
    "$repo/tools/shoot.sh" "$work" "/$(out_dir "$page")/" "$batch/_shots/$page" >/dev/null 2>&1 || true
    echo "    ✓ done: /$(out_dir "$page")/"
  else
    echo "    ⚠ $page did not finish (e.g. usage limit). Continue later: tools/build.sh --resume $batch_name"
  fi
done

echo
echo "Review:  tools/review.sh $batch_name      (serves the workshop at http://localhost:8765/)"
echo "Release: tools/release.sh $batch_name     (after Murad's OK)"
