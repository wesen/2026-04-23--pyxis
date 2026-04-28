---
Title: Tune pyxis-app visual parity and functional UX coverage
Ticket: PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT
Status: active
Topics:
    - frontend
    - storybook
    - staff-app
    - react
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: docs/playbooks/09-pyxis-app-visual-tuning-runbook.md
      Note: Prior app visual tuning runbook and css-visual-diff workflow
    - Path: docs/playbooks/10-css-visual-diff-verb-operator-guide.md
      Note: Command-level visual diff operator guide
    - Path: pkg/server/server.go
      Note: Go backend route table and role gates
    - Path: prototype-design/visual-diff/userland/specs/app.components.visual.yml
      Note: Current app component comparison targets
    - Path: prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml
      Note: Current app page comparison targets
    - Path: web/packages/pyxis-app/src/App.tsx
      Note: Staff app React Router and session gate
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: Staff RTK Query API hooks
    - Path: web/packages/pyxis-app/src/api/endpoints.ts
      Note: Staff frontend endpoint constants
ExternalSources: []
Summary: Staff-app visual tuning and functional UX coverage audit using css-visual-diff, Storybook, prototype pages, React routes, and backend API surface maps.
LastUpdated: 2026-04-27T22:59:14.664677542-04:00
WhatFor: Use to plan and execute pyxis-app visual parity tuning and functional UX completion.
WhenToUse: Read before comparing or changing staff app pages, shell components, action buttons, or backend-backed workflows.
---


# Tune pyxis-app visual parity and functional UX coverage

## Overview

<!-- Provide a brief overview of the ticket, its goals, and current status -->

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- frontend
- visual-diff
- staff-app
- ux

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
