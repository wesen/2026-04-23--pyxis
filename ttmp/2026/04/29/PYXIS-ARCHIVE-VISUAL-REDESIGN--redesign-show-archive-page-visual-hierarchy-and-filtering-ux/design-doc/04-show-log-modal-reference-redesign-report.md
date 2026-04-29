---
Title: Show log modal reference redesign report
Ticket: PYXIS-ARCHIVE-VISUAL-REDESIGN
Status: active
Topics:
    - frontend
    - staff-app
    - storybook
    - visual-design
    - css
DocType: design-doc
Intent: implementation-guide
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/29/PYXIS-ARCHIVE-VISUAL-REDESIGN--redesign-show-archive-page-visual-hierarchy-and-filtering-ux/sources/17-show-log-modal-redesign-reference/current-modal.png
    - Path: ttmp/2026/04/29/PYXIS-ARCHIVE-VISUAL-REDESIGN--redesign-show-archive-page-visual-hierarchy-and-filtering-ux/sources/17-show-log-modal-redesign-reference/reference-modal.png
    - Path: web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.css
      Note: Current modal CSS and target styling surface
    - Path: web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.tsx
      Note: Current TSX structure and target implementation surface
    - Path: web/packages/pyxis-components/src/organisms/Modal/Modal.tsx
      Note: Shared modal width constraint and footer/header implementation
ExternalSources: []
Summary: Visual/CSS/TSX implementation report for moving the ShowLog editor modal toward the provided two-column reference dialog.
LastUpdated: 2026-04-29T09:45:00-04:00
WhatFor: Use this before implementing the next ShowLog modal redesign pass. It translates the supplied screenshot into concrete React/CSS work.
WhenToUse: Read when editing PostShowLogEditorModal, Modal sizing, ShowLog story states, or the route-level post-show log save UX.
---


# Show log modal reference redesign report

## Inputs and evidence

The supplied visual reference was copied into the ticket evidence folder:

```text
sources/17-show-log-modal-redesign-reference/reference-modal.png
```

A fresh capture of the current Storybook modal was generated with `css-visual-diff screenshot`:

```text
sources/17-show-log-modal-redesign-reference/current-modal.png
```

Image dimensions:

- Reference modal screenshot: `1402 x 1122`.
- Current modal screenshot: `722 x 702`.

Source files inspected:

```text
web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.tsx
web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.css
web/packages/pyxis-components/src/organisms/Modal/Modal.tsx
```

## What `read` shows in the reference screenshot

The target screenshot is a large desktop modal with a calm, production form layout:

- A wide white modal card over a gray translucent backdrop.
- Header at the top with title, subtitle metadata, and an `X` close affordance.
- A full-width header divider.
- Body split into two columns:
  - left/main column for pre-show note, quick highlight, draw/door fields, incident checkbox, and post-show notes;
  - right/sidebar column for incident details and a privacy banner.
- Footer is separated by a divider and keeps action buttons right-aligned.
- Primary action is stronger and more explicit: `Save post-show log`.
- The reference modal feels around twice as wide as the current Pyxis modal, and it uses that width for horizontal task grouping rather than a single vertical stack.

Important visible field copy:

- Title: `Log show — Planning for Burial`.
- Subtitle: `Sun, Apr 26, 2026 · Noise / ambient`.
- Pre-show note label: `PRE-SHOW NOTE`.
- Quick highlight label/helper:
  - `Quick highlight`
  - `In one sentence, what was memorable about this show?`
- Draw field:
  - label `Draw (attendance)`
  - placeholder `e.g. 312`
  - helper `Number of people in attendance`
- Door field:
  - label `Total door`
  - currency prefix `$`
  - placeholder `e.g. 745.00`
  - helper `Total dollars collected at the door`
- Incident checkbox:
  - `Mark this show as having an incident`
  - `You'll be able to add details below.`
- Post-show notes label/helper:
  - `Post-show notes`
  - `What happened before, during, and after the show?`
- Incident details sidebar:
  - `Incident details`
  - `Provide details about what occurred.`
  - textarea placeholder `Describe the incident...`
- Privacy banner:
  - `Incident logs are private and staff-only.`
  - `They are not visible on the public show page.`

## `understand_image` summary of the target reference

The image analysis characterized the target as:

