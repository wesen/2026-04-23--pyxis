---
Title: Public Site Visual + Mobile Tuning Diary
Ticket: PYXIS-PUBLIC-VISUAL-MOBILE-TUNING
Status: active
Topics:
  - frontend
  - public-site
DocType: reference
Intent: diary
Summary: Chronological diary for public-site visual tuning across Vite, Storybook, standalone prototype, desktop, and mobile.
LastUpdated: 2026-04-27T20:55:00-04:00
---

# Public Site Visual + Mobile Tuning Diary

## Step 1: Create the ticket and recover the known css-visual-diff loop

The ticket was created after public-site manual QA found three related problems:

1. `localhost:18086` did not look like the Storybook page.
2. The public nav buttons were visually clickable but did not navigate.
3. The `Reserve ticket` button was visually clickable but did not perform an action.

Before this ticket, we fixed the production SPA wiring defects:

- `web/packages/pyxis-user-site/src/components/layout/Layout.tsx` now passes `onNavigate` to `PubNav`.
- `ReserveTicketCard` now accepts `onReserve`.
- `ShowDetailPage` wires `Reserve ticket` to a mailto fallback.
- `make dev` now starts three tmux sessions: backend on `8080`, staff Vite on `3008`, and public Vite on `3007`.

This ticket exists because the next work is broader and should be measured systematically rather than patched by eye.

### Important clarification

There are three different public-site render targets:

- **Prototype original:** `http://localhost:7070/standalone/public/*.html`
- **Storybook page stories:** `http://localhost:6007/iframe.html?id=public-site-pages-shows--desktop&viewMode=story`
- **Live Vite public app:** `http://localhost:3007/`

`localhost:18086` is a fourth target: the static embedded production bundle. It is useful for release validation, but during visual tuning it can be stale unless `go run ./cmd/build-web` or `make build-embed` was just run.

### Recovered css-visual-diff loop from previous diary/runbooks

The prior visual-tuning ticket and playbooks say to use narrow comparisons first, inspect artifacts first, and avoid broad suite output until the focused mismatch is understood.

Canonical docs consulted:

- `docs/playbooks/10-css-visual-diff-verb-operator-guide.md`
- `docs/playbooks/09-pyxis-app-visual-tuning-runbook.md`
- `ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/reference/05-public-pages-review-site-analysis-and-guide.md`

The operational loop is:

1. Start the needed servers in tmux.
2. Compare one section, not the full suite.
3. Inspect `diff_only.png` first.
4. Inspect `right_region.png` second.
5. Inspect `left_region.png` third.
6. Use JSON/style diffs only to answer a specific question.
7. Make one CSS/component/data alignment change.
8. Re-run the same narrow comparison.
9. Record command, result, artifact paths, and decision in this diary.

For the known Storybook-vs-prototype Shows page, the existing command is:

```bash
OUT=/tmp/pyxis-user-shows-mailing-list-tune
rm -rf "$OUT"
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page shows \
  --section mailing-list \
  --outDir "$OUT" \
  --summary \
  --output json \
  > "$OUT/summary.json"
```

The artifact paths are then:

```text
/tmp/pyxis-user-shows-mailing-list-tune/shows/artifacts/mailing-list/diff_only.png
/tmp/pyxis-user-shows-mailing-list-tune/shows/artifacts/mailing-list/right_region.png
/tmp/pyxis-user-shows-mailing-list-tune/shows/artifacts/mailing-list/left_region.png
```

### Gap found in the current tooling

The existing public page spec compares prototype vs Storybook. It does not yet compare:

- Vite public app (`localhost:3007`) vs Storybook (`localhost:6007`), or
- Vite public app (`localhost:3007`) vs prototype (`localhost:7070`).

That gap matters because the current user feedback is specifically:

> `http://localhost:3007/` vs `http://localhost:6007/?path=/story/public-site-pages-shows--desktop&globals=viewport:pyxisDesktop`

The next task should add a ticket-local exploratory spec or wrapper script for Vite-vs-Storybook and Vite-vs-prototype comparisons before doing CSS edits. The script should live in this ticket's `scripts/` directory and emit compact rows plus artifact paths.

