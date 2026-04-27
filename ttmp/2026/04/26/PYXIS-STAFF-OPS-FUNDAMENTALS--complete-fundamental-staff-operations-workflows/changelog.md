# Changelog

## 2026-04-26

- Initial workspace created.
- Added evidence line-reference bundle for relevant frontend/backend/protobuf/database files.
- Added `scripts/01-audit-staff-ops-gaps.sh` and captured its output under `sources/`.
- Wrote the primary intern-ready design and implementation guide, including ASCII screenshots, YAML shortform React markup, DB/API/protobuf changes, implementation phases, and validation plan.
- Wrote the investigation diary and updated ticket tasks/index.

## 2026-04-26

Completed Phase 0 research/design package for staff operations fundamentals, including detailed implementation guide, visual sketches, YAML shortform markup, DB/API/protobuf plan, evidence bundle, audit script, and diary.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS--complete-fundamental-staff-operations-workflows/design-doc/01-staff-operations-workflows-design-and-implementation-guide.md — Primary design and implementation guide.
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS--complete-fundamental-staff-operations-workflows/reference/01-investigation-diary.md — Chronological diary for the research/design phase.
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS--complete-fundamental-staff-operations-workflows/scripts/01-audit-staff-ops-gaps.sh — Ticket-local audit helper.


## 2026-04-26

Uploaded the staff operations fundamentals design bundle to reMarkable at /ai/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS and verified the remote listing.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS--complete-fundamental-staff-operations-workflows/reference/01-investigation-diary.md — Records doc validation and reMarkable upload evidence.


## 2026-04-26

Implemented workflows A/B foundation: show create/edit modal, lineup persistence, staff show detail route, and split staff pages into per-folder Page.tsx modules.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/queries/shows.sql — Adds lineup replacement queries.
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/repository/postgres/show_repo.go — Persists and reads show lineups during create/update/get.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx — Real controlled show editor for create/edit and lineup rows.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx — Wires workflow B edit show.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/ShowsPage/Page.tsx — Wires workflow A create show.

