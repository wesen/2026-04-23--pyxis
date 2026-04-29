---
Title: Turn Pyxis into a deployed Glazed application on ArgoCD k3s
Ticket: PYXIS-PRODUCTION-ARGOCD-GLAZED
Status: active
Topics:
    - pyxis
    - glazed
    - production
    - release-readiness
    - backend
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: Makefile
      Note: Current local build/test/embed targets that should become CI packaging targets
    - Path: cmd/pyxis/cmds/serve.go
      Note: Glazed serve command defines production runtime flags and Discord bot options
    - Path: internal/web/static.go
      Note: Production public-site SPA fallback and reserved backend route behavior
    - Path: pkg/server/server.go
      Note: HTTP route map for health, public API, staff API, auth, flyers, and SPA fallback
ExternalSources:
    - /home/manuel/code/wesen/2026-03-27--hetzner-k3s/docs/app-packaging-and-gitops-pr-standard.md
    - /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/hair-booking/deployment.yaml
    - /home/manuel/code/wesen/corporate-headquarters/discord-bot/.github/workflows/push.yml
Summary: Documentation and implementation plan for packaging Pyxis as a production Glazed app and deploying it through the Hetzner k3s Argo CD GitOps repo.
LastUpdated: 2026-04-29T12:40:00-04:00
WhatFor: Guide the productionization of Pyxis.
WhenToUse: Use before implementing Docker, CI, GitOps, Vault, PostgreSQL bootstrap, and production smoke testing for Pyxis.
---


# Turn Pyxis into a deployed Glazed application on ArgoCD k3s

## Overview

<!-- Provide a brief overview of the ticket, its goals, and current status -->

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- deployment
- kubernetes
- argocd
- glazed
- cicd
- production
- pyxis

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
