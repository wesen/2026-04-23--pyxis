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
LastUpdated: 2026-04-27T21:55:00-04:00
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

## Step 3: Fix the mobile Shows Storybook baseline before comparing Vite

The user pointed out that mobile Shows was not just off in Vite; the Storybook mobile story itself was completely off. I switched back to the Storybook-first mobile workflow.

### Initial Storybook-first mobile evidence

Command pattern:

```bash
PAGE=shows scripts/01-compare-public-render-targets.sh prototype-storybook shows-list /tmp/pyxis-proto-storybook-shows-shows-list-mobile-off mobile
```

Initial results:

```text
prototype-storybook mobile page        63.31%
prototype-storybook mobile content     67.33%
prototype-storybook mobile header      24.77%
prototype-storybook mobile shows-list  77.46%
```

The screenshots made the problem obvious: the prototype mobile page was a single-column poster list, but the Storybook mobile story still rendered the Shows grid as a three-column desktop grid. It also rendered nine shows, while the standalone mobile prototype renders `P_SHOWS.slice(0, 6)`.

### Changes

1. Added mobile responsive grid CSS in:

```text
web/packages/pyxis-components/src/public/organisms/ShowGrid/ShowGrid.css
```

`ShowGrid` now switches to one column at `max-width: 640px`.

2. Added mobile-specific Storybook handlers in:

```text
web/packages/pyxis-user-site/src/pages/storybook.tsx
web/packages/pyxis-user-site/src/pages/ShowsPage/Page.stories.tsx
```

The Shows mobile story now uses `prototypeShows.slice(0, 6)`, matching the standalone mobile prototype.

3. Added mobile `PublicPageHeader` sizing in:

```text
web/packages/pyxis-components/src/public/molecules/PublicPageHeader/PublicPageHeader.css
```

4. Aligned Shows mobile top spacing and mailing-list gap in:

```text
web/packages/pyxis-user-site/src/pages/ShowsPage/Page.css
```

### Results after Storybook mobile baseline fix

Focused prototype-vs-Storybook mobile comparisons:

```text
prototype-storybook mobile shows-list  16.71%  (down from 77.46%)
prototype-storybook mobile content     14.83%  (down from 67.33%)
prototype-storybook mobile page        17.21%  (down from 63.31%)
prototype-storybook mobile mailing-list 16.93%
prototype-storybook mobile mailing-title/form/input/button remain aligned from Step 2
```

The remaining broad `shows-list` delta is no longer a structural failure. The Storybook screenshot is now the correct single-column six-show mobile composition. The remaining delta is mostly poster/text rendering and global text metadata differences. We should continue to compare deeper tiles or poster subparts rather than treating the whole mobile Shows list as a precise target.

Representative artifact paths:

```text
/tmp/pyxis-proto-storybook-shows-shows-list-mobile-after-spacing/url1_screenshot.png
/tmp/pyxis-proto-storybook-shows-shows-list-mobile-after-spacing/url2_screenshot.png
/tmp/pyxis-proto-storybook-shows-shows-list-mobile-after-spacing/diff_only.png
```

### Vite note

After fixing the Storybook mobile baseline, `vite-storybook mobile shows-list` is still high because Vite is using live backend data while Storybook is using prototype fixture data. That is a different question from whether the mobile story matches the original. For visual tuning, use Storybook-first to tune the component/page fixture, then use Vite-vs-Storybook only after the Vite data is intentionally aligned or when comparing deep subparts that are data-insensitive.

## Step 4: Implement functional mobile hamburger menu

The standalone mobile prototype has a hamburger icon only; it does not define an opened-menu design. The real Vite public site needed this handled because the public top-level nav must be usable on mobile.

### Design interpretation

I kept the closed state aligned with the prototype:

- nav height: `52px`
- horizontal padding: `18px`
- logo size: `22px`
- three-line hamburger icon on the right

For the open state, I added a minimal accessible drop-down panel using existing nav styling and tokens. This is intentionally conservative because no full mobile menu visual spec exists yet.

### Changes

Updated:

