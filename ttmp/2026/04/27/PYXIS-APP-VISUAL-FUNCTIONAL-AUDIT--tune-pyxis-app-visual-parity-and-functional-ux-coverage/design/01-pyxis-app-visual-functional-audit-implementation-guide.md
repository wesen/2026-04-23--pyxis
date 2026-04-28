---
Title: pyxis-app Visual Tuning and Functional UX Audit Implementation Guide
Ticket: PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT
Status: active
Topics:
  - frontend
  - staff-app
  - storybook
  - react
DocType: design
Intent: implementation-guide
Summary: Detailed intern-friendly guide for tuning pyxis-app visual parity and auditing action/backend/UX completeness using css-visual-diff, Storybook, the standalone prototype, RTK Query, and Go backend route references.
LastUpdated: 2026-04-27T23:45:00-04:00
WhatFor: Use as the starting guide for staff-app visual tuning and functional UX completion work.
WhenToUse: Read before running css-visual-diff or changing pyxis-app pages, shell components, actions, or backend-backed workflows.
---

# pyxis-app Visual Tuning and Functional UX Audit Implementation Guide

## 1. What this document is

This document is a map for a new intern who needs to work on `pyxis-app`, the staff-facing Pyxis operations application. It explains the pieces of the system, the visual-diff tooling, the API wiring, the page/component structure, and the current known functional gaps.

The immediate goal is not to change code blindly. The goal is to build a repeatable loop:

1. choose one staff page or subcomponent;
2. compare it to the prototype with `css-visual-diff`;
3. tune the smallest useful component first;
4. record which buttons and flows are wired or missing;
5. record which UX states/designs are missing;
6. validate and commit small milestones.

The public site work proved that this loop works. For `pyxis-app`, the same method applies, but the staff app has more backend-backed actions and more role-sensitive workflows, so the audit must track both visual parity and functional completeness.

---

## 2. High-level system map

At a high level, Pyxis has three visual/rendering worlds for the staff app:

```text
                         ┌────────────────────────────┐
                         │ Standalone React prototype │
                         │ prototype-design/...       │
                         │ served on localhost:7070   │
                         └──────────────┬─────────────┘
                                        │ visual reference
                                        ▼
┌────────────────────────┐      css-visual-diff       ┌────────────────────────┐
│ Storybook stories      │ ◀────────────────────────▶ │ screenshots/artifacts  │
│ pyxis-app on :6008     │                            │ /tmp/.../diff_only.png │
└─────────────┬──────────┘                            └────────────────────────┘
              │ component/page fixtures
              ▼
┌────────────────────────┐      RTK Query             ┌────────────────────────┐
│ pyxis-app React SPA    │ ─────────────────────────▶ │ Go backend API         │
│ Vite on :3008          │                            │ localhost:8080         │
└────────────────────────┘                            └────────────────────────┘
```

The visual target is usually the standalone prototype on port `7070`. The React target is usually a Storybook iframe on port `6008`. The live staff app on port `3008` is useful for interaction testing, auth/session behavior, and backend-backed flows.

### Important ports

| Service | Port | Purpose |
|---|---:|---|
| Prototype static server | `7070` | Standalone reference screens under `prototype-design/standalone/full-app` |
| pyxis-app Storybook | `6008` | React component/page fixtures for visual comparison |
| Staff Vite app | `3008` | Live staff app with React Router and backend proxy |
| Go backend | `8080` | API, auth, sessions, storage, staff endpoints |
| Public Vite app | `3007` | Not primary for this ticket; used in previous public-site work |

---

## 3. Source-code map

### 3.1 Staff app entry points

| File | Role |
|---|---|
| `web/packages/pyxis-app/src/main.tsx` | Browser entry point. Mounts app/store/router in Vite. |
| `web/packages/pyxis-app/src/App.tsx` | React Router route table and session gate. |
| `web/packages/pyxis-app/src/store.ts` | Redux store setup. |
| `web/packages/pyxis-app/src/api/appApi.ts` | RTK Query API layer for staff endpoints. |
| `web/packages/pyxis-app/src/api/endpoints.ts` | Frontend endpoint constants. |
| `web/packages/pyxis-app/src/pages/Pages.tsx` | Page export barrel. |
| `web/packages/pyxis-app/src/styles/app-tokens.css` | App-specific design tokens. |
| `web/packages/pyxis-app/src/styles/global.css` | App-wide CSS reset/global rules. |

