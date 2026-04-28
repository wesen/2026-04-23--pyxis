---
Title: pyxis-app OSHA-Style Functional Audit and Polish Report
Ticket: PYXIS-APP-FUNCTIONAL-OSHA-AUDIT
Status: active
Topics:
  - frontend
  - staff-app
  - backend
  - react
  - api-integration
DocType: design
Intent: functionality-report
Summary: Exhaustive staff-app functional audit covering routes, controls, backend/API support, Storybook coverage, missing UX states, and a task backlog for production polish.
LastUpdated: 2026-04-28T13:45:00-04:00
WhatFor: Use to plan staff-app backend/functionality/polish implementation after visual tuning infrastructure was established.
WhenToUse: Read before wiring buttons, adding backend endpoints, changing staff app workflows, or creating Storybook states for pyxis-app.
---

# pyxis-app OSHA-Style Functional Audit and Polish Report

## 1. Executive summary

This report is an OSHA-style inspection of the `pyxis-app` staff portal running at:

```text
http://localhost:3008/
```

The inspection used a local development admin session through:

```text
/auth/dev-login?username=osha-auditor&role=admin
```

and exercised every top-level staff route, plus dynamic routes for show detail and booking review. The goal was not only to ask, “does the page render?” but to ask:

- Does every visible control do something?
- If it does something, is that something backed by a real backend endpoint?
- Does the user receive visible feedback?
- Are destructive operations protected?
- Are loading, empty, error, success, disabled, and permission states designed?
- Does Storybook cover the state enough to validate changes safely?
- Is the behavior production-worthy or merely prototype-like?

The broad finding is that the staff app is substantially more functional than a static prototype: most core backend domains exist and many mutations are wired. However, the app still has several “inspection red flags”: visible buttons with no behavior, actions that perform real backend writes without enough operator confirmation, controls that use hardcoded dates, pages that use mock data, and global topbar actions that appear on pages where they are not wired.

The highest-priority repairs are:

1. Wire or remove global topbar default actions (`Search`, `Notifications`, `New show`) on pages that do not explicitly supply an action.
2. Wire Dashboard quick actions to navigation/modal behavior.
3. Implement Shows search/filter UI or remove the buttons until implemented.
4. Add confirmation modals for destructive show and booking actions.
5. Replace Calendar hardcoded Add Hold / Block Date actions with real modal forms.
6. Decide and implement Booking `Open form`, `Auto-review`, `Hold`, and decline reason UX.
7. Replace Discord page mock data with backend-backed settings/status or mark it as setup-only.
8. Wire Setup wizard buttons or remove the route from the production staff nav.
9. Add missing route/page visual-diff targets for pages not covered in the current app YAML specs.

---

## 2. Method and evidence

### 2.1 Browser smoke scripts

The ticket contains three read-only exploration scripts:

```text
scripts/01-staff-app-functional-smoke.js
scripts/02-staff-app-dynamic-route-smoke.js
scripts/03-storybook-inventory.py
```

Generated evidence:

```text
sources/01-staff-app-functional-smoke.json
sources/02-staff-app-dynamic-route-smoke.json
sources/03-storybook-inventory.json
```

`01-staff-app-functional-smoke.js` visits top-level routes and records:

- buttons;
- links;
- inputs;
- `data-section` regions;
- status/alert text;
- safe click interactions.

`02-staff-app-dynamic-route-smoke.js` visits dynamic routes:

- `/shows/:id`;
- `/bookings/review/:id`.

`03-storybook-inventory.py` fetches Storybook index data from:

```text
http://localhost:6008/index.json
```

### 2.2 Runtime access model

The staff app routes are session-gated by:

```text
web/packages/pyxis-app/src/App.tsx
```

Most routes are wrapped in:

```tsx
<RequireSession>
  <SomePage />
</RequireSession>
```

For the audit, the backend already had local dev auth enabled, and the smoke script logged in through:

```text
GET /auth/dev-login?username=osha-auditor&role=admin
```

Evidence from the smoke file:

```json
{
  "authenticated": true,
  "user": {
    "discordId": "dev:osha-auditor",
    "discordUsername": "osha-auditor",
    "role": "admin"
  },
  "spaceName": "Pyxis"
}
```

### 2.3 Important caveat

The smoke scripts intentionally avoid destructive operations where possible. They did click some real-but-low-risk operations such as Calendar Add Hold and Block Date because those are already wired to fixed test dates. The scripts do not intentionally cancel shows, archive shows, approve bookings, decline bookings, or create persistent artists/shows.

---

## 3. System primer for a new intern

### 3.1 What is `pyxis-app`?

`pyxis-app` is the staff operations portal for Pyxis. It is not the public website. It is where staff manage:

- shows;
- bookings/submissions;
- calendar holds and blocked dates;
- artist roster;
- post-show attendance logs;
- audit logs;
- Discord-related settings/status;
- core venue settings.

The frontend lives in:

```text
web/packages/pyxis-app
```

The backend lives mainly in:

```text
pkg/server
pkg/service
pkg/repository
pkg/db
```

The shared protobuf/TypeScript schema lives in:

```text
proto/pyxis/v1/show.proto
web/packages/pyxis-types/src/generated/proto/pyxis/v1/show_pb.ts
```

### 3.2 The rendering stack

```text
Browser
  ↓
React Router route in web/packages/pyxis-app/src/App.tsx
  ↓
Page component in web/packages/pyxis-app/src/pages/*/Page.tsx
  ↓
AppShell + organisms + molecules
  ↓
RTK Query hooks from web/packages/pyxis-app/src/api/appApi.ts
  ↓
Go HTTP handlers in pkg/server/*.go
  ↓
Services in pkg/service/*.go
  ↓
Postgres repositories/sqlc in pkg/repository and pkg/db
```

### 3.3 The API contract

The staff frontend endpoint constants are defined in:

```text
web/packages/pyxis-app/src/api/endpoints.ts
```

The frontend RTK Query hooks are defined in:

```text
web/packages/pyxis-app/src/api/appApi.ts
```

The backend route table is in:

```text
pkg/server/server.go
```

The core route groups are:

```text
/auth/*                   login/logout/session helpers
/api/app/session          current app session
/api/app/shows            staff show CRUD/actions
/api/app/bookings         booking submission review/actions
/api/app/artists          artist roster CRUD
/api/app/calendar         calendar events/holds/blocked dates
/api/app/attendance       post-show attendance logs
/api/app/settings         core settings
/api/app/audit-log        admin audit log
```

### 3.4 How to inspect a button

For every button, use this checklist:

```text
1. Find the button in the page TSX or organism TSX.
2. Check whether it has an onClick/onSubmit handler.
3. If it calls a callback prop, check whether the page passes that prop.
4. If it calls a mutation, find the RTK hook in appApi.ts.
5. Find the endpoint in endpoints.ts.
6. Find the backend route in server.go.
7. Check whether there is loading/disabled/success/error UI.
8. If destructive, check whether there is confirmation UX.
9. Check whether Storybook has normal/empty/error/loading/mutation stories.
```

Pseudocode:

```text
for each page:
  for each visible control:
    source = grep(control label)
    if no onClick and no form submit:
      classify STUB_VISIBLE
    else if callback prop is not passed by page:
      classify CALLBACK_NOT_WIRED
    else if RTK endpoint exists but UX state missing:
      classify WIRED_BUT_UNPOLISHED
    else if backend route missing:
      classify FRONTEND_ONLY_NEEDS_BACKEND
    else:
      classify WIRED
```

---

## 4. Storybook coverage findings

Storybook is available at:

```text
http://localhost:6008/
```

The index inventory found:

```text
247 pyxis-app Storybook entries
```

This is good coverage. Notably, there are page stories for:

- Artists;
- Attendance;
- Audit Log;
- Booking Review;
- Bookings;
- Calendar;
- Dashboard;
- Discord;
- Login;
- Modal Showcase;
- Settings;
- Setup;
- Show Detail;
- Shows.

Important component story coverage includes:

- Dashboard panels;
- Shows panels/tables;
- Booking queue/review panels;
- Calendar board/month/agenda;
- Artist roster;
- Attendance panel;
- Settings panel;
- Show detail panels;
- Shell components.

However, Storybook coverage does not automatically mean production functionality is complete. Several stories demonstrate “with callbacks” by logging to console; the live app sometimes does not pass equivalent callbacks.

Inspection rule:

```text
Storybook validates visual states and component callback API shape.
Live Vite validates actual route, state, backend, and navigation behavior.
Both are required.
```

---

## 5. Page-by-page OSHA inspection

## 5.1 Dashboard `/`

### Files

```text
web/packages/pyxis-app/src/pages/DashboardPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Dashboard/*
web/packages/pyxis-app/src/api/appApi.ts
```

### Observed controls

The smoke script found visible buttons:

```text
Search
Notifications
New show
View on Discord
Edit show
View all ›
Add a show
Review bookings · 1
Open audit log
```

### Backend/API support

Dashboard reads:

```ts
useGetShowsQuery()
useGetBookingsQuery()
useGetAuditLogQuery()
```

These are backend-backed.

### Findings

**DASH-001: Dashboard quick actions are likely callback-capable but not page-wired.**

`DashboardOverview` and subcomponents expose callbacks such as:

```text
onAddShow
onReviewBookings
onOpenAuditLog
onViewAll
onEditShow
onViewDiscord
```

But `DashboardPage` currently renders:

```tsx
<DashboardOverview shows={...} bookings={...} log={...} />
```

without passing callbacks.

Expected behavior:

```text
View all          → /shows
Add a show        → open NewShowModal or navigate to /shows with modal state
Review bookings   → /bookings
Open audit log    → /log
Edit show         → /shows/:id
View on Discord   → open Discord message URL if available, otherwise disabled/explained
```

**DASH-002: Default TopBar actions appear but may not be route-aware.**

The default `AppTopBar` renders `Search`, `Notifications`, and `New show` when a page does not provide a custom action. On Dashboard they are visible. If not wired, they should be supplied as real callbacks or hidden.

### Required tasks

- Wire dashboard quick-action callbacks.
- Decide global topbar action contract.
- Add Storybook stories for Dashboard with real callback behavior captured in play functions or interaction tests.

---

## 5.2 Shows `/shows`

### Files

```text
web/packages/pyxis-app/src/pages/ShowsPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Shows/*
web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
web/packages/pyxis-app/src/components/molecules/ShowTableRow/ShowTableRow.tsx
```

### Observed controls

```text
Filter shows
Search shows
New show
All
Confirmed 5
Hold
Cancelled
Archived
Edit <show>
See all past shows
```

### Findings

**SHOWS-001: Filter and search icon buttons are visible but inert.**

The smoke clicked both and the page state did not change. `ShowsPage` renders:

```tsx
<Button iconLeft="filter" aria-label="Filter shows" />
<Button iconLeft="search" aria-label="Search shows" />
```

without handlers.

**SHOWS-002: Filter chips appear static.**

The page displays `All`, `Confirmed`, `Hold`, `Cancelled`, `Archived`, but filtering appears not to be wired to page state. This is a production UX hazard because it invites the operator to rely on a filter that does not filter.

**SHOWS-003: Row edit buttons appear inert.**

The dynamic smoke clicked the first `Edit Burial Hex` button and remained at `/shows`. `ShowTableRow` renders an edit button but does not accept or call an edit/navigation callback.

Expected behavior:

```text
Edit row → navigate('/shows/:id') or open edit modal
```

**SHOWS-004: New Show modal is wired but needs deeper validation audit.**

The `New show` button opens the modal and Cancel closes it. Creation is wired to backend through:

```text
useCreateShowMutation
useUploadShowFlyerMutation
```

Need to test validation, required fields, flyer upload errors, long lineup, and draft vs confirmed behavior.

### Required tasks

- Implement search field/open state.
- Implement filter chip state and data filtering.
- Add row navigation/edit behavior.
- Add visual/Storybook states for filtered/no-result views.
- Add NewShowModal validation and mutation-state tests.

