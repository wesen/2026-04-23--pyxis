---
Title: Investigation Diary
Ticket: PYXIS-USER-SITE-REAL-RTK-MSW
Status: active
Topics:
    - frontend
    - rtk-query
    - storybook
    - msw
    - protobuf
    - api-integration
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/26/PYXIS-USER-SITE-REAL-RTK-MSW--wire-pyxis-user-site-to-real-rtk-query-and-msw-storybook/scripts/scrape-public-msw-seed.mjs
      Note: Public unauthenticated backend response scraper for MSW fixture generation.
    - Path: ttmp/2026/04/26/PYXIS-USER-SITE-REAL-RTK-MSW--wire-pyxis-user-site-to-real-rtk-query-and-msw-storybook/tasks.md
      Note: Phased implementation checklist for intern handoff.
ExternalSources: []
Summary: Chronological investigation diary for the Pyxis public user site RTK Query and MSW Storybook wiring plan.
LastUpdated: 2026-04-26T13:40:00-04:00
WhatFor: Use this diary to understand the public-site-specific RTK Query/MSW analysis, what evidence was gathered, and what implementation phases are recommended.
WhenToUse: When continuing the public user site real-data wiring ticket or reviewing the public Storybook/MSW protobuf-shape gaps.
---


# Diary

## Goal

Record the investigation and design process for wiring the unauthenticated Pyxis public user site to the real Go backend via RTK Query, Vite proxy, protobuf-shaped responses, and deterministic MSW Storybook handlers.

## Step 1: Public User Site RTK/MSW Investigation and Guide

The user asked for a separate ticket focused on the public user site because it does not require authentication and is therefore a better starting point for real runtime API wiring. I created the ticket, inspected the public RTK Query slice, page components, Storybook setup, shared MSW handlers, generated type exports, and backend public route registry.

The main finding is that the public runtime is much closer than the staff app: `Shows.tsx`, `ShowDetail.tsx`, and `Book.tsx` already use RTK Query patterns. The major issue is Storybook/MSW drift. Shared handlers and story-specific mocks still return raw arrays or snake_case fields, while `publicApi.ts` expects protobuf list wrappers and camelCase JSON decoded with `fromJson`.

### Prompt Context

**User prompt (verbatim):** "Ok, do the same analysis for the user site, ebcause I think we will start from there, because it doesn't require authentication. Create a separate ticket and do the same kind of exhaustive analysis. There might also be gaps in how rtk-query and protobuf datastructures (which should ideally be the same/overlap as the app side ones?) and how the storybook is organized, so keep an eye on that. reate a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet  
point sand pseudocode and diagrams and api references and file                                                                                                                                              
  references.                                                                                                                                                                                               
  It should be very clear and detailed. Store in the ticket and the nupload to remarkable.                                                                                                                  
                                                                                                                                                                                                            
You can write scripts and all kinds of other things in the scripts/ folder of the ticket."

**Assistant interpretation:** Create a new docmgr ticket and intern-ready implementation guide for the public user site, focusing on RTK Query, protobuf response shapes, Storybook/MSW organization, Vite proxy, and public fixture scraping.

**Inferred user intent:** Start real API wiring with the lower-risk unauthenticated public site, while identifying protobuf and Storybook gaps before implementation begins.

**Commit (docs):** Pending at time of diary creation.

### What I did

- Created ticket `PYXIS-USER-SITE-REAL-RTK-MSW`.
- Created design document: `design-doc/01-user-site-rtk-query-and-msw-storybook-implementation-guide.md`.
- Created diary document: `reference/01-investigation-diary.md`.
- Replaced default `tasks.md` with a phased checklist.
- Added script `scripts/scrape-public-msw-seed.mjs` for unauthenticated public endpoint fixture scraping.
- Inspected public site runtime and story files:
  - `web/packages/pyxis-user-site/src/App.tsx`
  - `web/packages/pyxis-user-site/src/store.ts`
  - `web/packages/pyxis-user-site/src/api/publicApi.ts`
  - `web/packages/pyxis-user-site/src/api/hooks.ts`
  - `web/packages/pyxis-user-site/src/api/endpoints.ts`
  - `web/packages/pyxis-user-site/src/pages/*.tsx`
  - `web/packages/pyxis-user-site/stories/*.stories.tsx`
  - `web/packages/pyxis-user-site/.storybook/preview.tsx`
  - `web/packages/pyxis-components/src/mocks/handlers.ts`
  - `web/packages/pyxis-types/src/index.ts`
  - `web/packages/pyxis-types/src/public.ts`
  - `pkg/server/server.go`

