---
Title: Investigation Diary
Ticket: PYXIS-APP-REAL-RTK-MSW
Status: active
Topics:
    - frontend
    - rtk-query
    - storybook
    - msw
    - protobuf
    - go
    - api-integration
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: pkg/db/queries/auth.sql
      Note: Adds UpsertDevUser query for local staff API testing.
    - Path: pkg/server/app.go
      Note: GET /api/app/calendar now returns unified CalendarEventList.
    - Path: pkg/server/auth.go
      Note: |-
        Adds explicit PYXIS_DEV_AUTH-gated dev login endpoint.
        Session endpoint now validates the session cookie when no context user is present.
    - Path: pkg/server/public.go
      Note: Adds domain-to-CalendarEvent mapping helpers.
    - Path: pkg/service/auth_service.go
      Note: Adds dev session creation using normal sessions table.
    - Path: proto/pyxis/v1/show.proto
      Note: Adds CalendarEventKind
    - Path: ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/scripts/scrape-msw-seed.mjs
      Note: |-
        Ticket helper script for scraping seeded backend responses into MSW fixture JSON.
        Ticket-local scraper used with dev-auth session cookie.
    - Path: ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/sources/01-msw-seed-real-backend.json
      Note: Real backend scraped fixture evidence for public and staff endpoints.
    - Path: ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/tasks.md
      Note: Phased implementation checklist for intern handoff.
    - Path: web/packages/pyxis-app/.storybook/preview.tsx
      Note: Adds router initialEntries support for route-param stories.
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: |-
        Defaults API base URL to same-origin for Vite proxy and production.
        Adds staff RTK Query mutations with protobuf response decoding and tag invalidation.
        Decodes calendar endpoint with CalendarEventListSchema.
    - Path: web/packages/pyxis-app/src/api/endpoints.ts
      Note: Adds staff mutation endpoint paths.
    - Path: web/packages/pyxis-app/src/api/mockHandlers.ts
      Note: Expands protobuf-shaped MSW handlers and mutation state for staff page stories.
    - Path: web/packages/pyxis-app/src/components/molecules/CalendarEventChip/CalendarEventChip.tsx
      Note: Uses enum status with StatusDot while preserving data-status tone.
    - Path: web/packages/pyxis-app/src/components/molecules/SettingsToggleRow/SettingsToggleRow.tsx
      Note: Makes settings rows clickable mutation affordances.
    - Path: web/packages/pyxis-app/src/components/organisms/AttendancePanel/AttendancePanel.tsx
      Note: Adds row-level attendance update action affordance.
    - Path: web/packages/pyxis-app/src/components/organisms/CalendarMonth/CalendarMonth.tsx
      Note: Calendar event keys include kind/id/date/label to avoid duplicate-key warnings.
    - Path: web/packages/pyxis-app/src/components/organisms/CalendarMonthPanel/CalendarMonthPanel.tsx
      Note: Calendar event keys include kind/id/date/label to avoid duplicate-key warnings.
    - Path: web/packages/pyxis-app/src/components/organisms/SettingsPanel/SettingsPanel.tsx
      Note: Adds callbacks for settings toggle mutations.
    - Path: web/packages/pyxis-app/src/components/shell/AppShell.css
      Note: Changes prototype fixed-height shell into full-height app shell.
    - Path: web/packages/pyxis-app/src/pages
      Note: Per-page Storybook folders with Page.stories.tsx files.
    - Path: web/packages/pyxis-app/src/pages/BookingsPage/Page.stories.tsx
      Note: Adds loading/error/empty state stories with protobuf-shaped MSW responses.
    - Path: web/packages/pyxis-app/src/pages/Pages.tsx
      Note: |-
        Removes seed fallbacks from staff pages and wires detail routes to real route params/query data.
        Wires booking approve/decline and show cancel UI callbacks to real mutations.
        Wires remaining visible page mutation actions with unwrap success/error handling.
    - Path: web/packages/pyxis-app/src/pages/ShowsPage/Page.stories.tsx
      Note: Adds loading/error/empty state stories with protobuf-shaped MSW responses.
    - Path: web/packages/pyxis-app/src/pages/pages.css
      Note: |-
        Adds page-state styling for loading/error/empty panels.
        Adds action error styling for failed mutations.
        Adds success and inline action styling for mutation feedback.
    - Path: web/packages/pyxis-app/src/pages/storybook.tsx
      Note: Shared page story helpers for fresh mock state and route-param stories.
    - Path: web/packages/pyxis-app/src/styles/global.css
      Note: Removes component CSS imports now owned by atoms.
    - Path: web/packages/pyxis-app/vite.config.ts
      Note: Adds staff Vite proxy for /api
    - Path: web/packages/pyxis-types/src/app.ts
      Note: Removes hand-written CalendarEvent.
