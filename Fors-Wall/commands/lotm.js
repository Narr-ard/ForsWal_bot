module.exports = {
  name: 'lotm',
  description: 'Fakta atau kutipan dari Lord of the Mysteries',
  async execute(message) {
    const fakta = [
      "“The Fool that doesn’t belong to this era.” – Klein Moretti",
      "Fors Wall adalah salah satu karakter yang bisa berpindah dunia dengan kekuatan menulis.",
      "Sefirah Castle adalah pusat kekuatan dari jalur Fool.",
      "Setiap Pathway memiliki 10 Sequence, semakin kecil angkanya, semakin tinggi kekuatannya.",
      "Kartu Tarot misterius sering muncul dalam ritual dalam cerita."
    ];
    const acak = fakta[Math.floor(Math.random() * fakta.length)];
    return message.reply(`📖 ${acak}`);
  }
};
