---
Title: Staff App Functional OSHA Audit Diary
Ticket: PYXIS-APP-FUNCTIONAL-OSHA-AUDIT
Status: active
Topics:
  - frontend
  - staff-app
  - backend
  - react
DocType: reference
Intent: diary
Summary: Chronological diary for exhaustive staff-app functionality and polish inspection.
LastUpdated: 2026-04-28T13:45:00-04:00
---

# Diary

## Step 1: Create ticket

Created ticket workspace:

```text
ttmp/2026/04/28/PYXIS-APP-FUNCTIONAL-OSHA-AUDIT--osha-style-staff-app-functional-audit-and-polish-backlog
```

The user asked for a page-by-page OSHA-style staff app inspection on the live Vite app at:

```text
http://localhost:3008/
```

The requested outputs are:

- exhaustive functionality analysis;
- missing backend functionality/polish ticket;
- detailed intern-friendly report;
- detailed task list;
- scripts stored in the ticket `scripts/` folder;
- upload to reMarkable.

## Step 2: Add top-level functional smoke script

Added:

```text
scripts/01-staff-app-functional-smoke.js
```

Initial run failed because the script was located outside the package that has Playwright installed. I fixed it by using Node `createRequire()` from the current working directory package.

Successful invocation:

```bash
cd web/packages/pyxis-app
node ../../../ttmp/2026/04/28/PYXIS-APP-FUNCTIONAL-OSHA-AUDIT--osha-style-staff-app-functional-audit-and-polish-backlog/scripts/01-staff-app-functional-smoke.js \
  ../../../ttmp/2026/04/28/PYXIS-APP-FUNCTIONAL-OSHA-AUDIT--osha-style-staff-app-functional-audit-and-polish-backlog/sources/01-staff-app-functional-smoke.json
```

The script used dev auth:

```text
/auth/dev-login?username=osha-auditor&role=admin
```

and visited:

```text
/
/shows
/calendar
/bookings
/artists
/attendance
/log
/discord
/settings
/setup
/modal
```

Evidence file:

```text
sources/01-staff-app-functional-smoke.json
```

## Step 3: Add dynamic route smoke script

Added:

```text
scripts/02-staff-app-dynamic-route-smoke.js
```

Invocation:

```bash
cd web/packages/pyxis-app
node ../../../ttmp/2026/04/28/PYXIS-APP-FUNCTIONAL-OSHA-AUDIT--osha-style-staff-app-functional-audit-and-polish-backlog/scripts/02-staff-app-dynamic-route-smoke.js \
  ../../../ttmp/2026/04/28/PYXIS-APP-FUNCTIONAL-OSHA-AUDIT--osha-style-staff-app-functional-audit-and-polish-backlog/sources/02-staff-app-dynamic-route-smoke.json
```

It inspected:

- Shows row edit button behavior;
- Show Detail `/shows/:id`;
- Booking Review `/bookings/review/:id`.

Evidence file:

```text
sources/02-staff-app-dynamic-route-smoke.json
```

Important findings:

- Shows row edit button did not navigate.
- Show Detail Duplicate did not visibly do anything.
- Show Detail Announce produced `Announcement requested.`
- Booking Review Open link did not visibly do anything.
- Booking Review save buttons are clickable and did not produce errors in the smoke.

## Step 4: Add Storybook inventory

Added:

```text
scripts/03-storybook-inventory.py
```

Invocation:

```bash
python3 scripts/03-storybook-inventory.py \
  http://localhost:6008/index.json \
  sources/03-storybook-inventory.json
```

Result:

```text
247 pyxis-app Storybook entries
```

The app has extensive Storybook coverage, including page stories and organism/molecule states. This is useful for further validation, but the audit found that Storybook callback demos do not guarantee live Vite pages pass those callbacks.

## Step 5: Write OSHA report and task backlog

Created report:

```text
design/01-staff-app-functional-osha-report.md
```

Rewrote tasks:

```text
tasks.md
```

The task backlog currently contains 68 tasks across cross-cutting safety, Dashboard, Shows, Show Detail, Calendar, Bookings, Booking Review, Artists, Attendance, Audit Log, Discord, Settings, Setup/dev-only routes, Storybook/visual coverage, and final validation.

## Step 6: Upload report to reMarkable

Uploaded the report bundle:

```text
design/01-staff-app-functional-osha-report.md
tasks.md
reference/01-osha-audit-diary.md
```

Remote destination:

```text
/ai/2026/04/28/PYXIS-APP-FUNCTIONAL-OSHA-AUDIT/PYXIS-APP-FUNCTIONAL-OSHA-AUDIT staff app functionality report
```

Commands:

```bash
remarquee upload bundle ... --dry-run
remarquee upload bundle ...
remarquee cloud ls /ai/2026/04/28/PYXIS-APP-FUNCTIONAL-OSHA-AUDIT --long --non-interactive
```

Result:

```text
[f] PYXIS-APP-FUNCTIONAL-OSHA-AUDIT staff app functionality report
```
