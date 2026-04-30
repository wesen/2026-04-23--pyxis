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

## 2026-04-29 — Confirmed status requires flyer

- Made `confirmed` status invalid without a flyer at the service layer for create/update.
- Updated the staff show modal to disable/explain Confirmed until flyer artwork is present or selected.
- Updated create/edit flows to support attaching a flyer and confirming in one staff action despite the two-step file upload API.
- Updated the Phase 1 browser smoke to attach a temporary flyer and verify detail preview, lineup, and staff notes.

## 2026-04-29 — Staff flyer column

- Added a Flyer column to the staff Shows overview.
- Rows now show a small flyer thumbnail and `Ready`, or a `Needs flyer` warning pill.
- Skipped lineup overview by request.

## 2026-04-29 — Flexible date column

- Changed the staff Shows table date column from fixed `130px` to `min-width: 96px; width: auto` so it can resize alongside the new Flyer column.

## 2026-04-29 — Reserve ticket flag

- Added `shows.reserve_ticket_enabled` with default `false`.
- Added `reserveTicketEnabled` to Show/AppShow protobuf contracts and repository/server mappings.
- Changed staff modal semantics so `price` is optional display text and public Reserve ticket CTA is controlled by an explicit checkbox.
- Public show detail and show tiles now show reserve-ticket affordances only when the flag is true.

## 2026-04-30 — Confirmed flyer validation fix

- Fixed show detail saves after rail flyer upload by preserving the locally visible flyer URL when the refetched `show.flyerUrl` has not caught up yet.
- Changed the confirmed-without-flyer backend error to wrap `service.ErrValidation`, so API responses classify it as `VALIDATION_ERROR`/400 instead of `INTERNAL_ERROR`/500.
- Validation: `go test ./pkg/service ./pkg/server -count=1`; `pnpm --dir web --filter pyxis-app exec tsc --noEmit`.

## 2026-04-30 — Shows overview flyer readiness mapping fix

- Fixed staff `/shows` list flyer readiness by assigning `flyerUrl` after protobuf `create(AppShowSchema, ...)`; generated protobuf construction drops unknown fields, so the previous inline `flyerUrl` addition never reached `ShowTableRow`.
- Validation: `pnpm --dir web --filter pyxis-app exec tsc --noEmit`.

## 2026-04-30 — Shows overview flyer preview polish

- Removed the `Ready` label from flyer-ready rows; attached flyers now render as clickable thumbnails only.
- Changed `Needs flyer` to reuse the shared `StatusPill`/`Badge` widget family so it visually matches the `Confirmed` status pill style.
- Added a flyer preview modal on the Shows overview using the shared `Modal` component and existing `Button`.
- Validation: `pnpm --dir web --filter pyxis-app exec tsc --noEmit`; Playwright smoke captured `sources/10-shows-flyer-preview.png` and `sources/11-shows-flyer-preview-validation.txt`.

## 2026-04-30 — Empty age badge fallback

- Updated `AgeBadge` so blank string children render as an em dash (`—`) instead of an empty badge.
- Validation: `pnpm --dir web --filter pyxis-app exec tsc --noEmit`.
