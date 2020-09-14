const Discord = require("discord.js");
const zion = new Discord.Client();
const timers = require('timers')
const config = require('./config.json')
const welcome_channel = config.welcome_channel    
const leave_channel = config.leave_channel
const default_welcome = config.default_welcome
const default_leave = config.default_leave
const emojiID = config.embed_emoji
const logc = config.logchannel
const logc2 = config.logchannel2
const activity1 = config.activity1
const type1 = config.type1
const activity2 = config.activity2
const type2 = config.type2
const activity3 = config.activity3
const type3 = config.type3
const time1 = config.activitytime
const ownerID = config.ownerID
const customtext = config.customtext
//const etitle = config.embed_title
const guildconfig = config.embed_guildname
const ecolor = config.embed_color
const moment = require('moment');

////////////////////////////////////////////////////
/* If you are self hostig delete these lines and   /
add   "token": "Your_Token",                       /
      "prefix": "Your_Prefix",                     /
in the config.json */                              
const prefix = "z>";                   
const token = process.env.BOT_TOKEN;               
////////////////////////////////////////////////////

//Activites Const
let activities = [
  {
    name:`${activity1}`,
    options:{
      type:`${type1}`
    }
  },
  {
    name:`${activity2}`,
    options:{
      type:`${type2}`
    }
  },
  {
    name: `${activity3}`,
    options:{
      type:`${type3}`
    }
  }
]
let i = 0;
//On Ready
  zion.on('ready', () => {
    console.log(`${zion.user.username} has started, with ${zion.users.size} users, in ${zion.channels.size} channels of ${zion.guilds.size} guilds.`);
    timers.setInterval(() => {
      i = i == activities.length ? 0 : i
      zion.user.setActivity(activities[i].name, activities[i].options)
      i++
    }, time1)
  });

// Initialize the invite cache
/*const invites = {};
const wait = require('util').promisify(setTimeout);
  wait(1000); 

//////////////////////////////***SERVER INVITES CACHE FEATURE***////////////////////////////////////////////////
/* This event is required for loading all invites for all guilds and saving them to the cache. */
	
  /*zion.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });*/
// });

//////////////////////////////***MEMBER JOINED INVITE LOG***////////////////////////////////////////////////
/* This event logs what invte code was used when a member joins the server */
//zion.on('guildMemberAdd', member => {
  // To compare, we need to load the current invite list.
  //member.guild.fetchInvites().then(guildInvites => {
    // This is the *existing* invites for the guild.
    //const ei = invites[member.guild.id];
    // Update the cached invites for the guild.
   // invites[member.guild.id] = guildInvites;
    // Look through the invites, find the one for which the uses went up.
    //const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    // This is just to simplify the message being sent below (inviter doesn't have a tag property)
    //const inviter = zion.users.get(invite.inviter.id);
    // Get the log channel (change to your liking)
   // const logChannel = member.guild.channels.find(channel => channel.name === "invite-logs");
    // A real basic message with the information we need. 
 /*let iEmbed = new Discord.RichEmbed()
   .setTitle("Paradise Invite Logs", zion.user.avatarURL)
   .setDescription(`<@${member.user.id}> Has joined our Server!!`)
   .addField("Member Tag", `${member.user.tag}`, true)
   .addField("Invite Code", `https://www.discord.gg/${invite.code}`, true)
   .addField("Invited By", `<@${inviter.id}>`, true)
   .addField("Code Used ", `${invite.uses} times since its creation.`, true)
   .setFooter("© Zion");
   logChannel.send(iEmbed);
  });
 });*/

/*const serverStats = {
  guildID: '603841199488368660',
  totalUsersID: '615877512626700309',
  memberCountID: '615877517269663774',
  botCountID: '615877519303901190'
}
 
zion.on('guildMemberAdd', member => {
  if (member.guild.id !== serverStats.guildID) return;
  zion.channels.get(serverStats.totalUsersID).setName(`Total: ${member.guild.memberCount}`);
  zion.channels.get(serverStats.memberCountID).setName(`Users: ${member.guild.members.filter(m => !m.user.bot).size}`);
  zion.channels.get(serverStats.botCountID).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
 
  var userGot = new Discord.RichEmbed()
    .setColor(0x555555)
    .setDescription("User got")
    .setTitle(member.tag);
  
});*/

