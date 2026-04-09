(function () {
  var endpoint = window.PORTFOLIO_TRACKER_ENDPOINT;
  if (!endpoint) return;

  var storageKey = "portfolio_tracker_visitor_id";
  var excludeKey = "portfolio_tracker_exclude";
  var sessionKey = "portfolio_tracker_sent_" + location.pathname;

  var params = new URLSearchParams(location.search);
  if (params.get("tracker_exclude") === "1") {
    localStorage.setItem(excludeKey, "true");
    params.delete("tracker_exclude");
    history.replaceState({}, document.title, location.pathname + (params.toString() ? "?" + params.toString() : "") + location.hash);
  } else if (params.get("tracker_exclude") === "0") {
    localStorage.removeItem(excludeKey);
    params.delete("tracker_exclude");
    history.replaceState({}, document.title, location.pathname + (params.toString() ? "?" + params.toString() : "") + location.hash);
  }

  var visitorId = localStorage.getItem(storageKey);
  if (!visitorId) {
    visitorId = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : "visitor-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    localStorage.setItem(storageKey, visitorId);
  }

  if (localStorage.getItem(excludeKey) === "true") return;
  if (sessionStorage.getItem(sessionKey)) return;

  var payload = {
    path: location.pathname + location.search,
    title: document.title,
    referrer: document.referrer || "",
    visitorId: visitorId,
    screen: window.screen ? window.screen.width + "x" + window.screen.height : "",
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ""
  };

  function markSent() {
    sessionStorage.setItem(sessionKey, "1");
  }

  function send() {
    try {
      var blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      if (navigator.sendBeacon) {
        var ok = navigator.sendBeacon(endpoint, blob);
        if (ok) {
          markSent();
          return;
        }
      }
    } catch (error) {}

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      mode: "cors"
    }).then(markSent).catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", send, { once: true });
  } else {
    send();
  }

  window.PORTFOLIO_TRACKER = {
    getVisitorId: function () {
      return localStorage.getItem(storageKey);
    },
    excludeThisBrowser: function () {
      localStorage.setItem(excludeKey, "true");
    },
    includeThisBrowser: function () {
      localStorage.removeItem(excludeKey);
    }
  };
})();
