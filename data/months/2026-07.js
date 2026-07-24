window.REVIEW_MONTHS = window.REVIEW_MONTHS || {};
window.REVIEW_MONTHS["2026-07"] = {
  id: "2026-07",
  label: "July 2026",
  status: "active",
  inProgress: true,
  coverage: {
    start: "2026-07-01",
    end: "2026-07-24"
  },
  lede: "Two halves. AKM was polished and finished through the festival, which ended on Jul 13, with videos released and linked afterwards. Then the patterns it had proved were formalised into pwa-starter and carried back into the Haydn and Boccherini periodic tables and Quartet Log.",
  metrics: [
    {
      value: "20",
      label: "days with commits",
      note: "Of the 24 covered so far; the month runs to Jul 31"
    },
    {
      value: "9",
      label: "public repos touched",
      note: "Counted from commits, Jul 1–24"
    },
    {
      value: "4",
      label: "projects started",
      note: "pwa-starter Jul 13, boccherini-sampler Jul 17, somerville-typemap Jul 22, spotify-tile Jul 24"
    },
    {
      value: "5",
      label: "apps in pwa-starter's orbit",
      note: "Named in its PROPAGATE.md. quartet-log is tracked as the skeleton's ancestor, not a copy"
    }
  ],
  weeks: [
    {
      id: "w1",
      number: "01",
      range: "Jul 1–5",
      dates: { start: "2026-07-01", end: "2026-07-05" },
      status: "active",
      intensity: 3,
      title: "The app goes multi-user.",
      summary: "In the days before the festival, AKM stopped being a personal schedule app. A first-open user picker, a per-user day on every page, personal events given their own styling and made editable by tap, and an About page reached through the wordmark. The schedule parser learned the source sheet's live curveballs — new rooms, mid-day faculty cells, and a DAILY NOTES block that had been read as dinners. haydn-info-card took a handful of fixes alongside.",
      note: "The multi-user work lands before anyone else needs it. The festival starts the following Monday.",
      themes: ["field", "travel", "music", "platform"],
      projects: [
        {
          name: "AKM",
          repo: "AKM",
          desc: "A festival companion, converted from one person's schedule into everyone's in the week before it was needed.",
          url: "https://github.com/jsundram/AKM"
        },
        {
          name: "Haydn Info Card",
          repo: "haydn-info-card",
          desc: "Smaller fixes to the interactive card alongside the AKM work.",
          url: "https://github.com/jsundram/haydn-info-card"
        }
      ],
      evidence: [
        { text: "Multi-user: first-open picker, per-user day on every page", url: "https://github.com/jsundram/AKM/commit/39d81990bd41601668b22dad324581fc8a461828" },
        { text: "Personal events: brass \"just for me\" styling + tap-to-edit", url: "https://github.com/jsundram/AKM/commit/6865e7bac2862750240a3157ae3278b3e85d53b8" },
        { text: "Parse the sheet's live curveballs: new rooms, mid-day faculty cells", url: "https://github.com/jsundram/AKM/commit/b34711d304bb1576ae14ebd760e692f8b2d1d489" },
        { text: "Schedule: stop the DAILY NOTES block from being parsed as dinners", url: "https://github.com/jsundram/AKM/commit/48763705595acad742024dffce21befdf81a1a8a" },
        { text: "Schedule: recognize A3 as a room; alias it to Kultursaal on the map", url: "https://github.com/jsundram/AKM/commit/7c5e110ee58843a738c9abf3b78279d069575eff" },
        { text: "About page, reached via the wordmark", url: "https://github.com/jsundram/AKM/commit/35b4f5be88815b15071c70007b2131f3c68ab191" }
      ]
    },
    {
      id: "w2",
      number: "02",
      range: "Jul 6–12",
      dates: { start: "2026-07-06", end: "2026-07-12" },
      status: "active",
      intensity: 5,
      title: "The festival, and the fixing.",
      summary: "Thirty-eight commits on Jul 6 alone, the largest day of the month. They read as live operation: centre the selected day chip, because today drifts off the right edge mid-festival; namespace self-added events per identity so they don't bleed across users; keep the add-sheet above the Android soft keyboard; commit the WITH autocomplete on touchstart because pointerdown wasn't enough on iOS. Rooms and lodgings were corrected on the map as they were understood — KS is a venue and an apartment, not a venue and food; the swimming pond gets a pond-sized label rather than a river-sized one. A live schedule smoke test swept all fifteen festival days. On Jul 12, pwa-starter's first commit.",
      note: "None of this came from bug reports. The feedback during the festival was feature requests and kudos; these are things noticed first-hand and tested on a phone over ngrok.",
      themes: ["field", "travel", "platform"],
      projects: [
        {
          name: "AKM in use",
          repo: "AKM",
          desc: "Schedule, map, roster, and the add-sheet, corrected while the festival ran around them.",
          url: "https://github.com/jsundram/AKM"
        },
        {
          name: "PWA Starter",
          repo: "pwa-starter",
          desc: "An opinionated skeleton and checklist for small static PWAs, started as the festival wound down.",
          url: "https://github.com/jsundram/pwa-starter"
        }
      ],
      evidence: [
        { text: "Schedule: centre the selected day chip (today drifts off the right edge mid-festival)", url: "https://github.com/jsundram/AKM/commit/e497d5b046d6c4406c3f6e0fd9491f6f6e75dd82" },
        { text: "Schedule: namespace self-added events per identity (don't bleed across users)", url: "https://github.com/jsundram/AKM/commit/858832d3584e94ec1dec2eb9d08f1da60badea37" },
        { text: "Add sheet: commit WITH suggestion on touchstart/mousedown (pointerdown wasn't enough on iOS)", url: "https://github.com/jsundram/AKM/commit/a8a8bd0a1dff713e27c30e36506e6dd8a97846ed" },
        { text: "Android: keep the add-sheet above the soft keyboard; harden pull-to-refresh", url: "https://github.com/jsundram/AKM/commit/02b8c4997627bb93dc9e176c20eff08a908c4281" },
        { text: "Test: schedule-test sweeps every festival day (15/15)", url: "https://github.com/jsundram/AKM/commit/78640f6c066dc323bb994ccf1a3ba06cc2408a51" },
        { text: "pwa-starter: opinionated skeleton + checklist for small static PWAs", url: "https://github.com/jsundram/pwa-starter/commit/b928fbc24dd9f1b90daefcce2d8dbf7e167ad46c" }
      ]
    },
    {
      id: "w3",
      number: "03",
      range: "Jul 13–19",
      dates: { start: "2026-07-13", end: "2026-07-19" },
      status: "active",
      intensity: 4,
      title: "Ending, archiving, an emergency.",
      summary: "The festival ended on Jul 13. AKM's remaining work closes it out: observed ERA5 weather baked into the frozen snapshot in place of forecasts, a restyled wrapped-festival banner with friendlier send-off copy, and per-piece recording links added as the videos were released. AKM's last commit is Jul 17. The same day, boccherini-sampler was created and finished inside two days — playable part bundles with QR and tablet access, built because a Boccherini reading session was happening that evening and distributing parts was otherwise going to be a real problem.",
      note: "boccherini-sampler is the only genuinely forced work in the month. Everything else here was chosen.",
      themes: ["field", "music", "platform"],
      projects: [
        {
          name: "AKM archive",
          repo: "AKM",
          desc: "Observed weather in place of forecasts, a send-off banner, and recording links added as videos appeared.",
          url: "https://github.com/jsundram/AKM"
        },
        {
          name: "Boccherini Sampler",
          repo: "boccherini-sampler",
          desc: "Playable part bundles with QR and tablet access, built in two days for a reading session that evening.",
          url: "https://github.com/jsundram/boccherini-sampler"
        },
        {
          name: "PWA Starter",
          repo: "pwa-starter",
          desc: "Placeholder icons, a share card, and the beginnings of the propagation record.",
          url: "https://github.com/jsundram/pwa-starter"
        }
      ],
      evidence: [
        { text: "archive: bake observed ERA5 weather into the frozen snapshot", url: "https://github.com/jsundram/AKM/commit/a42f94799a4e8f63d0f97db9ed86588f1545fae3" },
        { text: "archive: restyle wrapped-festival banner + friendlier send-off copy", url: "https://github.com/jsundram/AKM/commit/1319d856a066d92c33517fd716fa5e120c628097" },
        { text: "buildlog: refresh through 2026-07-13 (205 commits, 46h in session)", url: "https://github.com/jsundram/AKM/commit/248e85840de6dc1a66cac86b695805d4a05cce4f" },
        { text: "Generate placeholder icons + share card", url: "https://github.com/jsundram/pwa-starter/commit/16eadab643c650c99fb593d14a0729904ae2b727" }
      ]
    },
    {
      id: "w4",
      number: "04",
      range: "Jul 20–26",
      dates: { start: "2026-07-20", end: "2026-07-26" },
      status: "active",
      intensity: 5,
      title: "A down day, spent working.",
      summary: "Jul 20 hardened pwa-starter's service worker: gate every cache write on resp.ok, so a 502 can't overwrite a good cached file and survive as the offline fallback; serve same-origin JSON stale-while-revalidate rather than network-first; refuse empty payloads and paint from cache first. Jul 22 was the busiest day of the month at 41 commits across four repos. somerville-typemap went from nothing to a layered typographic map of the city — Overpass data, boundaries, route relations, adjacency-aware colouring, and glyph warping. The pwa-starter fixes went out to quartets.boccherini.org, haydn-info-card, and Quartet Log, along with cookieless GoatCounter analytics. On Jul 24, spotify-tile started and quartet-chooser got security fixes.",
      note: "Jul 22 was the first day off in a long stretch. It went into more work, on the strength of the previous three weeks having gone well.",
      themes: ["platform", "music", "visual"],
      projects: [
        {
          name: "PWA Starter",
          repo: "pwa-starter",
          desc: "Cache-write gating, stale-while-revalidate JSON, empty-payload refusal, and a record of which apps need which fix.",
          url: "https://github.com/jsundram/pwa-starter"
        },
        {
          name: "Somerville Typemap",
          repo: "somerville-typemap",
          desc: "A map of Somerville where every feature is rendered as text. Built in a single day.",
          url: "https://github.com/jsundram/somerville-typemap"
        },
        {
          name: "Spotify Tile",
          repo: "spotify-tile",
          desc: "A reimplementation of (Geo) Musical Configurations, with an Instagram-story generator and HarfBuzz-shaped text.",
          url: "https://github.com/jsundram/spotify-tile"
        }
      ],
      evidence: [
        { text: "Gate service-worker cache writes on resp.ok", url: "https://github.com/jsundram/pwa-starter/commit/2ed87e9a5e130cf5b9542b06b5e23a08cf5727cf" },
        { text: "Refuse empty payloads, paint from cache first, repaint gently", url: "https://github.com/jsundram/pwa-starter/commit/ddd9ab806b060048700c56cb1f228c90ee315890" },
        { text: "Full Somerville assembly: render_map.py", url: "https://github.com/jsundram/somerville-typemap/commit/39a6e8336900b4431cda0dc1a501ceb63fd39fa4" },
        { text: "Boundaries layer, adjacency-aware coloring, text dedupe, crammed heroes", url: "https://github.com/jsundram/somerville-typemap/commit/d87b73312b5150eb365aa3297d76b500d55724ca" },
        { text: "Port haydn mobile/PWA fixes; fix two deeper scroll bugs; clean Spotify taps", url: "https://github.com/jsundram/quartets.boccherini.org/commit/a89e5eb2f4ed3ee2d461e0b69aee9df33228bd6d" },
        { text: "Sync sw.js hardening from pwa-starter: gate cache writes, serve cache on 4xx/5xx", url: "https://github.com/jsundram/haydn-info-card/commit/9b7d7ca91b34ac213389b8b2fb82f148a0879ef8" },
        { text: "Add fullscreen vertical calendar mode for mobile", url: "https://github.com/jsundram/quartet-log/commit/a83c8854368ea9911a5e43ffe738e92e80d9c0cb" },
        { text: "Initial commit: geomusic — (Geo) Musical Configurations reimplementation", url: "https://github.com/jsundram/spotify-tile/commit/3398beaf61b11a8518b0fd599d26e0c42dcb045c" }
      ]
    },
    {
      id: "w5",
      number: "05",
      range: "Jul 27–31",
      dates: { start: "2026-07-27", end: "2026-07-31" },
      status: "nodata",
      note: "Not yet covered. The month is still in progress; the snapshot ends Jul 24."
    }
  ],
  threads: [
    {
      title: "Somerville Typemap needs more work",
      repo: "somerville-typemap",
      status: "parked",
      note: "Seventeen commits on Jul 22 took it from an empty repo to a layered typographic map with boundaries, route relations, and glyph warping. Parked two days later when spotify-tile and this review page took over. It is not finished and it is not abandoned.",
      url: "https://github.com/jsundram/somerville-typemap/commit/c66f8135a0302a2cd2378dd7d20a8ce2de24d2e9"
    },
    {
      title: "Tracking how code flows between pwa-starter and the apps",
      repo: "pwa-starter",
      status: "active",
      note: "The skeleton is both a starting point for new projects and a review tool for old ones, and several of those apps predate it — so the dependency graph runs both ways and keeps changing as the skeleton evolves. Capturing it has been a mess. Three files were stamped as copies on Jul 20 and the stamps reverted the same day; the rule now is to stamp whole-file copies only, and to record independent implementations as explicitly not downstream.",
      url: "https://github.com/jsundram/pwa-starter/commit/22048896b1909006d71d04753be76f1604a5f581"
    },
    {
      title: "Spotify Tile, one day old",
      repo: "spotify-tile",
      status: "active",
      note: "Started Jul 24 after a stop at SIGGRAPH to see Shirley Wu's work, and looking at posters on the way out. A reimplementation of (Geo) Musical Configurations, with an Instagram-story generator and story text rendered as HarfBuzz-shaped outline paths.",
      url: "https://github.com/jsundram/spotify-tile/commit/84d8ab45be8f822e172ec2efd3218082f849d28d"
    }
  ]
};
