__package__({
  name: 'pages',
  parents: ['pyxis'],
  short: 'Pyxis public page css-visual-diff userland commands',
})

var lib = require('../lib/index.js')
var cvd = require('css-visual-diff')
var fs = require('fs')

function listTargets(values) {
  return lib.registry.flattenTargets({
    page: values.page || '',
    variant: values.variant || '',
    priority: values.priority || '',
  })
}

__verb__('listTargets', {
  parents: ['pyxis', 'pages'],
  short: 'List registered Pyxis public page comparison targets',
  output: 'structured',
  fields: {
    values: { bind: 'all' },
    page: { type: 'string', default: '', help: 'Filter by page slug' },
    variant: { type: 'string', default: '', help: 'Filter by variant, e.g. desktop' },
    priority: { type: 'string', default: '', help: 'Filter by priority label' },
  },
})

async function inspectSection(page, section, values) {
  return await lib.inspect.inspectSection(page, section, {
    variant: values.variant || 'desktop',
    side: values.side || 'both',
    stylePreset: values.stylePreset || 'pageShell',
    failOnMissing: !!values.failOnMissing,
  })
}

__verb__('inspectSection', {
  parents: ['pyxis', 'pages'],
  short: 'Inspect one registered Pyxis page section on prototype and/or Storybook side',
  output: 'structured',
  fields: {
    page: { argument: true, required: true, help: 'Registered page slug' },
    section: { argument: true, required: true, help: 'Registered section name' },
    values: { bind: 'all' },
    variant: { type: 'string', default: 'desktop', help: 'Registered variant' },
    side: { type: 'choice', choices: ['both', 'original', 'react'], default: 'both', help: 'Side to inspect' },
    stylePreset: { type: 'choice', choices: ['typography', 'layout', 'surface', 'spacing', 'pageShell'], default: 'pageShell', help: 'Style property preset to extract' },
    failOnMissing: { type: 'bool', default: false, help: 'Fail when the selector is missing or hidden' },
  },
})

async function compareSection(page, section, values) {
  return [await lib.compareRegion.compareSection(page, section, {
    variant: values.variant || 'desktop',
    outDir: values.outDir || '',
    threshold: values.threshold || 30,
    inspect: values.inspect || 'rich',
  })]
}

__verb__('compareSection', {
  parents: ['pyxis', 'pages'],
  short: 'Compare one registered Pyxis page section using cvd.compare.region',
  output: 'structured',
  fields: {
    page: { argument: true, required: true, help: 'Registered page slug' },
    section: { argument: true, required: true, help: 'Registered section name' },
    values: { bind: 'all' },
    variant: { type: 'string', default: 'desktop', help: 'Registered variant' },
    outDir: { type: 'string', default: '', help: 'Output directory for artifacts' },
    threshold: { type: 'int', default: 30, help: 'Pixel threshold 0-255' },
    inspect: { type: 'choice', choices: ['minimal', 'rich', 'debug'], default: 'rich', help: 'Collection profile' },
  },
})

async function comparePage(page, values) {
  return await lib.compareRegion.comparePage(page, {
    variant: values.variant || 'desktop',
    outDir: values.outDir || '',
    threshold: values.threshold || 30,
    inspect: values.inspect || 'rich',
  })
}

__verb__('comparePage', {
  parents: ['pyxis', 'pages'],
  short: 'Compare all registered sections for one Pyxis page and write a catalog',
  output: 'structured',
  fields: {
    page: { argument: true, required: true, help: 'Registered page slug' },
    values: { bind: 'all' },
    variant: { type: 'string', default: 'desktop', help: 'Registered variant' },
    outDir: { type: 'string', default: '', help: 'Output directory for page catalog artifacts' },
    threshold: { type: 'int', default: 30, help: 'Pixel threshold 0-255' },
    inspect: { type: 'choice', choices: ['minimal', 'rich', 'debug'], default: 'rich', help: 'Collection profile' },
  },
})

async function compareAll(values) {
  return await lib.compareRegion.compareAll({
    page: values.page || '',
    variant: values.variant || 'desktop',
    priority: values.priority || '',
    outDir: values.outDir || '',
    threshold: values.threshold || 30,
    inspect: values.inspect || 'rich',
    mode: values.mode || 'authoring',
    maxChangedPercent: values.maxChangedPercent,
    maxPolicyBand: values.maxPolicyBand || '',
  })
}

