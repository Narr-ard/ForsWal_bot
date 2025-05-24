module.exports = {
  name: 'tarot',
  description: 'Tarot misterius ala Lord of the Mysteries',
  async execute(message) {
    const tarot = [
      "🃏 The Fool – Awal baru, rahasia tersembunyi.",
      "👑 The Emperor – Kekuatan dan otoritas. Waktunya ambil alih.",
      "🌙 The High Priestess – Intuisi, rahasia, dan pengetahuan dalam.",
      "🌟 The Star – Harapan dan bimbingan ilahi.",
      "🔥 The Tower – Perubahan drastis akan datang."
    ];
    const hasil = tarot[Math.floor(Math.random() * tarot.length)];
    return message.reply(`🔮 Hasil taro-mu: ${hasil}`);
  }
};
