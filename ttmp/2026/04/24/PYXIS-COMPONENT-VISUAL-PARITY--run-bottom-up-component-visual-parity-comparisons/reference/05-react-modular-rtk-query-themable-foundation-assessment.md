---
Title: React modular RTK-query themable foundation assessment
Ticket: PYXIS-COMPONENT-VISUAL-PARITY
Status: active
Topics:
  - frontend
  - react
  - storybook
  - theming
  - data-fetching
  - rtk-query
  - public-site
  - visual-parity
DocType: review
Intent: architecture-assessment
Summary: Assessment of whether the current Pyxis component and public-site work is moving toward a modular, themable, Storybook-ready, application-ready React architecture with a clean data-fetching boundary.
LastUpdated: 2026-04-24T00:00:00Z
---

# React Modular / RTK Query / Themable Foundation Assessment

## 0. Executive summary

We made large progress on bottom-up visual coverage, but we are only **partially aligned** with the longer-term goal of a modular, themable, application-ready React setup.

The good news:

- We now have a broad public component inventory.
- Most prototype design elements from the standalone public pages have first-class React components.
- Storybook coverage is much richer than before.
- Visual-diff configs now provide a useful regression harness before page-level work.
- The package boundary between `pyxis-components` and `pyxis-user-site` is mostly sound in concept.

The concern:

- In the push for visual parity, many public components were implemented with **inline hardcoded styles**.
- Several components were tuned to match fixture snippets rather than designed around a stable theme contract.
- Some component names now encode ambiguous or conflicting concepts, for example `VenueCard`, `BookingRules`, `BookingSpaceAside`, `SpaceInfo`, `EthosStrip`, and `EthosGrid`.
- The app currently uses **TanStack React Query**, not RTK Query. If the target is truly RTK Query, there is a data-layer migration or clarification decision ahead.
- We created breadth quickly, but not yet the theming architecture expected by a reusable component system.

My recommendation is **not** to jump directly to full page comparisons yet. The component inventory is ready, but the foundation needs a short stabilization pass focused on API taxonomy, CSS/theming, and data-layer direction.

In concrete terms:

```text
1. Freeze the current parity work as the design inventory.
2. Normalize public component taxonomy.
3. Move public component styles out of inline JSX into tokenized CSS modules/files using data-pyxis selectors.
4. Decide TanStack Query vs RTK Query before app-level data work.
5. Wire pages only after the above decisions are made.
```

---

## 1. What the intended architecture should look like

The target implied by the current work and the `react-modular-themable-storybook` workflow is:

```text
pyxis-components
  Pure, reusable React UI package
  No app router knowledge
  No network fetching
  No RTK Query / React Query dependency
  Stable component APIs
  Stable data-pyxis part selectors
  Tokenized CSS variables
  Storybook coverage for states, variants, and themes

pyxis-user-site
  Application shell
  Routing
  Data fetching
  API cache
  Page composition
  SEO/accessibility concerns
  Uses pyxis-components as presentational building blocks
```

The data layer should live in `pyxis-user-site`, not in `pyxis-components`.

The component layer should accept plain data props such as:

```ts
<ShowGrid shows={shows} />
<ArchiveShowList shows={archiveShows} />
<BookingForm onSubmit={submitBooking} />
```

The app layer should own API fetching and state orchestration:

```ts
const { data: shows } = useUpcomingShows();
return <ShowGrid shows={shows} />;
```

That separation is conceptually good today, but the styling/theming and data-fetching choices are not fully aligned with the stated target.

---

## 2. Current package state

### 2.1 `pyxis-components`

Location:

```text
web/packages/pyxis-components
```

Role today:

- Atom/molecule/organism library.
- Public-site component library.
- Storybook host on port `6006`.
- MSW mock definitions and shared mock types.
- Design tokens under `src/tokens`.

Strengths:

- Clear package boundary.
- Components are mostly pure/presentational.
- Public export barrel exists at `src/index.ts`.
- `data-pyxis-component` / `data-pyxis-part` selector contract exists via `src/utils/parts.ts`.
- Storybook coverage is broad and now has public component taxonomy.
- Visual-diff fixtures provide regression targets.

Weaknesses:

- Many public components are inline-styled.
- Many public components hardcode colors like `#C8270D`, `#8E887E`, `#EAE7E0`, `#1F1E1C` instead of using tokens.
- Some components have only `root` part selectors and no internal part selectors.
- Public component taxonomy is now very wide and needs pruning/consolidation.
- There is no explicit `unstyled` mode, CSS layer strategy, or component-level theme contract.
- Several components encode prototype-specific content rather than reusable structure.

