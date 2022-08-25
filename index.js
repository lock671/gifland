const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const token = config.token;


const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: 32767,
});
module.exports = client;

require("./events/message.js")
require("./events/ready.js")

client.commands = new Collection();
client.aliases = new Collection();
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  console.log(`${files.length} Total Command!`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    console.log(`${props.help.name} Named Command Online!`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

fs.readdir("./events/", (err, files) => 
{
  if (err) return console.error;
  files.forEach((file) => 
  {
    if (!file.endsWith(".js")) 
      return;
    const evt = require(`./events/${file}`);
    let evtName = file.split(".")[0];
    console.log(`Loaded event '${evtName}'`);
    client.on(evtName, evt.bind(null, client));
  });
});


client.login(token); 



const getRandomGifAvatar = async (client) => {
            const targetGuild = client.guilds.cache.get('953643673483104327')
            const gifTargetChannel = targetGuild.channels.cache.get('968920064495599677')
            const normalTargetChannel = targetGuild.channels.cache.get('968920241155481710')

            if(!targetGuild || !gifTargetChannel || !normalTargetChannel) return console.log('no guild')

            await targetGuild.members.fetch({ force: true }).then(members => {

                let gifTargetMembers = members.filter(member => {
                    return member.user.displayAvatarURL({ dynamic: true }).endsWith('.gif')
                })

                let normalTargetMembers = members.filter(member => {
                    return member.user.displayAvatarURL({ dynamic: true }).endsWith('.webp')
                })

                if(!normalTargetMembers.size || !gifTargetMembers.size) return

                let gifRandUser = gifTargetMembers.random()
                let normalRandUser = normalTargetMembers.random()

                const { MessageEmbed } = require('discord.js')

                let gifEmbed = new MessageEmbed()
                    .setImage(gifRandUser.user.displayAvatarURL({ dynamic: true }))
                gifTargetChannel.send({ embeds: [gifEmbed] })

                let normalEmbed = new MessageEmbed()
                    .setImage(normalRandUser.user.displayAvatarURL())
                normalTargetChannel.send({ embeds: [normalEmbed] })
            })
        }
        setInterval(getRandomGifAvatar, 250 * 60, client)