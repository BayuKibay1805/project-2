const Discord = require('discord.js');

exports.run = async (bot, message, args) => {
    
  let bicon = bot.user.displayAvatarURL;
  let hembed = new Discord.RichEmbed()
  .setColor(0x8DB8DA)
  .setThumbnail(bicon)
  .setTitle("Hii:)", bicon)
  .setDescription("Thanks to invite me to you\'r guild🙃")
  .addField("**Link**", "[Invite me](https://discordapp.com/oauth2/authorize?client_id=471757779091193856&scope=bot&permissions=66583616) | [Support Server](https://discord.gg/ATRzssp)")
  .setTimestamp()
  .setFooter(`Request by : ${message.author.username} `);
  message.channel.send(hembed);
} 