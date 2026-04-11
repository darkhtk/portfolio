(function () {
  var roots = document.querySelectorAll("[data-mobile-menu-root]");
  if (!roots.length) return;

  roots.forEach(function (root) {
    var toggle = root.querySelector("[data-mobile-menu-toggle]");
    var close = root.querySelector("[data-mobile-menu-close]");
    var menu = root.querySelector("[data-mobile-menu]");

    if (!toggle || !menu) return;

    function openMenu() {
      menu.classList.remove("hidden");
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
      menu.classList.add("hidden");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
      if (menu.classList.contains("hidden")) {
        openMenu();
        return;
      }
      closeMenu();
    }

    toggle.addEventListener("click", toggleMenu);
    if (close) {
      close.addEventListener("click", closeMenu);
    }

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });
  });
})();
