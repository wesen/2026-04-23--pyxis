# Pyxis show-space Discord bot

This bot is ported from `../corporate-headquarters/discord-bot/examples/discord-bots/show-space`.

The Pyxis copy keeps the upstream command shape, render helpers, date parsing, and role-debug tools, but it is intended to use Pyxis's PostgreSQL-backed services as the source of truth via a Goja native `require("pyxis")` module.

## Porting notes

- Bot metadata should use `pyxis-show-space` to avoid collisions with the upstream example bot.
- Production code must not use the upstream SQLite `require("database")` store. Pyxis owns shows, settings, and audit logs.
- Mutating commands should pass Discord actor information to Pyxis service methods so audit logs can identify the operator.
- Command IDs/components use a `pyxis-show-space:*` prefix.
