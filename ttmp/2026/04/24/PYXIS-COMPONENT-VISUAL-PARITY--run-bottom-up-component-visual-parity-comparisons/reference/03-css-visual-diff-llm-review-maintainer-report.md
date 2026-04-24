---
Title: css-visual-diff LLM Review Maintainer Report
Ticket: PYXIS-COMPONENT-VISUAL-PARITY
Status: active
Topics:
  - css-visual-diff
  - llm-review
  - visual-regression
  - multimodal-ai
  - storybook
DocType: reference
Intent: maintainer-handoff
Summary: Detailed report on css-visual-diff llm-review behavior during Pyxis component visual parity work, with reproducible context, model observations, failure modes, and improvement recommendations for the css-visual-diff maintainer.
LastUpdated: 2026-04-24T00:00:00Z
---

# css-visual-diff `llm-review`: Maintainer Report from Pyxis Visual Parity Work

## 0. Executive summary

During Pyxis prototype-to-Storybook visual parity work, we tested `css-visual-diff llm-review` as an assistant for interpreting component-level visual differences. The deterministic comparison workflow is working well: atoms, molecules, and the first organism (`TopBar`) can be compared with config-driven `css-visual-diff run` modes and accepted when pixel/CSS evidence supports parity.

The `llm-review` command is promising, but in its current standalone form it is not reliable enough to use as a verdict layer for Pyxis component parity. It is useful as a triage/narration aid when its input evidence is correct and the model understands the artifacts. However, several observed failure modes make it easy for the LLM review to disagree with the deterministic config-run results:

1. **Standalone `llm-review` recomputes comparison evidence instead of consuming the already validated config-run artifacts.** For TopBar, the accepted config-run comparison reported `0.0000%` pixel diff for all relevant sections, while standalone `llm-review` reported non-zero pixel diffs for apparently equivalent selectors.
2. **Prepared HTML artifacts can lose the original Storybook/theme environment.** One GLM-5V run against generated `react-prepared.html` produced a broken React rendering with missing font/background/border. The model correctly analyzed that broken artifact, but it was not the current accepted Storybook rendering.
3. **Models over-index on computed CSS differences, especially `box-sizing`, `width`, and `height`, even when screenshots are visually identical or the config-run pixel diff is zero.** Prompt instructions help only partially.
4. **Some models misinterpret the triptych diff-comparison image.** `gpt-5-nano` interpreted the comparison image as multiple repeated TopBars rather than original/react/diff panels.
5. **Prompt customization is too limited.** The CLI exposes `--question`, but not a dedicated `--system-prompt`, `--review-instructions`, or evidence policy. Internally `ReviewOptions` has `SystemPrompt`, but the command does not expose it.
6. **Some provider/model runs return no assistant text.** Two GLM-5V runs with stronger visual-first prompts reached artifact generation but failed with `inference returned no assistant text`.

The most important maintainer recommendation is:

> Add a config-artifact-based LLM review path that runs from the exact artifacts produced by `css-visual-diff run` (`capture`, `cssdiff`, `matched-styles`, `pixeldiff`) instead of recomputing a fresh standalone comparison.

A strong second recommendation is:

> Make the default prompt and CLI controls visual-first: screenshots and pixel diff are primary; computed CSS is supporting evidence; CSS-only differences must not be reported as visual bugs unless visible in the screenshots or reflected in pixel diff.

---

## 1. Project context

### 1.1 Repository and task

Repository:

```text
/home/manuel/code/wesen/2026-04-23--pyxis
```

The Pyxis task is bottom-up visual parity between a prototype and a React/Storybook component library. The systems are:

```text
prototype-design/Pyxis Public Site.html        # prototype source loaded in browser
prototype-design/lib/components.jsx            # prototype global React components
web/packages/pyxis-components/                 # React implementation and Storybook
prototype-design/visual-diff/comparisons/      # css-visual-diff config files
prototype-design/visual-comparisons/           # generated local comparison artifacts, gitignored
```

The validated deterministic workflow uses config-driven runs like:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/organisms/topbar-default.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

For active Storybook work we run the real Storybook dev server in tmux:

```bash
tmux new-session -d -s pyxis-components-storybook \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-components storybook'
```

Storybook URL:

```text
http://localhost:6006
```

The prototype HTML is served separately on:

```text
http://localhost:7070/Pyxis%20Public%20Site.html
```

### 1.2 Current parity status

By the time of this report, deterministic config-run comparison had accepted:

Atoms:

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

Molecules:

```text
card-default
field-default
field-error
stat-default
empty-cta
```

First organism:

```text
topbar-default
```

For `topbar-default`, deterministic config-run output reported:

```text
topbar-default component   0.0000% | 0/78280
topbar-default root        0.0000% | 0/78280
topbar-default title-group 0.0000% | 0/17112
topbar-default actions     0.0000% | 0/4452
```

Generated report:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default/index.html
```

Generated screenshots:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default/original-component.png
prototype-design/visual-comparisons/component-system/organisms/topbar-default/react-component.png
prototype-design/visual-comparisons/component-system/organisms/topbar-default/pixeldiff_component_diff_comparison.png
```

The `pixeldiff_component_diff_comparison.png` triptych visually shows original, React, and diff panels with no red changed pixels in the diff panel.

---

## 2. Prior related LLM-review setup work

We referenced an earlier ticket dedicated to LLM review setup:

```text
ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/
```

Key prior findings:

- Profile registry path:

```text
/home/manuel/.pinocchio/config/profiles.yaml
```

- Z.ai profile slug:

```text
z-ai-glm-5v-turbo
```

- Profile shape:

```yaml
z-ai-glm-5v-turbo:
  slug: z-ai-glm-5v-turbo
  display_name: Z.ai GLM-5V Turbo
  inference_settings:
    chat:
      api_type: openai
      engine: glm-5v-turbo
      max_response_tokens: 2048
      stream: true
    api:
      base_urls:
        openai-base-url: https://api.z.ai/api/paas/v4
```

- Reproducible prior script:

```text
ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/scripts/01-run-button-primary-llm-review-zai.sh
```

- Prior model result: GLM-5V could correctly identify visible button differences once the selector targeted the actual button element, not a wrapper.
- Prior warning: `ai-review` mode was weaker than `llm-review` for Pyxis repair work because it reviews screenshots independently rather than comparing both sides with structured evidence.

---

## 3. How `llm-review` works today

Implementation files inspected:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/cmd/css-visual-diff/main.go
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/llm/review.go
```

The command is a standalone Cobra command:

```bash
css-visual-diff llm-review \
  --profile ... \
  --profile-registries ... \
  --url1 ... \
  --selector1 ... \
  --url2 ... \
  --selector2 ... \
  --props ... \
  --question ... \
  --out ...
```

The command flow in `cmd/css-visual-diff/main.go` is roughly:

```text
1. Resolve Pinocchio/Geppetto engine settings.
2. Build compare mode settings from CLI flags.
3. Generate a fresh CompareResult from url1/url2/selectors.
4. Write compare artifacts.
5. Call llm.ReviewCompare with Question and Evidence.
6. Write llm-review.json/md.
```

The internal `ReviewOptions` type supports:

```go
type ReviewOptions struct {
    Question       string
    Evidence       modes.CompareResult
    MaxProperties  int
    MaxWinnerDiffs int
    SystemPrompt   string
}
```

But the CLI currently only exposes `--question`, not `SystemPrompt`, `MaxProperties`, or `MaxWinnerDiffs`.

The default system prompt is:

```text
You are an expert frontend engineer and visual QA analyst. Use the provided screenshots and structured CSS/layout evidence to answer the user's question. Be concrete about visual changes, likely CSS causes, and user-facing impact.
```

`BuildReviewPromptText` always includes:

```text
Compare these two rendered UI regions and answer the question using both the screenshots and the structured evidence below.
...
Pixel diff summary:
...
Computed property changes:
...
Winning rule changes:
...
Answer in concise engineering prose. Mention the biggest visual shifts, likely CSS causes, and any important UX impact.
```

This explains why models tend to discuss CSS causes even when the user question asks them not to over-index on CSS. The user can steer the prompt through `--question`, but cannot change the surrounding system/task framing from the CLI.

---

## 4. Test target: `TopBar default`

### 4.1 Why TopBar was chosen

`TopBar default` was the first organism-level comparison after atoms and molecules. It includes several meaningful UI parts:

- breadcrumb text,
- display title,
- subtitle,
- two action buttons,
- flex layout,
- background and bottom border.

This makes it more realistic than an atom, but still small enough to inspect manually.

### 4.2 Deterministic config

Config path:

```text
prototype-design/visual-diff/comparisons/component-system/organisms/topbar-default.css-visual-diff.yml
```

Prototype side:

```yaml
original:
  url: http://localhost:7070/Pyxis%20Public%20Site.html
  root_selector: "#organism-capture-root"
  prepare:
    script_file: /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js
