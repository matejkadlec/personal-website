# Matěj Kadlec – Personal Website

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmatejkadlec.cz&label=matejkadlec.cz)](https://matejkadlec.cz)
![Stack](https://img.shields.io/badge/Stack-HTML%2FCSS%2FJS-orange)
![Languages](https://img.shields.io/badge/Languages-English%20%7C%20Czech-blue)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red)](LICENSE)

The source code of my personal portfolio website,
**[matejkadlec.cz](https://matejkadlec.cz)**. It introduces me as a developer:
my experience, education and skills, with links to my CV, GitHub and LinkedIn.

![Home page of matejkadlec.cz](.github/preview.jpg)

## Features

- **Bilingual (English / Czech)** – every page exists in both languages, so
  search engines index both. Visitors are sent to their browser's language
  (Czech browsers get Czech, everyone else English) and can switch with the
  flags; a manual choice is remembered. The CV download follows the language.
- **Lightweight** – plain HTML, CSS and vanilla JavaScript: no JavaScript
  framework, no build step and about 8 KB of JavaScript.
- **SEO-friendly** – canonical URLs, hreflang links between the language
  versions, Open Graph and X cards, JSON-LD structured data (`Person`,
  `WebSite`, `ProfilePage` with breadcrumbs) and a sitemap.
- **Responsive** – a desktop layout with side navigation and a mobile layout
  with a slide-in menu, plus scroll reveal animations.
- **Accessible** – semantic headings, descriptive alt texts and labelled
  controls.

## Tech stack

- **Markup & styles:** HTML5, CSS3, [Bootstrap 4](https://getbootstrap.com/)
  (grid and utilities), [Font Awesome 4](https://fontawesome.com/v4/)
- **Scripts:** vanilla JavaScript (language redirect and switcher, scroll
  animations, preloader)
- **Fonts:** Poppins and Open Sans from Google Fonts
- **Hosting:** Apache 2.4 – `.htaccess` handles clean URLs, redirects and
  caching

## Project structure

```
.
├── index.html        # Home page, English (/)
├── about-me.html     # About page, English (/about-me)
├── cs.html           # Home page, Czech (/cs)
├── o-mne.html        # About page, Czech (/o-mne)
├── assets/
│   ├── css/          # style.css + vendor styles
│   ├── js/           # language redirect, animations, preloader
│   ├── img/          # portrait, logo, flags, favicons
│   ├── cv/           # CV in English and Czech (PDF)
│   └── fonts/        # Font Awesome webfonts
├── .htaccess         # Redirects, clean URLs, cache headers
├── manifest.json     # Web app manifest
├── sitemap.xml
└── robots.txt
```

## Running locally

There is no build step and there are no dependencies. Open any of the HTML files
directly in a browser, or use a static server that supports clean URLs
(`/about-me`), for example (needs Node.js, serves on http://localhost:3000):

```bash
npx serve .
```

The redirects in `.htaccess` (HTTPS, `.html` and trailing slashes) only work on
Apache.

## Editing content

- The texts live directly in the HTML files: English in `index.html` and
  `about-me.html`, Czech in `cs.html` and `o-mne.html`. Edit both language
  versions, including the page titles, meta descriptions and structured data
  in `<head>`.
- After changing a CSS or JS file, bump the `?v=` version in all four HTML
  files so returning visitors get the new file.
- More details (routing, SEO, caching, conventions) are in
  [AGENTS.md](AGENTS.md).

## Credits

The design is based on the _Tunis – Personal Portfolio_ template by
[celtano](https://themeforest.net/user/celtano).

## License

© 2026 Matěj Kadlec. All rights reserved – see [LICENSE](LICENSE).
Third-party files (Bootstrap, Font Awesome and the other vendor files in
`assets/`) remain under their own licenses.
