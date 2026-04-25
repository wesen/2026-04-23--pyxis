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


## Step 8: Evaluate the new flexible css-visual-diff JavaScript API and update compare-section

The user reported that css-visual-diff now has an entirely new, more flexible JavaScript API and asked me to read the docs, update the scripts/workflow, experiment with it, and write a technical report. I captured the new docs into the ticket, then replaced the previous command-planner-only compare bridge with a direct `cvd.compare.region(...)` implementation.

This is the most important turning point in the ticket: the core primitive we had requested upstream now exists, and it works for the Pyxis Archive content comparison.

### Prompt Context

**User prompt (verbatim):** "We implemented an entirely new more flexible JS API in css-visual-diff, read the docs (css-visual-diff help), and update your current scripts / update your workflow to see if that helps improve things, play around with it a bit, and then write me a report on what you think, detailed and technical, in the ticket, and upload to remarkable."

**Assistant interpretation:** Re-read the css-visual-diff help for the new JS API, change the current userland library to use it, run experiments, document findings in the ticket, and upload the result.

**Inferred user intent:** Validate the new API against real Pyxis workflows and produce actionable technical feedback.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Added docs capture script:

```text
scripts/07-capture-new-flexible-js-api-docs.sh
```

- Captured updated help docs under:

```text
sources/css-visual-diff-help-2026-04-25-flexible-js-api/
```

- Added new API smoke script:

```text
scripts/08-smoke-new-api-compare-section.sh
```

- Updated:

```text
scripts/lib/compare-region.js
scripts/verbs/pyxis-pages.js
```

- Implemented:

```text
pyxis pages compare-section <page> <section>
```

using:

```js
await cvd.compare.region({
  left: leftPage.locator(section.original),
  right: rightPage.locator(section.react),
  outDir,
  threshold,
  inspect: 'rich',
})
```

- Wrote technical report:

```text
reference/02-flexible-javascript-api-evaluation-report.md
```

### Why

Our previous Phase 4 implementation was blocked at the exact boundary the new API addresses. We could plan a compare-region command, but could not execute it from Goja because `child_process` is unavailable. `cvd.compare.region(...)` removes that blocker.

### What worked

The Archive content comparison succeeded through our own userland verb and reproduced the previous baselines exactly:

```text
changedPercent: 7.128146453089244
changedPixels: 102172
totalPixels: 1433360
normalized size: 920 x 1558
```

Generated artifacts:

```text
various/05-new-api-compare-section/archive-content/01-compare-report.md
various/05-new-api-compare-section/archive-content/compare.json
various/05-new-api-compare-section/archive-content/compare-section-output.json
various/05-new-api-compare-section/archive-content/diff_comparison.png
various/05-new-api-compare-section/archive-content/diff_only.png
various/05-new-api-compare-section/archive-content/left_region.png
various/05-new-api-compare-section/archive-content/right_region.png
```

### What didn't work

1. A first run occasionally saw the Storybook selector as missing. I fixed this by explicitly waiting for both selectors with `page.prepare({ waitFor })`.

2. `page.prepare` failed when I used an empty script:

```text
PrepareError: prepare target "archive-prototype": script prepare requires script or script_file
```

Fix:

```js
script: 'void 0'
```

3. I repeated the shell `tee` directory timing footgun. If a script creates `$OUT`, the caller cannot pipe to `tee "$OUT/file"` unless the directory exists before the pipeline starts.

### What I learned

The new API is exactly the primitive we wanted. The most important new pieces are:

```text
locator.collect(...)
cvd.collect.selection(...)
cvd.compare.region(...)
cvd.compare.selections(...)
cvd.image.diff(...)
cvd.catalog.create(...).record(comparison)
```

This changes the implementation plan: `pyxis pages compare-section`, `compare-page`, and `compare-all` should use `cvd.compare.region(...)` directly. The shell command planner remains useful for compatibility/debugging, but it is no longer the primary path.

### What was tricky to build

The tricky part was not the new comparison API itself; it was the page readiness contract. Storybook/RTK/MSW pages can be loaded before the meaningful selector exists. The userland library should always wait for the registered section selectors before comparing.

