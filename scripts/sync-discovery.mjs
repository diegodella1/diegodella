#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { discoveryFiles } from '../src/lib/discovery.mjs';
const root = path.resolve(import.meta.dirname, '../dist');
const site = JSON.parse(fs.readFileSync(path.join(root, 'site-data.json'), 'utf8'));
for (const [file, expected] of Object.entries(discoveryFiles(site))) {
  if (fs.readFileSync(path.join(root, file), 'utf8') !== expected) throw new Error(`Out of sync: ${file}. Run npm run build.`);
}
console.log('Generated discovery files are in sync.');
