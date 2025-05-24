const fetch = require('node-fetch');
module.exports = {
  name: 'nsfw',
  description: 'Perintah rahasia NSFW (hanya untuk pemilik)',
  hidden: true,
  async execute(message) {
    if (message.author.id !== process.env.CREATOR_ID) {
      return message.reply('Perintah ini hanya untuk kekasihku...');
    }

    if (!message.channel.nsfw) {
      return message.reply('Gunakan ini di saluran NSFW.');
    }

    try {
      const res = await fetch('https://nekobot.xyz/api/image?type=hentai');
      const data = await res.json();
      return message.reply({ files: [data.message] });
    } catch (e) {
      console.error(e);
      return message.reply('Aku gagal menemukan gambar nakal...');
    }
  }
};
