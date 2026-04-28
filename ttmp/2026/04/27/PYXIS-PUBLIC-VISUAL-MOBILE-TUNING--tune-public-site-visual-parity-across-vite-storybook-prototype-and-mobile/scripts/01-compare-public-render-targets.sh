#!/usr/bin/env bash
# Compare focused pyxis-user-site public page regions across render targets.
#
# This ticket-local wrapper exists because the canonical public visual spec compares
# standalone prototype -> Storybook, while this ticket also needs:
#   - Vite live app -> Storybook page story
#   - standalone prototype -> Vite live app
#
# Usage:
#   01-compare-public-render-targets.sh <pair> <section> [out-dir] [viewport]
#
# Optional env:
#   PAGE=shows|show-detail|archive|book|about   default: shows
#
# Pairs:
#   prototype-storybook
#   vite-storybook
#   prototype-vite
#
# Sections intentionally support deeper selectors so poster/list differences do
# not swamp investigations such as the Stay in the loop email form.
#
# Sections:
#   page, content, header, shows-list, mailing-list,
#   mailing-title, mailing-description, mailing-form, mailing-input, mailing-button
#
# Viewports:
#   desktop (920x1460), mobile (390x844)

set -euo pipefail

PAIR=${1:?pair is required: prototype-storybook | vite-storybook | prototype-vite}
SECTION=${2:?section is required}
OUT=${3:-/tmp/pyxis-public-visual-${PAIR}-${SECTION}}
VIEWPORT=${4:-desktop}

ROOT_DIR=${ROOT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
cd "$ROOT_DIR"

case "$VIEWPORT" in
  desktop) VW=920; VH=1460 ;;
  mobile) VW=390; VH=844 ;;
  *) echo "unknown viewport: $VIEWPORT" >&2; exit 2 ;;
esac

PAGE=${PAGE:-shows}

case "$PAGE" in
  shows)
    PROTOTYPE_STEM=shows; STORY_PAGE=shows; VITE_PATH=/; DATA_PAGE=shows; HEADER_SECTION=shows-header ;;
  show-detail)
    PROTOTYPE_STEM=detail; STORY_PAGE=show-detail; VITE_PATH=/shows/1; DATA_PAGE=show-detail; HEADER_SECTION=show-detail-hero ;;
  archive)
    PROTOTYPE_STEM=archive; STORY_PAGE=archive; VITE_PATH=/archive; DATA_PAGE=archive; HEADER_SECTION=archive-header ;;
  book)
    PROTOTYPE_STEM=book; STORY_PAGE=book; VITE_PATH=/book; DATA_PAGE=book; HEADER_SECTION=book-header ;;
  about)
    PROTOTYPE_STEM=about; STORY_PAGE=about; VITE_PATH=/about; DATA_PAGE=about; HEADER_SECTION=about-hero ;;
  *) echo "unknown PAGE: $PAGE" >&2; exit 2 ;;
esac

if [[ "$VIEWPORT" = "mobile" ]]; then
  PROTOTYPE_FILE="${PROTOTYPE_STEM}-mobile.html"
  STORY_VARIANT=mobile
  STORY_VIEWPORT=pyxisMobile
else
  PROTOTYPE_FILE="${PROTOTYPE_STEM}.html"
  STORY_VARIANT=desktop
  STORY_VIEWPORT=pyxisDesktop
fi

