---
Title: Backend Static Embed Production Audit
Ticket: PYXIS-PUBLIC-PROD-SHIP
Status: active
Topics:
    - frontend
    - production
    - public-site
    - release-readiness
DocType: reference
Intent: implementation
Owners: []
RelatedFiles:
    - Path: Makefile
      Note: build-web build-embed and serve-embed launch commands
    - Path: cmd/build-web/main.go
      Note: Dagger/local public site build and copy-to-embed command
    - Path: internal/web/embed.go
      Note: go:embed production filesystem for public site
    - Path: internal/web/embed_none.go
    - Path: internal/web/generate.go
    - Path: internal/web/static.go
      Note: SPA static file serving reserved route behavior
    - Path: pkg/db/migrations/000001_init.up.sql
      Note: submissions shows and settings schema
    - Path: pkg/db/queries/shows.sql
      Note: public upcoming/archive SQL visibility behavior
    - Path: pkg/db/queries/submissions.sql
      Note: public booking submission insert/list/update queries
    - Path: pkg/server/public.go
      Note: public API handler implementations
    - Path: pkg/server/server.go
      Note: public API routes and SPA fallback wiring
    - Path: pkg/server/spa_fallback.go
      Note: 404 delegation wrapper for React Router routes
    - Path: pkg/service/submission_service.go
      Note: booking submission validation and review flow service
ExternalSources: []
Summary: Audit of the Go backend, public API, static SPA embed, Dagger build, and route fallback path for shipping the public Pyxis site.
LastUpdated: 2026-04-27T19:10:00-04:00
WhatFor: Use this as the evidence-backed backend/deployment audit before implementing production launch tasks.
WhenToUse: Read before changing embed/build/server routing code or before executing the production-readiness task list.
---












# Backend Static Embed Production Audit

## 1. Executive summary

The backend already matches Manuel's desired production topology: a single Go binary can serve the public site and the API from the same origin. The codebase has a dedicated `cmd/build-web` command that builds `pyxis-types`, `pyxis-components`, and `pyxis-user-site`, then copies the Vite `dist` directory into `internal/web/embed/public`. The Go server has a SPA fallback handler that returns `index.html` for public browser routes while reserving `/api`, `/auth`, `/health`, and `/flyers` for backend handlers. The public API endpoints used by the React app are already registered in `pkg/server/server.go` and implemented in `pkg/server/public.go`.

The audit therefore changes the production plan from “decide whether this exists” to “verify and harden the existing path.” The highest-value launch tasks are now concrete:

- add automated tests for SPA fallback behavior and reserved backend routes;
- add tests for the public API handlers or services;
- decide whether `make build-embed` should be the production build command;
- verify Dagger/local fallback build behavior in CI or release environment;
- harden booking submission validation enough for v1;
- document no-spam-mitigation as an accepted risk;
- decide the SEO/head strategy for the SPA;
- add a production smoke script that builds, serves, and curls public routes/API routes.

A Go test run passed during this audit:

```bash
go test ./... -count=1
```

Result: all packages passed or had no test files.

## 2. What the backend already does

### 2.1 Public site build and embed path

The public site build path is implemented in `cmd/build-web/main.go`. The file-level comment states the intent clearly: build the public user-site bundle and copy it into the Go embed tree. The command supports two modes:

```bash
go run ./cmd/build-web
BUILD_WEB_LOCAL=1 go run ./cmd/build-web
```

The Dagger path is the default. It uses:

- `node:22` as the default builder image;
- a `pyxis-user-site-pnpm-store` cache volume;
- `pnpm install --frozen-lockfile`;
- `pnpm --filter pyxis-types build`;
- `pnpm --filter pyxis-components build`;
- `pnpm --filter pyxis-user-site build`;
- export of `/src/packages/pyxis-user-site/dist`.

The local fallback path runs equivalent local pnpm builds and then copies `web/packages/pyxis-user-site/dist` into `internal/web/embed/public`.

The copy function explicitly verifies `index.html` before copying:

```go
if _, err := os.Stat(filepath.Join(src, "index.html")); err != nil {
    return fmt.Errorf("public site dist is missing index.html at %s: %w", src, err)
}
```

This is good production behavior. The embed source is not an accidental directory; it is produced by a purpose-built command.

### 2.2 Makefile launch commands

The root `Makefile` contains the relevant production commands:

```make
build-web:
	$(GO) run ./cmd/build-web

generate-web:
	$(GO) generate ./internal/web

build-embed: build-web
	$(GO) build -tags embed -o bin/$(BINARY_NAME) ./cmd/pyxis

serve-embed: build-web
	$(GO) run -tags embed ./cmd/pyxis serve --bind :8080
```

This gives the production launch path an obvious command:

```bash
make build-embed
```

For local verification:

```bash
make serve-embed
```

