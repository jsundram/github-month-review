window.REVIEW_MONTHS = window.REVIEW_MONTHS || {};
window.REVIEW_MONTHS["2026-08"] = {
  id: "2026-08",
  label: "August 2026",
  status: "active",
  coverage: {
    start: "2026-08-01",
    end: "2026-08-31"
  },
  lede: "More music than any month before it — playing 28 of 31 days — with the project work fitted into the gaps: a service-worker fix pushed across five apps in a day, a quartet-log overhaul planned and executed inside another, quartet-chooser walked through a phased PWA checklist, and a bow dataset scraped from the Cozio Archive into three published reports.",
  metrics: [
    {
      value: "146",
      label: "public commits",
      note: "Across 8 repos; 17 of the month's 31 days have commits"
    },
    {
      value: "142",
      label: "works played",
      note: "With 40 different people. From the owner's playing log, not GitHub"
    },
    {
      value: "28",
      label: "days playing, of 31",
      note: "Including a 12-day streak. From the owner's playing log"
    },
    {
      value: "3",
      label: "bow reports published",
      note: "From a Cozio Archive dataset built in a local git repo, off GitHub; see week 5"
    }
  ],
  weeks: [
    {
      id: "w1",
      number: "01",
      range: "Aug 1–2",
      dates: { start: "2026-08-01", end: "2026-08-02" },
      status: "active",
      intensity: 1,
      title: "Home from SoCal.",
      summary: "The workshop's last day was Aug 1. Aug 2's six commits are haydn-info-card fixes carried home from using the card there: tap a quartet's key to highlight its key-group, fill the screen on the mobile card, and restore the touch tooltip the key-tap had claimed.",
      themes: ["music", "travel"],
      projects: [
        {
          name: "Haydn Info Card",
          repo: "haydn-info-card",
          desc: "Key-group highlighting and mobile fixes, from using the card at SoCal.",
          url: "https://github.com/jsundram/haydn-info-card"
        }
      ],
      evidence: [
        { text: "Merge: tap a quartet's key to highlight its key-group (PR #8)", url: "https://github.com/jsundram/haydn-info-card/commit/d501c8b5d8c81d3a8064bc5222a4fadf89814b5e" },
        { text: "Merge: fill the screen on the mobile web card (PR #9)", url: "https://github.com/jsundram/haydn-info-card/commit/8601471dd6ae4a3cff536c752f03a760f9a973fa" },
        { text: "Restore mobile tooltip: don't claim the card key tap on touch", url: "https://github.com/jsundram/haydn-info-card/commit/395daa3ef334f2b5f33bc994f737fc94daf651c6" }
      ]
    },
    {
      id: "w2",
      number: "02",
      range: "Aug 3–9",
      dates: { start: "2026-08-03", end: "2026-08-09" },
      status: "active",
      intensity: 5,
      title: "One sweep, one overhaul.",
      summary: "Two big days in a playing week. On Aug 4, pwa-starter's service worker learned to serve the app shell cache-first with a bounded network fallback, so lie-fi can't blank the screen — and the fix went out the same day to haydn-info-card, quartets.boccherini.org, AKM, and quartet-log, continuing the work of moving what AKM proved into every app that could use it, and of working out what pwa-starter should be. This page closed out July the same day. On Aug 9, quartet-log got an architecture day: a review and todo written in the morning, executed as 27 stacked diffs by evening — tests, focused modules, a pinned CI supply chain, eslint and typechecking floors — and the working docs retired before the day ended.",
      note: "Intensity 5 is really two days' worth: Aug 4 and Aug 9 carry 57 of the week's 63 commits.",
      themes: ["platform", "infra", "music"],
      projects: [
        {
          name: "PWA Starter",
          repo: "pwa-starter",
          desc: "An opinionated skeleton and checklist for small static PWAs; source of the week's cache-first fix.",
          url: "https://github.com/jsundram/pwa-starter"
        },
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "Overhauled in a day from its own written review: tests, modules, CI, lint and type floors.",
          url: "https://github.com/jsundram/quartet-log"
        },
        {
          name: "Haydn Info Card",
          repo: "haydn-info-card",
          desc: "First app to take the cache-first shell fix, after the card blanked on slow networks.",
          url: "https://github.com/jsundram/haydn-info-card"
        }
      ],
      evidence: [
        { text: "sw.js: serve the shell cache-first with a bounded network fallback (#9)", url: "https://github.com/jsundram/pwa-starter/commit/77fcb3552cda40048a6ccc02c4d5046e9637de6e" },
        { text: "PROPAGATE: record 77fcb35's porting constraints for the #9 lie-fi family", url: "https://github.com/jsundram/pwa-starter/commit/64b442dfba37a8f80e6eafdcbbf24c9e2a83c1bd" },
        { text: "Merge: serve the app shell cache-first so slow networks can't blank the screen (PR #10)", url: "https://github.com/jsundram/haydn-info-card/commit/86c4618527d68e37bdcd4c7381ea636ee32a7bc2" },
        { text: "AKM sw: modernize to the pwa-starter offline family; bump V to akm-v109", url: "https://github.com/jsundram/AKM/commit/2bfe4d091227f2fbb2df5e3d55d371f3718c726c" },
        { text: "quartet-log sw: bound the network-first waits so lie-fi can't blank the screen", url: "https://github.com/jsundram/quartet-log/commit/5df540f1e74a71794c7bc3c5b869bb6ec822f3fb" },
        { text: "architecture hardening: execute the 2026-08-08 review as 27 stacked diffs (#8)", url: "https://github.com/jsundram/quartet-log/commit/8afb8b670ef32c72e2315ff21ba18e8530c0a7f3" }
      ]
    },
    {
      id: "w3",
      number: "03",
      range: "Aug 10–16",
      dates: { start: "2026-08-10", end: "2026-08-16" },
      status: "active",
      intensity: 1,
      title: "A playing week.",
      summary: "One commit: shorter stat labels on quartet-log's mobile ALL tab, on Monday. The rest of the week went to music, not project work.",
      themes: ["music"],
      projects: [
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "One mobile label fix.",
          url: "https://github.com/jsundram/quartet-log"
        }
      ],
      evidence: [
        { text: "swap ALL tab stat labels to short form on mobile", url: "https://github.com/jsundram/quartet-log/commit/145b0530c394b9220bce7ff21a29aa7a70e5548d" }
      ]
    },
    {
      id: "w4",
      number: "04",
      range: "Aug 17–23",
      dates: { start: "2026-08-17", end: "2026-08-23" },
      status: "active",
      intensity: 2,
      title: "quartet-log features between sessions.",
      summary: "A small feature run on quartet-log: a 5+ tab for quintet-and-larger repertoire with second-viola part support, a Unique Parts stat on the summary cards and per-year calendar, and the calendar's per-year stats derived from the same aggregate computation the rest of the app uses. quartet-chooser got one fix — omit the iframe src entirely when a movement has no Spotify link.",
      themes: ["music"],
      projects: [
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "The 5+ tab and Unique Parts stat, with per-year stats de-duplicated into one computation.",
          url: "https://github.com/jsundram/quartet-log"
        },
        {
          name: "Quartet Chooser",
          repo: "quartet-chooser",
          desc: "One iframe fix, ahead of the checklist run the following week.",
          url: "https://github.com/jsundram/quartet-chooser"
        }
      ],
      evidence: [
        { text: "add 5+ tab for quintet-and-larger rep with VA2 part support", url: "https://github.com/jsundram/quartet-log/commit/4397df5bef6b83cdb11f3d06d762ee37b5417e76" },
        { text: "add Unique Parts stat to summary cards and per-year calendar column", url: "https://github.com/jsundram/quartet-log/commit/1f9e0a4a09489bfc16b0fca0fd1a1a0cfce4bda3" },
        { text: "derive calendar per-year stats from computeAggregateStats", url: "https://github.com/jsundram/quartet-log/commit/923d1c45c402cd31fddfbd656da64f9e98a48608" },
        { text: "Omit iframe src entirely when a movement has no Spotify link", url: "https://github.com/jsundram/quartet-chooser/commit/bb4a5da32aa9bcc4ef76fee04b13a985796c24d8" }
      ]
    },
    {
      id: "w5",
      number: "05",
      range: "Aug 24–30",
      dates: { start: "2026-08-24", end: "2026-08-30" },
      status: "active",
      intensity: 5,
      title: "The checklist, and a bow dataset.",
      summary: "quartet-chooser was walked through pwa-starter's checklist as numbered phases, each recorded in a pwa.md plan doc as it merged: raster share cards and full preview tags, a real manifest and installable icons, safe-area insets and an accessibility floor, GoatCounter analytics, and a Phase 7 performance pass that stopped the home page preloading 1.4 MB of Spotify frames. quartet-log's data-quality pass continued — audit tooling for player names and ensembles, blank cells read as ditto marks whatever the gap. And off GitHub entirely: from Aug 25 a local git repo scraped the Tarisio Cozio Archive's bow data — with permission, one request every two seconds — into a 4,604-row dataset. Six reports came out of it: three published — the last three links below — and three more on instrument size against price, built Aug 28 but not yet published.",
      note: "The bow reports are the month's only public work that is not on GitHub; the repo is local. The last three links below are the published pages, not commits.",
      themes: ["platform", "music", "writing"],
      projects: [
        {
          name: "Quartet Chooser",
          repo: "quartet-chooser",
          desc: "Share cards, installability, accessibility, analytics, and performance, as phases of one recorded plan.",
          url: "https://github.com/jsundram/quartet-chooser"
        },
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "Data-quality tooling, so the playing numbers can be trusted.",
          url: "https://github.com/jsundram/quartet-log"
        }
      ],
      evidence: [
        { text: "Raster share cards and a full preview tag set on every page", url: "https://github.com/jsundram/quartet-chooser/commit/cfc37770b939c8f2f7f3c2ea7ff6e449f4d45c82" },
        { text: "Make the site installable: real manifest, maskable icon, install metas", url: "https://github.com/jsundram/quartet-chooser/commit/4e0f14ee969eb8bece11babc1db4139b0a371c5c" },
        { text: "Phase 7: stop preloading 1.4 MB on the home page", url: "https://github.com/jsundram/quartet-chooser/commit/a5ad2b900db2a263d1abbeeee014b99d62ffbf45" },
        { text: "Audit tooling for player-name and ensemble data quality (#18)", url: "https://github.com/jsundram/quartet-log/commit/c11b24ca1bac58cd058dcc858d9e220d0975e314" },
        { text: "The Ten Gram Step — 3,821 violin and viola bows, and how much the maker matters", url: "https://claude.ai/code/artifact/18143ab8-83a2-49f0-b062-06a57789d0b2" },
        { text: "The Bow Staircase — bow weight climbs the string family in even ten-gram steps", url: "https://claude.ai/code/artifact/91fed9ae-5aab-4856-ab70-272cb98e1aae" },
        { text: "The Unstamped Peccatte — the archive's 66 Peccatte violin bows and their stamps", url: "https://claude.ai/code/artifact/c09f7fc9-189c-4e3f-8e37-a397eaed2bbb" }
      ]
    },
    {
      id: "w6",
      number: "06",
      range: "Aug 31",
      dates: { start: "2026-08-31", end: "2026-08-31" },
      status: "active",
      intensity: 1,
      title: "Phase 7 closes.",
      summary: "Three commits on the month's last day: a seventh review round on quartet-chooser fixed a 44px tap target and two comments that said false things, pwa.md marked Phase 7 merged and live, and quartet-log gained a one-month date range with corrected boundary math.",
      note: "The week straddles the month boundary; its remaining days belong to September.",
      themes: ["platform", "music"],
      projects: [
        {
          name: "Quartet Chooser",
          repo: "quartet-chooser",
          desc: "The checklist run's last review round and its closing bookkeeping.",
          url: "https://github.com/jsundram/quartet-chooser"
        }
      ],
      evidence: [
        { text: "Review round 7: a 44px way out, and two comments that said false things", url: "https://github.com/jsundram/quartet-chooser/commit/b2da4b1c79ba3e71f7b9bb4ab9ccbad4659093a8" },
        { text: "pwa.md + checklist: Phase 7 is merged and live", url: "https://github.com/jsundram/quartet-chooser/commit/54bb8e3183915d38e63e974011edfe32a084ecbd" },
        { text: "Add a 1M date range option and fix the range boundary math (#29)", url: "https://github.com/jsundram/quartet-log/commit/f8340b5615727fc398c4d18bf91cf5a53c392169" }
      ]
    }
  ],
  threads: [
    {
      title: "A month-in-review for the playing, built but not landed",
      repo: "quartet-log",
      status: "active",
      note: "A data-driven review of August's playing — the most music in any month yet: 142 works with 40 people, 28 of 31 days — exists in quartet-log's working tree but has not been committed or published. The companion piece to a month where the playing outweighed the code."
    },
    {
      title: "Spotify Tile, waiting on answers",
      repo: "spotify-tile",
      status: "active",
      note: "No commits since its first day, Jul 24. The plan to regenerate the acoustic analysis its features depend on is waiting on questions sent to the original visualization's author; the trail has gone cold and needs a nudge.",
      url: "https://github.com/jsundram/spotify-tile"
    },
    {
      title: "The nh_tax_map reddit post",
      repo: "nh_tax_map",
      status: "dropped",
      note: "A credit line citing the u/Glares post that inspired the map went in on Aug 6, ahead of posting to r/dataisbeautiful. The subreddit took the post down despite the cited sources, the reason never became clear, and it was dropped as not worth the fight.",
      url: "https://github.com/jsundram/nh_tax_map/commit/34677c1beaefe3b4946a79b93c4da2c14d79bee8"
    },
    {
      title: "Somerville Typemap, still parked",
      repo: "somerville-typemap",
      status: "parked",
      note: "No commits since the seventeen that built it on Jul 22. Still not finished, still not abandoned.",
      url: "https://github.com/jsundram/somerville-typemap"
    }
  ]
};
