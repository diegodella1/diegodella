# Speaking, consulting, and bios — 18 September 2026

Published release: `workspace-20260918T145122Z-5533`.
Previous release: `brag-20260917T002801Z`.

## Public URLs

- https://diegodella.ar/consulting.html — advisory offer, five engagement types, outcomes, and fees by inquiry.
- https://diegodella.ar/speaking.html#organizers — embedded speaker kit, formats, audiences, proof, and booking.
- https://diegodella.ar/speaking.html#past-talks — UT Austin / ICFJ 2021 and 2022, UCES 2023, Interact 2024.
- https://diegodella.ar/media-kit.html — approved canonical English bios.
- https://diegodella.ar/about.html — synchronized biography and consulting link.

No standalone one-pager or partial Spanish locale was added. Consulting and speaking have distinct contact paths. No rates or additional event titles were invented.

## Files changed in this pass

- `src/pages/consulting.astro` — new advisory page.
- `src/pages/speaking.astro` — organizer summary, four talks, three marketing/teaching topics, fees, booking.
- `src/pages/about.astro` — Advise links to Consulting.
- `src/pages/index.astro` — Consulting, Speaking, and Media Kit routes.
- `src/pages/work.astro` — consulting engagement link.
- `src/pages/contact.astro` — separate consulting and speaking links.
- `src/pages/media-kit.astro` — organizer kit and consulting links.
- `src/components/Navigation.astro` — Consulting route and active state.
- `src/components/Footer.astro` — Consulting link.
- `src/content/markdown/index.md` — Consulting route.
- `src/content/markdown/about.md` — Consulting link.
- `src/data/site.json` — route registration and modification dates; includes previously approved bios.
- `src/data/presentation.json` — Consulting title, description, canonical, social metadata, and WebPage schema.
- `src/lib/discovery.mjs` — sitemap and llms.txt discovery.
- `public/global.js` — route context, mobile Speaking link, agent navigation route.
- `public/.well-known/agent-skills/navigation/SKILL.md` — Consulting discovery.
- `scripts/validate-site.mjs` — required Consulting route and navigation.
- `scripts/smoke-discovery.mjs` — Consulting HTTP route coverage.
- `scripts/audit-theme.mjs` — exclude intentional mobile-menu overlay from cross-layer control collision checks; retain checks between menu items.
- `tests/analytics.test.mjs` — compare rendered routes against the site registry instead of a fixed page count.
- `tests/fixtures/editorial-main-deltas.json` — record approved biography and page copy changes.

## Verification

- Astro check: no errors, warnings, or hints.
- Production build and discovery synchronization passed.
- Site validation: 43 HTML pages.
- JavaScript tests: 13 passed.
- Contact service tests: 14 passed with email delivery mocked.
- Responsive inspection covered 320px, 1024px, and 1440px; final Speaking audit passed all three widths.
- Public HTTPS returned 200 for Consulting, Speaking, Media Kit, and sitemap.
- Parsed public responses verified canonical URLs, all three approved bios, the four talks, inquiry-only fees, and Consulting in the sitemap.

## Rollback

```bash
bash scripts/deploy_release.sh --rollback brag-20260917T002801Z
```

Activation verifies release checksums and switches the production symlink atomically.
