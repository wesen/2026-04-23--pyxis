---
Title: User Site RTK Query and MSW Storybook Implementation Guide
Ticket: PYXIS-USER-SITE-REAL-RTK-MSW
Status: active
Topics:
    - frontend
    - rtk-query
    - storybook
    - msw
    - protobuf
    - api-integration
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: pkg/server/server.go
      Note: Backend public route registry.
    - Path: proto/pyxis/v1/show.proto
      Note: Source of truth for public API protobuf messages.
    - Path: web/packages/pyxis-components/src/mocks/handlers.ts
      Note: Shared public MSW handlers; currently drift from protobuf wrapper response shapes.
    - Path: web/packages/pyxis-user-site/src/App.tsx
      Note: Public site routing
    - Path: web/packages/pyxis-user-site/src/api/hooks.ts
      Note: Compatibility wrappers around generated RTK Query hooks.
    - Path: web/packages/pyxis-user-site/src/api/publicApi.ts
      Note: Canonical public RTK Query slice using generated protobuf schemas.
    - Path: web/packages/pyxis-user-site/src/pages/Archive.tsx
      Note: Archive query page with missing explicit error state.
    - Path: web/packages/pyxis-user-site/src/pages/Book.tsx
      Note: Public booking mutation page with missing mutation error UI.
    - Path: web/packages/pyxis-user-site/src/pages/ShowDetail.tsx
      Note: Route-param detail query pattern.
    - Path: web/packages/pyxis-user-site/src/pages/Shows.tsx
      Note: Good public page loading/error/query pattern.
    - Path: web/packages/pyxis-user-site/stories/PublicPages.stories.tsx
      Note: Best current full-page Storybook harness using real pages and RTK Query.
ExternalSources: []
Summary: Exhaustive plan for starting real API wiring on the unauthenticated Pyxis public user site, using RTK Query, protobuf-generated shapes, Vite proxy, and deterministic MSW Storybook fixtures.
LastUpdated: 2026-04-26T13:40:00-04:00
WhatFor: Use this guide to implement public site real-data wiring first, before the authenticated staff app, and to align Storybook/MSW fixtures with the protobuf-backed Go API contract.
WhenToUse: Before implementing public-site RTK Query/MSW work, reviewing public-site API shape drift, or onboarding an intern to the Pyxis public frontend data layer.
---


# User Site RTK Query and MSW Storybook Implementation Guide

## 1. Executive Summary

The Pyxis public user site is the best place to start real application wiring because it does not require staff authentication. Unlike the staff app, its pages already mostly follow the right RTK Query pattern: `Shows.tsx` renders explicit loading and error states, `ShowDetail.tsx` reads route params and queries by ID, and `Book.tsx` submits booking data through a mutation. The remaining work is to make the runtime API use a Vite proxy, fix Storybook/MSW so it returns protobuf-shaped wrapper responses, remove stale compatibility types, and validate that all page stories exercise real RTK Query hooks without a live backend.

The largest gap is **not** the runtime page code; it is the mock/story layer. The public RTK Query slice expects protobuf list-wrapper messages such as `ShowList`, `ArchivedShowList`, and `BookingConfirmation` with camelCase JSON fields. The current shared MSW handlers in `pyxis-components/src/mocks/handlers.ts` still return raw arrays for `/api/public/shows` and `/api/public/archive`, and several user-site stories use old `msw` object descriptors with snake_case fields such as `submission_id` and `total_shows`. That shape no longer matches `fromJson(ShowListSchema, response)` and should be fixed before relying on Storybook as a realistic integration harness.

Recommended approach:

1. Use Vite proxy for `/api`, `/auth`, and `/flyers` so browser dev requests are same-origin and do not need backend CORS.
2. Change the public RTK Query default base URL from `http://localhost:8080` to `''`.
3. Make MSW handlers return the exact protobuf-backed JSON envelopes that the Go backend returns.
4. Keep page stories using real pages and real RTK Query hooks; MSW intercepts network requests.
5. Add a public fixture scraping script that can capture seeded backend responses and refresh MSW data.
6. Clean up compatibility exports (`api/types.ts`, legacy public `LineupEntry`) only after verifying no consumers depend on them.

