# Changelog

## 2026-04-26

- Initial workspace created


## 2026-04-26

Created RTK Query/MSW implementation guide, phased tasks, investigation diary, and backend fixture scraping script for Storybook/MSW handoff.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/design-doc/01-rtk-query-page-wiring-and-msw-storybook-implementation-guide.md — Primary design and implementation guide
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/scripts/scrape-msw-seed.mjs — Seeded backend response scraper for MSW fixture generation
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/tasks.md — Detailed phased task list


## 2026-04-26

Started staff real-app wiring: added Vite proxy and same-origin API base URL, explicit PYXIS_DEV_AUTH dev login, fixed full-height app shell, removed atom CSS masking, and validated staff build/storybook.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/queries/auth.sql — Adds UpsertDevUser query for local staff API testing.
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/auth.go — Adds explicit PYXIS_DEV_AUTH-gated dev login endpoint.
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/auth_service.go — Adds dev session creation using normal sessions table.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/appApi.ts — Defaults API base URL to same-origin for Vite proxy and production.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/shell/AppShell.css — Changes prototype fixed-height shell into full-height app shell.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/styles/global.css — Removes component CSS imports now owned by atoms.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/vite.config.ts — Adds staff Vite proxy for /api


## 2026-04-26

Removed staff page mock fallbacks: route pages now render explicit loading/error/empty states and detail routes read params plus real RTK Query data.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/Pages.tsx — Removes seed fallbacks from staff pages and wires detail routes to real route params/query data.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/pages.css — Adds page-state styling for loading/error/empty panels.


## 2026-04-26

Added staff RTK mutation surface and wired first real UI actions for booking approve/decline and show cancel, with Vite-proxy mutation smoke validation.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/appApi.ts — Adds staff RTK Query mutations with protobuf response decoding and tag invalidation.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/endpoints.ts — Adds staff mutation endpoint paths.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/Pages.tsx — Wires booking approve/decline and show cancel UI callbacks to real mutations.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/pages.css — Adds action error styling for failed mutations.


## 2026-04-26

Split staff page stories into per-page Page.stories.tsx files and added MSW-backed mutation interaction stories for booking approve/decline.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/.storybook/preview.tsx — Adds router initialEntries support for route-param stories.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/mockHandlers.ts — Expands protobuf-shaped MSW handlers and mutation state for staff page stories.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages — Per-page Storybook folders with Page.stories.tsx files.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/storybook.tsx — Shared page story helpers for fresh mock state and route-param stories.


## 2026-04-26

Added staff page loading/error/empty Storybook variants for Shows and Bookings using story-level MSW handlers.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/BookingsPage/Page.stories.tsx — Adds loading/error/empty state stories with protobuf-shaped MSW responses.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/ShowsPage/Page.stories.tsx — Adds loading/error/empty state stories with protobuf-shaped MSW responses.


## 2026-04-26

Completed Phase 5 mutation wiring: show archive/announce/cancel, settings toggles, attendance row actions, and calendar create hold/blocked actions with validation and real API smoke.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/SettingsToggleRow/SettingsToggleRow.tsx — Makes settings rows clickable mutation affordances.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/AttendancePanel/AttendancePanel.tsx — Adds row-level attendance update action affordance.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/SettingsPanel/SettingsPanel.tsx — Adds callbacks for settings toggle mutations.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/Pages.tsx — Wires remaining visible page mutation actions with unwrap success/error handling.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/pages.css — Adds success and inline action styling for mutation feedback.


## 2026-04-26

Completed fixture scrape and full validation: captured real backend JSON for public/staff endpoints through Vite proxy and ran full Go/web build ladder.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/scripts/scrape-msw-seed.mjs — Ticket-local scraper used with dev-auth session cookie.
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/sources/01-msw-seed-real-backend.json — Real backend scraped fixture evidence for public and staff endpoints.


## 2026-04-26

Completed Phase 8 CalendarEvent proto cleanup: unified calendar endpoint now returns CalendarEventList, frontend decodes generated CalendarEvent, and calendar stories/MSW use protobuf fixtures.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/app.go — GET /api/app/calendar now returns unified CalendarEventList.
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/public.go — Adds domain-to-CalendarEvent mapping helpers.
- /home/manuel/code/wesen/2026-04-23--pyxis/proto/pyxis/v1/show.proto — Adds CalendarEventKind
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/appApi.ts — Decodes calendar endpoint with CalendarEventListSchema.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/CalendarEventChip/CalendarEventChip.tsx — Uses enum status with StatusDot while preserving data-status tone.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-types/src/app.ts — Removes hand-written CalendarEvent.


## 2026-04-26

Ran end-to-end current-status test across DB, backend APIs, Vite apps, Storybook, full web/go builds, and embedded public site; fixed staff session cookie validation and calendar duplicate React keys.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/auth.go — Session endpoint now validates the session cookie when no context user is present.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/CalendarMonth/CalendarMonth.tsx — Calendar event keys include kind/id/date/label to avoid duplicate-key warnings.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/CalendarMonthPanel/CalendarMonthPanel.tsx — Calendar event keys include kind/id/date/label to avoid duplicate-key warnings.

