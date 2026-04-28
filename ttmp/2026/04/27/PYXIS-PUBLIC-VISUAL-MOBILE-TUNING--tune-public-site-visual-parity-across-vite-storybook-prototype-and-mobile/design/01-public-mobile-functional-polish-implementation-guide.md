---
Title: Public Mobile Functional Polish Implementation Guide
Ticket: PYXIS-PUBLIC-VISUAL-MOBILE-TUNING
Status: active
Topics:
  - frontend
  - public-site
  - storybook
DocType: design
Intent: implementation-guide
Summary: Implementation guide for the next public-site functional polish pass covering Archive controls, booking validation UX, archive metrics, Discord link, and mobile hamburger overlay behavior.
LastUpdated: 2026-04-27T21:55:00-04:00
---

# Public Mobile Functional Polish Implementation Guide

## 1. Purpose

This guide converts the operator review findings into an implementation plan. The problems are not only visual; several are production UX and data-contract issues discovered while inspecting the mobile/public-site sweep.

The next pass should treat these as **functional polish with visual validation**, not pure CSS tuning. Each fix should include a focused manual smoke check and, where appropriate, a css-visual-diff screenshot comparison after the behavior is stable.

## 2. Reported issues

The operator reported five concrete issues:

1. Archive page date selector and recap controls do not work.
2. Booking page returns `links are required` when filling out/submitting the form.
3. Archive metrics card says `95 artists`, which looks implausibly high.
4. Discord link should be live.
5. Mobile hamburger menu should overlay content instead of folding open and pushing content down.

## 3. Implementation plan

### 3.1 Archive controls: date selector + recap

**Files to inspect first**

```text
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.css
web/packages/pyxis-user-site/src/api/hooks.ts
web/packages/pyxis-user-site/src/api/publicApi.ts
```

**Likely failure mode**

The archive controls may be visually rendered but not connected to stateful filtering/search, or the visible control labels may not match the actual values used by `ArchivePage`.

**Expected behavior**

- Search/date filter changes should update visible archive rows.
- Recap/stat controls, if interactive, should either work or be rendered as non-interactive text.
- If the prototype has non-functional decorative controls, the production site should still avoid misleading clickable UI.

**Implementation steps**

1. Reproduce on `http://localhost:3007/archive` at desktop and mobile.
2. Inspect `ArchivePage` state and the props passed to `ArchiveSearchFilters`.
3. Decide whether the date selector means:
   - filter by year,
   - sort by date,
   - or jump to a year group.
4. Wire the control to real state or remove/disable its interactivity.
5. Add Storybook states for at least:
   - all archive rows,
   - filtered year/date result,
   - no matching result.
6. Manual smoke:
   - change selector,
   - verify row count/list changes,
   - verify no console errors.

### 3.2 Booking form: `links are required`

**Files to inspect first**

```text
web/packages/pyxis-user-site/src/pages/BookPage/Page.tsx
web/packages/pyxis-user-site/src/api/hooks.ts
web/packages/pyxis-components/src/public/organisms/BookingForm/BookingForm.tsx
web/packages/pyxis-components/src/public/organisms/BookingForm/BookingForm.css
pkg/service/submission_service.go
pkg/server/public.go
```

**Known backend contract**

The backend now requires artist links. This was intentionally added during production hardening. The public form must expose a matching required field and send it in the payload.

**Expected behavior**

- The form visibly asks for artist/project links.
- The field is marked required or explained as required.
- Submitting without links shows a user-friendly inline validation message before or after server response.
- Server-side `VALIDATION_ERROR` messages are mapped to useful form copy, not a raw confusing message.

**Implementation steps**

1. Inspect the generated/shared `BookingFormData` type and current form state shape.
2. Add a `links` field if missing from the component UI.
3. Ensure `links` is included in `submitBooking` payload.
4. Add client-side validation for required links.
5. Map server validation errors to an inline form error area.
6. Update Storybook examples to include a filled links field.
7. Manual smoke with backend:
   - submit with missing links → helpful validation,
   - submit with links → success page.

