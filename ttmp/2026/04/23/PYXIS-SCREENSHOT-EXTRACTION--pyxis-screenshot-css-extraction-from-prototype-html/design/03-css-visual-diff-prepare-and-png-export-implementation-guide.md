---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/config/config.go
      Note: PrepareSpec and Target schema implementation target
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/driver/chrome.go
      Note: Driver helpers needed for wait_for/evaluate/root screenshots
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/capture.go
      Note: Prepare hook wiring and root PNG export target
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/cssdiff.go
      Note: Prepare hook wiring before computed CSS extraction
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/matched_styles.go
      Note: Prepare hook wiring before matched cascade extraction
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/pixeldiff.go
      Note: Existing PNG diff artifacts and validation/report integration point
    - Path: prototype-design/comp/01-desktop-shows-full.png
      Note: Known-bad DesignCanvas screenshot used as validation failure example
    - Path: prototype-design/direct/home/desktop-shows-full.png
      Note: Known-good direct-render screenshot used as validation target
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Implementation Guide: css-visual-diff Prepare Hooks and Robust PNG Export

## 1. Purpose

This guide describes how to implement a `prepare` mechanism and robust PNG export/validation in `css-visual-diff` so it can support the workflow we need for Pyxis and future projects:

> Work with an original design/prototype and a Storybook React implementation side by side until the port is pixel perfect.

The core challenge is that the original design is not always a clean URL. Sometimes it is wrapped in a design board, a pan/zoom canvas, a Figma-like preview UI, an in-browser Babel prototype, or a demo shell. For Pyxis, the original URL is:

```text
http://localhost:7070/Pyxis%20Public%20Site.html
```

but that URL initially renders the `DesignCanvas` board, not the public site itself. Direct screenshotting captures the wrong content.

The proposed solution is to add a **prepare step** to `css-visual-diff` target loading. A prepare step runs after navigation and before capture, allowing the tool to mutate or initialize the page into the exact clean comparison state.

For Pyxis, the prepare step should:

1. wait until the prototype globals exist (`React`, `ReactDOM`, `PPXDesktop`, `PPXMobile`),
2. clear the DesignCanvas DOM,
3. render `PPXDesktop({ page: 'shows' })` or `PPXMobile({ page: 'shows' })` into `#capture-root`,
4. set the desired root width (`920px` desktop or `390px` mobile),
5. let normal `css-visual-diff` capture/diff logic continue.

This guide is written for a new intern implementing the feature in the Go repository:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
```

---

## 2. Current situation

### 2.1 What css-visual-diff already does well

The existing `css-visual-diff` tool already has most of the comparison machinery we need.

Important files:

```text
cmd/css-visual-diff/main.go
internal/cssvisualdiff/config/config.go
internal/cssvisualdiff/driver/chrome.go
internal/cssvisualdiff/modes/capture.go
internal/cssvisualdiff/modes/compare.go
internal/cssvisualdiff/modes/cssdiff.go
internal/cssvisualdiff/modes/matched_styles.go
internal/cssvisualdiff/modes/pixeldiff.go
internal/cssvisualdiff/modes/stories.go
```

It can:

- open two browser pages using `chromedp`,
- set viewports,
- capture full-page and element screenshots,
- compare computed CSS values,
- inspect matched CSS/cascade rules via Chrome DevTools Protocol,
- generate pixel diff images,
- discover Storybook stories through `/index.json`,
- write JSON and Markdown reports.

The current one-shot compare command supports:

```bash
GOWORK=off go run ./cmd/css-visual-diff compare --help
```

Important flags:

```text
--url1
--selector1
--url2
--selector2
--viewport-w
--viewport-h
--props
--attrs
--threshold
--out
--wait-ms1
--wait-ms2
--write-json
--write-markdown
--write-pngs
```

The config-driven workflow is:

```bash
GOWORK=off go run ./cmd/css-visual-diff run \
  --config some-config.yaml \
  --modes capture,cssdiff,matched-styles,pixeldiff
