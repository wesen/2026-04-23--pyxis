---
Title: Discord OAuth Ticket Diary
Ticket: PYXIS-AUTH-DISCORD-OAUTH
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
    - Path: pkg/server/auth.go
      Note: Discord OAuth login/callback diagnostics and session-cookie success/failure logging
    - Path: pkg/service/auth_service.go
      Note: Discord OAuth callback role-mapping diagnostics for guild member lookup failures
    - Path: ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/design/01-discord-oauth-staff-auth-implementation-guide.md
    - Path: ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/tasks.md
ExternalSources:
    - https://docs.discord.com/developers/topics/oauth2
    - https://docs.discord.com/developers/platform/oauth2-and-permissions
Summary: Chronological diary for the Discord OAuth staff authentication ticket.
LastUpdated: 2026-04-27T21:45:00-04:00
WhatFor: Use this diary to understand what was inspected, documented, uploaded, and committed for the Discord OAuth auth track.
WhenToUse: Update this after each Discord OAuth implementation or validation step.
---


# Discord OAuth Ticket Diary

## Step 1: Close Keycloak track and create Discord OAuth implementation ticket

The user decided to close the just-created Keycloak/OIDC ticket and asked for a dedicated Discord OAuth ticket with a detailed implementation guide for a new intern, stored in the ticket and uploaded to reMarkable.

### Commands and evidence

I closed the Keycloak ticket with docmgr metadata:

```bash
docmgr meta update --ticket PYXIS-AUTH-KEYCLOAK --field Status --value closed
```

I created the new ticket:

```bash
docmgr ticket create-ticket \
  --ticket PYXIS-AUTH-DISCORD-OAUTH \
  --title "Complete Pyxis staff authentication with Discord OAuth" \
  --topics backend,auth,production,release-readiness
```

I inspected the current Discord OAuth implementation:

```bash
rg -n "DiscordOAuth|discord.*oauth|oauth2|/auth/discord|handleDiscord|ExchangeCode|DISCORD|AuthURL|TokenURL|discord.com" \
  pkg cmd proto web ttmp/2026/04/25/pyxis-backend--pyxis-go-postgresql-backend-design-implementation -S
```

I read the core files:

- `pkg/service/auth_service.go`
- `pkg/server/auth.go`
- `pkg/server/server.go`
- `pkg/config/config.go`
- `cmd/pyxis/cmds/serve.go`
- `pkg/db/queries/auth.sql`
- `pkg/db/migrations/000001_init.up.sql`
- `pkg/server/app.go`

I also ran a web search for Discord OAuth documentation and used the official Discord docs as external references:

- `https://docs.discord.com/developers/topics/oauth2`
- `https://docs.discord.com/developers/platform/oauth2-and-permissions`

### Findings

Pyxis already has a partial Discord OAuth skeleton:

- `pkg/service/auth_service.go` exchanges an OAuth code, calls Discord `/users/@me`, upserts a local user, and creates a DB-backed session.
- `pkg/server/auth.go` has `handleDiscordCallback`, dev login, logout, session lookup, and `requireAuth`.
- `pkg/server/server.go` wires `GET /auth/discord/callback`, `/auth/me`, `/auth/logout`, and `/api/app/session`.
- Staff APIs are already protected by `requireAuth` and `requireRole`.

The skeleton is incomplete for production:

- no `/auth/discord/login` route;
- no OAuth `state` validation;
- no visible serve/env wiring for Discord OAuth client ID/secret/redirect URL;
- hardcoded `Secure: false` cookies;
- unclear role policy for unknown Discord users;
- no production runbook for Discord Developer Portal redirect URI setup.

### What I created

- `design/01-discord-oauth-staff-auth-implementation-guide.md`
- `tasks.md`
- `reference/01-discord-oauth-ticket-diary.md`
- Updated `index.md` and `changelog.md`

### Key implementation principle

Discord OAuth should identify the browser user; Pyxis should authorize through its own local role model. The safest first pass is to preserve the current DB-backed session and role middleware, then add the missing login route, state validation, config wiring, secure cookies, and explicit role policy.

