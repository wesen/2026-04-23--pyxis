---
Title: Show edit modal and page visual redesign implementation guide
Ticket: PYXIS-SHOW-EDIT-VISUAL-REDESIGN
Status: active
Topics:
    - pyxis
    - staff-app
    - design-system
    - react
    - storybook
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: docs/playbooks/07-react-application-decomposition-and-component-reuse.md
      Note: required decomposition and reuse runbook
    - Path: proto/pyxis/v1/show.proto
      Note: canonical Show/AppShow protobuf data contract
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: RTK Query show data/mutation boundary
    - Path: web/packages/pyxis-app/src/components/organisms/FlyerField/FlyerField.tsx
    - Path: web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.css
    - Path: web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
      Note: primary show create/edit modal to redesign
    - Path: web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
      Note: staff show detail/edit page container to decompose
    - Path: web/packages/pyxis-app/src/pages/pages.css
ExternalSources: []
Summary: Detailed implementation guide for redesigning the Pyxis staff show create/edit modal and show edit page from PNG references using component decomposition, Storybook, and existing Pyxis APIs.
LastUpdated: 2026-04-29T18:35:00-04:00
WhatFor: Use this before implementing the show modal/page visual redesign so the work starts from component decomposition rather than page-level CSS hacking.
WhenToUse: When redesigning NewShowModal, ShowDetailPage, or related show editing organisms/molecules in pyxis-app.
---


# Show edit modal and page visual redesign implementation guide

## Executive summary

This ticket turns two PNG references into an implementation plan for a better Pyxis staff show editing experience. The references are:

- `sources/01-reference-pngs/show-admin-reference.png` — a full show edit page reference.
- `sources/01-reference-pngs/show-modal-reference.png` — a create/edit show modal reference.

The requested outcome is not simply “make the page look like the PNG.” The safer engineering goal is to decompose the designs into reusable React components, reuse existing Pyxis primitives where possible, create new atoms/molecules/organisms only where they clarify the system, and keep the real data/mutation behavior intact.

The redesign should produce:

1. A sectioned, readable show create/edit modal.
2. A card-based show edit page with a left asset/status rail and a right editing/content column.
3. Explicit required-field, draft, flyer-readiness, confirmed-status, price, and reserve-ticket semantics.
4. Storybook coverage for the modal and page sections before visual tuning is considered done.
5. Local screenshot/evidence artifacts stored in this ticket.

This guide is written for a new intern. It explains the current Pyxis architecture, the relevant files, the API/data model, the component decomposition, the implementation sequence, pseudocode, diagrams, and validation steps.

## Problem statement and scope

The current show editing UI has accumulated several functional fixes: draft visibility, required-field copy, flyer-required confirmation, staff notes, lineup visibility, flyer readiness, and reserve-ticket flag semantics. Those fixes solved important product problems, but the visual structure is still less polished than the provided references.

The user now wants to update the visual look and workflow of:

- the show create/edit modal; and
- the show edit/detail page.

The work must be done as a component-system task, not as one large page stylesheet. The decomposition runbooks require us to classify parts of the design as pages, organisms, molecules, atoms, and shared primitives before coding.

### In scope

- Analyze the PNG references.
- Decompose them into Pyxis components.
- Plan reusable atoms/molecules/organisms.
- Identify existing components to reuse.
- Plan Storybook states and visual capture evidence.
- Redesign `NewShowModal` in a sectioned way.
- Redesign the staff show edit/detail page layout.
- Preserve existing backend and RTK Query behavior.
- Preserve current product semantics:
  - confirmed shows require a flyer;
  - public APIs hide flyer-less shows;
  - `price` is optional display text;
  - reserve ticket CTA is behind `reserveTicketEnabled`, default false;
  - drafts appear in Shows → Drafts.

### Out of scope unless explicitly approved

- A full ticketing model beyond `reserveTicketEnabled` and `price`.
- A new backend Discord post creation API if one does not already exist.
- A destructive show delete endpoint if cancellation/archive is the actual current domain behavior.
- Replacing the entire Pyxis app design system.
- Deploying to production. This ticket prepares implementation guidance; deployment remains a separate release step.

