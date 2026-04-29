---
Title: Show archive page visual redesign implementation guide
Ticket: PYXIS-ARCHIVE-VISUAL-REDESIGN
Status: active
Topics:
    - frontend
    - storybook
    - design-system
    - public-site
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
      Note: Existing archive visual target to extend after redesign
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
      Note: Current search/year control molecule that should become or be wrapped by the command bar
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveShowRow/ArchiveShowRow.tsx
      Note: Existing archive row link semantics to preserve while tuning layout
    - Path: web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.tsx
      Note: Existing metric strip to reuse in the archive masthead
    - Path: web/packages/pyxis-components/src/public/molecules/YearGroup/YearGroup.tsx
      Note: Existing year chapter component to reuse in the timeline layout
    - Path: web/packages/pyxis-user-site/src/pages/ArchivePage/Page.css
    - Path: web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
      Note: Existing Storybook coverage to expand for redesigned archive states
    - Path: web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
      Note: Public archive page view
ExternalSources: []
Summary: Analysis and implementation plan for redesigning the public show archive page into a more editorial, less stacked-form experience using existing Pyxis React components, tokens, Storybook, and visual diff workflow.
LastUpdated: 2026-04-29T12:35:00-04:00
WhatFor: Use this as the intern-ready implementation guide for improving the archive page visual hierarchy without breaking public API behavior or design-token consistency.
WhenToUse: Read before touching the public archive page, archive components, Storybook archive stories, or visual-diff targets.
---


# Show archive page visual redesign implementation guide

## Executive summary

The public archive page already works, but its current structure reads like a sequence of utility forms and lists stacked under one another: header, metrics, search input, year buttons, then year sections. That structure is mechanically correct, but it does not fully match the conceptual promise of an archive. An archive should feel like a browsable memory surface: a place where past shows are organized, scannable, and editorial. The current page exposes controls first and narrative second.

This guide proposes a redesign that keeps the existing API and most existing components, but reorganizes them into a stronger archive composition:

- a compact **archive masthead** that explains what the archive is;
- a **metrics strip** that reads like evidence, not a separate form block;
- a unified **archive command bar** for search, year selection, and result count;
- a **year timeline/list layout** where each year becomes a clear chapter;
- optional **featured/latest recap cards** if we want more visual texture later;
- Storybook stories for desktop, mobile, no-results, one-year, many-years, loading/error, and interaction states;
- visual-diff targets for the full archive page and stable subregions.

The key implementation principle is: **do not invent a second design system**. The Pyxis public site already has reusable primitives in `pyxis-components`, a token contract in `tokens.css`, and a part selector contract through `pyxisPart()`. The redesign should extract only the missing composition pieces and reuse existing archive components wherever possible.

## The page we are redesigning

The relevant public route is:

```text
/archive
```

There is also a recap route:

```text
/archive/:id
```

The archive page lives in the public Vite app:

```text
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.css
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
```

The reusable display components live in the shared component package:

```text
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveShowList/ArchiveShowList.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveShowRow/ArchiveShowRow.tsx
web/packages/pyxis-components/src/public/molecules/YearGroup/YearGroup.tsx
```

The current page flow is roughly:

```text
ArchivePageView
  ├─ PublicPageHeader
  ├─ ArchiveStats
  ├─ ArchiveSearchFilters
  ├─ optional stats error
  ├─ archive error OR year groups OR empty state
  └─ YearGroup
       └─ ArchiveShowList
            └─ ArchiveShowRow
```

That is a good data flow. The problem is not that the code is wrong. The problem is that the visual composition treats every piece as a horizontal block in a vertical stack. The redesigned page should preserve the data flow while improving spatial hierarchy.

## Current system map

### Data path

The archive page uses RTK Query wrappers in the public app:

```text
Archive()
  ├─ useArchive(search || undefined)
  │    └─ publicApi.getArchive
  │         └─ GET /api/public/archive?search=<query>
  └─ useArchiveStats()
       └─ publicApi.getArchiveStats
            └─ GET /api/public/archive/stats
```

