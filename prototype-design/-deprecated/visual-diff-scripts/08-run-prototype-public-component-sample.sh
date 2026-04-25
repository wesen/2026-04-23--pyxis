#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${PYXIS_REPO_ROOT:-$(cd "$SCRIPT_DIR/../../.." && pwd)}"
PROTOTYPE_DIR="$REPO_ROOT/prototype-design"
BASELINE_DIR="$REPO_ROOT/prototype-design/baseline"
PORT="${PYXIS_PROTOTYPE_PORT:-7070}"
CONFIG_DIR="$REPO_ROOT/prototype-design/visual-diff/public-components"
OUT_ROOT="$BASELINE_DIR/sample-public-components"

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

rm -rf "$OUT_ROOT"
mkdir -p "$OUT_ROOT"

for name in poster-redroom show-tile-redroom nav-desktop; do
  cfg="$CONFIG_DIR/$name.css-visual-diff.yml"
  echo "== $name =="
  timeout 90s css-visual-diff inspect --config "$cfg" --side original --all-styles --out "$OUT_ROOT/$name"
done

find "$OUT_ROOT" -maxdepth 3 -type f | sort
