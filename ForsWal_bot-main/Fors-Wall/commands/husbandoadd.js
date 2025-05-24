const fs = require('fs');
const file = './data/husbandos.json';

module.exports = {
  name: 'addhusbando',
  execute(message, args) {
    const name = args.join(' ');
    if (!name) return message.reply('Tulis nama husbando.');

    let list = [];
    if (fs.existsSync(file)) list = JSON.parse(fs.readFileSync(file));
    list.push(name);
    fs.writeFileSync(file, JSON.stringify(list, null, 2));

    message.reply(`Husbando "${name}" ditambahkan!`);
  }
};
