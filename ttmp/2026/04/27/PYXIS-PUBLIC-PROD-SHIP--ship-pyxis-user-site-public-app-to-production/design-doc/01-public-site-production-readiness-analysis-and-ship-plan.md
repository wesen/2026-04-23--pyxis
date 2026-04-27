---
Title: Public Site Production Readiness Analysis and Ship Plan
Ticket: PYXIS-PUBLIC-PROD-SHIP
Status: active
Topics:
    - frontend
    - production
    - public-site
    - release-readiness
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: proto/pyxis/v1/show.proto
      Note: canonical public API schema
    - Path: web/packages/pyxis-user-site/src/App.tsx
      Note: public SPA route tree and lazy-loaded page surfaces
    - Path: web/packages/pyxis-user-site/src/api/endpoints.ts
      Note: public endpoint path contract
    - Path: web/packages/pyxis-user-site/src/api/publicApi.ts
      Note: RTK Query public API layer and protobuf JSON decode/encode
    - Path: web/packages/pyxis-user-site/src/components/Seo.tsx
      Note: SEO helper to mount before launch
    - Path: web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
      Note: Archive container/view split and search/stats/error states
    - Path: web/packages/pyxis-user-site/src/pages/BookPage/Page.tsx
      Note: Booking form submission flow and error handling
    - Path: web/packages/pyxis-user-site/src/pages/ShowDetailPage/Page.tsx
      Note: Show detail data loading not-found flyer and lineup behavior
    - Path: web/packages/pyxis-user-site/src/pages/ShowsPage/Page.tsx
      Note: Shows page loading empty error and grid behavior
    - Path: web/packages/pyxis-user-site/vite.config.ts
      Note: build settings and development proxy evidence
ExternalSources: []
Summary: Production readiness analysis and implementation guide for shipping the public pyxis-user-site app.
LastUpdated: 2026-04-27T19:35:00-04:00
WhatFor: Use this to turn the visually tuned public site into a production launch with real data, routing, form handling, SEO, accessibility, deployment, and validation gates.
WhenToUse: Use before assigning or implementing public-site launch work, and as the onboarding guide for an intern or developer joining the production-readiness effort.
---











# Public Site Production Readiness Analysis and Ship Plan

## 1. Executive summary

The public Pyxis site is visually close enough for a production launch track, but it is not production-ready merely because it builds and looks correct in Storybook. A production launch needs a different kind of confidence. The app must fetch real data from deployable API endpoints, handle empty and error states, submit booking inquiries safely, support direct URL refreshes, expose correct SEO metadata, survive mobile/browser smoke tests, and ship through a repeatable deployment pipeline.

The current frontend has a solid foundation. The route tree is clear and lazy-loaded in `web/packages/pyxis-user-site/src/App.tsx`. The API layer is centralized in `web/packages/pyxis-user-site/src/api/publicApi.ts` and `web/packages/pyxis-user-site/src/api/endpoints.ts`. The major public pages already handle important states: Shows has loading, empty, and error branches; Show Detail has loading and not-found branches; Archive has a prop-fed view with loading/error/empty states; Book catches submission errors and navigates to a success page. The visual tuning work also reorganized pages into page-owned folders with colocated stories, which makes ongoing validation easier.

The remaining work is therefore not a broad rewrite. It is a launch-hardening effort with explicit gates:

- Confirm and stabilize the public API contract.
- Configure production environment variables and remove runtime development assumptions.
- Harden booking submission against invalid input, duplicate submits, abuse, and operational failure.
- Add page-level SEO/head management that is actually mounted by routes.
- Verify production routing fallback for every SPA route.
- Add mobile, accessibility, and browser smoke checks.
- Decide and document deployment topology, cache policy, and rollback procedure.
- Run final build and visual checks against production-intent data.

This document is written for a new intern or developer. It explains how the current site works, what must be true before production, how to implement the missing pieces, and how to validate the result.

## 2. Scope and non-scope

### 2.1 In scope

This ticket is about the public-facing site package:

```text
web/packages/pyxis-user-site
```

The production surface includes:

- `/` and `/shows`: upcoming public shows.
- `/shows/:id`: public show detail.
- `/archive`: past show archive.
- `/book`: booking/inquiry form.
- `/book/success`: booking success page.
- `/about`: public about page.
- `*`: not-found route.

The supporting shared packages are in scope only where they affect public-site shipping:

```text
web/packages/pyxis-components
web/packages/pyxis-types
proto/pyxis/v1/show.proto
```

### 2.2 Out of scope