## Reference inputs

The PNG inputs are stored in the ticket so future readers do not depend on `~/Downloads` or clipboard paths:

```text
ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/sources/01-reference-pngs/show-admin-reference.png
ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/sources/01-reference-pngs/show-modal-reference.png
```

A text analysis of those images is stored at:

```text
sources/04-reference-png-analysis.md
```

The code evidence inventory is stored at:

```text
sources/02-code-evidence-inventory.txt
sources/03-line-anchored-code-excerpts.txt
```

## How to understand the system

### Repository layers

Pyxis is a Go + React application. For this ticket, the most important layers are:

```text
Go backend
  proto/pyxis/v1/show.proto
  pkg/server/app.go
  pkg/server/public.go
  pkg/service/show_service.go
  pkg/repository/postgres/show_repo.go
  pkg/db/queries/shows.sql

React staff app
  web/packages/pyxis-app/src/api/appApi.ts
  web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
  web/packages/pyxis-app/src/components/organisms/NewShowModal/
  web/packages/pyxis-app/src/components/organisms/FlyerField/
  web/packages/pyxis-app/src/components/organisms/ShowDetail/
  web/packages/pyxis-app/src/components/molecules/
  web/packages/pyxis-app/src/components/atoms/

Shared component system
  web/packages/pyxis-components/src/

Generated types
  web/packages/pyxis-types/src/generated/proto/pyxis/v1/show_pb.ts
  gen/proto/proto/pyxis/v1/show.pb.go
```

The backend owns the actual data contract. The React app imports generated protobuf TypeScript types through `pyxis-types`. The staff pages fetch and mutate those types through RTK Query in `appApi.ts`.

### Data flow diagram

```text
User opens /app/shows/:id
        |
        v
ShowDetailPage reads route param
        |
        v
useGetShowQuery(id) in appApi.ts
        |
        v
GET /api/app/shows/{id}
        |
        v
Go server maps DB/domain Show -> protobuf Show
        |
        v
React page receives Show
        |
        +--> renders flyer/status/discord rail
        +--> renders basics/date/details/lineup/notes sections
        +--> opens NewShowModal or section editor
        |
        v
User saves
        |
        v
useUpdateShowMutation(show)
        |
        v
PUT/PATCH /api/app/shows/{id}
        |
        v
Go server maps protobuf Show -> domain Show -> repository update
```

Flyer upload is a separate API call. This is important because a confirmed-with-flyer create/edit flow may need two or three steps:

```text
create draft -> upload flyer -> update show to confirmed with flyerUrl
```

That behavior already exists in current staff flows and must not be broken by visual redesign.

## Current-state architecture

### `NewShowModal`

The current create/edit modal lives at:

```text
web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.css
```

Evidence from `sources/03-line-anchored-code-excerpts.txt` shows that `NewShowModal` already has the right basic responsibilities:

- It accepts an `initialShow` and a submit callback.
- It keeps local draft state.
- It supports a selected `flyerFile`.
- It validates artist/date/status/flyer requirements.
- It emits `(show, flyerFile)` on submit.
- It includes `reserveTicketEnabled` after the recent reserve-ticket flag work.

The modal is therefore a good candidate for a visual/layout refactor. It should not be replaced with a page that fetches data itself. It is already a domain organism: a self-contained show form dialog.

### `ShowDetailPage`

The show detail/edit route lives at:

```text
web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
```

The page currently owns route orchestration:

- read the route id;
- fetch the show;
- handle loading/error states;
- upload flyer;
- update show;
- open/close the modal;
- render staff detail content.

That is correct page-level responsibility. The page should continue to own data fetching and mutations. But it should not own every visual card, form row, or status section inline. The redesign should extract named organisms/molecules so the page becomes easier to read.

### `FlyerField`

The flyer component lives at:

```text
web/packages/pyxis-app/src/components/organisms/FlyerField/FlyerField.tsx
```

It currently handles the form-level upload input and preview. The reference PNGs imply a more card-like flyer presentation and drag/drop treatment. We should decide whether to:

1. extend `FlyerField` into a stronger reusable asset component; or
2. introduce a new molecule/organism such as `ShowFlyerCard` and reuse `FlyerField` inside the modal.

