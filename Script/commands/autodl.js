const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { alldown } = require("shaon-videos-downloader");

module.exports = {
  config: {
    name: "autodl",
    version: "1.1.0",
    hasPermission: 0,
    credits: "SHAON + Upgrade By ChatGPT",
    description: "Auto Video Downloader with Stats & Typing",
    commandCategory: "auto",
    usages: "Send video link",
    cooldowns: 3,
  },

  run: async function () {},

  handleEvent: async function ({ api, event }) {
    try {
      if (!event.body) return;
      const content = event.body.toLowerCase();
      if (!content.startsWith("http")) return;

      // ✅ Supported sites
      const supportedSites = {
        "tiktok.com": "TikTok",
        "facebook.com": "Facebook",
        "fb.watch": "Facebook",
        "instagram.com": "Instagram",
        "youtube.com": "YouTube",
        "youtu.be": "YouTube",
        "capcut.com": "CapCut",
      };

      let siteName = null;
      for (const site in supportedSites) {
        if (content.includes(site)) {
          siteName = supportedSites[site];
          break;
        }
      }

      if (!siteName) {
        return api.sendMessage(
          "❌ এই লিঙ্কটি সাপোর্ট করে না!",
          event.threadID,
          event.messageID
        );
      }

      api.setMessageReaction("⚡", event.messageID, () => {}, true);
      api.sendTypingIndicator(event.threadID, true);

      const data = await alldown(event.body);
      if (!data || !data.url) {
        api.sendTypingIndicator(event.threadID, false);
        return api.sendMessage(
          "❌ ভিডিও ডাউনলোড করা সম্ভব হয়নি!",
          event.threadID
        );
      }

      // ✅ Stats (safe)
      const like = data.like || data.likes || "N/A";
      const comment = data.comment || data.comments || "N/A";
      const share = data.share || data.shares || "N/A";
      const title = data.title || "Unknown";

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const filePath = path.join(
        __dirname,
        "cache",
        `auto_${event.senderID}.mp4`
      );

      const video = (
        await axios.get(data.url, { responseType: "arraybuffer" })
      ).data;

      fs.writeFileSync(filePath, video);
      api.sendTypingIndicator(event.threadID, false);

      api.sendMessage(
        {
          body: `┏━━━━ 🎬 VIDEO INFO ━━━━┓
📌 Title: ${title}

👍 Likes: ${like}
💬 Comments: ${comment}
🔁 Shares: ${share}

🌐 Site: ${siteName}
✅ Auto Download Complete
┗━━━━━━━━━━━━━━━━━━━━┛
⎯꯭𓆩꯭𝆺𝅥😻⃞𝐌⃞𝆠፝֟𝐑᭄ღ倫 𝐉⃞𝐔⃞𝐖⃞𝐄⃞𝐋༢࿐
😘 Enjoy The Video 🎬`,
          attachment: fs.createReadStream(filePath),
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (err) {
      console.error(err);
      api.sendTypingIndicator(event.threadID, false);
      api.sendMessage(
        "⚠️ কিছু সমস্যা হয়েছে! আবার চেষ্টা করুন।",
        event.threadID
      );
    }
  },
};