### Server state at ticket creation

`make dev` was already run successfully. At the time of ticket creation:

- public Vite was available at `http://localhost:3007`
- pyxis-user-site Storybook was available at `http://localhost:6007`
- prototype server on `localhost:7070` was not running and must be started for prototype comparisons


## Step 2: Add focused Vite/Storybook/prototype compare wrapper and tune mailing-list token drift

The user clarified two important operating rules:

1. Poster rows are expected to differ, so broad Shows-page comparisons are too noisy. Select deeper, especially the `mailing-list` subparts.
2. For mobile, compare Storybook against the prototype first before judging Vite, because the component/page story is the intended React reference.

### Tooling added

Added ticket-local script:

```text
ttmp/2026/04/27/PYXIS-PUBLIC-VISUAL-MOBILE-TUNING--tune-public-site-visual-parity-across-vite-storybook-prototype-and-mobile/scripts/01-compare-public-render-targets.sh
```

It supports pairs:

- `prototype-storybook`
- `vite-storybook`
- `prototype-vite`

It supports desktop/mobile and deeper selectors:

- `mailing-list`
- `mailing-title`
- `mailing-description`
- `mailing-form`
- `mailing-input`
- `mailing-button`

It now prints changed percent, selector context, artifact paths, and computed CSS diffs for typography/layout properties.

### Initial finding

The live Vite app and Storybook were not actually using the same token set. Storybook loaded:

```text
web/packages/pyxis-components/src/tokens/tokens.css
```

but the Vite app only loaded the duplicated `pyxis-user-site/src/styles/global.css`. That duplicate did not define variables such as:

- `--space-2`
- `--weight-medium`

Because `MailingListCTA.css` uses those variables, Vite dropped declarations such as `font-weight: var(--weight-medium)` and `margin: 0 0 var(--space-2)` while Storybook rendered them correctly. This explained why the same component looked different in Vite and Storybook.

### Fix

Updated:

```text
web/packages/pyxis-user-site/src/main.tsx
```

to import component tokens after global CSS, matching Storybook's effective token availability:

```ts
import './styles/global.css';
import 'pyxis-components/tokens/tokens.css';
```

Then tuned mobile-only mailing-list details:

```text
web/packages/pyxis-user-site/src/pages/PublicPage.css
web/packages/pyxis-components/src/public/organisms/MailingListCTA/MailingListCTA.css
```

Changes:

- mobile page inner padding changed from `24px` to `18px` to match the standalone mobile prototype content width;
- mobile mailing-list title changed to `22px` and `line-height: normal` to match prototype text bounds.

### Focused comparison results

Final focused subpart comparisons after the token import and mobile tune:

```text
vite-storybook desktop mailing-title   0%
vite-storybook desktop mailing-form    0%
vite-storybook desktop mailing-input   0%
vite-storybook desktop mailing-button  0%

vite-storybook mobile mailing-title    0%
vite-storybook mobile mailing-form     0%
vite-storybook mobile mailing-input    0%
vite-storybook mobile mailing-button   0%

prototype-storybook desktop mailing-form    0%
prototype-storybook desktop mailing-input   0%
prototype-storybook desktop mailing-button  0%
prototype-storybook desktop mailing-title   3.8149% (font antialias / line-height metadata only)

prototype-storybook mobile mailing-title    0%
prototype-storybook mobile mailing-form     0%
prototype-storybook mobile mailing-input    0%
prototype-storybook mobile mailing-button   0%
```

Remaining broad `mailing-list` container diffs are still higher in mobile because the whole section's vertical position is affected by upstream Shows-list/poster differences. This is expected for now; the deeper subparts prove the email form and typography are aligned.

### Representative artifact paths

```text
/tmp/pyxis-prototype-storybook-mailing-title-mobile-final/diff_only.png
/tmp/pyxis-prototype-storybook-mailing-form-mobile-final/diff_only.png
/tmp/pyxis-vite-storybook-mailing-title-mobile-final/diff_only.png
/tmp/pyxis-vite-storybook-mailing-form-mobile-final/diff_only.png
```

Note: the exact `/tmp` run folders are ephemeral; rerun the script to regenerate them.
