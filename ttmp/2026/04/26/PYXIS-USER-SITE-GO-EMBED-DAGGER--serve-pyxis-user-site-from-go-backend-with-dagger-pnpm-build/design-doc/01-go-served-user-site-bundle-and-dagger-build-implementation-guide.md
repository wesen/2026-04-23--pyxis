---
Title: Go-Served User Site Bundle and Dagger Build Implementation Guide
Ticket: PYXIS-USER-SITE-GO-EMBED-DAGGER
Status: active
Topics:
    - frontend
    - go
    - api-integration
    - protobuf
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: Makefile
      Note: Developer build target integration point.
    - Path: cmd/pyxis/cmds/serve.go
      Note: Existing Glazed serve command that will serve API plus embedded public site.
    - Path: pkg/server/server.go
      Note: Current Go ServeMux route registration; SPA handler must be added after API/auth routes.
    - Path: web/package.json
      Note: pnpm workspace root and packageManager pin used by Dagger build.
    - Path: web/packages/pyxis-user-site/package.json
      Note: Public site build script and dependencies.
    - Path: web/packages/pyxis-user-site/src/App.tsx
      Note: BrowserRouter routes that require Go SPA fallback.
    - Path: web/packages/pyxis-user-site/src/api/publicApi.ts
      Note: Public API base URL must become same-origin for embedded production.
    - Path: web/packages/pyxis-user-site/vite.config.ts
      Note: Vite output directory and dev server config.
    - Path: web/pnpm-workspace.yaml
      Note: Workspace package layout for Dagger pnpm install/build.
ExternalSources: []
Summary: Implementation guide for building the Pyxis public user site with pnpm/Dagger and serving the Vite bundle from the Go backend as a single deployable binary.
LastUpdated: 2026-04-26T14:05:00-04:00
WhatFor: Use this guide to add a Dagger-backed web build pipeline, embed the public user-site bundle into Go, and serve the SPA alongside the existing protobuf API.
WhenToUse: Before implementing production serving for the Pyxis public user-facing site, or when onboarding an intern to the Go+Vite+Dagger single-binary deployment pattern.
---


# Go-Served User Site Bundle and Dagger Build Implementation Guide

## 1. Executive Summary

The next production step for Pyxis is to serve the public user-facing React/Vite site from the Go backend. The public site is a good first target because it does not require staff authentication and already uses public `/api/public/...` endpoints. The desired deployment artifact is a single Go binary that serves both the protobuf-backed API and the compiled user-site bundle.

The recommended architecture is the standard Go + embedded SPA pattern:

```text
web/packages/pyxis-user-site/       React/Vite source
  -> pnpm build                     Vite outputs dist/
  -> cmd/build-web                  Dagger or local fallback copies dist/
  -> internal/web/embed/public/     stable Go embed source
  -> internal/web.NewSPAHandler     serves assets + index.html fallback
  -> pkg/server.New                 registers API routes first, SPA last
  -> go build -tags embed ./cmd/pyxis
```

Use Dagger as the reproducible build path and keep a local fallback for developer convenience. Use Go's standard `net/http` `ServeMux` only. Do not introduce a third-party router. API routes must stay registered before the SPA fallback so `/api/...`, `/auth/...`, `/health`, and `/flyers/...` are never swallowed by React Router fallback.

## 2. Problem Statement and Scope

### 2.1 Problem

The Go backend currently serves APIs only. `pkg/server/server.go` creates a `http.NewServeMux()` and registers `/health`, public API routes, auth routes, staff routes, and app routes, but it does not register a static/SPA handler. The public user site is built by Vite under `web/packages/pyxis-user-site/dist`, but that output is not copied into the Go tree or embedded into the binary.

For production, we need a repeatable build path that:

1. Builds the user site with the workspace's pinned pnpm version.
2. Copies the Vite output into a stable Go embed directory.
3. Lets `go build -tags embed` create a single binary containing the public site.
4. Lets `go run` without `-tags embed` serve the same generated files from disk during local testing.
5. Ensures API routes continue to work and unknown public routes such as `/shows/42` return `index.html` for React Router.

### 2.2 Scope

This ticket covers:

- Dagger/pnpm web build pipeline.
- Internal Go web package for embedded/disk static assets.
- SPA fallback handler for React Router.
- Server route wiring.
- Makefile and validation workflow.
- CI/release considerations.
- Relationship to Vite proxy and RTK Query.

