---
Title: Route and RTK Query Backend Freshening Guide
Ticket: PYXIS-APP-RTK-ROUTES
Status: active
Topics:
    - frontend
    - backend
    - rtk-query
    - pyxis
    - storybook
    - visual-diff
DocType: design
Intent: implementation-guide
Owners: []
RelatedFiles:
    - Path: pkg/repository/repository.go
      Note: Repository interfaces backing staff endpoints
    - Path: pkg/server/app.go
      Note: Backend staff app handlers and response envelopes
    - Path: pkg/server/auth.go
      Note: Session and Discord auth handlers
    - Path: pkg/server/server.go
      Note: Backend staff route registration and auth/role middleware
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: Current RTK Query slice to normalize and extend
    - Path: web/packages/pyxis-app/src/api/endpoints.ts
      Note: Frontend endpoint constants with backend drift
    - Path: web/packages/pyxis-app/src/pages/Pages.tsx
      Note: Current route components using RTK hooks and seed fallbacks
    - Path: web/packages/pyxis-types/src/app.ts
      Note: Frontend app-domain types consumed by organisms
ExternalSources: []
Summary: Detailed intern guide for wiring pyxis-app pages to the Go backend with RTK Query normalization, route states, mutations, visual guardrails, and validation commands.
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Route and RTK Query Backend Freshening Guide

## 1. What this ticket is for

The previous ticket, `PYXIS-APP-REACT`, built the responsive staff application shell and component architecture. That work gave us a real React package under `web/packages/pyxis-app`, a Storybook surface for atoms/molecules/organisms/pages, a set of app domain types in `pyxis-types`, and a proven `css-visual-diff` loop for comparing the implementation against the prototype. It also completed the Phase 8C component-system reuse pass: empty states wrap `Empty`, modal shell wraps `Modal`, panels wrap `Card`, metric cards wrap `Stat`, and status/age labels wrap `Badge`/`Tag`.

This ticket starts the next phase: make the app behave like a real client of the backend that now exists. The staff pages already call RTK Query hooks, but the hooks are still shaped around prototype-era arrays and mock fallbacks. The backend now exposes staff endpoints with authentication, role checks, persistence, audit logging, and a mixture of protobuf JSON and hand-written JSON wrapper responses. The frontend must be freshened so each route uses the real backend contract, handles loading/error/empty states deliberately, and wires user actions to mutations instead of inert callbacks.

The goal is not to redesign the UI. The UI should remain visually stable unless a route-state requirement forces a small addition such as an error state or skeleton. The goal is to move data ownership to the pages, move normalization into the API layer, keep organisms presentational, and preserve the visual work already done.

## 2. Mental model of the system

Think of Pyxis as three concentric layers:

```text
+--------------------------------------------------------------------------------+
| Browser / Staff app                                                            |
|                                                                                |
|  React routes                                                                  |
|    call RTK Query hooks                                                        |
|    handle loading/error/empty                                                  |
|    pass typed domain props to organisms                                        |
|                                                                                |
|  Organisms/molecules/atoms                                                     |
|    render shows, bookings, calendar, etc.                                      |
|    expose callbacks but do not fetch directly                                  |
+-------------------------------------- HTTP ------------------------------------+
| Go backend                                                                     |
|                                                                                |
|  net/http ServeMux routes in pkg/server/server.go                              |
|    auth middleware                                                             |
|    role middleware                                                             |
|    request parsing and response shaping                                        |
|                                                                                |
|  service layer                                                                 |
|    business operations: create show, approve booking, update settings          |
|                                                                                |
|  repository layer                                                              |
|    sqlc-generated queries over PostgreSQL                                      |
+------------------------------------ storage -----------------------------------+
| PostgreSQL                                                                     |
|  shows, artists, submissions, sessions, calendar holds, settings, audit logs   |
+--------------------------------------------------------------------------------+
```

The important boundary for this ticket is the HTTP/RTK boundary. The backend has already decided which paths exist and which roles can use them. The frontend must decide how to transform those response shapes into the app's domain presentation types.

## 3. Where the relevant code lives

### Frontend package

