---
Title: Exploration diary
Ticket: PYXIS-CSSVD-JS-WORKFLOW
Status: active
Topics:
    - frontend
    - visual-diff
    - storybook
    - automation
    - pyxis
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/design/01-css-visual-diff-javascript-workflow-experiment-guide.md
      Note: Experiment plan that the diary follows
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/reference/02-copious-research-notes-for-technical-deep-dive.md
      Note: Expanded blog-post research notes referenced by diary
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts/03-run-built-in-compare-region-smoke.sh
      Note: Script that produced the first meaningful JS compare result
ExternalSources:
    - css-visual-diff help pixel-accuracy-scripting-guide
    - css-visual-diff help javascript-api
    - css-visual-diff help javascript-verbs
    - css-visual-diff help inspect-workflow
Summary: Chronological diary for exploring css-visual-diff JavaScript scripting as a replacement/supplement for YAML visual parity workflows.
LastUpdated: 2026-04-25T07:30:00-04:00
WhatFor: Resume the exploration without losing command history, failures, assumptions, and blog-post source material.
WhenToUse: Read this before continuing PYXIS-CSSVD-JS-WORKFLOW experiments.
---


# Diary

## Goal

This diary captures the exploration of `css-visual-diff` JavaScript scripting support for improving the Pyxis visual parity workflow. It records what was read, what scripts were created, what commands ran, what failed, and what conclusions are emerging.

The diary is intentionally detailed because the research is expected to become a technical deep dive blog post.

## Step 1: Read the new pixel-accuracy scripting tutorial and create the exploration ticket

The first step was to treat the new JavaScript support as a workflow-design problem, not just a CLI novelty. The tutorial reframes pixel accuracy as a programmable feedback loop: render, locate, extract, compare, report, adjust. That maps directly onto the Pyxis public page work we just completed, where YAML gave us coverage but not enough workflow ergonomics.

I created a new docmgr ticket so the experiment has its own scripts, diary, guide, notes, and outputs instead of polluting the existing public-pages ticket.

### Prompt Context

**User prompt (verbatim):** "First, read `css-visual-diff help pixel-accuracy-scripting-guide`, we added JS support to the css-visual-diff tool that could help us simplify our approach with yaml and mjs, and instead use js script directly.

Read the tutorial, and see how it can be applied to the work we just did / the work ahead of us. 

Create a new docmgr ticket to do this exploration, keep a detailed log of the experiments you do, keep a detailed diary, store all script sin the scripts/ folder of the new ticket.

After reading the docs, write up a guide of the experiments you are going to do in order to improve our workflow ."

**Assistant interpretation:** Read the new `css-visual-diff` JavaScript scripting tutorial, create a separate docmgr ticket, design an experiment plan for replacing/supplementing YAML configs with JS scripts, and keep detailed experiment logs and scripts inside the ticket.

**Inferred user intent:** Improve the Pyxis visual parity workflow so future page/component tuning is faster, more programmable, and easier to explain in a high-quality technical writeup.

**Commit (code):** N/A — documentation/research setup only so far.

### What I did

- Read `/home/manuel/.pi/agent/skills/docmgr/SKILL.md` and `/home/manuel/.pi/agent/skills/diary/SKILL.md` to follow ticket/diary conventions.
- Ran:

```bash
css-visual-diff help pixel-accuracy-scripting-guide
```

- Created a new docmgr ticket:

```bash
docmgr ticket create-ticket \
  --ticket PYXIS-CSSVD-JS-WORKFLOW \
  --title "Explore css-visual-diff JavaScript scripting workflow" \
  --topics frontend,visual-diff,storybook,automation,pyxis
```

- Ticket path:

```text
ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow
```

### Why

The previous public page parity work proved the value of `css-visual-diff`, but also exposed repetition:

- repeated YAML boilerplate,
- repeated Storybook/prototype URL definitions,
- manual copying of pixel diff numbers into reports,
- separate fixture scripts and config files,
- no single executable model of “all public pages and their sections”.

The new JS scripting support looks like a better home for orchestration and project-specific policy.

### What worked

- The tutorial was available from the installed `css-visual-diff` binary.
- `docmgr ticket create-ticket` created the expected workspace with `design`, `reference`, `scripts`, `sources`, `various`, and other directories.

### What didn't work

- No blocker in this step.

### What I learned

