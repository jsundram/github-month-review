# GitHub month in review

A dependency-free page that reviews public GitHub work one month at a time, with a
short narrative for each week. Past months stay viewable; quiet weeks say they were
quiet instead of being padded or hidden.

## Preview

Open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
```

Then `http://localhost:8000`. A specific month is `#YYYY-MM`, e.g.
`http://localhost:8000/#2026-06`.

## Files

- `update.sh` / `update.py` — the entry point; safe to schedule
- `index.html` — page shell; all month content is rendered by `app.js`
- `styles.css` — layout, print styles, quiet-state styling
- `app.js` — month routing, on-demand loading, rendering
- `data/index.js` — the list of months (loaded eagerly)
- `data/months/YYYY-MM.js` — one file per month (loaded on demand)
- `data/raw/YYYY-MM.json` — GitHub snapshots; facts only, never edited by hand
- `drafts/YYYY-MM-interview.md` — the questions for a month, and their answers
- `drafts/YYYY-MM-provenance.json` — the facts a narrative was written against
- `drafts/YYYY-MM-pending.md` — commits that landed after the narrative was written
- `scripts/fetch_github.py` — snapshot collector
- `scripts/draft_month.py` — turns a snapshot into a skeleton plus an interview
- `scripts/smoke_test.js` — headless render test
- `scripts/screenshots.py` — Playwright captures into `shots/`

## Running it

One command does everything:

```bash
export GITHUB_TOKEN=...
./update.sh                          # refresh the current month
./update.sh --month 2026-06          # a specific month
./update.sh --month 2026-08 --new    # draft a month that has no file yet
./update.sh --check                  # just run the render test
./update.sh --shots                  # also capture screenshots
```

`./update.sh` is a wrapper around `uv run update.py`; either works, and `update.py`
has no dependencies so plain `python3 update.py` works too.

**It never overwrites narrative.** On a month that already has prose, a refresh only
re-fetches the snapshot and reports what has landed since the narrative was written,
into `drafts/<month>-pending.md`. Rewriting a written month takes `--new --force`,
which warns first.

### Scheduling

```cron
0 8 * * 1  cd /path/to/repo && /opt/homebrew/bin/uv run update.py >> update.log 2>&1
```

A weekly run tells you what changed without touching a word of the page. Add
`--fail-on-stale` to exit 2 when a month has drifted, if something should notice.

### Adding a month by hand

```bash
python3 scripts/fetch_github.py --month 2026-08   # --until for a month in progress
python3 scripts/draft_month.py --month 2026-08
```

That writes `data/months/2026-08.js` with every narrative field marked `TODO`, and
`drafts/2026-08-interview.md` with the questions to answer first. Answer them, write
the narrative, add the month to `data/index.js`, then run `./update.sh --check`.

The scripts never write narrative. See `CLAUDE.md` for the full workflow and the
voice the prose is meant to hold.

## Screenshots

```bash
uv run scripts/screenshots.py           # all shots into shots/
uv run scripts/screenshots.py --list
```

Needs the browser once: `uv run --with playwright playwright install chromium`.
The shots cover the states the render test cannot see — quiet weeks, a fully quiet
month, the open month menu, expanded evidence, mobile, and print.

## What the page deliberately does not do

- No global commit total in the hero. Public histories paginate and raw counts
  reward merge mechanics.
- No inferred context. Travel, deadlines, and reasons a week was quiet are supplied
  by hand, never derived from commit metadata.
- No auto-generated prose. `draft_month.py` produces facts and `TODO`s; a person
  writes the sentences.
