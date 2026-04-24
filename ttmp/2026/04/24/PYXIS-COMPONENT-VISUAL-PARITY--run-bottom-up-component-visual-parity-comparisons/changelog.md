# Changelog

## 2026-04-24

- Initial workspace created


## 2026-04-24

Created bottom-up visual parity implementation guide covering baseline extraction, matching Storybook stories, css-visual-diff comparison modes, optional LLM review, repair loop, manifests, and first atom batches.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md — Primary analysis and implementation guide


## 2026-04-24

Iteration 1: added first atom parity map and Button primary comparison config; inspected both sides and ran capture/cssdiff/matched-styles/pixeldiff/html-report successfully with 0% pixel diff; noted output.dir relative-path pitfall.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/.gitignore — Ignore generated comparison outputs
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml — First runnable atom comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Initial hand-curated atom parity map


## 2026-04-24

Iteration 2: added Badge confirmed comparison, ran full deterministic modes, got 0% pixel diff, adjusted CSS prop list to avoid harmless auto-size width/height differences, and updated the guide with validated workflow corrections.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/atoms/badge-confirmed.css-visual-diff.yml — Second atom comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Updated accepted Button and Badge parity statuses
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md — Updated validated workflow notes


## 2026-04-24

Promoted atom comparison workflow to Tag default, Input search, and Select status. Tag and Select were already pixel-perfect; Input used visual/CSS diff feedback to align React sizing and icon markup with the prototype, reaching 0% pixel diff.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/04-storybook-component-capture-playbook.md — Playbook updated with validated comparison workflow notes
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/atoms/Input/Input.css — Input sizing and icon positioning aligned to prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/atoms/Input/Input.tsx — Input icon now uses a wrapper like the prototype


## 2026-04-24

Completed remaining AtomDiffFixture atom comparisons for Avatar, Icon, IconButton, and Textarea. Extended both prototype and Storybook atom fixtures for Textarea, fixed React Textarea CSS, and reached 0% pixel diff for all added atom configs.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Updated accepted remaining atom entries
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx — Added Textarea fixture row
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/atoms/Textarea/Textarea.css — Aligned Textarea sizing and typography to prototype


## 2026-04-24

Updated the implementation guide with final atom sweep results and moved next recommendation to molecule comparisons plus promoting the atom fixture prepare script to canonical prototype-design scripts.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md — Atom sweep results and next molecule recommendations


## 2026-04-24

Wrote end-of-week postmortem and next-developer handoff covering completed atom parity workflow, problems, lessons, current process, documentation consolidation recommendation, next steps, and tooling improvement ideas.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md — Postmortem and handoff document


## 2026-04-24

Expanded the postmortem into a textbook-style handoff chapter with conceptual foundations, validated workflow, atom sweep evidence, lessons, documentation consolidation plan, next-day quick start, and tooling improvement recommendations.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md — Expanded textbook-style postmortem handoff


## 2026-04-24

Attempted reMarkable upload of the expanded postmortem. Local PDF generation succeeded, but remarquee/rmapi upload failed with HTTP 400 even for a tiny test PDF; this is recorded as a tooling/environment issue to retry later.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Upload failure recorded
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md — Document intended for reMarkable upload


## 2026-04-24

Switched the parity workflow guidance from static Storybook builds served by Python to a live Storybook dev server in tmux; explained the parity map; promoted atom fixture script to a canonical path; added the first molecule fixture/config for Card default; ran the comparison successfully with 0.0000% pixel diff; wrote the canonical bottom-up parity playbook.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Canonical daily workflow playbook
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/atom-fixture-prepare.js — Canonical atom prototype fixture prepare script
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js — New molecule prototype fixture prepare script
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx — New Storybook molecule fixture
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml — First molecule comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Updated parity map with accepted Card default result
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 8 diary entry
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md — Updated handoff guidance


## 2026-04-24

Completed the recommended first molecule batch after Card by adding Field default, Field error, Stat default, and Empty with CTA fixture states/configs; repaired React Field, Stat, and Empty visual drift; all four new molecule comparisons now report 0.0000% pixel diff.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js — Added Field, Stat, and Empty fixture states
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx — Added matching Storybook molecule states
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/field-default.css-visual-diff.yml — Field default comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/field-error.css-visual-diff.yml — Field error comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/stat-default.css-visual-diff.yml — Stat default comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/empty-cta.css-visual-diff.yml — Empty with CTA comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/Field/Field.tsx — Aligned Field label/message spacing and typography with prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/Stat/Stat.tsx — Aligned Stat typography, spacing, shadow, and part attributes with prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/Empty/Empty.tsx — Aligned Empty state icon, spacing, typography, and action layout with prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Recorded accepted molecule results and accepted CSS differences
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Updated known-good molecule list
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 9 diary entry


## 2026-04-24