The safest path is to keep `FlyerField` focused on form input/preview and create a new show-page-oriented component for the left rail if the existing API does not fit.

### `appApi.ts`

The staff app data boundary is:

```text
web/packages/pyxis-app/src/api/appApi.ts
```

For this redesign, the relevant RTK Query hooks are:

- `useGetShowQuery`;
- `useCreateShowMutation`;
- `useUpdateShowMutation`;
- `useUploadShowFlyerMutation`;
- calendar/show list hooks where modal creation is launched from other pages.

Do not move those hooks into molecules. Keep them in pages/containers. Organisms should receive `show`, `isSaving`, and callbacks as props.

### Protobuf contract

The show contract is defined in:

```text
proto/pyxis/v1/show.proto
```

The relevant current fields include:

```proto
message Show {
  int32 id = 1;
  string artist = 2;
  string date = 3;
  string doors_time = 4;
  string start_time = 5;
  string age = 6;
  string price = 7;
  string genre = 8;
  string description = 9;
  string notes = 10;
  string flyer_url = 11;
  ShowStatus status = 12;
  int32 draw = 18;
  int32 capacity = 19;
  string discord_message_id = 20;
  string discord_channel_id = 21;
  bool reserve_ticket_enabled = 22;
  repeated LineupSlot lineup = 23;
}
```

The PNG references do not require a new backend field for the first redesign pass. They use fields Pyxis already has: artist, date, doors, start time, age, price, capacity, genre, public description, staff notes, flyer, status, Discord message/channel identifiers, and lineup.

## Design decomposition

The most important correction for this ticket is process: decompose first, then code.

The relevant runbook is:

```text
docs/playbooks/07-react-application-decomposition-and-component-reuse.md
```

It says pages should own routing and data fetching; organisms should own page sections; molecules should own reusable rows/cards/chips; atoms should own small app-specific indicators; and shared primitives from `pyxis-components` should be reused by default.

### Component hierarchy overview

```text
ShowDetailPage                           page/container
  ShowEditHeader                         organism
  ShowEditLayout                         page/organism layout wrapper
    ShowEditRail                         organism
      ShowFlyerCard                      molecule/organism
      ShowStatusCard                     molecule/organism
      ShowDiscordCard                    molecule/organism
    ShowEditMain                         organism/layout
      ShowBasicsSection                  organism
      ShowDateTimeSection                organism
      ShowDetailsSection                 organism
      ShowLineupSection                  organism
        ShowLineupRow                    molecule
      ShowStaffNotesSection              organism
      ShowDangerZone                     organism/molecule

NewShowModal                             organism
  ShowForm                               organism/internal composition
    ShowFormSection                      molecule/layout helper
    ShowBasicsFields                     organism or internal section
    ShowDateTimeFields                   organism or internal section
    ShowDetailsFields                    organism or internal section
    ShowLineupEditor                     organism
      ShowLineupRowEditor                molecule
    ShowAdditionalInfoFields             organism/internal section
    FlyerDropzone/FlyerField             molecule/organism reuse
```

The exact folder count should be kept reasonable. Do not create dozens of tiny files just because the diagram names sections. Extract where it improves reuse, Storybook, or readability.

### Page responsibility

`ShowDetailPage` should continue to own:

- reading `showId` from route params;
- calling `useGetShowQuery(showId)`;
- showing loading/error route states;
- deciding when the edit modal is open;
- calling `useUpdateShowMutation`;
- calling `useUploadShowFlyerMutation`;
- navigation actions such as back to Shows;
- guarding destructive actions with confirmation modals.

Pseudocode:

```tsx
export function ShowDetailPage() {
  const { showId } = useParams();
  const { data: show, isLoading, isError } = useGetShowQuery(Number(showId));
  const [updateShow] = useUpdateShowMutation();
  const [uploadFlyer] = useUploadShowFlyerMutation();

  if (isLoading) return <LoadingState />;
  if (isError || !show) return <ErrorState />;

  return (
    <AppShell ...>
      <ShowEditHeader
        show={show}
        onPreview={...}
        onDuplicate={...}
        onSave={...}
      />
      <ShowEditWorkspace
        show={show}
        onEditSection={...}
        onUploadFlyer={...}
        onArchiveShow={...}
      />
      <NewShowModal
        mode="edit"
        initialShow={show}
        onSubmit={handleModalSubmit}
      />
    </AppShell>
  );
}
```

