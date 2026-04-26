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
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/04-pyxis-components-storybook-ids-after-shows-detail.md
      Note: Captured story IDs after shows/detail cluster.
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/05-pyxis-components-storybook-ids-after-archive.md
      Note: Captured Storybook IDs after archive cluster move.
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/06-pyxis-components-storybook-ids-after-booking.md
      Note: Captured Storybook IDs after booking cluster move.
    - Path: ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/tasks.md
      Note: Phased checklist for public taxonomy and folder layout cleanup.
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters
      Note: Moved archive search/filter component into public molecules taxonomy.
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveShowList
      Note: Moved public archive list molecule in pilot batch.
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveShowRow
      Note: Moved public archive row molecule in pilot batch.
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveStats
      Note: Moved ArchiveStats into public molecules; props remain generated ArchiveStats protobuf type.
    - Path: web/packages/pyxis-components/src/public/molecules/LineupRow
      Note: Moved public lineup row molecule in pilot batch.
    - Path: web/packages/pyxis-components/src/public/molecules/Poster
      Note: Moved poster visual molecule.
    - Path: web/packages/pyxis-components/src/public/molecules/PubShowRow
      Note: Moved public show row molecule.
    - Path: web/packages/pyxis-components/src/public/molecules/ReserveTicketCard
      Note: Moved reserve CTA card molecule.
    - Path: web/packages/pyxis-components/src/public/molecules/ShowDetailHeader
      Note: Moved public show detail header molecule in pilot batch.
    - Path: web/packages/pyxis-components/src/public/molecules/ShowMetaStrip
      Note: Moved public show metadata strip molecule in pilot batch.
    - Path: web/packages/pyxis-components/src/public/molecules/ShowTile
      Note: Moved to public molecules; ShowTileShow now extends generated Show and preserves id.
    - Path: web/packages/pyxis-components/src/public/molecules/TicketStub
      Note: Moved show-backed ticket display molecule.
    - Path: web/packages/pyxis-components/src/public/molecules/YearGroup
      Note: Moved archive year grouping component into public molecules taxonomy.
    - Path: web/packages/pyxis-components/src/public/organisms/BookingForm
      Note: Moved booking form organism; still emits generated BookingFormData payloads.
    - Path: web/packages/pyxis-components/src/public/organisms/BookingRules
      Note: Moved booking rules organism.
    - Path: web/packages/pyxis-components/src/public/organisms/BookingSpaceAside
      Note: Moved booking space aside organism.
    - Path: web/packages/pyxis-components/src/public/organisms/BookingSuccess
      Note: Moved booking success organism.
    - Path: web/packages/pyxis-components/src/public/organisms/SaferSpaceAgreement
      Note: Moved safer-space agreement organism.
    - Path: web/packages/pyxis-components/src/public/organisms/ShowGrid
      Note: Moved to public organisms; click callback now receives ShowTileShow with show.id.
    - Path: web/packages/pyxis-user-site/src/pages/Shows.tsx
      Note: Uses ShowGrid callback show.id directly instead of artist/date matching.
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

## Step 3: Shows/Detail Cluster and Proto-Aligned Props

The user asked to continue through the shows/detail cluster and specifically asked whether props are being lined up with protobuf types. I treated this as a requirement to avoid display-only type drift where real public pages carry generated `Show` messages but components accept reduced hand-written objects.

### Prompt Context

**User prompt (verbatim):** "yeah go through shows/detail. Are you properly lining up props and proto types sand stuff?"

**Assistant interpretation:** Move the shows/detail public components into the taxonomy folders and use generated protobuf `Show`-backed props where the component represents actual show data.

**Commit:** Pending at time of diary entry.

### Components moved

Moved public show/detail molecules:

```text
web/packages/pyxis-components/src/public/molecules/ShowTile
web/packages/pyxis-components/src/public/molecules/TicketStub
web/packages/pyxis-components/src/public/molecules/ReserveTicketCard
web/packages/pyxis-components/src/public/molecules/Poster
web/packages/pyxis-components/src/public/molecules/PubShowRow
```

Moved public show/detail organism:

```text
web/packages/pyxis-components/src/public/organisms/ShowGrid
```

### Proto prop alignment

Before this pass, `ShowTile` and `ShowGrid` used a reduced hand-written `ShowTileShow` shape:

```ts
Pick<Show, 'artist' | 'date' | 'doorsTime' | 'price'> & { age: string; ... }
```

That shape dropped the proto `id`, which forced `Shows.tsx` to reconstruct identity by matching artist/date before navigating. This was fragile and contradicted the proto-everywhere migration direction.

I changed `ShowTileShow` to extend the generated protobuf `Show` type and only add UI hints:

```ts
export type ShowTileShow = Show & {
  title?: string;
  time?: string;
  kind?: ShowTileAction;
  poster?: PosterKind;
};
```

