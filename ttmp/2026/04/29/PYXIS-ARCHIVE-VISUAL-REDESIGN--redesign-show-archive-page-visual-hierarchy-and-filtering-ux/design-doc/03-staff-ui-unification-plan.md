---
Title: Staff UI unification plan after Post-show log
Ticket: PYXIS-ARCHIVE-VISUAL-REDESIGN
Status: active
Topics:
    - frontend
    - staff-app
    - storybook
    - design-system
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - web/packages/pyxis-app/src/components/molecules/MetricCard/MetricCard.tsx
    - web/packages/pyxis-app/src/components/molecules/BookingCard/BookingCard.css
    - web/packages/pyxis-app/src/components/organisms/Shows/ShowsFilterBar/ShowsFilterBar.tsx
    - web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/AttendancePanel.tsx
Summary: "Deferred design-system plan for unifying recurring staff UI primitives discovered while planning the Post-show log redesign."
LastUpdated: 2026-04-29T13:30:00-04:00
WhatFor: "Use later, after the first Post-show log implementation slice is proven, to migrate repeated staff UI patterns into shared components."
WhenToUse: "Read before extracting generic staff components such as AppCard, StatusBadge, MetricsGrid, RouteListToolbar, MetadataStrip, NoteBlock, or FieldError."
---

# Staff UI unification plan after Post-show log

## Executive summary

The Post-show log redesign exposes several repeated staff-app patterns: cards, status labels, metrics, metadata rows, note blocks, validation errors, and search/filter toolbars. These patterns already exist in fragments across Shows, Bookings, Attendance, Audit Log, Dashboard, Settings, and Discord pages. They should be unified, but not all at once.

The recommended strategy is phased:

1. Build only the small primitives required for the first Post-show log slice.
2. Prove them in Storybook with the new Post-show log components.
3. Migrate other pages gradually after the page is approved.

Do not create a giant generic `ResourceListPage`. The route pages have different workflows. Unify the small visual primitives, not the whole page architecture.

## Components to unify later

### `AppCard`

Problem: attendance currently reuses `BookingCard.css`, which means the booking card visual style is functioning as a generic staff card.

Target:

```tsx
<AppCard tone="warning" density="comfortable">
  ...
</AppCard>
```

Reusable in Post-show log, Bookings, Artists, Calendar, Discord, and Settings.

### `StatusBadge`

Problem: every page has statuses but styling is ad hoc.

Target:

```tsx
<StatusBadge label="Needs log" tone="warning" />
<StatusBadge label="Logged" tone="success" />
<StatusBadge label="Incident" tone="danger" />
```

Reusable in Shows, Bookings, Post-show log, Discord status, Settings setup state, and Audit Log.

### `MetricTile` / `MetricsGrid`

Problem: `AttendanceStat`, `MetricCard`, and dashboard metric CSS overlap conceptually.

Target:

```tsx
<MetricsGrid variant="compact">
  <MetricTile label="Needs log" value={3} tone="warning" />
  <MetricTile label="Logged" value={18} tone="success" />
</MetricsGrid>
```

The repo already has `MetricCard`; the unification work should decide whether to rename, wrap, or migrate it.

### `MetadataStrip`

Problem: compact fact rows are repeated by hand.

Target:

```tsx
<MetadataStrip items={[{ label: 'Draw', value: 61 }, { label: 'Incident', value: 'No' }]} />
```

Reusable in Post-show log cards, Show Detail, Booking Review, Calendar inspector, and Audit Log.

### `NoteBlock`

Problem: notes, messages, riders, incident notes, and metadata previews appear across pages with local markup.

Target:

```tsx
<NoteBlock label="Show notes" value={showNotes} empty="No show notes." />
```

### `RouteListToolbar`

Problem: Shows, Artists, Attendance/Post-show log, Audit Log, and Bookings all combine search, filters, counts, sorting, and actions differently.

Target:

```tsx
<RouteListToolbar
  search={{ value, label, placeholder, onChange }}
  filters={{ value, options, onChange }}
  resultLabel="23 logs"
/>
```

This should be extracted after the Post-show log toolbar proves the shape.

## Phased plan

### Phase 1: Build local primitives for Post-show log

Create:

```text
AppCard
StatusBadge
MetadataStrip
NoteBlock
FieldError
```

Use them immediately in:

```text
PostShowLogEntryCard
PostShowLogPanel
```

### Phase 2: Capture Storybook baselines

Create stories for each primitive and each Post-show log state. The approved Storybook screenshots become the baseline because there is no standalone prototype.

### Phase 3: Migrate obvious consumers

After approval, migrate:

1. Post-show log fully.
2. Shows status displays.
3. Booking cards and queue rows.
4. Audit log filters/metadata.
5. Settings and Discord cards.

## Rule of thumb

If a component knows the domain words `draw`, `incident`, `show notes`, or `post-show notes`, keep it Post-show-log-specific. If it only knows `tone`, `label`, `value`, `children`, or `items`, it is probably reusable.
