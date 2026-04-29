---
Title: Widget reuse and deprecation audit
Ticket: PYXIS-SHOW-EDIT-VISUAL-REDESIGN
Status: active
Topics:
  - pyxis
  - staff-app
  - design-system
  - react
  - storybook
DocType: reference
Intent: short-term
Summary: Initial audit of existing Pyxis app widgets to reuse, wrap, extend, or deprecate during the show edit modal/page redesign.
LastUpdated: 2026-04-29T19:00:00-04:00
---

# Widget reuse and deprecation audit

## Scope

This audit answers two questions for the show edit visual redesign:

1. Which existing widgets should the implementation reuse?
2. Which existing widgets become candidates for deprecation or replacement once the new show edit modal/page component set exists?

This is an initial implementation-planning audit. A future coding pass should confirm each decision while editing the actual components and stories.

## Existing widgets to reuse directly

### Shared component-system primitives

Use these from `pyxis-components` wherever their API fits:

- `Button` — all primary, secondary, outline, icon-left, and full-width actions.
- `Modal` — keep the modal shell/focus/backdrop behavior centralized.
- Input-like primitives (`Input`, `Select`, `Textarea`, `Field`) if their current APIs fit the app form layout.
- Generic icon primitives if a trash/upload/external/plus icon is needed.

Decision: reuse these before adding app-local controls. If a primitive lacks a small generic capability, prefer extending the primitive or wrapping it locally rather than duplicating styles.

### App atoms

Reuse:

- `StatusDot` — status dot and label mapping where compact status display is needed.
- `StatusPill` — status labels in cards and modal state copy.
- `AgeBadge` — compact age display if the edit page needs a display badge.
- `DateChip` — compact date display if used in a header/summary.
- `DrawProgress` — expected draw/capacity display if the new page includes a progress treatment.

Decision: no new status/age/date atoms should be introduced unless these are demonstrably insufficient.

### App molecules

Reuse or adapt:

- `NoteBlock` — good fit for staff notes/public description display cards if it supports title/body/visibility copy.
- `MetadataStrip` — possible fit for compact date/doors/age/price/genre metadata; audit during implementation.
- `StatusBadge` — possible fit for status-specific labels if `StatusPill` is not appropriate.
- `AppEmptyState` — use for empty lineup or missing flyer messaging if no more specific component is needed.
- `FieldError` — use for modal validation copy if field-specific errors are added.

Probably not directly applicable:

- `ShowTableRow` — list/table-specific, not the edit page layout.
- `TodayShowCard` — dashboard/calendar summary-specific.
- `CalendarEventChip`, booking/artist/settings rows — unrelated to show edit page.

### App organisms

Reuse or evolve:

- `NewShowModal` — primary modal organism to redesign; keep its external contract if possible.
- `FlyerField` — reuse for file input/preview behavior, or wrap it in a more visual `FlyerDropzone`/`ShowFlyerCard`.
- `Panel` — likely section/card shell for the show edit page if its visual API fits the reference.
- `ConfirmDialog` — use for destructive actions such as cancel show or delete flyer if those actions are implemented.
- `ShowDetailDiscordPanel` — likely reuse/evolve into the Discord card in the new left rail.
- `ShowDetailInfoPanel` — can be folded into or replaced by the new details/date/details section components.

## New widgets likely justified

### `ShowEditHeader`

A new organism is justified because the reference has a specific page command bar: back link, title, subtitle, preview/duplicate/save actions. This is page-section-specific and deserves its own story.

### `ShowEditRail`

A new organism is justified because the left rail groups flyer, readiness/status, and Discord state. It is a coherent page section and useful screenshot target.

### `ShowFlyerCard`

A new molecule/organism is likely justified because the edit page flyer treatment is not just a file input. It displays the current public asset plus replace/delete/readiness actions.

### `ShowStatusCard`

A new card may be justified if status helper copy/readiness rules become richer than `StatusPill` alone.

### `ShowFormSection`

A new molecule is likely justified for modal section wrappers: uppercase title, optional description/action, and consistent spacing.

### `ShowLineupRowEditor`

A new molecule is justified if lineup editing is kept in the modal. It represents one repeatable domain row with artist, role, start time, end time, and remove action.

### `ShowLineupSection`

A new organism is justified for both read-only detail and/or editable modal grouping because lineup has empty, many-row, long-label, and mobile states.

