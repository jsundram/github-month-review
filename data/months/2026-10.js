window.REVIEW_MONTHS = window.REVIEW_MONTHS || {};
window.REVIEW_MONTHS["2026-10"] = {
  id: "2026-10",
  label: "October 2026",
  status: "active",
  inProgress: true,
  coverage: {
    start: "2026-10-01",
    end: "2026-10-17"
  },
  lede: "The edition of Boccherini's Op. 48: 298 of the month's 334 commits are the edition and the manuscript labeler built to feed it. Four of the six quartets are encoded and checked — No. 1 by hand, then Nos. 3, 2 and 5 through an /encode pipeline that went through five versions in ten days.",
  metrics: [
    {
      value: "8 of 12",
      label: "movements encoded and checked",
      note: "Four of Op. 48's six quartets, two movements each. The owner's count, matched against the commits"
    },
    {
      value: "4,400",
      label: "bar lines labelled",
      note: "About, across 170 pages of 8 manuscript sources; 78% of detected bar lines kept as detected. From the labeler, as the owner reported it"
    },
    {
      value: "7h → 2½h",
      label: "owner's time per quartet",
      note: "No. 2, then No. 5, by the pipeline's count (3⅓h for No. 5 by the review page's activity log). The goal is one hour"
    },
    {
      value: "334",
      label: "commits",
      note: "Across 8 repos, one of them private, Oct 1–17"
    }
  ],
  weeks: [
    {
      id: "w1",
      number: "01",
      range: "Oct 1–4",
      dates: {
        start: "2026-10-01",
        end: "2026-10-04"
      },
      status: "active",
      intensity: 4,
      title: "No. 1 by hand, and a labeler.",
      summary: "The edition began bar by bar: No. 1's first movement was encoded by hand from the Berlin manuscript (D-B KHM 602), with a proof page that sets each manuscript bar above its engraved bar, rebuilt on every save, and a make watch that chimes when a build finishes. No. 2 was started on Oct 2. Alongside it manuscript-labeler went from a spec to a working editor in two days: a web app for marking every staff and bar line on a manuscript page, with detection tuned against the pages already reviewed, so the manuscript can be cut into bars and the bar counts checked against the LilyPond skeleton. Unrelated to the edition, boccherini-sources landed as one commit — a census of Boccherini quartet sources with its tooling and an index — and quartet-log's sitting view began saying when each piece was last played.",
      themes: [
        "music",
        "visual"
      ],
      projects: [
        {
          name: "Boccherini Op. 48",
          repo: "boccherini-opus-48",
          desc: "No. 1, movement I, encoded by hand against a manuscript-over-engraving proof.",
          url: "https://github.com/jsundram/boccherini-opus-48",
          image: {
            src: "assets/projects/boccherini-opus-48.jpg",
            alt: "The edition's review page for Op. 48 No. 5, Larghetto: each part's manuscript above the engraving, bar line under bar line, under a map of the movement's open CHECKs."
          }
        },
        {
          name: "Manuscript Labeler",
          repo: "manuscript-labeler",
          desc: "A web app for marking staves and bar lines on manuscript pages, built for the edition.",
          url: "https://github.com/jsundram/manuscript-labeler",
          image: {
            src: "assets/projects/manuscript-labeler.jpg",
            alt: "Five strips of handwritten manuscript staves, each bar line found by a detector marked with its confidence."
          }
        },
        {
          name: "Boccherini sources",
          repo: "boccherini-sources",
          desc: "A census of the quartets' sources, in one commit.",
          url: "https://github.com/jsundram/boccherini-sources"
        },
        {
          name: "Quartet Log",
          repo: "quartet-log",
          desc: "When each piece in a sitting was last played.",
          url: "https://github.com/jsundram/quartet-log",
          image: {
            src: "assets/projects/quartet-log.jpg",
            alt: "Quartet Log's setup screen, asking for the URL of a published Google Sheet."
          }
        }
      ],
      evidence: [
        {
          text: "Op48-1 mvt I: bars 1-4, all parts",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/c935f106beb532c34a5e94c1914feb134a39af89"
        },
        {
          text: "Proof part: each manuscript bar above its engraved bar (make proof-Op48-1)",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/f2725df1b52b3e7e5d38008875abef3cc515ee31"
        },
        {
          text: "Initial spec, staff and bar-line detector, and prototype reading aids",
          url: "https://github.com/jsundram/manuscript-labeler/commit/f3f29638305a2f3a45cf6d2a312412731aef9050"
        },
        {
          text: "Working labeler: server, editor, labels format and better detection",
          url: "https://github.com/jsundram/manuscript-labeler/commit/507fdc35e8fc204deb96a4110c2fdd5605797e77"
        },
        {
          text: "Boccherini quartet sources: the census, its tooling, and the index",
          url: "https://github.com/jsundram/boccherini-sources/commit/194aafb44addaece0bbd88b1640d2e88e0fd680d"
        },
        {
          text: "Say when each piece in the sitting was last played",
          url: "https://github.com/jsundram/quartet-log/commit/740e967a424c367c4b790be6d99fd90a3336de7c"
        }
      ]
    },
    {
      id: "w2",
      number: "02",
      range: "Oct 5–11",
      dates: {
        start: "2026-10-05",
        end: "2026-10-11"
      },
      status: "active",
      intensity: 5,
      title: "/encode, and a bar-line bake-off.",
      summary: "No. 1 was checked against its manuscript on Oct 6 — the last quartet done without a pipeline. On Oct 7 /encode was built from a written design, and its first real run, on No. 3's second movement the next day, came with a post-mortem. In the labeler a bake-off compared bar-line detectors across three copyists' hands; the result is a vote of three — a rule-based detector filtered by a learned classifier, and two YOLO models fine-tuned on the owner's labelled pages — each with a model card recording how it was trained and how it performs. Finding staves by segmentation and with oemer were both negative results, and the Zeus handwritten-music reader, unmodified, counted the bars but misread the clefs. Outside the edition, boccherini-haydn-timeline was retitled \"Two Lives in Quartets\" and redesigned with serif type and print formats, mbta-glx gained a figures page, and quartet-chooser and quartets.boccherini.org added recordings of G 230 — which is Op. 48 No. 5.",
      themes: [
        "music",
        "infra"
      ],
      projects: [
        {
          name: "Boccherini Op. 48",
          repo: "boccherini-opus-48",
          desc: "No. 1 checked; /encode built and run for the first time.",
          url: "https://github.com/jsundram/boccherini-opus-48"
        },
        {
          name: "Manuscript Labeler",
          repo: "manuscript-labeler",
          desc: "A bar-line bake-off, a vote of three detectors, and model cards.",
          url: "https://github.com/jsundram/manuscript-labeler"
        },
        {
          name: "Boccherini–Haydn timeline",
          repo: "boccherini-haydn-timeline",
          desc: "Retitled \"Two Lives in Quartets\" and redesigned for print.",
          url: "https://github.com/jsundram/boccherini-haydn-timeline",
          image: {
            src: "assets/projects/boccherini-haydn-timeline.jpg",
            alt: "\"Two Lives in Quartets\": Haydn's quartets on the left and Boccherini's on the right, one bar per opus on a shared timeline from 1760 to 1805."
          }
        },
        {
          name: "MBTA GLX",
          repo: "mbta-glx",
          desc: "A figures page served from the backend.",
          url: "https://github.com/jsundram/mbta-glx",
          image: {
            src: "assets/projects/mbta-glx.jpg",
            alt: "The Magoun Square board, headed by two notices of upcoming Green Line suspensions."
          }
        }
      ],
      evidence: [
        {
          text: "Op48-1 Violin I, movement I: checked by Jason against D-B KHM 602",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/73d9b820dcb22a80bdbe9988c500d2f8a7b5fa42"
        },
        {
          text: "The encoding pipeline: /encode, built from docs/encode-pipeline.md",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/d7fbf1573a3f4d579852e1e1e8806db7b235592a"
        },
        {
          text: "Crosscheck rework, measured; post-mortem of the first /encode run",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/eceabaf58ce4f1e274648e38f75aae2f30386be2"
        },
        {
          text: "Bar-line bake-off: three hands, new detectors, checkpoints judged",
          url: "https://github.com/jsundram/manuscript-labeler/commit/4e718f63ed0d2de45ea94e90a2d2c3cd088441e3"
        },
        {
          text: "Model cards for the bar-line finders",
          url: "https://github.com/jsundram/manuscript-labeler/commit/a874d1e013db6ef25856f68e0cbb6fd51226c0a5"
        },
        {
          text: "Bake-off: staves by segmentation and oemer, two negative results",
          url: "https://github.com/jsundram/manuscript-labeler/commit/270f0ac81150f438126dcd5f8bc217e408fe738b"
        },
        {
          text: "Zeus zero-shot: counts our bars, misreads our clefs",
          url: "https://github.com/jsundram/manuscript-labeler/commit/3e431a1b22dc864f49afed725fd8913aba52c250"
        },
        {
          text: "Retitle to \"Two Lives in Quartets\"; tint quartettini, draw life-lines",
          url: "https://github.com/jsundram/boccherini-haydn-timeline/commit/f0cac8aab02680b5d7f952c3c5f22053ff19dfac"
        },
        {
          text: "data: two recordings for Boccherini G230",
          url: "https://github.com/jsundram/quartet-chooser/commit/4b9142f534e9797ec56e924c1157f80d12c291e8"
        }
      ]
    },
    {
      id: "w3",
      number: "03",
      range: "Oct 12–18",
      dates: {
        start: "2026-10-12",
        end: "2026-10-18"
      },
      status: "active",
      intensity: 5,
      title: "Three quartets, and /encode v2 to v5.",
      summary: "/encode went from v2 to v5 in four days, each version written from the post-mortem of the movement before it. By v5 it runs like this. With the bar lines labelled and the bar counts matching the LilyPond skeleton, an agent maps the movement — repeats, restatements, and \"twins\", bars that should read alike — and asks the owner at most three questions about how this copyist draws marks. Four readers, one per part, read every bar; a doubt becomes Homework for the owner only if its answer would settle at least three other bars, which has meant 0 to 10 questions a movement. Scripts then compare each part with the other three, measure note heads, and compare twins; a Zeus reader fine-tuned on Boccherini objects wherever it reads a pitch, rhythm or accidental differently; an agent must settle every flag with a measurement; and class checks sample 14 kinds of reader error — slur ends, accidentals, unisons, grace notes, dots against wedges — in each part, where one wrong sample opens the whole class for up to three rounds. A confirmed error is fixed in its bar, its twins, and every figure like it. The owner then reviews on a page that sets each part's manuscript over the engraving, bar line under bar line, with a map of the movement and MIDI playback, answers each remaining CHECK, and in Recheck sees only the lines the agents changed afterwards. Through it: No. 3's first movement on Oct 14, then compared with a second manuscript source (F-Pn Vma ms 1067-1); No. 2 on Oct 15–16; No. 5, started on Oct 16 and encoded by Oct 17. Outside the edition, quartets.boccherini.org gained a help guide and three more publishers' parts.",
      note: "Oct 11–13 went to music and a sequel to the Lobsters and Lighthouses trip, this time to Gloucester.",
      themes: [
        "music",
        "infra"
      ],
      projects: [
        {
          name: "Boccherini Op. 48",
          repo: "boccherini-opus-48",
          desc: "Nos. 3, 2 and 5 encoded; /encode v2 to v5; the owner's time logged per bar.",
          url: "https://github.com/jsundram/boccherini-opus-48"
        },
        {
          name: "Manuscript Labeler",
          repo: "manuscript-labeler",
          desc: "Zeus fine-tuned on Boccherini, with training pairs built from Philhar's encodings.",
          url: "https://github.com/jsundram/manuscript-labeler"
        },
        {
          name: "quartets.boccherini.org",
          repo: "quartets.boccherini.org",
          desc: "A help guide, and parts from three more publishers.",
          url: "https://github.com/jsundram/quartets.boccherini.org",
          image: {
            src: "assets/projects/quartets.boccherini.org.jpg",
            alt: "Luigi Boccherini (1743–1805) – 91 String Quartets: a grid of cards, one per quartet, giving its key, in rows by opus."
          }
        }
      ],
      evidence: [
        {
          text: "/encode: class checks in place of the blind checks (v2, item A)",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/c335d4976da32d1b8ec305274689291f700af34e"
        },
        {
          text: "Op48-3: where F-Pn Vma ms 1067-1 differs from F-Po RES 507 (14)",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/de30bad585763df4a18f8991ec0e8289a4a697f4"
        },
        {
          text: "Op48-2 I: all four parts, read from D-B KHM 603 and checked",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/d2b388859f73aa969aad535d9eb39d1f991058e6"
        },
        {
          text: "The person's time from what their tools record: activity.py",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/4dee3ac3e98ae5d2d53918dbf130479c09b7b081"
        },
        {
          text: "/encode v4: conventions first, twins read apart, marks by family, one pass",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/e4fed5d7c9dbef03567474c6e14fd1b1b68e5a2a"
        },
        {
          text: "Op48-2 II encoded (/encode v4): one pass by the person, nothing to recheck",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/4a5724afc6949fbd904dd05e5d502049f3009b45"
        },
        {
          text: "/encode v5: Zeus checks the read, repairs go to the person first",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/f0dbb8f3e458ee090b682f8f9026833ab60757ce"
        },
        {
          text: "Op48-5 II encoded (/encode v5): 9.2 person-minutes per 100 bar-parts",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/e1630100179b91a0a132711d8b6553f3770ce664"
        },
        {
          text: "Op48-5 mvt I: all four parts from F-Po RES 507 (17)",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/bf1fedf228776cc92a4d130ddcd4c17c86d9f19e"
        },
        {
          text: "Training pairs without labelling, from Philhar's encodings",
          url: "https://github.com/jsundram/manuscript-labeler/commit/1f76c6dfd4c54b466932b500e1b22683a10188af"
        },
        {
          text: "Add \"?\" help guide: a tour of the table and an annotated card anatomy",
          url: "https://github.com/jsundram/quartets.boccherini.org/commit/322b4d17f205feeb98ad7c0c493d2a664dab10e7"
        }
      ]
    },
    {
      id: "w4",
      number: "04",
      range: "Oct 19–25",
      dates: {
        start: "2026-10-19",
        end: "2026-10-25"
      },
      status: "nodata",
      note: "Not yet happened when the snapshot was taken."
    },
    {
      id: "w5",
      number: "05",
      range: "Oct 26–31",
      dates: {
        start: "2026-10-26",
        end: "2026-10-31"
      },
      status: "nodata",
      note: "Not yet happened when the snapshot was taken."
    }
  ],
  threads: [
    {
      title: "A quartet in one hour",
      repo: "boccherini-opus-48",
      status: "active",
      note: "The goal for /encode is one hour of the owner's time per quartet. No. 2 took about 7 hours; No. 5 about 2½ by the pipeline's count, 3⅓ by the review page's activity log. Agent cost per movement fell from about 19M tokens on the first run to about 4M. Building /encode has itself taken much of the month, and a skilled LilyPond engraver would probably be faster without any of it — but would not produce the aligned score, manuscript over engraving.",
      url: "https://github.com/jsundram/boccherini-opus-48"
    },
    {
      title: "Reading the manuscripts with off-the-shelf tools",
      repo: "manuscript-labeler",
      status: "dropped",
      note: "Asking Claude to read the staves directly did not work, and neither did oemer. Zeus, unmodified, misread the clefs; it became useful only after fine-tuning on 2,568 staves — 322 from this edition, the rest from Philhar's encodings of Op. 2–33 — reading 65% of a held-out movement's bars exactly, against 42% before. The labeler's model cards record how each detector was trained and how it performs.",
      url: "https://github.com/jsundram/manuscript-labeler/commit/270f0ac81150f438126dcd5f8bc217e408fe738b"
    }
  ]
};
