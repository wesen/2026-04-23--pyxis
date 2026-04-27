---
Title: Discord bot show management design and implementation guide
Ticket: PYXIS-DISCORD-SHOW-MGMT
Status: active
Topics:
    - pyxis
    - discord-bot
    - show-management
    - goja
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ../../../../../../../corporate-headquarters/discord-bot/examples/discord-bots/show-space/index.js
      Note: Existing show-space bot commands to port
    - Path: ../../../../../../../corporate-headquarters/discord-bot/pkg/framework/framework.go
      Note: Public embedding API for one built-in bot
    - Path: cmd/pyxis/cmds/serve.go
      Note: Serve command lifecycle where the embedded Discord bot should start
    - Path: pkg/discord/client.go
      Note: Placeholder Discord integration interface to replace or adapt
    - Path: pkg/server/server.go
      Note: Current service wiring and no-op Discord client
    - Path: pkg/service/show_service.go
      Note: Show business logic and current announce/cancel/archive seams
ExternalSources: []
Summary: Design and implementation guide for embedding the corporate-headquarters Discord bot framework into Pyxis and porting the show-space bot to Pyxis-backed show management.
LastUpdated: 2026-04-26T23:55:00-04:00
WhatFor: Use this when implementing Discord bot show management in Pyxis.
WhenToUse: Before adding dependencies, copying the show-space bot, designing the app native module, or wiring bot lifecycle and commands.
---


# Discord bot show management design and implementation guide

## Executive summary

Pyxis already has most of the venue-management domain model needed for Discord show management: shows, bookings, settings, audit logging, staff roles, and a frontend affordance for requesting a show announcement. What is missing is the real Discord bot runtime and the bridge between JavaScript bot commands and Pyxis's Go/PostgreSQL services.

The recommended implementation is to embed `github.com/go-go-golems/discord-bot` in Pyxis, copy the existing `examples/discord-bots/show-space` bot into this repository, and adapt it so JavaScript calls a Pyxis-native Go module instead of its current in-memory/SQLite store. The `discord-bot` framework already supports this shape: the Go host loads a JavaScript bot with Goja, injects `require("discord")`, `require("ui")`, and custom native modules, syncs slash commands, opens Discord, and dispatches interactions. Pyxis should provide a native module such as `require("pyxis")` with show, settings, audit, and permission helpers.

The end state should feel like this to an operator:

1. Staff configure Discord token/application/guild/channel/role IDs through environment variables and Pyxis settings.
2. `pyxis serve --discord-bot --discord-sync-on-start` starts the HTTP app and the bot in one process.
3. Booker/admin users can run `/upcoming`, `/announce`, `/add-show`, `/cancel-show`, `/archive-show`, `/archive-expired`, and debug commands in Discord.
4. The bot writes to the same PostgreSQL-backed show data as the web app and records `discord_message_id` / `discord_channel_id` on shows.
5. The web app's existing “Announce” button uses the same service path and no longer talks to a no-op Discord client.

## Problem statement and scope

The user request is to add Discord bot functionality to Pyxis for show management by using the framework at `../corporate-headquarters/discord-bot/`, which itself uses `../corporate-headquarters/go-go-goja`. There is an already fleshed-out show-announcement/show-management bot in that framework that should be copied and adapted or ported.

### In scope

- Add a new Pyxis design and implementation path for Discord bot show management.
- Reuse the existing `show-space` JavaScript bot as the starting point.
- Embed the bot framework into the Pyxis Go application.
- Add a Pyxis-native JavaScript module so bot scripts use Pyxis services instead of a separate SQLite database.
- Wire bot lifecycle, configuration, command sync, and graceful shutdown.
- Update persistence so Discord message/channel IDs are round-tripped through repositories and services.
- Provide an intern-friendly phased implementation guide with file references, pseudocode, diagrams, API references, and validation steps.

### Out of scope for the first implementation

- Building a separate distributed worker system.
- Replacing the entire Pyxis HTTP API.
- Rewriting the bot framework internals unless an integration blocker is found.
- Implementing a full Discord OAuth/role synchronization system beyond command-level role checks.

## Current-state architecture: Pyxis

### Pyxis command and server lifecycle

Pyxis is a Cobra/Glazed CLI application. `cmd/pyxis/main.go` builds the root `pyxis` command, installs logging/help, asks `pkg/cmdtools.NewCommandGroup()` for commands, and executes with a background context (`cmd/pyxis/main.go:21-58`). The server is currently started by the Glazed `serve` command in `cmd/pyxis/cmds/serve.go`. That command exposes `--bind` and `--db-url`, connects to PostgreSQL, creates a default config, constructs `server.New(cfg, database)`, and calls `srv.Start(ctx, bind)` (`cmd/pyxis/cmds/serve.go:24-87`).

