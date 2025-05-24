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

// Load Commands
client.commands = new Collection();
client.cooldowns = new Collection();

const commandFiles = fs.existsSync('./commands') ? fs.readdirSync('./commands').filter(file => file.endsWith('.js')) : [];
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Handle learned responses and commands
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

  // ========== Cooldown logic ==========
  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name) || new Collection();
  const cooldownAmount = (command.cooldown || 5) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
      return message.reply(`⏳ Tunggu ${timeLeft} detik sebelum menggunakan \`${prefix}${command.name}\` lagi.`);
    }
  }

  timestamps.set(message.author.id, now);
  client.cooldowns.set(command.name, timestamps);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // ====================================

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('Ada yang salah saat menjalankan perintah... Tapi tenang, aku akan memperbaikinya ✨');
  }
});

// !obrol dan !tanya (DeepSeek AI personality chat)
client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith('!')) return;

  const [commandName, ...args] = message.content.slice(1).split(/\s+/);
  const input = args.join(' ');

  if (commandName === 'obrol' || commandName === 'tanya') {
    if (!input) return message.reply('Apa yang ingin kamu bicarakan hari ini? 🌙');

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-prover-v2:free',
          messages: [
            {
              role: 'system',
              content: `Berperilakulah seperti karakter fiktif misterius dan dewasa dari Lord of the Mysteries. Jawablah dengan tenang, kadang sedikit menggoda dan elegan. Jika penanya adalah ${CREATOR_ID}, tanggapi dengan nuansa romantis dan setia.`
            },
            {
              role: 'user',
              content: `${message.author.username}: ${input}`
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

      let reply = response.data.choices[0].message.content.trim();

      try {
        const parsed = JSON.parse(reply);
        if (typeof parsed === 'object' && parsed.jawaban) reply = parsed.jawaban;
      } catch (_) {}

      return message.reply(reply);
    } catch (err) {
      console.error('[OpenRouter Error]', err.response?.data || err.message);
      return message.reply('Aku merasa suara dunia terlalu bising sekarang... Bisakah kita mencoba lagi nanti?');
    }
  }
});

// Welcome message + auto-role
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

// Member leave
client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`🍃 ${member.user.tag} telah pergi... Seperti mimpi yang tak kembali.`);
});

// Express keep-alive
const app = express();
app.get('/', (req, res) => res.send('Fors is watching through the mist... 🌫️'));
app.listen(3000, () => console.log('✨ Web server berjalan di port 3000'));

client.login(process.env.TOKEN);
