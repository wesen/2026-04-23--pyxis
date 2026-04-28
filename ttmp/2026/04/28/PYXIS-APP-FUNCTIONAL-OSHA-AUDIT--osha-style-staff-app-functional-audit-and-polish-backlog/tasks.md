---
Title: Staff App Functional OSHA Audit Task Backlog
Ticket: PYXIS-APP-FUNCTIONAL-OSHA-AUDIT
Status: active
Topics:
  - frontend
  - staff-app
  - backend
  - react
  - api-integration
DocType: tasks
Intent: implementation
Summary: Detailed task backlog for missing staff-app backend functionality, inert controls, destructive confirmations, Storybook coverage, and production polish.
LastUpdated: 2026-04-28T14:40:00-04:00
---

# Staff App Functional OSHA Audit Task Backlog

## Phase 0: Audit setup and evidence

- [x] **T00 — Create docmgr ticket workspace**
  - Ticket: `PYXIS-APP-FUNCTIONAL-OSHA-AUDIT`.
  - Scope: exhaustive staff app functionality, backend support, UX polish, and Storybook evidence.

- [x] **T01 — Add top-level staff app smoke script**
  - Script: `scripts/01-staff-app-functional-smoke.js`.
  - Evidence: `sources/01-staff-app-functional-smoke.json`.

- [x] **T02 — Add dynamic route smoke script**
  - Script: `scripts/02-staff-app-dynamic-route-smoke.js`.
  - Evidence: `sources/02-staff-app-dynamic-route-smoke.json`.

- [x] **T03 — Add Storybook inventory script**
  - Script: `scripts/03-storybook-inventory.py`.
  - Evidence: `sources/03-storybook-inventory.json`.

- [x] **T04 — Write OSHA-style functionality report**
  - Report: `design/01-staff-app-functional-osha-report.md`.

## Phase 1: Cross-cutting safety/polish

- [x] **T05 — Fix AppTopBar default action hazard**
  - File: `web/packages/pyxis-app/src/components/shell/AppTopBar/AppTopBar.tsx`.
  - Problem: pages with no explicit action receive visible Search, Notifications, and New show controls that may be inert.
  - Acceptance:
    - Default actions are either removed or backed by a global command dispatcher.
    - Every page explicitly opts into topbar controls.
    - Storybook covers default/no-action and action states.

- [x] **T06 — Add shared confirmation dialog component**
  - Needed for show cancel/archive, flyer delete, booking decline/approve, calendar delete.
  - Acceptance:
    - Accessible modal dialog.
    - Danger/neutral variants.
    - Keyboard close/focus behavior.
    - Storybook states.

- [ ] **T07 — Standardize action feedback**
  - Create/standardize success/error placement for page mutations.
  - Acceptance:
    - All mutations show visible success or useful error.
    - Backend validation messages are not swallowed by generic text where avoidable.

- [ ] **T08 — Add permission-aware disabled/read-only states**
  - Verify admin/booker/door/staff roles.
  - Acceptance:
    - Door/staff users do not see or cannot click disallowed writes.
    - Disabled controls explain required role.

## Phase 2: Dashboard

- [x] **T09 — Wire Dashboard navigation actions**
  - `View all ›` → `/shows`.
  - `Review bookings` → `/bookings`.
  - `Open audit log` → `/log`.
  - Acceptance: browser smoke proves URL changes without reload.

- [x] **T10 — Wire Dashboard show actions**
  - `Edit show` → `/shows/:id` or edit modal.
  - `View on Discord` → actual Discord post URL or disabled state with reason.
  - Acceptance: no inert dashboard buttons remain.

- [ ] **T11 — Add Dashboard Storybook interaction states**
  - With callbacks.
  - No next show.
  - No Discord post.
  - Permission-limited user.

## Phase 3: Shows

- [x] **T12 — Wire Shows search button and search UI**
  - Add search input/panel or inline field.
  - Filter table by artist/genre/date/status.
  - Acceptance: smoke can search and see row counts change.

