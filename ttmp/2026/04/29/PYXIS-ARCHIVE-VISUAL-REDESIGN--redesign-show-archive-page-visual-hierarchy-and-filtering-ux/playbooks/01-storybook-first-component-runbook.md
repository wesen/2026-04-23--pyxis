---
Title: Storybook-first component runbook with css-visual-diff screenshots
Ticket: PYXIS-ARCHIVE-VISUAL-REDESIGN
Status: active
Topics:
  - frontend
  - staff-app
  - storybook
  - design-system
DocType: playbook
Intent: long-term
Owners: []
RelatedFiles:
  - web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.stories.tsx
  - web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.css
  - web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogPanel/PostShowLogPanel.stories.tsx
Summary: "Repeatable runbook for adding new Pyxis app components via Storybook-first development, css-visual-diff screenshot capture, image inspection, and ticket evidence."
LastUpdated: 2026-04-29T13:35:00-04:00
WhatFor: "Use when creating a new component or organism that does not have an existing standalone prototype target."
WhenToUse: "Use for Storybook-first component design, modal/form tuning, staff-app organism work, and new-component visual baselines."
---

# Storybook-first component runbook with css-visual-diff screenshots

## Purpose

Use this runbook when adding a new Pyxis React component, especially when there is no standalone prototype HTML screen to compare against. In that case, the workflow is not prototype parity. The workflow is **Storybook-first visual definition**: build the component in Storybook, capture screenshots, inspect them, tune the component, and save the approved screenshots as the first visual baseline.

This is the workflow used for the ShowLog `PostShowLogEditorModal` and `PostShowLogPanel` work.

## Core principle

A new component needs three things before it should be considered stable:

1. **A component API** that is small and understandable.
2. **Storybook states** that show its important visual and behavioral variants.
3. **Screenshot evidence** saved under the ticket so future work has a visual reference.

If there is no prototype, do not invent one just to satisfy visual-diff tooling. Use Storybook as the source of truth.

## Directory pattern

For a molecule:

```text
web/packages/pyxis-app/src/components/molecules/ComponentName/
  ComponentName.tsx
  ComponentName.css
  ComponentName.stories.tsx
  index.ts
```

For an organism family, create a domain folder like `Shows/`, `ShowLog/`, `Bookings/`, or `Calendar/`:

```text
web/packages/pyxis-app/src/components/organisms/DomainName/ComponentName/
  ComponentName.tsx
  ComponentName.css
  ComponentName.stories.tsx
  index.ts

web/packages/pyxis-app/src/components/organisms/DomainName/index.ts
```

Export the domain folder from:

```text
web/packages/pyxis-app/src/components/organisms/index.ts
```

## Storybook title convention

Use the existing Pyxis App hierarchy.

Molecules:

```ts
const meta = {
  title: 'Pyxis App/Components/Molecules/StatusBadge',
  component: StatusBadge,
};
```

Organisms:

```ts
const meta = {
  title: 'Pyxis App/Components/Organisms/ShowLog/PostShowLogEditorModal',
  component: PostShowLogEditorModal,
};
```

Keep related components grouped under the same domain path. For example:

```text
Pyxis App/Components/Organisms/ShowLog/PostShowLogPanel
Pyxis App/Components/Organisms/ShowLog/PostShowLogEditorModal
```

## Development loop

### Step 1: Add the component skeleton

Create the `.tsx`, `.css`, `.stories.tsx`, and `index.ts` files.

Start with the minimum useful props. Avoid over-generalizing before the component has been used in a real page.

Example:

```tsx
export type StatusBadgeProps = {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
};
```

### Step 2: Add stable selectors

Use the app part selector helper:

```ts
import { appPart } from '../../parts';

<span {...appPart('status-badge')}>...</span>
```

This gives stable selectors for screenshots, tests, and future CSS review:

```html
data-pyxis-component="status-badge" data-pyxis-part="root"
```

For subparts:

```tsx
<div {...appPart('post-show-log-panel', 'table-wrap')}>
```

### Step 3: Add Storybook states early

Do not wait until the component is “done.” Storybook is the design workbench.

For a modal/form, include at least:

```text
Default / NeedsLog
Filled / Logged
Incident
ValidationError
Saving
Mobile if layout changes materially
```

For a table/panel, include:

```text
Mixed
Empty
Filtered / NeedsLogOnly
ExpandedDetails
EditModalOpen
Mobile
```

Use realistic fixture data. Avoid lorem ipsum if real domain phrases exist.

### Step 4: Typecheck before visual capture

Run:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```

Do this before screenshot work so you do not tune a broken story.

## Capturing screenshots with css-visual-diff

### Step 1: Find the Storybook story ID

If unsure, inspect Storybook's index:

```bash
curl -s http://localhost:6008/index.json > /tmp/pyxis-app-storybook-index.json
python3 - <<'PY'
import json
j=json.load(open('/tmp/pyxis-app-storybook-index.json'))
for story_id, entry in j.get('entries', {}).items():
    if 'showlog' in story_id.lower():
        print(story_id, '|', entry.get('title'), '|', entry.get('name'))
PY
```

Use the ID in an iframe URL:

```text
http://localhost:6008/iframe.html?id=<story-id>&viewMode=story
```

### Step 2: Create a ticket-local css-visual-diff config

Store configs under the active ticket `sources/` folder if they are evidence-specific:

```text
ttmp/.../sources/16-show-log-modal-form/post-show-log-editor-modal.css-visual-diff.yml
```

Minimal Storybook-only screenshot config:

```yaml
metadata:
  slug: pyxis-app-post-show-log-editor-modal
  title: PostShowLogEditorModal Storybook screenshot

original:
  name: storybook-reference-copy
  url: http://localhost:6008/iframe.html?id=pyxis-app-components-organisms-showlog-postshowlogeditormodal--needs-log&viewMode=story
  wait_ms: 1000
  viewport: { width: 1200, height: 820 }
  root_selector: body

react:
  name: storybook-current
  url: http://localhost:6008/iframe.html?id=pyxis-app-components-organisms-showlog-postshowlogeditormodal--needs-log&viewMode=story
  wait_ms: 1000
  viewport: { width: 1200, height: 820 }
  root_selector: body

sections:
  - name: modal
    selector_original: '[data-pyxis-component="post-show-log-editor-modal"]'
    selector_react: '[data-pyxis-component="post-show-log-editor-modal"]'

output:
  dir: ttmp/.../sources/16-show-log-modal-form/css-visual-diff
  write_json: true
  write_markdown: true
  write_pngs: true
  write_prepared_html: true
  write_inspect_json: true
  validate_pngs: true

modes: [capture]
```

For modals, if the panel selector is difficult because the modal is fixed-position or portaled, capturing the full dialog root can be more reliable:

```bash
css-visual-diff screenshot \
  --config path/to/config.yml \
  --side react \
  --selector '[data-pyxis-component=modal]' \
  --output-file path/to/modal.png
```

If that fails, first inspect HTML:

```bash
css-visual-diff html \
  --config path/to/config.yml \
  --side react \
  --root \
  --output-file /tmp/component-root.html

rg -n "post-show-log|modal|Your component title" /tmp/component-root.html
```

### Step 3: Capture the screenshot

Example:

```bash
css-visual-diff screenshot \
  --config ttmp/.../sources/16-show-log-modal-form/post-show-log-editor-modal.css-visual-diff.yml \
  --side react \
  --selector '[data-pyxis-component=modal]' \
  --output-file ttmp/.../sources/16-show-log-modal-form/post-show-log-editor-modal.png
