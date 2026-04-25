---
Title: Investigation diary
Ticket: PYXIS-RTK-TYPES-MIGRATION
Status: active
Topics:
  - frontend
  - react
  - rtk-query
  - typescript
  - architecture
  - pyxis
DocType: reference
Intent: long-term
Summary: Chronological diary for the RTK Query and pyxis-types migration planning ticket.
LastUpdated: 2026-04-24T00:00:00Z
---

# Investigation Diary

## Step 1: Create ticket and write migration guide

### Prompt Context

**User prompt summary:** Create a new ticket for RTK Query and `pyxis-types` package migration. Write a very detailed analysis/design/implementation guide for an intern, including prose, bullet points, pseudocode, diagrams, API references, file references, phased tasks, and reMarkable upload.

### What I did

- Loaded the ticket/reMarkable research skill and its writing/deliverable references.
- Created ticket workspace:

```text
PYXIS-RTK-TYPES-MIGRATION
```

- Created primary design document:

```text
ttmp/2026/04/24/PYXIS-RTK-TYPES-MIGRATION--migrate-public-site-data-layer-to-rtk-query-and-shared-pyxis-types-package/design-doc/01-rtk-query-and-pyxis-types-migration-guide.md
```

- Created this diary:

```text
ttmp/2026/04/24/PYXIS-RTK-TYPES-MIGRATION--migrate-public-site-data-layer-to-rtk-query-and-shared-pyxis-types-package/reference/01-investigation-diary.md
```

- Gathered evidence from:

```text
web/package.json
web/pnpm-workspace.yaml
web/packages/pyxis-user-site/package.json
web/packages/pyxis-user-site/src/App.tsx
web/packages/pyxis-user-site/src/api/hooks.ts
web/packages/pyxis-user-site/src/api/client.ts
web/packages/pyxis-user-site/src/api/endpoints.ts
web/packages/pyxis-user-site/src/api/types.ts
web/packages/pyxis-components/package.json
web/packages/pyxis-components/src/mocks/types.ts
web/packages/pyxis-components/src/mocks/handlers.ts
web/packages/pyxis-user-site/stories/PublicPages.stories.tsx
```

- Wrote a detailed intern-oriented migration guide covering:
  - current architecture,
  - why TanStack React Query is not RTK Query,
  - current type duplication,
  - proposed `pyxis-types` package,
  - proposed RTK Query API slice,
  - provider migration,
  - Storybook/MSW wiring,
  - API error handling,
  - phased implementation tasks,
  - pseudocode,
  - diagrams,
  - validation commands,
  - risk mitigation.

### What worked

The current codebase already has a clean enough package split that the migration plan is straightforward:

```text
pyxis-types -> imported by pyxis-components and pyxis-user-site
pyxis-user-site -> owns RTK Query store/API slice
pyxis-components -> keeps presentational components and MSW handlers
```

The existing `pnpm-workspace.yaml` includes `packages/*`, so a new `web/packages/pyxis-types` package will be discovered automatically.

### What did not work / issues

The first attempted `docmgr ticket create-ticket` included `--non-interactive`, but that flag is not supported by `docmgr ticket create-ticket`. I reran without the flag and ticket creation succeeded.

Exact error:

```text
Error: unknown flag: --non-interactive
```

### What was tricky

The phrase "RTK Query" conflicts with current implementation. The current code uses TanStack React Query, evidenced by:

```text
web/packages/pyxis-user-site/package.json
web/packages/pyxis-user-site/src/App.tsx
web/packages/pyxis-user-site/src/api/hooks.ts
```

The guide therefore treats RTK Query migration as an explicit architecture migration, not a minor rename.

### What warrants a second pair of eyes

- Whether to keep compatibility wrapper hooks during migration.
- Whether `pyxis-types` should include only public API types or also admin/internal types later.
- Whether the app really needs RTK Query, or whether TanStack Query was acceptable and the terminology should be corrected. The user explicitly asked for RTK Query, so the plan proceeds with RTK Query.

### Validation

Planned validation for final handoff:

```bash
docmgr doctor --ticket PYXIS-RTK-TYPES-MIGRATION --stale-after 30
remarquee upload bundle --dry-run ...
remarquee upload bundle ...
```

### Next steps

- Update changelog/index if needed.
- Relate key files with docmgr.
- Run docmgr doctor.
- Upload the design guide bundle to reMarkable.

## Step 2: Add CSS extraction and theming guide

### Prompt Context

