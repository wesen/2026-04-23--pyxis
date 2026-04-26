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
    },
    {
      "page": "login",
      "variant": "desktop",
      "priority": "phase-8",
      "prototypePath": "/standalone/full-app/login.html",
      "storyId": "pyxis-app-pages--login-desktop",
      "sections": [
        {
          "name": "page",
          "original": "[data-page=\"login\"]",
          "react": "[data-page=\"login\"]"
        },
        {
          "name": "marquee",
          "original": ".px-root > div:first-child",
          "react": "[data-section=\"login-marquee\"]"
        },
        {
          "name": "panel",
          "original": ".px-root > div:last-child",
          "react": "[data-section=\"login-panel\"]"
        }
      ]
    },
    {
      "page": "setup",
      "variant": "desktop",
      "priority": "phase-8",
      "prototypePath": "/standalone/full-app/setup.html",
      "storyId": "pyxis-app-pages--setup-desktop",
      "sections": [
        {
          "name": "page",
          "original": "[data-page=\"setup\"]",
          "react": "[data-page=\"setup\"]"
        },
        {
          "name": "header",
          "original": ".px-root > div:nth-child(1), .px-root > div:nth-child(2), .px-root > div:nth-child(3)",
          "react": "[data-section=\"setup-header\"]"
        },
        {
          "name": "progress",
          "original": ".px-root > div:nth-child(4)",
          "react": "[data-section=\"setup-progress\"]"
        },
        {
          "name": "channels",
          "original": ".px-root > div:nth-child(5)",
          "react": "[data-section=\"setup-channels\"]"
        }
      ]
    },
    {
      "page": "shows",
      "variant": "desktop",
      "priority": "phase-8",
      "prototypePath": "/standalone/full-app/shows.html",
      "storyId": "pyxis-app-pages--shows-desktop",
      "sections": [
        {
          "name": "page",
          "original": "[data-page=\"shows\"]",
          "react": "[data-page=\"shows\"]"
        },
        {
          "name": "filters",
          "original": "[data-page=\"shows\"] main > div:first-child",
          "react": "[data-section=\"shows-filters\"]"
        },
        {
          "name": "confirmed",
          "original": "[data-page=\"shows\"] main > div:nth-child(2)",
          "react": "[data-section=\"shows-confirmed\"]"
        },
        {
          "name": "archived",
          "original": "[data-page=\"shows\"] main > div:nth-child(3)",
          "react": "[data-section=\"shows-archived\"]"
        }
      ]
    },
    {
      "page": "calendar",
      "variant": "desktop",
      "priority": "phase-8",
      "prototypePath": "/standalone/full-app/calendar.html",
      "storyId": "pyxis-app-pages--calendar-desktop",
      "sections": [
        {
          "name": "page",
          "original": "[data-page=\"calendar\"]",
          "react": "[data-page=\"calendar\"]"
        },
        {
          "name": "month",
          "original": "[data-page=\"calendar\"] main > div:first-child",
          "react": "[data-section=\"calendar-month\"]"
        },
        {
          "name": "agenda",
          "original": "[data-page=\"calendar\"] main > div:nth-child(2)",
          "react": "[data-section=\"calendar-agenda\"]"
        }
      ]
    },
    {
      "page": "bookings",
      "variant": "desktop",
      "priority": "phase-8",
      "prototypePath": "/standalone/full-app/bookings.html",
      "storyId": "pyxis-app-pages--bookings-desktop",
      "sections": [
        {
          "name": "page",
          "original": "[data-page=\"bookings\"]",
          "react": "[data-page=\"bookings\"]"
        },
        {
          "name": "queue",
          "original": "[data-page=\"bookings\"] main > div:first-child",
          "react": "[data-section=\"bookings-queue\"]"
        },
        {
          "name": "processed",
          "original": "[data-page=\"bookings\"] main > div:nth-child(2)",
          "react": "[data-section=\"bookings-processed\"]"
        }
      ]
    }
  ]
}
