#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="${PYXIS_REPO_ROOT:-/home/manuel/code/wesen/2026-04-23--pyxis}"
TICKET_ROOT="${PYXIS_STORYBOOK_CATALOG_TICKET:-$REPO_ROOT/ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components}"
STORYBOOK_STATIC="$REPO_ROOT/web/packages/pyxis-components/storybook-static"
PORT="${PYXIS_COMPONENTS_STORYBOOK_PORT:-6006}"

cd "$REPO_ROOT"

if [[ ! -f "$STORYBOOK_STATIC/index.json" ]]; then
  echo "Component Storybook static bundle missing; building it first..."
  (cd "$REPO_ROOT/web" && pnpm --filter pyxis-components build-storybook)
fi

if ! curl -fsS "http://localhost:$PORT/iframe.html" >/dev/null 2>&1; then
  echo "Storybook static server is not reachable at http://localhost:$PORT; starting python server..."
  nohup python3 -m http.server "$PORT" --directory "$STORYBOOK_STATIC" >/tmp/pyxis-components-storybook-catalog-server.log 2>&1 &
  echo $! >/tmp/pyxis-components-storybook-catalog-server.pid
  sleep 1
fi

"$TICKET_ROOT/scripts/01-generate-story-catalog-configs.mjs"
"$TICKET_ROOT/scripts/02-run-story-catalog-inspect.sh"
"$TICKET_ROOT/scripts/03-build-story-catalog-index.mjs"

echo "Catalog ready: $TICKET_ROOT/various/story-catalog/index.html"
echo "Serve with: $TICKET_ROOT/scripts/04-serve-story-catalog.sh"
