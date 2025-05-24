module.exports = {
  name: 'help',
  description: 'Menampilkan semua perintah berdasarkan kategori.',
  category: 'Utility',
  async execute(message, args, client) {
    const categories = {};

   client.commands.forEach(command => {
  if (command.hidden) return; // Abaikan hidden commands
  const category = command.category || 'Lainnya';
  if (!categories[category]) categories[category] = [];
  categories[category].push(`**!${command.name}** — ${command.description || 'Tidak ada deskripsi.'}`);
});

    const embedFields = Object.entries(categories).map(([category, commands]) => ({
      name: `📂 ${category}`,
      value: commands.join('\n'),
      inline: false
    }));

    const embed = {
      color: 0x00bfff,
      title: '📖 Daftar Perintah Bot Berdasarkan Kategori',
      fields: embedFields,
      footer: {
        text: 'Gunakan awalan "!" seperti !kick, !poll, !teach, dst.',
      },
      timestamp: new Date()
    };

    message.channel.send({ embeds: [embed] });
  }
};
