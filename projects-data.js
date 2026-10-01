// ============================================================
// GAMES - case studies
// ------------------------------------------------------------
// Each game opens an overlay with a 3D carousel of its images,
// plus a description above and a role + tool icons below.
//
// Fields:
//   title      : game name
//   cover      : card thumbnail image
//   tags       : chips shown on the card + modal
//   summary    : description shown ABOVE the carousel
//   role       : role / credit line shown BELOW the carousel
//   tools      : tool keys (see tool-icons.js) shown as icons below
//   images     : images in the carousel (or use `groups` for labelled sets)
//   behanceUrl : link to the full project on Behance
// ============================================================

window.CASE_STUDIES = [
  {
    title: "Heroes United",
    cover: "heroes/cover.webp",
    tags: ["Ad Campaigns", "3D", "Social Media"],
    summary: "Social-media ad campaigns and 3D marketing pieces for the mobile hero game Heroes United (Etihad Al Abtal), including global release visuals, seasonal New Year 3D celebration art, regional launch banners and Black Friday promos. I delivered these in both still and video formats, with a strong focus on brand consistency and typography.",
    role: "Role: Graphic & Marketing Artist @ FunRock",
    tools: ["photoshop", "maya", "unity", "keyshot"],
    images: ["heroes/hu_03.webp", "heroes/hu_05.webp", "heroes/hu_04.webp", "heroes/hu_07.webp", "heroes/hu_01.webp", "heroes/hu_02.webp", "heroes/hu_06.webp", "heroes/hu_08.webp"],
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  },
  {
    title: "The Cycle",
    cover: "cycle/cover.webp",
    tags: ["Cinematics", "Motion", "Social Media"],
    summary: "Marketing and promotional artwork for Yager's AAA free-to-play shooter The Cycle, covering game starter-pack and promotional designs, staged character and action shots, and weekly-challenge social media posts. I also contributed in-engine scenes for Seasons 2 and 3 and worked on the key art animation.",
    role: "Role: Marketing Artist @ Yager Development",
    tools: ["photoshop", "illustrator", "unreal", "premiere", "aftereffects", "animate"],
    images: ["cycle/cycle_01.webp", "cycle/cycle_02.webp", "cycle/cycle_03.webp", "cycle/cycle_04.webp", "cycle/cycle_05.webp", "cycle/cycle_06.webp", "cycle/cycle_07.webp", "cycle/cycle_08.webp", "cycle/cycle_09.webp", "cycle/cycle_11.webp", "cycle/cycle_12.webp", "cycle/cycle_13.webp", "cycle/cycle_14.webp", "cycle/cycle_v1.mp4", "cycle/cycle_v2.mp4"],
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  },
  {
    title: "The Cycle: Frontier",
    cover: "cyclefrontier/cover.webp",
    tags: ["Key Art", "Cinematics", "Motion"],
    summary: "Campaign visuals for Yager's The Cycle: Frontier, including staged in-engine cinematics of monsters, the crafting area and the players' quarters, DLC package art and social media posts. I also created atmospheric cinematic clips such as the Abandoned Ship, the Meteors and Waterfall scene, and the Ponds and Monsters scene.",
    role: "Role: Marketing Artist @ Yager Development",
    tools: ["photoshop", "illustrator", "unreal", "premiere", "aftereffects", "animate"],
    images: ["cyclefrontier/frontier_01.webp", "cyclefrontier/frontier_02.webp", "cyclefrontier/frontier_03.webp", "cyclefrontier/frontier_04.webp", "cyclefrontier/frontier_05.webp", "cyclefrontier/frontier_06.webp", "cyclefrontier/frontier_07.webp", "cyclefrontier/frontier_08.webp", "cyclefrontier/frontier_09.webp", "cyclefrontier/frontier_v1.mp4", "cyclefrontier/frontier_v2.mp4", "cyclefrontier/frontier_v3.mp4"],
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  },
  {
    title: "Crayta",
    cover: "crayta/cover.webp",
    tags: ["Key Art", "Cinematics", "Social Media"],
    summary: "Seasonal event artwork, key art and staged scenes for Crayta (Unit 2 Games / Meta), covering season and event campaigns such as Tabletop Champs, Harrowing High, the Science Fair and Mega Jam build jams, Halloween and Thanksgiving, plus Epic Games Store and Facebook Gaming promotion.",
    role: "Role: Marketing Artist @ Meta (Unit 2 Games)",
    tools: ["photoshop", "illustrator", "unreal", "metatools"],
    images: [
      "crayta/crayta_09.webp", "crayta/crayta_11.webp", "crayta/crayta_12.webp", "crayta/crayta_13.webp", "crayta/crayta_14.webp",
      "crayta/crayta_02.webp",
      "crayta/crayta_01.webp", "crayta/crayta_03.webp", "crayta/crayta_04.webp", "crayta/crayta_05.webp", "crayta/crayta_06.webp", "crayta/crayta_07.webp", "crayta/crayta_08.webp", "crayta/crayta_15.webp"
    ],
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  },
  {
    title: "Horizon Worlds",
    cover: "horizon/hw_03.webp",
    tags: ["Illustration", "UI", "Social Media"],
    summary: "Marketing and in-world visual design for Meta Horizon Worlds at Reality Labs, including a Black History Month creator panel and nameplate sticker sets, created for Meta's social VR platform.",
    role: "Role: Marketing Artist @ Meta Reality Labs",
    tools: ["photoshop", "illustrator", "unity", "oculus", "metatools"],
    images: ["horizon/hw_03.webp", "horizon/hw_01.webp", "horizon/hw_02.webp"],
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  },
  {
    title: "Other Titles",
    cover: "other/cover.webp",
    tags: ["UI", "Social Media", "Ad Campaigns"],
    summary: "A spread of marketing, social media and ad campaign work across other studios and titles, including King (Candy Crush, Candy Crush Soda and Bubble Witch Saga), Castle Solitaire, and a World of Warships Blitz Free Comic Book Day campaign.",
    role: "Role: Marketing & UI Artist",
    tools: ["photoshop", "illustrator", "unity", "blender", "aitools"],
    rows: [
      { label: "King", images: ["other/king_01.webp", "other/king_02.webp", "other/king_03.webp"] },
      { label: "Castle Solitaire", images: ["other/castle_01.webp", "other/castle_02.webp", "other/castle_03.webp"] },
      { label: "World of Warships Blitz", images: ["other/wargaming_01.webp"] }
    ],
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  }
];

