#!/usr/bin/env bash
set -euo pipefail

# Validate objectFromFile visual specs by running the Archive subset from the
# promoted YAML spec.
BASE="prototype-design/visual-diff/userland"
SPEC="$BASE/specs/public-pages.desktop.visual.yml"
OUT="prototype-design/visual-comparisons/cssvd-js/compare-spec/archive-filter"
rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages compare-spec "$SPEC" \
  --page archive \
  --outDir "$OUT" \
  --output json
