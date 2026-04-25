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

