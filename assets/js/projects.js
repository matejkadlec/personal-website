// Projects page: each featured project has a screenshot gallery (the
// thumbnails switch the large screenshot) and the large screenshot opens a
// lightbox that steps through the whole gallery (arrow keys, Esc closes).
(function () {
  "use strict";

  function initGallery(gallery, openLightbox) {
    const shot = gallery.querySelector(".project-shot");
    const image = shot.querySelector("img");
    const thumbs = Array.from(gallery.querySelectorAll(".project-thumb"));
    const projectName = image.alt.split(" – ")[0];

    function select(index) {
      const thumb = thumbs[index];

      thumbs.forEach((item, i) => {
        item.setAttribute("aria-pressed", String(i === index));
      });
      image.src = thumb.dataset.full;
      image.alt = `${projectName} – ${thumb.dataset.caption}`;
      shot.dataset.index = String(index);
      shot.setAttribute(
        "aria-label",
        `${shot.dataset.label}: ${thumb.dataset.caption}`,
      );
    }

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => select(index));
    });

    shot.addEventListener("click", () => {
      openLightbox(thumbs, Number(shot.dataset.index) || 0, select, shot);
    });
  }

  function createLightbox(dialog) {
    const image = document.createElement("img");
    image.className = "lightbox-img";
    image.alt = "";
    dialog.querySelector(".lightbox-figure").prepend(image);
    const text = dialog.querySelector(".lightbox-text");
    const count = dialog.querySelector(".lightbox-count");
    let items = [];
    let index = 0;
    let onChange = null;
    let opener = null;

    function show(newIndex) {
      index = (newIndex + items.length) % items.length;
      const item = items[index];
      image.src = item.dataset.full;
      image.alt = item.dataset.caption;
      text.textContent = item.dataset.caption;
      count.textContent = `${index + 1} / ${items.length}`;
      onChange(index);
    }

    dialog
      .querySelector(".lightbox-prev")
      .addEventListener("click", () => show(index - 1));
    dialog
      .querySelector(".lightbox-next")
      .addEventListener("click", () => show(index + 1));
    dialog
      .querySelector(".lightbox-close")
      .addEventListener("click", () => dialog.close());

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        show(index - 1);
      } else if (event.key === "ArrowRight") {
        show(index + 1);
      }
    });

    // A click on the dark backdrop (outside the screenshot and buttons)
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("lightbox-open");
      if (opener) {
        opener.focus();
      }
    });

    return function open(thumbs, startIndex, select, shot) {
      items = thumbs;
      onChange = select;
      opener = shot;
      show(startIndex);
      document.documentElement.classList.add("lightbox-open");
      dialog.showModal();
    };
  }

  function init() {
    const dialog = document.getElementById("lightbox");
    const canOpen = dialog && typeof dialog.showModal === "function";
    const openLightbox = canOpen ? createLightbox(dialog) : () => {};

    document.querySelectorAll("[data-gallery]").forEach((gallery) => {
      initGallery(gallery, openLightbox);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