### 3.2 Route table

`web/packages/pyxis-app/src/App.tsx` currently declares these routes:

| Route | Component | Auth gate | Notes |
|---|---|---|---|
| `/login` | `LoginPage` | public-only | Redirects authenticated users to `/`. |
| `/setup` | `SetupPage` | required | Mostly static setup UX today. |
| `/` | `DashboardPage` | required | Main operations dashboard. |
| `/shows` | `ShowsPage` | required | List/create shows. |
| `/shows/:id` | `ShowDetailPage` | required | Edit, archive, announce, cancel, flyer actions. |
| `/calendar` | `CalendarPage` | required | Calendar events, holds, blocked dates. |
| `/bookings` | `BookingsPage` | required | Booking inbox and processed queue. |
| `/bookings/review/:id` | `BookingReviewPage` | required | Detailed booking review. |
| `/artists` | `ArtistsPage` | required | Artist roster/editor. |
| `/attendance` | `AttendancePage` | required | Post-show logs. |
| `/log` | `AuditLogPage` | required | Audit trail. |
| `/discord` | `DiscordPage` | required | Discord channel mapping display. |
| `/settings` | `SettingsPage` | required | Core settings editor. |
| `/modal` | `ModalShowcasePage` | required | Modal showcase/development route. |

The `RequireSession` component in `App.tsx` checks `useGetSessionQuery()`. If the backend says the user is unauthenticated, it redirects to `/login?return_to=<current-path>`.

### 3.3 Component layers

The staff app uses a layered component model:

```text
pages/*/Page.tsx
  └── components/organisms/*
        └── components/molecules/*
              └── pyxis-components atoms/core components
```

Important app component folders:

| Folder | Role |
|---|---|
| `components/shell/` | App shell: sidebar, topbar, mobile bottom nav, user footer. |
| `components/organisms/Dashboard/` | Dashboard panels and sections. |
| `components/organisms/Shows/` | Shows tables/panels. |
| `components/organisms/Bookings/` | Booking queues and review panels. |
| `components/organisms/Calendar/` | Calendar month and agenda panels. |
| `components/organisms/Roster/` | Artists and attendance panels. |
| `components/organisms/Settings/` | Settings editor panels. |
| `components/organisms/NewShowModal/` | Shared show create/edit modal. |
| `components/molecules/` | Smaller reusable app pieces. |

The public-site lesson applies here too: tune the component that owns the mismatch. If a page diff shows only a button height problem, compare/tune the button container or the organism panel, not the whole page.

---

## 4. Visual-diff system

### 4.1 Relevant specs

Two existing app specs matter:

```text
prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml
prototype-design/visual-diff/userland/specs/app.components.visual.yml
```

The page spec currently covers only six desktop pages:

| Spec target | Prototype | Storybook story | Sections |
|---|---|---|---|
| `dashboard` | `/standalone/full-app/dashboard.html` | `pyxis-app-pages-pages--dashboard-desktop` | page, sidebar, topbar, summary, hero, metrics, upcoming, quick-actions, activity, attention |
| `login` | `/standalone/full-app/login.html` | `pyxis-app-pages-pages--login-desktop` | page, marquee, panel |
| `setup` | `/standalone/full-app/setup.html` | `pyxis-app-pages-pages--setup-desktop` | page, header, progress, channels |
| `shows` | `/standalone/full-app/shows.html` | `pyxis-app-pages-pages--shows-desktop` | page, filters, confirmed, archived |
| `calendar` | `/standalone/full-app/calendar.html` | `pyxis-app-pages-pages--calendar-desktop` | page, month, agenda |
| `bookings` | `/standalone/full-app/bookings.html` | `pyxis-app-pages-pages--bookings-desktop` | page, queue, processed |

The component spec covers 15 component/organism/shell targets, including:

- `metric-card`
- `activity-feed-item`
- `today-show-card`
- `shows-confirmed-panel`
- `shows-archived-panel`
- `bookings-queue-panel`
- `bookings-processed-panel`
- `calendar-month-panel`
- `calendar-agenda-panel`
- `new-show-modal`
- `app-topbar-dashboard`
- `app-sidebar`
- `app-mobile-bottom-nav`

