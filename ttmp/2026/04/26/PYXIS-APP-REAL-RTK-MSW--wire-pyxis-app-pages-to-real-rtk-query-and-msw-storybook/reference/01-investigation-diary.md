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
    - Path: pkg/server/auth.go
      Note: Adds explicit PYXIS_DEV_AUTH-gated dev login endpoint.
    - Path: pkg/service/auth_service.go
      Note: Adds dev session creation using normal sessions table.
    - Path: ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/scripts/scrape-msw-seed.mjs
      Note: Ticket helper script for scraping seeded backend responses into MSW fixture JSON.
    - Path: ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/tasks.md
      Note: Phased implementation checklist for intern handoff.
    - Path: web/packages/pyxis-app/.storybook/preview.tsx
      Note: Adds router initialEntries support for route-param stories.
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: |-
        Defaults API base URL to same-origin for Vite proxy and production.
        Adds staff RTK Query mutations with protobuf response decoding and tag invalidation.
    - Path: web/packages/pyxis-app/src/api/endpoints.ts
      Note: Adds staff mutation endpoint paths.
    - Path: web/packages/pyxis-app/src/api/mockHandlers.ts
      Note: Expands protobuf-shaped MSW handlers and mutation state for staff page stories.
    - Path: web/packages/pyxis-app/src/components/shell/AppShell.css
      Note: Changes prototype fixed-height shell into full-height app shell.
    - Path: web/packages/pyxis-app/src/pages
      Note: Per-page Storybook folders with Page.stories.tsx files.
    - Path: web/packages/pyxis-app/src/pages/Pages.tsx
      Note: |-
        Removes seed fallbacks from staff pages and wires detail routes to real route params/query data.
        Wires booking approve/decline and show cancel UI callbacks to real mutations.
    - Path: web/packages/pyxis-app/src/pages/pages.css
      Note: |-
        Adds page-state styling for loading/error/empty panels.
        Adds action error styling for failed mutations.
    - Path: web/packages/pyxis-app/src/pages/storybook.tsx
      Note: Shared page story helpers for fresh mock state and route-param stories.
    - Path: web/packages/pyxis-app/src/styles/global.css
      Note: Removes component CSS imports now owned by atoms.
    - Path: web/packages/pyxis-app/vite.config.ts
      Note: Adds staff Vite proxy for /api
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
