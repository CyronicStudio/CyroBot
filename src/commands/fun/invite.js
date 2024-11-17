const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite In Your Server"),

  async execute(client, interaction) {
    const inviteLink =
      "https://discord.com/oauth2/authorize?client_id=1306500766231564348&permissions=8&integration_type=0&scope=bot+applications.commands";

    try {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle(`Invite Link`)
        .setDescription(`**[INVITE](${inviteLink})**`)
        .setFooter({ text: `Requested by ${interaction.user.tag}` });

      interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`Error`)
        .setDescription(`An error occurred: ${error}`)
        .setFooter({ text: `Requested by ${interaction.user.tag}` });

      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