### 2.2 `pyxis-user-site`

Location:

```text
web/packages/pyxis-user-site
```

Role today:

- Public site app.
- React Router routes.
- Page composition.
- Data fetching through TanStack React Query.
- Storybook page stories on port `6007`.

Strengths:

- App/page boundary exists.
- Routes are lazy-loaded.
- QueryClientProvider is configured in `App.tsx`.
- API client and endpoint constants are centralized.
- Pages consume hooks rather than fetching inline.

Weaknesses:

- It uses `@tanstack/react-query`, not RTK Query.
- Query definitions are handwritten hooks over `apiFetch`, not generated endpoints or RTK Query slices.
- API types are duplicated between `pyxis-user-site/src/api/types.ts` and `pyxis-components/src/mocks/types.ts`.
- Page components have substantial inline layout styles.
- The user-site pages are not yet wired to the newly added poster/grid/detail/archive/about components.

---

## 3. Did we stray from the path?

Yes, but in a useful way.

We strayed in the sense that we prioritized visual coverage over reusable theming architecture. That caused a rapid expansion of components and inline styles. This was appropriate for discovering the full design inventory, but it should not become the final architecture.

The work produced a map of the design system:

```text
Generic atoms/molecules/organisms
Public molecules
Public organisms
Standalone page-specific components
Poster/tile/grid components
```

That is valuable. The danger is treating this inventory as finished production architecture.

The current state should be considered:

```text
Design inventory + parity harness + provisional React components
```

not yet:

```text
Final modular themable component system
```

---

## 4. Visual parity status after tuning

The public component layer is now much less noisy than before. Current representative stats are:

```text
0.0000%  public-page-header-default
0.0000%  show-detail-header-default
0.0000%  show-meta-strip-default
0.0000%  year-group-default
0.0000%  venue-card-default
0.0102%  show-type-chips-default
0.0218%  pub-hero-default
0.2511%  pub-footer-default
0.2671%  archive-show-row-default
0.3144%  ticket-stub-default
0.4888%  archive-show-list-default
1.1681%  reserve-ticket-card-default
1.4647%  pub-nav-default
1.6353%  safer-space-agreement-default
1.7528%  booking-form-default
2.0293%  booking-space-aside-default
2.3980%  archive-search-filters-default
2.4884%  space-info-default
2.4946%  show-tile-redroom
3.2139%  poster-redroom
3.3797%  mailing-list-cta-default
4.3161%  about-intro-default
4.3774%  show-grid-desktop
4.5967%  find-us-block-default
4.9310%  pub-show-row-default
5.1793%  collective-list-default
5.3400%  lineup-row-default
5.9015%  ethos-grid-default
6.3640%  booking-rules-default
7.0987%  archive-stats-default
7.3591%  booking-success-default
9.6481%  ethos-strip-default
10.2790% safety-note-default
```

Interpretation:

- The design inventory is represented.
- Many components are close enough to become stable fixtures.
- Some high residuals are text anti-aliasing or selector-depth issues.
- Some high residuals still reflect taxonomy or fixture mismatch.

Before page-level work, I would fix taxonomy and theming more than chase every residual pixel.

---

## 5. Component taxonomy assessment

### 5.1 Good components to keep as canonical

These seem like strong public components:

```text
PublicPageHeader
Poster
ShowTile
ShowGrid
ReserveTicketCard
ShowDetailHeader
ShowMetaStrip
SafetyNote
ArchiveStats
ArchiveSearchFilters
ArchiveShowRow
ArchiveShowList
ShowTypeChips
SaferSpaceAgreement
BookingSpaceAside
AboutIntro
EthosGrid
CollectiveList
FindUsBlock
PubNav
PubFooter
LineupRow
TicketStub
BookingForm
```

They map to visible prototype design elements and can form a solid page foundation.

### 5.2 Components needing consolidation or renaming

#### `EthosStrip` vs `EthosGrid`

Current state:

- `EthosGrid` matches the light about-page prototype section.
- `EthosStrip` was originally a dark strip, then was tuned toward the same light grid motif.

Recommendation:

```text
Keep EthosGrid as canonical.
Deprecate or remove EthosStrip unless there is a real dark-strip design later.
```

