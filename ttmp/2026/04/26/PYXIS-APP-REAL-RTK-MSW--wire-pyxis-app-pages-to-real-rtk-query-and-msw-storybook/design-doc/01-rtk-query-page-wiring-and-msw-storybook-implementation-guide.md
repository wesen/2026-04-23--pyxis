---
Title: RTK Query Page Wiring and MSW Storybook Implementation Guide
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
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: pkg/server/server.go
      Note: Backend route registry used to derive RTK Query mutation inventory.
    - Path: web/packages/pyxis-app/.storybook/preview.tsx
      Note: Staff Storybook already wraps stories with Redux
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: Staff RTK Query slice; read endpoints exist and mutations need to be added.
    - Path: web/packages/pyxis-app/src/api/mockHandlers.ts
      Note: Existing staff MSW handlers to expand for Storybook and mutations.
    - Path: web/packages/pyxis-app/src/pages/Pages.tsx
      Note: Staff pages currently mix RTK Query hooks with direct mock-data fallbacks and hardcoded detail data.
    - Path: web/packages/pyxis-app/vite.config.ts
      Note: Vite app config needs proxy for /api
    - Path: web/packages/pyxis-user-site/src/pages/ShowDetail.tsx
      Note: Public site example for route-param detail query pattern.
    - Path: web/packages/pyxis-user-site/src/pages/Shows.tsx
      Note: Public site example for loading/error/query page pattern.
ExternalSources: []
Summary: Plan for wiring Pyxis staff pages to real RTK Query data, adding mutations, configuring Vite proxy, and making Storybook use deterministic MSW handlers backed by protobuf-shaped fixtures.
LastUpdated: 2026-04-26T12:53:03.669716943-04:00
WhatFor: Use this guide when replacing page-level mock fallbacks with real API data, adding app mutations, and setting up Storybook/MSW fixtures that mirror the Go backend contract.
WhenToUse: Before implementing the Pyxis app real-data wiring ticket, or when onboarding a frontend/backend intern to the RTK Query + protobuf + MSW workflow.
---


# RTK Query Page Wiring and MSW Storybook Implementation Guide

## 1. Executive Summary

The Pyxis backend and TypeScript protobuf pipeline are now strong enough to support a real end-to-end application. The staff app already has RTK Query endpoints for many read operations, and the public site already demonstrates the intended loading/error/query pattern. The remaining work is not to invent a new data layer; it is to remove page-level mock fallbacks, wire detail routes and mutations, make Vite proxy browser requests to the Go backend, and make Storybook use deterministic MSW responses that match the protobuf-backed API contract.

The critical separation is:

1. **Runtime development app:** use RTK Query against `/api/...`, with Vite proxy forwarding to the Go server. This avoids browser CORS because the browser talks to the Vite origin, and Vite forwards to Go server-side.
2. **Storybook:** keep MSW. Do not depend on a running backend for stories. Storybook should exercise the same RTK Query hooks, but MSW should answer those HTTP requests with proto-shaped mock responses.
3. **Fixture generation:** add a script that can scrape a seeded real server and emit reusable MSW fixture JSON/TypeScript. This keeps mock data realistic while preserving deterministic stories.

The implementation should be incremental: first proxy + query ergonomics, then page conversion, then mutations, then Storybook MSW hardening, then optional fixture scraping automation.

## 2. Problem Statement and Scope

### 2.1 The current problem

The staff app currently sits halfway between a prototype and a real API client. It imports mock data directly at the page layer and uses it as fallbacks when RTK Query has no data. For example, `web/packages/pyxis-app/src/pages/Pages.tsx` imports `seedShows`, `seedBookings`, `seedEvents`, and others from `../api/mockData` on line 4, then uses fallbacks such as `const { data: shows = seedShows } = useGetShowsQuery()` on lines 11-12. This hides API failures because an offline or broken backend can still render convincing mock data.

Some routes are not wired to RTK Query at all. `ShowDetailPage` uses `seedShows[0]` directly on line 14 even though `App.tsx` defines the route as `/shows/:id` on line 3. `BookingReviewPage` uses a pending mock booking from `seedBookings` on line 17 even though the route is `/bookings/review/:id`.

