#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/manuel/code/wesen/2026-04-23--pyxis"
OUT_DIR="$ROOT/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/06-css-loop-dashboard-metrics/${1:-run}"
SPEC="$ROOT/prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml"

cd "$ROOT"
mkdir -p "$OUT_DIR"
SUMMARY_JSON="$OUT_DIR/dashboard-metrics.summary.json"

css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  "$SPEC" \
  --page dashboard \
  --section metrics \
  --summary \
  --outDir "$OUT_DIR" \
  --output json \
  | tee "$SUMMARY_JSON"
