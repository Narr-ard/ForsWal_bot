module.exports = {
  name: 'lotmgambar',
  description: 'Menampilkan gambar bertema Lord of the Mysteries dari Twitter',
  async execute(message) {
    const gambar = [
      'https://pbs.twimg.com/media/Fk0d9rCakAAQafM?format=jpg&name=large',
      'https://pbs.twimg.com/media/Fk3sJ-RaYAAt5fg?format=jpg&name=large',
      'https://pbs.twimg.com/media/FmZz9jMaYAAgORO?format=jpg&name=large'
    ];
    const acak = gambar[Math.floor(Math.random() * gambar.length)];
    return message.reply({ content: '🖼️ Gambar misterius dari kabut...', files: [acak] });
  }
};
