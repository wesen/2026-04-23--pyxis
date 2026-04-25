# Bottom-Up Component Visual Parity

This playbook is the daily entrypoint for comparing Pyxis prototype components against the React/Storybook implementation with `css-visual-diff`.

## Principle

Compare small things before large things:

```text
atoms → molecules → organisms → public components → sections → pages
```

Page diffs are only useful after the components inside those pages are trustworthy.

## Key files

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
prototype-design/visual-diff/comparisons/component-system/atoms/*.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/*.css-visual-diff.yml
prototype-design/visual-diff/scripts/fixtures/atom-fixture-prepare.js
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx
web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx
```

Generated output goes under `prototype-design/visual-comparisons/` and should not be committed.

## What the parity map is

The parity map is the source-of-truth queue/inventory for component parity pairs:

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Each entry records:

- component level, name, state, and status,
- prototype source HTML, prepare script, and selectors,
- Storybook story id and selectors,
- comparison config, output directory, and report path,
- current pixel/CSS result, confidence, notes, and accepted differences.

Use it to decide what to run next and to record the verdict after each run.

## Run Storybook

Use the real Storybook dev server so changes auto-refresh. Do not rebuild static Storybook and serve it with Python during the normal edit/compare loop.

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis

tmux new-session -d -s pyxis-components-storybook \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-components storybook'

tmux capture-pane -pt pyxis-components-storybook -S -80
```

If the session already exists:

```bash
tmux send-keys -t pyxis-components-storybook C-c \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-components storybook' Enter
```

The prototype HTML server still needs to be available at `localhost:7070`.

## Add a comparison pair

1. Add matching fixture state to the prototype prepare script.
2. Add matching fixture state to the Storybook diff fixture.
3. Give both sides the same logical wrapper, for example:

```html
data-comp="card-default"
```

4. Use side-specific internal selectors for CSS probes when the DOM shape differs.
5. Add a YAML config under the correct level directory.
6. Add or update the parity-map entry.

## Inspect-first workflow

Do not run the full comparison until these are valid.

### 1. DOM exists

```bash
css-visual-diff html \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml \
  --side original \
  --root \
  --output-file /tmp/card-original-root.html
```

### 2. Screenshot crops are correct

```bash
css-visual-diff screenshot \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml \
  --side original \
  --section component \
  --output-file /tmp/card-original.png

css-visual-diff screenshot \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml \
  --side react \
  --section component \
  --output-file /tmp/card-react.png
```

Use the `read` tool to look at screenshots directly.

### 3. CSS probes are meaningful

```bash
css-visual-diff css-md \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml \
  --side original \
  --style root \
  --output-file /tmp/card-original-css.md
```

A CSS diff is evidence, not a verdict. If the React implementation splits padding into a body wrapper while pixels match, record that as an accepted implementation-shape difference instead of blindly rewriting code.

### 4. Full deterministic run

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

Review:

```text
capture.md
cssdiff.md
matched-styles.md
pixeldiff.md
index.html
original-*.png
react-*.png
pixeldiff_*_diff_comparison.png
pixeldiff_*_diff_only.png
```

## Update results

After each validated comparison:

1. Update `component-parity-map.json` with status, pixel diff, CSS diff, notes, and accepted differences.
2. Update the ticket diary with exact commands and failures.
3. Run typecheck if React/Storybook source changed:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

## Current known-good targets

Atoms currently accepted at `0.0000%` pixel diff:

```text
button-primary
badge-confirmed
tag-default
input-search
select-status
avatar-md
icon-calendar
icon-button
textarea-notes
```

Accepted molecule targets currently at `0.0000%` pixel diff:

```text
card-default
field-default
field-error
stat-default
empty-cta
```

Accepted organism targets currently at `0.0000%` pixel diff:

```text
topbar-default
```

Molecule targets currently wired but needing a future parity pass:

```text
card-head-default — config/report exists; not tuned yet
log-row-default — config/report exists; now compared to a prototype show-detail lineup row; CSS still needs future alignment
table-default — config/report exists; not tuned yet
```

Organism targets currently needing a follow-up pass:

```text
modal-default — header/body 0.0000%; panel 1.2820%; footer 1.9902%
```

## CSS extraction and theming workflow

When a prototype-matched React component still has static JSX `style={{ ... }}` blocks, treat cleanup as two separate passes.

```text
Pass 1 — architecture extraction
  Move static styles from JSX to Component.css.
  Add or preserve data-pyxis part selectors.
  Preserve exact visual values unless a task explicitly asks for tuning.
  Add Storybook default/narrow/theme stories.
  Re-run the matching visual-diff config.

Pass 2 — token hardening and visual tuning
  Replace component CSS hex fallbacks with global tokens where parity allows.
  Tune residual pixel diffs.
  Update accepted statuses and accepted differences.
```

Do not combine these passes unless the component is tiny. Token substitution can create visual drift, so first preserve behavior and pixels, then improve token purity.

### Component CSS pattern

Prefer one CSS file per canonical public component:

```text
web/packages/pyxis-components/src/public/Component/Component.tsx
web/packages/pyxis-components/src/public/Component/Component.css
web/packages/pyxis-components/src/public/Component/Component.stories.tsx
```

Import CSS from the component implementation:

```ts
import './Component.css';
```

Use the existing Pyxis part contract:

```tsx
<div className={clsx('pyxis-show-tile', className)} {...pyxisPart('show-tile')}>
  <h3 {...pyxisPart('show-tile', 'title')}>...</h3>
</div>
```

This emits:

```html
data-pyxis-component="show-tile" data-pyxis-part="root"
data-pyxis-component="show-tile" data-pyxis-part="title"
```

Do not introduce a parallel generic `data-part` system.

### CSS selector guidance

Prefer low-specificity part selectors:

```css
:where([data-pyxis-component='show-tile'][data-pyxis-part='root']) {
  --pyxis-show-tile-title-color: var(--color-accent);
}

:where([data-pyxis-component='show-tile'][data-pyxis-part='title']) {
  color: var(--pyxis-show-tile-title-color);
}
```

Avoid deep selectors and `!important`. If an override needs `!important`, add a better part selector or component-local CSS variable.

### Remaining inline styles that are acceptable

After extraction, static layout/typography/color styles should not remain in component JSX. These inline styles are acceptable:

- Storybook wrapper width/layout styles.
- Visual-diff fixture wrapper styles.
- Dynamic CSS variables, for example:
  - `ShowMetaStrip` dynamic `gridTemplateColumns` from `items.length`,
  - `ShowTile` ticket-pill variables from `show.kind`,
  - `Poster` artwork variables from poster kind/ratio.

Classify remaining inline styles with:

```bash
rg "style=\{\{" web/packages/pyxis-components/src/public -g'*.tsx'
```

### Storybook theming stories

For canonical public components, add at least a default story and one representative theme override story. Use component variables directly so the story documents the theming API:

```tsx
export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        '--pyxis-ticket-stub-bg': 'var(--color-ink)',
        '--pyxis-ticket-stub-title-color': 'var(--color-text-inverse)',
      } as React.CSSProperties}
    >
      <TicketStub {...args} />
    </div>
  ),
};
```

Add narrow/long-content/submitting stories where relevant.

Do not add `unstyled` stories unless the component actually implements an `unstyled` prop.
Do not add slot/renderer stories unless the component actually exposes slots/renderers.

### Directory-level validation after a batch

For a batch of public components, run the React checks first:

```bash
cd web && pnpm --filter pyxis-components typecheck
cd web && pnpm -r typecheck
```

The old native component config directories under `prototype-design/visual-diff/comparisons/component-system/**` are retired inputs. Use them only when intentionally mining historical component evidence during cleanup. Do not create new native `*.css-visual-diff.yml` configs for Pyxis work.

For page-level public-site validation, use the JS-canonical visual suite instead:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
rm -rf prototype-design/visual-comparisons/cssvd-js
```

Use semantic diagnostics before tuning a large page diff:

```bash
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
rm -rf prototype-design/visual-comparisons/cssvd-js
```

### Updating the parity map after CSS extraction

For extracted public components, add or update a `styleArchitecture` object in:

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Example:

```json
"styleArchitecture": {
  "cssExtraction": "complete",
  "cssFile": "web/packages/pyxis-components/src/public/ShowTile/ShowTile.css",
  "selectorContract": "data-pyxis-component + data-pyxis-part",
  "storybookThemeCoverage": "representative theme/narrow variants added or verified",
  "validated": "2026-04-25 pyxis JS visual suite or component-specific migrated visual spec rerun"
}
```

If a component is intentionally deferred because of taxonomy overlap, record that too:

```json
"styleArchitecture": {
  "cssExtraction": "deferred",
  "reason": "pending public component taxonomy decision versus ShowTile/ShowGrid and ArchiveShowRow"
}
```

### Tooling improvement wishlist

The CSS extraction pass showed several useful future improvements for `css-visual-diff`:

- richer `compare-spec` summary modes for component-level migrated visual suites.
- selector-scope warnings when original and React selectors have very different dimensions.
- React-before vs React-after baseline mode for refactor-safety checks.
- first-class part-selector validation.
- artifact-based LLM review that summarizes existing `run` outputs instead of recapturing evidence.
