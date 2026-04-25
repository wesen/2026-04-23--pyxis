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
