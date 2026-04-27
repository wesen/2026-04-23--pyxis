---
Title: Pyxis App Component Organization Implementation Guide
Ticket: PYXIS-APP-VISUAL-TUNING
Status: draft
Topics:
  - frontend
  - react
  - component-organization
  - css
  - storybook
  - visual-tuning
DocType: guide
Intent: implementation
Summary: Detailed implementation and analysis guide for safely organizing pyxis-app components so each exported component has its own directory, CSS, story, and public barrel, while avoiding the import/CSS regressions from the previous refactor attempt.
LastUpdated: 2026-04-27T11:30:00-04:00
WhatFor: Use before restarting component reorganization in pyxis-app.
WhenToUse: Read before moving shell, molecule, or organism files; use as the checklist for each small refactor commit.
---

# Pyxis App Component Organization Implementation Guide

## 1. Purpose

This guide defines a single component-organization model for `pyxis-app` before we restart the TSX/CSS/Storybook refactor work.

The previous attempt mixed too many concerns in one pass:

1. shell component splitting,
2. organism page grouping,
3. import path rewriting,
4. CSS ownership changes,
5. Storybook story movement,
6. recovery scripts.

That produced avoidable failures: missing CSS in standalone stories, bad Vite CSS import resolution, and fragile relative imports.

The goal now is to do the same organization work, but with a stable contract and a safer migration sequence.

The desired end state is:

```text
component folder = source + css + story + index
layer barrel = public API
legacy barrels = temporary migration shims
component owns its own CSS
Storybook hierarchy mirrors filesystem hierarchy
```

---

## 2. Current baseline

After the rollback commit, the repo content matches the pre-refactor baseline:

```text
c843375 pyxis-app visual tuning: initial playbook, userland docs, Shell story split
```

This means:

- Shell stories are split into separate story files.
- `AppShell.tsx` still contains several exported shell components.
- Organisms are still flat under `components/organisms/`.
- Most atoms, molecules, and organisms already have per-component folders.
- Several legacy barrel files still exist:
  - `Panels.tsx`
  - `DashboardSections.tsx`
  - `ShowsSections.tsx`
  - `Phase8Sections.tsx`

This is a good restart point because Storybook should be closer to the known visual baseline.

---

## 3. Component organization contract

### 3.1 One exported React component equals one directory

Every exported React component should have its own directory:

```text
ComponentName/
├── ComponentName.tsx
├── ComponentName.css
├── ComponentName.stories.tsx
└── index.ts
```

Optional files may live beside the component:

```text
ComponentName/
├── ComponentName.tsx
├── ComponentName.css
├── ComponentName.stories.tsx
├── ComponentName.types.ts
├── ComponentName.fixtures.ts
├── ComponentName.utils.ts
└── index.ts
```

The public component entry remains the directory `index.ts`:

```ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

### 3.2 Utilities are not components

Do not create component folders for pure helpers.

For example, these are helpers, not standalone components:

```ts
formatShortDate
statusToTone
statusToLabel
```

They can stay colocated with their component, or move to a small utility file:

```text
DateChip/dateChipFormat.ts
StatusDot/statusDotUtils.ts
```

But they do not need CSS or Storybook stories.

---

## 4. CSS ownership contract

### 4.1 Component CSS is owned by the component

Every standalone component must import its own CSS:

```ts
import './ComponentName.css';
```

A component must not rely on a parent, page, shell wrapper, or story file to load its CSS.

This rule exists because the previous shell split moved `AppTopBar` out of `AppShell.tsx`. Before the move, `AppTopBar` stories got styles indirectly because `AppShell.tsx` imported `AppShell.css`. After the move, standalone `AppTopBar` stories became unstyled because `AppTopBar.tsx` did not import CSS itself.

### 4.2 Avoid importing another component's private CSS

Avoid this:

```ts
import '../DashboardMetricsGrid/DashboardMetricsGrid.css';
```

That means the current component is depending on another component's private CSS. This is brittle because the path changes if either component moves.

If multiple components need a layout style, extract a named shared style file.

Examples of likely shared layout classes:

```css
.app-card-list
.app-detail-grid
.app-stack
.app-mobile-only
.app-desktop-only
.app-table
.app-metrics-grid
```

Potential homes:

```text
web/packages/pyxis-app/src/components/shared/layout.css
web/packages/pyxis-app/src/styles/app-layout.css
web/packages/pyxis-app/src/components/molecules/Table/Table.css
```

The key is that shared CSS should be explicit. It should not hide inside a component-specific stylesheet.

### 4.3 Stories do not own CSS

Story files should not repair missing styles by importing parent CSS.

Bad pattern:

```ts
// AppTopBar.stories.tsx
import '../AppShell/AppShell.css';
```

Good pattern:

```ts
// AppTopBar.tsx
import './AppTopBar.css';
```

Stories can wrap components for layout, but the component should still look correct because it imports its own CSS.

---

## 5. Barrel export contract

Barrels are useful, but only if they have a clear purpose.

### 5.1 Component-local barrels are required

Every component folder should have an `index.ts`:

```ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

