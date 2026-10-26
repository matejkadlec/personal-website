# Matěj Kadlec – Personal Website

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fmatejkadlec.cz&label=matejkadlec.cz)](https://matejkadlec.cz)
![Stack](https://img.shields.io/badge/Stack-HTML%2FCSS%2FJS-orange)
![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20CS-blue)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red)](LICENSE)

The source code of my personal portfolio website,
**[matejkadlec.cz](https://matejkadlec.cz)**. It introduces me as a developer:
my experience, education and skills, with links to my CV, GitHub and LinkedIn.

![Home page of matejkadlec.cz](.github/preview.jpg)

## Features

- **Bilingual (English / Czech)** – the language is picked from the browser
  (Czech browsers get Czech, everyone else English) and can be switched with the
  flags; a manual choice is remembered. The CV download follows the language.
- **Lightweight** – plain HTML, CSS and vanilla JavaScript: no framework, no
  build step and about 25 KB of JavaScript.
- **SEO-friendly** – canonical URLs, Open Graph and X cards, JSON-LD structured
  data (`Person`, `WebSite`, `ProfilePage`) and a sitemap.
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
├── sitemap.xml
└── robots.txt
```

## Running locally

There is nothing to install. Either open `index.html` in a browser, or serve the
folder with any static server, for example:

```bash
npx serve .
```

Some things, such as the Czech `/o-mne` URL and the redirects, rely on Apache
and `.htaccess`, so they only work on the live server.

## Editing content

- All texts live in `assets/js/translations.js`, in English and Czech. Keep the
  English text in the HTML files the same, because that is what search engines
  and link previews read.
- After changing a CSS or JS file, bump the `?v=` version in both HTML files so
  returning visitors get the new file.
- More details (routing, SEO, caching, conventions) are in
  [AGENTS.md](AGENTS.md).

## Credits

The design is based on the _Tunis – Personal Portfolio_ template by
[celtano](https://themeforest.net/user/celtano).

## License

© 2026 Matěj Kadlec. All rights reserved – see [LICENSE](LICENSE).