This means the Discord bot lifecycle belongs in or near the serve command. The bot is long-running and should share the same root context as the HTTP server. It should not be started from an HTTP handler.

### Server wiring and current Discord placeholder

`pkg/server/server.go` owns dependency construction for the HTTP app. It creates SQLC queries, PostgreSQL repositories, storage, services, auth service, and routes (`pkg/server/server.go:33-68`). The current Discord integration seam is intentionally a placeholder:

- `pkg/server/server.go:51` constructs `discord.Client(&discord.NoOpClient{})`.
- `pkg/server/server.go:53` passes that no-op client into `service.NewShowService`.
- `pkg/discord/client.go:5-12` defines `AnnounceShow`, `UnpinAndNotifyCancellation`, `NotifyArtist`, and `PostToChannel`.
- `pkg/discord/client.go:14-31` implements a no-op client.

The show routes already include `POST /api/app/shows/{id}/announce` for staff bookers/admins (`pkg/server/server.go:92-99`). The frontend already calls it from the show detail page (`web/packages/pyxis-app/src/pages/Pages.tsx:207-245`), and RTK Query maps it to `endpoints.showAnnounce(id)` (`web/packages/pyxis-app/src/api/appApi.ts:113-117`). The missing part is the real `discord.Client` implementation and/or a bot runtime that can call the same service logic.

### Show domain and persistence

The domain model has the core show fields: artist, date, doors/start time, age, price, genre, description, notes, lineup, flyer URL, draw, capacity, status, submission/artist/user references, and timestamps (`pkg/domain/show.go:15-37`). The initial database migration already includes two Discord columns on `shows`: `discord_message_id` and `discord_channel_id` (`pkg/db/migrations/000001_init.up.sql:39-59`). This is important: the database schema anticipated Discord posting and pin tracking.

However, the current generated query and domain mapping do not fully use these fields:

- `pkg/db/queries/shows.sql:1-7` selects public show fields but omits Discord message/channel IDs.
- `pkg/db/queries/shows.sql:31-36` inserts a show but omits Discord message/channel IDs.
- `pkg/db/queries/shows.sql:38-45` updates a show but omits Discord message/channel IDs.
- `domain.Show` has no Discord message/channel fields (`pkg/domain/show.go:15-37`).
- `proto/pyxis/v1/show.proto:26-53` has no Discord message/channel fields on `Show`, while `AppShow` only has a `pinned` boolean (`proto/pyxis/v1/show.proto:55-68`).

So the database can store Discord metadata, but the Go/TS application layers cannot currently read or update it correctly. Fixing this is a prerequisite for reliable cancel/archive/unpin behavior.

### Settings and frontend Discord affordances

Pyxis settings already include Discord guild/channel IDs and feature toggles:

- The settings database has `discord_guild_id`, `discord_ch_upcoming`, `discord_ch_announcements`, `discord_ch_staff`, and `discord_ch_bookings` (`pkg/db/migrations/000001_init.up.sql:115-132`).
- A later migration adds `timezone`, `booking_email`, `auto_archive`, `discord_posting`, and `safe_space_required` (`pkg/db/migrations/000002_add_show_capacity_draw_settings_fields.up.sql:5-10`).
- `domain.Settings` has corresponding fields (`pkg/domain/settings.go:5-25`).
- The protobuf `Settings` message exposes those fields to TypeScript (`proto/pyxis/v1/show.proto:209-229`).

The current Discord page is still mostly static: `DiscordPage` renders seed channel mappings (`web/packages/pyxis-app/src/pages/Pages.tsx:497-504`). The settings page can toggle `autoArchive`, `discordPosting`, and `safeSpaceRequired`, but `handleUpdateSettings` currently unmarshals a limited JSON struct and does not include all of those fields (`pkg/server/app.go:730-768`). This is a frontend/backend gap to address if bot runtime config should be editable through the app.

## Current-state architecture: Discord bot framework

### Runtime model

The Discord bot framework lets JavaScript declare bots while Go handles Discord connectivity and dispatch. The framework's own API reference says JavaScript declares one bot with `defineBot(...)`, registers commands/events/components/modals/autocomplete handlers, and uses a provided context to reply, defer, edit, log, persist small state, and call Discord operations (`discord-bot/pkg/doc/topics/discord-js-bot-api-reference.md:33-39`). Bot scripts run in Goja, not Node.js, and available modules include `require("discord")`, `require("timer")`, `require("database")`, and `require("ui")`; Node modules such as `fs`, `path`, `http`, `fetch`, and `process` are not available (`discord-bot/pkg/doc/topics/discord-js-bot-api-reference.md:41-45`).

