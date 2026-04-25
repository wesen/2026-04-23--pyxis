# Changelog

## 2026-04-24

- Initial workspace created.
- Added detailed RTK Query and `pyxis-types` migration guide for intern handoff.
- Added detailed public component CSS extraction and theming guide for intern handoff.
- Added chronological investigation diary.
- Replaced placeholder task list with phased implementation tasks for both tracks: RTK/types and CSS extraction/theming.

### Related Files

- `/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-RTK-TYPES-MIGRATION--migrate-public-site-data-layer-to-rtk-query-and-shared-pyxis-types-package/design-doc/01-rtk-query-and-pyxis-types-migration-guide.md` — RTK Query and `pyxis-types` design/implementation guide
- `/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-RTK-TYPES-MIGRATION--migrate-public-site-data-layer-to-rtk-query-and-shared-pyxis-types-package/design-doc/02-public-component-css-extraction-and-theming-guide.md` — public component CSS extraction/theming guide
- `/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-RTK-TYPES-MIGRATION--migrate-public-site-data-layer-to-rtk-query-and-shared-pyxis-types-package/reference/01-investigation-diary.md` — investigation diary
- `/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-RTK-TYPES-MIGRATION--migrate-public-site-data-layer-to-rtk-query-and-shared-pyxis-types-package/tasks.md` — phased task list
- Extracted `SafetyNote` static inline styles into `web/packages/pyxis-components/src/public/SafetyNote/SafetyNote.css`.
- Added a `SafetyNote` Storybook theme override story using component-local CSS variables.
- Validated `SafetyNote` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../safety-note-default.css-visual-diff.yml`; current pixel diff remains `9.2839% | 2855/30752` with CSS differences limited to box-sizing/font-family.
- Extracted `ArchiveStats` static inline styles into `web/packages/pyxis-components/src/public/ArchiveStats/ArchiveStats.css`.
- Added `ArchiveStats` part selectors for `item`, `value`, and `label`, plus theme/narrow Storybook stories.
- Validated `ArchiveStats` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../archive-stats-default.css-visual-diff.yml`; current pixel diff is `7.0987% | 4634/65280`, with root CSS diff reduced to a 1px height difference.
- Extracted `TicketStub` static inline styles into `web/packages/pyxis-components/src/public/TicketStub/TicketStub.css`.
- Added `TicketStub` part selectors for `eyebrow`, `title`, `divider`, `meta`, `price`, and `age`, plus long-content and theme override Storybook stories.
- Validated `TicketStub` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../ticket-stub-default.css-visual-diff.yml`; current pixel diff is `0.3144% | 94/29900`.
- Extracted `LineupRow` static inline styles into `web/packages/pyxis-components/src/public/LineupRow/LineupRow.css`.
- Added `LineupRow` part selectors for `time`, `artist-block`, `artist`, and `role`, plus support-role and theme override Storybook stories.
- Validated `LineupRow` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../lineup-row-default.css-visual-diff.yml`; current pixel diff is `component 5.3400% | 1115/20880`, `root 6.5709% | 1372/20880`.
- Extracted `YearGroup` static inline styles into `web/packages/pyxis-components/src/public/YearGroup/YearGroup.css`.
- Added `YearGroup` part selectors for `header`, `year`, and `count`, plus singular-count and theme override Storybook stories.
- Validated `YearGroup` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../year-group-default.css-visual-diff.yml`; current pixel diff is `0.0000% | 0/35280`.
- Extracted `Poster` static layout/art/text styles into `web/packages/pyxis-components/src/public/Poster/Poster.css`, leaving per-kind art colors/backgrounds as CSS custom properties.
- Added `Poster` style override support for component-local CSS variables and a theme override Storybook story.
- Validated `Poster` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../poster-redroom.css-visual-diff.yml`; current pixel diff is `5.3101% | 4846/91260`.
- Extracted `ShowTypeChips` static inline styles into `web/packages/pyxis-components/src/public/ShowTypeChips/ShowTypeChips.css`.
- Added `ShowTypeChips` part selectors for `chip`, active state via `data-state`, focus-visible styling, wrapped layout and theme override Storybook stories.
- Validated `ShowTypeChips` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../show-type-chips-default.css-visual-diff.yml`; current pixel diff is `0.0102% | 4/39200`.
- Completed the initial B2 small public molecule CSS extraction batch: `SafetyNote`, `ArchiveStats`, `TicketStub`, `LineupRow`, `YearGroup`, `Poster`, and `ShowTypeChips`.
- Started B3 show/archive CSS extraction by extracting `ArchiveShowRow` styles into `web/packages/pyxis-components/src/public/ArchiveShowRow/ArchiveShowRow.css`.
- Added `ArchiveShowRow` part selectors for `date`, `name`, `tag`, and `cta`, plus long-name and theme override Storybook stories.
- Validated `ArchiveShowRow` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../archive-show-row-default.css-visual-diff.yml`; current pixel diff is `0.2671% | 100/37440`.
- Extracted `ArchiveShowList` container styling into `web/packages/pyxis-components/src/public/ArchiveShowList/ArchiveShowList.css`.
- Refactored `ArchiveShowList` defaults into a named constant and kept the list container responsible only for layout, delegating row visuals to `ArchiveShowRow`.
- Added long-content and theme override Storybook stories for `ArchiveShowList`.
- Validated `ArchiveShowList` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../archive-show-list-default.css-visual-diff.yml`; current pixel diff is `0.4888% | 549/112320`.
- Extracted `ArchiveSearchFilters` styles into `web/packages/pyxis-components/src/public/ArchiveSearchFilters/ArchiveSearchFilters.css`.
- Added part selectors for `input`, `years`, and `year-button`, active state via `data-state`, and tokenized focus-visible styles.
- Added wrapped and theme override Storybook stories for `ArchiveSearchFilters`.
- Validated `ArchiveSearchFilters` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../archive-search-filters-default.css-visual-diff.yml`; current pixel diff is `0.0000% | 0/46080`.
- Extracted `ShowTile` styles into `web/packages/pyxis-components/src/public/ShowTile/ShowTile.css`.
- Added `ShowTile` part selectors for `info`, `title`, `meta`, `price`, and `ticket-pill`, compact state via `data-compact`, focus-visible styling, and theme/sold-out Storybook stories.
- Kept ticket-pill kind colors as component-local CSS variables.
- Validated `ShowTile` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../show-tile-redroom.css-visual-diff.yml`; current pixel diff is `4.0975% | 4890/119340`.
- Extracted `ShowGrid` layout into `web/packages/pyxis-components/src/public/ShowGrid/ShowGrid.css`.
- Kept `ShowGrid` responsible only for grid layout and compact state, delegating tile internals to `ShowTile`.
- Added a theme override Storybook story that demonstrates inherited `ShowTile` CSS variables through the grid.
- Validated `ShowGrid` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../show-grid-desktop.css-visual-diff.yml`; current pixel diff is `4.3076% | 16224/376640`.
- Completed the implemented portion of B3 show/archive CSS extraction for `ArchiveShowRow`, `ArchiveShowList`, `ArchiveSearchFilters`, `ShowTile`, and `ShowGrid`.
- Left `PubShowRow` deferred pending taxonomy decision against `ShowTile`/`ShowGrid` and `ArchiveShowRow`; it remains exported and covered, but should not be polished until canonical usage is decided.
- Ran final B3 `pnpm --filter pyxis-components typecheck`, which passed.
- Started B4 detail/booking extraction by extracting `PublicPageHeader` styles into `web/packages/pyxis-components/src/public/PublicPageHeader/PublicPageHeader.css`.
- Added part selectors for `kicker`, `title`, and `divider`, plus long-title and theme override Storybook stories.
- Validated `PublicPageHeader` with `pnpm --filter pyxis-components typecheck` and `css-visual-diff run --config .../public-page-header-default.css-visual-diff.yml`; current pixel diff is `0.0000% | 0/110424`.

