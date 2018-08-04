const Discord = require('discord.js');

exports.run = async (bot, message, args) => {
    
  let bicon = bot.user.displayAvatarURL;
  let hembed = new Discord.RichEmbed()
  .setColor(0xe55EA2)
  .setThumbnail(bicon)
  .setTitle("Hello🙃", bicon)
  .setDescription("Thanks for using me, my music command is :")
  .addField('♜ Bot Creator', '\`reboot\`, \`shutdown\`, \`eval\`, \`reload\`')
  .addField('♫ Music', '\`play\`, \`skip\`, \`pause\`, \`resume\`, \`queue\`, \`stop\`, \`leave\`, \`volume\`')
  .addField('✎ Info', '\`ping\`, \`botinfo\`, \`stats\`')
  .addField('Support', '\`bugreport\`, \`botinvite\`')
  .addField("**Link**", "[Invite me](https://discordapp.com/oauth2/authorize?client_id=471757779091193856&scope=bot&permissions=66583616) | [Support Server](https://discord.gg/9YvnafC)")
  .setTimestamp()
  .setFooter(`Request by : ${message.author.username} `);
  message.channel.send(hembed);  
} 