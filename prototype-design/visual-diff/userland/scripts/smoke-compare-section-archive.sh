#!/usr/bin/env bash
set -euo pipefail

# Exercise the new flexible css-visual-diff JS API through our userland verb.
# This should use cvd.compare.region(...) directly rather than shelling out to
# the built-in `verbs script compare region` command.
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/compare-section/archive-content"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages compare-section archive content \
  --outDir "$OUT" \
  --threshold 30 \
  --inspect rich \
  --output json

# Keep generated Markdown docmgr-friendly if this artifact directory is committed.
if [[ -f "$OUT/compare.md" ]]; then
  mv "$OUT/compare.md" "$OUT/01-compare-report.md"
fi
