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

Organism targets currently needing a follow-up pass:

```text
modal-default — header/body 0.0000%; panel 1.2820%; footer 1.9902%
```