The internal admin app is not the target of this ticket:

```text
web/packages/pyxis-app
```

The visual review site is also not the target of this ticket. Another colleague is handling the full-featured review-site product. This ticket may depend on visual validation output, but it does not implement the review app.

## 3. Current architecture: how the public app works today

### 3.1 Route shell and lazy-loaded pages

The public app is a Vite React SPA. The app entry renders `App` through `ReactDOM.createRoot` in `web/packages/pyxis-user-site/src/main.tsx`. The route tree lives in `web/packages/pyxis-user-site/src/App.tsx`.

Evidence:

- `App.tsx` imports `BrowserRouter`, `Routes`, and `Route` from `react-router-dom` at lines 1-3.
- The public pages are lazy-loaded as separate chunks at lines 9-15.
- The route tree defines `/`, `/shows`, `/shows/:id`, `/archive`, `/book`, `/book/success`, `/about`, and `*` at lines 23-71.
- A `PageLoader` is used as a Suspense fallback at lines 80-109.

The key structure is:

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Shows />} />
      <Route path="shows" element={<Shows />} />
      <Route path="shows/:id" element={<ShowDetail />} />
      <Route path="archive" element={<Archive />} />
      <Route path="book" element={<Book />} />
      <Route path="book/success" element={<BookSuccess />} />
      <Route path="about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
</BrowserRouter>
```

This is a standard client-side routing model. The production host must therefore serve `index.html` for every non-asset route. If `/shows/123` is requested directly and the server returns a 404 before the SPA loads, the app is not production-ready.

### 3.2 API layer

The public API layer is centralized in `web/packages/pyxis-user-site/src/api/publicApi.ts`. It uses RTK Query:

- `createApi` and `fetchBaseQuery` are imported at line 1.
- `API_BASE_URL` comes from `import.meta.env.VITE_API_URL ?? ''` at line 19.
- `fetchBaseQuery` uses that base URL at lines 23-24.
- The API exports queries for shows, show detail, archive, archive stats, and booking submission at lines 31-77.

The endpoint paths are centralized in `web/packages/pyxis-user-site/src/api/endpoints.ts`:

```ts
shows:        '/api/public/shows'
show:         (id: number) => `/api/public/shows/${id}`
showFlyer:    (id: number) => `/api/public/shows/${id}/flyer`
archive:      '/api/public/archive'
archiveStats: '/api/public/archive/stats'
submissions:  '/api/public/submissions'
```

The important production implication is that `VITE_API_URL` controls whether requests are same-origin or cross-origin. If `VITE_API_URL` is empty, the browser calls `/api/public/...` on the same host as the frontend. If it is set, the browser calls the configured API host.

### 3.3 Schema-first payloads

The API layer decodes JSON using generated protobuf schemas from `pyxis-types`:

- `ShowListSchema`, `ShowSchema`, `ArchivedShowListSchema`, `ArchiveStatsSchema`, `BookingConfirmationSchema`, and `BookingFormDataSchema` are imported in `publicApi.ts` lines 2-16.
- `fromJson` decodes API responses at lines 34-36, 49, 58, 64, and 75.
- `toJson(BookingFormDataSchema, body)` encodes booking submissions at line 73.

The canonical schema starts in `proto/pyxis/v1/show.proto`:

- `Show` is defined at lines 26-55.
- `ArchivedShow` is defined at lines 74-80.
- `ArchiveStats` is defined at lines 82-87.
- `BookingFormData` is defined at lines 89-97.
- `BookingConfirmation` is defined at lines 107-110.
- `Submission` is defined at lines 112-127.

This gives the launch effort a useful contract. The frontend should not invent production-only JSON shapes. If the public API needs new fields, change the proto/schema, regenerate types, update fixtures, and then update the UI.

### 3.4 Page state handling

The public pages already have several production-friendly state branches.

Shows:

- Fetches upcoming shows through `useUpcomingShows()` in `ShowsPage/Page.tsx` lines 7-9.
- Shows a skeleton while loading at line 11 and lines 42-50.
- Shows an error branch at line 12 and lines 53-61.
- Shows an empty state when `shows.length === 0` at lines 21-24.
- Renders the show grid when there is data at lines 25-31.

Show Detail:

- Reads `id` from the route params at lines 15-18.
- Fetches through `useShow` at line 19.
- Shows a skeleton at line 22 and lines 91-99.
- Shows a not-found branch at line 23 and lines 80-88.
- Renders flyer, meta strip, lineup, and safety note at lines 36-72.

Archive:

- Uses `useArchive` and `useArchiveStats` at lines 31-34.
- Splits container data fetching from `ArchivePageView` at lines 31-59.
- Shows stats when available at lines 69-73.
- Shows stats warnings, archive error, year groups, or empty state at lines 82-105.

Book:

- Uses `useSubmitBooking` at lines 13-16.
- On submit, calls `submit.mutateAsync(data)` and navigates to `/book/success` at lines 18-23.
- Catches and displays submission errors at lines 23-25 and 37-41.
- Passes `isSubmitting={submit.isPending}` to `BookingForm` at line 45.

These branches are strong starting points. The production work is to validate them against real API behavior, improve the weak spots, and add missing concerns such as SEO and spam prevention.

### 3.5 SEO component exists but is not wired into route pages

`web/packages/pyxis-user-site/src/components/Seo.tsx` defines a `Seo` component:

- Props are declared at lines 7-12.
- Site defaults are declared at lines 14-18.
- It renders `<title>`, description, Open Graph, Twitter, and icon tags at lines 28-51.

However, repository search found the component definition but no `<Seo ... />` usage in public page source. This means the current route pages rely mostly on static metadata in `index.html`, not per-route metadata. For production, each route should set at least title and description, and show detail should ideally set show-specific metadata if the deployment model can support it.

### 3.6 Development server proxy and production environment

`web/packages/pyxis-user-site/vite.config.ts` configures the dev server:

- Source aliasing for `pyxis-components` is at lines 7-12.
- Build output and sourcemaps are configured at lines 14-17.
- The dev server proxies `/api`, `/auth`, and `/flyers` to `http://localhost:8080` at lines 18-25.