Committed the completed atom/molecule workflow as `731c88571405cca9749d78639bd66623002a05b4`, then started the organism layer with TopBar default. Added prototype and Storybook organism fixtures, added the TopBar comparison config, aligned React TopBar typography/spacing/parts to the prototype, and reached 0.0000% pixel diff.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js — New organism prototype fixture prepare script
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/organisms/OrganismDiffFixture.stories.tsx — New Storybook organism fixture
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/organisms/topbar-default.css-visual-diff.yml — TopBar organism comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/organisms/TopBar/TopBar.tsx — Aligned TopBar with prototype and added stable part selectors
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Recorded accepted TopBar organism result
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Updated known-good organism list
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 10 diary entry


## 2026-04-24

Wrote a detailed maintainer-facing report on `css-visual-diff llm-review` based on Pyxis TopBar experiments with GLM-5V, GPT-5 Nano, and GPT-5 Mini. The report documents evidence mismatch, prepared HTML pitfalls, CSS over-indexing, triptych misinterpretation, prompt-control gaps, and recommended tool improvements.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/03-css-visual-diff-llm-review-maintainer-report.md — Maintainer report for future `llm-review` improvements
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 11 diary entry


## 2026-04-24

Continued the main organism parity workflow with Modal default. Added prototype and Storybook Modal fixture states plus a Modal comparison config, aligned React Modal panel/header/body/footer styling toward the prototype, and recorded the result as needs-review: header/body are pixel-perfect, panel/footer still have localized residual diffs.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js — Added Modal default fixture state
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/organisms/OrganismDiffFixture.stories.tsx — Added matching Modal default Storybook state
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/organisms/modal-default.css-visual-diff.yml — Modal organism comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/organisms/Modal/Modal.tsx — Aligned Modal dimensions, backdrop, panel, header, body, footer styling toward prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Recorded Modal default as needs-review
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Updated organism status list with Modal follow-up state
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 12 diary entry


## 2026-04-24

Returned focus to molecule coverage rather than pixel-perfect tuning. Added missing molecule fixture states and comparison configs for CardHead default, LogRow default, and Table default. Ran each config through deterministic modes and recorded all three as needs-review in the parity map.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js — Added CardHead, LogRow, and Table fixture states
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx — Added matching Storybook molecule states
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/card-head-default.css-visual-diff.yml — CardHead comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/log-row-default.css-visual-diff.yml — LogRow comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/table-default.css-visual-diff.yml — Table comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Recorded new molecule targets as needs-review
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Updated wired-but-not-tuned molecule list
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 13 diary entry


## 2026-04-24

Reframed LogRow coverage to compare React LogRow against a hand-rendered prototype show-detail lineup row instead of the prototype audit/activity LogRow helper. Re-ran the LogRow comparison and kept it as needs-review for future taxonomy/styling decisions.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js — Updated LogRow prototype fixture to a show-detail lineup row
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/log-row-default.css-visual-diff.yml — Updated prototype root selector for lineup row fixture
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Updated LogRow notes and pixel result
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Clarified LogRow coverage status
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 14 diary entry


## 2026-04-24

Prepared the public-site component parity handoff and reorganized public Storybook story titles into `Public/Molecules/*` and `Public/Organisms/*` subdirectories. The handoff explains the public-domain ladder, recommended comparison order, fixture/config layout, and immediate next task.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/04-public-site-component-parity-handoff.md — Next-developer public-site parity handoff
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/AboutHero/AboutHero.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ArchiveStats/ArchiveStats.stories.tsx — Moved Storybook title under Public/Molecules
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/BookingForm/BookingForm.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/BookingRules/BookingRules.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/BookingSuccess/BookingSuccess.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/EthosStrip/EthosStrip.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/LineupRow/LineupRow.stories.tsx — Moved Storybook title under Public/Molecules
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/MailingListCTA/MailingListCTA.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PubFooter/PubFooter.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PubHero/PubHero.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PubNav/PubNav.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PubShowRow/PubShowRow.stories.tsx — Moved Storybook title under Public/Molecules
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/SpaceInfo/SpaceInfo.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/TicketStub/TicketStub.stories.tsx — Moved Storybook title under Public/Molecules
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/VenueCard/VenueCard.stories.tsx — Moved Storybook title under Public/Organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/YearGroup/YearGroup.stories.tsx — Moved Storybook title under Public/Molecules
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 15 diary entry


## 2026-04-24

Started public-site parity coverage by adding a dedicated public prototype fixture script, a Storybook public diff fixture, and five public molecule comparison configs. Ran typecheck and full css-visual-diff modes for all five targets; all have valid selector coverage and are recorded as needs-review.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js — New prototype fixture for public-site components
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx — New Storybook fixture for public-site components
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/molecules/lineup-row-default.css-visual-diff.yml — New public molecule comparison
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/molecules/ticket-stub-default.css-visual-diff.yml — New public molecule comparison
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/molecules/archive-stats-default.css-visual-diff.yml — New public molecule comparison
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/molecules/year-group-default.css-visual-diff.yml — New public molecule comparison
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/molecules/pub-show-row-default.css-visual-diff.yml — New public molecule comparison
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Added public molecule parity entries
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 16 diary entry