```text
web/packages/pyxis-components/src/public/organisms/PubNav/PubNav.tsx
web/packages/pyxis-components/src/public/organisms/PubNav/PubNav.css
```

Behavior:

- desktop nav links remain visible above `640px`;
- mobile hides desktop links and shows the hamburger button;
- hamburger toggles a mobile nav panel;
- button uses `aria-expanded` and `aria-controls`;
- selecting a mobile link calls the existing `onNavigate` callback and closes the panel.

### Validation

Manual browser check on `http://localhost:3007/` at `390x844`:

- closed mobile nav shows logo + hamburger only;
- opening the hamburger shows `Shows`, `Archive`, `Book us`, `About`;
- clicking `Archive` navigates to `/archive` and closes via route change/remount.

Build/type/doc validation passed:

```bash
cd web/packages/pyxis-components && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec vite build
docmgr doctor --ticket PYXIS-PUBLIC-VISUAL-MOBILE-TUNING --stale-after 30
```

### Note

When first checking this in the live Vite server, the `PubNav.css` module had been transformed as an empty CSS module due to stale Vite state. Restarting the `pyxis-user-site-vite` tmux session fixed it. This matches the earlier known nuisance that Vite/Storybook stale CSS transforms can produce misleading screenshots.

## Step 5: Continue mobile pass and fix comparison wrapper page scoping

I continued the Storybook-first mobile pass after the hamburger menu work. The first attempt to compare `archive`, `book`, `about`, and `show-detail` content exposed a tooling bug in the ticket-local comparison wrapper: its generic `content` selector was still hardcoded to `[data-page='shows']`.

### Fix

Updated:

```text
scripts/01-compare-public-render-targets.sh
```

The script now maps each `PAGE` to:

- the correct standalone prototype file stem;
- the correct Storybook page ID;
- the correct Vite route;
- the correct `data-page` selector;
- the most likely page header section selector.

This matters because missing selectors in broad visual commands can look like browser hangs or empty artifact folders. The fix keeps the wrapper useful for the rest of the mobile pass.

### Follow-up scan after wrapper fix

Storybook-first mobile `content` scans now run for all remaining public pages:

```text
prototype-storybook archive mobile content      10.30%
prototype-storybook book mobile content         19.33%
prototype-storybook about mobile content        16.41%
prototype-storybook show-detail mobile content  15.47%
```

These broad content numbers are still too coarse for tuning decisions. The screenshots show that some prototype selectors include shell/nav area differently from the React page body, so the next iteration should select page-specific internal sections: archive filters/year rows, book form/sidebar, about intro/ethos/find-us, and show-detail ticket/meta/lineup.

## Step 6: Publish visual coverage rundown for operator inspection

The user asked for a published rundown similar to the earlier final sweep artifacts at:

```text
/tmp/pyxis-public-pages-final-sweep
/tmp/pyxis-public-pages-final-sweep.json
```

I added a ticket-local publisher script:

```text
scripts/02-build-public-visual-coverage-rundown.py
```

This does not run screenshots. It publishes a coverage map that lists pages, elements, selectors, render pairs, viewport coverage, priority, and current status. The goal is to make it easy to inspect what still needs targeted css-visual-diff coverage before running more expensive or noisy comparisons.

### Published artifacts

```text
/tmp/pyxis-public-visual-coverage-rundown/index.html
/tmp/pyxis-public-visual-coverage-rundown.json
```

Served locally at:

```text
http://localhost:8099/
```

Port `8098` was already occupied by an unrelated review app, so I used `8099`.

### Coverage summary

The generated JSON currently covers:

```text
shows          8 elements
show-detail    7 elements
archive        5 elements
book           6 elements
book-success   1 element
about          5 elements
global-footer  1 element
```

Status counts:

```text
covered-partial: 1
needs-design-review: 1
needs-focused-review: 1
covered-broad-noisy: 1
needs-deep-coverage: 4
covered: 2
needs-coverage: 22
needs-story-coverage: 1
```

This rundown is intentionally not a replacement for `css-visual-diff`; it is the review map for deciding the next focused comparisons.