// ============================================================
// WEB DEVELOPMENT - case studies
// ------------------------------------------------------------
// Each project opens an overlay with a live, scrollable preview
// of the site, plus a description and a team credit.
//
// Fields:
//   title     : project name
//   url        : live site (used for the preview iframe + open link)
//   displayUrl : short URL shown in the browser bar
//   tags       : chips shown on the card + modal
//   credit     : team / collaboration credit line
//   summary    : description of the work
// ============================================================

window.WEB_PROJECTS = [
  {
    title: "Atlasphere",
    url: "https://atlasphere.up.railway.app/",
    displayUrl: "atlasphere.up.railway.app",
    repoUrl: "https://github.com/nashwahamido/AtlasphereWebApp-Updated",
    tags: ["Web App", "Full Stack"],
    credit: "Team project, MSc in Interactive Digital Media, Trinity College Dublin",
    summary: "Atlasphere is a full stack social web application for planning trips together. People can create group spaces, chat in real time, build shared itineraries and keep track of the places they have visited. I worked on it end to end. On the back end I built the Express server, the MySQL data layer, session based sign in with hashed passwords, email sending and the live chat powered by Socket.IO. On the front end I built the views and React pieces and shaped the overall look and feel.",
    tech: ["JavaScript", "Node.js", "Express", "React", "Vite", "MySQL", "Socket.IO"]
  },
  {
    title: "Retelling Dubliners",
    url: "http://www.retellingdubliners.com/pages/index.html",
    displayUrl: "retellingdubliners.com",
    repoUrl: "https://github.com/nashwahamido/Retellings",
    tags: ["Web Design", "Front End", "Accessibility"],
    credit: "Team project, MSc in Interactive Digital Media, Trinity College Dublin",
    summary: "Retelling Dubliners is an accessible website that reimagines James Joyce's Dubliners for the web, with sections on the stories, the life of Joyce, the locations around the city and a walking tour. I focused on the front end, hand building the pages, the responsive layouts and the interactive pieces in HTML, CSS and JavaScript, with accessibility guiding the design the whole way through.",
    tech: ["HTML", "CSS", "JavaScript"]
  },
  {
    title: "Modu",
    url: "https://modugamified.vercel.app/",
    displayUrl: "modugamified.vercel.app",
    repoUrl: "https://github.com/nashwahamido/MODU-Website",
    tags: ["Web Design", "Front End"],
    credit: "Team project, MSc in Interactive Digital Media, Trinity College Dublin",
    summary: "Modu is a guided 3D furniture assembly app, and this is its marketing site. It is a single page, hand built experience with a reveal on scroll, a room carousel and a back to top control, written as three plain files with no framework and no build step. I built the front end, from the markup and styling through to the small script that drives the interactions.",
    tech: ["HTML", "CSS", "JavaScript"]
  }
];
