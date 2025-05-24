const axios = require('axios');
module.exports = {
  name: 'cat',
  description: 'Menampilkan gambar kucing lucu.',
  category: 'Fun & Game',

  async execute(message) {
    const res = await axios.get('https://api.thecatapi.com/v1/images/search');
    message.channel.send({ content: '😺 Kucing lucu:', files: [res.data[0].url] });
  }
};
