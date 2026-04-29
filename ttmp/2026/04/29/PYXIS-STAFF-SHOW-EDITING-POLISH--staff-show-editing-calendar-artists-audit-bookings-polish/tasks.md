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

## T3 — Show create/edit correctness

- [ ] T301 Mark required show fields explicitly in the create/edit modal.
- [ ] T302 Explain where drafts appear when saving a draft.
- [ ] T303 Make reserve ticket price/copy optional instead of implicitly required/defaulted.
- [ ] T304 Ensure staff notes are visible on staff show detail and/or overview where appropriate.
- [ ] T305 Ensure uploaded flyer/poster appears in the staff poster view after create/upload and on detail reload.
- [ ] T306 Ensure lineup appears in staff show overview or another agreed staff summary surface.

## T4 — Backend/API/model follow-up

- [ ] T401 Determine whether staff show list should return full `Show` records or extend `AppShow` with `flyer_url` and lineup summary.
- [ ] T402 Determine whether reserve-ticket optionality needs schema/API changes or can be represented by blank price fields today.
- [ ] T403 Add tests for any backend/API contract changes.

## T5 — Validation and release

- [x] T501 Run TypeScript check/build for `pyxis-app`.
- [ ] T502 Run targeted Go tests if API/backend code changes.
- [ ] T503 Run local browser smoke against `devctl up` services.
- [x] T504 Update diary, changelog, and evidence.
- [x] T505 Commit logical milestones.
