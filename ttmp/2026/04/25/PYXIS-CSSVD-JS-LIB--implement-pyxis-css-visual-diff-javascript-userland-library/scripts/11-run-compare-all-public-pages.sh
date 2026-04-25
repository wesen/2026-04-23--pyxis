#!/usr/bin/env bash
set -euo pipefail

# Full desktop public-page suite. This writes one catalog per page plus an
# aggregate suite JSON/Markdown summary.
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library"
OUT="$BASE/various/07-compare-all/public-pages-desktop"
rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE/scripts" \
  pyxis pages compare-all \
  --outDir "$OUT" \
  --threshold 30 \
  --inspect rich \
  --output json
