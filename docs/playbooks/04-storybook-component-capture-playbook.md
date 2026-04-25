---
Title: Storybook Component Capture Playbook
Status: active
Topics:
  - frontend
  - storybook
  - css-visual-diff
  - visual-regression
  - component-system
DocType: playbook
Intent: how-to
Summary: How to create Storybook components and extract focused widget screenshots/CSS artifacts for prototype comparison.
LastUpdated: 2026-04-24T00:00:00Z
---

# Storybook Component Capture Playbook

> [!warning] Deprecated capture workflow
> This playbook documents the historical Storybook catalog/native-config capture workflow. The generated config tree and catalog outputs now live under `prototype-design/-deprecated/`. Active public-page validation uses `prototype-design/visual-diff/userland/`. Component-level JS visual suites can be rebuilt later if needed.

This playbook explains how to create Storybook-ready Pyxis components and extract focused screenshots with `css-visual-diff`. The goal is not to screenshot the Storybook canvas. The goal is to screenshot the meaningful widget: the button, badge, card, venue card, booking form, or page shell that will later be compared with a prototype baseline.

The rule is simple:

```text
Storybook may wrap the component.
The component must still expose a stable capture target.
```

That stable target is the Pyxis part contract.

---

## 1. The selector contract

Every reusable component root must expose:

```html
data-pyxis-component="<component-slug>"
data-pyxis-part="root"
```

Examples:

```html
<button data-pyxis-component="button" data-pyxis-part="root">
<span data-pyxis-component="badge" data-pyxis-part="root">
<div data-pyxis-component="input" data-pyxis-part="root">
<div data-pyxis-component="venue-card" data-pyxis-part="root">
```

Use the helper:

```ts
import { pyxisPart } from '../../utils/parts';

<button {...pyxisPart('button')}>Get tickets</button>
<span {...pyxisPart('badge')}>Confirmed</span>
```

Internal parts use the same component name and a specific part name:

```tsx
<span {...pyxisPart('badge', 'indicator')} />
<span {...pyxisPart('badge', 'label')}>{children}</span>
<input {...pyxisPart('input', 'control')} />
```

This selector contract belongs to the component API. Do not treat it as test-only noise. It is how screenshots, visual diffs, Playwright tests, and future theme tooling find the actual widget.

---

## 2. Why broad selectors fail

A Storybook story often renders wrappers around the component:

```html
<div id="storybook-root">
  <div>                         <!-- story wrapper -->
    <div>                       <!-- layout wrapper -->
      <span data-pyxis-component="badge" data-pyxis-part="root">
        Confirmed
      </span>
    </div>
  </div>
</div>
```

The broad selector:

```css
#storybook-root > *:first-child
```

captures the wrapper. For `Badge`, that produced a huge screenshot. The correct capture selector is:

```css
#storybook-root [data-pyxis-component="badge"][data-pyxis-part="root"]
```

The difference is the difference between comparing a widget and comparing a canvas.

---

## 3. How to write a component for capture

A minimal atom should look like this:

```tsx
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ status, children, className }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx('pyxis-badge', className)}
        {...pyxisPart('badge')}
      >
        <span {...pyxisPart('badge', 'indicator')} aria-hidden />
        <span {...pyxisPart('badge', 'label')}>{children}</span>
      </span>
    );
  }
);
```

A composed field should expose the whole field as the root, and the control as an internal part:

```tsx
<div className="pyxis-field" {...pyxisPart('input')}>
  <label {...pyxisPart('input', 'label')}>Artist name</label>
  <input {...pyxisPart('input', 'control')} />
  <span {...pyxisPart('input', 'hint')}>Optional hint</span>
</div>
```

The root is what the first screenshot should capture. Internal parts are optional later probes.

---

## 4. How to write stories for capture

Single-widget stories can render the component directly:

```tsx
export const Default = {
  render: () => <Badge status="confirmed" />,
};
```

The capture generator can infer:

```css
#storybook-root [data-pyxis-component="badge"][data-pyxis-part="root"]
```

