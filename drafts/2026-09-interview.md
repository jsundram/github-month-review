# Interview — September 2026

Every question comes with the commits behind it, because the point of this page
is to work out where the time went — not to test recall. Read the context, then
answer. Short answers are fine; fragments are fine.

**Voice for the eventual prose:** neutral third person, plain, concrete. No second
person, no 'not merely', no claims about leverage or inflection points. A dull week
reads as dull.

---

## What the snapshot shows

`2026-09-01` to `2026-09-30` · 318 commits across 10 repos

| repo | commits | first | last |
| --- | ---: | --- | --- |
| `quartet-composers` | 131 | 2026-09-04 | 2026-09-24 |
| `mbta-glx` | 84 | 2026-09-24 | 2026-09-28 |
| `quartet-log` | 39 | 2026-09-01 | 2026-09-24 |
| `lissajous-tuner` | 34 | 2026-09-03 | 2026-09-10 |
| `pwa-starter` | 12 | 2026-09-13 | 2026-09-24 |
| `quartet-chooser` | 9 | 2026-09-01 | 2026-09-04 |
| `boccherini-opus-48` | 3 | 2026-09-30 | 2026-09-30 |
| `github-month-review` | 2 | 2026-09-04 | 2026-09-04 |
| `maestoso-127` | 2 | 2026-09-04 | 2026-09-04 |
| `somerville-typemap` | 2 | 2026-09-29 | 2026-09-29 |

Commits per day across the month:

```
Tue Sep 01  █████ 13
Wed Sep 02  █ 1
Thu Sep 03  ███████ 18
Fri Sep 04  ████████ 20
Sat Sep 05  █████████ 22
Sun Sep 06  ██ 4
Mon Sep 07  ████ 10
Tue Sep 08  █████████ 24
Wed Sep 09  ███████ 18
Thu Sep 10  ███████████ 27
Fri Sep 11  ███ 7
Sat Sep 12  ███████ 19
Sun Sep 13  ██ 6
Mon Sep 14  ·
Tue Sep 15  ██ 6
Wed Sep 16  █ 2
Thu Sep 17  ████ 11
Fri Sep 18  █ 1
Sat Sep 19  █ 3
Sun Sep 20  ·
Mon Sep 21  ·
Tue Sep 22  ██ 4
Wed Sep 23  ·
Thu Sep 24  ███████████ 27
Fri Sep 25  ██ 6
Sat Sep 26  ████████████████████████ 61
Sun Sep 27  █ 2
Mon Sep 28  █ 1
Tue Sep 29  █ 2
Wed Sep 30  █ 3
```

## The month

1. In one sentence, what was this month mostly about?
2. What went wrong, stalled, or got thrown away? Nothing in a commit log admits to a dead end, so if this is left blank the page will imply everything worked.
3. Is there work that belongs in the record but is not on public GitHub? How should it be referred to, if at all?
4. Any context — travel, a deadline, a performance, an outage — that explains the shape of the month? Look at the per-day chart above: the gaps and the spikes are the question.
5. `quartet-composers` is 41% of the month's commits. Was that the intent, or did it crowd out something you meant to do?
6. The draft metrics are **10** repos touched, **318** commits. Is any of those misleading or beside the point? What would you put there instead?

---

## The weeks

### Week 01 — Sep 1–6

78 commits · intensity guessed at 4/5

```
Tue Sep 01  █████ 13
Wed Sep 02  █ 1
Thu Sep 03  ███████ 18
Fri Sep 04  ████████ 20
Sat Sep 05  █████████ 22
Sun Sep 06  ██ 4
```

**`lissajous-tuner`** — 32 commits

