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
- [x] T203 Audit existing atoms/molecules/organisms and record explicit reuse/new-component decisions.
- [ ] T204 Decide whether show edit page remains read-only-with-modal or moves toward inline editing.
- [ ] T205 Decide scope of `Preview`, `Duplicate`, `Open post`, flyer delete, and cancel-show controls.

## Phase 3 — Storybook-first modal component decomposition

- [x] T301 Create `ShowFormSection` molecule folder with TSX/CSS/story/index and stable `appPart` selectors.
- [x] T302 Create `ShowLineupRowEditor` molecule folder with TSX/CSS/story/index and no route/API coupling.
- [x] T303 Create or adapt a dropzone-style flyer input component while preserving keyboard-accessible file input behavior.
- [x] T304 Refactor `NewShowModal` to compose the new molecules without changing its external props contract.
- [x] T305 Add modal stories for create default, edit existing with flyer, confirmed-needs-flyer, long lineup, backend error, and mobile/narrow.
- [x] T306 Validate `pyxis-app` TypeScript/build after modal decomposition.
- [ ] T307 Commit modal decomposition separately from later route/page redesign.

## Phase 4 — Modal visual polish and evidence

- [x] T401 Tune modal CSS toward `show-modal-reference.png`: section rhythm, uppercase section headings, field grids, lineup rows, and footer clarity.
- [x] T402 Preserve required-field, draft, confirmed-with-flyer, price, and reserve-ticket semantics.
- [x] T403 Capture Storybook screenshots for the redesigned modal states and store evidence under `sources/`.
- [x] T404 Run local interaction smoke for modal validation and submit behavior.
- [x] T405 Commit modal visual polish and evidence.

## Phase 5 — Storybook-first show edit page decomposition

- [x] T501 Create `ShowEditHeader` organism with story states for normal, saving, and disabled future actions.
- [x] T502 Create `ShowFlyerCard` molecule/organism with stories for ready flyer, missing flyer, uploading, and selected replacement.
- [x] T503 Create `ShowEditRail` organism that composes flyer, status/readiness, and Discord cards.
- [x] T504 Create `ShowEditMain`/section organisms for Basics, Date & Time, Details, Lineup, and Staff Notes.
- [x] T505 Refactor `ShowDetailPage` to compose show edit organisms while preserving page-level RTK Query/mutations.
- [x] T506 Validate TypeScript/build after page decomposition.
- [ ] T507 Commit page decomposition separately from final visual tuning.

## Phase 6 — Show edit page visual polish and evidence

- [x] T601 Tune the show edit page toward `show-admin-reference.png`: header, two-column rail/main layout, cards, spacing, mobile stacking.
- [x] T602 Keep inactive/future actions honest: disable, omit, or implement before showing as active.
- [x] T603 Capture current/final page screenshots and store evidence under `sources/`.
- [x] T604 Run authenticated browser smoke for create/edit/show detail flows; local dev-login smoke verifies show detail edit page and save-confirm dialog path.
- [ ] T605 Commit page visual polish and evidence.
- [x] T606 Add next-session restart runbook with lessons learned and restart shortcuts.

## Phase 6 — Documentation delivery

- [x] T601 Run docmgr doctor.
- [x] T602 Dry-run reMarkable upload bundle.
- [x] T603 Upload bundle to reMarkable.
- [x] T604 Verify reMarkable remote listing.
