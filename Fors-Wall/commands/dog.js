const axios = require('axios');
module.exports = {
  name: 'dog',
  description: 'Menampilkan gambar anjing lucu.',
  category: 'Fun & Game',

  async execute(message) {
    const res = await axios.get('https://dog.ceo/api/breeds/image/random');
    message.channel.send({ content: '🐶 Anjing lucu:', files: [res.data.message] });
  }
};