The endpoint constants are defined in:

```text
web/packages/pyxis-user-site/src/api/endpoints.ts
```

The RTK Query implementation is in:

```text
web/packages/pyxis-user-site/src/api/publicApi.ts
```

The compatibility hooks are in:

```text
web/packages/pyxis-user-site/src/api/hooks.ts
```

The backend handlers are in:

```text
pkg/server/public.go
```

The relevant backend handlers are:

```go
func (s *Server) handleGetArchive(w http.ResponseWriter, r *http.Request)
func (s *Server) handleGetArchiveStats(w http.ResponseWriter, r *http.Request)
```

`handleGetArchive` reads the `search` query string, calls `s.showService.SearchArchive(ctx, search)`, converts domain records to protobuf JSON, and returns `ArchivedShowList`.

`handleGetArchiveStats` calls `s.showService.GetArchiveStats(ctx)` and returns `ArchiveStats`.

The client sees these domain types from `pyxis-types`:

```ts
type ArchivedShow = {
  id: number;
  artist: string;
  date: string;
  genre: string;
  draw: number;
};

type ArchiveStats = {
  totalShows: number;
  uniqueArtists: number;
  yearsRunning: number;
  totalAttendance: number;
};
```

The archive redesign does not require backend changes. It is a layout and component-composition project.

### Rendering path

The current `ArchivePageView` receives already-loaded data and state callbacks:

```ts
export type ArchivePageViewProps = {
  shows: ArchivedShow[];
  stats?: ArchiveStatsData;
  search: string;
  selectedYear: string;
  onSearchChange: (value: string) => void;
  onYearChange: (value: string) => void;
  isLoading?: boolean;
  archiveError?: string | null;
  statsError?: string | null;
  headerKicker?: string;
  headerTitle?: string;
};
```

This is useful for Storybook. A page view that receives data and callbacks is easy to render in stories without a real backend. Keep this pattern.

The page then derives:

```ts
const years = getArchiveYears(shows);
const filteredShows = selectedYear === 'All'
  ? shows
  : shows.filter((show) => String(getShowYear(show)) === selectedYear);
const groups = groupShowsByYear(filteredShows);
const resultLabel = `${filteredShows.length} shows...`;
```

This derivation should remain in the page or move into a small pure helper file if it grows. It should not move into CSS or Storybook.

## Problem statement

The current archive page has three related problems.

First, the page lacks a strong archive mental model. It has an archive title and archive rows, but the layout does not communicate “history,” “chapters,” or “browseable memory.” The search input and year chips are useful, but they visually compete with the content instead of supporting it.

Second, the filters feel form-like. Search input, result label, and year buttons are all technically controls. They currently sit as another block in the vertical stack, which makes the page feel like forms under forms. The page would feel stronger if these controls were grouped into a command surface: one intentional archive toolbar with clear hierarchy.

Third, the page uses existing components, but not enough compositional structure around them. `ArchiveStats`, `ArchiveSearchFilters`, `YearGroup`, and `ArchiveShowRow` are reasonable molecules. What is missing is an organism-level layout that says: “this is the archive page experience.”

A good redesign should answer these questions visually:

- What is this page for?
- How much history is here?
- How do I narrow it down?
- What year am I looking at?
- Which rows are clickable recaps?
- What happens if no shows match?
- Does the page still feel like Pyxis on mobile?

## Design goals

### Goal 1: Make the page feel archival, not administrative

The public archive should feel like a public-facing record. The visual language should be closer to a printed ledger, zine index, or venue chronology than a dashboard form. We can achieve this with typography, grouping, spacing, and a timeline-like year structure rather than heavy new UI.

### Goal 2: Reuse existing components before creating new ones

Existing components already encode Pyxis visual language:

- `PublicPageHeader` provides the page heading style.
- `ArchiveStats` provides compact metrics.
- `ArchiveSearchFilters` provides search and year controls.
- `YearGroup` provides year headings.
- `ArchiveShowList` and `ArchiveShowRow` provide show rows.