The staff RTK Query slice already has useful read endpoints. `appApi.ts` defines `getShows`, `getShow`, `getBookings`, `getArtists`, `getCalendar`, `getAttendance`, `getAuditLog`, and `getSettings` between lines 41-139. However, it does not yet define the mutations needed to operate the app: create/update/cancel/archive shows, approve/decline bookings, create/delete calendar holds and blocked dates, update attendance, update settings, upload/delete flyers, and announce shows.

Storybook already has MSW in the staff app: `pyxis-app/.storybook/preview.tsx` initializes `msw-storybook-addon` and registers `mockHandlers`. But the handlers are minimal. `src/api/mockHandlers.ts` answers GETs only, returns `{ holds: [], blocked: [] }` for calendar, and has no mutation handlers.

### 2.2 What this ticket covers

This ticket covers the frontend integration work required to make the app behave like a real API client while keeping Storybook deterministic:

- Configure Vite dev proxy for `pyxis-app` and `pyxis-user-site` so API calls use relative `/api/...` paths.
- Change `fetchBaseQuery` base URLs to default to `''` or `/` so Vite proxy is used in development.
- Remove page-level direct mock fallbacks from staff app pages.
- Add loading, error, empty, and not-found states.
- Wire route params for detail pages.
- Add RTK Query mutations and connect them to UI callbacks.
- Expand staff-app MSW handlers so Storybook can run pages and components using real RTK Query hooks.
- Keep mock responses protobuf-shaped and generated via `create(Schema, {...})` where practical.
- Add a script to scrape a seeded Go server and generate fixture data for MSW.

### 2.3 What this ticket does not cover

This ticket does not replace the placeholder Discord OAuth/Keycloak plan. It may use the current test-session cookie during local development, but full production auth is outside this ticket.

This ticket does not require Storybook to hit a live backend. That remains an anti-goal because Storybook should be deterministic and self-contained.

This ticket does not have to finish every UI edit modal if a modal does not exist yet. It should wire the mutation surfaces and page callbacks enough for the app to prove that data flows work.

## 3. Current-State Architecture

### 3.1 Backend API is mostly ready

The Go backend routes are centralized in `pkg/server/server.go`. Public routes are registered on lines 75-80:

```go
GET  /api/public/shows
GET  /api/public/shows/{id}
GET  /api/public/archive
GET  /api/public/archive/stats
POST /api/public/submissions
```

Staff routes are registered on lines 87-128. The route inventory includes session, shows, flyers, bookings, artists, calendar, attendance, settings, and audit log. Most staff endpoints require `requireAuth` and `requireRole`, so real app wiring must account for authentication in development.

Important staff endpoints available today:

| Area | Method/path | Backend evidence |
| --- | --- | --- |
| Session | `GET /api/app/session` | `server.go:87` |
| Shows list | `GET /api/app/shows` | `server.go:90` |
| Create show | `POST /api/app/shows` | `server.go:91` |
| Update show | `PATCH /api/app/shows/{id}` | `server.go:92` |
| Cancel show | `PATCH /api/app/shows/{id}/cancel` | `server.go:93` |
| Archive show | `PATCH /api/app/shows/{id}/archive` | `server.go:94` |
| Announce show | `POST /api/app/shows/{id}/announce` | `server.go:95` |
| Upload flyer | `POST /api/app/shows/{id}/flyer` | `server.go:98` |
| Delete flyer | `DELETE /api/app/shows/{id}/flyer` | `server.go:99` |
| List bookings | `GET /api/app/bookings` | `server.go:102` |
| Approve booking | `PATCH /api/app/bookings/{id}/approve` | `server.go:103` |
| Decline booking | `PATCH /api/app/bookings/{id}/decline` | `server.go:104` |
| Artists | `GET /api/app/artists`, `GET/PATCH /api/app/artists/{id}` | `server.go:107-109` |
| Calendar | `GET /api/app/calendar`, hold/blocked create/delete | `server.go:112-116` |
| Attendance | `GET/PATCH /api/app/attendance...` | `server.go:119-121` |
| Settings | `GET/PATCH /api/app/settings` | `server.go:124-125` |
| Audit log | `GET /api/app/audit-log` | `server.go:128` |

### 3.2 RTK Query exists but is read-heavy

`web/packages/pyxis-app/src/api/appApi.ts` defines the staff app API client. It already decodes protobuf JSON via `fromJson`:

- `getSession` uses `AuthSessionSchema` at lines 41-44.
- `getShows` decodes `ShowListSchema` and maps each `Show` to `AppShow` at lines 47-67.
- `getShow` uses `ShowSchema` at lines 74-77.
- `getBookings`, `getArtists`, `getCalendar`, `getAttendance`, `getAuditLog`, and `getSettings` follow the same pattern between lines 80-139.

The gap is mutations. The backend route surface is richer than the RTK Query endpoint list. This ticket should add mutation endpoints and make components call them.

### 3.3 Page wiring is still prototype-style

`Pages.tsx` is the central staff app page file. It imports real hooks on line 3, but it also imports mock data on line 4. Several pages use default mock data in destructuring:

```tsx
const { data: shows = seedShows } = useGetShowsQuery();
```

This is acceptable for early prototypes, but not for real API wiring. It creates three problems:

1. Query failures are hidden by fallback data.
2. Loading states do not render.
3. Storybook and runtime app behavior diverge.

The public site already demonstrates the better pattern. `web/packages/pyxis-user-site/src/pages/Shows.tsx` calls `useUpcomingShows()` and renders explicit loading and error states on lines 9-12. `ShowDetail.tsx` reads `useParams()` on lines 15-18 and handles loading/not-found states on lines 20-21.

### 3.4 Vite currently has no API proxy

`web/packages/pyxis-app/vite.config.ts` sets aliases and dev server port 3008, but `server` only contains `{ port: 3008, open: true }`. It does not proxy `/api` or `/auth` to Go.

`web/packages/pyxis-user-site/vite.config.ts` has the same pattern for port 3000 and also lacks proxy configuration.

Because `appApi.ts` and `publicApi.ts` currently default to `http://localhost:8080`, browser requests are cross-origin during development. Using Vite proxy lets us change the default to same-origin `/api/...` and avoid CORS during local dev.

### 3.5 Storybook already has partial MSW

The staff app Storybook preview (`pyxis-app/.storybook/preview.tsx`) initializes MSW and registers handlers from `../src/api/mockHandlers`. The handlers (`src/api/mockHandlers.ts`) currently provide basic GET responses:

```ts
http.get('*/api/app/shows', () => HttpResponse.json({ shows }))
http.get('*/api/app/bookings', () => HttpResponse.json({ submissions: bookings }))
http.get('*/api/app/calendar', () => HttpResponse.json({ holds: [], blocked: [] }))
```

This proves the mechanism exists. The missing work is to make handlers complete, mutation-capable, stateful enough for interaction stories, and aligned with protobuf schemas.

The public site Storybook uses MSW per story with imported handlers from `pyxis-components/mocks/handlers`. That package already exposes public API handlers, but `pyxis-components/.storybook/preview.tsx` itself does not initialize MSW. This is acceptable for pure component stories but should be documented so interns know where MSW is active.

## 4. Gap Analysis

### 4.1 Runtime app gaps

- Staff pages use mock fallbacks instead of showing loading/error states.
- Detail pages do not use route params.
- Booking review page does not call a booking detail endpoint. The backend currently has list bookings but no `GET /api/app/bookings/{id}` route. The frontend can initially derive detail from `getBookings`, but the cleaner future is to add a backend `GetSubmission` route.
- Several buttons do not dispatch mutations.
- Auth state is not enforced at the route/page level.
- Vite proxy is missing.

### 4.2 RTK Query gaps

Needed mutations in `appApi.ts`:

```ts
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
logout
```

Optional future query additions:

```ts
getBooking(id)          // requires backend endpoint or client-side selector
getAttendanceForShow(id)
getMe                   // wraps /auth/me
```

### 4.3 Storybook/MSW gaps

- `mockHandlers.ts` only covers basic GETs.
- No mutation handlers update in-memory mock state.
- Calendar handler returns empty holds/blocked and omits confirmed shows.
- Mock fixtures are hand-authored, not generated from seeded backend state.
- Storybook stories often pass direct props instead of exercising real query hooks at page level.

### 4.4 API contract gap: CalendarEvent

`CalendarEvent` is still a hand-written TypeScript interface in `pyxis-types/src/app.ts`, and `appApi.ts` creates it manually from `CalendarResponse`. This is the last major staff-view model that violates the proto-everywhere rule. The immediate page wiring can still use it, but the recommended implementation is to add `CalendarEvent` and `CalendarEventList` proto messages and have the backend return a unified calendar event list.

