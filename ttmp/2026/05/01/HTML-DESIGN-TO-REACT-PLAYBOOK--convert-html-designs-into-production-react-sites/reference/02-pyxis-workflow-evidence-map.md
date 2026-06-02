---
Title: Pyxis Workflow Evidence Map
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
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/design/01-pyxis-app-react-end-to-end-workflow-guide.md
      Note: Prior Pyxis app conversion workflow distilled into this playbook
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/playbooks/02-pyxis-app-css-visual-improvement-loop.md
      Note: Prior Pyxis CSS visual tuning loop distilled into this playbook
    - Path: ttmp/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK--convert-html-designs-into-production-react-sites/various/evidence.sqlite
      Note: SQLite cross-correlation index of source
ExternalSources: []
Summary: Where to look in Pyxis for evidence about converting Claude-style HTML/JSX prototypes into React packages, Storybook catalogs, and css-visual-diff visual tuning loops.
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Pyxis Workflow Evidence Map

## Goal

Use this map before starting a new HTML/JSX-to-React conversion. Pyxis was the first large project that exercised this workflow, so the history contains both useful patterns and obsolete detours. The current recommended path is based on the later Pyxis outcomes: standalone prototype pages, typed React component taxonomy, colocated Storybook stories, stable selector contracts, and JavaScript-first `css-visual-diff` userland scripts.

## Context

Pyxis began with Claude-style prototype JSX under `prototype-design/`, then gradually became:

```text
prototype HTML/JSX
  -> standalone pages
  -> component inventory
  -> React packages
  -> Storybook stories
  -> css-visual-diff visual suites
  -> targeted CSS/token iteration
  -> production app pages
```

The early history includes old native `*.css-visual-diff.yml` manifests. Treat those as historical evidence only. The current `css-visual-diff` project removed the native `run --config` YAML runner and is JavaScript-first: YAML can still be project data, but JavaScript verbs interpret it.

## Quick reference: primary evidence locations

| Area | Path | What to read it for |
| --- | --- | --- |
| Prototype source | `prototype-design/screens/*.jsx`, `prototype-design/lib/*.js` | Original Claude-style JSX, fake data, tokens, screen vocabulary, reusable visual motifs. |
| Standalone prototype pages | `prototype-design/standalone/` | Browser-ready HTML baselines for full-app, mobile, public, and foundation pages. |
| Deprecated native configs | `prototype-design/-deprecated/visual-diff-native-configs/` | Historical config-manifest approach; do not extend for new work. |
| Current Pyxis visual userland | `prototype-design/visual-diff/userland/` | Canonical Pyxis visual workflow: JS verbs, specs as project data, policies, snapshots, reports. |
| `css-visual-diff` current tool | `../corporate-headquarters/css-visual-diff/README.md` | Current JavaScript-first API and CLI mental model. |
| Generic component system | `web/packages/pyxis-components/src/atoms`, `molecules`, `organisms` | Reusable design-system primitive structure. |
| Public-domain components | `web/packages/pyxis-components/src/public/{atoms,molecules,organisms}` | Domain-specific taxonomy pattern after cleanup. |
| Staff app components | `web/packages/pyxis-app/src/components/{atoms,molecules,organisms}` | Larger app decomposition and page-section extraction pattern. |
| Page packages | `web/packages/pyxis-app/src/pages`, `web/packages/pyxis-user-site/src/pages` | Route/data/page shell responsibilities. |
| Storybook setup | `web/packages/*/.storybook/` and `*.stories.tsx` | Story IDs, story titles, decorators, and isolated component harnesses. |
| Evidence database | `ttmp/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK--convert-html-designs-into-production-react-sites/various/evidence.sqlite` | SQLite cross-correlation of docs, source files, components, and commits. |

## Ticket/document trail to reuse

| Ticket | Best documents | Lessons to carry forward |
| --- | --- | --- |
| `PYXIS-SCREENSHOT-EXTRACTION` | `design/03-css-visual-diff-prepare-and-png-export-implementation-guide.md`, `playbooks/01-next-developer-handoff-visual-comparison-and-storybook-parity.md` | Start with robust screenshot/export validation and selector readiness; early tool problems created noise. |
| `PYXIS-STORYBOOK-CATALOG` | `design/01-storybook-catalog-extraction-plan.md`, `playbooks/03-continuation-playbook-extensive-catalog.md`, `reference/02-postmortem-extensive-prototype-catalog-and-css-visual-diff.md` | Build catalogs bottom-up and sample-first; inspect stories before running broad suites. |
| `PYXIS-COMPONENT-VISUAL-PARITY` | `analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md` | Fix atoms/molecules before page-level visual parity. |
| `PYXIS-CSSVD-JS-LIB` | `design/01-pyxis-css-visual-diff-javascript-userland-library-implementation-guide.md`, `design/03-clean-css-visual-diff-maintainer-follow-up-requests-after-flexible-js-api.md`, `reference/01-implementation-diary.md` | JS-callable comparison primitives and stable artifact paths are the preferred extension point. |
| `PYXIS-APP-REACT` | `design/01-pyxis-app-react-end-to-end-workflow-guide.md`, `playbooks/01-pyxis-app-react-intern-playbook.md`, `playbooks/02-pyxis-app-css-visual-improvement-loop.md`, `reference/01-diary.md` | The complete conversion loop from standalone pages to app-level React, Storybook, and targeted visual tuning. |
| `PYXIS-PUBLIC-COMPONENT-TAXONOMY` | `design-doc/01-public-site-component-taxonomy-and-folder-layout-refactor-guide.md`, `sources/*storybook-ids*` | Folder taxonomy, story title hygiene, and route-vs-organism responsibility boundaries. |
| `PYXIS-PUBLIC-VISUAL-MOBILE-TUNING` | `reference/01-investigation-diary.md` | Mobile parity should be a responsive variant of the same route hierarchy unless proven otherwise. |
| `PYXIS-SHOW-EDIT-VISUAL-REDESIGN` | `reference/01-investigation-diary.md` and linked design docs | Later page decomposition/polish work: modal extraction, route smoke testing, screenshot evidence. |