## Widgets that may be deprecated or reduced after redesign

### `ShowDetailHero`

Current location:

```text
web/packages/pyxis-app/src/components/organisms/ShowDetail/ShowDetailHero/
```

Current issue:

- It uses a poster placeholder and shared `pages.css` styles.
- The new reference wants a richer header plus separate flyer rail, not a hero with placeholder poster.

Likely outcome:

- Deprecate or replace with `ShowEditHeader` + `ShowEditRail`.
- Keep temporarily if still used by Storybook or other pages, but mark as legacy once route usage is removed.

### `ShowDetailInfoPanel`

Current location:

```text
web/packages/pyxis-app/src/components/organisms/ShowDetail/ShowDetailInfoPanel/
```

Current issue:

- It is a compact details list only: doors, price, draw/capacity, genre.
- The reference splits details into Basics, Date & Time, Details, Lineup, and Staff Notes.

Likely outcome:

- Replace with more explicit section organisms.
- Deprecate once no route/story needs the old compact panel.

### `ShowDetailDiscordPanel`

Current location:

```text
web/packages/pyxis-app/src/components/organisms/ShowDetail/ShowDetailDiscordPanel/
```

Current issue:

- It already resembles the Discord card but has older naming (`Posted to Discord`) and limited state.

Likely outcome:

- Reuse/evolve rather than deprecate immediately.
- Possibly rename or wrap as `ShowDiscordCard` after migration.

### `FlyerField`

Current location:

```text
web/packages/pyxis-app/src/components/organisms/FlyerField/
```

Current issue:

- It is form-input-oriented. The edit page needs an asset card; the modal needs a dropzone-like input.

Likely outcome:

- Keep core input/preview behavior.
- Wrap or split into:
  - `FlyerField` for form file selection; and
  - `ShowFlyerCard` for edit-page current asset/readiness/actions.
- Do not deprecate until the wrapper proves the old component is unused.

### Broad legacy barrels/files

Candidates to reduce over time:

```text
web/packages/pyxis-app/src/components/organisms/Panels.tsx
web/packages/pyxis-app/src/components/organisms/Panels.css
web/packages/pyxis-app/src/components/organisms/ShowsSections.tsx
web/packages/pyxis-app/src/components/organisms/ShowsSections.css
web/packages/pyxis-app/src/components/molecules/Rows/Rows.css
web/packages/pyxis-app/src/components/molecules/Table/Table.css
```

Issue:

- These broad buckets make CSS ownership harder to reason about.
- The decomposition runbook prefers each widget owning its TSX, CSS, story, and index.

Likely outcome:

- Do not delete during the first show edit redesign unless touched directly.
- If new show edit components depend on shared styles from broad buckets, move only the relevant styles into the owning component and record the migration.

### `pages.css` show-detail sections

Current issue:

- Some ShowDetail organisms say they rely on shared detail page styles in `pages.css`.
- The new component organization should move section styles into each owning widget.

Likely outcome:

- As `ShowEditHeader`, `ShowEditRail`, `ShowBasicsSection`, etc. are introduced, move their CSS into local component folders.
- Leave only true page-layout CSS in the page folder.

## Explicit non-deprecations

Do not deprecate these as part of this ticket:

- `ShowTableRow` — still belongs to the Shows overview table.
- `ShowsTable` / Shows overview organisms — separate surface.
- Booking, Artist, Calendar, Settings molecules/organisms — unrelated.
- Public site show components — separate package and audience.
- `NewShowModal` external contract — preserve if possible; redesign internals first.

## Recommended implementation policy

1. Reuse shared primitives first.
2. Reuse app atoms/molecules where they match the semantic job.
3. Create new show-edit-specific organisms for major page sections.
4. Keep old `ShowDetail*` components until their route/story usage is gone.
5. Mark deprecation in changelog/diary when route usage is removed.
6. Delete deprecated widgets only in a focused cleanup commit after typecheck/build proves no imports remain.

## Deprecation checklist for future implementation

Before deleting a widget:

```bash
rg -n "ShowDetailHero|ShowDetailInfoPanel|ShowDetailDiscordPanel|FlyerField" web/packages/pyxis-app/src
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
```

If the component still has valuable stories, either migrate the stories to the replacement component or archive the story intent in the diary before deletion.
