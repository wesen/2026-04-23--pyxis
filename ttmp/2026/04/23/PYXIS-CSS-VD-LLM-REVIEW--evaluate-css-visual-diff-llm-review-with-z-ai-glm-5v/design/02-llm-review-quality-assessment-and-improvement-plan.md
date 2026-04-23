---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/llm/review.go
      Note: Prompt construction and future improvement target
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/compare.go
      Note: Source of compare evidence to enrich with DOM text and winning declarations
    - Path: ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/various/button-primary-llm-review-zai/compare.md
      Note: Structured CSS evidence used to judge review quality
    - Path: ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/various/button-primary-llm-review-zai/llm-review.md
      Note: Successful Z.ai review being assessed
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# LLM Review Quality Assessment and Improvement Plan

## 1. Purpose

This document records a quality assessment of the `css-visual-diff llm-review` feature after testing it on the Pyxis `button-primary` atom with Z.ai GLM-5V-Turbo. The goal is not to fix the feature immediately. The goal is to preserve the evaluation, describe what worked, identify weaknesses in the current prompt/input design, and define concrete improvements for a later implementation pass.

The short version:

> The Z.ai GLM-5V review was useful and directionally correct, but it is not yet reliable enough to trust without checking the structured diff. The current system is good as a triage assistant, not as an autonomous visual QA reviewer.

For the specific `button-primary` test, the review quality was approximately **7.5/10**. With better prompt structure and richer input evidence, it should be possible to push this toward **8.5–9/10** for small component diffs.

---

## 2. Context: what was reviewed

The tested component was the isolated atom diff for `button-primary`.

The reviewed targets were served from the atom diff report:

```text
Prototype prepared HTML:
http://localhost:8792/original-prepared.html

React prepared HTML:
http://localhost:8792/react-prepared.html
```

The selector used for the best run was:

```text
[data-comp='button-primary'] button
```

This was intentionally more precise than:

```text
[data-comp='button-primary']
```

because the wrapper selector captures the surrounding fixture span rather than the actual clickable button element. Selector precision turned out to be one of the most important determinants of answer quality.

The successful Z.ai output was written to:

```text
various/button-primary-llm-review-zai/llm-review.md
various/button-primary-llm-review-zai/llm-review.json
```

The token usage from the successful run was:

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

## 3. What the review did well

The review correctly identified the main visual and CSS mismatches.

### 3.1 Border radius regression

The model correctly called out the most visually obvious difference:

```text
border-radius: 8px -> 0px
```

This is the highest-value issue in the `button-primary` comparison because it changes the design language of the component. The prototype button is a rounded rectangle; the React button renders with sharp square corners. For a warm paper/poster-inspired public site, that corner shape matters.

The review correctly ranked this as high importance.

### 3.2 Sizing mismatch

The review correctly noticed that the React button is larger:

```text
height: 33.5938px -> 40px
width: 117.422px -> 123.141px
```

It also connected the size shift to layout density and possible alignment problems. That is a useful engineering interpretation. Even when a larger button can be good for accessibility, the task here is prototype parity; a 40px button in a layout designed for approximately 34px buttons creates visual drift.

### 3.3 Typography drift

The review correctly identified typography differences:

```text
font-size: 13px -> 14px
font-weight: 500 -> 400
line-height: 15.6px -> 16.8px
```

It also correctly observed that the React text appears thinner and somewhat larger. That is a meaningful difference for primary calls to action.

### 3.4 Actionable summary

The review ended with a useful fix list:

1. restore the radius,
2. restore font size and weight,
3. inspect or remove the fixed height / sizing token mismatch.

This is exactly the kind of triage summary we want from `llm-review`: not a replacement for the diff, but a readable interpretation that helps an engineer decide what to inspect first.

---

## 4. Where the review was weaker

The review was good, but it also showed the current limits of the prompt and input evidence.

### 4.1 It speculated about Tailwind / utility classes

The review suggested a possible missing utility class such as Tailwind's `rounded-lg`. That is generic frontend advice, but it is not project-aware advice. Pyxis does not use Tailwind for these atoms. The component library uses React components, inline styles, CSS files, CSS variables, and token files.