__verb__('compareAll', {
  parents: ['pyxis', 'pages'],
  short: 'Compare all registered Pyxis public pages and write per-page catalogs plus a suite summary',
  output: 'structured',
  fields: {
    values: { bind: 'all' },
    page: { type: 'string', default: '', help: 'Optional page filter for smoke/debug runs' },
    variant: { type: 'string', default: 'desktop', help: 'Registered variant' },
    priority: { type: 'string', default: '', help: 'Optional priority filter' },
    outDir: { type: 'string', default: '', help: 'Output directory for suite artifacts' },
    threshold: { type: 'int', default: 30, help: 'Pixel threshold 0-255' },
    inspect: { type: 'choice', choices: ['minimal', 'rich', 'debug'], default: 'rich', help: 'Collection profile' },
    mode: { type: 'choice', choices: ['authoring', 'ci'], default: 'authoring', help: 'In ci mode, fail the command after writing reports when policy thresholds are exceeded' },
    maxChangedPercent: { type: 'float', default: 0, help: 'Optional policy threshold for changed percent; 0 disables it' },
    maxPolicyBand: { type: 'string', default: '', help: 'Optional maximum allowed classification band: accepted, review, tune-required, or major-mismatch' },
  },
})

function specDefaults(spec) {
  return (spec && spec.defaults) || spec || {}
}

function artifactJsonFromRow(row) {
  try {
    if (!row || !row.artifactJson) return null
    var text = fs.readFileSync ? fs.readFileSync(row.artifactJson, 'utf8') : ''
    return text ? JSON.parse(String(text)) : null
  } catch (err) {
    return null
  }
}

function styleDiffsFromRow(row) {
  var artifact = artifactJsonFromRow(row)
  var changes = row && row.summary && row.summary.style && row.summary.style.changes
  if (!changes) changes = row && row.summary && row.summary.styles
  if (!changes) changes = artifact && artifact.styles
  if (!changes || !changes.map) return []
  return changes.map(function (change) {
    return {
      property: change.property || change.name || '',
      left: change.left,
      right: change.right,
    }
  })
}

function attributeDiffsFromRow(row) {
  var artifact = artifactJsonFromRow(row)
  var changes = row && row.summary && row.summary.attributes
  if (!changes) changes = artifact && artifact.attributes
  if (!changes || !changes.map) return []
  return changes.filter(function (change) { return change.changed !== false }).map(function (change) {
    return {
      attribute: change.name || '',
      left: change.left,
      right: change.right,
    }
  })
}

function textSummaryFromRow(row) {
  var artifact = artifactJsonFromRow(row)
  var text = row && row.summary && row.summary.text
  if (!text) text = artifact && artifact.text
  if (!text) return { changed: row ? row.textChanged : undefined }
  var summary = { changed: !!text.changed }
  if (text.changed) {
    summary.left = text.left
    summary.right = text.right
  }
  return summary
}

function boundsSummaryFromRow(row) {
  var bounds = row && row.bounds
  if (!bounds) return undefined
  return {
    changed: !!bounds.changed,
    left: bounds.left,
    right: bounds.right,
    delta: bounds.delta,
    normalizedWidth: row.normalizedWidth,
    normalizedHeight: row.normalizedHeight,
  }
}

function splitElements(elements) {
  return String(elements || '').split(',').map(function (s) { return s.trim() }).filter(Boolean)
}

function findSpecTarget(spec, page, variant) {
  var defaults = specDefaults(spec)
  var targets = lib.registry.targetsFromSpec(spec || {})
  for (var i = 0; i < targets.length; i++) {
    if (targets[i].page === page && (!variant || targets[i].variant === variant || targets[i].variant === (defaults.variant || 'desktop'))) return targets[i]
  }
  return null
}

function findTargetSection(target, sectionName) {
  var sections = (target && target.sections) || []
  for (var i = 0; i < sections.length; i++) {
    if (sections[i].name === sectionName) return sections[i]
  }
  return null
}

function scopeElementSelector(sectionSelector, elementSelector) {
  var element = String(elementSelector || '').trim()
  if (!element) return sectionSelector
  if (element.indexOf('&') === 0) return element.replace(/^&/, sectionSelector)
  if (element.indexOf('[data-section=') >= 0) return element
  if (element.indexOf('html') === 0 || element.indexOf('body') === 0) return element
  return sectionSelector + ' ' + element
}

async function inspectSelectorOnPage(page, selector, props) {
  var locator = page.locator(selector)
  var status = await locator.status()
  var row = {
    selector: selector,
    exists: !!status.exists,
    visible: !!status.visible,
    bounds: status.bounds || null,
    text: '',
    styles: {},
    attributes: {},
    error: status.error || '',
  }
  if (row.exists) {
    try { row.text = await locator.text({ normalizeWhitespace: true, trim: true }) } catch (err) { row.text = '' }
    try { row.bounds = await locator.bounds() } catch (err2) {}
    try { row.styles = await locator.computedStyle(props) } catch (err3) { row.error = String(err3 && err3.message || err3) }
    try { row.attributes = await locator.attributes(['id', 'class', 'data-page', 'data-section', 'data-element', 'data-pyxis-component', 'data-pyxis-part', 'style']) } catch (err4) {}
  }
  return row
}

