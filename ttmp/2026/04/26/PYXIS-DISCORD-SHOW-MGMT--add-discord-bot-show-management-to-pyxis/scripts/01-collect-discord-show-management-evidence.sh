#!/usr/bin/env bash
set -euo pipefail

# Collect a compact, line-numbered evidence bundle for the Pyxis Discord bot
# show-management design guide. Run from the Pyxis repository root.

out_dir="ttmp/2026/04/26/PYXIS-DISCORD-SHOW-MGMT--add-discord-bot-show-management-to-pyxis/sources"
mkdir -p "$out_dir"
out="$out_dir/01-evidence-line-references.md"

{
  echo "---"
  echo "Title: Evidence line references"
  echo "Ticket: PYXIS-DISCORD-SHOW-MGMT"
  echo "Status: active"
  echo "Topics:"
  echo "    - pyxis"
  echo "    - discord-bot"
  echo "    - show-management"
  echo "    - goja"
  echo "DocType: reference"
  echo "Intent: short-term"
  echo "Owners: []"
  echo "RelatedFiles: []"
  echo "ExternalSources: []"
  echo 'Summary: "Generated source excerpts and line references for the Discord bot show-management design."'
  echo "LastUpdated: $(date -Is)"
  echo 'WhatFor: "Use as evidence for the design guide."'
  echo 'WhenToUse: "When refreshing or reviewing source-backed claims in the ticket."'
  echo "---"
  echo
  echo "# Evidence line references"
  echo
  echo "Generated: $(date -Is)"
  echo
  echo "## Module paths"
  grep '^module' go.mod ../corporate-headquarters/discord-bot/go.mod ../corporate-headquarters/go-go-goja/go.mod
  echo
  emit() {
    local title="$1"; shift
    local file="$1"; shift
    local ranges="$1"; shift
    echo "## ${title}"
    echo
    echo "File: ${file}"
    echo
    IFS=';' read -ra parts <<< "$ranges"
    for range in "${parts[@]}"; do
      echo "### Lines ${range}"
      echo '```text'
      nl -ba "$file" | sed -n "${range}p"
      echo '```'
      echo
    done
  }
  emit "Pyxis Cobra entrypoint" "cmd/pyxis/main.go" "21,58"
  emit "Pyxis serve command" "cmd/pyxis/cmds/serve.go" "24,87"
  emit "Pyxis server wiring" "pkg/server/server.go" "18,31;33,68;92,99;147,165"
  emit "Pyxis show service" "pkg/service/show_service.go" "12,25;42,59;77,113;115,131"
  emit "Pyxis Discord client placeholder" "pkg/discord/client.go" "1,31"
  emit "Pyxis show schema" "pkg/db/migrations/000001_init.up.sql" "39,59;115,132"
  emit "Pyxis settings fields" "pkg/domain/settings.go" "5,25"
  emit "Pyxis proto show/settings" "proto/pyxis/v1/show.proto" "26,68;209,233"
  emit "Pyxis frontend announce integration" "web/packages/pyxis-app/src/pages/Pages.tsx" "174,245;497,504;507,535"
  emit "Discord framework embedding API" "../corporate-headquarters/discord-bot/pkg/framework/framework.go" "1,14;28,48;56,97;115,147;159,189"
  emit "Discord botcli embedding API" "../corporate-headquarters/discord-bot/pkg/botcli/doc.go" "1,21"
  emit "Discord runtime customization hooks" "../corporate-headquarters/discord-bot/pkg/botcli/options.go" "13,36;75,121"
  emit "Goja host loads bot script" "../corporate-headquarters/discord-bot/internal/jsdiscord/host.go" "21,59;75,100"
  emit "Show-space runtime config and commands" "../corporate-headquarters/discord-bot/examples/discord-bots/show-space/index.js" "270,349;383,408;443,461;593,660;678,750;762,811"
  emit "Show-space store" "../corporate-headquarters/discord-bot/examples/discord-bots/show-space/lib/store.js" "1,73;102,149;202,252;254,325"
  emit "Show-space rendering" "../corporate-headquarters/discord-bot/examples/discord-bots/show-space/lib/render.js" "12,35;55,86;88,122"
  emit "Show-space permissions" "../corporate-headquarters/discord-bot/examples/discord-bots/show-space/lib/permissions.js" "1,28;35,58"
  emit "Discord JS API reference" "../corporate-headquarters/discord-bot/pkg/doc/topics/discord-js-bot-api-reference.md" "33,45;64,84;208,229;277,335;650,697;870,883"
} > "$out"

echo "$out"
