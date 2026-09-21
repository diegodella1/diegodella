import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { elements, attribute } from './html.mjs';
const source = fs.readFileSync('public/analytics.js', 'utf8');
function boot(url) {
  const scripts = [];
  const window = { location: new URL(url) };
  const context = vm.createContext({ window, URL, document: {
    referrer: 'https://search.example/results?q=private#secret',
    createElement: () => ({}), head: { appendChild: script => scripts.push(script) }
  } });
  vm.runInContext(source, context);
  return { window, scripts, context };
}
test('all rendered pages use one deferred analytics entrypoint and no legacy GA snippet', () => {
  const pages = fs.readdirSync('dist').filter(name => name.endsWith('.html'));
  const site = JSON.parse(fs.readFileSync('dist/site-data.json', 'utf8'));
  assert.deepEqual(pages.sort(), Object.keys(site.pages).sort());
  for (const page of pages) {
    const html = fs.readFileSync(`dist/${page}`, 'utf8');
    const scripts = elements(html).filter(node => node.tagName === 'script');
    const entries = scripts.filter(node => attribute(node, 'src') === '/analytics.js');
    assert.equal(entries.length, 1, page);
    assert.equal(attribute(entries[0], 'defer'), '', page);
    assert.ok(!html.includes('googletagmanager.com'), page);
    assert.ok(!html.includes("gtag('config'"), page);
  }
});
test('production loads GA once, asynchronously, without URL query or fragment data', () => {
  const { window, scripts, context } = boot('https://diegodella.ar/contact.html?email=private#message');
  vm.runInContext(source, context);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].async, true);
  assert.equal(scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TJF4P0NYFT');
  assert.equal(window.dataLayer[1][2].page_location, 'https://diegodella.ar/contact.html');
  assert.equal(window.dataLayer[1][2].page_referrer, 'https://search.example/results');
  window.trackContactSuccess('conversation');
  window.trackContactSuccess('updates');
  window.trackContactSuccess('untrusted');
  const events = Array.from(window.dataLayer).slice(2).map(args => Array.from(args));
  assert.deepEqual(events.map(args => args[1]), ['generate_lead', 'updates_request_success']);
  for (const event of events) assert.deepEqual(Object.keys(event[2]).sort(), ['contact_mode', 'page_location', 'page_path']);
  assert.ok(!JSON.stringify(window.dataLayer).includes('private'));
});
test('preview and noncanonical hosts do not initialize or load GA', () => {
  for (const url of ['http://localhost:4321/', 'http://127.0.0.1:4173/', 'file:///tmp/dist/index.html', 'https://preview.diegodella.ar/', 'http://diegodella.ar/', 'https://diegodella.ar.evil.example/']) {
    const { window, scripts } = boot(url);
    assert.equal(scripts.length, 0, url);
    assert.equal(window.gtag, undefined, url);
  }
});
test('article section labels are real headings', () => {
  for (const slug of ['before-you-delegate', 'occlusion-bias', 'origin-gravity', 'the-empty-room', 'the-last-human-impression', 'the-proxy-self', 'the-trust-collapse', 'writing-for-the-filter']) {
    const labels = elements(fs.readFileSync(`dist/${slug}.html`, 'utf8')).filter(node => attribute(node, 'class')?.split(' ').includes('section-title'));
    assert.ok(labels.length >= 4, slug);
    assert.ok(labels.every(node => node.tagName === 'h2'), slug);
  }
});
test('crawler policy separates discovery from training', () => {
  const robots = fs.readFileSync('public/robots.txt', 'utf8');
  const groups = robots.split(/\n\s*\n/);
  for (const token of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'ChatGPT-User', 'Claude-User', 'Perplexity-User']) {
    const group = groups.find(group => group.split('\n').includes(`User-agent: ${token}`));
    assert.ok(group?.includes('Allow: /'), token);
    assert.ok(!group.split('\n').includes('Disallow: /'), token);
  }
  for (const token of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'Applebot-Extended', 'Bytespider']) {
    const group = groups.find(group => group.split('\n').includes(`User-agent: ${token}`));
    assert.ok(group?.split('\n').includes('Disallow: /'), token);
  }
});
