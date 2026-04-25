#!/usr/bin/env bash
set -euo pipefail
BASE="prototype-design/visual-diff/userland"
css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages import-smoke \
  --output json
