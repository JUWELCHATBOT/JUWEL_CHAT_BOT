const axios = require("axios");
const fs = require("fs-extra");
const { alldown } = require("shaon-videos-downloader");

module.exports = {
config: {
name: "autodl",
version: "0.1.0",
hasPermission: 0,
credits: "SHAON + Upgrade By ChatGPT",
description: "Auto Video Downloader with Filters & Typing",
commandCategory: "auto",
usages: "",
cooldowns: 3,
},

run: async function () {},

handleEvent: async function ({ api, event }) {
try {
const content = event.body ? event.body.toLowerCase() : "";
if (!content.startsWith("https://")) return;

// ---------- SUPPORTED SITE FILTER ----------  
  const supportedSites = {  
    "tiktok.com": "TikTok",  
    "facebook.com": "Facebook",  
    "fb.watch": "Facebook",  
    "instagram.com": "Instagram",  
    "youtube.com": "YouTube",  
    "youtu.be": "YouTube",  
    "capcut.com": "CapCut",  
  };  

  let siteName = "Unknown";  
  for (const site in supportedSites) {  
    if (content.includes(site)) siteName = supportedSites[site];  
  }  

  if (siteName === "Unknown") {  
    return api.sendMessage("❌ এই লিঙ্ক সাপোর্ট করে না!", event.threadID);  
  }  

  // Reaction  
  api.setMessageReaction("⚡", event.messageID, () => {}, true);  

  // ---------- TYPING INDICATOR ----------  
  api.sendTypingIndicator(event.threadID, true);  

  const data = await alldown(event.body);  
  if (!data || !data.url) {  
    api.sendTypingIndicator(event.threadID, false);  
    return api.sendMessage("❌ ভিডিও ডাউনলোড করা সম্ভব হয়নি!", event.threadID);  
  }  

  api.setMessageReaction("⏳", event.messageID, () => {}, true);  

  // Download video  
  const video = (  
    await axios.get(data.url, { responseType: "arraybuffer" })  
  ).data;  

  const filePath = __dirname + "/cache/auto.mp4";  
  fs.writeFileSync(filePath, video);  

  // Stop typing  
  api.sendTypingIndicator(event.threadID, false);  

  return api.sendMessage(  
    {  
      body: `┏━━━━ 🎬━━━━┓

⎯꯭𓆩꯭𝆺𝅥😻⃞𝐌⃞𝆠፝֟𝐑᭄ღ倫 𝐉⃞𝐔⃞𝐖⃞𝐄⃞𝐋༢࿐
┗━━━━ ⚡ ━━━━━━┛

🎬 আপনার ভিডিও রেডি ✅
📥 Site: ${siteName}
📥 Auto Download Complete ✅
😘 Enjoy The Video 🎬

🔥 Thanks For Using ⎯꯭𓆩꯭𝆺𝅥😻⃞𝐑⃞𝐈⃞𝐘⃞𝐀⃞༢࿐ Bot 🤖`,
attachment: fs.createReadStream(filePath)
},
event.threadID,
() => fs.unlinkSync(filePath),
event.messageID
);

} catch (err) {  
  console.log(err);  
  api.sendTypingIndicator(event.threadID, false);  
  api.sendMessage("⚠️ কিছু সমস্যা হয়েছে! আবার চেষ্টা করুন।", event.threadID);  
}

}
};