That runtime constraint matters for Pyxis: the JavaScript bot cannot call Pyxis over HTTP with `fetch` unless the framework adds such a module. The idiomatic integration is a native Go module injected into Goja, e.g. `require("pyxis")`, whose methods call Pyxis services directly.

### Embedding API

The simplest downstream embedding API is `pkg/framework`. Its package documentation shows:

```go
bot, err := framework.New(
    framework.WithCredentialsFromEnv(),
    framework.WithScript("./my-bot/index.js"),
    framework.WithSyncOnStart(true),
)
bot.Run(ctx)
```

This is backed by `pkg/framework/framework.go:1-14`. The public config includes Discord credentials, script path, runtime config, sync-on-start, and runtime module registrars (`pkg/framework/framework.go:28-48`). `framework.New` validates credentials, translates options to internal bot settings, applies custom runtime module registrars, and creates the inner bot (`pkg/framework/framework.go:56-97`). `WithRuntimeConfig` injects arbitrary values into `ctx.config` (`pkg/framework/framework.go:130-136`), and `WithRuntimeModuleRegistrars` injects custom native modules (`pkg/framework/framework.go:146-157`). `Bot.Run(ctx)` opens the session and blocks until context cancellation (`pkg/framework/framework.go:181-189`).

This is the recommended first integration path for Pyxis because Pyxis only needs to run one built-in bot initially.

### Optional repo-driven bot CLI

The framework also has `pkg/botcli`, which can mount a `bots` subtree into downstream Cobra apps. Its package docs say `BuildBootstrap(...)` resolves repositories and `NewBotsCommand(...)` mounts the command tree (`pkg/botcli/doc.go:1-10`). It is useful for inventory, inspection, ordinary jsverbs, and host-managed bot runs. It also supports `WithRuntimeModuleRegistrars` and `WithRuntimeFactory` for custom modules/runtime behavior (`pkg/botcli/doc.go:11-21`, `pkg/botcli/options.go:75-121`).

Pyxis can defer this until after the built-in bot works. A useful Phase 2 or Phase 3 feature would be `pyxis bots list`, `pyxis bots help pyxis-show-space`, and `pyxis bots pyxis-show-space run --help`, but the first version should keep the runtime path simple.

## Current-state architecture: show-space bot to port

The existing `show-space` bot is a strong starting point. It contains:

- `index.js`: bot configuration, commands, permission checks, debug dashboard, announcement posting, pin management, and archive flows.
- `lib/shows.js`: normalization and in-memory catalog fallback.
- `lib/store.js`: SQLite-backed show persistence using `require("database")`.
- `lib/render.js`: announcement/detail/cancellation/past-show payload rendering.
- `lib/permissions.js`: role-gated command helpers.
- `lib/dates.js`: date parsing and display formatting.

The bot declares runtime config fields for upcoming/announcement/staff channel IDs, admin/booker role IDs, timezone, SQLite path, seeding, and debug mode (`show-space/index.js:443-461`). It lists upcoming shows through repository helper functions (`show-space/index.js:270-299`) and posts announcements by saving a show, sending a Discord channel message, finding that message, pinning it, and storing the message/channel IDs (`show-space/index.js:383-408`). Its show commands include:

- `/upcoming` (`show-space/index.js:473-481`)
- `/announce` (`show-space/index.js:593-622`)
- `/add-show` (`show-space/index.js:624-660`)
- `/show` (`show-space/index.js:662-676`)
- `/cancel-show` (`show-space/index.js:678-717`)
- `/archive-show` (`show-space/index.js:719-750`)
- `/past-shows` (`show-space/index.js:752-760`)
- `/unpin-old` (`show-space/index.js:762-795`)
- `/archive-expired` (`show-space/index.js:797-811`)
- debug commands and components (`show-space/index.js:483-591`)

Its SQLite store mirrors several Pyxis fields and persists `discord_message_id` / `discord_channel_id` (`show-space/lib/store.js:53-73`). That is exactly the part Pyxis should replace with native service calls.

## Proposed architecture

### High-level diagram