```text
web/packages/pyxis-app/
  src/App.tsx                         Route table for the staff app.
  src/pages/Pages.tsx                 Current route components and RTK hook usage.
  src/pages/pages.css                 Broad page CSS bucket; should be split later.
  src/api/endpoints.ts                Frontend endpoint path constants.
  src/api/appApi.ts                   RTK Query API slice.
  src/api/hooks.ts                    Hook re-export layer, if used.
  src/api/mockData.ts                 Prototype-era seed data.
  src/api/mockHandlers.ts             MSW handlers for Storybook/dev.
  src/store.ts                        Redux store with appApi reducer/middleware.
  src/components/shell/AppShell.tsx   Staff shell/topbar/sidebar.
  src/components/organisms/*          Page sections; should receive typed props.
  src/components/molecules/*          Domain rows/cards/items.
  src/components/atoms/*              Status/date/age/draw primitives.
```

### Shared frontend packages

```text
web/packages/pyxis-types/src/app.ts      Staff app domain TypeScript types.
web/packages/pyxis-types/src/index.ts    Public type exports.
web/packages/pyxis-components/src        Shared Button, Card, Modal, Badge, Table, etc.
```

### Backend routes and services

```text
pkg/server/server.go      net/http route registration, auth/role middleware.
pkg/server/app.go         Staff app handlers for shows, bookings, artists, calendar, attendance, settings, audit.
pkg/server/auth.go        Discord auth callback, session, /auth/me, logout.
pkg/server/public.go      Public site endpoints; useful as shape precedent.
pkg/service/*.go          Business logic used by staff handlers.
pkg/repository/*.go       Repository interfaces.
pkg/repository/postgres   PostgreSQL implementations.
pkg/db/queries/*.sql      sqlc query definitions.
proto/pyxis/v1/show.proto Protobuf messages currently used for shows/session/public data.
```

### Ticket docs and scripts

```text
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/
  design/01-route-and-rtk-query-backend-freshening-guide.md
  reference/01-diary.md
  scripts/01-inventory-app-api.py
  tasks.md
  changelog.md
```

Run the ticket helper script from the repository root when contracts drift:

```bash
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/scripts/01-inventory-app-api.py
```

It prints backend staff routes, frontend endpoint constants, and current RTK Query declarations. It is intentionally simple regex tooling; use it as a checklist, not as a compiler.

## 4. Current backend staff routes

The backend route registration lives in `pkg/server/server.go`. The staff app routes currently include:

| Area | Method/path | Auth/role intent | Handler |
|---|---|---|---|
| Auth | `GET /auth/discord/callback` | public callback | `handleDiscordCallback` |
| Auth | `GET /auth/me` | authenticated | `handleGetMe` |
| Auth | `POST /auth/logout` | authenticated | `handleLogout` |
| Session | `GET /api/app/session` | public-ish session probe | `handleGetSession` |
| Shows | `GET /api/app/shows` | admin/booker/door | `handleListAppShows` |
| Shows | `POST /api/app/shows` | admin/booker | `handleCreateShow` |
| Shows | `PATCH /api/app/shows/{id}` | admin/booker | `handleUpdateShow` |
| Shows | `PATCH /api/app/shows/{id}/cancel` | admin/booker | `handleCancelShow` |
| Shows | `PATCH /api/app/shows/{id}/archive` | admin/booker | `handleArchiveShow` |
| Bookings | `GET /api/app/bookings` | admin/booker | `handleListBookings` |
| Bookings | `PATCH /api/app/bookings/{id}/approve` | admin/booker | `handleApproveBooking` |
| Bookings | `PATCH /api/app/bookings/{id}/decline` | admin/booker | `handleDeclineBooking` |
| Artists | `GET /api/app/artists` | admin/booker/door | `handleListArtists` |
| Artists | `GET /api/app/artists/{id}` | admin/booker/door | `handleGetArtist` |
| Artists | `PATCH /api/app/artists/{id}` | admin/booker | `handleUpdateArtist` |
| Calendar | `GET /api/app/calendar` | admin/booker/door | `handleListCalendar` |
| Calendar | `POST /api/app/calendar/holds` | admin/booker | `handleCreateCalendarHold` |
| Calendar | `DELETE /api/app/calendar/holds/{id}` | admin/booker | `handleDeleteCalendarHold` |
| Calendar | `POST /api/app/calendar/blocked` | admin/booker | `handleCreateCalendarBlocked` |
| Calendar | `DELETE /api/app/calendar/blocked/{id}` | admin/booker | `handleDeleteCalendarBlocked` |
| Attendance | `GET /api/app/attendance` | admin/booker/door | `handleListAttendance` |
| Attendance | `GET /api/app/attendance/{showId}` | admin/booker/door | `handleGetAttendance` |
| Attendance | `PATCH /api/app/attendance/{showId}` | admin/booker/door | `handleUpsertAttendance` |
| Settings | `GET /api/app/settings` | admin/booker/door | `handleGetSettings` |
| Settings | `PATCH /api/app/settings` | admin | `handleUpdateSettings` |
| Audit | `GET /api/app/audit-log` | admin | `handleListAuditLog` |