### 3.3 Archive metrics: `95 artists`

**Files to inspect first**

```text
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.tsx
pkg/service/show_service.go
pkg/server/public.go
pkg/db/queries/shows.sql
```

**Likely failure mode**

The metric may be seeded/mock data, a placeholder, or a backend aggregate that counts artist rows rather than unique archive performers. It may also be a prototype copy mismatch.

**Expected behavior**

- Archive stats should be credible and explainable.
- If real data is too sparse, hide the metric or use a neutral label.
- If using seed data, avoid over-precise implausible numbers in public UI.

**Implementation options**

1. Compute unique artist names from archived shows only.
2. Rename the card to something less misleading if it is not unique artists.
3. Hide the metric until real archive data exists.
4. Use a conservative fixture value in Storybook/prototype data.

**Recommended v1**

Use the real backend unique count when available, but make Storybook/mock data conservative. If the backend currently returns `95`, inspect the aggregate query before changing copy.

### 3.4 Discord link should be live

**Files to inspect first**

```text
web/packages/pyxis-components/src/public/organisms/PubFooter/PubFooter.tsx
web/packages/pyxis-components/src/public/organisms/PubNav/PubNav.tsx
web/packages/pyxis-user-site/src/components/layout/Layout.tsx
pkg/config/config.go
cmd/pyxis/cmds/serve.go
```

**Expected behavior**

- Footer Discord link points to the real Discord invite/community URL.
- The URL should be configurable, not hardcoded if the production invite may change.
- If no configured URL exists, either hide the link or keep it as non-clickable text; do not leave `href="#"`.

**Implementation options**

1. Frontend env variable: `VITE_DISCORD_URL`.
2. Backend-served public settings endpoint.
3. Static hardcoded URL for v1.

**Recommended v1**

Use `VITE_DISCORD_URL` with a documented default if the invite is stable. If not stable, use a placeholder-free disabled rendering until the operator provides the URL.

### 3.5 Mobile hamburger menu should overlay content

**Files to inspect first**

```text
web/packages/pyxis-components/src/public/organisms/PubNav/PubNav.tsx
web/packages/pyxis-components/src/public/organisms/PubNav/PubNav.css
```

**Current behavior**

The mobile menu opens as a normal block under the nav, pushing the page content downward.

**Expected behavior**

The menu should overlay content. The closed state should still match the prototype; the open state is an implementation design because the standalone prototype does not define it.

**Implementation steps**

1. Keep header sticky.
2. Position `.pyxis-pub-nav__mobile-menu` absolutely under the nav root on mobile.
3. Use `left: 0; right: 0; top: 52px;` or equivalent.
4. Add a high z-index and background/box-shadow.
5. Ensure opening the menu does not change layout measurements of the content below.
6. Manual smoke:
   - open menu on `390x844`,
   - verify content does not move,
   - click `Archive`,
   - verify route changes and menu closes.
7. Optional visual check:
   - compare closed nav prototype-storybook mobile page,
   - inspect open Vite/Storybook manually because no prototype open-state exists.

## 4. Suggested order

1. Hamburger overlay — small, self-contained CSS/behavior fix.
2. Discord link — small, visible production polish.
3. Booking links field — functional blocker for submissions.
4. Archive controls — stateful UI correctness.
5. Archive metrics — data/query/copy decision.

## 5. Validation checklist

Run after implementation:

```bash
cd web/packages/pyxis-components && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec vite build
go test ./... -count=1
```

Manual public-site smoke on `http://localhost:3007`:

- mobile hamburger opens as overlay and navigation works;
- footer Discord link is live or intentionally hidden;
- booking submit works with links and fails gracefully without links;
- archive controls visibly affect the archive list or are not interactive;
- archive metrics are credible.

## 6. Diary requirements

Record every fix in `reference/01-visual-tuning-diary.md` with:

- command run,
- file changed,
- before/after behavior,
- any visual artifact path,
- validation result.
