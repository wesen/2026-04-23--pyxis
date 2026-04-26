# Tasks

## Phase 1: Build command

- [ ] Add `cmd/build-web/main.go`.
- [ ] Read pnpm version from `web/package.json` (`pnpm@9.0.0`).
- [ ] Use Dagger image `node:22` with corepack-enabled pnpm.
- [ ] Use Dagger cache volume `pyxis-user-site-pnpm-store`.
- [ ] Build only `pyxis-user-site` with `pnpm --filter pyxis-user-site build`.
- [ ] Export/copy `web/packages/pyxis-user-site/dist` to `internal/web/embed/public`.
- [ ] Add `BUILD_WEB_LOCAL=1` local fallback path.
- [ ] Validate local fallback: `BUILD_WEB_LOCAL=1 go run ./cmd/build-web`.
- [ ] Validate Dagger path: `go run ./cmd/build-web`.

## Phase 2: Internal web embed package

- [ ] Add `internal/web/embed.go` with `//go:build embed` and `//go:embed embed/public`.
- [ ] Add `internal/web/embed_none.go` for disk fallback when not using `-tags embed`.
- [ ] Add `internal/web/static.go` with SPA handler and fallback to `index.html`.
- [ ] Add `internal/web/generate.go` with `//go:generate go run ../../cmd/build-web`.
- [ ] Add `internal/web/embed/public/.keep`.
- [ ] Validate `go generate ./internal/web`.

## Phase 3: Server wiring

- [ ] Import `internal/web` in `pkg/server/server.go`.
- [ ] Register all existing API/auth/health routes before SPA handler.
- [ ] Register SPA handler last with `mux.Handle("GET /", spaHandler)`.
- [ ] Register wildcard SPA handler with `mux.Handle("GET /{filepath...}", spaHandler)`.
- [ ] Reserve `/api`, `/auth`, `/health`, and `/flyers` so they are not served by SPA fallback.
- [ ] Decide strict vs lenient missing-bundle startup behavior.
- [ ] Validate `/api/public/shows` still returns JSON, not HTML.
- [ ] Validate `/shows/42` returns `index.html`.

## Phase 4: Frontend production URL alignment

- [ ] Ensure `web/packages/pyxis-user-site/src/api/publicApi.ts` defaults `API_BASE_URL` to `''`.
- [ ] Ensure `web/packages/pyxis-user-site/vite.config.ts` has dev proxy for local HMR development.
- [ ] Confirm embedded production bundle requests `/api/public/...` relative to the Go origin.

## Phase 5: Makefile and developer workflow

- [ ] Add `build-web` target.
- [ ] Add `generate-web` target.
- [ ] Add `build-embed` target.
- [ ] Add `serve-embed` target.
- [ ] Document smoke-test commands in README or ticket diary.

## Phase 6: Validation

- [ ] `pnpm --dir web --filter pyxis-user-site build` passes.
- [ ] `BUILD_WEB_LOCAL=1 go run ./cmd/build-web` passes.
- [ ] `go run ./cmd/build-web` passes or falls back clearly if Dagger unavailable.
- [ ] `go generate ./internal/web` passes.
- [ ] `go build -tags embed -o bin/pyxis ./cmd/pyxis` passes.
- [ ] Runtime curl smoke tests pass for `/`, `/shows/42`, `/assets/...`, `/api/public/shows`, and `/health`.

## Phase 7: CI/release follow-up

- [ ] Add CI step to run `go generate ./internal/web`.
- [ ] Add CI step to run `go build -tags embed ./cmd/pyxis`.
- [ ] Decide whether release artifacts should always use `-tags embed`.
- [ ] Document local fallback for developers without Docker/Dagger.
