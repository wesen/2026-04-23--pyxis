#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT_DIR="/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-atoms-prototype-vs-storybook"
REPORT_PORT="${REPORT_PORT:-8792}" exec "$SCRIPT_DIR/09-serve-css-visual-diff-report.sh" "$REPORT_DIR"