#### `VenueCard`, `BookingSpaceAside`, `SpaceInfo`, `FindUsBlock`

Current state:

- `VenueCard` was tuned to a dark aside motif.
- `BookingSpaceAside` is also the dark aside motif.
- `SpaceInfo` approximates a find-us/contact block.
- `FindUsBlock` is a better name for the about-page contact section.

Recommendation:

```text
BookingSpaceAside = canonical dark book-page aside.
FindUsBlock = canonical about-page contact block.
VenueCard = either remove, rename, or reserve for a future light card/map concept.
SpaceInfo = either remove or fold into FindUsBlock/BookingSpaceAside.
```

Do not keep four components for two concepts.

#### `PubShowRow` vs `ArchiveShowRow` vs `ShowTile`

Current state:

- `ShowTile` maps to the poster-grid Shows page.
- `ArchiveShowRow` maps to the archive page list row.
- `PubShowRow` is a third show-row concept and may no longer be needed for prototype parity.

Recommendation:

```text
ShowTile = upcoming shows grid item.
ArchiveShowRow = archive row.
PubShowRow = only keep if the app intentionally uses a non-prototype list layout.
```

#### `TicketStub` vs `ReserveTicketCard`

Current state:

- `TicketStub` is the decorative ticket card motif.
- `ReserveTicketCard` is the detail-page action card.

Recommendation:

```text
Keep both, but document where each belongs.
TicketStub: decorative ticket identity / dark hero contexts.
ReserveTicketCard: detail page purchase action under poster.
```

---

## 6. Theming assessment

This is the biggest architectural gap.

### 6.1 What is good

Tokens exist:

```text
web/packages/pyxis-components/src/tokens/tokens.css
web/packages/pyxis-components/src/tokens/tokens.ts
```

The token file defines:

```text
--color-canvas
--color-surface
--color-border
--color-text-primary
--color-text-secondary
--color-text-tertiary
--color-accent
--color-ink
--font-display
--font-body
--space-*
--radius-*
--shadow-*
```

This is a good foundation.

### 6.2 What is not good

Many new public components use inline styles and hardcoded values:

```text
#C8270D
#8E887E
#EAE7E0
#1F1E1C
#F8F6F1
#4A463E
```

This undermines:

- theme switching,
- downstream customization,
- Storybook themed variants,
- visual consistency,
- CSS override ergonomics,
- bundle/CSS caching behavior.

Inline styles also make pseudo-states and responsive variants harder.

### 6.3 Recommended theming contract

Move public component styling to CSS files using low-specificity selectors and `data-pyxis-*` attributes.

Example target pattern:

```css
[data-pyxis-component="archive-stats"] {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--pyxis-public-stat-gap, 32px);
  padding: var(--pyxis-public-stat-padding, 18px 0);
  border-block: 1px solid var(--color-border);
}

[data-pyxis-component="archive-stats"] [data-pyxis-part="value"] {
  font-family: var(--font-display);
  font-size: var(--pyxis-public-stat-value-size, 34px);
  color: var(--color-accent);
}
```

Each component should have:

```text
data-pyxis-component="component-name"
data-pyxis-part="root"
data-pyxis-part="value/title/label/body/action/..."
```

The public components should expose stable className and, where useful:

```ts
unstyled?: boolean
```

But do not add `unstyled` everywhere until the styling layer exists.

### 6.4 Prioritized CSS extraction targets

Start with components that will appear on pages and need theme consistency:

```text
PublicPageHeader
PubNav
PubFooter
ShowTile
Poster
ShowGrid
ArchiveStats
ArchiveSearchFilters
ArchiveShowRow
BookingForm
BookingSpaceAside
AboutIntro
EthosGrid
CollectiveList
FindUsBlock
```

Then clean up lower-risk components.

---

## 7. Storybook assessment

Storybook is now useful and broad.

Good:

- Public section is grouped into molecules and organisms.
- Diff fixtures exist.
- Public components have individual stories.
- Visual parity can be run against fixture stories.

Needs work:

- Stories should include theme variants after CSS extraction:

```text
Default
Compact/Mobile
Dark or inverse where applicable
Token override demo
Unstyled/headless demo where useful
```

- Stories should avoid duplicating app-level data assumptions.
- Some new stories are auto-generated/simple and need better docs/args.
- Story IDs changed as taxonomy changed; scripts should avoid brittle assumptions where possible.

Recommended next Storybook pass:

```text
1. Add a Public Page Building Blocks story that composes the canonical components by page.
2. Add theme override decorators.
3. Add stories that demonstrate component slots/variants.
4. Keep visual-diff fixtures separate from documentation stories.
```

---

## 8. Data-layer assessment: React Query vs RTK Query

The user named "RTK-query", but the current app uses TanStack React Query:

```text
web/packages/pyxis-user-site/package.json
  @tanstack/react-query
  @tanstack/react-query-devtools
```

Current hooks:

```text
web/packages/pyxis-user-site/src/api/hooks.ts
```

Current client:

```text
web/packages/pyxis-user-site/src/api/client.ts
```

Current endpoint constants:

```text
web/packages/pyxis-user-site/src/api/endpoints.ts
```

Current provider:

```text
web/packages/pyxis-user-site/src/App.tsx
  QueryClientProvider
```

### 8.1 Current TanStack setup is coherent

The current React Query setup is reasonable:

- `apiFetch` centralizes HTTP/error handling.
- `endpoints` centralizes URL paths.
- hooks abstract app pages from raw fetch.
- `QueryClientProvider` is configured centrally.
- lazy routes are already present.

### 8.2 But it is not RTK Query

If RTK Query is the actual architectural target, we need to choose one path:

#### Option A: Keep TanStack Query

Pros:

- Already implemented.
- Lightweight for this public site.
- Good cache semantics for simple REST endpoints.
- No Redux store overhead.

Cons:

- Does not satisfy an RTK Query requirement.
- No Redux integration if admin/app state later needs RTK.

#### Option B: Migrate to RTK Query

Would add:

```text
@reduxjs/toolkit
react-redux
```

Structure:

```text
web/packages/pyxis-user-site/src/store.ts
web/packages/pyxis-user-site/src/api/publicApi.ts
```

Example:

```ts
export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080' }),
  tagTypes: ['Show', 'Archive', 'Submission'],
  endpoints: (builder) => ({
    getShows: builder.query<Show[], void>({ query: () => '/api/public/shows' }),
    getShow: builder.query<Show, number>({ query: (id) => `/api/public/shows/${id}` }),
    getArchive: builder.query<ArchivedShow[], string | void>({ query: (search) => ({ url: '/api/public/archive', params: search ? { search } : undefined }) }),
    getArchiveStats: builder.query<ArchiveStats, void>({ query: () => '/api/public/archive/stats' }),
    submitBooking: builder.mutation<BookingConfirmation, BookingFormData>({ query: (body) => ({ url: '/api/public/submissions', method: 'POST', body }) }),
  }),
});
```

Provider:

```tsx
<Provider store={store}>
  <App />
</Provider>
```

Recommendation:

```text
Make an explicit decision before app-level work.
```

If this is mostly a public marketing/site app, TanStack Query is fine. If the larger Pyxis application is expected to use Redux/RTK for shared state, use RTK Query now to avoid a later migration.

---

## 9. Type/schema assessment

There is type duplication:

```text
web/packages/pyxis-components/src/mocks/types.ts
web/packages/pyxis-user-site/src/api/types.ts
```

These should not drift.

Recommended options:

### Option A: Shared `pyxis-types` package

```text
web/packages/pyxis-types/src/public.ts
```

Both packages import from it.

### Option B: Export public API types from `pyxis-components`

The component package already has mock types, but making app API types depend on a UI package is not ideal.

### Option C: Schema-first generated types

Best long-term if backend/API schema is stable:

```text
OpenAPI / protobuf / zod schema → generated TS types
```

Recommendation:

```text
Create a small shared type/schema package before adding more app-level data logic.
```

---

## 10. Application-page readiness

The component layer is almost ready to support pages, but the current `pyxis-user-site` pages are not yet composed from the newly canonical components.

Examples:

### Shows page

Current app:

```text
PubHero + PubShowRow + MailingListCTA
```

Prototype direction:

```text
PublicPageHeader + ShowGrid + ShowTile + Poster
```

Decision needed:

```text
Should Shows use poster grid or hero/list?
```

If the prototype is source of truth, switch to:

```tsx
<PublicPageHeader kicker="Providence, RI" title="Upcoming shows" />
<ShowGrid shows={shows} />
```

### Show detail page

Current app:

```text
dark hero + TicketStub + LineupRow + VenueCard
```

Prototype direction:

```text
Poster + ReserveTicketCard + ShowDetailHeader + ShowMetaStrip + LineupRow + SafetyNote
```

Decision needed:

```text
Should detail page remain dark hero or match light poster/detail prototype?
```

### Archive page

Should compose:

```text
PublicPageHeader
ArchiveStats
ArchiveSearchFilters
YearGroup
ArchiveShowList
ArchiveShowRow
```

### Book page

Should compose:

```text
PublicPageHeader
BookingForm
BookingSpaceAside
```

and `BookingForm` should include or delegate:

```text
ShowTypeChips
SaferSpaceAgreement
```

### About page

Should compose:

```text
PublicPageHeader
AboutIntro
EthosGrid
CollectiveList
FindUsBlock
```

---

## 11. Risk register

### Risk 1: Inline-style lock-in

If we continue page work without CSS extraction, pages will embed hardcoded design decisions and theme migration will become expensive.

Mitigation:

```text
CSS extraction before or during page composition.
```

### Risk 2: Component explosion

We created many components quickly. Some overlap.

Mitigation:

```text
Consolidate aliases/deprecations before pages.
```

### Risk 3: Data-layer mismatch

Current app uses TanStack Query. Goal says RTK Query.

Mitigation:

```text
Decide and document one data-fetching strategy now.
```

### Risk 4: Parity fixtures becoming source of truth instead of prototype/pages

Some components were tuned to hand-rendered fixtures rather than full standalone pages.

Mitigation:

```text
Use page-level comparisons as validation after taxonomy/theming cleanup.
```

### Risk 5: Types drift between packages

`Show`, `ArchiveStats`, and booking types are duplicated.

Mitigation:

```text
Move API/domain types to shared package or generated schema.
```

---

## 12. Recommended next work plan

### Phase 1: Architecture decision checkpoint

Produce a small decision record:

```text
ADR: Data fetching strategy — TanStack Query vs RTK Query
ADR: Public component taxonomy and deprecated aliases
ADR: Styling/theming strategy for pyxis-components
```

### Phase 2: Theming stabilization

Move styles for canonical public components into CSS files:

```text
PublicPageHeader.css
ShowTile.css
Poster.css
ShowGrid.css
ArchiveStats.css
ArchiveSearchFilters.css
ArchiveShowRow.css
BookingForm.css
BookingSpaceAside.css
AboutIntro.css
EthosGrid.css
CollectiveList.css
FindUsBlock.css
```

Use:

```text
data-pyxis-component
[data-pyxis-part]
CSS variables
low specificity selectors
```

Avoid:

```text
large inline style blocks
hardcoded colors where tokens exist
page-specific copy baked into generic components
```

### Phase 3: Taxonomy cleanup

Canonicalize:

```text
EthosGrid over EthosStrip
BookingSpaceAside over VenueCard for book page
FindUsBlock over SpaceInfo for about page
ShowTile/ShowGrid over PubShowRow for prototype Shows page
ArchiveShowRow over PubShowRow for archive page
```

Do not necessarily delete immediately; mark deprecated and stop using in app pages.

### Phase 4: Page composition

Wire pages to canonical components:

```text
Shows.tsx
ShowDetail.tsx
Archive.tsx
Book.tsx
About.tsx
```

### Phase 5: Page-level visual comparisons

Only after component composition is stable:

```text
shows desktop/mobile
detail desktop/mobile
archive desktop/mobile
book desktop/mobile
about desktop/mobile
```

---

## 13. Recommended immediate next tasks

1. Decide whether RTK Query is mandatory.
2. If yes, migrate `pyxis-user-site` from TanStack Query to RTK Query before page rewiring.
3. If no, rename the goal to "React Query" rather than "RTK Query" and keep current data hooks.
4. Create a public component CSS extraction plan.
5. Choose canonical component names and mark overlaps.
6. Only then start application-page rewiring.

---

## 14. Bottom line

We have not wasted work. We have built the missing design inventory and a visual regression harness.

But we are at a fork:

```text
Path A: continue page-level visual matching immediately
  → fast, but likely cements inline styles, overlapping components, and unclear data architecture

Path B: stabilize modular/themable/data architecture now
  → slower for a day, but gives a stronger foundation for application-level work
```

Given the user goal — "React modular RTK-query themable setup" — choose Path B now.

Recommended next concrete action:

```text
Write and implement ADRs for:
1. Data fetching: TanStack Query vs RTK Query
2. Component taxonomy: canonical public components and deprecated overlaps
3. Theming: CSS variable + data-pyxis part styling contract
```

Then proceed to pages.
