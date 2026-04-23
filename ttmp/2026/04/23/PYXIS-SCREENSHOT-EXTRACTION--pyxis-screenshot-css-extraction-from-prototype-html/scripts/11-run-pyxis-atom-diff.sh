#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYXIS_REPO="/home/manuel/code/wesen/2026-04-23--pyxis"
CSS_VD="/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff"
CONFIG="$CSS_VD/examples/pyxis-atoms-prototype-vs-storybook.yaml"
OUT="$CSS_VD/examples/out/pyxis-atoms-prototype-vs-storybook"
STORYBOOK_PORT="${PYXIS_STORYBOOK_PORT:-6006}"
STORY_ID="atoms-atom-diff-fixture--default"
STORYBOOK_PID_FILE="/tmp/pyxis-storybook-${STORYBOOK_PORT}.pid"
STORYBOOK_LOG_FILE="/tmp/pyxis-storybook-${STORYBOOK_PORT}.log"

"$SCRIPT_DIR/05-serve-pyxis-prototype.sh"

# Restart Storybook so newly added fixture stories are guaranteed to be indexed.
if [[ -f "$STORYBOOK_PID_FILE" ]]; then
  old_pid="$(cat "$STORYBOOK_PID_FILE" || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" >/dev/null 2>&1; then
    kill "$old_pid" >/dev/null 2>&1 || true
  fi
fi
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${STORYBOOK_PORT}/tcp" >/dev/null 2>&1 || true
fi
cd "$PYXIS_REPO/web"
nohup pnpm --filter pyxis-components storybook -- --ci >"$STORYBOOK_LOG_FILE" 2>&1 &
echo $! >"$STORYBOOK_PID_FILE"

for i in $(seq 1 90); do
  if curl -fsS "http://localhost:${STORYBOOK_PORT}/index.json" | grep -q "${STORY_ID}"; then
    break
  fi
  sleep 1
  if [[ "$i" == "90" ]]; then
    echo "Timed out waiting for Storybook story ${STORY_ID}" >&2
    echo "Storybook log: $STORYBOOK_LOG_FILE" >&2
    exit 1
  fi
done

cd "$CSS_VD"
rm -rf "$OUT"
GOWORK=off go run ./cmd/css-visual-diff run \
  --config "$CONFIG" \
  --modes capture,cssdiff,pixeldiff,html-report \
  --output json | tee /tmp/pyxis-atoms-prototype-vs-storybook-run.json

python3 - <<'PY'
import json, os
out='/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-atoms-prototype-vs-storybook'
with open(os.path.join(out, 'capture.json')) as f:
    cap = json.load(f)
with open(os.path.join(out, 'pixeldiff.json')) as f:
    pix = json.load(f)
print('test_html', os.path.abspath(os.path.join(out, 'test.html')))
print('index_html', os.path.abspath(os.path.join(out, 'index.html')))
print('coverage', cap.get('coverage'))
print('pixel_entries_top10', [(e['section'], round(e.get('changed_percent') or 0, 4), e.get('skipped')) for e in pix.get('entries', [])[:10]])
print('files', sorted(os.listdir(out))[:10], '... total', len(os.listdir(out)))
PY
