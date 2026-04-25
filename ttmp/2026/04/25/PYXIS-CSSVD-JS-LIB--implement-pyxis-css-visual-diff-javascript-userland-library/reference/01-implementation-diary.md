---
Title: Implementation diary
Ticket: PYXIS-CSSVD-JS-LIB
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
RelatedFiles: []
ExternalSources:
  - ../PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/reference/02-copious-research-notes-for-technical-deep-dive.md
Summary: "Diary for the future implementation of the Pyxis css-visual-diff JavaScript userland library."
LastUpdated: 2026-04-25T08:20:00-04:00
WhatFor: "Read before implementing or resuming the Pyxis css-visual-diff JS userland library."
WhenToUse: "Use to track implementation steps, failures, validation commands, and decisions once development starts."
---

# Diary

## Goal

This diary tracks the implementation of a Pyxis-specific JavaScript userland library on top of `css-visual-diff`. The library will turn the findings from `PYXIS-CSSVD-JS-WORKFLOW` into reusable scripts and commands for public page/component visual comparisons.

This ticket is currently a planning/handoff ticket. Implementation will happen later.

## Step 1: Create the implementation ticket and handoff documents

The user asked to create a new ticket for implementing the userland library later, not to start coding the library immediately. I created the docmgr workspace, wrote an implementation guide, wrote a maintainer feature-request document, and filled out a task breakdown so the next session can start with concrete phases.

The implementation guide intentionally separates what can be built in userland from what should be requested upstream. The central conclusion is that most workflow features can be implemented now in JavaScript; the main upstream ask is a JS-callable pixel comparison primitive.

### Prompt Context

**User prompt (verbatim):** "Ok, create a new docmgr ticket to implement the JS userland library for our comparisons, and add an implementation guide and tasks. we will tackle it later.

Create a document in this ticket with the requests to the css-visual-diff maintainers on the features you would like to see built, an explanation, potentially usage examples.

then bundle and upload this ticket to remarkable"

**Assistant interpretation:** Create a separate planning ticket for later implementation of a Pyxis JS userland library around css-visual-diff, write implementation and maintainer-request docs, prepare tasks, then upload the ticket docs to reMarkable.

**Inferred user intent:** Preserve the design direction and upstream API asks now, so future implementation can begin quickly and the maintainer feedback can be shared independently.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Created ticket:

```bash
docmgr ticket create-ticket \
  --ticket PYXIS-CSSVD-JS-LIB \
  --title "Implement Pyxis css-visual-diff JavaScript userland library" \
  --topics frontend,visual-diff,storybook,automation,pyxis
```

- Added docs:

```bash
docmgr doc add --ticket PYXIS-CSSVD-JS-LIB --doc-type design --title "Pyxis css-visual-diff JavaScript userland library implementation guide"
docmgr doc add --ticket PYXIS-CSSVD-JS-LIB --doc-type design --title "css-visual-diff maintainer feature requests"
docmgr doc add --ticket PYXIS-CSSVD-JS-LIB --doc-type reference --title "Implementation diary"
```

- Wrote:

```text
design/01-pyxis-css-visual-diff-javascript-userland-library-implementation-guide.md
design/02-css-visual-diff-maintainer-feature-requests.md
tasks.md
reference/01-implementation-diary.md
```

### Why

The previous exploration showed that most desired improvements do not need upstream changes. This ticket turns that conclusion into an implementation plan that can be tackled later without re-reading the whole exploration thread.

### What worked

- The ticket was created successfully under:

```text
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library
```

- The implementation guide now has a concrete phased plan.
- The maintainer request doc clearly separates high-priority core API asks from userland conveniences.

### What didn't work

- No implementation work was attempted in this step.
- The usual docmgr vocabulary warning is expected because the repo vocabulary only knows a small set of topics.

### What I learned

The cleanest implementation path is:

1. build `summarize-results` first because it requires no browser work,
2. build locator-based `inspect-section`,
3. bridge pixel comparisons by shelling out to the built-in compare-region verb,
4. only ask upstream for `cvd.comparePixels(...)` once the userland bridge proves the exact needs.

