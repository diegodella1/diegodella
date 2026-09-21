import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const base = process.env.SITE_BASE_URL || new URL('../dist', import.meta.url).href;
if (new URL(base).protocol !== 'file:' && !['127.0.0.1', 'localhost'].includes(new URL(base).hostname)) throw new Error('Browser tests require a local preview.');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'diegodella-browser-'));
const browser = spawn(process.env.CHROME_PATH || '/usr/bin/chromium', ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { detached: true });
let socket;
try {
  const debuggerUrl = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Chromium startup timeout')), 45000);
    browser.stderr.on('data', chunk => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    browser.once('error', reject);
  });
  socket = new WebSocket(debuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let nextId = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.error) request.reject(new Error(message.error.message)); else request.resolve(message.result);
  };
  function call(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 45000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
  const { targetId } = await call('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
  const command = (method, params) => call(method, params, sessionId);
  const evaluate = async expression => {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  };
  async function waitFor(expression) {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(expression)) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Condition not met: ${expression}`);
  }
  await command('Runtime.enable');
  await command('Page.enable');
  await command('Network.enable');
  await command('Network.setBlockedURLs', { urls: ['*googletagmanager.com*', '*google-analytics.com*', '*fonts.googleapis.com*', '*fonts.gstatic.com*'] });
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await command('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.mockRequests = 0;
    window.contactEvents = [];
    window.trackContactSuccess = mode => window.contactEvents.push(mode);
    window.mockFailure = true;
    window.mockMode = '';
    const originalTimeout = window.setTimeout.bind(window);
    window.setTimeout = (fn, delay, ...args) => originalTimeout(fn, window.mockFastTimeout && delay === 12000 ? 50 : delay, ...args);
    const originalFetch = window.fetch.bind(window);
    window.fetch = (url, options) => {
      if (String(url).includes('/api/contact')) {
        window.mockRequests++;
        if (window.mockMode === 'pending') return new Promise((resolve, reject) => {
          window.resolveContact = resolve;
          options.signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')));
        });
        if (window.mockMode === 'network') return Promise.reject(new TypeError('Failed to fetch'));
        if (window.mockMode === 'empty') return Promise.resolve(new Response('{}', {status:200}));
        if (window.mockMode === 'malformed') return Promise.resolve(new Response('<html>Error</html>', {status:200}));
        if (window.mockMode === 'rate') return Promise.resolve(new Response('{}', {status:429}));
        return Promise.resolve(new Response(JSON.stringify(window.mockFailure ? {error:'Simulated delivery failure'} : {ok:true}), {status:window.mockFailure ? 503 : 200}));
      }
      return originalFetch(url, options);
    };
  ` });
  await command('Page.navigate', { url: `${base}/nuggets.html` });
  await waitFor('document.readyState === "complete" && !!document.querySelector("#contactModal")');
  assert.equal(await evaluate('document.querySelectorAll(".nugget-card").length'), 86);
  await evaluate('document.querySelector(".nugget-disclosure").click()');
  assert.equal(await evaluate('document.querySelector(".nugget-disclosure").getAttribute("aria-expanded")'), 'true');
  await evaluate('document.querySelector(".nugget-disclosure").focus()');
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  assert.equal(await evaluate('document.querySelector(".nugget-disclosure").getAttribute("aria-expanded")'), 'false');
  await evaluate('document.querySelector("[data-filter=foundation]").click()');
  await waitFor('[...document.querySelectorAll(".nugget-card")].filter(card => getComputedStyle(card).display !== "none").length === 5');
  await evaluate('document.querySelector("#surprise").click()');
  await waitFor('!!document.querySelector(".nugget-card.expanded")');
  async function key(name, code, modifiers = 0) {
    await command('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code: name === ' ' ? 'Space' : name, windowsVirtualKeyCode: code, modifiers, text: name === 'Enter' ? '\r' : name === ' ' ? ' ' : '' });
    await command('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code: name === ' ' ? 'Space' : name, windowsVirtualKeyCode: code, modifiers });
  }
  await evaluate(`window.copyCalls=0;Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>{window.copyCalls++;return window.copyFails?Promise.reject(new Error('Denied')):Promise.resolve()}}});document.querySelector('.nugget-card.expanded [data-share="copy"]').focus()`);
  await key('Enter', 13);
  await waitFor('window.copyCalls===1');
  assert.equal(await evaluate('!!document.querySelector(".nugget-card.expanded")'), true);
  await evaluate('window.copyFails=true');
  await key(' ', 32);
  await waitFor('document.activeElement.matches(".copy-feedback input")');
  await evaluate('window.scrollOptions=[];Element.prototype.scrollIntoView=function(options){window.scrollOptions.push(options)};document.querySelector("#surprise").click()');
  assert.equal(await evaluate('window.scrollOptions.at(-1).behavior'), 'smooth');
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await evaluate('document.querySelector("#surprise").click()');
  assert.equal(await evaluate('window.scrollOptions.at(-1).behavior'), 'instant');
  await evaluate('location.hash="n86"');
  await waitFor('document.querySelector("#n86 .nugget-disclosure").getAttribute("aria-expanded")==="true"');
  assert.equal(await evaluate('document.activeElement.matches("#n86 .nugget-disclosure")'), true);
  assert.equal(await evaluate('document.querySelectorAll("[role=tab]").length'), 0);
  await evaluate('document.querySelector("#navToggle").click()');
  assert.equal(await evaluate('document.querySelector("#navToggle").getAttribute("aria-expanded")'), 'true');
  await evaluate('document.querySelector("#navToggle").click()');
  await command('Page.navigate', { url: `${base}/contact.html` });
  await waitFor('document.readyState === "complete" && !!document.querySelector("[data-open-contact]")');
  await evaluate('document.querySelector("[data-open-contact]").click()');
  assert.equal(await evaluate('document.querySelector("#contactModal").open'), true);
  await evaluate('document.querySelector("#contactModalForm").requestSubmit()');
  assert.equal(await evaluate('window.mockRequests'), 0);
  assert.deepEqual(await evaluate('window.contactEvents'), []);
  await evaluate(`document.querySelector('#contactSubject').value='Local test';document.querySelector('#contactReply').value='test@example.com';document.querySelector('#contactBody').value='A local test that must never send a real email.';document.querySelector('#contactModalForm').requestSubmit()`);
  await waitFor('document.querySelector("#contactStatus").textContent.includes("Simulated delivery failure")');
  assert.deepEqual(await evaluate('window.contactEvents'), []);
  await evaluate('window.mockFailure=false;document.querySelector("#contactRetry").click()');
  await waitFor('document.querySelector("#contactStatus").textContent.includes("has been sent")');
  assert.equal(await evaluate('window.mockRequests'), 2);
  assert.deepEqual(await evaluate('window.contactEvents'), ['conversation']);
  await evaluate(`document.querySelector('#contactSubject').value='Preserve draft';document.querySelector('#contactReply').value='test@example.com';document.querySelector('#contactBody').value='Draft body'`);
  for (const mode of ['empty', 'malformed', 'rate', 'network']) {
    await evaluate(`window.mockMode=${JSON.stringify(mode)};document.querySelector('#contactModalForm').requestSubmit()`);
    await waitFor('document.querySelector("#contactModal").dataset.state==="error" && !document.querySelector("#contactSubmit").disabled');
    assert.equal(await evaluate('document.querySelector("#contactBody").value'), 'Draft body');
  }
  await evaluate(`Object.defineProperty(navigator,'onLine',{configurable:true,get:()=>false});document.querySelector('#contactRetry').click()`);
  assert.match(await evaluate('document.querySelector("#contactStatus").textContent'), /offline/);
  await evaluate(`Object.defineProperty(navigator,'onLine',{configurable:true,get:()=>true});window.mockFastTimeout=true;window.mockMode='pending';document.querySelector('#contactRetry').click()`);
  await waitFor('document.querySelector("#contactStatus").textContent.includes("took too long")');
  await evaluate(`window.mockFastTimeout=false;document.querySelector('#contactRetry').click();window.requestsBeforeDuplicate=window.mockRequests;document.querySelector('#contactModalForm').requestSubmit()`);
  assert.equal(await evaluate('window.mockRequests===window.requestsBeforeDuplicate'), true);
  assert.equal(await evaluate('document.querySelector("#contactModalForm").getAttribute("aria-busy")'), 'true');
  await evaluate(`document.querySelector('[data-close-contact]').click();document.querySelector('[data-open-contact]').click()`);
  await new Promise(resolve => setTimeout(resolve, 100));
  assert.equal(await evaluate('document.querySelector("#contactStatus").textContent'), '');
  assert.equal(await evaluate('document.querySelector("#contactBody").value'), 'Draft body');
  assert.deepEqual(await evaluate('window.contactEvents'), ['conversation']);
  await key('Tab', 9);
  assert.equal(await evaluate('document.querySelector("#contactModal").contains(document.activeElement)'), true);
  await key('Tab', 9, 8);
  assert.equal(await evaluate('document.querySelector("#contactModal").contains(document.activeElement)'), true);
  await key('Escape', 27);
  await waitFor('!document.querySelector("#contactModal").open');
  await evaluate(`document.querySelector('[data-open-contact]').setAttribute('data-contact-mode','updates');document.querySelector('[data-open-contact]').click()`);
  assert.match(await evaluate('document.querySelector("#contactBody").value'), /low-frequency/);
  await evaluate(`window.mockMode='';document.querySelector('#contactReply').value='test@example.com';document.querySelector('#contactModalForm').requestSubmit()`);
  await waitFor('document.querySelector("#contactModal").dataset.state==="success"');
  assert.deepEqual(await evaluate('window.contactEvents'), ['conversation', 'updates']);
  await evaluate(`window.trackContactSuccess=()=>{throw new Error('Analytics blocked')};document.querySelector('#contactSubject').value='Blocked analytics';document.querySelector('#contactReply').value='test@example.com';document.querySelector('#contactBody').value='Still deliver';document.querySelector('#contactModalForm').requestSubmit()`);
  await waitFor('document.querySelector("#contactModal").dataset.state==="success" && !document.querySelector("#contactSubmit").disabled');
  await evaluate(`document.querySelector('[data-close-contact]').click();document.querySelector('[data-open-contact]').setAttribute('data-contact-mode','conversation');document.querySelector('[data-open-contact]').click()`);
  assert.equal(await evaluate('document.querySelector("#contactSubject").value'), 'Preserve draft');
  await evaluate('document.querySelector("[data-close-contact]").click()');
  assert.equal(await evaluate('document.querySelector("#contactModal").open'), false);
  await command('Page.navigate', { url: `${base}/essays.html` });
  await waitFor('document.readyState === "complete" && !!document.querySelector("#contactModal")');
  await evaluate('document.querySelector("[data-essay-filter=ai-trust]").click()');
  assert.equal(await evaluate('document.querySelector("[data-essay-filter=ai-trust]").getAttribute("aria-pressed")'), 'true');
  await command('Page.navigate', { url: `${base}/zmox.html` });
  await waitFor('document.readyState === "complete" && !!document.querySelector(".diagram-expand")');
  await evaluate('document.querySelector(".diagram-expand").focus()');
  await key('Enter', 13);
  assert.equal(await evaluate('document.querySelector("#dlb").open'), true);
  assert.equal(await evaluate('document.activeElement.id'), 'dlb-close');
  await key('Tab', 9);
  await key('Tab', 9, 8);
  await key('Escape', 27);
  await waitFor('!document.querySelector("#dlb").open');
  assert.equal(await evaluate('document.activeElement.matches(".diagram-expand")'), true);
  await command('Emulation.setScriptExecutionDisabled', { value: true });
  await command('Page.navigate', { url: `${base}/nuggets.html` });
  await waitFor('document.readyState === "complete" && location.pathname.endsWith("/nuggets.html")');
  assert.equal(await evaluate('[...document.querySelectorAll(".nugget-expand")].every(panel => getComputedStyle(panel).display !== "none")'), true);
  assert.equal(await evaluate('[...document.querySelectorAll(".nugget-card")].every(card => getComputedStyle(card).opacity === "1")'), true);
  assert.deepEqual(errors, []);
  console.log('Browser passed: menus, keyboard disclosure/copy/clipboard rejection, filters/deep links/reduced motion, contact errors/offline/timeout/concurrency/drafts/reopen, and diagram dialog. All email and clipboard requests mocked.');
} finally {
  socket?.close();
  try { process.kill(-browser.pid, 'SIGTERM'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
  if (browser.exitCode === null && browser.signalCode === null) await new Promise(resolve => browser.once('exit', resolve));
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
