---
Title: Archive redesign investigation diary
Ticket: PYXIS-ARCHIVE-VISUAL-REDESIGN
Status: active
Topics:
  - frontend
  - storybook
  - design-system
  - public-site
DocType: reference
Intent: short-term
Owners: []
RelatedFiles:
  - web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
  - web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
  - web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
Summary: "Chronological notes for the public show archive visual redesign planning work."
LastUpdated: 2026-04-29T12:40:00-04:00
---

# Archive redesign investigation diary

## Step 1: Created focused ticket

Created docmgr ticket:

```text
PYXIS-ARCHIVE-VISUAL-REDESIGN
```

Goal: analyze and plan a redesign of the public show archive page because its current vertical stack of utility controls and lists feels too form-like and does not match the stronger editorial/conceptual approach used elsewhere in the public site.

## Step 2: Inspected current archive page and component system

Read:

```text
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.css
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.css
web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.css
web/packages/pyxis-components/src/public/molecules/ArchiveShowList/ArchiveShowList.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveShowRow/ArchiveShowRow.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveShowRow/ArchiveShowRow.css
web/packages/pyxis-components/src/public/molecules/YearGroup/YearGroup.tsx
web/packages/pyxis-components/src/public/molecules/YearGroup/YearGroup.css
```

Finding: the existing components are mostly good reusable pieces. The problem is not a broken component; it is the absence of an organism-level composition that makes the archive feel like a public archive instead of controls stacked above rows.

## Step 3: Inspected public API path

Read:

```text
web/packages/pyxis-user-site/src/api/endpoints.ts
web/packages/pyxis-user-site/src/api/hooks.ts
web/packages/pyxis-user-site/src/api/publicApi.ts
pkg/server/public.go
```

Finding: the first redesign slice does not need backend changes. Existing endpoints are sufficient:

```text
GET /api/public/archive?search=<query>
GET /api/public/archive/stats
```

## Step 4: Wrote implementation guide

Created:

```text
design-doc/01-show-archive-page-visual-redesign-implementation-guide.md
```

The guide proposes:

- `ArchiveExplorer` organism;
- `ArchiveCommandBar` molecule;
- reuse of `PublicPageHeader`, `ArchiveStats`, `YearGroup`, `ArchiveShowList`, and `ArchiveShowRow`;
- Storybook-first implementation;
- visual-diff follow-up targets;
- token-backed CSS using `pyxisPart()` selectors;
- an intern checklist and acceptance criteria.

## Step 5: Uploaded to reMarkable

Uploaded the design guide bundle to the ticket folder on reMarkable after a dry run.
