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
  - ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/design/01-discord-oauth-staff-auth-implementation-guide.md
  - ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/tasks.md
ExternalSources:
  - https://docs.discord.com/developers/topics/oauth2
  - https://docs.discord.com/developers/platform/oauth2-and-permissions
Summary: Chronological diary for the Discord OAuth staff authentication ticket.
LastUpdated: 2026-04-27T20:55:00-04:00
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
