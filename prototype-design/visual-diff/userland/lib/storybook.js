function trimTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '')
}

function storybookIframeUrl(baseUrl, storyId) {
  var base = trimTrailingSlash(baseUrl)
  return base + '/iframe.html?id=' + encodeURIComponent(storyId) + '&viewMode=story'
}

module.exports = { storybookIframeUrl }
