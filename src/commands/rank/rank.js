const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs").promises;
const path = require("path");

const filePath = path.resolve(__dirname, "../../db/ranks.json");

module.exports = {
  data: new SlashCommandBuilder().setName("rank").setDescription("Get Rank"),
  async execute(client, interaction) {
    const user = interaction.user;

    try {
      let data;

      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        data = JSON.parse(fileContent);
      } catch (e) {
        if (e.code === "ENOENT") {
          data = { users: {} };
        } else {
          throw error;
        }
      }

      let userRank = data.users[user.id];

      if (userRank) {
        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Your Rank")
          .setDescription(
            `Hi ${user.username}, you are currently at level ${userRank.currentLevel} with rank points ${userRank.rank}. Next rank up in ${userRank.nextRankUp} points.`
          )
          .setFooter({ text: `Requested by ${interaction.user.tag}` });

        return interaction.reply({ embeds: [embed] });
      } else {
        userRank = {
          userId: user.id,
          username: user.username,
          currentLevel: 1,
          rank: 0,
          xp: 0,
          nextlevelUp: 10,
          nextRankUp: 50,
          rankAnnotationChannelId: "",
        };

        data.users[user.id] = userRank;

        await fs.writeFile(
          filePath,
          JSON.stringify(data, null, 2),
          function (err) {
            if (err) console.log(err);
            console.log("User data created successfully.");
          }
        );

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Rank")
          .setDescription(
            `Welcome to the server, ${user.username}! You have been ranked at level ${userRank.currentLevel}.`
          )
          .setFooter({ text: `Requested by ${interaction.user.tag}` });

        return interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      interaction.reply({
        content:
          "There was an error processing your rank. Please try again later.",
        ephemeral: true,
      });
      console.error(error.message);
    }
  },
};
