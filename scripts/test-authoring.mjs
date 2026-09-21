import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'diegodella-authoring-'));
const read = name => fs.readFileSync(path.join(temporary, 'dist', name), 'utf8');
function build() {
  const result = spawnSync(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd: temporary, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stdout + result.stderr);
}
try {
  for (const name of ['src', 'public', 'astro.config.mjs', 'tsconfig.json', 'package.json']) fs.cpSync(path.join(root, name), path.join(temporary, name), { recursive: true });
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temporary, 'node_modules'), 'dir');
  const fixture = path.join(temporary, 'src/content/writing/migration-fixture.mdx');
  fs.writeFileSync(fixture, `---
title: "Migration fixture"
description: "A local publishing verification."
datePublished: "2026-09-14"
dateModified: "2026-09-14"
tags: ["AI"]
---

## A test section

This unpublished fixture checks **Markdown rendering** and publishing.
`);
  build();
  for (const file of ['migration-fixture.html', 'essays.html', 'feed.xml', 'site-data.json']) assert.ok(read(file).includes('Migration fixture'), file);
  assert.ok(read('sitemap.xml').includes('https://diegodella.ar/migration-fixture.html'));
  assert.ok(read('migration-fixture.html').includes('<strong>Markdown rendering</strong>'));
  assert.ok(read('migration-fixture.html').includes('https://diegodella.ar/migration-fixture.html#article'));
  const article = path.join(temporary, 'src/content/writing/thesis.mdx');
  const original = fs.readFileSync(article, 'utf8');
  fs.writeFileSync(article, original.replace('title: "The Continuous Moment of Intent"', 'title: "Revised fixture title"').replace('dateModified: "2026-09-14"', 'dateModified: "2026-09-15"'));
  build();
  for (const file of ['thesis.html', 'essays.html', 'feed.xml', 'site-data.json', 'thesis.md']) assert.ok(read(file).includes('Revised fixture title'), file);
  assert.ok(read('thesis.html').includes('2026-09-15'));
  assert.ok(read('sitemap.xml').includes('<loc>https://diegodella.ar/thesis.html</loc><lastmod>2026-09-15</lastmod>'));
  console.log('Authoring passed: new MDX route, index, feed, catalog, sitemap; edits propagate to HTML, Markdown and dates.');
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}