### 4.2 Coverage gap

The React app has more routes than the visual page spec covers. These pages need either page-level visual targets or deliberate justification for component-only coverage:

- Show Detail: `/shows/:id`
- Booking Review: `/bookings/review/:id`
- Artists: `/artists`
- Attendance: `/attendance`
- Audit Log: `/log`
- Discord: `/discord`
- Settings: `/settings`
- Modal Showcase: `/modal`

A good first implementation phase is to add targets for these pages or add smaller component targets for their main sections.

### 4.3 The correct css-visual-diff loop

Do not run a giant sweep first. Use this loop:

```text
choose target
  ↓
inspect selectors
  ↓
compare one section
  ↓
read diff_only.png
  ↓
read right_region.png
  ↓
read left_region.png
  ↓
make one change
  ↓
repeat same comparison
  ↓
record artifact paths in diary
```

For app work, always pass the explicit app spec. The default visual-diff registry is public-page oriented.

Example for one page section:

```bash
SPEC=pages PAGE=dashboard SECTION=topbar OUT=/tmp/pyxis-app-dashboard-topbar \
  ttmp/2026/04/27/PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT--tune-pyxis-app-visual-parity-and-functional-ux-coverage/scripts/02-compare-app-target.sh
```

Example for one component target:

```bash
SPEC=components PAGE=app-sidebar OUT=/tmp/pyxis-app-sidebar \
  ttmp/2026/04/27/PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT--tune-pyxis-app-visual-parity-and-functional-ux-coverage/scripts/02-compare-app-target.sh
```

Artifact inspection order:

```text
$outDir/<page>/artifacts/<section>/diff_only.png
$outDir/<page>/artifacts/<section>/right_region.png
$outDir/<page>/artifacts/<section>/left_region.png
$outDir/<page>/artifacts/<section>/compare.json
```

### 4.4 How to decide page vs component tuning

Use this decision tree:

```text
Is the whole page structurally different?
  ├─ yes → compare page, shell/sidebar/topbar, then largest section.
  └─ no  → compare the failing section.

Does the section mismatch come from repeated cards/rows?
  ├─ yes → add/use component spec for card/row first.
  └─ no  → tune section layout.

Does the component match in isolation but not in page?
  ├─ yes → page shell/wrapper spacing or story data is wrong.
  └─ no  → component CSS/props/tokens are wrong.
```

In pseudocode:

```text
for page in app_pages:
    compare(page, section="page")
    if broad_diff_is_noisy:
        for section in page.sections:
            compare(page, section)
            if section_contains_repeated_component:
                compare(component_for(section))
                tune(component)
            tune(section_wrapper_if_needed)
    record_visual_status(page)
```

---

## 5. Backend/API map

### 5.1 Frontend endpoint constants

`web/packages/pyxis-app/src/api/endpoints.ts` defines:

```text
GET    /api/app/session
POST   /auth/logout
GET    /api/app/shows
GET    /api/app/shows/:id
POST   /api/app/shows
PATCH  /api/app/shows/:id
PATCH  /api/app/shows/:id/cancel
PATCH  /api/app/shows/:id/archive
POST   /api/app/shows/:id/announce
POST   /api/app/shows/:id/flyer
DELETE /api/app/shows/:id/flyer
GET    /api/app/bookings
PATCH  /api/app/bookings/:id
PATCH  /api/app/bookings/:id/approve
PATCH  /api/app/bookings/:id/decline
GET    /api/app/bookings/:id/review
PATCH  /api/app/bookings/:id/review
GET    /api/app/artists
POST   /api/app/artists
GET    /api/app/artists/:id
PATCH  /api/app/artists/:id
GET    /api/app/calendar
POST   /api/app/calendar/holds
DELETE /api/app/calendar/holds/:id
POST   /api/app/calendar/blocked
DELETE /api/app/calendar/blocked/:id
GET    /api/app/attendance
PATCH  /api/app/attendance/:showId
GET    /api/app/audit-log
GET    /api/app/settings
PATCH  /api/app/settings
```

### 5.2 Backend route table

