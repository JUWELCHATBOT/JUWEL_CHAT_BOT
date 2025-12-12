const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const crypto = require("crypto");

module.exports.config = {
  name: "emoji_voice",
  version: "4.0",
  hasPermssion: 0,
  credits: "Mohammad Akash (cleaned & improved by Grok)",
  description: "শুধুমাত্র একটি ইমোজি পাঠালে ভয়েস পাঠাবে। টেক্সট বা একাধিক ইমোজি থাকলে কাজ করবে না",
  commandCategory: "noPrefix",
  usages: "🥺",
  cooldowns: 1
};

// সাপোর্টেড ইমোজি + ভয়েস লিংক
const emojiVoiceMap = {
  "🥱": "https://files.catbox.moe/9pou40.mp3",
  "😁": "https://files.catbox.moe/60cwcg.mp3",
  "😌": "https://files.catbox.moe/epqwbx.mp3",
  "🥺": "https://files.catbox.moe/wc17iq.mp3",
  "🤭": "https://files.catbox.moe/cu0mpy.mp3",
  "😅": "https://files.catbox.moe/jl3pzb.mp3",
  "😏": "https://files.catbox.moe/z9e52r.mp3",
  "😞": "https://files.catbox.moe/tdimtx.mp3",
  "🤫": "https://files.catbox.moe/0uii99.mp3",
  "🍼": "https://files.catbox.moe/p6ht91.mp3",
  "🤔": "https://files.catbox.moe/hy6m6w.mp3",
  "🥰": "https://files.catbox.moe/dv9why.mp3",
  "🤦": "https://files.catbox.moe/ivlvoq.mp3",
  "😘": "https://files.catbox.moe/sbws0w.mp3",
  "😑": "https://files.catbox.moe/p78xfw.mp3",
  "😢": "https://files.catbox.moe/shxwj1.mp3",
  "🙊": "https://files.catbox.moe/3bejxv.mp3",
  "🤨": "https://files.catbox.moe/4aci0r.mp3",
  "😡": "https://files.catbox.moe/shxwj1.mp3",
  "🙈": "https://files.catbox.moe/3qc90y.mp3",
  "😍": "https://files.catbox.moe/qjfk1b.mp3",
  "😭": "https://files.catbox.moe/itm4g0.mp3",
  "😱": "https://files.catbox.moe/mu0kka.mp3",
  "😻": "https://files.catbox.moe/y8ul2j.mp3",
  "😿": "https://files.catbox.moe/tqxemm.mp3",
  "💔": "https://files.catbox.moe/6yanv3.mp3",
  "🤣": "https://files.catbox.moe/2sweut.mp3",
  "🥹": "https://files.catbox.moe/jf85xe.mp3",
  "😩": "https://files.catbox.moe/b4m5aj.mp3",
  "🫣": "https://files.catbox.moe/ttb6hi.mp3",
  "🐸": "https://files.catbox.moe/utl83s.mp3",
  "💋": "https://files.catbox.moe/37dqpx.mp3",
  "🫦": "https://files.catbox.moe/61w3i0.mp3",
  "😴": "https://files.catbox.moe/rm5ozj.mp3",
  "🙏": "https://files.catbox.moe/7avi7u.mp3",
  "😼": "https://files.catbox.moe/4oz916.mp3",
  "🖕": "https://files.catbox.moe/593u3j.mp3",
  "🥵": "https://files.catbox.moe/l90704.mp3",
  "🙂": "https://files.catbox.moe/mt5il0.mp3",
  "😒": "https://files.catbox.moe/mt5il0.mp3",
  "😓": "https://files.catbox.moe/zh3mdg.mp3",
  "🤧": "https://files.catbox.moe/zh3mdg.mp3",
  "🙄": "https://files.catbox.moe/vgzkeu.mp3"
  // নতুন ইমোজি যোগ করতে চাইলে এখানে যোগ করো
};

const cacheDir = path.join(__dirname, "cache");
fs.ensureDirSync(cacheDir);

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID } = event;
  if (!body) return;

  const text = body.trim();

  // ১. শুধুমাত্র ইমোজি + স্পেস থাকতে পারবে, কোনো লেটার/নাম্বার/সিম্বল না
  if (/[^\p{Emoji}\s]/gu.test(text)) return;

  // ২. সব ইমোজি এক্সট্র্যাক্ট করো
  const emojis = text.match(/\p{Emoji}/gu);
  if (!emojis || emojis.length !== 1) return; // শুধু একটা ইমোজি থাকতে হবে

  const emoji = emojis[0];
  const voiceUrl = emojiVoiceMap[emoji];
  if (!voiceUrl) return; // সাপোর্টেড না হলে কিছু করবে না

  // ক্যাশ ফাইলের নাম (একই ইমোজির জন্য একবারই ডাউনলোড)
  const fileName = crypto.createHash("md5").update(emoji).digest("hex") + ".mp3";
  const filePath = path.join(cacheDir, fileName);

  try {
    // ক্যাশে না থাকলে ডাউনলোড করো
    if (!fs.existsSync(filePath)) {
      const response = await axios({
        url: voiceUrl,
        method: "GET",
        responseType: "arraybuffer"
      });
      fs.writeFileSync(filePath, Buffer.from(response.data));
    }

    // ভয়েস পাঠাও
    api.sendMessage(
      {
        body: "",
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      () => {}, // ক্যাশ ফাইল ডিলিট করবো না
      messageID
    );
  } catch (err) {
    console.error("Emoji voice error:", err.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // খারাপ ফাইল হলে মুছে ফেলো
    api.sendMessage("ভয়েস লোড করতে সমস্যা হচ্ছে 😢", threadID);
  }
};

module.exports.run = () => {};
