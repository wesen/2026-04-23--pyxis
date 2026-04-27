# Tasks

## TODO

### Phase 0 — Preparation and guardrails

- [x] Read the design guide before touching code: `design-doc/01-discord-bot-show-management-design-and-implementation-guide.md`.
- [x] Read the implementation diary before continuing work: `reference/01-investigation-diary.md`.
- [ ] Re-run the evidence script if source files have drifted: `scripts/01-collect-discord-show-management-evidence.sh`.
- [x] Confirm the current working tree and avoid mixing unrelated changes into the Discord bot implementation.
- [x] Create a dedicated implementation branch, for example `feature/pyxis-discord-show-bot`.
- [x] Decide whether local development should use Go module `replace` directives for `../corporate-headquarters/discord-bot` and `../corporate-headquarters/go-go-goja`.
- [x] Record any implementation start notes in the diary before code changes begin.

### Phase 1 — Add framework dependency and verify build plumbing

- [x] Add `github.com/go-go-golems/discord-bot` to `go.mod`.
- [x] Ensure `github.com/go-go-golems/go-go-goja` resolves through the framework dependency or an explicit local `replace` when developing across checkouts.
- [x] Confirm Pyxis imports only public framework packages such as `github.com/go-go-golems/discord-bot/pkg/framework` and does not import `discord-bot/internal/...`.
- [x] Run `go mod tidy`.
- [x] Run `go test ./...` and capture failures in the diary.
- [x] If dependency conflicts appear, document exact module versions and resolution decisions in the diary.

### Phase 2 — Copy, rename, and baseline the show-space bot

- [x] Create a Pyxis-owned bot folder, for example `bot/discord/show-space/`.
- [x] Copy `../corporate-headquarters/discord-bot/examples/discord-bots/show-space/index.js` into the Pyxis bot folder.
- [x] Copy reusable helper files: `lib/dates.js`, `lib/render.js`, and `lib/permissions.js`.
- [x] Decide whether to copy `shows.json` only for tests/demos or omit it from production runtime.
- [x] Rename bot metadata from `show-space` to `pyxis-show-space` or `pyxis-shows` in `configure({ name: ... })`.
- [x] Update description/category text so Discord help clearly says this bot manages Pyxis shows.
- [x] Update custom component IDs from `show-space:*` to a Pyxis-specific prefix if command/component collisions are possible.
- [x] Remove or isolate the old SQLite `lib/store.js` path so production code cannot accidentally use a separate show database.
- [x] Add a temporary README in `bot/discord/show-space/` explaining which upstream files were copied and what changed.

### Phase 3 — Expose Discord message metadata in the Pyxis data model

- [x] Add `DiscordMessageID string` and `DiscordChannelID string` to `pkg/domain/show.go`.
- [x] Add `discord_message_id` and `discord_channel_id` fields to `proto/pyxis/v1/show.proto` using new, non-conflicting tag numbers.
- [x] Regenerate Go protobuf code.
- [x] Regenerate TypeScript protobuf/types package output.
- [x] Update `pkg/db/queries/shows.sql` so list/get/create/update queries preserve Discord metadata.
- [x] Run SQLC generation for updated queries.
- [x] Update `pkg/repository/postgres/show_repo.go` mappings between SQLC rows and `domain.Show`.
- [x] Add repository methods or queries for `AttachDiscordMessage`, `FindByDiscordMessage`, and expired confirmed shows if the service layer needs them.
- [x] Update `showToProto`, `protoToDomainShow`, and `domainShowToAppShow` in server conversion code.
- [ ] Update frontend code so pinned/Discord status can use real `discordMessageId` / `discordChannelId` instead of static placeholders.
- [ ] Update MSW/mock data for Discord metadata.
- [ ] Add tests or snapshots that prove a show can round-trip Discord message/channel IDs through API responses.

### Phase 4 — Add a Pyxis Discord bot runner package

- [x] Create `pkg/discordbot/runner.go`.
- [x] Define a `discordbot.Config` with script path, sync-on-start, debug flag, runtime config, and Discord credentials.
- [x] Define a dependency struct with `ShowService`, `SettingsService`, `AuditService`, and any required repositories/queries.
- [x] Implement `NewRunner(ctx, cfg, deps)` using `framework.New(...)`.
- [x] Pass `framework.WithCredentials(...)` or `framework.WithCredentialsFromEnv()` depending on final config design.
- [x] Pass `framework.WithScript(...)` pointing at the copied Pyxis bot script.
- [x] Pass `framework.WithRuntimeConfig(...)` with channel IDs, role IDs, timezone, and debug values.
- [x] Pass `framework.WithRuntimeModuleRegistrars(...)` with the future Pyxis native module registrar.
- [x] Pass `framework.WithSyncOnStart(...)` from config.
- [x] Implement `Run(ctx)` and `Close()` wrappers.
- [x] Add logging around bot creation, command sync, gateway open, shutdown, and failures.
- [x] Add unit tests for config validation and script path resolution.

