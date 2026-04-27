---
Title: Production Readiness Implementation Diary
Ticket: PYXIS-PUBLIC-PROD-SHIP
Status: active
Topics:
    - frontend
    - production
    - public-site
    - release-readiness
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/design-doc/01-public-site-production-readiness-analysis-and-ship-plan.md
    - ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/tasks.md
ExternalSources: []
Summary: "Chronological diary for public-site production-readiness planning and implementation."
LastUpdated: 2026-04-27T18:45:00-04:00
WhatFor: "Use this diary to understand what was investigated, what was created, what commands ran, and what remains before pyxis-user-site ships to production."
WhenToUse: "Update this after each implementation or validation step in PYXIS-PUBLIC-PROD-SHIP."
---

# Production Readiness Implementation Diary

## Step 1: Create the production-readiness ticket and map the public app

The user asked to add a ticket for shipping the public-facing app to production, with a detailed analysis/design/implementation guide, a detailed task list, a diary, and reMarkable upload. I created a new ticket workspace dedicated to the public site rather than mixing production-launch work into the earlier visual-tuning ticket.

### Prompt Context

**User prompt (verbatim excerpt):** "Add ticket for public facing app to ship to prod. create a detailed analysis / design / implementation guide ... Store in the ticket and upload to remarkable. Keep a diary. Add detailed list of tasks"

**Assistant interpretation:** Create a docmgr-backed ticket for pyxis-user-site production readiness, write a long-form implementation guide for a new developer/intern, add a detailed task plan, keep an investigation diary, and upload the deliverables to reMarkable.

**Inferred user intent:** The visual/frontend work is close enough that the next concern is launch readiness: real APIs, deployment, booking form hardening, routing, SEO, mobile/accessibility, and release validation.

### Commands run

```bash
docmgr status --summary-only

docmgr ticket create-ticket \
  --ticket PYXIS-PUBLIC-PROD-SHIP \
  --title "Ship pyxis-user-site public app to production" \
  --topics frontend,production,public-site,release-readiness

docmgr doc add \
  --ticket PYXIS-PUBLIC-PROD-SHIP \
  --doc-type design-doc \
  --title "Public Site Production Readiness Analysis and Ship Plan"

docmgr doc add \
  --ticket PYXIS-PUBLIC-PROD-SHIP \
  --doc-type reference \
  --title "Production Readiness Implementation Diary"
```

### Evidence gathered

I inspected the public-site architecture and key production-facing files:

- `web/packages/pyxis-user-site/src/App.tsx`
- `web/packages/pyxis-user-site/src/api/publicApi.ts`
- `web/packages/pyxis-user-site/src/api/endpoints.ts`
- `web/packages/pyxis-user-site/src/pages/ShowsPage/Page.tsx`
- `web/packages/pyxis-user-site/src/pages/ShowDetailPage/Page.tsx`
- `web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx`
- `web/packages/pyxis-user-site/src/pages/BookPage/Page.tsx`
- `web/packages/pyxis-user-site/src/components/Seo.tsx`
- `web/packages/pyxis-user-site/vite.config.ts`
- `proto/pyxis/v1/show.proto`

I also ran repository searches for likely production-readiness issues:

```bash
rg -n "Seo|<Seo|VITE_|localhost|127\.0\.0\.1|mockServiceWorker|MSW|placehold\.co|TODO|FIXME|captcha|honeypot|rate" \
  web/packages/pyxis-user-site web/packages/pyxis-components/src -S

rg -n "serviceWorker|worker.start|setupWorker|mockServiceWorker|initialize" \
  web/packages/pyxis-user-site/src web/packages/pyxis-components/src -S
```

The key findings were:

- The app has a clear client-side route tree in `App.tsx`.
- Public API access is centralized in RTK Query with `VITE_API_URL` support.
- Endpoint paths are centralized in `endpoints.ts`.
- Page-level loading, empty, error, and not-found states exist for several pages.
- `Seo.tsx` exists but is not mounted by route pages yet.
- Vite dev proxy uses localhost for development only.
- Mock placeholders and MSW live in mock/story code, but production data should avoid placeholder flyers.