## 2. Scope and Goals

### 2.1 Goals

This ticket is specifically about the **public user site** in `web/packages/pyxis-user-site` and its shared mock layer in `web/packages/pyxis-components`.

Goals:

- Make the public site run against the Go backend via Vite proxy.
- Keep public site runtime routes unauthenticated.
- Make `publicApi.ts` use relative `/api/...` by default.
- Align Storybook MSW handlers with protobuf response envelopes.
- Ensure `Shows`, `ShowDetail`, `Archive`, and `Book` page stories exercise real RTK Query hooks.
- Identify and document gaps between public and staff data structures.
- Add a script to scrape public backend responses from seeded data.

### 2.2 Non-goals

- Do not implement staff-authenticated routes in this ticket.
- Do not make Storybook depend on a live backend.
- Do not introduce a second type system for public site data.
- Do not add backend CORS just for Vite development unless a non-Vite consumer requires it.

## 3. Current-State Architecture

### 3.1 Runtime app shell and routing

`web/packages/pyxis-user-site/src/App.tsx` is already structured like a real app. It wraps the site in Redux `Provider`, `ErrorBoundary`, and `BrowserRouter` on lines 17-77. Routes are nested under `Layout` and lazy-loaded with `Suspense`:

```tsx
<Route path="/" element={<Layout />}>
  <Route index element={<Suspense fallback={<PageLoader />}><Shows /></Suspense>} />
  <Route path="shows/:id" element={<Suspense fallback={<PageLoader />}><ShowDetail /></Suspense>} />
  <Route path="archive" element={<Suspense fallback={<PageLoader />}><Archive /></Suspense>} />
  <Route path="book" element={<Suspense fallback={<PageLoader />}><Book /></Suspense>} />
</Route>
```

This is already better organized than the staff app page file. It gives a clean place for route-level behavior and code splitting.

### 3.2 Redux store and RTK Query

`web/packages/pyxis-user-site/src/store.ts` registers `publicApi.reducer` under `publicApi.reducerPath` and adds `publicApi.middleware` to the store. It also calls `setupListeners(store.dispatch)`, which enables refetch-on-focus/reconnect behavior if configured later.

This means the user site is already ready for RTK Query from a store perspective. No new state library is needed.

### 3.3 Public RTK Query slice

`web/packages/pyxis-user-site/src/api/publicApi.ts` defines the canonical public API client. It currently uses `fromJson` and generated protobuf schemas:

- `getUpcomingShows` decodes `ShowListSchema` and returns `list.shows` (`publicApi.ts:30-35`).
- `getShow` decodes `ShowSchema` (`publicApi.ts:45-48`).
- `getArchive` decodes `ArchivedShowListSchema` (`publicApi.ts:51-57`).
- `getArchiveStats` decodes `ArchiveStatsSchema` (`publicApi.ts:60-64`).
- `submitBooking` decodes `BookingConfirmationSchema` (`publicApi.ts:67-74`).

