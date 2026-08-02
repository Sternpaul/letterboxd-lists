import fs from 'fs';
import axios from 'axios';

const markdownFile = "C:\\Users\\stern\\.gemini\\antigravity-ide\\brain\\da8c6fc3-cba6-450a-93b0-cd7d303b93a4\\official_letterboxd_lists.md";
const lines = fs.readFileSync(markdownFile, 'utf8').split('\n');

const manualOverrides = {
    "Top 100 French Films": "top-100-french-films-top50.json",
    "Top 100 Anime Films": "top-100-anime-films-top50.json",
    "Top 100 British Films": "the-bfi-100-british-films.json"
};

async function resolveUrl(shortUrl) {
    if (shortUrl.includes('/official/tag/')) {
        return shortUrl; 
    }
    try {
        const response = await axios.get(shortUrl, {
            maxRedirects: 0,
            validateStatus: status => status >= 200 && status < 400
        });
        return response.headers.location || shortUrl;
    } catch (e) {
        if (e.response && e.response.headers.location) {
            return e.response.headers.location;
        }
    }
    return shortUrl;
}

async function run() {
    let currentCategory = '';
    const results = [];
    
    // Parse list from Markdown
    const itemsToResolve = [];
    
    for (const line of lines) {
        if (line.startsWith('### ')) {
            currentCategory = line.replace('### ', '').trim();
        } else {
            const match = line.match(/- \[(.*?)\]\((.*?)\)/);
            if (match) {
                itemsToResolve.push({
                    category: currentCategory,
                    name: match[1].trim(),
                    shortUrl: match[2].trim()
                });
            }
        }
    }

    console.log(`Resolving ${itemsToResolve.length} URLs...`);

    // Batch resolve 10 at a time
    for (let i = 0; i < itemsToResolve.length; i += 10) {
        const batch = itemsToResolve.slice(i, i + 10);
        await Promise.all(batch.map(async item => {
            const trueUrl = await resolveUrl(item.shortUrl);
            let trueSlug = '';
            
            if (trueUrl.includes('/list/')) {
                const match = trueUrl.match(/letterboxd\.com\/(.*?\/list\/.*?\/)/);
                if (match) trueSlug = match[1];
            } else if (trueUrl.includes('/official/tag/')) {
                trueSlug = 'tag'; // special case
            }
            
            let defaultJsonName = trueSlug ? trueSlug.split('/').filter(Boolean).pop() + '.json' : '';
            
            // Apply any manual overrides (e.g. for lists that user scraped with a limit like -top50)
            if (manualOverrides[item.name]) {
                defaultJsonName = manualOverrides[item.name];
            }
            
            results.push({
                category: item.category,
                name: item.name,
                shortUrl: item.shortUrl,
                trueUrl,
                trueSlug,
                jsonName: defaultJsonName
            });
        }));
        console.log(`Resolved ${Math.min(i + 10, itemsToResolve.length)} / ${itemsToResolve.length}`);
    }

    fs.writeFileSync('official_lists.json', JSON.stringify(results, null, 2));
    console.log("Wrote official_lists.json");
}

run();
