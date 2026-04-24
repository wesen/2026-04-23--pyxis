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

## Step 6: Write textbook-style postmortem and attempt reMarkable upload

At the end of the week, I rewrote the postmortem as a standalone, textbook-style handoff rather than a terse status report. The goal was to make the workflow understandable from first principles: why bottom-up comparison matters, how prototype and Storybook fixtures relate, how `css-visual-diff` artifacts should be interpreted, and what the next developer should do first tomorrow.

The document is now the best single ticket-local starting point for resuming this work. Upload to reMarkable was attempted, but the rmapi-backed upload path failed with HTTP 400 even for a tiny test PDF, which indicates an environment/cloud-tool issue rather than a problem with this document.

### Prompt Context

**User prompt (verbatim):** "write this in full detail (see textbook skills)"

**Assistant interpretation:** Expand the postmortem into a richer educational handoff using the textbook-authoring style: foundational prose, concrete examples, command sequences, lessons, and next steps.

**Inferred user intent:** Make the end-of-week handoff durable enough that tomorrow's team can restart without reconstructing today's context from chat history.

### What I did

- Read the textbook authoring skill.
- Rewrote `reference/02-postmortem-and-next-developer-handoff.md` as a detailed chapter-style handoff.
- Added sections on:
  - system context,
  - bottom-up strategy,
  - selector contract,
  - Storybook catalog vs parity comparisons,
  - validated atom fixture strategy,
  - current workflow,
  - atom sweep evidence,
  - problems and lessons,
  - documentation consolidation,
  - next-developer first hour,
  - molecule next steps,
  - workflow/tooling improvements,
  - css-visual-diff alpha-tester feedback.
- Generated a local PDF with `pandoc` for upload testing.
- Attempted upload through `remarquee upload md`, `remarquee cloud put`, and `rmapi put`.

### Why

A short postmortem would not be enough for resuming this work. The workflow has several non-obvious details: prepared prototype fixtures, Storybook fixture wrappers, component-aware CSS prop lists, output path semantics, stale Storybook static builds, and interpretation of harmless CSS differences. The handoff needed to teach those patterns, not merely list them.

### What worked

The markdown document was written successfully and `pandoc` produced a PDF:

```text
/tmp/pyxis-parity-upload/pyxis-parity-postmortem.pdf
```

### What didn't work

reMarkable upload failed with HTTP 400 in multiple forms:

```bash
remarquee upload md "$DOC" --name "Pyxis Component Visual Parity Postmortem" --remote-dir "/ai/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY"
# Error: failed to create remote directory "PYXIS-COMPONENT-VISUAL-PARITY" under "24": request failed with status 400

remarquee upload md "$DOC" --name "Pyxis Component Visual Parity Postmortem" --remote-dir "/ai/2026/04/24"
# Error: failed to upload file [...]: request failed with status 400

rmapi put /tmp/test-rm.pdf /ai/2026/04/24
# failed to upload file [/tmp/test-rm.pdf] request failed with status 400
```

`remarquee status` and `remarquee cloud account --non-interactive` both worked, so the failure appears to be in the upload/cloud API path rather than local PDF generation.

### What I learned

The reMarkable upload path needs separate troubleshooting. Since even a tiny generated PDF failed, retrying this document with different names or folders is unlikely to help until the rmapi/remarquee cloud upload issue is fixed.

### What was tricky to build

The tricky part in the writing was balancing narrative and operational detail. The document needed to explain why the workflow exists, but also provide exact commands and file paths. The textbook style helped: introduce the mental model first, then show commands and concrete examples.

### What warrants a second pair of eyes

- Review whether the new postmortem is now too long for daily use and should be distilled into `docs/playbooks/05-bottom-up-component-visual-parity.md`.
- Investigate rmapi/remarquee upload failures separately.

### What should be done in the future

- Create the canonical repo playbook from this postmortem.
- Retry reMarkable upload after rmapi/remarquee upload is fixed.

### Code review instructions

Review:

```text
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md
```

Validate PDF generation locally:

```bash
pandoc ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md \
  -o /tmp/pyxis-parity-postmortem.pdf \
  --pdf-engine=xelatex \
  -V mainfont='DejaVu Sans' \
  -V monofont='DejaVu Sans Mono'
```

### Technical details

Local PDF generation emitted one font warning for a checkmark glyph but otherwise succeeded. Upload failed independently of document size/content because a tiny test PDF also failed.

## Step 8: Switch to live Storybook and accept the first molecule comparison

This step converted the handoff guidance into the workflow we should actually use tomorrow: a real Storybook dev server in `tmux`, not a static build served with Python. That matters because the component visual-diff loop is iterative; if Storybook is stale, every pixel diff is suspect.

I also answered the “parity map” question in the docs and pushed the recommended sequence forward: promoted the atom prepare script into a canonical repo path, added a first molecule fixture on both prototype and Storybook sides, and ran the `card-default` comparison end to end.

### Prompt Context

**User prompt (verbatim):** "update the document to take into account:
- run the real storybook in a tmux, it should autorefresh, instead of building + serving with ython

questions:
- what's the parity map?

then continue with the recommended steps, keep a detailed diary as you go."

**Assistant interpretation:** Update the postmortem/handoff so the daily loop uses live Storybook in tmux, explain the parity map, then continue the recommended bottom-up work while recording details in the diary.

**Inferred user intent:** Make the parity workflow faster and less stale, clarify the core tracking artifact, and keep moving from atom validation into molecule validation with enough notes for a future developer to continue.

### What I did

- Read the handoff document, existing diary, component parity map, atom config, component package scripts, and relevant Card/Field/Stat source files.
- Started the real Storybook dev server in tmux:

```bash
tmux new-session -d -s pyxis-components-storybook \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-components storybook'
```

- Verified Storybook reported:

```text
Storybook 8.6.18 for react-vite started
Local: http://localhost:6006/
```

- Promoted the atom prototype fixture script from the old ticket path to:

```text
prototype-design/visual-diff/scripts/fixtures/atom-fixture-prepare.js
```

- Rewrote atom configs and parity-map prototype prepare paths to use the canonical fixture path.
- Added the first molecule prototype fixture script:

```text
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
```

- Added the matching Storybook molecule fixture:

```text
web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx
```

- Added the first molecule comparison config:

```text
prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml
```

- Updated the parity map with `molecules-card-default` and then marked it accepted after the run.
- Wrote the canonical repo playbook:

```text
docs/playbooks/05-bottom-up-component-visual-parity.md
```

- Updated the handoff document to explain:
  - live Storybook in tmux instead of static Storybook plus Python server,
  - what the parity map is,
  - that new molecule work should use the live Storybook loop.

### Why

The previous handoff still recommended rebuilding Storybook and serving `storybook-static/` with `python3 -m http.server`. The user correctly pointed out that this is the wrong default for active component work. Live Storybook reduces stale-build mistakes and keeps the visual-diff loop closer to how Storybook is meant to be used.

The parity map also needed a plain-language explanation. It is the queue/inventory/verdict file for comparison pairs, not generated output. The developer should update it whenever a component state moves from planned to in-progress to accepted.

### What worked

- Storybook dev server started successfully in `tmux` and served `localhost:6006`.
- The new `MoleculeDiffFixture` appeared in Storybook `index.json`:

```text
has_molecule_fixture= True
```

- TypeScript passed:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

- Card screenshots were captured successfully:

```bash
css-visual-diff screenshot \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml \
  --side original \
  --section component \
  --output-file /tmp/card-default-original.png

css-visual-diff screenshot \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml \
  --side react \
  --section component \
  --output-file /tmp/card-default-react.png
```

