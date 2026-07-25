# CLAUDE.md

Guidance for working in this repo.

## What this is

A static page that reviews public GitHub activity one month at a time, with a short
narrative per week. It is a reading experience, not a dashboard. The interesting
content is prose that a commit log cannot produce: intent, what stalled, why a week
was empty.

No build step, no dependencies, no framework. Open `index.html` and it runs.

## Architecture

```
update.py           the entry point; update.sh wraps it in `uv run`
index.html          static shell; every month-specific node is filled by app.js
styles.css          all styling, including print and the quiet/empty states
app.js              one IIFE: routing, loading, rendering
data/index.js       window.REVIEW_INDEX — the month list, loaded eagerly
data/months/*.js    window.REVIEW_MONTHS["YYYY-MM"] — one month, loaded on demand
data/raw/*.json     GitHub snapshots (generated, never hand-edited)
drafts/*.md         per-month interviews, answers, and pending-commit reports
drafts/*.json       provenance: the facts each narrative was written against
scripts/            fetch, draft, test, screenshot, and the icon/OG rasterizers
assets/             favicon + og.png share card; PNGs are generated, never hand-edited
shots/              Playwright output (regenerated, safe to delete)
```

**Link previews.** The `<head>` carries Open Graph / Twitter Card tags (adopted from `pwa-starter`)
so a pasted URL previews as a card. `assets/icon.svg` and `assets/og.svg` are the sources; the PNGs
come from `scripts/make-icons.sh` / `scripts/make-og.sh` — edit the SVG and rerun, never hand-edit a
PNG. The card must stay a raster at an absolute URL and under the size gate in `make-og.sh` (a too-big
card scrapes as a grey box); `og-lint.py` re-checks it at commit time. The static tags are what a
scraper sees; `render()` refreshes title/description/`og:url` per month via `updateHead()`, only ever
rewriting tags already in the HTML — never appending, which would collide with the month `<script>`
loader. The absolute URLs are built from `REVIEW_INDEX.site`.

**`update.py` must never write narrative.** It is scheduled, so anything it touches
can be clobbered unattended. On a month that already has a file it only re-fetches
the snapshot, diffs it against `drafts/<month>-provenance.json`, and writes
`drafts/<month>-pending.md`. Drafting over existing prose requires `--new --force`.
Preserve this if you extend it.

**Loading.** Months are `<script>` tags injected at runtime rather than `fetch`ed
JSON, so the page works from `file://` with no server. `app.js` caches by month id;
switching back to a loaded month does not refetch. Keep this property — do not
introduce `fetch`, ES modules, or anything else that needs an origin.

**Routing.** `location.hash` is the month id (`#2026-07`). No hash, or an unknown
one, falls back to the newest month in `data/index.js`. `data/index.js` is sorted
newest-first defensively in `app.js`, so its file order is convenience, not contract.

**Rendering.** `render(month)` is the single entry point. Every string that reaches
the DOM goes through `esc()`. Week DOM ids are namespaced `${month.id}-${week.id}`
so ids stay unique if the page ever shows more than one month.

> Those ids start with a digit — `2026-07-w3`. That is a valid HTML id but an
> **invalid CSS selector**, so `querySelector('#2026-07-w3')` throws. Use
> `getElementById`, or `[id="…"]` in a Playwright locator. `app.js` already does.

**Verification.** Two levels, both cheap:

- `./update.sh --check` (or `node scripts/smoke_test.js`) stubs a minimal DOM, runs
  `app.js` for real, and asserts on the HTML produced — including the quiet-week,
  quiet-month, no-metrics, and failed-load paths. Run after touching `app.js` or the
  month schema.
- `uv run scripts/screenshots.py` captures `shots/`. The render test cannot see
  layout, and the quiet states are exactly where layout breaks. Look at the images.

## Month data schema

```js
window.REVIEW_MONTHS["2026-07"] = {
  id: "2026-07",
  label: "July 2026",
  status: "active" | "quiet",     // "quiet" replaces the whole week list with one block
  inProgress: true,               // optional; coverage ends before the month does
  coverage: { start, end },       // what the snapshot actually covers, ISO dates
  lede: "…",                      // 1–2 sentences, shown in the hero
  quietNote: "…",                 // optional; only used when status is "quiet"
  metrics: [{ value, label, note }],
  weeks: [ … ],
  threads: [ … ]                  // optional; omit and the section hides itself
};
```

**Loose threads** are work that was started and parked. The section exists so unfinished
work stays in the record instead of vanishing between months — it is often the most
honest thing on the page. `status` is `parked` (waiting on time or a decision),
`active` (still moving), or `dropped` (deliberately abandoned; say why).

