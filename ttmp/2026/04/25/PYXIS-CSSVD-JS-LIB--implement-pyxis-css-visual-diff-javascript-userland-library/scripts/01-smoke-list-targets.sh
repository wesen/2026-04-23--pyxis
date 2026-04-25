#!/usr/bin/env bash
set -euo pipefail
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library"
css-visual-diff verbs \
  --repository "$BASE/scripts" \
  pyxis pages list-targets \
  --output json