### Next steps

1. Upload the guide/tasks/diary bundle to reMarkable.
2. Run docmgr doctor.
3. Commit the ticket.
4. Begin implementation with config wiring and `/auth/discord/login`.

## Step 2: Upload implementation bundle to reMarkable

After docmgr validation passed, I uploaded the ticket bundle to reMarkable.

### Commands run

```bash
remarquee upload bundle --dry-run \
  design/01-discord-oauth-staff-auth-implementation-guide.md \
  tasks.md \
  reference/01-discord-oauth-ticket-diary.md \
  --name "PYXIS-AUTH-DISCORD-OAUTH implementation guide" \
  --remote-dir "/ai/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH" \
  --toc-depth 2

remarquee upload bundle \
  design/01-discord-oauth-staff-auth-implementation-guide.md \
  tasks.md \
  reference/01-discord-oauth-ticket-diary.md \
  --name "PYXIS-AUTH-DISCORD-OAUTH implementation guide" \
  --remote-dir "/ai/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH" \
  --toc-depth 2

remarquee cloud ls /ai/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH --long --non-interactive
```

### Result

Upload succeeded:

```text
OK: uploaded PYXIS-AUTH-DISCORD-OAUTH implementation guide.pdf -> /ai/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH
[f] PYXIS-AUTH-DISCORD-OAUTH implementation guide
```

The upload emitted a non-blocking remote-tree refresh warning, but the file listing confirms the PDF exists on-device/cloud.

## Step 3: Implement phases 1-5 through secure sessions

The user clarified two implementation decisions:

- map Discord roles to local Pyxis roles;
- make the website name/URL configurable, initially `https://pyxis.yolo.scapegoat.dev`.

They asked to implement all the way through Phase 5, commit at appropriate intervals, keep a diary, and call out when Discord-side operator work is needed.

### What changed

Implemented Phase 1 through Phase 5 tasks T02-T16.

Config and serve command:

- Added `Config.WebsiteURL`, defaulting to `https://pyxis.yolo.scapegoat.dev`.
- Added `Config.SessionCookieName`, defaulting to `session`.
- Added Discord OAuth and role-mapping config fields:
  - client ID,
  - client secret,
  - redirect URL,
  - bot token,
  - guild ID,
  - admin role ID,
  - booker role ID,
  - door role ID.
- Added serve flags/env-backed defaults:
  - `--website-url` / `PYXIS_WEBSITE_URL`
  - `--session-cookie-name` / `PYXIS_SESSION_COOKIE_NAME`
  - `--discord-client-id` / `PYXIS_DISCORD_CLIENT_ID`
  - `--discord-client-secret` / `PYXIS_DISCORD_CLIENT_SECRET`
  - `--discord-redirect-url` / `PYXIS_DISCORD_REDIRECT_URL`
  - `--discord-bot-token` / `DISCORD_BOT_TOKEN`
  - `--discord-guild-id` / `DISCORD_GUILD_ID`
  - `--discord-admin-role-id` / `DISCORD_ADMIN_ROLE_ID`
  - `--discord-booker-role-id` / `DISCORD_BOOKER_ROLE_ID`
  - `--discord-door-role-id` / `DISCORD_DOOR_ROLE_ID`
- Added validation for partial Discord OAuth config and absolute URLs.

OAuth flow:

- Added `GET /auth/discord/login`.
- Added OAuth state generation, state cookie, and state encode/decode helpers.
- Hardened `GET /auth/discord/callback` to require and validate state.
- Changed successful callback behavior to set the app session cookie and redirect to the safe return path or `/`.
- Added safe `return_to` validation to reject external/open redirects.

Role mapping:

- Changed `UpsertUser` to accept and update a local role.
- Added Discord guild-member role lookup through the bot token:
  - `GET https://discord.com/api/v10/guilds/{guildID}/members/{userID}`
  - `Authorization: Bot <token>`
