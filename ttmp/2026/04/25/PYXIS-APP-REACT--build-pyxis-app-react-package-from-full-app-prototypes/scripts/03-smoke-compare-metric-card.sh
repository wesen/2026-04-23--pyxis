#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/manuel/code/wesen/2026-04-23--pyxis"
OUT_DIR="$ROOT/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/05-css-loop-metric-card/${1:-run}"
SPEC="$ROOT/prototype-design/visual-diff/userland/specs/app.components.visual.yml"

cd "$ROOT"
mkdir -p "$OUT_DIR"
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  "$SPEC" \
  --page metric-card \
  --outDir "$OUT_DIR" \
  --output json \
  | tee "$OUT_DIR/metric-card.json"
