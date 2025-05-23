const axios = require('axios');

module.exports = {
  name: 'translate',
  description: 'Terjemahkan teks ke bahasa yang diinginkan.',
  category: 'Education',
  async execute(message, args) {
    const [lang, ...text] = args;
    if (!lang || !text.length) return message.reply('Format: `!translate <lang> <teks>`');

    try {
      const res = await axios.post(`https://translate.argosopentech.com/translate`, {
        q: text.join(' '),
        source: 'auto',
        target: lang,
        format: 'text'
      });
      message.reply(`Hasil terjemahan: ${res.data.translatedText}`);
    } catch (err) {
      console.error(err);
      message.reply('Gagal menerjemahkan teks.');
    }
  }
};
