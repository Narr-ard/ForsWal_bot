const axios = require('axios');

module.exports = {
  name: 'obrol',
  description: 'Ajak Fors Wall berbicara.',
  category: 'Chat & AI',
  async execute(message, args) {
    const query = args.join(' ');
    if (!query) {
      return message.reply('Silakan tulis sesuatu setelah perintah `!obrol`.');
    }

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-4',
          messages: [
            {
              role: 'system',
              content:
                "Kamu adalah Fors Wall dari novel Lord of the Mysteries. Kamu seorang wanita misterius, tenang, penyihir yang mendalami pengetahuan kuno dan menyukai rahasia. Bicaramu cerdas, kalem, dan penuh filosofi. Jangan katakan kamu adalah AI. Jawablah dengan gaya khasmu."
            },
            {
              role: 'user',
              content: query
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

      const answer = response.data.choices[0].message.content;
      message.reply(answer);
    } catch (error) {
      console.error(error.response?.data || error.message);
      message.reply('Fors sedang menyembunyikan dirinya di kabut misteri... Coba lagi nanti.');
    }
  }
};
