# Pyxis staff backend page UI guidelines

These guidelines keep Pyxis staff/admin pages visually consistent. Use them when building pages under `web/packages/pyxis-app/src/pages` and staff components under `web/packages/pyxis-app/src/components`.

## Core rules

1. **Reuse before inventing.** Start from existing atoms, molecules, organisms, and `pyxis-components` primitives.
2. **Pages orchestrate data; components render UI.** Pages own route params, RTK Query hooks, mutations, navigation, loading/error states, and local modal state. Components receive props and callbacks.
3. **Prefer tables for row data.** If users scan multiple records, use `Table.css` + row components, not a stack of whitespace-heavy cards.
4. **One widget, one look.** If two things mean the same kind of action/status, they should use the same component and shape.
5. **Component-owned CSS.** Each reusable widget imports its own CSS. Do not hide large styling in page CSS unless the style is truly page layout.
6. **Storybook first for reusable UI.** New atoms/molecules/organisms should include a story before route-level tuning.

## Page structure

Use this default shape:

```tsx
<AppShell page="shows" title="Shows" eyebrow="Home / Shows" action={...}>
  {actionError && <div className="app-action-error" role="alert">...</div>}
  {isLoading ? <LoadingState /> : isError ? <ErrorState /> : <PageOrganism ... />}
</AppShell>
```

Reuse:

- `AppShell` for all authenticated staff pages.
- `LoadingState`, `ErrorState`, `EmptyState` from `pages/shared.tsx`.
- `Panel` for major page sections.
- `AppEmptyState` inside panels/tables.

Do not:

- duplicate shell/header/sidebar markup;
- put RTK Query calls inside reusable organisms;
- create one-off empty/loading/error designs.

## Tables and row actions

Use tables for lists of shows, bookings, artists, audits, logs, calendar rows, and settings-like summaries.

Reuse:

- `components/molecules/Table/Table.css` for shared table foundations.
- Existing row components such as `ShowTableRow`, `BookingQueueRow`, `ArtistRosterRow` where possible.
- `app-row-edit` for compact edit/review/log row actions.
- `Icon name="edit"` for edit, review, and log actions in table rows.

Guidelines:

- Keep row actions compact and aligned right.
- Use icon-only edit buttons with clear `aria-label`, for example `aria-label="Review Example Artist"`.
- Use text buttons only for secondary row actions where the label explains a mode change, such as `Details` / `Hide`.
- Use expanded detail rows when the detail belongs to a table record.
- Keep expanded details compact and table-like for dense metadata/notes.

Do not:

- use large cards for each row in a dense admin list;
- mix text `Edit`, `Review`, `Log` buttons with pencil icon buttons in the same table family;
- invent a new edit icon style.

## Modals and dialogs

Reuse:

- `Modal` from `pyxis-components` for preview/detail/edit modals.
- `ConfirmDialog` for destructive or high-risk confirmation flows.
- `NewShowModal` for create/edit show form flows.
- `PostShowLogEditorModal` for post-show log edits.

Guidelines:

- Use modal titles that name the object: `Open Mic Night flyer`, `Log show — Artist`.
- Keep modal body content focused; move long lists back to the page/table.
- Use shared `Button` in modal footers.
- Make close/cancel selectors unambiguous in tests and UI labels.
- For preview modals, prefer a simple shared `Modal` with a single centered asset/content block.

Do not:

- hand-roll fixed-position overlays;
- put destructive actions in generic modals without `ConfirmDialog`;
- create a new modal shell for each page.

## Badges, pills, and status indicators

Reuse:

- `StatusPill` for protobuf/status-like labels such as Confirmed, Draft, Hold, Cancelled, Archived.
- `StatusBadge` for operational/log states such as Logged, Incident, Needs log.
- `AgeBadge` for age restriction display; blank age renders `—`.
- `StatusDot` only when a small dot indicator is specifically needed.
- Shared `Badge`/`Tag` from `pyxis-components` through app wrappers, not directly, when an app wrapper exists.

Guidelines:

- If a label looks like `Confirmed`, use the same pill family for sibling labels such as `Needs flyer`.
- Do not add extra text like `Ready` when the visual thumbnail/status already communicates readiness.
- Use explicit fallback text for missing data: `—`, `Genre not set`, `No notes.`

Do not:

- create ad hoc pill CSS for every page;
- render empty badges;
- use color alone to convey incident/error state.

