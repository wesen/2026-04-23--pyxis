---
Title: Investigation Diary
Ticket: PYXIS-USER-SITE-GO-EMBED-DAGGER
Status: active
Topics:
    - frontend
    - go
    - api-integration
    - protobuf
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: Makefile
      Note: Adds build-web/generate-web/build-embed/serve-embed targets.
    - Path: cmd/build-web/main.go
      Note: Dagger/local pnpm build command for public user-site bundle.
    - Path: go.mod
      Note: Adds Dagger SDK dependency for build-web.
    - Path: internal/web
      Note: Embed/disk SPA serving package for public user site.
    - Path: internal/web/embed/public
      Note: Generated public user-site bundle copied for go:embed.
    - Path: pkg/server/server.go
      Note: Wires flyer static route and public SPA fallback into Go server.
    - Path: pkg/server/spa_fallback.go
      Note: Buffers primary mux 404s and delegates browser routes to SPA handler.
    - Path: ttmp/2026/04/26/PYXIS-USER-SITE-GO-EMBED-DAGGER--serve-pyxis-user-site-from-go-backend-with-dagger-pnpm-build/scripts/smoke-embedded-site.sh
      Note: Smoke-test helper for validating embedded public site serving.
    - Path: ttmp/2026/04/26/PYXIS-USER-SITE-GO-EMBED-DAGGER--serve-pyxis-user-site-from-go-backend-with-dagger-pnpm-build/tasks.md
      Note: Phased checklist for implementing Dagger build and Go embedded SPA serving.
ExternalSources: []
Summary: Chronological investigation diary for serving the Pyxis public user site bundle from the Go backend with a Dagger pnpm build pipeline.
LastUpdated: 2026-04-26T14:05:00-04:00
WhatFor: Use this diary to understand the evidence gathered and implementation decisions for the Go-served user-site bundle ticket.
WhenToUse: When continuing the embedded public-site build work or reviewing the Dagger/pnpm/go:embed deployment plan.
---



# Diary

## Goal

Record the investigation and design process for building the Pyxis public user-site bundle with pnpm/Dagger and serving it from the Go backend as a single deployable binary.

## Step 1: Go-Served Public Site Bundle Investigation and Guide

The user asked for a third ticket focused on wiring the real user-facing site with the real backend using a Dagger builder and serving the page bundle. I loaded the `go-web-dagger-pnpm-build` and `go-web-frontend-embed` skills, then inspected the current Go server, Glazed `serve` command, frontend workspace package scripts, Vite config, and user-site route structure.

The main finding is that the repo is ready for the standard Go embedded SPA pattern, but the generic Dagger template must be adapted for the Pyxis pnpm workspace. Pyxis does not build to `web/dist`; the public site builds to `web/packages/pyxis-user-site/dist`. The implementation guide calls this out explicitly so an intern does not copy the template blindly.

### Prompt Context

**User prompt (verbatim):** "then add one more ticket which is going to be about wiring the real user-facing site with real backend, using a dagger builder (see skill) and serving the page bundle. Investigate and reate a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet  
point sand pseudocode and diagrams and api references and file                                                                                                                                              
  references.                                                                                                                                                                                               
  It should be very clear and detailed. Store in the ticket and the nupload to remarkable.                                                                                                                  
                                                                                                                                                                                                            
You can write scripts and all kinds of other things in the scripts/ folder of the ticket."

**Assistant interpretation:** Create a new docmgr ticket and intern-ready implementation guide for building the public user site with a Dagger/pnpm pipeline and embedding/serving the resulting Vite bundle from the Go backend.

**Inferred user intent:** Prepare a production deployment path for the unauthenticated public site as a single Go binary, while preserving development ergonomics and avoiding incorrect Dagger/template assumptions.

**Commit (docs):** Pending at time of diary creation.

### What I did

- Created ticket `PYXIS-USER-SITE-GO-EMBED-DAGGER`.
- Created design document: `design-doc/01-go-served-user-site-bundle-and-dagger-build-implementation-guide.md`.
- Created diary document: `reference/01-investigation-diary.md`.
- Replaced `tasks.md` with phased implementation checklist.
- Added `scripts/smoke-embedded-site.sh` to validate the embedded runtime once implemented.
- Loaded relevant skills:
  - `go-web-dagger-pnpm-build`
  - `go-web-frontend-embed`
