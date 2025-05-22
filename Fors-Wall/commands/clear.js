module.exports = {
  name: 'clear',
  description: 'Menghapus sejumlah pesan dalam       channel.',
  category: 'Moderation',
  usage: '<jumlah>',
  async execute(message, args) {
    if (!message.member.permissions.has('ManageMessages'))
      return message.reply('Kamu tidak punya izin untuk menghapus pesan.');
    const count = parseInt(args[0]);
    if (!count || count < 1 || count > 100)
      return message.reply('Masukkan angka antara 1-100.');
    await message.channel.bulkDelete(count, true);
    message.channel.send(`🧹 ${count} pesan dihapus.`).then(msg => {
      setTimeout(() => msg.delete(), 3000);
    });
  }
};