## Buttons and icons

Reuse:

- `Button` from `pyxis-components` for normal page and modal actions.
- `Icon` from `pyxis-components` for shared iconography.
- `app-row-edit` for table edit/review/log icon buttons.

Guidelines:

- Primary page action: `Button size="sm"` in `AppShell` action area.
- Secondary actions: `variant="outline"` or `variant="ghost"`.
- Dangerous actions: use `ConfirmDialog`, not a bare red button unless the confirmation already happened.
- Icon-only buttons must have `aria-label` and preferably `title`.

Do not:

- use raw `<button>` for normal app buttons unless it is a tiny row/icon control already covered by shared CSS;
- mix multiple icon sets;
- label the same action differently across pages.

## Forms and fields

Reuse:

- `Field`, `Input`, `Select`, `Textarea`, `Button` from `pyxis-components`.
- `FieldError` for validation messages.
- `ShowFormSection` for grouped show form sections.
- `ShowLineupRowEditor` for lineup rows.
- `FlyerDropzone` / `FlyerField` / `ShowFlyerCard` depending on context.

Guidelines:

- Group long forms into titled sections.
- Put required-field help near the field, not only in a toast/error banner.
- Preserve uploaded local state when saving related forms, especially flyer URLs.
- Keep backend validation errors as validation errors, not generic internal errors.

Do not:

- duplicate input styling in page CSS;
- hide required conditions until submit;
- silently drop generated protobuf fields or UI-only fields.

## Flyer/poster UI

Rules:

- Poster means uploaded flyer.
- Confirmed shows require a flyer.
- Public APIs hide confirmed flyer-less shows.
- Staff UI must explain when a show needs a flyer.

Reuse:

- `ShowFlyerCard` on show edit pages.
- `FlyerDropzone` inside create/edit modal flows.
- Thumbnail button in table rows for flyer preview.
- Shared `Modal` for flyer preview.

Guidelines:

- Thumbnail means a flyer exists; no extra `Ready` label is needed.
- Clicking the thumbnail should preview the flyer, not navigate away.
- Missing flyer should use a shared status/pill widget.

## Component choice checklist

Before adding a new component, check these first:

| Need | Reuse |
| --- | --- |
| Page shell | `AppShell` |
| Section/card container | `Panel`, `AppCard` |
| Dense list | `Table.css` + row component |
| Empty panel/table | `AppEmptyState` |
| Loading/error page state | `LoadingState`, `ErrorState` |
| Normal button | `Button` |
| Edit/review/log row action | `app-row-edit` + `Icon name="edit"` |
| Confirmation | `ConfirmDialog` |
| Preview/edit modal | `Modal` |
| Status label | `StatusPill` or `StatusBadge` |
| Age label | `AgeBadge` |
| Date chip | `DateChip` |
| Draw/capacity | `DrawProgress` |
| Metadata strip | `MetadataStrip` |
| Notes in sparse layouts | `NoteBlock` |
| Notes in dense table rows | compact detail table |
| Show form group | `ShowFormSection` |
| Lineup row editing | `ShowLineupRowEditor` |
| Flyer upload/preview | `FlyerDropzone`, `FlyerField`, `ShowFlyerCard`, `Modal` |

## New component folder pattern

Create new reusable components only when composition of existing pieces is not enough.

Use:

```text
ComponentName/
  ComponentName.tsx
  ComponentName.css
  ComponentName.stories.tsx
  index.ts
```

Rules:

- TSX imports its CSS.
- Stories cover default, empty/error, dense, and mobile/narrow states when relevant.
- Export from the nearest barrel only if other components/pages need it.
- Keep props data-focused and callbacks explicit.

## Review checklist

Before merging a staff backend page change, verify:

- [ ] Existing components were reused before new CSS/widgets were introduced.
- [ ] Lists use tables or compact rows unless there is a clear card-based reason.
- [ ] Edit/review/log table actions use the pencil icon button style.
- [ ] Badges and pills use `StatusPill`, `StatusBadge`, `AgeBadge`, or another shared wrapper.
- [ ] Modals use `Modal` or `ConfirmDialog`.
- [ ] Missing data has visible fallback text.
- [ ] UI-only fields are not lost through protobuf `create()` calls.
- [ ] Component CSS lives with the component.
- [ ] Storybook exists for new reusable widgets.
- [ ] TypeScript and relevant smoke/storybook checks pass.
