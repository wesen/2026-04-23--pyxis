# Tasks

This ticket builds the Pyxis public site pages in `pyxis-user-site` from the canonical `pyxis-components` component system and validates the page stories on user-site Storybook port `6007` against standalone prototype baselines.

Keep commits small. Update the diary after each phase or important failure.

---

## Phase 0 — Orientation, setup, and baseline capture

- [x] Read `design/01-public-site-page-build-analysis-design-implementation-guide.md` fully before editing pages.
- [x] Read prior theming ADR: `../PYXIS-RTK-TYPES-MIGRATION--migrate-public-site-data-layer-to-rtk-query-and-shared-pyxis-types-package/design-doc/03-public-component-theming-adr.md`.
- [x] Read prior taxonomy ADR: `../PYXIS-RTK-TYPES-MIGRATION--migrate-public-site-data-layer-to-rtk-query-and-shared-pyxis-types-package/design-doc/04-public-component-taxonomy-adr.md`.
- [x] Run `cd web && pnpm --filter pyxis-user-site typecheck`.
- [x] Run `cd web && pnpm -r typecheck`.
- [x] Start or confirm user-site Storybook on port `6007`.
- [x] Smoke check `public-site-pages--shows-desktop` iframe on `http://localhost:6007`.
- [x] Smoke check `public-site-pages--show-detail-desktop` iframe on `http://localhost:6007`.
- [x] Smoke check `public-site-pages--archive-desktop` iframe on `http://localhost:6007`.
- [x] Smoke check `public-site-pages--book-desktop` iframe on `http://localhost:6007`.
- [x] Smoke check `public-site-pages--about-desktop` iframe on `http://localhost:6007`.
- [x] Confirm standalone prototype pages are reachable through the prototype server.
- [x] Create page-level visual-diff config directory under `prototype-design/visual-diff/comparisons/public-pages`.
- [x] Add first draft `shows-desktop.css-visual-diff.yml`.
- [x] Capture current Shows page baseline before changing code.
- [x] Record baseline commands and results in `reference/01-diary.md`.
- [x] Commit page visual-diff scaffolding separately.

---

## Phase 1 — Shared public shell and page layout

- [x] Inspect `web/packages/pyxis-user-site/src/components/layout/Layout.tsx`.
- [x] Inspect `PubNav` and `PubFooter` usage in the app shell.
- [x] Decide whether public page max-width/background belongs in `Layout`, individual page CSS, or Storybook shell.
- [x] Add shared page CSS helper if useful, for example `src/pages/PublicPage.css`.
- [x] Ensure every page has a semantic `<main>` element where appropriate.
- [x] Ensure every page has stable `data-page` selector.
- [x] Ensure major sections use stable `data-section` selectors.
- [x] Reduce obvious page wrapper inline styles where safe.
- [x] Run `cd web && pnpm --filter pyxis-user-site typecheck`.
- [x] Smoke check all desktop page stories.
- [x] Commit shared public shell/page wrapper changes separately.

---

## Phase 2 — Shows page

Target files:

```text
web/packages/pyxis-user-site/src/pages/Shows.tsx
prototype-design/standalone/public/shows.html
```

- [x] Inspect `shows.html` and identify top-level sections.
- [x] Compare current `Shows.tsx` section map against prototype sections.
- [x] Decide whether `PubHero` remains in the Shows page.
- [x] Replace `PubShowRow` list with canonical `ShowGrid` / `ShowTile` if prototype is poster-grid based.
- [x] Keep `MailingListCTA` if present in baseline.
- [x] Preserve RTK Query behavior through `useUpcomingShows()` or generated RTK Query hooks.
- [x] Preserve loading state.
- [x] Preserve empty state with `Empty` or an agreed public empty state.
- [x] Preserve error state with `getApiErrorMessage`.
- [x] Add or update Shows page CSS file if page layout needs CSS.
- [ ] Add long-content or empty Shows Storybook variants if useful.
- [x] Run `cd web && pnpm --filter pyxis-user-site typecheck`.
- [x] Run `shows-desktop` visual-diff config.
- [x] Tune page and component usage until desktop result is acceptable or documented.
- [ ] Add `shows-mobile` config after desktop selector scopes are stable.
- [x] Update diary with exact diffs and accepted differences.
- [x] Commit Shows page changes separately.

---

## Phase 3 — Show detail page

Target files:

```text
web/packages/pyxis-user-site/src/pages/ShowDetail.tsx
prototype-design/standalone/public/detail.html
```

- [x] Inspect `detail.html` and identify sections.
- [x] Replace custom hero markup with `ShowDetailHeader` if matching baseline.
- [x] Add `ShowMetaStrip` for show metadata.
- [x] Replace ad hoc ticket/action area with `ReserveTicketCard`.
- [x] Keep `LineupRow` for lineup entries.
- [x] Add `SafetyNote` where capacity/sell-out/safety note appears.
- [x] Decide `VenueCard` vs `BookingSpaceAside` for detail-page aside.
- [x] Document the venue-card decision in the diary.
- [x] Preserve route-param parsing and invalid/not-found behavior.
- [x] Preserve loading state.
- [x] Add or update ShowDetail page CSS file.
- [ ] Add cancelled/not-found/long-lineup story variants if useful.
- [x] Run `cd web && pnpm --filter pyxis-user-site typecheck`.
- [x] Add and run `show-detail-desktop` visual-diff config.
- [ ] Add `show-detail-mobile` config after desktop stabilizes.
- [x] Update diary with exact diffs and accepted differences.
- [x] Commit ShowDetail changes separately.

---

## Phase 4 — Archive page

