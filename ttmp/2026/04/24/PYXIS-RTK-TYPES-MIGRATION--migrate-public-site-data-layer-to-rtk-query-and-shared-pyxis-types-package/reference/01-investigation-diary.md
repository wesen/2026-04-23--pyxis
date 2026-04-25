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


## Step 17: Extract `PublicPageHeader` CSS

### What I did

- Started B4 show-detail and booking CSS extraction.
- Created `web/packages/pyxis-components/src/public/PublicPageHeader/PublicPageHeader.css`.
- Moved root margin, kicker, title, and divider styles out of JSX.
- Added stable `data-pyxis-part` hooks for `kicker`, `title`, and `divider`.
- Updated `PublicPageHeader.tsx` to self-import CSS and use `clsx('pyxis-public-page-header', className)`.
- Added `LongTitle` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/public-page-header-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 0.0000% | 0/110424
root      0.0000% | 0/83032
```

This was an exact pixel-parity extraction.


## Step 18: Extract `ShowDetailHeader` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/ShowDetailHeader/ShowDetailHeader.css`.
- Moved meta, title, and description styles out of JSX.
- Added stable `data-pyxis-part` hooks for `meta`, `title`, and `description`.
- Updated `ShowDetailHeader.tsx` to self-import CSS and use `clsx('pyxis-show-detail-header', className)`.
- Added `LongTitle` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/show-detail-header-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 0.0000% | 0/70200
root      0.0000% | 0/70200
```

This was an exact pixel-parity extraction.


## Step 19: Extract `ShowMetaStrip` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/ShowMetaStrip/ShowMetaStrip.css`.
- Moved root border/grid styles and item label/value styles out of JSX.
- Kept the dynamic column count as a root `gridTemplateColumns` style because it depends on `items.length`.
- Added stable `data-pyxis-part` hooks for `item`, `label`, and `value`.
- Updated `ShowMetaStrip.tsx` to self-import CSS and use `clsx('pyxis-show-meta-strip', className)`.
- Added `FourItems` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/show-meta-strip-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 0.0000% | 0/31680
root      0.0000% | 0/31680
```

This was an exact pixel-parity extraction.


## Step 20: Extract `ReserveTicketCard` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/ReserveTicketCard/ReserveTicketCard.css`.
- Moved root card, header, price, note, and CTA button styles out of JSX.
- Added stable `data-pyxis-part` hooks for `header`, `eyebrow`, `code`, `price`, `note`, and `cta`.
- Added tokenized focus-visible styling for the CTA.
- Updated `ReserveTicketCard.tsx` to self-import CSS and use `clsx('pyxis-reserve-ticket-card', className)`.
- Added `Compact` and `ThemeOverride` Storybook stories.
- Initially used a too-large typography token for price, which produced an 11% pixel diff. Reverted that to the exact 20px prototype size and reduced the diff.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/reserve-ticket-card-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 1.1681% | 560/47940
root      1.1681% | 560/47940
```


## Step 21: Extract `SaferSpaceAgreement` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/SaferSpaceAgreement/SaferSpaceAgreement.css`.
- Moved label layout, checkbox accent, and link color styles out of JSX.
- Added stable `data-pyxis-part` hooks for `checkbox`, `text`, and `link`.
- Added tokenized focus-visible styling for the policy link.
- Updated `SaferSpaceAgreement.tsx` to self-import CSS and use `clsx('pyxis-safer-space-agreement', className)`.
- Added `Narrow` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/molecules/safer-space-agreement-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 1.5536% | 174/11200
root      1.5536% | 174/11200
```

The remaining CSS diff is limited to box-sizing/font-family.


## Step 22: Extract `BookingSpaceAside` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/BookingSpaceAside/BookingSpaceAside.css`.
- Moved dark panel, title, spec list, footer, and email styles out of JSX.
- Added stable part hooks for `title`, `spec-list`, `spec`, `spec-label`, `spec-value`, `footer`, and `email`.
- Moved the repeated spec data into a named `specs` constant.
- Updated `BookingSpaceAside.tsx` to self-import CSS and use `clsx('pyxis-booking-space-aside', className)`.
- Added `Narrow` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-space-aside-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 0.0000% | 0/149700
root      0.0000% | 0/149700
```

This was an exact pixel-parity extraction.


## Step 23: Extract `BookingRules` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/BookingRules/BookingRules.css`.
- Moved panel, title, and body styles out of JSX.
- Added stable `data-pyxis-part` hooks for `title` and `body`.
- Updated `BookingRules.tsx` to self-import CSS and use `clsx('pyxis-booking-rules', className)`.
- Added `Narrow` and `ThemeOverride` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-rules-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 2.4789% | 1174/47360
root      2.4789% | 1174/47360
```

The config reports width/height differences because the prototype selector is `> *` while the React selector is the component root in its fixture context.


## Step 24: Extract `BookingSuccess` CSS

### What I did

- Created `web/packages/pyxis-components/src/public/BookingSuccess/BookingSuccess.css`.
- Moved success icon, title, message, and root layout styles out of JSX.
- Added stable `data-pyxis-part` hooks for `icon`, `title`, `message`, and `actions`.
- Updated `BookingSuccess.tsx` to self-import CSS and use `clsx('pyxis-booking-success', className)`.
- Added `WithArtist` and `Narrow` Storybook stories.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-success-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 7.3591% | 10401/141336
root      9.3157% | 11816/126840
```

