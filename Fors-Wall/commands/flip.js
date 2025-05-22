module.exports = {
  name: 'flip',
  description: 'Lempar koin (Heads atau Tails).',
  category: 'Fun & Game',

  execute(message) {
    const result = Math.random() < 0.5 ? 'Kepala' : 'Ekor';
    message.channel.send(`🪙 Hasil lempar koin: **${result}**`);
  }
};
