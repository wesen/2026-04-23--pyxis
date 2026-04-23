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
      Note: CLI entrypoint for run
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/llm/review.go
      Note: Comparison-oriented multimodal prompt construction
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/ai_review.go
      Note: Config-driven per-image ai-review mode
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/geppetto/pkg/inference/engine/factory/factory.go
      Note: Geppetto provider/engine selection used by Pinocchio profiles
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/geppetto/pkg/steps/ai/openai/helpers.go
      Note: OpenAI-compatible multimodal image serialization
    - Path: ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/scripts/01-run-button-primary-llm-review-zai.sh
      Note: Reproducible Z.ai GLM-5V-Turbo button-primary review command
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# css-visual-diff LLM Review: Analysis, Design, and Implementation Guide

## 1. Executive summary

This document explains how the LLM functionality in `css-visual-diff` works, how it connects to Geppetto and Pinocchio profiles, how we attempted to use Z.ai's `glm-5v-turbo`, and what happened when we tested the system on the Pyxis `button-primary` atom.

The short answer is:

- The `css-visual-diff` LLM plumbing is present and functional.
- The Z.ai profile was added and resolved correctly through Pinocchio/Geppetto.
- The first Z.ai inference attempt failed with a provider-side billing/resource error (`429`, code `1113`), but after credits were added to the API key the same command succeeded.
- The successful Z.ai `glm-5v-turbo` run produced `llm-review.json` / `llm-review.md` for `button-primary`.
- Token usage is now printed to stdout and written into `llm-review.md`; the successful Z.ai run used 485 input tokens, 1140 output tokens, 1625 total input+output tokens, 579 reasoning tokens, 2 cached tokens, and took 23730 ms.
- To validate the `css-visual-diff` LLM path independently of the original Z.ai account issue, we also ran the same `button-primary` comparison through an existing Gemini profile. That run succeeded and produced `llm-review.json` / `llm-review.md`.
- The quality of results is useful when the selector and structured evidence are correct. The best run used the actual `button` element selector, not the outer `[data-comp]` wrapper.
- The weaker `ai-review` mode, which asks the model to describe each screenshot independently, completed but produced a hallucinated answer for the tiny button screenshot. For Pyxis repair work, the comparison-oriented `llm-review` command is currently much more useful than the per-image `ai-review` mode.

The practical conclusion for a new engineer is:

> Use `llm-review` as an assistant that explains a single visual discrepancy using screenshots plus CSS evidence. Do not treat its answer as authoritative. Its quality depends strongly on selector precision, prompt quality, model quality, and whether the CSS evidence describes the actual element that you care about.

---

## 2. What problem are we solving?

Visual regression work often starts with a screenshot that says: "these two things are different." That is helpful, but it does not tell you why. A pixel diff can show that a button changed by 33%, but the next question is the engineering question:

- Is the button too tall?
- Is the text size different?
- Is the border radius wrong?
- Is the icon missing?
- Is the problem a design token, inline style, CSS module, inherited global style, or an asset difference?

`css-visual-diff` answers part of this with structured artifacts:

- element screenshots,
- pixel-diff images,
- computed CSS differences,
- matched/winning CSS rules,
- DOM and layout inspection JSON.

The LLM feature adds one more layer: it asks a vision-capable model to read those artifacts and summarize the likely frontend cause in human language. This is useful for onboarding and triage because it turns raw evidence into an initial hypothesis.

The LLM is not supposed to replace the diff. It is supposed to narrate the diff.

---

## 3. Important repositories and files

### 3.1 Pyxis repository

```text
/home/manuel/code/wesen/2026-04-23--pyxis
```

Important Pyxis files for this task:

```text
prototype-design/Pyxis Public Site.html
prototype-design/lib/components.jsx
web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/11-run-pyxis-atom-diff.sh
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/12-serve-atom-diff-report.sh
```

The atom diff report used in this test is served from:

```text
http://localhost:8792/test.html
```

and its prepared HTML files are served from:

```text
http://localhost:8792/original-prepared.html
http://localhost:8792/react-prepared.html
```

### 3.2 css-visual-diff repository

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
```

Important source files:

```text
cmd/css-visual-diff/main.go
internal/cssvisualdiff/llm/bootstrap.go
internal/cssvisualdiff/llm/image_question_client.go
internal/cssvisualdiff/llm/review.go
internal/cssvisualdiff/modes/ai_review.go
internal/cssvisualdiff/modes/compare.go
internal/cssvisualdiff/runner/runner.go
internal/cssvisualdiff/config/config.go
```

Important example configs:

```text
examples/pyxis-atoms-prototype-vs-storybook.yaml
```

### 3.3 Geppetto and Pinocchio repositories

They live next to `css-visual-diff`:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/geppetto
/home/manuel/workspaces/2026-04-21/hair-v2/pinocchio
```

