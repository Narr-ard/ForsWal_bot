const axios = require('axios');
module.exports = {
  name: 'norris',
  description: 'Kutipan lucu ala Chuck Norris.',
  category: 'Fun & Game',

  async execute(message) {
    const res = await axios.get('https://api.chucknorris.io/jokes/random');
    message.channel.send(`💥 ${res.data.value}`);
  }
};
