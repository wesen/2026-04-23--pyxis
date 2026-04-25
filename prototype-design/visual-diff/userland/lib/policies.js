var POLICY_ORDER = ['accepted', 'review', 'tune-required', 'major-mismatch', 'unknown']

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

function policyRank(name) {
  var idx = POLICY_ORDER.indexOf(String(name || 'unknown'))
  return idx === -1 ? POLICY_ORDER.indexOf('unknown') : idx
}

function worstClassification(rows) {
  var worst = 'accepted'
  rows.forEach(function (row) {
    var classification = row.classification || classifyChangedPercent(row.changedPercent)
    if (policyRank(classification) > policyRank(worst)) worst = classification
  })
  return rows.length ? worst : 'unknown'
}

function normalizeMaxChangedPercent(value) {
  if (value === undefined || value === null || value === '') return null
  var n = Number(value)
  if (isNaN(n) || n <= 0) return null
  return n
}

function passesPolicy(rows, options) {
  options = options || {}
  var maxChangedPercent = normalizeMaxChangedPercent(options.maxChangedPercent)
  var maxPolicyBand = options.maxPolicyBand || ''
  var failures = []
  rows.forEach(function (row) {
    var changed = Number(row.changedPercent || 0)
    var classification = row.classification || classifyChangedPercent(changed)
    if (maxChangedPercent !== null && changed > maxChangedPercent) {
      failures.push({
        page: row.page,
        section: row.section,
        type: 'maxChangedPercent',
        actual: changed,
        expected: maxChangedPercent,
      })
    }
    if (maxPolicyBand && policyRank(classification) > policyRank(maxPolicyBand)) {
      failures.push({
        page: row.page,
        section: row.section,
        type: 'maxPolicyBand',
        actual: classification,
        expected: maxPolicyBand,
      })
    }
  })
  return {
    ok: failures.length === 0,
    failures: failures,
    maxChangedPercent: rows.reduce(function (max, row) {
      var value = Number(row.changedPercent || 0)
      return value > max ? value : max
    }, 0),
    worstClassification: worstClassification(rows),
  }
}

function sortByChangedPercentDesc(rows) {
  return rows.slice().sort(function (a, b) {
    return Number(b.changedPercent || 0) - Number(a.changedPercent || 0)
  })
}

module.exports = {
  POLICY_ORDER: POLICY_ORDER,
  classifyChangedPercent: classifyChangedPercent,
  policyRank: policyRank,
  worstClassification: worstClassification,
  normalizeMaxChangedPercent: normalizeMaxChangedPercent,
  passesPolicy: passesPolicy,
  acceptedDifferenceSummary: acceptedDifferenceSummary,
  withClassification: withClassification,
  sortByChangedPercentDesc: sortByChangedPercentDesc,
}
