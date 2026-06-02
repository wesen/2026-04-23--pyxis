---
Title: Investigation Diary
Ticket: HTML-DESIGN-TO-REACT-PLAYBOOK
Status: active
Topics:
  - frontend
  - react
  - storybook
  - visual-diff
  - design-system
  - automation
DocType: reference
Intent: long-term
Summary: Chronological diary for creating the HTML design to React workflow guide from Pyxis evidence.
---

# Investigation Diary

## 2026-05-01 — Ticket creation, evidence collection, and first guide

### What changed

Created docmgr ticket `HTML-DESIGN-TO-REACT-PLAYBOOK` to capture a reusable playbook for converting Claude-style HTML/JSX designs into production React sites.

Created documents:

- `design-doc/01-html-design-to-react-implementation-workflow-guide.md`
- `reference/02-pyxis-workflow-evidence-map.md`
- `reference/01-investigation-diary.md`

Created evidence script/database:

- `scripts/01-build-evidence-db.py`
- `various/evidence.sqlite`

### Commands run

```bash
docmgr status --summary-only

docmgr ticket create-ticket \
  --ticket HTML-DESIGN-TO-REACT-PLAYBOOK \
  --title "Convert HTML designs into production React sites" \
  --topics frontend,react,storybook,visual-diff,design-system,automation

docmgr doc add --ticket HTML-DESIGN-TO-REACT-PLAYBOOK --doc-type design-doc --title "HTML design to React implementation workflow guide"
docmgr doc add --ticket HTML-DESIGN-TO-REACT-PLAYBOOK --doc-type reference --title "Investigation diary"
docmgr doc add --ticket HTML-DESIGN-TO-REACT-PLAYBOOK --doc-type reference --title "Pyxis workflow evidence map"

find prototype-design -maxdepth 3 -type f | sort
find web/packages/pyxis-components/src -maxdepth 4 -type f | sort
find web/packages/pyxis-app/src -maxdepth 5 -type f | sort
find prototype-design/visual-diff/userland -maxdepth 3 -type f | sort
find ../corporate-headquarters/css-visual-diff -maxdepth 3 -type f | sort

python3 ttmp/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK--convert-html-designs-into-production-react-sites/scripts/01-build-evidence-db.py
sqlite3 ttmp/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK--convert-html-designs-into-production-react-sites/various/evidence.sqlite \
  "select package, layer, count(*), sum(has_story), sum(has_css) from components group by package, layer order by package, layer;"
```

### Evidence collected

Important source/doc areas inspected:

- `prototype-design/standalone/` for prototype browser baselines.
- `prototype-design/screens/*.jsx` and `prototype-design/lib/*.js` for original prototype structure.
- `prototype-design/visual-diff/userland/README.md` for Pyxis JS userland workflow.
- `../corporate-headquarters/css-visual-diff/README.md` for the current JavaScript-first tool direction and removal of native YAML manifest runner.
- `web/packages/pyxis-components/src` for reusable component taxonomy.
- `web/packages/pyxis-app/src` for staff-app atoms/molecules/organisms/pages.
- Pyxis tickets around screenshot extraction, Storybook catalogs, css-visual-diff JS userland, app React conversion, and public component taxonomy.

SQLite evidence snapshot:

```text
files indexed: 11151
docs indexed: 645
components indexed: 158
commits indexed: 476
```

Component summary query showed substantial component/story coverage in both `pyxis-components` and `pyxis-app`, which supports using Pyxis as the evidence base for the final workflow.

### What worked

- The existing Pyxis docs already contained strong distilled rules, especially the app end-to-end guide and CSS visual improvement loop.
- The current css-visual-diff README clearly settles the architecture question: project orchestration belongs in JavaScript verbs/scripts, not native YAML manifests.
- Line-referenced evidence was available for the key claims: standalone-page workflow, stable selectors, Storybook-driven decomposition, bottom-up tuning, compact artifact output, and stopping at review-band closeness.
- The SQLite evidence database made it easy to count component/story coverage and keep a reusable index for follow-up analysis.

### What did not work / obsolete paths found

- Early Pyxis native visual-diff configs still exist under `prototype-design/-deprecated/visual-diff-native-configs/`. They are useful historical evidence but should not be copied into new work.
- Some generated or built artifacts are numerous under `web/packages/*/dist` and Storybook static output. They should not be treated as source examples.
- The Pyxis history includes meandering tickets and old docs; the evidence map distinguishes current recommended documents from historical detours.

### What was tricky

- The ticket history is large. I limited the evidence map to tickets that directly explain prototype extraction, Storybook catalogs, css-visual-diff JS workflow, app React conversion, public taxonomy, and visual/mobile tuning.
- Some docmgr folders use `design`, some use `design-doc`, and older tickets use different doc-type paths. The evidence map names concrete files instead of relying on a single convention.
- The new guide had to be generic enough for future sites while still anchored to Pyxis file evidence.

### Code review instructions

Review the guide for:

1. Whether the workflow is clear enough for an intern who has not seen Pyxis.
2. Whether any command still implies the old native css-visual-diff YAML manifest runner.
3. Whether the CSS architecture guidance is sufficiently explicit about local ownership vs shared tokens.
4. Whether the selector contract examples are project-neutral enough for a new site.
5. Whether the implementation phases are actionable and not too Pyxis-specific.

### Next validation steps

- Run `docmgr doctor --ticket HTML-DESIGN-TO-REACT-PLAYBOOK --stale-after 30`.
- Relate the key source files/docs to the ticket.
- Upload the final bundle to reMarkable after doctor passes.

## 2026-05-01 — Validation and reMarkable delivery

### What changed

Validated the ticket with `docmgr doctor` and uploaded a bundled PDF to reMarkable.

### Commands run

```bash
docmgr vocab add --category topics --slug visual-diff --description "Visual diff and screenshot comparison workflows for frontend implementation"
docmgr vocab add --category topics --slug automation --description "Automation scripts, CLI workflows, and repeatable tooling"
docmgr doctor --ticket HTML-DESIGN-TO-REACT-PLAYBOOK --stale-after 30

remarquee status
remarquee cloud account --non-interactive
remarquee upload bundle --dry-run \
  design-doc/01-html-design-to-react-implementation-workflow-guide.md \
  reference/02-pyxis-workflow-evidence-map.md \
  reference/01-investigation-diary.md \
  --name "HTML Design to React Workflow Guide" \
  --remote-dir "/ai/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK" \
  --toc-depth 2

remarquee upload bundle \
  design-doc/01-html-design-to-react-implementation-workflow-guide.md \
  reference/02-pyxis-workflow-evidence-map.md \
  reference/01-investigation-diary.md \
  --name "HTML Design to React Workflow Guide" \
  --remote-dir "/ai/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK" \
  --toc-depth 2

remarquee cloud ls /ai/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK --long --non-interactive
```

### Results

- `docmgr doctor` passed: `✅ All checks passed`.
- `remarquee status` returned `remarquee: ok`.
- Dry-run upload succeeded.
- Real upload succeeded: `OK: uploaded HTML Design to React Workflow Guide.pdf -> /ai/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK`.
- Remote listing showed `[f] HTML Design to React Workflow Guide`.

### Issues

`docmgr doctor` initially warned that `visual-diff` and `automation` were unknown topics. I added them to `ttmp/vocabulary.yaml`, then doctor passed.

### Next steps

Use the guide as the starting playbook for the next HTML/JSX-to-React conversion and extend it with project-specific command snippets after the first new-site run.
