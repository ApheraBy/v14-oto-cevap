// @ts-nocheck

const { Collection, EmbedBuilder, ModalBuilder , TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionType, messageLink} = require("discord.js");
const wixua = require("croxydb");
const { readdirSync } = require("fs");
const db = require("croxydb");
module.exports = async(client, interaction) => {

  if(!db.fetch(`cmds-${interaction.guildId}`)) {
    db.set(`cmds-${interaction.guildId}`, [])
  }

  const modal = new ModalBuilder()
.setCustomId('form')
.setTitle('Oto Mesaj Ekle')
  const a1 = new TextInputBuilder()
  .setCustomId('otomesaj')
  .setLabel('Oto mesaj ekle')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(2)
  .setPlaceholder('Ne tür oto mesaj cevabı eklemek istersin')
  .setRequired(true)
  const a2 = new TextInputBuilder()
  .setCustomId('otomatik')
  .setLabel('Otomatik verilecek mesaj')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(2)
  .setPlaceholder('Otomatik cevap verilecek mesaj?')
  .setRequired(true)
  const row = new ActionRowBuilder().addComponents(a1);
  const row2 = new ActionRowBuilder().addComponents(a2);
  
  modal.addComponents(row);
  modal.addComponents(row2);
client.on('interactionCreate', async (interaction) => {

	if(interaction.customId === "ekle"){
    await interaction.showModal(modal).catch(() => {});
  }
})  

const modal2 = new ModalBuilder()
.setCustomId('form1')
.setTitle('Oto Mesaj Sil')
  const a = new TextInputBuilder()
  .setCustomId('silmesaj')
  .setLabel('Oto mesaj sil')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(2)
  .setPlaceholder('Ne tür oto mesaj cevabı silmek istersin')
  .setRequired(true)
  const row1 = new ActionRowBuilder().addComponents(a);
  
  modal2.addComponents(row1);
client.on('interactionCreate', async (interaction) => {

	if(interaction.customId === "sil"){
    await interaction.showModal(modal2).catch(() => {});
  }
})

client.on('interactionCreate', async (interaction) => {
  if(interaction.type !== InteractionType.ModalSubmit) return
  if(interaction.customId === 'form') {

    let modalMessage = interaction.fields.getTextInputValue('otomesaj');
    let modalCreate = interaction.fields.getTextInputValue('otomatik');
    
    if(modalMessage.startsWith(":")) {
      return interaction.reply("böyle emoji bulamadım").catch(() => {})
    }

    const embed = new EmbedBuilder()
    .setDescription("Başarıyla eklendi")
    
    wixua.set(`otomesaj_${modalMessage}${interaction.guildId}`,  { modalMessage: modalMessage, modalCreate: modalCreate })


    await interaction.reply({ embeds: [embed], fetchReply: true, ephemeral: true}).then(() => {
      wixua.push(`cmds-${interaction.guildId}`, `${modalMessage}-${modalCreate}`)
    }).catch(() => {})
  }

  if(interaction.customId === 'form1') {

    let modalMessage = interaction.fields.getTextInputValue('silmesaj');

    const embed = new EmbedBuilder()
    .setDescription("Başarıyla silindi")


    await interaction.reply({ embeds: [embed], fetchReply: true, ephemeral: true}).then(() => {
      wixua.unpush(`cmds-${interaction.guildId}`, `${modalMessage}-${ wixua.fetch(`otomesaj_${modalMessage}${interaction.guildId}`).modalCreate}`)
      wixua.delete(`otomesaj_${modalMessage}${interaction.guildId}`)
    }).catch(() => {})
  }

})

client.on("interactionCreate", async interaction => {
  if(interaction.customId === "otomesaj") {

    const embed = new EmbedBuilder()
    .setAuthor({name: "Oto mesaj listesi", iconURL: interaction.user.avatarURL()})
    .setDescription(`${wixua.fetch(`cmds-${interaction.guildId}`).map(c => `${c.split("-")[0]} **-** ${c.split("-")[1]}`).join("\n")}\n`)
    .setFooter({text: "Wixua Tester"})

    interaction.reply({embeds: [embed], ephemeral: true}).catch(() => {})

  }

  })


  if(interaction.isChatInputCommand()) {
    if (!interaction.guildId) return;
    readdirSync('./commands').forEach(f => {
      const cmd = require(`../commands/${f}`);
      if(interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {
        return cmd.run(client, interaction, wixua);
      }
});
}
};