### What was tricky to build

The tricky part is planning the library boundary. If we overfit to Pyxis, it will not inform upstream requests. If we generalize too early, we will build unnecessary abstraction. The guide resolves this by keeping Pyxis-specific code in userland while asking upstream only for small primitives and stable contracts.

### What warrants a second pair of eyes

- Permanent location for stable scripts after the ticket-local prototype.
- Whether the maintainer requests are scoped tightly enough.
- Whether the first implementation phase should be `summarize-results` or `list-targets`.

### What should be done in the future

- Start with Phase 1 library skeleton and registry.
- Then implement Phase 2 result summarizer.
- Revisit the maintainer request doc after the userland bridge hits real limitations.

### Code review instructions

Start with:

```text
design/01-pyxis-css-visual-diff-javascript-userland-library-implementation-guide.md
design/02-css-visual-diff-maintainer-feature-requests.md
tasks.md
```

Validate ticket hygiene with:

```bash
docmgr doctor --ticket PYXIS-CSSVD-JS-LIB --stale-after 30
```

### Technical details

The implementation guide proposes these first modules:

```text
scripts/lib/slug.js
scripts/lib/storybook.js
scripts/lib/artifacts.js
scripts/lib/registry.js
scripts/lib/results.js
scripts/lib/policies.js
scripts/lib/markdown.js
scripts/lib/compare-region.js
scripts/lib/styles.js
scripts/lib/normalizers.js
scripts/lib/tolerances.js
```

and these verbs:

```text
pyxis pages list-targets
pyxis pages summarize-results
pyxis pages inspect-section
pyxis pages compare-section
pyxis pages compare-page
pyxis pages compare-all
pyxis pages snapshot-section
```


## Step 2: Bundle and upload the planning ticket to reMarkable

The user asked for the ticket to be bundled and uploaded to reMarkable after the planning documents were created. I used the `remarquee upload bundle` workflow with a dry run first, then uploaded the bundle and verified it exists in the expected remote directory.

This makes the implementation plan and maintainer feature requests available for offline reading/review on the reMarkable.

### Prompt Context

**User prompt (verbatim):** (see Step 1)

**Assistant interpretation:** Upload the planning ticket as a bundled PDF to reMarkable after creating the docs.

**Inferred user intent:** Make the future implementation plan and maintainer requests easy to read away from the codebase.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Checked `remarquee` availability:

```bash
remarquee status
```

- Ran a dry-run bundle upload with these inputs:

```text
index.md
design/01-pyxis-css-visual-diff-javascript-userland-library-implementation-guide.md
design/02-css-visual-diff-maintainer-feature-requests.md
tasks.md
reference/01-implementation-diary.md
changelog.md
scripts/00-README.md
```

- Uploaded the bundle:

```bash
remarquee upload bundle <ticket-docs...> \
  --name "PYXIS css-visual-diff JS Userland Library Plan" \
  --remote-dir "/ai/2026/04/25/PYXIS-CSSVD-JS-LIB" \
  --toc-depth 2
```

- Verified:

```bash
remarquee cloud ls /ai/2026/04/25/PYXIS-CSSVD-JS-LIB --long --non-interactive
```

### Why

The bundle preserves the ticket as one ordered PDF with a table of contents. This is better than uploading the files individually because the implementation plan and maintainer requests are meant to be read together.

### What worked

The upload succeeded:

```text
OK: uploaded PYXIS css-visual-diff JS Userland Library Plan.pdf -> /ai/2026/04/25/PYXIS-CSSVD-JS-LIB
```

Verification showed:

```text
[f]	PYXIS css-visual-diff JS Userland Library Plan
```

### What didn't work

No upload failure occurred.

### What I learned

The ticket bundle is concise enough to upload directly from the ticket markdown files; no separate staging directory was needed.

### What was tricky to build

The only minor consideration was ordering the files explicitly in the bundle command so the generated PDF reads as index, implementation guide, maintainer requests, tasks, diary, changelog, scripts README.

### What warrants a second pair of eyes

