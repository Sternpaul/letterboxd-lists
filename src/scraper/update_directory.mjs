import fs from 'fs';
import path from 'path';

const officialListsPath = path.join(process.cwd(), 'official_lists.json');
const ymlFile = path.join(process.cwd(), '../../.github/workflows/update_lists.yml');
const publicDir = path.join(process.cwd(), '../../public');
const readmePath = path.join(process.cwd(), '../../lists_directory.md');

let officialLists = [];
if (fs.existsSync(officialListsPath)) {
    officialLists = JSON.parse(fs.readFileSync(officialListsPath, 'utf8'));
}

let ymlContent = '';
if (fs.existsSync(ymlFile)) {
    ymlContent = fs.readFileSync(ymlFile, 'utf8');
}

const dailyJsonFiles = new Set();
const matches = ymlContent.matchAll(/node fetch_list\.mjs.*? \.\.\/\.\.\/public\/(.*?\.json)/g);
for (const match of matches) {
    dailyJsonFiles.add(match[1]);
}

// Generate the markdown table
let md = "# Official Letterboxd Lists Directory\n\n";
md += "This document tracks all Official Letterboxd Lists and their sync status in this repository. Use this reference to find the exact endpoints for Radarr.\n\n";
md += "*(This directory is automatically updated after every successful GitHub Action run)*\n\n";
md += "| List Name | Status | JSON Endpoint | Total Items | Last Scraped |\n";
md += "| :--- | :--- | :--- | :--- | :--- |\n";

let currentCategory = '';

for (const list of officialLists) {
    if (list.category !== currentCategory) {
        currentCategory = list.category;
        md += `| **${currentCategory}** | | | | |\n`;
    }

    let jsonName = list.jsonName;
    let endpointStr = '';
    let status = 'Not Scraped ❌';
    let totalItems = '-';
    let lastUpdate = '-';
    let isSuccess = false;

    // Check if the file exists in the repo
    if (list.trueSlug === 'tag') {
        // Special case for 'All Lists' tags
        status = 'Directory Link 📁';
        endpointStr = '';
    } else if (jsonName) {
        const filePath = path.join(publicDir, jsonName);
        if (fs.existsSync(filePath)) {
            // It exists! Determine if it's daily or one-time
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                totalItems = data.length.toString();
                isSuccess = true;
                
                const stats = fs.statSync(filePath);
                lastUpdate = stats.mtime.toISOString().split('T')[0];
            } catch (e) {
                totalItems = 'Error';
                status = "Failed 🚨";
            }

            if (dailyJsonFiles.has(jsonName)) {
                status = "Daily Sync 🟢";
            } else if (status !== "Failed 🚨") {
                status = `Not actively scraped 📦`;
            }
            endpointStr = `[RAW](https://raw.githubusercontent.com/Sternpaul/letterboxd-lists/master/public/${jsonName})`;
        }
    }

    // Add extra indicators for failure
    if (status.includes("Daily Sync") && !isSuccess) {
        status = "Failed 🚨";
    }

    md += `| [${list.name}](${list.shortUrl}) | ${status} | ${endpointStr} | ${totalItems} | ${lastUpdate} |\n`;
}

fs.writeFileSync(readmePath, md);
console.log("Successfully generated lists_directory.md");
