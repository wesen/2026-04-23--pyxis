# Changelog

## 2026-04-27

- Initial workspace created.

## 2026-04-27

Closed the Keycloak/OIDC ticket and created the Discord OAuth staff-authentication implementation ticket.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/27/PYXIS-AUTH-KEYCLOAK--implement-pyxis-staff-authentication-with-keycloak-oidc/index.md — closed Keycloak ticket
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/index.md — new Discord OAuth ticket index

## 2026-04-27

Created a detailed Discord OAuth staff-auth implementation guide, phased task list, and diary.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/design/01-discord-oauth-staff-auth-implementation-guide.md — detailed implementation guide
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/tasks.md — phased task list
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/reference/01-discord-oauth-ticket-diary.md — ticket diary

## 2026-04-27

Implemented Discord OAuth phases 1-5: configurable website URL, OAuth config flags/env, login route, state validation, secure cookies, idempotent logout, and Discord role-to-local-role mapping.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/cmds/serve.go — added OAuth config flags/env validation
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/config/config.go — added website/session/OAuth/role config
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/auth_service.go — added Discord role mapping and auth URL helper
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/auth.go — added login route, state validation, secure cookie helpers, callback redirect, logout hardening
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/auth_test.go — auth route/helper tests
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/auth_service_test.go — role mapping tests
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/tasks.md — checked off T02-T16

## 2026-04-27

Added staff frontend session gating, Discord login buttons, logout mutation/UI, callback error tests, and a ticket-local Discord OAuth login initiation smoke script.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/App.tsx — session-gated staff routes
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/pages/LoginPage/Page.tsx — Discord login integration
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/appApi.ts — logout mutation
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/shell/AppSidebarUserFooter/AppSidebarUserFooter.tsx — session user and logout UI
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/27/PYXIS-AUTH-DISCORD-OAUTH--complete-pyxis-staff-authentication-with-discord-oauth/scripts/01-discord-oauth-login-smoke.sh — pre-callback smoke script
