---
Title: Complete Pyxis staff authentication with Discord OAuth
Ticket: PYXIS-AUTH-DISCORD-OAUTH
Status: active
Topics:
    - backend
    - auth
    - production
    - release-readiness
DocType: index
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: "Dedicated implementation ticket for completing production-ready Discord OAuth staff login in Pyxis."
LastUpdated: 2026-04-27T20:45:00-04:00
WhatFor: "Use this ticket to understand and implement Pyxis Discord OAuth login, session cookies, role mapping, staff frontend auth bootstrap, and production deployment setup."
WhenToUse: "Use before changing pkg/service/auth_service.go, pkg/server/auth.go, staff login UI, or production auth configuration."
---

# Complete Pyxis staff authentication with Discord OAuth

## Overview

This ticket owns the Discord OAuth staff-authentication track for Pyxis. Pyxis already has the core callback/session skeleton, but it needs production completion: a login route, OAuth state validation, config/env wiring, secure cookie behavior, explicit role policy, frontend login/logout integration, tests, and deployment documentation.

The implementation guide in `design/` is written for a new intern and explains the system in prose, diagrams, API references, pseudocode, and file references.

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- backend
- auth
- production
- release-readiness

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