Important Geppetto files:

```text
geppetto/pkg/inference/engine/factory/factory.go
geppetto/pkg/steps/ai/openai/chat_stream.go
geppetto/pkg/steps/ai/openai/helpers.go
geppetto/pkg/steps/ai/openai/chat_types.go
geppetto/pkg/steps/ai/settings/settings-inference.go
geppetto/pkg/steps/ai/types/types.go
```

Important Pinocchio profile example:

```text
pinocchio/examples/js/profiles/basic.yaml
```

---

## 4. The two LLM paths in css-visual-diff

There are currently two LLM-related workflows. They have similar names, but they solve different problems.

### 4.1 `llm-review` command: compare two regions, then ask an LLM

The `llm-review` command is defined in:

```text
cmd/css-visual-diff/main.go
```

It is a standalone Cobra command:

```bash
css-visual-diff llm-review \
  --url1 ... \
  --selector1 ... \
  --url2 ... \
  --selector2 ... \
  --profile ... \
  --profile-registries ...
```

It performs three steps:

```text
1. Generate a compare result for one element/region.
2. Write compare artifacts: screenshots, pixel diff, computed CSS diff.
3. Send screenshots + structured evidence to a multimodal LLM and write llm-review.json/md.
```

In pseudocode:

```text
bootstrap = ResolveEngineSettings(profile, registries)
settings = buildCompareModeSettings(flags)
compareResult = GenerateCompareResult(settings)
WriteCompareArtifacts(compareResult)
review = ReviewCompare(bootstrap, question, compareResult)
WriteReviewJSON(review)
WriteReviewMarkdown(review)
print(review.answer)
```

The core implementation is:

```text
internal/cssvisualdiff/llm/review.go
```

The most important functions are:

```go
func ReviewCompare(ctx context.Context, bootstrap *BootstrapResult, opts ReviewOptions) (ReviewResult, error)
func BuildReviewPromptText(opts ReviewOptions) string
func BuildReviewImages(evidence modes.CompareResult) ([]map[string]any, map[string]string, error)
func WriteReviewJSON(path string, result ReviewResult) error
func WriteReviewMarkdown(path string, result ReviewResult) error
```

This is the better path for visual QA because the prompt contains both images and structured CSS evidence.

### 4.2 `ai-review` mode: ask one question about each captured section image

The `ai-review` mode is part of the config-driven `run` command:

```bash
css-visual-diff run --config some.yaml --modes capture,ai-review --profile ...
```

It is implemented in:

```text
internal/cssvisualdiff/modes/ai_review.go
```

It works by reading `capture.json`, finding sections with `ocr_question`, and asking the LLM the same question for each side independently.

Pseudocode:

```text
capture = read output/capture.json
for each section in config.sections:
    if section.ocr_question is empty:
        continue
    answerOriginal = client.AnswerQuestion(originalScreenshot, ocrQuestion)
    answerReact = client.AnswerQuestion(reactScreenshot, ocrQuestion)
write ai-review.json
write ai-review.md
```

The client used by real runs is:

```text
internal/cssvisualdiff/llm/image_question_client.go
```

This mode can answer questions like:

- "Does this screenshot include the footer?"
- "Is there a visible button?"
- "Describe this UI section."

It is weaker for comparison because it does not naturally see both screenshots and the CSS evidence together. In this test, it also hallucinated details for a tiny button screenshot, so it should be used cautiously.

---

## 5. Architecture diagram

```text
┌──────────────────────────────────────────────────────────────────────┐
│                       css-visual-diff CLI                            │
└──────────────────────────────────────────────────────────────────────┘
          │
          │ llm-review command
          ▼
┌────────────────────────────┐
│ modes.GenerateCompareResult│
│                            │
│ - navigate URL1            │
│ - query selector1          │
│ - screenshot element       │
│ - collect computed CSS     │
│ - navigate URL2            │
│ - query selector2          │
│ - screenshot element       │
│ - pixel diff images        │
└────────────────────────────┘
          │
          │ CompareResult
          ▼
┌────────────────────────────┐
│ llm.BuildReviewPromptText  │
│                            │
│ Prompt includes:           │
│ - user question            │
│ - target URLs/selectors    │
│ - pixel diff summary       │
│ - computed CSS diffs       │
│ - winning rule diffs       │
└────────────────────────────┘
          │
          │ screenshots + prompt
          ▼
┌────────────────────────────┐
│ Geppetto Turn              │
│                            │
│ System text block          │
│ User multimodal block      │
│   - text prompt            │
│   - left screenshot        │
│   - right screenshot       │
│   - diff screenshot        │
└────────────────────────────┘
          │
          │ engine from profile
          ▼
┌────────────────────────────┐
│ Pinocchio profile resolver │
│ + Geppetto engine factory  │
└────────────────────────────┘
          │
          │ API request
          ▼
┌────────────────────────────┐
│ Provider                   │
│                            │
│ Z.ai GLM-5V-Turbo, Gemini, │
│ OpenAI-compatible models,  │
│ etc.                       │
└────────────────────────────┘
          │
          │ answer
          ▼
┌────────────────────────────┐
│ llm-review.json/md         │
└────────────────────────────┘
```

