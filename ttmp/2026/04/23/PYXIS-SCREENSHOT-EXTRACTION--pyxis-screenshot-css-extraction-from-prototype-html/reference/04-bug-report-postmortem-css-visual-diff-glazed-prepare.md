---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/cmd/css-visual-diff/main.go
      Note: RunSettings tag fix and AI-review profile flag wiring
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/cmd/css-visual-diff/main_test.go
      Note: Regression tests for run --config decoding and AI-review profile flags
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/llm/bootstrap.go
      Note: Geppetto/Pinocchio API drift fix for profile selection and inference debug trace
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/llm/image_question_client.go
      Note: Profile-backed image question client restored and committed
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/cssdiff.go
      Note: Nil slice to empty array fix for browser-side CSS diff JavaScript
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/glazed/pkg/cmds/fields/initialize-struct.go
      Note: Glazed DecodeInto implementation showing only glazed tags are recognized
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Bug Report and Postmortem: css-visual-diff Prepare, Glazed Decoding, and Capture Validation

## 1. What failed

The new `css-visual-diff` prepare system was implemented so that a page could be loaded, transformed into a clean comparison target, and then captured. The first unit tests passed, but the first real command-line smoke test failed before it ever reached the browser:

```text
Error: --config is required
exit status 1
```

This was surprising because the command had been invoked with `--config`:

```bash
GOWORK=off go run ./cmd/css-visual-diff run \
  --config "$TMP/config.yaml" \
  --modes capture,cssdiff,pixeldiff
```

The command help also showed the flag. Cobra knew about `--config`. The problem was later in the pipeline: Glazed had parsed the flag, but the `RunSettings` struct did not receive it.

This chapter explains the bug, the investigation, and the fixes. The important lesson is not merely that one struct tag was wrong. The deeper lesson is that a Glazed command has two separate contracts:

1. The command description declares fields such as `config`, `modes`, and `dry-run`.
2. The settings struct maps parsed field values into Go fields using `glazed:"..."` tags.

If those contracts disagree, Cobra can show a flag and Glazed can parse it, but the command logic still sees an empty setting.

---

## 2. The command path

A Glazed CLI command has a short but important path from terminal input to typed settings:

```text
shell args
  ↓
Cobra flags
  ↓
Glazed parser middleware
  ↓
values.Values
  ↓
DecodeSectionInto(schema.DefaultSlug, &settings)
  ↓
RunIntoGlazeProcessor
```

For `css-visual-diff run`, the relevant code lives in:

```text
cmd/css-visual-diff/main.go
```

The command declares its flags with `fields.New(...)`:

```go
fields.New(
    "config",
    fields.TypeString,
    fields.WithHelp("Path to css-visual-diff YAML config"),
)
```

Later, `RunIntoGlazeProcessor` decodes the parsed values:

```go
settings := &RunSettings{}
if err := vals.DecodeSectionInto(schema.DefaultSlug, settings); err != nil {
    return err
}
if settings.Config == "" {
    return fmt.Errorf("--config is required")
}
```

The failure means `settings.Config` remained empty after decoding. That narrowed the problem to the mapping between `values.Values` and `RunSettings`.

---

## 3. The root cause: the wrong struct tag

The settings struct used this tag form:

```go
type RunSettings struct {
    Config string `glazed.parameter:"config"`
}
```