Consumers should prefer:

```ts
import { ComponentName } from '../../components/organisms/ComponentName';
```

over:

```ts
import { ComponentName } from '../../components/organisms/ComponentName/ComponentName';
```

The deep import is considered internal.

### 5.2 Layer barrels are allowed

Each component layer may have a public barrel:

```text
components/atoms/index.ts
components/molecules/index.ts
components/organisms/index.ts
components/shell/index.ts
```

A layer barrel should export public components and public types only.

Example:

```ts
export { AppShell } from './AppShell';
export type { AppShellProps } from './AppShell';

export { AppTopBar } from './AppTopBar';
export type { AppTopBarProps } from './AppTopBar';
```

Pages can then import from a stable public API:

```ts
import { AppShell } from '../../components/shell';
import { DashboardOverview } from '../../components/organisms';
```

### 5.3 Do not export private internals from layer barrels

Avoid exporting helper constants, private data, or internal-only types from the public layer barrel.

Avoid:

```ts
export { navSections } from './AppSidebar';
export type { AppNavItem } from './AppSidebar';
```

Prefer colocated internal files:

```text
AppSidebar/AppSidebar.data.ts
AppSidebar/AppSidebar.types.ts
```

and only export what external consumers actually need.

---

## 6. Legacy barrel files

The current import structure contains several legacy barrels. They should be treated as migration shims, not the long-term organization model.

### 6.1 `Panels.tsx`

Current file:

```text
components/organisms/Panels.tsx
```

It exports unrelated organisms:

```ts
export * from './DashboardOverview';
export * from './ShowsTable';
export * from './BookingQueue';
export * from './AttendancePanel';
```

Problem:

- It hides ownership.
- It makes it hard to see whether a page depends on Dashboard, Shows, Bookings, Roster, or shared components.
- It can create broad dependency surfaces inside organisms.

Preferred replacement:

```text
components/organisms/index.ts
```

Then migrate from:

```ts
import { DashboardOverview } from '../../components/organisms/Panels';
```

to:

```ts
import { DashboardOverview } from '../../components/organisms';
```

or direct component imports:

```ts
import { DashboardOverview } from '../../components/organisms/DashboardOverview';
```

### 6.2 `DashboardSections.tsx`

Current file:

```text
components/organisms/DashboardSections.tsx
```

This is a dashboard-specific barrel. Long term, either use direct imports or, after page grouping, replace it with:

```text
components/organisms/Dashboard/index.ts
```

### 6.3 `ShowsSections.tsx`

Same as `DashboardSections.tsx`, but for Shows.

Long-term replacement after page grouping:

```text
components/organisms/Shows/index.ts
```

### 6.4 `Phase8Sections.tsx`

Current file:

```text
components/organisms/Phase8Sections.tsx
```

This is the most legacy-looking barrel because the name encodes an implementation phase rather than an app domain.

It mixes:

- ShowDetail components,
- Calendar components,
- Bookings components,
- BookingReview components.

This should be retired first or second after the layer barrel exists.

Preferred replacement before page grouping:

```ts
import { CalendarBoard } from '../../components/organisms';
import { BookingsInboxPanel } from '../../components/organisms';
import { ShowDetailHero } from '../../components/organisms';
```

