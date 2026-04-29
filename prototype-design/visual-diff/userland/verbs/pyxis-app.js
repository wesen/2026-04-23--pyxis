__package__({
  name: 'app',
  parents: ['pyxis'],
  short: 'Pyxis staff app css-visual-diff userland commands',
})

var cvd = require('css-visual-diff')
var fs = require('fs')
var path = require('path')

function ensureDir(filePath) {
  var dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
}

function storyUrl(baseUrl, storyId) {
  return String(baseUrl || 'http://localhost:6008').replace(/\/$/, '') + '/iframe.html?id=' + encodeURIComponent(storyId) + '&viewMode=story'
}

async function captureStory(storyId, outputFile, values) {
  values = values || {}
  var selector = values.selector || '[data-pyxis-component="post-show-log-editor-modal"]'
  var url = storyUrl(values.baseUrl, storyId)
  var viewport = { width: values.width || 375, height: values.height || 980 }
  var waitMs = values.waitMs == null ? 1000 : values.waitMs
  var inspectOutDir = values.outDir || path.join(path.dirname(outputFile), 'inspect-' + String(storyId).replace(/[^a-zA-Z0-9_-]+/g, '-'))
  ensureDir(outputFile)
  fs.mkdirSync(inspectOutDir, { recursive: true })

  var browser = await cvd.browser()
  var page
  try {
    page = await browser.page(url, { viewport: viewport, waitMs: waitMs, name: 'pyxis-app-story' })
    var locator = page.locator(selector)
    await locator.waitFor({ timeoutMs: values.timeoutMs || 30000, pollIntervalMs: 100, visible: true, afterWaitMs: 250 })
    var status = await locator.status()
    var artifact = await page.inspect(
      { name: values.name || 'story-region', selector: selector, props: ['display', 'width', 'height', 'padding', 'overflow', 'grid-template-columns'] },
      { outDir: inspectOutDir, artifacts: 'screenshot' }
    )
    var screenshotPath = artifact && artifact.screenshot
    if (!screenshotPath) throw new Error('page.inspect did not return a screenshot artifact')
    if (path.resolve(screenshotPath) !== path.resolve(outputFile)) fs.copyFileSync(screenshotPath, outputFile)
    return {
      ok: true,
      url: url,
      selector: selector,
      viewport: viewport,
      outputFile: outputFile,
      inspectOutDir: inspectOutDir,
      bounds: status.bounds || null,
      sourceArtifact: screenshotPath,
    }
  } finally {
    if (page) await page.close()
    await browser.close()
  }
}

__verb__('captureStory', {
  parents: ['pyxis', 'app'],
  short: 'Capture one Pyxis app Storybook story selector without configuring a fake original/react comparison',
  output: 'structured',
  fields: {
    storyId: { argument: true, required: true, help: 'Storybook story id, e.g. pyxis-app-components-organisms-showlog-postshowlogeditormodal--incident' },
    outputFile: { argument: true, required: true, help: 'PNG output path' },
    values: { bind: 'all' },
    selector: { type: 'string', default: '[data-pyxis-component="post-show-log-editor-modal"]', help: 'CSS selector to capture' },
    baseUrl: { type: 'string', default: 'http://localhost:6008', help: 'Storybook base URL' },
    width: { type: 'int', default: 375, help: 'Viewport width' },
    height: { type: 'int', default: 980, help: 'Viewport height' },
    waitMs: { type: 'int', default: 1000, help: 'Post-navigation wait in milliseconds' },
    timeoutMs: { type: 'int', default: 30000, help: 'Selector wait timeout in milliseconds' },
    outDir: { type: 'string', default: '', help: 'Optional inspect artifact directory; defaults next to outputFile' },
    name: { type: 'string', default: 'story-region', help: 'Artifact probe name' },
  },
})
