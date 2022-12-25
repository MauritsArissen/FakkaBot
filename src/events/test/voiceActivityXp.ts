import { Bot } from "../client";
import LevelHelper from "../util/LevelHelper";

export default {
  name: "ready",
  once: true,
  execute(client: Bot) {
    this.loop(client)
  },
  async loop(client: Bot) {
    const guilds = await client.guilds.cache;
    guilds.forEach(async guild => {
        const members = await guild.members.cache.filter(member => member.voice.channel != null && 
                                                         member.voice.channelId != guild.afkChannelId &&
                                                         member.voice.channel.members.size > 1 &&
                                                         !member.voice.selfMute &&
                                                         !member.user.bot);
        members.forEach(m => LevelHelper.addXp(m.id, Math.round(Math.random()*10+20), 2 * 60));
    });
    setTimeout(() => this.loop(client), 10 * 1000);
  }
};