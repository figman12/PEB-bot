require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const WEBHOOK_URL = process.env.WEBHOOK_URL;

client.on('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // !report @user reason
  if (message.content.startsWith('!report')) {
    const args = message.content.split(' ').slice(1);

    if (args.length < 2 || !message.mentions.users.first()) {
      return message.reply('Usage: `!report @user <reason>`');
    }

    const reportedUser = message.mentions.users.first();
    const reason = args.slice(1).join(' ');

    const embed = {
      title: '🚨 User Report',
      color: 0xff0000,
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: 'Reporter',
          value: `${message.author.tag} (${message.author.id})`,
          inline: false
        },
        {
          name: 'Reported User',
          value: `${reportedUser.tag} (${reportedUser.id})`,
          inline: false
        },
        {
          name: 'Reason',
          value: reason,
          inline: false
        }
      ],
      footer: {
        text: `Guild: ${message.guild.name}`,
      }
    };

    try {
      await axios.post(WEBHOOK_URL, {
        embeds: [embed]
      });
      message.reply('✅ Report sent successfully.');
    } catch (err) {
      console.error('❌ Failed to send report:', err.message);
      message.reply('❌ Error sending report.');
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
