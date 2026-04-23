#!/usr/bin/env bash
set -euo pipefail

WEB_ROOT="/home/manuel/code/wesen/2026-04-23--pyxis/web"
STORYBOOK_DIR="$WEB_ROOT/packages/pyxis-user-site/storybook-static"
PORT="${PYXIS_USER_SITE_STORYBOOK_PORT:-6007}"
PID_FILE="/tmp/pyxis-user-site-storybook-static-${PORT}.pid"
LOG_FILE="/tmp/pyxis-user-site-storybook-static-${PORT}.log"

if [[ ! -f "$STORYBOOK_DIR/index.html" ]]; then
  echo "Building pyxis-user-site Storybook static bundle..." >&2
  (cd "$WEB_ROOT" && STORYBOOK_DISABLE_TELEMETRY=1 pnpm --filter pyxis-user-site build-storybook)
fi

if [[ -f "$PID_FILE" ]]; then
  old_pid="$(cat "$PID_FILE" || true)"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" >/dev/null 2>&1; then
    if curl -fsS "http://localhost:${PORT}/index.json" >/dev/null 2>&1; then
      echo "User-site Storybook static already available at http://localhost:${PORT}"
      exit 0
    fi
    kill "$old_pid" >/dev/null 2>&1 || true
  fi
fi

if command -v fuser >/dev/null 2>&1; then
  fuser -k "${PORT}/tcp" >/dev/null 2>&1 || true
fi

(cd "$STORYBOOK_DIR" && nohup python3 -m http.server "$PORT" >"$LOG_FILE" 2>&1 & echo $! >"$PID_FILE")

for _ in $(seq 1 30); do
  if curl -fsS "http://localhost:${PORT}/index.json" >/dev/null 2>&1; then
    echo "User-site Storybook static served at http://localhost:${PORT}"
    echo "pid: $(cat "$PID_FILE")"
    echo "log: $LOG_FILE"
    exit 0
  fi
  sleep 1
done

echo "Timed out waiting for user-site Storybook static on port ${PORT}" >&2
echo "log: $LOG_FILE" >&2
exit 1
