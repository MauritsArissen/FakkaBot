import { yellow } from "colorette";
import { Bot } from "../client";
import LevelHelper from "../util/LevelHelper";
import Logger from "../util/Logger";

export default {
  name: "ready",
  once: true,
  execute(client: Bot) {
    this.loop(client);
  },
  async loop(client: Bot) {
    const guilds = await client.guilds.cache;
    guilds.forEach(async (guild) => {
      const members = await guild.members.cache.filter(
        (member) =>
          member.voice.channel != null &&
          member.voice.channelId != guild.afkChannelId &&
          member.voice.channel.members.size > 1 &&
          !member.voice.selfMute &&
          !member.user.bot
      );
      members.forEach((m) => {
        const xp = Math.round(Math.random() * 10 + 20);
        Logger.log(
          `VoiceActivityXp check event: Adding ${yellow(
            xp + " xp"
          )} to ${yellow(m.user.tag)}`,
          "EVENT"
        );
        LevelHelper.addXp(m.id, xp, 2 * 60);
      });
    });
    setTimeout(() => this.loop(client), 10 * 1000);
  },
};