N/A for upload mechanics. Reviewers should still inspect the implementation plan and maintainer request content.

### What should be done in the future

If implementation changes the plan substantially, upload a revised bundle or a separate implementation report.

### Code review instructions

Verify the upload with:

```bash
remarquee cloud ls /ai/2026/04/25/PYXIS-CSSVD-JS-LIB --long --non-interactive
```

### Technical details

Remote path:

```text
/ai/2026/04/25/PYXIS-CSSVD-JS-LIB
```

Document name:

```text
PYXIS css-visual-diff JS Userland Library Plan
```


## Step 3: Start Phase 1 with library skeleton, registry, and import smoke tests

I started implementation with the smallest useful slice: pure userland modules and a repository-scanned verb file that imports them. This validates the core architecture before any browser work or pixel comparison bridge is attempted.

The key discovery was that relative imports only worked when the css-visual-diff verb repository was the ticket `scripts/` directory, not the nested `scripts/verbs/` directory. That means the script repository root must include both `verbs/` and `lib/` if verb files import sibling userland modules.

### Prompt Context

**User prompt (verbatim):** "Upload the whole current ticket as bundle to remarkable, then add tasks to the new lib ticket, and work on those step by step, making sure to write test scripts to validate the proper working of the library (and the import mechanism to make sure we can include files properly), checking things off as you go, committing at appropriate intervals, and continuing to keep a detailed diary in this new ticket."

**Assistant interpretation:** Upload the current ticket bundle, then begin implementing the planned JS userland library step by step with smoke tests, task checkoffs, commits, and detailed diary updates.

**Inferred user intent:** Move from planning into careful incremental implementation, with enough validation and documentation that the work can be resumed or reviewed safely.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Added library modules:

```text
scripts/lib/slug.js
scripts/lib/storybook.js
scripts/lib/artifacts.js
scripts/lib/registry.js
scripts/lib/index.js
```

- Added verb file:

```text
scripts/verbs/pyxis-pages.js
```

- Implemented verbs:

```text
pyxis pages list-targets
pyxis pages import-smoke
```

- Added smoke scripts:

```text
scripts/01-smoke-list-targets.sh
scripts/02-smoke-import-mechanism.sh
```

- Ran the import smoke and list-targets smoke, saving outputs under:

```text
various/01-import-smoke/import-smoke.json
various/01-import-smoke/list-targets.json
```

- Validated output with Python assertions:

```bash
python3 - <<'PY'
import json
from pathlib import Path
base=Path('ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/various/01-import-smoke')
smoke=json.loads((base/'import-smoke.json').read_text())
rows=json.loads((base/'list-targets.json').read_text())
assert smoke[0]['ok'] is True, smoke
assert len(rows) == 13, len(rows)
assert any(r['page']=='archive' and r['section']=='content' for r in rows)
print('validated import smoke rows=', len(smoke), 'target rows=', len(rows))
PY
```

### Why

The implementation guide depends on the assumption that userland modules can be split across files and imported by verb files. Before building result parsers or browser commands, we needed to prove the import mechanism and repository root shape.

### What worked

Running with the ticket `scripts/` directory as the verb repository works:

```bash
css-visual-diff verbs \
  --repository ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts \
  pyxis pages import-smoke \
  --output json
```

The import smoke returned `ok: true`, generated an Archive content Storybook URL, created a slug, generated an artifact path, and looked up the Archive content selectors from the registry.

The `list-targets` smoke returned 13 rows: 5 Shows sections plus 2 each for ShowDetail, Archive, Book, and About.

### What didn't work

The first attempt used the nested verbs directory as the repository root:

```bash
css-visual-diff verbs \
  --repository ttmp/.../scripts/verbs \
  pyxis pages import-smoke \
  --output json
```

It failed with:

```text
Error: GoError: Invalid module at github.com/dop251/goja_nodejs/require.(*RequireModule).require-fm (native)
```

Cause: `pyxis-pages.js` requires `../lib/index.js`, but when the repository root is `scripts/verbs`, `../lib` sits outside the scanned/allowed module root.

