---
Title: Build public site pages from component system
Ticket: PYXIS-PUBLIC-PAGES
Status: active
Topics:
    - frontend
    - react
    - storybook
    - visual-diff
    - pyxis
DocType: index
Intent: long-term
Owners: []
RelatedFiles:
    - Path: web/packages/pyxis-components/src/index.ts
      Note: Component-system barrel listing canonical atoms molecules organisms and public components
    - Path: web/packages/pyxis-user-site/src/pages/About.tsx
      Note: About page to rebuild from canonical about components
    - Path: web/packages/pyxis-user-site/src/pages/Archive.tsx
      Note: Archive page to rebuild from canonical archive components
    - Path: web/packages/pyxis-user-site/src/pages/Book.tsx
      Note: Booking page to rebuild from canonical booking components
    - Path: web/packages/pyxis-user-site/src/pages/ShowDetail.tsx
      Note: Show detail page to rebuild from canonical public components
    - Path: web/packages/pyxis-user-site/src/pages/Shows.tsx
      Note: Shows page to rebuild from canonical public components
    - Path: web/packages/pyxis-user-site/stories/PublicPages.stories.tsx
      Note: User-site Storybook page story harness on port 6007
ExternalSources: []
Summary: Build the full Pyxis public site pages in React by composing canonical pyxis-components public components, validating user-site Storybook stories on port 6007 against standalone prototype baselines with css-visual-diff.
LastUpdated: 2026-04-24T00:00:00Z
WhatFor: Track the page-level public site build after component CSS extraction, taxonomy ADRs, shared pyxis-types, and RTK Query migration.
WhenToUse: Use when modifying pyxis-user-site pages, PublicPages Storybook stories, page-level visual-diff configs, or page composition choices.
---


# Build public site pages from component system

## Overview

This ticket builds the complete Pyxis public site pages in `pyxis-user-site` using the canonical reusable components from `pyxis-components`.

The implementation loop should mirror the successful component visual parity workflow:

```text
inspect prototype baseline → compose React page from reusable components → render in user-site Storybook on :6007 → run css-visual-diff → tune/record/commit
```

The page baselines are the standalone public prototype files:

```text
prototype-design/standalone/public/shows.html
prototype-design/standalone/public/detail.html
prototype-design/standalone/public/archive.html
prototype-design/standalone/public/book.html
prototype-design/standalone/public/about.html
```

## Key documents

- [Public site page build analysis, design, and implementation guide](./design/01-public-site-page-build-analysis-design-implementation-guide.md)
- [Task plan](./tasks.md)
- [Implementation diary](./reference/01-diary.md)
- [Changelog](./changelog.md)

## Related prior decisions

- Prior ticket: `PYXIS-RTK-TYPES-MIGRATION`
- RTK Query and shared types are complete enough for page work.
- Public component CSS extraction/theming is complete enough for page work.
- Taxonomy ADR recommends canonical page components and marks some overlaps as deferred.

## Storybook target

User-site Storybook:

```text
http://localhost:6007
```

Important stories:

```text
public-site-pages--shows-desktop
public-site-pages--show-detail-desktop
public-site-pages--archive-desktop
public-site-pages--book-desktop
public-site-pages--about-desktop
```

## Status

Current status: **active**

Initial documentation and task plan are complete. Implementation work should start with Phase 0 baseline capture.
