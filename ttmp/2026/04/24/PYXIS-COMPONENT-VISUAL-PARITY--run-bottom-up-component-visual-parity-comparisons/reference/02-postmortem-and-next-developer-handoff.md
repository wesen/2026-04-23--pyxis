---
Title: Postmortem and next-developer handoff
Ticket: PYXIS-COMPONENT-VISUAL-PARITY
Status: active
Topics:
  - frontend
  - storybook
  - css-visual-diff
  - visual-regression
  - prototype
DocType: reference
Intent: handoff
Summary: Long-form end-of-week postmortem for the Pyxis prototype-to-Storybook visual parity workflow, written as a practical textbook chapter for the next developer.
LastUpdated: 2026-04-24T00:00:00Z
---

# Pyxis Component Visual Parity: Postmortem and Next-Developer Handoff

## 0. What this document is

This document is the end-of-week memory dump for the Pyxis component visual parity work. It is deliberately detailed. Tomorrow, when the terminal scrollback is gone and the exact sequence of commands is no longer in working memory, this should be enough to reconstruct the mental model, repeat the validated workflow, and avoid the mistakes we already paid for.

The work has one central idea:

> Compare small things before large things. A button can be made pixel-perfect. A page cannot be understood until its buttons, badges, inputs, cards, rows, and sections are already trustworthy.

This week we built the first working version of that idea. We connected the prototype source of truth to the Storybook implementation through `css-visual-diff`, then used the resulting screenshots, CSS diffs, and pixel diffs to repair React components. We validated the workflow on atoms before moving to molecules or pages.

By the end of the day, nine atom states reached `0.0000%` pixel difference against the prototype fixture:

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

Two of those comparisons found real implementation drift and guided React fixes:

```text
Input
Textarea
```

That matters. A workflow that only produces reports is documentation. A workflow that finds drift, explains it, and lets us fix it is engineering infrastructure.

---

## 1. The system we are building

The Pyxis frontend now has three related but distinct visual systems.

The first system is the **prototype**. It lives under `prototype-design/`, and it is the design source of truth. The important files are:

```text
prototype-design/Pyxis Public Site.html
prototype-design/Pyxis Full App.html
prototype-design/Pyxis Mobile.html
```

These files are not simple static screenshots. They contain React prototypes and global component functions. To capture them reliably, `css-visual-diff` often has to load the HTML page, wait for globals like `React`, `ReactDOM`, `Btn`, `Badge`, or `SystemPage`, and then run a prepare script that renders a clean fixture into a capture root.

The second system is the **React implementation**. It lives under:

```text
web/packages/pyxis-components/
web/packages/pyxis-user-site/
```

For the visual parity workflow, the component library is the first focus. It has a Storybook build at:

```text
web/packages/pyxis-components/storybook-static/
```

The third system is the **evidence layer**. This is where we store baseline captures, Storybook captures, and actual prototype-vs-Storybook comparisons:

```text
prototype-design/baseline/                  # prototype-only baselines
prototype-design/storybook-catalog/         # Storybook-only implementation catalog
prototype-design/visual-diff/comparisons/   # runnable comparison configs
prototype-design/visual-comparisons/        # generated comparison outputs, ignored by git
```

The separation is important. A prototype baseline answers, “What did the prototype render?” A Storybook catalog capture answers, “What did the React implementation render?” A visual comparison answers, “How do these two exact visual objects differ?”

If those layers are mixed together, the workflow becomes hard to reason about. If they stay separate, a future developer can inspect each layer independently.

---

## 2. Why bottom-up comparison is the core strategy

It is tempting to start with a full page. The public site is what the user sees, so comparing `Shows` or `Book` might feel like the fastest route to visual parity. In practice, page-level diffs are too noisy at the beginning. One page diff can contain typography differences, spacing differences, component drift, fixture data mismatches, responsive layout differences, and selector mistakes all at once. The report tells you that the page differs, but it does not tell you what to fix first.

A bottom-up workflow gives each difference a smaller search space.

```text
atoms
  ↓
molecules
  ↓
organisms
  ↓
public-domain components
  ↓
sections
  ↓
pages
```

