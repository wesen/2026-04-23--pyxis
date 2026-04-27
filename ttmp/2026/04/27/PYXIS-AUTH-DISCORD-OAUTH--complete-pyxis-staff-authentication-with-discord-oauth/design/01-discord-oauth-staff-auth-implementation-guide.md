---
Title: Discord OAuth Staff Authentication Implementation Guide
Ticket: PYXIS-AUTH-DISCORD-OAUTH
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
  - Path: pkg/service/auth_service.go
    Note: Current Discord OAuth exchange, Discord /users/@me profile fetch, user upsert, and DB session creation.
  - Path: pkg/server/auth.go
    Note: Current auth handlers, session cookie writing, dev login, logout, session endpoint, and auth middleware.
  - Path: pkg/server/server.go
    Note: Current auth route wiring and staff route protection.
  - Path: pkg/config/config.go
    Note: Existing Discord OAuth config fields that need env/flag wiring and validation.
  - Path: cmd/pyxis/cmds/serve.go
    Note: Serve command currently wires DB/bot flags but not Discord OAuth web-login flags.
  - Path: pkg/db/queries/auth.sql
    Note: User/session persistence queries used by Discord OAuth.
  - Path: pkg/db/migrations/000001_init.up.sql
    Note: users and sessions schema used by staff auth.
  - Path: pkg/server/app.go
    Note: Staff handlers use authenticated user and role information.
  - Path: web/packages/pyxis-app/src/api/authApi.ts
    Note: Staff frontend auth API layer if present/updated.
ExternalSources:
  - https://docs.discord.com/developers/topics/oauth2
  - https://docs.discord.com/developers/platform/oauth2-and-permissions
Summary: Detailed analysis and implementation plan for completing production-ready Discord OAuth staff login in Pyxis.
LastUpdated: 2026-04-27T20:45:00-04:00
WhatFor: Use this to onboard a new developer to Pyxis staff authentication and to implement a complete Discord OAuth login/session flow safely.
WhenToUse: Use before modifying Discord OAuth config, auth routes, cookies, role mapping, staff app login/logout, or production deployment settings.
---

# Discord OAuth Staff Authentication Implementation Guide

## 1. Executive summary

Pyxis already contains the center of a Discord OAuth staff authentication system. It can exchange an OAuth authorization code with Discord, fetch the authenticated Discord user, upsert that user into PostgreSQL, create a database-backed session, set a browser cookie, and protect staff API routes with `requireAuth` and `requireRole`.

What Pyxis does **not** yet have is the full production-ready login system around that skeleton. The missing pieces are mostly at the edges:

- no first-class `/auth/discord/login` route that creates the authorization URL;
- no OAuth `state` cookie for CSRF protection;
- no obvious env/flag wiring for `DiscordClientID`, `DiscordClientSecret`, and `DiscordRedirectURL`;
- session cookies are still written with `Secure: false`;
- role assignment is not production-safe because `UpsertUser` defaults Discord OAuth users to role `staff`, while staff routes expect `admin`, `booker`, or `door`;
- there is no guild/role verification against Discord before granting a Pyxis role;
- frontend login/logout expectations need to be explicit;
- production deployment docs need exact redirect URI and Discord Developer Portal settings.

The safe implementation plan is to keep the current database-backed session and route middleware, then complete the OAuth edge around it:

```text
browser -> /auth/discord/login
        -> Discord authorize page
        -> /auth/discord/callback?code=...&state=...
        -> Go server exchanges code and fetches /users/@me
        -> Go server maps Discord identity to local Pyxis user + role
        -> Go server creates DB session and sets HttpOnly cookie
        -> staff app calls /api/app/session and /api/app/* with that cookie
```

This document explains the moving parts, the current state, the missing implementation, and a step-by-step plan for a new intern or developer.

## 2. OAuth in one page

OAuth is a delegated login protocol. Pyxis does not ask for a Discord password. Instead:

1. Pyxis redirects the browser to Discord.
2. Discord authenticates the user.
3. Discord redirects the browser back to Pyxis with a short-lived `code`.
4. Pyxis sends that `code` to Discord from the backend, together with its client secret.
5. Discord returns an access token.
6. Pyxis uses the access token to call Discord's API, usually `/users/@me`.
7. Pyxis creates its own local session cookie.