---

## 5.3 Show Detail `/shows/:id`

### Files

```text
web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/ShowDetail/*
web/packages/pyxis-app/src/components/organisms/FlyerField/FlyerField.tsx
```

### Observed controls

```text
Edit
Open post
Delete flyer
Upload flyer
Duplicate
Archive
Announce
Cancel show
```

### Findings

**DETAIL-001: Edit is wired.**

Clicking Edit opens the `NewShowModal` in edit mode. This is good.

**DETAIL-002: Duplicate is visible but inert.**

The dynamic smoke clicked Duplicate and there was no state change or status. This button should either be wired or removed.

Expected behavior:

```text
Duplicate → open NewShowModal prefilled from current show, with date/status reset
```

Possible backend strategy:

```text
frontend-only clone existing Show object → POST /api/app/shows
```

or:

```text
POST /api/app/shows/:id/duplicate
```

**DETAIL-003: Archive and Cancel are real mutations without confirmation.**

These actions are destructive or semi-destructive. They must not fire immediately on a single click.

Required UX:

```tsx
<ConfirmDialog
  title="Cancel show?"
  body="This hides/cancels the show and records an audit entry."
  confirmLabel="Cancel show"
  variant="danger"
/>
```

**DETAIL-004: Announce is wired but lacks rich Discord post feedback.**

Clicking Announce produced:

```text
Announcement requested.
```

This is good as a baseline, but the page should show whether the show has a Discord message ID/channel ID and provide an actual open-post link.

**DETAIL-005: Open post lacks page-level wiring/data.**

`ShowDetailDiscordPanel` has an `Open post` button, but the page renders it without supplying the actual Discord URL callback.

**DETAIL-006: Flyer delete is destructive and needs confirmation.**

Delete flyer is a real backend operation; it should use confirmation UX.

### Required tasks

- Implement Duplicate flow.
- Add confirmation for Archive, Cancel, Delete flyer.
- Wire Open post to Discord message URL or disable with explanation.
- Show Discord post state: not posted, posting, posted, failed.

---

## 5.4 Calendar `/calendar`

### Files

```text
web/packages/pyxis-app/src/pages/CalendarPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Calendar/*
```

### Observed controls

```text
Add hold
Block date
Previous month
Today
Next month
Open show
Add to today
```

### Findings

**CAL-001: Add Hold writes a hardcoded date.**

Clicking Add Hold produced:

```text
Hold created for 2026-06-01.
```

This is backend-backed but not production-worthy. The operator did not choose the date or label.

**CAL-002: Block Date writes a hardcoded date.**

Clicking Block Date produced:

```text
Blocked date created for 2026-06-02.
```

Same problem: real mutation, but no input form.

**CAL-003: Month navigation needs verification.**

The script recorded Previous month, Today, and Next month controls, but did not verify calendar state changes. These should be checked manually/with Playwright.

**CAL-004: Open show / Add to today require behavior definition.**

The agenda component exposes callbacks in Storybook. The live page should be checked to ensure `Open show` navigates to `/shows/:id`; `Add to today` needs a product definition.

### Required tasks

- Add `AddHoldModal` with date and label.
- Add `BlockDateModal` with date and reason.
- Add delete controls for holds/blocked dates if supported.
- Verify month navigation.
- Wire `Open show` navigation.
- Define or remove `Add to today`.

---

## 5.5 Bookings `/bookings`

### Files

```text
web/packages/pyxis-app/src/pages/BookingsPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Bookings/*
web/packages/pyxis-app/src/components/molecules/BookingCard/BookingCard.tsx
```

### Observed controls

```text
Open form
Auto-review
Hold
Decline
Approve
View archive
Not a fit right now ›
Double-booked that night ›
Too soon — try next season ›
Need more info ›
```

### Findings

**BOOK-001: Open form is visible but inert.**

Clicking it did not navigate or open a new tab. It should open the public booking form, probably:

```text
http://localhost:3007/book
```

or production website URL + `/book`.

