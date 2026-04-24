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

mapfile -t CONFIGS < <(find "$TICKET_ROOT/sources/prototype-configs" -type f -name '*.css-visual-diff.yml' | sort)

failed=0
for cfg in "${CONFIGS[@]}"; do
  slug=$(basename "$cfg" .css-visual-diff.yml)
  out="$TICKET_ROOT/various/prototype-baseline/artifacts/$slug"
  echo "== $slug =="
  rm -rf "$out"
  if ! timeout 180s css-visual-diff inspect --config "$cfg" --side original --all-styles --out "$out"; then
    echo "!! failed: $slug" >&2
    failed=1
  fi
done

printf 'Prototype baseline artifacts written under:\n%s\n' "$TICKET_ROOT/various/prototype-baseline/artifacts"

if (( failed )); then
  echo "One or more prototype baseline configs failed." >&2
  exit 1
fi
