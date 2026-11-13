// Smoke test every story of the built Storybook: `npm test` after
// `npm run build-storybook`. Each story is opened in Chromium, then its
// elements are taken out of the page and put back. A story fails when it
// throws or logs an error, a request to the Storybook itself fails, or
// something keeps animating once its elements are gone. Demo media on other
// hosts may be out of reach, as from a CI runner; that fails no story.
//
// Needs Playwright's Chromium once: npx playwright install chromium --only-shell
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { availableParallelism } from 'node:os';
import { extname, join, normalize, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(process.argv[2] ?? 'storybook-static');
const only = process.argv[3] ? new RegExp(process.argv[3]) : null;
// One page per core, within reason: too many at once starve each other of frames.
const WORKERS = Math.min(8, Math.max(2, availableParallelism()));
// Frames a story may still draw once its elements are gone: one already queued.
const FRAMES_AFTER_DISCONNECT = 1;

if (!existsSync(join(root, 'index.json'))) {
  console.error(`No built Storybook in ${root}. Run npm run build-storybook first.`);
  process.exit(1);
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = createServer((request, response) => {
  const path = normalize(join(root, decodeURIComponent(new URL(request.url, 'http://localhost').pathname)));
  if (!path.startsWith(root) || !existsSync(path) || statSync(path).isDirectory()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' }).end(readFileSync(path));
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

// Counts animation frames, so a loop left running after disconnect shows.
const probe = () => {
  let counting = false;
  let frames = 0;
  const request = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (callback) =>
    request((time) => {
      if (counting) frames += 1;
      callback(time);
    });
  window.__smoke = {
    count: () => {
      frames = 0;
      counting = true;
    },
    frames: () => {
      counting = false;
      return frames;
    },
  };
};

const check = async (browser, story) => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const problems = [];
  let phase = 'render';
  page.on('pageerror', (error) => problems.push(`${phase}: ${error.message}`));
  // Chromium logs every failed load as an error; the Storybook's own are
  // caught below, and those of other hosts are not the components' fault.
  page.on('console', (message) => message.type() === 'error' && !message.text().startsWith('Failed to load resource') && problems.push(`${phase}: console.error ${message.text()}`));
  page.on('requestfailed', (request) => request.url().startsWith(origin) && problems.push(`${phase}: ${request.url()} ${request.failure()?.errorText}`));
  page.on('response', (response) => response.url().startsWith(origin) && response.status() >= 400 && problems.push(`${phase}: ${response.status()} ${response.url()}`));
  await page.addInitScript(probe);
  try {
    // Not waiting for every image: a slow host must not time the story out.
    await page.goto(`${origin}/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#storybook-root')?.childElementCount > 0, null, { timeout: 10_000 });
    await page.waitForTimeout(500);
    phase = 'disconnect';
    const frames = await page.evaluate(async () => {
      const root = document.querySelector('#storybook-root');
      const nodes = [...root.childNodes];
      for (const node of nodes) node.remove();
      // A transition already under way may finish; a loop goes on drawing.
      await new Promise((done) => setTimeout(done, 500));
      window.__smoke.count();
      await new Promise((done) => setTimeout(done, 500));
      const count = window.__smoke.frames();
      window.__nodes = nodes;
      return count;
    });
    if (frames > FRAMES_AFTER_DISCONNECT) problems.push(`disconnect: still drawing frames (${frames} in half a second) after its elements left the page`);
    phase = 'reconnect';
    await page.evaluate(() => document.querySelector('#storybook-root').append(...window.__nodes));
    await page.waitForTimeout(300);
  } catch (error) {
    problems.push(`${phase}: ${error.message.split('\n')[0]}`);
  }
  await page.close();
  return problems;
};

const entries = JSON.parse(readFileSync(join(root, 'index.json'), 'utf8')).entries;
const stories = Object.values(entries).filter((entry) => entry.type === 'story' && (!only || only.test(entry.id)));
const browser = await chromium.launch();
const failures = [];
let done = 0;
const queue = [...stories];
await Promise.all(
  Array.from({ length: WORKERS }, async () => {
    for (let story = queue.shift(); story; story = queue.shift()) {
      const problems = await check(browser, story);
      if (problems.length) failures.push({ story, problems });
      done += 1;
      if (done % 100 === 0) console.log(`${done} / ${stories.length}`);
    }
  }),
);
await browser.close();
server.close();

// In GitHub Actions each failing story also becomes an annotation on the run.
const annotate = process.env.GITHUB_ACTIONS === 'true';
const escapeData = (text) => text.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
const escapeProperty = (text) => escapeData(text).replaceAll(':', '%3A').replaceAll(',', '%2C');
for (const { story, problems } of failures.sort((a, b) => a.story.id.localeCompare(b.story.id))) {
  const unique = [...new Set(problems)];
  console.error(`\n✗ ${story.title} › ${story.name} (${story.id})`);
  for (const problem of unique) console.error(`  ${problem}`);
  if (annotate) console.log(`::error title=${escapeProperty(`${story.title} › ${story.name}`)}::${escapeData(unique.join('\n'))}`);
}
console.log(`\n${stories.length - failures.length} of ${stories.length} stories passed.`);
process.exitCode = failures.length ? 1 : 0;