- Inspected key files:
  - `pkg/server/server.go`
  - `cmd/pyxis/main.go`
  - `cmd/pyxis/cmds/serve.go`
  - `Makefile`
  - `web/package.json`
  - `web/pnpm-workspace.yaml`
  - `web/packages/pyxis-user-site/package.json`
  - `web/packages/pyxis-user-site/vite.config.ts`
  - `web/packages/pyxis-user-site/src/App.tsx`
  - `web/packages/pyxis-user-site/src/api/publicApi.ts`

### Why

- A single Go binary serving both API and public SPA is the simplest early deployment artifact.
- Dagger provides a reproducible Node/pnpm build without relying on local Node state.
- `go:embed` makes the production binary self-contained.
- The public site is safer to embed first than the staff app because it does not require auth.

### What worked

- The Go backend already uses standard library `http.NewServeMux`, matching the skill requirements.
- API routes are explicitly registered before any future SPA route, making route-order guidance straightforward.
- The frontend workspace root already defaults `pnpm run build` to `pyxis-user-site`, which simplifies build command design.
- The public site already has Vite output in `web/packages/pyxis-user-site/dist`, confirming the path to copy.

### What didn't work

- No command failures occurred during the investigation.
- The generic Dagger skill template assumes `web/dist`, which does not match this repo. The guide documents the required adaptation.

### What I learned

- `web/package.json` pins `pnpm@9.0.0`; the Dagger template default of `10.15.0` must not be copied as-is.
- `web/packages/pyxis-user-site` has BrowserRouter routes (`/shows/:id`, `/archive`, `/book`, `/about`) that require SPA fallback from Go.
- `publicApi.ts` still defaults to `http://localhost:8080`; same-origin embedded serving requires default `''`.

### What was tricky to build

- The key subtlety is route shadowing. The SPA handler must be registered last and must reserve `/api`, `/auth`, `/health`, and `/flyers`; otherwise API calls can accidentally return `index.html`, which then causes confusing protobuf decode errors in the frontend.
- The second subtlety is missing-bundle behavior. Strict production serving should probably fail if `index.html` is missing, while backend-only development benefits from a lenient warning. The guide calls out this decision explicitly.

### What warrants a second pair of eyes

- Whether initial server wiring should be strict or lenient when the bundle is missing.
- Whether the public site should be embedded by default in all release builds or only behind an `embed` build tag.
- Whether CI should use Dagger or local pnpm for the web build step.

### What should be done in the future

- Implement `cmd/build-web` first with local fallback.
- Add `internal/web` package.
- Wire SPA handler after API routes.
- Run smoke script after building embedded binary.

### Code review instructions

- Start with `cmd/build-web/main.go` once implemented; verify it copies `web/packages/pyxis-user-site/dist`, not `web/dist`.
- Review `internal/web/static.go` for reserved-prefix behavior.
- Review `pkg/server/server.go` to ensure SPA routes are registered last.
- Validate with `scripts/smoke-embedded-site.sh`.

### Technical details

**Commands run:**

```bash
docmgr ticket create-ticket --ticket PYXIS-USER-SITE-GO-EMBED-DAGGER --title "Serve Pyxis User Site from Go Backend with Dagger pnpm Build" --topics frontend,go,api-integration,protobuf
docmgr doc add --ticket PYXIS-USER-SITE-GO-EMBED-DAGGER --doc-type design-doc --title "Go-Served User Site Bundle and Dagger Build Implementation Guide"
docmgr doc add --ticket PYXIS-USER-SITE-GO-EMBED-DAGGER --doc-type reference --title "Investigation Diary"
```

**Evidence commands:**

```bash
nl -ba web/package.json | sed -n '1,220p'
nl -ba web/packages/pyxis-user-site/package.json | sed -n '1,220p'
nl -ba web/packages/pyxis-user-site/vite.config.ts | sed -n '1,160p'
nl -ba pkg/server/server.go | sed -n '68,145p'
nl -ba cmd/pyxis/cmds/serve.go | sed -n '1,220p'
find web/packages/pyxis-user-site/dist -maxdepth 2 -type f | head -20
```

**Smoke script usage after implementation:**

```bash
BASE_URL=http://localhost:8080 \
  ttmp/2026/04/26/PYXIS-USER-SITE-GO-EMBED-DAGGER--serve-pyxis-user-site-from-go-backend-with-dagger-pnpm-build/scripts/smoke-embedded-site.sh
```