```text
┌────────────────────────────┐
│         pyxis serve         │
│  cmd/pyxis/cmds/serve.go    │
└──────────────┬─────────────┘
               │ creates shared context + db pool
               ▼
┌──────────────────────────────────────────────────────────┐
│                  Pyxis Go process                         │
│                                                          │
│  ┌────────────────────┐     ┌─────────────────────────┐  │
│  │ HTTP server         │     │ Discord bot runner       │  │
│  │ pkg/server          │     │ pkg/discordbot or        │  │
│  │ /api/app/shows/...  │     │ pkg/discord/runtime.go   │  │
│  └─────────┬──────────┘     └───────────┬─────────────┘  │
│            │                            │                │
│            ▼                            ▼                │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Shared Pyxis services                              │  │
│  │ ShowService, SettingsService, AuditService, repos  │  │
│  └─────────┬────────────────────────────┬─────────────┘  │
│            │                            │                │
│            ▼                            ▼                │
│  ┌────────────────────┐       ┌──────────────────────┐   │
│  │ PostgreSQL          │       │ Goja JS runtime       │   │
│  │ shows/settings/...  │◄──────│ require("pyxis")     │   │
│  └────────────────────┘       │ show-space bot JS     │   │
│                               └──────────┬───────────┘   │
└──────────────────────────────────────────┼───────────────┘
                                           ▼
                                  ┌────────────────┐
                                  │ Discord API    │
                                  │ messages/pins  │
                                  │ slash commands │
                                  └────────────────┘
```

### Design decision 1: embed one built-in bot first

Use `pkg/framework.New(...)`, not the repo-driven `botcli` path, for the first implementation. Reasons:

- It is the smallest public API for downstream apps (`framework.go:1-14`).
- It supports credentials, script path, runtime config, command sync, and custom native modules (`framework.go:28-48`, `framework.go:130-157`).
- It blocks on context cancellation and therefore fits the existing server lifecycle (`framework.go:181-189`).

The optional `botcli` subtree can be added later for inspection and development ergonomics.

### Design decision 2: copy show-space into Pyxis and rename it

Copy the bot to a Pyxis-owned path, for example:

```text
bot/discord/show-space/index.js
bot/discord/show-space/lib/dates.js
bot/discord/show-space/lib/render.js
bot/discord/show-space/lib/permissions.js
bot/discord/show-space/lib/pyxis-store.js
```

Rename the bot from `show-space` to `pyxis-show-space` or `pyxis-shows` in `configure({ name: ... })` so command metadata and debug output are Pyxis-specific. Keep the rendering/date/permission helpers initially; replace store access incrementally.

### Design decision 3: replace SQLite `database` module with `pyxis` module

The show-space bot currently calls `require("database")` from `lib/store.js` and creates its own SQLite schema (`show-space/lib/store.js:1-73`). In Pyxis this would fork truth away from PostgreSQL. Instead, add a native Go module:

```js
const pyxis = require("pyxis")

const shows = pyxis.shows.listUpcoming({ limit: 25 })
const show = pyxis.shows.get(ctx.args.id)
const created = pyxis.shows.create({ artist, date, doorsTime, age, price, notes })
const updated = pyxis.shows.attachDiscordMessage(created.id, channelId, messageId)
const cancelled = pyxis.shows.cancel(id, actor)
const archived = pyxis.shows.archive(id, actor)
const settings = pyxis.settings.get()
pyxis.audit.log({ action: "discord.command.announce", entityType: "show", entityId: id })
```

Native module advantages:

- JavaScript stays expressive and close to the existing bot.
- Pyxis keeps one source of truth.
- The Go module can enforce type conversion, audit metadata, and service invariants.
- Tests can run the bot through the same Goja runtime with fake repositories/services.

### Design decision 4: keep service-layer rules in Go

JavaScript should orchestrate Discord interaction behavior, not reimplement Pyxis business rules. For example, `/cancel-show` can decide to unpin and post a cancellation notice, but the status transition should call `ShowService.Cancel(...)`. Likewise, `/archive-show` should call `ShowService.Archive(...)`, and `/announce` should call a Pyxis show service/helper that knows how to update Discord metadata and audit logs.

This keeps web actions and bot actions consistent.

### Design decision 5: use runtime config for secrets/IDs at startup, settings for mutable app config

The framework already maps bot runtime fields into `ctx.config` (`discord-js-bot-api-reference.md:208-229`). Pyxis has settings for guild/channel IDs. The clean split is:

- Environment/CLI flags: Discord bot token, application ID, public key/client secret if needed, `--discord-sync-on-start`, `--discord-enabled`, fallback guild ID.
- Pyxis settings table: guild ID, channel IDs, timezone, feature toggles, possibly admin/booker role IDs if added.
- Runtime config map passed into `framework.WithRuntimeConfig(...)`: stable merged values read by JS, e.g. `upcomingShowsChannelId`, `staffChannelId`, `adminRoleId`, `bookerRoleId`, `timeZone`, `debug`.

For the first version, the runtime config can be built once at bot startup. Later versions can expose `pyxis.settings.get()` so commands always read current DB settings.

## Proposed package/file layout

```text
cmd/pyxis/cmds/serve.go
  Add flags:
    --discord-bot
    --discord-bot-script
    --discord-sync-on-start
    --discord-debug
    --discord-admin-role-id
    --discord-booker-role-id
  Start bot runner in an errgroup with the HTTP server.

pkg/config/config.go
  Add Discord bot runtime config fields.

pkg/discordbot/runner.go
  Own framework.New(...), credentials, runtime config, script path, lifecycle.

pkg/discordbot/pyxis_module.go
  Register require("pyxis") with Goja.

pkg/discordbot/module_types.go
  JS-facing DTOs and conversion helpers.

bot/discord/show-space/index.js
bot/discord/show-space/lib/*.js
  Ported JavaScript bot.

pkg/domain/show.go
pkg/db/queries/shows.sql
pkg/repository/postgres/show_repo.go
proto/pyxis/v1/show.proto
  Add and propagate Discord message/channel metadata.

pkg/discord/client.go
pkg/service/show_service.go
  Either implement real DiscordClient using a bot-side outbound service or make
  HTTP announce call a shared service that posts directly via Discord ops.
```

## Native module API sketch

The module should be deliberately small. Avoid exposing raw SQL or repositories to JavaScript.

```go
// pkg/discordbot/pyxis_module.go
package discordbot

type PyxisModuleDeps struct {
    Shows    *service.ShowService
    Settings *service.SettingsService
    Audit    service.AuditService
}

type PyxisRegistrar struct {
    Deps PyxisModuleDeps
}

func (r *PyxisRegistrar) RegisterRuntimeModules(ctx *engine.RuntimeModuleContext, reg *require.Registry) error {
    reg.RegisterNativeModule("pyxis", func(vm *goja.Runtime, module *goja.Object) {
        exports := module.Get("exports").ToObject(vm)
        exports.Set("shows", r.buildShowsObject(vm))
        exports.Set("settings", r.buildSettingsObject(vm))
        exports.Set("audit", r.buildAuditObject(vm))
    })
    return nil
}
```

JavaScript-facing shape:

```ts
type PyxisShow = {
  id: number
  artist: string
  dateISO: string
  displayDate: string
  doorsTime: string
  ageRestriction: string
  price: string
  genre: string
  notes: string
  status: "draft" | "confirmed" | "cancelled" | "archived" | "hold" | "blocked"
  discordChannelId: string
  discordMessageId: string
}

type PyxisActor = {
  discordUserId?: string
  discordUsername?: string
  actorId?: number
  actorName?: string
}

type PyxisModule = {
  shows: {
    listUpcoming(input?: { limit?: number }): PyxisShow[]
    listPast(input?: { limit?: number }): PyxisShow[]
    get(id: number | string): PyxisShow | null
    create(input: Partial<PyxisShow>, actor?: PyxisActor): { ok: true, show: PyxisShow } | { ok: false, error: string }
    attachDiscordMessage(id: number | string, channelId: string, messageId: string): { ok: true, show: PyxisShow } | { ok: false, error: string }
    cancel(id: number | string, actor?: PyxisActor): { ok: true, show: PyxisShow } | { ok: false, error: string }
    archive(id: number | string, actor?: PyxisActor): { ok: true, show: PyxisShow } | { ok: false, error: string }
    archiveExpired(input?: { referenceDate?: string, actor?: PyxisActor }): { archived: PyxisShow[] }
  }
  settings: {
    get(): {
      spaceName: string
      timeZone: string
      discordGuildId: string
      upcomingShowsChannelId: string
      announcementsChannelId: string
      staffChannelId: string
      bookingsChannelId: string
      discordPosting: boolean
      autoArchive: boolean
    }
  }
  audit: {
    log(input: { action: string, entityType?: string, entityId?: number, metadata?: object, actor?: PyxisActor }): void
  }
}
```

## Porting pseudocode: JavaScript side

### Before: show-space repository helpers

The current bot switches between SQLite store and in-memory catalog:

```js
function repoListUpcoming(ctx, limit) {
  if (hasDatabase(ctx)) {
    return store.listUpcoming(ctx.config, limit)
  }
  return catalog.listUpcoming(limit)
}
```

