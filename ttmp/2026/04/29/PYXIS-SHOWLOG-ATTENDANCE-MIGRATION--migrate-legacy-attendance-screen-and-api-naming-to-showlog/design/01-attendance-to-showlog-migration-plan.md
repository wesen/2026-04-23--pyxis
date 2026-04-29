---
Title: Attendance to ShowLog migration plan
Ticket: PYXIS-SHOWLOG-ATTENDANCE-MIGRATION
Status: active
Topics:
    - frontend
    - backend
    - staff-app
    - api-design
DocType: design
Intent: implementation-plan
Owners: []
RelatedFiles:
    - Path: pkg/server/server.go
      Note: Legacy attendance API and new show-log API coexist here
    - Path: web/packages/pyxis-app/src/components/molecules/AttendanceStat/AttendanceStat.tsx
      Note: Old attendance-only stat molecule to remove if unused
    - Path: web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/AttendancePanel.tsx
      Note: Obsolete old attendance editor organism to remove
    - Path: web/packages/pyxis-app/src/pages/AttendancePage/Page.tsx
      Note: Legacy page name currently rendering new ShowLog panel
ExternalSources: []
Summary: Plan for cleanly renaming legacy Attendance UI concepts to ShowLog while preserving route/API compatibility where needed.
LastUpdated: 2026-04-29T11:05:00-04:00
WhatFor: ""
WhenToUse: ""
---


# Attendance to ShowLog migration plan

## Problem

The staff screen is now conceptually **Post-show log**. The new UI components live under:

```text
web/packages/pyxis-app/src/components/organisms/ShowLog/
```

The route at `/attendance` already renders `PostShowLogPanel` through RTK Query hooks:

```ts
useGetShowLogQuery()
useUpdateShowLogMutation()
```

However, the legacy name remains in several places:

- `pages/AttendancePage/`
- `AttendancePage` export/import names
- `Roster/AttendancePanel` organism and stories
- `AttendanceStat` molecule and stories
- `/api/app/attendance` endpoints
- `attendance_logs` DB table and `AttendanceLog` domain type

The immediate cleanup should remove obsolete UI components and rename page-level code. API/DB work should be phased because it may require compatibility decisions and migrations.

## Compatibility policy

For the first implementation slice:

- Keep `/attendance` as a route alias because staff navigation/bookmarks may depend on it.
- Add `/show-log` as the canonical route alias if route naming cleanup is cheap.
- Remove old UI components that are not used by the new screen.
- Keep backend `/api/app/attendance` endpoints until a separate compatibility/removal decision is made.
- Keep the physical `attendance_logs` table for now; add ShowLog fields later if the new modal fields are approved for persistence.

## API/schema fit

Current backend supports the core old ShowLog data:

| UI concept | Current storage/API | Fit |
| --- | --- | --- |
| Pre-show note | `shows.notes` -> `showNotes` | Good |
| Draw | `attendance_logs.draw` | Good |
| Post-show notes | `attendance_logs.notes` -> `postShowNotes` | Good but legacy column name |
| Incident flag | `attendance_logs.incident` | Good |
| Incident details | `attendance_logs.incident_notes` | Good |
| Quick highlight | none | Missing |
| Total door | none | Missing |
| Single show-log entry | planned `GET /api/app/show-log/{showId}` | Missing |

Recommended later schema fields:

```sql
quick_highlight TEXT,
total_door_cents INT
```

## Frontend target

Rename:

```text
pages/AttendancePage/Page.tsx -> pages/ShowLogPage/Page.tsx
pages/AttendancePage/Page.stories.tsx -> pages/ShowLogPage/Page.stories.tsx
```

Update exports/imports:

```text
pages/Pages.tsx
App.tsx
```

Remove old components if no longer imported:

```text
components/organisms/Roster/AttendancePanel/
components/molecules/AttendanceStat/
```

## Validation

- `cd web/packages/pyxis-app && pnpm exec tsc --noEmit`
- `cd web/packages/pyxis-app && pnpm exec vite build`
- `docmgr doctor --ticket PYXIS-SHOWLOG-ATTENDANCE-MIGRATION --stale-after 30`
