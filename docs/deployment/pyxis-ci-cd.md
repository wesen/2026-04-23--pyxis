# Pyxis CI/CD contract

This document describes the GitHub-side production pipeline for Pyxis.

## Workflows

- `.github/workflows/push.yml`: PR/main validation for generated code, Go tests, web checks, and embedded binary build.
- `.github/workflows/publish-image.yml`: Docker Buildx image build on PRs and GHCR publish on pushes to `main`.
- `.github/workflows/lint.yml`: golangci-lint for Go packages.
- `.github/workflows/dependency-scanning.yml`: dependency review, govulncheck, and gosec.
- `.github/workflows/codeql-analysis.yml`: CodeQL Go analysis.

## Image tags

The publish workflow emits GHCR tags using `docker/metadata-action`:

- `sha-<git-sha>` for immutable deployments;
- branch/ref tags for convenience.

The GitOps repo should pin the `sha-<git-sha>` tag.

## Required GitHub permissions/secrets

The image workflow uses the built-in `GITHUB_TOKEN` with:

```yaml
permissions:
  contents: read
  packages: write
```

No extra secret is required for GHCR publishing when package permissions are correctly linked to the repository.

Future GitOps PR automation will require:

```text
GITOPS_PR_TOKEN
```

That token is intentionally not used yet in Phase 3; it belongs to Phase 5.

## Optional release artifacts

`.goreleaser.yaml` can publish CLI artifacts for the Glazed `pyxis` command. The snapshot validation command is:

```bash
goreleaser check
goreleaser release --skip=sign --snapshot --clean --single-target
```

Full signed releases will require the same kind of release secrets used by other go-go-golems projects if/when Pyxis is published as an installable CLI.

## GitOps PR automation

`publish-image.yml` also performs the app-to-GitOps handoff on pushes to `main`.

After the GHCR image is pushed, the workflow computes the immutable image reference:

```text
ghcr.io/${{ github.repository_owner }}/pyxis:sha-${{ github.sha }}
```

It then runs:

```bash
python3 scripts/open_gitops_pr.py --image "${IMAGE}"
```

The target metadata lives in:

```text
deploy/gitops-targets.json
```

Current targets:

- `pyxis-prod-app` updates `gitops/kustomize/pyxis/deployment.yaml` container `pyxis`.
- `pyxis-prod-migrate` updates `gitops/kustomize/pyxis/migration-job.yaml` container `migrate`.

The workflow requires repository secret `GITOPS_PR_TOKEN`. The token must be able to push branches to `wesen/2026-03-27--hetzner-k3s` and open pull requests against that repository. The workflow intentionally fails if the secret is missing, because a published image without a GitOps handoff is an incomplete production release.

Local validation example:

```bash
python3 scripts/open_gitops_pr.py \
  --image ghcr.io/wesen/pyxis:sha-testphase5 \
  --gitops-root /home/manuel/code/wesen/2026-03-27--hetzner-k3s \
  --dry-run
```

Dry-run mode prints the manifest diffs and restores the checked-out GitOps files before exiting.