### Phase 5 — Implement the Goja native `require("pyxis")` module

- [x] Create `pkg/discordbot/pyxis_module.go` implementing `engine.RuntimeModuleRegistrar`.
- [x] Register a native module named `pyxis`.
- [x] Expose `pyxis.shows.listUpcoming({ limit })`.
- [x] Expose `pyxis.shows.listPast({ limit })`.
- [x] Expose `pyxis.shows.get(id)`.
- [x] Expose `pyxis.shows.create(input, actor)`.
- [x] Expose `pyxis.shows.attachDiscordMessage(id, channelId, messageId)`.
- [x] Expose `pyxis.shows.cancel(id, actor)`.
- [x] Expose `pyxis.shows.archive(id, actor)`.
- [x] Expose `pyxis.shows.archiveExpired({ referenceDate, actor })` if auto-archive should be bot-driven.
- [x] Expose `pyxis.settings.get()` with normalized runtime settings.
- [ ] Expose `pyxis.audit.log(...)` only if direct audit calls from JavaScript are necessary.
- [x] Add DTO conversion helpers from `domain.Show` to the JavaScript shape expected by the copied bot.
- [x] Add robust ID coercion for JS strings/numbers.
- [x] Return `{ ok: false, error: string }` for user-facing failures instead of raw Go exceptions where appropriate.
- [x] Ensure native module methods use safe contexts and do not leak database handles into JavaScript.
- [ ] Add Go tests for each native module method with fake services or a test database.

### Phase 6 — Port bot store calls from SQLite to Pyxis services

- [x] Replace `require("database")` usage with `require("pyxis")`.
- [x] Replace `hasDatabase(ctx)` and SQLite initialization logic with Pyxis service availability checks or remove it entirely.
- [x] Replace `repoListUpcoming` with `pyxis.shows.listUpcoming`.
- [x] Replace `repoListPast` with `pyxis.shows.listPast`.
- [x] Replace `repoGetShow` with `pyxis.shows.get`.
- [x] Replace `repoCreateShow` with `pyxis.shows.create`.
- [x] Replace `repoAttachDiscordMessage` with `pyxis.shows.attachDiscordMessage`.
- [x] Replace `repoCancelShow` with `pyxis.shows.cancel`.
- [x] Replace `repoArchiveShow` with `pyxis.shows.archive`.
- [x] Replace `repoArchiveByDiscordMessage` with a Pyxis-backed lookup/update path.
- [x] Replace `repoArchiveExpiredShows` with a Pyxis-backed query/update path.
- [x] Ensure actor information from `ctx.user` / `ctx.member` is passed into mutating service calls.
- [x] Keep `lib/render.js`, `lib/dates.js`, and `lib/permissions.js` small and framework-compatible.
- [x] Run bot runtime tests or a local compile/load check after the port.

### Phase 7 — Wire bot lifecycle into `pyxis serve`

- [x] Extend `ServeSettings` in `cmd/pyxis/cmds/serve.go` with Discord bot flags.
- [x] Add `--discord-bot` / `--discord-bot-enabled` to enable the bot explicitly.
- [x] Add `--discord-bot-script` with a default pointing to the copied bot script.
- [x] Add `--discord-sync-on-start` for development command sync.
- [x] Add `--discord-debug` to enable debug-only Discord commands.
- [x] Add `--discord-admin-role-id` and `--discord-booker-role-id` unless these are moved entirely into settings.
- [x] Add corresponding fields to `pkg/config.Config`.
- [x] Decide whether the HTTP server and bot should run under `errgroup.WithContext` so one failure cancels the other.
- [x] Build shared service dependencies once and pass equivalent services to both HTTP server and bot runner, or refactor server construction so dependency creation is not duplicated.
- [x] Ensure graceful shutdown closes both HTTP server and bot runtime.
- [x] Log a clear startup message when the bot is disabled.
- [x] Log a clear startup error if bot credentials are missing while the bot is enabled.

### Phase 8 — Align HTTP announce with Discord bot behavior

- [ ] Review `pkg/service/show_service.go::Announce` and decide whether it should remain on `discord.Client` or move to a dedicated `AnnouncementService`.
- [ ] Implement real posting for `/api/app/shows/{id}/announce` instead of the current no-op behavior.
- [ ] Reuse the same rendering semantics as the bot for show announcement payloads.
- [ ] Post to the configured upcoming-shows channel.
- [ ] Pin the announcement message.
- [ ] Persist `discord_channel_id` and `discord_message_id` on the show.
- [ ] Add audit metadata for HTTP-triggered announcements.
- [ ] Return a useful API response that lets the frontend know whether the show is now posted/pinned.
- [ ] Update the frontend show detail Discord panel to display the real posted state.
- [ ] Update the frontend success/error messages for announcement requests.
- [ ] Confirm slash-command announcement and web-button announcement do not create duplicate posts unexpectedly.

