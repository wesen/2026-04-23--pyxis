---
Title: Staff show editing polish analysis and implementation plan
Ticket: PYXIS-STAFF-SHOW-EDITING-POLISH
Status: active
Topics:
  - pyxis
  - staff-app
  - show-management
  - frontend
DocType: design
Intent: short-term
Summary: Analysis and phased implementation plan for staff app show editing, calendar, artists, audit, menu, and bookings issues discovered after production deployment.
LastUpdated: 2026-04-29T16:45:00-04:00
RelatedFiles:
  - Path: web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
    Note: Show create/edit modal and validation.
  - Path: web/packages/pyxis-app/src/pages/ShowsPage/Page.tsx
    Note: Show overview/create flow.
  - Path: web/packages/pyxis-app/src/components/molecules/ShowTableRow/ShowTableRow.tsx
    Note: Staff show table row display.
  - Path: web/packages/pyxis-app/src/components/organisms/Calendar/CalendarMonthPanel/CalendarMonthPanel.tsx
    Note: Calendar day-cell click behavior.
  - Path: web/packages/pyxis-app/src/pages/ArtistsPage/Page.tsx
    Note: Artist create/edit UI.
  - Path: web/packages/pyxis-app/src/pages/AuditLogPage/Page.tsx
    Note: Audit filter layout.
  - Path: web/packages/pyxis-app/src/components/shell/AppSidebarMenu/AppSidebarMenu.tsx
    Note: Hardcoded booking badge.
  - Path: web/packages/pyxis-app/src/pages/BookingsPage/Page.tsx
    Note: Header actions and auto-review button.
ExternalSources:
  - /tmp/pi-clipboard-fb71c5b3-32d8-4d73-91a4-7ccb970914fd.png
---

# Staff show editing polish analysis and implementation plan

## User-reported symptoms

### Show editing and show overview

- Poster/flyer upload does not appear in the poster view.
- Lineup does not show in the backend staff show overview page.
- Reserve ticket should be optional.
- Staff notes are not shown.
- The create-show modal does not clearly mark which fields are required.
- It is unclear where drafts appear after saving a draft from the modal.

### Calendar

- Clicking the bottom half of a day cell does not select the day.
- May 2 / today appeared to contain a hardcoded show, and “Open show” went to show `42`.

### Artists

- The New Artist modal/action does not seem to open in production.

### Audit log

- Filter fields overlap; screenshot evidence shows the Entity select colliding with the Action field.

### Menu and bookings

- Sidebar Bookings always shows a red `3` badge.
- Bookings page has an `Auto-review` action, but no such backend feature exists.

## Current-state findings

### Low-risk local UI defects

These can be fixed without backend API changes:

1. **Bookings badge** is hardcoded in `AppSidebarMenu.tsx`:
   - `['/bookings', 'Bookings', 'mail', 3]`
   - This should become dynamic later, but the least surprising production fix is to remove it until unread/pending-count state is wired.

2. **Auto-review** is a disabled button in `BookingsPage.tsx`:
   - It advertises an unavailable feature.
   - Remove it from production UI until there is backend support and a real workflow.

3. **Calendar bottom-half click** comes from the click handler being attached only to `.app-calendar-day-button` at the top of the cell. The containing `.app-calendar-cell` has no `onClick`, so empty lower cell space is inert.
   - Add a cell-level click handler for date selection.
   - Keep event buttons stopping propagation so clicking an event still opens the event/show.

4. **Audit filter overlap** likely comes from CSS grid children having implicit min-content width. `.app-filter-grid` uses `repeat(auto-fit, minmax(150px, 1fr))`, but grid items do not explicitly set `min-width: 0`, and controls do not use `box-sizing: border-box; width: 100%`.
   - Add `min-width: 0` to labels and `width: 100%; box-sizing: border-box` to inputs/selects.
   - Consider a wider `minmax(180px, 1fr)` or a dedicated responsive breakpoint after validating.

