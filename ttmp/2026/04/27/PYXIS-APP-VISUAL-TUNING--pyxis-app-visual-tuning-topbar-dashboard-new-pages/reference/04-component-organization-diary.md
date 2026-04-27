---
Title: Component Organization Diary
Ticket: PYXIS-APP-VISUAL-TUNING
Status: active
Topics:
  - frontend
  - react
  - component-organization
  - storybook
  - css
DocType: reference
Intent: implementation
Summary: Diary for the safer pyxis-app component organization restart after rollback.
LastUpdated: 2026-04-27T11:45:00-04:00
WhatFor: Track each implementation step and recovery detail while reorganizing pyxis-app components.
WhenToUse: Read before continuing component organization work.
---

# Diary

## Goal

This diary records the safer restart of pyxis-app component organization after rolling back the risky shell/organism refactor. The goal is to establish a single component organization concept, work through small ordered tasks, validate after each step, and commit at appropriate intervals.

## Step 1: Create the implementation plan, tasks, and diary scaffold

We restarted from the rollback baseline and agreed not to move files again until the organization model was written down. This step captures the implementation guide, a task list, and this diary so that future changes have a concrete sequence and review checklist.

The key change in process is that component organization is no longer treated as a single large filesystem move. It is split into phases: documentation, validation baseline, public barrels, shell-only split, multi-export component splits, and only then optional page-grouped organisms.

### Prompt Context

**User prompt (verbatim):** "cool, add tasks to the ticket, and then work through them one by one, keeping a diary (see skill), committing at appropriate intervals"

**Assistant interpretation:** Create ticket tasks, start a diary following the diary skill format, then implement the component organization plan one task at a time with focused commits.

**Inferred user intent:** Avoid repeating the previous refactor failure by making the work explicit, incremental, and recoverable.

**Commit (code):** pending — this first step is documentation/bookkeeping.

### What I did

- Confirmed the working tree only had the newly uploaded implementation guide untracked after rollback.
- Inspected current page imports and found the remaining legacy import surfaces:
  - `components/organisms/Panels`
  - `components/organisms/Phase8Sections`
  - `components/organisms/ShowsSections`
  - `components/shell/AppShell`
- Created `tasks.md` in the ticket workspace.
- Created this diary file.

### Why

The previous refactor mixed component movement, import rewriting, CSS ownership changes, and Storybook movement. The new process needs tasks and a diary before code changes so each step can be validated and reverted independently.

### What worked

- The rollback left the repository at a clean baseline matching `c843375`.
- The current legacy import surface is small enough to handle before moving files.

### What didn't work

- No implementation failures in this step.

### What I learned

- The first practical code step should not be moving files. It should be normalizing imports through public layer barrels so later movement has fewer consumers to update.

### What was tricky to build

The tricky part is ordering. Shell splitting is tempting to do first, but if pages still import deep shell paths and organisms still import legacy barrels, subsequent moves become harder to review. The safer order is to establish public import surfaces first.

### What warrants a second pair of eyes

- Whether `components/organisms/index.ts` should export all current organisms immediately or only those used by pages.
- Whether legacy barrels should remain as shims during all early phases.

### What should be done in the future

- Complete T02 to restore a useful validation baseline.
- Complete T03 before any shell/organism file moves.

### Code review instructions

Start with:

- `ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/tasks.md`
- `ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/reference/03-component-organization-implementation-guide.md`
- `ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/reference/04-component-organization-diary.md`

Validation for this step is mostly review of the task order and guide. Code validation starts in T02.

### Technical details

Current planned first implementation tasks:

1. T02: fix baseline Storybook typing so `tsc` can be trusted.
2. T03: add `components/organisms/index.ts` and migrate page imports away from legacy barrels.
3. T04: add/check relative import resolver that sees CSS imports.

## Step 2: Restore a useful validation baseline

The rollback restored the intended visual baseline, but it also restored a TypeScript issue in `AppTopBar.stories.tsx`: Storybook's typed `StoryObj` required `args.title` because `AppTopBarProps.title` is required. This made `tsc --noEmit` fail before any new refactor work began.

This step intentionally fixed only that baseline validation issue. It does not reorganize folders or change runtime component behavior. The purpose is to make the validation commands trustworthy before touching import surfaces or moving files.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Work through the ticket tasks one by one; after committing the task/diary scaffold, start with the first implementation task that restores a meaningful validation baseline.

**Inferred user intent:** Avoid building new refactor work on top of a baseline where TypeScript already fails.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Edited `web/packages/pyxis-app/src/components/shell/AppTopBar.stories.tsx`.
- Added default story meta args:
  - `title: 'Welcome back, Ada'`
- Marked T01 and T02 complete in `tasks.md`.
- Ran validation from `web/packages/pyxis-app`:
  - `pnpm exec tsc --noEmit`
  - `pnpm exec vite build`
  - `pnpm exec storybook build`

### Why

The component organization work needs a stable test harness. If `tsc` fails before we start, then later failures are ambiguous. Fixing the baseline story typing means future refactor commits can use `tsc`, Vite, and Storybook build as real gates.

### What worked

All validation commands passed after the story meta args were added.

### What didn't work

Storybook build emitted known warnings from dependencies:

```text
Use of eval in @storybook/core/dist/preview/runtime.js is strongly discouraged
Some chunks are larger than 500 kB after minification
```

These are warnings, not build failures, and are unrelated to the component organization work.

### What I learned

The rollback baseline was visually useful but not validation-clean. We need to distinguish between a visual baseline and a type/build baseline.

### What was tricky to build

The important constraint was not to “improve” the story or refactor it yet. The only safe change was to satisfy Storybook's required args typing while preserving the rendered story bodies.

### What warrants a second pair of eyes

- Confirm that adding a meta-level default `title` arg does not affect visual output of the custom render stories. It should not, because each story render still passes its own `title` directly to `AppTopBar`.

### What should be done in the future

- Continue with T03: add public barrels and migrate page imports away from legacy barrels before moving files.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/shell/AppTopBar.stories.tsx`
- `ttmp/.../tasks.md`
- this diary entry

Validate:

```bash
cd web/packages/pyxis-app
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### Technical details

The issue was:

```text
Property 'args' is missing in type '{ render: () => JSX.Element; }' but required in type '{ args: { title: string; ... } }'.
```

The fix was:

```ts
args: {
  title: 'Welcome back, Ada',
},
```

## Step 3: Add public organism barrel and migrate page imports away from legacy barrels

This step established a cleaner public import surface before any file movement. Instead of pages importing from legacy implementation barrels such as `Panels`, `Phase8Sections`, or `ShowsSections`, pages now import organisms from a single layer barrel.

This reduces the number of paths that future component moves need to update. It also makes page imports match the organization contract: pages consume the component layer's public API, while component internals can remain direct and local.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Continue working through the ordered tasks after restoring the validation baseline.

**Inferred user intent:** Normalize imports and retire legacy page-level import paths before moving component files.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created `web/packages/pyxis-app/src/components/organisms/index.ts`.
- Exported current organism component folders from that layer barrel.
- Updated page imports away from:
  - `../../components/organisms/Panels`
  - `../../components/organisms/Phase8Sections`
  - `../../components/organisms/ShowsSections`
  - `../../components/shell/AppShell`
- Pages now import from:
  - `../../components/organisms`
  - `../../components/shell`
- Left legacy barrels in place as compatibility shims.
- Marked T03 complete in `tasks.md`.

### Why

Before moving files, consumers should have a stable public API. If every page deep-imports implementation files or legacy phase barrels, every filesystem move becomes noisy and risky. A layer barrel lets later refactors update the barrel and component internals without rewriting every page.

### What worked

Validation passed after the import migration:

```bash
cd web/packages/pyxis-app
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

All three commands completed successfully.

### What didn't work

Storybook build still emits dependency/build-size warnings:

```text
Use of eval in @storybook/core/dist/preview/runtime.js is strongly discouraged
Some chunks are larger than 500 kB after minification
```

These warnings were already present and are not caused by this import migration.

### What I learned

A public layer barrel for `organisms` is enough to remove page dependency on legacy barrels without deleting those legacy barrels. This gives us a safer migration path: first normalize imports, then split/move component files.

### What was tricky to build

The main risk was over-migrating imports. Type-only imports such as `AttendanceDraft`, `BookingDetailsDraft`, and `CoreSettingsDraft` still point to their specific component implementation files because the components currently export those types from the TSX files and the local component barrels already re-export them. A future cleanup can migrate these to component-folder barrels or public layer exports deliberately.

### What warrants a second pair of eyes

- Whether `organisms/index.ts` should export every organism immediately, or only the organisms consumed by pages.
- Whether type-only deep imports should be migrated in a later task before moving those component files.

### What should be done in the future

- T04: add/check a relative import resolver that sees CSS imports.
- T05: split shell components only after the import surface and resolver are in place.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/organisms/index.ts`
- page imports under `web/packages/pyxis-app/src/pages/**/Page.tsx`
- `web/packages/pyxis-app/src/pages/shared.tsx`
- `tasks.md`
- this diary entry

Validate:

```bash
cd web/packages/pyxis-app
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### Technical details

Legacy barrels remain present:

```text
components/organisms/Panels.tsx
components/organisms/Phase8Sections.tsx
components/organisms/DashboardSections.tsx
components/organisms/ShowsSections.tsx
```

They are not deleted in this step. The goal is to stop page usage first, then retire the legacy files later after component internals are cleaned up.

## Step 4: Add a CSS-aware relative import resolver

This step added a reusable validation script that checks relative imports in pyxis-app source files, including CSS side-effect imports. This is important because the previous failed refactor had a broken CSS import that TypeScript did not catch, but Vite/Storybook did.

The script gives us a cheap guardrail before and after file moves. It is intentionally simple: scan source files for relative import specifiers, emulate project-local resolution for TS/TSX/JS/JSX/CSS files and folder indexes, and report anything unresolved.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Continue task execution and add the import-safety tooling described by the implementation guide.

**Inferred user intent:** Prevent the same class of CSS import-analysis failure from recurring during future component moves.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created `web/packages/pyxis-app/scripts/check-relative-imports.py`.
- Made it executable.
- The script checks imports in `.ts`, `.tsx`, `.js`, and `.jsx` files.
- It resolves:
  - extensionless imports,
  - `.ts`, `.tsx`, `.js`, `.jsx`, `.css`,
  - folder `index.ts`, `index.tsx`, `index.js`, `index.jsx`.
- Marked T04 complete in `tasks.md`.

### Why

`tsc --noEmit` does not reliably catch CSS side-effect import resolution problems. Vite does. A small resolver script lets us detect those problems before starting Storybook or waiting for a full build.

### What worked

The script reported a clean tree:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
```