`pkg/server/server.go` wires the backend routes. Most staff-app operations already have backend routes. Role gates matter:

| Domain | Typical roles |
|---|---|
| Shows create/update/cancel/archive/announce | `admin`, `booker` |
| Shows read | `admin`, `booker`, `door` |
| Bookings | `admin`, `booker` |
| Artists write | `admin`, `booker` |
| Artists read | `admin`, `booker`, `door` |
| Calendar write | `admin`, `booker` |
| Calendar read | `admin`, `booker`, `door` |
| Attendance read/write | `admin`, `booker`, `door` |
| Settings write | `admin` |
| Audit log | `admin` |

### 5.3 RTK Query layer

`web/packages/pyxis-app/src/api/appApi.ts` maps backend endpoints into hooks, e.g.:

```ts
useGetShowsQuery()
useCreateShowMutation()
useUpdateShowMutation()
useCancelShowMutation()
useArchiveShowMutation()
useAnnounceShowMutation()
useGetBookingsQuery()
useApproveBookingMutation()
useDeclineBookingMutation()
useGetArtistsQuery()
useCreateArtistMutation()
useUpdateArtistMutation()
useGetCalendarQuery()
useCreateCalendarHoldMutation()
useCreateCalendarBlockedMutation()
useGetAttendanceQuery()
useUpdateAttendanceMutation()
useGetSettingsQuery()
useUpdateSettingsMutation()
```

When auditing a button, ask:

1. Does the component expose a callback prop?
2. Does the page pass a callback?
3. Does the callback call an RTK mutation/query?
4. Does the backend route exist?
5. Does the UI show loading, success, error, and disabled states?
6. Does the operation need confirmation or a modal before mutation?

---

## 6. Initial functional action audit

This is a starting point, not a final truth table. Verify each item in the browser and update the diary as work proceeds.

### 6.1 Login

File:

```text
web/packages/pyxis-app/src/pages/LoginPage/Page.tsx
```

| Action | Status | Notes |
|---|---|---|
| Continue with Discord | wired | Navigates to `/auth/discord/login?return_to=...`. Requires Discord redirect config for real callback. |
| Email field / Magic link | intentionally disabled | UI still displays magic-link affordance but disabled. Decide whether to hide or keep as future design. |
| Email me a link | disabled | Missing backend by design; either remove or document as future auth option. |

### 6.2 Dashboard

File:

```text
web/packages/pyxis-app/src/pages/DashboardPage/Page.tsx
```

Dashboard currently fetches shows, bookings, and audit log. The `DashboardOverview` subcomponents expose actions such as:

- view all shows;
- view Discord post;
- edit show;
- add show;
- review bookings;
- open audit log.

The page currently renders `DashboardOverview` without passing navigation/action callbacks. Audit these first because dashboard buttons are highly visible. Expected next behavior:

```text
View all        → navigate('/shows')
Add a show      → open NewShowModal or navigate('/shows?new=1')
Review bookings → navigate('/bookings')
Open audit log  → navigate('/log')
Edit show       → navigate('/shows/:id') or open editor
View Discord    → open Discord post URL if available; otherwise disabled/explained
```

### 6.3 Shows

File:

```text
web/packages/pyxis-app/src/pages/ShowsPage/Page.tsx
```

| Action | Status | Notes |
|---|---|---|
| New show | wired | Opens `NewShowModal`, creates show, uploads flyer, navigates to show detail. |
| Filter button | not wired | Icon-only button has no callback/state. Needs filter UI or removal. |
| Search button | not wired | Icon-only button has no callback/state. Needs search field/modal/sidebar. |
| Confirmed/archived row interactions | needs verification | Check whether rows navigate to detail and whether archived behavior is intentional. |

UX gaps:

- Search/filter open state and design.
- Empty states for filtered views.
- Error detail from backend instead of generic catch.
- Modal form field validation summaries.

### 6.4 Show Detail

File:

```text
web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
```

