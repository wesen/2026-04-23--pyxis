---
Title: ADR — Public component taxonomy after CSS extraction
Ticket: PYXIS-RTK-TYPES-MIGRATION
Status: proposed
Topics:
  - frontend
  - react
  - architecture
  - component-taxonomy
  - pyxis
DocType: design-doc
Intent: long-term
Summary: Architecture decision record proposing canonical public components and deferred/deprecated overlaps after CSS extraction.
LastUpdated: 2026-04-24T00:00:00Z
---

# ADR — Public Component Taxonomy After CSS Extraction

## Status

Proposed.

This ADR should be reviewed before page-level rewiring. It documents which public components should be treated as canonical, which are overlapping, and which need deprecation/alias decisions.

## Context

The public-site component inventory was built bottom-up from several sources:

- original public prototype page,
- standalone public pages (`shows`, `detail`, `archive`, `book`, `about`),
- Storybook fixture needs,
- visual-diff coverage gaps.

This produced useful coverage but also created overlapping components. CSS extraction made the components easier to maintain, but it did not resolve all semantic overlaps.

If page wiring starts before taxonomy decisions, the app may accidentally depend on duplicate concepts and make future cleanup harder.

## Decision summary

### Canonical public-page building blocks

Use these as the first-choice components for page composition:

#### Public shell

```text
PubNav
PubFooter
PublicPageHeader
```

#### Shows page

```text
Poster
ShowTile
ShowGrid
PubHero
TicketStub     (only where compact ticket motif is wanted)
```

#### Show detail page

```text
ShowDetailHeader
ShowMetaStrip
ReserveTicketCard
LineupRow
SafetyNote
VenueCard or BookingSpaceAside — pending final naming decision
```

#### Archive page

```text
ArchiveSearchFilters
ArchiveShowRow
ArchiveShowList
ArchiveStats
YearGroup
```

#### Booking page

```text
BookingForm
BookingRules
BookingSpaceAside
SaferSpaceAgreement
BookingSuccess
MailingListCTA
```

#### About page

```text
AboutHero
AboutIntro
EthosGrid
CollectiveList
FindUsBlock
```

## Overlap decisions

### 1. `ShowTile` / `ShowGrid` vs `PubShowRow`

Decision:

```text
Use ShowTile + ShowGrid as canonical for poster-based upcoming show listings.
Defer PubShowRow pending a concrete list-row page design.
```

Rationale:

- `ShowTile` and `ShowGrid` correspond to standalone public `shows.html` poster/flyer design.
- `PubShowRow` is an earlier row-style component with overlapping upcoming-show semantics.
- The parity map now marks `PubShowRow` CSS extraction as deferred.

Follow-up:

- If a future page needs a non-poster upcoming-show list row, either:
  - rename `PubShowRow` to `UpcomingShowRow`, or
  - replace it with a more explicit component.
- Do not polish `PubShowRow` further until this is decided.

### 2. `ArchiveShowRow` vs `PubShowRow`

Decision:

```text
Use ArchiveShowRow as canonical for archive/recap rows.
Do not use PubShowRow for archive pages.
```

Rationale:

- `ArchiveShowRow` has archive-specific props: `date`, `name`, `tag`, `href`.
- It renders the recap affordance explicitly.
- `PubShowRow` uses `Show` data and includes upcoming-show details like doors/price/age.

### 3. `EthosGrid` vs `EthosStrip`

Decision:

```text
Use EthosGrid as canonical for the About page.
Keep EthosStrip as public home/landing variant until page composition proves whether it is still needed.
```

Rationale:

- Both use the same underlying ethos motif.
- `EthosGrid` maps more directly to the about-page section component.
- `EthosStrip` was originally a home/landing strip and may remain useful if the home page has a smaller/sectional version.

Follow-up:

- If both survive, document the distinction:
  - `EthosGrid`: full about-page section.
  - `EthosStrip`: compact home-page strip.
- If not, delete/deprecate `EthosStrip` after page wiring.

### 4. `BookingSpaceAside` vs `VenueCard`

Decision:

```text
Use BookingSpaceAside on the booking page.
Use VenueCard on show detail pages only if a compact venue card remains needed.
```

Rationale:

- `BookingSpaceAside` contains booking-specific venue/equipment details.
- `VenueCard` is a compact dark venue card.
- They share visual language but not necessarily content scope.

Follow-up:

- If detail pages need the full equipment list, replace `VenueCard` with `BookingSpaceAside` or rename `BookingSpaceAside` to `VenueSpecsCard`.
- If `VenueCard` remains, keep it deliberately small.

### 5. `FindUsBlock` vs `SpaceInfo`

Decision:

```text
Use FindUsBlock on the About page.
Use SpaceInfo only for compact contact snippets, or deprecate if no page uses it.
```

Rationale:

- `FindUsBlock` includes address, general contact, booking contact, and arrival note.
- `SpaceInfo` is a smaller address/email block.
- They overlap heavily but serve different possible densities.

Follow-up:

- During page wiring, prefer `FindUsBlock` for full about/contact section.
- If no compact snippet is needed, deprecate `SpaceInfo`.

### 6. `BookingRules` vs `BookingSpaceAside`

Decision:

```text
Keep both for now.
```

Rationale:

- `BookingRules` is a compact rule/copy card.
- `BookingSpaceAside` is a venue/specification aside.
- They can coexist on a booking page if the layout needs both.

## Deprecation policy

Do not delete overlapping components immediately after this ADR. Instead:

1. Wire pages using canonical components.
2. Run page-level visual comparisons.
3. Search for unused components.
4. Deprecate in Storybook docs first if needed.
5. Remove only after consumers are updated.

Suggested deprecation comment pattern:

```ts
/**
 * @deprecated Pending public component taxonomy cleanup. Prefer ArchiveShowRow for archive pages.
 */
```

## Page wiring guidance

When wiring `pyxis-user-site` pages, use the canonical components in this order:

### Shows page

```tsx
<PubHero />
<ShowGrid />
<MailingListCTA />
```

### Show detail page

```tsx
<ShowDetailHeader />
<ShowMetaStrip />
<ReserveTicketCard />
<LineupRow />
<SafetyNote />
<VenueCard />
```

### Archive page

```tsx
<PublicPageHeader />
<ArchiveSearchFilters />
<ArchiveStats />
<YearGroup>
  <ArchiveShowList />
</YearGroup>
```

### Book page

```tsx
<PublicPageHeader />
<BookingForm />
<BookingSpaceAside />
<BookingRules />
<SaferSpaceAgreement />
```

### About page

```tsx
<AboutHero />
<AboutIntro />
<EthosGrid />
<CollectiveList />
<FindUsBlock />
```

## Validation

Before removing any overlapping component:

```bash
rg "ComponentName" web/packages
cd web && pnpm -r typecheck
```

For visual impact, run relevant component and page configs:

```bash
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/molecules
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/organisms
```

After page-level configs exist, run those too.

## Consequences

### Positive

- Page wiring has a clearer component menu.
- `PubShowRow` is no longer a silent ambiguity.
- The archive, booking, about, and shows pages each have obvious canonical building blocks.
- Deletion/deprecation is delayed until usage is proven.

### Negative / trade-offs

- Some overlap remains temporarily.
- Storybook still exposes components that may later become deprecated.
- Future developers must check this ADR before choosing between overlapping components.

## Follow-up tasks

1. During page wiring, record actual component usage.
2. Add deprecation notes to unused overlap components after usage is confirmed.
3. Remove overlap components only after page-level visual parity is stable.
4. Revisit this ADR after RTK Query and page composition are complete.
