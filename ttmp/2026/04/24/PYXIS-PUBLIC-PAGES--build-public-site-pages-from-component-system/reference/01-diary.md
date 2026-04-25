---
Title: Public site page build diary
Ticket: PYXIS-PUBLIC-PAGES
Status: active
Topics:
  - frontend
  - react
  - storybook
  - visual-diff
  - pyxis
DocType: reference
Intent: long-term
Summary: Chronological diary for building Pyxis public site pages from the component system.
LastUpdated: 2026-04-24T00:00:00Z
---

# Public Site Page Build Diary

## Step 1: Ticket creation and implementation guide

### What happened

Created a new docmgr ticket for building the public site pages from the stabilized component system:

```text
PYXIS-PUBLIC-PAGES
```

The ticket starts after the RTK/types/theming migration ticket was closed. The prior ticket established:

- `pyxis-types` shared domain/API types,
- RTK Query in `pyxis-user-site`,
- Storybook page stories wired through Redux Provider and MSW,
- extracted public component CSS and data-pyxis part selectors,
- theming and taxonomy ADRs.

### Documents created

```text
design/01-public-site-page-build-analysis-design-implementation-guide.md
tasks.md
reference/01-diary.md
```

### Key direction

Use the same iterative parity approach as component work, but now at page level:

```text
canonical public components → page sections → user-site Storybook stories on :6007 → page-level css-visual-diff configs → tuning/acceptance
```

### Important warning for future work

Current `pyxis-user-site` pages still contain page-local inline styles and some older/deferred component choices (`PubShowRow`, `SpaceInfo`, `EthosStrip`). The next implementation work should replace those with canonical components where the standalone baselines support it.


## Step 2: Validation and reMarkable upload

### Commands

```bash
docmgr doc relate --ticket PYXIS-PUBLIC-PAGES ...
docmgr doctor --ticket PYXIS-PUBLIC-PAGES --stale-after 30
remarquee status
remarquee upload bundle --dry-run ... --name "PYXIS Public Pages Build Guide" --remote-dir "/ai/2026/04/24/PYXIS-PUBLIC-PAGES" --toc-depth 2
remarquee upload bundle ... --name "PYXIS Public Pages Build Guide" --remote-dir "/ai/2026/04/24/PYXIS-PUBLIC-PAGES" --toc-depth 2
remarquee cloud ls /ai/2026/04/24/PYXIS-PUBLIC-PAGES --long --non-interactive
```

### Result

The bundle uploaded successfully to reMarkable:

```text
/ai/2026/04/24/PYXIS-PUBLIC-PAGES/PYXIS Public Pages Build Guide
```

### Warning

`docmgr doctor` reports unknown topic vocabulary values because this repository's seeded vocabulary currently only knows `chat`, `backend`, and `websocket`. The ticket topics are still meaningful and match the frontend work.


## Step 3: Phase 0 baseline setup

### What I did

- Read the public component theming ADR and taxonomy ADR.
- Ran user-site and recursive workspace typechecks.
- Confirmed the standalone prototype server serves `http://localhost:7070/standalone/public/shows.html`.
- Restarted user-site Storybook cleanly on port `6007` in tmux session `pyxis-user-site-storybook`.
- Smoke-checked the five desktop page story iframes.
- Added `prototype-design/visual-diff/comparisons/public-pages/shows-desktop.css-visual-diff.yml`.
- Ran the Shows page visual-diff config before/while doing the first Shows rewrite to establish page-level evidence.

### Commands

```bash
cd web && pnpm --filter pyxis-user-site typecheck
cd web && pnpm -r typecheck
curl -I http://localhost:7070/standalone/public/shows.html
tmux new-session -d -s pyxis-user-site-storybook 'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-user-site storybook'
css-visual-diff run --config prototype-design/visual-diff/comparisons/public-pages/shows-desktop.css-visual-diff.yml
```

### Issues and fixes

1. Storybook on port `6007` was already running and stale. I killed the listener and restarted the `pyxis-user-site-storybook` tmux session.
2. RTK Query requests were not intercepted by MSW at first. The page rendered `Request failed: FETCH_ERROR`. Cause: RTK Query uses an absolute base URL (`http://localhost:8080`) while handlers used path-only patterns like `/api/public/shows`. Fix: change handlers to wildcard absolute-compatible patterns like `*/api/public/shows`.
3. Storybook/Vite failed to import `ShowGrid` / `PublicPageHeader` from `pyxis-components` because the package `dist` export was stale and did not include newer public components. Fix: alias `pyxis-components` to `../pyxis-components/src` in user-site Vite and Storybook config for source-based local workspace development.

### Baseline result

The Shows page config runs successfully with complete section coverage. Current first-pass diff after Phase 2 composition is still high:

```text
shows-list 66.8566%
mailing-list 51.2191%
header 51.0775%
page 50.5245%
content 49.0940%
```

This is expected at the first page-level pass because the standalone prototype has a dense poster/flyer page and the React page has just been switched to canonical components without page-specific visual tuning.

## Step 4: Phase 1 shared public shell cleanup

### What I did

- Inspected `Layout.tsx`, `PubNav`, and `PubFooter`.
- Added `web/packages/pyxis-user-site/src/pages/PublicPage.css`.
- Replaced Layout shell inline styles with stable classes:
  - `pyxis-public-page-shell`,
  - `pyxis-public-page-shell__main`.