Variant-grid stories should eventually use a story frame:

```tsx
<StoryFrame
  id="atoms-badge-all-statuses"
  domain="generic"
  level="atom"
  component="badge"
>
  <Badge status="confirmed" />
  <Badge status="pending" />
  <Badge status="declined" />
</StoryFrame>
```

The story frame should render:

```html
data-pyxis-story-root
data-pyxis-story-id="atoms-badge-all-statuses"
data-pyxis-domain="generic"
data-pyxis-level="atom"
data-pyxis-component="badge"
```

Then the capture target is the fixture root rather than one child badge.

---

## 5. Generate Storybook capture configs

Run:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
node prototype-design/-deprecated/visual-diff-scripts/18-generate-storybook-design-system-configs.mjs
```

The generator reads:

```text
web/packages/pyxis-components/storybook-static/index.json
```

and writes configs under:

```text
prototype-design/-deprecated/visual-diff-native-configs/storybook-components/
```

Each config has two initial probes:

```yaml
styles:
  - name: story-root
    selector: '#storybook-root'

  - name: capture-target
    selector: '#storybook-root [data-pyxis-component="button"][data-pyxis-part="root"]'
```

`story-root` is context. `capture-target` is the comparison image.

---

## 6. Run a focused sample first

Do not run the full catalog while changing the selector contract. Use the atom sample:

```bash
prototype-design/-deprecated/visual-diff-scripts/19-run-storybook-atoms-sample.sh
```

The sample writes generated artifacts under:

```text
prototype-design/-deprecated/generated-output/storybook-catalog/sample-atoms/
```

Inspect screenshots with the image-capable `read` tool. Good files to check:

```text
prototype-design/-deprecated/generated-output/storybook-catalog/sample-atoms/atoms/badge/default/capture-target/screenshot.png
prototype-design/-deprecated/generated-output/storybook-catalog/sample-atoms/atoms/button/default/capture-target/screenshot.png
prototype-design/-deprecated/generated-output/storybook-catalog/sample-atoms/atoms/input/default/capture-target/screenshot.png
prototype-design/-deprecated/generated-output/storybook-catalog/sample-atoms/atoms/avatar/default/capture-target/screenshot.png
prototype-design/-deprecated/generated-output/storybook-catalog/sample-atoms/atoms/icon/default/capture-target/screenshot.png
```

A good Badge capture is badge-sized. A bad Badge capture is viewport-sized.

---

## 7. Validate before comparing with prototypes

For each new component or story, check:

- The root emits `data-pyxis-component` and `data-pyxis-part="root"`.
- The Storybook story renders the intended state.
- `story-root` shows the full story context.
- `capture-target` is tightly scoped to the widget or intentional fixture.
- The PNG is visually meaningful, not blank and not a Storybook wrapper.
- The `computed-css.md` file contains CSS for the intended element.

Only after this is true should you compare against prototype baselines.

---

## 8. Run the full Storybook catalog

After a focused sample passes, build the full implementation catalog:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
pnpm --dir web --filter pyxis-components build-storybook
node prototype-design/-deprecated/visual-diff-scripts/18-generate-storybook-design-system-configs.mjs
prototype-design/-deprecated/visual-diff-scripts/20-run-storybook-catalog-full.sh
```

The full runner reads `prototype-design/-deprecated/generated-output/storybook-catalog/manifest.json`, runs every generated config, and then rebuilds:

```text
prototype-design/-deprecated/generated-output/storybook-catalog/index.html
```

Serve the catalog with:

```bash
prototype-design/-deprecated/visual-diff-scripts/22-serve-storybook-catalog-index.sh
```

Then open:

```text
http://localhost:8796/prototype-design/-deprecated/generated-output/storybook-catalog/index.html
```

You can limit the full runner to one group while developing:

```bash
PYXIS_STORYBOOK_CATALOG_GROUP=molecules prototype-design/-deprecated/visual-diff-scripts/20-run-storybook-catalog-full.sh
PYXIS_STORYBOOK_CATALOG_GROUP=public prototype-design/-deprecated/visual-diff-scripts/20-run-storybook-catalog-full.sh
```

