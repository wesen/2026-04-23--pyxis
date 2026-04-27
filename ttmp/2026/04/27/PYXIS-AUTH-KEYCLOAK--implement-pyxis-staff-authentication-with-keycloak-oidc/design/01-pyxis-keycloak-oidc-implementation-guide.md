---
Title: Pyxis Keycloak OIDC Implementation Guide
Ticket: PYXIS-AUTH-KEYCLOAK
Status: active
Topics:
  - backend
  - auth
  - production
  - release-readiness
DocType: design-doc
Intent: implementation
Owners: []
RelatedFiles:
  - Path: pkg/server/auth.go
    Note: current Discord/dev auth handlers and insecure-cookie TODO
  - Path: pkg/service/auth_service.go
    Note: current Discord OAuth and session service to adapt or replace
  - Path: pkg/server/server.go
    Note: current auth route wiring and protected staff route registration
  - Path: pkg/server/app.go
    Note: current role middleware and staff API authorization boundary
  - Path: pkg/config/config.go
    Note: runtime config surface for future OIDC settings
  - Path: pkg/db/migrations/000001_init.up.sql
    Note: current users and sessions schema used by staff auth
ExternalSources:
  - /home/manuel/code/wesen/hair-booking/docker-compose.local.yml
  - /home/manuel/code/wesen/hair-booking/pkg/auth/config.go
  - /home/manuel/code/wesen/hair-booking/pkg/auth/oidc.go
  - /home/manuel/code/wesen/hair-booking/pkg/auth/session.go
  - /home/manuel/code/wesen/hair-booking/dev/keycloak/realm-import/hair-booking-dev-realm.json
  - /home/manuel/code/wesen/terraform/keycloak/apps/hair-booking/envs/hosted/main.tf
Summary: Implementation guide for replacing or supplementing Pyxis staff auth with backend-owned Keycloak OIDC browser login, using hair-booking as the working precedent.
LastUpdated: 2026-04-27T20:20:00-04:00
WhatFor: Use this when implementing Pyxis Keycloak/OIDC auth, local Keycloak fixtures, role mapping, secure cookies, and hosted Terraform client provisioning.
WhenToUse: Use before changing pkg/server/auth.go or pkg/service/auth_service.go, and when deciding how Pyxis staff routes should authenticate in production.
---

# Pyxis Keycloak OIDC Implementation Guide

## 1. Executive summary

Pyxis currently has a working staff-auth skeleton based on Discord OAuth, local dev auth, database-backed sessions, and role middleware. That skeleton is useful, but it is not the desired long-term production identity system. The intended direction is Keycloak/OIDC.

The best local precedent is `/home/manuel/code/wesen/hair-booking`. That project already solved the core shape we need:

1. local Docker Compose with Keycloak and Keycloak Postgres;
2. an app-specific local realm import;
3. backend-owned OIDC browser login;
4. server-side code exchange and ID-token verification;
5. HTTP-only app session cookies;
6. secure-cookie inference for HTTPS/proxy deployments;
7. hosted Keycloak provisioning through the central Terraform repo;
8. smoke/runbook documentation for local and hosted auth.

For Pyxis, the important choice is to avoid a large simultaneous rewrite. The first implementation should replace the identity provider while preserving the current staff API authorization boundary:

- keep `/api/app/*` protected by `requireAuth` and `requireRole`;
- keep local user/session tables unless there is a clear reason to migrate them;
- add Keycloak/OIDC login and callback handlers that create the same kind of app session the staff API already understands;
- decide role mapping deliberately, with local DB roles as the safest v1 default.

## 2. Current Pyxis auth baseline

Relevant Pyxis files:

- `pkg/service/auth_service.go`
  - current Discord OAuth settings and exchange flow;
  - creates sessions after Discord profile lookup.
- `pkg/server/auth.go`
  - current callback/dev-login/logout/session handlers;
  - sets `Secure: false` today, with a TODO for HTTPS production.
- `pkg/server/server.go`
  - wires `/auth/*` routes and protected staff routes.
- `pkg/server/app.go`
  - contains `requireRole` and staff handlers.
- `pkg/db/migrations/000001_init.up.sql`
  - defines `users`, `sessions`, and role/status-related schema.

