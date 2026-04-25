var cvd = require('css-visual-diff')
var registry = require('./registry.js')
var styles = require('./styles.js')

function textStart(text, max) {
  text = String(text || '').replace(/\s+/g, ' ').trim()
  max = max || 160
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}

async function inspectLocator(page, selector, options) {
  options = options || {}
  var locator = page.locator(selector)
  if (options.wait !== false) {
    try {
      await locator.waitFor({
        timeoutMs: options.timeoutMs || 30000,
        pollIntervalMs: options.pollIntervalMs || 100,
        visible: options.visible !== false,
        afterWaitMs: options.afterWaitMs == null ? 500 : options.afterWaitMs,
      })
    } catch (err) {
      // Preserve status-based diagnostics below when waiting fails.
    }
  }
  var status = await locator.status()
  var row = {
    exists: !!status.exists,
    visible: !!status.visible,
    selector: selector,
    bounds: status.bounds || null,
    textStart: status.textStart || '',
    styles: {},
    attributes: {},
    error: status.error || '',
  }
  if (row.exists) {
    row.textStart = textStart(await locator.text({ normalizeWhitespace: true, trim: true }), 180)
    row.bounds = await locator.bounds()
    row.styles = await locator.computedStyle(options.props || styles.propsForPreset('pageShell'))
    row.attributes = await locator.attributes(['id', 'class', 'data-page', 'data-section', 'data-pyxis-component', 'data-pyxis-part'])
  }
  return row
}

async function inspectSection(pageName, sectionName, options) {
  options = options || {}
  var target = registry.findPage(pageName, options.variant || 'desktop')
  if (!target) throw new Error('unknown page: ' + pageName)
  var section = registry.findSection(pageName, sectionName, options.variant || 'desktop')
  if (!section) throw new Error('unknown section: ' + pageName + '/' + sectionName)

  var side = options.side || 'both'
  var props = options.props || styles.propsForPreset(options.stylePreset || 'pageShell')
  var browser = await cvd.browser()
  var rows = []
  try {
    if (side === 'both' || side === 'original') {
      var originalPage = await browser.page(target.prototypeUrl, {
        viewport: target.viewport,
        waitMs: target.waitMs,
        name: target.page + '-prototype',
      })
      var original = await inspectLocator(originalPage, section.original, { props: props })
      rows.push({
        page: target.page,
        variant: target.variant,
        section: section.name,
        side: 'original',
        url: target.prototypeUrl,
        selector: section.original,
        exists: original.exists,
        visible: original.visible,
        bounds: original.bounds,
        textStart: original.textStart,
        styles: original.styles,
        attributes: original.attributes,
        error: original.error,
      })
      await originalPage.close()
    }
    if (side === 'both' || side === 'react') {
      var reactPage = await browser.page(target.storybookUrl, {
        viewport: target.viewport,
        waitMs: target.waitMs,
        name: target.page + '-storybook',
      })
      var react = await inspectLocator(reactPage, section.react, { props: props })
      rows.push({
        page: target.page,
        variant: target.variant,
        section: section.name,
        side: 'react',
        url: target.storybookUrl,
        selector: section.react,
        exists: react.exists,
        visible: react.visible,
        bounds: react.bounds,
        textStart: react.textStart,
        styles: react.styles,
        attributes: react.attributes,
        error: react.error,
      })
      await reactPage.close()
    }
  } finally {
    await browser.close()
  }

  if (options.failOnMissing) {
    rows.forEach(function (row) {
      if (!row.exists || !row.visible) throw new Error('selector missing or hidden: ' + row.side + ' ' + row.selector)
    })
  }
  return rows
}

module.exports = { inspectSection: inspectSection }
