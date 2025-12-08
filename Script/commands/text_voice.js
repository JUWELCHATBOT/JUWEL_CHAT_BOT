const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "text_voice",
  version: "1.0.0",
  author: "MOHAMMAD AKASH",
  countDown: 5,
  role: 0,
  shortDescription: "নির্দিষ্ট টেক্সটে ভয়েস রিপ্লাই 😍",
  longDescription: "তুমি যদি নির্দিষ্ট কিছু টেক্সট পাঠাও, তাহলে কিউট মেয়ের ভয়েস প্লে করবে 😍",
  category: "noprefix"
};

// ============  MAIN FUNCTION (onChat)  ============

module.exports.onChat = async function ({ event, message }) {
  const { body } = event;
  if (!body) return;

  const textAudioMap = {
    "i love you": "https://files.catbox.moe/npy7kl.mp3",
    "mata beta": "https://files.catbox.moe/5rdtc6.mp3",
  };

  const key = body.trim().toLowerCase();
  const audioUrl = textAudioMap[key];
  if (!audioUrl) return;

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const filePath = path.join(cacheDir, `${encodeURIComponent(key)}.mp3`);

  try {
    const res = await axios({
      method: "GET",
      url: audioUrl,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    res.data.pipe(writer);

    writer.on("finish", async () => {
      await message.reply({
        attachment: fs.createReadStream(filePath),
      });

      fs.unlink(filePath, () => {});
    });

    writer.on("error", () => {
      message.reply("ভয়েস প্লে করতে সমস্যা হয়েছে 😅");
    });

  } catch (err) {
    console.log(err);
    message.reply("অডিও ডাউনলোড করতে সমস্যা হয়েছে 😅");
  }
};

// এটি ফাঁকা রাখতে পারো
module.exports.onStart = async function () {};
