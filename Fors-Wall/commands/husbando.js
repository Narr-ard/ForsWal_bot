const husbandos = ['Levi', 'Kakashi', 'Itachi', 'Gojo', 'Luffy', 'Naruto'];
module.exports = {
  name: 'husbando',
  execute(message) {
    const chosen = husbandos[Math.floor(Math.random() * husbandos.length)];
    message.channel.send(`💙 Husbandomu hari ini adalah **${chosen}**`);
  }
};