There is no registered backend route for `GET /api/app/discord` at the time this guide was written. The current frontend has an `endpoints.discord` constant and `getDiscordMappings` query, but the backend stores Discord channel IDs in `settings`. The implementation phase must either remove/replace `getDiscordMappings` with a selector derived from settings, or add a backend endpoint intentionally. Do not leave the app calling a route that does not exist.

## 5. Current frontend API shape and the mismatch problem

The current RTK API slice in `web/packages/pyxis-app/src/api/appApi.ts` expects convenient app types directly:

```ts
getShows: builder.query<AppShow[], void>({ query: () => endpoints.shows })
getBookings: builder.query<BookingRequest[], void>({ query: () => endpoints.bookings })
getArtists: builder.query<ArtistProfile[], void>({ query: () => endpoints.artists })
getCalendar: builder.query<CalendarEvent[], void>({ query: () => endpoints.calendar })
```

The backend does not consistently return those exact arrays.

Examples:

- `GET /api/app/shows` currently responds with protobuf JSON for `ShowList`, shaped like `{ shows: Show[] }`, not `AppShow[]`.
- `GET /api/app/bookings` responds with `{ submissions: [...] }`, not `BookingRequest[]`.
- `GET /api/app/artists` responds with `{ artists: [...] }`, not `ArtistProfile[]`.
- `GET /api/app/calendar` responds with `{ holds: [...], blocked: [...] }`, not `CalendarEvent[]`.
- `GET /api/app/attendance` responds with `{ logs: [...] }`, not `AttendanceEntry[]`.
- `GET /api/app/audit-log` responds with `{ entries: [...] }`, not `AuditLogEntry[]`.
- `GET /api/app/settings` returns a settings object that includes Discord channel IDs, not a separate `DiscordChannelMapping[]`.

This is normal during a prototype-to-backend transition. The right fix is not to change every organism to understand backend wrappers. The right fix is to normalize at the API boundary.

## 6. The desired frontend data flow

The app should follow one rule: pages fetch, widgets render.

```text
RTK Query endpoint
  fetches backend response
  normalizes response into pyxis-types app domain type
  tags the cache
  exposes hook

Page route component
  calls the hook
  handles loading/error/empty
  chooses route layout
  passes typed props and callbacks to organisms

Organism
  receives arrays/domain objects/callbacks
  renders section
  does not call route-level data fetching hooks

Molecule/atom
  renders one domain item or primitive indicator
  does not fetch
```

In pseudocode:

```tsx
function ShowsPage() {
  const showsQuery = useGetShowsQuery();
  const createShow = useCreateShowMutation();

  if (showsQuery.isLoading) return <ShowsRouteSkeleton />;
  if (showsQuery.isError) return <ShowsRouteError error={showsQuery.error} onRetry={showsQuery.refetch} />;

  const shows = showsQuery.data ?? [];
  const confirmed = shows.filter(isConfirmed);
  const archived = shows.filter(isArchived);

  return (
    <AppShell page="shows" ...>
      <ShowsFilterBar confirmedCount={confirmed.length} />
      <ShowsConfirmedPanel shows={confirmed} />
      <ShowsArchivedPanel shows={archived} />
      <NewShowModal onSubmit={(payload) => createShow(payload)} />
    </AppShell>
  );
}
```

