---
Title: Public Site Component Taxonomy and Folder Layout Refactor Guide
Ticket: PYXIS-PUBLIC-COMPONENT-TAXONOMY
Status: active
Topics:
    - frontend
    - storybook
    - design-system
    - public-site
    - react
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: docs/component-system-and-public-site-components.md
      Note: |-
        Public-site domain component taxonomy and distinction from generic design-system components.
        Reference for generic vs public-site component taxonomy.
    - Path: docs/playbooks/06-react-widget-folder-storybook-css-organization.md
      Note: |-
        Canonical folder, CSS ownership, colocated Storybook, and story-title organization playbook.
        Canonical folder
    - Path: docs/playbooks/07-react-application-decomposition-and-component-reuse.md
      Note: |-
        Canonical page/container vs organism vs molecule vs atom extraction and reuse decision tree.
        Canonical decomposition and component-system reuse decision tree.
    - Path: ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md
      Note: Bottom-up component visual parity workflow referenced by the taxonomy plan.
    - Path: ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/04-public-site-component-parity-handoff.md
      Note: Public-site parity handoff with warnings against starting from full page tuning.
    - Path: web/packages/pyxis-components/src/public
      Note: Current flat public-domain component folder to classify and reorganize.
    - Path: web/packages/pyxis-user-site/src/pages
      Note: |-
        Current public route pages that should own routing, RTK Query, and page-level states only.
        Public route pages that should stay as routing/RTK Query containers.
    - Path: web/packages/pyxis-user-site/stories/PublicPages.stories.tsx
      Note: |-
        Canonical full-page public route Storybook harness.
        Canonical public page route Storybook harness.
ExternalSources: []
Summary: Plan for cleaning up Pyxis public-site component taxonomy, folder layout, Storybook organization, and page decomposition boundaries.
LastUpdated: 2026-04-26T14:45:00-04:00
WhatFor: Use this guide to refactor the public site into a clear component taxonomy without confusing page stories, duplicated CSS ownership, or mixed data-fetching boundaries.
WhenToUse: Before moving public-site components or extracting page sections into domain atoms, molecules, organisms, and route pages.
---


# Public Site Component Taxonomy and Folder Layout Refactor Guide

## 1. Executive Summary

The public Pyxis site now has real RTK Query wiring and a clean canonical page Storybook harness under `Public Site/Pages`. The next problem is structural: the public component system is mostly a flat folder of domain components under `web/packages/pyxis-components/src/public`, while the route package `web/packages/pyxis-user-site` still has page files that mix data fetching, page layout, section composition, and small bits of view transformation.

This ticket should turn the public site into a system that is as legible as the staff app component system:

```text
Generic design-system primitives
  web/packages/pyxis-components/src/atoms
  web/packages/pyxis-components/src/molecules
  web/packages/pyxis-components/src/organisms

Public-domain components
  web/packages/pyxis-components/src/public/atoms
  web/packages/pyxis-components/src/public/molecules
  web/packages/pyxis-components/src/public/organisms
  web/packages/pyxis-components/src/public/sections

Public route app
  web/packages/pyxis-user-site/src/pages
  web/packages/pyxis-user-site/stories/PublicPages.stories.tsx
```

The key rule is separation of responsibilities:

```text
Route page
  owns route params, navigation, RTK Query hooks, loading/error/empty states
  passes typed props to public organisms/sections

Public organism/section
  owns a coherent public-site page section
  composes public molecules and generic primitives
  does not call route-level RTK Query hooks

Public molecule
  owns one reusable public-domain row/card/chip/list item
  does not fetch data

Public atom
  owns a small public-domain visual marker or tiny control

Generic component system
  owns reusable primitives that are not public-site-specific
```

The immediate implementation should be conservative: first document and classify the existing flat `public/*` folders, then move a small group with codemods/exports, then validate Storybook IDs and builds. Do not rename everything in one large commit.