The local Glazed source in:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/glazed/pkg/cmds/fields/initialize-struct.go
```

shows that `DecodeInto` only looks for the `glazed` tag:

```go
tag, ok := structField.Tag.Lookup("glazed")
if !ok {
    continue
}
```

It does not look for `glazed.parameter`. This is the decisive line. The field existed, the flag existed, and the value existed in the parsed field map, but `DecodeInto` ignored the struct field because the tag key was wrong.

The fix was to change:

```go
Config string `glazed.parameter:"config"`
```

to:

```go
Config string `glazed:"config"`
```

and to apply the same correction to every `RunSettings` field:

```go
type RunSettings struct {
    Config             string   `glazed:"config"`
    Modes              string   `glazed:"modes"`
    DryRun             bool     `glazed:"dry-run"`
    PixelDiffThreshold int      `glazed:"pixeldiff-threshold"`
    ProfileConfigFile  string   `glazed:"profile-config-file"`
    Profile            string   `glazed:"profile"`
    ProfileRegistries  []string `glazed:"profile-registries"`
}
```

A regression test was added:

```text
cmd/css-visual-diff/main_test.go
```

The test builds the Glazed/Cobra command, passes `--config`, runs in `--dry-run` mode, and verifies that the command no longer fails with `--config is required`.

---

## 4. Why the bug survived the first implementation pass

The prepare work initially had good unit coverage around the new pieces:

- config schema validation,
- prepare script generation,
- root selector selection,
- PNG validation helpers,
- text expectation helpers.

Those tests exercised internal functions directly. They did not exercise the full Glazed command path. That left a gap: the CLI could be syntactically valid while its decoded settings were wrong.

The missing test was not a browser test. It was simpler and more valuable:

```text
Can the `run` command decode `--config` through Glazed into `RunSettings.Config`?
```

Once that test existed, the failure became obvious.

---

## 5. The second issue: local Geppetto/Pinocchio API drift

After fixing the Glazed tag, `go test ./cmd/css-visual-diff` failed with compile errors in the LLM bootstrap layer:

```text
internal/cssvisualdiff/llm/bootstrap.go:62:49: r.Resolved.ProfileSelection undefined
internal/cssvisualdiff/llm/bootstrap.go:65:38: r.Resolved.ProfileSelection undefined
internal/cssvisualdiff/llm/bootstrap.go:98:3: cannot use r.Resolved ... as *bootstrap.ResolvedInferenceTrace
```

This was not the same bug. It appeared because `css-visual-diff` uses local replacements:

```go
replace github.com/go-go-golems/pinocchio => ../pinocchio
replace github.com/go-go-golems/geppetto => ../geppetto
```

The local `pinocchio` package aliases Geppetto's current `ResolvedCLIEngineSettings`:

```go
type ResolvedCLIEngineSettings = bootstrap.ResolvedCLIEngineSettings
```

The current Geppetto structure stores profile selection under `ProfileRuntime.ProfileSettings`, not `ProfileSelection`. It also expects inference debug output to receive a smaller `ResolvedInferenceTrace`, not the whole resolved engine settings object.

The fixes were:

```go
func SelectedProfile(r *BootstrapResult) string {
    if r == nil || r.Resolved == nil || r.Resolved.ProfileRuntime == nil {
        return ""
    }
    return strings.TrimSpace(r.Resolved.ProfileRuntime.ProfileSettings.Profile)
}
```

and:

```go
&geppettobootstrap.ResolvedInferenceTrace{
    FinalInferenceSettings: r.Resolved.FinalInferenceSettings,
    ResolvedEngineProfile:  r.Resolved.ResolvedEngineProfile,
}
```

This restored compatibility with the local workspace versions of Geppetto and Pinocchio.

---

## 6. The third issue: nil slices become JavaScript `null`

After the CLI decoded correctly, the prepare smoke test reached capture and CSS diff mode. Capture succeeded. Then CSS diff failed in the browser with:

```text
TypeError: Cannot read properties of null (reading 'forEach')
```

The failing JavaScript came from `evaluateStyle` in:

```text
internal/cssvisualdiff/modes/cssdiff.go
```

The Go code marshaled `spec.Attributes` directly:

```go
attrsJSON, _ := json.Marshal(spec.Attributes)
```

When `spec.Attributes` was nil, JSON produced:

```json
null
```

The generated browser script then did:

```js
attrs.forEach((a) => { ... })
```

but `attrs` was `null`, not an array.

The fix was to normalize nil slices before marshaling:

```go
props := spec.Props
if props == nil {
    props = []string{}
}
attrs := spec.Attributes
if attrs == nil {
    attrs = []string{}
}
propsJSON, _ := json.Marshal(props)
attrsJSON, _ := json.Marshal(attrs)
```

This is a small example of a common cross-language boundary bug. Go distinguishes nil slices from empty slices; JavaScript code usually expects arrays to be arrays. When Go emits JSON for browser-side code, nil slices should be made explicit if the JavaScript will call array methods.

---

## 7. The restored AI-review work

Before the bug investigation, the `css-visual-diff` repository had uncommitted AI-review changes. To avoid mixing them into the Glazed decoding fix, the worktree was stashed first:

```bash
git stash push -u -m "pre-existing ai-review cli work before glazed config decode fix"
```

After the fix was committed, the stash was popped and conflicts were resolved by keeping both sets of changes:

- the corrected `glazed:"..."` tags,
- the AI-review profile flags,
- the new profile-backed image question client,
- the existing regression test for `--config` decoding.

The restored AI-review commit adds:

```text
internal/cssvisualdiff/llm/image_question_client.go
```

and wires `ai-review` so it can use a real Geppetto/Pinocchio-backed image client when profile settings are provided. The default remains safe: if no client is supplied, the runner falls back to the existing no-op AI client.

---

## 8. Verification

The final validation had three layers.

### 8.1 Unit and package tests

```bash
cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
go test ./...
```

Result:

```text
ok   github.com/go-go-golems/css-visual-diff/cmd/css-visual-diff
ok   github.com/go-go-golems/css-visual-diff/internal/cssvisualdiff/config
ok   github.com/go-go-golems/css-visual-diff/internal/cssvisualdiff/dsl
ok   github.com/go-go-golems/css-visual-diff/internal/cssvisualdiff/llm
ok   github.com/go-go-golems/css-visual-diff/internal/cssvisualdiff/modes
```

### 8.2 CLI decoding regression

The new regression test builds the command through Glazed and Cobra, passes `--config`, and expects dry-run success:

```go
cmd.SetArgs([]string{
    "--config", configPath,
    "--dry-run",
    "--modes", "capture",
    "--output", "json",
})
```

This proves the path from CLI flag to `RunSettings.Config` works.

### 8.3 End-to-end prepare smoke test

A temporary HTML page was served locally. The config used `prepare.type: script` to replace an unprepared shell:

```html
<div id="shell">unprepared shell chrome</div>
```

with a clean capture root:

```html
<main id="capture-root">
  <header>Prepared Header</header>
  <footer>Prepared Footer</footer>
