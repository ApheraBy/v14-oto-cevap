const wixua = require("croxydb");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
module.exports = {
  name: "oto-cevap",
  description: "Botun pingini gösterir!",
  type: 1,
  options: [],
  run: async (client, interaction) => {

    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()

            .setLabel("Ekle")
            .setCustomId("ekle")
            .setStyle(3)
    )
    .addComponents(
        new ButtonBuilder()
            .setLabel("Sil")
            .setCustomId("sil")
            .setStyle(4)
    )
    .addComponents(
        new ButtonBuilder()
            .setLabel("Oto Mesajlar")
            .setCustomId("otomesaj")
            .setStyle(1)
    )
    const server = interaction.guild
    const embed = new EmbedBuilder()
    .setColor("4e6bf2")
    .setTitle("Oto Cevap")
    .setDescription("`・` Oto mesaj eklemek için **__Ekle__** butonuna bas\n`・` Oto mesaj silmek için **__Sil__** butonuna bas\n`・` Oto mesajları görmek için **__Oto Mesajlar__**")
    .setThumbnail(server.iconURL({ dynamic: true }))
    .setFooter({ text: "Wixua" })

    interaction.reply({embeds: [embed], components: [row]})
  }
}
