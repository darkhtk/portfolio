const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const crypto = require("crypto");
const childProcess = require("child_process");
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "visits.jsonl");
const DB_FILE = path.join(DATA_DIR, "tracker.sqlite3");
const EXCLUDED_IPS_FILE = path.join(DATA_DIR, "excluded-ips.json");
const EXCLUDED_VISITOR_IDS_FILE = path.join(DATA_DIR, "excluded-visitor-ids.json");
const EXCLUDED_REQUESTS_FILE = path.join(DATA_DIR, "excluded-requests.jsonl");
const ENRICHMENT_CACHE_FILE = path.join(DATA_DIR, "ip-enrichment-cache.json");
const ALERT_STATE_FILE = path.join(DATA_DIR, "alert-state.json");
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
const TRACKER_VERSION = "server-v2";
const NO_VISIT_ALERT_HOURS = Number(process.env.NO_VISIT_ALERT_HOURS || "24");
const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL || "";

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
if (!fs.existsSync(EXCLUDED_REQUESTS_FILE)) {
  fs.writeFileSync(EXCLUDED_REQUESTS_FILE, "", "utf8");
}
if (!fs.existsSync(ENRICHMENT_CACHE_FILE)) {
  fs.writeFileSync(ENRICHMENT_CACHE_FILE, "{}", "utf8");
}
if (!fs.existsSync(ALERT_STATE_FILE)) {
  fs.writeFileSync(ALERT_STATE_FILE, "{}", "utf8");
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

function getForwardedFor(req) {
  return String(req.headers["x-forwarded-for"] || "").trim();
}

function getSocketIp(req) {
  return String(req.socket.remoteAddress || "").trim();
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
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function isAllowedOrigin(origin) {
  return !origin || ORIGIN_ALLOWLIST.includes(origin);
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
    res.end("인증이 필요합니다");
    return false;
  }
  return true;
}

function loadJsonLines(filePath) {
  const raw = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
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

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function runSql(sql) {
  const result = childProcess.spawnSync("sqlite3", [DB_FILE], {
    input: sql,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 8
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "sqlite3 failed");
  }
  return result.stdout || "";
}

function querySql(sql) {
  const result = childProcess.spawnSync("sqlite3", ["-json", DB_FILE, sql], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 16
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "sqlite3 query failed");
  }
  const output = String(result.stdout || "").trim();
  return output ? JSON.parse(output) : [];
}

function tableColumns(tableName) {
  return querySql(`PRAGMA table_info(${tableName});`).map((row) => row.name);
}

function ensureColumn(tableName, columnName, definition) {
  if (!tableColumns(tableName).includes(columnName)) {
    runSql(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition};`);
  }
}

function initializeDatabase() {
  runSql(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS visits (
      id TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      ip TEXT,
      rawIp TEXT,
      forwardedFor TEXT,
      socketIp TEXT,
      path TEXT,
      title TEXT,
      referrer TEXT,
      userAgent TEXT,
      visitorId TEXT,
      screen TEXT,
      language TEXT,
      timezone TEXT,
      testId TEXT,
      reason TEXT,
      clientVersion TEXT
    );
    CREATE TABLE IF NOT EXISTS excluded_requests (
      id TEXT PRIMARY KEY,
      createdAt TEXT NOT NULL,
      ip TEXT,
      rawIp TEXT,
      forwardedFor TEXT,
      socketIp TEXT,
      path TEXT,
      title TEXT,
      referrer TEXT,
      userAgent TEXT,
      visitorId TEXT,
      screen TEXT,
      language TEXT,
      timezone TEXT,
      testId TEXT,
      reason TEXT,
      clientVersion TEXT,
      excludedBy TEXT,
      excludedValue TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_visits_createdAt ON visits(createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_visits_path ON visits(path);
    CREATE INDEX IF NOT EXISTS idx_visits_ip ON visits(ip);
    CREATE INDEX IF NOT EXISTS idx_visits_visitorId ON visits(visitorId);
    CREATE INDEX IF NOT EXISTS idx_excluded_createdAt ON excluded_requests(createdAt DESC);
  `);

  ["rawIp", "forwardedFor", "socketIp", "testId", "reason", "clientVersion"].forEach((column) => {
    ensureColumn("visits", column, "TEXT");
    ensureColumn("excluded_requests", column, "TEXT");
  });
  ensureColumn("excluded_requests", "excludedBy", "TEXT");
  ensureColumn("excluded_requests", "excludedValue", "TEXT");

  migrateJsonLinesToSqlite();
}

function insertInto(tableName, entry) {
  const columns = tableName === "visits"
    ? ["id", "createdAt", "ip", "rawIp", "forwardedFor", "socketIp", "path", "title", "referrer", "userAgent", "visitorId", "screen", "language", "timezone", "testId", "reason", "clientVersion"]
    : ["id", "createdAt", "ip", "rawIp", "forwardedFor", "socketIp", "path", "title", "referrer", "userAgent", "visitorId", "screen", "language", "timezone", "testId", "reason", "clientVersion", "excludedBy", "excludedValue"];
  const values = columns.map((column) => sqlValue(entry[column] || ""));
  runSql(`INSERT OR IGNORE INTO ${tableName} (${columns.join(",")}) VALUES (${values.join(",")});`);
}

function migrateJsonLinesToSqlite() {
  const visitCount = Number(querySql("SELECT COUNT(*) AS count FROM visits;")[0]?.count || 0);
  if (visitCount === 0) {
    loadJsonLines(DATA_FILE).forEach((visit) => insertInto("visits", visit));
  }

  const excludedCount = Number(querySql("SELECT COUNT(*) AS count FROM excluded_requests;")[0]?.count || 0);
  if (excludedCount === 0) {
    loadJsonLines(EXCLUDED_REQUESTS_FILE).forEach((entry) => insertInto("excluded_requests", entry));
  }
}

function loadVisits() {
  return querySql("SELECT * FROM visits ORDER BY datetime(createdAt) DESC, rowid DESC;");
}

function loadExcludedRequests() {
  return querySql("SELECT * FROM excluded_requests ORDER BY datetime(createdAt) DESC, rowid DESC LIMIT 50;");
}

function getVisitStats() {
  const row = querySql(`
    SELECT
      COUNT(*) AS visits,
      MAX(createdAt) AS lastVisitAt,
      CAST((julianday('now') - julianday(MAX(createdAt))) * 24 AS REAL) AS hoursSinceLastVisit
    FROM visits;
  `)[0] || {};
  const visits = Number(row.visits || 0);
  const hoursSinceLastVisit = row.hoursSinceLastVisit === null || row.hoursSinceLastVisit === undefined
    ? null
    : Number(row.hoursSinceLastVisit);
  const alertState = loadAlertState();
  const lastResetAt = alertState.lastResetAt || "";
  const resetTime = lastResetAt ? Date.parse(lastResetAt) : NaN;
  const hoursSinceReset = Number.isFinite(resetTime)
    ? (Date.now() - resetTime) / 36e5
    : null;
  const stale = visits
    ? hoursSinceLastVisit !== null && hoursSinceLastVisit >= NO_VISIT_ALERT_HOURS
    : hoursSinceReset === null || hoursSinceReset >= NO_VISIT_ALERT_HOURS;
  return {
    visits,
    lastVisitAt: row.lastVisitAt || "",
    hoursSinceLastVisit,
    lastResetAt,
    hoursSinceReset,
    stale
  };
}

function loadAlertState() {
  try {
    return JSON.parse(fs.readFileSync(ALERT_STATE_FILE, "utf8"));
  } catch (error) {
    return {};
  }
}

function saveAlertState(state) {
  fs.writeFileSync(ALERT_STATE_FILE, JSON.stringify(state, null, 2), "utf8");
}

async function maybeSendNoVisitAlert(stats) {
  const state = loadAlertState();
  const result = {
    configured: Boolean(ALERT_WEBHOOK_URL),
    stale: stats.stale,
    lastAlertAt: state.lastNoVisitAlertAt || "",
    sent: false
  };

  if (!stats.stale) {
    if (state.lastNoVisitAlertAt) {
      saveAlertState({ ...state, lastRecoveredAt: new Date().toISOString() });
    }
    return result;
  }

  if (!ALERT_WEBHOOK_URL) return result;

  const now = Date.now();
  const lastAlertAt = state.lastNoVisitAlertAt ? Date.parse(state.lastNoVisitAlertAt) : 0;
  if (lastAlertAt && now - lastAlertAt < 24 * 60 * 60 * 1000) return result;

  const message = [
    "포트폴리오 방문 추적 경고",
    `${NO_VISIT_ALERT_HOURS}시간 이상 새 방문 기록이 없습니다.`,
    `마지막 방문: ${stats.lastVisitAt || "없음"}`,
    `총 방문 기록: ${stats.visits}`
  ].join("\n");

  try {
    const response = await fetch(ALERT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, message, stats })
    });
    if (response.ok) {
      const sentAt = new Date().toISOString();
      saveAlertState({ ...state, lastNoVisitAlertAt: sentAt });
      result.lastAlertAt = sentAt;
      result.sent = true;
    }
  } catch (error) {}

  return result;
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

