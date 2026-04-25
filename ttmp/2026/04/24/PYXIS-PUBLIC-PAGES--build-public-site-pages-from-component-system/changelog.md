# Changelog

## 2026-04-24

- Initial workspace created with `docmgr ticket create-ticket`.
- Closed predecessor ticket `PYXIS-RTK-TYPES-MIGRATION` after completing RTK Query, shared `pyxis-types`, public component CSS extraction, B8 ADRs, and validation/postmortem documentation.
- Added detailed intern-facing implementation guide: `design/01-public-site-page-build-analysis-design-implementation-guide.md`.
- Replaced placeholder task list with phased page-build plan covering setup, shared shell, Shows, ShowDetail, Archive, Book/BookSuccess, About, visual-diff suite, and final validation/publication.
- Added initial implementation diary: `reference/01-diary.md`.

- Ran `docmgr doctor --ticket PYXIS-PUBLIC-PAGES --stale-after 30`; only warning is the repository's limited topic vocabulary (`frontend`, `react`, `storybook`, `visual-diff`, `pyxis` are not in the tiny seeded vocabulary).
- Uploaded the ticket bundle to reMarkable as `PYXIS Public Pages Build Guide` under `/ai/2026/04/24/PYXIS-PUBLIC-PAGES`.
- Completed Phase 0 baseline setup: verified typechecks, restarted user-site Storybook on port 6007, smoke-checked desktop page iframes, confirmed standalone prototype `/standalone/public/shows.html`, added `shows-desktop` page visual-diff config, and captured the initial/current Shows page diff.
- Fixed page Storybook data loading by widening MSW public API handlers to `*/api/public/*`, because RTK Query's default base URL is absolute (`http://localhost:8080`) and path-only handlers did not intercept it in Storybook.
- Fixed user-site Storybook/Vite package resolution for source-only public component exports (`ShowGrid`, `PublicPageHeader`) by aliasing `pyxis-components` to the package source for user-site dev/build-storybook.
- Completed Phase 1 shared shell cleanup with `PublicPage.css` and Layout class names replacing obvious shell inline styles.
- Completed Phase 2 first Shows composition pass: replaced `PubShowRow` list with canonical `ShowGrid`/`ShowTile`, added `PublicPageHeader`, preserved RTK Query loading/empty/error behavior, and kept `MailingListCTA`. Desktop visual diff now runs with full section coverage; residual page diff remains high and is documented as expected first-pass page composition work.


- Completed Phase 3 first ShowDetail composition pass using `ShowDetailHeader`, `ShowMetaStrip`, `ReserveTicketCard`, `LineupRow`, `SafetyNote`, and `VenueCard`; added page CSS and `show-detail-desktop` visual-diff config. Current first-pass diff: content 24.4647%, page 18.5282%.

- Completed Phase 4 first Archive composition pass using `PublicPageHeader`, controlled `ArchiveSearchFilters`, `ArchiveStats`, `YearGroup`, `ArchiveShowList`, and `ArchiveShowRow`; added page CSS and `archive-desktop` visual-diff config. Current first-pass diff: content 7.1281%, page 6.6511%.
