#!/usr/bin/env bash
set -euo pipefail

# Full desktop public-page suite from the promoted YAML visual spec.
BASE="prototype-design/visual-diff/userland"
SPEC="$BASE/specs/public-pages.desktop.visual.yml"
OUT="prototype-design/visual-comparisons/cssvd-js/compare-spec/public-pages-desktop"
rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages compare-spec "$SPEC" \
  --outDir "$OUT" \
  --output json