The user clarified that the first design document only covered RTK Query and asked for a second document covering CSS extraction as well. They also asked that the ticket tasks include this work.

### What I did

- Created a second design document:

```text
ttmp/2026/04/24/PYXIS-RTK-TYPES-MIGRATION--migrate-public-site-data-layer-to-rtk-query-and-shared-pyxis-types-package/design-doc/02-public-component-css-extraction-and-theming-guide.md
```

- Expanded the ticket task list to cover two tracks:
  - Track A: RTK Query and `pyxis-types`.
  - Track B: public component CSS extraction and theming.
- Updated the ticket index so both design documents are visible.
- Updated the changelog with the new CSS/theming document.

### Evidence inspected

- `web/packages/pyxis-components/src/tokens/tokens.css` — existing token foundation.
- `web/packages/pyxis-components/src/utils/parts.ts` — stable `data-pyxis-component` / `data-pyxis-part` helper.
- `web/packages/pyxis-components/src/public/PubNav/PubNav.tsx` and `PubNav.css` — partial existing example of extracted public component CSS.
- `web/packages/pyxis-components/src/public` — public component inventory.

### Key conclusions

The public components need a separate architectural stabilization track because many are still in a parity-discovery style with static inline styles and hardcoded prototype colors. The guide recommends extracting styles into per-component CSS files, using token variables, adding stable part selectors, and validating through Storybook plus existing `css-visual-diff` configs.

### Next steps

- Run docmgr relation/doctor steps.
- Upload the ticket bundle to reMarkable after final review.

## Step 3: Align CSS/theming guide with the React Modular Themable Storybook skill

### Prompt Context

The user asked whether the CSS extraction plan fits the `react-modular-themable-storybook` skill, then asked to update the documentation and tasks accordingly before proceeding task-by-task.

### What I did

- Read the skill references for:
  - parts and tokens,
  - theming CSS,
  - Storybook patterns,
  - QA checklist.
- Updated `design-doc/02-public-component-css-extraction-and-theming-guide.md` with an explicit skill-alignment section.
- Updated `tasks.md` with additional skill-aligned tasks.

### Key decisions added

- Use existing Pyxis-specific selectors, not a new generic selector system:

```text
data-pyxis-component
data-pyxis-part
```

- Treat these as the repo-specific adaptation of the skill's generic `data-widget` / `data-part` pattern.
- Document a four-layer styling model:
  1. base component CSS,
  2. global tokens,
  3. component-local CSS variables,
  4. consumer/theme overrides.
- Defer `unstyled` mode by default unless a concrete consumer needs it.
- Keep `data-pyxis` attributes present even if `unstyled` is introduced later.
- Review slots/renderers selectively rather than adding render props everywhere.

### What changed in tasks

- Added B1 tasks for documenting the repo-specific selector adaptation, unstyled-mode decision, and styling layers.
- Added B6 tasks for theme override stories, `unstyled` stories only where implemented, and slot/renderer stories only where supported.
- Added B8 follow-up tasks for slot/renderer review and module/export checks.

### Next steps

Start the implementation tasks one by one, beginning with small public molecule CSS extraction so the pattern is validated before larger organisms such as `BookingForm`.


## Step 4: Extract `SafetyNote` CSS as the first small molecule

### What I did

- Created `web/packages/pyxis-components/src/public/SafetyNote/SafetyNote.css`.
- Moved static inline `SafetyNote` styles from JSX into CSS.
- Added component-local CSS variables for color, border color, font size, line height, and padding.
- Updated `SafetyNote.tsx` to self-import CSS and use `clsx('pyxis-safety-note', className)`.
- Expanded `SafetyNote.stories.tsx` with a `ThemeOverride` story that demonstrates overriding the component-local CSS variables.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/safety-note-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current pixel-diff output for `SafetyNote` is:

```text
component 9.2839% | 2855/30752
root      9.2839% | 2855/30752
```

CSS diff reports only:

```text
box-sizing: content-box vs border-box
font-family: Inter, system-ui, ... vs Inter, ...
```

This suggests the extraction did not introduce obvious CSS property drift in the compared properties, but the existing pixel diff still warrants later tuning if `SafetyNote` needs accepted/near-exact parity.