ExternalSources: []
Summary: Chronological investigation diary for the Pyxis app RTK Query and MSW Storybook wiring plan.
LastUpdated: 2026-04-26T12:53:03.830667737-04:00
WhatFor: Use this diary to understand how the implementation guide was created, what evidence was gathered, and what should happen next.
WhenToUse: When continuing this ticket or reviewing the recommended RTK Query/MSW integration plan.
---











# Diary

## Goal

Record the investigation and design process for wiring the Pyxis staff app pages to real RTK Query data, adding mutations, using Vite proxy for the Go backend, and making Storybook use MSW-backed protobuf-shaped mock data.

## Step 1: Ticket Setup, Evidence Gathering, and Implementation Guide

The user asked for a new docmgr ticket and a detailed implementation guide for making all app pages ready to use RTK Query and MSW, with Storybook configured to use mock data instead of a live backend. The request also called out Vite proxy as the preferred local-development strategy to avoid browser CORS problems, and suggested writing a script to scrape a seeded real server to generate MSW fixture data.

I created the ticket, inspected the current staff app page wiring, RTK Query slice, Storybook/MSW setup, Vite config, public-site query patterns, and backend route registry. The main finding is that the infrastructure is partly present: staff RTK Query reads exist, Storybook already initializes MSW, and the backend exposes most required routes. The gap is page-level cleanup, mutation wiring, complete MSW handlers, and optional fixture generation.

### Prompt Context

**User prompt (verbatim):** "Create a new docmgr ticket for making all pages ready to use rtk-query and msw, and set up msw for storybook to use mock data. Use vite proxy for the go side which would allow us to avoid the CORS if i understand correctly. Wire mutations.

Create a detailed implementation analysis and guide and stor ein ticket. Add detailed list of tasks. Maybe we can write a script to scrape the real server with seeded data to gather the msw seed data? 

reate a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet  
point sand pseudocode and diagrams and api references and file                                                                                                                                              
  references.                                                                                                                                                                                               
  It should be very clear and detailed. Store in the ticket and the nupload to remarkable.                                                                                                                  
                                                                                                                                                                                                            
You can write scripts and all kinds of other things in the scripts/ folder of the ticket."

**Assistant interpretation:** Create a new docmgr ticket with a complete design/implementation guide, task list, diary, and helper script for wiring the Pyxis staff app to real RTK Query data and Storybook MSW mock responses. Upload the deliverables to reMarkable.

**Inferred user intent:** Prepare an intern-ready handoff so implementation can proceed systematically without re-discovering the current architecture or making incorrect decisions about CORS, Storybook, or live backend dependencies.

**Commit (docs):** Pending at time of diary creation.

### What I did

- Created ticket `PYXIS-APP-REAL-RTK-MSW`.
- Created design document: `design-doc/01-rtk-query-page-wiring-and-msw-storybook-implementation-guide.md`.
- Created diary document: `reference/01-investigation-diary.md`.
- Replaced the default `tasks.md` with a phased checklist covering proxy, RTK mutations, page cleanup, route wiring, MSW handlers, fixture scraping, optional `CalendarEvent` proto cleanup, and validation.
- Added `scripts/scrape-msw-seed.mjs` to the ticket workspace.
- Inspected key evidence files:
  - `web/packages/pyxis-app/src/pages/Pages.tsx`
  - `web/packages/pyxis-app/src/api/appApi.ts`
  - `web/packages/pyxis-app/src/api/endpoints.ts`
  - `web/packages/pyxis-app/src/api/mockHandlers.ts`
  - `web/packages/pyxis-app/.storybook/preview.tsx`
  - `web/packages/pyxis-app/vite.config.ts`
  - `web/packages/pyxis-user-site/src/pages/Shows.tsx`
  - `web/packages/pyxis-user-site/src/pages/ShowDetail.tsx`
  - `web/packages/pyxis-user-site/vite.config.ts`
  - `pkg/server/server.go`

### Why

- The staff app currently mixes real RTK Query hooks with direct mock-data fallbacks. This hides broken backend connectivity.
- Storybook should keep MSW rather than hitting a live Go server, because stories need deterministic offline rendering.
- Vite proxy is the correct local-development strategy for avoiding browser CORS while preserving production-like relative `/api` URLs.
- Scraping seeded backend responses is a useful way to keep MSW fixtures realistic without making Storybook depend on the backend at render time.

### What worked

- `docmgr ticket create-ticket` created the expected workspace with `index.md`, `README.md`, `tasks.md`, and `changelog.md`.
- Existing staff Storybook already initializes `msw-storybook-addon`, so the plan can extend an existing mechanism rather than introduce a new one.
- The public site already has good loading/error/route-param examples to copy.
- Backend route registration in `pkg/server/server.go` is explicit and easy to map into RTK Query endpoints.

