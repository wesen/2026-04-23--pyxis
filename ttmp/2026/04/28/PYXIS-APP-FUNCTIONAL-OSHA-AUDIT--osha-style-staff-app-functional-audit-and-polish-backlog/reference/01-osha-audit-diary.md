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

## Step 7: Phase 1–4 safety and wiring pass

I started working through the OSHA task list in order, prioritizing controls that were visible and inert or destructive-without-confirmation.

### AppTopBar default action hazard

Changed:

```text
web/packages/pyxis-app/src/components/shell/AppTopBar/AppTopBar.tsx
```

`AppTopBar` no longer injects default Search / Notifications / New show controls when a page does not explicitly provide `action`. This removes fake global controls from Attendance, Audit Log, Discord, and Settings. Pages now opt into topbar actions intentionally.

### Shared ConfirmDialog

Added component directory:

```text
web/packages/pyxis-app/src/components/organisms/ConfirmDialog/
```

Files:

```text
ConfirmDialog.tsx
ConfirmDialog.css
ConfirmDialog.stories.tsx
index.ts
```

The component supports default, danger, success, and loading states. It is exported from `components/organisms/index.ts`.

### Dashboard wiring

Changed:

```text
web/packages/pyxis-app/src/pages/DashboardPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Dashboard/DashboardOverview/DashboardOverview.tsx
```

Dashboard now passes callbacks for:

- Add show → opens `NewShowModal`;
- Review bookings → `/bookings`;
- Open audit log → `/log`;
- View all → `/shows`;
- Edit show → `/shows/:id`;
- View Discord → opens Discord URL when IDs exist, otherwise shows a status error.

### Shows wiring

Changed:

```text
web/packages/pyxis-app/src/pages/ShowsPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Shows/ShowsFilterBar/ShowsFilterBar.tsx
web/packages/pyxis-app/src/components/organisms/Shows/ShowsFilterBar/ShowsFilterBar.stories.tsx
web/packages/pyxis-app/src/components/organisms/Shows/ShowsConfirmedPanel/ShowsConfirmedPanel.tsx
web/packages/pyxis-app/src/components/organisms/Shows/ShowsArchivedPanel/ShowsArchivedPanel.tsx
web/packages/pyxis-app/src/components/organisms/Shows/ShowsTable/ShowsTable.tsx
web/packages/pyxis-app/src/components/molecules/ShowTableRow/ShowTableRow.tsx
web/packages/pyxis-app/src/pages/pages.css
```

Implemented:

- Search button toggles a real search input.
- Filter button toggles All/Confirmed as a shortcut.
- Filter chips are controlled and filter data by status.
- Search filters artist/genre/date.
- Row edit buttons navigate to `/shows/:id`.
- `ShowsFilterBar` has updated Storybook coverage including an interactive story.

### Show Detail destructive actions and duplicate

Changed:

```text
web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
```

Implemented:

- Duplicate creates a cloned show through the existing create-show mutation, clears Discord/flyer fields, appends `copy`, and navigates to the new show.
- Archive uses `ConfirmDialog`.
- Cancel uses `ConfirmDialog`.
- Delete flyer uses `ConfirmDialog`.

Note: the dynamic smoke created a real duplicated local development show (`Show duplicated.` and navigation to `/shows/19`). This is acceptable dev evidence but should be considered local test data.

### Bookings and Booking Review

Changed:

```text
web/packages/pyxis-app/src/pages/BookingsPage/Page.tsx
web/packages/pyxis-app/src/pages/BookingReviewPage/Page.tsx
```

Implemented:

- Bookings Open form opens the local public booking page on port 3007.
- Auto-review is disabled with a title explaining backend support is needed.
- Bookings approve/decline now use `ConfirmDialog`.
- Booking Hold now shows an explicit not-implemented message instead of silently doing nothing. Full hold support remains open because the update DTO does not include `status`.
- Booking Review Open link opens the booking `links` URL.
- Booking Review save details and save review note now show success messages.
- Booking Review approve/decline now use `ConfirmDialog`.

### Validation

Commands passed:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

I restarted the staff Vite server because an older devctl-owned Vite process was still serving a stale transform for `ShowTableRow`. After killing the old process and restarting the `pyxis-app-vite` tmux session, the app rendered correctly again.

Re-ran smoke scripts:

```text
sources/04-staff-app-functional-smoke-after-phase1.json
sources/05-staff-app-dynamic-route-smoke-after-phase1.json
```

Key smoke improvements:

- Attendance, Audit Log, Discord, and Settings no longer show fake Search/Notifications/New show topbar actions.
- Shows search/filter controls are now stateful.
- Shows row edit navigates to `/shows/1`.
- Bookings Auto-review is disabled instead of inert.
- Booking Review save actions show success messages.
- Show Detail Duplicate produces a new show and navigates to it.

## Step 8: Calendar hardcoded action replacement

I replaced the Calendar page's hardcoded write actions with operator-chosen modal forms.

Changed:

```text
web/packages/pyxis-app/src/pages/CalendarPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Calendar/CalendarBoard/CalendarBoard.tsx
web/packages/pyxis-app/src/pages/pages.css
```

Before:

- `Add hold` immediately wrote `2026-06-01` with label `Hold — TBD`.
- `Block date` immediately wrote `2026-06-02` with reason `Closed`.

After:

- `Add hold` opens a modal with date and label fields.
- `Block date` opens a modal with date and reason fields.
- `Add to today` now opens the Add Hold modal instead of being undefined.
- Calendar agenda `Open show` navigates to `/shows/:id` through `CalendarBoard` callbacks.

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

Re-ran top-level smoke after restarting staff Vite:

```text
sources/06-staff-app-functional-smoke-after-calendar.json
```

Smoke note: the generic smoke script clicked `Add hold`, which opened the modal. Its subsequent `Block date` click timed out because the modal overlay correctly blocked background controls. That is expected evidence that the hardcoded immediate mutation was replaced by modal interaction.

## Step 9: Replace Discord page mock data with backend settings

Changed:

```text
web/packages/pyxis-app/src/pages/DiscordPage/Page.tsx
web/packages/pyxis-app/src/pages/pages.css
```

Before, `DiscordPage` imported `discordMappings` from `api/mockData.ts`, so a live staff route showed fixture channel IDs.

After, `DiscordPage` uses:

```text
useGetSettingsQuery()
```

and derives `DiscordChannelMapping[]` from backend settings fields:

```text
discordGuildId
discordChUpcoming
discordChAnnouncements
discordChStaff
discordChBookings
discordPosting
setupComplete
```

The page now displays a backend-backed bot status panel plus backend-derived channel mapping rows. Editing/test-post actions remain open tasks because they need product decisions and/or a dedicated Discord status endpoint.

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```

## Step 10: Setup and dev-only route decisions

Changed:

```text
web/packages/pyxis-app/src/pages/SetupPage/Page.tsx
web/packages/pyxis-app/src/App.tsx
```

Setup was kept as a production-accessible helper page for now, but its buttons are no longer inert:

- Back → `/settings`
- Skip for now → `/`
- Continue → `/discord`

This does not make setup a full persisted wizard yet; that remains a future product/backend task. It does remove the OSHA finding of visible buttons that do nothing.

`/modal` is now a dev-only route:

```ts
const enableDevRoutes = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_ROUTES === '1';
```

The route is only mounted when dev routes are enabled. This prevents the modal showcase from being accidentally exposed in a production build while keeping it useful during local development and Storybook-oriented UI work.

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

## Step 11: Artists and Attendance pass with visible Chromium validation

Per operator request, I used a plain Playwright JS script with visible Chromium instead of the Playwright tool wrapper for browser validation:

```js
chromium.launch({ headless: false, slowMo: 250 })
```

Evidence was recorded in:

```text
sources/07-artists-attendance-visible-chromium.json
```

### Artists

Changed:

```text
web/packages/pyxis-app/src/pages/ArtistsPage/Page.tsx
web/packages/pyxis-app/src/pages/ArtistsPage/Page.stories.tsx
web/packages/pyxis-app/src/components/organisms/Roster/ArtistRoster/ArtistRoster.tsx
web/packages/pyxis-app/src/components/molecules/ArtistRosterRow/ArtistRosterRow.tsx
```

Implemented:

- Added roster search across name, genre, links, and notes.
- Added frontend duplicate-name validation before create/update.
- Split artist save feedback into shared `ActionMessages` success/error states.
- Improved desktop row accessibility with `role="button"`, `aria-label="Select …"`, `aria-pressed`, and keyboard Enter/Space activation.
- Improved mobile roster button labels with `aria-label="Select …"`.
- Added Storybook play coverage for duplicate-name validation and no-results search.

Visible Chromium evidence:

- Search for `burial` produced 2 rows.
- Creating `Burial Hex` as a duplicate showed: `An artist named “Burial Hex” already exists. Select that artist or choose a different name.`

### Attendance

Changed:

```text
web/packages/pyxis-app/src/pages/AttendancePage/Page.tsx
web/packages/pyxis-app/src/pages/AttendancePage/Page.stories.tsx
web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/AttendancePanel.tsx
web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/AttendancePanel.css
web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/AttendancePanel.stories.tsx
```

Implemented:

- Added attendance search across artist, date, notes, and incident notes.
- Replaced page-wide `isUpdating` with per-row `savingEntryId`.
- Added draw validation: no negative values and warning/error guard for values above 10,000.
- Added incident validation: incident notes are required when Incident is checked.
- Disabled incident notes textarea until Incident is enabled.
- Added invalid field styling and row-level validation messages.
- Added Storybook states for per-row saving and incident validation.
- Added page Storybook play coverage for incident validation and no-results search.

Visible Chromium evidence:

- Search for `zz-no-log` showed `No attendance entries match that search.`
- Checking Incident without notes showed `Incident notes are required when Incident is checked.`
- Entering `-1` draw showed `Draw cannot be negative.`

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

## Step 12: Audit Log and Settings pass with visible Chromium validation

I continued using plain Playwright JS with visible Chromium:

```js
chromium.launch({ headless: false, slowMo: 250 })
```

Evidence:

```text
sources/08-audit-log-settings-visible-chromium.json
```

### Audit Log

Changed:

```text
web/packages/pyxis-app/src/pages/AuditLogPage/Page.tsx
web/packages/pyxis-app/src/pages/pages.css
```

Implemented client-side filters over the currently loaded audit-log page:

- Actor text filter.
- Action/metadata text filter.
- Entity type dropdown generated from loaded entries.
- From/To date filters.
- Clear filters button.
- Loaded/filtered count copy.
- Empty state when filters match nothing.

Visible Chromium evidence:

- Initial: `Showing 19 of 19 loaded entries...`
- After action filter: `Showing 0 of 19 loaded entries...`
- After clear: `Showing 19 of 19 loaded entries...`

The backend still returns a capped page of log entries; true server-side pagination/filters remain open under T49.

### Settings

Changed:

```text
web/packages/pyxis-app/src/pages/SettingsPage/Page.tsx
web/packages/pyxis-app/src/components/organisms/Settings/SettingsPanel/SettingsPanel.tsx
web/packages/pyxis-app/src/components/organisms/Settings/SettingsPanel/SettingsPanel.css
pkg/server/app.go
```

Expanded Settings into sections:

- Space and public site: space name, public tagline, website, timezone, address, capacity.
- Booking and contact: contact email, booking email, safer-space required, auto-archive, setup complete.
- Discord: guild ID, channel IDs, Discord posting toggle.

Also fixed the backend settings PATCH handler so it now accepts/persists fields the UI exposes:

- `bookingEmail`
- `timezone`
- `autoArchive`
- `discordPosting`
- `safeSpaceRequired`

Visible Chromium evidence:

- Updated public tagline, website, and booking email.
- Save produced `Settings updated.`

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
go test ./... -count=1
```

