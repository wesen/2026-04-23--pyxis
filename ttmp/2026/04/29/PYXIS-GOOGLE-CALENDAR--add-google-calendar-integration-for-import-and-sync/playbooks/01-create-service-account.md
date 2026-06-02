---
DocType: playbook
Ticket: PYXIS-GOOGLE-CALENDAR
Title: Create Google Cloud Service Account & Credentials
Status: active
Intent: how-to
Topics:
  - google-calendar
  - infrastructure
  - operations
LastUpdated: 2026-05-04
---

# Playbook: Create Google Cloud Service Account & Credentials for Google Calendar Integration

**Purpose:** Step-by-step guide to set up a Google Cloud service account, enable the Calendar API, download credentials, and share the venue's calendar. This is a one-time setup performed by an admin.

**Resulting config values:**

| Variable | Example |
|----------|---------|
| `PYXIS_GOOGLE_CAL_ENABLED` | `true` |
| `PYXIS_GOOGLE_CAL_ID` | `ppxis.space@gmail.com` |
| `PYXIS_GOOGLE_CAL_CREDENTIALS_FILE` | `data/gcal/credentials.json` |

**Service account email:** `pyxis-calendar-sync@pyxis-495321.iam.gserviceaccount.com`

---

## Prerequisites

- A Google account that owns the venue's Google Calendar (e.g., `ppxis.space@gmail.com`)
- Access to Google Cloud Console (https://console.cloud.google.com/)
- The `pyxis` project already exists (`pyxis-495321`, project number `9319984903`)

## Reference

- Design doc: Section 6 (Authentication), Section 17 (Service Account Setup Walkthrough)
- Google Calendar API docs: `sources/google-calendar-api-reference.md`

---

## Step 1: Enable the Google Calendar API

1. Go to **API Library**: https://console.cloud.google.com/apis/library?project=pyxis-495321
2. Search for **"Google Calendar API"** (or find it under **Google Workspace** section)
3. Click on **Google Calendar API**
4. Click **Enable**
5. Wait for the redirect to the API metrics page — this confirms it's enabled

**Verify:** Navigate to https://console.cloud.google.com/apis/api/calendar-json.googleapis.com/metrics?project=pyxis-495321 — you should see the API dashboard, not a 404.

---

## Step 2: Create the Service Account

1. Go to **IAM & Admin → Service Accounts**: https://console.cloud.google.com/iam-admin/serviceaccounts?project=pyxis-495321
2. Click **+ Create service account**
3. **Step 1 — Service account details:**
   - **Name:** `pyxis-calendar-sync`
   - **Description:** `Pyxis show calendar sync - creates and updates Google Calendar events for venue shows`
   - Click **Create and continue**
4. **Step 2 — Permissions (optional):** Skip — no project-level IAM roles needed. Click **Continue**
5. **Step 3 — Principals with access (optional):** Skip — no one needs to impersonate this account. Click **Done**

**Verify:** The service accounts list should show `pyxis-calendar-sync@pyxis-495321.iam.gserviceaccount.com` with status **Enabled**.

---

## Step 3: Create a JSON Key

1. Click on the service account email `pyxis-calendar-sync@pyxis-495321.iam.gserviceaccount.com` in the list
2. Go to the **Keys** tab
3. Click **Add key → Create new key**
4. Select **JSON** (recommended) — it should be selected by default
5. Click **Create**
6. A JSON file downloads automatically (e.g., `pyxis-495321-4aae1c4e6558.json`)

**Store the credentials securely:**

```bash
# Move to the project's data directory (gitignored)
mkdir -p data/gcal
mv ~/Downloads/pyxis-495321-*.json data/gcal/credentials.json
chmod 600 data/gcal/credentials.json
```

**⚠️ IMPORTANT:** This file contains a private key. Never commit it to git. The path `data/gcal/` is in `.gitignore`.

**Verify the file:**

```bash
cat data/gcal/credentials.json | python3 -c "
import json, sys
d = json.load(sys.stdin)
print('type:', d.get('type'))
print('client_email:', d.get('client_email'))
print('project_id:', d.get('project_id'))
print('private_key present:', 'private_key' in d)
"
```

Expected output:
```
type: service_account
client_email: pyxis-calendar-sync@pyxis-495321.iam.gserviceaccount.com
project_id: pyxis-495321
private_key present: True
```

---

## Step 4: Share the Venue's Google Calendar with the Service Account

This grants the service account read/write access to the venue's calendar.

1. Open **Google Calendar**: https://calendar.google.com/
2. In the left sidebar, find the venue's calendar (e.g., `ppxis.space@gmail.com`)
3. Hover over it → click the **three dots (⋮)** → **Settings and sharing**
4. Scroll down to **Share with specific people or groups**
5. Click **Add people and groups**
6. Paste the service account email:
   ```
   pyxis-calendar-sync@pyxis-495321.iam.gserviceaccount.com
   ```
7. Set permissions to **Make changes to events** (needed for create/update/delete)
8. Click **Send** (Google may send a notification email — that's fine, no one reads it)

**Get the Calendar ID** (needed for config):

1. In the same **Settings** page, scroll down to **Integrate calendar**
2. Copy the **Calendar ID** (looks like an email address, e.g., `ppxis.space@gmail.com`)
3. This is the value for `PYXIS_GOOGLE_CAL_ID`

---

## Step 5: (Optional) Share External Calendars for Import

For each external calendar you want to import events from:

1. Ask the calendar owner to share their calendar with the service account email
2. They only need **See all event details** (read-only) permission
3. Get their **Calendar ID** (same steps as above)
4. Add it to the external calendars config (JSON array)

Example config for `PYXIS_GOOGLE_CAL_EXTERNAL`:
```json
[
  {"id": "neighbor-venue@group.calendar.google.com", "name": "The Parlour", "enabled": true},
  {"id": "providence-arts@gmail.com", "name": "Providence Arts Council", "enabled": true}
]
```

---

## Step 6: Configure Local Development

Add to `.envrc` (or export directly):

```bash
# Google Calendar integration
export PYXIS_GOOGLE_CAL_ENABLED=true
export PYXIS_GOOGLE_CAL_ID="ppxis.space@gmail.com"
export PYXIS_GOOGLE_CAL_CREDENTIALS_FILE="data/gcal/credentials.json"
```

Or pass as CLI flags:

```bash
pyxis serve \
  --google-cal-enabled \
  --google-cal-id "ppxis.space@gmail.com" \
  --google-cal-credentials-file "data/gcal/credentials.json"
```

---

## Step 7: Verify Authentication

Run a quick test with `curl` to verify the service account can access the calendar:

```bash
# Install gcloud CLI if not already installed
# https://cloud.google.com/sdk/docs/install

# Authenticate using the service account
gcloud auth activate-service-account \
  --key-file=data/gcal/credentials.json

# Test: list events from the venue calendar (should return JSON with an "items" array)
curl -s -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://www.googleapis.com/calendar/v3/calendars/ppxis.space@gmail.com/events?maxResults=1" \
  | python3 -m json.tool
```

**Expected:** A JSON response with `"items": [...]` (may be empty if no events exist).

**Common errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| `403: Calendar not found` | Calendar not shared with service account | Re-do Step 4 |
| `401: Invalid Credentials` | Key file is corrupt or wrong format | Re-download the key (Step 3) |
| `404: Calendar ID invalid` | Wrong calendar ID | Check the ID in Calendar Settings → Integrate calendar |

---

## Step 8: Configure Production (Kubernetes)

Store the credentials as a Kubernetes secret:

```bash
kubectl create secret generic pyxis-gcal-credentials \
  --from-file=credentials.json=data/gcal/credentials.json \
  -n pyxis
```

Set env vars in the deployment:

```yaml
env:
  - name: PYXIS_GOOGLE_CAL_ENABLED
    value: "true"
  - name: PYXIS_GOOGLE_CAL_ID
    value: "ppxis.space@gmail.com"
  - name: PYXIS_GOOGLE_CAL_CREDENTIALS_FILE
    value: "/secrets/gcal/credentials.json"
volumeMounts:
  - name: gcal-credentials
    mountPath: /secrets/gcal
    readOnly: true
volumes:
  - name: gcal-credentials
    secret:
      secretName: pyxis-gcal-credentials
```

---

## Troubleshooting

### Service account key was compromised

1. Go to **IAM & Admin → Service Accounts → pyxis-calendar-sync → Keys**
2. Delete the compromised key
3. Create a new key (repeat Step 3)
4. Update the credentials file in `data/gcal/credentials.json` and the Kubernetes secret

### Need to rotate keys

Same as above — create a new key, update config, delete the old key.

### Calendar was unshared

If someone removes the service account from the calendar's sharing, API calls will return 403. Re-do Step 4.

### "Google Calendar integration enabled but no client created"

This means the credentials file is missing or empty. Check:
- `PYXIS_GOOGLE_CAL_CREDENTIALS_FILE` points to a valid file
- The file contains valid JSON with `type: "service_account"`
- `PYXIS_GOOGLE_CAL_ID` is not empty

---

## Rollback

To completely remove the Google Calendar integration from Google Cloud:

1. Go to **IAM & Admin → Service Accounts**
2. Select `pyxis-calendar-sync` → click **Delete**
3. Go to **APIs & Services → Enabled APIs**
4. Find **Google Calendar API** → click **Disable**

To disable in Pyxis without removing the Google Cloud setup:

```bash
# Just turn off the flag
export PYXIS_GOOGLE_CAL_ENABLED=false
```
