---
Title: Explore css-visual-diff JavaScript scripting workflow
Ticket: PYXIS-CSSVD-JS-WORKFLOW
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
    - css-visual-diff help pixel-accuracy-scripting-guide
    - css-visual-diff help javascript-api
    - css-visual-diff help javascript-verbs
    - css-visual-diff help inspect-workflow
Summary: "Exploration ticket for applying css-visual-diff JavaScript verbs to simplify and improve the Pyxis visual parity workflow."
LastUpdated: 2026-04-25T07:40:00-04:00
WhatFor: "Track experiments, scripts, diary entries, and blog-post research notes for replacing/supplementing YAML visual diff configs with JS workflows."
WhenToUse: "Use when continuing css-visual-diff JS workflow experiments or writing the technical deep dive."
---

# Explore css-visual-diff JavaScript scripting workflow

## Overview

This ticket explores the new `css-visual-diff` JavaScript scripting support and how it can simplify the Pyxis visual parity workflow.

The immediate research question:

> Can we replace or supplement repetitive YAML configs and ad-hoc `.mjs`/shell glue with repository-scanned JavaScript verbs that load pages, preflight selectors, extract browser-computed facts, compare regions, write artifacts, and produce better reports?

## Status

Current status: **active**.

Completed so far:

- Read the main pixel-accuracy scripting guide and related JavaScript docs.
- Captured help docs into `sources/css-visual-diff-help/`.
- Proved ticket-local JS verbs work.
- Proved a built-in JS `compare region` command can reproduce the Archive content YAML diff without YAML.
- Wrote the experiment guide, diary, and copious blog-post research notes.

## Key Links

- [Experiment guide](./design/01-css-visual-diff-javascript-workflow-experiment-guide.md)
- [Exploration diary](./reference/01-exploration-diary.md)
- [Copious research notes for technical deep dive](./reference/02-copious-research-notes-for-technical-deep-dive.md)
- [Tasks](./tasks.md)
- [Changelog](./changelog.md)

## Scripts

All ticket scripts live in:

```text
scripts/
```

Current scripts:

```text
scripts/01-capture-cssvd-js-help.sh
scripts/02-smoke-cssvd-js-verb.js
scripts/03-run-built-in-compare-region-smoke.sh
```

Generated experiment outputs live in:

```text
various/
```

Captured source docs live in:

```text
sources/css-visual-diff-help/
```

## Key finding so far

The built-in JavaScript verb path can reproduce at least one existing YAML page-section comparison:

```text
Archive content YAML diff:      7.1281%
Archive content JS region diff: 7.128146453089244%
```

That makes JavaScript scripting a plausible workflow simplification path, especially for authoring commands, reporting, and page registry generation.

## Next recommended experiments

1. Implement `scripts/04-report-public-page-yaml-results.js` to summarize existing page YAML results into JSON/Markdown.
2. Implement `scripts/06-inspect-public-page-section.js` for locator-first section inspection during Shows tuning.
3. Build a Pyxis page registry DSL once the first two scripts clarify the shape.

## Structure

- `design/` — experiment guide and design material.
- `reference/` — diary and blog-post research notes.
- `scripts/` — all exploratory scripts for this ticket.
- `sources/` — captured source/help material.
- `various/` — generated experiment artifacts.
- `playbooks/` — future stabilized runbooks.
- `archive/` — deprecated or replaced notes/artifacts.
