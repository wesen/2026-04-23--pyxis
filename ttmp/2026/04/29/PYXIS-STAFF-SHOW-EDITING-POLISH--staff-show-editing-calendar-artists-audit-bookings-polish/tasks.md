---
Title: Staff show editing polish tasks
Ticket: PYXIS-STAFF-SHOW-EDITING-POLISH
Status: active
Topics:
  - pyxis
  - staff-app
  - tasks
DocType: tasks
Intent: short-term
Summary: Task checklist for staff show editing and nearby production polish issues.
LastUpdated: 2026-04-29T16:45:00-04:00
---

# Tasks

## Phase 0 — Completed baseline and safe UI polish

Phase 0 captured the production issues, restarted the local dev environment, and fixed low-risk UI defects that did not require API changes.

## T1 — Ticket setup and analysis

- [x] T101 Create ticket workspace.
- [x] T102 Capture user-reported issues and affected files.
- [x] T103 Run `devctl up` and `devctl status` to establish a local baseline.
- [x] T104 Commit ticket setup and first low-risk fixes.

## T2 — Low-risk UI polish

- [x] T201 Remove hardcoded red `Bookings · 3` sidebar badge.
- [x] T202 Remove disabled/nonexistent `Auto-review` booking action.
- [x] T203 Make calendar day cells selectable across the full empty/bottom area while preserving event click behavior.
- [x] T204 Fix audit log filter layout overlap at narrow/medium widths.
- [x] T205 Re-check New Artist production behavior and ensure the visible `New artist` action reliably opens/focuses an empty create surface.

## Phase 1 — Show detail fidelity

Phase 1 makes the existing staff show detail page trustworthy: uploaded posters must visibly render, staff notes must be visible to staff, lineup rows must be visible on detail, and the modal must explain required/draft/optional-price behavior. This phase avoids protobuf/API changes.

## T3 — Show create/edit correctness

- [x] T301 Mark required show fields explicitly in the create/edit modal.
- [x] T302 Explain where drafts appear when saving a draft.
- [x] T303 Make reserve ticket price/copy optional instead of implicitly required/defaulted.
- [x] T304 Ensure staff notes are visible on staff show detail.
- [x] T305 Ensure uploaded flyer/poster appears in the staff poster view after create/upload and on detail reload.
- [x] T306 Ensure lineup appears in staff show detail.
- [ ] T307 Ensure lineup appears in staff show overview or another agreed staff summary surface.
- [x] T308 Hide flyer-less shows from public list/detail APIs.
- [x] T309 Prevent confirmed status unless flyer artwork is attached or selected, and show staff-facing explanation.

## Phase 2 — Staff overview data contract

Phase 2 decides and implements how the Shows overview should display richer show state such as poster/flyer and lineup summary. This likely requires extending the staff list contract rather than doing per-row detail fetches.

## T4 — Backend/API/model follow-up

- [ ] T401 Determine whether staff show list should return full `Show` records or extend `AppShow` with `flyer_url` and lineup summary.
- [ ] T402 Determine whether reserve-ticket optionality needs schema/API changes or can be represented by blank price fields today.
- [ ] T403 Add tests for any backend/API contract changes.

## Phase 3 — Validation and release

Phase 3 validates the frontend and any backend/API changes locally, records evidence, commits logical milestones, and then rolls production through the existing image/GitOps flow when requested.

## T5 — Validation and release

- [x] T501 Run TypeScript check/build for `pyxis-app`.
- [x] T502 Run targeted Go tests if API/backend code changes.
- [x] T503 Run local browser smoke against `devctl up` services.
- [x] T504 Update diary, changelog, and evidence.
- [x] T505 Commit logical milestones.
