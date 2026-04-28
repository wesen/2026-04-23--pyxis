---
Title: OSHA-style staff app functional audit and polish backlog
Ticket: PYXIS-APP-FUNCTIONAL-OSHA-AUDIT
Status: active
Topics:
    - frontend
    - staff-app
    - backend
    - react
    - api-integration
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: pkg/server/server.go
      Note: Backend staff route table and role gates
    - Path: web/packages/pyxis-app/src/App.tsx
      Note: Staff app route table and session gate
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: RTK Query staff API hook map
    - Path: web/packages/pyxis-app/src/api/endpoints.ts
      Note: Frontend staff endpoint constants
    - Path: web/packages/pyxis-app/src/components/molecules/ShowTableRow/ShowTableRow.tsx
      Note: Shows row edit button behavior
    - Path: web/packages/pyxis-app/src/components/shell/AppTopBar/AppTopBar.tsx
      Note: Default topbar actions audit hazard
    - Path: web/packages/pyxis-app/src/pages/BookingReviewPage/Page.tsx
      Note: Booking review detail actions
    - Path: web/packages/pyxis-app/src/pages/BookingsPage/Page.tsx
      Note: Bookings queue actions and topbar actions
    - Path: web/packages/pyxis-app/src/pages/CalendarPage/Page.tsx
      Note: Calendar hold/block actions and hardcoded dates
    - Path: web/packages/pyxis-app/src/pages/DashboardPage/Page.tsx
      Note: Dashboard page callbacks and data queries
    - Path: web/packages/pyxis-app/src/pages/DiscordPage/Page.tsx
      Note: Discord page mock-data use
    - Path: web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
      Note: Show detail edit/archive/announce/cancel/duplicate/flyer actions
    - Path: web/packages/pyxis-app/src/pages/ShowsPage/Page.tsx
      Note: Shows page search/filter/new-show actions
ExternalSources: []
Summary: OSHA-style staff app functionality and polish audit covering live Vite routes, backend support, Storybook coverage, inert controls, destructive actions, and a detailed implementation backlog.
LastUpdated: 2026-04-28T13:09:47.211286996-04:00
WhatFor: Use to plan staff app backend functionality and UX polish after the visual tuning workflow was established.
WhenToUse: Read before wiring staff app buttons, adding backend endpoints, changing mutation UX, or creating Storybook/visual coverage for missing states.
---


# OSHA-style staff app functional audit and polish backlog

## Overview

<!-- Provide a brief overview of the ticket, its goals, and current status -->

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- frontend
- staff-app
- backend
- react
- api-integration

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