zion.on('guildMemberAdd', member => {
  console.log('User' + member.user.tag + 'has joined the server!');
 
  const role = member.guild.roles.find('name', 'Members');
  const role2 = member.guild.roles.find("name", "Bots in Queue")
  if(member.user.bot) { 
  return member.addRole(role2)
  }
  if(!member.user.bot) {
  return member.addRole(role);
  }
});

  //On Message
  zion.on("message", async message =>{
  if (message.content === `${prefix}add`)
  zion.emit('guildMemberAdd', message.member);

  if (message.content === `${prefix}remove`)
  zion.emit('guildMemberRemove', message.member);

   if (message.content === `${prefix}ping`)
  message.channel.send(`Hoold on!`).then(m => {
    m.edit(
      `:ping_pong: Wew, made it over the ~waves~ ! **Pong!**\nMessage edit time is ` +
        (m.createdTimestamp - message.createdTimestamp) +
        `ms, Discord API heartbeat is ` +
        Math.round(zion.ping) +
        `ms.`
       );
    });
 });

//////////////////////////////////////////////////SUPPORT SERVER ONLY/////////////////////////////////////////////////////////
  zion.on('guildMemberAdd', member => {
  let count = member.guild.memberCount.toString() 
  let end = count[count.length-1]
  let suffixed = end == 1 ? count + "st" : end == 2 ? count + "nd" : end == 3 ? count + "rd" : count + "th" 
  const channel = member.guild.channels.find(chnl => chnl.name === "greetings");
  const memberavatar = member.user.displayAvatarURL
     if (!channel) {
        console.log("Set channel name in config.");
        return;
      };
      const guildspot = guildconfig || member.guild
      const emojispot = ` ` || `${emojiID}`
      let rules = member.guild.channels.find("id", "748977820784394244")
      let str = `Welcome to **${guildspot}**! <@${member.user.id}>!, Make sure you read the ${rules} channel :thumbsup: and enjoy your stay`
      const embed = new Discord.RichEmbed()
      .setTitle("Member Joined :thinking:")
      .setDescription(str)
      .addField("User Tag", `${member.user.tag}`, true)
      .addField("User ID", `${member.user.id}`, true)
      .addField("You Are The", `${suffixed} Member`, true)
      .addField('Joined Discord', `${moment(member.user.createdAt).toString().substr(0, 15)}\n(${moment(member.user.createdAt).fromNow()})`, true)
      .addField('Joined Server', `${moment(member.user.joinedAt).toString().substr(0, 15)}\n(${moment(member.user.joinedAt).fromNow()})`, true)   
      .setThumbnail(memberavatar)
      .setFooter("© Paradise Bot List")
      .setTimestamp();
      channel.send(embed);
  
  const logs = member.guild.channels.find(chnl => chnl.name === `${logc}`);
  logs.send(`> :inbox_tray: ${member} has Joined ${member.guild.name}.`)
});

zion.on('guildMemberRemove', member => {
  let count = member.guild.memberCount.toString() 
  let end = count[count.length-1]
  let suffixed = end == 1 ? count + "st" : end == 2 ? count + "nd" : end == 3 ? count + "rd" : count
  const channel = member.guild.channels.find(chnl => chnl.name === "greetings");
  const memberavatar = member.user.displayAvatarURL
     if (!channel) {
        console.log("Set channel name in config.");
        return; 
      }; 
      const guildspot = guildconfig || member.guild
      const emojispot = ` ` || `${emojiID}`
      let str = `RIP ${member.user.tag}! Just left the server :wave: :wave:`
      const embed2 = new Discord.RichEmbed()
      .setTitle("Member Left :shrug:")
      .setColor(ecolor)
      .setDescription(str)
      .setURL("https://discord.gg/u45VhbZ")
      .addField("User Tag", `${member.user.tag}`, true)
      .addField("User ID", `${member.user.id}`, true)
      .addField("We Now Have", `${suffixed} Members`, true)
      .addField('Joined Discord', `${moment(member.user.createdAt).toString().substr(0, 15)}\n(${moment(member.user.createdAt).fromNow()})`, true)
      .addField('Joined Server', `${moment(member.user.joinedAt).toString().substr(0, 15)}\n(${moment(member.user.joinedAt).fromNow()})`, true)   
      .setThumbnail(memberavatar)
      .setFooter("© Paradise Bot List")
      .setTimestamp();
      channel.send(embed2);

  const logs = member.guild.channels.find(chnl => chnl.name === `${logc}`);
  logs.send(`> :outbox_tray: ${member} has left ${member.guild.name}.`)
});

zion.login("NzI4NDEwMjEzNzkwNjQ2MzM2.Xv6AKQ.H88gBxDcD6ZuNXpJ8iQMxuUYVys");
