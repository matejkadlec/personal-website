(function () {
  "use strict";

  function init() {
    /* ----------------------------------------------------------- */
    /*  FIX REVEALATOR ISSUE AFTER PAGE LOADED
    /* ----------------------------------------------------------- */

    document.querySelectorAll(".revealator-delay1").forEach((element) => {
      element.classList.add("no-transform");
    });

    // Let the home section scroll on short screens (see style.css) once the
    // slide-up transition (0.1s delay + 0.6s) started above has finished.
    setTimeout(enableHomeScrolling, 1000);
  }

  // The section only becomes scrollable (and gets its padding) when the
  // content doesn't fit, so screens it fits on look exactly as before.
  function enableHomeScrolling() {
    const section = document.querySelector(".home .container-home");
    const content = section && section.querySelector(".home-details");

    if (!content) {
      return;
    }

    const update = () => {
      section.classList.toggle(
        "is-scrollable",
        content.offsetHeight > section.clientHeight,
      );
    };

    update();
    window.addEventListener("resize", update);

    if (window.ResizeObserver) {
      new ResizeObserver(update).observe(content);
    }
  }

  // Like jQuery 3's ready(): in its own task after DOMContentLoaded (see
  // onReady() in revealator.js for why the timing matters).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init));
  } else {
    setTimeout(init);
  }
})();
