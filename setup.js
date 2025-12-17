import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const EDGE_PATH =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const USER_DATA = "C:\\EdgeAutomationData";
const PROFILE_DIR = "Default";

console.log("Opening Browser for setup...");
console.log("Add your Microsoft Account to this profile");
console.log("If logged in previously, verify that your account shows");
console.log("Close the browser when finished");

try {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: false,
    userDataDir: USER_DATA,
    args: [`--profile-directory=${PROFILE_DIR}`],
    defaultViewport: null,
  });

  const page = (await browser.pages())[0];
  await page.goto("https://www.bing.com");

  await new Promise((resolve) => browser.on("disconnected", resolve));

  console.log("Browser closed");
} catch (err) {
  console.error("Error: " + err);
}
