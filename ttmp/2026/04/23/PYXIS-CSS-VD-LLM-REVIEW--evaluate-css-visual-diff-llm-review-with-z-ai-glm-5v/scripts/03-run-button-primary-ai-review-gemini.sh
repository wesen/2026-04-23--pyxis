#!/usr/bin/env bash
set -euo pipefail

CSS_VD="/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff"
TICKET="/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v"
CONFIG="$TICKET/sources/button-primary-ai-review-gemini.yaml"

cd "$CSS_VD"
GOWORK=off go run ./cmd/css-visual-diff run \
  --config "$CONFIG" \
  --modes capture,ai-review \
  --profile gemini-2.5-flash-lite \
  --profile-registries /home/manuel/.config/pinocchio/profiles.yaml \
  --output json
