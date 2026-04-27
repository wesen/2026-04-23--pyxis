---
Title: Implement Pyxis staff authentication with Keycloak OIDC
Ticket: PYXIS-AUTH-KEYCLOAK
Status: archived
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
Summary: Dedicated implementation ticket for replacing or supplementing Pyxis staff auth with backend-owned Keycloak OIDC, using hair-booking as the reference implementation.
LastUpdated: 2026-04-27T19:37:06.694816634-04:00
WhatFor: Use this ticket when implementing local Keycloak fixtures, OIDC callback/session handling, staff role mapping, and hosted Keycloak Terraform resources for Pyxis.
WhenToUse: Use before changing Pyxis auth code or exposing staff routes in production.
---



# Implement Pyxis staff authentication with Keycloak OIDC

## Overview

This ticket owns the Pyxis Keycloak/OIDC implementation track. It copies the production-readiness Keycloak guide into a dedicated implementation document, then breaks the work into local fixture, backend OIDC, session/role mapping, tests, hosted Terraform, and deployment-doc phases.

The guiding precedent is `/home/manuel/code/wesen/hair-booking`: backend-owned OIDC login, server-side ID-token verification, HTTP-only app session cookies, local Keycloak Docker Compose, and hosted client provisioning in the central Terraform repo.

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
