const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to ban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for banning the user")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    const targetUser = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    // Check if the user has the required permissions
    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return interaction.reply({
        content: "You don't have permission to ban members.",
        ephemeral: true,
      });
    }

    // Check if the bot has the required permissions
    if (!interaction.member.permissions.has("BAN_MEMBERS")) {
      return interaction.reply({
        content: "I don't have permission to ban members.",
        ephemeral: true,
      });
    }

    // Try to ban the user
    try {
      await interaction.guild.members.ban(targetUser, { reason });
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("User Banned")
        .addFields(
          { name: "Banned User", value: targetUser.tag },
          { name: "Reason", value: reason }
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply({
        content: `Failed to ban ${targetUser.tag}. Error: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};