## 5. Proposed Architecture

## 5.1 Runtime data flow

```text
Browser React app
  |
  | fetch('/api/app/shows') from RTK Query
  v
Vite dev server on localhost:3008
  |
  | proxy /api and /auth to http://localhost:8080
  v
Go backend
  |
  | pgx/sqlc
  v
PostgreSQL seeded database
```

In production, the same frontend code should still call relative `/api/...` paths. The deployed web server or reverse proxy should route `/api` to the Go backend.

### 5.2 Storybook data flow

```text
Storybook iframe
  |
  | RTK Query fetch('/api/app/shows')
  v
MSW service worker
  |
  | returns protobuf-shaped JSON fixture
  v
RTK Query transformResponse(fromJson(...))
  |
  v
Page/component renders deterministic data
```

Storybook should not require Go or PostgreSQL to be running. MSW gives deterministic responses while still testing the real RTK Query code path.

### 5.3 Fixture generation flow

```text
Seeded Go server
  |
  | scripts/scrape-msw-seed.mjs calls /api/public/* and /api/app/*
  v
JSON snapshot files in ticket workspace or app fixtures
  |
  | optional normalization/redaction
  v
MSW handlers import fixture data
```

The scraper is a development tool, not production code. It should accept `--base-url`, optional `--cookie`, and `--out` arguments.

## 6. Design Decisions

### 6.1 Use Vite proxy instead of backend CORS for local dev

Use Vite proxy for `/api` and `/auth` in `pyxis-app` and `pyxis-user-site`.

```ts
server: {
  port: 3008,
  open: true,
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true },
    '/auth': { target: 'http://localhost:8080', changeOrigin: true },
    '/flyers': { target: 'http://localhost:8080', changeOrigin: true },
  },
}
```

Rationale: the browser only sees same-origin requests to the Vite server. Vite performs the cross-origin request server-side, so browser CORS is not involved.

### 6.2 Default RTK Query base URL should be same-origin

Change this:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
```

to this:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
```

Rationale: relative URLs work with Vite proxy in development and reverse proxies in production. `VITE_API_URL` can still override for special environments.

### 6.3 Storybook should use MSW, not a real backend

Do not make stories hit a live Go server by default. Live backend stories are useful as a separate manual/debug mode, but default Storybook must be deterministic.

Rationale:

- Stories should render offline.
- Visual regression snapshots should not change when the database changes.
- Interaction tests should not mutate a shared developer database.

### 6.4 Use real RTK Query hooks inside page stories

Page stories should render pages wrapped in Redux Provider and MemoryRouter, allowing real hooks to run. MSW intercepts the fetches.

Rationale: this tests the actual app data path without a backend:

```text
Page -> hook -> RTK Query -> fetch -> MSW -> protobuf JSON -> fromJson -> component
```

### 6.5 Keep pure component stories prop-driven

Low-level components should still accept args and mock props directly. They should not need Redux or MSW unless their natural public API requires query hooks.

## 7. API and RTK Query Implementation Plan

### 7.1 Update endpoint constants

Add missing mutation paths to `web/packages/pyxis-app/src/api/endpoints.ts`:

```ts
export const endpoints = {
  session: '/api/app/session',
  shows: '/api/app/shows',
  show: (id: number) => `/api/app/shows/${id}`,
  showCancel: (id: number) => `/api/app/shows/${id}/cancel`,
  showArchive: (id: number) => `/api/app/shows/${id}/archive`,
  showAnnounce: (id: number) => `/api/app/shows/${id}/announce`,
  showFlyer: (id: number) => `/api/app/shows/${id}/flyer`,
  bookings: '/api/app/bookings',
  bookingApprove: (id: number) => `/api/app/bookings/${id}/approve`,
  bookingDecline: (id: number) => `/api/app/bookings/${id}/decline`,
  artists: '/api/app/artists',
  artist: (id: number) => `/api/app/artists/${id}`,
  calendar: '/api/app/calendar',
  calendarHold: '/api/app/calendar/holds',
  calendarHoldById: (id: number) => `/api/app/calendar/holds/${id}`,
  calendarBlocked: '/api/app/calendar/blocked',
  calendarBlockedById: (id: number) => `/api/app/calendar/blocked/${id}`,
  attendance: '/api/app/attendance',
  attendanceForShow: (showId: number) => `/api/app/attendance/${showId}`,
  auditLog: '/api/app/audit-log',
  settings: '/api/app/settings',
} as const;
```

