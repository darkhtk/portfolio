const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const crypto = require("crypto");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "visits.jsonl");
const ORIGIN_ALLOWLIST = (process.env.ALLOWED_ORIGINS || "https://darkhtk.github.io,https://darkhtk.github.io/portfolio")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const TRACKER_BASE_URL = process.env.TRACKER_BASE_URL || "";
const DASHBOARD_USER = process.env.DASHBOARD_USER || "admin";
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || "";
const TRUST_PROXY = (process.env.TRUST_PROXY || "true").toLowerCase() === "true";
const HTTPS_PORT = Number(process.env.HTTPS_PORT || "3443");
const HTTP_PORT = Number(process.env.HTTP_PORT || "3080");
const ENABLE_HTTP = (process.env.ENABLE_HTTP || "true").toLowerCase() === "true";
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || "/certs/privkey.pem";
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || "/certs/fullchain.pem";

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "", "utf8");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 128) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

function getIp(req) {
  if (TRUST_PROXY) {
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
  }
  return req.socket.remoteAddress || "";
}

function corsHeaders(origin) {
  const allowOrigin = ORIGIN_ALLOWLIST.includes(origin) ? origin : ORIGIN_ALLOWLIST[0] || "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin"
  };
}

function json(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
}

function text(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    ...extraHeaders
  });
  res.end(payload);
}

function html(res, statusCode, payload, extraHeaders = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "text/html; charset=utf-8",
    ...extraHeaders
  });
  res.end(payload);
}

function parseAuth(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) return null;
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const index = decoded.indexOf(":");
  if (index < 0) return null;
  return {
    user: decoded.slice(0, index),
    password: decoded.slice(index + 1)
  };
}

function requireAuth(req, res) {
  const auth = parseAuth(req);
  if (!auth || auth.user !== DASHBOARD_USER || auth.password !== DASHBOARD_PASSWORD) {
    res.writeHead(401, {
      "WWW-Authenticate": 'Basic realm="portfolio-tracker"',
      "Content-Type": "text/plain; charset=utf-8"
    });
    res.end("Authentication required");
    return false;
  }
  return true;
}