### After: Pyxis-backed repository helpers

```js
const pyxis = require("pyxis")

function repoListUpcoming(ctx, limit) {
  return pyxis.shows.listUpcoming({ limit: limit || 25 })
}

function repoGetShow(ctx, id) {
  return pyxis.shows.get(id)
}

function actorFromCtx(ctx) {
  return {
    discordUserId: ctx.user && ctx.user.id,
    discordUsername: ctx.user && (ctx.user.username || ctx.user.globalName),
  }
}

function repoCreateShow(ctx, rawShow) {
  return pyxis.shows.create(rawShow, actorFromCtx(ctx))
}

function repoAttachDiscordMessage(ctx, id, channelId, messageId) {
  return pyxis.shows.attachDiscordMessage(id, channelId, messageId)
}

function repoCancelShow(ctx, id) {
  return pyxis.shows.cancel(id, actorFromCtx(ctx))
}

function repoArchiveShow(ctx, id) {
  return pyxis.shows.archive(id, actorFromCtx(ctx))
}
```

### Announcement flow

```text
/announce or /add-show
  ├─ check role gate: adminRoleId or bookerRoleId
  ├─ normalize command arguments
  ├─ create or update show through pyxis.shows
  ├─ render Discord payload from Pyxis show DTO
  ├─ ctx.discord.channels.send(upcomingShowsChannelId, payload)
  ├─ locate sent message or use returned message if framework exposes it
  ├─ ctx.discord.messages.pin(channelId, messageId)
  ├─ pyxis.shows.attachDiscordMessage(show.id, channelId, messageId)
  ├─ pyxis.audit.log(discord.show.announce)
  └─ ephemeral success response
```

## Go lifecycle pseudocode

```go
func (c *ServeCommand) RunIntoGlazeProcessor(ctx context.Context, vals *values.Values, gp middlewares.Processor) error {
    s := decodeServeSettings(vals)

    database := db.Connect(ctx, s.DBURL)
    defer database.Close()

    cfg := config.DefaultConfig()
    cfg.Bind = s.Bind
    cfg.DBURL = s.DBURL
    cfg.DiscordBotEnabled = s.DiscordBotEnabled
    cfg.DiscordBotScript = s.DiscordBotScript
    cfg.DiscordSyncOnStart = s.DiscordSyncOnStart

    srv := server.New(cfg, database)

    g, ctx := errgroup.WithContext(ctx)

    g.Go(func() error {
        return srv.Start(ctx, s.Bind)
    })

    if cfg.DiscordBotEnabled {
        runner, err := discordbot.NewRunner(ctx, discordbot.Config{
            ScriptPath: cfg.DiscordBotScript,
            SyncOnStart: cfg.DiscordSyncOnStart,
            Credentials: discordbot.CredentialsFromEnv(),
            RuntimeConfig: buildRuntimeConfigFromSettingsAndFlags(...),
            Deps: buildSharedServiceDeps(database),
        })
        if err != nil { return err }

        g.Go(func() error {
            return runner.Run(ctx)
        })
    }

    return g.Wait()
}
```

## Implementation phases

### Phase 1: dependency and build integration

1. Add the Discord bot framework dependency to Pyxis `go.mod`:
   - `github.com/go-go-golems/discord-bot`
   - ensure it resolves to the local checkout during development with a `replace` directive if needed.
2. Confirm `github.com/go-go-golems/go-go-goja` resolves consistently. The Discord framework module already depends on it.
3. Run `go mod tidy` and `go test ./...`.

Expected issue: if `discord-bot` exposes packages that import internal packages from itself, the public packages should be usable, but direct imports of `internal/jsdiscord` from Pyxis are not allowed. Use only `pkg/framework` and `pkg/botcli` from Pyxis.

### Phase 2: copy and rename the bot

1. Copy `../corporate-headquarters/discord-bot/examples/discord-bots/show-space` into `bot/discord/show-space`.
2. Rename bot metadata:
   - `name: "pyxis-show-space"`
   - description: "Pyxis show management bot for announcements, pins, cancellations, and archives".
3. Keep `lib/dates.js`, `lib/render.js`, and `lib/permissions.js` initially.
4. Replace `lib/store.js` with `lib/pyxis-store.js` that calls `require("pyxis")`.
5. Remove `shows.json` seeding from production path, or keep it only for tests/demos.

### Phase 3: expose Discord metadata through Pyxis data model

1. Add to `domain.Show`:

```go
DiscordMessageID string
DiscordChannelID string
```

