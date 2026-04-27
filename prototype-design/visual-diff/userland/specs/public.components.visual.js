// Generated mirror of public.components.visual.yml for registry-backed ergonomic verbs.
// Keep the YAML spec as the reviewed source of truth; run scripts/refresh-spec-mirrors.py after spec edits.

module.exports = {
  "schemaVersion": "pyxis.visual-suite.v1",
  "name": "public-components",
  "defaults": {
    "prototypeBase": "http://localhost:7070",
    "storybookBase": "http://localhost:6006",
    "viewport": {
      "width": 920,
      "height": 1460
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
      "page": "public-page-header-shows",
      "variant": "component",
      "priority": "shows-tune",
      "prototypePath": "/standalone/public/shows.html",
      "storyId": "public-site-components-molecules-publicpageheader--default",
      "sections": [
        {
          "name": "component",
          "original": "[data-section='shows-header']",
          "react": "[data-pyxis-component='public-page-header'][data-pyxis-part='root']"
        }
      ]
    },
    {
      "page": "mailing-list-cta",
      "variant": "component",
      "priority": "shows-tune",
      "prototypePath": "/standalone/public/shows.html",
      "storyId": "public-site-components-organisms-mailinglistcta--default",
      "sections": [
        {
          "name": "component",
          "original": "[data-section='mailing-list'] [data-pyxis-component='mailing-list-cta'][data-pyxis-part='root']",
          "react": "[data-pyxis-component='mailing-list-cta'][data-pyxis-part='root']"
        }
      ]
    },
    {
      "page": "poster-redroom",
      "variant": "component",
      "priority": "shows-tune",
      "prototypePath": "/standalone/public/shows.html",
      "storyId": "public-site-components-molecules-poster--default",
      "sections": [
        {
          "name": "component",
          "original": "[data-section='shows-list'] > div > div:nth-child(1) > div:first-child",
          "react": "[data-pyxis-component='poster'][data-pyxis-part='root']"
        }
      ]
    },
    {
      "page": "show-tile-redroom",
      "variant": "component",
      "priority": "shows-tune",
      "prototypePath": "/standalone/public/shows.html",
      "storyId": "public-site-components-molecules-showtile--default",
      "sections": [
        {
          "name": "component",
          "original": "[data-section='shows-list'] > div > div:nth-child(1)",
          "react": "[data-pyxis-component='show-tile'][data-pyxis-part='root']"
        },
        {
          "name": "info",
          "original": "[data-section='shows-list'] > div > div:nth-child(1) > div:nth-child(2)",
          "react": "[data-pyxis-component='show-tile'][data-pyxis-part='info']"
        }
      ]
    },
    {
      "page": "show-tile-learn",
      "variant": "component",
      "priority": "shows-tune",
      "prototypePath": "/standalone/public/shows.html",
      "storyId": "public-site-components-molecules-showtile--learn",
      "sections": [
        {
          "name": "component",
          "original": "[data-section='shows-list'] > div > div:nth-child(4)",
          "react": "[data-pyxis-component='show-tile'][data-pyxis-part='root']"
        },
        {
          "name": "info",
          "original": "[data-section='shows-list'] > div > div:nth-child(4) > div:nth-child(2)",
          "react": "[data-pyxis-component='show-tile'][data-pyxis-part='info']"
        }
      ]
    },
    {
      "page": "show-tile-soldout",
      "variant": "component",
      "priority": "shows-tune",
      "prototypePath": "/standalone/public/shows.html",
      "storyId": "public-site-components-molecules-showtile--sold-out",
      "sections": [
        {
          "name": "component",
          "original": "[data-section='shows-list'] > div > div:nth-child(7)",
          "react": "[data-pyxis-component='show-tile'][data-pyxis-part='root']"
        },
        {
          "name": "info",
          "original": "[data-section='shows-list'] > div > div:nth-child(7) > div:nth-child(2)",
          "react": "[data-pyxis-component='show-tile'][data-pyxis-part='info']"
        }
      ]
    },
    {
      "page": "show-grid-prototype-desktop",
      "variant": "component",
      "priority": "shows-tune",
      "prototypePath": "/standalone/public/shows.html",
      "storyId": "public-site-components-organisms-showgrid--prototype-desktop",
      "sections": [
        {
          "name": "component",
          "original": "[data-section='shows-list'] > div",
          "react": "[data-pyxis-component='show-grid'][data-pyxis-part='root']"
        }
      ]
    }
  ]
}
