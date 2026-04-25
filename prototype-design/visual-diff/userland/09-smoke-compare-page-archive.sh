#!/usr/bin/env bash
set -euo pipefail

# Compare all registered Archive page sections with the new flexible JS API and
# write a css-visual-diff catalog.
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/compare-page/archive"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages compare-page archive \
  --outDir "$OUT" \
  --threshold 30 \
  --inspect rich \
  --output json

# The library writes 01-catalog-index.md directly so committed artifacts remain
# docmgr-friendly and stdout paths stay accurate.
