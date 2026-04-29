---

Title: Pyxis Argo CD GitOps playbook
Ticket: PYXIS-PRODUCTION-ARGOCD-GLAZED
DocType: playbook
Type: playbook
Status: draft
Topics:
  - pyxis
  - glazed
  - production
  - release-readiness
  - backend
Summary: Operator checklist for adding Pyxis to the Hetzner k3s GitOps repository and bootstrapping it into Argo CD.
---

# Pyxis Argo CD GitOps playbook

## Goal

Deploy Pyxis through `/home/manuel/code/wesen/2026-03-27--hetzner-k3s` using the same pattern as `hair-booking`:

```text
gitops/applications/pyxis.yaml
gitops/kustomize/pyxis/*.yaml
```

## Files to create in the k3s repo

```text
gitops/applications/pyxis.yaml
gitops/kustomize/pyxis/namespace.yaml
gitops/kustomize/pyxis/serviceaccount.yaml
gitops/kustomize/pyxis/db-bootstrap-serviceaccount.yaml
gitops/kustomize/pyxis/vault-connection.yaml
gitops/kustomize/pyxis/vault-auth.yaml
gitops/kustomize/pyxis/db-bootstrap-vault-auth.yaml
gitops/kustomize/pyxis/runtime-secret.yaml
gitops/kustomize/pyxis/postgres-admin-secret.yaml
gitops/kustomize/pyxis/db-bootstrap-script-configmap.yaml
gitops/kustomize/pyxis/db-bootstrap-job.yaml
gitops/kustomize/pyxis/persistentvolumeclaim.yaml
gitops/kustomize/pyxis/deployment.yaml
gitops/kustomize/pyxis/service.yaml
gitops/kustomize/pyxis/ingress.yaml
gitops/kustomize/pyxis/kustomization.yaml
```

Add `image-pull-secret.yaml` only if the GHCR package is private.

## Vault paths

Recommended Vault paths:

```text
kv/apps/pyxis/prod/runtime
kv/infra/postgres/cluster
```

Runtime keys:

```text
dsn
database
username
password
website_url
discord_client_id
discord_client_secret
discord_redirect_url
discord_bot_token
discord_guild_id
discord_admin_role_id
discord_booker_role_id
discord_door_role_id
```

## Sync waves

Use predictable sync waves:

```text
-2: namespace, service accounts, VaultAuth
-1: VaultStaticSecret resources
 0: DB bootstrap ConfigMap
 1: DB bootstrap Job and migration Job
 2: PVC, Deployment, Service
 3: Ingress
```

## Kustomize validation

Before opening a PR:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
kubectl kustomize gitops/kustomize/pyxis
kubectl apply --dry-run=server -k gitops/kustomize/pyxis
```

If server-side dry-run fails because CRDs are unavailable from your kubeconfig context, at least keep the local `kubectl kustomize` output clean and ask an operator to validate against the cluster.

## First Argo bootstrap

After the GitOps PR lands, create the Argo Application object once:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
export KUBECONFIG=$PWD/.cache/kubeconfig-tailnet.yaml
kubectl apply -f gitops/applications/pyxis.yaml
kubectl -n argocd annotate application pyxis argocd.argoproj.io/refresh=hard --overwrite
```

Then watch:

```bash
kubectl -n argocd get application pyxis
kubectl -n pyxis get pods,svc,ingress,pvc,secrets
kubectl -n pyxis logs deploy/pyxis
```

## HTTP smoke

```bash
curl -i https://pyxis.yolo.scapegoat.dev/health
curl -i https://pyxis.yolo.scapegoat.dev/api/public/settings
curl -i https://pyxis.yolo.scapegoat.dev/api/public/shows
```

## Staff auth smoke

Only run after the Discord bot is installed in the configured guild:

```text
https://pyxis.yolo.scapegoat.dev/auth/discord/login
```

Expected:

- Discord redirects back to `/auth/discord/callback`.
- Session cookie is set.
- `/api/app/session` returns the staff user.
- Staff role matches Discord role mapping.

## Rollback

Rollback is a GitOps operation. Revert the image tag in:

```text
gitops/kustomize/pyxis/deployment.yaml
```

Then let Argo sync. Avoid manually editing the live Deployment unless this is an emergency and you immediately reconcile Git afterward.
