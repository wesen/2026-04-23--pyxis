# Tasks

## Phase 1: Vite proxy and public API base URL

- [x] Add Vite proxy to `web/packages/pyxis-user-site/vite.config.ts` for `/api`, `/auth`, and `/flyers`.
- [x] Change `API_BASE_URL` default in `web/packages/pyxis-user-site/src/api/publicApi.ts` from `http://localhost:8080` to `''`.
- [ ] Verify `GET /api/public/shows` works through Vite proxy at `localhost:3000` with Go running on `localhost:8080`.
- [x] Document optional `VITE_API_URL` override behavior.

## Phase 2: Fix public MSW response envelopes

- [x] Update `web/packages/pyxis-components/src/mocks/handlers.ts` so `GET /api/public/shows` returns `{ shows: seedShows }`, not `seedShows`.
- [x] Update `GET /api/public/archive` handler to return `{ shows: seedArchive }`, not `seedArchive`.
- [x] Update archive search handler to return `{ shows: filteredArchive }`.
- [x] Ensure archive stats mock uses camelCase fields (`totalShows`, `totalAttendance`, `yearsRunning`, `uniqueArtists`).
- [x] Ensure booking confirmation mock uses camelCase `submissionId`.
- [x] Ensure validation errors use `{ error: { code, message } }`.
- [x] Build `pyxis-components`.
- [x] Build `pyxis-user-site`.

## Phase 3: Convert user-site stories to MSW v2 handlers

- [x] Replace old `{ type: 'rest', method, url, sts, body }` descriptors in `stories/Shows.stories.tsx` with `http.get` handlers.
- [x] Replace old descriptors in `stories/Archive.stories.tsx`.
- [x] Replace old descriptors in `stories/Book.stories.tsx`.
- [x] Replace old descriptors in `stories/ShowDetail.stories.tsx`.
- [x] Ensure all list stories return protobuf wrapper objects.
- [x] Ensure all mutation stories return camelCase protobuf JSON.
- [x] Keep `PublicPages.stories.tsx` as canonical full-page route story harness.

## Phase 4: Public page runtime polish

- [x] Add explicit archive-list error state in `Archive.tsx`.
- [x] Add archive-stats error fallback or degraded rendering in `Archive.tsx`.
- [x] Add booking submission error display in `Book.tsx`.
- [x] Confirm `Shows.tsx` loading/error/empty states still work with fixed MSW wrappers.
- [x] Confirm `ShowDetail.tsx` not-found and loading states still work with fixed MSW wrappers.
- [ ] Consider improving `ShowGrid` click API to preserve `show.id` rather than matching by artist/date.

## Phase 5: Type/protobuf cleanup

- [x] Audit imports from `web/packages/pyxis-user-site/src/api/types.ts`.
- [x] Remove `api/types.ts` if no longer needed, or document it as a temporary compatibility layer.
- [ ] Audit uses of legacy `LineupEntry` from `pyxis-types/src/public.ts`.
- [ ] Prefer generated `Show_LineupEntry` for protobuf-backed lineup data.
- [ ] Keep purely visual display types local to components.

## Phase 6: Public fixture scraping automation

- [x] Add public scraper script to ticket workspace: `scripts/scrape-public-msw-seed.mjs`.
- [ ] Run scraper against seeded local Go server.
- [ ] Store generated fixture JSON under ticket `sources/` for review.
- [ ] Decide whether scraper belongs in repo after review.
- [ ] Decide whether generated fixtures belong in `pyxis-components/src/mocks/fixtures/`.
- [ ] Document fixture refresh workflow.

## Phase 7: Validation and delivery

- [x] `cd web/packages/pyxis-types && pnpm build` passes.
- [x] `cd web/packages/pyxis-components && pnpm build` passes.
- [x] `cd web/packages/pyxis-user-site && pnpm build` passes.
- [x] `cd web && pnpm build` passes.
- [ ] Manual runtime test through Vite proxy passes with Go backend.
- [x] `cd web/packages/pyxis-user-site && pnpm build-storybook` passes.
- [ ] Storybook renders public page stories without Go backend running.
- [ ] No `fromJson` shape errors appear in console.
- [x] Diary updated with implementation results.
- [x] Changelog updated.
