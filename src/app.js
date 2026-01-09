import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { program } from "commander";
import { generateQueries } from "./queryGenerator.js";
import { config, delay, randomInt, type, clear } from "./utils.js";

program
  .name("microsoft-rewards-automator")
  .description(
    "A Microsoft Rewards automation tool for Edge featuring stealth, dynamic query generation, multiple profile support and extensive configuration."
  )
  .option("-p, --profile <key>", "profile key in config")
  .option("-c, --count <number>", "search count", parseInt)
  .option("--min <number>", "minimum random searches", parseInt)
  .option("--max <number>", "maximum random searches", parseInt)
  .option("-H, --headless", "headless mode")
  .option("--no-headless", "headed mode")
  .parse(process.argv);

const opts = program.opts();

console.log("----------------------------------------------------------");
console.log(`    __  _________________  ____  _____ ____  ____________
   /  |/  /  _/ ____/ __ \\/ __ \\/ ___// __ \\/ ____/_  __/
  / /|_/ // // /   / /_/ / / / /\\__ \\/ / / / /_    / /
 / /  / // // /___/ _, _/ /_/ /___/ / /_/ / __/   / /
/_/  /_/___/\\____/_/ |_|\\____//____/\\____/_/     /_/`);
console.log(`    ____  _______       _____    ____  ____  _____
   / __ \\/ ____/ |     / /   |  / __ \\/ __ \\/ ___/
  / /_/ / __/  | | /| / / /| | / /_/ / / / /\\__ \\
 / _, _/ /___  | |/ |/ / ___ |/ _, _/ /_/ /___/ /
/_/ |_/_____/  |__/|__/_/  |_/_/ |_/_____//____/`);
console.log(`    ___   __  ____________  __  ______  __________  ____
   /   | / / / /_  __/ __ \\/  |/  /   |/_  __/ __ \\/ __ \\
  / /| |/ / / / / / / / / / /|_/ / /| | / / / / / / /_/ /
 / ___ / /_/ / / / / /_/ / /  / / ___ |/ / / /_/ / _, _/
/_/  |_\\____/ /_/  \\____/_/  /_/_/  |_/_/  \\____/_/ |_|\n`);
console.log("----------------------------------------------------------\n");

const { profileList, defaultProfileKey } = config.profiles;
let profileKey = opts.profile;

if (!profileKey) {
  console.log(
    "No profile specified (--profile). Using default config profile.\n"
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

console.log(`- Profile: ${profileDir} (${profileKey})`);
console.log(`- Searches: ${searchCount}`);
console.log(`- Mode: ${isHeadless ? "Headless" : "Headed"}\n`);

console.log(`Generated ${queries.length} unique queries.`);

console.log("Opening browser...");

let browser;

try {
  browser = await puppeteer.launch({
    executablePath: config.browser.executablePath,
    headless: isHeadless,
    userDataDir: config.browser.userDataDir,
    args: [`--profile-directory=${profileDir}`],
  });

  const page = (await browser.pages())[0];

  console.log("Visiting bing...\n");
  await page.goto("https://www.bing.com");

  for (let i = 0; i < queries.length; i++) {
    const searchBoxSelector = config.selectors.searchBox;
    await page.waitForSelector(searchBoxSelector);

    if (i > 0) {
      await clear(page, searchBoxSelector);
    }

    console.log(`[${i + 1}/${queries.length}] Searching: ${queries[i]}`);

    await type(page, searchBoxSelector, queries[i]);

    await page.keyboard.press("Enter");

    if (i < queries.length - 1) {
      const cooldown = randomInt(
        config.delays.cooldown.min,
        config.delays.cooldown.max
      );

      console.log(`Cooling down ${(cooldown / 1000).toFixed(1)} sec\n`);
      await delay(cooldown);
    }
  }

  console.log(`All ${queries.length} searches completed successfully.\n`);
} catch (err) {
  console.log();
  console.error(err);
} finally {
  if (browser) {
    await browser.close();
  }
}
