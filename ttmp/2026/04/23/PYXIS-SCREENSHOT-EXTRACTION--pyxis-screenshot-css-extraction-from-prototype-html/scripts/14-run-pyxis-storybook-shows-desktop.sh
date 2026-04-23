#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CSS_VD="/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff"
CONFIG="$CSS_VD/examples/pyxis-storybook-shows-desktop.yaml"
OUT="$CSS_VD/examples/out/pyxis-storybook-shows-desktop"

"$SCRIPT_DIR/05-serve-pyxis-prototype.sh"
"$SCRIPT_DIR/13-serve-user-site-storybook-static.sh"

cd "$CSS_VD"
rm -rf "$OUT"
GOWORK=off go run ./cmd/css-visual-diff run \
  --config "$CONFIG" \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report \
  --output json | tee /tmp/pyxis-storybook-shows-desktop-run.json

python3 - <<'PY'
import json, os
out='/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-storybook-shows-desktop'
print('test_html', os.path.abspath(os.path.join(out, 'test.html')))
with open(os.path.join(out, 'capture.json')) as f:
    cap = json.load(f)
print('coverage', cap.get('coverage'))
with open(os.path.join(out, 'pixeldiff.json')) as f:
    pix = json.load(f)
print('pixel_entries', [(e['section'], round(e.get('changed_percent') or 0, 4), e.get('skipped')) for e in pix.get('entries', [])])
PY
