# Changelog

## 2026-04-29

- Initial workspace created

- 2026-04-29: Created production deployment ticket and inventoried Pyxis, discord-bot, and Hetzner k3s GitOps references.
- 2026-04-29: Added intern-oriented production Glazed/Argo CD implementation guide covering architecture, CI, Docker, GitOps, Vault, PostgreSQL, Discord OAuth, migrations, validation, and rollout risks.
- 2026-04-29: Added focused playbooks for packaging/CI, Argo CD GitOps rollout, and production smoke testing.
- 2026-04-29: Validated doc frontmatter/docmgr hygiene and uploaded the production guide/playbook bundle to reMarkable at `/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED/PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks`.
- 2026-04-29: Clarified the PostgreSQL v1 decision: reuse existing shared in-cluster Postgres, create Pyxis DB/user via Argo-synced bootstrap Job, and defer Terraform/operator approaches.
- 2026-04-29: Expanded tasks into detailed implementation phases from packaging baseline through first production rollout.
- 2026-04-29: Completed Phase 1 packaging baseline: Dockerfile, .dockerignore, Makefile CI/image targets, golangci config, published module dependencies instead of local replace directives, and Docker smoke validation.
- 2026-04-29: Uploaded v3 reMarkable bundle including PostgreSQL clarification, expanded tasks, Phase 1 packaging implementation notes, and CGO/local-replace findings.
- 2026-04-29: Completed Phase 2 production config hardening: env-backed bind/DB/flyer/Discord-bot settings, configurable flyer storage, production env example, and session-secret audit.
- 2026-04-29: Revalidated `BUILD_WEB_LOCAL=1 make build-embed` and `make docker-smoke IMAGE_REPOSITORY=pyxis IMAGE_TAG=phase2-local` after Phase 2 config changes.
- 2026-04-29: Completed Phase 3 CI/CD baseline: push validation, image publishing, lint/security workflows, Dependabot, GoReleaser config, CI/CD docs, and validation.
- 2026-04-29: Revalidated Phase 3 with `make generate` and `go test ./... -count=1`.
- 2026-04-29: Uploaded v4 reMarkable bundle after Phase 3 CI/CD completion.
- 2026-04-29: Completed Phase 4 GitOps package in the k3s repo and committed `816a0f9 PYXIS: add argocd gitops package`; saved Kustomize/client-dry-run evidence and server-side dry-run caveat.
- 2026-04-29: Uploaded v5 reMarkable bundle after Phase 4 GitOps package completion.
- 2026-04-29: Completed Phase 5 GitOps PR automation with target metadata, dry-run-capable updater script, publish-image workflow handoff, docs, and local dry-run evidence.
- 2026-04-29: Hardened GitOps PR script logging to redact `GITOPS_PR_TOKEN` and revalidated dry-run behavior.
- 2026-04-29: Committed Phase 5 GitOps PR automation as `9a768db PYXIS-PRODUCTION-ARGOCD-GLAZED: add gitops pr automation`.
- 2026-04-29: Uploaded v6 reMarkable bundle after Phase 5 GitOps PR automation.