### 7.2 Add mutation endpoints

Sketch:

```ts
createShow: builder.mutation<Show, Partial<Show>>({
  query: (body) => ({ url: endpoints.shows, method: 'POST', body }),
  transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
  invalidatesTags: [{ type: 'Show', id: 'LIST' }, 'Calendar'],
}),

updateShow: builder.mutation<Show, { id: number; patch: Partial<Show> }>({
  query: ({ id, patch }) => ({ url: endpoints.show(id), method: 'PATCH', body: patch }),
  transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
  invalidatesTags: (_r, _e, { id }) => [{ type: 'Show', id }, { type: 'Show', id: 'LIST' }, 'Calendar'],
}),

cancelShow: builder.mutation<Show, number>({
  query: (id) => ({ url: endpoints.showCancel(id), method: 'PATCH' }),
  transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
  invalidatesTags: (_r, _e, id) => [{ type: 'Show', id }, { type: 'Show', id: 'LIST' }, 'Calendar'],
}),

approveBooking: builder.mutation<Show, number>({
  query: (id) => ({ url: endpoints.bookingApprove(id), method: 'PATCH' }),
  transformResponse: (response: unknown) => fromJson(ShowSchema, response as any),
  invalidatesTags: ['Booking', { type: 'Show', id: 'LIST' }, 'Artist', 'Calendar'],
}),
```

Mutation response schemas should match backend proto responses. If any endpoint returns `SuccessResponse`, decode with `SuccessResponseSchema`.

### 7.3 Add query helpers for derived detail pages

Until the backend has `GET /api/app/bookings/{id}`, implement `BookingReviewPage` by selecting from `getBookings`:

```tsx
const { id } = useParams<{ id: string }>();
const bookingId = Number(id);
const { data: bookings, isLoading, isError } = useGetBookingsQuery();
const booking = bookings?.find((item) => item.id === bookingId);
```

Future improvement: add backend `GET /api/app/bookings/{id}` and RTK `getBooking` query.

## 8. Page Wiring Plan

### 8.1 Create reusable query state components

Add small app-local helpers:

```tsx
function PageLoading({ label = 'Loading…' }) { ... }
function PageError({ title = 'Could not load data', error }) { ... }
function PageEmpty({ title, description }) { ... }
```

Do not over-engineer. These can live in `src/pages/PageStates.tsx` or `src/components/molecules/AppPageState`.

### 8.2 Replace mock fallbacks

Change this:

```tsx
const { data: shows = seedShows } = useGetShowsQuery();
```

to this:

```tsx
const { data: shows, isLoading, isError, error } = useGetShowsQuery();
if (isLoading) return <PageLoading label="Loading shows…" />;
if (isError || !shows) return <PageError title="Failed to load shows" error={error} />;
```

Apply this to:

- DashboardPage
- ShowsPage
- CalendarPage
- BookingsPage
- ArtistsPage
- AttendancePage
- AuditLogPage
- SettingsPage

### 8.3 Wire detail routes

`ShowDetailPage` should read `id` from `useParams()` and call `useGetShowQuery(id)`.

`BookingReviewPage` should read `id` and derive the booking from `useGetBookingsQuery()` until a direct backend endpoint exists.

### 8.4 Wire mutation callbacks

Examples:

```tsx
const [approveBooking, approveState] = useApproveBookingMutation();

<BookingsInboxPanel
  bookings={bookings}
  onApprove={(booking) => approveBooking(booking.id)}
  onDecline={(booking) => declineBooking(booking.id)}
/>
```

Use `.unwrap()` when the page needs immediate success/error handling:

```tsx
try {
  await approveBooking(booking.id).unwrap();
  navigate('/shows');
} catch (error) {
  setToast(getApiErrorMessage(error));
}
```

## 9. MSW and Storybook Plan

### 9.1 Expand staff app MSW handlers

`web/packages/pyxis-app/src/api/mockHandlers.ts` should become a small in-memory API server:

