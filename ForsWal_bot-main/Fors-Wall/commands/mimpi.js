module.exports = {
  name: 'mimpi',
  description: 'Tafsir mimpi ala dunia LotM',
  async execute(message) {
    const mimpi = [
      "Kamu bermimpi kabut tebal... itu pertanda rahasia besar yang tersembunyi di sekitarmu.",
      "Sosok berjubah hitam muncul dalam tidurmu—dia membawa pesan dari masa depan.",
      "Melihat bintang di mimpimu menandakan harapan di tengah kekacauan.",
      "Kamu mendengar bisikan? Itu intuisi dalam dirimu yang ingin didengar.",
      "Air yang tenang dalam mimpi menandakan kedamaian setelah konflik batin."
    ];
    const hasil = mimpi[Math.floor(Math.random() * mimpi.length)];
    return message.reply(`💤 Tafsir mimpimu: ${hasil}`);
  }
};