Discord's official OAuth docs are here:

- `https://docs.discord.com/developers/topics/oauth2`
- `https://docs.discord.com/developers/platform/oauth2-and-permissions`

For basic login, Pyxis currently uses the `identify` scope. That scope gives enough permission to read the current user's basic Discord identity through `/users/@me`.

The key distinction is this:

- Discord access token: short-lived token used by the backend to ask Discord who the user is.
- Pyxis session cookie: the application session used for staff APIs after login.

The frontend should not store Discord access tokens. The frontend should only rely on the Pyxis session cookie and `/api/app/session`.

## 3. Current Pyxis auth architecture

### 3.1 Files to read first

A new developer should start with these files in this order:

1. `pkg/server/server.go`
   - shows which auth routes exist and how staff routes are protected.
2. `pkg/server/auth.go`
   - shows callback, dev login, logout, session lookup, and `requireAuth`.
3. `pkg/service/auth_service.go`
   - shows Discord OAuth exchange, `/users/@me`, user upsert, and session creation.
4. `pkg/db/queries/auth.sql`
   - shows the SQL queries that persist users and sessions.
5. `pkg/db/migrations/000001_init.up.sql`
   - shows the `users` and `sessions` schema.
6. `cmd/pyxis/cmds/serve.go`
   - shows which runtime flags exist today.
7. `pkg/config/config.go`
   - shows config fields for Discord OAuth.

### 3.2 Current server route wiring

`pkg/server/server.go` currently wires these auth routes:

```go
mux.HandleFunc("POST /auth/dev-login", s.handleDevLogin)
mux.HandleFunc("GET /auth/dev-login", s.handleDevLogin)
mux.HandleFunc("GET /auth/discord/callback", s.handleDiscordCallback)
mux.Handle("GET /auth/me", s.requireAuth(http.HandlerFunc(s.handleGetMe)))
mux.Handle("POST /auth/logout", s.requireAuth(http.HandlerFunc(s.handleLogout)))
mux.HandleFunc("GET /api/app/session", s.handleGetSession)
```

The important protected route pattern is:

```go
mux.Handle(
  "GET /api/app/shows",
  s.requireAuth(
    s.requireRole("admin", "booker", "door")(
      http.HandlerFunc(s.handleListAppShows),
    ),
  ),
)
```

That means staff route protection happens in two stages:

1. `requireAuth` reads the `session` cookie and loads the user.
2. `requireRole` checks the local user's role.

Discord OAuth does not need to know about every staff endpoint. It only needs to create a valid local session for a correctly authorized local user.

### 3.3 Current OAuth exchange service

`pkg/service/auth_service.go` defines:

```go
type DiscordOAuthConfig struct {
    ClientID     string
    ClientSecret string
    RedirectURL  string
}
```

`NewAuthService` constructs an OAuth2 config:

```go
oauth2.Config{
    ClientID:     cfg.ClientID,
    ClientSecret: cfg.ClientSecret,
    RedirectURL:  cfg.RedirectURL,
    Scopes:       []string{"identify"},
    Endpoint: oauth2.Endpoint{
        AuthURL:  "https://discord.com/oauth2/authorize",
        TokenURL: "https://discord.com/api/oauth2/token",
    },
}
```

`ExchangeCode(ctx, code)` does this:

```text
input: OAuth code from /auth/discord/callback

1. exchange code with Discord token endpoint
2. build OAuth HTTP client from returned token
3. GET https://discord.com/api/users/@me
4. decode Discord user JSON
5. upsert users row by discord_id
6. create random DB session token
7. return session token and user
```

Current pseudocode:

```go
func ExchangeCode(ctx, code):
    token = oauth.Exchange(ctx, code)
    client = oauth.Client(ctx, token)
    discordUser = GET /users/@me using client
    localUser = UpsertUser(discordUser.ID, discordUser.Username, discordUser.Avatar)
    sessionToken = createSession(localUser.ID)
    return sessionToken, localUser
```

This is a good core, but production login needs state, config validation, role policy, and cookie hardening.

### 3.4 Current database model

`users` table:

```sql
CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    discord_id       TEXT NOT NULL UNIQUE,
    discord_username TEXT NOT NULL,
    avatar_url       TEXT,
    role             TEXT NOT NULL DEFAULT 'staff',
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    last_login_at    TIMESTAMPTZ
);
```

