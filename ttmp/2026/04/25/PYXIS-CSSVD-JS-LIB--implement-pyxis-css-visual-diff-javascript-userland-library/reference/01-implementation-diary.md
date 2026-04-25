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
