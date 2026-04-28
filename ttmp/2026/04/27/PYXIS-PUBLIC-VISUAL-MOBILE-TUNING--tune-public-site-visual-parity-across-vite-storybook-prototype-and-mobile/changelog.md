# Changelog

## 2026-04-27

- Initial workspace created


## 2026-04-27

Created the public visual/mobile tuning ticket, added a chronological diary, and recorded the recovered css-visual-diff workflow from recent visual-tuning diaries and playbooks.

## 2026-04-27

Added focused render-target comparison script, diagnosed Vite-vs-Storybook token drift, imported component tokens into the public Vite app, and tuned the mobile mailing-list/email form subparts to match Storybook/prototype.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/27/PYXIS-PUBLIC-VISUAL-MOBILE-TUNING--tune-public-site-visual-parity-across-vite-storybook-prototype-and-mobile/scripts/01-compare-public-render-targets.sh — focused comparison wrapper
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/main.tsx — component token CSS import for Vite parity with Storybook
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/PublicPage.css — mobile page padding alignment
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/MailingListCTA/MailingListCTA.css — mobile title size/line-height alignment

## 2026-04-27

Fixed the Shows mobile Storybook baseline: mobile ShowGrid now renders one column, the Shows mobile story uses the six-show prototype fixture, PublicPageHeader has mobile sizing, and Shows mobile spacing is closer to the standalone mobile prototype.

## 2026-04-27

Implemented a functional accessible public-site mobile hamburger menu in `PubNav`, keeping the closed state aligned to the prototype and adding a conservative tokenized drop-down for the undefined open state.

## 2026-04-27

Fixed the ticket-local visual comparison wrapper so non-Shows pages use their own `data-page`, route, prototype file, and Storybook target instead of the hardcoded Shows selector.