### What warrants a second pair of eyes

- Whether `page.prepare({ type: 'script', waitFor, script: 'void 0' })` is the intended no-op wait pattern or whether css-visual-diff should expose a dedicated selector wait helper.
- Whether `comparison.toJSON().artifacts` should list `compare.json` and `compare.md` after `comparison.artifacts.write(outDir, ['json', 'markdown'])`; currently the compact wrapper sees PNG artifact entries but not JSON/Markdown entries.

### What should be done in the future

- Implement `pyxis pages compare-page` using a loop over registry sections plus `cvd.catalog.create(...)`.
- Update the external maintainer request doc before sharing it broadly: the P0 core primitive request is now satisfied.
- Keep explicit selector waits in all browser-backed comparison verbs.

### Code review instructions

Review:

```text
scripts/lib/compare-region.js
scripts/verbs/pyxis-pages.js
scripts/07-capture-new-flexible-js-api-docs.sh
scripts/08-smoke-new-api-compare-section.sh
reference/02-flexible-javascript-api-evaluation-report.md
```

Validate:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/07-capture-new-flexible-js-api-docs.sh
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/08-smoke-new-api-compare-section.sh
```

### Technical details

The new command uses `comparison.summary()` for compact stdout and `comparison.toJSON()` / `comparison.artifacts.write(...)` for durable artifacts. The resulting `changedPercent` exactly matches the previous built-in CLI smoke and YAML result for Archive content.


## Step 9: Upload the flexible JS API evaluation to reMarkable

After committing the flexible API evaluation work, I uploaded the report and the focused experiment source files to reMarkable. This makes both the technical conclusion and the scripts that produced it available for offline review.

### Prompt Context

**User prompt (verbatim):** (see Step 8)

**Assistant interpretation:** Finish the report workflow by publishing the evaluation bundle to reMarkable.

**Inferred user intent:** Preserve the latest API evaluation and experiment source in a reader-friendly format.

**Commit (code):** `d2167f5` — "Evaluate flexible css visual diff JS API"

### What I did

Uploaded a Markdown report bundle:

```text
PYXIS css-visual-diff Flexible JS API Evaluation
```

Uploaded a source bundle:

```text
PYXIS css-visual-diff Flexible JS API Experiment Source
```

Verified with:

```bash
remarquee cloud ls /ai/2026/04/25/PYXIS-CSSVD-JS-LIB --long --non-interactive
```

### Why

The new API evaluation changes the direction of the userland library: `cvd.compare.region(...)` replaces the previous shell/subprocess bridge plan. It should be easy to review independently.

### What worked

The remote directory now includes:

```text
PYXIS css-visual-diff Flexible JS API Evaluation
PYXIS css-visual-diff Flexible JS API Experiment Source
```

### What didn't work

No upload failure occurred.

### What I learned

For evaluation work, a focused report bundle plus a focused source bundle is more useful than only uploading the whole ticket.

### What was tricky to build

N/A.

### What warrants a second pair of eyes

Review the report's revised maintainer recommendations before sharing externally, because the previous P0 request is now marked satisfied.

### What should be done in the future

Upload a new bundle after implementing `compare-page` / catalog orchestration.

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


## Step 10: Create clean maintainer follow-up request document

The earlier maintainer request document still contained historical context about the missing JS-callable pixel comparison primitive. After the flexible API evaluation, that request is satisfied by `cvd.compare.region(...)`, `cvd.compare.selections(...)`, and `cvd.image.diff(...)`. The user asked for a clean separate document containing only the newly desired features.

I created a new maintainer-facing document that removes the obsolete core request and focuses only on follow-up ergonomics discovered during Pyxis integration.

### Prompt Context

**User prompt (verbatim):** "make a cleaned request doucment that only contains the newly desired features (separate doc)"

**Assistant interpretation:** Create a separate cleaned-up upstream request document without obsolete requests that were satisfied by the new flexible JS API.

**Inferred user intent:** Have a concise document suitable for sharing with css-visual-diff maintainers, focused on the next useful improvements rather than historical asks.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

Created:

```text
design/03-clean-css-visual-diff-maintainer-follow-up-requests-after-flexible-js-api.md
```

The new document keeps only current requests:

```text
P0 selector wait helper
P0 artifact write/report schema clarity
P1 multi-section comparison/catalog example
P1 collection profile/default documentation
P2 structural/bounds tolerances
P2 CSS/style normalization hooks
P3 style property presets
P3 explicit no-op prepare/wait documentation
```

It explicitly states that the old request for a JS-callable pixel comparison primitive is no longer requested because it is satisfied by the new flexible JS API.

### Why

The old maintainer request document is useful historical context, but it is no longer the clean document to share externally. A maintainer should not have to read through superseded P0 requests to find the actual current asks.

### What worked

The cleaned document is standalone and concise enough to share directly. It includes concrete usage examples and priority labels.

### What didn't work

N/A.

### What I learned

The new API changes the maintainer conversation from “please expose the core primitive” to “please make the new primitive easier to use correctly in larger workflows.”

### What was tricky to build

The main editorial challenge was separating historical context from current asks. The document includes only enough context to explain why the old request is obsolete.

### What warrants a second pair of eyes

Review priority ordering before sharing upstream. In particular, confirm whether artifact schema clarity should be P0 or P1.

### What should be done in the future

If this is shared with maintainers, consider splitting it into separate upstream issues:

1. selector wait helper,
2. artifact write result schema,
3. multi-section catalog example,
4. collection profile docs,
5. tolerances/normalization.

### Code review instructions

Review:

```text
design/03-clean-css-visual-diff-maintainer-follow-up-requests-after-flexible-js-api.md
```

Validate that it does not re-request `cvd.compare.region(...)`, except to state that this request is satisfied.


## Step 11: Incorporate completed beta ergonomics follow-up

The user reported that css-visual-diff completed the scoped beta ergonomics follow-up: selector readiness helpers, stable artifact path results, a multi-section catalog example, and collection profile documentation. I updated the Pyxis userland implementation and the clean maintainer request document accordingly.

This means the remaining upstream request list is now much smaller and mostly policy-oriented. The high-priority workflow friction we observed in Pyxis is largely addressed.

### Prompt Context

**User prompt (verbatim):** "We completed the scoped css-visual-diff beta ergonomics follow-up for JavaScript visual workflows.        
                                                                                                           
 What landed:                                                                                              
                                                                                                           
 1. Selector readiness helpers                                                                             
     - Added locator.waitFor(options) as the preferred readiness API.                                      
     - Added page.waitForSelector(selector, options) as a small convenience wrapper.                       
     - Supports timeoutMs, pollIntervalMs, visible, and afterWaitMs.                                       
     - This replaces the awkward previous workaround of using page.prepare(... waitFor ...) just to wait   
 for Storybook/app selectors.                                                                              
 2. Stable artifact path results                                                                           
     - comparison.artifacts.write(outDir, ["json", "markdown"]) now returns stable keyed paths:            
           - json                                                                                          
           - markdown                                                                                      
           - leftRegion                                                                                    
           - rightRegion                                                                                   
           - diffOnly                                                                                      
           - diffComparison                                                                                
           - written                                                                                       
     - This makes project-local CLI wrappers much easier because they can return compact JSON summaries    
 with direct artifact links.                                                                               
 3. Multi-section catalog example                                                                          
     - Added examples/verbs/compare-page-catalog.js.                                                       
     - It loads left/right pages once, waits for selectors, compares multiple sections, writes per-section 
 artifacts, records comparisons into one catalog, and returns JSON suitable for CI or agent use.           
     - Added a smoke script that validates manifest/index output, per-section PNG/JSON/Markdown artifacts, 
 and stdout artifact paths.                                                                                
 4. Collection profile documentation                                                                       
     - Documented minimal, rich, and debug profiles based on the actual implementation.                    
     - Clarified that styleProps and attributes are collection-time filters, not just report filters.      
     - rich remains the default for diagnostics.                                                           
     - minimal is recommended for lean/high-volume CI checks.                                              
     - debug is recommended for one-off investigation because it collects inner HTML, all computed styles, 
 and all attributes.                                                                                       
                                                                                                           
 Explicitly deferred for now:                                                                              
                                                                                                           
 - Bounds tolerance API.                                                                                   
 - CSS/style normalization hooks.                                                                          
 - Built-in style property presets.                                                                        
                                                                                                           
 Those are still plausible future features, but they encode project policy. We intentionally left them out 
 until beta usage shows repeated patterns that justify shared abstractions."

**Assistant interpretation:** Update our implementation and docs now that the previously requested beta ergonomics landed.

**Inferred user intent:** Keep the Pyxis ticket accurate and stop requesting features that css-visual-diff already implemented.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Updated `scripts/lib/compare-region.js` to use:

```js
await page.locator(selector).waitFor({
  timeoutMs: 30000,
  pollIntervalMs: 100,
  visible: true,
  afterWaitMs: 500,
})
```

instead of `page.prepare({ waitFor, script: 'void 0' })`.

- Updated `compareSection(...)` to consume the stable return value from:

```js
const written = await comparison.artifacts.write(outDir, ['json', 'markdown'])
```

and return direct paths for `json`, `markdown`, `leftRegion`, `rightRegion`, `diffOnly`, `diffComparison`, and `written`.

- Rewrote:

```text
design/03-clean-css-visual-diff-maintainer-follow-up-requests-after-flexible-js-api.md
```

so it no longer requests landed features.

- Appended a beta ergonomics update section to:

```text
reference/02-flexible-javascript-api-evaluation-report.md
```

### Why

The previous clean request document was already narrower than the original wishlist, but it still requested selector wait helpers, artifact path clarity, multi-section examples, and collection profile docs. Those have now landed, so the document needed another cleanup pass.

### What worked

The Archive content smoke still passes with the exact same pixel result:

```text
changedPercent: 7.128146453089244
changedPixels: 102172
```

The compact JSON row now includes direct artifact fields from the new `artifacts.write(...)` result:

```text
artifactJson
artifactMarkdown
leftRegionPath
rightRegionPath
diffOnlyPath
diffComparisonPath
writtenArtifacts
```

### What didn't work

No new runtime failure occurred.

### What I learned

The beta ergonomics update turned several Pyxis userland workarounds into straightforward API calls. The remaining feature requests are no longer blockers; they are potential shared abstractions if beta users repeatedly implement them.

### What was tricky to build

The tricky part was editorial rather than technical: making sure the request document does not keep asking for landed features.

### What warrants a second pair of eyes

Review whether the remaining requests should be shared upstream at all right now, or whether we should wait for more Pyxis compare-page/compare-all usage.

### What should be done in the future

Implement `compare-page` using the now-documented multi-section catalog pattern.

### Code review instructions

Review:

```text
scripts/lib/compare-region.js
design/03-clean-css-visual-diff-maintainer-follow-up-requests-after-flexible-js-api.md
reference/02-flexible-javascript-api-evaluation-report.md
```

Validate:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/08-smoke-new-api-compare-section.sh
```


