---
Title: Show edit visual redesign tasks
Ticket: PYXIS-SHOW-EDIT-VISUAL-REDESIGN
Status: active
Topics:
  - pyxis
  - staff-app
  - design-system
  - react
  - storybook
DocType: tasks
Intent: short-term
Summary: Task checklist for redesigning the staff show create/edit modal and show edit page from PNG references using component decomposition.
LastUpdated: 2026-04-29T18:40:00-04:00
---

# Tasks

## Phase 0 — Ticket setup and reference capture

- [x] T001 Create docmgr ticket workspace.
- [x] T002 Add primary design/implementation guide document.
- [x] T003 Add investigation diary document.
- [x] T004 Copy `~/Downloads/show-admin.png` into ticket sources.
- [x] T005 Copy `~/Downloads/show-modal.png` into ticket sources.
- [x] T006 Record image-analysis notes for both PNG references.
- [x] T007 Gather evidence inventory and line-anchored code excerpts.

## Phase 1 — Design/decomposition guide

- [x] T101 Read and apply the React decomposition/component-reuse runbook.
- [x] T102 Read and apply the widget folder/Storybook/CSS organization runbook.
- [x] T103 Decompose the references into page, organism, molecule, atom, and shared primitive layers.
- [x] T104 Map current Pyxis show editing files and API boundaries.
- [x] T105 Write detailed intern-oriented implementation guide with diagrams, pseudocode, API references, file references, risks, and phases.

## Phase 2 — Implementation preparation for future coding pass

- [ ] T201 Capture current modal screenshot evidence before implementation.
- [ ] T202 Capture current show edit/detail page screenshot evidence before implementation.
- [ ] T203 Audit existing atoms/molecules/organisms and record explicit reuse/new-component decisions.
- [ ] T204 Decide whether show edit page remains read-only-with-modal or moves toward inline editing.
- [ ] T205 Decide scope of `Preview`, `Duplicate`, `Open post`, flyer delete, and cancel-show controls.

## Phase 3 — Future implementation: component decomposition

- [ ] T301 Extract only justified show edit organisms/molecules with local CSS/stories.
- [ ] T302 Keep page-level RTK Query hooks in pages and pass typed props down.
- [ ] T303 Add Storybook stories for modal, rail, main sections, lineup rows, flyer states, and mobile/narrow states.
- [ ] T304 Validate TypeScript/build after decomposition before visual retuning.

## Phase 4 — Future implementation: modal visual redesign

- [ ] T401 Redesign `NewShowModal` into sectioned form layout.
- [ ] T402 Preserve required-field, draft, confirmed-with-flyer, price, and reserve-ticket semantics.
- [ ] T403 Add dropzone-style flyer presentation without breaking file input accessibility.
- [ ] T404 Capture final modal screenshots and compare against reference intent.

## Phase 5 — Future implementation: show edit page visual redesign

- [ ] T501 Redesign `ShowDetailPage` around header, left rail, and right content sections.
- [ ] T502 Keep inactive/future actions honest: disable, omit, or implement before showing as active.
- [ ] T503 Capture final page screenshots and compare against reference intent.
- [ ] T504 Run browser smoke for create/edit/show detail flows.

## Phase 6 — Documentation delivery

- [x] T601 Run docmgr doctor.
- [x] T602 Dry-run reMarkable upload bundle.
- [x] T603 Upload bundle to reMarkable.
- [x] T604 Verify reMarkable remote listing.
