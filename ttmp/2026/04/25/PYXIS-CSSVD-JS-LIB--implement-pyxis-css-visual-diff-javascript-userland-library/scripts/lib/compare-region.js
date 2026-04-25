var cvd = require('css-visual-diff')
var fs = require('fs')
var registry = require('./registry.js')
var artifacts = require('./artifacts.js')

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

function ensureDocmgrMarkdown(path, title) {
  if (!path) return path
  try {
    var content = String(fs.readFileSync(path))
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
    fs.writeFileSync(path, frontmatter + content)
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
    ensureDocmgrMarkdown(written.markdown || (outDir + '/compare.md'), 'Generated compare.region artifact for ' + target.page + ' ' + section.name)
    var summary = comparison.summary()
    var json = comparison.toJSON ? comparison.toJSON() : summary
    var pixel = summary.pixel || (json && json.pixel) || {}
    var bounds = summary.bounds || (comparison.bounds && comparison.bounds.diff ? comparison.bounds.diff() : null)
    return {
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
      summary: summary,
    }
  } finally {
    if (leftPage) await leftPage.close()
    if (rightPage) await rightPage.close()
    await browser.close()
  }
}

module.exports = {
  buildCompareRegionArgs: buildCompareRegionArgs,
  argsToShellCommand: argsToShellCommand,
  planCompareSection: planCompareSection,
  compareSection: compareSection,
}
