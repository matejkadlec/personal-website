# Agent Information

Personal website of Matěj Kadlec, live at https://matejkadlec.cz. A static,
bilingual (English/Czech) site: plain HTML, Bootstrap 4 CSS and vanilla
JavaScript (ES2015+). There is no build step, package manager or framework;
files are served exactly as they are in the repository.

`CLAUDE.md` is a symlink to this file.

## Structure

```
index.html              Home page, English (served at /)
about-me.html           About page, English (served at /about-me)
cs.html                 Home page, Czech (served at /cs)
o-mne.html              About page, Czech (served at /o-mne)
.htaccess               Apache config: canonical redirects, clean URLs, caching
sitemap.xml, robots.txt Crawler files
manifest.json           Web app manifest
assets/css/style.css    Site styles (derived from the "Tunis" template)
assets/css/*            Vendor CSS: Bootstrap, Font Awesome, preloader,
                        revealator (scroll animations)
assets/js/lang.js       Redirect to the visitor's language, flag switcher
assets/js/revealator.js Scroll reveal animations (vanilla port of a jQuery plugin)
assets/js/custom.js     Removes the slide-up offset once the page is ready;
                        home page scrolling on short desktop screens
assets/js/preloader.min.js  Full-screen preloader until window load
assets/img/             Portrait, logo, flags, favicons
assets/cv/              CV PDFs (CV_Matej_Kadlec.pdf = EN, CV_Matěj_Kadlec.pdf = CS)
assets/fonts/           Font Awesome 4.7 webfonts
```

## Languages

- Every page exists twice, as complete static HTML: English (`index.html`,
  `about-me.html`) and Czech (`cs.html`, `o-mne.html`). Each has its own
  `<html lang>`, title, meta description, canonical URL, Open Graph locale and
  JSON-LD, and the pairs are linked with `<link rel="alternate" hreflang>`
  (`en`, `cs`, and `x-default` = English).
- `lang.js` runs synchronously in `<head>`, right after the hreflang links,
  and sends the visitor to the counterpart page (`location.replace`) when the
  page isn't in their language. Their language is the one picked with the
  flags (`localStorage.preferredLang`), otherwise Czech if the browser's
  preferred language (`navigator.languages[0]`) starts with `cs`, else English.
  Never redirected: crawlers (user agent pattern in `lang.js`, so search
  engines index both versions) and navigation from within the site (so the
  flags work even when localStorage is blocked; not on `file://`, which has
  no referrer).
- The flags are links to the counterpart page; the current language has
  `aria-current="page"`, and clicking the other one stores the choice.
- On `file://`, `lang.js` rewrites the root-relative page links (`/`,
  `/about-me`, `/cs`, `/o-mne`) to the `.html` files (`FILE_NAMES`).
- When changing content, edit both language versions and keep their markup
  identical apart from the text, so both render the same. A new page needs
  both files, hreflang links in both, an entry in `FILE_NAMES` in `lang.js`
  and in `sitemap.xml`.
- Skills are tags grouped by area (`.skill-group` > `.skill-list`), sorted
  from expert to proficient within each group. The level is the tag's class
  (`skill-expert` filled, `skill-advanced` outlined, `skill-proficient`
  muted) plus a screen-reader prefix (`<span class="sr-only">Expert: </span>`);
  change both, in both `about-me.html` and `o-mne.html` (Czech level names:
  Expert, Pokročilý, Zdatný). The JSON-LD `knowsAbout` list names the main
  skills and is the same in all four pages; update it if a main skill is
  added or removed.

## Routing (.htaccess)

Production is Apache 2.4 behind an OpenResty proxy that terminates TLS.

- `http://` and `www.` redirect to `https://matejkadlec.cz` (the HTTPS rule
  checks `REQUEST_SCHEME`, which Apache reports correctly behind the proxy).
- `/index.html` -> `/`, `/page.html` -> `/page`, trailing slashes are dropped.
- Extensionless top-level paths are served from the matching `.html` file
  (`/about-me`, `/cs`, `/o-mne`).
- A broken `.htaccess` takes the whole site down (500), so test changes on a
  local Apache 2.4 before deploying. Probe it with curl:
  - the clean-URL, `.html` and trailing-slash rules don't check the host, so
    any Host (e.g. localhost) works;
  - the canonical redirects only fire for `-H 'Host: www.matejkadlec.cz'` and,
    on plain http, `-H 'Host: matejkadlec.cz'` (every request then 301s to
    https), so test them separately.

## SEO

- Each page has its own canonical URL, hreflang links, meta description, Open
  Graph/X tags and JSON-LD (`WebSite` + `Person`, plus `ProfilePage` on the
  About pages). The `WebSite` and `Person` entities are duplicated in all four
  pages (Czech pages have a Czech `jobTitle`, `description` and school name),
  and `og:title`/`og:description` mirror `<title>`/the meta description; keep
  them in sync.
- Update `<lastmod>` in `sitemap.xml` when a page or CV changes.
- Keep the heading hierarchy (one `h1` per page, then `h2` sections, `h3`
  entries).

## Caching and assets

- HTML and PDFs are always revalidated; CSS/JS are cached for a month and are
  referenced with a `?v=YYYYMMDD` query. **When you change any CSS or JS file,
  bump the `?v=` value in all four HTML files** (to today's date, or add a
  suffix such as `20261026b` if that value is already live).
- Images (6 months for JPEG) and fonts are cached long-term: give a replaced
  image a new file name instead of overwriting it. The portrait's URL is used
  in: the `<img>` in `index.html` and `cs.html` (with width/height), the
  `style.css` background (then bump `?v=`), `og:image` (+ width/height) and
  the JSON-LD `Person.image` in all four pages, and as the target of the
  `.htaccess` redirect from the old `portrait.png` URL (keep that redirect).
- Optimize images before adding them (the portrait is a quality-92 JPEG,
  842x842, with an sRGB profile).

## Conventions

- The visual design and behaviour are deliberate; don't change them as a side
  effect of refactoring.
- No jQuery or other runtime dependencies; vanilla JS only. `revealator.js` and
  `custom.js` intentionally run their setup one task after `DOMContentLoaded`
  (like jQuery's `ready()`); otherwise the slide-up animation can be skipped.
- Home page on desktops (>= 992px): the page itself never scrolls
  (`body.home { overflow: hidden }`). `custom.js` toggles `.is-overflowing`
  on the home section (`.container-home`) whenever the content is taller than
  the screen (40px top/bottom padding; re-checked on resize) and adds
  `.is-scrollable` after a fixed 1s, once the slide-up (0.1s delay + 0.6s) is
  over; the section scrolls only with both classes, so no scrollbar flashes
  during the animation. Keep the 1s in step with the animation.
- The age on the home pages is a `<span class="js-age" data-birthdate>`;
  `custom.js` replaces the number with the age computed from the birth date,
  and the number in the HTML is only the fallback for crawlers and visitors
  without JavaScript (bump it when convenient, it is not load-bearing).
- Formatting: Prettier 3 with default options (`npx prettier@3 --check .`);
  vendor files are excluded in `.prettierignore`.
- Validate HTML with the Nu HTML Checker when changing markup.

## Local preview

- Open any page directly (`file://`): `lang.js` redirects and rewrites links to
  the `.html` files.
- Or use a static server with clean URLs, e.g. `npx serve .` (all four pages
  work; the `.htaccess` redirects only work on Apache).

## Deployment

There is no deploy workflow in this repository (the GitHub Actions one was
removed), so pushing to `master` doesn't necessarily update the live site;
the production server is updated outside this repository.