```

React side:

```yaml
react:
  url: http://localhost:6006/iframe.html?id=organisms-organism-diff-fixture--default&viewMode=story
  root_selector: "[data-fixture='pyxis-organisms']"
```

Important sections:

```yaml
sections:
  - name: component
    selector_original: "[data-comp='topbar-default']"
    selector_react: "[data-comp='topbar-default']"
  - name: root
    selector_original: "[data-comp='topbar-default'] > div"
    selector_react: "[data-comp='topbar-default'] [data-pyxis-component='top-bar'][data-pyxis-part='root']"
  - name: title-group
  - name: actions
```

Accepted deterministic result:

```text
component   0.0000% | 0/78280
root        0.0000% | 0/78280
title-group 0.0000% | 0/17112
actions     0.0000% | 0/4452
```

---

## 5. LLM-review experiments

### 5.1 Experiment A: GLM-5V against generated prepared HTML artifacts

We served generated artifacts from the deterministic output directory:

```bash
OUT_DIR=/home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-comparisons/component-system/organisms/topbar-default
nohup python3 -m http.server 8793 --directory "$OUT_DIR" >/tmp/pyxis-topbar-llm-artifacts-server.log 2>&1 &
```

Then ran `llm-review` roughly as:

```bash
css-visual-diff llm-review \
  --profile z-ai-glm-5v-turbo \
  --profile-registries /home/manuel/.pinocchio/config/profiles.yaml \
  --url1 http://localhost:8793/original-prepared.html \
  --selector1 "[data-comp='topbar-default'] > div" \
  --url2 http://localhost:8793/react-prepared.html \
  --selector2 "[data-comp='topbar-default'] [data-pyxis-component='top-bar'][data-pyxis-part='root']" \
  --wait-ms1 500 \
  --wait-ms2 500 \
  --viewport-w 1200 \
  --viewport-h 520 \
  --props box-sizing,width,height,padding-top,padding-right,padding-bottom,padding-left,font-family,font-size,font-weight,line-height,letter-spacing,color,background-color,border-bottom-width,border-bottom-color,gap,display,align-items,justify-content \
  --threshold 30 \
  --out prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v \
  --question "Compare the Pyxis prototype TopBar and React Storybook TopBar..."
```

Output directory:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v/
```

`compare.md` reported:

```text
Changed percent: 8.2218%
```

Computed diffs included:

```text
height: 62.3906px -> 60.3906px
font-family: Inter... -> "Times New Roman"
color: rgb(26, 26, 24) -> rgb(0, 0, 0)
background-color: rgb(255, 255, 255) -> rgba(0, 0, 0, 0)
border-bottom-width: 1px -> 0px
```

GLM-5V concluded:

- critical typography difference,
- missing bottom border,
- transparent background,
- wrong text color.

This answer was **reasonable for the broken evidence it saw**, but **invalid for the actual current TopBar parity state**. The generated `react-prepared.html` did not preserve enough Storybook/theme context for standalone reloading.

#### Maintainer implication

Prepared HTML output is useful as an artifact, but it may not be safe as a standalone input to `llm-review` unless it fully captures the CSS/font/theme environment. If `llm-review` encourages users to point at `*-prepared.html`, it should either:

- guarantee prepared HTML is self-contained, or
- warn that prepared HTML may not reproduce framework/theme context, or
- prefer consuming the already generated screenshots and JSON evidence directly.

### 5.2 Experiment B: GLM-5V against live Storybook React side, root selector

We then used the prototype prepared artifact for URL1, but live Storybook for URL2:

```bash
css-visual-diff llm-review \
  --profile z-ai-glm-5v-turbo \
  --profile-registries /home/manuel/.pinocchio/config/profiles.yaml \
  --url1 http://localhost:8793/original-prepared.html \
  --selector1 "[data-comp='topbar-default'] > div" \
  --url2 "http://localhost:6006/iframe.html?id=organisms-organism-diff-fixture--default&viewMode=story" \
  --selector2 "[data-comp='topbar-default'] [data-pyxis-component='top-bar'][data-pyxis-part='root']" \
  --wait-ms1 500 \
  --wait-ms2 1000 \
  --viewport-w 1200 \
  --viewport-h 520 \
  --out prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v-live-storybook \
  --question "Compare the Pyxis prototype TopBar and React Storybook TopBar..."
```

Output directory:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v-live-storybook/
```

GLM-5V answer focused on:

- height expansion from ~62px to ~103px,
- width expansion from 704px to 760px,
- box-sizing mismatch as a likely cause,
- recommendation to adjust width/height/padding tokens.

This was closer to the actual screenshots, but still misleading because the deterministic config-run accepted the same TopBar at `0.0000%` pixel diff. The standalone comparison is comparing CSS boxes differently from the config-run section/crop logic.

#### Maintainer implication

Standalone `llm-review` and config-driven `run` can produce different evidence even for the same conceptual component. This is dangerous because the LLM review appears authoritative but is based on a fresh comparison with subtly different crop/normalization/selector semantics.

### 5.3 Experiment C: GLM-5V with stronger visual-first prompt

We tried adding instructions through `--question`:

```text
IMPORTANT: use screenshots and pixel evidence as primary evidence; computed CSS is secondary. Do not over-index on CSS-only box-sizing, width, or height differences. If the screenshots look effectively identical, say that first and classify CSS-only box-model/bounds differences as implementation-model differences, not visual bugs. A separate config-driven css-visual-diff run for this same TopBar reported 0.0000% changed pixels for component/root/title-group/actions; use that as context when judging severity. Separate (1) observed visible differences, (2) CSS evidence that does not appear visible, and (3) actionable recommendations. Be concise.
```

Two stronger prompt runs failed after artifact generation with:

```text
Error: inference returned no assistant text
```

Output directories existed and contained compare artifacts, but no `llm-review.md`.

A shorter visual-first prompt succeeded:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v-visual-first-3/
```

Prompt:

```text
Review this UI comparison. Prioritize visible screenshot differences over computed CSS differences. Treat box-sizing and computed width/height differences as supporting evidence only. Separate visible differences from CSS-only differences and give concise recommendations.
```

But the result still over-indexed on computed dimensions:

- claimed visible vertical expansion,
- treated height `62.4px -> 103.4px` as a real UI change,
- recommended verifying design specs for 103px height.

#### Maintainer implication

`--question` can steer the answer but cannot fully compensate for:

- misleading or non-authoritative evidence,
- default prompt framing that asks for CSS causes,
- model tendency to trust structured CSS numbers over screenshots.

Also, `inference returned no assistant text` needs better debugging output. It would help to know whether the provider returned an empty message, a refusal, a tool/error envelope, a truncated streaming response, or an unsupported content block.

### 5.4 Experiment D: GLM-5V with wrapper selectors

We tried wrapper selectors on both sides:

```bash
--selector1 "[data-comp='topbar-default']"
--selector2 "[data-comp='topbar-default']"
```

Output directory:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v-visual-first-wrapper/
```

This reduced computed CSS differences to mostly:

```text
box-sizing: content-box -> border-box
```

But the pixel diff still reported:

```text
Changed percent: 4.7330%
```

GLM-5V answer was somewhat better but still inferred button sizing/positioning problems from the triptych/diff image and box-sizing.

#### Maintainer implication

Selector choice strongly affects LLM review quality. Wrapper selectors can reduce noisy root CSS diffs, but then the screenshot/diff may still show comparison-layout artifacts that models misread.

### 5.5 Experiment E: GPT-5 Nano visual understanding

Profile:

```text
gpt-5-nano
```

Output directory:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-gpt-5-nano-visual-first-wrapper/
```

Prompt:

```text
Review this UI comparison. Prioritize visible screenshot differences over computed CSS differences. Treat box-sizing and computed width/height differences as supporting evidence only. Separate visible differences from CSS-only differences and give concise recommendations.
```

Result: poor.

`gpt-5-nano` misinterpreted the triptych diff-comparison image as repeated UI:

```text
The right region renders multiple copies of the topbar (three instances of “Admin / Shows” and “Upcoming shows” with their Export/New show controls), resulting in a multi-block header that spans the width.
```

