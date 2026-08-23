import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMovieDetail } from './utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lastScrapedPath = path.join(__dirname, 'last_scraped.json');
const defaultOutput = path.resolve(__dirname, '../../public/the-numbers-all-time-worldwide-box-office.json');
const outputFile = process.argv[2] || defaultOutput;

function normalizeTitle(rawTitle, rawHref) {
    let title = rawTitle;
    if (rawHref) {
        const match = rawHref.match(/\/movie\/(.*?)(?:-\((\d{4})\))?$/);
        if (match) {
            title = match[1]
                .replace(/\(Live-Action\)/gi, '')
                .replace(/\(.*?\)/g, '')
                .replace(/-/g, ' ');
        }
    }

    // Remove Chinese characters or extra brackets
    title = title.replace(/\(.*?\)/g, '').replace(/[\u4e00-\u9fa5]+/g, '');

    // Trailing 'The' / 'A' / 'An'
    if (title.endsWith(' The')) {
        title = 'The ' + title.slice(0, -4);
    } else if (title.endsWith(' A')) {
        title = 'A ' + title.slice(0, -2);
    } else if (title.endsWith(' An')) {
        title = 'An ' + title.slice(0, -3);
    }

    // Star Wars Ep. VII / Ep VII / Episode VII
    title = title.replace(/Star Wars:?\s*(?:Ep\.?|Episode)\s*([IVXLCDM]+):?\s*/i, 'Star Wars: ');
    
    return title.trim();
}

function getCandidateSlugs(rawTitle, rawHref, year) {
    const normalized = normalizeTitle(rawTitle, rawHref);
    
    const toSlug = (str) => str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const toSlugNoAnd = (str) => str
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/&/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const candidates = new Set();

    // Specific custom overrides for edge cases
    if (rawTitle.includes('Deadpool') && rawTitle.includes('Wolverine')) {
        candidates.add('deadpool-wolverine-2024');
        candidates.add('deadpool-wolverine');
    }
    if (rawTitle.includes('Lilo') && rawTitle.includes('Stitch')) {
        candidates.add('lilo-stitch-2025');
        candidates.add('lilo-and-stitch-2025');
    }
    if (rawTitle.includes('Ne Zha') || rawHref.includes('Ne-Zha-2')) {
        candidates.add('ne-zha-2');
        candidates.add('ne-zha-2-2025');
    }
    if (rawTitle.includes('Minecraft')) {
        candidates.add('a-minecraft-movie');
        candidates.add('a-minecraft-movie-2025');
    }
    if (rawTitle.includes('Lion King') && year === '2019') {
        candidates.add('the-lion-king-2019');
    }
    if (rawTitle.includes('Beauty and the Beast') && year === '2017') {
        candidates.add('beauty-and-the-beast-2017');
    }
    if (rawTitle.includes('Aladdin') && year === '2019') {
        candidates.add('aladdin-2019');
    }
    if (rawTitle.includes('The Jungle Book') && year === '2016') {
        candidates.add('the-jungle-book-2016');
    }
    if (rawTitle.includes('Alice in Wonderland') && year === '2010') {
        candidates.add('alice-in-wonderland-2010');
    }
    if (rawTitle.includes('The Avengers') && year === '2012') {
        candidates.add('the-avengers-2012');
    }
    if (rawTitle.includes('Jurassic Park') && year === '1993') {
        candidates.add('jurassic-park');
    }
    if (rawTitle.includes('Spectre') && year === '2015') {
        candidates.add('spectre-2015');
    }
    if (rawTitle.includes('Frozen') && year === '2013') {
        candidates.add('frozen-2013');
    }

    // Episode numbers for Star Wars
    if (rawTitle.includes('Star Wars')) {
        if (rawTitle.includes('Phantom Menace') || rawHref.includes('Phantom-Menace')) candidates.add('star-wars-episode-i-the-phantom-menace');
        if (rawTitle.includes('Attack of the Clones') || rawHref.includes('Attack-of-the-Clones')) candidates.add('star-wars-episode-ii-attack-of-the-clones');
        if (rawTitle.includes('Revenge of the Sith') || rawHref.includes('Revenge-of-the-Sith')) candidates.add('star-wars-episode-iii-revenge-of-the-sith');
        if (rawTitle.includes('Force Awakens') || rawHref.includes('Force-Awakens')) candidates.add('star-wars-the-force-awakens');
        if (rawTitle.includes('Last Jedi') || rawHref.includes('Last-Jedi')) candidates.add('star-wars-the-last-jedi');
        if (rawTitle.includes('Rise of Skywalker') || rawHref.includes('Rise-of-Skywalker')) candidates.add('star-wars-the-rise-of-skywalker');
    }

    // Roman numerals to Arabic (e.g. II -> 2, III -> 3)
    const arabic = normalized.replace(/\bII\b/g, '2').replace(/\bIII\b/g, '3').replace(/\bIV\b/g, '4');
    if (year) {
        candidates.add(`${toSlug(arabic)}-${year}`);
        candidates.add(`${toSlug(normalized)}-${year}`);
        candidates.add(`${toSlugNoAnd(normalized)}-${year}`);
    }
    candidates.add(toSlug(arabic));
    candidates.add(toSlug(normalized));
    candidates.add(toSlugNoAnd(normalized));

    // Prefix variations for 'The ' / 'A '
    if (normalized.startsWith('The ')) {
        const noThe = normalized.slice(4);
        if (year) candidates.add(`${toSlug(noThe)}-${year}`);
        candidates.add(toSlug(noThe));
    } else if (normalized.startsWith('A ')) {
        const noA = normalized.slice(2);
        if (year) candidates.add(`${toSlug(noA)}-${year}`);
        candidates.add(toSlug(noA));
    }

    // Clean title from text if different
    const textSlug = toSlug(rawTitle.replace(/\(.*?\)/g, ''));
    if (year) {
        candidates.add(`${textSlug}-${year}`);
    }
    candidates.add(textSlug);
    candidates.add(toSlugNoAnd(rawTitle.replace(/\(.*?\)/g, '')));

    return Array.from(candidates).filter(Boolean);
}