### Compatibility correction for coverage rundown

The first coverage rundown used a custom JSON shape and did not export image artifacts. That was not compatible with the previous `/tmp/pyxis-public-pages-final-sweep.json` format or the review-site generator.

I added a compatibility publisher:

```text
scripts/03-build-compatible-coverage-sweep.py
```

It emits the same top-level shape as the previous css-visual-diff summary:

```text
[
  {
    classificationCounts,
    jsonPath,
    markdownPath,
    maxChangedPercent,
    pageCount,
    sectionCount,
    policy,
    rows: [...]
  }
]
```

Each row includes the expected artifact paths:

```text
leftRegionPath
rightRegionPath
diffOnlyPath
diffComparisonPath
artifactJson
artifactMarkdown
```

Because this is a coverage rundown rather than a screenshot diff run, the generated PNGs are labeled coverage cards. They are intentionally image artifacts so the previous HTML review generator can consume and display them.

Published compatibility artifacts:

```text
/tmp/pyxis-public-visual-coverage-rundown/index.html
/tmp/pyxis-public-visual-coverage-rundown.json
/tmp/pyxis-public-visual-coverage-rundown/summary.json
/tmp/pyxis-public-visual-coverage-rundown/*/artifacts/*/{left_region,right_region,diff_only,diff_comparison}.png
```

I verified compatibility by running the previous review-site generator:

```bash
python3 ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/scripts/05-build-public-pages-review.py \
  --summary-json /tmp/pyxis-public-visual-coverage-rundown.json \
  --output-dir /tmp/pyxis-public-visual-coverage-review-compatible
```

It succeeded and produced:

```text
/tmp/pyxis-public-visual-coverage-review-compatible/index.html
```

Served at:

```text
http://localhost:8100/
```

## Step 7: Replace coverage cards with actual mobile screenshots

The user clarified that the compatibility coverage cards were not the desired output. They wanted actual screenshots of the mobile pages/elements in the same previous sweep/review format.

I added:

```text
scripts/04-run-actual-mobile-visual-sweep.py
```

This script runs real `css-visual-diff compare` captures against mobile standalone prototype pages and mobile Storybook stories. It emits the same previous summary JSON shape and writes real screenshot artifacts.

### Published actual mobile sweep

```text
/tmp/pyxis-public-mobile-actual-sweep
/tmp/pyxis-public-mobile-actual-sweep.json
/tmp/pyxis-public-mobile-actual-sweep/summary.json
/tmp/pyxis-public-mobile-actual-sweep/failures.json
```

The successful rows include real image artifacts:

```text
left_region.png       # prototype screenshot
right_region.png      # Storybook screenshot
diff_only.png         # real pixel diff
diff_comparison.png   # real triptych from css-visual-diff
compare.json
compare.md
```

I also verified it with the previous review-site generator and published:

```text
/tmp/pyxis-public-mobile-actual-review/index.html
```

Served at:

```text
http://localhost:8101/
```

### Result summary

The actual mobile sweep attempted 23 targets. It published 15 successful actual screenshot rows and recorded 8 selector failures in `failures.json`.

Successful row classes:

```text
tune-required: 12
review: 1
accepted: 2
```

The failures were deeper selectors that are not present with the same attributes on the standalone prototype side. I excluded failed rows from the review JSON so the review bundle shows real screenshots only, not placeholder/error cards.

### Correction: hide prototype nav for content/section captures

The user noticed that the prototype `content` captures included the mobile `ppxis` navbar/hamburger, while the React content captures did not. That made the review screenshots misleading.

Root cause: the standalone prototype nav is `position: sticky`; when css-visual-diff captured the `main[data-page=...]` element, the sticky header could still overlap the clipped region.

Fix:

- Added `?hideNav=1` support to `prototype-design/screens/ppxis.jsx`.
- Updated `scripts/01-compare-public-render-targets.sh` and `scripts/04-run-actual-mobile-visual-sweep.py` so non-`page` captures append `?hideNav=1` to prototype URLs.
- Left `page` captures unchanged, because whole-page comparisons should still include nav.

