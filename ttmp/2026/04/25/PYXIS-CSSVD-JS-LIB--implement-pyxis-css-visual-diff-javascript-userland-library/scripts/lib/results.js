var fs = require('fs')
var registry = require('./registry.js')
var policies = require('./policies.js')

function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}

function parsePixelDiffMarkdown(markdown, metadata) {
  metadata = metadata || {}
  var rows = []
  String(markdown || '').split(/\r?\n/).forEach(function (line) {
    if (line.indexOf('|') !== 0) return
    if (line.indexOf('Changed %') !== -1) return
    if (line.indexOf('---') !== -1) return
    var parts = line.split('|').map(function (p) { return p.trim() }).filter(function (p) { return p.length > 0 })
    if (parts.length < 3) return
    var section = parts[0]
    var changedPercentText = parts[1].replace('%', '')
    var changedPercent = Number(changedPercentText)
    if (isNaN(changedPercent)) return
    var counts = parts[2].split('/')
    var changedPixels = Number(counts[0])
    var totalPixels = Number(counts[1])
    rows.push({
      page: metadata.page || '',
      variant: metadata.variant || 'desktop',
      section: section,
      changedPercent: changedPercent,
      changedPixels: isNaN(changedPixels) ? null : changedPixels,
      totalPixels: isNaN(totalPixels) ? null : totalPixels,
      classification: policies.classifyChangedPercent(changedPercent),
      source: metadata.source || 'yaml-run',
      artifactDir: metadata.artifactDir || '',
      diffComparisonPath: parts[3] || '',
    })
  })
  return rows
}

function readFileOrNull(path) {
  try {
    return String(fs.readFileSync(path))
  } catch (err) {
    return null
  }
}

function pageResultDirName(target) {
  return target.page + '-' + target.variant
}

function readPageVisualComparisonResults(resultsDir, filters) {
  var root = trimTrailingSlash(resultsDir || 'prototype-design/visual-comparisons/public-pages')
  var rows = []
  registry.listTargets(filters || {}).forEach(function (target) {
    var artifactDir = root + '/' + pageResultDirName(target)
    var pixeldiffPath = artifactDir + '/pixeldiff.md'
    var markdown = readFileOrNull(pixeldiffPath)
    if (markdown == null) {
      rows.push({
        page: target.page,
        variant: target.variant,
        section: '*',
        changedPercent: null,
        changedPixels: null,
        totalPixels: null,
        classification: 'missing-artifact',
        source: 'yaml-run',
        artifactDir: artifactDir,
        diffComparisonPath: '',
        error: 'missing pixeldiff.md',
      })
      return
    }
    rows = rows.concat(parsePixelDiffMarkdown(markdown, {
      page: target.page,
      variant: target.variant,
      source: 'yaml-run',
      artifactDir: artifactDir,
    }))
  })
  return policies.sortByChangedPercentDesc(rows)
}

function writeJson(path, value) {
  fs.writeFileSync(path, JSON.stringify(value, null, 2) + '\n')
}

function writeText(path, value) {
  fs.writeFileSync(path, String(value))
}

module.exports = {
  parsePixelDiffMarkdown: parsePixelDiffMarkdown,
  readPageVisualComparisonResults: readPageVisualComparisonResults,
  writeJson: writeJson,
  writeText: writeText,
}
