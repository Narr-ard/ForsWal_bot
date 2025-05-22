module.exports = {
  name: 'ban',
  description: 'Memblokir (ban) anggota agar tidak   bisa kembali ke server.',
  category: 'Moderation',

  async execute(message, args) {
    if (!message.member.permissions.has('BanMembers'))
      return message.reply('Kamu tidak punya izin untuk ban.');
    const member = message.mentions.members.first();
    if (!member) return message.reply('Sebutkan member yang ingin di-ban.');
    await member.ban();
    message.channel.send(`${member.user.tag} telah di-ban.`);
  }
};
