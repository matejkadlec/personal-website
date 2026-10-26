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
    const homeSection = document.querySelector(".home .container-home");

    if (homeSection) {
      setTimeout(() => homeSection.classList.add("is-scrollable"), 1000);
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