- `2026-09-03` [Scaffold Lissajous Tuner from pwa-starter](https://github.com/jsundram/lissajous-tuner/commit/202182449610a0dd38c08da2dedca3f9857ec58d)
- `2026-09-03` [Worklet, DSP, and the headless test harness — 32/32 green](https://github.com/jsundram/lissajous-tuner/commit/2e9817ede541a72dec505a22e21b4920e940e47d)
- `2026-09-03` [Self-test mode, renderer, layout, and the dev panel](https://github.com/jsundram/lissajous-tuner/commit/72ca3c5a1b23e67610eb8b6778f08d2aa1ce5316)
- `2026-09-03` [Add deploy script: bump V, restamp build id, verify, push](https://github.com/jsundram/lissajous-tuner/commit/99f2aa1175993367939bf66151aa716961c44644)
- `2026-09-03` [Stamp build ae33518 / lt-v4](https://github.com/jsundram/lissajous-tuner/commit/1c2d85260d1b692d16fd339d1b8825dba900e046)
- `2026-09-03` [Deploy: restamp build id and bump cache generation](https://github.com/jsundram/lissajous-tuner/commit/ae3351845ca7c3f0e64b645445555685e3c8d2e3)
- `2026-09-03` [Deploy lt-v5 (build a8f0e3f+)](https://github.com/jsundram/lissajous-tuner/commit/ea6c2b108dbe3dc68a27b92252e386ba081daf8a)
- `2026-09-03` [Fix deploy ordering: bump V in the same commit as the build stamp](https://github.com/jsundram/lissajous-tuner/commit/a8f0e3fc7ca64edff3d42594d3e02ed3818bf7f7)
- `2026-09-03` [Scope the build-id dirty marker to non-deploy stamps](https://github.com/jsundram/lissajous-tuner/commit/9d52857c1b997bdcf755cdf1d2e92c9dcccea549)
- `2026-09-03` [Deploy lt-v6 (build 9d52857)](https://github.com/jsundram/lissajous-tuner/commit/d2f8426646d4ff640c252a1e5d4777cc002cfe37)
- `2026-09-03` [Fix iOS status bar style and build-id placement](https://github.com/jsundram/lissajous-tuner/commit/4ebf40ef195090af61a527b18ffc9528fd205dcb)
- `2026-09-03` [Deploy lt-v7 (build 4ebf40e)](https://github.com/jsundram/lissajous-tuner/commit/ecb3a4e2f8fb25fbf4860c2f7dbfd984ec63b217)
- `2026-09-03` [Deploy lt-v8 (build 82f5506)](https://github.com/jsundram/lissajous-tuner/commit/87b456b0a25550688647349aa97cd7d1f675ed87)
- `2026-09-03` [Record playwright-core as a devDependency; document the check scripts](https://github.com/jsundram/lissajous-tuner/commit/82f550632eb447a0b56c394e603abba1210a467a)
- `2026-09-03` [Deploy lt-v9 (build 3f45319)](https://github.com/jsundram/lissajous-tuner/commit/3eb3a03003af3cf9200cd2a44ec43ac7c9bb00ca)
- `2026-09-03` [Fix open-G misdetection, blocky figure, and add reference tones](https://github.com/jsundram/lissajous-tuner/commit/3f45319e8a3f8434c756c1f75bfdc726f34e44c6)
- `2026-09-03` [Deploy lt-v10 (build 89c9c33)](https://github.com/jsundram/lissajous-tuner/commit/8646bc3f8acdeacdf879979ccc2f1332e0d14a26)
- `2026-09-03` [Move dev pill off the chips; add loopback sweep diagnostics](https://github.com/jsundram/lissajous-tuner/commit/89c9c333747b52c82535c5173ef39fab681e867c)
- `2026-09-04` [Give the dev panel a sticky header so it can actually be closed](https://github.com/jsundram/lissajous-tuner/commit/38a964ac299cd2d698b142974d4b5447e3ea8191)
- `2026-09-04` [Deploy lt-v11 (build 38a964a)](https://github.com/jsundram/lissajous-tuner/commit/607e83f36069df75fc30e6159567c0a0eefe60ce)
- `2026-09-04` [Add scripts/shot.mjs and document the look-and-feel workflow](https://github.com/jsundram/lissajous-tuner/commit/a32bea98fa0b840a80bdc5db4aeebfd8c02a34fd)
- `2026-09-04` [Deploy lt-v12 (build a32bea9)](https://github.com/jsundram/lissajous-tuner/commit/16a81f7abce0c71374c66cba34e25d7a1e09af49)
- `2026-09-04` [Deploy lt-v13 (build 57299ac)](https://github.com/jsundram/lissajous-tuner/commit/1c5d6fe71dde4cafe2431822c19f82976babf94d)
- `2026-09-04` [Fix the sticky detection lock; add string pinning and true Lissajous figure modes](https://github.com/jsundram/lissajous-tuner/commit/57299acdbbf8402a63dfb790988dacf635059415)
- `2026-09-04` [Close the bwCoef and cents-excursion open questions with real violin recordings](https://github.com/jsundram/lissajous-tuner/commit/9b6b800b06f363bce1cdc6ffdc21d3345e49f497)
- …and 7 more in this repo

**`quartet-composers`** — 26 commits

- `2026-09-04` [Remake the 2014 quartet-composers fisheye chart](https://github.com/jsundram/quartet-composers/commit/1f3766c0453e1f09d3bb2916fff1c9381fec90bf)
- `2026-09-04` [Refresh page views to 2026-08, and fix four bugs it exposed](https://github.com/jsundram/quartet-composers/commit/5f390f9853f4eed1ec5b8b84d05224b9ea12a7f7)
- `2026-09-05` [Resolve Wikipedia titles before asking for page views](https://github.com/jsundram/quartet-composers/commit/b5fda86e7352f8ec401160f90565cbc839fe6a3b)
- `2026-09-05` [Re-scrape everything: 884 composers, real dates, 12-month median views](https://github.com/jsundram/quartet-composers/commit/5bdc63fded21792f0243b94005bb2f7abe4adf91)
- `2026-09-05` [Add a readership filter, and stop calling page views "popularity"](https://github.com/jsundram/quartet-composers/commit/50db15564448773c90c5d1ea12fa5558bc34e510)
- `2026-09-05` [Remove four bits of dead code left by the rebuild](https://github.com/jsundram/quartet-composers/commit/f5c1c80864c1c4c76ade8cc19efc7ea5a630c042)
- `2026-09-05` [Add a data gate that catches the bugs tests never did, and write down the agenda](https://github.com/jsundram/quartet-composers/commit/5af5820d078858133e3fa8480e4262f607c95fec)
- `2026-09-05` [Fix five things that made this hard to use on a phone](https://github.com/jsundram/quartet-composers/commit/00c2ecebe849f5a805cff4b1f12846e880e18986)
- `2026-09-05` [Re-encode the chart around the argument: output against attention](https://github.com/jsundram/quartet-composers/commit/6a028f43606a956db800b9f9dbd59a7311cb1777)
- `2026-09-05` [Note the gender-filter issue in the agenda](https://github.com/jsundram/quartet-composers/commit/18da25e0ca2d9f137ff71d832ebd192187ba8914)
- `2026-09-05` [Lifespan reads hot to cold; one more surname the rule got wrong; mocks/](https://github.com/jsundram/quartet-composers/commit/8075db8c181953ef2b84bfe85e4bb98001b7d4db)
- `2026-09-05` [Lifespan ramp: YlGnBu, sequential, no dead middle](https://github.com/jsundram/quartet-composers/commit/57f9eebaa3e663847834c5e0d70a6ea74dbeabfe)
- `2026-09-05` [Fix nine review findings, one of which was deleting a composer's label](https://github.com/jsundram/quartet-composers/commit/c88fbd6745e2ff573b8452df77e1b8d342c64966)
- `2026-09-05` [Footnote: credit the right experiment, and stop dating this data to 2014](https://github.com/jsundram/quartet-composers/commit/43b77a5ba2016e87effe55a6c89f15fb266d81d2)
- `2026-09-05` [Add composer gender from Wikidata P21, and a filter for it](https://github.com/jsundram/quartet-composers/commit/43834c61c0d3d7fd4a9a83961b5437a77b18f859)
- `2026-09-05` [Label the filtered readers view, and give the filter row back its width](https://github.com/jsundram/quartet-composers/commit/b7d5a4b457865165081ddfa720fe1b40c02ee926)
- `2026-09-05` [Make labels a function of zoom, like a map](https://github.com/jsundram/quartet-composers/commit/e7dbe85a4bb832d473841b4cbe47bd4fb3f52279)
- `2026-09-05` [Shorten the composer names the chart labels (#2)](https://github.com/jsundram/quartet-composers/commit/3d062f50370065f221a275bc65ee0926ba9c9b1b)
- `2026-09-05` [Fit the chart's frame to the filter (#6)](https://github.com/jsundram/quartet-composers/commit/afb6c4a3911cc3b6e57dd9728bab55c50191edf9)
- `2026-09-05` [Read BOOT out of sw.js in the test rather than keeping a copy](https://github.com/jsundram/quartet-composers/commit/427a2bb57591a7000c46717794a97a66d4cbfefb)
- `2026-09-05` [Derive the outlier ring from the filtered group](https://github.com/jsundram/quartet-composers/commit/c173427ad3e199cd7e029a1343eebefc9f332a8d)
- `2026-09-05` [Count the plotted composers in the empty panel (#8)](https://github.com/jsundram/quartet-composers/commit/557b23a12b6f60b6908d9edc45fcb6638104409f)
- `2026-09-06` [Rename the Readers view to Fame (#5) (#11)](https://github.com/jsundram/quartet-composers/commit/797153728393d27c4c0e9f74b3531a624de4ef4f)
- `2026-09-06` [Mock the quartet-roulette highlight set on a phone (#3) (#12)](https://github.com/jsundram/quartet-composers/commit/9a54a2fdacf116b18ead9b9086e127a3fff23c0b)
- `2026-09-06` [Make the filled set the repertoire, and name every ring (#3, #10) (#18)](https://github.com/jsundram/quartet-composers/commit/37f2a0ad21c20bae6e2fa5d4d38dbacd26a9c635)
- …and 1 more in this repo

**`quartet-chooser`** — 9 commits

- `2026-09-01` [A playground for the site-wide share card, and a shorter header (#39)](https://github.com/jsundram/quartet-chooser/commit/f763a6c01739ebc083815fe301ef918d5f5fd9c7)
- `2026-09-01` [Review round: the card changed and its alt text kept naming Debussy](https://github.com/jsundram/quartet-chooser/commit/302cc37ecf7176135a160eb6b03c63bd9cbb518d)
- `2026-09-01` [Three more from review: a stray-file trap in make-icons, and the card can go stale](https://github.com/jsundram/quartet-chooser/commit/5234ab1d9f0198f8fdf49fae40ec99644edbbb70)
- `2026-09-01` [Delete the scratch file instead of managing it (-95 lines)](https://github.com/jsundram/quartet-chooser/commit/d5ac34a928369a457958c4c36f60a89b4b2c6d76)
- `2026-09-01` [Say what stdin costs, and let inline_svg enforce it](https://github.com/jsundram/quartet-chooser/commit/8f39c2045c7e9476ade653e9c6767662b58cea39)
- `2026-09-01` [The drift gate: fail first, compare portraits, say which file is wrong](https://github.com/jsundram/quartet-chooser/commit/862c9140220bef7d897d88335aca7ee82e529b90)
- `2026-09-01` [pwa.md: the share card was revisited, and #45 is merged and live](https://github.com/jsundram/quartet-chooser/commit/db3093ec68a1c4e3af4758368e72b46f6294f301)
- `2026-09-01` [checklist: the card is redesigned, and #39 is now about the font](https://github.com/jsundram/quartet-chooser/commit/f848d9956046c83d40016ff201e5cdbcdc4c2728)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**`quartet-log`** — 7 commits

- `2026-09-01` [address review: abbreviates() tests tokens, and the ambiguity gate covers initialled variants](https://github.com/jsundram/quartet-log/commit/dd913bf121dcfee765f502e6f3e0b1eb3a293504)
- `2026-09-01` [address review: unmatched summary counts fail the audit run; a title's last ensemble word sizes the row](https://github.com/jsundram/quartet-log/commit/1aeb0c18ab35c4a7b8035655679ef584e2ad648d)
- `2026-09-01` [report fill-forward's decisions, classify name shape once, and address review](https://github.com/jsundram/quartet-log/commit/54916d2d724eb11e82a06b29432359bd9eabab76)
- `2026-09-01` [docs: the fill-forward trace and the name-shape classifier](https://github.com/jsundram/quartet-log/commit/618d8e0de62267aa29cc22d587cb1cfba5f50e0f)
- <sub>plus 3 merge/chore/typo commits, not listed</sub>

**`github-month-review`** — 2 commits

- `2026-09-04` [Add August 2026: a playing month, with the code in the gaps](https://github.com/jsundram/github-month-review/commit/1c60f7c09c9ef60c6998317fa266c25fe0ae77b3)
- `2026-09-04` [Week 5: the bow dataset produced six reports, not three](https://github.com/jsundram/github-month-review/commit/d9a7e9d5c449a77ba3b086630d2571415eb41103)

**`maestoso-127`** — 2 commits

- `2026-09-04` [add Open Graph tags and a data-driven share card for viz/](https://github.com/jsundram/maestoso-127/commit/6ebb1d6f08605ff0ffb9739578314a621e889e08)
- `2026-09-04` [tune og/meta copy for the lengths previewers expect](https://github.com/jsundram/maestoso-127/commit/fd4e988e08091e7ff8b859d3ed4b1401f9576613)

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 4/5 from commit counts alone. What did the week actually feel like?

### Week 02 — Sep 7–13

111 commits · intensity guessed at 5/5

```
Mon Sep 07  ████ 10
Tue Sep 08  █████████ 24
Wed Sep 09  ███████ 18
Thu Sep 10  ███████████ 27
Fri Sep 11  ███ 7
Sat Sep 12  ███████ 19
Sun Sep 13  ██ 6
```

**`quartet-composers`** — 88 commits

- `2026-09-07` [Draw a readership sparkline from the whole page-view history (#13)](https://github.com/jsundram/quartet-composers/commit/07c950f19e560caf978cd5d4f186141ad1501bb2)
- `2026-09-07` [Print the bare surname where one composer owns it (#14)](https://github.com/jsundram/quartet-composers/commit/22576ea48957787c698ef9a16ed47d275ddadd1c)
- `2026-09-07` [Don't fit the frame to a handful of dots (#20)](https://github.com/jsundram/quartet-composers/commit/bb4a3dd948aaee90add28d74283962613e9316e7)
- `2026-09-07` [Say what the page is for in the link preview, and guard both counts (#21)](https://github.com/jsundram/quartet-composers/commit/9bc357e7d72e996505520fa278338e40c3ded441)
- `2026-09-07` [Address review of the three fixes (#14, #20, #21)](https://github.com/jsundram/quartet-composers/commit/05f5a3a278629cecedfc6e6a1ff90878898fc9cb)
- `2026-09-07` [Say 790 in both places that describe the plot (#21)](https://github.com/jsundram/quartet-composers/commit/3a34a735b823049595b674e81d62701179cca5a1)
- `2026-09-07` [Fill a curated set of women under the Women filter (#7)](https://github.com/jsundram/quartet-composers/commit/9e882aef95a58ee6373650debf14aabc870eba88)
- `2026-09-07` [Make a derived ring stand apart, not just stand out (#7)](https://github.com/jsundram/quartet-composers/commit/605a4ee42c4007869f4e41dd0cfc481d2c31257a)
- `2026-09-07` [Write the lede's claims from the data (#7)](https://github.com/jsundram/quartet-composers/commit/a2d93138a747a250ea9f554c3a1342ae79394e6f)
- `2026-09-07` [Re-derive the rings when the picture changes shape (#7)](https://github.com/jsundram/quartet-composers/commit/4f0874cb21c4e1c162cdc7b7e796c1750e2da42c)
- `2026-09-08` [Count page views under the title the article was actually at (#23)](https://github.com/jsundram/quartet-composers/commit/fdb7b2debb4438265090e86ec6111c6bb3016954)
- `2026-09-08` [Address review: guard the repair's network calls, null the move month (#23)](https://github.com/jsundram/quartet-composers/commit/7bcf10f93b268000ac2b0ce87f66784a1c60d120)
- `2026-09-08` [Address second review: an exact gate for the stitch, and cases for the rest (#23)](https://github.com/jsundram/quartet-composers/commit/8930cbcacd7bc468f24b6bcc3735a3a5ffe8103b)
- `2026-09-08` [Address third review: make the gate and the stitch share one rule (#23)](https://github.com/jsundram/quartet-composers/commit/a7372b5dcfbb79e09cbd4edc38e424e996843791)
- `2026-09-08` [Address fourth review: one predicate for the holes, and the negative case (#23)](https://github.com/jsundram/quartet-composers/commit/377de9751246fe705bf950361f95c73862871cbf)
- `2026-09-08` [Address fifth review: pin the collapse-to-empty guard, and stop the negative case ageing badly (#23)](https://github.com/jsundram/quartet-composers/commit/bf469280fa462e9e0973f1d7d9586e4a7fdd18ec)
- `2026-09-08` [Say nine where the list has nine (#23)](https://github.com/jsundram/quartet-composers/commit/fd7be6f3e2fa49deaf239964a127737104f18389)
- `2026-09-08` [Address sixth review: fix the fixes, and take the count I said I would leave (#23)](https://github.com/jsundram/quartet-composers/commit/ba32fcafb41d7c89c5a29db58585bc8c83ce5098)
- `2026-09-08` [Check the pairing rule instead of stating it (#23)](https://github.com/jsundram/quartet-composers/commit/830107d1b83b58185ca4c79b48f739c1af927691)
- `2026-09-08` [Name the trap the pairing check sets (#23)](https://github.com/jsundram/quartet-composers/commit/172202fcd263f21d991b0397b923ee40824b228f)
- `2026-09-08` [Let the lede describe the view that is on screen (#24)](https://github.com/jsundram/quartet-composers/commit/d812c28287bc4df85697ebdd88aed8c17632f6f2)
- `2026-09-08` [Point the layout-shift entry at the issue it earned (#27)](https://github.com/jsundram/quartet-composers/commit/83d535d6486b270d351fb369dbb235702f108c37)
- `2026-09-08` [Reserve the lede's box so an unmade claim moves nothing (#27)](https://github.com/jsundram/quartet-composers/commit/23f7381fd3ac481e64a266aced5bbc971269d23e)
- `2026-09-08` [Point the residual switcher shift at the issue it earned (#29)](https://github.com/jsundram/quartet-composers/commit/52888870f74a11da82162f0d6b49ed7b37478d48)
- `2026-09-08` [Put the chart's controls above the plot so a press moves nothing (#29)](https://github.com/jsundram/quartet-composers/commit/379b21d263567ac5df821e159493a3993703b8e4)
- …and 62 more in this repo
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**`quartet-log`** — 19 commits

- `2026-09-08` [link every printed form id to the form, so "is this one mine" is checkable](https://github.com/jsundram/quartet-log/commit/3973152f7445419f9b81f5166024ea6a6dba1a0c)
- `2026-09-08` [take a setup link in the setup box, since that is where one gets pasted](https://github.com/jsundram/quartet-log/commit/81e140dbc8da2cc55a73bfa8c8ea30ce6ce486e2)
- `2026-09-09` [stop the catalog picker collapsing the log form on a phone](https://github.com/jsundram/quartet-log/commit/1bec49289a94a132746cf31253827942cdc838c3)
- `2026-09-09` [rebuild both composer views on the picker's own change handler](https://github.com/jsundram/quartet-log/commit/49a244cec9eb8e9d54d7e90f45b58bd0a6354d2a)
- `2026-09-09` [pin the extras to the value column with a negative grid line](https://github.com/jsundram/quartet-log/commit/66f5bb747cc4a714b110be31c57e0d00ea569123)
- `2026-09-09` [add Borodin 2 to the MISC tab, unlinked](https://github.com/jsundram/quartet-log/commit/3dabc17de6762adbdd54ad284dcc258e4b03a30a)
- `2026-09-09` [drop the Smetana and Verdi URL patterns, whose links all 404](https://github.com/jsundram/quartet-log/commit/10e6dfd46f5194c6b4980b6356e05fda2c27670c)
- `2026-09-09` [keep a lone work's catalogue number in the multi-composer tab label](https://github.com/jsundram/quartet-log/commit/959f089f5501f8d375b9d83c11148e1c3eee9090)
- `2026-09-12` [write a part change as a column swap, not a tag](https://github.com/jsundram/quartet-log/commit/43ba77f926e5d2527d27a47d392306ad52e92f4a)
- `2026-09-12` [record why the carried-tag inheritance is not scoped to the session window](https://github.com/jsundram/quartet-log/commit/02a0e928e9d7f848887ddb8b0890f0fab0a270de)
- `2026-09-12` [give the columns and Others? their own part lists](https://github.com/jsundram/quartet-log/commit/5da4d03deb5654cc4e51f0cad20c7b52e1d3e034)
- `2026-09-12` [document the two part lists, and stop howto teaching the old one](https://github.com/jsundram/quartet-log/commit/dcb946370ce408112d60fd75a000875ee3efc342)
- `2026-09-12` [read (v3) and (v4) on a player slot as instruments](https://github.com/jsundram/quartet-log/commit/0478aef45dcbbbed4cad343cd84a8c954f25e3e8)
- `2026-09-12` [Fix confirmation tiles dropping rows the sheet takes after the submit (#46)](https://github.com/jsundram/quartet-log/commit/1681edd8319739ccd86779a6ffeed9ddc8c9cf97)
- <sub>plus 5 merge/chore/typo commits, not listed</sub>

**`lissajous-tuner`** — 2 commits

- `2026-09-10` [Deploy lt-v17 (build 5833c41)](https://github.com/jsundram/lissajous-tuner/commit/986437f3e5b5f4f49bc0a0cb58c2eff67f790bd3)
- `2026-09-10` [Editable reference A, an in-tune colour, and the figure picker on the main screen](https://github.com/jsundram/lissajous-tuner/commit/5833c415ad87ce32d66fc61dac9a3da8282c292f)

**`pwa-starter`** — 2 commits

- `2026-09-13` [README: list .nojekyll in the what's-in-the-box tree](https://github.com/jsundram/pwa-starter/commit/0a7bc6bed7d6150a190c782389a1d22530b3a7e7)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 5/5 from commit counts alone. What did the week actually feel like?

### Week 03 — Sep 14–20

23 commits · intensity guessed at 2/5

```
Mon Sep 14  ·
Tue Sep 15  ██ 6
Wed Sep 16  █ 2
Thu Sep 17  ████ 11
Fri Sep 18  █ 1
Sat Sep 19  █ 3
Sun Sep 20  ·
```

**`quartet-composers`** — 15 commits

- `2026-09-15` [Put IMSLP on the page: one column, one pill, and a pipeline that runs the other way (#61)](https://github.com/jsundram/quartet-composers/commit/df27bbf78aefa115ffe115fa876ca0e2551b493a)
- `2026-09-15` [Rename the IMSLP crawl and stop it spending 604 KB on key names (#61)](https://github.com/jsundram/quartet-composers/commit/0ac7efa98da9bdbb8b4d17dc836cc7834dec7329)
- `2026-09-15` [Put Wikipedia and IMSLP in one row, as the same kind of thing (#61)](https://github.com/jsundram/quartet-composers/commit/381dcaae874957529ecdf5b5779752b708342a98)
- `2026-09-15` [Make both panel pills accent links, and say "quartets" (#61)](https://github.com/jsundram/quartet-composers/commit/cf002109299f2842748ababc26f84a97e4722321)
- `2026-09-15` [Cut the comments and docs that could not go red; fix the gates that let them through (#67)](https://github.com/jsundram/quartet-composers/commit/4a6e87443c59d45e111bd5a86d0ed31d0ff1f4ce)
- `2026-09-16` [Ask whether a number reaching prose is a record, and audit the ones already there (#74)](https://github.com/jsundram/quartet-composers/commit/d055e5a95f1f7662fd9157d40fce92fce1a3c70c)
- `2026-09-17` [Measure the prose ratio in one place, and check every diff against it (#77)](https://github.com/jsundram/quartet-composers/commit/b660918bb2a75569f816137e52abe6a85b543d84)
- `2026-09-17` [Make codehash's answer line up with the source it came from (#80)](https://github.com/jsundram/quartet-composers/commit/d0a9d410baf36dad69b02fc9337f20369a24da84)
- `2026-09-17` [History belongs in the commit and the issue, not in a file (#76)](https://github.com/jsundram/quartet-composers/commit/35d77621040bb2ad6e3d16a9cdf1b9fb0f161560)
- `2026-09-17` [CLAUDE.md holds the rule, not the incident (#75)](https://github.com/jsundram/quartet-composers/commit/d6c400f1720b70c2197602c884c4cf0c3113c760)
- `2026-09-18` [Cut the prose volume, and stop the pre-commit hook being opt-in (#115)](https://github.com/jsundram/quartet-composers/commit/149510a538685f7ccb6bafba8afc20a0049b1b4b)
- `2026-09-19` [Colour the swarm by quartet count, not lifespan (#94)](https://github.com/jsundram/quartet-composers/commit/e1c04987e6b7f1e29bb3c9ea8db9e833e246f30a)
- `2026-09-19` [ui.test: report a missing quartetDomain() as one red check, not a dead run](https://github.com/jsundram/quartet-composers/commit/b637fc1b22357547f98d9486fab60a88b46204be)
- `2026-09-19` [Class the swarm's ramp into seven, so the prolific are told apart](https://github.com/jsundram/quartet-composers/commit/9982b0b2894df25881a161366e7ee6bf7811646b)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**`quartet-log`** — 8 commits

- `2026-09-16` [Log form: say what each person played, let the form place them (#47)](https://github.com/jsundram/quartet-log/commit/59f7403c4b35cef24649ed9fbb3ae825871c6a90)
- `2026-09-17` [Don't read a location as shorthand for the one above it (#49)](https://github.com/jsundram/quartet-log/commit/bf75b57818e65c94c9f23e1003323c22256bcb5e)
- `2026-09-17` [Size the Player filter from the data and the viewport, not two constants (#50)](https://github.com/jsundram/quartet-log/commit/6dd5fe40b7baa7dfa904a77c84488ccfc8b1a029)
- `2026-09-17` [Trim CLAUDE.md to what the code doesn't already say (#15)](https://github.com/jsundram/quartet-log/commit/c2487a2d89fe6d84424b38e4804718f6050d1406)
- `2026-09-17` [Screen new CLAUDE.md prose against the comments it restates (#51)](https://github.com/jsundram/quartet-log/commit/9c507ba65f2749345bfef9f48b7ceae2a38d37b7)
- `2026-09-17` [Say so when the overlap screen cannot run](https://github.com/jsundram/quartet-log/commit/f61d8af8f14f9eb069de65fceb7ab022b812a062)
- <sub>plus 2 merge/chore/typo commits, not listed</sub>

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 2/5 from commit counts alone. What did the week actually feel like?

### Week 04 — Sep 21–27

100 commits · intensity guessed at 5/5

```
Mon Sep 21  ·
Tue Sep 22  ██ 4
Wed Sep 23  ·
Thu Sep 24  ███████████ 27
Fri Sep 25  ██ 6
Sat Sep 26  ████████████████████████ 61
Sun Sep 27  █ 2
```

**`mbta-glx`** — 83 commits

- `2026-09-24` [Magoun inbound ETA service: model, backtests, live service, archiver](https://github.com/jsundram/mbta-glx/commit/67d61852726a6fc08264068a774b676bf1354a31)
- `2026-09-24` [Add launch plan, daily schedule snapshot, launchd agents, confidence model](https://github.com/jsundram/mbta-glx/commit/067c09e407ea38459ee9d72bc917e027b8727b0f)
- `2026-09-24` [Fix hardcoded EDT timezone; make notifier host-portable; plan delivery options](https://github.com/jsundram/mbta-glx/commit/c9763af6a31dfa4354f256ac1451dcc74c3dd134)
- `2026-09-24` [Phase 5a: ntfy notifier with brief, triggers, and tap-back commands](https://github.com/jsundram/mbta-glx/commit/0b4a077987a33adbd589347709eebcea0a866b0d)
- `2026-09-24` [Fix install.sh: wait for async bootout, reject sudo, explain launchctl errors](https://github.com/jsundram/mbta-glx/commit/d830d4d53dc391b604a4ca8eb72604afeb449c69)
- `2026-09-24` [Fix ntfy subscribe stream and surface listener errors](https://github.com/jsundram/mbta-glx/commit/ea230d30845f4216cc1d42be9759e4be5a9ea599)
- `2026-09-24` [Show catch chance, on-time chance, and 95%-arrival time in notifications](https://github.com/jsundram/mbta-glx/commit/ebef74c69e5c0b232805f1dbb81435fd50e4fd9d)
- `2026-09-24` [Debounce no-show detection: MBTA predictions flap by minutes](https://github.com/jsundram/mbta-glx/commit/83df89aec3d7219355cb8075fe89b9e1bf407bce)
- `2026-09-24` [Accept destination names; plan for measuring prediction volatility](https://github.com/jsundram/mbta-glx/commit/32f4e3d2c7aa4d23540464d25f6969b83f522c9c)
- `2026-09-24` [Stop the commitment walking to the next train; fix arrival undercount](https://github.com/jsundram/mbta-glx/commit/beecd00ef5fbbcaf7041e57e3f20186d5d896a68)
- `2026-09-24` [Add regression tests for every bug found in live running](https://github.com/jsundram/mbta-glx/commit/0853edea699f89f52907af14901a33037341e7eb)
- `2026-09-24` [Debounce longer than the observed flap; reframe recovery as a question](https://github.com/jsundram/mbta-glx/commit/8a826bf7ccfdc4c9071a5823f77c0f3c2a42ae14)
- `2026-09-24` [Announce ETA revisions; add a live status board](https://github.com/jsundram/mbta-glx/commit/27f8c3d0acc53e39ec250393a7a8b32b9317d702)
- `2026-09-24` [Fix glitchy dwell counter; add a live GLX line map to the board](https://github.com/jsundram/mbta-glx/commit/a00ab1b87d38c5ccc822b9e89370c75496005b8e)
- `2026-09-25` [Exclude non-revenue trains; de-duplicate terminus; latch the due state](https://github.com/jsundram/mbta-glx/commit/84f95d64c6524f6dd7bbec1dffafab0d6381419c)
- `2026-09-25` [Restyle the map as a T diagram; correct the express-running claim](https://github.com/jsundram/mbta-glx/commit/50a9d7f6302023c3b3ce1b2934c7ae5bc74bb81b)
- `2026-09-25` [Score the last 10 trains against the leave-now advice](https://github.com/jsundram/mbta-glx/commit/a48797d7913b34dee8494a70108f69faaf998641)
- `2026-09-25` [Reorder the board so the map separates future from past](https://github.com/jsundram/mbta-glx/commit/a820158621d0721dbd2f238e093fe9faab231973)
- `2026-09-25` [Draw trains as cars labelled with their real car number](https://github.com/jsundram/mbta-glx/commit/db1ffd1e085cc374f6c2712957e0e578d1014b55)
- `2026-09-25` [Integrate service alerts; score suspended destinations at zero](https://github.com/jsundram/mbta-glx/commit/d13e566ce0880bf41fb938a0e84ccac028e17933)
- `2026-09-26` [Act on MBTA's own skip and cancellation markers](https://github.com/jsundram/mbta-glx/commit/c5a6297c48d27eef61c64643c3985b270bce9a1c)
- `2026-09-26` [Archive alert state; capture downtown platforms; extend prune to 30 days](https://github.com/jsundram/mbta-glx/commit/a8ca91d6c7804177af4ef42e50fd92a12dc86463)
- `2026-09-26` [Add a replay harness; the quantile turns out not to be the lever](https://github.com/jsundram/mbta-glx/commit/be6e7262d2925411989da40966636a9c4b66bed7)
- `2026-09-26` [Verify and document the static-frontend deploy architecture](https://github.com/jsundram/mbta-glx/commit/e21973060248a074d000ac721ea8861261806988)
- `2026-09-26` [Measure how long daily updating stays worth it](https://github.com/jsundram/mbta-glx/commit/1fbf93fbec2460e7dda019c299ff6c8ce4eb8c15)
- …and 58 more in this repo

**`pwa-starter`** — 10 commits

- `2026-09-24` [Compare the RUNNING bundle to the server, not the cache key (app-v8)](https://github.com/jsundram/pwa-starter/commit/cef3cd21afb8883d7cfb89f13178ce4344560dc8)
- `2026-09-24` [PROPAGATE: the version tag must read the running bundle (cef3cd2)](https://github.com/jsundram/pwa-starter/commit/223ed1389bd2daa5d4b7cdb0176e651aac7b43c9)
- `2026-09-24` [Review fixes: widen discovery, retire the ranking prose, correct the host note](https://github.com/jsundram/pwa-starter/commit/e91616a000228d465f1bc037f5a410967f3a1f78)
- `2026-09-24` [Track the scripts/ copies, and key SHARED by the path they live at](https://github.com/jsundram/pwa-starter/commit/854d95761a66e304c67d63536659092293898a85)
- `2026-09-24` [PROPAGATE: key the scripts/-tracking entry by its commit (854d957)](https://github.com/jsundram/pwa-starter/commit/0f0ffba255a6e07c3003da8a10a0ba83495e4a1e)
- `2026-09-24` [sw-lint: check 7, --base REF — the V comparison one commit cannot make](https://github.com/jsundram/pwa-starter/commit/857fc2833dab4fb585204a0a7540bb9c8725af67)
- `2026-09-24` [PROPAGATE: key the --base entry by its commit (857fc28)](https://github.com/jsundram/pwa-starter/commit/e21fb2f2c3d3443cc9101f4d4355a2d5727e7583)
- `2026-09-24` [Review fixes: close four silent-pass paths and one that breaks executables](https://github.com/jsundram/pwa-starter/commit/de6ccfbc331286a1f60e6f4a6812a39385ece83c)
- <sub>plus 2 merge/chore/typo commits, not listed</sub>

**`quartet-log`** — 5 commits

- `2026-09-22` [Size the how-to screenshots to their real pixels](https://github.com/jsundram/quartet-log/commit/c5d919b9a7fe52c100184390df742932972434d4)
- `2026-09-22` [Rewrite the how-to as four parts, split by who is reading](https://github.com/jsundram/quartet-log/commit/f1f51bea6af5b68c84b85ddd67212681dffdceb8)
- `2026-09-22` [Cite the how-to by heading, not by section number](https://github.com/jsundram/quartet-log/commit/8852b2e1afd91f10175e91c825a54bf30b3c6237)
- `2026-09-22` [Point people with no log yet at the how-to](https://github.com/jsundram/quartet-log/commit/1c8596de2784ba65629870a3cb9b5f02a8e8bb6b)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**`quartet-composers`** — 2 commits

- <sub>routine commits only — nothing worth narrating</sub>
- <sub>plus 2 merge/chore/typo commits, not listed</sub>

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 5/5 from commit counts alone. What did the week actually feel like?

### Week 05 — Sep 28–30

6 commits · intensity guessed at 1/5

```
Mon Sep 28  █ 1
Tue Sep 29  █ 2
Wed Sep 30  █ 3
```

**`boccherini-opus-48`** — 3 commits

- `2026-09-30` [Starting the first edition of Opus 48](https://github.com/jsundram/boccherini-opus-48/commit/fa9b991b1765c9429d0c870b54904f100376b701)
- `2026-09-30` [Switch to English note names, add manuscript covers, trim README](https://github.com/jsundram/boccherini-opus-48/commit/6f722ccf8250584d3b7eddd2903bdc73871d2ed4)
- `2026-09-30` [add skeleton](https://github.com/jsundram/boccherini-opus-48/commit/0770211055df3e57a6dea8ec761c0d5e5213898a)

**`somerville-typemap`** — 2 commits

- `2026-09-29` [warp: envelope v7 — HILL flip, baseline-step cap, stretch 3.0, region size ratio](https://github.com/jsundram/somerville-typemap/commit/56a9d103e79c6807e8f740c59c5e0e093a7d5cfb)
- <sub>plus 1 merge/chore/typo commit, not listed</sub>

**`mbta-glx`** — 1 commit

- `2026-09-28` [Give the board its own origin instead of paths on a shared host](https://github.com/jsundram/mbta-glx/commit/56dcd827cb90410b1d14235bc92c77d8e882ae4a)

**Questions**

- Reading those commits back: what were you actually trying to do?
- Which of them mattered, and which are noise dressed up as progress?
- Anything here that took far longer than the commit count suggests, or far less?
- Intensity is guessed at 1/5 from commit counts alone. What did the week actually feel like?

---

## Answers (2026-10-17)

**The month.** Split. Coming off August's playing; musical guests stayed for the first
half of the month. Passed 1,000+ pieces played in ensembles in the trailing 365 days
(owner's figure, from the playing log — not a GitHub count). A friend asked to see the
2014 fisheye chart; it looked bad enough that remaking it became the month's largest
piece of work (`quartet-composers`).

**pwa-starter.** Owner thinks the summer's pwa-starter work helped the remake.
Verified: the quartet-composers README says "Built on pwa-starter", and the first
commit (`1f3766c`, Sep 4) already carries `sw.js`, `sw-lint.py`, `og-lint.py`,
`make-icons.sh`, and `make-og.sh`.

**Stalled.** `lissajous-tuner` works, but needs more before it is more than nice to
look at. Candidate loose thread (parked).

**Gaps.** The empty days (Sep 14, 20, 21, 23) and the light third week went mostly to
playing Boccherini and other musical projects.

**August, late addition.** `boccherini-haydn-timeline` (8 commits, Aug 20) grew out of a
Claude artifact drafted in February; it became its own repo for more control and so it
could stand alone. Belongs in August week 4 (Aug 17–23).

**Correction — when the guests were.** Owner said the guests stayed the first half of the
month; weeks 1–2 were also the month's heaviest (189 of 318 commits), and Sep 14–23 the
quiet stretch. Owner: the socializing was overstimulating, and focused work was the
retreat from it, so the busiest stretch coincided with hosting.

**1,000 pieces.** Crossed 1,000 ensemble pieces in a trailing 365 days on Sep 11, 2026
(owner's playing log).

**mbta-glx.** Not a commute. The owner takes the train occasionally, missing one is
costly, and no existing service notifies well enough, so this was built to time the walk.

**The Sep 8 review rounds.** Two problems at once: the page-view counting itself (#23),
and the coding model writing a lot of prose into code and docs that later went stale and
needed fixing — worse code and more review rounds each pass. Frustrating. Corroborated by
Sep 15–18: "Cut the comments and docs that could not go red" (#67), "Measure the prose
ratio in one place" (#77), "CLAUDE.md holds the rule, not the incident" (#75), "Cut the
prose volume, and stop the pre-commit hook being opt-in" (#115); and in quartet-log on
Sep 17, "Trim CLAUDE.md to what the code doesn't already say" (#15).

**lissajous-tuner.** Loose thread, parked.

---

## After the answers

1. Rewrite every `TODO` in `data/months/2026-09.js`.
2. Delete any `note` field that has nothing honest to say.
3. Add the month to `data/index.js` (newest first) with a one-sentence `blurb`.
4. Open `index.html#2026-09` and read it end to end.
5. Keep this file. It is the provenance for prose that is otherwise unfalsifiable.
