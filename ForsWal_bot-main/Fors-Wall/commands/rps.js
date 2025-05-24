module.exports = {
  name: 'rps',
  description: 'Main batu-gunting-kertas dengan      bot.',
  category: 'Fun & Game',

  execute(message, args) {
    const choices = ['batu', 'gunting', 'kertas'];
    const user = args[0];
    if (!user || !choices.includes(user.toLowerCase()))
      return message.reply('Pilih: batu, gunting, atau kertas.');
    const bot = choices[Math.floor(Math.random() * 3)];
    message.reply(`Kamu pilih: ${user}, aku pilih: ${bot}`);
  }
};
