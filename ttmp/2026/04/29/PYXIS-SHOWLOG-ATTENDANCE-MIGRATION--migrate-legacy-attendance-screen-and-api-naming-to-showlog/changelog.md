# Changelog

## 2026-04-29

- Initial workspace created

- 2026-04-29: Renamed the staff post-show log page from `AttendancePage` to `ShowLogPage`, made `/show-log` canonical, updated stories, and removed obsolete `Roster/AttendancePanel` plus `AttendanceStat` UI components.
- 2026-04-29: Added first-class ShowLog API/schema fields for quick highlight and total door cents, plus `GET /api/app/show-log/{showId}`.
- 2026-04-29: Wired the ShowLog editor modal to save `quickHighlight` and `totalDoorCents` as first-class API fields instead of folding them into post-show notes.
- 2026-04-29: Switched to hard cutover: removed `/attendance` and `/api/app/attendance`, renamed backend domain/service/repository/sqlc paths to ShowLog, added `show_logs` table rename migration, and changed API payload ID to `showLogId`.
- 2026-04-29: Validated hard cutover with targeted Go tests, pyxis-app TypeScript, pyxis-app Vite build, `docmgr doctor`, and a legacy attendance route/API symbol search.
