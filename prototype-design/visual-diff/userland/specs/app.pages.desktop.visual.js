// Generated mirror of app.pages.desktop.visual.yml for registry-backed ergonomic verbs.
// Keep the YAML spec as the reviewed source of truth; run scripts/refresh-spec-mirrors.py after spec edits.

module.exports = {
  "schemaVersion": "pyxis.visual-suite.v1",
  "name": "app-pages-desktop",
  "defaults": {
    "prototypeBase": "http://localhost:7070",
    "storybookBase": "http://localhost:6008",
    "viewport": {
      "width": 1240,
      "height": 900
    },
    "waitMs": 1000,
    "threshold": 30,
    "inspect": "rich",
    "variant": "desktop"
  },
  "policy": {
    "bands": [
      {
        "name": "accepted",
        "maxChangedPercent": 0.5
      },
      {
        "name": "review",
        "maxChangedPercent": 10
      },
      {
        "name": "tune-required",
        "maxChangedPercent": 30
      },
      {
        "name": "major-mismatch",
        "maxChangedPercent": 100
      }
    ]
  },
  "acceptedDifferences": {},
  "targets": [
    {
      "page": "dashboard",
      "variant": "desktop",
      "priority": "tune-first",
      "prototypePath": "/standalone/full-app/dashboard.html",
      "storyId": "pyxis-app-pages--dashboard-desktop",
      "sections": [
        {
          "name": "page",
          "original": "[data-page=\"dashboard\"]",
          "react": "[data-page=\"dashboard\"]"
        },
        {
          "name": "sidebar",
          "original": "aside",
          "react": "[data-section=\"app-sidebar\"]"
        },
        {
          "name": "topbar",
          "original": "main > div:first-child",
          "react": "[data-section=\"app-topbar\"]"
        },
        {
          "name": "summary",
          "original": "[data-page=\"dashboard\"]",
          "react": "[data-section=\"dashboard-summary\"]"
        },
        {
          "name": "hero",
          "original": "[data-section=\"dashboard-hero\"]",
          "react": "[data-section=\"dashboard-hero\"]"
        },
        {
          "name": "metrics",
          "original": "[data-section=\"dashboard-metrics\"]",
          "react": "[data-section=\"dashboard-metrics\"]"
        },
        {
          "name": "upcoming",
          "original": "[data-section=\"dashboard-upcoming\"]",
          "react": "[data-section=\"dashboard-upcoming\"]"
        },
        {
          "name": "quick-actions",
          "original": "[data-section=\"dashboard-quick-actions\"]",
          "react": "[data-section=\"dashboard-quick-actions\"]"
        },
        {
          "name": "activity",
          "original": "[data-section=\"dashboard-activity\"]",
          "react": "[data-section=\"dashboard-activity\"]"
        },
        {
          "name": "attention",
          "original": "[data-section=\"dashboard-attention\"]",
          "react": "[data-section=\"dashboard-attention\"]"
        }
      ]
    }
  ]
}
