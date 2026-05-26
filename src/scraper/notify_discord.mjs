import axios from 'axios';
import fs from 'fs';
import path from 'path';

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

if (!webhookUrl) {
    console.log("No Discord webhook URL provided in environment (DISCORD_WEBHOOK_URL). Skipping notification.");
    process.exit(0);
}

const summaryPath = path.join(process.cwd(), 'summary.json');
if (!fs.existsSync(summaryPath)) {
    console.log("No summary.json found. Skipping notification.");
    process.exit(0);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

const embeds = [];
let totalAdded = 0;
let totalRemoved = 0;

for (const [list, data] of Object.entries(summary)) {
    if (data.added.length > 0 || data.removed.length > 0) {
        totalAdded += data.added.length;
        totalRemoved += data.removed.length;
        
        let val = '';
        if (data.added.length > 0) val += `**🟢 Added:**\n• ${data.added.join('\n• ')}\n\n`;
        if (data.removed.length > 0) val += `**🔴 Removed:**\n• ${data.removed.join('\n• ')}\n`;
        
        // Discord embeds limit description fields to 4096.
        if (val.length > 4000) val = val.substring(0, 3995) + '...';
        
        const listName = list.replace(/\/$/, '').split('/').pop().replace(/-/g, ' ').toUpperCase();

        embeds.push({
            title: `📋 ${listName}`,
            url: `https://letterboxd.com/${list}`,
            description: val,
            color: data.added.length > 0 ? 5763719 : 15548997, // Green if added, Red if only removed
            footer: { text: `Total movies now in list: ${data.total}` }
        });
    }
}

const payload = {
    username: "Letterboxd Radarr Tracker",
    avatar_url: "https://a.ltrbxd.com/logos/letterboxd-mac-icon.png",
    content: "",
    embeds: embeds.slice(0, 10) // Discord limits to 10 embeds per message
};

if (totalAdded === 0 && totalRemoved === 0) {
    payload.content = "**✅ Daily List Update Successful**\nAll lists were successfully fetched and checked, but no changes were detected today.";
    
    let statusList = "";
    for (const [list, data] of Object.entries(summary)) {
        const listName = list.replace(/\/$/, '').split('/').pop().replace(/-/g, ' ').toUpperCase();
        statusList += `• **${listName}**: ${data.total} movies\n`;
    }

    payload.embeds.push({
        title: "📊 Status Overview",
        description: statusList,
        color: 3066993 // Green success color
    });
} else {
    payload.content = `**🎬 Daily List Update Overview**\n**${totalAdded}** movies added, **${totalRemoved}** movies removed across your tracked lists.`;
}

axios.post(webhookUrl, payload)
    .then(() => {
        console.log("Successfully sent Discord webhook report!");
        // Clean up the summary text
        fs.unlinkSync(summaryPath);
    })
    .catch(err => {
        console.error("Error sending webhook:", err.response?.data || err.message);
    });
