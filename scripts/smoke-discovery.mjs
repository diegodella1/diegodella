#!/usr/bin/env node

const baseUrl = process.env.SITE_BASE_URL || 'http://127.0.0.1:3080';
import { elements, attribute } from '../tests/html.mjs';

const canonicalBase = 'https://diegodella.ar/';
const failures = [];
const perimeterFindings = [];
let checks = 0;

const routes = [
  ['/', canonicalBase],
  ['/about', `${canonicalBase}about.html`],
  ['/work', `${canonicalBase}work.html`],
  ['/work-posta', `${canonicalBase}work-posta.html`],
  ['/work-roxom', `${canonicalBase}work-roxom.html`],
  ['/ai-media', `${canonicalBase}ai-media.html`],
  ['/essays', `${canonicalBase}essays.html`],
  ['/speaking', `${canonicalBase}speaking.html`],
  ['/consulting', `${canonicalBase}consulting.html`],
  ['/media-kit', `${canonicalBase}media-kit.html`],
  ['/developers', `${canonicalBase}developers.html`],
  ['/contact', `${canonicalBase}contact.html`],
  ['/privacy', `${canonicalBase}privacy.html`]
];

const discoveryUserAgents = [
  ['Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +https://www.google.com/bot.html)'],
  ['Bingbot', 'Mozilla/5.0 (compatible; bingbot/2.0; +https://www.bing.com/bingbot.htm)'],
  ['ChatGPT-User', 'Mozilla/5.0 AppleWebKit/537.36; compatible; ChatGPT-User/1.0; +https://openai.com/bot'],
  ['OAI-SearchBot', 'Mozilla/5.0 AppleWebKit/537.36; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot'],
  ['Claude-SearchBot', 'Claude-SearchBot/1.0; +https://anthropic.com'],
  ['Claude-User', 'Claude-User/1.0; +https://anthropic.com'],
  ['PerplexityBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot'],
  ['Perplexity-User', 'Perplexity-User/1.0; +https://perplexity.ai']
];

const machineFiles = [
  ['/sitemap.xml', 'application/xml'],
  ['/feed.xml', 'application/rss+xml'],
  ['/robots.txt', 'text/plain'],
  ['/llms.txt', 'text/plain'],
  ['/site-data.json', 'application/json'],
  ['/openapi.json', 'application/openapi+json'],
  ['/.well-known/api-catalog', 'application/linkset+json'],
  ['/.well-known/ai-catalog.json', 'application/json'],
  ['/.well-known/mcp/server-card.json', 'application/json'],
  ['/.well-known/agent-skills/index.json', 'application/json'],
  ['/.well-known/agent-skills/navigation/SKILL.md', 'text/markdown'],
  ['/index.md', 'text/markdown'],
  ['/404.md', 'text/markdown'],
  ['/developers.md', 'text/markdown'],
  ['/contact.md', 'text/markdown'],
  ['/privacy.md', 'text/markdown'],
  ['/auth.md', 'text/markdown'],
  ['/docs/api.md', 'text/markdown'],
  ['/docs/problems.md', 'text/markdown'],
  ['/docs/llms.txt', 'text/plain']
];

function fail(subject, message) {
  failures.push(`${subject}: ${message}`);
}

function verify(condition, subject, message) {
  checks += 1;
  if (!condition) fail(subject, message);
}

