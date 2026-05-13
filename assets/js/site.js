// === 가로 스크롤 영역 드래그 지원 ===
// .h-scroll 또는 [data-h-drag] 컨테이너를 마우스 클릭+드래그로 좌우 스크롤할 수 있게 한다.
// 터치는 브라우저 기본 동작이 이미 잘 되어 있어 건드리지 않음.
(function () {
  var scrollers = document.querySelectorAll(".h-scroll, [data-h-drag]");
  if (!scrollers.length) return;

  scrollers.forEach(function (el) {
    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    var moved = false;
    var DRAG_THRESHOLD = 5; // px

    el.style.cursor = "grab";
    el.style.userSelect = "auto";

    el.addEventListener("mousedown", function (e) {
      // 링크/버튼 내부 클릭은 그대로 두기 — 단, 드래그가 시작되면 클릭 차단
      isDown = true;
      moved = false;
      startX = e.pageX - el.offsetLeft;
      startScroll = el.scrollLeft;
      el.style.cursor = "grabbing";
    });

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = "grab";
    }

    el.addEventListener("mouseleave", endDrag);
    el.addEventListener("mouseup", endDrag);

    el.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      var x = e.pageX - el.offsetLeft;
      var walk = x - startX;
      if (Math.abs(walk) > DRAG_THRESHOLD) {
        moved = true;
        el.style.userSelect = "none";
      }
      el.scrollLeft = startScroll - walk;
    });

    // 드래그로 이동한 직후의 click 은 무효화 (figure 안의 a 태그가 의도치 않게 열리는 것 방지)
    el.addEventListener("click", function (e) {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    }, true);

    // 휠 수직 스크롤을 수평 스크롤로 매핑 (Shift 없이도 동작) — 데스크톱 편의성
    el.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  });
})();

// === 모바일 메뉴 ===
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