Notice what is absent: `seedShows` is not the default for a successful query. Seed data can remain in Storybook and MSW, but live routes should treat missing backend data as loading, error, or empty state.

## 7. API normalization design

Create a small normalization layer near `appApi.ts`. The exact file names are flexible, but keep the responsibility clear:

```text
src/api/backendTypes.ts       Raw backend response TypeScript types.
src/api/normalizers.ts        Raw backend -> pyxis-types app types.
src/api/appApi.ts             RTK Query endpoints and mutations.
src/api/errors.ts             Error normalization helpers.
```

### Raw backend types

Use raw types to document what the backend actually returns. They do not need to be perfect on day one, but they should be honest.

```ts
export type BackendShow = {
  id: number;
  artist: string;
  date: string;
  doorsTime?: string;
  doors_time?: string;
  startTime?: string;
  age: string;
  price: string;
  genre: string;
  description?: string;
  flyerUrl?: string;
  status: string;
  submissionId?: number;
  artistId?: number;
};

export type BackendShowList = {
  shows: BackendShow[];
};

export type BackendBookingList = {
  submissions: BackendSubmission[];
};

export type BackendCalendarResponse = {
  holds: BackendCalendarHold[];
  blocked: BackendCalendarBlocked[];
};
```

### Normalizers

Normalizers should be deterministic, small, and tested with fixtures.

```ts
export function normalizeShow(raw: BackendShow): AppShow {
  return {
    id: Number(raw.id),
    artist: raw.artist,
    date: raw.date,
    doors: raw.doorsTime ?? raw.doors_time ?? '',
    age: raw.age,
    price: raw.price,
    status: normalizeShowStatus(raw.status),
    genre: raw.genre,
    draw: 0,
    capacity: 150,
    pinned: false,
    notes: raw.description ?? '',
  };
}

export function normalizeShowList(raw: BackendShowList): AppShow[] {
  return (raw.shows ?? []).map(normalizeShow);
}
```

The normalizer is also the right place to adapt backend vocabulary to UI vocabulary. For example, a backend status of `cancelled` may become a red/declined app tone, while `confirmed` remains confirmed. Do that mapping once here, not inside every table row.

### RTK Query transformResponse

Use `transformResponse` so pages receive app types:

```ts
getShows: builder.query<AppShow[], void>({
  query: () => endpoints.shows,
  transformResponse: (response: BackendShowList) => normalizeShowList(response),
  providesTags: (result) =>
    result
      ? [
          ...result.map((show) => ({ type: 'Show' as const, id: show.id })),
          { type: 'Show' as const, id: 'LIST' },
        ]
      : [{ type: 'Show' as const, id: 'LIST' }],
});
```

This keeps the rest of the app stable. `ShowsConfirmedPanel` still receives `AppShow[]`; it does not know or care whether the backend used protobuf JSON, snake_case, camelCase, or wrapper objects.

## 8. Route-state design

Every route should make four states explicit:

```text
loading: the request is in flight and no usable cached data exists.
error: the request failed or auth/role denied access.
empty: the request succeeded but the domain list is empty.
ready: data exists and organisms render normally.
```

Start with small route-level helpers. Do not invent a giant framework.

```tsx
function RouteLoading({ title }: { title: string }) {
  return <Panel title={title}><AppEmptyState title="Loading…" /></Panel>;
}

function RouteError({ title, error, onRetry }: RouteErrorProps) {
  return (
    <Panel title={title}>
      <AppEmptyState
        title="Could not load this page."
        description={formatRtkError(error)}
        action={<Button onClick={onRetry}>Retry</Button>}
      />
    </Panel>
  );
}
```

For an intern, the key is to avoid this anti-pattern:

```tsx
const { data: shows = seedShows } = useGetShowsQuery();
```

That line hides backend failures by rendering prototype data. It is fine for Storybook and MSW fixtures, but it is dangerous in a real route because a broken endpoint looks like a successful app.

## 9. Authentication and credentials

The backend uses an HTTP-only `session` cookie set by the Discord callback. RTK Query must send cookies on app API requests if the API runs on a separate origin/port. Update `fetchBaseQuery` to include credentials:

```ts
baseQuery: fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});
```

