---
Title: Complete fundamental staff operations workflows
Ticket: PYXIS-STAFF-OPS-FUNDAMENTALS
Status: active
Topics:
    - pyxis
    - react
    - frontend
    - backend
    - protobuf
    - postgresql
    - staff-app
DocType: index
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: "Design package for completing Pyxis staff workflows: show create/edit/lineup/flyers, booking edits/review notes, artist operations, attendance editing, and core settings."
LastUpdated: 2026-04-26T20:21:32.387644756-04:00
WhatFor: "Use when implementing the next staff app productization phase after RTK/MSW backend integration."
WhenToUse: "Before changing staff operations UI, backend APIs, protobuf schemas, or database migrations for these workflows."
---

# Complete fundamental staff operations workflows

## Overview

This ticket contains the design and implementation plan for the next major Pyxis staff-app productization phase. It targets the fundamental operations that are still missing or only partially wired after the real RTK/MSW/backend work:

- new/edit show,
- lineup edit,
- flyer upload/delete UI,
- booking detail edits,
- persistent booking review notes,
- complete artist create/edit/detail functionality,
- attendance editing,
- core settings editing for only space name, address, and capacity.

The primary output is a detailed intern-ready implementation guide with source evidence, visual ASCII sketches, YAML shortform React markup, database/API/protobuf plans, phased implementation tasks, and validation instructions.

## Key Links

- [Design guide](./design-doc/01-staff-operations-workflows-design-and-implementation-guide.md)
- [Investigation diary](./reference/01-investigation-diary.md)
- [Evidence line references](./sources/01-evidence-line-references.md)
- [Gap audit script output](./sources/02-staff-ops-gap-audit-output.md)
- [Gap audit script](./scripts/01-audit-staff-ops-gaps.sh)
- [Tasks](./tasks.md)
- [Changelog](./changelog.md)

## Status

Current status: **active**.

Phase 0 research/design is complete. Implementation phases are intentionally left open for follow-up work.

## Topics

- pyxis
- react
- frontend
- backend
- protobuf
- postgresql
- staff-app

## Tasks

See [tasks.md](./tasks.md) for the current task list.

## Changelog

See [changelog.md](./changelog.md) for recent changes and decisions.

## Structure

- `design-doc/` — primary architecture and implementation guide
- `reference/` — diary and reference material
- `sources/` — generated evidence and audit output
- `scripts/` — ticket-local helper scripts
- `playbooks/` — optional future runbooks
- `various/` — working notes
- `archive/` — deprecated or reference-only artifacts
