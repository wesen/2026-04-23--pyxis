---
Title: Diary
Ticket: PYXIS-APP-RTK-ROUTES
Status: active
Topics:
    - frontend
    - backend
    - rtk-query
    - pyxis
DocType: reference
Intent: diary
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/design/01-route-and-rtk-query-backend-freshening-guide.md
      Note: Initial design and implementation guide
    - Path: ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/scripts/01-inventory-app-api.py
      Note: Ticket helper script created and debugged
ExternalSources: []
Summary: Chronological implementation diary for wiring pyxis-app routes to backend RTK Query.
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Diary

## Goal

This diary records the follow-up ticket for wiring the responsive `pyxis-app` React package to the Go backend using RTK Query, backend response normalization, route-state handling, and mutation wiring.

## Step 1: Create RTK/routes follow-up ticket and implementation guide

The previous ticket built the UI architecture and component reuse foundation. This step creates the next ticket because the backend now exposes staff routes, and the frontend needs a focused pass to align route data, backend response shapes, RTK Query cache tags, and mutation callbacks.

The design guide is written as an intern handoff: it explains the system layers, where the files live, what the backend endpoints are, why frontend response normalization is necessary, and how to implement route state one cluster at a time without undoing visual work from the prior ticket.

### Prompt Context

**User prompt (verbatim):** "Ok, update tasks and close the ticket, create a new one to create routes + rtk-query fresheninng up now that the backend exists. Create an analysis + implementation guide in the new ticket.\n\nreate a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet  \npoint sand pseudocode and diagrams and api references and file                                                                                                                                              \n  references.                                                                                                                                                                                               \n  It should be very clear and detailed. Store in the ticket and the nupload to remarkable.                                                                                                                  \n                                                                                                                                                                                                            \nYou can write scripts and all kinds of other things in the scripts/ folder of the ticket."

**Assistant interpretation:** Close the completed pyxis-app React/component architecture ticket, open a new RTK/routes backend integration ticket, write a detailed intern-grade implementation guide, add helpful scripts, and upload the guide to reMarkable.

**Inferred user intent:** Move from component/UI architecture work into backend-connected route behavior now that the Go staff backend exists.

### What I did

- Created ticket `PYXIS-APP-RTK-ROUTES`.
- Added design guide:

```text
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/design/01-route-and-rtk-query-backend-freshening-guide.md
```

- Replaced the default `tasks.md` with a detailed implementation plan.
- Added helper script:

```text
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/scripts/01-inventory-app-api.py
```

- Ran the helper script once and fixed an initial repo-root detection bug.
- The guide documents current backend routes, frontend endpoint mismatches, recommended normalizers, route-state design, mutation clusters, visual guardrails, and validation commands.

### Why

The app currently has RTK Query hooks, but they still use prototype-era assumptions. Backend responses now include wrappers such as `{ shows }`, `{ submissions }`, `{ holds, blocked }`, `{ logs }`, and `{ entries }`. The next work needs to normalize those response shapes at the API boundary instead of leaking backend envelopes into organisms.

### What worked

- `docmgr ticket create-ticket` created the new workspace.
- The API inventory script now finds the repository root reliably by walking up until it sees `go.mod` and `web/pnpm-workspace.yaml`.
- The generated route inventory highlights one important drift immediately: the frontend has `/api/app/discord`, but the backend does not.

### What didn't work

The first version of `scripts/01-inventory-app-api.py` assumed a fixed number of parent directories from the script path and looked for the repository at `ttmp/pkg/server/server.go`, which failed with:

```text
FileNotFoundError: [Errno 2] No such file or directory: '/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/pkg/server/server.go'
```

I fixed it by adding a `find_repo_root()` helper that walks upward until it finds repo markers.

### What I learned

The backend and frontend have enough overlap to proceed, but the integration should be treated as a contract normalization project first. The route work will be safer if the frontend pages continue receiving `pyxis-types` app domain objects while the RTK Query layer handles wrappers, protobuf JSON naming, and derived Discord mappings.

