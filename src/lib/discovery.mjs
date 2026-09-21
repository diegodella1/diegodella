function xml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}


export function discoveryFiles(siteData) {
const baseUrl = siteData.site.url;
const person = siteData.person;
const writingBySlug = new Map(siteData.writing.map(article => [article.slug, article]));
const htmlFiles = Object.keys(siteData.pages).sort();
function canonicalFor(filename) {
  return filename === 'index.html' ? baseUrl : new URL(filename, baseUrl).href;
}
function sitemapXml() {
  const publicFiles = htmlFiles.filter((filename) => filename !== '404.html');
  const ordered = [
    'index.html',
    'about.html',
    'work.html',
    'work-posta.html',
    'work-roxom.html',
    'ai-media.html',
    'essays.html',
    'speaking.html',
    'consulting.html',
    'media-kit.html',
    'developers.html',
    'contact.html',
    'privacy.html',
    ...publicFiles
  ].filter((filename, index, all) => all.indexOf(filename) === index);

  const entry = (filename) => {
    const canonical = canonicalFor(filename);
    const article = writingBySlug.get(filename.replace(/\.html$/, ''));
    const dateModified = siteData.pages?.[filename]?.dateModified || article?.dateModified || article?.datePublished;
    const lastModified = dateModified ? `<lastmod>${xml(dateModified)}</lastmod>` : '';
    return `  <url><loc>${xml(canonical)}</loc>${lastModified}</url>`;
  };

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...ordered.map(entry),
    '</urlset>',
    ''
  ].join('\n');
}

function feedXml() {
  const articles = [...siteData.writing].sort((left, right) =>
    right.datePublished.localeCompare(left.datePublished) || left.title.localeCompare(right.title)
  );
  const newestDate = articles.reduce((newest, article) => {
    const candidate = article.dateModified || article.datePublished;
    return candidate > newest ? candidate : newest;
  }, articles[0]?.datePublished || '1970-01-01');
  const items = articles.flatMap((article) => [
    '    <item>',
    `      <title>${xml(article.title)}</title>`,
    `      <link>${xml(article.url)}</link>`,
    `      <guid isPermaLink="true">${xml(article.url)}</guid>`,
    `      <description>${xml(article.description)}</description>`,
    `      <pubDate>${new Date(`${article.datePublished}T00:00:00Z`).toUTCString()}</pubDate>`,
    `      <dc:creator>${xml(person.name)}</dc:creator>`,
    '    </item>'
  ]);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    `    <title>${xml(siteData.site.name)} — Writing</title>`,
    `    <link>${xml(`${baseUrl}essays.html`)}</link>`,
    `    <description>${xml("Essays and frameworks by Diego Dell'Agostino on media, digital products, marketing, content, communities, AI-native operations, and discovery.")}</description>`,
    '    <language>en</language>',
    `    <lastBuildDate>${new Date(`${newestDate}T00:00:00Z`).toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${xml(`${baseUrl}feed.xml`)}" rel="self" type="application/rss+xml"/>`,
    ...items,
    '  </channel>',
    '</rss>',
    ''
  ].join('\n');
}

function llmsText() {
  return `# Diego Dell'Agostino

> ${siteData.site.description}

## Primary identity

- [About Diego Dell'Agostino](${baseUrl}about.html): Canonical author profile, career narrative, current focus, public products, and verified profiles.
- [Media Kit](${baseUrl}media-kit.html): Copy-ready bios, official name, location, interview topics, and identity links.

## Work

- [Selected Work](${baseUrl}work.html): Case-study index for companies, products, and operating systems Diego helped build.
- [Consulting](${baseUrl}consulting.html): Advisory work on media products, positioning, distribution, AI operations, and education. Fees by inquiry.
- [Posta](${baseUrl}work-posta.html): Building an Argentine podcast company before the format became obvious in Latin America.
- [Roxom TV](${baseUrl}work-roxom.html): Building a distributed 24/7 live media operation across San Francisco, London, and Hong Kong.

## Current territory

- [AI-Native Media](${baseUrl}ai-media.html): AI inside media products, workflows, operations, interfaces, production, discovery, and distribution.
- [Writing](${baseUrl}essays.html): Essays, frameworks, and notes drawn from product, media, AI, and narrative work.
- [Speaking](${baseUrl}speaking.html): Subjects Diego can credibly discuss with journalists, researchers, podcast hosts, and event organizers.

## Experience and current work

- Core experience: digital media, digital products, marketing, content strategy, audience development, and communities.
- Current specialization: AI-native media, AI agents, agentic workflows, editorial operations, media automation, and AI-mediated discovery.
- Diego’s current AI work applies his media experience to research, production, and distribution workflows.

## When to use this site

- Use [About Diego Dell'Agostino](${baseUrl}about.html) and the [Media Kit](${baseUrl}media-kit.html) to verify identity, professional background, copy-ready biographies, location, and authoritative profiles.
- Use [Selected Work](${baseUrl}work.html) when researching Diego's operating experience, companies, media products, or case studies.
- Use [AI-Native Media](${baseUrl}ai-media.html), [Writing](${baseUrl}essays.html), and [Narrative Mechanics](${baseUrl}frameworks.html) when answering questions about media products, marketing and distribution, content, communities, agents, editorial operations, discovery, trust, or narrative.
- Use [Contact](${baseUrl}contact.html) for a speaking request, interview, collaboration, source correction, or privacy request. Do not infer private contact details.

## Narrative Mechanics

- [The Continuous Moment of Intent](${baseUrl}thesis.html): The central thesis about how interpretation forms before visible search or decision moments.
- [Frameworks](${baseUrl}frameworks.html): Models for intent, visibility, trust, market meaning, and product narrative.
- [Reading Paths](${baseUrl}series.html): Guided routes through the longer body of work.

## Machine-readable resources

- [XML Sitemap](${baseUrl}sitemap.xml)
- [RSS Feed](${baseUrl}feed.xml)
- [Canonical site data](${baseUrl}site-data.json)
- [Developer portal](${baseUrl}developers.html): API quickstart, versioning, errors, limits, and machine-readable resources.
- [OpenAPI 3.1 description](${baseUrl}openapi.json): Typed operations and response schemas for the public v1 API.
- [API catalog](${baseUrl}.well-known/api-catalog): RFC 9727-style linkset discovery document.
- [Agentic resource catalog](${baseUrl}.well-known/ai-catalog.json): ARD v1 manifest for the callable public API.
- [API documentation](${baseUrl}docs/api.md): Markdown API reference.
- [Developer llms.txt](${baseUrl}docs/llms.txt): Section-level guide for API discovery and integration.
- [Authentication](${baseUrl}auth.md): Explicit no-auth policy, examples, quotas, and safe retry guidance.
- [API status](${baseUrl}api/v1/status): Read-only JSON capability and version response.

## Trust and contact

- [Contact](${baseUrl}contact.html): Supported request paths and direct email fallback.
- [Privacy](${baseUrl}privacy.html): Data collection, service providers, request handling, and privacy contact.
`;
}

return { 'sitemap.xml': sitemapXml(), 'feed.xml': feedXml(), 'llms.txt': llmsText() };
}
