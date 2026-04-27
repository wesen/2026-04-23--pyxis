# Pyxis css-visual-diff JavaScript Userland

This directory contains the promoted Pyxis project-specific workflow layer for `css-visual-diff`.

It compares standalone prototype pages against Storybook-rendered React pages through the JavaScript API (`cvd.compare.region`, catalogs, policies, and semantic snapshots). The JS userland and `specs/*.visual.yml` files are the canonical Pyxis workflow; native `css-visual-diff run` configs are retired and should not be maintained as a parallel path.

---

## Quick Start

```bash
# 1. Start the servers
python3 -m http.server 7070 --directory prototype-design &   # prototype
cd web && pnpm --filter pyxis-app storybook &                 # pyxis-app Storybook (6008)
cd web && pnpm --filter pyxis-user-site storybook &           # user-site Storybook (6007)

# 2. List available targets
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages list-targets \
  --output json

# 3. Inspect a section pre-flight
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-section archive content \
  --variant desktop \
  --side both \
  --output json

# 4. Compare one section
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-section archive content \
  --variant desktop \
  --outDir /tmp/archive-content-compare \
  --output json

# 5. Compare all sections of a page
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-page archive \
  --outDir /tmp/archive-compare \
  --output json

# 6. Run the full public-pages suite
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-all \
  --outDir /tmp/full-compare \
  --output json

# 7. CI policy check (fails if any section > threshold)
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-all \
  --mode ci \
  --maxChangedPercent 10 \
  --outDir /tmp/ci-compare \
  --output json
```

---

## Architecture

The userland is a **three-layer system**:

```
SPEC LAYER     (YAML visual suite specs)
    ↓ targetsFromSpec()
REGISTRY LAYER (In-memory target lookup)
    ↑ called by
LIBRARY LAYER  (Reusable JS modules)
    ↑ called by
VERB LAYER     (Registered css-visual-diff commands)
    ↑
CSS-VISUAL-DIFF CORE (Go binary + Playwright)
```

### Key Modules

| Module | Purpose |
|---|---|
| `lib/registry.js` | Loads specs, builds target records, filters/finds |
| `lib/compare-region.js` | Orchestrates `cvd.compare.region` calls |
| `lib/inspect.js` | Browser-based element inspection |
| `lib/snapshot.js` | Semantic snapshots + diff |
| `lib/policies.js` | CI policy classification and gating |
| `lib/styles.js` | CSS property presets (typography, surface, etc.) |
| `lib/normalizers.js` | Value normalization (colors, units) |
| `lib/tolerances.js` | Numeric tolerance comparisons |
| `lib/markdown.js` | Markdown report rendering |
| `lib/artifacts.js` | Output path helpers |
| `verbs/pyxis-pages.js` | Registered CLI verbs |

### See Also

- **`docs/01-architecture-and-internals.md`** — Detailed architecture reference covering module internals, extension patterns, data flows, and examples.
- **`specs/README.md`** — Spec file schema and field reference.

---

## Directory Layout