The tutorial's most important distinction is locator vs probe:

- **Locator**: page-bound, good for exploration.
- **Probe**: reusable recipe, good for repeatable checks and snapshots.

That distinction should shape the Pyxis workflow: use locators while tuning, then encode stable page/component contracts as probes.

### What was tricky to build

The key risk is not technical syntax; it is avoiding another parallel source of truth. If we add JS scripts without a registry strategy, we will have YAML plus scripts plus docs all drifting separately. The experiment guide therefore prioritizes YAML interop and a page registry DSL before any permanent migration.

### What warrants a second pair of eyes

- Whether `visual-diff` and `automation` are acceptable docmgr topics in this repo vocabulary.
- Where stable scripts should eventually live after the ticket-local experiments.

### What should be done in the future

- Run `docmgr doctor` after the first document commit and decide whether to add vocabulary terms or tolerate warnings.
- Relate key files once the first real JS scripts settle.

### Code review instructions

Start with:

```text
ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/design/01-css-visual-diff-javascript-workflow-experiment-guide.md
```

Validate setup with:

```bash
docmgr doc list --ticket PYXIS-CSSVD-JS-WORKFLOW
```

### Technical details

The tutorial points to these related help pages:

```text
css-visual-diff help javascript-api
css-visual-diff help javascript-verbs
css-visual-diff help inspect-workflow
css-visual-diff help config-selectors
```

## Step 2: Capture help docs and prove ticket-local JS verbs work

After reading the main tutorial, I captured the related help pages to files so the research has stable citations. I also wrote the first ticket-local JavaScript verb to prove that `css-visual-diff verbs --repository <ticket>/scripts` can discover and execute JS commands without moving scripts into the main repo.

This matters because the ticket can now hold all experimental scripts, exactly as requested, while keeping the production visual-diff workflow untouched.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Set up a reproducible local research environment for JS scripting experiments.

**Inferred user intent:** Ensure that future experiments are reproducible and can be turned into blog-post source material.

**Commit (code):** N/A.

### What I did

- Created script:

```text
scripts/01-capture-cssvd-js-help.sh
```

- The script captures:

```text
css-visual-diff help pixel-accuracy-scripting-guide
css-visual-diff help javascript-api
css-visual-diff help javascript-verbs
css-visual-diff help inspect-workflow
```

- Ran:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts/01-capture-cssvd-js-help.sh
```

- Output line counts:

```text
130 inspect-workflow.txt
563 javascript-api.txt
336 javascript-verbs.txt
388 pixel-accuracy-scripting-guide.txt
1417 total
```

- Created script:

```text
scripts/02-smoke-cssvd-js-verb.js
```

- Ran:

```bash
css-visual-diff verbs \
  --repository ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts \
  pyxis workflow summarize-targets \
  --output json
