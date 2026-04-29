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
