function numberOrNull(value) {
  var n = Number(value)
  return isNaN(n) ? null : n
}

function compareNumeric(name, left, right, tolerance) {
  var a = numberOrNull(left)
  var b = numberOrNull(right)
  var delta = a === null || b === null ? null : b - a
  var absDelta = delta === null ? null : Math.abs(delta)
  var withinTolerance = absDelta === null ? false : absDelta <= Number(tolerance || 0)
  return {
    name: name,
    left: a,
    right: b,
    delta: delta,
    absDelta: absDelta,
    tolerance: Number(tolerance || 0),
    withinTolerance: withinTolerance,
    changed: !withinTolerance,
  }
}

function compareBounds(left, right, tolerances) {
  tolerances = tolerances || {}
  left = left || {}
  right = right || {}
  var fields = ['x', 'y', 'width', 'height']
  var diffs = fields.map(function (field) {
    return compareNumeric(field, left[field], right[field], tolerances[field] == null ? 0 : tolerances[field])
  })
  return {
    changed: diffs.some(function (diff) { return diff.changed }),
    diffs: diffs,
    byField: diffs.reduce(function (acc, diff) {
      acc[diff.name] = diff
      return acc
    }, {}),
  }
}

function compareStyleMaps(left, right) {
  left = left || {}
  right = right || {}
  var keys = {}
  Object.keys(left).forEach(function (key) { keys[key] = true })
  Object.keys(right).forEach(function (key) { keys[key] = true })
  var diffs = []
  Object.keys(keys).sort().forEach(function (key) {
    var a = left[key]
    var b = right[key]
    if (String(a) !== String(b)) {
      diffs.push({ prop: key, left: a, right: b })
    }
  })
  return {
    changed: diffs.length > 0,
    count: diffs.length,
    diffs: diffs,
  }
}

module.exports = {
  compareNumeric: compareNumeric,
  compareBounds: compareBounds,
  compareStyleMaps: compareStyleMaps,
}
