var registry = require('./registry.js')
var artifacts = require('./artifacts.js')

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

function planCompareSection(pageName, sectionName, options) {
  options = options || {}
  var variant = options.variant || 'desktop'
  var target = registry.findPage(pageName, variant)
  if (!target) throw new Error('unknown page: ' + pageName)
  var section = registry.findSection(pageName, sectionName, variant)
  if (!section) throw new Error('unknown section: ' + pageName + '/' + sectionName)
  var outDir = options.outDir || artifacts.pageSectionOutDir('ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/various/04-compare-section', pageName, sectionName, variant)
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
    note: 'This is a command plan. Current css-visual-diff Goja runtime does not expose child_process, so execution is done by a shell smoke script or future cvd.comparePixels API.',
  }
}

module.exports = {
  buildCompareRegionArgs: buildCompareRegionArgs,
  argsToShellCommand: argsToShellCommand,
  planCompareSection: planCompareSection,
}
