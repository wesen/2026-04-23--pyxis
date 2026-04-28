---
Title: pyxis-app Visual and Functional UX Audit Tasks
Ticket: PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT
Status: active
Topics:
  - frontend
  - staff-app
  - storybook
  - react
DocType: tasks
Intent: implementation
Summary: Task plan for staff-app visual parity tuning and functional UX coverage audit.
LastUpdated: 2026-04-27T23:45:00-04:00
---

# pyxis-app Visual and Functional UX Audit Tasks

## Phase 0: Ticket setup and knowledge recovery

- [x] **T00 — Create docmgr ticket workspace**
  - Ticket: `PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT`.
  - Scope: staff-app visual parity, component/section tuning strategy, action wiring audit, backend support map, missing UX design list.

- [x] **T01 — Create chronological diary**
  - Created `reference/01-investigation-diary.md`.

- [x] **T02 — Read prior visual-diff runbooks and diaries**
  - Read app visual tuning runbook, css-visual-diff operator guide, previous app diary, and public-site mobile tuning diary.

## Phase 1: Inventory and tooling

- [x] **T03 — Add read-only app surface inventory script**
  - Script: `scripts/01-inventory-app-surfaces.py`.
  - Output: `sources/01-app-surface-inventory.json`.

- [x] **T04 — Add focused app visual comparison wrapper**
  - Script: `scripts/02-compare-app-target.sh`.
  - Supports `SPEC=pages|components`, `PAGE=...`, optional `SECTION=...`, and `OUT=...`.

- [x] **T05 — Record initial route/spec/API/action inventory**
  - Initial result: 14 routes, 6 page visual spec targets, 15 component spec targets, 43 backend routes, 61 suspicious action lines.

## Phase 2: Analysis and implementation guide

- [x] **T06 — Write intern-friendly implementation guide**
  - Guide: `design/01-pyxis-app-visual-functional-audit-implementation-guide.md`.
  - Covers architecture, visual-diff loop, route map, API map, action audit, UX gaps, and phased strategy.

- [x] **T07 — Identify visual coverage gaps**
  - Existing page spec covers Dashboard, Login, Setup, Shows, Calendar, Bookings.
  - Missing page-level coverage: Show Detail, Booking Review, Artists, Attendance, Audit Log, Discord, Settings, Modal Showcase.

- [x] **T08 — Identify high-priority functional gaps**
  - Dashboard callbacks.
  - Shows filter/search.
  - Show Detail duplicate/destructive confirmations/Discord post link.
  - Calendar hold/block modals instead of hardcoded dates.
  - Bookings hold/open-form/auto-review/decline reason.
  - Discord page backend wiring.
  - Setup wizard wiring.

## Phase 3: Next implementation work

- [ ] **T09 — Start visual servers and run shell baseline comparisons**
  - Run prototype server on `7070`.
  - Run pyxis-app Storybook on `6008`.
  - Compare `app-sidebar`, `app-topbar-dashboard`, and `app-mobile-bottom-nav`.

- [ ] **T10 — Create app page visual coverage matrix**
  - For each React route, list visual target/story, main sections, backend data, and primary actions.

- [ ] **T11 — Add missing visual spec targets**
  - Add page/component targets for Show Detail, Booking Review, Artists, Attendance, Audit Log, Discord, Settings, and Modal Showcase or justify component-only coverage.

- [ ] **T12 — Tune Dashboard recursively**
  - Compare/tune shell, hero, metrics, upcoming, quick-actions, activity, and attention sections.
  - Add/wire dashboard callbacks as appropriate.

- [ ] **T13 — Tune Shows and NewShowModal recursively**
  - Compare/tune filters, confirmed panel, archived panel, and modal states.
  - Design/wire filter/search UI.

- [ ] **T14 — Tune Calendar recursively**
  - Compare/tune month and agenda panels.
  - Design hold/block modal forms.

- [ ] **T15 — Tune Bookings recursively**
  - Compare/tune queue and processed panels.
  - Design hold/decline/open-form/auto-review states.

- [ ] **T16 — Audit and tune remaining admin pages**
  - Artists, Attendance, Audit Log, Discord, Settings, Setup.

- [ ] **T17 — Run final validation**
  - `cd web/packages/pyxis-app && pnpm exec tsc --noEmit`.
  - `cd web/packages/pyxis-app && pnpm exec vite build`.
  - `go test ./... -count=1` if backend/API behavior changes.

- [ ] **T18 — Publish final review bundle if needed**
  - Build a compact review site or summary JSON for selected app page/component comparisons.
