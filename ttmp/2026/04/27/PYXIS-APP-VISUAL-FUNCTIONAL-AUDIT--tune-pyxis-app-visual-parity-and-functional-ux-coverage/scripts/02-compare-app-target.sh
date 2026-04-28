#!/usr/bin/env bash
# Purpose: Run one focused pyxis-app css-visual-diff comparison from the app page/component specs.
# This is intentionally narrow: choose one spec, one target page/component, and optionally one section.
#
# Examples:
#   SPEC=pages PAGE=dashboard SECTION=topbar OUT=/tmp/pyxis-app-dashboard-topbar scripts/02-compare-app-target.sh
#   SPEC=components PAGE=app-sidebar OUT=/tmp/pyxis-app-sidebar scripts/02-compare-app-target.sh

set -euo pipefail

ROOT=${ROOT:-$(git rev-parse --show-toplevel)}
SPEC_KIND=${SPEC:-pages}
PAGE=${PAGE:?Set PAGE to a target from the app visual spec, e.g. dashboard or app-sidebar}
SECTION=${SECTION:-}
OUT=${OUT:-/tmp/pyxis-app-${PAGE}${SECTION:+-$SECTION}}
REPOSITORY=${REPOSITORY:-prototype-design/visual-diff/userland}

case "$SPEC_KIND" in
  pages)
    SPEC_FILE="prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml"
    ;;
  components)
    SPEC_FILE="prototype-design/visual-diff/userland/specs/app.components.visual.yml"
    ;;
  *)
    echo "SPEC must be 'pages' or 'components'" >&2
    exit 2
    ;;
esac

cd "$ROOT"
rm -rf "$OUT"
mkdir -p "$OUT"

args=(
  verbs
  --repository "$REPOSITORY"
  pyxis pages compare-spec
  "$SPEC_FILE"
  --page "$PAGE"
  --outDir "$OUT"
  --summary
  --output json
)

if [[ -n "$SECTION" ]]; then
  args+=(--section "$SECTION")
fi

css-visual-diff "${args[@]}" > "$OUT/summary.json"

python3 - "$OUT/summary.json" <<'PY'
import json, sys
path = sys.argv[1]
data = json.load(open(path))
rows = data[0].get('rows', data) if isinstance(data, list) and data else data.get('rows', [])
for row in rows:
    print(f"{row.get('page')} / {row.get('section')}: {row.get('classification')} {row.get('changedPercent')}%")
    for key in ['diffOnlyPath','rightRegionPath','leftRegionPath','artifactJson']:
        if row.get(key): print(f"  {key}: {row[key]}")
PY

echo "summary: $OUT/summary.json"