This is exactly the right direction. The main flaw is line 17:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
```

For Vite-proxy development, this should default to `''` so requests go to the Vite origin and are proxied.

### 3.4 Compatibility hooks

`web/packages/pyxis-user-site/src/api/hooks.ts` wraps generated RTK Query hooks with legacy names such as `useUpcomingShows`, `useShow`, `useArchive`, `useArchiveStats`, and `useSubmitBooking`. The comments on lines 10-15 explicitly say these preserve old handwritten React Query hook names.

This is acceptable as a temporary migration layer. However, it should be treated as a compatibility shim, not the long-term canonical API. Interns should avoid adding new wrappers unless they reduce page churn.

### 3.5 Page-level data wiring

The public pages are mostly real-data ready:

- `Shows.tsx` calls `useUpcomingShows()` and handles `isLoading`, `isError`, and empty states (`Shows.tsx:7-23`).
- `ShowDetail.tsx` reads `id` from `useParams()`, converts it to a number, calls `useShow()`, and renders loading/not-found states (`ShowDetail.tsx:14-21`).
- `Book.tsx` calls `useSubmitBooking()`, awaits `mutateAsync`, and navigates to `/book/success` (`Book.tsx:13-20`).
- `Archive.tsx` calls `useArchive(search)` and `useArchiveStats()` (`Archive.tsx:18-22`).

Gaps:

- `Archive.tsx` has no explicit error state for archive list or stats.
- `Book.tsx` does not handle mutation errors; failed submissions will throw from `mutateAsync` with no user-visible error.
- `Shows.tsx` maps `ShowGrid` click events by matching `artist` and `date` because `ShowGrid` uses a smaller display type. This is workable but brittle.

### 3.6 Storybook and MSW

`web/packages/pyxis-user-site/.storybook/preview.tsx` initializes `msw-storybook-addon` and wraps stories in a Redux `Provider`, but unlike the staff app it does **not** wrap all stories in a router. Page-route stories that need routing define their own `MemoryRouter` wrapper in `stories/PublicPages.stories.tsx`.

The public page stories are inconsistent:

- `PublicPages.stories.tsx` imports `handlers` from `pyxis-components/mocks/handlers` and uses real pages + RTK Query + MemoryRouter.
- `Shows.stories.tsx`, `Archive.stories.tsx`, `Book.stories.tsx`, and `ShowDetail.stories.tsx` use old-style MSW parameter descriptors like `{ type: 'rest', method: 'get', url, sts, body }` instead of `http.get(...)` handlers from MSW v2.
- Some story responses use old shapes: raw arrays, snake_case `submission_id`, and snake_case `total_shows`.

This is the main area requiring cleanup.

### 3.7 Shared mock handlers in pyxis-components

`web/packages/pyxis-components/src/mocks/handlers.ts` defines `seedShows`, `seedArchive`, `seedStats`, and MSW `handlers`. The seed data is now created with protobuf `create(ShowSchema, ...)` and `ShowStatus.CONFIRMED`, which is good.

However, the response envelopes do not match the current Go/protobuf API contract:

```ts
http.get('*/api/public/shows', () => {
  return HttpResponse.json(seedShows); // should be { shows: seedShows }
});

http.get('*/api/public/archive', () => {
  return HttpResponse.json(seedArchive); // should be { shows: seedArchive }
});
```

This is a serious mismatch because `publicApi.ts` expects `ShowListSchema` and `ArchivedShowListSchema`, not raw arrays.

## 4. Backend API Contract

The public backend routes are registered in `pkg/server/server.go` lines 75-80:

| Route | Purpose | Auth |
| --- | --- | --- |
| `GET /api/public/shows` | Upcoming public shows | None |
| `GET /api/public/shows/{id}` | Single public show detail | None |
| `GET /api/public/archive` | Archived shows, optional search | None |
| `GET /api/public/archive/stats` | Archive aggregate stats | None |
| `POST /api/public/submissions` | Booking request form submission | None |

The protobuf source of truth is `proto/pyxis/v1/show.proto`. Public responses should be:

```protobuf
message ShowList {
  repeated Show shows = 1;
}

message ArchivedShowList {
  repeated ArchivedShow shows = 1;
}

message ArchiveStats {
  int32 total_shows = 1;
  int32 total_attendance = 2;
  int32 years_running = 3;
  int32 unique_artists = 4;
}

