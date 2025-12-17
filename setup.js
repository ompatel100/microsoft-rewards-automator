import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const config = require("./config.json");

puppeteer.use(StealthPlugin());

console.log("Opening Browser for setup...");
console.log("Add your Microsoft Account to this profile");
console.log("If logged in previously, verify that your account shows");
console.log("Close the browser when finished");

try {
  const browser = await puppeteer.launch({
    executablePath: config.browser.executablePath,
    headless: false,
    userDataDir: config.browser.userDataDir,
    args: [`--profile-directory=${config.browser.profileDir}`],
    defaultViewport: null,
  });

  const page = (await browser.pages())[0];
  await page.goto("https://www.bing.com");

  await new Promise((resolve) => browser.on("disconnected", resolve));

  console.log("Browser closed");
} catch (err) {
  console.error("Error: " + err);
}
