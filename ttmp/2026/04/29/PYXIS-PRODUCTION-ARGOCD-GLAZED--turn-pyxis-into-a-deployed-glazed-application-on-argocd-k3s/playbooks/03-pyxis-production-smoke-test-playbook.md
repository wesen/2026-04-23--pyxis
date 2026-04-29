---

Title: Pyxis production smoke test playbook
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
Summary: Post-deploy smoke checklist for validating Pyxis after Argo CD rolls it out.
---

# Pyxis production smoke test playbook

## Goal

After Argo CD deploys Pyxis, prove that the production system is actually usable, not merely that a pod is running.

## Cluster checks

```bash
kubectl -n argocd get application pyxis
kubectl -n pyxis get pods -o wide
kubectl -n pyxis get deploy,svc,ingress,pvc,secrets
kubectl -n pyxis describe deploy pyxis
kubectl -n pyxis logs deploy/pyxis --tail=200
```

Look for:

- pod is `Running` and ready;
- Deployment has desired replicas available;
- Service has endpoint;
- Ingress has expected host;
- PVC is bound;
- `pyxis-runtime` secret exists from Vault Secrets Operator.

## Health and public API

```bash
curl -i https://pyxis.yolo.scapegoat.dev/health
curl -s https://pyxis.yolo.scapegoat.dev/api/public/settings | jq .
curl -s https://pyxis.yolo.scapegoat.dev/api/public/shows | jq .
curl -s https://pyxis.yolo.scapegoat.dev/api/public/archive | jq .
```

Expected:

- `/health` returns HTTP 200.
- public settings returns JSON.
- public shows returns JSON.
- archive returns JSON, even if initially empty.

## Public browser checks

Open:

```text
https://pyxis.yolo.scapegoat.dev/
https://pyxis.yolo.scapegoat.dev/shows
https://pyxis.yolo.scapegoat.dev/archive
https://pyxis.yolo.scapegoat.dev/book
```

Expected:

- no 502/503 from Traefik;
- SPA browser routes return HTML, not 404;
- API routes return JSON, not the SPA HTML fallback;
- booking form can submit a test booking if production test data is allowed.

## Staff auth checks

Precondition: Discord bot is installed in the configured guild and role mapping is configured.

Open:

```text
https://pyxis.yolo.scapegoat.dev/auth/discord/login
```

Expected:

- Discord prompts or redirects;
- callback returns to Pyxis;
- session cookie is set;
- `/api/app/session` returns user/role;
- staff routes load.

CLI check after browser login is easier with browser devtools, but the endpoint is:

```text
https://pyxis.yolo.scapegoat.dev/api/app/session
```

## Staff functional checks

In the staff app:

- Shows page loads.
- Booking queue loads.
- Calendar loads.
- Artists page loads.
- Post-show log loads at `/show-log`.
- Old `/attendance` route is not relied upon.
- ShowLog modal saves draw, quick highlight, total door, notes, and incident details.
- Settings and Discord pages load for admin.

## Flyer storage check

Upload a flyer through a staff show detail page. Then verify:

```bash
kubectl -n pyxis exec deploy/pyxis -- find /data/flyers -maxdepth 3 -type f | head
```

Then open the emitted flyer URL from the API, usually under:

```text
https://pyxis.yolo.scapegoat.dev/flyers/...
```

Expected:

- file exists on mounted PVC;
- browser can load the flyer;
- restarting the pod does not delete it.

## Database check

If psql access is available:

```bash
kubectl -n postgres exec -it statefulset/postgres -- psql -U <admin> -d pyxis -c '\dt'
```

Expected:

- Pyxis tables exist;
- latest migrations are applied;
- `show_logs` exists rather than legacy staff `attendance_logs` if the hard cutover migration has run.

## Failure triage

- 502/503: check pod readiness, Service selectors, and container port.
- HTML returned for `/api/*`: check SPA fallback reserved prefixes.
- OAuth failure: check Discord redirect URL, bot guild membership, role IDs, and secrets.
- DB connection failure: check `pyxis-runtime` secret, DB bootstrap job, and network DNS.
- flyer missing after restart: check PVC mount path and Pyxis flyer storage config.
