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

  // The newest month changes every month, so derive it from the index rather than naming it.
  const indexMonths = [...sandbox.window.REVIEW_INDEX.months].sort((a, b) => b.id.localeCompare(a.id));
  const newest = indexMonths[0];
  const [newestName, newestYear] = newest.label.split(' ');

  console.log(`\n== no hash: newest month (${newest.id}) ==`);
  const first = await navigate('');
  check('loaded the newest month file', first && first.src === newest.file, first && first.src);
  const newestData = sandbox.window.REVIEW_MONTHS[newest.id] || {};
  check('hero splits month and year', hero.innerHTML === `${newestName}<br /><span>${newestYear}</span>`, hero.innerHTML);
  check('in-progress flag matches the data', /month in progress/.test(eyebrow.textContent) === !!newestData.inProgress, eyebrow.textContent);
  check('lede rendered', lede.textContent.length > 40);
  check('document title names the month', document.title === `${newest.label} — GitHub review — jsundram`, document.title);
  const meta = sel => el(sel).getAttribute('content');
  check('og:title tracks the document title', meta('meta[property="og:title"]') === document.title, meta('meta[property="og:title"]'));
  check('og:description filled from the lede', (meta('meta[property="og:description"]') || '').length > 40);
  check('meta description mirrors og:description', meta('meta[name="description"]') === meta('meta[property="og:description"]'));
  check('og:url carries the month hash', new RegExp(`/github-month-review/#${newest.id}$`).test(meta('meta[property="og:url"]')), meta('meta[property="og:url"]'));
  check('every week rendered', count(weeks.innerHTML, /<article class="week-chapter/g) === (newestData.weeks || []).length);
  check('week ids namespaced by month', new RegExp(`id="${newest.id}-w1"`).test(weeks.innerHTML));
  check('every week is in the nav', count(nav.innerHTML, /week-nav-button/g) === (newestData.weeks || []).length);
  // The [" ] guard keeps month-option-label / month-option-tag out of the count.
  check('menu lists every month', count(menu.innerHTML, /class="month-option[" ]/g) === indexMonths.length);
  check('no next month, prev available', el('monthNext').disabled && !el('monthPrev').disabled);
  check('no undefined in markup', !/undefined/.test(weeks.innerHTML + metrics.innerHTML + menu.innerHTML));
  check('footer names the month', el('footerLine').textContent.endsWith(newest.label), el('footerLine').textContent);

  console.log('\n== August, by hash ==');
  await navigate('#2026-08');
  check('hero shows August', hero.innerHTML === 'August<br /><span>2026</span>', hero.innerHTML);
  check('coverage range is compact', /Covers Aug 1–31, 2026/.test(eyebrow.textContent), eyebrow.textContent);
  check('completed month not flagged in progress', !/month in progress/.test(eyebrow.textContent), eyebrow.textContent);
  check('metrics rendered', count(metrics.innerHTML, /class="metric"/g) === 4);
  check('active weeks rendered', count(weeks.innerHTML, /<article class="week-chapter"/g) === 6);
  check('August is fully active', count(weeks.innerHTML, /week-chapter quiet/g) === 0);
  check('week ids namespaced by month', /id="2026-08-w1"/.test(weeks.innerHTML));
  check('evidence wrapped for animation', /evidence-inner/.test(weeks.innerHTML));
  check('intensity bars filled', /class="on"/.test(weeks.innerHTML));
  check('themes derived from weeks', /Platform/.test(el('heroThemes').innerHTML));
  check('a middle month has next and prev', !el('monthNext').disabled && !el('monthPrev').disabled);
  check('footer names the month', el('footerLine').textContent.endsWith('August 2026'), el('footerLine').textContent);
  check('metrics present, band shown', !document.body.classList.contains('no-metrics'));
  check('August loose threads shown', el('threads').hidden === false);
  check('August has four threads', count(el('threadList').innerHTML, /class="thread"/g) === 4);
  check('an active thread is labelled', /thread-status active">Still going/.test(el('threadList').innerHTML));
  check('a dropped thread is labelled', /thread-status dropped/.test(el('threadList').innerHTML));
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
  check('rendered the newest month', hero.innerHTML === `${newestName}<br /><span>${newestYear}</span>`, hero.innerHTML);
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

  // Real months no longer exercise these paths (July completed), so fabricate one that does.
  console.log('\n== quiet and uncovered weeks, in-progress month ==');
  sandbox.window.REVIEW_INDEX.months.push(
    { id: '2020-02', label: 'February 2020', file: 'data/months/2020-02.js', status: 'active', inProgress: true });
  sandbox.window.REVIEW_MONTHS['2020-02'] = {
    id: '2020-02', label: 'February 2020', status: 'active', inProgress: true,
    coverage: { start: '2020-02-01', end: '2020-02-16' },
    lede: 'A synthetic month exercising the quiet-week, uncovered-week, and in-progress paths.',
    metrics: [],
    weeks: [
      { id: 'w1', number: '01', range: 'Feb 3–9', dates: { start: '2020-02-03', end: '2020-02-09' },
        status: 'active', intensity: 2, title: 'Something.', summary: 'One active week.',
        themes: [], evidence: [],
        projects: [
          { name: 'With a shot', repo: 'shot-repo', desc: 'Has an image.', url: 'https://example.com/a',
            image: { src: 'assets/projects/shot-repo.jpg', alt: 'A "quoted" page & more' } },
          { name: 'Without', repo: 'plain-repo', desc: 'No image.', url: 'https://example.com/b' },
        ] },
      { id: 'w2', number: '02', range: 'Feb 10–16', dates: { start: '2020-02-10', end: '2020-02-16' },
        status: 'quiet', note: 'Nothing committed.' },
      { id: 'w3', number: '03', range: 'Feb 17–23', dates: { start: '2020-02-17', end: '2020-02-23' },
        status: 'nodata', note: 'Outside the snapshot.' },
    ],
  };
  await navigate('#2020-02');
  check('in-progress month flagged', /month in progress/.test(eyebrow.textContent), eyebrow.textContent);
  check('menu tags the in-progress month', /in progress/.test(menu.innerHTML));
  check('quiet weeks rendered compactly', count(weeks.innerHTML, /week-chapter quiet/g) === 2);
  check('quiet week says nothing recorded', /Nothing recorded/.test(weeks.innerHTML));
  check('uncovered week says so', /Not covered/.test(weeks.innerHTML));
  check('quiet week dimmed in nav', /week-nav-button quiet/.test(nav.innerHTML));
  check('one project screenshot rendered', count(weeks.innerHTML, /<img class="project-shot"/g) === 1);
  check('only the card with an image is marked', count(weeks.innerHTML, /project-card has-shot"/g) === 1
    && count(weeks.innerHTML, /class="project-card"/g) === 1);
  check('screenshot is lazy with a reserved box', /project-shot"[^>]*width="1200" height="750" loading="lazy"/.test(weeks.innerHTML));
  check('screenshot alt is escaped', /alt="A &quot;quoted&quot; page &amp; more"/.test(weeks.innerHTML));
}

main().then(() => {
  console.log(failures.length ? `\n${failures.length} failure(s)\n` : '\nall checks passed\n');
  process.exit(failures.length ? 1 : 0);
});
