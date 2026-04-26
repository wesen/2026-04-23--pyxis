---
Title: Investigation Diary
Ticket: PYXIS-APP-REAL-RTK-MSW
Status: active
Topics:
    - frontend
    - rtk-query
    - storybook
    - msw
    - protobuf
    - go
    - api-integration
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/scripts/scrape-msw-seed.mjs
      Note: Ticket helper script for scraping seeded backend responses into MSW fixture JSON.
    - Path: ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/tasks.md
      Note: Phased implementation checklist for intern handoff.
ExternalSources: []
Summary: Chronological investigation diary for the Pyxis app RTK Query and MSW Storybook wiring plan.
LastUpdated: 2026-04-26T12:53:03.830667737-04:00
WhatFor: Use this diary to understand how the implementation guide was created, what evidence was gathered, and what should happen next.
WhenToUse: When continuing this ticket or reviewing the recommended RTK Query/MSW integration plan.
---


# Diary

## Goal

Record the investigation and design process for wiring the Pyxis staff app pages to real RTK Query data, adding mutations, using Vite proxy for the Go backend, and making Storybook use MSW-backed protobuf-shaped mock data.

## Step 1: Ticket Setup, Evidence Gathering, and Implementation Guide

The user asked for a new docmgr ticket and a detailed implementation guide for making all app pages ready to use RTK Query and MSW, with Storybook configured to use mock data instead of a live backend. The request also called out Vite proxy as the preferred local-development strategy to avoid browser CORS problems, and suggested writing a script to scrape a seeded real server to generate MSW fixture data.

I created the ticket, inspected the current staff app page wiring, RTK Query slice, Storybook/MSW setup, Vite config, public-site query patterns, and backend route registry. The main finding is that the infrastructure is partly present: staff RTK Query reads exist, Storybook already initializes MSW, and the backend exposes most required routes. The gap is page-level cleanup, mutation wiring, complete MSW handlers, and optional fixture generation.

### Prompt Context

**User prompt (verbatim):** "Create a new docmgr ticket for making all pages ready to use rtk-query and msw, and set up msw for storybook to use mock data. Use vite proxy for the go side which would allow us to avoid the CORS if i understand correctly. Wire mutations.

Create a detailed implementation analysis and guide and stor ein ticket. Add detailed list of tasks. Maybe we can write a script to scrape the real server with seeded data to gather the msw seed data? 

reate a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet  
point sand pseudocode and diagrams and api references and file                                                                                                                                              
  references.                                                                                                                                                                                               
  It should be very clear and detailed. Store in the ticket and the nupload to remarkable.                                                                                                                  
                                                                                                                                                                                                            
You can write scripts and all kinds of other things in the scripts/ folder of the ticket."

**Assistant interpretation:** Create a new docmgr ticket with a complete design/implementation guide, task list, diary, and helper script for wiring the Pyxis staff app to real RTK Query data and Storybook MSW mock responses. Upload the deliverables to reMarkable.

**Inferred user intent:** Prepare an intern-ready handoff so implementation can proceed systematically without re-discovering the current architecture or making incorrect decisions about CORS, Storybook, or live backend dependencies.

**Commit (docs):** Pending at time of diary creation.

### What I did

- Created ticket `PYXIS-APP-REAL-RTK-MSW`.
- Created design document: `design-doc/01-rtk-query-page-wiring-and-msw-storybook-implementation-guide.md`.
- Created diary document: `reference/01-investigation-diary.md`.
- Replaced the default `tasks.md` with a phased checklist covering proxy, RTK mutations, page cleanup, route wiring, MSW handlers, fixture scraping, optional `CalendarEvent` proto cleanup, and validation.
- Added `scripts/scrape-msw-seed.mjs` to the ticket workspace.
- Inspected key evidence files:
  - `web/packages/pyxis-app/src/pages/Pages.tsx`
  - `web/packages/pyxis-app/src/api/appApi.ts`
  - `web/packages/pyxis-app/src/api/endpoints.ts`
  - `web/packages/pyxis-app/src/api/mockHandlers.ts`
  - `web/packages/pyxis-app/.storybook/preview.tsx`
  - `web/packages/pyxis-app/vite.config.ts`
  - `web/packages/pyxis-user-site/src/pages/Shows.tsx`
  - `web/packages/pyxis-user-site/src/pages/ShowDetail.tsx`
  - `web/packages/pyxis-user-site/vite.config.ts`
  - `pkg/server/server.go`

### Why