### What didn't work

- No command failures occurred during ticket setup or documentation writing.
- The codebase itself shows an architectural gap: `CalendarEvent` is still hand-written in TypeScript and `GET /api/app/calendar` returns holds/blocked only. This is documented as an optional cleanup phase.

### What I learned

- Staff pages are still prototype-like even though the underlying API slice is real.
- The public site is further along in page-level query ergonomics than the staff app.
- Staff app MSW handlers are present but read-only and incomplete.
- The backend route surface is richer than `appApi.ts`; mutations need to be added before the UI can operate against real data.

### What was tricky to build

- The main design tension is Storybook realism versus determinism. The right answer is to render real pages with real RTK Query hooks, but intercept the network with MSW. That gives realistic data-flow coverage without requiring a live backend.
- Fixture scraping must be treated as a fixture-refresh tool, not as a runtime dependency. Otherwise Storybook becomes flaky and database-dependent.

### What warrants a second pair of eyes

- The local auth strategy for staff endpoints. The current backend requires a session cookie for most app routes. The implementation phase should decide whether to use seeded test sessions, a dev bypass, or a temporary login helper.
- Whether to include `CalendarEvent` proto cleanup in this ticket or defer it. It is architecturally correct but not strictly required to begin page wiring.
- Whether generated MSW fixtures should live in `pyxis-app/src/api/fixtures/` or remain generated artifacts outside source control.

### What should be done in the future

- Implement Phase 1 first: Vite proxy + relative base URLs.
- Then implement Phase 2: staff app RTK Query mutations.
- Then remove page mock fallbacks and add loading/error states.
- Run the scraper against a seeded backend once auth/session setup is confirmed.

### Code review instructions

- Start with the design doc executive summary and current-state analysis.
- Review `tasks.md` for the phased implementation checklist.
- Review `scripts/scrape-msw-seed.mjs` for fixture-generation behavior and decide whether it should be copied into the main repo later.
- Validate documentation with `docmgr doctor --ticket PYXIS-APP-REAL-RTK-MSW --stale-after 30`.

### Technical details

**Commands run:**

```bash
docmgr status --summary-only
docmgr ticket create-ticket --ticket PYXIS-APP-REAL-RTK-MSW --title "Wire Pyxis App Pages to Real RTK Query and MSW Storybook" --topics frontend,rtk-query,storybook,msw,protobuf,go,api-integration
docmgr doc add --ticket PYXIS-APP-REAL-RTK-MSW --doc-type design-doc --title "RTK Query Page Wiring and MSW Storybook Implementation Guide"
docmgr doc add --ticket PYXIS-APP-REAL-RTK-MSW --doc-type reference --title "Investigation Diary"
```

**Evidence commands:**

```bash
nl -ba web/packages/pyxis-app/src/pages/Pages.tsx | sed -n '1,220p'
nl -ba web/packages/pyxis-app/src/api/appApi.ts | sed -n '1,240p'
rg -n "msw|mswDecorator|initialize|worker|handlers" web/packages -S
find web/packages -maxdepth 3 -path '*/.storybook/*' -type f -print
find web/packages -maxdepth 3 -name 'vite.config.*' -type f -print
nl -ba pkg/server/server.go | sed -n '1,220p'
```

**Script usage:**

```bash
node ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/scripts/scrape-msw-seed.mjs \
  --base-url http://localhost:8080 \
  --cookie 'session=test-session-abc' \
  --out ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/sources/msw-seed.json
```

## Step 2: Staff App Real Vite Proxy and Dev Auth

I started applying the real-app finishing-line playbook to `pyxis-app`.

### Vite proxy and same-origin API client

Changed the staff app API base URL from a hard-coded backend origin to same-origin default:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
```

Added Vite dev proxy entries in `web/packages/pyxis-app/vite.config.ts`:

```ts
proxy: {
  '/api': 'http://localhost:8080',
  '/auth': 'http://localhost:8080',
  '/flyers': 'http://localhost:8080',
}
```

This matches the public-site pattern: the browser calls `localhost:3008/api/...`, Vite proxies to the Go backend, and the eventual production/embedded app can call `/api/...` on the same origin.

### Dev auth for real staff endpoints

The staff API is protected by the `session` cookie. To test the real API without finishing Keycloak/OAuth yet, I added an explicit local-only development login endpoint:

```text
GET/POST /auth/dev-login?username=dev-admin&role=admin
```

It is only active when the backend process has:

```bash
PYXIS_DEV_AUTH=1
```

Implementation notes:

- Added `UpsertDevUser` sqlc query.
- Added `AuthService.CreateDevSession(...)`.
- Added `Server.handleDevLogin(...)`.
- The endpoint creates/updates a dev user, creates a normal `sessions` row, sets the normal `session` cookie, and returns a protobuf `AuthSession`.
- If `PYXIS_DEV_AUTH` is not enabled, the endpoint returns a protobuf `NOT_FOUND` error.

This keeps the production auth surface closed while giving us a reliable real staff API test path.

### Real Vite smoke

Restarted the development services:

```bash
tmux new-session -d -s pyxis-backend-dev 'PYXIS_DEV_AUTH=1 go run ./cmd/pyxis serve --bind :8080'
tmux new-session -d -s pyxis-app-vite -c web 'pnpm --filter pyxis-app dev --host 0.0.0.0'
```

Verified through the Vite proxy:

```bash
curl -i http://127.0.0.1:3008/api/app/shows
# -> 401 before login

