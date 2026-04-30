---
DocType: tasks
Ticket: PYXIS-MAILCHIMP-MAILING-LIST
LastUpdated: 2026-04-29
---

# Tasks

## Phase 1: Backend Foundation

- [ ] 1.1 Create `pkg/mailchimp/client.go` with `Client` struct, `NewClient()`, `Subscribe()` method
- [ ] 1.2 Add unit tests using `httptest.NewServer` as a fake Mailchimp API
- [ ] 1.3 Add `MailchimpEnabled`, `MailchimpAPIKey`, `MailchimpListID` to `pkg/config/config.go`
- [ ] 1.4 Add `mailchimpClient` field to `Server` struct and initialize in `New()`
- [ ] 1.5 Add `POST /api/public/subscribe` route in `server.go`
- [ ] 1.6 Implement `handleSubscribe` handler in `public.go`
- [ ] 1.7 Add env vars to `.envrc.example`
- [ ] 1.8 Test with `curl` against local server

## Phase 2: Frontend Component

- [ ] 2.1 Create `MailingListSignup` component in `pyxis-components/src/molecules/`
- [ ] 2.2 Add CSS styles (BEM, matches design system)
- [ ] 2.3 Create Storybook stories (Default, Loading, Success, Error)
- [ ] 2.4 Export from `pyxis-components/src/index.ts`

## Phase 3: Frontend Integration

- [ ] 3.1 Add `useSubscribe` mutation hook to `pyxis-user-site/src/api/hooks.ts`
- [ ] 3.2 Add `<MailingListSignup />` to About page
- [ ] 3.3 (Optional) Add to footer or other pages
- [ ] 3.4 Full end-to-end test

## Phase 4: Polish & Deploy

- [ ] 4.1 Add rate limiting to subscribe handler
- [ ] 4.2 Configure Mailchimp secrets in production (K8s)
- [ ] 4.3 Deploy to staging and verify
- [ ] 4.4 Update ticket changelog
