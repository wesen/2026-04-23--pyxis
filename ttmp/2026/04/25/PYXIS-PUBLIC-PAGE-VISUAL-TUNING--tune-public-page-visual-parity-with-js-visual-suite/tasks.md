---
Title: Tasks
Ticket: PYXIS-PUBLIC-PAGE-VISUAL-TUNING
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - pyxis
DocType: tasks
Intent: short-term
Summary: Task checklist for tuning public-page visual parity using the JS-canonical Pyxis visual suite.
---

# Tasks

## Phase 0 — Setup and measurement

- [x] Create focused tuning ticket.
- [x] Start detailed diary.
- [ ] Capture current full-suite baseline in ticket artifacts.
- [ ] Capture Shows semantic diagnostics in ticket artifacts.
- [ ] Inspect relevant diff images before editing CSS.

## Phase 1 — Shows header and mailing list

- [ ] Tune Shows header spacing/height/position.
- [ ] Tune Shows mailing-list CTA spacing/height/position.
- [ ] Re-run Shows diagnostics and full public-page suite.
- [ ] Commit coherent tuning batch.

## Phase 2 — Shows list/content

- [ ] Tune Shows list grid/card spacing and vertical rhythm.
- [ ] Re-run Shows diagnostics and full public-page suite.
- [ ] Commit coherent tuning batch.

## Phase 3 — Expand beyond Shows

- [ ] Re-rank pages/sections by residual diff after Shows tuning.
- [ ] Tune next highest-impact public page section.
- [ ] Record playbook notes.

## Hygiene

- [ ] Keep generated runtime artifacts out of commits.
- [ ] Move one-off experiment scripts under this ticket's `experiments/` folder.
- [ ] Promote only stable reusable scripts into active workflow paths.