```

### 2.2 What css-visual-diff does not yet do

It does **not** yet know how to prepare a page after navigation.

Current target config:

```go
type Target struct {
    Name     string   `yaml:"name"`
    URL      string   `yaml:"url"`
    WaitMS   int      `yaml:"wait_ms"`
    Viewport Viewport `yaml:"viewport"`
}
```

A target is currently just:

1. set viewport,
2. navigate to URL,
3. wait fixed milliseconds,
4. capture selectors.

That is not sufficient for Pyxis because the original URL renders a design canvas. We need:

1. set viewport,
2. navigate to URL,
3. wait fixed milliseconds and/or wait for JS condition,
4. run a prepare hook,
5. capture selectors.

### 2.3 Evidence from Pyxis image analysis

The original screenshot attempt created files with plausible dimensions, but the images were wrong.

Programmatic facts:

```text
prototype-design/comp/01-desktop-shows-full.png: 920x1460
prototype-design/direct/home/desktop-shows-full.png: 920x1801
prototype-design/direct/home/header.png: 920x61
prototype-design/direct/home/footer.png: 920x125
```

Top/bottom strip averages:

```text
old DesignCanvas capture top20avg=(240,238,233)    # gray canvas chrome
clean direct capture top20avg=(255,255,255)        # white site header
```

Visual review showed:

- old capture starts with `01 · Desktop` and `Poster-grid shell`,
- old capture is cut off before the footer,
- direct render starts with the actual `ppxis` header at y=0,
- direct render includes the footer.

This is the key lesson:

> Correct PNG dimensions do not mean correct screenshot origin or content.

Therefore implementation must include **image validation**, not just PNG export.

---

## 3. Desired end-state workflow

The final workflow should let us compare original prototype and Storybook implementation like this:

```bash
css-visual-diff run \
  --config pyxis-public-shows.yaml \
  --modes capture,cssdiff,matched-styles,pixeldiff
```

where `pyxis-public-shows.yaml` contains:

```yaml
original:
  name: pyxis-prototype
  url: http://localhost:7070/Pyxis%20Public%20Site.html
  wait_ms: 1000
  viewport:
    width: 1200
    height: 2200
  prepare:
    type: direct-react-global
    component: PPXDesktop
    props:
      page: shows
    root_selector: "#capture-root"
    width: 920
    wait_for: "window.React && window.ReactDOM && window.PPXDesktop"

react:
  name: storybook
  url: http://localhost:6006/iframe.html?id=pages-public-shows--prototype-width
  wait_ms: 1000
  viewport:
    width: 1200
    height: 2200
  root_selector: "#storybook-root"

sections:
  - name: full
    selector_original: "#capture-root"
    selector_react: "[data-page='shows']"

  - name: header
    selector_original: "#capture-root header"
    selector_react: "[data-region='site-header']"

  - name: nav
    selector_original: "#capture-root nav"
    selector_react: "[data-region='site-nav']"

styles:
  - name: header
    selector_original: "#capture-root header"
    selector_react: "[data-region='site-header']"
    include_bounds: true
    props:
      - height
      - padding
      - background-color
      - border-bottom-color
      - position
      - font-family
      - font-size

output:
  dir: ./out/pyxis-public-shows
  write_json: true
  write_markdown: true
  write_pngs: true

modes:
  - capture
  - cssdiff
  - matched-styles
  - pixeldiff
```

After the run, expected artifacts:

```text
out/pyxis-public-shows/
  capture.json
  capture.md
  original-full.png
  react-full.png
  original-header.png
  react-header.png
  original-nav.png
  react-nav.png
  cssdiff.json
  cssdiff.md
  matched-styles.json
  matched-styles.md
  pixeldiff_header_diff_only.png
  pixeldiff_header_diff_comparison.png
  pixeldiff.json
  pixeldiff.md
  validation.json
  validation.md
```

---

## 4. Design overview

### 4.1 Current pipeline

```text
config.Target
    ↓
SetViewport
    ↓
Goto(URL)
    ↓
Wait(wait_ms)
    ↓
Capture selector screenshots / CSS
```

### 4.2 Proposed pipeline

```text
config.Target
    ↓
SetViewport
    ↓
Goto(URL)
    ↓
Wait(wait_ms)
    ↓
WaitFor condition (optional)
    ↓
Prepare page (optional)
    ↓
Wait after prepare (optional)
    ↓
Validate prepared page (optional)
    ↓
