const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const {
  joinVoiceChannel,
  createAudioResource,
  createAudioPlayer,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const downloadYouTubeAudio = require("../../utils/downloadMusicFIle");

const queueMap = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song in the voice channel")
    .addStringOption((option) =>
      option.setName("url").setDescription("Audio URL").setRequired(true)
    ),

  async execute(client, interaction) {
    const url = interaction.options.getString("url");

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "❌ You need to be in a voice channel to play music."
            ),
        ],
      });
    }

    await interaction.deferReply();

    const guildId = interaction.guild.id;

    if (!queueMap.has(guildId)) {
      queueMap.set(guildId, {
        connection: null,
        player: createAudioPlayer(),
        queue: [],
        isPlaying: false,
      });
    }

    const guildQueue = queueMap.get(guildId);

    if (!guildQueue.connection) {
      guildQueue.connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      guildQueue.connection.on(VoiceConnectionStatus.Disconnected, () => {
        queueMap.delete(guildId);
      });

      guildQueue.connection.on(VoiceConnectionStatus.Ready, () => {
        console.log("The bot has connected to the channel.");
      });
    }

    const audioPath = await downloadYouTubeAudio(url);

    if (audioPath) {
      guildQueue.queue.push({
        title: "YouTube Audio",
        path: audioPath,
        deleteAfterPlay: true,
      });

      interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle("🎶 Song Added to Queue")
            .setDescription(`**Audio from the provided URL** ${url}`),
        ],
      });

      if (!guildQueue.isPlaying) {
        playNextSong(guildQueue);
      }
    } else {
      interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ Failed to download audio from the URL."),
        ],
      });
    }
  },
};

function playNextSong(guildQueue) {
  if (guildQueue.queue.length === 0) {
    guildQueue.isPlaying = false;
    guildQueue.connection.destroy();
    queueMap.delete(guildQueue);
    return;
  }

  guildQueue.isPlaying = true;
  const currentSong = guildQueue.queue.shift();
  const resource = createAudioResource(currentSong.path);

  guildQueue.player.play(resource);
  guildQueue.connection.subscribe(guildQueue.player);

  guildQueue.player.on(AudioPlayerStatus.Idle, () => {
    console.log(`Finished playing: ${currentSong.title}`);

    // Delete the audio file if needed
    if (currentSong.deleteAfterPlay) {
      fs.unlink(currentSong.path, (err) => {
        if (err) console.error(`Failed to delete file: ${currentSong.path}`);
        else console.log(`Deleted file: ${currentSong.path}`);
      });
    }

    playNextSong(guildQueue);
  });

  guildQueue.player.on("error", (error) => {
    console.error(`Error with audio player: ${error.message}`);
    playNextSong(guildQueue);
  });

  console.log(`Now playing: ${currentSong.title}`);
}
