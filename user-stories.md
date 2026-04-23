## MVP Phase Implementation Plan — Revised

Core principle: **each step is a PR, not a project.** Seed the DB directly for initial data. No setup wizard — channel IDs and space config live in environment variables until Phase 4 when we add the settings UI.

---

## Step 1 — "Bot is alive"
*Bot is in the server. Staff can post and pin shows with one command.*

- Scaffold bot project (Discord.js or discord.py)
- Seed DB with `shows` and `settings` tables + initial show data
- `/add-show` command — saves to DB, posts embed to `#upcoming-shows`, pins it
- `/cancel-show <id>` — marks cancelled, unpins, posts notice
- Role gating — `@admin` and `@booker` only for write commands
- Channel IDs and guild ID in `.env`

**User stories**
- As a booker, I can run `/add-show` in Discord to post and pin a formatted show announcement
- As a booker, I can run `/cancel-show` to unpin the message and post a cancellation notice
- As an admin, only users with the right Discord role can run write commands

---

## Step 2 — "Shows have memory"
*Every show has a DB record. Staff can reference and manage by ID.*

- `/upcoming` command — pulls confirmed shows from DB, formatted list
- `/show <id>` — returns full details for a specific show
- `/archive-show <id>` — marks archived, unpins
- Nightly cron — auto-archives confirmed shows whose date has passed, posts to `#staff`
- `audit_log` table — bot writes an entry for every action

**User stories**
- As any staff member, I can run `/upcoming` to see confirmed shows pulled live from the DB
- As a booker, I can run `/show 42` to pull up any show's details on demand
- As a booker, I can archive a past show manually
- As staff, I know that shows whose date has passed are cleaned up automatically each night

---

## Step 3 — "Public can see what's on"
*Minimal public-facing page. No auth, no admin.*

- Scaffold web project (Next.js)
- `GET /public/shows` and `GET /public/shows/:id` API endpoints
- Public shows list page — upcoming confirmed shows only
- Public show detail page — artist, date, doors, age, price, description
- DB seeded with realistic show data including descriptions

**User stories**
- As a visitor, I can see a list of upcoming confirmed shows
- As a visitor, I can click a show to see its full detail page
- As a visitor, I can see whether a show is sold out, free, or on sale

---

## Step 4 — "Staff can log in"
*Discord OAuth. Staff dashboard exists but is read-only for now.*

- Discord OAuth flow — login, session, `GET /auth/me`
- `users` table — created or updated on each login
- Staff dashboard — shows list, read-only
- Route protection — unauthenticated users redirected to login
- `authSlice` + RTK Query `authApi`

**User stories**
- As a staff member, I can log in with my Discord account — no separate password
- As a staff member, I am redirected to login if I try to access the dashboard unauthenticated
- As a staff member, I can see my name and role in the sidebar

---

## Step 5 — "Staff can manage shows from the web"
*Full shows CRUD in the dashboard. Bot still handles Discord side.*

- Shows page — list, add, edit, cancel, archive
- `POST /shows`, `PATCH /shows/:id`, `PATCH /shows/:id/cancel`, `PATCH /shows/:id/archive`
- Cancel and archive trigger Discord bot actions server-side
- `showsApi` RTK Query slice — tags, invalidation, optimistic updates on cancel/archive
- `audit_log` entries written for every action

**User stories**
- As a booker, I can add a new show from the web dashboard
- As a booker, I can edit any field on an existing show
- As a booker, I can cancel a show — the bot unpins and posts a notice automatically
- As a booker, I can archive a show from the dashboard
- As a booker, I can see all actions I've taken in the audit log

---

## Step 6 — "Artists can submit"
*Public booking form. Staff see submissions in the dashboard.*

- `submissions` table
- `POST /public/submissions` — no auth, public endpoint
- Public booking form page — artist, date, genre, draw, links, notes
- Submission confirmation screen
- Bot forwards new submissions to `#booking-requests`
- Submissions queue in staff dashboard — filterable by status

**User stories**
- As an artist, I can submit a booking inquiry without needing an account
- As an artist, I see a confirmation screen after submitting
- As a booker, I can see all incoming submissions in a queue, filtered by status
- As a booker, I am notified in `#booking-requests` when a new submission arrives

---

## Step 7 — "Staff can approve and decline"
*Approve promotes to a show. Decline notifies the artist.*

- `PATCH /submissions/:id/approve` — creates show record, DMs artist
- `PATCH /submissions/:id/decline` — DMs artist
- Approve/decline buttons in submissions queue
- `artists` table — auto-created or matched on approval
- `submissionsApi` RTK Query slice

**User stories**
- As a booker, I can approve a submission — it becomes a confirmed show automatically
- As a booker, I can decline a submission
- As an artist, I receive a Discord DM when my submission is approved or declined
- As a booker, approving a submission creates or matches an artist record automatically

---

## Step 8 — "Artist directory"
*Staff can look up anyone who's played or submitted.*

- `GET /artists`, `GET /artists/:id`, `PATCH /artists/:id`
- Artists page — searchable directory
- Artist detail modal — show history, links, notes
- Edit internal notes inline

**User stories**
- As a booker, I can browse and search the artist directory by name or genre
- As a booker, I can see an artist's full show history at the space
- As a booker, I can add and edit internal notes on any artist profile

---

## Step 9 — "Calendar"
*Visual month view. Holds and blocked dates.*

- `calendar_holds` and `calendar_blocked` tables
- `GET /calendar?month=YYYY-MM`
- Calendar page — month grid, shows + holds + blocked
- Add hold, add block, delete both
- `calendarApi` — prefetch adjacent months

