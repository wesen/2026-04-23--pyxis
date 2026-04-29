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

## 2026-04-30 — Show edit page decomposition

- Added `ShowEditHeader`, `ShowFlyerCard`, `ShowEditRail`, and `ShowEditMain` organisms with local CSS, stories, and folder-level exports.
- Refactored `ShowDetailPage` to compose the new show-edit organisms while keeping RTK Query hooks/mutations in the page.
- Preserved existing actions for edit modal, duplicate, announce/open Discord post, flyer upload/delete, cancel, and archive.
- Validated `pnpm --dir web --filter pyxis-app exec tsc --noEmit` and `pnpm --dir web --filter pyxis-app build`.

## 2026-04-30 — Show edit page visual evidence

- Added `scripts/03-capture-show-edit-stories.js` and captured Storybook evidence for `ShowEditHeader`, `ShowFlyerCard`, `ShowEditRail`, and `ShowEditMain`.
- Added `scripts/04-smoke-show-edit-page.js`; local unauthenticated route smoke reached the login route, confirming auth gating but not the authenticated edit view.
- Stored outputs under `sources/11-show-edit-storybook-captures/` and `sources/12-show-edit-route-smoke/`.

## 2026-04-30 — Authenticated show edit route smoke

- Updated `scripts/04-smoke-show-edit-page.js` to use the local `PYXIS_DEV_AUTH=1` `/auth/dev-login` flow before visiting `/shows/31`.
- Smoke now verifies the authenticated show edit route renders `Edit show`, `Basics`, and `Flyer`, opens the save-confirm dialog, and closes it with the exact `Cancel` button.
- Replaced the earlier unauthenticated login-gating smoke output with authenticated evidence in `sources/12-show-edit-route-smoke/`.