Output:

```text
unresolved: 0
```

Full validation also passed:

```bash
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### What didn't work

No failures in this step. Storybook emitted the same known dependency/build-size warnings as before.

### What I learned

Having a CSS-aware import check before moving files is mandatory for this repo. It catches a class of errors that TypeScript can miss.

### What was tricky to build

The script is intentionally not a TypeScript compiler or Vite replacement. It only handles project-local relative imports and common extension/index resolution. That is enough for the specific refactor-safety use case.

### What warrants a second pair of eyes

- Whether the script should be wired into `package.json` as `check:imports`.
- Whether it should ignore generated/test files if future false positives appear.

### What should be done in the future

- Run this script before and after T05 shell splitting.
- Consider promoting it to a shared tool if other packages have similar CSS import risks.

### Code review instructions

Review:

- `web/packages/pyxis-app/scripts/check-relative-imports.py`
- `tasks.md`
- this diary entry

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### Technical details

The script uses a regex over import declarations:

```text
from './...'
import './...'
```

and checks whether the path resolves to a file or folder index using the app source tree.

## Step 5: Split shell components into component-owned folders and CSS

This step split the shell layer only. It deliberately did not move organisms, molecules, or atoms. The goal was to fix the biggest multi-component TSX file while preserving behavior and making CSS ownership explicit for every standalone shell component.

The important change from the failed attempt is that `AppShell.css` was not simply moved as one shared stylesheet. Its selectors were divided into component-owned CSS files: `AppTopBar.css`, `AppSidebar.css`, `AppSidebarMenu.css`, `AppSidebarUserFooter.css`, `AppMobileBottomNav.css`, and a smaller `AppShell.css` for the layout shell itself.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Continue through the task list and implement the shell-only split after public barrels and import validation are in place.

**Inferred user intent:** Achieve one exported shell component per folder without repeating the missing-CSS bug from the previous attempt.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created shell component folders:
  - `AppShell/`
  - `AppTopBar/`
  - `AppSidebar/`
  - `AppSidebarMenu/`
  - `AppSidebarUserFooter/`
  - `AppMobileBottomNav/`
- Moved existing shell stories into matching folders with `git mv`.
- Split the previous `AppShell.tsx` exports into separate TSX files.
- Split `AppShell.css` selectors by component ownership:
  - shell layout selectors stayed in `AppShell/AppShell.css`
  - topbar selectors moved to `AppTopBar/AppTopBar.css`
  - sidebar frame selectors moved to `AppSidebar/AppSidebar.css`
  - sidebar menu/nav selectors moved to `AppSidebarMenu/AppSidebarMenu.css`
  - user footer selectors moved to `AppSidebarUserFooter/AppSidebarUserFooter.css`
  - mobile bottom nav selectors moved to `AppMobileBottomNav/AppMobileBottomNav.css`
- Updated shell story imports to import from local folder barrels (`'.'`).
- Updated `components/shell/index.ts` to export from the new component folders.
- Marked T05 complete in `tasks.md`.

### Why

`AppShell.tsx` exported six React components from one file. That violated the component organization contract and made standalone stories depend on implementation details. Splitting shell first is safer than organism page grouping because the surface area is small and the visual target (`AppTopBar`) lives here.

### What worked

All validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The import resolver reported:

```text
unresolved: 0
```

### What didn't work

No build failures. Storybook emitted the same known dependency/build-size warnings.

### What I learned

Splitting CSS by selector ownership avoids the previous hidden dependency where standalone `AppTopBar` only looked correct because `AppShell.tsx` imported a shared stylesheet. The key invariant is: every standalone component imports the CSS for its own selectors.

### What was tricky to build

The media query in the old `AppShell.css` contained selectors for multiple components. I split it by ownership while preserving the page-level dashboard topbar hiding rule in `AppShell/AppShell.css`, because that rule belongs to shell layout behavior rather than to `AppTopBar` itself.

### What warrants a second pair of eyes

- Visual inspection of `AppTopBar`, `AppSidebar`, `AppMobileBottomNav`, and full `AppShell` stories.
- Confirm that moving CSS into separate chunks does not alter cascade order in Storybook or the app.
- Confirm that `.app-shell[data-page='dashboard'] .app-topbar { display: none; }` belongs in `AppShell.css` rather than `AppTopBar.css`.

### What should be done in the future

- T06: split `ArtistCard` and `ArtistRosterRow`.
- Continue running the import resolver before `tsc`/Vite/Storybook on every refactor step.

### Code review instructions

Review shell files under:

```text
web/packages/pyxis-app/src/components/shell/
```

Start with:

- `AppShell/AppShell.tsx`
- `AppTopBar/AppTopBar.tsx`
- each component CSS file
- `shell/index.ts`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### Technical details

The split intentionally keeps page imports stable through the public shell barrel:

```ts
import { AppShell } from '../../components/shell';
```

No organism imports were moved in this step.

## Step 6: Split ArtistCard and ArtistRosterRow

This step split the first multi-export molecule into one component per folder. `ArtistCard` remains the card molecule, while `ArtistRosterRow` is now its own molecule with its own TSX, CSS, story, and local barrel.

The split deliberately avoided page or organism folder movement. It only changed the component boundary and imports that depended on the previous combined file.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Continue the ordered component organization tasks after the shell split.

**Inferred user intent:** Keep moving toward one exported component per directory while committing each safe, validated step.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Removed `ArtistRosterRow` from `molecules/ArtistCard/ArtistCard.tsx`.
- Created `molecules/ArtistRosterRow/` with:
  - `ArtistRosterRow.tsx`
  - `ArtistRosterRow.css`
  - `ArtistRosterRow.stories.tsx`
  - `index.ts`
- Updated `ArtistCard.stories.tsx` so it only demonstrates `ArtistCard`.
- Added separate `ArtistRosterRow` stories.
- Updated `organisms/ArtistRoster/ArtistRoster.tsx` to import:
  - `ArtistCard` from `../../molecules/ArtistCard`
  - `ArtistRosterRow` from `../../molecules/ArtistRosterRow`
- Updated `src/index.ts` to export `ArtistRosterRow`.
- Marked T06 complete in `tasks.md`.

### Why

`ArtistCard.tsx` exported two React components. That violated the organization contract and mixed card styling with table-row behavior. Splitting the row into its own molecule makes ownership clearer and makes Storybook hierarchy match the filesystem.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The import resolver reported:

```text
unresolved: 0
```

### What didn't work

No build failures. Storybook emitted the same known dependency/build-size warnings.

### What I learned

Some split components may not have much private CSS. `ArtistRosterRow` currently relies on shared table row styling from `molecules/Table/Table.css`, so its own CSS file is intentionally minimal and documents that dependency.

### What was tricky to build

The tricky part was avoiding a visual change. `ArtistRosterRow` uses the shared `.app-table-row` class, so the important CSS dependency is `../Table/Table.css`, now imported by `ArtistRosterRow.tsx` itself instead of piggybacking through `ArtistCard.tsx`.

### What warrants a second pair of eyes

- Whether `ArtistRosterRow.css` should remain a documentation-only CSS file or whether row-specific selectors should be moved into it later.
- Whether `src/index.ts` should keep exporting app internals like these molecules, or whether that public API should be reduced later.

### What should be done in the future

- T07: split `BookingCard` and `BookingQueueRow` using the same pattern.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/molecules/ArtistCard/ArtistCard.tsx`
- `web/packages/pyxis-app/src/components/molecules/ArtistCard/ArtistCard.stories.tsx`
- `web/packages/pyxis-app/src/components/molecules/ArtistRosterRow/`
- `web/packages/pyxis-app/src/components/organisms/ArtistRoster/ArtistRoster.tsx`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### Technical details

`ArtistRosterRow` imports shared table CSS directly:

```ts
import '../Table/Table.css';
import './ArtistRosterRow.css';
```

This keeps the component's visual dependencies explicit.

## Step 7: Split BookingCard and BookingQueueRow

This step split the second multi-export molecule. `BookingCard` now owns the booking card UI and card CSS, while `BookingQueueRow` owns the processed/bookings table row UI and table-row CSS.

The split also moved the processed table styling out of `BookingCard.css` into `BookingQueueRow.css`, which makes the table-row visual dependency explicit and keeps `BookingCard.css` focused on card selectors.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Continue the ordered component organization tasks after splitting `ArtistRosterRow`.

**Inferred user intent:** Keep separating multi-export components into clear one-component folders with owned CSS and stories.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Removed `BookingQueueRow` from `molecules/BookingCard/BookingCard.tsx`.
- Created `molecules/BookingQueueRow/` with:
  - `BookingQueueRow.tsx`
  - `BookingQueueRow.css`
  - `BookingQueueRow.stories.tsx`
  - `index.ts`
- Moved processed table row selectors from `BookingCard.css` into `BookingQueueRow.css`.
- Updated `BookingCard.stories.tsx` so it only demonstrates `BookingCard`.
- Added separate `BookingQueueRow` stories.
- Updated imports in:
  - `organisms/BookingQueue/BookingQueue.tsx`
  - `organisms/BookingsProcessedPanel/BookingsProcessedPanel.tsx`
  - `src/index.ts`
- Marked T07 complete in `tasks.md`.

### Why

`BookingCard.tsx` exported both a card component and a table-row component. These components have different layout contexts and CSS ownership. Splitting them lowers coupling and prevents the row/table styles from hiding inside a card stylesheet.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The import resolver reported:

```text
unresolved: 0
```

### What didn't work

No build failures. Storybook emitted the same known dependency/build-size warnings.

### What I learned

The row component still needs shared `Table.css`, but it should import that dependency itself. That way organisms using `BookingQueueRow` do not need to know which shared CSS file makes rows render correctly.

### What was tricky to build

The processed table selectors were originally in `BookingCard.css` even though they described the table-row/table context. Moving them to `BookingQueueRow.css` was the key ownership fix. I avoided changing the class names used by existing organisms so visual output should remain stable.

