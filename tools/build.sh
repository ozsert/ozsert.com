#!/usr/bin/env bash
# Build pages for one model, in one batch (CLAUDE.md §7):
#   SPEC_REF=spec-v1 tools/build.sh <model-id> "<Model Name>" [page ...]
#     pages: homepage, talks, and/or project slugs. Default: homepage + talks + every slug in projects.order,
#     one page at a time, each in its own folder. The batch is ../ozsert-builds/<model>_<spec>/ (deterministic):
#     if it exists, the same command continues it (finished pages are skipped; a half-finished page starts
#     over with a fresh prompt and may build on its own half-done files). To start over, delete the batch.
#   tools/build.sh --resume <batch> [page ...]   continue a batch by its folder name
#   Env: SPEC_REF=<git tag> (official builds, e.g. spec-v1) or unset = the current files, batch <model>_dry-run.
#
# Everything happens in the batch's workshop, OUTSIDE the repo (so the agent doesn't load CLAUDE.md):
#   ../ozsert-builds/<model>_<spec>/site/              the input set (specs/ shared/ content/ assets/) + the pages
#                                                    the agents write (models/<model>/, talks/, projects/<slug>/)
#   ../ozsert-builds/<model>_<spec>/<page>.prompt.txt  the exact prompt sent (once)
#   ../ozsert-builds/<model>_<spec>/<page>.log         claude -p stream-json log
#   ../ozsert-builds/<model>_<spec>/<page>.done        written when the page finished
#   ../ozsert-builds/<model>_<spec>/_shots/<page>/     screenshots
# Review in the workshop with tools/review.sh; only tools/release.sh copies approved pages into the repo.
# Agents run with --dangerously-skip-permissions in their workshop (isolation by location, CLAUDE.md §9).
set -euo pipefail

repo="$(git rev-parse --show-toplevel)"
builds_root="$(dirname "$repo")/ozsert-builds"
die() { echo "✗ $*" >&2; exit 1; }

resume=""
if [[ "${1:-}" == "--resume" ]]; then
  resume="${2:-}"; [[ -n "$resume" ]] || die "usage: tools/build.sh --resume <batch> [page ...]"
  [[ -d "$builds_root/$resume/site" ]] || die "no batch $builds_root/$resume"
  model="${resume%%_*}"; name="$(cat "$builds_root/$resume/name.txt" 2>/dev/null || echo "$model")"
  shift 2
else
  model="${1:-}"; name="${2:-}"; shift 2 2>/dev/null || true
  [[ -n "$model" && -n "$name" ]] || die "usage: tools/build.sh <model-id> \"<Model Name>\" [homepage|talks|<slug> ...]"
  [[ "$model" =~ ^[a-z0-9][a-z0-9.-]*$ ]] || die "model-id: lowercase letters, digits, dots, dashes"
fi

# guards: one build at a time, and port 8000 free (the prompt has every agent test on it; agents stop servers there)
pgrep -f "disallowedTools WebSearch WebFetch" >/dev/null && die "another build is running; builds run one at a time"
lsof -nP -iTCP:8000 -sTCP:LISTEN >/dev/null 2>&1 && die "port 8000 is in use (your own server?). Stop it, or use another port, then run again"

ref="${SPEC_REF:-working-tree}"
batch_name="${resume:-${model}_$([[ "$ref" == working-tree ]] && echo dry-run || echo "$ref")}"
batch="$builds_root/$batch_name"; work="$batch/site"   # input master + finished pages for review
[[ -d "$work" ]] && resume="$batch_name"   # the batch exists: continue it, never mix in newer inputs

if [[ -z "$resume" ]]; then
  mkdir -p "$work"
  if [[ "$ref" == "working-tree" ]]; then src="$repo"; else
    src="$(mktemp -d)"; git -C "$repo" archive "$ref" specs shared content assets favicon.ico | tar -x -C "$src" \
      || { rm -rf "$batch" "$src"; die "git ref '$ref' not found"; }; fi
  for d in specs shared content assets; do rsync -a --exclude '*.pdf' --exclude .DS_Store --exclude shots "$src/$d" "$work/"; done
  cp "$src/favicon.ico" "$work/"
  [[ "$src" != "$repo" ]] && rm -rf "$src"
  printf '%s\n' "$ref" > "$batch/spec-ref.txt"
  printf '%s\n' "$name" > "$batch/name.txt"
fi
# pages and prompts come from the workshop's own input set, so a batch always uses the spec it started with
all_slugs="$(node -e 'process.stdout.write(require(process.argv[1])["projects.order"].split(",").map(s=>s.trim()).join(" "))' "$work/content/en.json")"
pages=("$@"); [[ ${#pages[@]} -gt 0 ]] || pages=(homepage talks $all_slugs)
echo "▶ $batch_name · ${resume:+continue · }pages: ${pages[*]}"

# ---- page helpers ------------------------------------------------------------------------
out_dir()   { case "$1" in homepage) echo "models/$model";; talks) echo "talks";; *) echo "projects/$1";; esac; }
spec_file() { case "$1" in talks) echo "specs/talks.md";; *) echo "specs/projects/$1.md";; esac; }
prompt_for() {
  local page="$1"
  if [[ "$page" == homepage ]]; then
    awk 'f{print} /^---$/{f=1}' "$work/specs/build-prompt.md" | sed -e "s/<MODEL_ID>/$model/g" -e "s/<MODEL_NAME>/$name/g"
  else
    awk 'f{print} /^---$/{f=1}' "$work/specs/build-prompt-page.md" | sed -e "s/<MODEL_ID>/$model/g" -e "s/<MODEL_NAME>/$name/g" \
      -e "s#<PAGE_DIR>#$(out_dir "$page")#g" -e "s#<SPEC_FILE>#$(spec_file "$page")#g"
  fi
}