- Both crops had the same dimensions:

```text
/tmp/card-default-original.png (260, 66)
/tmp/card-default-react.png (260, 66)
```

- The full deterministic run completed:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

- Pixel diff was zero:

```text
component | 0.0000% | 0/17160
root      | 0.0000% | 0/17160
```

- I used the `read` tool to inspect the generated PNG comparison image directly, per the corrected tool guidance.

### What didn't work

- No command failed in this step, but the CSS diff is not clean. It reports implementation-shape differences for Card:

```text
box-sizing: content-box vs border-box
width: 214px vs 260px
height: 20px vs 66px
padding: 22px vs 0px
box-shadow: one layer vs two layers
cursor: default vs auto
```

These are not currently visual bugs because the pixel diff is `0.0000%`; they come from the React Card splitting root and body responsibilities while the prototype applies padding directly to the root.

### What I learned

The first molecule validates that the atom workflow scales one level up, but it also proves why the parity map needs accepted differences. A molecule can be visually identical while the CSS ownership is distributed differently between root and body.

The Card fixture also reinforced the value of matching fixture wrappers. The prototype and React DOM internals differ, but both sides expose `data-comp="card-default"`, so screenshot sections remain straightforward.

### What was tricky to build

The tricky part was deciding whether Card's CSS differences should block acceptance. The root screenshot is pixel-perfect, but the CSS probe compares prototype root styles against React root styles even though React delegates padding to `[data-pyxis-part='body']`. Treating every CSS row as a failure would cause unnecessary React churn.

The solution was to keep the evidence, mark the comparison accepted based on the zero pixel diff, and record accepted CSS differences in `component-parity-map.json` so the next developer does not rediscover the same root/body split.

### What warrants a second pair of eyes

- Whether `Card` should eventually mimic the prototype by applying padding directly to the root when no header/footer slots exist, or whether the current root/body split should remain the React design-system contract.
- Whether the Card CSS probe should be split into clearer `root` and `body` profiles to avoid noisy root-only comparisons.
- Whether `css-visual-diff` should support accepted-difference filtering directly from the parity map.

### What should be done in the future

- Continue molecule Batch B with `Field default`, `Field error`, `Stat default`, and `Empty with CTA`.
- Add those molecule states to `molecule-fixture-prepare.js` and `MoleculeDiffFixture.stories.tsx` before writing configs.
- Keep using live Storybook in `tmux`; do not return to static rebuilds for the active loop.

### Code review instructions

Start with the workflow docs:

```text
docs/playbooks/05-bottom-up-component-visual-parity.md
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md
```

Then inspect the new molecule files:

```text
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx
prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Validate with:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
cd web && pnpm --filter pyxis-components typecheck
cd ..
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

### Technical details

The Card result lives under:

```text
prototype-design/visual-comparisons/component-system/molecules/card-default/
```

The key generated reports are:

```text
prototype-design/visual-comparisons/component-system/molecules/card-default/pixeldiff.md
prototype-design/visual-comparisons/component-system/molecules/card-default/cssdiff.md
prototype-design/visual-comparisons/component-system/molecules/card-default/index.html
```

The generated output is evidence only and should not be committed.

## Step 9: Complete the first molecule batch

This step continued the bottom-up move from atoms into molecules. After Card proved the molecule fixture shape, I added the remaining recommended molecule states: `Field default`, `Field error`, `Stat default`, and `Empty with CTA`.

The useful part of this batch was that it produced both straightforward parity and real React repairs. Field needed its molecule wrapper typography/spacing aligned to the prototype. Stat and Empty had the right semantic shape but still carried visual drift in text sizing, spacing, icon treatment, and shadows; the screenshot loop made those issues obvious and small enough to fix.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue the recommended molecule parity steps from the previous diary entry, keeping the detailed diary current.

**Inferred user intent:** Keep executing the bottom-up parity plan rather than stopping after Card; validate more molecule states and repair real drift as it appears.

### What I did

- Extended the prototype molecule fixture:

```text
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
```

with:

```text
field-default
field-error
stat-default
empty-cta
```

- Extended the Storybook molecule fixture:

```text
web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx
```

with the same `data-comp` wrappers.

- Added comparison configs:

```text
prototype-design/visual-diff/comparisons/component-system/molecules/field-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/field-error.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/stat-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/empty-cta.css-visual-diff.yml
```

- Ran typecheck:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

- Captured and inspected screenshots for the new targets with `css-visual-diff screenshot` and the `read` image tool path.
- Fixed React molecule implementations:

```text
web/packages/pyxis-components/src/molecules/Field/Field.tsx
web/packages/pyxis-components/src/molecules/Stat/Stat.tsx
web/packages/pyxis-components/src/molecules/Empty/Empty.tsx
```

- Ran full deterministic comparisons for all four new configs.
- Updated `component-parity-map.json` with accepted statuses and accepted CSS differences.
- Updated the canonical playbook’s current known-good molecule list.

### Why

The next recommended sequence after Card was Field, Stat, and Empty. These molecules sit directly above the atom set we already validated, so they are the right scale-up test before organisms or public components.

Adding all four states to the same molecule fixture keeps the workflow consistent with atoms: same logical wrapper on both sides, side-specific selectors inside each wrapper, and a parity-map entry for the verdict.

### What worked

After fixes, all four new molecule comparisons reached zero pixel diff:

```text
field-default | component 0.0000% | 0/22620
field-error   | component 0.0000% | 0/22620
stat-default  | component 0.0000% | 0/27940
empty-cta     | component 0.0000% | 0/73920
```

The `read` image inspections were especially useful. For Field, the original showed uppercase compact labels while React initially showed title-case labels. For Stat, the text block and card height were visibly off. For Empty, React initially used a tiny dot icon and too much vertical spacing.

### What didn't work

Initial screenshot dimensions exposed drift:

```text
field-default original (260, 87), react (260, 75)
field-error   original (260, 87), react (260, 75)
stat-default  original (220, 127), react (220, 132)
empty-cta     original (320, 231), react (320, 244)
```

The first full run before Stat/Empty fixes showed non-zero pixel diffs:

```text
stat-default component | 6.4050% | 1860/29040
empty-cta    component | 7.9905% | 6239/78080
```

These were real visual bugs, not selector issues.

### What I learned

The molecule workflow is now validated beyond Card. It catches real drift quickly, and live Storybook in tmux makes the fix/retry loop much faster than static rebuilds.

The batch also showed that CSS diffs remain noisy around `box-sizing` and bounds even when pixels match. The parity map now records these accepted differences rather than treating them as unresolved work.

### What was tricky to build

The tricky part was separating visual drift from CSS model differences. For Stat and Empty, the first non-zero pixel diffs were real; after the fixes, CSS still reports `content-box` versus `border-box` bounds because the prototype and React global reset compute dimensions differently. Since the screenshots are the same size and the pixel diff is exactly zero, those remaining CSS rows are accepted implementation differences.

The other tricky part was Field error semantics. The prototype does not have a distinct `error` prop on `Field`; the fixture creates the error state by combining the normal Field hint/message shape with a red-bordered Input. React keeps an explicit `error` slot, but for parity it now renders with the prototype’s spacing and message typography.

### What warrants a second pair of eyes

- Whether changing `Field`, `Stat`, and `Empty` to match the prototype is acceptable for all existing Storybook stories and downstream consumers.
- Whether `Field error` should remain visually prototype-compatible with a tertiary-colored message, or whether the design system should intentionally diverge and use accent-colored error text.
- Whether `Stat` and `Empty` need more specific CSS probes for internal parts now that their root pixels match.

### What should be done in the future

- Re-run the whole molecule batch after any token/CSS reset change.
- Continue upward to organisms only after adding any missing molecule states that public/app components depend on.
- Consider generating these repetitive molecule configs from the parity map.

### Code review instructions

Review implementation changes first:

```text
web/packages/pyxis-components/src/molecules/Field/Field.tsx
web/packages/pyxis-components/src/molecules/Stat/Stat.tsx
web/packages/pyxis-components/src/molecules/Empty/Empty.tsx
```

Then review fixture/config wiring:

```text
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx
prototype-design/visual-diff/comparisons/component-system/molecules/*.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Validate with:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
cd web && pnpm --filter pyxis-components typecheck
cd ..
for target in field-default field-error stat-default empty-cta; do
  css-visual-diff run \
    --config prototype-design/visual-diff/comparisons/component-system/molecules/$target.css-visual-diff.yml \
    --modes capture,cssdiff,matched-styles,pixeldiff,html-report
done
```

### Technical details

Generated reports live under:

```text
prototype-design/visual-comparisons/component-system/molecules/field-default/
prototype-design/visual-comparisons/component-system/molecules/field-error/
prototype-design/visual-comparisons/component-system/molecules/stat-default/
prototype-design/visual-comparisons/component-system/molecules/empty-cta/
```

Generated comparison output should remain uncommitted.

## Step 10: Commit molecule batch, then start organisms with TopBar

This step first created a checkpoint commit for the completed atom/molecule workflow before moving upward. After the commit, I started the organism layer with `TopBar default`, using the same fixture-map-config-run pattern that worked for atoms and molecules.

TopBar was a good first organism because it is still small enough to reason about, but it combines multiple atoms and layout rules: breadcrumb text, display title, subtitle, two button actions, spacing, background, and bottom border.

### Prompt Context

**User prompt (verbatim):** "actually commit first.

then continue"

**Assistant interpretation:** Commit the completed work before proceeding, then continue the bottom-up parity task.

**Inferred user intent:** Preserve the validated atom/molecule checkpoint in git before starting the next layer so future organism changes do not mix with the already working batch.

### What I did

- Reviewed status/diff and confirmed generated visual comparison output is ignored by `.gitignore`.
- Staged the completed atom/molecule workflow files intentionally, excluding the just-created organism fixture until after the commit.
- Committed:

```text
731c88571405cca9749d78639bd66623002a05b4 Add bottom-up component visual parity workflow
```

- Added the prototype organism fixture:

```text
prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js
```

- Added the matching Storybook organism fixture:

```text
web/packages/pyxis-components/src/organisms/OrganismDiffFixture.stories.tsx
```

- Added the TopBar comparison config:

```text
prototype-design/visual-diff/comparisons/component-system/organisms/topbar-default.css-visual-diff.yml
```

- Ran typecheck:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

- Captured and inspected TopBar screenshots with `read`.
- Fixed React TopBar visual drift in:

```text
web/packages/pyxis-components/src/organisms/TopBar/TopBar.tsx
```

- Ran full deterministic modes for TopBar.
- Updated the parity map and playbook with the accepted organism result.

### Why

The commit separates the completed atom/molecule layer from the next escalation. TopBar then exercises the next level of composition without jumping all the way to pages.

### What worked

The first TopBar screenshots immediately showed the drift: React used a sans-serif, smaller, heavier title and a shorter top bar. After aligning React to the prototype’s padding, title font, font sizes, subtitle spacing, and action gap, the screenshots matched.

Final TopBar result:

```text
topbar-default component | 0.0000% | 0/78280
topbar-default root      | 0.0000% | 0/78280
title-group              | 0.0000% | 0/17112
actions                  | 0.0000% | 0/4452
```

### What didn't work

Initial screenshot dimensions showed drift:

```text
original (760, 103)
react    (760, 97)
```

The visual mismatch was real, not a selector problem. The title font and top-bar vertical metrics differed from the prototype.

### What I learned

The organism workflow is viable: the same `data-comp` wrapper plus side-specific probes approach scales from molecules to TopBar. The first organism was also a useful reminder that a visually small component can encode high-level typography choices, especially display font selection.

### What was tricky to build

The main tricky point was part naming. The original React TopBar accidentally used the root `pyxisPart('top-bar')` for the actions container. The config needed a stable `actions` part, so I changed React to expose `data-pyxis-part="actions"`, plus explicit `breadcrumb` and `subtitle` parts for future CSS probes.

CSS diff still reports content-box versus border-box bounds after pixel parity. As with molecules, this is recorded as an accepted CSS-model difference because the rendered screenshots are exact.

### What warrants a second pair of eyes

- Whether TopBar should intentionally use the prototype’s Fraunces display title everywhere, or whether any app-specific contexts expected the previous sans-serif title.
- Whether the added `breadcrumb`, `subtitle`, and `actions` part names should become part of the formal component capture contract.

### What should be done in the future

- Add and compare the next organism target, likely `Modal default`, once a stable prototype fixture state is defined.
- Consider a config generator now that atoms, molecules, and the first organism all share the same YAML shape.

### Code review instructions

Review the committed checkpoint first:

```bash
git show --stat 731c88571405cca9749d78639bd66623002a05b4
```

Then review new organism work:

```text
prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js
web/packages/pyxis-components/src/organisms/OrganismDiffFixture.stories.tsx
prototype-design/visual-diff/comparisons/component-system/organisms/topbar-default.css-visual-diff.yml
web/packages/pyxis-components/src/organisms/TopBar/TopBar.tsx
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Validate with:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
cd web && pnpm --filter pyxis-components typecheck
cd ..
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/organisms/topbar-default.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

### Technical details

Generated TopBar report:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default/index.html
```

Generated TopBar screenshots:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default/original-component.png
prototype-design/visual-comparisons/component-system/organisms/topbar-default/react-component.png
prototype-design/visual-comparisons/component-system/organisms/topbar-default/pixeldiff_component_diff_comparison.png
```

## Step 11: Document LLM review failure modes for css-visual-diff maintainer

This step paused implementation work and turned the GLM-5V/GPT-5 review experiments into a maintainer-facing report. The goal is to make the lessons actionable for `css-visual-diff`, not just record that the model answers were wrong.

The resulting report explains the Pyxis visual parity context, how deterministic config-run evidence accepted TopBar at zero pixel diff, how standalone `llm-review` produced different evidence, and why models then generated plausible but misleading recommendations.

### Prompt Context

**User prompt (verbatim):** "Ok, write a detailed report on llm-review so we can improve it in the future. We will hand it to the css-visual-diff maintainer, so it needs a lot of context and defailt."

**Assistant interpretation:** Write a detailed, context-rich report for the css-visual-diff maintainer covering llm-review behavior, failures, and improvement recommendations.

**Inferred user intent:** Preserve the debugging lessons from the LLM-review experiments so the tool can be improved later, especially around evidence alignment, prompt control, and visual-first review behavior.

### What I did

- Wrote:

```text
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/03-css-visual-diff-llm-review-maintainer-report.md
```

- Included context on:
  - Pyxis prototype-to-Storybook parity workflow,
  - accepted atom/molecule/TopBar deterministic results,
  - prior GLM-5V profile setup ticket,
  - current `llm-review` implementation shape,
  - TopBar deterministic config and accepted pixel result,
  - GLM-5V, GPT-5 Nano, and GPT-5 Mini experiments,
  - observed failure modes,
  - maintainer recommendations.

### Why

The LLM answers were not just “bad model outputs.” They exposed tool-design issues: standalone `llm-review` recomputes evidence that can disagree with config-run artifacts; prepared HTML may not preserve Storybook/theme context; triptych images are ambiguous to smaller vision models; and prompt customization is too limited.

A maintainer report is the right artifact because the fixes are mostly in `css-visual-diff`, not in Pyxis component code.

### What worked

The report now has concrete paths, commands, model-specific observations, and prioritized recommendations. It should be usable by a maintainer without needing the full terminal scrollback.

### What didn't work

N/A for writing the report. The underlying tool issues remain unresolved.

### What I learned

The most important distinction is evidence alignment. Multimodal model quality matters, but even a good model will produce misleading advice if the review command gives it a comparison artifact that differs from the deterministic run developers already accepted.

### What was tricky to build

The tricky part was being fair to the models. GLM-5V was not simply wrong in the prepared-HTML run: it correctly described a broken rendering. The problem was that the broken rendering was an artifact of how `react-prepared.html` was reloaded. The report therefore separates model failure from tool/evidence failure.

### What warrants a second pair of eyes

- Whether the recommended artifact-based `llm-review` mode should be a new command or a `run` mode.
- Whether the proposed visual-first default prompt is strong enough.
- Whether generated prepared HTML should be made self-contained or deemphasized for LLM review.

### What should be done in the future

- Hand the report to the `css-visual-diff` maintainer.
- Consider patching `css-visual-diff` to expose `--system-prompt` and artifact-based review.
- Archive any generated LLM-review output directories if they need to survive beyond local gitignored artifacts.

### Code review instructions

Review:

```text
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/03-css-visual-diff-llm-review-maintainer-report.md
```

Check that the report distinguishes:

```text
validated deterministic config-run evidence
standalone llm-review evidence
model interpretation quality
tool improvement recommendations
```

### Technical details

The report intentionally references generated artifacts under:

```text
prototype-design/visual-comparisons/component-system/organisms/
```

Those outputs are gitignored, so they may need to be archived separately if the maintainer needs exact images/JSON files.

## Step 12: Continue organisms with Modal default

This step returned to the main visual parity workflow after the LLM-review maintainer report. I added `Modal default` as the next organism comparison target after `TopBar default`.

Modal is more complex than TopBar because the prototype modal is an absolutely positioned overlay inside a bounded parent, while the React Modal uses a fixed-position overlay. To avoid comparing viewport overlay behavior too early, I focused the comparison on the modal panel and its major internal regions: header, body, and footer.

### Prompt Context

**User prompt (verbatim):** "continue with the main thing"

**Assistant interpretation:** Resume bottom-up component visual parity work rather than continuing the LLM-review investigation.

**Inferred user intent:** Keep progressing through organism-level parity targets after documenting the LLM-review issues.

### What I did

- Extended the prototype organism fixture:

```text
prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js
```

with `modal-default`.

- Extended the Storybook organism fixture:

```text
web/packages/pyxis-components/src/organisms/OrganismDiffFixture.stories.tsx
```

with a matching `modal-default` state.

- Added a Modal comparison config:

```text
prototype-design/visual-diff/comparisons/component-system/organisms/modal-default.css-visual-diff.yml
```

- Ran typecheck:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

- Captured and inspected Modal screenshots with the image `read` path.
- Fixed React Modal visual drift in:

```text
web/packages/pyxis-components/src/organisms/Modal/Modal.tsx
```

including:

```text
md width 520-ish prototype parity
backdrop color/blur
panel border radius/border/shadow
header padding/title/subtitle/close icon
body padding
footer padding/gap/background
```

- Ran full deterministic modes:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/organisms/modal-default.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

- Updated the parity map and playbook with Modal as `needs-review`, not accepted.

### Why

Modal is the next obvious organism after TopBar. It combines already-validated atoms/molecules (`Button`, `Field`, `Input`) with a larger composition and surface layout.

I intentionally compared the panel/header/body/footer rather than the full fixed overlay because overlay positioning semantics differ between prototype and React and would make the first pass noisier.

### What worked

The config is valid and all sections exist:

```text
coverage total: 4
original_missing: 0
react_missing: 0
```

After React alignment, header and body reached zero pixel diff:

```text
header | 0.0000% | 0/37960
body   | 0.0000% | 0/58240
```

This means the modal title/subtitle/close area and the form body are now visually aligned.

### What didn't work

The panel is not fully accepted yet:

```text
panel  | 1.2820% | 1673/130500
footer | 1.9902% | 652/32760
```

The remaining diff is localized to the panel/footer region. Header/body are exact. The issue appears to be a combination of content-box versus border-box rounding, a one-pixel panel/footer crop difference, and footer button-region pixels.

### What I learned

For overlay organisms, comparing the semantic inner panel can be much more useful than comparing the whole overlay. It let us get header/body to zero without first solving fixed-vs-absolute overlay semantics.

The Modal also shows that organism parity may need a `near-match / needs-review` status. Not every first pass should be forced into accepted or failed; here the component is much closer after fixes, but the remaining footer/panel pixels deserve another pass.

### What was tricky to build

The prototype Modal selector shape was not obvious. My first selector used:

```text
[data-comp='modal-default'] > div > div:nth-child(2)
```

but the actual prototype DOM is:

```text
[data-comp='modal-default'] > div          # overlay
[data-comp='modal-default'] > div > div    # panel
```

I had to inspect prepared HTML to correct the selectors. This is exactly why the inspect-first workflow matters.

The second tricky part was React Modal's fixed positioning. Because the component does not portal but uses `position: fixed`, it renders relative to the viewport even inside a fixture wrapper. The current comparison avoids that by targeting the panel directly.

### What warrants a second pair of eyes

- Whether React Modal should use `md: 522` to match the prototype panel's content-box width plus border, or whether the prototype fixture/config should normalize the crop differently.
- Whether the remaining footer diff is acceptable rounding or should be driven to zero.
- Whether comparing Modal's full overlay should wait until panel parity is complete.

### What should be done in the future

- Do a second Modal pass focused only on footer/panel rounding.
- Consider adding more Modal CSS probes for close button and footer buttons.
- Only mark `modal-default` accepted after panel/footer reach zero or an explicit accepted-difference rationale is agreed.

### Code review instructions

Review:

```text
prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js
web/packages/pyxis-components/src/organisms/OrganismDiffFixture.stories.tsx
prototype-design/visual-diff/comparisons/component-system/organisms/modal-default.css-visual-diff.yml
web/packages/pyxis-components/src/organisms/Modal/Modal.tsx
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Validate with:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
cd web && pnpm --filter pyxis-components typecheck
cd ..
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/organisms/modal-default.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

### Technical details

Generated report:

```text
prototype-design/visual-comparisons/component-system/organisms/modal-default/index.html
```

Important images:

```text
prototype-design/visual-comparisons/component-system/organisms/modal-default/original-panel.png
prototype-design/visual-comparisons/component-system/organisms/modal-default/react-panel.png
prototype-design/visual-comparisons/component-system/organisms/modal-default/pixeldiff_panel_diff_comparison.png
prototype-design/visual-comparisons/component-system/organisms/modal-default/pixeldiff_footer_diff_comparison.png
```

## Step 13: Add missing molecule coverage targets without tuning

This step corrected the workflow priority: instead of continuing upward into public components or trying to make every new target pixel-perfect immediately, I returned to the generic molecule layer and added coverage for the molecules that were still missing from the shared molecule diff fixture.

The goal was coverage, not acceptance. Each missing molecule now has a prototype fixture state, a Storybook fixture state, a comparison config, generated reports, and a parity-map entry marked `needs-review`.

### Prompt Context

**User prompt (verbatim):** "focus right now is to go through all the molecules and adding the ones missing, not getting them pixel perfect"

**Assistant interpretation:** Stop polishing or moving upward; make sure all generic molecules have parity fixture/config coverage, even if the initial diffs are non-zero.

**Inferred user intent:** Build the comparison inventory first so later work can cycle back and tune components systematically.

### What I did

- Added missing molecule states to:

```text
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx
```

- Added these missing molecule targets:

```text
card-head-default
log-row-default
table-default
```

- Wrote comparison configs:

```text
prototype-design/visual-diff/comparisons/component-system/molecules/card-head-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/log-row-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/table-default.css-visual-diff.yml
```

- Ran typecheck:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

- Ran full deterministic modes for each new target:

```bash
css-visual-diff run --config ... --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

- Updated `component-parity-map.json` with the three targets as `needs-review`.
- Updated the playbook status list with the newly wired-but-not-tuned molecules.

### Why

The bottom-up map is more useful if the layer is complete before moving upward. Missing molecule configs create blind spots: later organism/page diffs can be noisy because a nested molecule has never been compared in isolation.

### What worked

All three new configs are runnable and have section coverage:

```text
coverage total: 2
original_missing: 0
react_missing: 0
```

Initial pixel results:

```text
card-head-default component 15.8700%; root 16.3729%
log-row-default   component/root 16.3240%
table-default     component/root 9.6013%
```

These are intentionally recorded as `needs-review`, not failures.

### What didn't work

These are not tuned. In particular, `log-row-default` is probably a semantic mismatch: the prototype `LogRow` is an audit/activity row (`time`, `user`, `action`, `type`) while the React `LogRow` is a lineup row (`artist`, `role`, `startTime`). That mismatch should be resolved before trying to make it pixel-perfect.

### What I learned

Coverage-first and parity-first are different modes. The current phase should prefer getting every molecule into the parity map, even if the first diff is ugly, because it creates an explicit queue for future tuning.

### What was tricky to build

The tricky part was choosing prototype fixture states for components whose semantics have drifted. `CardHead` and `Table` are straightforward. `LogRow` needs a design decision: either React should represent the prototype audit row, or the prototype fixture should add a lineup-row analogue.

### What warrants a second pair of eyes

- Decide whether `LogRow` should mean audit row, lineup row, or whether these should be separate components.
- Confirm whether `CardHead` should be considered a standalone molecule or folded into `Card` only.
- Confirm which table state should be canonical for future tuning.

### What should be done in the future

- Cycle back to `card-head-default`, `log-row-default`, and `table-default` after the molecule inventory is complete.
- Resolve the `LogRow` semantic mismatch before styling it.
- Consider adding molecule targets for any remaining exported molecules discovered later.

### Code review instructions

Review fixture/config coverage:

```text
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx
prototype-design/visual-diff/comparisons/component-system/molecules/card-head-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/log-row-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/table-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Validate with:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
cd web && pnpm --filter pyxis-components typecheck
cd ..
for target in card-head-default log-row-default table-default; do
  css-visual-diff run \
    --config prototype-design/visual-diff/comparisons/component-system/molecules/$target.css-visual-diff.yml \
    --modes capture,cssdiff,matched-styles,pixeldiff,html-report
done
```

### Technical details

Generated reports:

```text
prototype-design/visual-comparisons/component-system/molecules/card-head-default/index.html
prototype-design/visual-comparisons/component-system/molecules/log-row-default/index.html
prototype-design/visual-comparisons/component-system/molecules/table-default/index.html
```

## Step 14: Reframe LogRow as a show-detail lineup row

This step incorporated the clarification that React `LogRow` appears to correspond to lineup rows from the public show detail page, not the prototype's generic audit/activity `LogRow` helper. I adjusted the prototype molecule fixture accordingly.

The goal remains coverage rather than pixel perfection. The important outcome is that `log-row-default` now compares against a semantically closer prototype fixture, even though its CSS is still very different.

### Prompt Context

**User prompt (verbatim):** "continue. the LogRow seems to be the lineup rows fromt he show detail page but the CSS is very different. It's probably something that the designer made up and is not present elsewhere.

Let's continue"

**Assistant interpretation:** Update the LogRow comparison target to reflect that React LogRow should be compared to the public show-detail lineup row style, then continue the coverage-first molecule workflow.

**Inferred user intent:** Avoid treating the prototype audit-row helper as the source of truth for React LogRow; keep building the comparison map without trying to force pixel-perfect fixes now.

### What I did

- Updated the prototype molecule fixture for `log-row-default` in:

```text
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
```

- Replaced the previous prototype `window.LogRow` audit-row render with a hand-rendered show-detail-style lineup table row:

```text
time cell: 21:30
artist cell: Luna Mesa
role/subtitle: headline
```

- Updated the LogRow comparison config selector:

```text
prototype-design/visual-diff/comparisons/component-system/molecules/log-row-default.css-visual-diff.yml
```

so the prototype root probe targets:

```text
[data-comp='log-row-default'] tr
```

- Re-ran the LogRow comparison with full modes.
- Updated the parity map and playbook notes.

### Why

The original coverage config compared React `LogRow` against the wrong prototype concept. The React component API is:

```text
artist, role, startTime
```

That is closer to the public show-detail lineup table than to the prototype audit `LogRow`, whose API is:

```text
time, user, action, type
```

### What worked

The updated comparison is runnable and semantically closer:

```text
coverage total: 2
original_missing: 0
react_missing: 0
```

Updated pixel result:

```text
log-row-default component | 7.3399% | 1788/24360
log-row-default root      | 7.1972% | 1723/23940
```

This is substantially better than the earlier ~16% mismatch and now reflects real CSS/layout differences rather than a wholly wrong source concept.

### What didn't work

The component is still not tuned. The screenshot shows the prototype row as a table-style lineup entry and React as a flex row with role text on the right. This is expected for now and remains `needs-review`.

### What I learned

Some prototype shapes are not reusable components; they are designer-made local page patterns. For coverage, it is still useful to hand-render the closest prototype fixture state, but the parity map should flag that the source is a local page pattern rather than a global prototype helper.

### What was tricky to build

The tricky part was preserving the coverage-first discipline. It would be tempting to rewrite React `LogRow` immediately, but the current task is to make missing molecule targets visible and runnable. The semantic correction was necessary; pixel tuning can wait.

### What warrants a second pair of eyes

- Whether React `LogRow` should be renamed to `LineupRow` or reconciled with the public `LineupRow` component.
- Whether this molecule should remain in generic molecules at all if it belongs to show-detail/public domain UI.

### What should be done in the future

- Decide whether to keep `LogRow` generic, move it, or split audit-row and lineup-row concepts.
- Tune `log-row-default` only after that component taxonomy decision.

### Code review instructions

Review:

```text
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
prototype-design/visual-diff/comparisons/component-system/molecules/log-row-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Validate with:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/molecules/log-row-default.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

### Technical details

Generated report:

```text
prototype-design/visual-comparisons/component-system/molecules/log-row-default/index.html
```

## Step 15: Prepare public-site component parity handoff and Storybook taxonomy

This step finished the generic molecule coverage checkpoint by documenting the next phase: public-site component parity. It also reorganized public Storybook titles into `Public/Molecules` and `Public/Organisms` so the domain-specific ladder is visible before adding public comparison configs.

The key decision is that public-site components should not be forced into the generic molecule/organism ladder. They have their own domain ladder that should be compared bottom-up before full public pages.

### Prompt Context

**User prompt (verbatim):** "ok, create a handoff document so the next developer can tackle the public site and make subdirectories for the stories in the Public storybook section (molecules / organisms)"

**Assistant interpretation:** Write a public-site parity handoff for the next developer and reorganize public Storybook story titles into molecule/organism subgroups.

**Inferred user intent:** Create a clean transition point from generic component parity to public-site parity, with Storybook taxonomy reflecting the next workflow layer.

### What I did

- Wrote the handoff document:

```text
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/04-public-site-component-parity-handoff.md
```

- Updated public Storybook story titles from:

```text
Public/<Component>
```

to:

```text
Public/Molecules/<Component>
Public/Organisms/<Component>
```

- Public/Molecules:

```text
ArchiveStats
LineupRow
PubShowRow
TicketStub
YearGroup
```

- Public/Organisms:

```text
AboutHero
BookingForm
BookingRules
BookingSuccess
EthosStrip
MailingListCTA
PubFooter
PubHero
PubNav
SpaceInfo
VenueCard
```

- Ran typecheck:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

### Why

The next developer needs a clear handoff that says: generic molecules are covered; public components are next; do not jump to full pages; create public-domain fixture/config directories.

Storybook should reflect this taxonomy because the visual parity workflow is easier when Storybook mirrors the comparison ladder.

### What worked

Typecheck passed after the Storybook title changes.

The handoff now gives a concrete next step: start with `LineupRow`, then proceed through smaller public molecules before public organisms and pages.

### What didn't work

N/A. This was documentation and story taxonomy work, not comparison execution.

### What I learned

The public directory is not a flat bag of components. It has a clear internal hierarchy, and the visual parity workflow should preserve that structure.

### What was tricky to build

Classifying some public components is a judgment call. For now, `PubShowRow` is classified as a public molecule, while larger section/workflow components like `VenueCard`, `BookingForm`, and `PubHero` are public organisms.

### What warrants a second pair of eyes

- Whether `PubShowRow` should remain under `Public/Molecules` or move to `Public/Organisms` later.
- Whether `ArchiveStats`/`YearGroup` should be considered molecules or sections once their prototype references are inspected.

### What should be done in the future

- Create `public-fixture-prepare.js` and `PublicDiffFixture.stories.tsx`.
- Start with `public-molecules-lineup-row-default`.
- Add public comparison configs under `prototype-design/visual-diff/comparisons/component-system/public/...`.

### Code review instructions

Review:

```text
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/04-public-site-component-parity-handoff.md
web/packages/pyxis-components/src/public/*/*.stories.tsx
```

Validate:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

### Technical details

Storybook title-only changes should not affect runtime component behavior, but they will change Storybook IDs for public stories. Future scripts should use the new `public-molecules-*` / `public-organisms-*` story IDs generated from these titles.

## Step 16: Add public molecule fixture and first coverage batch

This step began the public-site parity ladder after reading the public handoff. I committed the handoff/story taxonomy checkpoint first, then created the first public fixture pair and covered the P1 public molecules.

### Prompt Context

**User prompt (verbatim):** "Continue with the work, read @ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/04-public-site-component-parity-handoff.md 

Commit at appropriate intervals, keep a diary at frequent intervals. let's go through and cover all our design elements."

**Assistant interpretation:** Read the handoff, commit the pending public taxonomy/handoff work, then continue bottom-up coverage into public-site design elements with frequent diary updates.

**Inferred user intent:** Move from generic component coverage into systematic public-site coverage, prioritizing runnable comparison targets over immediate pixel-perfect tuning.

### What I did

- Read the full public-site handoff.
- Committed the handoff and Storybook taxonomy change:

```text
b62f9a928c46d26e50d8239cbbf35abdb06c072d Organize public Storybook component taxonomy
```

- Created the prototype public fixture script:

```text
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
```

- Created the Storybook public fixture:

```text
web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx
```

- Added first public molecule comparison configs:

```text
prototype-design/visual-diff/comparisons/component-system/public/molecules/lineup-row-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/ticket-stub-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/archive-stats-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/year-group-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/pub-show-row-default.css-visual-diff.yml
```

- Ran typecheck successfully after fixing the fixture Show mock shape:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

- Ran full visual diff modes for all five public molecule configs.
- Updated the parity map with five `domain: public`, `level: molecule`, `needs-review` entries.
- Inspected generated PNG comparisons for LineupRow, TicketStub, and PubShowRow with the image-reading path.

### Results

All five configs have valid selector coverage:

```text
coverage total: 2
original_missing: 0
react_missing: 0
```

Pixel diff results:

```text
public-molecules-lineup-row-default       component 11.5421%; root 11.5838%
public-molecules-ticket-stub-default      component/root 19.1037%
public-molecules-archive-stats-default    component/root 12.3927%
public-molecules-year-group-default       component 6.0084%; root 7.1849%
public-molecules-pub-show-row-default     component/root 4.9310%
```

All are currently `needs-review`.

### Why

The public-site ladder needs the same coverage-first inventory as atoms/molecules. These first targets are the smallest public pieces and appear inside larger public pages or sections.

### What worked

The fixture architecture worked: a dedicated prototype script plus a dedicated Storybook fixture is cleaner than mixing public components into the generic molecule fixture.

The public configs can live under:

```text
prototype-design/visual-diff/comparisons/component-system/public/molecules/
```

without disturbing existing generic molecule configs.

### What didn't work

The first typecheck failed because my Storybook fixture mock `Show` objects used string IDs and omitted `created_at`/`updated_at`. I fixed them to match `web/packages/pyxis-components/src/mocks/types.ts`.

### What I learned

Several public components are not yet styled with dedicated CSS. For example, `LineupRow`, `TicketStub`, and `PubShowRow` render semantic markup/classes but currently have little or no matching public CSS, so diffs are expected.

`PubShowRow` may be comparing two adjacent but not identical concepts: prototype archive row vs React public show row. This should be revisited before pixel tuning.

### What was tricky to build

The tricky part was choosing prototype equivalents for components that are not one-to-one with named prototype functions. For this first pass I hand-rendered closest public-page shapes from `ppxis.jsx`.

### What warrants a second pair of eyes

- Whether `TicketStub` has a stronger prototype reference than the hand-rendered ticket card motif.
- Whether `PubShowRow` should be split into archive row vs upcoming show row.
- Whether `ArchiveStats` should compose generic `Stat` cards or have public-specific styling.

### What should be done in the future

- Commit this P1 public molecule coverage batch.
- Start public organism coverage with `PubNav`, `PubFooter`, `PubHero`, and `AboutHero`.
- Later return to tune public molecules after taxonomy/design decisions.

### Code review instructions

Review:

```text
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx
prototype-design/visual-diff/comparisons/component-system/public/molecules/*.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Validate:

```bash
cd web && pnpm --filter pyxis-components typecheck
cd ..
for cfg in prototype-design/visual-diff/comparisons/component-system/public/molecules/*.css-visual-diff.yml; do
  css-visual-diff run --config "$cfg" --modes capture,cssdiff,matched-styles,pixeldiff,html-report
done
```

Generated reports:

```text
prototype-design/visual-comparisons/component-system/public/molecules/lineup-row-default/index.html
prototype-design/visual-comparisons/component-system/public/molecules/ticket-stub-default/index.html
prototype-design/visual-comparisons/component-system/public/molecules/archive-stats-default/index.html
prototype-design/visual-comparisons/component-system/public/molecules/year-group-default/index.html
prototype-design/visual-comparisons/component-system/public/molecules/pub-show-row-default/index.html
```

## Step 17: Add broad public organism coverage batch

This step continued the public-site coverage pass and added comparison coverage for ten public organism/section components.

### Prompt Context

**User prompt (verbatim):** "continue, do as many as you can."

Then, after the first run appeared stuck:

**User prompt (verbatim):** "it seems that we're hanging on something? I also installed a new version of css-visual-diff, hopefully it still works after all the changes we did (add js support). Sourcecode is: /home/manuel/code/wesen/corporate-headquarters/css-visual-diff"

**Assistant interpretation:** Continue broad coverage, diagnose the apparent hang, and account for the newly installed `css-visual-diff` behavior.

### What I did

- Added public organism states to the existing Storybook public diff fixture:

```text
PubNav
PubFooter
PubHero
AboutHero
VenueCard
SpaceInfo
EthosStrip
MailingListCTA
BookingRules
BookingSuccess
```

- Added matching prototype fixture states to:

```text
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
```

- Generated ten public organism configs under:

```text
prototype-design/visual-diff/comparisons/component-system/public/organisms/
```

- Ran typecheck successfully:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

- Ran full css-visual-diff modes for all ten public organism configs:

```text
capture
cssdiff
matched-styles
pixeldiff
html-report
```

- Updated the parity map with ten new public organism entries, all `needs-review`.
- Inspected selected PNG comparison images for `PubNav`, `PubFooter`, and `EthosStrip`.

### Hang diagnosis

The apparent hang was not primarily a `css-visual-diff` regression. I accidentally inserted the organism fixture rows inside the `FixtureRow` helper component in `PublicDiffFixture.stories.tsx`, which made `FixtureRow` recursively render itself. Storybook could load the iframe HTML, but the story render never reached the expected selector, so `css-visual-diff` waited until the external timeout killed it.

Fix:

- Removed the recursive fixture rows from inside `FixtureRow`.
- Kept the organism rows only inside `PublicDiffFixture`.
- Re-ran typecheck and visual-diff successfully.

One observation remains useful for tool maintenance: a missing selector or story-render failure can still look like a hang when an outer `timeout` kills the process. `css-visual-diff` should ideally fail fast and clearly when `wait_for_timeout_ms` is reached; this is worth rechecking against the new JS-support build later.

### Results

All ten configs have valid coverage:

```text
coverage total: 2
original_missing: 0
react_missing: 0
```

Pixel results:

```text
public-organisms-about-hero-default          component 18.2695%; root 15.2161%
public-organisms-booking-rules-default       component/root 69.4857%
public-organisms-booking-success-default     component 7.3591%; root 9.3157%
public-organisms-ethos-strip-default         component 99.5143%; root 99.5322%
public-organisms-mailing-list-cta-default    component 15.9809%; root 10.8853%
public-organisms-pub-footer-default          component 0.2511%; root 0.3725%
public-organisms-pub-hero-default            component/root 10.7942%
public-organisms-pub-nav-default             component/root 1.4647%
public-organisms-space-info-default          component/root 14.0753%
public-organisms-venue-card-default          component/root 50.9131%
```

### What worked

The broad coverage approach worked after fixing the recursive fixture bug. `PubNav` and `PubFooter` are already quite close, and the deterministic artifacts make it clear which public organisms are implementation-only approximations versus close prototype matches.

### What didn't work

Some public organism matches are intentionally rough:

- `EthosStrip` compares a light prototype about-page ethos section to a dark React strip, producing ~99% diff.
- `VenueCard` compares a dark booking aside motif to a light React venue card/map placeholder.
- `BookingRules` compares a dark prototype booking aside copy block to a light React rules list.
- `AboutHero` compares a prototype PageHeader/about intro combination to the simplified React `AboutHero` component.

These are useful coverage targets but not ready for tuning without taxonomy/design decisions.

### What I learned

The public component folder contains several components that are only loosely grounded in prototype-named elements. Coverage is still valuable, but the parity map must clearly mark low-confidence targets where the prototype fixture is a hand-rendered approximation.

### What was tricky to build

The public fixture became large, and a naive string replacement inserted JSX in the wrong function. This caused an infinite render recursion. Future edits to fixture files should prefer direct `read` + exact `edit`, not broad string replacement.

### What warrants a second pair of eyes

- Whether `EthosStrip` should be dark in React or light like the prototype about page.
- Whether `VenueCard` and `BookingRules` should map to the dark booking-space aside instead of separate light cards.
- Whether `PubFooter` can be accepted with a small logo color/anti-aliasing difference after review.
- Whether `PubNav` should be tuned/accepted soon; it is close.

### What should be done in the future

- Commit this public organism coverage batch.
- Add `BookingForm` coverage separately, because it is a larger workflow component.
- Then consider public page-level coverage only after all lower-level elements are represented.

### Code review instructions

Review:

```text
web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
prototype-design/visual-diff/comparisons/component-system/public/organisms/*.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Validate:

```bash
cd web && pnpm --filter pyxis-components typecheck
cd ..
for cfg in prototype-design/visual-diff/comparisons/component-system/public/organisms/*.css-visual-diff.yml; do
  timeout 90s css-visual-diff run --config "$cfg" --modes capture,cssdiff,matched-styles,pixeldiff,html-report
done
```

## Step 18: Add BookingForm workflow coverage

This step added coverage for the remaining larger public workflow component, `BookingForm`.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue the public-site design-element coverage pass after the public organism batch, starting with the explicitly deferred `BookingForm` workflow.

### What I did

- Added `BookingForm` to the Storybook public diff fixture:

```text
web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx
```

- Added a hand-rendered prototype booking form state to:

```text
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
```

- Added a comparison config:

```text
prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-form-default.css-visual-diff.yml
```

- Ran typecheck successfully:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

- Ran full css-visual-diff modes:

```text
capture
cssdiff
matched-styles
pixeldiff
html-report
```

- Inspected the generated PNG comparison with the image-reading path.
- Updated the parity map with `public-organisms-booking-form-default`.

### Result

Coverage is valid:

```text
coverage total: 2
original_missing: 0
react_missing: 0
```

Pixel result:

```text
public-organisms-booking-form-default component/root 12.0664% | 46219/383040
```

Status: `needs-review`.

### Why it remains needs-review

The prototype booking form and React `BookingForm` are related but not identical. The prototype has the public-site underline form style and fewer/different fields. React uses the current atom `Input`, `Select`, `Textarea`, and `Button` components, includes required/hint text, and has additional fields such as genre, links, tech rider, and anything else.

The comparison is useful coverage, but it should not be tuned blindly until field taxonomy and public booking-form requirements are decided.

### What worked

The new `css-visual-diff` build ran successfully for this target after the earlier fixture recursion was fixed.

### What warrants a second pair of eyes

- Whether public booking forms should use underline public styling or generic atom field styling.
- Whether React `BookingForm` should match the prototype field set more closely.
- Whether prototype form controls should become public-specific atoms/molecules.

### Code review instructions

Review:

```text
web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-form-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Validate:

```bash
cd web && pnpm --filter pyxis-components typecheck
cd ..
css-visual-diff run   --config prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-form-default.css-visual-diff.yml   --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```


## Step 19: Add missing public Shows poster/tile/grid React components

This step addressed the missing design elements from `prototype-design/standalone/public/shows.html`: the flyer/poster, the show tile that combines poster + metadata + ticket pill, and the desktop poster grid.

### Prompt Context

**User prompt (verbatim):** "Ok, what about molecules / organisms for Shows (file:///home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/standalone/public/shows.html) do we already have them for the show with the flyer?"

Follow-up:

**User prompt (verbatim):** "ok, let's go through missing react components, including the poster one, and add them. be thorough"

**Assistant interpretation:** The new public molecule/organism coverage missed prototype Shows-page poster/flyer components. Add missing React components and parity coverage rather than only recording the gap.

### What I did

- Confirmed existing coverage did not include `Poster`, `ShowTile`, or `ShowGrid` in the new component-system parity map.
- Confirmed older configs under `prototype-design/visual-diff/public-components/` are prototype-only captures for `PPXCatalogPoster`, `PPXCatalogShowTile`, and `PPXCatalogShowGrid`, not React parity configs.
- Added React public components:

```text
web/packages/pyxis-components/src/public/Poster/Poster.tsx
web/packages/pyxis-components/src/public/ShowTile/ShowTile.tsx
web/packages/pyxis-components/src/public/ShowGrid/ShowGrid.tsx
```

- Added component indexes and Storybook stories:

```text
web/packages/pyxis-components/src/public/Poster/index.ts
web/packages/pyxis-components/src/public/Poster/Poster.stories.tsx
web/packages/pyxis-components/src/public/ShowTile/index.ts
web/packages/pyxis-components/src/public/ShowTile/ShowTile.stories.tsx
web/packages/pyxis-components/src/public/ShowGrid/index.ts
web/packages/pyxis-components/src/public/ShowGrid/ShowGrid.stories.tsx
```

- Exported the new components from:

```text
web/packages/pyxis-components/src/index.ts
```

- Added poster/tile/grid states to the public diff fixture:

```text
web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
```

- Added parity configs:

```text
prototype-design/visual-diff/comparisons/component-system/public/molecules/poster-redroom.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/show-tile-redroom.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/show-grid-desktop.css-visual-diff.yml
```

- Ran typecheck successfully after loosening `ShowTileShow.age` to support prototype age strings like `25+`:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

- Ran full css-visual-diff modes for the three new targets.
- Inspected the generated show tile PNG comparison.
- Updated the parity map with three new entries.

### Results

All three configs have valid coverage:

```text
coverage total: 2
original_missing: 0
react_missing: 0
```

Pixel results:

```text
public-molecules-poster-redroom       component/root 6.8201%
public-molecules-show-tile-redroom    component/root 5.2514%
public-organisms-show-grid-desktop    component/root 4.1504%
```

All remain `needs-review`.

### Why this matters

The prototype Shows page is fundamentally poster-grid based. Before this step, the React component library only exposed list/hero components (`PubHero`, `PubShowRow`) and did not have a first-class poster/flyer molecule. This made the public Shows page impossible to align with `standalone/public/shows.html` bottom-up.

### What worked

The first pass components are now visible in Storybook and in the component-system parity map. They are close enough to validate the intended comparison path and expose remaining visual drift.

### What didn't work / caveats

- The React `Poster` currently uses a reusable variant data model rather than verbatim one-off JSX for every prototype poster. This is maintainable but not yet pixel-perfect for each poster.
- The prototype fixture for `ShowGrid` currently covers a small desktop subset in the component-system fixture, not the full six-show standalone page grid.
- The user-site `Shows` page still renders the existing `PubHero` + `PubShowRow` layout. Wiring `ShowGrid` into the actual page should be a separate product/design decision.

### What warrants a second pair of eyes

- Whether the public site should switch back to the poster-grid Shows page design.
- Whether `Poster` should support more per-variant slots/renderers for exact flyer designs.
- Whether `ShowTile` should be the canonical replacement for `PubShowRow` on the Shows page.

### Code review instructions

Review the new component API and Storybook taxonomy first:

```text
web/packages/pyxis-components/src/public/Poster/Poster.tsx
web/packages/pyxis-components/src/public/ShowTile/ShowTile.tsx
web/packages/pyxis-components/src/public/ShowGrid/ShowGrid.tsx
web/packages/pyxis-components/src/public/*/*.stories.tsx
```

Then validate parity:

```bash
cd web && pnpm --filter pyxis-components typecheck
cd ..
for cfg in \
  prototype-design/visual-diff/comparisons/component-system/public/molecules/poster-redroom.css-visual-diff.yml \
  prototype-design/visual-diff/comparisons/component-system/public/molecules/show-tile-redroom.css-visual-diff.yml \
  prototype-design/visual-diff/comparisons/component-system/public/organisms/show-grid-desktop.css-visual-diff.yml; do
  css-visual-diff run --config "$cfg" --modes capture,cssdiff,matched-styles,pixeldiff,html-report
