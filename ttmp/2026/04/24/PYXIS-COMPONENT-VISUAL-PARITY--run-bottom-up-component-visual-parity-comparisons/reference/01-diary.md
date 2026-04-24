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