`sessions` table:

```sql
CREATE TABLE sessions (
    id         TEXT PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

`UpsertUser` currently does:

```sql
INSERT INTO users (discord_id, discord_username, avatar_url, role, last_login_at)
VALUES ($1, $2, $3, 'staff', NOW())
ON CONFLICT (discord_id) DO UPDATE SET
    discord_username = EXCLUDED.discord_username,
    avatar_url = EXCLUDED.avatar_url,
    last_login_at = NOW()
RETURNING *;
```

The role detail matters. A new Discord OAuth user gets role `staff`, but staff route middleware checks roles like `admin`, `booker`, and `door`. If `staff` is not accepted anywhere, a newly logged-in Discord user may authenticate but still be forbidden from most app APIs.

That is probably correct from a security standpoint — login is not authorization — but the implementation needs an explicit role assignment policy.

## 4. Current login sequence and missing pieces

### 4.1 What exists today

```mermaid
sequenceDiagram
    participant Browser
    participant Pyxis
    participant Discord
    participant DB

    Browser->>Pyxis: GET /auth/discord/callback?code=...
    Pyxis->>Discord: POST token endpoint with code/client secret
    Discord-->>Pyxis: access token
    Pyxis->>Discord: GET /users/@me
    Discord-->>Pyxis: Discord user profile
    Pyxis->>DB: UpsertUser(discord_id, username, avatar)
    Pyxis->>DB: CreateSession(user_id, random_token, expiry)
    Pyxis-->>Browser: Set-Cookie: session=...; HttpOnly
```

This assumes the browser already somehow reached Discord and came back with a `code`. The missing route is the route that starts the flow.

### 4.2 What production should do

```mermaid
sequenceDiagram
    participant Browser
    participant Pyxis
    participant Discord
    participant DB

    Browser->>Pyxis: GET /auth/discord/login?return_to=/app
    Pyxis->>Browser: Set state cookie; 302 to Discord authorize URL
    Browser->>Discord: GET /oauth2/authorize?client_id=...&state=...
    Discord->>Browser: user login/consent
    Discord->>Browser: 302 /auth/discord/callback?code=...&state=...
    Browser->>Pyxis: GET /auth/discord/callback?code=...&state=...
    Pyxis->>Pyxis: verify state cookie matches query state
    Pyxis->>Discord: exchange code for token
    Pyxis->>Discord: GET /users/@me
    Pyxis->>DB: upsert/map local user
    Pyxis->>DB: create local session
    Pyxis->>Browser: Set session cookie; clear state cookie; redirect return_to
    Browser->>Pyxis: GET /api/app/session
    Pyxis-->>Browser: authenticated user info
```

The two critical security additions are:

- `state` protects against cross-site request forgery and login injection;
- `return_to` must not become an open redirect.

## 5. Required Discord Developer Portal setup

A production operator must configure a Discord application. The app needs:

- OAuth2 client ID;
- OAuth2 client secret;
- redirect URI matching Pyxis exactly;
- optional bot settings if the same Discord app also owns the bot.

For local development, use a redirect URI like:

```text
http://127.0.0.1:8080/auth/discord/callback
```

For production on `https://pyxis.xyz`, use:

```text
https://pyxis.xyz/auth/discord/callback
```

Discord redirect URI matching is strict. If Pyxis sends `https://pyxis.xyz/auth/discord/callback` but the Discord Developer Portal contains `https://www.pyxis.xyz/auth/discord/callback`, the OAuth flow will fail.

Recommended production environment variables:

```env
PYXIS_DISCORD_CLIENT_ID=<discord-oauth-client-id>
PYXIS_DISCORD_CLIENT_SECRET=<discord-oauth-client-secret>
PYXIS_DISCORD_REDIRECT_URL=https://pyxis.xyz/auth/discord/callback
PYXIS_SESSION_COOKIE_NAME=session
PYXIS_ALLOWED_REDIRECT_HOSTS=pyxis.xyz
PYXIS_DEV_AUTH=0
```

The actual names can be adjusted to match the existing config style, but they should be explicit and documented.

## 6. Roles: login is not authorization

Discord OAuth proves that a browser user controls a Discord account. It does not automatically prove that the user should manage Pyxis shows or bookings.