This ticket does not cover:

- Staff app production serving. The first production bundle should be the public user site only.
- Keycloak/staff authentication.
- CDN deployment. The design keeps that as an alternative.
- Rewriting public site routing or API data fetching, except where required by same-origin serving.

## 3. Current-State Analysis

### 3.1 Go server route surface

`pkg/server/server.go` constructs the router in `server.New`. The relevant section starts at line 68:

```go
mux := http.NewServeMux()
mux.HandleFunc("/health", ...)
```

Public API routes are registered on lines 75-80:

```go
mux.HandleFunc("GET /api/public/shows", s.handleListPublicShows)
mux.HandleFunc("GET /api/public/shows/{id}", s.handleGetPublicShow)
mux.HandleFunc("GET /api/public/archive", s.handleGetArchive)
mux.HandleFunc("GET /api/public/archive/stats", s.handleGetArchiveStats)
mux.HandleFunc("POST /api/public/submissions", s.handleCreateSubmission)
```

Staff and auth routes continue through line 128. The server assigns `s.handler = mux` at line 130 and `Start` serves it via `http.Server{Handler: s.handler}` on lines 134-150.

There is currently no route registered for `/`, `/shows/{id}`, `/archive`, `/book`, or static assets. Those are Vite/browser routes only.

### 3.2 Go CLI and build entrypoint

`cmd/pyxis/main.go` builds a Glazed/Cobra command tree. `cmd/pyxis/cmds/serve.go` defines the `serve` command and starts the HTTP server. The serve command defaults to `0.0.0.0:8080` and `postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable`.

This means production serving can be added without creating a second runtime binary. `pyxis serve` should serve the API and, after this ticket, the public site bundle.

### 3.3 Web workspace layout

The frontend workspace root is `web/package.json`. It is private, uses workspaces from `web/pnpm-workspace.yaml`, and pins `packageManager` to `pnpm@9.0.0` on line 30. The root scripts currently default to the public user site:

```json
"dev": "pnpm --filter pyxis-user-site dev",
"build": "pnpm --filter pyxis-user-site build",
"preview": "pnpm --filter pyxis-user-site preview"
```

This is convenient for the Dagger build command because `pnpm --dir web run build` will build the public site by default.

### 3.4 Public user site build

`web/packages/pyxis-user-site/package.json` defines:

```json
"build": "tsc -b && vite build"
```

`web/packages/pyxis-user-site/vite.config.ts` sets `build.outDir = 'dist'`, so the compiled bundle lands in `web/packages/pyxis-user-site/dist`. A previous build already produced files such as:

```text
web/packages/pyxis-user-site/dist/index.html
web/packages/pyxis-user-site/dist/assets/index-*.js
web/packages/pyxis-user-site/dist/assets/Shows-*.js
```

The Dagger build must copy **that package dist**, not `web/dist`, unless we change the Vite config. Because this is a pnpm workspace, the source package path matters.

### 3.5 Public user site runtime paths

`web/packages/pyxis-user-site/src/App.tsx` defines BrowserRouter routes:

- `/` and `/shows`
- `/shows/:id`
- `/archive`
- `/book`
- `/book/success`
- `/about`
- wildcard not-found route

When served from Go, direct requests to `/shows/42` must return `index.html`; React Router handles the route client-side. Direct requests to `/api/public/shows/42` must continue to hit the Go API handler, not the SPA fallback.

### 3.6 Public API base URL

`web/packages/pyxis-user-site/src/api/publicApi.ts` currently defaults to `http://localhost:8080`. For a same-origin Go-served bundle, this should default to `''` so fetches go to `/api/public/...` on the same host as the HTML. This is also compatible with Vite proxy development.

## 4. Proposed Architecture

## 4.1 Build architecture

```text
Developer / CI
  |
  | go run ./cmd/build-web
  v
Dagger container node:22
  |
  | corepack prepare pnpm@9.0.0 --activate
  | pnpm install --frozen-lockfile or pnpm install --prefer-offline
  | pnpm --filter pyxis-user-site build
  v
web/packages/pyxis-user-site/dist/
  |
  | copy recursively
  v
internal/web/embed/public/
  |
  | go:embed with -tags embed
  v
pyxis binary
```

