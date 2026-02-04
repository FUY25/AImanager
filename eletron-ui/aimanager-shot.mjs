import { chromium } from 'playwright';

const url = process.argv[2] || 'http://127.0.0.1:4173/';
const path = process.argv[3] || '/tmp/aimanager-home.png';

let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
} catch (err) {
  console.error('Failed to launch Chrome channel:', err?.message || err);
  process.exit(1);
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path, fullPage: false });
await browser.close();
console.log(path);
