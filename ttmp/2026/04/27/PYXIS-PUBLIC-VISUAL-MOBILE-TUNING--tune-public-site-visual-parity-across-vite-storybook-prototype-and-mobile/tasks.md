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
LastUpdated: 2026-04-27T21:55:00-04:00
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

- [x] **T03 — Start/verify all visual servers**
  - `make dev` for backend + public Vite + staff Vite.
  - `pyxis-user-site` Storybook on `6007`.
  - prototype static server on `7070`.

- [x] **T04 — Add ticket-local Vite-vs-Storybook comparison wrapper**
  - Compare `http://localhost:3007/` to Storybook iframe for Shows desktop.
  - Include at least `page`, `content`, and `mailing-list` selectors.
  - Store script in `scripts/01-compare-vite-storybook.sh` or equivalent.

- [x] **T05 — Add ticket-local Vite-vs-prototype comparison wrapper**
  - Compare `http://localhost:7070/standalone/public/shows.html` to `http://localhost:3007/`.
  - Include at least the mailing-list/stay-in-loop section.

- [ ] **T06 — Add mobile visual spec coverage**
  - Add mobile variants for public pages or ticket-local mobile exploratory config.
  - Cover Shows, Show Detail, Archive, Book, About.

## Phase 2: Diagnose Shows desktop mismatch

- [x] **T07 — Compare Shows mailing-list / Stay in the loop**
  - Compare prototype vs Storybook.
  - Compare Storybook vs Vite.
  - Compare prototype vs Vite.
  - Record changed percentages and artifact paths in diary.

- [x] **T08 — Inspect typography and spacing for mailing-list elements**
  - Inspect title, copy, input, and button computed styles.
  - Identify whether drift is from global CSS, component CSS, Storybook wrapper, data/fixture, or app route shell.

- [x] **T09 — Tune mailing-list CSS/data intentionally**
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

- [x] **T15 — Compare mobile Shows page**
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

## Phase 6: Functional polish found during mobile/public review

- [ ] **T24 — Make mobile hamburger menu overlay content**
  - Change the open menu from layout-flow block to overlay/dropdown.
  - Verify opening the menu does not push page content down.
  - Verify mobile navigation still closes after route changes.

- [ ] **T25 — Make public Discord link live**
  - Replace `href="#"` with a real configurable Discord URL or intentionally hide/disable the link.
  - Prefer `VITE_DISCORD_URL` if the invite URL may change.
  - Verify footer links on desktop and mobile.

- [ ] **T26 — Fix booking form links validation mismatch**
  - Add/verify required links field in public booking form UI.
  - Include links in the submission payload.
  - Add friendly inline validation for missing links.
  - Verify successful submission with links.

- [ ] **T27 — Fix Archive date selector / recap controls**
  - Reproduce non-working controls on `http://localhost:3007/archive`.
  - Wire controls to archive state or render them as non-interactive.
  - Add Storybook states for filtered/no-match archive views.

- [ ] **T28 — Audit Archive metrics value, especially `95 artists`**
  - Determine whether the value comes from fixture data, seed data, or backend aggregation.
  - Make the number credible or hide/rename the metric.
  - Update Storybook/mock values if needed.

- [ ] **T29 — Run functional polish validation**
  - Typecheck components and user site.
  - Build user site.
  - Run Go tests if backend/API behavior changed.
  - Record manual smoke results in the diary.
