#!/usr/bin/env bash
set -euo pipefail

# Phase 6 smoke: write two semantic snapshots and diff them. The snapshots are
# intentionally identical, so the snapshot-to-snapshot report should be stable
# and show no metric/classification changes.
BASE="prototype-design/visual-diff/userland"
OUT="prototype-design/visual-comparisons/cssvd-js/diff-snapshots/archive-content"
BEFORE="$OUT/before"
AFTER="$OUT/after"
DIFF="$OUT/diff"
rm -rf "$OUT"
mkdir -p "$BEFORE" "$AFTER" "$DIFF"

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages snapshot-section archive content \
  --outDir "$BEFORE" \
  --stylePreset pageShell \
  --output json >/tmp/pyxis-snapshot-before.json

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages snapshot-section archive content \
  --outDir "$AFTER" \
  --stylePreset pageShell \
  --output json >/tmp/pyxis-snapshot-after.json

css-visual-diff verbs \
  --repository "$BASE" \
  pyxis pages diff-snapshots \
  "$BEFORE/snapshot.json" \
  "$AFTER/snapshot.json" \
  --outDir "$DIFF" \
  --output json
