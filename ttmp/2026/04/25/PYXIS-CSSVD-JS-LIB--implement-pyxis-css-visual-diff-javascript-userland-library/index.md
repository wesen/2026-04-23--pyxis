---
Title: Implement Pyxis css-visual-diff JavaScript userland library
Ticket: PYXIS-CSSVD-JS-LIB
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - automation
  - pyxis
DocType: index
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources:
  - ../PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/design/01-css-visual-diff-javascript-workflow-experiment-guide.md
  - ../PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/reference/02-copious-research-notes-for-technical-deep-dive.md
Summary: "Planning ticket for implementing a Pyxis JavaScript userland library around css-visual-diff visual comparison workflows."
LastUpdated: 2026-04-25T08:25:00-04:00
WhatFor: "Use this ticket when starting implementation of reusable JS comparison helpers and project-specific css-visual-diff verbs."
WhenToUse: "Read before building the Pyxis css-visual-diff JS userland library or sharing upstream maintainer feature requests."
---

# Implement Pyxis css-visual-diff JavaScript userland library

## Overview

This ticket is a planning/handoff workspace for implementing a Pyxis-specific JavaScript userland library on top of `css-visual-diff`.

The previous exploration ticket concluded that most desired improvements can be built in JavaScript userland:

- page/target registry,
- Storybook URL helpers,
- artifact path helpers,
- style presets,
- result summarizers,
- authoring vs CI policies,
- threshold classification,
- accepted-difference annotations,
- Markdown/JSON report generation,
- shell-backed wrappers around the built-in `verbs script compare region` command.

The main upstream feature request is a JS-callable pixel comparison primitive, such as `cvd.comparePixels(...)`.

## Status

Current status: **active / ready for later implementation**.

No library code has been implemented yet. This ticket contains the implementation guide, task breakdown, maintainer requests, and diary seed.

## Key links

- [Implementation guide](./design/01-pyxis-css-visual-diff-javascript-userland-library-implementation-guide.md)
- [css-visual-diff maintainer feature requests](./design/02-css-visual-diff-maintainer-feature-requests.md)
- [Implementation diary](./reference/01-implementation-diary.md)
- [Tasks](./tasks.md)
- [Changelog](./changelog.md)

## Recommended first implementation step

Start with:

```text
pyxis pages summarize-results
```

Reason:

- It does not need browser work.
- It does not need upstream API changes.
- It directly replaces manual Phase 7 page-diff report copying.
- It proves value quickly.

## Proposed library shape

Prototype ticket-local under:

```text
scripts/lib/
scripts/verbs/
```

Potential stable commands:

```text
pyxis pages list-targets
pyxis pages summarize-results
pyxis pages inspect-section
pyxis pages compare-section
pyxis pages compare-page
pyxis pages compare-all
pyxis pages snapshot-section
```

## Upload

The ticket bundle should be uploaded to reMarkable under:

```text
/ai/2026/04/25/PYXIS-CSSVD-JS-LIB
```

Document name:

```text
PYXIS css-visual-diff JS Userland Library Plan
```

## Structure

- `design/` — implementation guide and maintainer feature requests.
- `reference/` — implementation diary and future reference notes.
- `scripts/` — future userland library and smoke scripts.
- `various/` — future generated experiment artifacts.
- `playbooks/` — future stabilized command runbooks.