Capture selector screenshots / CSS
```

### 4.3 Diagram

```text
┌────────────────────┐
│ YAML config         │
│ original.prepare    │
│ react.prepare?      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Load target URL     │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Wait for JS globals │  e.g. window.PPXDesktop
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Prepare hook        │  render PPXDesktop into #capture-root
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Validate image/DOM  │  no canvas chrome, footer present, dimensions sane
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Existing modes      │  capture/cssdiff/matched-styles/pixeldiff
└────────────────────┘
```

---

## 5. Config implementation

### 5.1 Add PrepareSpec

File:

```text
internal/cssvisualdiff/config/config.go
```

Add:

```go
type PrepareSpec struct {
    Type string `yaml:"type"`

    // Generic script prepare.
    Script string `yaml:"script"`
    ScriptFile string `yaml:"script_file"`

    // Wait condition before prepare.
    WaitFor string `yaml:"wait_for"`
    WaitForTimeoutMS int `yaml:"wait_for_timeout_ms"`

    // Direct React-global prepare.
    Component string `yaml:"component"`
    Props map[string]any `yaml:"props"`
    RootSelector string `yaml:"root_selector"`
    Width int `yaml:"width"`
    MinHeight int `yaml:"min_height"`
    Background string `yaml:"background"`

    // Optional wait after prepare, useful for layout/fonts.
    AfterWaitMS int `yaml:"after_wait_ms"`
}
```

Then extend `Target`:

```go
type Target struct {
    Name     string       `yaml:"name"`
    URL      string       `yaml:"url"`
    WaitMS   int          `yaml:"wait_ms"`
    Viewport Viewport     `yaml:"viewport"`
    Prepare  *PrepareSpec `yaml:"prepare"`
    RootSelector string   `yaml:"root_selector"`
}
```

### 5.2 Validation rules

Update `func (c *Config) Validate() error`.

Pseudocode:

```go
func validatePrepare(label string, p *PrepareSpec) []string {
    if p == nil { return nil }
    switch p.Type {
    case "", "none":
        return nil
    case "script":
        if p.Script == "" && p.ScriptFile == "" {
            err = append(err, label+" prepare.script requires script or script_file")
        }
    case "direct-react-global":
        if p.Component == "" {
            err = append(err, label+" prepare.direct-react-global requires component")
        }
        if p.RootSelector == "" {
            err = append(err, label+" prepare.direct-react-global requires root_selector")
        }
        if p.Width <= 0 {
            err = append(err, label+" prepare.direct-react-global requires positive width")
        }
    default:
        err = append(err, label+" unknown prepare.type "+p.Type)
    }
    return err
}
```

Call it for both targets:

```go
errs = append(errs, validatePrepare("original", c.Original.Prepare)...)
errs = append(errs, validatePrepare("react", c.React.Prepare)...)
```

### 5.3 Tests

Add tests to:

```text
internal/cssvisualdiff/config/config_test.go
```

Test cases:

1. accepts no prepare,
2. accepts `prepare.type: direct-react-global`,
3. rejects direct-react-global without component,
4. rejects direct-react-global without width,
5. accepts script prepare with inline script,
6. accepts script prepare with script file,
7. rejects unknown prepare type.

Example test YAML:

```yaml
original:
  name: original
  url: http://example.com/original
  viewport: { width: 1200, height: 2200 }
  prepare:
    type: direct-react-global
    component: PPXDesktop
    props: { page: shows }
    root_selector: "#capture-root"
    width: 920
```

---

## 6. Driver implementation

### 6.1 Add EvaluateRaw helper if needed

Current driver has:

```go
func (p *Page) Evaluate(script string, out any) error
```

That may be enough. But for scripts with no return value, a convenience helper can reduce boilerplate:

```go
func (p *Page) Eval(script string) error {
    var out any
    return p.Evaluate(script, &out)
}
```

### 6.2 Add WaitForFunction helper

File:

```text
internal/cssvisualdiff/driver/chrome.go
```

Add:

```go
func (p *Page) WaitForFunction(expr string, timeout time.Duration) error {
    ctx := p.ctx
    if timeout > 0 {
        var cancel context.CancelFunc
        ctx, cancel = context.WithTimeout(p.ctx, timeout)
        defer cancel()
    }
    script := fmt.Sprintf(`(() => Boolean(%s))()`, expr)
    return chromedp.Run(ctx, chromedp.Poll(script, nil, chromedp.WithPollingInterval(100*time.Millisecond)))
}
```

However, verify `chromedp.Poll` signature in the installed version. If unavailable, use a small loop:

```go
func (p *Page) WaitForFunction(expr string, timeout time.Duration) error {
    deadline := time.Now().Add(timeout)
    for {
        var ok bool
        script := fmt.Sprintf(`Boolean(%s)`, expr)
        if err := p.Evaluate(script, &ok); err != nil {
            return err
        }
        if ok { return nil }
        if timeout > 0 && time.Now().After(deadline) {
            return fmt.Errorf("timeout waiting for %s", expr)
        }
        p.Wait(100 * time.Millisecond)
    }
}
```

This is less elegant but easy to test.

---

## 7. Prepare implementation

### 7.1 New package or file

Create:

```text
internal/cssvisualdiff/modes/prepare.go
```

or:

```text
internal/cssvisualdiff/prepare/prepare.go
```

Recommendation: use package `modes` initially if we want minimal changes, because capture/compare/cssdiff already live there and call driver pages directly. Later it can be moved to its own package.

### 7.2 Function shape

```go
func prepareTarget(page *driver.Page, target config.Target) error {
    p := target.Prepare
    if p == nil || p.Type == "" || p.Type == "none" {
        return nil
    }

    if p.WaitFor != "" {
        timeout := time.Duration(p.WaitForTimeoutMS) * time.Millisecond
        if timeout <= 0 { timeout = 30 * time.Second }
        if err := page.WaitForFunction(p.WaitFor, timeout); err != nil {
            return fmt.Errorf("prepare wait_for failed: %w", err)
        }
    }

    switch p.Type {
    case "script":
        return runScriptPrepare(page, p)
    case "direct-react-global":
        return runDirectReactGlobalPrepare(page, p)
    default:
        return fmt.Errorf("unknown prepare type %q", p.Type)
    }
}
```

### 7.3 Script prepare

Script prepare is a generic escape hatch.

```go
func runScriptPrepare(page *driver.Page, p *config.PrepareSpec) error {
    script := p.Script
    if script == "" && p.ScriptFile != "" {
        data, err := os.ReadFile(p.ScriptFile)
        if err != nil { return err }
        script = string(data)
    }
    if strings.TrimSpace(script) == "" {
        return fmt.Errorf("script prepare requires script or script_file")
    }
    var out any
    if err := page.Evaluate(script, &out); err != nil {
        return err
    }
    if p.AfterWaitMS > 0 {
        page.Wait(time.Duration(p.AfterWaitMS) * time.Millisecond)
    }
    return nil
}
```

### 7.4 Direct React-global prepare

This is the Pyxis case.

Inputs:

```yaml
prepare:
  type: direct-react-global
  component: PPXDesktop
  props:
    page: shows
  root_selector: "#capture-root"
  width: 920
  min_height: 1460
  background: "#fff"
  wait_for: "window.React && window.ReactDOM && window.PPXDesktop"
