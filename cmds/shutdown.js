const {RichEmbed} = require("discord.js");
const config = require('../config.json');
exports.run = async (client, message, args) => {
 
if (message.author.id !== '400330864124493825') return message.reply('Only My Creator Can Use This Command');
  
  let embed = new RichEmbed()
  .setColor(config.red)
  .setTitle("Shutting down . . .")
  await message.channel.send(embed) 
 .then(message => client.destroy())
}; // end of code

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["boot off", "shutdown"],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reboot",
  category: "bot creator",
  description: "Shuts down the bot, unless running under pm2 or on an VPN/VPS bot will reboot automatically",
  usage: "reboot"
};