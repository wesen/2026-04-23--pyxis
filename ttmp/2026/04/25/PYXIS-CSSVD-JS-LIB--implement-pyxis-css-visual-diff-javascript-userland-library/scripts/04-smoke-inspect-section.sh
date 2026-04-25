#!/usr/bin/env bash
set -euo pipefail
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library"
OUT="$BASE/various/03-inspect-section"
mkdir -p "$OUT"
css-visual-diff verbs \
  --repository "$BASE/scripts" \
  pyxis pages inspect-section archive content \
  --stylePreset pageShell \
  --failOnMissing \
  --output json
