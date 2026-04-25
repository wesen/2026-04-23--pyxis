var presets = {
  typography: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color'],
  layout: ['display', 'width', 'height', 'min-height', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'gap'],
  surface: ['background-color', 'border-color', 'border-width', 'border-radius', 'box-shadow'],
  spacing: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  pageShell: ['box-sizing', 'width', 'height', 'min-height', 'margin', 'padding', 'display', 'background-color', 'color', 'font-family', 'font-size', 'line-height'],
}

function propsForPreset(name) {
  return presets[name] || presets.pageShell
}

module.exports = { presets: presets, propsForPreset: propsForPreset }
