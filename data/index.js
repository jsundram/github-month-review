/* Month index. Loaded eagerly; individual months load on demand.
   Newest first. Keep `blurb` to one plain sentence. */
window.REVIEW_INDEX = {
  user: "jsundram",
  profile: "https://github.com/jsundram",
  site: "https://jsundram.github.io/github-month-review/",   // deploy origin; app.js builds per-month og:url from it
  months: [
    {
      id: "2026-08",
      label: "August 2026",
      file: "data/months/2026-08.js",
      status: "active",
      blurb: "The most music of any month yet, with quartet-chooser's PWA checklist, a quartet-log overhaul, and a Cozio bow dataset in the gaps."
    },
    {
      id: "2026-07",
      label: "July 2026",
      file: "data/months/2026-07.js",
      status: "active",
      blurb: "AKM finished through the festival, then its patterns formalised into pwa-starter and carried back out."
    },
    {
      id: "2026-06",
      label: "June 2026",
      file: "data/months/2026-06.js",
      status: "active",
      blurb: "Dashboard work, a Maine trip handout, haydn-lowdn, and AKM starting in the last three days."
    }
  ]
};