## Step 13: Public frontend copy now reads backend settings

The operator also requested that public-site frontend copy become configurable in the backend. I implemented a first backend-backed copy pass using the existing settings row rather than adding a new content-management table.

Changed backend:

```text
pkg/server/server.go
pkg/server/public.go
```

Added public unauthenticated endpoint:

```text
GET /api/public/settings
```

It returns the existing settings proto as JSON. The route exposes safe public venue copy/configuration such as:

- `spaceName`
- `tagline`
- `address`
- `capacity`
- `contactEmail`
- `bookingEmail`
- `website`
- `timezone`
- Discord guild/channel identifiers already present in settings

Changed public frontend API:

```text
web/packages/pyxis-user-site/src/api/endpoints.ts
web/packages/pyxis-user-site/src/api/publicApi.ts
web/packages/pyxis-user-site/src/api/hooks.ts
```

Added RTK Query hook:

```ts
usePublicSettings()
```

Changed public frontend copy consumers:

```text
web/packages/pyxis-user-site/src/components/layout/Layout.tsx
web/packages/pyxis-user-site/src/pages/ShowsPage/Page.tsx
web/packages/pyxis-user-site/src/pages/AboutPage/Page.tsx
web/packages/pyxis-user-site/src/pages/BookPage/Page.tsx
web/packages/pyxis-components/src/public/organisms/PubFooter/PubFooter.tsx
web/packages/pyxis-components/src/public/organisms/BookingSpaceAside/BookingSpaceAside.tsx
```

The public site now uses backend settings for visible copy/configuration:

- Footer brand, tagline, and address.
- Shows page kicker/title and empty-state copy.
- About page title/kicker and intro lead.
- Book page title/kicker.
- Booking space aside capacity, address, and booking email.
- Discord footer link can derive from configured guild ID when no env override is present.

Visible Chromium validation:

```text
sources/09-public-backend-copy-visible-chromium.json
```

I restarted the backend so the new `/api/public/settings` route was active, then restarted the public Vite server on port 3007 with `--force` to clear stale transforms.

Evidence from the live public site showed backend-configured values:

- Shows header: `319 N 11TH ST, PHILADELPHIA, PA / Pyxis shows`
- Footer: `Pyxis / Visible Chromium configurable tagline / 319 N 11th St, Philadelphia, PA`
- About header: `VISIBLE CHROMIUM CONFIGURABLE TAGLINE / About Pyxis`
- Book header: `BOOKING@PYXIS.TEST / Book Pyxis`
- Booking aside includes `319 N 11th St, Philadelphia, PA` and `booking@pyxis.test`

Validation:

```bash
go test ./... -count=1
cd web/packages/pyxis-components && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec vite build
```

Note: this is a first settings-backed copy pass. Rich per-page CMS-style copy (full paragraphs, rules, CTA text, nav labels) would be a follow-up schema/content-model task.
