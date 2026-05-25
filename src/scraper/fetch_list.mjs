import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import fs from 'fs';
import path from 'path';

const LETTERBOXD_ORIGIN = 'https://letterboxd.com/';
const IMDB_REGEX = /imdb\.com\/title\/(.*?)(\/|$)/i;
const TMDB_REGEX = /themoviedb\.org\/movie\/(.*?)(\/|$)/;
const NEXT_PAGE_REGEX = /\/page\/(\d+)/;

const listSlug = process.argv[2];
const outputFile = process.argv[3];

if (!listSlug || !outputFile) {
    console.error('Usage: node fetch_list.mjs <listSlug> <outputFile>');
    process.exit(1);
}

// Ensure slug starts and ends with a slash if needed, but usually it's passed as `official/list/.../`.
// We will just construct `${LETTERBOXD_ORIGIN}${slug.replace(/^\//, '')}`
const cleanListSlug = listSlug.replace(/^\//, '');

async function fetchListPaginated(page) {
    const url = `${LETTERBOXD_ORIGIN}${cleanListSlug}page/${page}/`;
    console.log(`Fetching list page: ${url}`);
    
    // Set a User-Agent to prevent 403s
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const posters = [];

        $('.posteritem > .react-component, [data-component-class*="LazyPoster"], .poster-list [data-poster-url*="film"], .poster-grid [data-poster-url*="film"]').each((_, el) => {
            const slug = $(el).find('[data-target-link]').attr('data-target-link') || $(el).attr('data-target-link');
            // Sometimes it's directly on the `.posteritem` child, so try both.
            // On a standard list page, `.poster-container > div` has `data-film-slug` and `data-target-link`.
            // Let's attempt to replicate exactly:
            let finalSlug = slug;
            if (!finalSlug) {
                // Kanpai query was `[data-target-link]` on the elements matched.
                // Cheerio:
                finalSlug = $(el).find('[data-target-link]').attr('data-target-link');
                if (!finalSlug && $(el).attr('data-target-link')) {
                    finalSlug = $(el).attr('data-target-link');
                }
            }
            if (finalSlug) {
                posters.push(finalSlug);
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
        return { posters: [], nextPage: null };
    }
}

async function getMovieDetail(slug) {
    const url = `${LETTERBOXD_ORIGIN}${slug.replace(/^\//, '')}`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        
        const details = {
            slug: slug,
            name: $('.headline-1').text().trim(),
            published: $("a[href^='/films/year']").text().trim(),
            imdb: null,
            tmdb: null
        };
        
        const imdbHref = $('[data-track-action="imdb" i]').attr('href') || $('[data-track-action="IMDB" i]').attr('href');
        if (imdbHref) {
            const match = imdbHref.match(IMDB_REGEX);
            if (match && match[1]) details.imdb = match[1];
        }

        const tmdbHref = $('[data-track-action="tmdb" i]').attr('href') || $('[data-track-action="TMDB" i]').attr('href');
        if (tmdbHref) {
            const match = tmdbHref.match(TMDB_REGEX);
            if (match && match[1]) details.tmdb = match[1];
        }

        return details;
    } catch (err) {
        console.error(`Error fetching movie details for ${slug}:`, err.message);
        return null;
    }
}

async function main() {
    console.log(`Starting to scrape list: ${cleanListSlug}`);
    const slugs = [];
    let next = 1;
    
    while (next) {
        const result = await fetchListPaginated(next);
        slugs.push(...result.posters);
        next = result.nextPage;
    }
    
    console.log(`Found ${slugs.length} movies. Fetching details...`);
    
    // Increase concurrency slightly? The original had 7. Let's do 7.
    const limit = pLimit(7);
    
    const movies = await Promise.all(
        slugs.map(slug => limit(async () => {
            const detail = await getMovieDetail(slug);
            return detail;
        }))
    );
    
    const validMovies = movies.filter(m => m !== null);
    
    const radarrData = validMovies.map(movie => ({
        id: movie.tmdb ? parseInt(movie.tmdb, 10) : null,
        imdb_id: movie.imdb,
        title: movie.name,
        release_year: movie.published, // sometimes empty
        clean_title: movie.slug,
        adult: false
    }));
    
    const outDir = path.dirname(outputFile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(radarrData, null, 2));
    console.log(`Successfully wrote ${radarrData.length} entries to ${outputFile}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