## 2026-04-24

Added broad public organism coverage for ten public section components. Diagnosed an apparent css-visual-diff hang as a recursive Storybook fixture bug caused by accidentally inserting fixture rows inside the `FixtureRow` helper. Fixed the fixture, reran typecheck, ran full visual-diff modes, and recorded all targets as needs-review.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx — Added public organism fixture states and fixed recursive render bug
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js — Added prototype public organism fixture states
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/about-hero-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-rules-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-success-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/ethos-strip-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/mailing-list-cta-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/pub-footer-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/pub-hero-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/pub-nav-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/space-info-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/venue-card-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Added public organism parity entries
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 17 diary entry


## 2026-04-24

Added public BookingForm workflow coverage as a separate public organism target. The comparison is valid and recorded as needs-review because the prototype uses public underline controls and a different field set from the React implementation.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx — Added BookingForm fixture state
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js — Added prototype booking form fixture state
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-form-default.css-visual-diff.yml — New comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Added BookingForm parity entry
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 18 diary entry



## 2026-04-24

Added missing public Shows poster/flyer components to React and covered them with visual parity configs. This fills the gap for `prototype-design/standalone/public/shows.html`, whose main design language is poster tiles and a poster grid.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/Poster/Poster.tsx — New public poster/flyer molecule
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ShowTile/ShowTile.tsx — New public show tile molecule
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ShowGrid/ShowGrid.tsx — New public show grid organism
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/Poster/Poster.stories.tsx — New Storybook coverage
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ShowTile/ShowTile.stories.tsx — New Storybook coverage
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ShowGrid/ShowGrid.stories.tsx — New Storybook coverage
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/index.ts — Exported new public components
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx — Added poster/tile/grid fixture states
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js — Added prototype poster/tile/grid fixture states
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/molecules/poster-redroom.css-visual-diff.yml — New parity config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/molecules/show-tile-redroom.css-visual-diff.yml — New parity config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public/organisms/show-grid-desktop.css-visual-diff.yml — New parity config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Added Poster, ShowTile, and ShowGrid entries
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 19 diary entry


## 2026-04-24

Added explicit task batches for the remaining standalone public-page design elements from detail/archive/book/about.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/tasks.md — Added public standalone page implementation batches
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Added Step 20 diary entry


## 2026-04-24

Implemented all remaining standalone public-page molecules/organisms from detail/archive/book/about and added visual parity coverage for each.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PublicPageHeader — New shared page header component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ReserveTicketCard — New detail-page ticket card component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ShowDetailHeader — New detail-page header component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ShowMetaStrip — New detail-page meta strip component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/SafetyNote — New detail-page safety note component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ArchiveSearchFilters — New archive filter component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ArchiveShowRow — New archive row component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ArchiveShowList — New archive list component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ShowTypeChips — New booking show-type chips component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/BookingSpaceAside — New booking space aside component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/SaferSpaceAgreement — New safer-space agreement component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/AboutIntro — New about intro component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/EthosGrid — New about ethos grid component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/CollectiveList — New collective list component
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/FindUsBlock — New find-us block component
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/public — Added 15 comparison configs
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Added 15 parity entries
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/tasks.md — Marked batches complete


## 2026-04-24

Tuned the first batch of public molecule/organism mismatches before moving to pages. Improved ArchiveStats, TicketStub, LineupRow, EthosStrip, BookingRules, VenueCard, and BookingSpaceAside comparisons and updated parity-map results.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/ArchiveStats/ArchiveStats.tsx — Flat public archive stat strip
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/TicketStub/TicketStub.tsx — Styled ticket card motif
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/LineupRow/LineupRow.tsx — Prototype-style lineup row layout
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/EthosStrip/EthosStrip.tsx — Light ethos grid motif
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/BookingRules/BookingRules.tsx — Dark booking aside motif
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/VenueCard/VenueCard.tsx — Dark venue aside motif
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js — Expanded BookingSpaceAside prototype fixture
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Updated tuned public comparison results


## 2026-04-24

Continued tuning public molecules/organisms before page-level comparisons. Improved AboutHero, SpaceInfo, MailingListCTA, PubHero, BookingForm, YearGroup, Poster, ShowTile, and CollectiveList comparisons; refreshed public parity-map pixel results and acceptance statuses for near-exact targets.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/AboutHero/AboutHero.tsx — Prototype-style about header/intro
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/SpaceInfo/SpaceInfo.tsx — Smaller find-us/contact block
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/MailingListCTA/MailingListCTA.tsx — Plain public CTA motif
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PubHero/PubHero.tsx — Simple public hero motif
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/BookingForm/BookingForm.tsx — Prototype underline-control form shape
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/YearGroup/YearGroup.tsx — Prototype year header
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/Poster/Poster.tsx — Closer redroom poster details
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx — Adjusted YearGroup fixture
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Refreshed public comparison stats/statuses
