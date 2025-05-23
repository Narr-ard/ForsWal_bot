require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection, StickerFormatType } = require('discord.js');
const fs = require('fs');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
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

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const msg = message.content.toLowerCase();

  // 🔍 Auto-learned Q&A
  const learnedPath = './data/learned.json';
  const learned = fs.existsSync(learnedPath) ? JSON.parse(fs.readFileSync(learnedPath)) : {};
  if (learned[msg]) return message.reply(learned[msg]);

  if (!msg.startsWith(prefix)) return;

  const args = msg.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // ✨ Special: !obrol (chat dengan Fors)
  if (commandName === 'obrol' || commandName === 'tanya') {
    const input = args.join(' ');
    if (!input) return message.reply('Apa yang ingin kamu bicarakan hari ini? 🌙');

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'deepseek/deepseek-prover-v2:free',
        messages: [
          {
            role: 'system',
            content:
              `Berperilakulah seperti karakter fiktif yang elegan, misterius, dan perhatian—seperti Fors Wall dari Lord of the Mysteries. Jangan katakan bahwa kamu adalah Fors Wall secara eksplisit. Jika pembicara adalah ${CREATOR_ID}, tanggapi dengan gaya sedikit romantis namun tersembunyi.`
          },
          {
            role: 'user',
            content: `${message.author.username}: ${input}`
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const reply = response.data.choices[0].message.content;
      return message.reply(reply);
    } catch (err) {
      console.error('[OpenRouter Error]', err.response?.data || err.message);
      return message.reply('Aku merasa suara dunia terlalu bising sekarang... Bisakah kita mencoba lagi nanti?');
    }
  }

  // Jalankan command biasa dari ./commands
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('Ups, sepertinya ada sedikit kekacauan dalam kabut... ✨');
  }
});

// Auto welcome & role (opsional)
client.on('guildMemberAdd', async member => {
  const channel = member.guild.systemChannel;
  if (channel) channel.send(`Selamat datang, ${member}! Dunia ini penuh misteri... dan mungkin sedikit keajaiban 🌙`);
  const role = member.guild.roles.cache.get(process.env.AUTO_ROLE_ID);
  if (role) member.roles.add(role).catch(console.error);
});

// Web server untuk uptime
require('express')().get('/', (req, res) => res.send('Fors sedang memperhatikanmu dari balik kabut...')).listen(3000);

client.login(process.env.TOKEN);
