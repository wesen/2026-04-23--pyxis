#!/usr/bin/env bash
set -euo pipefail
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/summarize-results"
mkdir -p "$OUT"
css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages summarize-results \
  --resultsDir prototype-design/visual-comparisons/public-pages \
  --jsonOut "$OUT/page-diffs.json" \
  --markdown "$OUT/01-page-diffs.md" \
  --output json
