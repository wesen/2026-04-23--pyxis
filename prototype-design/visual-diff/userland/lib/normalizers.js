function normalizeZeroUnits(value) {
  value = String(value == null ? '' : value).trim()
  return value.replace(/(^|\s|\()0(?:px|em|rem|%|vh|vw|s|ms)(?=$|\s|\)|,)/g, '$10')
}

function componentToHex(n) {
  var v = Math.max(0, Math.min(255, Number(n) || 0))
  var hex = v.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

function normalizeRgbColors(value) {
  value = String(value == null ? '' : value)
  return value.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([0-9.]+))?\s*\)/gi, function (_, r, g, b, a) {
    if (a !== undefined && Number(a) !== 1) return 'rgba(' + [Number(r), Number(g), Number(b), Number(a)].join(', ') + ')'
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
  })
}

function normalizeHexColors(value) {
  return String(value == null ? '' : value).replace(/#([0-9a-f])([0-9a-f])([0-9a-f])\b/gi, function (_, r, g, b) {
    return '#' + r + r + g + g + b + b
  }).toLowerCase()
}

function normalizeFontFamily(value) {
  value = String(value == null ? '' : value).trim()
  if (!value) return value
  var first = value.split(',')[0] || value
  return first.trim().replace(/^['"]|['"]$/g, '').toLowerCase()
}

function normalizeStyleValue(prop, value, options) {
  options = options || {}
  var out = String(value == null ? '' : value).trim()
  if (options.zeroUnits !== false) out = normalizeZeroUnits(out)
  if (options.colors !== false) out = normalizeHexColors(normalizeRgbColors(out))
  if (options.fontFamilyPrimary !== false && prop === 'font-family') out = normalizeFontFamily(out)
  return out
}

function normalizeStyleMap(styles, options) {
  var out = {}
  styles = styles || {}
  Object.keys(styles).sort().forEach(function (key) {
    out[key] = normalizeStyleValue(key, styles[key], options)
  })
  return out
}

module.exports = {
  normalizeZeroUnits: normalizeZeroUnits,
  normalizeRgbColors: normalizeRgbColors,
  normalizeHexColors: normalizeHexColors,
  normalizeFontFamily: normalizeFontFamily,
  normalizeStyleValue: normalizeStyleValue,
  normalizeStyleMap: normalizeStyleMap,
}