**BOOK-002: Auto-review is visible but inert.**

No backend endpoint appears to support auto-review. This should be disabled with “coming soon,” hidden, or backed by a real workflow.

**BOOK-003: Hold appears in cards but is not page-wired.**

`BookingCard` has `onHold`, but `BookingsPage` passes only `onApprove` and `onDecline`.

**BOOK-004: Decline should require reason/confirmation.**

Decline is destructive and should not be one-click. The templates in the insights panel imply a reason workflow exists conceptually, but it is not wired into the actual decline action.

**BOOK-005: Approve likely creates a show, but needs confirmation and success navigation.**

Approving a booking creates or promotes a show. The UI should communicate what will be created and provide navigation to the resulting show.

**BOOK-006: View archive and template buttons appear inert.**

The smoke saw `View archive` and template buttons. They need either callbacks or disabled styling.

### Required tasks

- Wire Open form to configured public website URL.
- Disable/hide or implement Auto-review.
- Add Hold mutation/UX if backend supports hold status.
- Add decline reason modal.
- Add approve confirmation/success navigation.
- Wire insight template buttons or render as static text.

---

## 5.6 Booking Review `/bookings/review/:id`

### Files

```text
web/packages/pyxis-app/src/pages/BookingReviewPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Bookings/BookingReview*.tsx
```

### Observed controls

```text
Open link
Save booking details
Save review note
Decline
Approve
```

### Findings

**BREV-001: Open link appears clickable but has no behavior.**

The dynamic smoke clicked it and stayed on the same page with no status. It should open the submission/artist link if present.

**BREV-002: Save booking details is wired.**

Clicking produced no error in smoke. Need richer success feedback check.

**BREV-003: Save review note is wired.**

Same: mutation exists, but success feedback should be clearer.

**BREV-004: Date panel appears static.**

The review page includes `BookingReviewDatePanel`, but it does not appear to support real date selection/availability confirmation yet.

**BREV-005: Approve/Decline need confirmation/reason.**

Same as Bookings page.

### Required tasks

- Wire Open link to `booking.links`.
- Add date selection/availability UX.
- Add decline reason flow.
- Add approve confirmation and post-approve navigation.

---

## 5.7 Artists `/artists`

### Files

```text
web/packages/pyxis-app/src/pages/ArtistsPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Roster/ArtistRoster/*
```

### Observed controls

```text
New artist
Artist row buttons
Clear
Create artist
Save artist after selecting an artist
```

### Findings

**ART-001: Create/update is wired.**

The page uses:

```text
useCreateArtistMutation
useUpdateArtistMutation
```

**ART-002: Artist card text appears duplicated in accessible button text.**

Smoke captured row button text such as:

```text
ACActressElectronic · https://actress.examplehttps://actress.example
```

This may be a DOM/accessibility issue where links/text are duplicated inside a button. It needs inspection for screen-reader quality and visual layout.

**ART-003: No duplicate detection.**

Creating an artist with an existing name should be guarded by backend validation and friendly frontend error display.

**ART-004: No delete/merge flow.**

May be out of scope for v1, but should be explicit.

### Required tasks

- Audit ArtistCard/ArtistRoster accessibility text.
- Add duplicate-name validation/errors.
- Decide delete/merge requirements.
- Add Storybook interaction tests for create/update states.

---

## 5.8 Attendance `/attendance`

### Files

```text
web/packages/pyxis-app/src/pages/AttendancePage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/AttendancePanel.tsx
```

### Observed controls

```text
Save attendance
Draw inputs
Incident inputs
Notes
Incident notes
```

### Findings

**ATT-001: Save attendance is wired.**

The page calls:

```text
useUpdateAttendanceMutation
```

**ATT-002: Global topbar default actions appear on this page.**

Search, Notifications, New show are visible via the default `AppTopBar` action. If these are not globally wired, they should not appear.

**ATT-003: Per-row saving state is coarse.**

The page passes one `isUpdating` value to the panel. If multiple attendance rows exist, saving one row may mark all rows as saving.

**ATT-004: Numeric validation needs inspection.**

