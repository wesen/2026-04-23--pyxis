__package__({
  name: "workflow",
  parents: ["pyxis"],
  short: "Pyxis css-visual-diff workflow exploration scripts",
})

function summarizeTargets() {
  return [
    {
      page: "shows",
      prototypeUrl: "http://localhost:7070/standalone/public/shows.html",
      storybookUrl: "http://localhost:6007/iframe.html?id=public-site-pages--shows-desktop&viewMode=story",
      config: "prototype-design/visual-diff/comparisons/public-pages/shows-desktop.css-visual-diff.yml",
      priority: "tune-first",
    },
    {
      page: "show-detail",
      prototypeUrl: "http://localhost:7070/standalone/public/detail.html",
      storybookUrl: "http://localhost:6007/iframe.html?id=public-site-pages--show-detail-desktop&viewMode=story",
      config: "prototype-design/visual-diff/comparisons/public-pages/show-detail-desktop.css-visual-diff.yml",
      priority: "second-pass",
    },
    {
      page: "archive",
      prototypeUrl: "http://localhost:7070/standalone/public/archive.html",
      storybookUrl: "http://localhost:6007/iframe.html?id=public-site-pages--archive-desktop&viewMode=story",
      config: "prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml",
      priority: "closest-to-acceptance",
    },
    {
      page: "book",
      prototypeUrl: "http://localhost:7070/standalone/public/book.html",
      storybookUrl: "http://localhost:6007/iframe.html?id=public-site-pages--book-desktop&viewMode=story",
      config: "prototype-design/visual-diff/comparisons/public-pages/book-desktop.css-visual-diff.yml",
      priority: "second-pass",
    },
    {
      page: "about",
      prototypeUrl: "http://localhost:7070/standalone/public/about.html",
      storybookUrl: "http://localhost:6007/iframe.html?id=public-site-pages--about-desktop&viewMode=story",
      config: "prototype-design/visual-diff/comparisons/public-pages/about-desktop.css-visual-diff.yml",
      priority: "second-pass",
    },
  ]
}

__verb__("summarizeTargets", {
  parents: ["pyxis", "workflow"],
  short: "List current Pyxis public page visual-diff targets",
  output: "structured",
  fields: {},
})
