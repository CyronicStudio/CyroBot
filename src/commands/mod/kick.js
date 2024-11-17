const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for kicking the user")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    const targetUser = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    // Ensure the bot has fully loaded the member object
    const botMember = await interaction.guild.members.fetch(client.user.id);

    // Check if the user has the required permissions
    if (!interaction.member.permissions.has("KICK_MEMBERS")) {
      return interaction.reply({
        content: "You don't have permission to kick members.",
        ephemeral: true,
      });
    }

    // Check if the bot has the required permissions
    if (!botMember.permissions.has("KICK_MEMBERS")) {
      return interaction.reply({
        content: "I don't have permission to kick members.",
        ephemeral: true,
      });
    }

    try {
      // Attempt to fetch the target member to ensure they exist in the guild
      const targetMember = await interaction.guild.members.fetch(targetUser.id);

      // Kick the user
      await targetMember.kick(reason);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("User Kicked")
        .addFields(
          { name: "Kicked User", value: targetUser.tag },
          { name: "Reason", value: reason }
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      // Handle if the member is not found or can't be fetched
      if (error.code === 10007) {
        return interaction.reply({
          content: `User ${targetUser.tag} is not in the server.`,
          ephemeral: true,
        });
      }

      // Handle other errors
      return interaction.reply({
        content: `Failed to kick ${targetUser.tag}. Error: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};
