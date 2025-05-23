// index.js (Final versi Fors Wall + OpenRouter Gratis)
require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection, StickerFormatType } = require('discord.js');
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

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Event utama
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const learnedPath = './data/learned.json';
  const learned = fs.existsSync(learnedPath) ? JSON.parse(fs.readFileSync(learnedPath)) : {};
  const msgContent = message.content.toLowerCase();

  if (learned[msgContent]) {
    return message.reply(learned[msgContent]);
  }

  // Command handler
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('Ada yang salah saat menjalankan perintah... Tapi jangan khawatir, aku akan segera memperbaikinya~');
  }
});

// Welcome & Auto-role
client.on('guildMemberAdd', async member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`✨ Selamat datang di tempat ini, ${member}! Aku Fors, kalau butuh bantuan... kau tahu harus mencari siapa.`);

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

// Goodbye
client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`🌙 ${member.user.tag} telah meninggalkan tempat ini... Semoga dia menemukan cahaya dalam mimpinya.`);
});

// Sticker detector
client.on('messageCreate', async message => {
  if (message.stickers.size > 0) {
    const sticker = message.stickers.first();
    if (sticker && sticker.format === StickerFormatType.Lottie) {
      return message.reply('Stiker itu lucu... Tapi tak selucu kamu, mungkin. ✨');
    }
  }
});

// !obrol command
client.on('messageCreate', async message => {
  if (!message.content.startsWith('!obrol')) return;

  const input = message.content.replace('!obrol', '').trim();
  if (!input) return message.reply('Apa yang ingin kamu bicarakan, hm? 🌙');

  try {
    const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'system',
          content: `Kamu adalah Fors Wall dari Lord of the Mysteries. Kamu sopan, misterius, lembut, dan perhatian. Jika pembicara adalah ${CREATOR_ID}, kamu boleh terdengar sedikit romantis tapi tidak terlalu terlihat.`
        },
        {
          role: 'user',
          content: `${message.author.username} berkata: ${input}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = res.data.choices[0].message.content;
    message.reply(reply);
  } catch (err) {
    console.error(err.response?.data || err);
    message.reply('Fors sedang menyembunyikan dirinya di kabut misteri... Coba lagi nanti.');
  }
});

// Web server untuk UptimeRobot
const app = express();
app.get('/', (req, res) => res.send('Fors is alive... 🖤'));
app.listen(3000, () => console.log('✨ Web server berjalan di port 3000'));

client.login(process.env.TOKEN);