Preferred replacement after page grouping:

```ts
import { CalendarBoard } from '../../components/organisms/Calendar';
import { BookingsInboxPanel } from '../../components/organisms/Bookings';
import { ShowDetailHero } from '../../components/organisms/ShowDetail';
```

---

## 7. Import path policy

### 7.1 Pages

Pages should use public layer or domain barrels.

Good:

```ts
import { AppShell } from '../../components/shell';
import { DashboardOverview } from '../../components/organisms';
```

Later, after page grouping:

```ts
import { DashboardOverview } from '../../components/organisms/Dashboard';
```

Avoid deep imports from pages:

```ts
import { DashboardOverview } from '../../components/organisms/DashboardOverview/DashboardOverview';
```

### 7.2 Components

Components should import other components from component-folder barrels:

```ts
import { Panel } from '../Panel';
import { AppEmptyState } from '../../molecules/AppEmptyState';
```

Avoid importing from broad legacy barrels inside components:

```ts
import { Panel } from '../Panels';
import { CalendarBoard } from '../Phase8Sections';
```

This prevents wide dependency surfaces and makes future moves safer.

### 7.3 Stories

Stories should import the component under test from the local folder barrel:

```ts
import { AppTopBar } from '.';
```

or:

```ts
import { DashboardHero } from '.';
```

This keeps story files aligned with component folders.

---

## 8. Storybook hierarchy contract

Storybook titles should mirror the filesystem hierarchy.

### Current flat organism world

File:

```text
components/organisms/DashboardHero/DashboardHero.stories.tsx
```

Title:

```ts
title: 'Pyxis App/Components/Organisms/DashboardHero'
```

### Future page-grouped organism world

File:

```text
components/organisms/Dashboard/DashboardHero/DashboardHero.stories.tsx
```

Title:

```ts
title: 'Pyxis App/Components/Organisms/Dashboard/DashboardHero'
```

### Shell

File:

```text
components/shell/AppTopBar/AppTopBar.stories.tsx
```

Title:

```ts
title: 'Pyxis App/Components/Shell/AppTopBar'
```

This makes Storybook navigation reflect the source tree.

---

## 9. Files that need splitting

### 9.1 Shell: highest priority

Current file:

```text
web/packages/pyxis-app/src/components/shell/AppShell.tsx
```

Exports:

```ts
AppSidebarMenu
AppSidebarUserFooter
AppSidebar
AppTopBar
AppMobileBottomNav
AppShell
AppTopBarProps
AppShellProps
```

Recommended target:

```text
web/packages/pyxis-app/src/components/shell/
├── AppShell/
│   ├── AppShell.tsx
│   ├── AppShell.css
│   ├── AppShell.stories.tsx
│   └── index.ts
├── AppTopBar/
│   ├── AppTopBar.tsx
│   ├── AppTopBar.css
│   ├── AppTopBar.stories.tsx
│   └── index.ts
├── AppSidebar/
│   ├── AppSidebar.tsx
│   ├── AppSidebar.css
│   ├── AppSidebar.stories.tsx
│   └── index.ts
├── AppSidebarMenu/
│   ├── AppSidebarMenu.tsx
│   ├── AppSidebarMenu.css
│   ├── AppSidebarMenu.stories.tsx
│   └── index.ts
├── AppSidebarUserFooter/
│   ├── AppSidebarUserFooter.tsx
│   ├── AppSidebarUserFooter.css
│   ├── AppSidebarUserFooter.stories.tsx
│   └── index.ts
├── AppMobileBottomNav/
│   ├── AppMobileBottomNav.tsx
│   ├── AppMobileBottomNav.css
│   ├── AppMobileBottomNav.stories.tsx
│   └── index.ts
└── index.ts
```

CSS split from `AppShell.css`:

