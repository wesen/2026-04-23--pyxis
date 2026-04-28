---
Title: Replace make dev with devctl orchestration and profiles
Ticket: PYXIS-DEVCTL-SETUP
Status: active
Topics:
    - pyxis
    - devctl
    - dev-environment
    - makefile
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ../../../../../../corporate-headquarters/devctl/pkg/config/config.go
      Note: devctl config parsing
    - Path: ../../../../../../corporate-headquarters/devctl/pkg/discovery/discovery.go
      Note: devctl plugin discovery
    - Path: ../../../../../../corporate-headquarters/devctl/pkg/engine/pipeline.go
      Note: devctl pipeline orchestration
    - Path: ../../../../../../corporate-headquarters/devctl/pkg/protocol/types.go
      Note: devctl NDJSON protocol
    - Path: ../../../../../../corporate-headquarters/devctl/pkg/state/state.go
      Note: devctl state management
    - Path: ../../../../../../corporate-headquarters/devctl/pkg/supervise/supervisor.go
      Note: devctl process supervision
    - Path: .devctl.yaml
      Note: devctl configuration file
    - Path: .gitignore
      Note: .devctl/ ignored
    - Path: Makefile
      Note: legacy dev targets removed
    - Path: cmd/pyxis/main.go
      Note: CLI help system integration
    - Path: devctl-plugin.py
      Note: devctl plugin with profile support
    - Path: pkg/doc/devctl-setup.md
      Note: Glazed help entry for devctl setup
    - Path: pkg/doc/doc.go
      Note: embedded docs wiring
    - Path: web/README.md
      Note: updated with devctl reference
ExternalSources: []
Summary: ""
LastUpdated: 2026-04-28T07:05:51.693656651-04:00
WhatFor: ""
WhenToUse: ""
---




# Replace make dev with devctl orchestration and profiles

## Overview

<!-- Provide a brief overview of the ticket, its goals, and current status -->

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- pyxis
- devctl
- dev-environment
- makefile

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
