const waifus = ['Rem', 'Asuna', 'Zero Two', 'Hinata', 'Mikasa', 'Saber'];
const husbandos = ['Levi', 'Kakashi', 'Itachi', 'Gojo', 'Luffy', 'Naruto'];
module.exports = {
  name: 'claim',
  execute(message) {
    const all = [...waifus, ...husbandos];
    const chosen = all[Math.floor(Math.random() * all.length)];
    message.channel.send(`🎁 Kamu mengklaim **${chosen}** sebagai pasanganmu!`);
  }
};