```ts
let mockShows = [...shows];
let mockBookings = [...bookings];
let mockArtists = [...artists];
let mockCalendarHolds = [...holds];
let mockCalendarBlocked = [...blocked];

http.patch('*/api/app/bookings/:id/approve', ({ params }) => {
  const id = Number(params.id);
  const booking = mockBookings.find((b) => b.id === id);
  if (!booking) return HttpResponse.json(errorResponse('NOT_FOUND', 'Booking not found'), { status: 404 });
  booking.status = SubmissionStatus.APPROVED;
  const show = create(ShowSchema, { ... });
  mockShows.push(show);
  return HttpResponse.json(show);
});
```

Handlers should return the same wrapper messages as the backend:

- `GET /api/app/shows` returns `{ shows: [...] }`
- `GET /api/app/bookings` returns `{ submissions: [...] }`
- `GET /api/app/artists` returns `{ artists: [...] }`
- `GET /api/app/calendar` returns the proto-defined calendar response/list
- errors return `{ error: { code, message } }`

### 9.2 Add page-level stories that use hooks

For staff app pages, add stories like:

```tsx
export const DashboardWithApi: Story = {
  render: () => <DashboardPage />,
  parameters: { msw: { handlers: mockHandlers } },
};
```

Because `preview.tsx` already wraps stories with Provider and MemoryRouter, pages can use real hooks.

For route-param pages, use MemoryRouter initial entries:

```tsx
const withRoute = (path: string) => (Story) => (
  <Provider store={makeStore()}>
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/shows/:id" element={<Story />} /></Routes>
    </MemoryRouter>
  </Provider>
);
```

Or define special story wrappers for `ShowDetailPage` and `BookingReviewPage`.

### 9.3 Keep pure component stories prop-driven

`BookingCard.stories.tsx`, `ShowTableRow.stories.tsx`, etc. should continue using direct props. These stories are for visual states, not data fetching.

## 10. Fixture Scraping Script

### 10.1 Why scrape fixtures?

Hand-authored mock data drifts from real backend data. A scraper lets us run a seeded backend once and capture real response envelopes for Storybook/MSW.

### 10.2 Proposed script behavior

Create `scripts/scrape-msw-seed.mjs` in this ticket workspace. It should:

- Accept `--base-url`, default `http://localhost:8080`
- Accept `--cookie`, optional session cookie such as `session=test-session-abc`
- Accept `--out`, default `./sources/msw-seed.json`
- Fetch public endpoints and staff endpoints
- Write a JSON file grouped by endpoint name
- Optionally write a TypeScript fixture module

Example usage:

```bash
node ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/scripts/scrape-msw-seed.mjs \
  --base-url http://localhost:8080 \
  --cookie 'session=test-session-abc' \
  --out ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/sources/msw-seed.json
```

### 10.3 Endpoints to scrape

Public:

- `GET /api/public/shows`
- `GET /api/public/archive`
- `GET /api/public/archive/stats`

Staff:

- `GET /api/app/session`
- `GET /api/app/shows`
- `GET /api/app/bookings`
- `GET /api/app/artists`
- `GET /api/app/calendar`
- `GET /api/app/attendance`
- `GET /api/app/audit-log`
- `GET /api/app/settings`

The script should tolerate 401/403 and record them clearly so developers know the session cookie is missing or expired.

## 11. Implementation Phases

### Phase 1: Proxy and base URL cleanup

- Add Vite proxy to `pyxis-app/vite.config.ts`.
- Add Vite proxy to `pyxis-user-site/vite.config.ts`.
- Change `API_BASE_URL` default in `appApi.ts` and `publicApi.ts` to `''`.
- Verify frontend can call Go via Vite proxy.

### Phase 2: Staff RTK mutations

- Extend `endpoints.ts` with mutation paths.
- Add mutation endpoints to `appApi.ts`.
- Decode proto responses with `fromJson`.
- Set correct `invalidatesTags`.

### Phase 3: Page state and mock fallback removal

- Add reusable loading/error/empty states.
- Remove `seed*` default fallbacks from pages.
- Keep `mockData.ts` for stories/MSW only.
- Follow public-site pattern from `Shows.tsx` and `ShowDetail.tsx`.

### Phase 4: Detail route wiring

- Wire `ShowDetailPage` with `useParams()` and `useGetShowQuery(id)`.
- Wire `BookingReviewPage` with `useParams()` and bookings selection.
- Add not-found states.

