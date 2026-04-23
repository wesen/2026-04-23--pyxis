#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYXIS_REPO="/home/manuel/code/wesen/2026-04-23--pyxis"
CSS_VD="/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff"
CONFIG="$CSS_VD/examples/pyxis-prototype-vs-app.yaml"
OUT="$CSS_VD/examples/out/pyxis-prototype-vs-app"
APP_PORT="${PYXIS_APP_PORT:-8790}"
APP_PID_FILE="/tmp/pyxis-app-${APP_PORT}.pid"
APP_LOG_FILE="/tmp/pyxis-app-${APP_PORT}.log"

"$SCRIPT_DIR/05-serve-pyxis-prototype.sh"

cd "$PYXIS_REPO/web"
pnpm --filter pyxis-user-site build

# Always restart the app fixture server so this run uses the versioned ticket
# script (including local SVG flyer data URLs) instead of any stale /tmp server.
if [[ -f "$APP_PID_FILE" ]]; then
  old_pid="$(cat "$APP_PID_FILE" || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" >/dev/null 2>&1; then
    kill "$old_pid" >/dev/null 2>&1 || true
  fi
fi
# Also clear any process currently bound to the app port.
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${APP_PORT}/tcp" >/dev/null 2>&1 || true
fi
nohup node "$SCRIPT_DIR/07-pyxis-app-server.mjs" >"$APP_LOG_FILE" 2>&1 &
echo $! >"$APP_PID_FILE"
sleep 1
curl -fsS "http://localhost:${APP_PORT}/api/public/shows" >/dev/null

cd "$CSS_VD"
rm -rf "$OUT"
GOWORK=off go run ./cmd/css-visual-diff run \
  --config "$CONFIG" \
  --modes capture,cssdiff,pixeldiff,html-report \
  --output json | tee /tmp/pyxis-prototype-vs-app-run.json

python3 - <<'PY'
import json, os
out='/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-vs-app'
with open(os.path.join(out, 'capture.json')) as f:
    cap = json.load(f)
with open(os.path.join(out, 'pixeldiff.json')) as f:
    pix = json.load(f)
print('test_html', os.path.abspath(os.path.join(out, 'test.html')))
print('index_html', os.path.abspath(os.path.join(out, 'index.html')))
print('validation', [(v['target'], v['section'], v['status'], v.get('issues')) for v in cap.get('validation', [])])
print('pixel_entries', [(e['section'], e.get('changed_percent'), e.get('skipped')) for e in pix.get('entries', [])])
print('files', sorted(os.listdir(out)))
PY
