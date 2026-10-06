#!/usr/bin/env node
/**
 * Capture #products grid region on about.html for XPOSTER overlap verification.
 * Usage: node scripts/capture-products-grid.mjs <url> <width> <output.png>
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

const url = process.argv[2];
const width = Number(process.argv[3]);
const outPath = path.resolve(process.argv[4]);
const mobile = width < 768;

if (!url || !width || !outPath) {
  console.error('Usage: node scripts/capture-products-grid.mjs <url> <width> <output.png>');
  process.exit(1);
}

const browserPath = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser'
].find((p) => p && fs.existsSync(p));

if (!browserPath) {
  console.error('Chromium/Chrome not found');
  process.exit(1);
}

const realFontCSS = fs.readFileSync(new URL('../public/styles/fonts.css', import.meta.url), 'utf8')
  .replace(/url\((?:\/|\.\.\/)fonts\/([^)]+)\)/g, (_, file) => {
    const buf = fs.readFileSync(new URL(`../public/fonts/${file}`, import.meta.url));
    return `url(data:font/woff2;base64,${buf.toString('base64')})`;
  });

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'xposter-shot-'));
const browser = spawn(browserPath, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'] });

const port = await new Promise((resolve, reject) => {
  let stderr = '';
  const t = setTimeout(() => reject(new Error('Chromium startup timeout')), 20000);
  browser.stderr.on('data', (chunk) => {
    stderr += chunk;
    const m = stderr.match(/DevTools listening on ws:\/\/[^:]+:(\d+)\//);
    if (m) {
      clearTimeout(t);
      resolve(Number(m[1]));
    }
  });
  browser.once('error', reject);
});

const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

const pending = new Map();
let nextId = 0;
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
};

function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await call('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  }
  return result.result.value;
}

try {
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Network.enable');
  await call('Network.setBlockedURLs', {
    urls: ['*googletagmanager.com*', '*google-analytics.com*']
  });
  const viewportHeight = mobile ? 1200 : 1100;
  await call('Emulation.setDeviceMetricsOverride', {
    width,
    height: viewportHeight,
    deviceScaleFactor: 1,
    mobile
  });

  const pageUrl = url.includes('#') ? url : `${url.replace(/#.*$/, '')}#products`;
  await call('Page.navigate', { url: pageUrl });

  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    ready = await evaluate(`(() => {
      if (document.readyState !== 'complete') return false;
      if (!document.body.classList.contains('nm-page')) return false;
      const card = document.querySelector('.nm-project-featured');
      const grid = document.getElementById('products');
      if (!card || !grid) return false;
      const fs = parseFloat(getComputedStyle(card.querySelector('strong')).fontSize);
      return fs > 28;
    })()`);
    if (ready) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!ready) throw new Error('Page shell / featured card did not become ready');

  await evaluate(`(() => {
    const style = document.createElement('style');
    style.textContent = ${JSON.stringify(realFontCSS)};
    document.head.appendChild(style);
    return Promise.all([
      document.fonts.load('600 16px "Space Grotesk"'),
      document.fonts.load('700 32px Syne'),
      document.fonts.load('400 12px "JetBrains Mono"'),
      document.fonts.ready
    ]);
  })()`);
  await new Promise((r) => setTimeout(r, 350));

  const layout = await evaluate(`(() => {
    const section = document.getElementById('products');
    const grid = section.querySelector('.nm-project-grid');
    const card = document.querySelector('.nm-project-featured');
    if (!section || !grid || !card) throw new Error('missing #products grid or featured card');

    const narrow = window.innerWidth < 768;
    const rect = card.getBoundingClientRect();
    const targetY = narrow
      ? window.scrollY + rect.top - Math.max(24, (window.innerHeight - rect.height) / 2)
      : window.scrollY + rect.top - 96;
    window.scrollTo({ top: Math.max(0, targetY), left: 0, behavior: 'instant' });
    const cards = [...grid.querySelectorAll(':scope > a')];
    const idx = cards.indexOf(card);
    const neighborBefore = cards[idx - 1];
    const neighborAfter = cards[idx + 1];

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const visibleRects = [neighborBefore, card, neighborAfter]
      .filter(Boolean)
      .map((el) => el.getBoundingClientRect())
      .map((r) => ({
        left: r.left,
        top: Math.max(0, r.top),
        right: Math.min(vw, r.right),
        bottom: Math.min(vh, r.bottom)
      }))
      .filter((r) => r.bottom > r.top + 2 && r.right > r.left + 2);

    if (!visibleRects.length) throw new Error('no visible product cards in viewport');

    const union = visibleRects.reduce((acc, r) => ({
      left: Math.min(acc.left, r.left),
      top: Math.min(acc.top, r.top),
      right: Math.max(acc.right, r.right),
      bottom: Math.max(acc.bottom, r.bottom)
    }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });

    const padX = 12;
    const padY = 16;
    let clip = {
      x: Math.max(0, Math.floor(union.left - padX)),
      y: Math.max(0, Math.floor(union.top - padY)),
      width: Math.ceil(union.right - union.left + padX * 2),
      height: Math.ceil(union.bottom - union.top + padY * 2)
    };
    clip.width = Math.min(clip.width, vw - clip.x);
    clip.height = Math.min(clip.height, vh - clip.y);

    const strong = card.querySelector('strong');
    const p = card.querySelector('p');
    const sr = strong.getBoundingClientRect();
    const pr = p.getBoundingClientRect();
    const overlapX = Math.max(0, Math.min(sr.right, pr.right) - Math.max(sr.left, pr.left));
    const overlapY = Math.max(0, Math.min(sr.bottom, pr.bottom) - Math.max(sr.top, pr.top));

    const cr = card.getBoundingClientRect();
    const cx = (cr.left + cr.right) / 2;
    const cy = (cr.top + cr.bottom) / 2;
    const sanity = {
      inView: cx > 4 && cx < vw - 4 && cy > 4 && cy < vh - 4,
      hasAccent: (() => {
        const bg = getComputedStyle(card).backgroundColor;
        return bg.includes('rgb') && !bg.endsWith(', 0)');
      })(),
      title: strong.textContent.trim(),
      cardWidth: cr.width,
      cardHeight: cr.height
    };

    return {
      clip,
      metrics: {
        overlaps: overlapX > 2 && overlapY > 2,
        titleOverflow: strong.scrollWidth > strong.clientWidth + 1,
        titleFontSize: getComputedStyle(strong).fontSize,
        strongRight: sr.right,
        pLeft: pr.left
      },
      sanity
    };
  })()`);

  if (!layout.sanity.inView || !layout.sanity.hasAccent || !layout.sanity.title.includes('XPoster')) {
    throw new Error(`Sanity check failed: ${JSON.stringify(layout.sanity)}`);
  }

  await new Promise((r) => setTimeout(r, 200));

  const scrollY = await evaluate('window.scrollY');
  const { clip: viewportClip, metrics, sanity } = layout;
  const clip = {
    x: viewportClip.x,
    y: viewportClip.y + scrollY,
    width: viewportClip.width,
    height: viewportClip.height
  };
  if (clip.width < 80 || clip.height < 80) {
    throw new Error(`Clip too small: ${JSON.stringify(clip)}`);
  }

  const clipOk = await evaluate(`(() => {
    const card = document.querySelector('.nm-project-featured');
    const r = card.getBoundingClientRect();
    const cx = (r.left + r.right) / 2;
    const cy = (r.top + r.bottom) / 2;
    const clip = ${JSON.stringify(viewportClip)};
    return cx >= clip.x && cx <= clip.x + clip.width && cy >= clip.y && cy <= clip.y + clip.height;
  })()`);
  if (!clipOk) {
    throw new Error(`Clip does not contain featured card center: ${JSON.stringify(viewportClip)}`);
  }

  const shot = await call('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: true,
    clip: { ...clip, scale: 1 }
  });

  const png = Buffer.from(shot.data, 'base64');
  if (png.length < 8000) {
    throw new Error(`PNG suspiciously small (${png.length} bytes) for clip ${JSON.stringify(clip)}`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, png);

  const md5 = createHash('md5').update(png).digest('hex');
  console.log(JSON.stringify({
    outPath,
    width,
    md5,
    bytes: png.length,
    clip,
    metrics,
    sanity
  }, null, 2));
} finally {
  browser.kill();
}
