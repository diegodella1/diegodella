import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { attribute, elements } from './html.mjs';

test('previous CSS URLs remain usable without duplicate source styles', () => {
  const styles = 'dist/page-styles';
  let wrappers = 0;
  for (const name of fs.readdirSync(styles)) {
    const source = fs.readFileSync(path.join(styles, name), 'utf8');
    if (!source.startsWith('/* Compatibility URL')) continue;
    const target = source.match(/@import url\("([^"]+)"\)/)?.[1];
    assert.ok(target, name);
    const canonical = fs.readFileSync(path.join(styles, target), 'utf8');
    assert.ok(canonical.includes('@layer page'), target);
    assert.ok(!canonical.startsWith('/* Compatibility URL'), 'Compatibility imports must not form a chain');
    wrappers++;
  }
  assert.equal(wrappers, 6);
  for (const name of fs.readdirSync('dist').filter(name => name.endsWith('.html'))) {
    const nodes = elements(fs.readFileSync(`dist/${name}`, 'utf8'));
    assert.ok(!nodes.some(node => node.tagName === 'link' && attribute(node, 'href')?.startsWith('components.css')), name);
  }
  assert.ok(fs.existsSync('dist/components.css'), 'Cached HTML retains its compatibility URL');
});

test('shared diagrams have no byte-identical duplicate components', () => {
  const digests = new Set();
  for (const name of fs.readdirSync('src/components/diagrams')) {
    const digest = createHash('sha256').update(fs.readFileSync(`src/components/diagrams/${name}`)).digest('hex');
    assert.ok(!digests.has(digest), name);
    digests.add(digest);
  }
});

test('archives are excluded from the distributed site', () => {
  for (const name of ['.archive', '.migration', '.editorial', 'BTC.mp4', 'Connor.mp4', 'Nolan.mp4', 'Hank1.mp4', 'Walker1.mp4', 'WalkerHank.mp4', 'gemgem.mp4']) {
    assert.ok(!fs.existsSync(`dist/${name}`), name);
  }
});