curl -i -c /tmp/pyxis-app-cookie.jar 'http://127.0.0.1:3008/auth/dev-login?username=dev-admin&role=admin'
# -> 200 and Set-Cookie: session=...

curl -i -b /tmp/pyxis-app-cookie.jar http://127.0.0.1:3008/api/app/session
# -> 200

curl -i -b /tmp/pyxis-app-cookie.jar http://127.0.0.1:3008/api/app/shows
# -> 200, 15 shows
```

### Desktop app height issue

While looking at the real staff Vite app, the app shell looked like a fixed-height prototype card: the sidebar/main background stopped around 760px and left empty page background below it.

Root cause:

```css
.app-shell { height: 760px; ... border-radius: var(--app-radius-lg); }
```

That was appropriate for a captured prototype but wrong for a real app. I changed it to a full viewport application shell:

```css
.app-shell {
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  border: 0;
  border-radius: 0;
}

.app-sidebar {
  min-height: 100vh;
}
```

The main content still scrolls inside `.app-main-scroll`, but the application frame now fills the viewport.

### CSS ownership cleanup for staff app globals

Because we chose component-owned CSS, I removed individual `pyxis-components` atom CSS imports from `web/packages/pyxis-app/src/styles/global.css`. Shared atoms now import their own colocated CSS, so the staff app should not mask missing component CSS via globals.

### Validation

Passed:

```bash
go test ./...
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
```

### Next

The next real-app step is page-state cleanup: remove `seed*` fallbacks from staff pages, add explicit loading/error/empty states, and make pages visibly reflect unauthenticated/API-error conditions instead of silently rendering mock data.

## Step 3: Remove Staff Page Mock Fallbacks

I continued the staff app real-backend conversion by removing the mock-data fallbacks from route pages. Before this step, many pages used RTK Query but silently fell back to `seed*` data when the real request failed or was still loading. That made the app look healthy even when the authenticated staff API was returning `401` or other errors.

### What changed

Rewrote `web/packages/pyxis-app/src/pages/Pages.tsx` so route pages now show explicit states:

```text
LoadingState
ErrorState
EmptyState
```

The helpers render inside the real `AppShell` using a `Panel`, so users see in-context backend state instead of mock content.

Removed seed fallbacks from:

```text
DashboardPage
ShowsPage
CalendarPage
BookingsPage
ArtistsPage
AttendancePage
AuditLogPage
SettingsPage
```

Detail routes now read route params and query real data:

```text
ShowDetailPage      -> useParams().id + useGetShowQuery(id)
BookingReviewPage   -> useParams().id + select from useGetBookingsQuery()
```

`ShowDetailPage` needs an `AppShow` view model for the existing detail organisms, while `useGetShowQuery` returns the generated full `Show` proto. I added a local `appShowFromShow(...)` transform using `create(AppShowSchema, ...)`. This is a known transitional pattern until the backend exposes a dedicated `AppShow` detail/list proto or the staff detail organisms accept `Show` directly.

### Remaining intentional mock use

`DiscordPage` still uses static `discordMappings` because the Discord API endpoint is only a skeleton and that page is not part of the first real data cluster. The task list now records this as a placeholder exception.

### Validation

Passed:

```bash
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
```

With backend and staff Vite running, I also verified browser routes return HTTP 200 through Vite:

```text
/                   200
/shows              200
/calendar           200
/bookings           200
/artists            200
/attendance         200
/log                200
/settings           200
/shows/1            200
/bookings/review/1  200
```

The earlier dev-auth smoke remains valid:

```text
/api/app/shows before login -> 401
/auth/dev-login             -> 200 + Set-Cookie
/api/app/session with cookie -> 200
/api/app/shows with cookie   -> 200
```

### Next

The next phase should wire real mutations: approve/decline booking, show cancel/archive/announce, settings update, attendance update, and calendar hold/blocked actions where UI affordances exist.

## Step 4: Staff RTK Mutations and First UI Actions

I added the staff RTK Query mutation surface and wired the first real UI actions.

### Endpoint map

Extended `web/packages/pyxis-app/src/api/endpoints.ts` with paths for:

```text
show cancel/archive/announce/flyer
booking approve/decline
calendar hold/blocked CRUD
attendance by show
settings update
artist update
```

### Mutations added

Added RTK Query mutations in `web/packages/pyxis-app/src/api/appApi.ts`:

```text
createShow
updateShow
cancelShow
archiveShow
announceShow
uploadShowFlyer
deleteShowFlyer
approveBooking
declineBooking
updateArtist
createCalendarHold
deleteCalendarHold
createCalendarBlocked
deleteCalendarBlocked
updateAttendance
updateSettings
```

Response decoding uses `fromJson(...)` with generated schemas where the backend returns a protobuf body:

```text
ShowSchema
SuccessResponseSchema
FlyerUploadResponseSchema
ArtistSchema
CalendarHoldSchema
CalendarBlockedSchema
AttendanceLogSchema
SettingsSchema
```

For `createShow` / `updateShow`, request bodies use `toJson(ShowSchema, show)` so the frontend sends clean protobuf JSON rather than Buf message instances with `$typeName`.

I removed the blanket `Content-Type: application/json` header from `fetchBaseQuery` so `FormData` flyer uploads can set their multipart boundary correctly. RTK Query/fetchBaseQuery still sets JSON content type automatically for JSON-like request bodies.

### UI actions wired

Wired:

```text
BookingsPage inbox approve -> approveBooking(...).unwrap()
BookingsPage inbox decline -> declineBooking(...).unwrap()
BookingReviewPage approve  -> approveBooking(...).unwrap()
BookingReviewPage decline  -> declineBooking(...).unwrap()
ShowDetailPage cancel      -> cancelShow(...).unwrap()
```

Each page now has a small `actionError` state rendered as `.app-action-error` when the mutation fails.

`onHold` remains deferred because the backend does not currently expose a submission hold transition. Show archive and announce mutations exist in the API layer, but the visible page controls still need final UX placement.

### Validation

Passed:

```bash
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
go test ./...
```

Real mutation smoke through Vite proxy:

```bash
curl -fsS -c /tmp/pyxis-app-cookie.jar \
  'http://127.0.0.1:3008/auth/dev-login?username=dev-admin&role=admin'