### What warrants a second pair of eyes

- `AttendancePanel` still imports `BookingCard.css` because its edit cards reuse the `app-booking-card` class. That is existing coupling and should be reviewed later as shared card styling or a dedicated attendance edit card component.
- Confirm visually that `BookingQueueRow` tables still match previous output.

### What should be done in the future

- T08: split `DashboardAttentionContent` and `DashboardAttentionCount`.
- Later task: audit private CSS imports such as `AttendancePanel` importing `BookingCard.css`.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/molecules/BookingCard/BookingCard.tsx`
- `web/packages/pyxis-app/src/components/molecules/BookingCard/BookingCard.css`
- `web/packages/pyxis-app/src/components/molecules/BookingQueueRow/`
- `web/packages/pyxis-app/src/components/organisms/BookingQueue/BookingQueue.tsx`
- `web/packages/pyxis-app/src/components/organisms/BookingsProcessedPanel/BookingsProcessedPanel.tsx`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### Technical details

`BookingQueueRow` imports shared table CSS and its owned row CSS:

```ts
import '../Table/Table.css';
import './BookingQueueRow.css';
```

## Step 8: Split DashboardAttentionContent and DashboardAttentionCount

This step split the last planned multi-export organism in Phase 3. `DashboardAttentionContent` now owns the attention list, while `DashboardAttentionCount` owns the compact count badge used by the mobile panel action.

The shared defaults and item types moved into an explicit `dashboardAttentionData.ts` file. This keeps both components from importing each other for shared data and makes the data dependency visible.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Continue the ordered component organization tasks after splitting `BookingQueueRow`.

**Inferred user intent:** Finish the multi-export component cleanup before considering optional page-grouped organism movement.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Removed `DashboardAttentionCount` from `DashboardAttentionContent.tsx`.
- Created `organisms/DashboardAttentionCount/` with:
  - `DashboardAttentionCount.tsx`
  - `DashboardAttentionCount.css`
  - `DashboardAttentionCount.stories.tsx`
  - `index.ts`
- Created `organisms/DashboardAttentionContent/dashboardAttentionData.ts` for:
  - `DashboardAttentionTone`
  - `DashboardAttentionItem`
  - `defaultDashboardAttentionItems`
- Added `DashboardAttentionContent.stories.tsx`, which was previously missing.
- Updated `DashboardAttentionPanel.tsx` to import the count component from `DashboardAttentionCount`.
- Updated `DashboardSections.tsx` and `organisms/index.ts` to export the new component.
- Marked T08 complete in `tasks.md`.

### Why

`DashboardAttentionContent.tsx` exported both list content and a separate count badge. Those are different components with different CSS selectors. Splitting them completes the initial one-exported-component-per-folder cleanup before any optional page-grouped organism moves.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The import resolver reported:

```text
unresolved: 0
```

### What didn't work

No build failures. Storybook emitted the same known dependency/build-size warnings.

### What I learned

Small shared data files are a better dependency boundary than importing sibling components for defaults/types. This is especially useful before future folder moves.

### What was tricky to build

The existing CSS combined `.app-live-label` and `.app-attention-count` in one rule. I moved `.app-attention-count` into `DashboardAttentionCount.css` and left `.app-live-label` in `DashboardAttentionContent.css` for now because it already existed there and there is also a more specific DashboardActivityPanel rule. This should be reviewed later as part of shared panel action styling.

### What warrants a second pair of eyes

- Whether `.app-live-label` belongs in `DashboardAttentionContent.css`, `DashboardActivityPanel.css`, or shared panel action CSS.
- Whether the new `dashboardAttentionData.ts` should live in a small shared `DashboardAttention/` folder if more attention components are added later.

### What should be done in the future

- T09: decide whether to proceed with optional page-grouped organism movement.
- Before any page grouping, visually inspect shell and changed molecule/organism stories.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/organisms/DashboardAttentionContent/`
- `web/packages/pyxis-app/src/components/organisms/DashboardAttentionCount/`
- `web/packages/pyxis-app/src/components/organisms/DashboardAttentionPanel/DashboardAttentionPanel.tsx`
- `web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx`
- `web/packages/pyxis-app/src/components/organisms/index.ts`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### Technical details

Shared data now lives here:

```text
DashboardAttentionContent/dashboardAttentionData.ts
```

The new count component owns its CSS:

```ts
import './DashboardAttentionCount.css';
```

## Step 9: Group Dashboard organisms under organisms/Dashboard

After the shell and multi-export component splits validated cleanly, we chose to proceed with the first optional page-group move: Dashboard organisms only. This was intentionally limited to one page group, because the previous failed refactor tried to move many groups at once.

This step moved Dashboard-specific organism folders under `components/organisms/Dashboard/`, added a Dashboard group barrel, updated legacy/root barrels, fixed imports using the CSS-aware resolver as the primary feedback loop, and updated Storybook titles to mirror the new folder hierarchy.

### Prompt Context

**User prompt (verbatim):** "yeah, looks good, do dashboard organism grouping"

**Assistant interpretation:** Proceed with T10, grouping only Dashboard organisms into `organisms/Dashboard/` after the user visually checked the prior state.

**Inferred user intent:** Continue the page-grouped organism organization, but safely and incrementally, starting with Dashboard.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created `web/packages/pyxis-app/src/components/organisms/Dashboard/`.
- Used `git mv` to move Dashboard organism folders:
  - `DashboardActivityPanel`
  - `DashboardAttentionContent`
  - `DashboardAttentionCount`
  - `DashboardAttentionPanel`
  - `DashboardHero`
  - `DashboardMetricsGrid`
  - `DashboardMobileCopy`
  - `DashboardMobileHeader`
  - `DashboardOverview`
  - `DashboardQuickActionsContent`
  - `DashboardQuickActionsPanel`
  - `DashboardUpcomingPanel`
- Added `organisms/Dashboard/index.ts`.
- Updated `DashboardSections.tsx` to re-export the Dashboard group.
- Updated `Panels.tsx` and `organisms/index.ts` to export from `./Dashboard`.
- Updated moved Dashboard imports:
  - seed data imports from `../../../api/mockData` to `../../../../api/mockData`
  - molecule imports from `../../molecules/...` to `../../../molecules/...`
  - `parts` imports from `../../parts` to `../../../parts`
  - `Panel` imports from `../Panel` to `../../Panel`
  - cross-group `ShowsTable` import to `../../ShowsTable`
- Updated `AttendancePanel`'s cross-group CSS import to the new DashboardMetricsGrid path.
- Updated Dashboard Storybook titles to `Pyxis App/Components/Organisms/Dashboard/<Component>`.
- Marked T09 and T10 complete in `tasks.md`.

### Why

Dashboard is the active visual tuning target, so grouping Dashboard organisms first gives us the future desired organization where it matters most, without forcing a repo-wide move.

### What worked

The validation sequence passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The import resolver reported:

```text
unresolved: 0
```

### What didn't work

The first resolver run after the move reported 43 unresolved imports. This was expected because the folder move changed relative depths. The resolver output was useful and concrete, listing every broken path including CSS imports and legacy barrel paths.

Examples included:

```text
src/components/organisms/Dashboard/DashboardActivityPanel/DashboardActivityPanel.tsx:3: ../Panel
src/components/organisms/Dashboard/DashboardMetricsGrid/DashboardMetricsGrid.tsx:1: ../../molecules/MetricCard
src/components/organisms/DashboardSections.tsx:1: ./DashboardMobileHeader
```

These were fixed with targeted Dashboard-only replacements, not global regex rewrites.

### What I learned

The CSS-aware import resolver is the right guardrail for page grouping. It catches all the important path breakages after a `git mv`, including CSS and legacy barrels, and lets us fix them in a scoped way.

### What was tricky to build

Two paths required special care:

1. `DashboardUpcomingPanel` imports `ShowsTable`, which is not part of the Dashboard group. After the move, this became a cross-group import:

```ts
import { ShowsTable } from '../../ShowsTable';
```

2. `AttendancePanel` imports `DashboardMetricsGrid.css`. That is a private CSS dependency that still exists from the older code. After the move, the path had to become:

```ts
import '../Dashboard/DashboardMetricsGrid/DashboardMetricsGrid.css';
```

This is valid after the move but still worth revisiting in a later CSS-ownership audit.

### What warrants a second pair of eyes

- Visual inspection of Dashboard organism stories under the new Storybook hierarchy.
- Whether `AttendancePanel` should keep depending on `DashboardMetricsGrid.css`, or whether `.app-metrics-grid` should become shared layout CSS.
- Whether `DashboardSections.tsx` should remain as a shim or be retired after more imports move to `organisms/Dashboard`.

### What should be done in the future

