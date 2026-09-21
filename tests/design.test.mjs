import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { elements, textContent, attribute } from './html.mjs';
const fixture=JSON.parse(fs.readFileSync('tests/fixtures/design-content.json'));
const edits=JSON.parse(fs.readFileSync('tests/fixtures/editorial-main-deltas.json'));
test('interior content changes match recorded editorial edits and preserve canonical URLs',()=>{
 for(const [file,expected] of Object.entries(fixture)) {
  const nodes=elements(fs.readFileSync('dist/'+file,'utf8'));
  if(edits[file]) assert.equal(edits[file].before,expected.text,file+' edit baseline');
  assert.equal(textContent(nodes.find(n=>n.tagName==='main')).replace(/\s+/g,' ').trim(),edits[file]?.after??expected.text,file);
  assert.deepEqual(nodes.filter(n=>n.tagName==='link'&&attribute(n,'rel')==='canonical').map(n=>attribute(n,'href')),expected.canonical,file);
 }
});
test('all pages render the shared navigation, local typography and metadata',()=>{
 for(const file of fs.readdirSync('dist').filter(f=>f.endsWith('.html'))) {
  const html=fs.readFileSync('dist/'+file,'utf8');const nodes=elements(html);
  assert.equal(nodes.filter(n=>attribute(n,'id')==='navToggle').length,1,file);
  assert.equal(nodes.filter(n=>n.tagName==='h1').length,1,file);
  assert.ok(!html.includes('fonts.googleapis.com'),file);
  assert.ok(!html.includes('cdn.tailwindcss.com'),file);
  assert.ok(nodes.some(n=>attribute(n,'data-server-active')!==undefined),file);
 }
 assert.ok(fs.readFileSync('dist/styles/fonts.css','utf8').includes('/fonts/'));
});
