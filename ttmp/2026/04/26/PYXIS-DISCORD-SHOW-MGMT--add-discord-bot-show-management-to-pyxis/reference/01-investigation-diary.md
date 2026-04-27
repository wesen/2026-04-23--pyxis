---
Title: Investigation diary
Ticket: PYXIS-DISCORD-SHOW-MGMT
Status: active
Topics:
    - pyxis
    - discord-bot
    - show-management
    - goja
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/scripts/01-collect-discord-show-management-evidence.sh
      Note: Reproducible evidence collection script
    - Path: ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/sources/01-evidence-line-references.md
      Note: Generated line-reference evidence bundle
ExternalSources: []
Summary: Chronological diary for the Discord bot show management research/design ticket.
LastUpdated: 2026-04-26T23:55:00-04:00
WhatFor: Use this to resume or review the research/design work for the Pyxis Discord bot ticket.
WhenToUse: Read before implementing the bot integration or updating the ticket docs.
---


# Diary

## Goal

This diary records the investigation and documentation work for adding Discord bot show-management functionality to Pyxis by reusing the `corporate-headquarters/discord-bot` framework and porting its existing `show-space` bot.

## Step 1: Create the ticket and map the codebases

I created a new docmgr ticket and started by mapping both sides of the integration: the Pyxis app, and the reusable Discord bot framework plus show-space example. The main intent was to avoid writing a speculative plan and instead anchor the design to concrete files, existing routes, schemas, and framework APIs.

The most important discovery is that Pyxis already has many Discord-shaped seams: a no-op `pkg/discord.Client`, staff route `POST /api/app/shows/{id}/announce`, settings fields for Discord channels, and database columns for `discord_message_id` / `discord_channel_id`. The main work is therefore not greenfield bot creation; it is lifecycle wiring, shared persistence, and replacing the show-space bot's SQLite store with a Pyxis-native Goja module.

### Prompt Context

**User prompt (verbatim):** "Create a new docmgr ticket for adding discord bot funcitonality to the pyxis app to do show management. We will use the @../corporate-headquarters/discord-bot/ framework which uses @../corporate-headquarters/go-go-goja to interface with it. There is already a pretty fleshed out bot for show announcement in there that we should copy into this app and adapt (or port over).

reate a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet  
point sand pseudocode and diagrams and api references and file                                                                                                                                              
  references.                                                                                                                                                                                               
  It should be very clear and detailed. Store in the ticket and the nupload to remarkable.                                                                                                                  
                                                                                                                                                                                                            
You can write scripts and all kinds of other things in the scripts/ folder of the ticket.    

Keep a diary as you work"

**Assistant interpretation:** Create a docmgr ticket, investigate Pyxis and the corporate Discord bot framework, write a detailed intern-friendly design/implementation guide, keep a diary, and upload the resulting docs to reMarkable.

**Inferred user intent:** The user wants a high-context handoff document so a new intern can implement Discord show management in Pyxis by porting a known working bot instead of inventing the architecture from scratch.

**Commit (code):** N/A — documentation-only ticket work; no Git commit was requested or made.

### What I did

- Loaded the relevant docmgr, diary, ticket research, and reMarkable upload skills.
- Ran `docmgr status --summary-only` to confirm the current docs root and ticket state.
- Created ticket `PYXIS-DISCORD-SHOW-MGMT` with title `Add Discord bot show management to Pyxis` and topics `pyxis,discord-bot,show-management,goja`.
- Added the primary design doc: `design-doc/01-discord-bot-show-management-design-and-implementation-guide.md`.
- Added this diary doc: `reference/01-investigation-diary.md`.
- Listed Pyxis repository files and relevant framework files under `../corporate-headquarters/discord-bot` and `../corporate-headquarters/go-go-goja`.
- Inspected Pyxis command/server/service/schema/frontend files and the framework's public embedding APIs.
- Inspected the existing show-space bot in detail, especially command registration, runtime config, permissions, announcement posting, pinning, cancellation, archive, and SQLite-backed store behavior.
- Wrote `scripts/01-collect-discord-show-management-evidence.sh` to regenerate a line-numbered evidence bundle.
- Ran the script and generated `sources/01-evidence-line-references.md`.
- Replaced the design-doc scaffold with a detailed architecture and implementation guide.