This is not a fatal error, but it shows that the prompt should constrain the model more strongly.

A better prompt should include:

```text
This project uses React components, CSS variables, CSS files, and TypeScript token files.
Do not assume Tailwind, Bootstrap, shadcn, MUI, or another framework unless the evidence explicitly shows it.
```

### 4.2 It slightly over-described the shape

The model used language like "pill-shaped." The prototype button has `border-radius: 8px`; visually it is rounded, but it is not mathematically a pill unless the radius is close to half the height.

For pixel-matching work, the model should use measured language:

```text
Say "rounded rectangle" unless the radius is approximately half the element height.
```

This prevents the model from turning a useful observation into an exaggerated claim.

### 4.3 It over-inferred height causality

The review correctly saw that React is taller, but the causality should be stated more carefully.

Evidence:

```text
height: 33.5938px -> 40px
padding-top: 8px -> 7px
padding-bottom: 8px -> 7px
font-size: 13px -> 14px
line-height: 15.6px -> 16.8px
```

The React button is taller even though vertical padding is smaller. The likely cause is the explicit React `height: 40px` together with the larger font metrics. The model got close, but future prompts should force a separation between:

- observed computed differences,
- observed winning declarations,
- possible causes,
- confidence.

Without that structure, the model can sound more certain than the evidence supports.

---

## 5. Main lesson: the VLM needs better structured evidence

The current `llm-review` prompt includes computed CSS diffs and some winning-rule differences. That is already useful. However, it does not yet expose enough value-level winning declaration detail.

For `button-primary`, `compare.md` contained excellent evidence:

```text
border-radius:
  prototype style attribute (8px)
  react style attribute (var(--radius-md))

font-weight:
  prototype style attribute (500)
  react style attribute (var(--weight-medium))

height:
  prototype none
  react style attribute (40px)
```

This should be explicitly included in the LLM prompt. If the model sees that `var(--radius-md)` resolves to `0px`, it can say something much more project-specific:

> React's `var(--radius-md)` resolves to `0px`, so inspect token definition or theme loading.

That is much better than:

> Maybe a Tailwind `rounded-lg` class is missing.

---

## 6. Recommended prompt improvements

### 6.1 Add project context

The prompt should tell the model what kind of project it is reviewing.

Suggested text:

```text
You are reviewing a Pyxis component visual diff.

Project context:
- Pyxis uses React components, CSS variables, CSS files, and TypeScript token files.
- Do not assume Tailwind, Bootstrap, shadcn, MUI, or another CSS framework unless evidence explicitly shows it.
- The prototype is the target visual reference unless an intentional design-system decision is documented.
```

### 6.2 Include likely source files

The prompt should include likely files for the component under review. For `button-primary`:

```text
Relevant React files:
- web/packages/pyxis-components/src/atoms/Button/Button.tsx
- web/packages/pyxis-components/src/atoms/Button/Button.css
- web/packages/pyxis-components/src/tokens/tokens.css
- web/packages/pyxis-components/src/tokens/tokens.ts

Relevant prototype files:
- prototype-design/lib/components.jsx
- prototype-design/lib/tokens.js
```

Then ask:

```text
When naming likely causes, prefer these project-specific files and token paths. Do not invent framework-specific causes unless evidence supports them.
```

### 6.3 Force evidence/speculation separation

The model should be told to separate:

1. observed facts,
2. evidence-backed likely causes,
3. speculation,
4. recommended fix order.

Suggested instruction:

```text
For every likely cause, cite the exact evidence that supports it. If a cause is only a guess, label it as speculation and give a confidence score.
```

### 6.4 Use a stricter output format

Current free-form prose is readable but too loose. A structured Markdown format would be better:

```markdown
## Verdict

One sentence summary.

## Observed differences

| Rank | Feature | Prototype | React | Importance |
|---|---|---|---|---|

## Evidence-backed likely causes

For each cause:
- Evidence:
- Likely source:
- Confidence:
- Files to inspect:

## Speculation / unknowns

Only list items that are not directly proven by the evidence.

## Recommended fix order

1. ...
2. ...
3. ...
```

For long-term automation, JSON-first output would be even better:

