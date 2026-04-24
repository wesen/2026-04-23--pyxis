---
Title: Diary
Ticket: PYXIS-COMPONENT-VISUAL-PARITY
Status: active
Topics:
    - frontend
    - storybook
    - css-visual-diff
    - visual-regression
    - prototype
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: .gitignore
      Note: Keeps generated comparison outputs out of git status
    - Path: docs/playbooks/04-storybook-component-capture-playbook.md
      Note: Validated comparison workflow notes from atom iterations
    - Path: prototype-design/visual-diff/comparisons/component-system/atoms/badge-confirmed.css-visual-diff.yml
      Note: Second atom comparison config and CSS prop-list adjustment
    - Path: prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml
      Note: First runnable atom comparison config
    - Path: prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml
      Note: Input search parity config
    - Path: prototype-design/visual-diff/comparisons/component-system/atoms/textarea-notes.css-visual-diff.yml
      Note: Textarea atom parity config
    - Path: prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
      Note: Initial atom parity map
    - Path: ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/10-atom-original-prepare.js
      Note: Prototype atom fixture extended with Textarea
    - Path: ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md
      Note: Guide updated with validated atom iteration corrections
    - Path: web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx
      Note: Storybook atom fixture extended with Textarea
    - Path: web/packages/pyxis-components/src/atoms/Input/Input.css
      Note: Input content-box sizing and icon positioning parity fix
    - Path: web/packages/pyxis-components/src/atoms/Input/Input.tsx
      Note: Input icon wrapper parity fix
    - Path: web/packages/pyxis-components/src/atoms/Textarea/Textarea.css
      Note: Textarea parity CSS fix
ExternalSources: []
Summary: Chronological implementation diary for bottom-up prototype-to-Storybook component visual parity work.
LastUpdated: 2026-04-24T00:00:00Z
WhatFor: ""
WhenToUse: ""
---





# Diary

## Goal

This diary records the implementation of the bottom-up Pyxis visual parity workflow: prototype baseline extraction, matching Storybook story setup, `css-visual-diff` comparison runs, React-side fixes, and playbook updates.

## Step 1: Add explicit atom iteration tasks

The parity ticket already contained the broad analysis guide and a first atom batch plan. I added explicit iteration tasks so we validate the workflow itself before applying it across larger parts of the component library.

This creates a narrow contract for the next work: prove one Button comparison, do a second atom comparison, then update the guide based on the real commands and failures rather than assumptions.

### Prompt Context

**User prompt (verbatim):** "Add tasks to do an iteration or two of this workflow for atoms, so that we can validate and update our playbook if necessary. Once we know that we have something that works well, we can start applying it to larger parts of our codebase.

Then work on the tasks on e by one, commit at appropriate intervals, keeping a diary as you work in this new ticket."

**Assistant interpretation:** Add concrete validation-loop tasks to the new visual parity ticket, then begin executing them one at a time with diary/changelog updates and focused commits.

**Inferred user intent:** Avoid scaling an unproven visual-diff workflow; first prove it on atoms and update the playbook with real-world corrections.

### What I did

- Created this diary document.
- Added iteration tasks for:
  - Button primary end-to-end comparison.
  - Badge confirmed or Tag default comparison.
  - Updating the guide/playbook after two iterations.

### Why

The previous guide was a plan. The new tasks force the plan through a real atom workflow and create a place to record friction in `css-visual-diff`, Storybook fixtures, selectors, or baseline extraction.

### What worked

- `docmgr doc add` created the diary.
- `docmgr task add` added the iteration tasks.

### What didn't work

N/A.

### What I learned

The ticket had no diary yet, so creating it first is the right way to make later workflow debugging reviewable.

### What was tricky to build

N/A for this bookkeeping step.

### What warrants a second pair of eyes

Task wording: confirm that Button primary plus Badge/Tag is the right first two-iteration scope.

### What should be done in the future

Start Task 2/7 by building the first atom parity map and then author the Button comparison config.

### Code review instructions

Review:

```text
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/tasks.md
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md
```

### Technical details

Commands used:

```bash
docmgr doc add --ticket PYXIS-COMPONENT-VISUAL-PARITY --doc-type reference --title "Diary"
docmgr task add --ticket PYXIS-COMPONENT-VISUAL-PARITY --text "Iteration 1 — Run Button primary prototype-vs-Storybook comparison end-to-end and update the playbook with any workflow corrections"
docmgr task add --ticket PYXIS-COMPONENT-VISUAL-PARITY --text "Iteration 2 — Run Badge confirmed or Tag default comparison end-to-end using the refined workflow"
docmgr task add --ticket PYXIS-COMPONENT-VISUAL-PARITY --text "After two atom iterations, update the parity guide with validated command sequence, known css-visual-diff limitations, and next batch recommendations"
```

## Step 2: Run Button primary parity comparison end to end

The first real parity iteration used the existing atom fixture as the matching surface for both prototype and Storybook. I created a hand-curated parity map and a focused Button primary comparison config, then inspected original and React sides independently before running the full comparison modes.

The result was a useful sanity check: Button primary is already pixel-perfect in this fixture, with 0% pixel difference and no CSS differences for the configured probes. The workflow itself exposed one important operational issue: relative `output.dir` values are resolved relative to the config file directory, not the repository root, so Pyxis comparison configs should use absolute output paths or carefully computed relative paths.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Execute the atom workflow one task at a time, beginning with a concrete Button comparison and recording any necessary playbook corrections.

**Inferred user intent:** Validate the atom comparison workflow against a real component before scaling.

### What I did

- Added `prototype-design/visual-diff/comparisons/component-system/component-parity-map.json`.
- Added `prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml`.
- Started/verified local prototype and Storybook static servers.
- Inspected prepared HTML roots for both sides.
- Inspected screenshots for both sides.
- Inspected CSS Markdown for both sides.
- Ran full deterministic modes: `capture`, `cssdiff`, `matched-styles`, `pixeldiff`, `html-report`.
- Added `.gitignore` entry for generated `prototype-design/visual-comparisons/` outputs.

### Why

The goal was to test the comparison loop on a known high-confidence atom pair before doing more components. Button primary in `AtomDiffFixture` is ideal because both prototype and Storybook render the same text, state, and icon.

### What worked

The inspect commands all succeeded:

```bash
css-visual-diff html --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml --side original --root --output-file /tmp/button-primary-original-root.html
css-visual-diff html --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml --side react --root --output-file /tmp/button-primary-react-root.html
css-visual-diff screenshot --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml --side original --section button --output-file /tmp/button-primary-original.png
css-visual-diff screenshot --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml --side react --section button --output-file /tmp/button-primary-react.png
css-visual-diff css-md --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml --side original --style root --output-file /tmp/button-primary-original-css.md
css-visual-diff css-md --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml --side react --style root --output-file /tmp/button-primary-react-css.md
```

The full run succeeded:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

Result:

```text
component: 0.0000% changed, 0/4148 pixels
button:    0.0000% changed, 0/4148 pixels
cssdiff:   no configured property differences
```

### What didn't work

The first comparison run wrote output under the config directory:

```text
prototype-design/visual-diff/comparisons/component-system/atoms/prototype-design/visual-comparisons/...
```

Cause: `output.dir: prototype-design/visual-comparisons/...` was interpreted relative to the YAML config file directory. I removed that accidental generated directory and changed the config to use an absolute output path:

```yaml
output:
  dir: /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-comparisons/component-system/atoms/button-primary
```

### What I learned

The YAML `run` workflow is the right path for Pyxis because it supports prepare hooks and side-specific selectors. For reusable comparison configs, output paths need special care. Absolute output paths are less portable but avoid surprising nested artifacts during early workflow validation.

### What was tricky to build

The tricky part was choosing between canonical `data-pyxis-*` selectors and the older `data-comp` fixture wrappers. For this first atom workflow, using `data-comp` as the comparison wrapper is appropriate because both sides expose the same fixture state. The React style probe still uses `data-pyxis-component` to make sure we are probing the actual implementation root.

### What warrants a second pair of eyes

