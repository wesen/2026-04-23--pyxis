---
Title: Keycloak OIDC Ticket Diary
Ticket: PYXIS-AUTH-KEYCLOAK
Status: active
Topics:
  - backend
  - auth
  - production
  - release-readiness
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
  - ttmp/2026/04/27/PYXIS-AUTH-KEYCLOAK--implement-pyxis-staff-authentication-with-keycloak-oidc/design/01-pyxis-keycloak-oidc-implementation-guide.md
  - ttmp/2026/04/27/PYXIS-AUTH-KEYCLOAK--implement-pyxis-staff-authentication-with-keycloak-oidc/tasks.md
ExternalSources:
  - /home/manuel/code/wesen/hair-booking
Summary: Chronological diary for the dedicated Pyxis Keycloak/OIDC implementation ticket.
LastUpdated: 2026-04-27T20:20:00-04:00
WhatFor: Use this to understand how the Keycloak/OIDC ticket was created and what source material it copied from.
WhenToUse: Update after each Keycloak/OIDC implementation step.
---

# Keycloak OIDC Ticket Diary

## Step 1: Create dedicated ticket and copy implementation guide

The user asked to create a dedicated Pyxis Keycloak/OIDC implementation ticket, copy the implementation guide over, and add tasks to the ticket.

### What I did

- Created ticket workspace:
  - `PYXIS-AUTH-KEYCLOAK`
  - `ttmp/2026/04/27/PYXIS-AUTH-KEYCLOAK--implement-pyxis-staff-authentication-with-keycloak-oidc/`
- Copied and adapted the Keycloak implementation guidance from the production-readiness v2 document into:
  - `design/01-pyxis-keycloak-oidc-implementation-guide.md`
- Replaced the generated task stub with a phased implementation task list:
  - `tasks.md`

### Source material

The guide is based on the prior analysis of `/home/manuel/code/wesen/hair-booking`, especially:

- `docker-compose.local.yml`
- `dev/keycloak/realm-import/hair-booking-dev-realm.json`
- `pkg/auth/config.go`
- `pkg/auth/oidc.go`
- `pkg/auth/session.go`
- `pkg/server/http.go`
- `pkg/server/handlers_me.go`
- central Terraform paths under `/home/manuel/code/wesen/terraform/keycloak/apps/hair-booking`

### Key implementation principle

Do not make Keycloak a frontend-token-storage problem. Follow `hair-booking`: Keycloak login is backend-owned, the callback verifies the ID token server-side, and the app creates an HTTP-only session cookie. For Pyxis, preserve the current DB-backed staff session and role middleware first, then add Keycloak role/group mapping later if needed.

### Next steps

1. Decide client naming and role authority.
2. Add local Keycloak fixture.
3. Add OIDC config and callback handlers.
4. Keep staff route middleware working.
5. Add tests and local OIDC smoke.