Regenerated actual mobile artifacts:

```text
/tmp/pyxis-public-mobile-actual-sweep.json
/tmp/pyxis-public-mobile-actual-sweep
/tmp/pyxis-public-mobile-actual-review/index.html
```

Served review bundle:

```text
http://localhost:8101/
```

Verified manually that `book/content` prototype screenshot no longer includes the top nav.

## Step 8: End-of-day issue capture and shutdown plan

The operator reported a final set of concrete production/public-site issues to carry into the next session:

1. Archive page date selector and recap controls do not work.
2. Booking page returns `links are required` when filling out/submitting the form.
3. Archive metrics show `95 artists`, which seems implausibly high.
4. Discord link should be live.
5. Mobile hamburger menu should overlay content instead of pushing content down.

I captured these in a dedicated implementation guide:

```text
design/01-public-mobile-functional-polish-implementation-guide.md
```

I also added Phase 6 tasks T24–T29 to `tasks.md` so the next session can start with a clear functional polish checklist.

### State at stop

Useful published review artifacts for next time:

```text
http://localhost:8101/
/tmp/pyxis-public-mobile-actual-review/index.html
/tmp/pyxis-public-mobile-actual-sweep.json
/tmp/pyxis-public-mobile-actual-sweep/failures.json
```

Latest relevant commits before shutdown:

```text
d0a5d94 PYXIS-PUBLIC-VISUAL-MOBILE-TUNING: hide prototype nav for section captures
5e65659 PYXIS-PUBLIC-VISUAL-MOBILE-TUNING: publish actual mobile screenshot sweep
ad0bda7 PYXIS-PUBLIC-VISUAL-MOBILE-TUNING: add mobile hamburger menu
```

Next session should start with T24 (hamburger overlay) and T25 (Discord link), then handle the booking form validation blocker.

## Step 9: Functional polish implementation pass

I resumed with the Phase 6 public-site issues from the operator review.

### Hamburger overlay

Changed:

```text
web/packages/pyxis-components/src/public/organisms/PubNav/PubNav.css
```

The mobile menu is now absolutely positioned below the sticky nav instead of participating in normal document flow. This keeps the content underneath stationary while the menu opens as an overlay.

Smoke command:

```bash
cd web/packages/pyxis-user-site && node - <<'NODE'
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3007/', { waitUntil: 'networkidle' });
  const before = await page.locator('[data-region="main"]').boundingBox();
  await page.getByRole('button', { name: /open navigation menu/i }).click();
  const after = await page.locator('[data-region="main"]').boundingBox();
  const menu = await page.locator('#pyxis-pub-nav-mobile-menu').boundingBox();
  console.log(JSON.stringify({ beforeY: before.y, afterY: after.y, menuY: menu.y, menuH: menu.height }, null, 2));
  await browser.close();
})();
NODE
```

Result:

```json
{
  "beforeY": 53,
  "afterY": 53,
  "menuY": 52,
  "menuH": 183
}
```

### Live footer links

Changed:

```text
web/packages/pyxis-components/src/public/organisms/PubFooter/PubFooter.tsx
web/packages/pyxis-user-site/src/components/layout/Layout.tsx
```

The footer no longer renders `href="#"` for Discord. `PubFooter` now accepts link props, and the public app passes environment-configurable URLs:

```text
VITE_DISCORD_URL
VITE_INSTAGRAM_URL
```

Fallbacks are provided so local Vite still renders live links.

Smoke result on `http://localhost:3007/about`:

```json
[
  { "text": "Instagram", "href": "https://www.instagram.com/ppxis.space/" },
  { "text": "Discord", "href": "https://discord.com/channels/586274407350272042" },
  { "text": "Mailing list", "href": "http://localhost:3007/about#mailing-list" }
]
```

### Booking links validation

Changed:

```text
web/packages/pyxis-user-site/src/pages/BookPage/Page.tsx
```

The production public booking page no longer hides the required `links` field. It now uses the default BookingForm client-side validation, so a user cannot submit a server-bound request without artist/project links.