### Organisms

Organisms should own coherent sections and have Storybook stories.

#### `ShowEditHeader`

Purpose: page-level command bar matching the reference.

Props sketch:

```ts
export type ShowEditHeaderProps = {
  title?: string;
  subtitle?: string;
  backHref?: string;
  isSaving?: boolean;
  onPreview?: () => void;
  onDuplicate?: () => void;
  onSave?: () => void;
};
```

Notes:

- `Preview` can navigate to public preview only if a safe route exists; otherwise open the public show detail if the show is public-ready.
- `Duplicate` should not be shown as active until there is implemented behavior. If included visually first, mark disabled and explain in tasks.
- `Save changes` should either submit current inline edits or open the modal depending on chosen UX. Do not add a fake save button.

#### `ShowEditRail`

Purpose: left column containing asset/readiness/integration state.

Props sketch:

```ts
export type ShowEditRailProps = {
  show: Show;
  selectedFlyerUrl?: string;
  isUploading?: boolean;
  onReplaceFlyer?: (file: File) => void;
  onDeleteFlyer?: () => void;
  onStatusChange?: (status: ShowStatus) => void;
  onOpenDiscordPost?: () => void;
};
```

Possible internal pieces:

- `ShowFlyerCard`;
- `ShowStatusCard`;
- `ShowDiscordCard`.

#### `ShowEditMain`

Purpose: right column for editable data cards.

Props sketch:

```ts
export type ShowEditMainProps = {
  show: Show;
  onEdit?: () => void;
};
```

Internal sections:

- `ShowBasicsSection`;
- `ShowDateTimeSection`;
- `ShowDetailsSection`;
- `ShowLineupSection`;
- `ShowStaffNotesSection`.

These sections can initially be read-only cards with edit affordances, because the existing edit modal is the primary mutation surface. Inline editing should be a later phase unless the user explicitly wants it now.

#### `NewShowModal`

Purpose: create/edit dialog. It can remain an organism but should be internally decomposed into form sections.

Props should remain close to the current contract:

```ts
export type NewShowModalProps = {
  isOpen: boolean;
  mode?: 'create' | 'edit';
  initialShow?: Show;
  isSaving?: boolean;
  error?: string;
  onCancel: () => void;
  onSubmit: (show: Show, flyerFile?: File) => void;
};
```

The visual redesign should not change this public API unless necessary.

### Molecules

Molecules represent one domain object or reusable visual row/card.

#### `ShowLineupRowEditor`

Purpose: one editable lineup row in the modal.

Props sketch:

```ts
export type ShowLineupRowEditorProps = {
  slot: LineupSlot;
  index: number;
  canRemove?: boolean;
  onChange: (index: number, next: LineupSlot) => void;
  onRemove: (index: number) => void;
};
```

#### `ShowLineupRowView`

Purpose: one read-only lineup row on the show edit/detail page.

Props sketch:

```ts
export type ShowLineupRowViewProps = {
  slot: LineupSlot;
};
```

This could reuse an existing public `LineupRow` concept if one is appropriate, but app/staff context may require different controls.

#### `ShowFormSection`

Purpose: repeated section shell for modal form sections.

Props sketch:

```ts
export type ShowFormSectionProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};
```

This can be a molecule because it is a reusable visual wrapper, not a domain-aware page section.

#### `FlyerDropzone`

Purpose: form-specific flyer selection affordance.

Props sketch:

```ts
export type FlyerDropzoneProps = {
  file?: File;
  currentUrl?: string;
  disabled?: boolean;
  onFileChange: (file?: File) => void;
};
```

Prefer enhancing/reusing `FlyerField` if possible. If `FlyerDropzone` is created, document why `FlyerField` was insufficient.

### Atoms

Atoms should stay small.

Likely existing atoms to reuse:

- `StatusPill` for show status labels;
- `StatusDot` if status needs dot-only display;
- `AgeBadge` if a compact age marker appears;
- `DateChip` if a compact date display appears.

Potential new atom:

```text
RequiredMark
```

But this may be unnecessary if the label rendering is owned by a shared `Field` component. Prefer shared `Field`/label semantics before adding a new atom.

### Shared primitives to reuse

Before creating any new visual primitive, check:

```text
web/packages/pyxis-components/src/index.ts
```

Expected reuse:

- `Button` for all actions;
- `Modal` for modal shell if `NewShowModal` is not already using it;
- `Icon`/icon props for upload/trash/plus affordances;
- `Input`, `Select`, `Textarea`, `Field` where their APIs fit;
- existing app `Panel` or shared `Card` for card surfaces.

If a shared primitive is close but not perfect, use this decision order:

1. Extend the shared primitive if the change is generic.
2. Wrap it locally if the app needs domain props.
3. Create a new local component only if visual parity or semantics require it.

## Proposed visual architecture

### Modal spatial model

The create/edit modal should look like a clear form, not a wall of fields.

```text
┌────────────────────────────────────────────────────────────┐
│ Create show                                                │
│ Add the details for your show and share it with audience.  │
├────────────────────────────────────────────────────────────┤
│ BASICS                                                     │
│ Artist / Act name *                                       │
│ Public description                                         │
│                                                            │
│ DATE & TIME                                                │
│ Date *       Doors *       Show starts *                   │
│                                                            │
│ DETAILS                                                    │
│ Age          Price         Capacity       Genre            │
│ Reserve ticket flag                                        │
│                                                            │
│ LINEUP                                      + Add time slot │
│ Artist *     Role          Start           End       Trash  │
│                                                            │
│ ADDITIONAL INFO                                            │
│ Staff notes                                                │
│                                                            │
│ FLYER                                                      │
│ [dropzone / preview / replace]                             │
├────────────────────────────────────────────────────────────┤
│                                      Cancel  Save draft  Create │
└────────────────────────────────────────────────────────────┘
```

Mobile should stack all section grids to one column or two columns where fields are naturally paired. Do not let the footer cover fields. The modal body should scroll while the footer remains reachable.

### Show edit page spatial model

```text
┌───────────────────────────────────────────────────────────────┐
│ All shows                                                     │
│ Edit show                          Preview Duplicate Save     │
│ Update your show details, lineup, and assets.                 │
├───────────────────────┬───────────────────────────────────────┤
│ FLYER                 │ BASICS                                │
│ [poster image]         │ Artist / Act name                     │
│ Replace flyer Delete   │ Public description                    │
│                       │                                       │
│ SHOW STATUS           │ DATE & TIME                           │
│ Status: Confirmed     │ Date / Doors / Show starts            │
│ readiness helper      │                                       │
│                       │ DETAILS                               │
│ DISCORD               │ Age / Price / Capacity / Genre        │
│ Channel / Open post   │ Reserve ticket enabled                │
│                       │                                       │
│                       │ LINEUP                                │
│                       │ repeatable rows                       │
│                       │                                       │
│                       │ STAFF NOTES                           │
│                       │ staff-only text                       │
└───────────────────────┴───────────────────────────────────────┘
```

On mobile, stack the rail above the main content or place the flyer first followed by status, basics, and the rest of the form. The order should preserve context: flyer/status before fields is helpful, but do not force users to scroll through a huge poster before every edit if it becomes painful.

## API and persistence notes

### Show update

The modal/page must submit a `Show` object through `useUpdateShowMutation`. That object should preserve fields that were not edited.

Pseudocode:

```ts
async function handleSave(nextShow: Show, flyerFile?: File) {
  let showToSave = nextShow;

  if (flyerFile) {
    // If backend forbids confirmed without flyer, temporarily draft before upload
    if (nextShow.status === ShowStatus.CONFIRMED && !nextShow.flyerUrl) {
      await updateShow({ ...nextShow, status: ShowStatus.DRAFT });
    }
    const uploaded = await uploadFlyer({ showId: nextShow.id, file: flyerFile }).unwrap();
    showToSave = { ...nextShow, flyerUrl: uploaded.url };
  }

  await updateShow(showToSave).unwrap();
}
```

