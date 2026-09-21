import fs from 'node:fs';
import path from 'node:path';

const repository = path.resolve(import.meta.dirname, '..');
const root = path.resolve(import.meta.dirname, '../dist');
const pages = fs.readdirSync(root).filter((name) => name.endsWith('.html')).sort();
const requiredNav = [
  ['work.html', 'Work'],
  ['essays.html', 'Writing'],
  ['thesis.html', 'Thesis'],
  ['about.html', 'About'],
  ['consulting.html', 'Consulting'],
  ['contact.html', 'Get in touch']
];
const siteData = JSON.parse(fs.readFileSync(path.join(root, 'site-data.json'), 'utf8'));
const baseUrl = siteData.site.url;
const personId = siteData.person.id;
const websiteId = siteData.site.websiteId;
const writingBySlug = new Map(siteData.writing.map((article) => [article.slug, article]));
const indexablePages = pages.filter((file) => file !== '404.html');
const titles = new Map();
const descriptions = new Map();
const schemasByFile = new Map();
const inboundLinks = new Map(indexablePages.map((file) => [file, 0]));
const failures = [];
const activeStylesheets = [
  'global.css',
  'styles/tokens.css',
  'styles/page-inline.css',
  'styles/home.css',
  'styles/editorial.css',
  'styles/components.css',
  'styles/shell.css',
  'styles/theme-contract.css'
];

function count(source, pattern) {
  return (source.match(pattern) || []).length;
}

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

function expectedCanonical(file) {
  return file === 'index.html' ? baseUrl : new URL(file, baseUrl).href;
}

function metaContent(source, key, attribute = 'name') {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.match(new RegExp(`<meta\\s+${attribute}="${escaped}"\\s+content="([^"]*)"`, 'i'))?.[1] || '';
}

function schemaNodes(data) {
  return Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
}

function typeIncludes(value, type) {
  return Array.isArray(value) ? value.includes(type) : value === type;
}

function findSchemaObjects(value, predicate, found = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => findSchemaObjects(item, predicate, found));
    return found;
  }
  if (!value || typeof value !== 'object') return found;
  if (predicate(value)) found.push(value);
  Object.values(value).forEach((item) => findSchemaObjects(item, predicate, found));
  return found;
}

function registerUnique(map, value, file, label) {
  if (!value) return;
  if (map.has(value)) fail(file, `${label} duplicates ${map.get(value)}`);
  else map.set(value, file);
}

function hasNonSvgInlineStyle(source) {
  let svgDepth = 0;
  for (const match of source.matchAll(/<[^>]+>/g)) {
    const tag = match[0];
    if (/^<\/svg\b/i.test(tag)) svgDepth = Math.max(0, svgDepth - 1);
    if (svgDepth === 0 && !/^<svg\b/i.test(tag) && /\sstyle="/i.test(tag)) return true;
    if (/^<svg\b/i.test(tag) && !/\/\s*>$/.test(tag)) svgDepth += 1;
  }
  return false;
}

function findTinyFont(source) {
  for (const match of source.matchAll(/font-size:\s*([0-9.]+)(rem|px)/gi)) {
    const value = Number(match[1]);
    if ((match[2].toLowerCase() === 'rem' && value < 0.75) || (match[2].toLowerCase() === 'px' && value < 12)) {
      return match[0];
    }
  }
  return null;
}

function tokenMap(block) {
  const values = {};
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    values[match[1]] = match[2].trim();
  }
  return values;
}

