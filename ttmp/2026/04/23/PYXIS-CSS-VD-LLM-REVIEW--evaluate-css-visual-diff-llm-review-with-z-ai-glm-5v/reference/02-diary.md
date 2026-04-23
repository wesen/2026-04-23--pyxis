---
title: "Diary: css-visual-diff LLM Review with Z.ai GLM-5V"
ticket: PYXIS-CSS-VD-LLM-REVIEW
date: 2026-04-23
tags: [diary, css-visual-diff, llm, z-ai, glm-5v-turbo]
status: active
---

# Diary: css-visual-diff LLM Review with Z.ai GLM-5V

## Step 1: Create the ticket and inspect the LLM architecture

Created ticket `PYXIS-CSS-VD-LLM-REVIEW` to evaluate whether `css-visual-diff` LLM review works for Pyxis visual comparison work. I inspected the relevant implementation files in `css-visual-diff`, especially `cmd/css-visual-diff/main.go`, `internal/cssvisualdiff/llm/review.go`, `internal/cssvisualdiff/llm/image_question_client.go`, `internal/cssvisualdiff/modes/ai_review.go`, and `internal/cssvisualdiff/llm/bootstrap.go`.

I also inspected the local Geppetto and Pinocchio sources next to `css-visual-diff` to understand profile format, engine selection, OpenAI-compatible chat completion behavior, image serialization, and token usage reporting.

## Step 2: Fetch Z.ai documentation and add a local profile

Fetched the Z.ai GLM-5V-Turbo and Chat Completions docs with `defuddle` and saved them into the ticket `sources/` directory.

Created a local uncommitted Pinocchio profile registry at:

```text
/home/manuel/.pinocchio/config/profiles.yaml
```

The profile slug is:

```text
z-ai-glm-5v-turbo
```

The profile uses `api_type: openai`, `engine: glm-5v-turbo`, and `openai-base-url: https://api.z.ai/api/paas/v4`, which Geppetto turns into `https://api.z.ai/api/paas/v4/chat/completions`.

## Step 3: First Z.ai test failed due missing credits

Ran `scripts/01-run-button-primary-llm-review-zai.sh` against the atom report's prepared HTML files. The first run reached Z.ai but failed with:

```text
status=429
code=1113
message="Insufficient balance or no resource package. Please recharge."
```

This showed that profile resolution and endpoint wiring worked, but the account could not perform inference yet.

## Step 4: Prove the LLM path with Gemini fallback

Ran the same `button-primary` review with the existing `gemini-2.5-flash-lite` profile using `scripts/02-run-button-primary-llm-review-gemini.sh`. That completed successfully and wrote `compare.md`, `compare.json`, `llm-review.md`, and `llm-review.json`.

The useful lesson was selector precision: `[data-comp='button-primary'] button` is much better than `[data-comp='button-primary']`, because the latter captures wrapper computed styles instead of actual button styles.

## Step 5: Test config-driven ai-review mode

Added `sources/button-primary-ai-review-gemini.yaml` and ran `scripts/03-run-button-primary-ai-review-gemini.sh`. The mode completed successfully, proving `run --modes capture,ai-review` works. However, the answer hallucinated a blue "Add to cart" button for a tiny screenshot, so the documented recommendation is to prefer `llm-review` for Pyxis repair work because it sees both screenshots plus CSS evidence.

## Step 6: Retry Z.ai after credits were added

After credits were added to the API key, reran:

```bash
ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/scripts/01-run-button-primary-llm-review-zai.sh
```

The run succeeded. GLM-5V-Turbo correctly identified the important differences:

- border radius changed from `8px` to `0px`,
- height changed from about `33.6px` to `40px`,
- width increased from `117.4px` to `123.1px`,
- font size changed from `13px` to `14px`,
- font weight changed from `500` to `400`,
- likely causes are missing radius token, fixed height / spacing-token mismatch, and typography-token mismatch.

## Step 7: Add visible token usage reporting

The raw `llm-review.json` already included token usage under `inferenceResult.usage`, but the Markdown and terminal output did not display it. Updated `css-visual-diff` so `llm-review` now prints token usage to stdout and writes a `## Token Usage` section to `llm-review.md`.

Files changed in `css-visual-diff`:

```text
cmd/css-visual-diff/main.go
internal/cssvisualdiff/llm/review.go
internal/cssvisualdiff/llm/review_test.go
```

Validation passed:

```bash
GOWORK=off go test ./internal/cssvisualdiff/llm ./cmd/css-visual-diff
```

The successful Z.ai run reported:

```text
Input tokens: 485
Output tokens: 1140
Total tokens: 1625
Cached tokens: 2
Reasoning tokens: 579
Max tokens: 2048
Duration: 23730 ms
```

## Step 8: Write the intern-focused guide

Wrote `design/01-css-visual-diff-llm-review-analysis-design-implementation-guide.md`, a detailed analysis/design/implementation guide explaining the system from first principles, with architecture diagrams, file references, pseudocode, API notes, test commands, and recommendations.

## Step 9: Park LLM-review quality assessment for later

After seeing the successful Z.ai GLM-5V-Turbo answer, we evaluated review quality. The conclusion was that the review is useful and directionally correct, especially for triage, but not yet reliable enough to use without checking structured evidence. I recorded the assessment in a separate design note so we can return to it later.

New document:

```text
design/02-llm-review-quality-assessment-and-improvement-plan.md
```

Key assessment:

```text
Current quality: about 7.5/10
Potential quality after prompt/input improvements: about 8.5–9/10 for small atom diffs
```

Most important future improvements:

- include project context and forbid unsupported Tailwind/framework assumptions,
- include DOM text and element bounds,
- include value-level winning declarations, not only computed CSS values,
- include likely source file references,
- generate labeled/zoomed contact-sheet images,
- require structured output that separates observed evidence from speculation.
