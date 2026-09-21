import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { snapshot, elements, attribute } from './html.mjs';
const baseline = JSON.parse(fs.readFileSync('tests/fixtures/migration.json'));
// Disclosure IDs now render on the server; the existing public n1…n86
// fragment URLs were previously assigned by JavaScript after page load.
baseline['nuggets.html'].ids.push(...Array.from({ length: 86 }, (_, index) => [
  `n${index + 1}`, `n${index + 1}-detail`
]).flat());
baseline['nuggets.html'].ids.sort();
// Approved SEO copy/metadata edits only; other migration expectations stay fixed.
Object.assign(baseline, JSON.parse(fs.readFileSync('tests/fixtures/seo-2026-09-14.json')));
// Shared navigation/footer and the approved ideas-first homepage are redesigned.
// Interior prose and canonical preservation are independently tested in design.test.mjs.
Object.assign(baseline, JSON.parse(fs.readFileSync('tests/fixtures/neon-design.json')));
// Apply only recorded field edits, checking each against the frozen prior release.
const editorial=JSON.parse(fs.readFileSync('tests/fixtures/editorial-deltas.json'));
for(const [page,changes] of Object.entries(editorial)) {
 for(const [field,change] of Object.entries(changes)) {
  assert.deepEqual(baseline[page][field],change.before,`${page}: ${field} edit baseline`);
  baseline[page][field]=change.after;
 }
}
for (const [page, expected] of Object.entries(baseline)) {
  test(`${page}: text, URLs, anchors, dates and metadata survive migration`, () => {
    assert.deepEqual(snapshot(fs.readFileSync(`dist/${page}`, 'utf8')), expected);
  });
}
test('Nuggets have one data source', () => {
  const data = JSON.parse(fs.readFileSync('src/data/nuggets.json'));
  const nodes = elements(fs.readFileSync('dist/nuggets.html', 'utf8'));
  const cards = nodes.filter(node => attribute(node, 'class')?.split(' ').includes('nugget-card'));
  assert.equal(cards.length, data.length);
  assert.equal(cards.length, 86);
});
test('private source files are excluded from the release', () => {
  for (const path of ['README.md', 'DESIGN.md', 'package.json', 'src', 'content', '.editorial', '.migration', 'docs/ai-writing-audit-2026-09-14.md']) {
    assert.ok(!fs.existsSync(`dist/${path}`), path);
  }
});