### Why

- The user asked specifically for a ticket-backed design and implementation guide, not immediate code changes.
- The implementation will cross multiple systems, so a future intern needs an architecture map before editing files.
- The evidence script makes it easier to refresh line references later if source files change.

### What worked

- `docmgr ticket create-ticket`, `docmgr doc add`, and repository search commands worked normally.
- The corporate Discord bot framework has a clean public `pkg/framework` embedding API that fits Pyxis's `serve` lifecycle.
- The show-space bot is already close to the requested feature set and includes the most important command flows.
- Pyxis already has DB/settings/frontend hooks for Discord integration, reducing the implementation scope.

### What didn't work

- No command failed during this step.
- One notable gap found during investigation is architectural rather than a tool failure: Pyxis DB migrations include `discord_message_id` and `discord_channel_id`, but the current domain/proto/query layers do not fully expose those fields.

### What I learned

- The bot framework runs JavaScript in Goja, not Node.js. Bot scripts cannot use Node `fs`, `path`, `http`, `fetch`, or npm packages, so the Pyxis integration should be a Go-native `require("pyxis")` module rather than HTTP calls from JavaScript.
- The framework's `framework.WithRuntimeModuleRegistrars(...)` option is the key integration hook for injecting Pyxis services into bot JavaScript.
- The existing show-space bot's SQLite store should not be ported as-is because Pyxis must keep PostgreSQL as the source of truth.
- The existing web app already has an “Announce” button that will need the same real posting/pinning semantics as the Discord slash commands.

### What was tricky to build

- The design needed to respect Go internal package boundaries. Pyxis should not import `discord-bot/internal/jsdiscord`; it should use `pkg/framework` and maybe `pkg/botcli` only.
- The design needed to balance two paths: the web app's existing `ShowService.Announce` seam and the Discord bot's `ctx.discord.*` operations. The guide recommends a shared announcement service or native module-backed service calls so behavior does not diverge.
- The evidence was spread across three repositories/directories, so I wrote the evidence-collection script to keep line references reproducible.

### What warrants a second pair of eyes

- Whether `/api/app/shows/{id}/announce` should post through a Go `discordgo` client, through a bot bridge, or through a new shared `AnnouncementService` needs a careful implementation decision.
- Whether Discord role IDs belong in environment flags, the settings table, or both should be decided before the settings UI is expanded.
- Whether `ctx.discord.channels.send` returns a usable message snapshot should be verified in the framework; if it does, Pyxis should avoid the current recent-message matching race.

### What should be done in the future

- Implement Phase 1-8 from the design guide.
- Update the diary with implementation steps, exact errors, tests, and commits once code changes begin.
- Refresh `sources/01-evidence-line-references.md` after major source edits.

### Code review instructions

- Start by reading `design-doc/01-discord-bot-show-management-design-and-implementation-guide.md`.
- Then inspect:
  - `cmd/pyxis/cmds/serve.go`
  - `pkg/server/server.go`
  - `pkg/service/show_service.go`
  - `pkg/discord/client.go`
  - `../corporate-headquarters/discord-bot/pkg/framework/framework.go`
  - `../corporate-headquarters/discord-bot/examples/discord-bots/show-space/index.js`
- Validate documentation structure with `docmgr doctor --ticket PYXIS-DISCORD-SHOW-MGMT --stale-after 30`.
- Validate future code changes with `go test ./...` and a Discord dev-guild smoke test.

### Technical details

Commands run during this step included:

