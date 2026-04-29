---
Title: ShowLog Attendance migration diary
Ticket: PYXIS-SHOWLOG-ATTENDANCE-MIGRATION
Status: active
Topics:
  - frontend
  - backend
  - staff-app
  - api-design
DocType: diary
Intent: implementation-diary
Owners: []
Summary: Chronological diary for renaming legacy Attendance screen/components/API concepts to ShowLog/Post-show log.
LastUpdated: 2026-04-29T11:05:00-04:00
---

# ShowLog Attendance migration diary

## Step 1: Created migration ticket

Created a dedicated ticket for the cleanup that became obvious during the ShowLog modal work:

```text
PYXIS-SHOWLOG-ATTENDANCE-MIGRATION
```

The core problem is that the product surface is now called **Post-show log** / **ShowLog**, but a number of code paths still use the old **Attendance** name. The `/attendance` route now renders the new `PostShowLogPanel`, but the page folder/component name remains `AttendancePage`, old `Roster/AttendancePanel` components still exist, and legacy `/api/app/attendance` endpoints still exist beside the newer `/api/app/show-log` endpoints.

Initial rule: keep public/staff route compatibility for `/attendance` until navigation/bookmarks can be migrated, but clean internal component names and remove obsolete UI components so Storybook no longer shows two competing post-show-log implementations.


## Step 2: Completed first frontend rename and old component removal

Renamed the page layer from `AttendancePage` to `ShowLogPage` while keeping the existing `/attendance` route for compatibility and adding `/show-log` as a canonical route alias.

Moved:

```text
web/packages/pyxis-app/src/pages/AttendancePage/ -> web/packages/pyxis-app/src/pages/ShowLogPage/
```

Updated exports/imports in:

```text
web/packages/pyxis-app/src/pages/Pages.tsx
web/packages/pyxis-app/src/App.tsx
```

Removed old UI-only Attendance components that duplicated the new ShowLog component family:

```text
web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/
web/packages/pyxis-app/src/components/molecules/AttendanceStat/
```

Updated the page Storybook title from `Pyxis App/Pages/Attendance` to `Pyxis App/Pages/ShowLog` and replaced stale interaction stories (`save attendance`, `search attendance`) with ShowLog-oriented `OpenDetails` and `OpenEditor` stories.

Validation so far:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```

Result: passed.

Post-rename inventory was written to:

```text
sources/02-post-frontend-rename-inventory.txt
```

The remaining lowercase `attendance` references are backend/API/domain compatibility names (`/api/app/attendance`, `attendance_logs`, `AttendanceLog`) and should be handled in the API/schema phase rather than mixed into this UI cleanup commit.


## Step 3: Added first ShowLog schema/API alignment

Added first-class persistence for fields that the new ShowLog modal sketches introduced:

```text
quick_highlight TEXT
total_door_cents INT
```

Migration files:

```text
pkg/db/migrations/000004_add_show_log_fields.up.sql
pkg/db/migrations/000004_add_show_log_fields.down.sql
```

Updated `attendance_logs` sqlc queries and regenerated `pkg/db/*` code. The physical table name remains `attendance_logs` for now, but the ShowLog API now exposes these values as ShowLog fields. This follows the compatibility policy from the plan: clean frontend/product naming first, then evolve the schema without doing a risky table rename in the same slice.

Added:

```text
GET /api/app/show-log/{showId}
```

so the backend now matches the design-guide API shape for list, single entry, and patch. The legacy `/api/app/attendance` endpoints remain compatibility-only for now.

Validation:

```bash
go test ./pkg/server ./pkg/service ./pkg/repository/postgres -count=1
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

All passed.


## Step 4: Wired modal draft fields to real ShowLog fields

Updated the ShowLog editor modal draft/save path so `quickHighlight` and `totalDoorCents` are no longer folded into `postShowNotes`. The modal now hydrates `quickHighlight` from the entry, formats `totalDoorCents` as dollars for the field, parses dollars back to cents on save, and sends all fields through `ShowLogUpdateInput`.

This keeps the visual modal aligned with the backend migration from Step 3.

## Step 5: Switched from compatibility policy to hard cutover

The operator clarified that we should not keep deprecation/compatibility paths. I changed the plan from “keep `/attendance` and `/api/app/attendance` for now” to a hard ShowLog cutover.

Implementation changes:

- Removed the `/attendance` staff route from `web/packages/pyxis-app/src/App.tsx`.
- Updated staff navigation to point at `/show-log` only.
- Removed frontend `attendance` endpoint constants and RTK attendance query/mutation hooks.
- Removed MSW `/api/app/attendance` handlers.
- Removed backend `/api/app/attendance` route registrations and handler functions.
- Renamed backend/domain layers from Attendance names to ShowLog names:
  - `domain.AttendanceLog` -> `domain.ShowLog`
  - `AttendanceService` -> `ShowLogService`
  - `AttendanceRepository` -> `ShowLogRepository`
  - `postgres.AttendanceRepo` -> `postgres.ShowLogRepo`
  - `pkg/db/queries/attendance.sql` -> `pkg/db/queries/show_log.sql`
- Added migration `000005_rename_attendance_logs_to_show_logs` to rename the physical table.
- Updated sqlc query names to `GetShowLog`, `ListShowLogs`, and `UpsertShowLog`.
- Changed API payload ID from `attendanceLogId` to `showLogId`.

Validation so far:

```bash
go test ./pkg/server ./pkg/service ./pkg/repository/postgres -count=1
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```