Fix: use `--repository <ticket>/scripts`, so both `verbs/` and `lib/` live under the repository root.

### What I learned

For userland multi-file JS verbs, the repository root should be the common parent containing both verb files and support modules. Our smoke scripts now use:

```text
--repository <ticket>/scripts
```

not:

```text
--repository <ticket>/scripts/verbs
```

### What was tricky to build

The import failure looked like a generic module problem, but it was actually a repository-root problem. Because Goja's require layer reports `Invalid module`, the safest diagnostic is to try the repository root one level higher and keep all imported files under that root.

### What warrants a second pair of eyes

- Whether scanning `scripts/` instead of `scripts/verbs/` is acceptable long term if support modules have no sentinels. It worked in this smoke, but stable docs should mention the pattern explicitly.
- Whether the registry should include Shows sub-section selectors against broad prototype selectors or wait for more precise prototype section selectors.

### What should be done in the future

- Implement Phase 2 `summarize-results` next.
- Add a README note warning future developers to pass `--repository <ticket>/scripts`.
- Consider adding a tiny `pyxis pages debug-module-root` verb if import issues recur.

### Code review instructions

Review:

```text
scripts/lib/*.js
scripts/verbs/pyxis-pages.js
scripts/01-smoke-list-targets.sh
scripts/02-smoke-import-mechanism.sh
various/01-import-smoke/*.json
```

Validate:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/02-smoke-import-mechanism.sh
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/01-smoke-list-targets.sh
```

### Technical details

The registry currently hard-codes the desktop public pages and first-pass baseline diff percentages from the previous page-level visual-diff report. This is intentional for Phase 1; Phase 2 will parse official generated results instead of relying only on baselines embedded in the registry.


## Step 4: Implement Phase 2 result summarizer

The next implementation slice avoids browser work and focuses on immediate workflow value: replacing manual page-diff report copying with a userland parser and report generator. The new command reads existing `pixeldiff.md` artifacts from `prototype-design/visual-comparisons/public-pages`, normalizes rows, classifies them by policy bands, and writes JSON/Markdown summaries.

This proves that useful project-level tooling can be built entirely in JavaScript userland before touching pixel comparison internals.

### Prompt Context

**User prompt (verbatim):** (see Step 3)

**Assistant interpretation:** Continue implementing the library step by step after validating import mechanics.

**Inferred user intent:** Build practical commands with smoke tests and documentation rather than stopping at planning.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Added modules:

```text
scripts/lib/policies.js
scripts/lib/markdown.js
scripts/lib/results.js
```

- Updated:

```text
scripts/lib/index.js
scripts/verbs/pyxis-pages.js
```

- Implemented verb:

```text
pyxis pages summarize-results
```

- Added smoke script:

```text
scripts/03-smoke-summarize-existing-page-results.sh
```

- Generated outputs:

```text
various/02-summarize-results/page-diffs.json
various/02-summarize-results/01-page-diffs.md
various/02-summarize-results/summarize-output.json
```

- Validated with Python assertions:

```bash
python3 - <<'PY'
import json
from pathlib import Path
base=Path('ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/various/02-summarize-results')
rows=json.loads((base/'page-diffs.json').read_text())
out=json.loads((base/'summarize-output.json').read_text())
assert rows == out
assert len(rows) == 13
assert (base/'01-page-diffs.md').read_text().startswith('---')
print('validated rerun summarized rows=', len(rows))
PY
```

### Why

This command directly improves the workflow from the public pages Phase 7 report. Instead of manually copying pixel diff rows, the library now parses existing artifacts and produces a sorted summary with policy classifications.

### What worked

The summarizer produced 13 rows sorted by changed percentage. The highest row is the expected Shows mismatch:

```text
shows / shows-list / 66.8566% / major-mismatch
```

Archive is classified as review-level:

```text
archive / content / 7.1281% / review
archive / page / 6.6511% / review
```

The generated Markdown report has docmgr-compatible frontmatter and can be bundled later if needed.

### What didn't work

I initially piped the smoke script into `tee` with the target file inside a directory created by the script:

```bash
"$BASE/scripts/03-smoke-summarize-existing-page-results.sh" | tee "$BASE/various/02-summarize-results/summarize-output.json"
```

This failed because `tee` opened the output path before the script-created directory was available:

```text
tee: ttmp/.../various/02-summarize-results/summarize-output.json: No such file or directory
```

Fix: create the directory before invoking `tee`, or redirect after ensuring the directory exists. The final smoke run uses an existing directory and succeeds.

### What I learned

The Goja `fs` module available inside css-visual-diff verbs supports enough file operations for this phase: `readFileSync` and `writeFileSync`. It does not expose the full Node `fs` API, so scripts should not assume `existsSync`, `mkdirSync`, or directory walking.

This shapes the library: use known registry paths instead of filesystem discovery, and have shell smoke scripts create directories before JS writes files.

### What was tricky to build

The main trick was parsing Markdown robustly without a filesystem directory walk. The implementation uses the registry to know which result directories should exist, then reads each expected `pixeldiff.md`. This is more deterministic than discovering arbitrary files, and it fits the current page registry model.

### What warrants a second pair of eyes

- The classification bands are simple: accepted <= 1%, review <= 10%, tune-required <= 25%, major-mismatch > 25%. They are useful for authoring but may need adjustment before CI use.
- `compare.json` parsing is deferred to the Phase 4 compare bridge, despite being originally listed in Phase 2.

### What should be done in the future

- Implement a built-in `compare.json` reader when the compare bridge exists.
- Add optional `--classification` or `--minChangedPercent` filters if summaries get large.
- Consider writing summary reports into a predictable docs/report path once the command graduates from ticket-local scripts.

### Code review instructions

Review:

```text
scripts/lib/results.js
scripts/lib/policies.js
scripts/lib/markdown.js
scripts/verbs/pyxis-pages.js
scripts/03-smoke-summarize-existing-page-results.sh
various/02-summarize-results/01-page-diffs.md
```

Validate:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/03-smoke-summarize-existing-page-results.sh
```