## Step 12: Implement compare-page catalog orchestration for Archive

I continued from the flexible JS API evaluation by implementing the first page-level orchestration command: `pyxis pages compare-page <page>`. This command opens the prototype and Storybook pages once, waits for each registered section, compares each section with `cvd.compare.region(...)`, writes per-section artifacts, records each comparison into a css-visual-diff catalog, and returns a compact page summary.

This is the first implementation of the workflow we wanted after the beta ergonomics follow-up: project registry and policy in userland, browser/image comparison and catalog primitives in css-visual-diff.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue implementing the next planned userland library step after `compare-section`, using the new flexible JS API.

**Inferred user intent:** Move from single-section comparison toward page-level orchestration and catalog output.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Updated:

```text
scripts/lib/compare-region.js
scripts/verbs/pyxis-pages.js
```

- Added smoke script:

```text
scripts/09-smoke-compare-page-archive.sh
```

- Implemented verb:

```text
pyxis pages compare-page <page>
```

- Ran Archive page smoke and generated:

```text
various/06-compare-page/archive/compare-page-output.json
various/06-compare-page/archive/manifest.json
various/06-compare-page/archive/01-catalog-index.md
various/06-compare-page/archive/artifacts/page/*
various/06-compare-page/archive/artifacts/content/*
```

