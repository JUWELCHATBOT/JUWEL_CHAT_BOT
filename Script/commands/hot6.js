/** Don't change credits bro i will fix¯\_(ツ)_/¯ **/
module.exports.config = {
  name: "hot6",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "MR JUWEL",
  description: "HOT6 VIDEOS",
  commandCategory: "video",
  usages: "hot6",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) => {
  // ----- Admin check -----
  const threadInfo = await api.getThreadInfo(event.threadID);
  const adminIDs = threadInfo.adminIDs.map(u => u.id);

  if (!adminIDs.includes(event.senderID)) {
    return api.sendMessage("এই কমান্ড শুধু এডমিন ব্যবহার করতে পারবে!", event.threadID, event.messageID);
  }
  // ------------------------

  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  var captions = ["এই নে দেখ 😒🥵"];
  var caption = captions[Math.floor(Math.random() * captions.length)];

  var links = [ 
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

  var callback = () => api.sendMessage(
    { body: `「 ${caption} 」`, attachment: fs.createReadStream(__dirname + "/cache/video.mp4") },
    event.threadID,
    () => fs.unlinkSync(__dirname + "/cache/video.mp4")
  );

  return request(encodeURI(links[Math.floor(Math.random() * links.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/video.mp4"))
    .on("close", () => callback());
};
