window.REVIEW_MONTHS = window.REVIEW_MONTHS || {};
window.REVIEW_MONTHS["2026-06"] = {
  id: "2026-06",
  label: "June 2026",
  status: "active",
  coverage: {
    start: "2026-06-01",
    end: "2026-06-30"
  },
  lede: "Four threads, mostly separate: ongoing dashboard and stats work on quartet-log, a one-off Maine trip handout, the first version of haydn-lowdn, and the Haydn info card ported to a PWA-style page. The last week starts AKM as a personal schedule app for a festival in Austria.",
  metrics: [
    {
      value: "18",
      label: "days with commits",
      note: "Out of 30. The empty days are as real as the busy ones"
    },
    {
      value: "8",
      label: "public repos touched",
      note: "Counted from commits, Jun 1–30"
    },
    {
      value: "3",
      label: "projects started",
      note: "lobsters-and-lighthouses Jun 8, haydn-lowdn Jun 12, AKM Jun 28"
    },
    {
      value: "3 days",
      label: "AKM from nothing to a festival app",
      note: "45 commits, Jun 28–30: roster, map, weather"
    }
  ],
  weeks: [
    {
      id: "w1",
      number: "01",
      range: "Jun 1–7",
      dates: { start: "2026-06-01", end: "2026-06-07" },
      status: "active",
      intensity: 3,
      title: "One idea, refined.",
      summary: "All twenty commits are quartet-log. A Top Musicians chart went in first, then the musician network, which is where the week actually went: a graph view, a matrix view, a chord diagram, a full-screen mode, colouring by instrument, and label and tooltip fixes layered on each. These are not six features — they are one idea being refined until it read correctly. The rest is smaller: data-fetch scripts, better parsing of the Others? field, and bigger touch targets on mobile.",
      note: "Half the week's commits land on Jun 3.",
      themes: ["music", "visual"],
      projects: [
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "A record of quartets played, with a dashboard over the history. Code for log.quartetroulette.com.",
          url: "https://github.com/jsundram/quartet-log"
        }
      ],
      evidence: [
        { text: "add Top Musicians to dashboard", url: "https://github.com/jsundram/quartet-log/commit/ddec64df739652c8bfc16e7cf43b493c14801d48" },
        { text: "add musician network section with graph and matrix views", url: "https://github.com/jsundram/quartet-log/commit/94e24af5a5ae44d66116a84a4a3892ce7f5540f2" },
        { text: "add chord diagram network view", url: "https://github.com/jsundram/quartet-log/commit/afe6a6821d4da801b78234f0b788a3c01c000fd3" },
        { text: "color top musicians bars and network nodes by instrument", url: "https://github.com/jsundram/quartet-log/commit/42de1e3c339117a096145a35962533cc3bd9ffe4" },
        { text: "add names checkbox for graphs, fix tooltips on full screen", url: "https://github.com/jsundram/quartet-log/commit/bf8c8b2216bec651a43bc671f4ee94704a542c05" },
        { text: "expand touch targets on dashboard graph and chord views", url: "https://github.com/jsundram/quartet-log/commit/a5591e9e84b50126a785ded3d2fdd9697f7bfa58" }
      ]
    },
    {
      id: "w2",
      number: "02",
      range: "Jun 8–14",
      dates: { start: "2026-06-08", end: "2026-06-14" },
      status: "active",
      intensity: 3,
      title: "Two projects, two sittings.",
      summary: "Lobsters & Lighthouses went from initial commit to a Netlify deploy in a single day on Jun 8: a Maine day-trip handout carrying tide, daylight, route, and charging information, built as a self-contained page with a two-page PDF generated through Playwright. Most of its commits are print and typography work — font harmonisation between the daylight and tide insets, label sizing, background bleed to the page edge. haydn-lowdn started on Jun 12, plotting the range of each part across the Haydn quartets, and took its own concentrated day on the 13th, largely mobile Safari layout fixes and a snapshot workflow.",
      note: "Lobsters & Lighthouses was a whimsical project, and it is the one that made the case for PWAs as an everyday thing rather than a technique. That conclusion shows up in almost everything after it.",
      themes: ["travel", "music", "visual"],
      projects: [
        {
          name: "Lobsters & Lighthouses",
          repo: "lobsters-and-lighthouses",
          desc: "A Maine day-trip handout: tides, daylight, stops, and charging, computed from a config and published as one self-contained page.",
          url: "https://github.com/jsundram/lobsters-and-lighthouses"
        },
        {
          name: "Haydn Lowdn",
          repo: "haydn-lowdn",
          desc: "The range of each part across the Haydn quartets, plotted so it reads on a phone.",
          url: "https://github.com/jsundram/haydn-lowdn"
        },
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "Two commits this week: chord-diagram label room and rate-based calendar tooltips.",
          url: "https://github.com/jsundram/quartet-log"
        }
      ],
      evidence: [
        { text: "Initial commit — Maine day-trip handout build pipeline", url: "https://github.com/jsundram/lobsters-and-lighthouses/commit/537c4fc53468ab0d8beb6e77c007ee596f281b10" },
        { text: "Add 2-page PDF generation via Playwright + auto-scale", url: "https://github.com/jsundram/lobsters-and-lighthouses/commit/b23405a2b813966f298465d79e3e24bc3c62a4f2" },
        { text: "Wire up Netlify auto-deploy from main", url: "https://github.com/jsundram/lobsters-and-lighthouses/commit/df1ab39c6477f1f9e6a2d2a14fab3b58f0c70f43" },
        { text: "Generate share-sheet previews and rasterize handout to PNG", url: "https://github.com/jsundram/lobsters-and-lighthouses/commit/f8dce2140b0387292e9381ca02a018b09564aa23" },
        { text: "haydn-lowdn: initial commit", url: "https://github.com/jsundram/haydn-lowdn/commit/b8eeaab3aa6872f1751e4ae661c8e25bfcec19f7" },
        { text: "Pin bg-lines width in JS too (mobile Safari fix)", url: "https://github.com/jsundram/haydn-lowdn/commit/616b9259f1103be8bb79f4256d84b9793585d3e2" }
      ]
    },
    {
      id: "w3",
      number: "03",
      range: "Jun 15–21",
      dates: { start: "2026-06-15", end: "2026-06-21" },
      status: "active",
      intensity: 2,
      title: "One working day.",
      summary: "Six of the seven days have no commits. On Jun 17, quartet-log took PWA polish — pull-to-refresh in standalone mode, Apple meta tags and safe-area handling, auto-refresh on resume and on a five-minute foreground poll. haydn-lowdn got axes widened to include E6 and E7, an offset-bars toggle, and stars marking the range extremes.",
      note: "The empty days are playing, conversations with Google, and getting ready to travel to Europe. The Maine trip that Lobsters & Lighthouses was built for happens the following Monday.",
      themes: ["music", "platform"],
      projects: [
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "Standalone-mode PWA behaviour: pull-to-refresh, safe areas, refresh on resume.",
          url: "https://github.com/jsundram/quartet-log"
        },
        {
          name: "Haydn Lowdn",
          repo: "haydn-lowdn",
          desc: "Wider axes, an offset-bars toggle, and markers for the extremes of range.",
          url: "https://github.com/jsundram/haydn-lowdn"
        }
      ],
      evidence: [
        { text: "add pull-to-refresh for installed-PWA mode", url: "https://github.com/jsundram/quartet-log/commit/92d502afc5dd671ea5b458e0b3b3e63efd55bb17" },
        { text: "PWA standalone polish: Apple meta tags and safe-area handling", url: "https://github.com/jsundram/quartet-log/commit/b74c6a7edbeef97f2748e710da5df1b1464308d4" },
        { text: "auto-refresh data on resume and on a 5-minute foreground poll", url: "https://github.com/jsundram/quartet-log/commit/a71ef4a21911e529c611943173fac7d9a459ef97" },
        { text: "expand axis lines to include E6 and E7", url: "https://github.com/jsundram/haydn-lowdn/commit/ec587d8e5a91595d945d0677383e155d16e76dc2" },
        { text: "Add Offset Bars toggle, redesign toolbar", url: "https://github.com/jsundram/haydn-lowdn/commit/16639d00fa65d780d60246f2508eacaee6ddea61" },
        { text: "add stars for extremes", url: "https://github.com/jsundram/haydn-lowdn/commit/b0f9d2da4b160328e9bf6c6f2397006f37781245" }
      ]
    },
    {
      id: "w4",
      number: "04",
      range: "Jun 22–28",
      dates: { start: "2026-06-22", end: "2026-06-28" },
      status: "active",
      intensity: 4,
      title: "Three threads, then a fourth.",
      summary: "The Maine trip happens on Jun 22 and the week's commits start on the 24th. boccherini-quartet-data took two days of process work: Op32 and Op33 imports from IMSLP, an encoding template and HOWTO, content-change review tooling, CI that renders before/after comparisons for note corrections, and Ghostscript installed so LilyPond failures surface instead of passing silently. haydn-info-card moved from a printed card to an interactive D3 web card on GitHub Pages, with movement bars scaled by actual Spotify track durations — the same information working on more surfaces. AKM's first commit lands on Jun 28, a personal schedule app for the Lesachtal festival.",
      note: "quartet-chooser got one drive-by commit on Jun 27 modernising its update.py, then nothing until late July.",
      themes: ["music", "platform", "travel"],
      projects: [
        {
          name: "Boccherini Quartet Data",
          repo: "boccherini-quartet-data",
          desc: "IMSLP imports, an encoding HOWTO, content-change review tooling, and CI that renders before/after for note corrections.",
          url: "https://github.com/jsundram/boccherini-quartet-data"
        },
        {
          name: "Haydn Info Card",
          repo: "haydn-info-card",
          desc: "The printed card ported to an interactive D3 web page, with movement bars scaled by real track durations.",
          url: "https://github.com/jsundram/haydn-info-card"
        },
        {
          name: "AKM",
          repo: "AKM",
          desc: "First commits: a personal schedule app for the Lesachtal festival, offline from the start.",
          url: "https://github.com/jsundram/AKM"
        }
      ],
      evidence: [
        { text: "feat(lilypond): add content-change review tooling", url: "https://github.com/jsundram/boccherini-quartet-data/commit/433352544e751af5f2e6f2ec2394a9bd392798bd" },
        { text: "feat: CI-rendered before/after for note corrections", url: "https://github.com/jsundram/boccherini-quartet-data/commit/2f858530e3ce2e7794a7fd4b83429eadd7949497" },
        { text: "ci: install ghostscript + surface lilypond errors", url: "https://github.com/jsundram/boccherini-quartet-data/commit/4fbbec124234d06dac61f82ecfaac15d72335e18" },
        { text: "Add interactive web card (D3 periodic table) + GitHub Pages deploy", url: "https://github.com/jsundram/haydn-info-card/commit/cfe36e2d8a14dd72967f0d99a70af2b047d1ae5e" },
        { text: "Scale movement bars by exact Spotify track durations", url: "https://github.com/jsundram/haydn-info-card/commit/fabbaa7ab30a4f28e7aa0936d4ddc385c9da2bfe" },
        { text: "Initial commit: Lesachtal festival briefing PWA", url: "https://github.com/jsundram/AKM/commit/d0271986062ec0479d1b30ca1fab4d5cd93c7da3" }
      ]
    },
    {
      id: "w5",
      number: "05",
      range: "Jun 29–30",
      dates: { start: "2026-06-29", end: "2026-06-30" },
      status: "active",
      intensity: 5,
      title: "AKM snowballs.",
      summary: "Two days, thirty-nine AKM commits, twenty-eight of them on Jun 29. A roster page with sortable columns and instruments collapsed into score order rather than alphabetical. A village map with relief and aerial layers, a live location dot with an accuracy ring, tappable buildings resolving to OSM names and addresses, and venue pins carrying schedule room codes. Weather re-sourced from GeoSphere Austria's AROME model with an Open-Meteo fallback. What was a personal schedule app on Jun 28 was most of a festival companion by the 30th.",
      note: "Nothing forced this. It started small, and it snowballed because it was interesting.",
      themes: ["field", "travel", "platform"],
      projects: [
        {
          name: "AKM",
          repo: "AKM",
          desc: "Roster, village map, live location, venue pins, and Austrian-model weather — built in two days.",
          url: "https://github.com/jsundram/AKM"
        },
        {
          name: "Haydn Enthusiasts",
          repo: "haydnenthusiasts.org",
          desc: "Download and interactive calls to action for the info card.",
          url: "https://github.com/jsundram/haydnenthusiasts.org"
        }
      ],
      evidence: [
        { text: "Add Roster and village Map pages (footer-linked, offline-first)", url: "https://github.com/jsundram/AKM/commit/8ec44e8aebbfacf1eec47161c3681e9a0ef937e8" },
        { text: "Roster: sort instruments in score order, not alphabetically", url: "https://github.com/jsundram/AKM/commit/25212ed761a2d0aa0dbdfecd0fcf9728c24eea82" },
        { text: "Map: relief + aerial layers, labels, mobile gestures, fresher caching", url: "https://github.com/jsundram/AKM/commit/f6f71e28b71d6e69bf982fe049c08177860967bf" },
        { text: "Map: add live \"you are here\" blue location dot", url: "https://github.com/jsundram/AKM/commit/2bc37e027db1e559e34688b18f3332f006833cb6" },
        { text: "Weather: source from GeoSphere Austria (AROME) with Open-Meteo fallback", url: "https://github.com/jsundram/AKM/commit/c46f6fbb26a4714ac0ac704348384826ffe297e8" },
        { text: "Add prominent download + interactive CTA buttons to info card page", url: "https://github.com/jsundram/haydnenthusiasts.org/commit/52412f487b0ba1ad6fc2d43bb945bd725098a476" }
      ]
    }
  ],
  threads: [
    {
      title: "AKM repo restructure into feature folders",
      repo: "AKM",
      status: "parked",
      note: "Written up on Jun 29 and deliberately not executed. The app grew organically and the restructure is good follow-up work, but it is not urgent — it waits until AKM is no longer under heavy use and the shape of 2027 is clearer.",
      url: "https://github.com/jsundram/AKM/commit/725f7acf9c59b0d37f0e102a689ffabe0789c239"
    },
    {
      title: "Poster-size dark-background Haydn card",
      repo: "haydn-info-card",
      status: "parked",
      note: "A WIP variant committed on Jun 27 and not picked up since. Still wanted — this one is waiting for time rather than for a decision.",
      url: "https://github.com/jsundram/haydn-info-card/commit/9248354627259768c8d845e9b2e2ec88f5e1bf63"
    }
  ]
};
