# Interview — June 2026

Every question comes with the commits behind it, because the point of this page
is to work out where the time went — not to test recall. Read the context, then
answer. Short answers are fine; fragments are fine.

**Voice for the eventual prose:** neutral third person, plain, concrete. No second
person, no 'not merely', no claims about leverage or inflection points. A dull week
reads as dull.

---

## What the snapshot shows

`2026-06-01` to `2026-06-30` · 119 commits across 8 repos

| repo | commits | first | last |
| --- | ---: | --- | --- |
| `AKM` | 45 | 2026-06-28 | 2026-06-30 |
| `quartet-log` | 28 | 2026-06-02 | 2026-06-25 |
| `lobsters-and-lighthouses` | 11 | 2026-06-08 | 2026-06-13 |
| `boccherini-quartet-data` | 11 | 2026-06-24 | 2026-06-25 |
| `haydn-lowdn` | 10 | 2026-06-12 | 2026-06-17 |
| `haydn-info-card` | 10 | 2026-06-25 | 2026-06-27 |
| `haydnenthusiasts.org` | 3 | 2026-06-28 | 2026-06-30 |
| `quartet-chooser` | 1 | 2026-06-27 | 2026-06-27 |

Commits per day across the month:

```
Mon Jun 01  ·
Tue Jun 02  ███ 3
Wed Jun 03  █████████ 10
Thu Jun 04  ██ 2
Fri Jun 05  ·
Sat Jun 06  ██ 2
Sun Jun 07  ███ 3
Mon Jun 08  █████████ 10
Tue Jun 09  ·
Wed Jun 10  ·
Thu Jun 11  █ 1
Fri Jun 12  █ 1
Sat Jun 13  ██████ 7
Sun Jun 14  █ 1
Mon Jun 15  ·
Tue Jun 16  ·
Wed Jun 17  ██████ 7
Thu Jun 18  ·
Fri Jun 19  ·
Sat Jun 20  ·
Sun Jun 21  ·
Mon Jun 22  ·
Tue Jun 23  ·
Wed Jun 24  ██████ 7
Thu Jun 25  █████████ 10
Fri Jun 26  ██ 2
Sat Jun 27  ████ 5
Sun Jun 28  ██████ 7
Mon Jun 29  ████████████████████████ 28
Tue Jun 30  ███████████ 13
```

## The month

1. In one sentence, what was this month mostly about?
2. What went wrong, stalled, or got thrown away? Nothing in a commit log admits to a dead end, so if this is left blank the page will imply everything worked.
3. Is there work that belongs in the record but is not on public GitHub? How should it be referred to, if at all?
4. Any context — travel, a deadline, a performance, an outage — that explains the shape of the month? Look at the per-day chart above: the gaps and the spikes are the question.
5. The draft metrics are **8** public repos touched, **119** public commits. Is any of those misleading or beside the point? What would you put there instead?

---

## The weeks

### Week 01 — Jun 1–7

20 commits · intensity guessed at 3/5

```
Mon Jun 01  ·
Tue Jun 02  ███ 3
Wed Jun 03  █████████ 10
Thu Jun 04  ██ 2
Fri Jun 05  ·
Sat Jun 06  ██ 2
Sun Jun 07  ███ 3
```

**`quartet-log`** — 20 commits

