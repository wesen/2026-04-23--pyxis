---
Title: Add Mailchimp Mailing List Signup to Public Website
Ticket: PYXIS-MAILCHIMP-MAILING-LIST
Status: active
Topics:
    - mailchimp
    - frontend
    - public-site
    - backend
    - api-design
    - go
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: pkg/config/config.go
      Note: Config struct needs MailchimpEnabled
    - Path: pkg/server/public.go
      Note: Public API handlers where handleSubscribe will be added
    - Path: pkg/server/server.go
      Note: HTTP router where the new POST /api/public/subscribe route will be registered
    - Path: web/packages/pyxis-components/src/index.ts
      Note: New MailingListSignup component export
    - Path: web/packages/pyxis-user-site/src/pages/AboutPage/Page.tsx
      Note: MailingListSignup component will be added here
ExternalSources: []
Summary: Add a mailing list signup form to the Pyxis public website that forwards subscriber emails to the venue's existing Mailchimp audience via the server-side Marketing API. Includes a new Go backend endpoint, React component, configuration, and tests.
LastUpdated: 2026-04-29T15:05:12.706354496-04:00
WhatFor: ""
WhenToUse: ""
---


# Add Mailchimp Mailing List Signup to Public Website

## Overview

Add a "Join our mailing list" form to the Pyxis public website. Visitors enter their email, which is forwarded to Mailchimp via the server-side API (not a client-side embedded widget). The feature includes a new Go Mailchimp client package, a public `/api/public/subscribe` endpoint, a reusable React `MailingListSignup` component, and environment-based configuration.

**Design doc:** [design/01-mailchimp-integration-guide.md](./design/01-mailchimp-integration-guide.md) — 65KB, 15 sections, written for a new intern.

**Research sources:** `sources/` directory contains downloaded Mailchimp documentation.

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- mailchimp
- frontend
- public-site
- backend
- api-design
- go

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