function loadVisits() {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function summarizeVisits(visits) {
  const pageCounts = new Map();
  const ipCounts = new Map();
  const visitorCounts = new Map();
  const uniqueIps = new Set();
  const uniqueVisitors = new Set();

  for (const visit of visits) {
    pageCounts.set(visit.path, (pageCounts.get(visit.path) || 0) + 1);
    ipCounts.set(visit.ip, (ipCounts.get(visit.ip) || 0) + 1);
    visitorCounts.set(visit.visitorId, (visitorCounts.get(visit.visitorId) || 0) + 1);
    if (visit.ip) uniqueIps.add(visit.ip);
    if (visit.visitorId) uniqueVisitors.add(visit.visitorId);
  }

  const topPages = [...pageCounts.entries()]
    .map(([pathValue, views]) => ({ path: pathValue, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 15);

  const topIps = [...ipCounts.entries()]
    .map(([ip, views]) => ({ ip, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  const topVisitors = [...visitorCounts.entries()]
    .map(([visitorId, views]) => ({ visitorId, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  return {
    totals: {
      views: visits.length,
      uniqueIps: uniqueIps.size,
      uniqueVisitors: uniqueVisitors.size
    },
    topPages,
    topIps,
    topVisitors,
    recent: visits.slice(0, 50)
  };
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dashboardTemplate(summary) {
  const metricCard = (label, value) => `
    <article class="metric-card">
      <div class="metric-label">${escapeHtml(label)}</div>
      <div class="metric-value">${escapeHtml(value)}</div>
    </article>
  `;

  const listRows = (items, render) =>
    items.length
      ? items.map(render).join("")
      : `<tr><td colspan="3" class="empty-cell">아직 데이터가 없습니다.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Tracker</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f8fb;
      --card: #ffffff;
      --line: #d8e2ef;
      --text: #162033;
      --muted: #5a6880;
      --accent: #1f63a9;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Noto Sans KR", sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    .shell {
      max-width: 1320px;
      margin: 0 auto;
      padding: 32px 20px 48px;
    }
    .topbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 16px;
      align-items: end;
      margin-bottom: 28px;
    }
    .eyebrow {
      font-size: 12px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--accent);
      font-weight: 700;
    }
    h1 {
      margin: 12px 0 0;
      font-size: clamp(28px, 4vw, 44px);
      line-height: 1.08;
    }
    .sub {
      max-width: 760px;
      color: var(--muted);
      line-height: 1.7;
      margin: 14px 0 0;
    }
    .hint {
      color: var(--muted);
      font-size: 14px;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin: 28px 0;
    }
    .metric-card, .panel {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 20px;
      box-shadow: 0 18px 42px rgba(25, 96, 163, 0.06);
    }
    .metric-card {
      padding: 22px 24px;
    }
    .metric-label {
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 700;
    }
    .metric-value {
      margin-top: 12px;
      font-size: 36px;
      font-weight: 800;
      line-height: 1;
    }
    .panel-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 16px;
    }
    .panel {
      padding: 22px 24px;
    }
    .panel h2 {
      margin: 0 0 16px;
      font-size: 22px;
      line-height: 1.2;
    }
    .span-6 { grid-column: span 6; }
    .span-12 { grid-column: span 12; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    th, td {
      padding: 12px 10px;
      border-bottom: 1px solid var(--line);
      vertical-align: top;
      text-align: left;
    }
    th {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }
    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 13px;
      word-break: break-all;
    }
    .empty-cell {
      color: var(--muted);
      text-align: center;
      padding: 20px;
    }
    .footer {
      margin-top: 20px;
      color: var(--muted);
      font-size: 13px;
    }
    @media (max-width: 900px) {
      .span-6, .span-12 { grid-column: span 12; }
      .shell { padding: 24px 14px 40px; }
      .panel, .metric-card { border-radius: 16px; padding: 18px; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <section class="topbar">
      <div>
        <div class="eyebrow">Portfolio Tracker</div>
        <h1>GitHub Pages 방문 집계</h1>
        <p class="sub">같은 public IP, visitor id, 페이지별 조회 수를 NAS에서 직접 집계합니다. 이 화면은 Basic Auth로 보호되며 최근 방문 로그도 함께 보여줍니다.</p>
      </div>
      <div class="hint">tracker: ${escapeHtml(TRACKER_BASE_URL || "not configured")}</div>
    </section>

    <section class="metric-grid">
      ${metricCard("총 조회 수", summary.totals.views)}
      ${metricCard("고유 Public IP", summary.totals.uniqueIps)}
      ${metricCard("고유 Visitor ID", summary.totals.uniqueVisitors)}
    </section>

    <section class="panel-grid">
      <article class="panel span-6">
        <h2>페이지별 조회 수</h2>
        <table>
          <thead><tr><th>Page</th><th>Views</th></tr></thead>
          <tbody>
            ${listRows(summary.topPages, (item) => `
              <tr>
                <td class="mono">${escapeHtml(item.path)}</td>
                <td>${escapeHtml(item.views)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </article>

      <article class="panel span-6">
        <h2>IP별 조회 수</h2>
        <table>
          <thead><tr><th>IP</th><th>Views</th></tr></thead>
          <tbody>
            ${listRows(summary.topIps, (item) => `
              <tr>
                <td class="mono">${escapeHtml(item.ip)}</td>
                <td>${escapeHtml(item.views)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </article>

      <article class="panel span-6">
        <h2>Visitor ID별 조회 수</h2>
        <table>
          <thead><tr><th>Visitor ID</th><th>Views</th></tr></thead>
          <tbody>
            ${listRows(summary.topVisitors, (item) => `
              <tr>
                <td class="mono">${escapeHtml(item.visitorId)}</td>
                <td>${escapeHtml(item.views)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </article>

      <article class="panel span-6">
        <h2>최근 방문 로그</h2>
        <table>
          <thead><tr><th>시간</th><th>Page</th><th>IP</th></tr></thead>
          <tbody>
            ${listRows(summary.recent, (item) => `
              <tr>
                <td>${escapeHtml(item.createdAt)}</td>
                <td class="mono">${escapeHtml(item.path)}</td>
                <td class="mono">${escapeHtml(item.ip)}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </article>
    </section>

    <p class="footer">참고: public IP는 NAT, VPN, Private Relay 환경에서 여러 사용자가 같은 값으로 보일 수 있습니다. 사람 단위라기보다 접속 출처 단위에 가깝습니다.</p>
  </main>
</body>
</html>`;
}

function writeVisit(visit) {
  fs.appendFileSync(DATA_FILE, JSON.stringify(visit) + "\n", "utf8");
}

function makeVisit(req, payload) {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ip: getIp(req),
    path: payload.path || "/",
    title: payload.title || "",
    referrer: payload.referrer || "",
    userAgent: req.headers["user-agent"] || "",
    visitorId: payload.visitorId || "",
    screen: payload.screen || "",
    language: payload.language || "",
    timezone: payload.timezone || ""
  };
}

async function requestHandler(req, res) {
  const origin = req.headers.origin || "";
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.url === "/health") {
    json(res, 200, { ok: true, timestamp: new Date().toISOString() }, headers);
    return;
  }

  if (req.url === "/track" && req.method === "POST") {
    try {
      const raw = await readBody(req);
      const payload = raw ? JSON.parse(raw) : {};
      const visit = makeVisit(req, payload);
      writeVisit(visit);
      json(res, 200, { ok: true }, headers);
    } catch (error) {
      json(res, 400, { ok: false, error: error.message }, headers);
    }
    return;
  }

  if (req.url === "/api/stats") {
    if (!requireAuth(req, res)) return;
    json(res, 200, summarizeVisits(loadVisits()));
    return;
  }

  if (req.url === "/" || req.url === "/dashboard") {
    if (!requireAuth(req, res)) return;
    html(res, 200, dashboardTemplate(summarizeVisits(loadVisits())));
    return;
  }

  text(res, 404, "Not Found", headers);
}

function startServers() {
  const cert = fs.readFileSync(SSL_CERT_PATH);
  const key = fs.readFileSync(SSL_KEY_PATH);

  https.createServer({ key, cert }, requestHandler).listen(HTTPS_PORT, () => {
    console.log(`HTTPS tracker listening on :${HTTPS_PORT}`);
  });

  if (ENABLE_HTTP) {
    http.createServer(requestHandler).listen(HTTP_PORT, () => {
      console.log(`HTTP tracker listening on :${HTTP_PORT}`);
    });
  }
}

startServers();