function headerTokens(response, name) {
  return (response.headers.get(name) || '')
    .toLowerCase()
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

async function request(pathname, options = {}) {
  try {
    return await fetch(new URL(pathname, baseUrl), {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      ...options
    });
  } catch (error) {
    fail(pathname, `request failed: ${error.message}`);
    return null;
  }
}

async function responseText(response) {
  if (!response) return '';
  try {
    return await response.text();
  } catch (error) {
    fail(response.url, `body read failed: ${error.message}`);
    return '';
  }
}

async function responseJson(response, subject) {
  const text = await responseText(response);
  try {
    return JSON.parse(text);
  } catch (error) {
    fail(subject, `invalid JSON: ${error.message}`);
    return null;
  }
}

function verifyVary(response, subject) {
  const vary = headerTokens(response, 'vary');
  verify(vary.includes('accept'), subject, `Vary must include Accept; received ${response.headers.get('vary') || 'none'}`);
  verify(vary.includes('accept-encoding'), subject, `Vary must include Accept-Encoding; received ${response.headers.get('vary') || 'none'}`);
}

function verifyNoindex(response, subject) {
  const robots = (response.headers.get('x-robots-tag') || '').toLowerCase();
  verify(robots.includes('noindex'), subject, `Markdown must send X-Robots-Tag: noindex; received ${robots || 'none'}`);
}

for (const [pathname, canonical] of routes) {
  const response = await request(pathname, { headers: { Accept: 'text/html' } });
  if (!response) continue;
  const html = await responseText(response);
  verify(response.status === 200, pathname, `expected 200, received ${response.status}`);
  verify(response.headers.get('content-type')?.startsWith('text/html'), pathname, `expected text/html, received ${response.headers.get('content-type')}`);
  verify(/<title>[^<]+<\/title>/i.test(html), pathname, 'rendered HTML has no title');
  verify(elements(html).some(node => node.tagName === 'link' && attribute(node, 'rel') === 'canonical' && attribute(node, 'href') === canonical), pathname, `rendered canonical is not ${canonical}`);
  verify(elements(html).some(node => node.tagName === 'meta' && attribute(node, 'property') === 'og:url' && attribute(node, 'content') === canonical), pathname, 'rendered Open Graph URL differs from canonical');
  verify(html.includes('<link rel="alternate" type="application/rss+xml"'), pathname, 'rendered HTML has no RSS discovery link');
  const schemas = [...html.matchAll(/<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi)];
  verify(schemas.length > 0, pathname, 'rendered HTML has no JSON-LD');
  for (const schema of schemas) {
    try {
      JSON.parse(schema[1]);
      checks += 1;
    } catch (error) {
      fail(pathname, `rendered JSON-LD is invalid: ${error.message}`);
    }
  }
}

for (const [pathname, targetPath] of [
  ['/writing', '/essays.html'],
  ['/work/posta', '/work-posta.html'],
  ['/work/roxom', '/work-roxom.html']
]) {
  const response = await request(pathname, { redirect: 'manual' });
  if (!response) continue;
  verify(response.status === 301, pathname, `expected 301, received ${response.status}`);
  const location = response.headers.get('location');
  verify(Boolean(location) && new URL(location, baseUrl).pathname === targetPath, pathname, `unexpected redirect target ${location}`);
}

for (const [pathname, expectedType] of machineFiles) {
  const response = await request(pathname);
  if (!response) continue;
  const body = await responseText(response);
  verify(response.status === 200, pathname, `expected 200, received ${response.status}`);
  verify(response.headers.get('content-type')?.startsWith(expectedType), pathname, `expected ${expectedType}, received ${response.headers.get('content-type')}`);
  verify(body.trim().length > 0, pathname, 'response body is empty');
  if (expectedType === 'text/markdown' && !pathname.startsWith('/.well-known/')) {
    verifyNoindex(response, pathname);
  }
  if (expectedType === 'application/json' || expectedType === 'application/linkset+json') {
    try {
      JSON.parse(body);
      checks += 1;
    } catch (error) {
      fail(pathname, `invalid JSON: ${error.message}`);
    }
  }
}

const htmlRepresentation = await request('/', { headers: { Accept: 'text/html' } });
if (htmlRepresentation) {
  verify(htmlRepresentation.status === 200, 'HTML negotiation', `expected 200, received ${htmlRepresentation.status}`);
  verify(htmlRepresentation.headers.get('content-type')?.startsWith('text/html'), 'HTML negotiation', `unexpected Content-Type ${htmlRepresentation.headers.get('content-type')}`);
  verifyVary(htmlRepresentation, 'HTML negotiation');
  verify((htmlRepresentation.headers.get('link') || '').includes('rel="ai-catalog"'), 'HTML negotiation', 'ARD ai-catalog Link relation is missing');
}

const markdownRepresentation = await request('/', { headers: { Accept: 'text/markdown' } });
if (markdownRepresentation) {
  const markdown = await responseText(markdownRepresentation);
  verify(markdownRepresentation.status === 200, 'Markdown negotiation', `expected 200, received ${markdownRepresentation.status}`);
  verify(markdownRepresentation.headers.get('content-type')?.startsWith('text/markdown'), 'Markdown negotiation', `unexpected Content-Type ${markdownRepresentation.headers.get('content-type')}`);
  verify(markdown.startsWith('---\n') && markdown.includes("# Diego Dell'Agostino"), 'Markdown negotiation', 'homepage Markdown representation is unexpected');
  for (const field of ['title:', 'description:', 'canonical:', 'last-updated:']) {
    verify(markdown.includes(field), 'Markdown negotiation', `frontmatter field ${field} is missing`);
  }
  verifyVary(markdownRepresentation, 'Markdown negotiation');
  verifyNoindex(markdownRepresentation, 'Markdown negotiation');
}

for (const [accept, expectedType, expectedText] of [
  ['text/html', 'text/html', '<title>Developers — DiegoDella</title>'],
  ['text/markdown', 'text/markdown', '# DiegoDella developer portal']
]) {
  const response = await request('/developers', { headers: { Accept: accept } });
  if (!response) continue;
  const body = await responseText(response);
  verify(response.status === 200, `/developers ${accept}`, `expected 200, received ${response.status}`);
  verify(response.headers.get('content-type')?.startsWith(expectedType), `/developers ${accept}`, `unexpected Content-Type ${response.headers.get('content-type')}`);
  verify(body.includes(expectedText), `/developers ${accept}`, 'wrong negotiated representation');
  verifyVary(response, `/developers ${accept}`);
  if (accept === 'text/markdown') verifyNoindex(response, `/developers ${accept}`);
}

const missingPath = `/agent-readiness-missing-${Date.now()}`;
const missingHtml = await request(missingPath, { headers: { Accept: 'text/html' } });
if (missingHtml) {
  const body = await responseText(missingHtml);
  verify(missingHtml.status === 404, 'HTML 404', `expected 404, received ${missingHtml.status}`);
  verify(missingHtml.headers.get('content-type')?.startsWith('text/html'), 'HTML 404', `unexpected Content-Type ${missingHtml.headers.get('content-type')}`);
  verify(body.includes('404: Page not found'), 'HTML 404', 'recovery page body is missing');
  for (const target of ['sitemap.xml', 'llms.txt', 'developers.html']) {
    verify(body.includes(target), 'HTML 404', `missing recovery target ${target}`);
  }
  verifyVary(missingHtml, 'HTML 404');
}

const missingMarkdown = await request(missingPath, { headers: { Accept: 'text/markdown' } });
if (missingMarkdown) {
  const body = await responseText(missingMarkdown);
  verify(missingMarkdown.status === 404, 'Markdown 404', `expected 404, received ${missingMarkdown.status}`);
  verify(missingMarkdown.headers.get('content-type')?.startsWith('text/markdown'), 'Markdown 404', `unexpected Content-Type ${missingMarkdown.headers.get('content-type')}`);
  for (const target of ['sitemap.xml', 'llms.txt', 'developers.html']) {
    verify(body.includes(target), 'Markdown 404', `missing recovery target ${target}`);
  }
  verifyVary(missingMarkdown, 'Markdown 404');
  verifyNoindex(missingMarkdown, 'Markdown 404');
}

const sitemapResponse = await request('/sitemap.xml');
const sitemap = await responseText(sitemapResponse);
for (const [, canonical] of routes) {
  verify(sitemap.includes(`<loc>${canonical}</loc>`), '/sitemap.xml', `missing ${canonical}`);
}
verify((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length > 0, '/sitemap.xml', 'no maintained lastmod dates are present');

const feedResponse = await request('/feed.xml');
const feed = await responseText(feedResponse);
verify(feed.includes('<rss version="2.0"'), '/feed.xml', 'missing RSS 2.0 root');

const apiCatalogHead = await request('/.well-known/api-catalog', { method: 'HEAD' });
if (apiCatalogHead) {
  verify(apiCatalogHead.status === 200, 'API catalog HEAD', `expected 200, received ${apiCatalogHead.status}`);
  const catalogType = apiCatalogHead.headers.get('content-type') || '';
  verify(catalogType.startsWith('application/linkset+json'), 'API catalog HEAD', `unexpected Content-Type ${catalogType}`);
  verify(catalogType.includes('profile="https://www.rfc-editor.org/info/rfc9727"'), 'API catalog HEAD', 'RFC 9727 profile is missing');
  verify((apiCatalogHead.headers.get('link') || '').includes('rel="api-catalog"'), 'API catalog HEAD', 'api-catalog Link relation is missing');
}

function robotsGroups(source) {
  const groups = [];
  let agents = [];
  let directives = [];
  function flush() {
    if (agents.length) groups.push({ agents, directives });
    agents = [];
    directives = [];
  }
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) {
      if (directives.length) flush();
      continue;
    }
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const name = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (name === 'user-agent') {
      if (directives.length) flush();
      agents.push(value.toLowerCase());
    } else if (agents.length) {
      directives.push([name, value]);
    }
  }
  flush();
  return groups;
}

