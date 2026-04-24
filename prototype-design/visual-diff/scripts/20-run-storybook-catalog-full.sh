#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${PYXIS_REPO_ROOT:-$(cd "$SCRIPT_DIR/../../.." && pwd)}"
MANIFEST="$REPO_ROOT/prototype-design/storybook-catalog/manifest.json"
STORYBOOK_DIR="$REPO_ROOT/web/packages/pyxis-components/storybook-static"
PORT="${PYXIS_COMPONENTS_STORYBOOK_PORT:-6006}"
LIMIT_GROUP="${PYXIS_STORYBOOK_CATALOG_GROUP:-}"

if ! command -v css-visual-diff >/dev/null 2>&1; then
  echo "css-visual-diff executable not found on PATH" >&2
  exit 127
fi

if [[ ! -f "$STORYBOOK_DIR/index.json" ]]; then
  echo "Missing Storybook static bundle: $STORYBOOK_DIR/index.json" >&2
  echo "Run: cd $REPO_ROOT/web && pnpm --filter pyxis-components build-storybook" >&2
  exit 2
fi

if [[ ! -f "$MANIFEST" ]]; then
  echo "Missing Storybook catalog manifest: $MANIFEST" >&2
  echo "Run: node $SCRIPT_DIR/18-generate-storybook-design-system-configs.mjs" >&2
  exit 2
fi

if ! curl -fsS "http://localhost:$PORT/index.json" >/dev/null 2>&1; then
  echo "Starting pyxis-components Storybook static server on http://localhost:$PORT"
  nohup python3 -m http.server "$PORT" --directory "$STORYBOOK_DIR" >/tmp/pyxis-components-storybook-server.log 2>&1 &
  echo $! >/tmp/pyxis-components-storybook-server.pid
  sleep 1
fi

mapfile -t CONFIGS < <(node - "$MANIFEST" "$REPO_ROOT" "$LIMIT_GROUP" <<'NODE'
const fs = require('fs');
const path = require('path');
const [manifestPath, repoRoot, group] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
for (const entry of manifest.entries) {
  if (group && entry.group !== group) continue;
  console.log(path.join(repoRoot, entry.config));
}
NODE
)

if [[ ${#CONFIGS[@]} -eq 0 ]]; then
  echo "No configs selected. group='$LIMIT_GROUP'" >&2
  exit 2
fi

for cfg in "${CONFIGS[@]}"; do
  rel="${cfg#$REPO_ROOT/}"
  echo "== $rel =="
  timeout 180s css-visual-diff inspect --config "$cfg" --side original --all-styles
done

node "$SCRIPT_DIR/21-build-storybook-catalog-index.mjs"
