const axios = require('axios');
module.exports = {
  name: 'pug',
  description: 'Menampilkan gambar pug lucu.',
  category: 'Fun & Game',

  async execute(message) {
    const res = await axios.get('https://dog.ceo/api/breed/pug/images/random');
    message.channel.send({ content: '🐕 Pug lucu:', files: [res.data.message] });
  }
};