---

## 6. Z.ai GLM-5V-Turbo integration notes

The Z.ai documentation we used is stored in the ticket:

```text
sources/zai-glm-5v-turbo-docs.md
sources/zai-chat-completion-api-docs.md
```

The relevant public documentation pages were:

```text
https://docs.z.ai/guides/vlm/glm-5v-turbo
https://docs.z.ai/api-reference/llm/chat-completion
```

The GLM-5V-Turbo guide shows a Chat Completions style request:

```http
POST https://api.z.ai/api/paas/v4/chat/completions
Authorization: Bearer <api-key>
Content-Type: application/json
```

Example request shape from the docs:

```json
{
  "model": "glm-5v-turbo",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "https://example.com/image.png"
          }
        },
        {
          "type": "text",
          "text": "Where is the second bottle?"
        }
      ]
    }
  ],
  "thinking": {
    "type": "enabled"
  }
}
```

Geppetto's OpenAI-compatible Chat Completions implementation builds requests of this general shape. For local image files, it converts image bytes to data URLs:

```json
{
  "type": "image_url",
  "image_url": {
    "url": "data:image/png;base64,...",
    "detail": "auto"
  }
}
```

The relevant Geppetto code is:

```text
geppetto/pkg/steps/ai/openai/helpers.go
geppetto/pkg/steps/ai/openai/chat_types.go
geppetto/pkg/steps/ai/openai/chat_stream.go
```

### 6.1 Profile we added

The user supplied a Z.ai API key in:

```text
/tmp/z-api-key
```

A local, uncommitted Pinocchio profile registry was created at:

```text
/home/manuel/.pinocchio/config/profiles.yaml
```

The profile is intentionally not committed because it contains a secret. Its redacted shape is:

```yaml
---
slug: z-ai-local
profiles:
  z-ai-glm-5v-turbo:
    slug: z-ai-glm-5v-turbo
    display_name: Z.ai GLM-5V Turbo
    description: OpenAI-compatible Z.ai GLM-5V-Turbo profile for css-visual-diff multimodal visual review.
    inference_settings:
      chat:
        api_type: openai
        engine: glm-5v-turbo
        max_response_tokens: 2048
        stream: true
      api:
        api_keys:
          openai-api-key: <redacted>
        base_urls:
          openai-base-url: https://api.z.ai/api/paas/v4
      client:
        timeout_seconds: 180
```

The `openai-base-url` is the API root, not the final endpoint. Geppetto appends `/chat/completions`, producing:

```text
https://api.z.ai/api/paas/v4/chat/completions
```

This matches the Z.ai docs.

### 6.2 Profile resolution succeeded

We tested profile resolution with:

```bash
cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
GOWORK=off go run ./cmd/css-visual-diff llm-review \
  --profile z-ai-glm-5v-turbo \
  --profile-registries /home/manuel/.pinocchio/config/profiles.yaml \
  --print-inference-settings \
  --url1 http://localhost:8792/original-prepared.html \
  --selector1 "[data-comp='button-primary']" \
  --url2 http://localhost:8792/react-prepared.html \
  --selector2 "[data-comp='button-primary']"
```

The resolved settings showed:

```text
api_type: openai
engine: glm-5v-turbo
openai-base-url: https://api.z.ai/api/paas/v4
openai-api-key: ***
```

This proves that the local profile registry is readable and that css-visual-diff can bootstrap a Geppetto engine from it.

### 6.3 Z.ai inference: first failure, then successful run after credits

The first Z.ai run failed with:

```text
chat completions error: status=429 body={"error":{"code":"1113","message":"Insufficient balance or no resource package. Please recharge."}}
```

This was not a css-visual-diff wiring failure. It was a provider-side refusal after authentication reached the Z.ai API. The request got far enough for Z.ai to return a structured error from its Chat Completions endpoint.

After credits were added to the API key, the same script succeeded:

```text
scripts/01-run-button-primary-llm-review-zai.sh
```

Output directory:

```text
various/button-primary-llm-review-zai/
```

