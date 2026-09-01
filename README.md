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

### Famous Community & Custom Lists 🌟

- **All Time Worldwide Box Office (The Numbers Top 100)** (`the-numbers-all-time-worldwide-box-office.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/the-numbers-all-time-worldwide-box-office.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/the-numbers-all-time-worldwide-box-office.json)
- **Movies Everyone Should Watch at Least Once** (`movies-everyone-should-watch-at-least-once.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/movies-everyone-should-watch-at-least-once.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/movies-everyone-should-watch-at-least-once.json)
- **1001 Movies You Must See Before You Die** (`1001-movies-you-must-see-before-you-die.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/1001-movies-you-must-see-before-you-die.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/1001-movies-you-must-see-before-you-die.json)
- **for when you want to feel something** (`for-when-you-want-to-feel-something.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/for-when-you-want-to-feel-something.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/for-when-you-want-to-feel-something.json)
- **You’re not the same person once the film has finished** (`youre-not-the-same-person-once-the-film-has.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/youre-not-the-same-person-once-the-film-has.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/youre-not-the-same-person-once-the-film-has.json)
- **classic movies for beginners.** (`classic-movies-for-beginners.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/classic-movies-for-beginners.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/classic-movies-for-beginners.json)
- **Psychosexual dramas, nihilistic fever dreams & surrealism with a touch of humour** (`psychosexual-dramas-nihilistic-fever-dreams.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/psychosexual-dramas-nihilistic-fever-dreams.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/psychosexual-dramas-nihilistic-fever-dreams.json)
- **Comfort Movies** (`comfort-movies.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/comfort-movies.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/comfort-movies.json)
- **what is reality?** (`what-is-reality.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/what-is-reality.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/what-is-reality.json)
- **Anxiety-Inducing Cinema** (`anxiety-inducing-cinema.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/anxiety-inducing-cinema.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/anxiety-inducing-cinema.json)
- **Definitely there was love, oh but the circumstances** (`definitely-there-was-love-oh-but-the-circumstances.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/definitely-there-was-love-oh-but-the-circumstances.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/definitely-there-was-love-oh-but-the-circumstances.json)
- **The Life of the Mind** (`the-life-of-the-mind.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/the-life-of-the-mind.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/the-life-of-the-mind.json)
- **Sigma movies** (`sigma-movies.json`)
  - [Raw JSON](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/refs/heads/master/public/sigma-movies.json) | [Pages JSON](https://Sternpaul.github.io/letterboxd-lists/public/sigma-movies.json)


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

All list metadata, scrape history, and content modification timestamps are tracked using a dedicated manifest:

- **Manifest File**: `src/scraper/last_scraped.json` tracks two separate ISO dates (`YYYY-MM-DD`) for each list:
  - **`last_scraped`**: The date when the scraper last checked / fetched the list from Letterboxd.
  - **`last_updated`**: The date when the actual *movie content* of the list changed (movies added, removed, or reordered).
- **Automatic Updates**: When `fetch_list.mjs` runs:
  - It always updates `last_scraped` to today's date.
  - If changes to the movie list were detected (`added` or `removed`), it also updates `last_updated` to today's date.
- **Directory Generator**: `update_directory.mjs` reads `last_scraped.json` to generate [lists_directory.md](lists_directory.md), providing full visibility into both sync frequency and content freshness for **Daily Sync 🟢** and **Not actively scraped 📦** lists.

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
- To scrape a community/custom list:
```bash
node fetch_list.mjs ellefnning/list/for-when-you-want-to-feel-something/ ../../public/for-when-you-want-to-feel-something.json
```

### 3. Scrape Worldwide Box Office Chart (The Numbers)
```bash
node fetch_the_numbers.mjs
```
This scrapes the Top 100 All-Time Worldwide Grossing Films from [The Numbers](https://www.the-numbers.com/box-office-records/worldwide/all-movies/cumulative/all-time) and resolves TMDb and IMDb IDs into `public/the-numbers-all-time-worldwide-box-office.json`.

### 4. Update the Lists Directory Table
```bash
node update_directory.mjs
```
This regenerates `lists_directory.md` with updated counts, sync statuses, and last scrape dates.

### 5. Adding a New List to Daily Automation
To schedule a list for automatic daily updates:
1. Open `.github/workflows/update_lists.yml`.
2. Add a new `node fetch_list.mjs ...` line under the **Fetch and filter lists** step.
3. Run `node update_directory.mjs` to promote the list from `Not actively scraped 📦` to `Daily Sync 🟢`.

### 6. Scrape Non-Daily Lists Locally
You can run the batch dispatcher to scrape and update lists that are not in the daily schedule:
```bash
# Scrape all non-daily lists
node scrape_non_daily.mjs

# Scrape a specific category
node scrape_non_daily.mjs --category "Famous Community Lists"

# Filter by keyword or slug substring
node scrape_non_daily.mjs --filter "reality"

# Preview which lists will be scraped without making network requests
node scrape_non_daily.mjs --dry-run --category "By Decade"
```

## Manual On-Demand Scraping Workflow (Owner Only) 🚀

This repository includes a dedicated manual GitHub Actions workflow (`.github/workflows/manual_scrape.yml`) that allows the repository owner to trigger a full or filtered update of all lists that are **not** scraped daily.

### Security & Access Control 🔒
- **Owner-Gated**: Execution is strictly restricted to the repository owner (`${{ github.repository_owner }}`).
- If any other user or fork attempts to run the action, the workflow immediately halts and exits with an unauthorized error.

### How to Trigger the Manual Update:
1. Go to the **Actions** tab in this GitHub repository.
2. Under **Workflows** in the left sidebar, click on **Manual Scrape Non-Daily Lists**.
3. Click the **Run workflow** dropdown on the right.
4. (Optional) Customize the execution parameters:
   - **Category**: Select a specific category (e.g. `Famous Community Lists`, `Core Lists`, `By Genre & Style`, `By Country & Region`, etc.) or leave as `All`.
   - **Optional Filter**: Type a list name, keyword, or JSON filename to only scrape matching lists (or leave blank to scrape everything in the selected category).
5. Click **Run workflow**.

Upon completion:
- All target JSON files in `public/` are refreshed.
- `src/scraper/last_scraped.json` timestamps are updated.
- `lists_directory.md` is automatically regenerated.
- GitHub Pages is redeployed.
- A summary embed is dispatched to your configured Discord Webhook.

## Scraper Network Architecture & Caching Engine 🛡️

To ensure maximum reliability and speed when running both in GitHub Actions and locally, the scraping pipeline incorporates a resilient network architecture and two-tier caching mechanism:

### 1. Dual-Stack IPv4 Enforcement
Node.js 18+ and 20+ enable Happy Eyeballs dual-stack address selection (`autoSelectFamily: true`) by default. In hosted cloud runner environments like GitHub Actions (Ubuntu), IPv6 routing or Cloudflare IPv6 ingress can intermittently hang or drop TCP SYN packets, resulting in `AggregateError [ETIMEDOUT]`.
- All requests in `utils.mjs` utilize customized `https.Agent` and `http.Agent` instances with `family: 4` and `keepAlive: true`.
- This ensures fast, direct IPv4 socket connections to Letterboxd and Cloudflare, bypassing IPv6 black holes.

### 2. Request Timeouts & Exponential Backoff Retries
- All HTTP requests enforce an explicit **20-second timeout** (`timeout: 20000`) rather than the default infinite wait (`0`).
- The `fetchWithRetry()` helper automatically retries transient errors (`ETIMEDOUT`, `ECONNRESET`, `ECONNREFUSED`, `ENOTFOUND`, `EAI_AGAIN`, HTTP 429, and HTTP 5xx) up to 4 times.
- Retries apply exponential backoff with random jitter to prevent thundering herds, and dynamically honor `Retry-After` headers during rate limiting.

### 3. Two-Tier Metadata Caching with Smart Refresh & Zero-Drop Guarantee (`movie_cache.json`)
Letterboxd list pages only contain film titles and URL slugs—TMDb and IMDb IDs reside on individual movie detail pages. Previously, scraping 65 lists daily generated **over 10,000 requests**, easily triggering Cloudflare's bot mitigation.
- **List-Level Cache**: When `fetch_list.mjs` scrapes a list, it first inspects the existing target JSON file in `public/`. If a movie's metadata (TMDb/IMDb ID and year) already exists and is fresh, it is reused instantly without contacting Letterboxd.
- **Global Shared Cache (`src/scraper/movie_cache.json`)**: A centralized cache file tracks over 14,200 unique films across all Letterboxd lists. If a movie appears across multiple lists (e.g. *The Godfather* or *Parasite*), it is resolved from cache in under 1 millisecond.
- **Smart Stale Detection & Title Updates**:
  - **New Movies**: Slugs not yet in the cache are always fetched from Letterboxd.
  - **Missing TMDb IDs**: If a film previously had `id: 0` (no TMDb ID assigned yet), it is automatically re-checked to pick up newly added TMDb IDs.
  - **Tentative Titles**: Movies with tentative titles containing `"Untitled"`, `"Project"`, or `"TBA"` are automatically re-checked to pick up official title changes (e.g. when an untitled sequel receives its official name).
  - **Upcoming & Current Year Films**: All films released in the current year or in the future carry a 3-day TTL and are periodically re-verified against Letterboxd for title or release date revisions.
  - **Catalog Films**: Classic released films with confirmed TMDb IDs are permanently cached to avoid redundant network traffic.
- **Multi-Layout HTML Parser**: The scraper supports all Letterboxd list formats seamlessly—including standard lists (`ul.poster-list`, `li.posteritem`), user watchlists (`.poster-grid`, `ul.grid`, `li.griditem`), and custom grids, while strictly excluding sidebar preview widgets and similar list recommendations.
- **Zero-Drop Guarantee**: The final JSON list is assembled directly from the live Letterboxd list slugs. Even in the rare event of a network error or 404 on an individual film, the scraper generates a clean fallback record (`id: 0`) rather than dropping the movie. The output JSON length is strictly guaranteed to match the Letterboxd list length.
- **Testing**: Run `npm test` inside `src/scraper/` to execute the automated cache safety, zero-omission, and watchlist HTML parsing test suite (`test_cache_safety.mjs`).
- **Result**: Daily request volume dropped from **~10,000+** down to **~70 requests**, reducing daily GitHub Actions runtime from ~25 minutes to ~1.5 minutes while remaining 100% resilient to renames, ID additions, layout differences, and new entries.




