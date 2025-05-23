// index.js (Final dengan karakter Fors Wall & fitur obrol romantis tersembunyi)
require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection, StickerFormatType } = require('discord.js');
const fs = require('fs');
const express = require('express');
const path = require('path');
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
const CREATOR_ID = process.env.CREATOR_ID; // ID Pembuat Bot

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

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

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('Ada yang salah saat menjalankan perintah... Tapi jangan khawatir, aku akan segera memperbaikinya~');
  }
});

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

client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`🌙 ${member.user.tag} telah meninggalkan tempat ini... Semoga dia menemukan cahaya dalam mimpinya.`);
});

client.on('messageCreate', async message => {
  if (message.stickers.size > 0) {
    const sticker = message.stickers.first();
    if (sticker && sticker.format === StickerFormatType.Lottie) {
      return message.reply('Stiker itu lucu... Tapi tak selucu kamu, mungkin. ✨');
    }
  }

  if (message.content.startsWith('!obrol')) {
    const input = message.content.replace('!obrol', '').trim();
    if (!input) return message.reply('Apa yang ingin kamu bicarakan, hm? 🌙');

    try {
      const res = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'openai/gpt-4',
        messages: [
          {
            role: 'system',
            content: `Kamu adalah Fors Wall dari Lord of the Mysteries. Kamu sopan, misterius, lembut, dan penuh perhatian. Kamu berbicara manis, terutama kepada penciptamu (${CREATOR_ID}).` +
              ' Jika yang berbicara adalah dia, kamu akan terdengar sedikit romantis tapi tidak terlalu jelas.'
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
      message.reply('Maaf, aku sedang tidak bisa bicara sekarang...');
    }
  }
});

// Web server untuk menjaga uptime
const app = express();
app.get('/', (req, res) => res.send('Fors is alive... 🖤'));
app.listen(3000, () => console.log('✨ Web server berjalan di port 3000'));

client.login(process.env.TOKEN);