```

### Step 4: Inspect the screenshot

There are two supported ways to inspect the image.

#### Option A: Use `understand_image`

Ask for focused feedback:

```text
Review this modal form screenshot for visual design quality. Focus on alignment, hierarchy, spacing, form layout, and anything that feels awkward or needs tuning.
```

This is useful for explicit critique and tuning suggestions.

#### Option B: Use the `read` tool directly on the PNG

The `read` tool supports images. You can open the PNG directly:

```text
read path/to/screenshot.png
```

This is useful when you want to look at the image yourself in the tool output, verify the crop, or compare against another screenshot without asking for AI analysis.

Use both when helpful:

- `read` to visually confirm the crop and obvious layout.
- `understand_image` to get targeted critique on alignment, spacing, hierarchy, or consistency.

## Tuning checklist

When reviewing screenshots, check these in order:

### Crop correctness

- Does the screenshot include the intended component?
- Is there too much surrounding Storybook canvas?
- Is the modal panel cropped or fully visible?
- Are fixed overlays/backdrops included intentionally?

### Layout hierarchy

- Is the primary title obvious?
- Are read-only context and editable controls visually distinct?
- Is the page/component doing too much for its intended scope?
- Does the component look like an atom/molecule/organism, or accidentally like a full page?

### Alignment

- Do labels and controls share a clear left edge?
- Are table columns aligned with headers?
- Are action buttons consistently placed?
- Are numeric fields appropriately sized?

### Spacing

- Are gaps between sections consistent?
- Is anything cramped?
- Is anything too airy compared to nearby components?
- Does mobile spacing still work?

### Visual weight

- Are badges too loud?
- Are borders too heavy?
- Are buttons too prominent for secondary actions?
- Does a form field look heavier than its importance?

### Interaction states

- Is disabled state readable?
- Is validation visible but not overwhelming?
- Does saving/loading state preserve layout?
- Does conditional UI appear only when needed?

## Tuning examples from ShowLog modal

Screenshot feedback found these issues:

- The draw input and incident checkbox were visually unbalanced.
- The incident notes field created unnecessary cognitive load when Incident was unchecked.
- The show notes block looked like a box inside a box.
- The action label `Save post-show log` was too long.
- The draw input was too wide for a short numeric value.

The fixes were:

- Move `PostShowLogEditorModal` into its own organism folder.
- Add dedicated modal CSS instead of keeping modal styles inside the panel CSS.
- Use a read-only context section with metadata and show notes.
- Put editable fields under a clear `Post-show report` section.
- Hide incident notes until Incident is checked.
- Shorten action text to `Save report`.
- Capture another screenshot and re-review.

## Evidence storage

For each component tuning pass, save evidence under the active ticket:

```text
ttmp/YYYY/MM/DD/TICKET--slug/sources/<number>-<component-name>/
```

Recommended files:

```text
component.css-visual-diff.yml
component-before.png
component-after.png
component-final.png
review-notes.md   # optional
```

Do not put temporary screenshots only in `/tmp` if they are part of the review trail. `/tmp` is fine for scratch captures, but final evidence belongs in `sources/`.

## Diary and tasks

Update the ticket diary after each meaningful tuning loop:

```text
reference/01-...-diary.md
```

Include:

- what component was changed;
- what screenshot was captured;
- what the visual feedback said;
- what tuning was performed;
- what validation command passed.

Update `tasks.md` when a component or visual baseline is complete.

## Commit rhythm

Commit at these boundaries:

1. **Planning/docs**: design guide, runbook, task updates.
2. **Scaffold**: component files, exports, initial stories.
3. **Visual tuning**: CSS changes plus screenshot evidence.
4. **Route integration**: page wiring, RTK Query/MSW, smoke scripts.

Avoid combining unrelated runtime artifacts into the commit. Do not commit local flyer uploads, binaries, or scratch files unless they are deliberate evidence under `sources/`.

## Final validation

At minimum, run:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```

For route-level or production-impacting changes, also run:

```bash
cd web/packages/pyxis-app && pnpm exec vite build
go test ./... -count=1
```

And for docmgr tickets:

```bash
docmgr doctor --ticket <TICKET-ID> --stale-after 30
```

## Quick checklist

- [ ] Component lives in the correct molecule/organism folder.
- [ ] Storybook title follows `Pyxis App/Components/...`.
- [ ] Important states are represented in stories.
- [ ] Stable `data-pyxis-component` selectors exist.
- [ ] `pnpm exec tsc --noEmit` passes.
- [ ] Screenshot captured with `css-visual-diff`.
- [ ] Screenshot inspected with `read`, `understand_image`, or both.
- [ ] Tuning notes saved in the diary.
- [ ] Evidence saved under `sources/`.
- [ ] Logical commit created without unrelated artifacts.