Check CORS/backend origin behavior when using `VITE_API_URL`. If the frontend is served by Vite on `localhost:6008` or `localhost:5173` and the backend is `localhost:8080`, cookies need correct `SameSite`, `Secure`, and CORS settings. Development may work with `Secure: false`, but production must not.

Route behavior should be clear:

```text
GET /api/app/session
  authenticated=false -> show LoginPage / unauthenticated shell decisions
  authenticated=true  -> route pages may fetch protected resources

Protected endpoint returns unauthenticated/forbidden
  page should show auth/role error or redirect to login, not seed fallback data
```

## 10. Mutations to add

The current `appApi.ts` mostly has queries. This ticket should add mutations for real actions.

### Shows

Backend:

```text
POST  /api/app/shows
PATCH /api/app/shows/{id}
PATCH /api/app/shows/{id}/cancel
PATCH /api/app/shows/{id}/archive
```

Frontend candidates:

```ts
createShow: builder.mutation<AppShow, CreateShowInput>({...})
updateShow: builder.mutation<AppShow, UpdateShowInput>({...})
cancelShow: builder.mutation<AppShow, number>({...})
archiveShow: builder.mutation<{ success: true }, number>({...})
```

Cache invalidation:

```ts
invalidatesTags: (_result, _error, arg) => [
  { type: 'Show', id: 'LIST' },
  { type: 'Show', id: typeof arg === 'number' ? arg : arg.id },
  'Calendar',
  'AuditLog',
]
```

### Bookings

Backend:

```text
PATCH /api/app/bookings/{id}/approve
PATCH /api/app/bookings/{id}/decline
```

Frontend:

```ts
approveBooking: builder.mutation<AppShow, number>({
  query: (id) => ({ url: `/api/app/bookings/${id}/approve`, method: 'PATCH' }),
  transformResponse: normalizeShow,
  invalidatesTags: ['Booking', { type: 'Show', id: 'LIST' }, 'Calendar', 'AuditLog'],
});

declineBooking: builder.mutation<{ success: true }, number>({
  query: (id) => ({ url: `/api/app/bookings/${id}/decline`, method: 'PATCH' }),
  invalidatesTags: ['Booking', 'AuditLog'],
});
```

### Calendar

Backend:

```text
POST   /api/app/calendar/holds
DELETE /api/app/calendar/holds/{id}
POST   /api/app/calendar/blocked
DELETE /api/app/calendar/blocked/{id}
```

The frontend calendar currently wants `CalendarEvent[]`. The backend returns holds and blocked dates separately. Normalize them into events:

```ts
export function normalizeCalendar(response: BackendCalendarResponse): CalendarEvent[] {
  return [
    ...response.holds.map((hold) => ({
      date: hold.date,
      label: hold.label,
      status: 'hold' as const,
    })),
    ...response.blocked.map((blocked) => ({
      date: blocked.date,
      label: blocked.reason,
      status: 'blocked' as const,
    })),
  ];
}
```

### Attendance

Backend:

```text
GET   /api/app/attendance
GET   /api/app/attendance/{showId}
PATCH /api/app/attendance/{showId}
```

Frontend:

```ts
getAttendance: builder.query<AttendanceEntry[], AttendanceListArgs | void>(...)
getAttendanceForShow: builder.query<AttendanceEntry, number>(...)
upsertAttendance: builder.mutation<AttendanceEntry, UpsertAttendanceInput>(...)
```

### Settings and Discord mapping

Backend:

```text
GET   /api/app/settings
PATCH /api/app/settings
```

There is no separate `/api/app/discord` endpoint. Either derive mappings from settings:

```ts
export function settingsToDiscordMappings(settings: SpaceSettings): DiscordChannelMapping[] {
  return [
    { kind: 'upcoming', channelName: '#upcoming-shows', channelId: settings.discordChUpcoming, enabled: !!settings.discordChUpcoming },
    { kind: 'announcements', channelName: '#announcements', channelId: settings.discordChAnnouncements, enabled: !!settings.discordChAnnouncements },
    { kind: 'staff', channelName: '#staff', channelId: settings.discordChStaff, enabled: !!settings.discordChStaff },
    { kind: 'bookings', channelName: '#booking-requests', channelId: settings.discordChBookings, enabled: !!settings.discordChBookings },
  ];
}
```