```

Generated JS should:

1. reset `document.body`,
2. create the root element,
3. apply width/background/min-height,
4. render `React.createElement(window[component], props)`,
5. return basic info about root dimensions.

Pseudocode:

```go
func runDirectReactGlobalPrepare(page *driver.Page, p *config.PrepareSpec) error {
    propsJSON, _ := json.Marshal(p.Props)
    background := p.Background
    if background == "" { background = "#fff" }

    script := fmt.Sprintf(`(() => {
      const componentName = %q;
      const props = %s;
      const rootSelector = %q;
      const width = %d;
      const minHeight = %d;
      const background = %q;

      const rootId = rootSelector.startsWith('#') ? rootSelector.slice(1) : 'capture-root';
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.body.innerHTML = '<div id="' + rootId + '"></div>';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.background = background;

      const root = document.getElementById(rootId);
      root.style.width = width + 'px';
      if (minHeight > 0) root.style.minHeight = minHeight + 'px';
      root.style.background = background;
      root.style.overflow = 'visible';

      const Component = window[componentName];
      if (!Component) throw new Error('Missing component global: ' + componentName);
      if (!window.React) throw new Error('Missing React global');
      if (!window.ReactDOM) throw new Error('Missing ReactDOM global');

      window.ReactDOM.createRoot(root).render(
        window.React.createElement(Component, props)
      );
      return { ok: true, rootSelector, componentName, props };
    })()`, p.Component, string(propsJSON), p.RootSelector, p.Width, p.MinHeight, background)

    var out map[string]any
    if err := page.Evaluate(script, &out); err != nil {
        return err
    }
    if p.AfterWaitMS > 0 {
        page.Wait(time.Duration(p.AfterWaitMS) * time.Millisecond)
    } else {
        page.Wait(500 * time.Millisecond)
    }
    return nil
}
```

### 7.5 Where to call prepare

In `capture.go`, inside `captureTarget`:

Current:

```go
if err := page.Goto(target.URL); err != nil { ... }
if target.WaitMS > 0 { page.Wait(...) }

