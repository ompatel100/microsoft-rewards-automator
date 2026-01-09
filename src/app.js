import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { program } from "commander";
import { generateQueries } from "./queryGenerator.js";
import { config, delay, randomInt, type, clear } from "./utils.js";

program
  .option("-p, --profile <key>", "profile key in config")
  .option("-c, --count <number>", "search count", parseInt)
  .option("--min <number>", "minimum random searches", parseInt)
  .option("--max <number>", "maximum random searches", parseInt)
  .option("-H, --headless", "headless mode")
  .parse(process.argv);

const opts = program.opts();

const { profileList, defaultProfileKey } = config.profiles;
let profileKey = opts.profile;

if (!profileKey) {
  console.log(
    `No profile specified (--profile). Using default config profile: ${defaultProfileKey}`
  );
  profileKey = defaultProfileKey;
}

const profileDir = profileList[profileKey];

if (!profileDir) {
  console.log(`Profile key '${profileKey}' not found in config.`);
  process.exit(1);
}

let searchCount = 0;

if (opts.count) {
  searchCount = opts.count;
} else if (opts.min && opts.max) {
  searchCount = randomInt(opts.min, opts.max);
} else {
  searchCount = randomInt(config.search.min, config.search.max);
}

const queries = generateQueries(searchCount);

puppeteer.use(StealthPlugin());

const isHeadless =
  opts.headless !== undefined ? opts.headless : config.browser.headless;

if (isHeadless) {
  console.log("Running in headless mode");
}

let browser;

try {
  browser = await puppeteer.launch({
    executablePath: config.browser.executablePath,
    headless: isHeadless,
    userDataDir: config.browser.userDataDir,
    args: [`--profile-directory=${profileDir}`],
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
      config.delays.cooldown.min,
      config.delays.cooldown.max
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
