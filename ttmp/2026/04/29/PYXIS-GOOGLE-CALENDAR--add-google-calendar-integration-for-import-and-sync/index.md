---
Title: Add Google Calendar Integration for Import and Sync
Ticket: PYXIS-GOOGLE-CALENDAR
Status: active
Topics:
    - google-calendar
    - frontend
    - public-site
    - backend
    - api-design
    - go
    - integration
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: pkg/config/config.go
      Note: Config struct needs Google Calendar fields
    - Path: pkg/domain/calendar.go
      Note: Existing calendar domain (holds/blocked) — new GCal is separate concern
    - Path: pkg/domain/settings.go
      Note: Settings needs Google Calendar config fields
    - Path: pkg/domain/show.go
      Note: Show needs GoogleCalEventID and GoogleCalSyncedAt fields
    - Path: pkg/server/server.go
      Note: HTTP router where new external-events route will be registered
    - Path: pkg/service/show_service.go
      Note: Sync hooks for Google Calendar after Create/Update/Cancel
    - Path: web/packages/pyxis-user-site/src/pages/ShowsPage/Page.tsx
      Note: External events section will be added here
ExternalSources: []
Summary: 'Add bidirectional Google Calendar integration: push confirmed shows to a venue Google Calendar via service account, and import/display events from multiple external Google Calendars on the public website.'
LastUpdated: 2026-04-29T15:21:38.192292885-04:00
WhatFor: ""
WhenToUse: ""
---


# Add Google Calendar Integration for Import and Sync

## Overview

Bidirectional Google Calendar integration:

1. **Push (Export):** When shows are created/updated/cancelled in Pyxis, automatically sync them to a Google Calendar via the Google Calendar API v3 using a service account. Stores event IDs for later updates.

2. **Pull (Import):** Configure multiple external Google Calendar IDs. Fetch and display their events on the public website alongside Pyxis shows, with visual distinction.

**Design doc:** [design/01-google-calendar-integration-guide.md](./design/01-google-calendar-integration-guide.md) — 80KB, 2048 lines, 17 sections.

**Research sources:** `sources/` directory contains downloaded Google Calendar API documentation.

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- google-calendar
- frontend
- public-site
- backend
- api-design
- go
- integration

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