pageResult := PageResult{...}
fullPath := filepath.Join(outDir, fmt.Sprintf("%s-full.png", prefix))
page.FullScreenshot(fullPath)
```

Change to:

```go
if err := page.Goto(target.URL); err != nil { ... }
if target.WaitMS > 0 { page.Wait(...) }
if err := prepareTarget(page, target); err != nil {
    return PageResult{}, err
}
```

In `cssdiff.go`, after navigating both pages and waiting:

```go
if err := prepareTarget(originalPage, cfg.Original); err != nil { return err }
if err := prepareTarget(reactPage, cfg.React); err != nil { return err }
```

In `matched_styles.go`, same place.

In `compare.go`, `CompareSettings` currently does not use `config.Target`; it takes bare URL/selector flags. We can either:

- leave `compare` unchanged in phase 1, or
- add `--prepare1-script`, `--prepare1-type`, etc. later.

Recommendation: implement prepare for config-driven `run` first. Then add one-shot compare flags later.

---

## 8. PNG export implementation

### 8.1 Current PNG export

`capture.go` already writes:

```text
original-full.png
react-full.png
original-<section>.png
react-<section>.png
```

`compare.go` writes:

```text
url1_full.png
url2_full.png
url1_screenshot.png
url2_screenshot.png
diff_comparison.png
diff_only.png
```

`pixeldiff.go` writes:

```text
pixeldiff_<section>_diff_only.png
pixeldiff_<section>_diff_comparison.png
```

So PNG export exists. The gap is not “write PNG at all,” but:

- ensure screenshots target the prepared root,
- validate screenshot content,
- export useful region PNGs,
- optionally export prepared-page PNGs/HTML before comparison,
- avoid trusting dimensions alone.

### 8.2 Add prepared artifact export

Add config:

```go
type OutputSpec struct {
    Dir string `yaml:"dir"`
    WriteJSON bool `yaml:"write_json"`
    WriteMarkdown bool `yaml:"write_markdown"`
    WritePNGs bool `yaml:"write_pngs"`
    WritePreparedHTML bool `yaml:"write_prepared_html"`
    WriteInspectJSON bool `yaml:"write_inspect_json"`
    ValidatePNGs bool `yaml:"validate_pngs"`
}
```

If `write_prepared_html` is true, after prepare write:

```text
original-prepared.html
react-prepared.html
```

Implementation:

```go
func writePreparedHTML(page *driver.Page, selector, path string) error {
    script := fmt.Sprintf(`(() => {
      const el = document.querySelector(%q);
      return el ? el.outerHTML : document.documentElement.outerHTML;
    })()`, selector)
    var html string
    if err := page.Evaluate(script, &html); err != nil { return err }
    return os.WriteFile(path, []byte(html), 0644)
}
```

If `write_inspect_json` is true, write recursive inspection JSON:

```text
original-inspect.json
react-inspect.json
```

Use the same evaluator style from `capture-direct-render.mjs`.

### 8.3 Use element screenshot for full prepared root

Instead of `FullScreenshot` for prepared original, prefer root selector screenshot when a root selector exists:

```go
rootSelector := target.RootSelector
if rootSelector == "" && target.Prepare != nil {
    rootSelector = target.Prepare.RootSelector
}
if rootSelector != "" {
    page.Screenshot(rootSelector, fullPath)
} else {
    page.FullScreenshot(fullPath)
}
```

Why?

- `FullScreenshot` captures the whole browser document.
- `Screenshot(selector)` captures exactly the prepared root.
- For design-porting, the root element is usually the artifact of interest.

Potential field name:

```yaml
original:
  root_selector: "#capture-root"
```

or infer from:

```yaml
original.prepare.root_selector
```

### 8.4 Add screenshot metadata

Every PNG should have a metadata JSON entry:

```json
{
  "path": "original-header.png",
  "selector": "#capture-root header",
  "width": 920,
  "height": 61,
  "element_bounds": { "x": 0, "y": 0, "width": 920, "height": 61 },
  "top_strip_average": [255, 255, 255],
  "bottom_strip_average": [253, 253, 253],
  "validation": {
    "status": "ok",
    "checks": [...]
  }
}
```

This makes it possible to detect “correct size but wrong origin” cases.

---

## 9. Image validation implementation

### 9.1 Why validation is required

The failed Pyxis screenshots looked plausible by size:

```text
old: 920x1460
```

but were wrong by content:

- top showed DesignCanvas chrome,
- bottom missed footer.

Therefore validation must check more than dimensions.

### 9.2 Validation layers

Use four validation layers, in this order:

1. **DOM validation before screenshot** — preferred when the page is live. Check selectors and `textContent` directly.
2. **PNG validation after screenshot** — dimensions, strip colors, blank/cutoff heuristics.
3. **Visual review with `understand_image`** — preferred over OCR/Tesseract for qualitative checks like “does this screenshot start with DesignCanvas chrome?” or “is the footer visible?”
4. **Optional OCR/Tesseract** — only if we later need deterministic offline OCR in CI and cannot inspect the DOM. Do not make Tesseract the default path.

This matters because OCR is the wrong first tool for our main validation failure. The bad Pyxis screenshot was obviously wrong visually: it started with the DesignCanvas title bar and was cut off before the footer. `understand_image` is much better suited for that review than OCR. For automation, DOM text checks are even better than OCR because they inspect the actual rendered document before screenshotting.

### 9.3 DOM validation before screenshot

Before screenshotting a selector:

```js
const el = document.querySelector(selector);
if (!el) return { exists: false };
const r = el.getBoundingClientRect();
const text = el.textContent.slice(0, 200);
return {
  exists: true,
  visible: r.width > 0 && r.height > 0,
  bounds: { x: r.x, y: r.y, width: r.width, height: r.height },
  textStart: text,
};
```

Config should allow expected text markers:

```yaml
sections:
  - name: full
    selector_original: "#capture-root"
    expect_text_original:
      includes:
        - "ppxis"
        - "Upcoming shows"
        - "25 Manton Ave"
      excludes:
        - "01 · Desktop"
        - "Poster-grid shell"
```

Add fields to `SectionSpec`:

```go
type TextExpectations struct {
    Includes []string `yaml:"includes"`
    Excludes []string `yaml:"excludes"`
}

