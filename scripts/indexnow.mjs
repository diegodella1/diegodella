#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteData = JSON.parse(fs.readFileSync(path.join(root, 'dist/site-data.json'), 'utf8'));
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const key = '5f23e6aa9d52af688ddc7c193a83fc3e';
const keyFile = `${key}.txt`;
const keyPath = path.join(root, keyFile);
const args = process.argv.slice(2);
const shouldSubmit = args.includes('--submit');
const useAll = args.includes('--all');
const help = args.includes('--help') || args.includes('-h');
const rawUrls = args.filter((argument) => !argument.startsWith('--'));

if (help || (!useAll && rawUrls.length === 0)) {
  console.log(`Usage:
  node scripts/indexnow.mjs --all
  node scripts/indexnow.mjs /about.html /work.html
  node scripts/indexnow.mjs --submit --all

The command is a dry run unless --submit is present. Only canonical URLs in
sitemap.xml are accepted.`);
  process.exit(help ? 0 : 1);
}

if (!fs.existsSync(keyPath) || fs.readFileSync(keyPath, 'utf8').trim() !== key) {
  throw new Error(`IndexNow verification file ${keyFile} is missing or invalid.`);
}

const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
const requested = useAll ? [...sitemapUrls] : rawUrls.map((value) => new URL(value, siteData.site.url).href);
const urlList = [...new Set(requested)];

for (const value of urlList) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== new URL(siteData.site.url).hostname) {
    throw new Error(`Refusing non-site URL: ${value}`);
  }
  if (!sitemapUrls.has(value)) {
    throw new Error(`Refusing URL absent from sitemap.xml: ${value}`);
  }
}

if (urlList.length > 10_000) throw new Error('IndexNow accepts at most 10,000 URLs per request.');

const payload = {
  host: new URL(siteData.site.url).hostname,
  key,
  keyLocation: new URL(keyFile, siteData.site.url).href,
  urlList
};

if (!shouldSubmit) {
  console.log(JSON.stringify({ mode: 'dry-run', ...payload }, null, 2));
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload)
});

const responseBody = await response.text();
if (!response.ok) {
  throw new Error(`IndexNow returned ${response.status}: ${responseBody || response.statusText}`);
}

console.log(`Submitted ${urlList.length} canonical URL${urlList.length === 1 ? '' : 's'} to IndexNow (${response.status}).`);
