const { test, expect, chromium } = require("@playwright/test");

const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const siteUrl = process.env.PORTFOLIO_TEST_URL || "https://darkhtk.github.io/portfolio/";
const trackerEndpoint = "https://semirain.synology.me/track";

test("live page sends a tracker request", async () => {
  const testId = `playwright-${Date.now()}`;
  const browser = await chromium.launch({ executablePath: chromePath });
  const page = await browser.newPage({ locale: "ko-KR" });

  const responsePromise = page.waitForResponse(
    (response) => response.url().startsWith(trackerEndpoint),
    { timeout: 15_000 }
  );

  const url = new URL(siteUrl);
  url.searchParams.set("tracker_test", testId);
  url.searchParams.set("tracker_debug", "1");

  await page.goto(url.toString(), { waitUntil: "networkidle" });
  const response = await responsePromise;
  const payload = await response.json();

  expect(response.status()).toBe(200);
  expect(payload.ok).toBe(true);
  expect(payload.version).toBe("server-v2");

  if (process.env.TRACKER_EXPECT_COUNTED === "1") {
    expect(payload.excluded).not.toBe(true);
  }

  await browser.close();
});
