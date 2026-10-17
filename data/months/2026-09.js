window.REVIEW_MONTHS = window.REVIEW_MONTHS || {};
window.REVIEW_MONTHS["2026-09"] = {
  id: "2026-09",
  label: "September 2026",
  status: "active",
  coverage: {
    start: "2026-09-01",
    end: "2026-09-30"
  },
  lede: "A split month. Musical guests stayed for the first half, when a remake of a 2014 fisheye chart of string-quartet composers took most of the commits. A light third week went to playing; the fourth built a train notifier in four days; the last day brought the first commits of an edition of Boccherini's Op. 48.",
  metrics: [
    {
      value: "318",
      label: "commits",
      note: "Across 10 repos, one of them private; 26 of the month's 30 days have commits"
    },
    {
      value: "1,000",
      label: "pieces played in a year",
      note: "Ensemble pieces in the trailing 365 days, crossed on Sep 11. From the owner's playing log, not GitHub"
    },
    {
      value: "131",
      label: "quartet-composers commits",
      note: "41% of the month. Many are rounds of review: one issue took six on Sep 8, the IMSLP crawl seven on Sep 12–13"
    }
  ],
  weeks: [
    {
      id: "w1",
      number: "01",
      range: "Sep 1–6",
      dates: {
        start: "2026-09-01",
        end: "2026-09-06"
      },
      status: "active",
      intensity: 4,
      title: "A tuner, and the fisheye chart remade.",
      summary: "lissajous-tuner started on Sep 3 from pwa-starter: a tuner for violin, viola, and cello that shows tuning error as the rotation of a Lissajous figure rather than a needle, with an audio worklet, a headless test harness, and versions lt-v4 through lt-v13 deployed over two days. On Sep 4 real violin recordings closed two open DSP questions and exposed an octave-detection hole. The same day quartet-composers began, after a friend asked to see the 2014 fisheye chart: the original warped both axes under the cursor, and the remake has three views — a scatter, a swarm, and a circular lens over axes that do not move — over a re-scrape of 884 composers with real dates and twelve-month median Wikipedia page views. quartet-chooser's share card was redesigned on Sep 1, and maestoso-127 got share cards of its own.",
      note: "Musical guests stayed through the first half of the month, and those were the month's two busiest weeks of commits. The socializing was overstimulating; focused work was the retreat from it.",
      themes: [
        "music",
        "visual",
        "platform"
      ],
      projects: [
        {
          name: "Lissajous Tuner",
          repo: "lissajous-tuner",
          desc: "A string tuner that shows error as rotation, built and deployed in two days.",
          url: "https://github.com/jsundram/lissajous-tuner",
          image: {
            src: "assets/projects/lissajous-tuner.jpg",
            alt: "The Lissajous Tuner before it starts listening: Violin, Viola and Cello tabs, a Start listening button, and string pins for G3, D4, A4 and E5."
          }
        },
        {
          name: "Quartet Composers",
          repo: "quartet-composers",
          desc: "The 2014 fisheye chart, rebuilt as three views on pwa-starter.",
          url: "https://github.com/jsundram/quartet-composers",
          image: {
            src: "assets/projects/quartet-composers.jpg",
            alt: "String Quartet Composers, Fame view: a histogram of Wikipedia readership above a scatter of 790 composers."
          }
        },
        {
          name: "Quartet Chooser",
          repo: "quartet-chooser",
          desc: "A redesigned share card, and a gate that catches it going stale.",
          url: "https://github.com/jsundram/quartet-chooser",
          image: {
            src: "assets/projects/quartet-chooser.jpg",
            alt: "Quartet Roulette's home page: a grid of illustrated composer portraits."
          }
        },
        {
          name: "Maestoso 127",
          repo: "maestoso-127",
          desc: "Open Graph tags and a data-driven share card.",
          url: "https://github.com/jsundram/maestoso-127",
          image: {
            src: "assets/projects/maestoso-127.jpg",
            alt: "Opus 127: Maestoso — the opening bars in score above semicircles comparing recorded performances' timings."
          }
        }
      ],
      evidence: [
        {
          text: "Worklet, DSP, and the headless test harness — 32/32 green",
          url: "https://github.com/jsundram/lissajous-tuner/commit/2e9817ede541a72dec505a22e21b4920e940e47d"
        },
        {
          text: "Close the bwCoef and cents-excursion open questions with real violin recordings",
          url: "https://github.com/jsundram/lissajous-tuner/commit/9b6b800b06f363bce1cdc6ffdc21d3345e49f497"
        },
        {
          text: "Remake the 2014 quartet-composers fisheye chart",
          url: "https://github.com/jsundram/quartet-composers/commit/1f3766c0453e1f09d3bb2916fff1c9381fec90bf"
        },
        {
          text: "Re-scrape everything: 884 composers, real dates, 12-month median views",
          url: "https://github.com/jsundram/quartet-composers/commit/5bdc63fded21792f0243b94005bb2f7abe4adf91"
        },
        {
          text: "Re-encode the chart around the argument: output against attention",
          url: "https://github.com/jsundram/quartet-composers/commit/6a028f43606a956db800b9f9dbd59a7311cb1777"
        },
        {
          text: "A playground for the site-wide share card, and a shorter header (#39)",
          url: "https://github.com/jsundram/quartet-chooser/commit/f763a6c01739ebc083815fe301ef918d5f5fd9c7"
        },
        {
          text: "add Open Graph tags and a data-driven share card for viz/",
          url: "https://github.com/jsundram/maestoso-127/commit/6ebb1d6f08605ff0ffb9739578314a621e889e08"
        }
      ]
    },
    {
      id: "w2",
      number: "02",
      range: "Sep 7–13",
      dates: {
        start: "2026-09-07",
        end: "2026-09-13"
      },
      status: "active",
      intensity: 5,
      title: "quartet-composers, review after review.",
      summary: "88 commits on quartet-composers. What was added: a readership sparkline drawn from the whole page-view history, a curated set under the Women filter, page views counted under the title each article actually had at the time, the chart tools redrawn as glyphs in the axis-title band, and IMSLP's string-quartet listings joined to the composer roster. Most of the rest is review: the page-view fix went through six rounds on Sep 8 and the IMSLP crawl through seven on Sep 12–13, and the browser test suite went into CI, came back out, and went back in. quartet-log fixed its catalog picker on a phone and began recording a part change as a column swap. lissajous-tuner's last commit of the month, on Sep 10, added an editable reference A.",
      note: "The coding model kept writing long prose into comments and docs that later went stale, and each review pass found more of it to fix. That was the frustrating part of the month.",
      themes: [
        "music",
        "visual"
      ],
      projects: [
        {
          name: "Quartet Composers",
          repo: "quartet-composers",
          desc: "Readership sparklines, the Women filter, page views under historical titles, and IMSLP joined in.",
          url: "https://github.com/jsundram/quartet-composers"
        },
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "Phone fixes to the catalog picker; part changes written as column swaps.",
          url: "https://github.com/jsundram/quartet-log",
          image: {
            src: "assets/projects/quartet-log.jpg",
            alt: "Quartet Log's setup screen, asking for the URL of a published Google Sheet."
          }
        },
        {
          name: "Lissajous Tuner",
          repo: "lissajous-tuner",
          desc: "An editable reference A and an in-tune colour, then nothing further this month.",
          url: "https://github.com/jsundram/lissajous-tuner"
        }
      ],
      evidence: [
        {
          text: "Fill a curated set of women under the Women filter (#7)",
          url: "https://github.com/jsundram/quartet-composers/commit/9e882aef95a58ee6373650debf14aabc870eba88"
        },
        {
          text: "Count page views under the title the article was actually at (#23)",
          url: "https://github.com/jsundram/quartet-composers/commit/fdb7b2debb4438265090e86ec6111c6bb3016954"
        },
        {
          text: "Address sixth review: fix the fixes, and take the count I said I would leave (#23)",
          url: "https://github.com/jsundram/quartet-composers/commit/ba32fcafb41d7c89c5a29db58585bc8c83ce5098"
        },
        {
          text: "Run the browser suite in CI, and let the branch gate ablate against it",
          url: "https://github.com/jsundram/quartet-composers/commit/6e4809c68b924ea71987acf1ddbf19b6d3a9e788"
        },
        {
          text: "Join IMSLP's string quartets to the roster, and two pages that grade the join",
          url: "https://github.com/jsundram/quartet-composers/commit/dce5a99bf6d71988db81efc6c3754c71e5d39549"
        },
        {
          text: "Answer the seventh review: stop enumerating reply shapes, and three more figures",
          url: "https://github.com/jsundram/quartet-composers/commit/2de7c51d4e9282a8b773db810a05979f8b672ddb"
        },
        {
          text: "stop the catalog picker collapsing the log form on a phone",
          url: "https://github.com/jsundram/quartet-log/commit/1bec49289a94a132746cf31253827942cdc838c3"
        },
        {
          text: "Editable reference A, an in-tune colour, and the figure picker on the main screen",
          url: "https://github.com/jsundram/lissajous-tuner/commit/5833c415ad87ce32d66fc61dac9a3da8282c292f"
        }
      ]
    },
    {
      id: "w3",
      number: "03",
      range: "Sep 14–20",
      dates: {
        start: "2026-09-14",
        end: "2026-09-20"
      },
      status: "active",
      intensity: 2,
      title: "Cutting the prose back.",
      summary: "A light week; the empty days went to playing Boccherini and other music. quartet-composers put IMSLP on the page beside Wikipedia, then spent most of its commits removing words: comments and docs that no test could fail, an audit of numbers that reach prose, a prose ratio measured in one place and checked on every diff, and a pre-commit hook that is no longer opt-in. The swarm view was recoloured by quartet count. quartet-log trimmed its CLAUDE.md to what the code does not already say, and its log form now takes what each person played and places them.",
      themes: [
        "music",
        "writing"
      ],
      projects: [
        {
          name: "Quartet Composers",
          repo: "quartet-composers",
          desc: "IMSLP on the page, then gates against prose that cannot be checked.",
          url: "https://github.com/jsundram/quartet-composers"
        },
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "A log form that takes what each person played.",
          url: "https://github.com/jsundram/quartet-log"
        }
      ],
      evidence: [
        {
          text: "Put IMSLP on the page: one column, one pill, and a pipeline that runs the other way (#61)",
          url: "https://github.com/jsundram/quartet-composers/commit/df27bbf78aefa115ffe115fa876ca0e2551b493a"
        },
        {
          text: "Cut the comments and docs that could not go red; fix the gates that let them through (#67)",
          url: "https://github.com/jsundram/quartet-composers/commit/4a6e87443c59d45e111bd5a86d0ed31d0ff1f4ce"
        },
        {
          text: "Measure the prose ratio in one place, and check every diff against it (#77)",
          url: "https://github.com/jsundram/quartet-composers/commit/b660918bb2a75569f816137e52abe6a85b543d84"
        },
        {
          text: "Cut the prose volume, and stop the pre-commit hook being opt-in (#115)",
          url: "https://github.com/jsundram/quartet-composers/commit/149510a538685f7ccb6bafba8afc20a0049b1b4b"
        },
        {
          text: "Colour the swarm by quartet count, not lifespan (#94)",
          url: "https://github.com/jsundram/quartet-composers/commit/e1c04987e6b7f1e29bb3c9ea8db9e833e246f30a"
        },
        {
          text: "Trim CLAUDE.md to what the code doesn't already say (#15)",
          url: "https://github.com/jsundram/quartet-log/commit/c2487a2d89fe6d84424b38e4804718f6050d1406"
        },
        {
          text: "Log form: say what each person played, let the form place them (#47)",
          url: "https://github.com/jsundram/quartet-log/commit/59f7403c4b35cef24649ed9fbb3ae825871c6a90"
        }
      ]
    },
    {
      id: "w4",
      number: "04",
      range: "Sep 21–27",
      dates: {
        start: "2026-09-21",
        end: "2026-09-27"
      },
      status: "active",
      intensity: 5,
      title: "A train notifier in four days.",
      summary: "mbta-glx started on Sep 24: inbound Green Line arrival times at Magoun Square with error bars, and a phone notification that says when to leave. The owner does not commute, but missing a train is costly on the days one is taken, and no existing service notified well enough. The first day built the model, backtests, a live service, an archiver, and ntfy notifications. Sep 26, with 61 commits the month's busiest day, added a live board with a line map that draws trains as cars labelled with their real car numbers, MBTA's own skip and cancellation markers, a replay harness, archive compaction to delta parquet, and the prediction function ported to JavaScript so the board runs as a static page. quartet-log's how-to was rewritten on Sep 22 in four parts split by reader, and on Sep 24 pwa-starter's update check began comparing the running bundle to the server rather than the cache key.",
      themes: [
        "travel",
        "infra",
        "platform"
      ],
      projects: [
        {
          name: "MBTA GLX",
          repo: "mbta-glx",
          desc: "Green Line arrival times at Magoun Square, with error bars and a push that says when to leave.",
          url: "https://github.com/jsundram/mbta-glx",
          image: {
            src: "assets/projects/mbta-glx.jpg",
            alt: "The Magoun Square board, headed by two notices of upcoming Green Line suspensions."
          }
        },
        {
          name: "pwa-starter",
          repo: "pwa-starter",
          desc: "The update check reads the running bundle; sw-lint gains a check against the base branch.",
          url: "https://github.com/jsundram/pwa-starter",
          image: {
            src: "assets/projects/pwa-starter.jpg",
            alt: "pwa-starter's placeholder shell: an APP header and a box asking to be replaced."
          }
        },
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "The how-to, rewritten in four parts by who is reading.",
          url: "https://github.com/jsundram/quartet-log"
        }
      ],
      evidence: [
        {
          text: "Magoun inbound ETA service: model, backtests, live service, archiver",
          url: "https://github.com/jsundram/mbta-glx/commit/67d61852726a6fc08264068a774b676bf1354a31"
        },
        {
          text: "Phase 5a: ntfy notifier with brief, triggers, and tap-back commands",
          url: "https://github.com/jsundram/mbta-glx/commit/0b4a077987a33adbd589347709eebcea0a866b0d"
        },
        {
          text: "Draw trains as cars labelled with their real car number",
          url: "https://github.com/jsundram/mbta-glx/commit/db1ffd1e085cc374f6c2712957e0e578d1014b55"
        },
        {
          text: "Add a replay harness; the quantile turns out not to be the lever",
          url: "https://github.com/jsundram/mbta-glx/commit/be6e7262d2925411989da40966636a9c4b66bed7"
        },
        {
          text: "Switch compaction to delta parquet: 7.9x, and directly queryable",
          url: "https://github.com/jsundram/mbta-glx/commit/1121ca4adcaa2ab60cedcb15cdd4e16c13c67ea8"
        },
        {
          text: "M2: the static board, verified in a browser from file://",
          url: "https://github.com/jsundram/mbta-glx/commit/e38dd1b15f0b7d8afed326f3bae9134ad8e3f959"
        },
        {
          text: "Compare the RUNNING bundle to the server, not the cache key (app-v8)",
          url: "https://github.com/jsundram/pwa-starter/commit/cef3cd21afb8883d7cfb89f13178ce4344560dc8"
        },
        {
          text: "Rewrite the how-to as four parts, split by who is reading",
          url: "https://github.com/jsundram/quartet-log/commit/f1f51bea6af5b68c84b85ddd67212681dffdceb8"
        }
      ]
    },
    {
      id: "w5",
      number: "05",
      range: "Sep 28–30",
      dates: {
        start: "2026-09-28",
        end: "2026-09-30"
      },
      status: "active",
      intensity: 1,
      title: "Opus 48 begins.",
      summary: "On Sep 30 boccherini-opus-48 started in a private repo: a new edition of Boccherini's six Quartettini, Op. 48 (1794), which have never been published, engraved in LilyPond from the manuscripts. The first commits set up the first quartet's files on the layout of Philhar's encodings of the earlier Boccherini quartets, renamed into English, with the manuscript covers and a setup guide for collaborators. Otherwise one commit gave the mbta-glx board its own origin, and one was a new warp envelope for somerville-typemap.",
      note: "The repo stays private until the edition is finished, so its links open only for collaborators.",
      themes: [
        "music"
      ],
      projects: [
        {
          name: "Boccherini Op. 48",
          repo: "boccherini-opus-48",
          desc: "A first edition of the six Quartettini, engraved from the manuscripts. Private until finished.",
          url: "https://github.com/jsundram/boccherini-opus-48",
          image: {
            src: "assets/projects/boccherini-opus-48.jpg",
            alt: "The edition's review page for Op. 48 No. 5, Larghetto: each part's manuscript above the engraving, bar line under bar line, under a map of the movement's open CHECKs."
          }
        },
        {
          name: "MBTA GLX",
          repo: "mbta-glx",
          desc: "The board moved to its own origin.",
          url: "https://github.com/jsundram/mbta-glx"
        },
        {
          name: "Somerville Typemap",
          repo: "somerville-typemap",
          desc: "One commit: version 7 of the warp envelope.",
          url: "https://github.com/jsundram/somerville-typemap",
          image: {
            src: "assets/projects/somerville-typemap.jpg",
            alt: "Somerville neighbourhood names warped to fill the shapes of their areas — Ball Square, Davis Square, Magoun Square and others."
          }
        }
      ],
      evidence: [
        {
          text: "Starting the first edition of Opus 48",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/fa9b991b1765c9429d0c870b54904f100376b701"
        },
        {
          text: "Switch to English note names, add manuscript covers, trim README",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/6f722ccf8250584d3b7eddd2903bdc73871d2ed4"
        },
        {
          text: "Give the board its own origin instead of paths on a shared host",
          url: "https://github.com/jsundram/mbta-glx/commit/56dcd827cb90410b1d14235bc92c77d8e882ae4a"
        },
        {
          text: "warp: envelope v7 — HILL flip, baseline-step cap, stretch 3.0, region size ratio",
          url: "https://github.com/jsundram/somerville-typemap/commit/56a9d103e79c6807e8f740c59c5e0e093a7d5cfb"
        }
      ]
    }
  ],
  threads: [
    {
      title: "Lissajous Tuner, parked",
      repo: "lissajous-tuner",
      status: "parked",
      note: "It works. It needs more before it is more than good to look at. Last commit Sep 10.",
      url: "https://github.com/jsundram/lissajous-tuner"
    }
  ]
};