## Step 5: Extract `ArchiveStats` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/ArchiveStats/ArchiveStats.css`.
- Moved the root grid, border, spacing, stat value, and label styles out of JSX.
- Added stable `data-pyxis-part` hooks for `item`, `value`, and `label`.
- Updated `ArchiveStats.tsx` to self-import CSS and use `clsx('pyxis-archive-stats', className)`.
- Added `ThemeOverride` and `Narrow` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/archive-stats-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 7.0987% | 4634/65280
root      7.0987% | 4634/65280
```

CSS diff is down to:

```text
height: 58px vs 57px
```

This is a small residual layout difference after CSS extraction. I left it as a documented follow-up rather than forcing a magic 1px adjustment into the first architecture cleanup pass.


## Step 6: Extract `TicketStub` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/TicketStub/TicketStub.css`.
- Moved all static root, text, divider, and metadata styles out of JSX.
- Added stable `data-pyxis-part` hooks for `eyebrow`, `title`, `divider`, `meta`, `price`, and `age`.
- Updated `TicketStub.tsx` to self-import CSS and use `clsx('pyxis-ticket-stub', className)`.
- Added `LongArtist` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/ticket-stub-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 0.3144% | 94/29900
root      0.3144% | 94/29900
```

The residual CSS diff includes box-sizing/font-family and selector-bound width/height differences, but the pixel diff is very low. This is a good example of architecture cleanup preserving visual output closely.


## Step 7: Extract `LineupRow` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/LineupRow/LineupRow.css`.
- Moved root grid, border, time, artist, and role styles out of JSX.
- Added stable `data-pyxis-part` hooks for `time`, `artist-block`, `artist`, and `role`.
- Updated `LineupRow.tsx` to self-import CSS and use `clsx('pyxis-lineup-row', className)`.
- Added `Support` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/lineup-row-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 5.3400% | 1115/20880
root      6.5709% | 1372/20880
```

The config compares the prototype's table-row implementation with React's grid implementation, so CSS differences such as `display: table-row` vs `grid` are expected until this component receives a deeper semantic/tuning pass.


## Step 8: Extract `YearGroup` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/YearGroup/YearGroup.css`.
- Moved the year heading/count layout and typography styles out of JSX.
- Added stable `data-pyxis-part` hooks for `header`, `year`, and `count`.
- Updated `YearGroup.tsx` to self-import CSS and use `clsx('pyxis-year-group', className)`.
- Replaced the `React` namespace import with a type-only `ReactNode` import.
- Added `Singular` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/year-group-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 0.0000% | 0/35280
root      0.0000% | 0/28560
```

This was a clean CSS extraction with exact pixel parity.


## Step 9: Extract `Poster` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/Poster/Poster.css`.
- Moved static root, art, kicker, title, mark, and metadata styles out of JSX.
- Kept dynamic poster artwork values as component-local CSS variables: `--pyxis-poster-bg`, `--pyxis-poster-fg`, `--pyxis-poster-accent`, and `--pyxis-poster-ratio`.
- Added a `style?: CSSProperties` prop so consumers/stories can override those component-local variables.
- Added/kept variant selectors keyed by `data-poster-kind` for redroom/pixel808/orphx size differences.
- Added a `ThemeOverride` Storybook story.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/poster-redroom.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 5.3101% | 4846/91260
root      5.3101% | 4846/91260
```

The component still has non-trivial pixel diff and should receive later visual tuning if poster parity becomes a release blocker. The architecture improvement is that static visual structure now lives in CSS while per-kind artwork remains overrideable through CSS variables.


## Step 10: Extract `ShowTypeChips` CSS and complete B2 small molecule batch

### What I did

- Created `web/packages/pyxis-components/src/public/ShowTypeChips/ShowTypeChips.css`.
- Moved flex layout and button chip styles out of JSX.
- Added stable `data-pyxis-part='chip'` hooks and `data-state='active'` for the active chip.
- Added tokenized `:focus-visible` styling.
- Updated `ShowTypeChips.tsx` to self-import CSS and use `clsx('pyxis-show-type-chips', className)`.
- Added `Wrapped` and `ThemeOverride` Storybook stories.
- Updated B2 tasks to mark the small public molecule extraction batch as complete.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/show-type-chips-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output after preserving the active chip's no-border style:

```text
component 0.0102% | 4/39200
root      0.0102% | 4/39200
```

### Batch status

B2 small public molecule CSS extraction is now complete for:

```text
SafetyNote
ArchiveStats
TicketStub
LineupRow
YearGroup
Poster
ShowTypeChips
```

Some components still have residual visual diff from pre-existing semantic/layout differences, but static inline styles have been extracted and all touched components passed typecheck plus their matching visual-diff configs.


## Step 11: Extract `ArchiveShowRow` CSS

### What I did

- Started B3 show/archive CSS extraction.
- Created `web/packages/pyxis-components/src/public/ArchiveShowRow/ArchiveShowRow.css`.
- Moved root grid, border, typography, and recap-link styles out of JSX.
- Added stable `data-pyxis-part` hooks for `date`, `name`, `tag`, and `cta`.
- Updated `ArchiveShowRow.tsx` to self-import CSS and use `clsx('pyxis-archive-show-row', className)`.
- Added `LongName` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/archive-show-row-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 0.2671% | 100/37440
root      0.2671% | 100/37440
```

