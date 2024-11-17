const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-info")
    .setDescription("Get Your Server Details..."),

  async execute(client, interaction) {
    const guild = interaction.guild;

    const textChannels = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildText
    ).size;
    const voiceChannels = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildVoice
    ).size;
    const categoryChannels = guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildCategory
    ).size;

    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle(`${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }) || "") // Add a default icon URL if needed
      .addFields(
        {
          name: "📊 Members",
          value: `${guild.memberCount.toLocaleString()}`,
        },
        {
          name: "📅 Creation Date",
          value: `${guild.createdAt.toLocaleDateString()}`,
        },
        { name: "🛡️ Roles", value: `${guild.roles.cache.size}`, inline: true },
        {
          name: "📁 Total Channels",
          value: `${
            guild.channels.cache.filter(
              (channel) => channel.type !== ChannelType.GuildCategory
            ).size
          }`,
        },
        { name: "Text Channels", value: `${textChannels}`, inline: true },
        { name: "Voice Channels", value: `${voiceChannels}`, inline: true },
        { name: "Categories", value: `${categoryChannels}`, inline: true },
        { name: "👑 Owner", value: `${owner}`, inline: true }
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp(); // Adds the current timestamp to the embed

    return interaction.reply({ embeds: [embed] });
  },
};
