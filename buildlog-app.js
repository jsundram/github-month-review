/* The build log: a calendar, hours, commits, and sessions, filterable by month and project.

   One IIFE, like app.js. Data arrives as plain <script>s (data/buildlog.js and
   data/buildlog-detail.js, written by scripts/build_log.py), so the page works from
   file://. The hash carries the filters: #p=AKM&m=2026-07. Every string reaches the DOM
   through esc(). */
(() => {
  const B = window.REVIEW_BUILDLOG;
  const D = window.REVIEW_BUILDLOG_DETAIL || { commits: [], sessions: [], artifacts: [], tod: {} };
  const Charts = window.ReviewCharts;
  const { esc, num, SERIES } = Charts;
  const $ = sel => document.querySelector(sel);

  const el = {
    eyebrow: $('#logEyebrow'), title: $('#logTitle'), lede: $('#logLede'),
    range: $('#rangeFilter'), project: $('#projectFilter'), stats: $('#logStats'),
    hoursTitle: $('#hoursTitle'), hoursNote: $('#hoursNote'), hours: $('#logHours'),
    hoursLegend: $('#logHoursLegend'), hoursTable: $('#logHoursTable'),
    cal: $('#logCalendar'), calMode: $('#calendarMode'), calNote: $('#calendarNote'), calLegend: $('#logCalendarLegend'),
    clock: $('#logClock'), clockLegend: $('#logClockLegend'), ship: $('#shipLog'), sessions: $('#sessionTable'),
    chats: $('#chatsThrough'), monthLink: $('#monthLink'), footer: $('#footerLine')
  };

  if (!B || !B.days) {
    el.title.textContent = 'No build log yet';
    el.lede.textContent = 'Run scripts/build_log.py to write data/buildlog.js.';
    return;
  }

  const MONTHS = [...new Set(B.days.map(d => d.d.slice(0, 7)))];
  const PROJECTS = B.projects.filter(p => p.id !== 'Other');
  const KIND = { github: 'Public repo', private: 'Private repo I chose to include', local: 'Not on GitHub',
                 gitlab: 'Public project on GitLab' };
  const COLORS = Charts.projectColors(B.days);
  const COSTS = [
    { id: 'claude', name: 'Claude, API-equivalent' },
    { id: 'codex', name: 'Codex, API-equivalent' },
    { id: 'modal', name: 'Modal, billed' }
  ];
  const UTC = { timeZone: 'UTC' };
  const date = iso => new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  const fmtDay = iso => date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...UTC });
  const fmtLong = iso => date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', ...UTC });
  const monthName = id => date(`${id}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', ...UTC });
  const money = v => (v > 0 && v < 1 ? '<$1' : `$${Math.round(v).toLocaleString('en-US')}`);
  const sum = obj => Object.values(obj || {}).reduce((a, b) => a + b, 0);

  /* ------------------------------------------------------------- filters */

  function readHash() {
    const params = {};
    location.hash.slice(1).split('&').filter(Boolean).forEach(part => {
      const [k, v = ''] = part.split('=');
      params[k] = decodeURIComponent(v);
    });
    const p = PROJECTS.some(x => x.id === params.p) ? params.p : '';
    const m = MONTHS.includes(params.m) ? params.m : '';
    return { p, m };
  }

  function hashFor(state) {
    const parts = [];
    if (state.p) parts.push(`p=${encodeURIComponent(state.p)}`);
    if (state.m) parts.push(`m=${state.m}`);
    return parts.length ? `#${parts.join('&')}` : '#';
  }

  function chip(label, active, state, note, color) {
    return `<a class="chip${active ? ' active' : ''}${color ? ' tinted' : ''}" href="${esc(hashFor(state))}"${
      color ? ` style="--c:${esc(color)}"` : ''}${active ? ' aria-current="true"' : ''}>${
      esc(label)}${note ? ` <small>${esc(note)}</small>` : ''}</a>`;
  }

  // The colour a project wears in this view's charts: its own if named here, else Other's.
  const swatch = color => `<i class="swatch" style="background:${esc(color)}"></i>`;

  function renderFilters(state, colorOf) {
    el.range.innerHTML = '<span class="filter-label">Range</span>'
      + chip('All months', !state.m, { ...state, m: '' })
      + MONTHS.map(m => chip(date(`${m}-01`).toLocaleDateString('en-US', { month: 'short', ...UTC }),
        state.m === m, { ...state, m })).join('');

    // Chips for the projects with real time in this range; the long tail goes in a menu.
    const inRange = hoursByProject(daysIn(state.m));
    const ranked = PROJECTS.filter(p => (inRange[p.id] || 0) >= 0.05 || commitsIn(state.m, p.id).length)
      .sort((a, b) => (inRange[b.id] || 0) - (inRange[a.id] || 0));
    const top = ranked.slice(0, 10);
    if (state.p && !top.some(p => p.id === state.p)) {
      const extra = PROJECTS.find(p => p.id === state.p);
      if (extra) top.push(extra);
    }
    const rest = ranked.filter(p => !top.includes(p));
    el.project.innerHTML = '<span class="filter-label">Project</span>'
      + chip('All projects', !state.p, { ...state, p: '' })
      + top.map(p => chip(p.id, state.p === p.id, { ...state, p: p.id }, `${num(inRange[p.id] || 0, 0)}h`, colorOf(p.id))).join('')
      + (rest.length ? `<label class="chip-more"><span class="sr-only">More projects</span>
          <select id="moreProjects"><option value="">${rest.length} more…</option>${
            rest.map(p => `<option value="${esc(p.id)}">${esc(p.id)} (${esc(num(inRange[p.id] || 0))}h)</option>`).join('')}
          </select></label>` : '');
    const more = document.getElementById('moreProjects');
    if (more) more.addEventListener('change', () => { if (more.value) location.hash = hashFor({ ...state, p: more.value }); });
  }

  /* ---------------------------------------------------------------- data */

  const daysIn = m => (m ? B.days.filter(d => d.d.startsWith(m)) : B.days);
  const commitsIn = (m, p) => D.commits.filter(c => (!m || c.t.startsWith(m)) && (!p || c.p === p));
  const sessionsIn = (m, p) => D.sessions.filter(s => (!m || s.t.startsWith(m)) && (!p || s.p === p));
  function hoursByProject(days) {
    const out = {};
    days.forEach(d => Object.entries(d.h).forEach(([p, h]) => { out[p] = (out[p] || 0) + h; }));
    return out;
  }

  // Monday-based weeks over the whole range, or single days within a month.
  function buckets(state) {
    const days = daysIn(state.m);
    if (state.m) {
      return days.map((d, i) => {
        const dt = date(d.d);
        return { key: d.d, days: [d], title: fmtLong(d.d), sub: d.place || '',
          label: i === 0 ? fmtDay(d.d) : dt.getUTCDay() === 1 ? String(dt.getUTCDate()) : '' };
      });
    }
    const out = [];
    days.forEach(d => {
      const dt = date(d.d);
      const monday = new Date(dt.getTime() - ((dt.getUTCDay() + 6) % 7) * 864e5).toISOString().slice(0, 10);
      let b = out[out.length - 1];
      if (!b || b.key !== monday) {
        b = { key: monday, days: [] };
        out.push(b);
      }
      b.days.push(d);
    });
    let lastMonth = '';
    out.forEach(b => {
      const first = b.days[0].d;
      const last = b.days[b.days.length - 1].d;
      b.title = `Week of ${fmtDay(b.key)}`;
      b.sub = [...new Set(b.days.map(d => d.region).filter(Boolean))].join(', ');
      const m = last.slice(0, 7);
      b.label = m !== lastMonth ? date(`${m}-01`).toLocaleDateString('en-US', { month: 'short', ...UTC }) : '';
      lastMonth = m;
      b.range = [first, last];
    });
    return out;
  }

  /* -------------------------------------------------------------- render */

  function render() {
    const state = readHash();
    const project = PROJECTS.find(p => p.id === state.p);
    const days = daysIn(state.m);
    const cols = buckets(state);
    const commits = commitsIn(state.m, state.p);
    const sessions = sessionsIn(state.m, state.p);
    const byProject = hoursByProject(days);
    const hours = state.p ? (byProject[state.p] || 0) : sum(byProject);
    const span = state.m ? monthName(state.m) : `${fmtDay(B.range.start)} – ${fmtDay(B.range.end)}, ${B.range.end.slice(0, 4)}`;

    // One set of series for the view, shared by every chart, chip, and log row on the page.
    let series;
    let fold = v => v;
    if (state.p) {
      series = [{ id: state.p, name: state.p, color: COLORS[state.p] || Charts.INK }];
    } else {
      ({ series, fold } = Charts.seriesFor(byProject, SERIES.length, COLORS));
    }
    const named = new Map(series.map(x => [x.id, x.color]));
    const colorOf = id => (state.p ? COLORS[id] || Charts.INK : named.get(id) || Charts.OTHER);

    renderFilters(state, colorOf);
    document.title = `${project ? project.id : 'All projects'}${state.m ? ` · ${monthName(state.m)}` : ''} — Build log`;
    el.eyebrow.textContent = `Build log · ${span}`;
    el.title.textContent = project ? project.id : 'All projects';
    el.lede.innerHTML = project
      ? `${esc(KIND[project.kind] || '')}${project.first ? ` · sessions ${esc(fmtDay(project.first))} – ${esc(fmtDay(project.last))}` : ''}${
          project.url ? ` · <a href="${esc(project.url)}" target="_blank" rel="noreferrer">repository ↗</a>` : ''}`
      : 'Where my hands-on time went, by project, from my AI session logs and GitHub.';
    el.monthLink.href = state.m ? `index.html#${state.m}` : 'index.html';
    el.chats.textContent = B.coverage && B.coverage.chatsThrough ? fmtDay(B.coverage.chatsThrough) + ', ' + B.coverage.chatsThrough.slice(0, 4) : 'none imported';

    // ------------------------------------------------------------ stats
    const active = days.filter(d => (state.p ? d.h[state.p] || 0 : sum(d.h)) >= 0.25).length;
    const cost = costColumns(state, [{ key: 'all', days, range: state.m ? null : [B.range.start, B.range.end] }])[0];
    const stats = [
      { value: num(hours, 0), label: 'hands-on hours', note: 'Modelled; see the method' },
      { value: String(active), label: `of ${days.length} days with sessions` },
      { value: String(commits.length), label: !state.p ? 'commits'
          : project && project.kind === 'gitlab' ? 'commits on GitLab' : 'commits on GitHub',
        note: state.p ? '' : 'Public and named private repos, and public GitLab projects' },
      { value: money(sum(cost) - (cost.modal || 0)), label: 'API-equivalent cost', note: 'Claude and Codex tokens at list prices' }
    ];
    if (!state.p && cost.modal) stats.push({ value: money(cost.modal), label: 'Modal, billed' });
    el.stats.style.setProperty('--metric-count', String(stats.length));
    el.stats.innerHTML = stats.map(s => `<div class="metric"><strong class="metric-value">${esc(s.value)}</strong>
      <span class="metric-label">${esc(s.label)}</span>${s.note ? `<small class="metric-note">${esc(s.note)}</small>` : ''}</div>`).join('');

    // ------------------------------------------------------------ hours
    renderCalendar(state, days, commits, series, fold, colorOf);

    const tickCount = b => b.days.reduce((a, d) => a + commits.filter(c => c.t.startsWith(d.d)).length, 0);
    const costCols = costColumns(state, cols);
    const hourCols = cols.map((b, i) => {
      const values = {};
      b.days.forEach(d => Object.entries(fold(d.h)).forEach(([p, h]) => { values[p] = (values[p] || 0) + h; }));
      if (state.p) Object.keys(values).forEach(k => { if (k !== state.p) delete values[k]; });
      const extra = COSTS.filter(c => costCols[i][c.id]).map(c => ({ value: money(costCols[i][c.id]), name: c.name }));
      const detail = state.p ? null : hoursByProject(b.days);
      return { label: b.label, title: b.title, sub: b.sub, values, detail, ticks: state.p ? tickCount(b) : 0, extra };
    });
    const bands = [];
    if (state.m) {
      cols.forEach((b, i) => {
        const region = b.days[0].region;
        const last = bands[bands.length - 1];
        if (!region) return;
        if (last && last.label === region && last.to === i - 1) last.to = i;
        else bands.push({ from: i, to: i, label: region });
      });
    }
    el.hoursTitle.textContent = state.m ? 'Hands-on hours by day' : 'Hands-on hours by week';
    el.hoursNote.textContent = (state.p
      ? `${state.p} alone. Ticks along the base are ${state.m ? 'days' : 'weeks'} with commits.`
      : `Stacked by project; the ${series.filter(s => s.id !== 'Other').length} with the most time here are named, the rest are Other.`)
      + ' Hover a bar for its API-equivalent token cost.';
    Charts.stacked(el.hours, { columns: hourCols, series, unit: 'h', height: 260, bands,
      label: el.hoursTitle.textContent });
    Charts.legend(el.hoursLegend, state.p ? [] : series, bands.length
      ? '<span class="legend-item away-key"><i></i>Away from home</span>' : '');
    renderTable(hourCols, series);

    // --------------------------------------------------------- time of day
    const slots = Array.from({ length: 48 }, () => ({}));
    const slotDetail = Array.from({ length: 48 }, () => ({}));
    (state.m ? [state.m] : MONTHS).forEach(m => {
      Object.entries(D.tod[m] || {}).forEach(([p, values]) => {
        if (state.p && p !== state.p) return;
        const key = state.p ? p : Object.keys(fold({ [p]: 1 }))[0];
        values.forEach((v, i) => {
          slots[i][key] = (slots[i][key] || 0) + v / 60;
          slotDetail[i][p] = (slotDetail[i][p] || 0) + v / 60;
        });
      });
    });
    const hhmm = (h, mm) => `${String(h % 24).padStart(2, '0')}:${mm}`;
    Charts.stacked(el.clock, {
      columns: slots.map((values, i) => {
        const h = Math.floor(i / 2);
        const title = i % 2 ? `${hhmm(h, '30')}–${hhmm(h + 1, '00')}` : `${hhmm(h, '00')}–${hhmm(h, '30')}`;
        return { label: i % 6 === 0 ? hhmm(h, '00') : '', title, values, detail: state.p ? null : slotDetail[i] };
      }),
      series, unit: 'h', height: 170, label: 'Hands-on hours by time of day'
    });
    Charts.legend(el.clockLegend, state.p ? [] : series.filter(x => slots.some(v => v[x.id])));

    renderShipLog(commits, state, colorOf);
    renderSessions(sessions, state, colorOf);
    el.footer.textContent = `Jason Sundram · Build log · ${project ? project.id : 'all projects'}`;
  }

  /* ------------------------------------------------------------ calendar */

  // GitHub-style: hue is the day's main project, depth is how much happened. Depth steps
  // are the quartiles of the active days shown, so each shade holds about a quarter of them.
  const quartiles = values => {
    const s = values.filter(v => v > 0).sort((a, b) => a - b);
    return s.length ? [0.25, 0.5, 0.75].map(f => s[Math.round(f * (s.length - 1))]) : [];
  };
  const level = (v, steps) => (v <= 0 ? 0 : 1 + steps.filter(x => v > x).length);
  const stepLabel = (steps, unit) => {
    if (!steps.length) return '';
    if (unit === 'h') {
      const [a, b, c] = steps.map(v => num(Math.round(v * 10) / 10));
      return [`up to ${a}h`, a !== b && `${a}–${b}`, b !== c && `${b}–${c}`, `over ${c}h`].filter(Boolean).join(' · ');
    }
    // Whole commits: 1–a, a+1–b, b+1–c, c+1 and up, skipping a step that holds no number.
    const [a, b, c] = steps;
    return [[1, a], [a + 1, b], [b + 1, c]].filter(([lo, hi]) => lo <= hi)
      .map(([lo, hi]) => (lo === hi ? String(lo) : `${lo}–${hi}`)).concat(`${c + 1}+ commits`).join(' · ');
  };
  let calMode = 'hours';

  function renderCalendar(state, days, commits, series, fold, colorOf) {
    el.calMode.innerHTML = ['hours', 'commits'].map(m => `<button type="button" class="chip${calMode === m ? ' active' : ''}"
      data-mode="${m}" aria-pressed="${calMode === m}">${m === 'hours' ? 'Hands-on hours' : 'Commits'}</button>`).join('');
    if (!el.calMode._bound) {
      el.calMode._bound = true;
      el.calMode.addEventListener('click', event => {
        const b = event.target && event.target.closest && event.target.closest('[data-mode]');
        if (b && b.dataset.mode !== calMode) { calMode = b.dataset.mode; render(); }
      });
    }
    const byDay = {};
    commits.forEach(c => { (byDay[c.t.slice(0, 10)] = byDay[c.t.slice(0, 10)] || []).push(c); });
    // Across all months, each month names its own biggest projects. Colours are fixed per
    // project, so this only uncovers hues the all-months view would fold into Other.
    const views = {};
    if (!state.p && !state.m) {
      MONTHS.forEach(m => { views[m] = Charts.seriesFor(hoursByProject(daysIn(m)), SERIES.length, COLORS); });
    }
    const viewOf = d => views[d.d.slice(0, 7)] || { series, fold };
    const value = d => (calMode === 'hours' ? (state.p ? d.h[state.p] || 0 : sum(d.h)) : (byDay[d.d] || []).length);
    const steps = quartiles(days.map(value));
    const shown = {};
    const cells = days.map(d => {
      const { series, fold } = viewOf(d);
      // A new object either way: d.h is the shared data, and must never be edited.
      const hours = state.p ? (d.h[state.p] ? { [state.p]: d.h[state.p] } : {}) : fold(d.h);
      const dayCommits = byDay[d.d] || [];
      const perProject = {};
      dayCommits.forEach(c => {
        const key = state.p ? c.p : Object.keys(fold({ [c.p]: 1 }))[0];
        perProject[key] = (perProject[key] || 0) + 1;
      });
      const counts = calMode === 'hours' ? hours : perProject;
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      const total = sum(hours);
      const lvl = level(value(d), steps);
      const color = top ? (series.find(x => x.id === top[0]) || { color: colorOf(top[0]) }).color : Charts.OTHER;
      if (lvl && top) (shown[d.d.slice(0, 7)] = shown[d.d.slice(0, 7)] || new Set()).add(top[0]);
      const rows = Charts.breakdown(state.p ? hours : d.h, p => (series.find(x => x.id === p) || { color: Charts.OTHER }).color, 'h', 6);
      if (!rows.length) rows.push({ value: '0h', name: 'no sessions' });
      if (dayCommits.length) {
        rows.push({ value: String(dayCommits.length), name: dayCommits.length === 1 ? 'commit' : 'commits' });
        if (!state.p) {
          const byRepo = {};
          dayCommits.forEach(c => { byRepo[c.p] = (byRepo[c.p] || 0) + 1; });
          Object.entries(byRepo).sort((a, b) => b[1] - a[1]).forEach(([p, n]) => rows.push({
            value: String(n), name: p, color: (series.find(x => x.id === p) || { color: Charts.OTHER }).color }));
        }
      }
      return {
        d: d.d, level: lvl, color, dot: calMode === 'hours' && dayCommits.length > 0,
        title: fmtLong(d.d), sub: d.place || '', rows,
        aria: `${num(total)} hours, ${dayCommits.length} commits`
      };
    });
    // A focused project (a hovered legend name) keeps only its own days, in its own colour,
    // with depth from the quartiles of its own hours or commits; every other day is blank.
    const focusCells = (p, color) => {
      const commitsOwn = days.map(d => (byDay[d.d] || []).filter(x => x.p === p).length);
      const own = calMode === 'hours' ? days.map(d => d.h[p] || 0) : commitsOwn;
      const ownSteps = quartiles(own);
      return cells.map((c, i) => ({ ...c, color, level: level(own[i], ownSteps), dot: calMode === 'hours' && commitsOwn[i] > 0 }));
    };
    const draw = focus => Charts.calendar(el.cal, {
      cells: focus ? focusCells(focus.p, focus.color) : cells,
      label: calMode === 'hours' ? 'Hands-on hours by day' : 'Commits by day', max: state.m ? 34 : 30,
      monthHref: state.m ? null : m => hashFor({ ...state, m })
    });
    draw(null);
    const ramp = Charts.DEPTH.slice(1).map(o => `<i style="background:${esc(Charts.INK)};opacity:${o * 0.7}"></i>`).join('');
    const keys = `<span class="legend-item cal-ramp">${ramp}<small>${esc(stepLabel(steps, calMode === 'hours' ? 'h' : ''))}</small></span>${
      calMode === 'hours' ? '<span class="legend-item cal-dot-key"><i></i>a day with commits</span>' : ''}`;
    // A project's name shows its days on hover and selects it on click, like its chip.
    const items = list => list.map(x => (x.id && x.id !== 'Other'
      ? `<button type="button" class="legend-item legend-pick" data-p="${esc(x.id)}" data-c="${esc(x.color)}"><i style="background:${esc(x.color)}"></i>${esc(x.name)}</button>`
      : `<span class="legend-item"><i style="background:${esc(x.color)}"></i>${esc(x.name)}</span>`)).join('');
    if (state.p) {
      el.calLegend.innerHTML = keys;
    } else if (state.m) {
      el.calLegend.innerHTML = items(series.filter(x => (shown[state.m] || new Set()).has(x.id))) + keys;
    } else {
      // One ruled row per month, the month's projects on a shared column grid.
      el.calLegend.innerHTML = `<div class="cal-legend">${MONTHS.map(m => `<div class="cal-legend-month"><b>${
        esc(date(`${m}-01`).toLocaleDateString('en-US', { month: 'short', ...UTC }))}</b><div>${
        items(views[m].series.filter(x => x.id !== 'Other' && (shown[m] || new Set()).has(x.id)))}</div></div>`).join('')}</div>${
        items([{ name: 'Other', color: Charts.OTHER }])}${keys}`;
    }
    let focused = null;
    const pickOf = event => event.target && event.target.closest && event.target.closest('[data-p]');
    const focus = pick => {
      const p = pick ? pick.dataset.p : null;
      if (p !== focused) { focused = p; draw(p && { p, color: pick.dataset.c }); }
    };
    el.calLegend.onmouseover = event => focus(pickOf(event));
    el.calLegend.onmouseleave = () => focus(null);
    el.calLegend.onfocusin = event => focus(pickOf(event));
    el.calLegend.onfocusout = () => focus(null);
    el.calLegend.onclick = event => {
      const pick = pickOf(event);
      if (pick) location.hash = hashFor({ ...state, p: pick.dataset.p });
    };
    el.calNote.textContent = (calMode === 'hours'
      ? 'Each square is a day. Its colour is the project with the most hands-on hours that day; the deeper the colour, the more hours, each shade about a quarter of the days shown.'
      : 'Each square is a day. Its colour is the project with the most commits that day; the deeper the colour, the more commits, each shade about a quarter of the days shown.')
      + (state.p || state.m ? '' : ' Each month names its own biggest projects; the rest are Other.')
      + (state.p ? '' : ' Point at a project below to see only its days; click it to select it.');
  }

  // Cost per bucket: the day totals for everything, or the project's own sessions.
  function costColumns(state, cols) {
    return cols.map(b => {
      const out = {};
      if (state.p) {
        const inBucket = b.range
          ? s => s.t.slice(0, 10) >= b.range[0] && s.t.slice(0, 10) <= b.range[1]
          : s => b.days.some(d => s.t.startsWith(d.d));
        sessionsIn(state.m, state.p).filter(inBucket).forEach(s => {
          if (s.usd) out[s.app === 'codex' ? 'codex' : 'claude'] = (out[s.app === 'codex' ? 'codex' : 'claude'] || 0) + s.usd;
        });
      } else {
        b.days.forEach(d => Object.entries(d.cost || {}).forEach(([k, v]) => { out[k] = (out[k] || 0) + v; }));
      }
      return out;
    });
  }

  function renderTable(cols, series) {
    const head = `<tr><th scope="col">${cols.length && cols[0].title.startsWith('Week') ? 'Week' : 'Day'}</th>${
      series.map(s => `<th scope="col">${esc(s.name)}</th>`).join('')}<th scope="col">Total</th></tr>`;
    const rows = cols.map(c => `<tr><th scope="row">${esc(c.title)}${c.sub ? ` <small>${esc(c.sub)}</small>` : ''}</th>${
      series.map(s => `<td>${c.values[s.id] ? esc(num(c.values[s.id])) : ''}</td>`).join('')}<td>${esc(num(sum(c.values)))}</td></tr>`).join('');
    el.hoursTable.innerHTML = `<div class="table-wrap"><table class="data-table"><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;
  }

  const SHIP_LIMIT = 60;
  function renderShipLog(commits, state, colorOf, all) {
    if (!commits.length) {
      el.ship.innerHTML = `<p class="quiet-note">${state.p ? `No commits from ${esc(state.p)} in this range${
        PROJECTS.find(p => p.id === state.p && p.kind === 'local') ? ' — it is not on GitHub' : ''}.` : 'No commits in this range.'}</p>`;
      return;
    }
    const shown = all ? commits.slice().reverse() : commits.slice(-SHIP_LIMIT).reverse();
    const byDay = [];
    shown.forEach(c => {
      const day = c.t.slice(0, 10);
      const last = byDay[byDay.length - 1];
      if (last && last.day === day) last.commits.push(c);
      else byDay.push({ day, commits: [c] });
    });
    el.ship.innerHTML = byDay.map(g => `
      <div class="ship-day"><h4>${esc(fmtLong(g.day))} <small>${g.commits.length}</small></h4><ul>${g.commits.map(c => `
        <li><time>${esc(c.t.slice(11, 16))}</time>${state.p ? '' : `<code>${swatch(colorOf(c.p))}${esc(c.p)}</code>`}
          ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noreferrer">${esc(c.msg)}</a>` : `<span>${esc(c.msg)}</span>`}${
          c.via === 'cloud' ? '<span class="via">cloud</span>' : ''}</li>`).join('')}</ul></div>`).join('')
      + (!all && commits.length > SHIP_LIMIT
        ? `<button class="text-button show-all" id="shipAll" type="button">Show all ${commits.length} commits</button>` : '');
    const more = document.getElementById('shipAll');
    if (more) more.addEventListener('click', () => renderShipLog(commits, state, colorOf, true));
  }

  const SESSION_LIMIT = 40;
  function renderSessions(sessions, state, colorOf, all) {
    if (!sessions.length) {
      el.sessions.innerHTML = '<p class="quiet-note">No sessions in a named project in this range.</p>';
      return;
    }
    const shown = all ? sessions.slice().reverse() : sessions.slice(-SESSION_LIMIT).reverse();
    const rows = shown.map(s => `<tr>
      <td>${esc(fmtDay(s.t))} <small>${esc(s.t.slice(11, 16))}</small></td>
      ${state.p ? '' : `<td>${swatch(colorOf(s.p))}<a href="${esc(hashFor({ ...state, p: s.p }))}">${esc(s.p)}</a></td>`}
      <td>${esc(s.app)}${s.via !== 'laptop' ? ` <small>${esc(s.via)}</small>` : ''}</td>
      <td>${s.prompts}</td><td>${s.min}</td><td>${s.commits || ''}</td>
      <td>${s.usd ? esc(money(s.usd)) : ''}</td></tr>`).join('');
    el.sessions.innerHTML = `<table class="data-table"><thead><tr><th scope="col">Started</th>${
      state.p ? '' : '<th scope="col">Project</th>'}<th scope="col">App</th><th scope="col">Prompts</th>
      <th scope="col">Hands-on min</th><th scope="col">Commits</th><th scope="col">API-equiv.</th></tr></thead>
      <tbody>${rows}</tbody></table>${!all && sessions.length > SESSION_LIMIT
        ? `<button class="text-button show-all" id="sessionsAll" type="button">Show all ${sessions.length} sessions</button>` : ''}`;
    const more = document.getElementById('sessionsAll');
    if (more) more.addEventListener('click', () => renderSessions(sessions, state, colorOf, true));
  }

  window.addEventListener('hashchange', render);
  render();
})();