Smoke result on `http://localhost:3007/book`:

```json
{
  "linksVisible": true,
  "submitDisabledBefore": true,
  "submitDisabledNoLinks": true,
  "submitDisabledWithLinks": false
}
```

### Archive selector and recap

Changed:

```text
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
```

Year buttons now have `type="button"`, `aria-pressed`, and an `onYearChange` callback. The Archive page owns `selectedYear` state, computes available years from the loaded archive rows, filters the visible groups, and renders a recap label such as `2 shows in 2025`.

Smoke result on `http://localhost:3007/archive`:

```json
{
  "buttons": ["All", "2025"],
  "before": "2 shows",
  "after": "2 shows in 2025"
}
```

### Archive metrics labels

Changed:

```text
web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.tsx
```

The `95 artists` issue was caused by rendering `totalAttendance` under the label `artists`. The metrics now render:

- `totalShows` → `shows`
- `uniqueArtists` → `artists`
- `yearsRunning` → `years running`
- `totalAttendance` → `total draw`

Smoke result on the local archive page:

```json
[
  "2 SHOWS",
  "2 ARTISTS",
  "1 YEARS RUNNING",
  "95 TOTAL DRAW"
]
```

### Validation

Commands passed:

```bash
cd web/packages/pyxis-components && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec vite build
go test ./... -count=1
```

## Step 10: Archive recap click-through fix

The operator clarified that clicking `recap →` on archive rows still did not work. The answer was yes: the public app had an Archive index page, but no route/page for an individual archived show recap. `ArchiveShowRow` also defaulted to `href="#"`, and `ArchiveShowList` did not carry a link through its row type.

Implemented a lightweight public recap route:

```text
/archive/:id
```

Changed:

```text
web/packages/pyxis-components/src/public/molecules/ArchiveShowList/ArchiveShowList.tsx
web/packages/pyxis-user-site/src/App.tsx
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.css
```

The first version uses the existing archive list payload to find the archived show by ID, because the backend does not yet expose a dedicated public archived-show-detail endpoint. It renders artist, date, genre, and draw recap if available. This is enough to make `recap →` live without expanding the API contract yet.

Smoke command:

```bash
cd web/packages/pyxis-user-site && node - <<'NODE'
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3007/archive', { waitUntil: 'networkidle' });
  const href = await page.locator('[data-pyxis-component="archive-show-row"]').first().getAttribute('href');
  await page.locator('[data-pyxis-component="archive-show-row"]').first().click();
  await page.waitForURL(/\/archive\/\d+/);
  const title = await page.locator('[data-pyxis-component="public-page-header"][data-pyxis-part="title"]').innerText();
  console.log(JSON.stringify({ href, url: page.url(), title }, null, 2));
  await browser.close();
})();
NODE
```

Result:

```json
{
  "href": "/archive/5",
  "url": "http://localhost:3007/archive/5",
  "title": "Planning for Burial"
}
```

Validation:

```bash
cd web/packages/pyxis-components && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
```

### Correction: archive recap links should use React Router navigation

The operator noticed that `recap →` appeared to reload the full page. The route existed, but `ArchiveShowRow` rendered a normal anchor, so same-origin navigation still went through browser document navigation instead of React Router.

Fix:

- `ArchiveShowRow` now accepts `onNavigate` and intercepts unmodified left-clicks.
- `ArchiveShowList` forwards `onNavigate` to each row.
- `ArchivePageView` passes React Router `navigate` into `ArchiveShowList`.
- Modified clicks such as cmd/ctrl-click still fall through to normal anchor behavior.

Changed:

```text
web/packages/pyxis-components/src/public/molecules/ArchiveShowRow/ArchiveShowRow.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveShowList/ArchiveShowList.tsx
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
```

Validation:

```bash
cd web/packages/pyxis-components && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
```

Browser smoke confirmed no document request after clicking the first archive row:

```json
{
  "url": "http://localhost:3007/archive/5",
  "documentRequestsAfterClick": []
}
```