or add a backend endpoint as a separate backend task. For this ticket, the simpler path is to derive from settings in the frontend.

## 11. Page-by-page implementation plan

### Pass 1: API layer only

Do this before touching page layout.

1. Add raw backend types.
2. Add normalizers.
3. Update `endpoints.ts` for missing mutation paths.
4. Update `appApi.ts` queries with `transformResponse`.
5. Add mutations.
6. Export new hooks.
7. Update MSW handlers to mirror backend wrapper shapes.
8. Add small unit tests for normalizers if the package already has a test runner; otherwise add a ticket script with sample inputs.

Validation:

```bash
cd web
pnpm --filter pyxis-app typecheck
```

### Pass 2: Route states

Refactor pages in `src/pages/Pages.tsx` incrementally. Keep one route per commit when possible.

Suggested order:

1. `DashboardPage`: shows + bookings + audit log.
2. `ShowsPage`: show list, create/update/cancel/archive seams.
3. `BookingsPage` and `BookingReviewPage`: approve/decline mutation wiring.
4. `CalendarPage`: normalize holds/blocked and add hold/block mutations.
5. `ArtistsPage`: wrapper response normalization and update mutation.
6. `AttendancePage`: list/get/upsert attendance.
7. `AuditLogPage`: wrapper response normalization.
8. `DiscordPage`: derive mappings from settings.
9. `SettingsPage`: get/update settings.
10. `LoginPage`/`SetupPage`: session/auth/setup state.

Each route should stop using seed fallback data in live route code. Storybook stories and MSW fixtures can keep using seed data.

### Pass 3: Mutations and callbacks

Use the callbacks introduced in Phase 8C. For example:

```tsx
const [approveBooking, approveState] = useApproveBookingMutation();

<BookingsInboxPanel
  bookings={pending}
  onApprove={(booking) => approveBooking(booking.id)}
  onDecline={(booking) => declineBooking(booking.id)}
/>
```

The organism should not know that RTK Query exists. It only knows that a callback was provided.

### Pass 4: Visual and Storybook guardrails

After route-state work, run focused checks on the sections most likely to shift:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page shows --section confirmed --summary \
  --outDir /tmp/pyxis-rtk-shows-confirmed \
  --output json

css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page bookings-queue-panel --summary \
  --outDir /tmp/pyxis-rtk-bookings-queue \
  --output json
```

Do not chase old prototype parity if backend data differs. Instead, use Storybook/MSW fixture data for visual parity, and use route checks for behavioral correctness.

## 12. Suggested route-state components

Keep these simple and local at first:

```text
src/pages/RouteState.tsx
  RouteLoading
  RouteError
  RouteEmpty
