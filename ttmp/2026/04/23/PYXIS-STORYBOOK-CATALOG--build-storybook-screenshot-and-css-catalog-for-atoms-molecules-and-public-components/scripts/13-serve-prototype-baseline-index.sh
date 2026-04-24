#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${PYXIS_REPO_ROOT:-/home/manuel/code/wesen/2026-04-23--pyxis}"
TICKET_ROOT="${PYXIS_STORYBOOK_CATALOG_TICKET:-$REPO_ROOT/ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components}"
BASELINE_DIR="$TICKET_ROOT/various/prototype-baseline"
PORT="${PYXIS_PROTOTYPE_BASELINE_PORT:-8795}"

if ! curl -fsS "http://localhost:$PORT/index.html" >/dev/null 2>&1; then
  echo "Starting prototype baseline index server on http://localhost:$PORT"
  nohup python3 -m http.server "$PORT" --directory "$BASELINE_DIR" >/tmp/pyxis-prototype-baseline-index-server.log 2>&1 &
  echo $! >/tmp/pyxis-prototype-baseline-index-server.pid
  sleep 1
fi

echo "Prototype baseline catalog index: http://localhost:$PORT/index.html"