`ShowTile` now accepts `onClick?: (show: ShowTileShow) => void`, adds `data-show-id={show.id}`, and calls the callback with the full show object. `ShowGrid` passes that callback through and keys tiles by `show.id` when available.

Then `web/packages/pyxis-user-site/src/pages/Shows.tsx` became simpler and safer:

```tsx
<ShowGrid
  shows={shows}
  onShowClick={(show) => navigate(`/shows/${show.id}`)}
/>
```

### Story/mock alignment

Because `ShowTileShow` now extends the generated `Show` message type, story fixtures and `PublicDiffFixture` can no longer use plain objects. I updated those fixtures to use:

```ts
create(ShowSchema, { ... })
```

and then attach UI-only hints such as `kind` and `poster`. This matches the broader repo rule that mock data for protobuf types should be created via `create(Schema, ...)`, not plain objects.

Existing `TicketStub` and `PubShowRow` already accepted generated `Show`, and their stories already used `seedShows` from the protobuf-shaped mock handlers. After moving folders, I only needed to fix their relative `seedShows` imports from `../../mocks/handlers` to `../../../mocks/handlers`.

### Import/export updates

- Updated `web/packages/pyxis-components/src/index.ts` exports for moved molecules/organism.
- Updated `web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx` imports and tile fixtures.
- Updated moved component `pyxisPart` imports for the deeper folder paths.
- Updated moved Storybook titles:
  - `Public Site/Components/Molecules/ShowTile`
  - `Public Site/Components/Molecules/TicketStub`
  - `Public Site/Components/Molecules/ReserveTicketCard`
  - `Public Site/Components/Molecules/Poster`
  - `Public Site/Components/Molecules/PubShowRow`
  - `Public Site/Components/Organisms/ShowGrid`

### Story IDs captured

Added:

```text
sources/04-pyxis-components-storybook-ids-after-shows-detail.md
```

New story IDs include:

```text
public-site-components-molecules-showtile--default
public-site-components-molecules-ticketstub--default
public-site-components-molecules-reserveticketcard--default
public-site-components-molecules-poster--default
public-site-components-molecules-pubshowrow--default
public-site-components-organisms-showgrid--desktop
```

### Validation

Quiet validation passed:

```bash
cd web/packages/pyxis-components && pnpm build
cd web/packages/pyxis-user-site && pnpm build
cd web/packages/pyxis-components && pnpm build-storybook
cd web && pnpm build
```

Live browser validation hit the moved component stories in the running component Storybook. No story-level errors appeared; only harmless `favicon.ico` 404s. The public user-site page story still shows the existing React Router v7 future-flag warnings, unrelated to this refactor.

### What worked

- Stable package-barrel imports meant the user-site package needed only the `Shows.tsx` identity simplification, not widespread import changes.
- Aligning `ShowTileShow` with generated `Show` removed the previous artist/date matching workaround.
- The build caught plain-object story fixtures immediately, which confirmed the type boundary is now stricter and more proto-aligned.

### Caveats

- `Poster` is still a static design/demo molecule with variant names, not a proto-backed flyer. That is acceptable because it does not cross the API boundary and does not represent a backend payload.
- `ReserveTicketCard` remains primitive-prop-based (`price`, `note`, `cta`) because it is a CTA display card rather than a direct `Show` renderer. `ShowDetail.tsx` still passes show-derived values into it.
- Historical visual parity docs mention old `public-molecules-*` IDs. No active visual spec update was required in this pass.

## Step 4: Archive Cluster Move

I continued the taxonomy cleanup with the archive cluster. This cluster is intentionally smaller than the shows/detail pass because the most identity-sensitive archive components (`ArchiveShowRow` and `ArchiveShowList`) had already moved in the first molecule pilot.

### What changed

Moved these public archive molecules:

```text
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters
web/packages/pyxis-components/src/public/molecules/ArchiveStats
web/packages/pyxis-components/src/public/molecules/YearGroup
```

Updated:

- `web/packages/pyxis-components/src/index.ts` barrel exports.
- `web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx` imports.
- moved story titles to:
  - `Public Site/Components/Molecules/ArchiveSearchFilters`
  - `Public Site/Components/Molecules/ArchiveStats`
  - `Public Site/Components/Molecules/YearGroup`
- moved component `pyxisPart` imports for the deeper folder path.
- `ArchiveStats.stories.tsx` seed import from `../../../mocks/handlers` after the move.

### Proto/type alignment

