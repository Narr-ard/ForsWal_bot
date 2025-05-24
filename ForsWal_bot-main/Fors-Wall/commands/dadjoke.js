const axios = require('axios');
module.exports = {
  name: 'dadjoke',
  description: 'Dapatkan lelucon bapak bapak yang kocak.',
  category: 'Fun & Game',

  async execute(message) {
    const res = await axios.get('https://icanhazdadjoke.com/', {
      headers: { Accept: 'application/json' }
    });
    message.channel.send(`🤣 ${res.data.joke}`);
  }
};
