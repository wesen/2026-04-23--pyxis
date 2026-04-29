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
- [x] T3. Decide compatibility policy for `/attendance` route and `/api/app/attendance` API: keep both for now, add `/show-log` route alias, and phase backend compatibility later.

## Phase 2 — Frontend clean rename

- [x] T4. Rename `AttendancePage` to `ShowLogPage` while keeping `/attendance` as a compatibility route.
- [x] T5. Add optional `/show-log` route alias to the same page.
- [x] T6. Rename/update page stories from Attendance language to ShowLog/Post-show log language.
- [x] T7. Remove old `Roster/AttendancePanel` organism and its Storybook stories.
- [x] T8. Remove old `AttendanceStat` molecule and package/barrel exports if unused.
- [x] T9. Run frontend TypeScript/build validation.

## Phase 3 — API/schema alignment

- [x] T10. Document current API/DB fit against the new ShowLog modal fields.
- [x] T11. Add real persistence fields for `quickHighlight` and `totalDoor` if approved.
- [x] T12. Add `GET /api/app/show-log/{showId}` for the single-entry API planned by the ShowLog design guide.
- [x] T13. Decide whether legacy `/api/app/attendance` remains, becomes compatibility-only, or is removed: keep as compatibility-only for now.
- [x] T14. Update RTK types/hooks and MSW handlers to stop folding new fields into notes once persistence exists.

## Phase 4 — Evidence and cleanup

- [ ] T15. Capture Storybook or route screenshots after the rename/cleanup.
- [ ] T16. Update changelog and diary with validation evidence.
- [ ] T17. Run `docmgr doctor`.
- [ ] T18. Commit logical migration milestones without staging unrelated runtime artifacts.
