module.exports = {
  name: 'poll',
  async execute(message, args) {
    const question = args.join(' ');
    if (!question) return message.reply('Tulis pertanyaan polling.');
    const poll = await message.channel.send(`📊 **${question}**\n👍 = Ya | 👎 = Tidak`);
    await poll.react('👍');
    await poll.react('👎');
  }
};