- Mapped Discord role IDs to local Pyxis roles with priority:
  - admin > booker > door > staff
- If no role IDs are configured, Discord OAuth users default to `staff`.
- If role mapping is configured, `discord-bot-token` and `discord-guild-id` are required.

Cookies/logout:

- Added shared session cookie helpers.
- Added secure-cookie inference from request TLS, `X-Forwarded-Proto: https`, or HTTPS Discord redirect URL.
- Removed hardcoded `Secure: false` from production OAuth session writing.
- Made logout idempotent at the route level: it now clears the cookie and deletes a server-side session if one exists, without requiring `requireAuth` first.

Tests:

- Added `pkg/server/auth_test.go` for state roundtrip, secure-cookie inference, safe return targets, login redirects, and missing OAuth config.
- Added `pkg/service/auth_service_test.go` for Discord role mapping priority, staff default, and required bot/guild config.

### Commands run

```bash
sqlc generate
gofmt -w cmd/pyxis/cmds/serve.go pkg/config/config.go pkg/service/auth_service.go pkg/service/auth_service_test.go pkg/server/auth.go pkg/server/auth_test.go pkg/server/server.go pkg/db/auth.sql.go
go test ./... -count=1
go test ./cmd/pyxis/cmds ./pkg/server ./pkg/service -count=1
```

The full `go test ./... -count=1` passed.

### What worked

The existing DB-backed session model made this straightforward. Discord OAuth now creates the same local session type that `requireAuth` already understands, so the staff API boundary did not need a rewrite.

Role mapping is now explicit and deterministic: Discord role IDs map to local roles, but unknown or unmapped users do not become privileged.

### What still needs operator work on Discord

I need Manuel/operator input before a real hosted OAuth smoke can succeed:

1. Create or confirm a Discord OAuth application/client.
2. Add redirect URI:
   - `https://pyxis.yolo.scapegoat.dev/auth/discord/callback`
   - and any local callback URI needed for manual testing, e.g. `http://127.0.0.1:8080/auth/discord/callback`.
3. Provide/set deployment secrets:
   - `PYXIS_DISCORD_CLIENT_ID`
   - `PYXIS_DISCORD_CLIENT_SECRET`
   - `DISCORD_BOT_TOKEN` if role mapping should be active
   - `DISCORD_GUILD_ID`
   - `DISCORD_ADMIN_ROLE_ID`
   - `DISCORD_BOOKER_ROLE_ID`
   - `DISCORD_DOOR_ROLE_ID` if a door role exists
4. Confirm whether unmapped users should remain `staff` or be denied login entirely in a later phase.

### Next steps

Continue with Phase 6 role/authorization polish and Phase 8 smoke scripts after the Discord-side IDs/secrets are available.

## Step 4: Add staff frontend auth bootstrap and login smoke script

After the backend OAuth phases were in place, I continued with the staff frontend surfaces and a repeatable pre-callback smoke script.

### What changed

Frontend auth bootstrap:

- Updated `web/packages/pyxis-app/src/App.tsx` with a `RequireSession` wrapper.
- Protected staff routes now check `/api/app/session` before rendering.
- Unauthenticated users are redirected to `/login?return_to=<current-path>`.
- Authenticated users visiting `/login` are redirected back to `/`.

Login page:

- Updated `web/packages/pyxis-app/src/pages/LoginPage/Page.tsx` so both Discord buttons navigate to `/auth/discord/login?return_to=...`.
- Kept the old email/magic-link form visible but disabled, with copy saying Discord login is active.
- Updated the LoginPage story so Storybook starts with a `return_to=/shows` query.

Logout/session UI:

- Added a `logout` RTK Query mutation.
- Added `/auth/logout` and `/auth/discord/login` endpoint constants.
- Updated `AppSidebarUserFooter` to show the current session user/role and call logout before returning to `/login`.

Smoke script:

- Added `scripts/01-discord-oauth-login-smoke.sh` under the ticket.
- The script starts Pyxis on `127.0.0.1:18086`, checks `/api/app/session` is unauthenticated, checks `/auth/discord/login` returns a Discord authorize redirect, validates `client_id`, `redirect_uri`, `response_type=code`, `scope=identify`, and confirms the OAuth state cookie is set.

### Commands run

```bash
ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/scripts/01-discord-oauth-login-smoke.sh
go test ./... -count=1
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

Results:

- Discord OAuth login initiation smoke passed.
- Go tests passed.
- pyxis-app TypeScript passed.
- pyxis-app Vite build passed.

### What is ready to test manually

The pre-callback side is ready. A human can now test the live Discord browser login flow with:

```bash
go run ./cmd/pyxis serve --bind 127.0.0.1:18086
```

Then open:

```text
http://127.0.0.1:18086/auth/discord/login?return_to=/
```

However, Discord must have the matching callback URL registered. Because `.envrc` currently does not set `PYXIS_DISCORD_REDIRECT_URL`, the server defaults to:

```text
https://pyxis.yolo.scapegoat.dev/auth/discord/callback
```

For a local browser callback test, either add this local redirect URI in Discord and run with:

```bash
PYXIS_DISCORD_REDIRECT_URL=http://127.0.0.1:18086/auth/discord/callback \
  go run ./cmd/pyxis serve --bind 127.0.0.1:18086
```

or test through the hosted `https://pyxis.yolo.scapegoat.dev` URL once deployed.

### Remaining blocker

T19, role-protected staff route testing with a real Discord-authenticated session, is blocked until we run an actual Discord callback with a user in the configured guild roles. The environment now provides the needed IDs/secrets, but Discord's application redirect URI must match the URL we test.

## Step 5: Add diagnostic logging for guild membership failure

The live OAuth callback reached the role-mapping path but returned:

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "discord user is not a member of configured guild"
  }
}
```

That error comes from `fetchGuildMemberRoles` when Discord returns `404` for:

```text
GET /guilds/{configuredGuildID}/members/{discordUserID}
```

Discord can return that if the authenticated user is actually not in the configured guild, if the configured guild ID is wrong, if the bot token belongs to a different application/guild installation, or if the bot cannot see that guild/member.

### What changed

Added focused zerolog instrumentation around the real callback path:

- login redirect emits `discord oauth: redirecting to discord authorization` with `return_to` and whether the state cookie is secure;
- callback emits state-validation, exchange-failure, and session-cookie-success messages;
- user fetch logs Discord user ID and username after `/users/@me` succeeds;
- guild-member lookup logs Discord user ID, configured guild ID, which role mappings are configured, returned role IDs on success, and Discord status/body on 404/non-OK responses;
- role mapping logs the chosen local Pyxis role.

The logging intentionally does not print the OAuth code, access token, bot token, client secret, or session token.

### Commands run

```bash
gofmt -w pkg/service/auth_service.go pkg/server/auth.go
go test ./pkg/service ./pkg/server -count=1
go test ./... -count=1
tmux kill-session -t pyxis-backend-dev
tmux new-session -d -s pyxis-backend-dev -c /home/manuel/code/wesen/2026-04-23--pyxis \
  'direnv exec . env PYXIS_WEBSITE_URL=http://localhost:3008 PYXIS_DISCORD_REDIRECT_URL=http://localhost:3008/auth/discord/callback go run ./cmd/pyxis serve --bind 127.0.0.1:8080 2>&1 | tee /tmp/pyxis-backend-dev.log'
```

### Result

The backend tmux session is restarted and now runs the instrumented code. The next browser OAuth attempt should write the relevant lines to both the tmux pane and `/tmp/pyxis-backend-dev.log`.

### Next debugging step

Repeat the Discord login once. Then inspect:

```bash
tmux capture-pane -t pyxis-backend-dev:0.0 -p -S -200
rg "discord oauth" /tmp/pyxis-backend-dev.log
```

The most important evidence will be the `discord_user_id`, `discord_guild_id`, Discord HTTP status, and Discord error body from the guild-member lookup.
