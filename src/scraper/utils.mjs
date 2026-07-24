import axios from 'axios';
import * as cheerio from 'cheerio';

const LETTERBOXD_ORIGIN = 'https://letterboxd.com/';
const IMDB_REGEX = /imdb\.com\/title\/(.*?)(\/|$)/i;
const TMDB_REGEX = /themoviedb\.org\/movie\/(.*?)(\/|$)/;
const NEXT_PAGE_REGEX = /\/page\/(\d+)/;

export async function getMovieDetail(slug) {
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

export { LETTERBOXD_ORIGIN, NEXT_PAGE_REGEX };
