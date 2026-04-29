---

Title: Pyxis production deployment diary
Ticket: PYXIS-PRODUCTION-ARGOCD-GLAZED
DocType: diary
Type: diary
Status: active
Topics:
  - pyxis
  - glazed
  - production
  - release-readiness
  - backend
Summary: Chronological notes for turning Pyxis into a production Glazed app deployed through the Hetzner k3s Argo CD GitOps repo.
---

# Pyxis production deployment diary

## Step 1: Created ticket and bounded the request

Created `PYXIS-PRODUCTION-ARGOCD-GLAZED` to plan the productionization of Pyxis as a real Glazed/Go application, packaged similarly to `/home/manuel/code/wesen/corporate-headquarters/discord-bot` and deployed through the Argo CD GitOps repository at `/home/manuel/code/wesen/2026-03-27--hetzner-k3s`.

The requested deliverable is documentation-first: a detailed analysis/design/implementation guide for a new intern, plus focused playbooks/docs in the ticket, then upload to reMarkable.

## Step 2: Collected reference surfaces

Inventoried the Pyxis repository, the `discord-bot` packaging/CI reference, and the k3s GitOps reference manifests/playbooks. Evidence was saved to:

```text
sources/01-deployment-reference-inventory.txt
```

Important references read:

- Pyxis `Makefile`, `cmd/pyxis/main.go`, `cmd/pyxis/cmds/serve.go`, `pkg/config/config.go`, `pkg/server/server.go`, `internal/web/static.go`, `docker-compose.yml`.
- `discord-bot` `Makefile`, `Dockerfile`, `.github/workflows/push.yml`, `.github/workflows/release.yaml`, `.github/workflows/lint.yml`, `.github/workflows/dependency-scanning.yml`, `.github/workflows/codeql-analysis.yml`, `.goreleaser.yaml`.
- k3s docs `app-packaging-and-gitops-pr-standard.md`, `public-repo-ghcr-argocd-deployment-playbook.md`, `vault-backed-postgres-bootstrap-job-pattern.md`.
- k3s reference app manifests for `hair-booking`, especially DB bootstrap, VaultStaticSecret, deployment, PVC, service, and ingress.

## Step 3: Wrote implementation guide and playbooks

Prepared the main intern-oriented guide under `design/01-pyxis-production-glazed-argocd-implementation-guide.md` and focused operational playbooks under `playbooks/`. The guide treats Pyxis as a single Go binary that embeds the public Vite site, serves staff/public APIs, uses PostgreSQL, writes flyer files to a PVC, authenticates staff through Discord OAuth, and optionally runs the embedded Discord bot.

## Step 4: Validation/publication

Ran `docmgr doctor --ticket PYXIS-PRODUCTION-ARGOCD-GLAZED --stale-after 30` and uploaded the documentation bundle to reMarkable after a dry-run.

## Step 5: Uploaded to reMarkable

Ran a dry-run first, then uploaded the bundle:

```bash
remarquee upload bundle --dry-run <guide-and-playbooks> --name "PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks" --remote-dir "/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED" --toc-depth 2
remarquee upload bundle <guide-and-playbooks> --name "PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks" --remote-dir "/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED" --toc-depth 2
```

Upload result:

```text
/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED/PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks
```