```js
{ title, repo, status: "parked" | "active" | "dropped", note, url? }
```

Ask about these directly in the interview — a commit log shows what was written, never
what was abandoned. `draft_month.py` cannot infer them, though commit subjects with
"WIP", "not yet", or "not executed" are good places to start asking.

A week is one of three shapes:

```js
// active
{ id, number, range, dates: {start, end}, status: "active", intensity: 1..5,
  title, summary, note?, themes: [], projects: [{name, repo, desc, url}],
  evidence: [{text, url}] }

// covered by the snapshot, but nothing was committed
{ id, number, range, dates, status: "quiet", note }

// outside the snapshot window entirely
{ id, number, range, dates, status: "nodata", note }
```

Weeks are Monday-based and clipped to the month. A week straddling a month boundary
appears in both months, split, and each half should say so in its `note`.

`intensity` is a hand-set 1–5 signal. `draft_month.py` guesses it from commit counts,
which is a poor proxy — it is meant to be corrected during the interview.

Known `themes` keys live in `THEME_NAMES` in `app.js`. An unknown key renders as its
own raw text, so adding one is optional but preferred.

## Adding a month

```bash
./update.sh --month 2026-08 --new
```

That fetches the snapshot and writes `data/months/2026-08.js` with facts filled in
and every narrative field set to `TODO`, plus `drafts/2026-08-interview.md` and
`drafts/2026-08-provenance.json`. The underlying scripts (`fetch_github.py`,
`draft_month.py`) can also be run directly.

**The scripts never write narrative, and neither should you write it unprompted.**

## Working with the owner on narrative

This is the part that matters. When generating a new month, or revising an existing
narrative, ask before writing.

0. **Surface the evidence with every question.** The point of this project is to work
   out where the time went, so the owner often cannot answer from memory alone. The
   generated interview embeds a repo table, commits-per-day charts, and every
   non-routine commit as a dated link; quote the relevant ones into the conversation
   rather than asking "what was week 3 about?" in the abstract.
1. Run the scripts, then read `drafts/<month>-interview.md` and **ask the questions
   in it** — in conversation, a few at a time, not as a wall of text. Lead with the
   month-level ones; they set the frame for the weeks.
2. Always ask what went wrong, stalled, or got abandoned. It is the thing the commit
   log never shows and the thing most often missing from the page.
3. Always ask about empty weeks. "Travel, other work, or a real break?" One line is
   enough, and the answer is what makes the quiet-week UI worth having.
4. Ask before inventing a number. If a metric cannot be traced to the snapshot or to
   something the owner said, it does not belong in `metrics`.
5. **Check recollection against the data, and say so when they disagree.** The owner
   asked directly whether a commit date was right; it was, and the useful answer named
   the adjacent commits that explained the confusion. Verify with the API rather than
   deferring, and record the correction in the interview file.
6. Record the answers in the interview file, then write the narrative. Keep the file
   — it is the provenance for prose that is otherwise unfalsifiable, and its
   "Corrections" section is where wrong drafts get their post-mortem.

If asked to update one week or one month, change only that. Do not re-voice
neighbouring months for consistency without being asked.

## Voice

The prose is neutral third person, plain, and concrete. This is the house style and
the most common thing to get wrong.

Do:

- Name what was built and what it does. "AKM took observed ERA5 weather in place of
  forecasts, corrected programs, and 57 per-piece recording links."
- Let a dull week read as dull. "Very little of this week is new capability."
- Say what a number is from. "From the project's own build log, not a GitHub count."
- Keep `note` for one honest aside, or delete the field. It is not a moral.

Do not:

- Address the reader. No "you were not merely plotting data."
- Reach for significance. No inflection points, no leverage, no "the real product
  was…", no "X became Y" as a chapter title unless X literally became Y.
- Use a triad where a clause will do, or open a sentence with "Not just…".
- Praise the work. The page reports; the reader judges.
- Pad an empty week into a paragraph.

Titles are short and literal — "AKM starts.", "Catalog tooling and a mobile pass."
If a title could headline any month, it is wrong.

## Honesty constraints

These are load-bearing and are stated on the page itself, in the Method section:

- Only public GitHub activity. A quiet week here is not a quiet week in general.
- Travel and personal context is supplied by the owner, never inferred from commits.
- AI-assisted and coauthored commits count as work directed, reviewed, and shipped
  by the owner — not a claim about who typed each line.

Do not add a feature that infers any of the above from commit metadata.
