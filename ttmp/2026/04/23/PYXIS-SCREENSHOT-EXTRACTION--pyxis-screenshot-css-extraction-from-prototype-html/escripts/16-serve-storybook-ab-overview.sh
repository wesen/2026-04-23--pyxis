#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TICKET_DIR="/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html"
OUT_DIR="$TICKET_DIR/various/storybook-ab-overview"
PORT="${REPORT_PORT:-8794}"
PID_FILE="/tmp/pyxis-storybook-ab-overview-${PORT}.pid"
LOG_FILE="/tmp/pyxis-storybook-ab-overview-${PORT}.log"

if [[ ! -f "$OUT_DIR/test.html" ]]; then
  "$SCRIPT_DIR/15-build-storybook-ab-overview.sh"
fi

if curl -fsS "http://localhost:${PORT}/test.html" >/dev/null 2>&1; then
  echo "Storybook A/B overview already served at http://localhost:${PORT}/test.html"
  exit 0
fi

if [[ -f "$PID_FILE" ]]; then
  old_pid="$(cat "$PID_FILE" || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" >/dev/null 2>&1; then
    kill "$old_pid" >/dev/null 2>&1 || true
  fi
fi

nohup python3 -m http.server "$PORT" --directory "$OUT_DIR" >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
sleep 1
curl -fsS "http://localhost:${PORT}/test.html" >/dev/null

echo "Storybook A/B overview served at http://localhost:${PORT}/test.html"
echo "pid: $(cat "$PID_FILE")"
echo "log: $LOG_FILE"
