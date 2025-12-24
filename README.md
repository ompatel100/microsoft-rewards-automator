# Microsoft Rewards Automator

A Microsoft Rewards automation tool for Edge featuring stealth, dynamic query generation, multiple profile support and extensive configuration.

---

## Features

- **Dynamic Query Generation:** Capable of producing `20,000+` unique queries from the current dataset by different combinations of words (prefix + topic) or (topic + suffix) or (prefix + topic + suffix) for different categories which is **easily scalable**. Every possible combination of queries sounds **human-like**. Unique queries for target search count are **guaranteed** ensuring no points loss because of duplicate query.

- **Multiple Profile Support:** Users can define as many profile mappings as they want. Run a specific profile by providing `--profile` flag in **cli**.

- **Stealth:** Uses `puppeteer-extra-plugin-stealth` to patch automation flags and minimize detection footprint.

- **Simplest setup:** Run the setup script (`npm run setup`) that launches a browser instance for one-time manual login and profile configuration that persists afterwards.

- **Set and forget:** No disturbances when it runs in the background invisibly. Schedule via Task Scheduler and forget completely.

- **Extensive Configuration:** All possible configurations like search count, profile mappings, headless mode, paths, delays are managed via a user friendly `config.json` file.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.18.0 or higher)
- Microsoft Edge installed

## Installation

1. Download the ZIP or Clone the repository:

```bash
git clone https://github.com/ompatel100/microsoft-rewards-automator.git
```

2. Install dependencies:

Run this in terminal from the root folder.

```bash
npm install
```

---

## Setup & Configuration

Open `config.json` located in the root folder for below configurations.

### User Data Folder

```json
"userDataDir": "C:\\EdgeAutomationData"
```

- `userDataDir` is the folder where this tool will store all profile data for Edge.
- Edge stores its data in the `User Data` folder located at the path:
  `C:\\Users\\<YOUR_USERNAME>\\AppData\\Local\\Microsoft\\Edge\\User Data`

### You have 2 Options:

#### 1. Use the existing `User Data` folder that your browser already uses

- This will run out of the box. You will not need to create a new profile and login separately for that because it will use your daily browsing profile from that folder.
- While the script is running on a profile, you can't open that same profile in Edge because only one active instance for a profile is allowed at a time by browser.
- Improper script shutdown can trigger Edge's Crash Recovery mode which may cause it to reset some browser settings and preferences on the next launch.
- If you want to use that specific profile while running script or don't want some settings to change unexpectedly, choose **option 2**.
- If you wish to proceed, change `userDataDir` to this path and write your username in place of `<YOUR_USERNAME>`

```json
"userDataDir": "C:\\Users\\<YOUR_USERNAME>\\AppData\\Local\\Microsoft\\Edge\\User Data"
```

#### 2. Use a new folder completely separate from the daily browser's folder

- This keeps your personal browsing completely separate.
- You can keep the default `C:\\EdgeAutomationData`, rename the folder, change its location based on your preference.
- You are required to run a one-time setup script to login to your microsoft account.

---

### Running Setup Script & Login (Skip if chosen option 1)

Run this in terminal from the root folder.

```bash
npm run setup
```

- A browser window will open after running it.
- Login to your microsoft account for this **Default** profile.
- If you want to setup multiple profiles then click the profile icon and then **"Set up a new personal profile"** option. Then login in to your microsoft account for this profile.
- Repeat this for more profiles.

---

### Configuration for Profiles

```json
"profiles": {
  "d": "Default",
  "p1": "Profile 1",
  "p2": "Profile 2"
}
```

- If you want to have multiple accounts for microsoft rewards then you will need a separate profile in Edge for each account.
- If chosen **option 1**, then find your profile names in the User Data folder:
  `C:\Users\<YOUR_USERNAME>\AppData\Local\Microsoft\Edge\User Data`
- If chosen **option 2** and ran the setup script, then you will find your profile names in your configured user data folder in `userDataDir`
- Names like **Default**, **Profile 1**, **Profile 2**, etc. are used by Edge for your multiple profile. Make sure the names in the folder match in your configuration.
- The **d**, **p1**, **p2** are just short names used in cli to refer your profiles when running the script, you can keep them as per your preference.
- If you have only 1 profile then most likely it will be Default, just confirm it from the folder and you can remove other profiles from the configuration.

```json
"defaultProfileKey": "d"
```

- This is the default profile that will be used to run the script if no arguments are provided in cli.
- Change it to your prefered profile, just make sure it matches with the key (short name) you configured.

---

### Search Count

```json
"searchCount": 20
```

Configure the no of searches you want to make.

---

### Search Cooldown (⚠️Very Important)

```json
"searchCooldownMin": 10000,
"searchCooldownMax": 15000
```

- Minimum, Maximum time (in milliseconds) to wait after a search completes.
- For every search, the cooldown time will be a random number between these two values.
- Microsoft rewards require some seconds of delay to earn points before next search is made.
- It is **not recommended** to keep it low as it may increase the chances of getting **detected** . So be careful, do it at your **own risk**.

---

### Headless Mode

```json
"headless": false
```

- **`false` (Recommended for starting)**: The browser window will open, and you can see the bot performing the searches. Check for the first time to confirm that everything is working correctly and the points are accumulating.
- **`true`**: The browser runs entirely in the background without the window. Use this after you verified.

---

### Typing Speed

```json
"typeMin": 100,
"typeMax": 250
```

- Minimum, Maximum time (in milliseconds) for typing speed.
- For every character typed, there will be a random delay in between from these values.

---

## Usage

### Run the Bot

You can run the bot for your default profile or provide flag for the profile you want to run.

**Run Default Profile:**

```bash
npm start
```

**Run Specific Profile using `--profile` or `-p` flag:**

Example: Profile 2

```bash
npm start -- --profile p2
```

---

## ⚠️ Disclaimer

**Please read this carefully before using the software.**

1. **Educational Purpose Only:** This project is developed strictly for educational purposes. It is not intended to harm, disrupt, or exploit any service.
2. **Terms of Service Violation:** Automating user actions may violate their Services Agreement.

3. **Use at Your Own Risk:** The developer of this repository assumes **no liability** for any consequences resulting from the use of this tool. You are solely responsible for your account's safety and compliance with applicable laws and terms.
4. **No Affiliation:** This project is an independent open-source initiative and is **not** affiliated, endorsed, or associated with Microsoft Corporation or Bing.

**By running this script, you acknowledge these risks and agree to use the tool responsibly.**

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
