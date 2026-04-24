#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${PYXIS_REPO_ROOT:-$(cd "$SCRIPT_DIR/../../.." && pwd)}"
CONFIG_DIR="$REPO_ROOT/prototype-design/visual-diff/storybook-components"
STORYBOOK_DIR="$REPO_ROOT/web/packages/pyxis-components/storybook-static"
CATALOG_DIR="$REPO_ROOT/prototype-design/storybook-catalog"
PORT="${PYXIS_COMPONENTS_STORYBOOK_PORT:-6006}"

if ! command -v css-visual-diff >/dev/null 2>&1; then
  echo "css-visual-diff executable not found on PATH" >&2
  exit 127
fi

if [[ ! -f "$STORYBOOK_DIR/index.json" ]]; then
  echo "Missing Storybook static bundle: $STORYBOOK_DIR/index.json" >&2
  echo "Run: cd $REPO_ROOT/web && pnpm --filter pyxis-components build-storybook" >&2
  exit 2
fi

if ! curl -fsS "http://localhost:$PORT/index.json" >/dev/null 2>&1; then
  echo "Starting pyxis-components Storybook static server on http://localhost:$PORT"
  nohup python3 -m http.server "$PORT" --directory "$STORYBOOK_DIR" >/tmp/pyxis-components-storybook-server.log 2>&1 &
  echo $! >/tmp/pyxis-components-storybook-server.pid
  sleep 1
fi

BASE_OUT="$CATALOG_DIR/sample-atoms"
rm -rf "$BASE_OUT"
mkdir -p "$BASE_OUT"

SAMPLE_CONFIGS=(
  "$CONFIG_DIR/atoms/atom-diff-fixture/default/config.css-visual-diff.yml"
  "$CONFIG_DIR/atoms/button/default/config.css-visual-diff.yml"
  "$CONFIG_DIR/atoms/badge/default/config.css-visual-diff.yml"
  "$CONFIG_DIR/atoms/tag/default/config.css-visual-diff.yml"
  "$CONFIG_DIR/atoms/input/default/config.css-visual-diff.yml"
  "$CONFIG_DIR/atoms/select/default/config.css-visual-diff.yml"
  "$CONFIG_DIR/atoms/textarea/default/config.css-visual-diff.yml"
  "$CONFIG_DIR/atoms/avatar/default/config.css-visual-diff.yml"
  "$CONFIG_DIR/atoms/icon/default/config.css-visual-diff.yml"
)

for cfg in "${SAMPLE_CONFIGS[@]}"; do
  if [[ ! -f "$cfg" ]]; then
    echo "Missing generated config: $cfg" >&2
    echo "Run: node $SCRIPT_DIR/18-generate-storybook-design-system-configs.mjs" >&2
    exit 2
  fi
  rel="${cfg#$CONFIG_DIR/}"
  out="$BASE_OUT/${rel%/config.css-visual-diff.yml}"
  echo "== ${rel%/config.css-visual-diff.yml} =="
  timeout 120s css-visual-diff inspect --config "$cfg" --side original --all-styles --out "$out"
done

find "$BASE_OUT" -maxdepth 5 -type f | sort