PROTOTYPE_URL=${PROTOTYPE_URL:-http://localhost:7070/standalone/public/$PROTOTYPE_FILE}
if [[ "$SECTION" != "page" && "$PROTOTYPE_URL" != *\?* ]]; then
  PROTOTYPE_URL="${PROTOTYPE_URL}?hideNav=1"
fi
VITE_URL=${VITE_URL:-http://localhost:3007$VITE_PATH}
STORYBOOK_URL=${STORYBOOK_URL:-http://localhost:6007/iframe.html?id=public-site-pages-${STORY_PAGE}--${STORY_VARIANT}\&viewMode=story\&globals=viewport:${STORY_VIEWPORT}}

case "$SECTION" in
  page)
    PROTOTYPE_SELECTOR="#root"
    VITE_SELECTOR="#root"
    STORYBOOK_SELECTOR="[data-story-frame='pyxis-page-shell']"
    ;;
  content)
    PROTOTYPE_SELECTOR="[data-page='$DATA_PAGE']"
    VITE_SELECTOR="[data-page='$DATA_PAGE']"
    STORYBOOK_SELECTOR="[data-page='$DATA_PAGE']"
    ;;
  header)
    PROTOTYPE_SELECTOR="[data-section='$HEADER_SECTION']"
    VITE_SELECTOR="[data-section='$HEADER_SECTION']"
    STORYBOOK_SELECTOR="[data-section='$HEADER_SECTION'] [data-pyxis-component='public-page-header'], [data-section='$HEADER_SECTION']"
    ;;
  shows-list)
    PROTOTYPE_SELECTOR="[data-section='shows-list']"
    VITE_SELECTOR="[data-section='shows-list']"
    STORYBOOK_SELECTOR="[data-section='shows-list']"
    ;;
  mailing-list)
    PROTOTYPE_SELECTOR="[data-section='mailing-list']"
    VITE_SELECTOR="[data-section='mailing-list']"
    STORYBOOK_SELECTOR="[data-section='mailing-list']"
    ;;
  mailing-title)
    PROTOTYPE_SELECTOR="[data-section='mailing-list'] h3"
    VITE_SELECTOR="[data-section='mailing-list'] [data-pyxis-part='title']"
    STORYBOOK_SELECTOR="[data-section='mailing-list'] [data-pyxis-part='title']"
    ;;
  mailing-description)
    PROTOTYPE_SELECTOR="[data-section='mailing-list'] p"
    VITE_SELECTOR="[data-section='mailing-list'] [data-pyxis-part='description']"
    STORYBOOK_SELECTOR="[data-section='mailing-list'] [data-pyxis-part='description']"
    ;;
  mailing-form)
    PROTOTYPE_SELECTOR="[data-section='mailing-list'] form"
    VITE_SELECTOR="[data-section='mailing-list'] [data-pyxis-part='form']"
    STORYBOOK_SELECTOR="[data-section='mailing-list'] [data-pyxis-part='form']"
    ;;
  mailing-input)
    PROTOTYPE_SELECTOR="[data-section='mailing-list'] input"
    VITE_SELECTOR="[data-section='mailing-list'] input"
    STORYBOOK_SELECTOR="[data-section='mailing-list'] input"
    ;;
  mailing-button)
    PROTOTYPE_SELECTOR="[data-section='mailing-list'] button"
    VITE_SELECTOR="[data-section='mailing-list'] button"
    STORYBOOK_SELECTOR="[data-section='mailing-list'] button"
    ;;
  *)
    echo "unknown section: $SECTION" >&2
    exit 2
    ;;
esac

case "$PAIR" in
  prototype-storybook)
    URL1=$PROTOTYPE_URL; URL2=$STORYBOOK_URL
    SELECTOR1=$PROTOTYPE_SELECTOR; SELECTOR2=$STORYBOOK_SELECTOR
    ;;
  vite-storybook)
    URL1=$VITE_URL; URL2=$STORYBOOK_URL
    SELECTOR1=$VITE_SELECTOR; SELECTOR2=$STORYBOOK_SELECTOR
    ;;
  prototype-vite)
    URL1=$PROTOTYPE_URL; URL2=$VITE_URL
    SELECTOR1=$PROTOTYPE_SELECTOR; SELECTOR2=$VITE_SELECTOR
    ;;
  *)
    echo "unknown pair: $PAIR" >&2
    exit 2
    ;;
esac

rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff compare \
  --url1 "$URL1" \
  --url2 "$URL2" \
  --selector1 "$SELECTOR1" \
  --selector2 "$SELECTOR2" \
  --viewport-w "$VW" \
  --viewport-h "$VH" \
  --wait-ms1 1200 \
  --wait-ms2 1200 \
  --threshold 30 \
  --out "$OUT" \
  --write-json=true \
  --write-markdown=true \
  --write-pngs=true >/dev/null

python3 - "$OUT" "$PAIR" "$SECTION" "$VIEWPORT" "$URL1" "$URL2" "$SELECTOR1" "$SELECTOR2" <<'PY'
import json, sys
from pathlib import Path
out = Path(sys.argv[1])
compare = json.loads((out / 'compare.json').read_text())
pixel = compare.get('pixel_diff') or compare.get('pixelDiff') or {}
changed = pixel.get('changed_percent')
if changed is None:
    changed = pixel.get('changedPercent')
if changed is None:
    changed = compare.get('changedPercent')
print(f"pair: {sys.argv[2]}")
print(f"section: {sys.argv[3]}")
print(f"viewport: {sys.argv[4]}")
print(f"changedPercent: {changed}")
print(f"url1: {sys.argv[5]}")
print(f"url2: {sys.argv[6]}")
print(f"selector1: {sys.argv[7]}")
print(f"selector2: {sys.argv[8]}")
diffs = compare.get('computed_diffs') or compare.get('computedDiffs') or []
if diffs:
    print('computedDiffs:')
    for diff in diffs:
        prop = diff.get('property') or diff.get('name')
        left = diff.get('original', diff.get('left'))
        right = diff.get('react', diff.get('right'))
        print(f"  - {prop}: {left} -> {right}")
for name in ['diff_only.png', 'url2_screenshot.png', 'url1_screenshot.png', 'diff_comparison.png', 'compare.json', 'compare.md']:
    p = out / name
    if p.exists():
        print(f"{name}: {p}")
PY
