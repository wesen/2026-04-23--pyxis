# Changelog

## 2026-04-23

- Initial workspace created


## 2026-04-23 (continuing)

### Phase 1–5: Project Setup + Core Components

**Implemented (committed as `9e52d1a`):**

- Phase 1: pnpm workspace, pyxis-components + pyxis-user-site packages, Vite build, Storybook, TypeScript, ESLint, GitHub Actions CI
- Phase 2: Design tokens (tokens.css CSS custom properties + tokens.ts TypeScript constants)
- Phase 3: All atoms built — Icon (31 SVGs), PyxisMark, PyxisLogo, IconButton, Button (7 variants, 3 sizes), Badge (12 statuses), Tag, Input, Select, Textarea, Avatar
- Phase 4: All molecules built — Card, CardHead, Stat, Field, Table, Empty, LogRow
- Phase 5: Organisms built — TopBar, Modal

**MSW mock API layer:**
- `/api/public/shows` (upcoming shows)
- `/api/public/shows/:id` (show detail)
- `/api/public/archive` (archive with search)
- `/api/public/archive/stats`
- `/api/public/submissions` (booking form POST)

**Key decisions:**
- `allowImportingTsExtensions` in tsconfig.build.json (separate from root) — vite build passes, tsc typecheck fails on cross-package paths
- `.storybook/preview.tsx` loads `tokens.css` as decorator for all stories
- All component CSS via `data-part` attribute selectors (no CSS Modules yet)

**Next:** Phase 6 — public site components (PubNav, PubHero, etc.)

## 2026-04-23

feat(web): scaffold workspace + build phases 1-5 — workspace, tokens, atoms, molecules, organisms

### Related Files

- web/ — all new files


## 2026-04-23 (Phase 7 committed as `536c7b1`)

### Phase 7: API integration + all pages

**Committed as `536c7b1`:**
- API client, types, endpoints, React Query hooks
- All 6 pages: Shows, ShowDetail, Archive, Book, BookSuccess, About, NotFound
- Layout with PubNav + Outlet + PubFooter
- Global styles with CSS tokens
- MSW Storybook stories for all pages

**Key decisions:**
- Tokens duplicated in user-site/global.css (Vite can't @import workspace packages in CSS)
- PubNav CSS import removed from component (Vite bundles all CSS into dist/style.css)
- MSW intercepts /api/* in Storybook and tests
- Loading skeletons and error states for all async pages

## 2026-04-23 (Phase 9+10 committed as `c621e19`)

### Phase 9 continued: Performance + Accessibility
- App.tsx — lazy-loaded route chunks (code-split per page) with Suspense + PageLoader
- robots.txt + sitemap.xml + favicon.svg in public/
- Google Fonts preconnect in index.html
- pyxis-components/.storybook/main.ts — removed staticDirs

### Phase 10: Deployment scaffolding
- .env.example + .env.production.example
- vercel.json — build config, env vars, iad1 region
- .github/workflows/preview.yml — Vercel preview + prod CI
- web/README.md — workspace quick-start + architecture docs

### Bugs fixed
- Unused `React` import removed from App.tsx (new JSX transform)
- Unused `ReactNode` import removed from Seo.tsx

---

**All phases complete** — 4 commits, 3 branches deep.

## 2026-04-23

Ticket closed


## 2026-04-23 — Start Storybook/page parity pass and repair atoms

### Added
- Added detailed Phase 11–16 task list for user-site Storybook coverage, atom parity, page visual-diff configs, page repair, and backend-readiness handoff.

### Changed
- Repaired atom-level prototype parity for Button, Badge, Tag, Avatar, Icon, IconButton, Input, and Select.
- Updated the atom diff fixture to compare equivalent input states.

### Validated
- `pnpm --filter pyxis-components typecheck`
- `11-run-pyxis-atom-diff.sh`

### Result
- Atom diff coverage: 22/22 selectors present and visible.
- Configured CSS diffs: resolved to zero.
- Button/badge/tag/avatar-md/icon/select pixel diffs: zero.
- Remaining pixel noise: input-search 0.526%, input-error 0.3111%, avatar-lg 0.0434%, full 0.4769%.

## 2026-04-23 — Add user-site Storybook public page coverage

### Added
- Added `pyxis-user-site` Storybook config and preview decorators.
- Added `PublicPages.stories.tsx` covering shows/detail/archive/book/about in desktop and mobile story variants.
- Added user-site Storybook scripts and MSW service worker.
- Exported `pyxis-components/mocks/handlers` for user-site Storybook consumption.

### Changed
- Added stable page/region/section selectors to public layout and pages for future visual diff configs.

### Validated
- `pnpm --filter pyxis-user-site typecheck`
- `STORYBOOK_DISABLE_TELEMETRY=1 pnpm --filter pyxis-user-site build-storybook`

## 2026-04-23 — Add first page-level Storybook visual diff

### Added
- Added css-visual-diff config `examples/pyxis-storybook-shows-desktop.yaml` in the css-visual-diff repo.
- Added numbered scripts `13-serve-user-site-storybook-static.sh` and `14-run-pyxis-storybook-shows-desktop.sh`.

### Ran
- Ran prototype Shows desktop vs user-site Storybook Shows Desktop comparison.
- Served report at `http://localhost:8793/test.html`.

### Results
- Coverage: 5/5 selectors present and visible.
- Pixel diffs: shows-content 76.1516%, main 59.2671%, full 54.5223%, nav 32.9085%, footer 6.8826%.
- Next target: rebuild Shows page toward prototype poster-grid layout.
