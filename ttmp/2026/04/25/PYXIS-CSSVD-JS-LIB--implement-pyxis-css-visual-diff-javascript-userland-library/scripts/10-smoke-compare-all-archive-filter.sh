#!/usr/bin/env bash
set -euo pipefail

# Fast compare-all smoke: exercise the suite orchestration with one filtered
# page while still going through pyxis pages compare-all.
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library"
OUT="$BASE/various/07-compare-all/archive-filter"
rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE/scripts" \
  pyxis pages compare-all \
  --page archive \
  --outDir "$OUT" \
  --threshold 30 \
  --inspect rich \
  --output json
