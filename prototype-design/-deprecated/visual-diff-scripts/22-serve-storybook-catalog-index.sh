#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${PYXIS_REPO_ROOT:-$(cd "$SCRIPT_DIR/../../.." && pwd)}"
CATALOG_DIR="$REPO_ROOT/prototype-design/storybook-catalog"
PORT="${PYXIS_STORYBOOK_CATALOG_PORT:-8796}"

if [[ ! -f "$CATALOG_DIR/index.html" ]]; then
  echo "Missing catalog index: $CATALOG_DIR/index.html" >&2
  echo "Run: node $SCRIPT_DIR/21-build-storybook-catalog-index.mjs" >&2
  exit 2
fi

cd "$REPO_ROOT"
echo "Serving Storybook catalog at http://localhost:$PORT/prototype-design/storybook-catalog/index.html"
python3 -m http.server "$PORT"
