---
Ticket: PYXIS-SHOWLOG-ATTENDANCE-MIGRATION
Title: Migrate legacy Attendance screen and API naming to ShowLog
Status: active
Topics:
  - frontend
  - backend
  - staff-app
  - design-system
  - api-design
---

# Tasks

## Phase 1 — Inventory and planning

- [x] T1. Create migration ticket and task list.
- [x] T2. Inventory remaining legacy Attendance names, components, stories, routes, API endpoints, and DB objects.
- [x] T3. Decide compatibility policy: hard cutover to ShowLog; remove `/attendance` and `/api/app/attendance` instead of keeping deprecation aliases.

## Phase 2 — Frontend clean rename

- [x] T4. Rename `AttendancePage` to `ShowLogPage`.
- [x] T5. Make `/show-log` the only staff route for the post-show log page.
- [x] T6. Rename/update page stories from Attendance language to ShowLog/Post-show log language.
- [x] T7. Remove old `Roster/AttendancePanel` organism and its Storybook stories.
- [x] T8. Remove old `AttendanceStat` molecule and package/barrel exports if unused.
- [x] T9. Run frontend TypeScript/build validation.

## Phase 3 — API/schema alignment

- [x] T10. Document current API/DB fit against the new ShowLog modal fields.
- [x] T11. Add real persistence fields for `quickHighlight` and `totalDoor`.
- [x] T12. Add `GET /api/app/show-log/{showId}` for the single-entry API planned by the ShowLog design guide.
- [x] T13. Remove legacy `/api/app/attendance` handlers, RTK hooks, endpoint constants, and MSW handlers.
- [x] T14. Update RTK types/hooks and MSW handlers to stop folding new fields into notes once persistence exists.
- [x] T19. Rename backend domain/service/repository/sqlc names from AttendanceLog to ShowLog.
- [x] T20. Add DB migration to rename physical `attendance_logs` table to `show_logs`.

## Phase 4 — Evidence and cleanup

- [ ] T15. Capture Storybook or route screenshots after the rename/cleanup.
- [x] T16. Update changelog and diary with validation evidence.
- [x] T17. Run `docmgr doctor`.
- [ ] T18. Commit logical migration milestones without staging unrelated runtime artifacts.
