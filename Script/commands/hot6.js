module.exports.config = {
  name: "hot6",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "MR JUWEL",
  description: "Safe Romantic Video Sender",
  commandCategory: "romantic",
  usages: "hot2",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const fs = global.nodemodule["fs-extra"];
  const request = global.nodemodule["request"];

  // Safe Romantic Videos
  const videoLinks = [
    "https://cdn.coverr.co/videos/coverr-a-loving-couple-9695/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-couple-walking-near-the-lake-7523/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-couple-sitting-in-the-park-9878/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-holding-hands-on-a-date-3101/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-sunset-love-4381/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-romantic-beach-walk-4842/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-sweet-moments-5843/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-romantic-candlelight-dinner-7044/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-lovers-in-the-rain-8281/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-aesthetic-romantic-look-5012/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-hug-of-love-6051/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-smiling-couple-8829/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-couple-sitting-on-the-beach-9003/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-coffee-date-1123/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-romantic-evening-6719/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-romantic-night-walk-8091/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-love-in-the-city-5017/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-slow-romantic-aesthetic-9213/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-sunset-happiness-7799/1080p.mp4",
    "https://cdn.coverr.co/videos/coverr-romantic-roadtrip-4983/1080p.mp4"
  ];

  const path = __dirname + "/cache/romantic.mp4";
  const randomLink = videoLinks[Math.floor(Math.random() * videoLinks.length)];

  request(randomLink)
    .pipe(fs.createWriteStream(path))
    .on("close", () => {
      api.sendMessage(
        {
          body: "💞 Safe Romantic Video From — 𝗠𝗥 𝗝𝗨𝗪𝗘𝗟 💫",
          attachment: fs.createReadStream(path)
        },
        event.threadID,
        () => fs.unlinkSync(path)
      );
    });
};
