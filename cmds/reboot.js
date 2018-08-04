const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  if (message.author.id !== '400330864124493825') return message.reply('Only My Creator Can Use This Command');

    let embed = new Discord.RichEmbed()
    .setTitle('🔄Rebooting . . .')
    .setColor('RANDOM');
    message.channel.send(embed)
    
    .then(message => client.destroy())
    .then(() => client.login(process.env.TOKEN))
 } 

exports.help = {
  name: "reboot",
  category: "creator",
  usage: "reboot"
  }