require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const axios = require('axios');
const express = require('express');

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
const logFilePath = './data/obrol_logs.json';

client.commands = new Collection();
const commandFiles = fs.existsSync('./commands') ? fs.readdirSync('./commands').filter(file => file.endsWith('.js')) : [];
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

  const cooldownKey = `${message.author.id}-${commandName}`;
  if (cooldowns.has(cooldownKey)) {
    const remaining = ((cooldowns.get(cooldownKey) - Date.now()) / 1000).toFixed(1);
    return message.reply(`🕰️ Tunggu ${remaining} detik sebelum menggunakan perintah ini lagi.`);
  }

  try {
    if (commandName === 'obrol') {
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
                content: `Kamu adalah Fors Wall dari novel Lord of the Mysteries. Seorang wanita misterius, tenang, dan penyihir yang menyukai rahasia serta filsafat. Jawablah langsung dan alami, seperti sedang berbicara. Jangan balas dalam format JSON, markdown, atau bullet list. Hindari menyebut "penanya", dan jangan beri penjelasan tentang gaya bicara atau tone. Jika ${CREATOR_ID} yang bertanya, tanggapi dengan lembut dan sangat romantis. Gunakan bahasa Indonesia.`
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

        // Bersihkan reply dari artefak format
        reply = reply
          .replace(/^json\s*/i, '')
          .replace(/```|'''|["]{3}/g, '')
          .replace(/^\{[\s\S]*?\}/g, '')
          .replace(/Tone:.*/gi, '')
          .replace(/Gaya:.*/gi, '')
          .replace(/Penjelasan:.*/gi, '')
          .trim();

        if (!reply) {
          reply = "Aku di sini... tapi kabutnya terlalu tebal untuk menjawab saat ini.";
        }

        await message.reply({ content: reply, allowedMentions: { repliedUser: false } });

        // Simpan ke log file
        try {
          const log = fs.existsSync(logFilePath) ? JSON.parse(fs.readFileSync(logFilePath)) : [];

          log.push({
            userId: message.author.id,
            username: message.author.tag,
            message: input,
            reply: reply,
            timestamp: new Date().toISOString()
          });

          fs.writeFileSync(logFilePath, JSON.stringify(log, null, 2));
        } catch (err) {
          console.error('Gagal menyimpan log obrol:', err);
        }

      } catch (err) {
        console.error('[OpenRouter Error]', err.response?.data || err.message);
        await message.reply('Fors sedang menyembunyikan dirinya di kabut misteri... Coba lagi nanti.');
      }

      return;
    } else if (command) {
      await command.execute(message, args, client);
    }

    cooldowns.set(cooldownKey, Date.now() + 5000);
    setTimeout(() => cooldowns.delete(cooldownKey), 5000);
  } catch (error) {
    console.error(error);
    message.reply('Ada yang salah saat menjalankan perintah... Tapi tenang, aku akan memperbaikinya ✨');
  }
});

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

client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`🍃 ${member.user.tag} telah pergi... Seperti mimpi yang tak kembali.`);
});

const app = express();
app.get('/', (req, res) => res.send('Fors is watching through the mist... 🌫️'));
app.listen(3000, () => console.log('✨ Web server berjalan di port 3000'));

client.login(process.env.TOKEN);
