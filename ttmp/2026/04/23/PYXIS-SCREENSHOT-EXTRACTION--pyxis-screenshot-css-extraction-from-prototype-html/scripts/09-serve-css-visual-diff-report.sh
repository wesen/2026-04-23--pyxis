#!/usr/bin/env bash
set -euo pipefail

REPORT_DIR="${1:-/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-vs-app}"
PORT="${REPORT_PORT:-8789}"
PID_FILE="/tmp/pyxis-report-${PORT}.pid"
LOG_FILE="/tmp/pyxis-report-${PORT}.log"

if [[ ! -d "$REPORT_DIR" ]]; then
  echo "Report directory does not exist: $REPORT_DIR" >&2
  exit 1
fi

if curl -fsS "http://localhost:${PORT}/test.html" >/dev/null 2>&1; then
  echo "Report already served at http://localhost:${PORT}/test.html"
  exit 0
fi

if [[ -f "$PID_FILE" ]]; then
  old_pid="$(cat "$PID_FILE" || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" >/dev/null 2>&1; then
    kill "$old_pid" >/dev/null 2>&1 || true
  fi
fi

nohup python3 -m http.server "$PORT" --directory "$REPORT_DIR" >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
sleep 1
curl -fsS "http://localhost:${PORT}/test.html" >/dev/null

echo "Report served at http://localhost:${PORT}/test.html"
echo "pid: $(cat "$PID_FILE")"
echo "log: $LOG_FILE"