### What was tricky to build

The guide needed to bridge two contexts: the previous UI architecture ticket and the newer backend files, including uncommitted backend changes in the working tree. I treated backend files as the current implementation context but kept the new ticket focused on frontend/contract integration rather than staging backend work.

### What warrants a second pair of eyes

- Confirm whether `/api/app/discord` should become a backend endpoint or whether Discord mappings should be derived from settings.
- Confirm whether `GET /api/app/shows` should continue returning protobuf `ShowList` or should expose an app-specific `AppShowList`.
- Confirm auth/CORS/cookie behavior for Vite/Storybook/dev servers before wiring credentials.

### What should be done in the future

- Implement the API normalization layer first.
- Then refactor route state one page at a time.
- Then wire mutation clusters.
- Keep visual fixture data stable in Storybook so backend data variability does not invalidate prototype comparisons.

### Code review instructions

Start with:

```text
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/design/01-route-and-rtk-query-backend-freshening-guide.md
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/tasks.md
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/scripts/01-inventory-app-api.py
```

Validate the script with:

```bash
ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/scripts/01-inventory-app-api.py
```

### Technical details

The initial route inventory reported backend staff routes including:

```text
GET /api/app/session
GET /api/app/shows
POST /api/app/shows
PATCH /api/app/shows/{id}
PATCH /api/app/shows/{id}/cancel
PATCH /api/app/shows/{id}/archive
GET /api/app/bookings
PATCH /api/app/bookings/{id}/approve
PATCH /api/app/bookings/{id}/decline
GET /api/app/artists
GET /api/app/artists/{id}
PATCH /api/app/artists/{id}
GET /api/app/calendar
POST /api/app/calendar/holds
DELETE /api/app/calendar/holds/{id}
POST /api/app/calendar/blocked
DELETE /api/app/calendar/blocked/{id}
GET /api/app/attendance
GET /api/app/attendance/{showId}
PATCH /api/app/attendance/{showId}
GET /api/app/settings
PATCH /api/app/settings
GET /api/app/audit-log
```

## Step 2: Upload RTK/routes guide to reMarkable

I uploaded the new ticket guide and task list as a bundled PDF to reMarkable so it can be reviewed away from the terminal. The bundle includes the detailed implementation guide and the task plan.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Publish the new guide to reMarkable after creating it in the ticket workspace.

**Inferred user intent:** Make the intern handoff available as a readable PDF on the device.

### What I did

- Confirmed `remarquee status`.
- Ran a dry-run bundle upload.
- Uploaded the bundle:

```bash
remarquee upload bundle \
  ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/design/01-route-and-rtk-query-backend-freshening-guide.md \
  ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/tasks.md \
  --name "PYXIS App RTK Routes Guide" \
  --remote-dir "/ai/2026/04/26/PYXIS-APP-RTK-ROUTES" \
  --toc-depth 2
```

### Why

The guide is long-form onboarding material and is easier to review as a PDF with a table of contents.

### What worked

The upload succeeded:

```text
OK: uploaded PYXIS App RTK Routes Guide.pdf -> /ai/2026/04/26/PYXIS-APP-RTK-ROUTES
```

### What didn't work

N/A.

### What I learned

The ticket bundle workflow works well for pairing the implementation guide with the task plan.

### What was tricky to build

N/A.

### What warrants a second pair of eyes

Confirm the PDF renders diagrams and code blocks legibly on reMarkable.

### What should be done in the future

Upload a final bundle again after the implementation phase changes the guide or task list significantly.

### Code review instructions

No code review needed. Verify remote path:

```text
/ai/2026/04/26/PYXIS-APP-RTK-ROUTES/PYXIS App RTK Routes Guide.pdf
```

### Technical details

The bundle contains:

```text
design/01-route-and-rtk-query-backend-freshening-guide.md
tasks.md
```
