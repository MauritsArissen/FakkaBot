import { yellow } from "colorette";
import { Message } from "discord.js";
import Container from "typedi";
import { Bot } from "../client";
import LevelHelper from "../util/LevelHelper";
import Logger from "../util/Logger";

export default {
  name: "messageCreate",
  once: false,
  async execute(message: Message) {
    if (message.author.bot) return;
    const client: Bot = Container.get("client");
    if (
      !client.xpCooldown.has(message.author.id) ||
      client.xpCooldown.get(message.author.id) < Date.now()
    ) {
      const xp = Math.round(Math.random() * 10 + 15);
      Logger.log(
        `MessageCreateXp check event: Adding ${yellow(xp + " xp")} to ${yellow(
          message.author.tag
        )}`,
        "EVENT"
      );
      LevelHelper.addXp(message.author.id, xp, 60);
    }
  },
};
