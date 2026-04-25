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

async function compareSpec(spec, values) {
  var defaults = specDefaults(spec)
  return await lib.compareRegion.compareSpec(spec, {
    page: values.page || '',
    variant: values.variant || defaults.variant || 'desktop',
    priority: values.priority || '',
    outDir: values.outDir || '',
    threshold: values.threshold || defaults.threshold || 30,
    inspect: values.inspect || defaults.inspect || 'rich',
    mode: values.mode || 'authoring',
    maxChangedPercent: values.maxChangedPercent || (spec && spec.maxChangedPercent),
    maxPolicyBand: values.maxPolicyBand || (spec && spec.maxPolicyBand) || '',
  })
}

__verb__('compareSpec', {
  parents: ['pyxis', 'pages'],
  short: 'Compare pages from a JSON/YAML visual spec loaded with objectFromFile',
  output: 'structured',
  fields: {
    spec: { argument: true, type: 'objectFromFile', required: true, help: 'JSON/YAML visual spec with pages and sections' },
    values: { bind: 'all' },
    page: { type: 'string', default: '', help: 'Optional page filter for smoke/debug runs' },
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
