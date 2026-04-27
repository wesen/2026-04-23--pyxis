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
