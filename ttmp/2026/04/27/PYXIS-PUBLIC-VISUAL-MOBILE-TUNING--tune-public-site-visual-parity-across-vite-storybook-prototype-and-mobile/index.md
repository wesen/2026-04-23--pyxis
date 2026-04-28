---
Title: Tune public site visual parity across Vite, Storybook, prototype, and mobile
Ticket: PYXIS-PUBLIC-VISUAL-MOBILE-TUNING
Status: active
Topics:
    - frontend
    - storybook
    - public-site
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: Makefile
      Note: Development server orchestration for backend
    - Path: docs/playbooks/10-css-visual-diff-verb-operator-guide.md
      Note: Recovered focused visual-diff operator loop and artifact inspection order
    - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
      Note: Current canonical desktop prototype-vs-Storybook public page spec
    - Path: prototype-design/visual-diff/userland/verbs/pyxis-pages.js
      Note: Existing Pyxis css-visual-diff verbs and aliases to extend for Vite/mobile comparisons
    - Path: web/packages/pyxis-components/src/public/organisms/MailingListCTA/MailingListCTA.css
      Note: Stay in the loop/email form CSS under visual review
    - Path: web/packages/pyxis-user-site/src/components/layout/Layout.tsx
      Note: Public SPA shell and nav wiring under investigation
ExternalSources: []
Summary: Track public-site visual tuning across live Vite, Storybook, standalone prototype, desktop, and mobile.
LastUpdated: 2026-04-27T20:30:50.650291697-04:00
WhatFor: Use this ticket to coordinate CSS/visual adjustments for pyxis-user-site when comparing localhost:3007, Storybook, and standalone prototype renderings.
WhenToUse: Use before changing public-site CSS or visual fixtures, especially for mobile or Vite-vs-Storybook mismatches.
---


# Tune public site visual parity across Vite, Storybook, prototype, and mobile

## Overview

This ticket tracks the next public-site visual tuning pass. It focuses on proving whether the live Vite app, Storybook page stories, and standalone prototype are rendering the same intended page, then tuning CSS and fixtures across desktop and mobile with css-visual-diff evidence.

## Key Links

- **Related Files**: See frontmatter RelatedFiles field
- **External Sources**: See frontmatter ExternalSources field

## Status

Current status: **active**

## Topics

- frontend
- visual-regression
- css
- storybook
- mobile
- public-site

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
