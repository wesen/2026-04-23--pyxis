__package__({
  name: 'pages',
  parents: ['pyxis'],
  short: 'Pyxis public page css-visual-diff userland commands',
})

var lib = require('../lib/index.js')

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

function importSmoke() {
  var storyUrl = lib.storybook.storybookIframeUrl('http://localhost:6007', 'public-site-pages--archive-desktop')
  var target = lib.registry.findPage('archive', 'desktop')
  var section = lib.registry.findSection('archive', 'content', 'desktop')
  return [{
    ok: !!(target && section && storyUrl.indexOf('/iframe.html?id=') !== -1),
    slug: lib.slug.joinSlug('Archive', 'Content'),
    artifactDir: lib.artifacts.pageSectionOutDir('/tmp/pyxis-cssvd', 'Archive', 'Content', 'Desktop'),
    storybookUrl: storyUrl,
    targetPage: target ? target.page : '',
    sectionName: section ? section.name : '',
    originalSelector: section ? section.original : '',
    reactSelector: section ? section.react : '',
  }]
}

__verb__('importSmoke', {
  parents: ['pyxis', 'pages'],
  short: 'Validate relative imports for the Pyxis css-visual-diff JS userland library',
  output: 'structured',
  fields: {},
})

function summarizeResults(values) {
  var rows = lib.results.readPageVisualComparisonResults(values.resultsDir, {
    page: values.page || '',
    variant: values.variant || '',
    priority: values.priority || '',
  })
  if (values.jsonOut) {
    lib.results.writeJson(values.jsonOut, rows)
  }
  if (values.markdown) {
    lib.results.writeText(values.markdown, lib.markdown.renderPageSummary(rows, { resultsDir: values.resultsDir }))
  }
  return rows
}

__verb__('summarizeResults', {
  parents: ['pyxis', 'pages'],
  short: 'Summarize existing Pyxis public page visual comparison pixeldiff artifacts',
  output: 'structured',
  fields: {
    values: { bind: 'all' },
    resultsDir: { type: 'string', default: 'prototype-design/visual-comparisons/public-pages', help: 'Directory containing page visual comparison output folders' },
    markdown: { type: 'string', default: '', help: 'Optional Markdown report output path; parent directory must exist' },
    jsonOut: { type: 'string', default: '', help: 'Optional JSON report output path; parent directory must exist' },
    page: { type: 'string', default: '', help: 'Filter by page slug' },
    variant: { type: 'string', default: '', help: 'Filter by variant' },
    priority: { type: 'string', default: '', help: 'Filter by priority label' },
  },
})
