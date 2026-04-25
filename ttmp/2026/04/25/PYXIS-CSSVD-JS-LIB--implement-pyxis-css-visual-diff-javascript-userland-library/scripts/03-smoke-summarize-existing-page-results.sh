#!/usr/bin/env bash
set -euo pipefail
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library"
OUT="$BASE/various/02-summarize-results"
mkdir -p "$OUT"
css-visual-diff verbs \
  --repository "$BASE/scripts" \
  pyxis pages summarize-results \
  --resultsDir prototype-design/visual-comparisons/public-pages \
  --jsonOut "$OUT/page-diffs.json" \
  --markdown "$OUT/01-page-diffs.md" \
  --output json