Target files:

```text
web/packages/pyxis-user-site/src/pages/Archive.tsx
prototype-design/standalone/public/archive.html
```

- [x] Inspect `archive.html` and identify sections.
- [x] Replace local page header with `PublicPageHeader` if matching baseline.
- [x] Replace local search row with `ArchiveSearchFilters` if props fit.
- [x] Extend `ArchiveSearchFilters` carefully if the page needs missing props.
- [x] Keep `ArchiveStats` for totals.
- [x] Replace local `YearGroups` with `YearGroup`.
- [x] Replace local `ArchiveRow` with `ArchiveShowRow`.
- [x] Use `ArchiveShowList` for grouped row layout.
- [x] Preserve search state and `useArchive(search)` behavior.
- [x] Preserve loading count behavior or replace with a canonical loading state.
- [ ] Add empty filtered-state story if useful.
- [x] Add or update Archive page CSS file.
- [x] Run `cd web && pnpm --filter pyxis-user-site typecheck`.
- [x] Add and run `archive-desktop` visual-diff config.
- [ ] Add `archive-mobile` config after desktop stabilizes.
- [x] Update diary with exact diffs and accepted differences.
- [x] Commit Archive changes separately.

---

## Phase 5 — Booking page and success state

Target files:

```text
web/packages/pyxis-user-site/src/pages/Book.tsx
web/packages/pyxis-user-site/src/pages/BookSuccess.tsx
prototype-design/standalone/public/book.html
```

- [x] Inspect `book.html` and identify sections.
- [x] Replace local title/intro with `PublicPageHeader` if matching baseline.
- [x] Keep `BookingForm` as the form implementation.
- [x] Preserve `useSubmitBooking()` RTK Query mutation behavior.
- [x] Preserve successful navigation to `/book/success` or intentionally replace with inline success state.
- [x] Replace `SpaceInfo` with `BookingSpaceAside` if baseline supports taxonomy decision.
- [x] Keep `BookingRules` where shown.
- [x] Add `SaferSpaceAgreement` where shown.
- [x] Use `BookingSuccess` in `BookSuccess.tsx` or add a page story using it.
- [x] Add submitting and validation-error stories if useful.
- [x] Add or update Book page CSS file.
- [x] Run `cd web && pnpm --filter pyxis-user-site typecheck`.
- [x] Add and run `book-desktop` visual-diff config.
- [ ] Add `book-mobile` config after desktop stabilizes.
- [x] Update diary with exact diffs and accepted differences.
- [x] Commit Book/BookSuccess changes separately.

---

## Phase 6 — About page

Target files:

```text
web/packages/pyxis-user-site/src/pages/About.tsx
prototype-design/standalone/public/about.html
```

- [ ] Inspect `about.html` and identify sections.
- [ ] Keep `AboutHero` for the headline section if matching baseline.
- [ ] Replace local prose blocks with `AboutIntro`.
- [ ] Prefer `EthosGrid` over `EthosStrip` for about-page ethos content.
- [ ] Add `CollectiveList`.
- [ ] Replace local visit/contact block with `FindUsBlock`.
- [ ] Decide how to handle the hero image placeholder.
- [ ] Add or update About page CSS file.
- [ ] Add long-copy or mobile story variant if useful.
- [x] Run `cd web && pnpm --filter pyxis-user-site typecheck`.
- [ ] Add and run `about-desktop` visual-diff config.
- [ ] Add `about-mobile` config after desktop stabilizes.
- [x] Update diary with exact diffs and accepted differences.
- [ ] Commit About changes separately.

---

## Phase 7 — Page-level visual-diff suite and report

- [ ] Ensure all desktop page configs exist.
- [ ] Ensure all mobile page configs exist if in scope.
- [ ] Run all page configs with `css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/public-pages`.
- [ ] Produce a page-level validation report under this ticket's `reference/` directory.
- [ ] Record each page's pixel diff, CSS diff notes, and accepted differences.
- [ ] Classify remaining page inline styles.
- [ ] Classify remaining use of deferred components: `PubShowRow`, `SpaceInfo`, `EthosStrip`.
- [ ] Update public component taxonomy ADR if page work changes decisions.
- [ ] Commit page-level visual-diff report separately.

---

## Phase 8 — Final validation and publication

- [x] Run `cd web && pnpm --filter pyxis-user-site typecheck`.
- [x] Run `cd web && pnpm -r typecheck`.
- [ ] Run `cd web && pnpm --filter pyxis-user-site build`.
- [ ] Run `cd web && pnpm --filter pyxis-user-site build-storybook`.
- [ ] Attempt `cd web && pnpm -r test`; if it still fails because packages have no test files, document the known issue.
- [ ] Run search: `rg "style=\{\{" web/packages/pyxis-user-site/src/pages -g'*.tsx'`.
- [ ] Run search: `rg "PubShowRow|SpaceInfo|EthosStrip" web/packages/pyxis-user-site/src web/packages/pyxis-user-site/stories -g'*.tsx'`.
- [ ] Run search: `rg "@tanstack|QueryClient|apiFetch" web/packages/pyxis-user-site -g'*.ts' -g'*.tsx' -g'package.json'`.
- [ ] Update `index.md` with final document links.
- [ ] Update `changelog.md` with final implementation summary.
- [x] Run `docmgr doctor --ticket PYXIS-PUBLIC-PAGES --stale-after 30`.
- [x] Create reMarkable dry-run bundle.
- [x] Upload final ticket bundle to reMarkable.
- [x] Verify upload exists in `/ai/2026/04/24/PYXIS-PUBLIC-PAGES`.

