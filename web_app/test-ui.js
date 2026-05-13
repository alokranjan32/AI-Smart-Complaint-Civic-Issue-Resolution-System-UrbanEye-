const fs = require("fs");
const puppeteer = require("puppeteer-core");

const BASE_URL = process.env.UI_BASE_URL || "http://127.0.0.1:3001";

async function runStep(name, handler) {
  console.log(`Testing: ${name}`);

  try {
    const details = await handler();

    if (details.status) {
      console.log(`Status: ${details.status}`);
    }

    if (details.url) {
      console.log(`URL: ${details.url}`);
    }

    if (details.info) {
      console.log(`Info: ${details.info}`);
    }

    console.log(`Result: PASS - ${details.message}`);
  } catch (error) {
    console.log(`Result: FAIL - ${error.message}`);
  }

  console.log("---");
}

async function expectText(page, selector, expected) {
  await page.waitForSelector(selector, { timeout: 10000 });
  const text = await page.$eval(selector, (node) => node.textContent?.trim() || "");

  if (!text.includes(expected)) {
    throw new Error(`Expected "${expected}" in ${selector}, found "${text}"`);
  }

  return text;
}

async function runUITests() {
  console.log("Running UrbanEye UI Tests...\n");

  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const launchOptions = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1440, height: 960 },
  };

  if (fs.existsSync(chromePath)) {
    launchOptions.executablePath = chromePath;
  }

  const browser = await puppeteer.launch(launchOptions);

  const page = await browser.newPage();
  page.setDefaultTimeout(10000);

  try {
    await runStep("Homepage Load", async () => {
      const response = await page.goto(`${BASE_URL}/`, {
        waitUntil: "networkidle2",
      });
      const heading = await expectText(
        page,
        "h1",
        "Report city problems, route them faster, and keep residents informed.",
      );

      return {
        status: response?.status(),
        url: page.url(),
        info: `Heading: ${heading}`,
        message: "Homepage loaded successfully",
      };
    });

    await runStep("Navigation to Dashboard", async () => {
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle2" });
      await Promise.all([
        page.waitForFunction(() => window.location.pathname === "/dashboard"),
        page.click('a[href="/dashboard"]'),
      ]);
      const heading = await expectText(page, "h1", "Today's complaint flow at a glance");

      return {
        url: page.url(),
        info: `Heading: ${heading}`,
        message: "Dashboard page loaded",
      };
    });

    await runStep("Navigation to Complaints", async () => {
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle2" });
      await Promise.all([
        page.waitForFunction(() => window.location.pathname === "/complaints"),
        page.click('a[href="/complaints"]'),
      ]);
      const heading = await expectText(page, "h1", "Citizen reporting and live triage");

      return {
        url: page.url(),
        info: `Heading: ${heading}`,
        message: "Complaints page loaded",
      };
    });

    await runStep("Navigation to Map", async () => {
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle2" });
      await Promise.all([
        page.waitForFunction(() => window.location.pathname === "/map"),
        page.click('a[href="/map"]'),
      ]);
      const heading = await expectText(page, "h2", "Real complaint hotspots across the city");

      return {
        url: page.url(),
        info: `Section: ${heading}`,
        message: "Map page loaded",
      };
    });

    await runStep("Login Flow", async () => {
      const response = await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
      await page.type('input[type="email"]', "citizen@urbaneye.dev");
      await page.type('input[type="password"]', "secret123");

      await Promise.all([
        page.waitForFunction(() => window.location.pathname === "/dashboard"),
        page.click('button[type="submit"]'),
      ]);

      const heading = await expectText(page, "h1", "Today's complaint flow at a glance");

      return {
        status: response?.status(),
        url: page.url(),
        info: `Redirected heading: ${heading}`,
        message: "Login completed and dashboard opened",
      };
    });

    await runStep("Complaint Submission Flow", async () => {
      const response = await page.goto(`${BASE_URL}/complaints`, { waitUntil: "networkidle2" });
      await page.type('input[placeholder="Issue title"]', "Streetlight not working");
      await page.type(
        'textarea[placeholder="Describe what happened"]',
        "The streetlight has been off for two nights near the main crossing.",
      );
      await page.type('input[placeholder="Location"]', "Kankarbagh, Patna");

      await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForFunction(() =>
          document.body.innerText.includes("Complaint submitted and routed for triage."),
        ),
      ]);

      const successText = await page.evaluate(() => {
        return document.body.innerText.includes("Complaint submitted and routed for triage.");
      });

      if (!successText) {
        throw new Error("Complaint success message did not appear.");
      }

      return {
        status: response?.status(),
        url: page.url(),
        info: "Complaint submitted and routed for triage.",
        message: "Complaint form submitted successfully",
      };
    });
  } finally {
    await browser.close();
  }
}

runUITests().catch((error) => {
  console.error(`UI Test Error: ${error.message}`);
  process.exitCode = 1;
});