## 9. Mapping to prototype baselines

Once the Storybook capture is trustworthy, map it to the prototype baseline.

Examples:

```text
prototype Foundations buttons card
  ↔ Storybook Button / All Variants or Button / Default

prototype Foundations badges/tags card
  ↔ Storybook Badge / All Statuses and Tag / Genre Tags

prototype public venue/space info section
  ↔ Storybook VenueCard or SpaceInfo
```

Direct visual comparison works only if both sides are scoped to equivalent objects. A badge should compare to a badge, not to a Storybook story wrapper.

---

## 10. Running prototype-vs-Storybook comparisons

For repeatable parity work, prefer YAML-driven `css-visual-diff run` configs over the low-level `compare` flags. The YAML path supports prototype prepare hooks, side-specific selectors, CSS probes, pixel diffs, and HTML reports.

Use this inspect-first sequence for every new pair:

```bash
css-visual-diff screenshot --config <config.yml> --side original --section <section> --output-file /tmp/original.png
css-visual-diff screenshot --config <config.yml> --side react --section <section> --output-file /tmp/react.png
css-visual-diff css-md --config <config.yml> --side original --style root --output-file /tmp/original-css.md
css-visual-diff css-md --config <config.yml> --side react --style root --output-file /tmp/react-css.md
```

Only then run:

```bash
css-visual-diff run --config <config.yml> --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

Two workflow details are now validated from atom iterations:

- `output.dir` in YAML is resolved relative to the config file directory. Use an absolute output path while hand-authoring Pyxis comparison configs, or generate repo-root-aware paths.
- CSS property lists must be component-aware. Auto-sized inline components can render pixel-perfect while computed `width`, `height`, or `box-sizing` differ. Use `include_bounds: true` for geometry evidence and compare visual properties such as padding, gap, typography, color, background, border, and radius unless fixed dimensions are part of the component contract.

---

## 11. Public-site component capture

Public-site components use the same selector contract as design-system components:

```tsx
<section {...pyxisPart('pub-hero')}>…</section>
<nav {...pyxisPart('pub-nav')}>…</nav>
<div {...pyxisPart('venue-card')}>…</div>
```

The catalog generator includes `Public/*` stories and writes configs under:

```text
prototype-design/-deprecated/visual-diff-native-configs/storybook-components/public/
```

These captures are the bridge between the implementation catalog and the prototype source of truth:

```text
prototype-design/-deprecated/screenshots-and-imports/Pyxis Public Site.html
prototype-design/-deprecated/generated-output/baseline/artifacts/public/...
```

Do public-site comparison in this order:

1. Verify each public component has a focused Storybook `capture-target`.
2. Find the closest prototype component baseline in `prototype-design/-deprecated/generated-output/baseline/`.
3. Compare equivalent scopes first, such as PubNav ↔ prototype nav, VenueCard/SpaceInfo ↔ prototype space info, BookingForm ↔ prototype booking form.
4. Only then compare full public pages.

## 12. Common mistakes

Do not use `#storybook-root > *:first-child` as the primary comparison target for single-widget stories. It is a fallback, not a contract.

Do not add unnamespaced `data-part` attributes. The canonical selector API is:

```text
data-pyxis-component
data-pyxis-part
```

Do not run page-level comparisons before validating component-level captures. Page screenshots are noisy and hide root causes.

Do not trust screenshot dimensions alone. Use `read` to visually inspect representative PNGs.

---

## 13. Checklist for a new component

When adding a component that should be captured:

1. Add `pyxisPart('<component-slug>')` to the root.
2. Add named internal parts for important sub-elements.
3. Add or update Storybook stories.
4. Rebuild Storybook if static output is stale.
5. Regenerate visual-diff configs.
6. Run a targeted sample.
7. Inspect `capture-target/screenshot.png` with `read`.
8. Only then add broader catalog or prototype comparison tasks.

This keeps the visual catalog reliable and makes future prototype-vs-Storybook comparisons much easier to trust.
