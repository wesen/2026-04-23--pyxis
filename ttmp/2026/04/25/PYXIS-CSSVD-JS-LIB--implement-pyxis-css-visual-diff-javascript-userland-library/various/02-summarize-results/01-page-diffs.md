---
Title: Pyxis public page visual diff summary
Ticket: PYXIS-CSSVD-JS-LIB
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - automation
  - pyxis
DocType: reference
Intent: short-term
Summary: Generated summary from Pyxis css-visual-diff userland result parser.
---

# Pyxis Public Page Visual Diff Summary

- Results dir: `prototype-design/visual-comparisons/public-pages`
- Row count: 13

| Page | Variant | Section | Changed % | Changed/Total | Classification | Source |
| --- | --- | --- | ---: | ---: | --- | --- |
| shows | desktop | shows-list | 66.8566% | 1107145/1656000 | major-mismatch | yaml-run |
| shows | desktop | mailing-list | 51.2191% | 848189/1656000 | major-mismatch | yaml-run |
| shows | desktop | header | 51.0775% | 845843/1656000 | major-mismatch | yaml-run |
| shows | desktop | page | 50.5245% | 836685/1656000 | major-mismatch | yaml-run |
| shows | desktop | content | 49.0940% | 812996/1656000 | major-mismatch | yaml-run |
| show-detail | desktop | content | 24.4647% | 247583/1012000 | tune-required | yaml-run |
| about | desktop | content | 20.4334% | 313938/1536400 | tune-required | yaml-run |
| show-detail | desktop | page | 18.5282% | 248871/1343200 | tune-required | yaml-run |
| about | desktop | page | 18.2795% | 322889/1766400 | tune-required | yaml-run |
| book | desktop | content | 14.5896% | 150465/1031320 | tune-required | yaml-run |
| book | desktop | page | 12.1006% | 162535/1343200 | tune-required | yaml-run |
| archive | desktop | content | 7.1281% | 102172/1433360 | review | yaml-run |
| archive | desktop | page | 6.6511% | 103350/1553880 | review | yaml-run |

## Notes

Rows are parsed from existing `pixeldiff.md` artifacts and classified by the userland policy bands: accepted <= 1%, review <= 10%, tune-required <= 25%, major-mismatch > 25%.
