var slug = require('./slug.js')

function trimSlashes(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '')
}

function artifactDir(baseOut) {
  var parts = Array.prototype.slice.call(arguments, 1)
    .map(function (part) { return slug.slugify(part) })
    .filter(Boolean)
  var base = String(baseOut || '').replace(/\/+$/g, '')
  if (!base) return parts.join('/')
  return [base].concat(parts).join('/')
}

function pageSectionOutDir(baseOut, page, section, variant) {
  return artifactDir(baseOut, 'public-pages', variant || 'desktop', page, section)
}

module.exports = { artifactDir, pageSectionOutDir, trimSlashes }
