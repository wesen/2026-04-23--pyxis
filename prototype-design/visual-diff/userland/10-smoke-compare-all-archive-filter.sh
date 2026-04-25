#!/usr/bin/env bash
set -euo pipefail

# Fast compare-all smoke: exercise the suite orchestration with one filtered
# page while still going through pyxis pages compare-all.
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/compare-all/archive-filter"
rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages compare-all \
  --page archive \
  --outDir "$OUT" \
  --threshold 30 \
  --inspect rich \
  --output json
