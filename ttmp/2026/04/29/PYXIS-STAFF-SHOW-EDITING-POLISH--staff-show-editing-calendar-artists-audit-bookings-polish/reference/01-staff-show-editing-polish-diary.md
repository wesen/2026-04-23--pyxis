---
Title: Staff show editing polish diary
Ticket: PYXIS-STAFF-SHOW-EDITING-POLISH
Status: active
Topics:
  - pyxis
  - staff-app
  - diary
DocType: reference
Intent: short-term
Summary: Chronological diary for staff show editing polish and related production UI fixes.
LastUpdated: 2026-04-29T16:45:00-04:00
---

# Staff show editing polish diary

## Step 1: Create ticket and establish local baseline

The user confirmed that production Discord login now works and asked to return to the staff app to address show editing and nearby production polish issues.

Reported issues:

- show poster upload not appearing in poster view;
- lineup absent from staff show overview;
- reserve ticket should be optional;
- staff notes are not shown;
- create-show modal does not identify required fields;
- draft location after modal save is unclear;
- calendar day bottom-half clicks do not select the day;
- today / May 2 appeared to have hardcoded show 42;
- New Artist modal/action does not appear to open in production;
- audit log filter fields overlap, with screenshot at `/tmp/pi-clipboard-fb71c5b3-32d8-4d73-91a4-7ccb970914fd.png`;
- sidebar Bookings always shows red `3`;
- Bookings has an unavailable `Auto-review` action.

I inspected the relevant frontend and backend files with `rg` and `read`, including:

- `web/packages/pyxis-app/src/pages/ShowsPage/Page.tsx`
- `web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx`
- `web/packages/pyxis-app/src/components/organisms/Shows/ShowsConfirmedPanel/ShowsConfirmedPanel.tsx`
- `web/packages/pyxis-app/src/components/molecules/ShowTableRow/ShowTableRow.tsx`
- `web/packages/pyxis-app/src/pages/CalendarPage/Page.tsx`
- `web/packages/pyxis-app/src/components/organisms/Calendar/CalendarMonthPanel/CalendarMonthPanel.tsx`
- `web/packages/pyxis-app/src/pages/ArtistsPage/Page.tsx`
- `web/packages/pyxis-app/src/pages/AuditLogPage/Page.tsx`
- `web/packages/pyxis-app/src/components/shell/AppSidebarMenu/AppSidebarMenu.tsx`
- `web/packages/pyxis-app/src/pages/BookingsPage/Page.tsx`
- `web/packages/pyxis-types/src/generated/proto/pyxis/v1/show_pb.ts`

I also analyzed the audit-log screenshot. The issue is a filter-row layout collision where the Entity select overlaps the Action field. The likely local fix is to add `min-width: 0` to grid labels and force controls to `width: 100%; box-sizing: border-box`.

I ran the requested local devctl baseline. First attempt:

```bash
devctl up
```

failed because a devctl state already existed and the command prompted interactively:

```text
state exists; restart (down then up)? (y/N): Error: aborted
```

I then restarted explicitly:

```bash
devctl down && devctl up && sleep 5 && devctl status
```

Result: `backend`, `app-vite`, and `site-vite` were all alive. The log paths were:

- `.devctl/logs/backend-20260429-164555.stdout.log`
- `.devctl/logs/app-vite-20260429-164555.stdout.log`
- `.devctl/logs/site-vite-20260429-164555.stdout.log`

Key analysis decisions:

- Start with low-risk UI defects that do not require API/schema changes.
- Treat flyer/lineup/staff-notes overview behavior as a contract/display investigation because staff list rows use `AppShow`, which currently lacks `flyerUrl` and `lineup`.
- Treat show 42 / May 2 as likely mock-data leakage or dev/storybook context until proven in production; `mockData.ts` contains show 42 and a May 2 event.

## Step 2: First low-risk UI fixes

I implemented the first safe frontend-only fixes:

- Removed the hardcoded red `3` badge from the Bookings sidebar item in `AppSidebarMenu.tsx`.
- Removed the disabled `Auto-review` button from `BookingsPage.tsx` because there is no backend feature behind it.
- Made the entire non-empty calendar day cell clickable in `CalendarMonthPanel.tsx`, while keeping day-header and event buttons from bubbling incorrectly.
- Added `cursor: pointer` to selectable calendar cells.
- Hardened `.app-filter-grid` in `pages.css` with `min-width: 0`, `box-sizing: border-box`, and `width: 100%` so audit filter controls cannot overlap at narrow/medium widths.
- Updated `ArtistsPage.tsx` so pressing `New artist` clears the draft, scrolls the editor panel into view, and focuses the Name input. The current production behavior is a split-panel editor rather than a modal, so this makes the existing UI visibly react without changing the route architecture.

