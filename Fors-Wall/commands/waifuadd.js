const fs = require('fs');
const file = './data/waifus.json';

module.exports = {
  name: 'addwaifu',
  execute(message, args) {
    const name = args.join(' ');
    if (!name) return message.reply('Tulis nama waifu.');

    let list = [];
    if (fs.existsSync(file)) list = JSON.parse(fs.readFileSync(file));
    list.push(name);
    fs.writeFileSync(file, JSON.stringify(list, null, 2));

    message.reply(`Waifu "${name}" ditambahkan!`);
  }
};
