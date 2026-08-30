import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    getMovieDetail,
    fetchWithRetry,
    LETTERBOXD_ORIGIN,
    NEXT_PAGE_REGEX,
    normalizeSlug,
    loadMovieCache,
    saveMovieCache,
    isCacheStale
} from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const lastScrapedPath = path.join(__dirname, 'last_scraped.json');

const listSlug = process.argv[2];
const outputFile = process.argv[3];
const limitArg = parseInt(process.argv[4], 10);

if (!listSlug || !outputFile) {
    console.error('Usage: node fetch_list.mjs <listSlug> <outputFile> [limit]');
    process.exit(1);
}

// Ensure slug starts and ends with a slash if needed
const cleanListSlug = listSlug.replace(/^\//, '');

async function fetchListPaginated(page) {
    const url = `${LETTERBOXD_ORIGIN}${cleanListSlug}page/${page}/`;
    console.log(`Fetching list page: ${url}`);

    try {
        const { data } = await fetchWithRetry(url, {}, 4);
        const $ = cheerio.load(data);
        const posters = [];

        // Target the actual list container to prevent picking up 5 thumbnail posters from the "Related/Similar Lists" footer
        const listContainer = $('ul.poster-list, .poster-grid, ul.js-list-entries');
        const items = listContainer.length ? listContainer.find('li.posteritem, .poster-container') : $('.posteritem');

        items.each((_, el) => {
            let finalSlug = $(el).find('[data-target-link]').attr('data-target-link') ||
                            $(el).attr('data-target-link') ||
                            $(el).find('.film-poster').attr('data-target-link') ||
                            $(el).find('[data-film-slug]').attr('data-film-slug');

            if (!finalSlug) {
                finalSlug = $(el).find('a[href^="/film/"]').attr('href');
            }

            if (finalSlug && typeof finalSlug === 'string') {
                const trimmed = finalSlug.trim();
                // Strictly accept only valid film slugs (e.g. /film/knives-out-2019/) and ignore '/' or related list previews
                if (trimmed.startsWith('/film/') && trimmed !== '/film/' && trimmed.length > 6) {
                    posters.push(trimmed);
                }
            }
        });

        const nextLink = $('.paginate-nextprev .next').attr('href');
        let nextPage = null;
        if (nextLink) {
            const match = nextLink.match(NEXT_PAGE_REGEX);
            if (match && match[1]) {
                nextPage = parseInt(match[1], 10);
            }
        }
        
        return { posters, nextPage };
    } catch (err) {
        console.error(`Error fetching list page ${page}:`, err.message);
        throw err;
    }
}

async function main() {
    console.log(`Starting to scrape list: ${cleanListSlug}`);
    const slugs = [];
    let next = 1;
    
    while (next) {
        const result = await fetchListPaginated(next);
        slugs.push(...result.posters);
        
        // If we hit or exceed our limit, we can stop paginating early
        if (!isNaN(limitArg) && limitArg > 0 && slugs.length >= limitArg) {
            break;
        }
        
        next = result.nextPage;
        if (next) {
            // Polite pacing between list page requests
            await new Promise(r => setTimeout(r, 200));
        }
    }
    
    // Trim the list down to exactly the limit before fetching heavy details
    if (!isNaN(limitArg) && limitArg > 0) {
        slugs.splice(limitArg);
    }
    
    // --- LOAD EXISTING DATA & SHARED CACHE ---
    let existingData = [];
    if (fs.existsSync(outputFile)) {
        try {
            existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
        } catch (e) {}
    }
    
    const existingMap = new Map();
    for (const m of existingData) {
        if (m && m.clean_title) {
            existingMap.set(normalizeSlug(m.clean_title), m);
        }
    }

    const movieCache = loadMovieCache();
    let cacheUpdated = false;

    // Identify slugs that are missing from cache or need fresh verification (e.g. new, missing TMDb, tentative name)
    const toFetchSlugs = [];
    for (const slug of slugs) {
        const norm = normalizeSlug(slug);
        const inExisting = existingMap.get(norm);
        const inCache = movieCache[norm];
        const movie = (inExisting || inCache) ? { ...(inExisting || {}), ...(inCache || {}) } : null;

        if (!movie || isCacheStale(movie)) {
            toFetchSlugs.push(slug);
        }
    }

    const cachedCount = slugs.length - toFetchSlugs.length;
    if (toFetchSlugs.length > 0) {
        console.log(`Found ${slugs.length} movies (${cachedCount} cached, ${toFetchSlugs.length} new/refreshed). Fetching details...`);
        const limit = pLimit(3);
        await Promise.all(
            toFetchSlugs.map(slug => limit(async () => {
                const detail = await getMovieDetail(slug);
                await new Promise(r => setTimeout(r, 250)); // Rate limit pause
                if (detail) {
                    const norm = normalizeSlug(slug);
                    const tmdbId = detail.tmdb ? parseInt(detail.tmdb, 10) : 0;
                    const record = {
                        title: detail.name,
                        release_year: detail.published || '',
                        clean_title: slug.startsWith('/') ? slug : `/${slug}`,
                        adult: false,
                        id: tmdbId,
                        imdb_id: detail.imdb || null,
                        cached_at: new Date().toISOString()
                    };
                    movieCache[norm] = record;
                    existingMap.set(norm, record);
                    cacheUpdated = true;
                }
            }))
        );
        
        if (cacheUpdated) {
            saveMovieCache(movieCache);
        }
    } else {
        console.log(`Found ${slugs.length} movies (all ${slugs.length} loaded from cache).`);
    }

    // Build the radarrData array preserving original list order
    // ZERO-DROP GUARANTEE: Every valid film slug from Letterboxd will have an entry in radarrData
    const radarrData = [];
    for (const slug of slugs) {
        if (!slug || typeof slug !== 'string' || !slug.startsWith('/film/') || slug === '/film/') {
            continue;
        }

        const norm = normalizeSlug(slug);
        const movie = existingMap.get(norm) || movieCache[norm];
        if (movie && movie.title) {
            const formattedSlug = movie.clean_title
                ? (movie.clean_title.startsWith('/') ? movie.clean_title : `/${movie.clean_title}`)
                : (slug.startsWith('/') ? slug : `/${slug}`);

            const payload = {
                title: movie.title,
                release_year: movie.release_year || '',
                clean_title: formattedSlug,
                adult: false,
                id: movie.id !== undefined ? (parseInt(movie.id, 10) || 0) : 0
            };
            if (movie.imdb_id) {
                payload.imdb_id = movie.imdb_id;
            }
            radarrData.push(payload);
        } else if (norm && norm.length > 0) {
            // Fallback so no real movie is ever omitted, even if Letterboxd network fails
            const fallbackTitle = norm
                .split('-')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
            radarrData.push({
                title: fallbackTitle,
                release_year: '',
                clean_title: slug.startsWith('/') ? slug : `/${slug}`,
                adult: false,
                id: 0
            });
        }
    }
    
    const outDir = path.dirname(outputFile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    
    // --- DIFF LOGIC FOR DISCORD NOTIFICATION ---
    const existingSlugSet = new Set(existingData.map(m => normalizeSlug(m.clean_title)));
    const newSlugSet = new Set(radarrData.map(m => normalizeSlug(m.clean_title)));

    const added = radarrData.filter(m => !existingSlugSet.has(normalizeSlug(m.clean_title)));
    const removed = existingData.filter(m => !newSlugSet.has(normalizeSlug(m.clean_title)));
    
    const summaryPath = path.join(process.cwd(), 'summary.json');
    let summary = {};
    if (fs.existsSync(summaryPath)) {
        try { summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8')); } catch (e) {}
    }
    summary[cleanListSlug || listSlug] = {
        added: added.map(m => m.title),
        removed: removed.map(m => m.title),
        total: radarrData.length
    };
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    // ---------------------------------------------
    
    fs.writeFileSync(outputFile, JSON.stringify(radarrData, null, 2));
    console.log(`Successfully wrote ${radarrData.length} entries to ${outputFile}`);

    // --- UPDATE LAST SCRAPED & UPDATED MANIFEST ---
    try {
        const jsonBasename = path.basename(outputFile);
        const today = new Date().toISOString().split('T')[0];
        let manifest = {};
        if (fs.existsSync(lastScrapedPath)) {
            manifest = JSON.parse(fs.readFileSync(lastScrapedPath, 'utf8'));
        }
        const hasChanges = (added.length > 0 || removed.length > 0 || !existingData.length);
        let listMeta = manifest[jsonBasename];
        if (!listMeta || typeof listMeta === 'string') {
            listMeta = {
                last_scraped: today,
                last_updated: (typeof listMeta === 'string' ? listMeta : today)
            };
        }
        listMeta.last_scraped = today;
        if (hasChanges) {
            listMeta.last_updated = today;
        }
        manifest[jsonBasename] = listMeta;
        fs.writeFileSync(lastScrapedPath, JSON.stringify(manifest, null, 2));
    } catch (e) {
        console.warn('Could not update last_scraped.json:', e.message);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
