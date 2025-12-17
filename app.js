import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const EDGE_PATH =
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const USER_DATA = "C:\\EdgeAutomationData";
const PROFILE_DIR = "Default";

const SEARCH_BOX_SELECTOR = "#sb_form_q";

const queries = [
  "latest tech news",
  "best sci-fi movies of all time",
  "javascript array methods",
  "current stock market trends",
  "noise cancelling headphones",
  "rdr 2",
  "quantum physics",
  "top 10 books to read",
  "spacex launch schedule",
  "react js interview questions",
  "best gaming laptops",
  "node js tutorial crash course",
  "tallest building in the world",
  "ps5 vs xbox",
  "learn to play guitar beginner",
  "best documentaries on netflix",
  "world cup winners list",
  "how to boil an egg perfectly",
  "crypto market cap today",
  "rtx 5090",
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const type = async (page, selector, text) => {
  await page.focus(selector);

  for (const char of text) {
    await page.keyboard.type(char);

    const randomDelay = randomInt(100, 250);

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

  for (let i = 0; i < queries.length; i++) {
    await page.waitForSelector(SEARCH_BOX_SELECTOR);

    if (i > 0) {
      await clear(page, SEARCH_BOX_SELECTOR);
    }

    await type(page, SEARCH_BOX_SELECTOR, queries[i]);

    await page.keyboard.press("Enter");

    const cooldown = randomInt(10000, 15000);
    await delay(cooldown);
  }
} catch (err) {
  console.error("Error: " + err);
} finally {
  if (browser) {
    await browser.close();
  }
}