type SectionSpec struct {
    Name string `yaml:"name"`
    Selector string `yaml:"selector"`
    SelectorOriginal string `yaml:"selector_original"`
    SelectorReact string `yaml:"selector_react"`
    ExpectText *TextExpectations `yaml:"expect_text"`
    ExpectTextOriginal *TextExpectations `yaml:"expect_text_original"`
    ExpectTextReact *TextExpectations `yaml:"expect_text_react"`
}
```

Validation pseudocode:

```go
func validateText(section SectionSpec, targetPrefix string, text string) []ValidationIssue {
    exp := expectationsForTarget(section, targetPrefix)
    for _, s := range exp.Includes {
        if !strings.Contains(text, s) { issue("missing expected text") }
    }
    for _, s := range exp.Excludes {
        if strings.Contains(text, s) { issue("found forbidden text") }
    }
}
```

For Pyxis original full-page baseline:

```yaml
expect_text_original:
  includes: ["ppxis", "Upcoming shows", "Instagram", "Discord", "Mailing list"]
  excludes: ["01 · Desktop", "Poster-grid shell"]
```

### 9.4 PNG validation after screenshot

After writing a PNG, read it and compute:

- width
- height
- average color of top strip
- average color of bottom strip
- optional dominant colors
- optional blank/near-blank detection

Go implementation sketch:

```go
type PNGStats struct {
    Width int `json:"width"`
    Height int `json:"height"`
    TopStripAverage [3]int `json:"top_strip_average"`
    BottomStripAverage [3]int `json:"bottom_strip_average"`
}

func AnalyzePNG(path string, stripHeight int) (PNGStats, error) {
    img, err := readPNG(path)
    if err != nil { return PNGStats{}, err }
    b := img.Bounds()
    stats := PNGStats{Width: b.Dx(), Height: b.Dy()}
    stats.TopStripAverage = averageStrip(img, 0, min(stripHeight, b.Dy()))
    stats.BottomStripAverage = averageStrip(img, max(0, b.Dy()-stripHeight), b.Dy())
    return stats, nil
}
```

Config expectations:

```yaml
sections:
  - name: full
    selector_original: "#capture-root"
    expect_png_original:
      width: 920
      min_height: 1700
      top_strip_not_near:
        rgb: [240, 238, 233]
        tolerance: 8
      top_strip_near:
        rgb: [255, 255, 255]
        tolerance: 8
```

This catches the Pyxis failure:

```text
old top20avg=(240,238,233)   # canvas gray
new top20avg=(255,255,255)   # page white
```

### 9.5 Footer/cutoff validation

Cutoff is often not detectable from dimensions alone. Add text and selector checks:

```yaml
sections:
  - name: full
    selector_original: "#capture-root"
    expect_text_original:
      includes:
        - "Instagram"
        - "Discord"
        - "Mailing list"
```

Also validate that footer exists and has non-zero screenshot:

```yaml
sections:
  - name: footer
    selector_original: "#capture-root footer"
    selector_react: "[data-region='site-footer']"
    expect_png_original:
      width: 920
      min_height: 80
