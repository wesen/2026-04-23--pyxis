var storybook = require('./storybook.js')

var DEFAULTS = {
  prototypeBase: 'http://localhost:7070',
  storybookBase: 'http://localhost:6007',
  viewport: { width: 920, height: 1460 },
  waitMs: 1000,
}

function prototypeUrl(path) {
  return DEFAULTS.prototypeBase.replace(/\/+$/, '') + '/' + String(path || '').replace(/^\/+/, '')
}

function pageRecord(config) {
  var storyUrl = storybook.storybookIframeUrl(DEFAULTS.storybookBase, config.storyId)
  return {
    page: config.page,
    variant: config.variant || 'desktop',
    priority: config.priority || 'unknown',
    prototypeUrl: prototypeUrl(config.prototypePath),
    storyId: config.storyId,
    storybookUrl: storyUrl,
    viewport: config.viewport || DEFAULTS.viewport,
    waitMs: config.waitMs || DEFAULTS.waitMs,
    sections: config.sections || [],
    baselineDiffs: config.baselineDiffs || {},
  }
}

var PUBLIC_PAGES = [
  pageRecord({
    page: 'shows',
    priority: 'tune-first',
    prototypePath: '/standalone/public/shows.html',
    storyId: 'public-site-pages--shows-desktop',
    sections: [
      { name: 'page', original: '#root', react: "[data-story-frame='pyxis-page-shell']" },
      { name: 'content', original: '#root > *', react: "[data-page='shows']" },
      { name: 'header', original: '#root > *', react: "[data-section='shows-header']" },
      { name: 'shows-list', original: '#root > *', react: "[data-section='shows-list']" },
      { name: 'mailing-list', original: '#root > *', react: "[data-section='mailing-list']" },
    ],
    baselineDiffs: { page: 50.5245, content: 49.0940, header: 51.0775, 'shows-list': 66.8566, 'mailing-list': 51.2191 },
  }),
  pageRecord({
    page: 'show-detail',
    priority: 'second-pass',
    prototypePath: '/standalone/public/detail.html',
    storyId: 'public-site-pages--show-detail-desktop',
    sections: [
      { name: 'page', original: '#root', react: "[data-story-frame='pyxis-page-shell']" },
      { name: 'content', original: '#root > *', react: "[data-page='show-detail']" },
    ],
    baselineDiffs: { page: 18.5282, content: 24.4647 },
  }),
  pageRecord({
    page: 'archive',
    priority: 'closest-to-acceptance',
    prototypePath: '/standalone/public/archive.html',
    storyId: 'public-site-pages--archive-desktop',
    sections: [
      { name: 'page', original: '#root', react: "[data-story-frame='pyxis-page-shell']" },
      { name: 'content', original: '#root > *', react: "[data-page='archive']" },
    ],
    baselineDiffs: { page: 6.6511, content: 7.1281 },
  }),
  pageRecord({
    page: 'book',
    priority: 'second-pass',
    prototypePath: '/standalone/public/book.html',
    storyId: 'public-site-pages--book-desktop',
    sections: [
      { name: 'page', original: '#root', react: "[data-story-frame='pyxis-page-shell']" },
      { name: 'content', original: '#root > *', react: "[data-page='book']" },
    ],
    baselineDiffs: { page: 12.1006, content: 14.5896 },
  }),
  pageRecord({
    page: 'about',
    priority: 'second-pass',
    prototypePath: '/standalone/public/about.html',
    storyId: 'public-site-pages--about-desktop',
    sections: [
      { name: 'page', original: '#root', react: "[data-story-frame='pyxis-page-shell']" },
      { name: 'content', original: '#root > *', react: "[data-page='about']" },
    ],
    baselineDiffs: { page: 18.2795, content: 20.4334 },
  }),
]

function listTargets(filters) {
  filters = filters || {}
  return PUBLIC_PAGES.filter(function (target) {
    if (filters.page && target.page !== filters.page) return false
    if (filters.variant && target.variant !== filters.variant) return false
    if (filters.priority && target.priority !== filters.priority) return false
    return true
  })
}

function findPage(page, variant) {
  var matches = listTargets({ page: page, variant: variant || 'desktop' })
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
  PUBLIC_PAGES: PUBLIC_PAGES,
  listTargets: listTargets,
  findPage: findPage,
  findSection: findSection,
  flattenTargets: flattenTargets,
}
