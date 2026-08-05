import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const requestedPages = process.env.AUDIT_PAGES?.split(',').map((name) => name.trim()).filter(Boolean);
const pages = fs.readdirSync(root)
  .filter((name) => name.endsWith('.html') && (!requestedPages || requestedPages.includes(name)))
  .sort();
const allViewports = [
  { name: 'phone-360', width: 360, height: 800, mobile: true },
  { name: 'phone-390', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: true },
  { name: 'laptop', width: 1024, height: 768, mobile: false },
  { name: 'desktop', width: 1440, height: 900, mobile: false }
];
const requestedViewports = process.env.AUDIT_VIEWPORTS?.split(',').map((name) => name.trim()).filter(Boolean);
const viewports = allViewports.filter(
  (viewport) => !requestedViewports || requestedViewports.includes(viewport.name)
);
const themes = ['light', 'dark'];
const browserCandidates = [
  process.env.CHROME_PATH,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome'
].filter(Boolean);
const browserPath = browserCandidates.find((candidate) => fs.existsSync(candidate));

if (!browserPath) {
  console.error('Theme audit needs Chromium. Set CHROME_PATH or install chromium.');
  process.exit(1);
}
if (typeof WebSocket === 'undefined') {
  console.error('Theme audit needs Node.js 22+ with the global WebSocket API.');
  process.exit(1);
}

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'diegodella-theme-audit-'));
const browser = spawn(browserPath, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'] });

function browserPort() {
  return new Promise((resolve, reject) => {
    let stderr = '';
    const timeout = setTimeout(() => reject(new Error('Timed out starting Chromium.')), 10000);
    browser.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on ws:\/\/[^:]+:(\d+)\//);
      if (!match) return;
      clearTimeout(timeout);
      resolve(Number(match[1]));
    });
    browser.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Chromium exited before audit started (${code}).`));
    });
  });
}

function connect(webSocketUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const pending = new Map();
    let nextId = 0;

    socket.onerror = reject;
    socket.onopen = () => {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (!message.id || !pending.has(message.id)) return;
        const { accept, reject: rejectCall } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) rejectCall(new Error(message.error.message));
        else accept(message.result);
      };

      resolve({
        call(method, params = {}) {
          return new Promise((accept, rejectCall) => {
            const id = ++nextId;
            pending.set(id, { accept, reject: rejectCall });
            socket.send(JSON.stringify({ id, method, params }));
          });
        },
        close() {
          socket.close();
        }
      });
    };
  });
}

const auditExpression = String.raw`(() => {
  const parseColor = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(/[, ]+/).filter(Boolean).map(Number);
    return [parts[0], parts[1], parts[2], parts.length > 3 ? parts[3] : 1];
  };
  const luminance = (color) => {
    const channels = color.slice(0, 3).map((value) => {
      value /= 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (first, second) => (
    (Math.max(luminance(first), luminance(second)) + 0.05) /
    (Math.min(luminance(first), luminance(second)) + 0.05)
  );
  const background = (element) => {
    for (let current = element; current; current = current.parentElement) {
      const color = parseColor(getComputedStyle(current).backgroundColor);
      if (color && color[3] > 0.95) return color;
    }
    return parseColor(getComputedStyle(document.body).backgroundColor) || [255, 255, 255, 1];
  };
  const label = (element) => {
    const classes = [...element.classList].slice(0, 3).map((name) => '.' + name).join('');
    return element.tagName.toLowerCase() + (element.id ? '#' + element.id : classes);
  };
  const visible = (element) => {
    const modal = document.querySelector('dialog[open]');
    if (modal && element !== modal && !modal.contains(element)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' &&
      Number(style.opacity) !== 0 && rect.width > 0.5 && rect.height > 0.5;
  };
  const contrastFailures = [];

  for (const element of document.body.querySelectorAll('*')) {
    if (!visible(element)) continue;
    const ownsText = [...element.childNodes].some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    );
    if (!ownsText) continue;
    const style = getComputedStyle(element);
    const foreground = parseColor(style.color);
    const surface = background(element);
    if (!foreground || !surface) continue;
    const ratio = contrast(foreground, surface);
    const size = Number.parseFloat(style.fontSize);
    const weight = Number.parseInt(style.fontWeight, 10) || 400;
    const minimum = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
    if (ratio + 0.05 < minimum) {
      contrastFailures.push({
        element: label(element),
        ratio: Number(ratio.toFixed(2)),
        minimum,
        foreground,
        surface,
        text: element.textContent.trim().slice(0, 60)
      });
    }
  }

  const interactive = [...document.querySelectorAll(
    'a[href], button, input, textarea, select, summary, [role="button"], [tabindex]'
  )].filter(visible);
  const overlapFailures = [];
  for (let firstIndex = 0; firstIndex < interactive.length; firstIndex += 1) {
    const first = interactive[firstIndex];
    const firstStyle = getComputedStyle(first);
    if (firstStyle.display === 'inline') continue;
    for (let secondIndex = firstIndex + 1; secondIndex < interactive.length; secondIndex += 1) {
      const second = interactive[secondIndex];
      if (first.contains(second) || second.contains(first)) continue;
      const secondStyle = getComputedStyle(second);
      if (secondStyle.display === 'inline') continue;
      const firstRect = first.getBoundingClientRect();
      const secondRect = second.getBoundingClientRect();
      const width = Math.min(firstRect.right, secondRect.right) - Math.max(firstRect.left, secondRect.left);
      const height = Math.min(firstRect.bottom, secondRect.bottom) - Math.max(firstRect.top, secondRect.top);
      if (width > 3 && height > 3) {
        overlapFailures.push({
          first: label(first),
          second: label(second),
          area: Math.round(width * height)
        });
      }
    }
  }

  return {
    contrastFailures,
    overlapFailures,
    overflow: document.documentElement.scrollWidth > innerWidth + 2
      ? { viewport: innerWidth, document: document.documentElement.scrollWidth }
      : null
  };
})()`;

let client;
const failures = [];

function record(page, viewport, theme, scenario, result) {
  for (const issue of result.contrastFailures) {
    failures.push(`${page} [${viewport}/${theme}/${scenario}] ${issue.element} contrast ${issue.ratio}:1 < ${issue.minimum}:1 (${issue.foreground.join(',')} on ${issue.surface.join(',')}) — ${issue.text}`);
  }
  for (const issue of result.overlapFailures) {
    failures.push(`${page} [${viewport}/${theme}/${scenario}] overlapping controls ${issue.first} / ${issue.second}`);
  }
  if (result.overflow) {
    failures.push(`${page} [${viewport}/${theme}/${scenario}] horizontal overflow ${result.overflow.document}px > ${result.overflow.viewport}px`);
  }
}

async function evaluate(expression) {
  const response = await client.call('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description || 'Browser evaluation failed.');
  }
  return response.result.value;
}

try {
  const port = await browserPort();
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
    method: 'PUT'
  })).json();
  client = await connect(target.webSocketDebuggerUrl);
  await client.call('Page.enable');
  await client.call('Network.enable');
  await client.call('Network.setBlockedURLs', { urls: ['http://*', 'https://*'] });
  await client.call('Runtime.enable');
  await client.call('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });

  for (const viewport of viewports) {
    await client.call('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile
    });

    for (const page of pages) {
      const pageUrl = `file://${path.join(root, page)}`;
      await client.call('Page.navigate', { url: pageUrl });
      let pageReady = false;
      for (let attempt = 0; attempt < 400; attempt += 1) {
        pageReady = await evaluate(
          `location.href === ${JSON.stringify(pageUrl)} && document.readyState === "complete" && Boolean(window.NMTheme)`
        );
        if (pageReady) break;
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      if (!pageReady) {
        const state = await evaluate('({ href: location.href, readyState: document.readyState, theme: document.documentElement.getAttribute("data-theme"), hasTheme: Boolean(window.NMTheme) })');
        throw new Error(`${page} did not load its theme contract: ${JSON.stringify(state)}`);
      }
      await evaluate(`(() => {
        const style = document.createElement('style');
        style.dataset.themeAudit = '';
        style.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
        document.head.append(style);
      })()`);
      // Remote font hosts may be unavailable in CI. The audit intentionally uses
      // the computed fallback stack instead of waiting forever on document.fonts.

      for (const theme of themes) {
        await evaluate(`window.NMTheme.apply(${JSON.stringify(theme)}, { source: "audit" })`);
        await evaluate('new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
        if (process.env.AUDIT_DEBUG && theme === 'dark') {
          const debug = await evaluate(`({
            theme: document.documentElement.getAttribute('data-theme'),
            themeInk: getComputedStyle(document.body).getPropertyValue('--theme-ink').trim(),
            nmInk: getComputedStyle(document.body).getPropertyValue('--nm-ink').trim(),
            contactBackground: document.querySelector('.nm-contact-actions')
              ? getComputedStyle(document.querySelector('.nm-contact-actions')).backgroundColor
              : null,
            contactLinkBackground: document.querySelector('.nm-contact-actions p a')
              ? getComputedStyle(document.querySelector('.nm-contact-actions p a')).backgroundColor
              : null,
            stylesheets: [...document.styleSheets].map((sheet) => sheet.href || 'inline')
          })`);
          console.error(`${page} theme debug: ${JSON.stringify(debug)}`);
        }
        record(page, viewport.name, theme, 'default', await evaluate(auditExpression));

        if (page === 'index.html' && viewport.name === 'desktop') {
          await evaluate('document.querySelector("[data-open-contact]")?.click()');
          record(page, viewport.name, theme, 'dialog', await evaluate(auditExpression));
          await evaluate('document.querySelector("[data-close-contact]")?.click()');
        }

        if (page === 'index.html' && viewport.mobile) {
          await evaluate('document.querySelector("#navToggle")?.click()');
          record(page, viewport.name, theme, 'mobile-menu', await evaluate(auditExpression));
          await evaluate('document.querySelector("#navToggle")?.click()');
        }

        if (page === 'essays.html') {
          await evaluate('document.querySelector(".library-filter button:not([aria-pressed=\\"true\\"])")?.click()');
          record(page, viewport.name, theme, 'filter-active', await evaluate(auditExpression));
        }
      }
    }
  }
} finally {
  if (client) client.close();
  if (browser.exitCode === null) {
    browser.kill('SIGTERM');
  }
  try {
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  } catch (error) {
    console.error(`Theme audit warning: could not remove temporary Chromium profile (${error.code || error.message}).`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`Theme audit failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log(
  `Theme audit passed: ${pages.length} pages × ${viewports.length} viewports × ${themes.length} themes, plus interactive states.`
);