- Whether committed comparison configs should use absolute output paths or a repo-root environment variable/generator later.
- Whether generated comparison outputs should stay ignored, with only summaries/manifests committed.

### What should be done in the future

- Update the guide after the second atom iteration to warn about `output.dir` resolution.
- Consider a small config generator so output paths are consistently absolute or correctly relative.

### Code review instructions

Start with:

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml
.gitignore
```

Validate with:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

### Technical details

Generated but ignored outputs are under:

```text
prototype-design/visual-comparisons/component-system/atoms/button-primary/
```

Key artifacts reviewed:

```text
cssdiff.md
pixeldiff.md
pixeldiff_button_diff_comparison.png
```

## Step 3: Run Badge confirmed parity comparison and update the guide

The second atom iteration reused the same atom fixture strategy for Badge confirmed. This gave us a better test than Button because the visual diff was perfect, but the first CSS probe list still reported differences for `box-sizing`, `width`, and `height`.

That turned into a useful workflow correction: for auto-sized inline widgets, computed `width` and `height` can differ because of `box-sizing` semantics even when the rendered pixels and visual bounds are identical. I adjusted the Badge config's CSS property list to focus on visual style properties and kept `include_bounds: true` for geometry evidence.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Complete a second atom comparison and update the implementation guide based on real workflow findings.

**Inferred user intent:** Validate that the parity process generalizes beyond Button before applying it to more components.

### What I did

- Added `prototype-design/visual-diff/comparisons/component-system/atoms/badge-confirmed.css-visual-diff.yml`.
- Inspected original and React badge screenshots.
- Inspected original and React computed CSS.
- Ran full modes: `capture`, `cssdiff`, `matched-styles`, `pixeldiff`, `html-report`.
- Updated the Badge CSS probe property list after identifying harmless auto-size computed CSS differences.
- Updated `component-parity-map.json` with accepted Button and Badge results.
- Updated the analysis guide with validated workflow corrections.

### Why

A second atom iteration tells us whether the workflow catches real issues and whether the playbook needs adjustment before wider adoption.

### What worked

The final Badge run succeeded with:

```text
component: 0.0000% changed, 0/2016 pixels
badge:     0.0000% changed, 0/1848 pixels
cssdiff:   no configured property differences after prop-list adjustment
```

### What didn't work

The first Badge CSS diff reported:

```text
box-sizing: content-box vs border-box
width:      65.7344px vs 83.7344px
height:     17.5938px vs 21.5938px
```

This was not a visual bug because pixel diff was 0%. It was a CSS-probe design issue: content-box vs border-box changes computed `width`/`height` semantics even when visual size matches.

### What I learned

CSS diff prop lists must be component-aware. Fixed-size components can include width/height as explicit parity properties. Auto-sized inline components should usually rely on `include_bounds: true` for geometry and compare visual properties such as padding, gap, typography, color, background, border, and radius.

### What was tricky to build

The tricky part was distinguishing implementation bugs from comparison-instrumentation noise. The pixel diff and screenshot review said the Badge was identical. The CSS diff highlighted real computed CSS differences, but not differences that should drive a React change.

### What warrants a second pair of eyes

Review whether the Badge config should permanently omit width/height/box-sizing, or whether future css-visual-diff should distinguish computed CSS property differences from visual bounds differences more explicitly.

### What should be done in the future

- Add Tag, Input, and Select configs using component-aware CSS prop lists.
- Consider a small config-generation helper that chooses default props by component category.

### Code review instructions

Start with:

```text
prototype-design/visual-diff/comparisons/component-system/atoms/badge-confirmed.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md
```

Validate with:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/badge-confirmed.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

### Technical details

Generated but ignored outputs are under:

```text
prototype-design/visual-comparisons/component-system/atoms/badge-confirmed/
```

## Step 4: Promote atom comparison pattern to Tag, Input, and Select

After Button and Badge validated the workflow, I promoted the same pattern to the remaining first-batch atom candidates: Tag default, Input search, and Select status. Tag and Select were immediately pixel-perfect; Input exposed a real React-side implementation mismatch against the prototype.

The Input diff was useful: CSS and pixels showed that the React input used border-box/flex sizing and positioned the search icon directly as an absolute SVG, while the prototype used content-box input sizing and an absolute wrapper around the inline SVG icon. I adjusted the React Input implementation to match the prototype, reran the comparison, and reached 0% pixel diff.

### Prompt Context

**User prompt (verbatim):** "anything to update in our playbook document? otherwise continue"

**Assistant interpretation:** Check whether the reusable playbook needs new validated notes, then continue executing the open atom promotion task.

**Inferred user intent:** Keep documentation aligned with discoveries while continuing the bottom-up parity workflow.

### What I did

- Updated `docs/playbooks/04-storybook-component-capture-playbook.md` with validated comparison workflow details:
  - inspect-first comparison sequence,
  - `output.dir` relative path caveat,
  - component-aware CSS prop list guidance.
- Added comparison configs:
  - `tag-default.css-visual-diff.yml`
  - `input-search.css-visual-diff.yml`
  - `select-status.css-visual-diff.yml`
- Ran inspect screenshots/CSS for Tag, Input, and Select.
- Ran full deterministic comparison modes for Tag, Input, and Select.
- Fixed React Input CSS/markup to match the prototype atom fixture.
- Updated the parity map with accepted statuses.

### Why

Task 6 asked us to promote the pattern beyond the first two atoms. Input was especially important because it tested whether the workflow can find and guide a real React-side repair.

### What worked

Final results:

```text
tag-default:    0.0000% pixel diff, no CSS diff
input-search:   0.0000% pixel diff, no CSS diff
select-status:  0.0000% pixel diff, no CSS diff
```

Validation commands included:

```bash
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/atoms/tag-default.css-visual-diff.yml --modes capture,cssdiff,matched-styles,pixeldiff,html-report
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml --modes capture,cssdiff,matched-styles,pixeldiff,html-report
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/atoms/select-status.css-visual-diff.yml --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

