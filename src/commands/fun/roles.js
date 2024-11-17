const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Get All Roles")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select The User")
        .setRequired(false)
    ),
  async execute(client, interaction) {
    const selectedUser = interaction.options.getUser("user") || null;
    const guildId = interaction.guildId;


    if (selectedUser) {
      const user = interaction.guild.members.cache.get(selectedUser.id);

      const roleList = user.roles.cache
        .filter((role) => role.name !== "@everyone")
        .map((role) => `<@&${role.id}>`)
        .join("\n");

      // Embed for the user's roles
      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(`${selectedUser.username}'s Roles`)
        .setDescription(roleList || "No roles assigned")
        .setFooter({ text: "Requested by " + interaction.user.username });

      return interaction.reply({ embeds: [embed] });
    }
    else if (guildId) {
      const roles = interaction.guild.roles.cache;

      const roleList = roles
        .filter((role) => role.name !== "@everyone")
        .map((role) => `<@&${role.id}>`)
        .join("\n");

      // Embed for all roles
      const embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("All Roles in this Server")
        .setDescription(roleList || "No roles available")
        .setFooter({ text: "Requested by " + interaction.user.username });

      return interaction.reply({ embeds: [embed] });
    }
  },
};