- `ArchiveStats` already accepts the generated protobuf `ArchiveStats` type from `pyxis-types`, so it remained API-shape aligned.
- `ArchiveSearchFilters` remains primitive-prop-based (`value`, `yearOptions`, callbacks, result label) because it is a UI control, not an API payload renderer.
- `YearGroup` remains primitive/slot-based (`year`, `showCount`, `children`) because it is a layout/grouping molecule, not a backend message.
- The page `Archive.tsx` still owns RTK Query, search state, error states, and grouping. That is consistent with the decomposition runbook: pages own route/data state and pass typed props down.

### Evidence captured

Added:

```text
sources/05-pyxis-components-storybook-ids-after-archive.md
```

Story IDs after the move include:

```text
public-site-components-molecules-archivesearchfilters--default
public-site-components-molecules-archivestats--default
public-site-components-molecules-yeargroup--default
```

The search for old `public-molecules-*` archive IDs only found historical source snapshots from earlier evidence files in this ticket, not active visual-diff specs requiring updates.

### Validation

Quiet validation passed:

```bash
cd web/packages/pyxis-components && pnpm build
cd web/packages/pyxis-user-site && pnpm build
cd web/packages/pyxis-components && pnpm build-storybook
cd web && pnpm build
```

Live browser validation passed against:

```text
public-site-components-molecules-archivesearchfilters--default
public-site-components-molecules-archivestats--default
public-site-components-molecules-yeargroup--default
public-site-pages--archive-desktop
```

No story-level errors or warnings were observed after filtering harmless favicon and existing React Router future-flag warnings.

### What remains

- The archive component folder taxonomy is now mostly complete.
- The next logical batch is either the booking cluster (`BookingForm`, booking aside/rules/agreement/success) or about/venue/shell cluster (`PubNav`, `PubFooter`, `VenueCard`, etc.).

## Step 5: Booking Cluster Move

I continued with the booking cluster, moving the public booking workflow components into the public organism taxonomy. This fits the decomposition guide because these components represent substantial public page sections or workflow states rather than small show/archive rows.

### Components moved

Moved to `web/packages/pyxis-components/src/public/organisms/`:

```text
BookingForm
BookingRules
BookingSpaceAside
SaferSpaceAgreement
BookingSuccess
```

### Type/proto alignment

- `BookingForm` already uses generated protobuf data correctly: it imports `BookingFormData` and creates submission payloads with `create(BookingFormDataSchema, ...)` before calling `onSubmit`.
- `Book.tsx` remains the page/container that owns the `useSubmitBooking()` RTK mutation and passes `BookingFormData` into the API layer.
- `BookingRules`, `BookingSpaceAside`, and `SaferSpaceAgreement` remain primitive/static presentation organisms because they do not represent backend messages.
- `BookingSuccess` remains a route-state/display organism with primitive props (`artistName`, `onSubmitAnother`), not a backend response renderer.
- I added missing public barrel type exports for `BookingSpaceAsideProps` and `SaferSpaceAgreementProps` while moving their folders.

### Import/export updates

- Updated `web/packages/pyxis-components/src/index.ts` exports to the new organism paths.
- Updated `web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx` imports.
- Fixed moved `pyxisPart` imports from `../../utils/parts` to `../../../utils/parts`.
- Fixed `BookingSuccess`'s `Button` import from `../../atoms/Button` to `../../../atoms/Button`.
- Updated Storybook titles to `Public Site/Components/Organisms/*`.

### Evidence captured

Added:

```text
sources/06-pyxis-components-storybook-ids-after-booking.md
```

New story IDs include:

```text
public-site-components-organisms-bookingform--default
public-site-components-organisms-bookingrules--default
public-site-components-organisms-bookingspaceaside--default
public-site-components-organisms-saferspaceagreement--default
public-site-components-organisms-bookingsuccess--default
```

Old booking story ID references were found only in prior ticket evidence/historical visual parity diary entries, not active specs.

### Validation

Quiet validation passed:

```bash
cd web/packages/pyxis-components && pnpm build
cd web/packages/pyxis-user-site && pnpm build
cd web/packages/pyxis-components && pnpm build-storybook
cd web/packages/pyxis-user-site && pnpm build-storybook
cd web && pnpm build
```

Live Storybook browser validation passed for:

```text
public-site-components-organisms-bookingform--default
public-site-components-organisms-bookingrules--default
public-site-components-organisms-bookingspaceaside--default
public-site-components-organisms-saferspaceagreement--default
public-site-components-organisms-bookingsuccess--default
public-site-pages--book-desktop
public-site-pages--book-success-desktop
```

No story-level errors or warnings were observed after filtering harmless favicon and existing React Router future-flag warnings.

### What remains

The next obvious cluster is about/venue/shell: `PubNav`, `PubFooter`, `AboutHero`, `AboutIntro`, `EthosStrip`, `EthosGrid`, `CollectiveList`, `FindUsBlock`, `VenueCard`, `SpaceInfo`, `MailingListCTA`, and possibly `PubHero` / `PublicPageHeader` classification cleanup.