### What I created

- Primary design/implementation guide:
  - `design-doc/01-public-site-production-readiness-analysis-and-ship-plan.md`
- Detailed task list:
  - `tasks.md`
- This diary:
  - `reference/01-production-readiness-implementation-diary.md`

### What worked

The app already has a strong frontend foundation for launch hardening. The biggest missing pieces are not visual polish; they are production concerns: API contract validation, booking form hardening, route fallback, SEO mounting, mobile/accessibility smoke, deployment topology, and release validation.

### What didn't work

No command failures occurred during ticket setup or evidence gathering.

### What was tricky to build

The main challenge was separating visual readiness from production readiness. The public pages can look acceptable and still not be safe to ship. The design doc therefore treats build/visual validation as only one launch gate among several.

### What warrants a second pair of eyes

A backend or deployment owner should review the API topology, booking anti-spam requirements, and route fallback plan before implementation starts.

### Code review instructions

This step only creates documentation. Review the ticket docs for accuracy against the current codebase and confirm the task list matches launch priorities.

### Next steps

1. Relate the key source files to the ticket docs.
2. Run docmgr validation.
3. Upload the ticket docs to reMarkable.
4. Commit the ticket workspace if desired.

## Step 2: Validate ticket docs and upload the production-readiness bundle

After writing the design guide, tasks, and diary, I related the primary design doc to the source files it analyzes, updated the changelog, ran docmgr validation, fixed vocabulary, and uploaded the handoff bundle to reMarkable.

### Commands run

```bash
docmgr doc relate --doc <design-doc> --file-note <source-file:reason>
docmgr changelog update --ticket PYXIS-PUBLIC-PROD-SHIP --entry "Created public-site production readiness analysis, detailed ship tasks, and implementation diary." ...
docmgr doctor --ticket PYXIS-PUBLIC-PROD-SHIP --stale-after 30
```

The first doctor run warned that `production` and `release-readiness` were not known topic vocabulary values. I added both:

```bash
docmgr vocab add --category topics --slug production --description "Production deployment, launch readiness, runtime operations, and release gating."
docmgr vocab add --category topics --slug release-readiness --description "Ship/no-ship validation, launch checklists, and production readiness planning."
docmgr doctor --ticket PYXIS-PUBLIC-PROD-SHIP --stale-after 30
```

The second doctor run passed:

```text
## Doctor Report (1 findings)

### PYXIS-PUBLIC-PROD-SHIP

- ✅ All checks passed
```

Then I verified and uploaded to reMarkable:

```bash
remarquee status
remarquee cloud account --non-interactive
remarquee upload bundle --dry-run \
  design-doc/01-public-site-production-readiness-analysis-and-ship-plan.md \
  tasks.md \
  reference/01-production-readiness-implementation-diary.md \
  --name "PYXIS-PUBLIC-PROD-SHIP public site production readiness" \
  --remote-dir "/ai/2026/04/27/PYXIS-PUBLIC-PROD-SHIP" \
  --toc-depth 2

remarquee upload bundle ...
remarquee cloud ls /ai/2026/04/27/PYXIS-PUBLIC-PROD-SHIP --long --non-interactive
```

The upload succeeded:

```text
OK: uploaded PYXIS-PUBLIC-PROD-SHIP public site production readiness.pdf -> /ai/2026/04/27/PYXIS-PUBLIC-PROD-SHIP
[f]	PYXIS-PUBLIC-PROD-SHIP public site production readiness
```

### What worked

The docs validate cleanly after adding the missing vocabulary terms. The reMarkable bundle upload succeeded and the remote listing shows the uploaded PDF.

### What didn't work

The first `docmgr doctor` run found missing topic vocabulary. This was expected for new release-related topics and was fixed by adding explicit vocabulary entries.

### What was tricky to build

The bundle includes three documents with different roles: design guide, task list, and diary. Keeping them separate makes the ticket easier to execute, while bundling them into one PDF makes it easier to read on reMarkable.

### Next steps

Start Phase 1 of the task list: decide production domain/API topology, classify dev assumptions, and configure SPA route fallback.