### What didn't work

The first Input run showed a real mismatch:

```text
input:     3.4812% changed, 361/10370 pixels
component: 0.5260% changed, 93/17680 pixels
```

CSS diff identified sizing differences:

```text
display:    inline-block vs block
box-sizing: content-box vs border-box
height:     16px vs 34px
```

After changing the React input to content-box sizing, there was still a small icon diff. The prototype wrapped the SVG in an absolutely positioned element and let the SVG render inline inside it; React positioned the SVG itself. Wrapping the React icon in a span matched the prototype.

### What I learned

The visual parity loop can drive implementation fixes rather than just reporting drift. Pixel diff localized the remaining Input mismatch to the search icon after sizing was fixed. CSS diff alone was not enough for that last step; the diff image made the icon problem obvious.

### What was tricky to build

The Input fix was subtle because the component initially looked almost right. The main input box needed `box-sizing: content-box` plus `flex: 0 0 auto` to match prototype sizing inside the flex wrapper. The icon also needed a wrapper span because absolutely positioned SVGs are blockified differently from an inline SVG inside an absolutely positioned wrapper.

### What warrants a second pair of eyes

- The Input change intentionally aligns React with the prototype's content-box input sizing. Review whether this should be the long-term component contract for all layouts.
- The icon wrapper changes DOM shape; review accessibility semantics and ensure `aria-hidden` on the wrapper is acceptable.

### What should be done in the future

- Add Textarea, Avatar, Icon, and IconButton comparison configs.
- Start Batch B molecules only after deciding whether Input content-box sizing is acceptable across public pages.

### Code review instructions

Review:

```text
docs/playbooks/04-storybook-component-capture-playbook.md
web/packages/pyxis-components/src/atoms/Input/Input.tsx
web/packages/pyxis-components/src/atoms/Input/Input.css
prototype-design/visual-diff/comparisons/component-system/atoms/tag-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/select-status.css-visual-diff.yml
```

Validate:

```bash
cd web && pnpm --filter pyxis-components typecheck && pnpm --filter pyxis-components build-storybook
cd ..
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

### Technical details

Generated outputs remain ignored under:

```text
prototype-design/visual-comparisons/component-system/atoms/
```

## Step 5: Complete remaining AtomDiffFixture atom comparisons

I continued the atom parity sweep with Avatar, Icon, IconButton, and Textarea. Avatar, Icon, and IconButton already had matching prototype and Storybook fixture examples, so they only needed comparison configs and the same inspect/run loop.

Textarea was not present in the shared atom fixture, even though both prototype and React component libraries have a Textarea atom. I extended both the prototype prepare script and Storybook AtomDiffFixture with a matching `textarea-notes` row, then used the diff output to align React Textarea sizing/typography with the prototype.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue executing the atom visual parity workflow and close out the remaining atom coverage tasks where possible.

**Inferred user intent:** Keep applying the validated workflow to build confidence before moving up to molecules.

### What I did

- Added comparison configs:
  - `avatar-md.css-visual-diff.yml`
  - `icon-calendar.css-visual-diff.yml`
  - `icon-button.css-visual-diff.yml`
  - `textarea-notes.css-visual-diff.yml`
- Extended Storybook `AtomDiffFixture` with a Textarea row.
- Extended the prototype atom prepare script with the same Textarea row.
- Ran screenshot inspection for Avatar, Icon, IconButton, and Textarea.
- Ran full deterministic comparison modes for all four.
- Fixed React Textarea CSS to match prototype sizing/typography.
- Updated the parity map and checked the remaining atom/Textarea tasks.

### Why

The first atom batch should cover the primitives already present in the fixture before we start molecule work. Textarea needed fixture coverage because otherwise we would compare a Storybook standalone story against no equivalent prototype atom fixture.

### What worked

Final results:

```text
avatar-md:       0.0000% pixel diff
icon-calendar:   0.0000% pixel diff
icon-button:     0.0000% pixel diff
textarea-notes:  0.0000% pixel diff
```

Textarea initially differed, then matched after aligning React CSS:

```text
box-sizing: border-box -> content-box
font-size:  14px      -> 13px
line-height: 1.5      -> normal
```

### What didn't work

Avatar and Icon had harmless `box-sizing: content-box vs border-box` CSS differences despite 0% pixel diff. As with Badge, I removed `box-sizing` from those atom configs because it is not a meaningful visual parity requirement for those auto-sized elements.

Textarea was missing from the atom fixture, so the parity config could not be created without updating both prototype and Storybook fixture sources.

### What I learned

The atom fixture approach is very effective when both sides share the same `data-comp` wrapper names. It also makes missing coverage obvious: if the prototype fixture does not expose a state, the right fix is to add the same state to both fixtures rather than comparing unrelated stories.

### What was tricky to build

Textarea parity required touching both source-of-truth fixture layers. The prototype Textarea atom uses the shared `fldBase` style with `content-box`, `13px`, and `line-height: normal`. React Textarea had diverged to `border-box`, `14px`, and `1.5` line-height. The CSS diff made that exact divergence easy to fix.

### What warrants a second pair of eyes

- Review whether Textarea should follow the same content-box sizing contract as Input.
- Review whether the old prototype prepare script under the previous ticket is still the right canonical home for the atom fixture, or whether we should promote it under `prototype-design/visual-diff/scripts/`.

### What should be done in the future

- Promote the atom fixture prepare script to a canonical repo-root script before building larger batches.
- Start molecule Batch B with Card, Field, Stat, and Empty.

### Code review instructions

Review:

```text
web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx
web/packages/pyxis-components/src/atoms/Textarea/Textarea.css
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/10-atom-original-prepare.js
prototype-design/visual-diff/comparisons/component-system/atoms/textarea-notes.css-visual-diff.yml
```

Validate:

```bash
cd web && pnpm --filter pyxis-components typecheck && pnpm --filter pyxis-components build-storybook
cd ..
css-visual-diff run --config prototype-design/visual-diff/comparisons/component-system/atoms/textarea-notes.css-visual-diff.yml --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

### Technical details

The accepted atom parity map now includes Button, Badge, Tag, Input, Select, Avatar, Icon, IconButton, and Textarea states.
