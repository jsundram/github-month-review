window.REVIEW_MONTHS = window.REVIEW_MONTHS || {};
window.REVIEW_MONTHS["2026-10"] = {
  id: "2026-10",
  label: "October 2026",
  status: "active",
  coverage: {
    start: "2026-10-01",
    end: "2026-10-31"
  },
  lede: "The edition of Boccherini's Op. 48: 579 of the month's 683 commits are the edition and the manuscript labeler built to feed it. All six quartets are now encoded from manuscript — No. 1 by hand, the rest through an /encode pipeline — and on Oct 28 a rehearsal read from them to find what was still wrong. A bug the edition's proofs turned up in LilyPond itself became a fix upstream, merged on Nov 1.",
  metrics: [
    {
      value: "12 of 12",
      label: "movements encoded and reviewed",
      note: "All six of Op. 48's quartets, two movements each: the initial engraving. My count, matched against the commits"
    },
    {
      value: "7h → 2½h",
      label: "my time per quartet",
      note: "No. 2 took 6.6h; Nos. 4, 5 and 6 took 2.2–2.7h each. From each movement's evidence file in the edition. The goal is one hour"
    },
    {
      value: "248h",
      label: "hands-on hours, modelled",
      note: "From AI-session prompts, the 15 minutes after each; not a timesheet. About 114 of them on the edition, and 5 on its LilyPond fix upstream"
    },
    {
      value: "683",
      label: "commits",
      note: "Across 13 repos, one of them private"
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
          url: "https://github.com/jsundram/boccherini-sources",
          image: {
            src: "assets/projects/boccherini-sources.jpg",
            alt: "The Boccherini facsimile shelf: 145 sources from 15 libraries, counted by kind, above a row of opus filters and the first cards for Op. 2, each with a thumbnail of its scan."
          }
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
      summary: "No. 1 was checked against its manuscript on Oct 6 — the last quartet done without a pipeline. On Oct 7 /encode was built from a written design, and its first real run, on No. 3's second movement the next day, came with a post-mortem. In the labeler a bake-off compared bar-line detectors across three copyists' hands; the result is a vote of three — a rule-based detector filtered by a learned classifier, and two YOLO models fine-tuned on my labelled pages — each with a model card recording how it was trained and how it performs. Finding staves by segmentation and with oemer were both negative results, and the Zeus handwritten-music reader, unmodified, counted the bars but misread the clefs. Outside the edition, boccherini-haydn-timeline was retitled \"Two Lives in Quartets\" and redesigned with serif type and print formats, mbta-glx gained a figures page, and quartet-chooser and quartets.boccherini.org added recordings of G 230 — which is Op. 48 No. 5.",
      themes: [
        "music",
        "infra"
      ],
      projects: [
        {
          name: "Boccherini Op. 48",
          repo: "boccherini-opus-48",
          desc: "No. 1 checked; /encode built and run for the first time.",
          url: "https://github.com/jsundram/boccherini-opus-48",
          image: {
            src: "assets/projects/boccherini-opus-48.jpg",
            alt: "The edition's review page for Op. 48 No. 5, Larghetto: each part's manuscript above the engraving, bar line under bar line, under a map of the movement's open CHECKs."
          }
        },
        {
          name: "Manuscript Labeler",
          repo: "manuscript-labeler",
          desc: "A bar-line bake-off, a vote of three detectors, and model cards.",
          url: "https://github.com/jsundram/manuscript-labeler",
          image: {
            src: "assets/projects/manuscript-labeler.jpg",
            alt: "Five strips of handwritten manuscript staves, each bar line found by a detector marked with its confidence."
          }
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
            alt: "The Magoun Square board: a collapsed notice of the 11/7–11/15 suspension, then the next train expected in 05:00."
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
      summary: "/encode went from v2 to v5 in four days, each version written from the post-mortem of the movement before it. By v5 it runs like this. With the bar lines labelled and the bar counts matching the LilyPond skeleton, an agent maps the movement — repeats, restatements, and \"twins\", bars that should read alike — and asks me at most three questions about how this copyist draws marks. Four readers, one per part, read every bar; a doubt becomes Homework for me only if its answer would settle at least three other bars, which has meant 0 to 10 questions a movement. Scripts then compare each part with the other three, measure note heads, and compare twins; a Zeus reader fine-tuned on Boccherini objects wherever it reads a pitch, rhythm or accidental differently; an agent must settle every flag with a measurement; and class checks sample 14 kinds of reader error — slur ends, accidentals, unisons, grace notes, dots against wedges — in each part, where one wrong sample opens the whole class for up to three rounds. A confirmed error is fixed in its bar, its twins, and every figure like it. I then review on a page that sets each part's manuscript over the engraving, bar line under bar line, with a map of the movement and MIDI playback, answers each remaining CHECK, and in Recheck sees only the lines the agents changed afterwards. Through it: No. 3's first movement on Oct 14, then compared with a second manuscript source (F-Pn Vma ms 1067-1); No. 2 on Oct 15–16; No. 5, started on Oct 16 and encoded by Oct 17. Outside the edition, quartets.boccherini.org gained a help guide and three more publishers' parts. On Oct 18 a MuSViT reader beat the fine-tuned Zeus on the clean test, 265 bars exact against 225, and took over /encode's flags the same day. Off GitHub, midi-align aligned the new scores to existing recordings to drive a video synced to the music, and boccherini-kb began collecting academic articles on Boccherini so they can be questioned.",
      note: "Oct 11–13 went to music and a sequel to the Lobsters and Lighthouses trip, this time to Gloucester.",
      themes: [
        "music",
        "infra"
      ],
      projects: [
        {
          name: "Boccherini Op. 48",
          repo: "boccherini-opus-48",
          desc: "Nos. 3, 2 and 5 encoded; /encode v2 to v5; my time logged per bar.",
          url: "https://github.com/jsundram/boccherini-opus-48",
          image: {
            src: "assets/projects/boccherini-opus-48.jpg",
            alt: "The edition's review page for Op. 48 No. 5, Larghetto: each part's manuscript above the engraving, bar line under bar line, under a map of the movement's open CHECKs."
          }
        },
        {
          name: "Manuscript Labeler",
          repo: "manuscript-labeler",
          desc: "Zeus fine-tuned on Boccherini, with training pairs built from Philhar's encodings.",
          url: "https://github.com/jsundram/manuscript-labeler",
          image: {
            src: "assets/projects/manuscript-labeler.jpg",
            alt: "Five strips of handwritten manuscript staves, each bar line found by a detector marked with its confidence."
          }
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
        },
        {
          name: "midi-align",
          repo: "midi-align",
          desc: "The new scores aligned to existing recordings, to drive visualisations synced to the music.",
          url: "https://youtu.be/YntX6UltCGk",
          linkText: "Video",
          image: {
            src: "assets/projects/midi-align.jpg",
            alt: "The video's title frame: Boccherini, Quartettino Op. 48 No. 5 in G major, G. 230, Cuarteto Iberia, over glowing note bars for the four parts and a playhead."
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
        },
        {
          text: "MuSViT reader: beats Zeus J on the clean test, 265 bars exact against 225",
          url: "https://github.com/jsundram/manuscript-labeler/commit/cde6a0e53133016fe0efb1d043e566ee2b0ae5ca"
        },
        {
          text: "The new scores aligned to a recording, with midi-align (video)",
          url: "https://youtu.be/YntX6UltCGk"
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
      status: "active",
      intensity: 4,
      title: "MuSViT readers, D3 to D5.",
      summary: "Most of the week was a deliberate detour: could the state of the art in reading handwritten music be improved for these copyists, and how would it compare with the Claude readers inside /encode? In manuscript-labeler the MuSViT reader went through three versions in six days, each measured as /encode's error-flagger before it became the default. D4 caught one error fewer than D3 with a third fewer false flags; D5, the default from Oct 23, is as good on notes and far better at beams. Synthetic staves drawn in the copyists' hands gained 12–14 bars, and drawn staves with clef changes cut clef errors from 4 to 1. Smashcima's synthetic pages and OSSQ's period scans added nothing and were dropped. A census counted 11,500 staves across the Boccherini manuscripts, 2,916 of them labelled, and re-detecting the manuscripts paired with Philhar's encodings found 3,100 more bars to train on. The result: Opus 5.5, reading as /encode's agents do, still out-reads every model, but D5 reads these manuscripts substantially better than Zeus. On Oct 23 Nos. 4 and 6 were started from their labelled Paris sources. Outside the edition, ai-log learned to back up Claude Code and Codex sessions from every machine and to import the claude.ai and ChatGPT exports — the source of this page's hours — and four repos' browser tests were made to run inside Claude Code's macOS sandbox.",
      note: "Oct 21 was a reading session in the evening and little else. Oct 24–26 went to music sessions, two concerts, and a visit to Harvard's library.",
      themes: [
        "music",
        "infra"
      ],
      projects: [
        {
          name: "Manuscript Labeler",
          repo: "manuscript-labeler",
          desc: "MuSViT readers D3 to D5, synthetic staves, and a census of 11,500 staves.",
          url: "https://github.com/jsundram/manuscript-labeler",
          image: {
            src: "assets/projects/manuscript-labeler.jpg",
            alt: "Five strips of handwritten manuscript staves, each bar line found by a detector marked with its confidence."
          }
        },
        {
          name: "Boccherini Op. 48",
          repo: "boccherini-opus-48",
          desc: "Nos. 4 and 6 started; each new reader's flags measured before /encode uses them.",
          url: "https://github.com/jsundram/boccherini-opus-48",
          image: {
            src: "assets/projects/boccherini-opus-48.jpg",
            alt: "The edition's review page for Op. 48 No. 5, Larghetto: each part's manuscript above the engraving, bar line under bar line, under a map of the movement's open CHECKs."
          }
        },
        {
          name: "ai-log",
          repo: "ai-log",
          desc: "Sessions backed up from every machine; the claude.ai and ChatGPT exports imported.",
          url: "https://github.com/jsundram/ai-log"
        }
      ],
      evidence: [
        {
          text: "musvit-D4: its flags for the edition, measured",
          url: "https://github.com/jsundram/manuscript-labeler/commit/91dbe6f73dfc87a0ab470c4673190b940fd592f0"
        },
        {
          text: "Report: musvit-D5, as good on notes, far better at beams; D4's bar counts were luck",
          url: "https://github.com/jsundram/manuscript-labeler/commit/32057671db148d8fe26b4f0055ad6504c3a07919"
        },
        {
          text: "Synthetic quartet staves, drawn in our copyists' hands",
          url: "https://github.com/jsundram/manuscript-labeler/commit/05df9ab87bbc11dbb3c73555f7bf6fcc29cb34a8"
        },
        {
          text: "Smashcima for Segment Anything: tried, dropped",
          url: "https://github.com/jsundram/manuscript-labeler/commit/4419b163fb4467427d4882824d50aaed97b5cf42"
        },
        {
          text: "OSSQ's period staves in the public stage: no gain on our manuscripts",
          url: "https://github.com/jsundram/manuscript-labeler/commit/f9f7f85511b1652673de1139d2f1ff78a0aa992e"
        },
        {
          text: "Boccherini Manuscript Census: 11,500 staves, 2,916 labelled",
          url: "https://github.com/jsundram/manuscript-labeler/commit/7591ad5cfc8be4dfa009211cc708260f67132ee6"
        },
        {
          text: "Report: re-detecting the paired manuscripts, +3,100 bars",
          url: "https://github.com/jsundram/manuscript-labeler/commit/45b71b6528ae541282e505d1d5184051b907e24c"
        },
        {
          text: "Brief for the labeler: how the agent readers out-read D5, and the cost",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/5c60304664e2e3db123f9494822bede3ad099c68"
        },
        {
          text: "Op48-4: start the quartet; Structure.ily from the F-Po RES 507 (16) labels",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/c369d6d6241005f85c6a1c39ab2326f7c82fb656"
        },
        {
          text: "Back up Claude Code and Codex sessions from every machine",
          url: "https://github.com/jsundram/ai-log/commit/1f8737078e4220fc7d078c51fc30e24f340b788f"
        }
      ]
    },
    {
      id: "w5",
      number: "05",
      range: "Oct 26–31",
      dates: {
        start: "2026-10-26",
        end: "2026-10-31"
      },
      status: "active",
      intensity: 5,
      title: "Proof, a rehearsal, and the last two quartets.",
      summary: "On the evening of Oct 28 a rehearsal read from the new editions, held as a debugging session: to find errors, and the fixes that would make the parts easier to read from. Proof, the iPad page used there, was built in the 22 hours before it: prompts run from Tuesday afternoon to late Wednesday morning with no gap longer than an hour, and Proof took the last twelve of them and about a hundred commits. It shows each part's manuscript and its engraving; notes pin to a bar and sync through the Mac; voice notes are transcribed on the Mac and read on every iPad; Apple Pencil ink appears live on the other iPads and rubs out with a finger. It is served at proof.boccherini.org. By Oct 31 the rehearsal could be replayed from its log, each player's iPad beside the room's recording. The encoding finished alongside it: No. 4 on Oct 28 and No. 6 on Oct 30–31, which completes the initial engraving of all six quartets. Upstream, a LilyPond bug the proofs had turned up — cairo PNGs drew #red as blue — went to GitLab as MR !3206 on Oct 26, with review replies the next day; it was merged on Nov 1. Oct 27 went first to the photos from the library visit: a _RAW intake that dewarps the curled pages, crops them, removes stray ink and sets the contrast, to make clean PDFs to read from, with nothing on GitHub yet. mbta-glx became an installable app on pwa-starter, and its smoke test went from 4 min 17 s to 21 s by waiting on events instead of the clock; pwa-starter's pull-to-refresh fixes went out to it and to quartet-log.",
      themes: [
        "music",
        "platform"
      ],
      projects: [
        {
          name: "Boccherini Op. 48",
          repo: "boccherini-opus-48",
          desc: "Nos. 4 and 6 encoded, and Proof built.",
          url: "https://github.com/jsundram/boccherini-opus-48",
          image: {
            src: "assets/projects/boccherini-opus-48.jpg",
            alt: "The edition's review page for Op. 48 No. 5, Larghetto: each part's manuscript above the engraving, bar line under bar line, under a map of the movement's open CHECKs."
          }
        },
        {
          name: "Proof",
          repo: "boccherini-opus-48",
          desc: "The iPad page for rehearsal notes, used at the Oct 28 rehearsal.",
          url: "https://youtu.be/W2CSW_dQIY8",
          linkText: "Video",
          image: {
            src: "assets/projects/proof.jpg",
            alt: "The video's title frame: Proof, \"Don't drop a note.\", beside an iPad showing manuscript staves above their engraving, with green note markers pinned to bars."
          }
        },
        {
          name: "LilyPond, upstream",
          repo: "lilypond",
          desc: "MR !3206: cairo PNG output had red and blue swapped since 2021. Found through the edition's proofs; merged on Nov 1.",
          url: "https://gitlab.com/lilypond/lilypond/-/merge_requests/3206",
          linkText: "Merge request",
          image: {
            src: "assets/projects/lilypond.jpg",
            alt: "Four note heads engraved by LilyPond's cairo backend, twice: before the fix, coloured #red and orange, they come out blue; after it, red and orange."
          }
        },
        {
          name: "MBTA GLX",
          repo: "mbta-glx",
          desc: "An installable app, every alert on the route, and a faster test suite.",
          url: "https://github.com/jsundram/mbta-glx",
          image: {
            src: "assets/projects/mbta-glx.jpg",
            alt: "The Magoun Square board: a collapsed notice of the 11/7–11/15 suspension, then the next train expected in 05:00."
          }
        },
        {
          name: "pwa-starter",
          repo: "pwa-starter",
          desc: "Pull-to-refresh fixes, carried to mbta-glx and quartet-log.",
          url: "https://github.com/jsundram/pwa-starter",
          image: {
            src: "assets/projects/pwa-starter.jpg",
            alt: "pwa-starter's placeholder shell: an APP header and a box asking to be replaced."
          }
        }
      ],
      evidence: [
        {
          text: "Proof on the iPad: a demo (video)",
          url: "https://youtu.be/W2CSW_dQIY8"
        },
        {
          text: "Cleaning the library photos into PDFs, explained (video)",
          url: "https://youtu.be/7kpebGQq_Q0"
        },
        {
          text: "iPad page: manuscript and score views",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/2ce6dd87f25eabd44d51ff21e0cd77eefaa97ee4"
        },
        {
          text: "Rehearsal log: notes kept on the iPad, then the Mac, never lost",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/d83c01d1d0ffaa3c6b0f3b1d34fa4db7bf6690fd"
        },
        {
          text: "iPad notes: each recording transcribed on the Mac, read on every iPad",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/48a1a355a1fdbd186b8f552549a01773e49316c2"
        },
        {
          text: "iPad notes: Apple Pencil drawing, live on every iPad, with Undo",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/3470bd072affd5118976c0f6d203361c4dc655c2"
        },
        {
          text: "Op48-4 I encoded from F-Po RES 507 (16), reviewed, tidied, verified",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/f7aa6765de2e101ce0326e3131aeb4a988defcf2"
        },
        {
          text: "Op48-6 I encoded from F-Po RES 507 (18), reviewed, tidied, verified",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/1be2afc090dc1e37b78feddfe51391092cb92de0"
        },
        {
          text: "Op48-6 II: encoded from F-Po RES 507 (18), reviewed",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/1ada2fdcd5f0f873f63606140a8e5b7c6e13f66c"
        },
        {
          text: "LilyPond MR !3206: cairo: fix red/blue swap in PNG output",
          url: "https://gitlab.com/lilypond/lilypond/-/merge_requests/3206"
        },
        {
          text: "Replay: a past rehearsal replayed from its log, each player's iPad beside the room's recording",
          url: "https://github.com/jsundram/boccherini-opus-48/commit/3ff2d1bafd9da980a3a78f95e4cb8efbdc1dc7da"
        },
        {
          text: "Make the board an installable app, on pwa-starter",
          url: "https://github.com/jsundram/mbta-glx/commit/620e924da791c2f20d67af1461f62083e978793a"
        },
        {
          text: "Make board_smoke.py wait on events, not the clock: 4 min 17 s -> 21 s",
          url: "https://github.com/jsundram/mbta-glx/commit/6d9f1e2b29a7a8f7a925a6c24923aae56f89a3a4"
        }
      ]
    }
  ],
  threads: [
    {
      title: "A quartet in one hour",
      repo: "boccherini-opus-48",
      status: "active",
      note: "The goal for /encode is one hour of my time per quartet. No. 2 took about 7 hours; Nos. 4, 5 and 6 took 2–2¾ each, by each movement's evidence file, so the time fell fast and then held. Per 100 bar-parts both movements of No. 6 came in under 20 minutes, but No. 4's first took 48. Agent cost per movement fell from about 19M tokens on the first run to 4–9M. Building /encode has itself taken much of the month, and a skilled LilyPond engraver would probably be faster without any of it — but would not produce the aligned score, manuscript over engraving.",
      url: "https://github.com/jsundram/boccherini-opus-48"
    },
    {
      title: "A better reader for these manuscripts",
      repo: "manuscript-labeler",
      status: "active",
      note: "Off-the-shelf readers failed first: Claude reading the staves directly, oemer, and Zeus unmodified. Fine-tuned, Zeus read 65% of a held-out movement's bars exactly, against 42% before. From Oct 18 a MuSViT reader went further, through D3, D4 and D5; D5 reads these manuscripts substantially better than Zeus and is what /encode now uses to flag errors, though Opus 5.5 still out-reads it. Next is ISMIR 2026, to see whether its ideas improve the models further.",
      url: "https://github.com/jsundram/manuscript-labeler/commit/0ef2d07aaacd7f7bbed8b766517c7a6e2ab7d5b8"
    },
    {
      title: "Clean PDFs from library photos",
      repo: "boccherini-quartet-data",
      status: "active",
      note: "iPhone photos of manuscripts from Harvard's library, to be dewarped where the page curls, cropped, cleaned of stray ink and set to a readable contrast, then bound as PDFs that are easier to read from. Whether the same dewarping helps the labeler was explored on Oct 27 and is not settled. Not on GitHub.",
      url: "https://youtu.be/7kpebGQq_Q0"
    },
    {
      title: "A Boccherini knowledge base",
      repo: "boccherini-kb",
      status: "active",
      note: "Academic articles about Boccherini, collected so they can be questioned — like having a grad student on call. 17 modelled hours this month, nothing on GitHub yet."
    },
    {
      title: "A second LilyPond cairo fix",
      repo: "lilypond",
      status: "parked",
      note: "Written on Oct 25 alongside MR !3206 and not yet submitted: cairo's PNG output honouring -dpixmap-format=pngalpha. It sits in my LilyPond fork.",
      url: "https://gitlab.com/jsundram/lilypond"
    },
    {
      title: "The labeler's approach on a printed source",
      repo: "manuscript-labeler",
      status: "active",
      note: "Started on Oct 31: an Audiveris scan of Boulogne's Op. 14, to try the manuscript approach on a source that is not a manuscript."
    }
  ]
};