```text
prototype-design/visual-diff/userland/
├── lib/                    # Reusable JS modules
│   ├── index.js           # Module exports
│   ├── registry.js        # Spec loading + target registry
│   ├── compare-region.js  # Comparison engine
│   ├── inspect.js         # Element inspection
│   ├── snapshot.js        # Semantic snapshots + diff
│   ├── policies.js        # CI policy + classification
│   ├── styles.js          # CSS property presets
│   ├── normalizers.js     # Value normalization
│   ├── tolerances.js      # Numeric tolerance
│   ├── markdown.js        # Report rendering
│   ├── artifacts.js      # Output path helpers
│   ├── slug.js           # Slug generation
│   └── storybook.js      # Storybook URL builder
├── verbs/
│   └── pyxis-pages.js    # Registered css-visual-diff verbs
├── specs/
│   ├── README.md         # Spec schema reference
│   ├── public-pages.desktop.visual.yml   # Canonical public-pages spec
│   ├── public-pages.desktop.visual.js   # Generated mirror
│   ├── app.pages.desktop.visual.yml      # App pages spec
│   ├── app.pages.desktop.visual.js        # Generated mirror
│   ├── app.pages.mobile.visual.yml       # App mobile spec
│   ├── app.pages.mobile.visual.js        # Generated mirror
│   └── app.components.visual.yml         # App components spec
├── scripts/
│   ├── refresh-spec-mirrors.py   # Regenerate JS mirrors from YAML
│   ├── smoke-list-targets.sh       # List targets smoke test
│   ├── smoke-inspect-section-archive.sh
│   ├── smoke-compare-section-archive.sh
│   ├── smoke-compare-page-archive.sh
│   ├── smoke-compare-spec-archive.sh
│   ├── smoke-diff-snapshots-archive.sh
│   ├── smoke-snapshot-section-archive.sh
│   ├── run-compare-all-public-pages.sh
│   ├── run-compare-spec-public-pages.sh
│   ├── smoke-compare-all-archive.sh
│   ├── smoke-ci-policy-failure.sh
│   └── diagnose-shows-sections.sh
├── docs/
│   └── 01-architecture-and-internals.md  # Detailed internals reference
└── README.md                 # This file
```

---

## Visual Suite Specs

The `specs/` directory contains YAML files that define comparison targets. Each spec covers a logical group (public pages, app pages, app components).

### Canonical Spec for Public Pages

```text
specs/public-pages.desktop.visual.yml
```

This is the reviewed source of truth. The JS mirror is auto-generated:

```bash
python3 prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

### App Specs

| Spec | Purpose | Storybook Port |
|---|---|---|
| `app.pages.desktop.visual.yml` | App pages desktop | 6008 |
| `app.pages.mobile.visual.yml` | App pages mobile | 6008 |
| `app.components.visual.yml` | Individual app components | 6008 |

**Note:** The app specs use port `6008` (pyxis-app Storybook), while public-page specs use port `6007` (pyxis-user-site Storybook).

### Running Comparisons Against App Specs

App specs must be loaded explicitly via `compare-spec`:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --outDir /tmp/app-dashboard-compare \
  --output json
```

The registry-backed verbs (`listTargets`, `compareSection`, `comparePage`) use `public-pages.desktop.visual.js` as the default spec. They do **not** operate on app specs by default.

---

## Policy Bands

Comparison results are classified into bands:

| Band | Max Changed % | Meaning |
|---|---|---|
| `accepted` | ≤1% | Near-exact match |
| `review` | ≤10% | Needs review, may be acceptable |
| `tune-required` | ≤25% | Tuning required |
| `major-mismatch` | >25% | Major composition mismatch |
| `unknown` | — | No data |

### CI Policy

Run with `--mode ci` to fail if thresholds are exceeded:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-all \
  --mode ci \
  --maxChangedPercent 10 \
  --maxPolicyBand review \
  --output json
```

---

## Semantic Snapshots

For iterative CSS tuning without full pixel comparisons, use snapshots:

```bash
# Capture before state
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages snapshot-section dashboard topbar \
  --variant desktop \
  --outDir /tmp/before-tuning \
  --output json

# ... make CSS changes ...

# Capture after state
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages snapshot-section dashboard topbar \
  --variant desktop \
  --outDir /tmp/after-tuning \
  --output json

# Diff the snapshots
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages diff-snapshots \
  /tmp/before-tuning/snapshot.json \
  /tmp/after-tuning/snapshot.json \
  --outDir /tmp/snapshot-diff \
  --output json