| Selectors | New file |
|---|---|
| `.app-shell`, `.app-main`, `.app-main-scroll` | `AppShell/AppShell.css` |
| `.app-topbar`, `.app-topbar-actions` | `AppTopBar/AppTopBar.css` |
| `.app-sidebar`, `.app-brand` | `AppSidebar/AppSidebar.css` |
| `.app-sidebar-menu`, `.app-sidebar-section`, nav links | `AppSidebarMenu/AppSidebarMenu.css` |
| `.app-sidebar-user` | `AppSidebarUserFooter/AppSidebarUserFooter.css` |
| `.app-bottom-nav` | `AppMobileBottomNav/AppMobileBottomNav.css` |

Important: each component imports its own CSS.

### 9.2 Molecules: multi-export split

#### `ArtistCard`

Current:

```text
molecules/ArtistCard/ArtistCard.tsx
```

Exports:

```ts
ArtistCard
ArtistRosterRow
ArtistCardProps
ArtistRosterRowProps
```

Target:

```text
molecules/ArtistCard/
├── ArtistCard.tsx
├── ArtistCard.css
├── ArtistCard.stories.tsx
└── index.ts

molecules/ArtistRosterRow/
├── ArtistRosterRow.tsx
├── ArtistRosterRow.css
├── ArtistRosterRow.stories.tsx
└── index.ts
```

#### `BookingCard`

Current:

```text
molecules/BookingCard/BookingCard.tsx
```

Exports:

```ts
BookingCard
BookingQueueRow
BookingActionHandler
BookingCardProps
BookingQueueRowProps
```

Target:

```text
molecules/BookingCard/
├── BookingCard.tsx
├── BookingCard.css
├── BookingCard.stories.tsx
└── index.ts

molecules/BookingQueueRow/
├── BookingQueueRow.tsx
├── BookingQueueRow.css
├── BookingQueueRow.stories.tsx
└── index.ts
```

### 9.3 Organisms: secondary exported component split

Current:

```text
organisms/DashboardAttentionContent/DashboardAttentionContent.tsx
```

Exports:

```ts
DashboardAttentionContent
DashboardAttentionCount
defaultDashboardAttentionItems
DashboardAttentionTone
DashboardAttentionItem
DashboardAttentionCountProps
DashboardAttentionContentProps
```

Target:

```text
organisms/DashboardAttentionContent/
├── DashboardAttentionContent.tsx
├── DashboardAttentionContent.css
├── DashboardAttentionContent.stories.tsx
└── index.ts

organisms/DashboardAttentionCount/
├── DashboardAttentionCount.tsx
├── DashboardAttentionCount.css
├── DashboardAttentionCount.stories.tsx
└── index.ts
```

Shared data/types can live in:

```text
organisms/DashboardAttentionContent/dashboardAttentionData.ts
```

or:

```text
organisms/DashboardAttention/dashboardAttentionData.ts
```

Keep it simple unless more components need the data.

---

## 10. Optional later: page-grouped organisms

Do not do page grouping in the same commit as shell/component splitting.

If we later decide to group organisms by page, do one page group per commit.

Desired long-term shape:

```text
components/organisms/
├── Dashboard/
│   ├── DashboardActivityPanel/
│   ├── DashboardAttentionContent/
│   ├── DashboardAttentionCount/
│   ├── DashboardAttentionPanel/
│   ├── DashboardHero/
│   ├── DashboardMetricsGrid/
│   ├── DashboardMobileCopy/
│   ├── DashboardMobileHeader/
│   ├── DashboardOverview/
│   ├── DashboardQuickActionsContent/
│   ├── DashboardQuickActionsPanel/
│   └── DashboardUpcomingPanel/
├── Shows/
│   ├── ShowsArchivedPanel/
│   ├── ShowsConfirmedPanel/
│   ├── ShowsFilterBar/
│   └── ShowsTable/
├── ShowDetail/
│   ├── ShowDetailDiscordPanel/
│   ├── ShowDetailHero/
│   └── ShowDetailInfoPanel/
├── Calendar/
│   ├── CalendarAgenda/
│   ├── CalendarBoard/
│   ├── CalendarLegend/
│   ├── CalendarMonth/
│   └── CalendarMonthPanel/
├── Bookings/
│   ├── BookingQueue/
│   ├── BookingReviewDatePanel/
│   ├── BookingReviewHero/
│   ├── BookingReviewNotePanel/
│   ├── BookingReviewRequestPanel/
│   ├── BookingsInboxPanel/
│   ├── BookingsInsightsPanel/
│   └── BookingsProcessedPanel/
├── Roster/
│   ├── ArtistRoster/
│   ├── AttendancePanel/
│   └── AuditLogPanel/
├── Settings/
│   └── SettingsPanel/
└── Shared/
    ├── Panel/
    ├── NewShowModal/
    ├── FlyerField/
    └── DiscordMappingPanel/
```

