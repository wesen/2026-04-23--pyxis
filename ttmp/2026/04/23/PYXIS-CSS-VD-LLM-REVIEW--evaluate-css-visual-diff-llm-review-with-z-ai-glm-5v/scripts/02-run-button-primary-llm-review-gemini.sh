#!/usr/bin/env bash
set -euo pipefail

CSS_VD="/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff"
TICKET="/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v"
OUT="$TICKET/various/button-primary-llm-review-gemini-button-selector"

cd "$CSS_VD"
rm -rf "$OUT"
GOWORK=off go run ./cmd/css-visual-diff llm-review \
  --profile gemini-2.5-flash-lite \
  --profile-registries /home/manuel/.config/pinocchio/profiles.yaml \
  --url1 http://localhost:8792/original-prepared.html \
  --selector1 "[data-comp='button-primary'] button" \
  --url2 http://localhost:8792/react-prepared.html \
  --selector2 "[data-comp='button-primary'] button" \
  --wait-ms1 500 \
  --wait-ms2 500 \
  --viewport-w 1200 \
  --viewport-h 1200 \
  --props height,width,padding-top,padding-right,padding-bottom,padding-left,font-size,font-weight,line-height,color,background-color,border-radius,border-top-width,border-top-color,gap,display,align-items \
  --threshold 30 \
  --out "$OUT" \
  --question "Compare the prototype button-primary and the React Storybook button-primary. Explain the visible differences, rank their likely importance for matching the prototype, and name the most likely CSS/token causes. Be concrete and actionable."
