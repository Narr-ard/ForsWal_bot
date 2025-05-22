const waifus = ['Rem', 'Asuna', 'Zero Two', 'Hinata', 'Mikasa', 'Saber'];
module.exports = {
  name: 'waifu',
  execute(message) {
    const chosen = waifus[Math.floor(Math.random() * waifus.length)];
    message.channel.send(`💖 Waifumu hari ini adalah **${chosen}**`);
  }
};
