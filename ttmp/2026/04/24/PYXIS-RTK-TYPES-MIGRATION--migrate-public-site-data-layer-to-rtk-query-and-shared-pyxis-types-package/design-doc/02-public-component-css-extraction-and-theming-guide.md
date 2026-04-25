---
Title: Public component CSS extraction and theming guide
Ticket: PYXIS-RTK-TYPES-MIGRATION
Status: active
Topics:
  - frontend
  - react
  - theming
  - css
  - storybook
  - architecture
  - pyxis
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
  - web/packages/pyxis-components/src/tokens/tokens.css
  - web/packages/pyxis-components/src/utils/parts.ts
  - web/packages/pyxis-components/src/public
  - web/packages/pyxis-components/src/public/index.ts
  - web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx
  - prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
  - prototype-design/visual-diff/comparisons/component-system/public
ExternalSources: []
Summary: "Intern-oriented migration guide for extracting inline public component styles into tokenized CSS with stable data-pyxis part selectors, Storybook theme coverage, and visual-diff validation."
LastUpdated: 2026-04-24T00:00:00Z
WhatFor: "Use this to convert the newly inventoried public-site components from parity-discovery inline styles into a modular, themable component library."
WhenToUse: "Before page-level app rewiring or after the RTK Query/types migration when stabilizing pyxis-components for long-term use."
---

# Public Component CSS Extraction and Theming Guide

## 0. Executive summary

The public-site visual parity work created a broad inventory of React components that correspond to the prototype design system. That was the right first step: the repository now has public-site molecules and organisms, Storybook stories, and `css-visual-diff` coverage for many of them.

However, many newly added public components are still written in a **prototype-discovery style**: JSX with large inline `style={{ ... }}` objects and hardcoded color/spacing values. This was acceptable while discovering visual parity, but it is not the desired final architecture for a reusable component package.

This document covers the second track that sits alongside the RTK Query / `pyxis-types` migration:

```text
Track A — app data foundation
  RTK Query + pyxis-types.

Track B — component styling foundation
  Extract inline public component styles into tokenized CSS.
  Add stable data-pyxis part selectors.
  Add theme/variant Storybook coverage.
  Re-run visual-diff configs to prove no unintended visual regression.
```

The goal is not to redesign the site. The goal is to preserve the current prototype-aligned visuals while making the public components modular, maintainable, and themeable.

---

## 1. What this guide is and is not

### 1.1 This guide is about CSS extraction

This guide tells an implementer how to:

- identify public components with inline styles,
- create one CSS file per public component,
- move layout/typography/color/border styles from JSX into CSS,
- replace hardcoded values with existing tokens where possible,
- add stable `data-pyxis-component` and `data-pyxis-part` attributes,
- preserve runtime props such as dates, labels, event handlers, and dynamic maps,
- add or update Storybook stories for default, themed, and responsive states,
- validate with typecheck, Storybook, and `css-visual-diff`.

### 1.2 This guide is not about RTK Query

The RTK Query work is documented separately in:

```text
design-doc/01-rtk-query-and-pyxis-types-migration-guide.md
```

That document covers:

- `pyxis-types`,
- Redux Toolkit,
- RTK Query API slice,
- app provider migration,
- page data hooks.

This CSS document covers the component-package styling foundation.

### 1.3 This guide is not a license to change visuals freely

When extracting CSS, do **not** intentionally change visual output unless the task explicitly says to tune a component. For this phase, the intended outcome is:

```text
same screenshots, better architecture
```

If a visual change is unavoidable because the inline value was clearly wrong or un-tokenized, document it in the component's parity-map entry and changelog.

---

## 2. Why CSS extraction matters

Inline style-heavy components are hard to maintain because:

- pseudo-classes such as `:hover`, `:focus-visible`, `:disabled`, and `:focus-within` are awkward or impossible,
- theming cannot override inline style values without `!important`,
- hardcoded colors like `#C8270D`, `#8E887E`, `#EAE7E0`, `#1F1E1C`, and `#F8F6F1` spread through JSX,
- responsive behavior gets mixed with render logic,
- Storybook cannot easily demonstrate theme overrides,
- downstream apps cannot style stable subparts,
- component code becomes hard to review because visual declarations obscure logic.

The desired long-term shape is:

```tsx
<section
  className={clsx('pyxis-show-tile', className)}
  {...pyxisPart('show-tile')}
>
  <Poster className="pyxis-show-tile__poster" show={show} />
  <div className="pyxis-show-tile__body" {...pyxisPart('show-tile', 'body')}>
    ...
  </div>
</section>
```