const robotsResponse = await request('/robots.txt');
const robots = await responseText(robotsResponse);
verify(robots.includes(`Sitemap: ${canonicalBase}sitemap.xml`), '/robots.txt', 'missing canonical sitemap declaration');
verify(robots.includes(`Agentmap: ${canonicalBase}.well-known/ai-catalog.json`), '/robots.txt', 'missing ARD Agentmap declaration');
const parsedRobots = robotsGroups(robots);
for (const [token] of discoveryUserAgents) {
  const matching = parsedRobots.filter((group) => group.agents.includes(token.toLowerCase()));
  const applicable = matching.length ? matching : parsedRobots.filter((group) => group.agents.includes('*'));
  verify(applicable.length > 0, '/robots.txt', `no policy applies to ${token}`);
  verify(!applicable.some((group) => group.directives.some(([name, value]) => name === 'disallow' && value === '/')), '/robots.txt', `${token} is disallowed from the site root`);
}

for (const [token, userAgent] of discoveryUserAgents) {
  const response = await request('/', {
    headers: {
      Accept: 'text/html',
      'User-Agent': userAgent
    }
  });
  if (!response) continue;
  const body = await responseText(response);
  if ([403, 429].includes(response.status) && response.headers.has('cf-ray')) {
    perimeterFindings.push({ agent: token, status: response.status, ray: response.headers.get('cf-ray'), identity: 'simulated, not verified' });
    continue;
  }
  verify(response.status === 200, `crawler ${token}`, `expected 200, received ${response.status}`);
  verify(body.includes("Diego Dell'Agostino"), `crawler ${token}`, 'homepage content was not returned');
}