done
```

## Step 20: Task missing standalone public-page components in batches

The remaining public-page molecules/organisms from `detail.html`, `archive.html`, `book.html`, and `about.html` were converted into explicit task batches before implementation.

Batches:

- Batch A: shared `PublicPageHeader` and detail-page molecules (`ReserveTicketCard`, `ShowDetailHeader`, `ShowMetaStrip`, `SafetyNote`).
- Batch B: archive components (`ArchiveSearchFilters`, `ArchiveShowRow`, `ArchiveShowList`).
- Batch C: book-page components (`ShowTypeChips`, `BookingSpaceAside`, `SaferSpaceAgreement`).
- Batch D: about-page components (`AboutIntro`, `EthosGrid`, `CollectiveList`, `FindUsBlock`).

The purpose is to preserve a clear implementation queue and make it obvious which standalone prototype page each batch comes from.

## Step 21: Implement remaining standalone public-page components and parity coverage

Implemented all remaining batched standalone public-page components: shared page header, detail-page parts, archive filters/rows/list, book-page chips/aside/agreement, and about-page intro/ethos/collective/find-us blocks.

Validation:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

passed.

Created Storybook stories for each new component, exported them from the package barrel, added all components to `PublicDiffFixture`, added matching prototype fixture states, generated 15 parity configs, and ran full `css-visual-diff` modes for each config.

All 15 comparison configs have valid coverage (`total: 2`, no missing/hidden selectors). Notable exact/near-exact results include `PublicPageHeader`, `ShowDetailHeader`, `ShowMetaStrip`, `ShowTypeChips`, `ArchiveShowRow`, and `ArchiveShowList`. `BookingSpaceAside` remains high-diff because the prototype fixture currently includes abbreviated aside content while the React component includes the fuller specs list.

## Step 22: Tune first public molecule/organism mismatch batch

Before page-level comparisons, I started tuning public molecules/organisms that had obvious concept/style mismatches.

Changes:

- `ArchiveStats` no longer composes generic `Stat` cards; it now renders the flat public archive stats strip.
- `TicketStub` now renders the bordered public ticket card motif directly instead of unstyled classes.
- `LineupRow` now uses the prototype lineup row layout: time column, artist, italic subtitle, and top rule.
- `EthosStrip` moved away from the dark strip design toward the light prototype ethos grid motif.
- `BookingRules` now matches the dark booking aside motif used by the prototype fixture.
- `VenueCard` now matches the dark venue/space aside motif used in detail/book references.
- `BookingSpaceAside` prototype fixture was expanded to the full aside content so its comparison is meaningful.

Validation:

```bash
cd web && pnpm --filter pyxis-components typecheck
```

passed after the component changes.

Re-run results:

```text
ArchiveStats          component/root 7.0987%   (was 12.3927%)
TicketStub            component/root 0.3144%   (was 19.1037%)
LineupRow             component 5.3400%; root 6.5709% (was ~11.5%)
EthosStrip            component 9.6481%; root 7.4975% (was ~99.5%)
BookingRules          component/root 6.3640%   (was 69.4857%)
VenueCard             component/root 0.0000%   (was 50.9131%)
BookingSpaceAside     component/root 2.0293%   (was 64.0453%)
```

Notes:

- `ArchiveStats` is visually much closer but still has text/font antialiasing/height residuals.
- `EthosStrip` is now conceptually aligned with the light about-page ethos section, but `EthosGrid` may be the canonical component long-term.
- `VenueCard` is now exact for the current fixture, but this effectively reclassifies it toward a dark venue aside; review whether `VenueCard` should keep this role or be split.
