// Generated mirror of app.components.visual.yml for registry-backed ergonomic verbs.
// Keep the YAML spec as the reviewed source of truth; run scripts/refresh-spec-mirrors.py after spec edits.

module.exports = {
  "schemaVersion": "pyxis.visual-suite.v1",
  "name": "app-components",
  "defaults": {
    "prototypeBase": "http://localhost:7070",
    "storybookBase": "http://localhost:6008",
    "viewport": {
      "width": 520,
      "height": 420
    },
    "waitMs": 1000,
    "threshold": 30,
    "inspect": "rich",
    "variant": "component"
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
      "page": "metric-card",
      "variant": "component",
      "priority": "tune-first",
      "prototypePath": "/standalone/full-app/dashboard.html",
      "storyId": "pyxis-app-components-molecules-metriccard--metric-card-default",
      "sections": [
        {
          "name": "component",
          "original": "[data-pyxis-component=\"metric-card\"][data-metric-card=\"upcoming\"]",
          "react": "[data-pyxis-component=\"metric-card\"]"
        }
      ]
    },
    {
      "page": "activity-feed-item",
      "variant": "component",
      "priority": "tune-first",
      "prototypePath": "/standalone/full-app/dashboard.html",
      "storyId": "pyxis-app-components-molecules-activityfeeditem--activity-item-default",
      "sections": [
        {
          "name": "component",
          "original": "#root",
          "react": "[data-pyxis-component=\"activity-feed-item\"]"
        }
      ]
    },
    {
      "page": "today-show-card",
      "variant": "component",
      "priority": "normal",
      "prototypePath": "/standalone/full-app/dashboard.html",
      "storyId": "pyxis-app-components-molecules-todayshowcard--today-show-default",
      "sections": [
        {
          "name": "component",
          "original": "#root",
          "react": "[data-pyxis-component=\"today-show-card\"]"
        }
      ]
    },
    {
      "page": "shows-confirmed-panel",
      "variant": "component",
      "priority": "tune-first",
      "prototypePath": "/standalone/full-app/shows.html",
      "storyId": "pyxis-app-components-organisms-showsconfirmedpanel--confirmed-panel",
      "viewport": {
        "width": 1080,
        "height": 720
      },
      "sections": [
        {
          "name": "component",
          "original": "[data-section=\"shows-confirmed\"]",
          "react": "[data-section=\"shows-confirmed\"]"
        }
      ]
    },
    {
      "page": "shows-archived-panel",
      "variant": "component",
      "priority": "tune-first",
      "prototypePath": "/standalone/full-app/shows.html",
      "storyId": "pyxis-app-components-organisms-showsarchivedpanel--archived-panel",
      "viewport": {
        "width": 1080,
        "height": 1100
      },
      "sections": [
        {
          "name": "component",
          "original": "[data-section=\"shows-archived\"]",
          "react": "[data-section=\"shows-archived\"]"
        }
      ]
    },
    {
      "page": "bookings-queue-panel",
      "variant": "component",
      "priority": "tune-first",
      "prototypePath": "/standalone/full-app/bookings.html",
      "storyId": "pyxis-app-components-organisms-bookingsinboxpanel--inbox-panel",
      "viewport": {
        "width": 900,
        "height": 620
      },
      "sections": [
        {
          "name": "component",
          "original": "[data-section=\"bookings-queue\"]",
          "react": "[data-section=\"bookings-queue\"]"
        }
      ]
    },
    {
      "page": "bookings-processed-panel",
      "variant": "component",
      "priority": "tune-first",
      "prototypePath": "/standalone/full-app/bookings.html",
      "storyId": "pyxis-app-components-organisms-bookingsprocessedpanel--processed-panel",
      "viewport": {
        "width": 900,
        "height": 420
      },
      "sections": [
        {
          "name": "component",
          "original": "[data-section=\"bookings-processed\"]",
          "react": "[data-section=\"bookings-processed\"]"
        }
      ]
    },
    {
      "page": "calendar-month-panel",
      "variant": "component",
      "priority": "tune-first",
      "prototypePath": "/standalone/full-app/calendar.html",
      "storyId": "pyxis-app-components-organisms-calendarmonthpanel--month-panel",
      "viewport": {
        "width": 980,
        "height": 720
      },
      "sections": [
        {
          "name": "component",
          "original": "[data-section=\"calendar-month\"]",
          "react": "[data-section=\"calendar-month\"]"
        }
      ]
    },
    {
      "page": "calendar-agenda-panel",
      "variant": "component",
      "priority": "tune-first",
      "prototypePath": "/standalone/full-app/calendar.html",
      "storyId": "pyxis-app-components-organisms-calendaragenda--agenda",
      "viewport": {
        "width": 420,
        "height": 520
      },
      "sections": [
        {
          "name": "component",
          "original": "[data-section=\"calendar-agenda\"]",
          "react": "[data-section=\"calendar-agenda\"]"
        }
      ]
    },
    {
      "page": "new-show-modal",
      "variant": "component",
      "priority": "phase-8c-reuse",
      "prototypePath": "/standalone/full-app/modal.html",
      "storyId": "pyxis-app-components-organisms-newshowmodal--default",
      "viewport": {
        "width": 1240,
        "height": 760
      },
      "sections": [
        {
          "name": "component",
          "original": "#root > div > div > div:nth-of-type(2) > div",
          "react": "[data-pyxis-component=\"new-show-modal\"][data-pyxis-part=\"root\"]"
        }
      ]
    }
  ]
}