message BookingConfirmation {
  bool success = 1;
  int32 submission_id = 2;
}
```

Because Go uses `protojson.Marshal`, the JSON emitted on the wire is camelCase:

```json
{
  "shows": [
    { "id": 42, "doorsTime": "8:00 PM", "status": "confirmed" }
  ]
}
```

Not:

```json
[
  { "id": 42, "doorsTime": "8:00 PM", "status": 1 }
]
```

And not:

```json
{ "total_shows": 247 }
```

This is where several Storybook handlers currently drift.

## 5. Gap Analysis

### 5.1 Runtime gaps

The public runtime is close. Required changes:

- Add Vite proxy to `pyxis-user-site/vite.config.ts`.
- Default `API_BASE_URL` to `''` in `publicApi.ts`.
- Add error handling in `Archive.tsx` for archive and stats failures.
- Add mutation error UI in `Book.tsx`.
- Consider improving `ShowGrid` click handling so the clicked item carries `id` rather than matching by artist/date.

### 5.2 Storybook gaps

The Storybook layer has more significant gaps:

- Shared MSW public handlers return raw arrays instead of protobuf list wrappers.
- Story files use old `type: 'rest'` descriptor objects, which are not the canonical MSW v2 `http.get/http.post` handlers used elsewhere.
- Story response fields use snake_case in some places.
- Loading stories model “infinite loading” with missing bodies; better to use delayed handlers with `delay('infinite')` or a never-resolving response pattern supported by MSW v2.
- Error stories should return `ErrorResponse` shape: `{ error: { code, message } }`.

### 5.3 Type/protobuf gaps

`pyxis-types/src/index.ts` exports generated protobuf types as the single source of truth, but it still exports some compatibility/frontend-only types from `public.ts` and `app.ts`:

- `LineupEntry` in `public.ts` still uses snake_case `start_time`.
- `ApiError` is hand-written but matches the proto `ErrorResponse` JSON shape structurally.
- `AgeRestriction` remains a string union.

The public site should avoid these legacy types when generated protobuf types exist. `LineupEntry` should be replaced with `Show_LineupEntry` from generated code wherever possible.

### 5.4 Public vs app overlap

Ideally the public site and staff app overlap on these generated messages:

- `Show`
- `ShowList`
- `ArchivedShow`
- `ArchivedShowList`
- `ArchiveStats`
- `BookingFormData`
- `BookingConfirmation`
- `ErrorResponse`

The staff app additionally uses:

- `AppShow`
- `Submission`
- `Artist`
- `Calendar*`
- `AttendanceLog`
- `AuditLogEntry`
- `Settings`

The user site should not define parallel versions of public `Show`, `ArchiveStats`, or booking payloads. If a component needs a smaller display shape (e.g. `ShowTileShow`), that should be a local UI prop type derived at the component boundary, not an API type.

## 6. Proposed Solution

## 6.1 Use Vite proxy for public runtime

Update `web/packages/pyxis-user-site/vite.config.ts`:

```ts
server: {
  port: 3000,
  open: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/auth': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
    '/flyers': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
},
```

Then update `publicApi.ts`:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
```

The browser will request `http://localhost:3000/api/public/shows`; Vite forwards that to `http://localhost:8080/api/public/shows`. No browser CORS preflight is needed because the browser sees a same-origin request.

## 6.2 Fix MSW handlers to match protobuf response wrappers

Update `pyxis-components/src/mocks/handlers.ts`:

```ts
http.get('*/api/public/shows', () => {
  return HttpResponse.json({ shows: seedShows });
});

http.get('*/api/public/archive', ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const shows = search ? filterArchive(seedArchive, search) : seedArchive;
  return HttpResponse.json({ shows });
});

http.get('*/api/public/archive/stats', () => {
  return HttpResponse.json(seedStats); // already camelCase because create() uses generated type
});

http.post('*/api/public/submissions', async ({ request }) => {
  const body = await request.json();
  if (!body.artistName || !body.links) {
    return HttpResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'artistName and links are required' } },
      { status: 422 },
    );
  }
  return HttpResponse.json({ success: true, submissionId: 999 });
});
```

Important: because `fromJson(BookingConfirmationSchema, ...)` expects camelCase JSON from `protojson`, use `submissionId`, not `submission_id`.