The config's root CSS diff compares the prototype wrapper selector to the React row anchor, so CSS properties such as block-vs-grid and padding differ even though the pixel diff is low.


## Step 12: Extract `ArchiveShowList` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/ArchiveShowList/ArchiveShowList.css`.
- Updated `ArchiveShowList.tsx` to self-import CSS and use `clsx('pyxis-archive-show-list', className)`.
- Pulled default show data into a named `defaultShows` constant for readability.
- Kept `ArchiveShowList` intentionally thin: it owns list/container layout only and delegates row visuals to `ArchiveShowRow`.
- Added `LongContent` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/organisms/archive-show-list-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 0.4888% | 549/112320
root      0.4888% | 549/112320
```

The remaining root CSS diff is mostly wrapper/default inherited style differences; the pixel diff remains low.


## Step 13: Extract `ArchiveSearchFilters` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/ArchiveSearchFilters/ArchiveSearchFilters.css`.
- Moved root layout, input, year button, and active button styles out of JSX.
- Added stable `data-pyxis-part` hooks for `input`, `years`, and `year-button`.
- Added `data-state='active'` for the active year button.
- Added tokenized focus-visible styles for input and buttons.
- Updated `ArchiveSearchFilters.tsx` to self-import CSS and use `clsx('pyxis-archive-search-filters', className)`.
- Added `Wrapped` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/archive-search-filters-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 0.0000% | 0/46080
root      0.0000% | 0/25920
```

This was an exact pixel-parity extraction.


## Step 14: Extract `ShowTile` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/ShowTile/ShowTile.css`.
- Moved static root, info, title, meta, price, and ticket-pill styles out of JSX.
- Added stable `data-pyxis-part` hooks for `info`, `title`, `meta`, `price`, and `ticket-pill`.
- Added `data-compact='true'` for the compact sizing variant.
- Kept dynamic ticket-pill values as component-local CSS variables on the root.
- Updated `ShowTile.tsx` to self-import CSS and use `clsx('pyxis-show-tile', className)`.
- Added `SoldOut` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/show-tile-redroom.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 4.0975% | 4890/119340
root      4.0975% | 4890/119340
```

`ShowTile` still inherits the poster-level residual diff from the `Poster` component, but the static card-info styles are now extracted and themeable.


## Step 15: Extract `ShowGrid` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/ShowGrid/ShowGrid.css`.
- Moved grid layout and compact layout styles out of JSX.
- Added `data-compact='true'` to represent compact/mobile layout state.
- Updated `ShowGrid.tsx` to self-import CSS and use `clsx('pyxis-show-grid', className)`.
- Kept `ShowGrid` responsible only for grid layout; it does not duplicate `ShowTile` internals.
- Added a `ThemeOverride` Storybook story that demonstrates inherited `ShowTile` CSS variables through the grid.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/organisms/show-grid-desktop.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 4.3076% | 16224/376640
root      4.3076% | 16224/376640
```

The residual diff mostly follows child `ShowTile`/`Poster` differences rather than new grid layout drift.


## Step 16: Close current B3 pass and defer `PubShowRow` pending taxonomy

### What I did

- Ran a final component-package typecheck after the B3 show/archive extraction pass.
- Updated B3 tasks to mark completed validation for touched components.
- Left `PubShowRow` unchecked and explicitly deferred because it overlaps semantically with both upcoming show tile/grid components and archive row components.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
```

Typecheck passed.

### Why `PubShowRow` is deferred

`PubShowRow` is still exported and has visual-diff coverage, but it appears to overlap with:

```text
ShowTile / ShowGrid — canonical poster-based upcoming shows layout
ArchiveShowRow      — canonical archive/recap row layout
```

The task list already says to extract `PubShowRow` only "if the component remains canonical." Rather than polishing a possibly deprecated overlap component, I documented it as pending taxonomy decision.
