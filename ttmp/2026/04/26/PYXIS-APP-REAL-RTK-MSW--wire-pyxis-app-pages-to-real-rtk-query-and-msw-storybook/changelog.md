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