### Phase 5: Mutation UI wiring

- Wire booking approve/decline callbacks.
- Wire show cancel/archive/announce callbacks.
- Wire settings updates.
- Wire attendance updates.
- Wire calendar hold/blocked mutations.

### Phase 6: Storybook MSW hardening

- Expand `mockHandlers.ts` to cover all reads and mutations.
- Add page-level stories that render real pages and exercise RTK Query hooks.
- Add route-param story wrappers.
- Add error/empty/loading stories by overriding handlers per story.

### Phase 7: Fixture scraping automation

- Add scraper script from this ticket to repo or keep in ticket until reviewed.
- Generate a seed fixture from the real backend.
- Document regeneration workflow.

### Phase 8: Optional CalendarEvent proto cleanup

- Add `CalendarEvent` and `CalendarEventList` proto messages.
- Update backend `GET /api/app/calendar` to return unified events.
- Remove hand-written `CalendarEvent` interface.
- Update `CalendarEventChip` to use enum `status` directly.

## 12. Testing and Validation Strategy

### 12.1 Build checks

Run:

```bash
cd web/packages/pyxis-types && pnpm build
cd ../pyxis-app && pnpm build
cd ../pyxis-components && pnpm build
cd ../pyxis-user-site && pnpm build
cd ../../ && pnpm build
```

### 12.2 Runtime checks

Run backend:

```bash
docker compose up -d
go run ./cmd/pyxis migrate up
go run ./cmd/pyxis seed
go run ./cmd/pyxis serve --bind :8080
```

Run app:

```bash
cd web/packages/pyxis-app
pnpm dev
```

Verify browser network requests go to `http://localhost:3008/api/...` and are proxied to Go.

### 12.3 Storybook checks

```bash
cd web/packages/pyxis-app
pnpm storybook
```

Verify page stories render without Go running. In the browser devtools, requests should be intercepted by MSW.

### 12.4 Mutation checks

Use a seeded database and test:

- Approve a booking; bookings list updates and shows list gains a draft/confirmed show depending backend behavior.
- Decline a booking; it leaves inbox and appears in processed list.
- Cancel/archive a show; status changes and lists refresh.
- Update settings; settings panel reflects saved values.

## 13. Risks and Open Questions

1. **Auth development flow:** Staff endpoints require session cookies. Decide whether local dev uses a seeded test session cookie, a dev bypass flag, or a temporary login helper.
2. **Booking detail endpoint:** The route `/bookings/review/:id` wants a single booking. Current backend route inventory has list/approve/decline but not `GET /api/app/bookings/{id}`. We can select from list initially.
3. **Calendar event source of truth:** Current backend returns holds + blocked only. Recommended future is unified `CalendarEventList` proto.
4. **MSW mutable state:** Stateful handlers make interaction stories more realistic but can leak state between stories. Add `resetMockState()` and call it in story loaders if needed.
5. **File upload in Storybook:** Flyer upload uses multipart data. MSW can mock it, but browser story coverage should focus on request behavior and UI state, not actual file storage.

## 14. References

### Key frontend files

- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/Pages.tsx` — staff pages, currently mixed RTK + mock fallbacks
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/appApi.ts` — staff RTK Query slice
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/endpoints.ts` — staff endpoint constants
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/mockHandlers.ts` — staff app MSW handlers
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/.storybook/preview.tsx` — staff Storybook Provider/Router/MSW setup
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/vite.config.ts` — staff Vite dev server config
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/Shows.tsx` — good loading/error/query pattern
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/ShowDetail.tsx` — good route-param query pattern
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/vite.config.ts` — public site Vite config

### Key backend files

- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/server.go` — backend route registry
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/app.go` — staff handlers
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/public.go` — public handlers and proto JSON helpers
- `/home/manuel/code/wesen/2026-04-23--pyxis/proto/pyxis/v1/show.proto` — protobuf API contract

### Existing patterns to copy

- Public site loading/error states: `web/packages/pyxis-user-site/src/pages/Shows.tsx`
- Public site route-param query: `web/packages/pyxis-user-site/src/pages/ShowDetail.tsx`
- Staff Storybook MSW setup: `web/packages/pyxis-app/.storybook/preview.tsx`
- Proto mock construction: `web/packages/pyxis-app/src/api/mockData.ts`
