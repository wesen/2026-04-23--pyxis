# React Application Decomposition and Component-System Reuse Guide

Use this guide before building or refactoring a React application page. It explains how to split a feature into pages, organisms, molecules, atoms, shared primitives, props, stories, and RTK Query boundaries.

It complements:

```text
docs/playbooks/06-react-widget-folder-storybook-css-organization.md
```

That guide defines where files go. This guide defines what to extract, when to reuse existing component-system widgets, and how to decompose a coherent app across multiple pages.

## Goals

A well-decomposed React app should have:

- pages that own routing and data fetching,
- organisms that own page sections,
- molecules that own reusable domain rows/cards/chips,
- atoms that own small reusable UI/domain indicators,
- shared component-system primitives reused wherever possible,
- named exported prop types for every reusable widget,
- Storybook stories for meaningful states,
- CSS owned by the widget or primitive that uses it,
- visual-diff selectors that map to stable components and sections.

## The core decision tree

When you see UI in a prototype or existing page, classify it in this order.

### 1. Is it already a shared component-system primitive?

Check `pyxis-components` first.

Available generic primitives include:

```text
Atoms:
  Button
  Icon / IconButton
  Avatar
  Badge
  Tag
  Input
  Select
  Textarea

Molecules:
  Card
  CardHead
  Field
  Stat
  Table
  Empty

Organisms:
  TopBar
  Modal
```

If the UI is generic, reuse or wrap the shared component.

Examples:

- Button-like thing → use `Button`.
- Text input → use `Input` inside `Field`.
- Select dropdown → use `Select`.
- Generic badge/pill → use or wrap `Badge` / `Tag`.
- Generic metric/stat block → use or wrap `Stat`.
- Generic empty state → use or wrap `Empty`.
- Generic modal → use or wrap `Modal`.
- Generic card surface → use or wrap `Card` / `CardHead`.
- Generic data table → use or wrap `Table` if its API fits.

If the shared primitive is close but not flexible enough, prefer one of these before duplicating:

1. Extend the shared component API in `pyxis-components`.
2. Create an app-local wrapper around the shared primitive.
3. Only create a fully app-local duplicate if visual parity or semantics require it.

Record non-reuse decisions in the diary or component comments.

### 2. Is it a small reusable app-specific visual marker? Extract an atom.

An atom is small, usually not composed of other app widgets, and reusable across multiple molecules/organisms.

Extract an app atom when it encodes app/domain semantics that generic `pyxis-components` should not know about.

Good app atom examples:

```text
StatusDot       — app status tone indicator
StatusPill      — app status label + dot, possibly a Badge wrapper
DateChip        — compact show date shape
AgeBadge        — show age restriction marker, possibly a Tag wrapper
DrawProgress    — expected draw/capacity progress bar
```

Questions to ask:

- Does this appear in multiple molecules/organisms?
- Is it smaller than a card/row?
- Does it have a small set of variants?
- Can it be tested visually in isolation?
- Is it app-specific enough not to belong in `pyxis-components`?

If yes, make it an atom.

### 3. Is it a reusable row/card/chip around one domain object? Extract a molecule.

A molecule combines atoms and shared primitives into a reusable unit. It usually accepts one domain object or a small primitive prop set.

Good app molecule examples:

```text
BookingCard          — one booking request summary/action card
BookingQueueRow      — one processed booking table row
ShowTableRow         — one show table row
TodayShowCard        — one show summary card
ActivityFeedItem     — one audit/activity item
ArtistCard           — one artist summary card
CalendarEventChip    — one event chip in calendar grid/list
SettingsToggleRow    — one settings row
```

Questions to ask:

- Does it represent one domain item?
- Will multiple organisms/pages render a list of it?
- Does it compose atoms/shared primitives?
- Can it be storybooked with default/long/status variants?
- Does it avoid route-level data fetching?

If yes, make it a molecule.

### 4. Is it a coherent page section? Extract an organism.

An organism is a page section or large widget. It usually maps to a prototype `data-section` and a visual-diff target.

Good app organism examples:

```text
DashboardHero
DashboardMetricsGrid
DashboardUpcomingPanel
DashboardAttentionPanel
ShowsConfirmedPanel
ShowsArchivedPanel
CalendarMonthPanel
CalendarAgenda
BookingsInboxPanel
BookingsProcessedPanel
BookingReviewRequestPanel
ShowDetailInfoPanel
```

Questions to ask:

- Does it correspond to a section in the prototype?
- Would the page be clearer if this section had a name?
- Does it compose multiple molecules/atoms?
- Does it need its own Storybook stories?
- Does it have section-level visual parity requirements?

If yes, make it an organism.

