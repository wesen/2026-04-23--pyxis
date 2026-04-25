function classifyChangedPercent(percent) {
  var n = Number(percent)
  if (isNaN(n)) return 'unknown'
  if (n <= 1) return 'accepted'
  if (n <= 10) return 'review'
  if (n <= 25) return 'tune-required'
  return 'major-mismatch'
}

function sortByChangedPercentDesc(rows) {
  return rows.slice().sort(function (a, b) {
    return Number(b.changedPercent || 0) - Number(a.changedPercent || 0)
  })
}

module.exports = { classifyChangedPercent, sortByChangedPercentDesc }
