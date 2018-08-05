const Discord = require("discord.js");
const { Client, Util } = require('discord.js');
const { prefix } = require('./config');
const google_api_key = process.env.API
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const bot = new Discord.Client({disableEveryone: true});
const config = require("./config.json");
const client = new Discord.Client();
const fs = require("fs");
const youtube = new YouTube(google_api_key);
const queue = new Map();
const superagent = require('superagent');
const Canvas = require('canvas');
const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DBL_API, bot);

dbl.on('posted', () => {
  console.log('Server count posted!');
});

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
});

bot.on("ready", () => {
  console.log("I'm online bitch!");
});

bot.on("ready", () => {
    bot.user.setActivity("STREAMING");
    setInterval(() => {
       let status = [`music to ${bot.guilds.size} servers!`, `music to ${bot.users.size} users!`, `music with ${config.prefix}help`, `to ABUGE×OFFICIAL`]
       let random = Math.floor(Math.random() * status.length)
       bot.user.setGame(status[random], 'https://twitch.tv/kibay18');
       }, 15000);
});	

 bot.on("guildCreate", guild => {
    const liveJoin = bot.channels.get("475796303268544532"); //CHANGE TO YOUR CHANNEL-ID TO GET NOTIFICATIONS
    let liveJEmbed = new Discord.RichEmbed()
    .setColor(0xe55EA2)
    .setAuthor(bot.user.username, bot.user.avatarURL)
    .setTitle(`Your Bot Has Started Serving A Guild`)
    .addField('Guild Name :', `${guild.name}`)
    .addField('Guild ID :', `${guild.id}`)
    .setDescription(`Members Gained : ${guild.memberCount}`)
    liveJoin.send(liveJoin, liveJEmbed);
 });

 bot.on("guildDelete", guild => {
    const liveLeave = bot.channels.get("475796303268544532"); //CHANGE TO YOUR CHANNEL-ID TO GET NOTIFICATIONS
    let liveLEmbed = new Discord.RichEmbed()
    .setAuthor(bot.user.username, bot.user.avatarURL)
    .setTitle(`__*Your Bot Has Stopped Serving A Guild*__`)
    .addField('Guild Name :', `${guild.name}`)
    .addField('Guild ID :', `${guild.id}`)
    .setDescription(`Members Lost : ${guild.memberCount}`)
    liveLeave.send(liveLeave, liveLEmbed);
 });

bot.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(prefix)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(prefix.length)
	
	if (command === 'play'){
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('Sorry, you must be in Voice Channel before playing music:blush:');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I can`t connect, missing permissions:sad:');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('i can`t speak, missing permissions:sad:');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com|m.youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
						
			return	msg.delete().then(msg => msg.channel.send(`☑ Playlist: **${playlist.title}** has been added to the queue!`));
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					//let postMsg = await msg.channel.send('**🔎 Searching your song...**');
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0; 					
					let embed = new Discord.RichEmbed()
					.setColor(0xe55EA2)
					.setTitle('Song selection :')
					.setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`) 
 					.setFooter('Please provide a value to select one of the search results ranging from 1-10') 
					let msgtoDelete = await msg.channel.send({ embed: embed});
          setTimeout(() => {
        	//postMsg.edit(embed).then(msg => msg.delete(22000))
        				}, 2000);
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 22000,
							errors: ['time']
						});
            msgtoDelete.delete();
					} catch (err) {
						console.error(err);
						return msg.channel.send('❗ You don\'t enter a song number, request canceled!');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('⚠ I can`t find it.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
		
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('You`re not in Voice Channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return msg.channel.send('⏭ Skipping song');
				
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return msg.channel.send('⏹️ Stopping song and leaving channel');
				
	} else if (command === 'leave') {
		if (!msg.member.voiceChannel) return msg.channel.send('You\'re not in a Voice Channel!');
		if (!serverQueue) return msg.channel.send('I\'m not in Voice Channel');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Leave command has been used!');
		return msg.channel.send('👋 Leaving Channel now!');
				
	} else if (command === 'volume' || command === 'vol') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`🔊The current volume is: **${serverQueue.volume}**`);
		if (serverQueue.volume = args[1] > 100) return msg.channel.send("❗ Don\'t hurt yourself, ***Max. Volume is 100!***");
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100);
		let volembed = new Discord.RichEmbed()
		.setColor(0xe55EA2)
		.setFooter(`🔊 I set the volume to: ${args[1]}%`)
		return msg.channel.send(volembed)
		
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		let embed = new Discord.RichEmbed()
		.setColor(0xe55EA2)
		.setTitle("🎶 Now playing:")
		.setDescription(`**${serverQueue.songs[0].title}**`) 
		return msg.channel.send(embed);
		
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
    let index = 0; 
		let embed = new Discord.RichEmbed()
		.setColor(0xe55EA2)
		.setTitle("Song queue")
		.setDescription(`${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}`) 
		msg.channel.send(embed);
		
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
		
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`,
		durationh:  video.duration.hours,
		durationm:  video.duration.minutes,
		durations:  video.duration.seconds,
    room:       msg.member.voiceChannel.name,
    request:    msg.author,
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 100,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send(`☑ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
		
	let embed = new Discord.RichEmbed()
	.setColor(0xe55EA2)
	.setAuthor(`🎶 Start Playing`)
  	.setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  	.addField('Title', `__[${song.title}](${song.url})__`, true)
    	.addField('Request by', `${song.request}`, true)
    	.addField('Playing at', `${song.room}`, true)
  	.addField("Volume", `${serverQueue.volume}%`, true)
  	.addField("Duration", `${song.durationh}hr ${song.durationm}min ${song.durations}sec`, true)
  	.setFooter("📝 If bot is not playing a music, maybe the bot is restarting!")
	serverQueue.textChannel.send(embed);
}

bot.on("message", async message => {
	
	if (message.author.bot) return undefined;
	let prefix = config.prefix;
	if (!message.content.startsWith(prefix)) return undefined;

	let command = message.content.toLowerCase().split(' ')[0];
	command = command.slice(prefix.length);
	let args = message.content.slice(prefix.length).trim().split(" ");
	let cmd = args.shift().toLowerCase();
	
	try {
		let commandFile = require(`./cmds/${cmd}.js`);
		commandFile.run(bot, message, args);
	} catch (e) {
		console.log(e.message)
	} finally {
		console.log(`${message.author.username} using command ${cmd}`);
	}
});

bot.login(process.env.TOKEN);
