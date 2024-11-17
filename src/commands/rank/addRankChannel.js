const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs").promises;
const path = require("path");

const filePath = path.resolve(__dirname, "../../db/ranks.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-rank-channel")
    .setDescription("Add A Rank Annotation Channel For Giving Alerts")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Rank Annotation Channel")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    const channel = interaction.options.getChannel("channel");
    
    console.log(channel);

    if (!channel) {
      return interaction.reply("Invalid Channel");
    }

    const data = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(data);
    const myUserData = jsonData.users[interaction.user.id];
    console.log(myUserData);

    if (!myUserData) {
      return interaction.reply("You are not a registered user.");
    }
    else
    {
        if (myUserData.rankAnnotationChannelId === channel.id) {
          return interaction.reply("This channel is already added as a rank annotation channel.");
        }  
        else{
            myUserData.rankAnnotationChannelId = channel.id;
            jsonData.users[interaction.user.id] = myUserData;

            await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));

            channel.send("This Channel Is Selected For Rank Announcement")
            return interaction.reply("Rank annotation channel added successfully.");
        }
    }
  },
};
