import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const EDGE_PATH =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const USER_DATA =
  "C:\\Users\\username\\AppData\\Local\\Microsoft\\Edge\\User Data";
const PROFILE_DIR = "Default";

let browser;

try {
  browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: false,
    userDataDir: USER_DATA,
    args: [`--profile-directory=${PROFILE_DIR}`],
  });

  const page = (await browser.pages())[0];

  await page.goto("https://www.bing.com");

  await page.waitForSelector("#sb_form_q");
  await page.type("#sb_form_q", "puppeteer", { delay: 100 });
  await page.keyboard.press("Enter");

  await delay(5000);
} catch (err) {
  console.error("Error: " + err);
} finally {
  if (browser) {
    await browser.close();
  }
}