For create:

```ts
async function handleCreate(show: Show, flyerFile?: File) {
  const wantsConfirmed = show.status === ShowStatus.CONFIRMED;
  const createPayload = wantsConfirmed && flyerFile
    ? { ...show, status: ShowStatus.DRAFT }
    : show;

  const created = await createShow(createPayload).unwrap();

  if (flyerFile) {
    const uploaded = await uploadFlyer({ showId: created.id, file: flyerFile }).unwrap();
    if (wantsConfirmed) {
      await updateShow({ ...created, ...show, flyerUrl: uploaded.url, status: ShowStatus.CONFIRMED }).unwrap();
    }
  }
}
```

### Confirmed status and flyer rule

The backend now enforces confirmed shows requiring a flyer. The UI must preserve the current behavior:

- If status is Confirmed and neither `flyerUrl` nor a selected file exists, disable or explain Confirmed.
- Show staff-facing helper copy.
- If a file is selected, allow the flow because the page can create/upload/update in order.

### Reserve ticket semantics

The modal reference shows `Price`, but product semantics are now more precise:

- `price` is optional public display text, e.g. `$10`, `$10-$15`, `Donations`, or blank.
- `reserveTicketEnabled` controls whether the public reserve-ticket CTA appears.
- The checkbox should default to false for new shows.

Do not reintroduce a required “reserve ticket / price” field.

## Implementation phases

### Phase 0 — Documentation and baseline

1. Read these runbooks:
   - `docs/playbooks/07-react-application-decomposition-and-component-reuse.md`;
   - `docs/playbooks/06-react-widget-folder-storybook-css-organization.md`;
   - `docs/playbooks/05-bottom-up-component-visual-parity.md`;
   - `docs/playbooks/09-pyxis-app-visual-tuning-runbook.md`.
2. Confirm the PNG references are in `sources/01-reference-pngs/`.
3. Capture current modal and page screenshots before making visual changes.
4. Save screenshots under `sources/02-current-state/` or equivalent.
5. Update the diary with exact commands.

### Phase 1 — Component decomposition without visual retuning

Goal: create or reorganize components while preserving current behavior.

Suggested file additions:

```text
web/packages/pyxis-app/src/components/organisms/ShowEdit/
  ShowEditHeader/
  ShowEditRail/
  ShowEditMain/
  ShowBasicsSection/
  ShowDateTimeSection/
  ShowDetailsSection/
  ShowLineupSection/
  ShowStaffNotesSection/
  index.ts

web/packages/pyxis-app/src/components/molecules/ShowFormSection/
web/packages/pyxis-app/src/components/molecules/ShowLineupRowEditor/
web/packages/pyxis-app/src/components/molecules/ShowFlyerCard/
```

Do not create all folders blindly. Create the ones that have a real owner and story.

Validation after Phase 1:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
```

### Phase 2 — Storybook coverage

Add stories before heavy CSS tuning.

Modal stories:

```text
NewShowModal/CreateDefault
NewShowModal/CreateWithFlyerSelected
NewShowModal/CreateConfirmedNeedsFlyer
NewShowModal/EditExisting
NewShowModal/Mobile
```

Show edit section stories:

```text
ShowEditRail/ConfirmedWithFlyer
ShowEditRail/DraftNeedsFlyer
ShowEditMain/FullShow
ShowLineupSection/LongLineup
ShowStaffNotesSection/LongNotes
```

Storybook should use realistic data from `mockData.ts` or local fixtures, but production route code must not import mock data for runtime behavior.

### Phase 3 — Modal visual redesign

Tune `NewShowModal` toward `show-modal-reference.png`.

Implementation details:

- Add `ShowFormSection` wrappers.
- Use uppercased section headings.
- Convert field groups to responsive CSS grids.
- Ensure required markers are consistently styled.
- Present flyer input as a dropzone-like area while preserving actual `input[type=file]` behavior.
- Keep the footer actions stable: Cancel, Save draft, Create/Save.
- Keep validation copy visible and specific.

CSS principles:

```css
.app-show-form-section { ... }
.app-show-form-grid { display: grid; gap: 14px; }
.app-show-form-grid[data-columns='3'] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 720px) { .app-show-form-grid { grid-template-columns: 1fr; } }
```

### Phase 4 — Show edit page visual redesign

Tune the route page toward `show-admin-reference.png`.

Implementation details:

- Add a header with back/title/subtitle/actions.
- Add a two-column layout.
- Put flyer/status/Discord in the left rail.
- Put basics/date/details/lineup/staff notes in right-column cards.
- Use existing `Panel`, `StatusPill`, `NoteBlock`, and other app components where possible.
- Keep edit/save behavior honest. Do not add a working-looking `Duplicate` button if it is not implemented.

If actions are not implemented yet:

- `Preview`: can open public show route if safe.
- `Duplicate`: show disabled with tooltip/helper or omit until implemented.
- `Cancel show`: map to existing status update/archival behavior only if confirmed.
- `Open post`: only enable when `discordMessageId`/channel data exists.

### Phase 5 — Visual evidence and validation

Run:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
docmgr doctor --ticket PYXIS-SHOW-EDIT-VISUAL-REDESIGN --stale-after 30
```

