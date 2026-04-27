---
Title: Pyxis Keycloak OIDC Implementation Tasks
Ticket: PYXIS-AUTH-KEYCLOAK
Status: active
Topics:
  - backend
  - auth
  - production
  - release-readiness
DocType: tasks
Intent: implementation
Summary: Phased task list for implementing backend-owned Keycloak OIDC staff authentication in Pyxis.
LastUpdated: 2026-04-27T20:20:00-04:00
---

# Pyxis Keycloak OIDC Implementation Tasks

## Phase 0: Ticket setup and decision capture

- [x] **T00 — Create dedicated Keycloak/OIDC ticket**
  - Create `PYXIS-AUTH-KEYCLOAK`.
  - Copy/adapt the Keycloak implementation guide from the production-readiness ticket.
  - Add this detailed task list.

- [ ] **T01 — Decide implementation scope**
  - Decide whether Keycloak is required before public launch or only before exposing staff routes.
  - Decide whether Discord OAuth remains as fallback during migration.
  - Decide whether staff routes are hidden at deployment/proxy layer until Keycloak is complete.

- [ ] **T02 — Decide Keycloak client and realm naming**
  - Choose realm name, likely `pyxis` hosted and `pyxis-dev` local.
  - Choose browser client name: `pyxis-web`, `pyxis-staff-web`, or separate public/staff clients.
  - Decide whether public and staff apps share host/client or separate hosts/clients.

- [ ] **T03 — Decide staff role authority**
  - Option A: local Pyxis DB roles remain authoritative.
  - Option B: Keycloak groups/realm roles become authoritative.
  - Option C: hybrid Keycloak membership + local final role.
  - Record the chosen mapping and migration path.

## Phase 1: Local Keycloak fixture

- [ ] **T04 — Add local Docker Compose fixture**
  - Add `docker-compose.local.yml` or extend existing compose with:
    - Pyxis app Postgres,
    - Keycloak Postgres,
    - Keycloak `quay.io/keycloak/keycloak:26.5.5` or approved version.
  - Use `start-dev --import-realm`.
  - Add healthchecks.
  - Add host port overrides such as `PYXIS_PG_PORT` and `PYXIS_KEYCLOAK_PORT`.

- [ ] **T05 — Add local realm import**
  - Add `dev/keycloak/realm-import/pyxis-dev-realm.json`.
  - Define realm `pyxis-dev`.
  - Define confidential client `pyxis-staff-web` or chosen name.
  - Add local client secret.
  - Add redirect URI `http://127.0.0.1:8080/auth/callback` and smoke alternates.
  - Add post-logout redirect URI `http://127.0.0.1:8080/auth/logout/callback` if logout callback is implemented.
  - Add local staff test users for admin/booker/door scenarios.

- [ ] **T06 — Add Makefile/local run targets**
  - Add `local-keycloak-up`, `local-keycloak-down`, `local-keycloak-config` if not already present.
  - Add `run-local-oidc` with `PYXIS_*` env vars.
  - Add tmux helper targets if useful.

## Phase 2: Pyxis auth config

- [ ] **T07 — Add OIDC settings to config**
  - Add `PYXIS_AUTH_MODE=dev|discord|oidc` or equivalent.
  - Add OIDC issuer URL, client ID, client secret, redirect URL, scopes.
  - Add session cookie name if configurable.
  - Add production-mode/dev-auth guard settings if needed.

- [ ] **T08 — Validate config by mode**
  - OIDC mode must require issuer URL, client ID, redirect URL, and client secret if the client is confidential.
  - Dev mode must remain local-only.
  - Production startup should warn or fail if `PYXIS_DEV_AUTH=1` is enabled.

- [ ] **T09 — Document production env vars**
  - Add a runbook section or `.env.production.example` documenting:
    - `PYXIS_AUTH_MODE=oidc`,
    - `PYXIS_OIDC_ISSUER_URL`,
    - `PYXIS_OIDC_CLIENT_ID`,
    - `PYXIS_OIDC_CLIENT_SECRET`,
    - `PYXIS_OIDC_REDIRECT_URL`.

## Phase 3: OIDC implementation

- [ ] **T10 — Add OIDC discovery and JWKS support**
  - Fetch `/.well-known/openid-configuration`.
  - Validate discovery contains issuer, auth endpoint, token endpoint, JWKS URI.
  - Cache JWKS with refresh behavior.

- [ ] **T11 — Add login handler**
  - Implement `GET /auth/login`.
  - Generate random state and nonce.
  - Store state/nonce in short-lived HTTP-only cookies.
  - Support safe `return_to` only if needed.
  - Redirect to Keycloak authorization endpoint.

- [ ] **T12 — Add callback handler**
  - Implement `GET /auth/callback`.
  - Validate state and nonce.
  - Exchange code server-side.
  - Require `id_token`.
  - Verify signature, issuer, audience, expiry, and nonce.