### Phase 9 — Settings and configuration UX

- [ ] Decide final source of truth for Discord guild ID, channel IDs, admin role ID, booker role ID, timezone, and feature toggles.
- [ ] If settings table is the source of truth, add missing role ID columns and migrations.
- [ ] Update `domain.Settings`, SQL queries, protobuf, generated TS, and server handlers for any new settings fields.
- [ ] Fix `handleUpdateSettings` so it preserves and updates all settings fields currently exposed by protobuf/frontend.
- [ ] Replace static Discord page seed mappings with real settings-backed mappings.
- [ ] Add UI controls or documented env-only behavior for bot credentials, making sure secrets are not stored accidentally if that is not intended.
- [ ] Add a setup/checklist view or admin instructions for copying Discord channel and role IDs.

### Phase 10 — Permission and safety checks

- [ ] Keep role-gated management commands: announce/add/cancel require admin or booker; archive/unpin/archive-expired require admin.
- [ ] Keep or adapt debug commands for role ID troubleshooting.
- [ ] Ensure permission-denied messages show exact member role IDs and required role IDs without leaking secrets.
- [ ] Ensure commands fail safely when channel IDs are missing.
- [ ] Ensure commands fail safely when `discordPosting` is disabled, if that setting is enforced.
- [ ] Ensure cancellation/archive flows update Pyxis state even if unpin or notification posting fails, and record partial failures in logs/audit.
- [ ] Ensure bot startup does not sync commands to the wrong production guild during local development.

### Phase 11 — Automated tests

- [ ] Add repository tests for Discord metadata persistence.
- [ ] Add service tests for announce/cancel/archive behavior around Discord metadata.
- [ ] Add native module tests for JS-facing DTO conversion and error handling.
- [ ] Add copied bot compile/load tests to catch syntax errors under Goja.
- [ ] Add command dispatch tests for `/upcoming`, `/show`, `/add-show`, `/cancel-show`, `/archive-show`, and `/archive-expired` if feasible through framework APIs.
- [ ] Add tests for permission denial paths.
- [ ] Add tests for missing channel/runtime config errors.
- [ ] Update frontend tests/MSW stories for posted/pinned Discord state.
- [ ] Run `go test ./...`.
- [ ] Run frontend typecheck/build/test commands used by this repo.

### Phase 12 — Manual Discord development-guild smoke test

- [ ] Create or identify a Discord development guild and channel set.
- [ ] Export `DISCORD_BOT_TOKEN`, `DISCORD_APPLICATION_ID`, and `DISCORD_GUILD_ID` for the dev bot.
- [ ] Start PostgreSQL with the Pyxis development database.
- [ ] Run database migrations and seed data as needed.
- [ ] Start `pyxis serve` with the bot enabled and `--discord-sync-on-start`.
- [ ] Run `/debug-my-roles` and verify role IDs match configuration.
- [ ] Run `/upcoming` and compare output with public/app show lists.
- [ ] Run `/add-show` and verify the show appears in the web app and database.
- [ ] Verify the announcement appears in the configured upcoming channel.
- [ ] Verify the announcement is pinned.
- [ ] Verify `discord_channel_id` and `discord_message_id` are stored on the show row.
- [ ] Run `/show <id>` and verify full details.
- [ ] Run `/cancel-show <id>` and verify status, unpin behavior, and cancellation notice.
- [ ] Run `/archive-show <id>` and verify status and unpin behavior.
- [ ] Run `/archive-expired` with a controlled past show.
- [ ] Click the web app “Announce” button and verify behavior matches slash-command announcement.
- [ ] Capture exact manual smoke commands/results in the diary.

### Phase 13 — Documentation and delivery follow-through

- [ ] Update the implementation diary after each significant implementation step.
- [ ] Update the design guide if implementation decisions differ from the current proposal.
- [ ] Add a short operator runbook if bot setup requires multiple environment variables and Discord developer-portal steps.
- [ ] Add code review notes with files to inspect and validation commands.
- [ ] Run `docmgr doctor --ticket PYXIS-DISCORD-SHOW-MGMT --stale-after 30`.
- [ ] Upload a refreshed reMarkable bundle after implementation begins or completes.

## DONE

- [x] Create docmgr ticket `PYXIS-DISCORD-SHOW-MGMT`.
- [x] Create primary design doc and investigation diary.
- [x] Inspect Pyxis app architecture, Discord bot framework, Goja runtime constraints, and the existing `show-space` bot.
- [x] Add `scripts/01-collect-discord-show-management-evidence.sh` and generate an evidence bundle.
- [x] Write detailed intern-oriented analysis/design/implementation guide.
- [x] Validate the ticket with `docmgr doctor`.
- [x] Upload the documentation bundle to reMarkable.
- [x] Expand this task list into phase-by-phase implementation checklists.