</main>
```

The command was run with:

```bash
GOWORK=off go run ./cmd/css-visual-diff run \
  --config "$TMP/config.yaml" \
  --modes capture,cssdiff,pixeldiff \
  --output json
```

The output artifacts included:

```text
capture.json
capture.md
cssdiff.json
cssdiff.md
original-full.png
original-inspect.json
original-prepared.html
pixeldiff.json
pixeldiff.md
pixeldiff_full_diff_comparison.png
pixeldiff_full_diff_only.png
react-full.png
react-inspect.json
react-prepared.html
```

The validation statuses were:

```text
validation_statuses ['ok', 'ok']
```

This is the important proof: the command now decodes config, prepares both targets, captures prepared roots, validates the screenshots, computes CSS diffs, and computes pixel diffs.

---

## 9. Commit history

The fixes and cleanup were committed in `css-visual-diff` as:

```text
114417b fix(cli): decode run config with Glazed tags
38df841 feat(ai-review): wire profile-backed image client
```

The earlier prepare implementation remains immediately before those commits:

```text
fba0b73 feat(config): add prepare target schema
6bf1b62 feat(modes): run prepare hooks before capture and style diffs
36c9eb6 feat(capture): screenshot prepared root when configured
151c6eb feat(capture): export prepared html and inspect json
86dee7b feat(capture): validate DOM text and PNG structure
0a36bb0 test(capture): cover selector and text validation helpers
665b94f docs: document prepare workflow and Pyxis example
```

The repository was clean after committing:

```bash
git status --short
```

produced no output.

---

## 10. The conceptual takeaway

The first bug was a boundary bug between two layers that looked like one layer. Cobra displayed `--config`, but Glazed decoding ignored the Go struct field. Once we separated those responsibilities, the fix was straightforward.

The second bug was a workspace version bug. Local `replace` directives mean the code must track the local shape of Geppetto and Pinocchio, not just the published module version in `go.mod`.

The third bug was a serialization bug. Go's nil slice became JavaScript `null`, and browser-side code treated it as an array.

The shared lesson is that integration failures often appear far from their cause:

| Symptom | Actual boundary | Fix |
|---|---|---|
| `--config is required` even though `--config` was passed | Glazed field decoding ignored `glazed.parameter` tags | Use `glazed:"..."` tags and add CLI decode regression test |
| Compile errors in LLM bootstrap | Local Geppetto/Pinocchio API drift | Use `ProfileRuntime.ProfileSettings` and `ResolvedInferenceTrace` |
| Browser `attrs.forEach` error | Go nil slice marshaled to JavaScript `null` | Normalize nil slices to empty slices before JSON marshaling |

A visual diff tool is only useful if its pipeline is trustworthy. The prepare system now has a working command path, a browser-backed smoke test, and validation checks that make wrong captures visible before they become baselines.

---

## 11. Future guardrails

The following guardrails would make this class of bug less likely:

- Every Glazed command should have at least one test that builds the Cobra command and decodes a real flag into settings.
- Settings structs should use only `glazed:"..."` tags; legacy-looking tags such as `glazed.parameter:"..."` should be rejected by review or lint.
- Browser-evaluated JavaScript should never receive nullable arrays unless it explicitly handles `null`.
- Local `replace` directives should be treated as active dependencies: when Geppetto or Pinocchio changes shape, dependent repos should be tested immediately.
- End-to-end smoke tests should run at least `capture,cssdiff,pixeldiff`, because capture-only tests do not exercise the JavaScript generated by CSS diff mode.