### 5. Is it route orchestration or data fetching? Keep it in a page/container.

Pages should own:

- route selection,
- RTK Query hooks,
- loading/error/empty route states,
- choosing which organisms appear,
- page-level layout that is not reusable,
- URL params and navigation.

Pages should not own:

- detailed card/table row markup,
- repeated section internals,
- individual status/date/metric rendering,
- raw form control groups that could be named organisms.

## Layer responsibilities

```text
Page
  Fetches data and handles route state.
  Composes organisms.
  Passes typed props.

Organism
  Owns a page section.
  Filters/sorts section-local data if needed.
  Composes molecules/atoms/shared primitives.
  Exposes section-level props and stories.

Molecule
  Owns one reusable domain row/card/item.
  Composes atoms/shared primitives.
  Does not fetch data.

Atom
  Owns a small domain indicator/control shape.
  Has a small prop surface and variants.

pyxis-components
  Owns generic primitives and public reusable widgets.
```

## Component-system reuse policy

### Reuse by default

Before adding a new app component, check `pyxis-components/src/index.ts` and the component folders.

Use shared components for:

```text
Button actions              -> Button
Iconography                 -> Icon / IconButton
User initials/headshots     -> Avatar
Inputs                      -> Input
Selects                     -> Select
Textareas                   -> Textarea
Field label/hint/error      -> Field
Generic badges/tags         -> Badge / Tag
Generic stat display        -> Stat
Generic card surface        -> Card / CardHead
Generic empty state         -> Empty
Generic modal shell         -> Modal
Generic top bar             -> TopBar, if API fits
Generic data table          -> Table, if API fits
```

### Wrap when the app needs a domain API

If the app needs custom naming or domain props, create a thin wrapper.

Example:

```tsx
export type StatusPillProps = {
  tone: AppStatusTone;
  children: React.ReactNode;
};

export function StatusPill({ tone, children }: StatusPillProps) {
  return <Badge tone={mapStatusTone(tone)}>{children}</Badge>;
}
```

The app API remains domain-specific, but the generic visuals come from the component system.

### Duplicate only with a reason

It is acceptable to keep an app-local component when:

- it encodes app-specific semantics,
- it needs exact prototype visual parity not supported by the shared primitive,
- it uses app-specific data hooks/visual selectors,
- the shared primitive lacks needed API and changing it would be too broad for the current task.

But document the reason.

Example decision note:

```text
MetricCard remains app-local for now because dashboard metric cards have prototype-specific accent stripe, trend placement, and compact mobile behavior. Revisit after Stat supports slot/stripe/trend variants.
```

## Current pyxis-app reuse audit checklist

Use this checklist in the next pass.

### Already reused well

- [ ] `Button` used for app actions.
- [ ] `Icon` used for iconography.
- [ ] `Avatar` used in shell footer.
- [ ] `PyxisLogo` / `PyxisMark` used for branding.
- [ ] `Field` + `Input` used in login/setup.

### Should be audited for reuse/wrapping

- [ ] `Panel` vs `Card` / `CardHead`.
- [ ] `MetricCard` vs `Stat`.
- [ ] `AttendanceStat` vs `Stat`.
- [ ] `StatusPill` / `AgeBadge` vs `Badge` / `Tag`.
- [ ] `ShowsTable`, processed bookings table, artist table vs `Table`.
- [ ] `.app-empty-state` vs `Empty`.
- [ ] `NewShowModal` vs `Modal`.
- [ ] `AppTopBar` vs `TopBar`.
- [ ] raw form controls in `NewShowModal` vs `Field` / `Input`.
- [ ] any future selects/textareas vs `Select` / `Textarea`.

Do not replace all at once. Review one cluster at a time and keep visual parity evidence.

## Extraction across multiple pages

When multiple pages share a concept, extract from the common concept, not from the first page that happened to use it.

### Shows, Dashboard, Calendar

Shared concepts:

```text
show status       -> StatusDot / StatusPill
show date         -> DateChip
expected draw     -> DrawProgress
show row          -> ShowTableRow
compact show card -> TodayShowCard
show table        -> ShowsTable
section shell     -> Panel
calendar event    -> CalendarEventChip
```

Page/organism composition:

```text
DashboardUpcomingPanel
  desktop: ShowsTable variant="dashboard"
  mobile: TodayShowCard[]

ShowsConfirmedPanel
  ShowsTable variant="full"

ShowsArchivedPanel
  ShowsTable variant="archived"

CalendarMonthPanel
  CalendarEventChip[]

ShowDetailHero
  StatusDot + show fields
```

This avoids one-off dashboard rows, one-off shows rows, and one-off calendar event labels drifting apart.

### Bookings and Booking Review

Shared concepts:

```text
booking status       -> StatusPill
booking summary card -> BookingCard
booking table row    -> BookingQueueRow
request detail list  -> DetailList candidate
decision actions     -> BookingDecisionActions candidate
```

Page/organism composition:

```text
BookingsInboxPanel
  BookingCard[]

BookingsProcessedPanel
  BookingQueueRow[]

BookingReviewRequestPanel
  DetailList candidate

BookingReviewDatePanel
  date availability status

BookingReviewPage
  BookingDecisionActions candidate
```

### Settings and Discord

Shared concepts:

```text
settings row       -> SettingsToggleRow
channel row        -> DiscordChannelRow or SettingsRow variant
settings summary   -> SettingsSummary candidate
```

If two rows share the same visual layout but differ in data, create a generic molecule with typed variants.

## When to extract during implementation

### Extract immediately when:

- the same markup appears twice,
- a section needs its own visual-diff target,
- the user asks to tune it visually,
- the component needs Storybook coverage,
- it has independent loading/empty/error states,
- it is likely to receive RTK Query data later.

### Defer extraction when:

- it is truly page-only and unlikely to recur,
- the prototype is still being explored,
- extracting would require guessing a premature API,
- the markup is a small one-off layout wrapper.

Even when deferring, leave a note in tasks/diary if it is a likely future organism.

## Prop design rules

Every reusable widget should export a named props type.

### Atoms

Atoms usually accept primitive props.

```ts
export type AgeBadgeProps = {
  children: React.ReactNode;
};
```

```ts
export type DrawProgressProps = {
  value: number;
  max: number;
  label?: string;
};
```

### Molecules

Molecules can accept a domain object when tightly coupled to the domain.

```ts
export type BookingCardProps = {
  booking: BookingRequest;
  actions?: React.ReactNode;
};
```

Or accept primitive props when reusable across domains.

```ts
export type ActivityFeedItemProps = {
  actor: string;
  action: string;
  time: string;
  tone?: StatusTone;
};
```

### Organisms

Organisms accept arrays/domain data and callbacks.

```ts
export type BookingsInboxPanelProps = {
  bookings: BookingRequest[];
  onApprove?: (booking: BookingRequest) => void;
  onDecline?: (booking: BookingRequest) => void;
  onHold?: (booking: BookingRequest) => void;
};
```

Organisms should not call route-level RTK Query hooks unless explicitly designed as containers.

### Pages

Pages call RTK Query and pass typed props down.

```tsx
export function BookingsPage() {
  const { data, isLoading, error } = useGetBookingsQuery();
  if (isLoading) return <BookingsPageSkeleton />;
  if (error) return <BookingsPageError />;
  return <BookingsInboxPanel bookings={data ?? []} />;
}
```

## Callback and action rules

When preparing for real app wiring, avoid hard-coding button behavior inside molecules.

Instead of:

```tsx
<Button>Approve</Button>
```

Prefer:

```tsx
export type BookingCardProps = {
  booking: BookingRequest;
  onApprove?: (booking: BookingRequest) => void;
  onDecline?: (booking: BookingRequest) => void;
  onHold?: (booking: BookingRequest) => void;
};
```

Then:

```tsx
<Button onClick={() => onApprove?.(booking)}>Approve</Button>
```

Stories can pass mock callbacks:

```ts
args: {
  onApprove: action('approve'),
}
```

If Storybook action addon is not configured, use a no-op callback or console stub.

## Loading, empty, and error boundaries

Plan states at the right layer.

```text
Page loading/error:
  full route skeleton or route error

Organism empty:
  section-specific empty state, e.g. no pending bookings

Molecule missing optional fields:
  graceful placeholder, e.g. notes absent, draw unknown
```

Story coverage should include these states.

## Story coverage matrix

Every reusable widget should have enough stories to make the API clear.

### Atom stories

- default,
- variants/tones,
- disabled/empty if relevant,
- long label if relevant.

### Molecule stories

- default,
- all important status variants,
- long content,
- missing optional fields,
- action callbacks if applicable,
- narrow/mobile if layout changes.

### Organism stories

- default,
- empty,
- dense/many items,
- long content,
- mobile/narrow,
- loading/error if organism owns those states,
- important domain variants.

### Page stories

- desktop,
- mobile,
- loading,
- error,
- empty route state,
- dense/realistic route state.

Do not add fake variants that the component does not support. Add the prop/API first or skip the story.

## CSS and visual parity workflow during decomposition

When splitting a page:

1. Move code without changing values.
2. Move CSS into the owning widget without changing values.
3. Run typecheck.
4. Restart Storybook after large moves.
5. Verify isolated stories render.
6. Run focused visual smoke for any story ID used by visual specs.
7. Only then tune CSS or convert values to tokens.

