require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const express = require('express');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const prefix = '!';
const CREATOR_ID = process.env.CREATOR_ID;
const cooldowns = new Map();

client.commands = new Collection();
const commandFiles = fs.existsSync('./commands') ? fs.readdirSync('./commands').filter(file => file.endsWith('.js')) : [];
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Handle learned replies + commands
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const learnedPath = './data/learned.json';
  const learned = fs.existsSync(learnedPath) ? JSON.parse(fs.readFileSync(learnedPath)) : {};
  const msgContent = message.content.toLowerCase();

  if (learned[msgContent]) {
    return message.reply(learned[msgContent]);
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command && commandName !== 'obrol' && commandName !== 'tanya') return;

  const cooldownKey = `${message.author.id}-${commandName}`;
  if (cooldowns.has(cooldownKey)) {
    const remaining = ((cooldowns.get(cooldownKey) - Date.now()) / 1000).toFixed(1);
    return message.reply(`🕰️ Tunggu ${remaining} detik sebelum menggunakan perintah ini lagi.`);
  }

  try {
    if (commandName === 'obrol' || commandName === 'tanya') {
      const input = args.join(' ');
      if (!input) return message.reply('Apa yang ingin kamu bicarakan hari ini? 🌙');

      await message.channel.sendTyping();

      try {
        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'deepseek/deepseek-prover-v2:free',
            messages: [
              {
                role: 'system',
                content: `Kamu adalah Fors Wall dari novel Lord of the Mysteries. Seorang wanita misterius, tenang, dan penyihir yang menyukai rahasia serta filsafat. Jawablah langsung dan alami, seperti sedang berbicara. Jangan balas dalam format JSON, markdown, atau bullet list. Hindari menyebut "penanya", dan jangan beri penjelasan tentang gaya bicara atau tone. Jika ${CREATOR_ID} yang bertanya, tanggapi dengan lembut dan sedikit romantis. Gunakan bahasa Indonesia.`
              },
              {
                role: 'user',
                content: input
              }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://github.com/Narr-ard/ForsWal_bot',
              'X-Title': 'ForsWallBot'
            }
          }
        );

        let reply = response?.data?.choices?.[0]?.message?.content || '';

        // Coba parse JSON jika valid dan ekstrak "message"
        try {
          const parsed = JSON.parse(reply);
          if (typeof parsed === 'object' && parsed.message) {
            reply = parsed.message;
          }
        } catch (_) {
          // Jika bukan JSON, tetap pakai original reply
        }

        // Bersihkan teks dari JSON & instruksi AI
        reply = reply
          .replace(/^json\s*/i, '')
          .replace(/^Penjelasan:.*/gis, '')
          .replace(/```/g, '')
          .replace(/'''/g, '')
          .replace(/["]{3}/g, '')
          .replace(/Tone:.*/gi, '')
          .replace(/Gaya:.*/gi, '')
          .replace(/Pertanyaan Terbuka:.*/gi, '')
          .replace(/Bahasa Indonesia:.*/gi, '')
          .replace(/Kecadangan dan Keramahan:.*/gi, '')
          .replace(/^\{[\s\S]*?\}/g, '') // Hapus isi JSON seperti { "message": ... }
          .trim();

        if (!reply) {
          reply = "Aku di sini... tapi kabutnya terlalu tebal untuk menjawab saat ini.";
        }

        await message.reply({ content: reply, allowedMentions: { repliedUser: false } });

      } catch (err) {
        console.error('[OpenRouter Error]', err.response?.data || err.message);
        await message.reply('Fors sedang menyembunyikan dirinya di kabut misteri... Coba lagi nanti.');
      }

      return;
    } else {
      await command.execute(message, args, client);
    }

    cooldowns.set(cooldownKey, Date.now() + 5000); // 5 detik cooldown
    setTimeout(() => cooldowns.delete(cooldownKey), 5000);
  } catch (error) {
    console.error(error);
    message.reply('Ada yang salah saat menjalankan perintah... Tapi tenang, aku akan memperbaikinya ✨');
  }
});

// Welcome
client.on('guildMemberAdd', async member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`🌌 Selamat datang, ${member}. Aku sudah menunggumu.`);

  const roleId = process.env.AUTO_ROLE_ID;
  if (roleId) {
    const role = member.guild.roles.cache.get(roleId);
    if (role) {
      try {
        await member.roles.add(role);
        console.log(`✅ Member ${member.user.tag} diberikan role otomatis.`);
      } catch (err) {
        console.error(`❌ Gagal memberi role ke ${member.user.tag}:`, err);
      }
    }
  }
});

// Leave
client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`🍃 ${member.user.tag} telah pergi... Seperti mimpi yang tak kembali.`);
});

// Keep alive
const app = express();
app.get('/', (req, res) => res.send('Fors is watching through the mist... 🌫️'));
app.listen(3000, () => console.log('✨ Web server berjalan di port 3000'));

client.login(process.env.TOKEN);
