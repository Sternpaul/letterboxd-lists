import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const movieCachePath = path.join(__dirname, 'movie_cache.json');

const LETTERBOXD_ORIGIN = 'https://letterboxd.com/';
const IMDB_REGEX = /imdb\.com\/title\/(.*?)(\/|$)/i;
const TMDB_REGEX = /themoviedb\.org\/movie\/(.*?)(\/|$)/;
const NEXT_PAGE_REGEX = /\/page\/(\d+)/;

// Enforce IPv4 (family: 4) to eliminate Node 20 Happy Eyeballs dual-stack
// connection timeouts (AggregateError [ETIMEDOUT]) on GitHub Actions runners.
const httpsAgent = new https.Agent({
    keepAlive: true,
    family: 4,
    timeout: 20000
});

const httpAgent = new http.Agent({
    keepAlive: true,
    family: 4,
    timeout: 20000
});

const DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
};

/**
 * Determines whether a network or HTTP error is transient and retryable.
 */
function isRetryableError(err) {
    if (!err) return false;
    
    // Explicit network error codes
    const retryableCodes = new Set([
        'ETIMEDOUT',
        'ECONNRESET',
        'ECONNREFUSED',
        'ENOTFOUND',
        'EAI_AGAIN',
        'ERR_NETWORK',
        'ERR_BAD_RESPONSE',
        'EPIPE'
    ]);
    if (err.code && retryableCodes.has(err.code)) return true;

    // HTTP status codes (rate limit 429 or server errors 5xx)
    const status = err.response?.status;
    if (status === 429 || (status >= 500 && status <= 599)) return true;

    // Error message / name heuristics
    const msg = (err.message || '').toLowerCase();
    const name = (err.name || '').toLowerCase();
    if (
        name.includes('aggregateerror') ||
        msg.includes('etimedout') ||
        msg.includes('timeout') ||
        msg.includes('socket hang up') ||
        msg.includes('network error')
    ) {
        return true;
    }

    return false;
}

/**
 * Fetch a URL with automatic retries, exponential backoff, IPv4 agent, and timeout.
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    const config = {
        url,
        method: options.method || 'GET',
        httpsAgent,
        httpAgent,
        timeout: options.timeout || 20000,
        headers: {
            ...DEFAULT_HEADERS,
            ...(options.headers || {})
        },
        ...options
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await axios(config);
        } catch (err) {
            const isLast = attempt === maxRetries;
            const retryable = isRetryableError(err);

            if (isLast || !retryable) {
                throw err;
            }

            // Calculate backoff delay with jitter
            let backoffMs = attempt * 2000 + Math.floor(Math.random() * 1000);
            
            // Respect Retry-After header on 429 if present
            if (err.response?.status === 429) {
                const retryAfterHeader = err.response.headers?.['retry-after'];
                const retrySec = parseInt(retryAfterHeader, 10);
                backoffMs = !isNaN(retrySec) && retrySec > 0 ? retrySec * 1000 : 5000 * attempt;
            }

            console.warn(
                `⚠️ [Retry ${attempt}/${maxRetries}] Request to ${url} failed (${err.code || err.message}). Waiting ${backoffMs}ms...`
            );
            await new Promise(resolve => setTimeout(resolve, backoffMs));
        }
    }
}

/**
 * Normalizes movie slug format for unified cache lookups.
 * e.g., "/film/spider-man-brand-new-day/" -> "spider-man-brand-new-day"
 */
export function normalizeSlug(slug) {
    if (!slug) return '';
    return slug
        .replace(/^\/+|\/+$/g, '')
        .replace(/^film\//, '')
        .replace(/\/$/, '')
        .toLowerCase();
}

/**
 * Loads the shared movie cache from disk.
 */
export function loadMovieCache() {
    if (fs.existsSync(movieCachePath)) {
        try {
            return JSON.parse(fs.readFileSync(movieCachePath, 'utf8'));
        } catch (err) {
            console.warn('Could not parse movie_cache.json:', err.message);
        }
    }
    return {};
}

/**
 * Saves the shared movie cache to disk.
 */
export function saveMovieCache(cache) {
    try {
        fs.writeFileSync(movieCachePath, JSON.stringify(cache, null, 2));
    } catch (err) {
        console.warn('Could not save movie_cache.json:', err.message);
    }
}

/**
 * Fetches movie metadata from Letterboxd HTML with retry logic.
 */
export async function getMovieDetail(slug) {
    const cleanSlug = slug.replace(/^\//, '');
    const url = `${LETTERBOXD_ORIGIN}${cleanSlug}`;
    
    try {
        const { data } = await fetchWithRetry(url, {}, 3);
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

export { LETTERBOXD_ORIGIN, NEXT_PAGE_REGEX, DEFAULT_HEADERS };