### Technical details

The normalized row shape currently includes:

```text
page
variant
section
changedPercent
changedPixels
totalPixels
classification
source
artifactDir
diffComparisonPath
```

The source is currently `yaml-run`, because rows are parsed from official YAML-generated `pixeldiff.md` artifacts.


## Step 5: Implement Phase 3 locator-first inspect-section command

I added the first browser-backed command in the userland library: `pyxis pages inspect-section`. Unlike the pixel comparison commands, this does not need image diff internals. It uses the public `css-visual-diff` JavaScript browser/page/locator APIs to answer the first authoring question: do both sides render the selector we intend to compare, and what browser-computed facts do they have?

This command is the lightweight preflight/debug layer we wanted before expensive screenshot comparisons.

### Prompt Context

**User prompt (verbatim):** (see Step 3)

**Assistant interpretation:** Continue implementing validated library pieces incrementally.

**Inferred user intent:** Build real workflow helpers with tests, especially checks that prove the library can use css-visual-diff APIs correctly.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Added:

```text
scripts/lib/styles.js
scripts/lib/inspect.js
```

- Updated:

```text
scripts/lib/index.js
scripts/verbs/pyxis-pages.js
```

- Implemented verb:

```text
pyxis pages inspect-section <page> <section>
```

- Added smoke script:

```text
scripts/04-smoke-inspect-section.sh
```

- Ran the smoke against Archive content and wrote:

```text
various/03-inspect-section/archive-content-inspect.json
```

- Validated with Python assertions that two rows exist, one for `original` and one for `react`, and both are visible with bounds.

### Why

The visual workflow should not jump straight to pixel diffs. First it should prove that each selector exists, is visible, and points at the intended element. This command gives us that authoring layer using locators.

### What worked

The Archive content smoke passed. It returned two rows:

```text
original #root > *
react    [data-page='archive']
```

Both rows had:

```text
exists: true
visible: true
bounds: present
styles: pageShell preset values
```

The original side showed the expected prototype shell facts such as:

```text
font-family: Inter, sans-serif
font-size: 16px
box-sizing: content-box
```

The React side showed tokenized app facts such as the React page class and page-shell styles.

### What didn't work

No command failure occurred in this step.

### What I learned

The public browser/page/locator API is enough for a useful authoring command. This validates the earlier assumption that not all workflow improvements need new core primitives. Pixel comparison is the main missing callable primitive, but locator-based inspection is already fully viable.

### What was tricky to build

The command has to keep page/section lookup separate from side inspection. The registry knows target URLs and selectors; `inspect.js` only knows how to load a URL and inspect a selector. That separation should make later page/component registry changes less invasive.

### What warrants a second pair of eyes

- Whether `textStart` should be included by default; for full page sections it can be very long/noisy even when truncated.
- Whether the `pageShell` preset is the right default for broad sections.

### What should be done in the future

- Validate `inspect-section shows header` before using this command for Shows tuning.
- Add `--props` custom property list later if presets are too coarse.
- Consider a compact mode that omits full `styles` maps for table output.

### Code review instructions

Review:

```text
scripts/lib/inspect.js
scripts/lib/styles.js
scripts/verbs/pyxis-pages.js
scripts/04-smoke-inspect-section.sh
various/03-inspect-section/archive-content-inspect.json
```

Validate:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/04-smoke-inspect-section.sh
```

### Technical details

The command supports:

```text
--side both|original|react
--stylePreset typography|layout|surface|spacing|pageShell
--failOnMissing
```

It uses `cvd.browser()`, `browser.page()`, `page.locator()`, `locator.status()`, `locator.text()`, `locator.bounds()`, `locator.computedStyle()`, and `locator.attributes()`.


## Step 6: Investigate Phase 4 compare-section bridge and confirm the core boundary

I started the Phase 4 pixel compare bridge by building the part we can do safely in userland: generate the exact built-in `css-visual-diff verbs script compare region` command for any registered page section. I also tested whether the Goja JavaScript runtime exposes `child_process`, because the original implementation plan assumed a JS wrapper could spawn the built-in command.

This step confirmed the boundary we suspected from the API wishlist: command planning is userland, but executing pixel comparison from a custom JS verb still needs either shell orchestration outside Goja or a future JS-callable pixel comparison primitive.

### Prompt Context

**User prompt (verbatim):** (see Step 3)

**Assistant interpretation:** Continue stepwise implementation, but record blockers and update tasks honestly when a planned userland approach hits a runtime limitation.

**Inferred user intent:** Build as much as practical now while identifying precise css-visual-diff API gaps for maintainers.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Added:

```text
scripts/lib/compare-region.js
```

- Updated:

```text
scripts/lib/index.js
scripts/verbs/pyxis-pages.js
```

- Implemented verb:

```text
pyxis pages compare-section-command <page> <section>
```

- Added smoke scripts:

```text
scripts/05-smoke-compare-section-command.sh
scripts/06-smoke-child-process-unavailable.sh
```

- Generated:

```text
various/04-compare-section-command/archive-content-command.json
various/04-compare-section-command/child-process-output.txt
various/04-compare-section-command/child-process-exit-code.txt
```

### Why

The implementation plan called for a shell-backed bridge around the built-in compare-region verb. Before building more orchestration on that assumption, I needed to validate whether custom css-visual-diff JS verbs can spawn subprocesses.

### What worked

The command planner works. For Archive content it returns:

```text
page: archive
section: content
leftSelector: #root > *
rightSelector: [data-page='archive']
```

It also returns a full shell command using the built-in compare-region verb. That is useful for shell smoke scripts and documentation.

### What didn't work

The current Goja runtime does not expose `child_process` as a valid module. The diagnostic script failed with:

```text
Error: GoError: Invalid module at github.com/dop251/goja_nodejs/require.(*RequireModule).require-fm (native)
```

Exit code:

```text
1
```

This means the planned `child_process.spawn` bridge cannot run inside a css-visual-diff JS verb today.

### What I learned

This strongly reinforces the maintainer request for a JS-callable pixel comparison primitive such as `cvd.comparePixels(...)`. Without it, a project-specific JS verb can plan and summarize pixel comparisons, but actual pixel comparison execution has to happen through shell scripts or the built-in CLI.

### What was tricky to build

The tricky design point is avoiding a half-fake `compare-section` verb. Returning a command plan is honest and useful. Pretending to execute the comparison from JS would either fail or require unsupported runtime features. The task list now marks actual `compare-section` execution as blocked pending a core API/process-execution capability.

### What warrants a second pair of eyes

- Whether css-visual-diff should expose `child_process`-like behavior at all, or whether the cleaner design is only to expose `cvd.comparePixels(...)`.
- Whether the command planner should be renamed from `compare-section-command` to `plan-compare-section` for clarity.

### What should be done in the future

- Keep using shell smoke scripts for actual built-in compare-region execution.
- Update the maintainer feature request with this concrete runtime limitation if needed.
- Do not block Phase 5 reporting/orchestration work that can consume command plans and existing results.

### Code review instructions

Review:

```text
scripts/lib/compare-region.js
scripts/verbs/pyxis-pages.js
scripts/05-smoke-compare-section-command.sh
scripts/06-smoke-child-process-unavailable.sh
various/04-compare-section-command/archive-content-command.json
```

Validate command planning:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/05-smoke-compare-section-command.sh
```

