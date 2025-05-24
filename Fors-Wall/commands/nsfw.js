const fetch = require('node-fetch');

module.exports = {
  name: 'nsfw',
  description: 'Perintah rahasia NSFW (hanya untuk pemilik)',
  hidden: true,
  category: 'NSFW',
  async execute(message, args) {
    if (message.author.id !== process.env.CREATOR_ID) {
      return message.reply('Perintah ini hanya untuk kekasihku...');
    }

    if (!message.channel.nsfw) {
      return message.reply('Gunakan perintah ini di saluran NSFW.');
    }

    const subcommand = args[0];

    // Default — random hentai image
    if (!subcommand || subcommand === 'img') {
      try {
        const res = await fetch('https://nekobot.xyz/api/image?type=hentai');
        const data = await res.json();
        return message.reply({ files: [data.message] });
      } catch (e) {
        console.error(e);
        return message.reply('Gagal mengambil gambar.');
      }
    }

    // nHentai fetch by ID
    if (subcommand === 'doujin') {
      const id = args[1];
      if (!id || isNaN(id)) {
        return message.reply('Gunakan: `!nsfw doujin <id>`');
      }

      try {
        const res = await fetch(`https://nhentai.net/api/gallery/${id}`);
        if (!res.ok) return message.reply('Doujin tidak ditemukan.');

        const data = await res.json();
        const title = data.title.english || data.title.pretty;
        const cover = `https://t.nhentai.net/galleries/${data.media_id}/cover.jpg`;
        const url = `https://nhentai.net/g/${id}`;

        return message.reply({
          embeds: [{
            title: `📚 ${title}`,
            description: `[Buka di nHentai](${url})`,
            image: { url: cover },
            color: 0xff3366
          }]
        });
      } catch (e) {
        console.error(e);
        return message.reply('Gagal mengambil doujin.');
      }
    }

    return message.reply('Subcommand tidak dikenal. Gunakan `!nsfw`, `!nsfw img`, atau `!nsfw doujin <id>`.');
  }
};