Pyxis currently has local roles:

- `admin`
- `booker`
- `door`
- possibly `staff` as a default/unauthorized role

Staff route examples:

```text
GET /api/app/shows             admin, booker, door
POST /api/app/shows            admin, booker
GET /api/app/bookings          admin, booker
GET /api/app/settings          admin
```

There are three reasonable role strategies.

### Option A: Local database roles are authoritative

Discord OAuth only identifies the user. A Pyxis admin assigns roles in the database or an admin UI.

Flow:

```text
Discord login -> user row created with role=staff -> admin changes role to booker/admin/door -> future sessions inherit role
```

Pros:

- simple;
- no need to call Discord guild APIs;
- least change to current middleware;
- safe default for unknown users.

Cons:

- requires manual role assignment;
- Discord server role changes do not automatically update Pyxis.

### Option B: Discord guild/role membership is authoritative

Pyxis checks the user's guild membership and Discord roles, then maps Discord role IDs to Pyxis roles.

Possible mapping:

```text
DISCORD_ADMIN_ROLE_ID  -> admin
DISCORD_BOOKER_ROLE_ID -> booker
DISCORD_DOOR_ROLE_ID   -> door
```

Pros:

- one source of truth in Discord;
- staff access follows Discord role changes.

Cons:

- needs extra Discord API access;
- may require scopes beyond `identify`, such as `guilds` or bot-based guild member lookup;
- more failure modes and rate-limit concerns;
- must decide what happens if Discord API is unavailable during login.

### Option C: Hybrid

Discord proves identity and optional coarse membership; Pyxis keeps final app role locally.

Recommended v1:

- Use Discord OAuth for identity.
- Keep local DB role as the final authorization source.
- Optionally add a guild allowlist check later.

That is the safest path for completing the current skeleton.

## 7. Secure cookies and production proxies

`pkg/server/auth.go` currently writes:

```go
http.SetCookie(w, &http.Cookie{
    Name:     "session",
    Value:    token,
    Path:     "/",
    HttpOnly: true,
    Secure:   false, // TODO: set to true in production with HTTPS
    SameSite: http.SameSiteLaxMode,
    MaxAge:   7 * 24 * 60 * 60,
})
```

This must change before production staff auth is exposed.

A robust helper should infer secure cookies from:

- direct TLS: `r.TLS != nil`;
- reverse proxy header: `X-Forwarded-Proto: https`;
- configured redirect URL scheme: `https://...`;
- optional explicit config override.

Pseudocode:

```go
func shouldUseSecureCookies(r *http.Request, redirectURL string) bool {
    if r != nil {
        if r.TLS != nil { return true }
        if strings.EqualFold(r.Header.Get("X-Forwarded-Proto"), "https") { return true }
    }
    parsed, err := url.Parse(redirectURL)
    return err == nil && parsed.Scheme == "https"
}
```

Use the same helper for:

- session cookie;
- OAuth state cookie;
- return-to cookie, if used;
- logout clearing cookie.

Cookie defaults:

```text
HttpOnly: true
Secure: true in production HTTPS
SameSite: Lax
Path: /
MaxAge: 7 days for session; 10 minutes for OAuth state
```

## 8. API reference

### `GET /auth/discord/login`

Purpose: start the OAuth flow.

Query params:

- `return_to` optional; must be same-origin or a configured safe relative path.

Behavior:

- generate state token;
- store state in short-lived cookie;
- optionally encode safe return path in state;
- redirect to Discord authorize URL.

Example response:

```http
HTTP/1.1 302 Found
Set-Cookie: pyxis_oauth_state=...; HttpOnly; SameSite=Lax; Max-Age=600
Location: https://discord.com/oauth2/authorize?client_id=...&redirect_uri=...&response_type=code&scope=identify&state=...
```

### `GET /auth/discord/callback`

Purpose: finish OAuth flow.

Query params:

- `code` required;
- `state` required.

Behavior:

- validate state;
- exchange code;
- fetch `/users/@me`;
- map/upsert local user;
- create session;
- set session cookie;
- redirect to safe return path or staff app root.

Error statuses:

- `400` missing/invalid state or code;
- `502` Discord token/profile failure;
- `403` Discord identity not allowed, if allowlist/guild check is enabled;
- `500` local DB/session failure.

