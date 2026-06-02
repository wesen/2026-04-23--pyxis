---
Title: Investigation diary
Ticket: PYXIS-GCAL-INIT
Status: active
Topics:
    - pyxis
    - gcal
    - code-review
DocType: reference
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources:
    - https://github.com/wesen/2026-04-23--pyxis/pull/13#discussion_r3342315548
Summary: "Diary for deferred PR #13 Google Calendar client initialization follow-up."
LastUpdated: 2026-06-02T11:49:51.163699907-04:00
WhatFor: "Chronological notes for the deferred GCal startup review follow-up."
WhenToUse: "Read before implementing PYXIS-GCAL-INIT."
---

# Diary

## Goal

Capture the deferred PR #13 code review comment about Google Calendar client startup behavior so it can be addressed later without rediscovering context.

## Step 1: Create follow-up ticket for deferred review comment

I created a focused docmgr ticket for the latest new PR #13 code review comment instead of changing code immediately. The ticket records the exact review concern, the likely failure mode, files to inspect, and acceptance criteria for a future implementation pass.

This preserves the review context while allowing the current PR work to continue without mixing in another behavior change.

### Prompt Context

**User prompt (verbatim):** "Create a ticket for the last new code review comment,we'll address it later"

**Assistant interpretation:** Create a docmgr ticket capturing the newest PR #13 review comment as deferred follow-up work, without implementing the fix now.

**Inferred user intent:** Keep the new review issue tracked in the project documentation/task system so it can be handled in a later pass.

**Commit (code):** N/A — no code changed for this ticket creation step.

### What I did
- Queried PR #13 review comments with `gh api repos/wesen/2026-04-23--pyxis/pulls/13/comments --paginate`.
- Identified the latest new review comment: `Initialize GCal client before settings are enabled` on `pkg/server/server.go`.
- Created ticket `PYXIS-GCAL-INIT` with docmgr.
- Added an analysis document: `analysis/01-code-review-follow-up.md`.
- Added this diary document: `reference/01-investigation-diary.md`.
- Added tasks for implementing and validating the deferred fix.

### Why
- The comment describes a real runtime lifecycle gap: if the process starts with credentials but disabled DB settings, the current startup gate can skip client construction; later enabling settings may not work until restart.
- Capturing it as a ticket avoids losing the review context while deferring implementation.

### What worked
- The latest comment was discoverable via GitHub API.
- Docmgr created the ticket workspace and documents successfully.
- The analysis document now includes the review URL, verbatim comment, likely fix direction, acceptance criteria, and relevant files.

### What didn't work
- N/A.

### What I learned
- The new review concern is distinct from the previous stored-calendar-ID issue: it is about creating the client eagerly when credentials exist, even before settings are enabled.

### What was tricky to build
- The only subtlety was identifying the latest new comment among older comments that GitHub still associates with the latest commit. I used creation timestamps and the unique discussion URL `discussion_r3342315548` to select the actual new follow-up.

### What warrants a second pair of eyes
- Future implementation should carefully decide whether external-calendar reads should depend on `google_cal_enabled`, on enabled external calendar entries, or only on credentials/client availability.
- Future implementation should avoid reintroducing the previous bug where DB settings toggles do not affect runtime behavior until restart.

### What should be done in the future
- Implement the startup lifecycle fix in `pkg/server/server.go`.
- Add validation for enabling Google Calendar after startup without a process restart.

### Code review instructions
- Start with `pkg/server/server.go` around Google Calendar client initialization.
- Then inspect `pkg/service/show_service.go`, `pkg/gcal/client.go`, and `pkg/server/public.go` for operation-time settings checks.
- Validate with `GOWORK=off go test ./... -count=1`, `GOWORK=off make lint`, `GOWORK=off gosec ...`, and `GOWORK=off govulncheck ./...`.

### Technical details
- Review discussion: <https://github.com/wesen/2026-04-23--pyxis/pull/13#discussion_r3342315548>
- Review title: `Initialize GCal client before settings are enabled`
- Affected file: `pkg/server/server.go`
