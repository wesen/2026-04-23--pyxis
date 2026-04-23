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