### Why

- The user site does not require auth, so Vite proxy and real backend testing are simpler.
- The public pages already use RTK Query and can become the reference implementation for the staff app.
- Storybook/MSW must match protobuf response shapes; otherwise page stories will fail in ways that do not reflect backend behavior.

### What worked

- The public RTK Query slice is already mostly correct and uses generated protobuf schemas.
- The public page components already demonstrate loading/error/detail-route patterns.
- The existing `PublicPages.stories.tsx` already renders real pages with Redux and MemoryRouter.
- Public endpoint scraping does not need a session cookie.

### What didn't work

- The shared MSW handlers return raw arrays for list endpoints, which no longer matches `ShowListSchema` and `ArchivedShowListSchema`.
- Several user-site stories use old-style MSW descriptor objects and old snake_case response shapes.
- `Archive.tsx` lacks an explicit error state for API failures.
- `Book.tsx` does not catch mutation errors from `mutateAsync`.

### What I learned

- Public-site runtime code is in better shape than staff-app runtime code.
- The biggest public-site risk is test/story drift, not page wiring.
- `pyxis-components` mocks are shared by public-site stories, so fixing those handlers affects both package-level component stories and full-page public stories.
- Remaining hand-written public compatibility types (`LineupEntry`, `ApiError`) should be reviewed after MSW shape fixes.

### What was tricky to build

- Distinguishing runtime readiness from Storybook readiness. The runtime pages can already query a backend, but Storybook data does not yet represent the real protobuf envelopes.
- The `ShowGrid` click API uses a reduced display type, so `Shows.tsx` reconstructs identity by matching artist/date. This works with current data but is not robust.

### What warrants a second pair of eyes

- Whether story-level old MSW descriptor objects are still supported by the installed `msw-storybook-addon`. The recommended implementation should convert them to MSW v2 `http.get`/`http.post` handlers regardless.
- Whether to delete `api/types.ts` now or wait until implementation confirms no imports rely on it.
- Whether generated public fixtures should live in `pyxis-components` (shared) or `pyxis-user-site` (app-specific).

### What should be done in the future

- Start with Phase 1: Vite proxy and relative API base URL.
- Then fix MSW response envelopes before adding or relying on more page stories.
- Run `scripts/scrape-public-msw-seed.mjs` against a seeded Go server and compare its output to current mock handlers.

### Code review instructions

- Start with `publicApi.ts` to understand expected protobuf schemas.
- Review `pyxis-components/src/mocks/handlers.ts` and confirm list endpoints return wrappers.
- Review `PublicPages.stories.tsx` as the canonical full-page story harness.
- Validate docs with `docmgr doctor --ticket PYXIS-USER-SITE-REAL-RTK-MSW --stale-after 30`.

### Technical details

**Commands run:**

```bash
docmgr ticket create-ticket --ticket PYXIS-USER-SITE-REAL-RTK-MSW --title "Wire Pyxis User Site to Real RTK Query and MSW Storybook" --topics frontend,rtk-query,storybook,msw,protobuf,api-integration
docmgr doc add --ticket PYXIS-USER-SITE-REAL-RTK-MSW --doc-type design-doc --title "User Site RTK Query and MSW Storybook Implementation Guide"
docmgr doc add --ticket PYXIS-USER-SITE-REAL-RTK-MSW --doc-type reference --title "Investigation Diary"
```

**Evidence commands:**

```bash
nl -ba web/packages/pyxis-user-site/src/api/publicApi.ts | sed -n '1,220p'
nl -ba web/packages/pyxis-user-site/src/api/hooks.ts | sed -n '1,220p'
nl -ba web/packages/pyxis-user-site/src/api/endpoints.ts | sed -n '1,120p'
find web/packages/pyxis-user-site/src/pages -maxdepth 1 -type f -name '*.tsx' -print
for f in web/packages/pyxis-user-site/stories/*.stories.tsx; do nl -ba "$f" | sed -n '1,180p'; done
nl -ba web/packages/pyxis-components/src/mocks/handlers.ts | sed -n '1,260p'
```

**Scraper usage:**

```bash
node ttmp/2026/04/26/PYXIS-USER-SITE-REAL-RTK-MSW--wire-pyxis-user-site-to-real-rtk-query-and-msw-storybook/scripts/scrape-public-msw-seed.mjs \
  --base-url http://localhost:8080 \
  --out ttmp/2026/04/26/PYXIS-USER-SITE-REAL-RTK-MSW--wire-pyxis-user-site-to-real-rtk-query-and-msw-storybook/sources/public-msw-seed.json \
  --details 3
```
