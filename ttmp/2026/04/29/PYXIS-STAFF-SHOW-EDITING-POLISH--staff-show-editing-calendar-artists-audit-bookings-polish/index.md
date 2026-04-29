---
Title: Staff show editing, calendar, artists, audit, and bookings polish
Ticket: PYXIS-STAFF-SHOW-EDITING-POLISH
Status: active
Topics:
  - pyxis
  - staff-app
  - frontend
  - show-management
  - production
DocType: index
Intent: short-term
Owners: []
RelatedFiles:
  - Path: web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
    Note: Show create/edit modal, required fields, drafts, lineup, and flyer selection.
  - Path: web/packages/pyxis-app/src/pages/ShowsPage/Page.tsx
    Note: Staff show overview, create flow, filtering, and show table behavior.
  - Path: web/packages/pyxis-app/src/components/organisms/Calendar/CalendarMonthPanel/CalendarMonthPanel.tsx
    Note: Calendar day-cell and event click behavior.
  - Path: web/packages/pyxis-app/src/pages/ArtistsPage/Page.tsx
    Note: Artist creation/editing surface.
  - Path: web/packages/pyxis-app/src/pages/AuditLogPage/Page.tsx
    Note: Audit filter form layout.
  - Path: web/packages/pyxis-app/src/pages/BookingsPage/Page.tsx
    Note: Booking header actions.
  - Path: web/packages/pyxis-app/src/components/shell/AppSidebarMenu/AppSidebarMenu.tsx
    Note: Sidebar booking badge.
ExternalSources:
  - /tmp/pi-clipboard-fb71c5b3-32d8-4d73-91a4-7ccb970914fd.png
Summary: Track and implement staff app polish for show editing fidelity, calendar click behavior, artist creation, audit filter layout, and booking navigation copy.
LastUpdated: 2026-04-29T16:45:00-04:00
WhatFor: Use this ticket to preserve analysis, implementation tasks, validation commands, and diary entries for staff editing polish.
WhenToUse: Use before modifying show create/edit flows, calendar behavior, artist UI, audit filters, or booking navigation affordances.
---

# Staff show editing, calendar, artists, audit, and bookings polish

## Overview

This ticket collects production-discovered staff app issues after the `/app/` deployment and Discord login validation. The first pass should separate data-model/API gaps from local UI defects, fix low-risk UI regressions quickly, and then address show editing fidelity in small validated increments.

## Structure

- `design/` — analysis and implementation plan.
- `reference/` — chronological diary.
- `scripts/` — local validation and browser-smoke scripts written for this ticket.
- `sources/` — command output, screenshots, and evidence.

## Tasks

See [tasks.md](./tasks.md).

## Changelog

See [changelog.md](./changelog.md).
