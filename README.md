# nashwa.studio

The portfolio site of Nashwa Hamido, marketing artist and product design engineer. It shows ten years of games marketing art for studios like Meta and YAGER, alongside the web and mobile products she has designed and built.

- **Live site:** [nashwa.studio](https://www.nashwa.studio)
- **Design and build:** Nashwa Hamido

It's a single page in plain HTML, CSS and JavaScript, with no framework and no build step. It's hosted on Vercel.

## What's on the site

- **Hero and About:** introduction, experience, education, languages and CV download.
- **Tools:** the software and tech used across art, motion, 3D and development.
- **Skills:** eight service areas, from game marketing art to mobile app development.
- **Portfolio:** filterable project cards. Each opens a popup with a description and image carousel.
  - **Web Development:** Atlasphere, Retelling Dubliners, MODU website
  - **App Development:** MODU
  - **Game Development:** Unity, WebGL, Processing and Twine projects
  - **Game Marketing:** The Cycle, The Cycle: Frontier, Crayta, Horizon Worlds, Heroes United and other titles
  - **Branding and Prints:** logos and print work
- **Contact:** contact details, social links and a contact form.
- **Light and dark themes,** with the visitor's choice remembered.

## Structure

```
.
├── index.html             the whole page: hero, about, tools, skills, portfolio, contact
├── css/
│   └── onepage.css        all styles, including light and dark themes
├── js/
│   ├── onepage.js         navigation, reveals, filters, carousels, popups, contact form
│   ├── projects-data.js   portfolio content: cards, tags, descriptions, media
│   └── tool-icons.js      inline SVG icons for the tools list
└── assets/
    ├── images/            portraits and site imagery
    ├── cv/                downloadable CVs
    ├── games/             game marketing projects, one folder per title
    ├── web/               web projects: atlasphere, retelling, moduweb
    ├── app/               mobile app projects: modu
    ├── gamedev/           game development projects
    └── branding/          branding and print projects
```

## Running locally

There's no build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Editing content

- **Portfolio projects** (cards, tags, descriptions, images and links) are in `js/projects-data.js`. Each project's images go in its own folder under `assets/`.
- **Tool icons** are in `js/tool-icons.js`.
- **CVs** go in `assets/cv/`. Update the download links in `index.html` when you replace one.
- **Everything else** (copy, layout and sections) is in `index.html` and `css/onepage.css`.

## Deploying

Vercel redeploys the site on every push to `main`. The domain is registered with Namecheap and points to Vercel.

---

© Nashwa Hamido. All artwork belongs to its respective studios and clients, and is shown for portfolio purposes.