These localhost proxies are fine for development. They are not production runtime configuration. Production must either:

1. serve the API from the same origin as the frontend, or
2. set `VITE_API_URL` to the production API origin and configure CORS properly.

## 4. Production readiness gap analysis

### 4.1 Hard blockers

The public app should not be shipped until these are resolved or explicitly accepted by the release owner.

#### Blocker 1: Production API contract must be confirmed

The frontend expects these endpoints:

```text
GET  /api/public/shows
GET  /api/public/shows/:id
GET  /api/public/archive?search=...
GET  /api/public/archive/stats
POST /api/public/submissions
```

Each endpoint must return JSON compatible with the generated protobuf JSON mapping used by `fromJson`. The booking endpoint must accept JSON produced by `toJson(BookingFormDataSchema, body)`.

Acceptance criteria:

- Every endpoint works against the production API host.
- Every endpoint returns the expected status codes.
- The frontend can decode every successful response with `fromJson`.
- The frontend handles 404, 400, 429, and 500 responses gracefully.

#### Blocker 2: Booking submission must be abuse-resistant and operationally useful

The booking page accepts public user input. That makes it more sensitive than the read-only pages.

Current frontend evidence:

- The form submits to `POST /api/public/submissions` through RTK Query (`publicApi.ts` lines 69-76).
- The page catches errors and displays a message (`BookPage/Page.tsx` lines 23-25 and 37-41).
- The page passes an `isSubmitting` flag to `BookingForm` (`BookPage/Page.tsx` line 45).

Missing production requirements:

- Server-side validation.
- Duplicate submission prevention.
- Rate limiting or spam mitigation.
- Notification or review workflow for received submissions.
- Confirmed success state and failure state with real backend errors.
- Clear privacy/contact expectations in the form copy.

#### Blocker 3: SPA fallback must be configured

The route tree contains direct client routes for `/shows/:id`, `/archive`, `/book`, `/book/success`, and `/about`. Production hosting must return `index.html` for those paths. This must be tested by refreshing each route directly.

Acceptance criteria:

```text
GET /               -> frontend index
GET /shows          -> frontend index
GET /shows/1        -> frontend index
GET /archive        -> frontend index
GET /book           -> frontend index
GET /book/success   -> frontend index
GET /about          -> frontend index
GET /assets/...     -> actual asset or 404
GET /api/...        -> API, not frontend index
```

#### Blocker 4: Production environment values must be explicit

`VITE_API_URL` defaults to an empty string. That is acceptable only if the API is same-origin. It is dangerous if the deployed frontend is on a static host without an API proxy because calls will silently go to the wrong origin.

Acceptance criteria:

- Production deployment documents whether API is same-origin or cross-origin.
- If cross-origin, `VITE_API_URL` is set at build time.
- If same-origin, the host routes `/api/public/...` to the backend.
- No production runtime code depends on `localhost`, Storybook ports, or MSW.

