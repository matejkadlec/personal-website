// Scroll reveal animations: a dependency-free port of the fm.revealator
// jQuery plugin with the same classes and behaviour. Every element with a
// "revealator-*" class gets a position class describing where it is relative
// to the viewport, and revealator.min.css animates it accordingly. Elements
// with "revealator-once" stay revealed after entering the viewport.
(function () {
  "use strict";

  const POSITION_CLASSES = [
    "revealator-below",
    "revealator-partially-below",
    "revealator-within",
    "revealator-partially-above",
    "revealator-above",
  ];
  const REFRESH_DELAY_MS = 150;

  let refreshPending = false;

  function getPositionClass(rect, viewportHeight) {
    if (rect.top > viewportHeight && rect.bottom > viewportHeight) {
      return "revealator-below";
    }
    if (rect.top < viewportHeight && rect.bottom > viewportHeight) {
      return "revealator-partially-below";
    }
    if (rect.top < 0 && rect.bottom > 0) {
      return "revealator-partially-above";
    }
    if (rect.top < 0 && rect.bottom < 0) {
      return "revealator-above";
    }
    return "revealator-within";
  }

  function setPositionClass(element, positionClass) {
    element.classList.remove(...POSITION_CLASSES);
    element.classList.add(positionClass);
  }

  function refresh() {
    const viewportHeight = document.documentElement.clientHeight;

    document.querySelectorAll('[class*="revealator"]').forEach((element) => {
      const classes = element.classList;
      const positionClass = getPositionClass(
        element.getBoundingClientRect(),
        viewportHeight,
      );

      if (classes.contains(positionClass)) {
        return;
      }

      if (!classes.contains("revealator-once")) {
        setPositionClass(element, positionClass);
        return;
      }

      if (!classes.contains("revealator-within")) {
        setPositionClass(element, positionClass);
      }
      if (
        classes.contains("revealator-partially-above") ||
        classes.contains("revealator-above")
      ) {
        classes.add("revealator-within");
      }
    });
  }

  // Throttled like the original: at most one refresh per 150 ms.
  function scheduleRefresh() {
    if (refreshPending) {
      return;
    }

    refreshPending = true;
    setTimeout(() => {
      refreshPending = false;
      refresh();
    }, REFRESH_DELAY_MS);
  }

  ["scroll", "resize", "load"].forEach((eventName) => {
    window.addEventListener(eventName, scheduleRefresh, { passive: true });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRefresh);
  } else {
    scheduleRefresh();
  }
})();
