var storybook = require('./storybook.js')
var defaultSpec = require('../specs/public-pages.desktop.visual.js')

var DEFAULTS = {
  prototypeBase: 'http://localhost:7070',
  storybookBase: 'http://localhost:6007',
  viewport: { width: 920, height: 1460 },
  waitMs: 1000,
}

function joinUrl(base, path) {
  return String(base || '').replace(/\/+$/, '') + '/' + String(path || '').replace(/^\/+/, '')
}

function normalizeAcceptedDifferences(config) {
  var accepted = config.acceptedDifferences || {}
  return accepted
}

function pageRecord(config, defaults) {
  defaults = defaults || DEFAULTS
  var storyUrl = storybook.storybookIframeUrl(defaults.storybookBase, config.storyId)
  var accepted = normalizeAcceptedDifferences(config)
  var sections = (config.sections || []).map(function (section) {
    var copy = {}
    Object.keys(section).forEach(function (key) { copy[key] = section[key] })
    copy.acceptedDifferences = copy.acceptedDifferences || accepted[copy.name] || []
    return copy
  })
  return {
    page: config.page,
    variant: config.variant || defaults.variant || 'desktop',
    priority: config.priority || 'unknown',
    prototypeUrl: joinUrl(defaults.prototypeBase, config.prototypePath),
    storyId: config.storyId,
    storybookUrl: storyUrl,
    viewport: config.viewport || defaults.viewport,
    waitMs: config.waitMs || defaults.waitMs,
    sections: sections,
    baselineDiffs: config.baselineDiffs || {},
    acceptedDifferences: accepted,
  }
}

function defaultsFromSpec(spec) {
  spec = spec || {}
  var raw = spec.defaults || spec
  return {
    prototypeBase: raw.prototypeBase || DEFAULTS.prototypeBase,
    storybookBase: raw.storybookBase || DEFAULTS.storybookBase,
    viewport: raw.viewport || DEFAULTS.viewport,
    waitMs: raw.waitMs || DEFAULTS.waitMs,
    variant: raw.variant || spec.variant || 'desktop',
    threshold: raw.threshold || spec.threshold || 30,
    inspect: raw.inspect || spec.inspect || 'rich',
  }
}

function targetsFromSpec(spec) {
  spec = spec || {}
  var defaults = defaultsFromSpec(spec)
  return (spec.pages || spec.targets || []).map(function (page) {
    return pageRecord(page, defaults)
  })
}

function defaultTargets() {
  return targetsFromSpec(defaultSpec)
}

function filterTargets(targets, filters) {
  filters = filters || {}
  return (targets || []).filter(function (target) {
    if (filters.page && target.page !== filters.page) return false
    if (filters.variant && target.variant !== filters.variant) return false
    if (filters.priority && target.priority !== filters.priority) return false
    return true
  })
}

function listTargets(filters) {
  return filterTargets(defaultTargets(), filters)
}

function findPage(page, variant) {
  var defaults = defaultsFromSpec(defaultSpec)
  var matches = listTargets({ page: page, variant: variant || defaults.variant || 'desktop' })
  return matches.length ? matches[0] : null
}

function findSection(page, section, variant) {
  var target = findPage(page, variant)
  if (!target) return null
  for (var i = 0; i < target.sections.length; i++) {
    if (target.sections[i].name === section) return target.sections[i]
  }
  return null
}

function flattenTargets(filters) {
  var rows = []
  listTargets(filters).forEach(function (target) {
    target.sections.forEach(function (section) {
      rows.push({
        page: target.page,
        variant: target.variant,
        section: section.name,
        priority: target.priority,
        prototypeUrl: target.prototypeUrl,
        storyId: target.storyId,
        storybookUrl: target.storybookUrl,
        originalSelector: section.original,
        reactSelector: section.react,
        baselineChangedPercent: target.baselineDiffs[section.name],
      })
    })
  })
  return rows
}

module.exports = {
  DEFAULTS: DEFAULTS,
  defaultSpec: defaultSpec,
  joinUrl: joinUrl,
  pageRecord: pageRecord,
  targetsFromSpec: targetsFromSpec,
  defaultTargets: defaultTargets,
  filterTargets: filterTargets,
  listTargets: listTargets,
  findPage: findPage,
  findSection: findSection,
  flattenTargets: flattenTargets,
}