#### Blocker 5: Mobile smoke pass must be completed

The recent visual parity work was desktop-heavy. A public venue site will be visited heavily on phones. A mobile layout issue on Shows, Show Detail, or Book is a launch blocker if it prevents reading show information or submitting an inquiry.

Acceptance criteria:

- Manually inspect 375px, 768px, 920px, and 1440px widths.
- Verify Shows, Show Detail, Archive, Book, About, Book Success, and Not Found.
- Verify tap targets and form fields on mobile.

### 4.2 Strong recommendations before launch

These are not always launch blockers, but they should be completed unless the release owner deliberately chooses otherwise.

- Mount `Seo` per route and validate head tags.
- Add route-level content titles/descriptions.
- Add Open Graph defaults and verify `og-default.png` exists if referenced.
- Add monitoring/error reporting, or at least confirm console errors are not expected.
- Verify robots.txt and sitemap domains match the production domain.
- Run accessibility smoke tests, including keyboard navigation and form labels.
- Confirm public content is final: dates, prices, age restrictions, address, copy, email/contact path.
- Run a final visual comparison against production-intent data.

## 5. Proposed production architecture

The simplest production architecture is a static frontend plus an API service.

```text
Browser
  │
  ▼
CDN / Static Host / Go server
  ├── /assets/*              -> static built assets
  ├── /favicon.svg           -> static asset
  ├── /robots.txt            -> static asset
  ├── /sitemap.xml           -> static asset
  ├── /shows/*, /book, ...   -> index.html SPA fallback
  └── /api/public/*          -> backend API or reverse proxy
```

There are two viable API deployment models.

### 5.1 Same-origin API model

In this model, the frontend is served from the same origin as the API:

```text
https://pyxis.example.com/shows
https://pyxis.example.com/api/public/shows
```

Frontend configuration:

```text
VITE_API_URL=
```

Pros:

- No CORS complexity.
- Cookies, if ever needed, are simpler.
- Frontend code already defaults to this model.

Cons:

- Static host must support reverse proxying or the backend must serve static assets.
- API and frontend deploys may be more coupled.

### 5.2 Cross-origin API model

In this model, the frontend and API have different origins:

```text
https://pyxis.example.com/shows
https://api.pyxis.example.com/api/public/shows
```

Frontend configuration:

```text
VITE_API_URL=https://api.pyxis.example.com
```

Pros:

- Static frontend can deploy independently.
- API service can have independent scaling/security boundaries.

Cons:

- Requires CORS configuration.
- Requires stricter environment management.
- Cookies/auth become harder if later needed.

### 5.3 Recommendation

For the public site, same-origin is simplest if the existing backend can serve or proxy the Vite build. If the team already has a static-host deployment path, cross-origin is fine, but `VITE_API_URL` must be explicit and tested.

## 6. API contract reference

The frontend’s current API contract is:

```ts
type PublicApi = {
  getUpcomingShows(): Promise<Show[]>;
  getShow(id: number): Promise<Show>;
  getArchive(search?: string): Promise<ArchivedShowList>;
  getArchiveStats(): Promise<ArchiveStats>;
  submitBooking(data: BookingFormData): Promise<BookingConfirmation>;
};
```

HTTP mapping:

```text
GET  /api/public/shows
GET  /api/public/shows/:id
GET  /api/public/archive?search=<query>
GET  /api/public/archive/stats
POST /api/public/submissions
```

Expected schemas are defined by `proto/pyxis/v1/show.proto`:

```proto
message Show {
  int32  id = 1;
  string artist = 2;
  string date = 3;
  string doors_time = 4;
  string start_time = 5;
  string age = 6;
  string price = 7;
  string genre = 8;
  string description = 9;
  repeated LineupEntry lineup = 10;
  string flyer_url = 11;
  ShowStatus status = 12;
}

message BookingFormData {
  string artist_name = 1;
  string genre = 2;
  string preferred_date = 3;
  int32 expected_draw = 4;
  string links = 5;
  string tech_rider = 6;
  string message = 7;
}
```

Production implementation notes:

- Dates should be ISO-like `YYYY-MM-DD` whenever possible. The frontend handles non-ISO date strings in `ShowDetail`, but production should prefer consistent ISO dates.
- Times are currently display strings such as `8:00 PM`. Keep that stable or add structured time fields later.
- `ShowDetail` currently uses `show.price` for the meta strip but hardcodes `ReserveTicketCard price="$10 – $15"`. Before launch, either wire the reserve card to `show.price` or intentionally hide/replace it if ticketing is not implemented.
- `ShowDetail` filters `placehold.co` flyer URLs as mock placeholders. Production data should not use placeholder URLs.

