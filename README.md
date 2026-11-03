# GitHub month in review

A dependency-free page that reviews GitHub work one month at a time, with a
short narrative for each week. Past months stay viewable; quiet weeks say they were
quiet instead of being padded or hidden.

Alongside it, a build log (`buildlog.html`) shows where the hands-on time went, by
project and day, from my archived Claude Code and Codex sessions
([ai-log](../ai-log)), with local time and travel from Swarm check-ins and cost from
token counts and Modal billing. It opens on a GitHub-style activity calendar (hours or
commits, coloured by each day's main project), and every project card on a month page
links to that project's own build log.

## Preview

Open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
```

Then `http://localhost:8000`. A specific month is `#YYYY-MM`, e.g.
`http://localhost:8000/#2026-06`. The build log is `buildlog.html`, filtered by hash:
`buildlog.html#p=AKM&m=2026-07`.

## Files

- `update.sh` / `update.py` — the entry point; safe to schedule
- `index.html` — page shell; all month content is rendered by `app.js`
- `styles.css` — layout, print styles, quiet-state styling
- `app.js` — month routing, on-demand loading, rendering
- `buildlog.html` / `buildlog-app.js` — the build log page
- `charts.js` — the small SVG charts both pages share
- `data/buildlog.js`, `data/buildlog-detail.js` — hours, sessions, commits, cost; generated
- `data/index.js` — the list of months (loaded eagerly)
- `data/months/YYYY-MM.js` — one file per month (loaded on demand)
- `data/raw/YYYY-MM.json` — GitHub snapshots; facts only, never edited by hand
- `drafts/YYYY-MM-interview.md` — the questions for a month, and their answers
- `drafts/YYYY-MM-provenance.json` — the facts a narrative was written against
- `drafts/YYYY-MM-pending.md` — commits that landed after the narrative was written
- `drafts/YYYY-MM-sessions.md` — the month's AI sessions for the interview: counts, named projects only
- `private/` — gitignored: Swarm and Modal caches, session titles, show/hide answers
- `scripts/fetch_github.py` — snapshot collector
- `scripts/draft_month.py` — turns a snapshot into a skeleton plus an interview
- `scripts/build_log.py` — ai-log + Swarm + Modal + snapshots → the build log and session notes
- `scripts/fetch_swarm.py`, `scripts/fetch_modal.py` — check-ins and billing into `private/`
- `scripts/localtime.py` — local time and away days from check-ins
- `scripts/prices.json` — list prices for the API-equivalent cost estimate
- `scripts/smoke_test.js` — headless render test
- `scripts/screenshots.py` — Playwright captures into `shots/`
- `assets/` — favicon and the `og.png` link-preview card, generated from the `.svg` sources
- `scripts/make-og.sh` / `scripts/make-icons.sh` — rasterize those SVGs; `scripts/og-lint.py` guards the card's size

## Running it

One command does everything:

```bash
export GITHUB_TOKEN=...
./update.sh                          # refresh the current month
./update.sh --month 2026-06          # a specific month
./update.sh --month 2026-08 --new    # draft a month that has no file yet
./update.sh --check                  # just run the render test
./update.sh --shots                  # also capture screenshots
./update.sh --no-cloud --no-ask      # quick and unattended: skip cloud sessions, never prompt
```

Besides GitHub, a refresh fetches the month's cloud sessions into ai-log and rebuilds
its index, pulls Swarm check-ins and Modal billing, and rebuilds the build log. Each of
those may fail without stopping the rest. Run from a terminal it can ask two things: a
fresh Swarm token when the old one has expired (paste a "Copy as cURL" of a
`historysearch` request from swarmapp.com/history, or press Enter to skip), and whether
a folder that is not on GitHub may be named on the page. Both answers are remembered.

Needs: `gh` and `claude` signed in (cloud sessions), the `modal` CLI (billing), and
Swarm credentials in `.env` (`SWARM_USERID`, `SWARM_WSID`, `SWARM_OAUTH_TOKEN`) or
`~/Dropbox/Code/swarm/config.json`. Without any of them that step is skipped.

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

## Social preview & icons

The `<head>` carries Open Graph / Twitter Card tags so a pasted link previews as a card rather
than a bare URL — a pattern carried over from `pwa-starter`. The card and favicon have SVG sources
under `assets/`; edit those, then regenerate the rasters:

```bash
./scripts/make-icons.sh      # assets/icon.svg  -> icon-180/192/512.png
./scripts/make-og.sh         # assets/og.svg    -> og.png (1200x630, size-gated)
```

`make-og.sh` fails if the card lands over the scraper size budget (a too-big card previews as a grey
box); `scripts/og-lint.py` re-checks it at commit time. Both prefer `rsvg-convert` and fall back to
`scripts/render_svg.py` (the Playwright already used for screenshots). To have the lint nag on every
commit, enable the warn-only hook once per clone:

```bash
git config core.hooksPath .githooks
```

The tags' absolute URLs assume the GitHub Pages origin in `data/index.js` (`site`); `app.js`
refreshes the title, description, and `og:url` per month for anything that runs JS, while the static
tags stay correct for scrapers.

## What the page deliberately does not do

- No global commit total in the hero. Public histories paginate and raw counts
  reward merge mechanics.
- No inferred context. Deadlines and reasons a week was quiet are supplied by hand;
  travel comes from the owner's own Swarm check-ins and is confirmed in the interview.
  Nothing is derived from commit metadata.
- No session titles or prompts on the page. Those stay in `private/`.
- No auto-generated prose. `draft_month.py` produces facts and `TODO`s; a person
  writes the sentences.