5. **New Artist action** is not implemented as a modal. The production page has a split layout with a right-side `Panel` titled “New artist”; pressing “New artist” clears selection and draft state. On mobile or narrower screens this can look like nothing happened if the editor panel is below the roster.
   - Short-term: focus/scroll the editor when pressing New Artist and label the behavior clearly.
   - Later: if desired, convert to a modal or drawer, but that is a bigger UX decision.

### Show editing/API contract gaps

The show editing reports likely span both frontend display and data contracts.

1. **Staff show overview uses `AppShow`, not full `Show`.**
   - Generated `AppShow` currently includes id, artist, date, doors, age, price, status, genre, draw, capacity, pinned, notes, Discord IDs.
   - It does **not** include `flyerUrl` or `lineup`.
   - Therefore the overview cannot display poster/flyer or lineup without either fetching detail rows or extending the staff list contract.

2. **Show detail likely has the full `Show`.**
   - `Show` includes `lineup` and `flyerUrl`.
   - The detail page uses `FlyerField`, but the user report says the poster upload does not appear in the poster view. This may be a cache/invalidatesTags issue after upload or a page-level display gap.

3. **Staff notes exist as `notes`.**
   - The modal writes `notes` as “Staff notes”.
   - Staff show table does not render notes; detail should be checked and likely needs an explicit staff-only notes panel.

4. **Reserve ticket optionality is ambiguous in the current model.**
   - Current show modal has `price`, defaulting to `$10`.
   - There is no obvious `reserve ticket required` boolean in the inspected frontend flow.
   - Short-term UI fix: allow empty `price` and explain it as optional ticket/reservation copy.
   - If public reservation behavior depends on price, backend/public API semantics must be reviewed before changing schema.

5. **Draft visibility exists but is hidden by current default filter.**
   - `NewShowModal` can save `ShowStatus.DRAFT`.
   - Shows page counts/filters omit draft; only confirmed/hold/cancelled/archived/all are visible.
   - If a draft saves successfully and navigation does not happen or detail access fails, the user has no obvious “Drafts” bucket.
   - Add a Draft filter/count and make the modal footer explain “Save draft keeps it in Shows → Drafts.”

6. **May 2 / show 42 hardcoding likely comes from mock data or stale local dev fixtures, not production API code.**
   - `web/packages/pyxis-app/src/api/mockData.ts` has `id: 42`, `date: '2025-05-02'`, and a calendar event for show 42.
   - If production showed this, verify whether MSW/mock handlers are accidentally active in production or whether local Storybook/Vite dev was being viewed.
   - The production deployed staff app should call real `/api/app/calendar` and should not include mock events.

## Implementation phases

### Phase 1: Low-risk production UI fixes

- Remove hardcoded Bookings badge.
- Remove Auto-review button.
- Make full calendar day cell clickable.
- Fix audit filter grid sizing.
- Make New Artist action scroll/focus the editor panel so it visibly opens the create surface.

These are safe to commit together as a UI polish milestone.

### Phase 2: Show modal clarity

- Add visible required markers for required fields.
- Add helper copy explaining draft location.
- Add draft filter to Shows page so drafts are discoverable.
- Make price/reserve-ticket copy optional at the UI level.

### Phase 3: Show display fidelity

- Confirm flyer upload invalidation and detail reload behavior.
- Add staff notes display on show detail.
- Decide whether overview should fetch/display full show data or extend `AppShow` with `flyerUrl`/lineup summary.
- Add lineup summary to overview only after contract decision.

### Phase 4: Validation

- Run `devctl up` / `devctl status`.
- Run TypeScript build/check.
- Add a browser smoke script under `scripts/` if manual inspection is insufficient.
- Save evidence in `sources/`.

## First validation baseline

`devctl up` initially asked whether to restart an existing state and aborted when run non-interactively. I then ran `devctl down && devctl up && devctl status`; backend, app-vite, and site-vite were all alive.
