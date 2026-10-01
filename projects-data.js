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
    cover: "heroes/hu_03.webp",
    tags: ["Marketing", "3D", "Social Media"],
    summary: "Social-media ad campaigns and 3D marketing pieces for the mobile hero game Heroes United (Etihad Al Abtal), including global release visuals, seasonal New Year 3D celebration art, regional launch banners and Black Friday promos. I delivered these in both still and video formats, with a strong focus on brand consistency and typography.",
    role: "Role: Graphic & Marketing Artist @ FunRock",
    tools: ["photoshop", "illustrator", "aftereffects", "maya", "threedsmax"],
    images: ["heroes/hu_03.webp", "heroes/hu_05.webp", "heroes/hu_04.webp", "heroes/hu_07.webp", "heroes/hu_01.webp", "heroes/hu_02.webp", "heroes/hu_06.webp", "heroes/hu_08.webp"],
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  },
  {
    title: "The Cycle",
    cover: "dlcskeyart.jpg",                      // PLACEHOLDER ART - replace with real Behance art
    tags: ["Key Art", "Marketing", "Motion", "Social Media"],
    summary: "Marketing and promotional artwork for Yager's AAA free-to-play shooter The Cycle, covering game starter-pack and promotional designs, staged character and action shots, and weekly-challenge social media posts. I also contributed in-engine scenes for Seasons 2 and 3 and worked on the key art animation.",
    role: "Role: Marketing Artist @ Yager Development",
    tools: ["photoshop", "illustrator", "aftereffects", "premiere", "unreal"],
    images: ["dlcskeyart.jpg", "dlcskeyart.png"], // PLACEHOLDER ART
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  },
  {
    title: "The Cycle: Frontier",
    cover: "tc_s3_keyart.jpg",                    // PLACEHOLDER ART - replace with real Behance art
    tags: ["Key Art", "Cinematics", "Marketing", "Motion"],
    summary: "Campaign visuals for Yager's The Cycle: Frontier, including staged in-engine cinematics of monsters, the crafting area and the players' quarters, DLC package art and social media posts. I also created atmospheric cinematic clips such as the Abandoned Ship, the Meteors and Waterfall scene, and the Ponds and Monsters scene.",
    role: "Role: Marketing Artist @ Yager Development",
    tools: ["unreal", "photoshop", "illustrator", "aftereffects", "premiere"],
    images: ["tc_s3_keyart.jpg", "KeyArt-S3poster.png", "TC_crafting.png", "runnercharacter.jpg", "monster1.png"], // PLACEHOLDER ART
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  },
  {
    title: "Crayta",
    cover: "crayta/crayta_12.webp",
    tags: ["Key Art", "Cinematics", "Social Media", "Staged Scenes"],
    summary: "Seasonal event artwork, key art and staged scenes for Crayta (Unit 2 Games / Meta), covering season and event campaigns such as Tabletop Champs, Harrowing High, the Science Fair and Mega Jam build jams, Halloween and Thanksgiving, plus Epic Games Store and Facebook Gaming promotion.",
    role: "Role: Marketing Artist @ Meta (Unit 2 Games)",
    tools: ["photoshop", "illustrator", "aftereffects", "unreal"],
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
    tags: ["Marketing", "Illustration", "UI"],
    summary: "Marketing and in-world visual design for Meta Horizon Worlds at Reality Labs, including a Black History Month creator panel and nameplate sticker sets, created for Meta's social VR platform.",
    role: "Role: Marketing Artist @ Meta Reality Labs",
    tools: ["photoshop", "illustrator", "figma"],
    images: ["horizon/hw_03.webp", "horizon/hw_01.webp", "horizon/hw_02.webp"],
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  },
  {
    title: "Other Titles",
    cover: "other/wargaming_01.webp",
    tags: ["Marketing", "UI", "Game Dev"],
    summary: "A spread of marketing and UI work across other studios and titles, plus the games I build myself. Marketing and UI for King (Candy Crush, Candy Crush Soda and Bubble Witch Saga), Castle Solitaire, and a World of Warships Blitz Free Comic Book Day campaign. On the development side I also build my own games, from Unity titles to narrative and web games in JavaScript, HTML and CSS.",
    role: "Role: Marketing & UI Artist, and solo game developer",
    tools: ["photoshop", "illustrator", "unity", "csharp", "javascript", "html5", "css3"],
    rows: [
      { label: "King", images: ["other/king_01.webp", "other/king_02.webp", "other/king_03.webp"] },
      { label: "Castle Solitaire", images: ["other/castle_01.webp", "other/castle_02.webp", "other/castle_03.webp"] },
      { label: "World of Warships Blitz", images: ["other/wargaming_01.webp"] }
    ],
    behanceUrl: "https://www.behance.net/NashwaHassan154"
  }
];
