# Letterboxd to Radarr Lists

This repository automatically scrapes various Letterboxd lists and converts them into Radarr-compatible JSON format. 

## How It Works ⚙️

Instead of relying on external services, this repository contains a lightweight Node.js scraper located in `src/scraper/`. 

A GitHub Actions workflow (`.github/workflows/update_lists.yml`) runs **every Sunday at midnight** (or manually on-demand). It:
1. Crawls the target Letterboxd lists.
2. Extracts metadata (Including TMDb and IMDb IDs).
3. Formats the data as expected by Radarr.
4. Saves the results into the `public/` folder natively on this repo and publishes them to GitHub Pages.

## Available Lists 📋

The following lists are currently tracked and updated automatically:

- **Top 100 French Films** (`top-100-french-films-top50.json` - limited to 50 items)
- **Top 100 Anime Films** (`top-100-anime-films-top50.json` - limited to 50 items)
- **The BFI 100 British Films** (`the-bfi-100-british-films.json`)
- **Top 100 Best Picture Nominees With The Most Fans** (`top-100-best-picture-nominees-with-the-most.json`)
- **Top 250 Films with the Most Fans** (`top-250-films-with-the-most-fans.json`)
- **Letterboxd's Top 500 Films** (`letterboxds-top-500-films.json`)
- **Top 100 German Films** (`top-100-german-films.json`)
- **Sternpaul Watchlist** (`sternpaul-watchlist.json`)

## Using with Radarr 🎬

To use these lists in Radarr:
1. Go to **Settings > Lists**.
2. Add a new **Custom List**.
3. Under **List URL**, point it to the raw JSON file hosted on this repo's GitHub Pages or the raw GitHub file link (e.g., `https://<your-username>.github.io/letterboxd-lists/french-films.json`).