The current config's original root selector targets the first child under the fixture, while the React selector targets the full success component root, so root CSS and pixel comparisons are not apples-to-apples. This component should receive selector/config tuning later if success-state parity is important.


## Step 25: Extract `BookingForm` CSS and complete B4

### What I did

- Created `web/packages/pyxis-components/src/public/BookingForm/BookingForm.css`.
- Moved intro, field, label, input, select, textarea, layout grid, action, and submit styles out of JSX.
- Added stable `data-pyxis-part` hooks for `intro`, `field`, `field-grid`, `label`, `input`, `select`, `textarea`, `actions`, and `submit`.
- Preserved and improved label/control relationships by adding explicit `id` and `htmlFor` pairs.
- Added tokenized focus-visible styles for controls and submit button.
- Added disabled styling for the submit button.
- Updated `BookingForm.tsx` to self-import CSS and use `clsx('pyxis-booking-form', className)`.
- Added `Submitting`, `Narrow`, and `ThemeOverride` Storybook stories.
- Marked the B4 validation tasks complete after typecheck and visual diff.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-form-default.css-visual-diff.yml
```

Typecheck passed. The visual-diff command completed all modes. Current output:

```text
component 1.7528% | 5536/315840
root      1.7528% | 5536/315840
```

B4 detail/booking CSS extraction is now complete.


## Step 26: Start B5 with about/contact/venue components

### What I did

- Created CSS files and extracted static inline styles for:
  - `AboutIntro`
  - `CollectiveList`
  - `FindUsBlock`
  - `SpaceInfo`
  - `VenueCard`
- Added stable `data-pyxis-part` selectors for the significant text/list/card subparts.
- Updated components to self-import CSS and use `clsx`.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config .../about-intro-default.css-visual-diff.yml
css-visual-diff run --config .../collective-list-default.css-visual-diff.yml
css-visual-diff run --config .../find-us-block-default.css-visual-diff.yml
css-visual-diff run --config .../space-info-default.css-visual-diff.yml
css-visual-diff run --config .../venue-card-default.css-visual-diff.yml
```

Typecheck passed. Current pixel diffs:

```text
AboutIntro      component 4.3161% | root 4.5559%
CollectiveList  component 5.1793% | root 5.1793%
FindUsBlock     component 5.8667% | root 5.8667%
SpaceInfo       component 2.4884% | root 2.4884%
VenueCard       component 2.7831% | root 2.7831%
```

These were architecture extraction passes, not final visual tuning passes.