An atom-level comparison says, “This one button differs.” The CSS diff can then point at `padding`, `font-size`, `border-radius`, or `background-color`. The pixel diff can show whether the icon is shifted by two pixels or whether text antialiasing changed. That is actionable.

Once atoms are close, molecule diffs become more meaningful. If a `Field` differs, we can assume the nested `Input` is already close and focus on label spacing, error text, and wrapper layout. Once molecules are close, organism diffs become meaningful. Once organisms are close, page-level comparisons become useful rather than overwhelming.

This week validated that strategy. We did not need to guess whether the workflow would work on pages; we proved it on atoms.

---

## 3. The selector contract that made this possible

Early Storybook captures were too broad. The clearest failure was Badge: the screenshot captured a Storybook wrapper rather than the badge itself. That made any comparison meaningless because the crop was wrong before the visual diff even started.

The fix was to give every component a stable, namespaced capture contract:

```html
data-pyxis-component="<component-slug>"
data-pyxis-part="root"
```

Examples:

```html
<button data-pyxis-component="button" data-pyxis-part="root">
<span data-pyxis-component="badge" data-pyxis-part="root">
<div data-pyxis-component="input" data-pyxis-part="root">
<textarea data-pyxis-component="textarea" data-pyxis-part="control">
```

The helper is:

```text
web/packages/pyxis-components/src/utils/parts.ts
```

The helper lets components write:

```tsx
<button {...pyxisPart('button')}>Get tickets</button>
<span {...pyxisPart('badge', 'label')}>{children}</span>
<input {...pyxisPart('input', 'control')} />
```

The point of this contract is not just testing. It is a stable interface between the rendered DOM and tools that need to understand the DOM. Screenshots, CSS extraction, Playwright tests, theme tooling, and future design-system inspectors can all use the same handle.

The contract also forced us to remove older ad hoc attributes like:

```html
data-part="btn"
data-part="badge"
data-part="field"
```

Those names were too inconsistent to drive automation. The new contract is boring, predictable, and therefore useful.

---

## 4. Storybook catalog versus visual comparison

There are two Storybook-related workflows, and it is easy to confuse them.

The **Storybook catalog** captures the implementation side by itself. It asks: “Can every story render a focused `capture-target` screenshot?” It is generated from Storybook’s `index.json` and stored under:

```text
prototype-design/storybook-catalog/
```

The current catalog has:

```text
total: 89 stories
atoms: 47
molecules: 18
organisms: 4
public: 20
```

The **visual parity workflow** compares one prototype target to one Storybook target. It asks: “Do these two equivalent visual objects match?” Those configs live under:

```text
prototype-design/visual-diff/comparisons/
```

This distinction matters because a good Storybook capture is only a prerequisite. It does not prove parity. A Button story can be perfectly captured and still visually differ from the prototype. The comparison config is what pairs that story with a prototype fixture and runs `capture`, `cssdiff`, `matched-styles`, `pixeldiff`, and `html-report`.

---

## 4.1 What the parity map is

The parity map is the hand-curated inventory of prototype-to-Storybook comparison pairs:

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

It answers these practical questions for each component state:

```text
What are we comparing?        level, component, state, slug
Where does prototype come from? source HTML, prepare script, selectors
Where does Storybook come from? story id, selectors
How do we run/review it?      config path, output dir, report path
What is the current verdict?  status, pixel diff, CSS diff, confidence, notes
```

It is not generated evidence and it is not just documentation. Treat it as the source-of-truth queue for bottom-up parity work. New targets start as `planned` or `in-progress`, then become `accepted` only after the selector/crop/CSS-probe/full-run loop has been validated and the result has been recorded.

The parity map should eventually drive config generation and index generation. For now it keeps the work reproducible: if a future developer asks “which Card state are we comparing and which Storybook story is supposed to match it?”, the answer should be in the map before it is in terminal history.

## 5. The validated atom fixture strategy

The atom comparisons use a shared fixture idea. Both sides render the same list of atom examples and label each comparison target with the same `data-comp` wrapper.

Prototype fixture prepare script:

```text
prototype-design/visual-diff/scripts/fixtures/atom-fixture-prepare.js
```

Storybook fixture:

```text
web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx
```

The shared wrappers look like this:

```html
data-comp="button-primary"
data-comp="badge-confirmed"
data-comp="tag-default"
data-comp="input-search"
data-comp="select-status"
data-comp="avatar-md"
data-comp="icon-calendar"
data-comp="icon-button"
data-comp="textarea-notes"
```

The comparison config can then use the same wrapper name on both sides:

```yaml
sections:
  - name: component
    selector_original: "[data-comp='button-primary']"
    selector_react: "[data-comp='button-primary']"
```

But the CSS probe can still point at different internal DOM shapes:

```yaml
styles:
  - name: root
    selector_original: "[data-comp='input-search'] input"
    selector_react: "[data-comp='input-search'] [data-pyxis-component='input'][data-pyxis-part='control']"
    include_bounds: true
```

That is the pattern to remember: **same logical fixture wrapper, side-specific implementation selector**.

---

## 6. The current comparison workflow

A comparison should move through four layers. Each layer answers a different question.

### Layer 1: Does the DOM exist?

Use `html --root` or inspect artifacts when selectors are failing:

```bash
css-visual-diff html \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml \
  --side original \
  --root \
  --output-file /tmp/input-original-root.html

css-visual-diff html \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml \
  --side react \
  --root \
  --output-file /tmp/input-react-root.html
```

If the target element is not in the prepared HTML, do not tune CSS. Fix the URL, wait condition, prepare script, Storybook ID, or fixture first.

### Layer 2: Is the screenshot crop correct?

```bash
css-visual-diff screenshot \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml \
  --side original \
  --section input \
  --output-file /tmp/input-original.png

css-visual-diff screenshot \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml \
  --side react \
  --section input \
  --output-file /tmp/input-react.png
```

Open both PNGs with `read`. A config is not ready if one crop includes a wrapper, a neighboring field, or a different state.

### Layer 3: Is the CSS probe meaningful?

```bash
css-visual-diff css-md \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml \
  --side original \
  --style root \
  --output-file /tmp/input-original-css.md

css-visual-diff css-md \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml \
  --side react \
  --style root \
  --output-file /tmp/input-react-css.md
```

The CSS probe should point at the element that owns the visual properties you care about. For `Input`, that is the actual `input`/control element. For `Button`, it is the button root. For `Badge`, it is the badge root. For `Icon`, it is the SVG.

### Layer 4: Run the full comparison

Only after the first three layers are correct:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml \
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

This sequence is now validated. Do not shortcut it for new component pairs.

---

## 7. What the atom sweep proved

The accepted atom comparison set is:

| Component state | Config | Result | Lesson |
| --- | --- | --- | --- |
| Button primary | `button-primary.css-visual-diff.yml` | `0.0000%` pixel diff | The basic workflow works. |
| Badge confirmed | `badge-confirmed.css-visual-diff.yml` | `0.0000%` pixel diff | CSS property lists must be component-aware. |
| Tag default | `tag-default.css-visual-diff.yml` | `0.0000%` pixel diff | Simple inline atoms compare cleanly. |
| Input search | `input-search.css-visual-diff.yml` | `0.0000%` pixel diff after fixes | CSS + pixel diff can drive real React repair. |
| Select status | `select-status.css-visual-diff.yml` | `0.0000%` pixel diff | Browser control display differences can be harmless. |
| Avatar md | `avatar-md.css-visual-diff.yml` | `0.0000%` pixel diff | Box-sizing may differ while pixels match. |
| Icon calendar | `icon-calendar.css-visual-diff.yml` | `0.0000%` pixel diff | SVG-specific props matter more than generic box-model props. |
| IconButton edit | `icon-button.css-visual-diff.yml` | `0.0000%` pixel diff | Button-like icon controls compare well with root probes. |
| Textarea notes | `textarea-notes.css-visual-diff.yml` | `0.0000%` pixel diff after fixes | Missing fixture states should be added to both sides before comparing. |