Validation:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
```

Both passed. Evidence was saved to:

```text
sources/01-low-risk-ui-fixes-validation.txt
```

One TypeScript issue came up after removing the hardcoded badge: the tuple inference in `AppSidebarMenu.tsx` no longer exposed an optional fourth tuple element during destructuring. I fixed this by typing `navSections` as `readonly AppNavSection[]` instead of relying on the narrow `as const satisfies` tuple union.

## Step 3: Draft discoverability and show-modal clarity

I implemented the first show-modal clarity fixes:

- Added a `Drafts` filter to `ShowsFilterBar` and `ShowsPage` so draft shows have an obvious staff location.
- Updated the create/edit modal subtitle to say fields marked `*` are required for confirmed shows.
- Marked Artist / act name and Date with `*`; Date remains optional when saving an explicit draft.
- Changed the default price/reserve-ticket field from `$10` to blank and renamed it `Reserve ticket / price` with an `Optional` placeholder.
- Added helper copy explaining that drafts stay staff-only under Shows → Drafts, and that reserve ticket / price can be left blank.
- Updated the calendar-created show default price to blank as well.
- Updated `ShowsFilterBar` stories for the new Drafts filter.

Validation:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
```

Both passed. Evidence was saved to:

```text
sources/02-show-modal-draft-required-validation.txt
```

Remaining show-editing work is now focused on data display fidelity: staff notes, flyer/poster visibility, and lineup visibility. Those likely need detail-page work and/or an `AppShow` list contract extension because `AppShow` currently lacks `flyerUrl` and `lineup`.

## Step 4: Split remaining work into phases and implement Phase 1

The user asked to split the remaining work into phases and implement Phase 1. I updated `tasks.md` with:

- Phase 0: completed baseline and safe UI polish.
- Phase 1: show detail fidelity without API/protobuf changes.
- Phase 2: staff overview data contract for richer list data.
- Phase 3: validation and release.

Phase 1 implementation focused on making the existing show detail page trustworthy before changing the staff list API:

- Added immediate local flyer URL state in `ShowDetailPage` so an uploaded poster/flyer appears without waiting for a refetch/render race.
- Kept RTK invalidation intact so the canonical show detail still reloads from the backend.
- Added flyer preview rendering in `FlyerField`; image URLs now render as an actual image instead of only a text path. Non-image/PDF attachments still show an attached-file preview and open link.
- Added a Lineup panel on show detail using the full `Show.lineup` data.
- Added a Staff notes panel on show detail using `Show.notes`.
- Added a Public description panel when `Show.description` is non-empty.
- Added small route CSS for lineup and pre-wrapped notes text.

