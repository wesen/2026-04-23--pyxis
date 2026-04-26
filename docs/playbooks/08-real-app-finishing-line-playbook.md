# Real App Finishing-Line Playbook

Use this playbook when a frontend package already has components, Storybook stories, and API sketches, but still needs to become a real application that runs against the Go backend, survives direct browser navigation, and can be shipped as part of a deployable artifact.

This was distilled from the Pyxis public user-site work: RTK Query wiring, protobuf-shaped API responses, Storybook/MSW cleanup, component taxonomy, CSS ownership fixes, Vite proxy testing, and Go embedding. The next intended target is `web/packages/pyxis-app`.

## 1. Definition of done

A frontend package is over the finishing line when all of these are true:

- The app talks to real backend endpoints in local development via same-origin-style relative URLs and a Vite proxy.
- Storybook remains deterministic and uses MSW, not the live backend.
- Every wire payload is protobuf-backed and decoded with generated types.
- Pages own routing, RTK Query hooks, mutation state, loading/error/empty states, and URL params.
- Components receive typed props and do not fetch data directly.
- Component CSS is owned by the component that renders the markup.
- Storybook preview files do not mask missing component CSS imports.
- A real database can be migrated and seeded for manual QA.
- A smoke script or documented curl sequence proves API and browser routes both work.
- The app can be built in CI and, if applicable, embedded or served by the backend.

## 2. Start with a ticket and diary

Create or use a ticket workspace before touching runtime behavior.

Minimum docs:

```text
ttmp/.../<TICKET>--<slug>/
  design-doc/01-implementation-guide.md
  reference/01-investigation-diary.md
  tasks.md
  changelog.md
```

The diary should be chronological and operational. Record:

- what was changed
- why it was changed
- exact commands run
- exact failures and fixes
- runtime URLs tested
- Storybook IDs or page routes validated
- follow-ups deliberately deferred

The public site work found real issues only because the diary preserved the difference between Storybook validation and live Vite validation.

## 3. Establish the runtime topology

Write down the intended local and production topology explicitly.

For a Vite app during local development:

```text
Browser -> http://localhost:<vite-port>
  /assets/...        -> Vite
  /src/...           -> Vite HMR
  /api/...           -> Vite proxy -> Go backend
  /auth/...          -> Vite proxy -> Go backend
  /flyers/...        -> Vite proxy -> Go backend
```

For an embedded/single-origin app:

```text
Browser -> Go backend
  /                 -> SPA index.html
  /some/browser/path -> SPA index.html
  /assets/...       -> built static asset
  /api/...          -> Go API JSON
  /auth/...         -> Go auth/session
  /flyers/...       -> static flyer storage or object storage
```

For `pyxis-app`, decide early whether the staff app will be:

1. embedded into the same Go binary under a path such as `/app`, or
2. served separately during the next phase while only its API wiring is made real.

Do not mix this decision with component refactors unless required.

## 4. Make frontend API calls same-origin first

Do not hard-code `http://localhost:8080` in app code.

Use relative URLs by default:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
```

Then configure Vite dev proxy:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:8080',
    '/auth': 'http://localhost:8080',
    '/flyers': 'http://localhost:8080',
  },
}
```

This makes the same RTK Query code work in both modes:

```text
Vite dev: /api -> proxy -> Go
Production: /api -> same Go origin
Storybook: /api -> MSW
```

For `pyxis-app`, verify `web/packages/pyxis-app/vite.config.ts` and all API clients follow this pattern.

## 5. Use protobuf at every API boundary

The frontend cache should hold generated protobuf-shaped objects, not hand-written mirrors.

Recommended RTK Query pattern:

```ts
import { fromJson, SomeResponseSchema } from 'pyxis-types';

transformResponse: (response: unknown) => {
  return fromJson(SomeResponseSchema, response as any);
}
```

Recommended component pattern:

```text
RTK Query cache -> generated proto message -> page transform/useMemo if needed -> typed component props
```

Do not return ad-hoc backend JSON. Do not add `map[string]interface{}` response envelopes in Go. If a response crosses the wire, define a protobuf message and marshal with `protojson`.

For `pyxis-app`, known follow-ups include removing hand-written API mirrors and addressing the `CalendarEvent` gap with a real proto-backed response.

## 6. Separate Storybook from the live backend

Storybook should be deterministic.

Rules:

- Storybook uses MSW handlers.
- MSW responses consumed by `fromJson(...)` must use `toJson(...)` from Buf messages.
- Do not return raw Buf message instances containing `$typeName` from `HttpResponse.json(...)`.
- Do not point Storybook at `localhost:8080`.
- Do not create duplicate page stories that bypass the canonical app harness.

Good MSW shape:

```ts
const message = create(SomeResponseSchema, { ... });
return HttpResponse.json(toJson(SomeResponseSchema, message));
```

Bad MSW shape:

```ts
return HttpResponse.json(create(SomeResponseSchema, { ... }));
```

The bad shape leaks `$typeName` and breaks `fromJson(...)`.

