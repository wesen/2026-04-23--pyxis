# Tasks

## Phase 1: Build command

- [x] Add `cmd/build-web/main.go`.
- [x] Read pnpm version from `web/package.json` (`pnpm@9.0.0`).
- [x] Use Dagger image `node:22` with corepack-enabled pnpm.
- [x] Use Dagger cache volume `pyxis-user-site-pnpm-store`.
- [x] Build workspace dependencies (`pyxis-types`, `pyxis-components`) before `pyxis-user-site`.
- [x] Export/copy `web/packages/pyxis-user-site/dist` to `internal/web/embed/public`.
- [x] Add `BUILD_WEB_LOCAL=1` local fallback path.
- [x] Validate local fallback: `BUILD_WEB_LOCAL=1 go run ./cmd/build-web`.
- [x] Validate Dagger path: `go run ./cmd/build-web` via `go generate ./internal/web`.

## Phase 2: Internal web embed package

- [x] Add `internal/web/embed.go` with `//go:build embed` and `//go:embed embed/public`.
- [x] Add `internal/web/embed_none.go` for disk fallback when not using `-tags embed`.
- [x] Add `internal/web/static.go` with SPA handler and fallback to `index.html`.
- [x] Add `internal/web/generate.go` with `//go:generate go run ../../cmd/build-web`.
- [x] Add `internal/web/embed/public/.keep`.
- [x] Validate `go generate ./internal/web`.

## Phase 3: Server wiring

- [x] Import `internal/web` in `pkg/server/server.go`.
- [x] Register all existing API/auth/health routes before SPA handler.
- [x] Use a `spaFallbackHandler` wrapper instead of `mux.Handle("GET /", ...)` because Go 1.22 ServeMux rejects a method-specific root catch-all mixed with existing API routes.
- [x] Avoid wildcard SPA registration for the same ServeMux conflict reason.
- [x] Reserve `/api`, `/auth`, `/health`, and `/flyers` so they are not served by SPA fallback.
- [x] Decide strict vs lenient missing-bundle startup behavior: lenient handler returns 503 for public pages when bundle is absent.
- [x] Validate `/api/public/shows` still returns JSON, not HTML.
- [x] Validate `/shows/42` returns `index.html`.

## Phase 4: Frontend production URL alignment

- [x] Ensure `web/packages/pyxis-user-site/src/api/publicApi.ts` defaults `API_BASE_URL` to `''`.
- [x] Ensure `web/packages/pyxis-user-site/vite.config.ts` has dev proxy for local HMR development.
- [x] Confirm embedded production bundle requests `/api/public/...` relative to the Go origin.

## Phase 5: Makefile and developer workflow

- [x] Add `build-web` target.
- [x] Add `generate-web` target.
- [x] Add `build-embed` target.
- [x] Add `serve-embed` target.
- [x] Document smoke-test commands in ticket diary.

## Phase 6: Validation

- [x] `pnpm --dir web --filter pyxis-user-site build` passes as part of `cmd/build-web` after dependency builds.
- [x] `BUILD_WEB_LOCAL=1 go run ./cmd/build-web` passes.
- [x] `go run ./cmd/build-web` passes through `go generate ./internal/web` Dagger path.
- [x] `go generate ./internal/web` passes.
- [x] `go build -tags embed -o bin/pyxis ./cmd/pyxis` passes.
- [x] Runtime curl smoke tests pass for `/`, `/shows/42`, `/assets/...`, `/api/public/shows`, and `/health`.

## Phase 7: CI/release follow-up

- [ ] Add CI step to run `go generate ./internal/web`.
- [ ] Add CI step to run `go build -tags embed ./cmd/pyxis`.
- [x] Decide whether release artifacts should always use `-tags embed`: yes for public single-binary releases.
- [x] Document local fallback for developers without Docker/Dagger in the diary.
