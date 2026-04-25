# Tasks

This ticket now covers two related architecture tracks:

- **Track A:** RTK Query + shared `pyxis-types` migration.
- **Track B:** public component CSS extraction + theming stabilization.

Keep the tracks in separate commits where possible. Do not mix RTK Query provider changes with component CSS extraction in the same commit.

---

## Shared Phase 0 — Orientation and safety checks

- [ ] Read `design-doc/01-rtk-query-and-pyxis-types-migration-guide.md` fully before data-layer work.
- [ ] Read `design-doc/02-public-component-css-extraction-and-theming-guide.md` fully before component styling work.
- [ ] Run baseline checks from repo root: `cd web && pnpm -r typecheck`.
- [ ] Confirm current user-site Storybook still runs on port `6007` if page stories are needed.
- [ ] Confirm component Storybook still runs on port `6006` for component visual work.
- [ ] Confirm component Storybook should run from tmux: `cd web && pnpm --filter pyxis-components storybook`.
- [ ] Create a working branch and keep commits small by phase.
- [ ] Do not commit generated files under `prototype-design/visual-comparisons/` unless explicitly requested.

---

# Track A — RTK Query and `pyxis-types`

## A1 — Add the shared `pyxis-types` workspace package

- [ ] Create `web/packages/pyxis-types/package.json`.
- [ ] Create `web/packages/pyxis-types/tsconfig.json` and `tsconfig.build.json` following workspace conventions.
- [ ] Create `web/packages/pyxis-types/src/public.ts` with public API domain types.
- [ ] Create `web/packages/pyxis-types/src/index.ts` that re-exports the public types.
- [ ] Add package exports for `.` and optionally `./public`.
- [ ] Add `pyxis-types` workspace dependency to `pyxis-components` if components/mocks import shared types.
- [ ] Add `pyxis-types` workspace dependency to `pyxis-user-site`.
- [ ] Run `cd web && pnpm --filter pyxis-types typecheck`.
- [ ] Run `cd web && pnpm --filter pyxis-types build` if build scripts are added.

## A2 — Move duplicated API/domain types to `pyxis-types`

- [ ] Replace `web/packages/pyxis-user-site/src/api/types.ts` definitions with `pyxis-types` imports/re-exports.
- [ ] Replace `web/packages/pyxis-components/src/mocks/types.ts` definitions with `pyxis-types` imports/re-exports where appropriate.
- [ ] Keep component-only mock/admin types local only if they are not public API contracts.
- [ ] Update `web/packages/pyxis-components/src/mocks/handlers.ts` to import public API types from `pyxis-types`.
- [ ] Update public component props that currently import from `../../mocks/types` to import from `pyxis-types`.
- [ ] Decide whether to keep compatibility re-export files (`mocks/types.ts`, `api/types.ts`) temporarily.
- [ ] Run `cd web && pnpm -r typecheck`.
- [ ] Run `rg "src/api/types|mocks/types" web/packages -g'*.ts' -g'*.tsx'` and decide which imports should remain.

## A3 — Add Redux Toolkit and RTK Query infrastructure

- [ ] Add dependencies to `pyxis-user-site`: `@reduxjs/toolkit` and `react-redux`.
- [ ] Keep `@tanstack/react-query` and devtools temporarily until migration is complete.
- [ ] Create `web/packages/pyxis-user-site/src/store.ts`.
- [ ] Consider exporting `makeStore()` for Storybook/test store isolation.
- [ ] Create `web/packages/pyxis-user-site/src/api/publicApi.ts` using `createApi` and `fetchBaseQuery`.
- [ ] Configure `VITE_API_URL` handling in the RTK base query.
- [ ] Configure API reducer and middleware in the store.
- [ ] Add typed app hooks if needed: `useAppDispatch`, `useAppSelector`.
- [ ] Add an API error-message helper for RTK Query errors.
- [ ] Run `cd web && pnpm --filter pyxis-user-site typecheck`.

## A4 — Replace React Query hooks with RTK Query hooks

