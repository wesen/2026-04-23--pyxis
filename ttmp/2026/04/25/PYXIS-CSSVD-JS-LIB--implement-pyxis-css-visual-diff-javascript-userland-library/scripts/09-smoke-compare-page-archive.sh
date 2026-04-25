#!/usr/bin/env bash
set -euo pipefail

# Compare all registered Archive page sections with the new flexible JS API and
# write a css-visual-diff catalog.
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library"
OUT="$BASE/various/06-compare-page/archive"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE/scripts" \
  pyxis pages compare-page archive \
  --outDir "$OUT" \
  --threshold 30 \
  --inspect rich \
  --output json

# The library writes 01-catalog-index.md directly so committed artifacts remain
# docmgr-friendly and stdout paths stay accurate.
