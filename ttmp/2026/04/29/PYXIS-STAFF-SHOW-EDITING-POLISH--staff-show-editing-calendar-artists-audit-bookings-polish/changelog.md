---
Title: Staff show editing polish changelog
Ticket: PYXIS-STAFF-SHOW-EDITING-POLISH
Status: active
Topics:
  - pyxis
  - staff-app
  - changelog
DocType: changelog
Intent: short-term
Summary: Change log for staff show editing polish work.
LastUpdated: 2026-04-29T16:45:00-04:00
---

# Changelog

## 2026-04-29

- Created the staff show editing polish ticket after production browser validation of `/app/` and Discord login.
- Recorded initial issue inventory spanning show editing, calendar, artists, audit log, menu, and bookings.
- Implemented first low-risk UI fixes: removed hardcoded Bookings badge, removed unavailable Auto-review action, made calendar day cells fully clickable, hardened audit filter grid sizing, and made New Artist visibly scroll/focus the editor surface.
- Validated with `pnpm --dir web --filter pyxis-app exec tsc --noEmit` and `pnpm --dir web --filter pyxis-app build`.

## 2026-04-29 — Show modal clarity

- Added a staff-visible Drafts filter to Shows.
- Marked required show modal fields and explained that date is required for non-drafts.
- Made reserve ticket / price optional by defaulting it to blank and adding helper copy.
- Validated TypeScript and production build for `pyxis-app`.

## 2026-04-29 — Phase 1 show detail fidelity

- Split remaining work into Phase 1 show-detail fidelity, Phase 2 staff overview data contract, and Phase 3 validation/release.
- Added visible show-detail panels for lineup, staff notes, and public description.
- Updated flyer handling so uploaded image flyers render as previews and recent uploads display immediately on detail.
- Added a Playwright-based local smoke script under `scripts/` and saved passing evidence under `sources/`.

## 2026-04-29 — Public flyer visibility rule

- Added a public visibility rule: confirmed upcoming shows without a flyer/poster URL are excluded from public list and detail APIs.
- Added service tests for flyer-required public detail and public upcoming list filtering.
