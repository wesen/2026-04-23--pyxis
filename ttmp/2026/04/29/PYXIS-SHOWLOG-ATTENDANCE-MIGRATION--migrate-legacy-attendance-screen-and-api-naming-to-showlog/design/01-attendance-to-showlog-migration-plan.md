---
Title: Attendance to ShowLog migration plan
Ticket: PYXIS-SHOWLOG-ATTENDANCE-MIGRATION
Type: design
Status: active
Topics:
  - pyxis
  - show-log
  - migration
  - staff-app
Related:
  - web/packages/pyxis-app/src/pages/ShowLogPage/Page.tsx
  - web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogPanel/PostShowLogPanel.tsx
  - web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.tsx
  - pkg/server/app.go
  - pkg/domain/show_log.go
  - pkg/service/show_log_service.go
  - pkg/repository/postgres/show_log_repo.go
  - pkg/db/queries/show_log.sql
Summary: Plan for hard-cutting legacy Attendance naming to ShowLog/Post-show log with no compatibility route or API aliases.
---

# Attendance to ShowLog migration plan

## Decision

The migration is a **hard cutover**. We do not keep deprecation aliases.

Removed rather than deprecated:

- staff route `/attendance`
- staff API endpoints under `/api/app/attendance`
- frontend RTK `getAttendance` / `updateAttendance` hooks
- MSW `/api/app/attendance` handlers
- old `AttendancePage` folder/component name
- old `Roster/AttendancePanel` and `AttendanceStat` UI components
- backend `AttendanceLog` domain/service/repository naming

Canonical names after the cutover:

- Staff route: `/show-log`
- Staff API list: `GET /api/app/show-log`
- Staff API item: `GET /api/app/show-log/{showId}`
- Staff API update: `PATCH /api/app/show-log/{showId}`
- Page: `ShowLogPage`
- Component family: `components/organisms/ShowLog/*`
- Domain type: `domain.ShowLog`
- Service: `service.ShowLogService`
- Repository: `repository.ShowLogRepository` / `postgres.ShowLogRepo`
- sqlc query file: `pkg/db/queries/show_log.sql`
- Physical table after migration: `show_logs`

## Data model

| Product field | Storage/API field | Notes |
| --- | --- | --- |
| Draw | `show_logs.draw` / `draw` | Count of people at the show. |
| Post-show notes | `show_logs.notes` / `postShowNotes` | Column rename can be deferred; API naming is canonical. |
| Quick highlight | `show_logs.quick_highlight` / `quickHighlight` | First-class field, no notes folding. |
| Total door | `show_logs.total_door_cents` / `totalDoorCents` | Stored in cents to avoid float currency handling. |
| Incident flag | `show_logs.incident` / `incident` | Requires incident notes when true. |
| Incident details | `show_logs.incident_notes` / `incidentNotes` | Staff-only/private note. |

## Implementation checklist

1. Rename page and route to ShowLog.
2. Remove old Attendance-specific UI components and stories.
3. Add missing ShowLog modal persistence fields.
4. Add single-entry ShowLog endpoint.
5. Remove legacy attendance app endpoints and frontend hooks.
6. Rename backend domain/service/repository/sqlc names to ShowLog.
7. Add migration to rename `attendance_logs` to `show_logs`.
8. Validate backend tests and frontend TypeScript/build.
9. Update ticket diary/changelog and commit without unrelated artifacts.

## Caveats

- Generated protobuf types may still contain historical `AttendanceLog` messages until proto cleanup is explicitly scoped; the staff app no longer exposes or calls legacy attendance endpoints.
- Public archive stats may still use the ordinary English metric name “attendance” for aggregate attendance/draw; that is not the legacy staff screen/API compatibility path.
