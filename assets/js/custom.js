(function () {
  "use strict";

  function init() {
    /* ----------------------------------------------------------- */
    /*  FIX REVEALATOR ISSUE AFTER PAGE LOADED
    /* ----------------------------------------------------------- */

    document.querySelectorAll(".revealator-delay1").forEach((element) => {
      element.classList.add("no-transform");
    });

    initHomeScrolling();
  }

  // Short desktop screens (see style.css): when the home content doesn't fit,
  // it gets padding right away (.is-overflowing, re-checked on resize), and
  // the section starts scrolling (.is-scrollable) once the slide-up
  // transition started above (0.1s delay + 0.6s) has finished. Screens the
  // content fits on look exactly as before.
  function initHomeScrolling() {
    const section = document.querySelector(".home .container-home");
    const content = section && section.querySelector(".home-details");

    if (!content) {
      return;
    }

    const update = () => {
      section.classList.toggle(
        "is-overflowing",
        content.offsetHeight > section.clientHeight,
      );
    };

    update();
    window.addEventListener("resize", update);

    if (window.ResizeObserver) {
      new ResizeObserver(update).observe(content);
    }

    setTimeout(() => section.classList.add("is-scrollable"), 1000);
  }

  // Like jQuery 3's ready(): in its own task after DOMContentLoaded (see
  // onReady() in revealator.js for why the timing matters).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init));
  } else {
    setTimeout(init);
  }
})();
