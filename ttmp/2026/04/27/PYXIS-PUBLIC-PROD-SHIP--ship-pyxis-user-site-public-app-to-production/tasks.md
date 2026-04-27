---
Title: Public Site Production Ship Tasks
Ticket: PYXIS-PUBLIC-PROD-SHIP
Status: active
Topics:
  - frontend
  - production
  - public-site
  - release-readiness
DocType: tasks
Intent: implementation
Summary: Detailed task list for shipping pyxis-user-site to production.
LastUpdated: 2026-04-27T18:45:00-04:00
---

# Public Site Production Ship Tasks

## Phase 0: Ticket setup and handoff docs

- [x] **T00 — Create production-readiness ticket workspace**
  - Create `PYXIS-PUBLIC-PROD-SHIP`.
  - Create design doc, diary, tasks, and changelog.
  - Store the public-site production analysis in the ticket.
  - Upload the handoff bundle to reMarkable.

- [x] **T01 — Map current public-site architecture**
  - Inspect route tree, API layer, page state handling, SEO helper, Vite config, and proto schema.
  - Record file-backed evidence in the design doc.

## Phase 1: Environment and deployment topology

- [ ] **T02 — Decide production domain and API topology**
  - Decide whether the public frontend and API are same-origin or cross-origin.
  - Record production domain, API origin, and CDN/static host behavior.
  - Decide whether `VITE_API_URL` is empty or set to a production API origin.

- [ ] **T03 — Remove or classify production runtime dev assumptions**
  - Run:
    - `rg "localhost|127\\.0\\.0\\.1|6007|6008|7070|8097|placehold\\.co|mockServiceWorker" web/packages/pyxis-user-site web/packages/pyxis-components/src -S`
  - Classify findings as dev-only, story-only, mock-only, or production-risk.
  - Fix any production-risk references.

- [ ] **T04 — Configure SPA route fallback**
  - Ensure direct refresh returns `index.html` for:
    - `/`
    - `/shows`
    - `/shows/:id`
    - `/archive`
    - `/book`
    - `/book/success`
    - `/about`
  - Ensure `/api/*` routes are not swallowed by the SPA fallback.
  - Document host-specific config.

## Phase 2: API contract and real data

- [ ] **T05 — Verify public read endpoints against production-like API**
  - Verify:
    - `GET /api/public/shows`
    - `GET /api/public/shows/:id`
    - `GET /api/public/archive?search=...`
    - `GET /api/public/archive/stats`
  - Confirm JSON decodes with `pyxis-types` schemas.
  - Confirm dates/times/flyer URLs are production-valid.

- [ ] **T06 — Verify public error contracts**
  - Confirm missing show returns expected 404 behavior.
  - Confirm API failure renders friendly frontend error states.
  - Confirm archive stats failure does not break archive list.
  - Confirm invalid route IDs behave as not-found, not broken loading.

- [ ] **T07 — Align data shapes and fixtures**
  - Ensure Storybook/MSW fixtures match production schema.
  - Remove production reliance on `placehold.co` placeholders.
  - Decide whether richer lineup display fields are required before launch.

## Phase 3: Booking form hardening

- [ ] **T08 — Confirm booking form field contract**
  - Confirm required fields and optional fields.
  - Align frontend `BookingForm` fields with `BookingFormData` schema.
  - Confirm visible fields on `/book` match the desired public launch form.

- [ ] **T09 — Implement/verify server-side validation**
  - Validate artist name, preferred date, expected draw, links, message, and any contact fields server-side.
  - Return structured 400 validation errors.
  - Ensure frontend displays useful validation messages.

- [ ] **T10 — Add spam and duplicate-submission mitigation**
  - Choose at least one launch mitigation:
    - honeypot field,
    - IP rate limit,
    - captcha,
    - moderation-only queue,
    - duplicate detection.
  - Verify rapid double submits do not create duplicate actionable submissions.

- [ ] **T11 — Verify booking notification/review workflow**
  - Confirm where submissions go after creation.
  - Confirm operators receive notifications or can review pending submissions.
  - Confirm failed notifications are logged and retryable if applicable.

- [ ] **T12 — Test booking success and failure paths**
  - Valid submit navigates to `/book/success`.
  - Invalid submit shows validation.
  - Server failure shows friendly error.
  - Rate limit/spam rejection shows friendly error.

## Phase 4: SEO, content, and social metadata

- [ ] **T13 — Mount route-level SEO metadata**
  - Use or update `web/packages/pyxis-user-site/src/components/Seo.tsx`.
  - Add title/description to Shows, Show Detail, Archive, Book, Book Success, About, and Not Found.

- [ ] **T14 — Decide show-detail social preview strategy**
  - Decide whether generic SPA metadata is acceptable for v1.
  - If not, implement prerendering or server-side metadata injection for show detail routes.

- [ ] **T15 — Verify static SEO assets**
  - Confirm `robots.txt` domain.
  - Confirm `sitemap.xml` domain and route list.
  - Confirm `og-default.png` exists or update `Seo.DEFAULT_IMAGE`.
  - Confirm favicon/apple touch icon behavior.

- [ ] **T16 — Final public content review**
  - Review page copy.
  - Review dates/times/prices/age restrictions.
  - Review address/contact/booking expectations.
  - Remove prototype-only copy or placeholders.

## Phase 5: Mobile, accessibility, and browser smoke

- [ ] **T17 — Manual responsive smoke pass**
  - Test 375px, 768px, 920px, and 1440px widths.
  - Cover Shows, Show Detail, Archive, Book, About, Book Success, and Not Found.
  - Verify cards, forms, lightbox, and navigation remain usable.

- [ ] **T18 — Accessibility smoke pass**
  - Keyboard through navigation and booking form.
  - Verify visible focus states.
  - Verify form labels and button accessible names.
  - Run Storybook a11y checks or equivalent axe smoke if available.

- [ ] **T19 — Browser smoke pass**
  - Test Chrome.
  - Test Safari, including iOS Safari if available.
  - Test Firefox.
  - Record any browser-specific layout or form issues.

## Phase 6: Build, visual, and release validation

- [ ] **T20 — Run static build validation**
  - Run:
    - `cd web/packages/pyxis-components && pnpm exec tsc --noEmit`
    - `cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit`
    - `cd web/packages/pyxis-user-site && pnpm exec vite build`
    - `cd web/packages/pyxis-user-site && pnpm exec storybook build`

- [ ] **T21 — Run production-intent visual smoke**
  - Run public pages visual spec against production-intent data.
  - Keep Shows broad rows accepted unless new human feedback appears.
  - Record any launch-blocking visual regressions.

- [ ] **T22 — Deploy staging/release candidate**
  - Deploy frontend with production-like env vars.
  - Connect to production-like API.
  - Verify route refresh, API calls, booking form, and assets.

- [ ] **T23 — Record rollback procedure**
  - Document how to rollback frontend deployment.
  - Document how to disable booking submission if abuse or backend failure occurs.
  - Document who owns production incident response.

- [ ] **T24 — Release owner sign-off**
  - Confirm ship/no-ship checklist.
  - Record accepted risks.
  - Record final production URL and commit SHA.

## Phase 7: Post-launch follow-up

- [ ] **T25 — Monitor first production usage**
  - Check API error rates.
  - Check booking submissions.
  - Check frontend console/error reporting if available.
  - Check mobile feedback.

- [ ] **T26 — Convert accepted launch risks into follow-up tickets**
  - Examples:
    - richer show-detail metadata,
    - mobile visual-diff specs,
    - stronger spam mitigation,
    - CMS-backed About page,
    - richer lineup schema.
