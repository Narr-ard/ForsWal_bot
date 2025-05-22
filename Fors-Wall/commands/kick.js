module.exports = {
  name: 'kick',
  description: 'Kick member dari server.',
  category: 'Moderation',
  async execute(message, args) {
    if (!message.member.permissions.has('KickMembers'))
      return message.reply('Kamu tidak punya izin untuk kick.');
    const member = message.mentions.members.first();
    if (!member) return message.reply('Sebutkan member yang ingin di-kick.');
    await member.kick();
    message.channel.send(`${member.user.tag} telah di-kick.`);
  }
};