```json
{
  "overall_score": 0.78,
  "differences": [
    {
      "feature": "border-radius",
      "prototype": "8px",
      "react": "0px",
      "importance": "high",
      "evidence": "computed CSS and screenshot",
      "likely_cause": "React token var(--radius-md) resolves to 0px or is missing",
      "confidence": 0.9,
      "files_to_inspect": [
        "web/packages/pyxis-components/src/atoms/Button/Button.tsx",
        "web/packages/pyxis-components/src/tokens/tokens.css"
      ]
    }
  ]
}
```

### 6.5 Tell the model the comparison goal

The prompt should explicitly state the review goal:

```text
Goal:
- Compare React to the prototype for prototype parity.
- Treat prototype values as the target unless the evidence suggests an accessibility or product reason to preserve the React difference.
```

This avoids a generic answer that says "larger click target is good" without making a prototype-parity recommendation.

---

## 7. Recommended input improvements

### 7.1 Include DOM text and bounds

The model should receive structured DOM/layout facts, not only screenshots and CSS diffs.

Example:

```json
{
  "section": "button-primary",
  "prototype": {
    "selector": "[data-comp='button-primary'] button",
    "text": "Get tickets",
    "bounds": { "width": 117.422, "height": 33.5938 },
    "tag": "button"
  },
  "react": {
    "selector": "[data-comp='button-primary'] button",
    "text": "Get tickets",
    "bounds": { "width": 123.141, "height": 40 },
    "tag": "button"
  }
}
```

This would reduce hallucinations like the earlier `ai-review` answer that invented a blue "Add to cart" button.

### 7.2 Include property-level winning declarations

For each changed property, include this shape:

```json
{
  "property": "border-radius",
  "prototype_computed": "8px",
  "react_computed": "0px",
  "prototype_winner": "style attribute (8px)",
  "react_winner": "style attribute (var(--radius-md))",
  "source_type": "inline style / token variable"
}
```

This is the most important technical improvement. It lets the VLM reason about token resolution rather than guessing from screenshots.

### 7.3 Include labeled and zoomed contact-sheet images

For tiny atom screenshots, separate raw images can be visually ambiguous. We should generate and send a contact sheet like:

```text
┌───────────────┬───────────────┬───────────────┐
│ PROTOTYPE     │ REACT         │ DIFF          │
│ zoomed 3x     │ zoomed 3x     │ zoomed 3x     │
└───────────────┴───────────────┴───────────────┘
```

Recommended image bundle:

1. raw prototype element,
2. raw React element,
3. pixel diff,
4. labeled 3x contact sheet,
5. optional full fixture screenshot for context.

The contact sheet should include labels embedded in the image so the VLM cannot confuse left/right context.

### 7.4 Include before/after source map hints

The input could include known code ownership:

```json
{
  "component_kind": "atom/Button",
  "react_files": [
    "web/packages/pyxis-components/src/atoms/Button/Button.tsx",
    "web/packages/pyxis-components/src/atoms/Button/Button.css",
    "web/packages/pyxis-components/src/tokens/tokens.css"
  ],
  "prototype_files": [
    "prototype-design/lib/components.jsx",
    "prototype-design/lib/tokens.js"
  ]
}
```

This would make the model's "files to inspect" much more useful.

---

## 8. Suggested improved prompt

A future `llm-review` prompt for Pyxis should look approximately like this:

```text
You are reviewing a Pyxis component visual diff.

Goal:
- The prototype is the target visual reference.
- The React Storybook implementation should match it unless an intentional design-system decision is documented.
- Be concrete and evidence-based.

Project context:
- Pyxis uses React components, CSS variables, CSS files, and TypeScript token files.
- Do not assume Tailwind, Bootstrap, shadcn, MUI, or another CSS framework unless evidence explicitly shows it.
- Relevant files are likely:
  - web/packages/pyxis-components/src/atoms/Button/Button.tsx
  - web/packages/pyxis-components/src/atoms/Button/Button.css
  - web/packages/pyxis-components/src/tokens/tokens.css
  - web/packages/pyxis-components/src/tokens/tokens.ts
  - prototype-design/lib/components.jsx
  - prototype-design/lib/tokens.js

Inputs:
- Image A: prototype element.
- Image B: React element.
- Image C: pixel diff.
- Image D: labeled zoomed contact sheet.
- Structured evidence below includes DOM text, bounds, computed CSS, and winning declarations.

Instructions:
1. First list only observed visual differences.
2. Then list CSS/token causes, explicitly citing evidence.
3. Separate evidence from speculation.
4. If you speculate, label it as speculation and give confidence.
5. Rank fixes by visual importance for prototype parity.
6. Do not invent labels, colors, frameworks, or icons.
7. Prefer exact property values from the structured evidence.

Output format:
## Verdict
## Observed differences
## Evidence-backed likely causes
## Recommended fix order
## Risks / unknowns
```

