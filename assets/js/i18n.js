(function () {
  "use strict";

  // Only a language picked manually via the flags is stored; otherwise the
  // browser language decides. "lang" is the key older versions used to store
  // the auto-detected language too, so it is dropped to let detection apply.
  const STORAGE_KEY = "preferredLang";
  const LEGACY_STORAGE_KEY = "lang";
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

  function clearLegacyLang() {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch (error) {
      // Ignore storage errors (private mode, blocked storage, etc.)
    }
  }

  // Czech browsers get Czech, every other browser language gets English.
  function detectBrowserLang() {
    const preferred = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return preferred.toLowerCase().startsWith("cs") ? "cs" : "en";
  }

  function detectDefaultLang() {
    return getSavedLang() || detectBrowserLang();
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
    applyTranslatedAttributes("aria-label");

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

  // Returns the URL of the current page in the given language, or null when
  // the page has no localized route or the current URL already matches it.
  function getLocalizedRouteUrl(lang) {
    const routeKey = getRouteKeyForPath(window.location.pathname);
    const localizedPath = routeKey ? getTranslationByLang(lang, routeKey) : "";

    if (
      !localizedPath ||
      normalizePath(localizedPath) === normalizePath(window.location.pathname)
    ) {
      return null;
    }

    const targetUrl = new URL(localizedPath, window.location.origin);
    targetUrl.search = window.location.search;
    targetUrl.hash = window.location.hash;

    return targetUrl.toString();
  }

  // Both routes of a page are served by the same HTML file, so the address
  // bar can switch to the localized route (e.g. /about-me -> /o-mne) without
  // a reload. Local file:// previews keep their .html file names.
  function replaceWithLocalizedRoute(lang) {
    if (isFileProtocol()) {
      return;
    }

    const targetUrl = getLocalizedRouteUrl(lang);

    if (targetUrl) {
      window.history.replaceState(window.history.state, "", targetUrl);
    }
  }

  function setLang(lang, options = {}) {
    const normalizedLang = SUPPORTED_LANGS.includes(lang) ? lang : "en";

    currentLang = normalizedLang;
    document.documentElement.lang = normalizedLang;
    translatePage();
    updateSwitcherState();
    replaceWithLocalizedRoute(normalizedLang);

    if (options.persist === true) {
      saveLang(normalizedLang);
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

        setLang(nextLang, { persist: true });
      });
    });
  }

  function initI18n() {
    if (!window.TRANSLATIONS) {
      return;
    }

    attachSwitcherHandlers();
    clearLegacyLang();

    setLang(detectDefaultLang());
  }

  document.addEventListener("DOMContentLoaded", initI18n);
})();
