import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import fs from 'fs';
import path from 'path';
import { getMovieDetail, LETTERBOXD_ORIGIN, NEXT_PAGE_REGEX } from './utils.mjs';

const username = process.argv[2];
const outputFile = process.argv[3];
const concurrency = parseInt(process.argv[4] || '10', 10);

if (!username || !outputFile) {
    console.error('Usage: node fetch_user_ratings.mjs <username> <outputFile> [concurrency]');
    process.exit(1);
}

const limit = pLimit(concurrency);

async function fetchRatingsPage(page) {
    const url = `${LETTERBOXD_ORIGIN}${username}/films/page/${page}/`;
    console.log(`Fetching page: ${url}`);
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    };

    try {
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        const ratings = [];

        $('.griditem').each((_, el) => {
            const targetLink = $(el).find('.react-component').attr('data-target-link') || $(el).find('[data-target-link]').attr('data-target-link');
            const ratingString = $(el).find('.poster-viewingdata .rating').text().trim();
            
            if (targetLink && ratingString) {
                const match = targetLink.match(/\/film\/([^\/]+)\//);
                if (match && match[1]) {
                    const slug = match[1];
                    let numericRating = 0;
                    for (const char of ratingString) {
                        if (char === '★') numericRating += 1;
                        else if (char === '½') numericRating += 0.5;
                    }
                    if (numericRating > 0) {
                        ratings.push({ slug, rating: numericRating });
                    }
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
        
        return { ratings, nextPage };
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return { ratings: [], nextPage: null };
        }
        console.error(`Error fetching page ${page}:`, err.message);
        return { ratings: [], nextPage: null };
    }
}

async function main() {
    console.log(`Starting to fetch ratings for: ${username}`);
    const allRatings = [];
    let next = 1;
    
    while (next) {
        const result = await fetchRatingsPage(next);
        allRatings.push(...result.ratings);
        next = result.nextPage;
        await new Promise(r => setTimeout(r, 500));
    }
    
    console.log(`Found ${allRatings.length} ratings. Fetching details...`);
    
    const movies = await Promise.all(
        allRatings.map(item => limit(async () => {
            const detail = await getMovieDetail(`film/${item.slug}/`);
            await new Promise(r => setTimeout(r, 200)); // Rate limit pause
            if (detail) {
                return { ...detail, sternpaul_rating: item.rating };
            }
            return null;
        }))
    );

    const validMovies = movies.filter(m => m !== null);
    
    const finalData = validMovies.map(movie => {
        const payload = {
            title: movie.name,
            clean_title: movie.slug.startsWith('/') ? movie.slug : `/${movie.slug}`,
            rating: movie.sternpaul_rating
        };
        
        // Match radarr fallback style closely
        let tmdbId = movie.tmdb ? parseInt(movie.tmdb, 10) : null;
        if (!tmdbId || isNaN(tmdbId)) tmdbId = 0;
        
        payload.id = tmdbId;
        payload.imdb_id = movie.imdb || "";
        
        return payload;
    });
    
    const outDir = path.dirname(outputFile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2));
    console.log(`Successfully wrote ${finalData.length} records to ${outputFile}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
