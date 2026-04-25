#!/usr/bin/env bash
set -euo pipefail

# Capture the current css-visual-diff JavaScript API docs after the flexible JS
# API update, so the experiment can be replayed and the report can cite exactly
# what was read.
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library"
OUT="$BASE/sources/css-visual-diff-help-2026-04-25-flexible-js-api"
mkdir -p "$OUT"

css-visual-diff help > "$OUT/root-help.txt"
css-visual-diff help javascript-api > "$OUT/javascript-api.txt"
css-visual-diff help javascript-verbs > "$OUT/javascript-verbs.txt"
css-visual-diff help pixel-accuracy-scripting-guide > "$OUT/pixel-accuracy-scripting-guide.txt"

wc -l "$OUT"/root-help.txt "$OUT"/javascript-api.txt "$OUT"/javascript-verbs.txt "$OUT"/pixel-accuracy-scripting-guide.txt