This is false. The image is a comparison artifact: left/original, middle/react, right/diff.

#### Maintainer implication

The diff-comparison image needs labeling or a model-oriented format. Without labels, weaker/smaller models can interpret the triptych as a single page containing repeated UI.

### 5.6 Experiment F: GPT-5 Mini visual understanding

Profile:

```text
gpt-5-mini
```

Output directory:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-gpt-5-mini-visual-first-wrapper/
```

Result: best of the tested models, but still not reliable.

`gpt-5-mini` correctly avoided catastrophic claims and described differences as subtle:

```text
Typography/weight: The page title "Upcoming shows" on the right render appears slightly darker/heavier...
Action controls: The "Export" + "New show" controls on the right are shifted slightly...
```

But it still over-weighted box-sizing and gave questionable recommendations:

```text
Either remove the global * { box-sizing: border-box } that Storybook adds, or scope it so it matches the app’s environment.
```

For this project, removing global border-box is not an appropriate recommendation. The deterministic accepted comparison indicates no visible issue to fix.

#### Maintainer implication

Bigger/better models help, but they do not solve the evidence mismatch problem. If the structured evidence says non-zero diff and box-sizing changes, the model will often produce a plausible but unnecessary fix plan.

---

## 6. Key failure modes observed

### 6.1 Evidence mismatch between config-run and standalone `llm-review`

This is the central issue.

Accepted config-run:

```text
0.0000% pixel diff
```

Standalone `llm-review` variants:

```text
8.2218% changed pixels   # prepared HTML artifact run
4.7330% changed pixels   # live Storybook wrapper/root runs
```

The LLM can only reason over the evidence it receives. If `llm-review` recomputes a comparison that differs from the accepted comparison, the model's answer can be internally coherent but operationally wrong.

### 6.2 Prepared HTML is not necessarily self-contained

The generated `react-prepared.html` did not preserve enough Storybook context for a faithful rerun. This produced:

- Times New Roman instead of intended font,
- missing background,
- missing bottom border,
- wrong text color.

The LLM correctly reported these as bugs, but those bugs were artifacts of the review setup.

### 6.3 CSS diffs dominate model reasoning

Even visual-first prompts did not prevent models from treating `box-sizing`, `width`, and `height` differences as layout bugs. This is especially problematic when the CSS differences are known/accepted implementation-model differences.

### 6.4 Triptych comparison images are ambiguous to models

The comparison image contains original, react, and diff panels side by side. Humans know this because of the file naming and workflow context. Models may not.

`gpt-5-nano` explicitly misread this as repeated TopBar UI.

### 6.5 Prompt override is limited

`--question` can inject instructions but cannot replace:

- the default system prompt,
- the task framing,
- the default final instruction to mention visual shifts and CSS causes,
- max property/winner diff limits.

The internal `SystemPrompt` field is unused by the CLI.

### 6.6 Empty assistant text is not diagnosable enough

Some GLM-5V runs failed with:

```text
inference returned no assistant text
```

The CLI surfaced no provider payload, finish reason, streaming metadata, or raw response details. For maintainer debugging, this is too opaque.

---

## 7. What worked

The LLM review feature did produce useful results in earlier atom-level tests when:

- the selector targeted the actual visual element,
- screenshots and CSS evidence described the same object,
- the rendered environments were stable,
- the visual differences were real.

In the prior `button-primary` GLM-5V run, the model identified:

- border radius drift,
- height drift,
- width drift,
- font-size drift,
- font-weight drift,
- likely CSS/token causes.

This suggests the feature is worth improving, not removing. The main problem is not that multimodal review is useless. The problem is that it needs to be anchored to the same deterministic artifacts that developers trust.

---

## 8. Recommended improvements

### 8.1 Highest priority: review existing config-run artifacts

Add a command or mode that consumes existing artifacts from `css-visual-diff run`:

Option A:

```bash
css-visual-diff llm-review-artifacts \
  --comparison-dir prototype-design/visual-comparisons/component-system/organisms/topbar-default \
  --section component \
  --style root \
  --profile z-ai-glm-5v-turbo \
  --profile-registries /home/manuel/.pinocchio/config/profiles.yaml
```

Option B:

```bash
css-visual-diff run \
  --config ... \
  --modes capture,cssdiff,matched-styles,pixeldiff,llm-review \
  --profile z-ai-glm-5v-turbo \
  --profile-registries ...
