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


/* INITIALIZE A CACHE TO HOUSE THE INVITES */

const invites = {};

const wait = require('util').promisify(setTimeout);
wait(1000);

zion.guilds.forEach(g => {
  g.fetchInvites().then(guildInvites => {
    invites[g.id] = guildInvites;
  });
});

zion.on('guildMemberAdd', member => {

/* TO COMPARE WE LOAD THE CURRENT INVITE LIST */
  member.guild.fetchInvites().then(guildInvites => {

    /* EXISTING INVITES FOR THE GUILD */
    const ei = invites[member.guild.id];

    /* UPDATE THE GUILDS CACHED INVITES */
    invites[member.guild.id] = guildInvites;

    /* SEARCH THE INVITES FOR THE ONE WHICH THE USE WENT UP */
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    
    /* SIMPLIFY THE MESSAGE BEING SENT BELOW (INVITER DOESNT HAVE A TAG PROPERTY) */
    const inviter = zion.users.get(invite.inviter.id);

    /* THIS IS THE LOG CHANNEL WE WANT TO SEND THE INVITE LOGS TO */
    const logChannel = member.guild.channels.find(c => c.name === 'invite-logs');

    /* EMBED START */
    let logEmbed = new Discord.RichEmbed()
        logEmbed.setTitle('Paradise Invite Logs')
        logEmbed.setDescription(`<@${member.user.id}> Has joined using the code below`)
        logEmbed.addField('Member Tag', `${member.user.tag}`, true)
        logEmbed.addField('Invite Code', `https://discord.gg/${invite.code}`, true)
        logEmbed.addField('Invited By', `<@${inviter.id}>`, true)
        logEmbed.addField('Code Used', `${invite.uses} Times since its creation.`, true)
        logEmbed.setFooter('© Zion | Paradise Bots LLC')

        logChannel.send(logEmbed);
  });
});


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
  const channel = member.guild.channels.find(chnl => chnl.name === "┊greetings");
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
  const channel = member.guild.channels.find(chnl => chnl.name === "┊greetings");
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
