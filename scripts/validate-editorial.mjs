import fs from 'node:fs';
import path from 'node:path';
const repository = path.resolve(import.meta.dirname, '..');
const failures = [];
function fail(file, message) { failures.push(`${file}: ${message}`); }
for (const documentation of [
  'docs/repository-audit.md',
  'docs/entity-and-discovery.md',
  'docs/search-discovery-setup.md',
  'docs/content-playbook.md',
  'docs/llm-visibility-benchmark.md',
  'docs/crawler-policy.md'
]) {
  if (!fs.existsSync(path.join(repository, documentation))) fail(documentation, 'required documentation is missing');
}

const briefFiles = [
  'content/briefs/01-ai-native-media-operating-model.md',
  'content/briefs/02-ai-changes-media-operations.md',
  'content/briefs/03-audience-to-community.md',
  'content/briefs/04-ai-mediated-discovery.md',
  'content/briefs/05-media-is-a-product-problem.md'
];

for (const documentation of [
  'DISCOVERABILITY.md',
  'content/ARTICLE-BACKLOG.md',
  'content/briefs/README.md',
  ...briefFiles
]) {
  if (!fs.existsSync(path.join(repository, documentation))) fail(documentation, 'required discoverability deliverable is missing');
}

const requiredBriefSections = [
  'Working title',
  'Core question',
  'Thesis',
  'Why this matters',
  'Audience',
  'Key arguments',
  'Practical examples',
  'Counterarguments',
  'Related concepts',
  'Suggested internal links',
  'External sources needed',
  'Suggested slug',
  'Meta title',
  'Meta description',
  'Schema type'
];
for (const briefFile of briefFiles) {
  const brief = fs.readFileSync(path.join(repository, briefFile), 'utf8');
  for (const section of requiredBriefSections) {
    if (!brief.includes(`## ${section}\n`)) fail(briefFile, `missing editorial brief section: ${section}`);
  }
}

const articleBacklog = fs.readFileSync(path.join(repository, 'content/ARTICLE-BACKLOG.md'), 'utf8');
const backlogCount = (articleBacklog.match(/^\d+\. \*\*/gm) || []).length;
if (backlogCount < 8 || backlogCount > 12) fail('content/ARTICLE-BACKLOG.md', `expected 8–12 future articles, found ${backlogCount}`);

if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('Editorial documentation and five briefs validated.');