The build command should support local fallback:

```bash
go run ./cmd/build-web
BUILD_WEB_LOCAL=1 go run ./cmd/build-web
```

The local path is helpful on machines without Docker/Dagger and for fast debugging.

## 4.2 Runtime architecture

```text
GET /api/public/shows       -> Go API handler (protojson)
GET /api/app/shows          -> Go staff API handler (auth)
GET /auth/...               -> Go auth handler
GET /health                 -> Go health handler
GET /assets/index-abc.js    -> embedded static asset
GET /shows/42               -> index.html SPA fallback
GET /archive                -> index.html SPA fallback
GET /book                   -> index.html SPA fallback
```

Register the SPA handler **last** after all API/auth routes.

## 4.3 Directory layout

Add:

```text
cmd/build-web/main.go
internal/web/generate.go
internal/web/embed.go
internal/web/embed_none.go
internal/web/static.go
internal/web/embed/public/.keep
```

Use `internal/web/embed/public/` as the stable embed source. Vite can output wherever it wants; the build command copies the final output into the Go embed tree.

## 5. Detailed Implementation Plan

### 5.1 Add `cmd/build-web`

Create `cmd/build-web/main.go` based on the Dagger pnpm template, adapted for this repo:

- `defaultBuilderImage = "node:22"`
- `defaultPNPMVersion = "9.0.0"` (from `web/package.json`)
- CacheVolume name: `pyxis-user-site-pnpm-store`
- Source directory: repo `web/`
- Build command: `pnpm --filter pyxis-user-site build` or root `pnpm run build`
- Dist source: `web/packages/pyxis-user-site/dist`
- Embed destination: `internal/web/embed/public`

Important adaptation from the generic template: the template assumes `web/dist`; Pyxis uses a pnpm workspace package and Vite outputs to `web/packages/pyxis-user-site/dist`.

Pseudocode:

```go
func runDagger(ctx context.Context, repoRoot string) error {
  webDir := filepath.Join(repoRoot, "web")
  pnpmVersion := readPNPMVersion(webDir) // 9.0.0

  source := client.Host().Directory(webDir, Exclude: []string{"node_modules", "packages/*/dist"})

  container := client.Container().
    From("node:22").
    WithEnvVariable("PNPM_HOME", "/pnpm").
    WithMountedCache("/pnpm/store", client.CacheVolume("pyxis-user-site-pnpm-store")).
    WithDirectory("/src", source).
    WithWorkdir("/src").
    WithExec([]string{"sh", "-lc", "corepack enable && corepack prepare pnpm@"+pnpmVersion+" --activate"}).
    WithExec([]string{"pnpm", "install", "--prefer-offline"}).
    WithExec([]string{"pnpm", "--filter", "pyxis-user-site", "build"})

  export container.Directory("/src/packages/pyxis-user-site/dist")
  copy to internal/web/embed/public
}
```

### 5.2 Add `internal/web` package

Files:

`embed.go`:

```go
//go:build embed
package web

import (
  "embed"
  "io/fs"
)

//go:embed embed/public
var embeddedFS embed.FS
var PublicFS, _ = fs.Sub(embeddedFS, "embed/public")
```

`embed_none.go`:

```go
//go:build !embed
package web

var PublicFS fs.FS = os.DirFS(filepath.Join(findRoot(), "internal", "web", "embed", "public"))
```

`static.go` should expose:

```go
type SPAOptions struct {
  APIPrefixes []string
}

func NewSPAHandler(opts *SPAOptions) (http.Handler, error)
```

Prefer multiple reserved prefixes, not only one prefix:

```go
reserved := []string{"/api", "/auth", "/health", "/flyers"}
```

The handler behavior:

1. If path starts with a reserved prefix, return 404. It should never try to serve API/auth paths.
2. If `/`, serve `index.html`.
3. If a file exists in `PublicFS`, serve it via `http.FileServer`.
4. Otherwise, serve `index.html` for React Router fallback.

### 5.3 Wire into `pkg/server/server.go`

Import:

```go
import internalweb "github.com/go-go-golems/pyxis/internal/web"
```

After all API/auth routes are registered and before `s.handler = mux`:

```go
spaHandler, err := internalweb.NewSPAHandler(&internalweb.SPAOptions{
  APIPrefixes: []string{"/api", "/auth", "/health", "/flyers"},
})
if err != nil {
  log.Warn().Err(err).Msg("public site bundle unavailable; SPA routes disabled")
} else {
  mux.Handle("GET /", spaHandler)
  mux.Handle("GET /{filepath...}", spaHandler)
}
```

Design decision: for production, failing to load `index.html` should probably be fatal. For local backend-only development, it is convenient to allow the server to start without the bundle. Choose one behavior explicitly:

- **Strict production default:** return error from `server.New` or make `New` return `(*Server, error)`.
- **Lenient development default:** log warning and skip SPA handler if bundle missing.

Recommended: make this configurable with `cfg.ServeWeb` or a `--serve-web`/`--no-serve-web` flag later. For initial implementation, lenient startup is safer because it does not break API-only development.

### 5.4 Add `go generate`

Add `internal/web/generate.go`:

```go
//go:generate go run ../../cmd/build-web
package web
```

Because `internal/web` is two levels below repo root, verify the relative path. From `internal/web`, `../../cmd/build-web` points to `cmd/build-web`.

Validate:

```bash
go generate ./internal/web
```

### 5.5 Makefile targets

Add targets:

```make
.PHONY: build-web generate-web build-embed serve-embed

build-web:
	go run ./cmd/build-web

generate-web:
	go generate ./internal/web

build-embed: generate-web
	go build -tags embed -o bin/pyxis ./cmd/pyxis

serve-embed: build-embed
	./bin/pyxis serve --bind :8080
```

Keep existing `generate` for sqlc/protobuf, or add a separate `generate-all` that runs sqlc/buf/web.

### 5.6 RTK Query base URL alignment

For Go-served production, `publicApi.ts` should use same-origin requests:

```ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
```

This change belongs to the previous user-site RTK/MSW ticket, but it is also required here. If it is not done before embedding, the embedded app will still try to call `http://localhost:8080` explicitly, which is wrong for production deployments under a different host.

## 6. Validation Plan

### 6.1 Local web build

```bash
BUILD_WEB_LOCAL=1 go run ./cmd/build-web
find internal/web/embed/public -maxdepth 2 -type f | head
```

Expected:

```text
internal/web/embed/public/index.html
internal/web/embed/public/assets/index-*.js
internal/web/embed/public/assets/*.css
```

### 6.2 Dagger web build

```bash
go run ./cmd/build-web
```

Expected: same output, with Dagger logs and pnpm cache reuse.

### 6.3 Go generate

```bash
go generate ./internal/web
```

Expected: same as build-web.

### 6.4 Embedded binary build

```bash
go build -tags embed -o bin/pyxis ./cmd/pyxis
```

Expected: binary compiles without needing external `internal/web/embed/public` files at runtime.

### 6.5 Runtime smoke test

```bash
docker compose up -d
go run ./cmd/pyxis migrate up
./bin/pyxis serve --bind :8080
```

Then:

```bash
curl -i http://localhost:8080/
curl -i http://localhost:8080/shows/42
curl -i http://localhost:8080/assets/<known-asset>.js
curl -i http://localhost:8080/api/public/shows
curl -i http://localhost:8080/health
```

Expected:

- `/` returns `200 text/html` with `index.html`.
- `/shows/42` returns `200 text/html` with `index.html`.
- `/assets/...` returns JS/CSS asset with correct content type.
- `/api/public/shows` returns protobuf JSON from backend, not HTML.
- `/health` returns `{"status":"ok"}`.

## 7. Risks and Design Decisions

### 7.1 Route shadowing risk

The SPA fallback must be registered last. If it is registered before `/api`, it may return `index.html` for API calls. This would cause confusing frontend decode errors because `fromJson` would receive HTML.

### 7.2 Missing bundle in API-only development

If the server requires `index.html` at startup, `go run ./cmd/pyxis serve` will fail until developers run `go generate ./internal/web`. This is annoying during backend-only work. The initial implementation can log a warning and skip SPA routes when the bundle is missing.

### 7.3 Multiple frontend bundles

The repo contains a staff app and public user site. This ticket should embed only the public user site. Do not accidentally build the staff app or Storybook into the public bundle.

### 7.4 pnpm version mismatch

