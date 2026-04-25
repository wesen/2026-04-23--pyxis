function fixedPercent(value) {
  var n = Number(value)
  if (isNaN(n)) return ''
  return n.toFixed(4) + '%'
}

function esc(value) {
  return String(value == null ? '' : value).replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function renderPixelDiffTable(rows) {
  var lines = []
  lines.push('| Page | Variant | Section | Changed % | Changed/Total | Classification | Accepted differences | Source |')
  lines.push('| --- | --- | --- | ---: | ---: | --- | --- | --- |')
  rows.forEach(function (row) {
    lines.push('| ' + [
      row.page,
      row.variant,
      row.section,
      fixedPercent(row.changedPercent),
      (row.changedPixels || '') + '/' + (row.totalPixels || ''),
      row.classification,
      row.acceptedDifferenceSummary || '',
      row.source,
    ].map(esc).join(' | ') + ' |')
  })
  return lines.join('\n')
}

function renderPageSummary(rows, options) {
  options = options || {}
  var lines = []
  lines.push('---')
  lines.push('Title: Pyxis public page visual diff summary')
  lines.push('Ticket: PYXIS-CSSVD-JS-LIB')
  lines.push('Status: active')
  lines.push('Topics:')
  lines.push('  - frontend')
  lines.push('  - visual-diff')
  lines.push('  - storybook')
  lines.push('  - automation')
  lines.push('  - pyxis')
  lines.push('DocType: reference')
  lines.push('Intent: short-term')
  lines.push('Summary: Generated summary from Pyxis css-visual-diff userland result parser.')
  lines.push('---')
  lines.push('')
  lines.push('# Pyxis Public Page Visual Diff Summary')
  lines.push('')
  if (options.resultsDir) lines.push('- Results dir: `' + options.resultsDir + '`')
  lines.push('- Row count: ' + rows.length)
  lines.push('')
  lines.push(renderPixelDiffTable(rows))
  lines.push('')
  lines.push('## Notes')
  lines.push('')
  lines.push('Rows are parsed from existing `pixeldiff.md` artifacts and classified by the userland policy bands: accepted <= 1%, review <= 10%, tune-required <= 25%, major-mismatch > 25%.')
  lines.push('')
  return lines.join('\n')
}

function renderCompareAllSummary(suite) {
  var lines = []
  var rows = suite.rows || []
  lines.push('---')
  lines.push('Title: Pyxis css-visual-diff compare-all suite summary')
  lines.push('Ticket: PYXIS-CSSVD-JS-LIB')
  lines.push('Status: active')
  lines.push('Topics:')
  lines.push('  - frontend')
  lines.push('  - visual-diff')
  lines.push('  - storybook')
  lines.push('  - automation')
  lines.push('  - pyxis')
  lines.push('DocType: reference')
  lines.push('Intent: short-term')
  lines.push('Summary: Generated suite summary from `pyxis pages compare-all`.')
  lines.push('---')
  lines.push('')
  lines.push('# Pyxis css-visual-diff Compare-all Suite Summary')
  lines.push('')
  lines.push('- Out dir: `' + (suite.outDir || '') + '`')
  lines.push('- Page count: ' + (suite.pageCount || 0))
  lines.push('- Section count: ' + (suite.sectionCount || rows.length))
  lines.push('- Max changed percent: ' + fixedPercent(suite.maxChangedPercent))
  lines.push('')
  lines.push('## Classification counts')
  lines.push('')
  lines.push('| Classification | Count |')
  lines.push('| --- | ---: |')
  Object.keys(suite.classificationCounts || {}).sort().forEach(function (key) {
    lines.push('| ' + esc(key) + ' | ' + suite.classificationCounts[key] + ' |')
  })
  lines.push('')
  lines.push('## Section results')
  lines.push('')
  lines.push(renderPixelDiffTable(rows))
  lines.push('')
  lines.push('## Accepted-difference reporting')
  lines.push('')
  lines.push('Accepted differences are project-authored metadata from the Pyxis registry. They are reported here for review context and do not automatically change the pixel classification.')
  lines.push('')
  var acceptedRows = rows.filter(function (row) { return row.acceptedDifferenceCount > 0 })
  if (!acceptedRows.length) {
    lines.push('No accepted differences are currently registered for these page sections.')
  } else {
    lines.push(renderPixelDiffTable(acceptedRows))
  }
  lines.push('')
  return lines.join('\n')
}

module.exports = {
  renderPixelDiffTable: renderPixelDiffTable,
  renderPageSummary: renderPageSummary,
  renderCompareAllSummary: renderCompareAllSummary,
}