- Consider the next page group only after visual inspection.
- Candidate next groups: Shows or Bookings, one group per commit.
- Audit shared layout CSS classes before moving more page groups.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/organisms/Dashboard/`
- `web/packages/pyxis-app/src/components/organisms/Dashboard/index.ts`
- `web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx`
- `web/packages/pyxis-app/src/components/organisms/Panels.tsx`
- `web/packages/pyxis-app/src/components/organisms/index.ts`
- `web/packages/pyxis-app/src/components/organisms/AttendancePanel/AttendancePanel.tsx`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

### Technical details

Story titles now mirror the grouped filesystem shape, for example:

```ts
title: 'Pyxis App/Components/Organisms/Dashboard/DashboardHero'
title: 'Pyxis App/Components/Organisms/Dashboard/DashboardMetricsGrid'
title: 'Pyxis App/Components/Organisms/Dashboard/DashboardOverview'
```

## Step 10: Group Shows organisms under organisms/Shows

With Dashboard grouping validated and visually accepted, the next page-group move was Shows. This was still scoped to one page group and committed separately.

### Prompt Context

**User prompt (verbatim):** "looking good, go with next groups. DOn't forget to write a diary, keep committing at intermediate intervals."

**Assistant interpretation:** Continue page grouping one group at a time, keeping the established diary and validation discipline.

**Inferred user intent:** Move beyond Dashboard, but preserve the safety model: small commits, diary entries, and validation after each group.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created `components/organisms/Shows/`.
- Used `git mv` to move:
  - `ShowsArchivedPanel`
  - `ShowsConfirmedPanel`
  - `ShowsFilterBar`
  - `ShowsTable`
- Added `components/organisms/Shows/index.ts`.
- Updated shims/barrels:
  - `ShowsSections.tsx`
  - `Panels.tsx`
  - `organisms/index.ts`
- Updated moved Shows imports for the deeper folder path.
- Updated `DashboardUpcomingPanel` to import `ShowsTable` from the new Shows group.
- Updated Shows Storybook titles to `Pyxis App/Components/Organisms/Shows/<Component>`.
- Marked the Shows subtask complete in `tasks.md`.

### Why

Shows had an existing shim (`ShowsSections.tsx`) and a clear set of `Shows*` organisms, making it a good next page group after Dashboard.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The resolver reported:

```text
unresolved: 0
```

### What didn't work

No build failures. The same known Storybook chunk-size warnings appeared.

### What I learned

The existing `ShowsSections.tsx` shim made the page group boundary clear. Keeping shims as re-export compatibility layers lets the filesystem evolve without forcing every consumer to change at once.

### What was tricky to build

`DashboardUpcomingPanel` depends on `ShowsTable`, so grouping Shows created a cross-page-group import from Dashboard to Shows:

```ts
import { ShowsTable } from '../../Shows/ShowsTable';
```

This is a legitimate dependency for now, but it is a signal that `ShowsTable` may be more shared than purely page-local.

### What warrants a second pair of eyes

- Whether `ShowsTable` should remain in `organisms/Shows` or eventually move to a shared/table area if Dashboard continues to use it.
- Visual inspection of Shows stories under the new Storybook hierarchy.

### What should be done in the future

Proceed to the next group, likely Bookings, as its components have a similarly clear page boundary.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/organisms/Shows/`
- `web/packages/pyxis-app/src/components/organisms/Shows/index.ts`
- `web/packages/pyxis-app/src/components/organisms/ShowsSections.tsx`
- `web/packages/pyxis-app/src/components/organisms/Panels.tsx`
- `web/packages/pyxis-app/src/components/organisms/index.ts`
- `web/packages/pyxis-app/src/components/organisms/Dashboard/DashboardUpcomingPanel/DashboardUpcomingPanel.tsx`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

## Step 11: Group Bookings organisms under organisms/Bookings

After Shows passed validation, I grouped the Bookings and booking-review organisms into a single `Bookings` page group. This was committed separately from Shows to keep the refactor reviewable and reversible.

### Prompt Context

**User prompt (verbatim):** "looking good, go with next groups. DOn't forget to write a diary, keep committing at intermediate intervals."

**Assistant interpretation:** Continue with the next page group and keep the small-commit discipline.

**Inferred user intent:** Organize the remaining page-specific organisms while avoiding the earlier all-at-once refactor risk.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created `components/organisms/Bookings/`.
- Used `git mv` to move:
  - `BookingQueue`
  - `BookingReviewDatePanel`
  - `BookingReviewHero`
  - `BookingReviewNotePanel`
  - `BookingReviewRequestPanel`
  - `BookingsInboxPanel`
  - `BookingsInsightsPanel`
  - `BookingsProcessedPanel`
- Added `components/organisms/Bookings/index.ts`.
- Updated `organisms/index.ts` to export the Bookings group.
- Updated compatibility shims:
  - `Panels.tsx`
  - `Phase8Sections.tsx`
- Updated one remaining page deep import in `BookingReviewPage/Page.tsx`.
- Updated Bookings Storybook titles to `Pyxis App/Components/Organisms/Bookings/<Component>`.
- Marked the Bookings subtask complete in `tasks.md`.

### Why

The Bookings page group has a clear prefix boundary and several related review panels. Grouping it after Shows continues the page-oriented organization without mixing unrelated component families.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The resolver reported:

```text
unresolved: 0
```

### What didn't work

The first resolver pass caught expected remaining old paths in compatibility shims and a page deep import:

```text
src/components/organisms/Panels.tsx:4: ./BookingQueue
src/components/organisms/Phase8Sections.tsx:8: ./BookingsInboxPanel
src/pages/BookingReviewPage/Page.tsx:8: ../../components/organisms/BookingReviewRequestPanel/BookingReviewRequestPanel
```

These were fixed with targeted edits.

### What I learned

The compatibility shims still matter during page grouping. Even if pages use the public organism barrel, legacy shims must remain internally valid until they are retired.

### What was tricky to build

The Bookings group combines two naming prefixes: `BookingReview*` and `Bookings*`. I grouped both under `Bookings` because they serve the same bookings/review domain.

### What warrants a second pair of eyes

- Whether `BookingReview*` should be a nested subgroup later, for example `Bookings/Review/`, or whether the current flat Bookings group is easier to navigate.
- Visual inspection of the booking review panel stories after the title/path changes.

### What should be done in the future

Proceed to Calendar as the next low-risk group, then ShowDetail, Roster, and Settings/Shared.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/organisms/Bookings/`
- `web/packages/pyxis-app/src/components/organisms/Bookings/index.ts`
- `web/packages/pyxis-app/src/components/organisms/Phase8Sections.tsx`
- `web/packages/pyxis-app/src/components/organisms/Panels.tsx`
- `web/packages/pyxis-app/src/components/organisms/index.ts`
- `web/packages/pyxis-app/src/pages/BookingReviewPage/Page.tsx`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

## Step 12: Group Calendar organisms under organisms/Calendar

After Bookings passed validation, I grouped the Calendar organism family. This was again limited to one domain group and committed independently.

### Prompt Context

**User prompt (verbatim):** "looking good, go with next groups. DOn't forget to write a diary, keep committing at intermediate intervals."

**Assistant interpretation:** Continue with the next group after Bookings, preserving full validation and diary records.

**Inferred user intent:** Finish page-group organization safely while keeping each move isolated.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created `components/organisms/Calendar/`.
- Used `git mv` to move:
  - `CalendarAgenda`
  - `CalendarBoard`
  - `CalendarLegend`
  - `CalendarMonth`
  - `CalendarMonthPanel`
- Added `components/organisms/Calendar/index.ts`.
- Updated `organisms/index.ts` to export the Calendar group.
- Updated compatibility shims:
  - `Panels.tsx`
  - `Phase8Sections.tsx`
- Updated moved Calendar imports for the deeper folder path.
- Updated Calendar Storybook titles to `Pyxis App/Components/Organisms/Calendar/<Component>`.
- Marked the Calendar subtask complete in `tasks.md`.

### Why

Calendar has a clear prefix boundary and several components that depend on each other. Grouping them keeps those local dependencies inside one page-domain folder.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The resolver reported:

```text
unresolved: 0
```

### What didn't work

The first resolver pass found old Calendar exports in compatibility shims:

```text
src/components/organisms/Panels.tsx:5: ./CalendarMonth
src/components/organisms/Phase8Sections.tsx:4: ./CalendarLegend
```

Those were fixed by re-exporting `./Calendar` from the shims.

### What I learned

Calendar's internal dependencies (`CalendarBoard` -> `CalendarMonthPanel` / `CalendarAgenda`, and `CalendarMonthPanel` -> `CalendarLegend`) remained simple after the move because the component folders moved together under the same parent.

### What was tricky to build

The only real trick was keeping the old shims valid. The component-local imports were straightforward because the Calendar components mostly refer to each other as siblings.

### What warrants a second pair of eyes

- Visual inspection of Calendar board/month/agenda stories after the Storybook hierarchy change.
- Whether `CalendarMonth` and `CalendarMonthPanel` naming is sufficiently distinct now that they sit next to each other in the same group.

### What should be done in the future

Proceed to ShowDetail, then Roster, then Settings/Shared.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/organisms/Calendar/`
- `web/packages/pyxis-app/src/components/organisms/Calendar/index.ts`
- `web/packages/pyxis-app/src/components/organisms/Phase8Sections.tsx`
- `web/packages/pyxis-app/src/components/organisms/Panels.tsx`
- `web/packages/pyxis-app/src/components/organisms/index.ts`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

## Step 13: Group ShowDetail organisms under organisms/ShowDetail

After Calendar passed validation, I grouped the ShowDetail organism family. This was small and low-risk because the group has only three components and few dependencies.

### Prompt Context

**User prompt (verbatim):** "looking good, go with next groups. DOn't forget to write a diary, keep committing at intermediate intervals."

**Assistant interpretation:** Continue one group at a time and commit this group independently.

**Inferred user intent:** Keep progressing through page groups without batching too many filesystem moves.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created `components/organisms/ShowDetail/`.
- Used `git mv` to move:
  - `ShowDetailDiscordPanel`
  - `ShowDetailHero`
  - `ShowDetailInfoPanel`
- Added `components/organisms/ShowDetail/index.ts`.
- Updated `organisms/index.ts` to export the ShowDetail group.
- Updated `Phase8Sections.tsx` to export the ShowDetail group.
- Updated moved imports for the deeper folder path.
- Updated ShowDetail Storybook titles to `Pyxis App/Components/Organisms/ShowDetail/<Component>`.
- Marked the ShowDetail subtask complete in `tasks.md`.

### Why

ShowDetail is a compact page-domain group with a clear prefix and no need to mix it with other groups.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The resolver reported:

```text
unresolved: 0
```

### What didn't work

No validation failures occurred.

### What I learned

Small groups like ShowDetail are ideal for this migration style: `git mv`, update group barrel, update shims, run resolver, validate, commit.

### What was tricky to build

Nothing was particularly tricky in this group. The only dependency pattern to preserve was `Panel` via the compatibility shim.

### What warrants a second pair of eyes

Visual inspection of the ShowDetail stories under the new hierarchy.

### What should be done in the future

