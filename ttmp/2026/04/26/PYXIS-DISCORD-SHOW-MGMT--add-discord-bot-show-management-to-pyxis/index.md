---
Title: Add Discord bot show management to Pyxis
Ticket: PYXIS-DISCORD-SHOW-MGMT
Status: active
Topics:
    - pyxis
    - discord-bot
    - show-management
    - goja
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/design-doc/01-discord-bot-show-management-design-and-implementation-guide.md: Primary handoff guide for implementation.
    - /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/reference/01-investigation-diary.md: Chronological diary of investigation and documentation work.
    - /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/sources/01-evidence-line-references.md: Generated evidence bundle with source line references.
ExternalSources: []
Summary: "Ticket for adding a Pyxis Discord bot that manages show announcements, pins, cancellations, and archives by porting the corporate show-space bot."
LastUpdated: 2026-04-26T23:55:00-04:00
WhatFor: "Track design and implementation of Discord bot show management in Pyxis."
WhenToUse: "Use when implementing or reviewing the Discord bot integration."
---

# Add Discord bot show management to Pyxis

## Overview

This ticket covers adding Discord bot functionality to Pyxis for show management. The intended approach is to reuse `../corporate-headquarters/discord-bot`, which uses `../corporate-headquarters/go-go-goja`, and port the existing `examples/discord-bots/show-space` bot into Pyxis.

The primary design recommends embedding one built-in bot through `discord-bot/pkg/framework`, injecting a Pyxis-native Goja module (`require("pyxis")`), and replacing the current show-space SQLite store with Pyxis PostgreSQL-backed services.

## Key Links

- [Design guide](./design-doc/01-discord-bot-show-management-design-and-implementation-guide.md)
- [Investigation diary](./reference/01-investigation-diary.md)
- [Evidence bundle](./sources/01-evidence-line-references.md)
- [Evidence collection script](./scripts/01-collect-discord-show-management-evidence.sh)

## Status

Current status: **active**. Design and research are complete; implementation tasks remain open.

## Topics

- pyxis
- discord-bot
- show-management
- goja

## Tasks

See [tasks.md](./tasks.md) for the current task list.

## Changelog

See [changelog.md](./changelog.md) for recent changes and decisions.

## Structure

- design-doc/ - Architecture and design documents
- reference/ - Prompt packs, API contracts, context summaries, diary
- playbooks/ - Command sequences and test procedures
- scripts/ - Temporary code and tooling
- sources/ - Generated evidence and source excerpts
- various/ - Working notes and research
- archive/ - Deprecated or reference-only artifacts
