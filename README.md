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

The following lists are currently tracked and updated automatically. 

> [!NOTE]
> For a full directory of all official Letterboxd lists, including archived and one-time scraped lists that are available in this repository, please view the [Full Lists Directory](lists_directory.md).

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
- **Top 250 Films by Heart Rate** (`top-250-films-by-heart-rate.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-by-heart-rate.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-by-heart-rate.json)
- **Top 250 Documentary Films** (`top-250-documentary-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-documentary-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-documentary-films.json)
- **Top 250 Animated Films** (`top-250-animated-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-animated-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-animated-films.json)
- **Top 250 Short Films** (`top-250-short-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-short-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-short-films.json)
- **Top 250 Miniseries** (`top-250-miniseries.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-miniseries.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-miniseries.json)
- **Top 100 Documentary Miniseries** (`top-100-documentary-miniseries.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-documentary-miniseries.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-documentary-miniseries.json)
- **Top 100 Concert Films** (`top-100-concert-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-concert-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-concert-films.json)
- **Top 100 Comedy Specials** (`top-100-comedy-specials.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-comedy-specials.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-comedy-specials.json)
- **Top 100 Pro-Shot Theatre Films** (`top-100-pro-shot-theatre-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-pro-shot-theatre-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-pro-shot-theatre-films.json)
- **Top 50 Adult Films** (`top-50-adult-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-50-adult-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-50-adult-films.json)
- **Top 250 Films of the 2020s** (`top-250-films-of-the-2020s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-2020s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-2020s.json)
- **Top 250 Films of the 2010s** (`top-250-films-of-the-2010s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-2010s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-2010s.json)
- **Top 250 Films of the 2000s** (`top-250-films-of-the-2000s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-2000s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-2000s.json)
- **Top 250 Films of the 1990s** (`top-250-films-of-the-1990s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-1990s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-1990s.json)
- **Top 250 Films of the 1980s** (`top-250-films-of-the-1980s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-1980s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-1980s.json)
- **Top 250 Films of the 1970s** (`top-250-films-of-the-1970s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-1970s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-1970s.json)
- **Top 250 Films of the 1960s** (`top-250-films-of-the-1960s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-1960s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-1960s.json)
- **Top 250 Films of the 1950s** (`top-250-films-of-the-1950s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-1950s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-1950s.json)
- **Top 250 Films of the 1940s** (`top-250-films-of-the-1940s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-1940s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-1940s.json)
- **Top 250 Films of the 1930s** (`top-250-films-of-the-1930s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-films-of-the-1930s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-films-of-the-1930s.json)
- **Top 100 Films of the 1920s** (`top-100-films-of-the-1920s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-films-of-the-1920s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-films-of-the-1920s.json)
- **Top 50 Films of the 1910s** (`top-50-films-of-the-1910s.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-50-films-of-the-1910s.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-50-films-of-the-1910s.json)
- **Top 250 Action Films** (`top-250-action-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-action-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-action-films.json)
- **Top 250 Biographical Films** (`top-250-biographical-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-biographical-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-biographical-films.json)
- **Top 250 Crime Films** (`top-250-crime-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-crime-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-crime-films.json)
- **Top 100 Film Noir Films** (`top-100-film-noir-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-film-noir-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-film-noir-films.json)
- **Top 250 Horror Films** (`top-250-horror-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-horror-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-horror-films.json)
- **Top 100 Live-Action Fantasy Films** (`top-100-live-action-fantasy-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-live-action-fantasy-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-live-action-fantasy-films.json)
- **Top 250 Musical Films** (`top-250-musical-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-musical-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-musical-films.json)
- **Top 250 Mystery Films** (`top-250-mystery-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-mystery-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-mystery-films.json)
- **Top 250 Science Fiction Films** (`top-250-science-fiction-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-science-fiction-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-science-fiction-films.json)
- **Top 100 Sports Films** (`top-100-sports-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-sports-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-sports-films.json)
- **Top 250 War Films** (`top-250-war-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-war-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-war-films.json)
- **Top 100 Western Films** (`top-100-western-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-western-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-western-films.json)
- **Top 50 Heroic Bloodshed Films** (`top-50-heroic-bloodshed-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-50-heroic-bloodshed-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-50-heroic-bloodshed-films.json)
- **Top 250 Romantic Comedy Films** (`top-250-romantic-comedy-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-romantic-comedy-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-romantic-comedy-films.json)
- **Top 100 Samurai Films** (`top-100-samurai-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-samurai-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-samurai-films.json)
- **Top 100 Spy Films** (`top-100-spy-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-spy-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-spy-films.json)
- **Top 100 Wuxia Films** (`top-100-wuxia-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-wuxia-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-wuxia-films.json)
- **Top 100 Australian Films** (`top-100-australian-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-australian-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-australian-films.json)
- **Top 50 Austrian Films** (`top-50-austrian-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-50-austrian-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-50-austrian-films.json)
- **Top 100 British Films** (`top-100-british-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-british-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-british-films.json)
- **Top 100 Canadian Films** (`top-100-canadian-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-canadian-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-canadian-films.json)
- **Top 100 Danish Films** (`top-100-danish-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-danish-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-danish-films.json)
- **Top 100 Dutch Films** (`top-100-dutch-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-dutch-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-dutch-films.json)
- **Top 100 Italian Films** (`top-100-italian-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-italian-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-italian-films.json)
- **Top 100 South Korean Films** (`top-100-south-korean-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-south-korean-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-south-korean-films.json)
- **Top 100 Spanish Films** (`top-100-spanish-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-spanish-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-spanish-films.json)
- **Top 100 Swedish Films** (`top-100-swedish-films.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-swedish-films.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-swedish-films.json)
- **Top 100 Films with the Most Fans by “He” Pronoun** (`top-100-films-with-the-most-fans-by-he-pronoun.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-films-with-the-most-fans-by-he-pronoun.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-films-with-the-most-fans-by-he-pronoun.json)
- **Top 250 Non-English Language Films with the Most Fans** (`top-250-non-english-language-films-with-the.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-non-english-language-films-with-the.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-non-english-language-films-with-the.json)
- **Top 250 Pre-1970s Films with the Most Fans** (`top-250-pre-1970s-films-with-the-most-fans.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-250-pre-1970s-films-with-the-most-fans.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-250-pre-1970s-films-with-the-most-fans.json)
- **Top 100 Films of the 2020s with the Most Fans** (`top-100-films-of-the-2020s-with-the-most.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-films-of-the-2020s-with-the-most.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-films-of-the-2020s-with-the-most.json)
- **Top 100 Best International Feature Oscar Nominees with the Most Fans** (`top-100-best-international-feature-oscar.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-best-international-feature-oscar.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-best-international-feature-oscar.json)
- **Top 100 Palme d’Or In Competition Nominees with the Most Fans** (`top-100-palme-dor-in-competition-nominees.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-palme-dor-in-competition-nominees.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-palme-dor-in-competition-nominees.json)
- **Top 100 Films on the Most Watchlists** (`top-100-films-on-the-most-watchlists.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-films-on-the-most-watchlists.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-films-on-the-most-watchlists.json)
- **Top 100 Fastest Films to One Million Watched** (`top-100-fastest-films-to-one-million-watched.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/top-100-fastest-films-to-one-million-watched.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/top-100-fastest-films-to-one-million-watched.json)

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

## List Tracking & Scrape Manifest 📊

All list metadata and scrape history are tracked using a dedicated tracking manifest:

- **Manifest File**: `src/scraper/last_scraped.json` tracks the exact ISO date (`YYYY-MM-DD`) when each JSON list was last fetched from Letterboxd.
- **Automatic Updates**: When `fetch_list.mjs` runs, it updates the corresponding timestamp in `last_scraped.json`.
- **Directory Generator**: `update_directory.mjs` reads `last_scraped.json` to generate [lists_directory.md](lists_directory.md), accurately showing when both **Daily Sync 🟢** and static **Not actively scraped 📦** lists were last fetched.

## Local Development & Scraper Commands 💻

You can run the scraper locally using Node.js:

### 1. Install Dependencies
```bash
cd src/scraper
npm install
```

### 2. Scrape a Specific Letterboxd List
```bash
# Usage: node fetch_list.mjs <listSlug> <outputFilePath> [limit]
node fetch_list.mjs official/list/top-250-films-of-the-2020s/ ../../public/top-250-films-of-the-2020s.json
```
- To limit the scrape (e.g. only top 50):
```bash
node fetch_list.mjs official/list/top-100-french-films/ ../../public/top-100-french-films-top50.json 50
```

### 3. Update the Lists Directory Table
```bash
node update_directory.mjs
```
This regenerates `lists_directory.md` with updated counts, sync statuses, and last scrape dates.

### 4. Adding a New List to Daily Automation
To schedule a list for automatic daily updates:
1. Open `.github/workflows/update_lists.yml`.
2. Add a new `node fetch_list.mjs ...` line under the **Fetch and filter lists** step.
3. Run `node update_directory.mjs` to promote the list from `Not actively scraped 📦` to `Daily Sync 🟢`.

