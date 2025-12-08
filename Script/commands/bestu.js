const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "bestu",
    version: "7.3.1",
    hasPermission: 0,
    credits: "Priyansh Rajput",
    description: "Pair Image Generator",
    commandCategory: "image",
    usages: "bestu @mention",
    cooldowns: 5
  },

  // =======================
  //    ON LOAD (RESOURCES)
  // =======================
  onLoad: async function () {
    const cacheDir = path.join(__dirname, "cache", "canvas");
    const bgPath = path.join(cacheDir, "bestu.png");

    if (!fs.existsSync(cacheDir)) fs.mkdirpSync(cacheDir);

    // Background file download
    if (!fs.existsSync(bgPath)) {
      const img = (await axios.get("https://i.imgur.com/RloX16v.jpg", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(bgPath, img);
    }
  },

  // =======================
  // MAIN FUNCTION
  // =======================
  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID, mentions } = event;
    const mention = Object.keys(mentions);

    if (mention.length === 0)
      return api.sendMessage("যাকে Pair করতে চান তাকে Mention করুন 😅", threadID, messageID);

    const uid1 = senderID;
    const uid2 = mention[0];

    const imagePath = await this.makeImage(uid1, uid2);

    return api.sendMessage({
      body: "✧•❁ 𝗙𝗿𝗶𝗲𝗻𝗱𝘀𝗵𝗶𝗽 ❁•✧\n\n╔══❖••°°••❖══╗\n  𝗣𝗮𝗶𝗿𝗶𝗻𝗴 𝗦𝘂𝗰𝗰𝗲𝘀𝘀 ❤️\n╚══❖••°°••❖══╝",
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => fs.unlinkSync(imagePath), messageID);
  },

  // =======================
  // IMAGE MAKER FUNCTION
  // =======================
  makeImage: async function (one, two) {
    const cache = path.join(__dirname, "cache", "canvas");
    const bg = await jimp.read(path.join(cache, "bestu.png"));

    const avatar1 = path.join(cache, `avt_${one}.png`);
    const avatar2 = path.join(cache, `avt_${two}.png`);
    const output = path.join(cache, `pair_${one}_${two}.png`);

    // Fetch Avatar
    const av1 = (await axios.get(
      `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(avatar1, av1);

    const av2 = (await axios.get(
      `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )).data;
    fs.writeFileSync(avatar2, av2);

    // Make circle avatars
    const circ1 = await this.circle(avatar1);
    const circ2 = await this.circle(avatar2);

    // Composite on background
    bg.composite(circ1.resize(191, 191), 93, 111);
    bg.composite(circ2.resize(190, 190), 434, 107);

    // Save final
    await bg.writeAsync(output);

    // Clean temp avatars
    fs.unlinkSync(avatar1);
    fs.unlinkSync(avatar2);

    return output;
  },

  // =======================
  // CIRCLE Helper
  // =======================
  circle: async function (img) {
    const image = await jimp.read(img);
    image.circle();
    return image;
  }
};