```bash
docmgr status --summary-only
pwd
git status --short
find .. -maxdepth 2 -type d -name 'discord-bot' -o -name 'go-go-goja' | sort

docmgr ticket create-ticket --ticket PYXIS-DISCORD-SHOW-MGMT --title "Add Discord bot show management to Pyxis" --topics pyxis,discord-bot,show-management,goja
docmgr doc add --ticket PYXIS-DISCORD-SHOW-MGMT --doc-type design-doc --title "Discord bot show management design and implementation guide"
docmgr doc add --ticket PYXIS-DISCORD-SHOW-MGMT --doc-type reference --title "Investigation diary"
docmgr ticket list --ticket PYXIS-DISCORD-SHOW-MGMT

rg --files
rg --files ../corporate-headquarters/discord-bot
rg --files ../corporate-headquarters/go-go-goja

grep '^module' go.mod ../corporate-headquarters/discord-bot/go.mod ../corporate-headquarters/go-go-goja/go.mod
rg -n "handleAnnounceShow|Announce|discord_message|discord_channel|Discord|show-space|registerCommand|createRuntime|framework|Run" pkg cmd ../corporate-headquarters/discord-bot/pkg ../corporate-headquarters/discord-bot/internal ../corporate-headquarters/discord-bot/examples/discord-bots/show-space ../corporate-headquarters/discord-bot/examples/framework-combined ../corporate-headquarters/discord-bot/README.md ../corporate-headquarters/discord-bot/pkg/doc -S

ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/scripts/01-collect-discord-show-management-evidence.sh
```


## Step 2: Validate and upload to reMarkable

I validated the ticket with docmgr and uploaded the documentation bundle to reMarkable. The first doctor run found missing vocabulary entries and missing frontmatter on the generated evidence bundle; I fixed both before uploading.

This step turned the ticket from a local research artifact into a delivered handoff bundle. The final remote destination is `/ai/2026/04/26/PYXIS-DISCORD-SHOW-MGMT`.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Finish validation and publish the ticket docs to reMarkable.

**Inferred user intent:** Make the intern-facing implementation guide easy to read on the reMarkable device as a bundled PDF.

**Commit (code):** N/A — documentation-only ticket work; no Git commit was requested or made.

### What I did

- Ran `docmgr doctor --ticket PYXIS-DISCORD-SHOW-MGMT --stale-after 30`.
- Added vocabulary entries for `pyxis`, `discord-bot`, `show-management`, and `goja` after doctor reported unknown topics.
- Added valid docmgr frontmatter to `sources/01-evidence-line-references.md` and updated the evidence script so future regenerations include frontmatter.
- Re-ran doctor successfully.
- Ran `remarquee status` and `remarquee cloud account --non-interactive`.
- Ran a dry-run bundle upload.
- Uploaded the bundle to `/ai/2026/04/26/PYXIS-DISCORD-SHOW-MGMT`.
- Verified the remote listing.

### Why

- Ticket docs should pass docmgr validation before handoff.
- The user explicitly asked to upload the guide to reMarkable.
- The generated source evidence file is inside the ticket, so it needed valid frontmatter for docmgr hygiene.

### What worked

- `docmgr doctor` passed after vocabulary/frontmatter fixes.
- `remarquee status` and cloud account check succeeded.
- Bundle dry-run succeeded before the real upload.
- The reMarkable upload completed and remote listing showed `PYXIS-DISCORD-SHOW-MGMT - Discord bot show management`.

### What didn't work

- Initial `docmgr doctor` reported:
  - unknown topics: `discord-bot`, `goja`, `pyxis`, `show-management`
  - missing frontmatter delimiters in `sources/01-evidence-line-references.md`
- Both were fixed before upload.

### What I learned

- Generated files under ticket folders should also include docmgr frontmatter when doctor scans the full ticket.
- New ticket topics must be added to `ttmp/vocabulary.yaml` if they are not already in the repository vocabulary.

### What was tricky to build

- The evidence script originally generated plain Markdown. That was fine for reading but not fine for docmgr validation because the generated file lived in the ticket's `sources/` directory. Updating both the generated file and the script avoided a future regression.

### What warrants a second pair of eyes

- Confirm whether the reMarkable bundle ordering is ideal for the intern. It currently includes index, design guide, diary, tasks, and changelog.

### What should be done in the future

- If the evidence script is rerun, re-run `docmgr doctor` before future uploads.
- Upload a refreshed bundle after implementation begins and the diary accumulates code/test entries.

### Code review instructions

