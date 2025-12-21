import { createRequire } from "module";
const require = createRequire(import.meta.url);

const config = require("../config.json");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomKey = (obj) =>
  Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)];

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

const getProfile = () => {
  const args = process.argv.slice(2);
  let flagIndex = args.indexOf("--profile");

  if (flagIndex === -1) {
    flagIndex = args.indexOf("-p");
  }

  if (flagIndex === -1) {
    console.log(
      `No profile specified (--profile). Using default config profile: ${
        config.profiles[config.defaultProfileKey]
      }`
    );
    return config.profiles[config.defaultProfileKey];
  }

  const key = args[flagIndex + 1];

  if (config.profiles[key]) {
    return config.profiles[key];
  }

  console.log(
    `Profile key '${key}' not found in config. Using default config profile: ${
      config.profiles[config.defaultProfileKey]
    }.`
  );
  return config.profiles[config.defaultProfileKey];
};

export {
  config,
  delay,
  randomInt,
  getRandomItem,
  getRandomKey,
  type,
  clear,
  getProfile,
};