const enrichmentQueue = new Set();
let enrichmentWorkerRunning = false;

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

function getCachedEnrichment(ip) {
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
  return cache[normalizedIp] || {
    normalizedIp,
    reverseDns: "",
    asn: "",
    isp: "",
    organization: "",
    country: "",
    city: ""
  };
}

function queueEnrichment(ip) {
  const normalizedIp = normalizeIp(ip);
  if (!normalizedIp) return;

  const cache = loadEnrichmentCache();
  if (cache[normalizedIp]) return;
  if (enrichmentQueue.has(normalizedIp)) return;

  enrichmentQueue.add(normalizedIp);
  runEnrichmentWorker();
}

async function runEnrichmentWorker() {
  if (enrichmentWorkerRunning) return;
  enrichmentWorkerRunning = true;

  try {
    while (enrichmentQueue.size > 0) {
      const [nextIp] = enrichmentQueue;
      enrichmentQueue.delete(nextIp);
      try {
        await enrichIp(nextIp);
      } catch (error) {}
    }
  } finally {
    enrichmentWorkerRunning = false;
    if (enrichmentQueue.size > 0) {
      setImmediate(runEnrichmentWorker);
    }
  }
}

async function summarizeVisits(visits) {
  const pageCounts = new Map();
  const ipCounts = new Map();
  const visitorCounts = new Map();
  const dailyCounts = new Map();
  const uniqueIps = new Set();
  const uniqueVisitors = new Set();
  const ipSet = new Set();

  for (const visit of visits) {
    pageCounts.set(visit.path, (pageCounts.get(visit.path) || 0) + 1);
    ipCounts.set(visit.ip, (ipCounts.get(visit.ip) || 0) + 1);
    visitorCounts.set(visit.visitorId, (visitorCounts.get(visit.visitorId) || 0) + 1);
    const day = String(visit.createdAt || "").slice(0, 10);
    if (day) {
      dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1);
    }
    if (visit.ip) uniqueIps.add(visit.ip);
    if (visit.visitorId) uniqueVisitors.add(visit.visitorId);
    if (visit.ip) ipSet.add(visit.ip);
  }

  const enrichments = {};
  for (const ip of ipSet) {
    enrichments[ip] = getCachedEnrichment(ip);
    if (!enrichments[ip].asn && !enrichments[ip].isp && !enrichments[ip].organization && !enrichments[ip].country && !enrichments[ip].reverseDns) {
      queueEnrichment(ip);
    }
  }

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

  const dailySeries = [...dailyCounts.entries()]
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  const exclusions = loadExclusions();
  const excludedRecent = loadExcludedRequests();

  return {
    totals: {
      views: visits.length,
      uniqueIps: uniqueIps.size,
      uniqueVisitors: uniqueVisitors.size
    },
    topPages,
    topIps,
    topVisitors,
    dailySeries,
    recent: visits.slice(0, 50).map((visit) => ({
      ...visit,
      enrichment: enrichments[visit.ip] || {}
    })),
    excludedRecent,
    exclusions
  };
}

