#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${PYXIS_REPO_ROOT:-$(cd "$SCRIPT_DIR/../../.." && pwd)}"
CONFIG_DIR="$REPO_ROOT/prototype-design/visual-diff"
PROTOTYPE_DIR="$REPO_ROOT/prototype-design"
BASELINE_DIR="$REPO_ROOT/prototype-design/baseline"
PORT="${PYXIS_PROTOTYPE_PORT:-7070}"

if ! command -v css-visual-diff >/dev/null 2>&1; then
  echo "css-visual-diff executable not found on PATH" >&2
  echo "Install it from /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff with: make install" >&2
  exit 127
fi

if ! curl -fsS "http://localhost:$PORT/standalone/full-app/index.html" >/dev/null 2>&1; then
  echo "Starting prototype static server on http://localhost:$PORT"
  nohup python3 -m http.server "$PORT" --directory "$PROTOTYPE_DIR" >/tmp/pyxis-prototype-catalog-server.log 2>&1 &
  echo $! >/tmp/pyxis-prototype-catalog-server.pid
  sleep 1
fi

BASE_OUT="$BASELINE_DIR/sample-full-app"
rm -rf "$BASE_OUT"
mkdir -p "$BASE_OUT"

SAMPLE_CFGS=(
  "$CONFIG_DIR/prototype-full-app-login.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-full-app-dashboard.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-full-app-shows.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-full-app-modal.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-full-app-discord.css-visual-diff.yml"
  "$CONFIG_DIR/prototype-full-app-settings.css-visual-diff.yml"
)

for cfg in "${SAMPLE_CFGS[@]}"; do
  slug=$(basename "$cfg" .css-visual-diff.yml)
  out="$BASE_OUT/$slug"
  echo "== $slug =="
  timeout 120s css-visual-diff inspect --config "$cfg" --side original --all-styles --out "$out"
done

find "$BASE_OUT" -maxdepth 3 -type f | sort
