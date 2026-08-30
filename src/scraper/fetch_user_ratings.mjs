import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMovieDetail, fetchWithRetry } from './utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lastScrapedPath = path.join(__dirname, 'last_scraped.json');

const username = process.argv[2];
const outputFile = process.argv[3];
const concurrency = parseInt(process.argv[4] || '10', 10);

if (!username || !outputFile) {
    console.error('Usage: node fetch_user_ratings.mjs <username> <outputFile> [concurrency]');
    process.exit(1);
}

const limit = pLimit(concurrency);

async function main() {
    console.log(`Starting to fetch RSS feed for: ${username}`);
    
    // Load existing data
    let existingData = [];
    if (fs.existsSync(outputFile)) {
        try {
            const raw = fs.readFileSync(outputFile, 'utf-8');
            existingData = JSON.parse(raw);
        } catch (e) {
            console.error('Error reading existing JSON, starting fresh.', e.message);
        }
    }
    
    const existingMap = new Map();
    existingData.forEach(item => {
        const slug = item.clean_title.replace(/^\/film\//, '').replace(/\/$/, '');
        existingMap.set(slug, item);
    });

    const url = `https://letterboxd.com/${username}/rss/`;
    let rssData;
    try {
        const response = await fetchWithRetry(url, {}, 4);
        rssData = response.data;
    } catch (err) {
        console.error('Failed to fetch RSS feed:', err.message);
        process.exit(1);
    }

    const $ = cheerio.load(rssData, { xmlMode: true });
    const itemsToProcess = [];

    $('item').each((_, el) => {
        const ratingStr = $(el).find('letterboxd\\:memberRating').text();
        const link = $(el).find('link').text();
        
        if (ratingStr && link) {
            const match = link.match(/\/film\/([^\/]+)\//);
            if (match && match[1]) {
                const slug = match[1];
                const rating = parseFloat(ratingStr);
                
                const existing = existingMap.get(slug);
                if (!existing) {
                    itemsToProcess.push({ slug, rating, isNew: true });
                } else if (existing.rating !== rating) {
                    // Update rating in place
                    existing.rating = rating;
                    console.log(`Updated rating for ${slug}: ${rating}`);
                }
            }
        }
    });

    console.log(`Found ${itemsToProcess.length} new movies to fetch details for.`);

    const movies = await Promise.all(
        itemsToProcess.map(item => limit(async () => {
            const detail = await getMovieDetail(`film/${item.slug}/`);
            await new Promise(r => setTimeout(r, 200)); // Rate limit pause
            if (detail) {
                return { ...detail, rating: item.rating };
            }
            return null;
        }))
    );

    const validMovies = movies.filter(m => m !== null);
    
    validMovies.forEach(movie => {
        let tmdbId = movie.tmdb ? parseInt(movie.tmdb, 10) : null;
        if (!tmdbId || isNaN(tmdbId)) tmdbId = 0;
        
        const payload = {
            title: movie.name,
            clean_title: movie.slug.startsWith('/') ? movie.slug : `/${movie.slug}`,
            rating: movie.rating,
            id: tmdbId,
            imdb_id: movie.imdb || ""
        };
        existingMap.set(movie.slug.replace(/^film\//, '').replace(/\/$/, ''), payload);
    });

    // Rebuild final array
    const finalData = Array.from(existingMap.values());
    
    const outDir = path.dirname(outputFile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2));
    console.log(`Successfully wrote ${finalData.length} total records to ${outputFile}`);

    // --- UPDATE LAST SCRAPED & UPDATED MANIFEST ---
    try {
        const jsonBasename = path.basename(outputFile);
        const today = new Date().toISOString().split('T')[0];
        let manifest = {};
        if (fs.existsSync(lastScrapedPath)) {
            manifest = JSON.parse(fs.readFileSync(lastScrapedPath, 'utf8'));
        }
        const hasChanges = (itemsToProcess.length > 0);
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
