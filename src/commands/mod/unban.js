const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from the server")
    .addStringOption((option) =>
      option
        .setName("user_id")
        .setDescription("The ID of the user to unban")
        .setRequired(true)
    ),

  async execute(client, interaction) {
    // Acknowledge the interaction immediately to avoid timeout
    await interaction.deferReply();

    const userId = interaction.options.getString("user_id");

    // Check if the user has the required permissions
    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return interaction.editReply({
        content: "You don't have permission to unban members.",
        ephemeral: true,
      });
    }

    // Try to unban the user
    try {
      // Fetch the ban list and check if the user is banned
      const banList = await interaction.guild.bans.fetch();
      const ban = banList.get(userId);

      if (!ban) {
        return interaction.editReply({
          content: "This user is not banned.",
          ephemeral: true,
        });
      }

      // Unban the user
      await interaction.guild.members.unban(userId);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("User Unbanned")
        .setDescription(`Successfully unbanned <@${userId}>.`)
        .setTimestamp();

      // Send confirmation after the operation is complete
      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: `There was an error trying to unban the user. Error: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};
