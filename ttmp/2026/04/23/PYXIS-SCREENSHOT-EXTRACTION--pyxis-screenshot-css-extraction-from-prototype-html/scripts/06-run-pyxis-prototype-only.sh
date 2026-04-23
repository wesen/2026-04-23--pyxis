#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CSS_VD="/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff"
CONFIG="$CSS_VD/examples/pyxis-prototype-only.yaml"
OUT="$CSS_VD/examples/out/pyxis-prototype-only"

"$SCRIPT_DIR/05-serve-pyxis-prototype.sh"

cd "$CSS_VD"
rm -rf "$OUT"
GOWORK=off go run ./cmd/css-visual-diff run \
  --config "$CONFIG" \
  --modes capture,cssdiff,matched-styles,html-report \
  --output json | tee /tmp/pyxis-prototype-only-run.json

python3 - <<'PY'
import json, os
out='/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-only'
with open(os.path.join(out, 'capture.json')) as f:
    cap = json.load(f)
print('test_html', os.path.abspath(os.path.join(out, 'test.html')))
print('index_html', os.path.abspath(os.path.join(out, 'index.html')))
print('validation', [(v['target'], v['section'], v['status'], v.get('issues')) for v in cap.get('validation', [])])
print('files', sorted(os.listdir(out)))
PY
