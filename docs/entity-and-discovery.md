# Entity and discovery architecture

This document defines the public identity contract for `diegodella.ar`. Keep it consistent when adding pages or writing.

## Canonical entities

### Person

The canonical Person is Diego Dell'Agostino.

```text
@id: https://diegodella.ar/#person
authoritative profile: https://diegodella.ar/about.html
```

The same complete Person node appears on `about.html` inside a `ProfilePage` graph and on the homepage alongside `WebSite` and `WebPage`. Both resolve the `entity: person` marker in `src/data/presentation.json` through `src/layouts/SiteLayout.astro`, using `src/data/site.json`. Other pages reference the same `@id`; they do not create competing identities.

Supported public facts include:

- official name: Diego Dell'Agostino;
- location: Buenos Aires, Argentina (`Place` with a city-level `PostalAddress`, country code `AR`);
- category: media and product entrepreneur focused on AI-native media;
- languages: English and Spanish;
- email: dellagostino@gmail.com, already public on Contact, Consulting, and Privacy;
- core experience: digital media, digital products, marketing, content strategy, audience development, and communities;
- Posta relationship: co-founder;
- Roxom TV relationship: founding team, media architecture, and product operations;
- Digital House relationship: Digital Marketing professor (2017–2022), Academic Content Lead (2018–2022);
- current territory: AI-native media, agents, agentic workflows, editorial operations, media automation, and AI-mediated discovery.

The three organizations appear under `affiliation` with factual descriptions of Diego's roles. No current employment, graduation, or award is implied. El Ojo jury service remains in the canonical short bio used for `description`.

The September 2026 asset review found only typographic site graphics, so Person `image` is omitted. Add it when an actual representative person image is available; do not substitute a generic site graphic. LinkedIn and GitHub remain the only verified personal profile URLs found in active repository content. `person.sameAs` must match `socialProfiles`, and `person.description` must match `bios.short`; the build validator checks both.

