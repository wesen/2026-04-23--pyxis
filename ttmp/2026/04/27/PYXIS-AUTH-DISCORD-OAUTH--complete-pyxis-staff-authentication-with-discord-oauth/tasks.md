---
Title: Discord OAuth Staff Authentication Tasks
Ticket: PYXIS-AUTH-DISCORD-OAUTH
Status: active
Topics:
  - backend
  - auth
  - production
  - release-readiness
DocType: tasks
Intent: implementation
Summary: Phased task list for completing production-ready Discord OAuth staff authentication in Pyxis.
LastUpdated: 2026-04-27T21:45:00-04:00
---

# Discord OAuth Staff Authentication Tasks

## Phase 0: Ticket setup and architecture handoff

- [x] **T00 — Close Keycloak ticket and create Discord OAuth ticket**
  - Mark `PYXIS-AUTH-KEYCLOAK` closed.
  - Create `PYXIS-AUTH-DISCORD-OAUTH`.
  - Add guide, tasks, diary, and changelog.

- [x] **T01 — Write implementation guide**
  - Explain current system.
  - Explain OAuth concepts.
  - Map current files and APIs.
  - Identify missing pieces.
  - Add diagrams, pseudocode, API references, and ship/no-ship checklist.
  - Upload bundle to reMarkable.

## Phase 1: Decisions

- [x] **T02 — Decide Discord OAuth as production identity path**
  - Confirm this ticket replaces the recently closed Keycloak path for now.
  - Decide whether Keycloak remains archived/future-only.
  - Decide whether Discord OAuth must be complete before public launch or only before staff routes are exposed.

- [x] **T03 — Decide role policy**
  - Option A: local DB roles remain authoritative.
  - Option B: Discord guild/role membership maps to Pyxis roles.
  - Option C: hybrid.
  - Record how unknown Discord users are handled.

- [x] **T04 — Decide production/staging URLs**
  - Confirm production callback URL, likely `https://pyxis.xyz/auth/discord/callback`.
  - Confirm local callback URL, likely `http://127.0.0.1:8080/auth/discord/callback`.
  - Confirm staff app entry path after login.

## Phase 2: Config wiring

- [x] **T05 — Add Discord OAuth serve flags/env vars**
  - Add `--discord-client-id`.
  - Add `--discord-client-secret`.
  - Add `--discord-redirect-url`.
  - Consider `--session-cookie-name` or keep `session` hardcoded.
  - Decode in `cmd/pyxis/cmds/serve.go`.
  - Populate `pkg/config.Config`.

- [x] **T06 — Add config validation**
  - Require client ID, secret, and redirect URL when Discord OAuth is enabled.
  - Validate redirect URL is absolute.
  - Ensure secrets are not logged.

- [x] **T07 — Add production env documentation**
  - Document `PYXIS_DISCORD_CLIENT_ID` or final chosen env name.
  - Document `PYXIS_DISCORD_CLIENT_SECRET`.
  - Document `PYXIS_DISCORD_REDIRECT_URL`.
  - Document Discord Developer Portal redirect URI requirements.

## Phase 3: OAuth login route and state

- [x] **T08 — Add auth URL helper**
  - Add `AuthCodeURL(state string)` or equivalent to `AuthService`.
  - Ensure URL uses `response_type=code`, configured redirect URI, `identify` scope, and state.

- [x] **T09 — Add `/auth/discord/login` handler**
  - Generate random state.
  - Store state in short-lived HTTP-only cookie.
  - Accept only safe `return_to` values.
  - Redirect browser to Discord authorize URL.

- [x] **T10 — Add state encode/decode helpers**
  - Include state ID.
  - Optionally include safe return path.
  - Use base64url JSON or another simple signed/validated representation.
  - Reject malformed or empty state.

## Phase 4: Callback hardening

- [x] **T11 — Validate state in callback**
  - Require `code` and `state`.
  - Decode state.
  - Compare state payload with state cookie.
  - Clear state cookie after use.
  - Return 400 on mismatch/missing state.

- [x] **T12 — Improve Discord token/profile error handling**
  - Treat token exchange failures as upstream/auth failures, not generic internal errors.
  - Check Discord `/users/@me` response status before decoding.
  - Avoid leaking token/profile details into logs or responses.

