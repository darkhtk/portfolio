const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const crypto = require("crypto");
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "visits.jsonl");
const EXCLUDED_IPS_FILE = path.join(DATA_DIR, "excluded-ips.json");
const EXCLUDED_VISITOR_IDS_FILE = path.join(DATA_DIR, "excluded-visitor-ids.json");
const ENRICHMENT_CACHE_FILE = path.join(DATA_DIR, "ip-enrichment-cache.json");
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
if (!fs.existsSync(EXCLUDED_IPS_FILE)) {
  fs.writeFileSync(EXCLUDED_IPS_FILE, "[]", "utf8");
}
if (!fs.existsSync(EXCLUDED_VISITOR_IDS_FILE)) {
  fs.writeFileSync(EXCLUDED_VISITOR_IDS_FILE, "[]", "utf8");
}
if (!fs.existsSync(ENRICHMENT_CACHE_FILE)) {
  fs.writeFileSync(ENRICHMENT_CACHE_FILE, "{}", "utf8");
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

function normalizeIp(ip) {
  const value = String(ip || "").trim();
  return value.startsWith("::ffff:") ? value.slice(7) : value;
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

function loadList(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return [];
  }
}

function saveList(filePath, values) {
  const uniqueValues = [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))].sort();
  fs.writeFileSync(filePath, JSON.stringify(uniqueValues, null, 2), "utf8");
  return uniqueValues;
}

function loadExclusions() {
  return {
    excludedIps: loadList(EXCLUDED_IPS_FILE),
    excludedVisitorIds: loadList(EXCLUDED_VISITOR_IDS_FILE)
  };
}

function loadEnrichmentCache() {
  try {
    return JSON.parse(fs.readFileSync(ENRICHMENT_CACHE_FILE, "utf8"));
  } catch (error) {
    return {};
  }
}

