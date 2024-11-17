const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user in the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to timeout")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for timing out the user")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration for the timeout in minutes (optional)")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    const targetUser = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") || "No reason provided";
    const duration = interaction.options.getInteger("duration");

    // Ensure the bot has fully loaded its member object
    const botMember = await interaction.guild.members.fetch(client.user.id);

    // Check if the user has the required permissions
    if (!interaction.member.permissions.has("MUTE_MEMBERS")) {
      return interaction.reply({
        content: "You don't have permission to timeout members.",
        ephemeral: true,
      });
    }

    // Check if the bot has the required permissions
    if (!botMember.permissions.has("MUTE_MEMBERS")) {
      return interaction.reply({
        content: "I don't have permission to timeout members.",
        ephemeral: true,
      });
    }

    // Find the target member
    const targetMember = await interaction.guild.members.fetch(targetUser.id);

    if (!targetMember) {
      return interaction.reply({
        content: `Could not find the user ${targetUser.tag}.`,
        ephemeral: true,
      });
    }

    // Timeout the user
    try {
      await targetMember.timeout(
        duration ? duration * 60 * 1000 : null,
        reason
      ); // Timeout in milliseconds if duration is set
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("User Timed Out")
        .addFields(
          { name: "Timed Out User", value: targetUser.tag },
          { name: "Reason", value: reason },
          {
            name: "Duration",
            value: duration ? `${duration} minutes` : "Permanent",
          }
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply({
        content: `Failed to timeout ${targetUser.tag}. Error: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};
