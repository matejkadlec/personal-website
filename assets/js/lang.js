// Language selection. Every page exists in English and Czech as a static
// HTML file; the counterparts are linked with <link rel="alternate"
// hreflang> in <head>. Visitors are sent to the page in their language: a
// language picked with the flags wins, otherwise Czech browsers get Czech and
// every other browser English. Crawlers are never redirected, so search
// engines can index both versions.
//
// Loaded synchronously in <head>, right after the hreflang links, so the
// redirect happens before the page renders.
(function () {
  "use strict";

  const STORAGE_KEY = "preferredLang";
  // Older versions stored the auto-detected language under this key too.
  const LEGACY_STORAGE_KEY = "lang";
  const SUPPORTED_LANGS = ["en", "cs"];
  // Local file:// previews use the HTML file names instead of clean URLs.
  const FILE_NAMES = {
    "/": "index.html",
    "/about-me": "about-me.html",
    "/cs": "cs.html",
    "/o-mne": "o-mne.html",
  };
  const CRAWLER_PATTERN = /bot|crawl|spider|slurp|lighthouse|inspectiontool/i;

  function getSavedLang() {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGS.includes(savedLang) ? savedLang : null;
    } catch (error) {
      return null;
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // Ignore storage errors (private mode, blocked storage, etc.)
    }
  }

  function clearLegacyLang() {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (error) {
      // Ignore storage errors (private mode, blocked storage, etc.)
    }
  }

  // Czech browsers get Czech, every other browser language gets English.
  function detectBrowserLang() {
    const preferred =
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      "";
    return preferred.toLowerCase().startsWith("cs") ? "cs" : "en";
  }

  function isFileProtocol() {
    return window.location.protocol === "file:";
  }

  // Turns an absolute URL of this site into a link that works where the page
  // is opened: a path on the current origin (also localhost) or, on file://,
  // the HTML file.
  function toLocalHref(url) {
    const path = new URL(url).pathname;
    return isFileProtocol() ? FILE_NAMES[path] : path;
  }

  // Navigation within the site (e.g. a flag click) is never redirected, so
  // switching works even when localStorage is blocked.
  function cameFromThisSite() {
    try {
      return new URL(document.referrer).origin === window.location.origin;
    } catch (error) {
      return false;
    }
  }

  function redirectToPreferredLang() {
    const preferredLang = getSavedLang() || detectBrowserLang();

    if (
      preferredLang === document.documentElement.lang ||
      CRAWLER_PATTERN.test(navigator.userAgent) ||
      cameFromThisSite()
    ) {
      return false;
    }

    const alternate = document.querySelector(
      `link[rel="alternate"][hreflang="${preferredLang}"]`,
    );
    const target = alternate && toLocalHref(alternate.href);

    if (!target) {
      return false;
    }

    window.location.replace(
      target + window.location.search + window.location.hash,
    );
    return true;
  }

  function init() {
    document.querySelectorAll("#lang-switcher a[hreflang]").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (link.getAttribute("aria-current") === "page") {
          event.preventDefault();
          return;
        }

        saveLang(link.getAttribute("hreflang"));
      });
    });

    if (isFileProtocol()) {
      document.querySelectorAll('a[href^="/"]').forEach((link) => {
        const fileName = FILE_NAMES[link.getAttribute("href")];

        if (fileName) {
          link.setAttribute("href", fileName);
        }
      });
    }
  }

  clearLegacyLang();

  if (!redirectToPreferredLang()) {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