```

- Saved output to:

```text
sources/css-visual-diff-help/02-smoke-summarize-targets.json
```

### Why

Before designing more ambitious scripts, I wanted to establish the smallest working command path:

1. A JS file in the ticket's `scripts/` folder.
2. Static `__package__` / `__verb__` metadata.
3. A structured return value.
4. Invocation through `css-visual-diff verbs --repository ...`.

### What worked

- Repository-scanned verbs work from the ticket-local `scripts/` folder.
- The command name was normalized as expected from `summarizeTargets` to `summarize-targets`.
- Structured JSON output worked.
- The script can represent current page targets: Shows, ShowDetail, Archive, Book, About.

### What didn't work

- No blocker in the JS verb itself.

### What I learned

The `javascript-verbs` help is explicit that commands live under:

```text
css-visual-diff verbs ...
```

not at the root CLI. This is good for our exploration because script-specific failures and duplicate names stay isolated.

### What was tricky to build

The `__verb__` metadata must be static literal JavaScript. That means no dynamic computed arrays in verb metadata. The target registry can be dynamic inside the function, but the CLI schema must remain literal.

### What warrants a second pair of eyes

- Whether the eventual stable command namespace should be `pyxis pages ...`, `pyxis workflow ...`, or `public pages ...`.

### What should be done in the future

- Add verbs with real browser work once the target registry shape is stable.
- Consider app-level verb repository config only after the scripts graduate from ticket-local experiments.

### Code review instructions

Review:

```text
scripts/01-capture-cssvd-js-help.sh
scripts/02-smoke-cssvd-js-verb.js
sources/css-visual-diff-help/*.txt
sources/css-visual-diff-help/02-smoke-summarize-targets.json
```

Validate:

```bash
css-visual-diff verbs --repository ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts pyxis workflow summarize-targets --output json
```

### Technical details

The `02-smoke-cssvd-js-verb.js` target list intentionally mirrors the current public page desktop configs. It is not yet a source of truth; it is a smoke test for command discovery and output.

## Step 3: Smoke-test a YAML-free built-in region comparison

The first meaningful comparison experiment used the built-in JavaScript `verbs script compare region` command. I chose Archive content because it is currently the closest page-level diff, so any output should be easy to compare to the known YAML result.

The result is important: the JS verb reproduced the Archive content pixel diff from the YAML page config exactly enough for workflow purposes, while writing structured JSON and visual artifacts from a direct command invocation.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Test whether JS scripting can replace at least some YAML use cases with simpler direct commands.

**Inferred user intent:** Find a pragmatic migration path, not just write a theoretical plan.

**Commit (code):** N/A.

### What I did

- Created script:

```text
scripts/03-run-built-in-compare-region-smoke.sh
```

- Script command shape:

```bash
css-visual-diff verbs script compare region \
  --leftUrl "http://localhost:7070/standalone/public/archive.html" \
  --rightUrl "http://localhost:6007/iframe.html?id=public-site-pages--archive-desktop&viewMode=story" \
  --leftSelector "#root > *" \
  --rightSelector "[data-page='archive']" \
  --width 920 \
  --height 1460 \
  --leftWaitMs 1000 \
  --rightWaitMs 1000 \
  --outDir "$OUT" \
  --writeJson \
  --writeMarkdown \
  --writePngs \
  --output json
```

- First attempted to run it with stdout redirected into a file inside the script-created directory:

```bash
ttmp/.../scripts/03-run-built-in-compare-region-smoke.sh > ttmp/.../various/03-built-in-compare-region/archive-content/run-output.json
```

- This failed before the script could run because shell redirection opens the output file before script execution, and the destination directory did not exist yet.

Error:

```text
/bin/bash: line 2: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/03-built-in-compare-region/archive-content/run-output.json: No such file or directory
ls: cannot access 'ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/03-built-in-compare-region/archive-content': No such file or directory
cat: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/03-built-in-compare-region/archive-content/run-output.json: No such file or directory
```

- Fixed by creating the output directory before redirection:

```bash
BASE=ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow
mkdir -p "$BASE/various/03-built-in-compare-region/archive-content"
"$BASE/scripts/03-run-built-in-compare-region-smoke.sh" > "$BASE/various/03-built-in-compare-region/archive-content/run-output.json"
```

### Why

This experiment directly tests the user's hypothesis: can JS support simplify YAML-plus-ad-hoc-script usage? The built-in compare verb is the lowest-friction candidate because it can compare two URLs/selectors with flags rather than a config file.

### What worked

The command wrote:

```text
compare.json
01-compare-report.md
diff_comparison.png
diff_only.png
run-output.json
url1_full.png
url1_screenshot.png
url2_full.png
url2_screenshot.png
```

The pixel result:

```json
{
  "changed_percent": 7.128146453089244,
  "changed_pixels": 102172,
  "normalized_height": 1558,
  "normalized_width": 920,
  "threshold": 30,
  "total_pixels": 1433360
}
```

This matches the existing YAML Archive content result:

```text
content 7.1281%
```

### What didn't work

- My first redirect failed because the directory did not exist before redirection.
- The built-in command emits very large computed-style structures. This is useful for evidence, but too noisy for daily tuning unless filtered or wrapped.

### What I learned

- A simple page-section comparison can be run without YAML and still produce the same pixel number.
- The built-in JS compare command is immediately useful for one-off checks and smoke tests.
- For reusable Pyxis workflows, project-specific scripts should narrow computed-style properties and return concise rows.

### What was tricky to build

The tricky part was not `css-visual-diff`; it was shell behavior. Redirection happens before the script's `mkdir -p`, so scripts that write outputs internally should also support `--output-file` or callers should create directories before redirecting stdout.

For future scripts, prefer writing structured outputs inside the script with `cvd.write.json(...)` or passing `--output-file` where supported, instead of relying on shell redirection into a directory the script creates.

### What warrants a second pair of eyes

- Whether built-in `verbs script compare region` should be wrapped or whether we should write a dedicated Pyxis `compare-section` verb.
- Whether broad computed-style output is desirable as a raw artifact, or whether the project command should default to a narrow property allowlist.

### What should be done in the future

- Implement a `pyxis pages compare-section` wrapper that uses the registry and avoids repeating URLs/selectors.
- Add an output writer that records concise rows and full artifacts separately.

### Code review instructions

Review:

```text
scripts/03-run-built-in-compare-region-smoke.sh
various/03-built-in-compare-region/archive-content/01-compare-report.md
various/03-built-in-compare-region/archive-content/compare.json
```

Validate:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts/03-run-built-in-compare-region-smoke.sh
```

### Technical details

The output JSON row contains keys:

```text
computed_diffs
inputs
pixel_diff
url1
url2
winner_diffs
```

This is more structured than `pixeldiff.md` and can be post-processed into sorted reports.

## Step 4: Write the experiment guide and commit to copious blog-post notes

The user clarified that this research should become a “great technical deep dive blog post,” so I expanded the design guide to include not just commands but narrative angles, open questions, and a migration path.

This changes the documentation standard for the ticket: each experiment should record exact commands, raw outputs or artifact paths, failed attempts, and the conceptual lesson learned.

### Prompt Context

**User prompt (verbatim):** "we will be writing a great technical deep dive blog post out of your research, so keep copious notes."

**Assistant interpretation:** Preserve more detail than usual: command output, rationale, failed attempts, lessons, narrative hooks, and evidence useful for long-form writing.

**Inferred user intent:** Convert the engineering exploration into high-quality educational material later, not just get a working script.

**Commit (code):** N/A.

### What I did

- Created:

```text
design/01-css-visual-diff-javascript-workflow-experiment-guide.md
reference/02-copious-research-notes-for-technical-deep-dive.md
```

- Updated:

```text
tasks.md
changelog.md
index.md
```

- Added experiment plan for:
  - docs capture,
  - JS verb smoke test,
  - built-in compare-region smoke,
  - YAML interop reporting,
  - Pyxis page registry DSL,
  - locator-first inspect-section command,
  - probe/snapshot semantic diffs,
  - catalog generation,
  - mobile checks,
  - threshold policy.

### Why

The research will be more useful if it records the decision path, not just final scripts. The blog post should be able to show why screenshots alone were insufficient, how stable selectors enabled automation, and how JS scripting changed the workflow shape.

### What worked

- The guide now ties tutorial concepts directly to the Pyxis public page work.
- The guide includes concrete script names and success criteria.
- The diary now records both the redirection failure and the successful Archive comparison.

### What didn't work

- No new blocker in this step.

### What I learned

A strong narrative is emerging:

> YAML got us to visual coverage. JavaScript verbs can make the feedback loop programmable.

The immediate proof point is Archive: the JS built-in region comparison reproduced the existing YAML pixel diff, but in a form that can be scripted and reported more flexibly.

### What was tricky to build

The biggest challenge will be choosing the right migration boundary. We should not rewrite all YAML immediately. The safer path is:

1. wrap/summarize existing YAML,
2. create registry scripts for authoring,
3. adopt JS-first checks where they reduce duplication,
4. keep official YAML runs until JS scripts are trusted.

### What warrants a second pair of eyes

- Whether the experiment list is too broad for one ticket.
- Whether to prioritize Shows tuning scripts or YAML-summary scripts first.

### What should be done in the future

- Implement Experiment 3 next (`04-report-public-page-yaml-results.js`) because it directly eliminates manual Phase 7 report copying.
- Implement Experiment 5 soon after because it helps with Shows tuning, the biggest remaining page diff.

### Code review instructions

Start with:

```text
design/01-css-visual-diff-javascript-workflow-experiment-guide.md
reference/02-copious-research-notes-for-technical-deep-dive.md
```

Then inspect scripts:

```text
scripts/01-capture-cssvd-js-help.sh
scripts/02-smoke-cssvd-js-verb.js
scripts/03-run-built-in-compare-region-smoke.sh
```

### Technical details

The guide proposes a three-tier future workflow:

1. Fast authoring commands using locators/probes.
2. Artifact-producing review commands using compare/catalog scripts.
3. YAML compatibility/reporting bridge for current official configs.