The current system is close enough that Keycloak can be introduced as an identity-provider replacement instead of a full authorization rewrite. The staff app does not need to know about Keycloak tokens. It should continue calling same-origin `/auth/session` or `/api/app/*` routes with the browser's app session cookie.

## 3. Copied implementation guide from production-readiness v2

The following section is copied/adapted from the v2 production-readiness document so this dedicated ticket can stand on its own.

## Keycloak precedent from `hair-booking`

After the Phase 1-4 production pass, I inspected `/home/manuel/code/wesen/hair-booking` as the closest local precedent for a Go app using Keycloak, a same-origin React shell, local Docker Compose, Terraform-managed hosted clients, and operator playbooks. That repo is more than a sketch: it already has a working local Keycloak fixture, OIDC callback code, signed browser sessions, hosted deployment documentation, and a central-infra Terraform path.

The important lesson is not “copy every file.” The important lesson is that `hair-booking` separates the identity system into four clear layers:

1. a local Keycloak fixture for day-to-day development;
2. app runtime OIDC settings and callback/session handling in Go;
3. hosted Keycloak realm/client provisioning in the shared Terraform repo;
4. deployment/runbook documentation that keeps app env vars aligned with Keycloak redirect URLs.

That separation is exactly what `pyxis` needs if it replaces the current Discord/dev-session auth with Keycloak/OIDC.

### 3.1 Local Docker Compose shape

`hair-booking/docker-compose.local.yml` defines a self-contained local development identity stack:

- `app-postgres`
  - PostgreSQL 16 for app data.
  - Binds to `127.0.0.1:${HAIR_BOOKING_PG_PORT:-15432}:5432`.
  - Has a `pg_isready` healthcheck.
- `keycloak-postgres`
  - Separate PostgreSQL 16 database for Keycloak.
  - Not exposed to the host.
  - Has its own `pg_isready` healthcheck.
- `keycloak`
  - `quay.io/keycloak/keycloak:26.5.5`.
  - Starts with `start-dev --import-realm`.
  - Depends on healthy `keycloak-postgres`.
  - Imports `./dev/keycloak/realm-import` into `/opt/keycloak/data/import:ro`.
  - Binds Keycloak to `127.0.0.1:${HAIR_BOOKING_KEYCLOAK_PORT:-18080}:8080`.
  - Uses bootstrap admin `admin` / `admin` for the local fixture only.

The design detail worth copying is the port override. The diary for `hair-booking` records that `18080` was already occupied by another Keycloak instance on this workstation, so the compose file supports `HAIR_BOOKING_KEYCLOAK_PORT=18090`. For `pyxis`, a local fixture should use the same pattern, e.g. `PYXIS_KEYCLOAK_PORT=${PYXIS_KEYCLOAK_PORT:-18090}` or another non-conflicting default.

The `hair-booking` realm import is intentionally local and app-specific:

- realm: `hair-booking-dev`
- client: `hair-booking-web`
- client secret: `hair-booking-web-secret`
- test user: `alice` / `secret`
- redirect URIs for `localhost` and `127.0.0.1` on ports `8080` and `8081`
- web origins for the same local hosts

For `pyxis`, the analogous fixture would be:

- realm: `pyxis-dev`
- client: `pyxis-web` or `pyxis-staff-web`
- local-only client secret such as `pyxis-web-secret`
- one or more test users whose claims map to the current `admin`, `booker`, and `door` staff roles
- redirect URIs for the local Go server, likely `http://127.0.0.1:8080/auth/callback` and any alternate smoke ports
- post-logout redirect URIs if we implement Keycloak end-session logout

### 3.2 Runtime auth contract in Go

`hair-booking` implements OIDC as a server-side browser-login flow, not as a frontend-only token flow. The frontend does not store Keycloak tokens. The browser is redirected to Keycloak, the Go server handles `/auth/callback`, verifies the ID token, and writes an HTTP-only app session cookie.

The core files are:

- `/home/manuel/code/wesen/hair-booking/pkg/auth/config.go`
- `/home/manuel/code/wesen/hair-booking/pkg/auth/oidc.go`
- `/home/manuel/code/wesen/hair-booking/pkg/auth/session.go`
- `/home/manuel/code/wesen/hair-booking/pkg/server/http.go`
- `/home/manuel/code/wesen/hair-booking/pkg/server/handlers_me.go`

The runtime settings are environment-backed Glazed flags:

```text
HAIR_BOOKING_AUTH_MODE=oidc
HAIR_BOOKING_AUTH_SESSION_COOKIE_NAME=hair_booking_session
HAIR_BOOKING_AUTH_SESSION_SECRET=<long secret>
HAIR_BOOKING_OIDC_ISSUER_URL=<keycloak realm issuer>
HAIR_BOOKING_OIDC_CLIENT_ID=hair-booking-web
HAIR_BOOKING_OIDC_CLIENT_SECRET=<client secret>
HAIR_BOOKING_OIDC_REDIRECT_URL=<app URL>/auth/callback
HAIR_BOOKING_OIDC_SCOPES=openid,profile,email
```

The same shape maps cleanly to Pyxis:

```text
PYXIS_AUTH_MODE=oidc
PYXIS_AUTH_SESSION_COOKIE_NAME=pyxis_session
PYXIS_AUTH_SESSION_SECRET=<long secret>
PYXIS_OIDC_ISSUER_URL=https://auth.example.com/realms/pyxis
PYXIS_OIDC_CLIENT_ID=pyxis-staff-web
PYXIS_OIDC_CLIENT_SECRET=<client secret>
PYXIS_OIDC_REDIRECT_URL=https://pyxis.xyz/auth/callback
PYXIS_OIDC_SCOPES=openid,profile,email
```

The most important implementation choices in `hair-booking` are:

- It performs OIDC discovery from `/.well-known/openid-configuration`.
- It uses the discovery-provided authorization, token, JWKS, and end-session endpoints.
- It creates a random `state` and `nonce` per login.
- It stores state and nonce in short-lived HTTP-only cookies.
- It exchanges the authorization code server-side.
- It requires an `id_token` in the token response.
- It verifies the ID token signature through JWKS.
- It validates issuer, audience, expiry, and nonce.
- It writes a signed HTTP-only session cookie containing stable identity claims.
- It chooses `Secure` cookies when the request is TLS, `X-Forwarded-Proto: https`, or the configured redirect URL is HTTPS.
- It supports `/auth/logout` and `/auth/logout/callback` through Keycloak's end-session endpoint when available.
- It restricts `return_to` redirects to same-origin or explicitly matching hosts.

For `pyxis`, this is a strong precedent because the current production task list already calls out secure-cookie behavior. `hair-booking`'s `shouldUseSecureCookies` function is a concrete answer to the current `pkg/server/auth.go` TODO: cookie security should be derived from request TLS/proxy headers and the configured HTTPS redirect URL, not hardcoded to `false`.

### 3.3 Session and app API shape

`hair-booking` exposes `/api/me` as the stable frontend contract. In OIDC mode, `/api/me` reads the signed app session cookie, converts the claims into an app identity, and returns the current user state. In dev mode, it can synthesize a local identity.

That is close to Pyxis' current shape:

- Pyxis already has a `session` cookie.
- Pyxis staff APIs already use `requireAuth` and `requireRole`.
- Pyxis already has a local-only `PYXIS_DEV_AUTH=1` path for development.

The main difference is identity source. Pyxis currently creates users/sessions from Discord OAuth or dev login. A Keycloak version can keep the staff API and cookie middleware largely intact if it changes only the login/callback/session-creation layer:

1. Add OIDC settings to config.
2. Add `/auth/login`, `/auth/callback`, `/auth/logout`, and `/auth/logout/callback` handlers.
3. On callback, verify the Keycloak ID token.
4. Upsert or map a local `users` row from OIDC claims.
5. Create the existing server-side session row or replace the current session token with a signed-cookie/session-manager approach.
6. Keep `requireAuth` and `requireRole` as the boundary for `/api/app/*`.

For Pyxis, keep the existing database-backed session model at first. It already fits `requireAuth`, logout, and role checks. The Keycloak work should first replace the identity provider, not simultaneously replace the whole authorization/session storage model.

