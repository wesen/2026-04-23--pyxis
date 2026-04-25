function slugify(value) {
  return String(value == null ? '' : value)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled'
}

function joinSlug() {
  return Array.prototype.slice.call(arguments).map(slugify).filter(Boolean).join('-')
}

module.exports = { slugify, joinSlug }