stop_servers() {   # stop_servers <dir>: kill local servers an agent left running in its own page folder
  for p in $(pgrep -f "http.server" || true); do
    d="$(lsof -a -p "$p" -d cwd 2>/dev/null | tail -1 | awk '{print $NF}')"
    [[ "$d" == "$1"* ]] && kill "$p" 2>/dev/null || true
  done
}

report() {   # report <log>: tool calls, outside-path attempts, finished or not
  python3 -I - "$1" "$2" "$repo" "$builds_root" <<'EOF'
import json, sys
log, work, repo, builds = sys.argv[1:5]   # anything outside the page's own folder is flagged
calls = outside = 0; result = None; ms = 0
for line in open(log, encoding="utf-8", errors="replace"):
    try: ev = json.loads(line)
    except ValueError: continue
    if not isinstance(ev, dict): continue
    if ev.get("type") == "result": ms += ev.get("duration_ms") or 0   # a session can end more than once (background waits)
    if ev.get("type") == "result" and (result is None or (ev.get("num_turns") or 0) >= (result.get("num_turns") or 0)): result = ev
    msg = ev.get("message"); content = msg.get("content") if isinstance(msg, dict) else None
    for b in content if isinstance(content, list) else []:
        if isinstance(b, dict) and b.get("type") == "tool_use":
            calls += 1
            inp = json.dumps(b.get("input"), ensure_ascii=False).replace(work, "<WORK>")
            if repo + "/" in inp or builds + "/" in inp or "/archive/" in inp:
                outside += 1; print(f"    ✗ outside its folder: {b.get('name')}: {inp[:160]}")
ok = result is not None and not result.get("is_error")
mins = round(ms / 60000, 1)
print(f"    {calls} tool calls · {outside} outside its folder · {'completed' if ok else 'NOT FINISHED'} · {mins} min")
sys.exit(0 if ok else 2)
EOF
}

# ---- run the pages, one at a time ----------------------------------------------------------
# Never in parallel: the prompt has every agent use port 8000, and agents stop "their" servers.
# Each page is built in its own folder _pages/<page>/repo/ holding only the input set, so pages never see each
# other's work. The finished page is copied into site/.
build_page() {
  # the agent's folder is always named "repo": a folder named after the page (e.g. "talks") made an agent think it
  # was already inside talks/ and write the page one level too high
  local page="$1" i="$2" pw="$batch/_pages/$1/repo" out; out="$(out_dir "$page")"
  if [[ ! -d "$pw" ]]; then
    mkdir -p "$pw"
    rsync -a --exclude /models --exclude /talks --exclude /projects "$work/" "$pw/"   # anchored: keep specs/projects/
  fi
  # an interrupted page (e.g. usage limit) continues its own session, so it stays one prompt, one conversation
  local sid="" args
  if [[ -f "$batch/$page.log" ]]; then
    sid="$(python3 -I -c 'import json,sys
for l in open(sys.argv[1], errors="replace"):
    try: e = json.loads(l)
    except ValueError: continue
    if isinstance(e, dict) and e.get("session_id"): print(e["session_id"]); break' "$batch/$page.log")"
    n=1; while [[ -e "$batch/$page.log.$n" ]]; do n=$((n+1)); done; mv "$batch/$page.log" "$batch/$page.log.$n"
  fi
  if [[ -n "$sid" ]]; then args=(--resume "$sid" -p "Continue.")
  else prompt_for "$page" > "$batch/$page.prompt.txt"; args=(-p "$(cat "$batch/$page.prompt.txt")"); fi
  local tmp_before; tmp_before="$(ls -A /tmp)"
  ( cd "$pw" && claude "${args[@]}" --model "$model" \
      --dangerously-skip-permissions --disallowedTools WebSearch WebFetch \
      --output-format stream-json --verbose > "$batch/$page.log" 2>&1 ) || true
  stop_servers "$pw"
  pkill -f -- "--headless.*--user-data-dir=/tmp/" 2>/dev/null || true   # headless Chrome the agent left behind
  # scratch files the agent left in /tmp (its helper scripts, screenshots): only entries that appeared during this page
  comm -13 <(printf '%s\n' "$tmp_before" | sort) <(ls -A /tmp | sort) | while IFS= read -r f; do
    if [[ -n "$f" && -O "/tmp/$f" ]]; then rm -rf "/tmp/$f"; fi; done || true
  echo "▶ $page"
  if report "$batch/$page.log" "$pw" && [[ -f "$pw/$out/index.html" ]]; then
    rm -rf "$work/$out"; mkdir -p "$work/$out"; rsync -a "$pw/$out/" "$work/$out/"
    touch "$batch/$page.done"
    PORT="$((8800 + i))" "$repo/tools/shoot.sh" "$work" "/$out/" "$batch/_shots/$page" >/dev/null 2>&1 || true
    echo "    ✓ done: /$out/"
  else
    echo "    ⚠ $page did not finish (e.g. usage limit). Run the same command again to continue."
  fi
}

i=0
for page in "${pages[@]}"; do
  i=$((i+1))
  if [[ "$page" != homepage && ! -f "$work/$(spec_file "$page")" ]]; then echo "✗ skip $page: no $(spec_file "$page")"; continue; fi
  if [[ -f "$batch/$page.done" ]]; then echo "✓ $page already finished, skipping"; continue; fi
  build_page "$page" "$i"
done

echo
echo "Review:  tools/review.sh $batch_name      (serves the workshop at http://localhost:8765/)"
echo "Release: tools/release.sh $batch_name     (after Murad's OK)"
