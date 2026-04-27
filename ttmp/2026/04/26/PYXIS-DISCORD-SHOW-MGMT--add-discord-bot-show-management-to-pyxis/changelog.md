# Changelog

## 2026-04-26

- Created ticket `PYXIS-DISCORD-SHOW-MGMT` for adding Discord bot show management to Pyxis.
- Added primary design document with evidence-backed analysis of Pyxis, `corporate-headquarters/discord-bot`, `go-go-goja`, and the existing `show-space` bot.
- Added investigation diary with prompt context, commands run, findings, risks, and continuation notes.
- Added `scripts/01-collect-discord-show-management-evidence.sh` and generated `sources/01-evidence-line-references.md`.
- Updated tasks to separate completed research/documentation from open implementation phases.

## 2026-04-26

Created Discord bot show-management analysis/design guide, diary, tasks, and evidence bundle.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/design-doc/01-discord-bot-show-management-design-and-implementation-guide.md — Primary deliverable


## 2026-04-26

Validated ticket with docmgr doctor and uploaded bundled documentation to reMarkable at /ai/2026/04/26/PYXIS-DISCORD-SHOW-MGMT.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/reference/01-investigation-diary.md — Delivery and validation evidence


## 2026-04-26

Uploaded refreshed v2 reMarkable bundle after appending validation/upload diary step.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/reference/01-investigation-diary.md — Includes validation and upload diary step


## 2026-04-26

Expanded tasks.md into a detailed phase-by-phase implementation checklist for the Discord bot show-management work.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/reference/01-investigation-diary.md — Diary update for task expansion
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/tasks.md — Detailed implementation checklist


## 2026-04-26

Implemented the Phase 0-7 foundation: framework dependency, copied Pyxis bot, Discord metadata propagation, native require("pyxis") module, bot runner, and serve lifecycle flags.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/bot/discord/show-space/index.js — Copied and adapted Discord bot
- /home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/cmds/serve.go — Bot startup flags and lifecycle
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/discordbot/pyxis_module.go — Goja native Pyxis module
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/discordbot/runner.go — Embedded framework runner


## 2026-04-26

Added a Discord bot runner load test and updated Phase 0-7 task status after implementation.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/discordbot/runner_test.go — Framework-level bot load test
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/reference/01-investigation-diary.md — Diary update for test/task checkpoint
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/tasks.md — Updated completed implementation tasks

