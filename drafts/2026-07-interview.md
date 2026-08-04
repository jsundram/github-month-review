# Interview — July 2026

Every question comes with the commits behind it, because the point of this page
is to work out where the time went — not to test recall. Read the context, then
answer. Short answers are fine; fragments are fine.

**Voice for the eventual prose:** neutral third person, plain, concrete. No second
person, no 'not merely', no claims about leverage or inflection points. A dull week
reads as dull.

---

## What the snapshot shows

`2026-07-01` to `2026-07-24` · 196 commits across 9 repos

| repo | commits | first | last |
| --- | ---: | --- | --- |
| `AKM` | 111 | 2026-07-02 | 2026-07-17 |
| `pwa-starter` | 20 | 2026-07-12 | 2026-07-22 |
| `somerville-typemap` | 17 | 2026-07-22 | 2026-07-22 |
| `haydn-info-card` | 15 | 2026-07-04 | 2026-07-23 |
| `quartets.boccherini.org` | 10 | 2026-07-22 | 2026-07-22 |
| `quartet-log` | 8 | 2026-07-14 | 2026-07-22 |
| `boccherini-sampler` | 8 | 2026-07-17 | 2026-07-18 |
| `spotify-tile` | 5 | 2026-07-24 | 2026-07-24 |
| `quartet-chooser` | 2 | 2026-07-24 | 2026-07-24 |

Commits per day across the month:

```
Wed Jul 01  ·
Thu Jul 02  ██ 3
Fri Jul 03  █████ 9
Sat Jul 04  ████ 6
Sun Jul 05  ████ 6
Mon Jul 06  ██████████████████████ 38
Tue Jul 07  ██████ 11
Wed Jul 08  ██████ 10
Thu Jul 09  ████████ 14
Fri Jul 10  █ 2
Sat Jul 11  █ 2
Sun Jul 12  █ 2
Mon Jul 13  █ 1
Tue Jul 14  ████████ 14
Wed Jul 15  ██ 4
Thu Jul 16  ·
Fri Jul 17  █████ 9
Sat Jul 18  ████ 6
Sun Jul 19  ·
Mon Jul 20  █████ 9
Tue Jul 21  ·
Wed Jul 22  ████████████████████████ 41
Thu Jul 23  █ 2
Fri Jul 24  ████ 7
```

## The month

1. In one sentence, what was this month mostly about?
2. What went wrong, stalled, or got thrown away? Nothing in a commit log admits to a dead end, so if this is left blank the page will imply everything worked.
3. Is there work that belongs in the record but is not on public GitHub? How should it be referred to, if at all?
4. Any context — travel, a deadline, a performance, an outage — that explains the shape of the month? Look at the per-day chart above: the gaps and the spikes are the question.
5. `AKM` is 57% of the month's commits. Was that the intent, or did it crowd out something you meant to do?
6. The draft metrics are **9** public repos touched, **196** public commits. Is any of those misleading or beside the point? What would you put there instead?

---

## The weeks

### Week 01 — Jul 1–5

24 commits · intensity guessed at 2/5

```
Wed Jul 01  ·
Thu Jul 02  ██ 3
Fri Jul 03  █████ 9
Sat Jul 04  ████ 6
Sun Jul 05  ████ 6
```

**`AKM`** — 21 commits