Validate the runtime limitation:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/06-smoke-child-process-unavailable.sh
```

The second command is expected to fail with `Invalid module`.

### Technical details

The command planner builds args for:

```text
css-visual-diff verbs script compare region
```

and returns both an `args` array and a quoted `shellCommand`. It intentionally does not execute the command inside Goja.


## Step 7: Upload updated progress and source bundles to reMarkable

After implementing Phases 1 through 3 and the Phase 4 command-planner/blocker investigation, I uploaded updated bundles to reMarkable. The earlier upload captured the planning ticket before implementation; this upload captures the current implementation state and the source files.

This gives the reMarkable copy both the narrative docs and a syntax-highlighted source bundle for offline review.

### Prompt Context

**User prompt (verbatim):** (see Step 3)

**Assistant interpretation:** Keep the ticket and implementation artifacts available on reMarkable as work progresses.

**Inferred user intent:** Preserve the current ticket state and source code in a reviewable form outside the repository.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Uploaded docs/progress bundle:

```text
PYXIS css-visual-diff JS Userland Library Progress
```

- Uploaded source bundle:

```text
PYXIS css-visual-diff JS Userland Library Source
```

- Verified remote directory:

```bash
remarquee cloud ls /ai/2026/04/25/PYXIS-CSSVD-JS-LIB --long --non-interactive
```

### Why

The ticket changed substantially after the initial planning upload: it now includes actual JS modules, verbs, smoke tests, generated summaries, and runtime limitation evidence. The reMarkable upload should reflect that progress.

### What worked

Verification listed:

```text
[f]	PYXIS css-visual-diff JS Userland Library Current Ticket
[f]	PYXIS css-visual-diff JS Userland Library Plan
[f]	PYXIS css-visual-diff JS Userland Library Progress
[f]	PYXIS css-visual-diff JS Userland Library Source
```

### What didn't work

No upload failures occurred.

### What I learned

For a ticket that includes both long-form docs and source scripts, the best reMarkable delivery is two bundles: a Markdown docs bundle and a source-code bundle.

### What was tricky to build

N/A. The only consideration was explicitly passing both directories and individual shell scripts to `remarquee upload src --bundle`.

### What warrants a second pair of eyes

N/A for upload mechanics.

### What should be done in the future

Upload another progress bundle after Phase 4/5 actual compare orchestration changes, especially if a new `cvd.comparePixels` primitive becomes available.

### Code review instructions

Verify remote state with:

```bash
remarquee cloud ls /ai/2026/04/25/PYXIS-CSSVD-JS-LIB --long --non-interactive
```

### Technical details

Remote path:

```text
/ai/2026/04/25/PYXIS-CSSVD-JS-LIB
```
