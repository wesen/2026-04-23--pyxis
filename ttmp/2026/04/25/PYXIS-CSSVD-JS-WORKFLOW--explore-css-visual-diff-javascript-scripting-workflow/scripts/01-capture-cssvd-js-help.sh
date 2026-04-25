#!/usr/bin/env bash
set -euo pipefail

# Capture the css-visual-diff JavaScript/pixel-accuracy scripting docs that
# shape this ticket. Run from the repository root.
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow"
OUT="$BASE/sources/css-visual-diff-help"
mkdir -p "$OUT"

css-visual-diff help pixel-accuracy-scripting-guide > "$OUT/pixel-accuracy-scripting-guide.txt"
css-visual-diff help javascript-api > "$OUT/javascript-api.txt"
css-visual-diff help javascript-verbs > "$OUT/javascript-verbs.txt"
css-visual-diff help inspect-workflow > "$OUT/inspect-workflow.txt"

wc -l "$OUT"/*.txt