2. Update `proto/pyxis/v1/show.proto` with new fields using fresh tag numbers:

```proto
string discord_message_id = 20;
string discord_channel_id = 21;
```

3. Regenerate Go and TypeScript proto types.
4. Update SQL queries to select/insert/update these columns.
5. Add repository methods if needed:

```go
AttachDiscordMessage(ctx context.Context, showID int, channelID, messageID string) (*domain.Show, error)
FindByDiscordMessage(ctx context.Context, channelID, messageID string) (*domain.Show, error)
ListExpiredConfirmed(ctx context.Context, before time.Time) ([]domain.Show, error)
```

6. Update `showToProto`, `protoToDomainShow`, `domainShowToAppShow`, and frontend display logic.

### Phase 4: implement `pkg/discordbot` runner

Create `pkg/discordbot/runner.go`:

```go
type Runner struct { bot *framework.Bot }

func NewRunner(ctx context.Context, cfg Config, deps Deps) (*Runner, error) {
    registrar := NewPyxisRegistrar(deps)
    bot, err := framework.New(
        framework.WithCredentials(framework.Credentials{...}),
        framework.WithScript(cfg.ScriptPath),
        framework.WithRuntimeConfig(cfg.RuntimeConfig),
        framework.WithRuntimeModuleRegistrars(registrar),
        framework.WithSyncOnStart(cfg.SyncOnStart),
    )
    if err != nil { return nil, err }
    return &Runner{bot: bot}, nil
}

func (r *Runner) Run(ctx context.Context) error { return r.bot.Run(ctx) }
func (r *Runner) Close() error { return r.bot.Close() }
```

### Phase 5: implement `require("pyxis")`

Keep this module synchronous initially because Goja native functions are straightforward and Pyxis repository calls are ordinary Go calls. Convert panics/errors into `{ ok: false, error }` objects for user-facing command paths.

Important implementation details:

- Use `context.Background()` or a runner-owned context inside native functions, not the Goja VM context if unavailable.
- Validate and coerce IDs from JS strings/numbers.
- Convert Go `time.Time` into date strings expected by the bot (`YYYY-MM-DD` and display label).
- Never expose database handles to JavaScript.
- Return copies/DTOs, not mutable pointers.

### Phase 6: wire bot startup into `serve`

Add serve flags. Suggested names:

```text
--discord-bot                       enable embedded Discord bot
--discord-bot-script                JS bot entrypoint, default ./bot/discord/show-space/index.js
--discord-sync-on-start             sync slash commands before opening gateway
--discord-debug                     enable bot debug commands
--discord-admin-role-id             Discord role ID allowed to administer bot commands
--discord-booker-role-id            Discord role ID allowed to manage shows
```

Use environment variables for credentials because tokens should not be passed casually in shell history:

```text
DISCORD_BOT_TOKEN
DISCORD_APPLICATION_ID
DISCORD_GUILD_ID
DISCORD_PUBLIC_KEY
DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET
```

### Phase 7: align HTTP announce with bot posting

`ShowService.Announce` currently calls `discord.Client.AnnounceShow(...)` (`pkg/service/show_service.go:97-113`). There are two viable options:

1. Implement a real `discord.Client` using `discordgo` directly for HTTP-initiated announcements. This is simple for posting but duplicates rendering and pin logic unless shared carefully.
2. Extract a Go `AnnouncementService` that both the HTTP handler and JS native module call. The JS command can still use `ctx.discord` for Discord operations, but HTTP needs a Go Discord client.

Recommended first step: make `/api/app/shows/{id}/announce` call a Go-side `AnnouncementService` that renders the same payload as JS or calls a shared renderer. Then update JavaScript to use the same persistence semantics. This prevents the frontend button from diverging from slash command behavior.

### Phase 8: tests and validation

Add tests at several levels:

1. Go unit tests for DTO conversion and native module methods.
2. Repository tests for `AttachDiscordMessage`, `FindByDiscordMessage`, and expired show queries.
3. Bot runtime tests modelled after `internal/jsdiscord/show_space_runtime_test.go` in the framework. If Pyxis cannot import internal test helpers, write tests around `framework.New` with fake/development credentials disabled or around the native module and copied JS functions.
4. Frontend/RTK tests or MSW updates for Discord metadata.
5. Manual Discord smoke test in a development guild.

Manual smoke checklist:

```bash
export DISCORD_BOT_TOKEN=...
export DISCORD_APPLICATION_ID=...
export DISCORD_GUILD_ID=...

go run ./cmd/pyxis serve \
  --db-url postgres://pyxis:pyxis@localhost:5433/pyxis?sslmode=disable \
  --discord-bot \
  --discord-sync-on-start \
  --discord-admin-role-id 123 \
  --discord-booker-role-id 456 \
  --log-level debug
```

In Discord:

1. Run `/debug-my-roles` with debug enabled.
2. Run `/upcoming` and compare to `/api/public/shows`.
3. Run `/add-show ...` and verify the show appears in the web app.
4. Verify the announcement appears in the configured upcoming channel and is pinned.
5. Verify the database row has `discord_channel_id` and `discord_message_id`.
6. Run `/cancel-show id` and verify status changes, pin is removed, and cancellation notice posts.
7. Run `/archive-expired` with a past test show and verify archive + unpin behavior.
8. Press the web app “Announce” button and verify it follows the same posting/pinning/audit semantics.

## Risks, alternatives, and open questions

### Risks

- **Internal package boundaries:** Pyxis cannot import `discord-bot/internal/...`; use public `pkg/framework` only.
- **Single source of truth:** Leaving `require("database")`/SQLite in the port would split data and cause web/bot inconsistency.
- **Discord command sync:** Slash command changes will not appear until sync runs. Use `--discord-sync-on-start` in development and cautious explicit sync in production.
- **Message ID capture:** The current bot sends a message then lists recent messages to find the posted one (`show-space/index.js:394-400`). If the framework can return the sent message from `ctx.discord.channels.send`, prefer that to avoid races.
- **Permissions:** Discord role IDs differ from role names. Keep the debug role dashboard because it explains exactly what IDs the bot sees (`show-space/lib/permissions.js:35-58`).
- **Long-running HTTP + bot lifecycle:** If either the bot or HTTP server exits unexpectedly, the process should shut down cleanly rather than leaving half the system running.

### Alternatives considered

1. **Run the existing discord-bot CLI as a separate process.** This is operationally simple but forces Pyxis integration through SQLite or a new network API. It is not ideal for shared services/audit.
2. **Have JS call Pyxis HTTP APIs.** This would be familiar, but the runtime lacks `fetch`/`http` by design (`discord-js-bot-api-reference.md:41-45`). Adding HTTP just for this is less direct than a native module.
3. **Rewrite the bot entirely in Go.** This avoids Goja but discards a fleshed-out bot, UI DSL, command declarations, and existing tests.
4. **Use `pkg/botcli` first.** Useful later, but too much CLI surface for the initial embedded production bot.

### Open questions

- Where should admin/booker Discord role IDs live long-term: settings table, environment flags, or both?
- Should `ctx.discord.channels.send` be enhanced upstream to return the created message snapshot so Pyxis does not need recent-message matching?
- Should the bot support editing existing announcements when a show changes, not only posting/canceling/archive flows?
- Should the settings page become the source of truth for all bot channel/role mappings before bot launch?

## References

- Pyxis command entrypoint: `cmd/pyxis/main.go:21-58`
- Pyxis serve command: `cmd/pyxis/cmds/serve.go:24-87`
- Pyxis server/service wiring: `pkg/server/server.go:33-68`
- Pyxis staff show routes: `pkg/server/server.go:92-99`
- Pyxis show service: `pkg/service/show_service.go:42-113`
- Pyxis Discord placeholder: `pkg/discord/client.go:1-31`
- Pyxis DB show/settings schema: `pkg/db/migrations/000001_init.up.sql:39-59`, `pkg/db/migrations/000001_init.up.sql:115-132`
- Pyxis settings domain: `pkg/domain/settings.go:5-25`
- Pyxis frontend announce button: `web/packages/pyxis-app/src/pages/Pages.tsx:207-245`
- Discord framework embedding API: `../corporate-headquarters/discord-bot/pkg/framework/framework.go:1-189`
- Discord bot CLI embedding docs: `../corporate-headquarters/discord-bot/pkg/botcli/doc.go:1-21`
- Goja host loading: `../corporate-headquarters/discord-bot/internal/jsdiscord/host.go:21-59`
- Discord bot JS API: `../corporate-headquarters/discord-bot/pkg/doc/topics/discord-js-bot-api-reference.md:33-45`, `208-335`, `650-697`
- Show-space bot: `../corporate-headquarters/discord-bot/examples/discord-bots/show-space/index.js:443-811`
- Show-space store: `../corporate-headquarters/discord-bot/examples/discord-bots/show-space/lib/store.js:1-325`
- Evidence bundle generated for this ticket: `ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/sources/01-evidence-line-references.md`
