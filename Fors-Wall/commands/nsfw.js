// Required: node-fetch, and your bot must be configured with your Discord client setup
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

    // !nsfw doujin <id>
    if (subcommand === 'doujin') {
      const id = args[1];
      if (!id || isNaN(id)) return message.reply('Gunakan: `!nsfw doujin <id>`');

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

    // !nsfw tag <tag>
    if (subcommand === 'tag') {
      const tag = args.slice(1).join(" ");
      if (!tag) return message.reply('Gunakan: `!nsfw tag <tag>`');

      try {
        const search = await fetch(`https://nhentai.net/api/galleries/tagged?tag=${encodeURIComponent(tag)}`);
        const result = await search.json();
        if (!result.result.length) return message.reply('Tag tidak ditemukan.');

        const randomDoujin = result.result[Math.floor(Math.random() * result.result.length)];
        const title = randomDoujin.title.english || randomDoujin.title.pretty;
        const cover = `https://t.nhentai.net/galleries/${randomDoujin.media_id}/cover.jpg`;
        const url = `https://nhentai.net/g/${randomDoujin.id}`;

        return message.reply({
          embeds: [{
            title: `📚 ${title}`,
            description: `[Buka di nHentai](${url})`,
            image: { url: cover },
            color: 0xcc00ff
          }]
        });
      } catch (e) {
        console.error(e);
        return message.reply('Gagal mencari berdasarkan tag.');
      }
    }

    // !nsfw search <keyword>
    if (subcommand === 'search') {
      const query = args.slice(1).join(" ");
      if (!query) return message.reply('Gunakan: `!nsfw search <keyword>`');

      try {
        const search = await fetch(`https://nhentai.net/api/galleries/search?query=${encodeURIComponent(query)}`);
        const result = await search.json();
        if (!result.result.length) return message.reply('Tidak ditemukan hasil.');

        const entries = result.result.slice(0, 3).map(d => `**${d.title.english || d.title.pretty}**\nhttps://nhentai.net/g/${d.id}`).join("\n\n");
        return message.reply(`📖 Hasil pencarian untuk: *${query}*\n\n${entries}`);
      } catch (e) {
        console.error(e);
        return message.reply('Gagal mencari doujin.');
      }
    }

    return message.reply('Subcommand tidak dikenal. Gunakan: `!nsfw`, `!nsfw doujin <id>`, `!nsfw tag <tag>`, `!nsfw search <keyword>`');
  }
};