```

### 9.6 Visual review with `understand_image`

For manual or semi-automated review, use `understand_image` on the generated screenshots or comparison sheets. This is especially useful for catching semantic capture failures that are hard to express as simple pixel statistics.

Good prompts:

```text
Look at the first 100 pixels of this screenshot. Does it start with the actual website header, or with design-canvas chrome such as “01 · Desktop” or “Poster-grid shell”?
```

```text
Does this screenshot include the full page through the footer, or is it cut off before the footer?
```

```text
Compare the left and right images. Which one is the clean product page baseline and which one includes design-tool chrome?
```

Do **not** use Tesseract/OCR as the first-line validation tool. OCR might read text, but it will not reliably tell us whether the screenshot is semantically the right artifact. `understand_image` is better for visual correctness; DOM validation is better for deterministic text checks.

### 9.7 Review sheet generation

Generate a human review sheet after capture:

```text
review/full-side-by-side.png
review/header-side-by-side.png
```

For each section, compose:

```text
original screenshot | react screenshot | diff image
```

`pixeldiff.go` already creates side-by-side comparison images. Reuse those, and optionally generate an index contact sheet.

Potential helper:

```go
func writeContactSheet(entries []PixelDiffEntry, outPath string) error
```

or use existing `combineSideBySide` functions.

---

## 10. Required code changes by file

### 10.1 `internal/cssvisualdiff/config/config.go`

Add:

- `PrepareSpec`
- `Target.Prepare`
- `Target.RootSelector`
- optional `TextExpectations`
- optional `PNGExpectations`
- output flags for prepared HTML and inspect JSON

Update:

- validation logic
- tests

### 10.2 `internal/cssvisualdiff/driver/chrome.go`

Add:

- `WaitForFunction`
- optional `Eval`
- optional `OuterHTML(selector)` helper
- optional `Bounds(selector)` helper

### 10.3 `internal/cssvisualdiff/modes/prepare.go`

New file.

Implement:

- `prepareTarget(page, target)`
- `runScriptPrepare`
- `runDirectReactGlobalPrepare`
- script-file loading
- after-wait

### 10.4 `internal/cssvisualdiff/modes/capture.go`

Update `captureTarget`:

- call `prepareTarget` after navigation/wait
- use root selector screenshot for full screenshot when configured
- write prepared HTML/inspect JSON if requested
- run validation and add validation results to `CaptureResult`

Add fields:

```go
type CaptureResult struct {
    Original PageResult `json:"original"`
    React PageResult `json:"react"`
    Coverage CoverageSummary `json:"coverage"`
    Validation []ValidationResult `json:"validation,omitempty"`
}
```

### 10.5 `internal/cssvisualdiff/modes/cssdiff.go`

After navigation/wait:

```go
prepareTarget(originalPage, cfg.Original)
prepareTarget(reactPage, cfg.React)
```

### 10.6 `internal/cssvisualdiff/modes/matched_styles.go`

Same as cssdiff.

### 10.7 `internal/cssvisualdiff/modes/compare.go`

Phase 1: no change required.

Phase 2 options:

- add prepare flags to one-shot compare, or
- add a `compare --config` mode, or
- encourage config-driven `run` for prepared targets.

Recommendation: do not complicate one-shot compare initially.

### 10.8 `internal/cssvisualdiff/modes/png_validation.go`

New file.

Implement:

- PNG stats
- expected width/height checks
- top/bottom strip checks
- near-color helper
- blank image detection

### 10.9 `internal/cssvisualdiff/modes/inspect_tree.go`

Optional but recommended.

Implement recursive DOM/style export like the Pyxis direct-render script.

---

## 11. Testing plan

### 11.1 Unit tests: config validation

File:

```text
internal/cssvisualdiff/config/config_test.go
```

Add:

```go
func TestValidate_AllowsDirectReactGlobalPrepare(t *testing.T)
func TestValidate_RejectsDirectReactGlobalWithoutComponent(t *testing.T)
func TestValidate_RejectsDirectReactGlobalWithoutWidth(t *testing.T)
func TestValidate_AllowsScriptPrepare(t *testing.T)
func TestValidate_RejectsUnknownPrepareType(t *testing.T)
```

### 11.2 Unit tests: prepare script generation

If script generation is factored into a pure function:

```go
func BuildDirectReactGlobalScript(p PrepareSpec) (string, error)
```

then test:

- component name appears quoted,
- props JSON appears,
- width is injected,
- root selector is injected,
- invalid config returns error.

### 11.3 Integration test: simple local HTML

Create a test HTML server with:

```html
<script>
window.React = ... // or use a simpler non-React script prepare for test
</script>
```

Simpler test: use `prepare.type: script`:

```yaml
prepare:
  type: script
  script: |
    document.body.innerHTML = '<div id="capture-root"><header>Prepared Header</header><footer>Prepared Footer</footer></div>';
```

Then assert:

- `capture.json` exists,
- `original-full.png` exists,
- text validation passes,
- forbidden text validation catches failures.

### 11.4 PNG validation tests

Use small synthetic PNGs like `pixeldiff_test.go` already does.

Test:

- width/height extraction,
- top strip average,
- bottom strip average,
- near-color pass/fail,
- blank image detection.

### 11.5 Pyxis manual test

After implementation, create `examples/pyxis-public-shows.yaml` and run:

```bash
cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
GOWORK=off go run ./cmd/css-visual-diff run \
  --config /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/.../examples/pyxis-public-shows.yaml \
  --modes capture,cssdiff,matched-styles,pixeldiff
