#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/manuel/code/wesen/2026-04-23--pyxis"
VARIANT="${1:-desktop}"
RUN_NAME="${2:-run}"
OUT_DIR="$ROOT/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/07-dashboard-page/${VARIANT}/${RUN_NAME}"

case "$VARIANT" in
  desktop)
    SPEC="$ROOT/prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml"
    ;;
  mobile)
    SPEC="$ROOT/prototype-design/visual-diff/userland/specs/app.pages.mobile.visual.yml"
    ;;
  *)
    echo "usage: $0 [desktop|mobile] [run-name]" >&2
    exit 2
    ;;
esac

cd "$ROOT"
mkdir -p "$OUT_DIR"
SUMMARY_JSON="$OUT_DIR/dashboard-page.summary.json"

css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  "$SPEC" \
  --page dashboard \
  --section page \
  --summary \
  --outDir "$OUT_DIR" \
  --output json \
  | tee "$SUMMARY_JSON"
