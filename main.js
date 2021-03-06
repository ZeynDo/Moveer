const Discord = require('discord.js');
const client = new Discord.Client();

// TOKEN
const config = require('./config.js');
const token = config.discordToken;

client.on('ready', () => {
  console.log(new Date().toLocaleTimeString() + ' - I am ready!');
});

// Listen for messages
client.on('message', message => {
  if (!message.content.startsWith(config.discordPrefix)) return;
  const args = message.content.slice(config.discordPrefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  if (command === 'move') {
    const userVoiceRoomID = message.member.voiceChannelID; // ID of the authors voice room
    const authorID = message.author.id; // The author ID
    const guild = message.guild; // The guild where the user sends its message
    const messageMentions = message.mentions.users.array(); // Mentions in the message
    const guildChannels = guild.channels.find(channel => channel.name === 'Moveer'); // Search for the voiceroom Moveer
    const usersInMoveeer = guildChannels.members; // The members ofthe Moveer voice room

    // Check for errors in the message
    // Make sure there's a voice room called Moveer
    if (guildChannels === null || guildChannels.members == undefined) {
      console.log(new Date().toLocaleTimeString() + ' - ' + message.guild.name + ' - No voice channel called Moveer');
      message.channel.send('Theres no voice channel named Moveer');
      return;
    }
    // Make sure the user @mentions someone
    if (args < 1) {
      message.channel.send('I think you forgot to @mention someone?' + '<@' + authorID + '>');
      console.log(new Date().toLocaleTimeString() + ' - ' + message.guild.name + ' - @Mention is missing ');
      return;
    }
    // Stop people from trying to move people into Moveer
    if (usersInMoveeer.has(authorID)){
      message.channel.send("You can't move people into this voice room " + '<@' + authorID + '>');
      console.log(new Date().toLocaleTimeString() + ' - ' + message.guild.name + ' - User trying to move people into Moveer');
      return;
    }

    // No errors in the message, try moving everyone in the @mention
    for (var i = 0; i < messageMentions.length; i++) {
      if (usersInMoveeer.has(messageMentions[i].id)) {
        console.log(new Date().toLocaleTimeString() + ' - ' + message.guild.name + ' - Moving a user');
        message.channel.send('Moving: ' + messageMentions[i] + '. By request of ' + '<@' + authorID + '>');
        guild.member(messageMentions[i].id).setVoiceChannel(userVoiceRoomID);
      } else {
        if (messageMentions[i].id === authorID) {
          // Stop people from trying to move themself
          message.channel.send("You can't move yourself.. :) " + messageMentions[i]);
          console.log(new Date().toLocaleTimeString() + ' - ' + message.guild.name + ' - User trying to move himself');
          return;
        }
        console.log(new Date().toLocaleTimeString() + ' - ' + message.guild.name + ' - User in wrong channel.');
        message.channel.send('Not moving: ' + messageMentions[i].username + '. Is the user in the correct voice channel? (Moveer)');
      }
    }
  }
});

client.login(token);