Generated files include:

```text
compare.json
compare.md
llm-review.json
llm-review.md
url1_screenshot.png
url2_screenshot.png
diff_comparison.png
diff_only.png
```

The successful Z.ai run reported this token usage:

```text
Input tokens: 485
Output tokens: 1140
Total tokens: 1625
Cached tokens: 2
Reasoning tokens: 579
Max tokens: 2048
Duration: 23730 ms
```

---

## 7. Button-primary test setup

The test target was the `button-primary` atom from the atom-level visual diff report.

First, the atom report must exist and be served:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/11-run-pyxis-atom-diff.sh
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/12-serve-atom-diff-report.sh
```

This serves:

```text
http://localhost:8792/test.html
http://localhost:8792/original-prepared.html
http://localhost:8792/react-prepared.html
```

Then `llm-review` compares this pair:

```text
URL 1:    http://localhost:8792/original-prepared.html
Selector: [data-comp='button-primary'] button

URL 2:    http://localhost:8792/react-prepared.html
Selector: [data-comp='button-primary'] button
```

The final selector includes `button` because we want computed CSS from the actual clickable element, not from the outer wrapper span.

This distinction matters. A previous wrapper-level run used:

```text
[data-comp='button-primary']
```

That captured the right pixels, but some computed CSS properties came from the wrapper span rather than the button. The LLM then over-emphasized a text color difference that was not actually visible in the button screenshot. The better selector fixed that evidence problem.

---

## 8. Successful fallback test with Gemini

Because the Z.ai account could not run inference, we used an existing Gemini profile to test the `css-visual-diff` LLM path:

```text
profile: gemini-2.5-flash-lite
registry: /home/manuel/.config/pinocchio/profiles.yaml
```

Run script:

```text
scripts/02-run-button-primary-llm-review-gemini.sh
```

Output directory:

```text
various/button-primary-llm-review-gemini-button-selector/
```

Generated files:

```text
compare.json
compare.md
llm-review.json
llm-review.md
url1_full.png
url1_screenshot.png
url2_full.png
url2_screenshot.png
diff_comparison.png
diff_only.png
```

### 8.1 Structured comparison evidence

From `compare.md`:

```text
Pixel Diff Stats
- Total pixels: 4920
- Changed pixels: 1642
- Changed percent: 33.3740%
- Normalized size: 123x40
```

Computed CSS differences:

| Property | Prototype | React Storybook |
|---|---:|---:|
| `height` | `33.5938px` | `40px` |
| `width` | `117.422px` | `123.141px` |
| `padding-top` | `8px` | `7px` |
| `padding-bottom` | `8px` | `7px` |
| `font-size` | `13px` | `14px` |
| `font-weight` | `500` | `400` |
| `line-height` | `15.6px` | `16.8px` |
| `border-radius` | `8px` | `0px` |

Winning/matched style evidence shows these are mostly inline-style or token-resolved differences:

```text
height: prototype none -> React style attribute (40px)
font-size: prototype style attribute (13px) -> React style attribute (0.875rem)
font-weight: prototype style attribute (500) -> React style attribute (var(--weight-medium))
border-radius: prototype style attribute (8px) -> React style attribute (var(--radius-md))
```

### 8.2 LLM answer quality

The successful `llm-review` answer said, in summary:

- The React button is taller than the prototype.
- The React button uses larger text and line-height.
- The React button has square corners because `border-radius` resolves to `0px`.
- The React button has lower font weight.
- The likely causes are token/style differences in padding, size, line-height, font weight, and radius.

This is a good result. It is not perfect—the sentence "taller due to reduced top/bottom padding" is slightly imprecise because the taller height is mostly from the explicit `height: 40px` and larger font metrics, not reduced padding. But the answer correctly found the important mismatch and pointed to the right files/tokens to inspect.

The most useful part of the answer is the ranked list:

1. border radius,
2. height/dimensions,
3. font size/line height,
4. font weight,
5. width as a consequence.

That ranking is exactly the kind of triage help we want from an LLM visual reviewer.

---

## 9. Per-image `ai-review` mode test

We also tested the config-driven `ai-review` mode with Gemini.

Config:

```text
sources/button-primary-ai-review-gemini.yaml
```

Run script:

```text
scripts/03-run-button-primary-ai-review-gemini.sh
```

Command shape:

```bash
css-visual-diff run \
  --config sources/button-primary-ai-review-gemini.yaml \
  --modes capture,ai-review \
  --profile gemini-2.5-flash-lite \
  --profile-registries /home/manuel/.config/pinocchio/profiles.yaml