paired with:

```css
[data-pyxis-component='show-tile'][data-pyxis-part='root'] {
  --pyxis-show-tile-bg: var(--color-surface);
  --pyxis-show-tile-border: var(--color-border);

  background: var(--pyxis-show-tile-bg);
  border: 1px solid var(--pyxis-show-tile-border);
}

[data-pyxis-component='show-tile'][data-pyxis-part='body'] {
  padding: var(--space-5);
}
```

This makes the component themeable without changing the TypeScript implementation.

---

## 3. Current theming foundation

### 3.1 Tokens already exist

The token file is:

```text
web/packages/pyxis-components/src/tokens/tokens.css
```

It defines CSS custom properties for colors, typography, spacing, radius, shadows, motion, and focus rings.

Useful token families include:

```css
--color-canvas
--color-surface
--color-surface-raised
--color-border
--color-border-subtle
--color-border-strong
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-text-inverse
--color-text-inverse-muted
--color-accent
--color-accent-hover
--color-accent-subtle
--color-accent-strong
--color-ink
--font-display
--font-body
--font-mono
--text-*
--leading-*
--tracking-*
--weight-*
--space-*
--radius-*
--shadow-*
--duration-*
--ease-*
--ring-*
```

Use these before creating new component-local variables.

### 3.2 The component part helper already exists

The selector helper is:

```text
web/packages/pyxis-components/src/utils/parts.ts
```

It emits stable attributes:

```tsx
pyxisPart('button')
```

becomes:

```html
data-pyxis-component="button" data-pyxis-part="root"
```

and:

```tsx
pyxisPart('button', 'label')
```

becomes:

```html
data-pyxis-component="button" data-pyxis-part="label"
```

This is the correct styling/test/screenshot contract.

### 3.3 There is already one partial CSS extraction example

`PubNav` is already closer to the target pattern:

```text
web/packages/pyxis-components/src/public/PubNav/PubNav.tsx
web/packages/pyxis-components/src/public/PubNav/PubNav.css
```

It has a CSS file, class names, and root `pyxisPart('pub-nav')`. It still contains hardcoded prototype colors in CSS, so it is not perfect, but it is a useful migration model:

```tsx
<header className={clsx('pyxis-pub-nav', className)} {...pyxisPart('pub-nav')}>
```

Target improvements for `PubNav` itself:

- import `./PubNav.css` if not imported from the barrel/story path,
- replace CSS hardcoded colors with tokens,
- add part selectors for `inner`, `logo`, `links`, and `link`,
- preserve current visual output.

---

## 4. Current public component inventory

The public component directory is:

```text
web/packages/pyxis-components/src/public
```

Current public components include:

```text
AboutHero
AboutIntro
ArchiveSearchFilters
ArchiveShowList
ArchiveShowRow
ArchiveStats
BookingForm
BookingRules
BookingSpaceAside
BookingSuccess
CollectiveList
EthosGrid
EthosStrip
FindUsBlock
LineupRow
MailingListCTA
Poster
PubFooter
PubHero
PublicPageHeader
PubNav
PubShowRow
ReserveTicketCard
SaferSpaceAgreement
SafetyNote
ShowDetailHeader
ShowGrid
ShowMetaStrip
ShowTile
ShowTypeChips
SpaceInfo
TicketStub
VenueCard
YearGroup
```

Only `PubNav` currently has a dedicated CSS file. Most other public components need extraction.

### 4.1 Components likely to need extraction first

A quick grep for inline styles and hardcoded colors shows many targets. Prioritize components that are already canonical page-building blocks:

```text
PublicPageHeader
PubHero
ShowGrid
ShowTile
Poster
TicketStub
ShowDetailHeader
ShowMetaStrip
ReserveTicketCard
ArchiveSearchFilters
ArchiveShowList
ArchiveShowRow
BookingForm
BookingSpaceAside
SaferSpaceAgreement
AboutIntro
EthosGrid
CollectiveList
FindUsBlock
PubFooter
```

### 4.2 Components requiring taxonomy decisions

Some components overlap semantically. Before extracting CSS for both, decide whether one is canonical and the other is legacy/alias/prototype-only:

```text
EthosGrid vs EthosStrip
BookingSpaceAside vs VenueCard
FindUsBlock vs SpaceInfo
ShowTile/ShowGrid vs PubShowRow
ArchiveShowRow vs PubShowRow
```