- [x] **T13 — Redirect after callback**
  - Redirect to safe `return_to` or staff app root after successful login.
  - Keep JSON response only if a test/debug mode explicitly needs it.

## Phase 5: Cookies and sessions

- [x] **T14 — Add shared cookie helper**
  - Centralize session cookie writing/clearing.
  - Set `HttpOnly`, `SameSite=Lax`, `Path=/`, and correct `MaxAge`.

- [x] **T15 — Implement secure-cookie inference**
  - Use request TLS, `X-Forwarded-Proto: https`, or HTTPS redirect URL.
  - Replace hardcoded `Secure: false` in `handleDiscordCallback` and dev login if needed.
  - Ensure logout clearing matches cookie attributes.

- [x] **T16 — Make logout robust**
  - Consider making `POST /auth/logout` idempotent without requiring valid auth.
  - Always clear cookie.
  - Delete server-side session if present.

## Phase 6: Role and authorization policy

- [x] **T17 — Preserve safe unknown-user behavior**
  - Unknown Discord users should not become `admin`/`booker`/`door` automatically.
  - Confirm default `staff` role is intentionally unprivileged or rename to `pending`.

- [x] **T18 — Implement chosen role mapping**
  - Local DB role mode: document/admin seed path.
  - Discord role mode: implement guild/member role lookup with explicit role ID config.
  - Hybrid mode: implement coarse Discord allowlist plus local final role.

- [ ] **T19 — Test protected staff routes by role** *(blocked on live Discord login / role IDs in a real guild session)*
  - Admin can access admin endpoints.
  - Booker can access booking/show mutation endpoints.
  - Door can access allowed read/attendance endpoints.
  - Staff/pending/unknown cannot access privileged routes.

## Phase 7: Frontend integration

- [x] **T20 — Add/update staff login UI**
  - Unauthenticated staff app should link to `/auth/discord/login?return_to=<path>`.
  - Avoid storing Discord OAuth tokens in frontend state.

- [x] **T21 — Verify session bootstrap**
  - Staff app calls `/api/app/session` on startup.
  - Authenticated session renders staff app.
  - Unauthenticated session renders login screen.

- [x] **T22 — Verify logout UX**
  - Logout calls `POST /auth/logout`.
  - Client clears local auth/cache state.
  - User returns to login/public page.

## Phase 8: Tests and smoke

- [x] **T23 — Unit-test OAuth helpers**
  - Auth URL generation.
  - State encode/decode.
  - Return-to validation.
  - Secure-cookie inference.

- [x] **T24 — Unit-test callback errors**
  - Missing code.
  - Missing state.
  - Bad state cookie.
  - Discord token exchange failure.
  - Discord user fetch failure.

- [x] **T25 — Add ticket-local smoke script**
  - Verify `/auth/discord/login` returns 302 to Discord.
  - Verify state cookie is set.
  - Verify Location includes expected client ID, redirect URI, scope, and state.
  - Verify `/api/app/session` unauthenticated before login.

- [x] **T26 — Run full validation**
  - `go test ./... -count=1`
  - frontend typecheck/build if auth UI changes
  - production embed smoke if auth changes touch routing/session behavior

## Phase 9: Deployment and operations

- [ ] **T27 — Configure Discord Developer Portal**
  - Add local callback URL.
  - Add production callback URL.
  - Store client ID/secret in deployment secret manager, not git.

- [ ] **T28 — Add production auth runbook**
  - Startup config checklist.
  - Login smoke checklist.
  - Role assignment checklist.
  - Common failures: redirect URI mismatch, bad client secret, insecure cookies, missing role.

- [ ] **T29 — Decide staff route exposure**
  - If Discord OAuth is incomplete, restrict staff routes at proxy/deployment layer.
  - If exposed, verify HTTPS cookie behavior and role checks.

- [ ] **T30 — Final ship/no-ship gate**
  - Config wired.
  - Login route exists.
  - State validation exists.
  - Secure cookies verified.
  - Role policy implemented.
  - Staff frontend login/logout works.
  - Validation passes.