function diffStyleMaps(left, right) {
  var keys = {}
  Object.keys(left || {}).forEach(function (k) { keys[k] = true })
  Object.keys(right || {}).forEach(function (k) { keys[k] = true })
  return Object.keys(keys).map(function (key) {
    return { property: key, left: left && left[key], right: right && right[key], changed: String(left && left[key]) !== String(right && right[key]) }
  })
}

async function inspectSpec(spec, values) {
  var defaults = specDefaults(spec)
  var variant = values.variant || defaults.variant || 'desktop'
  var target = findSpecTarget(spec, values.page || '', variant)
  if (!target) throw new Error('unknown page in spec: ' + (values.page || ''))
  var section = findTargetSection(target, values.section || '')
  if (!section) throw new Error('unknown section in spec: ' + target.page + '/' + (values.section || ''))
  var props = lib.styles.propsForPreset(values.stylePreset || 'typography')
  var elements = splitElements(values.elements || '')
  if (!elements.length) elements = ['&']
  var browser = await cvd.browser()
  var rows = []
  try {
    var originalPage = await browser.page(target.prototypeUrl, { viewport: target.viewport, waitMs: target.waitMs, name: target.page + '-inspect-original' })
    var reactPage = await browser.page(target.storybookUrl, { viewport: target.viewport, waitMs: target.waitMs, name: target.page + '-inspect-react' })
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i]
      var leftSelector = scopeElementSelector(section.original, element)
      var rightSelector = scopeElementSelector(section.react, element)
      var left = await inspectSelectorOnPage(originalPage, leftSelector, props)
      var right = await inspectSelectorOnPage(reactPage, rightSelector, props)
      rows.push({
        page: target.page,
        variant: target.variant,
        section: section.name,
        element: element,
        stylePreset: values.stylePreset || 'typography',
        leftSelector: leftSelector,
        rightSelector: rightSelector,
        left: left,
        right: right,
        textChanged: String(left.text || '') !== String(right.text || ''),
        boundsChanged: JSON.stringify(left.bounds || null) !== JSON.stringify(right.bounds || null),
        styleDiffs: diffStyleMaps(left.styles, right.styles).filter(function (d) { return values.summary ? d.changed : true }),
      })
    }
    await originalPage.close()
    await reactPage.close()
  } finally {
    await browser.close()
  }
  return rows
}

__verb__('inspectSpec', {
  parents: ['pyxis', 'pages'],
  short: 'Inspect nested elements from a JSON/YAML visual spec on prototype and React sides',
  output: 'structured',
  fields: {
    spec: { argument: true, type: 'objectFromFile', required: true, help: 'JSON/YAML visual spec with pages and sections' },
    values: { bind: 'all' },
    page: { type: 'string', required: true, help: 'Page slug in the spec' },
    section: { type: 'string', required: true, help: 'Section name in the spec' },
    elements: { type: 'string', default: '&', help: 'Comma-separated subelement selectors; use & for section root. Relative selectors are scoped under the section selector.' },
    stylePreset: { type: 'choice', choices: ['typography', 'layout', 'surface', 'spacing', 'pageShell'], default: 'typography', help: 'Style property preset to extract' },
    variant: { type: 'string', default: '', help: 'Optional variant override; defaults to spec/default variant' },
    summary: { type: 'bool', default: false, help: 'Only include changed style properties' },
  },
})

function summarizeCompareSpec(result) {
  return (result || []).map(function (suite) {
    return {
      pageCount: suite.pageCount,
      sectionCount: suite.sectionCount,
      maxChangedPercent: suite.maxChangedPercent,
      classificationCounts: suite.classificationCounts,
      policy: suite.policy ? {
        ok: suite.policy.ok,
        worstClassification: suite.policy.worstClassification,
        failureCount: suite.policy.failures ? suite.policy.failures.length : 0,
      } : undefined,
      jsonPath: suite.jsonPath,
      markdownPath: suite.markdownPath,
      rows: (suite.rows || []).map(function (row) {
        return {
          page: row.page,
          variant: row.variant,
          section: row.section,
          classification: row.classification,
          changedPercent: row.changedPercent,
          changedPixels: row.changedPixels,
          totalPixels: row.totalPixels,
          threshold: row.threshold,
          leftSelector: row.leftSelector,
          rightSelector: row.rightSelector,
          bounds: boundsSummaryFromRow(row),
          text: textSummaryFromRow(row),
          styleChangeCount: styleDiffsFromRow(row).length,
          styleDiffs: styleDiffsFromRow(row),
          attributeChangeCount: attributeDiffsFromRow(row).length,
          attributeDiffs: attributeDiffsFromRow(row),
          artifactJson: row.artifactJson,
          artifactMarkdown: row.artifactMarkdown,
          leftRegionPath: row.leftRegionPath,
          rightRegionPath: row.rightRegionPath,
          diffOnlyPath: row.diffOnlyPath,
          diffComparisonPath: row.diffComparisonPath,
        }
      }),
    }
  })
}

