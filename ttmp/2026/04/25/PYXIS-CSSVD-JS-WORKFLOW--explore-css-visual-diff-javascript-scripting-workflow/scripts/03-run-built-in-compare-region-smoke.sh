#!/usr/bin/env bash
set -euo pipefail

# Smoke-test the built-in JavaScript verb path for a single page region without
# authoring a YAML config. This intentionally uses the closest current page
# (Archive) so the first run is readable.
BASE="ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow"
OUT="$BASE/various/03-built-in-compare-region/archive-content"
mkdir -p "$OUT"

css-visual-diff verbs script compare region \
  --leftUrl "http://localhost:7070/standalone/public/archive.html" \
  --rightUrl "http://localhost:6007/iframe.html?id=public-site-pages--archive-desktop&viewMode=story" \
  --leftSelector "#root > *" \
  --rightSelector "[data-page='archive']" \
  --width 920 \
  --height 1460 \
  --leftWaitMs 1000 \
  --rightWaitMs 1000 \
  --outDir "$OUT" \
  --writeJson \
  --writeMarkdown \
  --writePngs \
  --output json

# docmgr validates every .md under a ticket. Keep a docmgr-friendly copy of the
# generated Markdown report and remove the raw generated file.
if [[ -f "$OUT/compare.md" ]]; then
  {
    cat <<'FM'
---
Title: Built-in compare-region Archive content artifact
Ticket: PYXIS-CSSVD-JS-WORKFLOW
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - automation
  - pyxis
DocType: reference
Intent: short-term
Summary: Generated css-visual-diff built-in compare-region Markdown report for Archive content.
---

FM
    cat "$OUT/compare.md"
  } > "$OUT/01-compare-report.md"
  rm "$OUT/compare.md"
fi