- [x] **T13 — Wire Shows filter chips**
  - `All`, `Confirmed`, `Hold`, `Cancelled`, `Archived` update visible data.
  - Acceptance: selected state and empty state work.

- [x] **T14 — Wire Shows row edit/navigation buttons**
  - File: `ShowTableRow.tsx` and caller panels.
  - Expected: `Edit <artist>` navigates to `/shows/:id` or opens edit modal.
  - Acceptance: no row edit button stays on `/shows` silently.

- [ ] **T15 — Audit NewShowModal validation**
  - Required fields.
  - Draft vs confirmed.
  - Lineup row add/remove.
  - Flyer upload errors.
  - Acceptance: client-side and backend validation surfaces are clear.

- [ ] **T16 — Add Storybook states for Shows filters/search**
  - Filtered results.
  - No results.
  - Long table.
  - Loading/error page stories if missing.

## Phase 4: Show Detail

- [x] **T17 — Implement Duplicate show flow**
  - Either frontend clone + create mutation or backend `POST /api/app/shows/{id}/duplicate`.
  - Acceptance: Duplicate creates a new editable draft/show and navigates to it or opens modal.

- [x] **T18 — Add confirmation for Archive show**
  - Acceptance: mutation fires only after confirmation.

- [x] **T19 — Add confirmation for Cancel show**
  - Acceptance: mutation fires only after confirmation and status refreshes.

- [x] **T20 — Add confirmation for Delete flyer**
  - Acceptance: deletion requires confirmation.

- [ ] **T21 — Wire ShowDetail Open post**
  - Use `discordMessageId` / `discordChannelId` if present.
  - Disable with explanation if not posted.
  - Acceptance: Open post opens real Discord URL or explains unavailable state.

- [ ] **T22 — Improve Announce feedback**
  - Show posting state, posted state, failure state, and Discord link after success.

## Phase 5: Calendar

- [x] **T23 — Replace Add Hold hardcoded mutation with modal**
  - Current hardcoded date: `2026-06-01`.
  - Modal fields: date, label, notes optional.
  - Acceptance: operator chooses date/label.

- [x] **T24 — Replace Block Date hardcoded mutation with modal**
  - Current hardcoded date: `2026-06-02`.
  - Modal fields: date, reason.
  - Acceptance: operator chooses date/reason.

- [ ] **T25 — Verify/wire month navigation**
  - Previous, Today, Next should update visible month.

- [x] **T26 — Wire Calendar agenda Open show**
  - Expected: navigate to `/shows/:id`.

- [x] **T27 — Define or remove Add to today**
  - Product decision needed.

- [ ] **T28 — Add delete hold/blocked-date UX**
  - Backend delete endpoints exist.
  - Add confirmation.

## Phase 6: Bookings

- [x] **T29 — Wire Open form button**
  - Open public booking form using configured website/public URL.
  - Acceptance: opens `/book` in same/new tab by product decision.

- [x] **T30 — Decide Auto-review product status**
  - If no backend, disable/hide with “coming soon”.
  - If real, define endpoint and response schema.

- [ ] **T31 — Implement booking Hold action**
  - Determine if `SubmissionStatus.HOLD` is supported end-to-end.
  - Wire `onHold` from page to card.
  - Acceptance: pending booking can be moved to hold with status feedback.

- [ ] **T32 — Add Decline reason modal**
  - Use templates or custom reason.
  - Acceptance: decline is not a one-click destructive action.

- [ ] **T33 — Add Approve confirmation and post-approve navigation**
  - Confirm resulting show details.
  - Navigate to created show or display link.

- [ ] **T34 — Wire booking insight template buttons**
  - Template buttons should fill decline/review note or be non-clickable text.

- [ ] **T35 — Wire View archive**
  - Decide destination: processed list, public archive, or audit log.

## Phase 7: Booking Review

- [x] **T36 — Wire Open link**
  - Open booking/artist links from submission.
  - Disable if no links.

- [ ] **T37 — Add booking date selection UX**
  - Make `BookingReviewDatePanel` functional.
  - Check calendar availability if possible.

