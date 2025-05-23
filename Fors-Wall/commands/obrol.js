const axios = require('axios');

module.exports = {
  name: 'obrol',
  description: 'Ngobrol dengan AI pintar.',
  category: 'Chat',
  async execute(message, args) {
    const prompt = args.join(' ');
    if (!prompt) return message.reply('Kirim sesuatu untuk diajak ngobrol.');

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      }, {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const reply = response.data.choices[0].message.content;
      message.reply(reply);
    } catch (err) {
      console.error(err);
      message.reply('Gagal menghubungi chatbot.');
    }
  }
};