- [ ] Replace `useUpcomingShows` with `useGetUpcomingShowsQuery` or a compatibility wrapper.
- [ ] Replace `useShow` with `useGetShowQuery`.
- [ ] Replace `useArchive` with `useGetArchiveQuery`.
- [ ] Replace `useArchiveStats` with `useGetArchiveStatsQuery`.
- [ ] Replace `useSubmitBooking` with `useSubmitBookingMutation` or a compatibility wrapper.
- [ ] Update `Shows.tsx`, `ShowDetail.tsx`, `Archive.tsx`, `Book.tsx`, and `BookSuccess.tsx` imports/usages if direct generated hooks are used.
- [ ] Remove `apiFetch`, `client.ts`, and endpoint constants only after no imports remain, or keep endpoint constants if still useful.
- [ ] Run `rg "@tanstack|useQuery|useMutation|QueryClient|apiFetch" web/packages/pyxis-user-site/src` and resolve remaining usage.

## A5 — Wire providers and Storybook

- [ ] Replace `QueryClientProvider` in `App.tsx` with Redux `<Provider store={store}>`.
- [ ] Add a Storybook decorator/provider for user-site stories that uses the same store setup.
- [ ] Prefer per-story `makeStore()` if RTK Query cache leaks between stories.
- [ ] Confirm MSW handlers still intercept `/api/public/*` requests.
- [ ] Run user-site Storybook stories and verify page data loads from MSW.
- [ ] Run `cd web && pnpm --filter pyxis-user-site typecheck`.

## A6 — RTK Query tests, validation, and cleanup

- [ ] Run `cd web && pnpm -r typecheck`.
- [ ] Run `cd web && pnpm -r test` if tests are configured and stable.
- [ ] Run relevant user-site Storybook smoke checks.
- [ ] Remove `@tanstack/react-query` dependencies after migration if no longer used.
- [ ] Remove React Query devtools if no longer used.
- [ ] Update documentation and package READMEs.
- [ ] Commit RTK/types migration in small logical commits.

## A7 — RTK Query optional compatibility and follow-up

- [ ] Add compatibility wrapper hooks preserving current names (`useUpcomingShows`, etc.) if page migration should be incremental.
- [ ] Add generated schema or validation layer if backend contracts are unstable.
- [ ] Add API error normalizer tests.
- [ ] Consider code generation from OpenAPI/protobuf later.

---

# Track B — Public component CSS extraction and theming

## B1 — CSS extraction groundwork

- [ ] Decide canonical public component taxonomy before polishing overlapping components.
- [ ] Record taxonomy decisions for `EthosGrid` vs `EthosStrip`.
- [ ] Record taxonomy decisions for `BookingSpaceAside` vs `VenueCard`.
- [ ] Record taxonomy decisions for `FindUsBlock` vs `SpaceInfo`.
- [ ] Record taxonomy decisions for `ShowTile`/`ShowGrid` vs `PubShowRow`.
- [ ] Record taxonomy decisions for `ArchiveShowRow` vs `PubShowRow`.
- [ ] Confirm every canonical public component should self-import its own CSS file.
- [ ] Confirm `web/packages/pyxis-components/src/tokens/tokens.css` is loaded in Storybook and consuming package entrypoints as needed.
- [ ] Confirm `pyxisPart` is the stable selector API for roots and semantic subparts.
- [ ] Record that `data-pyxis-component` / `data-pyxis-part` are the repo-specific adaptation of the themable Storybook skill's generic `data-widget` / `data-part` pattern.
- [ ] Decide and document whether `unstyled` mode is in scope now or deferred; recommended initial decision is deferred.
- [ ] Document the styling layer model: base component CSS → global tokens → component-local CSS variables → consumer/theme overrides.
- [ ] Run `rg "style=\{\{" web/packages/pyxis-components/src/public -g'*.tsx'` and save/inspect remaining inline-style targets.
- [ ] Run `rg "#[0-9A-Fa-f]{3,6}|rgba?\(" web/packages/pyxis-components/src/public -g'*.tsx'` and save/inspect hardcoded color targets.

## B2 — Extract CSS for small public molecules

