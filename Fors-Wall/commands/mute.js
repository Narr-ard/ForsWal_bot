module.exports = {
  name: 'mute',
  description: 'Membisukan anggota agar tidak bisa   mengirim pesan sementara.',
  category: 'Moderation',

  async execute(message, args) {
    const member = message.mentions.members.first();
    if (!member) return message.reply('Sebutkan member yang ingin di-mute.');
    const time = parseInt(args[1]) || 10;
    await member.timeout(time * 1000);
    message.channel.send(`${member.user.tag} dimute selama ${time} detik.`);
  }
};
