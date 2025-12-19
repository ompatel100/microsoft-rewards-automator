import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { generateQueries } from "./queryGenerator.js";
import { config, delay, randomInt, type, clear } from "./utils.js";

const queries = generateQueries(config.searchCount);

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