Start here to establish the pattern before touching large organisms.

- [x] Extract `SafetyNote` styles into `SafetyNote.css`.
- [x] Extract `ArchiveStats` styles into `ArchiveStats.css`.
- [x] Extract `TicketStub` styles into `TicketStub.css`.
- [x] Extract `LineupRow` styles into `LineupRow.css`.
- [x] Extract `YearGroup` styles into `YearGroup.css`.
- [x] Extract `Poster` styles into `Poster.css`.
- [x] Extract `ShowTypeChips` styles into `ShowTypeChips.css`.
- [x] Add/verify root `className` and `data-pyxis-component` selectors for each component.
- [x] Add/verify important `data-pyxis-part` selectors for titles, metadata, badges, chips, and actions.
- [x] Replace hardcoded colors with tokens or component-local CSS variables.
- [x] Run `cd web && pnpm --filter pyxis-components typecheck`.
- [x] Run matching molecule visual-diff configs for touched components.
- [x] Commit this batch separately.

## B3 — Extract CSS for show-list and archive components

- [ ] Extract `PubShowRow` styles into `PubShowRow.css` if the component remains canonical.
- [ ] Extract `ArchiveShowRow` styles into `ArchiveShowRow.css`.
- [ ] Extract `ArchiveShowList` styles into `ArchiveShowList.css`.
- [ ] Extract `ArchiveSearchFilters` styles into `ArchiveSearchFilters.css`.
- [ ] Extract `ShowTile` styles into `ShowTile.css`.
- [ ] Extract `ShowGrid` styles into `ShowGrid.css`.
- [ ] Ensure `ShowGrid` owns only layout and does not duplicate `ShowTile` internals.
- [ ] Ensure `ArchiveShowList` owns only list layout and does not duplicate `ArchiveShowRow` internals.
- [ ] Add long-title/long-genre Storybook cases where wrapping matters.
- [ ] Run `cd web && pnpm --filter pyxis-components typecheck`.
- [ ] Run matching visual-diff configs for touched show/archive components.
- [x] Commit this batch separately.

## B4 — Extract CSS for show-detail and booking components

- [ ] Extract `PublicPageHeader` styles into `PublicPageHeader.css`.
- [ ] Extract `ShowDetailHeader` styles into `ShowDetailHeader.css`.
- [ ] Extract `ShowMetaStrip` styles into `ShowMetaStrip.css`.
- [ ] Extract `ReserveTicketCard` styles into `ReserveTicketCard.css`.
- [ ] Extract `BookingForm` styles into `BookingForm.css`.
- [ ] Extract `BookingSpaceAside` styles into `BookingSpaceAside.css` if canonical.
- [ ] Extract `BookingRules` styles into `BookingRules.css`.
- [ ] Extract `BookingSuccess` styles into `BookingSuccess.css`.
- [ ] Extract `SaferSpaceAgreement` styles into `SaferSpaceAgreement.css`.
- [ ] Preserve form label/control relationships in `BookingForm`.
- [ ] Add tokenized `:focus-visible`, `:disabled`, error, and success styles where relevant.
- [ ] Keep only truly dynamic form styles inline, preferably as CSS custom properties.
- [ ] Run `cd web && pnpm --filter pyxis-components typecheck`.
- [ ] Run matching visual-diff configs for touched detail/booking components.
- [x] Commit this batch separately.

## B5 — Extract CSS for about/home/footer/public shell components

- [ ] Extract `AboutHero` styles into `AboutHero.css`.
- [ ] Extract `AboutIntro` styles into `AboutIntro.css`.
- [ ] Extract `EthosGrid` styles into `EthosGrid.css` if canonical.
- [ ] Extract `EthosStrip` styles into `EthosStrip.css` if retained.
- [ ] Extract `CollectiveList` styles into `CollectiveList.css`.
- [ ] Extract `FindUsBlock` styles into `FindUsBlock.css` if canonical.
- [ ] Extract `SpaceInfo` styles into `SpaceInfo.css` if retained.
- [ ] Extract `VenueCard` styles into `VenueCard.css` if retained.
- [ ] Extract `MailingListCTA` styles into `MailingListCTA.css`.
- [ ] Extract `PubHero` styles into `PubHero.css`.
- [ ] Extract `PubFooter` styles into `PubFooter.css`.
- [ ] Clean up `PubNav.css` to use tokens and richer `data-pyxis-part` selectors.
- [ ] Run `cd web && pnpm --filter pyxis-components typecheck`.
- [ ] Run matching visual-diff configs for touched about/home/footer components.
- [x] Commit this batch separately.