Validation:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
node ttmp/2026/04/29/PYXIS-STAFF-SHOW-EDITING-POLISH--staff-show-editing-calendar-artists-audit-bookings-polish/scripts/01-phase1-show-detail-smoke.js
```

The first attempt at the browser smoke script failed because `playwright` is installed under the `web` workspace, not root `node_modules`:

```text
Error: Cannot find module 'playwright'
```

I fixed the script by using `createRequire(path.join(process.cwd(), 'web', 'package.json'))` so it resolves the workspace dependency. The smoke then passed and created/opened a local show detail page:

```json
{
  "ok": true,
  "url": "http://localhost:3008/shows/31"
}
```

Evidence:

- `sources/03-phase1-show-detail-smoke.txt`
- `sources/04-phase1-validation-summary.txt`

## Step 5: Public visibility requires flyer/poster

The user clarified the product rule after verifying the local flyer confusion: poster equals flyer, and a show without a flyer should not be publicly viewable.

I implemented this as a service-level public visibility rule in `pkg/service/show_service.go`:

- `ListUpcoming` now filters repository upcoming shows to only those with a non-blank `FlyerURL`.
- `GetPublicByID` now returns `ErrNotFound` for confirmed/upcoming shows without a non-blank `FlyerURL`.
- Draft/hold/blocked/cancelled/archived/past shows remain hidden as before.

I chose the service layer instead of SQL as the first cut so the public business rule is centralized and covered by focused service tests. A later data-contract phase can push the predicate down into SQL if list sizes grow.

Validation:

```bash
gofmt -w pkg/service/show_service.go pkg/service/show_service_test.go
go test ./pkg/service -count=1
```

Result:

```text
ok github.com/go-go-golems/pyxis/pkg/service
```

After committing the service rule, I restarted the local dev stack so the backend process picked up the new code:

```bash
devctl down && devctl up && sleep 3 && curl -s http://localhost:8080/api/public/shows | jq '[.shows[]? | {id, flyerUrl}]' && devctl status
```

The public list now only returned shows with flyer URLs in the local DB. Evidence was saved to:

```text
sources/06-public-flyer-visibility-devctl-restart.txt
```

## Step 6: Make flyer-less confirmed status impossible and visible to staff

The user clarified that the backend/staff UI should also communicate the flyer rule: if poster equals flyer, then a show without a flyer should not be confirmable, so staff can understand why it is not public.

Backend/service changes:

- Added `validateShowStatus` in `pkg/service/show_service.go`.
- `Create` and `Update` now reject `confirmed` shows unless `FlyerURL` is non-blank.
- Public list/detail filtering from Step 5 remains in place.
- Added service tests proving create/update reject confirmed shows without flyers and allow confirmed shows with flyers.

Frontend/staff changes:

- `NewShowModal` now treats Confirmed as unavailable until the current show has a flyer or the staff member selected a flyer file in the modal.
- The status option reads `Confirmed — needs flyer` while blocked.
- The modal shows warning copy: confirmed shows need a flyer/poster before they can appear publicly.
- Save validation now says: `Confirmed shows require an uploaded flyer. Save as draft/hold until poster artwork is attached.`
- Create flows in Shows, Dashboard, and Calendar now handle confirmed-with-selected-flyer safely by creating a draft first, uploading the flyer, then updating the show to confirmed with the uploaded URL. This avoids violating the backend rule during the two-step upload flow.
- Show detail edit uploads a newly selected flyer before saving a confirmed update, so an edit can attach artwork and confirm in one modal submission.

Validation:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
go test ./pkg/service -count=1
node ttmp/2026/04/29/PYXIS-STAFF-SHOW-EDITING-POLISH--staff-show-editing-calendar-artists-audit-bookings-polish/scripts/01-phase1-show-detail-smoke.js
```

The first smoke rerun failed because `getByLabel(/flyer/i)` also matched the Status select text `Confirmed — needs flyer`. I fixed the smoke to target the file input directly:

```js
page.locator('input[type="file"][accept="image/*,.pdf"]').setInputFiles(flyerPath)
```

The smoke then passed and created/opened:

```json
{
  "ok": true,
  "url": "http://localhost:3008/shows/32"
}
```

Evidence:

- `sources/07-confirmed-show-requires-flyer-smoke.txt`
- `sources/08-confirmed-status-requires-flyer-validation.txt`

## Step 7: Add flyer column to staff Shows overview

The user clarified that we do not need lineup information in the overview; staff mainly need flyer readiness. I implemented a Flyer column in the staff Shows table.

Implementation:

- `appApi.getShows` already receives full `Show` records from `/api/app/shows`; it now preserves `show.flyerUrl` as an extra staff-list field while still using the generated `AppShow` shape for the rest of the row.
- `ShowsTable` adds a `Flyer` header in the full table variant.
- `ShowTableRow` renders:
  - a small flyer thumbnail plus `Ready` when `flyerUrl` is present;
  - a warning pill `Needs flyer` when missing.
- No lineup summary was added by request.

Validation:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
```

Both passed. Evidence:

```text
sources/09-staff-flyer-column-validation.txt
```

## Step 8: Make Shows table date column flexible

The user noticed that the staff Shows table date column was still fixed at `130px`, which made the new Flyer column squeeze the table. I changed the date column CSS from a fixed width to a minimum width plus automatic table sizing:

```css
.app-shows-table th:nth-child(2),
.app-shows-table td[data-cell='date'] {
  min-width: 96px;
  width: auto;
}
```

Validation:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
```

Both passed. Evidence:

```text
sources/10-resizable-date-column-validation.txt
```

## Step 9: Put Reserve ticket behind an explicit flag

The user clarified the desired semantics: `price` should remain price display text, while the public “Reserve ticket” affordance should be behind a dedicated flag that defaults to false.

Implementation:

- Added database migration `000006_add_show_reserve_ticket_enabled` with `reserve_ticket_enabled BOOLEAN NOT NULL DEFAULT false` on `shows`.
- Added `reserve_ticket_enabled` to `Show` and `AppShow` protobuf messages and regenerated Go/TypeScript code with `make generate`.
- Added `ReserveTicketEnabled` to `domain.Show`, repository create/update params, and row mapping.
- Mapped the flag through `protoToDomainShow` and `showToProto`.
- Updated the staff show modal:
  - `Price` is now explicitly optional display text.
  - Added an unchecked-by-default checkbox: `Show “Reserve ticket” call-to-action publicly`.
  - Helper copy explains that the public CTA is behind the flag and off by default.
- Updated public show detail to render `ReserveTicketCard` only when `show.reserveTicketEnabled` is true.
- Updated public show tiles so the pill says `Reserve ticket →` only when the flag is true; otherwise it says `Learn more →`.

Validation:

```bash
make generate
pnpm --dir web --filter pyxis-types build
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-user-site exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
pnpm --dir web --filter pyxis-user-site build
go test ./pkg/server ./pkg/service ./pkg/repository/postgres -count=1
```

All passed after fixing a missing JSX brace in `ShowDetailPage` and rebuilding `pyxis-types` so workspace consumers saw the new generated field.


## 2026-04-30: Confirmed flyer validation surfaced as internal error

A local edit on `/shows/4` reported:

```json
{ "code": "INTERNAL_ERROR", "message": "confirmed shows require an uploaded flyer" }
```

There were two problems. First, the service validation returned a plain `fmt.Errorf`, so `respondError` could not classify it as `service.ErrValidation` and fell through to the default 500/internal bucket. I changed `validateShowStatus` to wrap the sentinel:

```go
fmt.Errorf("%w: confirmed shows require an uploaded flyer", ErrValidation)
```

Second, the show detail page can have a freshly uploaded rail flyer in `localFlyerUrl` while `show.flyerUrl` from RTK Query is still stale. Saving the edit modal without selecting a new modal flyer could send the stale empty `flyerUrl`, causing the confirmed-show validation to reject the update even though the user had just uploaded a flyer. I changed `handleUpdateShow` to preserve `nextShow.flyerUrl || visibleFlyerUrl || ''` before PATCHing.

Validation passed:

```text
go test ./pkg/service ./pkg/server -count=1
pnpm --dir web --filter pyxis-app exec tsc --noEmit
```


## 2026-04-30: Shows overview still said Needs flyer

After fixing confirmed-show saves, the `/shows` overview still displayed `Needs flyer` for rows whose edit view displayed a flyer. The cause was in the staff API adapter: `getShows` builds an `AppShow` generated protobuf message with `create(AppShowSchema, ...)`, but `AppShow` does not currently define `flyer_url`. I had tried to include `flyerUrl` in that object literal with a TypeScript cast, but protobuf `create()` drops unknown fields at runtime.

I fixed the mapping by first creating the generated `AppShow`, then assigning the local UI-only `flyerUrl` property afterward:

```ts
const appShow = create(AppShowSchema, { ... }) as AppShow & { flyerUrl?: string };
appShow.flyerUrl = show.flyerUrl;
```

This keeps the current lightweight UI model while allowing `ShowTableRow` to render `Ready` and the thumbnail. A cleaner future schema change would add `flyer_url` to `AppShow` and regenerate types.


## 2026-04-30: Shows overview flyer preview polish

After flyer readiness was fixed, the overview still had two UX issues: flyer-ready rows said `Ready`, and `Needs flyer` used a one-off pill style rather than the same widget family as the `Confirmed` status. I changed the full show table row so:

- flyer-ready rows show only a compact thumbnail button;
- clicking the thumbnail calls `onPreviewFlyer`;
- flyer-missing rows render `<StatusPill tone="draft">Needs flyer</StatusPill>`.

I threaded `onPreviewFlyer` through `ShowsConfirmedPanel` and `ShowsTable`, then added a preview in `ShowsPage` using the shared `Modal` component from `pyxis-components` and the existing `Button` for the footer close action.

Validation passed with TypeScript, then a Playwright smoke logged in through dev auth, opened `/shows`, clicked `Preview flyer for Open Mic Night`, waited for the dialog, confirmed there are no literal `Ready` labels, and captured `sources/10-shows-flyer-preview.png`.


## 2026-04-30: Empty age badge fallback

The Shows table could render an empty age badge when a show had no age text. I updated the shared `AgeBadge` atom to normalize blank string children to `—`, so all existing age-badge call sites get the fallback without per-table conditionals. TypeScript validation passed.
