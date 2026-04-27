---
Title: Operator Production Decisions
Ticket: PYXIS-PUBLIC-PROD-SHIP
Status: active
Topics:
  - frontend
  - production
  - public-site
  - release-readiness
DocType: reference
Intent: implementation
Owners: []
RelatedFiles:
  - ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/sources/01-prod-readiness-operator-questions.schema.json
  - ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/sources/02-prod-readiness-operator-answers.json
  - ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/sources/03-prod-readiness-followup-questions.schema.json
  - ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/sources/04-prod-readiness-followup-answers.json
ExternalSources: []
Summary: "Structured operator answers collected through plz-confirm for the public-site production-readiness ticket."
LastUpdated: 2026-04-27T18:55:00-04:00
WhatFor: "Use this as the current decision record before auditing the Go backend/static embed/Dagger deployment path."
WhenToUse: "Read before starting Phase 1/T02-T04 implementation or changing the production-readiness task list."
---

# Operator Production Decisions

## Goal

This document records the production-launch decisions collected from Manuel through `plz-confirm`. The answers narrow the launch scope for `PYXIS-PUBLIC-PROD-SHIP` and define what the next audit should inspect.

## How answers were collected

I first ran:

```bash
plz-confirm help --all
plz-confirm help how-to-use
```

The default `plz-confirm` base URL returned a 404 because the active server is running on port `9876`, not the default `3000`. The working command pattern was:

```bash
plz-confirm form \
  --base-url http://localhost:9876 \
  --title "Pyxis public-site production decisions" \
  --schema @ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/sources/01-prod-readiness-operator-questions.schema.json \
  --wait-timeout 0 \
  --output json
```

The raw schemas and parsed answer JSON files are stored in `sources/`.

## Current decisions

### Production domain

```text
https://pyxis.xyz
```

### Launch scope

Manuel clarified:

```text
public website + backend (we probably already bundle the app, but that's ok, we focus on the public website)
```

Interpretation: this ticket should focus on making the public website production-ready and verifying the backend/static-embed path that serves it. It should not expand into internal admin-app launch work unless that is required by the same binary/deployment.

### Deployment target

Manuel wrote:

```text
go backend static embed (build with dagger, but I think that's already all setup?)
```

Interpretation: the next implementation step should inspect the Go backend, Dagger build, static asset embed, and route fallback behavior. The production guide should treat this as the preferred deployment topology until evidence proves otherwise.

### API topology

Manuel wrote:

```text
they are served by the same binary
```

Interpretation: use a same-origin API model. Production frontend requests should go to `/api/public/*` on the same host as the public site. `VITE_API_URL` should likely be blank for production builds, and the Go binary should route `/api/*` to backend handlers while routing public SPA paths to the embedded frontend.

Manuel's follow-up `apiBaseUrlClarified` answer was `yes`; given the first answer, interpret this as confirmation of same-origin/blank `VITE_API_URL`, not an explicit external API URL.

### Backend readiness

Manuel asked what backend readiness means:

```text
i don't know what this means?
```

Follow-up answer:

```text
yeah
```

Interpretation: backend readiness should be operationalized by us as a checklist, not assumed known by the operator. For this ticket, backend readiness means:

- the Go binary builds with the public site embedded;
- `/`, `/shows`, `/shows/:id`, `/archive`, `/book`, `/book/success`, and `/about` return the SPA shell;
- `/api/public/shows`, `/api/public/shows/:id`, `/api/public/archive`, `/api/public/archive/stats`, and `/api/public/submissions` are implemented or explicitly stubbed/blocked;
- public API responses match `proto/pyxis/v1/show.proto` and `pyxis-types` JSON decoding;
- the booking submission path creates a usable record or is intentionally disabled;
- direct refresh does not break public routes.

### Booking spam mitigation

Initial answer:

```text
none
```

Follow-up answer:

```text
none for now
```

Interpretation: no booking spam mitigation is required for the immediate v1. This is an accepted launch risk for now. The implementation should still make it easy to add honeypot/rate-limit later and should avoid pretending spam protection exists.

### Booking notification/review owner

```text
undecided
```

Interpretation: submission review/notification remains an open operational question. If the backend already stores submissions, shipping can proceed only if someone accepts that submissions will be reviewed manually later through backend/admin tools. If there is no review path at all, this becomes a launch risk.

### Content approver

```text
undecided, admin user in the backend later
```

Interpretation: there is not yet a named human content approver. For launch, either Manuel acts as temporary approver or the backend/admin user workflow needs to exist before content freeze.

### SEO / social metadata

Initial answer:

```text
none
```

Follow-up answer:

```text
what's the existing Seo component?
```

Interpretation: do not assume SEO is intentionally rejected. Manuel asked for an explanation. The existing `Seo` component is `web/packages/pyxis-user-site/src/components/Seo.tsx`. It is a small React component that renders:

- `<title>`;
- `<meta name="description">`;
- optional `noindex` robots tag;
- Open Graph tags;
- Twitter card tags;
- favicon/apple-touch icon links.

Important caveat: in a normal React SPA, rendering `<title>` and `<meta>` inside component output does not always manage document head the way libraries like `react-helmet-async` do. We need inspect current behavior before relying on it. The simplest production decision is either:

1. accept generic `index.html` metadata for v1; or
2. wire proper route metadata with a head-management library or manual document updates.

### Target launch date

```text
no urgency
```

Interpretation: there is time to audit the backend/deployment path properly instead of rushing a minimal launch.

### Accepted launch risks

```text
all good
```

Interpretation: Manuel is currently comfortable accepting pragmatic v1 risks, but the implementation should still document concrete risks as they are discovered.

## Immediate next steps from these answers

1. Audit the Go backend and Dagger build path.
2. Confirm whether the public site is already embedded in the Go binary.
3. Confirm same-origin route handling:
   - `/api/*` goes to API handlers;
   - public SPA routes go to embedded `index.html`.
4. Confirm whether the public API endpoints exist and match `pyxis-types`.
5. Treat booking spam mitigation as a deferred risk, not a launch blocker.
6. Explain/decide the SEO approach after inspecting whether `Seo.tsx` is actually usable as written.
