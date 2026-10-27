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
      openLightbox({
        items: thumbs,
        index: Number(shot.dataset.index) || 0,
        name: projectName,
        onChange: select,
        opener: shot,
      });
    });
  }

  function createLightbox(dialog) {
    // The caption describes the screenshot, so the image itself has no alt
    const image = document.createElement("img");
    image.className = "lightbox-img";
    image.alt = "";
    dialog.querySelector(".lightbox-figure").prepend(image);

    const text = dialog.querySelector(".lightbox-text");
    const count = dialog.querySelector(".lightbox-count");
    const baseLabel = dialog.getAttribute("aria-label");
    let items = [];
    let index = 0;
    let onChange = null;
    let opener = null;
    let pending = null;

    // The browser keeps showing the previous image until the next one has
    // loaded, so the caption and counter change only once it is there
    function showText() {
      if (!pending) {
        return;
      }
      text.textContent = pending.dataset.caption;
      count.textContent = `${items.indexOf(pending) + 1} / ${items.length}`;
      image.classList.remove("is-loading");
      pending = null;
    }

    image.addEventListener("load", showText);
    image.addEventListener("error", showText);

    function preload(item) {
      new Image().src = item.dataset.full;
    }

    function show(newIndex) {
      index = (newIndex + items.length) % items.length;
      const item = items[index];
      const url = item.dataset.full;

      pending = item;
      if (image.getAttribute("src") === url && image.complete) {
        showText();
      } else {
        image.classList.add("is-loading");
        image.src = url;
      }
      onChange(index);

      if (items.length > 1) {
        preload(items[(index + 1) % items.length]);
        preload(items[(index - 1 + items.length) % items.length]);
      }
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

    return function open(gallery) {
      items = gallery.items;
      onChange = gallery.onChange;
      opener = gallery.opener;
      dialog.setAttribute("aria-label", `${baseLabel}: ${gallery.name}`);
      show(gallery.index);
      document.documentElement.classList.add("lightbox-open");
      dialog.showModal();
    };
  }

  // Browsers without <dialog> open the full-size screenshot instead
  function openImage(gallery) {
    window.location.href = gallery.items[gallery.index].dataset.full;
  }

  function init() {
    const dialog = document.getElementById("lightbox");
    const canOpen = dialog && typeof dialog.showModal === "function";
    const openLightbox = canOpen ? createLightbox(dialog) : openImage;

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
