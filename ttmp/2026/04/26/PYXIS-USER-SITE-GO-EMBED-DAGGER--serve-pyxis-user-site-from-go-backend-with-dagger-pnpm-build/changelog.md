# Changelog

## 2026-04-26

- Initial workspace created


## 2026-04-26

Created Go-served public site Dagger build implementation guide, phased tasks, diary, and embedded-site smoke test script.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-USER-SITE-GO-EMBED-DAGGER--serve-pyxis-user-site-from-go-backend-with-dagger-pnpm-build/design-doc/01-go-served-user-site-bundle-and-dagger-build-implementation-guide.md — Primary Dagger/go:embed implementation guide
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-USER-SITE-GO-EMBED-DAGGER--serve-pyxis-user-site-from-go-backend-with-dagger-pnpm-build/scripts/smoke-embedded-site.sh — Runtime smoke-test helper
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-USER-SITE-GO-EMBED-DAGGER--serve-pyxis-user-site-from-go-backend-with-dagger-pnpm-build/tasks.md — Phased implementation checklist


## 2026-04-26

Implemented first Go-served public site embedding: Dagger/local build-web command, internal web embed package, SPA fallback wrapper, flyer static route, Makefile targets, and runtime smoke validation.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/Makefile — Adds build-web/generate-web/build-embed/serve-embed targets.
- /home/manuel/code/wesen/2026-04-23--pyxis/cmd/build-web/main.go — Dagger/local pnpm build command for public user-site bundle.
- /home/manuel/code/wesen/2026-04-23--pyxis/internal/web — Embed/disk SPA serving package for public user site.
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/server.go — Wires flyer static route and public SPA fallback into Go server.
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/spa_fallback.go — Buffers primary mux 404s and delegates browser routes to SPA handler.


## 2026-04-26

Fixed real Vite navbar styling by making PubNav import its own CSS and removing Storybook preview CSS masking.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/.storybook/preview.tsx — Removed global PubNav CSS import that masked missing component CSS ownership.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/PubNav/PubNav.tsx — Imports PubNav.css so real Vite app receives navbar styles.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/.storybook/preview.tsx — Removed global PubNav CSS import that masked missing component CSS ownership.

