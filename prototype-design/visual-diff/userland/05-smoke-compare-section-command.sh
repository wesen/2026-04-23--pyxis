#!/usr/bin/env bash
set -euo pipefail
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/compare-section-command"
mkdir -p "$OUT"
css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages compare-section-command archive content \
  --outDir "$OUT/archive-content" \
  --output json
