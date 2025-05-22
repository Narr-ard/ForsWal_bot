const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'setautorole',
  description: 'Mengatur role yang akan diberikan otomatis ke member baru.',
  category: 'Moderation',
  async execute(message, args) {
    if (!message.member.permissions.has('ManageRoles')) {
      return message.reply('❌ Kamu tidak punya izin untuk mengatur role.');
    }

    const roleName = args.join(' ');
    if (!roleName) return message.reply('❗ Masukkan nama role yang ingin diatur.');

    const role = message.guild.roles.cache.find(r => r.name === roleName);
    if (!role) return message.reply('❗ Role tersebut tidak ditemukan di server.');

    const configPath = './data/config.json';
    const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {};
    config.autoRoleName = roleName;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    message.reply(`✅ Auto role telah diatur ke **${roleName}**`);
  }
};
