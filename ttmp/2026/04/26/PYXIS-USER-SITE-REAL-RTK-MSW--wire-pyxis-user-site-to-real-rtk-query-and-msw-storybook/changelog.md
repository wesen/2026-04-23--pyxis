# Changelog

## 2026-04-26

- Initial workspace created


## 2026-04-26

Created public user-site RTK Query/MSW implementation guide, phased task list, diary, and unauthenticated fixture scraping script.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-USER-SITE-REAL-RTK-MSW--wire-pyxis-user-site-to-real-rtk-query-and-msw-storybook/design-doc/01-user-site-rtk-query-and-msw-storybook-implementation-guide.md — Primary implementation guide
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-USER-SITE-REAL-RTK-MSW--wire-pyxis-user-site-to-real-rtk-query-and-msw-storybook/scripts/scrape-public-msw-seed.mjs — Public fixture scraper
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-USER-SITE-REAL-RTK-MSW--wire-pyxis-user-site-to-real-rtk-query-and-msw-storybook/tasks.md — Phased task checklist


## 2026-04-26

Implemented public user-site RTK/MSW phase: same-origin Vite proxy, protobuf-shaped MSW envelopes, MSW v2 page stories, archive and booking error states, and build validation.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/mocks/handlers.ts — Updated public list handlers to return protobuf wrapper envelopes.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/api/publicApi.ts — Changed default API base URL to same-origin empty string while preserving VITE_API_URL override.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/Archive.tsx — Added archive list and stats error states.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/Book.tsx — Added booking mutation error handling and display.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/stories/Archive.stories.tsx — Converted archive stories to MSW v2 handlers with ArchivedShowList envelope responses.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/stories/Book.stories.tsx — Converted booking stories to MSW v2 handlers with camelCase BookingConfirmation responses.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/stories/ShowDetail.stories.tsx — Converted show detail stories to MSW v2 handlers and local MemoryRouter route harness.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/stories/Shows.stories.tsx — Converted shows page stories to MSW v2 handlers with ShowList envelope responses.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/vite.config.ts — Added /api


## 2026-04-26

Cleaned public user-site Storybook: serialized MSW protobuf mocks through toJson helpers, removed confusing standalone Pages/* stories, and documented component decomposition playbook references.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/docs/component-system-and-public-site-components.md — Found public-site domain component taxonomy reference.
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/06-react-widget-folder-storybook-css-organization.md — Found folder/story/CSS organization playbook for future public-site decomposition.
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/07-react-application-decomposition-and-component-reuse.md — Found page-vs-organism-vs-molecule decomposition and reuse guide.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/mocks/handlers.ts — Added protobuf JSON helper functions and returns toJson-shaped MSW responses.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/stories/PublicPages.stories.tsx — Canonical remaining public page route story harness.

