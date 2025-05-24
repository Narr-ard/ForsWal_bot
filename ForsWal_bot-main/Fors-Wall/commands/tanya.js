const axios = require('axios');

module.exports = {
  name: 'tanya',
  description: 'Tanyakan apa saja ke AI!',
  category: 'Chatbot',
  async execute(message, args) {
    const question = args.join(' ');
    if (!question) {
      return message.reply('Kamu belum menuliskan pertanyaannya.');
    }

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Kamu adalah asisten Discord yang pintar dan ramah.' },
            { role: 'user', content: question }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const reply = response.data.choices[0].message.content;
      message.reply(reply);
    } catch (error) {
      console.error('Gagal memproses pertanyaan:', error);
      message.reply('Maaf, terjadi kesalahan saat memproses pertanyaan.');
    }
  }
};
