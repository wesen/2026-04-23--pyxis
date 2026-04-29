---
Title: Redesign Pyxis show edit modal and show edit page
Ticket: PYXIS-SHOW-EDIT-VISUAL-REDESIGN
Status: active
Topics:
    - pyxis
    - staff-app
    - design-system
    - react
    - storybook
DocType: index
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: "Ticket for redesigning the Pyxis staff show create/edit modal and show edit page from PNG references using component decomposition and Storybook-first validation."
LastUpdated: 2026-04-29T18:40:00-04:00
WhatFor: "Plan and later implement a clearer, componentized visual redesign for show editing."
WhenToUse: "Use before touching NewShowModal or ShowDetailPage visual structure."
---

# Redesign Pyxis show edit modal and show edit page

## Overview

This ticket documents how to redesign the staff show create/edit modal and show edit page using two PNG references:

- `sources/01-reference-pngs/show-admin-reference.png`
- `sources/01-reference-pngs/show-modal-reference.png`

The key decision is to start from component decomposition. The implementation should classify the designs into page/container logic, organisms, molecules, atoms, and shared primitives before changing CSS.

## Primary deliverable

- [design-doc/01-show-edit-modal-and-page-visual-redesign-implementation-guide.md](./design-doc/01-show-edit-modal-and-page-visual-redesign-implementation-guide.md)

## Supporting evidence

- [sources/04-reference-png-analysis.md](./sources/04-reference-png-analysis.md)
- [sources/02-code-evidence-inventory.txt](./sources/02-code-evidence-inventory.txt)
- [sources/03-line-anchored-code-excerpts.txt](./sources/03-line-anchored-code-excerpts.txt)

## Status

Current status: **active**.

Documentation and reMarkable delivery are complete. Implementation is intentionally left as a future coding pass with tasks in Phase 2 onward.

## Tasks

See [tasks.md](./tasks.md) for the current task list.

## Changelog

See [changelog.md](./changelog.md) for recent changes and decisions.

## Structure

- `design-doc/` — primary design/implementation guide.
- `reference/` — chronological diary.
- `sources/` — PNGs, image analysis, code evidence.
- `scripts/` — future local capture/smoke scripts.
- `various/` — future temporary visual artifacts.
- `archive/` — deprecated/reference-only material.
