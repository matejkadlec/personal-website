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

- **Bilingual (English / Czech)** – the language is picked from the browser
  (Czech browsers get Czech, everyone else English) and can be switched with the
  flags; a manual choice is remembered. The CV download follows the language.
- **Lightweight** – plain HTML, CSS and vanilla JavaScript: no JavaScript
  framework, no build step and about 25 KB of JavaScript.
- **SEO-friendly** – canonical URLs, Open Graph and X cards, JSON-LD structured
  data (`Person`, `WebSite`, `ProfilePage` with breadcrumbs) and a sitemap.
- **Responsive** – a desktop layout with side navigation and a mobile layout
  with a slide-in menu, plus scroll reveal animations.
- **Accessible** – semantic headings, descriptive alt texts and labelled
  controls.

## Tech stack

- **Markup & styles:** HTML5, CSS3, [Bootstrap 4](https://getbootstrap.com/)
  (grid and utilities), [Font Awesome 4](https://fontawesome.com/v4/)
- **Scripts:** vanilla JavaScript (translations, language switcher, scroll
  animations, preloader)
- **Fonts:** Poppins and Open Sans from Google Fonts
- **Hosting:** Apache 2.4 – `.htaccess` handles clean URLs, redirects and
  caching

## Project structure

```
.
├── index.html        # Home page (/)
├── about-me.html     # About page (/about-me, Czech /o-mne)
├── assets/
│   ├── css/          # style.css + vendor styles
│   ├── js/           # i18n, translations, animations
│   ├── img/          # portrait, logo, flags, favicons
│   ├── cv/           # CV in English and Czech (PDF)
│   └── fonts/        # Font Awesome webfonts
├── .htaccess         # Redirects, clean URLs, cache headers
├── manifest.json     # Web app manifest
├── sitemap.xml
└── robots.txt
```

## Running locally

There is no build step and there are no dependencies. Open `index.html` directly
in a browser, or use a static server that supports clean URLs (`/about-me`),
for example (needs Node.js, serves on http://localhost:3000):

```bash
npx serve .
```

The Czech `/o-mne` URL and the redirects rely on Apache's `.htaccess`, so under
`serve` the Czech About link (or a reload after switching to Czech there)
returns 404. Check the Czech pages by opening the files directly or by switching
in-page.

## Editing content

- All visible texts live in `assets/js/translations.js`, in English and Czech.
  Keep the static English text in the HTML files identical to the `en`
  strings, because that is what search engines and link previews read.
- Page titles, meta and Open Graph descriptions and the structured data are
  English only and live in the HTML files.
- After changing a CSS or JS file, bump the `?v=` version in both HTML files so
  returning visitors get the new file.
- More details (routing, SEO, caching, conventions) are in
  [AGENTS.md](AGENTS.md).

## Credits

The design is based on the _Tunis – Personal Portfolio_ template by
[celtano](https://themeforest.net/user/celtano).

## License

© 2026 Matěj Kadlec. All rights reserved – see [LICENSE](LICENSE).
Third-party files (Bootstrap, Font Awesome and the other vendor files in
`assets/`) remain under their own licenses.
