require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs").promises;
const handleCommands = require("./src/handlers/handleCommands");
const handleRank = require("./src/handlers/handleRank");

const TOKEN = process.env.BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildWebhooks,
  ],
});

handleCommands(client);

client.on("ready", (arg) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  await handleRank(message, client);
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    command.execute(client, interaction);
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: "An error occurred while executing the command.",
      ephemeral: true,
    });
  }
});
client.login(TOKEN);
