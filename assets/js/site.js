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

    el.querySelectorAll("img").forEach(function (img) {
      img.setAttribute("draggable", "false");
    });
    el.addEventListener("dragstart", function (e) { e.preventDefault(); });

    el.addEventListener("mousedown", function (e) {
      // 링크/버튼 내부 클릭은 그대로 두기 — 단, 드래그가 시작되면 클릭 차단
      if (e.target && e.target.tagName === "IMG") {
        e.preventDefault();
      }
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

// === 포트폴리오 방문 추적 ===
(function () {
  var endpoint = "https://semirain.synology.me:3443/track";
  var productionHost = "darkhtk.github.io";
  var params = new URLSearchParams(window.location.search || "");
  var debug = params.get("tracker_debug") === "1";
  var force = params.get("tracker_force") === "1";

  if (!force && window.location.hostname !== productionHost) return;

  var storageKey = "portfolio_tracker_visitor_id";
  var excludeKey = "portfolio_tracker_exclude";
  var testId = params.get("tracker_test") || "";
  var sessionKey = [
    "portfolio_tracker_sent_v2",
    window.location.pathname,
    testId
  ].join(":");

  function log() {
    if (!debug || !window.console) return;
    console.log.apply(console, ["[portfolio-tracker]"].concat([].slice.call(arguments)));
  }

  if (params.get("tracker_exclude") === "1") {
    window.localStorage.setItem(excludeKey, "true");
    log("현재 브라우저 추적 제외");
    return;
  }

  if (params.get("tracker_exclude") === "0") {
    window.localStorage.removeItem(excludeKey);
    log("현재 브라우저 추적 재개");
  }

  if (window.localStorage.getItem(excludeKey) === "true") {
    log("건너뜀: 현재 브라우저가 제외됨");
    return;
  }

  if (window.sessionStorage.getItem(sessionKey) === "1") {
    log("건너뜀: 이 세션에서 이미 전송됨");
    return;
  }

  function getVisitorId() {
    var visitorId = window.localStorage.getItem(storageKey);
    if (visitorId) return visitorId;
    visitorId = window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : "visitor-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    window.localStorage.setItem(storageKey, visitorId);
    return visitorId;
  }

  function makePayload(reason) {
    return {
      path: window.location.pathname + window.location.search,
      title: document.title || "",
      referrer: document.referrer || "",
      visitorId: getVisitorId(),
      screen: window.screen ? window.screen.width + "x" + window.screen.height : "",
      language: navigator.language || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      testId: testId,
      reason: reason || "페이지 로드",
      clientVersion: "site-v2"
    };
  }

  function markSent() {
    window.sessionStorage.setItem(sessionKey, "1");
  }

  function send(reason) {
    if (window.sessionStorage.getItem(sessionKey) === "1") return Promise.resolve();
    var payload = makePayload(reason);
    log("전송 중", payload);

    return window.fetch(endpoint, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return response.json().catch(function () { return { ok: true }; });
    }).then(function (body) {
      if (!body || body.ok !== true) {
        throw new Error("추적 서버가 요청을 거부함");
      }
      markSent();
      log("기록 완료", body);
    }).catch(function (error) {
      log("기록 실패", error && error.message ? error.message : error);
    });
  }

  function schedule() {
    window.setTimeout(function () { send("페이지 로드"); }, 400);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule, { once: true });
  } else {
    schedule();
  }

  window.PORTFOLIO_TRACKER = {
    send: send,
    getVisitorId: function () { return window.localStorage.getItem(storageKey); },
    excludeThisBrowser: function () { window.localStorage.setItem(excludeKey, "true"); },
    includeThisBrowser: function () { window.localStorage.removeItem(excludeKey); }
  };
})();