```

Pseudocode:

```tsx
export function RouteError({ title, error, onRetry }: RouteErrorProps) {
  return (
    <Panel title={title}>
      <AppEmptyState
        icon="warning"
        title="Something went wrong"
        description={formatRtkError(error)}
        action={<Button onClick={onRetry}>Try again</Button>}
      />
    </Panel>
  );
}
```

If these become visually important, add Storybook stories and a visual guard. Otherwise keep them plain and functional.

## 13. Backend response contract notes

Some backend response shapes are currently hand-written maps. That is acceptable, but the frontend needs stable names. If the implementation discovers inconsistencies, prefer one of these resolutions:

1. Normalize in frontend when the backend shape is intentional.
2. Change backend response shape when the backend shape is accidental or incomplete.
3. Add protobuf messages and generated TypeScript if the contract is important enough to stabilize schema-first.

Examples of likely contract questions:

- Should `GET /api/app/shows` return `ShowList` or `AppShowList`?
- Should staff bookings return protobuf `SubmissionList` instead of `{ submissions: ... }`?
- Should calendar return a unified event list or separate holds/blocked arrays?
- Should Discord mappings be a first-class endpoint or derived from settings?
- Should `respondError` return structured error codes that frontend can branch on?

Record each decision in the diary and changelog.

## 14. Testing and validation checklist

Run these after each coherent batch:

```bash
cd web
pnpm --filter pyxis-app typecheck
```

If backend code changes:

```bash
go test ./... ./pkg/...
```

If route behavior changes:

```bash
# Start backend according to the repo's current run instructions.
# Start Storybook for component/route stories.
tmux new-session -d -s pyxis-app-storybook \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-app storybook'
```

Use browser/Playwright or curl to verify the backend endpoints:

```bash
curl -i http://localhost:8080/health
curl -i http://localhost:8080/api/app/session
curl -i --cookie "session=..." http://localhost:8080/api/app/shows
```

Use visual guards only after data is controlled and comparable. If live backend data differs from prototype seed data, validate visuals in Storybook with MSW fixtures rather than live route data.

## 15. Implementation sequence for a new intern

Follow this sequence. Do not skip ahead to mutations before the query normalization is working.

### Step A: Inventory and confirm contracts

Run:

```bash
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/scripts/01-inventory-app-api.py
```

Then open:

```text
pkg/server/server.go
pkg/server/app.go
web/packages/pyxis-app/src/api/appApi.ts
web/packages/pyxis-app/src/api/endpoints.ts
web/packages/pyxis-types/src/app.ts
```

Write down any drift in the diary.

### Step B: Add backend raw types and normalizers

Create:

```text
web/packages/pyxis-app/src/api/backendTypes.ts
web/packages/pyxis-app/src/api/normalizers.ts
```

Add normalizers for:

```text
shows
bookings
artists
calendar
attendance
audit log
settings -> discord mappings
```

### Step C: Update RTK Query queries

Use `transformResponse` everywhere the backend returns a wrapper. Remove seed-data assumptions from the API layer.

### Step D: Update MSW handlers

MSW should mimic backend wrapper responses, not the normalized app arrays. This catches normalization bugs before the app hits the real backend.

### Step E: Refactor pages one at a time

Start with Shows or Bookings because they have strong visual and organism coverage. Avoid a giant `Pages.tsx` rewrite in one commit.

### Step F: Add mutations

Wire one mutation cluster at a time:

```text
bookings approve/decline
shows create/update/cancel/archive
calendar hold/block create/delete
attendance upsert
settings update
artist update
logout/session
```

### Step G: Validate visually and behaviorally

For each route cluster:

1. `pnpm --filter pyxis-app typecheck`
2. Storybook smoke for affected organisms/pages
3. focused visual guard if visual-spec target exists
4. diary/changelog update
5. focused commit

## 16. Common mistakes to avoid

- Do not keep `const { data = seedData } = useQuery()` in live route components. It hides backend failures.
- Do not make organisms call RTK Query hooks just because they need data. Pass data down from pages.
- Do not force the current shared `Table` API into app tables if it flattens domain row molecules. Keep the Table compound API as a separate design task.
- Do not tune CSS while changing backend data shapes. First normalize data and preserve existing fixture visuals.
- Do not assume `/api/app/discord` exists. It currently does not.
- Do not forget credentials/cookies for authenticated endpoints.
- Do not change Storybook story IDs without updating visual specs and regenerating JS mirrors.

## 17. Definition of done

This ticket is done when:

- `appApi.ts` has backend-accurate query and mutation endpoints.
- Backend wrapper responses are normalized in the API layer.
- Live routes no longer silently fall back to prototype seed data.
- Pages handle loading/error/empty/ready states explicitly.
- Main user actions dispatch RTK mutations and invalidate the right tags.
- Discord mapping is either derived from settings or backed by a real endpoint.
- MSW fixtures match backend response envelopes.
- Typecheck passes.
- Focused visual guards pass or have documented accepted differences.
- The diary records every contract mismatch and design decision.

## 18. Quick reference: commands

```bash
# Frontend typecheck
cd web && pnpm --filter pyxis-app typecheck

# Inventory current route/API drift
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/scripts/01-inventory-app-api.py

# Restart Storybook
tmux kill-session -t pyxis-app-storybook 2>/dev/null || true
tmux new-session -d -s pyxis-app-storybook \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-app storybook'

# Regenerate visual spec mirrors after spec edits
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py

# Example visual guard
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page bookings-queue-panel --summary \
  --outDir /tmp/pyxis-rtk-bookings-queue \
  --output json
```