curl -fsS -X POST http://127.0.0.1:3008/api/public/submissions \
  -H 'Content-Type: application/json' \
  -d '{"artistName":"mutation smoke artist","preferredDate":"2026-06-13","genre":"test","expectedDraw":12,"links":"https://example.com","message":"created by app mutation smoke"}'

curl -i -b /tmp/pyxis-app-cookie.jar \
  -X PATCH http://127.0.0.1:3008/api/app/bookings/<id>/decline
```

Observed:

```text
HTTP/1.1 200 OK
{"success":true}
```

This proves at least one real staff mutation path works end-to-end through Vite proxy, dev auth cookie, Go backend, PostgreSQL, protobuf response, and RTK-compatible response shape.

### Next

Next steps are to wire the remaining visible actions (`announceShow`, `archiveShow`, settings update, attendance update, calendar actions where UI exists) and then harden MSW handlers for these mutations so Storybook remains deterministic.

## Step 5: Page Story Split and Mutation Stories

I split the monolithic staff page Storybook file into per-page folders, matching the component-system convention.

### What changed

Removed:

```text
web/packages/pyxis-app/src/pages/Pages.stories.tsx
```

Added one `Page.stories.tsx` per route page:

```text
web/packages/pyxis-app/src/pages/DashboardPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/ShowsPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/ShowDetailPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/CalendarPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/BookingsPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/BookingReviewPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/ArtistsPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/AttendancePage/Page.stories.tsx
web/packages/pyxis-app/src/pages/AuditLogPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/DiscordPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/SettingsPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/LoginPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/SetupPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/ModalShowcasePage/Page.stories.tsx
```

Added a small page-story helper:

```text
web/packages/pyxis-app/src/pages/storybook.tsx
```

It provides:

```text
renderWithFreshMockState(...)
RoutedPage
```

The staff Storybook preview now supports route-specific initial entries:

```ts
parameters: {
  router: { initialEntries: ['/shows/42'] }
}
```

This lets detail page stories exercise `useParams()` with realistic route params.

### Mutation stories

Before this step there were no page stories that exercised RTK mutations. I added two interaction stories under the Bookings page stories:

```text
pyxis-app-pages-bookings--approve-mutation
pyxis-app-pages-bookings--decline-mutation
```

Both use MSW-backed in-memory mock state:

- assert `Awaiting review · 3`
- click the first `Approve` or `Decline` button
- assert the pending count changes to `Awaiting review · 2`

This proves the page, RTK mutation hook, MSW handler, invalidation/refetch, and rendered UI all work together without the live backend.

### MSW hardening

I expanded `web/packages/pyxis-app/src/api/mockHandlers.ts` so it returns protobuf JSON via `toJson(...)`, not raw Buf message instances. It now includes handlers for the staff mutation paths that were added in the previous step, including booking approve/decline, show cancel/archive/announce, calendar hold/blocked, attendance update, settings update, and artist/settings GETs.

### Validation

Passed:

```bash
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
```

Storybook index now includes per-page IDs such as:

```text
pyxis-app-pages-dashboard--desktop
pyxis-app-pages-shows--desktop
pyxis-app-pages-show-detail--desktop
pyxis-app-pages-bookings--approve-mutation
pyxis-app-pages-bookings--decline-mutation
```

## Step 6: Loading, Error, and Empty Page Stories

I added Storybook state variants for the first two real staff page clusters: Shows and Bookings.

### Shows page state stories

Added to:

```text
web/packages/pyxis-app/src/pages/ShowsPage/Page.stories.tsx
```

New stories:

```text
pyxis-app-pages-shows--loading
pyxis-app-pages-shows--error
pyxis-app-pages-shows--empty
```

The stories use story-level MSW handlers:

- `Loading` uses `delay('infinite')` for `GET /api/app/shows`.
- `Error` returns a protobuf-shaped error envelope with `500`.
- `Empty` returns `toJson(ShowListSchema, create(ShowListSchema, { shows: [] }))`.

### Bookings page state stories

Added to:

```text
web/packages/pyxis-app/src/pages/BookingsPage/Page.stories.tsx
```

New stories:

```text
pyxis-app-pages-bookings--loading
pyxis-app-pages-bookings--error
pyxis-app-pages-bookings--empty
```

The stories use story-level MSW handlers for `GET /api/app/bookings`, including an empty protobuf `SubmissionList` response.

### Why this matters

The staff pages no longer fall back to mock data, so Storybook needs explicit coverage for request lifecycle states. These stories prove the page-level loading/error/empty panels render without requiring the live backend and without pretending failed API calls are successful mock data.

### Validation

Passed:

```bash
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
```

Storybook index now includes:

```text
pyxis-app-pages-shows--loading
pyxis-app-pages-shows--error
pyxis-app-pages-shows--empty
pyxis-app-pages-bookings--loading
pyxis-app-pages-bookings--error
pyxis-app-pages-bookings--empty
```

## Step 7: Complete Phase 5 UI Mutation Wiring

I finished the Phase 5 mutation wiring pass for the staff app.

### Show detail actions

`ShowDetailPage` now wires visible actions to real RTK mutations:

```text
Cancel show -> cancelShow(id).unwrap()
Archive     -> archiveShow(id).unwrap()
Announce    -> announceShow(id).unwrap()
```

Each action clears prior messages, calls `.unwrap()`, and renders either `.app-action-success` or `.app-action-error` in the page.

### Settings toggles

`SettingsPanel` now accepts callbacks for the three visible settings toggles:

```text
onToggleAutoArchive
onToggleDiscordPosting
onToggleSafeSpaceRequired
```

`SettingsPage` wires those to:

```text
updateSettings({ ...settings, [key]: !settings[key] }).unwrap()
```

`SettingsToggleRow` changed from a static row to a button-like row so clicking the visible toggle area performs the update.

### Attendance updates

`AttendancePanel` now accepts:

```text
onUpdateEntry(entry)
isUpdating
```

`AttendancePage` wires row-level `Mark logged` / `Save note` actions to:

```text
updateAttendance({ showId, draw, notes, incident, incidentNotes }).unwrap()
```

The current UI is still intentionally minimal, but it now exercises the real attendance mutation path instead of only rendering read-only data.

### Calendar actions

`CalendarPage` now exposes topbar actions:

```text
Add hold   -> createCalendarHold({ date: '2026-06-01', label: 'Hold — TBD' }).unwrap()
Block date -> createCalendarBlocked({ date: '2026-06-02', reason: 'Closed' }).unwrap()
```

Delete actions remain deferred because the current `CalendarEvent` view model is still hand-written and drops the backend hold/blocked IDs. There is also no delete affordance in the current calendar UI. This reinforces the known Phase 8 cleanup: replace the hand-written calendar view model with protobuf-backed calendar event data.

### Validation

Passed:

```bash
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
go test ./...
```

Real API smoke through Vite proxy and dev-auth cookie:

```text
POST  /api/app/shows/<id>/announce -> HTTP/1.1 200 OK
POST  /api/app/calendar/holds      -> HTTP/1.1 201 Created
PATCH /api/app/settings            -> HTTP/1.1 200 OK
```

This completes the Phase 5 UI mutation wiring as far as the current UI and backend support allow. The only explicitly deferred part is calendar delete, due to missing IDs/affordance in the current frontend view model.

## Step 8: Fixture Scrape and Full Validation

I completed the fixture scraping phase against the real local backend through the staff Vite proxy.

### Scrape setup

The backend was running with explicit dev auth:

```bash
PYXIS_DEV_AUTH=1 go run ./cmd/pyxis serve --bind :8080
```

The staff Vite app was running on:

```text
http://127.0.0.1:3008
```

I created a normal staff session cookie through the Vite proxy:

```bash
curl -fsS -c /tmp/pyxis-app-scrape-cookie.jar \
  'http://127.0.0.1:3008/auth/dev-login?username=dev-admin&role=admin'