The redesign should wrap and refine these pieces, not replace them wholesale.

### Goal 3: Create an organism-level archive composition

Molecules are not enough. We should add one or two archive-specific organisms that compose the molecules into a coherent surface. A good target is:

```text
ArchiveExplorer
  ├─ ArchiveMasthead
  ├─ ArchiveCommandBar
  └─ ArchiveYearTimeline
```

This keeps the page readable and gives Storybook smaller targets.

### Goal 4: Preserve API behavior

The page should continue to use:

```text
GET /api/public/archive?search=<query>
GET /api/public/archive/stats
```

No database migration and no backend endpoint change should be necessary for the first redesign pass.

### Goal 5: Make Storybook the implementation harness

Implement and tune the design in Storybook first, then verify in Vite. This project already uses Storybook and visual-diff workflows. The archive redesign should follow that pattern.

## Proposed visual model

The redesign should treat the archive page as three zones.

```text
┌─────────────────────────────────────────────────────────────┐
│  Zone 1: Archive masthead                                   │
│  "Since 2023" / "The archive" / short explanatory line      │
│  Metrics embedded as a compact evidence strip                │
├─────────────────────────────────────────────────────────────┤
│  Zone 2: Archive command bar                                │
│  Search input + result count + year chips in one surface     │
│  Looks like a command surface, not separate forms            │
├─────────────────────────────────────────────────────────────┤
│  Zone 3: Year timeline                                      │
│  2026 ─ rows                                                │
│  2025 ─ rows                                                │
│  2024 ─ rows                                                │
└─────────────────────────────────────────────────────────────┘
```

On desktop, the masthead can use a two-column rhythm:

```text
┌───────────────────────────────┬─────────────────────────────┐
│ Since 2023                    │  128 shows                   │
│ The archive                   │  96 artists                  │
│ Past nights, recaps, and      │  4 years running             │
│ attendance traces.            │  7,420 total draw            │
└───────────────────────────────┴─────────────────────────────┘
```

On mobile, it should stack, but the stack should be intentional:

```text
Since 2023
The archive
Past nights, recaps, and attendance traces.

[128 shows] [96 artists]
[4 years]   [7,420 draw]

Search artists, dates, tags…
All  2026  2025  2024
```

The command bar should be visually one object:

```text
┌─────────────────────────────────────────────────────────────┐
│ Search artists, dates, tags…              32 shows          │
│ [All] [2026] [2025] [2024] [2023]                           │
└─────────────────────────────────────────────────────────────┘
```

The year timeline should reduce repeated form feeling by emphasizing content:

```text
2026                                                  9 shows
──────────────────────────────────────────────────────────────
Jan 18   Artist name                         Ambient    recap →
Feb 03   Artist name                         Noise      recap →

2025                                                 21 shows
──────────────────────────────────────────────────────────────
Mar 14   Artist name                         Drone      recap →
```

## Component architecture

### Keep these components

Do not throw away the existing archive components. They are already small and reusable.

| Component | Keep? | Why |
|---|---:|---|
| `PublicPageHeader` | Yes | Already defines public page heading typography. |
| `ArchiveStats` | Yes | Metrics are still needed; style can be tuned through tokens/parts. |
| `ArchiveSearchFilters` | Yes, but refactor | The control semantics are right; the visual grouping needs improvement. |
| `YearGroup` | Yes | Year chapter concept is correct. |
| `ArchiveShowList` | Yes | Simple list wrapper remains useful. |
| `ArchiveShowRow` | Yes, but tune | Row semantics and link behavior are correct; visual rhythm can improve. |

### Add these components

#### `ArchiveExplorer`

This is the top-level public archive organism. It receives all data and renders the page zones. It keeps `ArchivePageView` from becoming a long JSX layout.

Suggested path:

```text
web/packages/pyxis-components/src/public/organisms/ArchiveExplorer/ArchiveExplorer.tsx
web/packages/pyxis-components/src/public/organisms/ArchiveExplorer/ArchiveExplorer.css
web/packages/pyxis-components/src/public/organisms/ArchiveExplorer/ArchiveExplorer.stories.tsx
web/packages/pyxis-components/src/public/organisms/ArchiveExplorer/index.ts
```

Suggested props:

```ts
export type ArchiveExplorerGroup = {
  year: number;
  shows: ArchiveShow[];
};

export type ArchiveExplorerProps = {
  kicker?: string;
  title?: string;
  description?: string;
  stats?: ArchiveStatsData;
  years: string[];
  activeYear: string;
  search: string;
  resultLabel: string;
  groups: ArchiveExplorerGroup[];
  isLoading?: boolean;
  statsError?: string | null;
  archiveError?: string | null;
  emptyLabel?: string;
  onSearchChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onNavigate?: (href: string) => void;
};
```

The component should not fetch data. It should only render data. Fetching stays in `ArchivePage`.

#### `ArchiveMasthead`

This can be a private subcomponent inside `ArchiveExplorer` or a separate molecule if it becomes reusable. It combines `PublicPageHeader`, explanatory text, and `ArchiveStats`.

Pseudocode:

```tsx
function ArchiveMasthead({ kicker, title, description, stats, statsError }) {
  return (
    <section data-section="archive-masthead" data-pyxis-component="archive-masthead">
      <div data-pyxis-part="copy">
        <PublicPageHeader kicker={kicker} title={title} />
        <p>{description}</p>
      </div>
      <div data-pyxis-part="metrics">
        {stats ? <ArchiveStats stats={stats} /> : null}
        {statsError ? <p role="status">{statsError}</p> : null}
      </div>
    </section>
  );
}
```

#### `ArchiveCommandBar`

This can wrap the existing `ArchiveSearchFilters`, or it can be a refactor of that component. The important design change is that search, result label, and year chips should be perceived as one control group.

Option A: refactor `ArchiveSearchFilters` in place.

Option B: add `ArchiveCommandBar` and make it call `ArchiveSearchFilters` internally.

Recommendation: use **Option B** if we want the old component to remain available and low-risk. Use **Option A** if we are confident this is the only archive filter style we need.

Suggested path for Option B:

```text
web/packages/pyxis-components/src/public/molecules/ArchiveCommandBar/ArchiveCommandBar.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveCommandBar/ArchiveCommandBar.css
web/packages/pyxis-components/src/public/molecules/ArchiveCommandBar/ArchiveCommandBar.stories.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveCommandBar/index.ts
```

Suggested props:

```ts
export type ArchiveCommandBarProps = ArchiveSearchFiltersProps & {
  tone?: 'plain' | 'raised';
};
```

### Data transformation stays in the page

`ArchivePageView` can keep pure helper functions:

```ts
function groupShowsByYear(shows: ArchivedShow[]): ArchiveGroup[]
function getArchiveYears(shows: ArchivedShow[]): string[]
function getShowYear(show: ArchivedShow): number
function toArchiveListShow(show: ArchivedShow): ArchiveShow
function formatArchiveDate(date: string): string
```

Then the page becomes simpler:

```tsx
export function ArchivePageView(props: ArchivePageViewProps) {
  const navigate = useNavigate();
  const years = getArchiveYears(props.shows);
  const filteredShows = filterShowsByYear(props.shows, props.selectedYear);
  const groups = groupShowsByYear(filteredShows).map(toExplorerGroup);

  return (
    <main className="pyxis-public-page pyxis-archive-page" data-page="archive">
      <div className="pyxis-public-page__inner">
        <ArchiveExplorer
          kicker={props.headerKicker}
          title={props.headerTitle}
          description="Past nights, recaps, and attendance traces from the Pyxis room."
          stats={props.stats}
          years={years}
          activeYear={props.selectedYear}
          search={props.search}
          resultLabel={resultLabel}
          groups={groups}
          isLoading={props.isLoading}
          archiveError={props.archiveError}
          statsError={props.statsError}
          emptyLabel={buildEmptyLabel(props.search, props.selectedYear)}
          onSearchChange={props.onSearchChange}
          onYearChange={props.onYearChange}
          onNavigate={navigate}
        />
      </div>
    </main>
  );
}
```