function saveEnrichmentCache(cache) {
  fs.writeFileSync(ENRICHMENT_CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
}

async function enrichIp(ip) {
  const normalizedIp = normalizeIp(ip);
  if (!normalizedIp) {
    return {
      normalizedIp: "",
      reverseDns: "",
      asn: "",
      isp: "",
      organization: "",
      country: "",
      city: ""
    };
  }

  const cache = loadEnrichmentCache();
  if (cache[normalizedIp]) {
    return cache[normalizedIp];
  }

  let asn = "";
  let isp = "";
  let organization = "";
  let country = "";
  let city = "";
  let reverseDns = "";

  try {
    const response = await fetch(`http://ip-api.com/json/${encodeURIComponent(normalizedIp)}?fields=status,message,country,city,isp,org,as,reverse,query`);
    if (response.ok) {
      const payload = await response.json();
      if (payload && payload.status === "success") {
        reverseDns = payload.reverse || "";
        asn = payload.as || "";
        isp = payload.isp || "";
        organization = payload.org || "";
        country = payload.country || "";
        city = payload.city || "";
      }
    }
  } catch (error) {}

  const enriched = {
    normalizedIp,
    reverseDns,
    asn,
    isp,
    organization,
    country,
    city
  };

  cache[normalizedIp] = enriched;
  saveEnrichmentCache(cache);
  return enriched;
}

async function summarizeVisits(visits) {
  const pageCounts = new Map();
  const ipCounts = new Map();
  const visitorCounts = new Map();
  const uniqueIps = new Set();
  const uniqueVisitors = new Set();
  const ipSet = new Set();

  for (const visit of visits) {
    pageCounts.set(visit.path, (pageCounts.get(visit.path) || 0) + 1);
    ipCounts.set(visit.ip, (ipCounts.get(visit.ip) || 0) + 1);
    visitorCounts.set(visit.visitorId, (visitorCounts.get(visit.visitorId) || 0) + 1);
    if (visit.ip) uniqueIps.add(visit.ip);
    if (visit.visitorId) uniqueVisitors.add(visit.visitorId);
    if (visit.ip) ipSet.add(visit.ip);
  }

  const enrichments = {};
  await Promise.all(
    [...ipSet].map(async (ip) => {
      enrichments[ip] = await enrichIp(ip);
    })
  );

  const topPages = [...pageCounts.entries()]
    .map(([pathValue, views]) => ({ path: pathValue, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 15);

  const topIps = [...ipCounts.entries()]
    .map(([ip, views]) => ({ ip, views, enrichment: enrichments[ip] || {} }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  const topVisitors = [...visitorCounts.entries()]
    .map(([visitorId, views]) => ({ visitorId, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 20);

  const exclusions = loadExclusions();

  return {
    totals: {
      views: visits.length,
      uniqueIps: uniqueIps.size,
      uniqueVisitors: uniqueVisitors.size
    },
    topPages,
    topIps,
    topVisitors,
    recent: visits.slice(0, 50).map((visit) => ({
      ...visit,
      enrichment: enrichments[visit.ip] || {}
    })),
    exclusions
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

  const listRows = (items, render, colspan = 3) =>
    items.length
      ? items.map(render).join("")
      : `<tr><td colspan="${colspan}" class="empty-cell">아직 데이터가 없습니다.</td></tr>`;

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
    .panel h3 {
      margin: 0 0 12px;
      font-size: 16px;
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
    .actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .field {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 12px 14px;
      font: inherit;
      color: var(--text);
      background: #fff;
    }
    .button {
      border: 0;
      border-radius: 12px;
      padding: 12px 16px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      background: var(--accent);
      color: #fff;
    }
    .button.secondary {
      background: #e8eef7;
      color: var(--text);
    }
    .button.danger {
      background: #b42318;
      color: #fff;
    }
    .muted {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.6;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: #eef3f8;
      color: var(--text);
      font-size: 13px;
      margin: 0 8px 8px 0;
    }
    .inline-button {
      border: 0;
      background: transparent;
      color: #b42318;
      font: inherit;
      cursor: pointer;
      padding: 0;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
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
        <p class="sub">같은 public IP, visitor id, 페이지별 조회 수를 NAS에서 직접 집계합니다. reverse DNS, ASN/ISP, 국가·도시 정보도 함께 보여 주어 접속 출처를 더 빨리 읽을 수 있게 했습니다.</p>
      </div>
      <div class="hint">tracker: ${escapeHtml(TRACKER_BASE_URL || "not configured")}</div>
    </section>

    <section class="metric-grid">
      ${metricCard("총 조회 수", summary.totals.views)}
      ${metricCard("고유 Public IP", summary.totals.uniqueIps)}
      ${metricCard("고유 Visitor ID", summary.totals.uniqueVisitors)}
    </section>

    <section class="panel-grid">
      <article class="panel span-12">
        <h2>제외 목록 관리</h2>
        <div class="actions">
          <div class="stack">
            <h3>현재 접속 IP 제외</h3>
            <p class="muted">대시보드에 접속한 현재 public IP를 바로 제외 목록에 추가합니다.</p>
            <div class="toolbar">
              <button class="button" type="button" onclick="excludeCurrentIp()">현재 IP 제외</button>
              <button class="button secondary" type="button" onclick="refreshStats()">새로고침</button>
            </div>
          </div>
          <div class="stack">
            <h3>IP 수동 추가</h3>
            <input id="ip-input" class="field" type="text" placeholder="예: 221.146.72.221">
            <button class="button" type="button" onclick="addExcludedIp()">IP 제외 추가</button>
          </div>
          <div class="stack">
            <h3>Visitor ID 수동 추가</h3>
            <input id="visitor-input" class="field" type="text" placeholder="portfolio_tracker_visitor_id 값">
            <button class="button" type="button" onclick="addExcludedVisitor()">Visitor ID 제외 추가</button>
            <p class="muted">내 브라우저는 포트폴리오 페이지에서 <code>?tracker_exclude=1</code>로 제외 상태를 켤 수 있습니다.</p>
          </div>
        </div>
        <div class="toolbar">
          <button class="button secondary" type="button" onclick="alert('포트폴리오 URL 뒤에 ?tracker_exclude=1 을 붙여 열면 현재 브라우저에서 추적을 끕니다.\\n예: https://darkhtk.github.io/portfolio/?tracker_exclude=1\\n다시 켜려면 ?tracker_exclude=0 을 사용하세요.')">현재 브라우저 제외 방법 보기</button>
        </div>
      </article>
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
          <thead><tr><th>IP</th><th>Network</th><th>Views</th></tr></thead>
          <tbody>
            ${listRows(summary.topIps, (item) => `
              <tr>
                <td class="mono">${escapeHtml(item.enrichment.normalizedIp || item.ip)}</td>
                <td>
                  <div>${escapeHtml(item.enrichment.reverseDns || item.enrichment.isp || item.enrichment.organization || "-")}</div>
                  <div class="muted">${escapeHtml([item.enrichment.asn, item.enrichment.country, item.enrichment.city].filter(Boolean).join(" · ") || "-")}</div>
                </td>
                <td>${escapeHtml(item.views)}</td>
              </tr>
            `, 3)}
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
          <thead><tr><th>시간</th><th>Page</th><th>IP</th><th>Network</th></tr></thead>
          <tbody>
            ${listRows(summary.recent, (item) => `
              <tr>
                <td>${escapeHtml(item.createdAt)}</td>
                <td class="mono">${escapeHtml(item.path)}</td>
                <td class="mono">${escapeHtml(item.enrichment.normalizedIp || item.ip)}</td>
                <td>
                  <div>${escapeHtml(item.enrichment.reverseDns || item.enrichment.isp || item.enrichment.organization || "-")}</div>
                  <div class="muted">${escapeHtml([item.enrichment.asn, item.enrichment.country, item.enrichment.city].filter(Boolean).join(" · ") || "-")}</div>
                </td>
              </tr>
            `, 4)}
          </tbody>
        </table>
      </article>

      <article class="panel span-6">
        <h2>제외된 IP</h2>
        <div>
          ${summary.exclusions.excludedIps.length
            ? summary.exclusions.excludedIps.map((ip) => `
                <span class="pill mono">
                  ${escapeHtml(ip)}
                  <button class="inline-button" type="button" onclick="removeExcludedIp('${escapeHtml(ip)}')">삭제</button>
                </span>
              `).join("")
            : `<div class="empty-cell">제외된 IP가 없습니다.</div>`}
        </div>
      </article>

      <article class="panel span-6">
        <h2>제외된 Visitor ID</h2>
        <div>
          ${summary.exclusions.excludedVisitorIds.length
            ? summary.exclusions.excludedVisitorIds.map((visitorId) => `
                <span class="pill mono">
                  ${escapeHtml(visitorId)}
                  <button class="inline-button" type="button" onclick="removeExcludedVisitor('${escapeHtml(visitorId)}')">삭제</button>
                </span>
              `).join("")
            : `<div class="empty-cell">제외된 Visitor ID가 없습니다.</div>`}
        </div>
      </article>
    </section>

    <p class="footer">참고: public IP는 NAT, VPN, Private Relay 환경에서 여러 사용자가 같은 값으로 보일 수 있습니다. 사람 단위라기보다 접속 출처 단위에 가깝습니다.</p>
  </main>
  <script>
    async function request(path, options) {
      const response = await fetch(path, Object.assign({
        headers: { "Content-Type": "application/json" }
      }, options || {}));
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json();
    }

    async function refreshStats() {
      location.reload();
    }

    async function excludeCurrentIp() {
      const payload = await request('/api/exclusions/current-ip', { method: 'POST' });
      alert('제외된 IP: ' + payload.value);
      refreshStats();
    }

    async function addExcludedIp() {
      const value = document.getElementById('ip-input').value.trim();
      if (!value) return;
      await request('/api/exclusions/ip', {
        method: 'POST',
        body: JSON.stringify({ value: value })
      });
      refreshStats();
    }

    async function addExcludedVisitor() {
      const value = document.getElementById('visitor-input').value.trim();
      if (!value) return;
      await request('/api/exclusions/visitor', {
        method: 'POST',
        body: JSON.stringify({ value: value })
      });
      refreshStats();
    }

    async function removeExcludedIp(value) {
      await request('/api/exclusions/ip', {
        method: 'DELETE',
        body: JSON.stringify({ value: value })
      });
      refreshStats();
    }

    async function removeExcludedVisitor(value) {
      await request('/api/exclusions/visitor', {
        method: 'DELETE',
        body: JSON.stringify({ value: value })
      });
      refreshStats();
    }
  </script>
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
    ip: normalizeIp(getIp(req)),
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

function shouldExclude(visit) {
  const exclusions = loadExclusions();
  return exclusions.excludedIps.includes(visit.ip) || exclusions.excludedVisitorIds.includes(visit.visitorId);
}

function readJsonBody(raw) {
  return raw ? JSON.parse(raw) : {};
}

function writeExclusions(type, operation, value) {
  if (!value) {
    throw new Error("Value is required");
  }

  const filePath = type === "ip" ? EXCLUDED_IPS_FILE : EXCLUDED_VISITOR_IDS_FILE;
  const currentValues = loadList(filePath);
  const nextValues = operation === "remove"
    ? currentValues.filter((item) => item !== value)
    : [...currentValues, value];

  return saveList(filePath, nextValues);
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
      const payload = readJsonBody(raw);
      const visit = makeVisit(req, payload);
      if (shouldExclude(visit)) {
        json(res, 200, { ok: true, excluded: true }, headers);
        return;
      }
      writeVisit(visit);
      json(res, 200, { ok: true }, headers);
    } catch (error) {
      json(res, 400, { ok: false, error: error.message }, headers);
    }
    return;
  }

  if (req.url === "/api/exclusions/current-ip" && req.method === "POST") {
    if (!requireAuth(req, res)) return;
    const value = normalizeIp(getIp(req));
    const excludedIps = writeExclusions("ip", "add", value);
    json(res, 200, { ok: true, value, excludedIps });
    return;
  }

  if (req.url === "/api/exclusions/ip" && (req.method === "POST" || req.method === "DELETE")) {
    if (!requireAuth(req, res)) return;
    try {
      const payload = readJsonBody(await readBody(req));
      const excludedIps = writeExclusions("ip", req.method === "DELETE" ? "remove" : "add", String(payload.value || "").trim());
      json(res, 200, { ok: true, excludedIps });
    } catch (error) {
      json(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (req.url === "/api/exclusions/visitor" && (req.method === "POST" || req.method === "DELETE")) {
    if (!requireAuth(req, res)) return;
    try {
      const payload = readJsonBody(await readBody(req));
      const excludedVisitorIds = writeExclusions("visitor", req.method === "DELETE" ? "remove" : "add", String(payload.value || "").trim());
      json(res, 200, { ok: true, excludedVisitorIds });
    } catch (error) {
      json(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (req.url === "/api/stats") {
    if (!requireAuth(req, res)) return;
    json(res, 200, await summarizeVisits(loadVisits()));
    return;
  }

  if (req.url === "/" || req.url === "/dashboard") {
    if (!requireAuth(req, res)) return;
    html(res, 200, dashboardTemplate(await summarizeVisits(loadVisits())));
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