The skill template uses pnpm `10.15.0`, but this repo pins `pnpm@9.0.0` in `web/package.json`. The implementation must read or set pnpm `9.0.0` unless the repo intentionally upgrades pnpm.

### 7.5 Workspace dist path

The generic Dagger template assumes `web/dist`. Pyxis outputs to `web/packages/pyxis-user-site/dist`. The build command must export/copy the package dist path.

### 7.6 API base URL

If `publicApi.ts` keeps `http://localhost:8080`, embedded production might work only on localhost and fail elsewhere. Same-origin default (`''`) is required.

## 8. Alternatives Considered

### 8.1 Serve from CDN/static host

A CDN could serve the public site and talk to the Go API separately. This is fine later, but a single binary is simpler for early deployment and avoids CORS/reverse-proxy complexity.

### 8.2 Keep Vite preview in production

Not recommended. Vite preview is not a production server and would require running Node alongside Go.

### 8.3 Build frontend in Dockerfile only

A Dockerfile multi-stage build can work, but the Dagger + local fallback command is reusable across CI, local development, and release builds. It also encodes pnpm cache behavior explicitly.

### 8.4 Embed directly from `web/packages/pyxis-user-site/dist`

Not recommended. Embedding from the package dist ties Go embed paths directly to frontend output layout. Copying into `internal/web/embed/public` creates a stable Go contract.

## 9. Implementation Phases

### Phase 1: Build command

- Add `cmd/build-web/main.go`.
- Adapt pnpm version to `9.0.0` from `web/package.json`.
- Build `pyxis-user-site` only.
- Copy `web/packages/pyxis-user-site/dist` to `internal/web/embed/public`.
- Validate local fallback and Dagger path.

### Phase 2: Internal web package

- Add `internal/web/embed.go`.
- Add `internal/web/embed_none.go`.
- Add `internal/web/static.go`.
- Add `internal/web/generate.go`.
- Add `.keep` under `internal/web/embed/public`.

### Phase 3: Server wiring

- Import `internal/web` in `pkg/server/server.go`.
- Register SPA handler after all API/auth routes.
- Reserve `/api`, `/auth`, `/health`, `/flyers`.
- Decide strict vs lenient missing-bundle behavior.

### Phase 4: Frontend API alignment

- Ensure `publicApi.ts` defaults to same-origin base URL.
- Ensure `vite.config.ts` has dev proxy for local HMR development.
- Confirm embedded production fetches `/api/public/...` relative to the Go origin.

### Phase 5: Makefile and docs

- Add Makefile targets: `build-web`, `generate-web`, `build-embed`, `serve-embed`.
- Document local and Dagger build commands.
- Document smoke-test commands.

### Phase 6: CI/release follow-up

- Add CI steps to install Go, run `go generate ./internal/web`, then `go build -tags embed ./cmd/pyxis`.
- Add release workflow later if needed.

## 10. Intern Checklist

Before coding:

1. Read this guide.
2. Read `go-web-dagger-pnpm-build` skill.
3. Read `go-web-frontend-embed` skill.
4. Inspect `web/package.json` and confirm pnpm version.
5. Run `pnpm --dir web --filter pyxis-user-site build` manually once.

During coding:

1. Implement `cmd/build-web` with local fallback first.
2. Add `internal/web` package.
3. Wire server routes last.
4. Validate API routes still return JSON.
5. Validate React routes return HTML.

After coding:

1. `go generate ./internal/web`.
2. `go build -tags embed ./cmd/pyxis`.
3. Runtime curl smoke tests.
4. Update diary and tasks.
5. Commit.

## 11. References

### Repository files

- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/server.go` — existing Go route registration and server startup
- `/home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/cmds/serve.go` — `pyxis serve` command
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/package.json` — pnpm workspace root and package manager pin
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/pnpm-workspace.yaml` — workspace package layout
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/package.json` — user-site build script
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/vite.config.ts` — Vite output path and dev server config
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/App.tsx` — React Router route list that requires SPA fallback
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/api/publicApi.ts` — same-origin API base URL requirement
- `/home/manuel/code/wesen/2026-04-23--pyxis/Makefile` — build target integration point

### Skill references

- `go-web-dagger-pnpm-build` — Dagger + pnpm cache + embed/public pattern
- `go-web-frontend-embed` — Go `net/http` SPA serving and embed workflow
