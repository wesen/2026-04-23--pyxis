// Generated mirror of app.pages.mobile.visual.yml for registry-backed ergonomic verbs.
// Keep the YAML spec as the reviewed source of truth; run scripts/refresh-spec-mirrors.py after spec edits.

module.exports = {
  "schemaVersion": "pyxis.visual-suite.v1",
  "name": "app-pages-mobile",
  "defaults": {
    "prototypeBase": "http://localhost:7070",
    "storybookBase": "http://localhost:6008",
    "viewport": {
      "width": 390,
      "height": 844
    },
    "waitMs": 1000,
    "threshold": 30,
    "inspect": "rich",
    "variant": "mobile"
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
      "variant": "mobile",
      "priority": "tune-first",
      "prototypePath": "/standalone/mobile/home.html",
      "storyId": "pyxis-app-pages--dashboard-mobile",
      "sections": [
        {
          "name": "page",
          "original": "[data-page=\"dashboard\"]",
          "react": "[data-page=\"dashboard\"]"
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
          "name": "attention",
          "original": "[data-section=\"dashboard-attention\"]",
          "react": "[data-section=\"dashboard-attention\"]"
        },
        {
          "name": "activity",
          "original": "[data-section=\"dashboard-activity\"]",
          "react": "[data-section=\"dashboard-activity\"]"
        }
      ]
    },
    {
      "page": "login",
      "variant": "mobile",
      "priority": "phase-8",
      "prototypePath": "/standalone/mobile/login.html",
      "storyId": "pyxis-app-pages--login-mobile",
      "sections": [
        {
          "name": "page",
          "original": "[data-page=\"login\"]",
          "react": "[data-page=\"login\"]"
        }
      ]
    },
    {
      "page": "shows",
      "variant": "mobile",
      "priority": "phase-8",
      "prototypePath": "/standalone/mobile/shows.html",
      "storyId": "pyxis-app-pages--shows-mobile",
      "sections": [
        {
          "name": "page",
          "original": "[data-page=\"shows\"]",
          "react": "[data-page=\"shows\"]"
        }
      ]
    }
  ]
}