```

Then ran the ticket-local scraper:

```bash
node ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/scripts/scrape-msw-seed.mjs \
  --base-url http://127.0.0.1:3008 \
  --cookie "$cookie" \
  --out ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/sources/01-msw-seed-real-backend.json
```

### Captured evidence

Added:

```text
ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/sources/01-msw-seed-real-backend.json
```

All scraped endpoints returned `200`:

```text
publicShows         200
publicArchive       200
publicArchiveStats  200
session             200
appShows            200
bookings            200
artists             200
calendar            200
attendance          200
auditLog            200
settings            200
```

This file is evidence for reviewing real backend response shapes. I decided not to copy the scraper or generated fixture into `web/` yet. The curated `mockData.ts` and MSW handlers are now working, and replacing them with scraped fixtures should be a deliberate follow-up once we decide how much real DB state should become deterministic Storybook seed data.

### Full validation

I ran the broader validation ladder:

```bash
cd web/packages/pyxis-types && pnpm build
cd web/packages/pyxis-components && pnpm build
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-user-site && pnpm build
cd web && pnpm build
go test ./...
```

All passed.

### Remaining scope

The main remaining optional technical cleanup is Phase 8: make `CalendarEvent` protobuf-backed so the frontend can retain calendar hold/blocked IDs and support delete affordances cleanly.

## Step 9: Phase 8 CalendarEvent Proto Cleanup

I completed the optional CalendarEvent proto cleanup that was blocking clean calendar semantics.

### Proto schema

Added protobuf-backed calendar events to `proto/pyxis/v1/show.proto`:

```text
CalendarEventKind
CalendarEvent
CalendarEventList
```

`CalendarEvent` carries:

```text
id      - source entity id: show id, hold id, or blocked id
date    - yyyy-mm-dd
label   - artist, hold label, or blocked reason
status  - ShowStatus enum, reused by the existing status presentation system
kind    - CalendarEventKind enum so callers can distinguish show/hold/blocked sources
```

I regenerated Go and TypeScript code with:

```bash
make generate
```

### Backend response shape

`GET /api/app/calendar` now returns a protojson `CalendarEventList` instead of the old hold/blocked wrapper.

The handler builds one unified list from:

```text
confirmed shows -> CALENDAR_EVENT_KIND_SHOW + SHOW_STATUS_CONFIRMED
calendar holds  -> CALENDAR_EVENT_KIND_HOLD + SHOW_STATUS_HOLD
blocked dates   -> CALENDAR_EVENT_KIND_BLOCKED + SHOW_STATUS_BLOCKED
```

This preserves IDs for hold/blocked items and removes the frontend-only adapter that had been dropping IDs.

### Frontend type cleanup

Removed the hand-written `CalendarEvent` interface from `web/packages/pyxis-types/src/app.ts` and exported the generated protobuf type/schema from `web/packages/pyxis-types/src/index.ts`.

`appApi.ts` now decodes calendar data with:

```ts
fromJson(CalendarEventListSchema, response as any).events
```

### Calendar components and stories

Updated calendar mock data and dense stories to use generated protobuf messages via:

```ts
create(CalendarEventSchema, ...)
```

`CalendarEventChip` now passes the enum directly to status presentation:

```tsx
<StatusDot status={event.status} />
```

It still derives a string tone for `data-status` so existing CSS selectors continue to work.

### MSW

Updated staff MSW calendar handlers to return `CalendarEventListSchema` JSON with `toJson(...)` and to maintain mutable in-memory calendar events for create/delete hold/blocked handlers.

### Validation

Passed:

```bash
make generate
cd web/packages/pyxis-types && pnpm build
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
go test ./...
```

Real endpoint smoke against a temporary server on `:18080` returned the new shape:

```text
GET /api/app/calendar -> { "events": [...] }
```

Sample returned events included protojson enum strings:

```json
{
  "id": 4,
  "date": "2026-05-23",
  "label": "Open Mic Night",
  "status": "SHOW_STATUS_CONFIRMED",
  "kind": "CALENDAR_EVENT_KIND_SHOW"
}
```

This closes Phase 8. The calendar UI now receives protobuf-backed events with IDs and enum statuses. A later UI pass can use `event.kind` and `event.id` to add delete affordances for holds and blocked dates.

## Step 10: End-to-end Current Status Test

I ran the current-status test checklist against the local development environment.

### Environment

PostgreSQL was running through Docker Compose:

```bash
docker compose up -d db
```

I ran migrations and loaded the SQL dev fixture:

```bash
go run ./cmd/pyxis migrate up
docker compose exec -T db psql -U pyxis -d pyxis < fixtures/dev.sql
```

One stale `:8080` backend process was still serving an older build. That was visible because `/api/app/calendar` returned the pre-Phase-8 `{ holds, blocked }` shape. I killed that process and restarted the current source build with dev auth:

```bash
PYXIS_DEV_AUTH=1 go run ./cmd/pyxis serve --bind :8080
```

### Backend API smoke

Public endpoints passed:

```text
GET /health                  -> 200
GET /api/public/shows        -> 200, 12 shows
GET /api/public/archive      -> 200, 7 shows
GET /api/public/archive/stats -> 200
```

Staff dev auth and protected endpoints passed after the session fix below:

```text
GET /auth/dev-login?username=dev-admin&role=admin -> 200
GET /api/app/session with cookie                   -> authenticated=true
GET /api/app/shows with cookie                     -> 21 shows
GET /api/app/calendar with cookie                  -> { events: [...] }, 16 events
```

The calendar sample had the new Phase 8 proto shape:

```json
{
  "id": 10,
  "date": "2026-05-23",
  "label": "Open Mic Night",
  "status": "SHOW_STATUS_CONFIRMED",
  "kind": "CALENDAR_EVENT_KIND_SHOW"
}
```

### Mutation smoke

I tested non-destructive/light dev mutations through the real backend:

```text
POST  /api/app/shows/<id>/announce -> 200
POST  /api/app/calendar/holds      -> 201
PATCH /api/app/settings            -> 200
```

### Frontend/Vite smoke

Public Vite site on `:3000` returned HTML for:

```text
/
/shows
/archive
/book
```

and proxied public API correctly:

```text
GET http://127.0.0.1:3000/api/public/shows -> 200, 12 shows
```

Staff Vite app on `:3008` returned HTML for:

```text
/
/shows
/calendar
/settings
```

and proxied staff API correctly:

```text
GET /auth/dev-login?...        -> 200
GET /api/app/shows with cookie -> 200, 21 shows
GET /api/app/calendar          -> 200, { events: [...] }, 16 events
```

I restarted a stale staff Vite process after it reported an old HMR/module export error.

### Browser smoke

Playwright loaded the public home page successfully:

```text
http://127.0.0.1:3000/
```

Playwright loaded the staff calendar successfully after dev login:

```text
http://127.0.0.1:3008/calendar
```

The final staff calendar load had zero console errors and only the expected React Router v7 future-flag warnings.

### Embedded public site smoke

I ran:

```bash
make build-embed
PYXIS_DEV_AUTH=1 ./bin/pyxis serve --bind :18081
```

Smoke results:

```text
GET /                 -> 200 text/html
GET /shows/1          -> 200 text/html
GET /api/public/shows -> 200 application/json
```

I reverted the generated embedded asset hash changes after the test so the worktree did not keep noisy build-output churn.

### Full validation

Passed:

```bash
go test ./...
cd web/packages/pyxis-types && pnpm build
cd web/packages/pyxis-components && pnpm build
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-user-site && pnpm build
cd web && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
```

After the small fixes below, I reran:

```bash
go test ./...
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
cd web && pnpm build
```

All passed.

### Fixes from test findings

The test pass exposed two small issues, both fixed:

1. `GET /api/app/session` was not validating the `session` cookie because the route is intentionally public and therefore had no `userContextKey`. It returned only `{ "spaceName": "Pyxis" }` even with a valid cookie. `handleGetSession` now validates the cookie directly when no context user exists.
2. Staff calendar rendering emitted duplicate React key warnings when fixture data contained duplicate show/date/label rows. Calendar event chip keys now include `kind`, `id`, `date`, and `label`.

### Known caveat

Re-applying `fixtures/dev.sql` is not fully idempotent; the dev DB now contains duplicate fixture rows, which is why counts are higher than a fresh fixture load. This reinforces the existing follow-up to make the seed/bootstrap workflow reliable and repeatable.
