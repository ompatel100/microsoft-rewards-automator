import { COMMON_SEARCHES, CATEGORY_SEARCHES } from "./searchData.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const config = require("./config.json");

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomKey = (obj) =>
  Object.keys(obj)[Math.floor(Math.random() * Object.keys(obj).length)];

export function generateQueries(count = config.searchCount) {
  const queries = new Set();

  let loop = 0;
  while (queries.size < count && loop < count * 100) {
    loop++;
    let random = Math.random();
    let query = "";

    if (random < 0.2) {
      // 20% probability
      // Common Searches
      query = getRandomItem(COMMON_SEARCHES);
    } else {
      // 80% probability
      // Category searches
      const data = CATEGORY_SEARCHES[getRandomKey(CATEGORY_SEARCHES)];

      // Randomize for remaining 80%
      random = Math.random();

      if (random < 0.44) {
        // 0.44 of 0.80 = 35% probability
        // Topic
        query = getRandomItem(data.topics);
      } else if (random < 0.81) {
        // 0.44 to 0.81 = 0.37
        // 0.37 of 0.80 = 30% probability
        // Topic + Suffix
        query = `${getRandomItem(data.topics)} ${getRandomItem(data.suffixes)}`;
      } else if (random < 0.94) {
        // 0.81 to 0.94 = 0.13
        // 0.13 of 0.80 = 10% probability
        // Prefix + Topic
        query = `${getRandomItem(data.prefixes)} ${getRandomItem(data.topics)}`;
      } else {
        // Remaining 5% probability
        // Prefix + Topic + Suffix
        query = `${getRandomItem(data.prefixes)} ${getRandomItem(
          data.topics
        )} ${getRandomItem(data.suffixes)}`;
      }
    }
    queries.add(query);
  }

  return Array.from(queries);
}