The production task list should require one of these commands, or a CI/deployment equivalent, rather than a bare `go build`.

### 2.3 Embed build tags

The Go embed layer is split by build tag:

- `internal/web/embed.go` is built only with `//go:build embed` and uses `go:embed embed/public`.
- `internal/web/embed_none.go` is built without the embed tag and reads from `os.DirFS("internal/web/embed/public")`.

This means:

- production binaries should use `-tags embed`;
- development can serve from the filesystem after `make build-web`;
- missing bundle behavior is explicit.

### 2.4 SPA fallback behavior

`internal/web/static.go` implements `NewSPAHandler`. Its behavior is exactly what a React Router SPA needs:

1. Only `GET` and `HEAD` are served.
2. Reserved backend paths return 404 from the SPA handler instead of HTML.
3. Existing static files are served directly.
4. Unknown public browser routes return `index.html`.

Reserved paths include:

```go
var reservedPrefixes = []string{
    "/api/",
    "/auth/",
    "/flyers/",
}
```

and exact paths:

```go
if path == "/api" || path == "/auth" || path == "/health" || path == "/flyers" {
    return true
}
```

This is important. It prevents a missing API route from returning the public HTML shell, which would be a confusing production failure.

### 2.5 ServeMux wrapping

`pkg/server/server.go` registers API/auth/flyer routes on a `http.ServeMux`, then wraps the mux with `spaFallbackHandler`:

```go
s.handler = spaFallbackHandler{primary: mux, fallback: web.NewSPAHandler()}
```

The comment explains why: Go 1.22 ServeMux pattern rules do not allow a simple root catch-all mixed with method-specific API routes. The wrapper buffers the primary response and delegates only 404s to the SPA fallback.

`pkg/server/spa_fallback.go` implements that wrapper. If the primary mux returns 404, it calls the fallback. Otherwise it flushes the primary response.

This design is sound, but it deserves tests before production because it is the core of direct-refresh behavior.

## 3. Public API audit

### 3.1 Registered public endpoints

`pkg/server/server.go` registers the public endpoints used by `pyxis-user-site`:

```go
mux.HandleFunc("GET /api/public/shows", s.handleListPublicShows)
mux.HandleFunc("GET /api/public/shows/{id}", s.handleGetPublicShow)
mux.HandleFunc("GET /api/public/archive", s.handleGetArchive)
mux.HandleFunc("GET /api/public/archive/stats", s.handleGetArchiveStats)
mux.HandleFunc("POST /api/public/submissions", s.handleCreateSubmission)
```

These match the frontend endpoint contract in `web/packages/pyxis-user-site/src/api/endpoints.ts`.

### 3.2 Public shows

`pkg/server/public.go` implements `handleListPublicShows` by calling `s.showService.ListUpcoming(ctx)`, converting each domain show to protobuf, and returning `ShowList` as proto JSON.

The SQL query is in `pkg/db/queries/shows.sql`:

```sql
SELECT id, artist, date, doors_time, start_time, age, price, genre,
       description, notes, status, flyer_url, discord_message_id, discord_channel_id, draw, capacity,
       submission_id, artist_id, created_at, updated_at
FROM shows
WHERE status = 'confirmed' AND date >= CURRENT_DATE
ORDER BY date ASC;
```

This matches the desired public Shows behavior: confirmed upcoming shows only, ascending by date.

### 3.3 Show detail

`handleGetPublicShow` parses `{id}`, calls `s.showService.GetByID`, and returns `showToProto(show)`. The repository uses `GetShowWithLineup`, so detail pages can include lineup entries.

Open production question: the public show detail endpoint does not appear to filter by `status = confirmed`. If a user guesses the ID of a draft, hold, blocked, or archived show, `GetByID` may return it unless the repository/service enforces visibility elsewhere. This should be checked and likely fixed before launch.

Recommended task: add `GetPublicShowByID` semantics that only return public-visible shows, or explicitly decide that any show ID is public.

### 3.4 Archive and stats

`handleGetArchive` reads `search`, calls `s.showService.SearchArchive`, and returns `ArchivedShowList`.

The archive SQL filters to archived shows:

```sql
WHERE s.status = 'archived'
  AND ($1::text = '' OR s.artist ILIKE '%' || $1 || '%' OR s.genre ILIKE '%' || $1 || '%')
ORDER BY s.date DESC;
```

`handleGetArchiveStats` returns aggregate stats over archived shows. This matches the frontend `ArchivePage` data flow.

### 3.5 Booking submissions

`handleCreateSubmission` decodes `BookingFormData`, maps it into `domain.Submission`, and calls `s.submissionService.Create`. It returns `BookingConfirmation` with `success=true` and `submission_id`.

`SubmissionService.Create` currently validates only:

