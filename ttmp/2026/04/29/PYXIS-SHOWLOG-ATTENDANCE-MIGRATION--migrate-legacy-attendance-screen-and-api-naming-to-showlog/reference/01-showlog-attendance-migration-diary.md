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
