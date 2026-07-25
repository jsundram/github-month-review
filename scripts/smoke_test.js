#!/usr/bin/env node
/* Headless render test for app.js.
 *
 * The page has no build step and no browser test runner, so this stubs just
 * enough DOM to run app.js for real and then asserts on the HTML it produces.
 * It catches the failures that actually happen here: a renamed data field, a
 * broken month load, a quiet week that renders as a blank chapter.
 *
 * It does NOT check layout or CSS. Look at the page for that.
 *
 * Usage:  node scripts/smoke_test.js        (from the repo root)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function makeEl() {
  return {
    _html: '', textContent: '', hidden: false, disabled: false, title: '', href: '',
    style: { setProperty() {} },
    classList: {
      _s: new Set(),
      add(c) { this._s.add(c); },
      remove(c) { this._s.delete(c); },
      toggle(c, force) {
        const on = force === undefined ? !this._s.has(c) : force;
        if (on) this._s.add(c); else this._s.delete(c);
        return on;
      },
      contains(c) { return this._s.has(c); },
    },
    setAttribute(k, v) { this._attrs = this._attrs || {}; this._attrs[k] = v; if (k === 'href') this.href = v; },
    getAttribute(k) { return this._attrs && k in this._attrs ? this._attrs[k] : null; },
    addEventListener() {}, focus() {}, closest() { return null; },
    querySelectorAll() { return []; }, appendChild() {},
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = v; },
  };
}

const els = new Map();
const el = id => {
  if (!els.has(id)) els.set(id, makeEl());
  return els.get(id);
};

const pending = [];          // <script> tags app.js injected to load a month
const document = {
  body: makeEl(),
  head: { appendChild(node) { pending.push(node); } },
  title: '',
  querySelector(sel) { return el(sel.replace(/^#/, '')); },
  getElementById(id) { return el(id); },
  createElement() { return { src: '', onload: null, onerror: null }; },
  addEventListener() {},
};

const sandbox = {
  console, document, Date, Math, JSON,
  location: { hash: '' },
  window: { addEventListener() {}, REVIEW_MONTHS: undefined },
  IntersectionObserver: class { observe() {} disconnect() {} },
};
vm.createContext(sandbox);

const run = file => vm.runInContext(
  fs.readFileSync(path.join(ROOT, file), 'utf8'), sandbox, { filename: file });

run('data/index.js');
// Data files write to `window.X`; app.js reads bare `X`. Bridge the two.
sandbox.REVIEW_INDEX = sandbox.window.REVIEW_INDEX;
Object.defineProperty(sandbox, 'REVIEW_MONTHS', {
  get: () => sandbox.window.REVIEW_MONTHS,
  set: v => { sandbox.window.REVIEW_MONTHS = v; },
  configurable: true,
});

const failures = [];
const check = (name, cond, detail) => {
  if (cond) { console.log(`  ok   ${name}`); return; }
  console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  failures.push(name);
};
const tick = () => new Promise(resolve => setImmediate(resolve));
const count = (html, re) => (html.match(re) || []).length;

/* app.js has no exports, so navigation is driven by setting location.hash and
 * re-running it — that reproduces show(resolve()) exactly as a hashchange does. */
async function navigate(hash) {
  sandbox.location.hash = hash;
  run('app.js');
  const injected = pending.shift();
  if (injected) {
    const file = injected.src;
    if (fs.existsSync(path.join(ROOT, file))) { run(file); injected.onload(); }
    else injected.onerror();
  }
  await tick();
  return injected;
}