## 2. Problem Statement

### 2.1 Current confusion

The current public-site Storybook had two kinds of route stories:

1. Canonical route-level stories under `Public Site/Pages`, using `PublicPages.stories.tsx` with Redux, MemoryRouter, real pages, RTK Query, and MSW.
2. Standalone `Pages/*` stories like `pages-book--default`, which were easy to open by accident and did not represent the intended harness.

Those standalone stories have now been removed, but the underlying taxonomy problem remains. Public-domain components are still all siblings:

```text
web/packages/pyxis-components/src/public/AboutHero
web/packages/pyxis-components/src/public/ArchiveSearchFilters
web/packages/pyxis-components/src/public/BookingForm
web/packages/pyxis-components/src/public/PubNav
web/packages/pyxis-components/src/public/ShowTile
web/packages/pyxis-components/src/public/VenueCard
...
```

A flat folder hides the difference between a row (`LineupRow`), a page section (`BookingSpaceAside`), a shell organism (`PubNav`), and a small public control (`ShowTypeChips`). It also makes Storybook titles less expressive and makes visual-diff targeting harder.

### 2.2 Why this matters

A clean taxonomy is not just aesthetic. It prevents these classes of bugs:

- Developers open the wrong Storybook story and debug a stale harness.
- Page components accumulate markup that should live in named organisms.
- CSS spreads across page files instead of staying owned by a widget.
- Public-domain components are mistaken for generic design-system primitives.
- Visual-diff specs compare whole pages too early instead of bottom-up components.
- RTK Query hooks creep into small widgets, making stories require API mocking unnecessarily.

## 3. Source Playbooks

This ticket should follow existing repo guidance, not invent a new approach.

### 3.1 Folder, CSS, and Storybook organization

`docs/playbooks/06-react-widget-folder-storybook-css-organization.md`

Key rules:

- Organize by widget ownership, not file type.
- Every widget folder owns:
  - `WidgetName.tsx`
  - `WidgetName.css`
  - `WidgetName.stories.tsx`
  - `index.ts`
- Prefer colocated stories.
- Storybook titles should mirror source tree.
- Page stories belong in a page/story harness, not in a confusing top-level bucket.
- CSS belongs to the widget that owns the markup.

### 3.2 Decomposition and reuse

`docs/playbooks/07-react-application-decomposition-and-component-reuse.md`

Key rules:

- First check whether a generic primitive already exists.
- Extract app/public atoms for small domain-specific markers.
- Extract molecules for reusable rows/cards/items around one domain object.
- Extract organisms for coherent sections.
- Keep route orchestration, RTK Query, URL params, loading/error/empty states in pages.
- Reuse generic primitives by default; wrap before duplicating.

### 3.3 Public-site component taxonomy

`docs/component-system-and-public-site-components.md`

Key rules:

- Composition level and domain are separate axes.
- `Button` is a generic atom.
- `Field` is a generic molecule.
- `VenueCard` can be a public-site organism/molecule without being a generic organism.
- Page stories are useful but are not the first visual repair target.
- Public visual work should move bottom-up before page-level tuning.

## 4. Proposed Taxonomy

### 4.1 Keep generic design system as-is

Do not move generic components as part of this ticket:

```text
web/packages/pyxis-components/src/atoms
web/packages/pyxis-components/src/molecules
web/packages/pyxis-components/src/organisms
```

These are domain-neutral primitives such as `Button`, `Input`, `Card`, `Field`, `Table`, `Modal`, and `TopBar`.

### 4.2 Introduce public-domain subfolders

Target layout:

