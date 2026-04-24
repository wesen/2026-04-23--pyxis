#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${PYXIS_REPO_ROOT:-/home/manuel/code/wesen/2026-04-23--pyxis}"
CONFIG_DIR="$REPO_ROOT/prototype-design/visual-diff"
PROTOTYPE_DIR="$REPO_ROOT/prototype-design"
BASELINE_DIR="$REPO_ROOT/prototype-design/baseline"
PORT="${PYXIS_PROTOTYPE_PORT:-7070}"

if ! command -v css-visual-diff >/dev/null 2>&1; then
  echo "css-visual-diff executable not found on PATH" >&2
  echo "Install it from /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff with: make install" >&2
  exit 127
fi

if ! curl -fsS "http://localhost:$PORT/Pyxis%20Public%20Site.html" >/dev/null 2>&1; then
  echo "Starting prototype static server on http://localhost:$PORT"
  nohup python3 -m http.server "$PORT" --directory "$PROTOTYPE_DIR" >/tmp/pyxis-prototype-catalog-server.log 2>&1 &
  echo $! >/tmp/pyxis-prototype-catalog-server.pid
  sleep 1
fi

BASE_OUT="$BASELINE_DIR/sample"
rm -rf "$BASE_OUT"
mkdir -p "$BASE_OUT"

SAMPLE_CFGS=(
  "$CONFIG_DIR/prototype-foundations-system.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-public-shows.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-public-shows-mobile.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-public-detail.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-public-archive.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-public-book.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-public-about.css-visual-diff.yml"
  "$CONFIG_DIR/public-components/nav-desktop.css-visual-diff.yml"
  "$CONFIG_DIR/public-components/nav-mobile.css-visual-diff.yml"
  "$CONFIG_DIR/public-components/footer-desktop.css-visual-diff.yml"
  "$CONFIG_DIR/public-components/footer-mobile.css-visual-diff.yml"
  "$CONFIG_DIR/public-components/page-header-shows.css-visual-diff.yml"
  "$CONFIG_DIR/public-components/show-grid-desktop.css-visual-diff.yml"
  "$CONFIG_DIR/public-components/show-grid-mobile.css-visual-diff.yml"
  "$CONFIG_DIR/public-components/poster-redroom.css-visual-diff.yml"
  "$CONFIG_DIR/public-components/show-tile-redroom.css-visual-diff.yml"
)

for cfg in "${SAMPLE_CFGS[@]}"; do
  slug=$(basename "$cfg" .css-visual-diff.yml)
  out="$BASE_OUT/$slug"
  echo "== $slug =="
  timeout 120s css-visual-diff inspect --config "$cfg" --side original --all-styles --out "$out"
done

find "$BASE_OUT" -maxdepth 3 -type f | sort