- Decided that reusable page max-width/status helpers belong in user-site page CSS, while Storybook keeps owning only the capture frame width.

### Validation

```bash
cd web && pnpm --filter pyxis-user-site typecheck
```

The desktop page stories were smoke-checked through Playwright after the restart and showed no Storybook error display.

## Step 5: Phase 2 Shows page first composition pass

### What I did

- Replaced the older `PubHero` + `PubShowRow` list composition with canonical page components:
  - `PublicPageHeader`,
  - `ShowGrid` / `ShowTile`,
  - `MailingListCTA`.
- Kept `useUpcomingShows()` RTK Query compatibility hook.
- Preserved loading, empty, and error states.
- Added `web/packages/pyxis-user-site/src/pages/Shows.css` for page-owned layout.
- Kept stable selectors:
  - `data-page="shows"`,
  - `data-section="shows-header"`,
  - `data-section="shows-list"`,
  - `data-section="mailing-list"`.

### Decision

`PubHero` is removed from the first Shows page pass. The standalone `shows.html` baseline is primarily a header plus poster/show-grid experience, and the taxonomy ADR recommends `ShowGrid`/`ShowTile` as canonical for poster-based upcoming show listings.

### Validation

```bash
cd web && pnpm --filter pyxis-user-site typecheck
cd web && pnpm --filter pyxis-user-site build
cd web && pnpm --filter pyxis-user-site build-storybook
css-visual-diff run --config prototype-design/visual-diff/comparisons/public-pages/shows-desktop.css-visual-diff.yml
```

All commands completed successfully. The visual diff still has large residual differences and should be treated as the next tuning target rather than accepted parity.


## Step 6: Phase 3 ShowDetail first composition pass

### What I did

- Replaced custom show-detail hero markup with `ShowDetailHeader`.
- Added `ShowMetaStrip` for doors/age/price metadata.
- Replaced ad hoc ticket/action area with `ReserveTicketCard`.
- Preserved route-param parsing, loading state, and not-found state.
- Kept `LineupRow` for lineup rendering.
- Added `SafetyNote`.
- Kept `VenueCard` for the detail-page aside; per taxonomy this is the compact detail-page venue card, while `BookingSpaceAside` remains better suited for the booking page.
- Added `web/packages/pyxis-user-site/src/pages/ShowDetail.css`.
- Added `prototype-design/visual-diff/comparisons/public-pages/show-detail-desktop.css-visual-diff.yml`.

### Validation

```bash
cd web && pnpm --filter pyxis-user-site typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/public-pages/show-detail-desktop.css-visual-diff.yml
```

### Result

The config runs with full two-section coverage. First-pass residual diffs:

```text
content 24.4647%
page    18.5282%
```

This is a substantial improvement over the Shows first-pass diff, but still needs tuning before parity acceptance.


## Step 7: Phase 4 Archive first composition pass

### What I did

- Replaced local archive header with `PublicPageHeader`.
- Extended `ArchiveSearchFilters` with optional controlled search props and result label so the page can preserve `useArchive(search)` behavior while using the canonical component.
- Kept `ArchiveStats`.
- Replaced local `YearGroups` and `ArchiveRow` implementations with `YearGroup`, `ArchiveShowList`, and `ArchiveShowRow`.
- Added `web/packages/pyxis-user-site/src/pages/Archive.css`.
- Added `prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml`.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
cd web && pnpm --filter pyxis-user-site typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml
```

### Result

The archive config runs with full two-section coverage. First-pass residual diffs:

```text
content 7.1281%
page    6.6511%
```

This is close enough for a strong first composition pass, but still needs review/tuning before final acceptance.


## Step 8: Phase 5 Book and BookSuccess first composition pass

### What I did

- Replaced local booking page title/intro with `PublicPageHeader`.
- Kept `BookingForm` as the canonical form implementation.
- Preserved `useSubmitBooking()` RTK Query mutation behavior and navigation to `/book/success`.
- Replaced `SpaceInfo` with `BookingSpaceAside` per taxonomy guidance for booking pages.
- Kept `BookingRules`.
- Added `SaferSpaceAgreement`.
- Updated `BookSuccess.tsx` to use the public page wrapper and `BookingSuccess`.
- Added `BookSuccessDesktop` story route to `PublicPages.stories.tsx`.
- Added `web/packages/pyxis-user-site/src/pages/Book.css`.
- Added `prototype-design/visual-diff/comparisons/public-pages/book-desktop.css-visual-diff.yml`.

### Validation

```bash
cd web && pnpm --filter pyxis-user-site typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/public-pages/book-desktop.css-visual-diff.yml
cd web && pnpm -r typecheck
cd web && pnpm --filter pyxis-user-site build
cd web && pnpm --filter pyxis-user-site build-storybook
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/public-pages
```

### Result

The book config runs with full two-section coverage. First-pass residual diffs:

```text
content 14.5896%
page    12.1006%
```

The full page config directory also runs successfully for Shows, ShowDetail, Archive, and Book. Storybook build still reports non-blocking large chunk warnings and Storybook package compatibility warnings.
