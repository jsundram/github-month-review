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
// Preloaded, as index.html would after its first lazy load, so the only script app.js
// injects below is the month file. The missing-build-log path is tested on its own at the end.
run('data/buildlog.js');
run('charts.js');
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
  check('hours section shown', el('hours').hidden === false);
  check('hours chart drawn as SVG', /<svg class="chart-svg"/.test(el('hoursChart').innerHTML));
  check('one hit target per day of August', count(el('hoursChart').innerHTML, /class="hit"/g) === 31);
  check('legend names projects and Other', /legend-item/.test(el('hoursLegend').innerHTML));
  check('hours stats rendered', /hands-on hours/.test(el('hoursStats').innerHTML));
  check('every week carries an hours line', count(weeks.innerHTML, /class="week-hours"/g) === 6);
  check('week hours link into the build log', /href="buildlog\.html#p=[^"&]+&amp;m=2026-08"/.test(weeks.innerHTML));
  check('project cards link the repository and the build log', /<nav class="project-links"[^>]*><a href="https:\/\/github\.com\/[^"]+"[^>]*>Repository ↗<\/a><span aria-hidden="true">\|<\/span><a href="buildlog\.html#p=[^"&]+&amp;m=2026-08">Build log<\/a>/.test(weeks.innerHTML));
  check('week hours lines carry project swatches', /week-hours[^]*?class="swatch"/.test(weeks.innerHTML));
  check('build log link scoped to the month', el('hoursLink').href === 'buildlog.html#m=2026-08', el('hoursLink').href);
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
  check('a month outside the build log hides the hours section', el('hours').hidden === true);
  check('no hours line outside the build log', !/week-hours/.test(weeks.innerHTML));

  console.log('\n== July: travel from Swarm ==');
  await navigate('#2026-07');
  check('away days marked under the chart', /class="away"/.test(el('hoursChart').innerHTML));
  check('away key in the legend', /away-key/.test(el('hoursLegend').innerHTML));
  check('a week names where it was spent', /class="away">[^<]*Austria/.test(weeks.innerHTML));

  console.log('\n== no build log ==');
  const log = sandbox.window.REVIEW_BUILDLOG;
  delete sandbox.window.REVIEW_BUILDLOG;
  pending.length = 0;
  await navigate('#2026-08');
  check('hours section hidden until it loads', el('hours').hidden === true);
  check('weeks render without hours lines', count(weeks.innerHTML, /<article class="week-chapter"/g) === 6
    && !/week-hours/.test(weeks.innerHTML));
  check('build log requested lazily', pending.some(node => node.src === 'data/buildlog.js'));
  sandbox.window.REVIEW_BUILDLOG = log;

  // buildlog.html: the same stub DOM, its own script. Element ids differ from index.html's.
  console.log('\n== build log: all projects, all months ==');
  run('data/buildlog-detail.js');
  const logPage = async hash => { sandbox.location.hash = hash; run('buildlog-app.js'); await tick(); };
  await logPage('');
  const stats = el('logStats').innerHTML;
  check('title says all projects', el('logTitle').textContent === 'All projects', el('logTitle').textContent);
  check('stats include hours, commits, and cost', /hands-on hours/.test(stats) && /commits on GitHub/.test(stats) && /API-equivalent cost/.test(stats));
  check('weekly bars across the range', count(el('logHours').innerHTML, /class="hit"/g) > 15);
  check('a legend for the stack', count(el('logHoursLegend').innerHTML, /legend-item/g) >= 2);
  check('time of day has 48 slots', count(el('logClock').innerHTML, /class="hit"/g) === 48);
  check('calendar has a square per day', count(el('logCalendar').innerHTML, /class="hit cal-hit"/g) === sandbox.window.REVIEW_BUILDLOG.days.length);
  check('calendar offers hours and commits', /data-mode="hours"/.test(el('calendarMode').innerHTML) && /data-mode="commits"/.test(el('calendarMode').innerHTML));
  check('hours tooltips carry API-equivalent cost', el('logHours')._tips.some(t => t.rows.some(r => /API-equivalent/.test(r.name))));
  check('project chips wear their chart colour', /chip tinted" href="#p=[^"]+" style="--c:#[0-9a-f]{6}"/.test(el('projectFilter').innerHTML));
  check('a chip and its legend entry share a colour', (() => {
    const m = el('logHoursLegend').innerHTML.match(/background:(#[0-9a-f]{6})"><\/i>([^<]+)</);
    return m && el('projectFilter').innerHTML.includes(`href="#p=${encodeURIComponent(m[2])}" style="--c:${m[1]}"`);
  })());
  check('ship and session rows carry a swatch', /class="swatch"/.test(el('shipLog').innerHTML) && /class="swatch"/.test(el('sessionTable').innerHTML));
  check('table view rendered', /<table class="data-table">/.test(el('logHoursTable').innerHTML));
  check('ship log lists commits', /class="ship-day"/.test(el('shipLog').innerHTML));
  check('sessions table rendered', /<table class="data-table">/.test(el('sessionTable').innerHTML));
  check('no session titles leak into the page data', !Object.prototype.hasOwnProperty.call(sandbox.window.REVIEW_BUILDLOG_DETAIL.sessions[0], 'title'));
  check('range chips for every month', count(el('rangeFilter').innerHTML, /class="chip/g) === 1 + new Set(sandbox.window.REVIEW_BUILDLOG.days.map(d => d.d.slice(0, 7))).size);

  const localCommit = sandbox.window.REVIEW_BUILDLOG_DETAIL.commits.find(c => !c.url);
  if (localCommit) {
    await logPage(`#p=${encodeURIComponent(localCommit.p)}`);
    check('a local commit shows without a link', el('shipLog').innerHTML.includes(`<span>${localCommit.msg.replace(/&/g, '&amp;').replace(/</g, '&lt;')}`)
      && !/href="(undefined)?"/.test(el('shipLog').innerHTML));
  }

  console.log('\n== build log: one project, one month ==');
  await logPage('#p=AKM&m=2026-07');
  check('title is the project', el('logTitle').textContent === 'AKM', el('logTitle').textContent);
  check('July has a bar per day', count(el('logHours').innerHTML, /class="hit"/g) === 31);
  check('commit ticks on the bars', /commit-tick/.test(el('logHours').innerHTML));
  check('a single series needs no legend', !/legend-item"/.test(el('logHoursLegend').innerHTML.replace(/away-key/g, '')));
  check('ship log omits the repo column', !/<code>AKM<\/code>/.test(el('shipLog').innerHTML));
  check('active chip marked', /chip active tinted" href="#p=AKM&amp;m=2026-07"/.test(el('projectFilter').innerHTML));
  check('July calendar has a square per day', count(el('logCalendar').innerHTML, /class="hit cal-hit"/g) === 31);
  check('month review link goes to July', el('monthLink').href === 'index.html#2026-07', el('monthLink').href);

  console.log('\n== build log: switching projects keeps every project\'s data ==');
  const before = JSON.stringify(sandbox.window.REVIEW_BUILDLOG.days);
  await logPage('#p=gerard');
  await logPage('#p=AKM');
  check('the shared day data is never edited', JSON.stringify(sandbox.window.REVIEW_BUILDLOG.days) === before);
  check('a second project still has hours', /AKM/.test(el('logHours')._tips.map(t => t.rows.map(r => r.name).join()).join()));
  const akm = sandbox.window.ReviewCharts.projectColors(sandbox.window.REVIEW_BUILDLOG.days).AKM;
  check('its calendar wears its colour', el('logCalendar').innerHTML.includes(`fill="${akm}"`));
  await logPage('');
  check('all projects again has a full legend', count(el('logHoursLegend').innerHTML, /legend-item/g) >= 5);
  check('hours tooltips name projects, not Other', el('logHours')._tips.every(t => !t.rows.some(r => r.name === 'Other'))
    && el('logHours')._tips.some(t => t.rows.some(r => r.color === sandbox.window.ReviewCharts.OTHER && r.name !== 'unnamed work' && !/more$/.test(r.name))));
  check('calendar tooltips name the repos behind a day\'s commits', el('logCalendar')._tips.some(t => {
    const i = t.rows.findIndex(r => /^commits?$/.test(r.name));
    return i >= 0 && t.rows.length > i + 1 && /^\d+$/.test(t.rows[i + 1].value);
  }));
  check('calendar tooltips name projects, not Other', el('logCalendar')._tips.every(t => !t.rows.some(r => r.name === 'Other')));
  check('calendar legend has a row per month', count(el('logCalendarLegend').innerHTML, /class="cal-legend-month"/g) === new Set(sandbox.window.REVIEW_BUILDLOG.days.map(d => d.d.slice(0, 7))).size);
  check('calendar legend names are buttons that pick a project', /<button type="button" class="legend-item legend-pick" data-p="[^"]+"/.test(el('logCalendarLegend').innerHTML)
    && !/legend-pick" data-p="Other"/.test(el('logCalendarLegend').innerHTML));
  check('calendar depth steps come from the data', /up to [\d.]+h · /.test(el('logCalendarLegend').innerHTML), el('logCalendarLegend').innerHTML.match(/<small>[^<]*<\/small>/));
  check('calendar month labels link to the month', /<a class="cal-month" href="#m=2026-07">/.test(el('logCalendar').innerHTML));
  check('calendar days are not links', !/onSelect|cal-hit[^>]*href/.test(el('logCalendar').innerHTML));

  console.log('\n== build log: unknown project falls back to all ==');
  await logPage('#p=nope&m=1999-01');
  check('falls back to all projects', el('logTitle').textContent === 'All projects');
}

main().then(() => {
  console.log(failures.length ? `\n${failures.length} failure(s)\n` : '\nall checks passed\n');
  process.exit(failures.length ? 1 : 0);
});
