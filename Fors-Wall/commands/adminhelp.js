module.exports = {
  name: 'adminhelp',
  description: 'Daftar semua perintah, termasuk yang tersembunyi (khusus pemilik)',
  async execute(message, args, client) {
    if (message.author.id !== process.env.CREATOR_ID) {
      return message.reply('Hanya untuk kekasihku...');
    }

    const cmds = client.commands.map(cmd => `**!${cmd.name}** - ${cmd.description}`).join('\n');
    return message.reply(`Semua perintah yang tersedia:\n${cmds}`);
  }
};