const aiCatalogResponse = await request('/.well-known/ai-catalog.json');
const aiCatalog = await responseJson(aiCatalogResponse, 'ARD catalog');
if (aiCatalogResponse && aiCatalog) {
  verify(aiCatalogResponse.status === 200, 'ARD catalog', `expected 200, received ${aiCatalogResponse.status}`);
  verify(aiCatalog.specVersion === '1.0', 'ARD catalog', 'specVersion is not 1.0');
  const publicApi = (aiCatalog.entries || []).find((entry) => entry.identifier === 'urn:air:diegodella.ar:api:public-v1');
  verify(publicApi?.url === `${canonicalBase}openapi.json`, 'ARD catalog', 'public API resource is missing');
  verify((publicApi?.representativeQueries || []).length >= 2, 'ARD catalog', 'representative queries are incomplete');
  verify(publicApi?.trustManifest?.identity === canonicalBase && publicApi?.trustManifest?.identityType === 'https', 'ARD catalog', 'HTTPS publisher trust binding is missing');
}

const authenticationResponse = await request('/auth.md');
const authentication = await responseText(authenticationResponse);
if (authenticationResponse) {
  verify(authenticationResponse.status === 200, '/auth.md contract', `expected 200, received ${authenticationResponse.status}`);
  verify(authenticationResponse.headers.get('content-type')?.startsWith('text/markdown'), '/auth.md contract', `unexpected Content-Type ${authenticationResponse.headers.get('content-type')}`);
  for (const required of ['# API authentication', 'does not use authentication', 'security: []', 'Idempotency-Key', 'application/problem+json']) {
    verify(authentication.includes(required), '/auth.md contract', `missing ${required}`);
  }
}