The important result is not just that the numbers are zero. The important result is that the workflow caught real drift and helped us fix it.

---

## 8. Problems encountered and what they taught us

### 8.1 The output directory surprise

The first Button comparison used:

```yaml
output:
  dir: prototype-design/visual-comparisons/component-system/atoms/button-primary
```

We expected that path to resolve from the repository root. Instead, `css-visual-diff` resolved it relative to the config file directory and wrote nested output under:

```text
prototype-design/visual-diff/comparisons/component-system/atoms/prototype-design/visual-comparisons/...
```

The current workaround is to use absolute output paths:

```yaml
output:
  dir: /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-comparisons/component-system/atoms/button-primary
```

This is not ideal for portability, but it is explicit and avoids confusing generated artifacts during hand-authored validation.

The long-term fix should be either a Pyxis config generator or a `css-visual-diff` feature for repo-root-relative output paths.

### 8.2 CSS differences are not automatically visual bugs

Badge, Avatar, and Icon all produced `0.0000%` pixel diffs while initially showing harmless CSS differences such as:

```text
box-sizing: content-box vs border-box
width/height differences caused by box-sizing semantics
```

The lesson is that CSS diff is evidence, not a verdict. A CSS property list is a design decision. It says what we care about for that component.

For an auto-sized inline badge, the meaningful properties are things like:

```text
padding
gap
font-size
font-weight
line-height
color
background-color
border-radius
```

For a fixed-size avatar, `width` and `height` are meaningful. For an SVG icon, `stroke-width`, `width`, `height`, and `color` are meaningful. For a browser-native `select`, `display` might not be meaningful if pixels and bounds match.

### 8.3 Pixel diff can localize what CSS diff cannot

The `Input` comparison is the best example. CSS diff first identified box sizing drift. After that was fixed, the remaining pixel diff was small and localized to the search icon. The CSS diff did not directly say, “Your icon is positioned differently because the SVG itself is absolute rather than a wrapper.” The diff image made that obvious.

The fix was to change React from positioning the SVG directly to wrapping the SVG in a positioned span, matching the prototype structure:

```tsx
<span className="pyxis-field__icon" aria-hidden {...pyxisPart('input', 'icon')}>
  <Icon name={icon} size={14} />
</span>
```

The lesson is that the loop is multi-modal:

```text
CSS diff finds property drift.
Pixel diff localizes visual residue.
Screenshot review validates crops.
The developer decides what is a real bug.
```

### 8.4 Missing fixture states must be added, not guessed around

Textarea was present as a component, but not present in the shared atom fixture. We could have compared the standalone Storybook Textarea story to some prototype Textarea inside a modal or public form. That would have been weaker, because the surrounding context and state would not be identical.

Instead, we added the same `textarea-notes` state to both fixtures. That made the comparison precise and gave us a reliable Textarea fix.

This is the pattern to use later for molecules: if the exact state is missing, add it to both sides.

### 8.5 Run the real Storybook dev server in tmux

Do not use the old static-build loop for normal parity work. The earlier workflow rebuilt `storybook-static/` and served it with `python3 -m http.server`; that is slow, easy to forget after React edits, and can accidentally compare stale JavaScript.

Use the real Storybook dev server in a long-lived `tmux` session instead. It watches the component source and auto-refreshes the iframe at `localhost:6006`:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis

tmux new-session -d -s pyxis-components-storybook \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-components storybook'

