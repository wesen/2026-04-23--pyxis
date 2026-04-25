#!/usr/bin/env bash
set -euo pipefail
TMP=$(mktemp -d)
cat > "$TMP/cp-test.js" <<'JS'
function cpTest() {
  var cp = require('child_process')
  var keys=[]; for (var k in cp) keys.push(k)
  return [{ keys: keys.join(',') }]
}
__verb__('cpTest', { parents: ['tmp'], output: 'structured', fields: {} })
JS
css-visual-diff verbs --repository "$TMP" tmp cp-test --output json