**User stories**
- As a booker, I can see all confirmed shows, holds, and blocked dates on a month view
- As a booker, I can navigate between months
- As a booker, I can place a soft hold on a date while negotiating a booking
- As a booker, I can block a date to prevent it being booked
- As a booker, I can click a date to see what's scheduled or add something

---

## Step 10 — "Flyers"
*Upload, display, download.*

- `flyer_url` column on `shows`
- `POST /shows/:id/flyer` — multipart upload to S3/R2
- `DELETE /shows/:id/flyer`
- Flyer thumbnail on shows list (public)
- Flyer on show detail sidebar (public)
- Fullscreen lightbox + download button (public)
- Upload/remove in show editor (staff)

**User stories**
- As a booker, I can upload a flyer image to any show from the dashboard
- As a visitor, I can see a flyer thumbnail next to each show on the upcoming list
- As a visitor, I can click a flyer to view it fullscreen
- As a visitor, I can download a flyer from the lightbox

---

## Step 11 — "Post-show logging"
*Log attendance and notes after each show.*

- `attendance_logs` table
- `GET /attendance`, `POST /attendance/:showId`, `PATCH /attendance/:showId`
- Post-show log page — queue of unlogged past shows
- Log modal — headcount, notes, incident flag

**User stories**
- As a staff member, I can see which past shows still need a log entry
- As a staff member, I can log headcount and notes after a show
- As a staff member, I can flag an incident on any log entry
- As a staff member, I can edit a log after saving it

---

## Step 12 — "Public archive"
*Searchable history of every past show.*

- `GET /public/archive?search=`
- Archive page — grouped by year, searchable
- Archive link in public nav

**User stories**
- As a visitor, I can browse every past show grouped by year
- As a visitor, I can search the archive by artist or genre

---

## Step 13 — "Settings + polish"
*Admins can manage config. Edge cases handled throughout.*

- Settings page — space info, channel mapping, danger zone
- `GET/PATCH /settings`, `GET /settings/discord/status`, `GET /settings/export`
- Discord connection test + live status indicator
- CSV export
- Form validation with inline errors across all forms
- Loading and empty states throughout
- Error handling for failed bot actions

**User stories**
- As an admin, I can edit space info from the dashboard without touching the DB or env vars
- As an admin, I can remap Discord channels without redeploying
- As an admin, I can test the bot connection and see whether it's online
- As an admin, I can export all data as a CSV
- As any user, I see inline validation errors before a form submits
- As any user, I see a clear error message with a retry option if something goes wrong

---

## At a glance

```
Step 1  ── Bot scaffolded, /add-show works          ← bot is useful day one
Step 2  ── DB memory, /upcoming, auto-archive
Step 3  ── Public shows list + detail               ← public site is live
Step 4  ── Discord OAuth, staff dashboard
Step 5  ── Full shows CRUD on web                   ← staff off Discord commands
Step 6  ── Public booking form + submissions queue
Step 7  ── Approve / decline + artist DMs           ← booking pipeline open
Step 8  ── Artist directory
Step 9  ── Calendar + holds + blocks
Step 10 ── Flyers                                   ← public site complete
Step 11 ── Post-show logging
Step 12 ── Public archive
Step 13 ── Settings + polish                        ← beta closes
```

--- 

## Frontend User Stories — Public Site

### Shows list
- I can see all upcoming confirmed shows in chronological order
- I can see each show's date, artist name, genre, doors time, age restriction, and price at a glance
- I can see a flyer thumbnail for each show
- I can tell immediately whether a show is on sale, sold out, or free from a badge
- I can click a flyer thumbnail to open it fullscreen without leaving the page
- I can click a show row to go to its detail page
- I can see the page without logging in or creating an account

---

### Show detail
- I can see the full artist name, date, genre, and description
- I can see all practical info in one place — doors time, age restriction, price, and venue address
- I can see the flyer for the show in the sidebar
- I can click the flyer to open it fullscreen
- I can click a button to get tickets if they are available
- I can see a disabled sold-out state if the show is sold out
- I can navigate back to the shows list without using the browser back button

---

### Flyer lightbox
- I can view the full flyer image over a dark overlay
- I can download the flyer with one click
- I can close the lightbox by clicking the close button
- I can close the lightbox by clicking outside the flyer

---

### Archive
- I can browse every past show grouped by year, most recent first
- I can see each show's date, artist, genre, and attendance count
- I can search the archive by artist name or genre and see results update immediately
- I can see a clear empty state if my search returns no results
- I can clear my search and return to the full list

---

### Booking form
- I can fill out and submit a booking inquiry without an account
- I can see which fields are required before I try to submit
- I can see inline validation errors if I try to submit with missing required fields
- I cannot submit the form until artist name and links are filled in
- I can see a confirmation message after submitting that sets expectations on response time
- I can submit another inquiry from the confirmation screen without refreshing
- I can see space info and booking process notes alongside the form so I know what to expect

---

### About
- I can read about the space — its history, ethos, and what kinds of shows it hosts
- I can see the venue address, capacity, and contact email
- I can navigate directly to the booking form from the about page
- I can find links to the space's Instagram, Discord, and mailing list

---

### Navigation
- I can reach every page from the top nav on any page
- I can click the space name logo to return to the shows list from anywhere
- The nav shows me which page I am currently on
- I can find social links and the venue address in the footer on every page

---

### General
- I can use the site on a phone without anything being cut off or broken
- I never need to log in or create an account to access any public page
- I see a loading state while show data is being fetched
- I see a clear error message with a retry option if the page fails to load
