# Changelog

## 2026-04-29

- Initial workspace created

- 2026-04-29: Renamed the staff post-show log page from `AttendancePage` to `ShowLogPage`, kept `/attendance`, added `/show-log`, updated stories, and removed obsolete `Roster/AttendancePanel` plus `AttendanceStat` UI components.
- 2026-04-29: Added first-class ShowLog API/schema fields for quick highlight and total door cents, plus `GET /api/app/show-log/{showId}` while keeping legacy attendance endpoints for compatibility.
