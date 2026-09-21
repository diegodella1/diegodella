import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { elements, attribute, textContent } from './html.mjs';

const site = JSON.parse(fs.readFileSync('dist/site-data.json'));
test('published collection, routes, canonical metadata and feed agree', () => {
  const feed = fs.readFileSync('dist/feed.xml', 'utf8');
  for (const article of site.writing) {
    const nodes = elements(fs.readFileSync(`dist/${article.slug}.html`, 'utf8'));
    const schema = nodes.filter(node => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json').flatMap(node => {
      const data = JSON.parse(node.childNodes[0].value);
      return data['@graph'] || [data];
    }).find(node => node['@type'] === 'Article');
    assert.equal(schema.headline, article.title);
    assert.equal(schema.description, article.description);
    assert.equal(schema.datePublished, article.datePublished);
    assert.equal(schema.dateModified, article.dateModified);
    assert.equal(schema.url, article.url);
    assert.ok(feed.includes(article.url));
    assert.equal(site.pages[`${article.slug}.html`].dateModified, article.dateModified);
  }
});

test('Nuggets, filters and structured data derive from the same entries', () => {
  const data = JSON.parse(fs.readFileSync('src/data/nuggets.json'));
  const nodes = elements(fs.readFileSync('dist/nuggets.html', 'utf8'));
  const cards = nodes.filter(node => attribute(node, 'class')?.split(' ').includes('nugget-card'));
  assert.equal(cards.length, data.length);
  const schemaNode = nodes.find(node => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json');
  const schema = JSON.parse(schemaNode.childNodes[0].value);
  assert.equal(schema.mainEntity.numberOfItems, data.length);
  assert.equal(schema.mainEntity.itemListElement.length, data.length);
  for (const button of nodes.filter(node => attribute(node, 'data-filter'))) {
    const source = attribute(button, 'data-filter');
    const expected = data.filter(item => source === 'all' || item.source === source).length;
    assert.equal(Number(textContent(button).trim().match(/\d+$/)[0]), expected);
  }
});

test('release contains public outputs and excludes source, audits and credentials', () => {
  const forbidden = ['README.md', 'DESIGN.md', 'package.json', 'package-lock.json', 'src', 'content', '.editorial', '.migration', '.env', 'scripts', 'services', 'infra', 'docs/ai-writing-audit-2026-09-14.md'];
  for (const path of forbidden) assert.ok(!fs.existsSync(`dist/${path}`), path);
  for (const file of Object.keys(site.pages)) assert.ok(fs.existsSync(`dist/${file}`), file);
});