Proceed to Roster next, then Settings/Shared.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/organisms/ShowDetail/`
- `web/packages/pyxis-app/src/components/organisms/ShowDetail/index.ts`
- `web/packages/pyxis-app/src/components/organisms/Phase8Sections.tsx`
- `web/packages/pyxis-app/src/components/organisms/index.ts`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

## Step 14: Group Roster organisms under organisms/Roster

After ShowDetail passed validation, I grouped the Roster-related organisms. This group includes the artist roster and attendance panel, which are both roster/attendance domain components.

### Prompt Context

**User prompt (verbatim):** "looking good, go with next groups. DOn't forget to write a diary, keep committing at intermediate intervals."

**Assistant interpretation:** Continue to the next page/domain group and commit it independently.

**Inferred user intent:** Complete remaining group moves while preserving reviewable checkpoints.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created `components/organisms/Roster/`.
- Used `git mv` to move:
  - `ArtistRoster`
  - `AttendancePanel`
- Added `components/organisms/Roster/index.ts`.
- Updated `organisms/index.ts` and `Panels.tsx` to export the Roster group.
- Updated moved imports for the deeper folder path.
- Updated `AttendancePage/Page.tsx`, which still had a deep import to the old `AttendancePanel` location.
- Updated Roster Storybook titles to:
  - `Pyxis App/Components/Organisms/Roster/ArtistRoster`
  - `Pyxis App/Components/Organisms/Roster/AttendancePanel`
- Marked the Roster subtask complete in `tasks.md`.

### Why

Roster was the next clear domain group after ShowDetail. Keeping `ArtistRoster` and `AttendancePanel` together makes the page/domain structure easier to scan.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The resolver reported:

```text
unresolved: 0
```

### What didn't work

The first resolver pass found one old page deep import:

```text
src/pages/AttendancePage/Page.tsx:5: ../../components/organisms/AttendancePanel/AttendancePanel
```

This was fixed to the new Roster path.

### What I learned

Even after earlier page import cleanup, a few page-specific deep imports can remain. The resolver is useful as a migration audit, not just a build guardrail.

### What was tricky to build

`AttendancePanel` still imports CSS from Dashboard and BookingCard-related styles. The paths were updated and valid, but these dependencies remain design-system cleanup candidates.

### What warrants a second pair of eyes

- Whether `AttendancePanel` should live in `Roster` or a separate Attendance group if that page grows.
- CSS ownership of `AttendancePanel` dependencies on `DashboardMetricsGrid.css` and `BookingCard.css`.

### What should be done in the future

Proceed to Settings/Shared as the last planned group, then inspect remaining top-level organisms and decide whether they should stay shared.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/organisms/Roster/`
- `web/packages/pyxis-app/src/components/organisms/Roster/index.ts`
- `web/packages/pyxis-app/src/components/organisms/Panels.tsx`
- `web/packages/pyxis-app/src/components/organisms/index.ts`
- `web/packages/pyxis-app/src/pages/AttendancePage/Page.tsx`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

## Step 15: Group SettingsPanel under organisms/Settings

After Roster passed validation, I handled the final planned Settings/Shared bucket conservatively. I grouped the clearly Settings-specific component, `SettingsPanel`, and intentionally left standalone/shared organisms at the top level.

### Prompt Context

**User prompt (verbatim):** "looking good, go with next groups. DOn't forget to write a diary, keep committing at intermediate intervals."

**Assistant interpretation:** Finish the remaining planned grouping while avoiding unclear invented group names for shared components.

**Inferred user intent:** Keep moving page-specific organisms, but do not create unnecessary organization churn.

**Commit (code):** pending — this step will be committed after diary/task updates.

### What I did

- Created `components/organisms/Settings/`.
- Used `git mv` to move:
  - `SettingsPanel`
- Added `components/organisms/Settings/index.ts`.
- Updated `organisms/index.ts` and `Panels.tsx` to export the Settings group.
- Updated `SettingsPage/Page.tsx`, which had a type-only deep import to the old `SettingsPanel` path.
- Updated `SettingsPanel` imports for the deeper folder path.
- Updated the Storybook title to `Pyxis App/Components/Organisms/Settings/SettingsPanel`.
- Marked the Settings subtask complete in `tasks.md`, with a note that shared standalone organisms were intentionally left top-level.

### Why

`SettingsPanel` has a clear Settings domain. By contrast, `Panel`, `NewShowModal`, `FlyerField`, `AuditLogPanel`, and `DiscordMappingPanel` did not all belong in one obvious Settings/Shared folder. Moving only the clear component avoids making the filesystem worse just to satisfy a checklist.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

The resolver reported:

```text
unresolved: 0
```

### What didn't work

The first resolver pass found one remaining type-only deep import in `SettingsPage`:

```text
src/pages/SettingsPage/Page.tsx:5: ../../components/organisms/SettingsPanel/SettingsPanel
```

This was updated to the new Settings path.

### What I learned

A page-grouping task should preserve semantic clarity. It is better to leave genuinely shared/standalone organisms at the root than to create an artificial bucket that future developers will not understand.

### What was tricky to build

The code move itself was straightforward. The tricky part was deciding not to move ambiguous components such as `NewShowModal` and `FlyerField`, which are used by both Shows and ShowDetail flows.

### What warrants a second pair of eyes

- Whether `AuditLogPanel` and `DiscordMappingPanel` should later become their own tiny groups (`AuditLog/`, `Discord/`) if those pages grow.
- Whether `FlyerField` belongs under `ShowDetail`, `Shows`, or a shared media/upload area.
- Whether `NewShowModal` should remain shared or be renamed to reflect both create and edit usage.

### What should be done in the future

Inspect remaining top-level organisms and decide whether any should become their own domain groups. Do not force them into a single catch-all folder.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/organisms/Settings/`
- `web/packages/pyxis-app/src/components/organisms/Settings/index.ts`
- `web/packages/pyxis-app/src/components/organisms/Panels.tsx`
- `web/packages/pyxis-app/src/components/organisms/index.ts`
- `web/packages/pyxis-app/src/pages/SettingsPage/Page.tsx`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

## Step 16: Final page-grouping audit and T11 closeout

After the Settings grouping commit, I did a final audit of the page-grouping phase.

### Prompt Context

**User prompt (verbatim):** "looking good, go with next groups. DOn't forget to write a diary, keep committing at intermediate intervals."

**Assistant interpretation:** Finish the remaining planned page-group moves and close out the task list once all chosen groups validate.

**Inferred user intent:** Leave the repository in a documented, validated, reviewable state after the grouping series.

**Commit (code):** pending — this is a bookkeeping-only closeout commit.

### What I did

- Verified the working tree after the Settings commit.
- Listed the remaining top-level organism folders.
- Confirmed the CSS-aware import resolver still reports `unresolved: 0`.
- Marked the umbrella T11+ task complete.

Remaining top-level organism folders are now intentionally either page groups or shared/standalone components:

```text
AuditLogPanel
Bookings
Calendar
Dashboard
DiscordMappingPanel
FlyerField
NewShowModal
Panel
Roster
Settings
ShowDetail
Shows
```

`AuditLogPanel`, `DiscordMappingPanel`, `FlyerField`, `NewShowModal`, and `Panel` were left top-level intentionally because they are standalone/shared or do not yet have enough domain weight to justify a folder group.

### Why

The page-grouping task is complete for the explicit groups we chose to move. Closing the umbrella task avoids leaving the ticket in an ambiguous state.

### What worked

The resolver still passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
```

Output:

```text
unresolved: 0
```

### What didn't work

No issues in the closeout audit.

### What I learned

The safest grouping rule is: move clear page/domain families, but leave shared or ambiguous components alone until there is a stronger concept for them.

### What warrants a second pair of eyes

- Whether `AuditLogPanel` and `DiscordMappingPanel` should become `AuditLog/` and `Discord/` later.
- Whether `NewShowModal` and `FlyerField` should remain shared or move into a future `ShowsShared/` or `ShowEditing/` domain.

### What should be done in the future

Visually inspect the Storybook hierarchy after all group moves. Then, if the UI still looks good, proceed to the original visual-tuning task: fix token drift and re-run TopBar/dashboard visual diffs.

### Code review instructions

Review the grouped organism roots:

- `web/packages/pyxis-app/src/components/organisms/Dashboard/`
- `web/packages/pyxis-app/src/components/organisms/Shows/`
- `web/packages/pyxis-app/src/components/organisms/Bookings/`
- `web/packages/pyxis-app/src/components/organisms/Calendar/`
- `web/packages/pyxis-app/src/components/organisms/ShowDetail/`
- `web/packages/pyxis-app/src/components/organisms/Roster/`
- `web/packages/pyxis-app/src/components/organisms/Settings/`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

## Step 17: Fix AppTopBar selector leakage into Button labels

After the page-grouping work, we returned to visual tuning and inspected the captured TopBar comparison images. The primary TopBar button looked wrong: its icon was white, but the `New show` label was muted gray.

### Prompt Context

**User prompt (verbatim):** "ok, let's put our workflow to use. Use read to look at captured images, not understand image. There's something weird with the topnavbar button look as well"

**Assistant interpretation:** Use css-visual-diff artifacts and image reads to diagnose the TopBar button issue before broader token alignment.

**Inferred user intent:** Prefer the visual-diff workflow and inspect actual captured artifacts; fix obvious visual defects before tuning subtle token drift.

**Commit (code):** pending — this step will be committed after diary update.

### What I did

- Ran `css-visual-diff compare-spec` for `app-topbar-dashboard`.
- Used `read` on the captured images:
  - `left_region.png`
  - `right_region.png`
  - `diff_comparison.png`
- Identified that the app's `New show` label appeared muted while the prototype label was white.
- Fixed the broad CSS selector in `AppTopBar.css`:
  - from `.app-topbar span`
  - to `.app-topbar-eyebrow`
- Added explicit markup classes in `AppTopBar.tsx`:
  - `app-topbar-heading`
  - `app-topbar-eyebrow`

### Why

The broad `.app-topbar span` selector styled every span inside the TopBar, including the internal label span rendered by the shared `Button` primitive. This violated the primitive boundary: a shell container was accidentally styling inside a reused atom.

### What worked

The captured images confirmed the fix. After the change, the `New show` label is white again in the app region.

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Visual diff was rerun:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page app-topbar-dashboard \
  --outDir /tmp/pyxis-topbar-after-selector \
  --output json
