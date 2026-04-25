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

async function readText(path) {
  if (fs.readFile) return String(await fs.readFile(path, 'utf8'))
  return String(fs.readFileSync(path))
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

function renderSnapshotDiffMarkdown(report) {
  var lines = []
  lines.push('---')
  lines.push('Title: Pyxis snapshot-to-snapshot semantic diff')
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
  lines.push('Summary: Generated diff between two semantic snapshot reports.')
  lines.push('---')
  lines.push('')
  lines.push('# Snapshot-to-snapshot semantic diff')
  lines.push('')
  lines.push('- Before: `' + report.beforePath + '`')
  lines.push('- After: `' + report.afterPath + '`')
  lines.push('- Page: `' + report.page + '`')
  lines.push('- Section: `' + report.section + '`')
  lines.push('- Changed: `' + report.changed + '`')
  lines.push('')
  lines.push('## Metrics')
  lines.push('')
  lines.push('| Metric | Before | After | Delta |')
  lines.push('| --- | ---: | ---: | ---: |')
  report.metricDiffs.forEach(function (diff) {
    lines.push('| ' + [diff.name, diff.before, diff.after, diff.delta].join(' | ') + ' |')
  })
  lines.push('')
  lines.push('## Classification')
  lines.push('')
  lines.push('| Field | Before | After | Changed |')
  lines.push('| --- | --- | --- | --- |')
  report.classificationDiffs.forEach(function (diff) {
    lines.push('| ' + [diff.name, diff.before, diff.after, diff.changed].join(' | ') + ' |')
  })
  lines.push('')
  return lines.join('\n')
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

function metric(snapshot, path, fallback) {
  var current = snapshot
  for (var i = 0; i < path.length; i++) {
    if (current == null) return fallback
    current = current[path[i]]
  }
  return current == null ? fallback : current
}

function numericDelta(before, after) {
  var a = Number(before || 0)
  var b = Number(after || 0)
  return b - a
}

async function diffSnapshots(beforePath, afterPath, options) {
  options = options || {}
  var before = JSON.parse(await readText(beforePath))
  var after = JSON.parse(await readText(afterPath))
  var metricSpecs = [
    { name: 'styleDiffCount', path: ['diff', 'styles', 'count'] },
    { name: 'boundsXDelta', path: ['diff', 'bounds', 'byField', 'x', 'delta'] },
    { name: 'boundsYDelta', path: ['diff', 'bounds', 'byField', 'y', 'delta'] },
    { name: 'boundsWidthDelta', path: ['diff', 'bounds', 'byField', 'width', 'delta'] },
    { name: 'boundsHeightDelta', path: ['diff', 'bounds', 'byField', 'height', 'delta'] },
  ]
  var metricDiffs = metricSpecs.map(function (spec) {
    var a = metric(before, spec.path, 0)
    var b = metric(after, spec.path, 0)
    return { name: spec.name, before: a, after: b, delta: numericDelta(a, b) }
  })
  var classificationDiffs = [
    { name: 'changed', before: !!metric(before, ['diff', 'changed'], false), after: !!metric(after, ['diff', 'changed'], false) },
    { name: 'textChanged', before: !!metric(before, ['diff', 'text', 'changed'], false), after: !!metric(after, ['diff', 'text', 'changed'], false) },
    { name: 'boundsChanged', before: !!metric(before, ['diff', 'bounds', 'changed'], false), after: !!metric(after, ['diff', 'bounds', 'changed'], false) },
    { name: 'stylesChanged', before: !!metric(before, ['diff', 'styles', 'changed'], false), after: !!metric(after, ['diff', 'styles', 'changed'], false) },
  ].map(function (row) {
    row.changed = String(row.before) !== String(row.after)
    return row
  })
  var report = {
    beforePath: beforePath,
    afterPath: afterPath,
    page: after.page || before.page,
    section: after.section || before.section,
    changed: metricDiffs.some(function (diff) { return diff.delta !== 0 }) || classificationDiffs.some(function (diff) { return diff.changed }),
    metricDiffs: metricDiffs,
    classificationDiffs: classificationDiffs,
    before: before,
    after: after,
  }
  var outDir = options.outDir || 'prototype-design/visual-comparisons/cssvd-js/diff-snapshots'
  var jsonPath = outDir.replace(/\/+$/g, '') + '/snapshot-diff.json'
  var markdownPath = outDir.replace(/\/+$/g, '') + '/01-snapshot-diff.md'
  await writeText(jsonPath, JSON.stringify(report, null, 2))
  await writeText(markdownPath, renderSnapshotDiffMarkdown(report))
  report.outDir = outDir
  report.jsonPath = jsonPath
  report.markdownPath = markdownPath
  return [report]
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
  renderSnapshotDiffMarkdown: renderSnapshotDiffMarkdown,
  diffSnapshots: diffSnapshots,
  snapshotSection: snapshotSection,
}
