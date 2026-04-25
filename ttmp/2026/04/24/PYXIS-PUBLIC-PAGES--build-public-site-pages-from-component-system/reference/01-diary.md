---
Title: Public site page build diary
Ticket: PYXIS-PUBLIC-PAGES
Status: active
Topics:
  - frontend
  - react
  - storybook
  - visual-diff
  - pyxis
DocType: reference
Intent: long-term
Summary: Chronological diary for building Pyxis public site pages from the component system.
LastUpdated: 2026-04-24T00:00:00Z
---

# Public Site Page Build Diary

## Step 1: Ticket creation and implementation guide

### What happened

Created a new docmgr ticket for building the public site pages from the stabilized component system:

```text
PYXIS-PUBLIC-PAGES
```

The ticket starts after the RTK/types/theming migration ticket was closed. The prior ticket established:

- `pyxis-types` shared domain/API types,
- RTK Query in `pyxis-user-site`,
- Storybook page stories wired through Redux Provider and MSW,
- extracted public component CSS and data-pyxis part selectors,
- theming and taxonomy ADRs.

### Documents created

```text
design/01-public-site-page-build-analysis-design-implementation-guide.md
tasks.md
reference/01-diary.md
```

### Key direction

Use the same iterative parity approach as component work, but now at page level:

```text
canonical public components → page sections → user-site Storybook stories on :6007 → page-level css-visual-diff configs → tuning/acceptance
```

### Important warning for future work

Current `pyxis-user-site` pages still contain page-local inline styles and some older/deferred component choices (`PubShowRow`, `SpaceInfo`, `EthosStrip`). The next implementation work should replace those with canonical components where the standalone baselines support it.


## Step 2: Validation and reMarkable upload

### Commands

```bash
docmgr doc relate --ticket PYXIS-PUBLIC-PAGES ...
docmgr doctor --ticket PYXIS-PUBLIC-PAGES --stale-after 30
remarquee status
remarquee upload bundle --dry-run ... --name "PYXIS Public Pages Build Guide" --remote-dir "/ai/2026/04/24/PYXIS-PUBLIC-PAGES" --toc-depth 2
remarquee upload bundle ... --name "PYXIS Public Pages Build Guide" --remote-dir "/ai/2026/04/24/PYXIS-PUBLIC-PAGES" --toc-depth 2
remarquee cloud ls /ai/2026/04/24/PYXIS-PUBLIC-PAGES --long --non-interactive
```

### Result

The bundle uploaded successfully to reMarkable:

```text
/ai/2026/04/24/PYXIS-PUBLIC-PAGES/PYXIS Public Pages Build Guide
```

### Warning

`docmgr doctor` reports unknown topic vocabulary values because this repository's seeded vocabulary currently only knows `chat`, `backend`, and `websocket`. The ticket topics are still meaningful and match the frontend work.
