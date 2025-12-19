import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { createRequire } from "module";
import { generateQueries } from "./queryGenerator.js";

const require = createRequire(import.meta.url);
const config = require("./config.json");

const queries = generateQueries(config.searchCount);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const type = async (page, selector, text) => {
  await page.focus(selector);

  for (const char of text) {
    await page.keyboard.type(char);

    const randomDelay = randomInt(config.delays.typeMin, config.delays.typeMax);

    if (Math.random() < 0.1) {
      await delay(randomDelay + 200);
    } else {
      await delay(randomDelay);
    }
  }
};

const clear = async (page, selector) => {
  await page.focus(selector);
  await delay(randomInt(100, 130));

  await page.keyboard.down("Control");
  await delay(randomInt(50, 150));

  await page.keyboard.press("A");
  await delay(randomInt(50, 150));

  await page.keyboard.up("Control");
  await delay(randomInt(50, 150));

  await page.keyboard.press("Backspace");
  await delay(randomInt(100, 300));
};

puppeteer.use(StealthPlugin());

let browser;

try {
  browser = await puppeteer.launch({
    executablePath: config.browser.executablePath,
    headless: config.browser.headless,
    userDataDir: config.browser.userDataDir,
    args: [`--profile-directory=${config.browser.profileDir}`],
  });

  const page = (await browser.pages())[0];

  await page.goto("https://www.bing.com");

  for (let i = 0; i < queries.length; i++) {
    const searchBoxSelector = config.selectors.searchBox;
    await page.waitForSelector(searchBoxSelector);

    if (i > 0) {
      await clear(page, searchBoxSelector);
    }

    await type(page, searchBoxSelector, queries[i]);

    await page.keyboard.press("Enter");

    const cooldown = randomInt(
      config.delays.searchCooldownMin,
      config.delays.searchCooldownMax
    );
    await delay(cooldown);
  }
} catch (err) {
  console.error("Error: " + err);
} finally {
  if (browser) {
    await browser.close();
  }
}
