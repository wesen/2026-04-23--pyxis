var presets = {
  typography: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-transform', 'color', 'opacity', 'visibility', 'white-space', 'overflow', 'text-overflow'],
  layout: ['display', 'position', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'align-items', 'justify-content', 'flex-direction', 'grid-template-columns', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'gap'],
  surface: ['background-color', 'border-color', 'border-width', 'border-style', 'border-radius', 'box-shadow'],
  spacing: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  pageShell: ['box-sizing', 'width', 'height', 'min-height', 'margin', 'padding', 'display', 'background-color', 'color', 'font-family', 'font-size', 'line-height'],
}

function propsForPreset(name) {
  return presets[name] || presets.pageShell
}

module.exports = { presets: presets, propsForPreset: propsForPreset }