## 7. Page-by-page launch requirements

### 7.1 Shows page

Current behavior:

- Loads upcoming shows from `useUpcomingShows()`.
- Shows loading skeleton.
- Shows error message.
- Shows empty state.
- Navigates to `/shows/:id` on tile click.

Production requirements:

- `GET /api/public/shows` returns only public, confirmed, upcoming shows unless product decides otherwise.
- Shows are sorted by date/time ascending.
- Cancelled or draft shows are excluded or visually marked according to product rules.
- Every show has enough data to render a tile: artist, date, time, age, price, genre/flyer fallback.
- Empty state is acceptable when there are no upcoming shows.

### 7.2 Show detail page

Current behavior:

- Reads numeric `id` from route params.
- Fetches `GET /api/public/shows/:id`.
- Shows skeleton while loading.
- Shows not-found UI if fetch fails or data is missing.
- Renders flyer or poster fallback.
- Renders meta, lineup, and safety note.

Production requirements:

- Non-numeric IDs should not trigger confusing API calls. Today `Number.isFinite(showId)` protects `useShow`, but not-found behavior should be manually verified.
- 404 should show a friendly not-found state.
- `ReserveTicketCard` should use real ticket/door data or be replaced with correct call-to-action behavior.
- Flyer images must have appropriate storage, URLs, caching, and alt text.
- Show-specific SEO should be considered. SPA-only metadata may be insufficient for social sharing.

### 7.3 Archive page

Current behavior:

- Fetches archive list and archive stats separately.
- Uses a prop-fed `ArchivePageView`.
- Supports search as a query parameter to the API.
- Groups shows by year client-side.
- Shows stats error separately from archive error.

Production requirements:

- Archive endpoint should return public archived shows only.
- Search should be debounced if real API latency/load is a concern.
- Dates must be parseable by `new Date(`${date}T00:00:00`)`.
- Empty state must be useful for no results.
- Archive stats must be either reliable or hidden when unavailable.

### 7.4 Book page

Current behavior:

- Renders `BookingForm`.
- Submits through RTK mutation.
- Navigates to success on success.
- Displays error on failure.

Production requirements:

- Server-side validation is required.
- Frontend validation should match server validation but not replace it.
- Add spam mitigation: honeypot, rate limiting, captcha, or moderation controls.
- Disable duplicate submit while pending.
- Confirm notification/review workflow for new submissions.
- Confirm privacy/contact language.

Suggested minimum backend behavior:

```text
POST /api/public/submissions
  201 Created -> { success: true, submissionId: 123 }
  400 Bad Request -> field validation errors
  409 Conflict -> duplicate detected, if applicable
  429 Too Many Requests -> rate limited
  500 -> generic failure, logged server-side
```

### 7.5 About page

Current behavior:

- Static public content assembled from shared components.
- Recently visually tuned into review band.

Production requirements:

- Final copy review.
- Confirm address/email/social/contact information.
- Ensure no placeholder text remains.
- Add route SEO.

### 7.6 Book success and not-found pages

Production requirements:

- Direct refresh on `/book/success` works.
- Success page gives clear next-step expectations.
- Unknown routes show a public not-found page, not a server error.
- Not-found page should set noindex if route-level SEO is implemented.

## 8. Implementation plan

### Phase 1: Launch audit and environment contract

Goal: make hidden assumptions explicit.

Tasks:

1. Decide production domain and API topology.
2. Document `VITE_API_URL` value for production.
3. Search for runtime development assumptions:

   ```bash
   rg "localhost|127\.0\.0\.1|6007|6008|7070|8097|placehold\.co|mockServiceWorker" web/packages/pyxis-user-site web/packages/pyxis-components/src -S
   ```

4. Classify each result as dev-only, story-only, mock-only, or production-risk.
5. Confirm the deployed host can serve SPA fallback routes.

Definition of done:

- The deployment README or ticket states exactly where API requests go.
- No production runtime path depends on localhost or mock workers.
- Direct route refresh strategy is documented.

### Phase 2: API contract validation

Goal: prove the frontend can use production API responses.

Tasks:

1. Create or obtain a production-like API environment.
2. Test each endpoint with curl.
3. Decode representative responses through `pyxis-types` in a small script or frontend smoke run.
4. Verify error status behavior for missing show, invalid booking form, and server failure.
5. Confirm flyer URL behavior.

Pseudocode for a contract smoke script:

```ts
async function assertJson<T>(url: string, schema: GenMessage<T>) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  const json = await response.json();
  return fromJson(schema, json);
}

await assertJson(`${base}/api/public/shows`, ShowListSchema);
await assertJson(`${base}/api/public/archive`, ArchivedShowListSchema);
await assertJson(`${base}/api/public/archive/stats`, ArchiveStatsSchema);
await assertJson(`${base}/api/public/shows/1`, ShowSchema);
```

Definition of done:

- Contract smoke passes for all public read endpoints.
- Booking submission succeeds in a safe staging environment.
- Known error cases render frontend error states.

### Phase 3: Booking form hardening

Goal: make the public write surface safe enough for launch.

Tasks:

1. Confirm required fields and validation rules.
2. Add or verify backend validation.
3. Add frontend validation for user experience.
4. Add spam mitigation.
5. Prevent duplicate submissions.
6. Verify success notification/review workflow.
7. Add logging for failed submissions without leaking details to users.

Suggested frontend submit pseudocode:

```ts
async function handleSubmit(form: BookingFormData) {
  setSubmitError(null);
  if (!clientValidate(form)) {
    setSubmitError('Please fill out the required fields.');
    return;
  }

  try {
    await submit.mutateAsync({ ...form, honeypot: hiddenFieldValue });
    navigate('/book/success');
  } catch (error) {
    if (isRateLimit(error)) setSubmitError('Too many requests. Please try again later.');
    else if (isValidation(error)) setFieldErrors(error.fields);
    else setSubmitError('Something went wrong. Please email us directly.');
  }
}
```

Definition of done:

- A real booking request can be submitted from staging.
- Invalid submission shows a useful message.
- Rapid duplicate submissions do not create multiple records.
- Abuse mitigation is documented.

### Phase 4: SEO and route head metadata

Goal: make public pages presentable when linked and indexed.

Tasks:

1. Mount `Seo` on each route page.
2. Add route-specific title and description.
3. Confirm static defaults in `index.html` are still reasonable.
4. Confirm `robots.txt` and `sitemap.xml` use the production domain.
5. Confirm `og-default.png` exists or change `DEFAULT_IMAGE`.
6. Decide whether show detail needs server-rendered or generated metadata.

Example route usage:

```tsx
export function Shows() {
  return (
    <>
      <Seo title="Upcoming shows" description="Upcoming shows at Pyxis in Providence, RI." />
      <main data-page="shows">...</main>
    </>
  );
}
```

Definition of done:

- Every route sets a useful title.
- Public metadata validates in browser devtools.
- robots/sitemap domain matches the launch domain.

### Phase 5: Mobile, accessibility, and browser smoke

Goal: catch launch-visible issues that typecheck/build cannot catch.

Tasks:

1. Test viewport widths: 375, 768, 920, 1440.
2. Test Chrome, Safari, Firefox, and iOS Safari if available.
3. Keyboard through navigation and booking form.
4. Verify form labels and button accessible names.
5. Run Storybook a11y checks or a Playwright/axe smoke if available.
6. Verify focus states are visible.

Definition of done:

- Manual smoke checklist is complete.
- Any launch-blocking mobile/accessibility issues are fixed.

### Phase 6: Deployment and operations

Goal: ship through a repeatable process.

Tasks:

1. Add production build command to deployment pipeline.
2. Configure environment variables.
3. Configure static asset caching.
4. Configure SPA fallback.
5. Configure API proxy/CORS.
6. Add rollback procedure.
7. Add monitoring/logging expectations.

Minimum deploy validation:

```bash
cd web/packages/pyxis-components
pnpm exec tsc --noEmit

cd ../pyxis-user-site
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Definition of done:

- Deployment produces a working public URL.
- Direct route refresh works.
- API calls work from deployed frontend.
- Booking submission works in staging or production with safeguards.

### Phase 7: Final visual and content sign-off

Goal: prevent accidental launch with stale fixtures or bad copy.

Tasks:

1. Run public pages visual comparison against production-intent data.
2. Treat Shows broad rows as already accepted unless new human feedback appears.
3. Review all public copy.
4. Review event dates, prices, age restrictions, and addresses.
5. Confirm no prototype-only placeholder data remains.

Definition of done:

- Release owner signs off on public pages.
- Known accepted differences are documented.

## 9. Testing and validation strategy

### 9.1 Static validation

Run before every release candidate:

```bash
cd web/packages/pyxis-components
pnpm exec tsc --noEmit

cd ../pyxis-user-site
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### 9.2 Runtime smoke matrix

