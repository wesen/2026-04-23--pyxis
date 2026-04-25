function fixedPercent(value) {
  var n = Number(value)
  if (isNaN(n)) return ''
  return n.toFixed(4) + '%'
}

function renderPixelDiffTable(rows) {
  var lines = []
  lines.push('| Page | Variant | Section | Changed % | Changed/Total | Classification | Source |')
  lines.push('| --- | --- | --- | ---: | ---: | --- | --- |')
  rows.forEach(function (row) {
    lines.push('| ' + [
      row.page,
      row.variant,
      row.section,
      fixedPercent(row.changedPercent),
      (row.changedPixels || '') + '/' + (row.totalPixels || ''),
      row.classification,
      row.source,
    ].join(' | ') + ' |')
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

module.exports = { renderPixelDiffTable, renderPageSummary }
