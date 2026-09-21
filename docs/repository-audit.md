# Repository audit

Audit date: 2026-08-19  
Site: `https://diegodella.ar/`

## Baseline architecture

### Framework and rendering

The site is hand-authored static HTML. It does not use Next.js, Astro, React, Vite, a static-site generator, or a CMS. Pages are complete HTML documents and remain readable without JavaScript.

`global.js` progressively adds shared shell behavior: navigation state, mobile navigation, visible breadcrumbs, reading maps, footer normalization, prefetching, the contact dialog, and WebMCP discovery. Structured data is now static in each HTML document rather than injected at runtime.

### Routing and canonical convention

Nginx serves root HTML files and resolves extensionless requests with:

```nginx
try_files $uri $uri/ $uri.html =404;
```

The established canonical convention is HTTPS, non-`www`, and flat `.html` URLs. That convention was retained to avoid changing indexed URLs. Semantic alternatives redirect to those canonicals:

- `/writing` → `/essays.html`
- `/work/posta` → `/work-posta.html`
- `/work/roxom` → `/work-roxom.html`

### Content architecture

The baseline repository contained 33 root HTML pages, including:

- a homepage;
- About;
- editorial hubs for Start, Frameworks, Essays, Notes, Concepts, and Reading Paths;
- six Narrative-First papers;
- essays and notes;
- a custom 404 page.

The writing system is file-based. There is no content database. Markdown mirrors exist for selected discovery routes, but HTML is the canonical public format.

The implementation adds six public pages without changing the underlying model:

- `work.html`
- `work-posta.html`
- `work-roxom.html`
- `ai-media.html`
- `speaking.html`
- `media-kit.html`

`essays.html` remains the canonical Writing index rather than creating a duplicate `/writing.html` page.

### Styling and components

The visual system is a fixed dark “Asphalt & Ivory” theme. `global.css` imports layered CSS from `styles/`, including tokens, legacy compatibility, home, editorial, components, shell, and theme-contract layers. Individual documents may include page-scoped CSS inside `@layer page`.

The established type system uses Inter and Space Grotesk. The existing palette, oversized typography, editorial spacing, orange accent, navigation pattern, and responsive behavior were retained.

There is no component framework. Reuse happens through shared CSS classes, common HTML patterns, `global.js`, and now `site-data.json` for identity/content data.

### Metadata and structured data at baseline

Most public pages already had descriptions, canonicals, Open Graph data, and some Twitter card data. Coverage was inconsistent across older hubs. Existing JSON-LD had three material issues:

1. JavaScript injected Organization, WebSite, WebPage, and breadcrumb nodes only after execution.
2. Article authors were disconnected Person objects without a stable `@id`.
3. Six editorial papers were labeled `ScholarlyArticle` even though the pages are essays/frameworks, not academic publications.

`nuggets.html` also carried FAQ schema that was not presented as a visible FAQ experience. That unsupported schema was removed.

### Sitemap and robots at baseline

The site already exposed `sitemap.xml`, `robots.txt`, and `llms.txt`.

The baseline sitemap used broad 2026 `lastmod` values that could not be maintained as factual per-page modification dates. The sitemap is now generated from canonical public HTML and omits `lastmod` until a trustworthy editorial source exists.

The baseline robots policy made public content crawlable, explicitly allowed numerous AI/training crawlers, blocked Bytespider, and excluded `/admin` and `/api/`. The revised file preserves those effective owner choices while separating crawler purposes and applying the private-path exclusions to specific crawler groups too.

### Analytics

The existing Google Analytics 4 property is `G-TJF4P0NYFT`. At audit time it appeared on 27 of the original 33 HTML pages. The six older hub pages without it were Archive, Concepts, Essays, Frameworks, Notes, and Series.

This project did not broaden analytics collection. New discovery pages therefore do not silently add tracking that was not already specified for them. Search Console, Bing Webmaster Tools, server logs, and any future sitewide analytics decision can be handled separately.

### Deployment

Production is an Nginx static site with a Flask contact service under `services/notify/`. `scripts/deploy_release.sh` validates a source tree, creates an immutable release under `.releases/releases/`, generates a checksum manifest, and atomically points `.releases/current` at the release.

The release script now checks generated discovery artifacts, includes XML files, and publishes all repository documentation under `docs/`.

### Existing machine interfaces

The repository already included:

- `.well-known/api-catalog`;
- WebMCP server metadata;
- agent navigation/contact skill documents;
- `openapi.json` and API documentation;
- Markdown content negotiation for the homepage.

Those interfaces were retained and updated to expose Work, Posta, Roxom TV, AI-Native Media, Writing, Speaking, Media Kit, and About.

## Baseline validation

Before implementation:

- `node scripts/validate-site.mjs` passed for 33 HTML pages;
- `python3 -m unittest services/notify/test_app.py` passed 5 tests;
- `node scripts/audit-theme.mjs` passed 33 pages across five representative viewports;
- desktop and mobile baseline screenshots were captured for visual comparison.

## Architecture decision

The smallest maintainable change was to keep the static/Nginx architecture, add flat case-study/topic pages, centralize factual identity data in `site-data.json`, generate discovery artifacts with a dependency-free Node script, and strengthen the existing validator. No CMS or frontend dependency was introduced.
