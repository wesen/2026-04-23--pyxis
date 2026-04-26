---
Title: Wire pyxis-app routes to backend RTK Query
Ticket: PYXIS-APP-RTK-ROUTES
Status: active
Topics:
    - frontend
    - backend
    - rtk-query
    - pyxis
    - storybook
    - visual-diff
DocType: index
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: ""
LastUpdated: 2026-04-26T01:02:13.347243489-04:00
WhatFor: ""
WhenToUse: ""
---

# Wire pyxis-app routes to backend RTK Query

## Overview

This ticket follows `PYXIS-APP-REACT`. The previous ticket built the responsive staff app package, component architecture, Storybook coverage, visual-diff workflow, and Phase 8C component-system reuse pass. This ticket wires that UI to the Go backend that now exposes staff routes.

The core work is to freshen `pyxis-app` routes around real RTK Query behavior: normalize backend response envelopes, remove live-route seed fallbacks, add route loading/error/empty states, wire mutations for shows/bookings/calendar/attendance/settings, and preserve visual parity through Storybook/MSW fixtures and focused `css-visual-diff` guards.

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- frontend
- backend
- rtk-query
- pyxis
- storybook
- visual-diff

## Tasks

See [tasks.md](./tasks.md) for the current task list.

## Changelog

See [changelog.md](./changelog.md) for recent changes and decisions.

## Structure

- design/ - Architecture and design documents
- reference/ - Prompt packs, API contracts, context summaries
- playbooks/ - Command sequences and test procedures
- scripts/ - Temporary code and tooling
- various/ - Working notes and research
- archive/ - Deprecated or reference-only artifacts
