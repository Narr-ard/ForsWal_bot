module.exports = {
  name: 'ping',
  description: 'Bot akan membalas dengan pong.',
  async execute(message, args) {
    message.reply('Pong!');
  }
}
