---
Title: Show edit visual redesign changelog
Ticket: PYXIS-SHOW-EDIT-VISUAL-REDESIGN
Status: active
Topics:
  - pyxis
  - staff-app
  - design-system
  - react
  - storybook
DocType: changelog
Intent: short-term
Summary: Changelog for show edit modal/page visual redesign planning and documentation.
LastUpdated: 2026-04-29T18:40:00-04:00
---

# Changelog

## 2026-04-29 — Ticket, analysis, and design guide

- Created `PYXIS-SHOW-EDIT-VISUAL-REDESIGN` ticket workspace.
- Copied `show-admin.png` and `show-modal.png` into ticket sources as durable PNG references.
- Added reference PNG analysis, code evidence inventory, and line-anchored excerpts.
- Wrote detailed intern-oriented implementation guide for redesigning the show create/edit modal and show edit page through component decomposition.
- Added task plan covering documentation, future screenshot baseline, component decomposition, modal redesign, page redesign, validation, and delivery.

## 2026-04-29 — Widget reuse/deprecation audit

- Added `sources/06-widget-reuse-and-deprecation-audit.md`.
- Clarified which existing shared primitives, app atoms, molecules, and organisms should be reused or evolved.
- Identified likely deprecation candidates after redesign: `ShowDetailHero`, `ShowDetailInfoPanel`, portions of broad CSS buckets, and page-owned show detail styles.

## 2026-04-29 — Modal storybook-first decomposition

- Added `ShowFormSection`, `ShowLineupRowEditor`, and `FlyerDropzone` molecules with local CSS, stories, and folder-level exports.
- Refactored `NewShowModal` to compose the new molecules while preserving its external props and existing submit semantics.
- Expanded `NewShowModal` stories for create, edit with flyer, confirmed-needs-flyer, long lineup, backend error, saving, mobile, and interaction validation states.
- Validated `pnpm --dir web --filter pyxis-app exec tsc --noEmit` and `pnpm --dir web --filter pyxis-app build`.

## 2026-04-29 — Modal visual evidence and smoke

- Captured Storybook screenshots for create default, edit existing with flyer, confirmed-needs-flyer, and mobile modal states.
- Added `scripts/01-capture-new-show-modal-stories.js` and stored capture outputs under `sources/08-modal-storybook-captures/`.
- Added `scripts/02-smoke-new-show-modal-story.js` to verify required-field validation and save-draft interaction in Storybook.
- Stored smoke output in `sources/09-modal-storybook-smoke.txt`.

## 2026-04-29 — Next-session restart runbook

- Added `playbooks/01-next-session-show-edit-redesign-runbook.md`.
- Captured lessons learned: start from ticket docs, preserve decomposition layering, reuse modal molecules, avoid stale Storybook index traps, use precise screenshot selectors, avoid protobuf fixture spread pitfalls, and validate before committing.