### 3.4 Authorization model

`hair-booking` has a deliberately small authorization model. Client/portal identity is any authenticated OIDC user. Stylist access is gated through allowlists in config:

```text
HAIR_BOOKING_STYLIST_ALLOWED_EMAILS=alice@example.com
HAIR_BOOKING_STYLIST_ALLOWED_SUBJECTS=<keycloak-subject-id>
```

The authorizer accepts a user if the normalized email or subject appears in those allowlists. In dev mode, stylist access is allowed.

For Pyxis, a simple allowlist is probably not enough because staff roles already exist:

- `admin`
- `booker`
- `door`

The Pyxis Keycloak design should choose one of these role-mapping strategies:

1. **Local DB remains authoritative for roles.** Keycloak only authenticates identity; Pyxis maps by subject/email to an existing or upserted local user and uses `users.role`. This is the least disruptive migration from the current code.
2. **Keycloak groups/realm roles become authoritative.** Pyxis reads realm roles/groups from ID token or UserInfo claims and maps them to `admin`/`booker`/`door`. This centralizes staff access in Keycloak but requires correct mapper configuration.
3. **Hybrid.** Keycloak authenticates and provides coarse membership, while Pyxis keeps final app role in its DB.

For v1, choose option 1 or 3. It lets us replace Discord OAuth without making Keycloak role mapping a launch blocker. Once login works, Keycloak group/role mapping can be a separate hardening pass.

### 3.5 Terraform and hosted provisioning

`hair-booking` moved hosted Keycloak provisioning out of the app repo and into the central infrastructure repo:

```text
/home/manuel/code/wesen/terraform/keycloak/apps/hair-booking/envs/hosted/main.tf
/home/manuel/code/wesen/terraform/keycloak/apps/hair-booking/envs/k3s-parallel/main.tf
/home/manuel/code/wesen/terraform/keycloak/apps/hair-booking/envs/local/main.tf
```

The hosted and K3s-parallel environments create:

- a dedicated realm, e.g. `hair-booking`;
- a browser client, e.g. `hair-booking-web`;
- valid redirect URI `${public_app_url}/auth/callback`;
- valid post-logout redirect URI `${public_app_url}/auth/logout/callback`;
- web origin `${public_app_url}`.

For Pyxis, the equivalent Terraform target should probably live in:

```text
/home/manuel/code/wesen/terraform/keycloak/apps/pyxis/envs/local
/home/manuel/code/wesen/terraform/keycloak/apps/pyxis/envs/hosted
```

If we are targeting the public domain `https://pyxis.xyz`, the hosted client should include:

```text
realm: pyxis
client_id: pyxis-staff-web or pyxis-web
redirect_uri: https://pyxis.xyz/auth/callback
post_logout_redirect_uri: https://pyxis.xyz/auth/logout/callback
web_origin: https://pyxis.xyz
```

If the staff app later lives on a different hostname than the public site, create a distinct staff client or include the staff hostname explicitly. Do not rely on broad wildcard redirect URIs in production.

## 4. Concrete implementation phases

### Phase A: Decisions and boundary setting

Decide these before coding:

- Is Keycloak required before public launch, or only before exposing staff routes?
- Is the client name `pyxis-web`, `pyxis-staff-web`, or separate public/staff clients?
- Does the public site and staff app share the same origin and client?
- Are staff roles local DB roles, Keycloak groups/realm roles, or hybrid?
- Does Discord OAuth remain as a fallback, or do we remove it once OIDC works?

Recommended defaults:

- use `pyxis-staff-web` for staff identity;
- keep local DB roles for v1;
- keep `PYXIS_DEV_AUTH=1` for local development only;
- hide or protect staff routes at deployment/proxy layer until OIDC is complete.

### Phase B: Local fixture

Add a Pyxis-local Keycloak fixture:

```text
docker-compose.local.yml
dev/keycloak/realm-import/pyxis-dev-realm.json
```

The realm import should contain:

- realm `pyxis-dev`;
- confidential OIDC client `pyxis-staff-web`;
- local secret `pyxis-staff-web-secret`;
- redirect URIs for `http://127.0.0.1:8080/auth/callback` and smoke ports;
- post-logout redirect URI `http://127.0.0.1:8080/auth/logout/callback`;
- users for `admin`, `booker`, and `door` scenarios.

