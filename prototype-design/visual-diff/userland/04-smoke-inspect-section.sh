#!/usr/bin/env bash
set -euo pipefail
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/inspect-section"
mkdir -p "$OUT"
css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages inspect-section archive content \
  --stylePreset pageShell \
  --failOnMissing \
  --output json