```

Result:

```text
capture: ok
ai-review: ok
coverage total: 1
missing/hidden: 0
```

Output directory:

```text
various/button-primary-ai-review-gemini/
```

This proves that the `run --modes ai-review` path is operational. However, the answer quality was poor for this tiny button screenshot. The model described a blue "Add to cart" button with a cart icon even though the image is a red "Get tickets" button with a chevron.

A separate visual check of the exact generated PNG confirmed the screenshot itself is correct:

```text
Text: Get tickets
Background: red / burnt orange
Text/icon: white
Icon: right chevron
Shape: rounded rectangle/pill-like button
```

The lesson is:

> `ai-review` can run, but do not rely on it for tiny isolated screenshots unless the prompt is carefully designed and the model is known to be reliable for small UI elements. For actionable Pyxis repair work, prefer `llm-review`, because it supplies side-by-side evidence and computed CSS diffs.

---

## 10. Implementation details for interns

This section walks through the code path slowly. The goal is to make the system understandable enough that you can debug it without guessing.

### 10.1 CLI entrypoint

The CLI starts in:

```text
cmd/css-visual-diff/main.go
```

The relevant command constructors are:

```go
rootCmd.AddCommand(newCompareCommand())
rootCmd.AddCommand(newLLMReviewCommand())
```

The `llm-review` command owns these settings:

```go
type llmReviewSettings struct {
    compareSettings

    Question          string
    ConfigFile        string
    Profile           string
    ProfileRegistries []string

    WriteReviewJSON        bool
    WriteReviewMarkdown    bool
    PrintInferenceSettings bool
}
```

The flags you usually care about are:

| Flag | Meaning |
|---|---|
| `--url1` | First page URL. |
| `--selector1` | CSS selector on first page. |
| `--url2` | Second page URL. |
| `--selector2` | CSS selector on second page. |
| `--props` | Comma-separated CSS properties to compare. |
| `--out` | Output directory. |
| `--question` | Natural-language question for the LLM. |
| `--profile` | Pinocchio profile slug. |
| `--profile-registries` | Profile registry YAML path. |

The command first resolves the profile:

```go
bootstrapResult, err := llm.ResolveEngineSettings(cmd.Context(), llm.BootstrapOptions{
    ConfigFile:        settings.ConfigFile,
    Profile:           settings.Profile,
    ProfileRegistries: settings.ProfileRegistries,
})
```

Then it runs the compare:

```go
compareSettings := buildCompareModeSettings(&settings.compareSettings)
result, err := modes.GenerateCompareResult(cmd.Context(), compareSettings)
```

Then it asks the LLM:

```go
review, err := llm.ReviewCompare(cmd.Context(), bootstrapResult, llm.ReviewOptions{
    Question: settings.Question,
    Evidence: result,
})
```

### 10.2 Profile resolution

Profile resolution lives in:

```text
internal/cssvisualdiff/llm/bootstrap.go
```

The main function is:

```go
func ResolveEngineSettings(ctx context.Context, opts BootstrapOptions) (*BootstrapResult, error)
```

It delegates to Pinocchio:

```go
parsed, err := profilebootstrap.NewCLISelectionValues(...)
resolved, err := profilebootstrap.ResolveCLIEngineSettings(ctx, parsed)
```

The result is a `BootstrapResult`:

```go
type BootstrapResult struct {
    Parsed   *values.Values
    Resolved *profilebootstrap.ResolvedCLIEngineSettings
}
```

When the LLM call is ready, the code builds a Geppetto engine:

```go
func (r *BootstrapResult) BuildEngine() (geppettoengine.Engine, error) {
    return profilebootstrap.NewEngineFromResolvedCLIEngineSettings(r.Resolved)
}
```

For the Z.ai profile, the selected engine path is OpenAI-compatible Chat Completions because:

```yaml
api_type: openai
engine: glm-5v-turbo
openai-base-url: https://api.z.ai/api/paas/v4
```

### 10.3 Geppetto engine factory

The engine factory lives in:

```text
geppetto/pkg/inference/engine/factory/factory.go
```

The factory switches on `settings.Chat.ApiType`:

```go
switch provider {
case "openai", "anyscale", "fireworks":
    return openai.NewOpenAIEngine(settings)
case "open-responses", "openai-responses":
    return openai_responses.NewEngine(settings)
case "claude", "anthropic":
    return claude.NewClaudeEngine(settings)
case "gemini":
    return gemini.NewGeminiEngine(settings)
}
```

Because Z.ai exposes an OpenAI-compatible Chat Completions endpoint, we use:

```text
api_type: openai
```

not:

```text
api_type: openai-responses
```

### 10.4 Multimodal prompt construction

The comparison LLM prompt is built in:

```text
internal/cssvisualdiff/llm/review.go
```

The prompt includes:

- the human question,
- target URLs and selectors,
- viewport,
- changed pixel count and percentage,
- computed CSS property differences,
- winning CSS rule differences.

Pseudocode:

```text
prompt = []
prompt += "Compare these two rendered UI regions..."
prompt += "Question: " + userQuestion
prompt += "Targets: left URL/selector, right URL/selector"
prompt += "Pixel diff summary: changed pixels..."
prompt += "Computed property changes:"
for diff in computedDiffs:
    prompt += property + original + " -> " + react