### Why

A one-section compare command is useful, but page-level visual parity needs a higher-level loop that compares all registered sections for a page and leaves behind a navigable artifact bundle. The new `cvd.catalog.create(...).record(comparison)` API is designed for this.

### What worked

Archive page comparison produced two section rows:

```text
page    6.651092748474785% / 103350 changed pixels
content 7.128146453089244% / 102172 changed pixels
```

The command wrote:

```text
manifest.json
01-catalog-index.md
artifacts/page/compare.json
artifacts/page/compare.md
artifacts/page/diff_comparison.png
artifacts/content/compare.json
artifacts/content/compare.md
artifacts/content/diff_comparison.png
```

The returned JSON includes:

```text
sectionCount: 2
maxChangedPercent: 7.128146453089244
manifestPath: .../manifest.json
indexPath: .../01-catalog-index.md
catalog.comparisonCount: 2
```

### What didn't work

My first validation expected the Archive page changed percent from the earlier rounded Markdown report (`6.6511%`) with a slightly different long-form value. The new direct `cvd.compare.region(...)` returned:

```text
6.651092748474785%
```

The changed pixel count is the same expected value (`103350`), so I updated the assertion to validate the exact current JS API output and changed pixel count.

### What I learned

The catalog API works well for page orchestration. One important detail: use a docmgr-friendly catalog index filename directly (`01-catalog-index.md`) rather than writing `index.md` and renaming it in a shell script. This keeps stdout `indexPath` accurate.

