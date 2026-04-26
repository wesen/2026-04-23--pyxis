# React Widget Folder, CSS, and Storybook Organization

Use this guide when creating or refactoring React UI packages in this repo. The goal is to make component ownership obvious from the start: each widget owns its implementation, styles, stories, and export surface.

This mirrors the established pattern in `web/packages/pyxis-components/src/public/*` and should be used for `pyxis-app` and future React packages.

## Principle

Organize by widget ownership, not by file type.

Prefer this:

```text
WidgetName/
  WidgetName.tsx
  WidgetName.css
  WidgetName.stories.tsx
  index.ts
```

Avoid this:

```text
components/
  WidgetName.tsx
  WidgetName.css
stories/
  WidgetName.stories.tsx
styles/
  rows.css
  panels.css
```

The folder should answer: “What files define this widget?” without searching elsewhere.

## Recommended package layout

```text
src/
  components/
    atoms/
      StatusDot/
        StatusDot.tsx
        StatusDot.css
        StatusDot.stories.tsx
        index.ts
    molecules/
      BookingCard/
        BookingCard.tsx
        BookingCard.css
        BookingCard.stories.tsx
        index.ts
      Table/
        Table.css
        index.ts
    organisms/
      BookingsInboxPanel/
        BookingsInboxPanel.tsx
        BookingsInboxPanel.css
        BookingsInboxPanel.stories.tsx
        index.ts
      Panel/
        Panel.tsx
        Panel.css
        Panel.stories.tsx
        index.ts
    shell/
      AppShell.tsx
      AppShell.css
      AppShell.stories.tsx
  pages/
    DashboardPage/
      DashboardPage.tsx
      DashboardPage.css
      DashboardPage.stories.tsx
      index.ts
```

`atoms`, `molecules`, and `organisms` are still useful categories, but every actual widget inside them should be a folder.

## File responsibilities

### `WidgetName.tsx`

The component implementation owns:

- prop types,
- markup structure,
- accessibility attributes,
- stable `data-*` hooks/parts,
- imports for its own CSS.

Example:

```tsx
import type { ReactNode } from 'react';
import { appPart } from '../../parts';
import './Panel.css';

export type PanelProps = {
  title: string;
  kicker?: string;
  action?: ReactNode;
  children: ReactNode;
  section?: string;
};

export function Panel({ title, kicker, action, children, section }: PanelProps) {
  return (
    <section className="app-panel" data-section={section} {...appPart('panel')}>
      <header {...appPart('panel', 'header')}>
        <div>
          <h2>{title}</h2>
          {kicker && <span>{kicker}</span>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
```

### `WidgetName.css`

The stylesheet owns only this widget’s base rules and local variants.

Good:

```css
.app-booking-card { ... }
.app-booking-card header { ... }
.app-booking-card-actions { ... }
```

Bad:

```css
/* In BookingCard.css */
.app-dashboard-hero { ... }
.app-calendar-cell { ... }
```

Use shared tokens instead of hard-coded one-off values where possible:

```css
.app-booking-card {
  border: 1px solid var(--app-rule);
  border-radius: var(--app-radius-md);
  background: var(--app-surface-warm, #faf8f3);
}
```

### `WidgetName.stories.tsx`

Stories live beside the widget and demonstrate meaningful states.

At minimum, add:

- default state,
- empty state if applicable,
- narrow/mobile state if layout changes,
- long-content state if truncation/wrapping matters,
- important visual variants.

Example:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { bookings } from '../../../api/mockData';
import { BookingsInboxPanel } from './BookingsInboxPanel';

const meta: Meta<typeof BookingsInboxPanel> = {
  title: 'Pyxis App/Components/Organisms/BookingsInboxPanel',
  component: BookingsInboxPanel,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof BookingsInboxPanel>;

export const InboxPanel: Story = {
  render: () => (
    <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}>
      <BookingsInboxPanel bookings={bookings} />
    </div>
  ),
};

