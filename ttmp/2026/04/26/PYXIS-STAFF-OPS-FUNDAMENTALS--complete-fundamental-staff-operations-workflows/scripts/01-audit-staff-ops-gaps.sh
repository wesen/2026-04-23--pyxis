#!/usr/bin/env bash
set -euo pipefail

ROOT=${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
cd "$ROOT"

echo "# Staff operations gap audit"
echo

echo "## Frontend RTK endpoints"
rg -n "createShow|updateShow|uploadShowFlyer|deleteShowFlyer|updateArtist|updateAttendance|updateSettings|getBookings|approveBooking|declineBooking" web/packages/pyxis-app/src/api/appApi.ts || true

echo
echo "## Current page affordances"
rg -n "New show|Duplicate|Archive|Announce|BookingReviewNotePanel|ArtistRoster|AttendancePanel|SettingsPanel" web/packages/pyxis-app/src/pages/Pages.tsx || true

echo
echo "## Backend handlers"
rg -n "handle(CreateShow|UpdateShow|UploadFlyer|DeleteFlyer|UpdateArtist|UpsertAttendance|UpdateSettings|ApproveBooking|DeclineBooking)" pkg/server/app.go || true

echo
echo "## SQL query coverage"
for file in pkg/db/queries/shows.sql pkg/db/queries/submissions.sql pkg/db/queries/artists.sql pkg/db/queries/attendance.sql pkg/db/queries/settings.sql; do
  echo "### $file"
  rg -n -- "-- name:" "$file" || true
  echo
done

echo "## Missing markers to investigate"
echo "- No booking review note table/query should exist before this ticket."
echo "- No show lineup replace query should exist before this ticket."
echo "- No settings/core endpoint should exist before this ticket."