## Step 27: Extract `AboutHero`, `EthosGrid`, and `EthosStrip` CSS

### What I did

- Created CSS files and extracted static inline styles for:
  - `AboutHero`
  - `EthosGrid`
  - `EthosStrip`
- Added stable `data-pyxis-part` selectors for hero and ethos subparts.
- Updated the components to self-import CSS and use `clsx`.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config .../about-hero-default.css-visual-diff.yml
css-visual-diff run --config .../ethos-grid-default.css-visual-diff.yml
css-visual-diff run --config .../ethos-strip-default.css-visual-diff.yml
```

Typecheck passed. Current pixel diffs:

```text
AboutHero  component 0.0000% | root 10.5730%
EthosGrid  component 5.9015% | root 5.9015%
EthosStrip component 9.6481% | root 7.4975%
```

`AboutHero` component parity is exact; its root residual appears to be selector/context related. Ethos components still need later visual tuning/taxonomy decision.


## Step 28: Complete B5 shell/home/footer extraction

### What I did

- Created CSS files and extracted static inline styles for:
  - `MailingListCTA`
  - `PubHero`
  - `PubFooter`
- Cleaned `PubNav.css` to replace hardcoded colors/radii/weights with tokens.
- Added stable part selectors for CTA, hero, and footer subparts.
- Ran final B5 typecheck and matching visual-diff configs.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
css-visual-diff run --config .../mailing-list-cta-default.css-visual-diff.yml
css-visual-diff run --config .../pub-hero-default.css-visual-diff.yml
css-visual-diff run --config .../pub-footer-default.css-visual-diff.yml
css-visual-diff run --config .../pub-nav-default.css-visual-diff.yml
```

Typecheck passed. Current pixel diffs:

```text
MailingListCTA component 3.3797% | root 13.1343%
PubHero        component 0.0218% | root 0.0218%
PubFooter      component 0.2511% | root 0.3725%
PubNav         component 1.7409% | root 1.7409%
```

B5 extraction tasks are now complete. Remaining concerns are taxonomy/ADR-level decisions and visual tuning, not the initial CSS extraction pass.


## Step 29: B6 Storybook theme/variant coverage pass

### What I did

- Added or normalized Storybook stories for B5/public shell components:
  - `AboutHero`
  - `AboutIntro`
  - `CollectiveList`
  - `EthosGrid`
  - `EthosStrip`
  - `FindUsBlock`
  - `SpaceInfo`
  - `VenueCard`
  - `MailingListCTA`
  - `PubHero`
  - `PubFooter`
- Added representative narrow/mobile and theme override stories using component-local CSS variables.
- Kept `unstyled` and custom slot/renderer stories as N/A because this pass did not add those APIs.

### Validation

```bash
cd web && pnpm --filter pyxis-components typecheck
```

Typecheck passed.


## Step 30: B6 Storybook smoke check

### What I did

Used the live Storybook dev server on port 6006 and fetched representative public component theme stories:

```bash
curl -fsS 'http://localhost:6006/iframe.html?id=public-organisms-pubhero--theme-override&viewMode=story'
curl -fsS 'http://localhost:6006/iframe.html?id=public-organisms-mailinglistcta--theme-override&viewMode=story'
```

Both iframe requests returned successfully.


## Step 31: B7 validation and cleanup

### What I did

- Ran component package typecheck and recursive workspace typecheck.
- Re-ran inline-style and hardcoded-color scans.
- Re-ran all public molecule and public organism visual-diff config directories.
- Added `reference/02-css-extraction-validation-cleanup.md` with classification of remaining inline styles and hardcoded colors.
- Updated `prototype-design/visual-diff/comparisons/component-system/component-parity-map.json` with `styleArchitecture` metadata for extracted public components.

### Validation commands

```bash
cd web && pnpm --filter pyxis-components typecheck
cd web && pnpm -r typecheck
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/molecules
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/organisms
```

All commands completed successfully.

