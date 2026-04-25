---
Title: ADR — Public component theming and CSS extraction contract
Ticket: PYXIS-RTK-TYPES-MIGRATION
Status: accepted
Topics:
  - frontend
  - react
  - css
  - theming
  - storybook
  - pyxis
DocType: design-doc
Intent: long-term
Summary: Architecture decision record for the public component styling contract after B2-B7 CSS extraction.
LastUpdated: 2026-04-24T00:00:00Z
---

# ADR — Public Component Theming and CSS Extraction Contract

## Status

Accepted for the next phase of Pyxis public component work.

This ADR documents the styling architecture used during the public component CSS extraction pass and should guide future component cleanup, page wiring, and Storybook additions.

## Context

The public-site parity work produced a broad inventory of React components under:

```text
web/packages/pyxis-components/src/public
```

Many were initially created as parity/discovery components with large static JSX `style={{ ... }}` blocks. That was useful for moving quickly against prototype screenshots, but it was not a durable component-library architecture.

The desired package direction is:

```text
modular React components
+ stable public props
+ stable part selectors
+ tokenized CSS
+ Storybook coverage
+ visual-diff regression checks
```

The `react-modular-themable-storybook` skill recommends:

- stable `data-*` styling parts,
- CSS variables/tokens,
- low-specificity selectors,
- default/theme/variant Storybook stories,
- optional `unstyled` and slot/render APIs where warranted.

Pyxis already has a repo-specific selector helper:

```text
web/packages/pyxis-components/src/utils/parts.ts
```

which emits:

```html
data-pyxis-component="..."
data-pyxis-part="..."
```

## Decision

### 1. Use `data-pyxis-component` and `data-pyxis-part` as the public styling contract

Do not introduce a parallel generic `data-widget` / `data-part` system.

Use:

```tsx
<div {...pyxisPart('show-tile')}>
<div {...pyxisPart('show-tile', 'title')}>
```

This renders stable selectors for:

- visual regression probes,
- CSS overrides,
- Storybook demo styling,
- downstream app theming.

### 2. Use one CSS file per canonical public component

Each canonical public component should have:

```text
ComponentName/
  ComponentName.tsx
  ComponentName.css
  ComponentName.stories.tsx
  index.ts
```

The component implementation should import its CSS directly:

```ts
import './ComponentName.css';
```

This makes components self-contained when imported by Storybook or the user-site package.

### 3. Static visual styles belong in CSS, not JSX

Move these out of JSX:

- layout (`display`, `grid`, `flex`, `gap`, `padding`, `margin`),
- typography,
- colors,
- borders,
- radii,
- focus states,
- disabled states,
- repeated subpart styles.

Keep inline styles only when they are truly dynamic. Current accepted dynamic cases:

- `ShowMetaStrip`: `gridTemplateColumns` depends on `items.length`.
- `ShowTile`: ticket-pill CSS variables depend on `show.kind`.
- `Poster`: artwork CSS variables depend on poster kind and ratio.
- Storybook stories/fixtures: wrapper widths and theme override variables.

### 4. Use four styling layers

```text
Layer 1 — base component CSS
  Per-component CSS files. Own layout, base typography, focus/disabled behavior.

Layer 2 — global Pyxis tokens
  tokens.css defines color, font, spacing, radius, shadow, focus, and motion tokens.

Layer 3 — component-local CSS variables
  Component-specific variables such as --pyxis-show-tile-title-color.
  These default to global tokens or prototype fallback values.

Layer 4 — consumer/theme overrides
  Storybook, app pages, or downstream consumers override component variables via wrapper scope.
```

Example:

```css
:where([data-pyxis-component='show-tile'][data-pyxis-part='root']) {
  --pyxis-show-tile-title-color: var(--color-accent);
  color: var(--pyxis-show-tile-title-color);
}
```

Storybook override:

```tsx
<div style={{ '--pyxis-show-tile-title-color': 'var(--color-text-primary)' } as CSSProperties}>
  <ShowTile show={show} />
</div>
```

### 5. Prefer low-specificity selectors

Use `:where(...)` for new part selectors:

```css
:where([data-pyxis-component='ticket-stub'][data-pyxis-part='root']) {}
```

Avoid:

- deep descendant chains,
- `nth-child` for semantic styling,
- `!important`,
- styling by private wrapper implementation shape.

### 6. Defer `unstyled` mode

Do not add `unstyled` to every component now.

Reason:

- Pyxis currently needs predictable visual components for app/page wiring.
- No concrete consumer currently requires unstyled primitives.
- Adding `unstyled` everywhere increases API surface and test burden.

If future consumers need it, add it consistently:

```ts
export type ComponentProps = {
  unstyled?: boolean;
};
```

Even in `unstyled` mode, components must still render `data-pyxis-component` and `data-pyxis-part` attributes.

### 7. Add slots/renderers only when concrete usage demands them

Do not add render props everywhere during CSS extraction.

Candidates for future extension APIs:

- `ShowTile`: `renderPoster`, `actions`.
- `ShowGrid`: `renderShow`.
- `ArchiveShowList`: `renderRow`.
- `PublicPageHeader`: `actions`, `eyebrow`.
- `BookingForm`: `footer`, `renderSuccess`, `renderError`.

Rule:

```text
CSS controls visuals. Slots/renderers control structure. Add structural extension points only when a page or story proves the need.
```

## Consequences

### Positive

- Public components are more maintainable.
- Components have stable selector contracts for visual-diff and downstream theming.
- Storybook can demonstrate theme overrides with CSS variables.
- Future app pages can consume components without inheriting large inline style blobs.
- Visual parity can be re-run after styling refactors.

### Negative / trade-offs

- CSS files still contain some hardcoded prototype fallback values.
- Some components now expose many part names that should remain stable.
- Self-imported CSS makes fully unstyled consumption harder until an explicit `unstyled` API exists.
- Residual visual diffs remain for several components; CSS extraction was not always visual tuning.

## Validation performed

The extraction pass ran:

```bash
cd web && pnpm --filter pyxis-components typecheck
cd web && pnpm -r typecheck
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/molecules
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/organisms
```

All completed successfully.

## Follow-up

1. Token-hardening pass:
   - replace component CSS hex fallbacks with global tokens where visual parity permits.
2. Taxonomy ADR:
   - decide overlapping public components.
3. Visual tuning pass:
   - prioritize high residual diffs.
4. Optional future `unstyled` support:
   - only if a consumer needs it.
