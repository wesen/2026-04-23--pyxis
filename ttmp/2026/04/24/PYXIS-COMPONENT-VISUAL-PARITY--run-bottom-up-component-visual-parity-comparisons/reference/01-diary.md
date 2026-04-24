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
    - Path: prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml
      Note: First runnable atom comparison config
    - Path: prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
      Note: Initial atom parity map
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