## 6.3 Replace old story-level MSW descriptors

Convert story descriptors like this:

```ts
parameters: {
  msw: {
    handlers: [
      { type: 'rest', method: 'get', url: '/api/public/shows', sts: 200, body: seedShows },
    ],
  },
}
```

into MSW v2 handlers:

```ts
import { http, HttpResponse } from 'msw';

parameters: {
  msw: {
    handlers: [
      http.get('*/api/public/shows', () => HttpResponse.json({ shows: seedShows })),
    ],
  },
}
```

This makes stories use the same handler style as the shared mock module and reduces confusion.

## 6.4 Keep page stories exercising real RTK Query

`stories/PublicPages.stories.tsx` is the best pattern to preserve. It renders full pages inside `Provider`, `MemoryRouter`, `Routes`, and `Layout`, with MSW handlers configured at the story level.

The implementation should make this the canonical public-site story pattern:

```tsx
<Provider store={makeStore()}>
  <MemoryRouter initialEntries={[route]}>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Shows />} />
        <Route path="shows/:id" element={<ShowDetail />} />
        <Route path="archive" element={<Archive />} />
        <Route path="book" element={<Book />} />
      </Route>
    </Routes>
  </MemoryRouter>
</Provider>
```

Low-level component stories should remain prop-driven.

## 6.5 Add better page-level error and submission states

`Archive.tsx` should handle errors separately for list and stats:

```tsx
const archive = useArchive(search || undefined);
const stats = useArchiveStats();

if (archive.isError) return <ArchiveError error={archive.error} />;
```

`Book.tsx` should catch mutation failures:

```tsx
const [formError, setFormError] = useState<string | null>(null);

const handleSubmit = async (data: BookingFormData) => {
  setFormError(null);
  try {
    await submit.mutateAsync(data);
    navigate('/book/success');
  } catch (error) {
    setFormError(getApiErrorMessage(error));
  }
};
```

If `BookingForm` cannot display an error prop yet, add one or render a page-level alert above the form.

## 7. Fixture Scraping Script

A scraper is useful for the public site because no auth is needed. It can fetch the real Go backend after running migrations and seed data, then write a JSON fixture file for MSW development.

The script should fetch:

- `GET /api/public/shows`
- `GET /api/public/archive`
- `GET /api/public/archive/stats`
- `GET /api/public/shows/{id}` for the first few shows

It should output one JSON document:

```json
{
  "metadata": { "generatedAt": "...", "baseUrl": "http://localhost:8080" },
  "responses": {
    "shows": { "status": 200, "body": { "shows": [] } },
    "archive": { "status": 200, "body": { "shows": [] } },
    "archiveStats": { "status": 200, "body": { "totalShows": 0 } },
    "showDetails": [{ "id": 42, "status": 200, "body": { ... } }]
  }
}
```

The generated fixture can either remain in the ticket `sources/` directory for review or be copied into `pyxis-components/src/mocks/fixtures/` after approval.

## 8. Implementation Phases

### Phase 1: Proxy and runtime API base URL

- Update user-site Vite proxy.
- Update `publicApi.ts` base URL to `''`.
- Run Go backend on `:8080`.
- Run user site on Vite `:3000`.
- Verify network requests go to `localhost:3000/api/...` and return backend data.

### Phase 2: MSW response envelope correction

- Fix `pyxis-components/src/mocks/handlers.ts` to return `{ shows: seedShows }` and `{ shows: seedArchive }`.
- Ensure booking submission mock returns `{ success: true, submissionId: 999 }`.
- Ensure error responses match `{ error: { code, message } }`.
- Build `pyxis-components` and `pyxis-user-site`.

### Phase 3: Story cleanup

- Replace `type: 'rest'` story descriptors with `http.get/http.post` handlers.
- Make `PublicPages.stories.tsx` the canonical page story entrypoint.
- Add explicit loading/error/empty stories with MSW v2 handlers.
- Remove or update stale individual stories if they duplicate `PublicPages.stories.tsx` incorrectly.

