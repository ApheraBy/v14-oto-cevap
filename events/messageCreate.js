const db = require("croxydb");
const { Client, Message } = require("discord.js");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = async (client, message) => {
    let msg = db.fetch(`otomesaj_${message.content}${message.guildId}`);
    if(message.author.bot) return;
    if(!message.guild) return;

    if(msg) {
        if(message.content === msg.modalMessage) {
            return message.reply({ content: msg.modalCreate.toString() })
        }
    }
}