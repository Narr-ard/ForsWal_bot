module.exports = {
  name: 'nasib',
  description: 'Ramalan nasib harian dari Fors',
  async execute(message) {
    const nasib = [
      "Hari ini akan berjalan penuh misteri, tapi akhir yang baik menantimu.",
      "Seseorang diam-diam memperhatikanmu, dengan niat baik.",
      "Keputusan impulsif hari ini bisa mengubah jalan takdirmu.",
      "Keberuntungan mengikuti mereka yang berani mengambil langkah pertama.",
      "Kendalikan emosi... seseorang sedang menguji kesabaranmu."
    ];
    const hasil = nasib[Math.floor(Math.random() * nasib.length)];
    return message.reply(`🔮 Ramalan nasibmu: ${hasil}`);
  }
};
