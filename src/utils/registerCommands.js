require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = [];

const commandFolders = fs.readdirSync(path.join(__dirname, "..", "commands"));

for (const commandFolder of commandFolders) {
  const commandFiles = fs
    .readdirSync(path.join(__dirname, "..", `commands/${commandFolder}`))
    .filter((file) => file.endsWith(".js"));

  for (const commandFile of commandFiles) {
    const command = require(`../commands/${commandFolder}/${commandFile}`);
    commands.push(command.data.toJSON());
  }
}

const api = new REST({ version: "10" }).setToken("");

(async () => {
  try {
    console.log("Started refreshing application (/) commands globally.");
    await api.put(Routes.applicationCommands("1306500766231564348"), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands globally.");
  } catch (error) {
    console.log(error);
  }
})();
