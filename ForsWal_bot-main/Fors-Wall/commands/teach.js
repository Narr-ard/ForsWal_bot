const fs = require('fs');
const file = './data/learned.json';

module.exports = {
  name: 'teach',
  description: 'Mengajari bot menjawab kalimat       tertentu.',
  category: 'Auto Learning',

  execute(message, args) {
    const input = args.join(' ').split('=');
    if (input.length !== 2) return message.reply('Format: `!teach pertanyaan = jawaban`');

    const question = input[0].trim().toLowerCase();
    const answer = input[1].trim();

    let data = {};
    if (fs.existsSync(file)) data = JSON.parse(fs.readFileSync(file));
    data[question] = answer;
    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    message.reply(`Aku belajar jawaban dari: "${question}"`);
  }
};