The important rule: `ArchiveExplorer` renders; `ArchivePageView` adapts API data.

## CSS and theming approach

The public components use a stable part selector contract:

```ts
pyxisPart('archive-show-row')
pyxisPart('archive-show-row', 'date')
```

This emits:

```html
data-pyxis-component="archive-show-row" data-pyxis-part="date"
```

Continue this pattern. It makes visual-diff selectors and themed CSS stable.

### Token rules

Use tokens from:

```text
web/packages/pyxis-components/src/tokens/tokens.css
```

Prefer:

```css
color: var(--color-text-primary);
border-color: var(--color-border);
background: var(--color-surface-raised);
padding: var(--space-5);
border-radius: var(--radius-lg);
font-family: var(--font-display);
```

Avoid:

```css
color: #333;
padding: 19px;
font-family: Georgia;
```

Existing components still have some historical hardcoded values such as `#EAE7E0`. When touching those files, it is acceptable to migrate them to component variables backed by global tokens:

```css
:where([data-pyxis-component='archive-command-bar'][data-pyxis-part='root']) {
  --pyxis-archive-command-bg: var(--color-surface-raised);
  --pyxis-archive-command-border-color: var(--color-border);
}
```

### Proposed CSS structure

`ArchiveExplorer.css` should define layout, not low-level row typography.

```css
:where([data-pyxis-component='archive-explorer'][data-pyxis-part='root']) {
  display: grid;
  gap: var(--space-8);
  padding-block: var(--space-8) var(--space-10);
}

:where([data-pyxis-component='archive-explorer'][data-pyxis-part='masthead']) {
  align-items: end;
  border-bottom: 1px solid var(--color-border);
  display: grid;
  gap: var(--space-7);
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr);
  padding-bottom: var(--space-7);
}

:where([data-pyxis-component='archive-explorer'][data-pyxis-part='years']) {
  display: grid;
  gap: var(--space-9);
}

@media (max-width: 760px) {
  :where([data-pyxis-component='archive-explorer'][data-pyxis-part='masthead']) {
    grid-template-columns: 1fr;
  }
}
```

`ArchiveCommandBar.css` should make controls one surface:

```css
:where([data-pyxis-component='archive-command-bar'][data-pyxis-part='root']) {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
}

:where([data-pyxis-component='archive-command-bar'][data-pyxis-part='top-row']) {
  align-items: center;
  display: grid;
  gap: var(--space-3);
  grid-template-columns: minmax(0, 1fr) auto;
}
```

On mobile, the result label should move below the input or become part of the chip row:

```css
@media (max-width: 640px) {
  :where([data-pyxis-component='archive-command-bar'][data-pyxis-part='top-row']) {
    grid-template-columns: 1fr;
  }

  :where([data-pyxis-component='archive-command-bar'][data-pyxis-part='years']) {
    overflow-x: auto;
    padding-bottom: var(--space-1);
  }
}
```

## Accessibility requirements

The archive page is public. The redesign must preserve or improve accessibility.

Required behavior:

- The search input must have an accessible name, not only a placeholder.
- Year chips must remain buttons with `aria-pressed`.
- The result count should be announced politely when it changes if practical.
- Archive rows must remain links with real `href` values.
- React Router interception should preserve native link behavior for cmd/ctrl/shift/middle-click.
- Loading state should use `aria-busy` on the results region.
- Error state should use `role="alert"`.
- Empty state should be visible text, not only an icon.

Add a real label for the search input. A visually hidden label is acceptable if the visual design should stay compact:

```tsx
<label className="sr-only" htmlFor={searchId}>Search archive</label>
<input id={searchId} ... />
```

If the project does not yet have an `sr-only` utility in public CSS, add one carefully to global public styles:

```css
.sr-only {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

## Storybook strategy

Storybook should be the main design surface. Do not tune this only in live Vite.

### Existing story file

```text
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
```

Current stories:

```text
Public Site/Pages/Archive/Desktop
Public Site/Pages/Archive/FromProps
Public Site/Pages/Archive/Mobile
```

### Add page stories

Add these stories to `ArchivePage/Page.stories.tsx`:

```text
DesktopRedesigned
MobileRedesigned
OneYearOnly
NoResultsAfterSearch
StatsUnavailable
ArchiveUnavailable
DenseArchiveManyYears
```

`DesktopRedesigned` and `MobileRedesigned` may replace the existing `Desktop` and `Mobile` once the redesign is accepted. During implementation, keep old and new if helpful.

Example story skeleton:

```tsx
export const NoResultsAfterSearch: Story = {
  render: () => {
    const [search, setSearch] = useState('zz-no-match');
    const [selectedYear, setSelectedYear] = useState('All');

    return (
      <div data-story="pyxis-public-page" data-story-name="archive-no-results" style={{ width: publicDesktopArgs.width, minHeight: publicDesktopArgs.minHeight, background: '#fff' }}>
        <ArchivePageView
          shows={prototypeArchiveShows}
          stats={prototypeArchiveStats}
          search={search}
          selectedYear={selectedYear}
          onSearchChange={setSearch}
          onYearChange={setSelectedYear}
        />
      </div>
    );
  },
  parameters: { viewport: { defaultViewport: 'pyxisDesktop' } },
};
```

### Add component stories

Add stories for new components:

```text
Public Site/Organisms/ArchiveExplorer/Default
Public Site/Organisms/ArchiveExplorer/Mobile
Public Site/Organisms/ArchiveExplorer/NoResults
Public Site/Organisms/ArchiveExplorer/StatsError
Public Site/Molecules/ArchiveCommandBar/Default
Public Site/Molecules/ArchiveCommandBar/ManyYears
Public Site/Molecules/ArchiveCommandBar/Mobile
```

The component stories should not use RTK Query. Pass plain props.

### Interaction story

Add at least one play function that proves the year chips are still wired:

```tsx
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByRole('button', { name: '2025' }));
  await expect(await canvas.findByText(/shows in 2025/i)).toBeInTheDocument();
}
```

## Visual-diff strategy

The archive page already appears in the public visual spec:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

Current target:

```yaml
- page: archive
  variant: desktop
  priority: closest-to-acceptance
  prototypePath: /standalone/public/archive.html
  storyId: public-site-pages-archive--desktop
  sections:
    - name: page
      original: '#root'
      react: '[data-story-frame="pyxis-page-shell"]'
    - name: content
      original: '[data-page="archive"]'
      react: '[data-page="archive"]'
```

For the redesign, add more stable subregion targets after the new parts exist:

```yaml
sections:
  - name: masthead
    original: '[data-section="archive-header"]'
    react: '[data-section="archive-masthead"]'
  - name: command-bar
    original: '[data-section="archive-filters"]'
    react: '[data-section="archive-command-bar"]'
  - name: years
    original: '[data-section="archive-years"]'
    react: '[data-section="archive-years"]'
