const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const handleCommands = async (client) => {
  const commands = [];
  client.commands = new Collection();

  const commandFolders = fs.readdirSync(path.join(__dirname, "..", "commands"));

  for (const commandFolder of commandFolders) {
    const commandFiles = fs
      .readdirSync(path.join(__dirname, "..", `commands/${commandFolder}`))
      .filter((file) => file.endsWith(".js"));

    for (const commandFile of commandFiles) {
      const command = require(`../commands/${commandFolder}/${commandFile}`);

      if (!command.data) {
        console.log(`Command ${commandFile} does not export a valid command.`);
        continue;
      } else {
        client.commands.set(command.data.name, command);
        commands.push(command.data.name);
      }
    }
  }
};

module.exports = handleCommands;
