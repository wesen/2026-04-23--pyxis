#!/usr/bin/env bash
# Smoke-test the embedded public Pyxis site served by the Go binary.
#
# Purpose:
#   Validate the production-intent same-origin topology:
#   - build/embed public Vite assets into bin/pyxis;
#   - run DB migrations;
#   - start the Go server;
#   - verify SPA browser routes return HTML;
#   - verify public API routes return JSON;
#   - optionally verify booking submission creates a confirmation.
#
# Safe defaults:
#   Uses the local dev DB URL unless DB_URL is provided.
#   Uses 127.0.0.1:18081 unless BIND/BASE_URL are provided.
#   Set SKIP_BUILD=1 to reuse an existing bin/pyxis.
#   Set SKIP_BOOKING_POST=1 to avoid inserting a pending submission.
#   Set SKIP_DB_SEED=1 to skip temporary show/archive visibility seed rows.

set -euo pipefail

ROOT_DIR=${ROOT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
DB_URL=${DB_URL:-postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable}
BIND=${BIND:-127.0.0.1:18081}
BASE_URL=${BASE_URL:-http://$BIND}
SKIP_BUILD=${SKIP_BUILD:-0}
SKIP_BOOKING_POST=${SKIP_BOOKING_POST:-0}
SKIP_DB_SEED=${SKIP_DB_SEED:-0}
LOG_FILE=${LOG_FILE:-/tmp/pyxis-embedded-public-smoke.log}
SMOKE_MARKER=${SMOKE_MARKER:-PYXIS_SMOKE_$(date +%s)}

cd "$ROOT_DIR"

if [[ "$SKIP_BUILD" != "1" ]]; then
  echo "[smoke] building embedded binary via make build-embed"
  make build-embed
fi

if [[ ! -x bin/pyxis ]]; then
  echo "[smoke] bin/pyxis missing or not executable; run make build-embed" >&2
  exit 1
fi

echo "[smoke] running migrations"
./bin/pyxis migrate up --db-url "$DB_URL" >/tmp/pyxis-embedded-public-smoke-migrate.log 2>&1

cleanup_seed() {
  if [[ "$SKIP_DB_SEED" != "1" ]] && command -v psql >/dev/null 2>&1; then
    psql "$DB_URL" -v ON_ERROR_STOP=1 -q -c "DELETE FROM shows WHERE artist LIKE '${SMOKE_MARKER}%'; DELETE FROM submissions WHERE artist_name LIKE '${SMOKE_MARKER}%';" >/dev/null 2>&1 || true
  fi
}

if [[ "$SKIP_DB_SEED" != "1" ]]; then
  if ! command -v psql >/dev/null 2>&1; then
    echo "[smoke] psql is required for seeded API visibility checks; set SKIP_DB_SEED=1 to skip" >&2
    exit 1
  fi
  echo "[smoke] seeding temporary public API visibility rows marker=$SMOKE_MARKER"
  cleanup_seed
  psql "$DB_URL" -v ON_ERROR_STOP=1 -q <<SQL
INSERT INTO shows (artist, date, doors_time, start_time, age, price, genre, description, status)
VALUES
  ('${SMOKE_MARKER} Confirmed Future', CURRENT_DATE + INTERVAL '14 days', '8:00 PM', '9:00 PM', '21+', '10', 'smoke', 'confirmed public smoke show', 'confirmed'),
  ('${SMOKE_MARKER} Draft Future', CURRENT_DATE + INTERVAL '15 days', '8:00 PM', '9:00 PM', '21+', '10', 'smoke', 'draft public smoke show', 'draft'),
  ('${SMOKE_MARKER} Archived Past', CURRENT_DATE - INTERVAL '30 days', '8:00 PM', '9:00 PM', '21+', '10', 'smoke', 'archived public smoke show', 'archived');
SQL
fi

echo "[smoke] starting server on $BIND"
./bin/pyxis serve --bind "$BIND" --db-url "$DB_URL" >"$LOG_FILE" 2>&1 &
PID=$!
cleanup() {
  kill "$PID" >/dev/null 2>&1 || true
  wait "$PID" >/dev/null 2>&1 || true
  cleanup_seed
}
trap cleanup EXIT

for _ in $(seq 1 60); do
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

curl -fsS "$BASE_URL/health" | grep -q '"status":"ok"'

assert_html() {
  local path=$1
  local body
  body=$(curl -fsS "$BASE_URL$path")
  if ! grep -qi '<!DOCTYPE html\|<div id="root"' <<<"$body"; then
    echo "[smoke] expected HTML app shell for $path" >&2
    exit 1
  fi
  echo "[smoke] HTML OK $path"
}

assert_json() {
  local path=$1
  local body
  body=$(curl -fsS -H 'Accept: application/json' "$BASE_URL$path")
  python3 -c 'import json,sys; json.load(sys.stdin)' <<<"$body" >/dev/null
  echo "[smoke] JSON OK $path"
}

assert_html "/"
assert_html "/shows"
assert_html "/shows/1"
assert_html "/archive"
assert_html "/book"
assert_html "/book/success"
assert_html "/about"

assert_json "/api/public/shows"
assert_json "/api/public/archive"
assert_json "/api/public/archive/stats"

if [[ "$SKIP_DB_SEED" != "1" ]]; then
  echo "[smoke] checking public API visibility rules"
  shows_json=$(curl -fsS -H 'Accept: application/json' "$BASE_URL/api/public/shows")
  python3 -c 'import json,sys; marker=sys.argv[1]; data=json.load(sys.stdin); artists=[show.get("artist") for show in data.get("shows", [])]; assert f"{marker} Confirmed Future" in artists, artists; assert f"{marker} Draft Future" not in artists, artists; assert f"{marker} Archived Past" not in artists, artists' "$SMOKE_MARKER" <<<"$shows_json"
  confirmed_id=$(psql "$DB_URL" -At -c "SELECT id FROM shows WHERE artist='${SMOKE_MARKER} Confirmed Future' LIMIT 1")
  draft_id=$(psql "$DB_URL" -At -c "SELECT id FROM shows WHERE artist='${SMOKE_MARKER} Draft Future' LIMIT 1")
  curl -fsS "$BASE_URL/api/public/shows/$confirmed_id" >/dev/null
  draft_status=$(curl -sS -o /tmp/pyxis-smoke-draft-detail.json -w '%{http_code}' "$BASE_URL/api/public/shows/$draft_id")
  if [[ "$draft_status" != "404" ]]; then
    echo "[smoke] draft show detail returned $draft_status, want 404" >&2
    cat /tmp/pyxis-smoke-draft-detail.json >&2 || true
    exit 1
  fi
  archive_json=$(curl -fsS -H 'Accept: application/json' "$BASE_URL/api/public/archive?search=$SMOKE_MARKER")
  python3 -c 'import json,sys; marker=sys.argv[1]; data=json.load(sys.stdin); artists=[show.get("artist") for show in data.get("shows", [])]; assert f"{marker} Archived Past" in artists, artists; assert f"{marker} Confirmed Future" not in artists, artists' "$SMOKE_MARKER" <<<"$archive_json"
  echo "[smoke] public API visibility OK"
fi

if [[ "$SKIP_BOOKING_POST" != "1" ]]; then
  echo "[smoke] posting test booking submission"
  response=$(curl -fsS \
    -H 'Content-Type: application/json' \
    -d "{\"artistName\":\"${SMOKE_MARKER} Booking Artist\",\"links\":\"https://example.com/${SMOKE_MARKER}\",\"message\":\"Smoke test submission from embedded public site script\"}" \
    "$BASE_URL/api/public/submissions")
  python3 -c 'import json,sys; data=json.load(sys.stdin); assert data.get("success") is True and int(data.get("submissionId", 0)) > 0, data' <<<"$response"
  echo "[smoke] booking submission OK"
else
  echo "[smoke] booking submission skipped"
fi

echo "[smoke] embedded public site smoke passed"
