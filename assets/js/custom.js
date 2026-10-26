(function () {
  "use strict";

  function init() {
    /* ----------------------------------------------------------- */
    /*  FIX REVEALATOR ISSUE AFTER PAGE LOADED
    /* ----------------------------------------------------------- */

    document.querySelectorAll(".revealator-delay1").forEach((element) => {
      element.classList.add("no-transform");
    });
  }

  // Like jQuery 3's ready(): in its own task after DOMContentLoaded (see
  // onReady() in revealator.js for why the timing matters).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init));
  } else {
    setTimeout(init);
  }
})();