```

This should feed the model:

- exact original screenshot already used by pixeldiff,
- exact React screenshot already used by pixeldiff,
- exact diff image already used by report,
- `pixeldiff.md/json` for the same section,
- `cssdiff.md/json` for the selected styles,
- `matched-styles.md/json`,
- config metadata: component, state, selectors, section names.

This would eliminate the biggest current source of disagreement.

### 8.2 Make prompt visual-first by default

Current default prompt should be changed from CSS-cause-oriented to evidence-hierarchy-oriented.

Suggested system prompt:

```text
You are an expert frontend engineer and visual QA analyst. Screenshots and pixel-diff statistics are primary evidence. Computed CSS and matched-rule diffs are supporting evidence used to explain visible differences, not proof of visual bugs by themselves. Do not report CSS-only differences as user-facing issues unless they are visible in the screenshots or reflected in pixel-diff results. Separate observed visual evidence from inferred CSS causes.
```

Suggested task instruction:

```text
If the screenshots appear identical or pixel diff is zero/negligible, say that first. Then list any CSS-only differences separately as implementation-model differences or accepted differences, unless there is visible evidence they matter.
```

### 8.3 Expose prompt controls in CLI

Add flags:

```bash
--system-prompt <text-or-file>
--review-instructions <text-or-file>
--evidence-policy visual-first|css-first|balanced
--max-properties N
--max-winner-diffs N
```

Internally, `ReviewOptions.SystemPrompt`, `MaxProperties`, and `MaxWinnerDiffs` already exist. The CLI just needs to expose them.

### 8.4 Include accepted differences / parity-map context

Pyxis now maintains:

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

Entries can include accepted differences such as:

```json
{
  "kind": "css",
  "property": "box-sizing/width/height",
  "reason": "Prototype reports content-box CSS dimensions while React reports border-box dimensions; screenshot bounds and pixels match exactly."
}
```

If `llm-review` accepted an optional context file, it could avoid rediscovering known harmless differences.

Possible flag:

```bash
--context-file component-parity-map.json
--context-query organisms-topbar-default
```

or simpler:

```bash
--accepted-difference "box-sizing/width/height: content-box vs border-box is accepted if pixels match"
```

### 8.5 Label comparison images for LLM consumption

The triptych should be model-readable. Add labels directly into the image:

```text
LEFT: Prototype
MIDDLE: React
RIGHT: Pixel diff (red = changed pixels)
```

Better yet, create a dedicated LLM contact sheet:

```text
1. Prototype screenshot, labeled.
2. React screenshot, labeled.
3. Pixel diff only, labeled with threshold and changed percent.
4. Optional zoomed crops around changed regions.
```

This would reduce the chance that models interpret the comparison artifact as one wide UI with duplicated components.

### 8.6 Include section-level pixel verdict prominently

The prompt currently includes pixel diff summary, but models still overweight CSS. For artifact-based review, put the verdict at the top:

```text
Authoritative pixel verdict for section `component`:
- Changed percent: 0.0000%
- Changed pixels: 0 / 78280
- Treat this as the primary visual verdict.
```

Then instruct:

```text
If this is 0.0000%, do not recommend visual fixes unless screenshots visibly contradict the metric.
```

### 8.7 Improve empty assistant text diagnostics

When `ExtractAssistantText(out)` is empty, write a debug artifact or error details containing:

- provider,
- model,
- finish reason,
- raw response shape if safe,
- number/type of returned blocks,
- whether streaming ended normally,
- usage if present,
- any provider error fields.

Potential output:

```text
llm-review-error.json
```

This would make provider/model failures actionable.

### 8.8 Avoid standalone prepared-HTML review unless self-contained

If the tool keeps writing prepared HTML, consider one of:

1. Make prepared HTML fully self-contained by inlining required CSS/font/theme assets.
2. Record and replay asset dependencies.
3. Warn in docs and CLI that prepared HTML may not reproduce framework environments.
4. Prefer screenshot/json artifact review over reloading prepared HTML.

For Pyxis, reviewing `react-prepared.html` caused a false report about missing fonts/background/border.

---

## 9. Proposed output structure for future `llm-review.md`

A better review should force separation between evidence types:

```markdown
# LLM Visual Review