```

Snapshots capture:
- **Bounds:** x, y, width, height with tolerance support
- **Styles:** Normalized computed CSS properties
- **Text:** Truncated text content

---

## Style Presets

CSS properties captured during inspection are controlled by presets:

| Preset | Properties |
|---|---|
| `typography` | font-family, font-size, font-weight, line-height, color, ... |
| `layout` | display, position, width, height, margin, padding, ... |
| `surface` | background-color, border-color, border-radius, box-shadow, ... |
| `spacing` | margin-top, margin-right, margin-bottom, margin-left, ... |
| `pageShell` | box-sizing, width, height, padding, display, background-color, ... |

Pass a preset to inspection commands:

```bash
pyxis pages inspect-section dashboard topbar --stylePreset typography
```

---

## Adding New Comparison Targets

### Step 1: Identify Storybook Story ID

```bash
curl -s http://localhost:6008/index.json | jq '.stories[].id' | grep your-component
```

Or check the stories file:
```bash
grep -n "export const\|title:" web/packages/pyxis-app/src/components/YourComponent/YourComponent.stories.tsx
```

### Step 2: Identify Prototype Selector

The prototype uses React-rendered HTML. Check the standalone page:
```bash
curl -s http://localhost:7070/standalone/full-app/dashboard.html | grep -o 'data-.*="[^"]*"'
```

Or inspect the prototype in-browser using Playwright.

### Step 3: Add to Spec

Edit the appropriate YAML spec in `specs/`:

```yaml
- page: your-component
  variant: component  # or desktop/mobile
  priority: tune-first
  prototypePath: /standalone/full-app/dashboard.html
  storyId: pyxis-app-components-molecules-yourcomponent--default
  sections:
    - name: component
      original: '[data-pyxis-component="your-component"]'
      react: '[data-pyxis-component="your-component"]'
```

### Step 4: Regenerate Mirror

```bash
python3 prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

### Step 5: Run Comparison

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page your-component \
  --outDir /tmp/your-component-compare \
  --output json
```

---

## Atom and Molecule Comparison

For individual atom/molecule comparison (atoms like Button, Badge, Input), use the **component variant** with narrow viewports:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page metric-card \
  --variant component \
  --outDir /tmp/metric-card-compare \
  --output json
```

The component visual spec uses:
- `viewport: { width: 520, height: 420 }`
- `variant: component`

---

## Smoke Scripts

Run smoke tests to validate the workflow:

```bash
# List targets
./scripts/smoke-list-targets.sh

# Inspect section
./scripts/smoke-inspect-section-archive.sh

# Compare section
./scripts/smoke-compare-section-archive.sh

# Compare page
./scripts/smoke-compare-page-archive.sh

# Compare via spec
./scripts/smoke-compare-spec-archive.sh

# Snapshot + diff
./scripts/smoke-snapshot-section-archive.sh
./scripts/smoke-diff-snapshots-archive.sh

# CI policy failure
./scripts/smoke-ci-policy-failure.sh

# Full suite
./scripts/run-compare-all-public-pages.sh
```

---

## Generated Artifacts

Output artifacts are written to the specified `--outDir` or the default:

```text
prototype-design/visual-comparisons/cssvd-js/
├── compare-section/
│   ├── archive/
│   │   └── content/
│   │       ├── compare.json
│   │       ├── compare.md
│   │       ├── left_region.png
│   │       ├── right_region.png
│   │       ├── diff_comparison.png
│   │       └── diff_only.png
├── compare-page/
│   └── archive/
│       ├── 01-catalog-index.md
│       ├── catalog-manifest.json
│       └── content/
│           └── ...
├── compare-all/
│   └── ...
└── snapshot-section/
    └── ...
```

**Do not commit generated artifacts.** They are re-generated on each run.

---

## Key Design Decisions

### 1. YAML Specs as Source of Truth

YAML files are reviewed and committed. JS mirrors are auto-generated. This prevents drift between configs and code.

### 2. Default Spec is Public Pages

The `registry.js` hardcodes `defaultSpec = public-pages.desktop.visual.js`. App specs are not loaded by default — they must be passed explicitly via `compare-spec`. This keeps the public-pages workflow simple while allowing app extensions.

### 3. Policy Bands Over Hard Thresholds

The policy system provides semantic bands (`accepted`, `review`, `tune-required`, `major-mismatch`) rather than binary pass/fail. This allows human review of borderline cases.

