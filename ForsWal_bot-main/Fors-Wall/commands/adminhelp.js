module.exports = {
  name: 'adminhelp',
  description: 'Perintah tersembunyi untuk pengembang atau kekasih bot.',
  hidden: true,
  category: 'Admin',
  async execute(message) {
    if (message.author.id !== process.env.CREATOR_ID) {
      return message.reply('Perintah ini bukan untukmu.');
    }

    return message.reply(`📁 Perintah Rahasia:
- !nsfw
- !nsfw doujin <id>
- !nsfw tag <tag>
- !nsfw search <keyword>
`);
  }
};
