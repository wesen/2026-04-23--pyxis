#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${PYXIS_REPO_ROOT:-/home/manuel/code/wesen/2026-04-23--pyxis}"
TICKET_ROOT="${PYXIS_STORYBOOK_CATALOG_TICKET:-$REPO_ROOT/ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components}"
PROTOTYPE_DIR="$REPO_ROOT/prototype-design"
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

FOUNDATIONS_CFG="$TICKET_ROOT/sources/prototype-configs/prototype-foundations-system.css-visual-diff.yml"
PUBLIC_CFG="$TICKET_ROOT/sources/prototype-configs/prototype-public-shows.css-visual-diff.yml"
BASE_OUT="$TICKET_ROOT/various/prototype-baseline/sample"
rm -rf "$BASE_OUT"
mkdir -p "$BASE_OUT"

css-visual-diff inspect --config "$FOUNDATIONS_CFG" --side original --style primary-button --out "$BASE_OUT/foundations-primary-button"
css-visual-diff inspect --config "$FOUNDATIONS_CFG" --side original --style form-fields-card --out "$BASE_OUT/foundations-form-fields-card"
css-visual-diff inspect --config "$PUBLIC_CFG" --side original --style nav --out "$BASE_OUT/public-nav"
css-visual-diff inspect --config "$PUBLIC_CFG" --side original --style first-show-tile --out "$BASE_OUT/public-first-show-tile"
css-visual-diff inspect --config "$PUBLIC_CFG" --side original --style first-poster --out "$BASE_OUT/public-first-poster"

find "$BASE_OUT" -maxdepth 2 -type f | sort
