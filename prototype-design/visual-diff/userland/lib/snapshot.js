var fs = require('fs')
var inspect = require('./inspect.js')
var styles = require('./styles.js')
var normalizers = require('./normalizers.js')
var tolerances = require('./tolerances.js')

function dirname(path) {
  return String(path || '').replace(/\/[^/]*$/g, '')
}

async function ensureDir(path) {
  if (!path) return path
  if (fs.mkdir) await fs.mkdir(path, { recursive: true })
  return path
}

async function writeText(path, content) {
  await ensureDir(dirname(path))
  if (fs.writeFile) await fs.writeFile(path, content)
  else fs.writeFileSync(path, content)
  return path
}

function defaultOutDir(page, section, variant) {
  return ['prototype-design/visual-comparisons/cssvd-js/snapshot-section', variant || 'desktop', page, section]
    .map(function (part) { return String(part || '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() })
    .join('/')
}

function normalizeRow(row, options) {
  options = options || {}
  var copy = {}
  Object.keys(row || {}).forEach(function (key) { copy[key] = row[key] })
  copy.normalizedStyles = normalizers.normalizeStyleMap(row.styles || {}, options.normalizers || {})
  return copy
}

function diffSnapshot(original, react, options) {
  options = options || {}
  var bounds = tolerances.compareBounds(original.bounds, react.bounds, options.boundsTolerance || {})
  var stylesDiff = tolerances.compareStyleMaps(original.normalizedStyles, react.normalizedStyles)
  var textChanged = String(original.textStart || '') !== String(react.textStart || '')
  return {
    changed: bounds.changed || stylesDiff.changed || textChanged,
    bounds: bounds,
    styles: stylesDiff,
    text: {
      changed: textChanged,
      original: original.textStart || '',
      react: react.textStart || '',
    },
  }
}

function renderMarkdown(snapshot) {
  var lines = []
  lines.push('---')
  lines.push('Title: Pyxis snapshot section semantic diff')
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
  lines.push('Summary: Generated semantic snapshot diff for one Pyxis page section.')
  lines.push('---')
  lines.push('')
  lines.push('# Snapshot section semantic diff')
  lines.push('')
  lines.push('- Page: `' + snapshot.page + '`')
  lines.push('- Section: `' + snapshot.section + '`')
  lines.push('- Variant: `' + snapshot.variant + '`')
  lines.push('- Style preset: `' + snapshot.stylePreset + '`')
  lines.push('- Changed: `' + snapshot.diff.changed + '`')
  lines.push('- Style differences: `' + snapshot.diff.styles.count + '`')
  lines.push('')
  lines.push('## Bounds')
  lines.push('')
  lines.push('| Field | Original | React | Delta | Tolerance | Changed |')
  lines.push('| --- | ---: | ---: | ---: | ---: | --- |')
  snapshot.diff.bounds.diffs.forEach(function (diff) {
    lines.push('| ' + [diff.name, diff.left, diff.right, diff.delta, diff.tolerance, diff.changed].join(' | ') + ' |')
  })
  lines.push('')
  lines.push('## Style differences')
  lines.push('')
  if (!snapshot.diff.styles.diffs.length) {
    lines.push('No normalized style differences for selected properties.')
  } else {
    lines.push('| Property | Original | React |')
    lines.push('| --- | --- | --- |')
    snapshot.diff.styles.diffs.forEach(function (diff) {
      lines.push('| ' + [diff.prop, String(diff.left || '').replace(/\|/g, '\\|'), String(diff.right || '').replace(/\|/g, '\\|')].join(' | ') + ' |')
    })
  }
  lines.push('')
  lines.push('## Text')
  lines.push('')
  lines.push('- Changed: `' + snapshot.diff.text.changed + '`')
  lines.push('- Original: `' + snapshot.diff.text.original.replace(/`/g, '\\`') + '`')
  lines.push('- React: `' + snapshot.diff.text.react.replace(/`/g, '\\`') + '`')
  lines.push('')
  return lines.join('\n')
}

async function snapshotSection(page, section, options) {
  options = options || {}
  var variant = options.variant || 'desktop'
  var stylePreset = options.stylePreset || 'pageShell'
  var rows = await inspect.inspectSection(page, section, {
    variant: variant,
    side: 'both',
    props: styles.propsForPreset(stylePreset),
    failOnMissing: options.failOnMissing !== false,
  })
  var original = normalizeRow(rows.filter(function (row) { return row.side === 'original' })[0] || {}, options)
  var react = normalizeRow(rows.filter(function (row) { return row.side === 'react' })[0] || {}, options)
  var snapshot = {
    page: page,
    section: section,
    variant: variant,
    stylePreset: stylePreset,
    original: original,
    react: react,
    diff: diffSnapshot(original, react, options),
  }
  var outDir = options.outDir || defaultOutDir(page, section, variant)
  var jsonPath = outDir.replace(/\/+$/g, '') + '/snapshot.json'
  var markdownPath = outDir.replace(/\/+$/g, '') + '/01-snapshot.md'
  await writeText(jsonPath, JSON.stringify(snapshot, null, 2))
  await writeText(markdownPath, renderMarkdown(snapshot))
  snapshot.outDir = outDir
  snapshot.jsonPath = jsonPath
  snapshot.markdownPath = markdownPath
  return [snapshot]
}

module.exports = {
  normalizeRow: normalizeRow,
  diffSnapshot: diffSnapshot,
  renderMarkdown: renderMarkdown,
  snapshotSection: snapshotSection,
}
