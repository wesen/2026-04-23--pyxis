#!/usr/bin/env bash
set -euo pipefail

# Validate CI mode: compare-all should write JSON/Markdown reports, then exit
# non-zero when the configured policy threshold fails.
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library"
OUT="$BASE/various/07-compare-all/archive-filter-ci-fail"
rm -rf "$OUT"
mkdir -p "$OUT"

set +e
css-visual-diff verbs \
  --repository "$BASE/scripts" \
  pyxis pages compare-all \
  --page archive \
  --outDir "$OUT" \
  --threshold 30 \
  --inspect minimal \
  --mode ci \
  --maxChangedPercent 1 \
  --output json > "$OUT/stdout.json" 2> "$OUT/stderr.txt"
code=$?
set -e

if [[ "$code" -eq 0 ]]; then
  echo "expected compare-all --mode ci to fail for --maxChangedPercent 1" >&2
  exit 1
fi

test -f "$OUT/compare-all-output.json"
test -f "$OUT/01-suite-summary.md"

python3 - <<'PY'
import json
from pathlib import Path
base = Path('ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/various/07-compare-all/archive-filter-ci-fail')
run = json.loads((base / 'compare-all-output.json').read_text())[0]
assert run['mode'] == 'ci', run['mode']
assert run['policy']['ok'] is False, run['policy']
assert len(run['policy']['failures']) == 2, run['policy']['failures']
assert run['policy']['maxChangedPercent'] == 1, run['policy']
print('ci policy failure smoke passed')
PY
