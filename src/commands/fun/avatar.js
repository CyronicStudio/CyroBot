const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get Avatar")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select The User")
        .setRequired(false)
    ),
  async execute(client, interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    if (!user) return;

    try {
      const embed = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle(`${user.displayName}'s Avatar`)
        .setImage(
          user.displayAvatarURL({
            size: 1024,
            dynamic: true,
          })
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}` });

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor("red")
        .setTitle(`Error`)
        .setDescription(`An error occurred: ${error}`)
        .setFooter({ text: `Requested by ${interaction.user.tag}` });

      interaction.reply({ embeds: [embed] });
    }
  },
};
