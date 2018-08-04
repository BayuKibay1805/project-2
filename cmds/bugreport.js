const Discord = require('discord.js');

exports.run = (client, message, args) => {
    var bug = args.slice(0).join(" ")
    if(!bug) return message.reply("**Please describe a bug you was found!**");
    let report = new Discord.RichEmbed()
	  .setColor(0x8DB8DA)
	  .setAuthor('Incoming Bug Report')
  	.addField('Bug :', bug)
  	.addField('Report by :', `${message.author.tag}`)
    .setTimestamp()
    .setFooter('Bug Report Feature' );  	
	
        client.guilds.get("471060265694134282").channels.get("472486196564459551").send(report)
	message.delete();
      let reply= new Discord.RichEmbed()
	    .setColor(0x8DB8DA)
	    .setAuthor('Success')
      .setDescription('Thanks you for your report, we\'ll fix it soon. Your report was send to Bot Creator!')
      .setTimestamp()
      .setFooter('Bug Report Feature' );
    	message.channel.send(reply);
}

exports.help = {
    name: "bugreport",
    category: "utility",
    alliases: "bug"
}