function classifyNetwork(enrichment) {
  const source = `${enrichment.asn || ""} ${enrichment.isp || ""} ${enrichment.organization || ""} ${enrichment.reverseDns || ""}`.toLowerCase();
  if (!source.trim()) {
    return { label: "미확인", tone: "neutral" };
  }
  if (/(amazon|aws|google|gcp|azure|microsoft|oracle cloud|digitalocean|cloudflare|linode|vultr|ovh)/.test(source)) {
    return { label: "클라우드", tone: "cloud" };
  }
  if (/(kt|korea telecom|sk broadband|skb|lg u\+|lgu\+|uplus|kornet)/.test(source)) {
    return { label: "통신망", tone: "isp" };
  }
  if (/(university|college|school|edu|ac\.kr|go\.kr|or\.kr|research|hospital)/.test(source)) {
    return { label: "기관", tone: "org" };
  }
  if (/(corp|co\., ltd|inc|ltd|company|enterprise|group)/.test(source)) {
    return { label: "기업", tone: "company" };
  }
  return { label: "기타", tone: "neutral" };
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
  const metricCard = (key, label, value) => `
    <article class="metric-card" data-metric="${escapeHtml(key)}">
      <div class="metric-label">${escapeHtml(label)}</div>
      <div class="metric-value">${escapeHtml(value)}</div>
    </article>
  `;

  const listRows = (items, render, colspan = 3) =>
    items.length
      ? items.map(render).join("")
      : `<tr><td colspan="${colspan}" class="empty-cell">아직 데이터가 없습니다.</td></tr>`;

  const maxDailyViews = Math.max(...summary.dailySeries.map((item) => item.views), 1);
  const dailyBars = summary.dailySeries.length
    ? summary.dailySeries.map((item) => `
        <div class="bar-col">
          <div class="bar-value">${escapeHtml(item.views)}</div>
          <div class="bar-track">
            <div class="bar-fill" style="height:${Math.max(16, Math.round((item.views / maxDailyViews) * 140))}px"></div>
          </div>
          <div class="bar-label">${escapeHtml(item.date.slice(5))}</div>
        </div>
      `).join("")
    : '<div class="empty-cell">아직 일별 방문 기록이 없습니다.</div>';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>포트폴리오 방문 추적</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f8fb;
      --card: #ffffff;
      --line: #d8e2ef;
      --text: #162033;
      --muted: #5a6880;
      --accent: #1f63a9;
      --danger: #b42318;
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
      max-width: 860px;
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
      margin-top: 16px;
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
      line-height: 1.7;
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
      background: var(--danger);
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
      color: var(--danger);
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
    .network-cell {
      min-width: 220px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .badge.isp { background: #e7f0ff; color: #1f63a9; }
    .badge.cloud { background: #eef3ff; color: #4b53c0; }
    .badge.company { background: #edf8f0; color: #237a46; }
    .badge.org { background: #fff3e5; color: #9a5b00; }
    .badge.neutral { background: #eef2f6; color: #51607a; }
    .bar-chart {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(48px, 1fr));
      gap: 10px;
      align-items: end;
      min-height: 220px;
    }
    .bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .bar-value {
      font-size: 12px;
      color: var(--muted);
      min-height: 18px;
    }
    .bar-track {
      width: 100%;
      max-width: 36px;
      height: 150px;
      border-radius: 999px;
      background: #edf2f7;
      display: flex;
      align-items: end;
      overflow: hidden;
    }
    .bar-fill {
      width: 100%;
      background: linear-gradient(180deg, #7cb0ff 0%, #1f63a9 100%);
      border-radius: 999px;
    }
    .bar-label {
      font-size: 11px;
      color: var(--muted);
      letter-spacing: 0.06em;
    }
    .alert {
      margin-top: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      background: #fff7ed;
      color: #9a5b00;
      font-size: 13px;
      line-height: 1.6;
      border: 1px solid #f3d6b3;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12px;
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
        <div class="eyebrow">포트폴리오 방문 추적</div>
        <h1>GitHub Pages 방문 추적 대시보드</h1>
        <p class="sub">포트폴리오 사이트의 페이지 조회를 기록하고 공개 IP, reverse DNS, ASN/ISP, 위치, 제외 이력, 최근 제외 요청을 함께 보여줍니다. 실제 방문으로 보이는 흐름과 스캐너, 봇, 수동 제외 트래픽을 구분하는 용도입니다.</p>
      </div>
      <div class="hint">추적 서버: ${escapeHtml(TRACKER_BASE_URL || "설정되지 않음")}</div>
    </section>

    <section class="metric-grid">
      ${metricCard("views", "전체 조회수", summary.totals.views)}
      ${metricCard("uniqueIps", "고유 공개 IP", summary.totals.uniqueIps)}
      ${metricCard("uniqueVisitors", "고유 방문자 ID", summary.totals.uniqueVisitors)}
    </section>

    <section class="panel-grid">
      <article class="panel span-12">
        <h2>일별 조회수</h2>
        <div class="bar-chart">${dailyBars}</div>
      </article>
    </section>

    <section class="panel-grid">
      <article class="panel span-12">
        <h2>제외 설정</h2>
        <div class="actions">
          <div class="stack">
            <h3>현재 공개 IP 제외</h3>
            <p class="muted">현재 사용 중인 네트워크를 집계에서 빼고 싶을 때만 사용하세요. 같은 공개 IP 뒤에 있는 다른 방문까지 함께 숨겨질 수 있습니다.</p>
            <div class="toolbar">
              <button class="button danger" type="button" onclick="excludeCurrentIp()">현재 IP 제외</button>
              <button class="button secondary" type="button" onclick="refreshStats()">새로고침</button>
            </div>
          </div>
          <div class="stack">
            <h3>제외 IP 추가</h3>
            <input id="ip-input" class="field" type="text" placeholder="예: 221.146.72.221">
            <button class="button" type="button" onclick="addExcludedIp()">IP 추가</button>
          </div>
          <div class="stack">
            <h3>제외 방문자 ID 추가</h3>
            <input id="visitor-input" class="field" type="text" placeholder="portfolio_tracker_visitor_id">
            <button class="button" type="button" onclick="addExcludedVisitor()">방문자 ID 추가</button>
            <p class="muted">포트폴리오 사이트에서 <code>?tracker_exclude=1</code>을 붙이면 해당 브라우저를 추적 제외할 수 있습니다. 다시 켜려면 <code>?tracker_exclude=0</code>을 사용하세요.</p>
          </div>
          <div class="stack">
            <h3>기록 초기화</h3>
            <p class="muted">버튼을 누르면 방문 기록과 제외 요청 로그를 즉시 비웁니다. 제외 IP와 제외 방문자 ID 설정은 유지됩니다.</p>
            <button class="button danger" type="button" onclick="resetRecords()">기록 초기화</button>
          </div>
        </div>
      </article>
    </section>

    <section class="panel-grid">
      <article class="panel span-6">
        <h2>상위 페이지</h2>
        <table>
          <thead><tr><th>페이지</th><th>조회수</th></tr></thead>
          <tbody>
            ${listRows(summary.topPages, (item) => `
              <tr>
                <td class="mono">${escapeHtml(item.path)}</td>
                <td>${escapeHtml(item.views)}</td>
              </tr>
            `, 2)}
          </tbody>
        </table>
      </article>

      <article class="panel span-6">
        <h2>상위 공개 IP</h2>
        <table>
          <thead><tr><th>IP</th><th>네트워크</th><th>조회수</th></tr></thead>
          <tbody>
            ${listRows(summary.topIps, (item) => `
              ${(() => {
                const badge = classifyNetwork(item.enrichment || {});
                return `
              <tr>
                <td class="mono">${escapeHtml(item.enrichment.normalizedIp || item.ip)}</td>
                <td class="network-cell">
                  <div class="badge ${escapeHtml(badge.tone)}">${escapeHtml(badge.label)}</div>
                  <div>${escapeHtml(item.enrichment.reverseDns || item.enrichment.isp || item.enrichment.organization || "-")}</div>
                  <div class="muted">${escapeHtml([item.enrichment.asn, item.enrichment.country, item.enrichment.city].filter(Boolean).join(" / ") || "-")}</div>
                </td>
                <td>${escapeHtml(item.views)}</td>
              </tr>
            `;
              })()}
            `, 3)}
          </tbody>
        </table>
      </article>

      <article class="panel span-6">
        <h2>상위 방문자 ID</h2>
        <table>
          <thead><tr><th>방문자 ID</th><th>조회수</th></tr></thead>
          <tbody>
            ${listRows(summary.topVisitors, (item) => `
              <tr>
                <td class="mono">${escapeHtml(item.visitorId)}</td>
                <td>${escapeHtml(item.views)}</td>
              </tr>
            `, 2)}
          </tbody>
        </table>
      </article>

      <article class="panel span-6">
        <h2>최근 방문</h2>
        <table>
          <thead><tr><th>시간</th><th>페이지</th><th>IP</th><th>네트워크</th></tr></thead>
          <tbody>
            ${listRows(summary.recent, (item) => `
              ${(() => {
                const badge = classifyNetwork(item.enrichment || {});
                return `
              <tr>
                <td>${escapeHtml(item.createdAt)}</td>
                <td class="mono">${escapeHtml(item.path)}</td>
                <td class="mono">${escapeHtml(item.enrichment.normalizedIp || item.ip)}</td>
                <td class="network-cell">
                  <div class="badge ${escapeHtml(badge.tone)}">${escapeHtml(badge.label)}</div>
                  <div>${escapeHtml(item.enrichment.reverseDns || item.enrichment.isp || item.enrichment.organization || "-")}</div>
                  <div class="muted">${escapeHtml([item.enrichment.asn, item.enrichment.country, item.enrichment.city].filter(Boolean).join(" / ") || "-")}</div>
                </td>
              </tr>
            `;
              })()}
            `, 4)}
          </tbody>
        </table>
      </article>
    </section>

    <section class="panel-grid">
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
            : '<div class="empty-cell">제외된 IP가 없습니다.</div>'}
        </div>
      </article>

      <article class="panel span-6">
        <h2>제외된 방문자 ID</h2>
        <div>
          ${summary.exclusions.excludedVisitorIds.length
            ? summary.exclusions.excludedVisitorIds.map((visitorId) => `
                <span class="pill mono">
                  ${escapeHtml(visitorId)}
                  <button class="inline-button" type="button" onclick="removeExcludedVisitor('${escapeHtml(visitorId)}')">삭제</button>
                </span>
              `).join("")
            : '<div class="empty-cell">제외된 방문자 ID가 없습니다.</div>'}
        </div>
      </article>
    </section>

    <section class="panel-grid">
      <article class="panel span-12">
        <h2>원본 IP 로그</h2>
        <table>
          <thead><tr><th>시간</th><th>경로</th><th>원본 IP</th><th>전달된 IP</th><th>소켓 IP</th></tr></thead>
          <tbody>
            ${listRows(summary.recent, (item) => `
              <tr>
                <td>${escapeHtml(item.createdAt)}</td>
                <td class="mono">${escapeHtml(item.path)}</td>
                <td class="mono">${escapeHtml(item.rawIp || item.ip || "-")}</td>
                <td class="mono">${escapeHtml(item.forwardedFor || "-")}</td>
                <td class="mono">${escapeHtml(item.socketIp || "-")}</td>
              </tr>
            `, 5)}
          </tbody>
        </table>
        <p class="footer">집계와 제외 판정에는 정규화된 IP를 사용합니다. 이 패널은 추적 서버가 요청에서 받은 원본 값을 보여줍니다.</p>
      </article>
    </section>

    <section class="panel-grid">
      <article class="panel span-12">
        <h2>제외 요청 로그</h2>
        <table>
          <thead><tr><th>시간</th><th>경로</th><th>제외 기준</th><th>값</th><th>원본 IP</th><th>전달된 IP</th><th>소켓 IP</th></tr></thead>
          <tbody>
            ${listRows(summary.excludedRecent || [], (item) => `
              <tr>
                <td>${escapeHtml(item.createdAt)}</td>
                <td class="mono">${escapeHtml(item.path || "-")}</td>
                <td>${escapeHtml(item.excludedBy || "-")}</td>
                <td class="mono">${escapeHtml(item.excludedValue || "-")}</td>
                <td class="mono">${escapeHtml(item.rawIp || item.ip || "-")}</td>
                <td class="mono">${escapeHtml(item.forwardedFor || "-")}</td>
                <td class="mono">${escapeHtml(item.socketIp || "-")}</td>
              </tr>
            `, 7)}
          </tbody>
        </table>
        <p class="footer">이 패널은 추적 서버에는 도달했지만 제외 규칙과 일치해 집계되지 않은 요청을 보여줍니다.</p>
      </article>
    </section>

    <p class="footer">공개 IP는 네트워크 수준의 단서일 뿐입니다. NAT, VPN, 모바일망, 프라이빗 릴레이 서비스 때문에 여러 사람이 같은 주소로 합쳐지거나 실제 사람이 가려질 수 있습니다.</p>
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

    async function refreshMetricTotals() {
      try {
        const summary = await request('/api/stats');
        const totals = (summary && summary.totals) || {};
        const metricMap = {
          views: totals.views,
          uniqueIps: totals.uniqueIps,
          uniqueVisitors: totals.uniqueVisitors
        };

        Object.keys(metricMap).forEach(function(key) {
          const card = document.querySelector('[data-metric="' + key + '"] .metric-value');
          if (!card) return;
          card.textContent = metricMap[key] == null ? '-' : String(metricMap[key]);
        });
      } catch (error) {}
    }

    async function excludeCurrentIp() {
      const payload = await request('/api/exclusions/current-ip', {
        method: 'POST'
      });
      alert('현재 공개 IP를 제외했습니다: ' + payload.value);
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

    async function resetRecords() {
      const payload = await request('/api/records/reset', {
        method: 'POST'
      });
      const deleted = payload.deleted || {};
      alert('기록을 초기화했습니다. 삭제된 방문 기록: ' + (deleted.visits || 0) + '건, 제외 요청 로그: ' + (deleted.excludedRequests || 0) + '건');
      refreshStats();
    }

    setInterval(refreshMetricTotals, 60 * 60 * 1000);
  </script>
</body>
</html>`;
}
function writeVisit(visit) {
  insertInto("visits", visit);
  fs.appendFileSync(DATA_FILE, JSON.stringify(visit) + "\n", "utf8");
}

function writeExcludedRequest(entry) {
  insertInto("excluded_requests", entry);
  fs.appendFileSync(EXCLUDED_REQUESTS_FILE, JSON.stringify(entry) + "\n", "utf8");
}

function resetRecords() {
  const visitRow = querySql("SELECT COUNT(*) AS count FROM visits;")[0] || {};
  const excludedRow = querySql("SELECT COUNT(*) AS count FROM excluded_requests;")[0] || {};
  const deleted = {
    visits: Number(visitRow.count || 0),
    excludedRequests: Number(excludedRow.count || 0)
  };
  const resetAt = new Date().toISOString();

  runSql(`
    DELETE FROM visits;
    DELETE FROM excluded_requests;
  `);
  fs.writeFileSync(DATA_FILE, "", "utf8");
  fs.writeFileSync(EXCLUDED_REQUESTS_FILE, "", "utf8");
  saveAlertState({
    ...loadAlertState(),
    lastResetAt: resetAt,
    lastNoVisitAlertAt: "",
    lastRecoveredAt: ""
  });

  return { deleted, resetAt };
}

function makeVisit(req, payload) {
  const rawIp = getIp(req);
  const forwardedFor = getForwardedFor(req);
  const socketIp = getSocketIp(req);
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ip: normalizeIp(rawIp),
    rawIp,
    forwardedFor,
    socketIp,
    path: payload.path || "/",
    title: payload.title || "",
    referrer: payload.referrer || "",
    userAgent: req.headers["user-agent"] || "",
    visitorId: payload.visitorId || "",
    screen: payload.screen || "",
    language: payload.language || "",
    timezone: payload.timezone || "",
    testId: payload.testId || "",
    reason: payload.reason || "",
    clientVersion: payload.clientVersion || ""
  };
}

function getExclusionReason(visit) {
  const exclusions = loadExclusions();
  if (exclusions.excludedIps.includes(visit.ip)) {
    return { type: "ip", value: visit.ip };
  }
  if (exclusions.excludedVisitorIds.includes(visit.visitorId)) {
    return { type: "visitorId", value: visit.visitorId };
  }
  return null;
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
  const requestUrl = new URL(req.url || "/", "http://portfolio-tracker.local");
  const pathname = requestUrl.pathname;

  if (req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) {
      json(res, 403, { ok: false, error: "Origin not allowed", version: TRACKER_VERSION }, headers);
      return;
    }
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (pathname === "/health") {
    const stats = getVisitStats();
    const alert = await maybeSendNoVisitAlert(stats);
    json(res, 200, {
      ok: true,
      timestamp: new Date().toISOString(),
      version: TRACKER_VERSION,
      storage: "sqlite",
      visits: stats.visits,
      lastVisitAt: stats.lastVisitAt,
      hoursSinceLastVisit: stats.hoursSinceLastVisit,
      lastResetAt: stats.lastResetAt,
      hoursSinceReset: stats.hoursSinceReset,
      stale: stats.stale,
      alertThresholdHours: NO_VISIT_ALERT_HOURS,
      alert
    }, headers);
    return;
  }

  if (pathname === "/track" && req.method === "POST") {
    if (!isAllowedOrigin(origin)) {
      writeExcludedRequest({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ip: normalizeIp(getIp(req)),
        rawIp: getIp(req),
        forwardedFor: getForwardedFor(req),
        socketIp: getSocketIp(req),
        path: requestUrl.pathname + requestUrl.search,
        title: "",
        referrer: "",
        userAgent: req.headers["user-agent"] || "",
        visitorId: "",
        screen: "",
        language: "",
        timezone: "",
        excludedBy: "origin",
        excludedValue: origin || "-"
      });
      json(res, 403, { ok: false, error: "Origin not allowed", version: TRACKER_VERSION }, headers);
      return;
    }
    try {
      const raw = await readBody(req);
      const payload = readJsonBody(raw);
      const visit = makeVisit(req, payload);
      const exclusion = getExclusionReason(visit);
      if (exclusion) {
        writeExcludedRequest({
          ...visit,
          excludedBy: exclusion.type,
          excludedValue: exclusion.value
        });
        json(res, 200, { ok: true, excluded: true, reason: exclusion.type, id: visit.id, version: TRACKER_VERSION }, headers);
        return;
      }
      writeVisit(visit);
      queueEnrichment(visit.ip);
      json(res, 200, { ok: true, id: visit.id, version: TRACKER_VERSION }, headers);
    } catch (error) {
      json(res, 400, { ok: false, error: error.message, version: TRACKER_VERSION }, headers);
    }
    return;
  }

  if (pathname === "/api/exclusions/current-ip" && req.method === "POST") {
    if (!requireAuth(req, res)) return;
    const value = normalizeIp(getIp(req));
    const excludedIps = writeExclusions("ip", "add", value);
    json(res, 200, { ok: true, value, excludedIps });
    return;
  }

  if (pathname === "/api/exclusions/ip" && (req.method === "POST" || req.method === "DELETE")) {
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

  if (pathname === "/api/exclusions/visitor" && (req.method === "POST" || req.method === "DELETE")) {
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

  if (pathname === "/api/records/reset" && req.method === "POST") {
    if (!requireAuth(req, res)) return;
    try {
      json(res, 200, { ok: true, ...resetRecords() });
    } catch (error) {
      json(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (pathname === "/api/stats") {
    if (!requireAuth(req, res)) return;
    json(res, 200, await summarizeVisits(loadVisits()));
    return;
  }

  if (pathname === "/" || pathname === "/dashboard") {
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
    console.log(`HTTPS 방문 추적 서버 실행 중: ${HTTPS_PORT}`);
  });

  if (ENABLE_HTTP) {
    http.createServer(requestHandler).listen(HTTP_PORT, () => {
      console.log(`HTTP 방문 추적 서버 실행 중: ${HTTP_PORT}`);
    });
  }
}

initializeDatabase();
startServers();

