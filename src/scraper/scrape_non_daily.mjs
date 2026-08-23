import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../');
const officialListsPath = path.join(__dirname, 'official_lists.json');
const ymlWorkflowPath = path.join(rootDir, '.github/workflows/update_lists.yml');
const updateDirectoryScript = path.join(__dirname, 'update_directory.mjs');

// Parse CLI arguments
const args = process.argv.slice(2);
let categoryFilter = 'All';
let textFilter = '';
let isDryRun = false;
let delayMs = 500;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--category' && args[i + 1]) {
        categoryFilter = args[++i];
    } else if (args[i] === '--filter' && args[i + 1]) {
        textFilter = args[++i].toLowerCase();
    } else if (args[i] === '--delay' && args[i + 1]) {
        delayMs = parseInt(args[++i], 10) || 500;
    } else if (args[i] === '--dry-run') {
        isDryRun = true;
    }
}

// 1. Identify Daily Sync JSON files from update_lists.yml
const dailyJsonFiles = new Set();
if (fs.existsSync(ymlWorkflowPath)) {
    const ymlContent = fs.readFileSync(ymlWorkflowPath, 'utf8');
    const matches = ymlContent.matchAll(/node fetch_list\.mjs.*? \.\.\/\.\.\/public\/(.*?\.json)/g);
    for (const match of matches) {
        dailyJsonFiles.add(match[1]);
    }
}

// 2. Load all official and community lists
if (!fs.existsSync(officialListsPath)) {
    console.error(`Error: ${officialListsPath} does not exist.`);
    process.exit(1);
}

const officialLists = JSON.parse(fs.readFileSync(officialListsPath, 'utf8'));

// 3. Filter for non-daily lists
const nonDailyLists = officialLists.filter(list => {
    if (!list.jsonName || list.trueSlug === 'tag') return false;
    if (dailyJsonFiles.has(list.jsonName)) return false;
    if (categoryFilter !== 'All' && list.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (textFilter) {
        const matchesName = list.name && list.name.toLowerCase().includes(textFilter);
        const matchesJson = list.jsonName && list.jsonName.toLowerCase().includes(textFilter);
        const matchesSlug = list.trueSlug && list.trueSlug.toLowerCase().includes(textFilter);
        if (!matchesName && !matchesJson && !matchesSlug) return false;
    }
    return true;
});

console.log(`\n======================================================`);
console.log(`📋 Non-Daily Scraper Dispatcher`);
console.log(`======================================================`);
console.log(`Total Official / Community Lists: ${officialLists.length}`);
console.log(`Daily Sync Lists (Excluded):      ${dailyJsonFiles.size}`);
console.log(`Target Category Filter:           ${categoryFilter}`);
if (textFilter) console.log(`Text / Slug Filter:               ${textFilter}`);
console.log(`Non-Daily Lists Selected:         ${nonDailyLists.length}`);
console.log(`Mode:                             ${isDryRun ? 'DRY RUN (No scraping)' : 'EXECUTE SCRAPE'}`);
console.log(`======================================================\n`);

if (nonDailyLists.length === 0) {
    console.log('No matching non-daily lists found.');
    process.exit(0);
}

if (isDryRun) {
    nonDailyLists.forEach((l, idx) => {
        console.log(`${idx + 1}. [${l.category}] ${l.name} -> ${l.jsonName} (${l.trueSlug || l.trueUrl})`);
    });
    console.log('\nDry run completed.');
    process.exit(0);
}

async function runCommand(cmd, cmdArgs) {
    return new Promise((resolve) => {
        const proc = spawn(cmd, cmdArgs, {
            cwd: __dirname,
            stdio: 'inherit'
        });
        proc.on('close', code => {
            if (code === 0) {
                resolve({ success: true });
            } else {
                resolve({ success: false, code });
            }
        });
        proc.on('error', err => {
            resolve({ success: false, error: err.message });
        });
    });
}

async function main() {
    let successCount = 0;
    let failedCount = 0;
    const failedLists = [];

    for (let i = 0; i < nonDailyLists.length; i++) {
        const item = nonDailyLists[i];
        const publicOutPath = path.resolve(rootDir, 'public', item.jsonName);
        console.log(`\n------------------------------------------------------`);
        console.log(`[${i + 1}/${nonDailyLists.length}] Scraping: ${item.name}`);
        console.log(`Category: ${item.category}`);
        console.log(`Output:   public/${item.jsonName}`);
        console.log(`------------------------------------------------------`);

        let result;
        if (item.jsonName === 'the-numbers-all-time-worldwide-box-office.json') {
            result = await runCommand('node', ['fetch_the_numbers.mjs', publicOutPath]);
        } else {
            result = await runCommand('node', ['fetch_list.mjs', item.trueSlug, publicOutPath]);
        }

        if (result.success) {
            successCount++;
        } else {
            failedCount++;
            failedLists.push(item.name);
            console.error(`⚠️ Failed to scrape: ${item.name}`);
        }

        if (delayMs > 0 && i < nonDailyLists.length - 1) {
            await new Promise(r => setTimeout(r, delayMs));
        }
    }

    console.log(`\n======================================================`);
    console.log(`🎉 Batch Scrape Finished!`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed:     ${failedCount}`);
    if (failedLists.length > 0) {
        console.log(`Failed Lists: ${failedLists.join(', ')}`);
    }
    console.log(`======================================================\n`);

    // Regenerate lists_directory.md
    console.log('Regenerating lists_directory.md...');
    await runCommand('node', ['update_directory.mjs']);
}

main().catch(err => {
    console.error('Fatal error running scrape_non_daily:', err);
    process.exit(1);
});