---

## 9. Suggested structured input schema

For `button-primary`, a high-quality input payload would include something like:

```json
{
  "section": "button-primary",
  "goal": "prototype parity",
  "prototype": {
    "selector": "[data-comp='button-primary'] button",
    "text": "Get tickets",
    "bounds": {
      "width": 117.422,
      "height": 33.5938
    },
    "computed": {
      "height": "33.5938px",
      "font-size": "13px",
      "font-weight": "500",
      "border-radius": "8px"
    },
    "winning_declarations": {
      "border-radius": "style attribute (8px)",
      "font-weight": "style attribute (500)"
    }
  },
  "react": {
    "selector": "[data-comp='button-primary'] button",
    "text": "Get tickets",
    "bounds": {
      "width": 123.141,
      "height": 40
    },
    "computed": {
      "height": "40px",
      "font-size": "14px",
      "font-weight": "400",
      "border-radius": "0px"
    },
    "winning_declarations": {
      "height": "style attribute (40px)",
      "border-radius": "style attribute (var(--radius-md))",
      "font-weight": "style attribute (var(--weight-medium))"
    }
  },
  "pixel_diff": {
    "changed_percent": 33.374,
    "changed_pixels": 1642,
    "total_pixels": 4920
  }
}
```

---

## 10. Implementation plan for later

This is intentionally parked for later, but the implementation path is clear.

### Phase 1: Prompt-only improvement

- Add project-context and framework-guardrail text to `BuildReviewPromptText`.
- Add stricter output format instructions.
- Add goal language: prototype parity unless documented otherwise.

Files:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/llm/review.go
```

### Phase 2: Better evidence in prompt

- Extend `BuildReviewPromptText` to include value-level winner declarations.
- Include DOM text and element bounds from `CompareResult` if already available.
- If not available, extend `CompareResult` to carry text/bounds explicitly.

Files likely involved:

```text
internal/cssvisualdiff/modes/compare.go
internal/cssvisualdiff/llm/review.go
```

### Phase 3: Contact-sheet image generation

- Generate a labeled contact-sheet PNG from left/right/diff images.
- Add it to `BuildReviewImages` as an additional image payload.
- Prefer 2x or 3x scaling for atom screenshots.

Files likely involved:

```text
internal/cssvisualdiff/llm/review.go
internal/cssvisualdiff/modes/pixeldiff_image.go
```

### Phase 4: Structured output mode

- Add optional JSON response format if the provider supports it.
- Parse the JSON into a typed `ReviewAssessment` struct.
- Render both JSON and Markdown.

Possible struct:

```go
type ReviewAssessment struct {
    Verdict     string              `json:"verdict"`
    Score       float64             `json:"score"`
    Differences []ReviewDifference  `json:"differences"`
    FixOrder    []ReviewFix         `json:"fix_order"`
    Unknowns    []string            `json:"unknowns"`
}
```

---

## 11. Final assessment

The successful Z.ai GLM-5V-Turbo review is a good proof of concept. It is useful enough to keep using manually on focused component diffs, especially when paired with `compare.md` and the raw screenshots. It should not yet be used as an automated gate or accepted without inspection.

Current quality:

```text
7.5 / 10
```

Expected quality after prompt and input improvements:

```text
8.5–9 / 10 for small atom-level diffs
```

Most important next improvement:

> Feed the model property-level winning declarations with values, DOM text, bounds, and project-specific file context, then require evidence-backed output that separates facts from speculation.
