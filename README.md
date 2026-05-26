# Letterboxd to Radarr Lists

This repository automatically scrapes various Letterboxd lists and converts them into Radarr-compatible JSON format. 

## How It Works ⚙️

Instead of relying on external services, this repository contains a lightweight Node.js scraper located in `src/scraper/`. 

A GitHub Actions workflow (`.github/workflows/update_lists.yml`) runs **every day at Midnight UTC** (or manually on-demand). It:
1. Crawls the target Letterboxd lists.
2. Extracts metadata (Including TMDb and IMDb IDs).
3. Formats the data as expected by Radarr.
4. Checks for differences (movies added/removed).
5. Dispatches an overview summary to Discord via Webhooks.
6. Saves the results into the `public/` folder natively on this repo and publishes them to GitHub Pages.

## Available Lists 📋

The following lists are currently tracked and updated automatically:

- **Top 100 French Films** (`top-100-french-films-top50.json` - limited to 50 items)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-french-films-top50.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-french-films-top50.json)
- **Top 100 Anime Films** (`top-100-anime-films-top50.json` - limited to 50 items)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-anime-films-top50.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-anime-films-top50.json)
- **The BFI 100 British Films** (`the-bfi-100-british-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/the-bfi-100-british-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/the-bfi-100-british-films.json)
- **Top 100 Best Picture Nominees With The Most Fans** (`top-100-best-picture-nominees-with-the-most.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-best-picture-nominees-with-the-most.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-best-picture-nominees-with-the-most.json)
- **Top 250 Films with the Most Fans** (`top-250-films-with-the-most-fans.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-with-the-most-fans.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-with-the-most-fans.json)
- **Letterboxd's Top 500 Films** (`letterboxds-top-500-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/letterboxds-top-500-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/letterboxds-top-500-films.json)
- **Top 100 German Films** (`top-100-german-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-german-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-german-films.json)
- **Sternpaul Watchlist** (`sternpaul-watchlist.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/sternpaul-watchlist.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/sternpaul-watchlist.json)

## Using with Radarr 🎬

To use these lists in Radarr:
1. Go to **Settings > Lists**.
2. Add a new **Custom List** (set to "Radarr" / "Custom" depending on version).
3. Under **List URL**, point it to the required list using one of the following formats:

**Option A: Raw GitHub File (Recommended)**
```text
https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-best-picture-nominees-with-the-most.json
```

**Option B: GitHub Pages Deployment**
```text
https://Sternpaul.github.io/letterboxd-lists/public/top-100-best-picture-nominees-with-the-most.json
```

**(Just swap out the filename at the end of the URL for the specific list you want to use from the 'Available Lists' section above)*.

## Discord Notifications 🔔

This repository includes native, rich Discord Webhook notifications. It will push a beautiful summary panel to your server every night.

- If **movies were added or removed**, you will get a green/red breakdown showing the exact differences and exact movie titles that were changed.
- If **nothing changed**, you will get a green success embed printing out the total synced movie counts to prove the execution ran smoothly.
- If the **Action fails completely** (e.g. Letterboxd servers are down), you will get a red error alert with a direct URL linking to the GitHub Action logs.

**To enable this:**
1. Navigate to **Settings > Secrets and variables > Actions** in your GitHub repository.
2. Click **New repository secret**.
3. Name the secret exactly `DISCORD_WEBHOOK_URL`.
4. Paste your Discord channel Webhook URL into the secret body.
