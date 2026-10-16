(function () {
  "use strict";

  var BLOCKS = window.BLOCKS;
  var blockEl = document.getElementById("block");

  if (!BLOCKS || !blockEl) return;

  var switching = false;

  function esc(str) {
    var div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }

  function render(key) {
    var data = BLOCKS[key];
    if (!data) return false;

    var html = "";
    html += '<h1 class="block__title">' + esc(data.title) + "</h1>";
    html += '<svg class="block__ornament" viewBox="0 0 120 12" aria-hidden="true"><use href="#ornament"/></svg>';
    html += '<p class="block__text' + (key === "main" ? " block__text--initial" : "") + '">' +
            esc(data.text) + "</p>";

    if (data.image && data.image.src) {
      html += '<figure class="plate">';
      html += '<span class="plate__frame">';
      html += '<img class="plate__img" src="' + esc(data.image.src) + '" alt="' +
              esc(data.image.caption || data.title) + '" loading="lazy" decoding="async">';
      html += "</span>";
      if (data.image.caption) {
        html += '<figcaption class="plate__caption">' + esc(data.image.caption) + "</figcaption>";
      }
      html += "</figure>";
    }

    html += '<div class="block__buttons">';

    (data.buttons || []).forEach(function (b) {
      var isBack = b.target === "main";
      html += '<button type="button" class="btn' + (isBack ? " btn--back" : "") +
              '" data-target="' + esc(b.target) + '">' + esc(b.label) + "</button>";
    });

    html += "</div>";
    blockEl.innerHTML = html;
    return true;
  }

  function enter() {
    blockEl.classList.add("is-entering");
    blockEl.classList.remove("is-leaving");
    // Класс снимается после завершения CSS-анимаций (последняя: 0.65 + 0.55 = 1.2с)
    setTimeout(function () {
      blockEl.classList.remove("is-entering");
      switching = false;
    }, 1300);
  }

  function show(key, instant) {
    if (switching) return;
    if (!BLOCKS[key]) return;

    if (instant) {
      render(key);
      enter();
      return;
    }

    switching = true;
    blockEl.classList.add("is-leaving");

    setTimeout(function () {
      render(key);
      enter();
      if (blockEl.scrollIntoView) {
        try { blockEl.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (err) {}
      }
    }, 320);
  }

  document.addEventListener("click", function (e) {
    var targetEl = e.target && e.target.closest ? e.target.closest("[data-target]") : null;
    if (!targetEl || !blockEl.contains(targetEl)) return;
    var target = targetEl.getAttribute("data-target");
    if (!target || !BLOCKS[target]) return;
    show(target, false);
  });

  show("main", true);
})();