async function main() {
  const hero = el('heroTitle');
  const lede = el('heroLede');
  const eyebrow = el('heroEyebrow');
  const weeks = el('weekList');
  const nav = el('weekNav');
  const metrics = el('metricGrid');
  const menu = el('monthMenu');

  // The stub fabricates an element for any selector, so the per-month checks below only prove
  // updateHead() wrote *something* — they can't see whether the static tags a scraper reads are
  // actually in the HTML. Assert that half directly against the file.
  console.log('\n== static link-preview tags present in index.html ==');
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const sel of ['property="og:title"', 'property="og:description"', 'property="og:url"',
                     'property="og:image"', 'name="twitter:card"', 'rel="canonical"']) {
    check(`index.html carries ${sel}`, indexHtml.includes(sel));
  }

  console.log('\n== no hash: newest month ==');
  const first = await navigate('');
  check('loaded the newest month file', first && first.src === 'data/months/2026-07.js', first && first.src);
  check('hero splits month and year', hero.innerHTML === 'July<br /><span>2026</span>', hero.innerHTML);
  check('coverage range is compact', /Covers Jul 1–24, 2026/.test(eyebrow.textContent), eyebrow.textContent);
  check('in-progress month flagged', /month in progress/.test(eyebrow.textContent), eyebrow.textContent);
  check('lede rendered', lede.textContent.length > 40);
  check('document title names the month', document.title === 'July 2026 — GitHub review — jsundram', document.title);
  const meta = sel => el(sel).getAttribute('content');
  check('og:title tracks the document title', meta('meta[property="og:title"]') === document.title, meta('meta[property="og:title"]'));
  check('og:description filled from the lede', (meta('meta[property="og:description"]') || '').length > 40);
  check('meta description mirrors og:description', meta('meta[name="description"]') === meta('meta[property="og:description"]'));
  check('og:url carries the month hash', /\/github-month-review\/#2026-07$/.test(el('meta[property="og:url"]').getAttribute('content')), el('meta[property="og:url"]').getAttribute('content'));
  check('metrics rendered', count(metrics.innerHTML, /class="metric"/g) === 4);
  check('active weeks rendered', count(weeks.innerHTML, /<article class="week-chapter"/g) === 4);
  check('quiet week rendered compactly', count(weeks.innerHTML, /week-chapter quiet/g) === 1);
  check('uncovered week says so', /Not covered/.test(weeks.innerHTML));
  check('week ids namespaced by month', /id="2026-07-w1"/.test(weeks.innerHTML));
  check('every week is in the nav', count(nav.innerHTML, /week-nav-button/g) === 5);
  check('quiet week dimmed in nav', /week-nav-button quiet/.test(nav.innerHTML));
  check('evidence wrapped for animation', /evidence-inner/.test(weeks.innerHTML));
  check('intensity bars filled', /class="on"/.test(weeks.innerHTML));
  check('themes derived from weeks', /Platform/.test(el('heroThemes').innerHTML));
  // The [" ] guard keeps month-option-label / month-option-tag out of the count.
  check('menu lists every month', count(menu.innerHTML, /class="month-option[" ]/g) === 2);
  check('menu tags the in-progress month', /in progress/.test(menu.innerHTML));
  check('no next month, prev available', el('monthNext').disabled && !el('monthPrev').disabled);
  check('no undefined in markup', !/undefined/.test(weeks.innerHTML + metrics.innerHTML + menu.innerHTML));
  check('footer names the month', el('footerLine').textContent.endsWith('July 2026'), el('footerLine').textContent);
  check('metrics present, band shown', !document.body.classList.contains('no-metrics'));
  check('July loose threads shown', el('threads').hidden === false);
  check('July has three threads', count(el('threadList').innerHTML, /class="thread"/g) === 3);
  check('an active thread is labelled', /thread-status active">Still going/.test(el('threadList').innerHTML));
  check('scroll cue targets the band', el('scrollCue').href === '#overview', el('scrollCue').href);

  console.log('\n== older month loads on demand ==');
  const june = await navigate('#2026-06');
  check('fetched the June file', june && june.src === 'data/months/2026-06.js', june && june.src);
  check('hero shows June', hero.innerHTML === 'June<br /><span>2026</span>', hero.innerHTML);
  check('June is not in progress', !/in progress/.test(eyebrow.textContent), eyebrow.textContent);
  check('June metrics rendered', count(metrics.innerHTML, /class="metric"/g) === 4);
  check('June is fully active', count(weeks.innerHTML, /week-chapter quiet/g) === 0);
  check('June active weeks rendered', count(weeks.innerHTML, /<article class="week-chapter"/g) === 5);
  check('next available, no prev', !el('monthNext').disabled && el('monthPrev').disabled);
  check('June loose threads shown', el('threads').hidden === false);
  check('two threads rendered', count(el('threadList').innerHTML, /class="thread"/g) === 2);
  check('thread status labelled', /thread-status parked">Parked/.test(el('threadList').innerHTML));
  check('thread links to where it stopped', /Where it stopped/.test(el('threadList').innerHTML));

  console.log('\n== unknown hash falls back to newest ==');
  const missing = await navigate('#1999-01');
  check('rendered July', hero.innerHTML === 'July<br /><span>2026</span>', hero.innerHTML);
  check('served from cache, no refetch', !missing);

  console.log('\n== a month file that will not load ==');
  sandbox.window.REVIEW_INDEX.months.push(
    { id: '2020-01', label: 'January 2020', file: 'data/months/does-not-exist.js', status: 'active' });
  await navigate('#2020-01');
  check('body marked load-error', document.body.classList.contains('load-error'));
  check('the reason is on screen', /Could not load/.test(lede.textContent), lede.textContent);

  console.log('\n== a month with no activity ==');
  sandbox.window.REVIEW_MONTHS['2020-01'] = {
    id: '2020-01', label: 'January 2020', status: 'quiet',
    coverage: { start: '2020-01-01', end: '2020-01-31' },
    lede: 'Nothing public this month.',
    quietNote: 'Away from the keyboard.', metrics: [], weeks: [],
  };
  await navigate('#2020-01');
  check('quiet-month block rendered', /month-quiet/.test(weeks.innerHTML));
  check('quietNote used verbatim', /Away from the keyboard/.test(weeks.innerHTML));
  check('week nav cleared', nav.innerHTML === '', nav.innerHTML);
  check('empty metric grid hidden', metrics.hidden === true);
  check('body marked month-is-quiet', document.body.classList.contains('month-is-quiet'));
  check('threads hidden on a quiet month', el('threads').hidden === true);
  check('body marked no-metrics', document.body.classList.contains('no-metrics'));
  check('scroll cue skips the empty band', el('scrollCue').href === '#story', el('scrollCue').href);
  check('load-error cleared', !document.body.classList.contains('load-error'));
}

main().then(() => {
  console.log(failures.length ? `\n${failures.length} failure(s)\n` : '\nall checks passed\n');
  process.exit(failures.length ? 1 : 0);
});
