---
Title: Reference PNG analysis
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
Summary: Analysis of show-admin and show-modal PNG references for the show edit visual redesign.
LastUpdated: 2026-04-29T18:45:00-04:00
---

# Reference PNG analysis

## Source files

- `sources/01-reference-pngs/show-admin-reference.png` copied from `/home/manuel/Downloads/show-admin.png`.
- `sources/01-reference-pngs/show-modal-reference.png` copied from `/home/manuel/Downloads/show-modal.png`.

## show-admin-reference.png — edit page reference

The reference shows a staff-facing show edit page with a clear two-column editing workspace.

- The top header contains a back affordance (`All shows`), title (`Edit show`), subtitle (`Update your show details, lineup, and assets.`), and right-aligned actions (`Preview`, `Duplicate`, `Save changes`).
- The page body is an asymmetrical grid: a narrower left rail for visual/integration state, and a wider right column for editable show data.
- The left rail contains:
  - a Flyer card with the public poster image and actions (`Replace flyer`, delete/trash);
  - a Show Status card with a status selector and explanatory helper copy;
  - a Discord card with channel selection, `Open post`, and helper copy.
- The right column contains stacked cards/sections:
  - Basics: artist/act name and public description;
  - Date & Time: date, doors, and show-start fields;
  - Details: age restriction, price, capacity, genre;
  - Lineup: repeatable rows with artist/act, role, start time, end time, and remove control;
  - Staff Notes: staff-only textarea.
- The visual language is utilitarian, card-based, and form-first. Section headings are uppercase, labels are small, fields are rectangular with rounded corners, and the primary action is the red Pyxis action.

## show-modal-reference.png — create/edit modal reference

The modal reference shows a compact sectioned form for creating a show.

- Header:
  - title: `Create show`;
  - subtitle: `Add the details for your show and share it with your audience.`
- Major sections:
  - Basics;
  - Date & Time;
  - Details;
  - Lineup;
  - Additional Info;
  - Flyer.
- Required fields are marked with red `*` on labels.
- The form uses responsive grids: one-column fields for large text, three/four-column rows for date/time/details, and a repeatable lineup row.
- The flyer uploader is presented as a dashed dropzone with upload guidance: `PNG, JPG or WebP up to 10MB`.
- Footer actions are ordered from escape/secondary to final action:
  - Cancel;
  - Save draft;
  - Create show.

## Design interpretation

The binding design intent is not exact pixel values. The binding intent is:

1. Decompose show editing into named, reusable sections.
2. Make required/optional/flyer/readiness states visible.
3. Make asset/status/integration state visible without burying it below the main form.
4. Reuse existing Pyxis tokens/components for buttons, panels, status pills, fields, and modal shell.
5. Keep route data/mutation logic in the page, and keep form/presentation sections prop-driven.
