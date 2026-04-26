# Tasks

## Phase 1: Vite proxy and public API base URL

- [x] Add Vite proxy to `web/packages/pyxis-user-site/vite.config.ts` for `/api`, `/auth`, and `/flyers`.
- [x] Change `API_BASE_URL` default in `web/packages/pyxis-user-site/src/api/publicApi.ts` from `http://localhost:8080` to `''`.
- [x] Verify `GET /api/public/shows` works through Vite proxy at `localhost:3000` with Go running on `localhost:8080`.
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

## Phase 3: Clean up user-site Storybook page stories

- [x] Remove redundant standalone `Pages/*` route stories (`Shows`, `Archive`, `Book`, `ShowDetail`, `About`) to avoid confusing them with the canonical route harness.
- [x] Keep `PublicPages.stories.tsx` as the canonical full-page route story harness.
- [x] Ensure canonical page stories use shared MSW handlers returning protobuf JSON envelopes.
- [x] Ensure shared MSW mutation handlers return camelCase protobuf JSON.
- [x] Verify Storybook index contains only `Public Site/Pages` page stories for `pyxis-user-site`.

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
- [x] Manual runtime test through Vite proxy passes with Go backend.
- [x] `cd web/packages/pyxis-user-site && pnpm build-storybook` passes.
- [x] Storybook renders public page stories without Go backend running.
- [x] No `fromJson` shape errors appear in console after converting mock protobuf messages through `toJson(...)` helpers.
- [x] Diary updated with implementation results.
- [x] Changelog updated.

## Phase 8: Public component decomposition follow-up

- [x] Locate existing component decomposition and Storybook organization playbooks.
- [ ] Use `docs/playbooks/06-react-widget-folder-storybook-css-organization.md` when moving public route stories/components toward colocated widget folders.
- [ ] Use `docs/playbooks/07-react-application-decomposition-and-component-reuse.md` to decide page vs organism vs molecule extraction boundaries.
- [ ] Use `docs/component-system-and-public-site-components.md` to keep public-site domain components distinct from generic design-system atoms/molecules/organisms.
- [ ] Create a separate cleanup ticket for public-site component decomposition if this becomes larger than RTK/MSW wiring.
