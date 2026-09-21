import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { elements, attribute, textContent } from './html.mjs';

const normalize = node => textContent(node).replace(/\s+/g, ' ').trim();
const descendants = node => [node, ...(node.childNodes || []).flatMap(descendants)];
const schemas = nodes => nodes
  .filter(node => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json')
  .flatMap(node => {
    const schema = JSON.parse(node.childNodes.map(child => child.value || '').join(''));
    return schema['@graph'] || [schema];
  });

test('FAQ schema matches each visible question, answer, and link on the three approved pages', () => {
  for (const [page, minimum, maximum] of [['about', 8, 10], ['consulting', 6, 8], ['speaking', 6, 8]]) {
    const nodes = elements(fs.readFileSync(`dist/${page}.html`, 'utf8'));
    const faq = schemas(nodes).filter(node => node['@type'] === 'FAQPage');
    assert.equal(faq.length, 1, page);
    assert.equal(faq[0]['@id'], `https://diegodella.ar/${page}.html#faq`);
    const section = nodes.find(node => attribute(node, 'id') === 'faq');
    assert.ok(section, page);
    const items = descendants(section).filter(node => attribute(node, 'data-faq-item') !== undefined);
    assert.ok(items.length >= minimum && items.length <= maximum, page);
    assert.equal(faq[0].mainEntity.length, items.length, page);
    assert.equal(new Set(faq[0].mainEntity.map(item => item.name)).size, items.length, page);
    items.forEach((item, index) => {
      const children = descendants(item);
      const question = children.find(node => attribute(node, 'data-faq-question') !== undefined);
      const answer = children.find(node => attribute(node, 'data-faq-answer') !== undefined);
      const encoded = faq[0].mainEntity[index];
      assert.equal(question.tagName, 'h3');
      assert.equal(encoded['@type'], 'Question');
      assert.equal(encoded.name, normalize(question));
      assert.equal(encoded.acceptedAnswer['@type'], 'Answer');
      const encodedNodes = elements(`<div>${encoded.acceptedAnswer.text}</div>`);
      assert.equal(normalize(answer), normalize(encodedNodes.find(node => node.tagName === 'div')));
      const hrefs = list => list.filter(node => node.tagName === 'a').map(node => attribute(node, 'href'));
      assert.deepEqual(hrefs(descendants(answer)), hrefs(encodedNodes));
      for (let parent = answer; parent; parent = parent.parentNode) {
        assert.equal(attribute(parent, 'hidden'), undefined);
        assert.notEqual(attribute(parent, 'aria-hidden'), 'true');
        assert.notEqual(parent.tagName, 'template');
      }
    });
  }
});

test('consulting Service uses the visible lede, canonical provider, and approved service areas', () => {
  const nodes = elements(fs.readFileSync('dist/consulting.html', 'utf8'));
  const services = schemas(nodes).filter(node => node['@type'] === 'Service');
  assert.equal(services.length, 1);
  const service = services[0];
  const hero = nodes.find(node => node.tagName === 'header' && attribute(node, 'class')?.includes('nm-page-hero'));
  const lede = descendants(hero).find(node => node.tagName === 'p');
  assert.equal(service.description, normalize(lede));
  assert.ok(service.description.startsWith(service.name));
  assert.equal(service.url, 'https://diegodella.ar/consulting.html');
  assert.equal(service.provider['@id'], 'https://diegodella.ar/#person');
  assert.deepEqual(service.areaServed, ['Argentina', 'Latin America', 'Worldwide (remote)']);
  const visibleAnswers = nodes.filter(node => attribute(node, 'data-faq-answer') !== undefined).map(normalize);
  assert.ok(visibleAnswers.some(answer => /Argentina and Latin America.*remote work available worldwide/.test(answer)));
});