If local app behavior is touched:

```bash
devctl status
# if needed:
devctl down && devctl up && sleep 5 && devctl status
```

Capture current/final screenshots using Storybook or Playwright. Store all scripts in:

```text
scripts/
```

Store evidence in:

```text
sources/
```

## Testing strategy

### Type and build checks

Always run:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
```

If protobuf/API fields are changed, also run:

```bash
make generate
go test ./pkg/server ./pkg/service ./pkg/repository/postgres -count=1
pnpm --dir web --filter pyxis-types build
```

This redesign should not need new backend fields.

### Browser smoke checks

Manual or Playwright checks should cover:

1. Open create modal.
2. See section headers and required markers.
3. Save draft with minimal fields.
4. Attempt confirmed without flyer and see the flyer-required warning.
5. Select flyer and create confirmed show.
6. Open show detail page and see flyer/status/Discord rail.
7. See basics/date/details/lineup/staff notes sections.
8. Edit and save existing show.
9. Ensure price text and reserve-ticket flag behave independently.
10. Ensure mobile/narrow layout does not overflow.

### Storybook visual checks

For each extracted organism/molecule:

- default story;
- empty/missing data story;
- long-content story;
- mobile/narrow story if layout changes;
- important status variants.

### Accessibility checks

The redesign should preserve or improve accessibility:

- every input has a label;
- required fields use text/ARIA, not color only;
- icon buttons have `aria-label`;
- dropzone remains keyboard operable through the file input;
- modal focus behavior remains owned by the modal shell;
- destructive actions require confirmation.

## Risks and mitigations

### Risk: fake buttons create false functionality

The PNG includes `Preview`, `Duplicate`, `Open post`, and delete/cancel controls. Some may not have real backend behavior yet.

Mitigation: only enable actions with real behavior. Disable/omit others and record follow-up tasks.

### Risk: inline editing expands scope too much

The show edit page reference looks like an inline editing page. The current app uses a modal editing flow.

Mitigation: Phase 4 can present read-only cards and open the modal for editing. Inline editing can be a future phase after component structure is stable.

### Risk: component explosion

The decomposition diagram names many possible sections.

Mitigation: extract components only when they have clear responsibility, reuse, stories, or visual capture targets. Do not create empty wrappers just to match a diagram.

### Risk: breaking confirmed-with-flyer flow

The backend rejects confirmed shows without flyers. The current frontend has two-step create/upload/update logic.

Mitigation: preserve the existing submit algorithm and add tests/smoke around confirmed-with-selected-flyer.

### Risk: stale Storybook/Vite CSS

Prior visual work found that Storybook can serve stale/empty CSS modules.

Mitigation: restart Storybook after major component moves and verify screenshots, not only typechecks.

## Alternatives considered

### Alternative 1 — Page-level CSS only

This is fastest but rejected. It would make the page look closer temporarily while leaving a large, hard-to-maintain JSX/CSS blob. It violates the decomposition runbook and makes future Storybook/visual-diff work harder.

### Alternative 2 — Build a new standalone form system

This is too broad. Pyxis already has app atoms, molecules, organisms, and shared components. We should reuse before inventing.

### Alternative 3 — Implement full inline editing immediately

The edit page reference suggests inline editing, but the current mutation flow is modal-based and already handles complex flyer/status rules. Full inline editing should be a later phase unless explicitly requested.

### Alternative 4 — Copy exact colors and spacing from PNG

Rejected. The PNG provides hierarchy and intent. Pyxis tokens and existing component primitives should determine final colors, borders, and typography unless there is a deliberate design-system change.

## File reference map

### Primary files likely to change

```text
web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.css
web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
web/packages/pyxis-app/src/pages/pages.css
```

### Existing components to inspect/reuse

```text
web/packages/pyxis-app/src/components/organisms/FlyerField/FlyerField.tsx
web/packages/pyxis-app/src/components/organisms/Panel/Panel.tsx
web/packages/pyxis-app/src/components/molecules/MetadataStrip/MetadataStrip.tsx
web/packages/pyxis-app/src/components/molecules/NoteBlock/NoteBlock.tsx
web/packages/pyxis-app/src/components/molecules/StatusBadge/StatusBadge.tsx
web/packages/pyxis-app/src/components/atoms/StatusPill/StatusPill.tsx
web/packages/pyxis-components/src/index.ts
```

### Data/API references

```text
web/packages/pyxis-app/src/api/appApi.ts
proto/pyxis/v1/show.proto
pkg/server/app.go
pkg/server/public.go
pkg/service/show_service.go
pkg/repository/postgres/show_repo.go
```

### Process/runbook references

```text
docs/playbooks/07-react-application-decomposition-and-component-reuse.md
docs/playbooks/06-react-widget-folder-storybook-css-organization.md
docs/playbooks/05-bottom-up-component-visual-parity.md
docs/playbooks/09-pyxis-app-visual-tuning-runbook.md
docs/playbooks/10-css-visual-diff-verb-operator-guide.md
```

## Implementation checklist for the intern

Before writing code:

- [ ] Read this guide.
- [ ] Open both PNG references.
- [ ] Read the decomposition runbook.
- [ ] Inspect current `NewShowModal` and `ShowDetailPage`.
- [ ] Decide which components to extract in the first commit.
- [ ] Capture current screenshots.

During implementation:

- [ ] Refactor component ownership before retuning CSS.
- [ ] Keep page data hooks in pages.
- [ ] Keep organisms prop-driven.
- [ ] Reuse `Button`, modal shell, status pills, panels/cards, field primitives where practical.
- [ ] Add stories for every new reusable widget.
- [ ] Preserve flyer/status/reserve-ticket semantics.

Before committing:

- [ ] Run TypeScript check.
- [ ] Run Vite build.
- [ ] Capture evidence screenshots.
- [ ] Update diary/changelog/tasks.
- [ ] Run `docmgr doctor`.
- [ ] Avoid staging unrelated local flyers, binaries, or unrelated tickets.

## Open questions

1. Should the final show edit page be fully inline-editable, or should it remain a structured read-only page with an edit modal?
2. Should `Duplicate` be implemented now or left disabled/omitted?
3. Should `Cancel show` map to `cancelled` status, `archived`, or a separate confirmation flow?
4. Should Discord `Open post` merely open an existing post, or should the redesign include post creation/linking?
5. Should flyer deletion be supported as a first-class API operation, or should replacement be the only v1 behavior?

These questions should be resolved before enabling the corresponding controls in production.

## References

- Reference PNGs: `sources/01-reference-pngs/`.
- Image analysis: `sources/04-reference-png-analysis.md`.
- Code evidence inventory: `sources/02-code-evidence-inventory.txt`.
- Line-anchored excerpts: `sources/03-line-anchored-code-excerpts.txt`.
- Component decomposition runbook: `docs/playbooks/07-react-application-decomposition-and-component-reuse.md`.
- Widget folder/story/CSS runbook: `docs/playbooks/06-react-widget-folder-storybook-css-organization.md`.
