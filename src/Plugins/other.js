const os = require('os');
const fs = require('fs');
const fetch = require('node-fetch');
const axios = require('axios');
const moment = require('moment-timezone');
const { formatSize, checkBandwidth, runtime } = require('../../lib/myfunc');
const checkDiskSpace = require('check-disk-space').default;
const performance = require('perf_hooks').performance;
const botImage = fs.readFileSync("./Media/Images/kango5.jpg");

module.exports = [ {
    command: ['botstatus', 'statusbot'],
    operate: async ({ Kango, m, reply }) => {
      const used = process.memoryUsage();
      const ramUsage = `${formatSize(used.heapUsed)} / ${formatSize(os.totalmem())}`;
      const freeRam = formatSize(os.freemem());
      const disk = await checkDiskSpace(process.cwd());
      const latencyStart = performance.now();
      
      await reply("⏳ *Calculating ping...*");
      const latencyEnd = performance.now();
      const ping = `${(latencyEnd - latencyStart).toFixed(2)} ms`;

      const { download, upload } = await checkBandwidth();
      const uptime = runtime(process.uptime());

      const response = `
      *🔹 BOT STATUS 🔹*

🔸 *Ping:* ${ping}
🔸 *Uptime:* ${uptime}
🔸 *RAM Usage:* ${ramUsage}
🔸 *Free RAM:* ${freeRam}
🔸 *Disk Usage:* ${formatSize(disk.size - disk.free)} / ${formatSize(disk.size)}
🔸 *Free Disk:* ${formatSize(disk.free)}
🔸 *Platform:* ${os.platform()}
🔸 *NodeJS Version:* ${process.version}
🔸 *CPU Model:* ${os.cpus()[0].model}
🔸 *Downloaded:* ${download}
🔸 *Uploaded:* ${upload}
`;

      Kango.sendMessage(m.chat, { text: response.trim() }, { quoted: m });
    }
}, {
    command: ['pair'],
    operate: async ({ m, text, reply }) => {
      if (!text) return reply('*Provide a phone number*\nExample: .pair 233593734312');
      const number = text.replace(/\+|\s/g, '').trim();
      const apiUrls = [
        `https://kango-ef1f620b32d8.herokuapp.com/pair?number=${encodeURIComponent(number)}`,
        `https://kango-ef1f620b32d8.herokuapp.com/pair?number=${encodeURIComponent(number)}`
      ];

      for (const url of apiUrls) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;
          const data = await response.json();
          const pairCode = data.code || 'No code received';

          return reply(`*🔹 Pair Code:*\n\`\`\`${pairCode}\`\`\`\n\n🔹 *How to Link:* 
1. Open WhatsApp on your phone.
2. Go to *Settings > Linked Devices*.
3. Tap *Link a Device* then *Link with Phone*.
4. Enter the pair code above.
5. Alternatively, tap the WhatsApp notification sent to your phone.
\n⏳ *Code expires in 2 minutes!*`);
        } catch (error) {
          continue;
        }
      }

      reply('❌ *Error fetching pair code. Try again later.*');
    }
}, {
  command: ['ping', 'p'],
  operate: async ({ m, Kango }) => {
    const startTime = performance.now();

    try {
      const sentMessage = await Kango.sendMessage(m.chat, {
        text: "📍Ping!",
        contextInfo: { quotedMessage: m.message }
      });
      
      const endTime = performance.now();
      const latency = `${(endTime - startTime).toFixed(2)} ms`;
      
      await Kango.sendMessage(m.chat, {
        text: `*⚡ 𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉 𝙎𝙥𝙚𝙚𝙙:* ${latency}`,
        edit: sentMessage.key, 
        contextInfo: { quotedMessage: m.message }
      });

    } catch (error) {
      console.error('Error sending ping message:', error);
      await Kango.sendMessage(m.chat, {
        text: 'An error occurred while trying to ping.',
        contextInfo: { quotedMessage: m.message }
      });
    }
  }
}, {
  command: ["alive", "uptime"],
  operate: async ({ Kango: David, m, reply }) => {
    const msgai = "*🌹Hi. I am 👑𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉, a friendly WhatsApp bot from Pakistan , created by 𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉. Don't worry, I'm still Alive☺🚀*";
    const imagePath = './Images/alive.png'; // Keep or update if you want to change this too

    // Random music from the 'Music' folder
    const musicFiles = [
      './Music/menu1.mp3',
      './Music/menu2.mp3',
      './Music/menu3.mp3',
      './Music/menu4.mp3'
    ];

    const randomMusic = musicFiles[Math.floor(Math.random() * musicFiles.length)];
    const botUptime = runtime(process.uptime());

    // React with emoji
    await David.sendMessage(m.chat, {
      react: {
        text: "❤️",
        key: m.key
      }
    });

    // Send image with caption + uptime
    await David.sendMessage(m.chat, {
      image: { url: imagePath },
      caption: `${msgai}\n\n*⏰ Uptime: ${botUptime}*`
    }, { quoted: m });

    // Send random music
    await David.sendMessage(m.chat, {
      audio: { url: randomMusic },
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m });
  }
}, {
  command: ["script"],
  operate: async ({ m, Kango, reply }) => {
    try {
      const repoUrl = "https://github.com/OfficialKango/KANGO-XMD";
      const zipUrl = `${repoUrl}/archive/refs/heads/main.zip`;

      // Fetch repo details to get avatar
      const { data: repo } = await axios.get("https://api.github.com/repos/OfficialKango/KANGO-XMD");
      const { data: avatarBuffer } = await axios.get(repo.owner.avatar_url, {
        responseType: "arraybuffer"
      });

      const caption =
        `*KANGO-XMD Repository*\n\n` +
        `🔗 *Repository URL*: ${repoUrl}\n` +
        `📂 *Branch*: main\n` +
        `📦 *File*: KANGO-XMD-main.zip\n\n` +
        `The ZIP file contains the full repository content.\n\n` +
        `Sending the file shortly...`;

      // Send preview message with thumbnail
      await Kango.sendMessage(m.chat, {
        text: caption,
        contextInfo: {
          externalAdReply: {
            title: "KANGO-XMD GitHub Repo",
            body: "Download the source code here",
            mediaType: 1,
            thumbnail: Buffer.from(avatarBuffer),
            sourceUrl: repoUrl
          }
        }
      }, { quoted: m });

      // Download the ZIP file
      const { data: zipBuffer } = await axios.get(zipUrl, { responseType: "arraybuffer" });

      // Send the ZIP file
      await Kango.sendMessage(m.chat, {
        document: zipBuffer,
        fileName: "KANGO-XMD-main.zip",
        mimetype: "application/zip"
      }, { quoted: m });

    } catch (err) {
      console.error("Script command error:", err);
      reply("❌ *Failed to fetch or send the repository ZIP.*");
    }
  }
}, {
  command: ["donate"],
  tags: ["info"],
  help: ["support"],
  operate: async ({ Kango, m, reply }) => {
    await Kango.sendMessage(m.chat, {
      react: { text: "⏳", key: m.key }
    });

    const userName = m.pushName || "there";
    const userGreeting = `Hello Dear👋 *${userName}*,\nNo matter how much you send, it is very valuable to Us*`;

    const supportMessage = 
`╭━━━〔 *Support & Donations* 〕
┃ 💸 *Want to support us?*
┃ If you wish to donate...❤🧡💛
┃ ━━━━━━━━━━━━━━━━━━━
┃ 🇬🇭 *Owner:* *𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉*
┃ 💰 *MTN-Momo:* 0257767765
┃ 💸 *Voda-Cash:* 0509977126
┃ 🪙 *Binance-ID:* 762761682
┃ 🪀 *WhatsApp:* 233509977126
╰━━━━━━━━━━━━━━━━━━━━⬣

${userGreeting}

❤️ *Thanks for buying me coffee ☕* 
💖 *Your generosity keeps us going!* 
🌟 *Every contribution makes a difference!* 
💪 *Your support helps improve and grow this bot!* 👾

💡 *If you have ideas or questions, feel free to reach out!* 💬`;

    await Kango.sendMessage(m.chat, { text: supportMessage }, { quoted: m });

    setTimeout(async () => {
      await Kango.sendMessage(m.chat, {
        text: "🚀 *We truly appreciate your support!* Your kindness fuels our passion! 🌍\n\n🎉 Stay tuned for exciting updates coming soon! 📲"
      }, { quoted: m });
    }, 3000);

    setTimeout(async () => {
      await Kango.sendMessage(m.chat, {
        text: "✨ *You're a star for supporting this project!* 🌟 If you'd like to help even more, share this bot with your friends! 🤗"
      }, { quoted: m });
    }, 6000);

    await Kango.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });
  }
}, {
  command: ["repo", "repository"],
  operate: async ({
    m: _0x40a183,
    Kango: _0xdd323,
    reply: _0x2e05a5
  }) => {
    try {
      // Fetch repo data from GitHub
      const { data: repo } = await axios.get("https://api.github.com/repos/OfficialKango/KANGO-XMD");

      // Fetch the repo owner's avatar image
      const { data: avatarBuffer } = await axios.get(repo.owner.avatar_url, {
        responseType: "arraybuffer"
      });

      const caption =
        `*🌹 𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉 Repository*\n\n` +
        `🔗 *URL:* ${repo.html_url}\n` +
        `📝 *Description:* ${repo.description || "No description"}\n` +
        `🌟 *Stars:* ${repo.stargazers_count}\n` +
        `🔀 *Forks:* ${repo.forks_count}\n` +
        `📅 *Last Updated:* ${new Date(repo.updated_at).toLocaleString()}\n\n` +
        `👨‍💻 *Developer:* ${repo.owner.login}\n` +
        `✨ *Tip:* Fork it, star it, and deploy your version!\n\n` +
        `@${_0x40a183.sender.split("@")[0]} don’t forget to star the repo!`;

      await _0xdd323.sendMessage(_0x40a183.chat, {
        text: caption.trim(),
        contextInfo: {
          mentionedJid: [_0x40a183.sender],
          externalAdReply: {
            title: "𝒁𝒐𝒃𝒊 𝑻𝒆𝒄𝒉 REPO",
            mediaType: 1,
            thumbnail: Buffer.from(avatarBuffer),
            sourceUrl: repo.html_url
          }
        }
      }, {
        quoted: _0x40a183
      });
    } catch (err) {
      console.error("Repo fetch error:", err);
      _0x2e05a5("❌ *Error fetching repository details.*");
    }
  }
}, {
    command: ['time', 'date'],
    operate: async ({ m, reply }) => {
      const now = moment().tz(global.timezones);
      const timeInfo = `
      *🔹 CURRENT TIME 🔹*

🔸 *Day:* ${now.format('dddd')}
🔸 *Time:* ${now.format('HH:mm:ss')}
🔸 *Date:* ${now.format('LL')}
🔸 *Timezone:* ${global.timezones}
`;

      reply(timeInfo.trim());
    }
  }
];