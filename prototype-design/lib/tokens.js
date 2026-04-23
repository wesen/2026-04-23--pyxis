// Pyxis design tokens — shared across component library + all screens.
window.PX = {
  // Color — warm neutrals with a single chromatic accent family
  color: {
    bg:        "#F3F1EB",   // canvas
    surface:   "#FFFFFF",   // cards
    surface2:  "#FAF8F2",   // input wells, subtle panels
    line:      "#EAE6DD",   // borders
    line2:     "#F0EDE4",   // inner dividers
    ink:       "#1A1A18",   // primary text
    ink2:      "#555048",   // secondary text
    ink3:      "#8A857B",   // tertiary / placeholders
    ink4:      "#B8B2A5",   // quaternary

    accent:    "#C8270D",
    accentLt:  "#FCEFEB",
    accentDk:  "#8E1B08",

    amber:     "#C97A0F",
    amberLt:   "#FBF1DC",

    green:     "#3C7A4F",
    greenLt:   "#EAF3EC",

    blue:      "#2E5D9E",
    blueLt:    "#E6EDF7",

    mute:      "#6B6459",
    muteLt:    "#EEEAE0",

    discord:   "#5865F2",
  },

  // Type scale
  font: {
    serif:    `"Fraunces", "Georgia", "Times New Roman", serif`,
    sans:     `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
    mono:     `"JetBrains Mono", "IBM Plex Mono", "SF Mono", ui-monospace, monospace`,
  },

  // Radii
  radius: { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, pill: 999 },

  // Shadows
  shadow: {
    sm:  "0 1px 2px rgba(26,24,22,.04)",
    md:  "0 2px 10px rgba(26,24,22,.06)",
    lg:  "0 8px 32px rgba(26,24,22,.10)",
    xl:  "0 20px 60px rgba(26,24,22,.18)",
  },

  // Spacing base
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40, 9: 56, 10: 72 },
};

// Inject web fonts + base reset once.
if (!document.getElementById("px-fonts")) {
  const link = document.createElement("link");
  link.id = "px-fonts";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.textContent = `
    .px-root, .px-root * { box-sizing: border-box; }
    .px-root { font-family: ${window.PX.font.sans}; color: ${window.PX.color.ink}; font-size: 13px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
    .px-serif { font-family: ${window.PX.font.serif}; font-optical-sizing: auto; }
    .px-mono { font-family: ${window.PX.font.mono}; }
    .px-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .px-scroll::-webkit-scrollbar-thumb { background: ${window.PX.color.line}; border-radius: 4px; }
    .px-scroll::-webkit-scrollbar-track { background: transparent; }
    button.px-btn { font-family: inherit; }
    input.px-input, select.px-input, textarea.px-input { font-family: inherit; color: inherit; }
  `;
  document.head.appendChild(style);
}