async function compareSpec(spec, values) {
  var defaults = specDefaults(spec)
  var result = await lib.compareRegion.compareSpec(spec, {
    page: values.page || '',
    section: values.section || '',
    variant: values.variant || defaults.variant || 'desktop',
    priority: values.priority || '',
    outDir: values.outDir || '',
    threshold: values.threshold || defaults.threshold || 30,
    inspect: values.inspect || defaults.inspect || 'rich',
    mode: values.mode || 'authoring',
    maxChangedPercent: values.maxChangedPercent || (spec && spec.maxChangedPercent),
    maxPolicyBand: values.maxPolicyBand || (spec && spec.maxPolicyBand) || '',
  })
  return values.summary ? summarizeCompareSpec(result) : result
}

__verb__('compareSpec', {
  parents: ['pyxis', 'pages'],
  short: 'Compare pages from a JSON/YAML visual spec loaded with objectFromFile',
  output: 'structured',
  fields: {
    spec: { argument: true, type: 'objectFromFile', required: true, help: 'JSON/YAML visual spec with pages and sections' },
    values: { bind: 'all' },
    page: { type: 'string', default: '', help: 'Optional page filter for smoke/debug runs' },
    section: { type: 'string', default: '', help: 'Optional section filter within matching pages, e.g. metrics' },
    summary: { type: 'bool', default: false, help: 'Return compact operator summary instead of the full nested result' },
    variant: { type: 'string', default: '', help: 'Optional variant override; defaults to spec.variant or desktop' },
    priority: { type: 'string', default: '', help: 'Optional priority filter' },
    outDir: { type: 'string', default: '', help: 'Output directory for suite artifacts' },
    threshold: { type: 'int', default: 0, help: 'Pixel threshold 0-255; 0 uses spec/default 30' },
    inspect: { type: 'string', default: '', help: 'Collection profile; defaults to spec.inspect or rich' },
    mode: { type: 'choice', choices: ['authoring', 'ci'], default: 'authoring', help: 'In ci mode, fail the command after writing reports when policy thresholds are exceeded' },
    maxChangedPercent: { type: 'float', default: 0, help: 'Optional policy threshold for changed percent; 0 uses spec value or disables it' },
    maxPolicyBand: { type: 'string', default: '', help: 'Optional maximum allowed classification band' },
  },
})

async function snapshotSection(page, section, values) {
  return await lib.snapshot.snapshotSection(page, section, {
    variant: values.variant || 'desktop',
    outDir: values.outDir || '',
    stylePreset: values.stylePreset || 'pageShell',
    boundsTolerance: {
      x: values.toleranceX || 0,
      y: values.toleranceY || 0,
      width: values.toleranceWidth || 0,
      height: values.toleranceHeight || 0,
    },
    failOnMissing: !!values.failOnMissing,
  })
}

__verb__('snapshotSection', {
  parents: ['pyxis', 'pages'],
  short: 'Write a semantic snapshot/diff for one page section',
  output: 'structured',
  fields: {
    page: { argument: true, required: true, help: 'Registered page slug' },
    section: { argument: true, required: true, help: 'Registered section name' },
    values: { bind: 'all' },
    variant: { type: 'string', default: 'desktop', help: 'Registered variant' },
    outDir: { type: 'string', default: '', help: 'Output directory for snapshot artifacts' },
    stylePreset: { type: 'choice', choices: ['typography', 'layout', 'surface', 'spacing', 'pageShell'], default: 'pageShell', help: 'Style property preset to extract' },
    toleranceX: { type: 'float', default: 0, help: 'Allowed x delta' },
    toleranceY: { type: 'float', default: 0, help: 'Allowed y delta' },
    toleranceWidth: { type: 'float', default: 0, help: 'Allowed width delta' },
    toleranceHeight: { type: 'float', default: 0, help: 'Allowed height delta' },
    failOnMissing: { type: 'bool', default: true, help: 'Fail when the selector is missing or hidden' },
  },
})

async function diffSnapshots(before, after, values) {
  return await lib.snapshot.diffSnapshots(before, after, {
    outDir: values.outDir || '',
  })
}

__verb__('diffSnapshots', {
  parents: ['pyxis', 'pages'],
  short: 'Diff two semantic snapshot JSON files',
  output: 'structured',
  fields: {
    before: { argument: true, required: true, help: 'Before snapshot.json path' },
    after: { argument: true, required: true, help: 'After snapshot.json path' },
    values: { bind: 'all' },
    outDir: { type: 'string', default: '', help: 'Output directory for snapshot diff artifacts' },
  },
})
