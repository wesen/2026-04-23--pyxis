#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${PYXIS_REPO_ROOT:-/home/manuel/code/wesen/2026-04-23--pyxis}"
TICKET_ROOT="${PYXIS_STORYBOOK_CATALOG_TICKET:-$REPO_ROOT/ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components}"
CATALOG_ROOT="$TICKET_ROOT/various/story-catalog"
PORT="${PORT:-8795}"

if [[ ! -f "$CATALOG_ROOT/index.html" ]]; then
  echo "Catalog index not found: $CATALOG_ROOT/index.html" >&2
  echo "Run scripts/03-build-story-catalog-index.mjs first." >&2
  exit 2
fi

cd "$CATALOG_ROOT"
echo "Serving Pyxis Storybook catalog at http://localhost:$PORT/index.html"
python3 -m http.server "$PORT"