## Step 2: First Embedded Public Site Implementation

After closing the public component taxonomy ticket, I moved on to turning the public user site into a Go-served application bundle.

### What changed

Added a build command:

```text
cmd/build-web/main.go
```

The command supports two paths:

```bash
go run ./cmd/build-web
BUILD_WEB_LOCAL=1 go run ./cmd/build-web
```

The Dagger path uses:

```text
node:22
pnpm@9.0.0
CacheVolume: pyxis-user-site-pnpm-store
```

The local path uses the workspace `pnpm` installed on the host.

Both paths copy:

```text
web/packages/pyxis-user-site/dist
```

to:

```text
internal/web/embed/public
```

### Important build correction

The initial Dagger implementation only ran:

```bash
pnpm --filter pyxis-user-site build
```

That failed inside the clean container because `pyxis-types` and `pyxis-components` had not built their `dist/` outputs yet. The error looked like:

```text
Cannot find module 'pyxis-types' or its corresponding type declarations.
```

The final build command now builds workspace dependencies explicitly before the user site:

```bash
pnpm --filter pyxis-types build
pnpm --filter pyxis-components build
pnpm --filter pyxis-user-site build
```

This keeps the container build reproducible instead of relying on stale local `dist/` folders.

### Embed package

Added:

```text
internal/web/generate.go
internal/web/embed.go
internal/web/embed_none.go
internal/web/static.go
internal/web/embed/public/.keep
```

Runtime behavior:

- `go build -tags embed` uses `//go:embed embed/public`.
- Normal `go run` / `go build` uses disk fallback from `internal/web/embed/public`.
- Missing bundle is lenient: public routes return `503` with a helpful `run make build-web` message instead of failing server construction.
- The SPA handler reserves `/api`, `/auth`, `/health`, and `/flyers` so missing backend paths do not become `index.html`.

### Server wiring

`pkg/server/server.go` now imports `internal/web` and serves:

```text
/flyers/*       -> ./data/flyers file server
public routes   -> embedded/disk public user-site SPA fallback
```

The flyer route matters because show payloads can contain `/flyers/...` URLs from the local flyer store.

### ServeMux conflict and fix

The first server wiring attempted to register:

```go
mux.Handle("GET /", web.NewSPAHandler())
```

The runtime panicked on startup:

```text
panic: pattern "GET /" conflicts with pattern "/health":
GET / matches fewer methods than /health, but has a more general path pattern
```

Go 1.22's `http.ServeMux` rejects that method-specific catch-all alongside the existing method-specific and methodless routes. Instead of forcing wildcard patterns into the mux, I added:

```text
pkg/server/spa_fallback.go
```

`spaFallbackHandler` runs the primary API mux first and only delegates buffered `404` responses to `web.NewSPAHandler()`. This preserves API/auth/health/flyer priority and lets React Router browser paths like `/shows/42` return `index.html`.

### Makefile workflow

Added:

```make
build-web
    go run ./cmd/build-web

generate-web
    go generate ./internal/web

build-embed: build-web
    go build -tags embed -o bin/pyxis ./cmd/pyxis

serve-embed: build-web
    go run -tags embed ./cmd/pyxis serve --bind :8080
```

### Validation

Passed:

```bash
go test ./...
BUILD_WEB_LOCAL=1 go run ./cmd/build-web
go generate ./internal/web
go build -tags embed -o bin/pyxis ./cmd/pyxis
```

Runtime smoke test with PostgreSQL/migrations and the embedded binary:

```bash
docker compose up -d db
go run ./cmd/pyxis migrate up
bin/pyxis serve --bind 127.0.0.1:8090
curl -i http://127.0.0.1:8090/
curl -i http://127.0.0.1:8090/shows/42
curl -i http://127.0.0.1:8090/api/public/shows
curl -i http://127.0.0.1:8090/assets/index-DUH46VSk.js
```

Observed:

```text
/                    -> HTTP/1.1 200 OK
/shows/42            -> HTTP/1.1 200 OK
/api/public/shows    -> HTTP/1.1 200 OK, Content-Type: application/json
/assets/index-*.js   -> HTTP/1.1 200 OK
```

This confirms API routes still return JSON and browser routes/static assets are served from the Go binary.
