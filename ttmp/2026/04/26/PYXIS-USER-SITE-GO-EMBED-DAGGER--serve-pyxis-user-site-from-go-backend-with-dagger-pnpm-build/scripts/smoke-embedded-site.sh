#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"

check_status() {
  local path="$1"
  local expected="$2"
  local status
  status="$(curl -sS -o /tmp/pyxis-smoke-body -w '%{http_code}' "$BASE_URL$path")"
  if [[ "$status" != "$expected" ]]; then
    echo "FAIL $path: got HTTP $status, expected $expected" >&2
    echo "Body:" >&2
    cat /tmp/pyxis-smoke-body >&2 || true
    exit 1
  fi
  echo "OK $path -> $status"
}

check_contains() {
  local path="$1"
  local expected="$2"
  curl -sS "$BASE_URL$path" > /tmp/pyxis-smoke-body
  if ! grep -q "$expected" /tmp/pyxis-smoke-body; then
    echo "FAIL $path: response did not contain '$expected'" >&2
    head -40 /tmp/pyxis-smoke-body >&2 || true
    exit 1
  fi
  echo "OK $path contains $expected"
}

check_status "/health" "200"
check_status "/api/public/shows" "200"
check_contains "/" "<html"
check_contains "/shows/42" "<html"

asset_path="$(curl -sS "$BASE_URL/" | grep -oE '/assets/[^" ]+\.js' | head -1 || true)"
if [[ -n "$asset_path" ]]; then
  check_status "$asset_path" "200"
else
  echo "WARN: no JS asset path found in index.html"
fi

echo "Embedded-site smoke test passed for $BASE_URL"
