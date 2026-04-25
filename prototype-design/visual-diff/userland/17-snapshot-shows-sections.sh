#!/usr/bin/env bash
set -euo pipefail

# Diagnostic snapshots for the largest residual public page diffs.
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/snapshot-section/shows"
rm -rf "$OUT"
mkdir -p "$OUT"

for section in header shows-list mailing-list content; do
  css-visual-diff verbs \
    --repository "$BASE" \
    pyxis pages snapshot-section shows "$section" \
    --outDir "$OUT/$section" \
    --stylePreset pageShell \
    --output json > "$OUT/$section-output.json"
done

python3 - <<'PY'
import json
from pathlib import Path
base = Path('prototype-design/visual-comparisons/cssvd-js/snapshot-section/shows')
rows = []
for section in ['header', 'shows-list', 'mailing-list', 'content']:
    snap = json.loads((base / f'{section}-output.json').read_text())[0]
    rows.append({
        'section': section,
        'changed': snap['diff']['changed'],
        'styleDiffs': snap['diff']['styles']['count'],
        'yDelta': snap['diff']['bounds']['byField']['y']['delta'],
        'heightDelta': snap['diff']['bounds']['byField']['height']['delta'],
    })
print(json.dumps(rows, indent=2))
PY
