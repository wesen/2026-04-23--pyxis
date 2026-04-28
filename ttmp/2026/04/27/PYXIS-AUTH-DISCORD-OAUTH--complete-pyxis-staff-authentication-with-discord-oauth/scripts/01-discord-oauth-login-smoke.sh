#!/usr/bin/env bash
# Smoke-check the Discord OAuth login initiation path without completing a live Discord callback.
#
# This script verifies the pieces we can test safely before a human completes
# Discord login in a browser:
#   - server starts with Discord OAuth config;
#   - /auth/discord/login returns a Discord authorize redirect;
#   - redirect URL contains client_id, redirect_uri, identify scope, response_type=code, and state;
#   - OAuth state cookie is set;
#   - /api/app/session is unauthenticated before login.
#
# Required environment:
#   PYXIS_DISCORD_CLIENT_ID
#   PYXIS_DISCORD_CLIENT_SECRET
# Optional environment:
#   PYXIS_WEBSITE_URL                default: https://pyxis.yolo.scapegoat.dev
#   PYXIS_DISCORD_REDIRECT_URL       defaulted by server from website URL
#   DB_URL                           default: postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable
#   BIND                             default: 127.0.0.1:18086
#   BASE_URL                         default: http://$BIND
#   START_SERVER                     default: 1; set 0 to test an already-running server

set -euo pipefail

ROOT_DIR=${ROOT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
DB_URL=${DB_URL:-postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable}
BIND=${BIND:-127.0.0.1:18086}
BASE_URL=${BASE_URL:-http://$BIND}
PYXIS_WEBSITE_URL=${PYXIS_WEBSITE_URL:-https://pyxis.yolo.scapegoat.dev}
START_SERVER=${START_SERVER:-1}
RETURN_TO=${RETURN_TO:-/shows}
LOG_FILE=${LOG_FILE:-/tmp/pyxis-discord-oauth-smoke-server.log}
HEADERS_FILE=${HEADERS_FILE:-/tmp/pyxis-discord-oauth-smoke.headers}
BODY_FILE=${BODY_FILE:-/tmp/pyxis-discord-oauth-smoke.body}

cd "$ROOT_DIR"

: "${PYXIS_DISCORD_CLIENT_ID:?PYXIS_DISCORD_CLIENT_ID is required}"
: "${PYXIS_DISCORD_CLIENT_SECRET:?PYXIS_DISCORD_CLIENT_SECRET is required}"

PID=""
cleanup() {
  if [[ -n "$PID" ]]; then
    kill "$PID" >/dev/null 2>&1 || true
    wait "$PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

if [[ "$START_SERVER" != "0" ]]; then
  echo "[smoke] starting Pyxis on $BIND"
  go run ./cmd/pyxis serve \
    --bind "$BIND" \
    --db-url "$DB_URL" \
    --website-url "$PYXIS_WEBSITE_URL" \
    >"$LOG_FILE" 2>&1 &
  PID=$!

  for _ in $(seq 1 80); do
    if ! kill -0 "$PID" >/dev/null 2>&1; then
      echo "[smoke] server exited before becoming healthy; log follows:" >&2
      cat "$LOG_FILE" >&2 || true
      exit 1
    fi
    if curl -fsS "$BASE_URL/health" >/dev/null 2>&1; then
      break
    fi
    sleep 0.25
  done
fi

curl -fsS "$BASE_URL/health" >/dev/null

echo "[smoke] checking unauthenticated session"
session_json=$(curl -fsS "$BASE_URL/api/app/session")
python3 -c 'import json,sys; data=json.load(sys.stdin); assert data.get("authenticated", False) is False, data' <<<"$session_json"

echo "[smoke] checking Discord OAuth redirect"
status=$(curl -sS -o "$BODY_FILE" -D "$HEADERS_FILE" -w '%{http_code}' "$BASE_URL/auth/discord/login?return_to=$(python3 -c 'import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=""))' "$RETURN_TO")")
if [[ "$status" != "302" ]]; then
  echo "[smoke] expected /auth/discord/login status 302, got $status" >&2
  cat "$HEADERS_FILE" >&2 || true
  cat "$BODY_FILE" >&2 || true
  exit 1
fi

python3 - "$HEADERS_FILE" "$PYXIS_DISCORD_CLIENT_ID" "$PYXIS_WEBSITE_URL" <<'PY'
import sys
from http.cookies import SimpleCookie
from pathlib import Path
from urllib.parse import parse_qs, urlparse

headers = Path(sys.argv[1]).read_text().splitlines()
client_id = sys.argv[2]
website_url = sys.argv[3].rstrip('/')
location = ''
set_cookies = []
for line in headers:
    if line.lower().startswith('location:'):
        location = line.split(':', 1)[1].strip()
    if line.lower().startswith('set-cookie:'):
        set_cookies.append(line.split(':', 1)[1].strip())
assert location, headers
parsed = urlparse(location)
assert parsed.scheme == 'https', location
assert parsed.netloc == 'discord.com', location
assert parsed.path == '/oauth2/authorize', location
query = parse_qs(parsed.query)
assert query.get('client_id') == [client_id], query
assert query.get('response_type') == ['code'], query
assert query.get('scope') == ['identify'], query
assert query.get('redirect_uri') == [website_url + '/auth/discord/callback'], query
assert query.get('state', [''])[0], query
cookie_names = []
for raw in set_cookies:
    cookie = SimpleCookie(); cookie.load(raw)
    cookie_names.extend(cookie.keys())
assert 'pyxis_discord_oauth_state' in cookie_names, cookie_names
PY

echo "[smoke] Discord OAuth login initiation smoke passed"