### What was tricky to build

The main design choice was where to open pages. `compare-section` opens and closes pages for one section. `compare-page` should not do that per section; it opens the prototype and Storybook pages once and reuses them across the registered sections. That makes page-level comparison faster and closer to the documented multi-section pattern.

### What warrants a second pair of eyes

- Whether broad prototype selectors for Shows sections are precise enough before implementing `compare-all`.
- Whether catalog target metadata should include both left and right URLs/selectors rather than only the left-side URL/selector in `catalog.record(...)`.

### What should be done in the future

- Implement `compare-all` by looping over registered pages and reusing `compare-page`.
- Add policy classification to page summaries.
- Consider using `inspect: minimal` for high-volume runs, with `rich` as authoring/default.

### Code review instructions

Review:

```text
scripts/lib/compare-region.js
scripts/verbs/pyxis-pages.js
scripts/09-smoke-compare-page-archive.sh
various/06-compare-page/archive/compare-page-output.json
various/06-compare-page/archive/01-catalog-index.md
```

Validate:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/09-smoke-compare-page-archive.sh
```

### Technical details

The page smoke currently validates Archive because it has two stable sections and the closest first-pass parity. `compare-all` should come next, after deciding whether to include all Shows sub-sections with their current broad prototype selectors.


## Step 13: Implement compare-all and accepted-difference reporting

I extended the page orchestration work into the full suite command: `pyxis pages compare-all`. The command loops over registered public pages, calls the page-level comparison/catalog workflow for each page, aggregates all section rows, classifies them with the existing policy bands, and writes a suite JSON/Markdown summary.

I also added accepted-difference metadata plumbing. Page records can now define accepted differences per section, comparison rows include `acceptedDifferences`, `acceptedDifferenceCount`, and `acceptedDifferenceSummary`, and Markdown tables include an accepted-differences column. No public page accepted differences are currently registered, so the generated suite report explicitly says that none are registered. This is intentional: reporting support exists without pretending residual page diffs are accepted.

### Prompt Context

**User prompt (verbatim):** "Continue with docmgr ticket:

 - PYXIS-CSSVD-JS-LIB implementation beyond compare-section.                                             
 - Implement pyxis pages compare-page using cvd.compare.region(...) in a loop.                           
 - Implement pyxis pages compare-all.                                                                    
 - Add catalog recording with cvd.catalog.create(...).record(comparison).                                
 - Add accepted-difference reporting.                             

---

Continue task by task, commit at appropriate intervals, keep a frequent diary."

**Assistant interpretation:** Finish the page/suite orchestration tasks, keep the docmgr ticket current, and commit a coherent checkpoint after validation.

**Inferred user intent:** Move the CSSVD JS userland library from single-section tooling to reusable page/suite automation with review-friendly reports.

**Commit (code):** Pending at the time this diary entry was written.

### What I did

- Added accepted-difference metadata support to:

```text
scripts/lib/registry.js
scripts/lib/policies.js
scripts/lib/markdown.js
scripts/lib/compare-region.js
```

- Added compare-all orchestration to:

```text
scripts/lib/compare-region.js
scripts/verbs/pyxis-pages.js
```

- Added smoke/run scripts:

```text
scripts/10-smoke-compare-all-archive-filter.sh
scripts/11-run-compare-all-public-pages.sh
```

- Generated suite artifacts:

```text
various/07-compare-all/archive-filter/*
various/07-compare-all/public-pages-desktop/*
```

### Why

`compare-section` and `compare-page` are useful for local tuning, but public page work needs a command that can produce one reviewable suite report for all registered pages. This also creates a natural place to report project policy and accepted-difference context.

### What worked

The filtered smoke passed for Archive:

```text
pageCount: 1
sectionCount: 2
classificationCounts: { review: 2 }
acceptedDifferenceCount: 0
maxChangedPercent: 7.128146453089244
```

The full public-pages run passed:

```text
pageCount: 5
sectionCount: 13
maxChangedPercent: 66.85658212560386
classificationCounts:
  major-mismatch: 5
  tune-required: 6
  review: 2
acceptedDifferenceCount: 0
```

The generated suite Markdown lists all sections in descending changed-percent order and includes an accepted-differences column.

### What didn't work

The first compare-all smoke failed because I used:

```js
fs.mkdirSync(outDir, { recursive: true })
```

inside the css-visual-diff Goja runtime. The Goja `fs` implementation available to verbs supports the file operations we were already using, such as `readFileSync` and `writeFileSync`, but did not expose `mkdirSync`.

I fixed this by making shell smoke scripts create the requested output directory and relying on `comparison.artifacts.write(...)` / catalog artifact writing for nested artifact directories.

### What I learned

- The userland suite should avoid assuming Node's full `fs` API is available inside css-visual-diff verbs.
- Accepted-difference reporting should not alter classification by default. It is review context, not a magic waiver.
- The full compare-all output exactly reproduces the earlier page-level first-pass ordering: Shows is the dominant mismatch, Archive is closest.

### What was tricky to build

The tricky part was preserving the right boundary between project policy and css-visual-diff measurements. The implementation now keeps measurements/artifacts from css-visual-diff, while policy bands and accepted-difference metadata live in Pyxis userland.

### What warrants a second pair of eyes

- Whether accepted-difference metadata should live inline in `registry.js` or move to a separate JSON sidecar as the list grows.
- Whether `compare-all` should default to `inspect: minimal` for CI/high-volume use, leaving `rich` for authoring.
- Whether generated `compare.md` artifacts should be ignored by `docmgr doctor`, renamed, or kept as generated css-visual-diff outputs with known numeric-prefix warnings.

### What should be done in the future

- Add `--mode authoring|ci` and threshold/failure behavior.
- Add accepted-difference examples only when there is a real accepted page-level difference to document.
- Use the suite report to guide Shows tuning.

### Code review instructions

Review:

```text
scripts/lib/registry.js
scripts/lib/policies.js
scripts/lib/markdown.js
scripts/lib/compare-region.js
scripts/verbs/pyxis-pages.js
scripts/10-smoke-compare-all-archive-filter.sh
scripts/11-run-compare-all-public-pages.sh
various/07-compare-all/public-pages-desktop/01-suite-summary.md
```

Validate filtered smoke:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/10-smoke-compare-all-archive-filter.sh
```

Validate full suite:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/11-run-compare-all-public-pages.sh
```
