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
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/01-public-component-taxonomy-audit.md
      Note: Saved initial taxonomy audit output.
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/02-pyxis-components-storybook-ids-after-pilot.md
      Note: Saved component Storybook IDs after molecule pilot.
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/03-pyxis-user-site-storybook-page-ids-after-cleanup.md
      Note: Saved public user-site page story IDs after cleanup.
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/tasks.md
      Note: Phased checklist for public taxonomy and folder layout cleanup.
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveShowList
      Note: Moved public archive list molecule in pilot batch.
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveShowRow
      Note: Moved public archive row molecule in pilot batch.
    - Path: web/packages/pyxis-components/src/public/molecules/LineupRow
      Note: Moved public lineup row molecule in pilot batch.
    - Path: web/packages/pyxis-components/src/public/molecules/ShowDetailHeader
      Note: Moved public show detail header molecule in pilot batch.
    - Path: web/packages/pyxis-components/src/public/molecules/ShowMetaStrip
      Note: Moved public show metadata strip molecule in pilot batch.
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
  > ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/01-public-component-taxonomy-audit.md
```

Then manually review the ambiguous components and move a small molecule pilot batch first.

## Step 2: Upload and Public Molecule Pilot Move

The user asked to upload the taxonomy guide to reMarkable and then work through the first pilot move. I uploaded the guide bundle, started live Storybook in tmux so the user can follow along, moved the first five public-domain molecule folders, updated imports/exports/story titles, and validated both package builds and Storybook.

### Prompt Context

**User prompt (verbatim):** "upload to remarkable. then add tasks, and work through that first pilot move"

**Follow-up prompt:** "are you running the 6007 storybook again? run in a tmux so I can follow your work."

**Follow-up prompt:** "alright, go do it"

**Assistant interpretation:** Publish the taxonomy ticket bundle, keep a visible Storybook process running in tmux, and implement the low-risk public molecule move defined in the ticket.

**Commit:** Pending at time of diary entry.

### reMarkable upload

Uploaded:

```text
/ai/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY/PYXIS-PUBLIC-COMPONENT-TAXONOMY Implementation Guide
```

Verified with:

```bash
remarquee cloud ls /ai/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY --long --non-interactive
```

### tmux Storybook sessions

Started user-site Storybook for the user to follow route-page work:

```bash
tmux attach -t pyxis-user-site-storybook
# http://localhost:6007/
```

Started component Storybook for the pilot molecule validation:

```bash
tmux attach -t pyxis-components-storybook
# http://localhost:6006/
```

Both have the usual non-blocking Storybook 8 package-version warnings and `--host 0.0.0.0` allowed-hosts warning.

### Components moved

Moved from the flat public folder:

```text
web/packages/pyxis-components/src/public/LineupRow
web/packages/pyxis-components/src/public/ShowMetaStrip
web/packages/pyxis-components/src/public/ShowDetailHeader
web/packages/pyxis-components/src/public/ArchiveShowRow
web/packages/pyxis-components/src/public/ArchiveShowList
```

Moved to:

```text
web/packages/pyxis-components/src/public/molecules/LineupRow
web/packages/pyxis-components/src/public/molecules/ShowMetaStrip
web/packages/pyxis-components/src/public/molecules/ShowDetailHeader
web/packages/pyxis-components/src/public/molecules/ArchiveShowRow
web/packages/pyxis-components/src/public/molecules/ArchiveShowList
```

### Import/export updates

- Updated relative `pyxisPart` imports from `../../utils/parts` to `../../../utils/parts` in moved components.
- Updated `ArchiveShowList` sibling import to keep using `../ArchiveShowRow` inside `public/molecules`.
- Updated `web/packages/pyxis-components/src/index.ts` barrel exports to the new paths.
- Updated `web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx` imports to the new `./molecules/...` paths.

### Storybook title updates

Updated moved stories to the new hierarchy:

```text
Public Site/Components/Molecules/LineupRow
Public Site/Components/Molecules/ShowMetaStrip
Public Site/Components/Molecules/ShowDetailHeader
Public Site/Components/Molecules/ArchiveShowRow
Public Site/Components/Molecules/ArchiveShowList
```

Resulting story IDs include:

```text
public-site-components-molecules-lineuprow--default
public-site-components-molecules-showmetastrip--default
public-site-components-molecules-showdetailheader--default
public-site-components-molecules-archiveshowrow--default
public-site-components-molecules-archiveshowlist--default
```

### Sources captured

Saved audit and Storybook ID references under `sources/`:

```text
sources/01-public-component-taxonomy-audit.md
sources/02-pyxis-components-storybook-ids-after-pilot.md
sources/03-pyxis-user-site-storybook-page-ids-after-cleanup.md
```

### Visual-diff/spec reference check

Searched for active references to the moved public story IDs. The only matches found were historical ticket references to `public-molecules-lineup-row-default` in the 2026-04-24 visual parity handoff/diary. No active spec file update was required in this pass.

Command shape:

```bash
rg "public-molecules-(lineup-row|show-meta-strip|show-detail-header|archive-show-row|archive-show-list)|public-organisms-archive-show-list" prototype-design docs ttmp web -n
```

### Validation

Quiet validation commands passed:

```bash
cd web/packages/pyxis-user-site && pnpm build-storybook
cd web/packages/pyxis-components && pnpm build
cd web/packages/pyxis-components && pnpm build-storybook
cd web && pnpm build
```

I redirected noisy Vite/Storybook build output to `/tmp/...` logs for the final validation pass to avoid printing every emitted asset size.

Live browser validation against component Storybook on `localhost:6006` loaded these moved stories without console errors or warnings, excluding the harmless missing favicon request:

```text
public-site-components-molecules-lineuprow--default
public-site-components-molecules-showmetastrip--default
public-site-components-molecules-showdetailheader--default
public-site-components-molecules-archiveshowrow--default
public-site-components-molecules-archiveshowlist--default
```

### What worked

- The pilot move proved the mechanical workflow: `git mv`, fix relative imports, update barrel exports, update fixture imports, update story titles, validate builds, and inspect Storybook IDs.
- Public page package builds still pass because consumers import through the stable `pyxis-components` barrel.
- Component Storybook now exposes the moved components under the intended `Public Site/Components/Molecules/*` hierarchy.

### What was tricky

- `PublicDiffFixture.stories.tsx` had direct relative imports from `./LineupRow`, `./ShowDetailHeader`, etc.; these needed manual updates because they are internal story-only imports, not package-barrel imports.
- Changing Storybook titles changes story IDs. I captured the new IDs and searched references before committing.

### Next recommended batch

Do not jump to all components at once. Either:

1. finish the archive cluster by classifying/moving `ArchiveSearchFilters`, `ArchiveStats`, and `YearGroup`, or
2. start the shows/detail cluster with `ShowTile`, `TicketStub`, `ReserveTicketCard`, and later `ShowGrid`.

The next batch should also create `src/public/organisms/` only when the first actual organism moves.