function tokenValue(values, token, seen = new Set()) {
  if (seen.has(token)) return null;
  seen.add(token);
  const raw = values[token];
  if (!raw) return null;
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw;
  const reference = raw.match(/^var\((--[\w-]+)\)$/)?.[1];
  return reference ? tokenValue(values, reference, seen) : null;
}

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const values = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const file of pages) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const head = source.slice(0, source.indexOf('</head>'));
  if (!/<html[^>]+lang="[^"]+"/i.test(source)) fail(file, 'missing html lang');
  if (!/<meta[^>]+name="viewport"/i.test(source)) fail(file, 'missing viewport meta');
  if (!/<meta[^>]+name="theme-color"[^>]+content="#131313"[^>]+id="themeColor"|<meta[^>]+content="#131313"[^>]+name="theme-color"[^>]+id="themeColor"/i.test(source)) {
    fail(file, 'missing fixed dark theme-color meta');
  }
  if (!/<html[^>]+data-theme="dark"/i.test(source)) fail(file, 'missing fixed dark document theme');
  if (/data-theme-source|prefers-color-scheme:dark|id="themeToggle"|data-theme-toggle/i.test(head)) {
    fail(file, 'obsolete theme switching contract remains');
  }
  if (!/href="#main-content"/i.test(source)) fail(file, 'missing skip link');
  if (!/<main[^>]+id="main-content"/i.test(source)) fail(file, 'missing main-content landmark');
  if (count(source, /<h1\b/gi) !== 1) fail(file, `expected one h1, found ${count(source, /<h1\b/gi)}`);
  const headingLevels = [...source.matchAll(/<h([1-6])\b/gi)].map((match) => Number(match[1]));
  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] > headingLevels[index - 1] + 1) {
      fail(file, `heading hierarchy skips from h${headingLevels[index - 1]} to h${headingLevels[index]}`);
    }
  }
  for (const image of source.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt="[^"]*"/i.test(image[0])) fail(file, 'image is missing an alt attribute');
  }
  if (count(source, /id="main-content"/gi) !== 1) fail(file, 'main-content id is missing or duplicated');
  if (/<style(?:\s|>)/i.test(head) && !/<style[^>]*>@layer page\s*\{/i.test(head)) {
    fail(file, 'head styles must be isolated in the page layer');
  }
  if (file !== 'index.html' && /!important/i.test(head)) {
    fail(file, 'page styles must not use !important');
  }
  if (hasNonSvgInlineStyle(source)) fail(file, 'non-SVG inline style must be extracted to page-inline.css');
  if (/cdn\.tailwindcss\.com/i.test(source)) fail(file, 'Tailwind CDN runtime is forbidden');
  const tinyFont = findTinyFont(source);
  if (tinyFont) fail(file, `text smaller than the 12px UI floor: ${tinyFont}`);
  if (/Diego Dell Agostino|Diego Dell’Agostino|Diego Della(?!go)/u.test(source)) {
    fail(file, "non-canonical Diego Dell'Agostino spelling remains");
  }

  const schemas = [];
  for (const match of source.matchAll(/<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi)) {
    try {
      schemas.push(JSON.parse(match[1]));
    } catch (error) {
      fail(file, `invalid JSON-LD: ${error.message}`);
    }
  }
  schemasByFile.set(file, schemas);

  if (file !== '404.html') {
    const title = source.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
    const description = metaContent(source, 'description');
    const canonical = source.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] || '';
    const expected = expectedCanonical(file);
    if (count(source, /<title>/gi) !== 1 || !title) fail(file, 'must have one non-empty title');
    if (count(source, /<meta\s+name="description"/gi) !== 1 || !description) fail(file, 'must have one non-empty description');
    if (metaContent(source, 'author') !== siteData.person.name) fail(file, 'meta author must use the canonical Person name');
    if (count(source, /<link\s+rel="canonical"/gi) !== 1) fail(file, 'must have exactly one canonical');
    if (canonical !== expected) fail(file, `canonical must be ${expected}`);
    registerUnique(titles, title, file, 'title');
    registerUnique(descriptions, description, file, 'description');

    for (const key of ['og:title', 'og:description', 'og:type', 'og:url', 'og:site_name', 'og:image', 'og:image:width', 'og:image:height']) {
      if (!metaContent(source, key, 'property')) fail(file, `missing ${key}`);
    }
    if (metaContent(source, 'og:url', 'property') !== expected) fail(file, 'Open Graph URL must match canonical');
    if (metaContent(source, 'og:image', 'property') !== `${baseUrl}og-default.png`) fail(file, 'Open Graph image must use the canonical absolute image URL');
    for (const key of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
      if (!metaContent(source, key)) fail(file, `missing ${key}`);
    }
    if (!source.includes(`href="${baseUrl}feed.xml"`) || !source.includes('type="application/rss+xml"')) {
      fail(file, 'missing canonical RSS discovery link');
    }
    if (/<meta\s+name="keywords"/i.test(source)) fail(file, 'meta keywords inventory is not allowed');
    if (!schemas.length) fail(file, 'missing static JSON-LD');

    const topNodes = schemas.flatMap(schemaNodes);
    if (!topNodes.some((node) => ['WebPage', 'ProfilePage', 'CollectionPage'].some((type) => typeIncludes(node?.['@type'], type)))) {
      fail(file, 'missing top-level WebPage, ProfilePage, or CollectionPage schema');
    }
    if (file !== 'index.html' && !schemas.some((schema) => findSchemaObjects(schema, (node) => typeIncludes(node?.['@type'], 'BreadcrumbList')).length)) {
      fail(file, 'missing static BreadcrumbList schema');
    }
    if (schemas.some((schema) => findSchemaObjects(schema, (node) => typeIncludes(node?.['@type'], 'FAQPage')).length)) {
      fail(file, 'unsupported FAQPage schema remains');
    }
    if (schemas.some((schema) => findSchemaObjects(schema, (node) => typeIncludes(node?.['@type'], 'ScholarlyArticle')).length)) {
      fail(file, 'editorial content must not be labeled ScholarlyArticle');
    }
    for (const schema of schemas) {
      for (const entity of findSchemaObjects(schema, (node) => typeIncludes(node?.['@type'], 'Person') && node.name === siteData.person.name)) {
        if (entity['@id'] !== personId) fail(file, 'Diego Person node must reference the canonical @id');
        if (entity.url !== siteData.person.url) fail(file, 'Diego Person node must reference the canonical About URL');
      }
    }
  }

  const nav = source.match(/<div\b(?=[^>]*\bid="navLinks")[^>]*>([\s\S]*?)<\/div>/i)?.[1];
  if (!nav) {
    fail(file, 'missing static primary navigation');
  } else {
    for (const [href, label] of requiredNav) {
      if (!nav.includes(`href="${href}"`) || !nav.includes(`>${label}</a>`)) fail(file, `missing primary nav route ${label}`);
    }
    if (count(nav, /class="nav-link(?: [^"]*)?"/g) !== requiredNav.length) fail(file, 'primary navigation must contain four sections and contact');
  }
  if (!/class="nav-brand"[^>]*>[\s\S]*?Diego Dell'Agostino<\/a>/i.test(source)) {
    fail(file, 'primary brand must be Diego Dell’Agostino');
  }
  for (const [href, label] of [
    ['developers.html', 'Developers'],
    ['contact.html', 'Contact'],
    ['privacy.html', 'Privacy']
  ]) {
    if (!source.includes(`class="site-footer-link" href="${href}">${label}</a>`)) {
      fail(file, `footer must expose ${label}`);
    }
  }

  for (const match of source.matchAll(/(?:href|src)="([^"#?]+)(?:\?[^"#]*)?(?:#[^"]*)?"/gi)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(target) || target === '/') continue;
    const local = target.startsWith('/') ? target.slice(1) : target;
    if (!fs.existsSync(path.join(root, local))) fail(file, `missing local target ${target}`);
    if (inboundLinks.has(local)) inboundLinks.set(local, inboundLinks.get(local) + 1);
  }

  for (const match of source.matchAll(/href="([^"#]*?)#([^"?]+)"/gi)) {
    const targetFile = match[1] || file;
    const targetPath = path.join(root, targetFile);
    if (!fs.existsSync(targetPath)) continue;
    const targetSource = fs.readFileSync(targetPath, 'utf8');
    if (!new RegExp(`(?:id|name)="${match[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(targetSource)) {
      fail(file, `missing hash target ${targetFile}#${match[2]}`);
    }
  }
}

for (const [file, inbound] of inboundLinks) {
  if (inbound === 0) fail(file, 'indexable page is orphaned from internal HTML links');
}

for (const route of [
  'index.html',
  'about.html',
  'work.html',
  'work-posta.html',
  'work-roxom.html',
  'essays.html',
  'ai-media.html',
  'speaking.html',
  'consulting.html',
  'media-kit.html',
  'developers.html',
  'contact.html',
  'privacy.html'
]) {
  if (!pages.includes(route)) fail(route, 'required public route is missing');
}

const fullPersonDefinitions = [];
for (const [file, schemas] of schemasByFile) {
  for (const schema of schemas) {
    for (const entity of findSchemaObjects(schema, (node) =>
      typeIncludes(node?.['@type'], 'Person') && node['@id'] === personId && (node.sameAs || node.knowsAbout || node.jobTitle)
    )) {
      fullPersonDefinitions.push({ file, entity });
    }
  }
}
if (fullPersonDefinitions.length !== 1 || fullPersonDefinitions[0]?.file !== 'about.html') {
  fail('about.html', `expected one complete canonical Person definition, found ${fullPersonDefinitions.length}`);
} else {
  const canonicalPerson = fullPersonDefinitions[0].entity;
  if (canonicalPerson.name !== siteData.person.name) fail('about.html', 'Person name differs from site-data.json');
  if (canonicalPerson.url !== siteData.person.url) fail('about.html', 'Person URL differs from site-data.json');
  if (canonicalPerson.jobTitle !== siteData.person.jobTitle) fail('about.html', 'Person job title differs from site-data.json');
  if (canonicalPerson.description !== siteData.person.description) fail('about.html', 'Person description differs from site-data.json');
  if (JSON.stringify(canonicalPerson.sameAs) !== JSON.stringify(siteData.person.sameAs)) fail('about.html', 'Person sameAs differs from site-data.json');
  if (JSON.stringify(canonicalPerson.knowsAbout) !== JSON.stringify(siteData.person.knowsAbout)) fail('about.html', 'Person knowsAbout differs from site-data.json');
}

const aboutNodes = (schemasByFile.get('about.html') || []).flatMap(schemaNodes);
const profilePage = aboutNodes.find((node) => typeIncludes(node?.['@type'], 'ProfilePage'));
if (profilePage?.mainEntity?.['@id'] !== personId) fail('about.html', 'ProfilePage mainEntity must reference canonical Person');
const aboutSource = fs.readFileSync(path.join(root, 'about.html'), 'utf8');
const mediaKitSource = fs.readFileSync(path.join(root, 'media-kit.html'), 'utf8');
for (const [name, bio] of Object.entries(siteData.bios || {})) {
  if (!mediaKitSource.replaceAll('&#39;', "'").replaceAll('&amp;', '&').includes(bio)) fail('media-kit.html', `${name} bio differs from site-data.json`);
}
if (!aboutSource.replaceAll('&#39;', "'").replaceAll('&amp;', '&').includes(siteData.bios.full)) fail('about.html', 'full canonical bio differs from site-data.json');
const bioWords = (value) => value.trim().split(/\s+/).length;
if (siteData.bios.micro.length > 160) fail('site-data.json', 'micro bio exceeds 160 characters');
if (bioWords(siteData.bios.short) < 40 || bioWords(siteData.bios.short) > 80) fail('site-data.json', 'short bio must contain 40–80 words');
if (bioWords(siteData.bios.full) < 120 || bioWords(siteData.bios.full) > 250) fail('site-data.json', 'full bio must contain 120–250 words');

const homeNodes = (schemasByFile.get('index.html') || []).flatMap(schemaNodes);
const website = homeNodes.find((node) => typeIncludes(node?.['@type'], 'WebSite'));
if (website?.['@id'] !== websiteId) fail('index.html', 'homepage must define the canonical WebSite');
if (website?.creator?.['@id'] !== personId) fail('index.html', 'WebSite creator must reference canonical Person');
const homePage = homeNodes.find((node) => typeIncludes(node?.['@type'], 'WebPage'));
if (!homePage || homePage?.about?.['@id'] !== personId) fail('index.html', 'homepage WebPage must describe the canonical Person');
if (homeNodes.some((node) => typeIncludes(node?.['@type'], 'ProfilePage'))) fail('index.html', 'About must remain the only ProfilePage');
const homePerson = homeNodes.find((node) => typeIncludes(node?.['@type'], 'Person') && node?.['@id'] === personId);
if (homePerson?.name !== siteData.person.name || homePerson?.url !== siteData.person.url) fail('index.html', 'homepage Person reference must expose the canonical name and URL');
if (homeNodes.some((node) => ['Organization', 'Service'].some((type) => typeIncludes(node?.['@type'], type)))) {
  fail('index.html', 'personal homepage must not invent Organization or Service entities');
}

for (const [file, schemas] of schemasByFile) {
  if (file !== 'about.html' && schemas.flatMap(schemaNodes).some((node) => typeIncludes(node?.['@type'], 'ProfilePage'))) {
    fail(file, 'About must remain the only ProfilePage');
  }
}

for (const article of siteData.writing) {
  const file = `${article.slug}.html`;
  if (!pages.includes(file)) {
    fail(file, 'writing record has no HTML page');
    continue;
  }
  const articleNode = (schemasByFile.get(file) || [])
    .flatMap(schemaNodes)
    .find((node) => typeIncludes(node?.['@type'], 'Article'));
  if (!articleNode) {
    fail(file, 'writing page lacks Article schema');
    continue;
  }
  if (articleNode['@id'] !== `${article.url}#article`) fail(file, 'Article @id is not canonical');
  if (articleNode.url !== article.url) fail(file, 'Article URL differs from content data');
  if (articleNode.headline !== article.title) fail(file, 'Article headline differs from content data');
  if (articleNode.description !== article.description) fail(file, 'Article description differs from content data');
  if (articleNode.datePublished !== article.datePublished) fail(file, 'Article datePublished differs from content data');
  const expectedModified = article.dateModified || article.datePublished;
  if (articleNode.dateModified !== expectedModified) fail(file, 'Article dateModified differs from content data');
  if (articleNode.keywords !== undefined) fail(file, 'Article schema must not expose a keyword inventory');
  if (articleNode.author?.['@id'] !== personId || articleNode.author?.url !== siteData.person.url) fail(file, 'Article author must reference canonical Person and About URL');
  if (articleNode.publisher?.['@id'] !== personId) fail(file, 'Article publisher must reference canonical Person');
  if (articleNode.mainEntityOfPage?.['@id'] !== article.url) fail(file, 'Article mainEntityOfPage must reference canonical URL');
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (!source.includes(`<time datetime="${article.datePublished}">`)) fail(file, 'publication date must be visible in a time element');
  if (metaContent(source, 'article:published_time', 'property') !== article.datePublished) fail(file, 'article:published_time differs from content data');
  if (metaContent(source, 'article:modified_time', 'property') !== expectedModified) fail(file, 'article:modified_time differs from content data');
  if (expectedModified < article.datePublished) fail(file, 'dateModified cannot precede datePublished');
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
if (!/^<\?xml[^>]+>\s*<urlset\b[\s\S]*<\/urlset>\s*$/u.test(sitemap)) fail('sitemap.xml', 'invalid sitemap envelope');
const sitemapEntries = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)]
  .map((match) => ({ url: match[1], dateModified: match[2] || null }));
const sitemapUrls = sitemapEntries.map((entry) => entry.url);
const expectedUrls = indexablePages.map(expectedCanonical);
for (const url of expectedUrls) if (!sitemapUrls.includes(url)) fail('sitemap.xml', `missing canonical ${url}`);
for (const url of sitemapUrls) if (!expectedUrls.includes(url)) fail('sitemap.xml', `contains non-canonical or unknown URL ${url}`);
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail('sitemap.xml', 'contains duplicate URLs');
if (sitemapUrls.some((url) => /\/(?:writing|work\/posta|work\/roxom)$/.test(url))) fail('sitemap.xml', 'contains a redirecting semantic alias');
for (const file of indexablePages) {
  const article = writingBySlug.get(file.replace(/\.html$/, ''));
  const expectedModified = siteData.pages?.[file]?.dateModified || article?.dateModified || article?.datePublished || null;
  const actualModified = sitemapEntries.find((entry) => entry.url === expectedCanonical(file))?.dateModified || null;
  if (actualModified !== expectedModified) fail('sitemap.xml', `${file} lastmod must be ${expectedModified || 'omitted'}`);
  if (actualModified && (!/^\d{4}-\d{2}-\d{2}$/.test(actualModified) || Number.isNaN(Date.parse(`${actualModified}T00:00:00Z`)))) {
    fail('sitemap.xml', `${file} has invalid lastmod ${actualModified}`);
  }
}

const feed = fs.readFileSync(path.join(root, 'feed.xml'), 'utf8');
if (!/^<\?xml[^>]+>\s*<rss\b[\s\S]*<\/rss>\s*$/u.test(feed)) fail('feed.xml', 'invalid RSS envelope');
if (!feed.includes(`<atom:link href="${baseUrl}feed.xml" rel="self" type="application/rss+xml"/>`)) fail('feed.xml', 'missing canonical Atom self link');
if (count(feed, /<item>/g) !== siteData.writing.length) fail('feed.xml', 'item count differs from writing data');
for (const article of siteData.writing) {
  if (!feed.includes(`<link>${article.url}</link>`)) fail('feed.xml', `missing article ${article.url}`);
  const pubDate = new Date(`${article.datePublished}T00:00:00Z`).toUTCString();
  if (!feed.includes(`<pubDate>${pubDate}</pubDate>`)) fail('feed.xml', `missing truthful date for ${article.slug}`);
}

const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
for (const required of [
  'User-agent: *',
  'User-agent: Googlebot',
  'User-agent: Bingbot',
  'Disallow: /admin',
  'Disallow: /api/',
  'User-agent: OAI-SearchBot',
  'User-agent: Claude-SearchBot',
  'User-agent: PerplexityBot',
  'User-agent: ChatGPT-User',
  'User-agent: Claude-User',
  'User-agent: GPTBot',
  'User-agent: ClaudeBot',
  'User-agent: Google-Extended',
  'User-agent: DeepSeekBot',
  'User-agent: Bytespider',
  `Sitemap: ${baseUrl}sitemap.xml`,
  `Agentmap: ${baseUrl}.well-known/ai-catalog.json`
]) {
  if (!robots.includes(required)) fail('robots.txt', `missing ${required}`);
}
if (count(robots, /Disallow: \/api\//g) < 5) fail('robots.txt', 'specific allow groups must retain the private API exclusion');

const llms = fs.readFileSync(path.join(root, 'llms.txt'), 'utf8');
for (const route of ['about.html', 'work.html', 'work-posta.html', 'work-roxom.html', 'ai-media.html', 'essays.html', 'speaking.html', 'media-kit.html', 'developers.html', 'contact.html', 'privacy.html']) {
  if (!llms.includes(`${baseUrl}${route}`)) fail('llms.txt', `missing primary route ${route}`);
}
for (const required of ['## When to use this site', `${baseUrl}openapi.json`, `${baseUrl}.well-known/api-catalog`, `${baseUrl}.well-known/ai-catalog.json`, `${baseUrl}docs/llms.txt`, `${baseUrl}auth.md`, `${baseUrl}api/v1/status`, '## Trust and contact']) {
  if (!llms.includes(required)) fail('llms.txt', `missing agent guidance ${required}`);
}

for (const counterpart of ['404.md', 'developers.md', 'contact.md', 'privacy.md', 'auth.md']) {
  if (!fs.existsSync(path.join(root, counterpart))) fail(counterpart, 'required Markdown representation is missing');
}
for (const markdownFile of ['index.md', 'developers.md']) {
  const markdown = fs.readFileSync(path.join(root, markdownFile), 'utf8');
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---\n/u)?.[1] || '';
  const validFrontmatter = [
    /^title:\s*["'][^\n]+["']$/mu,
    /^description:\s*["'][^\n]+["']$/mu,
    /^canonical:\s*["']https:\/\/diegodella\.ar\/[^\n]*["']$/mu,
    /^last-updated:\s*["']\d{4}-\d{2}-\d{2}["']$/mu
  ].every((pattern) => pattern.test(frontmatter));
  if (!validFrontmatter) {
    fail(markdownFile, 'must begin with title, description, canonical, and last-updated frontmatter');
  }
}
const authenticationGuide = fs.readFileSync(path.join(root, 'auth.md'), 'utf8');
if (!authenticationGuide.startsWith('# API authentication\n')) fail('auth.md', 'must open with a Markdown heading');
for (const required of ['oauth-protected-resource', 'oauth-authorization-server', 'agent_auth', 'register_uri', 'security: []']) {
  if (!authenticationGuide.includes(required)) fail('auth.md', `missing explicit access signal ${required}`);
}
const developerLlms = fs.readFileSync(path.join(root, 'docs/llms.txt'), 'utf8');
for (const required of ['# DiegoDella developer resources', '## When to use these resources', `${baseUrl}openapi.json`, `${baseUrl}api/v1/status`]) {
  if (!developerLlms.includes(required)) fail('docs/llms.txt', `missing developer guidance ${required}`);
}
const notFoundMarkdown = fs.readFileSync(path.join(root, '404.md'), 'utf8');
const notFoundHtml = fs.readFileSync(path.join(root, '404.html'), 'utf8');
for (const recoveryUrl of [`${baseUrl}sitemap.xml`, `${baseUrl}llms.txt`, `${baseUrl}developers.html`]) {
  if (!notFoundMarkdown.includes(recoveryUrl)) fail('404.md', `missing recovery link ${recoveryUrl}`);
  if (!notFoundHtml.includes(recoveryUrl)) fail('404.html', `missing recovery link ${recoveryUrl}`);
}
const homepageMain = fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(/<main\b[\s\S]*?<\/main>/i)?.[0] || '';
if (!homepageMain.includes('href="developers.html"')) fail('index.html', 'main content must link directly to the developer portal');
const homepageHead = fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(/<head\b[\s\S]*?<\/head>/i)?.[0] || '';
if (!homepageHead.includes('rel="ai-catalog" href="/.well-known/ai-catalog.json"')) fail('index.html', 'head must advertise the ARD catalog');

let aiCatalog;
try {
  aiCatalog = JSON.parse(fs.readFileSync(path.join(root, '.well-known/ai-catalog.json'), 'utf8'));
} catch (error) {
  fail('.well-known/ai-catalog.json', `invalid JSON: ${error.message}`);
}
if (aiCatalog) {
  if (aiCatalog.specVersion !== '1.0') fail('.well-known/ai-catalog.json', 'specVersion must be 1.0');
  if (!aiCatalog.host?.displayName || aiCatalog.host?.documentationUrl !== `${baseUrl}developers.html`) fail('.well-known/ai-catalog.json', 'host metadata is incomplete');
  if (!Array.isArray(aiCatalog.entries) || aiCatalog.entries.length < 1) fail('.well-known/ai-catalog.json', 'at least one resource entry is required');
  for (const entry of aiCatalog.entries || []) {
    if (!/^urn:air:diegodella\.ar(?::[a-zA-Z0-9._-]+)+$/.test(entry.identifier || '')) fail('.well-known/ai-catalog.json', `invalid identifier ${entry.identifier || 'missing'}`);
    if (!entry.displayName || !entry.type) fail('.well-known/ai-catalog.json', 'entry displayName and type are required');
    if (Boolean(entry.url) === Boolean(entry.data)) fail('.well-known/ai-catalog.json', 'entry must contain exactly one of url or data');
    if (!Array.isArray(entry.representativeQueries) || entry.representativeQueries.length < 2 || entry.representativeQueries.length > 5) fail('.well-known/ai-catalog.json', 'entry must provide 2–5 representativeQueries');
    if (entry.trustManifest?.identity !== baseUrl || entry.trustManifest?.identityType !== 'https') fail('.well-known/ai-catalog.json', 'entry must bind trust to the canonical HTTPS publisher identity');
  }
}

let openapi;
try {
  openapi = JSON.parse(fs.readFileSync(path.join(root, 'openapi.json'), 'utf8'));
} catch (error) {
  fail('openapi.json', `invalid JSON: ${error.message}`);
}
if (openapi) {
  if (!String(openapi.openapi || '').startsWith('3.1.')) fail('openapi.json', 'must use OpenAPI 3.1');
  if (openapi.info?.version !== '1.2.0') fail('openapi.json', 'version must match the live API');
  if (!openapi.info?.contact?.email || !openapi.externalDocs?.url) fail('openapi.json', 'must expose contact and developer documentation');
  if (JSON.stringify(openapi.security) !== '[]') fail('openapi.json', 'public API must explicitly declare no authentication');
  for (const legacyPath of ['/api/status', '/api/contact']) {
    if (openapi.paths?.[legacyPath]) fail('openapi.json', `deprecated path ${legacyPath} must not be canonical`);
  }
  const requiredOperations = [
    ['/api/v1/status', 'get', 'getApiStatus'],
    ['/api/v1/contact', 'post', 'sendContactRequest']
  ];
  const operationIds = new Set();
  for (const [apiPath, method, operationId] of requiredOperations) {
    const operation = openapi.paths?.[apiPath]?.[method];
    if (!operation) {
      fail('openapi.json', `missing ${method.toUpperCase()} ${apiPath}`);
      continue;
    }
    if (operation.operationId !== operationId) fail('openapi.json', `${apiPath} must use operationId ${operationId}`);
    if (!operation.description || !operation.summary) fail('openapi.json', `${apiPath} must describe agent-facing behavior`);
    if (operationIds.has(operation.operationId)) fail('openapi.json', `duplicate operationId ${operation.operationId}`);
    operationIds.add(operation.operationId);
    for (const [status, response] of Object.entries(operation.responses || {})) {
      if (!response.description) fail('openapi.json', `${apiPath} response ${status} lacks a description`);
      const content = response.content || {};
      const mediaType = Number(status) >= 400 ? 'application/problem+json' : 'application/json';
      if (!content[mediaType]?.schema) fail('openapi.json', `${apiPath} response ${status} lacks a typed ${mediaType} schema`);
    }
  }
  const problemRequired = openapi.components?.schemas?.Problem?.required || [];
  for (const field of ['type', 'title', 'status', 'detail', 'instance', 'code', 'resolution']) {
    if (!problemRequired.includes(field)) fail('openapi.json', `Problem schema must require ${field}`);
  }
  const contactOperation = openapi.paths?.['/api/v1/contact']?.post;
  const hasIdempotencyKey = (contactOperation?.parameters || []).some((parameter) => parameter.$ref === '#/components/parameters/IdempotencyKey');
  if (!hasIdempotencyKey) fail('openapi.json', 'contact operation must document Idempotency-Key');
  if (!contactOperation?.responses?.['409']?.content?.['application/problem+json']?.schema) fail('openapi.json', 'contact operation must type idempotency conflicts');
  if (!openapi.components?.parameters?.AcceptJson?.schema) fail('openapi.json', 'status operation must expose a typed Accept input');
}

let apiCatalog;
try {
  apiCatalog = JSON.parse(fs.readFileSync(path.join(root, '.well-known/api-catalog'), 'utf8'));
} catch (error) {
  fail('.well-known/api-catalog', `invalid JSON: ${error.message}`);
}
const catalog = apiCatalog?.linkset?.[0];
if (catalog?.anchor !== `${baseUrl}.well-known/api-catalog`) fail('.well-known/api-catalog', 'catalog context anchor is missing');
const catalogItems = (catalog?.item || []).map((item) => item.href);
for (const endpoint of [`${baseUrl}api/v1/status`, `${baseUrl}api/v1/contact`]) {
  if (!catalogItems.includes(endpoint)) fail('.well-known/api-catalog', `item link is missing ${endpoint}`);
}
for (const endpoint of [`${baseUrl}api/v1/status`, `${baseUrl}api/v1/contact`]) {
  const entry = apiCatalog?.linkset?.find((link) => link.anchor === endpoint);
  if (!entry) {
    fail('.well-known/api-catalog', `metadata entry is missing ${endpoint}`);
    continue;
  }
  if (entry['service-desc']?.[0]?.href !== `${baseUrl}openapi.json`) fail('.well-known/api-catalog', `${endpoint} OpenAPI service description is missing`);
  if (entry['service-doc']?.[0]?.href !== `${baseUrl}developers.html`) fail('.well-known/api-catalog', `${endpoint} developer portal service documentation is missing`);
  if (entry.status?.[0]?.href !== `${baseUrl}api/v1/status`) fail('.well-known/api-catalog', `${endpoint} status link is missing`);
}

const indexNowKey = '5f23e6aa9d52af688ddc7c193a83fc3e';
if (fs.readFileSync(path.join(root, `${indexNowKey}.txt`), 'utf8').trim() !== indexNowKey) {
  fail(`${indexNowKey}.txt`, 'IndexNow verification file is invalid');
}

for (const file of ['docs/api.md', 'docs/problems.md']) {
  if (!fs.existsSync(path.join(root, file))) fail(file, 'required public documentation is missing');
}

const globalCss = fs.readFileSync(path.join(root, 'global.css'), 'utf8');
for (const requiredImport of [
  'styles/legacy.css',
  'styles/legacy-components.css',
  'styles/tokens.css',
  'styles/page-inline.css',
  'styles/home.css',
  'styles/editorial.css',
  'styles/components.css',
  'styles/shell.css',
  'styles/theme-contract.css'
]) {
  if (!globalCss.includes(requiredImport)) fail('global.css', `missing layered import ${requiredImport}`);
}

const tokensCss = fs.readFileSync(path.join(root, 'styles/tokens.css'), 'utf8');
for (const token of [
  '--control-bg',
  '--control-fg',
  '--control-primary-bg',
  '--control-primary-fg',
  '--control-accent-bg',
  '--control-accent-fg',
  '--on-accent'
]) {
  if (count(tokensCss, new RegExp(`${token}:`, 'g')) !== 1) {
    fail('styles/tokens.css', `${token} must be a single public alias`);
  }
}
const themeBlock = tokensCss.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1];
const themeTokens = themeBlock ? tokenMap(themeBlock) : {};
for (const token of [
  '--theme-ink',
  '--theme-ink-2',
  '--theme-ink-3',
  '--theme-paper',
  '--theme-paper-2',
  '--theme-paper-3',
  '--theme-surface-1',
  '--theme-surface-2',
  '--theme-surface-accent',
  '--theme-accent',
  '--theme-accent-hover',
  '--theme-accent-light',
  '--theme-highlight',
  '--theme-red',
  '--theme-muted',
  '--theme-border-light',
  '--theme-control-bg',
  '--theme-control-primary-bg',
  '--theme-control-primary-fg',
  '--theme-control-accent-fg',
  '--theme-on-accent'
]) {
  if (!themeTokens[token]) {
    fail('styles/tokens.css', `${token} must define a fixed dark value`);
  }
}
if (!themeBlock) {
  fail('styles/tokens.css', 'missing fixed dark token block');
} else {
  const values = themeTokens;
  for (const [foreground, background, minimum] of [
    ['--control-fg', '--control-bg', 4.5],
    ['--control-primary-fg', '--control-primary-bg', 4.5],
    ['--control-accent-fg', '--control-accent-bg', 4.5],
    ['--on-accent', '--accent', 4.5],
    ['--accent', '--highlight', 4.5],
    ['--red', '--paper', 4.5],
    ['--blue', '--paper', 3]
  ]) {
    const foregroundValue = tokenValue(values, foreground);
    const backgroundValue = tokenValue(values, background);
    if (!foregroundValue || !backgroundValue) {
      fail('styles/tokens.css', `contrast pair ${foreground}/${background} must use hex values`);
      continue;
    }
    const ratio = contrastRatio(foregroundValue, backgroundValue);
    if (ratio < minimum) {
      fail('styles/tokens.css', `${foreground}/${background} contrast ${ratio.toFixed(2)} is below ${minimum}:1`);
    }
  }
}

const componentsCss = fs.readFileSync(path.join(root, 'styles/components.css'), 'utf8');
const shellCss = fs.readFileSync(path.join(root, 'styles/shell.css'), 'utf8');
if (!/:focus-visible\s*\{[^}]*outline:\s*(?:[2-9]|[1-9][0-9]+)px\s+solid/s.test(shellCss)) {
  fail('styles/shell.css', 'shared keyboard focus outline must be at least 2px');
}
const contactModalRule = componentsCss.match(/\.contact-modal\s*\{([\s\S]*?)\}/)?.[1] || '';
for (const declaration of [
  /inset:\s*0/,
  /margin:\s*auto/,
  /pointer-events:\s*auto/,
  /transform:\s*none/
]) {
  if (!declaration.test(contactModalRule)) {
    fail('styles/components.css', `contact modal centering contract missing ${declaration.source}`);
  }
}

for (const stylesheet of activeStylesheets) {
  const css = fs.readFileSync(path.join(root, stylesheet), 'utf8');
  if (/!important/i.test(css)) fail(stylesheet, 'presentation layer must not use !important');
  if (/body:not\(\.font-body\)/.test(css)) fail(stylesheet, 'broad body:not(.font-body) selector is forbidden');
  if (/\[class\*=["'](?:title|label|meta)/.test(css)) fail(stylesheet, 'substring class selectors are forbidden');
  const tinyFont = findTinyFont(css);
  if (tinyFont) fail(stylesheet, `text smaller than the 12px UI floor: ${tinyFont}`);
  if (/transition\s*:[^;}]*\b(?:width|height|max-height)\b/i.test(css)) fail(stylesheet, 'layout-property transitions are forbidden');
  if (/z-index:\s*(?:999|[1-9][0-9]{3,})\b/i.test(css)) fail(stylesheet, 'arbitrary z-index must use the semantic scale');
}

for (const legacyStylesheet of ['styles/legacy.css', 'styles/legacy-components.css']) {
  const css = fs.readFileSync(path.join(root, legacyStylesheet), 'utf8');
  if (/!important/i.test(css)) fail(legacyStylesheet, 'legacy layer must not use !important');
  const tinyFont = findTinyFont(css);
  if (tinyFont) fail(legacyStylesheet, `text smaller than the 12px UI floor: ${tinyFont}`);
  if (/transition\s*:[^;}]*\b(?:width|height|max-height)\b/i.test(css)) fail(legacyStylesheet, 'layout-property transitions are forbidden');
  if (/z-index:\s*(?:999|[1-9][0-9]{3,})\b/i.test(css)) fail(legacyStylesheet, 'arbitrary z-index must use the semantic scale');
}

const globalJs = fs.readFileSync(path.join(root, 'global.js'), 'utf8');
if (!/document\.documentElement\.setAttribute\('data-theme', 'dark'\)/.test(globalJs)) {
  fail('global.js', 'missing fixed dark runtime fallback');
}
if (/window\.NMTheme|themeToggle|data-theme-toggle|localStorage\.getItem\('theme'\)/.test(globalJs)) {
  fail('global.js', 'obsolete theme switching runtime remains');
}
if (!/<dialog class="contact-modal"/.test(globalJs) || !/\.showModal\(\)/.test(globalJs)) {
  fail('global.js', 'contact flow must use a native dialog');
}
if (/navLinks\.innerHTML\s*=|footer\.innerHTML\s*=/.test(globalJs)) {
  fail('global.js', 'Astro navigation and footer must not be overwritten at runtime');
}
if (/injectWorkCTA|work-cta-strip/.test(globalJs)) {
  fail('global.js', 'automatic Work CTA injection is forbidden');
}
if (/Shared SEO \/ GEO structured data|appendSchema\(|document\.createElement\(['"]script['"]\)[\s\S]{0,200}application\/ld\+json/.test(globalJs)) {
  fail('global.js', 'structured data must remain static in source HTML');
}
if (!/document\.modelContext\s*\|\|\s*navigator\.modelContext/.test(globalJs)) {
  fail('global.js', 'WebMCP must prefer document.modelContext with the legacy navigator fallback');
}
for (const route of ['/work.html', '/work-posta.html', '/work-roxom.html', '/ai-media.html', '/speaking.html', '/media-kit.html', '/developers.html', '/contact.html', '/privacy.html']) {
  if (!globalJs.includes(route)) fail('global.js', `shared route context is missing ${route}`);
}
const topBarNormalizer = globalJs.match(/function normalizeTopBar\(\) \{([\s\S]*?)\n  \}/);
if (!topBarNormalizer || /data-open-contact|Work with Diego/.test(topBarNormalizer[1])) {
  fail('global.js', 'top bar must not promote or open the Work modal');
}

const aboutHtml = fs.readFileSync(path.join(root, 'about.html'), 'utf8');
const aboutMarkdown = fs.readFileSync(path.join(root, 'about.md'), 'utf8');
for (const project of siteData.projects || []) {
  if (!project.name || !project.url || !project.description || !project.demonstrates?.length) {
    fail('site-data.json', 'each project needs a name, URL, description, and evidence categories');
    continue;
  }
  if (!aboutHtml.includes(project.url)) fail('about.html', `missing project URL ${project.url}`);
  if (!aboutMarkdown.includes(project.url)) fail('about.md', `missing project URL ${project.url}`);
}
for (const [file, source] of [['about.html', aboutHtml], ['about.md', aboutMarkdown]]) {
  if (!source.includes('https://teleprompter.diegodella.ar/')) {
    fail(file, 'missing telePRO project link');
  }
  if (!source.includes('https://broadcast-planner.diegodella.ar/')) {
    fail(file, 'Broadcast Control Room must use the broadcast-planner URL');
  }
  if (!source.includes('https://lifearg.diegodella.ar/')) {
    fail(file, 'missing Life Match Argentina project link');
  }
  if (!source.includes('https://referi.diegodella.ar/')) {
    fail(file, 'missing Referí project link');
  }
  if (!source.includes('https://presidente.diegodella.ar/')) {
    fail(file, 'missing El Presidente project link');
  }
  if (source.includes('rtvtime.diegodella.ar')) {
    fail(file, 'obsolete rtvtime URL is still present');
  }
}

const deploymentScript = fs.readFileSync(path.join(repository, 'scripts/deploy_release.sh'), 'utf8');
if (!deploymentScript.includes('"$source_root/dist"')) fail('scripts/deploy_release.sh', 'release must publish only the Astro build');
if (!deploymentScript.includes('scripts/sync-discovery.mjs')) fail('scripts/deploy_release.sh', 'release must check generated discovery files');
if (!fs.existsSync(path.join(root, 'docs/api.md'))) fail('docs/api.md', 'public API documentation is missing');

const nginxConfig = fs.readFileSync(path.join(repository, 'infra/nginx/nginx.conf'), 'utf8');
if (!nginxConfig.includes('map $http_x_forwarded_proto $redirect_to_https')) fail('infra/nginx/nginx.conf', 'proxy-aware HTTPS redirect map is missing');
if (!nginxConfig.includes('return 301 https://diegodella.ar$request_uri;')) fail('infra/nginx/nginx.conf', 'canonical HTTPS redirect is missing');
if (!nginxConfig.includes('map $http_accept $markdown_robots_header')) fail('infra/nginx/nginx.conf', 'Markdown noindex response map is missing');
if (!nginxConfig.includes('add_header X-Robots-Tag "noindex, follow" always;')) fail('infra/nginx/nginx.conf', 'direct Markdown responses must be noindex');
if (!nginxConfig.includes('add_header X-Robots-Tag $markdown_robots_header always;')) fail('infra/nginx/nginx.conf', 'negotiated Markdown responses must be noindex');


if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${pages.length} HTML pages: shell, semantics, routes and local assets OK.`);
