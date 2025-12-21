import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { config, getProfile } from "./utils.js";

const profileDir = getProfile();

puppeteer.use(StealthPlugin());

console.log(`Opening Browser for seting up profile: ${profileDir}`);
console.log("-> Add your Microsoft Account to this profile");
console.log("-> If logged in previously, verify that your account shows");
console.log("-> Close the browser when finished");

try {
  const browser = await puppeteer.launch({
    executablePath: config.browser.executablePath,
    headless: false,
    userDataDir: config.browser.userDataDir,
    args: [`--profile-directory=${profileDir}`],
    defaultViewport: null,
  });

  const page = (await browser.pages())[0];
  await page.goto("https://www.bing.com");

  await new Promise((resolve) => browser.on("disconnected", resolve));

  console.log("Browser closed");
} catch (err) {
  console.error("Error: " + err);
}