### Phase 4: Runtime page polish

- Add error state to `Archive.tsx`.
- Add mutation error display to `Book.tsx`.
- Consider changing `ShowGrid` click API so it preserves `show.id`.
- Validate public routes manually.

### Phase 5: Type cleanup

- Audit imports from `web/packages/pyxis-user-site/src/api/types.ts`.
- Remove compatibility `api/types.ts` if unused.
- Replace legacy `LineupEntry` with generated `Show_LineupEntry` where practical.
- Keep frontend-only display types local to component packages.

### Phase 6: Fixture scraping automation

- Add and run public scraper.
- Store output under ticket `sources/`.
- Decide whether to commit generated fixtures into the source package.
- Document refresh workflow.

## 9. Testing and Validation

### 9.1 Build checks

```bash
cd web/packages/pyxis-types && pnpm build
cd ../pyxis-components && pnpm build
cd ../pyxis-user-site && pnpm build
cd ../../ && pnpm build
```

### 9.2 Runtime checks

```bash
docker compose up -d
go run ./cmd/pyxis migrate up
go run ./cmd/pyxis seed
go run ./cmd/pyxis serve --bind :8080
```

Then:

```bash
cd web/packages/pyxis-user-site
pnpm dev
```

Check:

- `/` renders upcoming shows from Go.
- `/shows/42` renders detail data from Go.
- `/archive` renders archive data and stats.
- `/book` submits a booking and navigates to `/book/success`.

### 9.3 Storybook checks

```bash
cd web/packages/pyxis-user-site
pnpm storybook
```

Check with Go backend stopped:

- Public page stories still render.
- MSW intercepts `/api/public/...` requests.
- Empty/error/loading stories render correct UI.
- No console errors from `fromJson` schema mismatch.

### 9.4 Schema mismatch checks

A quick way to catch old raw-array handlers is to run Storybook or tests and look for decode errors from `fromJson(ShowListSchema, array)`. Any handler for a list endpoint must return the wrapper object.

## 10. Risks and Open Questions

1. **Storybook MSW descriptor compatibility:** Some existing stories use object descriptors instead of `http.get` handlers. Confirm whether the current `msw-storybook-addon` version supports those descriptors. Prefer converting to MSW v2 handlers either way.
2. **Archive error UX:** `Archive.tsx` currently renders empty text for no results, but not an API failure state. Add a clear failure state.
3. **BookingForm error surface:** The form may need an `error` prop or page-level alert to show failed submissions.
4. **ShowGrid click identity:** Matching by artist/date is brittle. A future component API should preserve `id` or accept generated `Show` directly.
5. **Generated fixture location:** Decide whether scraped fixtures are source code, test artifacts, or ticket artifacts.

## 11. References

### Public frontend files

- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/App.tsx` — public site routing and providers
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/store.ts` — Redux store with `publicApi`
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/api/publicApi.ts` — canonical public RTK Query slice
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/api/hooks.ts` — compatibility wrappers around RTK Query hooks
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/api/endpoints.ts` — public endpoint constants
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/Shows.tsx` — upcoming shows query page
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/ShowDetail.tsx` — route-param detail query page
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/Archive.tsx` — archive query page with partial error gap
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/Book.tsx` — public booking mutation page
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/.storybook/preview.tsx` — Storybook Redux/MSW setup
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/stories/PublicPages.stories.tsx` — best existing page-story pattern

### Shared files

- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/mocks/handlers.ts` — shared public MSW handlers and seed data
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-types/src/index.ts` — generated protobuf exports and remaining compatibility exports
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-types/src/public.ts` — remaining legacy public compatibility types

### Backend files

- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/server.go` — route registry
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/public.go` — public API handlers and proto JSON responses
- `/home/manuel/code/wesen/2026-04-23--pyxis/proto/pyxis/v1/show.proto` — protobuf API contract