### `GET /api/app/session`

Purpose: staff frontend bootstrap endpoint.

Current behavior:

- returns authenticated `AuthSession` if a valid `session` cookie exists;
- returns unauthenticated session if no cookie or invalid cookie.

Expected shape:

```json
{
  "authenticated": true,
  "spaceName": "Pyxis",
  "user": {
    "id": 1,
    "discordId": "123456789",
    "discordUsername": "alice",
    "role": "booker"
  }
}
```

### `GET /auth/me`

Purpose: authenticated user endpoint.

Current behavior:

- requires auth middleware;
- returns user info;
- returns 401 if no valid session.

### `POST /auth/logout`

Purpose: clear local session.

Current behavior:

- requires auth;
- deletes session row;
- clears cookie;
- returns `{"success":true}`.

Potential improvement:

- allow logout to be idempotent even if no session cookie exists;
- always clear cookie;
- redirect or return JSON depending on frontend needs.

## 9. Frontend integration model

The staff frontend should not implement Discord OAuth itself. It should use backend routes.

Recommended frontend behavior:

```text
on app startup:
  GET /api/app/session
  if authenticated:
    render app
  else:
    render login screen with link to /auth/discord/login?return_to=<current path>

on login button:
  window.location.href = "/auth/discord/login?return_to=" + encodeURIComponent(currentPath)

on logout button:
  POST /auth/logout
  clear RTK Query cache/client auth state
  navigate to login screen
```

If `POST /auth/logout` remains auth-protected, the frontend should tolerate `401` and still clear local state.

## 10. Implementation plan

### Phase 1: Config wiring

Add flags/env-backed settings:

```text
--discord-client-id
--discord-client-secret
--discord-redirect-url
--session-cookie-name
--public-base-url or --external-url
```

Update `cmd/pyxis/cmds/serve.go` to decode these settings and populate `config.Config`.

Validation:

```go
if discord auth enabled:
    require client ID
    require client secret
    require redirect URL
    redirect URL must be absolute
```

### Phase 2: Login route and OAuth state

Add:

```go
mux.HandleFunc("GET /auth/discord/login", s.handleDiscordLogin)
```

Pseudocode:

```go
func handleDiscordLogin(w, r):
    returnTo = validateReturnTo(r.URL.Query().Get("return_to"))
    stateID = randomToken()
    statePayload = { id: stateID, returnTo: returnTo }
    encodedState = base64url(json(statePayload))
    setCookie("pyxis_oauth_state", stateID, maxAge=10m, httpOnly=true)
    url = authService.AuthCodeURL(encodedState)
    redirect(url)
```

Add an `AuthCodeURL(state string)` helper on `AuthService` so route code does not know OAuth internals.

### Phase 3: Harden callback

Update `handleDiscordCallback`:

```go
func handleDiscordCallback(w, r):
    code = query code
    state = query state
    payload = decode state
    cookie = oauth_state cookie
    if cookie != payload.id: 400
    clear state cookie
    token,user = ExchangeCode(code)
    set session cookie securely
    redirect payload.returnTo or /app
```

Do not return raw user JSON from callback in the browser flow unless this is intentionally used by tests. A browser callback usually redirects to the app.

### Phase 4: Role policy

Choose one:

- local DB roles only;
- Discord guild/role mapping;
- hybrid.

For local DB roles only, update docs and perhaps add an admin seed command:

```sql
UPDATE users SET role='admin' WHERE discord_id='<your discord id>';
```

For Discord role mapping, add config:

```text
DISCORD_GUILD_ID
DISCORD_ADMIN_ROLE_ID
DISCORD_BOOKER_ROLE_ID
DISCORD_DOOR_ROLE_ID
```

Then implement a Discord role fetch path carefully, likely through bot token/guild member API rather than user OAuth alone.

### Phase 5: Secure cookies and logout

Add shared cookie helper:

```go
func setSessionCookie(w, r, token):
    http.SetCookie(w, &http.Cookie{
        Name: cookieName,
        Value: token,
        Path: "/",
        HttpOnly: true,
        Secure: shouldUseSecureCookies(r, cfg.DiscordRedirectURL),
        SameSite: http.SameSiteLaxMode,
        MaxAge: sessionMaxAge,
    })
```