- The staff app currently mixes real RTK Query hooks with direct mock-data fallbacks. This hides broken backend connectivity.
- Storybook should keep MSW rather than hitting a live Go server, because stories need deterministic offline rendering.
- Vite proxy is the correct local-development strategy for avoiding browser CORS while preserving production-like relative `/api` URLs.
- Scraping seeded backend responses is a useful way to keep MSW fixtures realistic without making Storybook depend on the backend at render time.

### What worked

- `docmgr ticket create-ticket` created the expected workspace with `index.md`, `README.md`, `tasks.md`, and `changelog.md`.
- Existing staff Storybook already initializes `msw-storybook-addon`, so the plan can extend an existing mechanism rather than introduce a new one.
- The public site already has good loading/error/route-param examples to copy.
- Backend route registration in `pkg/server/server.go` is explicit and easy to map into RTK Query endpoints.

### What didn't work

- No command failures occurred during ticket setup or documentation writing.
- The codebase itself shows an architectural gap: `CalendarEvent` is still hand-written in TypeScript and `GET /api/app/calendar` returns holds/blocked only. This is documented as an optional cleanup phase.

### What I learned

- Staff pages are still prototype-like even though the underlying API slice is real.
- The public site is further along in page-level query ergonomics than the staff app.
- Staff app MSW handlers are present but read-only and incomplete.
- The backend route surface is richer than `appApi.ts`; mutations need to be added before the UI can operate against real data.

### What was tricky to build

- The main design tension is Storybook realism versus determinism. The right answer is to render real pages with real RTK Query hooks, but intercept the network with MSW. That gives realistic data-flow coverage without requiring a live backend.
- Fixture scraping must be treated as a fixture-refresh tool, not as a runtime dependency. Otherwise Storybook becomes flaky and database-dependent.

### What warrants a second pair of eyes

- The local auth strategy for staff endpoints. The current backend requires a session cookie for most app routes. The implementation phase should decide whether to use seeded test sessions, a dev bypass, or a temporary login helper.
- Whether to include `CalendarEvent` proto cleanup in this ticket or defer it. It is architecturally correct but not strictly required to begin page wiring.
- Whether generated MSW fixtures should live in `pyxis-app/src/api/fixtures/` or remain generated artifacts outside source control.

### What should be done in the future

- Implement Phase 1 first: Vite proxy + relative base URLs.
- Then implement Phase 2: staff app RTK Query mutations.
- Then remove page mock fallbacks and add loading/error states.
- Run the scraper against a seeded backend once auth/session setup is confirmed.

### Code review instructions

- Start with the design doc executive summary and current-state analysis.
- Review `tasks.md` for the phased implementation checklist.
- Review `scripts/scrape-msw-seed.mjs` for fixture-generation behavior and decide whether it should be copied into the main repo later.
- Validate documentation with `docmgr doctor --ticket PYXIS-APP-REAL-RTK-MSW --stale-after 30`.

### Technical details

**Commands run:**

```bash
docmgr status --summary-only
docmgr ticket create-ticket --ticket PYXIS-APP-REAL-RTK-MSW --title "Wire Pyxis App Pages to Real RTK Query and MSW Storybook" --topics frontend,rtk-query,storybook,msw,protobuf,go,api-integration
docmgr doc add --ticket PYXIS-APP-REAL-RTK-MSW --doc-type design-doc --title "RTK Query Page Wiring and MSW Storybook Implementation Guide"
docmgr doc add --ticket PYXIS-APP-REAL-RTK-MSW --doc-type reference --title "Investigation Diary"
```

**Evidence commands:**

```bash
nl -ba web/packages/pyxis-app/src/pages/Pages.tsx | sed -n '1,220p'
nl -ba web/packages/pyxis-app/src/api/appApi.ts | sed -n '1,240p'
rg -n "msw|mswDecorator|initialize|worker|handlers" web/packages -S
find web/packages -maxdepth 3 -path '*/.storybook/*' -type f -print
find web/packages -maxdepth 3 -name 'vite.config.*' -type f -print
nl -ba pkg/server/server.go | sed -n '1,220p'
```

**Script usage:**

```bash
node ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/scripts/scrape-msw-seed.mjs \
  --base-url http://localhost:8080 \
  --cookie 'session=test-session-abc' \
  --out ttmp/2026/04/26/PYXIS-APP-REAL-RTK-MSW--wire-pyxis-app-pages-to-real-rtk-query-and-msw-storybook/sources/msw-seed.json
```