## Verdict

- Visual verdict: Match / Minor drift / Major drift / Invalid evidence
- Pixel diff: 0.0000% (0/78280)
- Confidence: high/medium/low

## Observed visual differences

Only differences visible in screenshots or pixel diff.

## CSS/layout evidence

Computed differences and matched-rule differences.
Classify each as:
- explains visible drift,
- CSS-only / no visible effect,
- likely artifact of selector/box model,
- needs human review.

## Accepted/contextual differences

Known accepted differences from parity map or provided context.

## Recommendations

Only recommend source changes for visible drift or high-confidence bugs.
If no visible drift: say no React change recommended.

## Caveats

Mention if prepared HTML, asset loading, selector mismatch, or triptych ambiguity may affect the review.
```

This structure would have prevented several misleading TopBar recommendations.

---

## 10. Concrete model observations

| Model/profile | Outcome | Notes |
| --- | --- | --- |
| `z-ai-glm-5v-turbo` on prepared HTML | Misleading but evidence-consistent | Correctly reported missing font/border/background in broken `react-prepared.html`; invalid for real Storybook state. |
| `z-ai-glm-5v-turbo` on live Storybook root | Over-indexed on CSS/bounds | Claimed height/width changes were layout-breaking despite accepted config-run at 0.0000%. |
| `z-ai-glm-5v-turbo` with strong visual-first prompt | Some runs failed | Two runs returned `inference returned no assistant text`. Shorter prompt still over-indexed. |
| `z-ai-glm-5v-turbo` with wrapper selectors | Slightly better | Fewer CSS diffs, but still inferred button/box-model issues. |
| `gpt-5-nano` | Bad | Misread triptych as repeated TopBars. |
| `gpt-5-mini` | Best of tested set but still not verdict-safe | Treated differences as subtle but still recommended changing global box-sizing / layout. |

---

## 11. Reproducible paths and artifacts

Validated deterministic TopBar run:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default/
```

GLM-5V prepared-HTML run:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v/
```

GLM-5V live Storybook run:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v-live-storybook/
```

GLM-5V visual-first failed/partial runs:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v-visual-first/
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v-visual-first-2/
```

GLM-5V visual-first successful run:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v-visual-first-3/
```

GLM-5V wrapper-selector run:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-glm5v-visual-first-wrapper/
```

GPT-5 Nano run:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-gpt-5-nano-visual-first-wrapper/
```

GPT-5 Mini run:

```text
prototype-design/visual-comparisons/component-system/organisms/topbar-default-llm-review-gpt-5-mini-visual-first-wrapper/
```

Note: `prototype-design/visual-comparisons/` is gitignored generated output, so these may be local-only artifacts unless explicitly archived.

---

## 12. Maintainer-ready action list

### Must fix / high leverage

1. Add artifact-based LLM review that consumes existing config-run outputs.
2. Make the default prompt visual-first and CSS-secondary.
3. Add labels/contact-sheet formatting for LLM images.
4. Expose CLI prompt controls (`--system-prompt`, `--review-instructions`, `--evidence-policy`).
5. Improve diagnostics for empty assistant responses.

### Should fix

6. Support accepted differences/context injection.
7. Expose `MaxProperties` and `MaxWinnerDiffs` on CLI.
8. Warn when reviewing generated prepared HTML that may not be self-contained.
9. Add model-quality notes to docs: small vision models may misread comparison triptychs.

### Nice to have

10. Add zoomed diff crops around changed regions.
11. Add structured JSON output schema for verdict/differences/recommendations.
12. Add a `no-source-change-recommended` verdict when pixels match and only CSS model differences remain.

---

## 13. Bottom line

`css-visual-diff llm-review` has the right concept: combine screenshots, pixel diff, computed CSS, and matched-rule evidence, then ask a multimodal model to produce an engineering explanation. The feature already works for simple atom-level examples when the evidence is accurate.

For Pyxis component parity, the blocker is not model intelligence alone. The blocker is **evidence alignment**. The LLM must review the same artifacts that the deterministic workflow uses. If it recomputes a different comparison, reloads an incomplete prepared HTML file, or sees an unlabeled triptych, even strong models will produce plausible but wrong conclusions.

The recommended path forward is to make LLM review an interpretation layer over validated `run` artifacts, not a separate comparison engine.
