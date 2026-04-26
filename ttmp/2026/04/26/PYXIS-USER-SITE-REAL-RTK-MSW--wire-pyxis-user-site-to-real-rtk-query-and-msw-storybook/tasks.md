# Tasks

## Phase 1: Vite proxy and public API base URL

- [ ] Add Vite proxy to `web/packages/pyxis-user-site/vite.config.ts` for `/api`, `/auth`, and `/flyers`.
- [ ] Change `API_BASE_URL` default in `web/packages/pyxis-user-site/src/api/publicApi.ts` from `http://localhost:8080` to `''`.
- [ ] Verify `GET /api/public/shows` works through Vite proxy at `localhost:3000` with Go running on `localhost:8080`.
- [ ] Document optional `VITE_API_URL` override behavior.

## Phase 2: Fix public MSW response envelopes

- [ ] Update `web/packages/pyxis-components/src/mocks/handlers.ts` so `GET /api/public/shows` returns `{ shows: seedShows }`, not `seedShows`.
- [ ] Update `GET /api/public/archive` handler to return `{ shows: seedArchive }`, not `seedArchive`.
- [ ] Update archive search handler to return `{ shows: filteredArchive }`.
- [ ] Ensure archive stats mock uses camelCase fields (`totalShows`, `totalAttendance`, `yearsRunning`, `uniqueArtists`).
- [ ] Ensure booking confirmation mock uses camelCase `submissionId`.
- [ ] Ensure validation errors use `{ error: { code, message } }`.
- [ ] Build `pyxis-components`.
- [ ] Build `pyxis-user-site`.

## Phase 3: Convert user-site stories to MSW v2 handlers

- [ ] Replace old `{ type: 'rest', method, url, sts, body }` descriptors in `stories/Shows.stories.tsx` with `http.get` handlers.
- [ ] Replace old descriptors in `stories/Archive.stories.tsx`.
- [ ] Replace old descriptors in `stories/Book.stories.tsx`.
- [ ] Replace old descriptors in `stories/ShowDetail.stories.tsx`.
- [ ] Ensure all list stories return protobuf wrapper objects.
- [ ] Ensure all mutation stories return camelCase protobuf JSON.
- [ ] Keep `PublicPages.stories.tsx` as canonical full-page route story harness.

## Phase 4: Public page runtime polish

- [ ] Add explicit archive-list error state in `Archive.tsx`.
- [ ] Add archive-stats error fallback or degraded rendering in `Archive.tsx`.
- [ ] Add booking submission error display in `Book.tsx`.
- [ ] Confirm `Shows.tsx` loading/error/empty states still work with fixed MSW wrappers.
- [ ] Confirm `ShowDetail.tsx` not-found and loading states still work with fixed MSW wrappers.
- [ ] Consider improving `ShowGrid` click API to preserve `show.id` rather than matching by artist/date.

## Phase 5: Type/protobuf cleanup

- [ ] Audit imports from `web/packages/pyxis-user-site/src/api/types.ts`.
- [ ] Remove `api/types.ts` if no longer needed, or document it as a temporary compatibility layer.
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

- [ ] `cd web/packages/pyxis-types && pnpm build` passes.
- [ ] `cd web/packages/pyxis-components && pnpm build` passes.
- [ ] `cd web/packages/pyxis-user-site && pnpm build` passes.
- [ ] `cd web && pnpm build` passes.
- [ ] Manual runtime test through Vite proxy passes with Go backend.
- [ ] Storybook renders public page stories without Go backend running.
- [ ] No `fromJson` shape errors appear in console.
- [ ] Diary updated with implementation results.
- [ ] Changelog updated.