Schema Eligibility & Impact Index: 83/100, valid but limited (content alignment 25, search-feature eligibility 10, data completeness 18, technical correctness 15, maintenance 10, low spam risk 5). The purpose is consistent entity identification. Person markup does not promise a rich result. Reference: [Schema.org Person](https://schema.org/Person) and [Google ProfilePage guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page).

### WebSite

```text
@id: https://diegodella.ar/#website
url: https://diegodella.ar/
```

The homepage defines the WebSite. Its creator is Person `#person`. “Narrative Mechanics” is an alternate site name and the name of the editorial body of work; it is not modeled as a separate company.

## Canonical identity data

`site-data.json` is the reusable source for:

- site and Person IDs;
- official spelling;
- public descriptions and bios;
- the core/current positioning split;
- verified social profiles;
- focused expertise terms;
- case-study records;
- public projects and the capabilities they demonstrate;
- article titles, descriptions, dates, URLs, and tags.

Visible HTML remains the canonical public content. When factual copy changes, update both the relevant page and `site-data.json`; then run:

```bash
node scripts/sync-discovery.mjs
node scripts/validate-site.mjs
```

## URL structure

The site retains its established flat `.html` canonical convention:

```text
/
/about.html
/work.html
/work-posta.html
/work-roxom.html
/essays.html
/ai-media.html
/speaking.html
/media-kit.html
```

Nginx redirects the preferred semantic alternatives `/writing`, `/work/posta`, and `/work/roxom` to canonical HTML URLs. Do not put redirecting URLs in the sitemap or internal navigation.

## Structured-data strategy

Schema is present in source HTML. It must not depend on JavaScript execution.

- Homepage: `WebSite` + `WebPage`, connected to Person `#person`. It is not a second ProfilePage.
- About: `ProfilePage` whose `mainEntity` is Person `#person`.
- Articles: `Article` whose `author` and `publisher` reference Person `#person`; `mainEntityOfPage` points to the canonical WebPage.
- Hubs and case studies: `CollectionPage` or `WebPage` plus a breadcrumb graph.
- Visible navigation hierarchy: `BreadcrumbList` matching the page’s visible breadcrumb.

About, Consulting, and Speaking also have visible FAQ sections (9, 8, and 7 questions). `src/data/faqs.json` supplies both the HTML and FAQPage JSON-LD through `src/components/FaqSection.astro`. Answers paraphrase the existing page copy. The consulting service area—Argentina and Latin America, with remote work worldwide—was explicitly confirmed by Diego. `src/data/consulting.json` supplies the visible lede and Service definition, whose provider references Person `#person`. FAQ parity tests compare the rendered questions, answers, and links against JSON-LD.

FAQ/Service eligibility assessment: 75/100, valid but limited (content alignment 25, Google rich-result eligibility 0, accuracy 20, technical correctness 15, maintenance 10, low spam risk 5). Google [retired FAQ rich results in May 2026](https://developers.google.com/search/updates#may-2026); this markup expresses the visible answers and service without promising a Search feature or AI citation.

Person and ProfilePage markup primarily improves entity clarity. It is not represented as a Google rich-result promise. Article and visible breadcrumb markup are stronger search-feature candidates when their visible content and other eligibility requirements are satisfied.

Do not add FAQ, review, service, event, award, employer, or rating schema unless the page visibly and factually supports it. JSON-LD is evidence encoding, not a keyword container.

This is a personal site. Do not invent a separate Organization entity or mark a generic advisory Service merely to expand the graph.

## Author identity

Every entry in `site-data.json.writing` must resolve to this chain:

```text
Article
  → author @id https://diegodella.ar/#person
  → url https://diegodella.ar/about.html
  → sameAs LinkedIn and GitHub on the canonical Person node
```

Use factual `datePublished`. Article schema falls back to the publication date for initial `dateModified`; set a later `dateModified` only after a meaningful editorial revision. When the dates differ, the generated byline exposes both.

## `sameAs`

Only durable identity-equivalent profiles belong in `sameAs`. Current verified values:

- `https://www.linkedin.com/in/diegodella/`
- `https://github.com/diegodella1`

Press coverage, company pages, interviews, and acquisition announcements are citations, not identity-equivalent profiles. Link those in case studies instead.

## `knowsAbout`

Keep this list short and coherent:

- Digital Media
- Digital Products
- Marketing
- Content Strategy
- Audience Development and Communities
- Media Products
- Editorial Operations
- AI-Native Media
- AI Agents
- Agentic Workflows
- Media Automation
- AI-Mediated Discovery

Do not expand it into an SEO keyword inventory.

## Metadata and canonicals

Every indexable HTML page must contain:

- one unique title;
- one useful description;
- a self-referencing HTTPS/non-`www` canonical;
- matching Open Graph URL;
- Open Graph title, description, site name, type, and image;
- Twitter card title, description, and image;
- an RSS discovery link.

The validator checks generated HTML source, not component assumptions.

## Sitemap

`scripts/sync-discovery.mjs` generates `sitemap.xml` from indexable root HTML files and their canonical URLs. It excludes `404.html`, redirects, utility endpoints, planning briefs, and private routes. `lastmod` appears only for maintained hub dates in `site-data.json.pages` or article `dateModified`/`datePublished`; never apply one global date to every URL.

## Robots and crawler policy

`robots.txt` keeps public content crawlable and points to the sitemap. It distinguishes ordinary search, AI search/discovery, user-initiated retrieval, and model-training/grounding crawlers. See `docs/crawler-policy.md` before changing individual agents.

## RSS

`feed.xml` is generated from `site-data.json.writing`. Entries contain canonical link, description, truthful publication date, stable permalink GUID, and Diego as creator. Add an article to the feed only after the full article is ready to publish.

## `llms.txt`

`llms.txt` is a compact factual route map for systems that choose to use the emerging convention. It links About, Work, Posta, Roxom TV, AI-Native Media, Writing, Speaking, Media Kit, editorial routes, sitemap, RSS, and canonical site data.

It is experimental. There is no claim that it improves ranking, citation, or inclusion in any LLM.

## IndexNow

The public verification file is:

```text
https://diegodella.ar/5f23e6aa9d52af688ddc7c193a83fc3e.txt
```

The key is public by design and is not an account secret. `scripts/indexnow.mjs` accepts only canonical URLs already present in `sitemap.xml` and defaults to a dry run. Deployment does not submit automatically, avoiding a fragile release dependency.

```bash
# Preview all sitemap URLs
node scripts/indexnow.mjs --all

# Submit selected changed URLs after deployment
node scripts/indexnow.mjs --submit /about.html /work.html

# Submit all canonical URLs when initially enabling IndexNow
node scripts/indexnow.mjs --submit --all
```

## Internal knowledge graph

Keep links useful and human:

```text
Home
  → About
  → Work → Posta / Roxom TV
  → AI-Native Media → media / product / marketing / content / communities → relevant writing / projects / speaking
  → Writing → author About / related work and topic pages
```

Speaking and Media Kit live under About/footer-level navigation so the primary navigation remains compact.

## Adding future content

1. Publish only a complete, defensible page.
2. Use the official name and stable Person `@id`.
3. Add one canonical URL and unique metadata.
4. Add the article record to `site-data.json` only when it is publishable.
5. Link to the most relevant case study, topic hub, or About page.
6. Run the discovery sync and validator.
7. Inspect the rendered desktop/mobile page before deployment.
