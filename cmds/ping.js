const Discord = require("discord.js");

exports.run = async (bot, message, args) => {
	
	let start = Date.now(); message.channel.send(':ping_pong:').then(message => { 
      message.delete();
        let diff = (Date.now() - start); 
        let API = (bot.ping).toFixed(2)
	
        let embed = new Discord.RichEmbed()
        .setTitle(`⏳ PINGING!`)
        .setColor(0xe55EA2)
        .addField("📶 Latency", `${diff}ms`, true)
        .addField("📱 API", `${API}ms`, true)
	message.channel.send(embed);
    });
 
	
}

exports.help = {
	name : "ping",
	category: "info"
}