Draw values should prevent negative numbers and impossible capacity relationships.

### Required tasks

- Add per-row saving state.
- Validate draw/incident fields.
- Remove or wire default topbar actions.

---

## 5.9 Audit Log `/log`

### Files

```text
web/packages/pyxis-app/src/pages/AuditLogPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/AuditLogPanel/*
```

### Observed controls

```text
Search
Notifications
New show
```

### Findings

**LOG-001: Audit log is read-only and backend-backed.**

It calls:

```text
useGetAuditLogQuery
```

**LOG-002: Default topbar actions appear but are not log-specific.**

The audit log should probably have filter/search controls specific to audit entries, not generic topbar defaults.

**LOG-003: Pagination/filtering missing.**

Audit logs grow indefinitely. This page needs date/action/actor filters and pagination or infinite scroll.

### Required tasks

- Add audit log filters.
- Add pagination or limit controls.
- Replace default topbar actions with log-specific controls.

---

## 5.10 Discord `/discord`

### Files

```text
web/packages/pyxis-app/src/pages/DiscordPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/DiscordMappingPanel.tsx
web/packages/pyxis-app/src/api/mockData.ts
```

### Findings

**DISC-001: Page uses mock data.**

`DiscordPage` imports:

```ts
import { discordMappings as seedMappings } from '../../api/mockData';
```

This is not production-backed.

**DISC-002: No observed backend route for `/api/app/discord`.**

There is an endpoint constant:

```text
/ api/app/discord
```

but the server route table does not appear to expose it. This is a source-of-truth mismatch.

**DISC-003: Missing bot status and test-post UX.**

The page should show:

- bot connected/disconnected;
- guild ID;
- channel IDs;
- whether bot can post;
- role mapping status;
- test post action;
- last error from Discord if available.

### Required tasks

- Add backend Discord settings/status endpoint or remove endpoint constant.
- Replace mock data with backend data.
- Add edit/test actions.
- Add error/permission states.

---

## 5.11 Settings `/settings`

### Files

```text
web/packages/pyxis-app/src/pages/SettingsPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Settings/SettingsPanel/SettingsPanel.tsx
```

### Findings

**SET-001: Core settings save is wired.**

The page calls:

```text
useGetSettingsQuery
useUpdateSettingsMutation
```

**SET-002: Settings scope is too narrow for current product needs.**

Given the production/auth work, settings should likely include:

- website URL;
- Discord guild/channel settings;
- role mapping status;
- booking email/notification destination;
- public form toggles;
- cache/SEO/public-site settings if relevant.

**SET-003: Role-gated edit UX needs confirmation.**

Backend restricts settings update to admin. The UI should reflect permission if a booker/door user lands here.

### Required tasks

- Add settings sections beyond core space info.
- Add role-aware disabled/read-only state.
- Add per-section saving state.

---

## 5.12 Setup `/setup`

### Files

```text
web/packages/pyxis-app/src/pages/SetupPage/Page.tsx
```

### Findings

**SETUP-001: Setup is mostly static.**

Observed buttons:

```text
Back
Skip for now
Continue
```

Clicks did not change route or state.

**SETUP-002: Inputs are hardcoded/read-only.**

The page displays hardcoded Discord channel IDs and explanatory copy.

**SETUP-003: Product status unclear.**

This route is session-gated and present in the app, but it behaves like a static prototype. Decide whether setup is production route, future wizard, or Storybook-only material.

### Required tasks

- Decide setup route product status.
- If production: implement wizard state/backend settings writes.
- If not production: hide/remove route from production app.

---

## 5.13 Modal Showcase `/modal`

### Findings

The smoke saw Shows-like controls on `/modal`, suggesting this route may render a showcase that resembles Shows or currently reuses modal examples. It should be treated as a development-only route unless intentionally exposed.

Required decision:

```text
Should /modal exist in production staff app?
```

If no, remove from production routes or gate behind dev-only feature flag.

---

## 6. Cross-cutting hazards

### 6.1 Default `AppTopBar` action hazard

File:

```text
web/packages/pyxis-app/src/components/shell/AppTopBar/AppTopBar.tsx
```

Default actions are:

```tsx
<IconButton icon="search" label="Search" />
<IconButton icon="bell" label="Notifications" />
<Button iconLeft="plus">New show</Button>
```

Any page that does not provide a custom `action` gets these controls. Several pages show them even though they are not wired.

Recommendation:

```text
Make default action null, or make AppShell receive a global command dispatcher.
```

Safer v1:

```tsx
action ?? null
```

Then each page must explicitly opt into controls.

### 6.2 One-click destructive operations

High-risk operations:

- Cancel show;
- Archive show;
- Delete flyer;
- Decline booking;
- Approve booking if it creates a show or changes public state.

Recommendation: create shared `ConfirmDialog` or `DangerActionDialog`.

### 6.3 Inert controls should not look clickable

Inert controls found:

- Shows filter/search;
- Dashboard callback buttons;
- Booking Open form;
- Booking Auto-review;
- Booking insight template buttons;
- Setup Back/Skip/Continue;
- Show Detail Duplicate;
- Booking Review Open link.

Every visible clickable element needs one of:

```text
real behavior
explicit disabled state
"coming soon" affordance
hidden until implemented
```

### 6.4 Hardcoded mutation inputs

Calendar currently performs real writes with fixed dates:

```text
2026-06-01 hold
2026-06-02 blocked
```

This is acceptable as a development spike but unsafe as production UX.

### 6.5 Mock data in production route

Discord page uses `mockData.ts`. Production routes should not show mock data unless clearly labelled as fixture/demo.

---

## 7. Backend functionality gaps

### Definite backend/API gaps

1. Discord settings/status endpoint.
2. Optional duplicate-show endpoint, unless implemented frontend-side with create-show mutation.
3. Booking hold endpoint/status transition, if hold is meant to be real.
4. Auto-review backend workflow, if Auto-review remains visible.
5. Setup wizard persistence endpoint, if setup remains production.
6. Audit log pagination/filter endpoint if current endpoint returns unbounded log.

### Existing backend support that needs UX polish

1. Show create/update/cancel/archive/announce.
2. Flyer upload/delete.
3. Booking update/review/approve/decline.
4. Artist create/update.
5. Calendar hold/block create/delete.
6. Attendance update.
7. Settings update.
8. Audit log read.

---

## 8. Recommended implementation sequence

Do this in phases. Do not try to fix every button in one commit.

### Phase 1: Remove/inert-control hazards

- Make `AppTopBar` default actions explicit or null.
- Disable/hide Auto-review until backend exists.
- Disable/hide Setup route controls or implement navigation.
- Disable/hide Duplicate until implemented.

### Phase 2: Wire navigation-only actions

- Dashboard View all → `/shows`.
- Dashboard Review bookings → `/bookings`.
- Dashboard Open audit log → `/log`.
- Shows row edit → `/shows/:id`.
- Booking Open form → public `/book` URL.
- Booking Review Open link → artist links.

### Phase 3: Add confirmation UX

- Show archive/cancel.
- Flyer delete.
- Booking decline/approve.

### Phase 4: Replace hardcoded Calendar actions

- Add hold modal.
- Add block date modal.
- Wire selected date into forms.

### Phase 5: Backend gaps

- Discord settings/status endpoint.
- Booking hold transition if desired.
- Auto-review decision.
- Setup wizard decision.

### Phase 6: Storybook and visual validation

- Add missing states to Storybook.
- Add css-visual-diff targets for dynamic/admin pages.
- Use `http://localhost:6008/` to inspect states before live Vite wiring.

---

## 9. Intern checklist for every issue

For each task, add a diary entry with:

```text
Issue ID:
Page:
Files inspected:
Expected behavior:
Current behavior:
Backend route/hook:
Storybook story:
Implementation plan:
Validation commands:
Manual smoke result:
Screenshots/artifacts if visual:
Commit:
```

Validation commands:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
go test ./... -count=1
```

If a backend route changes, also run relevant Go package tests and update protobuf/types if needed.
