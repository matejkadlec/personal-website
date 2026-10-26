# Agent Information

Personal website of Matěj Kadlec, live at https://matejkadlec.cz. A static,
bilingual (English/Czech) site: plain HTML, Bootstrap 4 CSS and vanilla
JavaScript (ES2015+). There is no build step, package manager or framework;
files are served exactly as they are in the repository.

`CLAUDE.md` is a symlink to this file.

## Structure

```
index.html              Home page (served at /)
about-me.html           About page (served at /about-me, Czech alias /o-mne)
.htaccess               Apache config: canonical redirects, clean URLs, caching
sitemap.xml, robots.txt Crawler files
manifest.json           Web app manifest
assets/css/style.css    Site styles (derived from the "Tunis" template)
assets/css/*            Vendor CSS: Bootstrap, Font Awesome, circle.css (skill
                        charts), preloader, revealator (scroll animations)
assets/js/i18n.js       Language detection, translation and the flag switcher
assets/js/translations.js  All EN/CS strings
assets/js/revealator.js Scroll reveal animations (vanilla port of a jQuery plugin)
assets/js/custom.js     Removes the slide-up offset once the page is ready
assets/js/preloader.min.js  Full-screen preloader until window load
assets/img/             Portrait, logo, flags, favicons
assets/cv/              CV PDFs (CV_Matej_Kadlec.pdf = EN, CV_Matěj_Kadlec.pdf = CS)
assets/fonts/           Font Awesome 4.7 webfonts
```

## Languages (i18n)

- The static HTML is English. On `DOMContentLoaded`, `i18n.js` translates every
  element with `data-i18n` (text, or HTML if the string contains tags),
  `data-i18n-title`, `data-i18n-alt`, `data-i18n-aria-label` and
  `data-i18n-href`, using
  `window.TRANSLATIONS` from `translations.js`.
- Language choice: a language picked with the flags is stored in
  `localStorage.preferredLang`; otherwise a browser whose preferred language is
  Czech (`navigator.languages[0]` starts with `cs`) gets Czech and every other
  browser gets English. Detection runs on every visit.
- Switching translates the page in place and updates the address bar with
  `history.replaceState` (`/about-me` <-> `/o-mne`; `/` is shared). `file://`
  previews keep the `.html` file names.
- When adding or changing text:
  - add the key to both `en` and `cs` in `translations.js`;
  - keep the static HTML identical to `translations.en` (crawlers and link
    previews read the static HTML);
  - CV links use the `cv.file` key, which also sets the `download` file name.

## Routing (.htaccess)

Production is Apache 2.4 behind an OpenResty proxy that terminates TLS.

- `http://` and `www.` redirect to `https://matejkadlec.cz` (the HTTPS rule
  checks `REQUEST_SCHEME`, which Apache reports correctly behind the proxy).
- `/index.html` -> `/`, `/page.html` -> `/page`, trailing slashes are dropped.
- `/o-mne` is served by `about-me.html`; extensionless top-level paths are
  served from the matching `.html` file.
- Images requested with a foreign `Referer` get 403 (hotlink protection).
- A broken `.htaccess` takes the whole site down (500), so test changes on a
  local Apache 2.4 before deploying.

## SEO

- Each page has a canonical URL, meta description, Open Graph/X tags and
  JSON-LD (`WebSite` + `Person`, plus `ProfilePage` on the About page). The
  `Person` entity is duplicated in both pages; keep them in sync.
- Crawlers render the English version on every URL, so there are no hreflang
  links and `/o-mne` canonicalises to `/about-me`.
- Update `<lastmod>` in `sitemap.xml` when a page or CV changes.
- Keep the heading hierarchy (one `h1` per page, then `h2` sections, `h3`
  entries).

## Caching and assets

- HTML and PDFs are always revalidated; CSS/JS are cached for a month and are
  referenced with a `?v=YYYYMMDD` query. **When you change any CSS or JS file,
  bump the `?v=` value in both HTML files.**
- Images (6 months for JPEG) and fonts are cached long-term: give a replaced
  image a new file name instead of overwriting it.
- Optimize images before adding them (the portrait is a quality-92 JPEG,
  842x842, with an sRGB profile).

## Conventions

- The visual design and behaviour are deliberate; don't change them as a side
  effect of refactoring.
- No jQuery or other runtime dependencies; vanilla JS only. `revealator.js` and
  `custom.js` intentionally run their setup one task after `DOMContentLoaded`
  (like jQuery's `ready()`); otherwise the slide-up animation can be skipped.
- Formatting: Prettier (`prettier --check .`); see `.prettierrc.json` and
  `.prettierignore`. Vendor files are not reformatted.
- Validate HTML with the Nu HTML Checker when changing markup.

## Local preview

- Open `index.html` directly (`file://`) — links switch to the `.html` files.
- Or use a static server with clean URLs, e.g. `npx serve .` (`/o-mne` and the
  `.htaccess` redirects only work on Apache).

## Deployment

There is no deploy workflow in this repository (the GitHub Actions one was
removed), so pushing to `master` doesn't necessarily update the live site;
the production server is updated outside this repository.
