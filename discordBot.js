const { Client, Intents } = require("discord.js");
const { toHHMMSS, httpGet } = require("./utils");
require('dotenv').config();

// Add the intents your bot needs
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
});
const servers = [];

function start() {
  client.login(process.env.DISCORD_TOKEN);

  client.on("ready", async () => {
    client.user.setActivity({
      name: "The Holy Servers!",
      type: "WATCHING"
    });

    setInterval(() => {
      client.user.setActivity({
        name: "All Servers!",
        type: "WATCHING"
      });
      setTimeout(() => {
        client.user.setActivity({
          name: "Servers!",
          type: "WATCHING"
        });
      }, 5 * 1000);
    }, 10 * 1000);

    const serverChannel = client.channels.cache.get(process.env.CHANNEL_ID);

    if (serverChannel) {
      await serverChannel.messages.fetch({ limit: 100 }).then(messages => {
        serverChannel.bulkDelete(messages);
      });

      const msg = await serverChannel.send("serverList");

      setTimeout(() => {
        setInterval(() => {
          let staffTotalCount = 0;
          let patientTotalCount = 0;
          let wardTotalCount = 0;
          let list = "";

          for (let i = 1; i < servers.length; i += 1) {
            if (servers[i] !== null) {
              const needNurse = servers[i].NeedNurse;
              let addon = "";

              if (needNurse === true) {
                addon = "[!]";
              }

              wardTotalCount += 1;
              patientTotalCount += servers[i].Players;
              staffTotalCount += servers[i].Nurses;
              list += `     ${servers[i].Nurses}                      ${servers[i].Players}               ${servers[i].Name} [${toHHMMSS(servers[i].GameTime)}] ${addon}\n`;
            }
          }

          msg.edit("```\n  Staff (" + staffTotalCount + ")            Patients (" + patientTotalCount + ")             Wards (" + wardTotalCount + ")           \n-------------        ---------------       -------------------\n" + list + "```");
        }, 10 * 1000);
      }, 1 * 1000);
    }
  });
}

module.exports = { start, servers };