export const InboxEmpty: Story = {
  render: () => (
    <div style={{ width: 694, padding: 24, background: 'var(--app-canvas)' }}>
      <BookingsInboxPanel bookings={[]} />
    </div>
  ),
};
```

### `index.ts`

The local index exports the widget API:

```ts
export * from './BookingsInboxPanel';
```

This lets callers import from the folder:

```ts
import { BookingsInboxPanel } from '../components/organisms/BookingsInboxPanel';
```

## Storybook title hierarchy

Storybook titles should mirror the source tree.

For this disk path:

```text
src/components/organisms/BookingsInboxPanel/BookingsInboxPanel.stories.tsx
```

Use this title:

```ts
title: 'Pyxis App/Components/Organisms/BookingsInboxPanel'
```

For this disk path:

```text
src/components/molecules/MetricCard/MetricCard.stories.tsx
```

Use:

```ts
title: 'Pyxis App/Components/Molecules/MetricCard'
```

For page stories:

```text
src/pages/DashboardPage/DashboardPage.stories.tsx
```

Use:

```ts
title: 'Pyxis App/Pages/DashboardPage'
```

Do not create broad titles like:

```text
Pyxis App/Components
Pyxis App/Organisms/Bookings
Pyxis App/Dashboard Sections
```

unless there is an actual folder/widget with that name.

## Storybook config

Prefer colocated stories only:

```ts
stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)']
```

Avoid a top-level package `stories/` folder for app/package components. Colocation keeps examples close to the implementation and reduces stale imports after refactors.

## CSS ownership rules

### Good CSS ownership

- An atom imports its own atom CSS.
- A molecule imports its own molecule CSS.
- An organism imports its own organism CSS.
- Shared primitives are intentionally small and named, for example:
  - `Table/Table.css`,
  - `Panel/Panel.css`.
- A page imports page-level layout CSS only for page layout.

### Bad CSS ownership

Avoid broad bucket files such as:

```text
Rows.css
Panels.css
DashboardSections.css
Phase8Sections.css
pages.css
```

These become fragile because unrelated widgets depend on them. In Storybook/Vite they can also become stale or be served as empty transformed CSS modules, causing many stories to appear broken at once.

If a bucket file temporarily exists during migration, mark it as a compatibility shim:

```css
/* Deprecated compatibility shim. Do not add new rules here. */
```

Then schedule a cleanup to remove it.

## Shared primitives

Some styles are legitimately shared. Put those in named primitive folders rather than buckets.

Examples:

```text
components/organisms/Panel/
  Panel.tsx
  Panel.css
  Panel.stories.tsx
  index.ts

components/molecules/Table/
  Table.css
  index.ts
```

A component can import a primitive CSS file when it uses that primitive’s classes:

```ts
import '../Table/Table.css';
import './ShowTableRow.css';
```

Keep primitives small and generic. If `Table.css` starts containing booking-specific or show-specific rules, split those rules back into the owning widget.

## Props and type rules

Each widget should export a named props type:

```ts
export type MetricCardProps = {
  label: string;
  value: string | number;
  caption?: string;
  trend?: string;
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'info';
};

export function MetricCard(props: MetricCardProps) { ... }
```

Prefer domain-specific data props when the widget is app-specific:

```ts
export type BookingCardProps = {
  booking: BookingRequest;
};
```

Prefer primitive props when the widget should be reusable outside that domain:

```ts
export type StatusPillProps = {
  tone?: StatusTone;
  children: ReactNode;
};
```

Avoid anonymous inline prop types for widgets that are intended to be reused or wired to RTK Query later.

## Stable hooks and parts

Use stable data hooks for visual comparison and theming.

For app widgets, prefer the existing helper:

```ts
appPart('booking-card')
appPart('booking-card', 'header')
appPart('booking-card', 'actions')
```

Use `data-section` for visual-diff section selection when a widget corresponds to a prototype section:

```tsx
<Panel section="bookings-queue" ... />
```

Use explicit `data-element` hooks for important subelements that will be inspected visually:

```tsx
<h2 data-element="hero-artist">{show.artist}</h2>
```

## RTK Query readiness

This organization sets up data wiring because each widget has a clear data boundary.

Good layering:

```text
Page
  calls RTK Query hooks
  handles loading/error/empty route state
  passes typed data to organisms

Organism
  accepts typed domain props
  composes molecules/atoms

Molecule/Atom
  accepts either domain object or primitive props
  does not fetch data
```

Avoid calling RTK Query hooks inside every small widget unless the widget is explicitly a data container.

## Visual-diff and Storybook IDs

Changing Storybook `title` or export names changes story IDs.

If a visual spec references a story ID, update the spec in the same commit:

```text
prototype-design/visual-diff/userland/specs/*.visual.yml
```

Then regenerate mirrors:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

Validate at least one affected story URL and one focused visual smoke.

## Refactor checklist

When creating or refactoring a widget:

- [ ] Create `WidgetName/WidgetName.tsx`.
- [ ] Export a named `WidgetNameProps` type.
- [ ] Create `WidgetName/WidgetName.css`.
- [ ] Create `WidgetName/WidgetName.stories.tsx`.
- [ ] Create `WidgetName/index.ts`.
- [ ] Import the widget’s CSS from its TSX file.
- [ ] Keep Storybook `title` aligned with the disk path.
- [ ] Add default and important state stories.
- [ ] Use shared tokens, not one-off hard-coded visual values.
- [ ] Add stable `data-section`, `data-element`, or part hooks where visual-diff needs them.
- [ ] Run typecheck.
- [ ] Restart Storybook after large file moves.
- [ ] Run targeted visual smoke if a visual spec uses the story.

## Large file move warning

After moving/renaming many TSX or CSS files, restart Storybook. Vite HMR can keep stale module paths and produce false 404/broken-story failures.

```bash
tmux kill-session -t pyxis-app-storybook 2>/dev/null || true
tmux new-session -d -s pyxis-app-storybook \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-app storybook'
```

Do not judge a story as broken until after the restart.