For `pyxis-app`, keep staff page stories in one canonical harness with store/router/MSW rather than a mix of stale standalone page stories.

## 7. Make pages own orchestration

Route pages should own:

- route params
- navigation
- RTK Query hooks
- mutations
- loading state
- error state
- empty state
- local filter/search form state
- transformations from API shape to component props

Components should own:

- presentation markup
- CSS
- small local UI state only when it is intrinsic to the widget
- typed props

Good:

```tsx
function StaffShowsPage() {
  const { data, isLoading, isError } = useListShowsQuery();
  const navigate = useNavigate();

  if (isLoading) return <PageLoading />;
  if (isError || !data) return <PageError />;

  return <ShowTable shows={data.shows} onSelect={(show) => navigate(`/shows/${show.id}`)} />;
}
```

Bad:

```tsx
function ShowTable() {
  const { data } = useListShowsQuery();
  ...
}
```

For `pyxis-app`, this means dashboard/calendar/bookings/settings pages should own API calls; organisms such as queues, boards, tables, and panels should stay prop-driven.

## 8. Enforce component CSS ownership

Every component with colocated CSS must import that CSS from the component file that renders the classes.

Good:

```tsx
import './PubNav.css';

export function PubNav() {
  return <header className="pyxis-pub-nav">...</header>;
}
```

Bad:

```tsx
// PubNav.tsx renders pyxis-pub-nav but does not import PubNav.css.
```

Also bad:

```tsx
// .storybook/preview.tsx
import '../src/public/organisms/PubNav/PubNav.css';
```

Storybook preview imports like that mask real-app failures. The public navbar bug happened because Storybook globally imported `PubNav.css`, while the real Vite app imported only the component TSX. The real app rendered raw browser buttons until `PubNav.tsx` imported its own CSS.

Allowed global CSS in preview/app entrypoints:

- design tokens
- resets
- application shell globals
- fonts

Not allowed in preview/app entrypoints:

- individual component CSS files used to compensate for missing component imports

Useful audit script:

```bash
python3 - <<'PY'
from pathlib import Path
root = Path('web/packages/pyxis-components/src')
missing = []
for tsx in root.rglob('*.tsx'):
    if tsx.name.endswith('.stories.tsx') or tsx.name.endswith('.test.tsx'):
        continue
    css = tsx.with_suffix('.css')
    if not css.exists():
        continue
    text = tsx.read_text()
    if f"import './{css.name}';" not in text and f'import "./{css.name}";' not in text:
        missing.append(str(tsx))
print('\n'.join(missing))
PY
```

For `pyxis-app`, run this against shared components and staff-local components. Remove any Storybook preview imports that hide missing component CSS.

## 9. Validate against the real Vite app, not only Storybook

Storybook can prove component states. It cannot prove the app runtime.

Always run the real backend plus Vite:

```bash
docker compose up -d db
go run ./cmd/pyxis migrate up
go run ./cmd/pyxis serve --bind :8080
cd web && pnpm --filter pyxis-user-site dev --host 0.0.0.0
```

For `pyxis-app`:

```bash
cd web && pnpm --filter pyxis-app dev --host 0.0.0.0
```

Use tmux for stable manual QA sessions:

```bash
tmux new-session -d -s pyxis-backend-dev 'go run ./cmd/pyxis serve --bind :8080 2>&1 | tee /tmp/pyxis-backend-dev.log'
tmux new-session -d -s pyxis-app-vite -c "$PWD/web" 'pnpm --filter pyxis-app dev --host 0.0.0.0 2>&1 | tee /tmp/pyxis-app-vite.log'
```

Then test the app URL in a browser. Inspect console and network requests. Verify that API calls go to the Vite origin and are proxied to Go.

## 10. Make database setup boring

A real app needs a reliable local database state.

Minimum flow:

```bash
docker compose up -d db
go run ./cmd/pyxis migrate up
# seed fixture command or psql fixture load
```

If the seed command is a placeholder, fix it or document the fallback explicitly. A finishing-line app cannot require tribal knowledge to get non-empty screens.

Good smoke checks:

```bash
curl -fsS http://localhost:8080/health
curl -fsS http://localhost:8080/api/public/shows
curl -fsS http://localhost:8080/api/public/archive
```

For `pyxis-app`, add staff API smoke checks once dev auth/session is available:

```bash
curl -i http://localhost:8080/api/app/session
curl -i http://localhost:8080/api/app/shows
curl -i http://localhost:8080/api/app/bookings
curl -i http://localhost:8080/api/app/calendar
```

If auth blocks smoke testing, add an explicit dev-session workflow rather than bypassing auth accidentally.

## 11. Embed only after the live Vite app works

Do not use embedding to debug basic API integration. First prove:

```text
Go backend + Vite dev + real database works.
```

Then add embedding:

```text
frontend dist -> stable Go embed dir -> go:embed -> SPA fallback
```

For Go `net/http` with Go 1.22+ ServeMux, be careful with root catch-alls. A pattern like:

```go
mux.Handle("GET /", spaHandler)
```