```

Before:

```text
changedPercent: 8.557675322381204
changedPixels: 9689
```

After:

```text
changedPercent: 8.502031443207914
changedPixels: 9626
```

The numeric change is small because this fix affects a small text label region, but the visual correctness improvement is clear.

### What didn't work

The overall TopBar diff remains around 8.5%, so selector leakage was not the main source of the total diff. Token drift and spacing/bounds still need tuning.

### What I learned

Visual-diff artifacts are good at showing the symptom, but selector leakage often requires reading the component CSS contract. Broad element selectors inside component CSS are risky when children include shared primitives.

### What was tricky to build

The root cause was subtle because the `Button` root had the correct color, while its internal label inherited the wrong color from parent CSS. The fix was to name the eyebrow explicitly rather than styling every span.

### What warrants a second pair of eyes

- Check other Shell CSS files for broad element selectors that may affect primitive internals.
- Check whether app CSS contains other `.component span`, `.component svg`, or `.component button` rules that cross primitive boundaries.

### What should be done in the future

Next visual-tuning step: align app tokens with canonical prototype/shared-component values, then rerun the TopBar diff.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/shell/AppTopBar/AppTopBar.tsx`
- `web/packages/pyxis-app/src/components/shell/AppTopBar/AppTopBar.css`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Visual check:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page app-topbar-dashboard \
  --outDir /tmp/pyxis-topbar-after-selector \
  --output json
```

## Step 18: Align app ink/muted/faint tokens with prototype tokens

After fixing the TopBar selector leakage, I aligned the app's primary neutral text tokens with the prototype/shared canonical values.

### Prompt Context

**User prompt (verbatim):** "go ahead"

**Assistant interpretation:** Proceed with the next planned visual-tuning step after the scoped TopBar selector fix: token drift alignment.

**Inferred user intent:** Apply the systematic workflow: fix one class of issue, validate with css-visual-diff, then commit separately.

**Commit (code):** pending — this step will be committed after diary update.

### What I did

Updated `web/packages/pyxis-app/src/styles/app-tokens.css`:

```css
--app-ink: #1A1A18;
--app-ink-rgb: 26, 26, 24;
--app-muted: #8A857B;
--app-faint: #B8B2A5;
--app-faint-rgb: 184, 178, 165;
```

These replace the drifted app values:

```css
--app-ink: #1f1e1c;
--app-ink-rgb: 31, 30, 28;
--app-muted: #6f685e;
--app-faint: #9b9488;
--app-faint-rgb: 155, 148, 136;
```

### Why

The prototype uses:

```text
C.ink  = #1A1A18
C.ink3 = #8A857B
C.ink4 = #B8B2A5
```

The shared component package also uses `#1A1A18` for primary text/ink. Aligning app tokens removes one known source of visual drift.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Visual diff was rerun:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page app-topbar-dashboard \
  --outDir /tmp/pyxis-topbar-after-tokens \
  --output json
```

Before selector fix:

```text
changedPercent: 8.557675322381204
changedPixels: 9689
styleChanges: 3
```

After selector fix:

```text
changedPercent: 8.502031443207914
changedPixels: 9626
styleChanges: 3
```

After token alignment:

```text
changedPercent: 8.462285815226991
changedPixels: 9581
styleChanges: 2
```

The important semantic result is that the root `color` mismatch disappeared from `compare.json`; remaining style differences are root `font-size` and `line-height`.

### What didn't work

The total pixel diff only decreased slightly. This means token drift was real, but it was not the dominant source of the TopBar diff. Remaining differences are likely typography/spacing/bounds.

### What I learned

Token alignment is still worthwhile even when the diff percentage does not drop dramatically: it removes one class of mismatch and simplifies the next diagnosis. The css-visual-diff `compare.json` confirmed the root color mismatch was eliminated.

### What was tricky to build

`--app-muted` and `--app-faint` affect many app components, not just TopBar. This is why the change is isolated in its own commit and validated with Storybook build.

### What warrants a second pair of eyes

- Visual scan of pages using `--app-muted` and `--app-faint`, especially dense tables and calendar views.
- Decide whether app tokens should become aliases to shared `--color-*` tokens rather than duplicated hex values.

### What should be done in the future

Next TopBar tuning step: address root font-size/line-height and bounds differences, then inspect button widths/spacing.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/styles/app-tokens.css`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Visual check:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page app-topbar-dashboard \
  --outDir /tmp/pyxis-topbar-after-tokens \
  --output json
