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

function compareSectionCommand(page, section, values) {
  return [lib.compareRegion.planCompareSection(page, section, {
    variant: values.variant || 'desktop',
    outDir: values.outDir || '',
  })]
}

__verb__('compareSectionCommand', {
  parents: ['pyxis', 'pages'],
  short: 'Build the built-in compare-region command for a registered Pyxis page section',
  output: 'structured',
  fields: {
    page: { argument: true, required: true, help: 'Registered page slug' },
    section: { argument: true, required: true, help: 'Registered section name' },
    values: { bind: 'all' },
    variant: { type: 'string', default: 'desktop', help: 'Registered variant' },
    outDir: { type: 'string', default: '', help: 'Output directory for artifacts' },
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