| Action | Status | Notes |
|---|---|---|
| Edit | wired | Opens `NewShowModal` in edit mode. |
| Upload flyer | wired | Calls upload endpoint. |
| Delete flyer | wired | Calls delete endpoint. |
| Archive | wired | Calls backend mutation, but lacks confirmation UX. |
| Announce | wired | Calls backend mutation, but needs Discord post state/open-post UX. |
| Cancel show | wired | Calls backend mutation, but lacks destructive confirmation UX. |
| Duplicate | not wired | Visible button has no handler/backend flow. Needs clone-show UX/API decision. |
| Open Discord post | likely incomplete | `ShowDetailDiscordPanel` has callback prop but page renders without data/callback. |

Missing UX designs:

- confirm archive dialog;
- confirm cancel dialog;
- duplicate-show modal/flow;
- Discord post status panel with actual channel/message link;
- post-mutation refresh/optimistic state handling.

### 6.5 Calendar

File:

```text
web/packages/pyxis-app/src/pages/CalendarPage/Page.tsx
```

| Action | Status | Notes |
|---|---|---|
| Add hold | partially wired | Calls backend with hardcoded `2026-06-01`. Needs modal/form/date picker. |
| Block date | partially wired | Calls backend with hardcoded `2026-06-02`. Needs modal/form/date picker. |
| Calendar agenda Open show | likely needs page-level callback verification | Component supports `onOpenShow`; page-level `CalendarBoard` wiring must be checked. |
| Add to today | likely stub | Component supports callback, but needs product meaning. |
| Delete hold/blocked date | backend exists | Need visible UI affordance if not present. |

Missing UX designs:

- Add Hold modal;
- Block Date modal;
- delete/confirm hold;
- month navigation;
- selected day detail drawer.

### 6.6 Bookings

File:

```text
web/packages/pyxis-app/src/pages/BookingsPage/Page.tsx
```

| Action | Status | Notes |
|---|---|---|
| Approve | wired | Calls backend. Needs success/error display and maybe confirm. |
| Decline | wired | Calls backend. Needs confirmation/reason UX. |
| Hold | probably not wired | `BookingCard` exposes `onHold`, but page passes only approve/decline. Backend status supports hold? Verify. |
| Open form | not wired | Topbar button has no callback. Should open public booking URL. |
| Auto-review | not wired | No backend/AI support yet. Decide remove, disable, or implement. |
| Review detail | needs verification | Check whether booking cards navigate to `/bookings/review/:id`. |

Missing UX designs:

- decline reason modal;
- hold/submission status UX;
- open public form link behavior;
- auto-review disabled/future state;
- bulk operations? maybe future only.

### 6.7 Booking Review

File:

```text
web/packages/pyxis-app/src/pages/BookingReviewPage/Page.tsx
```

| Action | Status | Notes |
|---|---|---|
| Save booking details | wired | Calls update booking mutation. |
| Save review note | wired | Calls review mutation. |
| Approve | wired | Calls backend. |
| Decline | wired | Calls backend. |
| Open link | disabled/no behavior | Needs to open artist links from submission, or hide if no link exists. |
| Date panel | probably static | `BookingReviewDatePanel` needs inspection for actual date selection. |

Missing UX designs:

- booking approve confirmation;
- decline reason;
- hold/follow-up state;
- date selection and availability check;
- one-click create draft/confirmed show from booking with editable modal.

### 6.8 Artists

File:

```text
web/packages/pyxis-app/src/pages/ArtistsPage/Page.tsx
```

| Action | Status | Notes |
|---|---|---|
| New artist | wired locally | Clears draft. |
| Select artist | wired locally | Loads selected data into editor. |
| Create artist | wired | Calls backend. |
| Save artist | wired | Calls backend. |
| Delete/merge artist | missing | Maybe not v1. |

Missing UX designs:

- validation details;
- duplicate artist detection;
- delete/merge flow;
- external link opening;
- loading state on selected row if saving.

### 6.9 Attendance

File:

```text
web/packages/pyxis-app/src/pages/AttendancePage/Page.tsx
```

| Action | Status | Notes |
|---|---|---|
| Save attendance | wired | Calls attendance PATCH endpoint. |
| Incident flag/notes | likely wired through draft | Verify accessible controls and saved state. |

Missing UX designs:

- per-row saving state instead of whole-panel state;
- incident severity/category if needed;
- post-save success placement;
- validation for draw values.

### 6.10 Audit Log

File:

```text
web/packages/pyxis-app/src/pages/AuditLogPage/Page.tsx
```

