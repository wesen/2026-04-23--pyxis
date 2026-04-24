#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${PYXIS_REPO_ROOT:-/home/manuel/code/wesen/2026-04-23--pyxis}"
TICKET_ROOT="${PYXIS_STORYBOOK_CATALOG_TICKET:-$REPO_ROOT/ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components}"
MANIFEST="$TICKET_ROOT/various/story-catalog/manifest.json"
ARTIFACT_ROOT="$TICKET_ROOT/various/story-catalog/artifacts"
STATUS_TSV="$TICKET_ROOT/various/story-catalog/status.tsv"
FAILURES_TSV="$TICKET_ROOT/various/story-catalog/failures.tsv"
LIMIT="${LIMIT:-0}"
STORY_GREP="${STORY_GREP:-}"

if ! command -v css-visual-diff >/dev/null 2>&1; then
  echo "css-visual-diff executable not found on PATH" >&2
  echo "Install it from /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff with: make install" >&2
  exit 127
fi

if [[ ! -f "$MANIFEST" ]]; then
  echo "Manifest not found: $MANIFEST" >&2
  echo "Run scripts/01-generate-story-catalog-configs.mjs first." >&2
  exit 2
fi

mkdir -p "$ARTIFACT_ROOT"
printf 'story_id\tprobe\tstatus\toutput\n' > "$STATUS_TSV"
printf 'story_id\tprobe\terror\n' > "$FAILURES_TSV"

mapfile -t ROWS < <(LIMIT="$LIMIT" STORY_GREP="$STORY_GREP" python3 - "$MANIFEST" <<'PY'
import json, os, sys
manifest = json.load(open(sys.argv[1]))
limit = int(os.environ.get('LIMIT') or '0')
grep = os.environ.get('STORY_GREP') or ''
rows = []
for story in manifest['stories']:
    haystack = '\t'.join([story['id'], story['title'], story['name'], story['top'], story['component']])
    if grep and grep.lower() not in haystack.lower():
        continue
    rows.append(story)
if limit > 0:
    rows = rows[:limit]
for story in rows:
    print('\t'.join([story['id'], story['config'], story['relDir']]))
PY
)

total=${#ROWS[@]}
if [[ "$total" -eq 0 ]]; then
  echo "No stories matched LIMIT=$LIMIT STORY_GREP=$STORY_GREP" >&2
  exit 2
fi

failures=0
index=0
start_epoch=$(date +%s)

for row in "${ROWS[@]}"; do
  index=$((index + 1))
  IFS=$'\t' read -r story_id config_rel rel_dir <<< "$row"
  config="$TICKET_ROOT/$config_rel"
  out_base="$ARTIFACT_ROOT/$rel_dir"
  echo "[$index/$total] $story_id"

  rm -rf "$out_base"
  mkdir -p "$out_base"

  # Important speedup: --all-styles loads the Storybook iframe once and then writes
  # both story-root and component-focus bundles from the settled page. The previous
  # runner loaded Storybook once per probe, doubling navigation/wait cost.
  if css-visual-diff inspect --config "$config" --side react --all-styles --out "$out_base" >/tmp/pyxis-story-catalog-inspect.log 2>&1; then
    for probe in story-root component-focus; do
      if [[ -f "$out_base/$probe/screenshot.png" && -f "$out_base/$probe/computed-css.md" ]]; then
        printf '%s\t%s\tok\t%s\n' "$story_id" "$probe" "$out_base/$probe" >> "$STATUS_TSV"
      else
        failures=$((failures + 1))
        printf '%s\t%s\t%s\n' "$story_id" "$probe" "missing expected screenshot.png or computed-css.md" >> "$FAILURES_TSV"
        printf '%s\t%s\tfail\t%s\n' "$story_id" "$probe" "$out_base/$probe" >> "$STATUS_TSV"
      fi
    done
  else
    failures=$((failures + 2))
    error=$(tr '\n' ' ' < /tmp/pyxis-story-catalog-inspect.log | sed 's/[[:space:]]\+/ /g' | cut -c 1-500)
    for probe in story-root component-focus; do
      printf '%s\t%s\t%s\n' "$story_id" "$probe" "$error" >> "$FAILURES_TSV"
      printf '%s\t%s\tfail\t%s\n' "$story_id" "$probe" "$out_base/$probe" >> "$STATUS_TSV"
    done
    echo "  ! inspect failed: $error" >&2
  fi
done

elapsed=$(( $(date +%s) - start_epoch ))
echo "Wrote $STATUS_TSV"
echo "Inspected $total stories in ${elapsed}s (LIMIT=$LIMIT STORY_GREP=${STORY_GREP:-<none>})"
if [[ "$failures" -gt 0 ]]; then
  echo "Completed with $failures probe failures. See $FAILURES_TSV" >&2
  # A few focus failures are acceptable in catalog mode because story-root still captures
  # the rendered story. Exit non-zero only when this looks systemic.
  if [[ "$failures" -gt 12 ]]; then
    exit 1
  fi
fi
