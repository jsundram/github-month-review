(() => {
  const index = window.REVIEW_INDEX;
  if (!index || !Array.isArray(index.months) || !index.months.length) {
    document.body.classList.add('load-error');
    return;
  }

  // Newest first, defensively re-sorted so data/index.js order is not load-bearing.
  const months = index.months.slice().sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
  const loaded = (window.REVIEW_MONTHS = window.REVIEW_MONTHS || {});
  const Charts = window.ReviewCharts;
  const LOG_FILE = 'data/buildlog.js';

  const THEME_NAMES = {
    travel: 'Travel utility',
    music: 'Music data',
    visual: 'Visual design',
    platform: 'Platform',
    field: 'Field operation',
    infra: 'Infrastructure',
    writing: 'Writing'
  };

  const $ = sel => document.querySelector(sel);
  const esc = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const el = {
    heroEyebrow: $('#heroEyebrow'),
    heroTitle: $('#heroTitle'),
    heroLede: $('#heroLede'),
    heroThemes: $('#heroThemes'),
    metricGrid: $('#metricGrid'),
    overviewNote: $('#overviewNote'),
    scrollCue: $('#scrollCue'),
    weekNav: $('#weekNav'),
    weekList: $('#weekList'),
    threads: $('#threads'),
    threadList: $('#threadList'),
    monthPrev: $('#monthPrev'),
    monthNext: $('#monthNext'),
    monthCurrent: $('#monthCurrent'),
    monthCurrentLabel: $('#monthCurrentLabel'),
    monthMenu: $('#monthMenu'),
    footerLine: $('#footerLine'),
    profileLink: $('#profileLink'),
    reposLink: $('#reposLink'),
    hours: $('#hours'),
    hoursStats: $('#hoursStats'),
    hoursChart: $('#hoursChart'),
    hoursLegend: $('#hoursLegend'),
    hoursLink: $('#hoursLink')
  };

  if (index.profile) {
    el.profileLink.href = index.profile;
    el.reposLink.href = `${index.profile}?tab=repositories`;
  }

  let current = null;
  let weekObserver = null;

  /* ---------------------------------------------------------------- loading */

  function loadMonth(id) {
    if (loaded[id]) return Promise.resolve(loaded[id]);
    const entry = months.find(m => m.id === id);
    if (!entry) return Promise.reject(new Error(`No month "${id}" in data/index.js`));
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = entry.file;
      script.onload = () => loaded[id]
        ? resolve(loaded[id])
        : reject(new Error(`${entry.file} loaded but defined no window.REVIEW_MONTHS["${id}"]`));
      script.onerror = () => reject(new Error(`Could not load ${entry.file}`));
      document.head.appendChild(script);
    });
  }

  // The build log is optional: without it (or before it arrives) the hours section and the
  // per-week lines stay hidden and the page reads exactly as it did before.
  let logLoading = null;
  function loadLog() {
    if (window.REVIEW_BUILDLOG) return Promise.resolve(window.REVIEW_BUILDLOG);
    if (logLoading) return logLoading;
    logLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = LOG_FILE;
      script.onload = () => window.REVIEW_BUILDLOG ? resolve(window.REVIEW_BUILDLOG) : reject(new Error('empty build log'));
      script.onerror = () => reject(new Error(`Could not load ${LOG_FILE}`));
      document.head.appendChild(script);
    });
    return logLoading;
  }

  /* --------------------------------------------------------------- switcher */

  function renderSwitcher(activeId) {
    const at = months.findIndex(m => m.id === activeId);
    const entry = months[at];
    el.monthCurrentLabel.textContent = entry ? entry.label : activeId;

    // months[0] is the newest, so "next" walks toward the start of the array.
    const newer = months[at - 1];
    const older = months[at + 1];
    el.monthNext.disabled = !newer;
    el.monthPrev.disabled = !older;
    el.monthNext.title = newer ? newer.label : 'No later month yet';
    el.monthPrev.title = older ? older.label : 'No earlier month';
    el.monthNext.onclick = () => newer && go(newer.id);
    el.monthPrev.onclick = () => older && go(older.id);

    el.monthMenu.innerHTML = months.map(m => `
      <li role="option" aria-selected="${m.id === activeId}">
        <button type="button" class="month-option${m.id === activeId ? ' current' : ''}" data-month="${esc(m.id)}">
          <span class="month-option-label">${esc(m.label)}</span>
          ${m.status === 'quiet' ? '<span class="month-option-tag">quiet</span>' : ''}
          ${m.inProgress ? '<span class="month-option-tag">in progress</span>' : ''}
          ${m.blurb ? `<small>${esc(m.blurb)}</small>` : ''}
        </button>
      </li>`).join('');

    el.monthMenu.querySelectorAll('.month-option').forEach(button => {
      button.addEventListener('click', () => { closeMenu(); go(button.dataset.month); });
    });
  }

  function openMenu() {
    el.monthMenu.hidden = false;
    el.monthCurrent.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    el.monthMenu.hidden = true;
    el.monthCurrent.setAttribute('aria-expanded', 'false');
  }

  el.monthCurrent.addEventListener('click', event => {
    event.stopPropagation();
    el.monthMenu.hidden ? openMenu() : closeMenu();
  });
  document.addEventListener('click', event => {
    if (!el.monthMenu.hidden && !event.target.closest('.month-picker')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !el.monthMenu.hidden) { closeMenu(); el.monthCurrent.focus(); }
  });

  /* -------------------------------------------------------------- rendering */

  const sumHours = h => Object.values(h || {}).reduce((a, b) => a + b, 0);
  const logDays = (start, end) => ((window.REVIEW_BUILDLOG || {}).days || []).filter(d => d.d >= start && d.d <= end);
  const covered = (start, end) => {
    const range = (window.REVIEW_BUILDLOG || {}).range;
    return !!range && end >= range.start && start <= range.end;
  };
  const logLink = (params) => `buildlog.html#${Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
  const unique = list => list.filter((x, i) => x && list.indexOf(x) === i);
  const monthBounds = id => {
    const [y, m] = id.split('-').map(Number);
    return [`${id}-01`, `${id}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, '0')}`];
  };

  // Each project keeps one colour across the site (charts.js projectColors); a month's
  // chart names its seven biggest, and the rest are Other. Cached per month.
  let colors = null;
  const seriesCache = {};
  function monthSeries(monthId) {
    if (seriesCache[monthId]) return seriesCache[monthId];
    colors = colors || Charts.projectColors(window.REVIEW_BUILDLOG.days);
    const totals = {};
    logDays(...monthBounds(monthId)).forEach(d => Object.entries(d.h).forEach(([p, h]) => { totals[p] = (totals[p] || 0) + h; }));
    const out = Charts.seriesFor(totals, 7, colors);
    out.colorOf = id => (out.series.find(x => x.id === id) || { color: Charts.OTHER }).color;
    seriesCache[monthId] = out;
    return out;
  }
  const swatch = color => `<i class="swatch" style="background:${esc(color)}"></i>`;
  const logProject = id => ((window.REVIEW_BUILDLOG || {}).projects || []).some(p => p.id === id && p.id !== 'Other');

  // "12.5 hands-on hours · AKM 8.0 · quartet-log 3.1 · 2 more · Austria", or nothing.
  function weekHours(week, monthId) {
    if (!week.dates || !covered(week.dates.start, week.dates.end)) return '';
    const days = logDays(week.dates.start, week.dates.end);
    const by = {};
    days.forEach(d => Object.entries(d.h).forEach(([p, h]) => { by[p] = (by[p] || 0) + h; }));
    const total = sumHours(by);
    const away = unique(days.map(d => d.region));
    const where = away.length ? ` · <span class="away">${esc(away.join(', '))}</span>` : '';
    if (total < 0.05) return `<p class="week-hours">No AI sessions logged${where}</p>`;
    const ranked = Object.entries(by).filter(([p]) => p !== 'Other').sort((a, b) => b[1] - a[1]);
    const shown = ranked.filter(([, h]) => h >= 0.5).slice(0, 3);
    const rest = Object.keys(by).length - shown.length;
    const { colorOf } = monthSeries(monthId);
    const named = shown.map(([p, h]) =>
      `${swatch(colorOf(p))}<a href="${esc(logLink({ p, m: monthId }))}">${esc(p)}</a> ${esc(Charts.num(h))}`).join(' · ');
    return `<p class="week-hours"><b>${esc(Charts.num(total))} hands-on hours</b>${named ? ` · ${named}` : ''}${
      rest > 0 ? ` · ${rest} more` : ''}${where}</p>`;
  }

  const DAY = { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' };
  const dayTitle = iso => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', DAY);

  function renderHours(month) {
    const [start, end] = monthBounds(month.id);
    if (!window.REVIEW_BUILDLOG) {
      el.hours.hidden = true;
      loadLog().then(() => { if (current === month) render(month); }).catch(() => {});
      return;
    }
    const days = logDays(start, end);
    const total = days.reduce((a, d) => a + sumHours(d.h), 0);
    el.hours.hidden = !covered(start, end) || total < 0.05;
    if (el.hours.hidden) return;

    const { series, fold } = monthSeries(month.id);
    const columns = days.map((d, i) => {
      const date = new Date(`${d.d}T12:00:00Z`);
      const first = i === 0 || date.getUTCDay() === 1;
      return {
        label: first ? (i === 0 ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
          : String(date.getUTCDate())) : '',
        title: dayTitle(d.d), sub: d.place || '', values: fold(d.h), detail: d.h
      };
    });
    const bands = [];
    days.forEach((d, i) => {
      const last = bands[bands.length - 1];
      if (!d.region) return;
      if (last && last.label === d.region && last.to === i - 1) last.to = i;
      else bands.push({ from: i, to: i, label: d.region });
    });
    Charts.stacked(el.hoursChart, { columns, series, unit: 'h', height: 240, bands,
      label: `Hands-on hours by project and day, ${month.label}` });
    Charts.legend(el.hoursLegend, series, bands.length
      ? '<span class="legend-item away-key"><i></i>Away from home</span>' : '');

    const active = days.filter(d => sumHours(d.h) >= 0.25).length;
    const away = unique(days.map(d => d.region));
    el.hoursStats.innerHTML = `
      <span><b>${esc(Charts.num(total, 0))}</b> hands-on hours</span>
      <span><b>${active}</b> of ${days.length} days with sessions</span>
      ${away.length ? `<span>Away: <b>${esc(away.join(', '))}</b></span>` : ''}`;
    el.hoursLink.href = logLink({ m: month.id });
  }

  function renderHero(month) {
    const coverage = month.coverage
      ? `Covers ${formatRange(month.coverage.start, month.coverage.end)}`
      : month.label;
    el.heroEyebrow.textContent = month.inProgress ? `${coverage} · month in progress` : coverage;

    const [name, year] = month.label.split(' ');
    el.heroTitle.innerHTML = year ? `${esc(name)}<br /><span>${esc(year)}</span>` : esc(month.label);
    el.heroLede.textContent = month.lede || '';

    const themes = [];
    (month.weeks || []).forEach(week => (week.themes || []).forEach(theme => {
      if (!themes.includes(theme)) themes.push(theme);
    }));
    el.heroThemes.innerHTML = themes
      .map(theme => `<span>${esc(THEME_NAMES[theme] || theme)}</span>`)
      .join('<i></i>');
  }

  function renderMetrics(month) {
    const metrics = month.metrics || [];
    el.metricGrid.hidden = !metrics.length;
    // With no metrics the whole "at a glance" band is dead space; skip past it.
    document.body.classList.toggle('no-metrics', !metrics.length);
    el.scrollCue.setAttribute('href', metrics.length ? '#overview' : '#story');
    el.metricGrid.style.setProperty('--metric-count', String(metrics.length || 1));
    el.metricGrid.innerHTML = metrics.map(metric => `
      <div class="metric">
        <strong class="metric-value">${esc(metric.value)}</strong>
        <span class="metric-label">${esc(metric.label)}</span>
        ${metric.note ? `<small class="metric-note">${esc(metric.note)}</small>` : ''}
      </div>`).join('');
  }

  function renderNav(weeks) {
    el.weekNav.innerHTML = weeks.map((week, i) => `
      <button class="week-nav-button${i === 0 ? ' active' : ''}${isQuiet(week) ? ' quiet' : ''}"
              type="button" data-target="${esc(week.domId)}">${esc(week.number)} · ${esc(week.range)}</button>`).join('');
    el.weekNav.querySelectorAll('.week-nav-button').forEach(button => {
      button.addEventListener('click', () => {
        document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  const isQuiet = week => week.status === 'quiet' || week.status === 'nodata';

  function quietMarkup(week) {
    const heading = week.status === 'nodata' ? 'Not covered' : 'Nothing recorded';
    return `
      <article class="week-chapter quiet" id="${esc(week.domId)}">
        <aside class="week-rail">
          <span class="week-number">${esc(week.number)}</span>
          <span class="week-range">${esc(week.range)}</span>
        </aside>
        <div class="week-main">
          <p class="quiet-heading">${heading}</p>
          <p class="quiet-note">${esc(week.note || 'No activity in this week.')}</p>
          ${weekHours(week, week.monthId)}
        </div>
      </article>`;
  }

  function activeMarkup(week) {
    const intensity = Math.max(0, Math.min(5, week.intensity || 0));
    const projects = week.projects || [];
    const evidence = week.evidence || [];
    return `
      <article class="week-chapter" id="${esc(week.domId)}">
        <aside class="week-rail">
          <span class="week-number">${esc(week.number)}</span>
          <span class="week-range">${esc(week.range)}</span>
          <div class="intensity" aria-label="Activity intensity ${intensity} of 5">
            ${[1, 2, 3, 4, 5].map(i => `<i class="${i <= intensity ? 'on' : ''}"></i>`).join('')}
          </div>
        </aside>
        <div class="week-main">
          ${(week.themes || []).length ? `<div class="theme-list">${week.themes
            .map(t => `<span class="theme-tag">${esc(THEME_NAMES[t] || t)}</span>`).join('')}</div>` : ''}
          <h3>${esc(week.title)}</h3>
          ${weekHours(week, week.monthId)}
          <p class="week-summary">${esc(week.summary)}</p>
          ${projects.length ? `<div class="project-list">${projects.map(p => `
            <div class="project-card${p.image && p.image.src ? ' has-shot' : ''}">
              ${p.image && p.image.src ? `<a class="project-shot-link" href="${esc(p.url)}" target="_blank" rel="noreferrer" tabindex="-1"
                aria-hidden="true"><img class="project-shot" src="${esc(p.image.src)}" alt="${esc(p.image.alt || '')}"
                width="1200" height="750" loading="lazy" decoding="async"></a>` : ''}
              <header><h4>${esc(p.name)}</h4><code>${esc(p.repo)}</code></header>
              <p>${esc(p.desc)}</p>
              <nav class="project-links" aria-label="${esc(p.name)} links"><a href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.linkText || 'Repository')} ↗</a>${
                logProject(p.repo) ? `<span aria-hidden="true">|</span><a href="${esc(logLink({ p: p.repo, m: week.monthId }))}">Build log</a>` : ''}</nav>
            </div>`).join('')}</div>` : ''}
          ${week.note ? `<p class="week-note">${esc(week.note)}</p>` : ''}
          ${evidence.length ? `<div class="evidence"><div class="evidence-inner">
            <h5>Evidence</h5>
            <ul>${evidence.map(item =>
              `<li><a href="${esc(item.url)}" target="_blank" rel="noreferrer">${esc(item.text)} ↗</a></li>`).join('')}</ul>
          </div></div>` : ''}
        </div>
      </article>`;
  }

  function renderWeeks(month) {
    const weeks = (month.weeks || []).map(week => ({ ...week, domId: `${month.id}-${week.id}`, monthId: month.id }));

    if (!weeks.length || month.status === 'quiet') {
      el.weekNav.innerHTML = '';
      el.weekList.innerHTML = `
        <div class="month-quiet">
          <h3>A quiet month.</h3>
          <p>${esc(month.quietNote || month.lede || 'No GitHub activity recorded in this month.')}</p>
        </div>`;
      return weeks;
    }

    renderNav(weeks);
    el.weekList.innerHTML = weeks.map(w => (isQuiet(w) ? quietMarkup(w) : activeMarkup(w))).join('');
    return weeks;
  }

  const THREAD_STATUS = { parked: 'Parked', active: 'Still going', dropped: 'Dropped' };

  function renderThreads(month) {
    const threads = month.threads || [];
    el.threads.hidden = !threads.length;
    el.threadList.innerHTML = threads.map(thread => `
      <li class="thread">
        <div class="thread-head">
          <span class="thread-status ${esc(thread.status || 'parked')}">${
            esc(THREAD_STATUS[thread.status] || thread.status || 'Parked')}</span>
          ${thread.repo ? `<code>${esc(thread.repo)}</code>` : ''}
        </div>
        <h3>${esc(thread.title)}</h3>
        <p>${esc(thread.note)}</p>
        ${thread.url ? `<a href="${esc(thread.url)}" target="_blank" rel="noreferrer">Where it stopped ↗</a>` : ''}
      </li>`).join('');
  }

  function observeWeeks(weeks) {
    weekObserver?.disconnect();
    if (!weeks.length) return;
    weekObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      el.weekNav.querySelectorAll('.week-nav-button').forEach(button => {
        button.classList.toggle('active', button.dataset.target === visible.target.id);
      });
    }, { rootMargin: '-22% 0px -60% 0px', threshold: [0, 0.2, 0.5] });
    weeks.forEach(week => {
      const node = document.getElementById(week.domId);
      if (node) weekObserver.observe(node);
    });
  }

  // "Jul 1–23, 2026" within a month; "Jun 29–Jul 5, 2026" across one.
  function formatRange(start, end) {
    if (!start || !end) return start || end || '';
    const parse = iso => iso.split('-').map(Number);
    const [sy, sm, sd] = parse(start);
    const [ey, em, ed] = parse(end);
    const monthName = m => new Date(Date.UTC(2000, m - 1, 1))
      .toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
    const head = `${monthName(sm)} ${sd}`;
    if (sy === ey && sm === em && sd === ed) return `${head}, ${sy}`;
    const tail = sy === ey && sm === em ? String(ed) : `${monthName(em)} ${ed}`;
    return `${head}–${tail}, ${ey}`;
  }

  // Scrapers read the static <head>; this refreshes it for anything that runs JS — the browser tab,
  // a bookmark, and clients that render before scraping. Only rewrites tags already in the HTML
  // (never appends), and the og:image stays the one static card.
  function setMeta(selector, attr, value) {
    const node = document.querySelector(selector);
    if (node) node.setAttribute(attr, value);
  }

  function updateHead(month) {
    const title = `${month.label} — GitHub review — ${index.user}`;
    const desc = month.lede || `${index.user}'s GitHub work — ${month.label}.`;
    document.title = title;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    if (index.site) setMeta('meta[property="og:url"]', 'content', `${index.site}#${month.id}`);
  }

  function render(month) {
    current = month;
    updateHead(month);
    renderHero(month);
    renderMetrics(month);
    renderHours(month);
    observeWeeks(renderWeeks(month));
    renderThreads(month);
    el.footerLine.textContent = `${index.user} · GitHub review · ${month.label}`;
    document.body.classList.remove('load-error');
    document.body.classList.toggle('month-is-quiet', month.status === 'quiet');
  }

  function renderFailure(id, error) {
    document.body.classList.add('load-error');
    el.heroEyebrow.textContent = 'Could not load';
    el.heroTitle.textContent = id;
    el.heroLede.textContent = error.message;
    el.heroThemes.innerHTML = '';
    el.metricGrid.innerHTML = '';
    el.weekNav.innerHTML = '';
    el.weekList.innerHTML = '';
  }

  /* ---------------------------------------------------------------- routing */

  function go(id) {
    if (location.hash.slice(1) !== id) {
      location.hash = id;   // hashchange drives the render
      return;
    }
    show(id);
  }

  function show(id) {
    renderSwitcher(id);
    loadMonth(id).then(render).catch(error => renderFailure(id, error));
  }

  function resolve() {
    const wanted = decodeURIComponent(location.hash.slice(1));
    return months.some(m => m.id === wanted) ? wanted : months[0].id;
  }

  window.addEventListener('hashchange', () => show(resolve()));

  // A project screenshot that fails to load drops out; the card reads fine without it.
  // `error` does not bubble, so listen in the capture phase.
  el.weekList.addEventListener('error', event => {
    const img = event.target;
    if (!img.classList || !img.classList.contains('project-shot')) return;
    img.closest('.project-card').classList.remove('has-shot');
    (img.closest('.project-shot-link') || img).remove();
  }, true);

  /* ------------------------------------------------------- evidence toggle */

  const evidenceToggle = $('#evidenceToggle');
  evidenceToggle.addEventListener('click', () => {
    const showing = document.body.classList.toggle('show-evidence');
    evidenceToggle.setAttribute('aria-pressed', String(showing));
    evidenceToggle.textContent = showing ? 'Hide evidence' : 'Show evidence';
  });

  show(resolve());
})();