Read-only page. Visual and UX audit should focus on:

- empty state;
- pagination/infinite scroll if logs grow;
- filter/search by actor/action/date;
- admin-only role behavior.

### 6.11 Discord

File:

```text
web/packages/pyxis-app/src/pages/DiscordPage/Page.tsx
```

Current issue: page uses `discordMappings as seedMappings` from mock data. There is an endpoint constant `discord: '/api/app/discord'`, but no obvious RTK query in `appApi.ts` for it and no backend route in `server.go` in the current route table. This page should be classified as **fixture-only/static** until wired.

Needed work:

- define backend route or remove endpoint constant;
- define settings schema for Discord channel mapping;
- render live config from backend;
- add edit/test-post actions;
- show bot connection status.

### 6.12 Settings

File:

```text
web/packages/pyxis-app/src/pages/SettingsPage/Page.tsx
```

Core settings save is wired. Missing designs likely include:

- Discord settings section;
- public website URL section;
- auth/role mapping section;
- dangerous settings confirmation;
- per-section save state instead of whole page.

### 6.13 Setup

File:

```text
web/packages/pyxis-app/src/pages/SetupPage/Page.tsx
```

Setup is mostly static:

- Back button has no handler.
- Skip for now has no handler.
- Continue has no handler.
- Inputs are read-only hardcoded Discord channel IDs.

This page needs a product decision: keep it as prototype/showcase only, or wire it to real first-run setup state.

---

## 7. Visual tuning strategy by page

### 7.1 Phase A: shell baseline

Start with shell because every app page uses it.

Targets:

```text
SPEC=components PAGE=app-sidebar
SPEC=components PAGE=app-topbar-dashboard
SPEC=components PAGE=app-mobile-bottom-nav
```

Files:

```text
web/packages/pyxis-app/src/components/shell/*
web/packages/pyxis-app/src/styles/app-tokens.css
web/packages/pyxis-components/src/tokens/tokens.css
```

Do not tune per-page spacing until sidebar/topbar are stable.

### 7.2 Phase B: dashboard

Targets:

```text
SPEC=pages PAGE=dashboard SECTION=hero
SPEC=pages PAGE=dashboard SECTION=metrics
SPEC=pages PAGE=dashboard SECTION=upcoming
SPEC=pages PAGE=dashboard SECTION=quick-actions
SPEC=pages PAGE=dashboard SECTION=activity
SPEC=pages PAGE=dashboard SECTION=attention
```

Component targets:

```text
SPEC=components PAGE=metric-card
SPEC=components PAGE=activity-feed-item
SPEC=components PAGE=today-show-card
```

Functional audit focus: dashboard callbacks.

### 7.3 Phase C: shows and show detail

Existing page target:

```text
SPEC=pages PAGE=shows SECTION=filters
SPEC=pages PAGE=shows SECTION=confirmed
SPEC=pages PAGE=shows SECTION=archived
```

Existing component targets:

```text
SPEC=components PAGE=shows-confirmed-panel
SPEC=components PAGE=shows-archived-panel
SPEC=components PAGE=new-show-modal
```

Add missing targets:

- show detail page;
- show detail hero/info/Discord/flyer sections;
- NewShowModal states: create, edit, validation errors, uploading flyer, long lineup.

Functional audit focus: filter/search, duplicate, destructive confirmations, Discord post links.

### 7.4 Phase D: bookings

Existing page target:

```text
SPEC=pages PAGE=bookings SECTION=queue
SPEC=pages PAGE=bookings SECTION=processed
```

Existing component targets:

```text
SPEC=components PAGE=bookings-queue-panel
SPEC=components PAGE=bookings-processed-panel
```

Add missing targets:

- booking review page;
- booking review request panel;
- booking date panel;
- booking note panel;
- decline/approve confirmation designs.

Functional audit focus: hold, open form, auto-review, open link, date selection.

### 7.5 Phase E: calendar

Targets:

```text
SPEC=pages PAGE=calendar SECTION=month
SPEC=pages PAGE=calendar SECTION=agenda
SPEC=components PAGE=calendar-month-panel
SPEC=components PAGE=calendar-agenda-panel
```

Functional audit focus: replace hardcoded hold/block actions with real modal forms.

