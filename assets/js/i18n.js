(function () {
  "use strict";

  const STORAGE_KEY = "lang";
  const SUPPORTED_LANGS = ["en", "cs"];
  const ROUTE_KEYS = ["route.home", "route.about"];
  const FILE_ROUTE_FALLBACK = {
    "route.home": "index.html",
    "route.about": "about-me.html"
  };
  const ROUTE_ALIASES = {
    "route.home": ["/", "/index", "/index.html"],
    "route.about": ["/about-me", "/about-me/", "/about-me.html", "/o-mne", "/o-mne/", "/o-mne.html"]
  };

  let currentLang = "en";

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

  function detectDefaultLang() {
    const savedLang = getSavedLang();
    if (savedLang) {
      return savedLang;
    }

    const browserLang = (navigator.language || "").toLowerCase();
    if (browserLang.startsWith("cs")) {
      return "cs";
    }

    return "en";
  }

  function getTranslationByLang(lang, key) {
    const translations = window.TRANSLATIONS || {};
    const selected = translations[lang] || {};
    const english = translations.en || {};

    if (Object.prototype.hasOwnProperty.call(selected, key)) {
      return selected[key];
    }

    if (Object.prototype.hasOwnProperty.call(english, key)) {
      return english[key];
    }

    return "";
  }

  function getTranslation(key) {
    return getTranslationByLang(currentLang, key);
  }

  function isFileProtocol() {
    return window.location.protocol === "file:";
  }

  function normalizePath(pathname) {
    if (!pathname) {
      return "/";
    }

    let path = pathname;

    try {
      if (/^https?:\/\//i.test(path)) {
        path = new URL(path).pathname;
      }
    } catch (error) {
      return "/";
    }

    if (!path.startsWith("/")) {
      path = `/${path}`;
    }

    path = path.replace(/\/+$/, "");

    return path || "/";
  }

  function getRouteKeyForPath(pathname) {
    if (isFileProtocol()) {
      const fileName = getBasename(pathname).toLowerCase();

      if (!fileName || fileName === "index" || fileName === "index.html") {
        return "route.home";
      }

      if (
        fileName === "about-me" ||
        fileName === "about-me.html" ||
        fileName === "o-mne" ||
        fileName === "o-mne.html"
      ) {
        return "route.about";
      }
    }

    const normalizedPath = normalizePath(pathname);

    for (const routeKey of ROUTE_KEYS) {
      const candidates = new Set(ROUTE_ALIASES[routeKey] || []);

      for (const lang of SUPPORTED_LANGS) {
        const localizedPath = getTranslationByLang(lang, routeKey);
        if (localizedPath) {
          candidates.add(localizedPath);
        }
      }

      for (const candidate of candidates) {
        if (normalizePath(candidate) === normalizedPath) {
          return routeKey;
        }
      }
    }

    return null;
  }

  function getBasename(pathValue) {
    if (!pathValue) {
      return "";
    }

    const withoutHash = pathValue.split("#")[0];
    const withoutQuery = withoutHash.split("?")[0];
    const segments = withoutQuery.split("/").filter(Boolean);

    return segments.length ? segments[segments.length - 1] : "";
  }

  function isDownloadableFile(pathValue) {
    const filename = getBasename(pathValue).toLowerCase();
    return /\.(pdf|doc|docx|zip|rar|7z)$/i.test(filename);
  }

  function applyTranslatedAttributes(attrName) {
    document.querySelectorAll(`[data-i18n-${attrName}]`).forEach((element) => {
      const key = element.getAttribute(`data-i18n-${attrName}`);
      const value = getTranslation(key);

      if (value) {
        element.setAttribute(attrName, value);
      }
    });
  }

  function resolveLocalizedHref(key) {
    const translatedHref = getTranslation(key);

    if (!translatedHref) {
      return "";
    }

    if (key.startsWith("route.") && isFileProtocol()) {
      return FILE_ROUTE_FALLBACK[key] || translatedHref;
    }

    return translatedHref;
  }

  function translatePage() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const value = getTranslation(key);

      if (!value) {
        return;
      }

      const shouldUseHtml =
        element.getAttribute("data-i18n-html") === "true" || /<[^>]+>/.test(value);

      if (shouldUseHtml) {
        element.innerHTML = value;
      } else {
        element.textContent = value;
      }
    });

    applyTranslatedAttributes("title");
    applyTranslatedAttributes("alt");
    applyTranslatedAttributes("placeholder");

    document.querySelectorAll("a[data-i18n-href]").forEach((element) => {
      const key = element.getAttribute("data-i18n-href");
      const hrefValue = resolveLocalizedHref(key);

      if (!hrefValue) {
        return;
      }

      element.setAttribute("href", hrefValue);

      if (isDownloadableFile(hrefValue)) {
        const filename = getBasename(hrefValue);
        element.setAttribute("download", filename);
      } else if (element.hasAttribute("download")) {
        element.removeAttribute("download");
      }
    });
  }

  function updateSwitcherState() {
    const buttons = document.querySelectorAll("#lang-switcher .lang-option[data-lang]");

    buttons.forEach((button) => {
      const isActive = button.getAttribute("data-lang") === currentLang;
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function toAbsoluteUrl(pathValue) {
    try {
      const base = isFileProtocol() ? window.location.href : window.location.origin;
      return new URL(pathValue, base).toString();
    } catch (error) {
      return window.location.href;
    }
  }

  function upsertAlternateLink(lang, href) {
    let link = document.head.querySelector(
      `link[rel="alternate"][hreflang="${lang}"][data-i18n-alternate="true"]`
    );

    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", lang);
      link.setAttribute("data-i18n-alternate", "true");
      document.head.appendChild(link);
    }

    link.setAttribute("href", href);
  }

  function updateAlternateHreflangLinks() {
    if (isFileProtocol()) {
      return;
    }

    const routeKey = getRouteKeyForPath(window.location.pathname);

    if (!routeKey) {
      const currentUrl = toAbsoluteUrl(window.location.pathname);
      upsertAlternateLink("en", currentUrl);
      upsertAlternateLink("cs", currentUrl);
      return;
    }

    const enHref = getTranslationByLang("en", routeKey);
    const csHref = getTranslationByLang("cs", routeKey);

    upsertAlternateLink("en", toAbsoluteUrl(enHref || window.location.pathname));
    upsertAlternateLink("cs", toAbsoluteUrl(csHref || window.location.pathname));
  }

  function redirectToLocalizedRoute(lang) {
    const routeKey = getRouteKeyForPath(window.location.pathname);

    if (!routeKey) {
      return;
    }

    const localizedPath = isFileProtocol()
      ? FILE_ROUTE_FALLBACK[routeKey] || getTranslationByLang(lang, routeKey)
      : getTranslationByLang(lang, routeKey);

    if (!localizedPath) {
      return;
    }

    if (isFileProtocol()) {
      const currentFile = (getBasename(window.location.pathname) || "index.html").toLowerCase();
      const targetFile = (getBasename(localizedPath) || "index.html").toLowerCase();

      if (currentFile === targetFile) {
        return;
      }
    } else if (normalizePath(localizedPath) === normalizePath(window.location.pathname)) {
      return;
    }

    const base = isFileProtocol() ? window.location.href : window.location.origin;
    const targetUrl = new URL(localizedPath, base);
    targetUrl.search = window.location.search;
    targetUrl.hash = window.location.hash;

    window.location.assign(targetUrl.toString());
  }

  function setLang(lang, options = {}) {
    const normalizedLang = SUPPORTED_LANGS.includes(lang) ? lang : "en";

    currentLang = normalizedLang;
    document.documentElement.lang = normalizedLang;
    translatePage();
    saveLang(normalizedLang);
    updateSwitcherState();
    updateAlternateHreflangLinks();

    if (options.redirect === true) {
      redirectToLocalizedRoute(normalizedLang);
    }
  }

  function attachSwitcherHandlers() {
    const buttons = document.querySelectorAll("#lang-switcher .lang-option[data-lang]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextLang = button.getAttribute("data-lang");

        if (!nextLang || nextLang === currentLang) {
          return;
        }

        setLang(nextLang, { redirect: true });
      });
    });
  }

  function injectSwitcherStyles() {
    if (document.getElementById("lang-switcher-style")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "lang-switcher-style";
    style.textContent = `
      #lang-switcher {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 1100;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #lang-switcher .lang-option {
        background: transparent;
        border: 0;
        padding: 0;
        line-height: 0;
        opacity: 0.55;
        transition: opacity 0.2s ease;
      }
      #lang-switcher .lang-option img {
        display: block;
        width: 40px;
        height: auto;
      }
      #lang-switcher .lang-option[aria-pressed="true"] {
        opacity: 1;
        cursor: default;
      }
      #lang-switcher .lang-option[aria-pressed="false"] {
        cursor: pointer;
      }
      #lang-switcher .lang-option[aria-pressed="false"]:hover {
        opacity: 0.85;
      }
      @media (max-width: 991.98px) {
        #lang-switcher {
          left: 16px;
          right: auto;
          top: 16px;
        }
        #lang-switcher .lang-option img {
          width: 32px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function initI18n() {
    if (!window.TRANSLATIONS) {
      return;
    }

    injectSwitcherStyles();
    attachSwitcherHandlers();

    const defaultLang = detectDefaultLang();
    setLang(defaultLang, { redirect: false });
  }

  window.initI18n = initI18n;
  window.getSavedLang = getSavedLang;
  window.saveLang = saveLang;
  window.detectDefaultLang = detectDefaultLang;
  window.setLang = setLang;
  window.translatePage = translatePage;

  document.addEventListener("DOMContentLoaded", initI18n);
})();
