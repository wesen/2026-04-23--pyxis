---
Title: Pyxis app React diary
Ticket: PYXIS-APP-REACT
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - pyxis
  - rtk-query
DocType: reference
Intent: diary
Summary: Chronological diary for documenting and later implementing the pyxis-app React package workflow from full-app and mobile prototypes.
---

# Pyxis App React Diary

## Step 1: Create the pyxis-app React ticket

The user asked to create a new ticket for the broader Pyxis app React effort before writing the full end-to-end workflow guide.

### Prompt Context

**User prompt (verbatim):** "create a new ticket for pyxis-app react"

**Assistant interpretation:** Open a focused docmgr ticket for transforming the full-app and mobile prototypes into a modular, themable React package with Storybook, RTK Query, and JS-canonical visual-diff feedback.

**Inferred user intent:** Separate the broader application-package workflow/design effort from the narrower public-page tuning ticket.

### Created ticket

```text
PYXIS-APP-REACT
```

Workspace:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/
```

### Scope captured

This ticket will document and later guide:

- creating `web/packages/pyxis-app`,
- decomposing `prototype-design/standalone/full-app/index.html` and `prototype-design/standalone/mobile/index.html`,
- extracting atoms/molecules/organisms for shared and app-specific component systems,
- writing Storybook stories for each component layer,
- creating visual-suite manifests/specs and JS scripting around `css-visual-diff`,
- iterating bottom-up from components to app pages,
- reusing the current Pyxis JS visual-diff userland where possible.


## Step 2: Research current workflow and write the end-to-end guide

I studied the current standalone prototype layout, web package layout, Storybook patterns, RTK Query public-site implementation, playbooks, and JS-canonical css-visual-diff userland. I then wrote the first detailed intern-facing analysis/design/implementation guide for the `pyxis-app` React workflow.

### Prompt Context

**User prompt (verbatim excerpt):** "Ok, before we get too far into the details, we actually want to document our end to end workflow to transform pages into react themable modular rtk-query..."

**Assistant interpretation:** Before implementing the app package, capture a detailed, reusable workflow that explains the system, package architecture, decomposition strategy, Storybook and RTK Query patterns, visual spec reuse, and playbook updates.

**Inferred user intent:** Create a document that a new intern can follow without needing all prior context from the cleanup/public-site work.

### What I wrote

```text
design/01-pyxis-app-react-end-to-end-workflow-guide.md
```

The guide covers:

- current repository system map,
- existing full-app/mobile standalone prototype pages,
- proposed `web/packages/pyxis-app` architecture,
- package manifest sketch,
- component taxonomy,
- selector and theming contracts,
- RTK Query and `pyxis-types` data contracts,
- Storybook architecture on port 6008,
- JS/YAML visual suite reuse,
- proposed app component/page/mobile specs,
- bottom-up implementation phases,
- artifact history rules,
- playbooks that need updates,
- intern runbook,
- diagrams and definition of done.

### Research artifact

I also added a ticket-local inventory script and generated inventory:

```text
scripts/01-inventory-pyxis-app-sources.py
various/01-source-inventory.md
```

### Important observation

The full-app and mobile standalone index pages already exist:

```text
prototype-design/standalone/full-app/index.html
prototype-design/standalone/mobile/index.html
```

So the next implementation phase should validate and enrich those pages with stable selectors rather than recreate them from scratch.

### Reuse decision

The current JS userland can be reused immediately via `compare-spec` with new app specs. A future naming cleanup from `pyxis pages compare-spec` to `pyxis suites compare-spec` would be ergonomic, but not required for implementation.


## Step 3: Upload workflow guide to reMarkable

I uploaded the guide bundle to reMarkable after a successful dry run. The upload included the main workflow guide plus the source inventory so the reviewer can see both the recommended process and the file map behind it.

### Command dry run

```bash
remarquee upload bundle --dry-run \
  design/01-pyxis-app-react-end-to-end-workflow-guide.md \
  various/01-source-inventory.md \
  --name "PYXIS App React Workflow Guide" \
  --remote-dir "/ai/2026/04/25/PYXIS-APP-REACT" \
  --toc-depth 2
```

### Upload

```bash
remarquee upload bundle \
  design/01-pyxis-app-react-end-to-end-workflow-guide.md \
  various/01-source-inventory.md \
  --name "PYXIS App React Workflow Guide" \
  --remote-dir "/ai/2026/04/25/PYXIS-APP-REACT" \
  --toc-depth 2
```

Remote destination:

```text
/ai/2026/04/25/PYXIS-APP-REACT
```

Uploaded document:

```text
PYXIS App React Workflow Guide
```

### Notes

`remarquee` printed a non-fatal remote tree refresh warning, then reported a successful upload. `remarquee cloud ls` showed the uploaded document.
