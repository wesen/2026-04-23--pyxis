---
Title: Redesign show archive page visual hierarchy and filtering UX
Ticket: PYXIS-ARCHIVE-VISUAL-REDESIGN
Status: active
Topics:
    - frontend
    - public-site
    - storybook
    - design-system
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
      Note: Existing archive controls to wrap or refactor into a command bar
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveShowRow/ArchiveShowRow.tsx
      Note: Existing row/link component to preserve while tuning layout
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.tsx
      Note: Existing archive metrics component to reuse in masthead
    - Path: web/packages/pyxis-components/src/public/molecules/YearGroup/YearGroup.tsx
      Note: Existing year heading component to reuse as archive timeline chapters
    - Path: web/packages/pyxis-user-site/src/pages/ArchivePage/Page.css
      Note: Current archive page CSS to simplify after moving layout into reusable components
    - Path: web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
      Note: Public archive page Storybook entry to expand
    - Path: web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
      Note: Public archive page view and route-level composition for the redesign
ExternalSources: []
Summary: Planning ticket for redesigning the public archive page from a stacked form/list layout into a stronger archive explorer composition.
LastUpdated: 2026-04-29T12:40:00-04:00
WhatFor: Use this ticket to implement and validate the public show archive visual redesign.
WhenToUse: Use when changing /archive, archive shared components, archive Storybook stories, or archive visual-diff targets.
---


# Redesign show archive page visual hierarchy and filtering UX

## Overview

This ticket captures the analysis and implementation plan for improving the public show archive page. The current page works, but its vertical sequence of header, metrics, search input, year buttons, and year lists feels like multiple forms stacked under one another. The desired direction is a more coherent archive experience: masthead, integrated metrics, a single archive command bar, and year-based timeline/list chapters.

## Primary deliverable

- [Show archive page visual redesign implementation guide](./design-doc/01-show-archive-page-visual-redesign-implementation-guide.md)

## Diary

- [Archive redesign investigation diary](./reference/01-archive-redesign-diary.md)

## Status

Current status: **active**. The design/implementation guide is written and uploaded. Implementation remains open.

## Tasks

See [tasks.md](./tasks.md) for the current task list.

## Changelog

See [changelog.md](./changelog.md) for recent changes and decisions.

## Structure

- design-doc/ - Architecture and design documents
- reference/ - Diary and context notes
- playbooks/ - Command sequences and test procedures
- scripts/ - Temporary code and tooling
- sources/ - Evidence and generated artifacts
- various/ - Working notes and research
- archive/ - Deprecated or reference-only artifacts