Do not spend a full CSS extraction pass polishing a component that will be deleted immediately. If uncertain, extract only the canonical component first and document the other as deferred.

---

## 5. Naming conventions

### 5.1 File naming

For each component:

```text
ComponentName/
  ComponentName.tsx
  ComponentName.css
  ComponentName.stories.tsx
```

Example:

```text
ShowTile/
  ShowTile.tsx
  ShowTile.css
  ShowTile.stories.tsx
```

### 5.2 CSS class naming

Use `pyxis-` prefixed BEM-style classes for layout and developer readability:

```css
.pyxis-show-tile {}
.pyxis-show-tile__poster {}
.pyxis-show-tile__body {}
.pyxis-show-tile__title {}
.pyxis-show-tile__meta {}
.pyxis-show-tile--featured {}
```

### 5.3 `data-pyxis` naming

Use kebab-case component names:

```text
show-tile
archive-show-row
booking-space-aside
public-page-header
```

Use stable semantic part names:

```text
root
header
body
footer
title
subtitle
meta
poster
content
actions
button
link
list
item
badge
chip
field
label
control
message
```

Avoid visual-only part names such as `red-thing`, `left-box`, or `tiny-text` unless that is truly the domain language.

### 5.4 Selector preference

Prefer root selectors based on `data-pyxis`:

```css
[data-pyxis-component='show-tile'][data-pyxis-part='root'] {}
```

Use classes for internal layout when helpful:

```css
.pyxis-show-tile__body {}
```

Use part selectors for stable public subparts:

```css
[data-pyxis-component='show-tile'][data-pyxis-part='title'] {}
```

Do not rely on brittle selectors like:

```css
.pyxis-show-tile > div > div:nth-child(2) {}
```

---

## 6. Token mapping guide

Replace common hardcoded prototype values with tokens.

### 6.1 Color mapping

| Hardcoded value | Preferred token | Notes |
| --- | --- | --- |
| `#C8270D` | `var(--color-accent)` | Main crimson accent. |
| `#A81F09` | `var(--color-accent-hover)` | Hover crimson. |
| `#8E1B08` | `var(--color-accent-strong)` | Strong/dark accent. |
| `#1A1A18` | `var(--color-text-primary)` or `var(--color-ink)` | Text/ink. |
| `#1F1E1C` | usually `var(--color-text-primary)` | Prototype near-ink. |
| `#555048` | `var(--color-text-secondary)` | Secondary text. |
| `#8A857B` / `#8E887E` | `var(--color-text-tertiary)` | Muted text. |
| `#EAE6DD` / `#EAE7E0` | `var(--color-border)` | Standard border. |
| `#F0EDE4` | `var(--color-border-subtle)` or `var(--color-ink-subtle)` | Subtle border/inverse detail. |
| `#F3F1EB` / `#F3F1EC` | `var(--color-canvas)` | Warm page canvas. |
| `#FAF8F2` / `#F8F6F1` | `var(--color-surface-raised)` | Raised warm surface. |
| `#FFFFFF` / `white` | `var(--color-surface)` or `var(--color-text-inverse)` | Depends on context. |

If exact visual parity requires a value that does not map well, define a component variable with a token fallback:

```css
[data-pyxis-component='poster'][data-pyxis-part='root'] {
  --pyxis-poster-bg: var(--color-accent);
  background: var(--pyxis-poster-bg);
}
```

Then the value is still overrideable.

### 6.2 Spacing mapping

Use existing spacing tokens:

| Pixels | Token |
| --- | --- |
| `4px` | `var(--space-1)` |
| `8px` | `var(--space-2)` |
| `12px` | `var(--space-3)` |
| `16px` | `var(--space-4)` |
| `20px` | `var(--space-5)` |
| `24px` | `var(--space-6)` |
| `32px` | `var(--space-7)` |
| `40px` | `var(--space-8)` |
| `56px` | `var(--space-9)` |
| `72px` | `var(--space-10)` |

### 6.3 Typography mapping

Use:

```css
font-family: var(--font-display);
font-family: var(--font-body);
font-family: var(--font-mono);
font-size: var(--text-sm);
font-weight: var(--weight-semibold);
line-height: var(--leading-tight);
letter-spacing: var(--tracking-wide);
```

### 6.4 Radius/shadow/motion mapping

Use:

```css
border-radius: var(--radius-sm);
border-radius: var(--radius-md);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-sm);
transition: color var(--duration-fast) var(--ease-default);
```

If the token does not exist, do not immediately invent a global token. Prefer a local component variable first:

```css
--pyxis-ticket-stub-tear-radius: 14px;
```

Promote to a global token only if several unrelated components need the same value.

---

## 7. Migration recipe for one component

Use this exact sequence for each component.

### Step 1: choose the component

Pick one small component first, such as `SafetyNote`, `TicketStub`, or `ArchiveStats`. Do not start with `BookingForm`.

### Step 2: inspect JSX

Read:

```text
web/packages/pyxis-components/src/public/<Component>/<Component>.tsx
```

Identify:

- root element,
- props,
- dynamic styles that depend on props,
- repeated inline values,
- semantic subparts,
- event handlers,
- accessibility attributes.

### Step 3: create CSS file

Create:

```text
web/packages/pyxis-components/src/public/<Component>/<Component>.css
```

### Step 4: import CSS from the component

At the top of the component file:

```ts
import './ShowTile.css';
```

Component-level imports are preferred because they make the component self-contained when imported from Storybook or consuming apps.

### Step 5: add `clsx` if needed

If the component already has `className` support, use `clsx`:

```ts
import { clsx } from 'clsx';
```

Then:

```tsx
<section className={clsx('pyxis-show-tile', className)} {...pyxisPart('show-tile')}>
```

If the component does not expose `className`, consider adding it as an optional prop for reusable public components.

### Step 6: add part selectors

Before:

```tsx
<h3 style={{ fontSize: 22, fontWeight: 700 }}>{show.artist}</h3>
```

After:

```tsx
<h3 className="pyxis-show-tile__title" {...pyxisPart('show-tile', 'title')}>
  {show.artist}
</h3>
```

### Step 7: move static inline styles to CSS

Before:

```tsx
<div
  style={{
    display: 'grid',
    gap: 16,
    padding: 24,
    background: '#fff',
    border: '1px solid #EAE7E0',
  }}
>
```

After:

```tsx
<div className="pyxis-show-tile__body" {...pyxisPart('show-tile', 'body')}>
```

```css
[data-pyxis-component='show-tile'][data-pyxis-part='body'] {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}
```

### Step 8: keep truly dynamic styles in JSX, but convert to variables

If a style depends on props, prefer CSS variables:

```tsx
<section
  className={clsx('pyxis-poster', className)}
  style={{
    '--pyxis-poster-accent': accentColor,
  } as React.CSSProperties}
  {...pyxisPart('poster')}
>
```

Then CSS:

```css
[data-pyxis-component='poster'][data-pyxis-part='root'] {
  background: var(--pyxis-poster-accent, var(--color-accent));
}
```

This keeps runtime flexibility while avoiding hardcoded structural styles in JSX.

### Step 9: run typecheck

```bash
cd web
pnpm --filter pyxis-components typecheck
```

### Step 10: run Storybook visual smoke

Use the live Storybook server in tmux when doing visual work:

```bash
tmux new -s pyxis-components-storybook
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-components storybook
```

Open:

```text
http://localhost:6006
```

### Step 11: run visual-diff for the component

Use the existing config under:

```text
prototype-design/visual-diff/comparisons/component-system/public
```

Example pattern:

```bash
css-visual-diff run \
  prototype-design/visual-diff/comparisons/component-system/public/molecules/ticket-stub-default.css-visual-diff.yml
```

or for organisms:

```bash
css-visual-diff run \
  prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-form-default.css-visual-diff.yml
```

Check generated artifacts under:

```text
prototype-design/visual-comparisons/component-system/public/...
```

Do not commit generated visual comparison outputs unless the project explicitly asks for them.

---

## 8. Example migration: `TicketStub`

This is illustrative pseudocode. Inspect the real file before editing.

### 8.1 Before

```tsx
export function TicketStub({ show }: TicketStubProps) {
  return (
    <div
      {...pyxisPart('ticket-stub')}
      style={{
        background: '#fff',
        border: '1px solid #EAE7E0',
        borderRadius: 12,
        padding: 20,
      }}
    >
      <div style={{ color: '#C8270D', fontSize: 12 }}>UPCOMING</div>
      <h3 style={{ color: '#1F1E1C', fontSize: 22 }}>{show.artist}</h3>
    </div>
  );
}
```

### 8.2 After

