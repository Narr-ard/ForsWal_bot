// Versi Final index.js dengan Auto-Learning, Auto Role, ChatBot, Q&A, Translator, dan Keep Alive
require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const express = require('express');
const axios = require('axios');
const path = require('path');

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

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Load data
const learnedPath = './data/learned.json';
const qaPath = './data/qa.json';
const obrolPath = './data/obrol.json';

let learned = fs.existsSync(learnedPath) ? JSON.parse(fs.readFileSync(learnedPath)) : {};
let qa = fs.existsSync(qaPath) ? JSON.parse(fs.readFileSync(qaPath)) : {};
let obrol = fs.existsSync(obrolPath) ? JSON.parse(fs.readFileSync(obrolPath)) : [];

// Message handler
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  // Auto Reply
  if (learned[content]) {
    return message.reply(learned[content]);
  }

  // Auto Q&A
  if (qa[content]) {
    return message.reply(qa[content]);
  }

  // Chat Mode (!obrol)
  const chatUser = obrol.find(pair => pair.user.toLowerCase() === content);
  if (chatUser) {
    return message.reply(chatUser.bot);
  }

  // Commands
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

// Welcome and Auto Role
client.on('guildMemberAdd', async member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`👋 Selamat datang di server, ${member}!`);

  const roleId = process.env.AUTO_ROLE_ID;
  if (roleId) {
    const role = member.guild.roles.cache.get(roleId);
    if (role) {
      try {
        await member.roles.add(role);
        console.log(`✅ ${member.user.tag} diberi role otomatis.`);
      } catch (err) {
        console.error(`❌ Gagal memberi role ke ${member.user.tag}:`, err);
      }
    }
  }
});

// Goodbye
client.on('guildMemberRemove', member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`😢 ${member.user.tag} telah keluar dari server.`);
});

// Keep alive server for uptime
const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
app.listen(3000, () => console.log('🌐 Ping server aktif di port 3000'));

// Save data back if needed (optional helper)
function saveData() {
  fs.writeFileSync(learnedPath, JSON.stringify(learned, null, 2));
  fs.writeFileSync(qaPath, JSON.stringify(qa, null, 2));
  fs.writeFileSync(obrolPath, JSON.stringify(obrol, null, 2));
}

// Export data and save function if needed by commands
client.learned = learned;
client.qa = qa;
client.obrol = obrol;
client.saveData = saveData;

// Start bot
client.login(process.env.TOKEN);
