#!/usr/bin/env bash
set -euo pipefail
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library"
OUT="$BASE/various/04-compare-section-command"
mkdir -p "$OUT"
css-visual-diff verbs \
  --repository "$BASE/scripts" \
  pyxis pages compare-section-command archive content \
  --outDir "$OUT/archive-content" \
  --output json
