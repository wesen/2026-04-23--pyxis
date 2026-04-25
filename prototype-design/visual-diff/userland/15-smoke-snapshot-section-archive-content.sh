#!/usr/bin/env bash
set -euo pipefail

# Phase 6 smoke: write a semantic snapshot/diff for one stable section.
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/snapshot-section/archive-content"
rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages snapshot-section archive content \
  --outDir "$OUT" \
  --stylePreset pageShell \
  --toleranceWidth 0 \
  --toleranceHeight 0 \
  --output json