```text
web/packages/pyxis-components/src/public/
  atoms/
    ShowTypeChips/
  molecules/
    ArchiveSearchFilters/
    ArchiveShowRow/
    ArchiveShowList/
    ArchiveStats/
    LineupRow/
    Poster/
    PublicPageHeader/
    PubShowRow/
    ReserveTicketCard/
    SafetyNote/
    ShowDetailHeader/
    ShowMetaStrip/
    ShowTile/
    TicketStub/
    YearGroup/
  organisms/
    AboutHero/
    AboutIntro/
    BookingForm/
    BookingRules/
    BookingSpaceAside/
    BookingSuccess/
    CollectiveList/
    EthosGrid/
    EthosStrip/
    FindUsBlock/
    MailingListCTA/
    PubFooter/
    PubHero/
    PubNav/
    SaferSpaceAgreement/
    ShowGrid/
    SpaceInfo/
    VenueCard/
  fixtures/
    PublicDiffFixture.stories.tsx
  index.ts
```

This classification is a starting point, not a law. Some items deserve review:

- `VenueCard`: may be a public organism because it represents a full venue section.
- `YearGroup`: may be a public organism if it owns section-level grouping and layout.
- `Poster`: may be a molecule if it is a single visual item; organism if it owns a larger display area.
- `EthosStrip`: may be an organism if it acts as a full section, despite the word "Strip".
- `SafetyNote`: may be a molecule or organism depending on whether it is a reusable small note or a full aside section.

### 4.3 Page route package layout

Keep route pages in `pyxis-user-site`, but make them thinner over time:

```text
web/packages/pyxis-user-site/src/pages/
  Shows.tsx          # RTK Query + page state + compose ShowGrid/sections
  ShowDetail.tsx     # route param + RTK Query + compose detail sections
  Archive.tsx        # query/search state + archive sections
  Book.tsx           # mutation + form error state + compose BookingForm/asides
  BookSuccess.tsx
  About.tsx
```

Do not move route pages into `pyxis-components`. They are application containers because they depend on routing, navigation, and RTK Query hooks.

## 5. Storybook Rules

### 5.1 Public route page stories

There should be exactly one canonical public route story harness in `pyxis-user-site`:

```text
web/packages/pyxis-user-site/stories/PublicPages.stories.tsx
```

Its title should remain:

```ts
title: 'Public Site/Pages'
```

Expected story IDs:

```text
public-site-pages--shows-desktop
public-site-pages--shows-mobile
public-site-pages--show-detail-desktop
public-site-pages--show-detail-mobile
public-site-pages--archive-desktop
public-site-pages--archive-mobile
public-site-pages--book-desktop
public-site-pages--book-mobile
public-site-pages--book-success-desktop
public-site-pages--about-desktop
public-site-pages--about-mobile
```

Do not recreate standalone stories titled `Pages/Book`, `Pages/Shows`, etc.

### 5.2 Public component stories

Public component stories should live beside their component in `pyxis-components`.

For this path:

```text
web/packages/pyxis-components/src/public/molecules/LineupRow/LineupRow.stories.tsx
```

Use this title:

```ts
title: 'Public Site/Components/Molecules/LineupRow'
```

For this path:

```text
web/packages/pyxis-components/src/public/organisms/BookingForm/BookingForm.stories.tsx
```

Use:

```ts
title: 'Public Site/Components/Organisms/BookingForm'
```

### 5.3 Generic component stories

Generic components keep their current hierarchy:

```text
Atoms/Button
Molecules/Card
Organisms/Modal
```

Do not put public-domain components in generic `Atoms`, `Molecules`, or `Organisms` unless they are truly reusable outside the public site.

## 6. Data and RTK Query Boundaries

### 6.1 Pages own API hooks

Good:

```tsx
export function Shows() {
  const { data, isLoading, isError } = useUpcomingShows();
  if (isLoading) return <ShowsSkeleton />;
  if (isError || !data) return <ShowsError />;
  return <ShowsPageContent shows={data} />;
}
```

### 6.2 Public organisms receive data

Good:

```tsx
export type ShowsPageContentProps = {
  shows: Show[];
  onShowClick: (show: Show) => void;
};

export function ShowsPageContent({ shows, onShowClick }: ShowsPageContentProps) {
  return <ShowGrid shows={shows} onShowClick={onShowClick} />;
}
```