prompt += "Winning rule changes:"
for diff in winnerDiffs:
    prompt += property + originalSelector + " -> " + reactSelector
```

The images are loaded from disk and base64 encoded:

```go
func BuildImagePayload(path string, required bool) (map[string]any, string, error) {
    content, err := os.ReadFile(path)
    return map[string]any{
        "media_type": detectImageMediaType(path),
        "content": base64.StdEncoding.EncodeToString(content),
    }, path, nil
}
```

Then the code creates a Geppetto turn:

```go
turn := &turns.Turn{}
turns.AppendBlock(turn, turns.NewSystemTextBlock(systemPrompt))
turns.AppendBlock(turn, turns.NewUserMultimodalBlock(promptText, images))
```

Geppetto translates that turn into the provider-specific request.

### 10.5 OpenAI-compatible image serialization

For the OpenAI-compatible path, Geppetto reads `PayloadKeyImages` and converts each image into a Chat Completions `image_url` part.

Relevant file:

```text
geppetto/pkg/steps/ai/openai/helpers.go
```

Conceptual output:

```json
{
  "role": "user",
  "content": [
    {"type": "text", "text": "Compare these two rendered UI regions..."},
    {
      "type": "image_url",
      "image_url": {
        "url": "data:image/png;base64,...",
        "detail": "auto"
      }
    }
  ]
}
```

The endpoint is assembled in:

```text
geppetto/pkg/steps/ai/openai/chat_stream.go
```

```go
endpoint := strings.TrimRight(baseURL, "/") + "/chat/completions"
```

For Z.ai:

```text
baseURL  = https://api.z.ai/api/paas/v4
endpoint = https://api.z.ai/api/paas/v4/chat/completions
```

---

## 11. Results and quality assessment

### 11.1 Does the LLM functionality work?

Yes, with an important qualification.

The software path works:

- profile resolution works,
- compare artifact generation works,
- image payload generation works,
- Geppetto engine construction works,
- LLM request/response works with a valid provider profile,
- `llm-review.md/json` are written,
- `ai-review.md/json` are written.

The Z.ai provider call did not complete because the account/key currently lacks balance or a resource package.

### 11.2 Did Z.ai GLM-5V-Turbo work?

Yes, after credits were added to the API key. The profile and endpoint resolved correctly before credits were added, but the provider returned `429 code=1113` until the account had an available balance/resource package. After that, the same command completed and wrote both JSON and Markdown review artifacts.

The answer quality was strong for the `button-primary` test. GLM-5V-Turbo correctly identified:

- the critical loss of border radius (`8px -> 0px`),
- the dimensional increase (`33.6px -> 40px` height),
- the typography drift (`13px/500 -> 14px/400`),
- the likely token/style causes,
- the likely layout and visual hierarchy impact.

### 11.3 Did another model prove the code path?

Yes. `gemini-2.5-flash-lite` completed the `button-primary` `llm-review` run.

### 11.4 Was the answer good?

The best `llm-review` answer was useful. It correctly identified the important issues:

- React button is taller.
- React button has larger text.
- React button has different font weight.
- React button has incorrect/square border radius.
- The likely causes are style/token mismatches.

The answer was not perfect. It partially mis-explained the relationship between padding and height. This is normal LLM behavior: it can summarize evidence well, but it may also over-infer causality. The correct engineering workflow is:

```text
LLM proposes hypothesis
  ↓
engineer checks compare.md / cssdiff / source code
  ↓
engineer edits code
  ↓
rerun visual diff
```

### 11.5 What did we learn about selectors?

Selector precision is critical.

Bad selector for CSS evidence:

```text
[data-comp='button-primary']
```

Better selector:

```text
[data-comp='button-primary'] button
```

The wrapper selector captured a visually useful screenshot but reported some computed properties from the wrapper, not the button. The LLM then treated those computed properties as meaningful button differences. The actual button selector produced better evidence and a better answer.

---

## 12. Recommended intern workflow

Use this workflow when applying LLM review to another Pyxis component.

### Step 1: Generate and serve the atom report

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/11-run-pyxis-atom-diff.sh
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/12-serve-atom-diff-report.sh
```

Verify this opens:

```text
http://localhost:8792/test.html
```

### Step 2: Choose the smallest exact selector

Use the actual element, not just the fixture wrapper.

Examples:

```text
button-primary wrapper: [data-comp='button-primary']
button-primary element: [data-comp='button-primary'] button
badge element:         [data-comp='badge-confirmed'] > span
input element:         [data-comp='input-search'] input
select element:        [data-comp='select-status'] select
```

### Step 3: Pick relevant CSS properties

For buttons:

```text
height,width,padding-top,padding-right,padding-bottom,padding-left,font-size,font-weight,line-height,color,background-color,border-radius,border-top-width,border-top-color,gap,display,align-items
```

For text-heavy components, add:

```text
font-family,letter-spacing,text-transform
```

For layout containers, add:

```text
display,grid-template-columns,gap,align-items,justify-content,margin,padding
```

### Step 4: Run `llm-review`

Use the Gemini fallback script as a known-good example:

```bash
scripts/02-run-button-primary-llm-review-gemini.sh
```

For Z.ai, use:

```bash
scripts/01-run-button-primary-llm-review-zai.sh
```

but expect the current 429 billing/resource error until the Z.ai account is funded.

### Step 5: Read files in this order

```text
compare.md
llm-review.md
diff_comparison.png
url1_screenshot.png
url2_screenshot.png
compare.json
```

Read `compare.md` first because it is ground truth from the browser. Read `llm-review.md` second because it is an interpretation of that ground truth.

### Step 6: Convert the answer into a fix plan

For `button-primary`, the current concrete fix candidates are:

- make React primary button radius match prototype `8px`, or decide that tokenized `var(--radius-md)` should resolve to `8px`,
- remove or adjust explicit `height: 40px` if matching prototype height is desired,
- align font size from `14px` to `13px`, or document the intentional design-system drift,
- align font weight from `400` to `500`, or fix `--weight-medium` if it currently resolves incorrectly,
- rerun atom diff after each focused fix.

---

## 13. Testing checklist

Before saying "the LLM review works," check each layer.

### Profile layer

```bash
css-visual-diff llm-review \
  --profile z-ai-glm-5v-turbo \
  --profile-registries /home/manuel/.pinocchio/config/profiles.yaml \
  --print-inference-settings \
  --url1 http://localhost:8792/original-prepared.html \
  --selector1 "[data-comp='button-primary'] button" \
  --url2 http://localhost:8792/react-prepared.html \
  --selector2 "[data-comp='button-primary'] button"
```

Check for:

```text
api_type: openai
engine: glm-5v-turbo
openai-base-url: https://api.z.ai/api/paas/v4
```

### Browser/capture layer

Make sure `compare.md` exists and contains:

```text
URL1 element: .../url1_screenshot.png
URL2 element: .../url2_screenshot.png
Diff comparison: .../diff_comparison.png
Computed Style Diffs
```

### Provider layer

If Z.ai returns:

```text
429 code=1113 insufficient balance
```

then the provider account needs funds/resource package. Do not debug selectors or CSS for that error.

### LLM answer layer

A good answer should reference things present in `compare.md`, such as:

```text
height 33.5938px -> 40px
font-size 13px -> 14px
border-radius 8px -> 0px
```

If the answer says things not present in the screenshot, such as "blue Add to cart button," treat it as a hallucination and do not use it for fixes.

---

## 14. API references

### Z.ai GLM-5V-Turbo guide

Local copy:

```text
sources/zai-glm-5v-turbo-docs.md
```

Original URL:

```text
https://docs.z.ai/guides/vlm/glm-5v-turbo
```

Key facts:

- model: `glm-5v-turbo`,
- input modality: image/video/text/file,
- output modality: text,
- Chat Completions endpoint supported,
- image input uses `type: image_url`,
- `thinking` can be enabled in direct API calls.

### Z.ai Chat Completions API

Local copy:

```text
sources/zai-chat-completion-api-docs.md
```

Original URL:

```text
https://docs.z.ai/api-reference/llm/chat-completion
```

Endpoint:

```text
POST https://api.z.ai/api/paas/v4/chat/completions
```

Authentication:

```http
Authorization: Bearer <api-key>
```

---

## 15. Known limitations and improvement ideas

### 15.1 Z.ai account availability

Current blocker:

```text
Insufficient balance or no resource package. Please recharge.
```

Fix: fund the account or attach a resource package to the API key.

### 15.2 `thinking` is not currently passed for Z.ai

Z.ai docs show:

```json
"thinking": { "type": "enabled" }
```

The current Geppetto OpenAI-compatible Chat Completions request does not add Z.ai-specific `thinking` fields. GLM-5V-Turbo may still answer without that field, but if we want exact Z.ai feature support we should add a provider-specific extra body field mechanism or a dedicated Z.ai provider adapter.

