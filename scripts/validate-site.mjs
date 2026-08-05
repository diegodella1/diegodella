import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const pages = fs.readdirSync(root).filter((name) => name.endsWith('.html')).sort();
const requiredNav = [
  ['thesis.html', 'Idea'],
  ['frameworks.html', 'Frameworks'],
  ['essays.html', 'Essays'],
  ['about.html#work', 'Work'],
  ['about.html', 'About']
];
const failures = [];
const activeStylesheets = [
  'global.css',
  'styles/tokens.css',
  'styles/page-inline.css',
  'styles/home.css',
  'styles/editorial.css',
  'styles/components.css',
  'styles/shell.css',
  'styles/theme-contract.css'
];

function count(source, pattern) {
  return (source.match(pattern) || []).length;
}

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

function hasNonSvgInlineStyle(source) {
  let svgDepth = 0;
  for (const match of source.matchAll(/<[^>]+>/g)) {
    const tag = match[0];
    if (/^<\/svg\b/i.test(tag)) svgDepth = Math.max(0, svgDepth - 1);
    if (svgDepth === 0 && !/^<svg\b/i.test(tag) && /\sstyle="/i.test(tag)) return true;
    if (/^<svg\b/i.test(tag) && !/\/\s*>$/.test(tag)) svgDepth += 1;
  }
  return false;
}

function findTinyFont(source) {
  for (const match of source.matchAll(/font-size:\s*([0-9.]+)(rem|px)/gi)) {
    const value = Number(match[1]);
    if ((match[2].toLowerCase() === 'rem' && value < 0.75) || (match[2].toLowerCase() === 'px' && value < 12)) {
      return match[0];
    }
  }
  return null;
}

function tokenMap(block) {
  const values = {};
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    values[match[1]] = match[2].trim();
  }
  return values;
}

