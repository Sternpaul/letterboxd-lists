import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import fs from 'fs';
import path from 'path';
import { getMovieDetail } from './utils.mjs';

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
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
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
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