```tsx
import { clsx } from 'clsx';
import { pyxisPart } from '../../utils/parts';
import './TicketStub.css';

export function TicketStub({ show, className }: TicketStubProps) {
  return (
    <article
      className={clsx('pyxis-ticket-stub', className)}
      {...pyxisPart('ticket-stub')}
    >
      <div
        className="pyxis-ticket-stub__eyebrow"
        {...pyxisPart('ticket-stub', 'eyebrow')}
      >
        UPCOMING
      </div>
      <h3
        className="pyxis-ticket-stub__title"
        {...pyxisPart('ticket-stub', 'title')}
      >
        {show.artist}
      </h3>
    </article>
  );
}
```

```css
/* TicketStub — compact public show ticket preview */

[data-pyxis-component='ticket-stub'][data-pyxis-part='root'] {
  --pyxis-ticket-stub-bg: var(--color-surface);
  --pyxis-ticket-stub-border: var(--color-border);
  --pyxis-ticket-stub-radius: var(--radius-lg);

  background: var(--pyxis-ticket-stub-bg);
  border: 1px solid var(--pyxis-ticket-stub-border);
  border-radius: var(--pyxis-ticket-stub-radius);
  padding: var(--space-5);
}

[data-pyxis-component='ticket-stub'][data-pyxis-part='eyebrow'] {
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
}

[data-pyxis-component='ticket-stub'][data-pyxis-part='title'] {
  color: var(--color-text-primary);
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  line-height: var(--leading-tight);
}
```

---

## 9. Component batching plan

Do the CSS extraction in batches. Each batch should typecheck and visually validate before moving to the next.

### Batch 0: groundwork

- Confirm `tokens.css` is imported globally wherever component stories render.
- Confirm `pyxisPart` is used consistently.
- Decide whether each component imports its own CSS file directly. Recommendation: yes.
- Add a short note in `public/index.ts` comments if needed: components self-import CSS.

### Batch 1: small molecules

Start with components that have simple structure and existing visual-diff coverage:

```text
SafetyNote
ArchiveStats
TicketStub
LineupRow
YearGroup
Poster
ShowTypeChips
```

Expected outcome:

- CSS files added,
- inline style objects removed or greatly reduced,
- part selectors added,
- visual diffs remain close to previous baseline.

### Batch 2: show-list and archive components

```text
PubShowRow
ArchiveShowRow
ArchiveShowList
ArchiveSearchFilters
ShowTile
ShowGrid
```

Special caution:

- `ShowGrid` should mostly style layout; it should not duplicate styling already owned by `ShowTile`.
- `ArchiveShowList` should style list layout; `ArchiveShowRow` should style row visuals.

### Batch 3: detail and booking components

```text
PublicPageHeader
ShowDetailHeader
ShowMetaStrip
ReserveTicketCard
BookingForm
BookingSpaceAside
BookingRules
BookingSuccess
SaferSpaceAgreement
```

Special caution:

- `BookingForm` is likely the highest-risk component because it has form fields, validation state, focus styles, and submission state.
- Preserve accessibility attributes and label/control relationships.
- Add `:focus-visible` CSS for inputs/buttons where missing.

### Batch 4: about/home/footer components

```text
AboutHero
AboutIntro
EthosGrid
EthosStrip
CollectiveList
FindUsBlock
SpaceInfo
VenueCard
MailingListCTA
PubHero
PubFooter
PubNav
```

Special caution:

- Resolve taxonomy overlaps before spending time on both sides of an overlap.
- `PubNav` already has CSS but needs token cleanup and part selectors.

---

## 10. Storybook requirements

Each canonical public component should have stories that show:

1. default state,
2. narrow/mobile-ish container state where relevant,
3. long-content state if text may wrap,
4. dark theme or alternate theme wrapper if the component is intended to be themeable,
5. interactive/focusable state where possible.

Example story wrapper:

```tsx
export const DarkTheme: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ padding: 32, background: 'var(--color-canvas)' }}>
      <TicketStub {...args} />
    </div>
  ),
};
```

For full-page public stories, keep using MSW handlers and app-level wrappers. For pure component stories, avoid app data fetching; pass mock props directly.

---

## 11. Visual-diff validation

The existing bottom-up parity system should be used as the regression guard.

Key config area:

```text
prototype-design/visual-diff/comparisons/component-system/public
```

Key inventory/status file:

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Generated output area:

```text
prototype-design/visual-comparisons/component-system/public
```

Important rules:

- Keep the real Storybook dev server running in tmux.
- Do not rely on static Storybook builds for active visual work.
- Deterministic `css-visual-diff run` outputs are authoritative.
- Do not treat `llm-review` as the final verdict.
- Do not commit generated visual-comparison artifacts unless explicitly requested.

Example command pattern:

```bash
css-visual-diff run prototype-design/visual-diff/comparisons/component-system/public/molecules/safety-note-default.css-visual-diff.yml
```

After each batch, update the parity map with:

- CSS extraction status,
- any accepted visual deltas,
- before/after diff percentages if relevant,
- notes on token substitutions.

---

## 12. Accessibility requirements

CSS extraction must not degrade accessibility.

Checklist:

- Buttons remain `<button>` where they trigger actions.
- Links remain `<a>` where they navigate.
- Form labels still associate with controls.
- Focus outlines are visible using tokenized ring styles.
- Color-only state differences have text/icon backup where needed.
- Reduced-motion concerns are respected for transitions.
- `aria-current`, `aria-label`, and validation messages are preserved.

Focus style pattern:

```css
[data-pyxis-component='ticket-stub'] a:focus-visible,
[data-pyxis-component='ticket-stub'] button:focus-visible {
  outline: var(--ring-width) solid var(--ring-color);
  outline-offset: 2px;
}
```

---

## 13. What inline styles are still allowed?

Inline styles are allowed only when they represent truly dynamic runtime values.

Allowed examples:

```tsx
style={{ '--pyxis-poster-image': `url(${flyerUrl})` } as React.CSSProperties}
```

```tsx
style={{ '--pyxis-progress': `${percent}%` } as React.CSSProperties}
```

Discouraged examples:

```tsx
style={{ padding: 24, color: '#C8270D', display: 'grid' }}
```

If you keep an inline style, ask:

```text
Could CSS express this with classes/parts/variables?
Is this value truly dynamic per render?
Would a theme need to override it?
```

If a theme would need to override it, it should not be a hardcoded inline style.

---

## 14. Implementation checklist per component

For every component touched:

- [ ] Add `<Component>.css`.
- [ ] Import `./<Component>.css` from `<Component>.tsx`.
- [ ] Add or preserve `className?: string` prop where useful.
- [ ] Use `clsx('pyxis-component-name', className)` on root.
- [ ] Keep `pyxisPart('component-name')` on root.
- [ ] Add `pyxisPart('component-name', '<part>')` to meaningful internal parts.
- [ ] Move static inline style declarations to CSS.
- [ ] Replace hardcoded colors with tokens or component CSS variables.
- [ ] Replace pixel spacing with spacing tokens where practical.
- [ ] Preserve dynamic values through CSS custom properties if needed.
- [ ] Preserve ARIA and semantic HTML.
- [ ] Update Storybook stories if props/class names changed.
- [ ] Run component package typecheck.
- [ ] Run matching visual-diff config.
- [ ] Update parity map or ticket notes with any intentional deltas.

---

## 15. Validation commands

From repo root:

```bash
cd web
pnpm --filter pyxis-components typecheck
pnpm --filter pyxis-components storybook
```

Optional recursive check:

```bash
cd web
pnpm -r typecheck
```

Find remaining inline styles:

```bash
rg "style=\{\{" web/packages/pyxis-components/src/public -g'*.tsx'
```

Find hardcoded colors in public component TSX:

```bash
rg "#[0-9A-Fa-f]{3,6}|rgba?\(" web/packages/pyxis-components/src/public -g'*.tsx'
```

Find hardcoded colors in extracted CSS that may still need token mapping:

```bash
rg "#[0-9A-Fa-f]{3,6}|rgba?\(" web/packages/pyxis-components/src/public -g'*.css'
```

Some `rgba()` values may be acceptable if they reference RGB tokens:

```css
background: rgba(var(--color-canvas-rgb), 0.7);
```

Prefer token-based values where possible.

---

## 16. Definition of done

The CSS extraction track is done when:

- canonical public components have dedicated CSS files,
- public component TSX files no longer contain large static inline style objects,
- hardcoded colors are mostly replaced by tokens or component-local CSS variables,
- root and important subparts have stable `data-pyxis` attributes,
- Storybook stories still render correctly,
- relevant visual-diff configs still pass or have documented accepted deltas,
- `pnpm --filter pyxis-components typecheck` passes,
- the parity map records CSS extraction status for the components.

A stricter future definition of done:

- all public components have dark-theme or alternate-theme Storybook coverage,
- no hardcoded hex colors remain in public component CSS except in token files,
- no public component uses static JSX inline styles,
- taxonomy overlaps are resolved and deprecated aliases are documented.

---

## 17. Recommended commit plan

Keep this separate from the RTK Query migration.

### Commit 1: CSS extraction groundwork

```text
Document public component CSS extraction plan
```

### Commit 2: extract small public molecules

```text
Extract CSS for public molecule components
```

Suggested components:

```text
SafetyNote, ArchiveStats, TicketStub, LineupRow, YearGroup, Poster, ShowTypeChips
```

### Commit 3: extract show/archive components

```text
Extract CSS for show and archive public components
```

Suggested components:

```text
PubShowRow, ArchiveShowRow, ArchiveShowList, ArchiveSearchFilters, ShowTile, ShowGrid
```

### Commit 4: extract booking/detail components

```text
Extract CSS for booking and show detail components
```

Suggested components:

```text
PublicPageHeader, ShowDetailHeader, ShowMetaStrip, ReserveTicketCard, BookingForm, BookingSpaceAside, BookingRules, BookingSuccess, SaferSpaceAgreement
```

### Commit 5: extract about/home/footer components

```text
Extract CSS for about and public shell components
```

Suggested components:

```text
AboutHero, AboutIntro, EthosGrid, EthosStrip, CollectiveList, FindUsBlock, SpaceInfo, VenueCard, MailingListCTA, PubHero, PubFooter, PubNav
```

### Commit 6: theme stories and cleanup

```text
Add public component theme stories
```

---

## 18. Relationship to RTK Query and page-level work

This CSS extraction work can run in parallel with the RTK Query / `pyxis-types` migration as long as commits remain separate.

Recommended sequencing if one person is doing all work:

```text
1. Add pyxis-types and RTK Query foundation.
2. Extract CSS for canonical public components.
3. Resolve public component taxonomy.
4. Re-run component visual parity checks.
5. Wire real pyxis-user-site pages to canonical public components.
6. Begin page-level visual comparisons.
```

Why this order matters:

- RTK Query stabilizes where page data comes from.
- `pyxis-types` stabilizes the shape of page data and component props.
- CSS extraction stabilizes the component styling contract.
- Page-level visual work should not begin while both data hooks and component styling contracts are in flux.

---

## 19. Quick-start for an intern

1. Read this whole document.
2. Run:

```bash
rg "style=\{\{" web/packages/pyxis-components/src/public -g'*.tsx'
rg "#[0-9A-Fa-f]{3,6}|rgba?\(" web/packages/pyxis-components/src/public -g'*.tsx'
```

3. Pick one Batch 1 component.
4. Create its CSS file.
5. Move only static styles first.
6. Run:

```bash
cd web
pnpm --filter pyxis-components typecheck
```

7. Run the matching `css-visual-diff` config.
8. Commit only that batch.
9. Repeat.

Do not start with `BookingForm`. Start with a small display component so the pattern is clear before touching form and state-heavy components.
---

## 20. Alignment with the React Modular Themable Storybook skill

This guide intentionally adapts the `react-modular-themable-storybook` skill to Pyxis-specific conventions. The skill uses generic names such as `data-widget` and `data-part`; this repository already has a more specific helper:

```tsx
pyxisPart('show-tile', 'title')
```

which renders:

```html
data-pyxis-component="show-tile" data-pyxis-part="title"
```

For this repository, `data-pyxis-component` is the widget/root identifier and `data-pyxis-part` is the stable part selector. Do not introduce a parallel `data-part` system unless the team explicitly chooses to replace the existing helper.

### 20.1 Styling layers

Use four layers, from least specific to most specific:

```text
Layer 1 — base component CSS
  Per-component files such as ShowTile.css. These define layout, default spacing, typography roles, focus behavior, and structural states.

Layer 2 — global Pyxis tokens
  tokens.css defines colors, fonts, spacing, radii, shadows, focus rings, and motion.

Layer 3 — component-local CSS variables
  Component variables such as --pyxis-show-tile-bg or --pyxis-ticket-stub-border provide a narrow override surface. They should default to global tokens.

Layer 4 — consumer/theme overrides
  App, Storybook, or downstream package overrides scoped by data-theme, className, or data-pyxis selectors.
```

Example:

```css
:where([data-pyxis-component='show-tile'][data-pyxis-part='root']) {
  --pyxis-show-tile-bg: var(--color-surface);
  --pyxis-show-tile-border: var(--color-border);

  background: var(--pyxis-show-tile-bg);
  border: 1px solid var(--pyxis-show-tile-border);
}

[data-theme='poster-night'] {
  --pyxis-show-tile-bg: var(--color-ink);
  --pyxis-show-tile-border: var(--color-accent);
}
```

### 20.2 Low-specificity selector rule

Prefer `:where(...)` for root/part selectors when adding new CSS because it keeps consumer overrides easy:

```css
:where([data-pyxis-component='ticket-stub'][data-pyxis-part='root']) {
  background: var(--pyxis-ticket-stub-bg, var(--color-surface));
}
```

Avoid deep descendant selectors and avoid `!important`. If an override seems to require `!important`, the component probably needs a better component-local CSS variable or part selector.

### 20.3 `unstyled` mode decision

The skill recommends an `unstyled` mode. For Pyxis, make this an explicit decision rather than adding it blindly to every component.

Recommended near-term decision:

```text
Canonical public components self-import base CSS for predictable app and Storybook behavior.
`unstyled` mode is deferred until a concrete consumer needs raw markup without Pyxis base styles.
Data-pyxis part selectors must still be present so consumers can override styles today.
```

If the team chooses to implement `unstyled`, use this API shape consistently:

```tsx
export type TicketStubProps = {
  className?: string;
  unstyled?: boolean;
};
```

Then root classes should be conditional while `data-pyxis` attributes remain unconditional:

```tsx
<article
  className={clsx(!unstyled && 'pyxis-ticket-stub', className)}
  {...pyxisPart('ticket-stub')}
>
```

Do not skip `data-pyxis` attributes in unstyled mode; they are part of the public contract.

### 20.4 Slots and renderers

CSS controls visual presentation. Slots/renderers control structure. Do not add render props everywhere, but review canonical components for likely extension points.

Good candidates:

| Component | Possible extension point | Why |
| --- | --- | --- |
| `ShowTile` | `renderPoster`, `actions` | Different pages may need different poster or CTA treatment. |
| `ShowGrid` | `renderShow` | Lets an app use custom tiles while preserving grid layout. |
| `ArchiveShowList` | `renderRow` | Lets archive pages alter row content without rewriting list layout. |
| `PublicPageHeader` | `actions`, `eyebrow` | Page headers often need custom CTA/actions. |
| `BookingForm` | `footer`, `renderSuccess`, `renderError` | Form flows often need app-specific messaging. |

Example future API:

```tsx
<ShowTile
  show={show}
  renderPoster={(show) => <Poster show={show} variant="large" />}
  actions={<a href={`/shows/${show.id}`}>Details</a>}
/>
```

Only add these APIs when a concrete page or Storybook story needs them. Keep additions optional and backward-compatible.

### 20.5 Storybook expectations from the skill

For mature canonical components, Storybook should eventually include:

1. default story,
2. theme override story using CSS variables,
3. narrow/mobile story if layout changes,
4. long-content/overflow story,
5. unstyled story only if `unstyled` is implemented,
6. custom slot/renderer story only if the component exposes slots/renderers.

Theme override story pattern:

```tsx
export const CrimsonOnInk: Story = {
  render: (args) => (
    <div
      style={{
        '--pyxis-ticket-stub-bg': 'var(--color-ink)',
        '--pyxis-ticket-stub-border': 'var(--color-accent)',
        padding: 32,
      } as React.CSSProperties}
    >
      <TicketStub {...args} />
    </div>
  ),
};
```

### 20.6 Module and export checks

For every canonical public component:

- keep implementation in its own folder,
- keep CSS in that folder,
- import CSS from the component implementation,
- export the component from `web/packages/pyxis-components/src/public/index.ts`,
- export public prop types where useful,
- do not require consumers to import from private internal paths,
- document deprecated aliases or overlapping components before removal.

### 20.7 Skill-aligned definition of done

A component is skill-aligned when:

- it has a stable root component API,
- it has stable `data-pyxis-component` and minimal `data-pyxis-part` hooks,
- static visual styling lives in CSS,
- CSS uses global tokens and component-local variables,
- selectors are low-specificity and scoped,
- Storybook shows default and at least one theme override for mature/canonical components,
- optional slots/renderers are typed and demonstrated when present,
- accessibility and focus states are preserved,
- visual-diff results are checked after extraction.

