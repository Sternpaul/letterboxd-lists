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

- Top 100 French Films
- Top 100 Anime Films
- The BFI 100 British Films
- Top 100 Best Picture Nominees
- Top 250 Films with the Most Fans
- Letterboxd's Top 500 Films
- Top 100 German Films
- Personal Watchlist

## Using with Radarr 🎬

To use these lists in Radarr:
1. Go to **Settings > Lists**.
2. Add a new **Custom List**.
3. Under **List URL**, point it to the raw JSON file hosted on this repo's GitHub Pages or the raw GitHub file link (e.g., `https://<your-username>.github.io/letterboxd-lists/french-films.json`).