Do not combine these in one step:

```text
move files + rewrite props + switch to shared component + retune CSS
```

That creates too many possible regression causes.

## RTK Query decomposition pattern

### Before

Prototype/checkpoint pages often start like this:

```tsx
export function BookingsPage() {
  const { data: bookings = seedBookings } = useGetBookingsQuery();
  return (
    <AppShell ...>
      <div className="app-bookings-layout">
        <div>
          <BookingsInboxPanel bookings={bookings}/>
          <BookingsProcessedPanel bookings={bookings}/>
        </div>
        <BookingsInsightsPanel/>
      </div>
    </AppShell>
  );
}
```

### Better next step

Create a page-specific route component with clear data state handling:

```tsx
export function BookingsPage() {
  const result = useGetBookingsQuery();
  return <BookingsRoute query={result} />;
}
```

Then:

```tsx
export type BookingsRouteProps = {
  query: QueryState<BookingRequest[]>;
};

export function BookingsRoute({ query }: BookingsRouteProps) {
  if (query.isLoading) return <BookingsLoading />;
  if (query.error) return <BookingsError error={query.error} />;

  const bookings = query.data ?? [];
  return (
    <AppShell ...>
      <BookingsLayout
        inbox={<BookingsInboxPanel bookings={bookings} />}
        processed={<BookingsProcessedPanel bookings={bookings} />}
        insights={<BookingsInsightsPanel />}
      />
    </AppShell>
  );
}
```

This makes stories easy:

```tsx
export const Loading = { render: () => <BookingsRoute query={loadingQuery} /> };
export const Empty = { render: () => <BookingsRoute query={emptyQuery} /> };
export const Error = { render: () => <BookingsRoute query={errorQuery} /> };
```

## Deciding whether to promote app widgets into pyxis-components

Promote a widget from `pyxis-app` to `pyxis-components` when:

- it is generic enough for multiple packages/apps,
- it has no staff-app-specific data model,
- it can be themed via props/CSS variables,
- it has stable stories and tests,
- it does not require prototype-specific app hacks.

Keep it in `pyxis-app` when:

- it depends on staff workflow language,
- it encodes Pyxis admin domain objects,
- it has route-specific visual-diff hooks,
- it is unlikely to be reused outside the staff app.

## Practical next-pass plan for pyxis-app

Use this exact order for the next cleanup pass.

### 1. Add named prop types

For every atom/molecule/organism:

- export `WidgetNameProps`,
- replace anonymous inline prop types,
- add callback props where actions are currently hard-coded,
- do not change behavior yet.

### 2. Add story states

For each widget, add stories for meaningful states.

Priority widgets:

```text
BookingCard
BookingsInboxPanel
BookingsProcessedPanel
ShowTableRow
ShowsTable
CalendarMonthPanel
CalendarAgenda
DashboardHero
DashboardMetricsGrid
Panel
MetricCard
StatusPill
DateChip
```

### 3. Reuse audit against pyxis-components

Review one cluster at a time:

```text
Stats cluster:
  MetricCard / AttendanceStat vs Stat

Surfaces cluster:
  Panel vs Card / CardHead

Tables cluster:
  ShowsTable / booking tables / ArtistRoster vs Table

States cluster:
  app-empty-state vs Empty

Overlays cluster:
  NewShowModal vs Modal

Shell cluster:
  AppTopBar vs TopBar

Badges cluster:
  StatusPill / AgeBadge vs Badge / Tag
```

For each cluster, decide:

- reuse now,
- wrap now,
- defer with reason,
- improve `pyxis-components` first.

### 4. Extract page inline sections

Login and setup currently have large inline markup. Extract them before serious app wiring.

Candidates:

```text
AuthMarquee
LoginPanel
SetupHeader
SetupProgress
SetupChannelList
SetupActionFooter
```

### 5. Split page CSS

Once page sections are extracted, move CSS from `pages.css` into page/widget folders.

### 6. Wire RTK Query states

After widget APIs are typed and stories exist, add real route loading/error/empty handling.

## Review checklist

Before approving a decomposition pass:

- [ ] No new generic primitive was created without checking `pyxis-components`.
- [ ] Every reusable widget exports a named props type.
- [ ] Widgets own their CSS and stories.
- [ ] Storybook titles mirror folder structure.
- [ ] Page components fetch data; widgets receive typed props.
- [ ] Important widgets have default/empty/long/mobile/status stories.
- [ ] Visual specs are updated if story IDs changed.
- [ ] Typecheck passes.
- [ ] Storybook was restarted after large file moves.
- [ ] Focused visual smoke ran for changed visual-spec targets.