### 6.3 Molecules do not fetch

Good:

```tsx
export type ShowTileProps = {
  show: Show;
  onClick?: (show: Show) => void;
};
```

Bad:

```tsx
export function ShowTile({ id }: { id: number }) {
  const { data } = useShow(id); // do not do this in a molecule
}
```

## 7. CSS Ownership Rules

### 7.1 Page CSS

Page CSS is for page-level layout only:

```text
Shows.css
Archive.css
Book.css
ShowDetail.css
PublicPage.css
```

It may define broad page frame classes such as:

```css
.pyxis-public-page {}
.pyxis-shows-page__grid-section {}
```

It should not define detailed styles for a reusable widget that belongs in `pyxis-components`.

### 7.2 Component CSS

Component CSS stays beside its component:

```text
public/molecules/ShowTile/ShowTile.css
public/organisms/BookingForm/BookingForm.css
```

A component imports its own CSS from its TSX implementation.

### 7.3 Shared public layout primitives

If multiple public organisms need a repeated layout primitive, create a named public primitive rather than a broad CSS bucket:

```text
public/molecules/PublicSection/PublicSection.tsx
public/molecules/PublicSection/PublicSection.css
```

Avoid files like:

```text
public-layout.css
public-sections.css
public-cards.css
```

unless explicitly marked as temporary compatibility shims.

## 8. Implementation Plan

### Phase 1: Inventory and classification

- Run `scripts/audit-public-component-taxonomy.mjs`.
- Review every `web/packages/pyxis-components/src/public/*` component.
- Assign each component one of:
  - public atom
  - public molecule
  - public organism
  - public fixture/support
  - needs review
- Record final classification in a table in this ticket before moving files.

### Phase 2: Storybook cleanup baseline

- Ensure `pyxis-user-site` has only `Public Site/Pages` page stories.
- Ensure no `pages-book--default`, `pages-shows--default`, or similar stale route stories exist.
- Build Storybook and inspect `storybook-static/index.json`.

### Phase 3: Move a small pilot batch

Start with low-risk public molecules:

```text
LineupRow
ShowMetaStrip
ShowDetailHeader
ArchiveShowRow
ArchiveShowList
```

For each component:

1. Move the folder to the target taxonomy folder.
2. Update internal relative imports.
3. Update `src/index.ts` exports.
4. Update Storybook title to match the new folder.
5. Run package build.
6. Check whether any visual-diff spec references the old story ID.

### Phase 4: Move public organisms

Move larger components after the molecule pilot proves the pattern:

```text
PubNav
PubFooter
BookingForm
BookingSpaceAside
AboutHero
ShowGrid
VenueCard
```

Do these in small clusters by page domain:

- Shows/detail cluster
- Archive cluster
- Booking cluster
- About/venue cluster
- Shell/navigation cluster

### Phase 5: Thin pages

After component folders are clean, inspect `pyxis-user-site/src/pages/*.tsx` and extract page sections where page markup is doing organism work.

Candidates:

- `ShowsPageContent` / `UpcomingShowsSection`
- `ShowDetailContent`
- `ArchiveResultsSection`
- `BookingPageLayout`
- `AboutPageContent`

Do not extract prematurely if the page is already just a simple container.

### Phase 6: Validate

Run:

```bash
cd web/packages/pyxis-components && pnpm build
cd web/packages/pyxis-user-site && pnpm build-storybook
cd web/packages/pyxis-user-site && pnpm build
cd web && pnpm build
```

Inspect Storybook IDs:

```bash
cd web/packages/pyxis-user-site/storybook-static
python3 - <<'PY'
import json
with open('index.json') as f: data=json.load(f)
for k,v in data['entries'].items():
    if v.get('type')=='story': print(k, '=>', v['title'], '/', v['name'])
PY
```

