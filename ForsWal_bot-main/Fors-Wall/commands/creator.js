module.exports = {
  name: 'creator',
  description: 'Tampilkan siapa yang membuat bot ini.',
  category: 'Utility',
  async execute(message, args) {
    message.reply('Aku dibuat dengan cinta oleh **Narr** 🤖💙');
  }
}
