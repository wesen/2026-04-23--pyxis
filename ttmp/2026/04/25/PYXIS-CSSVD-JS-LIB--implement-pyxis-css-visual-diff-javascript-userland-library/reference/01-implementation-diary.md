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