- [x] **T38 — Improve Save booking details feedback**
  - Show success, validation errors, saving state.

- [x] **T39 — Improve Save review note feedback**
  - Show success, validation errors, saving state.

- [x] **T40 — Share approve/decline confirmation flows with Bookings page**

## Phase 8: Artists

- [ ] **T41 — Audit ArtistRoster accessibility/text duplication**
  - Smoke captured duplicated link text in row button accessible text.
  - Acceptance: screen-reader text is understandable and not duplicated.

- [ ] **T42 — Add duplicate artist validation UX**
  - Backend/DB may reject duplicates; frontend should show useful message.

- [ ] **T43 — Decide delete/merge artist support**
  - If needed, design backend and confirmation UX.

- [ ] **T44 — Add Storybook states for create/update failures**

## Phase 9: Attendance

- [ ] **T45 — Add per-row saving state**
  - Avoid making all rows look saving when one row updates.

- [ ] **T46 — Validate draw and incident inputs**
  - No negative draw.
  - Reasonable max draw handling.
  - Incident notes tied to incident flag.

- [ ] **T47 — Add attendance filter/search if needed**

## Phase 10: Audit Log

- [ ] **T48 — Replace generic topbar actions with audit-log filters**
  - Actor, action, date range.

- [ ] **T49 — Add audit log pagination/limit API if needed**
  - Avoid unbounded log response.

- [ ] **T50 — Add audit log empty/loading/error Storybook states if incomplete**

## Phase 11: Discord

- [ ] **T51 — Add backend Discord settings/status endpoint**
  - Resolve mismatch: endpoint constant exists but route appears missing.
  - Include guild ID, channel mappings, bot visibility, role mapping status.

- [x] **T52 — Replace DiscordPage mock data with backend data**
  - Remove production dependency on `mockData.ts`.

- [ ] **T53 — Add Discord channel mapping edit UX**
  - Save channel IDs.
  - Validate format.

- [ ] **T54 — Add Discord test post/status check action**
  - Useful for bot setup debugging.

## Phase 12: Settings

- [ ] **T55 — Expand Settings sections**
  - Website URL.
  - Public booking settings.
  - Discord settings.
  - Auth/role mapping status.
  - Notification targets.

- [ ] **T56 — Add role-aware Settings edit controls**
  - Admin can edit.
  - Booker/door can view where appropriate.

- [ ] **T57 — Add per-section settings save state**

## Phase 13: Setup and dev-only pages

- [x] **T58 — Decide production status of `/setup`**
  - If production: implement wizard.
  - If not: hide/remove from production routes.

- [x] **T59 — Wire Setup Back/Skip/Continue if kept**

- [x] **T60 — Decide production status of `/modal`**
  - Likely dev-only.
  - Gate behind feature flag or remove from route table.

## Phase 14: Visual/Storybook coverage

- [ ] **T61 — Add missing app page visual-diff targets**
  - Show Detail.
  - Booking Review.
  - Artists.
  - Attendance.
  - Audit Log.
  - Discord.
  - Settings.
  - Modal Showcase if kept.

- [ ] **T62 — Add missing modal/state visual-diff targets**
  - ConfirmDialog.
  - AddHoldModal.
  - BlockDateModal.
  - DeclineReasonModal.
  - DuplicateShow flow.

- [ ] **T63 — Use Storybook at `localhost:6008` for interaction validation**
  - Add play functions or controlled callback stories for key flows.

## Phase 15: Final validation and release readiness

- [ ] **T64 — Run TypeScript and builds**
  - `cd web/packages/pyxis-app && pnpm exec tsc --noEmit`.
  - `cd web/packages/pyxis-app && pnpm exec vite build`.

- [ ] **T65 — Run Go tests after backend changes**
  - `go test ./... -count=1`.

- [ ] **T66 — Re-run staff app functional smoke scripts**
  - Update evidence JSON.

- [ ] **T67 — Create final before/after report and reMarkable upload**