const statusResponse = await request('/api/v1/status', { headers: { Accept: 'application/json' } });
if (statusResponse) {
  const status = await responseJson(statusResponse, '/api/v1/status');
  verify(statusResponse.status === 200, '/api/v1/status', `expected 200, received ${statusResponse.status}`);
  verify(statusResponse.headers.get('content-type')?.startsWith('application/json'), '/api/v1/status', `unexpected Content-Type ${statusResponse.headers.get('content-type')}`);
  verify(status?.ok === true && status?.version === '1.2.0', '/api/v1/status', 'status payload has wrong health or version');
  verify(status?.endpoints?.includes('/api/v1/contact'), '/api/v1/status', 'canonical contact endpoint is missing');
  verify(Boolean(statusResponse.headers.get('ratelimit-policy')), '/api/v1/status', 'RateLimit-Policy is missing');
  verify(Boolean(statusResponse.headers.get('ratelimit')), '/api/v1/status', 'RateLimit is missing');
  verify(statusResponse.headers.get('access-control-allow-origin') === '*', '/api/v1/status', 'CORS allow-origin is missing');
  verify((statusResponse.headers.get('access-control-allow-headers') || '').includes('Idempotency-Key'), '/api/v1/status', 'CORS does not allow Idempotency-Key');
}

const unknownApi = await request('/api/v1/does-not-exist', { headers: { Accept: 'application/json' } });
if (unknownApi) {
  const problem = await responseJson(unknownApi, 'API 404');
  verify(unknownApi.status === 404, 'API 404', `expected 404, received ${unknownApi.status}`);
  verify(unknownApi.headers.get('content-type')?.startsWith('application/problem+json'), 'API 404', `unexpected Content-Type ${unknownApi.headers.get('content-type')}`);
  for (const field of ['type', 'title', 'status', 'detail', 'instance', 'code', 'resolution']) {
    verify(problem?.[field] !== undefined, 'API 404', `problem field ${field} is missing`);
  }
  verify(problem?.status === 404 && problem?.code === 'not_found', 'API 404', 'problem status or code is wrong');
}

const invalidContact = await request('/api/v1/contact', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: '{}'
});
if (invalidContact) {
  const problem = await responseJson(invalidContact, 'API validation');
  verify(invalidContact.status === 400, 'API validation', `expected 400, received ${invalidContact.status}`);
  verify(invalidContact.headers.get('content-type')?.startsWith('application/problem+json'), 'API validation', `unexpected Content-Type ${invalidContact.headers.get('content-type')}`);
  verify(problem?.code === 'invalid_email' && Boolean(problem?.resolution), 'API validation', 'typed validation error is incomplete');
}