## 9. Migration Safety Notes

### 9.1 Story IDs may change

Moving stories and changing titles changes Storybook IDs. Before moving a component, search visual-diff specs:

```bash
rg "lineup-row|show-tile|booking-form|pub-nav" prototype-design docs ttmp -n
```

If an active visual spec references a story ID, update the spec in the same commit.

### 9.2 Barrel exports protect consumers

Keep public imports stable where possible:

```ts
import { ShowGrid } from 'pyxis-components';
```

Even if the internal file moves from:

```text
src/public/ShowGrid
```

to:

```text
src/public/organisms/ShowGrid
```

`src/index.ts` should continue exporting `ShowGrid` from the new path.

### 9.3 Avoid giant moves

Do not move all public components in one commit. Use small clusters and validate after each cluster.

### 9.4 Do not mix decomposition and visual tuning

This ticket is about taxonomy and ownership. If a component looks wrong after moving, fix import/CSS ownership regressions only. Open a separate visual parity task for aesthetic tuning.

## 10. Proposed Classification Table

Initial suggested classification from the current folder names and source inspection:

| Component | Suggested level | Notes |
| --- | --- | --- |
| ShowTypeChips | public atom | Small public-domain selector/chip group; review whether plural component should be molecule. |
| LineupRow | public molecule | One lineup entry row. |
| ArchiveShowRow | public molecule | One archived show row. |
| ArchiveShowList | public molecule | List wrapper around archive rows; could be organism if it owns section behavior. |
| ArchiveSearchFilters | public molecule | Search/filter control group. |
| ArchiveStats | public molecule | Public stat display; wraps generic stat-like behavior. |
| PublicPageHeader | public molecule | Reusable public header block. |
| ShowDetailHeader | public molecule | Detail-page header block. |
| ShowMetaStrip | public molecule | Compact metadata strip. |
| ShowTile | public molecule | One public show tile. |
| PubShowRow | public molecule | One public show row. |
| ReserveTicketCard | public molecule | One detail/CTA card. |
| TicketStub | public molecule | Ticket-shaped show info. |
| Poster | public molecule | Single poster/flyer visual. |
| SafetyNote | public molecule | Small reusable note unless it becomes a full aside section. |
| YearGroup | public molecule/organism | Review: grouping section may be organism. |
| VenueCard | public organism | Substantial venue info section. |
| PubNav | public organism | Public shell navigation. |
| PubFooter | public organism | Public shell footer. |
| PubHero | public organism | Public page hero. |
| AboutHero | public organism | About page hero section. |
| AboutIntro | public organism | About page intro section. |
| EthosStrip | public organism | Section-level public content. |
| EthosGrid | public organism | Section-level grid. |
| CollectiveList | public organism | Section/list block. |
| FindUsBlock | public organism | Contact/location section. |
| MailingListCTA | public organism | CTA section. |
| ShowGrid | public organism | Grid section composed of `ShowTile`. |
| BookingForm | public organism | Full booking form workflow. |
| BookingRules | public organism | Booking info section. |
| BookingSpaceAside | public organism | Booking aside section composed of other pieces. |
| SaferSpaceAgreement | public organism | Agreement/info section. |
| BookingSuccess | public organism | Success page content section. |
| SpaceInfo | public organism | Venue/space information section. |

## 11. Acceptance Criteria

The ticket is complete when:

- The public component taxonomy is documented in the ticket and/or repo docs.
- `pyxis-user-site` page stories are not duplicated outside `PublicPages.stories.tsx`.
- Public-domain components are organized by composition level or an explicitly accepted equivalent.
- Each moved component keeps colocated TSX/CSS/story/index files.
- `pyxis-components` barrel exports remain stable.
- Builds pass:
  - `pyxis-components`
  - `pyxis-user-site`
  - public Storybook
  - full `web` build
- Diary records the move batches and any story ID changes.
