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
    updateAges();
  }

  // The home pages state the age from data-birthdate (YYYY-MM-DD); the number
  // in the HTML is only the fallback for crawlers and visitors without JS.
  function updateAges() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    document.querySelectorAll(".js-age[data-birthdate]").forEach((element) => {
      const [year, birthMonth, birthDay] = element.dataset.birthdate
        .split("-")
        .map(Number);
      let age = today.getFullYear() - year;

      if (month < birthMonth || (month === birthMonth && day < birthDay)) {
        age -= 1;
      }

      if (age > 0) {
        element.textContent = age;
      }
    });
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
