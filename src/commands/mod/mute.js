const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user in the server")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to mute")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for muting the user")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    const targetUser = interaction.options.getUser("target");
    const reason =
      interaction.options.getString("reason") || "No reason provided";

    // Fetch the bot's member object
    const botMember = await interaction.guild.members.fetch(client.user.id);

    // Check if the user has the required permissions
    if (!interaction.member.permissions.has("MUTE_MEMBERS")) {
      return interaction.reply({
        content: "You don't have permission to mute members.",
        ephemeral: true,
      });
    }

    // Check if the bot has the required permissions
    if (!botMember.permissions.has("MUTE_MEMBERS")) {
      return interaction.reply({
        content: "I don't have permission to mute members.",
        ephemeral: true,
      });
    }

    // Defer the reply if it will take some time to process
    await interaction.deferReply();

    // Then process the mute action
    try {
      const targetMember = await interaction.guild.members.fetch(targetUser.id);
      await targetMember.voice.setMute(true, reason);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("User Muted")
        .addFields(
          { name: "Muted User", value: targetUser.tag },
          { name: "Reason", value: reason }
        )
        .setTimestamp();

      // Edit the reply after processing
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply({
        content: `Failed to mute ${targetUser.tag}. Error: ${error.message}`,
        ephemeral: true,
      });
    }
  },
};