- `2026-06-02` [add Top Musicians to dashboard](https://github.com/jsundram/quartet-log/commit/ddec64df739652c8bfc16e7cf43b493c14801d48)
- `2026-06-02` [store data url in a file and supply it during local builds](https://github.com/jsundram/quartet-log/commit/0eb224de3a8a3e97205fafefe08dd1ae71753511)
- `2026-06-02` [add composer/musician count for top N charts on dashboard](https://github.com/jsundram/quartet-log/commit/f1169df52b7358957c27b1c4dc93aa901a0af867)
- `2026-06-03` [add musician network section with graph and matrix views](https://github.com/jsundram/quartet-log/commit/94e24af5a5ae44d66116a84a4a3892ce7f5540f2)
- `2026-06-03` [color top musicians bars and network nodes by instrument](https://github.com/jsundram/quartet-log/commit/42de1e3c339117a096145a35962533cc3bd9ffe4)
- `2026-06-03` [sessions -> pieces](https://github.com/jsundram/quartet-log/commit/94f911eec74c54f248d4b304611b8b0ad69c9272)
- `2026-06-03` [tune musician network defaults and fix tooltip visibility](https://github.com/jsundram/quartet-log/commit/b8cb88e3e1a4a3cbf1dc9b2269f598298237e28a)
- `2026-06-03` [add chord diagram network view](https://github.com/jsundram/quartet-log/commit/afe6a6821d4da801b78234f0b788a3c01c000fd3)
- `2026-06-03` [make chord diagram labels better](https://github.com/jsundram/quartet-log/commit/8fc47d7251a14acedd24cb8922061d4acc79486a)
- `2026-06-03` [add network expand button](https://github.com/jsundram/quartet-log/commit/38a9916fa271a618a7921531216aceba7957be77)
- `2026-06-03` [updated cell/font sizes for matrix view](https://github.com/jsundram/quartet-log/commit/0c8c6895a6b364fdd8bb6ff67bda5085d1fbf732)
- `2026-06-03` [move full screen buton](https://github.com/jsundram/quartet-log/commit/6d35febbdd2b95f138c9b36e1abccd6b06603637)
- `2026-06-03` [add names checkbox for graphs, fix tooltips on full screen](https://github.com/jsundram/quartet-log/commit/bf8c8b2216bec651a43bc671f4ee94704a542c05)
- `2026-06-04` [better parsing of the Others? field](https://github.com/jsundram/quartet-log/commit/9a54e933ba887dc437bd282bb9fb960607ab1e62)
- `2026-06-04` [add data fetch scripts](https://github.com/jsundram/quartet-log/commit/cfd925f8fe378fda6129d122010cb9ca8e8e9f02)
- `2026-06-06` [Isaac Krauss -> Isaac](https://github.com/jsundram/quartet-log/commit/1b54e705adfff2279d3b57eeddd4d9b7e77f8ebe)
- `2026-06-06` [add data fetching scripts](https://github.com/jsundram/quartet-log/commit/92ea4b2d9d43de82814696b043386224410d67c0)
- `2026-06-07` [expand touch targets on dashboard graph and chord views](https://github.com/jsundram/quartet-log/commit/a5591e9e84b50126a785ded3d2fdd9697f7bfa58)
- `2026-06-07` [reserve fixed height for dashboard ranked charts and network views](https://github.com/jsundram/quartet-log/commit/09aae3ad460fdc32aa2bc24a35261f1e3f4e12d6)
- `2026-06-07` [don't click on edges inside of nodes](https://github.com/jsundram/quartet-log/commit/566a98c8f526720ddcb9140c24205dc1b347b469)

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 3/5 from commit counts alone. What did the week actually feel like?

### Week 02 — Jun 8–14

20 commits · intensity guessed at 3/5

```
Mon Jun 08  █████████ 10
Tue Jun 09  ·
Wed Jun 10  ·
Thu Jun 11  █ 1
Fri Jun 12  █ 1
Sat Jun 13  ██████ 7
Sun Jun 14  █ 1
```

**`lobsters-and-lighthouses`** — 11 commits

- `2026-06-08` [Initial commit — Maine day-trip handout build pipeline](https://github.com/jsundram/lobsters-and-lighthouses/commit/537c4fc53468ab0d8beb6e77c007ee596f281b10)
- `2026-06-08` [Add repo URL and publish-changes note to CLAUDE.md](https://github.com/jsundram/lobsters-and-lighthouses/commit/ea32530f667bdd08f803ae699b2abe3f6c0423ae)
- `2026-06-08` [Add 2-page PDF generation via Playwright + auto-scale](https://github.com/jsundram/lobsters-and-lighthouses/commit/b23405a2b813966f298465d79e3e24bc3c62a4f2)
- `2026-06-08` [Fix font harmonization between Daylight and Tides insets in PDF](https://github.com/jsundram/lobsters-and-lighthouses/commit/0c7187f869004e778e3c6866db735eb65b03aec6)
- `2026-06-08` [Tune tide-chart label sizes to match daylight inset](https://github.com/jsundram/lobsters-and-lighthouses/commit/635d6a0c63fccaa697dd2c7ca4bc8f3d94bed37b)
- `2026-06-08` [Fill print background to page edges](https://github.com/jsundram/lobsters-and-lighthouses/commit/8cce0db45bce8f32056563e5b93737379dce901d)
- `2026-06-08` [Codebase cleanup: dead code, fonts, CSS, README, run helper](https://github.com/jsundram/lobsters-and-lighthouses/commit/334fd677aafa70293dba7f4d0f9e7fb37d958914)
- `2026-06-08` [Split data/ into fonts/ and cache/](https://github.com/jsundram/lobsters-and-lighthouses/commit/0906df31f2474166369983ebbd917d8c9b44e7b7)
- `2026-06-08` [Wire up Netlify auto-deploy from main](https://github.com/jsundram/lobsters-and-lighthouses/commit/df1ab39c6477f1f9e6a2d2a14fab3b58f0c70f43)
- `2026-06-13` [Generate share-sheet previews and rasterize handout to PNG](https://github.com/jsundram/lobsters-and-lighthouses/commit/f8dce2140b0387292e9381ca02a018b09564aa23)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**`haydn-lowdn`** — 7 commits

- `2026-06-12` [Initial commit](https://github.com/jsundram/haydn-lowdn/commit/b8eeaab3aa6872f1751e4ae661c8e25bfcec19f7)
- `2026-06-13` [Fix bg-lines disappearing past Op. 1](https://github.com/jsundram/haydn-lowdn/commit/22b59cb4d9d729085144ccebf5ac6e5f3bf12e62)
- `2026-06-13` [Pin bg-lines width in JS too (mobile Safari fix)](https://github.com/jsundram/haydn-lowdn/commit/616b9259f1103be8bb79f4256d84b9793585d3e2)
- `2026-06-13` [Pin axis-svg width too — single source of truth for bars-area width](https://github.com/jsundram/haydn-lowdn/commit/5a0c28c1943fda4fd7229e5228a32bdf63988cf3)
- `2026-06-13` [Ignore verify/ output dir](https://github.com/jsundram/haydn-lowdn/commit/b5902d82e005966f3ba6ad1fdaaea1f29116c62b)
- `2026-06-13` [Add snapshot.sh, README, and outputs/ samples](https://github.com/jsundram/haydn-lowdn/commit/f8ba7d0bf0108eb187a0916582a45cede74dd03f)
- `2026-06-13` [Bigger axis labels on mobile, stack tight pairs to avoid collision](https://github.com/jsundram/haydn-lowdn/commit/31dd2a07601749042727e47d931a10e9ccad3013)

**`quartet-log`** — 2 commits

- `2026-06-11` [chord diagram room for labels in full screen view](https://github.com/jsundram/quartet-log/commit/73b684558468f4a5f1839a270079928dad24cb9f)
- `2026-06-14` [extend per-year calendar tooltips with rate-based stats](https://github.com/jsundram/quartet-log/commit/49caf64093179268df8a7c21a9cfd0938cf9c5fa)

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 3/5 from commit counts alone. What did the week actually feel like?

### Week 03 — Jun 15–21

7 commits · intensity guessed at 2/5

```
Mon Jun 15  ·
Tue Jun 16  ·
Wed Jun 17  ██████ 7
Thu Jun 18  ·
Fri Jun 19  ·
Sat Jun 20  ·
Sun Jun 21  ·
```

**`quartet-log`** — 4 commits

- `2026-06-17` [add pull-to-refresh for installed-PWA mode](https://github.com/jsundram/quartet-log/commit/92d502afc5dd671ea5b458e0b3b3e63efd55bb17)
- `2026-06-17` [PWA standalone polish: Apple meta tags and safe-area handling](https://github.com/jsundram/quartet-log/commit/b74c6a7edbeef97f2748e710da5df1b1464308d4)
- `2026-06-17` [auto-refresh data on resume and on a 5-minute foreground poll](https://github.com/jsundram/quartet-log/commit/a71ef4a21911e529c611943173fac7d9a459ef97)
- `2026-06-17` [shrink mobile hamburger to match desktop sizing](https://github.com/jsundram/quartet-log/commit/7057f42729cebda2ad69a24d41750b4b1b5d94e3)

**`haydn-lowdn`** — 3 commits

- `2026-06-17` [expand axis lines to include E6 and E7](https://github.com/jsundram/haydn-lowdn/commit/ec587d8e5a91595d945d0677383e155d16e76dc2)
- `2026-06-17` [Add Offset Bars toggle, redesign toolbar](https://github.com/jsundram/haydn-lowdn/commit/16639d00fa65d780d60246f2508eacaee6ddea61)
- `2026-06-17` [add stars for extremes](https://github.com/jsundram/haydn-lowdn/commit/b0f9d2da4b160328e9bf6c6f2397006f37781245)

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 2/5 from commit counts alone. What did the week actually feel like?

### Week 04 — Jun 22–28

31 commits · intensity guessed at 4/5

```
Mon Jun 22  ·
Tue Jun 23  ·
Wed Jun 24  ██████ 7
Thu Jun 25  █████████ 10
Fri Jun 26  ██ 2
Sat Jun 27  ████ 5
Sun Jun 28  ██████ 7
```

**`boccherini-quartet-data`** — 11 commits

- `2026-06-24` [feat(lilypond): add Op32 & Op33 IMSLP imports + README notes](https://github.com/jsundram/boccherini-quartet-data/commit/c84e97f498ed48514f37f6430fae7e0e2dca94a9)
- `2026-06-24` [docs(lilypond): add encoding template, HOWTO, and offline LilyPond reference](https://github.com/jsundram/boccherini-quartet-data/commit/365154eeeafde1d317cc5518a2c5e430112b76cf)
- `2026-06-24` [refactor(lilypond): normalize Op32/Op33 filenames to Makefile convention](https://github.com/jsundram/boccherini-quartet-data/commit/143e5553d2305e9bf046eb8510c521899bd06880)
- `2026-06-24` [feat(lilypond): add content-change review tooling](https://github.com/jsundram/boccherini-quartet-data/commit/433352544e751af5f2e6f2ec2394a9bd392798bd)
- `2026-06-24` [docs(lilypond): add CLAUDE.md (orientation, conventions, workflows)](https://github.com/jsundram/boccherini-quartet-data/commit/8c1b182d911e757b4fe1821bf953ff140deebc05)
- `2026-06-25` [feat: CI-rendered before/after for note corrections; simplify the flow](https://github.com/jsundram/boccherini-quartet-data/commit/2f858530e3ce2e7794a7fd4b83429eadd7949497)
- `2026-06-25` [ci: install ghostscript (\epsfile logos) + surface lilypond errors](https://github.com/jsundram/boccherini-quartet-data/commit/4fbbec124234d06dac61f82ecfaac15d72335e18)
- `2026-06-25` [fix: rename Lily.eps -> lily.eps to match \epsfile reference (case-sensitive FS)](https://github.com/jsundram/boccherini-quartet-data/commit/a68451eba546d81e399a3f3e2df03bf43f905164)
- `2026-06-25` [docs: add explicit squash-merge instructions to CONTRIBUTING](https://github.com/jsundram/boccherini-quartet-data/commit/fdc2c4e357350058f758660449db1b83085ca3e7)
- `2026-06-25` [docs: show how to carry the PR body into the squash commit](https://github.com/jsundram/boccherini-quartet-data/commit/45572683eced1f1114caaa85c9992ba92abc96d5)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**`haydn-info-card`** — 10 commits

- `2026-06-25` [Add interactive web card (D3 periodic table) + GitHub Pages deploy](https://github.com/jsundram/haydn-info-card/commit/cfe36e2d8a14dd72967f0d99a70af2b047d1ae5e)
- `2026-06-25` [Link the live web card in README; deploy on any push to main](https://github.com/jsundram/haydn-info-card/commit/a1ffd94cfe8f861ae805f927dd0d8aab09ac8734)
- `2026-06-25` [Trigger GitHub Pages deploy](https://github.com/jsundram/haydn-info-card/commit/b9c1ff8651b6aac37a15b271936459f5a425b413)
- `2026-06-25` [Update web README: live status + development notes](https://github.com/jsundram/haydn-info-card/commit/433873cd5ca7b7433840d2beac6144b83b8ddf13)
- `2026-06-26` [Scale movement bars by exact Spotify track durations](https://github.com/jsundram/haydn-info-card/commit/fabbaa7ab30a4f28e7aa0936d4ddc385c9da2bfe)
- `2026-06-26` [Store both performances' durations; show both in the tooltip](https://github.com/jsundram/haydn-info-card/commit/f4ef97e578dca1691289c0d0227502f79aab31f4)
- `2026-06-27` [Key spotify_durations.json by movement ID and fix two mis-ordered quartets](https://github.com/jsundram/haydn-info-card/commit/63cbf882d02732689de188311429db2d9cb6ed28)
- `2026-06-27` [keep creds outta repo](https://github.com/jsundram/haydn-info-card/commit/b2780f133ed67047a50a4c75faeec5a7eebe2b5a)
- `2026-06-27` [Add track-audit script, TODO notes, reference tables; ignore output intermediates](https://github.com/jsundram/haydn-info-card/commit/f96187328def87385b3a9caaccc23a3c070e875e)
- `2026-06-27` [Add WIP poster-size dark-background card variant](https://github.com/jsundram/haydn-info-card/commit/9248354627259768c8d845e9b2e2ec88f5e1bf63)

**`AKM`** — 6 commits

- `2026-06-28` [Initial commit: Lesachtal festival briefing PWA](https://github.com/jsundram/AKM/commit/d0271986062ec0479d1b30ca1fab4d5cd93c7da3)
- `2026-06-28` [Rename project to AKM; fix dropped morning all-hands block](https://github.com/jsundram/AKM/commit/b4ce248e16ecda463f150d91b4f96aea7d8a4953)
- `2026-06-28` [Add footer link to the day's source Google Sheets tab](https://github.com/jsundram/AKM/commit/7af5064e8e2155a4ba12c75878265fc8d00ec294)
- `2026-06-28` [Auto-maintain the tab→gid map via pre-commit hook](https://github.com/jsundram/AKM/commit/2b3a3af8f2aabc4f7c05a2ac213a19d6db28949e)
- `2026-06-28` [Replace abstract temperature-peak icon with an alpine dawn scene](https://github.com/jsundram/AKM/commit/c1da29659b7ce4e670fa41c76f001529b2b2bbaa)
- `2026-06-28` [Fix iPhone mobile view + add pull-to-refresh](https://github.com/jsundram/AKM/commit/be8d19c4776bae304f8a762e78a4a5b419f61df1)

**`quartet-log`** — 2 commits

- `2026-06-24` [guard updateTotalCount against composers with zero plays](https://github.com/jsundram/quartet-log/commit/3727d82bc9016e14007e5a29900cd4aa39303b57)
- `2026-06-25` [add Open Graph / Twitter Card metadata and preview image](https://github.com/jsundram/quartet-log/commit/13f1428173355f590af0dcbf303901d20937b800)

**`quartet-chooser`** — 1 commit

- `2026-06-27` [modernize update.py: uv support and google-auth migration](https://github.com/jsundram/quartet-chooser/commit/6511e9ca8defd2b172a1ce827be25919b87c02fe)

**`haydnenthusiasts.org`** — 1 commit

- <sub>routine commits only — nothing worth narrating</sub>
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 4/5 from commit counts alone. What did the week actually feel like?

### Week 05 — Jun 29–30

41 commits · intensity guessed at 5/5

```
Mon Jun 29  ████████████████████████ 28
Tue Jun 30  ███████████ 13
```

**`AKM`** — 39 commits

- `2026-06-29` [Add Roster and village Map pages (footer-linked, offline-first)](https://github.com/jsundram/AKM/commit/8ec44e8aebbfacf1eec47161c3681e9a0ef937e8)
- `2026-06-29` [Roster: add sortable Type column, compact rows](https://github.com/jsundram/AKM/commit/9ba4529e3a944e7929990117ef69d82812b80a06)
- `2026-06-29` [Roster: wire up header sorting; linkify URLs in Notes](https://github.com/jsundram/AKM/commit/252e476f5eadfec47b56bed3b70c98d9c0bd1b8b)
- `2026-06-29` [Roster: sort DIR then MGR ahead of all other types](https://github.com/jsundram/AKM/commit/1e650f86aaa47145d2c2501d08e3dabbca173ddc)
- `2026-06-29` [Weather: add Drizzle + Clear/Cloudy/Overcast conditions](https://github.com/jsundram/AKM/commit/a4c446ce2b47d37973b516a4f5f0dad529593b2e)
- `2026-06-29` [Weather: put sunrise/sunset on the temp curve; drop wettest footer](https://github.com/jsundram/AKM/commit/e9eb23ea01ea2fb94fb458297346657d719c4711)
- `2026-06-29` [Roster: sort instruments in score order, not alphabetically](https://github.com/jsundram/AKM/commit/25212ed761a2d0aa0dbdfecd0fcf9728c24eea82)
- `2026-06-29` [Roster: within a family, sort plain instruments before "/" combos](https://github.com/jsundram/AKM/commit/f1614da96e2448f3baaca697cceaa070542fab9e)
- `2026-06-29` [Roster: collapse instruments to V / V/VA / VA / VC / Bass / Piano / Clar.](https://github.com/jsundram/AKM/commit/08cbc3d0ae17aec1e152b9da2763fb73ebc4db0f)
- `2026-06-29` [Docs: refresh README + CLAUDE for roster, map, and weather changes](https://github.com/jsundram/AKM/commit/bc05a47a7ee6c7c567a00c23cbd0bc42edd0f03f)
- `2026-06-29` [Add repo-restructure plan (feature folders) — not yet executed](https://github.com/jsundram/AKM/commit/725f7acf9c59b0d37f0e102a689ffabe0789c239)
- `2026-06-29` [Roster: add "Edit sheet ↗" footer link to the source Google Sheet](https://github.com/jsundram/AKM/commit/c8215716cebacbbdbaf5d337e8c51ed06068932d)
- `2026-06-29` [Roster: keep footer pills on one line (no mid-text wrap)](https://github.com/jsundram/AKM/commit/43a88bbc3c62ee492ba23abcbd8a4231b0a96020)
- `2026-06-29` [Map: relief + aerial layers, labels, mobile gestures, fresher caching](https://github.com/jsundram/AKM/commit/f6f71e28b71d6e69bf982fe049c08177860967bf)
- `2026-06-29` [Map: add live "you are here" blue location dot](https://github.com/jsundram/AKM/commit/2bc37e027db1e559e34688b18f3332f006833cb6)
- `2026-06-29` [Map: add faint accuracy ring around the location dot](https://github.com/jsundram/AKM/commit/6ea4d025fa35edb5ae210e99e79bda5baa5bb63d)
- `2026-06-29` [Schedule: clearer coach P/C labels (Coach plays / Coach observes)](https://github.com/jsundram/AKM/commit/37ebe95560e140f50f52b53aabbfbac4c37cb35f)
- `2026-06-29` [Map: add Werner venue + show schedule room codes on pins](https://github.com/jsundram/AKM/commit/661079d86a00a4111dd42c36b4223541eff1d344)
- `2026-06-29` [Weather: source from GeoSphere Austria (AROME) with Open-Meteo fallback](https://github.com/jsundram/AKM/commit/c46f6fbb26a4714ac0ac704348384826ffe297e8)
- `2026-06-29` [Roster: surface "From" (location) in the tap-to-expand detail](https://github.com/jsundram/AKM/commit/cc813ee63442d6b04acb70086b6d0dba17fd7e54)
- `2026-06-29` [Roster: match the actual "Hometown" header explicitly](https://github.com/jsundram/AKM/commit/05b090b2d6a17b79ca7407a1fb5d5dba07f553e8)
- `2026-06-29` [Map: correct WERNER venue to Liesing 30](https://github.com/jsundram/AKM/commit/3e6b57c8f7cd695fad46b39f34b07ed30fb7af80)
- `2026-06-29` [Roster: add G (guest) to the type-rank](https://github.com/jsundram/AKM/commit/a44b737ed07afaadf0d2016e642bf9d3bde768ff)
- `2026-06-29` [Roster: point at the new cleaned tab (gid 800090339)](https://github.com/jsundram/AKM/commit/0bcbf3bfa6abb3c8bfce820914308031708379f5)
- `2026-06-29` [Map: tap a building for its OSM name + address](https://github.com/jsundram/AKM/commit/0b1ce84b37c88dd28d9fd9ea91c8db940ab797a9)
- …and 14 more in this repo

**`haydnenthusiasts.org`** — 2 commits

- `2026-06-30` [Add prominent download + interactive CTA buttons to info card page](https://github.com/jsundram/haydnenthusiasts.org/commit/52412f487b0ba1ad6fc2d43bb945bd725098a476)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 5/5 from commit counts alone. What did the week actually feel like?

---

## After the answers

1. Rewrite every `TODO` in `data/months/2026-06.js`.
2. Delete any `note` field that has nothing honest to say.
3. Add the month to `data/index.js` (newest first) with a one-sentence `blurb`.
4. Open `index.html#2026-06` and read it end to end.
5. Keep this file. It is the provenance for prose that is otherwise unfalsifiable.

---

## Answers — recorded 2026-07-24

**1. What was the month mostly about?**
Ongoing work building and refining quartet-log's dashboard view and adding more stats;
the one-off "Lobsters and Lighthouses", a whimsical project that really helped me see
the promise of PWA for daily use; the first creation of haydn-lowdn (exploring the range
of each part of Haydn quartets); and the port of the Haydn info card to a PWA-style page
which works better on a variety of surfaces. Some of that work set the scene for starting
the AKM app as a personal schedule app and then growing it into an app for everyone over
the course of a live festival.

**2. The Jun 18–23 gap.**
Packed with a lot of music playing, some work conversations, the Lobsters and Lighthouses
actual trip (the point of the app/handout from earlier in the month), and getting ready to
travel to Europe. The trip was taken on June 22.

**3. What stalled or got thrown away?**
- *AKM repo restructure* — seemed like good follow-up work for the AKM app, which grew kind
  of organically, but isn't urgent. Postpone until the app isn't under heavy use and the
  future of it (2027) is clearer.
- *WIP poster-size dark-background Haydn card* — didn't go anywhere yet, but hoping to
  resume work on it. Worth highlighting as a loose thread.

**4. Was AKM's Jun 28 start a deadline or a decision?**
A decision. Started small, snowballed, and got me excited.

**5. Metrics.**
Open to ideas, but days with code committed, number of repositories, and possibly
big/interesting features would be good.

**6. Week 1, quartet-log.**
One idea, iteratively refined.

**7. Week 2, Lobsters and Lighthouses.**
The trip was taken on June 22.

**8. quartet-chooser's single Jun 27 commit.**
"quartet-chooser is picking up a repo that needs some love, and will hopefully get some more
this month. Is the date right on that commit? I think I didn't pay attention to quartet-chooser
until July."

*Checked against the API: the Jun 27 commit is real — author and committer dates both read
`2026-06-27T11:26:00Z`. The recollection is nearly right though: it is an isolated drive-by,
and the next quartet-chooser commits are on 2026-07-24 (SSRF override, GA removal, Dependabot,
Node pinned to 18.x). Recorded in the June narrative as a drive-by, with the substance in July.*

## Corrections this interview produced

The pre-interview draft of this month was written from an older prototype's prose rather than
from commits, and was wrong in ways worth recording:

- Jun 1–7 was described as having no data. It is 20 commits on quartet-log.
- lobsters-and-lighthouses was dated to the week of Jun 15. It was built on Jun 8.
- haydn-lowdn was dated to the same week. Its initial commit is Jun 12.
- The month was described as starting on Jun 13 because that was where the old fetch window
  opened, not because anything happened then.
