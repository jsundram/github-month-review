/* Small SVG charts for the month pages and the build log. No dependencies, no modules:
   loaded as a plain <script>, it defines window.ReviewCharts.

   Markup is built as strings with every label through esc(); the tooltip is built with
   textContent. Charts size to their container and redraw on resize.

   SERIES is a fixed categorical order validated for colour-vision deficiency against the
   page surfaces (dataviz validate_palette.js: worst adjacent CVD ΔE 10.0, normal 17.0).
   Slot 4 (gold) is under 3:1 against the surface, so every chart ships a legend, a
   tooltip, and — on the build log — a table view. A ninth series is never a new hue:
   it folds into Other. */
(() => {
  const SERIES = ['#2f6f9f', '#ef6045', '#00998a', '#d39a12', '#8a5fb0', '#4f8a2a', '#c9578a', '#9a5a1c'];
  const OTHER = '#b5ae9f';
  const INK = '#171918';
  const GOLD = '#e7bb4e';

  const esc = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const drawn = new Map();       // element -> redraw(), for resize
  let resizeTimer = null;
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => drawn.forEach(redraw => redraw()), 120);
    });
  }

  // Clean axis steps: 1, 2, 2.5, 5 × 10^n, about four of them.
  function scale(max) {
    if (!(max > 0)) return { max: 1, step: 0.25 };
    const raw = max / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw);
    return { max: Math.ceil(max / step - 1e-9) * step, step };
  }

  const num = (v, digits = 1) => (Math.round(v * 10 ** digits) / 10 ** digits).toLocaleString('en-US');
  const width = el => Math.max(280, Math.round(el.clientWidth || 960));

  /* ------------------------------------------------------------ tooltip */

  let tip = null;
  function tipEl() {
    if (tip || typeof document === 'undefined' || !document.body || !document.createElement) return tip;
    tip = document.createElement('div');
    tip.className = 'chart-tip';
    tip.setAttribute('role', 'status');
    tip.hidden = true;
    document.body.appendChild(tip);
    return tip;
  }

  // content: { title, sub?, rows: [{ value, name, color? }] } — values lead, names follow.
  function showTip(content, x, y) {
    const node = tipEl();
    if (!node || !node.replaceChildren) return;
    const parts = [];
    const head = document.createElement('strong');
    head.textContent = content.title;
    parts.push(head);
    if (content.sub) {
      const sub = document.createElement('small');
      sub.textContent = content.sub;
      parts.push(sub);
    }
    (content.rows || []).forEach(row => {
      const line = document.createElement('span');
      line.className = 'chart-tip-row';
      if (row.color) {
        const key = document.createElement('i');
        key.style.background = row.color;
        line.appendChild(key);
      }
      const value = document.createElement('b');
      value.textContent = row.value;
      const name = document.createElement('em');
      name.textContent = row.name;
      line.append(value, name);
      parts.push(line);
    });
    node.replaceChildren(...parts);
    node.hidden = false;
    const pad = 14;
    const w = node.offsetWidth || 200;
    const h = node.offsetHeight || 80;
    const left = x + pad + w > window.innerWidth ? x - pad - w : x + pad;
    node.style.left = `${Math.max(4, left + window.scrollX)}px`;
    node.style.top = `${Math.max(4, y - h - pad + window.scrollY)}px`;
  }

  function hideTip() { if (tip) tip.hidden = true; }

  // One listener per chart container; marks carry data-i into that chart's tips array.
  function bindHover(el, tips) {
    el._tips = tips;
    if (el._bound) return;
    el._bound = true;
    const find = target => target && target.closest && target.closest('[data-i]');
    const mark = hit => {
      el.querySelectorAll('.hit.on').forEach(n => n.classList.remove('on'));
      if (hit) hit.classList.add('on');
    };
    el.addEventListener('pointermove', event => {
      const hit = find(event.target);
      if (!hit) { hideTip(); mark(null); return; }
      mark(hit);
      showTip(el._tips[+hit.dataset.i], event.clientX, event.clientY);
    });
    el.addEventListener('pointerleave', () => { hideTip(); mark(null); });
    el.addEventListener('focusin', event => {
      const hit = find(event.target);
      if (!hit || !hit.getBoundingClientRect) return;
      const box = hit.getBoundingClientRect();
      mark(hit);
      showTip(el._tips[+hit.dataset.i], box.left + box.width / 2, box.top + 40);
    });
    el.addEventListener('focusout', () => { hideTip(); mark(null); });
  }

  /* Tooltip rows naming each project, biggest first. Other is only a colour: a folded
     project keeps its name here and wears Other's grey. The data's own "Other" (work that
     is never named) reads as such. The long tail past `limit` collapses to one row. */
  function breakdown(detail, colorOf, unit = '', limit = 10) {
    const ranked = Object.entries(detail || {}).filter(([, v]) => v >= 0.05).sort((a, b) => b[1] - a[1]);
    const rows = ranked.slice(0, limit).map(([id, v]) => ({
      value: `${num(v)}${unit}`, name: id === 'Other' ? 'unnamed work' : id, color: colorOf(id) }));
    const rest = ranked.slice(limit);
    if (rest.length) {
      rows.push({ value: `${num(rest.reduce((a, [, v]) => a + v, 0))}${unit}`, name: `${rest.length} more`, color: OTHER });
    }
    return rows;
  }

  /* ---------------------------------------------------------------- axes */

  function grid(W, pad, plotH, s, unit) {
    let out = '';
    for (let v = 0; v <= s.max + 1e-9; v += s.step) {
      const y = pad.t + plotH * (1 - v / s.max);
      out += `<line class="grid${v === 0 ? ' base' : ''}" x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}"/>`;
      out += `<text class="tick" x="${pad.l - 6}" y="${y + 3.5}" text-anchor="end">${esc(num(v, 2))}${v === s.max && unit ? esc(unit) : ''}</text>`;
    }
    return out;
  }

  // Rounded data-end (top), square at the baseline.
  function bar(x, y, w, h, r, color) {
    if (h <= 0) return '';
    r = Math.min(r, w / 2, h);
    if (r <= 0) return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`;
    return `<path fill="${color}" d="M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z"/>`;
  }

  /* ------------------------------------------------------- stacked bars */

  /* opts: {
       columns: [{ label?, title, sub?, values: { seriesId: n }, ticks?: n, extra?: [{ value, name }],
                   detail?: { project: n } }],   unfolded values: the tooltip names every project
       series:  [{ id, name, color }],      bottom of the stack first
       unit: 'h', height: 220,
       bands: [{ from, to, label }]         column ranges marked under the axis (travel)
     } */
  function stacked(el, opts) {
    const redraw = () => stacked(el, opts);
    drawn.set(el, redraw);
    const W = width(el);
    const H = opts.height || 220;
    const cols = opts.columns || [];
    const hasBands = (opts.bands || []).length > 0;
    const hasTicks = cols.some(c => c.ticks);
    const pad = { l: 40, r: 6, t: 12, b: 22 + (hasTicks ? 9 : 0) + (hasBands ? 20 : 0) };
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;
    const n = Math.max(1, cols.length);
    const band = plotW / n;
    const bw = Math.min(24, Math.max(1.5, band - 2));
    const totals = cols.map(c => opts.series.reduce((sum, s) => sum + (c.values[s.id] || 0), 0));
    const s = scale(Math.max(0, ...totals));
    const y = v => pad.t + plotH * (1 - v / s.max);

    let marks = '';
    let hits = '';
    const tips = [];
    cols.forEach((col, i) => {
      const x = pad.l + i * band + (band - bw) / 2;
      const present = opts.series.filter(ser => (col.values[ser.id] || 0) > 0);
      let acc = 0;
      present.forEach((ser, k) => {
        const v = col.values[ser.id];
        const top = y(acc + v);
        const bottom = y(acc) - (acc > 0 ? 2 : 0);     // 2px surface gap between segments
        const h = bottom - top;
        if (h >= 0.6) {
          marks += k === present.length - 1
            ? bar(x, top, bw, h, 4, ser.color)
            : `<rect x="${x}" y="${top}" width="${bw}" height="${h}" fill="${ser.color}"/>`;
        }
        acc += v;
      });
      if (col.ticks) {
        marks += `<line class="commit-tick" x1="${x + bw / 2}" x2="${x + bw / 2}" y1="${pad.t + plotH + 3}" y2="${pad.t + plotH + 9}"/>`;
      }
      const rows = col.detail
        ? breakdown(col.detail, id => (opts.series.find(ser => ser.id === id) || { color: OTHER }).color, opts.unit)
        : present.slice().reverse().map(ser => ({
          value: `${num(col.values[ser.id])}${opts.unit || ''}`, name: ser.name, color: ser.color }));
      if (rows.length > 1) rows.unshift({ value: `${num(totals[i])}${opts.unit || ''}`, name: 'total' });
      if (!rows.length) rows.push({ value: '0', name: 'nothing recorded' });
      if (col.ticks) rows.push({ value: String(col.ticks), name: col.ticks === 1 ? 'commit' : 'commits' });
      rows.push(...(col.extra || []));
      tips.push({ title: col.title, sub: col.sub, rows });
      const label = `${col.title}: ${num(totals[i])}${opts.unit || ''}`;
      hits += `<rect class="hit" data-i="${i}" tabindex="0" aria-label="${esc(label)}" x="${pad.l + i * band}" y="${pad.t}" width="${band}" height="${plotH}"/>`;
    });

    let labels = '';
    cols.forEach((col, i) => {
      if (!col.label) return;
      labels += `<text class="tick" x="${pad.l + i * band + band / 2}" y="${pad.t + plotH + (hasTicks ? 22 : 15)}" text-anchor="middle">${esc(col.label)}</text>`;
    });

    let bands = '';
    (opts.bands || []).forEach(b => {
      const x0 = pad.l + b.from * band + 1;
      const x1 = pad.l + (b.to + 1) * band - 1;
      const yb = H - 14;
      bands += `<rect class="away" x="${x0}" y="${yb}" width="${Math.max(2, x1 - x0)}" height="3" rx="1.5" fill="${GOLD}"/>`;
      if (b.label && x1 - x0 > b.label.length * 6) {
        bands += `<text class="tick away-label" x="${x0}" y="${yb + 13}">${esc(b.label)}</text>`;
      }
    });

    el.innerHTML = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"
      aria-label="${esc(opts.label || 'Stacked bar chart')}">${grid(W, pad, plotH, s, opts.unit)}${marks}${labels}${bands}${hits}</svg>`;
    bindHover(el, tips);
  }

  /* -------------------------------------------------------------- legend */

  function legend(el, series, extra) {
    el.innerHTML = series.map(s => `<span class="legend-item"><i style="background:${esc(s.color)}"></i>${esc(s.name)}${
      s.note ? ` <small>${esc(s.note)}</small>` : ''}</span>`).join('') + (extra || '');
  }

  /* One hue per project for the whole site, so a project wears the same colour in every
     chart, chip, and log row, whatever the filter. The views are the whole range and each
     month; in each, the `max` projects with the most hours are the ones named. In order of
     total hours, a project takes the first hue that no project sharing a view with it has.
     One that finds none stays Other. days: [{ d: 'YYYY-MM-DD', h: { project: hours } }]. */
  function projectColors(days, max = SERIES.length) {
    const totals = {};
    const views = { all: {} };
    (days || []).forEach(d => {
      const m = d.d.slice(0, 7);
      views[m] = views[m] || {};
      Object.entries(d.h || {}).forEach(([p, h]) => {
        if (p === 'Other') return;
        totals[p] = (totals[p] || 0) + h;
        views.all[p] = (views.all[p] || 0) + h;
        views[m][p] = (views[m][p] || 0) + h;
      });
    });
    const named = Object.values(views).map(v => new Set(Object.entries(v).filter(([, h]) => h > 0)
      .sort((a, b) => b[1] - a[1]).slice(0, max).map(([p]) => p)));
    const colors = {};
    Object.keys(totals).sort((a, b) => totals[b] - totals[a]).forEach(p => {
      const mine = named.filter(set => set.has(p));
      if (!mine.length) return;
      const taken = new Set();
      mine.forEach(set => set.forEach(q => { if (colors[q]) taken.add(colors[q]); }));
      const hue = SERIES.find(c => !taken.has(c));
      if (hue) colors[p] = hue;
    });
    return colors;
  }

  /* The named series for one view: its `max` projects with the most hours, in that order,
     each in its own colour from projectColors(). The rest fold into Other. Without a
     colour map, hues go by rank in this view. */
  function seriesFor(totals, max = SERIES.length, colors) {
    const ranked = Object.entries(totals).filter(([id, h]) => id !== 'Other' && h > 0).sort((a, b) => b[1] - a[1]);
    const named = ranked.slice(0, max)
      .map(([id], i) => ({ id, name: id, color: colors ? colors[id] : SERIES[i] }))
      .filter(s => s.color);
    const keep = new Set(named.map(s => s.id));
    const folded = new Set(ranked.map(([id]) => id).filter(id => !keep.has(id)));
    if (folded.size || (totals.Other || 0) > 0) named.push({ id: 'Other', name: 'Other', color: OTHER });
    const fold = values => {
      const out = {};
      Object.entries(values || {}).forEach(([id, v]) => {
        const key = folded.has(id) ? 'Other' : id;
        out[key] = (out[key] || 0) + v;
      });
      return out;
    };
    return { series: named, fold, folded };
  }

  /* ------------------------------------------------------------ calendar */

  /* A GitHub-style year view: one column per Monday-based week, one row per weekday.
     opts: {
       cells: [{ d: 'YYYY-MM-DD', level: 0..4, color, dim?, dot?, title, sub?, rows }],
       label, max? (largest square, px), monthHref(YYYY-MM)? (makes month labels links)
     }
     Hue is the cell's colour (the day's main project); depth is its level. */
  const DEPTH = [0, 0.32, 0.55, 0.78, 1];
  const EMPTY = '#e6e0d3';
  function calendar(el, opts) {
    const redraw = () => calendar(el, opts);
    drawn.set(el, redraw);
    const cells = opts.cells || [];
    if (!cells.length) { el.innerHTML = ''; return; }
    const day = iso => new Date(`${iso}T12:00:00Z`);
    const first = day(cells[0].d);
    const monday = new Date(first.getTime() - ((first.getUTCDay() + 6) % 7) * 864e5);
    const place = c => {
      const t = day(c.d);
      return { col: Math.round((t - monday) / 864e5 / 7 - ((t.getUTCDay() + 6) % 7) / 7), row: (t.getUTCDay() + 6) % 7 };
    };
    const weeks = place(cells[cells.length - 1]).col + 1;
    const W = width(el);
    const pad = { l: 28, t: 18 };
    const gap = 3;
    const size = Math.max(6, Math.min(opts.max || 18, Math.floor((W - pad.l) / weeks) - gap));
    const H = pad.t + 7 * (size + gap);
    const Wd = pad.l + weeks * (size + gap);

    let marks = '';
    let labels = '';
    const tips = [];
    let lastMonth = '';
    ['Mon', '', 'Wed', '', 'Fri', '', ''].forEach((name, r) => {
      if (name) labels += `<text class="tick" x="${pad.l - 6}" y="${pad.t + r * (size + gap) + size - 2}" text-anchor="end">${name}</text>`;
    });
    cells.forEach((c, i) => {
      const { col, row } = place(c);
      const x = pad.l + col * (size + gap);
      const y = pad.t + row * (size + gap);
      const m = c.d.slice(0, 7);
      if (m !== lastMonth && row <= 3) {
        const name = `<text class="tick" x="${x}" y="${pad.t - 6}">${esc(day(c.d).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }))}</text>`;
        labels += opts.monthHref ? `<a class="cal-month" href="${esc(opts.monthHref(m))}">${name}</a>` : name;
        lastMonth = m;
      }
      const fill = c.level ? c.color : EMPTY;
      const opacity = (c.level ? DEPTH[c.level] : 1) * (c.dim ? 0.3 : 1);
      marks += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${Math.min(3, size / 4)}" fill="${esc(fill)}" fill-opacity="${opacity}"/>`;
      if (c.dot && size >= 8) {
        marks += `<circle class="cal-dot" cx="${x + size / 2}" cy="${y + size / 2}" r="${Math.max(1.4, size / 7)}"${c.dim ? ' opacity=".3"' : ''}/>`;
      }
      tips.push({ title: c.title, sub: c.sub, rows: c.rows });
      marks += `<rect class="hit cal-hit" data-i="${i}" tabindex="0" aria-label="${esc(`${c.title}: ${c.aria || ''}`)}" x="${x - gap / 2}" y="${y - gap / 2}" width="${size + gap}" height="${size + gap}"/>`;
    });
    el.innerHTML = `<svg class="chart-svg calendar-svg" viewBox="0 0 ${Wd} ${H}" width="${Wd}" height="${H}" role="img"
      aria-label="${esc(opts.label || 'Calendar')}">${labels}${marks}</svg>`;
    bindHover(el, tips);
  }

  window.ReviewCharts = { SERIES, OTHER, INK, GOLD, DEPTH, EMPTY, stacked, calendar, legend, seriesFor, projectColors, breakdown, scale, esc, num };
})();