function tokenValue(values, token, seen = new Set()) {
  if (seen.has(token)) return null;
  seen.add(token);
  const raw = values[token];
  if (!raw) return null;
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw;
  const reference = raw.match(/^var\((--[\w-]+)\)$/)?.[1];
  return reference ? tokenValue(values, reference, seen) : null;
}

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((value) => (
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const values = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

for (const file of pages) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const head = source.slice(0, source.indexOf('</head>'));
  if (!/<html[^>]+lang="[^"]+"/i.test(source)) fail(file, 'missing html lang');
  if (!/<meta[^>]+name="viewport"/i.test(source)) fail(file, 'missing viewport meta');
  if (!/<meta[^>]+name="theme-color"[^>]+id="themeColor"|<meta[^>]+id="themeColor"[^>]+name="theme-color"/i.test(source)) {
    fail(file, 'missing addressable theme-color meta');
  }
  if (!/data-theme-source/i.test(head)) fail(file, 'missing theme bootstrap contract');
  if (!/href="#main-content"/i.test(source)) fail(file, 'missing skip link');
  if (!/<main[^>]+id="main-content"/i.test(source)) fail(file, 'missing main-content landmark');
  if (count(source, /<h1\b/gi) !== 1) fail(file, `expected one h1, found ${count(source, /<h1\b/gi)}`);
  if (count(source, /id="main-content"/gi) !== 1) fail(file, 'main-content id is missing or duplicated');
  if (/<style(?:\s|>)/i.test(source) && !/<style[^>]*>@layer page\s*\{/i.test(source)) {
    fail(file, 'head styles must be isolated in the page layer');
  }
  if (file !== 'index.html' && /!important/i.test(head)) {
    fail(file, 'page styles must not use !important');
  }
  if (hasNonSvgInlineStyle(source)) fail(file, 'non-SVG inline style must be extracted to page-inline.css');
  if (/cdn\.tailwindcss\.com/i.test(source)) fail(file, 'Tailwind CDN runtime is forbidden');
  const tinyFont = findTinyFont(source);
  if (tinyFont) fail(file, `text smaller than the 12px UI floor: ${tinyFont}`);

  const nav = source.match(/<div class="nav-links" id="navLinks"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
  if (!nav) {
    fail(file, 'missing static primary navigation');
  } else {
    for (const [href, label] of requiredNav) {
      if (!nav.includes(`href="${href}"`) || !nav.includes(`>${label}</a>`)) fail(file, `missing primary nav route ${label}`);
    }
    if (count(nav, /class="nav-link"/g) !== requiredNav.length) fail(file, 'primary navigation must contain exactly five routes');
  }
  if (!/class="nav-brand"[^>]*>NARRATIVE MECHANICS<\/a>/i.test(source)) {
    fail(file, 'primary brand must be NARRATIVE MECHANICS');
  }
  if (!/<div class="nav-links"[\s\S]*?<div class="nav-right">[\s\S]*?data-theme-toggle/i.test(source)) {
    fail(file, 'navigation must include theme control after primary links');
  }

  for (const match of source.matchAll(/(?:href|src)="([^"#?]+)(?:\?[^"#]*)?(?:#[^"]*)?"/gi)) {
    const target = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(target) || target === '/') continue;
    const local = target.startsWith('/') ? target.slice(1) : target;
    if (!fs.existsSync(path.join(root, local))) fail(file, `missing local target ${target}`);
  }

  for (const match of source.matchAll(/href="([^"#]*?)#([^"?]+)"/gi)) {
    const targetFile = match[1] || file;
    const targetPath = path.join(root, targetFile);
    if (!fs.existsSync(targetPath)) continue;
    const targetSource = fs.readFileSync(targetPath, 'utf8');
    if (!new RegExp(`(?:id|name)="${match[2].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(targetSource)) {
      fail(file, `missing hash target ${targetFile}#${match[2]}`);
    }
  }
}

const globalCss = fs.readFileSync(path.join(root, 'global.css'), 'utf8');
for (const requiredImport of [
  'styles/legacy.css',
  'styles/legacy-components.css',
  'styles/tokens.css',
  'styles/page-inline.css',
  'styles/home.css',
  'styles/editorial.css',
  'styles/components.css',
  'styles/shell.css',
  'styles/theme-contract.css'
]) {
  if (!globalCss.includes(requiredImport)) fail('global.css', `missing layered import ${requiredImport}`);
}

const tokensCss = fs.readFileSync(path.join(root, 'styles/tokens.css'), 'utf8');
for (const token of [
  '--control-bg',
  '--control-fg',
  '--control-primary-bg',
  '--control-primary-fg',
  '--control-accent-bg',
  '--control-accent-fg',
  '--on-accent'
]) {
  if (count(tokensCss, new RegExp(`${token}:`, 'g')) !== 1) {
    fail('styles/tokens.css', `${token} must be a single public alias`);
  }
}
const lightThemeBlock = tokensCss.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1];
const darkThemeBlock = tokensCss.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)?.[1];
const lightThemeTokens = lightThemeBlock ? tokenMap(lightThemeBlock) : {};
const darkThemeTokens = darkThemeBlock ? { ...lightThemeTokens, ...tokenMap(darkThemeBlock) } : {};
for (const token of [
  '--theme-ink',
  '--theme-ink-2',
  '--theme-ink-3',
  '--theme-paper',
  '--theme-paper-2',
  '--theme-paper-3',
  '--theme-surface-1',
  '--theme-surface-2',
  '--theme-surface-accent',
  '--theme-accent',
  '--theme-accent-hover',
  '--theme-accent-light',
  '--theme-highlight',
  '--theme-red',
  '--theme-muted',
  '--theme-border-light',
  '--theme-control-bg',
  '--theme-control-primary-bg',
  '--theme-control-primary-fg',
  '--theme-control-accent-fg',
  '--theme-on-accent'
]) {
  if (!lightThemeTokens[token] || !darkThemeTokens[token]) {
    fail('styles/tokens.css', `${token} must define light and dark values`);
  }
}
if (!lightThemeBlock || !darkThemeBlock) {
  fail('styles/tokens.css', 'missing light or dark token block');
} else for (const [theme, values] of [['light', lightThemeTokens], ['dark', darkThemeTokens]]) {
  for (const [foreground, background, minimum] of [
    ['--control-fg', '--control-bg', 4.5],
    ['--control-primary-fg', '--control-primary-bg', 4.5],
    ['--control-accent-fg', '--control-accent-bg', 4.5],
    ['--on-accent', '--accent', 4.5],
    ['--accent', '--highlight', 4.5],
    ['--red', '--paper', 4.5],
    ['--blue', '--paper', 3]
  ]) {
    const foregroundValue = tokenValue(values, foreground);
    const backgroundValue = tokenValue(values, background);
    if (!foregroundValue || !backgroundValue) {
      fail('styles/tokens.css', `${theme} contrast pair ${foreground}/${background} must use hex values`);
      continue;
    }
    const ratio = contrastRatio(foregroundValue, backgroundValue);
    if (ratio < minimum) {
      fail('styles/tokens.css', `${theme} ${foreground}/${background} contrast ${ratio.toFixed(2)} is below ${minimum}:1`);
    }
  }
}

const componentsCss = fs.readFileSync(path.join(root, 'styles/components.css'), 'utf8');
const shellCss = fs.readFileSync(path.join(root, 'styles/shell.css'), 'utf8');
if (!/:focus-visible\s*\{[^}]*outline:\s*(?:[2-9]|[1-9][0-9]+)px\s+solid/s.test(shellCss)) {
  fail('styles/shell.css', 'shared keyboard focus outline must be at least 2px');
}
const contactModalRule = componentsCss.match(/\.contact-modal\s*\{([\s\S]*?)\}/)?.[1] || '';
for (const declaration of [
  /inset:\s*0/,
  /margin:\s*auto/,
  /pointer-events:\s*auto/,
  /transform:\s*none/
]) {
  if (!declaration.test(contactModalRule)) {
    fail('styles/components.css', `contact modal centering contract missing ${declaration.source}`);
  }
}

for (const stylesheet of activeStylesheets) {
  const css = fs.readFileSync(path.join(root, stylesheet), 'utf8');
  if (/!important/i.test(css)) fail(stylesheet, 'presentation layer must not use !important');
  if (/body:not\(\.font-body\)/.test(css)) fail(stylesheet, 'broad body:not(.font-body) selector is forbidden');
  if (/\[class\*=["'](?:title|label|meta)/.test(css)) fail(stylesheet, 'substring class selectors are forbidden');
  const tinyFont = findTinyFont(css);
  if (tinyFont) fail(stylesheet, `text smaller than the 12px UI floor: ${tinyFont}`);
  if (/transition\s*:[^;}]*\b(?:width|height|max-height)\b/i.test(css)) fail(stylesheet, 'layout-property transitions are forbidden');
  if (/z-index:\s*(?:999|[1-9][0-9]{3,})\b/i.test(css)) fail(stylesheet, 'arbitrary z-index must use the semantic scale');
}

for (const legacyStylesheet of ['styles/legacy.css', 'styles/legacy-components.css']) {
  const css = fs.readFileSync(path.join(root, legacyStylesheet), 'utf8');
  if (/!important/i.test(css)) fail(legacyStylesheet, 'legacy layer must not use !important');
  const tinyFont = findTinyFont(css);
  if (tinyFont) fail(legacyStylesheet, `text smaller than the 12px UI floor: ${tinyFont}`);
  if (/transition\s*:[^;}]*\b(?:width|height|max-height)\b/i.test(css)) fail(legacyStylesheet, 'layout-property transitions are forbidden');
  if (/z-index:\s*(?:999|[1-9][0-9]{3,})\b/i.test(css)) fail(legacyStylesheet, 'arbitrary z-index must use the semantic scale');
}

const globalJs = fs.readFileSync(path.join(root, 'global.js'), 'utf8');
if (!/window\.NMTheme/.test(globalJs) || !/data-theme-source/.test(globalJs)) {
  fail('global.js', 'missing runtime theme switching contract');
}
if (!/<dialog class="contact-modal"/.test(globalJs) || !/\.showModal\(\)/.test(globalJs)) {
  fail('global.js', 'contact flow must use a native dialog');
}
if (!/brand\.textContent = 'NARRATIVE MECHANICS'/.test(globalJs)) {
  fail('global.js', 'runtime navigation brand must be NARRATIVE MECHANICS');
}
if (/injectWorkCTA|work-cta-strip/.test(globalJs)) {
  fail('global.js', 'automatic Work CTA injection is forbidden');
}
const topBarNormalizer = globalJs.match(/function normalizeTopBar\(\) \{([\s\S]*?)\n  \}\n\n  function normalizeFooter/);
if (!topBarNormalizer || /data-open-contact|Work with Diego/.test(topBarNormalizer[1])) {
  fail('global.js', 'top bar must not promote or open the Work modal');
}

const aboutHtml = fs.readFileSync(path.join(root, 'about.html'), 'utf8');
const aboutMarkdown = fs.readFileSync(path.join(root, 'about.md'), 'utf8');
for (const [file, source] of [['about.html', aboutHtml], ['about.md', aboutMarkdown]]) {
  if (!source.includes('https://teleprompter.diegodella.ar/')) {
    fail(file, 'missing telePRO project link');
  }
  if (!source.includes('https://broadcast-planner.diegodella.ar/')) {
    fail(file, 'Broadcast Control Room must use the broadcast-planner URL');
  }
  if (!source.includes('https://lifearg.diegodella.ar/')) {
    fail(file, 'missing Life Match Argentina project link');
  }
  if (source.includes('rtvtime.diegodella.ar')) {
    fail(file, 'obsolete rtvtime URL is still present');
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${pages.length} HTML pages: shell, semantics, routes and local assets OK.`);
