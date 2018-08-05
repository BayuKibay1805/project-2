const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./server.js', {
  token: process.env.TOKEN
})
Manager.spawn(1); // This example will spawn 2 shards (5,000 guilds);

Manager.on('launch', shard => {
  console.log(`[${new Date().toISOString()}] Launched shard #${shard.id}`)
})

Manager.on('message', (shard, message) => {
  console.log(`[${new Date().toISOString()}] #${shard.id} | ${message._eval} | ${message._result}`)
})
