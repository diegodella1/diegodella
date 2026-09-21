# Discoverability architecture

This document is the maintenance contract for technical discoverability, entity identity, and editorial preparation on `diegodella.ar`. The site remains a personal website. Clarity, evidence, and useful writing take priority over search inventory.

## Positioning

The professional identity is:

**Media + Product + Marketing + Content + Communities + AI**

The intended narrative is chronological and causal: Diego Dell'Agostino has worked across digital media, digital products, marketing, content strategy, audience development, and communities. That experience is the foundation for his current AI work.

Do not reduce the identity to “AI expert,” “AI guru,” “prompt engineer,” or generic consultant. Claims should point to a case study, a public product, a published argument, or a durable external source.

## Current specialization

The current frontier is:

**AI-native media + agentic workflows + editorial operations + AI-mediated discovery**

Supporting terms include AI agents, media automation, media products, distribution, and editorial technology. AI is a new layer in the system, not a replacement for the earlier trajectory.

## Entity

The canonical Person identifier is:

```text
https://diegodella.ar/#person
```

The canonical author/profile URL is:

```text
https://diegodella.ar/about.html
```

Only About contains the complete Person definition. Other pages reference the same `@id`. Do not create another author URL or a second Diego entity.

`src/data/site.json` owns profile, bios, positioning, projects, work evidence and hub dates. Article records and content live in `src/content/writing/*.mdx`. Astro generates the public `site-data.json` contract and HTML from those sources.

No Person `image` is published because the repository does not contain an approved portrait. `og-default.png` is a site card, not a headshot, and must not be mislabeled as one.

## Audit snapshot

Audit date: 2026-08-26.

- Stack: hand-authored static HTML, shared CSS, and dependency-free Node maintenance scripts.
- Rendering: complete pre-rendered HTML. JavaScript progressively adds navigation behavior, breadcrumbs, filters, contact UI, and machine interfaces; primary content and JSON-LD do not depend on client rendering.
- Routing: Nginx serves flat `.html` canonical URLs and supports selected redirects and extensionless aliases.
- Public inventory: 42 HTML files; 41 indexable canonical pages and one `noindex` 404.
- Metadata: unique titles and descriptions, self-referencing canonicals, Open Graph, Twitter cards, author metadata, and RSS autodiscovery are validated across indexable pages.
- Semantics: one H1 per page, no heading-level skips, a main landmark, skip links, and crawlable HTML links.
- Links: local files and hash targets are validated; every indexable HTML page has at least one inbound internal link.
- Performance: content is static and readable without JavaScript; there are no content images or videos in page markup. Google Fonts and analytics remain existing external requests. Large root video files are not referenced by public HTML and were not changed.
- 404: missing routes return HTTP 404 and the HTML response carries `noindex`.
- Known duplicate surface: extensionless routes can return the same document as their `.html` canonical. Canonical tags and sitemap URLs consistently select `.html`; changing the established URL convention was avoided.

## Structured data

Schema is embedded in source HTML and does not require JavaScript.

- Home: `WebSite` + `WebPage`, connected to Person `#person`.
- About: `ProfilePage` whose `mainEntity` is Person `#person`, plus the one complete Person definition.
- Articles: `Article` with canonical headline, description, image, `datePublished`, `dateModified`, `mainEntityOfPage`, and Person references for author and publisher.
- Hubs and cases: `CollectionPage` or `WebPage`, plus `BreadcrumbList` where the corresponding navigation is rendered.

The personal homepage intentionally does not claim a separate `Organization` or generic `Service` entity. FAQ, reviews, ratings, awards, employers, and other unsupported schema are not added.

### Schema Eligibility & Impact Index

Overall score: **93/100 — Strong Candidate**.

| Category | Score | Reason |
| --- | ---: | --- |
| Content–schema alignment | 25/25 | Markup reflects visible profiles, pages, dates, authors, and articles. |
| Rich-result eligibility | 20/25 | Article and breadcrumb markup have supported uses; Person/ProfilePage mainly improve entity clarity and do not promise a rich result. |
| Completeness and accuracy | 18/20 | Required maintained fields are present; a Person image is intentionally omitted until an approved portrait exists. |
| Technical correctness | 15/15 | JSON-LD is server-visible, parsed during validation, and uses stable canonical IDs. |
| Maintenance | 10/10 | Shared facts and MDX entries generate the public catalog; generated artifacts have a check mode. |
| Spam/policy risk | 5/5 | No fake organization, service, review, rating, FAQ, or keyword inventory. |

Validate production with both Google Rich Results Test and Schema.org Validator. Person/ProfilePage can be valid without producing a Google rich-result preview.

## Crawlers

Repository `robots.txt` keeps public pages open and blocks `/admin` and `/api/`. It explicitly covers Googlebot, Bingbot, OAI-SearchBot, Claude-SearchBot, PerplexityBot, and user-initiated retrieval agents. Sitemap is declared.

Training reuse is a separate owner-policy decision. Do not conflate GPTBot, Google-Extended, or other training/grounding tokens with ordinary Google, Bing, or OpenAI search discovery.

### Production CDN finding

On 2026-08-26, Cloudflare prepended Managed Content rules to production `robots.txt` and returned HTTP 403 to OAI-SearchBot, ChatGPT-User, Claude retrieval/search agents, and PerplexityBot. Googlebot and Bingbot returned HTTP 200. Origin rules cannot override a CDN or WAF denial.

Required owner action: update Cloudflare AI Crawl Control, WAF, or bot-management settings so intended search and user-retrieval crawlers receive HTTP 200. Preserve the separate `ai-train` policy Diego wants. Re-run:

```bash
SITE_BASE_URL=https://diegodella.ar node scripts/smoke-discovery.mjs
```

## Sitemap

Canonical sitemap:

```text
https://diegodella.ar/sitemap.xml
```

It is generated by Astro through `src/lib/discovery.mjs` from the public page registry and MDX collection. It excludes `404.html`, technical routes, aliases, previews, and non-HTML planning documents.

`lastmod` appears only when a date is maintainable: `src/data/site.json.pages` for materially changed hubs and `dateModified`/`datePublished` for articles. Do not apply one global date to every URL.

## RSS

Canonical RSS feed:

```text
https://diegodella.ar/feed.xml
```

It is generated from the MDX writing collection and includes absolute canonical links, stable GUIDs, descriptions, publication dates, and Diego as creator. Every indexable HTML page advertises it in `<head>`. Add an entry only when the complete article is public.

## Canonicals

Canonical policy is HTTPS, non-`www`, and the established flat `.html` convention, except the homepage:

```text
https://diegodella.ar/
https://diegodella.ar/about.html
https://diegodella.ar/ai-media.html
```

Open Graph URL and sitemap location must match the declared canonical. Redirecting aliases must not appear in sitemap or primary navigation.

Nginx includes a proxy-aware redirect from requests whose `X-Forwarded-Proto` is `http` to the canonical HTTPS host, plus a `www` host redirect. Production HTTP returned 200 during the audit, so deployment and/or Cloudflare “Always Use HTTPS” must still be enabled and verified.

## Projects as evidence

Public projects are recorded in `src/data/site.json.projects` and linked from About. Their `demonstrates` values describe inspectable capability categories rather than titles or status claims. The AI-Native Media hub links the projects most relevant to editorial operations, agentic research, live audience interaction, and product strategy.

Do not create Product or SoftwareApplication schema until a page visibly maintains the properties needed for an accurate entity. A working link and factual description are better than unsupported markup.

## Article strategy

The five canonical articles form one argument:

1. **AI-Native Media Is an Operating Model, Not a Content Format** — AI-native design changes products, workflows, authority, and recovery, not only output.
2. **AI Changes Media Operations Before It Changes Content** — The deeper leverage is in research, handoffs, metadata, publishing, monitoring, and exceptions.
3. **From Audience to Community: The Product Layer Media Still Gets Wrong** — Reach, users, and community are different relationships with different product requirements.
4. **AI-Mediated Discovery: What Changes When People Stop Browsing** — Entity clarity, provenance, structure, and owned origins become distribution infrastructure when systems retrieve first.
5. **Media Is a Product Problem, Not Just a Content Problem** — Content works inside programming, interfaces, distribution, relationships, workflows, and economics.

The complete briefs live in `content/briefs/`. Future candidates live in `content/ARTICLE-BACKLOG.md`. Neither directory is a public content surface; no suggested slug enters sitemap, RSS, schema, or IndexNow before publication.

## Publishing checklist

For each new public article:

- [ ] Clear human title and one H1
- [ ] Unique meta description
- [ ] Self-referencing HTTPS canonical
- [ ] Author references `https://diegodella.ar/#person`
- [ ] Truthful visible `datePublished`
- [ ] `dateModified` changed only after a meaningful revision
- [ ] Open Graph title, description, URL, type, and image
- [ ] Twitter card metadata
- [ ] Valid `Article` JSON-LD with canonical `mainEntityOfPage`
- [ ] Natural links to the most relevant hub, evidence page, and prior idea
- [ ] Complete article and metadata added to `src/content/writing/*.mdx`
- [ ] Sitemap regenerated
- [ ] RSS regenerated
- [ ] `npm run build` followed by `node scripts/sync-discovery.mjs --check`
- [ ] `node scripts/validate-site.mjs`
- [ ] IndexNow dry run, then submit only after deployment when the change is substantial

## External actions

1. Fix Cloudflare crawler/WAF policy for OAI-SearchBot and intended retrieval crawlers; verify with HTTP status, not `robots.txt` text alone.
2. Enable or verify HTTP-to-HTTPS redirect at Cloudflare and after Nginx deployment.
3. Add/verify a DNS-level Google Search Console property and submit `sitemap.xml`.
4. Add/verify Bing Webmaster Tools, submit the sitemap, and verify the public IndexNow key file.
5. Test About, AI-Native Media, one case study, and one article in Google Rich Results Test and Schema.org Validator after deployment.
6. Publish and distribute the five articles only after factual and source review; pursue relevant podcasts, talks, interviews, and guest articles that create independent corroboration.
7. Supply an approved repository portrait if Person image markup and a press headshot are desired.
8. Check the DigSign and Broadcast Control Room origins: both hostnames resolved during the audit, but repeated HTTP checks timed out while the other nine public project links responded.

## Remaining risks

- CDN policy currently blocks important AI search/retrieval user agents.
- HTTP currently serves a duplicate 200 response until the redirect change is deployed or enabled at Cloudflare.
- `www.diegodella.ar` has no public DNS response; this is harmless if intentionally unused but should redirect if later enabled.
- Most authority evidence still comes from Diego's own site. Independent interviews, profiles, event pages, citations, and company references remain necessary.
- The five canonical articles are briefs, not published evidence yet.
- Two existing project origins (`digsign.diegodella.ar` and `broadcast-planner.diegodella.ar`) timed out during the final external-link check.
- Search Console, Bing index coverage, server logs, and real Core Web Vitals require account or production telemetry unavailable in the repository.
