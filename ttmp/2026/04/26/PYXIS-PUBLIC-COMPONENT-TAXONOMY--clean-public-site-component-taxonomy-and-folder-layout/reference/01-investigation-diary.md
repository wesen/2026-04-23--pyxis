---
Title: Investigation Diary
Ticket: PYXIS-PUBLIC-COMPONENT-TAXONOMY
Status: active
Topics:
    - frontend
    - storybook
    - design-system
    - public-site
    - react
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: docs/component-system-and-public-site-components.md
      Note: Public-site component taxonomy reference.
    - Path: docs/playbooks/06-react-widget-folder-storybook-css-organization.md
      Note: Widget folder, CSS ownership, colocated story, and Storybook title hierarchy playbook.
    - Path: docs/playbooks/07-react-application-decomposition-and-component-reuse.md
      Note: React decomposition and component-system reuse playbook.
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/scripts/audit-public-component-taxonomy.mjs
      Note: |-
        Initial audit script for classifying current public-domain components.
        Initial public component taxonomy audit script.
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/tasks.md
      Note: Phased checklist for public taxonomy and folder layout cleanup.
ExternalSources: []
Summary: Chronological diary for the public site component taxonomy and folder layout cleanup ticket.
LastUpdated: 2026-04-26T14:45:00-04:00
WhatFor: Use this diary to understand why this ticket exists, what guidance was found, and how the public-site component taxonomy cleanup should proceed.
WhenToUse: When continuing the public-site component decomposition work or reviewing Storybook taxonomy decisions.
---


# Diary

## Goal

Create a separate docmgr ticket to clean up the Pyxis public-site component taxonomy, folder layout, and Storybook organization so future decomposition work follows the same discipline as the staff app component system.

## Step 1: Ticket Creation, Playbook Discovery, and Initial Taxonomy Guide

The user confirmed that public-site component decomposition should be a separate ticket. I created `PYXIS-PUBLIC-COMPONENT-TAXONOMY`, located the existing playbooks that govern folder/story/CSS organization and decomposition, inspected current public component and route-page layouts, wrote a design guide, wrote a phased task checklist, and added a small audit script.

### Prompt Context

**User prompt (verbatim):** "yes, create a separate ticket to hav ea clean taxonomy and also folder / file layout to match the component system and ecomposition"

**Assistant interpretation:** Create a docmgr ticket for public-site taxonomy and decomposition cleanup, not as part of the RTK/MSW wiring ticket. The deliverable should explain the target component hierarchy and how files/stories/CSS should be organized.

**Inferred user intent:** Avoid future confusion caused by flat public component folders and duplicate/broken page stories; create a clear plan before moving many files.

**Commit:** Pending at time of diary entry.

### What I did

- Created ticket `PYXIS-PUBLIC-COMPONENT-TAXONOMY`.
- Created design document:
  - `design-doc/01-public-site-component-taxonomy-and-folder-layout-refactor-guide.md`
- Created diary:
  - `reference/01-investigation-diary.md`
- Replaced default `tasks.md` with a phased implementation checklist.
- Added script:
  - `scripts/audit-public-component-taxonomy.mjs`
- Inspected current public component tree:
  - `web/packages/pyxis-components/src/public/*`
- Inspected route app structure:
  - `web/packages/pyxis-user-site/src/pages/*`
  - `web/packages/pyxis-user-site/stories/PublicPages.stories.tsx`
- Located existing source playbooks:
  - `docs/playbooks/06-react-widget-folder-storybook-css-organization.md`
  - `docs/playbooks/07-react-application-decomposition-and-component-reuse.md`
  - `docs/component-system-and-public-site-components.md`
  - `ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md`
  - `ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/04-public-site-component-parity-handoff.md`

### Why

The previous RTK/MSW ticket cleaned up the public user-site page stories so only the canonical `Public Site/Pages` route harness remains. That removed immediate confusion, but it did not solve the deeper organization problem: public-domain components are still flat under `src/public`, and pages can still accumulate section/component markup over time.

A dedicated taxonomy ticket keeps the refactor focused on ownership and structure rather than mixing it with API wiring.

### What I learned

- The repo already has strong guidance; this ticket should apply it rather than inventing a new taxonomy.
- `pyxis-components/src/public` already follows the widget-folder pattern at the leaf level, but lacks grouping by public atom/molecule/organism/section.
- `pyxis-user-site` route pages should remain application containers because they own routing, navigation, RTK Query hooks, and loading/error/empty states.
- Public component stories should be colocated with public-domain components in `pyxis-components`, while public page route stories should stay in the single `PublicPages.stories.tsx` harness.

### What worked

- The current public components already mostly have `Component.tsx`, `Component.css`, `Component.stories.tsx`, and `index.ts`.
- The current route page harness already provides a good page-level Storybook entrypoint.
- The audit script can produce a quick Markdown inventory table to seed manual classification.

### What didn't work / caveats

- The audit script uses name heuristics only; it is intentionally a starting point, not an authoritative classifier.
- Some public components have ambiguous composition level:
  - `VenueCard`
  - `YearGroup`
  - `Poster`
  - `EthosStrip`
  - `SafetyNote`
- Storybook IDs will change if stories move and titles are updated, so active visual-diff specs must be searched and updated in the same move commits.

### Initial taxonomy recommendation

Use two axes:

```text
Axis 1: generic vs public-domain
Axis 2: atom / molecule / organism / page
```

Keep generic primitives in:

```text
src/atoms
src/molecules
src/organisms
```

Move public-domain widgets toward:

```text
src/public/atoms
src/public/molecules
src/public/organisms
src/public/fixtures
```

Keep route pages in:

```text
web/packages/pyxis-user-site/src/pages
```

### Commands run

```bash
docmgr ticket create-ticket --ticket PYXIS-PUBLIC-COMPONENT-TAXONOMY --title "Clean Public Site Component Taxonomy and Folder Layout" --topics frontend,storybook,design-system,public-site,react
docmgr doc add --ticket PYXIS-PUBLIC-COMPONENT-TAXONOMY --doc-type design-doc --title "Public Site Component Taxonomy and Folder Layout Refactor Guide"
docmgr doc add --ticket PYXIS-PUBLIC-COMPONENT-TAXONOMY --doc-type reference --title "Investigation Diary"
find web/packages/pyxis-components/src -maxdepth 3 -type f | sort
find web/packages/pyxis-user-site/src -maxdepth 3 -type f | sort
node ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/scripts/audit-public-component-taxonomy.mjs
```

### Suggested next implementation step

Before moving files, run the audit script and save full output:

```bash
node ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/scripts/audit-public-component-taxonomy.mjs \
  > ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/public-component-taxonomy-audit.md
```

Then manually review the ambiguous components and move a small molecule pilot batch first.