```

Because this is a redesign, not strict prototype parity, the visual-diff result may not reach low pixel difference against the older prototype. That is acceptable if the operator approves the new direction. The important thing is to capture stable screenshots for regression review.

Recommended workflow:

1. Build the new Storybook stories.
2. Run focused visual comparisons for archive content, not every public page.
3. Inspect `diff_only.png`, then `right_region.png`, then `left_region.png`.
4. Save review artifacts under the ticket `sources/` directory if scripts are created.
5. Once approved, update visual-diff accepted differences or target expectations.

## Implementation plan

### Phase 1: Create component scaffolding

Create:

```text
web/packages/pyxis-components/src/public/organisms/ArchiveExplorer/
web/packages/pyxis-components/src/public/molecules/ArchiveCommandBar/
```

Each folder should have:

```text
Component.tsx
Component.css
Component.stories.tsx
index.ts
```

Export them through:

```text
web/packages/pyxis-components/src/index.ts
```

Pseudocode:

```tsx
export const ArchiveExplorer = (props: ArchiveExplorerProps) => {
  return (
    <section {...pyxisPart('archive-explorer')} className="pyxis-archive-explorer">
      <div {...pyxisPart('archive-explorer', 'masthead')} data-section="archive-masthead">
        <div {...pyxisPart('archive-explorer', 'copy')}>
          <PublicPageHeader kicker={props.kicker} title={props.title} />
          <p className="pyxis-archive-explorer__description">{props.description}</p>
        </div>
        {props.stats && <ArchiveStats stats={props.stats} />}
      </div>

      <ArchiveCommandBar
        years={props.years}
        active={props.activeYear}
        value={props.search}
        resultLabel={props.resultLabel}
        onSearchChange={props.onSearchChange}
        onYearChange={props.onYearChange}
      />

      <div {...pyxisPart('archive-explorer', 'years')} data-section="archive-years" aria-busy={props.isLoading || undefined}>
        {props.groups.map((group) => (
          <YearGroup key={group.year} year={group.year} showCount={group.shows.length}>
            <ArchiveShowList shows={group.shows} onNavigate={props.onNavigate} />
          </YearGroup>
        ))}
      </div>
    </section>
  );
};
```

### Phase 2: Move page composition into `ArchiveExplorer`

Update:

```text
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
```

The page should still own:

- `useArchive()`;
- `useArchiveStats()`;
- selected year local state;
- search local state;
- API errors;
- grouping helpers;
- `useNavigate()`.

The new component should own:

- masthead layout;
- command bar layout;
- year timeline rendering;
- empty/error placement.

### Phase 3: Tune CSS in Storybook

Start with desktop. Get the page to feel right at `920px` wide because the public page shell is `min(100%, 920px)`.

Then tune mobile at the existing `pyxisMobile` viewport. Watch for:

- year chips wrapping awkwardly;
- search input becoming too narrow;
- stats becoming unreadable;
- row CTA consuming too much horizontal space;
- large year headings crowding row content.

A practical mobile row layout is:

```text
Jan 18
Artist name
Ambient · recap →
```

That can be handled in `ArchiveShowRow.css` with a media query:

```css
@media (max-width: 640px) {
  :where([data-pyxis-component='archive-show-row'][data-pyxis-part='root']) {
    align-items: start;
    grid-template-columns: 64px minmax(0, 1fr);
  }

  :where([data-pyxis-component='archive-show-row'][data-pyxis-part='tag']) {
    grid-column: 2;
  }

  :where([data-pyxis-component='archive-show-row'][data-pyxis-part='cta']) {
    grid-column: 2;
  }
}
```

### Phase 4: Add stories and interaction checks

Add all page and component stories listed earlier. Use `prototypeArchiveShows` and `prototypeArchiveStats` from:

```text
web/packages/pyxis-user-site/src/pages/storybook.tsx
```

or create local archive fixtures if component stories live in `pyxis-components`.

If component stories cannot import public-site fixtures because that would create a package dependency cycle, define local fixtures in the component story file.

### Phase 5: Run validation

Run:

```bash
cd web/packages/pyxis-components && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec vite build
```

If touched backend code, also run:

```bash
go test ./... -count=1
```

For this redesign, backend code should not be touched.

### Phase 6: Visual review

Run existing public visual workflow or a focused archive target. If creating scripts, store them under this ticket:

```text
ttmp/2026/04/29/PYXIS-ARCHIVE-VISUAL-REDESIGN--redesign-show-archive-page-visual-hierarchy-and-filtering-ux/scripts/
```

Save evidence under:

```text
ttmp/2026/04/29/PYXIS-ARCHIVE-VISUAL-REDESIGN--redesign-show-archive-page-visual-hierarchy-and-filtering-ux/sources/
```

## Acceptance criteria

The redesign is complete when all of these are true:

- `/archive` no longer feels like several independent forms stacked vertically.
- Search, result count, and year selection read as one archive command bar.
- Stats feel integrated into the masthead or archive summary, not like a separate dashboard block.
- Year sections read as archive chapters.
- Existing archive links still navigate with React Router while preserving native link behavior.
- The page has Storybook coverage for desktop, mobile, empty, error, dense, and filtered states.
- New components use `pyxisPart()` and token-backed CSS variables.
- `pyxis-components` typecheck passes.
- `pyxis-user-site` typecheck and Vite build pass.
- Visual review artifacts are captured or accepted by reviewer.

## Intern checklist

Before coding:

- [ ] Read `ArchivePage/Page.tsx` and trace where `shows`, `stats`, `search`, and `selectedYear` come from.
- [ ] Read `ArchiveSearchFilters.tsx`, `ArchiveStats.tsx`, `YearGroup.tsx`, and `ArchiveShowRow.tsx`.
- [ ] Open the existing archive Storybook stories and understand the difference between route-backed and props-backed stories.
- [ ] Confirm no backend changes are needed.

While coding:

- [ ] Create `ArchiveExplorer` as a pure rendering component.
- [ ] Create or refactor `ArchiveCommandBar` so the controls feel like one surface.
- [ ] Keep `ArchivePageView` responsible for data transformation.
- [ ] Use `pyxisPart()` for stable component and part selectors.
- [ ] Use token variables from `tokens.css`.
- [ ] Add stories before trying to tune the live Vite page.

After coding:

- [ ] Run component and public-site typechecks.
- [ ] Run public-site Vite build.
- [ ] Inspect desktop and mobile Storybook stories.
- [ ] Inspect live `/archive` in public Vite.
- [ ] Capture visual review artifacts if requested.
- [ ] Update this ticket diary, tasks, and changelog.

## Common mistakes to avoid

- Do not fetch archive data inside `ArchiveExplorer`. It should remain a pure component.
- Do not hardcode colors when a token exists.
- Do not remove real `href` values from archive rows.
- Do not hide result counts; they are important feedback after search/filter changes.
- Do not make year chips into plain divs; they are interactive buttons and need `aria-pressed`.
- Do not tune only desktop. The archive is likely to be browsed on mobile.
- Do not duplicate archive fixtures across many files if one shared fixture location can serve the stories.

## Open questions

1. Should the public archive include a short editorial description under the title, and what should the exact copy be?
2. Should archive stats remain four equal metrics, or should total shows and total draw be visually emphasized more than years/artists?
3. Should the archive eventually include featured recap cards with photos/flyers, or should v1 remain a typographic ledger?
4. Should year filtering happen entirely client-side as today, or should the backend eventually accept a `year` query parameter for large archives?
5. Should archive recap pages become richer than the current minimal recap view?

## Recommended first implementation slice

Start small. The first slice should not try to invent featured cards or new backend fields.

Implement only:

1. `ArchiveCommandBar` that visually unifies search, result count, and year chips.
2. `ArchiveExplorer` that lays out masthead, stats, command bar, and years.
3. Page wiring from `ArchivePageView` into `ArchiveExplorer`.
4. Storybook states for desktop, mobile, no results, stats unavailable, archive unavailable.
5. CSS tuning for desktop and mobile.

That slice directly addresses the user complaint: many forms under one another. It improves the conceptual page structure without expanding scope.

## References

Primary implementation files:

```text
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.css
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveShowList/ArchiveShowList.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveShowRow/ArchiveShowRow.tsx
web/packages/pyxis-components/src/public/molecules/YearGroup/YearGroup.tsx
web/packages/pyxis-components/src/tokens/tokens.css
web/packages/pyxis-components/src/utils/parts.ts
```

API files:

```text
web/packages/pyxis-user-site/src/api/endpoints.ts
web/packages/pyxis-user-site/src/api/hooks.ts
web/packages/pyxis-user-site/src/api/publicApi.ts
pkg/server/public.go
```

Storybook and visual-diff references:

```text
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```