Storybook titles should then become:

```ts
title: 'Pyxis App/Components/Organisms/Dashboard/DashboardHero'
title: 'Pyxis App/Components/Organisms/Shows/ShowsTable'
title: 'Pyxis App/Components/Organisms/Bookings/BookingQueue'
```

---

## 11. Recommended migration sequence

### Commit 1: organization playbook and public barrels

No file movement.

Create:

```text
docs/playbooks/10-pyxis-app-component-organization.md
components/organisms/index.ts
```

Start replacing imports from legacy barrels in pages only:

```text
../../components/organisms/Panels
../../components/organisms/Phase8Sections
```

with:

```text
../../components/organisms
```

Do not delete legacy barrels yet.

### Commit 2: shell split only

Split `shell/AppShell.tsx` and `shell/AppShell.css` into component folders.

Do not move organisms.

Do not change visual styling.

Each shell component imports its own CSS.

### Commit 3: molecule multi-export split

Split:

```text
molecules/ArtistCard -> ArtistCard + ArtistRosterRow
molecules/BookingCard -> BookingCard + BookingQueueRow
```

Do not move organisms.

### Commit 4: DashboardAttention split

Split:

```text
DashboardAttentionContent
DashboardAttentionCount
```

Add missing stories.

### Commit 5+: optional organism page grouping

One page group per commit, starting with `Dashboard/`.

---

## 12. Validation checklist

Run after every refactor commit:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app
pnpm exec tsc --noEmit
pnpm exec vite build
pnpm exec storybook build
```

Also run a relative import resolver that checks CSS imports. TypeScript alone is not enough because it missed a broken CSS side-effect import in the previous attempt.

Suggested permanent script location:

```text
web/packages/pyxis-app/scripts/check-relative-imports.ts
```

Ticket-local first is acceptable:

```text
ttmp/.../scripts/check-relative-imports.py
```

The script should inspect relative imports in `.ts`, `.tsx`, `.js`, and `.jsx` files and resolve:

- `.ts`
- `.tsx`
- `.js`
- `.jsx`
- `.css`
- folder `index.ts`
- folder `index.tsx`

---

## 13. Implementation rules for scripts

If a script is needed:

1. Store it in the ticket `scripts/` folder before running it.
2. Support `--dry-run`.
3. Support `--limit` or explicit file arguments.
4. Run it on 5-10 files first.
5. Inspect output manually.
6. Run full dry-run.
7. Apply.
8. Run dry-run again and confirm idempotence.
9. Run `tsc`, `vite build`, and `storybook build`.

Do not run one-off global regex replacements directly in the shell.

---

## 14. Practical start recommendation

Start with a small non-invasive commit:

1. Create `docs/playbooks/10-pyxis-app-component-organization.md` from this guide.
2. Add `components/organisms/index.ts`.
3. Migrate page imports away from `Panels.tsx` and `Phase8Sections.tsx`.
4. Leave legacy barrels in place as shims.
5. Validate.
6. Commit.

Then split shell only.

The reason is simple: before moving CSS and TSX files, we should reduce legacy import ambiguity.

---

## 15. Summary

The safe model is:

```text
one exported component -> one folder
component owns CSS
story imports local component barrel
pages import public layer/domain barrels
legacy barrels are temporary shims
storybook mirrors filesystem
scripts are dry-run-first and stored in ticket
```

This gives us a single concept of component organization and avoids the previous bugs:

- standalone stories missing parent CSS,
- CSS imports resolving to the wrong page group,
- broad import rewrites corrupting strings,
- TypeScript passing while Vite import analysis fails.