| Area | Test | Expected result |
|---|---|---|
| Routing | Refresh `/shows/1` | App renders show detail, not host 404. |
| Shows | API unavailable | Error state appears. |
| Shows | Empty list | Empty state appears. |
| Detail | Missing show | Not-found state appears. |
| Archive | Search with no results | Empty search state appears. |
| Book | Valid submit | Navigates to `/book/success`. |
| Book | Invalid submit | Validation/error appears. |
| Book | Server failure | Friendly error appears. |
| Mobile | 375px Shows | Cards are readable and tappable. |
| Keyboard | Tab through Book | Focus order is usable. |

### 9.3 API contract tests

Create fixtures or staging data for:

- one upcoming show with flyer;
- one upcoming show without flyer;
- one show with lineup;
- empty upcoming list;
- archive with multiple years;
- archive search with no matches;
- valid booking submission;
- invalid booking submission;
- rate-limited booking submission.

### 9.4 Visual validation

Use the existing public visual spec:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --outDir /tmp/pyxis-public-pages-prod-rc \
  --summary \
  --output json \
  > /tmp/pyxis-public-pages-prod-rc.json
```

Remember that the broad Shows rows were accepted by reviewer decision on 2026-04-27. Do not block launch on those rows unless new visual feedback appears.

## 10. Risks and mitigations

### Risk: SPA social previews for show detail are generic

If the site remains a pure SPA, crawlers may see only `index.html` defaults and not show-specific metadata. This is acceptable for a minimal launch only if the team accepts generic previews.

Mitigation options:

- server-render show detail metadata;
- pre-render known show detail routes;
- add backend route that injects metadata into `index.html`;
- accept generic previews for v1.

### Risk: Booking form receives spam

Public forms attract spam. Even a small venue site can receive automated submissions.

Mitigation options:

- honeypot field;
- IP/user-agent rate limit;
- captcha if spam appears;
- moderation queue;
- backend duplicate detection.

### Risk: API data shape drifts from frontend schema

The frontend decodes via protobuf JSON schemas. Drift will produce runtime errors or missing UI.

Mitigation options:

- contract smoke test;
- generated client types in CI;
- staging fixtures built from the same backend code;
- careful schema migration rules.

### Risk: Mobile bugs are missed by desktop visual parity

Most recent tuning was desktop-focused.

Mitigation:

- require manual mobile smoke before launch;
- add mobile visual targets later if the public site changes frequently.

### Risk: Same-origin vs cross-origin API is decided late

This can cause last-minute CORS and environment failures.

Mitigation:

- decide deployment topology in Phase 1;
- test deployed frontend against deployed API before content freeze.

## 11. Implementation update: phases 1-4 completed

The first production hardening pass completed the build/embed checks, SPA fallback tests, public API visibility hardening, and booking v1 validation baseline.

### 11.1 Build and embed decision

The production-intent command is `make build-embed`. It runs the web build pipeline and then compiles `bin/pyxis` with `-tags embed`. The Dagger path was validated with `go run ./cmd/build-web`, the local fallback was validated with `BUILD_WEB_LOCAL=1 go run ./cmd/build-web`, and the final embedded binary was rebuilt with `make build-embed`.

The repository currently tracks `internal/web/embed/public`. For this codebase, the safe release rule is:

- CI/release must generate the embedded public bundle with `make build-embed` or `go run ./cmd/build-web` before building the tagged binary.
- The tracked copy of `internal/web/embed/public` is useful for local non-embed fallback and review, but it must not be treated as a substitute for a release-time web build.
- When a production hardening change regenerates the public bundle, commit the regenerated asset set together with the change so the fallback tree and `-tags embed` tree describe the same site.

### 11.2 SPA route tests and smoke script

Static routing now has Go unit coverage:

- `internal/web/static_test.go` verifies browser route fallback, asset serving, non-GET route rejection, reserved backend paths, and missing-bundle behavior.
- `pkg/server/spa_fallback_test.go` verifies that primary non-404 responses are preserved, primary 404 responses delegate to the fallback handler, and headers/bodies are not leaked from the discarded 404.

The integration smoke script lives at:

```text
ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/scripts/01-smoke-embedded-public-site.sh
```

It builds or reuses `bin/pyxis`, runs migrations, starts the embedded server, verifies public SPA routes return HTML, verifies public API routes return JSON, seeds temporary visibility rows, checks public show/detail/archive visibility, posts a booking submission, and cleans up its smoke rows.

### 11.3 Public API hardening

Public show detail no longer calls the generic staff-style `GetByID` path. It calls `GetPublicByID`, which currently exposes confirmed shows whose date is today or later. Draft, hold, blocked, cancelled, archived, missing, and invalid IDs now produce client-safe error behavior. The public rule is therefore explicit for v1: **public show detail is confirmed-upcoming only**.

The list and archive endpoints were checked through the smoke script with temporary rows:

- `GET /api/public/shows` includes the seeded confirmed future show.
- `GET /api/public/shows` excludes seeded draft and archived shows.
- `GET /api/public/shows/{draftID}` returns `404`.
- `GET /api/public/archive?search=<marker>` includes the seeded archived show and excludes the confirmed future show.

`respondError` now maps service validation errors to `400 VALIDATION_ERROR`, not `500 INTERNAL_ERROR`. Invalid public show IDs are validation errors; missing/non-public shows are not-found errors.

### 11.4 Booking v1 hardening

Booking spam mitigation remains intentionally absent for v1 because Manuel accepted `none for now`. This is documented as a risk, and the later post-launch follow-up should add honeypot/rate-limit/duplicate detection once launch urgency or spam volume justifies it.

The server-side booking baseline now rejects:

- missing artist name;
- missing links;
- artist names longer than 200 characters;
- links longer than 2000 characters;
- messages longer than 5000 characters;
- tech rider text longer than 5000 characters;
- expected draw outside `0..1000`.

The shared `BookingForm` already prevents obvious duplicate submits by disabling the submit button when `isSubmitting` is true, and `BookPage` passes RTK Query's `submit.isPending` into that prop. The smoke script verifies that a valid public submission creates a booking confirmation through the embedded same-origin API. Staff review/approve/decline endpoints remain a Phase 5/launch-ops concern because production auth exposure is still unresolved.

## 12. Open questions

1. Is show detail social sharing important enough to require server-rendered metadata for v1, or is generic SPA metadata acceptable?
2. Should `ReserveTicketCard` link to an external ticketing system, show door-only information, or be hidden until ticketing is real?
3. Should lineup entries support richer public display fields before launch, or can this wait?
4. Who is the final content approver for dates, prices, age restrictions, venue copy, and booking copy?
5. Who is responsible for monitoring new pending booking submissions after launch?
6. Should staff `/auth/*` and `/api/app/*` routes be exposed in the same public deployment, or restricted at the proxy/deployment layer?

## 13. File reference map

| File | Why it matters |
|---|---|
| `web/packages/pyxis-user-site/src/App.tsx` | Defines the public SPA route tree and lazy-loaded page chunks. |
| `web/packages/pyxis-user-site/src/api/publicApi.ts` | Central RTK Query API layer and protobuf JSON decoding/encoding. |
| `web/packages/pyxis-user-site/src/api/endpoints.ts` | Single source of truth for public endpoint paths. |
| `web/packages/pyxis-user-site/src/pages/ShowsPage/Page.tsx` | Shows page data states and grid rendering. |
| `web/packages/pyxis-user-site/src/pages/ShowDetailPage/Page.tsx` | Show detail data states, flyer handling, lineup rendering, and not-found behavior. |
| `web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx` | Archive container/view split, search, stats, year grouping, and empty/error states. |
| `web/packages/pyxis-user-site/src/pages/BookPage/Page.tsx` | Public booking submission flow and error handling. |
| `web/packages/pyxis-user-site/src/components/Seo.tsx` | Existing SEO helper that must be mounted by route pages before launch. |
| `web/packages/pyxis-user-site/vite.config.ts` | Build settings and development proxy; informs production API topology decisions. |
| `proto/pyxis/v1/show.proto` | Canonical public API schema for shows, archive, booking submissions, and confirmations. |
| `prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml` | Public visual comparison spec and accepted Shows differences. |

## 14. Ship/no-ship gate

The public app can be considered ready to ship when all of these are true:

- [ ] Production API topology is decided and documented.
- [ ] `VITE_API_URL` behavior is correct for production.
- [ ] All public API endpoints are available and schema-compatible.
- [ ] Booking form has server-side validation and abuse mitigation.
- [ ] Direct refresh works for every public route.
- [ ] SEO metadata is mounted or generic metadata is explicitly accepted.
- [ ] robots/sitemap domain is correct.
- [ ] Mobile smoke pass is complete.
- [ ] Accessibility smoke pass is complete.
- [ ] Final build commands pass.
- [ ] Public content is reviewed.
- [ ] Release owner signs off.

Until those boxes are checked, the app is visually promising but not production-ready.
