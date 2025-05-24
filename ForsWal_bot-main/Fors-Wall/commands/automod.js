const { usage } = require("./clear");

const badWords = ['bodoh', 'anjing', 'bangsat','kontol','memek','ngentot','ngentod',];

module.exports = {
  name: 'automod',
  description: 'Otomatis mendeteksi spam, kata       kasar, atau pelanggaran aturan lainnya.',
  category: 'Moderation',
  usage: 'automod',

  execute(message) {
    if (badWords.some(w => message.content.toLowerCase().includes(w))) {
      message.delete();
      message.channel.send(`${message.author}, bahasa kamu tidak sopan!`);
    }
  }
};
