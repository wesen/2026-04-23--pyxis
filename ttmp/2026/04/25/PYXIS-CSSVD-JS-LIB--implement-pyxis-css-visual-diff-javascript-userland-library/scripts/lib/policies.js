function classifyChangedPercent(percent) {
  var n = Number(percent)
  if (isNaN(n)) return 'unknown'
  if (n <= 1) return 'accepted'
  if (n <= 10) return 'review'
  if (n <= 25) return 'tune-required'
  return 'major-mismatch'
}

function acceptedDifferenceSummary(row) {
  var diffs = (row && row.acceptedDifferences) || []
  if (!diffs.length) return ''
  return diffs.map(function (diff) {
    if (typeof diff === 'string') return diff
    return diff.summary || diff.reason || diff.id || JSON.stringify(diff)
  }).join('; ')
}

function withClassification(row) {
  var copy = {}
  Object.keys(row || {}).forEach(function (key) { copy[key] = row[key] })
  copy.classification = copy.classification || classifyChangedPercent(copy.changedPercent)
  copy.acceptedDifferenceCount = (copy.acceptedDifferences || []).length
  copy.acceptedDifferenceSummary = acceptedDifferenceSummary(copy)
  return copy
}

function sortByChangedPercentDesc(rows) {
  return rows.slice().sort(function (a, b) {
    return Number(b.changedPercent || 0) - Number(a.changedPercent || 0)
  })
}

module.exports = {
  classifyChangedPercent: classifyChangedPercent,
  acceptedDifferenceSummary: acceptedDifferenceSummary,
  withClassification: withClassification,
  sortByChangedPercentDesc: sortByChangedPercentDesc,
}
