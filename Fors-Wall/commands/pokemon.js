const axios = require('axios');
module.exports = {
  name: 'pokemon',
  description: 'Informasi tentang Pokémon.',
  category: 'Fun & Game',

  async execute(message, args) {
    const name = args[0];
    if (!name) return message.reply('Masukkan nama Pokémon.');
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      const data = res.data;
      message.channel.send({
        content: `#️⃣ **${data.name.toUpperCase()}**\nTinggi: ${data.height} | Berat: ${data.weight}`,
        files: [data.sprites.front_default]
      });
    } catch {
      message.reply('Pokémon tidak ditemukan!');
    }
  }
};