```

## Step 19: Tune AppTopBar typography and bounds

After selector scoping and neutral token alignment, the TopBar comparison still reported root style changes for `font-size` and `line-height`. I compared the prototype TopBar implementation in `prototype-design/lib/components.jsx` with the app CSS and tuned the app TopBar typography to match the prototype's root and text rules.

### Prompt Context

**User prompt (verbatim):** "tune"

**Assistant interpretation:** Continue the visual-diff tuning loop on `app-topbar-dashboard`, one focused class of mismatch at a time.

**Inferred user intent:** Reduce the TopBar visual diff further using css-visual-diff artifacts, not broad manual guessing.

**Commit (code):** pending — this step will be committed after diary update.

### What I did

Updated `AppTopBar.css` to match prototype typography more closely:

- Added root `font-size: 13px` and `line-height: 1.5`.
- Changed eyebrow from margin-on-title to explicit `display: block; margin-bottom: 4px`.
- Matched title style to prototype `DisplayH`:
  - `margin: 0`
  - `color: var(--app-ink)`
  - `letter-spacing: -0.02em`
  - `line-height: 1.1`
- Matched subtitle style to prototype `Muted`:
  - `font-size: 12.5px`
  - `color: var(--color-text-secondary, #555048)`

### Why

The previous `compare.json` still reported style mismatches at the TopBar root:

```text
font-size:   left 13px    right 14px
line-height: left 19.5px  right 20.3px
```

The prototype root uses the `.px-root` base typography:

```text
font-size: 13px
line-height: 1.5
```

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Visual diff improved substantially:

```text
Before typography tuning: 8.462285815226991%
After typography tuning:  1.9750445632798572%
```

The `compare.json` style summary improved to:

```text
styleChanges: 0
```

Bounds height now matches exactly:

```text
left height:  110.390625
right height: 110.390625
```

### What didn't work

The diff is still around 1.98%. The remaining visible mismatch is concentrated around the TopBar action buttons, especially the icon-only buttons and the primary button width/position.

### What I learned

The large residual diff was not mostly color anymore; it was base typography inheritance. Matching the prototype's root `13px / 1.5` base brought the comparison much closer and eliminated style changes from the root comparison.

### What was tricky to build

The top-level comparison reports root styles only, so the remaining button mismatch is not visible as a style change in `compare.json`. The `diff_only.png` artifact is the better next diagnostic tool.

### What warrants a second pair of eyes

- Whether using `var(--color-text-secondary, #555048)` inside app CSS is acceptable, or whether `--app-secondary` should be introduced as an app alias.
- Whether the subtitle color change affects other AppTopBar stories as expected.

### What should be done in the future

Next step: tune TopBar action buttons. The prototype uses 30px icon buttons, while the shared `Button` icon-only rendering currently produces wider 47px controls because the empty label span still participates in layout.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/shell/AppTopBar/AppTopBar.css`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Visual check:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page app-topbar-dashboard \
  --outDir /tmp/pyxis-topbar-after-type \
  --output json
```

## Step 20: Tune AppTopBar action buttons

After typography tuning, the TopBar diff was reduced to about 1.98%, and `diff_only.png` showed the remaining mismatch was concentrated around the action buttons.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue the TopBar tuning loop from the remaining `diff_only.png` mismatch.

**Inferred user intent:** Finish the next obvious TopBar mismatch, while keeping scripts traceable in the ticket workspace.

**Commit (code):** pending — this step will be committed after diary update.

### What I did

- Switched the search and notifications controls from icon-only `Button` usage to the existing shared `IconButton` primitive:

```tsx
<IconButton icon="search" label="Search" />
<IconButton icon="bell" label="Notifications" />
```

- Removed `size="sm"` from the primary `New show` action so it matches the prototype's default `Btn` sizing:

```tsx
<Button iconLeft="plus">New show</Button>
```

- Added a traceable diagnostic helper in the ticket scripts folder:

```text
ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/scripts/04-measure-red-button-bounds.py
```

The script measures connected accent-red regions in already-captured css-visual-diff images. It is only a diagnostic helper, not a replacement for css-visual-diff.

### Why

The prototype TopBar uses:

```jsx
<IconBtn icon="search" />
<IconBtn icon="bell" />
<Btn icon="plus">New show</Btn>
```

The app previously used `Button size="sm"` for all three controls. That made the icon-only buttons too wide at first, and then made the primary button too small after switching icon-only controls to `IconButton`.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Visual diff improved into the accepted band:

```text
After typography tuning: 1.9750445632798572%
After action tuning:     0.9135472370766489%
```

The comparison now reports:

```text
classification: accepted
styleChanges: 0
```

The red-region diagnostic confirms the primary button bounds now match:

```text
left_region.png  bbox_width=121 bbox_height=33
right_region.png bbox_width=121 bbox_height=33
```

### What didn't work

There is still about 0.91% changed pixels. The remaining mismatch is small and mostly around antialiasing, icons, and the known 2px width/x bounds delta from comparing the full prototype shell region to the isolated Storybook component region.

### What I learned

The correct fix was to reuse the more specific primitive (`IconButton`) rather than trying to force `Button` into an icon-only shape through local CSS. For the primary action, the prototype used the default button size, so the app should too.

### What was tricky to build

The visual mismatch was made of two separate issues:

1. icon-only controls needed `IconButton`, not `Button` with an empty label;
2. the primary action needed default button sizing, not `sm`.

Fixing only the first made the second more obvious.

### What warrants a second pair of eyes

- Whether all TopBar stories should use default-size primary actions for consistency.
- Whether `IconButton` should be preferred across app toolbars wherever buttons have no visible label.

### What should be done in the future

Run the other Shell component targets (`app-topbar-with-action`, `app-topbar-long-title`, sidebar, mobile nav) to ensure the broader shell suite remains acceptable.

### Code review instructions

Review:

- `web/packages/pyxis-app/src/components/shell/AppTopBar/AppTopBar.tsx`
- `ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/scripts/04-measure-red-button-bounds.py`

Validate:

```bash
cd web/packages/pyxis-app
python3 scripts/check-relative-imports.py
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Visual check:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page app-topbar-dashboard \
  --outDir /tmp/pyxis-topbar-after-primary-md \
  --output json
```

## Step 24: Plan user-site Shows component-level visual tuning

The Shows desktop page had become difficult to tune through the broad `shows-list` page section alone. The full section comparison mixes poster artwork, tile metadata formatting, grid gaps, page padding, and story fixture data. We therefore shifted the workflow to smaller component targets before continuing visual tuning.

### Prompt Context

**User prompt (verbatim):** "Add detailed tasks for all the subcomponents to test. We don't need that many poster stories since they're mostly just different images. Once all the tasks are added, go through them, tune to a reasonable threshold, write diary (in the diary assess if it would make sense to introduce custom css-visual-diff functionality to be more targeted), then continue"

**Assistant interpretation:** Extend the ticket task list with a concrete Shows component-tuning sequence, avoid excessive per-poster story proliferation, then work through the tasks with diary updates and commits at appropriate boundaries.

**Inferred user intent:** Make the visual-tuning work repeatable and reviewable. Use component-level comparisons for better signal, but avoid over-engineering the React component tree or Storybook catalog.

**Commit (code):** pending — this step should be committed with css-visual-diff operator docs/tooling, before deeper component/story tuning.

### What I did

- Added Phase 5 tasks T12-T22 to `tasks.md`.
- The new task plan focuses on existing component boundaries:
  - `PublicPageHeader`
  - `MailingListCTA`
  - representative `Poster` targets
  - representative `ShowTile` states
  - `ShowGrid/PrototypeDesktop`
  - full public Shows `shows-list` as a final integration check.
- Explicitly avoided tasks for `ShowTileInfo`, `ShowTileMeta`, `ShowTileTicketPill`, or one public component per poster variant.
- Required diary entries for each tuning task, including an assessment of whether custom css-visual-diff functionality would make the workflow more targeted.

### Why

The latest focused full-section comparison was still around 20.50% changed pixels, while quick isolated probes against component-system Storybook showed smaller review-band targets around 6.5-9%. That means component-level visual targets are better tuning instruments than the whole `shows-list` section.

### What worked

The existing component system already has useful boundaries and Storybook stories. The likely missing pieces are better fixture stories and a component-level visual spec, not more React subcomponents.

### What didn't work

The broad `shows-list` command was too noisy as a primary tuning loop. It should remain an integration check after smaller components are reasonable.

### What I learned

Granularity for diagnosis is not the same as granularity for React components. Stable stories, spec sections, and `data-pyxis-part` selectors can provide smaller visual targets without splitting every DOM subpart into its own component.

### What was tricky to build

The main tension is poster coverage. One story per poster image would produce many targets, but most poster variants are image/artwork differences rather than different component states. The task plan therefore keeps `AllVariants` plus one or two representative focused poster targets, while putting more emphasis on semantic `ShowTile` states.

### What warrants a second pair of eyes

- Whether `poster-all-variants` can be compared with a stable crop or whether only focused representative poster crops should be used.
- Whether `ShowGrid/PrototypeDesktop` should live in existing `ShowGrid.stories.tsx` or a separate fixture story if the data becomes lengthy.
- Whether the component-level spec should use selectors from the current full prototype page or a new prototype catalog HTML page.

### What should be done in the future

- Commit the operator guide and alias verb separately from component visual tuning.
- Add `public.components.visual.yml` and a compact component comparison alias.
- Add representative stories and tune component targets before re-running the full Shows `shows-list` integration comparison.

### Custom css-visual-diff functionality assessment

At this planning stage, a small alias verb is already useful and probably enough for the next iteration. A larger custom feature may be warranted if we repeatedly need to compare nested subparts inside a single Storybook story, such as all poster variants in `Poster/AllVariants`, and summarize each child crop independently. For now, YAML spec targets plus compact alias verbs are the safer path because they keep the source of truth explicit and reviewable.

## Step 25: Commit css-visual-diff operator guide and Shows alias verb

This step closes the workflow/tooling part of the user-site Shows tuning work before changing more component stories or CSS. The goal is to make the shorter command available and documented so future tuning steps use the same focused loop.

### Prompt Context

**User prompt (verbatim):** "commit at appropriate intervals"

**Assistant interpretation:** Commit the completed operator docs, alias verb, task plan, and diary update separately from upcoming component visual tuning changes.

**Inferred user intent:** Keep workflow/tooling changes reviewable and do not mix them with poster/tile CSS tuning.

**Commit (code):** pending at diary write time.

### What I did

- Validated the userland verb file syntax:

```bash
node -c prototype-design/visual-diff/userland/verbs/pyxis-pages.js
```

- Smoke-tested the new alias verb:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-user-shows-section shows-list \
  --outDir /tmp/pyxis-user-shows-alias-commit-smoke \
  --output json
```

- The smoke output was compact and reported:

```text
shows shows-list tune-required 20.50184283269712
/tmp/pyxis-user-shows-alias-commit-smoke/shows/artifacts/shows-list/diff_only.png
```

- Marked T12 and T13 complete in `tasks.md`.

### Why

The alias and guide reduce operator error and terminal noise. They are useful regardless of the eventual visual CSS changes, so they deserve their own commit boundary.

### What worked

The alias produced exactly one compact row for `shows-list`, with the useful artifact paths exposed directly.

### What didn't work

No implementation failure in this step. The visual state itself is still `tune-required`; this commit is not meant to solve the visual mismatch.

### What I learned

A tiny alias verb is enough to make the common workflow safer. It keeps the visual spec explicit in code while sparing operators from repeatedly passing the same spec/page/summary flags.

### What was tricky to build

The tricky part was choosing the commit boundary. Existing visual tuning edits are still uncommitted, but the docs/alias/task update can be staged separately and reviewed independently.

### What warrants a second pair of eyes

- Whether the alias name `compare-user-shows-section` is the right long-term naming convention.
- Whether the compact row includes too many or too few fields for operators.

### What should be done in the future

Add a sibling component-target alias if `public.components.visual.yml` proves useful during the next tasks.

## Step 26: Add public component visual spec, alias, and representative Shows stories

This step adds the component-level tuning harness for public Shows work. It intentionally keeps the React component granularity unchanged and adds better visual targets instead.

### Prompt Context

**User prompt (verbatim):** "Add detailed tasks for all the subcomponents to test. We don't need that many poster stories since they're mostly just different images. Once all the tasks are added, go through them, tune to a reasonable threshold, write diary (in the diary assess if it would make sense to introduce custom css-visual-diff functionality to be more targeted), then continue"

**Assistant interpretation:** After adding tasks, create the component-level visual spec and representative stories needed to work through the tasks.

**Inferred user intent:** Get better pixel-diff numbers by comparing existing molecules/organisms directly, not by splitting the React tree into tiny pieces.

**Commit (code):** pending — this should be a setup commit before deeper CSS tuning.

### What I did

- Added `prototype-design/visual-diff/userland/specs/public.components.visual.yml`.
- Regenerated `prototype-design/visual-diff/userland/specs/public.components.visual.js`.
- Added `compare-public-component` to `prototype-design/visual-diff/userland/verbs/pyxis-pages.js`.
- Updated the operator guide and userland README to mention the new alias.
- Reworked `ShowTile.stories.tsx` around representative semantic states:
  - `Default` / Redroom tickets
  - `Learn` / Monday Meet-Ups
  - `SoldOut` / Moor Mother
  - `PlaceholderFlyerFallback`
  - existing compact/theme coverage
- Added `ShowGrid/PrototypeDesktop` with the exact nine-show prototype-style data/order.
- Adjusted `ShowTile` metadata formatting so empty genres are omitted instead of rendering an extra separator.

### Why

The broad `shows-list` section remained useful as an integration check, but it was too coarse for tuning. Component targets now isolate:

- page header
- mailing-list CTA
- representative poster
- representative tile states
- prototype desktop grid

This gives better visual evidence without creating many poster stories.

### Validation and visual smoke

Syntax validation passed:

```bash
node -c prototype-design/visual-diff/userland/verbs/pyxis-pages.js
```

TypeScript validation passed:

```bash
cd web/packages/pyxis-components
pnpm exec tsc --noEmit
```

The component alias smoke passed:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-public-component show-tile-redroom \
  --outDir /tmp/pyxis-public-component-redroom-smoke \
  --output json
```

Result:

```text
show-tile-redroom component review 7.75599128540305%
```

The component suite baseline was:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec prototype-design/visual-diff/userland/specs/public.components.visual.yml \
  --outDir /tmp/pyxis-public-components-baseline \
  --summary --output json
```

Key results:

```text
public-page-header-shows      review          7.099655617735687%
mailing-list-cta              review          6.557517866959868%
poster-redroom                review          7.432610124917817%
show-tile-redroom             review          7.75599128540305%
show-tile-learn               major-mismatch 27.363834422657952%
show-tile-soldout             review          6.5116473940003345%
show-grid-prototype-desktop   review          9.552467262747637%
```

### What worked

- The new `show-grid-prototype-desktop` component target is already much more useful than the full page `shows-list`: it isolates the grid and lands at 9.55% instead of 20.50%.
- Redroom, sold-out, header, CTA, and poster representative targets are all already in review band.
- The learn/Meet-Ups tile correctly exposes the main outlier: the React generic `Poster` approximation for Meet-Ups does not include the prototype's dense flyer artwork.

### What didn't work

- `show-tile-learn` is still a major mismatch at 27.36%. This appears to be genuine poster artwork mismatch, not a grid or tile spacing bug.
- The component spec currently uses selectors inside `/standalone/public/shows.html` for the prototype side. This is acceptable for now, but a dedicated prototype catalog HTML page would be cleaner.

### What I learned

The existing component granularity is good. The better tuning unit is not a new `ShowTileMeta` component; it is a component-level visual target with representative fixture data.

### What was tricky to build

Storybook story IDs are generated from story export names. The spec now depends on representative story names such as `show-tile-learn` and `show-grid-prototype-desktop`, so story renames must update the visual spec in the same commit.

### What warrants a second pair of eyes

- Whether `show-tile-learn` should be tuned by making the generic `Poster` component more prototype-like, or whether that level of artwork mismatch is acceptable.
- Whether to add a prototype catalog page so component targets do not depend on nth-child selectors inside the full Shows page.

### Custom css-visual-diff functionality assessment

The new `compare-public-component` alias is helpful and probably enough for the immediate workflow. A custom css-visual-diff feature could still be useful later: a "multi-crop story matrix" mode that compares each child inside an `AllVariants` story and returns per-child rows. That would be especially useful for poster variants without adding one story and one spec target per image. For now, explicit representative targets are simpler and easier to review.

## Step 27: Tune public Shows component targets to review-band thresholds

This step works through the new component-level targets and tunes to a reasonable threshold. The goal is not full poster pixel perfection; it is to get smaller component targets into the review band and make the remaining full-page `shows-list` delta easier to explain.

### Prompt Context

**User prompt (verbatim):** "Add detailed tasks for all the subcomponents to test. We don't need that many poster stories since they're mostly just different images. Once all the tasks are added, go through them, tune to a reasonable threshold, write diary (in the diary assess if it would make sense to introduce custom css-visual-diff functionality to be more targeted), then continue"

**Assistant interpretation:** Continue after setup by tuning representative component targets and recording thresholds, rather than chasing every poster image individually.

**Inferred user intent:** Establish a practical visual-quality floor for public Shows components and keep the workflow evidence-based.

**Commit (code):** pending at diary write time.

### What I did

- Tuned Storybook wrappers for component crops:
  - `PublicPageHeader/Default` now renders at 856px to match the prototype content width.
  - `MailingListCTA/Default` and `Submitting` now render at 856px.
- Tuned `Poster`/`ShowTile` representative behavior:
  - added the missing Redroom subtitle text to `Poster`;
  - added a bespoke internal Meet-Ups poster rendering path under the existing public `Poster` API;
  - fixed a CSS collision where the Meet-Ups custom art initially reused `data-pyxis-part='art'` and accidentally inherited generic poster-art layout styles;
  - preserved the public `<Poster kind='meetups' />` API instead of introducing a public per-poster component.
- Re-ran component-level visual targets and the full public Shows `shows-list` integration check.
- Marked T16-T21 complete in `tasks.md`.

### Validation

Package validation passed:

```bash
cd web/packages/pyxis-components
pnpm exec tsc --noEmit

cd ../pyxis-user-site
pnpm exec tsc --noEmit
pnpm exec vite build
```

### Visual results

Component suite command:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec prototype-design/visual-diff/userland/specs/public.components.visual.yml \
  --outDir /tmp/pyxis-public-components-after-tune \
  --summary --output json
```

Final component target results:

```text
show-tile-learn              review 8.602312719959778%
show-tile-redroom            review 8.09368191721133%
poster-redroom               review 7.874205566513259%
public-page-header-shows     review 7.556444896826131%
show-grid-prototype-desktop  review 7.3215465738830225%
show-tile-soldout            review 6.5116473940003345%
mailing-list-cta             review 5.492372182517867%
```

Full Shows section integration command:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-user-shows-section shows-list \
  --outDir /tmp/pyxis-user-shows-list-after-date-tune \
  --output json
```

Result:

```text
shows shows-list tune-required 19.823532315387656%
```

This is only a small improvement over the previous 20.50% page-section number, but the component-level targets are now all review-band and much more explainable.

### What worked

- The `show-tile-learn` target dropped from a major mismatch around 27-28% to review-band 8.60% after the Meet-Ups poster art was made closer to the prototype.
- The main `show-grid-prototype-desktop` component target is review-band at 7.32%, which is now a better day-to-day integration target than the full page `shows-list` section.
- No new public subcomponents were needed.

### What didn't work

- The full public-site Shows `shows-list` target is still `tune-required` at 19.82%.
- A temporary attempt to force `ShowTile` root `line-height: normal` made both grid and page comparisons substantially worse, so it was reverted.
- Adding the Redroom subtitle improved text parity but slightly increased the redroom poster/tile pixel percentages, likely due to antialiasing and small vertical distribution changes. It was kept because the content now matches the prototype better and still remains review-band.

### What I learned

The component-level visual suite is the right tuning instrument. The page-level `shows-list` result remains valuable, but it is now more of an integration smoke that combines page/story environment, poster artwork approximation, and crop-height sensitivity.

### What was tricky to build

The biggest gotcha was CSS part reuse. The custom Meet-Ups poster first used `pyxisPart('poster', 'art')`, which caused generic poster art CSS to apply to the custom layout. Changing the custom part to `meetups-art` fixed the layout and dropped the Learn tile to review-band.

### What warrants a second pair of eyes

- Whether the full `shows-list` target should be expected to reach review-band, or whether the new `show-grid-prototype-desktop` target should become the accepted integration target for component layout while the page section remains a broader smoke.
- Whether Redroom subtitle parity is worth the small pixel-percent increase.
- Whether additional bespoke poster internals should be added for `808`, `Petals`, `Basement`, `Orphx`, `Cygnus`, and `Zola`, or whether that crosses into recreating poster artwork rather than testing the UI component.

### Custom css-visual-diff functionality assessment

A custom feature would be useful, but not mandatory yet. The most valuable addition would be a first-class "component matrix" or "multi-crop within one story" mode: given a story such as `Poster/AllVariants`, css-visual-diff could compare each child with `data-poster-kind` independently and return one compact row per child. That would avoid creating many story/spec targets while still revealing which artwork variant dominates a grid diff.

For now, explicit representative targets plus `compare-public-component` are sufficient. If the team decides to tune all poster variants to near-pixel parity, then adding that multi-crop functionality would be more justified than manually expanding the spec with many poster-image targets.

### What should be done in the future

- Decide whether to pursue more bespoke poster internals or accept the current review-band component suite.
- Investigate why `show-grid-prototype-desktop` is review-band while the full page `shows-list` remains near 20%; likely causes include page/story environment, crop-height sensitivity, and remaining poster artwork deltas.
- If continuing, use `show-grid-prototype-desktop` as the primary integration loop and `shows-list` as the final page smoke.

## Step 28: Apply review feedback for Shows whitespace and poster art

The review feedback for the full `shows / shows-list` target called out two issues: the React side had too much whitespace in the text area under posters, and the poster artwork needed to match the prototype more closely or the page would never converge.

### Prompt Context

**User feedback (verbatim):**

```text
## shows / shows-list
page · section shows-list · tune-required · 19.824%

Needs tuning: twoo much witespace for the react version in the text under the poster (probably some css leaking through?). 

Use same background images, otherwise they will never match.
```

**Assistant interpretation:** First fix the tile text block whitespace with an explicit line-height, then replace simplified poster artwork with prototype-matching CSS/SVG internals while preserving the public `Poster` API.

### What I did

- Added an explicit `line-height: 1.25` to the `ShowTile` root. This reduced the full page `shows-list` section height delta from about +34.5px to +3.75px.
- Added prototype-like internal artwork renderers for poster variants:
  - `pixel808`
  - `petals`
  - `basement`
  - `orphx`
  - `moor`
  - `cygnus`
  - `zola`
- Kept the public API unchanged: consumers still use `<Poster kind="..." />`.
- Generated a new HTML review bundle with the improved form styling and per-card clipboard buttons:

```text
/tmp/pyxis-shows-visual-review-feedback-tune-20260427-142812/index.html
```

### Validation

TypeScript validation passed after the poster changes:

```bash
cd web/packages/pyxis-components
pnpm exec tsc --noEmit
```

### Visual results

Component suite after the feedback pass:

```text
components {'review': 7} max 8.618844578212524%
show-tile-learn              review 8.619%
poster-redroom               review 7.874%
show-tile-redroom            review 7.787%
public-page-header-shows     review 7.556%
show-grid-prototype-desktop  review 6.510%
mailing-list-cta             review 5.492%
show-tile-soldout            review 4.078%
```

Full page `shows-list` after feedback pass:

```text
shows / shows-list tune-required 11.166088021369506%
bounds delta: height +3.75px, width 0px, x 0px, y +2.5px
```

Previous full page result was about 19.824%, so this pass removed a large portion of the whitespace/artwork mismatch. It is still just above the review-band threshold of 10%.

### What worked

- The explicit `ShowTile` line-height addressed the review comment about excessive text-block whitespace.
- Matching the prototype poster internals brought the full section from about 19.82% to about 11.17%.
- The isolated grid target improved to 6.51% review-band.

### What didn't work

- The full page section is still `tune-required`, narrowly above the 10% review threshold.
- The new poster internals are much closer, but not a perfect image copy. Remaining differences are mostly typography, small SVG/detail differences, and antialiasing.

### What I learned

The earlier component-level conclusion was correct: most of the apparent page mismatch was not grid structure but poster-art fidelity plus inherited typography/line-height in the tile text block.

### What should be done next

- Inspect the new review bundle and decide whether 11.17% is acceptable for the full page after the component targets are review-band.
- If the goal is to push below 10%, focus on the highest-impact poster artwork differences visible in the full page review, not the grid layout.

## Step 29: Add focused ShowTile info visual targets

The review follow-up noted that the under-poster text block should be iterated independently because line spacing appeared off in the review artifact, even though the live Storybook/user-site pages looked less problematic.

### What I did

- Added `info` sections to the component visual spec for representative tile states:
  - `show-tile-redroom --section info`
  - `show-tile-learn --section info`
  - `show-tile-soldout --section info`
- Regenerated `public.components.visual.js` from the YAML spec.
- Kept this as visual-spec granularity rather than extracting another React component. React already exposes the info block through `data-pyxis-part='info'`.

### Commands and results

```bash
python3 prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py \
  prototype-design/visual-diff/userland/specs/public.components.visual.yml

css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-public-component show-tile-redroom \
  --section info --outDir /tmp/pyxis-public-info-redroom --output json

css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-public-component show-tile-learn \
  --section info --outDir /tmp/pyxis-public-info-learn --output json

css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-public-component show-tile-soldout \
  --section info --outDir /tmp/pyxis-public-info-soldout --output json
```

Results:

```text
show-tile-redroom info  review 4.554334554334554%
show-tile-learn   info  review 5.396825396825397%
show-tile-soldout info  review 3.6752136752136755%
```

The bounds deltas are small:

```text
height +1.25px
width +0.671875px
```

### Assessment

The text block is already in a reasonable review-band state when isolated. The stronger perceived line-height mismatch in the HTML review page is likely partly due to comparing/scaling larger screenshots rather than a component-level spacing bug. The focused `info` crops should be the next source of truth for under-poster text tuning.

### Custom css-visual-diff assessment

This is a good example where adding spec sub-sections was enough. We did not need new React subcomponents or new css-visual-diff machinery. A future helper could make it easier to generate subpart targets automatically from `data-pyxis-part`, but explicit sections are clear and reviewable for now.
