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
