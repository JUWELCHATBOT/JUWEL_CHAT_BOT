const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "bestie",
    version: "7.3.1",
    author: "Priyansh Rajput",
    countDown: 5,
    role: 0,
    description: {
      en: "Make bestie pairing picture with mention"
    },
    category: "fun",
    guide: {
      en: "{pn} @mention"
    }
  },

  // ====== ON LOAD ======
  onLoad: async () => {
    const dirMaterial = path.join(__dirname, "cache", "canvas");
    const imgPath = path.join(dirMaterial, "bestie.png");

    if (!fs.existsSync(dirMaterial)) fs.mkdirSync(dirMaterial, { recursive: true });

    if (!fs.existsSync(imgPath)) {
      const imgURL = "https://i.imgur.com/dAxBwKy.jpg";
      const getImg = (await axios.get(imgURL, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(imgPath, Buffer.from(getImg));
    }
  },

  // ====== CIRCLE AVATAR ======
  circle: async (imgPath) => {
    const image = await jimp.read(imgPath);
    image.circle();
    return image.getBufferAsync("image/png");
  },

  // ====== MAKE IMAGE ======
  makeImage: async ({ one, two }) => {
    const dir = path.join(__dirname, "cache", "canvas");
    const template = await jimp.read(path.join(dir, "bestie.png"));

    const avatarOne = path.join(dir, `avt_${one}.png`);
    const avatarTwo = path.join(dir, `avt_${two}.png`);
    const finalPath = path.join(dir, `bestie_${one}_${two}.png`);

    // Download avatar 1
    let a1 = (
      await axios.get(
        `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(avatarOne, Buffer.from(a1));

    // Download avatar 2
    let a2 = (
      await axios.get(
        `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        { responseType: "arraybuffer" }
      )
    ).data;
    fs.writeFileSync(avatarTwo, Buffer.from(a2));

    // Circle convert
    const c1 = await jimp.read(await module.exports.circle(avatarOne));
    const c2 = await jimp.read(await module.exports.circle(avatarTwo));

    // Paste on template
    template
      .composite(c1.resize(191, 191), 93, 111)
      .composite(c2.resize(190, 190), 434, 107);

    fs.writeFileSync(finalPath, await template.getBufferAsync("image/png"));

    // Cleanup
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return finalPath;
  },

  // ====== RUN COMMAND ======
  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);

    if (!mention[0])
      return message.reply("💢 *একজনকে Mention করো!*");

    const one = event.senderID;
    const two = mention[0];

    const img = await module.exports.makeImage({ one, two });

    return message.reply(
      {
        body:
          "✧•❁ 𝐅𝐫𝐢𝐞𝐧𝐝𝐬𝐡𝐢𝐩 ❁•✧\n\n" +
          "╔═══❖••° °••❖═══╗\n" +
          "   𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐏𝐚𝐢𝐫𝐢𝐧𝐠\n" +
          "╚═══❖••° °••❖═══╝\n\n" +
          "👑 𝐘𝐞 𝐋𝐞 𝐓𝐞𝐫𝐢 𝐁𝐞𝐬𝐭𝐢𝐞 🩷",
        attachment: fs.createReadStream(img)
      },
      () => fs.unlinkSync(img)
    );
  }
};