- [ ] **T13 — Map OIDC identity to Pyxis user**
  - Decide stable key: OIDC issuer + subject, email, or both.
  - Add DB columns if needed for `oidc_issuer` / `oidc_subject`.
  - Upsert or find local user.
  - Preserve or assign role according to T03.

- [ ] **T14 — Create existing Pyxis session after OIDC login**
  - Prefer preserving current DB-backed session token model.
  - Set the current `session` cookie so existing `requireAuth` works.
  - Ensure logout invalidates the DB session.

- [ ] **T15 — Implement secure cookie behavior**
  - Replace hardcoded `Secure: false` in production paths.
  - Use hair-booking-style inference: request TLS, `X-Forwarded-Proto: https`, or HTTPS redirect URL means secure cookie.
  - Apply consistently to session, state, nonce, and logout-return cookies.

- [ ] **T16 — Add logout and logout callback**
  - Implement `GET /auth/logout` to clear local session.
  - If discovery exposes end-session endpoint, redirect to Keycloak logout.
  - Implement `GET /auth/logout/callback` for post-logout return.

## Phase 4: Staff role and route integration

- [ ] **T17 — Keep protected staff routes working**
  - Verify `requireAuth` works unchanged after OIDC login.
  - Verify `requireRole` still protects admin/booker/door endpoints.
  - Verify unauthenticated users receive 401 and unauthorized roles receive 403.

- [ ] **T18 — Add role mapping tests**
  - Test local DB authoritative role mapping.
  - If Keycloak roles/groups are used, test claim-to-role mapping.
  - Test unknown OIDC user behavior.

- [ ] **T19 — Update frontend auth bootstrap if needed**
  - Ensure staff app can discover authenticated state.
  - Ensure login button/link points to `/auth/login`.
  - Ensure logout calls `/auth/logout`.
  - Avoid storing Keycloak tokens in frontend state/local storage.

## Phase 5: Tests and smoke

- [ ] **T20 — Unit-test auth primitives**
  - Config validation.
  - Discovery document validation.
  - State/nonce marshal/verify.
  - Secure-cookie inference.
  - Return-to restrictions.

- [ ] **T21 — Unit-test callback failure cases**
  - Missing code/state.
  - Bad state cookie.
  - Missing nonce.
  - Token exchange failure.
  - Missing ID token.
  - Invalid issuer/audience/nonce.

- [ ] **T22 — Add local OIDC smoke script**
  - Store under this ticket's `scripts/` first.
  - Start or verify local Keycloak.
  - Start Pyxis in OIDC mode.
  - Check discovery.
  - Check `/auth/login` redirect.
  - Perform scripted login if feasible.
  - Verify protected staff endpoint succeeds after login.
  - Verify logout clears session.

- [ ] **T23 — Run full validation**
  - `go test ./... -count=1`
  - relevant frontend typecheck/build if frontend auth changes
  - local OIDC smoke script
  - production static embed smoke if auth changes affect serving

## Phase 6: Hosted Keycloak provisioning

- [ ] **T24 — Add central Terraform scaffold**
  - Add `/home/manuel/code/wesen/terraform/keycloak/apps/pyxis/envs/local`.
  - Add `/home/manuel/code/wesen/terraform/keycloak/apps/pyxis/envs/hosted`.
  - Reuse the hair-booking browser-client module pattern.

- [ ] **T25 — Configure hosted redirect and logout URLs**
  - Hosted redirect: `https://pyxis.xyz/auth/callback` unless deployment changes.
  - Hosted post-logout: `https://pyxis.xyz/auth/logout/callback` if implemented.
  - Hosted web origin: `https://pyxis.xyz`.

- [ ] **T26 — Plan/apply hosted Keycloak changes**
  - Validate Terraform.
  - Run plan with operator-provided Keycloak admin credentials and client secret.
  - Apply only after confirming target host/client choices.
  - Record state key and outputs in docs, not secrets.

## Phase 7: Deployment and handoff docs

- [ ] **T27 — Update production deployment docs**
  - Add exact `PYXIS_*` auth env vars.
  - Add Keycloak setup prerequisites.
  - Add rollback behavior if OIDC login fails.

- [ ] **T28 — Add auth operations playbook**
  - Local start/stop.
  - Hosted smoke order.
  - Common failures: bad redirect URI, wrong client secret, clock skew, insecure cookie behind proxy, missing role.

- [ ] **T29 — Decide old Discord OAuth cleanup**
  - Remove Discord OAuth if no longer used, or mark it as deprecated fallback.
  - Ensure docs and config do not advertise both paths ambiguously.

- [ ] **T30 — Final ship/no-ship gate**
  - Local OIDC fixture works.
  - Hosted client exists.
  - Production env vars are set.
  - Secure cookies are verified behind HTTPS/proxy.
  - Staff roles are verified.
  - Dev auth is disabled in production.
  - Full validation passes.