### Phase C: Config and auth service

Add OIDC settings to Pyxis config and wire them into server construction:

```text
PYXIS_AUTH_MODE=dev|discord|oidc
PYXIS_AUTH_SESSION_COOKIE_NAME=session
PYXIS_AUTH_SESSION_SECRET=<secret if signed-cookie mode is used>
PYXIS_OIDC_ISSUER_URL=http://127.0.0.1:18090/realms/pyxis-dev
PYXIS_OIDC_CLIENT_ID=pyxis-staff-web
PYXIS_OIDC_CLIENT_SECRET=pyxis-staff-web-secret
PYXIS_OIDC_REDIRECT_URL=http://127.0.0.1:8080/auth/callback
PYXIS_OIDC_SCOPES=openid,profile,email
```

If preserving DB-backed sessions, `PYXIS_AUTH_SESSION_SECRET` may not be needed for the main session token, but a secret or random state cookie protection is still needed for OAuth state/nonce cookies.

### Phase D: OIDC handlers

Add or adapt handlers:

- `GET /auth/login`
- `GET /auth/callback`
- `GET /auth/logout`
- `GET /auth/logout/callback`
- `GET /auth/session` or existing equivalent

The callback should:

1. verify `state` and `nonce`;
2. exchange the code using the discovery token endpoint;
3. require and verify `id_token`;
4. validate issuer, audience, expiry, and nonce;
5. map Keycloak claims to a local user;
6. create the existing DB session token;
7. set the session cookie with correct `Secure`, `HttpOnly`, and `SameSite=Lax` attributes.

### Phase E: Tests and smoke

Add tests for:

- config validation;
- discovery document failure and incomplete discovery document handling;
- state/nonce generation and verification;
- invalid callback parameters;
- JWKS/ID token validation behavior, where practical;
- secure-cookie inference;
- return-to redirect restrictions;
- role mapping from claims/local DB;
- `PYXIS_DEV_AUTH=1` disabled/warning behavior in production mode.

Add a ticket-local smoke script that:

1. starts local Keycloak;
2. starts Pyxis in OIDC mode;
3. checks discovery;
4. checks `/auth/login` redirect;
5. performs a scripted login if practical;
6. checks `/auth/session` or protected `/api/app/*` after login;
7. checks logout clears the session.

### Phase F: Hosted Terraform

Add central Terraform resources under `/home/manuel/code/wesen/terraform/keycloak/apps/pyxis`, not in the Pyxis app repo. Hosted target should create:

- realm `pyxis`;
- client `pyxis-staff-web`;
- redirect URI `https://pyxis.xyz/auth/callback`;
- post-logout redirect URI `https://pyxis.xyz/auth/logout/callback`;
- web origin `https://pyxis.xyz`.

### Phase G: Deployment/runbook update

Document production env vars and smoke order:

```text
PYXIS_AUTH_MODE=oidc
PYXIS_OIDC_ISSUER_URL=https://auth.example.com/realms/pyxis
PYXIS_OIDC_CLIENT_ID=pyxis-staff-web
PYXIS_OIDC_CLIENT_SECRET=<secret>
PYXIS_OIDC_REDIRECT_URL=https://pyxis.xyz/auth/callback
```

Smoke order:

1. `/health` returns healthy JSON.
2. `/auth/login` redirects to the expected Keycloak realm.
3. callback creates a session.
4. `/auth/session` returns authenticated staff identity.
5. `GET /api/app/shows` succeeds for an authorized role.
6. forbidden roles receive `403`.
7. logout clears the app session.

## 5. Review notes

The riskiest parts are not the HTTP route names. They are:

- accidentally allowing insecure cookies in HTTPS production;
- accepting ID tokens without strict issuer/audience/nonce validation;
- allowing open redirects through `return_to`;
- trusting role claims before Keycloak mappers are deliberately configured;
- exposing staff routes before the production auth path is complete.

Use `hair-booking` as the reference for the first three risks. Use Pyxis' existing `requireRole` model as the reference for the last two.
