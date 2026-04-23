#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="/home/manuel/code/wesen/2026-04-23--pyxis"
PORT="${PYXIS_PROTOTYPE_PORT:-7070}"
URL="http://localhost:${PORT}/Pyxis%20Public%20Site.html"
PID_FILE="/tmp/pyxis-prototype-${PORT}.pid"
LOG_FILE="/tmp/pyxis-prototype-${PORT}.log"

if curl -fsS "$URL" >/dev/null 2>&1; then
  echo "Prototype server already available at $URL"
  exit 0
fi

if [[ -f "$PID_FILE" ]]; then
  old_pid="$(cat "$PID_FILE" || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" >/dev/null 2>&1; then
    kill "$old_pid" >/dev/null 2>&1 || true
  fi
fi

nohup python3 -m http.server "$PORT" --directory "$REPO_ROOT/prototype-design" >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"
sleep 1
curl -fsS "$URL" >/dev/null

echo "Prototype server listening at $URL"
echo "pid: $(cat "$PID_FILE")"
echo "log: $LOG_FILE"
