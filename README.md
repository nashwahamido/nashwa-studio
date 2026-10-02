# Nashwa Studio

Personal portfolio one-pager for Nashwa Hamido, a multimedia and game marketing
artist. Built from scratch with plain HTML, CSS and JavaScript (no framework, no
build step) and deployed on Vercel at [nashwa.studio](https://www.nashwa.studio/).

## Structure

```
.
├── index.html              # the whole page (hero, about, skills, portfolio, contact)
├── css/
│   └── onepage.css         # all styles, including light/dark themes
├── js/
│   ├── onepage.js          # interactions: nav, reveals, carousels, modals, form
│   ├── projects-data.js    # case-study data (game marketing + web projects)
│   └── tool-icons.js       # inline SVG icon set for the tools/tech
├── assets/
│   ├── images/             # site imagery (portrait, etc.)
│   ├── cv/                 # downloadable CV
│   └── games/              # case-study media, one folder per project
│       ├── crayta/
│       ├── cycle/
│       ├── cyclefrontier/
│       ├── heroes/
│       ├── horizon/
│       └── other/
└── README.md
```

## Running locally

No build step. Serve the folder with any static server, for example:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Editing content

- Portfolio case studies (cards, tags, descriptions, media) live in
  `js/projects-data.js`.
- Tool and tech icons live in `js/tool-icons.js`.
- Everything else (copy, layout, sections) is in `index.html` and `css/onepage.css`.
