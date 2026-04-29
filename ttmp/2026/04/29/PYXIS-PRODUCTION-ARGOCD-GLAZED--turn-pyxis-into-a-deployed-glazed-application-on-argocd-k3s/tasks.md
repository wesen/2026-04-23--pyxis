---

Ticket: PYXIS-PRODUCTION-ARGOCD-GLAZED
Title: Turn Pyxis into a deployed Glazed application on ArgoCD k3s
Status: active
Topics:
  - pyxis
  - glazed
  - production
  - release-readiness
  - backend
---

# Tasks

## Phase 1 — Research and documentation

- [x] T1. Create docmgr ticket workspace.
- [x] T2. Inventory current Pyxis build/runtime surfaces and comparable reference apps.
- [x] T3. Read the corporate-headquarters/discord-bot Makefile, Dockerfile, GoReleaser, and CI workflows.
- [x] T4. Read the Hetzner k3s GitOps playbooks and reference manifests for hair-booking/public app deployment.
- [x] T5. Write a detailed intern-oriented production deployment analysis/design/implementation guide.
- [x] T6. Add focused playbooks/docs inside the ticket for implementation operators.

## Phase 2 — Implementation backlog for follow-up

- [ ] T7. Add/adjust Pyxis Dockerfile for single-binary embedded public site and runtime data volume.
- [ ] T8. Expand Pyxis Makefile with CI, image, release, and deployment helper targets.
- [ ] T9. Add GitHub Actions for tests/builds/web validation/image publish/security scans.
- [ ] T10. Add GoReleaser configuration if Pyxis should publish CLI artifacts in addition to container images.
- [ ] T11. Add deploy metadata and optional script for CI-created GitOps PRs.
- [ ] T12. Add GitOps kustomize package under `../2026-03-27--hetzner-k3s/gitops/kustomize/pyxis`.
- [ ] T13. Add Argo CD Application manifest under `../2026-03-27--hetzner-k3s/gitops/applications/pyxis.yaml`.
- [ ] T14. Add Vault/VSO runtime secret contract for DB, session, Discord OAuth, Discord bot, and image pull credentials.
- [ ] T15. Add in-cluster PostgreSQL bootstrap job for the Pyxis database/user.
- [ ] T16. Add deployment, service, ingress, PVC, service account, probes, and resource limits.
- [ ] T17. Define migration execution strategy for production startup or deploy hook.
- [ ] T18. Run local image build and embedded-site smoke.
- [ ] T19. Run `kubectl kustomize`/server-side dry-run against the GitOps package.
- [ ] T20. Open/merge GitOps PR and bootstrap the Argo CD Application.
- [ ] T21. Validate production URL, public pages, staff auth, Discord guild role mapping, flyer upload storage, and ShowLog save.

## Phase 3 — Publication

- [x] T22. Run docmgr validation.
- [x] T23. Upload the documentation bundle to reMarkable.
