---
Title: Staff App Functional OSHA Audit Changelog
Ticket: PYXIS-APP-FUNCTIONAL-OSHA-AUDIT
Status: active
Topics:
  - frontend
  - staff-app
  - backend
  - react
DocType: changelog
Intent: history
Summary: Changelog for exhaustive staff app functionality and polish audit.
LastUpdated: 2026-04-28T13:45:00-04:00
---

# Changelog

## 2026-04-28

- Created ticket workspace for OSHA-style staff app functionality and polish audit.
- Added browser smoke script for top-level staff routes: `scripts/01-staff-app-functional-smoke.js`.
- Generated evidence: `sources/01-staff-app-functional-smoke.json`.
- Added dynamic route smoke script for show detail and booking review: `scripts/02-staff-app-dynamic-route-smoke.js`.
- Generated evidence: `sources/02-staff-app-dynamic-route-smoke.json`.
- Added Storybook inventory script: `scripts/03-storybook-inventory.py`.
- Generated evidence: `sources/03-storybook-inventory.json` with 247 pyxis-app Storybook entries.
- Wrote exhaustive functionality report: `design/01-staff-app-functional-osha-report.md`.
- Wrote detailed implementation task backlog in `tasks.md`.
- Created chronological diary: `reference/01-osha-audit-diary.md`.
- Uploaded the report/task/diary bundle to reMarkable under `/ai/2026/04/28/PYXIS-APP-FUNCTIONAL-OSHA-AUDIT`.
- Implemented the first staff-app safety/wiring pass: explicit topbar actions, shared ConfirmDialog, Dashboard callbacks, Shows search/filter/edit navigation, Show Detail duplicate/destructive confirmations, Bookings/Booking Review confirmations and feedback.
- Added post-change smoke evidence: `sources/04-staff-app-functional-smoke-after-phase1.json` and `sources/05-staff-app-dynamic-route-smoke-after-phase1.json`.
- Replaced Calendar hardcoded Add Hold / Block Date actions with modal forms and wired agenda Open show/Add to today callbacks.
- Added smoke evidence: `sources/06-staff-app-functional-smoke-after-calendar.json`.
- Replaced DiscordPage mock channel data with backend settings-derived bot status and channel mappings.
- Wired Setup Back/Skip/Continue navigation and gated `/modal` as a dev-only route.
- Implemented Artists accessibility/search/duplicate-name validation and Storybook states.
- Implemented Attendance search, per-row saving state, draw/incident validation, and Storybook validation states.
- Added visible Chromium Playwright JS evidence: `sources/07-artists-attendance-visible-chromium.json`.
