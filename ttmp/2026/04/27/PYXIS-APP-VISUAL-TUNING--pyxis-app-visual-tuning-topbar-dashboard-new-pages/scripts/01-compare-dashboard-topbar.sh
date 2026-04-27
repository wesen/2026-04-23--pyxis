#!/usr/bin/env bash
set -euo pipefail

# Run visual diff on app topbar section using the existing app.pages.desktop spec
BASE="prototype-design/visual-diff/userland"
OUT="ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/various/topbar-compare"
rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages compare-section dashboard topbar \
  --variant desktop \
  --outDir "$OUT" \
  --output json
