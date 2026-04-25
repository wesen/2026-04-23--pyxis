---
Title: Migrate public site data layer to RTK Query and shared pyxis-types package
Ticket: PYXIS-RTK-TYPES-MIGRATION
Status: active
Topics:
    - frontend
    - react
    - rtk-query
    - typescript
    - architecture
    - pyxis
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - web/packages/pyxis-user-site/src/App.tsx
    - web/packages/pyxis-user-site/src/api/hooks.ts
    - web/packages/pyxis-user-site/src/api/types.ts
    - web/packages/pyxis-components/src/mocks/types.ts
    - web/packages/pyxis-components/src/mocks/handlers.ts
ExternalSources: []
Summary: "Ticket for migrating Pyxis public-site data fetching from TanStack React Query to RTK Query, centralizing duplicated API/domain types in a new pyxis-types workspace package, and extracting public component inline styles into tokenized themeable CSS."
LastUpdated: 2026-04-24T00:00:00Z
WhatFor: "Planning and handing off the RTK Query + pyxis-types migration and public component CSS extraction/theming work to an intern."
WhenToUse: "Use before implementing app-level data architecture changes, component styling stabilization, or page rewiring that depends on shared API types and stable themed public components."
---

# Migrate public site data layer to RTK Query and shared pyxis-types package

## Overview

This ticket contains the intern handoff for three related foundation migrations:

1. Add a shared `pyxis-types` workspace package for public API/domain types.
2. Migrate `pyxis-user-site` from TanStack React Query to RTK Query.
3. Extract public component inline styles into tokenized, themeable CSS using stable `data-pyxis` part selectors.

The work is intentionally planned before page-level application composition so the data, type, and component styling foundations are stable.

## Primary Documents

- [RTK Query and pyxis-types migration guide](./design-doc/01-rtk-query-and-pyxis-types-migration-guide.md)
- [Public component CSS extraction and theming guide](./design-doc/02-public-component-css-extraction-and-theming-guide.md)
- [Investigation diary](./reference/01-investigation-diary.md)
- [Tasks](./tasks.md)
- [Changelog](./changelog.md)

## Status

Current status: **active**

The design guides and phased task list are ready for implementation handoff. No migration code has been implemented in this ticket yet.

## Topics

- frontend
- react
- rtk-query
- typescript
- architecture
- pyxis

## Structure

- `design-doc/` — primary implementation guide
- `reference/` — diary and supporting references
- `playbooks/` — command sequences and test procedures, if added later
- `scripts/` — temporary tooling, if added later
- `various/` — working notes and research
- `archive/` — deprecated/reference-only artifacts