```go
if req.ArtistName == "" {
    return nil, fmt.Errorf("artist name is required")
}
if req.Links == "" {
    return nil, fmt.Errorf("links are required")
}
```

This is enough to prevent totally empty artist/link submissions, but it is not a complete production validation layer. Manuel accepted no spam mitigation for v1, so rate limiting/honeypot are not immediate blockers, but the launch should not overstate the current protection.

The DB has a `submissions` table with `status DEFAULT 'pending'`, and staff booking endpoints exist for listing, review, approve, and decline. This means submissions have a review path in the backend/admin API, even though the human owner is still undecided.

## 4. Security and operational observations

### 4.1 Public API is intentionally unauthenticated

The public API endpoints are registered before auth-required staff endpoints and are not wrapped in `requireAuth`. This is expected for public shows, archive, and booking submissions.

### 4.2 Staff app/auth is not this ticket, but the same binary serves it

The server also registers auth routes and staff `/api/app/*` routes. The public launch scope is public website + backend, but the same binary likely still exposes staff routes. This means production deployment should at least ensure:

- `PYXIS_DEV_AUTH` is not enabled;
- Discord OAuth config is correct if staff app is reachable;
- session cookies should be reviewed before public internet exposure.

`pkg/server/auth.go` currently sets Discord callback cookies with `Secure: false` and a TODO saying to set true in production with HTTPS. Even if staff app launch is not the focus, this is a production exposure issue if `/auth/*` is public.

Recommended task: add production-aware secure cookie configuration before exposing staff auth on `https://pyxis.xyz`.

### 4.3 Static asset caching is not customized

`http.FileServer` will serve assets, but there is no explicit long-lived cache policy for hashed Vite assets or no-cache policy for `index.html`. This is not a hard launch blocker, but production quality would improve with:

- `Cache-Control: no-cache` for `index.html`;
- `Cache-Control: public, max-age=31536000, immutable` for hashed `/assets/*`.

## 5. Validation performed

I ran:

```bash
go test ./... -count=1
```

Result: all packages passed or had no test files.

This validates that the current Go code compiles and existing tests pass. It does not validate:

- Dagger build-web execution;
- embedded binary route behavior;
- public API responses against a real database;
- route fallback behavior through an actual running server;
- booking submission behavior against Postgres.

Those must become explicit tasks.

## 6. Production readiness conclusions

### 6.1 Ready enough as foundation

The following are already present:

- single-binary static embed architecture;
- Dagger/local build-web command;
- `make build-embed` and `make serve-embed`;
- SPA fallback with reserved API/auth/flyer paths;
- public endpoints matching frontend endpoint paths;
- proto JSON response format;
- public Shows, Detail, Archive, Stats, and Submission handlers;
- booking submissions stored as pending records;
- staff booking review/approve/decline API exists.

### 6.2 Must verify or harden before launch

The following should be done before shipping:

- Add tests for SPA fallback and reserved routes.
- Run `make build-embed` or equivalent in CI/release environment.
- Add a smoke script that serves the embedded binary and curls route/API behavior.
- Confirm production DB migrations and seed/content data.
- Ensure public show detail does not expose non-public show statuses.
- Decide and implement production secure-cookie behavior if auth routes are exposed.
- Strengthen booking validation enough to produce clear 400s.
- Document no spam mitigation as an accepted v1 risk.
- Decide SEO strategy and either wire it or accept generic metadata.

## 7. Suggested smoke script behavior

A launch smoke script should do roughly this:

```bash
make build-embed
./bin/pyxis migrate up --db-url "$DATABASE_URL"
./bin/pyxis serve --bind :8080 --db-url "$DATABASE_URL" &
PID=$!
trap 'kill $PID' EXIT

curl -fsS http://127.0.0.1:8080/health
curl -fsS http://127.0.0.1:8080/
curl -fsS http://127.0.0.1:8080/shows
curl -fsS http://127.0.0.1:8080/shows/1 || true
curl -fsS http://127.0.0.1:8080/archive
curl -fsS http://127.0.0.1:8080/book
curl -fsS http://127.0.0.1:8080/about
curl -fsS http://127.0.0.1:8080/api/public/shows
curl -fsS http://127.0.0.1:8080/api/public/archive
curl -fsS http://127.0.0.1:8080/api/public/archive/stats
```

For the API calls, the script should validate JSON shape, not just HTTP 200. For the SPA calls, it should verify that the response is HTML and includes the app root.

## 8. Updated task implications

The task list should shift from abstract discovery to concrete implementation:

- Backend embed path exists; test it.
- Same-origin API is the intended topology; codify it.
- Build-web exists with Dagger fallback; validate it in release environment.
- Public endpoints exist; contract-test them.
- Booking storage exists; harden validation and document no spam mitigation.
- SPA fallback exists; test it.
- SEO helper exists but needs a decision/implementation.
