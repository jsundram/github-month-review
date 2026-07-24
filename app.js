(() => {
  const index = window.REVIEW_INDEX;
  if (!index || !Array.isArray(index.months) || !index.months.length) {
    document.body.classList.add('load-error');
    return;
  }

  // Newest first, defensively re-sorted so data/index.js order is not load-bearing.
  const months = index.months.slice().sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));
  const loaded = (window.REVIEW_MONTHS = window.REVIEW_MONTHS || {});

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
    reposLink: $('#reposLink')
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
          <p class="quiet-note">${esc(week.note || 'No public activity in this week.')}</p>
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
          <p class="week-summary">${esc(week.summary)}</p>
          ${projects.length ? `<div class="project-list">${projects.map(p => `
            <a class="project-card" href="${esc(p.url)}" target="_blank" rel="noreferrer">
              <header><h4>${esc(p.name)}</h4><code>${esc(p.repo)}</code></header>
              <p>${esc(p.desc)}</p><b>Open repository ↗</b>
            </a>`).join('')}</div>` : ''}
          ${week.note ? `<p class="week-note">${esc(week.note)}</p>` : ''}
          ${evidence.length ? `<div class="evidence"><div class="evidence-inner">
            <h5>Public evidence</h5>
            <ul>${evidence.map(item =>
              `<li><a href="${esc(item.url)}" target="_blank" rel="noreferrer">${esc(item.text)} ↗</a></li>`).join('')}</ul>
          </div></div>` : ''}
        </div>
      </article>`;
  }

  function renderWeeks(month) {
    const weeks = (month.weeks || []).map(week => ({ ...week, domId: `${month.id}-${week.id}` }));

    if (!weeks.length || month.status === 'quiet') {
      el.weekNav.innerHTML = '';
      el.weekList.innerHTML = `
        <div class="month-quiet">
          <h3>A quiet month.</h3>
          <p>${esc(month.quietNote || month.lede || 'No public GitHub activity recorded in this month.')}</p>
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

  function render(month) {
    current = month;
    document.title = `${month.label} — GitHub review — ${index.user}`;
    renderHero(month);
    renderMetrics(month);
    observeWeeks(renderWeeks(month));
    renderThreads(month);
    el.footerLine.textContent = `${index.user} · public GitHub review · ${month.label}`;
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

  /* ------------------------------------------------------- evidence toggle */

  const evidenceToggle = $('#evidenceToggle');
  evidenceToggle.addEventListener('click', () => {
    const showing = document.body.classList.toggle('show-evidence');
    evidenceToggle.setAttribute('aria-pressed', String(showing));
    evidenceToggle.textContent = showing ? 'Hide evidence' : 'Show evidence';
  });

  show(resolve());
})();