## B6 — Storybook theme and variant coverage

- [ ] Add or update default stories for every canonical public component touched by CSS extraction.
- [ ] Add dark-theme or alternate-theme story wrappers for representative public components.
- [ ] Add theme override stories that set component-local CSS variables directly.
- [ ] Add narrow/mobile container stories where responsive behavior matters.
- [ ] Add long-content stories for titles/descriptions/lineups that may wrap.
- [ ] Add form state stories for `BookingForm`: default, validation error, submitting/disabled, success handoff if applicable.
- [ ] Add focus/interactive stories where feasible.
- [ ] Add `unstyled` stories only for components where `unstyled` is actually implemented.
- [ ] Add custom slot/renderer stories only for components that expose slots/renderers.
- [ ] Verify component stories do not require app data fetching unless intentionally page-level.
- [ ] Run component Storybook smoke checks on `http://localhost:6006`.

## B7 — CSS extraction validation and cleanup

- [ ] Run `cd web && pnpm --filter pyxis-components typecheck`.
- [ ] Run `cd web && pnpm -r typecheck` after larger batches.
- [ ] Re-run `rg "style=\{\{" web/packages/pyxis-components/src/public -g'*.tsx'` and classify any remaining inline styles as dynamic/acceptable or TODO.
- [ ] Re-run `rg "#[0-9A-Fa-f]{3,6}|rgba?\(" web/packages/pyxis-components/src/public -g'*.tsx'` and remove remaining TSX hardcoded colors where possible.
- [ ] Re-run `rg "#[0-9A-Fa-f]{3,6}|rgba?\(" web/packages/pyxis-components/src/public -g'*.css'` and replace hardcoded CSS colors with tokens where possible.
- [ ] Run all relevant public molecule visual-diff configs touched by extraction.
- [ ] Run all relevant public organism visual-diff configs touched by extraction.
- [ ] Update `prototype-design/visual-diff/comparisons/component-system/component-parity-map.json` with extraction status and any accepted deltas.
- [ ] Update this ticket changelog with completed CSS extraction batches.
- [ ] Commit cleanup separately.

## B8 — Optional follow-up after CSS extraction

- [ ] Add a public component theming ADR.
- [ ] Review canonical components for slot/renderer APIs (`ShowTile`, `ShowGrid`, `ArchiveShowList`, `PublicPageHeader`, `BookingForm`) and add only where a concrete page/story needs them.
- [ ] Add module/export checks for every canonical public component: folder-local CSS, exported component, exported useful prop types, no private internal imports by consumers.
- [ ] Add a public component taxonomy ADR.
- [ ] Remove deprecated/duplicate public components after app pages use canonical components.
- [ ] Add stronger lint/check tooling for static inline styles in public components.
- [ ] Add a Storybook theme switcher/global decorator if useful.
- [ ] Add page-level visual comparisons only after component CSS extraction and data-layer stabilization.

---

# Final ticket validation and publication

- [ ] Update `index.md` to link both design documents.
- [ ] Update `changelog.md` with both RTK/types and CSS extraction documentation work.
- [ ] Update `reference/01-investigation-diary.md` with the CSS extraction documentation step.
- [ ] Relate key source files to the ticket with `docmgr doc relate` if using docmgr relations.
- [ ] Run `docmgr doctor --ticket PYXIS-RTK-TYPES-MIGRATION --stale-after 30`.
- [ ] Create a reMarkable upload dry run for the ticket bundle.
- [ ] Upload the ticket bundle to reMarkable.
- [ ] Verify the uploaded document exists in the target reMarkable folder.
