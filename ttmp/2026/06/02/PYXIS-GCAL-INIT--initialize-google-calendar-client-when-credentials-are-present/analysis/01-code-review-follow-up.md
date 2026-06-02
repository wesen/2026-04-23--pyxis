---
Title: Code review follow-up
Ticket: PYXIS-GCAL-INIT
Status: active
Topics:
    - pyxis
    - gcal
    - code-review
DocType: analysis
Intent: long-term
Owners: []
RelatedFiles:
    - Path: pkg/gcal/client.go
      Note: Google Calendar client calendar ID and service account behavior
    - Path: pkg/server/public.go
      Note: External-events endpoint behavior depends on client/settings availability
    - Path: pkg/server/server.go
      Note: 'Google Calendar client startup gate flagged by PR #13 review'
    - Path: pkg/service/show_service.go
      Note: Operation-time Google Calendar sync settings checks
ExternalSources:
    - https://github.com/wesen/2026-04-23--pyxis/pull/13#discussion_r3342315548
    - https://github.com/wesen/2026-04-23--pyxis/issues/14
Summary: 'Follow-up ticket for PR #13 review comment about initializing the Google Calendar client before settings are enabled.'
LastUpdated: 2026-06-02T11:49:51.021968444-04:00
WhatFor: 'Use this note when resuming the deferred PR #13 Google Calendar startup follow-up.'
WhenToUse: When addressing review comment discussion_r3342315548 or changing Google Calendar client startup behavior.
---


# Code review follow-up

## Executive summary

This ticket captures a deferred PR #13 code review comment about Google Calendar client initialization. The current implementation can skip creating `s.gcalClient` at startup when service-account credentials are present but the stored settings do not yet have Google Calendar enabled and no external calendars are configured. If an admin later enables Google Calendar in the settings UI, sync paths still see `s.gcalClient == nil` until the process restarts.

## Source review comment

- PR: <https://github.com/wesen/2026-04-23--pyxis/pull/13>
- Discussion: <https://github.com/wesen/2026-04-23--pyxis/pull/13#discussion_r3342315548>
- GitHub issue: <https://github.com/wesen/2026-04-23--pyxis/issues/14>
- File: `pkg/server/server.go`
- Line at review time: 106
- Severity: P2

> **Initialize GCal client before settings are enabled**
>
> When the server starts with service-account credentials present but `google_cal_enabled` is still false and no external calendars are stored, this `gcalInUse` gate skips client creation entirely. If an admin later enables Google Calendar from the new settings UI, `s.gcalClient` remains nil, so automatic/manual show sync returns without doing anything and `/api/public/external-events` keeps returning an empty list until the process is restarted.

## Current-state hypothesis

The startup code in `pkg/server/server.go` currently ties client construction to a `gcalInUse` predicate. That predicate is useful for avoiding unnecessary setup, but it conflates two different concerns:

1. whether credentials are available and a client can be constructed, and
2. whether sync/external-event features should perform work right now.

The feature flag check should happen at operation time (`syncShowToGCal`, public external events, manual sync), while client construction should happen whenever credentials exist so later settings changes can take effect without a restart.

## Proposed fix direction

Likely implementation:

1. If credentials are present, construct `gcal.Client` at startup regardless of `google_cal_enabled` / external-calendar settings.
2. Continue reading the calendar ID from settings at operation time before create/update/delete calls.
3. Keep sync disabled when `settings.GoogleCalEnabled == false`.
4. Decide whether `/api/public/external-events` should require `GoogleCalEnabled` or only enabled external calendars; document the intended semantics.
5. Add a focused test or startup-level fake that verifies credentials + disabled DB settings still yields a non-nil `s.gcalClient` so later enablement can work.

## Acceptance criteria

- Starting with valid GCal credentials and disabled DB settings initializes `s.gcalClient`.
- Enabling Google Calendar in settings after startup allows manual/automatic sync without restart.
- Existing disabled-sync behavior is preserved: confirmed show writes do not publish while `google_cal_enabled=false`.
- External event endpoint behavior is explicit and tested/documented.
- CI remains green (`go test`, lint, gosec, govulncheck).

## Key files

- `pkg/server/server.go` — startup construction of `gcal.Client` and `externalEventsCache`.
- `pkg/service/show_service.go` — operation-time sync enablement and calendar ID selection.
- `pkg/gcal/client.go` — client calendar ID storage/update semantics.
- `pkg/server/public.go` — public external event endpoint behavior when client/settings are present.
