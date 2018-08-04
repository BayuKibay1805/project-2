exports.run = async (client, message, args) => {
    if (message.author.id !== '400330864124493825') return message.reply('**Only My Creator Can Use This Command**');
        if (!args || args.size < 1) return message.channel.send("Must provide a command name to reload.");
        delete require.cache[require.resolve(`./${args[0]}.js`)];
        message.channel.send(`**🔄 The command ${args[0]} has been reloaded**`)
    }