```

Validate:

- original full screenshot starts at `ppxis`, not `01 · Desktop`,
- footer is present,
- PNG validation passes,
- diff artifacts are created.

---

## 12. Detailed task list

### Phase 1: Config and schema

- [ ] Add `PrepareSpec` struct to `internal/cssvisualdiff/config/config.go`.
- [ ] Add `Prepare *PrepareSpec` to `Target`.
- [ ] Add `RootSelector string` to `Target`.
- [ ] Add validation rules for `prepare.type`.
- [ ] Add config tests for valid/invalid prepare specs.
- [ ] Update README with prepare config example.

### Phase 2: Browser driver helpers

- [ ] Add `WaitForFunction(expr string, timeout time.Duration)` to `driver.Page`.
- [ ] Add tests or smoke coverage for wait behavior if practical.
- [ ] Optionally add `Eval(script string)` convenience method.
- [ ] Optionally add `OuterHTML(selector string)` helper.

### Phase 3: Prepare hook implementation

- [ ] Create `internal/cssvisualdiff/modes/prepare.go`.
- [ ] Implement `prepareTarget(page, target)`.
- [ ] Implement `script` prepare.
- [ ] Implement `script_file` loading.
- [ ] Implement `direct-react-global` prepare.
- [ ] Add after-wait behavior.
- [ ] Return useful error messages when globals/components are missing.

### Phase 4: Wire prepare into existing modes

- [ ] Call `prepareTarget` in `capture.go` after navigation/wait.
- [ ] Call `prepareTarget` in `cssdiff.go` after navigation/wait.
- [ ] Call `prepareTarget` in `matched_styles.go` after navigation/wait.
- [ ] Decide whether to leave `compare.go` untouched initially or add a config-driven compare path.

### Phase 5: Robust PNG/root export

- [ ] In `capture.go`, use `target.RootSelector` or `target.Prepare.RootSelector` for full screenshot when available.
- [ ] Add output option `write_prepared_html`.
- [ ] Add function to write prepared root HTML.
- [ ] Add output option `write_inspect_json`.
- [ ] Add recursive inspect-tree evaluator.
- [ ] Include screenshot dimensions/bounds in `capture.json`.

### Phase 6: PNG/image validation

- [ ] Add `PNGStats` struct.
- [ ] Implement `AnalyzePNG(path, stripHeight)`.
- [ ] Add `TextExpectations` config for includes/excludes.
- [ ] Add optional `PNGExpectations` config for width/height/color checks.
- [ ] Add validation output to `capture.json` and `capture.md`.
- [ ] Add `validation.json` and `validation.md` if validation grows beyond capture.
- [ ] Add tests using synthetic PNGs.

### Phase 7: Pyxis example config

- [ ] Add `examples/pyxis-public-shows.yaml` to ticket or css-visual-diff repo.
- [ ] Configure original with `prepare.type: direct-react-global`.
- [ ] Configure React with Storybook iframe URL.
- [ ] Configure sections: full, header, nav, heading, grid, footer.
- [ ] Configure styles: header, h1, grid, footer.
- [ ] Run capture/cssdiff/matched-styles/pixeldiff.
- [ ] Save example output or summary screenshots.

### Phase 8: Storybook hygiene in Pyxis React repo

- [ ] Add page-level Storybook story for public Shows page at width 920.
- [ ] Add mobile story at width 390.
- [ ] Add stable `data-region` attributes to page regions.
- [ ] Ensure fonts/tokens load deterministically in Storybook iframe.
- [ ] Ensure MSW data matches prototype seed data.

### Phase 9: Report UX

- [ ] Add contact-sheet or side-by-side review report.
- [ ] Add HTML report that embeds original/react/diff images.
- [ ] Link computed CSS diffs and matched-style winners per section.
- [ ] Include validation failures prominently at the top.

---

## 13. Acceptance criteria

Implementation is acceptable when:

1. `css-visual-diff run` can load the Pyxis prototype URL and prepare it into a clean `#capture-root`.
2. The original full screenshot starts with the real `ppxis` header, not `01 · Desktop`.
3. The full screenshot includes the footer.
4. Header/nav/footer section screenshots are generated from both original and Storybook.
5. `cssdiff.json` reports computed style differences for configured props.
6. `matched-styles.json` reports winning selector differences for configured props.
7. `pixeldiff.json` and diff PNGs are generated.
8. Validation catches the original DesignCanvas capture failure if it happens again.
9. The workflow is documented with a Pyxis example config.

---

## 14. First implementation target: minimal useful prepare

If time is limited, implement only this minimal slice first:

```yaml
prepare:
  type: script
  wait_for: "window.React && window.ReactDOM && window.PPXDesktop"
  script: |
    document.body.innerHTML = '<div id="capture-root"></div>';
    document.body.style.margin = '0';
    document.body.style.background = '#fff';
    const root = document.getElementById('capture-root');
    root.style.width = '920px';
    root.style.background = '#fff';
    ReactDOM.createRoot(root).render(React.createElement(PPXDesktop, { page: 'shows' }));
  after_wait_ms: 1000
```

This avoids building `direct-react-global` immediately. Once script prepare works, `direct-react-global` is a convenience wrapper.

Minimal code changes:

- `PrepareSpec` with `type`, `wait_for`, `script`, `script_file`, `after_wait_ms`.
- `prepareTarget` supporting only `script`.
- wire into `capture`, `cssdiff`, `matched-styles`.

Then iterate.

---

## 15. Why this matters for Storybook pixel work

Pixel-perfect porting is not just “look at two screenshots.” The hard part is creating a stable loop:

```text
capture → compare → diagnose → edit CSS → rerun
```

The prepare hook ensures the original side is clean. PNG validation ensures we do not trust wrong captures. `css-visual-diff` already supplies the comparison engine. Storybook supplies deterministic React render targets.

Together, this becomes a reusable workflow for future projects:

```text
prototype/design source
    ↓ prepare
clean original target
    ↓ compare with Storybook iframe
pixel/style/cascade diffs
    ↓ fix React CSS
pixel-perfect component library
```
