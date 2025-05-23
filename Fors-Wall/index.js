// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const CREATOR_ID = 'ID_DISCORD_KAMU'; // Ganti dengan ID Discord kamu

client.once('ready', () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);
});

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
              content:
                `Berperilakulah seperti karakter fiktif yang elegan, misterius, dan perhatian—terinspirasi dari Fors Wall. Jangan sebut namamu. Jika yang bertanya adalah ${CREATOR_ID}, tanggapi dengan gaya sedikit romantis.`
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
            'Content-Type': 'application/json'
          }
        }
      );

      let reply = response.data.choices[0].message.content.trim();

      // Deteksi dan ambil isi JSON jika perlu
      try {
        const parsed = JSON.parse(reply);
        if (typeof parsed === 'object' && parsed.jawaban) reply = parsed.jawaban;
      } catch (_) {
        // Bukan JSON, kirim apa adanya
      }

      return message.reply(reply);
    } catch (err) {
      console.error('[OpenRouter Error]', err.response?.data || err.message);
      return message.reply('Aku merasa suara dunia terlalu bising sekarang... Bisakah kita mencoba lagi nanti?');
    }
  }
});

client.login(process.env.TOKEN);