### 4. Semantic Snapshots for Iteration

Full pixel diffs are expensive for iterative tuning. Snapshots capture semantic facts (styles, bounds, text) and can be diffed independently.

### 5. Registry-Backed Verbs for Ergonomics

Named verbs (`compare-section`, `compare-page`) with registry-backed selectors are easier to use than raw `css-visual-diff run` commands with YAML configs. The registry resolves URLs, viewports, and selectors from one source.

---

## Reference: Verbs Available

| Verb | Description |
|---|---|
| `pyxis pages list-targets` | List all registered targets |
| `pyxis pages inspect-section` | Inspect one section on prototype/Storybook |
| `pyxis pages compare-section` | Compare one section |
| `pyxis pages compare-page` | Compare all sections of one page + catalog |
| `pyxis pages compare-all` | Compare all pages + summary |
| `pyxis pages inspect-spec` | Inspect targets from a YAML spec |
| `pyxis pages compare-spec` | Run from a YAML spec |
| `pyxis pages snapshot-section` | Semantic snapshot one section |
| `pyxis pages diff-snapshots` | Diff two snapshot files |

---

## Reference: Spec Schema

```yaml
schemaVersion: pyxis.visual-suite.v1
name: <suite-name>
defaults:
  prototypeBase: http://localhost:7070
  storybookBase: http://localhost:6007  # or 6008 for pyxis-app
  viewport:
    width: 920
    height: 1460
  waitMs: 1000
  threshold: 30
  inspect: rich
  variant: desktop  # or component, mobile
policy:
  bands:
    - name: accepted
      maxChangedPercent: 0.5
    - name: review
      maxChangedPercent: 10
    - name: tune-required
      maxChangedPercent: 30
    - name: major-mismatch
      maxChangedPercent: 100
acceptedDifferences: {}
targets:
  - page: <slug>
    variant: <variant>
    priority: <priority-label>
    prototypePath: /standalone/<path>.html
    storyId: <storybook-story-id>
    sections:
      - name: <section-slug>
        original: "<css-selector>"
        react: "<css-selector>"
        acceptedDifferences:
          - "<reason>"
```

---

## Troubleshooting

### "unknown page" error

The registry's default spec is `public-pages.desktop.visual.js`. For app pages, use:
```bash
pyxis pages compare-spec app.pages.desktop.visual.yml --page dashboard
```

### Selector not found on prototype

The prototype renders React. Use `data-*` attributes from the component source:
- Check `prototype-design/screens/auth-dash.jsx` for `data-page`, `data-section`
- Check `prototype-design/lib/components.jsx` for `data-pyxis-component`

### Prototype server not responding

```bash
python3 -m http.server 7070 --directory prototype-design &
sleep 2
curl -s -o /dev/null -w "%{http_code}" http://localhost:7070
```

### Storybook story not found

```bash
curl -s http://localhost:6008/index.json | jq '.stories[].id' | grep your-story
```

---

## Extending the Userland

### Adding a New Verb

1. Add function + `__verb__` to `verbs/pyxis-pages.js`
2. If needed, add library functions to `lib/` and export from `lib/index.js`
3. Test with smoke script

### Adding a New Spec

1. Create `specs/your-suite.visual.yml` with schema
2. Run `refresh-spec-mirrors.py` to generate `your-suite.visual.js`
3. Run comparisons with `compare-spec your-suite.visual.yml`

### Adding Atom/Molecule Comparison

1. Create `app.atoms.visual.yml` with component-type targets
2. Use viewport `{ width: 520, height: 420 }`
3. Compare with `compare-spec --variant component`

### Adding Accepted Differences

```yaml
targets:
  - page: dashboard
    sections:
      - name: topbar
        original: "..."
        react: "..."
        acceptedDifferences:
          - "Color off by 3 RGB values due to prototype using #1a1a18 vs React #1f1e1c"
```

Accepted differences are reported in output but do not change pixel classification.