### Remaining accepted/documented issues

- Some story/fixture inline styles remain and are acceptable as Storybook/capture layout.
- `ShowMetaStrip`, `ShowTile`, and `Poster` retain dynamic inline styles for CSS variables.
- CSS files still contain hardcoded fallback values in component-local variables; future token-hardening should replace these where parity allows.
- `PubShowRow` remains deferred pending taxonomy.


## Step 32: B8 ADRs, postmortem, and playbook updates

### What I did

- Added `design-doc/03-public-component-theming-adr.md`.
- Added `design-doc/04-public-component-taxonomy-adr.md`.
- Added `reference/03-css-extraction-postmortem.md`.
- Updated `docs/playbooks/05-bottom-up-component-visual-parity.md` with CSS extraction workflow lessons.
- Updated ticket index, tasks, and changelog.

### Key decisions captured

- `data-pyxis-component` / `data-pyxis-part` are the repo-specific theming selector contract.
- `unstyled` mode remains deferred until a concrete consumer needs it.
- Slots/renderers should be added selectively, not everywhere.
- `PubShowRow` remains deferred pending taxonomy.
- `ShowTile`/`ShowGrid`, `ArchiveShowRow`, `BookingSpaceAside`, `FindUsBlock`, and `EthosGrid` are the recommended canonical choices for their respective page contexts pending review.

### Workflow lessons captured

- Separate CSS architecture extraction from token-hardening/visual tuning.
- Preserve exact prototype values during extraction to avoid accidental drift.
- `css-visual-diff run --config-dir` needs a consolidated summary mode.
- Configs should warn when original/react selector scopes differ substantially.
- React-before/after baseline mode would help refactor-safety workflows.


## Step 33: Track A1 — add `pyxis-types` workspace package

### What I did

- Re-read the RTK Query / `pyxis-types` migration guide fully before starting data-layer work.
- Ran baseline workspace typecheck.
- Created `web/packages/pyxis-types` with:
  - `package.json`,
  - `tsconfig.json`,
  - `tsconfig.build.json`,
  - `src/public.ts`,
  - `src/index.ts`.
- Added public API/domain contracts to `pyxis-types`, including `Show`, `ArchivedShow`, `LineupEntry`, `ArchiveStats`, booking types, API error type, and the mock/admin-only `Artist`/`Submission` types that currently live in component mocks.
- Added `pyxis-types` workspace dependencies to `pyxis-components` and `pyxis-user-site`.
- Added TypeScript path mappings for `pyxis-types`.
- Ran `pnpm install` from `web` so the lockfile reflects the new workspace package.

### Commands

```bash
cd web && pnpm -r typecheck
cd web && pnpm install
cd web && pnpm --filter pyxis-types typecheck
cd web && pnpm --filter pyxis-types build
```

### Issue encountered

The first `pyxis-types` build failed with:

```text
tsconfig.build.json(3,3): error TS5096: Option 'allowImportingTsExtensions' can only be used when either 'noEmit' or 'emitDeclarationOnly' is set.
```

Cause: the package inherits `allowImportingTsExtensions` from the workspace root, but `pyxis-types` build emits JS and declarations.

Fix: set `allowImportingTsExtensions: false` in `web/packages/pyxis-types/tsconfig.json`. The package does not use `.ts` import specifiers, so this is safe.

### Result

`pyxis-types` typecheck and build now pass.


## Step 34: Track A2 — migrate duplicated types to `pyxis-types`

### What I did

- Replaced `web/packages/pyxis-user-site/src/api/types.ts` with compatibility re-exports from `pyxis-types`.
- Replaced `web/packages/pyxis-components/src/mocks/types.ts` with compatibility re-exports from `pyxis-types`.
- Updated `web/packages/pyxis-components/src/mocks/handlers.ts` to import public API types directly from `pyxis-types`.
- Updated public components that imported from `../../mocks/types` to import from `pyxis-types`.
- Updated `Archive.tsx` to import `ArchivedShow` directly from `pyxis-types`.
- Ran the import scan for `mocks/types` / `api/types`; only the compatibility-file comment remains.