Potential design:

```yaml
inference_settings:
  provider_extras:
    thinking:
      type: enabled
```

Pseudocode:

```go
req := ChatCompletionRequest{...}
extras := settings.API.ProviderExtras[provider]
body := mergeJSON(req, extras)
post(body)
```

This is not required for the current proof-of-concept, because the account failed before model behavior could be evaluated.

### 15.3 `ai-review` needs stronger prompts or larger crops

The per-image `ai-review` mode hallucinated on a tiny button crop. Improvements:

- include section name and expected text in the prompt,
- include DOM text from capture validation,
- pass both original and React images together for comparison questions,
- ask for JSON with fields like `visible_text`, `background_color`, `shape`, `confidence`,
- reject answers that contradict DOM text.

Example better prompt:

```text
This screenshot is expected to contain a Pyxis primary button with DOM text "Get tickets". Describe only what is visible. If the image is too small, say so. Do not invent labels or icons.
```

### 15.4 Add first-class config-driven comparison review

Right now:

- `run --modes ai-review` asks per-image questions,
- `llm-review` compares one pair from CLI flags.

A useful future mode would be:

```yaml
sections:
  - name: button-primary
    selector: "[data-comp='button-primary'] button"
    llm_review_question: "Compare these two buttons..."
```

Then:

```bash
css-visual-diff run --config atoms.yaml --modes capture,cssdiff,pixeldiff,llm-review,html-report
```

Pseudocode:

```text
for each section with llm_review_question:
    gather original screenshot
    gather react screenshot
    gather pixel diff for same section
    gather cssdiff rows for matching style spec
    call ReviewCompareSection(...)
write llm-review.json/md
include results in test.html
```

This would make LLM review fit naturally into the existing artifact report.

---

## 16. Final recommendation

For Pyxis today:

1. Keep using deterministic browser diffs as the source of truth.
2. Use `llm-review` selectively on one focused selector at a time.
3. Always select the real element, not only a wrapper.
4. Treat the LLM answer as a triage summary, not as proof.
5. Z.ai GLM-5V-Turbo is now usable for this workflow after credits were added, but keep monitoring token usage and provider errors.
6. Prefer `llm-review` over `ai-review` for design repair, because it includes screenshots plus structured CSS evidence.
7. Check the `## Token Usage` section in `llm-review.md` after every run so visual review costs are visible.

The best current command for `button-primary` is captured in:

```text
scripts/02-run-button-primary-llm-review-gemini.sh
```

Once Z.ai is funded, run:

```text
scripts/01-run-button-primary-llm-review-zai.sh
```

and compare the resulting `llm-review.md` against the Gemini result.

---

## 17. Token usage implementation update

After the successful Z.ai retry, `css-visual-diff` was updated so the `llm-review` command prints token usage to stdout and writes a `## Token Usage` section to `llm-review.md`. The raw usage was already present in `llm-review.json` under `inferenceResult.usage`, but it was too easy to miss because the human-readable Markdown and terminal output only showed the answer.

The implementation touches these files in the `css-visual-diff` repo:

```text
internal/cssvisualdiff/llm/review.go
cmd/css-visual-diff/main.go
internal/cssvisualdiff/llm/review_test.go
```

The core helper is:

```go
func ReviewUsageMarkdownLines(result ReviewResult) []string
```

It reads:

```go
result.InferenceResult.Usage.InputTokens
result.InferenceResult.Usage.OutputTokens
result.InferenceResult.Usage.CachedTokens
result.InferenceResult.MaxTokens
result.InferenceResult.DurationMs
result.InferenceResult.Extra["reasoning_tokens"]
```

and renders human-readable lines such as:

```text
- **Input tokens:** 485
- **Output tokens:** 1140
- **Total tokens:** 1625
- **Cached tokens:** 2
- **Reasoning tokens:** 579
- **Max tokens:** 2048
- **Duration:** 23730 ms
```

The CLI now prints the same information after the model answer:

```text
Token usage:
Input tokens: 485
Output tokens: 1140
Total tokens: 1625
Cached tokens: 2
Reasoning tokens: 579
Max tokens: 2048
Duration: 23730 ms
```

A focused unit test covers the formatter:

```text
TestReviewUsageMarkdownLinesIncludesTokenSummary
```

Validation command:

```bash
cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
GOWORK=off go test ./internal/cssvisualdiff/llm ./cmd/css-visual-diff
```

This matters because VLM calls can become expensive when many visual sections are reviewed. Token visibility should be considered part of the review artifact, not an implementation detail hidden in JSON.
