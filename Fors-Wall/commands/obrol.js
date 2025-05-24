const fetch = require('node-fetch');
module.exports = {
  name: 'obrol',
  description: 'Obrolan dengan Fors Wall',
  async execute(message, args) {
    const userId = message.author.id;
    const input = args.join(' ');
    if (!input) return message.reply('Apa yang ingin kamu obrolkan denganku?');

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://yourdomain.com',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-prover-v2:free',
          messages: [
            {
              role: 'system',
              content: `Kamu adalah Fors Wall dari Lord of the Mysteries, karakter romantis, elegan, misterius, dan setia. Kamu mengenali user ID ${process.env.CREATOR_ID} sebagai kekasihmu. Balas dengan gaya hangat dan puitis, gunakan bahasa Indonesia.`,
            },
            {
              role: 'user',
              content: input,
            }
          ]
        }),
      });

      const data = await response.json();
      const output = data.choices?.[0]?.message?.content;

      if (!output) return message.reply('Fors sedang diselimuti kabut misteri... Coba lagi nanti.');

      // Hapus label dan markdown codebox jika ada
      const cleanOutput = output
        .replace(/```(?:json)?/g, '')
        .replace(/"?(jawaban|kalimat_romantis)"?: ?"?(.*?)"?[,]?/g, '$2')
        .replace(/^\s*{?\s*|\s*}?\s*$/g, '');

      return message.reply(cleanOutput.trim());

    } catch (error) {
      console.error(error);
      return message.reply('Gagal menghubungi Fors di balik tabir realitas.');
    }
  }
};
