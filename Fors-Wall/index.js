require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const express = require('express');

// Inisialisasi bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
const prefix = '!';

// Load semua command dari folder ./commands/
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Event: Saat pesan dikirim
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const learnedPath = './data/learned.json';
  const learned = fs.existsSync(learnedPath) ? JSON.parse(fs.readFileSync(learnedPath)) : {};
  const msgContent = message.content.toLowerCase();

  // Auto-reply dari pembelajaran
  if (learned[msgContent]) {
    message.reply(learned[msgContent]);
    return;
  }

  // Cek prefix dan command
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('❌ Terjadi kesalahan saat menjalankan perintah.');
  }
});

// Event: Saat member baru masuk
client.on('guildMemberAdd', async member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`👋 Selamat datang di server, ${member}!`);

  // Auto-role (jika tersedia di .env)
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

// Event: Saat member keluar
client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`😢 ${member.user.tag} telah keluar dari server.`);
});

// Express server untuk UptimeRobot ping
const app = express();
app.get('/', (req, res) => res.send('🤖 Bot is alive!'));
app.listen(3000, () => console.log('🌐 Server Express berjalan di port 3000'));

// Login bot
client.login(process.env.TOKEN);
