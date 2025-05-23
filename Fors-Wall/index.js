require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Channel]
});

const prefix = '!';
client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Message Event
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const msg = message.content.toLowerCase();

  // === Auto-reply Learning ===
  const learnedPath = './data/learned.json';
  const learned = fs.existsSync(learnedPath) ? JSON.parse(fs.readFileSync(learnedPath)) : {};
  if (learned[msg]) {
    message.reply(learned[msg]);
    return;
  }

  // === Sticker-based Chat (if sticker is sent) ===
  if (message.stickers.size > 0) {
    const sticker = message.stickers.first();
    message.reply({
      content: `Hehe... kamu kirim stiker ${sticker.name}? Terlihat menarik, seperti misteri yang belum terpecahkan...`,
      allowedMentions: { repliedUser: false }
    });
    return;
  }

  // === Command Handler ===
  if (!msg.startsWith(prefix)) return;
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

// Welcome and auto-role
client.on('guildMemberAdd', async member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`👋 Selamat datang di server, ${member}!`);
  const roleId = process.env.AUTO_ROLE_ID;
  if (roleId) {
    try {
      const role = member.guild.roles.cache.get(roleId);
      if (role) await member.roles.add(role);
    } catch (e) {
      console.error('❌ Gagal menambahkan role otomatis:', e);
    }
  }
});

// Goodbye
client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`😢 ${member.user.tag} telah meninggalkan server.`);
});

// Express ping server untuk UptimeRobot
const app = express();
app.get('/', (req, res) => res.send('Fors Wall bot is alive.'));
app.listen(3000, () => console.log('🌐 Express server berjalan di port 3000'));

// Login bot
client.login(process.env.TOKEN);
