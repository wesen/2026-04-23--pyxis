---
Title: Shell and Organism Split Recovery Report
Ticket: PYXIS-APP-VISUAL-TUNING
Status: complete
Topics:
  - frontend
  - react
  - typescript
  - refactor
  - recovery
DocType: report
Intent: handoff
Summary: Explains the pyxis-app component split, the failed import-rewrite attempts, the recovery strategy, and the verified final state.
LastUpdated: 2026-04-27T10:45:00-04:00
WhatFor: Read this to understand what happened during the shell/organism component split and how the import situation was recovered.
WhenToUse: Before continuing pyxis-app visual tuning, shell cleanup, or page-organism reorganization.
---

# Shell and Organism Split Recovery Report

## 1. What this work was about

We were continuing the pyxis-app component reorganization that started during the visual tuning work.

The goal was not to change behavior. The goal was to make the component tree easier to reason about before doing visual tuning and token-level fixes. In particular:

1. **Shell components** should no longer live in one flat `AppShell.tsx` file.
2. **Organisms** should live in page-context folders such as `Dashboard/`, `Shows/`, `Bookings/`, etc.
3. Every component folder should have a small `index.ts` barrel.
4. Page files should import the shell through the shell barrel, not from a flat `AppShell.tsx` file.
5. TypeScript must pass before visual tuning continues.

This is preparation for the next major visual task: replacing or aligning `AppTopBar` with the canonical `TopBar` organism from `pyxis-components`, then fixing the app token drift.

---

## 2. Final component shape

### 2.1 Shell components

The shell now has one folder per component:

```text
web/packages/pyxis-app/src/components/shell/
├── AppMobileBottomNav/
│   ├── AppMobileBottomNav.stories.tsx
│   ├── AppMobileBottomNav.tsx
│   └── index.ts
├── AppShell/
│   ├── AppShell.css
│   ├── AppShell.stories.tsx
│   ├── AppShell.tsx
│   └── index.ts
├── AppSidebar/
│   ├── AppSidebar.stories.tsx
│   ├── AppSidebar.tsx
│   └── index.ts
├── AppTopBar/
│   ├── AppTopBar.stories.tsx
│   ├── AppTopBar.tsx
│   └── index.ts
└── index.ts
```

`AppShell.tsx` now imports `AppSidebar`, `AppTopBar`, and `AppMobileBottomNav` from sibling folders.

All page files that previously imported:

```ts
import { AppShell } from '../../components/shell/AppShell';
```

now import:

```ts
import { AppShell } from '../../components/shell';
```

This keeps page-level imports stable if the internal shell folder layout changes again.

### 2.2 Organism folders

The organism reorganization had already been committed before this recovery step. The structure is:

```text
web/packages/pyxis-app/src/components/organisms/
├── Bookings/
├── Calendar/
├── Dashboard/
├── Roster/
├── Settings/
├── ShowDetail/
├── Shows/
├── Panel/
├── Panels.tsx
├── Phase8Sections.tsx
├── DashboardSections.tsx
└── ShowsSections.tsx
```

The recovery work in this report fixed the relative imports inside those moved organism files.

---

## 3. What went wrong

The first attempted fixes treated relative imports as if they could be repaired by a single string rule such as:

```text
from '../...' -> from '../../...'
```

That was the wrong model.

Relative imports are not just strings. They are paths from a specific file to a specific target. When we moved organisms from a flat layout:

```text
organisms/BookingQueue/BookingQueue.tsx
```

to a grouped layout:

```text
organisms/Bookings/BookingQueue/BookingQueue.tsx
```

some imports needed one extra `../`, but others did not.

### 3.1 Examples

From:

```text
organisms/Dashboard/DashboardOverview/DashboardOverview.tsx
```

this import is already correct because it points to a sibling component in the same page group:

```ts
import { DashboardHero } from '../DashboardHero';
```

Changing it would be wrong.

But this import is not correct because `Panel` lives at the root of `organisms/`, not inside `organisms/Dashboard/`:

```ts
import { Panel } from '../Panel';
```

It must become:

```ts
import { Panel } from '../../Panel';
```

Similarly, imports to shared component-layer folders had to move up one level:

```ts
// before, now wrong after the move
import { AppEmptyState } from '../../molecules/AppEmptyState';

// after
import { AppEmptyState } from '../../../molecules/AppEmptyState';
```

And Storybook seed-data imports had to move up one level:

```ts
// before, now wrong after the move
import { shows } from '../../../api/mockData';

// after
import { shows } from '../../../../api/mockData';
```

### 3.2 The specific failure mode

The earlier approach applied broad regex substitutions to many files at once. That caused two classes of problems:

1. **Over-correction** — imports that were already correct, such as `../DashboardHero`, were deepened incorrectly.
2. **String corruption** — regex replacements accidentally produced broken strings such as:

```ts
import { ShowTableRow } from '../../../molecules'/ShowTableRow';
import { appPart } from '../../../parts'';
import { shows } from '../../../api/'mockData';
```

That is why TypeScript briefly showed syntax errors, not only module-resolution errors.

The mistake was running a broad rewrite before proving the rule on a small sample.

---

## 4. Recovery strategy

The recovery was deliberately conservative.

### 4.1 Restore organisms to the last committed state

First, all accidental organism import edits were discarded:

```bash
git restore web/packages/pyxis-app/src/components/organisms
```

This preserved the shell split work, but returned organism imports to the known committed state from `1cb0e7d`.

### 4.2 Replace regex-depth thinking with filesystem resolution

The correct script is stored here:

```text
ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/scripts/02-fix-organism-import-paths.py
```

The script does not assume all imports need the same transformation. Instead, for each relative import in moved organism files, it asks:

1. Does the current import resolve on disk?
2. If not, does the same import with one extra `../` resolve?
3. If yes, rewrite only that import.
4. If neither resolves, leave it alone for manual review.

This is the key improvement. The filesystem, not a guessed depth table, decides whether a rewrite is safe.

### 4.3 Test first

The script supports a dry-run and a file limit:

```bash
python3 ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/scripts/02-fix-organism-import-paths.py --dry-run --limit 8
```

That dry-run showed safe sample rewrites such as:

```text
../../../api/mockData -> ../../../../api/mockData
../../molecules/BookingCard -> ../../../molecules/BookingCard
../../parts -> ../../../parts
../Panels -> ../../Panels
```

Then the full dry-run showed:

```text
files inspected: 66
files changed: 52
imports changed: 82
```

Only after that was the script applied:

```bash
python3 ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/scripts/02-fix-organism-import-paths.py --apply
```

A second dry-run then confirmed idempotence:

```text
files inspected: 66
files changed: 0
imports changed: 0
```

---

## 5. Manual fixes after the script

After the import script, TypeScript was down to four errors.

### 5.1 Cross-page organism import

`DashboardUpcomingPanel` imports `ShowsTable`. Because `ShowsTable` moved to the `Shows/` group, this needed a manual cross-group import:

```ts
// before
import { ShowsTable } from '../ShowsTable';

// after
import { ShowsTable } from '../../Shows/ShowsTable';
```

File:

```text
web/packages/pyxis-app/src/components/organisms/Dashboard/DashboardUpcomingPanel/DashboardUpcomingPanel.tsx
```

### 5.2 AppTopBar Storybook typing

After the shell split, `AppTopBar.stories.tsx` imported the local component correctly, but Storybook typing required a default `title` arg because `AppTopBarProps.title` is required.

The fix was to add default args to the story meta:

```ts
args: {
  title: 'Welcome back, Ada',
},
```

File:

```text
web/packages/pyxis-app/src/components/shell/AppTopBar/AppTopBar.stories.tsx
```

---

## 6. Validation

The final validation command passed:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app
pnpm exec tsc --noEmit
```

Result:

```text
(no output)
```

That means pyxis-app TypeScript compilation succeeds after:

- the shell folder split,
- page import updates,
- organism import recovery,
- the manual cross-group import fix,
- and the AppTopBar Storybook typing fix.

---

## 7. What to do differently next time

1. **Never run a broad import-rewrite script before a dry-run.**
2. **Store scripts in the ticket `scripts/` folder immediately.**
3. **Use filesystem resolution, not guessed regex depth rules.**
4. **Run on 5-10 files first.**
5. **Run `tsc --noEmit` after every structural refactor.**
6. **Keep component-move commits separate from behavior/style changes.**

The correct pattern for future component reorganization scripts is:

```text
restore known state -> dry-run script on small sample -> inspect output -> full dry-run -> apply -> dry-run again -> tsc
```

---

## 8. Current status

Recovered and verified.

### Done

- Shell components split into folders.
- Page files import `AppShell` from the shell barrel.
- Organism import paths fixed with a safe filesystem-based script.
- TypeScript passes.
- Recovery script stored in the ticket `scripts/` folder.

### Not done yet

The visual tuning work itself is still next:

1. Replace or align `AppTopBar` with the canonical `TopBar` from `pyxis-components`.
2. Fix token drift in `app-tokens.css`:
   - `--app-ink: #1f1e1c` -> `#1A1A18`
   - `--app-muted: #6f685e` -> `#8A857B`
   - `--app-faint: #9b9488` -> `#B8B2A5`
3. Re-run css-visual-diff on `app-topbar-dashboard`.
4. Commit this recovery work separately before continuing visual tuning.