const wrongMethod = await request('/api/v1/contact', { method: 'GET', headers: { Accept: 'application/json' } });
if (wrongMethod) {
  const problem = await responseJson(wrongMethod, 'API 405');
  verify(wrongMethod.status === 405, 'API 405', `expected 405, received ${wrongMethod.status}`);
  verify(wrongMethod.headers.get('content-type')?.startsWith('application/problem+json'), 'API 405', `unexpected Content-Type ${wrongMethod.headers.get('content-type')}`);
  verify(problem?.code === 'method_not_allowed', 'API 405', 'typed method error is incomplete');
  verify((wrongMethod.headers.get('allow') || '').includes('POST'), 'API 405', 'Allow header does not include POST');
}

const legacyStatus = await request('/api/status', { headers: { Accept: 'application/json' } });
if (legacyStatus) {
  await responseText(legacyStatus);
  verify(legacyStatus.status === 200, '/api/status', `expected compatibility 200, received ${legacyStatus.status}`);
  verify(/^@\d+$/.test(legacyStatus.headers.get('deprecation') || ''), '/api/status', 'structured Deprecation date is missing');
  verify((legacyStatus.headers.get('link') || '').includes('rel="deprecation"'), '/api/status', 'deprecation Link relation is missing');
}

const contactOptions = await request('/api/v1/contact', {
  method: 'OPTIONS',
  headers: {
    Origin: canonicalBase,
    'Access-Control-Request-Method': 'POST'
  }
});
if (contactOptions) {
  await responseText(contactOptions);
  verify(contactOptions.status === 204, 'API OPTIONS', `expected 204, received ${contactOptions.status}`);
  verify((contactOptions.headers.get('access-control-allow-methods') || '').includes('POST'), 'API OPTIONS', 'CORS methods do not include POST');
}

const openapiResponse = await request('/openapi.json');
const openapi = await responseJson(openapiResponse, '/openapi.json contract');
if (openapi) {
  verify(String(openapi.openapi).startsWith('3.1.'), '/openapi.json contract', 'OpenAPI version is not 3.1');
  for (const [path, method, operationId] of [
    ['/api/v1/status', 'get', 'getApiStatus'],
    ['/api/v1/contact', 'post', 'sendContactRequest']
  ]) {
    const operation = openapi.paths?.[path]?.[method];
    verify(operation?.operationId === operationId, '/openapi.json contract', `missing ${method.toUpperCase()} ${path} operationId ${operationId}`);
    for (const [code, response] of Object.entries(operation?.responses || {})) {
      const mediaType = Number(code) >= 400 ? 'application/problem+json' : 'application/json';
      verify(Boolean(response.content?.[mediaType]?.schema), '/openapi.json contract', `${method.toUpperCase()} ${path} response ${code} lacks ${mediaType} schema`);
    }
  }
  const contactOperation = openapi.paths?.['/api/v1/contact']?.post;
  verify((contactOperation?.parameters || []).some((parameter) => parameter.$ref === '#/components/parameters/IdempotencyKey'), '/openapi.json contract', 'contact Idempotency-Key parameter is missing');
  verify(Boolean(contactOperation?.responses?.['409']?.content?.['application/problem+json']?.schema), '/openapi.json contract', 'typed contact 409 response is missing');
  verify(Boolean(openapi.components?.parameters?.AcceptJson?.schema), '/openapi.json contract', 'typed status Accept input is missing');
}

if (perimeterFindings.length) {
  console.error('PERIMETER: simulated user-agent requests blocked; verify authenticated crawler identity and matched rules in Cloudflare events.');
  console.error(JSON.stringify(perimeterFindings, null, 2));
}
if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`Runtime agent-readiness smoke failed: ${failures.length} failure(s), ${checks} assertions at ${baseUrl}.`);
  process.exit(1);
}

if (perimeterFindings.length) {
  console.error(`Site checks passed (${checks} assertions), but ${perimeterFindings.length} perimeter findings remain unverified. Exit 2; not a full discovery pass.`);
  process.exit(2);
}
console.log(`Runtime agent-readiness smoke passed: ${checks} assertions across ${routes.length} public pages, ${machineFiles.length} machine files, ${discoveryUserAgents.length} search and retrieval user-agents, negotiated 404s, and API contracts at ${baseUrl}.`);