# Check that Storybook is ready.
tmux capture-pane -pt pyxis-components-storybook -S -80
```

If the session already exists, interrupt and restart it:

```bash
tmux send-keys -t pyxis-components-storybook C-c \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-components storybook' Enter
```

Keep `pnpm --filter pyxis-components typecheck` as a validation step, but do not rebuild and serve static Storybook for every visual-diff iteration.

---

## 9. Current documentation state

We have useful documentation, but it is spread across too many places.

Important docs right now:

```text
docs/playbooks/02-html-prototype-baseline-extraction-playbook.md
docs/playbooks/04-storybook-component-capture-playbook.md
docs/component-system-and-public-site-components.md
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--.../analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--.../reference/01-diary.md
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--.../reference/02-postmortem-and-next-developer-handoff.md
```

The documentation is enough to continue, but not yet clean enough for a new developer to discover the workflow quickly.

The recommended consolidation is a new repo-root playbook:

```text
docs/playbooks/05-bottom-up-component-visual-parity.md
```

That playbook should become the single canonical entrypoint. It should absorb the stable parts of the ticket analysis and this postmortem:

1. Why bottom-up comparison matters.
2. Directory layout.
3. How to choose a component pair.
4. How to add matching fixture states.
5. How to write the YAML config.
6. The inspect-first workflow.
7. How to run deterministic modes.
8. How to interpret CSS and pixel diffs.
9. How to update the parity map.
10. Known `css-visual-diff` quirks.
11. How to move from atoms to molecules to pages.

Ticket docs should remain as historical evidence. The repo playbook should become the daily working document.

---

## 10. The next person’s first hour tomorrow

Start by checking the repo and ticket state:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
git status --short
docmgr doc list --ticket PYXIS-COMPONENT-VISUAL-PARITY
docmgr task list --ticket PYXIS-COMPONENT-VISUAL-PARITY
```

Read this document first, then the implementation guide:

```text
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md
```

Re-run one known-good atom comparison to verify the environment:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

Then do these in order:

```text
1. Confirm the real Storybook dev server is running in tmux.
2. Re-run the accepted Card default molecule comparison if you need an environment sanity check.
3. Continue molecule Batch B with Field default.
4. Then Field error, Stat default, and Empty with CTA.
```

The atom fixture prepare script has now been promoted and the atom configs have been updated to use the canonical path:

```text
prototype-design/visual-diff/scripts/fixtures/atom-fixture-prepare.js
```

The first molecule fixture and Card default comparison have also been added. Treat Card default as the molecule-level smoke test before extending the batch.

---

## 11. Next workflow step: molecules

Once the fixture script is canonical, start molecules. Do not jump to public pages.

Recommended order:

```text
Card default
Field default
Field error
Stat default
Empty with CTA
```

For each molecule, follow the same pattern as atoms:

1. Add or identify matching prototype fixture state.
2. Add or identify matching Storybook story/fixture state.
3. Write a config under:

```text
prototype-design/visual-diff/comparisons/component-system/molecules/
```

4. Inspect screenshots.
5. Inspect CSS probes.
6. Run full deterministic modes.
7. Fix React if the pair is valid and the diff is real.
8. Update `component-parity-map.json`.
9. Record diary/changelog.
10. Keep the real Storybook dev server running in `tmux` so Storybook iframe changes auto-refresh while configs and React fixtures evolve.

Molecules will probably require more than one CSS probe. A `Field` might need probes for:

```text
root
label
control
hint/error
```

A `Card` might need probes for:

```text
root
body
header
footer
```

This is normal. A screenshot section says what visual region to compare. CSS probes say which parts inside that region own meaningful visual properties.

---

## 12. Potential workflow improvements

### 12.1 Generate configs from the parity map

Hand-authored configs were fine for validation, but they are repetitive. Add a generator:

```text
prototype-design/visual-diff/scripts/23-generate-component-parity-configs.mjs
```

Input:

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Output:

```text
prototype-design/visual-diff/comparisons/component-system/**/*.css-visual-diff.yml
```

The generator should solve:

- absolute output paths,
- common prepare boilerplate,
- repeated mode lists,
- consistent metadata,
- fewer copy/paste mistakes.

### 12.2 Build a comparison index

We have a prototype baseline index and a Storybook catalog index. We need a comparison index.

Suggested script:

```text
prototype-design/visual-diff/scripts/24-build-component-parity-index.mjs
```

Suggested output:

```text
prototype-design/visual-comparisons/index.html
```

Each card should show:

```text
component/state
status
pixel diff percentage
CSS diff count
links to html report
links to original/react/diff images
notes / accepted differences
```

### 12.3 Add a batch runner with continue-on-error

`css-visual-diff run --config-dir` fails fast. That is useful when enforcing correctness, but not ideal for exploratory triage.

Add a Pyxis wrapper:

```text
prototype-design/visual-diff/scripts/25-run-component-parity-batch.sh
```

Desired behavior:

- run every selected config,
- continue on failure,
- write logs per config,
- print summary table,
- return non-zero if anything failed.

### 12.4 Improve `css-visual-diff` output path semantics

The current relative `output.dir` behavior surprised us. Potential improvements:

```yaml
output:
  base_dir: repo-root
  dir: prototype-design/visual-comparisons/component-system/atoms/input-search
```

or variable interpolation:

```yaml
output:
  dir: "${REPO_ROOT}/prototype-design/visual-comparisons/component-system/atoms/input-search"
```

### 12.5 Add property profiles

CSS property lists should be component-aware. Instead of copying long arrays by hand, `css-visual-diff` or our generator could support profiles:

```text
atom-inline
form-control
svg-icon
button-control
surface-card
text-label
```

Then a config could say:

```yaml
styles:
  - name: root
    selector_react: "..."
    profile: form-control
```

### 12.6 Track accepted differences explicitly

The parity map should support accepted differences:

```json
"acceptedDifferences": [
  {
    "kind": "css",
    "property": "display",
    "reason": "Native select renders pixel-perfect despite inline-block vs block."
  }
]
```

This prevents future workers from rediscovering the same harmless differences.

### 12.7 LLM review should be optional and evidence-based

LLM review can help triage screenshots, but it should never replace deterministic artifacts. The ideal prompt should include:

- original screenshot,
- React screenshot,
- diff image,
- CSS diff markdown,
- component/state metadata.

The workflow must still work when LLM provider configuration, quota, or billing fails.

---

## 13. Tooling feedback for `css-visual-diff`

We are effectively alpha-testing the tool. These are the most important feedback items so far:

1. **YAML `run` is much more useful than direct `compare` for Pyxis.** Prepared prototype targets need rich prepare hooks and side-specific selectors.
2. **Relative `output.dir` behavior needs clearer documentation or a new base-dir option.** The current behavior is easy to misunderstand.
3. **CSS diff needs interpretation helpers.** Raw property differences are useful, but not all differences are bugs.
4. **Batch workflows need continue-on-error.** Failing fast is good for CI; exploratory visual audits need summaries.
5. **A first-class parity map concept would be valuable.** Many configs share the same shape and differ only by selectors, states, and output dirs.
6. **HTML reports are essential.** They turn a pile of images/JSON/markdown into something reviewable.
7. **Single-artifact commands are the right debugging interface.** `screenshot`, `css-md`, and `html --root` are the fastest way to fix selectors.

---

## 14. What to commit and what not to commit

Commit:

```text
comparison configs
parity map
React fixes
Storybook fixture changes
prototype fixture scripts
playbooks / ticket docs / diary / changelog
```

Do not commit:

```text
prototype-design/visual-comparisons/
```

That directory contains generated comparison output. It is useful locally and maybe in CI artifacts later, but it should not dirty git status during normal work.

---

## 15. Final recommendations

The workflow is ready to scale one level up, but only after one cleanup step.

Do this next:

```text
1. Promote the atom prepare script to prototype-design/visual-diff/scripts/fixtures/.
2. Write docs/playbooks/05-bottom-up-component-visual-parity.md.
3. Start Card default comparison using the real Storybook dev server in `tmux`, not a static build served by Python.
4. Then Field, Stat, Empty.
```

Do not do this yet:

```text
full public page diffs
large page sections
public-site visual parity before generic molecules are understood
```

The atom work proved the mechanism. The molecule work will prove whether the mechanism scales.

---

## 16. One-page memory aid

If you only remember one page tomorrow, remember this:

```text
Use matching fixtures.
Inspect before comparing.
Run deterministic modes.
Treat CSS diff as evidence, not verdict.
Use pixel diff to localize visual residue.
Fix React only after the pair is valid.
Update the parity map and diary.
Move bottom-up: atoms → molecules → organisms → public components → pages.
```

Known-good command:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

Known-good result:

```text
0.0000% pixel diff
no CSS diff
```

Known next target:

```text
Card default molecule comparison
```
