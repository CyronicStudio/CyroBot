const fs = require("fs").promises;
const path = require("path");
const rankdb = require("../db/ranks.json");
const handleRankAlerts = require("./handleRankAlerts");
const rankdbpath = path.join(__dirname, "..", "db/ranks.json");

const handleRank = async (message, client) => {
  if (rankdb.users[message.author.id]) {
    let data;
    let rankdata;

    try {
      const dbContent = await fs.readFile(rankdbpath, "utf-8");
      data = JSON.parse(dbContent);

      rankdata = data.users[message.author.id];
    } catch (error) {
      console.log(error.message);
    }

    rankdata.xp += Math.floor(message.content.length / 3);

    if (rankdata.xp >= rankdata.nextlevelUp) {
      rankdata.currentLevel++;

      if (rankdata.rankAnnotationChannelId !== "") {
        const newMassage =
          `<@${message.author.id}>` + "Your Level is " + rankdata.currentLevel;
        const channel = client.channels.cache.get(
          rankdata.rankAnnotationChannelId
        );
        handleRankAlerts(newMassage, channel);
      }

      rankdata.nextlevelUp = Math.floor(rankdata.currentLevel * 10);
      rankdata.xp = 0;

      if (rankdata.currentLevel >= rankdata.nextRankUp) {
        rankdata.rank += 1;

        if (rankdata.rankAnnotationChannelId !== "") {
          const newMassage =
            `<@${message.author.id}>` + "Your Rank is " + rankdata.currentLevel;
          const channel = client.channels.cache.get(
            rankdata.rankAnnotationChannelId
          );
          handleRankAlerts(newMassage, channel);
        }

        rankdata.nextRankUp = Math.floor(rankdata.currentLevel * 15);
      }
    }

    data.users[message.author.id] = rankdata;

    try {
      await fs.writeFile(rankdbpath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(error.message);
    }
  }
};

module.exports = handleRank;