## Evidence-backed current rules

1. **Use standalone pages as baselines.** The Pyxis app guide captured the flow from standalone pages to component candidates, stories, visual specs, and accepted differences (`ttmp/.../PYXIS-APP-REACT/design/01-pyxis-app-react-end-to-end-workflow-guide.md:53-67`).
2. **Keep visual comparison JS-canonical.** The same guide explicitly records the decision to reuse project-specific `css-visual-diff` userland rather than revive native `*.css-visual-diff.yml` configs (`...:69-79`). The css-visual-diff README confirms that the native YAML manifest runner is removed and JavaScript verbs are the supported orchestration path (`../corporate-headquarters/css-visual-diff/README.md:3-5`, `:43-54`).
3. **Use stable selectors.** Pyxis relies on `data-pyxis-component`, `data-pyxis-part`, `data-page`, `data-section`, and when needed `data-element` selectors (`PYXIS-APP-REACT design:71-79`, `playbooks/02...:139-153`).
4. **Tune bottom-up.** The css-visual-diff README recommends the smallest meaningful target and broader validation only after local stability (`../corporate-headquarters/css-visual-diff/README.md:17-25`). The Pyxis playbook says full-page crops are too noisy for everyday work and page sections should be extracted first (`PYXIS-APP-REACT playbook:81-119`).
5. **Keep full artifacts on disk and terminal output compact.** The Pyxis playbook says to write full results to disk but print only operator summaries and artifact paths (`PYXIS-APP-REACT playbook:17-37`).
6. **Stop at acceptable review-band closeness.** Do not chase mathematical pixel perfection for anti-aliasing, font rendering, gradients, shadows, and subtle browser differences (`PYXIS-APP-REACT playbook:39-41`).
7. **CSS ownership is component ownership.** A widget should usually own `Widget.tsx`, `Widget.css`, `Widget.stories.tsx`, and `index.ts`; transitive/bucket CSS caused Storybook fragility (`PYXIS-APP-REACT playbook:43-60`).
8. **Promote repeated differences into tokens.** The visual loop should discover shared theme decisions and encode them in token variables instead of one-off patches (`PYXIS-APP-REACT playbook:62-79`).

## Evidence database usage

The evidence database was generated by:

```bash
python3 ttmp/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK--convert-html-designs-into-production-react-sites/scripts/01-build-evidence-db.py
```

Useful queries:

```sql
-- How many components exist per package/layer and how many have stories/CSS?
select package, layer, count(*) as components, sum(has_story) as stories, sum(has_css) as css_files
from components
group by package, layer
order by package, layer;

-- Which prior tickets contain the most relevant documentation?
select path, lines, title
from docs
where path like '%PYXIS-APP-REACT%' or path like '%PYXIS-CSSVD%'
order by lines desc
limit 20;

-- Which commits are associated with visual redesign/tuning tickets?
select ticket, count(*) as commits
from commits
where ticket like '%VISUAL%' or ticket like '%REACT%' or ticket like '%STORYBOOK%'
group by ticket
order by commits desc;
```

Snapshot counts from this run:

- `11151` relevant source/doc/artifact files indexed.
- `645` relevant markdown documents indexed from the selected tickets.
- `158` React component implementation files indexed.
- `476` git commits touching `web`, `prototype-design`, or `ttmp` indexed.

## Usage example for a new intern

1. Read the main guide in this ticket first.
2. Open `prototype-design/standalone/index.html` and the target subfolder index.
3. Read the matching prototype source in `prototype-design/screens/` and shared prototype utilities in `prototype-design/lib/`.
4. Inspect existing component taxonomy in `web/packages/pyxis-components/src` and `web/packages/pyxis-app/src/components`.
5. Read `prototype-design/visual-diff/userland/README.md` before writing any visual comparison script.
6. If tempted to add old native visual-diff YAML, stop and write a JavaScript verb or a project YAML spec interpreted by JavaScript instead.