can conflict with existing method-specific patterns. A safe pattern is:

```text
primary mux handles API/auth/health/static first
buffer primary 404s
fallback only unmatched browser routes to SPA handler
```

The public site uses this wrapper:

```text
pkg/server/spa_fallback.go
```

For `pyxis-app`, if staff UI is embedded under `/app`, the fallback must be path-scoped and must not capture `/api`, `/auth`, `/health`, or public-site routes.

## 12. Add build and smoke commands

A real app should have repeatable commands, not just one-off terminal history.

Useful targets:

```make
build-web:
	go run ./cmd/build-web

generate-web:
	go generate ./internal/web

build-embed: build-web
	go build -tags embed -o bin/pyxis ./cmd/pyxis

serve-embed: build-web
	go run -tags embed ./cmd/pyxis serve --bind :8080
```

For `pyxis-app`, consider either:

- extending `cmd/build-web` to build both public and staff bundles, or
- adding a separate `cmd/build-staff-web` if the serving strategy differs.

## 13. Required validation ladder

Run validation in this order. Do not skip straight to the full workspace build.

### API/package validation

```bash
go test ./...
cd web/packages/pyxis-types && pnpm build
cd web/packages/pyxis-components && pnpm build
```

### App validation

```bash
cd web/packages/<app> && pnpm build
cd web/packages/<app> && pnpm build-storybook
```

### Workspace validation

```bash
cd web && pnpm build
```

### Real runtime validation

```bash
docker compose up -d db
go run ./cmd/pyxis migrate up
go run ./cmd/pyxis serve --bind :8080
cd web && pnpm --filter <app> dev --host 0.0.0.0
```

Then browser-test pages and inspect network/console.

### Embedded validation, if applicable

```bash
go generate ./internal/web
go build -tags embed -o bin/pyxis ./cmd/pyxis
bin/pyxis serve --bind 127.0.0.1:8090
```

Smoke:

```bash
curl -i http://127.0.0.1:8090/
curl -i http://127.0.0.1:8090/some/browser/route
curl -i http://127.0.0.1:8090/assets/<asset>.js
curl -i http://127.0.0.1:8090/api/public/shows
curl -i http://127.0.0.1:8090/health
```

Expected:

```text
browser routes -> HTML
assets         -> JS/CSS/etc.
/api           -> JSON, never HTML
/health        -> health JSON
```

## 14. Browser QA checklist

For every route:

- direct navigation works
- reload works
- loading state appears when delayed
- API error state appears when endpoint fails
- empty state appears with empty fixtures
- real data renders without mock-only fields
- primary actions call real mutations
- success and failure paths are visible
- console has no relevant errors
- network responses have expected content type

For `pyxis-app`, include:

- dashboard
- shows list/detail/edit flows
- bookings inbox/approve/decline
- artists roster/detail
- calendar holds/blocked dates
- attendance panel
- settings panel
- audit log
- auth/session/logout behavior

## 15. Common failure modes

### Storybook works, app is broken

Likely causes:

- Storybook preview imports component CSS globally.
- Storybook uses mock-only fields not present in real API.
- Storybook bypasses router/store providers used in the real app.
- MSW response shape differs from protojson backend shape.

### Vite works, embedded app is broken

Likely causes:

- frontend uses absolute `localhost` API URL
- backend SPA fallback captures `/api` and returns HTML
- built assets are copied from the wrong package `dist`
- BrowserRouter route needs index fallback
- base path differs between Vite and Go serving path

### API returns JSON but frontend fails decoding

Likely causes:

- response is not a protobuf message
- JSON casing differs from `protojson` camelCase
- enum represented as string when frontend expects generated numeric enum, or vice versa
- MSW returns Buf message instances with `$typeName`

### Clean container build fails but local build passes

Likely causes:

- workspace dependency dist folders exist locally but are missing in container
- build command only builds the leaf app
- lockfile or package manager version mismatch

Fix by building dependencies explicitly or using recursive topological builds.

## 16. Applying this to `pyxis-app`

Recommended sequence:

1. Start backend and `pyxis-app` Vite in tmux.
2. Verify Vite proxy for `/api`, `/auth`, and `/flyers`.
3. Decide dev auth/session strategy for staff endpoints.
4. Replace hand-written staff API mirrors with generated protobuf types where backend messages exist.
5. Add missing protobuf messages for endpoints that still return hand-written shapes, especially calendar.
6. Convert page data fetching to RTK Query against real `/api/app/*` endpoints.
7. Keep components prop-driven.
8. Convert staff Storybook to MSW protobuf JSON responses.
9. Audit CSS ownership and remove preview-level component CSS masking.
10. Add real runtime smoke tests for staff routes and mutations.
11. Only then decide whether/how to embed the staff app.

Do this in small commits:

```text
1. dev proxy + API client base URL
2. one page wired to real RTK Query
3. MSW/storybook parity for that page
4. validation + diary
5. repeat page cluster by page cluster
```

Avoid a single large migration of every page. The public-site work was successful because it moved one cluster at a time, validated, documented, and committed at each boundary.
