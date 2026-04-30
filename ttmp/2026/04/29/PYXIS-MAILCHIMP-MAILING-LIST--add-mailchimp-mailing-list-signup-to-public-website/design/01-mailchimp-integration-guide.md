---
doc_type: design
title: "Mailchimp Mailing List Integration — Full Analysis & Implementation Guide"
ticket: PYXIS-MAILCHIMP-MAILING-LIST
topics: [mailchimp, frontend, backend, public-site, api-design, go]
status: draft
audience: intern
---

# Mailchimp Mailing List Integration — Full Analysis & Implementation Guide

**Ticket:** PYXIS-MAILCHIMP-MAILING-LIST
**Date:** 2026-04-29
**Audience:** A new intern joining the team — this document explains every part of the system you need to understand.

---

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [What Is Pyxis? — The App You're Working On](#2-what-is-pyxis--the-app-youre-working-on)
3. [What Is Mailchimp? — The Mailing List Service](#3-what-is-mailchimp--the-mailing-list-service)
4. [How Mailchimp Integration Works — Three Approaches](#4-how-mailchimp-integration-works--three-approaches)
5. [Recommended Approach: Server-Side API Proxy](#5-recommended-approach-server-side-api-proxy)
6. [Architecture Diagram](#6-architecture-diagram)
7. [Backend Implementation — Go API Endpoint](#7-backend-implementation--go-api-endpoint)
8. [Frontend Implementation — React Signup Component](#8-frontend-implementation--react-signup-component)
9. [Configuration & Environment Variables](#9-configuration--environment-variables)
10. [Database & Settings Considerations](#10-database--settings-considerations)
11. [Testing Strategy](#11-testing-strategy)
12. [Security Considerations](#12-security-considerations)
13. [Step-by-Step Implementation Checklist](#13-step-by-step-implementation-checklist)
14. [Appendix: Mailchimp API Reference](#14-appendix-mailchimp-api-reference)
15. [Appendix: Mailchimp Embedded Form Deep Dive](#15-appendix-mailchimp-embedded-form-deep-dive)

---

## 1. What Is This Project?

The goal is simple: **add a "Join our mailing list" form to the Pyxis public website so visitors can subscribe with their email address, and those emails are automatically added to the venue's Mailchimp audience.**

The venue already has a Mailchimp account configured with an audience (mailing list). We need to wire the website up to it. When someone types their email into the form and clicks "Subscribe," the email should appear in the Mailchimp audience — no manual copy-pasting.

This sounds trivial, but there are several design decisions to make:

- **Where does the form submit?** Directly to Mailchimp's servers, or through our own backend first?
- **How do we authenticate with Mailchimp?** With an API key, or via the form action URL?
- **What happens if the API is down?** Do we show an error, or silently fail?
- **What data do we collect?** Just email? First name too?

This document answers all of these questions and gives you the exact code to write.

---

## 2. What Is Pyxis? — The App You're Working On

### 2.1 The Big Picture

Pyxis is a **show management platform for a music venue** (a physical space called "ppxis" in Providence, RI). Think of it as the venue's operating system:

- **Staff** (bookers, admins, door people) use a **staff app** (the "app" at `/api/app/...`) to manage shows, artists, bookings, calendars, and post-show reports.
- **The public** (fans, concert-goers) visit a **public website** (the "user site") to see upcoming shows, browse the archive, and submit booking requests.
- A **Discord bot** lets staff do quick actions from Discord without opening the app.

### 2.2 The Tech Stack

Pyxis is a **monorepo** with these parts:

| Part | Technology | Location | Purpose |
|------|-----------|----------|---------|
| Backend API | Go 1.22+ (`net/http`) | `pkg/server/`, `pkg/service/`, `pkg/repository/` | REST-ish JSON API, serves both public and staff routes |
| Database | PostgreSQL | `pkg/db/` (sqlc-generated queries) | All persistent data: shows, artists, bookings, settings |
| Public website | React + Vite + TypeScript | `web/packages/pyxis-user-site/` | The fan-facing website (shows, archive, about, book) |
| Staff app | React + Vite + TypeScript | `web/packages/pyxis-app/` | Internal management dashboard |
| Shared components | React | `web/packages/pyxis-components/` | Reusable UI components (buttons, cards, layouts) |
| Shared types | TypeScript | `web/packages/pyxis-types/` | Shared type definitions |
| Protobuf schemas | Protocol Buffers | `proto/`, `gen/proto/` | API request/response definitions |
| Discord bot | JavaScript | `bot/`, `pkg/discordbot/` | Discord slash commands for staff |
| Deployment | Docker + ArgoCD + k3s | `deploy/`, `Dockerfile` | Production deployment on Kubernetes |

### 2.3 How the Backend Is Structured

The Go backend follows a clean layered architecture. Understanding this is crucial because we'll be adding a new endpoint:

```
pkg/
├── config/           # Configuration (env vars, flags)
│   └── config.go     # ← We'll add Mailchimp fields here
├── domain/           # Business entities (pure Go structs)
│   ├── show.go
│   ├── settings.go   # ← Venue settings (already has contact email, etc.)
│   └── ...
├── repository/       # Database access layer
│   └── postgres/     # PostgreSQL implementations
├── service/          # Business logic layer
│   ├── show_service.go
│   └── ...
├── server/           # HTTP handlers + routing
│   ├── server.go     # ← Main router (where we add the new route)
│   ├── public.go     # ← Public API handlers (no auth required)
│   └── app.go        # ← Staff API handlers (auth required)
└── db/               # sqlc-generated database queries
```

**Key files for this feature:**

- `pkg/config/config.go` — where we read `MAILCHIMP_API_KEY`, `MAILCHIMP_LIST_ID`, etc.
- `pkg/server/server.go` — where routes are registered (we add `POST /api/public/subscribe`)
- `pkg/server/public.go` — where public handlers live (we add the subscribe handler)

### 2.4 How the Frontend Is Structured

The public website is a React SPA (Single Page Application):

```
web/packages/pyxis-user-site/src/
├── App.tsx              # ← Router setup (React Router)
├── main.tsx             # Entry point
├── api/
│   ├── types.ts         # Type re-exports
│   ├── hooks.ts         # React Query hooks for API calls
│   └── errors.ts        # Error handling
├── pages/
│   ├── ShowsPage/       # Homepage — upcoming shows list
│   ├── ShowDetailPage/  # Individual show detail
│   ├── ArchivePage/     # Past shows archive
│   ├── BookPage/        # Booking request form
│   ├── AboutPage/       # About the venue ← mailing list signup goes here
│   └── ...
├── components/
│   └── layout/
│       └── Layout.tsx   # Shell: nav + outlet + footer
└── pages/PublicPage.css # Shared page styles
```

The site uses **React Router** with lazy-loaded pages. The `Layout` component wraps all pages with a `PubNav` (navigation bar), the page content via `<Outlet />`, and a `PubFooter` at the bottom.

**Key insight:** We'll add a new `MailingListSignup` component (in `pyxis-components`) and place it on the About page and/or in the footer.

### 2.5 How API Calls Work

The frontend talks to the backend via `fetch()` calls wrapped in **React Query** hooks:

1. A page component calls a hook like `usePublicSettings()`
2. The hook calls `fetch('/api/public/settings')`
3. The Go backend handles the request in `pkg/server/public.go`
4. The handler calls a service method, which calls a repository method, which queries PostgreSQL
5. The response is serialized as protobuf JSON (`protojson.Marshal`)

For Mailchimp, the flow is simpler — we don't need to store anything in our own database. We just forward the email to Mailchimp's API.

---
## 3. What Is Mailchimp? — The Mailing List Service

### 3.1 The Elevator Pitch

Mailchimp is an **email marketing platform**. You create an "audience" (a mailing list), and Mailchimp lets you:

- Collect email addresses from people who want to hear from you
- Design and send email campaigns (newsletters, announcements)
- Automate emails (welcome emails, event reminders)
- Track opens, clicks, and unsubscribes

Think of it as a specialized database for email contacts with built-in tools for sending them emails. It's free for up to 500 contacts and 1,000 emails per month.

### 3.2 Key Mailchimp Concepts You Need to Know

- **Audience (formerly "List")**: A collection of contacts. Each Mailchimp account has at least one audience. In our case, the venue has one audience for all fans/subscribers.

- **Audience ID (List ID)**: A unique identifier like `ab2c468d10`. You can find it in Mailchimp under Audience → Settings → Audience name and defaults. We need this to tell the API which list to add subscribers to.

- **API Key**: A secret token like `a123cd45678ef90g7h1j7k9lm-us12`. The last part after the dash (`us12`) is the **server prefix** — it tells you which Mailchimp data center your account lives on. You generate API keys at Profile → Extras → API Keys.

- **Merge Fields**: Custom fields on a subscriber, like `FNAME` (first name), `LNAME` (last name). These are defined in the audience settings and referenced by their tag name.

- **Tags**: Labels you can apply to subscribers to segment them. For example, you could tag someone `website-signup` to know they came from the website vs. an in-person signup.

- **Member Status**: Each subscriber has a status:
  - `subscribed` — actively receiving emails
  - `pending` — confirmation email sent, waiting for them to confirm
  - `unsubscribed` — they opted out
  - `cleaned` — email bounced, removed from sending

### 3.3 Mailchimp's Server Locations (Data Centers)

Mailchimp runs on multiple servers. Your API key includes the server prefix (e.g., `us12`). All API requests go to:

```
https://<server-prefix>.api.mailchimp.com/3.0/
```

For example, if your key ends in `-us12`, your base URL is:

```
https://us12.api.mailchimp.com/3.0/
```

This is not a choice — it's baked into your API key. The Go code needs to extract the server prefix from the API key.

---

## 4. How Mailchimp Integration Works — Three Approaches

There are **three main ways** to connect a website to Mailchimp. Understanding all three helps you understand why we recommend one over the others.

### Approach A: Mailchimp Embedded Form (JavaScript Widget)

**How it works:** Mailchimp gives you a block of HTML/JavaScript that you paste into your website. The form submits directly to Mailchimp's servers.

**What the code looks like:**

```html
<!-- Begin Mailchimp Signup Form -->
<div id="mc_embed_signup">
  <form action="https://kojilabs.us4.list-manage.com/subscribe/post?u=f8cbddda8612357bfc16b352d&id=b5f20267d6"
        method="POST" id="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>

    <div class="mc-field-group">
      <label for="mce-EMAIL">Email Address</label>
      <input type="email" name="EMAIL" class="required email" id="mce-EMAIL">
    </div>

    <!-- Bot honeypot — hidden field that bots fill in -->
    <div style="position: absolute; left: -5000px;">
      <input type="text" name="b_f8cbddda8612357bfc16b352d_b5f20267d6" tabindex="-1" value="">
    </div>

    <input type="submit" value="Subscribe" name="subscribe">
  </form>
</div>
<script src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script>
```

**The hidden fields explained:**
- `u` — your Mailchimp user ID
- `id` — the audience/list ID
- `b_...` — a honeypot field (invisible to humans, bots fill it in and get rejected)

**Pros:**
- Zero backend code needed
- Mailchimp handles validation, duplicate detection, and confirmation emails
- Built-in bot protection via the honeypot field

**Cons:**
- **Exposes your user ID and list ID** in the HTML source (minor security concern)
- Loads a 140KB JavaScript validation library (`mc-validate.js` which includes jQuery!)
- Limited control over the UX (the form redirects or pops up in a new tab)
- Ugly default styling that fights with our design system
- No server-side logging or analytics on our side
- Can't easily add rate limiting or abuse protection

### Approach B: Mailchimp API (Server-Side)

**How it works:** Our Go backend makes an HTTP POST request to Mailchimp's REST API. The frontend sends the email to our API, and our API forwards it to Mailchimp.

**What the API call looks like:**

```
POST https://us12.api.mailchimp.com/3.0/lists/{list_id}/members
Authorization: Basic base64(anystring:API_KEY)
Content-Type: application/json

{
  "email_address": "fan@example.com",
  "status": "subscribed",
  "merge_fields": {
    "FNAME": "Jane"
  },
  "tags": ["website-signup"]
}
```

**Pros:**
- Full control over the frontend UX (our own React component, our own design)
- **API key stays secret** on the server — never exposed to the browser
- We can log subscriptions, add rate limiting, validate input server-side
- We can add tags automatically (`website-signup`, `about-page`, etc.)
- No extra JavaScript dependencies (no mc-validate.js, no jQuery)
- Consistent error handling with the rest of our API

**Cons:**
- Requires backend code (a new API endpoint and Mailchimp client)
- If our server is down, subscriptions fail (but so does the rest of the site)
- We need to manage the API key as a secret

### Approach C: Hybrid (Custom Form + Direct POST)

**How it works:** You build your own form but submit directly to Mailchimp's form endpoint (the same URL that the embedded form uses). No API key needed.

**Pros:**
- No API key to manage
- Works even if our backend is slow

**Cons:**
- Exposes user/list IDs in the form action URL
- Can't add tags or merge fields beyond what the form supports
- No server-side validation or rate limiting
- Error handling is clunky (Mailchimp redirects to a confirmation page)
- CORS issues when submitting from a different domain

### Why Approach B (Server-Side API) Is Recommended

**Approach B is the clear winner for Pyxis.** Here's why:

1. **Security:** The API key never touches the browser. This is a hard requirement — never put API keys in frontend code.

2. **UX control:** We build a beautiful React component that matches our design system. The user sees a nice inline confirmation message, not a Mailchimp redirect page.

3. **Consistency:** Every other API call in Pyxis follows the same pattern (frontend → our API → data store). Adding Mailchimp as just another backend service keeps the architecture clean.

4. **Extensibility:** Later we might want to tag subscribers by source page (`about-page`, `footer`, `post-show`), or add the subscriber to an automation workflow. The API approach makes all of this trivial.

5. **No dependency bloat:** We avoid loading jQuery + mc-validate.js (140KB+) just for a single form.

---
## 5. Recommended Approach: Server-Side API Proxy

### 5.1 The Data Flow

Here's exactly what happens when a visitor subscribes:

```
Visitor types email          Our React App             Our Go Backend             Mailchimp API
     │                           │                          │                          │
     │  types "fan@test.com"     │                          │                          │
     │  clicks "Subscribe" ─────►│                          │                          │
     │                           │                          │                          │
     │                           │  POST /api/public/       │                          │
     │                           │  subscribe               │                          │
     │                           │  {email:"fan@test.com"} ──►│                        │
     │                           │                          │                          │
     │                           │                          │  validate email           │
     │                           │                          │  check rate limit         │
     │                           │                          │                          │
     │                           │                          │  POST /3.0/lists/        │
     │                           │                          │  {list_id}/members       │
     │                           │                          │  {email, status, tags} ───►│
     │                           │                          │                          │
     │                           │                          │          ◄────────────────│
     │                           │                          │  200 OK {id, email...}   │
     │                           │                          │                          │
     │                           │       ◄──────────────────│                          │
     │                           │  201 {success: true}     │                          │
     │                           │                          │                          │
     │     ◄────────────────────│                          │                          │
     │  Shows "Thanks!" msg     │                          │                          │
```

### 5.2 Why This Design

- **The frontend never sees the Mailchimp API key.** It only talks to our own API at `/api/public/subscribe`.
- **Our backend is the gatekeeper.** It validates the email, enforces rate limiting, and handles errors from Mailchimp (like "already subscribed" or "invalid email").
- **The response is uniform.** Whether Mailchimp returns success or error, our backend normalizes it into our standard error format (`ErrorResponse` protobuf), so the frontend handles it the same way as every other API error.

---

## 6. Architecture Diagram

Here's where the new pieces fit into the existing Pyxis architecture:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     pyxis-user-site (React SPA)                     │
│                                                                     │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐  │
│  │ ShowsPage│ │ AboutPage │ │ BookPage │ │ Archive │ │ Layout   │  │
│  │          │ │           │ │          │ │  Page   │ │ (footer) │  │
│  │          │ │ ┌───────┐ │ │          │ │         │ │ ┌──────┐ │  │
│  │          │ │ │MailL- │ │ │          │ │         │ │ │MailL-│ │  │
│  │          │ │ │istSig-│ │ │          │ │         │ │ │ist   │ │  │
│  │          │ │ │nup    │ │ │          │ │         │ │ │Signup │ │  │
│  │          │ │ └───────┘ │ │          │ │         │ │ └──────┘ │  │
│  └──────────┘ └───────────┘ └──────────┘ └─────────┘ └──────────┘  │
│        │             │                                   │          │
│        └─────────────┴───────────────────────────────────┘          │
│                              │                                      │
│                  fetch('/api/public/subscribe',                      │
│                        {method:'POST', body: ...})                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     Go Backend (pkg/server/)                         │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  server.go — HTTP Router (http.ServeMux)                     │   │
│  │                                                              │   │
│  │  POST /api/public/subscribe ──► handleSubscribe()            │   │
│  │  GET  /api/public/shows    ──► handleListPublicShows()       │   │
│  │  POST /api/public/submissions ──► handleCreateSubmission()   │   │
│  │  ...                                                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────┐                                             │
│  │  MailchimpClient    │  ◄── NEW: pkg/mailchimp/client.go          │
│  │                     │                                             │
│  │  - Subscribe(email) │                                             │
│  │  - uses API key     │                                             │
│  │  - uses list ID     │                                             │
│  └─────────┬───────────┘                                             │
│            │                                                         │
└────────────┼─────────────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     Mailchimp API (external)                         │
│                                                                      │
│  POST https://us12.api.mailchimp.com/3.0/lists/{id}/members         │
│  Auth: Basic base64(anystring:API_KEY)                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### New Files to Create

| File | Purpose |
|------|---------|
| `pkg/mailchimp/client.go` | Mailchimp API client — Subscribe method |
| `web/packages/pyxis-components/src/molecules/MailingListSignup/MailingListSignup.tsx` | React signup form component |
| `web/packages/pyxis-components/src/molecules/MailingListSignup/MailingListSignup.css` | Component styles |
| `web/packages/pyxis-components/src/molecules/MailingListSignup/index.ts` | Barrel export |
| `web/packages/pyxis-components/src/molecules/MailingListSignup/MailingListSignup.stories.tsx` | Storybook story |

### Existing Files to Modify

| File | Change |
|------|--------|
| `pkg/config/config.go` | Add `MailchimpAPIKey`, `MailchimpListID`, `MailchimpEnabled` fields |
| `pkg/server/server.go` | Create `MailchimpClient` and register `POST /api/public/subscribe` route |
| `pkg/server/public.go` | Add `handleSubscribe` handler |
| `web/packages/pyxis-user-site/src/api/hooks.ts` | Add `useSubscribe` React Query mutation hook |
| `web/packages/pyxis-user-site/src/pages/AboutPage/Page.tsx` | Add `<MailingListSignup />` component |
| `web/packages/pyxis-components/src/index.ts` | Export new component |

---
## 7. Backend Implementation — Go API Endpoint

This is the most important section. We'll build three things: a config extension, a Mailchimp API client, and a new HTTP handler.

### 7.1 Step 1: Add Configuration (`pkg/config/config.go`)

We need three new fields in the `Config` struct. These come from environment variables.

**What to add to the `Config` struct:**

```go
// In pkg/config/config.go — add these fields to the Config struct:

// Mailchimp configuration
MailchimpEnabled bool
MailchimpAPIKey  string   // Full API key like "a1b2c3d4e5f6g7h8i9j0-us12"
MailchimpListID  string   // Audience ID like "ab2c468d10"
```

**What to add to `DefaultConfig()`:**

```go
// These default to empty/off — must be configured in production
MailchimpEnabled: false,
```

**How the values are loaded:** The existing codebase uses `envconfig` or `direnv` with `.envrc`. Add to `.envrc`:

```bash
export PYXIS_MAILCHIMP_ENABLED=true
export PYXIS_MAILCHIMP_API_KEY="your-api-key-here"
export PYXIS_MAILCHIMP_LIST_ID="your-list-id-here"
```

### 7.2 Step 2: Create the Mailchimp Client (`pkg/mailchimp/client.go`)

This is a new package. It's a thin HTTP client that knows how to call Mailchimp's API.

**Design decisions:**
- We use Go's standard `net/http` client — no third-party Mailchimp SDK needed (the API is simple)
- We authenticate using HTTP Basic Auth with the API key as the password
- We extract the server prefix from the API key automatically
- We handle the "already subscribed" case gracefully (Mailchimp returns 400, we translate to a friendly message)

**Pseudocode for the client:**

```
package mailchimp

struct Client:
    apiKey: string
    listID: string
    baseURL: string    // derived from apiKey
    httpClient: http.Client

function NewClient(apiKey, listID) -> *Client:
    if apiKey is empty:
        return nil  // Mailchimp disabled
    
    // The server prefix is everything after the last "-"
    // e.g., "abc123-us12" → "us12"
    parts = apiKey.split("-")
    serverPrefix = parts[last]
    
    baseURL = "https://" + serverPrefix + ".api.mailchimp.com/3.0"
    
    return &Client{apiKey, listID, baseURL, default http.Client}

function (c *Client) Subscribe(email, firstName?) -> error:
    // Build the request URL
    url = c.baseURL + "/lists/" + c.listID + "/members"
    
    // Build the request body
    body = {
        "email_address": email,
        "status": "subscribed",    // or "pending" if you want double opt-in
        "tags": ["website-signup"]
    }
    if firstName is not empty:
        body["merge_fields"] = {"FNAME": firstName}
    
    // Make the HTTP request
    req = HTTP POST to url
    req.Header["Content-Type"] = "application/json"
    req.Header["Authorization"] = "Basic " + base64("anystring:" + c.apiKey)
    req.Body = JSON.Marshal(body)
    
    resp = c.httpClient.Do(req)
    defer resp.Body.Close()
    
    // Handle the response
    if resp.StatusCode == 200:
        return nil  // Success! Already subscribed (Mailchimp updates in place)
    
    if resp.StatusCode == 201:
        return nil  // Success! New subscriber added
    
    // Parse error response
    errResp = JSON.Decode(resp.Body)
    
    if errResp.Title == "Member Exists":
        // This is actually fine — they're already subscribed
        return nil
    
    if errResp.Title == "Invalid Resource":
        return ValidationError("Invalid email address")
    
    // Generic error
    return fmt.Errorf("Mailchimp API error: %s", errResp.Detail)
```

**The actual Go implementation** (the real code you'll write):

```go
package mailchimp

import (
    "bytes"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "strings"
)

// Client is a minimal Mailchimp Marketing API client.
type Client struct {
    apiKey     string
    listID     string
    baseURL    string
    httpClient *http.Client
}

// NewClient creates a Mailchimp client. Returns nil if apiKey is empty
// (Mailchimp features are disabled).
func NewClient(apiKey, listID string) *Client {
    if apiKey == "" {
        return nil
    }
    parts := strings.Split(apiKey, "-")
    serverPrefix := parts[len(parts)-1]
    return &Client{
        apiKey:     apiKey,
        listID:     listID,
        baseURL:    fmt.Sprintf("https://%s.api.mailchimp.com/3.0", serverPrefix),
        httpClient: &http.Client{},
    }
}

// Subscribe adds an email to the Mailchimp audience list.
// If the email is already subscribed, it returns nil (no error).
func (c *Client) Subscribe(email string) error {
    url := fmt.Sprintf("%s/lists/%s/members", c.baseURL, c.listID)

    body := map[string]interface{}{
        "email_address": email,
        "status":        "subscribed",
        "tags":          []string{"website-signup"},
    }

    bodyJSON, err := json.Marshal(body)
    if err != nil {
        return fmt.Errorf("marshal body: %w", err)
    }

    req, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(bodyJSON))
    if err != nil {
        return fmt.Errorf("create request: %w", err)
    }

    req.Header.Set("Content-Type", "application/json")
    // Mailchimp uses HTTP Basic Auth: username is ignored, password is the API key
    auth := base64.StdEncoding.EncodeToString([]byte("anystring:" + c.apiKey))
    req.Header.Set("Authorization", "Basic "+auth)

    resp, err := c.httpClient.Do(req)
    if err != nil {
        return fmt.Errorf("mailchimp request failed: %w", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusCreated {
        return nil // Success
    }

    // Parse error body
    respBody, _ := io.ReadAll(resp.Body)
    var errResp struct {
        Title  string `json:"title"`
        Detail string `json:"detail"`
        Status int    `json:"status"`
    }
    _ = json.Unmarshal(respBody, &errResp)

    if errResp.Title == "Member Exists" {
        return nil // Already subscribed — not an error for us
    }

    return fmt.Errorf("mailchimp error (%d): %s — %s", errResp.Status, errResp.Title, errResp.Detail)
}
```

### 7.3 Step 3: Add the HTTP Handler (`pkg/server/public.go`)

The handler receives the email from the frontend, validates it, and calls the Mailchimp client.

**Pseudocode:**

```
function handleSubscribe(w, r):
    // 1. Check if Mailchimp is enabled
    if s.mailchimpClient is nil:
        respond with 503 Service Unavailable
        return
    
    // 2. Parse the request body
    body = read r.Body
    request = parse JSON from body
    email = request.email
    
    // 3. Validate the email
    if email is empty OR doesn't match email regex:
        respond with 400 "email is required"
        return
    
    // 4. Call Mailchimp
    err = s.mailchimpClient.Subscribe(email)
    if err != nil:
        respond with 500 err
        return
    
    // 5. Return success
    respond with 201 {success: true}
```

**The actual Go code:**

```go
// Add to pkg/server/public.go

type subscribeRequest struct {
    Email string `json:"email"`
}

func (s *Server) handleSubscribe(w http.ResponseWriter, r *http.Request) {
    if s.mailchimpClient == nil {
        respondError(w, fmt.Errorf("mailchimp is not configured"))
        return
    }

    body, err := io.ReadAll(r.Body)
    if err != nil {
        respondError(w, fmt.Errorf("read body: %w", err))
        return
    }

    var req subscribeRequest
    if err := json.Unmarshal(body, &req); err != nil {
        respondError(w, fmt.Errorf("invalid request: %w", err))
        return
    }

    // Basic email validation
    req.Email = strings.TrimSpace(req.Email)
    if req.Email == "" || !strings.Contains(req.Email, "@") {
        respondError(w, fmt.Errorf("%w: valid email is required", service.ErrValidation))
        return
    }

    // Forward to Mailchimp
    if err := s.mailchimpClient.Subscribe(req.Email); err != nil {
        respondError(w, err)
        return
    }

    respondJSON(w, http.StatusCreated, map[string]bool{"success": true})
}
```

### 7.4 Step 4: Wire It All Together (`pkg/server/server.go`)

In the `New()` function, after creating the services:

```go
// In pkg/server/server.go — inside New() function

// Mailchimp client (optional — nil if not configured)
var mailchimpClient *mailchimp.Client
if cfg.MailchimpEnabled && cfg.MailchimpAPIKey != "" {
    mailchimpClient = mailchimp.NewClient(cfg.MailchimpAPIKey, cfg.MailchimpListID)
    log.Info().Msg("Mailchimp integration enabled")
} else {
    log.Warn().Msg("Mailchimp integration disabled (no API key)")
}
s.mailchimpClient = mailchimpClient

// Add this field to the Server struct:
// mailchimpClient *mailchimp.Client

// Register the new public route (add with the other public routes):
mux.HandleFunc("POST /api/public/subscribe", s.handleSubscribe)
```

**File reference for where to add the route:**

In `pkg/server/server.go`, look for the comment `// Public API (no auth)` and add the route there, right after the existing `POST /api/public/submissions` line:

```go
// Public API (no auth)
mux.HandleFunc("GET /api/public/shows", s.handleListPublicShows)
mux.HandleFunc("GET /api/public/shows/{id}", s.handleGetPublicShow)
mux.HandleFunc("GET /api/public/archive", s.handleGetArchive)
mux.HandleFunc("GET /api/public/archive/stats", s.handleGetArchiveStats)
mux.HandleFunc("GET /api/public/settings", s.handleGetPublicSettings)
mux.HandleFunc("POST /api/public/submissions", s.handleCreateSubmission)
mux.HandleFunc("POST /api/public/subscribe", s.handleSubscribe)   // ← NEW
```

---
## 8. Frontend Implementation — React Signup Component

### 8.1 Overview

We need three frontend pieces:

1. **A React component** (`MailingListSignup`) — the actual form UI
2. **An API hook** (`useSubscribe`) — a React Query mutation that calls our backend
3. **Integration** — placing the component on the About page and/or in the footer

### 8.2 Step 1: Create the API Hook (`web/packages/pyxis-user-site/src/api/hooks.ts`)

This is the function that actually makes the HTTP call. It's a React Query **mutation** (not a query), because it changes data (subscribes someone) rather than reading data.

```typescript
// Add to the existing hooks file

import { useMutation } from '@tanstack/react-query';

interface SubscribeRequest {
  email: string;
}

interface SubscribeResponse {
  success: boolean;
}

export function useSubscribe() {
  return useMutation<SubscribeResponse, Error, SubscribeRequest>({
    mutationFn: async (data) => {
      const response = await fetch('/api/public/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Subscription failed' } }));
        throw new Error(error.error?.message || 'Subscription failed');
      }

      return response.json();
    },
  });
}
```

**Why a mutation and not a query?**
- React Query's `useQuery` is for fetching data (GET requests) — it caches and refetches automatically
- React Query's `useMutation` is for actions that change data (POST requests) — it tracks loading/success/error state
- A subscription is a one-time action, so `useMutation` is correct

**The mutation gives us:**
- `mutate({ email: "fan@test.com" })` — call this to trigger the subscription
- `isPending` — true while the request is in flight
- `isSuccess` — true after successful subscription
- `isError` — true if the request failed
- `error` — the error message if it failed
- `reset()` — reset the mutation state (useful for showing the form again)

### 8.3 Step 2: Create the React Component

The component lives in `pyxis-components` because it should be reusable across the site (footer, about page, etc.).

**Location:** `web/packages/pyxis-components/src/molecules/MailingListSignup/`

**Component file (`MailingListSignup.tsx`):**

```typescript
import { useState, type FormEvent } from 'react';
import './MailingListSignup.css';

export interface MailingListSignupProps {
  /** Called when subscription succeeds */
  onSuccess?: () => void;
  /** Heading text. Defaults to "Stay in the Loop" */
  heading?: string;
  /** Subtext. Defaults to "Get show announcements..." */
  subtitle?: string;
  /** Source tag for analytics. Passed as tag to Mailchimp. */
  source?: string;
}

interface MailingListSignupHandlers {
  subscribe: (data: { email: string }) => Promise<{ success: boolean }>;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * MailingListSignup — an email subscription form.
 *
 * This is a "headless-ish" component that manages the form UI
 * but delegates the actual API call to the parent via the
 * `subscribe` function prop.
 *
 * Usage (with the hook):
 * ```tsx
 * function MyPage() {
 *   const { mutate, isPending, isSuccess, isError, error, reset } = useSubscribe();
 *   return (
 *     <MailingListSignup
 *       subscribe={(d) => mutate(d)}
 *       isPending={isPending}
 *       isSuccess={isSuccess}
 *       isError={isError}
 *       error={error}
 *       reset={reset}
 *     />
 *   );
 * }
 * ```
 */
export function MailingListSignup(props: MailingListSignupProps & MailingListSignupHandlers) {
  const {
    heading = 'Stay in the Loop',
    subtitle = 'Get show announcements and venue news delivered to your inbox.',
    onSuccess,
    subscribe,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = props;

  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    subscribe({ email });
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="pyxis-mailing-list pyxis-mailing-list--success" data-section="mailing-list">
        <h3 className="pyxis-mailing-list__heading">You're in! 🎉</h3>
        <p className="pyxis-mailing-list__text">
          Check your inbox for a confirmation.
        </p>
        <button
          className="pyxis-mailing-list__reset"
          onClick={() => { reset(); setEmail(''); }}
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  // Form state
  return (
    <div className="pyxis-mailing-list" data-section="mailing-list">
      <h3 className="pyxis-mailing-list__heading">{heading}</h3>
      <p className="pyxis-mailing-list__text">{subtitle}</p>

      <form className="pyxis-mailing-list__form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="pyxis-mailing-list__input"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
          aria-label="Email address"
        />
        <button
          type="submit"
          className="pyxis-mailing-list__submit"
          disabled={isPending || !email}
        >
          {isPending ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {isError && (
        <p className="pyxis-mailing-list__error" role="alert">
          {error?.message || 'Something went wrong. Please try again.'}
        </p>
      )}
    </div>
  );
}
```

**Why this design:**

- The component takes the `subscribe` function as a prop (dependency injection). This makes it testable — you can pass a mock function in Storybook without needing a real API.
- The `isPending`, `isSuccess`, `isError` states come from the hook and are passed through as props.
- The success state shows a friendly message and a "subscribe another" button.
- Error messages are shown inline (not in an alert dialog).

### 8.4 Step 3: Add to the About Page

In `web/packages/pyxis-user-site/src/pages/AboutPage/Page.tsx`:

```typescript
import { MailingListSignup } from 'pyxis-components';
import { useSubscribe } from '../../api/hooks';

export function About() {
  const { data: settings } = usePublicSettings();
  const subscribeMutation = useSubscribe();

  return (
    <main className="pyxis-public-page pyxis-about-page" data-page="about">
      <div className="pyxis-public-page__inner">
        {/* ... existing sections ... */}

        {/* NEW: Mailing list signup section */}
        <section data-section="about-mailing-list">
          <MailingListSignup
            subscribe={(data) => subscribeMutation.mutateAsync(data)}
            isPending={subscribeMutation.isPending}
            isSuccess={subscribeMutation.isSuccess}
            isError={subscribeMutation.isError}
            error={subscribeMutation.error}
            reset={subscribeMutation.reset}
            source="about-page"
          />
        </section>
      </div>
    </main>
  );
}
```

### 8.5 Step 4: Export the Component

In `web/packages/pyxis-components/src/index.ts`, add:

```typescript
export { MailingListSignup } from './molecules/MailingListSignup';
export type { MailingListSignupProps } from './molecules/MailingListSignup';
```

### 8.6 CSS Styling Guidelines

The component uses BEM-style CSS classes (matching the rest of the codebase). Key styles:

```css
/* MailingListSignup.css */

.pyxis-mailing-list {
  padding: var(--space-lg) 0;
  max-width: 480px;
}

.pyxis-mailing-list__heading {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  margin-bottom: var(--space-xs);
}

.pyxis-mailing-list__text {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.pyxis-mailing-list__form {
  display: flex;
  gap: var(--space-xs);
}

.pyxis-mailing-list__input {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
}

.pyxis-mailing-list__submit {
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  white-space: nowrap;
}

.pyxis-mailing-list__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.pyxis-mailing-list__error {
  color: var(--color-error);
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
}

.pyxis-mailing-list--success {
  text-align: center;
}
```

---
## 9. Configuration & Environment Variables

### 9.1 What Needs to Be Configured

Three values are required to connect to Mailchimp:

| Variable | Example | Where to Find in Mailchimp |
|----------|---------|---------------------------|
| `MAILCHIMP_API_KEY` | `a1b2c3d4e5f6g7h8-us12` | Profile → Extras → API Keys → Create A Key |
| `MAILCHIMP_LIST_ID` | `ab2c468d10` | Audience → Settings → Audience name and defaults |
| `MAILCHIMP_ENABLED` | `true` | Not from Mailchimp — our own on/off switch |

### 9.2 How to Get the Mailchimp API Key

1. Log into Mailchimp
2. Click your **profile picture** (top right) → **Profile**
3. Click the **Extras** drop-down → **API Keys**
4. Click **Create A Key**
5. Name it something like "Pyxis Website"
6. Copy the key immediately (you can't see it again!)
7. The key looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3-us12`

### 9.3 How to Get the List ID (Audience ID)

1. In Mailchimp, go to **Audience** → **All contacts**
2. Click **Settings** drop-down → **Audience name and defaults**
3. Look for **Audience ID** on the right side — it's a 10-character string like `ab2c468d10`

### 9.4 Local Development Setup

Add to `.envrc` (or your local `.env` file):

```bash
# Mailchimp mailing list integration
export PYXIS_MAILCHIMP_ENABLED=true
export PYXIS_MAILCHIMP_API_KEY="your-actual-api-key-here"
export PYXIS_MAILCHIMP_LIST_ID="your-actual-list-id-here"
```

**Important:** The `.envrc` file is gitignored and should NEVER be committed. The `.envrc.example` file should contain placeholder values only.

### 9.5 Production Setup

For production (Kubernetes/ArgoCD), add these as sealed secrets or environment variables in the deployment manifest:

```yaml
# In deploy/ or ArgoCD manifests
env:
  - name: PYXIS_MAILCHIMP_ENABLED
    value: "true"
  - name: PYXIS_MAILCHIMP_API_KEY
    valueFrom:
      secretKeyRef:
        name: pyxis-secrets
        key: mailchimp-api-key
  - name: PYXIS_MAILCHIMP_LIST_ID
    valueFrom:
      secretKeyRef:
        name: pyxis-secrets
        key: mailchimp-list-id
```

### 9.6 How Config Loading Works in Pyxis

The `Config` struct in `pkg/config/config.go` is populated from environment variables. The existing pattern uses either `envconfig` or manual `os.Getenv` calls (check the existing code to see which pattern is used and follow it).

The key principle: **if `MAILCHIMP_ENABLED` is false or `MAILCHIMP_API_KEY` is empty, the entire feature is disabled gracefully.** The server still starts, but `POST /api/public/subscribe` returns 503 Service Unavailable. The frontend should detect this and hide the signup form (or show a "coming soon" message).

---

## 10. Database & Settings Considerations

### 10.1 Do We Need a Database Table?

**Short answer: No, not for the MVP.** Here's the reasoning:

- Mailchimp is our "source of truth" for subscriber data. It already stores emails, names, subscription dates, and status.
- Adding a local `subscribers` table would mean syncing between our DB and Mailchimp, which adds complexity without clear value.
- If we later want analytics (how many people subscribed this week, what page they came from), we can use Mailchimp's own analytics or add a simple counter in the `settings` table.

**Future consideration:** If we want to track subscription events in our audit log (which records all significant actions), we could add an audit log entry when someone subscribes:

```go
s.auditService.Log(ctx, &domain.AuditLogEntry{
    Action:     "subscribe",
    EntityType: "mailing_list",
    Metadata:   map[string]interface{}{"email": email},
})
```

But this is optional and can be added later.

### 10.2 The Settings Table — Potential Mailchimp Fields

The `settings` table is a single-row configuration table (one row per venue). Currently it has fields like `space_name`, `tagline`, `contact_email`, etc.

In the **future**, we might want to store Mailchimp settings in this table so they can be configured from the staff app UI (instead of environment variables). But for the MVP, environment variables are simpler and more secure (no API key in the database).

If we later add UI configuration, we'd add:

```sql
ALTER TABLE settings ADD COLUMN mailchimp_enabled BOOLEAN DEFAULT false;
ALTER TABLE settings ADD COLUMN mailchimp_api_key TEXT;
ALTER TABLE settings ADD COLUMN mailchimp_list_id TEXT;
```

And add a "Mailing List" section in the staff settings page. But again — **not needed for the MVP.**

### 10.3 Existing Domain Model — How Settings Work

The `domain.Settings` struct maps to the `settings` table. It's loaded via `settingsService.Get(ctx)` and returned via `GET /api/public/settings`. The frontend uses this to display the space name, tagline, etc.

For the mailing list feature, the **frontend** doesn't need to know if Mailchimp is configured — it just renders the form. If the backend returns 503, the frontend shows a friendly error. But as an optional enhancement, we could add a `mailchimp_enabled` boolean to the public settings response so the frontend can hide the form entirely when Mailchimp is not configured.

---
## 11. Testing Strategy

### 11.1 Backend Tests

#### Unit Test: Mailchimp Client (`pkg/mailchimp/client_test.go`)

We test the client by using an `httptest.Server` that pretends to be Mailchimp. This way we don't need a real API key for tests.

```go
package mailchimp

import (
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestSubscribe_Success(t *testing.T) {
    // Fake Mailchimp server that returns 201 Created
    fakeServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Verify the request looks correct
        if r.Method != http.MethodPost {
            t.Errorf("expected POST, got %s", r.Method)
        }
        if r.Header.Get("Authorization") == "" {
            t.Error("expected Authorization header")
        }

        // Return a 201 (new subscriber)
        w.WriteHeader(http.StatusCreated)
        w.Write([]byte(`{"id":"abc","email_address":"fan@test.com","status":"subscribed"}`))
    }))
    defer fakeServer.Close()

    // Create a client that points to our fake server
    client := &Client{
        apiKey:     "test-key-us12",
        listID:     "test-list-id",
        baseURL:    fakeServer.URL,
        httpClient: fakeServer.Client(),
    }

    err := client.Subscribe("fan@test.com")
    if err != nil {
        t.Fatalf("expected no error, got: %v", err)
    }
}

func TestSubscribe_AlreadySubscribed(t *testing.T) {
    // Fake server that returns "Member Exists" error
    fakeServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusBadRequest)
        w.Write([]byte(`{"title":"Member Exists","detail":"fan@test.com is already subscribed"}`))
    }))
    defer fakeServer.Close()

    client := &Client{
        apiKey:     "test-key-us12",
        listID:     "test-list-id",
        baseURL:    fakeServer.URL,
        httpClient: fakeServer.Client(),
    }

    // "Already subscribed" should NOT be an error
    err := client.Subscribe("fan@test.com")
    if err != nil {
        t.Fatalf("expected no error for existing member, got: %v", err)
    }
}
```

#### Integration Test: HTTP Handler (`pkg/server/public_test.go` or similar)

Test the full handler by creating a server with a fake Mailchimp client:

```go
func TestHandleSubscribe(t *testing.T) {
    tests := []struct {
        name       string
        body       string
        wantStatus int
    }{
        {
            name:       "valid email",
            body:       `{"email":"fan@test.com"}`,
            wantStatus: http.StatusCreated,
        },
        {
            name:       "missing email",
            body:       `{"email":""}`,
            wantStatus: http.StatusBadRequest,
        },
        {
            name:       "invalid email",
            body:       `{"email":"not-an-email"}`,
            wantStatus: http.StatusBadRequest,
        },
        {
            name:       "malformed JSON",
            body:       `{bad json`,
            wantStatus: http.StatusInternalServerError,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Create a test server with a mock mailchimp client
            // ... (using httptest and a fake client that always succeeds)
            req := httptest.NewRequest(http.MethodPost, "/api/public/subscribe", strings.NewReader(tt.body))
            req.Header.Set("Content-Type", "application/json")
            w := httptest.NewRecorder()

            server.handleSubscribe(w, req)

            if w.Code != tt.wantStatus {
                t.Errorf("expected status %d, got %d", tt.wantStatus, w.Code)
            }
        })
    }
}
```

### 11.2 Frontend Tests

#### Storybook Stories

Every component in Pyxis has Storybook stories. Create stories for the three states:

```typescript
// MailingListSignup.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MailingListSignup } from './MailingListSignup';

const meta: Meta<typeof MailingListSignup> = {
  title: 'Molecules/MailingListSignup',
  component: MailingListSignup,
};
export default meta;

// Default (form) state
export const Default: StoryObj = {
  args: {
    subscribe: async () => ({ success: true }),
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    reset: () => {},
  },
};

// Loading state
export const Loading: StoryObj = {
  args: {
    ...Default.args,
    isPending: true,
  },
};

// Success state
export const Success: StoryObj = {
  args: {
    ...Default.args,
    isSuccess: true,
  },
};

// Error state
export const Error: StoryObj = {
  args: {
    ...Default.args,
    isError: true,
    error: new Error('Something went wrong. Please try again.'),
  },
};
```

#### Manual Testing Checklist

- [ ] Type a valid email → click Subscribe → see success message
- [ ] Type an already-subscribed email → see success message (not an error)
- [ ] Type an invalid email → see validation error before submission
- [ ] Click Subscribe with empty email → button is disabled
- [ ] Disconnect from internet → click Subscribe → see error message
- [ ] Click "Subscribe another email" → form resets
- [ ] Tab through the form → keyboard navigation works
- [ ] Check the form on mobile → responsive layout

---

## 12. Security Considerations

### 12.1 API Key Protection

The Mailchimp API key is a **secret**. If someone gets it, they can:
- Read all your subscriber data
- Send emails on your behalf
- Delete your audience
- Access billing information

**Our protections:**
- The API key lives in environment variables, never in the codebase
- It's never sent to the browser (our backend proxies the request)
- In production, it's stored as a Kubernetes secret

**What NOT to do:**
- ❌ Never put the API key in a React component or `.env` file in the `web/` directory
- ❌ Never commit the API key to git
- ❌ Never log the full API key (only log the first 4 characters)

### 12.2 Rate Limiting

Without rate limiting, someone could write a script that submits thousands of fake emails per minute. This would:
- Fill your Mailchimp audience with garbage data
- Potentially trigger Mailchimp's own abuse detection
- Cost money if you're on a paid plan (Mailchimp charges per contact)

**Recommended:** Add a simple rate limiter using Go's `time/rate` package or an in-memory counter:

```go
// Simple per-IP rate limiter: max 5 subscriptions per minute per IP
var subscribeLimiter = rate.NewLimiter(rate.Every(12*time.Second), 5)

func (s *Server) handleSubscribe(w http.ResponseWriter, r *http.Request) {
    if !subscribeLimiter.Allow() {
        respondError(w, fmt.Errorf("too many requests"))
        return
    }
    // ... rest of handler
}
```

### 12.3 Email Validation

We do basic validation (must contain `@` and a domain), but we don't need to be perfect — Mailchimp will reject truly invalid emails. The goal is to catch obvious mistakes (empty field, missing @) before making the API call.

### 12.4 Double Opt-In

Mailchimp supports two subscription modes:

- **Single opt-in** (`status: "subscribed"`) — the email is immediately added to the list
- **Double opt-in** (`status: "pending"`) — Mailchimp sends a confirmation email, and the subscriber must click a link to confirm

**Recommendation:** Start with single opt-in (lower friction). If you see spam signups, switch to double opt-in by changing one word in the Go code:

```go
// Single opt-in (default):
"status": "subscribed",

// Double opt-in (if you see spam):
"status": "pending",
```

### 12.5 CORS

The subscription endpoint is on the same domain as the frontend (both served by the Go backend). In development, the Vite dev server proxies API requests to the Go backend. No CORS configuration needed.

### 12.6 HTTPS

In production, the site is served over HTTPS (via Kubernetes ingress). This means the email is encrypted in transit — a visitor's email can't be intercepted by a middleman.

---
## 13. Step-by-Step Implementation Checklist

Here's the exact order to implement this feature. Each step is a small, testable unit of work.

### Phase 1: Backend Foundation

- [ ] **1.1** Create `pkg/mailchimp/client.go` with the `Client` struct and `NewClient` function
- [ ] **1.2** Implement the `Subscribe` method with proper error handling
- [ ] **1.3** Add unit tests using `httptest.NewServer` as a fake Mailchimp API
- [ ] **1.4** Add `MailchimpEnabled`, `MailchimpAPIKey`, `MailchimpListID` to `pkg/config/config.go`
- [ ] **1.5** Add `mailchimpClient` field to the `Server` struct in `pkg/server/server.go`
- [ ] **1.6** Initialize the Mailchimp client in `New()` (with nil fallback for disabled)
- [ ] **1.7** Add `POST /api/public/subscribe` route in `server.go`
- [ ] **1.8** Implement `handleSubscribe` in `pkg/server/public.go`
- [ ] **1.9** Add environment variables to `.envrc.example`
- [ ] **1.10** Run `go test ./...` and verify all tests pass
- [ ] **1.11** Start the server locally and test with `curl`:
  ```bash
  curl -X POST http://localhost:8080/api/public/subscribe \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com"}'
  ```

### Phase 2: Frontend Component

- [ ] **2.1** Create `web/packages/pyxis-components/src/molecules/MailingListSignup/` directory
- [ ] **2.2** Create `MailingListSignup.tsx` with the form component
- [ ] **2.3** Create `MailingListSignup.css` with BEM-style styles
- [ ] **2.4** Create `index.ts` barrel export
- [ ] **2.5** Create `MailingListSignup.stories.tsx` with Default/Loading/Success/Error stories
- [ ] **2.6** Export from `web/packages/pyxis-components/src/index.ts`
- [ ] **2.7** Run Storybook and verify all stories render correctly

### Phase 3: Frontend Integration

- [ ] **3.1** Add `useSubscribe` mutation hook to `web/packages/pyxis-user-site/src/api/hooks.ts`
- [ ] **3.2** Add `<MailingListSignup />` to the About page (`AboutPage/Page.tsx`)
- [ ] **3.3** (Optional) Add `<MailingListSignup />` to the footer or a dedicated page
- [ ] **3.4** Test the full flow: type email → submit → see success message
- [ ] **3.5** Test error states: disconnect backend, invalid email, etc.

### Phase 4: Polish & Deploy

- [ ] **4.1** Add rate limiting to the subscribe handler
- [ ] **4.2** Configure Mailchimp API key and list ID in production (Kubernetes secrets)
- [ ] **4.3** Set `MAILCHIMP_ENABLED=true` in production environment
- [ ] **4.4** Deploy and test on staging
- [ ] **4.5** Monitor Mailchimp audience for new subscribers
- [ ] **4.6** Update the changelog in the ticket

---

## 14. Appendix: Mailchimp API Reference

### 14.1 Add Member to List

**Endpoint:**
```
POST https://<dc>.api.mailchimp.com/3.0/lists/{list_id}/members
```

Where:
- `<dc>` is your data center (e.g., `us12`), extracted from the API key
- `{list_id}` is your audience ID (e.g., `ab2c468d10`)

**Authentication:**
```
Authorization: Basic base64(anystring:API_KEY)
```

The username can be any string (commonly `anystring` or omitted). The password is the full API key.

**Request Body:**
```json
{
  "email_address": "fan@example.com",
  "status": "subscribed",
  "merge_fields": {
    "FNAME": "Jane",
    "LNAME": "Doe"
  },
  "tags": ["website-signup", "pyxis"],
  "ip_signup": "192.168.1.1"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email_address` | string | Yes | The subscriber's email |
| `status` | string | Yes | `subscribed`, `pending`, `unsubscribed`, `cleaned` |
| `merge_fields` | object | No | Custom fields (FNAME, LNAME, etc.) |
| `tags` | string[] | No | Tags to apply to the subscriber |
| `ip_signup` | string | No | IP address of the subscriber |

**Success Response (201 Created):**
```json
{
  "id": "a1b2c3d4e5",
  "email_address": "fan@example.com",
  "status": "subscribed",
  "merge_fields": { "FNAME": "", "LNAME": "" },
  "tags": [{ "name": "website-signup", "id": 1234 }],
  "timestamp_signup": "2026-04-29T12:00:00+00:00"
}
```

**Error Response (400 Bad Request):**
```json
{
  "type": "https://mailchimp.com/developer/marketing/docs/errors/",
  "title": "Member Exists",
  "status": 400,
  "detail": "fan@example.com is already a list member.",
  "instance": ""
}
```

**Common Error Titles:**

| Title | Status | Meaning | How We Handle It |
|-------|--------|---------|-----------------|
| `Member Exists` | 400 | Email already subscribed | Return success (not an error for us) |
| `Invalid Resource` | 400 | Invalid email format | Return validation error to frontend |
| `API Key Invalid` | 401 | Wrong API key | Return 500 (server config error) |
| `Resource Not Found` | 404 | Wrong list ID | Return 500 (server config error) |

### 14.2 Add or Update List Member (Upsert)

If you want to update an existing subscriber (change their name, add a tag) instead of getting a "Member Exists" error, use the PUT endpoint:

```
PUT https://<dc>.api.mailchimp.com/3.0/lists/{list_id}/members/{subscriber_hash}
```

Where `{subscriber_hash}` is the MD5 hash of the lowercase email address:

```go
import "crypto/md5"
hash := md5.Sum([]byte(strings.ToLower(email)))
subscriberHash := hex.EncodeToString(hash[:])
```

This is useful if you want to add tags to existing subscribers without erroring. For the MVP, the POST approach is fine.

---

## 15. Appendix: Mailchimp Embedded Form Deep Dive

This section documents the alternative approach (Approach A from section 4) in detail. We're **not** using this approach, but understanding it is valuable context.

### 15.1 How the Embedded Form Actually Works

When you create an embedded form in Mailchimp, it generates HTML code like this:

```html
<!-- Begin Mailchimp Signup Form -->
<link href="//cdn-images.mailchimp.com/embedcode/classic-081711.css" rel="stylesheet" type="text/css">
<div id="mc_embed_signup">
  <form action="//us4.list-manage.com/subscribe/post?u=USER_ID&id=LIST_ID"
        method="POST" ...>
    <!-- Visible fields -->
    <input type="email" name="EMAIL" ...>

    <!-- Hidden fields -->
    <input type="hidden" name="u" value="USER_ID">
    <input type="hidden" name="id" value="LIST_ID">

    <!-- Anti-bot honeypot -->
    <div style="position: absolute; left: -5000px;">
      <input type="text" name="b_USER_ID_LIST_ID" tabindex="-1" value="">
    </div>

    <input type="submit" value="Subscribe">
  </form>
</div>
<script src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script>
```

**What each piece does:**

1. **The CSS link** loads Mailchimp's default styling (the "classic" theme). We'd want to remove this and use our own CSS.

2. **The form action URL** is where the data is sent. It points to Mailchimp's servers. The `u` and `id` parameters identify your account and audience.

3. **The honeypot field** (`b_USER_ID_LIST_ID`) is an invisible text input. Humans can't see it, but spam bots fill in all fields. If this field has a value, Mailchimp silently ignores the submission. Clever!

4. **mc-validate.js** is a 140KB JavaScript file that:
   - Validates the form fields client-side
   - Submits the form via AJAX (instead of a page redirect)
   - Shows success/error messages
   - **Includes jQuery** (the whole library!)

### 15.2 Why This Approach Is Problematic for Pyxis

1. **jQuery dependency:** Our React app doesn't use jQuery. Loading 140KB of validation code (including jQuery) just for one form is wasteful.

2. **Styling conflicts:** The Mailchimp CSS uses global selectors that would conflict with our design system's CSS variables and component styles.

3. **No design control:** The form HTML is pre-generated. Customizing it means fighting Mailchimp's CSS and JavaScript.

4. **CORS in production:** The form submits to a different domain (`*.list-manage.com`). This works for simple HTML pages but can be blocked by strict CSP headers.

5. **No analytics:** We can't track how many people attempt to subscribe vs. succeed, because the form submits directly to Mailchimp.

### 15.3 The "Host Your Own Form" Hybrid

Mailchimp documents an alternative where you host your own form but still submit to their endpoint. The process is:

1. Find your Mailchimp signup form URL
2. View the page source
3. Copy the `form action`, hidden `u` and `id` fields, and input `name` attributes
4. Build your own form using those values

This works, but it still has the CORS issue and exposes your user/list IDs. The server-side API approach we chose avoids all of these problems.

### 15.4 Research Sources

The following reference documents were downloaded and stored in this ticket's `sources/` directory:

| File | Source | Key Takeaway |
|------|--------|-------------|
| `sources/mailchimp-host-your-own-signup-forms.md` | mailchimp.com/help/host-your-own-signup-forms/ | How to extract form action, user ID, audience ID from Mailchimp's generated form |
| `sources/mailchimp-customize-embedded-signup-form.md` | mailchimp.com/help/customize-embedded-signup-form/ | How to customize form fields, tags, referral badges |
| `sources/mailchimp-classic-embedded-form-example.md` | gist.github.com/matt-west | Full HTML example of a classic embedded form with all fields |

---

*End of document. Good luck, intern! You've got this. 🚀*