### Commands

```bash
rg "mocks/types|api/types" web/packages -g'*.ts' -g'*.tsx'
cd web && pnpm -r typecheck
```

### Issue encountered

Direct TypeScript path mappings from `pyxis-types` to `packages/pyxis-types/src` made `pyxis-components` typecheck fail with `TS6059` because the imported source files were outside `pyxis-components` `rootDir`.

Fix: remove the temporary `pyxis-types` path mappings and let TypeScript resolve the workspace package through its package metadata. Because that package metadata points to `dist`, the generated `pyxis-types/dist` files are committed intentionally so a clean checkout can typecheck before a separate package build.

### Result

`cd web && pnpm -r typecheck` passes after the migration.


## Step 35: Track A3 — add RTK Query infrastructure

### What I did

- Added `@reduxjs/toolkit` and `react-redux` to `pyxis-user-site`.
- Created `web/packages/pyxis-user-site/src/api/publicApi.ts` with RTK Query endpoints for:
  - upcoming shows,
  - show detail,
  - archive,
  - archive stats,
  - booking submission.
- Created `web/packages/pyxis-user-site/src/store.ts` with `makeStore()`, singleton `store`, RTK Query reducer/middleware, listeners, and typed Redux hooks.
- Created `web/packages/pyxis-user-site/src/api/errors.ts` to normalize RTK Query and serialized errors for page UI.
- Kept TanStack React Query dependencies temporarily because `App.tsx` and existing hooks still use them until A4/A5.

### Commands

```bash
cd web && pnpm --filter pyxis-user-site add @reduxjs/toolkit react-redux
cd web && pnpm --filter pyxis-user-site typecheck
```

### Result

`pyxis-user-site` typecheck passes with the new RTK Query infrastructure present but not yet wired into pages/providers.


## Step 36: Track A4-A6 — migrate user-site to RTK Query

### What I did

- Rewrote `web/packages/pyxis-user-site/src/api/hooks.ts` as compatibility wrappers over generated RTK Query hooks.
- Replaced `QueryClientProvider` in `App.tsx` with Redux `<Provider store={store}>`.
- Updated `Shows.tsx` to use `getApiErrorMessage(error)` because RTK Query errors are not necessarily `Error` instances.
- Updated user-site page stories and Storybook preview to use Redux `Provider` with `makeStore()` instead of React Query.
- Removed the old `apiFetch` client file after no imports remained.
- Removed `@tanstack/react-query` and `@tanstack/react-query-devtools` dependencies.

### Commands

```bash
cd web && pnpm --filter pyxis-user-site typecheck
rg "@tanstack|useQuery|useMutation|QueryClient|QueryClientProvider|apiFetch|ApiException" web/packages/pyxis-user-site -g'*.ts' -g'*.tsx' -g'package.json'
cd web && pnpm --filter pyxis-user-site remove @tanstack/react-query @tanstack/react-query-devtools
cd web && pnpm -r typecheck
cd web && pnpm --filter pyxis-user-site build
cd web && pnpm --filter pyxis-user-site build-storybook
cd web && pnpm -r test
```

### Results

- `pyxis-user-site` typecheck passed.
- Recursive workspace typecheck passed.
- `pyxis-user-site` production build passed.
- `pyxis-user-site` Storybook static build passed after replacing the old React Query preview decorator.
- The TanStack/API-client search returns no matches under `pyxis-user-site`.

### Issue encountered

The first user-site Storybook build failed because `.storybook/preview.tsx` still imported `QueryClient` / `QueryClientProvider` from `@tanstack/react-query`, which had just been removed.

Fix: replace the preview decorator with Redux `Provider` and `makeStore()`.

`pnpm -r test` still fails because `pyxis-components` has no Vitest test files and Vitest exits with code 1. This is an existing test-script stability issue rather than an RTK Query migration failure.