- Validate docs with `docmgr doctor --ticket PYXIS-DISCORD-SHOW-MGMT --stale-after 30`.
- Verify reMarkable delivery with `remarquee cloud ls /ai/2026/04/26/PYXIS-DISCORD-SHOW-MGMT --long --non-interactive`.

### Technical details

Commands run during this step included:

```bash
docmgr doctor --ticket PYXIS-DISCORD-SHOW-MGMT --stale-after 30

docmgr vocab add --category topics --slug pyxis --description "Pyxis venue management application"
docmgr vocab add --category topics --slug discord-bot --description "Discord bot framework and bot integrations"
docmgr vocab add --category topics --slug show-management --description "Show scheduling, announcement, cancellation, archive, and venue operations workflows"
docmgr vocab add --category topics --slug goja --description "Goja JavaScript runtime integrations and native modules"

remarquee status
remarquee cloud account --non-interactive
remarquee upload bundle --dry-run ... --name "PYXIS-DISCORD-SHOW-MGMT - Discord bot show management" --remote-dir "/ai/2026/04/26/PYXIS-DISCORD-SHOW-MGMT" --toc-depth 2
remarquee upload bundle ... --name "PYXIS-DISCORD-SHOW-MGMT - Discord bot show management" --remote-dir "/ai/2026/04/26/PYXIS-DISCORD-SHOW-MGMT" --toc-depth 2
remarquee cloud ls /ai/2026/04/26/PYXIS-DISCORD-SHOW-MGMT --long --non-interactive
```


## Step 3: Expand implementation tasks

I expanded the ticket task list from a high-level phase checklist into a detailed implementation checklist. The new task list is organized by phase so an intern can work through setup, dependency wiring, bot copy/porting, data model changes, native Goja module implementation, serve lifecycle wiring, HTTP announce alignment, settings UX, safety checks, tests, manual Discord smoke testing, and documentation follow-through.

This does not change application code. It makes the ticket more actionable by turning the design guide into concrete checkboxes.

### Prompt Context

**User prompt (verbatim):** "add detailed tasks to the ticket."

**Assistant interpretation:** Replace or expand the ticket task list with granular implementation tasks based on the design guide.

**Inferred user intent:** Make the ticket actionable enough that an implementer can pick up individual checklist items without rereading the entire design document each time.

**Commit (code):** N/A — documentation-only ticket work; no Git commit was requested or made.

### What I did

- Read the current `tasks.md`.
- Rewrote it into a detailed phase-by-phase checklist.
- Preserved completed research/documentation tasks under `DONE`.
- Added new phases for preparation, dependency integration, bot copy/rename, data model changes, runner package, native `require("pyxis")` module, JavaScript porting, serve lifecycle, HTTP announce alignment, settings UX, permissions/safety, automated tests, manual Discord smoke testing, and documentation follow-through.

### Why

- The previous task list had useful phases but was too coarse for a new intern.
- The design doc contains many implementation details; converting those into checklist items lowers the risk of missed work.

### What worked

- The detailed task list could be derived directly from the existing design guide.
- No tool or validation issue occurred during the task expansion itself.

### What didn't work

- N/A.

### What I learned

- The implementation naturally splits into thirteen phases, including non-code operational validation. The Discord development-guild smoke test deserves its own explicit phase because many integration failures will only appear against Discord.

### What was tricky to build

- The tasks needed to be detailed without pretending that all design questions are already closed. I left decision tasks in place for role ID source of truth, HTTP announcement architecture, and module replacement strategy.

### What warrants a second pair of eyes

- Review whether the phase ordering matches the team's preferred implementation sequence, especially whether settings UX should happen before or after the bot runner is functional.

### What should be done in the future

- Check off tasks as implementation proceeds.
- Add new subtasks if the Discord framework integration reveals additional requirements.

### Code review instructions

- Review `tasks.md` for phase coverage and sequencing.
- Validate the ticket with `docmgr doctor --ticket PYXIS-DISCORD-SHOW-MGMT --stale-after 30`.

### Technical details

Updated file:

```text
ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/tasks.md
```
