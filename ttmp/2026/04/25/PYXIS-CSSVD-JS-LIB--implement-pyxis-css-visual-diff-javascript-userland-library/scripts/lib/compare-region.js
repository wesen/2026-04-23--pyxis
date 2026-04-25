var cvd = require('css-visual-diff')
var fs = require('fs')
var registry = require('./registry.js')
var artifacts = require('./artifacts.js')
var policies = require('./policies.js')
var markdown = require('./markdown.js')

var DEFAULT_STYLE_PROPS = [
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-radius',
  'color',
  'background-color',
  'box-shadow',
]

var DEFAULT_ATTRIBUTES = ['id', 'class', 'data-page', 'data-section', 'data-pyxis-component', 'data-pyxis-part']

function shellQuote(value) {
  value = String(value == null ? '' : value)
  return "'" + value.replace(/'/g, "'\\''") + "'"
}

function buildCompareRegionArgs(options) {
  options = options || {}
  return [
    'verbs', 'script', 'compare', 'region',
    '--leftUrl', options.leftUrl,
    '--rightUrl', options.rightUrl,
    '--leftSelector', options.leftSelector,
    '--rightSelector', options.rightSelector,
    '--width', String(options.width || 920),
    '--height', String(options.height || 1460),
    '--leftWaitMs', String(options.leftWaitMs || 1000),
    '--rightWaitMs', String(options.rightWaitMs || 1000),
    '--outDir', options.outDir,
    '--writeJson',
    '--writeMarkdown',
    '--writePngs',
    '--output', 'json',
  ]
}

function argsToShellCommand(args) {
  return ['css-visual-diff'].concat(args).map(shellQuote).join(' ')
}

function findTargetAndSection(pageName, sectionName, options) {
  options = options || {}
  var variant = options.variant || 'desktop'
  var target = registry.findPage(pageName, variant)
  if (!target) throw new Error('unknown page: ' + pageName)
  var section = registry.findSection(pageName, sectionName, variant)
  if (!section) throw new Error('unknown section: ' + pageName + '/' + sectionName)
  return { target: target, section: section }
}

function defaultOutDir(pageName, sectionName, variant) {
  return artifacts.pageSectionOutDir(
    'ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/various/04-compare-section',
    pageName,
    sectionName,
    variant || 'desktop'
  )
}

function planCompareSection(pageName, sectionName, options) {
  options = options || {}
  var found = findTargetAndSection(pageName, sectionName, options)
  var target = found.target
  var section = found.section
  var outDir = options.outDir || defaultOutDir(pageName, sectionName, target.variant)
  var args = buildCompareRegionArgs({
    leftUrl: target.prototypeUrl,
    rightUrl: target.storybookUrl,
    leftSelector: section.original,
    rightSelector: section.react,
    width: target.viewport.width,
    height: target.viewport.height,
    leftWaitMs: target.waitMs,
    rightWaitMs: target.waitMs,
    outDir: outDir,
  })
  return {
    page: target.page,
    variant: target.variant,
    section: section.name,
    outDir: outDir,
    leftUrl: target.prototypeUrl,
    rightUrl: target.storybookUrl,
    leftSelector: section.original,
    rightSelector: section.react,
    args: args,
    shellCommand: argsToShellCommand(args),
    note: 'Command-plan compatibility view for the built-in compare-region verb. Prefer pyxis pages compare-section on css-visual-diff versions exposing cvd.compare.region.',
  }
}

function artifactPath(artifactsList, name) {
  artifactsList = artifactsList || []
  for (var i = 0; i < artifactsList.length; i++) {
    if (artifactsList[i].name === name) return artifactsList[i].path || ''
  }
  return ''
}

async function waitForLocator(page, selector, options) {
  options = options || {}
  await page.locator(selector).waitFor({
    timeoutMs: options.timeoutMs || 30000,
    pollIntervalMs: options.pollIntervalMs || 100,
    visible: options.visible !== false,
    afterWaitMs: options.afterWaitMs == null ? 500 : options.afterWaitMs,
  })
}

function comparisonRow(target, section, outDir, threshold, summary, json, written, bounds) {
  var pixel = summary.pixel || (json && json.pixel) || {}
  var baselineChangedPercent = target.baselineDiffs ? target.baselineDiffs[section.name] : undefined
  return policies.withClassification({
    page: target.page,
    variant: target.variant,
    section: section.name,
    outDir: outDir,
    leftUrl: target.prototypeUrl,
    rightUrl: target.storybookUrl,
    leftSelector: section.original,
    rightSelector: section.react,
    threshold: threshold,
    changedPercent: pixel.changedPercent,
    changedPixels: pixel.changedPixels,
    totalPixels: pixel.totalPixels,
    normalizedWidth: pixel.normalizedWidth,
    normalizedHeight: pixel.normalizedHeight,
    bounds: bounds,
    textChanged: summary.text ? summary.text.changed : undefined,
    artifactJson: written.json || artifactPath(json.artifacts, 'json'),
    artifactMarkdown: written.markdown || artifactPath(json.artifacts, 'markdown'),
    leftRegionPath: written.leftRegion || artifactPath(json.artifacts, 'leftRegion'),
    rightRegionPath: written.rightRegion || artifactPath(json.artifacts, 'rightRegion'),
    diffComparisonPath: written.diffComparison || artifactPath(json.artifacts, 'diffComparison'),
    diffOnlyPath: written.diffOnly || artifactPath(json.artifacts, 'diffOnly'),
    writtenArtifacts: written.written || [],
    baselineChangedPercent: baselineChangedPercent,
    acceptedDifferences: section.acceptedDifferences || [],
    source: 'cvd.compare.region',
    summary: summary,
  })
}

function dirname(path) {
  return String(path || '').replace(/\/[^/]*$/g, '')
}

async function ensureDir(path) {
  if (!path) return path
  if (fs.mkdir) {
    await fs.mkdir(path, { recursive: true })
  }
  return path
}

async function readText(path) {
  if (fs.readFile) return String(await fs.readFile(path, 'utf8'))
  return String(fs.readFileSync(path))
}

async function writeText(path, content) {
  await ensureDir(dirname(path))
  if (fs.writeFile) {
    await fs.writeFile(path, content)
  } else {
    fs.writeFileSync(path, content)
  }
  return path
}

async function ensureDocmgrMarkdown(path, title) {
  if (!path) return path
  try {
    var content = await readText(path)
    if (content.indexOf('---\n') === 0) return path
    var frontmatter = [
      '---',
      'Title: ' + title,
      'Ticket: PYXIS-CSSVD-JS-LIB',
      'Status: active',
      'Topics:',
      '  - frontend',
      '  - visual-diff',
      '  - storybook',
      '  - automation',
      '  - pyxis',
      'DocType: reference',
      'Intent: short-term',
      'Summary: Generated css-visual-diff compare.region artifact wrapped for docmgr validation.',
      '---',
      '',
    ].join('\n')
    await writeText(path, frontmatter + content)
  } catch (err) {
    // Best-effort wrapper; comparison data is still returned if this fails.
  }
  return path
}

async function compareSection(pageName, sectionName, options) {
  options = options || {}
  var found = findTargetAndSection(pageName, sectionName, options)
  var target = found.target
  var section = found.section
  var outDir = options.outDir || defaultOutDir(pageName, sectionName, target.variant)
  var threshold = Number(options.threshold || 30)
  var browser = await cvd.browser()
  var leftPage = null
  var rightPage = null
  try {
    leftPage = await browser.page(target.prototypeUrl, {
      viewport: target.viewport,
      waitMs: target.waitMs,
      name: target.page + '-prototype',
    })
    await waitForLocator(leftPage, section.original, { visible: true })
    rightPage = await browser.page(target.storybookUrl, {
      viewport: target.viewport,
      waitMs: target.waitMs,
      name: target.page + '-storybook',
    })
    await waitForLocator(rightPage, section.react, { visible: true })
    var comparison = await cvd.compare.region({
      name: target.page + '-' + section.name,
      left: leftPage.locator(section.original),
      right: rightPage.locator(section.react),
      threshold: threshold,
      inspect: options.inspect || 'rich',
      outDir: outDir,
      styleProps: options.styleProps || DEFAULT_STYLE_PROPS,
      attributes: options.attributes || DEFAULT_ATTRIBUTES,
    })
    var written = await comparison.artifacts.write(outDir, ['json', 'markdown'])
    await ensureDocmgrMarkdown(written.markdown || (outDir + '/compare.md'), 'Generated compare.region artifact for ' + target.page + ' ' + section.name)
    var summary = comparison.summary()
    var json = comparison.toJSON ? comparison.toJSON() : summary
    var bounds = summary.bounds || (comparison.bounds && comparison.bounds.diff ? comparison.bounds.diff() : null)
    return comparisonRow(target, section, outDir, threshold, summary, json, written, bounds)
  } finally {
    if (leftPage) await leftPage.close()
    if (rightPage) await rightPage.close()
    await browser.close()
  }
}

function countByClassification(rows) {
  var counts = {}
  rows.forEach(function (row) {
    var key = row.classification || policies.classifyChangedPercent(row.changedPercent)
    counts[key] = (counts[key] || 0) + 1
  })
  return counts
}

function maxChangedPercent(rows) {
  return rows.reduce(function (max, row) {
    var value = Number(row.changedPercent || 0)
    return value > max ? value : max
  }, 0)
}

async function comparePage(pageName, options) {
  options = options || {}
  var variant = options.variant || 'desktop'
  var target = registry.findPage(pageName, variant)
  if (!target) throw new Error('unknown page: ' + pageName)
  var outDir = options.outDir || artifacts.artifactDir(
    'ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/various/06-compare-page',
    pageName,
    variant
  )
  var threshold = Number(options.threshold || 30)
  var catalog = cvd.catalog.create({
    title: 'Pyxis public page comparison: ' + target.page + ' ' + target.variant,
    outDir: outDir,
    artifactRoot: 'artifacts',
    indexName: '01-catalog-index.md',
  })
  var browser = await cvd.browser()
  var leftPage = null
  var rightPage = null
  var rows = []
  try {
    leftPage = await browser.page(target.prototypeUrl, {
      viewport: target.viewport,
      waitMs: target.waitMs,
      name: target.page + '-prototype',
    })
    rightPage = await browser.page(target.storybookUrl, {
      viewport: target.viewport,
      waitMs: target.waitMs,
      name: target.page + '-storybook',
    })
    for (var i = 0; i < target.sections.length; i++) {
      var section = target.sections[i]
      await waitForLocator(leftPage, section.original, { visible: true })
      await waitForLocator(rightPage, section.react, { visible: true })
      var artifactDir = catalog.artifactDir(section.name)
      var comparison = await cvd.compare.region({
        name: target.page + '-' + section.name,
        left: leftPage.locator(section.original),
        right: rightPage.locator(section.react),
        threshold: threshold,
        inspect: options.inspect || 'rich',
        outDir: artifactDir,
        styleProps: options.styleProps || DEFAULT_STYLE_PROPS,
        attributes: options.attributes || DEFAULT_ATTRIBUTES,
      })
      var written = await comparison.artifacts.write(artifactDir, ['json', 'markdown'])
      await ensureDocmgrMarkdown(written.markdown || (artifactDir + '/compare.md'), 'Generated compare.region artifact for ' + target.page + ' ' + section.name)
      catalog.record(comparison, {
        slug: section.name,
        name: target.page + ' ' + section.name,
        url: target.prototypeUrl,
        selector: section.original,
      })
      var summary = comparison.summary()
      var json = comparison.toJSON ? comparison.toJSON() : summary
      var bounds = summary.bounds || (comparison.bounds && comparison.bounds.diff ? comparison.bounds.diff() : null)
      rows.push(comparisonRow(target, section, artifactDir, threshold, summary, json, written, bounds))
    }
    var manifestPath = await catalog.writeManifest()
    var indexPath = await catalog.writeIndex()
    await ensureDocmgrMarkdown(indexPath, 'Generated comparison catalog for ' + target.page)
    return [{
      page: target.page,
      variant: target.variant,
      outDir: outDir,
      sectionCount: rows.length,
      maxChangedPercent: maxChangedPercent(rows),
      classificationCounts: countByClassification(rows),
      acceptedDifferenceCount: rows.reduce(function (count, row) { return count + (row.acceptedDifferenceCount || 0) }, 0),
      manifestPath: manifestPath,
      indexPath: indexPath,
      catalog: catalog.summary(),
      sections: rows,
    }]
  } finally {
    if (leftPage) await leftPage.close()
    if (rightPage) await rightPage.close()
    await browser.close()
  }
}

async function compareAll(options) {
  options = options || {}
  var variant = options.variant || 'desktop'
  var targets = registry.listTargets({
    page: options.page || '',
    variant: variant,
    priority: options.priority || '',
  })
  var outDir = options.outDir || artifacts.artifactDir(
    'ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/various/07-compare-all',
    'public-pages',
    variant
  )
  var pageRuns = []
  var rows = []
  for (var i = 0; i < targets.length; i++) {
    var target = targets[i]
    var pageOutDir = artifacts.artifactDir(outDir, target.page)
    var pageResult = await comparePage(target.page, {
      variant: target.variant,
      outDir: pageOutDir,
      threshold: options.threshold || 30,
      inspect: options.inspect || 'rich',
    })
    var run = pageResult[0]
    pageRuns.push(run)
    rows = rows.concat(run.sections || [])
  }
  rows = policies.sortByChangedPercentDesc(rows)
  var policy = policies.passesPolicy(rows, {
    maxChangedPercent: options.maxChangedPercent,
    maxPolicyBand: options.maxPolicyBand || '',
  })
  policy.maxChangedPercent = policies.normalizeMaxChangedPercent(options.maxChangedPercent)
  policy.maxPolicyBand = options.maxPolicyBand || ''
  var suite = {
    variant: variant,
    mode: options.mode || 'authoring',
    outDir: outDir,
    pageCount: pageRuns.length,
    sectionCount: rows.length,
    maxChangedPercent: maxChangedPercent(rows),
    classificationCounts: countByClassification(rows),
    acceptedDifferenceCount: rows.reduce(function (count, row) { return count + (row.acceptedDifferenceCount || 0) }, 0),
    policy: policy,
    pages: pageRuns,
    rows: rows,
  }
  var jsonPath = outDir.replace(/\/+$/g, '') + '/compare-all-output.json'
  var markdownPath = outDir.replace(/\/+$/g, '') + '/01-suite-summary.md'
  await ensureDir(outDir)
  await writeText(jsonPath, JSON.stringify([suite], null, 2))
  await writeText(markdownPath, markdown.renderCompareAllSummary(suite))
  suite.jsonPath = jsonPath
  suite.markdownPath = markdownPath
  if ((options.mode || 'authoring') === 'ci' && !policy.ok) {
    throw new Error('compare-all policy failed: ' + policy.failures.length + ' failure(s); wrote ' + jsonPath + ' and ' + markdownPath)
  }
  return [suite]
}

module.exports = {
  buildCompareRegionArgs: buildCompareRegionArgs,
  argsToShellCommand: argsToShellCommand,
  planCompareSection: planCompareSection,
  compareSection: compareSection,
  comparePage: comparePage,
  compareAll: compareAll,
}
