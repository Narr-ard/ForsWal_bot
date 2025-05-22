require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const express = require('express');

// Inisialisasi client
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

// Load semua command dari folder ./commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Event: Saat user mengirim pesan
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Auto-learning reply system
  const learnedPath = './data/learned.json';
  const learned = fs.existsSync(learnedPath) ? JSON.parse(fs.readFileSync(learnedPath)) : {};
  const msgContent = message.content.toLowerCase();

  if (learned[msgContent]) {
    message.reply(learned[msgContent]);
    return;
  }

  // Handle command
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('Terjadi kesalahan saat menjalankan perintah.');
  }
});

// Welcome: saat user join server
client.on('guildMemberAdd', async member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`👋 Selamat datang di server, ${member}!`);

  // Auto-role (jika AUTO_ROLE_ID tersedia)
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

// Goodbye: saat user keluar
client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`😢 ${member.user.tag} telah keluar dari server.`);
});

// Ping server agar tetap aktif via UptimeRobot
const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(3000, () => console.log('🌐 Ping server aktif di port 3000'));

// Login bot
client.login(process.env.TOKEN);