- A wide desktop modal (`~900-1000px` or wider in captured pixels) with a soft shadow, rounded white panel, and dark translucent backdrop.
- A two-column body: roughly `60-65%` left column and `35-40%` right column, separated by a generous gap and a subtle vertical divider.
- A clear header hierarchy: title, subdued metadata, close icon, and thin divider.
- Neutral form controls: white inputs, light gray borders, small radii, consistent padding, and visible focus states.
- A warm pre-show note callout with pale yellow background, tan border, and info icon.
- A pale-red incident detail panel in the sidebar.
- A gray privacy banner with shield icon.
- A footer that feels sticky/anchored, with secondary cancel and red primary save button.

## Current modal analysis

The current modal capture shows a polished but smaller and simpler modal:

```text
sources/17-show-log-modal-redesign-reference/current-modal.png
```

Current strengths:

- Header title/subtitle already match the reference copy closely.
- The close icon is present and correctly placed.
- The save button is already red and visually prominent.
- The form already validates draw bounds and incident notes.
- The current modal already scopes styling under `app-post-show-log-modal__*` classes.
- It already uses the shared `Modal` organism and `data-pyxis-component="post-show-log-editor-modal"` selector for screenshots.

Current gaps against the reference:

1. **Width and layout**
   - Current modal is `722px` wide because `Modal` `lg` maps to `722`.
   - Reference is a large desktop dialog, visually closer to `1100-1350px` in the captured image.
   - Current content is a single vertical column; reference is a two-column working form.

2. **Pre-show note treatment**
   - Current `Show notes` appears as a neutral bordered block via `NoteBlock`.
   - Reference uses a warm, high-signal pre-show note callout with an icon and uppercase label.
   - The reference label is more precise: `PRE-SHOW NOTE`, not generic `Show notes`.

3. **Metadata/status strip**
   - Current modal starts with status/current-draw/updated metadata.
   - Reference removes this operational metadata from the main body and uses the header subtitle plus contextual form fields instead.
   - The current strip adds scan noise for the modal task.

4. **Missing quick highlight**
   - Current modal only has post-show notes.
   - Reference introduces a short `Quick highlight` input before numeric fields. This likely maps to either a new field in the future API or a first-line convention inside `postShowNotes` for the immediate implementation.

5. **Missing total door**
   - Current draft model only tracks `draw`, `postShowNotes`, `incident`, and `incidentNotes`.
   - Reference has `Total door` with a currency prefix and helper text.
   - This is a data-model/API question: add `totalDoor` now only if backend persistence is planned, otherwise render it as disabled/future or defer it.

6. **Incident details location**
   - Current incident notes textarea appears below post-show notes only when the checkbox is checked.
   - Reference always reserves a right sidebar area for incident details, using a pale red panel.
   - The reference makes incident work feel separate, private, and review-oriented.

7. **Privacy communication**
   - Current modal has no staff-only/privacy banner.
   - Reference explicitly states incident logs are private and staff-only.

8. **Field hierarchy and copy**
   - Current label `Draw` is terse.
   - Reference uses human-oriented labels and helpers: `Draw (attendance)`, `Number of people in attendance`, `What happened before, during, and after the show?`.

9. **Character counts**
   - Reference shows `0 / 1000` counters for both large textareas.
   - Current modal has no counters and no `maxLength` in the TSX.

10. **Footer copy**
    - Current primary button says `Save report`.
    - Reference says `Save post-show log`, which is clearer and route-consistent.

## Current CSS constraints

Current modal CSS is clean but optimized for a compact one-column form:

```css
.app-post-show-log-modal__panel { --show-log-modal-gap: 18px; }
.app-post-show-log-modal__content { display: grid; gap: var(--show-log-modal-gap); }
.app-post-show-log-modal__context { ... }
.app-post-show-log-modal__form { border-top: 1px solid var(--app-rule); ... }
.app-post-show-log-modal__grid { grid-template-columns: minmax(0, 1fr); }
.app-post-show-log-modal__draw { max-width: 150px; }
```

The shared modal is the biggest sizing constraint:

```ts
const widths = { sm: 402, md: 522, lg: 722 };
```

To match the reference, we should not hack width through global CSS if possible. Better options:

1. Add a new shared `Modal` width token, for example `xl: 1120` or `wide: 1120`.
2. Or add a `maxWidth?: number | string` prop to `Modal` for exceptional forms.
3. Then set the ShowLog modal to the new wide size.

The safer first pass is `width="xl"`, because it keeps sizing vocabulary explicit and avoids one-off inline widths.

## Recommended TSX work

### 1. Expand the draft shape intentionally

Current draft:

```ts
type Draft = Pick<ShowLogUpdateInput, 'draw' | 'postShowNotes' | 'incident' | 'incidentNotes'>;
```

Target UI fields:

```ts
type Draft = Pick<ShowLogUpdateInput, 'draw' | 'postShowNotes' | 'incident' | 'incidentNotes'> & {
  quickHighlight: string;
  totalDoor: string;
};
```

Data decision:

- If backend persistence is not ready, do **not** silently drop `quickHighlight` and `totalDoor` without telling the user.
- Recommended near-term path:
  - include `quickHighlight` in the modal UI but fold it into `postShowNotes` only if the implementation explicitly labels the behavior in code/comments and report saving;
  - defer editable `totalDoor` until backend support exists, or add it as a non-persisted Storybook-only visual placeholder.
- Better medium-term path:
  - add `quickHighlight` and `totalDoorCents` to the ShowLog API/domain before shipping those inputs live.

### 2. Replace the context/form vertical stack with a two-column body

Proposed TSX structure:

```tsx
<div className="app-post-show-log-modal__layout">
  <main className="app-post-show-log-modal__main-column">
    <PreShowNoteCallout value={entry.showNotes} />
    <QuickHighlightField ... />
    <div className="app-post-show-log-modal__metrics-grid">
      <DrawField ... />
      <TotalDoorField ... />
    </div>
    <IncidentCheckbox ... />
    <PostShowNotesField ... />
  </main>
  <aside className="app-post-show-log-modal__side-column">
    <IncidentDetailsPanel ... />
    <PrivacyBanner />
  </aside>
</div>
```

Do not keep the current `MetadataStrip` in the modal default view. It can remain available in other contexts, but this modal should prioritize the reference workflow.

### 3. Add small local subcomponents inside the modal file first

Keep the redesign self-contained until it is approved:

- `PreShowNoteCallout`
- `FieldShell`
- `TextAreaWithCount`
- `IncidentDetailsPanel`
- `PrivacyBanner`

Do not extract these to shared molecules until the modal has been visually accepted.

### 4. Improve labels and helper text

Use reference copy:

- `PRE-SHOW NOTE`
- `Quick highlight`
- `Draw (attendance)`
- `Total door`
- `Mark this show as having an incident`
- `Post-show notes`
- `Incident details`

### 5. Add textarea character counts

Add max length constants:

```ts
const MAX_NOTE_LENGTH = 1000;
```

Use:

```tsx
<textarea maxLength={MAX_NOTE_LENGTH} />
<span>{value.length} / {MAX_NOTE_LENGTH}</span>
```

### 6. Make incident sidebar behavior explicit

Reference screenshot shows the incident panel active/tinted. Recommended behavior:

- Keep the incident details panel visible at desktop width so the form layout remains stable.
- When `incident === false`:
  - panel is visually muted;
  - textarea disabled;
  - helper says `Check “Mark this show as having an incident” to add details.`
- When `incident === true`:
  - panel becomes pale red;
  - textarea enabled;
  - validation requires content.

This preserves the reference composition while avoiding hidden controls.

## Recommended CSS work

### 1. Modal width

Update shared modal width map:

```ts
width?: 'sm' | 'md' | 'lg' | 'xl';
const widths = { sm: 402, md: 522, lg: 722, xl: 1120 };
```

Then:

```tsx
<Modal width="xl" ...>
```

### 2. Body layout

```css
.app-post-show-log-modal__body {
  background: #fff;
  padding: 28px 32px;
}

.app-post-show-log-modal__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.95fr);
  gap: 28px;
}

.app-post-show-log-modal__side-column {
  border-left: 1px solid var(--app-rule);
  padding-left: 28px;
}
```

At smaller widths:

```css
@media (max-width: 900px) {
  .app-post-show-log-modal__layout {
    grid-template-columns: 1fr;
  }
  .app-post-show-log-modal__side-column {
    border-left: 0;
    border-top: 1px solid var(--app-rule);
    padding-left: 0;
    padding-top: 20px;
  }
}
```

### 3. Pre-show note callout

```css
.app-post-show-log-modal__pre-show-note {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  padding: 18px 20px;
  border: 1px solid #f2c879;
  border-radius: 8px;
  background: #fff8e7;
}
```

### 4. Form fields

Unify field shell styles:

```css
.app-post-show-log-modal__label {
  color: var(--app-ink);
  font-size: 14px;
  font-weight: 750;
}

.app-post-show-log-modal__help {
  color: var(--app-muted);
  font-size: 13px;
  line-height: 1.35;
}

.app-post-show-log-modal__input,
.app-post-show-log-modal__textarea {
  width: 100%;
  border: 1px solid var(--app-rule);
  border-radius: 8px;
  background: #fff;
  color: var(--app-ink);
  font-size: 14px;
  padding: 12px 14px;
}
```

### 5. Draw/door metrics grid

```css
.app-post-show-log-modal__metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}
```

Currency prefix wrapper:

```css
.app-post-show-log-modal__currency-input {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  border: 1px solid var(--app-rule);
  border-radius: 8px;
  background: #fff;
}
```

### 6. Incident panel

```css
.app-post-show-log-modal__incident-panel {
  border: 1px solid #efc7c7;
  border-radius: 8px;
  background: #fff7f7;
  padding: 20px;
}

.app-post-show-log-modal__incident-panel[data-enabled='false'] {
  background: #fafafa;
  border-color: var(--app-rule);
  opacity: .78;
}
```

### 7. Privacy banner

```css
.app-post-show-log-modal__privacy-banner {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 16px 18px;
  border: 1px solid var(--app-rule);
  border-radius: 8px;
  background: color-mix(in srgb, var(--app-surface-strong) 80%, white);
}
```

### 8. Footer/primary button

Change button text to:

```text
Save post-show log
```

If the shared `Button` red differs from the reference, add a local footer class only after checking the system button token. Avoid one-off color overrides unless the existing primary button is visibly wrong.

## Storybook and screenshot work

Update the existing stories:

```text
PostShowLogEditorModal.stories.tsx
```

Required story states:

1. `NeedsLog` — incident unchecked, sidebar muted, empty fields.
2. `IncidentChecked` — incident checked, sidebar active/red, missing incident note validation visible.
3. `Logged` — draw/post-show notes populated.
4. `Incident` — full incident notes populated.
5. `Mobile` — narrow viewport with side column stacked below main form.
6. Optional `DoorFieldPendingPersistence` if total door is shown before backend support.

Update or add screenshot config under:

```text
sources/17-show-log-modal-redesign-reference/
```

Recommended capture sequence:

```bash
css-visual-diff screenshot \
  --config sources/17-show-log-modal-redesign-reference/post-show-log-editor-modal-reference-redesign.css-visual-diff.yml \
  --side react \
  --section modal \
  --output-file sources/17-show-log-modal-redesign-reference/current-after-redesign.png
```

## Implementation sequence

1. Add `xl` modal width support in `pyxis-components` `Modal.tsx`.
2. Refactor `PostShowLogEditorModal.tsx` into two-column local subcomponents.
3. Keep persistence behavior conservative:
   - draw, post-show notes, incident, incident notes remain saved fields;
   - quick highlight/total door require an explicit persistence decision before route use.
4. Rewrite `PostShowLogEditorModal.css` around the reference layout.
5. Update stories for default, incident, populated, saving, and mobile states.
6. Capture screenshots with `css-visual-diff screenshot`.
7. Compare against `reference-modal.png` by reading images directly and, if needed, asking for targeted image critique.
8. Only after the screenshot is close, wire any new backend fields.

## Backend/data model follow-up

The reference includes fields that do not currently exist in `ShowLogUpdateInput`:

- `quickHighlight`
- `totalDoor`

Before shipping the modal live with these fields, decide one of:

1. **Visual-only Storybook first**: include them only in stories while leaving route UI conservative.
2. **Fold quick highlight into notes**: prepend quick highlight to `postShowNotes` with clear code comments.
3. **Add backend schema**: add columns/API fields for `quick_highlight` and `total_door_cents` or equivalent.

Recommended product-quality path: add backend fields if the reference is accepted as the actual production form, because staff will expect those inputs to persist independently.

## Acceptance criteria for the redesign pass

- Modal desktop width is large enough for a two-column layout without cramped fields.
- Header/title/subtitle still match existing data and accessibility wiring.
- Pre-show note is a warm callout, not a generic note block.
- Main form has quick highlight, draw, total door, incident checkbox, and post-show notes in the same visual rhythm as the reference.
- Incident details live in a right sidebar panel with explicit staff-only privacy copy.
- Textareas show `current / 1000` counters.
- Footer button says `Save post-show log`.
- Mobile/narrow viewport stacks cleanly.
- Storybook includes incident and mobile states.
- `pnpm exec tsc --noEmit` passes.
- A new `current-after-redesign.png` is stored next to the reference screenshot.
