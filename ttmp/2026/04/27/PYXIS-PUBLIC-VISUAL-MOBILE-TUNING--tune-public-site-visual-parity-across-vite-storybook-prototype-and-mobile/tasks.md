---
Title: Public Site Visual + Mobile Tuning Tasks
Ticket: PYXIS-PUBLIC-VISUAL-MOBILE-TUNING
Status: active
Topics:
  - frontend
  - storybook
  - public-site
DocType: tasks
Intent: implementation
Summary: Task list for public-site CSS and visual parity tuning across Vite, Storybook, prototype, desktop, and mobile.
LastUpdated: 2026-04-27T20:35:00-04:00
---

# Public Site Visual + Mobile Tuning Tasks

## Phase 0: Ticket setup and baseline recovery

- [x] **T00 — Create docmgr ticket workspace**
  - Ticket: `PYXIS-PUBLIC-VISUAL-MOBILE-TUNING`.
  - Scope: public site CSS/visual parity, Vite-vs-Storybook, Vite-vs-prototype, desktop and mobile.

- [x] **T01 — Create chronological diary**
  - Diary: `reference/01-visual-tuning-diary.md`.

- [x] **T02 — Recover previous css-visual-diff loop from recent diaries/playbooks**
  - Read prior visual tuning docs and record the focused section workflow.

## Phase 1: Make comparison targets explicit

- [ ] **T03 — Start/verify all visual servers**
  - `make dev` for backend + public Vite + staff Vite.
  - `pyxis-user-site` Storybook on `6007`.
  - prototype static server on `7070`.

- [ ] **T04 — Add ticket-local Vite-vs-Storybook comparison wrapper**
  - Compare `http://localhost:3007/` to Storybook iframe for Shows desktop.
  - Include at least `page`, `content`, and `mailing-list` selectors.
  - Store script in `scripts/01-compare-vite-storybook.sh` or equivalent.

- [ ] **T05 — Add ticket-local Vite-vs-prototype comparison wrapper**
  - Compare `http://localhost:7070/standalone/public/shows.html` to `http://localhost:3007/`.
  - Include at least the mailing-list/stay-in-loop section.

- [ ] **T06 — Add mobile visual spec coverage**
  - Add mobile variants for public pages or ticket-local mobile exploratory config.
  - Cover Shows, Show Detail, Archive, Book, About.

## Phase 2: Diagnose Shows desktop mismatch

- [ ] **T07 — Compare Shows mailing-list / Stay in the loop**
  - Compare prototype vs Storybook.
  - Compare Storybook vs Vite.
  - Compare prototype vs Vite.
  - Record changed percentages and artifact paths in diary.

- [ ] **T08 — Inspect typography and spacing for mailing-list elements**
  - Inspect title, copy, input, and button computed styles.
  - Identify whether drift is from global CSS, component CSS, Storybook wrapper, data/fixture, or app route shell.

- [ ] **T09 — Tune mailing-list CSS/data intentionally**
  - Make one change at a time.
  - Re-run the same three comparisons.

## Phase 3: Broader desktop pass

- [ ] **T10 — Run focused desktop checks for public nav/header**
- [ ] **T11 — Run focused desktop checks for Shows list**
- [ ] **T12 — Run focused desktop checks for Show Detail ticket card**
- [ ] **T13 — Run focused desktop checks for Archive, Book, and About content sections**

## Phase 4: Mobile pass

- [ ] **T14 — Establish mobile viewport and routes**
  - Use the same mobile viewport as Storybook `pyxisMobile` or define a canonical one if needed.

- [ ] **T15 — Compare mobile Shows page**
- [ ] **T16 — Compare mobile Show Detail page**
- [ ] **T17 — Compare mobile Archive page**
- [ ] **T18 — Compare mobile Book page**
- [ ] **T19 — Compare mobile About page**

## Phase 5: Validation and handoff

- [ ] **T20 — Run TypeScript/build validation**
  - `cd web/packages/pyxis-components && pnpm exec tsc --noEmit`
  - `cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit`
  - `cd web/packages/pyxis-user-site && pnpm exec vite build`

- [ ] **T21 — Build final visual review bundle if useful**
  - Use the prior review-site generator if the comparison set is broad enough.

- [ ] **T22 — Update diary and changelog with final decisions**

- [ ] **T23 — Commit visual tuning changes at logical milestones**