- `2026-07-02` [Schedule: stop the DAILY NOTES block from being parsed as dinners](https://github.com/jsundram/AKM/commit/48763705595acad742024dffce21befdf81a1a8a)
- `2026-07-02` [Schedule: recognize A3 as a room; alias it to Kultursaal on the map](https://github.com/jsundram/AKM/commit/7c5e110ee58843a738c9abf3b78279d069575eff)
- `2026-07-02` [Personal events: brass "just for me" styling + tap-to-edit](https://github.com/jsundram/AKM/commit/6865e7bac2862750240a3157ae3278b3e85d53b8)
- `2026-07-03` [Multi-user: first-open picker, per-user day on every page](https://github.com/jsundram/AKM/commit/39d81990bd41601668b22dad324581fc8a461828)
- `2026-07-03` [About page, reached via the wordmark](https://github.com/jsundram/AKM/commit/35b4f5be88815b15071c70007b2131f3c68ab191)
- `2026-07-03` [Parse the sheet's live curveballs: new rooms, mid-day faculty cells](https://github.com/jsundram/AKM/commit/b34711d304bb1576ae14ebd760e692f8b2d1d489)
- `2026-07-03` [Faculty rehearsals: only open (THEATRE/KS) + only when you're free](https://github.com/jsundram/AKM/commit/e362f8089a3d999627b2628819b5d968a4a632fd)
- `2026-07-03` [No faculty-rehearsal CTAs; call out your unscheduled blocks instead](https://github.com/jsundram/AKM/commit/021ce875eb15c7200169c58efb77fe6aabf1a324)
- `2026-07-03` [Map: Akademie/Kultursaal relabel, split-role pins, readable legend](https://github.com/jsundram/AKM/commit/b2b95d21b6b1e1e24c3eaae0d43dcd227dd58cc2)
- `2026-07-03` [Map: lodging footprints were black — selector typo](https://github.com/jsundram/AKM/commit/0008ec05905e6df076ea93497271a611a544217d)
- `2026-07-03` [Map: split footprints match split pins; legend says "lodging + food"](https://github.com/jsundram/AKM/commit/9896d8dac7bd09508377d0feace88ac1b7da6135)
- `2026-07-03` [Map: un-merge Akademie from Kultursaal — rename reconcile now idempotent](https://github.com/jsundram/AKM/commit/ca8c8c92277bc1574d09a30047da9669def98fb9)
- `2026-07-04` [About: rewrite in Jason's voice, add a CTA into the app](https://github.com/jsundram/AKM/commit/f57237c51fbbf392b12d1c3dc53bc6f0f1838386)
- `2026-07-04` [Add buildlog/: six-day build dashboard (hours, commits, code growth)](https://github.com/jsundram/AKM/commit/1f40e02df23b229288b2a41c77247502f59b5744)
- `2026-07-05` [Network: parse the pieces sheet by header, not fixed column](https://github.com/jsundram/AKM/commit/5be1882ec15bba3a209d70b01497e53632bf8218)
- `2026-07-05` [Network: printable "|" key delimiter (drop the stray NUL bytes)](https://github.com/jsundram/AKM/commit/6b7ed959ec831cefd15ea30a1b97ad7b0124f4ac)
- `2026-07-05` [Network: resolve "Preetcharn Saund" + "Steve", fix blank-instrument sort test](https://github.com/jsundram/AKM/commit/5dedea17495f1e6a35106e713c8222da00c4c315)
- `2026-07-05` [Network: drop the stale "Steve" alias (roster is now "Steve Buck")](https://github.com/jsundram/AKM/commit/3548fb83a56e20784991d5392d727d98aac0675f)
- `2026-07-05` [Network: drop the ALIAS table, tighten the resolver, surface unmatched](https://github.com/jsundram/AKM/commit/cfe3d56c181fe290f940621fd6520c9242dba09d)
- `2026-07-05` [Roster: pieces as a bulleted list with co-player reveal; drop Notes + source link](https://github.com/jsundram/AKM/commit/8d56c832800e4f9ba1cf4268d17954bd900767b0)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**`haydn-info-card`** — 3 commits

- `2026-07-04` [Add GoatCounter analytics to web pages](https://github.com/jsundram/haydn-info-card/commit/d4ccccdd9c81dc10e590f49996481748ffaea0be)
- `2026-07-04` [Harden link previews: compress OG images, add favicons + meta polish](https://github.com/jsundram/haydn-info-card/commit/9bb767c13784a91f38b4194d7c752d626400a5f9)
- `2026-07-04` [Recolor site icons to Opus 33 cyan; round the apple-touch corners](https://github.com/jsundram/haydn-info-card/commit/4ca31e9420d0fe2fb03801854d02b1cc395988a1)

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 2/5 from commit counts alone. What did the week actually feel like?

### Week 02 — Jul 6–12

79 commits · intensity guessed at 5/5

```
Mon Jul 06  ██████████████████████ 38
Tue Jul 07  ██████ 11
Wed Jul 08  ██████ 10
Thu Jul 09  ████████ 14
Fri Jul 10  █ 2
Sat Jul 11  █ 2
Sun Jul 12  █ 2
```

**`AKM`** — 78 commits

- `2026-07-06` [Roster: instrument/sort/type polish; split the two Obernosterer lodgings on the map](https://github.com/jsundram/AKM/commit/3e8657555bf92f84dbe3fdf4f02df38a766e9f99)
- `2026-07-06` [About: tighten the copy](https://github.com/jsundram/AKM/commit/515e4abf1795662c5e0d7d439f588d44712bfceb)
- `2026-07-06` [Schedule: source each user's group→piece from the Repertoire, not the roster prefix](https://github.com/jsundram/AKM/commit/e6ac5d33b377da693c4e1cae4745cc9443eaf16f)
- `2026-07-06` [Schedule: build byGroup from the legacy prefix too, restoring the test suite](https://github.com/jsundram/AKM/commit/6f8c74cbc23b95e004c87b995f5d895ba84fefac)
- `2026-07-06` [Test: add a live schedule smoke test; make live tests skip-on-offline](https://github.com/jsundram/AKM/commit/79f8775aed871ee6a840f3aa4e9184f4d1c4313e)
- `2026-07-06` [About: lead with Install; fix the privacy claims](https://github.com/jsundram/AKM/commit/f691ebba402875262059586a44f0adc462d60ca1)
- `2026-07-06` [About: remove the duplicate Install section left from the move](https://github.com/jsundram/AKM/commit/bfa03fc4995b2cd5144285b5a7c28cf73628364c)
- `2026-07-06` [Schedule: centre the selected day chip (today drifts off the right edge mid-festival)](https://github.com/jsundram/AKM/commit/e497d5b046d6c4406c3f6e0fd9491f6f6e75dd82)
- `2026-07-06` [generate rep per player online, don't need to regen roster column offline; remove rep column in roster sheet](https://github.com/jsundram/AKM/commit/40764e0c9d6c9a072e54d25a9b4e271ac3deb6ad)
- `2026-07-06` [Test: schedule-test sweeps every festival day (15/15); ignore local _*.html scratch](https://github.com/jsundram/AKM/commit/78640f6c066dc323bb994ccf1a3ba06cc2408a51)
- `2026-07-06` [Schedule: official Practice/Reading blocks are tap-to-add like personal free slots](https://github.com/jsundram/AKM/commit/d497f8bf6698be810ecbf17a67fc11e40736c171)
- `2026-07-06` [Add sheet: WITH field is roster autocomplete as chips (multiple players)](https://github.com/jsundram/AKM/commit/ac3c6d7dca81d94c4e58e9e1a164c5c42a2ee1aa)
- `2026-07-06` [Schedule: adding an event over an official practice block replaces it, not duplicates](https://github.com/jsundram/AKM/commit/becad819f100ea7fa8cef0ff5bd7c7058be298e7)
- `2026-07-06` [Map: initial view fills the pane (cover) instead of letterboxing the square bbox](https://github.com/jsundram/AKM/commit/b96d3076339c024ccc0e2e306759cb571506db48)
- `2026-07-06` [Map: KS is venue + lodging (Kultursaal apartment), not venue + food](https://github.com/jsundram/AKM/commit/d262d4cc2336a18c9f3dd3fc662f4f7b80d05894)
- `2026-07-06` [Map: separate lodging vs venue pin colours (blue vs green, not two teals)](https://github.com/jsundram/AKM/commit/95367af826dc631235b8ac610466c107a8fa8443)
- `2026-07-06` [Map: the swimming pond is "Pool" with a pond-sized label, not river-sized](https://github.com/jsundram/AKM/commit/d73059f64bd8dd58892ecfe2b7c6e551b3fb41b5)
- `2026-07-06` [Add sheet: commit WITH suggestion on pointerdown so mobile taps land](https://github.com/jsundram/AKM/commit/f3ba286156ecf1f8210afdd4781e2975c0fa7e07)
- `2026-07-06` [Add sheet: commit WITH suggestion on touchstart/mousedown (pointerdown wasn't enough on iOS)](https://github.com/jsundram/AKM/commit/a8a8bd0a1dff713e27c30e36506e6dd8a97846ed)
- `2026-07-06` [Testing: note the ngrok on-device preview for uncommitted / touch-specific code](https://github.com/jsundram/AKM/commit/3246ee14e381d9bb633f732f9ed17a1fa863971d)
- `2026-07-06` [buildlog: refresh through 2026-07-06 (119 commits, 32h in session)](https://github.com/jsundram/AKM/commit/8bfe6705a9bd458765521f75d9ab750121f404d6)
- `2026-07-06` [buildlog: refresh through 2026-07-06 (120 commits, 32h in session)](https://github.com/jsundram/AKM/commit/548e2e5401ae70b4d096af12f2e4c98b09ef25dc)
- `2026-07-06` [buildlog: nightly auto-refresh via update.py + launchd](https://github.com/jsundram/AKM/commit/b32be5998afc2fe938fe14c8c4873c3a81aa45de)
- `2026-07-06` [Android: keep the add-sheet above the soft keyboard; harden pull-to-refresh](https://github.com/jsundram/AKM/commit/02b8c4997627bb93dc9e176c20eff08a908c4281)
- `2026-07-06` [Schedule: namespace self-added events per identity (don't bleed across users)](https://github.com/jsundram/AKM/commit/858832d3584e94ec1dec2eb9d08f1da60badea37)
- …and 53 more in this repo

**`pwa-starter`** — 1 commit

- `2026-07-12` [pwa-starter: opinionated skeleton + checklist for small static PWAs](https://github.com/jsundram/pwa-starter/commit/b928fbc24dd9f1b90daefcce2d8dbf7e167ad46c)

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 5/5 from commit counts alone. What did the week actually feel like?

### Week 03 — Jul 13–19

34 commits · intensity guessed at 3/5

```
Mon Jul 13  █ 1
Tue Jul 14  ████████ 14
Wed Jul 15  ██ 4
Thu Jul 16  ·
Fri Jul 17  █████ 9
Sat Jul 18  ████ 6
Sun Jul 19  ·
```

**`AKM`** — 12 commits

- `2026-07-13` [buildlog: refresh through 2026-07-12 (204 commits, 46h in session)](https://github.com/jsundram/AKM/commit/5262a4eb8856f6138d3eddc6e31e261db57e7ffd)
- `2026-07-14` [buildlog: refresh through 2026-07-13 (205 commits, 46h in session)](https://github.com/jsundram/AKM/commit/248e85840de6dc1a66cac86b695805d4a05cce4f)
- `2026-07-14` [archive: bake observed ERA5 weather into the frozen snapshot](https://github.com/jsundram/AKM/commit/a42f94799a4e8f63d0f97db9ed86588f1545fae3)
- `2026-07-14` [archive: restyle wrapped-festival banner + friendlier send-off copy](https://github.com/jsundram/AKM/commit/1319d856a066d92c33517fd716fa5e120c628097)
- `2026-07-17` [concert-data: order 7/3 Faculty Concert pieces to match printed program](https://github.com/jsundram/AKM/commit/bd99115f90a4d586c1ba174c92d1105279daf209)
- `2026-07-17` [recordings: ship real per-piece links (57) + bump SW to v105](https://github.com/jsundram/AKM/commit/2ba854428468b31d71a4b730b6f791459259e440)
- `2026-07-17` [recordings: add build:rec alias + warn-only staleness lint](https://github.com/jsundram/AKM/commit/9f0ae96729f4bdf23aca71f305fbc59b8f6e3445)
- `2026-07-17` [concerts: make the recording link a solid ink pill, distinct from names](https://github.com/jsundram/AKM/commit/c3de6b4380e525a2f87c053930ef7f9bd1ab2e08)
- <sub>plus 4 merge/chore/typo commits, not listed</sub>

**`pwa-starter`** — 9 commits

- `2026-07-14` [Generate placeholder icons + share card](https://github.com/jsundram/pwa-starter/commit/16eadab643c650c99fb593d14a0729904ae2b727)
- `2026-07-14` [Fold five patterns from the quartet-log audit into the skeleton (#1)](https://github.com/jsundram/pwa-starter/commit/1284e7e9341017948c18eb4d1c155e3940187db0)
- `2026-07-14` [sw.js: never intercept/cache the SW's own script (fixes #2)](https://github.com/jsundram/pwa-starter/commit/c2b4d180e8b0f127f09a707a91f5ba5e024d2efc)
- `2026-07-14` [Enforce OG share-card size + document the touch hover→tap fallback](https://github.com/jsundram/pwa-starter/commit/08eefba26f2751e946d71387423d87f094d88f67)
- `2026-07-14` [Ship the build-toolchain setup script + document dependencies](https://github.com/jsundram/pwa-starter/commit/814b8dd4ae02f42ab45ad006fedf3888a9082b4c)
- `2026-07-15` [Reconcile README wtq row with CLAUDE.md offline audit](https://github.com/jsundram/pwa-starter/commit/9cb4c7f262c92843cfae13bbcf2473ad8c3d4fca)
- `2026-07-15` [Add gallery-deck as the boundary-case reference app](https://github.com/jsundram/pwa-starter/commit/bd16c2169de40e0959fde940b8e095ba74a58abd)
- <sub>plus 2 merge/chore/typo commits, not listed</sub>

**`boccherini-sampler`** — 8 commits

- `2026-07-17` [Boccherini sampler: two-group part bundles + download page](https://github.com/jsundram/boccherini-sampler/commit/fdf09d3da8306934f203c606db3e9c174347e4ca)
- `2026-07-17` [Add QR page, floating banner, difficulty link, and bonus quartets](https://github.com/jsundram/boccherini-sampler/commit/8e25c5c8c0079aff992d9133b775c609bc95ef79)
- `2026-07-18` [Add cello difficulty to group tables; keep QR URL on one line](https://github.com/jsundram/boccherini-sampler/commit/d761f760eb84f99fac028e832c70a1642142faae)
- `2026-07-18` [Add share card (OG/Twitter meta) + favicon and theme-color](https://github.com/jsundram/boccherini-sampler/commit/78382f77b58520a2281e80aafe9379cbce88abac)
- `2026-07-18` [Make the QR page URL (and code) clickable for tablet viewing](https://github.com/jsundram/boccherini-sampler/commit/1d9147d975ac53e205c40b82d5ae30205fcb34f5)
- `2026-07-18` [Fix: Op.33/5 Violin II was missing its 3rd page](https://github.com/jsundram/boccherini-sampler/commit/933292d96fccee9d7ee78e5eebe539e353c72b1c)
- `2026-07-18` [Make bundle splits self-verifying so truncation fails the build](https://github.com/jsundram/boccherini-sampler/commit/072030199c8ad80d534e4fb026ad2b28dbaca128)
- `2026-07-18` [Add plan.md + editions.json schema and example (data<->sampler contract)](https://github.com/jsundram/boccherini-sampler/commit/6cb519722d5ede93f2640c10a855ac44169b3369)

**`haydn-info-card`** — 3 commits

- `2026-07-14` [Add PWA install + offline support (manifest, service worker, cache-bust guard)](https://github.com/jsundram/haydn-info-card/commit/596aa41af8c4c5695b2d89df514fca4e8c5a63b8)
- `2026-07-14` [Fix mobile card scrolling past content bottom](https://github.com/jsundram/haydn-info-card/commit/dcc61889863175be205e62a7e1a17d6defb88ded)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**`quartet-log`** — 2 commits

- `2026-07-14` [Add offline service worker and fix the web app manifest (#1)](https://github.com/jsundram/quartet-log/commit/eab9fc0c383d5e22c0c0b29a41f402f4ab7dd85d)
- `2026-07-14` [Add tap-to-update version row to the offline shell](https://github.com/jsundram/quartet-log/commit/3e6825db1dacc871bd9f7a15497096635491f2e9)

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 3/5 from commit counts alone. What did the week actually feel like?

### Week 04 — Jul 20–26

59 commits · intensity guessed at 4/5

```
Mon Jul 20  █████ 9
Tue Jul 21  ·
Wed Jul 22  ████████████████████████ 41
Thu Jul 23  █ 2
Fri Jul 24  ████ 7
Sat Jul 25  ·
Sun Jul 26  ·
```

**`somerville-typemap`** — 17 commits

- `2026-07-22` [Scaffold: README with vision, data sources, and licensing notes](https://github.com/jsundram/somerville-typemap/commit/99234a82362b95ecf9ee6c613cd7306158c12874)
- `2026-07-22` [Data layer: official city neighborhoods + network-tolerant Overpass fetch](https://github.com/jsundram/somerville-typemap/commit/4ba9c489a7d34eabad1f5cd4b4f5066775636d9e)
- `2026-07-22` [Full Somerville assembly: render_map.py](https://github.com/jsundram/somerville-typemap/commit/39a6e8336900b4431cda0dc1a501ceb63fd39fa4)
- `2026-07-22` [Layered rendering, fitted heroes, adjacent towns, toggleable viewer](https://github.com/jsundram/somerville-typemap/commit/05d477a0c43904c8497663f0add47f0bde5024c3)
- `2026-07-22` [Boundaries layer, adjacency-aware coloring, text dedupe, crammed heroes](https://github.com/jsundram/somerville-typemap/commit/d87b73312b5150eb365aa3297d76b500d55724ca)
- `2026-07-22` [Border demarcation, path continuations, warp sub-problem harness](https://github.com/jsundram/somerville-typemap/commit/38c6c379ef4db7dd5232f7d38f28e5cc155627d1)
- `2026-07-22` [Path through Davis, exterior border classification, warp steering doc](https://github.com/jsundram/somerville-typemap/commit/b7269a43f34f685df21e84cc1205ad7347ec3aab)
- `2026-07-22` [Route relations, culvert filtering, borders stroke real feature geometry](https://github.com/jsundram/somerville-typemap/commit/ed14953f1deaff24c47e9c1119a2c1c9ee0924b8)
- `2026-07-22` [Border polish: flat-cap clips, piecewise classification, path>rail, abbreviations](https://github.com/jsundram/somerville-typemap/commit/5d8dfcf595079673508f615f8fcde81a024e8fcc)
- `2026-07-22` [Boundaries layer precision pass](https://github.com/jsundram/somerville-typemap/commit/6c814a220c99ef527f47be36e1edf31704e8367a)
- `2026-07-22` [Boundaries audit pass vs basemap; viewer defaults to basemap+boundaries+transit](https://github.com/jsundram/somerville-typemap/commit/095a6989d4cb20993bf8fabeac8afa82473ae697)
- `2026-07-22` [Split boundaries into lines (L7) + annotations (L8); alignment loop](https://github.com/jsundram/somerville-typemap/commit/681ffb0e30092ed991f40cccbae388986418a264)
- `2026-07-22` [CLAUDE.md working notes + README layout refresh](https://github.com/jsundram/somerville-typemap/commit/6e91eca5a797a50ad81d7e78b33cb886044e12d1)
- `2026-07-22` [warp: de-skew glyphs, trim tuning, HILLSIDE split scaffold (user iteration)](https://github.com/jsundram/somerville-typemap/commit/c66f8135a0302a2cd2378dd7d20a8ce2de24d2e9)
- <sub>plus 3 merge/chore/typo commits, not listed</sub>

**`pwa-starter`** — 10 commits

- `2026-07-20` [Gate service-worker cache writes on resp.ok](https://github.com/jsundram/pwa-starter/commit/2ed87e9a5e130cf5b9542b06b5e23a08cf5727cf)
- `2026-07-20` [Serve same-origin .json stale-while-revalidate, not network-first](https://github.com/jsundram/pwa-starter/commit/e88a743e6eb34168ff7edabd63e5f8f4462c070d)
- `2026-07-20` [Refuse empty payloads, paint from cache first, repaint gently](https://github.com/jsundram/pwa-starter/commit/ddd9ab806b060048700c56cb1f228c90ee315890)
- `2026-07-20` [Track downstream copies; document the fixes and the CDN gap](https://github.com/jsundram/pwa-starter/commit/b143d4a03fa27cd1b144989f27f1e5c00be54543)
- `2026-07-20` [Add --at to the stamper; document two-way flow](https://github.com/jsundram/pwa-starter/commit/b79d99ca208d964d427faf364d2fac698dcaf925)
- `2026-07-20` [Key PROPAGATE notes by (file, sha), not sha alone](https://github.com/jsundram/pwa-starter/commit/f69a2d10735f14dc69079cb87e187f58f194b75e)
- `2026-07-20` [Record quartet-log as a known non-copy, not a downstream repo](https://github.com/jsundram/pwa-starter/commit/7d7682f45adaf1ab01d157768f2ed7fe405447dd)
- `2026-07-20` [Restrict stamping to whole-file copies; revert three bad stamps](https://github.com/jsundram/pwa-starter/commit/22048896b1909006d71d04753be76f1604a5f581)
- `2026-07-22` [Cut applyUpdate()'s dead focus restore; document what the #6 review proved](https://github.com/jsundram/pwa-starter/commit/8d54c4814dcb80669f9aaefe7c0d853ecfa8b041)
- `2026-07-22` [Analytics: GoatCounter is the fleet default; the sheet-ping is the known-audience exception](https://github.com/jsundram/pwa-starter/commit/adf8ed2efcb8c00c9a9cbfa7fca5b2eb06f61ec6)

**`quartets.boccherini.org`** — 10 commits

- `2026-07-22` [Add SessionStart hook for Claude Code web environments (#11)](https://github.com/jsundram/quartets.boccherini.org/commit/e14ea1f1d89c9444c630a5797c77b00ef8b92450)
- `2026-07-22` [Refresh iPad/iPhone visual baselines for WebKit 26.5 (#22)](https://github.com/jsundram/quartets.boccherini.org/commit/dedf2963d46e20eaa1e109515dde6700d655fefa)
- `2026-07-22` [PWA: installable + offline + link previews (reconciles #18 and #20) (#21)](https://github.com/jsundram/quartets.boccherini.org/commit/b7510e3d4b506741b725c6c7349a451e7b119838)
- `2026-07-22` [Movement bar fills reference CSS vars instead of frozen snapshots (#19)](https://github.com/jsundram/quartets.boccherini.org/commit/d72c20d896f2a82bec6e5c2e0c44a5c2d020bf2d)
- `2026-07-22` [Make nicknames legible: 0.75em, drop quotes (fixes #15)](https://github.com/jsundram/quartets.boccherini.org/commit/f0ad3f3f21e32162b805c18f37e9248f377b4c3a)
- `2026-07-22` [Serve boot-time .json stale-while-revalidate, not network-first (fixes #23)](https://github.com/jsundram/quartets.boccherini.org/commit/58decc4e1c5f36ebd0620fdde49927f848c1c3c1)
- `2026-07-22` [Advance pwa-starter provenance stamp to 8d54c48](https://github.com/jsundram/quartets.boccherini.org/commit/5f0bf046cbc25aac8a48e30811a4d007375801d8)
- `2026-07-22` [Add GoatCounter analytics (cookieless, async, offline-silent)](https://github.com/jsundram/quartets.boccherini.org/commit/1d54e38d12e636f7ce1c234398d6ab0ffb15af59)
- `2026-07-22` [Point GoatCounter at per-site boccherini-periodic-table dashboard](https://github.com/jsundram/quartets.boccherini.org/commit/dac1baed75c8f40c4410d9777810a019c4c3f97a)
- `2026-07-22` [Port haydn mobile/PWA fixes; fix two deeper scroll bugs; clean Spotify taps](https://github.com/jsundram/quartets.boccherini.org/commit/a89e5eb2f4ed3ee2d461e0b69aee9df33228bd6d)

**`haydn-info-card`** — 9 commits

- `2026-07-22` [Fix touch double-fire on movement bars; align touch detection with CSS](https://github.com/jsundram/haydn-info-card/commit/3ef0cc337492cabb9fb8e6792b05107c559009dc)
- `2026-07-22` [Sync sw.js hardening from pwa-starter: gate cache writes, serve cache on 4xx/5xx (bump to v3)](https://github.com/jsundram/haydn-info-card/commit/9b7d7ca91b34ac213389b8b2fb82f148a0879ef8)
- `2026-07-22` [Movement-bar fills reference CSS vars instead of frozen snapshots](https://github.com/jsundram/haydn-info-card/commit/032148839ca4f330e82638bda2fca206efa2da9c)
- `2026-07-22` [Serve opera.json stale-while-revalidate, not network-first (pwa-starter e88a743)](https://github.com/jsundram/haydn-info-card/commit/ab307348c9e57ab940322e88132a42b08a2ebea2)
- `2026-07-22` [Stamp app.js with pwa-starter provenance (@ 8d54c48)](https://github.com/jsundram/haydn-info-card/commit/5e1658b32327b312afaee67946b49cf87ae373b9)
- `2026-07-22` [Fix mobile phantom scroll for real: html overflow + tooltip anchor](https://github.com/jsundram/haydn-info-card/commit/101ffcb868f6eb68124f2af3b1cd61141880e5a9)
- `2026-07-22` [PWA: navigate in place for Spotify links, no leftover in-app sheet](https://github.com/jsundram/haydn-info-card/commit/113a49956a11e93e72164d1fa9d0b0564007e1a1)
- <sub>plus 2 merge/chore/typo commits, not listed</sub>

**`quartet-log`** — 6 commits

- `2026-07-20` [Reject empty fetch responses instead of caching them](https://github.com/jsundram/quartet-log/commit/fd71bde6c05fd9093020dd25093c7084b3a707b2)
- `2026-07-22` [Add GoatCounter analytics with anonymous per-user split](https://github.com/jsundram/quartet-log/commit/01f14f1b3c3cea183e575c3f53119bbfff4e62c3)
- `2026-07-22` [Add aggregate stat tiles to the dashboard](https://github.com/jsundram/quartet-log/commit/0e7002eb51d1053f8fd5145b68cbd1b4fb18145e)
- `2026-07-22` [Enable network-graph fullscreen on mobile](https://github.com/jsundram/quartet-log/commit/64ac3bb9b2234d85fcc7960e75088f8970e95efd)
- `2026-07-22` [Serve dev builds through a no-store proxy](https://github.com/jsundram/quartet-log/commit/a14d1c9b36568910ee2b09533c185395f3a54fa7)
- `2026-07-22` [Add fullscreen vertical calendar mode for mobile](https://github.com/jsundram/quartet-log/commit/a83c8854368ea9911a5e43ffe738e92e80d9c0cb)

**`spotify-tile`** — 5 commits

- `2026-07-24` [Initial commit: geomusic — (Geo) Musical Configurations reimplementation](https://github.com/jsundram/spotify-tile/commit/3398beaf61b11a8518b0fd599d26e0c42dcb045c)
- `2026-07-24` [link to sources](https://github.com/jsundram/spotify-tile/commit/9678494065d9c28e2e2d49845cd1401c3e9f323a)
- `2026-07-24` [Add Instagram-story generator for rendered tracks](https://github.com/jsundram/spotify-tile/commit/38e5637ac20ca3ad7590b9c328ad14a70a40bc54)
- `2026-07-24` [Handle composer-prefixed titles and period-less movements](https://github.com/jsundram/spotify-tile/commit/fae95ba62f05e676ee405f37f49a93be3d9d7078)
- `2026-07-24` [Render story text as HarfBuzz-shaped outline paths](https://github.com/jsundram/spotify-tile/commit/84d8ab45be8f822e172ec2efd3218082f849d28d)

**`quartet-chooser`** — 2 commits

- `2026-07-24` [Security fixes: got SSRF override, GA removal, Dependabot config](https://github.com/jsundram/quartet-chooser/commit/4d3a2e9b3c17e34eab5729ade9ba9cb3509f07c2)
- `2026-07-24` [Pin Node to 18.x (.nvmrc + engines)](https://github.com/jsundram/quartet-chooser/commit/29ec4ad6ae697a5e57b5ae44657772d457ed2404)

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 4/5 from commit counts alone. What did the week actually feel like?

### Week 05 — Jul 27–31

Outside the snapshot window — nothing was collected for these days.

- Is that right, or should the fetch be re-run with a wider window?
- If the month is simply still in progress, the default note is fine as written.

---

## After the answers

1. Rewrite every `TODO` in `data/months/2026-07.js`.
2. Delete any `note` field that has nothing honest to say.
3. Add the month to `data/index.js` (newest first) with a one-sentence `blurb`.
4. Open `index.html#2026-07` and read it end to end.
5. Keep this file. It is the provenance for prose that is otherwise unfalsifiable.

---

## Answers — recorded 2026-07-24

**1. What was the month mostly about?**
Polishing and completing the AKM app (festival ended 7/13, but videos were released and linked
afterwards), then taking lessons learned and patterns developed and formalizing them so they could
be used for other projects (pwa-starter), then using those patterns to update the Haydn and
Boccherini periodic tables, and the Quartet Log app.

**2. Festival dates / when AKM stopped.**
Festival ended 7/13. Work after that is videos being released and linked. Last AKM commit is 7/17.

**3. What went wrong?**
pwa-starter — was trying to capture downstream use and really understand how code/data flow should
work. pwa-starter is both a starter for new projects and has been used to review/upgrade old ones,
so capturing the dependencies, especially as pwa-starter evolved, was a bit of a mess.
Not sure what, if anything, broke for festival users; most of the feedback was feature requests
and kudos.

**4. The Jul 22 41-commit day across four repos.**
7/22 ended up being the first down day for quite some time, and success with AKM and other projects
led to wanting to continue the progress.

**5. Loose threads.**
somerville-typemap has been parked for a couple of days while spotify-tile and this
github-month-review-prototype project got picked up.

**6. Metrics.**
Worth mentioning the number of repositories now under the influence of pwa-starter.

*Taken from `pwa-starter/PROPAGATE.md`, which names them: `haydn-info-card`,
`quartets.boccherini.org`, `gallery-deck`, `wtq`, and `quartet-log` — the last tracked explicitly
as the skeleton's ancestor rather than a copy, since pwa-starter's pullToRefresh.js was written
from it. Recorded on the page as "5 apps in pwa-starter's orbit" with that caveat in the note.*

**7. Jul 6 (38 commits) — user reports or self-noticed?**
All me.

**8. spotify-tile.**
A new project, inspired by a stop at SIGGRAPH to see Shirley Wu (https://www.shirleywu.studio/),
and looking at posters on the way out.

**9. somerville-typemap.**
Definitely needs more work.

**10. boccherini-sampler landing as AKM stopped.**
An emergency, so that a Boccherini reading session could happen on the evening of 7/17. Part
distribution was going to be a real problem without it.

## Editorial decisions

- A personal aside in the answers was deliberately left off the page. The underlying fact —
  typemap parked after two days while two new projects started — is recorded as a loose thread,
  stated plainly. Reverse this only if asked.
- Week intensities are estimates made when writing, not answered in the interview: 3 / 5 / 4 / 5.
  They are the weakest claim on the page and should be corrected on sight.

## Corrections this interview produced

The pre-interview draft of this month was written from an older prototype's prose rather than from
commits, and was wrong in ways worth recording:

- It had AKM "built out" in week 1 and frozen at the end of week 2. AKM actually ran Jul 2–17, and
  the festival ended Jul 13.
- It credited the archive freeze to Jul 6–12. The archiving work is Jul 13–17.
- It described 57 per-piece recording links as a week-3 archive feature without noting that the
  videos were released over time, which is why the linking trails the festival.
- It missed boccherini-sampler being an emergency, missed spotify-tile entirely, and described
  Jul 20–23 as "extraction and propagation" without noting that Jul 22 was a day off.
- It reported "8 public repos touched"; the real figure for Jul 1–24 is 9.

---

## Answers — recorded 2026-08-04 (closing the month)

The Jul 24 snapshot ended before the month did. The Aug 4 re-fetch covers Jul 1–31:
11 repos, 270 commits, 24 days with commits. 74 commits landed after the narrative was
written — most on Jul 24–26 (week 4), with week 5 nearly quiet. These answers close
out weeks 4 and 5; the commit list they were asked against is the Aug 4 pending report.

**11. Week 5 (Jul 27–31) — 7 commits on two days, all haydn-info-card. What was the week?**
SoCal (https://www.socalchambermusic.com/) ran Jul 26–Aug 1. The time was filled with
rehearsing the Tchaikovsky Piano Trio, reading chamber music, and socializing.

**12. The quartet-chooser Gatsby → esbuild migration (42 commits, Jul 24–25;
daily-composers followed on Jul 25). What prompted it?**
Security / stale dependencies. The accumulating security issues made it feel like
updating the site with small fixes needed to chew through that work first. Hopefully
the port unblocks future changes of all sizes.

**13. The offline blank-screen fix (pwa-starter #7 → boccherini → haydn). Hit, or found
by inspection?**
Hit first-hand: discovered while playing chamber music and trying to open the Haydn
info card on a phone with poor network connectivity and no wifi.

**14. New loose threads?**
An idea to regenerate the acoustic analysis that powers the features spotify-tile uses,
by consulting the existing data that's out there and the documentation for the Echo
Nest's analyzer (an3). That work looks very possible.

### Editorial decisions, closing pass

- "Projects started" raised 4 → 5 to include this review page itself (github-month-review,
  first commit Jul 24). It is a public repo in the snapshot like any other.
- Week 5 intensity set to 1 when writing, with the same caveat as the others: an estimate,
  not an answer.
- The offered late-July thread candidates (shelved composer-anniversary banner,
  quartet-chooser Phases 2–3 paused, gallery-deck behind on the offline fix) were not
  picked up by the owner; only the spotify-tile analysis idea was added. The candidates
  stay here, not on the page.