### 7.6 Phase F: roster/admin pages

Add page/component targets for:

- Artists;
- Attendance;
- Audit log;
- Discord;
- Settings;
- Setup.

These are less covered by existing visual specs but important for production completeness.

---

## 8. Missing UX design inventory

The following designs should be added to the product backlog or built during this ticket, depending on priority:

### Destructive confirmations

Needed for:

- Cancel show;
- Archive show;
- Decline booking;
- Delete flyer;
- Delete calendar hold/blocked day if UI is added.

Pseudocode:

```tsx
<ConfirmDialog
  title="Cancel show?"
  body="This removes the show from the public site and records an audit log entry."
  confirmLabel="Cancel show"
  variant="danger"
  onConfirm={() => cancelShow(id)}
/>
```

### Search/filter surfaces

Needed for:

- Shows filter/search buttons;
- Audit log filters;
- Artist roster search;
- Booking queue filters.

### Modal/form surfaces

Needed for:

- Calendar Add Hold;
- Calendar Block Date;
- Duplicate Show;
- Booking Decline/Hold;
- Discord channel mapping edit;
- Setup wizard steps.

### Backend-backed status surfaces

Needed for:

- Discord bot connection health;
- Discord post status per show;
- Announcement success with channel/message link;
- Upload progress/errors;
- Role-gated disabled actions.

### Empty/loading/error refinements

Every page should have:

```text
loading state
empty state
error state
saving state
success state
permission denied state
```

At the moment, many pages have loading/error/empty basics, but saving/success/error placement is inconsistent.

---

## 9. Implementation tasks for the intern

### Task 1: validate server and visual baseline

Start servers:

```bash
make dev
python3 -m http.server 7070 --directory prototype-design
cd web && pnpm --filter pyxis-app storybook
```

Run validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

### Task 2: run shell comparisons

```bash
SPEC=components PAGE=app-sidebar OUT=/tmp/pyxis-app-sidebar scripts/02-compare-app-target.sh
SPEC=components PAGE=app-topbar-dashboard OUT=/tmp/pyxis-app-topbar scripts/02-compare-app-target.sh
```

Record changed percent and artifact paths in `reference/01-investigation-diary.md`.

### Task 3: build a page coverage matrix

For each route, create a table row:

```text
route | page component | visual spec? | story? | backend data? | primary actions | missing UX
```

Use `sources/01-app-surface-inventory.json` as the starting point.

### Task 4: pick one page and tune recursively

Example with Shows:

```text
Shows page
  → filters section
  → confirmed panel
  → archived panel
  → NewShowModal
  → row/card molecules if needed
```

Do not change multiple visual layers at once.

### Task 5: audit functionality as you tune

For every visible button:

```text
button label
file/line
expected behavior
current behavior
backend endpoint if any
missing UX state
priority
```

### Task 6: validate and commit

Run:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
go test ./... -count=1
```

Commit small milestones.

---

## 10. Review checklist

Before marking a page complete, answer:

- Does the page have a visual target in a YAML spec?
- Are its main sections selectable by stable `data-section` attributes?
- Are noisy dynamic parts isolated from stable subcomponent comparisons?
- Have `diff_only.png`, `right_region.png`, and `left_region.png` been inspected?
- Are all visible buttons classified as wired/partial/stub/missing?
- Are destructive actions guarded by confirmation UX?
- Are backend errors shown in a useful way?
- Are role/permission constraints reflected in the UI?
- Do Storybook stories cover loading/empty/error/success/modal states?
- Does the diary record commands, artifacts, decisions, and validation?

---

## 11. Related references

Read these before implementation:

```text
docs/playbooks/09-pyxis-app-visual-tuning-runbook.md
docs/playbooks/10-css-visual-diff-verb-operator-guide.md
prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml
prototype-design/visual-diff/userland/specs/app.components.visual.yml
web/packages/pyxis-app/src/App.tsx
web/packages/pyxis-app/src/api/appApi.ts
web/packages/pyxis-app/src/api/endpoints.ts
pkg/server/server.go
```

Ticket-local artifacts:

```text
scripts/01-inventory-app-surfaces.py
scripts/02-compare-app-target.sh
sources/01-app-surface-inventory.json
reference/01-investigation-diary.md
```