async function scrapeTheNumbers() {
    const url = 'https://www.the-numbers.com/box-office-records/worldwide/all-movies/cumulative/all-time';
    console.log(`Fetching The Numbers box office chart: ${url}`);
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    };

    const { data } = await axios.get(url, { headers });
    const $ = cheerio.load(data);
    const rawMovies = [];

    $('table tr').slice(1).each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 5) {
            const rank = $(cells[0]).text().trim();
            const a = $(cells[1]).find('a');
            const href = a.attr('href') || '';
            const textTitle = $(cells[1]).text().trim();
            const match = href.match(/\/movie\/(.*?)(?:-\((\d{4})\))?$/);
            let linkTitle = match ? match[1].replace(/-/g, ' ') : textTitle;
            const year = match && match[2] ? match[2] : '';
            linkTitle = linkTitle.replace(/#.*$/, '').trim();

            rawMovies.push({
                rank: parseInt(rank, 10),
                title: textTitle.endsWith('…') ? linkTitle : textTitle,
                year,
                rawHref: href
            });
        }
    });

    console.log(`Extracted ${rawMovies.length} movies from The Numbers. Resolving TMDb/IMDb IDs...`);

    const radarrData = [];
    for (const m of rawMovies) {
        const candidates = getCandidateSlugs(m.title, m.rawHref, m.year);
        let detail = null;
        for (const slug of candidates) {
            const res = await getMovieDetail(`film/${slug}/`);
            if (res) {
                // If year is known, verify that the found movie is from that year or +/- 1 year
                if (m.year && res.published) {
                    const diff = Math.abs(parseInt(res.published, 10) - parseInt(m.year, 10));
                    if (diff <= 1) {
                        detail = res;
                        break;
                    }
                } else {
                    detail = res;
                    break;
                }
            }
            await new Promise(r => setTimeout(r, 80));
        }

        // If strict year match didn't find anything, try first match
        if (!detail) {
            for (const slug of candidates) {
                const res = await getMovieDetail(`film/${slug}/`);
                if (res) {
                    detail = res;
                    break;
                }
            }
        }

        if (detail) {
            radarrData.push({
                title: detail.name || m.title,
                release_year: detail.published || m.year,
                clean_title: detail.slug,
                adult: false,
                id: detail.tmdb ? parseInt(detail.tmdb, 10) : 0,
                ...(detail.imdb ? { imdb_id: detail.imdb } : {})
            });
        } else {
            console.warn(`Could not resolve movie detail for: ${m.title} (${m.year})`);
            const fallbackSlug = candidates[0] || m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            radarrData.push({
                title: m.title,
                release_year: m.year,
                clean_title: `/film/${fallbackSlug}/`,
                adult: false,
                id: 0
            });
        }
        await new Promise(r => setTimeout(r, 200));
    }

    const outDir = path.dirname(outputFile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(radarrData, null, 2));
    console.log(`Successfully wrote ${radarrData.length} records to ${outputFile}`);

    // Update manifest
    try {
        const jsonBasename = path.basename(outputFile);
        const today = new Date().toISOString().split('T')[0];
        let manifest = {};
        if (fs.existsSync(lastScrapedPath)) {
            manifest = JSON.parse(fs.readFileSync(lastScrapedPath, 'utf8'));
        }
        manifest[jsonBasename] = {
            last_scraped: today,
            last_updated: today
        };
        fs.writeFileSync(lastScrapedPath, JSON.stringify(manifest, null, 2));
    } catch (e) {
        console.warn('Could not update last_scraped.json:', e.message);
    }
}

scrapeTheNumbers().catch(err => {
    console.error('Scraping The Numbers failed:', err);
    process.exit(1);
});