Make logout clearing use the same cookie name/path/secure/samesite values.

### Phase 6: Tests

Add tests for:

- auth URL generation includes client ID, redirect URL, `identify`, and state;
- state cookie mismatch returns 400;
- missing code returns 400;
- safe `return_to` accepts `/app/shows`;
- unsafe `return_to=https://evil.example` is rejected;
- secure cookie helper returns true for HTTPS redirect URL;
- dev login is unavailable unless `PYXIS_DEV_AUTH=1`;
- newly authenticated default `staff` role cannot access protected booker/admin routes unless role changed.

### Phase 7: Smoke script

Add a ticket-local smoke script first:

```text
ttmp/.../PYXIS-AUTH-DISCORD-OAUTH.../scripts/01-discord-oauth-config-smoke.sh
```

It should check what can be checked without a real browser:

- server starts with config;
- `/auth/discord/login` returns 302;
- redirect Location points to `https://discord.com/oauth2/authorize`;
- Location contains expected `client_id`, `redirect_uri`, `response_type=code`, `scope=identify`, and `state`;
- OAuth state cookie is set;
- `/api/app/session` unauthenticated before login.

Full callback smoke requires either a real Discord test account or a mocked OAuth server. For CI, prefer a mock OAuth provider test around the service, not live Discord.

## 11. Diagrams

### 11.1 System map

```text
+------------------+       +--------------------+       +----------------+
| pyxis-app React  | ----> | Go server /auth/*  | ----> | Discord OAuth  |
| staff frontend   |       | and /api/app/*     |       | + /users/@me   |
+------------------+       +--------------------+       +----------------+
        |                           |
        | session cookie            | SQL
        v                           v
+------------------+       +--------------------+
| Browser cookie   |       | PostgreSQL users   |
| HttpOnly session |       | sessions, roles    |
+------------------+       +--------------------+
```

### 11.2 Authorization boundary

```text
Discord OAuth says: "this browser controls Discord user 123".
Pyxis users table says: "Discord user 123 has Pyxis role booker".
requireRole says: "booker may create/update shows and review bookings".
```

Do not collapse these three concepts into one.

## 12. Open questions

1. Do we want Discord OAuth to remain the long-term production identity system, or is this ticket only to finish the current skeleton while Keycloak is deferred/closed?
2. Should unknown Discord users get role `staff`, or should they be denied login until pre-provisioned?
3. Should Pyxis verify Discord guild membership on login?
4. Should Pyxis map Discord guild role IDs to local roles automatically?
5. Should `/auth/logout` be idempotent and not require `requireAuth`?
6. What is the production staff app URL if it differs from `https://pyxis.xyz`?
7. Should `/auth/discord/callback` redirect to the app or return JSON? The browser flow should redirect; tests can use JSON only with an explicit mode.

## 13. Ship/no-ship checklist

Do not expose staff routes in production until these are true:

- [ ] Discord OAuth client ID/secret/redirect URL are configured through env/flags.
- [ ] Discord Developer Portal contains the exact production redirect URI.
- [ ] `/auth/discord/login` exists and uses state.
- [ ] `/auth/discord/callback` validates state.
- [ ] Session cookies are `Secure` on HTTPS production.
- [ ] Unknown users do not accidentally receive privileged roles.
- [ ] Role mapping policy is documented and tested.
- [ ] `PYXIS_DEV_AUTH=1` is disabled in production.
- [ ] `/api/app/session` works for frontend bootstrap.
- [ ] Logout clears the server-side session and cookie.
- [ ] Go tests pass.
- [ ] Embedded production smoke still passes.

## 14. New intern review path

If you are reviewing or implementing this for the first time:

1. Read this guide once without editing code.
2. Open `pkg/server/server.go` and find every `/auth/*` route.
3. Open `pkg/server/auth.go` and follow the session cookie from callback to `requireAuth`.
4. Open `pkg/service/auth_service.go` and follow the OAuth code exchange.
5. Open `pkg/db/queries/auth.sql` and verify how users and sessions are persisted.
6. Run the server with dev auth and test protected routes before touching Discord OAuth.
7. Implement config wiring and `/auth/discord/login` first.
8. Add state validation before doing any production callback testing.
9. Add tests before changing role behavior.
10. Keep secrets out of docs, git, and logs.
