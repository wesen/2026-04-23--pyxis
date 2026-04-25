#!/usr/bin/env bash
set -euo pipefail

# Full desktop public-page suite. This writes one catalog per page plus an
# aggregate suite JSON/Markdown summary.
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/compare-all/public-pages-desktop"
rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages compare-all \
  --outDir "$OUT" \
  --threshold 30 \
  --inspect rich \
  --output json
